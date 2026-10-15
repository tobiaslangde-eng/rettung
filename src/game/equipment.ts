import { aktiveRolle } from './rolle';
import { rankFor, rankList } from './scoring';
import { Progress } from './storage';

/**
 * Ausrüstung in vier Stufen – je höher, desto neuer und moderner.
 * Sanitäter/innen rüsten den Rettungswagen aus, Ersthelfer/innen ihr eigenes Auto.
 */
export type EquipmentId =
  | 'rtw'
  | 'monitor'
  | 'rucksack'
  | 'beatmung'
  | 'trage'
  | 'funk'
  | 'psa'
  | 'auto'
  | 'verbandkasten'
  | 'warn'
  | 'waerme'
  | 'licht'
  | 'defi'
  | 'kurs';

export const MAX_LEVEL = 4;

export interface EquipmentTier {
  name: string;
  year: number;
  text: string;
  /** Zwei Stichpunkte für den Steckbrief */
  facts: [string, string];
}

export interface EquipmentDef {
  id: EquipmentId;
  title: string;
  icon: string;
  /** Echtes Rettungsdienst-Wissen zum Gerät */
  wissen: string;
  tiers: [EquipmentTier, EquipmentTier, EquipmentTier, EquipmentTier];
  /** Budget für Stufe 1–4 (Stufe 1 hat man von Anfang an) */
  cost: [0, number, number, number];
  /** Wirkung im Einsatz für eine Stufe */
  effect: (level: number) => string;
}

const STEP = (level: number) => level - 1;

/** Mein Rettungswagen (Sanitäter/in) */
export const RTW_AUSRUESTUNG: EquipmentDef[] = [
  {
    id: 'rtw',
    wissen: 'Ein Rettungswagen (RTW) muss in Deutschland meist innerhalb von 10–15 Minuten nach dem Notruf am Einsatzort sein – das nennt man Hilfsfrist.',
    title: 'Fahrzeug',
    icon: '🚑',
    cost: [0, 500, 1500, 4000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Schneller vor Ort: Patient startet mit +${2 * STEP(l)} % Zustand`),
    tiers: [
      { name: 'Alter Krankenwagen', year: 1999, text: 'Kastenwagen mit einer Rundumleuchte und orangem Streifen – zuverlässig, aber eng.', facts: ['Platz: 1 Patient, 1 Retter', 'Höchstgeschwindigkeit 140 km/h'] },
      { name: 'Rettungswagen Typ C', year: 2012, text: 'Kofferaufbau mit rot-weißer Warnmarkierung und Platz für zwei Retter am Patienten.', facts: ['Norm-RTW nach DIN EN 1789', 'Kofferaufbau mit Stehhöhe'] },
      { name: 'Moderner Koffer-RTW', year: 2022, text: 'LED-Lichtbalken, gelb-rote Reflexfolie und Luftfederung für eine ruhige Fahrt.', facts: ['Luftfederung für ruhige Fahrt', 'LED-Sondersignal, rundum sichtbar'] },
      { name: 'Elektro-RTW der Zukunft', year: 2026, text: 'E-Antrieb, Rundum-LED, Kameras und ein klimatisierter Patientenraum.', facts: ['Elektroantrieb, leise und abgasfrei', 'Rückfahrkamera und 360°-Sicht'] },
    ],
  },
  {
    id: 'monitor',
    wissen: 'Ein 12-Kanal-EKG zeigt das Herz aus 12 Blickwinkeln. So erkennt der Rettungsdienst einen Herzinfarkt schon vor Ort und kann die Klinik vorwarnen.',
    title: 'Patientenmonitor',
    icon: '📈',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Messungen belasten den Patienten ${15 * STEP(l)} % weniger`),
    tiers: [
      { name: 'AED (Laien-Defi)', year: 2005, text: 'Kann nur defibrillieren – alles andere messe ich von Hand.', facts: ['Spricht mit dir: Schritt-für-Schritt-Ansagen', 'Schockt nur, wenn es nötig ist'] },
      { name: 'Monitor mit 3-Kanal-EKG', year: 2012, text: 'Zeigt Herzrhythmus, Puls und Sauerstoffsättigung.', facts: ['EKG, Puls und SpO₂ gleichzeitig', 'Alarm bei kritischen Werten'] },
      { name: 'Monitor-Defi mit 12-Kanal-EKG', year: 2020, text: 'Erkennt Herzinfarkte direkt vor Ort, misst Blutdruck automatisch.', facts: ['12 Ableitungen: Herzinfarkt sicher erkennen', 'Automatische Blutdruckmessung'] },
      { name: 'Telemetrie-Monitor', year: 2026, text: 'Schickt das EKG live in die Klinik – das Herzkatheterlabor ist vorgewarnt.', facts: ['EKG-Übertragung in Sekunden', 'Herzkatheterlabor wird vorgewarnt'] },
    ],
  },
  {
    id: 'rucksack',
    wissen: 'Im Notfallrucksack ist alles für die ersten Minuten: Material für Atemwege, Beatmung, Blutstillung, venöse Zugänge und Notfallmedikamente.',
    title: 'Notfallrucksack',
    icon: '🎒',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Alles schneller griffbereit: +${3 * STEP(l)} % Punkte`),
    tiers: [
      { name: 'Alte Notfalltasche', year: 1995, text: 'Alles in einem großen Fach – ich muss lange suchen.', facts: ['Ein großes Fach – lange Suche', 'Gewicht: schwer und unhandlich'] },
      { name: 'Notfallrucksack', year: 2010, text: 'Mehrere Fächer, beide Hände frei auf dem Weg zum Patienten.', facts: ['Beide Hände frei auf der Treppe', 'Fächer für Verbände und Zugang'] },
      { name: 'Modulares Rucksacksystem', year: 2019, text: 'Herausnehmbare Taschen für Atemweg, Kreislauf und Verbände.', facts: ['Module einzeln herausnehmbar', 'Nach Einsatz schnell aufgefüllt'] },
      { name: 'Farbcodierte ABCDE-Module', year: 2026, text: 'Jedes Modul passt zu einem Schritt im ABCDE-Schema – ein Griff, alles da.', facts: ['Jede Farbe = ein Schritt im ABCDE-Schema', 'Ein Griff – alles da'] },
    ],
  },
  {
    id: 'beatmung',
    wissen: 'Sauerstoff bekommt nur, wer ihn braucht: Bei gesunder Lunge sind 94–98 % Sättigung das Ziel – zu viel Sauerstoff kann sogar schaden.',
    title: 'Sauerstoff & Beatmung',
    icon: '🫁',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Besser versorgt: +${2 * STEP(l)} % Zustand am Ende`),
    tiers: [
      { name: 'Beatmungsbeutel mit Maske', year: 2000, text: 'Die Basis: Beatmen von Hand.', facts: ['Beatmen von Hand', 'Funktioniert immer, auch ohne Strom'] },
      { name: 'Sauerstoffflasche mit Maske', year: 2010, text: 'Sauerstoff für alle, die schlecht Luft bekommen.', facts: ['Bis zu 15 Liter Sauerstoff pro Minute', 'Flasche mit weißer Schulter = Sauerstoff'] },
      { name: 'Notfall-Beatmungsgerät', year: 2018, text: 'Beatmet gleichmäßig – meine Hände sind frei.', facts: ['Gleichmäßige Beatmung', 'Hände frei für andere Aufgaben'] },
      { name: 'Beatmungsgerät mit CPAP', year: 2026, text: 'Unterstützt auch wache Patienten mit Lungenödem oder COPD.', facts: ['CPAP: Überdruck hilft beim Atmen', 'Auch für wache Patienten geeignet'] },
    ],
  },
  {
    id: 'trage',
    wissen: 'Patienten mit Atemnot liegen mit erhöhtem Oberkörper, Patienten im Schock flach – die Trage lässt sich dafür verstellen.',
    title: 'Trage',
    icon: '🛏️',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Schonender Transport: +${2 * STEP(l)} % Zustand am Ende`),
    tiers: [
      { name: 'Klapptrage', year: 1990, text: 'Muss von zwei Leuten getragen werden – jede Stufe ruckelt.', facts: ['Zwei Retter müssen tragen', 'Leicht, aber wenig Komfort'] },
      { name: 'Fahrtrage', year: 2008, text: 'Mit Rädern und verstellbarem Kopfteil.', facts: ['Räder und verstellbares Kopfteil', 'Oberkörper hoch bei Atemnot'] },
      { name: 'Elektro-Hydraulik-Trage', year: 2018, text: 'Fährt per Knopfdruck hoch und runter – rückenschonend.', facts: ['Hebt bis zu 300 kg per Knopfdruck', 'Schont den Rücken der Retter'] },
      { name: 'Power-Trage mit Ladesystem', year: 2026, text: 'Lädt sich selbst ins Fahrzeug und federt jede Bodenwelle ab.', facts: ['Lädt sich selbst ins Fahrzeug', 'Federt jede Bodenwelle ab'] },
    ],
  },
  {
    id: 'funk',
    wissen: 'Behörden und Rettungsdienst funken in Deutschland digital im BOS-Funknetz. Über Statusmeldungen (z. B. „Status 4: am Einsatzort“) weiß die Leitstelle immer Bescheid.',
    title: 'Funk & Navigation',
    icon: '📡',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Bessere Absprache: auf „Schwer“ verschlechtert sich der Patient ${15 * STEP(l)} % langsamer`),
    tiers: [
      { name: 'Stadtplan & Analogfunk', year: 1995, text: 'Rauschender Funk und ein zerknitterter Stadtplan.', facts: ['Rauschen und Funklöcher', 'Adresse von Hand suchen'] },
      { name: 'Navi & Analogfunk', year: 2008, text: 'Das Navi findet den Weg, der Funk rauscht weiter.', facts: ['Navi findet den kürzesten Weg', 'Funk weiterhin analog'] },
      { name: 'Digitalfunk mit Navi', year: 2016, text: 'Klare Verbindung zur Leitstelle, Einsatzort direkt im Navi.', facts: ['Abhörsicherer Digitalfunk (BOS)', 'Einsatzort kommt direkt ins Navi'] },
      { name: 'Einsatz-Tablet mit Live-Lage', year: 2026, text: 'Einsatzdaten, Klinik-Kapazitäten und Notarzt-Standort in Echtzeit.', facts: ['Freie Betten der Kliniken live', 'Notarzt-Standort auf der Karte'] },
    ],
  },
  {
    id: 'psa',
    wissen: 'Persönliche Schutzausrüstung (PSA) schützt die Retter: Warnkleidung, Handschuhe, Sicherheitsschuhe und bei Bedarf Helm und Schutzbrille.',
    title: 'Einsatzkleidung',
    icon: '🦺',
    cost: [0, 250, 800, 2000],
    effect: (l) => (l === 1 ? 'Keine Wirkung' : `Sicher und schnell im Einsatz: +${3 * STEP(l)} % Punkte`),
    tiers: [
      { name: 'Einfache Warnweste', year: 1995, text: 'Hauptsache gesehen werden.', facts: ['Gut sichtbar bei Tag', 'Kein Schutz vor Kälte und Nässe'] },
      { name: 'Einsatzjacke mit Reflexstreifen', year: 2010, text: 'Warm, wasserdicht und gut sichtbar.', facts: ['Reflexstreifen leuchten im Scheinwerferlicht', 'Warm und wasserdicht'] },
      { name: 'Leichte Einsatzkleidung', year: 2019, text: 'Atmungsaktiv, mit Handschuhfach und Schnittschutz.', facts: ['Warnschutz nach EN ISO 20471', 'Atmungsaktiv und leicht'] },
      { name: 'Premium-Kleidung mit Helm', year: 2026, text: 'Mit Helm, Stirnlampe und Funk-Headset – bereit für jeden Einsatz.', facts: ['Helm mit Stirnlampe', 'Funk-Headset für freie Hände'] },
    ],
  },
];

const HELFER_PUNKTE = (l: number) => (l === 1 ? 'Keine Wirkung' : `Gut vorbereitet: +${2 * STEP(l)} % Punkte`);

/** Mein Auto (Ersthelfer/in) */
export const AUTO_AUSRUESTUNG: EquipmentDef[] = [
  {
    id: 'auto',
    title: 'Auto',
    icon: '🚗',
    wissen: 'Bei einem Unfall gilt: Warnblinker an, Warnweste anziehen, dann aussteigen – und erst danach das Warndreieck aufstellen.',
    cost: [0, 300, 900, 2400],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Alter Kleinwagen', year: 2004, text: 'Klein, laut, zuverlässig – im Kofferraum ist kaum Platz.', facts: ['Kofferraum: winzig', 'Warnblinker funktioniert'] },
      { name: 'Kompaktwagen', year: 2015, text: 'Genug Platz für Verbandkasten, Decke und Einkäufe.', facts: ['Fach unter dem Kofferraumboden', 'Notrufknopf (eCall) noch nicht drin'] },
      { name: 'Kombi', year: 2021, text: 'Viel Stauraum und automatischer Notruf bei einem Unfall.', facts: ['eCall: wählt nach Unfall selbst die 112', 'Großer, ebener Kofferraum'] },
      { name: 'E-Auto mit Notfall-Assistent', year: 2026, text: 'Leise, sicher und mit Assistent, der im Notfall die Unfallstelle meldet.', facts: ['eCall mit genauer Position', 'Warnt andere Autos über Car2X'] },
    ],
  },
  {
    id: 'verbandkasten',
    title: 'Verbandkasten',
    icon: '🩹',
    wissen: 'Der Kfz-Verbandkasten (DIN 13164) gehört ins Auto. Seit 2022 sind zwei Mund-Nasen-Masken Pflicht. Auf das Ablaufdatum der sterilen Teile achten!',
    cost: [0, 150, 500, 1200],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Abgelaufener Verbandkasten', year: 2009, text: 'Irgendwo unter der Rückbank, die Pflaster kleben nicht mehr.', facts: ['Ablaufdatum längst vorbei', 'Folie ist brüchig'] },
      { name: 'Neuer Kfz-Verbandkasten', year: 2022, text: 'Nach aktueller Norm, mit Masken, Handschuhen und Rettungsdecke.', facts: ['DIN 13164:2022', 'Zwei Masken, vier Paar Handschuhe'] },
      { name: 'Erweitertes Erste-Hilfe-Set', year: 2024, text: 'Zusätzlich Druckverband-Päckchen, Kühlkompressen und Rettungsschere.', facts: ['Mehr Druckverbände', 'Rettungsschere für Kleidung und Gurt'] },
      { name: 'Ersthelfer-Rucksack', year: 2026, text: 'Alles griffbereit in Fächern – vom Pflaster bis zum Notfallverband.', facts: ['Beide Hände frei', 'Fächer nach Verletzungsart sortiert'] },
    ],
  },
  {
    id: 'warn',
    title: 'Warnausrüstung',
    icon: '🦺',
    wissen: 'Warndreieck aufstellen: in der Stadt etwa 50 m, auf der Landstraße 100 m und auf der Autobahn 200 m vor der Unfallstelle.',
    cost: [0, 150, 500, 1200],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Warndreieck und eine Weste', year: 2010, text: 'Das Pflicht-Minimum – die Weste liegt aber im Kofferraum.', facts: ['Weste im Kofferraum: schlecht', 'Warndreieck ist Pflicht'] },
      { name: 'Westen für alle Plätze', year: 2018, text: 'In jeder Tür eine Warnweste – griffbereit vor dem Aussteigen.', facts: ['Weste vor dem Aussteigen anziehen', 'Für jede Person im Auto'] },
      { name: 'Zusätzliche LED-Warnleuchte', year: 2023, text: 'Blinkt gelb und ist schnell auf dem Autodach – schon bevor das Dreieck steht.', facts: ['Magnetfuß fürs Dach', 'Weit sichtbar bei Nacht'] },
      { name: 'Komplettes Absicherungs-Set', year: 2026, text: 'Zwei Warnleuchten, Warndreieck und Westen in einer Tasche.', facts: ['Alles in einer Tasche', 'Sichert auch Kurven ab'] },
    ],
  },
  {
    id: 'waerme',
    title: 'Wärme & Decken',
    icon: '🧣',
    wissen: 'Verletzte kühlen schnell aus, auch im Sommer. Die Rettungsdecke schützt vor Wind und Nässe – welche Seite außen ist, spielt kaum eine Rolle.',
    cost: [0, 150, 500, 1200],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Eine Rettungsdecke', year: 2012, text: 'Liegt im Verbandkasten – mehr nicht.', facts: ['Dünn, aber winddicht', 'Nur eine Person'] },
      { name: 'Wolldecke dazu', year: 2017, text: 'Eine warme Decke im Kofferraum, auch für lange Wartezeiten.', facts: ['Warm auch bei Nässe', 'Unter den Patienten legen'] },
      { name: 'Isomatte und Thermodecke', year: 2022, text: 'Schützt vor dem kalten Boden – da geht die meiste Wärme verloren.', facts: ['Kälte kommt vom Boden', 'Leicht und klein gefaltet'] },
      { name: 'Wärmeset', year: 2026, text: 'Thermodecke, Mütze und Wärmepads für mehrere Verletzte.', facts: ['Wärmepads für Hände und Bauch', 'Für mehrere Personen'] },
    ],
  },
  {
    id: 'licht',
    title: 'Licht',
    icon: '🔦',
    wissen: 'Nachts ist gutes Licht Eigenschutz: Du siehst Gefahren, und andere sehen dich.',
    cost: [0, 150, 500, 1200],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Handy-Taschenlampe', year: 2015, text: 'Hilft kurz – aber dann fehlt das Handy für den Notruf.', facts: ['Akku wird knapp', 'Hände nicht frei'] },
      { name: 'Taschenlampe', year: 2018, text: 'Hell und robust, im Handschuhfach.', facts: ['Batterie regelmäßig prüfen', 'Handy bleibt frei'] },
      { name: 'Stirnlampe', year: 2022, text: 'Beide Hände frei, Licht immer dort, wo du hinschaust.', facts: ['Hände frei zum Helfen', 'Rotlicht schont die Augen'] },
      { name: 'Akku-Arbeitsleuchte', year: 2026, text: 'Leuchtet die ganze Unfallstelle aus, mit Magnet und Haken.', facts: ['Leuchtet die Unfallstelle aus', 'Mehrere Stunden Akku'] },
    ],
  },
  {
    id: 'defi',
    title: 'Defibrillator & Apps',
    icon: '❤️',
    wissen: 'Jede Minute ohne Herzdruckmassage senkt die Überlebenschance. Ersthelfer-Apps alarmieren Helfer in der Nähe, damit sie vor dem Rettungsdienst da sind.',
    cost: [0, 200, 700, 1800],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Nur das Handy', year: 2016, text: 'Notruf 112 geht immer – auch ohne Guthaben und Entsperren.', facts: ['112 ist kostenlos', 'Standort teilen in der Notruf-App'] },
      { name: 'Defi-Karte in der App', year: 2020, text: 'Zeigt, wo der nächste öffentliche Defibrillator (AED) hängt.', facts: ['AED-Standorte in der Nähe', 'Jemanden losschicken!'] },
      { name: 'Ersthelfer-App', year: 2023, text: 'Die Leitstelle alarmiert dich, wenn in deiner Nähe jemand wiederbelebt werden muss.', facts: ['Alarm bei Herzstillstand in der Nähe', 'Du bist oft vor dem RTW da'] },
      { name: 'Eigener AED im Auto', year: 2026, text: 'Ein Laien-Defibrillator, der dich mit Ansagen durch die Wiederbelebung führt.', facts: ['Spricht mit dir', 'Schockt nur, wenn es nötig ist'] },
    ],
  },
  {
    id: 'kurs',
    title: 'Ausbildung',
    icon: '🎓',
    wissen: 'Erste-Hilfe-Wissen verblasst: Eine Auffrischung alle zwei Jahre hält dich sicher – Betriebshelfer/innen müssen das sogar.',
    cost: [0, 200, 700, 1800],
    effect: HELFER_PUNKTE,
    tiers: [
      { name: 'Führerschein-Kurs', year: 2015, text: 'Ein Tag Erste Hilfe – lange her.', facts: ['9 Unterrichtseinheiten', 'Vieles schon vergessen'] },
      { name: 'Auffrischungskurs', year: 2022, text: 'Wiederbelebung und Seitenlage wieder frisch geübt.', facts: ['Alle zwei Jahre empfohlen', 'Viel praktisches Üben'] },
      { name: 'Betriebshelfer/in', year: 2024, text: 'Du bist Ersthelfer/in im Betrieb und kennst den Ablauf genau.', facts: ['Gesetzlich vorgeschrieben im Betrieb', 'Auffrischung alle 2 Jahre'] },
      { name: 'Sanitätsdienst-Grundkurs', year: 2026, text: 'Mehr Wissen für Großveranstaltungen – der erste Schritt Richtung Rettungsdienst.', facts: ['Einsatz bei Festen und Konzerten', 'Weg in den Rettungsdienst'] },
    ],
  },
];

/** Ausrüstung der aktiven Rolle */
export const ausruestung = (): EquipmentDef[] => (aktiveRolle() === 'helfer' ? AUTO_AUSRUESTUNG : RTW_AUSRUESTUNG);

export const EQUIPMENT_BY_ID = Object.fromEntries([...RTW_AUSRUESTUNG, ...AUTO_AUSRUESTUNG].map((e) => [e.id, e])) as Record<
  EquipmentId,
  EquipmentDef
>;

/** Ab welchem Dienstgrad (Index in RANKS) eine Stufe freigeschaltet wird */
export const TIER_MIN_RANK: [0, number, number, number] = [0, 0, 2, 4];

export function levelOf(p: Progress, id: EquipmentId): number {
  return Math.min(MAX_LEVEL, Math.max(1, p.equipment[id] ?? 1));
}

/** Gesamtstufe der Ausrüstung (7 bis 28) */
export function totalLevel(p: Progress): number {
  return ausruestung().reduce((s, e) => s + levelOf(p, e.id), 0);
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
  if (aktiveRolle() === 'helfer') {
    const steps = AUTO_AUSRUESTUNG.reduce((n, e) => n + l(e.id), 0);
    return { startBonus: 0, measureFactor: 1, drainFactor: 1, endBonus: 0, pointsPct: 2 * steps };
  }
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
  const rankIndex = rankList().indexOf(rankFor(p.totalPoints).rank);
  if (rankIndex < minRank) return { reason: 'rank', rank: rankList()[minRank].de };
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
