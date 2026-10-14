import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { euro } from '../game/equipment';
import { dayState } from '../game/daily';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { SIDEBAR_WIDTH } from '../layout';
import { colors, fonts, spacing } from '../theme';
import { RankBadge, ReflexStripes, StarOfLife } from './Ems';

export type NavTarget = 'home' | 'start' | 'garage' | 'manv' | 'cpr' | 'wissen' | 'quiz' | 'lexikon' | 'guide';

const ITEMS: { id: NavTarget; icon: string; label: string; group?: string }[] = [
  { id: 'home', icon: '🏠', label: 'Startseite' },
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
          <ReflexStripes height={5} />
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
                <Text style={[styles.itemLabel, active === it.id && { color: colors.weiss }]}>{it.label}</Text>
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
  root: { width: SIDEBAR_WIDTH, backgroundColor: colors.graphit, borderRightWidth: 1, borderRightColor: '#262B31' },
  content: { padding: spacing.lg, gap: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xs },
  brandTitle: { fontFamily: fonts.displayBlack, fontSize: 26, lineHeight: 28, color: colors.weiss, textTransform: 'uppercase' },
  brandSub: { fontFamily: fonts.semibold, fontSize: 11, color: colors.grau300, letterSpacing: 0.5 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#1D2228',
    borderRadius: 8,
    padding: spacing.md,
  },
  profileKicker: { fontFamily: fonts.extrabold, fontSize: 9, letterSpacing: 1.4, color: colors.signalrot, textTransform: 'uppercase' },
  profileRank: { fontFamily: fonts.displayBlack, fontSize: 15, lineHeight: 17, color: colors.weiss, textTransform: 'uppercase' },
  bar: { height: 4, backgroundColor: '#3A4048', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: colors.signalrot },
  kpis: { flexDirection: 'row', gap: spacing.xs },
  kpi: { flex: 1, backgroundColor: '#1D2228', borderRadius: 6, paddingVertical: spacing.sm, alignItems: 'center' },
  kpiValue: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.warngelb },
  kpiLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.grau300, letterSpacing: 0.8, textTransform: 'uppercase' },
  start: { backgroundColor: colors.signalrot, borderRadius: 6, overflow: 'hidden' },
  startText: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.weiss,
    textAlign: 'center',
    paddingVertical: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  group: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.grau500,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: 4,
    marginLeft: spacing.sm,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 9, paddingHorizontal: spacing.sm, borderRadius: 6 },
  itemHover: { backgroundColor: '#1D2228' },
  itemActive: { backgroundColor: '#262B31', borderLeftWidth: 3, borderLeftColor: colors.signalrot },
  itemIcon: { fontFamily: fonts.regular, fontSize: 16, width: 22, textAlign: 'center' },
  itemLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.grau200 },
  footer: { fontFamily: fonts.regular, fontSize: 11, color: colors.grau500, padding: spacing.lg, paddingTop: spacing.sm },
});
