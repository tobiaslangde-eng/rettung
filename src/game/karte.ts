import { CASES } from '../data/cases';
import { HELFER_FAELLE } from '../data/helfer';
import { DIFFICULTY_BY_ID } from './difficulty';
import { Rolle } from './rolle';
import { shuffle } from './scoring';
import { Progress } from './storage';

/** Stadtkarte: Straßen im Raster (Kartenfläche 400 × 300) */
export const KARTE = { b: 400, h: 300 };
export const STRASSEN_X = [60, 150, 250, 340];
export const STRASSEN_Y = [55, 150, 245];
/** Rettungswache bzw. Hilfspunkt liegt an der mittleren Kreuzung */
export const BASIS = { x: 150, y: 150 };
export const PINS_AUF_KARTE = 3;
export const BONUS_KUERZESTE = 10;

export interface Punkt {
  x: number;
  y: number;
}

export interface KartenPin {
  id: string;
  fallId: string;
  x: number;
  y: number;
  /** Ort aus dem Einsatz, z. B. „Köln, Altstadt – Alter Markt“ */
  ort: string;
  /** Meldung der Leitstelle (nur Rettungsdienst) */
  meldung: string;
  /** Fahrtweg auf den Straßen von der Basis bis zum Ziel */
  route: Punkt[];
  /** Anfahrt in Minuten */
  minuten: number;
}

const laenge = (route: Punkt[]) =>
  route.reduce((n, p, i) => (i === 0 ? 0 : n + Math.hypot(p.x - route[i - 1].x, p.y - route[i - 1].y)), 0);

/** Punkt auf dem Fahrtweg (t von 0 bis 1) */
export function punktAuf(route: Punkt[], t: number): Punkt {
  const ziel = laenge(route) * Math.min(1, Math.max(0, t));
  let gefahren = 0;
  for (let i = 1; i < route.length; i++) {
    const seg = Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y);
    if (gefahren + seg >= ziel) {
      const k = seg === 0 ? 0 : (ziel - gefahren) / seg;
      return { x: route[i - 1].x + (route[i].x - route[i - 1].x) * k, y: route[i - 1].y + (route[i].y - route[i - 1].y) * k };
    }
    gefahren += seg;
  }
  return route[route.length - 1];
}

/** Fahrtrichtung in Grad am Punkt t (für das Fahrzeug) */
export function richtungAuf(route: Punkt[], t: number): number {
  const a = punktAuf(route, Math.max(0, t - 0.02));
  const b = punktAuf(route, Math.min(1, t + 0.02));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

const zufall = (a: number, b: number) => a + Math.random() * (b - a);

function zufallsOrt(): { ziel: Punkt; route: Punkt[] } {
  const senkrecht = Math.random() < 0.5;
  if (senkrecht) {
    const x = STRASSEN_X[Math.floor(Math.random() * STRASSEN_X.length)];
    const y = Math.round(zufall(28, 272));
    const route = x === BASIS.x ? [BASIS, { x, y }] : [BASIS, { x, y: BASIS.y }, { x, y }];
    return { ziel: { x, y }, route };
  }
  const y = STRASSEN_Y[Math.floor(Math.random() * STRASSEN_Y.length)];
  const x = Math.round(zufall(28, 358));
  const route = y === BASIS.y ? [BASIS, { x, y }] : [BASIS, { x: BASIS.x, y }, { x, y }];
  return { ziel: { x, y }, route };
}

/** Füllt die Karte auf 3 Einsätze auf (echte Einsätze aus dem Spiel, nicht doppelt) */
export function fuelleKarte(rolle: Rolle, p: Progress, vorhanden: KartenPin[], letzteId?: string): KartenPin[] {
  const pins = [...vorhanden];
  const benutzt = new Set(pins.map((x) => x.fallId));
  if (letzteId) benutzt.add(letzteId);
  type Kandidat = { id: string; ort: string; meldung: string; sterne: number };
  const liste: Kandidat[] =
    rolle === 'helfer'
      ? HELFER_FAELLE.map((f) => ({ id: f.id, ort: f.location, meldung: '', sterne: p.bestStars[f.id] ?? 0 }))
      : CASES.filter((c) => DIFFICULTY_BY_ID[p.difficulty].caseLevels.includes(c.difficulty)).map((c) => ({
          id: c.id,
          ort: c.location,
          meldung: c.dispatch,
          sterne: p.bestStars[c.id] ?? 0,
        }));
  const frei = shuffle(liste.filter((c) => !benutzt.has(c.id)));
  // bevorzugt noch nicht gemeisterte Einsätze
  frei.sort((a, b) => Number(a.sterne >= 3) - Number(b.sterne >= 3));
  let versuche = 0;
  while (pins.length < PINS_AUF_KARTE && frei.length > 0 && versuche < 60) {
    versuche++;
    const { ziel, route } = zufallsOrt();
    const zuNah =
      Math.hypot(ziel.x - BASIS.x, ziel.y - BASIS.y) < 45 || pins.some((q) => Math.hypot(q.x - ziel.x, q.y - ziel.y) < 50);
    if (zuNah) continue;
    const c = frei.shift()!;
    pins.push({
      id: `${c.id}-${Date.now()}-${pins.length}`,
      fallId: c.id,
      x: ziel.x,
      y: ziel.y,
      ort: c.ort,
      meldung: c.meldung,
      route,
      minuten: Math.max(2, Math.round(laenge(route) / 38)),
    });
  }
  return pins;
}

/** Ist dieser Einsatz der mit der kürzesten Anfahrt? */
export const istKuerzeste = (pins: KartenPin[], pin: KartenPin) => pins.every((q) => q.minuten >= pin.minuten);
