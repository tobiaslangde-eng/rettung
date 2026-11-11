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
}

const START: KontoState = { geladen: false, konten: [], aktiv: null, plus: null, schranken: true, klassenCode: null };
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
