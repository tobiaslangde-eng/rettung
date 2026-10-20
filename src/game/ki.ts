import { Platform } from 'react-native';
import { Rolle } from './rolle';

/**
 * Adresse des KI-Servers für „Frag Kati“ (siehe docs/ki-server/ANLEITUNG.md).
 * Leer = keine KI: Kati antwortet dann nur aus den Inhalten der App.
 * Zum Ausprobieren kann in der Web-Version `localStorage['e112.ki.url']` gesetzt werden.
 */
export const KI_URL = '';

export const kiUrl = (): string => {
  if (Platform.OS === 'web') {
    try {
      const test = localStorage.getItem('e112.ki.url');
      if (test) return test;
    } catch {
      // egal
    }
  }
  return KI_URL;
};

export const kiVerfuegbar = (): boolean => kiUrl().length > 0;

export interface KiNachricht {
  rolle: 'du' | 'kati';
  text: string;
}

/** Ein Artikel aus dem App-Wissen, auf den sich die KI stützen darf */
export interface KiKontext {
  titel: string;
  text: string;
}

export type KiFehler = 'ausgelastet' | 'zu-viele' | 'tageslimit' | 'abgelehnt' | 'netz' | 'dienst';

export type KiErgebnis = { ok: true; antwort: string; gekuerzt: boolean } | { ok: false; fehler: KiFehler };

/** Texte für den Fall, dass die KI nicht antwortet */
export const KI_FEHLERTEXT: Record<KiFehler, string> = {
  ausgelastet: 'Die KI ist gerade stark ausgelastet.',
  'zu-viele': 'Du hast in kurzer Zeit viele Fragen gestellt. Warte ein paar Minuten.',
  tageslimit: 'Für heute sind alle KI-Fragen aufgebraucht. Morgen geht es weiter.',
  abgelehnt: 'Dazu kann ich leider keine Antwort geben.',
  netz: 'Die KI ist gerade nicht erreichbar.',
  dienst: 'Die KI ist gerade nicht erreichbar.',
};

/** Stellt eine Frage an die KI (über den eigenen Server, der den Schlüssel verwahrt) */
export async function frageKi(verlauf: KiNachricht[], rolle: Rolle, kontext: KiKontext[] = []): Promise<KiErgebnis> {
  const url = kiUrl();
  if (!url) return { ok: false, fehler: 'dienst' };
  const abbruch = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const frist = setTimeout(() => abbruch?.abort(), 60000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rolle, verlauf, kontext }),
      signal: abbruch?.signal,
    });
    const daten = await res.json().catch(() => ({}));
    if (res.status === 429) return { ok: false, fehler: daten.fehler === 'tageslimit' ? 'tageslimit' : 'zu-viele' };
    if (res.status === 503) return { ok: false, fehler: 'ausgelastet' };
    if (daten.fehler === 'abgelehnt') return { ok: false, fehler: 'abgelehnt' };
    if (!res.ok || typeof daten.antwort !== 'string') return { ok: false, fehler: 'dienst' };
    return { ok: true, antwort: daten.antwort, gekuerzt: !!daten.gekuerzt };
  } catch {
    return { ok: false, fehler: 'netz' };
  } finally {
    clearTimeout(frist);
  }
}
