import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { colors, fonts, hardShadow, onColor, radius, spacing, type } from '../theme';

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

/**
 * Antippbarer Aufkleber: Beim Drücken sinkt die Karte in ihren harten Schatten (wie ein dicker Knopf),
 * am PC hebt sie sich beim Darüberfahren leicht an.
 */
export function Tap({
  onPress,
  style,
  children,
  offset = 4,
  shadowColor = colors.ink,
  disabled,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
}: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  offset?: number;
  /** Farbe des harten Schattens (auf dunklem Grund heller wählen) */
  shadowColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'radio' | 'tab' | 'checkbox';
  accessibilityState?: { selected?: boolean; checked?: boolean; disabled?: boolean };
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
        offset > 0 && !disabled
          ? {
              ...hardShadow(pressed ? 1 : hovered ? offset + 1 : offset, shadowColor),
              transform: [{ translateY: pressed ? offset - 1 : hovered ? -1 : 0 }],
            }
          : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

/**
 * Weiße Karte mit Tinten-Umrandung und hartem Schatten. Ein Statuston (`borderLeftColor`, z. B. Grün/Rot)
 * erscheint als farbiger Streifen oben an der Karte.
 */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { borderLeftColor, ...rest } = StyleSheet.flatten(style) ?? {};
  const tone = typeof borderLeftColor === 'string' ? borderLeftColor : undefined;
  return (
    <View style={[styles.card, rest]}>
      {tone && (
        <>
          <View style={[styles.status, { backgroundColor: tone }]} />
          <View style={styles.statusLine} />
        </>
      )}
      {children}
    </View>
  );
}

type BtnVariant = 'primary' | 'dark' | 'outline' | 'alarm' | 'tinted' | 'mint';

const BTN_BG: Record<BtnVariant, string> = {
  primary: colors.blue,
  dark: colors.ink,
  outline: colors.white,
  alarm: colors.red,
  tinted: colors.yellow,
  mint: colors.mint,
};

/** Dicker Knopf: Tinten-Umrandung, harter Schatten, sinkt beim Drücken */
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
  const bg = BTN_BG[variant];
  const fg = onColor(bg);
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.45 : 1 }, style]}
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
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Kopfzeile: runder Zurück-Knopf, Etikett und großer Titel */
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
          <Tap onPress={onBack} offset={3} accessibilityLabel="Zurück" style={styles.backBtn}>
            <Chevron />
          </Tap>
        ) : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.topKicker}>{kicker}</Text>
          <Text style={[styles.topTitle, !onBack && { fontSize: 30, lineHeight: 33 }]} numberOfLines={2}>
            {title}
          </Text>
        </View>
        {right}
      </View>
    </View>
  );
}

/** Kleine Wert-Anzeige oben rechts (Punkte, Minuten, richtige Antworten) */
export function StatChip({ value, label, color = colors.white }: { value: string | number; label: string; color?: string }) {
  return (
    <View style={[styles.statChip, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
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

/** Auswahl aus mehreren Möglichkeiten: Die gewählte Pille ist „eingedrückt“ und gelb. */
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
            offset={active ? 0 : 3}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: active }}
            style={[styles.segItem, active && styles.segActive]}
          >
            <Text style={[styles.segLabel, active && { fontFamily: fonts.displayBlack }]} numberOfLines={1}>
              {o.label}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/** Kleines Etikett (z. B. „Neu“, „+50 %“) mit Umrandung; `light` = weißer Grund mit farbigem Text */
export function Pill({ label, color = colors.red, light }: { label: string; color?: string; light?: boolean }) {
  const bg = light ? colors.white : color;
  const fg = light ? onColor(colors.white) : onColor(color);
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Dicker Fortschrittsbalken mit Umrandung */
export function Bar({
  pct,
  color = colors.blue,
  height = 14,
  track = colors.white,
  style,
}: {
  pct: number;
  color?: string;
  height?: number;
  track?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = Math.max(0, Math.min(1, pct));
  return (
    <View style={[styles.bar, { height, backgroundColor: track, borderRadius: height / 2 }, style]}>
      {p > 0 && <View style={{ width: `${p * 100}%`, height: '100%', backgroundColor: color, borderRadius: height / 2 }} />}
    </View>
  );
}

/** Sternenzacke als Aufkleber („NEU“, „+50 %“); `\n` im Text macht eine zweite Zeile */
export function Burst({
  label,
  size = 54,
  color = colors.yellow,
  rotate = -10,
}: {
  label: string;
  size?: number;
  color?: string;
  rotate?: number;
}) {
  const n = 12;
  const pts = Array.from({ length: n * 2 })
    .map((_, i) => {
      const r = i % 2 === 0 ? size / 2 - 1.5 : size / 2 - 6;
      const a = (Math.PI / n) * i;
      return `${(size / 2 + r * Math.cos(a)).toFixed(1)},${(size / 2 + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
  const longest = Math.max(...label.split('\n').map((l) => l.length));
  const fontSize = Math.min(size * 0.26, (size * 0.72) / (longest * 0.56));
  return (
    <View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: `${rotate}deg` }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill as object}>
        <Polygon points={pts} fill={color} stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" />
      </Svg>
      <Text style={[styles.burstText, { fontSize, lineHeight: fontSize * 1.05, color: onColor(color) }]}>{label}</Text>
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
    <Tap onPress={onPress} offset={3} accessibilityLabel={title} style={styles.row}>
      <IconTile icon={icon} color={color} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={type.headline}>{title}</Text>
        {sub ? <Text style={type.small}>{sub}</Text> : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Chevron size={16} dir="right" />
    </Tap>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: spacing.lg,
    overflow: 'hidden',
    ...hardShadow(4),
  },
  status: { position: 'absolute', top: 0, left: 0, right: 0, height: 8 },
  statusLine: { position: 'absolute', top: 8, left: 0, right: 0, height: 2, backgroundColor: colors.ink },
  btn: { borderRadius: 16, borderWidth: 2, borderColor: colors.ink, minHeight: 54, justifyContent: 'center' },
  btnInner: { paddingVertical: 12, paddingHorizontal: spacing.lg, alignItems: 'center' },
  btnLabel: { fontSize: 18, lineHeight: 22, fontFamily: fonts.displayBlack, letterSpacing: -0.3 },
  btnSub: { fontFamily: fonts.mono, fontSize: 10, marginTop: 2, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 46 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topKicker: { ...type.eyebrow, marginBottom: 1 },
  topTitle: { color: colors.ink, fontSize: 24, lineHeight: 27, fontFamily: fonts.displayBlack, letterSpacing: -0.7 },
  statChip: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    ...hardShadow(2),
  },
  statValue: { color: colors.ink, fontFamily: fonts.displayBlack, fontSize: 18, lineHeight: 21, letterSpacing: -0.4 },
  statLabel: { color: colors.muted, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase' },
  iconTile: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ink },
  seg: { flexDirection: 'row', gap: spacing.sm },
  segItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.pill,
  },
  segActive: { backgroundColor: colors.yellow, transform: [{ translateY: 3 }] },
  segLabel: { fontFamily: fonts.display, fontSize: 15, color: colors.ink, letterSpacing: -0.2 },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  pillText: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 15, letterSpacing: 0.6 },
  bar: { borderWidth: 2, borderColor: colors.ink, overflow: 'hidden' },
  burstText: { fontFamily: fonts.displayBlack, letterSpacing: -0.3, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowValue: { fontFamily: fonts.mono, fontSize: 13, color: colors.muted },
});
