import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radius, spacing, type } from '../theme';
import { ReflexStripes, StarOfLife } from './Ems';

export { WarnStripes } from './Ems';

/** Kleine estnische Flagge (sinine – must – valge) als dezenter Herkunftshinweis. */
export function EstonianFlag({ width = 18 }: { width?: number }) {
  const h = (width * 7) / 11 / 3;
  return (
    <View style={{ width, borderRadius: 1, overflow: 'hidden' }}>
      <View style={{ height: h, backgroundColor: '#0072CE' }} />
      <View style={{ height: h, backgroundColor: '#000000' }} />
      <View style={{ height: h, backgroundColor: colors.weiss }} />
    </View>
  );
}

export function Eyebrow({ et, de }: { et: string; de?: string }) {
  return (
    <Text style={type.eyebrow}>
      {et}
      {de ? <Text style={styles.eyebrowDe}>{`   ${de}`}</Text> : null}
    </Text>
  );
}

/**
 * Weiße Karte mit feiner Linie. Ein Statuston (`borderLeftColor`, z. B. Grün/Rot)
 * wird als Streifen oben an der Karte gezeigt, wie eine Statusleiste am Monitor.
 */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { borderLeftColor, ...rest } = StyleSheet.flatten(style) ?? {};
  const tone = typeof borderLeftColor === 'string' ? borderLeftColor : undefined;
  return (
    <View style={[styles.card, rest]}>
      {tone && <View style={[styles.status, { backgroundColor: tone }]} />}
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
    primary: colors.blaulicht,
    dark: colors.graphit,
    outline: colors.weiss,
    alarm: colors.signalrot,
  }[variant];
  const fg = variant === 'outline' ? colors.graphit : colors.weiss;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.graphit },
        style,
      ]}
    >
      <View style={styles.btnInner}>
        <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
        {sub ? <Text style={[styles.btnSub, { color: fg }]}>{sub}</Text> : null}
      </View>
      {variant === 'alarm' && <ReflexStripes height={6} />}
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
            <StarOfLife size={12} outline={colors.graphit} />
            <Text style={styles.topEt}>{et.toUpperCase()}</Text>
          </View>
          <Text style={styles.topTitle}>{title}</Text>
        </View>
        {right}
      </View>
      <ReflexStripes height={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrowDe: { color: colors.grau500, letterSpacing: 1.2, fontFamily: fonts.semibold },
  card: {
    backgroundColor: colors.weiss,
    borderRadius: radius.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.grau200,
    overflow: 'hidden',
  },
  status: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  btn: { borderRadius: radius.sm, overflow: 'hidden' },
  btnInner: { paddingVertical: 13, paddingHorizontal: spacing.lg, alignItems: 'center' },
  btnLabel: { fontSize: 19, fontFamily: fonts.display, letterSpacing: 0.6, textTransform: 'uppercase' },
  btnSub: { fontFamily: fonts.semibold, fontSize: 10, marginTop: 1, opacity: 0.75, letterSpacing: 1.6, textTransform: 'uppercase' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.graphit,
  },
  back: { color: colors.weiss, fontSize: 32, lineHeight: 34, fontFamily: fonts.regular },
  topEt: { color: colors.grau300, fontSize: 10, letterSpacing: 2.2, fontFamily: fonts.extrabold },
  topTitle: { color: colors.weiss, fontSize: 22, fontFamily: fonts.display, letterSpacing: 0.4, textTransform: 'uppercase' },
});
