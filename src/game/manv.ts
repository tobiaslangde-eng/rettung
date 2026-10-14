import { MANV_PATIENTS, MANV_PERFECT_BONUS, MANV_POINTS, MANV_ROUND, MANV_SCENARIOS, ManvPatient, TRIAGE_ORDER, triage } from '../data/manv';
import { shuffle } from './scoring';

/** Eine Runde mit 8 Verletzten – jede Sichtungskategorie kommt mindestens einmal vor. */
export function makeManvRound(): { scenario: string; patients: ManvPatient[] } {
  const pool = shuffle(MANV_PATIENTS);
  const picked = TRIAGE_ORDER.map((cat) => pool.find((p) => triage(p).cat === cat)!);
  const rest = pool.filter((p) => !picked.includes(p)).slice(0, MANV_ROUND - picked.length);
  return { scenario: shuffle(MANV_SCENARIOS)[0], patients: shuffle([...picked, ...rest]) };
}

export function manvPoints(correct: number): number {
  return correct * MANV_POINTS + (correct === MANV_ROUND ? MANV_PERFECT_BONUS : 0);
}
