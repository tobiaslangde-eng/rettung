import { Progress } from './storage';

/** Tagesserie: Belohnung für Tage in Folge mit erreichtem Tagesziel */
export const SERIE_MEILENSTEINE = [
  { tage: 3, punkte: 30 },
  { tage: 7, punkte: 100 },
  { tage: 14, punkte: 200 },
  { tage: 30, punkte: 500 },
];

/** Vergibt Belohnungen für neu erreichte Meilensteine (Serie = aktuelle Tage in Folge) */
export function mitSerienBonus(p: Progress): { progress: Progress; bonus: number; tage: number } {
  let bonus = 0;
  let tage = 0;
  const belohnt = [...p.serieBelohnt];
  for (const m of SERIE_MEILENSTEINE) {
    if (p.dayStreak >= m.tage && !belohnt.includes(m.tage)) {
      belohnt.push(m.tage);
      bonus += m.punkte;
      tage = m.tage;
    }
  }
  if (bonus === 0) return { progress: p, bonus: 0, tage: 0 };
  return { progress: { ...p, serieBelohnt: belohnt, totalPoints: p.totalPoints + bonus, budget: p.budget + bonus }, bonus, tage };
}

/** Nächster Meilenstein, den man noch nicht erreicht hat */
export const naechsterMeilenstein = (tage: number) => SERIE_MEILENSTEINE.find((m) => m.tage > tage) ?? null;
