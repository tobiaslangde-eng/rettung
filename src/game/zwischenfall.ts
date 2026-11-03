import { MedCase } from '../data/cases';
import { KOLLAPS_ERWACHSENER, KOLLAPS_KIND, ZF_ALLGEMEIN, ZF_BASIS } from '../data/einsaetze/zwischenfaelle';
import { INCIDENTS, Incident } from '../data/incidents';
import { Difficulty } from './difficulty';

/** Chance auf einen zusätzlichen Zwischenfall aus der Lage vor Ort (Gefahr, Unruhe, Technik, Team, Zeit) */
const CHANCE_ALLGEMEIN: Record<Difficulty, number> = { leicht: 0.2, mittel: 0.35, schwer: 0.5 };

/** Zuletzt gezeigte allgemeine Zwischenfälle – damit nicht dauernd derselbe kommt */
const zuletzt: string[] = [];
const MERKE = 6;

/** Alle eigenen Zwischenfälle dieses Einsatzes (aus dem Fall selbst oder aus den Sammlungen) */
export function eigeneZwischenfaelle(c: MedCase): Incident[] {
  if (c.zwischenfaelle?.length) return c.zwischenfaelle;
  const basis = INCIDENTS[c.id];
  return [...(basis ? [basis] : []), ...(ZF_BASIS[c.id] ?? [])];
}

/**
 * Plant die Zwischenfälle für einen Durchgang.
 * Normale Einsätze: einer der eigenen Zwischenfälle (wechselt von Mal zu Mal), manchmal dazu ein Zwischenfall aus der Lage vor Ort.
 * Extremfälle: alle eigenen Zwischenfälle nacheinander.
 */
export function planeZwischenfaelle(c: MedCase, difficulty: Difficulty, zufall: () => number = Math.random): Incident[] {
  const eigene = eigeneZwischenfaelle(c);
  let gewaehlt: Incident[];
  if (c.extrem) gewaehlt = [...eigene];
  else if (eigene.length > 0) gewaehlt = [eigene[Math.floor(zufall() * eigene.length)]];
  else gewaehlt = [];

  // Ohne eigenen Zwischenfall gibt es immer einen aus der Lage vor Ort – kein Einsatz ohne Überraschung
  const chance = eigene.length === 0 ? 1 : CHANCE_ALLGEMEIN[difficulty];
  if (!c.extrem && zufall() < chance) {
    const artenDabei = new Set(gewaehlt.map((i) => i.art ?? 'medizin'));
    let kandidaten = ZF_ALLGEMEIN.filter((i) => !zuletzt.includes(i.text) && !artenDabei.has(i.art ?? 'medizin'));
    if (kandidaten.length === 0) kandidaten = ZF_ALLGEMEIN;
    const wahl = kandidaten[Math.floor(zufall() * kandidaten.length)];
    zuletzt.push(wahl.text);
    while (zuletzt.length > MERKE) zuletzt.shift();
    const spaetester = gewaehlt.reduce((m, i) => Math.max(m, i.afterMeasurements), 0);
    // Kommt der eigene Zwischenfall früh, folgt der allgemeine später – und umgekehrt
    gewaehlt.push({ ...wahl, afterMeasurements: spaetester >= 2 ? 1 : spaetester + 2 });
  }
  return gewaehlt.sort((a, b) => a.afterMeasurements - b.afterMeasurements);
}

/** Der Kollaps, wenn der Zustand des Patienten unter die Schwelle fällt (Kinder bekommen die Kinder-Variante) */
export function kollapsFuer(c: MedCase): Incident {
  const vorlage = c.patient.age <= 12 ? KOLLAPS_KIND : KOLLAPS_ERWACHSENER;
  const name = c.patient.name.split(' ')[0];
  const ersetze = (t: string) => t.split('{name}').join(name);
  return { ...vorlage, text: ersetze(vorlage.text), options: vorlage.options.map(ersetze) as Incident['options'], explanation: ersetze(vorlage.explanation) };
}
