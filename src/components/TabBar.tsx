import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRolle } from '../game/rolle';
import { colors, fonts } from '../theme';

/** Hauptbereiche der App – auf dem Handy als schwebende Leiste unten */
export type TabId = 'home' | 'training' | 'garage' | 'lexikon' | 'guide';

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Start' },
  { id: 'training', label: 'Training' },
  { id: 'garage', label: 'Fahrzeug' },
  { id: 'lexikon', label: 'Lexikon' },
  { id: 'guide', label: 'Mehr' },
];

export function TabIcon({ id, color, size = 26, auto }: { id: TabId; color: string; size?: number; auto?: boolean }) {
  const p = { stroke: color, strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      {id === 'home' && (
        // Star of Life
        <>
          <Path d="M14 3.5 V24.5" {...p} />
          <Path d="M4.9 8.75 L23.1 19.25" {...p} />
          <Path d="M4.9 19.25 L23.1 8.75" {...p} />
        </>
      )}
      {id === 'training' && <Path d="M2.5 15 H8 L10.5 8.5 L14 21 L17.5 5.5 L20 15 H25.5" {...p} />}
      {id === 'garage' && auto && (
        <>
          <Path d="M3.5 18.5 V14.5 L6.5 9.5 H19 L23 14 H24.5 V18.5 Z" {...p} />
          <Path d="M9 9.5 V14 M15.5 9.5 V14" {...p} />
          <Circle cx={8.5} cy={19.5} r={2.4} {...p} fill={colors.white} />
          <Circle cx={19.5} cy={19.5} r={2.4} {...p} fill={colors.white} />
        </>
      )}
      {id === 'garage' && !auto && (
        <>
          <Path d="M3 19.5 V9.5 a2 2 0 0 1 2 -2 H16 L21 12.5 H23 a2 2 0 0 1 2 2 V19.5 Z" {...p} />
          <Path d="M10.5 10 V15.5 M7.75 12.75 H13.25" {...p} />
          <Circle cx={8} cy={20.5} r={2.4} {...p} fill={colors.white} />
          <Circle cx={20} cy={20.5} r={2.4} {...p} fill={colors.white} />
        </>
      )}
      {id === 'lexikon' && (
        <>
          <Path d="M14 7 C11 5 7 5 3.5 6 V22 C7 21 11 21 14 23 C17 21 21 21 24.5 22 V6 C21 5 17 5 14 7 Z" {...p} />
          <Path d="M14 7 V23" {...p} />
        </>
      )}
      {id === 'guide' && (
        <>
          <Circle cx={6} cy={14} r={2.1} fill={color} />
          <Circle cx={14} cy={14} r={2.1} fill={color} />
          <Circle cx={22} cy={14} r={2.1} fill={color} />
        </>
      )}
    </Svg>
  );
}

/** Klassische Leiste unten: Symbol und Name, der aktive Bereich in der Farbe der Rolle */
export function TabBar({
  active,
  onSelect,
  badge,
}: {
  active: TabId | null;
  onSelect: (t: TabId) => void;
  badge?: Partial<Record<TabId, boolean>>;
}) {
  const r = useRolle();
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map((t) => {
        const on = active === t.id;
        const color = on ? r.akzent : colors.muted;
        const label = t.id === 'garage' ? r.fahrzeugKurz : t.label;
        return (
          <Pressable
            key={t.id}
            onPress={() => onSelect(t.id)}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: on }}
            style={styles.tab}
          >
            <View>
              <TabIcon id={t.id} color={color} size={24} auto={r.id === 'helfer'} />
              {badge?.[t.id] && !on && <View style={styles.dot} />}
            </View>
            <Text style={[styles.label, { color }, on && { fontFamily: fonts.semibold }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
    paddingBottom: 4,
    ...(Platform.OS === 'web' ? ({} as object) : null),
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 2 },
  label: { fontFamily: fonts.medium, fontSize: 11 },
  dot: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
