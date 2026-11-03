import { BASIS_KATEGORIE } from './akten';
import { BASIS_CASES } from './casesBasis';
import type { MedCase } from './casesBasis';
import { PLUS_CASES } from './einsaetze';

export type { MedCase, Treatment } from './casesBasis';

/**
 * Alle Einsätze des Standard-Spiels: die 28 ursprünglichen Einsätze plus die Situationen aus den Detektiv-Akten
 * (mit Behandlung, Zwischenfällen und Extremfällen).
 */
export const CASES: MedCase[] = [...BASIS_CASES.map((c) => ({ ...c, kategorie: BASIS_KATEGORIE[c.id] })), ...PLUS_CASES];

export const CASE_BY_ID = new Map(CASES.map((c) => [c.id, c]));

/** Ein Eintrag je Krankheitsbild (für Lexikon und Wissenssuche), der erste Einsatz mit dieser Diagnose */
export const KRANKHEITSBILDER: MedCase[] = (() => {
  const gesehen = new Set<string>();
  return CASES.filter((c) => {
    if (gesehen.has(c.diagnosis)) return false;
    gesehen.add(c.diagnosis);
    return true;
  });
})();
