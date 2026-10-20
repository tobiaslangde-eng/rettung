import { BASICS } from '../data/basics';
import { CASES } from '../data/cases';
import { HELFER_FRAGEN } from '../data/helferFragen';
import { HELFER_FRAGEN_2 } from '../data/helferFragen2';
import { HELFER_LEXIKON } from '../data/helferLexikon';
import { HANDGRIFFE } from '../data/handgriffe';
import { MYTHEN } from '../data/mythen';
import { QUESTIONS } from '../data/questions';
import { SPICKZETTEL_HELFER } from '../data/spickzettel-helfer';
import { SPICKZETTEL_SANI } from '../data/spickzettel-sani';
import { VITALS } from '../data/vitals';
import { KATEGORIE_NAMEN, WISSENSBASIS } from '../data/wissen';
import { ZUERST_FRAGEN } from '../data/zuerst';
import { Rolle } from './rolle';
import { ablaeufeFuer } from './schritte';

/**
 * Wissenssuche ohne Server: Alle Inhalte der App (Lexikon, Spickzettel, Abläufe, Fragen, Mythen …)
 * werden durchsucht – mit Synonymen („verschluckt“ findet auch „Fremdkörper“), Teilwörtern und kleinen Tippfehlern.
 * „Frag Kati“ zeigt die besten Treffer. Es wird nichts erfunden und nichts an einen Server geschickt.
 */
export type WissensArt =
  | 'lexikon'
  | 'spickzettel'
  | 'ablauf'
  | 'basics'
  | 'wert'
  | 'krankheit'
  | 'frage'
  | 'mythos'
  | 'situation'
  | 'artikel'
  | 'begriff';

export interface WissensEintrag {
  id: string;
  icon: string;
  titel: string;
  /** Kurze Punkte der Antwort */
  punkte: string[];
  merke?: string;
  /** Wann sofort der Notruf oder ärztliche Hilfe nötig ist (nur Artikel der Wissensbasis) */
  alarm?: string;
  quelle: string;
  art: WissensArt;
  /** Für die Suche (normalisiert) */
  titelNorm: string;
  /** Andere Suchwörter des Artikels (normalisiert) */
  stichNorm: string;
  heu: string;
}

export interface Treffer {
  eintrag: WissensEintrag;
  score: number;
}

/** Kleinbuchstaben, ohne Umlaute und Satzzeichen */
export const normal = (t: string): string =>
  t
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/₂/g, '2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const FUELLWOERTER = new Set(
  'der die das den dem des ein eine einen einem einer und oder wie was wo wann warum wer wenn bei mit ich du man soll sollte muss kann koennte ist sind war im in am an zu zum zur von fuer auf aus nach vor nicht kein mein meine meinen mir mich dir dich hat habe haben wird werde bitte tun mache machen macht als auch noch nur dann denn doch sich es sie er wir ihr uns um ob so da hier jetzt gerade jemand jemanden passiert glaube denke vermute meint'.split(
    ' ',
  ),
);

/** Gruppen von Wörtern, die dasselbe meinen (alle normalisiert) */
const SYNONYME: string[][] = [
  [
    'herzstillstand',
    'wiederbelebung',
    'reanimation',
    'herzdruckmassage',
    'hlw',
    'cpr',
    'kreislaufstillstand',
    'nicht atmet',
    'atemstillstand',
  ],
  ['verschluckt', 'ersticken', 'erstickt', 'fremdkoerper', 'heimlich', 'atemnot', 'verschlucken'],
  ['blutung', 'blutet', 'wunde', 'druckverband', 'schnitt', 'platzwunde', 'blutstillung', 'tourniquet', 'abbinden'],
  ['krampf', 'krampfanfall', 'epilepsie', 'anfall', 'kraempfe'],
  ['verbrannt', 'verbrennung', 'verbruehung', 'verbruehen', 'heiss', 'brandwunde'],
  [
    'ohnmaechtig',
    'ohnmacht',
    'bewusstlos',
    'bewusstlosigkeit',
    'kollaps',
    'synkope',
    'umgekippt',
    'zusammengebrochen',
    'seitenlage',
    'atemkontrolle',
  ],
  ['schlaganfall', 'apoplex', 'laehmung', 'sprachstoerung', 'fast', 'hirnschlag'],
  ['herzinfarkt', 'brustschmerz', 'brustschmerzen', 'stemi', 'angina', 'druck auf der brust'],
  ['unterzucker', 'hypoglykaemie', 'zucker', 'diabetes', 'diabetiker', 'blutzucker'],
  ['allergie', 'anaphylaxie', 'allergisch', 'insektenstich', 'wespe', 'biene', 'schock', 'anaphylaktisch'],
  ['kind', 'kinder', 'saeugling', 'baby', 'kleinkind'],
  ['vergiftung', 'gift', 'tabletten', 'giftnotruf', 'vergiftet'],
  ['knochenbruch', 'fraktur', 'bruch', 'gebrochen', 'schiene', 'ruhigstellen', 'armschlinge', 'dreiecktuch'],
  ['strom', 'stromunfall', 'elektrounfall', 'stromschlag'],
  ['ertrinken', 'ertrunken', 'badeunfall', 'wasser', 'beinahe ertrunken'],
  ['hitze', 'sonnenstich', 'hitzschlag', 'hitzeerschoepfung', 'ueberhitzt'],
  ['kaelte', 'unterkuehlung', 'erfrierung', 'rettungsdecke', 'auskuehlen', 'frieren'],
  ['notruf', '112', 'anruf', 'leitstelle', 'rettungsdienst', 'notarzt', 'krankenwagen', 'rettungswagen'],
  ['defi', 'aed', 'defibrillator', 'elektroschock'],
  ['seitenlage', 'stabile seitenlage', 'bewusstlose lagern', 'lagern', 'lagerung'],
  ['atmung', 'atmen', 'atemwege', 'luft', 'puste', 'beatmung'],
  ['asthma', 'atemnot', 'luftnot', 'spray'],
  ['kopfverletzung', 'schaedel', 'gehirnerschuetterung', 'sturz', 'kopf'],
  ['unfall', 'verkehrsunfall', 'unfallstelle', 'absichern', 'warndreieck', 'warnweste'],
  ['nase', 'nasenbluten'],
  ['zecke', 'zeckenbiss', 'borreliose', 'fsme'],
  ['hund', 'biss', 'tierbiss', 'bissverletzung'],
  ['uebelkeit', 'erbrechen', 'durchfall', 'magen', 'bauch', 'bauchschmerzen'],
  ['fieber', 'temperatur', 'fiebersenkung'],
  ['panik', 'angst', 'hyperventilation', 'panikattacke'],
  ['verbandkasten', 'verbandskasten', 'erste hilfe set', 'pflaster', 'verbandmaterial'],
  ['handschuhe', 'eigenschutz', 'selbstschutz', 'infektion'],
  ['rueckenschmerz', 'wirbelsaeule', 'hws', 'nacken', 'querschnitt'],
  ['augen', 'auge', 'augenverletzung', 'veraetzung', 'spritzer'],
  ['schwanger', 'schwangerschaft', 'geburt', 'wehen'],
  ['abc', 'abcde', 'untersuchung', 'vorgehen', 'schema'],
  ['normwerte', 'vitalwerte', 'puls', 'blutdruck', 'sauerstoff', 'spo2', 'messwerte'],
];

/** Wörter, bei denen sofort an den Notruf erinnert wird */
const NOTFALL_WOERTER = [
  'bewusstlos',
  'atmet nicht',
  'atemstillstand',
  'herzstillstand',
  'wiederbeleb',
  'reanimation',
  'schlaganfall',
  'herzinfarkt',
  'brustschmerz',
  'starke blutung',
  'blutet stark',
  'spritzt',
  'anaphyla',
  'ertrunken',
  'ertrinkt',
  'krampfanfall',
  'vergiftet',
  'verschluckt',
  'erstickt',
  'ohnmaechtig',
  'zusammengebrochen',
  'lebensgefahr',
];

export function istNotfallFrage(frage: string): boolean {
  const n = normal(frage);
  return NOTFALL_WOERTER.some((w) => n.includes(w));
}

/** Unterscheiden sich zwei Wörter nur um einen Buchstaben (Tippfehler)? */
const einFehler = (a: string, b: string): boolean => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
};

const kuerzen = (t: string, max = 110) => (t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t);

function eintrag(
  partial: Omit<WissensEintrag, 'titelNorm' | 'stichNorm' | 'heu'>,
  extra: string,
  stichworte: string[] = [],
): WissensEintrag {
  const titelNorm = normal(partial.titel);
  const stichNorm = normal(stichworte.join(' '));
  return {
    ...partial,
    titelNorm,
    stichNorm,
    heu: normal(
      [partial.titel, ...partial.punkte, partial.merke ?? '', partial.alarm ?? '', stichworte.join(' '), extra].join(' '),
    ),
  };
}

const cache = new Map<Rolle, { liste: WissensEintrag[]; woerter: Map<string, number> }>();

function baue(rolle: Rolle) {
  const liste: WissensEintrag[] = [];
  if (rolle === 'helfer') {
    HELFER_LEXIKON.forEach((e) =>
      liste.push(
        eintrag(
          {
            id: 'lex-' + e.id,
            icon: e.icon,
            titel: e.titel,
            punkte: [e.kurz, ...e.punkte],
            merke: e.merke || undefined,
            quelle: 'Lexikon',
            art: 'lexikon',
          },
          '',
        ),
      ),
    );
    SPICKZETTEL_HELFER.forEach((s) =>
      liste.push(
        eintrag(
          {
            id: 'spick-' + s.id,
            icon: s.icon,
            titel: s.titel,
            punkte: s.punkte.map((p) => p.text),
            merke: s.merksatz,
            quelle: 'Spickzettel',
            art: 'spickzettel',
          },
          '',
        ),
      ),
    );
    [...HELFER_FRAGEN, ...HELFER_FRAGEN_2].forEach((q) =>
      liste.push(
        eintrag(
          {
            id: 'frage-' + q.id,
            icon: '💡',
            titel: q.question,
            punkte: [q.answers[0], q.explanation],
            quelle: 'Wissensfrage',
            art: 'frage',
          },
          '',
        ),
      ),
    );
    MYTHEN.forEach((m) =>
      liste.push(
        eintrag(
          {
            id: 'mythos-' + m.id,
            icon: m.stimmt ? '✅' : '🧐',
            titel: m.aussage,
            punkte: [m.stimmt ? 'Das stimmt.' : 'Das stimmt nicht.', m.erklaerung],
            quelle: 'Mythos oder Wahrheit',
            art: 'mythos',
          },
          '',
        ),
      ),
    );
    [...HANDGRIFFE, ...ZUERST_FRAGEN].forEach((z) =>
      liste.push(
        eintrag(
          {
            id: 'situation-' + z.id,
            icon: '⚡',
            titel: z.lage,
            punkte: [`Richtig: ${z.optionen[0]}`, z.erklaerung],
            quelle: 'Was zuerst?',
            art: 'situation',
          },
          '',
        ),
      ),
    );
  } else {
    BASICS.forEach((b) =>
      liste.push(
        eintrag(
          {
            id: 'basics-' + b.id,
            icon: '📘',
            titel: b.title,
            punkte: [...(b.intro ? [b.intro] : []), ...b.points],
            quelle: 'Rettungswissen',
            art: 'basics',
          },
          '',
        ),
      ),
    );
    SPICKZETTEL_SANI.forEach((s) =>
      liste.push(
        eintrag(
          {
            id: 'spick-' + s.id,
            icon: s.icon,
            titel: s.titel,
            punkte: s.punkte.map((p) => p.text),
            merke: s.merksatz,
            quelle: 'Spickzettel',
            art: 'spickzettel',
          },
          '',
        ),
      ),
    );
    VITALS.forEach((v) =>
      liste.push(
        eintrag(
          {
            id: 'wert-' + v.id,
            icon: '📈',
            titel: `${v.name} (${v.short})`,
            punkte: [
              `Normal: ${v.normal}`,
              v.low !== undefined && !v.textOnly ? `Zu niedrig unter ${v.low} ${v.unit}` : '',
              v.high !== undefined && !v.textOnly && v.id !== 'spo2' ? `Zu hoch über ${v.high} ${v.unit}` : '',
            ].filter(Boolean),
            quelle: 'Normwerte',
            art: 'wert',
          },
          '',
        ),
      ),
    );
    QUESTIONS.forEach((q) =>
      liste.push(
        eintrag(
          {
            id: 'frage-' + q.id,
            icon: '💡',
            titel: q.question,
            punkte: [q.answers[0], q.explanation],
            quelle: 'Wissensfrage',
            art: 'frage',
          },
          '',
        ),
      ),
    );
    CASES.forEach((c) =>
      liste.push(
        eintrag(
          {
            id: 'krank-' + c.id,
            icon: '🩺',
            titel: c.diagnosis,
            punkte: [
              `Typisch: ${c.leitsymptome.join(', ')}`,
              ...c.treatments
                .filter((t) => t.correct)
                .slice(0, 4)
                .map((t) => `Maßnahme: ${t.text}`),
              kuerzen(c.explanation, 160),
            ],
            quelle: 'Krankheitsbild',
            art: 'krankheit',
          },
          c.leitsymptome.join(' '),
        ),
      ),
    );
  }
  WISSENSBASIS.filter((a) => a.fuer === 'beide' || a.fuer === rolle).forEach((a) =>
    liste.push(
      eintrag(
        {
          id: 'artikel-' + a.id,
          icon: a.kategorie === 'begriffe' ? '🔤' : a.kategorie === 'medikamente' ? '💊' : '📚',
          titel: a.titel,
          punkte: [a.kurz, ...a.punkte],
          merke: a.merke,
          alarm: a.alarm,
          quelle: KATEGORIE_NAMEN[a.kategorie],
          art: a.kategorie === 'begriffe' ? 'begriff' : 'artikel',
        },
        '',
        a.stichworte,
      ),
    ),
  );
  ablaeufeFuer(rolle).forEach((a) =>
    liste.push(
      eintrag(
        {
          id: 'ablauf-' + a.id,
          icon: '🧩',
          titel: a.titel,
          punkte: a.schritte.map((s, i) => `${i + 1}. ${s}`),
          merke: a.erklaerung,
          quelle: 'Ablauf',
          art: 'ablauf',
        },
        a.lage,
      ),
    ),
  );
  const woerter = new Map<string, number>();
  liste.forEach((e) => new Set(e.heu.split(' ')).forEach((w) => w.length >= 3 && woerter.set(w, (woerter.get(w) ?? 0) + 1)));
  const wert = { liste, woerter };
  cache.set(rolle, wert);
  return wert;
}

export const wissensListe = (rolle: Rolle): WissensEintrag[] => (cache.get(rolle) ?? baue(rolle)).liste;

/** Wörter der Frage ohne Füllwörter, mit Synonymen (Gewicht 1 = echtes Wort, 0.3 = Synonym) */
function begriffe(frage: string): { w: string; g: number }[] {
  const n = normal(frage);
  const roh = n.split(' ').filter((w) => w.length >= 2 && !FUELLWOERTER.has(w));
  const aus = new Map<string, number>();
  roh.forEach((w) => aus.set(w, 1));
  SYNONYME.forEach((gruppe) => {
    const trifft = gruppe.some((s) =>
      s.includes(' ')
        ? n.includes(s)
        : roh.some((w) => w === s || (w.length >= 5 && s.startsWith(w)) || (s.length >= 5 && w.startsWith(s))),
    );
    if (trifft)
      gruppe.forEach((s) => s.split(' ').forEach((t) => t.length >= 3 && !FUELLWOERTER.has(t) && !aus.has(t) && aus.set(t, 0.3)));
  });
  return [...aus.entries()].map(([w, g]) => ({ w, g }));
}

const ART_BONUS: Record<WissensArt, number> = {
  lexikon: 2.5,
  spickzettel: 2,
  ablauf: 2,
  basics: 2,
  krankheit: 1.5,
  wert: 1.5,
  frage: 0.5,
  mythos: 0.3,
  situation: 0,
  artikel: 2.2,
  begriff: 1,
};

/** Die besten Treffer zu einer Frage (leer, wenn nichts Passendes gefunden wurde) */
export function sucheWissen(rolle: Rolle, frage: string, max = 6): Treffer[] {
  const { liste, woerter } = cache.get(rolle) ?? baue(rolle);
  const bs = begriffe(frage);
  if (bs.length === 0) return [];
  const N = liste.length;
  const vokabular = [...woerter.keys()];
  const treffer: Treffer[] = [];
  for (const e of liste) {
    let echt = 0;
    let syn = 0;
    let gefunden = 0;
    let ueberhaupt = false;
    for (const { w, g } of bs) {
      const df = woerter.get(w) ?? 0;
      const idf = Math.log((N + 1) / (1 + df)) + 0.5;
      let s = 0;
      // Wortstamm: „wiederbelebe“ findet auch „Wiederbelebung“
      const staemme = w.length >= 8 ? [w, w.slice(0, -1), w.slice(0, -2)] : w.length >= 6 ? [w, w.slice(0, -1)] : [w];
      for (const [k, st] of staemme.entries()) {
        const f = k === 0 ? 1 : 0.8;
        if (st.length >= 3 && e.titelNorm.includes(st)) s = 6 * f;
        else if (st.length >= 3 && e.stichNorm.includes(st)) s = 4 * f;
        else if (st.length >= 3 && e.heu.includes(st)) s = 2 * f;
        if (s > 0) break;
      }
      if (s === 0 && w.length >= 5) {
        // kleiner Tippfehler: ähnliches Wort im Eintrag
        const nah = vokabular.find((v) => einFehler(w, v) && e.heu.includes(v));
        if (nah) s = 1.2;
      }
      if (s > 0) {
        ueberhaupt = true;
        if (g >= 1) gefunden++;
        if (g >= 1) echt += s * idf;
        else syn += s * g * idf;
      }
    }
    if (!ueberhaupt) continue;
    // Synonyme helfen, dürfen aber die Wörter der Frage selbst nicht überstimmen
    const roh = echt + (echt > 0 ? Math.min(syn, echt * 0.5) : syn);
    // Einträge, die mehrere Wörter der Frage abdecken, gewinnen (Synonyme zählen dafür nicht mit)
    let score = roh * (1 + 0.35 * Math.max(0, gefunden - 1));
    score += ART_BONUS[e.art];
    treffer.push({ eintrag: e, score });
  }
  treffer.sort((a, b) => b.score - a.score);
  const bestes = treffer[0]?.score ?? 0;
  // zu schwache Treffer weglassen
  return treffer.filter((t, i) => i < max && t.score >= Math.max(4, bestes * 0.35));
}

export const BEISPIELFRAGEN: Record<Rolle, string[]> = {
  helfer: [
    'Was mache ich bei einer Verbrennung?',
    'Wie funktioniert ein Defibrillator?',
    'Mein Kind hat sich verschluckt',
    'Jemand ist bewusstlos – was jetzt?',
    'Wie stoppe ich eine starke Blutung?',
    'Was gehört in den Verbandkasten?',
  ],
  sani: [
    'Was bedeutet ein SpO₂ von 90 %?',
    'Wie läuft das ABCDE-Schema?',
    'Woran erkenne ich einen Schlaganfall?',
    'Was tun bei Verdacht auf Herzinfarkt?',
    'Normwerte beim Blutdruck',
    'Wie läuft eine Übergabe?',
  ],
};

/** Hintergrundwissen für die KI: die besten Artikel zur Frage als kurzer Text (die KI darf sich darauf stützen) */
export function kontextFuerKi(rolle: Rolle, frage: string, max = 3): { titel: string; text: string }[] {
  return sucheWissen(rolle, frage, 8)
    .filter((t) => t.eintrag.art !== 'frage' && t.eintrag.art !== 'mythos' && t.eintrag.art !== 'situation')
    .slice(0, max)
    .map(({ eintrag: e }) => {
      const teile = [
        ...e.punkte.map((p) => `- ${p}`),
        e.alarm ? `Notruf/Arzt: ${e.alarm}` : '',
        e.merke ? `Merke: ${e.merke}` : '',
      ].filter(Boolean);
      return { titel: e.titel, text: teile.join('\n').slice(0, 1500) };
    });
}
