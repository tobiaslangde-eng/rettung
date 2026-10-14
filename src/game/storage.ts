import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from './difficulty';

// Die Vorschau-Version (rettung.tankard.de/vorschau/) hat einen eigenen Spielstand, damit Tests den echten nicht verändern.
const PREVIEW = (globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true;
const KEY = PREVIEW ? 'kiirabi.vorschau.progress.v1' : 'kiirabi.progress.v1';

export interface Progress {
  totalPoints: number;
  casesPlayed: number;
  correctDiagnoses: number;
  /** Beste Sternewertung je Fall-ID */
  bestStars: Record<string, number>;
  /** Zuletzt gewählte Schwierigkeit */
  difficulty: Difficulty;
  /** Einsätze in Folge mit mindestens 2 Sternen */
  streak: number;
  /** Einsätze mit 3 Sternen */
  perfectRuns: number;
  /** Einsätze auf „Schwer“ mit mindestens 2 Sternen */
  hardWins: number;
  /** Bestes Ergebnis im Schnelltraining (von 10) */
  quizBest: number;
  /** Freigeschaltete Abzeichen (IDs) */
  badges: string[];
  /** Tagesdienst: Tag (JJJJ-MM-TT), auf den sich `dayCases` bezieht */
  dayKey: string;
  /** Einsätze an diesem Tag */
  dayCases: number;
  /** Tag, an dem der „Einsatz des Tages“ zuletzt gespielt wurde */
  dailyCaseDay: string;
  /** Tag, an dem das Tagesziel zuletzt erreicht wurde */
  lastGoalDay: string;
  /** Tage in Folge mit erreichtem Tagesziel */
  dayStreak: number;
  bestDayStreak: number;
  /** Bestes Ergebnis bei den Wissensfragen (von 10) */
  knowBest: number;
  /** Beste Trefferquote bei der Herzdruckmassage in Prozent */
  cprBest: number;
  /** Großeinsatz: bestes Sichtungsergebnis (von 8) */
  manvBest: number;
  /** Kalenderwoche (z. B. 2026-W42), auf die sich `weekPoints` bezieht */
  weekKey: string;
  weekPoints: number;
  /** Punkte vergangener Wochen (nur Wochen, in denen gespielt wurde) */
  weekHistory: { week: string; points: number }[];
  /** Budget der Wache für Ausrüstung – jeder verdiente Punkt bringt 1 € */
  budget: number;
  /** Ausrüstungsstufen (1–4) je Ausrüstung */
  equipment: Record<string, number>;
  /** Detektiv-Akten: Stempel im Archiv je Fall (1 = gelöst, 2 = Meisterlösung) */
  detectiveSolved: Record<string, 1 | 2>;
  /** Detektiv-Akten: beste Punktzahl einer Ermittlung */
  detectiveBest: number;
  /** Detektiv-Akten: Anzahl Ermittlungen */
  detectiveRounds: number;
}

export const EMPTY_PROGRESS: Progress = {
  totalPoints: 0,
  casesPlayed: 0,
  correctDiagnoses: 0,
  bestStars: {},
  difficulty: 'leicht',
  streak: 0,
  perfectRuns: 0,
  hardWins: 0,
  quizBest: 0,
  badges: [],
  dayKey: '',
  dayCases: 0,
  dailyCaseDay: '',
  lastGoalDay: '',
  dayStreak: 0,
  bestDayStreak: 0,
  knowBest: 0,
  cprBest: 0,
  manvBest: 0,
  weekKey: '',
  weekPoints: 0,
  weekHistory: [],
  budget: 0,
  equipment: {},
  detectiveSolved: {},
  detectiveBest: 0,
  detectiveRounds: 0,
};

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const saved = JSON.parse(raw);
    // Ältere Spielstände kannten noch kein Budget: Startbudget = bisher gesammelte Punkte.
    if (saved.budget === undefined) saved.budget = saved.totalPoints ?? 0;
    return { ...EMPTY_PROGRESS, ...saved };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export async function saveProgress(p: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Fortschritt ist optional – Spiel läuft auch ohne Speicher weiter.
  }
}

const CODE_PREFIX = 'E112-';

/** Spielstand als Text-Code, um ihn auf ein anderes Gerät oder eine neue Adresse mitzunehmen. */
export function exportCode(p: Progress): string {
  return CODE_PREFIX + btoa(encodeURIComponent(JSON.stringify(p)));
}

/** Liest einen Spielstand-Code; null, wenn der Code ungültig ist. */
export function importCode(code: string): Progress | null {
  try {
    const raw = code.replace(/\s+/g, '').replace(CODE_PREFIX, '');
    const data = JSON.parse(decodeURIComponent(atob(raw)));
    if (typeof data !== 'object' || data === null || typeof data.totalPoints !== 'number') return null;
    return { ...EMPTY_PROGRESS, ...data };
  } catch {
    return null;
  }
}
