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
  merkeBesucher();
  messeSpielzeit();
}

/** Neu oder wiederkehrend? Nur ein Merker im eigenen Browser (Datum des ersten Besuchs) – wird nicht übertragen. */
function merkeBesucher(): void {
  try {
    const heute = new Date().toISOString().slice(0, 10);
    const erster = localStorage.getItem('e112.erster-besuch');
    if (!erster) {
      localStorage.setItem('e112.erster-besuch', heute);
      zaehle('besucher-neu');
    } else if (erster < heute) {
      zaehle('besucher-wiederkehrend');
    }
  } catch {
    // ohne Speicher: einfach nichts zählen
  }
}

/** Aktive Spielzeit in Stufen (1, 5, 10, 20, 30, 60 Minuten): nur wenn die Seite sichtbar ist und etwas angetippt wurde */
const STUFEN = [1, 5, 10, 20, 30, 60];
function messeSpielzeit(): void {
  let aktivSek = 0;
  let zuletzt = Date.now();
  const merke = () => (zuletzt = Date.now());
  for (const e of ['pointerdown', 'keydown', 'touchstart', 'wheel']) window.addEventListener(e, merke, { passive: true });
  const gemeldet = new Set<number>();
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - zuletzt > 60000) return; // länger als eine Minute nichts getan: zählt nicht
    aktivSek += 5;
    // Lebenszeichen alle 2 Minuten aktiver Spielzeit (Anzahl pro Stunde ÷ 30 ≈ Leute, die gerade durchgehend spielen)
    if (aktivSek % 120 === 0) zaehle('online-puls');
    for (const m of STUFEN) {
      if (aktivSek >= m * 60 && !gemeldet.has(m)) {
        gemeldet.add(m);
        zaehle(`aktiv-${String(m).padStart(2, '0')}-min`);
      }
    }
  }, 5000);
}

/** Ein Ereignis zählen, z. B. 'einsatz-gestartet' (GoatCounter: in der Liste „Pages“ mit Zusatz „event“) */
export function zaehle(ereignis: string): void {
  if (!aktiv) return;
  const g = gc();
  if (g?.count) g.count({ path: ereignis, title: ereignis, event: true });
  else warteschlange.push(ereignis);
}
