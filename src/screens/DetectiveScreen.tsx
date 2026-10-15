import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerOption, Confetti } from '../components/Training';
import { Bar, Button, Card, IconTile, Pill, StatChip, Tap, TopBar } from '../components/UI';
import { Kategorie } from '../data/akten';
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
  akteNr,
  archivNachKategorie,
  archiveCount,
  bildStand,
  bilderGeloest,
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
import { colors, fonts, hardShadow, spacing, type } from '../theme';

const GOLD = colors.orange;
const LETTERS = ['A', 'B', 'C', 'D'];

type Phase = 'intro' | 'akte' | 'aufloesung' | 'ende';

const fmt = (f: number) => `×${f.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`;

/** Stempel, der mit Schwung auf die Akte knallt */
function Stamp({ kind }: { kind: 'gold' | 'ok' | 'fail' }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, { toValue: 1, friction: 5, tension: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [a]);
  const color = kind === 'gold' ? GOLD : kind === 'ok' ? colors.mintDark : colors.red;
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
  const [openKat, setOpenKat] = useState<Kategorie | null>(null);

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
      newInArchive: !start.detectiveSolved[akte.fall.id],
    });
    setCombo(nextCombo);
    setResults([...results, r]);
    setPhase('aufloesung');
  };

  const guess = (option: string) => {
    if (wrong.includes(option)) return;
    if (option === akte.fall.diagnosis) return finishAkte(true, wrong.length);
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
      const stamps = Object.fromEntries(akten.map((a, i) => [a.fall.id, stampFor(results[i])]));
      onFinish(total, stamps);
      setPhase('ende');
    }
  };

  // ---------- Start: Rang, Regeln, Archiv ----------
  if (phase === 'intro') {
    const arch = archiveCount(progress);
    const bilder = bilderGeloest(progress);
    const kategorien = archivNachKategorie(progress);
    const { grade, next } = detectiveGrade(progress);
    const pct = next ? (arch.solved - grade.min) / (next.min - grade.min) : 1;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="Detektiv-Akten" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <IconTile icon="🔍" color={colors.white} size={62} />
              <Text style={[styles.heroTitle, { flex: 1 }]}>Der Diagnose-Krimi</Text>
            </View>
            <Text style={styles.heroSub}>
              Jede Akte ist ein echter Notfall. Decke Hinweise auf und finde heraus, was dahintersteckt – je weniger Hinweise du
              brauchst, desto höher die Belohnung.
            </Text>
            <View style={styles.gradeBox}>
              <Text style={styles.gradeIcon}>{grade.icon}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={type.eyebrow}>Dein Detektiv-Rang</Text>
                <Text style={styles.gradeTitle}>{grade.title}</Text>
                <Bar pct={pct} color={colors.violet} height={12} />
                <Text style={type.small}>
                  {next ? `noch ${next.min - arch.solved} Akten bis „${next.title}“` : 'Höchster Rang – alle Akten gelöst!'}
                </Text>
              </View>
            </View>
            <Button label="Ermittlung starten ▶" variant="outline" onPress={begin} />
          </View>

          <View style={styles.kpis}>
            <Kpi value={`${arch.solved}/${arch.total}`} label="Akten gelöst" color={colors.lilac} />
            <Kpi value={String(arch.master)} label="Meisterlösungen" color={colors.yellow} />
            <Kpi value={String(progress.detectiveBest)} label="Bestwert" color={colors.mintTint} />
          </View>

          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>So ermittelst du</Text>
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
            <Rule icon="🧩" text="Jedes Krankheitsbild gibt es in vielen Situationen – typisch, untypisch, irreführend. Kein Fall gleicht dem anderen." />
            <Rule icon="🗄️" text={`Jede neue Akte im Archiv: +${NEW_AKTE_BONUS} Punkte.`} />
            <Rule icon="🚑" text="Alle Punkte landen als € im Budget für deinen Rettungswagen." />
          </Card>

          <View style={{ gap: spacing.md }}>
            <View style={{ gap: 2 }}>
              <Text style={type.eyebrow}>
                Archiv · {arch.solved} von {arch.total} Akten
              </Text>
              <Text style={type.small}>
                {bilder.solved} von {bilder.total} Krankheitsbildern entdeckt – jedes gibt es in mehreren Situationen.
              </Text>
            </View>
            {kategorien.map((k) => {
              const open = openKat === k.id;
              return (
                <View key={k.id} style={{ gap: spacing.sm }}>
                  <Tap
                    onPress={() => setOpenKat(open ? null : k.id)}
                    offset={3}
                    accessibilityLabel={`${k.title}: ${k.solved} von ${k.total} Akten gelöst`}
                    accessibilityState={{ expanded: open }}
                    style={styles.katHead}
                  >
                    <Text style={styles.katIcon}>{k.icon}</Text>
                    <View style={{ flex: 1, gap: 5 }}>
                      <Text style={styles.katTitle}>{k.title}</Text>
                      <Bar pct={k.solved / k.total} color={colors.violet} height={8} />
                    </View>
                    <Text style={styles.katCount}>
                      {k.solved}/{k.total}
                    </Text>
                    <Text style={styles.katChevron}>{open ? '▲' : '▼'}</Text>
                  </Tap>
                  {open && (
                    <View style={styles.archive}>
                      {k.bilder.map((b) => {
                        const gold = b.solved === b.total && b.master === b.total;
                        return (
                          <View
                            key={b.bild.id}
                            style={[
                              styles.folder,
                              L.wide && { width: L.desktop ? '13.4%' : '18.6%' },
                              b.solved === 0 && styles.folderLocked,
                              gold && styles.folderGold,
                            ]}
                          >
                            <Text style={styles.folderIcon}>{gold ? '🏅' : b.solved === b.total ? '🗂️' : b.solved > 0 ? '📂' : '🔒'}</Text>
                            <Text style={[styles.folderText, b.solved === 0 && { color: colors.muted }]} numberOfLines={2}>
                              {b.solved > 0 ? b.bild.diagnosis.replace(/ \(.*\)/, '') : '???'}
                            </Text>
                            <Text style={styles.folderCount}>
                              {b.solved}/{b.total}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
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
        Object.fromEntries(akten.map((a, i) => [a.fall.id, stampFor(results[i])])),
      ),
    });
    const maxCombo = results.reduce((m, r) => Math.max(m, r.combo), 0);
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Detektiv-Akten" title="Ermittlung abgeschlossen" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
          <View style={[styles.hero, { alignItems: 'center' }]}>
            {solved >= 3 && <Confetti />}
            <Text style={styles.heroIcon}>{solved === DETECTIVE_ROUNDS ? '🏆' : solved >= 3 ? '🕵️' : '🔍'}</Text>
            <Text style={[styles.heroTitle, { textAlign: 'center' }]}>
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
              <Text style={{ fontSize: 40, lineHeight: 48, fontFamily: fonts.regular }}>{after.grade.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={type.eyebrow}>Neuer Detektiv-Rang!</Text>
                <Text style={type.h2}>{after.grade.title}</Text>
              </View>
            </Card>
          )}
          <View style={styles.kpis}>
            <Kpi value={String(newOnes)} label="Neu im Archiv" color={colors.lilac} />
            <Kpi value={maxCombo > 1 ? fmt(comboFactor(maxCombo)) : '–'} label="Beste Combo" color={colors.peach} />
            <Kpi
              value={String(Math.max(start.detectiveBest, total))}
              label={total > start.detectiveBest ? 'Neuer Bestwert!' : 'Bestwert'}
              color={colors.yellow}
            />
          </View>
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>Meine Akten</Text>
            {akten.map((a, i) => {
              const r = results[i];
              return (
                <View key={a.fall.id} style={styles.line}>
                  <Text style={{ fontSize: 22, fontFamily: fonts.regular }}>{!r.solved ? '❌' : r.genius ? '🏅' : '📂'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={type.headline}>{a.fall.diagnosis}</Text>
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
  const c = akte.fall;
  // Stand im Krankheitsbild einschließlich der Akten dieser Ermittlung
  const bildNow = done
    ? bildStand(
        {
          ...start,
          detectiveSolved: mergeArchive(
            start.detectiveSolved,
            Object.fromEntries(results.map((r, i) => [akten[i].fall.id, stampFor(r)])),
          ),
        },
        c.bild,
      )
    : undefined;
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker={`Akte ${index + 1} von ${DETECTIVE_ROUNDS}`}
        title={done ? (last.solved ? 'Fall gelöst!' : 'Akte ungelöst') : 'Was steckt dahinter?'}
        onBack={onBack}
        right={<StatChip value={total} label="Punkte" color={colors.lilac} />}
      />
      <View style={styles.progress}>
        {akten.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < results.length && {
                backgroundColor: results[i].solved ? (results[i].genius ? colors.yellow : colors.mint) : colors.red,
              },
              i === index && !done && { backgroundColor: colors.violet },
            ]}
          />
        ))}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        {!done && (
          <View style={styles.meter}>
            <View style={{ flex: 1, minWidth: 150, gap: 2 }}>
              <Text style={type.eyebrow}>Belohnung jetzt</Text>
              <Text style={styles.meterValue}>
                {reward} <Text style={styles.meterUnit}>Punkte</Text>
              </Text>
              <Bar pct={reward / AKTE_START} color={colors.violet} height={12} style={{ maxWidth: 260, marginTop: 4 }} />
            </View>
            {combo > 0 && <Pill label={`🔥 Combo ${fmt(nextFactor)}`} color={colors.orange} />}
            {revealed.length <= 1 && wrong.length === 0 && <Pill label="⭐ Geniestreich möglich" color={colors.yellow} />}
          </View>
        )}

        <View style={styles.dossier}>
          <View style={styles.dossierTab}>
            <Text style={styles.dossierTabText}>Vertraulich · Akte {String(akteNr(c.id)).padStart(3, '0')}</Text>
          </View>
          <Text style={styles.dossierLabel}>📟 Meldung der Leitstelle</Text>
          <Text style={styles.dossierText}>„{c.dispatch}“</Text>
          <Text style={styles.dossierPlace}>📍 {c.location}</Text>
          {done && <Stamp kind={!last.solved ? 'fail' : last.genius ? 'gold' : 'ok'} />}
        </View>

        <View style={styles.clues}>
          {akte.clues.map((cl, i) => {
            const open = revealed.includes(i) || done;
            const wasUsed = revealed.includes(i);
            return (
              <Tap
                key={i}
                onPress={() => reveal(i)}
                disabled={open}
                offset={3}
                accessibilityLabel={open ? cl.label : `${cl.label} aufdecken`}
                style={[
                  styles.clue,
                  L.wide && { width: '31.8%' },
                  open ? styles.clueOpen : styles.clueClosed,
                  done && !wasUsed && styles.clueUnused,
                ]}
              >
                <View style={styles.clueHead}>
                  <Text style={styles.clueIcon}>{cl.icon}</Text>
                  <Text style={[styles.clueLabel, !open && { color: colors.muted }]}>{cl.label}</Text>
                </View>
                {open ? (
                  <Text style={styles.clueText}>{cl.text}</Text>
                ) : (
                  <Text style={styles.clueCost}>Aufdecken · −{CLUE_COST}</Text>
                )}
              </Tap>
            );
          })}
        </View>

        {!done ? (
          <View style={{ gap: spacing.md }}>
            <View style={styles.suspectHead}>
              <Text style={type.h2}>Mein Verdacht</Text>
              <Text style={styles.tries}>
                Versuche: {'●'.repeat(MAX_GUESSES - wrong.length)}
                {'○'.repeat(wrong.length)}
              </Text>
            </View>
            {akte.options.map((o, idx) => {
              const isWrong = wrong.includes(o);
              return (
                <AnswerOption
                  key={o}
                  letter={LETTERS[idx]}
                  text={isWrong ? `${o}  ✗ −${WRONG_COST}` : o}
                  state={isWrong ? 'wrong' : 'idle'}
                  disabled={isWrong}
                  onPress={() => guess(o)}
                />
              );
            })}
          </View>
        ) : (
          <>
            <Card style={[{ gap: spacing.sm }, { borderLeftColor: last.solved ? colors.mint : colors.red }]}>
              <Text style={[type.eyebrow, { marginTop: spacing.sm }]}>Auflösung</Text>
              <Text style={type.h2}>{c.diagnosis}</Text>
              <Text style={type.body}>{c.explanation}</Text>
              {bildNow && (
                <View style={styles.bildLine}>
                  <Text style={styles.bildLineText}>
                    {bildNow.solved === bildNow.total
                      ? `🗂️ Krankheitsbild komplett – alle ${bildNow.total} Situationen gelöst!`
                      : `🧩 Dieses Krankheitsbild: ${bildNow.solved} von ${bildNow.total} Situationen im Archiv`}
                  </Text>
                </View>
              )}
              <Text style={[type.headline, { marginTop: spacing.xs }]}>Die Beweise (Leitsymptome)</Text>
              {c.leitsymptome.map((l) => (
                <Text key={l} style={type.body}>
                  🔎 {l}
                </Text>
              ))}
            </Card>
            <Card style={{ gap: 6 }}>
              <Text style={type.eyebrow}>Meine Belohnung</Text>
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

function Kpi({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={[styles.kpi, { backgroundColor: color }]}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={[type.eyebrow, { textAlign: 'center', fontSize: 9.5 }]}>{label}</Text>
    </View>
  );
}

function Rule({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 18, width: 24, fontFamily: fonts.regular }}>{icon}</Text>
      <Text style={[type.body, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={[styles.row, strong && styles.rowStrong]}>
      <Text style={[type.body, { flex: 1 }, strong && { fontFamily: fonts.bold }]}>{label}</Text>
      <Text style={[type.body, { fontFamily: strong ? fonts.displayBlack : fonts.semibold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl },
  hero: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
    padding: spacing.lg + 2,
    gap: spacing.md,
    ...hardShadow(6),
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroIcon: { fontSize: 48, lineHeight: 58, fontFamily: fonts.regular },
  heroTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 24, lineHeight: 29 },
  heroSub: { color: colors.muted, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  gradeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: spacing.md,
  },
  gradeIcon: { fontSize: 38, lineHeight: 46, fontFamily: fonts.regular },
  gradeTitle: { fontFamily: fonts.displayBlack, fontSize: 21, lineHeight: 23, color: colors.ink, letterSpacing: -0.6 },
  total: { color: colors.ink, fontFamily: fonts.displayBlack, fontSize: 64, lineHeight: 70, letterSpacing: -2.5 },
  money: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: spacing.sm,
  },
  moneyText: { color: colors.ink, fontFamily: fonts.display, fontSize: 14, textAlign: 'center' },
  promo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  kpis: { flexDirection: 'row', gap: spacing.md },
  kpi: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    ...hardShadow(3),
  },
  kpiValue: { fontFamily: fonts.displayBlack, fontSize: 24, lineHeight: 27, color: colors.ink, letterSpacing: -0.7 },
  katHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  katIcon: { fontSize: 24, lineHeight: 30, fontFamily: fonts.regular },
  katTitle: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink, letterSpacing: -0.3 },
  katCount: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink },
  katChevron: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  bildLine: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lilac,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  bildLineText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  archive: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  folder: {
    width: '31.5%',
    backgroundColor: colors.butter,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 82,
    gap: 2,
    ...hardShadow(2),
  },
  folderLocked: { backgroundColor: colors.white, borderStyle: 'dashed', borderColor: colors.grau300, boxShadow: 'none' },
  folderGold: { backgroundColor: colors.yellow },
  folderIcon: { fontSize: 24, lineHeight: 30, fontFamily: fonts.regular },
  folderText: {
    fontFamily: fonts.display,
    fontSize: 11.5,
    lineHeight: 14,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  folderCount: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  progressDot: { flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  meter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: spacing.lg,
    ...hardShadow(4),
  },
  meterValue: { fontFamily: fonts.displayBlack, fontSize: 34, lineHeight: 36, color: colors.violet, letterSpacing: -1.2 },
  meterUnit: { fontFamily: fonts.mono, fontSize: 13, color: colors.muted, letterSpacing: 0.4 },
  dossier: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: 6,
    marginTop: 12,
    ...hardShadow(4),
  },
  dossierTab: {
    position: 'absolute',
    top: -14,
    left: spacing.lg,
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  dossierTabText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1, color: colors.ink, textTransform: 'uppercase' },
  dossierLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkSoft },
  dossierText: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 25, color: colors.ink },
  dossierPlace: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkSoft },
  stamp: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,233,168,0.9)',
  },
  stampText: { fontFamily: fonts.displayBlack, fontSize: 16, letterSpacing: 1, textTransform: 'uppercase' },
  clues: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  clue: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    minHeight: 98,
    gap: 6,
  },
  clueClosed: { backgroundColor: colors.paper, borderStyle: 'dashed', borderColor: colors.grau300 },
  clueOpen: { backgroundColor: colors.white },
  clueUnused: { opacity: 0.5 },
  clueHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clueIcon: { fontSize: 18, fontFamily: fonts.regular },
  clueLabel: { fontFamily: fonts.mono, fontSize: 11.5, letterSpacing: 0.5, color: colors.muted, textTransform: 'uppercase' },
  clueText: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19, color: colors.ink },
  clueCost: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.violet, marginTop: 'auto', letterSpacing: -0.2 },
  suspectHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  tries: { fontFamily: fonts.mono, fontSize: 13, color: colors.muted },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 4 },
  linePts: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.ink, letterSpacing: -0.4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowStrong: { borderTopWidth: 2, borderTopColor: colors.ink, paddingTop: 6, marginTop: 2 },
});
