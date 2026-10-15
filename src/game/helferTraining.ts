import { NOTRUF_SZENARIEN } from '../data/notruf';
import { PACKLISTEN } from '../data/packlisten';
import { ZUERST_FRAGEN } from '../data/zuerst';
import { NotrufSzenario, Packliste, ZuerstFrage } from '../data/helferTraining';
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
