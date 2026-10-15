import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerOption } from '../components/Training';
import { Button, Card, TopBar } from '../components/UI';
import { NotrufSzenario } from '../data/helferTraining';
import { NOTRUF_GESCHAFFT_AB, notrufPunkte, waehleNotruf } from '../game/helferTraining';
import { useRolle } from '../game/rolle';
import { shuffle } from '../game/scoring';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C'];

/** Notruf üben: Die Leitstelle fragt, du wählst die beste Antwort. */
export function NotrufScreen({
  geloest,
  onFinish,
  onBack,
}: {
  geloest: string[];
  onFinish: (punkte: number, id: string | null) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const sz: NotrufSzenario = useMemo(() => waehleNotruf(geloest), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const ordnung = useMemo(() => sz.schritte.map(() => shuffle([0, 1, 2])), [sz]);
  const [phase, setPhase] = useState<'lage' | 'ruf' | 'ende'>('lage');
  const [schritt, setSchritt] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  const richtig = gewaehlt.filter((g) => g === 0).length;
  const st = sz.schritte[schritt];

  const antworte = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setGewaehlt([...gewaehlt, i]);
  };

  const weiter = () => {
    if (schritt + 1 < sz.schritte.length) {
      setSchritt(schritt + 1);
      setPicked(null);
    } else {
      const ok = gewaehlt.filter((g) => g === 0).length;
      onFinish(notrufPunkte(ok, sz.schritte.length), ok >= NOTRUF_GESCHAFFT_AB ? sz.id : null);
      setPhase('ende');
    }
  };

  const neu = () => {
    setLauf(lauf + 1);
    setPhase('lage');
    setSchritt(0);
    setGewaehlt([]);
    setPicked(null);
  };

  if (phase === 'ende') {
    const punkte = notrufPunkte(richtig, sz.schritte.length);
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Notruf üben" title="Anruf beendet" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>
              {richtig === sz.schritte.length ? '🏅' : richtig >= NOTRUF_GESCHAFFT_AB ? '👍' : '📞'}
            </Text>
            <Text style={styles.big}>+{punkte}</Text>
            <Text style={type.small}>
              {richtig} von {sz.schritte.length} Antworten genau richtig
            </Text>
          </Card>
          <Card style={{ gap: spacing.md }}>
            <Text style={type.eyebrow}>Dein Gespräch</Text>
            {sz.schritte.map((s, i) => (
              <View key={i} style={{ gap: 4 }}>
                <Bubble von="leitstelle" text={s.frage} />
                <Bubble von="du" text={s.antworten[gewaehlt[i]]} gut={gewaehlt[i] === 0} akzent={r.akzent} />
                {gewaehlt[i] !== 0 && <Bubble von="tipp" text={`Besser: ${s.antworten[0]}`} />}
              </View>
            ))}
          </Card>
          <Button label="Nächster Notruf" onPress={neu} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Notruf üben" title={sz.titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        {phase === 'lage' ? (
          <>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Was du erlebst</Text>
              <Text style={styles.lead}>{sz.lage}</Text>
            </Card>
            <Card style={styles.tip}>
              <Text style={type.small}>
                Du wählst die 112. Die Leitstelle stellt dir ein paar Fragen – antworte ruhig, konkret und der Reihe nach. Wo?
                Was? Wie viele? Welche Beschwerden? Dann: warten auf Rückfragen.
              </Text>
            </Card>
            <Button label="📞  112 wählen" onPress={() => setPhase('ruf')} />
          </>
        ) : (
          <>
            <View style={styles.dots}>
              {sz.schritte.map((_, i) => (
                <View key={i} style={[styles.dot, i < schritt + (picked !== null ? 1 : 0) && { backgroundColor: r.akzent }]} />
              ))}
            </View>
            {sz.schritte.slice(0, schritt).map((s, i) => (
              <View key={i} style={{ gap: 4 }}>
                <Bubble von="leitstelle" text={s.frage} />
                <Bubble von="du" text={s.antworten[gewaehlt[i]]} gut={gewaehlt[i] === 0} akzent={r.akzent} />
              </View>
            ))}
            <Bubble von="leitstelle" text={st.frage} />
            <View style={{ gap: spacing.sm }}>
              {ordnung[schritt].map((idx, n) => (
                <AnswerOption
                  key={idx}
                  letter={LETTERS[n]}
                  text={st.antworten[idx]}
                  state={picked === null ? 'idle' : idx === 0 ? 'right' : idx === picked ? 'wrong' : 'dim'}
                  disabled={picked !== null}
                  onPress={() => antworte(idx)}
                />
              ))}
            </View>
            {picked !== null && (
              <>
                <Card style={[{ gap: 6 }, { borderLeftColor: picked === 0 ? colors.mintDark : colors.red }]}>
                  <Text style={type.headline}>{picked === 0 ? 'Genau so!' : 'Besser so:'}</Text>
                  <Text style={type.body}>{picked === 0 ? st.erklaerung : `${st.antworten[0]} – ${st.erklaerung}`}</Text>
                </Card>
                <Button label={schritt + 1 < sz.schritte.length ? 'Weiter' : 'Auflegen'} onPress={weiter} />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Bubble({ von, text, gut, akzent }: { von: 'leitstelle' | 'du' | 'tipp'; text: string; gut?: boolean; akzent?: string }) {
  if (von === 'tipp') return <Text style={[type.small, { marginLeft: spacing.xl, color: colors.mintDark }]}>{text}</Text>;
  const du = von === 'du';
  return (
    <View style={[styles.bubbleRow, du && { justifyContent: 'flex-end' }]}>
      <View
        style={[
          styles.bubble,
          du
            ? {
                backgroundColor: gut === false ? colors.redTint : akzent ? `${akzent}1F` : colors.paper,
                borderBottomRightRadius: 4,
              }
            : { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
        ]}
      >
        <Text style={styles.bubbleWho}>{du ? 'Du' : 'Leitstelle'}</Text>
        <Text style={type.body}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  lead: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, color: colors.ink },
  tip: { backgroundColor: colors.butter },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '88%', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, gap: 2 },
  bubbleWho: { fontFamily: fonts.semibold, fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
