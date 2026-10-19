import { SPICKZETTEL_HELFER } from '../data/spickzettel-helfer';
import { SPICKZETTEL_SANI } from '../data/spickzettel-sani';
import { Spickzettel } from '../data/spickzettel.types';
import { Rolle } from './rolle';
import { Progress } from './storage';
import { KAPITEL } from './story';

export const spickFuer = (rolle: Rolle): Spickzettel[] => (rolle === 'helfer' ? SPICKZETTEL_HELFER : SPICKZETTEL_SANI);

/** Frei, sobald das Kapitel erreicht ist (oder im freien Spiel immer) */
export function spickFrei(rolle: Rolle, p: Progress, s: Spickzettel): boolean {
  if (p.modus === 'frei') return true;
  return p.story + 1 >= Math.min(s.kapitelAb, KAPITEL[rolle].length);
}

/** Spickzettel, die mit dem Beginn dieses Kapitels frei werden */
export const spickNeuBeiKapitel = (rolle: Rolle, kapitel: number): Spickzettel[] =>
  spickFuer(rolle).filter((s) => s.kapitelAb === kapitel);
