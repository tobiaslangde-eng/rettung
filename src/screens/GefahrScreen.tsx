import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KulissenBild } from '../components/Kulisse';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { GEFAHR_RUNDE, SzenenErgebnis, bewerteSzene, makeGefahrRunde, szenenFuer } from '../game/gefahren';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const GROESSE = { 1: 30, 2: 40, 3: 52 } as const;

/** Gefahren-Check: Finde alle Gefahren an der Einsatzstelle – harmlose Dinge nicht antippen */
export function GefahrScreen({
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
  const runde = useMemo(() => makeGefahrRunde(r.id, geloest), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [getippt, setGetippt] = useState<string[]>([]);
  const [letzte, setLetzte] = useState<string | null>(null);
  const [fertig, setFertig] = useState(false);
  const [ergebnisse, setErgebnisse] = useState<SzenenErgebnis[]>([]);
  const [ende, setEnde] = useState(false);

  const s = runde[i];
  const buehne = Math.min(L.width - spacing.lg * 2, 560);
  const faktor = buehne / 400;
  const gefahren = s.objekte.filter((o) => o.gefahr);
  const gefunden = gefahren.filter((o) => getippt.includes(o.id)).length;
  const alleGefunden = gefunden === gefahren.length;
  const letztesObjekt = s.objekte.find((o) => o.id === letzte);
  const szenenGesamt = Math.min(GEFAHR_RUNDE, szenenFuer(r.id).length);

  const tippe = (id: string) => {
    if (fertig || getippt.includes(id)) {
      setLetzte(id);
      return;
    }
    const neu = [...getippt, id];
    setGetippt(neu);
    setLetzte(id);
    if (s.objekte.filter((o) => o.gefahr).every((o) => neu.includes(o.id))) setFertig(true);
  };

  const weiter = () => {
    const erg = [...ergebnisse, bewerteSzene(s, getippt)];
    if (i + 1 < runde.length) {
      setErgebnisse(erg);
      setI(i + 1);
      setGetippt([]);
      setLetzte(null);
      setFertig(false);
    } else {
      setErgebnisse(erg);
      const punkte = erg.reduce((n, e) => n + e.punkte, 0);
      onFinish(
        punkte,
        runde.filter((_, k) => erg[k].geloest).map((x) => x.id),
      );
      setEnde(true);
    }
  };

  const neu = () => {
    setLauf(lauf + 1);
    setI(0);
    setGetippt([]);
    setLetzte(null);
    setFertig(false);
    setErgebnisse([]);
    setEnde(false);
  };

  if (ende) {
    const punkte = ergebnisse.reduce((n, e) => n + e.punkte, 0);
    const gef = ergebnisse.reduce((n, e) => n + e.gefunden, 0);
    const ges = ergebnisse.reduce((n, e) => n + e.gefahren, 0);
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Gefahren-Check" title="Geschafft" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{gef === ges ? '🏅' : gef >= ges * 0.7 ? '👍' : '💪'}</Text>
            <Text style={styles.big}>
              {gef}/{ges}
            </Text>
            <Text style={type.small}>Gefahren gefunden</Text>
            <Text style={[type.headline, { color: r.akzentDunkel }]}>+{punkte} Punkte</Text>
          </Card>
          {runde.map((x, k) => (
            <Card key={x.id} style={{ gap: 4 }}>
              <Text style={type.headline}>{x.titel}</Text>
              <Text style={type.small}>
                {ergebnisse[k].gefunden}/{ergebnisse[k].gefahren} Gefahren · {ergebnisse[k].falsch} Fehlgriff
                {ergebnisse[k].falsch === 1 ? '' : 'e'} · +{ergebnisse[k].punkte} Punkte
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
      <TopBar kicker={`Gefahren-Check · ${i + 1}/${szenenGesamt}`} title={s.titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.dots}>
          {runde.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (fertig ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <Text style={type.body}>{s.lage}</Text>
        <View style={[styles.buehne, { width: buehne, height: (buehne * 3) / 4 }]}>
          <KulissenBild kulisse={s.kulisse} width={buehne} />
          {s.objekte.map((o) => {
            const px = GROESSE[o.gross ?? 2] * faktor * 1.15;
            const getippter = getippt.includes(o.id);
            const verpasst = fertig && !alleGefunden && o.gefahr && !getippter;
            const ring = getippter ? (o.gefahr ? colors.mintDark : colors.red) : verpasst ? colors.orange : 'transparent';
            return (
              <Tap
                key={o.id}
                offset={0}
                onPress={() => tippe(o.id)}
                accessibilityLabel={o.name}
                style={[
                  styles.objekt,
                  {
                    width: px + 14,
                    height: px + 14,
                    left: (o.x / 100) * buehne - (px + 14) / 2,
                    top: (o.y / 100) * ((buehne * 3) / 4) - (px + 14) / 2,
                    borderColor: ring,
                    backgroundColor: getippter
                      ? o.gefahr
                        ? 'rgba(221,245,234,0.85)'
                        : 'rgba(255,225,224,0.85)'
                      : verpasst
                        ? 'rgba(255,230,199,0.9)'
                        : 'rgba(255,255,255,0.0)',
                    opacity: getippter && !o.gefahr ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={{ fontSize: px, lineHeight: px * 1.15, fontFamily: fonts.regular }}>{o.emoji}</Text>
                {getippter && <Text style={styles.marke}>{o.gefahr ? '✓' : '✕'}</Text>}
                {verpasst && <Text style={[styles.marke, { color: colors.orange }]}>!</Text>}
              </Tap>
            );
          })}
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>
            ⚠️ Gefunden: {gefunden}/{gefahren.length}
          </Text>
          <Text style={styles.statusSub}>Tippe nur auf echte Gefahren</Text>
        </View>
        {letztesObjekt && (
          <Card style={{ gap: 4, borderLeftColor: letztesObjekt.gefahr ? colors.mintDark : colors.red }}>
            <Text style={type.headline}>
              {letztesObjekt.emoji} {letztesObjekt.name}
            </Text>
            <Text style={[type.small, { color: letztesObjekt.gefahr ? colors.mintDark : colors.red, fontFamily: fonts.bold }]}>
              {letztesObjekt.gefahr ? 'Richtig – das ist eine Gefahr' : 'Keine Gefahr'}
            </Text>
            <Text style={type.body}>{letztesObjekt.text}</Text>
          </Card>
        )}
        {!fertig && <Button label="Ich habe alles gefunden" variant="outline" onPress={() => setFertig(true)} />}
        {fertig && (
          <>
            {!alleGefunden && (
              <Card style={{ gap: 6, borderLeftColor: colors.orange }}>
                <Text style={type.headline}>Das hast du übersehen</Text>
                {gefahren
                  .filter((o) => !getippt.includes(o.id))
                  .map((o) => (
                    <Text key={o.id} style={type.body}>
                      {o.emoji} <Text style={{ fontFamily: fonts.bold }}>{o.name}:</Text> {o.text}
                    </Text>
                  ))}
              </Card>
            )}
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
  dots: { flexDirection: 'row', gap: 4, alignSelf: 'stretch' },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  buehne: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, alignSelf: 'center' },
  objekt: { position: 'absolute', borderRadius: 999, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  marke: { position: 'absolute', right: -2, top: -4, fontFamily: fonts.extrabold, fontSize: 14, color: colors.ink },
  status: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  statusSub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
