import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Eyebrow } from '../components/Estonian';
import { EstoniaScene, Kaheksakand, Ornament } from '../components/Folk';
import { CASES } from '../data/cases';
import { DIFFICULTIES, Difficulty } from '../game/difficulty';
import { rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { colors, fonts, spacing, type } from '../theme';

const LEVEL_STARS: Record<Difficulty, number> = { leicht: 1, mittel: 2, schwer: 3 };

export function HomeScreen({
  progress,
  onStart,
  onDifficulty,
  onLexikon,
  onGuide,
}: {
  progress: Progress;
  onStart: () => void;
  onDifficulty: (d: Difficulty) => void;
  onLexikon: () => void;
  onGuide: () => void;
}) {
  const { rank, next } = rankFor(progress.totalPoints);
  const span = next ? next.min - rank.min : 1;
  const pct = next ? Math.min(1, (progress.totalPoints - rank.min) / span) : 1;
  const mastered = CASES.filter((c) => (progress.bestStars[c.id] ?? 0) >= 3).length;
  const current = DIFFICULTIES.find((d) => d.id === progress.difficulty) ?? DIFFICULTIES[0];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={styles.hero}>
        <View style={StyleSheet.absoluteFill}>
          <EstoniaScene height={300} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.tere}>Tere tulemast!</Text>
          <Text style={styles.title}>Kiirabi</Text>
          <Text style={styles.subtitle}>Ich bin Sanitäter/in in Estland.{'\n'}Ich erkenne. Ich messe. Ich handle.</Text>
        </View>
      </View>
      <Ornament background={colors.valge} color={colors.sinine} accent={colors.must} />

      <View style={styles.body}>
        <View style={styles.rank}>
          <View style={styles.medal}>
            <Kaheksakand size={44} color={colors.sinine} gap={colors.valge} center={colors.valge} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow et="Auaste" de="Mein Dienstgrad" />
            <Text style={styles.rankName}>{rank.de}</Text>
            <Text style={styles.rankEt}>{rank.et}</Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
            </View>
            <Text style={type.small}>
              {progress.totalPoints} Punkte
              {next ? ` · noch ${next.min - progress.totalPoints} bis „${next.de}“` : ' · Höchster Rang erreicht'}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Stat value={progress.casesPlayed} label="Einsätze" et="väljakutset" />
          <View style={styles.statRule} />
          <Stat value={progress.correctDiagnoses} label="Diagnosen" et="diagnoosi" />
          <View style={styles.statRule} />
          <Stat value={`${mastered}/${CASES.length}`} label="gemeistert" et="meisterdatud" />
        </View>

        {progress.streak >= 2 && (
          <View style={styles.streak}>
            <Text style={styles.streakText}>🔥 {progress.streak} gute Einsätze in Folge</Text>
          </View>
        )}

        <View style={{ gap: spacing.sm }}>
          <Eyebrow et="Raskusaste" de="Wie schwer wird meine Schicht?" />
          <View style={styles.diffRow}>
            {DIFFICULTIES.map((d) => {
              const active = progress.difficulty === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => onDifficulty(d.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[styles.diff, active && styles.diffActive]}
                >
                  <View style={styles.diffStars}>
                    {[1, 2, 3].map((n) => (
                      <Kaheksakand
                        key={n}
                        size={14}
                        color={n <= LEVEL_STARS[d.id] ? colors.sinine : active ? colors.mustSoft : colors.lumiDark}
                        gap={active ? colors.must : colors.valge}
                      />
                    ))}
                  </View>
                  <Text style={[styles.diffLabel, active && { color: colors.valge }]}>{d.label}</Text>
                  <Text style={[styles.diffEt, active && { color: colors.sinineLight }]}>{d.et}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={type.small}>{current.description}</Text>
        </View>

        <Button label="Meine Schicht beginnen" sub="Alusta väljakutset" variant="alarm" onPress={onStart} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Lexikon" sub="Leksikon" variant="primary" onPress={onLexikon} style={{ flex: 1 }} />
          <Button label="Anleitung" sub="Juhend" variant="outline" onPress={onGuide} style={{ flex: 1 }} />
        </View>

        <View style={styles.footer}>
          <Kaheksakand size={12} color={colors.greyLight} gap={colors.lumi} />
          <Text style={[type.small, { textAlign: 'center' }]}>
            Lernspiel – ersetzt keine medizinische Ausbildung und keine ärztliche Beratung.{'\n'}
            Im Notfall: 112 (Estland & EU).
          </Text>
        </View>
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
  hero: { height: 300, backgroundColor: colors.sinineDeep, overflow: 'hidden' },
  heroText: { paddingTop: spacing.xxl + 4, paddingHorizontal: spacing.xl },
  tere: { color: colors.sinineLight, fontSize: 13, letterSpacing: 2.5, fontFamily: fonts.extrabold, textTransform: 'uppercase' },
  title: { color: colors.valge, fontSize: 50, fontFamily: fonts.displayBlack, letterSpacing: 1, marginTop: 2 },
  subtitle: { color: colors.sinineLight, fontSize: 15, lineHeight: 21, marginTop: spacing.xs, fontFamily: fonts.semibold },
  body: { padding: spacing.lg, gap: spacing.xl },
  rank: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.valge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.lumiDark,
  },
  medal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.must,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankName: { fontFamily: fonts.display, fontSize: 19, color: colors.must, marginTop: 4 },
  rankEt: { fontFamily: fonts.italic, fontSize: 13, color: colors.grey },
  bar: { height: 6, backgroundColor: colors.lumiDark, marginVertical: spacing.sm },
  barFill: { height: 6, backgroundColor: colors.sinine },
  stats: { flexDirection: 'row', alignItems: 'stretch' },
  statRule: { width: 1, backgroundColor: colors.lumiDark },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  statValue: { fontSize: 24, fontFamily: fonts.display, color: colors.must },
  statLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.must, marginTop: 2 },
  statEt: { fontFamily: fonts.italic, fontSize: 11, color: colors.grey },
  streak: { alignSelf: 'center', backgroundColor: colors.must, paddingHorizontal: spacing.md, paddingVertical: 6 },
  streakText: { color: colors.kihnuYellow, fontFamily: fonts.extrabold, fontSize: 13 },
  diffRow: { flexDirection: 'row', gap: spacing.sm },
  diff: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.valge,
    borderWidth: 1,
    borderColor: colors.lumiDark,
    gap: 4,
  },
  diffActive: { backgroundColor: colors.must, borderColor: colors.must },
  diffStars: { flexDirection: 'row', gap: 3 },
  diffLabel: { fontFamily: fonts.display, fontSize: 14, color: colors.must, marginTop: 2 },
  diffEt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.grey, letterSpacing: 1.5, textTransform: 'uppercase' },
  footer: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
});
