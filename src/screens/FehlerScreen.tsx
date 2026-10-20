import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { FEHLER_RUNDE, FehlerErgebnis, bewerteFehler, fehlerSzenarienFuer, makeFehlerRunde } from '../game/fehler';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Fehler finden: Was macht der Helfer falsch? Tippe die falschen Schritte an. */
export function FehlerScreen({
  geloest,
  onFinish,
  onBack,
}: {
  geloest: string[];
  onFinish: (punkte: number, szenen: string[]) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const runde = useMemo(() => makeFehlerRunde(r.id, geloest), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [markiert, setMarkiert] = useState<number[]>([]);
  const [geprueft, setGeprueft] = useState(false);
  const [ergebnisse, setErgebnisse] = useState<FehlerErgebnis[]>([]);
  const [ende, setEnde] = useState(false);
  const s = runde[i];
  const gesamt = Math.min(FEHLER_RUNDE, fehlerSzenarienFuer(r.id).length);
  const aktuell = bewerteFehler(s, markiert);

  const weiter = () => {
    const erg = [...ergebnisse, aktuell];
    setErgebnisse(erg);
    if (i + 1 < runde.length) {
      setI(i + 1);
      setMarkiert([]);
      setGeprueft(false);
    } else {
      onFinish(
        erg.reduce((n, e) => n + e.punkte, 0),
        runde.filter((_, k) => erg[k].geloest).map((x) => x.id),
      );
      setEnde(true);
    }
  };
  const neu = () => {
    setLauf(lauf + 1);
    setI(0);
    setMarkiert([]);
    setGeprueft(false);
    setErgebnisse([]);
    setEnde(false);
  };

  if (ende) {
    const punkte = ergebnisse.reduce((n, e) => n + e.punkte, 0);
    const gef = ergebnisse.reduce((n, e) => n + e.gefunden, 0);
    const ges = ergebnisse.reduce((n, e) => n + e.fehlerGesamt, 0);
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Fehler finden" title="Geschafft" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{gef === ges ? '🏅' : gef >= ges * 0.7 ? '👍' : '💪'}</Text>
            <Text style={styles.big}>
              {gef}/{ges}
            </Text>
            <Text style={type.small}>Fehler gefunden</Text>
            <Text style={[type.headline, { color: r.akzentDunkel }]}>+{punkte} EP</Text>
          </Card>
          {runde.map((x, k) => (
            <Card key={x.id} style={{ gap: 4 }}>
              <Text style={type.headline}>{x.titel}</Text>
              <Text style={type.small}>
                {ergebnisse[k].gefunden}/{ergebnisse[k].fehlerGesamt} Fehler · {ergebnisse[k].falsch} zu Unrecht markiert
              </Text>
              <Text style={[type.small, { color: colors.ink }]}>💡 {x.merksatz}</Text>
            </Card>
          ))}
          <Button label="Nochmal" onPress={neu} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`Fehler finden · ${i + 1}/${gesamt}`} title={s.titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.dots}>
          {runde.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (geprueft ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <Text style={type.body}>{s.lage}</Text>
        <Text style={type.small}>
          Was macht falsch oder gefährlich? Tippe diese Schritte an ({aktuell.fehlerGesamt} Fehler sind versteckt).
        </Text>
        {s.schritte.map((st, k) => {
          const an = markiert.includes(k);
          const richtig = st.fehler;
          return (
            <Tap
              key={k}
              offset={0}
              disabled={geprueft}
              onPress={() => setMarkiert(an ? markiert.filter((x) => x !== k) : [...markiert, k])}
              accessibilityLabel={st.text}
              style={[
                styles.schritt,
                an && !geprueft && { borderColor: r.akzent, backgroundColor: r.akzentTint },
                geprueft && an && richtig && { borderColor: colors.mintDark, backgroundColor: colors.mintTint },
                geprueft && an && !richtig && { borderColor: colors.red, backgroundColor: colors.redTint },
                geprueft && !an && richtig && { borderColor: colors.orange, backgroundColor: colors.peach },
              ]}
            >
              <Text style={styles.nr}>{k + 1}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.stText}>{st.text}</Text>
                {geprueft && (
                  <Text style={[type.small, { color: colors.inkSoft }]}>
                    {st.fehler ? (an ? '✓ Fehler erkannt. ' : '! Das war ein Fehler. ') : an ? '✗ Das war richtig. ' : ''}
                    {st.erklaerung}
                  </Text>
                )}
              </View>
              {!geprueft && an && <Text style={styles.flag}>🚩</Text>}
            </Tap>
          );
        })}
        {!geprueft ? (
          <Button label="Prüfen" onPress={() => setGeprueft(true)} disabled={markiert.length === 0} />
        ) : (
          <>
            <Card style={{ gap: 4 }}>
              <Text style={[type.small, { fontFamily: fonts.bold }]}>💡 MERKE</Text>
              <Text style={type.body}>{s.merksatz}</Text>
            </Card>
            <Button label={i + 1 < runde.length ? 'Nächste Szene' : 'Ergebnis'} onPress={weiter} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  schritt: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  nr: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.muted, width: 22 },
  stText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.ink },
  flag: { fontSize: 20, fontFamily: fonts.regular },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
