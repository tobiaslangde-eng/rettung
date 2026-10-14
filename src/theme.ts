// Design „Warnweste“ – Leuchtfarben auf EKG-Papier
//
// - Papier: rosa EKG-Millimeterpapier als Hintergrund, darauf weiße und pastellfarbene „Sticker“-Karten
// - Tinte: ein tiefes Nachtblau für Text, Umrandungen und harte Schatten (kein weicher Schatten)
// - Signalfarben mit fester Bedeutung: Rot = Einsatz/Alarm, Blau = Aktion/Fortschritt,
//   Warnwesten-Gelb = Belohnung/Auswahl, Mint = richtig
// - Schrift: Bricolage Grotesque für Überschriften und Zahlen, Inter zum Lesen, DM Mono für Etiketten
// Die alten Farbnamen (graphit, signalrot, …) bleiben als Alias bestehen.
export const colors = {
  // Basis
  ink: '#14173A', // Tinte
  inkSoft: '#2A2E5C',
  monitorBg: '#0C0F2B', // Patientenmonitor bleibt dunkel wie im echten Rettungswagen
  paper: '#FFF3EE', // EKG-Papier
  paperLine: '#FADCD4', // feines Raster (1 mm)
  paperLineStrong: '#F4BFB3', // kräftiges Raster (5 mm)
  white: '#FFFFFF',
  muted: '#666A8F', // Zweittext
  line: '#EADBD5', // feine Linien und leere Balken auf Papier

  // Signalfarben
  red: '#E4262F',
  redDark: '#B51424',
  redTint: '#FFD9D6',
  blue: '#2F5BFF',
  blueDark: '#1B3BC4',
  blueTint: '#DCE5FF',
  yellow: '#FFE226', // Warnweste
  yellowTint: '#FFF1A8',
  mint: '#2BD99F',
  mintDark: '#0B8A5F',
  mintTint: '#C8F7E4',

  // Pastellfarben der Bereiche
  lilac: '#E4DCFF',
  violet: '#6B4DFF',
  pinkTint: '#FFD9E8',
  pinkStrong: '#FF5C93',
  peach: '#FFDCC2',
  orange: '#FF8A1F',
  sky: '#D5F0FF',
  skyStrong: '#2EB8FF',
  butter: '#FFE9A8',

  // Alte Namen (Alias) – damit ältere Stellen automatisch die neuen Werte bekommen
  graphit: '#14173A',
  graphitSoft: '#2A2E5C',
  nacht: '#0C0F2B',
  weiss: '#FFFFFF',
  grau50: '#FFF3EE',
  grau200: '#EADBD5',
  grau300: '#B9B3CB',
  grau500: '#666A8F',
  signalrot: '#E4262F',
  leuchtorange: '#FF8A1F',
  warngelb: '#FFE226',
  blaulicht: '#2F5BFF',
  blaulichtDark: '#1B3BC4',
  blaulichtLight: '#DCE5FF',
  gruen: '#0B8A5F',
  amber: '#FF8A1F',
  monitorGruen: '#2BE38B',
  indigo: '#6B4DFF',
  lila: '#B07CFF',
  pink: '#FF5C93',
  tuerkis: '#2EB8FF',
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
  /** Überschriften und Zahlen: Bricolage Grotesque */
  display: 'Bricolage_700Bold',
  displayBlack: 'Bricolage_800ExtraBold',
  /** Lesetext: Inter */
  regular: 'Inter_400Regular',
  italic: 'Inter_400Regular_Italic',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  /** Etiketten, Pager-Anzeige, Uhrzeiten: DM Mono */
  mono: 'DMMono_500Medium',
  /** Beschriftungen in den Grafiken (Rettungswagen, Geräte) */
  art: 'Bricolage_700Bold',
  artBlack: 'Bricolage_800ExtraBold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/** Große, weiche Rundungen – wie bei Aufklebern */
export const radius = { sm: 12, md: 20, lg: 28, pill: 999 };

/** Harter Schatten in Tinte (kein Weichzeichner): wirkt wie ein dicker Aufkleber auf dem Papier */
export const hardShadow = (offset = 4, color: string = colors.ink) => ({ boxShadow: `0px ${offset}px 0px ${color}` });

/** Schatten für Karten (alter Name bleibt) */
export const shadow = hardShadow(4);

/** Aufkleber ohne Schatten: weiße Fläche mit Tinten-Umrandung (Schatten kommt bei antippbaren Karten von Tap) */
export const stickerFlat = {
  backgroundColor: colors.white,
  borderWidth: 2,
  borderColor: colors.ink,
  borderRadius: radius.md,
};

/** Aufkleber: Tinten-Umrandung plus harter Schatten */
export const sticker = { borderWidth: 2, borderColor: colors.ink, ...hardShadow(4) };

export const type = {
  largeTitle: { fontSize: 36, lineHeight: 38, fontFamily: fonts.displayBlack, letterSpacing: -1.1, color: colors.ink },
  title: { fontSize: 28, lineHeight: 31, fontFamily: fonts.displayBlack, letterSpacing: -0.8, color: colors.ink },
  h2: { fontSize: 22, lineHeight: 25, fontFamily: fonts.displayBlack, letterSpacing: -0.5, color: colors.ink },
  headline: { fontSize: 17, lineHeight: 21, fontFamily: fonts.display, letterSpacing: -0.3, color: colors.ink },
  /** Etikett in Großbuchstaben, wie am Gerätegehäuse */
  eyebrow: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: fonts.mono,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink, fontFamily: fonts.regular, letterSpacing: -0.1 },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted, fontFamily: fonts.regular },
};

/** Gut lesbare Textfarbe (Tinte oder Weiß) auf einem Hintergrund – wählt den besseren Kontrast. */
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
