import { Platform } from 'react-native';

/** Anzeige-Einstellungen der Web-Version: dunkler Modus und größere Darstellung */
const SCHLUESSEL = 'e112.darstellung';

export interface Darstellung {
  dunkel: boolean;
  /** 100, 115 oder 130 (Prozent) */
  zoom: 100 | 115 | 130;
}

export const ZOOMSTUFEN: Darstellung['zoom'][] = [100, 115, 130];

export function ladeDarstellung(): Darstellung {
  const standard: Darstellung = { dunkel: false, zoom: 100 };
  if (Platform.OS !== 'web') return standard;
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return standard;
    const d = JSON.parse(roh);
    return { dunkel: d.dunkel === true, zoom: ZOOMSTUFEN.includes(d.zoom) ? d.zoom : 100 };
  } catch {
    return standard;
  }
}

/** Wendet die Einstellung auf die Seite an (nur Web) */
export function wendeDarstellungAn(d: Darstellung) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  let stil = document.getElementById('e112-darstellung') as HTMLStyleElement | null;
  if (!stil) {
    stil = document.createElement('style');
    stil.id = 'e112-darstellung';
    document.head.appendChild(stil);
  }
  const dunkel = d.dunkel
    ? 'html{background:#fff;filter:invert(1) hue-rotate(180deg);}' +
      'img,video,canvas{filter:invert(1) hue-rotate(180deg);}' +
      'html{color-scheme:dark;}'
    : '';
  const zoom = d.zoom !== 100 ? `#root{zoom:${d.zoom / 100};}` : '';
  stil.textContent = dunkel + zoom;
}

export function speichereDarstellung(d: Darstellung) {
  wendeDarstellungAn(d);
  if (Platform.OS !== 'web') return;
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(d));
  } catch {
    /* ohne Speicher gilt die Einstellung nur bis zum Neuladen */
  }
}
