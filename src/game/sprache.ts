import { Platform } from 'react-native';

/** Sprachausgabe (nur Web, Browser-Stimme): Gerät und Leitstelle „sprechen“. Ein/aus wird im Browser gemerkt. */
const KEY = 'e112.ton';

export const spracheMoeglich = (): boolean =>
  Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window;

export function tonAn(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setzeTon(an: boolean): void {
  try {
    localStorage.setItem(KEY, an ? '1' : '0');
  } catch {
    // ohne Speicher: gilt nur bis zum Neuladen
  }
  if (!an) stoppe();
}

export function stoppe(): void {
  if (spracheMoeglich()) window.speechSynthesis.cancel();
}

/** Text vorlesen, wenn der Ton an ist. `geraet` = etwas tiefer und gleichmäßiger wie eine Gerätestimme. */
export function sprich(text: string, optionen?: { geraet?: boolean; aufgeregt?: boolean }): void {
  if (!spracheMoeglich() || !tonAn() || !text) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[„“"]/g, ''));
  u.lang = 'de-DE';
  const stimme = s.getVoices().find((v) => v.lang.toLowerCase().startsWith('de'));
  if (stimme) u.voice = stimme;
  u.rate = optionen?.geraet ? 0.92 : optionen?.aufgeregt ? 1.12 : 1;
  u.pitch = optionen?.geraet ? 0.7 : optionen?.aufgeregt ? 1.15 : 1;
  s.speak(u);
}
