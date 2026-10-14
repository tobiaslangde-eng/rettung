import { CASES, MedCase } from '../data/cases';
import { VITAL_BY_ID, VitalId, rateVital } from '../data/vitals';
import { Progress } from './storage';

/**
 * „Detektiv-Akten“ – der Diagnose-Krimi.
 * Jede Akte ist ein Fall, von dem anfangs nur die Meldung der Leitstelle bekannt ist. Hinweise aufdecken kostet
 * Punkte – wer die Diagnose mit wenigen Hinweisen erkennt, bekommt am meisten.
 */

/** Akten pro Ermittlung */
export const DETECTIVE_ROUNDS = 5;
/** Belohnung, mit der jede Akte startet */
export const AKTE_START = 50;
/** Kosten je aufgedecktem Hinweis */
export const CLUE_COST = 5;
/** Abzug für einen falschen Verdacht (danach ist nur noch ein Versuch übrig) */
export const WRONG_COST = 15;
/** Mindestbelohnung für eine gelöste Akte */
export const AKTE_MIN = 5;
/** Extra für eine Lösung mit höchstens einem aufgedeckten Hinweis */
export const GENIUS_BONUS = 15;
/** Extra, wenn eine Akte zum ersten Mal ins Archiv kommt */
export const NEW_AKTE_BONUS = 10;
/** Versuche je Akte */
export const MAX_GUESSES = 2;

export type ClueKind = 'person' | 'fundort' | 'aussage' | 'befund' | 'messwert';

export interface Clue {
  kind: ClueKind;
  icon: string;
  label: string;
  text: string;
}

export interface Akte {
  medCase: MedCase;
  clues: Clue[];
  /** Vier Verdachtsdiagnosen in zufälliger Reihenfolge */
  options: string[];
}

/** Stand im Archiv: 1 = gelöst, 2 = Meisterlösung (Geniestreich ohne Fehlversuch) */
export type ArchiveStamp = 1 | 2;

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function vitalText(id: VitalId, c: MedCase): string {
  const def = VITAL_BY_ID[id];
  const v = c.vitals[id];
  if (typeof v === 'string') return `${def.name}: ${v}`;
  const value = Array.isArray(v) ? `${v[0]}/${v[1]}` : String(v).replace('.', ',');
  const r = rateVital(id, v, c.patient.age);
  const arrow = r === 'hoch' ? ' ↑' : r === 'niedrig' ? ' ↓' : '';
  return `${def.name}: ${value} ${def.unit}${arrow}`.trim();
}

/** Hinweise einer Akte – vom allgemeinen zum verräterischen. */
export function cluesFor(c: MedCase): Clue[] {
  const sex = c.patient.sex === 'm' ? 'männlich' : 'weiblich';
  const age = c.patient.age === 0 ? 'unter 1 Jahr' : `${c.patient.age} ${c.patient.age === 1 ? 'Jahr' : 'Jahre'}`;
  const clues: Clue[] = [
    { kind: 'person', icon: '👤', label: 'Person', text: `${c.patient.name}, ${age}, ${sex}` },
    { kind: 'fundort', icon: '📍', label: 'Fundort', text: c.scene },
  ];
  c.anamnese.slice(0, 3).forEach((a, i) => clues.push({ kind: 'aussage', icon: '🗣️', label: `Aussage ${i + 1}`, text: a }));
  if (c.befund.length > 0) clues.push({ kind: 'befund', icon: '👁️', label: 'Befund', text: c.befund.join(' · ') });
  // Auffällige Messwerte zuerst aus den wichtigen Werten des Falls, höchstens zwei
  const isAbnormal = (id: VitalId) => {
    const v = c.vitals[id];
    return typeof v === 'string' ? !/Sinusrhythmus|unauffällig/i.test(v) : rateVital(id, v, c.patient.age) !== 'normal';
  };
  const all = Object.keys(c.vitals) as VitalId[];
  const abnormal = [...c.keyVitals.filter(isAbnormal), ...all.filter((id) => !c.keyVitals.includes(id) && isAbnormal(id))];
  // Ohne auffällige Werte ist auch ein unauffälliger wichtiger Wert ein Hinweis (z. B. beim Knochenbruch)
  const shown = abnormal.length > 0 ? abnormal : c.keyVitals.slice(0, 1);
  shown.slice(0, 2).forEach((id) => clues.push({ kind: 'messwert', icon: '🩺', label: 'Messwert', text: vitalText(id, c) }));
  return clues;
}

/** Wählt Akten für eine Ermittlung – bevorzugt solche, die noch nicht im Archiv sind. */
export function makeInvestigation(p: Progress, rnd: () => number = Math.random): Akte[] {
  const open = shuffle(
    CASES.filter((c) => !p.detectiveSolved[c.id]),
    rnd,
  );
  const rest = shuffle(
    CASES.filter((c) => p.detectiveSolved[c.id]),
    rnd,
  );
  return [...open, ...rest].slice(0, DETECTIVE_ROUNDS).map((c) => ({
    medCase: c,
    clues: cluesFor(c),
    options: shuffle([c.diagnosis, ...c.distractors], rnd),
  }));
}

/** Combo-Multiplikator: jede weitere gelöste Akte in Folge +0,25, höchstens ×2 */
export function comboFactor(combo: number): number {
  return Math.min(2, 1 + 0.25 * Math.max(0, combo - 1));
}

export interface AkteResult {
  solved: boolean;
  cluesUsed: number;
  wrong: number;
  /** Punkte vor Combo */
  base: number;
  genius: boolean;
  combo: number;
  factor: number;
  newInArchive: boolean;
  points: number;
}

/**
 * Wertet eine Akte aus.
 * @param combo Anzahl gelöster Akten in Folge inklusive dieser
 */
export function scoreAkte(opts: {
  solved: boolean;
  cluesUsed: number;
  wrong: number;
  combo: number;
  newInArchive: boolean;
}): AkteResult {
  const { solved, cluesUsed, wrong, combo, newInArchive } = opts;
  if (!solved) return { solved, cluesUsed, wrong, base: 0, genius: false, combo: 0, factor: 1, newInArchive: false, points: 0 };
  const base = Math.max(AKTE_MIN, AKTE_START - cluesUsed * CLUE_COST - wrong * WRONG_COST);
  const genius = cluesUsed <= 1 && wrong === 0;
  const factor = comboFactor(combo);
  const points = Math.round((base + (genius ? GENIUS_BONUS : 0)) * factor) + (newInArchive ? NEW_AKTE_BONUS : 0);
  return { solved, cluesUsed, wrong, base, genius, combo, factor, newInArchive, points };
}

/** Stempel fürs Archiv: Meisterlösung nur bei Geniestreich */
export function stampFor(r: AkteResult): ArchiveStamp | 0 {
  return !r.solved ? 0 : r.genius ? 2 : 1;
}

/** Detektiv-Ränge nach Anzahl gelöster Akten im Archiv */
export const DETECTIVE_GRADES = [
  { min: 0, title: 'Anwärter/in', icon: '🕵️' },
  { min: 3, title: 'Spürnase', icon: '👃' },
  { min: 8, title: 'Ermittler/in', icon: '🔎' },
  { min: 15, title: 'Kommissar/in', icon: '🎖️' },
  { min: 22, title: 'Hauptkommissar/in', icon: '🏅' },
  { min: CASES.length, title: 'Meisterdetektiv/in', icon: '👑' },
];

export function archiveCount(p: Progress) {
  const values = Object.values(p.detectiveSolved);
  return { solved: values.length, master: values.filter((v) => v === 2).length, total: CASES.length };
}

export function detectiveGrade(p: Progress) {
  const { solved } = archiveCount(p);
  let i = 0;
  DETECTIVE_GRADES.forEach((g, k) => {
    if (solved >= g.min) i = k;
  });
  return { grade: DETECTIVE_GRADES[i], next: DETECTIVE_GRADES[i + 1], index: i };
}

/** Trägt Stempel ins Archiv ein (ein besserer Stempel ersetzt einen schlechteren). */
export function mergeArchive(archive: Record<string, ArchiveStamp>, stamps: Record<string, ArchiveStamp | 0>) {
  const next = { ...archive };
  for (const [id, s] of Object.entries(stamps)) {
    if (s > 0 && s > (next[id] ?? 0)) next[id] = s as ArchiveStamp;
  }
  return next;
}
