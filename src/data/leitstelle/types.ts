/** Einsatzmittel, die die Leitstelle losschicken kann */
export type Einsatzmittel = 'rtw' | 'nef' | 'ktw' | 'rth' | 'feuerwehr' | 'polizei';

export const MITTEL_INFO: Record<Einsatzmittel, { icon: string; name: string; kurz: string }> = {
  rtw: { icon: '🚑', name: 'Rettungswagen (RTW)', kurz: 'Notfallrettung mit Rettungssanitäter/in und Notfallsanitäter/in' },
  nef: { icon: '🩺', name: 'Notarzt (NEF)', kurz: 'Notarzt im Einsatzfahrzeug, bei lebensbedrohlichen Lagen' },
  ktw: { icon: '🚐', name: 'Krankentransportwagen (KTW)', kurz: 'Transport ohne akute Lebensgefahr' },
  rth: { icon: '🚁', name: 'Rettungshubschrauber (RTH)', kurz: 'Schwere Verletzungen, weite Wege, schwer erreichbar' },
  feuerwehr: { icon: '🚒', name: 'Feuerwehr', kurz: 'Brand, Technische Hilfe, Türöffnung, Gefahrstoffe, Rettung aus Zwangslagen' },
  polizei: { icon: '🚓', name: 'Polizei', kurz: 'Gewalt, Straftat, Absicherung, Vermisste' },
};

export interface LeitstelleFrage {
  /** Die Frage des Disponenten, z. B. „Wo genau ist der Notfallort?“ */
  text: string;
  /** Die Antwort des Anrufers (wörtliche Rede, kurz und natürlich) */
  antwort: string;
  /** true = wichtig für den Einsatz (Ort, Geschehen, Zahl der Betroffenen, Bewusstsein/Atmung, Gefahren) */
  wichtig: boolean;
}

export interface LeitstelleSzenario {
  /** Eindeutig, kebab-case */
  id: string;
  /** Kurzer Titel für die Liste, ohne die Lösung zu verraten */
  titel: string;
  /** Die erste Meldung des Anrufers, wörtlich, aufgeregt und unvollständig (1–3 Sätze) */
  anruf: string;
  /** 6–7 mögliche Rückfragen, davon 3–4 wichtig; die Reihenfolge im Array ist beliebig gemischt */
  fragen: LeitstelleFrage[];
  /** Das richtige Einsatzmittel (1–4 Stück) */
  mittel: Einsatzmittel[];
  /** Warum diese Mittel (2–3 Sätze), inklusive was man bei diesem Anruf beachtet */
  erklaerung: string;
  /** Anweisung, die der Disponent dem Anrufer bis zum Eintreffen gibt (1 Satz, z. B. Herzdruckmassage) – oder leer */
  anweisung: string;
}
