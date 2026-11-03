import { AKTEN } from '../akten';
import { BASIS_CASES, MedCase, Treatment } from '../casesBasis';
import { INCIDENTS, Incident } from '../incidents';
import { BEHANDLUNG, BEHANDLUNG_FALL, Behandlung } from './behandlung';
import { EXTREM } from './extremfaelle';
import { ZF_BASIS } from './zwischenfaelle';
import { ZF_BILD } from './zwischenfaelle2';

const BASIS_BY_ID = new Map(BASIS_CASES.map((c) => [c.id, c]));
const BASIS_IDS = new Set(BASIS_CASES.map((c) => c.id));
const vorname = (name: string) => name.split(' ')[0];

const alsListe = (b: Behandlung): Treatment[] => [
  ...b.richtig.map((text) => ({ text, correct: true })),
  ...b.falsch.map((text) => ({ text, correct: false })),
];

/** Ersetzt den Platzhalter {name} bzw. den Vornamen des Ursprungs-Falls durch den Vornamen des Patienten */
function mitName(i: Incident, von: string | null, nach: string): Incident {
  const ersetze = (s: string) => {
    const t = s.split('{name}').join(nach);
    return von ? t.split(von).join(nach) : t;
  };
  return { ...i, text: ersetze(i.text), options: i.options.map(ersetze) as Incident['options'], explanation: ersetze(i.explanation) };
}

/** Eigene Zwischenfälle eines ursprünglichen Einsatzes (für Akten desselben Krankheitsbilds mit gleichem Geschlecht) */
const basisZwischenfaelle = (id: string): Incident[] => {
  const b = INCIDENTS[id];
  return [...(b ? [b] : []), ...(ZF_BASIS[id] ?? [])];
};

function ausAkte(a: (typeof AKTEN)[number]): MedCase {
  const basis = BASIS_BY_ID.get(a.bild);
  const name = vorname(a.patient.name);
  const eigene = BEHANDLUNG_FALL[a.id] ?? BEHANDLUNG[a.bild];
  let treatments: Treatment[];
  if (eigene) treatments = alsListe(eigene);
  else if (basis) {
    const von = vorname(basis.patient.name);
    treatments = basis.treatments.map((t) => ({ ...t, text: t.text.split(von).join(name) }));
  } else throw new Error(`Einsatz „${a.id}“: keine Behandlung für „${a.bild}“`);

  let zwischenfaelle: Incident[] | undefined;
  if (EXTREM[a.id]) zwischenfaelle = EXTREM[a.id].map((i) => mitName(i, null, name));
  else if (ZF_BILD[a.bild]) zwischenfaelle = ZF_BILD[a.bild].map((i) => mitName(i, null, name));
  else if (basis && basis.patient.sex === a.patient.sex) {
    const liste = basisZwischenfaelle(a.bild);
    if (liste.length > 0) zwischenfaelle = liste.map((i) => mitName(i, vorname(basis.patient.name), name));
  }

  return {
    id: a.id,
    diagnosis: a.diagnosis,
    distractors: a.distractors,
    difficulty: a.difficulty,
    patient: a.patient,
    location: a.location,
    dispatch: a.dispatch,
    scene: a.scene,
    anamnese: a.anamnese,
    befund: a.befund,
    vitals: a.vitals,
    keyVitals: a.keyVitals,
    treatments,
    leitsymptome: a.leitsymptome,
    explanation: a.explanation,
    kategorie: a.kategorie,
    extrem: !!EXTREM[a.id],
    zwischenfaelle,
  };
}

/** Alle weiteren Einsätze: die Situationen der Detektiv-Akten, hier mit Behandlung und Zwischenfällen */
export const PLUS_CASES: MedCase[] = AKTEN.filter((a) => !BASIS_IDS.has(a.id)).map(ausAkte);
