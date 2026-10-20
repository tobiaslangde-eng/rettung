/** Wissensbasis: Artikel zu Erster Hilfe, Rettungsdienst und Medizin. Werden von „Frag Kati“ und der Lexikon-Suche durchsucht. */
export type WissensKategorie =
  | 'erste-hilfe'
  | 'herz-kreislauf'
  | 'atmung'
  | 'neuro-psyche'
  | 'trauma-umwelt'
  | 'kinder-frauen-alter'
  | 'vergiftung-allergie-infektion'
  | 'koerper'
  | 'rettungsdienst'
  | 'begriffe'
  | 'medikamente'
  | 'erkrankungen';

export const KATEGORIE_NAMEN: Record<WissensKategorie, string> = {
  'erste-hilfe': 'Erste Hilfe',
  'herz-kreislauf': 'Herz und Kreislauf',
  atmung: 'Atmung',
  'neuro-psyche': 'Nerven, Stoffwechsel und Psyche',
  'trauma-umwelt': 'Verletzungen und Umwelt',
  'kinder-frauen-alter': 'Kinder, Schwangerschaft und Alter',
  'vergiftung-allergie-infektion': 'Vergiftung, Allergie und Infektion',
  koerper: 'Der Körper und Messwerte',
  rettungsdienst: 'Rettungsdienst und Recht',
  begriffe: 'Fachbegriffe und Abkürzungen',
  medikamente: 'Medikamente und Hilfsmittel',
  erkrankungen: 'Häufige Erkrankungen',
};

export interface Wissensartikel {
  /** Eindeutig, kebab-case, beginnt mit dem Kategorie-Kürzel (siehe Autorenanleitung) */
  id: string;
  kategorie: WissensKategorie;
  titel: string;
  /** Andere Wörter, unter denen man das Thema sucht: Umgangssprache, Abkürzungen, Fachwörter, Schreibvarianten (mindestens 2) */
  stichworte: string[];
  /** 1–2 Sätze: Worum geht es? */
  kurz: string;
  /** 3–8 knappe Punkte (Erkennen, Maßnahmen, Hintergrund – je nach Thema) */
  punkte: string[];
  /** Wann sofort der Notruf 112 oder ärztliche Hilfe nötig ist (bei Notfallthemen Pflicht) */
  alarm?: string;
  /** Ein merkbarer Satz */
  merke?: string;
  /** beide = für alle, helfer = Laienwissen, sani = Fachvertiefung für den Rettungsdienst */
  fuer: 'beide' | 'helfer' | 'sani';
}
