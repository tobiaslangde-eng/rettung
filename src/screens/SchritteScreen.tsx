import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { Rolle, useRolle } from '../game/rolle';
import { SCHRITTE_RUNDE, ablaufPunkte, ablaeufeFuer, makeSchritteRunde } from '../game/schritte';
import { shuffle } from '../game/scoring';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Schritt für Schritt: Abläufe in die richtige Reihenfolge tippen */
export function SchritteScreen({
  rolle,
  geloest,
  onFinish,
  onBack,
}: {
  rolle: Rolle;
  geloest: string[];
  onFinish: (punkte: number, geschafft: string[]) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [runde, setRunde] = useState(0);
  const ablaeufe = useMemo(() => makeSchritteRunde(rolle, geloest), [runde]); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  const [gesetzt, setGesetzt] = useState<number[]>([]);
  const [fehler, setFehler] = useState(0);
  const [falsch, setFalsch] = useState<number | null>(null);
  const [punkte, setPunkte] = useState<number[]>([]);
  const [ende, setEnde] = useState(false);
  const a = ablaeufe[index];
  const karten = useMemo(() => shuffle(a ? a.schritte.map((_, i) => i) : []), [a]);
  const fertig = a && gesetzt.length === a.schritte.length;

  const tippe = (i: number) => {
    if (gesetzt.includes(i) || fertig) return;
    if (i === gesetzt.length) {
      setGesetzt([...gesetzt, i]);
      setFalsch(null);
      if (gesetzt.length + 1 === a.schritte.length) setPunkte([...punkte, ablaufPunkte(fehler)]);
    } else {
      setFehler(fehler + 1);
      setFalsch(i);
    }
  };

  const weiter = () => {
    if (index + 1 < ablaeufe.length) {
      setIndex(index + 1);
      setGesetzt([]);
      setFehler(0);
      setFalsch(null);
    } else {
      onFinish(
        punkte.reduce((s, p) => s + p, 0),
        ablaeufe.map((x) => x.id),
      );
      setEnde(true);
    }
  };

  const neu = () => {
    setRunde(runde + 1);
    setIndex(0);
    setGesetzt([]);
    setFehler(0);
    setFalsch(null);
    setPunkte([]);
    setEnde(false);
  };

  if (ende) {
    const summe = punkte.reduce((s, p) => s + p, 0);
    const alle = ablaeufeFuer(rolle).length;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Schritt für Schritt" title="Runde geschafft" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.big}>+{summe}</Text>
            <Text style={type.small}>Punkte für {ablaeufe.length} Abläufe</Text>
          </Card>
          <Card style={{ gap: spacing.sm }}>
            {ablaeufe.map((x, i) => (
              <View key={x.id} style={styles.line}>
                <Text style={[type.body, { flex: 1 }]}>{x.titel}</Text>
                <Text style={styles.linePts}>+{punkte[i]}</Text>
              </View>
            ))}
          </Card>
          <Text style={type.small}>
            Du kennst jetzt {new Set([...geloest, ...ablaeufe.map((x) => x.id)]).size} von {alle} Abläufen.
          </Text>
          <Button label="Neue Runde" onPress={neu} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`Ablauf ${index + 1} von ${SCHRITTE_RUNDE}`} title={a.titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        <Text style={type.body}>{a.lage}</Text>
        <Text style={type.small}>Tippe die Schritte in der richtigen Reihenfolge an.</Text>

        {gesetzt.length > 0 && (
          <Card style={{ gap: spacing.sm }}>
            {gesetzt.map((i, n) => (
              <View key={i} style={styles.line}>
                <View style={[styles.num, { backgroundColor: r.akzent }]}>
                  <Text style={styles.numText}>{n + 1}</Text>
                </View>
                <Text style={[type.body, { flex: 1 }]}>{a.schritte[i]}</Text>
              </View>
            ))}
          </Card>
        )}

        {!fertig ? (
          <View style={{ gap: spacing.sm }}>
            {karten
              .filter((i) => !gesetzt.includes(i))
              .map((i) => (
                <Tap
                  key={i}
                  onPress={() => tippe(i)}
                  accessibilityLabel={a.schritte[i]}
                  style={[styles.karte, falsch === i && styles.karteFalsch]}
                >
                  <Text style={[type.body, { flex: 1 }]}>{a.schritte[i]}</Text>
                  {falsch === i && <Text style={styles.noch}>noch nicht</Text>}
                </Tap>
              ))}
            {fehler > 0 && (
              <Text style={type.small}>
                {fehler} {fehler === 1 ? 'Fehlgriff' : 'Fehlgriffe'}
              </Text>
            )}
          </View>
        ) : (
          <>
            <Card style={[{ gap: spacing.sm }, { borderLeftColor: colors.mintDark }]}>
              <Text style={type.headline}>Richtig! +{punkte[punkte.length - 1]} Punkte</Text>
              <Text style={type.body}>{a.erklaerung}</Text>
            </Card>
            <Button label={index + 1 < ablaeufe.length ? 'Nächster Ablauf' : 'Runde abschließen'} onPress={weiter} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linePts: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  num: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  numText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  karte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 52,
  },
  karteFalsch: { borderColor: colors.red, backgroundColor: colors.redTint },
  noch: { fontFamily: fonts.medium, fontSize: 12, color: colors.red },
  big: { fontFamily: fonts.extrabold, fontSize: 44, lineHeight: 50, color: colors.ink },
});
