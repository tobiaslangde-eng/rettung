// Estnisches Design: Flaggenfarben (sinine – must – valge), Leinen-Hintergrund,
// Kornblumenblau (rukkilill, Nationalblume) und Kihnu-Rot als Akzent.
export const colors = {
  sinine: '#0072CE', // Flaggenblau
  sinineDark: '#00508F',
  sinineLight: '#D6E8F7',
  must: '#111111', // Schwarz
  valge: '#FFFFFF', // Weiß
  linen: '#F4F1EA', // Leinen
  linenDark: '#E6E0D2',
  rukkilill: '#4A6FE3', // Kornblume
  kihnuRed: '#C8102E', // Kihnu-Rock-Rot (Alarm)
  rabaGreen: '#2E7D4F', // Moorgrün (richtig)
  amber: '#D98E04', // Bernstein
  grey: '#6B6B6B',
  greyLight: '#BDBDBD',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 4, md: 8 };

export const type = {
  title: { fontSize: 30, fontWeight: '800' as const, letterSpacing: 1, color: colors.must },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.must },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.sinine,
  },
  body: { fontSize: 15, lineHeight: 22, color: colors.must },
  small: { fontSize: 13, lineHeight: 18, color: colors.grey },
};
