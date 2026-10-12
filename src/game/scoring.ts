import { MedCase } from '../data/cases';
import { Rating, VitalId, rateVital } from '../data/vitals';

export const POINTS = {
  ratingCorrect: 10,
  ratingWrong: -5,
  missedKeyVital: -10,
  diagnosisCorrect: 50,
  treatmentCorrect: 10,
  treatmentWrong: -10,
  efficiencyMax: 20,
  efficiencyPerExtra: 4,
};

/** Jede Messung kostet Einsatzzeit (in Minuten). */
export const MINUTES_PER_MEASUREMENT = 1;

export interface CaseRun {
  medCase: MedCase;
  /** Messungen in Reihenfolge, mit der Einstufung des Spielers (null bei EKG) */
  measured: { id: VitalId; guess: Rating | null }[];
  diagnosisGuess: string;
  treatmentGuess: number[];
}

export interface ScoreLine {
  label: string;
  points: number;
}

export interface ScoreResult {
  lines: ScoreLine[];
  total: number;
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

  const total = Math.max(0, lines.reduce((s, l) => s + l.points, 0));
  const max = maxScore(medCase);
  const ratio = total / max;
  const stars = (ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0) as ScoreResult['stars'];

  return { lines, total, diagnosisCorrect, missedKeyVitals, stars };
}

/** Bestmögliche Punktzahl: nur die wichtigen Werte messen und alles richtig machen. */
export function maxScore(medCase: MedCase): number {
  const ratableKeys = medCase.keyVitals.filter((id) => rateVital(id, medCase.vitals[id]) !== null).length;
  const correctTreatments = medCase.treatments.filter((t) => t.correct).length;
  return (
    ratableKeys * POINTS.ratingCorrect +
    POINTS.efficiencyMax +
    POINTS.diagnosisCorrect +
    correctTreatments * POINTS.treatmentCorrect
  );
}

export interface Rank {
  min: number;
  de: string;
  et: string;
}

export const RANKS: Rank[] = [
  { min: 0, de: 'Praktikant/in', et: 'Praktikant' },
  { min: 300, de: 'Rettungshelfer/in', et: 'Päästeabiline' },
  { min: 800, de: 'Rettungssanitäter/in', et: 'Kiirabitehnik' },
  { min: 1600, de: 'Notfallsanitäter/in', et: 'Erakorralise meditsiini tehnik' },
  { min: 3000, de: 'Teamleiter/in Rettungswagen', et: 'Kiirabibrigaadi juht' },
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
