import { KATEGORIEN, Kategorie } from '../data/akten';
import { Progress } from './storage';
import { weekKey } from './weekly';

/** So viele Einsätze aus dem Wochenthema braucht die Challenge */
export const WOCHEN_ZIEL = 5;
/** Bonus-EP für die geschaffte Challenge */
export const WOCHEN_BONUS = 100;

/** Das Thema der Woche: wechselt jede Kalenderwoche durch alle Bereiche (für alle Spieler gleich) */
export function wochenThema(key = weekKey()): (typeof KATEGORIEN)[number] {
  const nr = Number(key.split('-W')[1]) || 0;
  return KATEGORIEN[nr % KATEGORIEN.length];
}

export interface WochenStand {
  thema: (typeof KATEGORIEN)[number];
  geschafft: number;
  ziel: number;
  fertig: boolean;
}

export function wochenStand(p: Pick<Progress, 'challengeWoche' | 'challengeFaelle' | 'challengeFertig'>, key = weekKey()): WochenStand {
  const aktuell = p.challengeWoche === key;
  return {
    thema: wochenThema(key),
    geschafft: aktuell ? Math.min(p.challengeFaelle, WOCHEN_ZIEL) : 0,
    ziel: WOCHEN_ZIEL,
    fertig: aktuell && p.challengeFertig,
  };
}

/** Zählt einen abgeschlossenen Einsatz für die Wochen-Challenge. `bonus` > 0, wenn sie gerade geschafft wurde. */
export function zaehleWochenfall(p: Progress, kategorie: Kategorie | undefined, key = weekKey()): { progress: Progress; bonus: number } {
  if (!kategorie || kategorie !== wochenThema(key).id) return { progress: p, bonus: 0 };
  const aktuell = p.challengeWoche === key;
  const bisher = aktuell ? p.challengeFaelle : 0;
  const fertigVorher = aktuell && p.challengeFertig;
  const jetzt = bisher + 1;
  const fertig = fertigVorher || jetzt >= WOCHEN_ZIEL;
  const bonus = !fertigVorher && jetzt >= WOCHEN_ZIEL ? WOCHEN_BONUS : 0;
  return { progress: { ...p, challengeWoche: key, challengeFaelle: jetzt, challengeFertig: fertig }, bonus };
}
