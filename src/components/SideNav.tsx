import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dayState } from '../game/daily';
import { euro } from '../game/equipment';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { SIDEBAR_WIDTH } from '../layout';
import { colors, fonts, hardShadow, spacing, type } from '../theme';
import { RankBadge, StarOfLife } from './Ems';
import { Bar, Button } from './UI';

export type NavTarget = 'home' | 'start' | 'garage' | 'detektiv' | 'manv' | 'cpr' | 'wissen' | 'quiz' | 'lexikon' | 'guide';

const ITEMS: { id: NavTarget; icon: string; label: string; group?: string }[] = [
  { id: 'home', icon: '✱', label: 'Start' },
  { id: 'garage', icon: '🚑', label: 'Mein Rettungswagen' },
  { id: 'detektiv', icon: '🔍', label: 'Detektiv-Akten', group: 'Training' },
  { id: 'manv', icon: '🚨', label: 'Großeinsatz' },
  { id: 'cpr', icon: '❤️', label: 'Herzdruckmassage' },
  { id: 'wissen', icon: '🧠', label: 'Wissensfragen' },
  { id: 'quiz', icon: '📈', label: 'Normwerte' },
  { id: 'lexikon', icon: '📖', label: 'Lexikon', group: 'Nachschlagen' },
  { id: 'guide', icon: '⋯', label: 'Mehr & Anleitung' },
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
          <StarOfLife size={34} color={colors.red} outline={colors.ink} />
          <View>
            <Text style={styles.brandTitle}>Einsatz 112</Text>
            <Text style={styles.brandSub}>Das Sanitäter-Lernspiel</Text>
          </View>
        </View>

        <View style={styles.profile}>
          <RankBadge size={54} level={RANKS.indexOf(rank)} />
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <Text style={type.eyebrow}>Dienstausweis</Text>
            <Text style={styles.profileRank} numberOfLines={2}>
              {rank.de}
            </Text>
            <Bar pct={pct} color={colors.blue} height={10} />
          </View>
        </View>
        <View style={styles.kpis}>
          <Kpi value={progress.totalPoints.toLocaleString('de-DE')} label="Punkte" color={colors.yellow} />
          <Kpi value={euro(progress.budget)} label="Budget" color={colors.mintTint} />
          <Kpi value={`🔥 ${day.streak}`} label="Tage" color={colors.peach} />
        </View>

        <Button label="Schicht beginnen" variant="alarm" onPress={() => onNavigate('start')} />

        <View style={{ gap: 4 }}>
          {ITEMS.map((it) => (
            <View key={it.id}>
              {it.group && <Text style={styles.group}>{it.group}</Text>}
              <Pressable
                onPress={() => onNavigate(it.id)}
                accessibilityRole="button"
                accessibilityLabel={it.label}
                style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
                  styles.item,
                  (hovered || pressed) && styles.itemHover,
                  active === it.id && styles.itemActive,
                ]}
              >
                <Text style={styles.itemIcon}>{it.icon}</Text>
                <Text style={[styles.itemLabel, active === it.id && { fontFamily: fonts.displayBlack }]}>{it.label}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.footer}>Lernspiel – ersetzt keine Ausbildung. Im Notfall: 112.</Text>
    </View>
  );
}

function Kpi({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={[styles.kpi, { backgroundColor: color }]}>
      <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Seitenleiste als weißes Blatt neben dem Millimeterpapier
  root: { width: SIDEBAR_WIDTH, backgroundColor: colors.white, borderRightWidth: 2, borderRightColor: colors.ink },
  content: { padding: spacing.lg, gap: spacing.md },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xs },
  brandTitle: { fontFamily: fonts.displayBlack, fontSize: 23, lineHeight: 26, color: colors.ink, letterSpacing: -0.6 },
  brandSub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.muted, letterSpacing: 0.5 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.yellowTint,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 18,
    padding: spacing.md,
    ...hardShadow(3),
  },
  profileRank: { fontFamily: fonts.displayBlack, fontSize: 15, lineHeight: 17, color: colors.ink, letterSpacing: -0.3 },
  kpis: { flexDirection: 'row', gap: spacing.sm },
  kpi: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    ...hardShadow(2),
  },
  kpiValue: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.ink, letterSpacing: -0.3 },
  kpiLabel: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  group: { ...type.eyebrow, marginTop: spacing.sm, marginBottom: 2, marginLeft: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 7,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemHover: { backgroundColor: colors.paper },
  itemActive: { backgroundColor: colors.yellow, borderColor: colors.ink, ...hardShadow(3) },
  itemIcon: { fontFamily: fonts.displayBlack, fontSize: 17, width: 24, textAlign: 'center', color: colors.ink },
  itemLabel: { fontFamily: fonts.display, fontSize: 15, color: colors.ink, letterSpacing: -0.2 },
  footer: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, padding: spacing.lg, paddingTop: spacing.sm },
});
