// Design „Klar“ – schlicht und klar strukturiert
//
// - Ruhiger, hellgrauer Hintergrund, weiße Flächen mit feiner Linie, keine Schatten
// - Eine Akzentfarbe je Rolle: Sanitäter/in Rot, Ersthelfer/in Grün (siehe src/game/rolle.ts)
// - Farben nur mit Bedeutung: Grün = richtig, Rot = falsch/Alarm, Bernstein = Belohnung
// - Zwei Schriften: Bricolage Grotesque für Überschriften, Inter zum Lesen
// Die alten Farbnamen bleiben als Alias bestehen und zeigen auf die ruhigen Werte.
export const colors = {
  // Basis
  ink: '#1A1D24', // Text
  inkSoft: '#343944',
  monitorBg: '#151922', // Patientenmonitor bleibt dunkel wie im echten Rettungswagen
  paper: '#F4F5F7', // Hintergrund
  paperLine: '#ECEEF2',
  paperLineStrong: '#E1E4EA',
  white: '#FFFFFF',
  muted: '#667085', // Zweittext
  line: '#E3E6EB', // Linien, Rahmen, leere Balken

  // Signalfarben
  red: '#D92D20',
  redDark: '#B42318',
  redTint: '#FDECEA',
  blue: '#2563EB',
  blueDark: '#1D4ED8',
  blueTint: '#E8EFFE',
  yellow: '#FBD860', // Belohnung, Auswahl
  yellowTint: '#FEF6DA',
  mint: '#A6E9C3', // richtig (Fläche)
  mintDark: '#127A47', // richtig (Text, Linie)
  mintTint: '#E7F8EE',

  // Bereichsfarben (zurückhaltend)
  lilac: '#EEEFFC',
  violet: '#4F46E5',
  pinkTint: '#FCEBF3',
  pinkStrong: '#D6337A',
  peach: '#FDEEE2',
  orange: '#E46A12',
  sky: '#E6F3FB',
  skyStrong: '#1F8FC9',
  butter: '#FBF7EC',

  // Alte Namen (Alias)
  graphit: '#1A1D24',
  graphitSoft: '#343944',
  nacht: '#151922',
  weiss: '#FFFFFF',
  grau50: '#F4F5F7',
  grau200: '#E3E6EB',
  grau300: '#C5CAD3',
  grau500: '#667085',
  signalrot: '#D92D20',
  leuchtorange: '#E46A12',
  warngelb: '#FBD860',
  blaulicht: '#2563EB',
  blaulichtDark: '#1D4ED8',
  blaulichtLight: '#E8EFFE',
  gruen: '#127A47',
  amber: '#E46A12',
  monitorGruen: '#2BE38B',
  indigo: '#4F46E5',
  lila: '#8B7CF6',
  pink: '#D6337A',
  tuerkis: '#1F8FC9',
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

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 10, md: 14, lg: 18, pill: 999 };

/** Früher harte Schatten – im Design „Klar“ gibt es keine Schatten. Bleibt als Funktion, damit alte Stellen funktionieren. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hardShadow = (_offset = 0, _color: string = colors.line) => ({});

export const shadow = {};

/** Weiße Fläche mit feiner Linie */
export const stickerFlat = {
  backgroundColor: colors.white,
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
  // Gleicher Kontrast zu Tinte und Weiß bei L ≈ 0,20
  return L > 0.2 ? colors.ink : colors.white;
}
