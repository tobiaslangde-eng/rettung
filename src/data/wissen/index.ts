import { ATMUNG } from './atmung';
import { BEGRIFFE } from './begriffe';
import { ERKRANKUNGEN } from './erkrankungen';
import { ERSTE_HILFE } from './erste-hilfe';
import { HELFEN } from './helfen';
import { HERZ_KREISLAUF } from './herz-kreislauf';
import { KINDER_FRAUEN_ALTER } from './kinder-frauen-alter';
import { KOERPER } from './koerper';
import { MEDIKAMENTE } from './medikamente';
import { NEURO_PSYCHE } from './neuro-psyche';
import { RETTUNGSDIENST } from './rettungsdienst';
import { TRAUMA_UMWELT } from './trauma-umwelt';
import { VERGIFTUNG_ALLERGIE_INFEKTION } from './vergiftung-allergie-infektion';
import { Wissensartikel } from './types';

export { KATEGORIE_NAMEN } from './types';
export type { WissensKategorie, Wissensartikel } from './types';

/** Das gesamte App-Wissen: alle Artikel aller Kategorien */
export const WISSENSBASIS: Wissensartikel[] = [
  ...ERSTE_HILFE,
  ...HERZ_KREISLAUF,
  ...ATMUNG,
  ...NEURO_PSYCHE,
  ...TRAUMA_UMWELT,
  ...KINDER_FRAUEN_ALTER,
  ...VERGIFTUNG_ALLERGIE_INFEKTION,
  ...KOERPER,
  ...RETTUNGSDIENST,
  ...BEGRIFFE,
  ...MEDIKAMENTE,
  ...ERKRANKUNGEN,
  ...HELFEN,
];
