import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Kaheksakand, KihnuStripes } from './Folk';
import { colors, radius, spacing, type, fonts } from '../theme';

/** Trikolore-Streifen: sinine – must – valge */
export function FlagStripe({ height = 6 }: { height?: number }) {
  return (
    <View style={{ height: height * 3 }}>
      <View style={{ flex: 1, backgroundColor: colors.sinine }} />
      <View style={{ flex: 1, backgroundColor: colors.must }} />
      <View style={{ flex: 1, backgroundColor: colors.valge }} />
    </View>
  );
}

export { Ornament } from './Folk';

export function Eyebrow({ et, de }: { et: string; de?: string }) {
  return (
    <Text style={type.eyebrow}>
      {et}
      {de ? <Text style={styles.eyebrowDe}>{`   ${de}`}</Text> : null}
    </Text>
  );
}

/**
 * Weiße Karte mit feiner Linie. Statt eines Farbbalkens trägt jede Karte einen kleinen
 * Kaheksakand-Stempel oben rechts; seine Farbe kommt aus `borderLeftColor` (Ton der Karte).
 */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { borderLeftColor, ...rest } = StyleSheet.flatten(style) ?? {};
  const tone = typeof borderLeftColor === 'string' ? borderLeftColor : colors.sinine;
  return (
    <View style={[styles.card, rest]}>
      <View style={styles.stamp} pointerEvents="none">
        <Kaheksakand size={14} color={tone} />
      </View>
      {children}
    </View>
  );
}

type BtnVariant = 'primary' | 'dark' | 'outline' | 'alarm';

export function Button({
  label,
  sub,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  label: string;
  sub?: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = {
    primary: colors.sinine,
    dark: colors.must,
    outline: colors.valge,
    alarm: colors.kihnuRed,
  }[variant];
  const fg = variant === 'outline' ? colors.must : colors.valge;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 2, borderColor: colors.must },
        style,
      ]}
    >
      <View style={styles.btnInner}>
        <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
        {sub ? <Text style={[styles.btnSub, { color: fg }]}>{sub}</Text> : null}
      </View>
      {variant === 'alarm' && <KihnuStripes height={5} />}
      {variant === 'primary' && <View style={styles.btnSnow} />}
    </Pressable>
  );
}

export function TopBar({ title, et, onBack, right }: { title: string; et: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <View>
      <View style={styles.topBar}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Zurück">
            <Text style={styles.back}>‹</Text>
          </Pressable>
        ) : (
          <View style={{ width: 20 }} />
        )}
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Kaheksakand size={10} color={colors.sinine} gap={colors.must} />
            <Text style={styles.topEt}>{et.toUpperCase()}</Text>
          </View>
          <Text style={styles.topTitle}>{title}</Text>
        </View>
        {right}
      </View>
      <FlagStripe height={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrowDe: { color: colors.grey, letterSpacing: 1.5, fontFamily: fonts.semibold },
  stamp: { position: 'absolute', top: 10, right: 10, opacity: 0.9 },
  card: {
    backgroundColor: colors.valge,
    borderRadius: radius.sm,
    padding: spacing.lg,
    paddingRight: spacing.xl + 4,
    borderWidth: 1,
    borderColor: colors.lumiDark,
  },
  btn: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  btnInner: { paddingVertical: 14, paddingHorizontal: spacing.lg, alignItems: 'center' },
  btnSnow: { height: 3, backgroundColor: colors.sinineDark },
  btnLabel: { fontSize: 15, fontFamily: fonts.display, letterSpacing: 0.3 },
  btnSub: { fontFamily: fonts.regular, fontSize: 11, marginTop: 2, opacity: 0.8, letterSpacing: 1.5, textTransform: 'uppercase' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.must,
  },
  back: { color: colors.valge, fontSize: 32, lineHeight: 34, fontFamily: fonts.regular },
  topEt: { color: colors.sinineLight, fontSize: 10, letterSpacing: 2.5, fontFamily: fonts.extrabold },
  topTitle: { color: colors.valge, fontSize: 17, fontFamily: fonts.display, marginTop: 2 },
});
