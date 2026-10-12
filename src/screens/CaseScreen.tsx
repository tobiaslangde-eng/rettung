import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, Ornament, TopBar } from '../components/Estonian';
import { MedCase } from '../data/cases';
import { Rating, VITALS, VITAL_BY_ID, VitalId, formatVital, rateVital } from '../data/vitals';
import { CaseRun, MINUTES_PER_MEASUREMENT, shuffle } from '../game/scoring';
import { colors, spacing, type } from '../theme';

type Phase = 'alarm' | 'exam' | 'diagnosis' | 'treatment';

const STEPS: { phase: Phase; et: string; de: string }[] = [
  { phase: 'alarm', et: 'Väljakutse', de: 'Alarm' },
  { phase: 'exam', et: 'Läbivaatus', de: 'Untersuchung' },
  { phase: 'diagnosis', et: 'Diagnoos', de: 'Diagnose' },
  { phase: 'treatment', et: 'Ravi', de: 'Maßnahmen' },
];

const RATINGS: { value: Rating; label: string; symbol: string }[] = [
  { value: 'niedrig', label: 'niedrig', symbol: '↓' },
  { value: 'normal', label: 'normal', symbol: '✓' },
  { value: 'hoch', label: 'hoch', symbol: '↑' },
];

export function CaseScreen({
  medCase,
  onFinish,
  onAbort,
}: {
  medCase: MedCase;
  onFinish: (run: CaseRun) => void;
  onAbort: () => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const [phase, setPhase] = useState<Phase>('alarm');
  const [measured, setMeasured] = useState<CaseRun['measured']>([]);
  const [pending, setPending] = useState<VitalId | null>(null);
  const [diagnosisGuess, setDiagnosisGuess] = useState<string | null>(null);
  const [diagnosisLocked, setDiagnosisLocked] = useState(false);
  const [treatmentGuess, setTreatmentGuess] = useState<number[]>([]);

  const diagnosisOptions = useMemo(() => shuffle([medCase.diagnosis, ...medCase.distractors]), [medCase]);
  const treatmentOrder = useMemo(() => shuffle(medCase.treatments.map((_, i) => i)), [medCase]);

  const goto = (p: Phase) => {
    setPhase(p);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const measure = (id: VitalId) => {
    if (pending || measured.some((m) => m.id === id)) return;
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

  const minutes = 4 + measured.length * MINUTES_PER_MEASUREMENT + (pending ? MINUTES_PER_MEASUREMENT : 0);
  const stepIndex = STEPS.findIndex((s) => s.phase === phase);
  const p = medCase.patient;

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        et={STEPS[stepIndex].et}
        title={STEPS[stepIndex].de}
        onBack={onAbort}
        right={
          <View style={styles.clock}>
            <Text style={styles.clockValue}>{minutes}′</Text>
            <Text style={styles.clockLabel}>aeg</Text>
          </View>
        }
      />
      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s.phase} style={[styles.step, i <= stepIndex && styles.stepActive]}>
            <Text style={[styles.stepText, i <= stepIndex && { color: colors.valge }]}>
              {i + 1}. {s.et}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        {phase === 'alarm' && (
          <>
            <View style={styles.alarm}>
              <Text style={styles.alarmEyebrow}>⚠ HÄIRE · EINSATZ</Text>
              <Text style={styles.alarmText}>{medCase.dispatch}</Text>
              <Text style={styles.alarmLoc}>📍 {medCase.location}</Text>
            </View>
            <Card>
              <Eyebrow et="Patsient" de="Patient" />
              <Text style={[type.h2, { marginTop: spacing.xs }]}>{p.name}</Text>
              <Text style={type.small}>
                {p.sex === 'm' ? 'männlich' : 'weiblich'}, {p.age} Jahre · Schwierigkeit {'◆'.repeat(medCase.difficulty)}
                {'◇'.repeat(3 - medCase.difficulty)}
              </Text>
            </Card>
            <Text style={type.small}>
              Tipp: Jede Messung kostet eine Minute. Miss die Werte, die zur Situation passen – und stufe sie richtig ein.
            </Text>
            <Button label="Ausrücken" sub="Sõidame välja" variant="alarm" onPress={() => goto('exam')} />
          </>
        )}

        {phase === 'exam' && (
          <>
            <Card>
              <Eyebrow et="Anamnees" de="Befragung" />
              {medCase.anamnese.map((a, i) => (
                <Text key={i} style={[type.body, { marginTop: spacing.xs }]}>
                  • {a}
                </Text>
              ))}
            </Card>
            <Card style={{ borderLeftColor: colors.must }}>
              <Eyebrow et="Leid" de="Sichtbefund" />
              {medCase.befund.map((b, i) => (
                <Text key={i} style={[type.body, { marginTop: spacing.xs }]}>
                  • {b}
                </Text>
              ))}
            </Card>

            <Eyebrow et="Mõõtmised" de="Werte prüfen" />
            <View style={styles.grid}>
              {VITALS.map((v) => {
                const done = measured.find((m) => m.id === v.id);
                const isPending = pending === v.id;
                const value = medCase.vitals[v.id];
                const truth = rateVital(v.id, value);
                const right = done && truth !== null ? done.guess === truth : null;
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
                      <Text style={styles.tileIcon}>{v.icon}</Text>
                      <Text style={styles.tileShort}>{v.short}</Text>
                    </View>
                    <Text style={styles.tileName}>{v.name}</Text>
                    {done || isPending ? (
                      <Text style={[styles.tileValue, v.textOnly && { fontSize: 14 }]}>{formatVital(v.id, value)}</Text>
                    ) : (
                      <Text style={styles.tileTap}>Messen ›</Text>
                    )}
                    {done && truth !== null && (
                      <Text style={[styles.tileFeedback, { color: right ? colors.rabaGreen : colors.kihnuRed }]}>
                        {right ? `✓ ${truth}` : `✗ eigentlich ${truth}`} · Norm {v.normal}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {pending && (
              <View style={styles.ratePanel}>
                <Text style={styles.rateQ}>
                  {VITAL_BY_ID[pending].name}: {formatVital(pending, medCase.vitals[pending])} – wie ist der Wert?
                </Text>
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

            <Button
              label="Verdachtsdiagnose stellen"
              sub="Edasi diagnoosini"
              disabled={!!pending || measured.length === 0}
              onPress={() => goto('diagnosis')}
            />
          </>
        )}

        {phase === 'diagnosis' && (
          <>
            <Card>
              <Eyebrow et="Kokkuvõte" de="Deine Befunde" />
              <Text style={[type.small, { marginTop: spacing.xs }]}>{medCase.befund.join(' · ')}</Text>
              <View style={styles.summaryRow}>
                {measured.map((m) => (
                  <Text key={m.id} style={styles.summaryChip}>
                    {VITAL_BY_ID[m.id].short} {formatVital(m.id, medCase.vitals[m.id])}
                  </Text>
                ))}
              </View>
            </Card>
            <Text style={type.h2}>Was hat {p.name.split(' ')[0]}?</Text>
            {diagnosisOptions.map((d) => {
              const selected = diagnosisGuess === d;
              const isCorrect = d === medCase.diagnosis;
              let style = selected ? styles.optionSelected : null;
              if (diagnosisLocked && isCorrect) style = styles.optionRight;
              else if (diagnosisLocked && selected) style = styles.optionWrong;
              return (
                <Pressable
                  key={d}
                  disabled={diagnosisLocked}
                  onPress={() => setDiagnosisGuess(d)}
                  style={[styles.option, style]}
                >
                  <Text style={[styles.optionText, (selected || (diagnosisLocked && isCorrect)) && { color: colors.valge }]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
            {diagnosisLocked ? (
              <>
                <Text style={[type.body, { fontWeight: '700' }]}>
                  {diagnosisGuess === medCase.diagnosis ? '✓ Richtig! ' : '✗ Leider falsch. '}
                  {medCase.diagnosis} – „{medCase.diagnosisEt}“
                </Text>
                <Button label="Weiter zu den Maßnahmen" sub="Edasi ravini" onPress={() => goto('treatment')} />
              </>
            ) : (
              <Button
                label="Diagnose bestätigen"
                sub="Kinnita"
                variant="dark"
                disabled={!diagnosisGuess}
                onPress={() => setDiagnosisLocked(true)}
              />
            )}
          </>
        )}

        {phase === 'treatment' && (
          <>
            <Text style={type.h2}>Welche Maßnahmen ergreifst du?</Text>
            <Text style={type.small}>Wähle alle richtigen Maßnahmen. Falsche Maßnahmen kosten Punkte.</Text>
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
            <Button
              label="Maßnahmen durchführen"
              sub="Alusta ravi"
              variant="alarm"
              disabled={treatmentGuess.length === 0}
              onPress={() =>
                onFinish({ medCase, measured, diagnosisGuess: diagnosisGuess ?? '', treatmentGuess })
              }
            />
          </>
        )}
        <Ornament count={10} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  clock: { alignItems: 'center', borderWidth: 1, borderColor: colors.sinine, paddingHorizontal: 8, paddingVertical: 2 },
  clockValue: { color: colors.valge, fontWeight: '800', fontSize: 16 },
  clockLabel: { color: colors.sinineLight, fontSize: 9, letterSpacing: 1 },
  steps: { flexDirection: 'row', backgroundColor: colors.linenDark },
  step: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.linen },
  stepActive: { backgroundColor: colors.sinine },
  stepText: { fontSize: 10, fontWeight: '700', color: colors.grey, letterSpacing: 0.5 },
  alarm: { backgroundColor: colors.kihnuRed, padding: spacing.lg },
  alarmEyebrow: { color: colors.valge, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  alarmText: { color: colors.valge, fontSize: 18, fontWeight: '700', marginTop: spacing.sm, lineHeight: 24 },
  alarmLoc: { color: colors.valge, marginTop: spacing.sm, opacity: 0.9 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '48.5%',
    flexGrow: 1,
    backgroundColor: colors.valge,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.linenDark,
    minHeight: 92,
  },
  tileWide: { width: '100%' },
  tilePending: { borderColor: colors.sinine },
  tileRight: { borderColor: colors.rabaGreen },
  tileWrong: { borderColor: colors.kihnuRed },
  tileHead: { flexDirection: 'row', justifyContent: 'space-between' },
  tileIcon: { fontSize: 16, color: colors.sinine },
  tileShort: { fontSize: 12, fontWeight: '800', color: colors.must, letterSpacing: 1 },
  tileName: { fontSize: 12, color: colors.grey, marginTop: 2 },
  tileTap: { marginTop: spacing.sm, color: colors.sinine, fontWeight: '700' },
  tileValue: { marginTop: spacing.sm, fontSize: 20, fontWeight: '800', color: colors.must },
  tileFeedback: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  ratePanel: { backgroundColor: colors.must, padding: spacing.lg },
  rateQ: { color: colors.valge, fontWeight: '700', fontSize: 15 },
  rateBtn: { flex: 1, backgroundColor: colors.sinine, paddingVertical: spacing.md, alignItems: 'center' },
  rateSymbol: { color: colors.valge, fontSize: 20, fontWeight: '800' },
  rateLabel: { color: colors.valge, fontSize: 12, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  summaryChip: {
    backgroundColor: colors.sinineLight,
    color: colors.sinineDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: '700',
  },
  option: { backgroundColor: colors.valge, padding: spacing.lg, borderWidth: 2, borderColor: colors.must },
  optionSelected: { backgroundColor: colors.sinine, borderColor: colors.sinine },
  optionRight: { backgroundColor: colors.rabaGreen, borderColor: colors.rabaGreen },
  optionWrong: { backgroundColor: colors.kihnuRed, borderColor: colors.kihnuRed },
  optionText: { fontSize: 16, fontWeight: '700', color: colors.must },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.valge,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.linenDark,
  },
  checkOn: { borderColor: colors.sinine },
  box: { width: 24, height: 24, borderWidth: 2, borderColor: colors.must, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.sinine, borderColor: colors.sinine },
  boxTick: { color: colors.valge, fontWeight: '900' },
});
