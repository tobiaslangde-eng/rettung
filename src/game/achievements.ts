import { KATEGORIEN } from '../data/akten';
import { CASES } from '../data/cases';
import { HELFER_FAELLE } from '../data/helfer';
import { Rolle, aktiveRolle } from './rolle';
import { aktenListe, archiveCount, archivNachKategorie, detectiveGrades } from './detective';
import { Progress } from './storage';

export interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: (p: Progress) => boolean;
  /** Nur für diese Rolle (sonst für beide) */
  nur?: Rolle;
}

/** Bonuspunkte für jedes neu freigeschaltete Abzeichen */
export const BADGE_BONUS = 50;

/** Einsätze der aktiven Rolle (gleiche Felder für id, Schwierigkeit und Patient) */
const faelle = (): { id: string; difficulty: 1 | 2 | 3; patient: { age: number } }[] =>
  aktiveRolle() === 'helfer' ? HELFER_FAELLE : CASES;

const mastered = (p: Progress, level?: 1 | 2 | 3) =>
  faelle().filter((c) => (level === undefined || c.difficulty === level) && (p.bestStars[c.id] ?? 0) >= 3).length;

const kids = () => faelle().filter((c) => c.patient.age <= 12);

export const BADGES: Badge[] = [
  {
    id: 'erster',
    icon: '🚑',
    title: 'Erster Einsatz',
    description: 'Den ersten Einsatz abgeschlossen',
    earned: (p) => p.casesPlayed >= 1,
  },
  {
    id: 'perfekt',
    icon: '⭐',
    title: 'Lehrbuchreif',
    description: 'Einen Einsatz mit 3 Sternen gemeistert',
    earned: (p) => p.perfectRuns >= 1,
  },
  {
    id: 'routine',
    icon: '🕐',
    title: 'Routiniert',
    description: '25 Einsätze abgeschlossen',
    earned: (p) => p.casesPlayed >= 25,
  },
  { id: 'serie', icon: '🔥', title: 'Heiße Serie', description: '5 gute Einsätze in Folge', earned: (p) => p.streak >= 5 },
  {
    id: 'diagnostik',
    icon: '🩺',
    title: 'Diagnostiker/in',
    description: '25 richtige Diagnosen gestellt',
    earned: (p) => p.correctDiagnoses >= 25,
  },
  {
    id: 'basis',
    icon: '✅',
    title: 'Basis sitzt',
    description: 'Alle leichten Fälle mit 3 Sternen',
    earned: (p) => mastered(p, 1) === faelle().filter((c) => c.difficulty === 1).length,
  },
  {
    id: 'nerven',
    icon: '🧊',
    title: 'Nervenstark',
    description: 'Einen Einsatz auf „Schwer“ mit 2+ Sternen',
    nur: 'sani',
    earned: (p) => p.hardWins >= 1,
  },
  {
    id: 'normwerte',
    icon: '📈',
    title: 'Normwerte-Profi',
    description: '10 von 10 im Schnelltraining',
    nur: 'sani',
    earned: (p) => p.quizBest >= 10,
  },
  {
    id: 'gesehen',
    icon: '🗺️',
    title: 'Alles gesehen',
    description: 'Jeden Fall mindestens einmal gespielt',
    earned: (p) => faelle().every((c) => c.id in p.bestStars),
  },
  {
    id: 'dienst',
    icon: '📅',
    title: 'Zuverlässig',
    description: '3 Tage in Folge das Tagesziel erreicht',
    earned: (p) => p.bestDayStreak >= 3,
  },
  {
    id: 'woche',
    icon: '🗓️',
    title: 'Dienstwoche',
    description: '7 Tage in Folge das Tagesziel erreicht',
    earned: (p) => p.bestDayStreak >= 7,
  },
  {
    id: 'takt',
    icon: '❤️',
    title: 'Taktgefühl',
    description: 'Herzdruckmassage mit 90 % im Zielbereich',
    earned: (p) => p.cprBest >= 90,
  },
  {
    id: 'wissen',
    icon: '🧠',
    title: 'Wandelndes Lexikon',
    description: '10 von 10 bei den Wissensfragen',
    earned: (p) => p.knowBest >= 10,
  },
  {
    id: 'sichtung',
    icon: '🚨',
    title: 'Großeinsatz-Profi',
    description: 'Beim Großeinsatz alle 8 Verletzten richtig gesichtet',
    nur: 'sani',
    earned: (p) => p.manvBest >= 8,
  },
  {
    id: 'kinder',
    icon: '🧸',
    title: 'Kinderretter/in',
    description: 'Alle Kinder-Einsätze mit mindestens 2 Sternen',
    earned: (p) => kids().every((c) => (p.bestStars[c.id] ?? 0) >= 2),
  },
  {
    id: 'werkstatt',
    icon: '🔧',
    title: 'Erste Aufrüstung',
    description: 'Das eigene Fahrzeug zum ersten Mal aufgerüstet',
    earned: (p) => Object.values(p.equipment).some((l) => l >= 2),
  },
  {
    id: 'hightech',
    icon: '⚡',
    title: 'Hightech-Wache',
    description: 'Alle Ausrüstung auf der höchsten Stufe',
    earned: (p) => Object.values(p.equipment).filter((l) => l >= 4).length >= 7,
  },
  {
    id: 'spuernase',
    icon: '🔍',
    title: 'Geniestreich',
    description: 'Eine Detektiv-Akte mit höchstens einem Hinweis gelöst',
    earned: (p) => Object.values(p.detectiveSolved).some((s) => s === 2),
  },
  {
    id: 'kommissar',
    icon: '🎖️',
    title: 'Kommissar/in',
    description: 'Den Detektiv-Rang Kommissar/in erreicht',
    earned: (p) => archiveCount(p).solved >= detectiveGrades()[3].min,
  },
  {
    id: 'allrounder',
    icon: '🧭',
    title: 'Allrounder',
    description: 'In jeder Kategorie des Archivs eine Detektiv-Akte gelöst',
    earned: (p) =>
      KATEGORIEN.filter((k) => aktenListe().some((a) => a.kategorie === k.id)).every((k) =>
        aktenListe().some((a) => a.kategorie === k.id && p.detectiveSolved[a.id]),
      ),
  },
  {
    id: 'gesichter',
    icon: '🧩',
    title: 'Viele Gesichter',
    description: 'Alle Situationen eines Krankheitsbilds im Archiv gelöst',
    earned: (p) => archivNachKategorie(p).some((k) => k.bilder.some((b) => b.total >= 3 && b.solved === b.total)),
  },
  {
    id: 'archivar',
    icon: '📚',
    title: 'Archivar/in',
    description: '50 Detektiv-Akten im Archiv gelöst',
    earned: (p) => archiveCount(p).solved >= 50,
  },
  {
    id: 'archiv',
    icon: '🗄️',
    title: 'Akte geschlossen',
    description: 'Alle Detektiv-Akten im Archiv gelöst',
    earned: (p) => aktenListe().every((a) => p.detectiveSolved[a.id]),
  },
  {
    id: 'meister',
    icon: '🏆',
    title: 'Meister/in',
    description: 'Alle Fälle mit 3 Sternen gemeistert',
    earned: (p) => mastered(p) === faelle().length,
  },
];

/** Prüft neue Abzeichen, schreibt sie in den Fortschritt und vergibt Bonuspunkte. */
/** Abzeichen der aktiven Rolle */
export const badgesFuerRolle = () => BADGES.filter((b) => !b.nur || b.nur === aktiveRolle());

export function awardBadges(p: Progress): { progress: Progress; newBadges: Badge[] } {
  const newBadges = badgesFuerRolle().filter((b) => !p.badges.includes(b.id) && b.earned(p));
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
