import { GEFAHREN_HELFER } from '../data/gefahren/helfer';
import { GEFAHREN_SANI } from '../data/gefahren/sani';
import { GefahrSzene } from '../data/gefahren/types';
import { Rolle } from './rolle';
import { shuffle } from './scoring';

/** Szenen je Runde */
export const GEFAHR_RUNDE = 4;

export const szenenFuer = (rolle: Rolle): GefahrSzene[] => (rolle === 'helfer' ? GEFAHREN_HELFER : GEFAHREN_SANI);

/** Eine Runde: zuerst Szenen, die noch nicht gelöst sind */
export function makeGefahrRunde(rolle: Rolle, geloest: string[]): GefahrSzene[] {
  const alle = szenenFuer(rolle);
  const neu = shuffle(alle.filter((s) => !geloest.includes(s.id)));
  const alt = shuffle(alle.filter((s) => geloest.includes(s.id)));
  return [...neu, ...alt].slice(0, GEFAHR_RUNDE);
}

export interface SzenenErgebnis {
  gefunden: number;
  gefahren: number;
  falsch: number;
  punkte: number;
  /** Alle Gefahren gefunden (höchstens ein Fehlgriff) */
  geloest: boolean;
}

export function bewerteSzene(s: GefahrSzene, getippt: string[]): SzenenErgebnis {
  const gefahren = s.objekte.filter((o) => o.gefahr);
  const gefunden = gefahren.filter((o) => getippt.includes(o.id)).length;
  const falsch = getippt.filter((id) => s.objekte.find((o) => o.id === id && !o.gefahr)).length;
  const alle = gefunden === gefahren.length;
  const punkte = Math.max(0, gefunden * 6 + (alle && falsch === 0 ? 10 : 0) - falsch * 3);
  return { gefunden, gefahren: gefahren.length, falsch, punkte, geloest: alle && falsch <= 1 };
}
