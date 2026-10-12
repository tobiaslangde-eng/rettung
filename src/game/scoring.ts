import { MedCase } from '../data/cases';
import { Rating, VitalId, rateVital } from '../data/vitals';
import { DIFFICULTY_BY_ID, Difficulty, HINT_COST } from './difficulty';

export const POINTS = {
  ratingCorrect: 10,
  ratingWrong: -5,
  missedKeyVital: -10,
  diagnosisCorrect: 50,
  treatmentCorrect: 10,
  treatmentWrong: -10,
  efficiencyMax: 20,
  efficiencyPerExtra: 4,
  /** Bonus für den Patientenzustand am Ende: Zustand / 5 */
  conditionMax: 20,
};

/** Wie sich meine Entscheidungen auf den Zustand des Patienten (0–100) auswirken. */
export const CONDITION = {
  start: 80,
  wrongRating: -4,
  wrongDiagnosis: -15,
  treatmentCorrect: 6,
  treatmentWrong: -10,
};

export function clampCondition(c: number): number {
  return Math.max(5, Math.min(100, c));
}

export function conditionOutcome(condition: number, firstName: string): { emoji: string; text: string } {
  if (condition >= 70) return { emoji: '😊', text: `${firstName} kommt stabil in der Klinik an. Das Klinikteam nickt mir anerkennend zu.` };
  if (condition >= 40) return { emoji: '😐', text: `${firstName} ist in der Klinik angekommen – aber es war knapp.` };
  return { emoji: '😟', text: `${firstName} ist kritisch. Das Team im Schockraum übernimmt sofort.` };
}

/** Jede Messung kostet Einsatzzeit (in Minuten). */
export const MINUTES_PER_MEASUREMENT = 1;

export interface CaseRun {
  medCase: MedCase;
  /** Messungen in Reihenfolge, mit der Einstufung des Spielers (null bei EKG) */
  measured: { id: VitalId; guess: Rating | null }[];
  diagnosisGuess: string;
  treatmentGuess: number[];
  difficulty: Difficulty;
  /** Patientenzustand am Ende (0–100) */
  condition: number;
  /** Bezahlte Tipps von Kati */
  hintsUsed: number;
}

export interface ScoreLine {
  label: string;
  points: number;
}

export interface ScoreResult {
  lines: ScoreLine[];
  total: number;
  multiplier: number;
  diagnosisCorrect: boolean;
  missedKeyVitals: VitalId[];
  stars: 0 | 1 | 2 | 3;
}

export function scoreRun(run: CaseRun): ScoreResult {
  const { medCase, measured, diagnosisGuess, treatmentGuess } = run;
  const lines: ScoreLine[] = [];

  let ratingPts = 0;
  let correctRatings = 0;
  let ratable = 0;
  for (const m of measured) {
    const truth = rateVital(m.id, medCase.vitals[m.id]);
    if (truth === null) continue;
    ratable++;
    if (truth === m.guess) {
      correctRatings++;
      ratingPts += POINTS.ratingCorrect;
    } else {
      ratingPts += POINTS.ratingWrong;
    }
  }
  lines.push({ label: `Werte richtig eingestuft (${correctRatings}/${ratable})`, points: ratingPts });

  const measuredIds = new Set(measured.map((m) => m.id));
  const missedKeyVitals = medCase.keyVitals.filter((id) => !measuredIds.has(id));
  if (missedKeyVitals.length > 0) {
    lines.push({
      label: `Wichtige Werte nicht gemessen (${missedKeyVitals.length})`,
      points: missedKeyVitals.length * POINTS.missedKeyVital,
    });
  }

  const extra = Math.max(0, measured.length - medCase.keyVitals.length);
  const efficiency =
    missedKeyVitals.length === 0 ? Math.max(0, POINTS.efficiencyMax - extra * POINTS.efficiencyPerExtra) : 0;
  lines.push({ label: 'Zeitbonus (zielgerichtete Untersuchung)', points: efficiency });

  const diagnosisCorrect = diagnosisGuess === medCase.diagnosis;
  lines.push({ label: diagnosisCorrect ? 'Diagnose richtig' : 'Diagnose falsch', points: diagnosisCorrect ? POINTS.diagnosisCorrect : 0 });

  let tPts = 0;
  let tRight = 0;
  let tWrong = 0;
  for (const i of treatmentGuess) {
    if (medCase.treatments[i].correct) {
      tRight++;
      tPts += POINTS.treatmentCorrect;
    } else {
      tWrong++;
      tPts += POINTS.treatmentWrong;
    }
  }
  const totalCorrectTreatments = medCase.treatments.filter((t) => t.correct).length;
  lines.push({
    label: `Maßnahmen: ${tRight}/${totalCorrectTreatments} richtig${tWrong ? `, ${tWrong} falsch` : ''}`,
    points: tPts,
  });

  lines.push({ label: `Zustand des Patienten (${Math.round(run.condition)} %)`, points: Math.round(run.condition / 5) });

  if (run.hintsUsed > 0) {
    lines.push({ label: `Tipps von Kati (${run.hintsUsed})`, points: -run.hintsUsed * HINT_COST });
  }

  const base = Math.max(0, lines.reduce((s, l) => s + l.points, 0));
  const multiplier = DIFFICULTY_BY_ID[run.difficulty].multiplier;
  const total = Math.round(base * multiplier);
  const ratio = base / maxScore(medCase);
  const stars = (ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0) as ScoreResult['stars'];

  return { lines, total, multiplier, diagnosisCorrect, missedKeyVitals, stars };
}

/** Bestmögliche Punktzahl: nur die wichtigen Werte messen und alles richtig machen. */
export function maxScore(medCase: MedCase): number {
  const ratableKeys = medCase.keyVitals.filter((id) => rateVital(id, medCase.vitals[id]) !== null).length;
  const correctTreatments = medCase.treatments.filter((t) => t.correct).length;
  return (
    ratableKeys * POINTS.ratingCorrect +
    POINTS.efficiencyMax +
    POINTS.conditionMax +
    POINTS.diagnosisCorrect +
    correctTreatments * POINTS.treatmentCorrect
  );
}

export interface Rank {
  min: number;
  de: string;
}

export const RANKS: Rank[] = [
  { min: 0, de: 'Praktikant/in' },
  { min: 300, de: 'Rettungshelfer/in' },
  { min: 800, de: 'Rettungssanitäter/in' },
  { min: 1600, de: 'Notfallsanitäter/in' },
  { min: 3000, de: 'Teamleiter/in Rettungswagen' },
];

export function rankFor(points: number): { rank: Rank; next?: Rank } {
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (points >= r.min) idx = i;
  });
  return { rank: RANKS[idx], next: RANKS[idx + 1] };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
