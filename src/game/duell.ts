import { Platform } from 'react-native';
import { HELFER_FRAGEN } from '../data/helferFragen';
import { HELFER_FRAGEN_2 } from '../data/helferFragen2';
import { QUESTIONS } from '../data/questions';
import { Rolle } from './rolle';

/** Duell mit Freunden: Alle bekommen mit demselben Code dieselben 5 Fragen. Der Link trägt den Punktestand der Herausforderer – ohne Server. */
export const DUELL_FRAGEN = 5;
export const DUELL_URL = 'https://rettung.tankard.de/';

export interface DuellEinladung {
  code: string;
  rolle: Rolle;
  name: string;
  richtig: number;
}

export interface DuellFrage {
  id: string;
  kopf: string;
  optionen: [string, string, string, string];
  /** Index der richtigen Antwort in `optionen` */
  richtig: number;
  erklaerung: string;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
function mische<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function neuerCode(): string {
  const z = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 6 }, () => z[Math.floor(Math.random() * z.length)]).join('');
}

/** Dieselben Fragen für denselben Code und dieselbe Rolle (auf jedem Gerät gleich) */
export function duellFragen(code: string, rolle: Rolle): DuellFrage[] {
  const pool = rolle === 'helfer' ? [...HELFER_FRAGEN, ...HELFER_FRAGEN_2] : QUESTIONS;
  const rnd = mulberry32(hash(code + rolle));
  return mische(pool, rnd)
    .slice(0, DUELL_FRAGEN)
    .map((q) => {
      const idx = mische([0, 1, 2, 3], rnd);
      return {
        id: q.id,
        kopf: q.question,
        optionen: idx.map((i) => q.answers[i]) as [string, string, string, string],
        richtig: idx.indexOf(0),
        erklaerung: q.explanation,
      };
    });
}

/** Zufällige Fragen aus dem Fragenschatz der Rolle (für die Live-Runde): richtige Antwort steht an beliebiger Stelle */
export function zufallsFragen(rolle: Rolle, anzahl: number): DuellFrage[] {
  const pool = rolle === 'helfer' ? [...HELFER_FRAGEN, ...HELFER_FRAGEN_2] : QUESTIONS;
  return mische(pool, Math.random)
    .slice(0, anzahl)
    .map((q) => {
      const idx = mische([0, 1, 2, 3], Math.random);
      return {
        id: q.id,
        kopf: q.question,
        optionen: idx.map((i) => q.answers[i]) as [string, string, string, string],
        richtig: idx.indexOf(0),
        erklaerung: q.explanation,
      };
    });
}

const saeubern = (n: string) =>
  n
    .replace(/[^\p{L}\p{N} .\-]/gu, '')
    .trim()
    .slice(0, 18);

export function duellLink(code: string, rolle: Rolle, name: string, richtig: number): string {
  const n = saeubern(name);
  return `${DUELL_URL}?duell=${code}&r=${rolle === 'helfer' ? 'h' : 's'}&p=${richtig}${n ? `&n=${encodeURIComponent(n)}` : ''}`;
}

/** Liest eine Einladung aus der Adresse (nur Web); null, wenn keine oder eine ungültige da ist */
export function leseEinladung(): DuellEinladung | null {
  if (Platform.OS !== 'web' || typeof location === 'undefined') return null;
  try {
    const q = new URLSearchParams(location.search);
    const code = q.get('duell') ?? '';
    const r = q.get('r');
    const p = Number(q.get('p'));
    if (!/^[a-z0-9]{4,10}$/.test(code) || (r !== 'h' && r !== 's') || !Number.isInteger(p) || p < 0 || p > DUELL_FRAGEN)
      return null;
    return { code, rolle: r === 'h' ? 'helfer' : 'sani', name: saeubern(q.get('n') ?? ''), richtig: p };
  } catch {
    return null;
  }
}

/** Entfernt die Einladung aus der Adresszeile (damit ein Neuladen nicht wieder ein Duell öffnet) */
export function loescheEinladung(): void {
  try {
    if (Platform.OS === 'web') history.replaceState(null, '', location.pathname);
  } catch {
    // egal
  }
}
