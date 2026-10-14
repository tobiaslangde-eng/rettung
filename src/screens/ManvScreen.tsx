import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RatingStar } from '../components/Ems';
import { Button, Card, Eyebrow, TopBar } from '../components/UI';
import { MANV_ROUND, ManvPatient, TRIAGE, TRIAGE_ORDER, Triage, triage } from '../data/manv';
import { makeManvRound, manvPoints } from '../game/manv';
import { colors, fonts, spacing, type } from '../theme';

type Phase = 'intro' | 'sichten' | 'done';

const SCHEMA = [
  'Gehfähig? → Grün',
  'Spritzende Blutung? → Rot (sofort stoppen)',
  'Keine Atmung, auch nach Freimachen der Atemwege? → Schwarz',
  'Atmet erst nach Freimachen der Atemwege? → Rot',
  'Atemfrequenz über 30? → Rot',
  'Kein Radialispuls oder Rekapillarisierung über 2 s? → Rot',
  'Befolgt keine Aufforderungen? → Rot',
  'Sonst → Gelb',
];

function findings(p: ManvPatient): [string, string][] {
  const f: [string, string][] = [['Gehfähig', p.walks ? 'ja' : 'nein']];
  if (p.walks) return f;
  if (p.bleeding) return [...f, ['Spritzende Blutung', 'ja']];
  f.push([
    'Atmung',
    p.breathing === 'ja' ? 'ja' : p.breathing === 'nein' ? 'nein – auch nach Freimachen' : 'erst nach Freimachen der Atemwege',
  ]);
  if (p.breathing !== 'ja') return f;
  f.push(['Atemfrequenz', `${p.af} /min`]);
  f.push(['Radialispuls', p.radial ? 'tastbar' : 'nicht tastbar']);
  f.push(['Rekapillarisierung', `${String(p.recap).replace('.', ',')} s`]);
  f.push(['Befolgt Aufforderungen', p.obeys ? 'ja' : 'nein']);
  return f;
}

/** Großeinsatz: viele Verletzte, ich sichte und teile in Kategorien ein. */
export function ManvScreen({
  best,
  onFinish,
  onBack,
}: {
  best: number;
  onFinish: (correct: number) => void;
  onBack: () => void;
}) {
  const [roundKey, setRoundKey] = useState(0);
  const round = useMemo(() => makeManvRound(), [roundKey]);
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Triage[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [prevBest, setPrevBest] = useState(best);

  const patient = round.patients[index];
  const given = answers[index];
  const correctCount = answers.filter((a, i) => a === triage(round.patients[i]).cat).length;

  const start = () => {
    setPhase('sichten');
    setIndex(0);
    setAnswers([]);
    setStartedAt(Date.now());
  };

  const next = () => {
    if (index + 1 < round.patients.length) {
      setIndex(index + 1);
      return;
    }
    setSeconds(Math.round((Date.now() - startedAt) / 1000));
    setPhase('done');
    onFinish(correctCount);
  };

  const again = () => {
    setPrevBest(best);
    setRoundKey((k) => k + 1);
    setPhase('intro');
  };

  if (phase === 'intro') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Großeinsatz" title="MANV-Alarm" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.alarm}>
            <View style={{ padding: spacing.lg, gap: spacing.xs }}>
              <Text style={styles.alarmEyebrow}>📟 Massenanfall von Verletzten</Text>
              <Text style={styles.alarmTitle}>{round.scenario}</Text>
              <Text style={styles.alarmText}>
                {MANV_ROUND} Verletzte. Wir sind das erste Team vor Ort. Bevor ich jemanden behandle, sichte ich alle – damit die
                Schwerstverletzten zuerst Hilfe bekommen.
              </Text>
            </View>
          </View>
          <Card style={{ borderLeftColor: colors.warngelb }}>
            <Eyebrow title="Mein Sichtungs-Schema" />
            {SCHEMA.map((s, i) => (
              <Text key={s} style={[type.body, { marginTop: 4 }]}>
                {i + 1}. {s}
              </Text>
            ))}
          </Card>
          <View style={styles.legend}>
            {TRIAGE_ORDER.map((t) => (
              <View key={t} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: TRIAGE[t].color }]} />
                <Text style={type.small}>
                  <Text style={{ fontFamily: fonts.bold, color: colors.graphit }}>{TRIAGE[t].label}</Text> · {TRIAGE[t].text}
                </Text>
              </View>
            ))}
          </View>
          {best > 0 && (
            <Text style={[type.small, { textAlign: 'center' }]}>
              Mein Bestwert: {best} / {MANV_ROUND} richtig gesichtet
            </Text>
          )}
          <Button label="Sichtung starten" variant="alarm" onPress={start} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'done') {
    const stars = correctCount >= MANV_ROUND ? 3 : correctCount >= MANV_ROUND - 2 ? 2 : correctCount >= MANV_ROUND / 2 ? 1 : 0;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Großeinsatz" title="Sichtungsbericht" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.monitor}>
            <View style={styles.stars}>
              {[0, 1, 2].map((i) => (
                <RatingStar key={i} size={i === 1 ? 48 : 36} filled={i < stars} />
              ))}
            </View>
            <Text style={styles.bigScore}>
              {correctCount}
              <Text style={styles.bigScoreOf}> / {MANV_ROUND}</Text>
            </Text>
            <Text style={styles.monitorSub}>
              richtig gesichtet · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} min
            </Text>
            <Text style={styles.gain}>+{manvPoints(correctCount)} Punkte</Text>
          </View>
          <Text style={[type.small, { textAlign: 'center' }]}>
            {correctCount > prevBest ? 'Neuer Bestwert!' : `Mein Bestwert: ${Math.max(prevBest, correctCount)} / ${MANV_ROUND}`}
          </Text>
          <Card>
            <Eyebrow title="Auflösung" />
            {round.patients.map((p, i) => {
              const t = triage(p);
              const ok = answers[i] === t.cat;
              return (
                <View key={p.id} style={styles.line}>
                  <View style={[styles.tag, { backgroundColor: TRIAGE[t.cat].color }]}>
                    <Text style={[styles.tagText, t.cat === 'gelb' && { color: colors.graphit }]}>{TRIAGE[t.cat].label}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.small, { fontFamily: fonts.bold, color: colors.graphit }]}>{p.who}</Text>
                    <Text style={type.small}>{t.reason}</Text>
                    {!ok && (
                      <Text style={[type.small, { color: colors.signalrot }]}>Meine Sichtung: {TRIAGE[answers[i]].label}</Text>
                    )}
                  </View>
                  <Text style={{ fontFamily: fonts.bold, color: ok ? colors.gruen : colors.signalrot }}>{ok ? '✓' : '✗'}</Text>
                </View>
              );
            })}
          </Card>
          <Button label="Neuer Großeinsatz" variant="alarm" onPress={again} />
          <Button label="Zum Hauptmenü" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  const truth = triage(patient);
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Sichtung"
        title={`Person ${index + 1} von ${round.patients.length}`}
        onBack={onBack}
        right={
          <View style={styles.counter}>
            <Text style={styles.counterValue}>{correctCount}</Text>
            <Text style={styles.counterLabel}>richtig</Text>
          </View>
        }
      />
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${((index + (given ? 1 : 0)) / round.patients.length) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.patient}>
          <Text style={styles.who}>{patient.who}</Text>
          <Text style={styles.patientText}>{patient.text}</Text>
          <View style={{ marginTop: spacing.md, gap: 6 }}>
            {findings(patient).map(([k, v]) => (
              <View key={k} style={styles.finding}>
                <Text style={styles.findingKey}>{k}</Text>
                <Text style={styles.findingValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {TRIAGE_ORDER.map((t) => {
            const chosen = given === t;
            const isAnswer = !!given && truth.cat === t;
            return (
              <Pressable
                key={t}
                disabled={!!given}
                onPress={() => setAnswers((a) => [...a.slice(0, index), t])}
                style={({ pressed }) => [
                  styles.triageBtn,
                  { backgroundColor: TRIAGE[t].color },
                  pressed && { opacity: 0.85 },
                  given && !chosen && !isAnswer && { opacity: 0.3 },
                  isAnswer && styles.triageAnswer,
                ]}
              >
                <Text style={[styles.triageLabel, t === 'gelb' && { color: colors.graphit }]}>{TRIAGE[t].label}</Text>
                <Text style={[styles.triageShort, t === 'gelb' && { color: colors.graphit }]}>
                  {chosen ? (isAnswer ? '✓ meine Wahl' : '✗ meine Wahl') : TRIAGE[t].short}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {given && (
          <>
            <Card style={{ borderLeftColor: given === truth.cat ? colors.gruen : colors.signalrot }}>
              <Text style={[type.body, { fontFamily: fonts.bold }]}>
                {given === truth.cat
                  ? `Richtig – ${TRIAGE[truth.cat].label}!`
                  : `Falsch – richtig ist ${TRIAGE[truth.cat].label}.`}
              </Text>
              <Text style={[type.body, { marginTop: spacing.xs }]}>{truth.reason}</Text>
            </Card>
            <Button
              label={index + 1 < round.patients.length ? 'Nächste Person' : 'Sichtung abschließen'}
              variant="dark"
              onPress={next}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  alarm: { backgroundColor: colors.graphit, borderRadius: 14, overflow: 'hidden' },
  alarmEyebrow: {
    color: colors.warngelb,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.4,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  alarmTitle: { color: colors.weiss, fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 31 },
  alarmText: { color: colors.grau300, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  legend: { gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 14, height: 14, borderRadius: 3, borderWidth: 1, borderColor: colors.grau300 },
  progress: { height: 6, backgroundColor: colors.grau200 },
  progressFill: { height: 6, backgroundColor: colors.signalrot },
  counter: {
    alignItems: 'center',
    backgroundColor: colors.blaulichtLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  counterValue: { color: colors.blaulicht, fontFamily: fonts.bold, fontSize: 17 },
  counterLabel: { color: colors.blaulicht, fontFamily: fonts.medium, fontSize: 10 },
  patient: { backgroundColor: colors.nacht, borderRadius: 16, padding: spacing.lg },
  who: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.weiss },
  patientText: { fontFamily: fonts.italic, fontSize: 15, lineHeight: 21, color: colors.grau200, marginTop: spacing.xs },
  finding: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.graphitSoft,
    paddingTop: 6,
  },
  findingKey: { fontFamily: fonts.semibold, fontSize: 14, color: colors.grau300 },
  findingValue: { fontFamily: fonts.extrabold, fontSize: 14, color: colors.monitorGruen, flexShrink: 1, textAlign: 'right' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  triageBtn: {
    width: '48%',
    flexGrow: 1,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  triageAnswer: { borderColor: colors.blaulicht },
  triageLabel: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.weiss },
  triageShort: { fontFamily: fonts.bold, fontSize: 12, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  monitor: { backgroundColor: colors.nacht, borderRadius: 16, padding: spacing.lg, alignItems: 'center' },
  monitorSub: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300, letterSpacing: 0.4, textTransform: 'uppercase' },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bigScore: { fontFamily: fonts.displayBlack, fontSize: 64, color: colors.weiss, marginTop: spacing.sm },
  bigScoreOf: { fontSize: 28, color: colors.grau300 },
  gain: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.monitorGruen, marginTop: spacing.sm },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grau200,
  },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, minWidth: 64, alignItems: 'center' },
  tagText: { fontFamily: fonts.extrabold, fontSize: 12, color: colors.weiss, textTransform: 'uppercase' },
});
