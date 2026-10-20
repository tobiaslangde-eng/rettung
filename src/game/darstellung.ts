import { Platform } from 'react-native';

/** Anzeige-Einstellungen der Web-Version: Farbmodus (hell, dunkel, automatisch) und größere Darstellung */
const SCHLUESSEL = 'e112.darstellung';

export type Farbmodus = 'hell' | 'dunkel' | 'auto';

export interface Darstellung {
  modus: Farbmodus;
  /** 100, 115 oder 130 (Prozent) */
  zoom: 100 | 115 | 130;
}

export const ZOOMSTUFEN: Darstellung['zoom'][] = [100, 115, 130];

export function ladeDarstellung(): Darstellung {
  const standard: Darstellung = { modus: 'auto', zoom: 100 };
  if (Platform.OS !== 'web') return standard;
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return standard;
    const d = JSON.parse(roh);
    // ältere Version kannte nur „dunkel: ja/nein“
    const modus: Farbmodus = d.modus === 'hell' || d.modus === 'dunkel' || d.modus === 'auto' ? d.modus : d.dunkel ? 'dunkel' : 'hell';
    return { modus, zoom: ZOOMSTUFEN.includes(d.zoom) ? d.zoom : 100 };
  } catch {
    return standard;
  }
}

/** Soll dunkel gezeichnet werden? (Bei „automatisch“ entscheidet das Gerät) */
export function istDunkel(): boolean {
  if (Platform.OS !== 'web') return false;
  const { modus } = ladeDarstellung();
  if (modus !== 'auto') return modus === 'dunkel';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

/** Wendet die Größe auf die Seite an (nur Web); die Farben gelten beim Start */
export function wendeDarstellungAn(d: Darstellung) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  let stil = document.getElementById('e112-darstellung') as HTMLStyleElement | null;
  if (!stil) {
    stil = document.createElement('style');
    stil.id = 'e112-darstellung';
    document.head.appendChild(stil);
  }
  stil.textContent = d.zoom !== 100 ? `#root{zoom:${d.zoom / 100};}` : '';
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
