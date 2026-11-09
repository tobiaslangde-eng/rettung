/**
 * Patienten-Simulator: Ein Patient lebt in Echtzeit weiter. Ein einziger Schweregrad (x) treibt die Krankheit;
 * daraus ergeben sich drei Lebens-Achsen (Atmung, Kreislauf, Bewusstsein), aus denen alle Messwerte entstehen.
 * Maßnahmen verändern den Schweregrad oder stützen die Achsen. Reine Logik, ohne Oberfläche.
 */
import { LiveRhythmus } from './ekgLive';

// ───────────────────────── Typen ─────────────────────────

export type Gruppe = 'messen' | 'atem' | 'kreislauf' | 'defi' | 'meds' | 'team';
export type LagerungId = 'sitzend' | 'oberkoerper' | 'flach' | 'beinehoch' | 'seitenlage';
export type SauerstoffId = 'aus' | 'nasenbrille' | 'maske' | 'reservoir';
export type KlinikId = 'naechste' | 'katheter' | 'stroke' | 'schockraum' | 'intensiv';
export type Art = 'info' | 'gut' | 'fehler' | 'alarm' | 'arzt' | 'patient' | 'system';

export const HAENDE = 2;
export const KLINIKEN: Record<KlinikId, { name: string; kurz: string; icon: string }> = {
  naechste: { name: 'Nächstes Krankenhaus (Notaufnahme)', kurz: 'Notaufnahme', icon: '🏥' },
  katheter: { name: 'Klinik mit Herzkatheter (Chest Pain Unit)', kurz: 'Herzkatheter', icon: '🫀' },
  stroke: { name: 'Klinik mit Stroke Unit', kurz: 'Stroke Unit', icon: '🧠' },
  schockraum: { name: 'Traumazentrum (Schockraum)', kurz: 'Schockraum', icon: '🚨' },
  intensiv: { name: 'Klinik mit Intensivstation', kurz: 'Intensivstation', icon: '🛏️' },
};

export interface Werte {
  hf: number;
  sys: number;
  dia: number;
  spo2: number;
  af: number;
  gcs: number;
}

export interface LogEintrag {
  t: number;
  art: Art;
  text: string;
}

export interface Fehler {
  t: number;
  text: string;
  pkt: number;
  kritisch: boolean;
}

export interface Effekt {
  ziel: 'x' | 'bAtem' | 'bKreis' | 'bNeuro';
  rate: number;
  ab: number;
  bis: number;
}

export interface AktionDef {
  id: string;
  gruppe: Gruppe;
  titel: string;
  icon: string;
  /** Dauer in Spielsekunden */
  dauer: number;
  /** Wie viele Hände sie bindet (Arzt-Medikamente: 0) */
  haende: number;
  /** Kurzer Hinweis auf der Kachel (z. B. „Notarzt“) */
  tag?: string;
  /** null = möglich, sonst der Grund, warum nicht */
  geht?: (s: SimState) => string | null;
  /** In der Liste anzeigen? */
  zeige?: (s: SimState) => boolean;
  /** Herzdruckmassage pausiert, solange die Aktion läuft */
  hlwPause?: boolean;
  start?: (s: SimState) => void;
  fertig: (s: SimState) => void;
  /** Umschalter: leuchtet, solange der Zustand gilt */
  aktiv?: (s: SimState) => boolean;
}

export interface MedDef {
  kontra?: (s: SimState) => string | null;
  wirkung: (s: SimState) => void;
}

export interface Ereignis {
  id: string;
  wenn: (s: SimState) => boolean;
  aus: (s: SimState) => void;
}

export interface ZielDef {
  id: string;
  titel: string;
  gewicht: number;
  pruefe: (s: SimState) => boolean;
  /** Warum das wichtig ist (steht in der Auswertung) */
  hinweis: string;
}

export interface Beobachtung {
  atemweg?: string;
  atmung?: string;
  kreislauf?: string;
  neuro?: string;
  sonst?: string[];
}

export interface SimSzenario {
  id: string;
  titel: string;
  kurz: string;
  icon: string;
  farbe: string;
  bereich: string;
  stufe: 1 | 2 | 3;
  alarm: { stichwort: string; meldung: string; ort: string };
  szene: string;
  patient: { name: string; alter: number; sex: 'm' | 'w'; kennung: string };
  /** Begleitperson, die antwortet (sonst der Patient selbst) */
  sprecher?: string;
  /** Werte eines Gesunden dieser Person */
  basis: { hf: number; sys: number; dia: number; spo2: number; af: number; temp: number; bz: number };
  /** Start-Schweregrad (0–1) und Zuwachs pro Sekunde ohne Behandlung */
  x0: number;
  wachstum: number;
  wA: number;
  wK: number;
  wN: number;
  potenz: number;
  /** Wie gut Sauerstoff hilft (0–1) */
  o2: number;
  afHoch: boolean;
  hfBrady?: boolean;
  /** Wie stark Infusion den Kreislauf stützt (negativ = schadet, z. B. Lungenödem) */
  volumen: number;
  waerme: number;
  /** Äußere Blutung (Druckverband, Tourniquet sind sinnvoll) */
  blutung?: boolean;
  startLage: LagerungId;
  lagerung: Partial<Record<LagerungId, { atem?: number; kreis?: number }>>;
  startStillstand?: boolean;
  stillstand: { rhythmus: (s: SimState) => LiveRhythmus; ursache: (s: SimState) => boolean };
  rhythmus?: (s: SimState) => LiveRhythmus;
  vfRisiko?: (s: SimState) => number;
  bzFn?: (s: SimState) => number;
  /** Eigene Zielfrequenz des Herzens (z. B. AV-Block) */
  hfZiel?: (s: SimState) => number;
  /** Zustände, die von Anfang an gelten (z. B. Krampfanfall) */
  startFlags?: Record<string, number | boolean>;
  notarztEta: number;
  zielklinik: KlinikId;
  akzeptabel?: KlinikId[];
  szenenzeitSoll: number;
  /** Sechs Antworten (Reihenfolge wie in FRAGEN); „!“ davor = wichtig */
  antworten: string[];
  med: Record<string, MedDef>;
  eigene: AktionDef[];
  befund: { ekg12: (s: SimState) => string; lunge: (s: SimState) => string; neuro: (s: SimState) => string };
  beobachtung?: (s: SimState) => Beobachtung;
  spruch: (s: SimState) => string;
  ereignisse?: Ereignis[];
  ziele: ZielDef[];
  lehre: { text: string[]; merke: string };
  roscX?: number;
}

export interface Geraete {
  spo2: boolean;
  ekg: boolean;
  pads: boolean;
  zugang: number;
  infusionen: number;
  o2: SauerstoffId;
  bvm: boolean;
  guedel: boolean;
  waerme: boolean;
  lage: LagerungId;
  trage: boolean;
}

export interface SimState {
  sz: SimSzenario;
  rng: number;
  t: number;
  x: number;
  wachstumFaktor: number;
  achsen: { atem: number; kreis: number; neuro: number };
  bonus: { atem: number; kreis: number; neuro: number };
  w: Werte;
  rhythmus: LiveRhythmus;
  kreislauf: boolean;
  kritZeit: number;
  stillstandSeit: number | null;
  stillstaende: number;
  rosc: number;
  cpr: { an: boolean; seit: number; q: number; pause: boolean };
  cprEff: number;
  ohneHlw: number;
  handsOff: number;
  irrev: boolean;
  letzterWurf: number;
  defi: { analyse: null | { t: number; ergebnis: 'schock' | 'keinschock' | 'keinstillstand' }; schocks: number; erfolglos: number; blitz: number };
  geraete: Geraete;
  messung: {
    nibp: null | { t: number; sys: number; dia: number };
    bz: null | { t: number; wert: number };
    temp: null | { t: number; wert: number };
    af: null | { t: number; wert: number };
    ekg12: null | { t: number; text: string };
  };
  laufend: { id: string; titel: string; icon: string; start: number; ende: number; haende: number; def: AktionDef }[];
  effekte: Effekt[];
  notarzt: { angefordert: number | null; da: boolean; ankunft: number | null };
  klinik: KlinikId | null;
  log: LogEintrag[];
  getan: Record<string, number[]>;
  fehler: Fehler[];
  flags: Record<string, number | boolean>;
  antworten: { frage: string; t: number; zustand: number; wichtig: boolean }[];
  verlauf: { t: number; hf: number; sys: number; spo2: number; af: number; zustand: number; kreislauf: boolean }[];
  naechsterVerlauf: number;
  naechsterSpruch: number;
  spruch: string;
  alarmStumm: number;
  ende: null | { art: 'uebergabe' | 'tod'; t: number; grund: string };
  eindruck: { t: number; zeilen: string[] } | null;
  gezeigt: Record<string, boolean>;
}

// ───────────────────────── Hilfen ─────────────────────────

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const gl = (cur: number, ziel: number, dt: number, tau: number) => cur + (ziel - cur) * (1 - Math.exp(-dt / tau));
const sm = (x: number) => {
  const k = clamp(x);
  return k * k * (3 - 2 * k);
};

export function zufall(s: SimState): number {
  s.rng = (s.rng + 0x6d2b79f5) | 0;
  let t = Math.imul(s.rng ^ (s.rng >>> 15), 1 | s.rng);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function logge(s: SimState, art: Art, text: string) {
  s.log.push({ t: s.t, art, text });
  if (s.log.length > 400) s.log.shift();
}

export function merke(s: SimState, id: string) {
  (s.getan[id] ??= []).push(s.t);
}
/** Wann wurde etwas zum ersten Mal getan (Sekunden), sonst null */
export const wann = (s: SimState, id: string): number | null => s.getan[id]?.[0] ?? null;
export const hat = (s: SimState, id: string) => !!s.getan[id]?.length;
export const vor = (s: SimState, id: string, sekunden: number) => {
  const t = wann(s, id);
  return t !== null && t <= sekunden;
};

export function fehler(s: SimState, text: string, pkt = 1, kritisch = false) {
  s.fehler.push({ t: s.t, text, pkt, kritisch });
  logge(s, 'fehler', text);
}

export function effekt(s: SimState, ziel: Effekt['ziel'], summe: number, dauer: number, verzug = 0) {
  s.effekte.push({ ziel, rate: summe / dauer, ab: s.t + verzug, bis: s.t + verzug + dauer });
}

export const zustandProzent = (s: SimState): number =>
  s.kreislauf ? Math.round(100 * clamp(Math.min(s.achsen.atem, s.achsen.kreis, 0.4 + 0.6 * s.achsen.neuro))) : 4;

export const schockbar = (s: SimState) => !s.kreislauf && (s.rhythmus === 'vf' || s.rhythmus === 'vt');
export const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// ───────────────────────── Start ─────────────────────────

/** Ziel-Achsen aus Krankheit, Behandlung und Lagerung */
function zielAchsen(s: SimState, aktuell: SimState['achsen']) {
  const z = s.sz;
  const g = s.geraete;
  const xp = Math.pow(s.x, z.potenz);
  const o2b = ({ aus: 0, nasenbrille: 0.05, maske: 0.1, reservoir: 0.15 } as const)[g.o2] * z.o2;
  const lb = z.lagerung[g.lage] ?? {};
  let atem = 1 - z.wA * xp + s.bonus.atem + o2b + (lb.atem ?? 0);
  let kreis = 1 - z.wK * xp + s.bonus.kreis + (lb.kreis ?? 0) + (g.waerme ? z.waerme : 0);
  let neuro = 1 - z.wN * xp + s.bonus.neuro;
  if (g.bvm) atem += 0.25;
  if (g.guedel && aktuell.neuro < 0.35) atem += 0.08;
  if (s.flags.sekret) atem -= 0.25;
  if (s.flags.krampf) atem -= 0.2;
  // Kopplungen: Sauerstoffmangel schwächt das Herz, Kreislaufmangel das Gehirn
  if (aktuell.atem < 0.3) kreis -= (0.3 - aktuell.atem) * 1.4;
  if (aktuell.kreis < 0.3) {
    neuro -= (0.3 - aktuell.kreis) * 1.5;
    atem -= (0.3 - aktuell.kreis) * 0.5;
  }
  if (aktuell.atem < 0.35) neuro -= (0.35 - aktuell.atem) * 1.2;
  return { atem: clamp(atem), kreis: clamp(kreis), neuro: clamp(neuro) };
}

function zielWerte(s: SimState): Werte {
  const z = s.sz;
  const { atem: a, kreis: k, neuro: n } = s.achsen;
  const sp = z.basis.spo2 - (z.basis.spo2 - 38) * Math.pow(1 - a, 1.5);
  let af = z.afHoch ? z.basis.af + (1 - a) * 28 : z.basis.af * (0.35 + 0.65 * n);
  if (z.afHoch && a < 0.3) af *= Math.max(0.2, a / 0.3);
  let hf = z.hfBrady ? z.basis.hf * (0.55 + 0.45 * k) : z.basis.hf + (1 - k) * 45 + (1 - a) * 30;
  if (k < 0.3 && !z.hfBrady) hf *= 0.55 + k * 1.5;
  if (z.hfZiel) hf = z.hfZiel(s);
  const sys = Math.max(40, z.basis.sys * (0.38 + 0.62 * sm(k)));
  return {
    hf,
    sys,
    dia: sys * 0.62,
    spo2: sp,
    af,
    gcs: 3 + 12 * clamp(Math.min(a * 1.15, k * 1.25, n)),
  };
}

export function neuerEinsatz(sz: SimSzenario, seed: number): SimState {
  const s: SimState = {
    sz,
    rng: seed | 0,
    t: 0,
    x: sz.x0,
    wachstumFaktor: 1,
    achsen: { atem: 1, kreis: 1, neuro: 1 },
    bonus: { atem: 0, kreis: 0, neuro: 0 },
    w: { hf: 70, sys: 120, dia: 75, spo2: 98, af: 14, gcs: 15 },
    rhythmus: 'sinus',
    kreislauf: true,
    kritZeit: 0,
    stillstandSeit: null,
    stillstaende: 0,
    rosc: 0,
    cpr: { an: false, seit: 0, q: 0.95, pause: false },
    cprEff: 0,
    ohneHlw: 0,
    handsOff: 0,
    irrev: false,
    letzterWurf: 0,
    defi: { analyse: null, schocks: 0, erfolglos: 0, blitz: -99 },
    geraete: { spo2: false, ekg: false, pads: false, zugang: 0, infusionen: 0, o2: 'aus', bvm: false, guedel: false, waerme: false, lage: sz.startLage, trage: false },
    messung: { nibp: null, bz: null, temp: null, af: null, ekg12: null },
    laufend: [],
    effekte: [],
    notarzt: { angefordert: null, da: false, ankunft: null },
    klinik: null,
    log: [],
    getan: {},
    fehler: [],
    flags: {},
    antworten: [],
    verlauf: [],
    naechsterVerlauf: 0,
    naechsterSpruch: 4,
    spruch: '',
    alarmStumm: -1,
    ende: null,
    eindruck: null,
    gezeigt: {},
  };
  if (sz.startFlags) Object.assign(s.flags, sz.startFlags);
  // Startwerte = Gleichgewicht der Krankheit
  for (let i = 0; i < 6; i++) s.achsen = zielAchsen(s, s.achsen);
  s.w = zielWerte(s);
  s.rhythmus = rhythmusLebend(s);
  logge(s, 'system', 'Einsatzstelle erreicht. Die Uhr läuft.');
  if (sz.startStillstand) {
    s.kreislauf = false;
    s.stillstandSeit = 0;
    s.stillstaende = 1;
    s.achsen = { atem: 0.15, kreis: 0.0, neuro: 0.05 };
    s.rhythmus = sz.stillstand.rhythmus(s);
    s.w.sys = 0;
    s.w.dia = 0;
    s.w.gcs = 3;
  }
  return s;
}

function rhythmusLebend(s: SimState): LiveRhythmus {
  if (s.sz.rhythmus) return s.sz.rhythmus(s);
  return s.w.hf > 100 ? 'tachy' : s.w.hf < 55 ? 'brady' : 'sinus';
}

// ───────────────────────── Stillstand und Wiederbelebung ─────────────────────────

export function kollaps(s: SimState, rhythmus?: LiveRhythmus) {
  if (!s.kreislauf) return;
  s.kreislauf = false;
  s.stillstandSeit = s.t;
  s.stillstaende++;
  s.rhythmus = rhythmus ?? s.sz.stillstand.rhythmus(s);
  s.cprEff = 0;
  s.ohneHlw = 0;
  s.letzterWurf = 0;
  s.cpr.an = false;
  s.defi.analyse = null;
  s.w.sys = 0;
  s.w.dia = 0;
  s.w.gcs = 3;
  logge(s, 'alarm', 'Der Patient sackt zusammen: reagiert nicht, kein Puls – Kreislaufstillstand!');
}

export function rosc(s: SimState) {
  s.kreislauf = true;
  s.rosc++;
  s.achsen = { atem: Math.max(s.achsen.atem, 0.5), kreis: 0.55, neuro: 0.3 };
  s.x = Math.min(s.x, s.sz.roscX ?? 0.45);
  s.wachstumFaktor = 0.3;
  s.w = { ...zielWerte(s), sys: 88, dia: 55, hf: 96 };
  s.rhythmus = 'sinus';
  s.cpr.an = false;
  s.defi.analyse = null;
  s.stillstandSeit = null;
  s.kritZeit = 0;
  logge(s, 'gut', 'Puls tastbar! Der Kreislauf ist zurück (ROSC). Jetzt überwachen und schnell in die Klinik.');
}

export function schockAbgeben(s: SimState) {
  s.defi.schocks++;
  s.defi.blitz = s.t;
  const ok = schockbar(s);
  s.defi.analyse = null;
  if (!ok) {
    fehler(s, 'Schock ohne schockbaren Rhythmus abgegeben.', 2, true);
    return;
  }
  const dauer = Math.max(1, s.t - (s.stillstandSeit ?? s.t));
  const anteil = clamp(s.cprEff / dauer);
  const minuten = dauer / 60;
  const p = clamp(0.45 + 0.2 * anteil - 0.03 * minuten - 0.04 * s.defi.erfolglos + (s.flags.adrenalin ? 0.05 : 0) + (s.flags.amiodaron ? 0.08 : 0), 0.1, 0.88);
  if (zufall(s) < p) rosc(s);
  else {
    s.defi.erfolglos++;
    logge(s, 'info', 'Schock abgegeben. Der Rhythmus besteht weiter – sofort weiter mit der Herzdruckmassage.');
  }
}

/** Wirkt das Herz noch? Messbar ist nur, was angeschlossen ist */
export function sichtbar(s: SimState) {
  const g = s.geraete;
  const stillstand = !s.kreislauf;
  const ekgFrei = s.rhythmus === 'vf' || s.rhythmus === 'asystolie';
  const ekg = g.ekg || g.pads;
  return {
    hf: ekg ? (stillstand && ekgFrei ? null : Math.round(s.w.hf)) : g.spo2 && !stillstand ? Math.round(s.w.hf) : null,
    spo2: g.spo2 && !stillstand ? Math.round(clamp(s.w.spo2, 0, 100)) : null,
    af: g.ekg && !stillstand ? Math.round(s.w.af) : null,
    nibp: s.messung.nibp,
    bz: s.messung.bz,
    temp: s.messung.temp,
  };
}

export function alarmStatus(s: SimState): { prio: 'hoch' | 'mittel' | null; text: string } {
  const g = s.geraete;
  if (g.ekg || g.pads) {
    if (!s.kreislauf && s.rhythmus === 'vf') return { prio: 'hoch', text: 'KAMMERFLIMMERN' };
    if (!s.kreislauf && s.rhythmus === 'asystolie') return { prio: 'hoch', text: 'ASYSTOLIE' };
    if (s.rhythmus === 'vt') return { prio: 'hoch', text: 'KAMMERTACHYKARDIE' };
  }
  if (g.spo2 && !s.kreislauf) return { prio: 'mittel', text: 'KEINE PULSKURVE' };
  if (s.kreislauf && (g.ekg || g.pads || g.spo2)) {
    if (g.spo2 && s.w.spo2 < 90) return { prio: 'hoch', text: 'SpO₂ NIEDRIG' };
    if (s.w.hf > 130) return { prio: 'mittel', text: 'HF HOCH' };
    if (s.w.hf < 45) return { prio: 'mittel', text: 'HF NIEDRIG' };
  }
  return { prio: null, text: '' };
}

// ───────────────────────── Zeit läuft ─────────────────────────

export function tick(s: SimState, dt: number): void {
  if (s.ende) return;
  s.t += dt;
  const z = s.sz;

  // laufende Aktionen
  for (const l of [...s.laufend]) {
    if (s.t >= l.ende) {
      s.laufend = s.laufend.filter((x) => x !== l);
      l.def.fertig(s);
      merke(s, l.def.id);
      if (s.ende) return;
    }
  }
  s.cpr.pause = s.laufend.some((l) => l.def.hlwPause);

  // Notarzt trifft ein
  if (s.notarzt.angefordert !== null && !s.notarzt.da && s.t >= s.notarzt.angefordert + z.notarztEta) {
    s.notarzt.da = true;
    s.notarzt.ankunft = s.t;
    logge(s, 'arzt', 'Der Notarzt ist da: „Was habt ihr? Was brauchst du von mir?“ Jetzt kannst du Medikamente vorschlagen.');
    merke(s, 'notarzt-da');
  }

  // zeitgesteuerte Wirkungen
  for (const e of s.effekte) {
    const von = Math.max(s.t - dt, e.ab);
    const bis = Math.min(s.t, e.bis);
    const d = bis - von;
    if (d <= 0) continue;
    if (e.ziel === 'x') s.x = clamp(s.x + e.rate * d);
    else if (e.ziel === 'bAtem') s.bonus.atem = clamp(s.bonus.atem + e.rate * d, -0.6, 0.6);
    else if (e.ziel === 'bKreis') s.bonus.kreis = clamp(s.bonus.kreis + e.rate * d, -0.6, 0.6);
    else s.bonus.neuro = clamp(s.bonus.neuro + e.rate * d, -0.6, 0.6);
  }
  if (s.effekte.length > 40) s.effekte = s.effekte.filter((e) => e.bis > s.t - 1);

  if (s.kreislauf) lebend(s, dt);
  else stillstand(s, dt);
  if (s.ende) return;

  // Ereignisse und Sprüche
  for (const e of z.ereignisse ?? []) {
    if (!s.gezeigt[e.id] && e.wenn(s)) {
      s.gezeigt[e.id] = true;
      e.aus(s);
    }
  }
  if (s.t >= s.naechsterSpruch) {
    s.naechsterSpruch = s.t + 12;
    const t = z.spruch(s);
    if (t && t !== s.spruch) {
      s.spruch = t;
      logge(s, 'patient', t);
    } else if (!t) s.spruch = '';
  }
  if (s.t >= s.naechsterVerlauf) {
    s.naechsterVerlauf = s.t + 5;
    s.verlauf.push({ t: s.t, hf: s.kreislauf ? s.w.hf : 0, sys: s.kreislauf ? s.w.sys : 0, spo2: s.kreislauf ? s.w.spo2 : 0, af: s.w.af, zustand: zustandProzent(s), kreislauf: s.kreislauf });
  }
}

function lebend(s: SimState, dt: number) {
  const z = s.sz;
  s.x = clamp(s.x + z.wachstum * s.wachstumFaktor * dt);
  const ziel = zielAchsen(s, s.achsen);
  s.achsen.atem = gl(s.achsen.atem, ziel.atem, dt, 18);
  s.achsen.kreis = gl(s.achsen.kreis, ziel.kreis, dt, 28);
  s.achsen.neuro = gl(s.achsen.neuro, ziel.neuro, dt, 40);
  const zw = zielWerte(s);
  s.w.hf = gl(s.w.hf, zw.hf, dt, 8);
  s.w.sys = gl(s.w.sys, zw.sys, dt, 18);
  s.w.dia = gl(s.w.dia, zw.dia, dt, 18);
  s.w.spo2 = gl(s.w.spo2, zw.spo2, dt, 8);
  s.w.af = gl(s.w.af, zw.af, dt, 10);
  s.w.gcs = gl(s.w.gcs, zw.gcs, dt, 15);
  s.rhythmus = rhythmusLebend(s);
  if (z.bzFn) s.flags.bz = z.bzFn(s);

  if (s.achsen.kreis < 0.07 || s.achsen.atem < 0.05) s.kritZeit += dt;
  else s.kritZeit = Math.max(0, s.kritZeit - dt * 0.5);
  if (s.kritZeit > 12) {
    kollaps(s);
    return;
  }
  const h = z.vfRisiko?.(s) ?? 0;
  if (h > 0 && zufall(s) < h * dt) kollaps(s, 'vf');
}

function cprQualitaet(s: SimState): number {
  const dauer = s.t - s.cpr.seit;
  return dauer < 90 ? 0.95 : Math.max(0.45, 0.95 - (dauer - 90) * 0.005);
}

function stillstand(s: SimState, dt: number) {
  const z = s.sz;
  const aktiv = s.cpr.an && !s.cpr.pause;
  if (s.cpr.an) s.cpr.q = cprQualitaet(s);
  if (aktiv) s.cprEff += s.cpr.q * dt;
  else {
    s.ohneHlw += dt;
    s.handsOff += dt;
  }
  const kreisZ = aktiv ? 0.3 * s.cpr.q : 0;
  const atemZ = aktiv ? (s.geraete.bvm ? 0.45 : 0.2) : 0;
  s.achsen.kreis = gl(s.achsen.kreis, kreisZ, dt, 4);
  s.achsen.atem = gl(s.achsen.atem, atemZ, dt, 5);
  s.achsen.neuro = gl(s.achsen.neuro, 0.02, dt, 20);
  s.w.sys = 0;
  s.w.dia = 0;
  s.w.gcs = 3;
  s.w.hf = s.rhythmus === 'pea' ? 40 : s.rhythmus === 'vf' ? 0 : s.rhythmus === 'vt' ? 180 : 0;
  s.w.af = 0;
  const start = s.stillstandSeit ?? s.t;

  // Kammerflimmern wird ohne Schock mit der Zeit zur Asystolie
  if (schockbar(s) && s.t - start > 600 && zufall(s) < 0.004 * dt) {
    s.rhythmus = 'asystolie';
    logge(s, 'alarm', 'Das Kammerflimmern ist in eine Asystolie übergegangen – jetzt nicht mehr schockbar.');
  }
  // nicht schockbare Rhythmen: alle zwei Minuten wirksamer HLW besteht die Chance auf Rückkehr des Kreislaufs
  if (!schockbar(s) && s.cprEff - s.letzterWurf >= 120) {
    s.letzterWurf = s.cprEff;
    const p = (z.stillstand.ursache(s) ? 0.045 : 0.015) + (s.flags.adrenalin ? 0.015 : 0) + (s.geraete.bvm ? 0.01 : 0);
    if (zufall(s) < p) rosc(s);
  }
  if (s.ohneHlw > 360 && !s.irrev) {
    s.irrev = true;
    logge(s, 'system', 'Seit über 6 Minuten ohne Wiederbelebung – die Chance, dass das Gehirn sich erholt, ist sehr gering.');
  }
  if ((s.irrev && s.ohneHlw > 420) || s.t - start > 1200) {
    s.ende = { art: 'tod', t: s.t, grund: s.irrev ? 'Zu lange ohne Wiederbelebung.' : 'Trotz langer Wiederbelebung kehrte der Kreislauf nicht zurück.' };
    logge(s, 'system', 'Der Notarzt beendet die Maßnahmen. Der Patient ist verstorben.');
  }
}

// ───────────────────────── Aktionen ─────────────────────────

export const freieHaende = (s: SimState) => HAENDE - s.laufend.reduce((a, l) => a + l.haende, 0);

/** null = möglich, sonst der Grund */
export function moeglich(s: SimState, d: AktionDef): string | null {
  if (s.ende) return 'Der Einsatz ist beendet.';
  if (s.laufend.some((l) => l.id === d.id)) return 'Läuft schon.';
  if (d.haende > freieHaende(s)) return 'Beide Hände sind beschäftigt.';
  return d.geht?.(s) ?? null;
}

export function starteAktion(s: SimState, d: AktionDef): string | null {
  const grund = moeglich(s, d);
  if (grund) return grund;
  d.start?.(s);
  s.laufend.push({ id: d.id, titel: d.titel, icon: d.icon, start: s.t, ende: s.t + d.dauer, haende: d.haende, def: d });
  return null;
}

export function abfahrt(s: SimState) {
  s.ende = { art: 'uebergabe', t: s.t, grund: 'Übergabe in der Klinik' };
  logge(s, 'gut', 'Abfahrt in die Klinik. Übergabe an das Klinikteam.');
}

// ───────────────────────── Beobachten ─────────────────────────

export function beobachtungen(s: SimState): Beobachtung {
  const { atem: a, kreis: k, neuro: n } = s.achsen;
  const z = s.sz;
  const af = Math.round(s.w.af);
  if (!s.kreislauf) {
    return {
      atemweg: 'Atemweg: Patient bewusstlos, Zunge fällt zurück.',
      atmung: 'Atmung: keine normale Atmung (höchstens Schnappatmung).',
      kreislauf: 'Kreislauf: Haut grau und kalt, kein Puls tastbar.',
      neuro: 'Bewusstsein: bewusstlos, reagiert nicht.',
    };
  }
  const basis: Beobachtung = {
    atemweg: s.flags.sekret ? 'Atemweg: Erbrochenes im Mund – absaugen!' : n < 0.35 ? 'Atemweg: Zunge droht zurückzufallen.' : 'Atemweg: frei, Patient kann sprechen.',
    atmung: `Atmung: ${af < 8 ? 'sehr langsam' : af > 28 ? 'sehr schnell und angestrengt' : af > 20 ? 'beschleunigt' : 'normal'} (etwa ${af} pro Minute).`,
    kreislauf: `Kreislauf: Haut ${k > 0.75 ? 'rosig und warm' : k > 0.5 ? 'blass und kühl' : 'grau, kaltschweißig'}${s.w.sys > 90 ? ', Handgelenkspuls tastbar' : ', Handgelenkspuls kaum tastbar'}.`,
    neuro: `Bewusstsein: ${n > 0.8 && a > 0.6 ? 'wach und orientiert' : n > 0.55 ? 'benommen, verlangsamt' : n > 0.3 ? 'reagiert nur auf lautes Ansprechen' : 'kaum erweckbar'}.`,
  };
  const extra = z.beobachtung?.(s) ?? {};
  return { ...basis, ...extra, sonst: extra.sonst };
}

// ───────────────────────── Auswertung ─────────────────────────

export interface Auswertung {
  art: 'uebergabe' | 'tod';
  sterne: 0 | 1 | 2 | 3;
  quote: number;
  ep: number;
  szenenzeit: number;
  ziele: { titel: string; gewicht: number; ok: boolean; hinweis: string }[];
  fehler: Fehler[];
  klinikRichtig: boolean | null;
}

export function bewerte(s: SimState): Auswertung {
  const z = s.sz;
  const ende = s.ende ?? { art: 'tod' as const, t: s.t, grund: '' };
  const ziele = z.ziele.map((d) => ({ titel: d.titel, gewicht: d.gewicht, ok: d.pruefe(s), hinweis: d.hinweis }));
  const max = ziele.reduce((a, d) => a + d.gewicht, 0);
  const erreicht = ziele.reduce((a, d) => a + (d.ok ? d.gewicht : 0), 0);
  const abzug = s.fehler.reduce((a, f) => a + f.pkt, 0);
  const quote = Math.round(clamp((erreicht - abzug) / Math.max(1, max)) * 100);
  const kritisch = s.fehler.some((f) => f.kritisch);
  const klinikRichtig = s.klinik === null ? null : s.klinik === z.zielklinik || !!z.akzeptabel?.includes(s.klinik);
  let sterne: 0 | 1 | 2 | 3 = 0;
  if (ende.art === 'uebergabe') {
    sterne = 1;
    if (quote >= 55) sterne = 2;
    if (quote >= 80 && !kritisch && ende.t <= z.szenenzeitSoll * 1.3) sterne = 3;
  }
  const ep = ende.art === 'tod' ? 8 + Math.round(quote * 0.15) : 25 + sterne * 15 + Math.round(quote * 0.3);
  return { art: ende.art, sterne, quote, ep, szenenzeit: ende.t, ziele, fehler: s.fehler, klinikRichtig };
}
