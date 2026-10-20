/** Level aus Erfahrungspunkten (EP): Jedes Level kostet etwas mehr als das vorherige */
const SCHRITT_START = 100;
const SCHRITT_PLUS = 50;

/** Gesamt-EP, ab denen man Level `l` erreicht (Level 1 = 0 EP) */
export const epFuerLevel = (l: number): number => {
  const n = Math.max(0, l - 1);
  return SCHRITT_START * n + (SCHRITT_PLUS * n * (n - 1)) / 2;
};

export interface LevelStand {
  level: number;
  /** EP innerhalb des aktuellen Levels */
  imLevel: number;
  /** EP, die das aktuelle Level insgesamt dauert */
  dauer: number;
  /** Anteil bis zum nächsten Level (0–1) */
  pct: number;
  /** Noch fehlende EP bis zum nächsten Level */
  fehlt: number;
}

export function levelFuer(ep: number): LevelStand {
  let l = 1;
  while (ep >= epFuerLevel(l + 1)) l++;
  const start = epFuerLevel(l);
  const dauer = epFuerLevel(l + 1) - start;
  const imLevel = ep - start;
  return { level: l, imLevel, dauer, pct: dauer === 0 ? 0 : imLevel / dauer, fehlt: dauer - imLevel };
}
