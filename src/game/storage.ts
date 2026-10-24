import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from './difficulty';
import { Rolle } from './rolle';

// Die Vorschau-Version (rettung.tankard.de/vorschau/) hat einen eigenen Spielstand, damit Tests den echten nicht verändern.
const PREVIEW = (globalThis as { E112_VORSCHAU?: boolean }).E112_VORSCHAU === true;
const P = PREVIEW ? 'kiirabi.vorschau.' : 'kiirabi.';
/** Jede Rolle hat einen eigenen Spielstand; der Sanitäter-Stand liegt (wie früher) unter dem alten Namen. */
const KEYS: Record<Rolle, string> = { sani: P + 'progress.v1', helfer: P + 'helfer.progress.v1' };
const ROLLE_KEY = P + 'rolle.v1';

/** Zuletzt gewählte Rolle; null = noch nie gewählt (dann kommt die Auswahl beim Start) */
export async function loadRolle(): Promise<Rolle | null> {
  try {
    const r = await AsyncStorage.getItem(ROLLE_KEY);
    return r === 'sani' || r === 'helfer' ? r : null;
  } catch {
    return null;
  }
}

export async function saveRolle(r: Rolle): Promise<void> {
  try {
    await AsyncStorage.setItem(ROLLE_KEY, r);
  } catch {
    // optional
  }
}

export interface Progress {
  totalPoints: number;
  casesPlayed: number;
  correctDiagnoses: number;
  /** Beste Sternewertung je Fall-ID */
  bestStars: Record<string, number>;
  /** Zuletzt gewählte Schwierigkeit */
  difficulty: Difficulty;
  /** Einsätze in Folge mit mindestens 2 Sternen */
  streak: number;
  /** Einsätze mit 3 Sternen */
  perfectRuns: number;
  /** Einsätze auf „Schwer“ mit mindestens 2 Sternen */
  hardWins: number;
  /** Bestes Ergebnis im Schnelltraining (von 10) */
  quizBest: number;
  /** Freigeschaltete Abzeichen (IDs) */
  badges: string[];
  /** Tagesdienst: Tag (JJJJ-MM-TT), auf den sich `dayCases` bezieht */
  dayKey: string;
  /** Einsätze an diesem Tag */
  dayCases: number;
  /** Tag, an dem der „Einsatz des Tages“ zuletzt gespielt wurde */
  dailyCaseDay: string;
  /** Tag, an dem das Tagesziel zuletzt erreicht wurde */
  lastGoalDay: string;
  /** Tage in Folge mit erreichtem Tagesziel */
  dayStreak: number;
  bestDayStreak: number;
  /** Bestes Ergebnis bei den Wissensfragen (von 10) */
  knowBest: number;
  /** Beste Trefferquote bei der Herzdruckmassage in Prozent */
  cprBest: number;
  /** Großeinsatz: bestes Sichtungsergebnis (von 8) */
  manvBest: number;
  /** Kalenderwoche (z. B. 2026-W42), auf die sich `weekPoints` bezieht */
  weekKey: string;
  weekPoints: number;
  /** EP vergangener Wochen (nur Wochen, in denen gespielt wurde) */
  weekHistory: { week: string; points: number }[];
  /** Coins der Wache für Ausrüstung – jeder verdiente EP bringt 1 Coin */
  budget: number;
  /** Ausrüstungsstufen (1–4) je Ausrüstung */
  equipment: Record<string, number>;
  /** Detektiv-Akten: Stempel im Archiv je Fall (1 = gelöst, 2 = Meisterlösung) */
  detectiveSolved: Record<string, 1 | 2>;
  /** Detektiv-Akten: beste Punktzahl einer Ermittlung */
  detectiveBest: number;
  /** Detektiv-Akten: Anzahl Ermittlungen */
  detectiveRounds: number;
  /** Geschichte: Anzahl abgeschlossener Kapitel */
  story: number;
  /** Schritt für Schritt: richtig sortierte Abläufe (IDs) */
  ablaeufe: string[];
  /** Notruf üben: geschaffte Szenarien (IDs) */
  notrufGeschafft: string[];
  /** Was zuerst?: bestes Ergebnis (von 10) */
  zuerstBest: number;
  /** Gut gepackt: richtig gepackte Listen (IDs) */
  packGeschafft: string[];
  aedGeschafft: string[];
  handgriffeBest: number;
  mythenBest: number;
  pruefungBest: number;
  /** Ausbaustufen der Rettungswache (Sanitäter/in) */
  wache: Record<string, number>;
  /** Ausbaustufen des Hilfspunkts (Ersthelfer/in) */
  hilfspunkt: Record<string, number>;
  /** Spielweise: mit Geschichte oder frei; leer = noch nicht gewählt */
  modus: 'story' | 'frei' | '';
  /** Gefahren-Check: gelöste Szenen (IDs) */
  gefahrGeschafft: string[];
  /** Urkunden: Tag (JJJJ-MM-TT), an dem sie erreicht wurden */
  urkundenDatum: Record<string, string>;
  /** Name auf den Urkunden */
  spielerName: string;
  /** Stadtkarte: angefahrene Einsätze */
  kartenEinsaetze: number;
  /** Wie oft die schnellere Route gewählt wurde (Staus umfahren) */
  kartenRouten: number;
  /** Tagesserie: Meilensteine (Tage), für die die Belohnung schon vergeben wurde */
  serieBelohnt: number[];
  /** Leitstelle spielen: gelöste Szenarien (IDs) */
  leitstelleGeschafft: string[];
  /** Fehler finden: gelöste Szenarien (IDs) */
  fehlerGeschafft: string[];
  /** Interaktive Handgriffe: geschaffte Übungen (IDs) */
  laborGeschafft: string[];
  /** Schichtmodus: abgeschlossene Schichten */
  schichten: number;
  /** Duell: gespielte Duelle und Siege */
  duellGespielt: number;
  duellSiege: number;
  /** Live-Runde: gespielte Runden und Siege */
  liveGespielt: number;
  liveSiege: number;
  /** EKG lesen: insgesamt richtig eingeordnete Streifen */
  ekgRichtig: number;
  /** Spickzettel, die schon gespeichert oder geöffnet wurden (IDs) */
  spickGesehen: string[];
  /** Rückmeldung wurde schon gegeben */
  feedbackGegeben: boolean;
}

export const EMPTY_PROGRESS: Progress = {
  totalPoints: 0,
  casesPlayed: 0,
  correctDiagnoses: 0,
  bestStars: {},
  difficulty: 'leicht',
  streak: 0,
  perfectRuns: 0,
  hardWins: 0,
  quizBest: 0,
  badges: [],
  dayKey: '',
  dayCases: 0,
  dailyCaseDay: '',
  lastGoalDay: '',
  dayStreak: 0,
  bestDayStreak: 0,
  knowBest: 0,
  cprBest: 0,
  manvBest: 0,
  weekKey: '',
  weekPoints: 0,
  weekHistory: [],
  budget: 0,
  equipment: {},
  detectiveSolved: {},
  detectiveBest: 0,
  detectiveRounds: 0,
  story: 0,
  ablaeufe: [],
  notrufGeschafft: [],
  zuerstBest: 0,
  packGeschafft: [],
  aedGeschafft: [],
  handgriffeBest: 0,
  mythenBest: 0,
  pruefungBest: 0,
  wache: {},
  hilfspunkt: {},
  modus: '',
  gefahrGeschafft: [],
  urkundenDatum: {},
  spielerName: '',
  kartenEinsaetze: 0,
  kartenRouten: 0,
  serieBelohnt: [],
  leitstelleGeschafft: [],
  fehlerGeschafft: [],
  laborGeschafft: [],
  schichten: 0,
  duellGespielt: 0,
  duellSiege: 0,
  liveGespielt: 0,
  liveSiege: 0,
  ekgRichtig: 0,
  spickGesehen: [],
  feedbackGegeben: false,
};

const BAK = '.bak';

function lese(raw: string | null): Progress | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null) return null;
    // Ältere Spielstände kannten noch kein Coins: Startbudget = bisher gesammelte EP.
    if (saved.budget === undefined) saved.budget = saved.totalPoints ?? 0;
    return { ...EMPTY_PROGRESS, ...saved };
  } catch {
    return null;
  }
}

export async function loadProgress(rolle: Rolle): Promise<Progress> {
  try {
    const key = KEYS[rolle];
    const haupt = await AsyncStorage.getItem(key);
    const stand = lese(haupt);
    if (stand) return stand;
    // Hauptspeicher leer oder beschädigt: Sicherungskopie nehmen
    const kopie = await AsyncStorage.getItem(key + BAK);
    const gesichert = lese(kopie);
    if (gesichert) {
      if (haupt) await AsyncStorage.setItem(key + '.defekt', haupt).catch(() => {});
      await AsyncStorage.setItem(key, kopie as string).catch(() => {});
      return gesichert;
    }
    return EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export async function saveProgress(rolle: Rolle, p: Progress): Promise<void> {
  try {
    const text = JSON.stringify(p);
    await AsyncStorage.setItem(KEYS[rolle], text);
    // zweite Kopie: schützt vor einem beschädigten Hauptspeicher
    await AsyncStorage.setItem(KEYS[rolle] + BAK, text);
  } catch {
    // Fortschritt ist optional – Spiel läuft auch ohne Speicher weiter.
  }
}

const CODE_PREFIX = 'E112-';

/** Spielstand als Text-Code, um ihn auf ein anderes Gerät oder eine neue Adresse mitzunehmen. */
export function exportCode(p: Progress): string {
  return CODE_PREFIX + btoa(encodeURIComponent(JSON.stringify(p)));
}

/** Liest einen Spielstand-Code; null, wenn der Code ungültig ist. */
export function importCode(code: string): Progress | null {
  try {
    const raw = code.replace(/\s+/g, '').replace(CODE_PREFIX, '');
    const data = JSON.parse(decodeURIComponent(atob(raw)));
    if (typeof data !== 'object' || data === null || typeof data.totalPoints !== 'number') return null;
    return { ...EMPTY_PROGRESS, ...data };
  } catch {
    return null;
  }
}

const EINFUEHRUNG_KEY = 'e112.einfuehrung.v1';

/** Hat der Spieler die Einführung schon gesehen? */
export async function einfuehrungGesehen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(EINFUEHRUNG_KEY)) === '1';
  } catch {
    return true;
  }
}

export async function merkeEinfuehrungGesehen(): Promise<void> {
  try {
    await AsyncStorage.setItem(EINFUEHRUNG_KEY, '1');
  } catch {
    // egal
  }
}

const KI_OK_KEY = 'e112.ki.ok.v1';

/** Hat der Spieler der KI-Nutzung zugestimmt? (null = noch nicht gefragt) */
export async function kiZustimmung(): Promise<boolean | null> {
  try {
    const v = await AsyncStorage.getItem(KI_OK_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

export async function merkeKiZustimmung(ja: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KI_OK_KEY, ja ? '1' : '0');
  } catch {
    // egal
  }
}
