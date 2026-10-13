import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip, RatingStar, WarnStripes } from '../components/Ems';
import { Button, Card, Eyebrow, TopBar } from '../components/UI';
import { QUIZ_POINTS, QUIZ_ROUNDS, makeKnowledgeQuiz } from '../game/quiz';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Wissensfragen: 10 Fragen aus dem Rettungsdienst-Alltag mit je vier Antworten. */
export function KnowledgeScreen({
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
  const [quizKey, setQuizKey] = useState(0);
  const rounds = useMemo(() => makeKnowledgeQuiz(), [quizKey]);
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const r = rounds[round];
  const given = answers[round] ?? null;
  const correctCount = answers.filter((a, i) => a === rounds[i].answer).length;

  const answer = (i: number) => {
    if (given !== null) return;
    setAnswers((a) => {
      const next = [...a];
      next[round] = i;
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
        <TopBar kicker="Wissensfragen" title="Ergebnis" onBack={onBack} />
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
            {rounds.map((rr, i) => {
              const ok = answers[i] === rr.answer;
              return (
                <View key={rr.question.id} style={styles.line}>
                  <Text style={{ fontFamily: fonts.bold, color: ok ? colors.gruen : colors.signalrot, width: 18 }}>
                    {ok ? '✓' : '✗'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.small, { color: colors.graphit }]}>{rr.question.question}</Text>
                    <Text style={[type.small, { fontFamily: fonts.bold, color: colors.graphit }]}>{rr.question.answers[0]}</Text>
                  </View>
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

  const right = given !== null ? given === r.answer : null;

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Wissensfragen"
        title={`Frage ${round + 1} von ${QUIZ_ROUNDS}`}
        onBack={onBack}
        right={
          <View style={styles.counter}>
            <Text style={styles.counterValue}>{correctCount}</Text>
            <Text style={styles.counterLabel}>richtig</Text>
          </View>
        }
      />
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${((round + (given !== null ? 1 : 0)) / QUIZ_ROUNDS) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionBox}>
          <Text style={styles.question}>{r.question.question}</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {r.options.map((opt, i) => {
            const chosen = given === i;
            const isAnswer = given !== null && r.answer === i;
            return (
              <Pressable
                key={opt}
                disabled={given !== null}
                onPress={() => answer(i)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { opacity: 0.85 },
                  isAnswer ? styles.optionRight : chosen ? styles.optionWrong : null,
                  given !== null && !chosen && !isAnswer ? { opacity: 0.45 } : null,
                ]}
              >
                <Text style={[styles.letter, (isAnswer || chosen) && { color: colors.weiss }]}>{LETTERS[i]}</Text>
                <Text style={[styles.optionText, (isAnswer || chosen) && { color: colors.weiss }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {given !== null && (
          <>
            <Card style={{ borderLeftColor: right ? colors.gruen : colors.signalrot }}>
              <Text style={[type.body, { fontFamily: fonts.bold }]}>{right ? 'Richtig!' : 'Leider falsch.'}</Text>
              <Text style={[type.body, { marginTop: spacing.xs }]}>{r.question.explanation}</Text>
            </Card>
            <Button label={round + 1 < QUIZ_ROUNDS ? 'Nächste Frage' : 'Auswertung'} variant="dark" onPress={next} />
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
  questionBox: { backgroundColor: colors.nacht, borderRadius: 8, padding: spacing.xl },
  question: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.weiss },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.weiss,
    borderWidth: 1.5,
    borderColor: colors.grau200,
    borderRadius: 6,
    padding: spacing.md,
  },
  optionRight: { backgroundColor: colors.gruen, borderColor: colors.gruen },
  optionWrong: { backgroundColor: colors.signalrot, borderColor: colors.signalrot },
  letter: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.blaulicht, width: 20 },
  optionText: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.graphit },
  monitor: { backgroundColor: colors.nacht, borderRadius: 8, paddingTop: spacing.lg, alignItems: 'center', overflow: 'hidden' },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bigScore: { fontFamily: fonts.displayBlack, fontSize: 64, color: colors.weiss, marginTop: spacing.sm },
  bigScoreOf: { fontSize: 28, color: colors.grau300 },
  gain: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.monitorGruen, marginBottom: spacing.sm },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grau200,
  },
});
