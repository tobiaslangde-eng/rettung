import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Ornament, TopBar } from '../components/Estonian';
import { POINTS } from '../game/scoring';
import { colors, spacing, type } from '../theme';

const STEPS = [
  { et: 'Väljakutse', de: 'Alarm', text: 'Die Leitstelle schickt dich zu einem Einsatz irgendwo in Estland. Lies die Meldung genau.' },
  {
    et: 'Läbivaatus',
    de: 'Untersuchung',
    text: 'Befrage den Patienten, schau dir die Symptome an und miss Vitalwerte. Nach jeder Messung stufst du den Wert ein: niedrig, normal oder hoch.',
  },
  { et: 'Diagnoos', de: 'Diagnose', text: 'Entscheide dich für eine Verdachtsdiagnose aus vier Möglichkeiten.' },
  { et: 'Ravi', de: 'Maßnahmen', text: 'Wähle alle passenden Erstmaßnahmen. Gefährliche oder falsche Maßnahmen kosten Punkte.' },
];

export function GuideScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <TopBar et="Juhend" title="Anleitung" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.body}>
          Du bist Sanitäter/in im estnischen Rettungsdienst (kiirabi). Erkenne Krankheiten anhand von Symptomen und Messwerten
          und triff die richtigen Entscheidungen.
        </Text>
        {STEPS.map((s, i) => (
          <Card key={s.et}>
            <Eyebrow et={`${i + 1}. ${s.et}`} de={s.de} />
            <Text style={[type.body, { marginTop: spacing.xs }]}>{s.text}</Text>
          </Card>
        ))}
        <Card style={{ borderLeftColor: colors.must }}>
          <Eyebrow et="Punktid" de="Punkte" />
          <Row label="Wert richtig eingestuft" pts={POINTS.ratingCorrect} />
          <Row label="Wert falsch eingestuft" pts={POINTS.ratingWrong} />
          <Row label="Wichtigen Wert vergessen" pts={POINTS.missedKeyVital} />
          <Row label="Zeitbonus (max., −4 je unnötiger Messung)" pts={POINTS.efficiencyMax} />
          <Row label="Richtige Diagnose" pts={POINTS.diagnosisCorrect} />
          <Row label="Richtige Maßnahme" pts={POINTS.treatmentCorrect} />
          <Row label="Falsche Maßnahme" pts={POINTS.treatmentWrong} />
        </Card>
        <Card style={{ borderLeftColor: colors.kihnuRed }}>
          <Eyebrow et="Tähelepanu" de="Hinweis" />
          <Text style={[type.small, { marginTop: spacing.xs }]}>
            Dieses Spiel dient dem Lernen und Üben. Die Inhalte sind vereinfacht und ersetzen keine Ausbildung, keine
            ärztliche Beratung und keine regionalen Leitlinien/SOPs. Im Notfall immer 112 wählen.
          </Text>
        </Card>
        <Ornament count={10} />
      </ScrollView>
    </View>
  );
}

function Row({ label, pts }: { label: string; pts: number }) {
  return (
    <View style={styles.row}>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
      <Text style={{ fontWeight: '800', color: pts < 0 ? colors.kihnuRed : colors.sinine }}>
        {pts > 0 ? '+' : ''}
        {pts}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.linen },
});
