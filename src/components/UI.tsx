import { ReactNode } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts, radius, shadow, spacing, type } from '../theme';

export { WarnStripes } from './Ems';

/** Abschnittsüberschrift wie in iOS-Listen */
export function Eyebrow({ title }: { title: string }) {
  return <Text style={type.eyebrow}>{title}</Text>;
}

/** Große Abschnittsüberschrift (wie „Heute“ im App Store) mit optionalem Zusatz rechts */
export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={type.h2}>{title}</Text>
      {right}
    </View>
  );
}

/**
 * Weiße Karte mit großer Rundung und leichtem Schatten. Ein Statuston (`borderLeftColor`, z. B. Grün/Rot)
 * wird als schmaler farbiger Balken oben gezeigt.
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

type BtnVariant = 'primary' | 'dark' | 'outline' | 'alarm' | 'tinted';

/** Knopf im iOS-Stil: 50 pt hoch, weich gerundet, klarer Text in normaler Schreibweise */
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
    tinted: colors.blaulichtLight,
  }[variant];
  const fg = variant === 'outline' ? colors.graphit : variant === 'tinted' ? colors.blaulicht : colors.weiss;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        variant === 'outline' && { borderWidth: 1, borderColor: colors.grau200 },
        style,
      ]}
    >
      <View style={styles.btnInner}>
        <Text style={[styles.btnLabel, { color: fg }]}>{label}</Text>
        {sub ? <Text style={[styles.btnSub, { color: fg }]}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

/** Navigationsleiste im iOS-Stil: „‹ Zurück“ in Blau, darunter ein großer Titel */
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
      {(onBack || right) && (
        <View style={styles.topRow}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Zurück"
              style={styles.backBtn}
            >
              <Chevron color={colors.blaulicht} />
              <Text style={styles.backText}>Zurück</Text>
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}
      <Text style={styles.topKicker}>{kicker}</Text>
      <Text style={styles.topTitle} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

function Chevron({ color, size = 18, dir = 'left' }: { color: string; size?: number; dir?: 'left' | 'right' }) {
  return (
    <Svg width={size * 0.6} height={size} viewBox="0 0 12 20">
      <Path
        d={dir === 'left' ? 'M10 2 L2 10 L10 18' : 'M2 2 L10 10 L2 18'}
        stroke={color}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Farbiges Symbol im abgerundeten Quadrat – wie die Symbole in den iOS-Einstellungen */
export function IconTile({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size * 0.27, backgroundColor: color }]}>
      <Text style={{ fontSize: size * 0.5, lineHeight: size * 0.62, fontFamily: fonts.regular }}>{icon}</Text>
    </View>
  );
}

/** Zeile einer iOS-Liste: Symbol, Titel, Untertitel, Pfeil */
export function ListRow({
  icon,
  color,
  title,
  sub,
  value,
  onPress,
  last,
}: {
  icon: string;
  color: string;
  title: string;
  sub?: string;
  value?: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.grau200 }]}
    >
      <IconTile icon={icon} color={color} size={34} />
      <View style={[styles.rowBody, !last && styles.rowRule]}>
        <View style={{ flex: 1 }}>
          <Text style={type.headline}>{title}</Text>
          {sub ? <Text style={type.small}>{sub}</Text> : null}
        </View>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Chevron color={colors.grau300} size={14} dir="right" />
      </View>
    </Pressable>
  );
}

/** Weiße Gruppe für Listenzeilen (iOS „inset grouped“) */
export function Group({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

/** Fortschrittsring wie bei Apple Fitness */
export function Ring({
  size,
  stroke,
  pct,
  color,
  track,
}: {
  size: number;
  stroke: number;
  pct: number;
  color: string;
  track?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill as object}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={track ?? color + '33'} strokeWidth={stroke} fill="none" />
      {p > 0 && (
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * p} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
    </Svg>
  );
}

/** Segmentierte Auswahl wie bei iOS */
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
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={[styles.segItem, active && styles.segActive]}
          >
            <Text style={[styles.segLabel, active && { fontFamily: fonts.semibold, color: colors.graphit }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Kleines Etikett (z. B. „Neu“, „+50 %“) */
export function Pill({ label, color = colors.signalrot, light }: { label: string; color?: string; light?: boolean }) {
  return (
    <View style={[styles.pill, { backgroundColor: light ? color + '22' : color }]}>
      <Text style={[styles.pillText, { color: light ? color : colors.weiss }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
  card: {
    backgroundColor: colors.weiss,
    borderRadius: radius.md,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadow,
  },
  status: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  btn: { borderRadius: 14, overflow: 'hidden', minHeight: 50, justifyContent: 'center' },
  btnInner: { paddingVertical: 14, paddingHorizontal: spacing.lg, alignItems: 'center' },
  btnLabel: { fontSize: 17, fontFamily: fonts.semibold, letterSpacing: -0.2 },
  btnSub: { fontFamily: fonts.medium, fontSize: 12, marginTop: 1, opacity: 0.8 },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: Platform.OS === 'web' ? 'rgba(242,242,247,0.92)' : colors.grau50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grau300,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: -2, minHeight: 36 },
  backText: { color: colors.blaulicht, fontSize: 17, fontFamily: fonts.regular },
  topKicker: { color: colors.grau500, fontSize: 13, fontFamily: fonts.semibold, marginTop: 2 },
  topTitle: { color: colors.graphit, fontSize: 28, lineHeight: 34, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  iconTile: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingLeft: spacing.lg, backgroundColor: colors.weiss },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    paddingRight: spacing.lg,
  },
  rowRule: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.grau300 },
  rowValue: { fontFamily: fonts.regular, fontSize: 15, color: colors.grau500 },
  group: { backgroundColor: colors.weiss, borderRadius: radius.md, overflow: 'hidden', ...shadow },
  seg: { flexDirection: 'row', backgroundColor: '#E3E3E8', borderRadius: 10, padding: 2 },
  segItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8 },
  segActive: {
    backgroundColor: colors.weiss,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.graphit },
  pill: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' },
  pillText: { fontFamily: fonts.semibold, fontSize: 12 },
});
