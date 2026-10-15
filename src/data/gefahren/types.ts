/** Hintergrund der Szene (wird im Spiel gezeichnet) */
export type Kulisse =
  | 'strasse'
  | 'autobahn'
  | 'wohnung'
  | 'kueche'
  | 'bad'
  | 'baustelle'
  | 'wasser'
  | 'wald'
  | 'industrie'
  | 'gleis'
  | 'park'
  | 'keller'
  | 'sporthalle';

/** Ein Gegenstand in der Szene, den man antippen kann */
export interface GefahrObjekt {
  /** Eindeutig innerhalb der Szene, kebab-case */
  id: string;
  /** Ein einzelnes Emoji, das den Gegenstand zeigt */
  emoji: string;
  /** Kurzer Name, z. B. „Auslaufendes Benzin“ */
  name: string;
  /** Position in Prozent der Bühne (4:3): x 8–92, y 14–88 */
  x: number;
  y: number;
  /** Darstellungsgröße: 1 klein, 2 normal, 3 groß (Standard 2) */
  gross?: 1 | 2 | 3;
  /** true = echte Gefahr für Helfer oder Patienten; false = harmlos */
  gefahr: boolean;
  /** Erklärung nach dem Antippen (1–2 Sätze): warum Gefahr, bzw. warum harmlos */
  text: string;
}

export interface GefahrSzene {
  /** Eindeutig, kebab-case */
  id: string;
  titel: string;
  /** Die Lage in 1–2 Sätzen (Du-Form): Was ist passiert, warum bist du hier? */
  lage: string;
  kulisse: Kulisse;
  /** 7–9 Gegenstände, davon 3–5 Gefahren (gefahr: true) */
  objekte: GefahrObjekt[];
  /** Ein merkbarer Satz zum Mitnehmen (Eigenschutz-Regel) */
  merksatz: string;
}
