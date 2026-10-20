import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Rating } from '../data/vitals';
import { colors, fonts, hardShadow, spacing } from '../theme';
import { EcgStrip, RatingStar } from './Ems';
import { Bar, Tap, shade } from './UI';

/** Konfetti-Teilchen (feste Positionen in %, damit die Anzeige immer gleich aussieht) */
const CONFETTI: { x: number; y: number; s: number; c: string; r: number; shape: 'sq' | 'dot' | 'bar' }[] = [
  { x: 6, y: 10, s: 12, c: colors.yellow, r: 20, shape: 'sq' },
  { x: 18, y: 28, s: 9, c: colors.pinkStrong, r: 0, shape: 'dot' },
  { x: 10, y: 62, s: 16, c: colors.mint, r: -25, shape: 'bar' },
  { x: 24, y: 80, s: 11, c: colors.white, r: 40, shape: 'sq' },
  { x: 40, y: 8, s: 10, c: colors.mint, r: 0, shape: 'dot' },
  { x: 62, y: 6, s: 16, c: colors.pinkStrong, r: 35, shape: 'bar' },
  { x: 80, y: 14, s: 11, c: colors.yellow, r: -15, shape: 'sq' },
  { x: 92, y: 30, s: 9, c: colors.white, r: 0, shape: 'dot' },
  { x: 88, y: 58, s: 15, c: colors.yellow, r: 50, shape: 'bar' },
  { x: 76, y: 82, s: 11, c: colors.pinkStrong, r: 10, shape: 'sq' },
  { x: 56, y: 88, s: 9, c: colors.mint, r: 0, shape: 'dot' },
  { x: 4, y: 40, s: 8, c: colors.white, r: 0, shape: 'dot' },
];

export function Confetti() {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      {CONFETTI.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === 'bar' ? p.s * 1.9 : p.s,
            height: p.shape === 'bar' ? p.s * 0.5 : p.s,
            borderRadius: p.shape === 'dot' ? p.s / 2 : 3,
            backgroundColor: p.c,
            borderWidth: 1.5,
            borderColor: colors.line,
            transform: [{ rotate: `${p.r}deg` }],
          }}
        />
      ))}
    </View>
  );
}

/** Fortschritt oben im Spiel (dicker Balken unter der Kopfzeile) */
export function ProgressTop({ pct, color = colors.blue }: { pct: number; color?: string }) {
  return (
    <View style={styles.progressTop}>
      <Bar pct={pct} color={color} height={14} />
    </View>
  );
}

/** Große Ergebnis-Karte mit Sternen, Punktzahl und Konfetti (ab 2 Sternen) */
export function ScoreHero({
  stars,
  big,
  unit,
  points,
  note,
}: {
  stars: number;
  big: string;
  unit?: string;
  points: number;
  note?: string;
}) {
  return (
    <View style={styles.hero}>
      <View style={styles.stars}>
        {[0, 1, 2].map((i) => (
          <RatingStar key={i} size={i === 1 ? 54 : 40} filled={i < stars} />
        ))}
      </View>
      <Text style={styles.big}>
        {big}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <View style={styles.gain}>
        <Text style={styles.gainText}>+{points} Punkte</Text>
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <View style={{ alignSelf: 'stretch', marginTop: spacing.md }}>
        <EcgStrip height={36} beats={4} color={colors.red} />
      </View>
    </View>
  );
}

/** Dunkler Gerätebildschirm (Patientenmonitor) mit Umrandung */
export function MonitorCard({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.monitor, style]}>{children}</View>;
}

export type AnswerState = 'idle' | 'selected' | 'right' | 'wrong' | 'dim';

/** Antwort-Karte mit Buchstaben (A–D) – bei „richtig“ mint, bei „falsch“ rot */
export function AnswerOption({
  letter,
  text,
  state = 'idle',
  onPress,
  disabled,
}: {
  letter: string;
  text: string;
  state?: AnswerState;
  onPress: () => void;
  disabled?: boolean;
}) {
  const bg = { idle: colors.surface, selected: colors.blue, right: colors.mint, wrong: colors.red, dim: colors.surface }[state];
  const fg = state === 'selected' || state === 'wrong' ? colors.white : colors.ink;
  const pressedIn = state !== 'idle' && state !== 'dim';
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      offset={pressedIn ? 0 : 4}
      accessibilityLabel={text}
      style={[
        styles.answer,
        { backgroundColor: bg, borderBottomWidth: 4, borderBottomColor: shade(state === 'idle' || state === 'dim' ? colors.line : bg, state === 'idle' || state === 'dim' ? 0.1 : 0.22) },
        state === 'dim' && { opacity: 0.45 },
        pressedIn && { transform: [{ translateY: 3 }] },
      ]}
    >
      <View style={[styles.letter, (state === 'selected' || state === 'wrong') && { backgroundColor: colors.white }]}>
        <Text style={styles.letterText}>{letter}</Text>
      </View>
      <Text style={[styles.answerText, { color: fg }]}>{text}</Text>
      {state === 'right' && <Text style={styles.mark}>✓</Text>}
      {state === 'wrong' && <Text style={[styles.mark, { color: colors.white }]}>✗</Text>}
    </Tap>
  );
}

const RATINGS: { value: Rating; label: string; symbol: string; color: string }[] = [
  { value: 'niedrig', label: 'niedrig', symbol: '↓', color: '#9BD8FF' },
  { value: 'normal', label: 'normal', symbol: '✓', color: '#8CF0C8' },
  { value: 'hoch', label: 'hoch', symbol: '↑', color: '#FFB38A' },
];

/** Drei dicke Knöpfe „niedrig / normal / hoch“ fürs Normwerte-Training */
export function RateRow({ given, answer, onPick }: { given: Rating | null; answer: Rating; onPick: (r: Rating) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      {RATINGS.map((r) => {
        const chosen = given === r.value;
        const isAnswer = given !== null && answer === r.value;
        const wrongChoice = chosen && !isAnswer;
        return (
          <Tap
            key={r.value}
            disabled={given !== null}
            onPress={() => onPick(r.value)}
            offset={given !== null && (chosen || isAnswer) ? 0 : 4}
            accessibilityLabel={r.label}
            style={[
              styles.rate,
              { backgroundColor: isAnswer ? colors.mint : wrongChoice ? colors.red : r.color },
              given !== null && !chosen && !isAnswer && { opacity: 0.4 },
              given !== null && (chosen || isAnswer) && { transform: [{ translateY: 3 }] },
            ]}
          >
            <Text style={[styles.rateSymbol, wrongChoice && { color: colors.white }, isAnswer && { color: colors.ink }]}>
              {isAnswer ? '✓' : wrongChoice ? '✗' : r.symbol}
            </Text>
            <Text style={[styles.rateLabel, wrongChoice && { color: colors.white }, isAnswer && { color: colors.ink }]}>{r.label}</Text>
          </Tap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  progressTop: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  hero: {
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingTop: spacing.xl,
    gap: 2,
    ...hardShadow(6),
  },
  stars: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  big: {
    color: colors.ink,
    fontSize: 68,
    lineHeight: 74,
    fontFamily: fonts.displayBlack,
    letterSpacing: -2.5,
    marginTop: spacing.sm,
  },
  unit: { fontSize: 22, color: colors.ink, fontFamily: fonts.display, letterSpacing: -0.5 },
  gain: {
    backgroundColor: colors.yellowTint,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 2,
  },
  gainText: { color: colors.ink, fontFamily: fonts.displayBlack, fontSize: 17, letterSpacing: -0.3 },
  note: { color: colors.ink, fontFamily: fonts.mono, fontSize: 12, marginTop: spacing.sm, letterSpacing: 0.4 },
  monitor: {
    backgroundColor: colors.monitorBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    paddingTop: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    ...hardShadow(4),
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
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
  letterText: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.onBright },
  answerText: { flex: 1, fontFamily: fonts.display, fontSize: 16, lineHeight: 21, letterSpacing: -0.3 },
  mark: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.ink },
  rate: { flex: 1, paddingVertical: spacing.lg, alignItems: 'center', borderRadius: 18, borderWidth: 1, borderColor: colors.line },
  rateSymbol: { color: colors.onBright, fontSize: 26, lineHeight: 30, fontFamily: fonts.displayBlack },
  rateLabel: { color: colors.onBright, fontSize: 14, fontFamily: fonts.display },
});
