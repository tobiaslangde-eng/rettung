import { Platform, Share } from 'react-native';

/** Urkunde als PNG teilen oder speichern (Web); sonst als Text teilen */
export async function teileUrkunde(
  svg: string,
  dateiname: string,
  titel: string,
): Promise<'geteilt' | 'gespeichert' | 'abgebrochen'> {
  if (Platform.OS !== 'web') {
    try {
      await Share.share({ message: `Meine Urkunde in Einsatz 112: ${titel}` });
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
  canvas.width = 1600;
  canvas.height = 1132;
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
