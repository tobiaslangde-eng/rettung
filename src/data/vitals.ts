export type VitalId = 'puls' | 'rr' | 'spo2' | 'af' | 'temp' | 'bz' | 'gcs' | 'ekg';

export type Rating = 'niedrig' | 'normal' | 'hoch';

export type VitalValue = number | [number, number] | string;

export interface VitalDef {
  id: VitalId;
  name: string;
  short: string;
  unit: string;
  icon: string;
  /** Was ich bei der Messung tue (Ich-Perspektive) */
  action: string;
  /** Normalbereich als Text (Erwachsene) */
  normal: string;
  /** Wert < low gilt als niedrig */
  low?: number;
  /** Wert > high gilt als hoch */
  high?: number;
  /** Freitext-Befund (z. B. EKG) – wird nicht eingestuft */
  textOnly?: boolean;
}

export const VITALS: VitalDef[] = [
  { id: 'puls', action: 'Ich lege zwei Finger ans Handgelenk und zähle mit …', name: 'Puls', short: 'HF', unit: '/min', icon: '♥', normal: '60–100 /min', low: 60, high: 100 },
  { id: 'rr', action: 'Ich lege die Manschette an und pumpe auf … zischhh …', name: 'Blutdruck', short: 'RR', unit: 'mmHg', icon: '◎', normal: 'systolisch 90–140 mmHg', low: 90, high: 140 },
  { id: 'spo2', action: 'Ich klemme den Pulsoximeter-Clip an den Finger …', name: 'Sauerstoffsättigung', short: 'SpO₂', unit: '%', icon: '◐', normal: '95–100 %', low: 95, high: 100 },
  { id: 'af', action: 'Ich beobachte den Brustkorb und zähle die Atemzüge …', name: 'Atemfrequenz', short: 'AF', unit: '/min', icon: '≋', normal: '12–20 /min', low: 12, high: 20 },
  { id: 'temp', action: 'Ich halte das Ohrthermometer ans Ohr … piep!', name: 'Temperatur', short: 'T', unit: '°C', icon: '▮', normal: '36,0–37,5 °C', low: 36, high: 37.5 },
  { id: 'bz', action: 'Ein kleiner Pieks in die Fingerkuppe, Tropfen aufs Messgerät …', name: 'Blutzucker', short: 'BZ', unit: 'mg/dl', icon: '◆', normal: '70–140 mg/dl', low: 70, high: 140 },
  { id: 'gcs', action: 'Ich spreche laut an und prüfe Augenöffnen, Sprache und Bewegung …', name: 'Bewusstsein (GCS)', short: 'GCS', unit: 'Pkt.', icon: '◉', normal: '15 Punkte', low: 15, high: 15 },
  { id: 'ekg', action: 'Ich klebe zehn Elektroden auf und schreibe ein 12-Kanal-EKG …', name: '12-Kanal-EKG', short: 'EKG', unit: '', icon: '⌁', normal: 'Sinusrhythmus, keine ST-Veränderungen', textOnly: true },
];

export const VITAL_BY_ID = Object.fromEntries(VITALS.map((v) => [v.id, v])) as Record<VitalId, VitalDef>;

/** Altersgruppen mit eigenen Normalbereichen; ab 13 Jahren gelten die Werte für Erwachsene. */
export interface ChildNorms {
  label: string;
  /** Gilt bis einschließlich dieses Alters (Jahre) */
  maxAge: number;
  limits: Partial<Record<VitalId, { low: number; high: number }>>;
}

/** Vereinfachte Richtwerte für Kinder in Ruhe (Puls, Atemfrequenz, systolischer Blutdruck). */
export const CHILD_NORMS: ChildNorms[] = [
  { label: 'Säugling (unter 1 Jahr)', maxAge: 0, limits: { puls: { low: 100, high: 160 }, af: { low: 30, high: 60 }, rr: { low: 70, high: 110 } } },
  { label: 'Kleinkind (1–5 Jahre)', maxAge: 5, limits: { puls: { low: 80, high: 140 }, af: { low: 20, high: 40 }, rr: { low: 80, high: 115 } } },
  { label: 'Schulkind (6–12 Jahre)', maxAge: 12, limits: { puls: { low: 70, high: 120 }, af: { low: 16, high: 30 }, rr: { low: 90, high: 125 } } },
];

export const ADULT_AGE = 30;

export function childNormsFor(age: number): ChildNorms | undefined {
  return CHILD_NORMS.find((g) => age <= g.maxAge);
}

function limitsFor(id: VitalId, age: number): { low?: number; high?: number } {
  return childNormsFor(age)?.limits[id] ?? VITAL_BY_ID[id];
}

/** Normalbereich als Text, passend zum Alter des Patienten. */
export function normalText(id: VitalId, age = ADULT_AGE): string {
  const def = VITAL_BY_ID[id];
  const child = childNormsFor(age)?.limits[id];
  if (!child) return def.normal;
  return `${id === 'rr' ? 'systolisch ' : ''}${child.low}–${child.high} ${def.unit} (Kind)`;
}

/** Liefert die korrekte Einstufung eines Messwerts – bei Kindern mit Kinder-Normwerten. */
export function rateVital(id: VitalId, value: VitalValue, age = ADULT_AGE): Rating | null {
  const def = VITAL_BY_ID[id];
  if (def.textOnly || typeof value === 'string') return null;
  const { low, high } = limitsFor(id, age);
  const n = Array.isArray(value) ? value[0] : value; // Blutdruck: systolisch
  if (low !== undefined && n < low) return 'niedrig';
  if (high !== undefined && n > high) return 'hoch';
  return 'normal';
}

export function formatVital(id: VitalId, value: VitalValue): string {
  const def = VITAL_BY_ID[id];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return `${value[0]}/${value[1]} ${def.unit}`;
  const num = id === 'temp' ? value.toFixed(1).replace('.', ',') : String(value);
  return `${num} ${def.unit}`;
}
