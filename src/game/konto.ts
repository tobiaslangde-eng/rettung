import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/**
 * Store-Demo: Konto, Anmeldung und „Plus“ zum Ausprobieren.
 *
 * - Nur in der Vorschau (rettung.tankard.de/vorschau/) aktiv. In der Live-Version ändert sich nichts.
 * - Es gibt KEINEN Server: Konten liegen nur auf diesem Gerät. Ein Passwort wird weder gesendet noch gespeichert.
 * - Es wird nichts bezahlt. „Plus“ ist ein Schalter zum Ausprobieren.
 * - Echte Konten mit Spielstand-Sync und echte Zahlungen bräuchten einen Server und die Stores (siehe docs/STORE-DEMO.md).
 */
const PREVIEW = (globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true;
export const STORE_DEMO = PREVIEW;
const KEY = (PREVIEW ? 'kiirabi.vorschau.' : 'kiirabi.') + 'konto.demo.v1';

/** Diese Szenarien sind ohne Plus frei (wenn die Schranken eingeschaltet sind) */
export const FREIE_SZENARIEN = ['anaphylaxie', 'asthma', 'hyperventilation'];
export const TEST_TAGE = 7;
/** Ohne Plus: so viele Einsätze pro Tag */
export const TAGES_EINSAETZE = 3;
/** Ohne Plus frei spielbare Trainings (je Rolle). Alles andere braucht Plus. */
export const FREIE_TRAININGS: Record<'sani' | 'helfer', string[]> = {
  sani: ['quiz', 'wissen', 'cpr'],
  helfer: ['notruf', 'schritte', 'wissen'],
};
/** Bildschirme, die ohne Plus gesperrt sind (Trainings außer den freien) */
const PLUS_BEREICHE: Record<string, string> = {
  detektiv: 'Detektiv-Akten',
  schritte: 'Schritte-Training',
  manv: 'Großeinsatz',
  notruf: 'Notruf üben',
  zuerst: 'Was zuerst?',
  pack: 'Gut gepackt',
  handgriffe: 'Handgriffe',
  mythen: 'Mythen-Check',
  aed: 'AED üben',
  pruefung: 'Prüfung',
  gefahr: 'Gefahren-Check',
  leitstelle: 'Leitstelle',
  fehler: 'Fehler finden',
  labor: 'Handgriff-Labor',
  quiz: 'Schnelltraining',
  wissen: 'Wissensfragen',
  cpr: 'Herzdruckmassage',
  ekg: 'EKG lesen',
  duell: 'Duell mit Freunden',
  karte: 'Stadtkarte',
  schicht: 'Schichtmodus',
  lernstand: 'Mein Lernstand',
};
export const PREISE = { jahr: '29,99 €', monat: '4,99 €' } as const;

export type PlusPlan = 'jahr' | 'monat';

export interface Konto {
  email: string;
  name: string;
  erstellt: number;
}

export interface PlusStatus {
  plan: PlusPlan;
  start: number;
  /** Ende der Testphase; null = „gekauft“ (Demo) */
  testBis: number | null;
}

export interface KontoState {
  geladen: boolean;
  /** Auf diesem Gerät angelegte Demo-Konten (nur E-Mail und Anzeigename) */
  konten: Konto[];
  /** E-Mail des angemeldeten Kontos */
  aktiv: string | null;
  plus: PlusStatus | null;
  /** Plus-Schranken im Simulator (zum Ausprobieren ein- und ausschaltbar) */
  schranken: boolean;
  klassenCode: string | null;
  /** Ersthelfer-Bereich ohne Plus unbegrenzt frei (Standard) oder ebenfalls begrenzt */
  helferFrei: boolean;
  /** Einsätze am Tag (nur Zähler) */
  einsaetze: { tag: string; n: number };
}

const START: KontoState = { geladen: false, konten: [], aktiv: null, plus: null, schranken: true, klassenCode: null, helferFrei: true, einsaetze: { tag: '', n: 0 } };
let state: KontoState = START;
const hoerer = new Set<() => void>();

function setze(next: KontoState, speichern = true) {
  state = next;
  hoerer.forEach((h) => h());
  if (speichern && STORE_DEMO) {
    const { geladen: _g, ...rest } = next;
    AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => undefined);
  }
}

export async function ladeKonto(): Promise<void> {
  if (!STORE_DEMO || state.geladen) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<KontoState>;
      setze(
        {
          geladen: true,
          konten: Array.isArray(d.konten) ? d.konten.filter((k) => k && typeof k.email === 'string') : [],
          aktiv: typeof d.aktiv === 'string' ? d.aktiv : null,
          plus: d.plus && (d.plus.plan === 'jahr' || d.plus.plan === 'monat') ? d.plus : null,
          schranken: d.schranken !== false,
          klassenCode: typeof d.klassenCode === 'string' ? d.klassenCode : null,
          helferFrei: d.helferFrei !== false,
          einsaetze: d.einsaetze && typeof d.einsaetze.tag === 'string' && typeof d.einsaetze.n === 'number' ? d.einsaetze : { tag: '', n: 0 },
        },
        false,
      );
      return;
    }
  } catch {
    // optional
  }
  setze({ ...START, geladen: true }, false);
}

export function useKontoStore(): KontoState {
  return useSyncExternalStore(
    (cb) => {
      hoerer.add(cb);
      return () => {
        hoerer.delete(cb);
      };
    },
    () => state,
    () => state,
  );
}

export function aktivesKonto(s: KontoState): Konto | null {
  return s.konten.find((k) => k.email === s.aktiv) ?? null;
}

export function istPlus(s: KontoState = state): boolean {
  const p = s.plus;
  if (!p) return false;
  return p.testBis === null || p.testBis > Date.now();
}

/** Verbleibende Tage der Testphase (null = kein Test) */
export function testRestTage(s: KontoState = state): number | null {
  const p = s.plus;
  if (!p || p.testBis === null || p.testBis <= Date.now()) return null;
  return Math.max(1, Math.ceil((p.testBis - Date.now()) / 86400000));
}

export function szenarioFrei(id: string, s: KontoState = state): boolean {
  if (!STORE_DEMO || !s.schranken) return true;
  return FREIE_SZENARIEN.includes(id) || istPlus(s);
}

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Ergebnis = { ok: true } | { ok: false; fehler: string };

/** Konto anlegen (nur auf diesem Gerät). Das Passwort wird hier bewusst gar nicht entgegengenommen. */
export function registriere(email: string, name: string): Ergebnis {
  const e = email.trim().toLowerCase();
  if (!MAIL.test(e)) return { ok: false, fehler: 'Bitte eine gültige E-Mail-Adresse eingeben.' };
  if (state.konten.some((k) => k.email === e)) return { ok: false, fehler: 'Dieses Demo-Konto gibt es schon auf diesem Gerät. Bitte anmelden.' };
  const konto: Konto = { email: e, name: name.trim() || e.split('@')[0], erstellt: Date.now() };
  setze({ ...state, konten: [...state.konten, konto], aktiv: e });
  return { ok: true };
}

export function meldeAn(email: string): Ergebnis {
  const e = email.trim().toLowerCase();
  if (!MAIL.test(e)) return { ok: false, fehler: 'Bitte eine gültige E-Mail-Adresse eingeben.' };
  if (!state.konten.some((k) => k.email === e)) {
    return { ok: false, fehler: 'Auf diesem Gerät gibt es dieses Demo-Konto noch nicht. Bitte zuerst „Konto erstellen“. (Echte Konten kämen von einem Server.)' };
  }
  setze({ ...state, aktiv: e });
  return { ok: true };
}

export function meldeAb() {
  setze({ ...state, aktiv: null });
}

/** Konto und zugehörige Demo-Daten löschen */
export function loescheKonto() {
  setze({ ...state, konten: state.konten.filter((k) => k.email !== state.aktiv), aktiv: null, klassenCode: null });
}

export function starteTest(plan: PlusPlan) {
  const jetzt = Date.now();
  setze({ ...state, plus: { plan, start: jetzt, testBis: jetzt + TEST_TAGE * 86400000 } });
}

export function kaufePlus(plan: PlusPlan) {
  setze({ ...state, plus: { plan, start: Date.now(), testBis: null } });
}

export function beendePlus() {
  setze({ ...state, plus: null });
}

export function setzeSchranken(an: boolean) {
  setze({ ...state, schranken: an });
}

/** Klassen-Code: nur Anzeige in der Demo (kein Server) */
export function setzeKlassenCode(code: string | null) {
  setze({ ...state, klassenCode: code && code.trim() ? code.trim().toUpperCase().slice(0, 12) : null });
}

function heute(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function setzeHelferFrei(frei: boolean) {
  setze({ ...state, helferFrei: frei });
}

/** Ohne Plus noch freie Einsätze heute (null = unbegrenzt) */
export function einsaetzeUebrig(s: KontoState = state, rolle: 'sani' | 'helfer' = 'sani'): number | null {
  if (!STORE_DEMO || !s.schranken || istPlus(s) || (rolle === 'helfer' && s.helferFrei)) return null;
  const n = s.einsaetze.tag === heute() ? s.einsaetze.n : 0;
  return Math.max(0, TAGES_EINSAETZE - n);
}

/** Ist dieser Bereich ohne Plus gesperrt? (für Anzeige von „🔒 Plus“) */
export function plusGesperrt(bereich: string, rolle: 'sani' | 'helfer', s: KontoState = state): boolean {
  if (!STORE_DEMO || !s.schranken || istPlus(s) || (rolle === 'helfer' && s.helferFrei)) return false;
  if (!(bereich in PLUS_BEREICHE)) return false;
  return !FREIE_TRAININGS[rolle].includes(bereich);
}

export type Zugang = { ok: true } | { ok: false; grund: string };

/**
 * Prüft den Wechsel zu einem Bildschirm. Bei „case“ und „helfer“ (Einsatz startet) wird der Tageszähler erhöht.
 * Wird in der Live-Version nie gesperrt.
 */
export function pruefeZugang(bildschirm: string, rolle: 'sani' | 'helfer'): Zugang {
  const s = state;
  if (!STORE_DEMO || !s.schranken || istPlus(s) || (rolle === 'helfer' && s.helferFrei)) return { ok: true };
  if (bildschirm === 'case' || bildschirm === 'helfer') {
    const n = s.einsaetze.tag === heute() ? s.einsaetze.n : 0;
    if (n >= TAGES_EINSAETZE) return { ok: false, grund: `Du hast heute deine ${TAGES_EINSAETZE} freien Einsätze gespielt.` };
    setze({ ...s, einsaetze: { tag: heute(), n: n + 1 } });
    return { ok: true };
  }
  if (bildschirm in PLUS_BEREICHE && !FREIE_TRAININGS[rolle].includes(bildschirm)) {
    return { ok: false, grund: `„${PLUS_BEREICHE[bildschirm]}“ gehört zu Plus.` };
  }
  return { ok: true };
}
