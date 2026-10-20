import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { useLayout } from '../layout';
import { TileTint, colors, fonts, tiles } from '../theme';
import { Tap } from './UI';

/**
 * Bento-Raster: Kacheln in verschiedenen Größen, mit weichen Ecken und je einer Farbwelt.
 * Handy: 2 Spalten, Tablet/PC: 4 Spalten.
 */
export type TileSize = 'third' | 'sm' | 'half' | 'md' | 'lg';

const GAP = 12;

export function BentoGrid({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -GAP / 2 }, style]}>{children}</View>;
}

/** sm = ¼ (Handy ½), half = ½, md = ½ (Handy ganz), lg = ganz */
const widthFor = (size: TileSize, wide: boolean): `${number}%` => {
  if (size === 'lg') return '100%';
  if (size === 'third') return '33.3333%';
  if (size === 'half') return '50%';
  if (size === 'md') return wide ? '50%' : '100%';
  return wide ? '25%' : '50%';
};

export function Tile({
  size = 'md',
  tint = 'slate',
  bg,
  onPress,
  disabled,
  accessibilityLabel,
  children,
  style,
  ecg,
  paper,
  ecgOpacity,
  ecgOben,
}: {
  size?: TileSize;
  tint?: TileTint;
  /** Eigener Hintergrund (statt der Farbwelt) */
  bg?: string;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Dezente EKG-Linie unten in der Kachel */
  ecg?: boolean;
  /** EKG-Papier (Raster) mit Herzschlag als Hintergrund */
  paper?: boolean;
  /** Deckkraft der Herzschlag-Linie auf dem EKG-Papier */
  ecgOpacity?: number;
  /** Herzschlag-Linie oben neben dem Titel statt unten */
  ecgOben?: boolean;
}) {
  const { wide } = useLayout();
  const t = tiles[tint];
  // Sanftes Einblenden beim Erscheinen
  const ein = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(ein, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [ein]);
  const inner = (
    <View style={[styles.tile, { backgroundColor: bg ?? t.bg, borderColor: bg ? colors.line : t.edge }, style]}>
      {paper && <EcgPaper color={t.accent} opacity={ecgOpacity} oben={ecgOben} />}
      {ecg && (
        <View style={styles.ecg} pointerEvents="none">
          <Ecg width={220} height={44} color={t.accent} opacity={0.35} />
        </View>
      )}
      {children}
    </View>
  );
  return (
    <Animated.View
      style={{
        width: widthFor(size, wide),
        padding: GAP / 2,
        opacity: ein,
        transform: [{ translateY: ein.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      }}
    >
      {onPress ? (
        <Tap onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel} style={{ flex: 1 }}>
          {inner}
        </Tap>
      ) : (
        inner
      )}
    </Animated.View>
  );
}

/** EKG-Papier: feines Raster mit einer Herzschlag-Linie, als Hintergrund einer Kachel */
export function EcgPaper({ color = '#5EEAD4', opacity = 0.9, oben }: { color?: string; opacity?: number; oben?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="ecg-minor" width={14} height={14} patternUnits="userSpaceOnUse">
            <Path d="M14 0 H0 V14" stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" />
          </Pattern>
          <Pattern id="ecg-major" width={70} height={70} patternUnits="userSpaceOnUse">
            <Path d="M70 0 H0 V70" stroke="rgba(255,255,255,0.11)" strokeWidth={1} fill="none" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#ecg-minor)" />
        <Rect width="100%" height="100%" fill="url(#ecg-major)" />
      </Svg>
      <View style={{ position: 'absolute', right: oben ? 84 : -6, ...(oben ? { top: 18 } : { bottom: 10 }) }}>
        <Ecg width={oben ? 150 : 250} height={oben ? 32 : 50} color={color} opacity={opacity} strokeWidth={2.4} />
      </View>
    </View>
  );
}

/** Kleines Etikett mit rundem Symbol, wie die Beschriftung auf einem Messgerät */
export function TileLabel({ icon, text, tint = 'slate' }: { icon?: string; text: string; tint?: TileTint }) {
  const t = tiles[tint];
  return (
    <View style={styles.label}>
      {icon ? (
        <View style={[styles.labelIcon, { backgroundColor: colors.veil }]}>
          <Text style={styles.labelEmoji}>{icon}</Text>
        </View>
      ) : null}
      <Text style={[styles.labelText, { color: t.accent }]}>{text}</Text>
    </View>
  );
}

/** Große Zahl wie auf dem Patientenmonitor, mit kleiner Einheit */
export function BigNumber({
  value,
  unit,
  color = colors.ink,
  size = 34,
}: {
  value: string;
  unit?: string;
  color?: string;
  size?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
      <Text
        style={{ fontFamily: fonts.displayBlack, fontSize: size, lineHeight: size * 1.08, color, letterSpacing: -1 }}
        numberOfLines={1}
      >
        {value}
      </Text>
      {unit ? <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.muted }}>{unit}</Text> : null}
    </View>
  );
}

/** Herzschlag-Linie (EKG) als Verzierung */
export function Ecg({
  width = 160,
  height = 36,
  color = colors.tuerkis,
  opacity = 1,
  strokeWidth = 2,
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 44" opacity={opacity}>
      <Path
        d="M0 24 H44 L52 24 L58 10 L66 38 L73 4 L80 30 L86 24 H128 L136 24 L142 14 L149 34 L155 24 H220"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Ring-Fortschritt (0–1) mit Inhalt in der Mitte */
export function Ring({
  pct,
  size = 72,
  stroke = 8,
  color = colors.tuerkis,
  track = colors.track,
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  /** Farbe des leeren Rings */
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
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
      </Svg>
      {children}
    </View>
  );
}

/** Dein Weg: Kapitel als Stationen auf einer Herzschlag-Linie (wie der Lernpfad bei Duolingo, aber medizinisch) */
export function ChapterPath({ total, current, accent = colors.tuerkis }: { total: number; current: number; accent?: string }) {
  const count = Math.min(7, total);
  const start = Math.max(0, Math.min(total - count, current - 2));
  const nodes = Array.from({ length: count }, (_, i) => start + i);
  const W = 100 / count;
  return (
    <View style={{ height: 54, justifyContent: 'center' }}>
      <Svg width="100%" height={54} style={{ position: 'absolute' }} viewBox="0 0 100 54" preserveAspectRatio="none">
        <Path
          d={`M0 27 ${nodes.map((_, i) => `L${W * i + W * 0.5 - 2.4} 27 L${W * i + W * 0.5 - 1.2} 17 L${W * i + W * 0.5} 37 L${W * i + W * 0.5 + 1.2} 22 L${W * i + W * 0.5 + 2.4} 27`).join(' ')} L100 27`}
          stroke={colors.track}
          strokeWidth={1.6}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
      <View style={{ flexDirection: 'row' }}>
        {nodes.map((n) => {
          const done = n < current;
          const now = n === current;
          return (
            <View key={n} style={{ width: `${W}%`, alignItems: 'center' }}>
              <View
                style={{
                  width: now ? 38 : 30,
                  height: now ? 38 : 30,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: done ? accent : now ? colors.surface : colors.track,
                  borderWidth: now ? 3 : 0,
                  borderColor: accent,
                  borderBottomWidth: done || now ? 4 : 0,
                  borderBottomColor: done || now ? 'rgba(0,0,0,0.25)' : 'transparent',
                }}
              >
                <Text style={{ fontFamily: fonts.displayBlack, fontSize: now ? 14 : 12, color: done ? '#fff' : now ? accent : colors.muted }}>{done ? '✓' : n + 1}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Überschrift zwischen Bento-Gruppen */
export function BentoTitle({ children, right }: { children: string; right?: ReactNode }) {
  return (
    <View style={styles.title}>
      <View style={styles.titleDot} />
      <Text style={styles.titleText}>{children}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: 26, borderWidth: 1, padding: 16, overflow: 'hidden', gap: 8 },
  ecg: { position: 'absolute', right: -10, bottom: 8 },
  label: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  labelEmoji: { fontSize: 13, fontFamily: fonts.regular },
  labelText: { fontFamily: fonts.semibold, fontSize: 11.5, letterSpacing: 0.9, textTransform: 'uppercase' },
  title: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: GAP / 2,
    paddingTop: 10,
    paddingBottom: 2,
  },
  titleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.tuerkis },
  titleText: { flex: 1, fontFamily: fonts.display, fontSize: 15, color: colors.inkSoft, letterSpacing: -0.1 },
});
