import { SCHICHT_CHECKS_HELFER } from '../data/schichtChecks-helfer';
import { SCHICHT_CHECKS_SANI } from '../data/schichtChecks-sani';
import { SchichtFrage } from '../data/schichtChecks.types';
import { Rolle } from './rolle';
import { shuffle } from './scoring';

/** Schichtmodus: so viele Einsätze hat eine Schicht */
export const SCHICHT_EINSAETZE = 4;
export const SCHICHT_BONUS = 40;
export const SCHICHT_CHECK_PUNKTE = 10;
export const SCHICHT_STERNE_BONUS = 20;

export interface SchichtStand {
  /** Sterne je abgeschlossenem Einsatz */
  sterne: number[];
  /** Check-Fragen in den Pausen: richtig beantwortet? */
  checks: boolean[];
  /** Schon verwendete Check-Fragen (IDs) */
  benutzt: string[];
}

export const neueSchicht = (): SchichtStand => ({ sterne: [], checks: [], benutzt: [] });

export const schichtName = (rolle: Rolle) => (rolle === 'helfer' ? 'Bereitschaftsdienst' : 'Schicht');

export function waehleCheck(rolle: Rolle, benutzt: string[]): SchichtFrage {
  const pool = rolle === 'helfer' ? SCHICHT_CHECKS_HELFER : SCHICHT_CHECKS_SANI;
  const frei = pool.filter((f) => !benutzt.includes(f.id));
  return shuffle(frei.length > 0 ? frei : pool)[0];
}

/** Uhrzeit der Schicht: Dienstbeginn 07:00, jeder Einsatz etwa 80 Minuten später */
export function dienstzeit(nr: number): string {
  const min = 7 * 60 + nr * 80;
  return `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export function schichtBilanz(st: SchichtStand) {
  const schnitt = st.sterne.length ? st.sterne.reduce((a, b) => a + b, 0) / st.sterne.length : 0;
  const checksRichtig = st.checks.filter(Boolean).length;
  const bonus = SCHICHT_BONUS + checksRichtig * SCHICHT_CHECK_PUNKTE + (schnitt >= 2.5 ? SCHICHT_STERNE_BONUS : 0);
  return { schnitt, sterneGesamt: Math.round(schnitt), checksRichtig, bonus };
}
