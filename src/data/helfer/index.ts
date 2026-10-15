import { HELFER_FAELLE_1 } from './faelle1';
import { HELFER_FAELLE_2 } from './faelle2';
import { HELFER_FAELLE_3 } from './faelle3';
import { HELFER_FAELLE_4 } from './faelle4';
import { HelferFall } from './types';

export type { HelferCheck, HelferFall, HelferMassnahme } from './types';

/** Alle Einsätze für Ersthelfer/innen */
export const HELFER_FAELLE: HelferFall[] = [...HELFER_FAELLE_1, ...HELFER_FAELLE_2, ...HELFER_FAELLE_3, ...HELFER_FAELLE_4];
