import { AKTEN, AktenBild, BILDER, DetektivFall, KATEGORIEN, Kategorie } from '../data/akten';
import { VITAL_BY_ID, VitalId, rateVital } from '../data/vitals';
import { aktiveRolle } from './rolle';
import { Progress } from './storage';

/**
 * „Detektiv-Akten“ – der Diagnose-Krimi.
 * Jede Akte ist ein Fall, von dem anfangs nur die Meldung der Leitstelle bekannt ist. Hinweise aufdecken kostet
 * EP – wer die Diagnose mit wenigen Hinweisen erkennt, bekommt am meisten.
 * Zu jedem Krankheitsbild gibt es mehrere Akten in ganz verschiedenen Situationen (Ort, Alter, typisch oder untypisch).
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

/** Krankheitsbilder, die auch Laien erkennen können – nur diese kommen im Ersthelfer-Modus vor */
const HELFER_BILDER = new Set([
  'stemi', 'synkope', 'asthma', 'hyperventilation', 'panik', 'bolus', 'stroke', 'krampf', 'migraene', 'hypo', 'blinddarm',
  'nierenkolik', 'gastro', 'fraktur', 'sht', 'verbrennung', 'oberschenkelhals', 'sprunggelenk', 'schulterluxation', 'rippen',
  'wirbelsaeule', 'blutung', 'amputation', 'kopfplatz', 'biss', 'augen', 'verbruehung', 'ertrinken', 'strom', 'anaphylaxie',
  'hypothermie', 'hitzschlag', 'hitzeerschoepfung', 'alkohol', 'co', 'fieberkrampf', 'pseudokrupp', 'aspiration', 'exsikkose',
  'kindvergiftung', 'knopfzelle', 'geburt',
]);
const HELFER_AKTEN = AKTEN.filter((a) => HELFER_BILDER.has(a.bild) && a.difficulty < 3);

/** Akten der aktiven Rolle: Ersthelfer/innen bekommen erkennbare Bilder ohne die schwersten Fälle */
export const aktenListe = (): DetektivFall[] => (aktiveRolle() === 'helfer' ? HELFER_AKTEN : AKTEN);

export type ClueKind = 'person' | 'fundort' | 'aussage' | 'befund' | 'messwert';

export interface Clue {
  kind: ClueKind;
  icon: string;
  label: string;
  text: string;
}

export interface Akte {
  fall: DetektivFall;
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

function vitalText(id: VitalId, c: DetektivFall): string {
  const def = VITAL_BY_ID[id];
  const v = c.vitals[id];
  if (typeof v === 'string') return `${def.name}: ${v}`;
  const value = Array.isArray(v) ? `${v[0]}/${v[1]}` : String(v).replace('.', ',');
  const r = rateVital(id, v, c.patient.age);
  const arrow = r === 'hoch' ? ' ↑' : r === 'niedrig' ? ' ↓' : '';
  return `${def.name}: ${value} ${def.unit}${arrow}`.trim();
}

/** Hinweise einer Akte – vom allgemeinen zum verräterischen. */
export function cluesFor(c: DetektivFall): Clue[] {
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
  // Ersthelfer/innen haben keine Messgeräte
  if (aktiveRolle() !== 'helfer')
    shown.slice(0, 2).forEach((id) => clues.push({ kind: 'messwert', icon: '🩺', label: 'Messwert', text: vitalText(id, c) }));
  return clues;
}

/** Höchstens so viele Akten derselben Kategorie in einer Ermittlung (damit Erkrankungen und Verletzungen gemischt kommen) */
const MAX_PRO_KATEGORIE = 2;
/** Schwere Akten (Stufe 3): erst ab so vielen gelösten Akten im Archiv, und höchstens so viele pro Ermittlung */
const SCHWER_AB = 8;
const MAX_SCHWER = 2;

/**
 * Wählt Akten für eine Ermittlung:
 * - jedes Krankheitsbild höchstens einmal (sonst wäre die zweite Akte geschenkt),
 * - bevorzugt Akten, die noch nicht im Archiv sind (bei einem bekannten Krankheitsbild eine neue Situation),
 * - gemischt aus verschiedenen Kategorien, schwere Akten erst mit etwas Erfahrung.
 */
export function makeInvestigation(p: Progress, rnd: () => number = Math.random): Akte[] {
  const solvedCount = archiveCount(p).solved;
  const byBild = new Map<string, DetektivFall[]>();
  for (const a of aktenListe()) {
    if (a.difficulty === 3 && solvedCount < SCHWER_AB) continue;
    byBild.set(a.bild, [...(byBild.get(a.bild) ?? []), a]);
  }
  // Je Krankheitsbild eine Akte: eine neue, wenn es noch eine gibt
  const candidates = [...byBild.values()].map((list) => {
    const open = list.filter((a) => !p.detectiveSolved[a.id]);
    return { akte: shuffle(open.length > 0 ? open : list, rnd)[0], fresh: open.length > 0 };
  });
  const ordered = [...shuffle(candidates.filter((c) => c.fresh), rnd), ...shuffle(candidates.filter((c) => !c.fresh), rnd)];

  const chosen: DetektivFall[] = [];
  const perKategorie: Partial<Record<Kategorie, number>> = {};
  let schwer = 0;
  const take = (a: DetektivFall) => {
    chosen.push(a);
    perKategorie[a.kategorie] = (perKategorie[a.kategorie] ?? 0) + 1;
    if (a.difficulty === 3) schwer++;
  };
  for (const c of ordered) {
    if (chosen.length >= DETECTIVE_ROUNDS) break;
    if ((perKategorie[c.akte.kategorie] ?? 0) >= MAX_PRO_KATEGORIE) continue;
    if (c.akte.difficulty === 3 && schwer >= MAX_SCHWER) continue;
    take(c.akte);
  }
  // Zu wenig Auswahl (z. B. kleine Datenbestände): Regeln lockern
  for (const c of ordered) {
    if (chosen.length >= DETECTIVE_ROUNDS) break;
    if (!chosen.includes(c.akte)) take(c.akte);
  }
  return shuffle(chosen, rnd).map((c) => ({
    fall: c,
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
  /** EP vor Combo */
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
  { min: 5, title: 'Spürnase', icon: '👃' },
  { min: 15, title: 'Ermittler/in', icon: '🔎' },
  { min: 35, title: 'Kommissar/in', icon: '🎖️' },
  { min: 70, title: 'Hauptkommissar/in', icon: '🏅' },
  { min: 120, title: 'Meisterdetektiv/in', icon: '👑' },
];

/** Ränge passend zur Zahl der Akten der Rolle (Meisterdetektiv/in bei 60 % des Archivs) */
export function detectiveGrades() {
  const n = aktenListe().length;
  const g = DETECTIVE_GRADES.map((x) => ({ ...x }));
  g[5].min = Math.round(n * 0.6);
  if (g[4].min >= g[5].min) g[4].min = Math.round(n * 0.4);
  if (g[3].min >= g[4].min) g[3].min = Math.round(n * 0.25);
  return g;
}


/** Gelöste Akten (nur Akten, die es noch gibt), Meisterlösungen und alle Akten */
export function archiveCount(p: Progress) {
  const list = aktenListe();
  const ids = new Set(list.map((a) => a.id));
  const entries = Object.entries(p.detectiveSolved).filter(([id]) => ids.has(id));
  return { solved: entries.length, master: entries.filter(([, v]) => v === 2).length, total: list.length };
}

export function detectiveGrade(p: Progress) {
  const { solved } = archiveCount(p);
  let i = 0;
  const grades = detectiveGrades();
  grades.forEach((g, k) => {
    if (solved >= g.min) i = k;
  });
  return { grade: grades[i], next: grades[i + 1], index: i };
}

/** Aktennummer im Archiv (1 = erste Akte) */
const AKTE_NR = new Map(AKTEN.map((a, i) => [a.id, i + 1]));
export const akteNr = (id: string) => AKTE_NR.get(id) ?? 0;

/** Stand eines Krankheitsbilds im Archiv: wie viele seiner Situationen sind gelöst? */
export interface BildStand {
  bild: AktenBild;
  total: number;
  solved: number;
  master: number;
}

const jeBild = (list: DetektivFall[]) => {
  const m = new Map<string, DetektivFall[]>();
  for (const a of list) m.set(a.bild, [...(m.get(a.bild) ?? []), a]);
  return m;
};
const JE_BILD_ALLE = jeBild(AKTEN);
const JE_BILD_HELFER = jeBild(HELFER_AKTEN);
const aktenJeBild = () => (aktiveRolle() === 'helfer' ? JE_BILD_HELFER : JE_BILD_ALLE);

export function bildStand(p: Progress, bildId: string): BildStand | undefined {
  const bild = BILDER.find((b) => b.id === bildId);
  const list = aktenJeBild().get(bildId);
  if (!bild || !list) return undefined;
  const stamps = list.map((a) => p.detectiveSolved[a.id] ?? 0);
  return { bild, total: list.length, solved: stamps.filter((s) => s > 0).length, master: stamps.filter((s) => s === 2).length };
}

export interface KategorieStand {
  id: Kategorie;
  icon: string;
  title: string;
  bilder: BildStand[];
  total: number;
  solved: number;
}

/** Archiv nach Kategorien und Krankheitsbildern – für die Archiv-Ansicht */
export function archivNachKategorie(p: Progress): KategorieStand[] {
  return KATEGORIEN.map((k) => {
    const bilder = BILDER.filter((b) => b.kategorie === k.id && aktenJeBild().has(b.id)).map((b) => bildStand(p, b.id)!);
    return {
      ...k,
      bilder,
      total: bilder.reduce((n, b) => n + b.total, 0),
      solved: bilder.reduce((n, b) => n + b.solved, 0),
    };
  }).filter((k) => k.bilder.length > 0);
}

/** Anzahl verschiedener Krankheitsbilder, von denen mindestens eine Akte gelöst ist */
export function bilderGeloest(p: Progress) {
  const alle = [...aktenJeBild().keys()];
  return { solved: alle.filter((id) => (bildStand(p, id)?.solved ?? 0) > 0).length, total: alle.length };
}

/** Trägt Stempel ins Archiv ein (ein besserer Stempel ersetzt einen schlechteren). */
export function mergeArchive(archive: Record<string, ArchiveStamp>, stamps: Record<string, ArchiveStamp | 0>) {
  const next = { ...archive };
  for (const [id, s] of Object.entries(stamps)) {
    if (s > 0 && s > (next[id] ?? 0)) next[id] = s as ArchiveStamp;
  }
  return next;
}
