import { Platform } from 'react-native';

/**
 * Anonyme Besucherzählung nur für die öffentliche Web-Version (GoatCounter: ohne Cookies, ohne Profile).
 * Der Name des eigenen GoatCounter-Kontos kommt hierhin (z. B. 'einsatz112' → einsatz112.goatcounter.com).
 * Solange er leer ist, wird nichts gezählt und nichts geladen.
 */
const GOATCOUNTER_NAME = 'einsatz112';
/** Gezählt wird nur auf der echten Seite – nicht in der Vorschau, in Apps oder lokal */
const HOSTS = ['rettung.tankard.de'];

type GC = { count?: (v: { path: string; title?: string; event?: boolean }) => void };
const gc = () => (globalThis as { goatcounter?: GC }).goatcounter;
let aktiv = false;
const warteschlange: string[] = [];

export function startAnalytics(): void {
  if (aktiv || !GOATCOUNTER_NAME || Platform.OS !== 'web' || typeof document === 'undefined') return;
  if ((globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true) return;
  if (!HOSTS.includes(location.hostname)) return;
  // „Do Not Track“ im Browser wird respektiert
  if (navigator.doNotTrack === '1') return;
  aktiv = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${GOATCOUNTER_NAME}.goatcounter.com/count`;
  s.onload = () => warteschlange.splice(0).forEach(zaehle);
  document.head.appendChild(s);
}

/** Ein Ereignis zählen, z. B. 'einsatz-gestartet' (erscheint im GoatCounter unter „Events“) */
export function zaehle(ereignis: string): void {
  if (!aktiv) return;
  const g = gc();
  if (g?.count) g.count({ path: ereignis, title: ereignis, event: true });
  else warteschlange.push(ereignis);
}
