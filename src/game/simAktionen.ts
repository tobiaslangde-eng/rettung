/**
 * Maßnahmen im Patienten-Simulator: Messen, Atemweg, Kreislauf, Defibrillator, Medikamente, Team.
 * Szenarien bringen eigene Maßnahmen und Medikamenten-Wirkungen mit.
 */
import { sprechweise, VOLLSTAENDIG_AB, NICHT_ANSPRECHBAR } from './patient';
import {
  AktionDef,
  abfahrt,
  beobachtungen,
  clamp,
  effekt,
  fehler,
  KLINIKEN,
  KlinikId,
  LagerungId,
  logge,
  MedDef,
  merke,
  mmss,
  SauerstoffId,
  schockAbgeben,
  schockbar,
  SimState,
  SimSzenario,
  zustandProzent,
  zufall,
} from './simulator';

export const FRAGEN_IDS = ['passiert', 'schmerz', 'seit', 'vorerkrankung', 'medikamente', 'allergien'] as const;
export const FRAGEN_TEXT: Record<string, string> = {
  passiert: 'Was ist passiert?',
  schmerz: 'Wo tut es weh?',
  seit: 'Seit wann?',
  vorerkrankung: 'Vorerkrankungen?',
  medikamente: 'Medikamente?',
  allergien: 'Allergien?',
};

/** Antwort auf eine Frage: wer spricht, was er sagt, ob es wichtig ist */
export function simAntwort(sz: SimSzenario, frage: string, zustand: number) {
  const roh = sz.antworten[FRAGEN_IDS.indexOf(frage as (typeof FRAGEN_IDS)[number])] ?? '…';
  const wichtigGemeint = roh.startsWith('!');
  const text = roh.replace(/^!/, '');
  const selbst = !sz.sprecher;
  const gesagt = selbst ? sprechweise(text, zustand) : { text, meta: '' };
  return {
    sprecher: sz.sprecher ?? sz.patient.name.split(' ')[0],
    text: gesagt.text,
    meta: gesagt.meta,
    wichtig: wichtigGemeint && (!selbst || zustand >= VOLLSTAENDIG_AB),
  };
}

const arztOder = (s: SimState, text: string) => logge(s, 'arzt', text);

// ───────────────────────── Messen ─────────────────────────

const messen: AktionDef[] = [
  {
    id: 'eindruck',
    gruppe: 'messen',
    titel: 'Genau hinsehen (ABCDE)',
    icon: '👀',
    dauer: 6,
    haende: 1,
    fertig: (s) => {
      const b = beobachtungen(s);
      const zeilen = [b.atemweg, b.atmung, b.kreislauf, b.neuro, ...(b.sonst ?? [])].filter(Boolean) as string[];
      s.eindruck = { t: s.t, zeilen };
      for (const z of zeilen) logge(s, 'info', z);
    },
  },
  {
    id: 'spo2',
    gruppe: 'messen',
    titel: 'Pulsoxymeter anlegen',
    icon: '🩸',
    dauer: 8,
    haende: 1,
    geht: (s) => (s.geraete.spo2 ? 'Liegt schon.' : null),
    aktiv: (s) => s.geraete.spo2,
    fertig: (s) => {
      s.geraete.spo2 = true;
      logge(s, 'info', s.kreislauf ? 'Pulsoxymeter liegt: SpO₂ und Puls erscheinen auf dem Monitor.' : 'Pulsoxymeter liegt – aber keine Pulskurve! Das ist kein gutes Zeichen.');
    },
  },
  {
    id: 'ekg',
    gruppe: 'messen',
    titel: 'EKG-Monitor (3 Ableitungen)',
    icon: '📈',
    dauer: 18,
    haende: 1,
    geht: (s) => (s.geraete.ekg ? 'Liegt schon.' : null),
    aktiv: (s) => s.geraete.ekg,
    fertig: (s) => {
      s.geraete.ekg = true;
      logge(s, 'info', 'EKG-Elektroden kleben: Der Herzrhythmus läuft jetzt über den Monitor.');
    },
  },
  {
    id: 'nibp',
    gruppe: 'messen',
    titel: 'Blutdruck messen',
    icon: '🩺',
    dauer: 25,
    haende: 1,
    geht: (s) => (s.kreislauf ? null : 'Ohne Kreislauf nicht messbar.'),
    fertig: (s) => {
      if (!s.kreislauf) return logge(s, 'info', 'Blutdruck nicht messbar.');
      s.messung.nibp = { t: s.t, sys: Math.round(s.w.sys), dia: Math.round(s.w.dia) };
      logge(s, 'info', `Blutdruck ${Math.round(s.w.sys)}/${Math.round(s.w.dia)} mmHg.`);
    },
  },
  {
    id: 'bz',
    gruppe: 'messen',
    titel: 'Blutzucker messen',
    icon: '🩹',
    dauer: 15,
    haende: 1,
    fertig: (s) => {
      const w = Math.round(s.sz.bzFn ? s.sz.bzFn(s) : s.sz.basis.bz);
      s.messung.bz = { t: s.t, wert: w };
      logge(s, 'info', `Blutzucker ${w} mg/dl.`);
    },
  },
  {
    id: 'temp',
    gruppe: 'messen',
    titel: 'Temperatur messen',
    icon: '🌡️',
    dauer: 10,
    haende: 1,
    fertig: (s) => {
      s.messung.temp = { t: s.t, wert: s.sz.basis.temp };
      logge(s, 'info', `Temperatur ${s.sz.basis.temp.toFixed(1).replace('.', ',')} °C.`);
    },
  },
  {
    id: 'afzaehlen',
    gruppe: 'messen',
    titel: 'Atemfrequenz zählen',
    icon: '🫁',
    dauer: 15,
    haende: 1,
    fertig: (s) => {
      const w = s.kreislauf ? Math.round(s.w.af) : 0;
      s.messung.af = { t: s.t, wert: w };
      logge(s, 'info', w ? `Atemfrequenz ${w} pro Minute.` : 'Keine normale Atmung zu sehen.');
    },
  },
  {
    id: 'ekg12',
    gruppe: 'messen',
    titel: '12-Kanal-EKG schreiben',
    icon: '📄',
    dauer: 50,
    haende: 1,
    geht: (s) => (s.kreislauf ? null : 'Im Kreislaufstillstand zählt jetzt die Wiederbelebung.'),
    fertig: (s) => {
      const text = s.sz.befund.ekg12(s);
      s.messung.ekg12 = { t: s.t, text };
      logge(s, 'info', `12-Kanal-EKG: ${text}`);
    },
  },
  {
    id: 'lunge',
    gruppe: 'messen',
    titel: 'Lunge abhören',
    icon: '🎧',
    dauer: 15,
    haende: 1,
    geht: (s) => (s.kreislauf ? null : 'Jetzt nicht – Wiederbelebung geht vor.'),
    fertig: (s) => logge(s, 'info', `Lunge: ${s.sz.befund.lunge(s)}`),
  },
  {
    id: 'neuro',
    gruppe: 'messen',
    titel: 'Neurostatus (FAST, Pupillen)',
    icon: '🔦',
    dauer: 20,
    haende: 1,
    geht: (s) => (s.kreislauf ? null : 'Jetzt nicht – Wiederbelebung geht vor.'),
    fertig: (s) => logge(s, 'info', `Neurostatus: ${s.sz.befund.neuro(s)}`),
  },
];

// ───────────────────────── Fragen ─────────────────────────

export const FRAGEN_AKTIONEN: AktionDef[] = FRAGEN_IDS.map((id) => ({
  id: 'frage-' + id,
  gruppe: 'messen' as const,
  titel: FRAGEN_TEXT[id],
  icon: '💬',
  dauer: 6,
  haende: 1,
  geht: (s: SimState) => {
    if (s.sz.sprecher) return null;
    return zustandProzent(s) < NICHT_ANSPRECHBAR ? 'Der Patient reagiert nicht mehr.' : null;
  },
  fertig: (s: SimState) => {
    const zustand = zustandProzent(s);
    const a = simAntwort(s.sz, id, zustand);
    s.antworten.push({ frage: id, t: s.t, zustand, wichtig: a.wichtig });
    logge(s, 'patient', `${a.sprecher}: „${a.text}“`);
    if (a.wichtig) merke(s, 'wichtige-antwort');
  },
}));

// ───────────────────────── Atemweg und Atmung ─────────────────────────

const LAGEN: { id: LagerungId; titel: string; icon: string; text: string }[] = [
  { id: 'sitzend', titel: 'Sitzend (Beine tief)', icon: '🪑', text: 'Der Patient sitzt aufrecht, Beine nach unten.' },
  { id: 'oberkoerper', titel: 'Oberkörper hoch (30°)', icon: '🛏️', text: 'Oberkörper ist erhöht gelagert.' },
  { id: 'flach', titel: 'Flach lagern', icon: '⬜', text: 'Der Patient liegt flach.' },
  { id: 'beinehoch', titel: 'Beine hoch (Schocklage)', icon: '🦵', text: 'Beine sind hochgelagert.' },
  { id: 'seitenlage', titel: 'Stabile Seitenlage', icon: '↪️', text: 'Der Patient liegt in stabiler Seitenlage.' },
];

const O2: { id: SauerstoffId; titel: string; text: string }[] = [
  { id: 'nasenbrille', titel: 'Sauerstoff: Nasenbrille (2–4 l)', text: 'Sauerstoff über die Nasenbrille.' },
  { id: 'maske', titel: 'Sauerstoff: Maske (8–10 l)', text: 'Sauerstoff über die Maske.' },
  { id: 'reservoir', titel: 'Sauerstoff: Reservoirmaske (15 l)', text: 'Sauerstoff mit 15 Litern über die Reservoirmaske.' },
  { id: 'aus', titel: 'Sauerstoff abstellen', text: 'Sauerstoff abgestellt.' },
];

const atem: AktionDef[] = [
  {
    id: 'absaugen',
    gruppe: 'atem',
    titel: 'Absaugen',
    icon: '🧪',
    dauer: 10,
    haende: 1,
    fertig: (s) => {
      if (s.flags.sekret) {
        s.flags.sekret = false;
        logge(s, 'gut', 'Mund und Rachen abgesaugt – der Atemweg ist wieder frei.');
      } else logge(s, 'info', 'Es gab nichts abzusaugen.');
    },
  },
  {
    id: 'guedel',
    gruppe: 'atem',
    titel: 'Guedel-Tubus einlegen',
    icon: '🔧',
    dauer: 8,
    haende: 1,
    geht: (s) => (s.geraete.guedel ? 'Liegt schon.' : null),
    aktiv: (s) => s.geraete.guedel,
    fertig: (s) => {
      if (s.flags.krampf) {
        fehler(s, 'Während des Krampfanfalls nichts in den Mund schieben – Verletzungsgefahr, der Kiefer ist verkrampft.', 1.5, true);
        return;
      }
      if (s.achsen.neuro < 0.4 || !s.kreislauf) {
        s.geraete.guedel = true;
        logge(s, 'gut', 'Guedel-Tubus liegt: Die Zunge kann den Atemweg nicht mehr verlegen.');
      } else {
        fehler(s, 'Der Patient würgt und wehrt ab: Ein Guedel-Tubus ist nur bei Bewusstlosigkeit erlaubt.', 0.5);
      }
    },
  },
  ...LAGEN.map(
    (l): AktionDef => ({
      id: 'lage-' + l.id,
      gruppe: 'atem',
      titel: l.titel,
      icon: l.icon,
      dauer: 5,
      haende: 1,
      geht: (s) => (!s.kreislauf && l.id !== 'flach' ? 'Bei der Wiederbelebung bleibt der Patient flach auf hartem Untergrund.' : null),
      aktiv: (s) => s.geraete.lage === l.id,
      fertig: (s) => {
        s.geraete.lage = l.id;
        logge(s, 'info', l.text);
      },
    }),
  ),
  ...O2.map(
    (o): AktionDef => ({
      id: 'o2-' + o.id,
      gruppe: 'atem',
      titel: o.titel,
      icon: o.id === 'aus' ? '⛔' : '🫧',
      dauer: 6,
      haende: 1,
      aktiv: (s) => s.geraete.o2 === o.id,
      geht: (s) => (s.geraete.o2 === o.id ? 'Das läuft schon so.' : null),
      fertig: (s) => {
        s.geraete.o2 = o.id;
        logge(s, 'info', o.text);
        if (o.id !== 'aus' && s.kreislauf && s.w.spo2 >= 96 && s.geraete.spo2) logge(s, 'info', 'Tipp: Die SpO₂ ist schon ≥ 96 % – mehr Sauerstoff ist hier nicht nötig.');
      },
    }),
  ),
  {
    id: 'bvm',
    gruppe: 'atem',
    titel: 'Beutelbeatmung (Maske-Beutel)',
    icon: '🎈',
    dauer: 6,
    haende: 1,
    aktiv: (s) => s.geraete.bvm,
    fertig: (s) => {
      if (s.geraete.bvm) {
        s.geraete.bvm = false;
        logge(s, 'info', 'Beutelbeatmung beendet.');
        return;
      }
      if (s.kreislauf && s.w.af >= 10 && s.achsen.atem > 0.5) {
        fehler(s, 'Der Patient atmet selbst ausreichend – eine Beutelbeatmung ist hier nicht nötig.', 0.5);
        return;
      }
      s.geraete.bvm = true;
      logge(s, 'gut', 'Beutelbeatmung läuft mit Sauerstoff: etwa 10 Atemzüge pro Minute.');
    },
  },
];

// ───────────────────────── Kreislauf ─────────────────────────

const kreislauf: AktionDef[] = [
  {
    id: 'zugang',
    gruppe: 'kreislauf',
    titel: 'i.v. Zugang legen',
    icon: '💉',
    dauer: 25,
    haende: 1,
    geht: (s) => (s.geraete.zugang >= 2 ? 'Zwei Zugänge reichen.' : null),
    aktiv: (s) => s.geraete.zugang > 0,
    fertig: (s) => {
      const p = s.achsen.kreis > 0.55 ? 0.93 : 0.65;
      if (zufall(s) < p) {
        s.geraete.zugang++;
        merke(s, 'zugang-ok');
        logge(s, 'gut', `Zugang liegt (${s.geraete.zugang}).`);
      } else logge(s, 'info', 'Die Vene ist schlecht (Kreislauf!) – daneben. Noch ein Versuch nötig.');
    },
  },
  {
    id: 'infusion',
    gruppe: 'kreislauf',
    titel: 'Infusion anhängen (500 ml)',
    icon: '💧',
    dauer: 6,
    haende: 1,
    geht: (s) => (s.geraete.zugang < 1 ? 'Erst einen Zugang legen.' : s.geraete.infusionen >= 3 ? 'Mehr als drei Beutel sind es nicht.' : null),
    aktiv: (s) => s.geraete.infusionen > 0,
    fertig: (s) => {
      s.geraete.infusionen++;
      const v = s.sz.volumen;
      if (v < 0) {
        s.x = clamp(s.x + 0.12);
        fehler(s, 'Infusion beim Lungenödem: Das Herz schafft die Flüssigkeit nicht – die Lunge läuft noch voller.', 2, true);
      } else {
        effekt(s, 'bKreis', 0.12 * v, 150);
        logge(s, 'info', 'Vollelektrolytlösung läuft ein.');
      }
    },
  },
  {
    id: 'druckverband',
    gruppe: 'kreislauf',
    titel: 'Druckverband anlegen',
    icon: '🩹',
    dauer: 20,
    haende: 1,
    zeige: (s) => !!s.sz.blutung,
    fertig: (s) => {
      if (!s.sz.blutung) return logge(s, 'info', 'Keine äußere Blutung zu sehen.');
      s.wachstumFaktor = Math.min(s.wachstumFaktor, 0.25);
      s.flags.druckverband = true;
      logge(s, 'info', 'Druckverband sitzt: Die Blutung wird deutlich schwächer, steht aber noch nicht ganz.');
    },
  },
  {
    id: 'tourniquet',
    gruppe: 'kreislauf',
    titel: 'Tourniquet (Aderpresse)',
    icon: '🎗️',
    dauer: 15,
    haende: 1,
    zeige: (s) => !!s.sz.blutung,
    fertig: (s) => {
      if (!s.sz.blutung) return logge(s, 'info', 'Keine Extremitätenblutung.');
      s.wachstumFaktor = 0;
      s.flags.blutungGestoppt = true;
      logge(s, 'gut', 'Tourniquet sitzt und ist fest: Die Blutung steht. Uhrzeit notieren!');
    },
  },
  {
    id: 'waerme',
    gruppe: 'kreislauf',
    titel: 'Wärmeerhalt (Rettungsdecke)',
    icon: '🧣',
    dauer: 8,
    haende: 1,
    aktiv: (s) => s.geraete.waerme,
    geht: (s) => (s.geraete.waerme ? 'Liegt schon.' : null),
    fertig: (s) => {
      s.geraete.waerme = true;
      logge(s, 'info', 'Rettungsdecke liegt: Der Patient kühlt nicht weiter aus.');
    },
  },
];

// ───────────────────────── Defibrillator und Wiederbelebung ─────────────────────────

const defi: AktionDef[] = [
  {
    id: 'pads',
    gruppe: 'defi',
    titel: 'Defi-Pads kleben',
    icon: '⚡',
    dauer: 12,
    haende: 1,
    geht: (s) => (s.geraete.pads ? 'Kleben schon.' : null),
    aktiv: (s) => s.geraete.pads,
    fertig: (s) => {
      s.geraete.pads = true;
      logge(s, 'info', 'Pads kleben: Der Defibrillator ist einsatzbereit.');
    },
  },
  {
    id: 'analyse',
    gruppe: 'defi',
    titel: 'Rhythmus analysieren',
    icon: '🔍',
    dauer: 8,
    haende: 1,
    hlwPause: true,
    geht: (s) => (s.geraete.pads ? null : 'Erst die Pads kleben.'),
    fertig: (s) => {
      const ergebnis = s.kreislauf ? 'keinstillstand' : schockbar(s) ? 'schock' : 'keinschock';
      s.defi.analyse = { t: s.t, ergebnis };
      if (ergebnis === 'schock') logge(s, 'alarm', 'Defibrillator: „Schock empfohlen. Alle zurücktreten!“');
      else if (ergebnis === 'keinschock') logge(s, 'info', 'Defibrillator: „Kein Schock empfohlen.“ Sofort weiter mit der Herzdruckmassage.');
      else logge(s, 'info', 'Defibrillator: „Herzaktion erkannt – kein Schock nötig.“');
    },
  },
  {
    id: 'schock',
    gruppe: 'defi',
    titel: 'Schock abgeben',
    icon: '💥',
    dauer: 5,
    haende: 1,
    hlwPause: true,
    geht: (s) => (s.defi.analyse?.ergebnis === 'schock' && s.t - s.defi.analyse.t < 45 ? null : 'Der Defibrillator hat keinen Schock empfohlen – erst analysieren.'),
    fertig: (s) => schockAbgeben(s),
  },
  {
    id: 'hlw-an',
    gruppe: 'defi',
    titel: 'Herzdruckmassage starten',
    icon: '🤲',
    dauer: 3,
    haende: 1,
    aktiv: (s) => s.cpr.an,
    geht: (s) => (s.cpr.an ? 'Läuft schon.' : null),
    fertig: (s) => {
      if (s.kreislauf) {
        fehler(s, 'Der Patient hat einen Kreislauf – Herzdruckmassage nur bei Kreislaufstillstand!', 2, true);
        return;
      }
      s.cpr.an = true;
      s.cpr.seit = s.t;
      s.cpr.q = 0.95;
      logge(s, 'gut', 'Herzdruckmassage läuft: 100 bis 120 pro Minute, fest und tief. Alle 2 Minuten wechseln.');
    },
  },
  {
    id: 'hlw-aus',
    gruppe: 'defi',
    titel: 'Herzdruckmassage beenden',
    icon: '✋',
    dauer: 2,
    haende: 1,
    geht: (s) => (s.cpr.an ? null : 'Läuft gar nicht.'),
    fertig: (s) => {
      s.cpr.an = false;
      logge(s, 'info', 'Herzdruckmassage beendet.');
    },
  },
  {
    id: 'hlw-wechsel',
    gruppe: 'defi',
    titel: 'Helfer wechseln',
    icon: '🔄',
    dauer: 3,
    haende: 1,
    geht: (s) => (s.cpr.an ? null : 'Es läuft keine Herzdruckmassage.'),
    fertig: (s) => {
      s.cpr.seit = s.t;
      logge(s, 'gut', 'Wechsel erfolgt: Frische Kräfte, wieder tiefe Kompressionen.');
    },
  },
  {
    id: 'pulscheck',
    gruppe: 'defi',
    titel: 'Puls und Atmung prüfen',
    icon: '👆',
    dauer: 10,
    haende: 1,
    hlwPause: true,
    fertig: (s) => {
      if (s.kreislauf) logge(s, 'info', 'Puls am Hals tastbar, Patient atmet.');
      else logge(s, 'alarm', 'Kein Puls, keine normale Atmung: Kreislaufstillstand bestätigt.');
    },
  },
];

// ───────────────────────── Medikamente ─────────────────────────

interface MedInfo {
  id: string;
  titel: string;
  icon: string;
  arzt: boolean;
  iv: boolean;
  dauer: number;
}

export const MED_LISTE: MedInfo[] = [
  { id: 'adrenalin-im', titel: 'Adrenalin i.m. (Autoinjektor)', icon: '💉', arzt: false, iv: false, dauer: 12 },
  { id: 'salbutamol', titel: 'Salbutamol (Verneblermaske)', icon: '🌬️', arzt: false, iv: false, dauer: 15 },
  { id: 'glukose-oral', titel: 'Traubenzucker / Glukose-Gel', icon: '🍬', arzt: false, iv: false, dauer: 10 },
  { id: 'glukose-iv', titel: 'Glukose 40 % i.v.', icon: '🍯', arzt: false, iv: true, dauer: 20 },
  { id: 'asa', titel: 'ASS 300 mg (zerkauen)', icon: '💊', arzt: false, iv: false, dauer: 8 },
  { id: 'nitro', titel: 'Nitro-Spray (2 Hübe)', icon: '💨', arzt: false, iv: false, dauer: 8 },
  { id: 'fentanyl', titel: 'Fentanyl i.v. (Schmerzmittel)', icon: '🧴', arzt: true, iv: true, dauer: 15 },
  { id: 'furosemid', titel: 'Furosemid i.v. (Wassertablette)', icon: '🚰', arzt: true, iv: true, dauer: 15 },
  { id: 'prednisolon', titel: 'Prednisolon i.v. (Kortison)', icon: '🧪', arzt: true, iv: true, dauer: 15 },
  { id: 'tranexam', titel: 'Tranexamsäure i.v.', icon: '🩸', arzt: true, iv: true, dauer: 15 },
  { id: 'adrenalin-iv', titel: 'Adrenalin 1 mg i.v. (Reanimation)', icon: '💥', arzt: true, iv: true, dauer: 15 },
  { id: 'amiodaron', titel: 'Amiodaron 300 mg i.v.', icon: '🧬', arzt: true, iv: true, dauer: 15 },
  { id: 'atropin', titel: 'Atropin 0,5 mg i.v.', icon: '💧', arzt: true, iv: true, dauer: 15 },
  { id: 'midazolam', titel: 'Midazolam i.v. (Krampf stoppen)', icon: '😴', arzt: true, iv: true, dauer: 15 },
];
export const MED_BY_ID = Object.fromEntries(MED_LISTE.map((m) => [m.id, m]));

/** Gilt in jedem Szenario, wenn es keine eigene Regel gibt */
const MED_STANDARD: Record<string, MedDef> = {
  'adrenalin-iv': {
    kontra: (s) => (s.kreislauf ? 'Adrenalin 1 mg i.v. ist für den Kreislaufstillstand – dieser Patient hat einen Kreislauf.' : null),
    wirkung: (s) => {
      s.flags.adrenalin = ((s.flags.adrenalin as number) || 0) + 1;
    },
  },
  amiodaron: {
    kontra: (s) =>
      s.kreislauf
        ? 'Amiodaron gibt es nur bei Kammerflimmern im Stillstand, nicht bei einem Patienten mit Kreislauf.'
        : !schockbar(s) || s.defi.schocks < 3
          ? 'Amiodaron kommt erst nach dem dritten Schock bei Kammerflimmern.'
          : null,
    wirkung: (s) => {
      s.flags.amiodaron = true;
    },
  },
};

const meds: AktionDef[] = MED_LISTE.map((m): AktionDef => ({
  id: m.id,
  gruppe: 'meds',
  titel: m.titel,
  icon: m.icon,
  tag: m.arzt ? 'Notarzt' : 'SOP',
  dauer: m.dauer,
  haende: m.arzt ? 0 : 1,
  geht: (s) => {
    if (m.arzt && !s.notarzt.da) return s.notarzt.angefordert === null ? 'Erst den Notarzt nachfordern.' : 'Der Notarzt ist noch nicht da.';
    if (m.iv && s.geraete.zugang < 1) return 'Erst einen Zugang legen.';
    return null;
  },
  fertig: (s) => {
    const d = s.sz.med[m.id] ?? MED_STANDARD[m.id];
    const wer = m.arzt ? 'arzt' : 'info';
    if (!d) {
      if (m.arzt) arztOder(s, `Notarzt: „${m.titel}? Wozu? Dafür sehe ich hier keine Indikation.“`);
      else logge(s, 'fehler', `${m.titel}: keine Indikation bei diesem Patienten.`);
      fehler(s, `${m.titel} ohne Indikation`, 1, false);
      return;
    }
    const k = d.kontra?.(s);
    if (k) {
      if (m.arzt) arztOder(s, `Notarzt: „Das gebe ich nicht. ${k}“`);
      fehler(s, `${m.titel} nicht gegeben: ${k}`, 2, true);
      return;
    }
    d.wirkung(s);
    merke(s, m.id + '-ok');
    logge(s, wer === 'arzt' ? 'arzt' : 'gut', m.arzt ? `Notarzt gibt ${m.titel}.` : `${m.titel} gegeben.`);
  },
}));

// ───────────────────────── Team und Transport ─────────────────────────

const team: AktionDef[] = [
  {
    id: 'notarzt-rufen',
    gruppe: 'team',
    titel: 'Notarzt nachfordern',
    icon: '📻',
    dauer: 5,
    haende: 1,
    geht: (s) => (s.notarzt.angefordert !== null ? (s.notarzt.da ? 'Der Notarzt ist schon da.' : 'Ist schon unterwegs.') : null),
    aktiv: (s) => s.notarzt.angefordert !== null,
    fertig: (s) => {
      s.notarzt.angefordert = s.t;
      logge(s, 'info', `Leitstelle: „Notarzt ist alarmiert, Ankunft in etwa ${Math.round(s.sz.notarztEta / 60)} Minuten.“`);
    },
  },
  ...(Object.keys(KLINIKEN) as KlinikId[]).map(
    (k): AktionDef => ({
      id: 'klinik-' + k,
      gruppe: 'team',
      titel: `Voranmelden: ${KLINIKEN[k].kurz}`,
      icon: KLINIKEN[k].icon,
      dauer: 10,
      haende: 1,
      aktiv: (s) => s.klinik === k,
      geht: (s) => (s.klinik === k ? 'Schon angemeldet.' : null),
      fertig: (s) => {
        s.klinik = k;
        logge(s, 'info', `Leitstelle: „${KLINIKEN[k].name} ist informiert und bereitet sich vor.“`);
      },
    }),
  ),
  {
    id: 'trage',
    gruppe: 'team',
    titel: 'Patient auf die Trage lagern',
    icon: '🛏️',
    dauer: 40,
    haende: 2,
    aktiv: (s) => s.geraete.trage,
    geht: (s) => (s.geraete.trage ? 'Liegt schon auf der Trage.' : !s.kreislauf ? 'Nicht während der Wiederbelebung – erst ROSC.' : null),
    fertig: (s) => {
      s.geraete.trage = true;
      logge(s, 'info', 'Der Patient liegt gesichert auf der Trage. Bereit zum Transport.');
    },
  },
  {
    id: 'abfahrt',
    gruppe: 'team',
    titel: 'Abfahrt ins Krankenhaus',
    icon: '🚑',
    dauer: 5,
    haende: 1,
    geht: (s) => (!s.geraete.trage ? 'Erst den Patienten auf die Trage lagern.' : !s.kreislauf ? 'Nicht abfahren, solange wiederbelebt wird.' : null),
    fertig: (s) => {
      if (!s.klinik) {
        s.klinik = 'naechste';
        logge(s, 'info', 'Keine Voranmeldung erfolgt – Fahrt zum nächsten Krankenhaus.');
      }
      abfahrt(s);
    },
  },
];

export const ALLE_STANDARD: AktionDef[] = [...messen, ...FRAGEN_AKTIONEN, ...atem, ...kreislauf, ...defi, ...meds, ...team];

/** Alle Maßnahmen eines Szenarios (Standard plus eigene) */
export function aktionenFuer(sz: SimSzenario): AktionDef[] {
  return [...ALLE_STANDARD, ...sz.eigene];
}

export const GRUPPEN: { id: AktionDef['gruppe']; titel: string; icon: string }[] = [
  { id: 'messen', titel: 'Messen', icon: '🩺' },
  { id: 'atem', titel: 'Atmung', icon: '🫁' },
  { id: 'kreislauf', titel: 'Kreislauf', icon: '💉' },
  { id: 'defi', titel: 'Defi & HLW', icon: '⚡' },
  { id: 'meds', titel: 'Medikamente', icon: '💊' },
  { id: 'team', titel: 'Team', icon: '🚑' },
];

export { mmss };
