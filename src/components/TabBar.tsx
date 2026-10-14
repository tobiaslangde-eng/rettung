import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../theme';

/** Hauptbereiche der App – auf dem Handy als Tab-Leiste unten (wie bei iOS-Apps üblich). */
export type TabId = 'home' | 'training' | 'garage' | 'lexikon' | 'guide';

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Heute' },
  { id: 'training', label: 'Training' },
  { id: 'garage', label: 'Fahrzeug' },
  { id: 'lexikon', label: 'Lexikon' },
  { id: 'guide', label: 'Mehr' },
];

export function TabIcon({ id, color, size = 26 }: { id: TabId; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      {id === 'home' && (
        <>
          <Path d="M4 13 L14 4.5 L24 13" {...p} />
          <Path d="M7 11 V23 H21 V11" {...p} />
          <Path d="M12 23 V17 H16 V23" {...p} />
        </>
      )}
      {id === 'training' && <Path d="M3 15 H8 L10.5 9 L14 21 L17.5 6 L20 15 H25" {...p} />}
      {id === 'garage' && (
        <>
          <Path d="M3 19 V9 a2 2 0 0 1 2 -2 H16 L21 12 H23 a2 2 0 0 1 2 2 V19 Z" {...p} />
          <Path d="M10.5 10 V15 M8 12.5 H13" {...p} />
          <Circle cx={8} cy={20} r={2.4} {...p} fill={colors.weiss} />
          <Circle cx={20} cy={20} r={2.4} {...p} fill={colors.weiss} />
        </>
      )}
      {id === 'lexikon' && (
        <>
          <Path d="M14 7 C11 5 7 5 4 6 V22 C7 21 11 21 14 23 C17 21 21 21 24 22 V6 C21 5 17 5 14 7 Z" {...p} />
          <Path d="M14 7 V23" {...p} />
        </>
      )}
      {id === 'guide' && (
        <>
          <Rect x={4} y={4} width={20} height={20} rx={6} {...p} />
          <Circle cx={9.5} cy={14} r={1.4} fill={color} />
          <Circle cx={14} cy={14} r={1.4} fill={color} />
          <Circle cx={18.5} cy={14} r={1.4} fill={color} />
        </>
      )}
    </Svg>
  );
}

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
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map((t) => {
        const on = active === t.id;
        const color = on ? colors.signalrot : '#8E8E93';
        return (
          <Pressable
            key={t.id}
            onPress={() => onSelect(t.id)}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: on }}
            style={styles.tab}
          >
            <View>
              <TabIcon id={t.id} color={color} />
              {badge?.[t.id] && <View style={styles.dot} />}
            </View>
            <Text style={[styles.label, { color }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'web' ? 'rgba(249,249,251,0.94)' : '#F9F9FB',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    paddingTop: 6,
    paddingBottom: 4,
    // Milchglas-Effekt (nur Web)
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'saturate(180%) blur(20px)' } as object) : null),
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 44 },
  label: { fontFamily: fonts.medium, fontSize: 10.5, letterSpacing: 0.1 },
  dot: {
    position: 'absolute',
    top: -1,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.signalrot,
    borderWidth: 1.5,
    borderColor: '#F9F9FB',
  },
});
