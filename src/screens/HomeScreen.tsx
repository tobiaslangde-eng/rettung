import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip, MonitorScene, RankBadge, WarnStripes } from '../components/Ems';
import { Button, Eyebrow } from '../components/UI';
import { CASES } from '../data/cases';
import { BADGES } from '../game/achievements';
import { DAILY_GOAL, dailyCase, dailyGoalBonus, dayState } from '../game/daily';
import { DIFFICULTIES, Difficulty } from '../game/difficulty';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { weekView } from '../game/weekly';
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
  onDaily,
  onDifficulty,
  onLexikon,
  onGuide,
  onQuiz,
  onKnowledge,
  onCpr,
  onManv,
}: {
  progress: Progress;
  onStart: () => void;
  onDaily: () => void;
  onDifficulty: (d: Difficulty) => void;
  onLexikon: () => void;
  onGuide: () => void;
  onQuiz: () => void;
  onKnowledge: () => void;
  onCpr: () => void;
  onManv: () => void;
}) {
  const week = weekView(progress);
  const barMax = Math.max(1, week.best, ...week.bars.map((b) => b.points));
  const day = dayState(progress);
  const todays = dailyCase(progress);
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
          <RankBadge size={76} level={RANKS.indexOf(rank)} />
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

        <View style={styles.week}>
          <View style={{ flex: 1, gap: 2 }}>
            <Eyebrow title="Meine Woche" />
            <Text style={styles.weekValue}>
              {week.current} <Text style={styles.weekUnit}>Punkte</Text>
            </Text>
            <Text style={type.small}>
              {week.best === 0
                ? 'Erste Woche – stell deinen Rekord auf!'
                : week.current > week.best
                  ? `🏆 Neuer Wochenrekord! (vorher ${week.best})`
                  : `Rekord ${week.best} · noch ${week.best - week.current + 1} bis zum neuen Rekord`}
            </Text>
            <Text style={type.small}>Letzte Woche: {week.last}</Text>
          </View>
          <View style={styles.bars}>
            {week.bars.map((b, i) => {
              const now = i === week.bars.length - 1;
              return (
                <View key={b.week} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.weekBar,
                        { height: `${Math.max(4, (b.points / barMax) * 100)}%` },
                        now && { backgroundColor: colors.signalrot },
                        b.points === 0 && { backgroundColor: colors.grau200 },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, now && { color: colors.signalrot }]}>{b.week.slice(6)}</Text>
                </View>
              );
            })}
          </View>
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

        <View style={styles.daily}>
          <View style={styles.dailyHead}>
            <Text style={styles.dailyEyebrow}>Heutiger Dienst</Text>
            <Text style={styles.dailyStreak}>
              📅 {day.streak > 0 ? `${day.streak} ${day.streak === 1 ? 'Tag' : 'Tage'} in Folge` : 'Serie starten'}
            </Text>
          </View>
          <View style={styles.segments}>
            {Array.from({ length: DAILY_GOAL }, (_, i) => (
              <View key={i} style={[styles.segment, i < day.cases && styles.segmentOn]} />
            ))}
          </View>
          <Text style={styles.dailyText}>
            {day.goalDone
              ? `Tagesziel erreicht ✓ · ${day.cases} Einsätze heute`
              : `${Math.min(day.cases, DAILY_GOAL)} von ${DAILY_GOAL} Einsätzen · Tagesbonus +${dailyGoalBonus(day.streak + 1)}`}
          </Text>
          <Pressable
            onPress={onDaily}
            disabled={day.dailyCaseDone}
            accessibilityRole="button"
            style={({ pressed }) => [styles.dailyCase, day.dailyCaseDone && styles.dailyCaseDone, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.dailyCaseIcon}>{day.dailyCaseDone ? '✓' : '⭐'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dailyCaseTitle, day.dailyCaseDone && { color: colors.grau300 }]}>Einsatz des Tages</Text>
              <Text style={styles.dailyCaseSub}>
                {day.dailyCaseDone ? 'Erledigt – morgen wartet ein neuer' : `${todays.location.split(',')[0]} · +50 % Punkte`}
              </Text>
            </View>
            {!day.dailyCaseDone && <Text style={styles.quizArrow}>›</Text>}
          </Pressable>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Eyebrow title="Training" />
          <Pressable onPress={onManv} accessibilityRole="button" style={({ pressed }) => [styles.manv, pressed && { opacity: 0.9 }]}>
            <WarnStripes height={8} />
            <View style={styles.manvBody}>
              <Text style={styles.manvIcon}>🚨</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.manvTitle}>Großeinsatz</Text>
                <Text style={styles.manvSub}>
                  8 Verletzte richtig sichten{progress.manvBest > 0 ? ` · Bestwert ${progress.manvBest}/8` : ''}
                </Text>
              </View>
              <Text style={[styles.quizArrow, { color: colors.graphit }]}>›</Text>
            </View>
          </Pressable>
          <Training
            title="Herzdruckmassage"
            sub={`Im Takt drücken – 100 bis 120 pro Minute${progress.cprBest > 0 ? ` · Bestwert ${progress.cprBest} %` : ''}`}
            color={monitor.rr}
            onPress={onCpr}
          />
          <Training
            title="Wissensfragen"
            sub={`10 Fragen aus dem Einsatzalltag${progress.knowBest > 0 ? ` · Bestwert ${progress.knowBest}/10` : ''}`}
            color={monitor.spo2}
            onPress={onKnowledge}
          />
          <Training
            title="Normwerte"
            sub={`10 Werte schnell einschätzen${progress.quizBest > 0 ? ` · Bestwert ${progress.quizBest}/10` : ''}`}
            color={colors.monitorGruen}
            onPress={onQuiz}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Lexikon" variant="dark" onPress={onLexikon} style={{ flex: 1 }} />
          <Button label="Anleitung" variant="outline" onPress={onGuide} style={{ flex: 1 }} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Eyebrow title={`Abzeichen · ${progress.badges.length} von ${BADGES.length}`} />
          <View style={styles.badges}>
            {BADGES.map((b) => {
              const has = progress.badges.includes(b.id);
              return (
                <View key={b.id} style={[styles.badge, !has && styles.badgeLocked]}>
                  <Text style={[styles.badgeIcon, !has && { opacity: 0.25 }]}>{b.icon}</Text>
                  <Text style={[styles.badgeTitle, !has && { color: colors.grau500 }]} numberOfLines={2}>
                    {b.title}
                  </Text>
                  <Text style={styles.badgeDesc} numberOfLines={3}>
                    {b.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={[type.small, { textAlign: 'center' }]}>
          Lernspiel – ersetzt keine medizinische Ausbildung und keine ärztliche Beratung.{'\n'}
          Im echten Notfall immer: 112.
        </Text>
      </View>
    </ScrollView>
  );
}

function Training({ title, sub, color, onPress }: { title: string; sub: string; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.quiz, pressed && { opacity: 0.85 }]}>
      <View style={[styles.trainingDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.quizTitle, { color }]}>{title}</Text>
        <Text style={styles.quizSub}>{sub}</Text>
      </View>
      <Text style={[styles.quizArrow, { color }]}>›</Text>
    </Pressable>
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
  rankName: { fontFamily: fonts.displayBlack, fontSize: 22, lineHeight: 25, color: colors.graphit, textTransform: 'uppercase', marginTop: 2 },
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
  quiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.nacht,
    borderRadius: 6,
    padding: spacing.lg,
    borderLeftWidth: 0,
  },
  week: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.weiss,
    padding: spacing.lg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grau200,
  },
  weekValue: { fontFamily: fonts.displayBlack, fontSize: 30, color: colors.graphit },
  weekUnit: { fontSize: 14, fontFamily: fonts.semibold, color: colors.grau500 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, width: 120 },
  barCol: { flex: 1, alignItems: 'center', gap: 2 },
  barTrack: { height: 70, width: '100%', justifyContent: 'flex-end' },
  weekBar: { width: '100%', backgroundColor: colors.grau500, borderRadius: 2 },
  barLabel: { fontFamily: fonts.semibold, fontSize: 9, color: colors.grau500 },
  manv: { backgroundColor: colors.warngelb, borderRadius: 6, overflow: 'hidden' },
  manvBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  manvIcon: { fontSize: 26, fontFamily: fonts.regular },
  manvTitle: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.graphit, textTransform: 'uppercase' },
  manvSub: { fontFamily: fonts.semibold, fontSize: 13, color: colors.graphit },
  trainingDot: { width: 10, height: 10, borderRadius: 5 },
  daily: { backgroundColor: colors.graphit, borderRadius: 6, padding: spacing.lg, gap: spacing.sm },
  dailyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dailyEyebrow: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: 1.8, color: colors.warngelb, textTransform: 'uppercase' },
  dailyStreak: { fontFamily: fonts.bold, fontSize: 13, color: colors.weiss },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 8, borderRadius: 2, backgroundColor: colors.graphitSoft },
  segmentOn: { backgroundColor: colors.warngelb },
  dailyText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300 },
  dailyCase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.graphitSoft,
    borderRadius: 6,
    padding: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.warngelb,
  },
  dailyCaseDone: { borderColor: colors.graphitSoft },
  dailyCaseIcon: { fontSize: 22, fontFamily: fonts.regular, color: colors.monitorGruen },
  dailyCaseTitle: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.warngelb, textTransform: 'uppercase' },
  dailyCaseSub: { fontFamily: fonts.semibold, fontSize: 12, color: colors.grau300 },
  quizTitle: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.monitorGruen, textTransform: 'uppercase' },
  quizSub: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300, marginTop: 2 },
  quizArrow: { fontFamily: fonts.regular, fontSize: 34, color: colors.monitorGruen },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    width: '31.5%',
    flexGrow: 1,
    backgroundColor: colors.weiss,
    borderWidth: 1,
    borderColor: colors.grau200,
    borderRadius: 6,
    padding: spacing.sm,
    alignItems: 'center',
  },
  badgeLocked: { backgroundColor: colors.grau50 },
  badgeIcon: { fontSize: 26, fontFamily: fonts.regular },
  badgeTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.graphit, textAlign: 'center', marginTop: 2 },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.grau500, textAlign: 'center', marginTop: 2 },
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
