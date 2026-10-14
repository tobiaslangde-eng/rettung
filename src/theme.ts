// Rettungsdienst-Design: Graphit wie Einsatzkleidung und Monitorgehäuse,
// Signalrot und Blaulicht als Einsatzfarben, Warngelb für Reflexstreifen,
// Monitorfarben für Vitalwerte. Neutrale Grautöne für Flächen.
export const colors = {
  graphit: '#15181C',
  graphitSoft: '#262B31',
  nacht: '#0B0E12', // Monitorhintergrund
  weiss: '#FFFFFF',
  grau50: '#F2F3F5', // Seitenhintergrund
  grau200: '#DADDE2', // Haarlinien
  grau300: '#A7ADB5',
  grau500: '#5F6670',
  signalrot: '#E3262B', // Leuchtrot, Alarm und Hauptaktion
  leuchtorange: '#FF6A13',
  warngelb: '#FFD100', // Reflexstreifen
  blaulicht: '#1F6FEB',
  blaulichtDark: '#164FB0',
  blaulichtLight: '#E3ECFD',
  gruen: '#1F9D55', // richtig
  amber: '#D98E04',
  monitorGruen: '#2BE38B', // EKG-Kurve
};

/** Farben wie auf einem Patientenmonitor */
export const monitor = {
  puls: '#2BE38B',
  rr: '#FF5A5F',
  spo2: '#33D6FF',
  af: '#FFD100',
  temp: '#FF9F43',
  bz: '#C38BFF',
  gcs: '#FFFFFF',
  ekg: '#2BE38B',
};

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displayBlack: 'BarlowCondensed_800ExtraBold',
  regular: 'Barlow_400Regular',
  italic: 'Barlow_400Regular_Italic',
  semibold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  extrabold: 'Barlow_800ExtraBold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10 };

export const type = {
  title: { fontSize: 32, fontFamily: fonts.displayBlack, letterSpacing: 0.5, color: colors.graphit },
  h2: { fontSize: 22, fontFamily: fonts.display, color: colors.graphit, lineHeight: 27 },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.extrabold,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
    color: colors.signalrot,
  },
  body: { fontSize: 15, lineHeight: 22, color: colors.graphit, fontFamily: fonts.regular },
  small: { fontSize: 13, lineHeight: 18, color: colors.grau500, fontFamily: fonts.regular },
};
