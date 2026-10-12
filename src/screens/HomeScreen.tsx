import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, FlagStripe, Ornament } from '../components/Estonian';
import { CASES } from '../data/cases';
import { rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { colors, spacing, type } from '../theme';

export function HomeScreen({
  progress,
  onStart,
  onLexikon,
  onGuide,
}: {
  progress: Progress;
  onStart: () => void;
  onLexikon: () => void;
  onGuide: () => void;
}) {
  const { rank, next } = rankFor(progress.totalPoints);
  const span = next ? next.min - rank.min : 1;
  const pct = next ? Math.min(1, (progress.totalPoints - rank.min) / span) : 1;
  const mastered = CASES.filter((c) => (progress.bestStars[c.id] ?? 0) >= 3).length;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={styles.hero}>
        <Text style={styles.tere}>Tere tulemast!</Text>
        <Text style={styles.title}>KIIRABI</Text>
        <Text style={styles.subtitle}>Rettungseinsatz · Erkennen. Messen. Handeln.</Text>
        <View style={styles.cross}>
          <View style={[styles.crossBar, { width: 44, height: 14 }]} />
          <View style={[styles.crossBar, { width: 14, height: 44, position: 'absolute' }]} />
        </View>
      </View>
      <FlagStripe height={6} />
      <Ornament background={colors.linen} />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        <Card>
          <Eyebrow et="Auaste" de="Dienstgrad" />
          <Text style={[type.h2, { marginTop: spacing.xs }]}>{rank.de}</Text>
          <Text style={type.small}>{rank.et}</Text>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
          </View>
          <Text style={type.small}>
            {progress.totalPoints} Punkte
            {next ? ` · noch ${next.min - progress.totalPoints} bis „${next.de}“` : ' · Höchster Rang erreicht'}
          </Text>
        </Card>

        <View style={styles.stats}>
          <Stat value={progress.casesPlayed} label="Einsätze" et="väljakutset" />
          <Stat value={progress.correctDiagnoses} label="Diagnosen" et="diagnoosi" />
          <Stat value={`${mastered}/${CASES.length}`} label="★★★ Fälle" et="meisterdatud" />
        </View>

        <Button label="Einsatz starten" sub="Alusta väljakutset" variant="alarm" onPress={onStart} />
        <Button label="Lexikon & Normwerte" sub="Leksikon" variant="primary" onPress={onLexikon} />
        <Button label="Anleitung" sub="Juhend" variant="outline" onPress={onGuide} />

        <Text style={[type.small, { textAlign: 'center', marginTop: spacing.sm }]}>
          Lernspiel – ersetzt keine medizinische Ausbildung und keine ärztliche Beratung.{'\n'}
          Im Notfall: 112 (Estland & EU).
        </Text>
      </View>
    </ScrollView>
  );
}

function Stat({ value, label, et }: { value: number | string; label: string; et: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statEt}>{et}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.must,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  tere: { color: colors.sinineLight, fontSize: 14, letterSpacing: 2, fontWeight: '600' },
  title: { color: colors.valge, fontSize: 52, fontWeight: '900', letterSpacing: 6, marginTop: spacing.xs },
  subtitle: { color: colors.greyLight, fontSize: 14, marginTop: spacing.xs },
  cross: {
    position: 'absolute',
    right: spacing.xl,
    top: spacing.xxl + 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossBar: { backgroundColor: colors.sinine },
  bar: { height: 8, backgroundColor: colors.linenDark, marginVertical: spacing.sm },
  barFill: { height: 8, backgroundColor: colors.sinine },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.valge,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: colors.must,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.sinine },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.must, marginTop: 2 },
  statEt: { fontSize: 10, color: colors.grey, letterSpacing: 1 },
});
