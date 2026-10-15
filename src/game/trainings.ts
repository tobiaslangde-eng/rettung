import { ablaeufeFuer } from './schritte';
import { archiveCount } from './detective';
import { Rolle } from './rolle';
import { Bereich } from './story';
import { Progress } from './storage';

export type TrainingId = 'detektiv' | 'schritte' | 'cpr' | 'wissen' | 'quiz' | 'manv';

export interface TrainingInfo {
  id: TrainingId & Bereich;
  icon: string;
  title: string;
  sub: string;
  /** Kurzer Stand, z. B. „Bestwert 8/10“ */
  stand?: string;
}

/** Trainings der Rolle in der Reihenfolge, in der die Geschichte sie einführt */
export function trainingsFuer(rolle: Rolle, p: Progress): TrainingInfo[] {
  const akten = archiveCount(p);
  const detektiv: TrainingInfo = {
    id: 'detektiv',
    icon: '🔍',
    title: 'Detektiv-Akten',
    sub: rolle === 'helfer' ? 'Woran erkennst du, was los ist? Je weniger Hinweise, desto mehr Punkte.' : 'Der Diagnose-Krimi – je weniger Hinweise, desto mehr Punkte.',
    stand: akten.solved > 0 ? `${akten.solved}/${akten.total} Akten` : undefined,
  };
  const schritte: TrainingInfo = {
    id: 'schritte',
    icon: '🧩',
    title: 'Schritt für Schritt',
    sub: rolle === 'helfer' ? 'Notruf, Seitenlage, Unfallstelle: die richtige Reihenfolge.' : 'ABCDE, SAMPLER, Übergabe: Abläufe, die sitzen müssen.',
    stand: p.ablaeufe.length > 0 ? `${p.ablaeufe.length}/${ablaeufeFuer(rolle).length} Abläufe` : undefined,
  };
  const cpr: TrainingInfo = {
    id: 'cpr',
    icon: '❤️',
    title: 'Herzdruckmassage',
    sub: 'Im richtigen Takt drücken – 100 bis 120 Mal pro Minute.',
    stand: p.cprBest > 0 ? `Bestwert ${p.cprBest} %` : undefined,
  };
  const wissen: TrainingInfo = {
    id: 'wissen',
    icon: '💡',
    title: 'Wissensfragen',
    sub: rolle === 'helfer' ? 'Erste Hilfe im Alltag, mit Erklärung nach jeder Antwort.' : 'Notruf, ABCDE, Krankheitsbilder – mit Erklärung.',
    stand: p.knowBest > 0 ? `Bestwert ${p.knowBest}/10` : undefined,
  };
  const quiz: TrainingInfo = {
    id: 'quiz',
    icon: '📈',
    title: 'Normwerte',
    sub: 'Ist der Messwert niedrig, normal oder hoch?',
    stand: p.quizBest > 0 ? `Bestwert ${p.quizBest}/10` : undefined,
  };
  const manv: TrainingInfo = {
    id: 'manv',
    icon: '🚨',
    title: 'Großeinsatz',
    sub: 'Viele Verletzte: richtig sichten in Rot, Gelb, Grün, Schwarz.',
    stand: p.manvBest > 0 ? `Bestwert ${p.manvBest}/8` : undefined,
  };
  return rolle === 'helfer' ? [wissen, schritte, cpr, detektiv] : [quiz, wissen, cpr, schritte, detektiv, manv];
}
