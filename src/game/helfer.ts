import { HelferFall } from '../data/helfer';

/** EP im Ersthelfer-Notfall */
export const HELFER_PUNKTE = {
  /** je wichtige Prüfung, die gemacht wurde */
  pruefung: 15,
  /** richtige Einschätzung „Was ist los?“ */
  erkannt: 40,
  /** je richtige Maßnahme */
  richtig: 20,
  /** Abzug je falsche Maßnahme */
  falsch: 15,
};

const FAKTOR: Record<1 | 2 | 3, number> = { 1: 1, 2: 1.25, 3: 1.5 };

export interface HelferErgebnis {
  fallId: string;
  pruefungen: { gemacht: number; wichtig: number };
  erkannt: boolean;
  massnahmen: { richtig: number; falsch: number; verpasst: number; alle: number };
  zeilen: { label: string; punkte: number }[];
  /** EP vor Ausrüstungs- und Tagesbonus */
  punkte: number;
  sterne: number;
}

/** Bewertet einen Ersthelfer-Notfall */
export interface HelferBonus {
  falschWeniger: number;
  pruefungPlus: number;
  richtigPlus: number;
}

export function bewerteHelfer(f: HelferFall, gepruefte: number[], antwort: string, gewaehlt: number[], bonus?: HelferBonus): HelferErgebnis {
  const pPruef = HELFER_PUNKTE.pruefung + (bonus?.pruefungPlus ?? 0);
  const pRichtig = HELFER_PUNKTE.richtig + (bonus?.richtigPlus ?? 0);
  const pFalsch = Math.max(3, HELFER_PUNKTE.falsch - (bonus?.falschWeniger ?? 0));
  const wichtig = f.checks.map((c, i) => (c.wichtig ? i : -1)).filter((i) => i >= 0);
  const gemacht = wichtig.filter((i) => gepruefte.includes(i)).length;
  const erkannt = antwort === f.diagnose;
  const richtigeIdx = f.massnahmen.map((m, i) => (m.richtig ? i : -1)).filter((i) => i >= 0);
  const richtig = gewaehlt.filter((i) => f.massnahmen[i].richtig).length;
  const falsch = gewaehlt.length - richtig;
  const verpasst = richtigeIdx.length - richtig;
  const k = FAKTOR[f.difficulty];
  const zeilen = [
    { label: `Wichtige Prüfungen (${gemacht} von ${wichtig.length})`, punkte: gemacht * pPruef },
    { label: erkannt ? 'Richtig erkannt' : 'Nicht richtig erkannt', punkte: erkannt ? HELFER_PUNKTE.erkannt : 0 },
    { label: `Richtige Maßnahmen (${richtig} von ${richtigeIdx.length})`, punkte: richtig * pRichtig },
  ];
  if (falsch > 0) zeilen.push({ label: `Falsche Maßnahmen (${falsch})`, punkte: -falsch * pFalsch });
  const roh = Math.max(0, zeilen.reduce((n, z) => n + z.punkte, 0));
  const max = wichtig.length * HELFER_PUNKTE.pruefung + HELFER_PUNKTE.erkannt + richtigeIdx.length * HELFER_PUNKTE.richtig;
  const anteil = roh / max;
  const sterne = anteil >= 0.85 && falsch === 0 ? 3 : anteil >= 0.6 ? 2 : anteil > 0 ? 1 : 0;
  if (k > 1) zeilen.push({ label: `Schwierigkeit ×${String(k).replace('.', ',')}`, punkte: Math.round(roh * k) - roh });
  return {
    fallId: f.id,
    pruefungen: { gemacht, wichtig: wichtig.length },
    erkannt,
    massnahmen: { richtig, falsch, verpasst, alle: richtigeIdx.length },
    zeilen,
    punkte: Math.round(roh * k),
    sterne,
  };
}
