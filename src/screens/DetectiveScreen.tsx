import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Button, Card, Eyebrow, Pill, TopBar } from '../components/UI';
import { CASES } from '../data/cases';
import {
  AKTE_MIN,
  AKTE_START,
  AkteResult,
  ArchiveStamp,
  CLUE_COST,
  DETECTIVE_ROUNDS,
  GENIUS_BONUS,
  MAX_GUESSES,
  NEW_AKTE_BONUS,
  WRONG_COST,
  archiveCount,
  comboFactor,
  detectiveGrade,
  makeInvestigation,
  mergeArchive,
  scoreAkte,
  stampFor,
} from '../game/detective';
import { euro } from '../game/equipment';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, radius, shadow, spacing, type } from '../theme';

const NOIR = ['#1E2A55', '#3A1F5C'];
const PAPER = '#FBF4E2';
const GOLD = '#E8A400';

type Phase = 'intro' | 'akte' | 'aufloesung' | 'ende';

const fmt = (f: number) => `×${f.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`;

/** Stempel, der mit Schwung auf die Akte knallt */
function Stamp({ kind }: { kind: 'gold' | 'ok' | 'fail' }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, { toValue: 1, friction: 5, tension: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [a]);
  const color = kind === 'gold' ? GOLD : kind === 'ok' ? colors.gruen : colors.signalrot;
  const label = kind === 'gold' ? 'Meisterlösung' : kind === 'ok' ? 'Gelöst' : 'Ungelöst';
  return (
    <Animated.View
      style={[
        styles.stamp,
        {
          borderColor: color,
          opacity: a,
          transform: [{ rotate: '-8deg' }, { scale: a.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] }) }],
        },
      ]}
    >
      <Text style={[styles.stampText, { color }]}>{label}</Text>
    </Animated.View>
  );
}

function NoirBg() {
  return (
    <Svg style={StyleSheet.absoluteFill as object} width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="noir" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={NOIR[0]} />
          <Stop offset="1" stopColor={NOIR[1]} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#noir)" />
    </Svg>
  );
}

/** Detektiv-Akten: Diagnose-Krimi mit Hinweisen, Combo, Archiv und Detektiv-Rang */
export function DetectiveScreen({
  progress,
  onFinish,
  onBack,
  onGarage,
}: {
  progress: Progress;
  onFinish: (points: number, stamps: Record<string, ArchiveStamp | 0>) => void;
  onBack: () => void;
  onGarage: () => void;
}) {
  const L = useLayout();
  const [phase, setPhase] = useState<Phase>('intro');
  const [runKey, setRunKey] = useState(0);
  // Spielstand zu Beginn der Ermittlung (Props ändern sich nach onFinish)
  const [start, setStart] = useState(progress);
  const akten = useMemo(() => makeInvestigation(start), [runKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [results, setResults] = useState<AkteResult[]>([]);
  const [combo, setCombo] = useState(0);

  const scroll = useRef<ScrollView>(null);
  // Nach dem Lösen und bei jeder neuen Akte nach oben – dort knallt der Stempel auf die Akte
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: true });
  }, [phase, index]);
  const akte = akten[index];
  const reward = Math.max(AKTE_MIN, AKTE_START - revealed.length * CLUE_COST - wrong.length * WRONG_COST);
  const total = results.reduce((s, r) => s + r.points, 0);
  const last = results[results.length - 1];

  const begin = () => {
    setStart(progress);
    setRunKey((k) => k + 1);
    setIndex(0);
    setRevealed([]);
    setWrong([]);
    setResults([]);
    setCombo(0);
    setPhase('akte');
  };

  const reveal = (i: number) => {
    if (!revealed.includes(i)) setRevealed([...revealed, i]);
  };

  const finishAkte = (solved: boolean, wrongCount: number) => {
    const nextCombo = solved ? combo + 1 : 0;
    const r = scoreAkte({
      solved,
      cluesUsed: revealed.length,
      wrong: wrongCount,
      combo: nextCombo,
      newInArchive: !start.detectiveSolved[akte.medCase.id],
    });
    setCombo(nextCombo);
    setResults([...results, r]);
    setPhase('aufloesung');
  };

  const guess = (option: string) => {
    if (wrong.includes(option)) return;
    if (option === akte.medCase.diagnosis) return finishAkte(true, wrong.length);
    const w = [...wrong, option];
    setWrong(w);
    if (w.length >= MAX_GUESSES) finishAkte(false, w.length);
  };

  const nextAkte = () => {
    if (index + 1 < akten.length) {
      setIndex(index + 1);
      setRevealed([]);
      setWrong([]);
      setPhase('akte');
    } else {
      const stamps = Object.fromEntries(akten.map((a, i) => [a.medCase.id, stampFor(results[i])]));
      onFinish(total, stamps);
      setPhase('ende');
    }
  };

  // ---------- Start: Rang, Regeln, Archiv ----------
  if (phase === 'intro') {
    const arch = archiveCount(progress);
    const { grade, next } = detectiveGrade(progress);
    const pct = next ? (arch.solved - grade.min) / (next.min - grade.min) : 1;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="Detektiv-Akten" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
          <View style={styles.hero}>
            <NoirBg />
            <Text style={styles.heroIcon}>🔍</Text>
            <Text style={styles.heroTitle}>Der Diagnose-Krimi</Text>
            <Text style={styles.heroSub}>
              Jede Akte ist ein echter Notfall. Decke Hinweise auf und finde heraus, was dahintersteckt – je weniger Hinweise du
              brauchst, desto höher die Belohnung.
            </Text>
            <View style={styles.gradeBox}>
              <Text style={styles.gradeIcon}>{grade.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.gradeKicker}>Dein Detektiv-Rang</Text>
                <Text style={styles.gradeTitle}>{grade.title}</Text>
                <View style={styles.gradeBar}>
                  <View style={[styles.gradeFill, { width: `${pct * 100}%` }]} />
                </View>
                <Text style={styles.gradeNext}>
                  {next ? `noch ${next.min - arch.solved} Akten bis „${next.title}“` : 'Höchster Rang – alle Akten gelöst!'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={begin}
              accessibilityRole="button"
              style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.heroBtnText}>Ermittlung starten</Text>
            </Pressable>
          </View>

          <View style={styles.kpis}>
            <Kpi value={`${arch.solved}/${arch.total}`} label="Akten gelöst" />
            <Kpi value={String(arch.master)} label="Meisterlösungen" />
            <Kpi value={String(progress.detectiveBest)} label="Bestwert" />
          </View>

          <Card style={{ gap: spacing.sm }}>
            <Eyebrow title="So ermittelst du" />
            <Rule icon="📟" text="Die Meldung der Leitstelle ist gratis." />
            <Rule
              icon="🔍"
              text={`Jede Akte startet mit ${AKTE_START} Punkten. Jeder aufgedeckte Hinweis kostet ${CLUE_COST}.`}
            />
            <Rule
              icon="❌"
              text={`Ein falscher Verdacht kostet ${WRONG_COST} – nach ${MAX_GUESSES} Fehlversuchen bleibt die Akte ungelöst.`}
            />
            <Rule icon="🔥" text="Mehrere Akten in Folge gelöst: Combo bis ×2." />
            <Rule icon="⭐" text={`Geniestreich: mit höchstens einem Hinweis gelöst = +${GENIUS_BONUS} und goldener Stempel.`} />
            <Rule icon="🗄️" text={`Jede neue Akte im Archiv: +${NEW_AKTE_BONUS} Punkte.`} />
            <Rule icon="🚑" text="Alle Punkte landen als € im Budget für deinen Rettungswagen." />
          </Card>

          <View style={{ gap: spacing.sm }}>
            <Eyebrow title={`Archiv · ${arch.solved} von ${arch.total}`} />
            <View style={styles.archive}>
              {CASES.map((c, i) => {
                const s = progress.detectiveSolved[c.id];
                return (
                  <View
                    key={c.id}
                    style={[styles.folder, L.wide && { width: L.desktop ? '13.4%' : '18.6%' }, !s && styles.folderLocked]}
                  >
                    <Text style={styles.folderIcon}>{s === 2 ? '🏅' : s === 1 ? '📂' : '🔒'}</Text>
                    <Text style={[styles.folderText, !s && { color: colors.grau500 }]} numberOfLines={2}>
                      {s ? c.diagnosis.replace(/ \(.*\)/, '') : `Akte ${String(i + 1).padStart(2, '0')}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------- Abschlussbericht ----------
  if (phase === 'ende') {
    const solved = results.filter((r) => r.solved).length;
    const newOnes = results.filter((r) => r.newInArchive).length;
    const before = detectiveGrade(start);
    const after = detectiveGrade({
      ...start,
      detectiveSolved: mergeArchive(
        start.detectiveSolved,
        Object.fromEntries(akten.map((a, i) => [a.medCase.id, stampFor(results[i])])),
      ),
    });
    const maxCombo = results.reduce((m, r) => Math.max(m, r.combo), 0);
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Detektiv-Akten" title="Ermittlung abgeschlossen" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
          <View style={[styles.hero, { alignItems: 'center' }]}>
            <NoirBg />
            <Text style={styles.heroIcon}>{solved === DETECTIVE_ROUNDS ? '🏆' : solved >= 3 ? '🕵️' : '🔍'}</Text>
            <Text style={styles.heroTitle}>
              {solved} von {DETECTIVE_ROUNDS} Akten gelöst
            </Text>
            <Text style={styles.total}>+{total}</Text>
            <Text style={styles.heroSub}>Punkte</Text>
            <View style={styles.money}>
              <Text style={styles.moneyText}>🚑 +{euro(total)} Budget für deinen Rettungswagen</Text>
            </View>
          </View>
          {after.index > before.index && (
            <Card style={[styles.promo, { borderLeftColor: GOLD }]}>
              <Text style={{ fontSize: 40 }}>{after.grade.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={type.small}>Neuer Detektiv-Rang!</Text>
                <Text style={type.h2}>{after.grade.title}</Text>
              </View>
            </Card>
          )}
          <View style={styles.kpis}>
            <Kpi value={String(newOnes)} label="Neu im Archiv" />
            <Kpi value={maxCombo > 1 ? fmt(comboFactor(maxCombo)) : '–'} label="Beste Combo" />
            <Kpi
              value={String(Math.max(start.detectiveBest, total))}
              label={total > start.detectiveBest ? 'Neuer Bestwert!' : 'Bestwert'}
            />
          </View>
          <Card style={{ gap: spacing.sm }}>
            <Eyebrow title="Meine Akten" />
            {akten.map((a, i) => {
              const r = results[i];
              return (
                <View key={a.medCase.id} style={styles.line}>
                  <Text style={{ fontSize: 22 }}>{!r.solved ? '❌' : r.genius ? '🏅' : '📂'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={type.headline}>{a.medCase.diagnosis}</Text>
                    <Text style={type.small}>
                      {r.solved
                        ? `${r.cluesUsed} ${r.cluesUsed === 1 ? 'Hinweis' : 'Hinweise'}${r.wrong ? ` · ${r.wrong} Fehlversuch` : ''}${r.factor > 1 ? ` · Combo ${fmt(r.factor)}` : ''}`
                        : 'Ungelöst – im Lexikon nachlesen'}
                    </Text>
                  </View>
                  <Text style={styles.linePts}>+{r.points}</Text>
                </View>
              );
            })}
          </Card>
          <Button label="Neue Ermittlung" onPress={begin} />
          <Button label="Budget ausgeben: zum Rettungswagen" variant="tinted" onPress={onGarage} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  // ---------- Akte & Auflösung ----------
  const done = phase === 'aufloesung';
  const nextFactor = comboFactor(combo + 1);
  const c = akte.medCase;
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker={`Akte ${index + 1} von ${DETECTIVE_ROUNDS}`}
        title={done ? (last.solved ? 'Fall gelöst!' : 'Akte ungelöst') : 'Was steckt dahinter?'}
        onBack={onBack}
        right={
          <View style={styles.chip}>
            <Text style={styles.chipValue}>{total}</Text>
            <Text style={styles.chipLabel}>Punkte</Text>
          </View>
        }
      />
      <View style={styles.progress}>
        {akten.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < results.length && {
                backgroundColor: results[i].solved ? (results[i].genius ? GOLD : colors.gruen) : colors.signalrot,
              },
              i === index && !done && { backgroundColor: colors.indigo },
            ]}
          />
        ))}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        {!done && (
          <View style={styles.meter}>
            <View style={{ flex: 1 }}>
              <Text style={type.small}>Belohnung jetzt</Text>
              <Text style={styles.meterValue}>
                {reward} <Text style={styles.meterUnit}>Punkte</Text>
              </Text>
              <View style={styles.meterBar}>
                <View style={[styles.meterFill, { width: `${(reward / AKTE_START) * 100}%` }]} />
              </View>
            </View>
            {combo > 0 && <Pill label={`🔥 Combo ${fmt(nextFactor)}`} color={colors.leuchtorange} />}
            {revealed.length <= 1 && wrong.length === 0 && <Pill label="⭐ Geniestreich möglich" color={GOLD} light />}
          </View>
        )}

        <View style={styles.dossier}>
          <View style={styles.dossierTab}>
            <Text style={styles.dossierTabText}>Vertraulich · Akte {String(CASES.indexOf(c) + 1).padStart(2, '0')}</Text>
          </View>
          <Text style={styles.dossierLabel}>📟 Meldung der Leitstelle</Text>
          <Text style={styles.dossierText}>„{c.dispatch}“</Text>
          <Text style={styles.dossierPlace}>{c.location}</Text>
          {done && <Stamp kind={!last.solved ? 'fail' : last.genius ? 'gold' : 'ok'} />}
        </View>

        <View style={styles.clues}>
          {akte.clues.map((cl, i) => {
            const open = revealed.includes(i) || done;
            const wasUsed = revealed.includes(i);
            return (
              <Pressable
                key={i}
                onPress={() => reveal(i)}
                disabled={open}
                accessibilityRole="button"
                accessibilityLabel={open ? cl.label : `${cl.label} aufdecken`}
                style={({ pressed }) => [
                  styles.clue,
                  L.wide && { width: '31.8%' },
                  open ? styles.clueOpen : styles.clueClosed,
                  done && !wasUsed && styles.clueUnused,
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                <View style={styles.clueHead}>
                  <Text style={styles.clueIcon}>{cl.icon}</Text>
                  <Text style={[styles.clueLabel, !open && { color: '#C9CCF5' }]}>{cl.label}</Text>
                </View>
                {open ? (
                  <Text style={styles.clueText}>{cl.text}</Text>
                ) : (
                  <Text style={styles.clueCost}>Aufdecken · −{CLUE_COST}</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {!done ? (
          <View style={{ gap: spacing.sm }}>
            <View style={styles.suspectHead}>
              <Text style={type.h2}>Mein Verdacht</Text>
              <Text style={type.small}>
                Versuche: {'●'.repeat(MAX_GUESSES - wrong.length)}
                {'○'.repeat(wrong.length)}
              </Text>
            </View>
            {akte.options.map((o) => {
              const isWrong = wrong.includes(o);
              return (
                <Pressable
                  key={o}
                  onPress={() => guess(o)}
                  disabled={isWrong}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.suspect,
                    isWrong && styles.suspectWrong,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Text style={[styles.suspectText, isWrong && styles.suspectTextWrong]}>{o}</Text>
                  {isWrong && <Text style={styles.suspectX}>✗ −{WRONG_COST}</Text>}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <>
            <Card style={[{ gap: spacing.sm }, { borderLeftColor: last.solved ? colors.gruen : colors.signalrot }]}>
              <Eyebrow title="Auflösung" />
              <Text style={type.h2}>{c.diagnosis}</Text>
              <Text style={type.body}>{c.explanation}</Text>
              <Text style={[type.headline, { marginTop: spacing.xs }]}>Die Beweise (Leitsymptome)</Text>
              {c.leitsymptome.map((l) => (
                <Text key={l} style={type.body}>
                  🔎 {l}
                </Text>
              ))}
            </Card>
            <Card style={{ gap: 6 }}>
              <Eyebrow title="Meine Belohnung" />
              {last.solved ? (
                <>
                  <Row
                    label={`Start ${AKTE_START} − ${last.cluesUsed} Hinweise${last.wrong ? ` − ${last.wrong} Fehlversuch` : ''}`}
                    value={`${last.base}`}
                  />
                  {last.genius && <Row label="⭐ Geniestreich" value={`+${GENIUS_BONUS}`} />}
                  {last.factor > 1 && <Row label={`🔥 Combo ${fmt(last.factor)} (${last.combo} in Folge)`} value="" />}
                  {last.newInArchive && <Row label="🗄️ Neu im Archiv" value={`+${NEW_AKTE_BONUS}`} />}
                  <Row label="Gesamt" value={`+${last.points}`} strong />
                </>
              ) : (
                <Text style={type.body}>
                  Diesmal keine Punkte – die Combo ist gerissen. Merk dir die Beweise oben für das nächste Mal!
                </Text>
              )}
            </Card>
            <Button label={index + 1 < akten.length ? 'Nächste Akte' : 'Ermittlung abschließen'} onPress={nextAkte} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={[type.small, { textAlign: 'center' }]}>{label}</Text>
    </View>
  );
}

function Rule({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 18, width: 24 }}>{icon}</Text>
      <Text style={[type.body, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={[styles.row, strong && styles.rowStrong]}>
      <Text style={[type.body, { flex: 1 }, strong && { fontFamily: fonts.bold }]}>{label}</Text>
      <Text style={[type.body, { fontFamily: strong ? fonts.extrabold : fonts.semibold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl },
  hero: { borderRadius: radius.lg, overflow: 'hidden', padding: spacing.xl, gap: spacing.sm, ...shadow },
  heroIcon: { fontSize: 44, lineHeight: 54 },
  heroTitle: { color: colors.weiss, fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 31, letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  gradeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  gradeIcon: { fontSize: 38, lineHeight: 46 },
  gradeKicker: { color: '#C9CCF5', fontFamily: fonts.medium, fontSize: 12 },
  gradeTitle: { color: colors.weiss, fontFamily: fonts.bold, fontSize: 19, letterSpacing: -0.3 },
  gradeBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginVertical: 6, overflow: 'hidden' },
  gradeFill: { height: 6, backgroundColor: GOLD, borderRadius: 3 },
  gradeNext: { color: '#C9CCF5', fontFamily: fonts.regular, fontSize: 12 },
  heroBtn: {
    backgroundColor: colors.weiss,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
  heroBtnText: { color: NOIR[0], fontFamily: fonts.bold, fontSize: 17 },
  total: { color: GOLD, fontFamily: fonts.extrabold, fontSize: 56, lineHeight: 62, letterSpacing: -1.5 },
  money: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: spacing.sm,
  },
  moneyText: { color: colors.weiss, fontFamily: fonts.semibold, fontSize: 14, textAlign: 'center' },
  promo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  kpis: { flexDirection: 'row', gap: spacing.sm },
  kpi: {
    flex: 1,
    backgroundColor: colors.weiss,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    ...shadow,
  },
  kpiValue: { fontFamily: fonts.extrabold, fontSize: 22, color: colors.graphit, letterSpacing: -0.5 },
  archive: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  folder: {
    width: '31.5%',
    backgroundColor: PAPER,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 78,
    gap: 2,
  },
  folderLocked: { backgroundColor: colors.grau200 },
  folderIcon: { fontSize: 24, lineHeight: 30 },
  folderText: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.graphit, textAlign: 'center' },
  chip: { alignItems: 'center', backgroundColor: '#ECEBFB', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  chipValue: { color: colors.indigo, fontFamily: fonts.bold, fontSize: 17 },
  chipLabel: { color: colors.indigo, fontFamily: fonts.medium, fontSize: 10 },
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  progressDot: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.grau200 },
  meter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.weiss,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow,
  },
  meterValue: { fontFamily: fonts.extrabold, fontSize: 28, color: colors.indigo, letterSpacing: -0.6 },
  meterUnit: { fontFamily: fonts.medium, fontSize: 14, color: colors.grau500 },
  meterBar: { height: 6, backgroundColor: colors.grau200, borderRadius: 3, marginTop: 6, overflow: 'hidden', maxWidth: 260 },
  meterFill: { height: 6, backgroundColor: colors.indigo, borderRadius: 3 },
  dossier: { backgroundColor: PAPER, borderRadius: radius.md, padding: spacing.lg, paddingTop: spacing.xl, gap: 6, ...shadow },
  dossierTab: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    backgroundColor: '#E9D9B0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dossierTabText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1, color: '#7A5B12', textTransform: 'uppercase' },
  dossierLabel: { fontFamily: fonts.semibold, fontSize: 13, color: '#7A5B12' },
  dossierText: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, color: colors.graphit, letterSpacing: -0.3 },
  dossierPlace: { fontFamily: fonts.medium, fontSize: 13, color: '#8A7A55' },
  stamp: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(251,244,226,0.85)',
  },
  stampText: { fontFamily: fonts.extrabold, fontSize: 16, letterSpacing: 1.5, textTransform: 'uppercase' },
  clues: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  clue: { width: '48.5%', flexGrow: 1, borderRadius: 16, padding: spacing.md, minHeight: 96, gap: 6 },
  clueClosed: { backgroundColor: NOIR[0] },
  clueOpen: { backgroundColor: colors.weiss, ...shadow },
  clueUnused: { opacity: 0.55 },
  clueHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clueIcon: { fontSize: 18 },
  clueLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau500 },
  clueText: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19, color: colors.graphit },
  clueCost: { fontFamily: fonts.semibold, fontSize: 14, color: colors.weiss, marginTop: 'auto' },
  suspectHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  suspect: {
    backgroundColor: colors.weiss,
    borderRadius: 14,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow,
  },
  suspectWrong: { backgroundColor: '#FFE5E3' },
  suspectText: { flex: 1, fontFamily: fonts.semibold, fontSize: 17, color: colors.graphit },
  suspectTextWrong: { color: colors.signalrot, textDecorationLine: 'line-through' },
  suspectX: { fontFamily: fonts.bold, fontSize: 14, color: colors.signalrot },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 4 },
  linePts: { fontFamily: fonts.extrabold, fontSize: 17, color: colors.graphit },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowStrong: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.grau300, paddingTop: 6, marginTop: 2 },
});
