import { Platform } from 'react-native';

/**
 * Besucherzählung nur für die öffentliche Web-Version.
 * – GoatCounter: ohne Cookies und Profile, läuft sofort.
 * – Matomo: lädt erst, wenn der Besucher im Einwilligungs-Dialog (Usercentrics) zugestimmt hat.
 * Leer lassen, um den jeweiligen Dienst auszuschalten.
 */
const GOATCOUNTER_NAME = 'einsatz112';
const MATOMO_CONTAINER = 'https://cdn.matomo.cloud/tankard.matomo.cloud/container_ms2Pb8UE.js';
const USERCENTRICS_ID = 'hlPVhzX9f0-cjo';
/** Gezählt wird nur auf der echten Seite – nicht in der Vorschau, in Apps oder lokal */
const HOSTS = ['rettung.tankard.de'];

type GC = { count?: (v: { path: string; title?: string; event?: boolean }) => void };
type Dienst = { id?: string; name?: string; consent?: { status?: boolean } };
type UC = {
  isInitialized?: () => boolean;
  getServicesBaseInfo?: () => Dienst[] | Promise<Dienst[]>;
  showSecondLayer?: () => void;
};
type Fenster = { _paq?: unknown[]; _mtm?: unknown[]; goatcounter?: GC; UC_UI?: UC };
const fenster = () => globalThis as unknown as Fenster;

let aktiv = false;
const gcPuffer: string[] = [];
let matomoGestartet = false;
const PUFFER_MAX = 60;

export function startAnalytics(): void {
  if (aktiv || Platform.OS !== 'web' || typeof document === 'undefined') return;
  if ((globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true) return;
  if (!HOSTS.includes(location.hostname)) return;
  // „Do Not Track“ im Browser wird respektiert
  if (navigator.doNotTrack === '1') return;
  aktiv = true;
  if (GOATCOUNTER_NAME) starteGoatCounter();
  if (MATOMO_CONTAINER) {
    ladeEinwilligung();
    pruefeEinwilligung();
  }
  merkeBesucher();
  messeSpielzeit();
}

function skript(src: string, setze?: (s: HTMLScriptElement) => void): HTMLScriptElement {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  setze?.(s);
  document.head.appendChild(s);
  return s;
}

function starteGoatCounter(): void {
  skript('https://gc.zgo.at/count.js', (s) => {
    s.dataset.goatcounter = `https://${GOATCOUNTER_NAME}.goatcounter.com/count`;
    s.onload = () => gcPuffer.splice(0).forEach(zaehleGoatCounter);
  });
}

/** Einwilligungs-Dialog (Usercentrics) laden */
function ladeEinwilligung(): void {
  if (!USERCENTRICS_ID) return;
  skript('https://app.usercentrics.eu/browser-ui/latest/loader.js', (s) => {
    s.id = 'usercentrics-cmp';
    s.dataset.settingsId = USERCENTRICS_ID;
  });
}

/**
 * Wartet, bis der Besucher im Dialog zugestimmt hat. Der Dienst im Dialog muss „Matomo“ im Namen haben.
 * Ohne Dialog (z. B. blockiert) wird Matomo nicht geladen.
 */
function pruefeEinwilligung(): void {
  const timer = setInterval(() => {
    const uc = fenster().UC_UI;
    if (!uc?.isInitialized?.() || !uc.getServicesBaseInfo) return;
    Promise.resolve(uc.getServicesBaseInfo())
      .then((liste) => {
        for (const d of liste ?? []) {
          if (d?.consent?.status !== true) continue;
          const name = d.name ?? '';
          if (MATOMO_CONTAINER && /matomo/i.test(name)) starteMatomo();
        }
        if (matomoGestartet) clearInterval(timer);
      })
      .catch(() => undefined);
  }, 3000);
}

function starteMatomo(): void {
  if (matomoGestartet) return;
  matomoGestartet = true;
  const w = fenster();
  (w._mtm = w._mtm || []).push({ 'mtm.startTime': Date.now(), event: 'mtm.Start' });
  skript(MATOMO_CONTAINER);
  matomoPuffer.splice(0).forEach(zaehleMatomo);
}
const matomoPuffer: string[] = [];

/** Dialog „Datenschutz-Einstellungen“ erneut öffnen (um Einwilligungen zu ändern oder zu widerrufen) */
export function zeigeDatenschutzEinstellungen(): boolean {
  const uc = fenster().UC_UI;
  if (!uc?.showSecondLayer) return false;
  uc.showSecondLayer();
  return true;
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
  const g = fenster().goatcounter;
  if (g?.count) g.count({ path: ereignis, title: ereignis, event: true });
  else gcPuffer.push(ereignis);
}

function zaehleMatomo(ereignis: string): void {
  const w = fenster();
  (w._paq = w._paq || []).push(['trackEvent', 'Spiel', ereignis]);
  (w._mtm = w._mtm || []).push({ event: ereignis });
}

const nachPuffern = (liste: string[], e: string) => {
  if (liste.length < PUFFER_MAX) liste.push(e);
};

/** Ein Ereignis zählen, z. B. 'einsatz-gestartet' */
export function zaehle(ereignis: string): void {
  if (!aktiv) return;
  if (GOATCOUNTER_NAME) zaehleGoatCounter(ereignis);
  if (MATOMO_CONTAINER) {
    if (matomoGestartet) zaehleMatomo(ereignis);
    else nachPuffern(matomoPuffer, ereignis);
  }
}
