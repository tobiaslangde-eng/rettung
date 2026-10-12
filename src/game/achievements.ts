import { CASES } from '../data/cases';
import { Progress } from './storage';

export interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: (p: Progress) => boolean;
}

/** Bonuspunkte für jedes neu freigeschaltete Abzeichen */
export const BADGE_BONUS = 50;

const mastered = (p: Progress, level?: 1 | 2 | 3) =>
  CASES.filter((c) => (level === undefined || c.difficulty === level) && (p.bestStars[c.id] ?? 0) >= 3).length;

export const BADGES: Badge[] = [
  { id: 'erster', icon: '🚑', title: 'Erster Einsatz', description: 'Den ersten Einsatz abgeschlossen', earned: (p) => p.casesPlayed >= 1 },
  { id: 'perfekt', icon: '⭐', title: 'Lehrbuchreif', description: 'Einen Einsatz mit 3 Sternen gemeistert', earned: (p) => p.perfectRuns >= 1 },
  { id: 'routine', icon: '🕐', title: 'Routiniert', description: '25 Einsätze abgeschlossen', earned: (p) => p.casesPlayed >= 25 },
  { id: 'serie', icon: '🔥', title: 'Heiße Serie', description: '5 gute Einsätze in Folge', earned: (p) => p.streak >= 5 },
  { id: 'diagnostik', icon: '🩺', title: 'Diagnostiker/in', description: '25 richtige Diagnosen gestellt', earned: (p) => p.correctDiagnoses >= 25 },
  { id: 'basis', icon: '✅', title: 'Basis sitzt', description: 'Alle leichten Fälle mit 3 Sternen', earned: (p) => mastered(p, 1) === CASES.filter((c) => c.difficulty === 1).length },
  { id: 'nerven', icon: '🧊', title: 'Nervenstark', description: 'Einen Einsatz auf „Schwer“ mit 2+ Sternen', earned: (p) => p.hardWins >= 1 },
  { id: 'normwerte', icon: '📈', title: 'Normwerte-Profi', description: '10 von 10 im Schnelltraining', earned: (p) => p.quizBest >= 10 },
  { id: 'gesehen', icon: '🗺️', title: 'Alles gesehen', description: 'Jeden Fall mindestens einmal gespielt', earned: (p) => CASES.every((c) => c.id in p.bestStars) },
  { id: 'meister', icon: '🏆', title: 'Meister/in', description: 'Alle Fälle mit 3 Sternen gemeistert', earned: (p) => mastered(p) === CASES.length },
];

/** Prüft neue Abzeichen, schreibt sie in den Fortschritt und vergibt Bonuspunkte. */
export function awardBadges(p: Progress): { progress: Progress; newBadges: Badge[] } {
  const newBadges = BADGES.filter((b) => !p.badges.includes(b.id) && b.earned(p));
  if (newBadges.length === 0) return { progress: p, newBadges };
  return {
    progress: {
      ...p,
      badges: [...p.badges, ...newBadges.map((b) => b.id)],
      totalPoints: p.totalPoints + newBadges.length * BADGE_BONUS,
    },
    newBadges,
  };
}
