export interface FehlerSchritt {
  /** Was der Helfer tut (ein Satz, Er/Sie-Form, z. B. „Er legt der Person ein Kissen unter den Kopf.“) */
  text: string;
  /** true = das ist falsch oder gefährlich */
  fehler: boolean;
  /** Erklärung (1–2 Sätze): bei Fehlern warum falsch und was richtig ist, sonst warum es richtig ist */
  erklaerung: string;
}

export interface FehlerSzenario {
  /** Eindeutig, kebab-case */
  id: string;
  titel: string;
  /** Die Lage in 1–2 Sätzen */
  lage: string;
  /** 6–8 Schritte in sinnvoller Reihenfolge, davon 2–4 Fehler */
  schritte: FehlerSchritt[];
  /** Ein merkbarer Satz */
  merksatz: string;
}
