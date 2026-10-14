import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, TopBar } from '../components/UI';
import { EcgStrip, RankBadge, RatingStar } from '../components/Ems';
import { Confetti } from '../components/Training';
import { INCIDENTS } from '../data/incidents';
import { VITAL_BY_ID, formatVital, rateVital } from '../data/vitals';
import { BADGE_BONUS, Badge } from '../game/achievements';
import { DAILY_GOAL } from '../game/daily';
import { DIFFICULTY_BY_ID } from '../game/difficulty';
import { CaseRun, RANKS, ScoreResult, conditionOutcome } from '../game/scoring';
import { Columns, useLayout } from '../layout';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

const PRAISE = ['Da geht noch was', 'Guter Versuch', 'Gut gemacht!', 'Ausgezeichnet!'];

export function ResultScreen({
  run,
  result,
  newBadges,
  goalBonus,
  promotion,
  weekRecord,
  streak,
  onNext,
  onHome,
}: {
  run: CaseRun;
  result: ScoreResult;
  newBadges: Badge[];
  goalBonus: number;
  promotion?: string;
  weekRecord: boolean;
  streak: number;
  onNext: () => void;
  onHome: () => void;
}) {
  const c = run.medCase;
  const L = useLayout();
  const diff = DIFFICULTY_BY_ID[run.difficulty];
  const outcome = conditionOutcome(run.condition, c.patient.name.split(' ')[0]);
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Einsatz beendet" title="Mein Einsatzbericht" onBack={onHome} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        <View style={[styles.hero, result.stars < 2 && { backgroundColor: colors.inkSoft }]}>
          {result.stars >= 2 && <Confetti />}
          <View style={styles.stars}>
            {[0, 1, 2].map((i) => (
              <RatingStar key={i} size={i === 1 ? 58 : 44} filled={i < result.stars} />
            ))}
          </View>
          <Text style={styles.praise}>{PRAISE[result.stars]}</Text>
          <Text style={styles.points}>
            +{result.total} <Text style={styles.pointsMax}>Punkte</Text>
          </Text>
          <View style={styles.diffPill}>
            <Text style={styles.diff}>
              {diff.label} {diff.icon}
              {result.multiplier > 1 ? `  ·  ×${String(result.multiplier).replace('.', ',')}` : ''}
              {streak >= 2 ? `  ·  🔥 ${streak}er-Serie` : ''}
            </Text>
          </View>
          <View style={styles.ecg}>
            <EcgStrip height={48} beats={4} color={colors.yellow} />
          </View>
        </View>
        <Columns
          wide={L.wide}
          cols={[
            <>
              {promotion && (
                <View style={styles.promo}>
                  <RankBadge size={72} level={RANKS.findIndex((r) => r.de === promotion)} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.promoHead}>Befördert!</Text>
                    <Text style={styles.promoText}>Mein neuer Dienstgrad:</Text>
                    <Text style={styles.promoRank}>{promotion}</Text>
                  </View>
                </View>
              )}
              {weekRecord && (
                <View style={styles.badgeBox}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.badgeIcon}>📈</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.badgeTitle}>Neuer Wochenrekord!</Text>
                      <Text style={styles.badgeDesc}>So viele Punkte habe ich noch in keiner Woche gesammelt.</Text>
                    </View>
                  </View>
                </View>
              )}
              {goalBonus > 0 && (
                <View style={styles.badgeBox}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.badgeIcon}>📅</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.badgeTitle}>Tagesziel erreicht!</Text>
                      <Text style={styles.badgeDesc}>
                        {DAILY_GOAL} Einsätze heute – morgen wieder, dann wächst die Dienst-Serie.
                      </Text>
                    </View>
                    <Text style={styles.badgePts}>+{goalBonus}</Text>
                  </View>
                </View>
              )}
              {newBadges.length > 0 && (
                <View style={styles.badgeBox}>
                  <Text style={styles.badgeHead}>Neues Abzeichen!</Text>
                  {newBadges.map((b) => (
                    <View key={b.id} style={styles.badgeRow}>
                      <Text style={styles.badgeIcon}>{b.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.badgeTitle}>{b.title}</Text>
                        <Text style={styles.badgeDesc}>{b.description}</Text>
                      </View>
                      <Text style={styles.badgePts}>+{BADGE_BONUS}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Card
                style={{
                  borderLeftColor: run.condition >= 70 ? colors.mint : run.condition >= 40 ? colors.orange : colors.red,
                }}
              >
                <Eyebrow title="In der Klinik" />
                <Text style={[type.body, { marginTop: spacing.xs }]}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 22 }}>{outcome.emoji} </Text>
                  {outcome.text}
                </Text>
              </Card>

              <Card>
                <Eyebrow title="Meine Wertung" />
                {result.lines.map((l, i) => (
                  <View key={i} style={styles.line}>
                    <Text style={[type.body, { flex: 1 }]}>{l.label}</Text>
                    <Text style={[styles.linePts, { color: l.points < 0 ? colors.signalrot : colors.graphit }]}>
                      {l.points > 0 ? '+' : ''}
                      {l.points}
                    </Text>
                  </View>
                ))}
              </Card>
            </>,
            <>
              <Card style={{ borderLeftColor: result.diagnosisCorrect ? colors.mint : colors.red }}>
                <Eyebrow title="Diagnose" />
                <Text style={[type.h2, { marginTop: spacing.xs }]}>{c.diagnosis}</Text>
                {!result.diagnosisCorrect && (
                  <Text style={[type.small, { color: colors.signalrot, marginTop: spacing.xs }]}>
                    Mein Verdacht war: {run.diagnosisGuess}
                  </Text>
                )}
                <Text style={[type.body, { marginTop: spacing.sm }]}>{c.explanation}</Text>
                <Text style={[type.small, { marginTop: spacing.sm, fontFamily: fonts.bold, color: colors.graphit }]}>
                  Leitsymptome
                </Text>
                {c.leitsymptome.map((s) => (
                  <Text key={s} style={type.small}>
                    • {s}
                  </Text>
                ))}
              </Card>

              {INCIDENTS[c.id] && run.incidentCorrect !== undefined && (
                <Card style={{ borderLeftColor: run.incidentCorrect ? colors.mint : colors.red }}>
                  <Eyebrow title="Zwischenfall" />
                  <Text style={[type.body, { marginTop: spacing.xs, fontFamily: fonts.italic }]}>{INCIDENTS[c.id].text}</Text>
                  <Text style={[type.body, { marginTop: spacing.sm, fontFamily: fonts.bold }]}>
                    {run.incidentCorrect ? '✓ ' : '✗ Richtig wäre: '}
                    {INCIDENTS[c.id].options[0]}
                  </Text>
                  <Text style={[type.small, { marginTop: spacing.xs }]}>{INCIDENTS[c.id].explanation}</Text>
                </Card>
              )}

              <Card style={{ borderLeftColor: colors.ink }}>
                <Eyebrow title="Meine Messwerte" />
                {run.measured.map((m) => {
                  const truth = rateVital(m.id, c.vitals[m.id], c.patient.age);
                  const ok = truth === null || truth === m.guess;
                  return (
                    <View key={m.id} style={styles.line}>
                      <Text style={[type.body, { flex: 1 }]}>
                        {VITAL_BY_ID[m.id].short}: {formatVital(m.id, c.vitals[m.id])}
                      </Text>
                      <Text style={{ color: ok ? colors.mintDark : colors.red, fontFamily: fonts.bold }}>
                        {truth === null ? 'Befund' : ok ? `✓ ${truth}` : `✗ ${truth}`}
                      </Text>
                    </View>
                  );
                })}
                {result.missedKeyVitals.length > 0 && (
                  <Text style={[type.small, { color: colors.signalrot, marginTop: spacing.sm }]}>
                    Das hätte ich messen sollen:{' '}
                    {result.missedKeyVitals.map((id) => `${VITAL_BY_ID[id].short} (${formatVital(id, c.vitals[id])})`).join(', ')}
                  </Text>
                )}
              </Card>

              <Card>
                <Eyebrow title="Meine Maßnahmen" />
                {c.treatments.map((t, i) => {
                  const chosen = run.treatmentGuess.includes(i);
                  const ok = chosen === t.correct;
                  return (
                    <View key={i} style={styles.line}>
                      <Text style={[type.small, { flex: 1, color: colors.graphit }]}>
                        {t.correct ? '✓' : '✗'} {t.text}
                      </Text>
                      <Text style={{ fontSize: 11, color: ok ? colors.mintDark : colors.red, fontFamily: fonts.bold }}>
                        {chosen ? 'gewählt' : 'nicht gewählt'}
                      </Text>
                    </View>
                  );
                })}
              </Card>
            </>,
          ]}
        />
        <View style={L.wide ? styles.buttonsWide : styles.buttons}>
          <Button label="Nächster Einsatz" variant="alarm" onPress={onNext} style={L.wide && { flex: 1 }} />
          <Button label="Zum Hauptmenü" variant="outline" onPress={onHome} style={L.wide && { flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    ...hardShadow(4),
  },
  promoHead: { fontFamily: fonts.displayBlack, fontSize: 32, lineHeight: 34, color: colors.ink, letterSpacing: -1 },
  promoText: { fontFamily: fonts.mono, fontSize: 11, color: colors.ink, letterSpacing: 0.6, textTransform: 'uppercase' },
  promoRank: { fontFamily: fonts.displayBlack, fontSize: 21, lineHeight: 24, color: colors.ink, letterSpacing: -0.5 },
  badgeBox: {
    backgroundColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.ink,
    ...hardShadow(4, colors.blue),
  },
  badgeHead: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.yellow, letterSpacing: -0.5 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badgeIcon: { fontFamily: fonts.regular, fontSize: 30 },
  badgeTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.white, letterSpacing: -0.2 },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.grau300 },
  badgePts: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.monitorGruen, letterSpacing: -0.4 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, gap: spacing.lg },
  buttons: { gap: spacing.lg },
  buttonsWide: { flexDirection: 'row', gap: spacing.lg },
  hero: {
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 28,
    paddingTop: spacing.xl,
    gap: 2,
    ...hardShadow(6),
  },
  ecg: { alignSelf: 'stretch', marginTop: spacing.md },
  stars: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  praise: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 36,
    fontFamily: fonts.displayBlack,
    marginTop: spacing.md,
    letterSpacing: -1,
  },
  points: { color: colors.yellow, fontSize: 56, lineHeight: 62, fontFamily: fonts.displayBlack, letterSpacing: -2 },
  pointsMax: { fontSize: 16, color: colors.white, fontFamily: fonts.mono, letterSpacing: 0.5 },
  diffPill: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  diff: { color: colors.ink, fontFamily: fonts.display, fontSize: 13 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
  linePts: { fontFamily: fonts.displayBlack, fontSize: 17, letterSpacing: -0.3 },
});
