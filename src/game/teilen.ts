import { Platform, Share } from 'react-native';

/** Urkunde als PNG teilen oder speichern (Web); sonst als Text teilen */
export const teileUrkunde = (svg: string, dateiname: string, titel: string) => teileBild(svg, dateiname, titel, 1600, 1132);

/** Beliebiges SVG-Bild als PNG teilen oder speichern (Web); sonst als Text teilen */
export async function teileBild(
  svg: string,
  dateiname: string,
  titel: string,
  breite: number,
  hoehe: number,
): Promise<'geteilt' | 'gespeichert' | 'abgebrochen'> {
  if (Platform.OS !== 'web') {
    try {
      await Share.share({ message: `${titel} – gespielt in Einsatz 112: https://rettung.tankard.de` });
      return 'geteilt';
    } catch {
      return 'abgebrochen';
    }
  }
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new Image();
  await new Promise<void>((ok, fehler) => {
    img.onload = () => ok();
    img.onerror = () => fehler(new Error('Bild konnte nicht gezeichnet werden'));
    img.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = breite;
  canvas.height = hoehe;
  const g = canvas.getContext('2d');
  if (!g) return 'abgebrochen';
  g.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob | null = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  if (!blob) return 'abgebrochen';
  const datei = new File([blob], dateiname, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [datei] })) {
    try {
      await nav.share({ files: [datei], title: titel });
      return 'geteilt';
    } catch {
      return 'abgebrochen';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return 'gespeichert';
}

/** Link mit Text teilen (Teilen-Menü) oder in die Zwischenablage kopieren */
export async function teileLink(text: string, url: string, titel: string): Promise<'geteilt' | 'kopiert' | 'abgebrochen'> {
  if (Platform.OS !== 'web') {
    try {
      await Share.share({ message: `${text} ${url}` });
      return 'geteilt';
    } catch {
      return 'abgebrochen';
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: titel, text, url });
      return 'geteilt';
    } catch {
      return 'abgebrochen';
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return 'kopiert';
  } catch {
    return 'abgebrochen';
  }
}
