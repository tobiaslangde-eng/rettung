import { Platform } from 'react-native';

/** Wo läuft die Seite? Manche Browser behalten den Spielstand nicht (z. B. der Browser in Instagram oder Facebook). */
export const SEITE = 'https://rettung.tankard.de/';

const web = () => Platform.OS === 'web' && typeof navigator !== 'undefined';

/** Name der App, wenn die Seite in deren eingebautem Browser geöffnet wurde; sonst null */
export function inAppBrowser(): string | null {
  if (!web()) return null;
  const ua = navigator.userAgent;
  const bekannt: [RegExp, string][] = [
    [/Instagram/i, 'Instagram'],
    [/FBAN|FBAV|FB_IAB|FBIOS/i, 'Facebook'],
    [/TikTok|musical_ly|BytedanceWebview|Bytedance/i, 'TikTok'],
    [/Snapchat/i, 'Snapchat'],
    [/LinkedInApp/i, 'LinkedIn'],
    [/Pinterest/i, 'Pinterest'],
    [/\bLine\//i, 'LINE'],
    [/Twitter|TwitterAndroid/i, 'X (Twitter)'],
  ];
  for (const [re, name] of bekannt) if (re.test(ua)) return name;
  // iPhone/iPad ohne „Safari“ im Browser-Namen und nicht als App auf dem Home-Bildschirm: eingebauter Browser einer App
  const ios = /iPhone|iPad|iPod/.test(ua);
  if (ios && !/Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua) && !istInstalliert()) return 'einer App';
  // Android-WebView
  if (/Android/.test(ua) && /; wv\)/.test(ua)) return 'einer App';
  return null;
}

/** Als App auf dem Home-Bildschirm gestartet? (Dort bleibt der Spielstand dauerhaft erhalten.) */
export function istInstalliert(): boolean {
  if (!web()) return false;
  try {
    return (
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  } catch {
    return false;
  }
}

/** Kann der Browser überhaupt etwas speichern? (Schlägt z. B. in manchen privaten Fenstern fehl.) */
export function speicherFunktioniert(): boolean {
  if (!web()) return true;
  try {
    const k = 'e112.speichertest';
    localStorage.setItem(k, '1');
    const ok = localStorage.getItem(k) === '1';
    localStorage.removeItem(k);
    return ok;
  } catch {
    return false;
  }
}

/** Bittet den Browser, den Spielstand nicht von selbst zu löschen (wird nicht von jedem Browser erfüllt) */
export function bitteUmDauerhaftenSpeicher(): void {
  if (!web()) return;
  try {
    navigator.storage?.persist?.().catch(() => {});
  } catch {
    // egal
  }
}

const NACH_KEY = 'e112.sichern.bis';

/** Soll gerade der Hinweis „Spielstand sichern“ gezeigt werden? */
export function sichernHinweisFaellig(): boolean {
  if (!web() || istInstalliert()) return false;
  try {
    return Date.now() > Number(localStorage.getItem(NACH_KEY) ?? 0);
  } catch {
    return false;
  }
}

/** Hinweis für die nächsten Tage ausblenden */
export function sichernHinweisSpaeter(tage = 14): void {
  try {
    localStorage.setItem(NACH_KEY, String(Date.now() + tage * 86400000));
  } catch {
    // egal
  }
}
