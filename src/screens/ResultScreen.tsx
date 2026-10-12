import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, Ornament, TopBar } from '../components/Estonian';
import { EstoniaScene, Kaheksakand } from '../components/Folk';
import { VITAL_BY_ID, formatVital, rateVital } from '../data/vitals';
import { DIFFICULTY_BY_ID } from '../game/difficulty';
import { CaseRun, ScoreResult, conditionOutcome } from '../game/scoring';
import { colors, spacing, type, fonts } from '../theme';

const PRAISE = ['Nii ja naa …', 'Hea katse!', 'Tubli!', 'Suurepärane!'];

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
      <TopBar et="Tulemus" title="Mein Einsatzbericht" onBack={onHome} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={StyleSheet.absoluteFill}>
            <EstoniaScene height={290} night />
          </View>
          <View style={styles.stars}>
            {[0, 1, 2].map((i) => (
              <Kaheksakand
                key={i}
                size={i === 1 ? 52 : 40}
                color={i < result.stars ? colors.valge : colors.sinineDark}
                gap={colors.sinineDeep}
                center={i < result.stars ? colors.sinine : undefined}
              />
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
        </View>
        <Card style={{ borderLeftColor: run.condition >= 70 ? colors.rabaGreen : run.condition >= 40 ? colors.amber : colors.kihnuRed }}>
          <Eyebrow et="Haiglas" de="In der Klinik" />
          <Text style={[type.body, { marginTop: spacing.xs }]}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 22 }}>{outcome.emoji} </Text>
            {outcome.text}
          </Text>
        </Card>
        <Ornament count={10} />

        <Card>
          <Eyebrow et="Punktid" de="Meine Wertung" />
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
              Mein Verdacht war: {run.diagnosisGuess}
            </Text>
          )}
          <Text style={[type.body, { marginTop: spacing.sm }]}>{c.explanation}</Text>
          <Text style={[type.small, { marginTop: spacing.sm, fontFamily: fonts.bold, color: colors.must }]}>Leitsymptome</Text>
          {c.leitsymptome.map((s) => (
            <Text key={s} style={type.small}>
              • {s}
            </Text>
          ))}
        </Card>

        <Card style={{ borderLeftColor: colors.must }}>
          <Eyebrow et="Väärtused" de="Meine Messwerte" />
          {run.measured.map((m) => {
            const truth = rateVital(m.id, c.vitals[m.id]);
            const ok = truth === null || truth === m.guess;
            return (
              <View key={m.id} style={styles.line}>
                <Text style={[type.body, { flex: 1 }]}>
                  {VITAL_BY_ID[m.id].short}: {formatVital(m.id, c.vitals[m.id])}
                </Text>
                <Text style={{ color: ok ? colors.rabaGreen : colors.kihnuRed, fontFamily: fonts.bold }}>
                  {truth === null ? 'Befund' : ok ? `✓ ${truth}` : `✗ ${truth}`}
                </Text>
              </View>
            );
          })}
          {result.missedKeyVitals.length > 0 && (
            <Text style={[type.small, { color: colors.kihnuRed, marginTop: spacing.sm }]}>
              Das hätte ich messen sollen:{' '}
              {result.missedKeyVitals.map((id) => `${VITAL_BY_ID[id].short} (${formatVital(id, c.vitals[id])})`).join(', ')}
            </Text>
          )}
        </Card>

        <Card>
          <Eyebrow et="Ravi" de="Meine Maßnahmen" />
          {c.treatments.map((t, i) => {
            const chosen = run.treatmentGuess.includes(i);
            const ok = chosen === t.correct;
            return (
              <View key={i} style={styles.line}>
                <Text style={[type.small, { flex: 1, color: colors.must }]}>
                  {t.correct ? '✓' : '✗'} {t.text}
                </Text>
                <Text style={{ fontSize: 11, color: ok ? colors.rabaGreen : colors.kihnuRed, fontFamily: fonts.bold }}>
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
  hero: {
    height: 290,
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.sinineDeep,
  },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  praise: { color: colors.valge, fontSize: 22, fontFamily: fonts.display, marginTop: spacing.md },
  points: { color: colors.valge, fontSize: 30, fontFamily: fonts.displayBlack, marginTop: 2 },
  pointsMax: { fontSize: 16, color: colors.greyLight, fontFamily: fonts.semibold },
  diff: { color: colors.sinineLight, marginTop: spacing.xs, fontFamily: fonts.bold, fontSize: 13 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.lumiDark,
  },
  linePts: { fontFamily: fonts.extrabold, fontSize: 16 },
});
