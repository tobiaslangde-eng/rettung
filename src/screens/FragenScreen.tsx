import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerOption } from '../components/Training';
import { Button, Card, TopBar } from '../components/UI';
import { Frage4 } from '../game/helferTraining';
import { useRolle } from '../game/rolle';
import { shuffle } from '../game/scoring';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Frage-Spiel mit vier Antworten: Was zuerst?, Handgriffe, Erste-Hilfe-Prüfung */
export function FragenScreen({
  kicker,
  titel,
  frageText,
  erzeuge,
  best,
  bestehen,
  punkte,
  onFinish,
  onBack,
}: {
  kicker: string;
  titel: string;
  /** Kleine Überschrift über den Antworten */
  frageText: string;
  erzeuge: () => Frage4[];
  best: number;
  /** Ab so vielen richtigen Antworten gilt die Runde als bestanden (optional) */
  bestehen?: number;
  punkte: (richtig: number) => number;
  onFinish: (richtig: number, punkte: number) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const fragen = useMemo(() => erzeuge(), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const ordnung = useMemo(() => fragen.map(() => shuffle([0, 1, 2, 3])), [fragen]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [richtig, setRichtig] = useState(0);
  const [ende, setEnde] = useState(false);
  const f = fragen[i];
  const gesamt = fragen.length;

  const antworte = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === 0) setRichtig(richtig + 1);
  };
  const weiter = () => {
    if (i + 1 < gesamt) {
      setI(i + 1);
      setPicked(null);
    } else {
      onFinish(richtig, punkte(richtig));
      setEnde(true);
    }
  };
  const neu = () => {
    setLauf(lauf + 1);
    setI(0);
    setPicked(null);
    setRichtig(0);
    setEnde(false);
  };

  if (ende) {
    const geschafft = bestehen === undefined || richtig >= bestehen;
    return (
      <View style={{ flex: 1 }}>
        <TopBar
          kicker={kicker}
          title={bestehen !== undefined ? (geschafft ? 'Bestanden!' : 'Knapp daneben') : 'Geschafft'}
          onBack={onBack}
        />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{richtig === gesamt ? '🏅' : geschafft ? '👍' : '💪'}</Text>
            <Text style={styles.big}>
              {richtig}/{gesamt}
            </Text>
            <Text style={type.small}>+{punkte(richtig)} EP</Text>
            {bestehen !== undefined && <Text style={type.small}>Bestanden ab {bestehen} richtigen Antworten</Text>}
            <Text style={type.small}>Bestwert: {Math.max(best, richtig)}</Text>
          </Card>
          <Button label="Nochmal" onPress={neu} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`${kicker} · ${i + 1}/${gesamt}`} title={titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.dots}>
          {fragen.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (picked !== null ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <Card>
          <Text style={styles.lead}>{f.kopf}</Text>
        </Card>
        <Text style={type.eyebrow}>{frageText}</Text>
        <View style={{ gap: spacing.sm }}>
          {ordnung[i].map((idx, n) => (
            <AnswerOption
              key={idx}
              letter={LETTERS[n]}
              text={f.optionen[idx]}
              state={picked === null ? 'idle' : idx === 0 ? 'right' : idx === picked ? 'wrong' : 'dim'}
              disabled={picked !== null}
              onPress={() => antworte(idx)}
            />
          ))}
        </View>
        {picked !== null && (
          <>
            <Card style={{ gap: 6, borderLeftColor: picked === 0 ? colors.mintDark : colors.red }}>
              <Text style={type.headline}>{picked === 0 ? 'Richtig!' : 'Nicht ganz'}</Text>
              <Text style={type.body}>{f.erklaerung}</Text>
            </Card>
            <Button label={i + 1 < gesamt ? 'Weiter' : 'Ergebnis'} onPress={weiter} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  lead: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, color: colors.ink },
  dots: { flexDirection: 'row', gap: 3 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
