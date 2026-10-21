/**
 * Live-Runde (wie Kahoot): Eine Person eröffnet einen Raum, die anderen treten mit PIN bei, alle spielen live dieselben Fragen.
 * Dieser Teil ist reine Spiellogik ohne Netzwerk: Die Gastgeber-Person (Host) führt das Spiel, die anderen schicken nur ihre Antworten.
 * Die Verbindung selbst steckt in livetransport.ts.
 */

export type LiveModus = 'solo' | 'teams' | 'koop';

/** Spielart: Quiz (Fragen mit vier Antworten) oder Detektiv (Akte mit Hinweisen, die nach und nach auftauchen) */
export type LiveArt = 'quiz' | 'detektiv';

export const ARTEN: { id: LiveArt; icon: string; titel: string; text: string }[] = [
  { id: 'quiz', icon: '❓', titel: 'Quiz', text: 'Eine Frage, vier Antworten – wer richtig und schnell ist, gewinnt.' },
  {
    id: 'detektiv',
    icon: '🕵️',
    titel: 'Detektiv',
    text: 'Eine Akte, Hinweise tauchen nacheinander auf. Wer die Diagnose früh richtig errät, bekommt mehr Punkte.',
  },
];

/** Ein Hinweis in einer Detektiv-Akte */
export interface Hinweis {
  icon: string;
  label: string;
  text: string;
}

export const MODI: { id: LiveModus; icon: string; titel: string; text: string }[] = [
  { id: 'solo', icon: '🏆', titel: 'Jeder gegen jeden', text: 'Wer richtig und schnell antwortet, bekommt die meisten Punkte.' },
  { id: 'teams', icon: '🔴🔵', titel: 'Team gegen Team', text: 'Rot gegen Blau: Die Teams werden automatisch gemischt.' },
  {
    id: 'koop',
    icon: '🤝',
    titel: 'Gemeinsam retten',
    text: 'Alle zusammen gegen die Zeit: Bei zu vielen Fehlern verliert ihr ein Leben.',
  },
];

export const TEAM_NAMEN = ['Rot', 'Blau'] as const;
export const MAX_SPIELER = 20;
export const START_LEBEN = 3;

export interface LiveFrage {
  /** Nur beim Detektiv-Spiel: Hinweise der Akte, nacheinander eingeblendet */
  hinweise?: Hinweis[];
  kopf: string;
  optionen: string[];
  /** Index der richtigen Antwort – bleibt beim Host und geht erst bei der Auswertung an alle */
  richtig: number;
  erklaerung: string;
}

export interface LiveEinstellungen {
  modus: LiveModus;
  art: LiveArt;
  /** Anzahl Fragen bzw. Akten */
  anzahl: number;
  /** Sekunden pro Frage; beim Detektiv-Spiel pro Hinweis */
  sekunden: number;
}

export interface SpielerInfo {
  id: string;
  name: string;
  team: 0 | 1 | null;
  punkte: number;
  verbunden: boolean;
}

export interface RangEintrag extends SpielerInfo {
  platz: number;
  richtige: number;
  zuwachs: number;
}

/** Nachrichten von den Mitspielern an den Host */
export type AnHost = { t: 'hallo'; name: string } | { t: 'antwort'; nr: number; wahl: number };

/** Nachrichten vom Host an die Mitspieler */
export type VonHost =
  | { t: 'lobby'; pin: string; ich: string; einstellungen: LiveEinstellungen; spieler: SpielerInfo[] }
  | {
      t: 'frage';
      nr: number;
      gesamt: number;
      kopf: string;
      optionen: string[];
      sekunden: number;
      modus: LiveModus;
      art: LiveArt;
      /** Detektiv: bisher sichtbare Hinweise, Sekunden pro Hinweis und Anzahl aller Hinweise */
      hinweise: Hinweis[];
      schritt: number;
      anzahlHinweise: number;
    }
  | { t: 'hinweis'; nr: number; hinweis: Hinweis }
  | {
      t: 'auswertung';
      nr: number;
      gesamt: number;
      kopf: string;
      optionen: string[];
      richtig: number;
      verteilung: number[];
      erklaerung: string;
      /** Detektiv: die ganze Akte */
      hinweise: Hinweis[];
      rangliste: RangEintrag[];
      teams: [number, number] | null;
      leben: number | null;
      anteil: number;
      letzte: boolean;
    }
  | {
      t: 'ende';
      rangliste: RangEintrag[];
      teams: [number, number] | null;
      leben: number | null;
      gerettet: boolean | null;
      modus: LiveModus;
    }
  | { t: 'fehler'; grund: 'laeuft' | 'voll' }
  | { t: 'beendet' };

type Phase = 'lobby' | 'frage' | 'auswertung' | 'ende';

interface Antwort {
  wahl: number;
  ms: number;
}

interface Intern extends SpielerInfo {
  richtige: number;
  serie: number;
  zuwachs: number;
}

export interface Zeitgeber {
  setze(fn: () => void, ms: number): unknown;
  loesche(h: unknown): void;
}

/** Punkte für eine richtige Antwort: bis 1000, je schneller desto mehr; dazu ein kleiner Bonus für Serien */
export function punkteFuer(restMs: number, gesamtMs: number, serie: number): number {
  const anteil = Math.max(0, Math.min(1, restMs / gesamtMs));
  const basis = Math.round((400 + 600 * anteil) / 10) * 10;
  return basis + 50 * Math.min(Math.max(serie - 1, 0), 4);
}

/** Detektiv: je mehr Hinweise schon da waren, desto weniger Punkte (1000 beim ersten Hinweis, 300 beim letzten) */
export function punkteDetektiv(sichtbar: number, anzahl: number, serie: number): number {
  const schritt = anzahl > 1 ? 700 / (anzahl - 1) : 0;
  const basis = Math.round((1000 - schritt * (Math.max(1, sichtbar) - 1)) / 10) * 10;
  return basis + 50 * Math.min(Math.max(serie - 1, 0), 4);
}

export const saeubereName = (n: string): string =>
  n
    .replace(/[^\p{L}\p{N} .\-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);

export class LiveHost {
  phase: Phase = 'lobby';
  nr = -1;
  leben = START_LEBEN;
  private spieler = new Map<string, Intern>();
  private antworten = new Map<string, Antwort>();
  private start = 0;
  private handle: unknown = null;
  private hinweisHandles: unknown[] = [];
  private hostId = 'host';

  constructor(
    readonly pin: string,
    public einstellungen: LiveEinstellungen,
    private fragen: LiveFrage[],
    private senden: (id: string, nachricht: VonHost) => void,
    private jetzt: () => number,
    private zeit: Zeitgeber,
    hostName: string,
  ) {
    this.fuegeHinzu(this.hostId, hostName);
  }

  get gesamt() {
    return this.fragen.length;
  }

  private fuegeHinzu(id: string, name: string): Intern {
    const team: 0 | 1 | null = this.einstellungen.modus === 'teams' ? (this.zaehleTeam(0) <= this.zaehleTeam(1) ? 0 : 1) : null;
    const s: Intern = { id, name, team, punkte: 0, verbunden: true, richtige: 0, serie: 0, zuwachs: 0 };
    this.spieler.set(id, s);
    return s;
  }

  private zaehleTeam(t: 0 | 1) {
    return [...this.spieler.values()].filter((s) => s.team === t).length;
  }

  private alle(): Intern[] {
    return [...this.spieler.values()];
  }

  private aktive(): Intern[] {
    return this.alle().filter((s) => s.verbunden);
  }

  private info(s: Intern): SpielerInfo {
    return { id: s.id, name: s.name, team: s.team, punkte: s.punkte, verbunden: s.verbunden };
  }

  private rangliste(): RangEintrag[] {
    const l = this.alle().sort((a, b) => b.punkte - a.punkte || b.richtige - a.richtige || a.name.localeCompare(b.name, 'de'));
    return l.map((s, i) => ({ ...this.info(s), platz: i + 1, richtige: s.richtige, zuwachs: s.zuwachs }));
  }

  /** Teamwertung: Durchschnitt der Punkte je Teammitglied */
  private teamPunkte(): [number, number] | null {
    if (this.einstellungen.modus !== 'teams') return null;
    const wert = (t: 0 | 1) => {
      const m = this.alle().filter((s) => s.team === t);
      return m.length ? Math.round(m.reduce((a, s) => a + s.punkte, 0) / m.length) : 0;
    };
    return [wert(0), wert(1)];
  }

  private anAlle(nachricht: (id: string) => VonHost) {
    this.alle().forEach((s) => s.verbunden && this.senden(s.id, nachricht(s.id)));
  }

  private lobbyNachricht(id: string): VonHost {
    return {
      t: 'lobby',
      pin: this.pin,
      ich: id,
      einstellungen: this.einstellungen,
      spieler: this.alle().map((s) => this.info(s)),
    };
  }

  /** Neue Verbindung: Name prüfen und aufnehmen (oder wieder aufnehmen, wenn der Name zu einer getrennten Person passt) */
  beitritt(id: string, rohName: string): void {
    const name = saeubereName(rohName) || 'Gast';
    const alt = this.alle().find((s) => !s.verbunden && s.name.toLowerCase() === name.toLowerCase());
    if (alt) {
      this.spieler.delete(alt.id);
      this.spieler.set(id, { ...alt, id, verbunden: true });
      if (this.phase === 'frage') this.sendeFrage(id);
      else if (this.phase === 'lobby') this.anAlle((i) => this.lobbyNachricht(i));
      return;
    }
    if (this.phase !== 'lobby') return void this.senden(id, { t: 'fehler', grund: 'laeuft' });
    if (this.alle().length >= MAX_SPIELER) return void this.senden(id, { t: 'fehler', grund: 'voll' });
    // doppelte Namen unterscheiden
    let eindeutig = name;
    for (let n = 2; this.alle().some((s) => s.name.toLowerCase() === eindeutig.toLowerCase()); n++) eindeutig = `${name} ${n}`;
    this.fuegeHinzu(id, eindeutig);
    this.anAlle((i) => this.lobbyNachricht(i));
  }

  verlassen(id: string): void {
    const s = this.spieler.get(id);
    if (!s || id === this.hostId) return;
    if (this.phase === 'lobby') this.spieler.delete(id);
    else s.verbunden = false;
    if (this.phase === 'lobby') this.anAlle((i) => this.lobbyNachricht(i));
    else if (this.phase === 'frage') this.pruefeAlleFertig();
  }

  nachricht(id: string, n: AnHost): void {
    if (n.t === 'hallo') return this.beitritt(id, n.name);
    if (n.t === 'antwort') this.antworte(id, n.nr, n.wahl);
  }

  /** Mindestens zwei Personen (Host plus eine weitere) – für Tests reicht auch eine */
  get kannStarten(): boolean {
    return this.phase === 'lobby' && this.aktive().length >= 2;
  }

  starte(): void {
    if (this.phase !== 'lobby' || this.fragen.length === 0) return;
    this.alle().forEach((s) => {
      s.punkte = 0;
      s.richtige = 0;
      s.serie = 0;
      s.zuwachs = 0;
    });
    this.leben = START_LEBEN;
    this.nr = -1;
    this.naechste();
  }

  private get f() {
    return this.fragen[this.nr];
  }

  private get detektiv(): boolean {
    return this.einstellungen.art === 'detektiv' && !!this.f.hinweise?.length;
  }

  /** Gesamtdauer der aktuellen Frage in Millisekunden */
  private dauerMs(): number {
    const sek = this.einstellungen.sekunden;
    return (this.detektiv ? sek * this.f.hinweise!.length : sek) * 1000;
  }

  /** Wie viele Hinweise sind nach `ms` Millisekunden sichtbar? */
  private sichtbar(ms: number): number {
    if (!this.detektiv) return 0;
    return Math.min(this.f.hinweise!.length, Math.floor(ms / (this.einstellungen.sekunden * 1000)) + 1);
  }

  private frageNachricht(restMs: number): VonHost {
    const f = this.f;
    return {
      t: 'frage',
      nr: this.nr,
      gesamt: this.fragen.length,
      kopf: f.kopf,
      optionen: f.optionen,
      sekunden: Math.max(1, Math.round(restMs / 1000)),
      modus: this.einstellungen.modus,
      art: this.detektiv ? 'detektiv' : 'quiz',
      hinweise: this.detektiv ? f.hinweise!.slice(0, this.sichtbar(this.jetzt() - this.start)) : [],
      schritt: this.detektiv ? this.einstellungen.sekunden : 0,
      anzahlHinweise: this.detektiv ? f.hinweise!.length : 0,
    };
  }

  private sendeFrage(id: string) {
    this.senden(id, this.frageNachricht(this.start + this.dauerMs() - this.jetzt()));
  }

  private loescheTimer() {
    if (this.handle) this.zeit.loesche(this.handle);
    this.handle = null;
    this.hinweisHandles.forEach((h) => this.zeit.loesche(h));
    this.hinweisHandles = [];
  }

  private naechste(): void {
    this.nr++;
    this.phase = 'frage';
    this.antworten.clear();
    this.alle().forEach((s) => (s.zuwachs = 0));
    this.start = this.jetzt();
    const nachricht = this.frageNachricht(this.dauerMs());
    this.anAlle(() => nachricht);
    if (this.detektiv) {
      const nr = this.nr;
      this.f.hinweise!.forEach((h, k) => {
        if (k === 0) return;
        this.hinweisHandles.push(
          this.zeit.setze(
            () => {
              if (this.phase === 'frage' && this.nr === nr) this.anAlle(() => ({ t: 'hinweis', nr, hinweis: h }));
            },
            k * this.einstellungen.sekunden * 1000,
          ),
        );
      });
    }
    this.handle = this.zeit.setze(() => this.werteAus(), this.dauerMs() + 400);
  }

  private antworte(id: string, nr: number, wahl: number) {
    const s = this.spieler.get(id);
    if (!s || this.phase !== 'frage' || nr !== this.nr || this.antworten.has(id)) return;
    if (!Number.isInteger(wahl) || wahl < 0 || wahl >= this.fragen[this.nr].optionen.length) return;
    const ms = Math.min(this.jetzt() - this.start, this.dauerMs());
    this.antworten.set(id, { wahl, ms });
    this.pruefeAlleFertig();
  }

  /** Wie viele haben schon geantwortet (für die Anzeige beim Host) */
  get beantwortet(): number {
    return this.antworten.size;
  }

  private pruefeAlleFertig() {
    if (this.phase !== 'frage') return;
    if (this.aktive().every((s) => this.antworten.has(s.id))) this.werteAus();
  }

  private werteAus(): void {
    if (this.phase !== 'frage') return;
    this.loescheTimer();
    const f = this.fragen[this.nr];
    const gesamtMs = this.dauerMs();
    const verteilung = f.optionen.map(() => 0);
    let richtigeAnzahl = 0;
    this.alle().forEach((s) => {
      const a = this.antworten.get(s.id);
      if (a) verteilung[a.wahl]++;
      if (a && a.wahl === f.richtig) {
        s.serie++;
        s.richtige++;
        richtigeAnzahl++;
        s.zuwachs = this.detektiv
          ? punkteDetektiv(this.sichtbar(a.ms), f.hinweise!.length, s.serie)
          : punkteFuer(gesamtMs - a.ms, gesamtMs, s.serie);
        s.punkte += s.zuwachs;
      } else {
        s.serie = 0;
        s.zuwachs = 0;
      }
    });
    const mitmacher = Math.max(1, this.aktive().length);
    const anteil = richtigeAnzahl / mitmacher;
    if (this.einstellungen.modus === 'koop' && anteil < 0.5) this.leben--;
    const letzte = this.nr + 1 >= this.fragen.length || (this.einstellungen.modus === 'koop' && this.leben <= 0);
    this.phase = 'auswertung';
    const nachricht: VonHost = {
      t: 'auswertung',
      nr: this.nr,
      gesamt: this.fragen.length,
      kopf: f.kopf,
      optionen: f.optionen,
      richtig: f.richtig,
      verteilung,
      erklaerung: f.erklaerung,
      hinweise: f.hinweise ?? [],
      rangliste: this.rangliste(),
      teams: this.teamPunkte(),
      leben: this.einstellungen.modus === 'koop' ? this.leben : null,
      anteil,
      letzte,
    };
    this.anAlle(() => nachricht);
  }

  /** Host tippt „Weiter“ (oder „Ergebnis“) */
  weiter(): void {
    if (this.phase !== 'auswertung') return;
    const koop = this.einstellungen.modus === 'koop';
    if (this.nr + 1 >= this.fragen.length || (koop && this.leben <= 0)) {
      this.phase = 'ende';
      const nachricht: VonHost = {
        t: 'ende',
        rangliste: this.rangliste(),
        teams: this.teamPunkte(),
        leben: koop ? this.leben : null,
        gerettet: koop ? this.leben > 0 : null,
        modus: this.einstellungen.modus,
      };
      this.anAlle(() => nachricht);
    } else this.naechste();
  }

  /** Host will „Frage überspringen“: sofort auswerten */
  beende(): void {
    this.werteAus();
  }

  /** Neue Runde mit denselben Leuten */
  neueRunde(einstellungen: LiveEinstellungen, fragen: LiveFrage[]): void {
    this.loescheTimer();
    this.einstellungen = einstellungen;
    this.fragen = fragen;
    this.phase = 'lobby';
    this.nr = -1;
    // Getrennte Personen fliegen raus, Teams neu mischen
    [...this.spieler.values()].filter((s) => !s.verbunden).forEach((s) => this.spieler.delete(s.id));
    const rest = this.alle();
    rest.forEach((s) => {
      s.punkte = 0;
      s.richtige = 0;
      s.serie = 0;
      s.zuwachs = 0;
      s.team = null;
    });
    if (einstellungen.modus === 'teams') rest.forEach((s, i) => (s.team = (i % 2) as 0 | 1));
    this.anAlle((i) => this.lobbyNachricht(i));
  }

  /** Raum schließen: alle bekommen Bescheid */
  schliesse(): void {
    this.loescheTimer();
    this.alle().forEach((s) => s.id !== this.hostId && s.verbunden && this.senden(s.id, { t: 'beendet' }));
  }

  /** Aktueller Stand der Lobby für die Anzeige beim Host */
  lobbyStand(): VonHost {
    return this.lobbyNachricht(this.hostId);
  }
}

/** Was eine Person auf dem Handy sieht – wird aus den Nachrichten des Hosts aufgebaut */
export type Ansicht =
  | { phase: 'verbinden' }
  | { phase: 'lobby'; pin: string; ich: string; einstellungen: LiveEinstellungen; spieler: SpielerInfo[] }
  | {
      phase: 'frage';
      nr: number;
      gesamt: number;
      kopf: string;
      optionen: string[];
      sekunden: number;
      modus: LiveModus;
      art: LiveArt;
      hinweise: Hinweis[];
      schritt: number;
      anzahlHinweise: number;
      empfangen: number;
      gewaehlt: number | null;
    }
  | (Extract<VonHost, { t: 'auswertung' }> & { phase: 'auswertung'; gewaehlt: number | null })
  | (Extract<VonHost, { t: 'ende' }> & { phase: 'ende' })
  | { phase: 'getrennt'; grund: 'beendet' | 'verloren' | 'laeuft' | 'voll' };

export function neueAnsicht(alt: Ansicht, n: VonHost, jetzt: number): Ansicht {
  switch (n.t) {
    case 'lobby':
      return { phase: 'lobby', pin: n.pin, ich: n.ich, einstellungen: n.einstellungen, spieler: n.spieler };
    case 'frage':
      return {
        phase: 'frage',
        nr: n.nr,
        gesamt: n.gesamt,
        kopf: n.kopf,
        optionen: n.optionen,
        sekunden: n.sekunden,
        modus: n.modus,
        art: n.art,
        hinweise: n.hinweise,
        schritt: n.schritt,
        anzahlHinweise: n.anzahlHinweise,
        empfangen: jetzt,
        gewaehlt: null,
      };
    case 'hinweis':
      return alt.phase === 'frage' && alt.nr === n.nr && alt.hinweise.length < alt.anzahlHinweise
        ? { ...alt, hinweise: [...alt.hinweise, n.hinweis] }
        : alt;
    case 'auswertung':
      return { ...n, phase: 'auswertung', gewaehlt: alt.phase === 'frage' ? alt.gewaehlt : null };
    case 'ende':
      return { ...n, phase: 'ende' };
    case 'fehler':
      return { phase: 'getrennt', grund: n.grund };
    case 'beendet':
      return { phase: 'getrennt', grund: 'beendet' };
  }
}
