export type Difficulty = 'leicht' | 'mittel' | 'schwer';

export interface DifficultyDef {
  id: Difficulty;
  label: string;
  et: string;
  icon: string;
  description: string;
  /** Welche Fall-Schwierigkeiten im Pool sind */
  caseLevels: (1 | 2 | 3)[];
  multiplier: number;
  /** Normbereich wird schon vor der Einstufung angezeigt */
  showNormBeforeRating: boolean;
  /** Sofortiges Feedback nach jeder Einstufung (sonst erst im Bericht) */
  instantFeedback: boolean;
  /** Kati gibt Tipps: von selbst, gegen Punkte oder gar nicht */
  hints: 'gratis' | 'kostet' | 'keine';
  /** Zustandsverlust des Patienten je Messung */
  measureCost: number;
  /** Zustandsverlust pro Sekunde (Echtzeit-Druck) */
  drainPerSecond: number;
}

export const HINT_COST = 10;

export const DIFFICULTIES: DifficultyDef[] = [
  {
    id: 'leicht',
    label: 'Leicht',
    et: 'Kerge',
    icon: '◆◇◇',
    description: 'Einfache Fälle. Normwerte werden angezeigt, Kati hilft mir gratis.',
    caseLevels: [1],
    multiplier: 1,
    showNormBeforeRating: true,
    instantFeedback: true,
    hints: 'gratis',
    measureCost: 1,
    drainPerSecond: 0,
  },
  {
    id: 'mittel',
    label: 'Mittel',
    et: 'Keskmine',
    icon: '◆◆◇',
    description: 'Normwerte muss ich kennen. Katis Tipps kosten Punkte. ×1,5 Punkte.',
    caseLevels: [2],
    multiplier: 1.5,
    showNormBeforeRating: false,
    instantFeedback: true,
    hints: 'kostet',
    measureCost: 2,
    drainPerSecond: 0,
  },
  {
    id: 'schwer',
    label: 'Schwer',
    et: 'Raske',
    icon: '◆◆◆',
    description: 'Komplexe Fälle, keine Hilfe, Feedback erst im Bericht – und der Patient verschlechtert sich in Echtzeit! ×2 Punkte.',
    caseLevels: [2, 3],
    multiplier: 2,
    showNormBeforeRating: false,
    instantFeedback: false,
    hints: 'keine',
    measureCost: 3,
    drainPerSecond: 0.5,
  },
];

export const DIFFICULTY_BY_ID = Object.fromEntries(DIFFICULTIES.map((d) => [d.id, d])) as Record<
  Difficulty,
  DifficultyDef
>;
