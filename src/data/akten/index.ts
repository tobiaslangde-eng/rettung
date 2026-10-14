import { CASES, MedCase } from '../cases';
import { AKTEN_ATMUNG, BILDER_ATMUNG } from './atmung';
import { AKTEN_BAUCH, BILDER_BAUCH } from './bauch';
import { AKTEN_FRAUEN, BILDER_FRAUEN } from './frauen';
import { AKTEN_HERZ, BILDER_HERZ } from './herz';
import { AKTEN_KINDER, BILDER_KINDER } from './kinder';
import { AKTEN_NEURO, BILDER_NEURO } from './neuro';
import { AKTEN_TRAUMA, BILDER_TRAUMA } from './trauma';
import { AKTEN_TRAUMA2, BILDER_TRAUMA2 } from './trauma2';
import { AKTEN_UMWELT, BILDER_UMWELT } from './umwelt';
import { AKTEN_UMWELT2, BILDER_UMWELT2 } from './umwelt2';
import { AktenBild, AktenFall, DetektivFall, Kategorie } from './types';

export { KATEGORIEN } from './types';
export type { AktenBild, DetektivFall, Kategorie } from './types';

/**
 * Detektiv-Akten: viele Situationen zu jedem Krankheitsbild.
 * Die 28 Einsatz-Fälle sind die ersten Akten (ihre Kennungen stehen im Spielstand), dazu kommen weitere Situationen
 * und weitere Krankheitsbilder aus den Dateien dieses Ordners.
 */
const BASIS_KATEGORIE: Record<string, Kategorie> = {
  stemi: 'herz',
  hypertensiv: 'herz',
  lungenoedem: 'herz',
  synkope: 'herz',
  asthma: 'atmung',
  copd: 'atmung',
  hyperventilation: 'atmung',
  le: 'atmung',
  stroke: 'neuro',
  krampf: 'neuro',
  hypo: 'bauch',
  ketoazidose: 'bauch',
  nierenkolik: 'bauch',
  sepsis: 'bauch',
  fraktur: 'trauma',
  sht: 'trauma',
  verbrennung: 'trauma',
  pneumothorax: 'trauma',
  hypothermie: 'umwelt',
  hitzschlag: 'umwelt',
  co: 'umwelt',
  alkohol: 'umwelt',
  opioid: 'umwelt',
  anaphylaxie: 'umwelt',
  fieberkrampf: 'kinder',
  pseudokrupp: 'kinder',
  aspiration: 'kinder',
  exsikkose: 'kinder',
};

const BASIS_BILDER: AktenBild[] = CASES.map((c) => ({
  id: c.id,
  diagnosis: c.diagnosis,
  kategorie: BASIS_KATEGORIE[c.id],
  leitsymptome: c.leitsymptome,
}));

/** Alle Krankheitsbilder (je Bild gibt es mehrere Akten) */
export const BILDER: AktenBild[] = [
  ...BASIS_BILDER,
  ...BILDER_HERZ,
  ...BILDER_ATMUNG,
  ...BILDER_NEURO,
  ...BILDER_BAUCH,
  ...BILDER_TRAUMA,
  ...BILDER_TRAUMA2,
  ...BILDER_UMWELT,
  ...BILDER_UMWELT2,
  ...BILDER_KINDER,
  ...BILDER_FRAUEN,
];

const BILD_BY_ID = new Map(BILDER.map((b) => [b.id, b]));

const NEUE_FAELLE: AktenFall[] = [
  ...AKTEN_HERZ,
  ...AKTEN_ATMUNG,
  ...AKTEN_NEURO,
  ...AKTEN_BAUCH,
  ...AKTEN_TRAUMA,
  ...AKTEN_TRAUMA2,
  ...AKTEN_UMWELT,
  ...AKTEN_UMWELT2,
  ...AKTEN_KINDER,
  ...AKTEN_FRAUEN,
];

function ausEinsatzFall(c: MedCase): DetektivFall {
  return {
    id: c.id,
    bild: c.id,
    kategorie: BASIS_KATEGORIE[c.id],
    diagnosis: c.diagnosis,
    difficulty: c.difficulty,
    patient: c.patient,
    location: c.location,
    dispatch: c.dispatch,
    scene: c.scene,
    anamnese: c.anamnese,
    befund: c.befund,
    vitals: c.vitals,
    keyVitals: c.keyVitals,
    distractors: c.distractors,
    explanation: c.explanation,
    leitsymptome: c.leitsymptome,
  };
}

function ausAkte(f: AktenFall): DetektivFall {
  const bild = BILD_BY_ID.get(f.bild);
  if (!bild) throw new Error(`Akte „${f.id}“: unbekanntes Krankheitsbild „${f.bild}“`);
  return { ...f, diagnosis: bild.diagnosis, kategorie: bild.kategorie, leitsymptome: f.leitsymptome ?? bild.leitsymptome };
}

/** Alle Akten in fester Reihenfolge (die Aktennummer im Spiel ist die Position + 1) */
export const AKTEN: DetektivFall[] = [...CASES.map(ausEinsatzFall), ...NEUE_FAELLE.map(ausAkte)];

export const AKTE_BY_ID = new Map(AKTEN.map((a) => [a.id, a]));
