import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DriveAnimation } from '../components/DriveAnimation';
import { Button, Card, Eyebrow, TopBar } from '../components/UI';
import { AskKati, Kati } from '../components/Kati';
import { MedCase } from '../data/cases';
import { INCIDENTS, INCIDENT_CONDITION } from '../data/incidents';
import { Rating, VITALS, VITAL_BY_ID, VitalId, formatVital, normalText, rateVital } from '../data/vitals';
import { DifficultyDef, HINT_COST } from '../game/difficulty';
import { EquipmentEffects } from '../game/equipment';
import { CONDITION, CaseRun, MINUTES_PER_MEASUREMENT, clampCondition, shuffle } from '../game/scoring';
import { Columns, useLayout } from '../layout';
import { colors, fonts, monitor, spacing, type } from '../theme';

type Phase = 'alarm' | 'drive' | 'exam' | 'diagnosis' | 'treatment';

const NO_EQUIPMENT: EquipmentEffects = { startBonus: 0, measureFactor: 1, drainFactor: 1, endBonus: 0, pointsPct: 0 };

const STEPS: { phase: Phase; de: string }[] = [
  { phase: 'alarm', de: 'Alarm' },
  { phase: 'exam', de: 'Untersuchung' },
  { phase: 'diagnosis', de: 'Diagnose' },
  { phase: 'treatment', de: 'Maßnahmen' },
];

const RATINGS: { value: Rating; label: string; symbol: string }[] = [
  { value: 'niedrig', label: 'niedrig', symbol: '↓' },
  { value: 'normal', label: 'normal', symbol: '✓' },
  { value: 'hoch', label: 'hoch', symbol: '↑' },
];

function mood(condition: number) {
  if (condition >= 70) return '🙂';
  if (condition >= 40) return '😣';
  return '😵';
}

function conditionColor(condition: number) {
  if (condition >= 70) return colors.gruen;
  if (condition >= 40) return colors.amber;
  return colors.signalrot;
}

export function CaseScreen({
  medCase,
  difficulty,
  daily = false,
  equipment = NO_EQUIPMENT,
  rtwLevel = 1,
  onFinish,
  onAbort,
}: {
  medCase: MedCase;
  difficulty: DifficultyDef;
  daily?: boolean;
  /** Wirkung meiner Ausrüstung aus der Fahrzeughalle */
  equipment?: EquipmentEffects;
  rtwLevel?: number;
  onFinish: (run: CaseRun) => void;
  onAbort: () => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const L = useLayout();
  /** Auf breiten Bildschirmen bleiben Bedienfelder unten mittig und lesbar breit */
  const sidePad = Math.max(spacing.lg, (L.width - 760) / 2);
  const [phase, setPhase] = useState<Phase>('alarm');
  const [measured, setMeasured] = useState<CaseRun['measured']>([]);
  const [pending, setPending] = useState<VitalId | null>(null);
  const [diagnosisGuess, setDiagnosisGuess] = useState<string | null>(null);
  const [diagnosisLocked, setDiagnosisLocked] = useState(false);
  const [treatmentGuess, setTreatmentGuess] = useState<number[]>([]);
  const [condition, setCondition] = useState<number>(clampCondition(CONDITION.start + equipment.startBonus));
  const [hintsUsed, setHintsUsed] = useState(0);
  const [examHint, setExamHint] = useState(difficulty.hints === 'gratis');
  const [fiftyFifty, setFiftyFifty] = useState(false);
  const incident = INCIDENTS[medCase.id];
  const incidentOptions = useMemo(() => (incident ? shuffle(incident.options) : []), [incident]);
  const [incidentChoice, setIncidentChoice] = useState<string | null>(null);
  const [incidentClosed, setIncidentClosed] = useState(false);
  /** Ich wollte schon zur Diagnose, bevor der Zwischenfall kam – danach geht es direkt weiter. */
  const [wantsDiagnosis, setWantsDiagnosis] = useState(false);

  const diagnosisOptions = useMemo(() => shuffle([medCase.diagnosis, ...medCase.distractors]), [medCase]);
  /** Bei 50:50 fallen diese beiden falschen Antworten weg */
  const removedByFifty = useMemo(() => shuffle([...medCase.distractors]).slice(0, 2), [medCase]);
  const treatmentOrder = useMemo(() => shuffle(medCase.treatments.map((_, i) => i)), [medCase]);

  const firstName = medCase.patient.name.split(' ')[0];

  // Schwer: Der Patient verschlechtert sich in Echtzeit, solange ich untersuche und überlege.
  const incidentActive =
    !!incident &&
    phase === 'exam' &&
    !pending &&
    !incidentClosed &&
    (measured.length >= incident.afterMeasurements || wantsDiagnosis);
  const draining = difficulty.drainPerSecond > 0 && (phase === 'exam' || (phase === 'diagnosis' && !diagnosisLocked));
  useEffect(() => {
    if (!draining) return;
    const drain = difficulty.drainPerSecond * equipment.drainFactor;
    const t = setInterval(() => setCondition((c) => clampCondition(c - drain)), 1000);
    return () => clearInterval(t);
  }, [draining, difficulty.drainPerSecond, equipment.drainFactor]);

  const goto = useCallback((p: Phase) => {
    setPhase(p);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);
  const arrive = useCallback(() => goto('exam'), [goto]);

  const takeHint = () => {
    if (difficulty.hints === 'kostet') setHintsUsed((h) => h + 1);
  };

  const measure = (id: VitalId) => {
    if (pending || measured.some((m) => m.id === id)) return;
    setCondition((c) => clampCondition(c - difficulty.measureCost * equipment.measureFactor));
    if (VITAL_BY_ID[id].textOnly) {
      setMeasured((m) => [...m, { id, guess: null }]);
    } else {
      setPending(id);
    }
  };

  const rate = (r: Rating) => {
    if (!pending) return;
    setMeasured((m) => [...m, { id: pending, guess: r }]);
    setPending(null);
  };

  const chooseIncident = (option: string) => {
    if (incidentChoice) return;
    setIncidentChoice(option);
    // Auf „Schwer“ ohne Sofort-Feedback wirkt die Entscheidung erst am Ende.
    if (difficulty.instantFeedback) {
      const ok = option === incident!.options[0];
      setCondition((c) => clampCondition(c + (ok ? INCIDENT_CONDITION.correct : INCIDENT_CONDITION.wrong)));
    }
  };

  const closeIncident = () => {
    setIncidentClosed(true);
    if (wantsDiagnosis) goto('diagnosis');
  };

  const toDiagnosis = () => {
    if (incident && !incidentClosed) setWantsDiagnosis(true);
    else goto('diagnosis');
  };

  const lockDiagnosis = () => {
    setDiagnosisLocked(true);
    if (diagnosisGuess !== medCase.diagnosis) setCondition((c) => clampCondition(c + CONDITION.wrongDiagnosis));
  };

  const finish = () => {
    // Falsch eingestufte Werte und Maßnahmen wirken sich erst am Ende auf den Zustand aus,
    // damit auf „Schwer“ kein Feedback vorab durchsickert.
    let c = condition;
    for (const m of measured) {
      const truth = rateVital(m.id, medCase.vitals[m.id], medCase.patient.age);
      if (truth !== null && truth !== m.guess) c += CONDITION.wrongRating;
    }
    for (const i of treatmentGuess) {
      c += medCase.treatments[i].correct ? CONDITION.treatmentCorrect : CONDITION.treatmentWrong;
    }
    const incidentCorrect = incident && incidentChoice ? incidentChoice === incident.options[0] : undefined;
    if (incidentCorrect !== undefined && !difficulty.instantFeedback) {
      c += incidentCorrect ? INCIDENT_CONDITION.correct : INCIDENT_CONDITION.wrong;
    }
    onFinish({
      medCase,
      measured,
      diagnosisGuess: diagnosisGuess ?? '',
      treatmentGuess,
      difficulty: difficulty.id,
      condition: clampCondition(c + equipment.endBonus),
      hintsUsed,
      incidentCorrect,
    });
  };

  if (phase === 'drive') {
    return <DriveAnimation location={medCase.location} rtwLevel={rtwLevel} onDone={arrive} />;
  }

  const minutes = 4 + measured.length * MINUTES_PER_MEASUREMENT + (pending ? MINUTES_PER_MEASUREMENT : 0);
  const stepIndex = STEPS.findIndex((s) => s.phase === phase);
  const p = medCase.patient;
  const missingKey = medCase.keyVitals.find((id) => !measured.some((m) => m.id === id));
  const examHintText = missingKey
    ? `Miss doch mal ${VITAL_BY_ID[missingKey].name} – das ist hier wichtig!`
    : `Wir haben alles Wichtige gemessen. Was meinst du, was ${firstName} hat?`;
  const hintCostLabel = difficulty.hints === 'kostet' ? ` (−${HINT_COST} Punkte)` : '';

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker={`Schritt ${stepIndex + 1} von ${STEPS.length}`}
        title={STEPS[stepIndex].de}
        onBack={onAbort}
        right={
          <View style={styles.clock}>
            <Text style={styles.clockValue}>{minutes}′</Text>
            <Text style={styles.clockLabel}>Min.</Text>
          </View>
        }
      />
      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s.phase} style={[styles.step, i <= stepIndex && styles.stepActive]}>
            <Text style={[styles.stepText, i <= stepIndex && { color: colors.weiss }]}>{s.de}</Text>
          </View>
        ))}
      </View>
      {phase !== 'alarm' && (
        <View style={styles.condition}>
          <Text style={styles.mood}>{mood(condition)}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.conditionLabel}>
              Zustand von {firstName}
              {draining ? '  · verschlechtert sich!' : ''}
            </Text>
            <View style={styles.conditionTrack}>
              <View style={[styles.conditionFill, { width: `${condition}%`, backgroundColor: conditionColor(condition) }]} />
            </View>
          </View>
          <Text style={styles.conditionValue}>{Math.round(condition)}%</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          L.wide && { width: '100%', maxWidth: phase === 'exam' ? 1180 : 780, alignSelf: 'center', padding: spacing.xl },
        ]}
      >
        {phase === 'alarm' && (
          <>
            <View style={styles.alarm}>
              <View style={styles.alarmBody}>
                {daily && <Text style={styles.dailyTag}>⭐ Einsatz des Tages · +50 % Punkte</Text>}
                <Text style={styles.alarmEyebrow}>📟 Alarm · Mein Melder piept!</Text>
                <Text style={styles.alarmText}>Leitstelle: „{medCase.dispatch}“</Text>
                <Text style={styles.alarmLoc}>{medCase.location}</Text>
              </View>
            </View>
            <Card>
              <Eyebrow title="Patient" />
              <Text style={[type.h2, { marginTop: spacing.xs }]}>{p.name}</Text>
              <Text style={type.small}>
                {p.sex === 'm' ? 'männlich' : 'weiblich'}, {p.age} Jahre · {difficulty.label} {difficulty.icon}
              </Text>
            </Card>
            <Kati>
              Komm, schnapp dir den Notfallrucksack – wir fahren! Denk dran: Jede Messung kostet Zeit
              {difficulty.drainPerSecond > 0 ? ', und heute zählt jede Sekunde.' : '.'}
            </Kati>
            <Button label="Los geht's!" variant="alarm" onPress={() => goto('drive')} />
          </>
        )}

        {phase === 'exam' && (
          <>
            <Columns
              wide={L.wide}
              weights={[5, 6]}
              cols={[
                <>
                  <Card style={{ borderLeftColor: colors.signalrot }}>
                    <Eyebrow title="Ich komme an" />
                    <Text style={[type.body, { marginTop: spacing.xs, fontFamily: fonts.italic }]}>{medCase.scene}</Text>
                  </Card>
                  <Card>
                    <Eyebrow title="Was ich höre" />
                    {medCase.anamnese.map((a, i) => (
                      <Text key={i} style={[type.body, { marginTop: spacing.xs }]}>
                        • {a}
                      </Text>
                    ))}
                  </Card>
                  <Card style={{ borderLeftColor: colors.graphit }}>
                    <Eyebrow title="Was ich sehe" />
                    {medCase.befund.map((b, i) => (
                      <Text key={i} style={[type.body, { marginTop: spacing.xs }]}>
                        • {b}
                      </Text>
                    ))}
                  </Card>
                </>,
                <>
                  <Eyebrow title="Was messe ich?" />
                  <View style={styles.grid}>
                    {VITALS.map((v) => {
                      const done = measured.find((m) => m.id === v.id);
                      const isPending = pending === v.id;
                      const value = medCase.vitals[v.id];
                      const truth = rateVital(v.id, value, medCase.patient.age);
                      const right = done && truth !== null && difficulty.instantFeedback ? done.guess === truth : null;
                      return (
                        <Pressable
                          key={v.id}
                          onPress={() => measure(v.id)}
                          disabled={!!done || !!pending}
                          style={[
                            styles.tile,
                            v.textOnly && styles.tileWide,
                            isPending && styles.tilePending,
                            right === true && styles.tileRight,
                            right === false && styles.tileWrong,
                          ]}
                        >
                          <View style={styles.tileHead}>
                            <View style={[styles.tileDot, { backgroundColor: monitor[v.id] }]} />
                            <Text style={styles.tileShort}>{v.short}</Text>
                          </View>
                          <Text style={styles.tileName}>{v.name}</Text>
                          {done || isPending ? (
                            <Text style={[styles.tileValue, v.textOnly && { fontFamily: fonts.regular, fontSize: 14 }]}>
                              {formatVital(v.id, value)}
                            </Text>
                          ) : (
                            <Text style={styles.tileTap}>Messen ›</Text>
                          )}
                          {done && truth !== null && right !== null && (
                            <Text style={[styles.tileFeedback, { color: right ? colors.gruen : colors.signalrot }]}>
                              {right ? `✓ ${truth}` : `✗ eigentlich ${truth}`} · Norm {normalText(v.id, medCase.patient.age)}
                            </Text>
                          )}
                          {done && truth !== null && right === null && (
                            <Text style={[styles.tileFeedback, { color: colors.grau500 }]}>meine Einschätzung: {done.guess}</Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                  {!pending &&
                    difficulty.hints !== 'keine' &&
                    (examHint ? (
                      <Kati>{examHintText}</Kati>
                    ) : (
                      <AskKati
                        label={`Kati fragen, was ich messen soll${hintCostLabel}`}
                        onPress={() => {
                          setExamHint(true);
                          takeHint();
                        }}
                      />
                    ))}

                  <Button
                    label="Ich habe einen Verdacht"
                    disabled={!!pending || measured.length === 0 || incidentActive}
                    onPress={toDiagnosis}
                  />
                </>,
              ]}
            />
          </>
        )}

        {phase === 'diagnosis' && (
          <>
            <Card>
              <Eyebrow title="Meine Befunde" />
              <Text style={[type.small, { marginTop: spacing.xs }]}>{medCase.befund.join(' · ')}</Text>
              <View style={styles.summaryRow}>
                {measured.map((m) => (
                  <Text key={m.id} style={styles.summaryChip}>
                    {VITAL_BY_ID[m.id].short} {formatVital(m.id, medCase.vitals[m.id])}
                  </Text>
                ))}
              </View>
            </Card>
            <Text style={type.h2}>Ich überlege … was hat {firstName}?</Text>
            {diagnosisOptions.map((d) => {
              const removed = fiftyFifty && removedByFifty.includes(d);
              const selected = diagnosisGuess === d;
              const isCorrect = d === medCase.diagnosis;
              const reveal = diagnosisLocked && difficulty.instantFeedback;
              let style = selected ? styles.optionSelected : null;
              if (reveal && isCorrect) style = styles.optionRight;
              else if (reveal && selected) style = styles.optionWrong;
              return (
                <Pressable
                  key={d}
                  disabled={diagnosisLocked || removed}
                  onPress={() => setDiagnosisGuess(d)}
                  style={[styles.option, style, removed && styles.optionRemoved]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (selected || (reveal && isCorrect)) && { color: colors.weiss },
                      removed && { textDecorationLine: 'line-through', color: colors.grau300 },
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
            {!diagnosisLocked && !fiftyFifty && difficulty.hints !== 'keine' && (
              <AskKati
                label={`Kati: „Lass uns zwei ausschließen“ – 50:50${hintCostLabel}`}
                onPress={() => {
                  setFiftyFifty(true);
                  takeHint();
                  if (diagnosisGuess && removedByFifty.includes(diagnosisGuess)) setDiagnosisGuess(null);
                }}
              />
            )}
            {diagnosisLocked ? (
              <>
                {difficulty.instantFeedback ? (
                  <Kati>
                    {diagnosisGuess === medCase.diagnosis
                      ? `Genau, das denke ich auch: ${medCase.diagnosis}!`
                      : `Hm, ich glaube eher, es ist: ${medCase.diagnosis}. ${firstName} geht es schlechter …`}
                  </Kati>
                ) : (
                  <Kati>Okay, ich vertraue dir. Was machen wir jetzt?</Kati>
                )}
                <Button label="Jetzt handeln" onPress={() => goto('treatment')} />
              </>
            ) : (
              <Button label="Das ist meine Diagnose" variant="dark" disabled={!diagnosisGuess} onPress={lockDiagnosis} />
            )}
          </>
        )}

        {phase === 'treatment' && (
          <>
            <Text style={type.h2}>Was mache ich jetzt?</Text>
            <Text style={type.small}>Ich wähle alle richtigen Maßnahmen. Falsche Maßnahmen schaden {firstName}.</Text>
            {treatmentOrder.map((i) => {
              const t = medCase.treatments[i];
              const on = treatmentGuess.includes(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => setTreatmentGuess((g) => (on ? g.filter((x) => x !== i) : [...g, i]))}
                  style={[styles.check, on && styles.checkOn]}
                >
                  <View style={[styles.box, on && styles.boxOn]}>{on && <Text style={styles.boxTick}>✓</Text>}</View>
                  <Text style={[type.body, { flex: 1 }]}>{t.text}</Text>
                </Pressable>
              );
            })}
            <Button label="Los, ich handle!" variant="alarm" disabled={treatmentGuess.length === 0} onPress={finish} />
          </>
        )}
      </ScrollView>
      {incidentActive && incident && (
        <View style={styles.incident}>
          <View style={[styles.incidentBody, { paddingHorizontal: sidePad }]}>
            <Text style={styles.incidentEyebrow}>⚠️ Zwischenfall!</Text>
            <Text style={styles.incidentText}>{incident.text}</Text>
            {incidentOptions.map((o) => {
              const chosen = incidentChoice === o;
              const reveal = !!incidentChoice && difficulty.instantFeedback;
              const isRight = o === incident.options[0];
              return (
                <Pressable
                  key={o}
                  disabled={!!incidentChoice}
                  onPress={() => chooseIncident(o)}
                  style={[
                    styles.incidentOption,
                    chosen && styles.incidentChosen,
                    reveal && isRight && styles.incidentRight,
                    reveal && chosen && !isRight && styles.incidentWrong,
                    !!incidentChoice && !chosen && !(reveal && isRight) && { opacity: 0.45 },
                  ]}
                >
                  <Text style={[styles.incidentOptionText, (chosen || (reveal && isRight)) && { color: colors.weiss }]}>{o}</Text>
                </Pressable>
              );
            })}
            {incidentChoice && (
              <>
                <Text style={styles.incidentFeedback}>
                  {difficulty.instantFeedback
                    ? `${incidentChoice === incident.options[0] ? '✓ Richtig reagiert! ' : '✗ Leider falsch. '}${incident.explanation}`
                    : 'Entscheidung getroffen – die Auswertung gibt es im Bericht.'}
                </Text>
                <Button label="Weiter" variant="dark" onPress={closeIncident} />
              </>
            )}
          </View>
        </View>
      )}
      {phase === 'exam' && pending && (
        <View style={[styles.ratePanel, { paddingHorizontal: sidePad }]}>
          <Text style={styles.rateAction}>{VITAL_BY_ID[pending].action}</Text>
          <Text style={[styles.rateValue, { color: monitor[pending] }]}>{formatVital(pending, medCase.vitals[pending])}</Text>
          {difficulty.showNormBeforeRating && (
            <Text style={styles.rateNorm}>Norm: {normalText(pending, medCase.patient.age)}</Text>
          )}
          <Text style={styles.rateQ}>Wie schätze ich den Wert ein?</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            {RATINGS.map((r) => (
              <Pressable key={r.value} style={styles.rateBtn} onPress={() => rate(r.value)}>
                <Text style={styles.rateSymbol}>{r.symbol}</Text>
                <Text style={styles.rateLabel}>{r.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  clock: {
    alignItems: 'center',
    backgroundColor: colors.blaulichtLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  clockValue: { color: colors.blaulicht, fontFamily: fonts.bold, fontSize: 17 },
  clockLabel: { color: colors.blaulicht, fontFamily: fonts.medium, fontSize: 10 },
  steps: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.grau50,
  },
  step: { flex: 1, paddingVertical: 5, alignItems: 'center', borderRadius: 16, backgroundColor: colors.grau200 },
  stepActive: { backgroundColor: colors.blaulicht },
  stepText: { fontSize: 11, fontFamily: fonts.semibold, color: colors.grau500 },
  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.weiss,
    borderBottomWidth: 1,
    borderBottomColor: colors.grau200,
  },
  mood: { fontFamily: fonts.regular, fontSize: 26 },
  conditionLabel: { fontSize: 11, fontFamily: fonts.bold, color: colors.grau500, letterSpacing: 0.5 },
  conditionTrack: { height: 8, backgroundColor: colors.grau200, marginTop: 4 },
  conditionFill: { height: 8 },
  conditionValue: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.graphit, width: 44, textAlign: 'right' },
  alarm: { backgroundColor: colors.signalrot, borderRadius: 14, overflow: 'hidden' },
  alarmBody: { padding: spacing.lg },
  dailyTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warngelb,
    color: colors.graphit,
    fontFamily: fonts.extrabold,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  alarmEyebrow: {
    color: colors.weiss,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.4,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  alarmText: { color: colors.weiss, fontSize: 22, fontFamily: fonts.display, marginTop: spacing.sm, lineHeight: 27 },
  alarmLoc: { color: colors.weiss, marginTop: spacing.sm, opacity: 0.9, fontFamily: fonts.italic, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '48.5%',
    flexGrow: 1,
    backgroundColor: colors.weiss,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.weiss,
    minHeight: 92,
    borderRadius: 14,
  },
  tileWide: { width: '100%' },
  tilePending: { borderColor: colors.blaulicht },
  tileRight: { borderColor: colors.gruen },
  tileWrong: { borderColor: colors.signalrot },
  tileDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  tileHead: { flexDirection: 'row', justifyContent: 'space-between' },
  tileShort: { fontSize: 12, fontFamily: fonts.extrabold, color: colors.graphit, letterSpacing: 1 },
  tileName: { fontFamily: fonts.regular, fontSize: 12, color: colors.grau500, marginTop: 2 },
  tileTap: { marginTop: spacing.sm, color: colors.blaulicht, fontFamily: fonts.bold },
  tileValue: { marginTop: spacing.sm, fontSize: 22, fontFamily: fonts.display, color: colors.graphit },
  tileFeedback: { fontSize: 11, marginTop: 4, fontFamily: fonts.semibold },
  incident: { backgroundColor: colors.signalrot },
  incidentBody: { padding: spacing.lg, gap: spacing.sm },
  incidentEyebrow: {
    fontFamily: fonts.displayBlack,
    fontSize: 26,
    color: colors.weiss,
    letterSpacing: -0.3,
  },
  incidentText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.weiss, marginBottom: spacing.xs },
  incidentOption: {
    backgroundColor: colors.weiss,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.weiss,
  },
  incidentChosen: { backgroundColor: colors.graphit, borderColor: colors.graphit },
  incidentRight: { backgroundColor: colors.gruen, borderColor: colors.weiss },
  incidentWrong: { backgroundColor: colors.graphit, borderColor: colors.warngelb },
  incidentOptionText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.graphit },
  incidentFeedback: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.weiss, marginTop: spacing.xs },
  ratePanel: { backgroundColor: colors.nacht, padding: spacing.lg, borderTopWidth: 3, borderTopColor: colors.signalrot },
  rateAction: { color: colors.grau300, fontFamily: fonts.italic, fontSize: 14 },
  rateValue: { color: colors.weiss, fontSize: 40, fontFamily: fonts.displayBlack, marginTop: 2, letterSpacing: 0.5 },
  rateNorm: { fontFamily: fonts.regular, color: colors.blaulichtLight, fontSize: 13, marginTop: 2 },
  rateQ: { color: colors.weiss, fontFamily: fonts.bold, fontSize: 15, marginTop: spacing.sm },
  rateBtn: { flex: 1, backgroundColor: colors.blaulicht, paddingVertical: spacing.md, alignItems: 'center', borderRadius: 14 },
  rateSymbol: { color: colors.weiss, fontSize: 20, fontFamily: fonts.extrabold },
  rateLabel: { color: colors.weiss, fontSize: 12, fontFamily: fonts.semibold },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  summaryChip: {
    backgroundColor: colors.blaulichtLight,
    color: colors.blaulichtDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  option: { backgroundColor: colors.weiss, padding: spacing.lg, borderWidth: 2, borderColor: colors.weiss, borderRadius: 14 },
  optionSelected: { backgroundColor: colors.blaulicht, borderColor: colors.blaulicht },
  optionRight: { backgroundColor: colors.gruen, borderColor: colors.gruen },
  optionWrong: { backgroundColor: colors.signalrot, borderColor: colors.signalrot },
  optionRemoved: { borderColor: colors.grau200, backgroundColor: colors.grau50 },
  optionText: { fontSize: 17, fontFamily: fonts.semibold, color: colors.graphit, lineHeight: 22 },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.weiss,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.weiss,
    borderRadius: 14,
  },
  checkOn: { borderColor: colors.blaulicht },
  box: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.grau300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.blaulicht, borderColor: colors.blaulicht },
  boxTick: { color: colors.weiss, fontFamily: fonts.extrabold },
});
