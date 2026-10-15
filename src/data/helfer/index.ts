import { HELFER_FAELLE_1 } from './faelle1';
import { HELFER_FAELLE_2 } from './faelle2';
import { HelferFall } from './types';

export type { HelferCheck, HelferFall, HelferMassnahme } from './types';

/** Alle Einsätze für Ersthelfer/innen */
export const HELFER_FAELLE: HelferFall[] = [...HELFER_FAELLE_1, ...HELFER_FAELLE_2];
