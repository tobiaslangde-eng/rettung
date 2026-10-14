import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip } from '../components/Ems';
import { MonitorCard, ProgressTop, RateRow, ScoreHero } from '../components/Training';
import { Button, Card, Eyebrow, StatChip, TopBar } from '../components/UI';
import { Rating, VITAL_BY_ID, formatVital } from '../data/vitals';
import { QUIZ_POINTS, QUIZ_ROUNDS, makeQuiz } from '../game/quiz';
import { colors, fonts, monitor, spacing, type } from '../theme';

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
            {questions.map((qq, i) => {
              const ok = answers[i] === qq.answer;
              return (
                <View key={i} style={styles.line}>
                  <Text style={[type.body, { flex: 1 }]}>
                    {VITAL_BY_ID[qq.id].short}: {formatVital(qq.id, qq.value)}
                  </Text>
                  <Text style={{ fontFamily: fonts.bold, color: ok ? colors.mintDark : colors.red }}>
                    {ok ? `✓ ${qq.answer}` : `✗ ${qq.answer}`}
                  </Text>
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

  const def = VITAL_BY_ID[q.id];
  const right = given ? given === q.answer : null;

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Schnelltraining"
        title={`Wert ${round + 1} von ${QUIZ_ROUNDS}`}
        onBack={onBack}
        right={<StatChip value={correctCount} label="richtig" color={colors.mintTint} />}
      />
      <ProgressTop pct={(round + (given ? 1 : 0)) / QUIZ_ROUNDS} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.small}>Wie schätze ich diesen Wert bei einem Erwachsenen in Ruhe ein?</Text>
        <MonitorCard>
          <Text style={[styles.vitalShort, { color: monitor[q.id] }]}>{def.short}</Text>
          <Text style={styles.vitalName}>{def.name}</Text>
          <Text style={[styles.vitalValue, { color: monitor[q.id] }]}>{formatVital(q.id, q.value)}</Text>
          <View style={{ alignSelf: 'stretch' }}>
            <EcgStrip height={40} beats={4} color={monitor[q.id]} />
          </View>
        </MonitorCard>

        <RateRow given={given} answer={q.answer} onPick={answer} />

        {given && (
          <>
            <Card style={{ borderLeftColor: right ? colors.mint : colors.red }}>
              <Text style={[type.headline, { marginTop: spacing.xs }]}>
                {right ? `Richtig – ${q.answer}!` : `Leider falsch – der Wert ist ${q.answer}.`}
              </Text>
              <Text style={type.small}>Normalbereich: {def.normal}</Text>
            </Card>
            <Button label={round + 1 < QUIZ_ROUNDS ? 'Nächster Wert' : 'Auswertung'} variant="dark" onPress={next} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  vitalShort: { fontFamily: fonts.mono, fontSize: 14, letterSpacing: 3 },
  vitalName: { fontFamily: fonts.regular, fontSize: 14, color: colors.grau300, marginTop: 2 },
  vitalValue: { fontFamily: fonts.displayBlack, fontSize: 62, lineHeight: 68, marginVertical: spacing.sm, letterSpacing: -2 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
});
