/** Herzdruckmassage-Training: Takt treffen wie bei einer echten Wiederbelebung. */

export const CPR_COMPRESSIONS = 30;
export const CPR_CYCLES = 2;
export const CPR_BREATHS = 2;
export const CPR_MIN_RATE = 100;
export const CPR_MAX_RATE = 120;
/** Ziel-Takt des Taktgebers */
export const CPR_GUIDE_RATE = 110;
/** EP bei 100 % Treffern – ohne Taktgeber doppelt */
export const CPR_POINTS = 40;
/** Längste erlaubte Unterbrechung für die Beatmung (Sekunden) */
export const CPR_MAX_PAUSE = 10;
export const CPR_PAUSE_PENALTY = 10;

/** Frequenz pro Minute aus den letzten zwei Abständen (glättet Tipp-Ungenauigkeiten). */
export function rateFrom(taps: number[]): number | null {
  if (taps.length < 2) return null;
  const recent = taps.slice(-3);
  const span = recent[recent.length - 1] - recent[0];
  if (span <= 0) return null;
  return Math.round((60000 * (recent.length - 1)) / span);
}

export type RateZone = 'langsam' | 'gut' | 'schnell';

export function zoneFor(rate: number): RateZone {
  if (rate < CPR_MIN_RATE) return 'langsam';
  if (rate > CPR_MAX_RATE) return 'schnell';
  return 'gut';
}

export interface CprResult {
  /** Anteil der Kompressionen im Zielbereich, 0–100 */
  accuracy: number;
  avgRate: number;
  /** Längste Unterbrechung für die Beatmung in Sekunden */
  longestPause: number;
  stars: 0 | 1 | 2 | 3;
  points: number;
}

/**
 * Wertet die Zyklen aus. `cycles`: Zeitstempel (ms) der Kompressionen je Zyklus,
 * `pauses`: Dauer der Beatmungspausen in ms.
 */
export function scoreCpr(cycles: number[][], pauses: number[], withGuide: boolean): CprResult {
  let rated = 0;
  let good = 0;
  let intervalSum = 0;
  let intervals = 0;
  for (const taps of cycles) {
    for (let i = 1; i < taps.length; i++) {
      const rate = rateFrom(taps.slice(0, i + 1));
      if (rate === null) continue;
      rated++;
      if (zoneFor(rate) === 'gut') good++;
      intervalSum += taps[i] - taps[i - 1];
      intervals++;
    }
  }
  const accuracy = rated ? Math.round((good / rated) * 100) : 0;
  const avgRate = intervals ? Math.round(60000 / (intervalSum / intervals)) : 0;
  const longestPause = pauses.length ? Math.round(Math.max(...pauses) / 100) / 10 : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
  const base = Math.round((accuracy / 100) * CPR_POINTS) * (withGuide ? 1 : 2);
  const penalty = longestPause > CPR_MAX_PAUSE ? CPR_PAUSE_PENALTY : 0;
  return { accuracy, avgRate, longestPause, stars, points: Math.max(0, base - penalty) };
}
