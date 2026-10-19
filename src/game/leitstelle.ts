import { LEITSTELLE_SZENARIEN } from '../data/leitstelle/szenarien';
import { Einsatzmittel, LeitstelleSzenario } from '../data/leitstelle/types';
import { shuffle } from './scoring';

/** Leitstelle spielen: so viele Rückfragen darf man stellen */
export const LEITSTELLE_MAX_FRAGEN = 4;

/** Bevorzugt Szenarien, die noch nicht gelöst sind */
export function waehleLeitstelle(geloest: string[], letzte?: string): LeitstelleSzenario {
  const frei = LEITSTELLE_SZENARIEN.filter((s) => !geloest.includes(s.id) && s.id !== letzte);
  const pool = frei.length > 0 ? frei : LEITSTELLE_SZENARIEN.filter((s) => s.id !== letzte);
  return shuffle(pool)[0];
}

export interface LeitstelleErgebnis {
  wichtigGefragt: number;
  wichtigGesamt: number;
  richtig: Einsatzmittel[];
  falsch: Einsatzmittel[];
  fehlt: Einsatzmittel[];
  punkte: number;
  geloest: boolean;
}

export function bewerteLeitstelle(s: LeitstelleSzenario, gestellt: number[], gewaehlt: Einsatzmittel[]): LeitstelleErgebnis {
  const wichtigGesamt = s.fragen.filter((f) => f.wichtig).length;
  const wichtigGefragt = gestellt.filter((i) => s.fragen[i]?.wichtig).length;
  const richtig = gewaehlt.filter((m) => s.mittel.includes(m));
  const falsch = gewaehlt.filter((m) => !s.mittel.includes(m));
  const fehlt = s.mittel.filter((m) => !gewaehlt.includes(m));
  const perfekt = falsch.length === 0 && fehlt.length === 0;
  const punkte = Math.max(0, wichtigGefragt * 10 + richtig.length * 15 - falsch.length * 10 + (perfekt ? 10 : 0));
  return {
    wichtigGefragt,
    wichtigGesamt,
    richtig,
    falsch,
    fehlt,
    punkte,
    geloest: perfekt && wichtigGefragt >= wichtigGesamt - 1,
  };
}
