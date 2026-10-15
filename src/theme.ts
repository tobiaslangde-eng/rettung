// Design „Leitstelle“ – dunkel, technisch, professionell (Marineblau, Anthrazit, Weiß, Rot und Türkis als Akzente)
//
// - Ruhiger, hellgrauer Hintergrund, weiße Flächen mit feiner Linie, keine Schatten
// - Eine Akzentfarbe je Rolle: Sanitäter/in Rot, Ersthelfer/in Grün (siehe src/game/rolle.ts)
// - Farben nur mit Bedeutung: Grün = richtig, Rot = falsch/Alarm, Bernstein = Belohnung
// - Zwei Schriften: Bricolage Grotesque für Überschriften, Inter zum Lesen
// Die alten Farbnamen bleiben als Alias bestehen und zeigen auf die ruhigen Werte.
export const colors = {
  // Basis (dunkel: Marineblau / Anthrazit)
  ink: '#EAF0F8', // Haupttext (hell auf dunkel)
  inkSoft: '#C3CEDD',
  onBright: '#08121F', // Text auf hellen Flächen (Türkis, Gelb, Weiß)
  navy: '#050D18', // tiefste Fläche (Monitor, Tafeln)
  monitorBg: '#050D18',
  paper: '#0B1727', // Hintergrund (Marine)
  paperLine: '#13253D',
  paperLineStrong: '#1C3252',
  surface: '#13233A', // Karten (Anthrazit-Marine)
  surface2: '#1A2E4A', // zweite Ebene
  white: '#FFFFFF',
  muted: '#8FA2BA', // Zweittext
  line: '#243C5A', // Linien, Rahmen, leere Balken

  // Signalfarben
  red: '#E5383B',
  redDark: '#FF7A7D',
  redTint: '#3A1A25',
  blue: '#3B82F6',
  blueDark: '#7FB0FF',
  blueTint: '#14305A',
  yellow: '#F7C948', // Belohnung, Auswahl
  yellowTint: '#3A3218',
  mint: '#14664A', // richtig (Fläche)
  mintDark: '#4ADE9A', // richtig (Text, Linie)
  mintTint: '#0F3A2E',

  // Bereichsfarben
  lilac: '#1F2750',
  violet: '#8B8CFF',
  pinkTint: '#3B1B30',
  pinkStrong: '#FF6FAE',
  peach: '#3A261A',
  orange: '#FF8A3D',
  sky: '#0F3048',
  skyStrong: '#2DD4E8',
  butter: '#222A33',

  // Akzent Türkis
  tuerkis: '#2DD4BF',
  tuerkisDark: '#5EEAD4',
  tuerkisTint: '#0E3A3C',

  // Alte Namen (Alias)
  graphit: '#EAF0F8',
  graphitSoft: '#C3CEDD',
  nacht: '#050D18',
  weiss: '#FFFFFF',
  grau50: '#0B1727',
  grau200: '#C3CEDD',
  grau300: '#8FA2BA',
  grau500: '#8FA2BA',
  signalrot: '#E5383B',
  leuchtorange: '#FF8A3D',
  warngelb: '#F7C948',
  blaulicht: '#3B82F6',
  blaulichtDark: '#7FB0FF',
  blaulichtLight: '#14305A',
  gruen: '#4ADE9A',
  amber: '#FF8A3D',
  monitorGruen: '#2BE38B',
  indigo: '#8B8CFF',
  lila: '#A99BFF',
  pink: '#FF6FAE',
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
