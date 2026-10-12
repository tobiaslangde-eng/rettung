import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, Ornament, TopBar } from '../components/Estonian';
import { VITAL_BY_ID, formatVital, rateVital } from '../data/vitals';
import { CaseRun, ScoreResult, maxScore } from '../game/scoring';
import { colors, spacing, type } from '../theme';

const PRAISE = ['Nii ja naa …', 'Hea katse!', 'Tubli!', 'Suurepärane!'];

export function ResultScreen({
  run,
  result,
  onNext,
  onHome,
}: {
  run: CaseRun;
  result: ScoreResult;
  onNext: () => void;
  onHome: () => void;
}) {
  const c = run.medCase;
  return (
    <View style={{ flex: 1 }}>
      <TopBar et="Tulemus" title="Einsatzbericht" onBack={onHome} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.stars}>
            {'★'.repeat(result.stars)}
            <Text style={{ color: colors.grey }}>{'★'.repeat(3 - result.stars)}</Text>
          </Text>
          <Text style={styles.praise}>{PRAISE[result.stars]}</Text>
          <Text style={styles.points}>
            {result.total} <Text style={styles.pointsMax}>/ {maxScore(c)} Punkte</Text>
          </Text>
        </View>
        <Ornament count={10} />

        <Card>
          <Eyebrow et="Punktid" de="Wertung" />
          {result.lines.map((l, i) => (
            <View key={i} style={styles.line}>
              <Text style={[type.body, { flex: 1 }]}>{l.label}</Text>
              <Text style={[styles.linePts, { color: l.points < 0 ? colors.kihnuRed : colors.must }]}>
                {l.points > 0 ? '+' : ''}
                {l.points}
              </Text>
            </View>
          ))}
        </Card>

        <Card style={{ borderLeftColor: result.diagnosisCorrect ? colors.rabaGreen : colors.kihnuRed }}>
          <Eyebrow et="Diagnoos" de="Diagnose" />
          <Text style={[type.h2, { marginTop: spacing.xs }]}>{c.diagnosis}</Text>
          <Text style={type.small}>Estnisch: {c.diagnosisEt}</Text>
          {!result.diagnosisCorrect && (
            <Text style={[type.small, { color: colors.kihnuRed, marginTop: spacing.xs }]}>
              Deine Wahl: {run.diagnosisGuess}
            </Text>
          )}
          <Text style={[type.body, { marginTop: spacing.sm }]}>{c.explanation}</Text>
          <Text style={[type.small, { marginTop: spacing.sm, fontWeight: '700', color: colors.must }]}>Leitsymptome</Text>
          {c.leitsymptome.map((s) => (
            <Text key={s} style={type.small}>
              • {s}
            </Text>
          ))}
        </Card>

        <Card style={{ borderLeftColor: colors.must }}>
          <Eyebrow et="Väärtused" de="Messwerte" />
          {run.measured.map((m) => {
            const truth = rateVital(m.id, c.vitals[m.id]);
            const ok = truth === null || truth === m.guess;
            return (
              <View key={m.id} style={styles.line}>
                <Text style={[type.body, { flex: 1 }]}>
                  {VITAL_BY_ID[m.id].short}: {formatVital(m.id, c.vitals[m.id])}
                </Text>
                <Text style={{ color: ok ? colors.rabaGreen : colors.kihnuRed, fontWeight: '700' }}>
                  {truth === null ? 'Befund' : ok ? `✓ ${truth}` : `✗ ${truth}`}
                </Text>
              </View>
            );
          })}
          {result.missedKeyVitals.length > 0 && (
            <Text style={[type.small, { color: colors.kihnuRed, marginTop: spacing.sm }]}>
              Nicht gemessen, aber wichtig:{' '}
              {result.missedKeyVitals.map((id) => `${VITAL_BY_ID[id].short} (${formatVital(id, c.vitals[id])})`).join(', ')}
            </Text>
          )}
        </Card>

        <Card>
          <Eyebrow et="Ravi" de="Maßnahmen" />
          {c.treatments.map((t, i) => {
            const chosen = run.treatmentGuess.includes(i);
            const ok = chosen === t.correct;
            return (
              <View key={i} style={styles.line}>
                <Text style={[type.small, { flex: 1, color: colors.must }]}>
                  {t.correct ? '✓' : '✗'} {t.text}
                </Text>
                <Text style={{ fontSize: 11, color: ok ? colors.rabaGreen : colors.kihnuRed, fontWeight: '700' }}>
                  {chosen ? 'gewählt' : 'nicht gewählt'}
                </Text>
              </View>
            );
          })}
        </Card>

        <Button label="Nächster Einsatz" sub="Järgmine väljakutse" variant="alarm" onPress={onNext} />
        <Button label="Zum Hauptmenü" sub="Avaleht" variant="outline" onPress={onHome} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { backgroundColor: colors.must, padding: spacing.xl, alignItems: 'center' },
  stars: { fontSize: 40, color: colors.sinine, letterSpacing: 6 },
  praise: { color: colors.valge, fontSize: 22, fontWeight: '800', marginTop: spacing.xs },
  points: { color: colors.valge, fontSize: 30, fontWeight: '900', marginTop: spacing.sm },
  pointsMax: { fontSize: 16, color: colors.greyLight, fontWeight: '600' },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.linen,
  },
  linePts: { fontWeight: '800', fontSize: 16 },
});
