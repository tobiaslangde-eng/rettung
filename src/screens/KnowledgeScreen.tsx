import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerOption, ProgressTop, ScoreHero } from '../components/Training';
import { Button, Card, Eyebrow, StatChip, TopBar } from '../components/UI';
import { QUIZ_POINTS, QUIZ_ROUNDS, makeKnowledgeQuiz } from '../game/quiz';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

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
          <ScoreHero
            stars={stars}
            big={String(correctCount)}
            unit={`/ ${QUIZ_ROUNDS}`}
            points={correctCount * QUIZ_POINTS}
            note={
              correctCount > prevBest
                ? '🏆 Neuer Bestwert!'
                : `Mein Bestwert: ${Math.max(prevBest, correctCount)} / ${QUIZ_ROUNDS}`
            }
          />
          <Card>
            <Eyebrow title="Auflösung" />
            {rounds.map((rr, i) => {
              const ok = answers[i] === rr.answer;
              return (
                <View key={rr.question.id} style={styles.line}>
                  <Text
                    style={{ fontFamily: fonts.displayBlack, color: ok ? colors.mintDark : colors.red, width: 20, fontSize: 16 }}
                  >
                    {ok ? '✓' : '✗'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.small, { color: colors.ink }]}>{rr.question.question}</Text>
                    <Text style={[type.small, { fontFamily: fonts.bold, color: colors.ink }]}>{rr.question.answers[0]}</Text>
                  </View>
                </View>
              );
            })}
          </Card>
          <Button label="Noch eine Runde" variant="alarm" onPress={restart} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
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
        right={<StatChip value={correctCount} label="richtig" color={colors.mintTint} />}
      />
      <ProgressTop pct={(round + (given !== null ? 1 : 0)) / QUIZ_ROUNDS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionBox}>
          <Text style={styles.question}>{r.question.question}</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          {r.options.map((opt, i) => {
            const chosen = given === i;
            const isAnswer = given !== null && r.answer === i;
            const state = isAnswer ? 'right' : chosen ? 'wrong' : given !== null ? 'dim' : 'idle';
            return (
              <AnswerOption
                key={opt}
                letter={LETTERS[i]}
                text={opt}
                state={state}
                disabled={given !== null}
                onPress={() => answer(i)}
              />
            );
          })}
        </View>

        {given !== null && (
          <>
            <Card style={{ borderLeftColor: right ? colors.mint : colors.red }}>
              <Text style={[type.headline, { marginTop: spacing.xs }]}>{right ? 'Richtig!' : 'Leider falsch.'}</Text>
              <Text style={[type.body, { marginTop: spacing.xs }]}>{r.question.explanation}</Text>
            </Card>
            <Button label={round + 1 < QUIZ_ROUNDS ? 'Nächste Frage' : 'Auswertung'} variant="dark" onPress={next} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  questionBox: {
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: spacing.xl,
    ...hardShadow(5),
  },
  question: { fontFamily: fonts.displayBlack, fontSize: 25, lineHeight: 29, letterSpacing: -0.8, color: colors.ink },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
});
