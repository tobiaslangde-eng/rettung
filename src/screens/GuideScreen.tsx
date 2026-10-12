import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, WarnStripes, TopBar } from '../components/UI';
import { DIFFICULTIES } from '../game/difficulty';
import { POINTS } from '../game/scoring';
import { colors, spacing, type, fonts } from '../theme';

const STEPS = [
  { de: 'Alarm', text: 'Mein Melder piept: Die Leitstelle schickt mich irgendwo in Estland hin. Mit Blaulicht geht es los.' },
  {
    de: 'Untersuchung',
    text: 'Ich höre zu, schaue genau hin und messe Vitalwerte. Jeden Wert stufe ich ein: niedrig, normal oder hoch. Jede Messung kostet Zeit – und den Patienten etwas Kraft.',
  },
  { de: 'Diagnose', text: 'Ich entscheide mich für eine Verdachtsdiagnose aus vier Möglichkeiten.' },
  { de: 'Maßnahmen', text: 'Ich wähle alle passenden Maßnahmen. Falsche Maßnahmen schaden dem Patienten und kosten Punkte.' },
];

export function GuideScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Hilfe" title="Anleitung" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.body}>
          Ich bin Sanitäter/in im Rettungsdienst. Zusammen mit meiner Kollegin Kati erkenne ich
          Krankheiten an Symptomen und Messwerten und treffe die richtigen Entscheidungen. Der Zustandsbalken zeigt, wie es
          meinem Patienten gerade geht.
        </Text>
        {STEPS.map((s, i) => (
          <Card key={s.de}>
            <Eyebrow title={`${i + 1}. ${s.de}`} />
            <Text style={[type.body, { marginTop: spacing.xs }]}>{s.text}</Text>
          </Card>
        ))}
        <Card style={{ borderLeftColor: colors.blaulicht }}>
          <Eyebrow title="Schwierigkeit" />
          {DIFFICULTIES.map((d) => (
            <View key={d.id} style={{ marginTop: spacing.sm }}>
              <Text style={[type.body, { fontFamily: fonts.extrabold }]}>
                {d.icon} {d.label}
              </Text>
              <Text style={type.small}>{d.description}</Text>
            </View>
          ))}
        </Card>
        <Card style={{ borderLeftColor: colors.graphit }}>
          <Eyebrow title="Punkte" />
          <Row label="Wert richtig eingestuft" pts={POINTS.ratingCorrect} />
          <Row label="Wert falsch eingestuft" pts={POINTS.ratingWrong} />
          <Row label="Wichtigen Wert vergessen" pts={POINTS.missedKeyVital} />
          <Row label="Zeitbonus (max., −4 je unnötiger Messung)" pts={POINTS.efficiencyMax} />
          <Row label="Richtige Diagnose" pts={POINTS.diagnosisCorrect} />
          <Row label="Richtige Maßnahme" pts={POINTS.treatmentCorrect} />
          <Row label="Falsche Maßnahme" pts={POINTS.treatmentWrong} />
          <Row label="Zustand des Patienten am Ende (max.)" pts={POINTS.conditionMax} />
          <Row label="Tipp von Kati (nur auf Mittel)" pts={-10} />
        </Card>
        <Card style={{ borderLeftColor: colors.signalrot }}>
          <Eyebrow title="Hinweis" />
          <Text style={[type.small, { marginTop: spacing.xs }]}>
            Dieses Spiel dient dem Lernen und Üben. Die Inhalte sind vereinfacht und ersetzen keine Ausbildung, keine
            ärztliche Beratung und keine regionalen Leitlinien/SOPs. Im Notfall immer 112 wählen.
          </Text>
        </Card>
        <WarnStripes />
      </ScrollView>
    </View>
  );
}

function Row({ label, pts }: { label: string; pts: number }) {
  return (
    <View style={styles.row}>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
      <Text style={{ fontFamily: fonts.extrabold, color: pts < 0 ? colors.signalrot : colors.blaulicht }}>
        {pts > 0 ? '+' : ''}
        {pts}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.grau50 },
});
