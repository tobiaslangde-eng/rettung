import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { PREISE, PlusPlan, TEST_TAGE, beendePlus, istPlus, kaufePlus, starteTest, testRestTage, useKontoStore } from '../game/konto';
import { useLayout } from '../layout';
import { colors, fonts, radius, spacing, type } from '../theme';

const VORTEILE: { text: string; echt: boolean }[] = [
  { text: 'Alle 23 Simulator-Szenarien', echt: true },
  { text: 'Alle 196 Einsätze und 13 EKG-Rhythmen', echt: false },
  { text: 'Volle Lernstand-Auswertung', echt: false },
  { text: 'Spielstand auf allen Geräten (mit echtem Konto)', echt: false },
];

export function PlusScreen({ onBack, onKonto }: { onBack: () => void; onKonto: () => void }) {
  const L = useLayout();
  const s = useKontoStore();
  const [plan, setPlan] = useState<PlusPlan>('jahr');
  const [meldung, setMeldung] = useState('');
  const aktiv = istPlus(s);
  const rest = testRestTage(s);

  const optionen: { id: PlusPlan; titel: string; sub: string; preis: string }[] = [
    { id: 'jahr', titel: 'Jahr', sub: 'Etwa 2,50 € pro Monat', preis: PREISE.jahr },
    { id: 'monat', titel: 'Monat', sub: 'Jederzeit kündbar', preis: PREISE.monat },
  ];

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Store-Demo" title="Plus" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.breit]}>
        <Card style={styles.demo}>
          <Text style={styles.demoTitel}>🧪 Nur zum Ausprobieren</Text>
          <Text style={type.small}>Es wird nichts bezahlt und nichts abgebucht. Die Preise sind Vorschläge. Gesperrt ist in der Demo nur der Patienten-Simulator; die anderen Punkte zeigen, wie Plus später aussehen könnte.</Text>
        </Card>

        <View style={styles.hero}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>PLUS</Text>
          </View>
          <Text style={styles.heroTitel}>Der ganze Dienst. Ohne Grenzen.</Text>
          <Text style={styles.heroText}>Erste Hilfe bleibt immer kostenlos. Plus ist für alle, die tiefer üben wollen.</Text>
        </View>

        <Card style={{ gap: spacing.sm }}>
          {VORTEILE.map((v) => (
            <View key={v.text} style={styles.vorteil}>
              <Text style={styles.haken}>✓</Text>
              <Text style={[type.body, { flex: 1 }]}>
                {v.text}
                {!v.echt ? <Text style={type.small}>  (zeigt nur die Idee)</Text> : null}
              </Text>
            </View>
          ))}
        </Card>

        {aktiv ? (
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>Dein Plus</Text>
            <Text style={type.h2}>✅ Plus ist aktiv</Text>
            <Text style={type.body}>
              {rest !== null
                ? `Testphase: noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'}. Danach würde das Abo ${s.plus?.plan === 'monat' ? PREISE.monat + ' pro Monat' : PREISE.jahr + ' pro Jahr'} kosten (Demo: passiert nichts).`
                : 'Alle Simulator-Szenarien sind frei (Demo, es wird nichts abgebucht).'}
            </Text>
            <Button label="Zum Konto" variant="outline" onPress={onKonto} />
            <Button label="Plus beenden (Demo)" variant="outline" onPress={beendePlus} />
          </Card>
        ) : (
          <>
            <View style={{ gap: spacing.sm }}>
              {optionen.map((o) => {
                const an = plan === o.id;
                return (
                  <Tap key={o.id} onPress={() => setPlan(o.id)} accessibilityLabel={`${o.titel} ${o.preis}`} accessibilityState={{ selected: an }} offset={0} style={[styles.option, an && styles.optionAn]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optTitel}>{o.titel}</Text>
                      <Text style={type.small}>{o.sub}</Text>
                    </View>
                    <Text style={styles.optPreis}>{o.preis}</Text>
                  </Tap>
                );
              })}
            </View>
            <Button label={`${TEST_TAGE} Tage kostenlos testen`} variant="alarm" onPress={() => starteTest(plan)} />
            <Button label={`Plus ${plan === 'jahr' ? 'für ' + PREISE.jahr + ' pro Jahr' : 'für ' + PREISE.monat + ' pro Monat'} kaufen (Demo)`} variant="outline" onPress={() => kaufePlus(plan)} />
          </>
        )}

        <Tap
          onPress={() => setMeldung(s.plus ? 'Käufe wiederhergestellt: Plus ist wieder da.' : 'Keine früheren Käufe gefunden.')}
          accessibilityLabel="Käufe wiederherstellen"
          style={styles.link}
        >
          <Text style={styles.linkText}>Käufe wiederherstellen</Text>
        </Tap>
        {meldung !== '' && <Text style={[type.small, { textAlign: 'center' }]}>{meldung}</Text>}

        <Text style={type.small}>
          So würde es im Store stehen: Das Abo verlängert sich automatisch, wenn du es nicht mindestens 24 Stunden vor Ablauf in den Einstellungen deines Stores kündigst. Preise inklusive Umsatzsteuer.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 120 },
  breit: { maxWidth: 720, width: '100%', alignSelf: 'center' },
  demo: { gap: 6, backgroundColor: colors.yellowTint, borderColor: colors.yellow },
  demoTitel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  hero: { gap: 8, paddingVertical: spacing.sm },
  pill: { alignSelf: 'flex-start', backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { color: colors.white, fontFamily: fonts.bold, fontSize: 12, letterSpacing: 0.8 },
  heroTitel: { ...type.title },
  heroText: { ...type.body, color: colors.inkSoft },
  vorteil: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  haken: { color: colors.mintDark, fontFamily: fonts.bold, fontSize: 18, lineHeight: 23 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, paddingHorizontal: 18, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface },
  optionAn: { borderColor: colors.red, backgroundColor: colors.redTint },
  optTitel: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  optPreis: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.ink },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: colors.blueDark, fontFamily: fonts.semibold, fontSize: 14 },
});
