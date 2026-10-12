// Estnisches Design. Die Flagge wird als Landschaft gelesen:
// sinine = Himmel, must = Erde, valge = Schnee. Dazu Kornblumenblau (rukkilill)
// und die Streifenfarben der Kihnu-Röcke (Rot, Orange, Gelb) als Akzente.
export const colors = {
  sinine: '#0072CE', // Flaggenblau – Himmel
  sinineDark: '#004F91',
  sinineDeep: '#0A2E52', // Abendhimmel
  sinineLight: '#DCEBFA',
  must: '#111417', // Schwarz – Erde
  mustSoft: '#23282E',
  valge: '#FFFFFF', // Weiß – Schnee
  lumi: '#EEF3F8', // Schneeweiß, leicht bläulich (Seitenhintergrund)
  lumiDark: '#D9E2EC', // Haarlinien, Schatten im Schnee
  linen: '#EEF3F8', // Alias für ältere Stellen
  linenDark: '#D9E2EC',
  rukkilill: '#3F5BD9', // Kornblume
  kihnuRed: '#C8102E', // Kihnu-Rot (Alarm)
  kihnuOrange: '#E8590C',
  kihnuYellow: '#F2B705',
  rabaGreen: '#2E7D4F', // Moorgrün (richtig)
  amber: '#D98E04',
  grey: '#5B6573', // Grau mit Blaustich
  greyLight: '#AEB8C4',
};

export const fonts = {
  display: 'Unbounded_700Bold',
  displayBlack: 'Unbounded_900Black',
  regular: 'Figtree_400Regular',
  italic: 'Figtree_400Regular_Italic',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
  extrabold: 'Figtree_800ExtraBold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 4, md: 8 };

export const type = {
  title: { fontSize: 30, fontFamily: fonts.displayBlack, letterSpacing: 1, color: colors.must },
  h2: { fontSize: 19, fontFamily: fonts.display, color: colors.must, lineHeight: 26 },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.extrabold,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.sinine,
  },
  body: { fontSize: 15, lineHeight: 22, color: colors.must, fontFamily: fonts.regular },
  small: { fontSize: 13, lineHeight: 18, color: colors.grey, fontFamily: fonts.regular },
};
