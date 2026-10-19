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
export const BONUS_ROUTE = 10;
/** Ein Kartenmeter in echten Metern (für die Streckenangabe) */
const METER_PRO_EINHEIT = 8;

export interface Punkt {
  x: number;
  y: number;
}

/** Stau oder Baustelle auf einem Straßenstück zwischen zwei Kreuzungen */
export type VerkehrArt = 'stau' | 'baustelle';
export interface Verkehr {
  art: VerkehrArt;
  a: Punkt;
  b: Punkt;
}
export const VERKEHR_FAKTOR: Record<VerkehrArt, number> = { stau: 3.6, baustelle: 4.6 };

export interface KartenPin {
  id: string;
  fallId: string;
  x: number;
  y: number;
  /** Auf welcher Straße der Einsatz liegt: v = senkrecht (x fest), h = waagerecht (y fest) */
  strasse: 'v' | 'h';
  /** Ort aus dem Einsatz, z. B. „Köln, Altstadt – Alter Markt“ */
  ort: string;
  /** Meldung der Leitstelle (nur Rettungsdienst) */
  meldung: string;
}

/** Eine mögliche Fahrt von der Basis zum Einsatz */
export interface Fahrt {
  punkte: Punkt[];
  /** Teilstücke mit Länge und Verkehrsfaktor (1 = frei) */
  teile: { laenge: number; faktor: number }[];
  /** Fahrzeit in Minuten (mit Verkehr) */
  minuten: number;
  /** Strecke in Kilometern */
  km: number;
  /** Verkehrshindernisse, durch die die Fahrt führt */
  hindernisse: VerkehrArt[];
}

const dist = (a: Punkt, b: Punkt) => Math.hypot(a.x - b.x, a.y - b.y);

/** Alle Straßenstücke zwischen zwei benachbarten Kreuzungen */
function strassenStuecke(): { a: Punkt; b: Punkt }[] {
  const liste: { a: Punkt; b: Punkt }[] = [];
  for (const x of STRASSEN_X)
    for (let i = 0; i < STRASSEN_Y.length - 1; i++) liste.push({ a: { x, y: STRASSEN_Y[i] }, b: { x, y: STRASSEN_Y[i + 1] } });
  for (const y of STRASSEN_Y)
    for (let i = 0; i < STRASSEN_X.length - 1; i++) liste.push({ a: { x: STRASSEN_X[i], y }, b: { x: STRASSEN_X[i + 1], y } });
  return liste;
}

/** Würfelt Stau und Baustellen: mindestens ein Hindernis liegt direkt an der Basis */
export function neuerVerkehr(): Verkehr[] {
  const stuecke = shuffle(strassenStuecke());
  const anBasis = (st: { a: Punkt; b: Punkt }) =>
    (st.a.x === BASIS.x && st.a.y === BASIS.y) || (st.b.x === BASIS.x && st.b.y === BASIS.y);
  const erstes = stuecke.find(anBasis)!;
  const rest = stuecke.filter((st) => st !== erstes).slice(0, 2);
  const arten = shuffle<VerkehrArt>(['stau', 'stau', 'baustelle']);
  return [erstes, ...rest].map((st, i) => ({ art: arten[i], a: st.a, b: st.b }));
}

const zwischen = (v: number, a: number, b: number) => v >= Math.min(a, b) - 0.01 && v <= Math.max(a, b) + 0.01;

/** Verkehrsfaktor am Punkt (Mitte eines Teilstücks) */
function faktorAm(p: Punkt, verkehr: Verkehr[]): number {
  const v = verkehr.find((h) => zwischen(p.x, h.a.x, h.b.x) && zwischen(p.y, h.a.y, h.b.y));
  return v ? VERKEHR_FAKTOR[v.art] : 1;
}
const verkehrAm = (p: Punkt, verkehr: Verkehr[]) =>
  verkehr.find((h) => zwischen(p.x, h.a.x, h.b.x) && zwischen(p.y, h.a.y, h.b.y));

/**
 * Fahrt zum Einsatz auf dem Straßennetz.
 * `schnell`: schnellste Zeit (umfährt Staus); `direkt`: kürzeste Strecke, egal ob Stau.
 */
export function fahrtZu(pin: KartenPin, verkehr: Verkehr[], modus: 'schnell' | 'direkt'): Fahrt {
  const ziel: Punkt = { x: pin.x, y: pin.y };
  // Knoten 0 ist der Einsatzort; Kreuzungen werden bei Bedarf angelegt
  const knoten: Punkt[] = [ziel];
  const index = new Map<string, number>();
  const idx = (p: Punkt) => {
    if (p === ziel) return 0;
    const k = `${p.x},${p.y}`;
    if (!index.has(k)) {
      index.set(k, knoten.length);
      knoten.push(p);
    }
    return index.get(k)!;
  };
  const kanten: { von: number; nach: number; w: number }[] = [];
  const strecke = (punkte: Punkt[]) => {
    for (let i = 0; i < punkte.length - 1; i++) {
      const a = punkte[i];
      const b = punkte[i + 1];
      const mitte = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const w = dist(a, b) * (modus === 'schnell' ? faktorAm(mitte, verkehr) : 1);
      const von = idx(a);
      const nach = idx(b);
      kanten.push({ von, nach, w }, { von: nach, nach: von, w });
    }
  };
  for (const x of STRASSEN_X) {
    const punkte = STRASSEN_Y.map((y) => ({ x, y }));
    if (pin.strasse === 'v' && pin.x === x) punkte.push(ziel);
    punkte.sort((a, b) => a.y - b.y);
    strecke(punkte);
  }
  for (const y of STRASSEN_Y) {
    const punkte = STRASSEN_X.map((x) => ({ x, y }));
    if (pin.strasse === 'h' && pin.y === y) punkte.push(ziel);
    punkte.sort((a, b) => a.x - b.x);
    strecke(punkte);
  }
  // Dijkstra von der Basis zum Ziel (wenige Knoten, einfache Suche)
  const start = idx(BASIS);
  const d = knoten.map(() => Infinity);
  const vor = knoten.map(() => -1);
  const fertig = knoten.map(() => false);
  d[start] = 0;
  for (let n = 0; n < knoten.length; n++) {
    let u = -1;
    for (let i = 0; i < knoten.length; i++) if (!fertig[i] && (u === -1 || d[i] < d[u])) u = i;
    if (u === -1 || d[u] === Infinity) break;
    fertig[u] = true;
    for (const e of kanten) if (e.von === u && d[u] + e.w < d[e.nach]) (d[e.nach] = d[u] + e.w), (vor[e.nach] = u);
  }
  const weg: Punkt[] = [];
  for (let u = 0; u !== -1; u = vor[u]) weg.unshift(knoten[u]);
  const teile: Fahrt['teile'] = [];
  const hindernisse: VerkehrArt[] = [];
  for (let i = 0; i < weg.length - 1; i++) {
    const mitte = { x: (weg[i].x + weg[i + 1].x) / 2, y: (weg[i].y + weg[i + 1].y) / 2 };
    const v = verkehrAm(mitte, verkehr);
    if (v) hindernisse.push(v.art);
    teile.push({ laenge: dist(weg[i], weg[i + 1]), faktor: v ? VERKEHR_FAKTOR[v.art] : 1 });
  }
  const laenge = teile.reduce((n, t) => n + t.laenge, 0);
  const zeit = teile.reduce((n, t) => n + t.laenge * t.faktor, 0);
  return {
    punkte: weg,
    teile,
    minuten: Math.max(2, Math.round(zeit / 38)),
    km: Math.round(((laenge * METER_PRO_EINHEIT) / 1000) * 10) / 10,
    hindernisse,
  };
}

const gleicherWeg = (a: Fahrt, b: Fahrt) =>
  a.punkte.length === b.punkte.length && a.punkte.every((p, i) => p.x === b.punkte[i].x && p.y === b.punkte[i].y);

/** Zwei Routen zur Wahl, wenn die kürzeste Strecke langsamer ist als die schnellste Route */
export function routenWahl(pin: KartenPin, verkehr: Verkehr[]): { schnell: Fahrt; direkt: Fahrt; wahl: boolean } {
  const schnell = fahrtZu(pin, verkehr, 'schnell');
  const direkt = fahrtZu(pin, verkehr, 'direkt');
  return { schnell, direkt, wahl: !gleicherWeg(schnell, direkt) && direkt.minuten > schnell.minuten };
}

/** Punkt auf der Fahrt (t von 0 bis 1 nach Fahrzeit: im Stau geht es langsamer voran) */
export function punktAuf(f: Fahrt, t: number): Punkt {
  const gewicht = f.teile.map((x) => x.laenge * x.faktor);
  const ziel = gewicht.reduce((n, g) => n + g, 0) * Math.min(1, Math.max(0, t));
  let gefahren = 0;
  for (let i = 0; i < f.teile.length; i++) {
    if (gefahren + gewicht[i] >= ziel) {
      const k = gewicht[i] === 0 ? 0 : (ziel - gefahren) / gewicht[i];
      const a = f.punkte[i];
      const b = f.punkte[i + 1];
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
    gefahren += gewicht[i];
  }
  return f.punkte[f.punkte.length - 1];
}

/** Fahrtrichtung in Grad am Punkt t (für das Fahrzeug) */
export function richtungAuf(f: Fahrt, t: number): number {
  const a = punktAuf(f, Math.max(0, t - 0.02));
  const b = punktAuf(f, Math.min(1, t + 0.02));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

const zufall = (a: number, b: number) => a + Math.random() * (b - a);

function zufallsOrt(): { ziel: Punkt; strasse: 'v' | 'h' } {
  if (Math.random() < 0.5) {
    const x = STRASSEN_X[Math.floor(Math.random() * STRASSEN_X.length)];
    return { ziel: { x, y: Math.round(zufall(28, 272)) }, strasse: 'v' };
  }
  const y = STRASSEN_Y[Math.floor(Math.random() * STRASSEN_Y.length)];
  return { ziel: { x: Math.round(zufall(28, 358)), y }, strasse: 'h' };
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
    const { ziel, strasse } = zufallsOrt();
    const zuNah =
      Math.hypot(ziel.x - BASIS.x, ziel.y - BASIS.y) < 45 || pins.some((q) => Math.hypot(q.x - ziel.x, q.y - ziel.y) < 50);
    if (zuNah) continue;
    const c = frei.shift()!;
    pins.push({
      id: `${c.id}-${Date.now()}-${pins.length}`,
      fallId: c.id,
      x: ziel.x,
      y: ziel.y,
      strasse,
      ort: c.ort,
      meldung: c.meldung,
    });
  }
  return pins;
}

/** Ist dieser Einsatz der mit der kürzesten Anfahrt (bei der besten Route)? */
export const istKuerzeste = (pins: KartenPin[], pin: KartenPin, verkehr: Verkehr[]) => {
  const zeit = (q: KartenPin) => fahrtZu(q, verkehr, 'schnell').minuten;
  return pins.every((q) => zeit(q) >= zeit(pin));
};
