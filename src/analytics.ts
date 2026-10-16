import { Platform } from 'react-native';

/**
 * Anonyme Besucherzählung nur für die öffentliche Web-Version (GoatCounter, Matomo und Google Analytics).
 * Der Name des eigenen GoatCounter-Kontos kommt hierhin (z. B. 'einsatz112' → einsatz112.goatcounter.com).
 * Solange er leer ist, wird nichts gezählt und nichts geladen.
 */
const GOATCOUNTER_NAME = 'einsatz112';
/**
 * Zusätzlich Matomo (Matomo Cloud, Tag Manager). Leer lassen, um Matomo auszuschalten.
 * Der Container (Tags und Auslöser) wird im Matomo-Konto verwaltet.
 */
const MATOMO_CONTAINER = 'https://cdn.matomo.cloud/tankard.matomo.cloud/container_ms2Pb8UE.js';
/**
 * Zusätzlich Google Analytics 4 (Mess-ID). Leer lassen, um es auszuschalten.
 * Datensparsam eingestellt: Einwilligungsmodus „abgelehnt“ (keine Analyse-Cookies), keine Werbefunktionen.
 */
const GA_ID = 'G-PYE3LZXMRD';
/** Gezählt wird nur auf der echten Seite – nicht in der Vorschau, in Apps oder lokal */
const HOSTS = ['rettung.tankard.de'];

type GC = { count?: (v: { path: string; title?: string; event?: boolean }) => void };
const gc = () => (globalThis as { goatcounter?: GC }).goatcounter;
type Fenster = { _paq?: unknown[]; _mtm?: unknown[]; dataLayer?: unknown[] };
const fenster = () => globalThis as unknown as Fenster;
let aktiv = false;
let gtag: ((...a: unknown[]) => void) | null = null;
const warteschlange: string[] = [];

export function startAnalytics(): void {
  if (aktiv || (!GOATCOUNTER_NAME && !MATOMO_CONTAINER && !GA_ID) || Platform.OS !== 'web' || typeof document === 'undefined')
    return;
  if ((globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true) return;
  if (!HOSTS.includes(location.hostname)) return;
  // „Do Not Track“ im Browser wird respektiert
  if (navigator.doNotTrack === '1') return;
  aktiv = true;
  if (GOATCOUNTER_NAME) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${GOATCOUNTER_NAME}.goatcounter.com/count`;
    s.onload = () => warteschlange.splice(0).forEach(zaehleGoatCounter);
    document.head.appendChild(s);
  }
  if (MATOMO_CONTAINER) {
    const w = fenster();
    // Keine Cookies, falls der Container das nicht selbst festlegt (zusätzlich im Matomo-Konto einstellen)
    (w._paq = w._paq || []).push(['disableCookies']);
    (w._mtm = w._mtm || []).push({ 'mtm.startTime': Date.now(), event: 'mtm.Start' });
    const m = document.createElement('script');
    m.async = true;
    m.src = MATOMO_CONTAINER;
    document.head.appendChild(m);
  }
  if (GA_ID) {
    const w = fenster();
    w.dataLayer = w.dataLayer || [];
    const layer = w.dataLayer;
    // Google verlangt hier ein „arguments“-Objekt, kein Array
    gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      layer.push(arguments);
    };
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const g = document.createElement('script');
    g.async = true;
    g.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(g);
  }
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

function zaehleGoatCounter(ereignis: string): void {
  const g = gc();
  if (g?.count) g.count({ path: ereignis, title: ereignis, event: true });
  else warteschlange.push(ereignis);
}

/** Ein Ereignis zählen, z. B. 'einsatz-gestartet' (GoatCounter: in der Liste „Pages“ mit Zusatz „event“; Matomo: Ereignisse) */
export function zaehle(ereignis: string): void {
  if (!aktiv) return;
  if (GOATCOUNTER_NAME) zaehleGoatCounter(ereignis);
  if (MATOMO_CONTAINER) {
    const w = fenster();
    (w._paq = w._paq || []).push(['trackEvent', 'Spiel', ereignis]);
    (w._mtm = w._mtm || []).push({ event: ereignis });
  }
  // Google erlaubt in Ereignisnamen keine Bindestriche
  if (gtag) gtag('event', ereignis.replace(/-/g, '_'));
}
