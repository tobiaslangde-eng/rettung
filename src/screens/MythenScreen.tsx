import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { MYTHEN_RUNDEN, makeMythen, mythenPunkte } from '../game/helferTraining';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Mythos oder Wahrheit? Stimmt die Aussage oder ist sie ein Irrtum? */
export function MythenScreen({
  best,
  onFinish,
  onBack,
}: {
  best: number;
  onFinish: (richtig: number, punkte: number) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const runde = useMemo(() => makeMythen(), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [antwort, setAntwort] = useState<boolean | null>(null);
  const [richtig, setRichtig] = useState(0);
  const [ende, setEnde] = useState(false);
  const m = runde[i];

  const tippe = (a: boolean) => {
    if (antwort !== null) return;
    setAntwort(a);
    if (a === m.stimmt) setRichtig(richtig + 1);
  };
  const weiter = () => {
    if (i + 1 < runde.length) {
      setI(i + 1);
      setAntwort(null);
    } else {
      onFinish(richtig, mythenPunkte(richtig));
      setEnde(true);
    }
  };
  const neu = () => {
    setLauf(lauf + 1);
    setI(0);
    setAntwort(null);
    setRichtig(0);
    setEnde(false);
  };

  if (ende) {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Mythos oder Wahrheit?" title="Geschafft" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{richtig === MYTHEN_RUNDEN ? '🏅' : richtig >= 7 ? '👍' : '💪'}</Text>
            <Text style={styles.big}>
              {richtig}/{MYTHEN_RUNDEN}
            </Text>
            <Text style={type.small}>+{mythenPunkte(richtig)} EP</Text>
            <Text style={type.small}>Bestwert: {Math.max(best, richtig)}</Text>
          </Card>
          <Button label="Nochmal" onPress={neu} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  const knopf = (a: boolean, label: string, icon: string) => {
    const gewaehlt = antwort === a;
    const korrekt = antwort !== null && a === m.stimmt;
    return (
      <Tap
        key={label}
        disabled={antwort !== null}
        onPress={() => tippe(a)}
        accessibilityLabel={label}
        style={[
          styles.knopf,
          antwort !== null && korrekt && { backgroundColor: colors.mint, borderColor: colors.mintDark },
          antwort !== null && gewaehlt && !korrekt && { backgroundColor: colors.red, borderColor: colors.red },
          antwort !== null && !gewaehlt && !korrekt && { opacity: 0.4 },
        ]}
      >
        <Text style={styles.knopfIcon}>{icon}</Text>
        <Text style={styles.knopfText}>{label}</Text>
      </Tap>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`Mythos oder Wahrheit? · ${i + 1}/${runde.length}`} title="Stimmt das?" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.dots}>
          {runde.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (antwort !== null ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <Card style={{ paddingVertical: spacing.xl }}>
          <Text style={styles.aussage}>„{m.aussage}“</Text>
        </Card>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {knopf(true, 'Stimmt', '✅')}
          {knopf(false, 'Mythos', '❌')}
        </View>
        {antwort !== null && (
          <>
            <Card style={{ gap: 6, borderLeftColor: antwort === m.stimmt ? colors.mintDark : colors.red }}>
              <Text style={type.headline}>
                {antwort === m.stimmt ? 'Richtig' : 'Nicht ganz'} – {m.stimmt ? 'das stimmt.' : 'das ist ein Mythos.'}
              </Text>
              <Text style={type.body}>{m.erklaerung}</Text>
            </Card>
            <Button label={i + 1 < runde.length ? 'Weiter' : 'Ergebnis'} onPress={weiter} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  aussage: { fontFamily: fonts.display, fontSize: 21, lineHeight: 29, color: colors.ink, textAlign: 'center' },
  knopf: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  knopfIcon: { fontSize: 28, lineHeight: 34, fontFamily: fonts.regular },
  knopfText: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
