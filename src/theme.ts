// Design „Puls“ – hell, frisch, klinisch-sauber: Mintweiß, tiefes Petrolgrün, bunte Pastell-Kacheln im Bento-Raster
//
// - Ruhiger, hellgrauer Hintergrund, weiße Flächen mit feiner Linie, keine Schatten
// - Eine Akzentfarbe je Rolle: Sanitäter/in Rot, Ersthelfer/in Grün (siehe src/game/rolle.ts)
// - Farben nur mit Bedeutung: Grün = richtig, Rot = falsch/Alarm, Bernstein = Belohnung
// - Zwei Schriften: Bricolage Grotesque für Überschriften, Inter zum Lesen
// Die alten Farbnamen bleiben als Alias bestehen und zeigen auf die ruhigen Werte.
export const colors = {
  // Basis (dunkel: Marineblau / Anthrazit)
  ink: '#0F2A2E', // Haupttext (hell auf dunkel)
  inkSoft: '#35504F',
  onBright: '#0F2A2E', // Text auf hellen Flächen (Türkis, Gelb, Weiß)
  navy: '#0F2A2E', // tiefste Fläche (Monitor, Tafeln)
  monitorBg: '#08181B',
  paper: '#EDF4F1', // Hintergrund (Marine)
  paperLine: '#E1ECE8',
  paperLineStrong: '#D3E2DC',
  surface: '#FFFFFF', // Karten (Anthrazit-Marine)
  surface2: '#F3F8F6', // zweite Ebene
  white: '#FFFFFF',
  // Text auf dunklen Flächen (Monitor, Pager, Tafeln)
  onDark: '#E9F5F2',
  onDarkSoft: '#9FBDB7',
  muted: '#5A7370', // Zweittext
  line: '#D9E5E0', // Linien, Rahmen, leere Balken

  // Signalfarben
  red: '#E0393E',
  redDark: '#B42327',
  redTint: '#FFE1E0',
  blue: '#2F6FED',
  blueDark: '#1F55BA',
  blueTint: '#DCE8FF',
  yellow: '#FFC531', // Belohnung, Auswahl
  yellowTint: '#FFF1C2',
  mint: '#BDEBD7', // richtig (Fläche)
  mintDark: '#0B7A55', // richtig (Text, Linie)
  mintTint: '#DDF5EA',

  // Bereichsfarben
  lilac: '#E6E0FF',
  violet: '#6D5BD0',
  pinkTint: '#FFDDEA',
  pinkStrong: '#C2347A',
  peach: '#FFE6C7',
  orange: '#E8731A',
  sky: '#D6ECFB',
  skyStrong: '#1C86C9',
  butter: '#FFF6D6',

  // Akzent Türkis
  tuerkis: '#0A9A88',
  tuerkisDark: '#075F55',
  tuerkisTint: '#D5F2EB',

  // Alte Namen (Alias)
  graphit: '#0F2A2E',
  graphitSoft: '#35504F',
  nacht: '#08181B',
  weiss: '#FFFFFF',
  grau50: '#EDF4F1',
  grau200: '#C9DAD4',
  grau300: '#8EA6A0',
  grau500: '#5A7370',
  signalrot: '#E0393E',
  leuchtorange: '#E8731A',
  warngelb: '#FFC531',
  blaulicht: '#2F6FED',
  blaulichtDark: '#1F55BA',
  blaulichtLight: '#DCE8FF',
  gruen: '#0B7A55',
  amber: '#E8731A',
  monitorGruen: '#2BE38B',
  indigo: '#6D5BD0',
  lila: '#8B7CF6',
  pink: '#C2347A',
};

/** Farben wie auf einem Patientenmonitor (auf dunklem Grund) */
export const monitor = {
  puls: '#2BE38B',
  rr: '#FF5A6A',
  spo2: '#4CD7FF',
  af: '#FFE226',
  temp: '#FFA033',
  bz: '#C79BFF',
  gcs: '#FFFFFF',
  ekg: '#2BE38B',
};

export const fonts = {
  /** Überschriften und Zahlen: Bricolage Grotesque – freundlich mit Charakter; Lesetext: Inter */
  display: 'Bricolage_700Bold',
  displayBlack: 'Bricolage_800ExtraBold',
  regular: 'Inter_400Regular',
  italic: 'Inter_400Regular_Italic',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  /** Kleine Etiketten in Großbuchstaben */
  mono: 'Inter_600SemiBold',
  /** Beschriftungen in den Grafiken (Rettungswagen, Auto, Geräte) */
  art: 'Inter_700Bold',
  artBlack: 'Inter_800ExtraBold',
};

/** Kacheln im Bento-Raster: Hintergrund, Rand und Akzent je Farbwelt (alle auf dunklem Marine) */
export const tiles = {
  slate: { bg: '#FFFFFF', edge: '#D9E5E0', accent: '#4D6663' },
  teal: { bg: '#D3F1E9', edge: '#B4E2D5', accent: '#07685D' },
  red: { bg: '#FFDDD9', edge: '#FFC2BB', accent: '#B02C27' },
  violet: { bg: '#E4DEFF', edge: '#CDC3FA', accent: '#5240B5' },
  amber: { bg: '#FFEFC0', edge: '#F7DC88', accent: '#855800' },
  blue: { bg: '#D8E7FF', edge: '#BAD2FA', accent: '#1E53B5' },
  green: { bg: '#DDF3D2', edge: '#C0E5B2', accent: '#2C6B1C' },
  pink: { bg: '#FFDDEA', edge: '#FBC1D5', accent: '#A3285B' },
  ink: { bg: '#0F2A2E', edge: '#1D4247', accent: '#5EEAD4' },
};
export type TileTint = keyof typeof tiles;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 12, md: 18, lg: 24, xl: 28, pill: 999 };

/** Früher harte Schatten – im Design „Klar“ gibt es keine Schatten. Bleibt als Funktion, damit alte Stellen funktionieren. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hardShadow = (_offset = 0, _color: string = colors.line) => ({});

export const shadow = {};

/** Weiße Fläche mit feiner Linie */
export const stickerFlat = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: radius.md,
};

export const sticker = { borderWidth: 1, borderColor: colors.line };

export const type = {
  largeTitle: { fontSize: 32, lineHeight: 36, fontFamily: fonts.displayBlack, letterSpacing: -0.9, color: colors.ink },
  title: { fontSize: 26, lineHeight: 30, fontFamily: fonts.displayBlack, letterSpacing: -0.7, color: colors.ink },
  h2: { fontSize: 20, lineHeight: 25, fontFamily: fonts.displayBlack, letterSpacing: -0.4, color: colors.ink },
  headline: { fontSize: 16.5, lineHeight: 21, fontFamily: fonts.display, letterSpacing: -0.2, color: colors.ink },
  /** Kleines Etikett in Großbuchstaben über Abschnitten */
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.semibold,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink, fontFamily: fonts.regular },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted, fontFamily: fonts.regular },
};

export function onColor(bg: string): string {
  const m = /^#?([0-9a-f]{6})/i.exec(bg);
  if (!m) return colors.ink;
  const n = parseInt(m[1], 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  // Gleicher Kontrast zu dunkler Tinte und Weiß bei L ≈ 0,20
  return L > 0.2 ? colors.onBright : colors.white;
}
