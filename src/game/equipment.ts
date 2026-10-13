import { RANKS, rankFor } from './scoring';
import { Progress } from './storage';

/** Mein Rettungswagen: Ausrüstung in vier Stufen – je höher, desto neuer und moderner. */
export type EquipmentId = 'rtw' | 'monitor' | 'rucksack' | 'beatmung' | 'trage' | 'funk' | 'psa';

export const MAX_LEVEL = 4;

export interface EquipmentTier {
  name: string;
  year: number;
  text: string;
}

export interface EquipmentDef {
  id: EquipmentId;
  title: string;
  icon: string;
  tiers: [EquipmentTier, EquipmentTier, EquipmentTier, EquipmentTier];
  /** Budget für Stufe 1–4 (Stufe 1 hat man von Anfang an) */
  cost: [0, number, number, number];
  /** Wirkung im Einsatz für eine Stufe */
  effect: (level: number) => string;
}

const STEP = (level: number) => level - 1;

export const EQUIPMENT: EquipmentDef[] = [
  {
    id: 'rtw',
    title: 'Fahrzeug',
    icon: '🚑',
    cost: [0, 500, 1500, 4000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Schneller vor Ort: Patient startet mit +${2 * STEP(l)} % Zustand`),
    tiers: [
      { name: 'Alter Krankenwagen', year: 1999, text: 'Kastenwagen mit einer Rundumleuchte und orangem Streifen – zuverlässig, aber eng.' },
      { name: 'Rettungswagen Typ C', year: 2012, text: 'Kofferaufbau mit rot-weißer Warnmarkierung und Platz für zwei Retter am Patienten.' },
      { name: 'Moderner Koffer-RTW', year: 2022, text: 'LED-Lichtbalken, gelb-rote Reflexfolie und Luftfederung für eine ruhige Fahrt.' },
      { name: 'Elektro-RTW der Zukunft', year: 2026, text: 'E-Antrieb, Rundum-LED, Kameras und ein klimatisierter Patientenraum.' },
    ],
  },
  {
    id: 'monitor',
    title: 'Patientenmonitor',
    icon: '📈',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Messungen belasten den Patienten ${15 * STEP(l)} % weniger`),
    tiers: [
      { name: 'AED (Laien-Defi)', year: 2005, text: 'Kann nur defibrillieren – alles andere messe ich von Hand.' },
      { name: 'Monitor mit 3-Kanal-EKG', year: 2012, text: 'Zeigt Herzrhythmus, Puls und Sauerstoffsättigung.' },
      { name: 'Monitor-Defi mit 12-Kanal-EKG', year: 2020, text: 'Erkennt Herzinfarkte direkt vor Ort, misst Blutdruck automatisch.' },
      { name: 'Telemetrie-Monitor', year: 2026, text: 'Schickt das EKG live in die Klinik – das Herzkatheterlabor ist vorgewarnt.' },
    ],
  },
  {
    id: 'rucksack',
    title: 'Notfallrucksack',
    icon: '🎒',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Alles schneller griffbereit: +${3 * STEP(l)} % Punkte`),
    tiers: [
      { name: 'Alte Notfalltasche', year: 1995, text: 'Alles in einem großen Fach – ich muss lange suchen.' },
      { name: 'Notfallrucksack', year: 2010, text: 'Mehrere Fächer, beide Hände frei auf dem Weg zum Patienten.' },
      { name: 'Modulares Rucksacksystem', year: 2019, text: 'Herausnehmbare Taschen für Atemweg, Kreislauf und Verbände.' },
      { name: 'Farbcodierte ABCDE-Module', year: 2026, text: 'Jedes Modul passt zu einem Schritt im ABCDE-Schema – ein Griff, alles da.' },
    ],
  },
  {
    id: 'beatmung',
    title: 'Sauerstoff & Beatmung',
    icon: '🫁',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Besser versorgt: +${2 * STEP(l)} % Zustand am Ende`),
    tiers: [
      { name: 'Beatmungsbeutel mit Maske', year: 2000, text: 'Die Basis: Beatmen von Hand.' },
      { name: 'Sauerstoffflasche mit Maske', year: 2010, text: 'Sauerstoff für alle, die schlecht Luft bekommen.' },
      { name: 'Notfall-Beatmungsgerät', year: 2018, text: 'Beatmet gleichmäßig – meine Hände sind frei.' },
      { name: 'Beatmungsgerät mit CPAP', year: 2026, text: 'Unterstützt auch wache Patienten mit Lungenödem oder COPD.' },
    ],
  },
  {
    id: 'trage',
    title: 'Trage',
    icon: '🛏️',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Schonender Transport: +${2 * STEP(l)} % Zustand am Ende`),
    tiers: [
      { name: 'Klapptrage', year: 1990, text: 'Muss von zwei Leuten getragen werden – jede Stufe ruckelt.' },
      { name: 'Fahrtrage', year: 2008, text: 'Mit Rädern und verstellbarem Kopfteil.' },
      { name: 'Elektro-Hydraulik-Trage', year: 2018, text: 'Fährt per Knopfdruck hoch und runter – rückenschonend.' },
      { name: 'Power-Trage mit Ladesystem', year: 2026, text: 'Lädt sich selbst ins Fahrzeug und federt jede Bodenwelle ab.' },
    ],
  },
  {
    id: 'funk',
    title: 'Funk & Navigation',
    icon: '📡',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Bessere Absprache: auf „Schwer“ verschlechtert sich der Patient ${15 * STEP(l)} % langsamer`),
    tiers: [
      { name: 'Stadtplan & Analogfunk', year: 1995, text: 'Rauschender Funk und ein zerknitterter Stadtplan.' },
      { name: 'Navi & Analogfunk', year: 2008, text: 'Das Navi findet den Weg, der Funk rauscht weiter.' },
      { name: 'Digitalfunk mit Navi', year: 2016, text: 'Klare Verbindung zur Leitstelle, Einsatzort direkt im Navi.' },
      { name: 'Einsatz-Tablet mit Live-Lage', year: 2026, text: 'Einsatzdaten, Klinik-Kapazitäten und Notarzt-Standort in Echtzeit.' },
    ],
  },
  {
    id: 'psa',
    title: 'Einsatzkleidung',
    icon: '🦺',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Sicher und schnell im Einsatz: +${3 * STEP(l)} % Punkte`),
    tiers: [
      { name: 'Einfache Warnweste', year: 1995, text: 'Hauptsache gesehen werden.' },
      { name: 'Einsatzjacke mit Reflexstreifen', year: 2010, text: 'Warm, wasserdicht und gut sichtbar.' },
      { name: 'Leichte Einsatzkleidung', year: 2019, text: 'Atmungsaktiv, mit Handschuhfach und Schnittschutz.' },
      { name: 'Premium-Kleidung mit Helm', year: 2026, text: 'Mit Helm, Stirnlampe und Funk-Headset – bereit für jeden Einsatz.' },
    ],
  },
];

export const EQUIPMENT_BY_ID = Object.fromEntries(EQUIPMENT.map((e) => [e.id, e])) as Record<EquipmentId, EquipmentDef>;

/** Ab welchem Dienstgrad (Index in RANKS) eine Stufe freigeschaltet wird */
export const TIER_MIN_RANK: [0, number, number, number] = [0, 0, 2, 4];

export function levelOf(p: Progress, id: EquipmentId): number {
  return Math.min(MAX_LEVEL, Math.max(1, p.equipment[id] ?? 1));
}

/** Gesamtstufe der Ausrüstung (7 bis 28) */
export function totalLevel(p: Progress): number {
  return EQUIPMENT.reduce((s, e) => s + levelOf(p, e.id), 0);
}

export interface EquipmentEffects {
  /** Zusätzlicher Startzustand des Patienten */
  startBonus: number;
  /** Faktor für den Zustandsverlust je Messung */
  measureFactor: number;
  /** Faktor für den Zustandsverlust pro Sekunde auf „Schwer“ */
  drainFactor: number;
  /** Zusätzlicher Zustand am Ende des Einsatzes */
  endBonus: number;
  /** Punkteaufschlag in Prozent */
  pointsPct: number;
}

export function equipmentEffects(p: Progress): EquipmentEffects {
  const l = (id: EquipmentId) => STEP(levelOf(p, id));
  return {
    startBonus: 2 * l('rtw'),
    measureFactor: 1 - 0.15 * l('monitor'),
    drainFactor: 1 - 0.15 * l('funk'),
    endBonus: 2 * (l('trage') + l('beatmung')),
    pointsPct: 3 * (l('rucksack') + l('psa')),
  };
}

export type UpgradeBlock = { reason: 'max' } | { reason: 'rank'; rank: string } | { reason: 'budget'; missing: number };

/** Prüft, ob die nächste Stufe gekauft werden kann; null = ja. */
export function upgradeBlock(p: Progress, id: EquipmentId): UpgradeBlock | null {
  const level = levelOf(p, id);
  if (level >= MAX_LEVEL) return { reason: 'max' };
  const next = level + 1;
  const minRank = TIER_MIN_RANK[next - 1];
  const rankIndex = RANKS.indexOf(rankFor(p.totalPoints).rank);
  if (rankIndex < minRank) return { reason: 'rank', rank: RANKS[minRank].de };
  const cost = EQUIPMENT_BY_ID[id].cost[next - 1];
  if (p.budget < cost) return { reason: 'budget', missing: cost - p.budget };
  return null;
}

export function buyUpgrade(p: Progress, id: EquipmentId): Progress {
  if (upgradeBlock(p, id)) return p;
  const next = levelOf(p, id) + 1;
  return {
    ...p,
    budget: p.budget - EQUIPMENT_BY_ID[id].cost[next - 1],
    equipment: { ...p.equipment, [id]: next },
  };
}

/** 12345 → „12.345 €“ */
export function euro(n: number): string {
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
}
