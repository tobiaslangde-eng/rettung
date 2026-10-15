import { VitalId, VitalValue } from '../vitals';

/** Ordner im Archiv der Detektiv-Akten – nach Körpersystem bzw. Art des Notfalls */
export type Kategorie = 'herz' | 'atmung' | 'neuro' | 'bauch' | 'trauma' | 'umwelt' | 'kinder' | 'frauen';

export const KATEGORIEN: { id: Kategorie; icon: string; title: string }[] = [
  { id: 'herz', icon: '❤️', title: 'Herz & Kreislauf' },
  { id: 'atmung', icon: '🌬️', title: 'Atmung' },
  { id: 'neuro', icon: '🧠', title: 'Nerven & Psyche' },
  { id: 'bauch', icon: '🍬', title: 'Stoffwechsel & Bauch' },
  { id: 'trauma', icon: '🦴', title: 'Verletzungen' },
  { id: 'umwelt', icon: '☣️', title: 'Umwelt & Vergiftung' },
  { id: 'kinder', icon: '🧸', title: 'Kinder-Notfälle' },
  { id: 'frauen', icon: '🤰', title: 'Schwangerschaft & Geburt' },
];

/** Krankheitsbild: bündelt alle Situationen (Akten) mit derselben Diagnose */
export interface AktenBild {
  /** Kurzer Schlüssel in Kleinbuchstaben, z. B. 'stemi' */
  id: string;
  /** So heißt die richtige Antwort im Spiel, z. B. „Akuter Herzinfarkt (STEMI)“ */
  diagnosis: string;
  kategorie: Kategorie;
  /** Die Beweise, die nach dem Lösen angezeigt werden (genau drei) */
  leitsymptome: string[];
}

/** Eine Situation (Akte) zu einem Krankheitsbild */
export interface AktenFall {
  /** Eindeutig, z. B. 'stemi-frau' – der Spielstand merkt sich gelöste Akten über diese Kennung */
  id: string;
  /** Kennung des Krankheitsbilds */
  bild: string;
  difficulty: 1 | 2 | 3;
  patient: { name: string; age: number; sex: 'm' | 'w' };
  /** „Stadt, konkreter Ort“ */
  location: string;
  /** Meldung der Leitstelle – knapp, verrät die Diagnose nicht */
  dispatch: string;
  /** Was ich beim Eintreffen sehe (Ich-Perspektive) */
  scene: string;
  /** Genau drei Aussagen, vom Allgemeinen zum Verräterischen */
  anamnese: string[];
  /** Sichtbare Befunde */
  befund: string[];
  vitals: Record<VitalId, VitalValue>;
  /** Wichtigste Messwerte dieser Situation, nach Bedeutung geordnet (2–4) */
  keyVitals: VitalId[];
  /** Drei falsche Verdachtsdiagnosen, die zu dieser Situation passen könnten */
  distractors: [string, string, string];
  /** Was an dieser Situation lehrreich ist (2–3 Sätze) */
  explanation: string;
  /** Nur angeben, wenn die Beweise vom Krankheitsbild abweichen (z. B. bei atypischen Verläufen) */
  leitsymptome?: string[];
}

/** Fertige Akte, wie das Spiel sie nutzt: Fall plus Diagnose, Kategorie und Beweise aus dem Krankheitsbild */
export interface DetektivFall extends Omit<AktenFall, 'leitsymptome'> {
  diagnosis: string;
  kategorie: Kategorie;
  leitsymptome: string[];
}
