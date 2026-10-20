import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path } from 'react-native-svg';
import { colors, fonts, spacing } from '../theme';
import { Tap } from './UI';

/** Kati, meine Kollegin: kleines Aufkleber-Porträt mit Warnweste */
export function KatiAvatar({ size = 44 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 44 44">
        <Defs>
          <ClipPath id="katiClip">
            <Circle cx={22} cy={22} r={20} />
          </ClipPath>
        </Defs>
        <Circle cx={22} cy={22} r={20} fill="#CFE0FF" />
        <G clipPath="url(#katiClip)">
          {/* Haare hinten mit Zopf */}
          <Path d="M9.5 20 C9 9 16 6 22.5 6 C29 6 35 9 34.5 20 C34.5 26 33 30 31 32 L13 32 C11 30 9.5 26 9.5 20 Z" fill="#4A3340" stroke={colors.outline} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M33 17 C38 18 40 24 37 31 C36.5 28 35.5 26 34 25 Z" fill="#4A3340" stroke={colors.outline} strokeWidth={1.4} strokeLinejoin="round" />
          {/* Schultern mit Warnweste und Reflexstreifen */}
          <Path d="M1 46 C1 35 10 32 22 32 C34 32 43 35 43 46 Z" fill="#F4B63A" stroke={colors.outline} strokeWidth={1.8} />
          <Path d="M2.5 40.5 L41.5 40.5 M3.5 44 L40.5 44" stroke="#EDEFF2" strokeWidth={2.2} />
          <Path d="M17 32.3 L22 39 L27 32.3" fill="#2F6FED" stroke={colors.outline} strokeWidth={1.4} strokeLinejoin="round" />
          <Path d="M22 39 L22 46" stroke={colors.outline} strokeWidth={1.2} />
          {/* Hals */}
          <Path d="M18.6 26 L18.6 33 Q22 36.4 25.4 33 L25.4 26 Z" fill="#F1B48E" />
          <Path d="M18.6 29.5 Q22 32 25.4 29.5 L25.4 27.5 L18.6 27.5 Z" fill="rgba(160,90,60,0.22)" />
          {/* Ohren */}
          <Ellipse cx={13.6} cy={22.4} rx={1.7} ry={2.3} fill="#FFD2B3" stroke={colors.outline} strokeWidth={1} />
          <Ellipse cx={30.4} cy={22.4} rx={1.7} ry={2.3} fill="#FFD2B3" stroke={colors.outline} strokeWidth={1} />
          {/* Gesicht */}
          <Path d="M13.8 20 C13.8 14.2 17.4 11.4 22 11.4 C26.6 11.4 30.2 14.2 30.2 20 C30.2 26 26.6 29.6 22 29.6 C17.4 29.6 13.8 26 13.8 20 Z" fill="#FFD7BC" stroke={colors.outline} strokeWidth={1.8} />
          {/* Pony mit Glanz */}
          <Path d="M13.4 19.6 C13.6 12.6 18.4 10 22.4 10.2 C27.6 10.4 31 13.6 30.8 19.6 C27.6 18.4 24.8 16.2 23.4 13.8 C21.2 16.8 17.4 18.8 13.4 19.6 Z" fill="#4A3340" stroke={colors.outline} strokeWidth={1.5} strokeLinejoin="round" />
          <Path d="M19 12.6 Q22 11.6 25 12.6" stroke="#8C6B7C" strokeWidth={1} strokeLinecap="round" fill="none" />
          {/* Augenbrauen */}
          <Path d="M16.2 19.4 Q18 18.4 19.8 19.1 M24.2 19.1 Q26 18.4 27.8 19.4" stroke="#3A2630" strokeWidth={1.1} strokeLinecap="round" fill="none" />
          {/* Augen */}
          <Ellipse cx={18.2} cy={22.2} rx={2} ry={2.3} fill="#FFFFFF" />
          <Ellipse cx={25.8} cy={22.2} rx={2} ry={2.3} fill="#FFFFFF" />
          <Circle cx={18.4} cy={22.4} r={1.35} fill="#3B2A33" />
          <Circle cx={25.6} cy={22.4} r={1.35} fill="#3B2A33" />
          <Circle cx={18.9} cy={21.8} r={0.5} fill="#FFFFFF" />
          <Circle cx={26.1} cy={21.8} r={0.5} fill="#FFFFFF" />
          {/* Nase, Mund, Wangen */}
          <Path d="M22 23.6 Q23.2 25.4 21.6 25.8" stroke="rgba(150,80,50,0.6)" strokeWidth={0.9} strokeLinecap="round" fill="none" />
          <Path d="M19.2 27 Q22 29.2 24.8 27" fill="none" stroke="#A04A3C" strokeWidth={1.3} strokeLinecap="round" />
          <Circle cx={15.8} cy={25.6} r={1.7} fill="#FF8FA0" opacity={0.4} />
          <Circle cx={28.2} cy={25.6} r={1.7} fill="#FF8FA0" opacity={0.4} />
        </G>
        <Circle cx={22} cy={22} r={20} fill="none" stroke={colors.outline} strokeWidth={2.4} />
      </Svg>
    </View>
  );
}

/** Meine Kollegin Kati – Sprechblase mit Tipps. */
export function Kati({ children }: { children: ReactNode }) {
  return (
    <View style={styles.row}>
      <KatiAvatar />
      <View style={styles.bubble}>
        <Text style={styles.name}>Kati · Kollegin</Text>
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

export function AskKati({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Tap onPress={onPress} offset={3} accessibilityLabel={label} style={styles.ask}>
      <KatiAvatar size={32} />
      <Text style={styles.askText}>{label}</Text>
    </Tap>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  bubble: {
    flex: 1,
    backgroundColor: colors.blueTint,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  name: { fontSize: 10.5, fontFamily: fonts.mono, color: colors.blueDark, letterSpacing: 1, textTransform: 'uppercase' },
  text: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink, marginTop: 3, lineHeight: 21 },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingRight: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  askText: { color: colors.ink, fontFamily: fonts.display, fontSize: 15, flex: 1, letterSpacing: -0.2 },
});
