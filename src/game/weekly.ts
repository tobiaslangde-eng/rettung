import { Progress } from './storage';

/** ISO-Kalenderwoche als JJJJ-Www (Woche beginnt am Montag). */
export function weekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day); // Donnerstag derselben Woche
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/** Die letzten `n` Wochen bis einschließlich der aktuellen, älteste zuerst. */
export function lastWeeks(n: number, d = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => weekKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7 * (n - 1 - i))));
}

const HISTORY_WEEKS = 12;

/** Schließt eine vergangene Woche ab und beginnt die aktuelle. */
function rollover(p: Progress, key: string): Progress {
  if (p.weekKey === key) return p;
  const history = p.weekKey && p.weekPoints > 0 ? [...p.weekHistory, { week: p.weekKey, points: p.weekPoints }] : p.weekHistory;
  return { ...p, weekKey: key, weekPoints: 0, weekHistory: history.slice(-HISTORY_WEEKS) };
}

export function bestPastWeek(p: Progress): number {
  return p.weekHistory.reduce((m, w) => Math.max(m, w.points), 0);
}

/** Bucht EP auf die aktuelle Woche. `newRecord`: Diese Woche hat gerade den bisherigen Rekord überholt. */
export function addWeekPoints(p: Progress, delta: number, d = new Date()): { progress: Progress; newRecord: boolean } {
  const rolled = rollover(p, weekKey(d));
  const best = bestPastWeek(rolled);
  const before = rolled.weekPoints;
  const after = before + Math.max(0, delta);
  return { progress: { ...rolled, weekPoints: after }, newRecord: best > 0 && before <= best && after > best };
}

export interface WeekView {
  current: number;
  last: number;
  best: number;
  /** EP der letzten 6 Wochen (älteste zuerst), die letzte ist die aktuelle */
  bars: { week: string; points: number }[];
}

export function weekView(p: Progress, d = new Date()): WeekView {
  const rolled = rollover(p, weekKey(d));
  const keys = lastWeeks(6, d);
  const pts = (k: string) => (k === rolled.weekKey ? rolled.weekPoints : rolled.weekHistory.find((w) => w.week === k)?.points ?? 0);
  return {
    current: rolled.weekPoints,
    last: pts(keys[keys.length - 2]),
    best: bestPastWeek(rolled),
    bars: keys.map((k) => ({ week: k, points: pts(k) })),
  };
}
