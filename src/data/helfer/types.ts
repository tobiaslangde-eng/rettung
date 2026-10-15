/** Ersthelfer-Einsatz: Ich komme als Laie dazu – prüfen, erkennen, richtig handeln. */

/** Eine Prüfung, die ich als Ersthelfer/in vornehmen kann (ohne Messgeräte) */
export interface HelferCheck {
  /** Was ich tue, z. B. „Laut ansprechen und an den Schultern rütteln“ */
  label: string;
  /** Was ich dabei feststelle */
  befund: string;
  /** Muss in diesem Fall unbedingt geprüft werden */
  wichtig: boolean;
}

export interface HelferMassnahme {
  text: string;
  richtig: boolean;
}

export interface HelferFall {
  /** Eindeutig, kebab-case, z. B. 'herzstillstand-supermarkt' */
  id: string;
  difficulty: 1 | 2 | 3;
  /** Kurzer Titel für Listen und Ergebnis, z. B. „Zusammenbruch im Supermarkt“ */
  titel: string;
  patient: { name: string; age: number; sex: 'm' | 'w' };
  /** „Stadt, konkreter Ort“ */
  location: string;
  /** Was passiert und was ich sehe (Du-Form, 2–3 Sätze) */
  situation: string;
  /** 4–6 Prüfungen, davon 2–4 wichtig */
  checks: HelferCheck[];
  /** Was ist los? – in Laiensprache, z. B. „Herzstillstand“ */
  diagnose: string;
  falsch: [string, string, string];
  /** 7–8 Maßnahmen, davon 3–5 richtig */
  massnahmen: HelferMassnahme[];
  /** Was an diesem Fall lehrreich ist (2–3 Sätze) */
  erklaerung: string;
}
