import { FEHLER_HELFER } from '../data/fehler/helfer';
import { FEHLER_SANI } from '../data/fehler/sani';
import { FehlerSzenario } from '../data/fehler/types';
import { Rolle } from './rolle';
import { shuffle } from './scoring';

/** Szenarien je Runde */
export const FEHLER_RUNDE = 4;

export const fehlerSzenarienFuer = (rolle: Rolle): FehlerSzenario[] => (rolle === 'helfer' ? FEHLER_HELFER : FEHLER_SANI);

export function makeFehlerRunde(rolle: Rolle, geloest: string[]): FehlerSzenario[] {
  const alle = fehlerSzenarienFuer(rolle);
  const neu = shuffle(alle.filter((s) => !geloest.includes(s.id)));
  const alt = shuffle(alle.filter((s) => geloest.includes(s.id)));
  return [...neu, ...alt].slice(0, FEHLER_RUNDE);
}

export interface FehlerErgebnis {
  gefunden: number;
  fehlerGesamt: number;
  falsch: number;
  punkte: number;
  geloest: boolean;
}

export function bewerteFehler(s: FehlerSzenario, markiert: number[]): FehlerErgebnis {
  const fehlerGesamt = s.schritte.filter((x) => x.fehler).length;
  const gefunden = markiert.filter((i) => s.schritte[i]?.fehler).length;
  const falsch = markiert.length - gefunden;
  const perfekt = gefunden === fehlerGesamt && falsch === 0;
  return {
    gefunden,
    fehlerGesamt,
    falsch,
    punkte: Math.max(0, gefunden * 8 - falsch * 4 + (perfekt ? 10 : 0)),
    geloest: gefunden === fehlerGesamt && falsch <= 1,
  };
}
