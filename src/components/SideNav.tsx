import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { euro } from '../game/equipment';
import { useRolle } from '../game/rolle';
import { rankFor, rankList } from '../game/scoring';
import { Bereich, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { trainingsFuer } from '../game/trainings';
import { SIDEBAR_WIDTH } from '../layout';
import { colors, fonts, spacing, type } from '../theme';
import { RankBadge, StarOfLife } from './Ems';
import { Bar } from './UI';

export type NavTarget =
  | 'home'
  | 'start'
  | 'garage'
  | 'wache'
  | 'detektiv'
  | 'schritte'
  | 'notruf'
  | 'zuerst'
  | 'pack'
  | 'manv'
  | 'cpr'
  | 'wissen'
  | 'quiz'
  | 'lexikon'
  | 'guide';

/** Feste Seitenleiste für große Bildschirme (PC, Mac, iPad quer) */
export function SideNav({
  progress,
  active,
  onNavigate,
}: {
  progress: Progress;
  active: NavTarget | null;
  onNavigate: (t: NavTarget) => void;
}) {
  const r = useRolle();
  const { rank, next } = rankFor(progress.totalPoints);
  const pct = next ? (progress.totalPoints - rank.min) / (next.min - rank.min) : 1;
  const items: { id: NavTarget; icon: string; label: string; group?: string; bereich?: Bereich }[] = [
    { id: 'home', icon: '🏠', label: 'Start' },
    { id: 'garage', icon: r.id === 'helfer' ? '🚗' : '🚑', label: r.fahrzeug, bereich: 'garage' },
    ...(r.id === 'sani' ? [{ id: 'wache' as NavTarget, icon: '🏥', label: 'Meine Wache' }] : []),
    ...trainingsFuer(r.id, progress).map((t, i) => ({
      id: t.id as NavTarget,
      icon: t.icon,
      label: t.title,
      group: i === 0 ? 'Training' : undefined,
      bereich: t.id,
    })),
    { id: 'lexikon', icon: '📖', label: 'Lexikon', group: 'Nachschlagen' },
    { id: 'guide', icon: '⚙️', label: 'Mehr' },
  ];
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <StarOfLife size={28} color={colors.red} />
          <View>
            <Text style={styles.brandTitle}>Einsatz 112</Text>
            <Text style={[styles.brandSub, { color: r.akzentDunkel }]}>
              {r.icon} {r.titel}
            </Text>
          </View>
        </View>

        <View style={styles.profile}>
          <RankBadge size={42} level={rankList().indexOf(rank)} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Text style={styles.profileRank} numberOfLines={2}>
              {rank.de}
            </Text>
            <Bar pct={pct} height={6} />
            <Text style={type.small}>
              {progress.totalPoints.toLocaleString('de-DE')} Punkte · {euro(progress.budget)}
            </Text>
          </View>
        </View>

        <View style={{ gap: 2 }}>
          {items.map((it) => {
            const frei = !it.bereich || istFrei(r.id, progress, it.bereich);
            const on = active === it.id;
            return (
              <View key={it.id}>
                {it.group && <Text style={styles.group}>{it.group}</Text>}
                <Pressable
                  onPress={frei ? () => onNavigate(it.id) : undefined}
                  disabled={!frei}
                  accessibilityRole="button"
                  accessibilityLabel={it.label}
                  style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
                    styles.item,
                    hovered && frei && styles.itemHover,
                    on && { backgroundColor: r.akzentTint },
                  ]}
                >
                  <Text style={[styles.itemIcon, !frei && { opacity: 0.35 }]}>{it.icon}</Text>
                  <Text
                    style={[
                      styles.itemLabel,
                      on && { color: r.akzentDunkel, fontFamily: fonts.semibold },
                      !frei && { color: colors.grau300 },
                    ]}
                    numberOfLines={1}
                  >
                    {it.label}
                  </Text>
                  {!frei && <Text style={styles.lock}>🔒</Text>}
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <Text style={styles.footer}>Lernspiel – ersetzt keine Ausbildung. Im Notfall: 112.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: SIDEBAR_WIDTH, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.line },
  content: { padding: spacing.lg, gap: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xs },
  brandTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  brandSub: { fontFamily: fonts.medium, fontSize: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.paper, borderRadius: 12, padding: spacing.md },
  profileRank: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  group: { ...type.eyebrow, marginTop: spacing.md, marginBottom: 4, marginLeft: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 8, paddingHorizontal: spacing.sm, borderRadius: 8 },
  itemHover: { backgroundColor: colors.paper },
  itemIcon: { fontSize: 16, width: 22, textAlign: 'center', fontFamily: fonts.regular },
  itemLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  lock: { fontSize: 11, fontFamily: fonts.regular },
  footer: { ...type.small, fontSize: 11, padding: spacing.lg, paddingTop: spacing.sm },
});
