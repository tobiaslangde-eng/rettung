import { AED_SZENARIEN } from '../data/aed';
import { HANDGRIFFE } from '../data/handgriffe';
import { HELFER_FRAGEN } from '../data/helferFragen';
import { HELFER_FRAGEN_2 } from '../data/helferFragen2';
import { MYTHEN } from '../data/mythen';
import { NOTRUF_SZENARIEN } from '../data/notruf';
import { PACKLISTEN } from '../data/packlisten';
import { ZUERST_FRAGEN } from '../data/zuerst';
import { Mythos, NotrufSzenario, Packliste, ZuerstFrage } from '../data/helferTraining';
import { shuffle } from './scoring';

/** Notruf üben */
export const NOTRUF_PUNKTE_PRO_ANTWORT = 8;
export const NOTRUF_BONUS = 10;
/** Ab so vielen richtigen Antworten gilt ein Szenario als geschafft */
export const NOTRUF_GESCHAFFT_AB = 4;

export function waehleNotruf(geloest: string[]): NotrufSzenario {
  const neu = NOTRUF_SZENARIEN.filter((s) => !geloest.includes(s.id));
  return shuffle(neu.length > 0 ? neu : NOTRUF_SZENARIEN)[0];
}

export const notrufPunkte = (richtig: number, gesamt: number) =>
  richtig * NOTRUF_PUNKTE_PRO_ANTWORT + (richtig === gesamt ? NOTRUF_BONUS : 0);

/** Was zuerst? */
export const ZUERST_RUNDEN = 10;
export const ZUERST_PUNKTE = 6;
export const ZUERST_BONUS = 10;

export const makeZuerst = (): ZuerstFrage[] => shuffle(ZUERST_FRAGEN).slice(0, ZUERST_RUNDEN);
export const zuerstPunkte = (richtig: number) => richtig * ZUERST_PUNKTE + (richtig === ZUERST_RUNDEN ? ZUERST_BONUS : 0);

/** Gut gepackt */
export const PACK_PUNKTE = 5;
export const PACK_BONUS = 15;

export function waehlePackliste(geloest: string[]): Packliste {
  const neu = PACKLISTEN.filter((p) => !geloest.includes(p.id));
  return shuffle(neu.length > 0 ? neu : PACKLISTEN)[0];
}

export interface PackErgebnis {
  richtig: number;
  falsch: number;
  vergessen: number;
  punkte: number;
  /** höchstens ein Fehler in Summe */
  geschafft: boolean;
}

export function bewertePackliste(p: Packliste, gewaehlt: number[]): PackErgebnis {
  const richtig = gewaehlt.filter((i) => p.items[i].gehoert).length;
  const falsch = gewaehlt.length - richtig;
  const vergessen = p.items.filter((i) => i.gehoert).length - richtig;
  const perfekt = falsch === 0 && vergessen === 0;
  return {
    richtig,
    falsch,
    vergessen,
    punkte: Math.max(0, (richtig - falsch) * PACK_PUNKTE) + (perfekt ? PACK_BONUS : 0),
    geschafft: falsch + vergessen <= 1,
  };
}

/** Eine Frage mit vier Antworten – die ERSTE ist richtig (gemeinsames Format für alle Frage-Spiele) */
export interface Frage4 {
  id: string;
  kopf: string;
  optionen: [string, string, string, string];
  erklaerung: string;
}

const ausZuerst = (z: ZuerstFrage): Frage4 => ({ id: z.id, kopf: z.lage, optionen: z.optionen, erklaerung: z.erklaerung });

export const makeZuerstFragen = (): Frage4[] => makeZuerst().map(ausZuerst);

/** Handgriffe */
export const HANDGRIFFE_RUNDEN = 10;
export const makeHandgriffe = (): Frage4[] => shuffle(HANDGRIFFE).slice(0, HANDGRIFFE_RUNDEN).map(ausZuerst);
export const handgriffePunkte = (richtig: number) => richtig * 6 + (richtig === HANDGRIFFE_RUNDEN ? 10 : 0);

/** Defi-Training: gleiche Spielform wie der Notruf, anderer Inhalt */
export function waehleAed(geloest: string[]): NotrufSzenario {
  const neu = AED_SZENARIEN.filter((s) => !geloest.includes(s.id));
  return shuffle(neu.length > 0 ? neu : AED_SZENARIEN)[0];
}

/** Mythos oder Wahrheit */
export const MYTHEN_RUNDEN = 10;
export const makeMythen = (): Mythos[] => shuffle(MYTHEN).slice(0, MYTHEN_RUNDEN);
export const mythenPunkte = (richtig: number) => richtig * 5 + (richtig === MYTHEN_RUNDEN ? 10 : 0);

/** Erste-Hilfe-Prüfung: gemischte Fragen aus Kurswissen, Entscheidungen und Handgriffen */
export const PRUEFUNG_FRAGEN = 20;
export const PRUEFUNG_BESTANDEN = 16;
export function makePruefung(): Frage4[] {
  const wissen: Frage4[] = [...HELFER_FRAGEN, ...HELFER_FRAGEN_2].map((q) => ({ id: q.id, kopf: q.question, optionen: q.answers, erklaerung: q.explanation }));
  const mix = [...shuffle(wissen).slice(0, 8), ...shuffle(ZUERST_FRAGEN).slice(0, 6).map(ausZuerst), ...shuffle(HANDGRIFFE).slice(0, 6).map(ausZuerst)];
  return shuffle(mix).slice(0, PRUEFUNG_FRAGEN);
}
export const pruefungPunkte = (richtig: number) => richtig * 8 + (richtig >= PRUEFUNG_BESTANDEN ? 40 : 0);
