import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProgressTop, ScoreHero } from '../components/Training';
import { Button, Card, StatChip, Tap, TopBar } from '../components/UI';
import { MANV_ROUND, ManvPatient, TRIAGE, TRIAGE_ORDER, Triage, triage } from '../data/manv';
import { makeManvRound, manvPoints } from '../game/manv';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

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
            <View style={styles.alarmTag}>
              <Text style={styles.alarmTagText}>📟 Massenanfall von Verletzten</Text>
            </View>
            <Text style={styles.alarmTitle}>{round.scenario}</Text>
            <Text style={styles.alarmText}>
              {MANV_ROUND} Verletzte. Wir sind das erste Team vor Ort. Bevor ich jemanden behandle, sichte ich alle – damit die
              Schwerstverletzten zuerst Hilfe bekommen.
            </Text>
          </View>
          <Card style={{ borderLeftColor: colors.yellow }}>
            <Text style={[type.eyebrow, { marginTop: spacing.sm }]}>Mein Sichtungs-Schema</Text>
            {SCHEMA.map((s, i) => (
              <View key={s} style={styles.schemaRow}>
                <View style={styles.schemaNum}>
                  <Text style={styles.schemaNumText}>{i + 1}</Text>
                </View>
                <Text style={[type.body, { flex: 1 }]}>{s}</Text>
              </View>
            ))}
          </Card>
          <View style={styles.legend}>
            {TRIAGE_ORDER.map((t) => (
              <View key={t} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: TRIAGE[t].color }]} />
                <Text style={[type.small, { flex: 1 }]}>
                  <Text style={{ fontFamily: fonts.bold, color: colors.ink }}>{TRIAGE[t].label}</Text> · {TRIAGE[t].text}
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
          <ScoreHero
            stars={stars}
            big={String(correctCount)}
            unit={`/ ${MANV_ROUND}`}
            points={manvPoints(correctCount)}
            note={`richtig gesichtet · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} min${
              correctCount > prevBest ? ' · 🏆 Neuer Bestwert!' : ''
            }`}
          />
          <Card>
            <Text style={type.eyebrow}>Auflösung</Text>
            {round.patients.map((p, i) => {
              const t = triage(p);
              const ok = answers[i] === t.cat;
              return (
                <View key={p.id} style={styles.line}>
                  <View style={[styles.tag, { backgroundColor: TRIAGE[t.cat].color }]}>
                    <Text style={[styles.tagText, (t.cat === 'gelb' || t.cat === 'gruen') && { color: colors.ink }]}>
                      {TRIAGE[t.cat].label}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.small, { fontFamily: fonts.bold, color: colors.ink }]}>{p.who}</Text>
                    <Text style={type.small}>{t.reason}</Text>
                    {!ok && <Text style={[type.small, { color: colors.red }]}>Meine Sichtung: {TRIAGE[answers[i]].label}</Text>}
                  </View>
                  <Text style={{ fontFamily: fonts.displayBlack, fontSize: 18, color: ok ? colors.mintDark : colors.red }}>
                    {ok ? '✓' : '✗'}
                  </Text>
                </View>
              );
            })}
          </Card>
          <Button label="Neuer Großeinsatz" variant="alarm" onPress={again} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
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
        right={<StatChip value={correctCount} label="richtig" color={colors.mintTint} />}
      />
      <ProgressTop pct={(index + (given ? 1 : 0)) / round.patients.length} color={colors.orange} />
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
            const light = t === 'gelb' || t === 'gruen';
            const fg = light ? colors.onBright : colors.white;
            return (
              <Tap
                key={t}
                disabled={!!given}
                onPress={() => setAnswers((a) => [...a.slice(0, index), t])}
                offset={given && (chosen || isAnswer) ? 0 : 4}
                accessibilityLabel={TRIAGE[t].label}
                style={[
                  styles.triageBtn,
                  { backgroundColor: TRIAGE[t].color },
                  given && !chosen && !isAnswer && { opacity: 0.3 },
                  given && (chosen || isAnswer) && { transform: [{ translateY: 3 }] },
                  isAnswer && styles.triageAnswer,
                ]}
              >
                <Text style={[styles.triageLabel, { color: fg }]}>{TRIAGE[t].label}</Text>
                <Text style={[styles.triageShort, { color: fg }]}>
                  {chosen ? (isAnswer ? '✓ meine Wahl' : '✗ meine Wahl') : isAnswer ? '← richtig' : TRIAGE[t].short}
                </Text>
              </Tap>
            );
          })}
        </View>

        {given && (
          <>
            <Card style={{ borderLeftColor: given === truth.cat ? colors.mint : colors.red }}>
              <Text style={type.headline}>
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
  alarm: {
    backgroundColor: colors.orange,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.sm,
    ...hardShadow(6),
  },
  alarmTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  alarmTagText: { color: colors.white, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  alarmTitle: { color: colors.ink, fontFamily: fonts.displayBlack, fontSize: 30, lineHeight: 32, letterSpacing: -1 },
  alarmText: { color: colors.ink, fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  schemaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.sm },
  schemaNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.yellow,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  schemaNumText: { fontFamily: fonts.displayBlack, fontSize: 12, color: colors.ink },
  legend: { gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 18, height: 18, borderRadius: 6, borderWidth: 1, borderColor: colors.line },
  patient: {
    backgroundColor: colors.monitorBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    ...hardShadow(4),
  },
  who: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 30, color: colors.white, letterSpacing: -0.8 },
  patientText: { fontFamily: fonts.italic, fontSize: 15, lineHeight: 21, color: colors.grau200, marginTop: spacing.xs },
  finding: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1.5,
    borderTopColor: colors.graphitSoft,
    borderStyle: 'dashed',
    paddingTop: 6,
  },
  findingKey: { fontFamily: fonts.medium, fontSize: 14, color: colors.grau300 },
  findingValue: { fontFamily: fonts.mono, fontSize: 14, color: colors.monitorGruen, flexShrink: 1, textAlign: 'right' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  triageBtn: {
    width: '47%',
    flexGrow: 1,
    paddingVertical: spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  triageAnswer: { borderWidth: 4, borderColor: colors.line },
  triageLabel: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 32, letterSpacing: -0.8 },
  triageShort: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1 },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    minWidth: 64,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  tagText: { fontFamily: fonts.mono, fontSize: 11, color: colors.white, textTransform: 'uppercase', letterSpacing: 0.5 },
});
