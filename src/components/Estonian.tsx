import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

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

/**
 * Ornamentband im Stil estnischer Volksmuster (Rauten / „kaheksakand“-Anklang),
 * nur aus Views gebaut, damit keine SVG-Bibliothek nötig ist.
 */
export function Ornament({
  count = 14,
  color = colors.sinine,
  accent = colors.must,
  background = 'transparent',
}: {
  count?: number;
  color?: string;
  accent?: string;
  background?: string;
}) {
  return (
    <View style={[styles.ornament, { backgroundColor: background }]}>
      <View style={[styles.ornLine, { backgroundColor: accent }]} />
      <View style={styles.ornRow}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.motif}>
            <View style={[styles.diamond, { borderColor: i % 2 ? accent : color }]}>
              <View style={[styles.diamondInner, { backgroundColor: i % 2 ? color : accent }]} />
            </View>
            <View style={[styles.dot, { backgroundColor: color }]} />
          </View>
        ))}
      </View>
      <View style={[styles.ornLine, { backgroundColor: accent }]} />
    </View>
  );
}

export function Eyebrow({ et, de }: { et: string; de?: string }) {
  return (
    <Text style={type.eyebrow}>
      {et}
      {de ? <Text style={{ color: colors.grey, letterSpacing: 1 }}>{`  ·  ${de}`}</Text> : null}
    </Text>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
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
      <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
      {sub ? <Text style={[styles.btnSub, { color: fg }]}>{sub}</Text> : null}
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
          <Text style={styles.topEt}>{et.toUpperCase()}</Text>
          <Text style={styles.topTitle}>{title}</Text>
        </View>
        {right}
      </View>
      <FlagStripe height={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  ornament: { paddingVertical: 4 },
  ornLine: { height: 2 },
  ornRow: { flexDirection: 'row', justifyContent: 'center', overflow: 'hidden', paddingVertical: 6 },
  motif: { width: 26, height: 22, alignItems: 'center', justifyContent: 'center' },
  diamond: {
    width: 14,
    height: 14,
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: { width: 4, height: 4 },
  dot: { position: 'absolute', right: -2, width: 3, height: 3, transform: [{ rotate: '45deg' }] },
  card: {
    backgroundColor: colors.valge,
    borderRadius: radius.sm,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.sinine,
    shadowColor: colors.must,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnLabel: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  btnSub: { fontSize: 11, marginTop: 2, opacity: 0.8, letterSpacing: 1.5, textTransform: 'uppercase' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.must,
  },
  back: { color: colors.valge, fontSize: 32, lineHeight: 34, fontWeight: '300' },
  topEt: { color: colors.sinineLight, fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  topTitle: { color: colors.valge, fontSize: 18, fontWeight: '700' },
});
