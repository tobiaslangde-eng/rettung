import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip, RatingStar, WarnStripes } from '../components/Ems';
import { Button, Card, Eyebrow, TopBar } from '../components/UI';
import { Rating, VITAL_BY_ID, formatVital } from '../data/vitals';
import { QUIZ_POINTS, QUIZ_ROUNDS, makeQuiz } from '../game/quiz';
import { colors, fonts, monitor, spacing, type } from '../theme';

const RATINGS: { value: Rating; label: string; symbol: string }[] = [
  { value: 'niedrig', label: 'niedrig', symbol: '↓' },
  { value: 'normal', label: 'normal', symbol: '✓' },
  { value: 'hoch', label: 'hoch', symbol: '↑' },
];

/** Schnelltraining: 10 Messwerte nacheinander als niedrig, normal oder hoch einstufen. */
export function QuizScreen({
  best,
  onFinish,
  onBack,
}: {
  best: number;
  onFinish: (correct: number) => void;
  onBack: () => void;
}) {
  // Bestwert vor dieser Runde – der Prop `best` ist nach onFinish schon aktualisiert.
  const [prevBest, setPrevBest] = useState(best);
  const [round, setRound] = useState(0);
  const [quizKey, setQuizKey] = useState(0);
  const questions = useMemo(() => makeQuiz(), [quizKey]);
  const [answers, setAnswers] = useState<(Rating | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[round];
  const given = answers[round] ?? null;
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;

  const answer = (r: Rating) => {
    if (given) return;
    setAnswers((a) => {
      const next = [...a];
      next[round] = r;
      return next;
    });
  };

  const next = () => {
    if (round + 1 < QUIZ_ROUNDS) {
      setRound(round + 1);
    } else {
      setFinished(true);
      onFinish(correctCount);
    }
  };

  const restart = () => {
    setPrevBest(best);
    setQuizKey((k) => k + 1);
    setRound(0);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const stars = correctCount >= 10 ? 3 : correctCount >= 8 ? 2 : correctCount >= 5 ? 1 : 0;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Schnelltraining" title="Ergebnis" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.monitor}>
            <View style={styles.stars}>
              {[0, 1, 2].map((i) => (
                <RatingStar key={i} size={i === 1 ? 48 : 36} filled={i < stars} />
              ))}
            </View>
            <Text style={styles.bigScore}>
              {correctCount}
              <Text style={styles.bigScoreOf}> / {QUIZ_ROUNDS}</Text>
            </Text>
            <Text style={styles.gain}>+{correctCount * QUIZ_POINTS} Punkte</Text>
            <View style={{ alignSelf: 'stretch' }}>
              <EcgStrip height={44} beats={4} />
            </View>
          </View>
          <Text style={[type.small, { textAlign: 'center' }]}>
            {correctCount > prevBest ? 'Neuer Bestwert!' : `Mein Bestwert: ${Math.max(prevBest, correctCount)} / ${QUIZ_ROUNDS}`}
          </Text>
          <Card>
            <Eyebrow title="Auflösung" />
            {questions.map((qq, i) => {
              const ok = answers[i] === qq.answer;
              return (
                <View key={i} style={styles.line}>
                  <Text style={[type.body, { flex: 1 }]}>
                    {VITAL_BY_ID[qq.id].short}: {formatVital(qq.id, qq.value)}
                  </Text>
                  <Text style={{ fontFamily: fonts.bold, color: ok ? colors.gruen : colors.signalrot }}>
                    {ok ? `✓ ${qq.answer}` : `✗ ${qq.answer}`}
                  </Text>
                </View>
              );
            })}
          </Card>
          <Button label="Noch eine Runde" variant="alarm" onPress={restart} />
          <Button label="Zum Hauptmenü" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  const def = VITAL_BY_ID[q.id];
  const right = given ? given === q.answer : null;

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Schnelltraining"
        title={`Wert ${round + 1} von ${QUIZ_ROUNDS}`}
        onBack={onBack}
        right={
          <View style={styles.counter}>
            <Text style={styles.counterValue}>{correctCount}</Text>
            <Text style={styles.counterLabel}>richtig</Text>
          </View>
        }
      />
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${((round + (given ? 1 : 0)) / QUIZ_ROUNDS) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.small}>Wie schätze ich diesen Wert bei einem Erwachsenen in Ruhe ein?</Text>
        <View style={styles.monitor}>
          <Text style={[styles.vitalShort, { color: monitor[q.id] }]}>{def.short}</Text>
          <Text style={styles.vitalName}>{def.name}</Text>
          <Text style={[styles.vitalValue, { color: monitor[q.id] }]}>{formatVital(q.id, q.value)}</Text>
          <View style={{ alignSelf: 'stretch' }}>
            <EcgStrip height={40} beats={4} color={monitor[q.id]} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {RATINGS.map((r) => {
            const chosen = given === r.value;
            const isAnswer = given && q.answer === r.value;
            return (
              <Pressable
                key={r.value}
                disabled={!!given}
                onPress={() => answer(r.value)}
                style={[
                  styles.rateBtn,
                  isAnswer ? { backgroundColor: colors.gruen } : chosen ? { backgroundColor: colors.signalrot } : null,
                  given && !chosen && !isAnswer ? { opacity: 0.4 } : null,
                ]}
              >
                <Text style={styles.rateSymbol}>{r.symbol}</Text>
                <Text style={styles.rateLabel}>{r.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {given && (
          <>
            <Card style={{ borderLeftColor: right ? colors.gruen : colors.signalrot }}>
              <Text style={[type.body, { fontFamily: fonts.bold }]}>
                {right ? `Richtig – ${q.answer}!` : `Leider falsch – der Wert ist ${q.answer}.`}
              </Text>
              <Text style={type.small}>Normalbereich: {def.normal}</Text>
            </Card>
            <Button
              label={round + 1 < QUIZ_ROUNDS ? 'Nächster Wert' : 'Auswertung'}
              variant="dark"
              onPress={next}
            />
          </>
        )}
        <WarnStripes />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  progress: { height: 6, backgroundColor: colors.grau200 },
  progressFill: { height: 6, backgroundColor: colors.signalrot },
  counter: { alignItems: 'center', borderWidth: 1, borderColor: colors.blaulicht, paddingHorizontal: 8, paddingVertical: 2 },
  counterValue: { color: colors.weiss, fontFamily: fonts.extrabold, fontSize: 16 },
  counterLabel: { color: colors.grau300, fontFamily: fonts.regular, fontSize: 9, letterSpacing: 1 },
  monitor: {
    backgroundColor: colors.nacht,
    borderRadius: 8,
    paddingTop: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  vitalShort: { fontFamily: fonts.extrabold, fontSize: 14, letterSpacing: 2 },
  vitalName: { fontFamily: fonts.regular, fontSize: 14, color: colors.grau300, marginTop: 2 },
  vitalValue: { fontFamily: fonts.displayBlack, fontSize: 56, lineHeight: 62, marginVertical: spacing.sm },
  rateBtn: {
    flex: 1,
    backgroundColor: colors.blaulicht,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: 6,
  },
  rateSymbol: { color: colors.weiss, fontSize: 24, fontFamily: fonts.extrabold },
  rateLabel: { color: colors.weiss, fontSize: 13, fontFamily: fonts.semibold },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bigScore: { fontFamily: fonts.displayBlack, fontSize: 64, color: colors.weiss, marginTop: spacing.sm },
  bigScoreOf: { fontSize: 28, color: colors.grau300 },
  gain: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.monitorGruen, marginBottom: spacing.sm },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grau200,
  },
});
