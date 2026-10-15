/**
 * Mein Auto (Ersthelfer/in): jede Ausrüstung hat eine eigene Wirkung, dazu Ausrüstungs-Sets
 * und ein Tagesangebot. Die Funktionen bekommen nur die Stufen – so gibt es keine Kreis-Importe.
 */
export type AutoId = 'auto' | 'verbandkasten' | 'warn' | 'waerme' | 'licht' | 'defi' | 'kurs';
export type Stufen = (id: AutoId) => number;

const s = (l: number) => l - 1;
const keine = 'Keine Wirkung';

/** Was jede Stufe im Einsatz bewirkt (Text für den Steckbrief) */
export const HELFER_TEXT: Record<AutoId, (l: number) => string> = {
  auto: (l) => (l === 1 ? keine : `Schneller vor Ort: +${3 * s(l)} % Punkte bei jedem Notfall`),
  verbandkasten: (l) => (l === 1 ? keine : `Fehler verzeihen: ${3 * s(l)} Punkte weniger Abzug für falsche Maßnahmen`),
  warn: (l) => (l === 1 ? keine : `Sicher am Einsatzort: +${3 * s(l)} Punkte für jede wichtige Prüfung`),
  waerme: (l) => (l === 1 ? keine : `Betreuen und wärmen: +${2 * s(l)} Punkte für jede richtige Maßnahme`),
  licht: (l) =>
    l === 1
      ? keine
      : l === 2
        ? 'Du siehst, wie viele wichtige Prüfungen es gibt'
        : l === 3
          ? 'Zusätzlich: Du siehst, wie viele davon noch offen sind'
          : 'Zusätzlich: Wichtige Prüfungen sind mit ★ markiert',
  defi: (l) => (l === 1 ? keine : `+${10 * s(l)} % Punkte bei Herzdruckmassage und Defi-Training`),
  kurs: (l) => (l === 1 ? keine : `+${4 * s(l)} % Punkte in allen Trainings`),
};

export const AUTO_IDS: AutoId[] = ['auto', 'verbandkasten', 'warn', 'waerme', 'licht', 'defi', 'kurs'];

export const AUTO_NAME: Record<AutoId, string> = {
  auto: 'Auto',
  verbandkasten: 'Verbandkasten',
  warn: 'Warnausrüstung',
  waerme: 'Wärme & Decken',
  licht: 'Licht',
  defi: 'Defibrillator & Apps',
  kurs: 'Ausbildung',
};

/** Ausrüstungs-Sets: Wer mehrere Dinge auf eine Mindeststufe bringt, bekommt dauerhaft Zusatzpunkte */
export interface HelferSet {
  id: string;
  icon: string;
  title: string;
  text: string;
  braucht: Partial<Record<AutoId, number>>;
  bonusPct: number;
}

export const HELFER_SETS: HelferSet[] = [
  {
    id: 'unfall',
    icon: '🚧',
    title: 'Unfallhelfer-Paket',
    text: 'Verbandkasten, Warnausrüstung und Licht: so sicherst du eine Unfallstelle richtig ab.',
    braucht: { verbandkasten: 2, warn: 2, licht: 2 },
    bonusPct: 3,
  },
  {
    id: 'sicher',
    icon: '🛣️',
    title: 'Sicher unterwegs',
    text: 'Auto, Warnausrüstung und Licht auf Stufe 3: auch bei Nacht und Regen bist du gut zu sehen.',
    braucht: { auto: 3, warn: 3, licht: 3 },
    bonusPct: 4,
  },
  {
    id: 'retter',
    icon: '💚',
    title: 'Lebensretter-Paket',
    text: 'Defibrillator, Ausbildung, Wärme und Verbandkasten auf Stufe 3: für den ernsten Fall gerüstet.',
    braucht: { defi: 3, kurs: 3, waerme: 3, verbandkasten: 3 },
    bonusPct: 5,
  },
  {
    id: 'voll',
    icon: '🏆',
    title: 'Vollausstattung',
    text: 'Alles auf Stufe 4: dein Auto ist ein rollender Erste-Hilfe-Stützpunkt.',
    braucht: { auto: 4, verbandkasten: 4, warn: 4, waerme: 4, licht: 4, defi: 4, kurs: 4 },
    bonusPct: 8,
  },
];

export function setsStand(lv: Stufen) {
  return HELFER_SETS.map((set) => {
    const fehlt = (Object.entries(set.braucht) as [AutoId, number][]).filter(([id, min]) => lv(id) < min);
    const gesamt = Object.keys(set.braucht).length;
    return { set, erfuellt: fehlt.length === 0, fehlt, fertig: gesamt - fehlt.length, gesamt };
  });
}

export interface HelferEffekte {
  /** Punkteaufschlag in Prozent (Auto + Sets) bei Notfällen */
  pointsPct: number;
  /** Davon durch Sets */
  setPct: number;
  /** Weniger Abzug je falsche Maßnahme */
  falschWeniger: number;
  /** Zusatzpunkte je wichtige Prüfung */
  pruefungPlus: number;
  /** Zusatzpunkte je richtige Maßnahme */
  richtigPlus: number;
  /** 0 = kein Hinweis, 1 = Anzahl, 2 = Anzahl offen, 3 = Sterne */
  lichtHinweis: 0 | 1 | 2 | 3;
  /** Punkteaufschlag in allen Trainings */
  trainingPct: number;
  /** Zusätzlich bei Herzdruckmassage und Defi */
  herzPct: number;
}

export function helferEffekte(lv: Stufen): HelferEffekte {
  const setPct = setsStand(lv)
    .filter((x) => x.erfuellt)
    .reduce((n, x) => n + x.set.bonusPct, 0);
  return {
    pointsPct: 3 * s(lv('auto')) + setPct,
    setPct,
    falschWeniger: 3 * s(lv('verbandkasten')),
    pruefungPlus: 3 * s(lv('warn')),
    richtigPlus: 2 * s(lv('waerme')),
    lichtHinweis: Math.min(3, s(lv('licht'))) as 0 | 1 | 2 | 3,
    trainingPct: 4 * s(lv('kurs')),
    herzPct: 10 * s(lv('defi')),
  };
}

/** Tagesangebot: Jeden Tag ist eine Ausrüstung 25 % günstiger */
export const RABATT = 0.25;

export function tagesangebot(tag: string, kandidaten: AutoId[]): AutoId | null {
  if (kandidaten.length === 0) return null;
  let h = 7;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return kandidaten[h % kandidaten.length];
}

export const heuteKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
