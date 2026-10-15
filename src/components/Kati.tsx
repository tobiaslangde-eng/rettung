import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';
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
          {/* Schultern mit Warnweste */}
          <Path d="M2 46 C2 34 10 31 22 31 C34 31 42 34 42 46 Z" fill={colors.yellow} stroke={colors.ink} strokeWidth={2} />
          <Path d="M16 31 L22 40 L28 31" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" />
          {/* Haare hinten */}
          <Ellipse cx={22} cy={19} rx={11.5} ry={12} fill="#3B2A33" stroke={colors.ink} strokeWidth={2} />
          {/* Hals und Gesicht */}
          <Rect x={19} y={26} width={6} height={6} fill="#F2B591" />
          <Circle cx={22} cy={21.5} r={8.6} fill="#FFD2B3" stroke={colors.ink} strokeWidth={2} />
          {/* Pony */}
          <Path
            d="M13.2 20 C14 13 19 11.5 23 12 C27.5 12.5 30.5 15.5 30.8 20 C27.5 18.5 25 16.5 23.5 14.5 C21.5 17.5 17 19 13.2 20 Z"
            fill="#3B2A33"
            stroke={colors.ink}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          {/* Gesicht */}
          <Circle cx={18.6} cy={22.6} r={1.2} fill={colors.ink} />
          <Circle cx={25.4} cy={22.6} r={1.2} fill={colors.ink} />
          <Path d="M19 26.2 Q22 28.4 25 26.2" fill="none" stroke={colors.ink} strokeWidth={1.5} strokeLinecap="round" />
          <Circle cx={16.2} cy={25.4} r={1.5} fill="#FF9DA8" opacity={0.8} />
          <Circle cx={27.8} cy={25.4} r={1.5} fill="#FF9DA8" opacity={0.8} />
        </G>
        <Circle cx={22} cy={22} r={20} fill="none" stroke={colors.ink} strokeWidth={2.4} />
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  askText: { color: colors.ink, fontFamily: fonts.display, fontSize: 15, flex: 1, letterSpacing: -0.2 },
});
