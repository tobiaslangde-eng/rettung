/** Zusätzliche Trainings für Ersthelfer/innen: Notruf üben, Was zuerst?, Packlisten, Erste-Hilfe-Lexikon */

/** Eine Frage der Leitstelle im Notruf-Training */
export interface NotrufSchritt {
  /** Was die Leitstelle fragt oder sagt, z. B. „Wo genau ist der Notfall?“ */
  frage: string;
  /** Genau drei Antworten; die ERSTE ist die beste (Reihenfolge wird im Spiel gemischt) */
  antworten: [string, string, string];
  /** Warum die beste Antwort die beste ist (1–2 Sätze) */
  erklaerung: string;
}

export interface NotrufSzenario {
  /** Eindeutig, kebab-case */
  id: string;
  titel: string;
  /** Was du erlebst, kurz (Du-Form) */
  lage: string;
  /** 4–5 Fragen in der Reihenfolge eines echten Notrufs: Wo – Was – Wie viele – Beschwerden – Rückfragen/Warten */
  schritte: NotrufSchritt[];
}

/** Schnelle Entscheidung: Was machst du als Erstes? */
export interface ZuerstFrage {
  /** Eindeutig, Präfix 'z-' */
  id: string;
  /** Die Lage in 1–2 Sätzen (Du-Form) */
  lage: string;
  /** Genau vier Möglichkeiten; die ERSTE ist richtig (Reihenfolge wird gemischt) */
  optionen: [string, string, string, string];
  erklaerung: string;
}

export interface PackItem {
  name: string;
  emoji: string;
  /** Gehört in diese Packliste? */
  gehoert: boolean;
  /** Warum (nicht)? (1 Satz) */
  hinweis: string;
}

/** Was gehört in den Verbandkasten / Rucksack …? */
export interface Packliste {
  /** Eindeutig, kebab-case */
  id: string;
  titel: string;
  lage: string;
  /** 12–14 Gegenstände, 6–9 davon gehören hinein */
  items: PackItem[];
  erklaerung: string;
}

export type LexikonTab = 'handeln' | 'erkennen' | 'wissen';

/** Eintrag im Erste-Hilfe-Lexikon */
export interface HelferLexikonEintrag {
  /** Eindeutig, kebab-case */
  id: string;
  tab: LexikonTab;
  titel: string;
  /** Ein Emoji */
  icon: string;
  /** Ein Satz Einleitung */
  kurz: string;
  /** 3–7 knappe Punkte (bei „handeln“ in der Reihenfolge des Vorgehens) */
  punkte: string[];
  /** Ein Satz zum Merken */
  merke?: string;
}

/** Mythos oder Wahrheit: eine Aussage, die stimmt oder nicht */
export interface Mythos {
  /** Eindeutig, Präfix 'm-' */
  id: string;
  /** Die Aussage, so wie Laien sie oft sagen („Bei Nasenbluten legt man den Kopf in den Nacken.“) */
  aussage: string;
  stimmt: boolean;
  /** Warum richtig oder falsch, mit dem richtigen Vorgehen (1–2 Sätze) */
  erklaerung: string;
}
