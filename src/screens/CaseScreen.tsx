import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DriveAnimation } from '../components/DriveAnimation';
import { Bar, Button, Card, IconTile, Led, Pill, StatChip, Tap, TopBar } from '../components/UI';
import { AskKati, Kati } from '../components/Kati';
import { MedCase } from '../data/cases';
import { INCIDENTS, INCIDENT_CONDITION } from '../data/incidents';
import { Rating, VITALS, VITAL_BY_ID, VitalId, formatVital, normalText, rateVital } from '../data/vitals';
import { DifficultyDef, HINT_COST } from '../game/difficulty';
import { EquipmentEffects } from '../game/equipment';
import { CONDITION, CaseRun, MINUTES_PER_MEASUREMENT, clampCondition, shuffle } from '../game/scoring';
import { Columns, useLayout } from '../layout';
import { colors, fonts, hardShadow, monitor, spacing, type } from '../theme';

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
  if (condition >= 70) return colors.mint;
  if (condition >= 40) return colors.orange;
  return colors.red;
}

/** Farbe der drei Einstufungs-Knöpfe (verrät nicht die richtige Antwort) */
const RATE_COLOR: Record<Rating, string> = { niedrig: '#9BD8FF', normal: '#8CF0C8', hoch: '#FFB38A' };

const ANSWER_LETTERS = ['A', 'B', 'C', 'D'];

function patientEmoji(age: number, sex: 'm' | 'w') {
  if (age <= 1) return '👶';
  if (age <= 12) return sex === 'm' ? '👦' : '👧';
  if (age >= 70) return sex === 'm' ? '👴' : '👵';
  return sex === 'm' ? '👨' : '👩';
}

/** Farbiges Etikett über einem Text-Block (wie ein Karteireiter) */
function Label({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.label, { backgroundColor: color }]}>
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}

/** Meldeempfänger („Pager“): Die Meldung der Leitstelle erscheint auf dem Display. */
function Pager({ dispatch, location }: { dispatch: string; location: string }) {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return (
    <View style={styles.pager}>
      <View style={styles.pagerTop}>
        <Text style={styles.pagerBrand}>MELDEEMPFÄNGER</Text>
        <Led color={colors.red} size={10} />
      </View>
      <View style={styles.lcd}>
        <View style={styles.lcdHead}>
          <Text style={styles.lcdMeta}>ALARM · RTW</Text>
          <Text style={styles.lcdMeta}>{hhmm}</Text>
        </View>
        <Text style={styles.lcdText}>{dispatch}</Text>
        <Text style={styles.lcdLoc}>📍 {location}</Text>
      </View>
      <View style={styles.pagerBtns}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.pagerBtn} />
        ))}
      </View>
    </View>
  );
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
        right={<StatChip value={`${minutes}′`} label="Min." color={colors.blueTint} />}
      />
      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s.phase} style={styles.stepItem}>
            <View style={styles.stepRow}>
              <View style={[styles.stepLine, i === 0 && { opacity: 0 }, i <= stepIndex && styles.stepLineOn]} />
              <View style={[styles.stepDot, i < stepIndex && styles.stepDotDone, i === stepIndex && styles.stepDotNow]}>
                <Text style={[styles.stepNum, i < stepIndex && { color: colors.white }]}>{i < stepIndex ? '✓' : i + 1}</Text>
              </View>
              <View style={[styles.stepLine, i === STEPS.length - 1 && { opacity: 0 }, i < stepIndex && styles.stepLineOn]} />
            </View>
            <Text
              style={[styles.stepText, i === stepIndex && { fontFamily: fonts.displayBlack, color: colors.ink }]}
              numberOfLines={1}
            >
              {s.de}
            </Text>
          </View>
        ))}
      </View>
      {phase !== 'alarm' && (
        <View style={styles.condition}>
          <View style={styles.moodCircle}>
            <Text style={styles.mood}>{mood(condition)}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.conditionHead}>
              <Text style={styles.conditionLabel} numberOfLines={1}>
                Zustand von {firstName}
                {draining ? ' · verschlechtert sich!' : ''}
              </Text>
              <Text style={styles.conditionValue}>{Math.round(condition)}%</Text>
            </View>
            <Bar pct={condition / 100} color={conditionColor(condition)} height={14} />
          </View>
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
            {daily && <Pill label="⭐ Einsatz des Tages · +50 % Punkte" color={colors.yellow} />}
            <Pager dispatch={`Leitstelle: „${medCase.dispatch}“`} location={medCase.location} />
            <Card style={styles.patientCard}>
              <IconTile icon={patientEmoji(p.age, p.sex)} color={colors.skyStrong + '55'} size={56} />
              <View style={{ flex: 1 }}>
                <Text style={type.eyebrow}>Patient</Text>
                <Text style={type.h2}>{p.name}</Text>
                <Text style={type.small}>
                  {p.sex === 'm' ? 'männlich' : 'weiblich'}, {p.age} Jahre · {difficulty.label} {difficulty.icon}
                </Text>
              </View>
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
                  <Card>
                    <Label text="Ich komme an" color={colors.redTint} />
                    <Text style={[type.body, styles.sceneText]}>{medCase.scene}</Text>
                  </Card>
                  <Card>
                    <Label text="Was ich höre" color={colors.sky} />
                    {medCase.anamnese.map((a, i) => (
                      <Text key={i} style={[type.body, styles.bullet]}>
                        • {a}
                      </Text>
                    ))}
                  </Card>
                  <Card>
                    <Label text="Was ich sehe" color={colors.mintTint} />
                    {medCase.befund.map((b, i) => (
                      <Text key={i} style={[type.body, styles.bullet]}>
                        • {b}
                      </Text>
                    ))}
                  </Card>
                </>,
                <>
                  <Label text="Was messe ich?" color={colors.yellow} />
                  <View style={styles.grid}>
                    {VITALS.map((v) => {
                      const done = measured.find((m) => m.id === v.id);
                      const isPending = pending === v.id;
                      const value = medCase.vitals[v.id];
                      const truth = rateVital(v.id, value, medCase.patient.age);
                      const right = done && truth !== null && difficulty.instantFeedback ? done.guess === truth : null;
                      return (
                        <Tap
                          key={v.id}
                          onPress={() => measure(v.id)}
                          disabled={!!done || !!pending}
                          offset={3}
                          accessibilityLabel={`${v.name} messen`}
                          style={[
                            styles.tile,
                            v.textOnly && styles.tileWide,
                            !!done && styles.tileDone,
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
                            <Text
                              style={[styles.tileValue, v.textOnly && { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19 }]}
                            >
                              {formatVital(v.id, value)}
                            </Text>
                          ) : (
                            <Text style={styles.tileTap}>Messen ▶</Text>
                          )}
                          {done && truth !== null && right !== null && (
                            <Text style={[styles.tileFeedback, { color: right ? colors.mintDark : colors.redDark }]}>
                              {right ? `✓ ${truth}` : `✗ eigentlich ${truth}`} · Norm {normalText(v.id, medCase.patient.age)}
                            </Text>
                          )}
                          {done && truth !== null && right === null && (
                            <Text style={[styles.tileFeedback, { color: colors.muted }]}>meine Einschätzung: {done.guess}</Text>
                          )}
                        </Tap>
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
              <Label text="Meine Befunde" color={colors.yellow} />
              <Text style={[type.small, { marginTop: spacing.sm }]}>{medCase.befund.join(' · ')}</Text>
              <View style={styles.summaryRow}>
                {measured.map((m) => (
                  <Text key={m.id} style={styles.summaryChip}>
                    {VITAL_BY_ID[m.id].short} {formatVital(m.id, medCase.vitals[m.id])}
                  </Text>
                ))}
              </View>
            </Card>
            <Text style={type.h2}>Ich überlege … was hat {firstName}?</Text>
            {diagnosisOptions.map((d, idx) => {
              const removed = fiftyFifty && removedByFifty.includes(d);
              const selected = diagnosisGuess === d;
              const isCorrect = d === medCase.diagnosis;
              const reveal = diagnosisLocked && difficulty.instantFeedback;
              let style = selected ? styles.optionSelected : null;
              let ink = colors.ink;
              if (selected) ink = colors.white;
              if (reveal && isCorrect) {
                style = styles.optionRight;
                ink = colors.ink;
              } else if (reveal && selected) {
                style = styles.optionWrong;
                ink = colors.white;
              }
              return (
                <Tap
                  key={d}
                  disabled={diagnosisLocked || removed}
                  onPress={() => setDiagnosisGuess(d)}
                  offset={removed || selected ? 0 : 4}
                  accessibilityLabel={d}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.option,
                    style,
                    removed && styles.optionRemoved,
                    selected && !removed && { transform: [{ translateY: 3 }] },
                  ]}
                >
                  <View style={[styles.letter, selected && { backgroundColor: colors.white }, removed && { opacity: 0.4 }]}>
                    <Text style={styles.letterText}>{ANSWER_LETTERS[idx]}</Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      { color: ink },
                      removed && { textDecorationLine: 'line-through', color: colors.grau300 },
                    ]}
                  >
                    {d}
                  </Text>
                </Tap>
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
                <Tap
                  key={i}
                  onPress={() => setTreatmentGuess((g) => (on ? g.filter((x) => x !== i) : [...g, i]))}
                  offset={on ? 0 : 3}
                  accessibilityRole="checkbox"
                  accessibilityLabel={t.text}
                  accessibilityState={{ checked: on }}
                  style={[styles.check, on && styles.checkOn]}
                >
                  <View style={[styles.box, on && styles.boxOn]}>{on && <Text style={styles.boxTick}>✓</Text>}</View>
                  <Text style={[type.body, { flex: 1, fontFamily: on ? fonts.semibold : fonts.regular }]}>{t.text}</Text>
                </Tap>
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
                <Tap
                  key={o}
                  disabled={!!incidentChoice}
                  onPress={() => chooseIncident(o)}
                  offset={4}
                  accessibilityLabel={o}
                  style={[
                    styles.incidentOption,
                    chosen && styles.incidentChosen,
                    reveal && isRight && styles.incidentRight,
                    reveal && chosen && !isRight && styles.incidentWrong,
                    !!incidentChoice && !chosen && !(reveal && isRight) && { opacity: 0.5 },
                  ]}
                >
                  <Text style={[styles.incidentOptionText, chosen && !(reveal && isRight) && { color: colors.white }]}>{o}</Text>
                </Tap>
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
        <View style={[styles.ratePanel, { paddingHorizontal: Math.max(spacing.lg, sidePad) }]}>
          <Text style={styles.rateAction}>{VITAL_BY_ID[pending].action}</Text>
          <Text style={[styles.rateValue, { color: monitor[pending] }]}>{formatVital(pending, medCase.vitals[pending])}</Text>
          {difficulty.showNormBeforeRating && (
            <Text style={styles.rateNorm}>Norm: {normalText(pending, medCase.patient.age)}</Text>
          )}
          <Text style={styles.rateQ}>Wie schätze ich den Wert ein?</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            {RATINGS.map((r) => (
              <Tap
                key={r.value}
                onPress={() => rate(r.value)}
                offset={4}
                shadowColor="rgba(255,255,255,0.3)"
                accessibilityLabel={r.label}
                style={[styles.rateBtn, { backgroundColor: RATE_COLOR[r.value] }]}
              >
                <Text style={styles.rateSymbol}>{r.symbol}</Text>
                <Text style={styles.rateLabel}>{r.label}</Text>
              </Tap>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },

  // Stationen-Leiste: Alarm → Untersuchung → Diagnose → Maßnahmen
  steps: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingTop: 2, paddingBottom: spacing.sm },
  stepItem: { flex: 1, alignItems: 'center', gap: 3 },
  stepRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  stepLine: { flex: 1, height: 3, backgroundColor: colors.grau300, borderRadius: 2 },
  stepLineOn: { backgroundColor: colors.ink },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.ink, borderStyle: 'solid' },
  stepDotNow: { backgroundColor: colors.yellow, borderStyle: 'solid', ...hardShadow(2) },
  stepNum: { fontFamily: fonts.displayBlack, fontSize: 13, color: colors.ink },
  stepText: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, letterSpacing: 0.3 },

  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    ...hardShadow(3),
  },
  moodCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.yellowTint,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mood: { fontFamily: fonts.regular, fontSize: 22, lineHeight: 28 },
  conditionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.sm },
  conditionLabel: { ...type.eyebrow, flex: 1, fontSize: 10.5 },
  conditionValue: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink, letterSpacing: -0.4 },

  // Etikett (Karteireiter) und Textblöcke
  label: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  labelText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink },
  sceneText: { marginTop: spacing.sm, fontFamily: fonts.italic },
  bullet: { marginTop: spacing.sm - 2 },
  patientCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  // Meldeempfänger
  pager: {
    backgroundColor: colors.inkSoft,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
    ...hardShadow(5),
  },
  pagerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xs },
  pagerBrand: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 2, color: colors.grau300 },
  lcd: {
    backgroundColor: colors.monitorBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  lcdHead: { flexDirection: 'row', justifyContent: 'space-between' },
  lcdMeta: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.2, color: 'rgba(43,227,139,0.65)' },
  lcdText: { fontFamily: fonts.mono, fontSize: 16, lineHeight: 23, color: colors.monitorGruen },
  lcdLoc: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 18, color: colors.yellow },
  pagerBtns: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  pagerBtn: { width: 34, height: 10, borderRadius: 5, backgroundColor: colors.ink },

  // Messkacheln
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 98,
    borderRadius: 18,
  },
  tileWide: { width: '100%' },
  tileDone: { transform: [{ translateY: 3 }], backgroundColor: colors.paper },
  tilePending: { backgroundColor: colors.yellow, transform: [{ translateY: 3 }] },
  tileRight: { backgroundColor: colors.mintTint },
  tileWrong: { backgroundColor: colors.redTint },
  tileDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: colors.line },
  tileHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tileShort: { fontSize: 15, fontFamily: fonts.displayBlack, color: colors.ink, letterSpacing: -0.2 },
  tileName: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  tileTap: { marginTop: spacing.sm, color: colors.blue, fontFamily: fonts.displayBlack, fontSize: 15, letterSpacing: -0.2 },
  tileValue: {
    marginTop: spacing.sm,
    fontSize: 24,
    lineHeight: 27,
    fontFamily: fonts.displayBlack,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  tileFeedback: { fontSize: 11, lineHeight: 15, marginTop: 4, fontFamily: fonts.semibold },

  // Zwischenfall
  incident: {
    backgroundColor: colors.red,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.line,
  },
  incidentBody: { padding: spacing.lg, gap: spacing.sm },
  incidentEyebrow: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 30, color: colors.white, letterSpacing: -0.8 },
  incidentText: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.white, marginBottom: spacing.xs },
  incidentOption: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  incidentChosen: { backgroundColor: colors.ink },
  incidentRight: { backgroundColor: colors.mint },
  incidentWrong: { backgroundColor: colors.ink, borderColor: colors.yellow },
  incidentOptionText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  incidentFeedback: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.white, marginTop: spacing.xs },

  // Einstufung am Gerät
  ratePanel: {
    backgroundColor: colors.monitorBg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.line,
  },
  rateAction: { color: colors.grau300, fontFamily: fonts.italic, fontSize: 14 },
  rateValue: { fontSize: 46, lineHeight: 50, fontFamily: fonts.displayBlack, marginTop: 2, letterSpacing: -1.2 },
  rateNorm: { fontFamily: fonts.mono, color: colors.skyStrong, fontSize: 12, marginTop: 2 },
  rateQ: { color: colors.white, fontFamily: fonts.display, fontSize: 17, marginTop: spacing.sm, letterSpacing: -0.3 },
  rateBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rateSymbol: { color: colors.ink, fontSize: 22, lineHeight: 26, fontFamily: fonts.displayBlack },
  rateLabel: { color: colors.ink, fontSize: 14, fontFamily: fonts.display },

  // Diagnose
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  summaryChip: {
    backgroundColor: colors.blueTint,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 12,
    fontFamily: fonts.mono,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  optionSelected: { backgroundColor: colors.blue },
  optionRight: { backgroundColor: colors.mint },
  optionWrong: { backgroundColor: colors.red },
  optionRemoved: { borderStyle: 'dashed', borderColor: colors.grau300, backgroundColor: 'transparent' },
  optionText: { flex: 1, fontSize: 17, fontFamily: fonts.display, color: colors.ink, lineHeight: 21, letterSpacing: -0.3 },
  letter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink },

  // Maßnahmen
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  checkOn: { backgroundColor: colors.blueTint, transform: [{ translateY: 3 }] },
  box: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.blue },
  boxTick: { color: colors.white, fontFamily: fonts.displayBlack, fontSize: 16, lineHeight: 20 },
});
