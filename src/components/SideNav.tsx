import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { euro } from '../game/equipment';
import { dayState } from '../game/daily';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { SIDEBAR_WIDTH } from '../layout';
import { colors, fonts, shadow, spacing } from '../theme';
import { RankBadge, StarOfLife } from './Ems';

export type NavTarget = 'home' | 'start' | 'garage' | 'manv' | 'cpr' | 'wissen' | 'quiz' | 'lexikon' | 'guide';

const ITEMS: { id: NavTarget; icon: string; label: string; group?: string }[] = [
  { id: 'home', icon: '🏠', label: 'Heute' },
  { id: 'garage', icon: '🚑', label: 'Mein Rettungswagen' },
  { id: 'manv', icon: '🚨', label: 'Großeinsatz', group: 'Training' },
  { id: 'cpr', icon: '❤️', label: 'Herzdruckmassage' },
  { id: 'wissen', icon: '🧠', label: 'Wissensfragen' },
  { id: 'quiz', icon: '📈', label: 'Normwerte' },
  { id: 'lexikon', icon: '📖', label: 'Lexikon', group: 'Nachschlagen' },
  { id: 'guide', icon: 'ℹ️', label: 'Anleitung' },
];

/** Feste Seitenleiste für große Bildschirme (PC, Mac, iPad quer). */
export function SideNav({
  progress,
  active,
  onNavigate,
}: {
  progress: Progress;
  active: NavTarget | null;
  onNavigate: (t: NavTarget) => void;
}) {
  const { rank, next } = rankFor(progress.totalPoints);
  const pct = next ? Math.min(1, (progress.totalPoints - rank.min) / (next.min - rank.min)) : 1;
  const day = dayState(progress);
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <StarOfLife size={34} />
          <View>
            <Text style={styles.brandTitle}>Einsatz 112</Text>
            <Text style={styles.brandSub}>Rettungsdienst-Lernspiel</Text>
          </View>
        </View>

        <View style={styles.profile}>
          <RankBadge size={64} level={RANKS.indexOf(rank)} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.profileKicker}>Mein Dienstgrad</Text>
            <Text style={styles.profileRank} numberOfLines={2}>
              {rank.de}
            </Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
            </View>
          </View>
        </View>
        <View style={styles.kpis}>
          <Kpi value={String(progress.totalPoints)} label="Punkte" />
          <Kpi value={euro(progress.budget)} label="Budget" />
          <Kpi value={`${day.streak}`} label="Tage" />
        </View>

        <Pressable
          onPress={() => onNavigate('start')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.start, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.startText}>Schicht beginnen</Text>
        </Pressable>

        <View style={{ gap: 2 }}>
          {ITEMS.map((it) => (
            <View key={it.id}>
              {it.group && <Text style={styles.group}>{it.group}</Text>}
              <Pressable
                onPress={() => onNavigate(it.id)}
                accessibilityRole="button"
                style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
                  styles.item,
                  (hovered || pressed) && styles.itemHover,
                  active === it.id && styles.itemActive,
                ]}
              >
                <Text style={styles.itemIcon}>{it.icon}</Text>
                <Text style={[styles.itemLabel, active === it.id && { color: colors.weiss, fontFamily: fonts.semibold }]}>
                  {it.label}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.footer}>Lernspiel – ersetzt keine Ausbildung. Im Notfall: 112.</Text>
    </View>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Seitenleiste im Stil von iPadOS/macOS: helles Grau, ausgewähltes Element als farbige Fläche
  root: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#F7F7FA',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.grau300,
  },
  content: { padding: spacing.lg, gap: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xs },
  brandTitle: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 26, color: colors.graphit, letterSpacing: -0.4 },
  brandSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.grau500 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.weiss,
    borderRadius: 16,
    padding: spacing.md,
    ...shadow,
  },
  profileKicker: { fontFamily: fonts.medium, fontSize: 12, color: colors.grau500 },
  profileRank: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 19, color: colors.graphit, letterSpacing: -0.2 },
  bar: { height: 5, backgroundColor: colors.grau200, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: colors.blaulicht, borderRadius: 3 },
  kpis: { flexDirection: 'row', gap: spacing.xs },
  kpi: { flex: 1, backgroundColor: colors.weiss, borderRadius: 12, paddingVertical: spacing.sm, alignItems: 'center', ...shadow },
  kpiValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.graphit, letterSpacing: -0.3 },
  kpiLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.grau500 },
  start: { backgroundColor: colors.signalrot, borderRadius: 14, overflow: 'hidden' },
  startText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.weiss,
    textAlign: 'center',
    paddingVertical: 13,
  },
  group: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.grau500,
    marginTop: spacing.md,
    marginBottom: 4,
    marginLeft: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
  },
  itemHover: { backgroundColor: colors.grau200 },
  itemActive: { backgroundColor: colors.signalrot },
  itemIcon: { fontFamily: fonts.regular, fontSize: 16, width: 22, textAlign: 'center' },
  itemLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.graphit },
  footer: { fontFamily: fonts.regular, fontSize: 11, color: colors.grau500, padding: spacing.lg, paddingTop: spacing.sm },
});
