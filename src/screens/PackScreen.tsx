import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { PACK_BONUS, bewertePackliste, waehlePackliste } from '../game/helferTraining';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Gut gepackt: Tippe alles an, was in die Packliste gehört */
export function PackScreen({
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
  const liste = useMemo(() => waehlePackliste(geloest), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const [sel, setSel] = useState<number[]>([]);
  const [fertig, setFertig] = useState(false);
  const erg = bewertePackliste(liste, sel);
  const soll = liste.items.filter((x) => x.gehoert).length;

  const toggle = (i: number) => setSel(sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]);
  const pruefen = () => {
    setFertig(true);
    onFinish(erg.punkte, erg.geschafft ? liste.id : null);
  };
  const neu = () => {
    setLauf(lauf + 1);
    setSel([]);
    setFertig(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Gut gepackt" title={liste.titel} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Card>
          <Text style={styles.lead}>{liste.lage}</Text>
          {!fertig && (
            <Text style={[type.small, { marginTop: 6 }]}>
              Tippe an, was hinein gehört. Es sind {soll} Dinge. Gewählt: {sel.length}
            </Text>
          )}
        </Card>
        <View style={styles.grid}>
          {liste.items.map((it, i) => {
            const an = sel.includes(i);
            const status = !fertig ? null : it.gehoert ? (an ? 'ok' : 'fehlt') : an ? 'falsch' : 'ok';
            return (
              <Tap
                key={it.name}
                disabled={fertig}
                onPress={() => toggle(i)}
                accessibilityLabel={it.name}
                style={[
                  styles.item,
                  an && !fertig && { borderColor: r.akzent, backgroundColor: `${r.akzent}18` },
                  status === 'ok' && an && { borderColor: colors.mintDark, backgroundColor: colors.mintTint },
                  status === 'falsch' && { borderColor: colors.red, backgroundColor: colors.redTint },
                  status === 'fehlt' && { borderColor: colors.orange, borderStyle: 'dashed' },
                ]}
              >
                <Text style={styles.emoji}>{it.emoji}</Text>
                <Text style={styles.name}>{it.name}</Text>
                {fertig && status !== 'ok' && (
                  <Text style={styles.flag}>{status === 'falsch' ? 'gehört nicht hinein' : 'hat gefehlt'}</Text>
                )}
              </Tap>
            );
          })}
        </View>
        {!fertig ? (
          <Button label="Prüfen" onPress={pruefen} disabled={sel.length === 0} />
        ) : (
          <>
            <Card style={{ alignItems: 'center', gap: 4 }}>
              <Text style={styles.big}>+{erg.punkte}</Text>
              <Text style={type.small}>
                {erg.richtig} richtig · {erg.falsch} zu viel · {erg.vergessen} vergessen
                {erg.falsch + erg.vergessen === 0 ? ` · Bonus +${PACK_BONUS}` : ''}
              </Text>
            </Card>
            <Card style={{ gap: 8 }}>
              <Text style={type.eyebrow}>Warum?</Text>
              {liste.items.map((it) => (
                <Text key={it.name} style={type.small}>
                  {it.emoji} <Text style={{ fontFamily: fonts.semibold }}>{it.name}</Text> – {it.hinweis}
                </Text>
              ))}
              <Text style={[type.body, { marginTop: 6 }]}>{liste.erklaerung}</Text>
            </Card>
            <Button label="Nächste Liste" onPress={neu} />
            <Button label="Zurück" variant="outline" onPress={onBack} />
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  item: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  emoji: { fontSize: 30, lineHeight: 36, fontFamily: fonts.regular },
  name: { fontFamily: fonts.semibold, fontSize: 14, textAlign: 'center', color: colors.ink },
  flag: { fontFamily: fonts.semibold, fontSize: 11, color: colors.red },
  big: { fontFamily: fonts.displayBlack, fontSize: 40, lineHeight: 46, color: colors.ink },
});
