import { Progress } from './storage';

/** Meine Rettungswache: fünf Bereiche, jeweils in drei Ausbaustufen (Stufe 0 = noch nicht gebaut) */
export type WacheId = 'halle' | 'funk' | 'lager' | 'ruhe' | 'schule';

export const WACHE_MAX = 3;

export interface WacheDef {
  id: WacheId;
  title: string;
  icon: string;
  /** Echtes Rettungsdienst-Wissen zum Bereich */
  wissen: string;
  stufen: [string, string, string];
  cost: [number, number, number];
  /** Wirkung im Einsatz, pro Stufe */
  wirkung: string;
}

export const WACHE: WacheDef[] = [
  {
    id: 'halle',
    title: 'Fahrzeughalle',
    icon: '🚑',
    wissen:
      'Auf der Wache stehen die Fahrzeuge einsatzbereit, oft mit Landstrom und Druckluft – so sind sie nach dem Alarm in unter einer Minute auf der Straße.',
    stufen: ['Einzelgarage', 'Doppelhalle mit Landstrom', 'Halle mit Waschplatz und Abgasabsaugung'],
    cost: [600, 1800, 4500],
    wirkung: 'Schneller ausgerückt: Patient startet mit +1 % Zustand je Stufe',
  },
  {
    id: 'funk',
    title: 'Funkraum',
    icon: '📡',
    wissen:
      'Die Leitstelle alarmiert per Funkmeldeempfänger und Digitalfunk. Je besser die Anbindung, desto genauer sind die Informationen schon auf der Anfahrt.',
    stufen: ['Funkgerät und Telefon', 'Digitalfunk mit Einsatzdrucker', 'Einsatzleitrechner mit Lagekarte'],
    cost: [600, 1800, 4500],
    wirkung: 'Bessere Vorinformation: Zustand sinkt 5 % langsamer je Stufe',
  },
  {
    id: 'lager',
    title: 'Materiallager',
    icon: '📦',
    wissen:
      'Nach jedem Einsatz werden Verbrauchsmaterial aufgefüllt und Geräte desinfiziert. Ein sauberes, geordnetes Lager spart im Einsatz Zeit.',
    stufen: ['Regal und Schrank', 'Lager mit Desinfektionsecke', 'Lager mit Scheuer-Wisch-Desinfektion und Inventarliste'],
    cost: [600, 1800, 4500],
    wirkung: 'Messungen kosten weniger Zeit: −5 % Zustandsverlust je Stufe',
  },
  {
    id: 'ruhe',
    title: 'Ruheraum und Küche',
    icon: '🛋️',
    wissen:
      'Rettungsdienst ist Schichtarbeit. Erholte Teams arbeiten konzentrierter – deshalb gibt es auf der Wache Ruheraum, Küche und Duschen.',
    stufen: ['Sofa und Kaffeemaschine', 'Ruheraum mit Küche', 'Ruheräume, Küche und Dusche'],
    cost: [600, 1800, 4500],
    wirkung: 'Ausgeruhtes Team: +2 % Punkte je Stufe',
  },
  {
    id: 'schule',
    title: 'Schulungsraum',
    icon: '🎓',
    wissen:
      'Rettungsdienstpersonal muss jedes Jahr Pflichtfortbildungen absolvieren. Ein eigener Schulungsraum macht Übungen auf der Wache möglich.',
    stufen: ['Whiteboard und Stühle', 'Beamer und Übungspuppe', 'Simulationsraum mit Reanimationspuppe'],
    cost: [600, 1800, 4500],
    wirkung: 'Gut geübt: +1 Zustand am Einsatzende und +1 % Punkte je Stufe',
  },
];

export const WACHE_BY_ID = Object.fromEntries(WACHE.map((w) => [w.id, w])) as Record<WacheId, WacheDef>;

export const wacheLevel = (p: Progress, id: WacheId): number => p.wache?.[id] ?? 0;

export const wacheGesamt = (p: Progress): number => WACHE.reduce((n, w) => n + wacheLevel(p, w.id), 0);
export const WACHE_GESAMT_MAX = WACHE.length * WACHE_MAX;

/** Kostet die nächste Stufe, oder null wenn voll ausgebaut */
export function wacheKosten(p: Progress, id: WacheId): number | null {
  const l = wacheLevel(p, id);
  return l >= WACHE_MAX ? null : WACHE_BY_ID[id].cost[l];
}

export function wacheKaufen(p: Progress, id: WacheId): Progress {
  const cost = wacheKosten(p, id);
  if (cost === null || p.budget < cost) return p;
  return { ...p, budget: p.budget - cost, wache: { ...p.wache, [id]: wacheLevel(p, id) + 1 } };
}

/** Wirkung der Wache im Einsatz (nur Sanitäter/in) */
export function wacheEffekte(p: Progress) {
  const l = (id: WacheId) => wacheLevel(p, id);
  return {
    startBonus: l('halle'),
    drain: 0.05 * l('funk'),
    measure: 0.05 * l('lager'),
    pointsPct: 2 * l('ruhe') + l('schule'),
    endBonus: l('schule'),
  };
}
