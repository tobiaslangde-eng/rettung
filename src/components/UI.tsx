import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { useRolle } from '../game/rolle';
import { colors, fonts, onColor, radius, spacing, type } from '../theme';

export { WarnStripes } from './Ems';

/** Etikett in Großbuchstaben (Gerätegehäuse-Stil) */
export function Eyebrow({ title, color }: { title: string; color?: string }) {
  return <Text style={[type.eyebrow, color ? { color } : null]}>{title}</Text>;
}

/** Abschnittsüberschrift mit optionalem Zusatz rechts */
export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={type.h2}>{title}</Text>
      {right}
    </View>
  );
}

/** Antippbare Fläche: wird beim Drücken etwas blasser, am PC beim Darüberfahren leicht. */
export function Tap({
  onPress,
  style,
  children,
  offset = 4,
  disabled,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
}: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** 0 = keine Rückmeldung beim Drücken (z. B. bei ausgewählten Optionen) */
  offset?: number;
  /** Früher Farbe des harten Schattens – ohne Wirkung */
  shadowColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'radio' | 'tab' | 'checkbox';
  accessibilityState?: { selected?: boolean; checked?: boolean; disabled?: boolean; expanded?: boolean };
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, ...accessibilityState }}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        style,
        offset > 0 && !disabled && (pressed || hovered) ? { opacity: pressed ? 0.6 : 0.85 } : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

/** Weiße Karte mit feiner Linie. Ein Statuston (`borderLeftColor`, z. B. Grün/Rot) erscheint als schmaler Streifen links. */
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

type BtnVariant = 'primary' | 'dark' | 'outline' | 'alarm' | 'tinted' | 'mint';

/** Klarer Knopf: Hauptaktion in der Farbe der Rolle, sonst weiß oder hell getönt */
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
  const r = useRolle();
  const look: Record<BtnVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: r.akzent, fg: onColor(r.akzent) },
    dark: { bg: colors.surface2, fg: colors.ink },
    outline: { bg: colors.surface, fg: colors.ink, border: colors.line },
    alarm: { bg: colors.red, fg: colors.white },
    tinted: { bg: r.akzentTint, fg: r.akzentDunkel },
    mint: { bg: colors.mintTint, fg: colors.mintDark },
  };
  const { bg, fg, border } = look[variant];
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.45 : 1 }, border ? { borderWidth: 1, borderColor: border } : null, style]}
    >
      <View style={styles.btnInner}>
        <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
        {sub ? <Text style={[styles.btnSub, { color: fg }]}>{sub}</Text> : null}
      </View>
    </Tap>
  );
}

function Chevron({ color = colors.ink, size = 20, dir = 'left' }: { color?: string; size?: number; dir?: 'left' | 'right' }) {
  return (
    <Svg width={size * 0.6} height={size} viewBox="0 0 12 20">
      <Path
        d={dir === 'left' ? 'M10 2 L2 10 L10 18' : 'M2 2 L10 10 L2 18'}
        stroke={color}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Kopfzeile: Zurück-Knopf, kleines Etikett und Titel */
export function TopBar({
  title,
  kicker,
  onBack,
  right,
}: {
  title: string;
  kicker: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topRow}>
        {onBack ? (
          <Tap onPress={onBack} accessibilityLabel="Zurück" style={styles.backBtn}>
            <Chevron />
          </Tap>
        ) : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.topKicker}>{kicker}</Text>
          <Text style={[styles.topTitle, !onBack && { fontSize: 28, lineHeight: 34 }]} numberOfLines={2}>
            {title}
          </Text>
        </View>
        {right}
      </View>
    </View>
  );
}

/** Kleine Wert-Anzeige oben rechts (Punkte, Minuten, richtige Antworten) */
export function StatChip({ value, label, color = colors.surface2 }: { value: string | number; label: string; color?: string }) {
  const bright = onColor(color) === colors.onBright;
  return (
    <View style={[styles.statChip, { backgroundColor: color }]}>
      <Text style={[styles.statValue, bright && { color: colors.onBright }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** Rundes Symbol-Sticker (Emoji auf farbigem Grund) */
export function IconTile({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={{ fontSize: size * 0.5, lineHeight: size * 0.62, fontFamily: fonts.regular }}>{icon}</Text>
    </View>
  );
}

/** Auswahl aus mehreren Möglichkeiten (Segment-Schalter): die gewählte Option liegt weiß auf grauem Grund. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Tap
            key={o.id}
            onPress={() => onChange(o.id)}
            offset={active ? 0 : 1}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: active }}
            style={[styles.segItem, active && styles.segActive]}
          >
            <Text style={[styles.segLabel, active && { fontFamily: fonts.semibold, color: colors.ink }]} numberOfLines={1}>
              {o.label}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/** Kleines Etikett (z. B. „Neu“, „+50 %“); `light` = weißer Grund mit Rahmen */
export function Pill({ label, color = colors.redTint, light }: { label: string; color?: string; light?: boolean }) {
  const bg = light ? colors.surface2 : color;
  const fg = onColor(bg);
  return (
    <View style={[styles.pill, { backgroundColor: bg }, light && { borderWidth: 1, borderColor: colors.line }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Schlanker Fortschrittsbalken */
export function Bar({
  pct,
  color,
  height = 8,
  track = colors.line,
  style,
}: {
  pct: number;
  color?: string;
  height?: number;
  track?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const r = useRolle();
  const p = Math.max(0, Math.min(1, pct));
  const h = Math.min(height, 10);
  return (
    <View style={[styles.bar, { height: h, backgroundColor: track === colors.white ? colors.line : track, borderRadius: h / 2 }, style]}>
      {p > 0 && <View style={{ width: `${p * 100}%`, height: '100%', backgroundColor: color ?? r.akzent, borderRadius: h / 2 }} />}
    </View>
  );
}

/** Runder Hinweis-Punkt („NEU“, „+50 %“); `\n` im Text macht eine zweite Zeile */
export function Burst({
  label,
  size = 54,
  color = colors.yellow,
}: {
  label: string;
  size?: number;
  color?: string;
  rotate?: number;
}) {
  const longest = Math.max(...label.split('\n').map((l) => l.length));
  const fontSize = Math.min(size * 0.24, (size * 0.74) / (longest * 0.58));
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[styles.burstText, { fontSize, lineHeight: fontSize * 1.1, color: onColor(color) }]}>{label}</Text>
    </View>
  );
}

/** Gelb-rotes Schachbrettband wie am Rettungswagen */
export function CheckerStrip({ height = 16, a = colors.yellow, b = colors.red }: { height?: number; a?: string; b?: string }) {
  const s = height / 2;
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Svg width="100%" height={height}>
        <Defs>
          <Pattern id="checker" width={s * 2} height={height} patternUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={s} height={s} fill={a} />
            <Rect x={s} y={0} width={s} height={s} fill={b} />
            <Rect x={0} y={s} width={s} height={s} fill={b} />
            <Rect x={s} y={s} width={s} height={s} fill={a} />
          </Pattern>
        </Defs>
        <Rect width="100%" height={height} fill="url(#checker)" />
      </Svg>
    </View>
  );
}

/** Blinkende Leuchte (z. B. „einsatzbereit“) */
export function Led({ color = colors.mint, size = 9 }: { color?: string; size?: number }) {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 0.2, duration: 650, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(a, { toValue: 1, duration: 650, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);
  return <Animated.View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: a }} />;
}

/** Zeile einer Liste: Symbol, Titel, Untertitel, Pfeil */
export function ListRow({
  icon,
  color,
  title,
  sub,
  value,
  onPress,
}: {
  icon: string;
  color: string;
  title: string;
  sub?: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Tap onPress={onPress} accessibilityLabel={title} style={styles.row}>
      <IconTile icon={icon} color={color} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={type.headline}>{title}</Text>
        {sub ? <Text style={type.small}>{sub}</Text> : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Chevron size={14} dir="right" color={colors.grau300} />
    </Tap>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  status: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 4 },
  btn: { borderRadius: 12, minHeight: 50, justifyContent: 'center' },
  btnInner: { paddingVertical: 12, paddingHorizontal: spacing.lg, alignItems: 'center' },
  btnLabel: { fontSize: 16, lineHeight: 21, fontFamily: fonts.semibold },
  btnSub: { fontFamily: fonts.medium, fontSize: 12, marginTop: 2, opacity: 0.85 },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topKicker: { ...type.eyebrow, marginBottom: 1 },
  topTitle: { color: colors.ink, fontSize: 21, lineHeight: 26, fontFamily: fonts.bold, letterSpacing: -0.3 },
  statChip: { alignItems: 'center', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  statValue: { color: colors.ink, fontFamily: fonts.bold, fontSize: 17, lineHeight: 21 },
  statLabel: { color: colors.muted, fontFamily: fonts.medium, fontSize: 10, letterSpacing: 0.3 },
  iconTile: { alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', gap: 2, backgroundColor: colors.line, borderRadius: 10, padding: 2 },
  segItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
  segActive: { backgroundColor: colors.surface2 },
  segLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  pill: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  pillText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 15 },
  bar: { overflow: 'hidden' },
  burstText: { fontFamily: fonts.bold, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
});
