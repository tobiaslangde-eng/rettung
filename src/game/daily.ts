import { CASES, MedCase } from '../data/cases';
import { DIFFICULTY_BY_ID } from './difficulty';
import { Progress } from './storage';

/** Einsätze pro Tag für das Tagesziel */
export const DAILY_GOAL = 3;
/** Aufschlag auf die Punkte des „Einsatz des Tages“ */
export const DAILY_CASE_BONUS = 0.5;

const pad = (n: number) => String(n).padStart(2, '0');

/** Heutiges Datum in Ortszeit als JJJJ-MM-TT. */
export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function previousDayKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d - 1));
}

/** Bonus für das erreichte Tagesziel – steigt mit der Dienst-Serie (inkl. heute), max. 100. */
export function dailyGoalBonus(dayStreak: number): number {
  return 40 + 10 * Math.min(dayStreak, 6);
}

/** Der „Einsatz des Tages“: für alle gleich an einem Tag, passend zur Schwierigkeit. */
export function dailyCase(p: Progress, key = todayKey()): MedCase {
  const levels = DIFFICULTY_BY_ID[p.difficulty].caseLevels;
  const pool = CASES.filter((c) => levels.includes(c.difficulty));
  let h = 0;
  for (const ch of key + p.difficulty) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

export interface DayState {
  cases: number;
  goalDone: boolean;
  /** Aktuelle Dienst-Serie; 0, wenn gestern und heute das Ziel verpasst wurde */
  streak: number;
  dailyCaseDone: boolean;
}

export function dayState(p: Progress, key = todayKey()): DayState {
  const alive = p.lastGoalDay === key || p.lastGoalDay === previousDayKey(key);
  return {
    cases: p.dayKey === key ? p.dayCases : 0,
    goalDone: p.lastGoalDay === key,
    streak: alive ? p.dayStreak : 0,
    dailyCaseDone: p.dailyCaseDay === key,
  };
}

/**
 * Zählt einen abgeschlossenen Einsatz für den Tagesdienst.
 * Gibt den Bonus zurück, falls das Tagesziel gerade erreicht wurde.
 */
export function registerDailyCase(p: Progress, isDailyCase: boolean, key = todayKey()): { progress: Progress; goalBonus: number } {
  const before = dayState(p, key);
  const cases = before.cases + 1;
  let next: Progress = {
    ...p,
    dayKey: key,
    dayCases: cases,
    dailyCaseDay: isDailyCase ? key : p.dailyCaseDay,
  };
  if (before.goalDone || cases < DAILY_GOAL) return { progress: next, goalBonus: 0 };
  const streak = before.streak + 1;
  next = { ...next, lastGoalDay: key, dayStreak: streak, bestDayStreak: Math.max(p.bestDayStreak, streak) };
  return { progress: next, goalBonus: dailyGoalBonus(streak) };
}
