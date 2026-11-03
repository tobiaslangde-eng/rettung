import { MedCase } from '../data/cases';
import { DIFFICULTY_BY_ID } from './difficulty';
import { Progress } from './storage';

/** So viele zuletzt gespielte Einsätze werden (soweit der Vorrat reicht) nicht noch einmal gezogen */
export const VERLAUF_LAENGE = 14;

export interface Verlauf {
  ids: string[];
  kategorien: string[];
}

export const leererVerlauf = (): Verlauf => ({ ids: [], kategorien: [] });

/** Merkt sich einen gespielten Einsatz */
export function merkeEinsatz(v: Verlauf, c: Pick<MedCase, 'id' | 'kategorie'>): void {
  v.ids.push(c.id);
  v.kategorien.push(c.kategorie ?? '');
  while (v.ids.length > VERLAUF_LAENGE) v.ids.shift();
  while (v.kategorien.length > 3) v.kategorien.shift();
}

/**
 * Wählt den nächsten Einsatz: passend zur Schwierigkeit, nie einen der letzten Einsätze,
 * bevorzugt neue und noch nicht gemeisterte, und möglichst aus einem anderen Bereich als zuletzt
 * (Herz, Atmung, Verletzungen, Kinder …). Extremfälle kommen nicht zweimal hintereinander.
 */
export function waehleEinsatz(
  alle: MedCase[],
  progress: Pick<Progress, 'difficulty' | 'bestStars'>,
  verlauf: Verlauf,
  zufall: () => number = Math.random,
): MedCase {
  const levels = DIFFICULTY_BY_ID[progress.difficulty].caseLevels;
  const pool = alle.filter((c) => levels.includes(c.difficulty));
  const fenster = Math.max(1, Math.min(VERLAUF_LAENGE, Math.floor(pool.length / 2)));
  const gesperrt = new Set(verlauf.ids.slice(-fenster));
  let kandidaten = pool.filter((c) => !gesperrt.has(c.id));
  if (kandidaten.length === 0) kandidaten = pool;

  const letzteId = verlauf.ids[verlauf.ids.length - 1];
  const letzterExtrem = alle.find((c) => c.id === letzteId)?.extrem === true;
  const jungeKategorien = new Set(verlauf.kategorien.slice(-2));

  const gewicht = (c: MedCase): number => {
    const sterne = progress.bestStars[c.id] ?? 0;
    let w = sterne === 0 ? 4 : sterne < 3 ? 3 : 1;
    if (c.kategorie && !jungeKategorien.has(c.kategorie)) w *= 2.5;
    if (c.extrem) w *= letzterExtrem ? 0 : 1.3;
    return w;
  };
  const gewichte = kandidaten.map(gewicht);
  const summe = gewichte.reduce((a, b) => a + b, 0);
  if (summe <= 0) return kandidaten[Math.floor(zufall() * kandidaten.length)];
  let r = zufall() * summe;
  for (let i = 0; i < kandidaten.length; i++) {
    r -= gewichte[i];
    if (r < 0) return kandidaten[i];
  }
  return kandidaten[kandidaten.length - 1];
}
