import { NOTRUF_SZENARIEN } from '../data/notruf';
import { PACKLISTEN } from '../data/packlisten';
import { ablaeufeFuer } from './schritte';
import { archiveCount } from './detective';
import { Rolle } from './rolle';
import { Bereich } from './story';
import { Progress } from './storage';

export type TrainingId = 'detektiv' | 'schritte' | 'cpr' | 'wissen' | 'quiz' | 'manv' | 'notruf' | 'zuerst' | 'pack';

export interface TrainingInfo {
  id: TrainingId & Bereich;
  icon: string;
  title: string;
  sub: string;
  /** Kurzer Stand, z. B. „Bestwert 8/10“ */
  stand?: string;
  /** Sanfte Farbe der Kachel */
  farbe: string;
}

/** Trainings der Rolle in der Reihenfolge, in der die Geschichte sie einführt */
export function trainingsFuer(rolle: Rolle, p: Progress): TrainingInfo[] {
  const akten = archiveCount(p);
  const detektiv: TrainingInfo = {
    id: 'detektiv',
    farbe: '#E8E6FB',
    icon: '🔍',
    title: 'Detektiv-Akten',
    sub: rolle === 'helfer' ? 'Woran erkennst du, was los ist? Je weniger Hinweise, desto mehr Punkte.' : 'Der Diagnose-Krimi – je weniger Hinweise, desto mehr Punkte.',
    stand: akten.solved > 0 ? `${akten.solved}/${akten.total} Akten` : undefined,
  };
  const schritte: TrainingInfo = {
    id: 'schritte',
    farbe: '#EEE8FB',
    icon: '🧩',
    title: 'Schritt für Schritt',
    sub: rolle === 'helfer' ? 'Notruf, Seitenlage, Unfallstelle: die richtige Reihenfolge.' : 'ABCDE, SAMPLER, Übergabe: Abläufe, die sitzen müssen.',
    stand: p.ablaeufe.length > 0 ? `${p.ablaeufe.length}/${ablaeufeFuer(rolle).length} Abläufe` : undefined,
  };
  const cpr: TrainingInfo = {
    id: 'cpr',
    farbe: '#FDE8E6',
    icon: '❤️',
    title: 'Herzdruckmassage',
    sub: 'Im richtigen Takt drücken – 100 bis 120 Mal pro Minute.',
    stand: p.cprBest > 0 ? `Bestwert ${p.cprBest} %` : undefined,
  };
  const wissen: TrainingInfo = {
    id: 'wissen',
    farbe: '#FFF3D0',
    icon: '💡',
    title: 'Wissensfragen',
    sub: rolle === 'helfer' ? 'Erste Hilfe im Alltag, mit Erklärung nach jeder Antwort.' : 'Notruf, ABCDE, Krankheitsbilder – mit Erklärung.',
    stand: p.knowBest > 0 ? `Bestwert ${p.knowBest}/10` : undefined,
  };
  const quiz: TrainingInfo = {
    id: 'quiz',
    farbe: '#E1ECFD',
    icon: '📈',
    title: 'Normwerte',
    sub: 'Ist der Messwert niedrig, normal oder hoch?',
    stand: p.quizBest > 0 ? `Bestwert ${p.quizBest}/10` : undefined,
  };
  const manv: TrainingInfo = {
    id: 'manv',
    farbe: '#FDEBDD',
    icon: '🚨',
    title: 'Großeinsatz',
    sub: 'Viele Verletzte: richtig sichten in Rot, Gelb, Grün, Schwarz.',
    stand: p.manvBest > 0 ? `Bestwert ${p.manvBest}/8` : undefined,
  };
  const notruf: TrainingInfo = {
    id: 'notruf',
    farbe: '#DDF0FB',
    icon: '📞',
    title: 'Notruf üben',
    sub: 'Die Leitstelle fragt – du antwortest ruhig und klar.',
    stand: p.notrufGeschafft.length > 0 ? `${p.notrufGeschafft.length}/${NOTRUF_SZENARIEN.length} Szenarien` : undefined,
  };
  const zuerst: TrainingInfo = {
    id: 'zuerst',
    farbe: '#FFE9D6',
    icon: '⚡',
    title: 'Was zuerst?',
    sub: 'Schnelle Entscheidungen: Was tust du als Erstes?',
    stand: p.zuerstBest > 0 ? `Bestwert ${p.zuerstBest}/10` : undefined,
  };
  const pack: TrainingInfo = {
    id: 'pack',
    farbe: '#DDF5E8',
    icon: '🧰',
    title: 'Gut gepackt',
    sub: 'Was gehört in Verbandkasten, Rucksack und Hausapotheke?',
    stand: p.packGeschafft.length > 0 ? `${p.packGeschafft.length}/${PACKLISTEN.length} Listen` : undefined,
  };
  return rolle === 'helfer' ? [wissen, schritte, cpr, notruf, zuerst, pack, detektiv] : [quiz, wissen, cpr, schritte, detektiv, manv];
}
