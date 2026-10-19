export interface SpickPunkt {
  /** Ein kurzer Schritt oder Merkpunkt (max. 70 Zeichen) */
  text: string;
  /** true = besonders wichtig (wird hervorgehoben) */
  wichtig?: boolean;
}

export interface Spickzettel {
  /** Eindeutig, kebab-case */
  id: string;
  /** Ein Emoji */
  icon: string;
  titel: string;
  /** Ab welchem Kapitel der Geschichte freigeschaltet (1-basiert) */
  kapitelAb: number;
  /** 5–8 Punkte in sinnvoller Reihenfolge */
  punkte: SpickPunkt[];
  /** Ein merkbarer Satz für unten auf der Karte (max. 90 Zeichen) */
  merksatz: string;
}
