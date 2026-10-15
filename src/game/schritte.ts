import { ABLAEUFE, Ablauf } from '../data/schritte';
import { Rolle } from './rolle';
import { shuffle } from './scoring';

/** Abläufe pro Runde */
export const SCHRITTE_RUNDE = 3;
/** Punkte je Ablauf, Abzug je Fehlgriff, Mindestpunkte bei geschafftem Ablauf */
export const ABLAUF_PUNKTE = 30;
export const FEHLER_ABZUG = 6;
export const ABLAUF_MIN = 6;

export const ablaeufeFuer = (rolle: Rolle): Ablauf[] => ABLAEUFE.filter((a) => a.rolle === rolle || a.rolle === 'beide');

/** Wählt Abläufe für eine Runde – zuerst die, die noch nie richtig sortiert wurden */
export function makeSchritteRunde(rolle: Rolle, geloest: string[]): Ablauf[] {
  const alle = ablaeufeFuer(rolle);
  const neu = shuffle(alle.filter((a) => !geloest.includes(a.id)));
  const alt = shuffle(alle.filter((a) => geloest.includes(a.id)));
  return [...neu, ...alt].slice(0, SCHRITTE_RUNDE);
}

export const ablaufPunkte = (fehler: number) => Math.max(ABLAUF_MIN, ABLAUF_PUNKTE - fehler * FEHLER_ABZUG);
