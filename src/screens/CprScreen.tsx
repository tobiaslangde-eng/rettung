import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EcgStrip } from '../components/Ems';
import { MonitorCard, ProgressTop, ScoreHero } from '../components/Training';
import { Button, Card, Eyebrow, StatChip, Tap, TopBar } from '../components/UI';
import {
  CPR_BREATHS,
  CPR_COMPRESSIONS,
  CPR_CYCLES,
  CPR_GUIDE_RATE,
  CPR_MAX_PAUSE,
  CPR_MAX_RATE,
  CPR_MIN_RATE,
  CPR_PAUSE_PENALTY,
  CPR_POINTS,
  CprResult,
  rateFrom,
  scoreCpr,
  zoneFor,
} from '../game/cpr';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

type Phase = 'intro' | 'press' | 'breathe' | 'done';

const native = Platform.OS !== 'web';
// Im Browser wartet Pressable sonst 50 ms, bevor onPressIn feuert – kurze Tipps gingen verloren.
const NO_PRESS_DELAY = (Platform.OS === 'web' ? { delayPressIn: 0 } : {}) as object;
const GAUGE_MIN = 60;
const GAUGE_MAX = 160;
const gaugePos = (rate: number) => Math.min(1, Math.max(0, (rate - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)));

const ZONE = {
  langsam: { label: 'Schneller!', color: colors.yellow },
  gut: { label: 'Perfekter Takt!', color: colors.monitorGruen },
  schnell: { label: 'Langsamer!', color: colors.orange },
};

/** Pulsierender Ring im Zieltakt (110 pro Minute). */
function Metronome({ size }: { size: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const beat = 60000 / CPR_GUIDE_RATE;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 90, useNativeDriver: native }),
        Animated.timing(a, { toValue: 0, duration: beat - 90, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [a]);
  return (
    <Animated.View
      style={[
        styles.metronome,
        {
          pointerEvents: 'none',
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.9] }),
          transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
        },
      ]}
    />
  );
}

export function CprScreen({
  best,
  onFinish,
  onBack,
}: {
  best: number;
  onFinish: (result: CprResult) => void;
  onBack: () => void;
}) {
  // Bestwert vor dieser Runde – der Prop `best` ist nach onFinish schon aktualisiert.
  const [prevBest, setPrevBest] = useState(best);
  const [phase, setPhase] = useState<Phase>('intro');
  const [withGuide, setWithGuide] = useState(true);
  const [taps, setTaps] = useState<number[]>([]);
  const [cycle, setCycle] = useState(0);
  const [breaths, setBreaths] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<CprResult | null>(null);
  const tapsRef = useRef<number[]>([]);
  const cycles = useRef<number[][]>([]);
  const pauses = useRef<number[]>([]);
  const pauseStart = useRef(0);
  const press = useRef(new Animated.Value(0)).current;

  // Uhr für die Beatmungspause
  useEffect(() => {
    if (phase !== 'breathe') return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [phase]);

  const start = () => {
    setPrevBest(best);
    cycles.current = [];
    pauses.current = [];
    tapsRef.current = [];
    setTaps([]);
    setCycle(0);
    setBreaths(0);
    setResult(null);
    setPhase('press');
  };

  const finish = () => {
    const r = scoreCpr(cycles.current, pauses.current, withGuide);
    setResult(r);
    setPhase('done');
    onFinish(r);
  };

  const compress = () => {
    if (phase !== 'press') return;
    Animated.sequence([
      Animated.timing(press, { toValue: 1, duration: 70, useNativeDriver: native }),
      Animated.timing(press, { toValue: 0, duration: 160, useNativeDriver: native }),
    ]).start();
    // Ref statt State: schnelle Tipps zwischen zwei Renderings gehen nicht verloren.
    const next = [...tapsRef.current, Date.now()];
    tapsRef.current = next.length < CPR_COMPRESSIONS ? next : [];
    setTaps(tapsRef.current);
    if (next.length < CPR_COMPRESSIONS) return;
    cycles.current.push(next);
    if (cycles.current.length >= CPR_CYCLES) {
      finish();
    } else {
      pauseStart.current = Date.now();
      setNow(Date.now());
      setBreaths(0);
      setPhase('breathe');
    }
  };

  const breathe = () => {
    const n = breaths + 1;
    setBreaths(n);
    if (n >= CPR_BREATHS) {
      pauses.current.push(Date.now() - pauseStart.current);
      setCycle((c) => c + 1);
      setPhase('press');
    }
  };

  if (phase === 'intro') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="Herzdruckmassage" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content}>
          <MonitorCard>
            <Text style={styles.introBig}>100–120</Text>
            <Text style={styles.introSub}>Kompressionen pro Minute</Text>
            <View style={{ alignSelf: 'stretch', marginTop: spacing.md }}>
              <EcgStrip height={44} beats={4} />
            </View>
          </MonitorCard>
          <Card>
            <Eyebrow title="So geht’s" />
            <Text style={[type.body, { marginTop: spacing.xs }]}>
              Mein Patient hat keinen Kreislauf. Ich tippe {CPR_COMPRESSIONS}× im richtigen Takt auf den Brustkorb, dann beatme
              ich {CPR_BREATHS}× – und das {CPR_CYCLES} Runden lang. Die Pause zum Beatmen soll kürzer als {CPR_MAX_PAUSE}{' '}
              Sekunden sein.
            </Text>
            <Text style={[type.small, { marginTop: spacing.sm }]}>
              Merkhilfe: etwa zwei Mal pro Sekunde – im Takt von „Stayin’ Alive“.
            </Text>
          </Card>
          <View style={{ gap: spacing.sm }}>
            <Eyebrow title="Taktgeber" />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {[true, false].map((on) => (
                <Tap
                  key={String(on)}
                  onPress={() => setWithGuide(on)}
                  offset={withGuide === on ? 0 : 4}
                  accessibilityRole="radio"
                  accessibilityLabel={on ? 'Taktgeber an' : 'Taktgeber aus'}
                  accessibilityState={{ selected: withGuide === on }}
                  style={[styles.toggle, withGuide === on && styles.toggleActive]}
                >
                  <Text style={styles.toggleLabel}>{on ? 'An' : 'Aus'}</Text>
                  <Text style={styles.toggleSub}>{on ? `bis ${CPR_POINTS} Punkte` : `bis ${CPR_POINTS * 2} Punkte`}</Text>
                </Tap>
              ))}
            </View>
            <Text style={type.small}>Ohne Taktgeber muss ich den Rhythmus selbst halten – dafür gibt es doppelte Punkte.</Text>
          </View>
          {best > 0 && <Text style={[type.small, { textAlign: 'center' }]}>Mein Bestwert: {best} % im Zielbereich</Text>}
          <Button label="Wiederbelebung starten" variant="alarm" onPress={start} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'done' && result) {
    const tips: string[] = [];
    if (result.avgRate < CPR_MIN_RATE) tips.push('Etwas schneller drücken – Ziel sind 100–120 pro Minute.');
    if (result.avgRate > CPR_MAX_RATE) tips.push('Etwas langsamer – sonst füllt sich das Herz zwischen den Kompressionen nicht.');
    if (result.longestPause > CPR_MAX_PAUSE)
      tips.push(
        `Die Beatmungspause war zu lang (−${CPR_PAUSE_PENALTY} Punkte). Jede Sekunde ohne Druck senkt den Blutdruck im Gehirn.`,
      );
    if (tips.length === 0) tips.push('Gleichmäßiger Takt und kurze Pausen – so überlebt das Gehirn bis der Defi kommt.');
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="Auswertung" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content}>
          <ScoreHero
            stars={result.stars}
            big={String(result.accuracy)}
            unit="% im Zielbereich"
            points={result.points}
            note={result.accuracy > prevBest ? '🏆 Neuer Bestwert!' : `Mein Bestwert: ${Math.max(prevBest, result.accuracy)} %`}
          />
          <Card>
            <Eyebrow title="Meine Werte" />
            <Line label="Durchschnittlicher Takt" value={`${result.avgRate} /min`} ok={zoneFor(result.avgRate) === 'gut'} />
            <Line
              label="Längste Beatmungspause"
              value={`${String(result.longestPause).replace('.', ',')} s`}
              ok={result.longestPause <= CPR_MAX_PAUSE}
            />
            <Line label="Taktgeber" value={withGuide ? 'an' : 'aus (×2)'} ok />
          </Card>
          <Card style={{ borderLeftColor: colors.blue }}>
            <Eyebrow title="Tipp" />
            {tips.map((t) => (
              <Text key={t} style={[type.body, { marginTop: spacing.xs }]}>
                {t}
              </Text>
            ))}
          </Card>
          <Button label="Noch einmal" variant="alarm" onPress={start} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  const rate = rateFrom(taps);
  const zone = rate !== null ? ZONE[zoneFor(rate)] : null;
  const pause = phase === 'breathe' ? (now - pauseStart.current) / 1000 : 0;
  const chestScale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Herzdruckmassage"
        title={`Runde ${cycle + 1} von ${CPR_CYCLES}`}
        onBack={onBack}
        right={
          <StatChip
            value={phase === 'press' ? taps.length : CPR_COMPRESSIONS}
            label={`von ${CPR_COMPRESSIONS}`}
            color={colors.pinkTint}
          />
        }
      />
      <ProgressTop pct={(phase === 'press' ? taps.length : CPR_COMPRESSIONS) / CPR_COMPRESSIONS} color={colors.pinkStrong} />
      <View style={styles.play}>
        <View style={styles.readout}>
          <Text style={[styles.rate, { color: zone?.color ?? colors.grau300 }]}>
            {rate ?? '–'}
            <Text style={styles.rateUnit}> /min</Text>
          </Text>
          <Text style={[styles.zone, { color: zone?.color ?? colors.grau300 }]}>
            {phase === 'breathe' ? 'Jetzt 2× beatmen' : (zone?.label ?? 'Los geht’s – drücken!')}
          </Text>
          <View style={styles.gauge}>
            <View
              style={[
                styles.gaugeZone,
                {
                  left: `${gaugePos(CPR_MIN_RATE) * 100}%`,
                  width: `${(gaugePos(CPR_MAX_RATE) - gaugePos(CPR_MIN_RATE)) * 100}%`,
                },
              ]}
            />
            {rate !== null && phase === 'press' && (
              <View style={[styles.needle, { left: `${gaugePos(rate) * 100}%`, backgroundColor: zone?.color }]} />
            )}
          </View>
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabel}>{GAUGE_MIN}</Text>
            <Text style={[styles.gaugeLabel, { color: colors.monitorGruen }]}>
              {CPR_MIN_RATE}–{CPR_MAX_RATE}
            </Text>
            <Text style={styles.gaugeLabel}>{GAUGE_MAX}</Text>
          </View>
        </View>

        {phase === 'press' ? (
          <View style={styles.chestWrap}>
            {withGuide && <Metronome size={250} />}
            <Pressable
              onPressIn={compress}
              {...NO_PRESS_DELAY}
              accessibilityRole="button"
              accessibilityLabel="Drücken"
              style={styles.chestHit}
            >
              <Animated.View style={[styles.chest, { transform: [{ scale: chestScale }] }]}>
                <Text style={styles.hands}>❤️</Text>
                <Text style={styles.chestLabel}>Drücken</Text>
                <Text style={styles.chestSub}>Mitte des Brustkorbs</Text>
              </Animated.View>
            </Pressable>
          </View>
        ) : (
          <View style={styles.chestWrap}>
            <Pressable onPress={breathe} accessibilityRole="button" accessibilityLabel="Beatmen" style={styles.breathe}>
              <Text style={styles.hands}>💨</Text>
              <Text style={styles.chestLabel}>Beatmen</Text>
              <Text style={styles.chestSub}>
                {breaths} von {CPR_BREATHS}
              </Text>
            </Pressable>
            <Text style={[styles.pause, { color: pause > CPR_MAX_PAUSE ? colors.redTint : colors.grau300 }]}>
              Pause: {pause.toFixed(1).replace('.', ',')} s {pause > CPR_MAX_PAUSE ? '– schnell weiterdrücken!' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function Line({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <View style={styles.line}>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
      <Text style={{ fontFamily: fonts.bold, color: ok ? colors.mintDark : colors.red }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  introBig: { fontFamily: fonts.displayBlack, fontSize: 68, lineHeight: 72, color: colors.monitorGruen, letterSpacing: -2.5 },
  introSub: { fontFamily: fonts.mono, fontSize: 12, color: colors.grau300, letterSpacing: 1.2, textTransform: 'uppercase' },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  toggleActive: { backgroundColor: colors.yellow, transform: [{ translateY: 3 }] },
  toggleLabel: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.ink, letterSpacing: -0.5 },
  toggleSub: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkSoft },

  // Spielfeld: dunkles Gerät mit Umrandung
  play: {
    flex: 1,
    backgroundColor: colors.monitorBg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...hardShadow(5),
  },
  readout: { padding: spacing.lg, alignItems: 'center' },
  rate: { fontFamily: fonts.displayBlack, fontSize: 68, lineHeight: 72, letterSpacing: -2.5 },
  rateUnit: { fontSize: 20, color: colors.grau300, letterSpacing: 0 },
  zone: { fontFamily: fonts.displayBlack, fontSize: 18, letterSpacing: -0.4 },
  gauge: {
    alignSelf: 'stretch',
    height: 14,
    backgroundColor: colors.graphitSoft,
    borderRadius: 7,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  gaugeZone: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(43,227,139,0.4)' },
  needle: { position: 'absolute', top: 0, bottom: 0, width: 5, marginLeft: -2, borderRadius: 2 },
  gaugeLabels: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  gaugeLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.grau500 },
  chestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingBottom: spacing.xl },
  metronome: { position: 'absolute', borderWidth: 6, borderColor: colors.monitorGruen },
  chestHit: { width: 230, height: 230, borderRadius: 115 },
  chest: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  breathe: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  hands: { fontSize: 46, fontFamily: fonts.regular },
  chestLabel: { fontFamily: fonts.displayBlack, fontSize: 32, color: colors.white, letterSpacing: -0.8 },
  chestSub: { fontFamily: fonts.mono, fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  pause: { fontFamily: fonts.mono, fontSize: 14 },
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
