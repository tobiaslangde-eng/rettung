import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Scene, sceneFor } from '../components/Scene';
import { AnswerOption } from '../components/Training';
import { Button, Card, Pill, Tap, TopBar } from '../components/UI';
import { HelferFall } from '../data/helfer';
import { Badge } from '../game/achievements';
import { HelferBonus, HelferErgebnis, bewerteHelfer } from '../game/helfer';
import { useRolle } from '../game/rolle';
import { shuffle } from '../game/scoring';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

type Phase = 'lage' | 'pruefen' | 'erkennen' | 'handeln' | 'ergebnis';

const SCHRITTE: { id: Phase; label: string }[] = [
  { id: 'lage', label: 'Lage' },
  { id: 'pruefen', label: 'Prüfen' },
  { id: 'erkennen', label: 'Erkennen' },
  { id: 'handeln', label: 'Handeln' },
];

const LETTERS = ['A', 'B', 'C', 'D'];

export interface HelferAbschluss {
  /** Punkte inklusive Ausrüstung */
  punkte: number;
  ausruestung: number;
  goalBonus: number;
  newBadges: Badge[];
  promotion?: string;
}

/** Ersthelfer-Notfall: Lage erfassen, prüfen, erkennen, richtig handeln. */
export function HelferScreen({
  fall,
  daily,
  pointsPct,
  bonus,
  lichtHinweis = 0,
  onFinish,
  onNext,
  onHome,
}: {
  fall: HelferFall;
  daily: boolean;
  /** Punkteaufschlag durch die Ausrüstung */
  pointsPct: number;
  /** Wirkung der Ausrüstung auf die Bewertung */
  bonus?: HelferBonus;
  /** Licht: 0 kein Hinweis, 1 Anzahl, 2 Anzahl offen, 3 Sterne */
  lichtHinweis?: 0 | 1 | 2 | 3;
  onFinish: (e: HelferErgebnis, punkte: number) => HelferAbschluss;
  onNext: () => void;
  onHome: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const rolle = useRolle();
  const scroll = useRef<ScrollView>(null);
  const [phase, setPhase] = useState<Phase>('lage');
  const [gepruefte, setGepruefte] = useState<number[]>([]);
  const [antwort, setAntwort] = useState<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<number[]>([]);
  const [ergebnis, setErgebnis] = useState<{ e: HelferErgebnis; a: HelferAbschluss } | null>(null);
  const optionen = useMemo(() => shuffle([fall.diagnose, ...fall.falsch]), [fall]);
  const reihenfolge = useMemo(() => shuffle(fall.massnahmen.map((_, i) => i)), [fall]);

  const wichtigGesamt = fall.checks.filter((c) => c.wichtig).length;
  const wichtigOffen = fall.checks.filter((c, i) => c.wichtig && !gepruefte.includes(i)).length;

  const go = (p: Phase) => {
    setPhase(p);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const abschliessen = () => {
    const e = bewerteHelfer(fall, gepruefte, antwort ?? '', gewaehlt, bonus);
    const extra = Math.round((e.punkte * pointsPct) / 100);
    const tagesBonus = daily ? Math.round(e.punkte * 0.5) : 0;
    const a = onFinish(e, e.punkte + extra + tagesBonus);
    setErgebnis({ e, a: { ...a, ausruestung: extra } });
    go('ergebnis');
  };

  const idx = SCHRITTE.findIndex((s) => s.id === phase);
  const kopf = (
    <View style={styles.steps}>
      {SCHRITTE.map((s, i) => (
        <View key={s.id} style={styles.step}>
          <View style={[styles.stepBar, { backgroundColor: i <= idx || phase === 'ergebnis' ? rolle.akzent : colors.line }]} />
          <Text style={[styles.stepLabel, i === idx && { color: colors.ink, fontFamily: fonts.semibold }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker={daily ? 'Notfall des Tages' : 'Notfall'}
        title={phase === 'ergebnis' ? 'Geschafft' : fall.titel}
        onBack={onHome}
      />
      {phase !== 'ergebnis' && kopf}
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        {phase === 'lage' && (
          <>
            <View style={styles.szene}>
              <Scene {...sceneFor(fall.location, `${fall.situation} ${fall.titel}`)} seed={fall.id} accent={r.akzent} width={L.wide ? 520 : 358} />
            </View>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>📍 {fall.location}</Text>
              <Text style={styles.lead}>{fall.situation}</Text>
              <Text style={type.small}>
                {fall.patient.name}, {fall.patient.age === 0 ? 'unter 1 Jahr' : `${fall.patient.age} Jahre`}
              </Text>
            </Card>
            <Card style={styles.tip}>
              <Text style={styles.tipText}>
                Du bist Ersthelfer/in – ohne Messgeräte. Achte zuerst auf deine eigene Sicherheit, dann prüfe, was los ist.
              </Text>
            </Card>
            <Button label="Hingehen und prüfen" onPress={() => go('pruefen')} />
          </>
        )}

        {phase === 'pruefen' && (
          <>
            <Text style={type.h2}>Was prüfst du?</Text>
            <Text style={type.small}>Tippe an, was du prüfen möchtest. Wichtiges zu vergessen kostet Punkte.</Text>
            {lichtHinweis > 0 && (
              <Text style={styles.licht}>
                🔦 Dein Licht zeigt: {wichtigGesamt} wichtige Prüfungen
                {lichtHinweis >= 2 ? `, noch ${wichtigOffen} offen` : ''}.
              </Text>
            )}
            <View style={{ gap: spacing.sm }}>
              {fall.checks.map((c, i) => {
                const offen = gepruefte.includes(i);
                return (
                  <Tap
                    key={i}
                    onPress={() => !offen && setGepruefte([...gepruefte, i])}
                    accessibilityLabel={c.label}
                    style={[styles.row, offen && styles.rowDone]}
                  >
                    <Text style={styles.rowIcon}>{offen ? '✓' : '○'}</Text>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={type.headline}>
                        {lichtHinweis >= 3 && c.wichtig ? '★ ' : ''}
                        {c.label}
                      </Text>
                      {offen && <Text style={type.body}>{c.befund}</Text>}
                    </View>
                  </Tap>
                );
              })}
            </View>
            <Button label="Weiter: Was ist los?" disabled={gepruefte.length === 0} onPress={() => go('erkennen')} />
          </>
        )}

        {phase === 'erkennen' && (
          <>
            <Text style={type.h2}>Was ist los?</Text>
            <View style={{ gap: spacing.sm }}>
              {fall.checks
                .filter((_, i) => gepruefte.includes(i))
                .map((c) => (
                  <Text key={c.label} style={type.small}>
                    • {c.befund}
                  </Text>
                ))}
            </View>
            <View style={{ gap: spacing.sm }}>
              {optionen.map((o, i) => (
                <AnswerOption
                  key={o}
                  letter={LETTERS[i]}
                  text={o}
                  state={antwort === null ? 'idle' : o === fall.diagnose ? 'right' : o === antwort ? 'wrong' : 'dim'}
                  disabled={antwort !== null}
                  onPress={() => setAntwort(o)}
                />
              ))}
            </View>
            {antwort !== null && (
              <>
                <Text style={[type.body, { color: antwort === fall.diagnose ? colors.mintDark : colors.red }]}>
                  {antwort === fall.diagnose ? 'Richtig erkannt!' : `Nicht ganz – es ist: ${fall.diagnose}.`}
                </Text>
                <Button label="Weiter: Was tust du?" onPress={() => go('handeln')} />
              </>
            )}
          </>
        )}

        {phase === 'handeln' && (
          <>
            <Text style={type.h2}>Was tust du?</Text>
            <Text style={type.small}>Wähle alle richtigen Maßnahmen. Falsche kosten Punkte.</Text>
            <View style={{ gap: spacing.sm }}>
              {reihenfolge.map((i) => {
                const an = gewaehlt.includes(i);
                return (
                  <Tap
                    key={i}
                    onPress={() => setGewaehlt(an ? gewaehlt.filter((x) => x !== i) : [...gewaehlt, i])}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: an }}
                    accessibilityLabel={fall.massnahmen[i].text}
                    style={[styles.row, an && { borderColor: rolle.akzent, backgroundColor: rolle.akzentTint }]}
                  >
                    <View style={[styles.box, an && { backgroundColor: rolle.akzent, borderColor: rolle.akzent }]}>
                      {an && <Text style={styles.boxTick}>✓</Text>}
                    </View>
                    <Text style={[type.body, { flex: 1 }]}>{fall.massnahmen[i].text}</Text>
                  </Tap>
                );
              })}
            </View>
            <Button label="Fertig" disabled={gewaehlt.length === 0} onPress={abschliessen} />
          </>
        )}

        {phase === 'ergebnis' && ergebnis && (
          <>
            <Card style={{ alignItems: 'center', gap: spacing.sm }}>
              <Text style={styles.stars}>{'★'.repeat(ergebnis.e.sterne) + '☆'.repeat(3 - ergebnis.e.sterne)}</Text>
              <Text style={styles.points}>+{ergebnis.a.punkte}</Text>
              <Text style={type.small}>Punkte · {fall.titel}</Text>
              {ergebnis.a.promotion && <Pill label={`Neuer Rang: ${ergebnis.a.promotion}`} color={colors.yellowTint} />}
              {ergebnis.a.newBadges.map((b) => (
                <Pill key={b.id} label={`${b.icon} ${b.title}`} color={colors.lilac} />
              ))}
            </Card>
            <Card style={{ gap: 6 }}>
              <Text style={type.eyebrow}>Wertung</Text>
              {ergebnis.e.zeilen.map((z) => (
                <Zeile key={z.label} label={z.label} wert={z.punkte} />
              ))}
              {ergebnis.a.ausruestung > 0 && <Zeile label={`Ausrüstung (+${pointsPct} %)`} wert={ergebnis.a.ausruestung} />}
              {daily && <Zeile label="Notfall des Tages (+50 %)" wert={Math.round(ergebnis.e.punkte * 0.5)} />}
              {ergebnis.a.goalBonus > 0 && <Zeile label="Tagesziel erreicht" wert={ergebnis.a.goalBonus} />}
            </Card>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Maßnahmen</Text>
              {fall.massnahmen.map((m, i) => {
                const an = gewaehlt.includes(i);
                const zeichen = m.richtig ? (an ? '✓' : '○') : an ? '✗' : '–';
                const farbe = m.richtig ? (an ? colors.mintDark : colors.orange) : an ? colors.red : colors.muted;
                return (
                  <View key={i} style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <Text style={[styles.mark, { color: farbe }]}>{zeichen}</Text>
                    <Text style={[type.body, { flex: 1, color: m.richtig ? colors.ink : colors.muted }]}>
                      {m.text}
                      {m.richtig && !an ? ' (vergessen)' : ''}
                    </Text>
                  </View>
                );
              })}
            </Card>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Das solltest du mitnehmen</Text>
              <Text style={type.headline}>{fall.diagnose}</Text>
              <Text style={type.body}>{fall.erklaerung}</Text>
            </Card>
            <Button label="Nächster Notfall" onPress={onNext} />
            <Button label="Zur Startseite" variant="outline" onPress={onHome} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Zeile({ label, wert }: { label: string; wert: number }) {
  return (
    <View style={styles.zeile}>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
      <Text style={[styles.zeileWert, wert < 0 && { color: colors.red }]}>{wert >= 0 ? `+${wert}` : wert}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  licht: { fontFamily: fonts.semibold, fontSize: 13, color: '#855800' },
  szene: { alignItems: 'center', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  steps: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  step: { flex: 1, gap: 4 },
  stepBar: { height: 4, borderRadius: 2 },
  stepLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  lead: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, color: colors.ink },
  tip: { backgroundColor: colors.butter },
  tipText: { ...type.small, color: colors.inkSoft },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: spacing.md,
  },
  rowDone: { backgroundColor: colors.paper },
  rowIcon: { fontFamily: fonts.bold, fontSize: 17, width: 20, color: colors.muted, lineHeight: 21 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.grau300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxTick: { color: colors.white, fontFamily: fonts.bold, fontSize: 14, lineHeight: 16 },
  stars: { fontSize: 34, color: '#E8A400', letterSpacing: 4 },
  points: { fontFamily: fonts.extrabold, fontSize: 44, lineHeight: 50, color: colors.ink },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  zeileWert: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  mark: { fontFamily: fonts.bold, fontSize: 16, width: 18, lineHeight: 23 },
});
