import { MedCase } from '../data/cases';
import { ANTWORTEN, SPRECHER } from '../data/patientAntworten';

export type FrageId = 'passiert' | 'schmerz' | 'seit' | 'vorerkrankung' | 'medikamente' | 'allergien';

export const FRAGEN: { id: FrageId; label: string }[] = [
  { id: 'passiert', label: 'Was ist passiert?' },
  { id: 'schmerz', label: 'Wo tut es weh?' },
  { id: 'seit', label: 'Seit wann?' },
  { id: 'vorerkrankung', label: 'Vorerkrankungen?' },
  { id: 'medikamente', label: 'Medikamente?' },
  { id: 'allergien', label: 'Allergien?' },
];
const INDEX: Record<FrageId, number> = { passiert: 0, schmerz: 1, seit: 2, vorerkrankung: 3, medikamente: 4, allergien: 5 };

/** Unter diesem Zustand (in %) antwortet der Patient selbst gar nicht mehr */
export const NICHT_ANSPRECHBAR = 15;
/** Ab diesem Zustand (in %) antwortet er noch vollständig genug, dass wichtige Antworten zählen */
export const VOLLSTAENDIG_AB = 40;

export interface Antwort {
  frage: FrageId;
  sprecher: string;
  text: string;
  /** Zusatz unter der Sprechblase, z. B. „spricht stockend“ */
  meta: string;
  /** Wichtige Antwort, die vollständig angekommen ist (zählt für den Bonus) */
  wichtig: boolean;
}

/** Hat dieser Einsatz von Hand geschriebene Antworten (sonst werden sie aus der Anamnese abgeleitet)? */
export const hatEchteAntworten = (id: string): boolean => id in ANTWORTEN;

const ohneAnfuehrung = (s: string) => s.replace(/^[„"]+|[“"]+$/g, '').trim();

/** „Tochter: „Mama hustet.““ → Sprecher und Text; sonst spricht der Patient selbst */
function zerlege(zeile: string): { sprecher?: string; text: string } {
  const m = zeile.match(/^([A-ZÄÖÜ][\wäöüß-]{2,20}):\s*(.+)$/);
  if (m) return { sprecher: m[1], text: ohneAnfuehrung(m[2]) };
  return { text: ohneAnfuehrung(zeile) };
}

const MUSTER: Record<Exclude<FrageId, 'passiert'>, RegExp> = {
  schmerz: /tut|schmerz|druck|atemnot|luft|schwindel|übel|kopf|bauch|brust|brenn|zieh|kribbel/i,
  seit: /seit|vor \d|vor etwa|minuten|stunden|tage|wochen|gestern|heute|plötzlich/i,
  vorerkrankung: /bekannt|vorerkrank|diabet|bluthochdruck|raucher|asthma|epilepsie|herz|copd|demenz|zirrhose|dialyse|krebs/i,
  medikamente: /medikament|tablett|insulin|nimmt|spray|blutverdünn|marcumar|pille|therapie/i,
  allergien: /allerg/i,
};
const STANDARD: Record<FrageId, string> = {
  passiert: 'Das ging ganz plötzlich los.',
  schmerz: 'Mir geht es einfach schlecht.',
  seit: 'Das weiß ich nicht genau – es kam plötzlich.',
  vorerkrankung: 'Dazu kann ich nichts Besonderes sagen.',
  medikamente: 'Keine Medikamente, soweit ich weiß.',
  allergien: 'Keine Allergien bekannt.',
};

const saetze = (t: string) => t.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0);

/** Aus den Anamnese-Zeilen des Falls eine Antwort ableiten (für Einsätze ohne handgeschriebene Antworten) */
function abgeleitet(c: MedCase, frage: FrageId): { sprecher?: string; text: string } {
  const zeilen = c.anamnese;
  if (frage === 'passiert') return zerlege(zeilen[0] ?? c.dispatch);
  // Satz für Satz nach dem passenden Stichwort suchen (bei „Wo tut es weh?“ nicht den Satz der ersten Frage wiederholen)
  const start = frage === 'schmerz' && zeilen.length > 1 ? 1 : 0;
  for (let i = start; i < zeilen.length; i++) {
    const z = zerlege(zeilen[i]);
    const treffer = saetze(z.text).find((satz) => MUSTER[frage].test(satz));
    if (treffer) return { sprecher: z.sprecher, text: treffer };
  }
  if (frage === 'schmerz' && zeilen.length > 1) return zerlege(zeilen[1]);
  return { text: STANDARD[frage] };
}

/** Wenn nicht der Patient selbst spricht (Eltern, Zeugen), passt „Mir geht es schlecht“ nicht */
const aus3 = (text: string, sex: 'm' | 'w') =>
  text === STANDARD.schmerz ? `Es geht ${sex === 'm' ? 'ihm' : 'ihr'} einfach schlecht.` : text === STANDARD.medikamente ? 'Keine Medikamente, soweit ich weiß.' : text;

/** Wie der Patient bei diesem Zustand spricht: stockend, kaum noch oder gar nicht */
export function sprechweise(text: string, zustand: number): { text: string; meta: string } {
  if (zustand >= 70) return { text, meta: '' };
  const woerter = text.split(/\s+/);
  if (zustand >= VOLLSTAENDIG_AB) {
    const kurz = woerter.slice(0, 14);
    const mit = kurz.map((w, i) => ((i + 1) % 3 === 0 && i < kurz.length - 1 ? `${w} …` : w)).join(' ');
    return { text: kurz.length < woerter.length ? `${mit} …` : mit, meta: '💦 spricht stockend' };
  }
  if (zustand >= NICHT_ANSPRECHBAR) {
    return { text: `${woerter.slice(0, 3).join(' ')} …`, meta: 'kaum ansprechbar' };
  }
  return { text: '…', meta: 'reagiert nicht mehr' };
}

/** Antwort auf eine Frage – abhängig vom Zustand des Patienten (Angehörige und Zeugen sprechen unabhängig davon normal) */
export function antwortFuer(c: MedCase, frage: FrageId, zustand: number): Antwort {
  const satz = ANTWORTEN[c.id];
  let sprecher: string | undefined = SPRECHER[c.id];
  let roh: string;
  if (satz) {
    roh = satz[INDEX[frage]];
  } else {
    const a = abgeleitet(c, frage);
    // Berichtet der Satz über den Patienten in der dritten Person („Er sagt …“, „Sie war …“), spricht eine Begleitperson
    const dritte = /^(Er|Sie|Seine?|Ihre?|Hat|Wurde|War|Der|Die|Das|Ein|Eine)\s/.test(a.text);
    sprecher = a.sprecher ?? (c.patient.age <= 12 ? 'Eltern' : dritte ? 'Begleitperson' : undefined);
    roh = sprecher ? aus3(a.text, c.patient.sex) : a.text;
  }
  const wichtig = roh.startsWith('!');
  const text = roh.replace(/^!/, '');
  const patientSelbst = !sprecher;
  const gesagt = patientSelbst ? sprechweise(text, zustand) : { text, meta: '' };
  return {
    frage,
    sprecher: sprecher ?? c.patient.name.split(' ')[0],
    text: gesagt.text,
    meta: gesagt.meta,
    wichtig: wichtig && (!patientSelbst || zustand >= VOLLSTAENDIG_AB),
  };
}

/** Kann der Patient selbst überhaupt noch antworten? (Angehörige und Zeugen schon.) */
export const kannAntworten = (c: MedCase, zustand: number): boolean =>
  !!SPRECHER[c.id] || (c.patient.age <= 12 && !ANTWORTEN[c.id]) || zustand >= NICHT_ANSPRECHBAR;
