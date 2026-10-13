import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, WarnStripes, TopBar } from '../components/UI';
import { BADGE_BONUS } from '../game/achievements';
import { CPR_POINTS } from '../game/cpr';
import { DAILY_GOAL, dailyGoalBonus } from '../game/daily';
import { QUIZ_POINTS } from '../game/quiz';
import { DIFFICULTIES } from '../game/difficulty';
import { POINTS } from '../game/scoring';
import { colors, spacing, type, fonts } from '../theme';

const STEPS = [
  { de: 'Alarm', text: 'Mein Melder piept: Die Leitstelle schickt mich zum nächsten Notfall. Mit Blaulicht geht es los.' },
  {
    de: 'Untersuchung',
    text: 'Ich höre zu, schaue genau hin und messe Vitalwerte. Jeden Wert stufe ich ein: niedrig, normal oder hoch. Jede Messung kostet Zeit – und den Patienten etwas Kraft.',
  },
  { de: 'Diagnose', text: 'Ich entscheide mich für eine Verdachtsdiagnose aus vier Möglichkeiten.' },
  { de: 'Maßnahmen', text: 'Ich wähle alle passenden Maßnahmen. Falsche Maßnahmen schaden dem Patienten und kosten Punkte.' },
];

export function GuideScreen({ onBack, onReset }: { onBack: () => void; onReset: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
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
        <Card style={{ borderLeftColor: colors.warngelb }}>
          <Eyebrow title="Tagesdienst" />
          <Text style={[type.body, { marginTop: spacing.xs }]}>
            Jeden Tag gibt es einen „Einsatz des Tages“ mit 50 % mehr Punkten. Wer {DAILY_GOAL} Einsätze an einem Tag schafft,
            erreicht das Tagesziel. Schaffe ich das mehrere Tage hintereinander, wächst meine Dienst-Serie – und der Bonus mit.
          </Text>
        </Card>
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
          <Row label="Perfekter Einsatz (3 Sterne)" pts={POINTS.perfectBonus} />
          <Row label={`Serienbonus je gutem Einsatz in Folge (max. ${POINTS.streakMax})`} pts={POINTS.streakPerLevel} />
          <Row label="Neues Abzeichen" pts={BADGE_BONUS} />
          <Row label="Einsatz des Tages" pts={0} text="+50 %" />
          <Row label={`Tagesziel (${DAILY_GOAL} Einsätze), steigt mit der Dienst-Serie`} pts={dailyGoalBonus(1)} text={`+${dailyGoalBonus(1)}–${dailyGoalBonus(6)}`} />
          <Row label="Normwerte & Wissensfragen: je richtiger Antwort" pts={QUIZ_POINTS} />
          <Row label="Herzdruckmassage (ohne Taktgeber doppelt)" pts={CPR_POINTS} text={`bis +${CPR_POINTS * 2}`} />
          <Text style={[type.small, { marginTop: spacing.sm }]}>
            Auf „Mittel“ zählen alle Punkte eines Einsatzes ×1,5, auf „Schwer“ ×2.
          </Text>
        </Card>
        <Card style={{ borderLeftColor: colors.signalrot }}>
          <Eyebrow title="Hinweis" />
          <Text style={[type.small, { marginTop: spacing.xs }]}>
            Dieses Spiel dient dem Lernen und Üben. Die Inhalte sind vereinfacht und ersetzen keine Ausbildung, keine
            ärztliche Beratung und keine regionalen Leitlinien/SOPs. Im Notfall immer 112 wählen.
          </Text>
        </Card>
        <Card style={{ borderLeftColor: colors.grau500 }}>
          <Eyebrow title="Neu anfangen" />
          <Text style={[type.small, { marginTop: spacing.xs }]}>
            Setzt Punkte, Rang, Sterne und Abzeichen auf null. Das lässt sich nicht rückgängig machen.
          </Text>
          {confirmReset ? (
            <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
              <Text style={[type.body, { fontFamily: fonts.bold }]}>Wirklich alles zurücksetzen?</Text>
              <Button label="Ja, alles löschen" variant="alarm" onPress={onReset} />
              <Button label="Abbrechen" variant="outline" onPress={() => setConfirmReset(false)} />
            </View>
          ) : (
            <Button label="Fortschritt zurücksetzen" variant="outline" onPress={() => setConfirmReset(true)} style={{ marginTop: spacing.md }} />
          )}
        </Card>
        <WarnStripes />
      </ScrollView>
    </View>
  );
}

function Row({ label, pts, text }: { label: string; pts: number; text?: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.body, { flex: 1 }]}>{label}</Text>
      <Text style={{ fontFamily: fonts.extrabold, color: pts < 0 ? colors.signalrot : colors.blaulicht }}>
        {text ?? `${pts > 0 ? '+' : ''}${pts}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.grau50 },
});
