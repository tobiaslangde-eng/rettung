import { NOTRUF_SZENARIEN } from '../data/notruf';
import { AED_SZENARIEN } from '../data/aed';
import { PACKLISTEN } from '../data/packlisten';
import { GEFAHREN_HELFER } from '../data/gefahren/helfer';
import { GEFAHREN_SANI } from '../data/gefahren/sani';
import { LABOR_UEBUNGEN } from '../data/labor';
import { LEITSTELLE_SZENARIEN } from '../data/leitstelle/szenarien';
import { fehlerSzenarienFuer } from './fehler';
import { ablaeufeFuer } from './schritte';
import { archiveCount } from './detective';
import { Rolle } from './rolle';
import { Bereich } from './story';
import { Progress } from './storage';
import { colors, tiles } from '../theme';

/** Übungen im Handgriff-Labor (Druckverband und Seitenlage plus die Schritt-Übungen) */
export const LABOR_ANZAHL = 2 + LABOR_UEBUNGEN.length;

export type TrainingId =
  | 'detektiv'
  | 'schritte'
  | 'cpr'
  | 'wissen'
  | 'quiz'
  | 'manv'
  | 'notruf'
  | 'zuerst'
  | 'pack'
  | 'handgriffe'
  | 'mythen'
  | 'aed'
  | 'pruefung'
  | 'gefahr'
  | 'leitstelle'
  | 'fehler'
  | 'labor';

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
    farbe: tiles.violet.bg,
    icon: '🔍',
    title: 'Detektiv-Akten',
    sub:
      rolle === 'helfer'
        ? 'Woran erkennst du, was los ist? Je weniger Hinweise, desto mehr EP.'
        : 'Der Diagnose-Krimi – je weniger Hinweise, desto mehr EP.',
    stand: akten.solved > 0 ? `${akten.solved}/${akten.total} Akten` : undefined,
  };
  const schritte: TrainingInfo = {
    id: 'schritte',
    farbe: tiles.violet.bg,
    icon: '🧩',
    title: 'Schritt für Schritt',
    sub:
      rolle === 'helfer'
        ? 'Notruf, Seitenlage, Unfallstelle: die richtige Reihenfolge.'
        : 'ABCDE, SAMPLER, Übergabe: Abläufe, die sitzen müssen.',
    stand: p.ablaeufe.length > 0 ? `${p.ablaeufe.length}/${ablaeufeFuer(rolle).length} Abläufe` : undefined,
  };
  const cpr: TrainingInfo = {
    id: 'cpr',
    farbe: tiles.red.bg,
    icon: '❤️',
    title: 'Herzdruckmassage',
    sub: 'Im richtigen Takt drücken – 100 bis 120 Mal pro Minute.',
    stand: p.cprBest > 0 ? `Bestwert ${p.cprBest} %` : undefined,
  };
  const wissen: TrainingInfo = {
    id: 'wissen',
    farbe: tiles.amber.bg,
    icon: '💡',
    title: 'Wissensfragen',
    sub:
      rolle === 'helfer'
        ? 'Erste Hilfe im Alltag, mit Erklärung nach jeder Antwort.'
        : 'Notruf, ABCDE, Krankheitsbilder – mit Erklärung.',
    stand: p.knowBest > 0 ? `Bestwert ${p.knowBest}/10` : undefined,
  };
  const quiz: TrainingInfo = {
    id: 'quiz',
    farbe: tiles.blue.bg,
    icon: '📈',
    title: 'Normwerte',
    sub: 'Ist der Messwert niedrig, normal oder hoch?',
    stand: p.quizBest > 0 ? `Bestwert ${p.quizBest}/10` : undefined,
  };
  const manv: TrainingInfo = {
    id: 'manv',
    farbe: colors.peach,
    icon: '🚨',
    title: 'Großeinsatz',
    sub: 'Viele Verletzte: richtig sichten in Rot, Gelb, Grün, Schwarz.',
    stand: p.manvBest > 0 ? `Bestwert ${p.manvBest}/8` : undefined,
  };
  const notruf: TrainingInfo = {
    id: 'notruf',
    farbe: tiles.blue.bg,
    icon: '📞',
    title: 'Notruf üben',
    sub: 'Die Leitstelle fragt – du antwortest ruhig und klar.',
    stand: p.notrufGeschafft.length > 0 ? `${p.notrufGeschafft.length}/${NOTRUF_SZENARIEN.length} Szenarien` : undefined,
  };
  const zuerst: TrainingInfo = {
    id: 'zuerst',
    farbe: colors.peach,
    icon: '⚡',
    title: 'Was zuerst?',
    sub: 'Schnelle Entscheidungen: Was tust du als Erstes?',
    stand: p.zuerstBest > 0 ? `Bestwert ${p.zuerstBest}/10` : undefined,
  };
  const pack: TrainingInfo = {
    id: 'pack',
    farbe: tiles.teal.bg,
    icon: '🧰',
    title: 'Gut gepackt',
    sub: 'Was gehört in Verbandkasten, Rucksack und Hausapotheke?',
    stand: p.packGeschafft.length > 0 ? `${p.packGeschafft.length}/${PACKLISTEN.length} Listen` : undefined,
  };
  const handgriffe: TrainingInfo = {
    id: 'handgriffe',
    farbe: tiles.teal.bg,
    icon: '🩹',
    title: 'Handgriffe',
    sub: 'Lagern, verbinden, kühlen: Wie genau machst du es richtig?',
    stand: p.handgriffeBest > 0 ? `Bestwert ${p.handgriffeBest}/10` : undefined,
  };
  const mythen: TrainingInfo = {
    id: 'mythen',
    farbe: tiles.amber.bg,
    icon: '🧐',
    title: 'Mythos oder Wahrheit?',
    sub: 'Was Laien oft glauben – und was wirklich stimmt.',
    stand: p.mythenBest > 0 ? `Bestwert ${p.mythenBest}/10` : undefined,
  };
  const aed: TrainingInfo = {
    id: 'aed',
    farbe: tiles.red.bg,
    icon: '🔋',
    title: 'Defi-Training',
    sub: 'Das Gerät spricht mit dir: Pads, Analyse, Schock.',
    stand: p.aedGeschafft.length > 0 ? `${p.aedGeschafft.length}/${AED_SZENARIEN.length} Szenarien` : undefined,
  };
  const pruefung: TrainingInfo = {
    id: 'pruefung',
    farbe: tiles.violet.bg,
    icon: '🎓',
    title: 'Erste-Hilfe-Prüfung',
    sub: '20 Fragen aus dem ganzen Kurs – bestanden ab 16.',
    stand: p.pruefungBest > 0 ? `Bestwert ${p.pruefungBest}/20${p.pruefungBest >= 16 ? ' · bestanden' : ''}` : undefined,
  };
  const gefahr: TrainingInfo = {
    id: 'gefahr',
    farbe: colors.peach,
    icon: '⚠️',
    title: 'Gefahren-Check',
    sub:
      rolle === 'helfer'
        ? 'Eigenschutz zuerst: Finde alle Gefahren an der Einsatzstelle.'
        : 'Eigensicherung: Finde alle Gefahren, bevor du zum Patienten gehst.',
    stand:
      p.gefahrGeschafft.length > 0
        ? `${p.gefahrGeschafft.length}/${(rolle === 'helfer' ? GEFAHREN_HELFER : GEFAHREN_SANI).length} Szenen`
        : undefined,
  };
  const leitstelle: TrainingInfo = {
    id: 'leitstelle',
    farbe: tiles.blue.bg,
    icon: '🎧',
    title: 'Leitstelle spielen',
    sub: 'Du nimmst den Notruf an: richtig nachfragen und die passenden Fahrzeuge losschicken.',
    stand: p.leitstelleGeschafft.length > 0 ? `${p.leitstelleGeschafft.length}/${LEITSTELLE_SZENARIEN.length} Anrufe` : undefined,
  };
  const fehler: TrainingInfo = {
    id: 'fehler',
    farbe: tiles.pink.bg,
    icon: '🚩',
    title: 'Fehler finden',
    sub:
      rolle === 'helfer'
        ? 'Was macht der Helfer falsch? Finde die Fehler im Ablauf.'
        : 'Was macht der Kollege falsch? Finde die Fehler im Ablauf.',
    stand: p.fehlerGeschafft.length > 0 ? `${p.fehlerGeschafft.length}/${fehlerSzenarienFuer(rolle).length} Szenen` : undefined,
  };
  const labor: TrainingInfo = {
    id: 'labor',
    farbe: tiles.teal.bg,
    icon: '🧪',
    title: 'Handgriff-Labor',
    sub: 'Druckverband und stabile Seitenlage zum Selbermachen: ziehen, wickeln, tippen.',
    stand: p.laborGeschafft.length > 0 ? `${p.laborGeschafft.length}/${LABOR_ANZAHL} Übungen` : undefined,
  };
  return rolle === 'helfer'
    ? [wissen, schritte, cpr, notruf, mythen, zuerst, gefahr, pack, handgriffe, labor, fehler, leitstelle, aed, pruefung]
    : [quiz, wissen, cpr, gefahr, schritte, fehler, labor, detektiv, leitstelle, manv];
}

/** Gruppen im Training-Tab */
export const TRAINING_GRUPPEN: { titel: string; text: string; ids: TrainingId[] }[] = [
  { titel: 'Wissen & Prüfung', text: 'Fragen, Abläufe, Normwerte, Mythen', ids: ['wissen', 'quiz', 'schritte', 'mythen', 'zuerst', 'detektiv', 'pruefung'] },
  { titel: 'Praxis & Handgriffe', text: 'Wiederbelebung, Verbände, Defi, Packen', ids: ['cpr', 'handgriffe', 'labor', 'aed', 'pack', 'manv'] },
  { titel: 'Notfall-Szenarien', text: 'Notruf, Leitstelle, Gefahren, Fehler', ids: ['notruf', 'leitstelle', 'gefahr', 'fehler'] },
];
