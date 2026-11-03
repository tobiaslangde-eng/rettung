import { KATEGORIEN, Kategorie } from '../data/akten';
import { Progress } from './storage';

/** Gemeinsame Felder der Einsätze beider Rollen */
export interface FallInfo {
  id: string;
  difficulty: 1 | 2 | 3;
  kategorie?: Kategorie;
}

export interface BereichStand {
  id: string;
  icon: string;
  titel: string;
  gesamt: number;
  gespielt: number;
  gemeistert: number;
  /** Durchschnittliche Sterne der gespielten Einsätze (0–3) */
  schnitt: number;
}

const STUFEN: { id: string; icon: string; titel: string; level: 1 | 2 | 3 }[] = [
  { id: 'leicht', icon: '◆', titel: 'Leichte Notfälle', level: 1 },
  { id: 'mittel', icon: '◆◆', titel: 'Mittlere Notfälle', level: 2 },
  { id: 'schwer', icon: '◆◆◆', titel: 'Schwere Notfälle', level: 3 },
];

function stand(id: string, icon: string, titel: string, faelle: FallInfo[], sterne: Progress['bestStars']): BereichStand {
  const gespielt = faelle.filter((f) => f.id in sterne);
  const summe = gespielt.reduce((s, f) => s + (sterne[f.id] ?? 0), 0);
  return {
    id,
    icon,
    titel,
    gesamt: faelle.length,
    gespielt: gespielt.length,
    gemeistert: gespielt.filter((f) => (sterne[f.id] ?? 0) >= 3).length,
    schnitt: gespielt.length ? summe / gespielt.length : 0,
  };
}

/**
 * Lernstand je Bereich. Mit Kategorien (Sanitätsdienst) nach Körpersystem,
 * sonst (Ersthelfer) nach Schwierigkeit.
 */
export function bereichStaende(faelle: FallInfo[], sterne: Progress['bestStars']): BereichStand[] {
  if (faelle.some((f) => f.kategorie)) {
    return KATEGORIEN.map((k) => stand(k.id, k.icon, k.title, faelle.filter((f) => f.kategorie === k.id), sterne)).filter((b) => b.gesamt > 0);
  }
  return STUFEN.map((s) => stand(s.id, s.icon, s.titel, faelle.filter((f) => f.difficulty === s.level), sterne)).filter((b) => b.gesamt > 0);
}

/** Schon gespielte Einsätze mit höchstens einem Stern – die lohnen sich zum Wiederholen (schlechteste zuerst) */
export function schwacheFaelle<T extends FallInfo>(faelle: T[], sterne: Progress['bestStars']): T[] {
  return faelle
    .filter((f) => f.id in sterne && (sterne[f.id] ?? 0) <= 1)
    .sort((a, b) => (sterne[a.id] ?? 0) - (sterne[b.id] ?? 0));
}

/** Stärken (beste Durchschnitte) und Lücken (ungespielt oder schwach) in Worten */
export function einschaetzung(bereiche: BereichStand[]): { staerken: BereichStand[]; luecken: BereichStand[] } {
  const spielbar = bereiche.filter((b) => b.gespielt >= 2);
  const staerken = [...spielbar].filter((b) => b.schnitt >= 2).sort((a, b) => b.schnitt - a.schnitt).slice(0, 2);
  const luecken = [...bereiche]
    .filter((b) => b.gespielt < b.gesamt)
    .map((b) => ({ b, wert: b.gespielt === 0 ? -1 : b.schnitt - b.gespielt / b.gesamt }))
    .sort((x, y) => x.wert - y.wert)
    .slice(0, 2)
    .map((x) => x.b);
  return { staerken, luecken };
}
