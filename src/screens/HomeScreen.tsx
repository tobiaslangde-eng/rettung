import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip, MonitorScene, StarOfLife, WarnStripes } from '../components/Ems';
import { Button, Eyebrow } from '../components/UI';
import { CASES } from '../data/cases';
import { DIFFICULTIES, Difficulty } from '../game/difficulty';
import { rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { colors, fonts, monitor, spacing, type } from '../theme';

const LEVEL: Record<Difficulty, number> = { leicht: 1, mittel: 2, schwer: 3 };

/** Blinkende Statusleuchte „einsatzbereit“. */
function StatusLight() {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 0.25, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(a, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);
  return <Animated.View style={[styles.statusLight, { opacity: a }]} />;
}

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
          <MonitorScene height={330} />
        </View>
        <View style={styles.heroTop}>
          <View style={styles.status}>
            <StatusLight />
            <Text style={styles.statusText}>Einsatzbereit</Text>
          </View>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>Einsatz 112</Text>
          <Text style={styles.subtitle}>Ich bin Sanitäter/in. Ich erkenne. Ich messe. Ich handle.</Text>
        </View>
        <View style={styles.ecg}>
          <EcgStrip height={64} />
        </View>
        <View style={styles.readouts}>
          <Readout label="HF" value="72" color={monitor.puls} />
          <Readout label="SpO₂" value="98" color={monitor.spo2} />
          <Readout label="RR" value="120/80" color={monitor.rr} />
        </View>
      </View>
      <WarnStripes height={14} />

      <View style={styles.body}>
        <View style={styles.rank}>
          <View style={styles.medal}>
            <StarOfLife size={44} outline={colors.graphit} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow title="Mein Dienstgrad" />
            <Text style={styles.rankName}>{rank.de}</Text>
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
          <Stat value={progress.casesPlayed} label="Einsätze" />
          <View style={styles.statRule} />
          <Stat value={progress.correctDiagnoses} label="Diagnosen" />
          <View style={styles.statRule} />
          <Stat value={`${mastered}/${CASES.length}`} label="Gemeistert" />
        </View>

        {progress.streak >= 2 && (
          <View style={styles.streak}>
            <Text style={styles.streakText}>🔥 {progress.streak} gute Einsätze in Folge</Text>
          </View>
        )}

        <View style={{ gap: spacing.sm }}>
          <Eyebrow title="Schwierigkeit" />
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
                  <View style={styles.levelBars}>
                    {[1, 2, 3].map((n) => (
                      <View
                        key={n}
                        style={[
                          styles.levelBar,
                          { height: 6 + n * 4 },
                          n <= LEVEL[d.id] && { backgroundColor: colors.signalrot },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.diffLabel, active && { color: colors.weiss }]}>{d.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={type.small}>{current.description}</Text>
        </View>

        <Button label="Schicht beginnen" variant="alarm" onPress={onStart} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Lexikon" variant="dark" onPress={onLexikon} style={{ flex: 1 }} />
          <Button label="Anleitung" variant="outline" onPress={onGuide} style={{ flex: 1 }} />
        </View>

        <Text style={[type.small, { textAlign: 'center' }]}>
          Lernspiel – ersetzt keine medizinische Ausbildung und keine ärztliche Beratung.{'\n'}
          Im echten Notfall immer: 112.
        </Text>
      </View>
    </ScrollView>
  );
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View>
      <Text style={[styles.readoutLabel, { color }]}>{label}</Text>
      <Text style={[styles.readoutValue, { color }]}>{value}</Text>
    </View>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 330, backgroundColor: colors.nacht, overflow: 'hidden', justifyContent: 'space-between' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusLight: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.monitorGruen },
  statusText: { color: colors.grau200, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  heroText: { paddingHorizontal: spacing.xl },
  title: {
    color: colors.weiss,
    fontSize: 76,
    lineHeight: 78,
    fontFamily: fonts.displayBlack,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: { color: colors.grau300, fontSize: 15, fontFamily: fonts.semibold },
  ecg: { alignSelf: 'stretch', height: 64 },
  readouts: { flexDirection: 'row', gap: spacing.xl, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  readoutLabel: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1 },
  readoutValue: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 30 },
  body: { padding: spacing.lg, gap: spacing.xl },
  rank: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.weiss,
    padding: spacing.lg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grau200,
  },
  medal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.graphit,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankName: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.graphit, textTransform: 'uppercase', marginTop: 2 },
  bar: { height: 6, backgroundColor: colors.grau200, marginVertical: spacing.sm, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.signalrot },
  stats: { flexDirection: 'row', alignItems: 'stretch' },
  statRule: { width: 1, backgroundColor: colors.grau200 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  statValue: { fontSize: 34, lineHeight: 36, fontFamily: fonts.displayBlack, color: colors.graphit },
  statLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.grau500, letterSpacing: 1.2, textTransform: 'uppercase' },
  streak: { alignSelf: 'center', backgroundColor: colors.graphit, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20 },
  streakText: { color: colors.warngelb, fontFamily: fonts.extrabold, fontSize: 13 },
  diffRow: { flexDirection: 'row', gap: spacing.sm },
  diff: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.weiss,
    borderWidth: 1,
    borderColor: colors.grau200,
    borderRadius: 6,
    gap: 2,
  },
  diffActive: { backgroundColor: colors.graphit, borderColor: colors.graphit },
  levelBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 18, marginBottom: 4 },
  levelBar: { width: 6, borderRadius: 1, backgroundColor: colors.grau300 },
  diffLabel: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.graphit, textTransform: 'uppercase' },
});
