import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, WarnStripes, TopBar } from '../components/UI';
import { EcgStrip, MonitorScene, RatingStar } from '../components/Ems';
import { VITAL_BY_ID, formatVital, rateVital } from '../data/vitals';
import { DIFFICULTY_BY_ID } from '../game/difficulty';
import { CaseRun, ScoreResult, conditionOutcome } from '../game/scoring';
import { colors, spacing, type, fonts } from '../theme';

const PRAISE = ['Da geht noch was', 'Guter Versuch', 'Gut gemacht!', 'Ausgezeichnet!'];

export function ResultScreen({
  run,
  result,
  streak,
  onNext,
  onHome,
}: {
  run: CaseRun;
  result: ScoreResult;
  streak: number;
  onNext: () => void;
  onHome: () => void;
}) {
  const c = run.medCase;
  const diff = DIFFICULTY_BY_ID[run.difficulty];
  const outcome = conditionOutcome(run.condition, c.patient.name.split(' ')[0]);
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Einsatz beendet" title="Mein Einsatzbericht" onBack={onHome} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={StyleSheet.absoluteFill}>
            <MonitorScene height={330} />
          </View>
          <View style={styles.stars}>
            {[0, 1, 2].map((i) => (
              <RatingStar key={i} size={i === 1 ? 52 : 40} filled={i < result.stars} />
            ))}
          </View>
          <Text style={styles.praise}>{PRAISE[result.stars]}</Text>
          <Text style={styles.points}>
            +{result.total} <Text style={styles.pointsMax}>Punkte</Text>
          </Text>
          <Text style={styles.diff}>
            {diff.label} {diff.icon}
            {result.multiplier > 1 ? `  ·  ×${String(result.multiplier).replace('.', ',')}` : ''}
            {streak >= 2 ? `  ·  🔥 ${streak}er-Serie` : ''}
          </Text>
          <View style={styles.ecg}>
            <EcgStrip height={56} beats={4} />
          </View>
        </View>
        <Card style={{ borderLeftColor: run.condition >= 70 ? colors.gruen : run.condition >= 40 ? colors.amber : colors.signalrot }}>
          <Eyebrow title="In der Klinik" />
          <Text style={[type.body, { marginTop: spacing.xs }]}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 22 }}>{outcome.emoji} </Text>
            {outcome.text}
          </Text>
        </Card>
        <WarnStripes />

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

        <Card style={{ borderLeftColor: result.diagnosisCorrect ? colors.gruen : colors.signalrot }}>
          <Eyebrow title="Diagnose" />
          <Text style={[type.h2, { marginTop: spacing.xs }]}>{c.diagnosis}</Text>
          {!result.diagnosisCorrect && (
            <Text style={[type.small, { color: colors.signalrot, marginTop: spacing.xs }]}>
              Mein Verdacht war: {run.diagnosisGuess}
            </Text>
          )}
          <Text style={[type.body, { marginTop: spacing.sm }]}>{c.explanation}</Text>
          <Text style={[type.small, { marginTop: spacing.sm, fontFamily: fonts.bold, color: colors.graphit }]}>Leitsymptome</Text>
          {c.leitsymptome.map((s) => (
            <Text key={s} style={type.small}>
              • {s}
            </Text>
          ))}
        </Card>

        <Card style={{ borderLeftColor: colors.graphit }}>
          <Eyebrow title="Meine Messwerte" />
          {run.measured.map((m) => {
            const truth = rateVital(m.id, c.vitals[m.id]);
            const ok = truth === null || truth === m.guess;
            return (
              <View key={m.id} style={styles.line}>
                <Text style={[type.body, { flex: 1 }]}>
                  {VITAL_BY_ID[m.id].short}: {formatVital(m.id, c.vitals[m.id])}
                </Text>
                <Text style={{ color: ok ? colors.gruen : colors.signalrot, fontFamily: fonts.bold }}>
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
                <Text style={{ fontSize: 11, color: ok ? colors.gruen : colors.signalrot, fontFamily: fonts.bold }}>
                  {chosen ? 'gewählt' : 'nicht gewählt'}
                </Text>
              </View>
            );
          })}
        </Card>

        <Button label="Nächster Einsatz" variant="alarm" onPress={onNext} />
        <Button label="Zum Hauptmenü" variant="outline" onPress={onHome} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: {
    height: 330,
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.nacht,
    justifyContent: 'center',
    paddingTop: 0,
  },
  ecg: { alignSelf: 'stretch', marginTop: spacing.md },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  praise: { color: colors.weiss, fontSize: 30, fontFamily: fonts.displayBlack, marginTop: spacing.md, textTransform: 'uppercase' },
  praiseDe: { color: colors.grau300, fontSize: 13, fontFamily: fonts.semibold, letterSpacing: 1.5, textTransform: 'uppercase' },
  points: { color: colors.monitorGruen, fontSize: 44, fontFamily: fonts.displayBlack, marginTop: spacing.xs },
  pointsMax: { fontSize: 16, color: colors.grau300, fontFamily: fonts.semibold },
  diff: { color: colors.blaulichtLight, marginTop: spacing.xs, fontFamily: fonts.bold, fontSize: 13 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grau200,
  },
  linePts: { fontFamily: fonts.extrabold, fontSize: 16 },
});
