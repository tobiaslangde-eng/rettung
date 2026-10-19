/** Kurze Frage in der Pause zwischen zwei Einsätzen (Fahrzeug- und Materialcheck, Übergabe, Hygiene, Eigenschutz) */
export interface SchichtFrage {
  /** Eindeutig, kebab-case */
  id: string;
  frage: string;
  /** 4 Antworten; die RICHTIGE steht immer an Position 0 (wird im Spiel gemischt) */
  optionen: [string, string, string, string];
  /** Erklärung (1–2 Sätze) */
  erklaerung: string;
}
