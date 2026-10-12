export type VitalId = 'puls' | 'rr' | 'spo2' | 'af' | 'temp' | 'bz' | 'gcs' | 'ekg';

export type Rating = 'niedrig' | 'normal' | 'hoch';

export type VitalValue = number | [number, number] | string;

export interface VitalDef {
  id: VitalId;
  name: string;
  /** Estnische Bezeichnung für das Design */
  et: string;
  short: string;
  unit: string;
  icon: string;
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
  { id: 'puls', name: 'Puls', et: 'Pulss', short: 'HF', unit: '/min', icon: '♥', normal: '60–100 /min', low: 60, high: 100 },
  { id: 'rr', name: 'Blutdruck', et: 'Vererõhk', short: 'RR', unit: 'mmHg', icon: '◎', normal: 'systolisch 90–140 mmHg', low: 90, high: 140 },
  { id: 'spo2', name: 'Sauerstoffsättigung', et: 'Hapnikuküllastus', short: 'SpO₂', unit: '%', icon: '◐', normal: '95–100 %', low: 95, high: 100 },
  { id: 'af', name: 'Atemfrequenz', et: 'Hingamissagedus', short: 'AF', unit: '/min', icon: '≋', normal: '12–20 /min', low: 12, high: 20 },
  { id: 'temp', name: 'Temperatur', et: 'Temperatuur', short: 'T', unit: '°C', icon: '▮', normal: '36,0–37,5 °C', low: 36, high: 37.5 },
  { id: 'bz', name: 'Blutzucker', et: 'Veresuhkur', short: 'BZ', unit: 'mg/dl', icon: '◆', normal: '70–140 mg/dl', low: 70, high: 140 },
  { id: 'gcs', name: 'Bewusstsein (GCS)', et: 'Teadvus', short: 'GCS', unit: 'Pkt.', icon: '◉', normal: '15 Punkte', low: 15, high: 15 },
  { id: 'ekg', name: '12-Kanal-EKG', et: 'EKG', short: 'EKG', unit: '', icon: '⌁', normal: 'Sinusrhythmus, keine ST-Veränderungen', textOnly: true },
];

export const VITAL_BY_ID = Object.fromEntries(VITALS.map((v) => [v.id, v])) as Record<VitalId, VitalDef>;

/** Liefert die korrekte Einstufung eines Messwerts. */
export function rateVital(id: VitalId, value: VitalValue): Rating | null {
  const def = VITAL_BY_ID[id];
  if (def.textOnly || typeof value === 'string') return null;
  const n = Array.isArray(value) ? value[0] : value; // Blutdruck: systolisch
  if (def.low !== undefined && n < def.low) return 'niedrig';
  if (def.high !== undefined && n > def.high) return 'hoch';
  return 'normal';
}

export function formatVital(id: VitalId, value: VitalValue): string {
  const def = VITAL_BY_ID[id];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return `${value[0]}/${value[1]} ${def.unit}`;
  const num = id === 'temp' ? value.toFixed(1).replace('.', ',') : String(value);
  return `${num} ${def.unit}`;
}
