// Design nach Apples Human Interface Guidelines (HIG):
// - Klarheit: ruhige helle Flächen, eine klare Schrifthierarchie, Inhalt vor Dekoration
// - Systemfarben von iOS (Rot, Blau, Grün, Orange …) – kräftig, aber sparsam als Akzent
// - Weiche, große Rundungen, leichte Schatten statt Rahmen, große Tippflächen (mind. 44 pt)
// Die Namen der Farben stammen noch aus dem Rettungsdienst-Design und bleiben, damit alle
// Bildschirme automatisch die neuen Werte bekommen.
export const colors = {
  graphit: '#1C1C1E', // Text (label)
  graphitSoft: '#2C2C2E',
  nacht: '#0B0E12', // Monitorhintergrund (Patientenmonitor bleibt dunkel)
  weiss: '#FFFFFF',
  grau50: '#F2F2F7', // Seitenhintergrund (systemGroupedBackground)
  grau200: '#E5E5EA', // Trennlinien (systemGray5)
  grau300: '#C7C7CC', // systemGray3
  grau500: '#6E6E73', // Zweittext (secondaryLabel)
  signalrot: '#FF3B30', // systemRed – Einsatz, Hauptaktion
  leuchtorange: '#FF9500', // systemOrange
  warngelb: '#FFCC00', // systemYellow
  blaulicht: '#007AFF', // systemBlue – Links, Auswahl
  blaulichtDark: '#0056CC',
  blaulichtLight: '#E5F0FF',
  gruen: '#34C759', // systemGreen – richtig
  amber: '#FF9500',
  monitorGruen: '#30D158', // EKG-Kurve
  indigo: '#5856D6',
  lila: '#AF52DE',
  pink: '#FF2D55',
  mint: '#00C7BE',
  tuerkis: '#32ADE6',
};

/** Farben wie auf einem Patientenmonitor */
export const monitor = {
  puls: '#30D158',
  rr: '#FF453A',
  spo2: '#64D2FF',
  af: '#FFD60A',
  temp: '#FF9F0A',
  bz: '#BF5AF2',
  gcs: '#FFFFFF',
  ekg: '#30D158',
};

/** Schrift Inter – sehr nah an Apples SF Pro und auf allen Geräten gleich. */
export const fonts = {
  display: 'Inter_700Bold',
  displayBlack: 'Inter_800ExtraBold',
  regular: 'Inter_400Regular',
  italic: 'Inter_400Regular_Italic',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  /** Schmale Schrift nur für Beschriftungen in Grafiken (Fahrzeug, Geräte) */
  art: 'BarlowCondensed_700Bold',
  artBlack: 'BarlowCondensed_800ExtraBold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/** Große, weiche Rundungen wie bei iOS-Karten und -Knöpfen */
export const radius = { sm: 12, md: 20, lg: 28, pill: 999 };

/** Leichter Schatten statt Rahmen */
export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

// Schriftgrößen nach den iOS-Textstilen (Large Title 34, Title 1 28, Title 2 22, Headline 17, Body 17,
// Subheadline 15, Footnote 13, Caption 12)
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontFamily: fonts.extrabold, letterSpacing: -0.6, color: colors.graphit },
  title: { fontSize: 28, lineHeight: 34, fontFamily: fonts.extrabold, letterSpacing: -0.5, color: colors.graphit },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: fonts.bold, letterSpacing: -0.3, color: colors.graphit },
  headline: { fontSize: 17, lineHeight: 22, fontFamily: fonts.semibold, letterSpacing: -0.2, color: colors.graphit },
  /** Abschnittsüberschrift wie in iOS-Listen */
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.semibold,
    letterSpacing: 0.2,
    textTransform: 'uppercase' as const,
    color: colors.grau500,
  },
  body: { fontSize: 16, lineHeight: 23, color: colors.graphit, fontFamily: fonts.regular, letterSpacing: -0.15 },
  small: { fontSize: 13, lineHeight: 18, color: colors.grau500, fontFamily: fonts.regular },
};
