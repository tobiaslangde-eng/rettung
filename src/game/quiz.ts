import { Rating, VitalId, VitalValue, rateVital } from '../data/vitals';

/** Punkte je richtig eingeschätztem Wert im Schnelltraining */
export const QUIZ_POINTS = 5;
export const QUIZ_ROUNDS = 10;

type Range = [number, number];

/**
 * Wertebereiche für das Schnelltraining. Sie halten bewusst Abstand zu den
 * Grenzwerten, damit jede Frage eindeutig ist.
 */
const RANGES: Partial<Record<VitalId, Partial<Record<Rating, Range>>>> = {
  puls: { niedrig: [32, 54], normal: [64, 94], hoch: [108, 170] },
  rr: { niedrig: [62, 84], normal: [98, 134], hoch: [150, 230] },
  spo2: { niedrig: [74, 91], normal: [97, 100] },
  af: { niedrig: [4, 9], normal: [14, 18], hoch: [24, 40] },
  temp: { niedrig: [29.5, 35.4], normal: [36.5, 37.1], hoch: [38.0, 41.5] },
  bz: { niedrig: [25, 62], normal: [78, 132], hoch: [160, 560] },
  gcs: { niedrig: [3, 13], normal: [15, 15] },
};

export interface QuizQuestion {
  id: VitalId;
  value: VitalValue;
  answer: Rating;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function makeQuestion(): QuizQuestion {
  const id = pick(Object.keys(RANGES) as VitalId[]);
  const ranges = RANGES[id]!;
  const rating = pick(Object.keys(ranges) as Rating[]);
  const [min, max] = ranges[rating]!;
  let value: VitalValue;
  if (id === 'temp') {
    value = Math.round(rand(min, max) * 10) / 10;
  } else if (id === 'rr') {
    const sys = Math.round(rand(min, max));
    value = [sys, Math.round(sys * 0.6 + rand(-4, 6))];
  } else {
    value = Math.round(rand(min, max));
  }
  // Sicherheitsnetz: die Einstufung kommt immer aus derselben Logik wie im Einsatz.
  const answer = rateVital(id, value) ?? rating;
  return { id, value, answer };
}

export function makeQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  let tries = 0;
  while (qs.length < QUIZ_ROUNDS) {
    const q = makeQuestion();
    // Möglichst nicht zweimal hintereinander denselben Vitalwert (mit Notbremse)
    if (qs.length > 0 && qs[qs.length - 1].id === q.id && tries++ < 50) continue;
    qs.push(q);
  }
  return qs;
}
