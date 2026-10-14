import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
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

export function TabIcon({ id, color, size = 26 }: { id: TabId; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 2.6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
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
      {id === 'garage' && (
        <>
          <Path d="M3 19.5 V9.5 a2 2 0 0 1 2 -2 H16 L21 12.5 H23 a2 2 0 0 1 2 2 V19.5 Z" {...p} />
          <Path d="M10.5 10 V15.5 M7.75 12.75 H13.25" {...p} />
          <Circle cx={8} cy={20.5} r={2.4} {...p} fill={color === colors.white ? colors.ink : colors.yellow} />
          <Circle cx={20} cy={20.5} r={2.4} {...p} fill={color === colors.white ? colors.ink : colors.yellow} />
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

/** Schwebende Tinten-Leiste: Der aktive Bereich zeigt sich als gelbe Pille mit Namen. */
export function TabBar({
  active,
  onSelect,
  badge,
}: {
  active: TabId | null;
  onSelect: (t: TabId) => void;
  badge?: Partial<Record<TabId, boolean>>;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar} accessibilityRole="tablist">
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => onSelect(t.id)}
              accessibilityRole="tab"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: on }}
              style={[styles.tab, on ? styles.tabOn : styles.tabOff]}
            >
              <View>
                <TabIcon id={t.id} color={on ? colors.ink : colors.white} />
                {badge?.[t.id] && !on && <View style={styles.dot} />}
              </View>
              {on && (
                <Text style={styles.label} numberOfLines={1}>
                  {t.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 10 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.ink,
    borderRadius: 34,
    padding: 6,
    ...(Platform.OS === 'web' ? ({ boxShadow: '0px 4px 0px rgba(20,23,58,0.28)' } as object) : null),
  },
  tab: { height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tabOn: { flexGrow: 2.1, flexShrink: 0, flexBasis: 0, backgroundColor: colors.yellow, paddingHorizontal: 10 },
  tabOff: { flex: 1 },
  label: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.ink, letterSpacing: -0.3 },
  dot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.ink,
  },
});
