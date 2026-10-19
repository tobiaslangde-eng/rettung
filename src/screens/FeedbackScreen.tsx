import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { zaehle } from '../analytics';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const NOTEN = [
  { n: 1, icon: '😕', text: 'Gefällt mir nicht' },
  { n: 2, icon: '🙁', text: 'Geht so' },
  { n: 3, icon: '🙂', text: 'Okay' },
  { n: 4, icon: '😀', text: 'Gut' },
  { n: 5, icon: '🤩', text: 'Super' },
];
const THEMEN = [
  { id: 'zu-schwer', text: 'Zu schwer' },
  { id: 'zu-leicht', text: 'Zu leicht' },
  { id: 'mehr-inhalte', text: 'Mehr Inhalte' },
  { id: 'design', text: 'Gefällt mir optisch' },
  { id: 'lernen', text: 'Ich lerne etwas' },
  { id: 'fehler', text: 'Ich habe einen Fehler gefunden' },
];
const ISSUES = 'https://github.com/tobiaslangde-eng/rettung/issues/new';

/** Rückmeldung: Note und Stichworte werden anonym gezählt; wer mehr schreiben will, kann ein Issue auf GitHub öffnen */
export function FeedbackScreen({ onFertig, onBack }: { onFertig: () => void; onBack: () => void }) {
  const L = useLayout();
  const r = useRolle();
  const [note, setNote] = useState<number | null>(null);
  const [themen, setThemen] = useState<string[]>([]);
  const [gesendet, setGesendet] = useState(false);

  const senden = () => {
    if (note === null) return;
    zaehle(`feedback-note-${note}`);
    themen.forEach((t) => zaehle(`feedback-thema-${t}`));
    onFertig();
    setGesendet(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Rückmeldung" title="Wie gefällt dir das Spiel?" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        {gesendet ? (
          <>
            <Card style={{ alignItems: 'center', gap: spacing.sm }}>
              <Text style={styles.emoji}>🙏</Text>
              <Text style={type.headline}>Danke für deine Rückmeldung!</Text>
              <Text style={[type.small, { textAlign: 'center' }]}>
                Sie wird anonym gezählt und hilft, das Spiel besser zu machen.
              </Text>
            </Card>
            <Button
              label="Mehr schreiben (GitHub)"
              variant="outline"
              onPress={() => Linking.openURL(`${ISSUES}?title=${encodeURIComponent('Rückmeldung zu Einsatz 112')}`)}
            />
            <Button label="Zurück" onPress={onBack} />
          </>
        ) : (
          <>
            <Text style={type.body}>Zwei Fragen, ganz ohne Namen. Deine Antwort wird anonym gezählt.</Text>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Deine Note</Text>
              <View style={styles.noten}>
                {NOTEN.map((x) => (
                  <Tap
                    key={x.n}
                    offset={0}
                    onPress={() => setNote(x.n)}
                    accessibilityLabel={x.text}
                    style={[styles.note, note === x.n && { backgroundColor: r.akzentTint, borderColor: r.akzent }]}
                  >
                    <Text style={styles.noteIcon}>{x.icon}</Text>
                    <Text style={styles.noteText}>{x.text}</Text>
                  </Tap>
                ))}
              </View>
            </Card>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Was trifft zu? (mehrere möglich)</Text>
              <View style={styles.chips}>
                {THEMEN.map((t) => {
                  const an = themen.includes(t.id);
                  return (
                    <Tap
                      key={t.id}
                      offset={0}
                      onPress={() => setThemen(an ? themen.filter((x) => x !== t.id) : [...themen, t.id])}
                      accessibilityLabel={t.text}
                      style={[styles.chip, an && { backgroundColor: r.akzentTint, borderColor: r.akzent }]}
                    >
                      <Text style={styles.chipText}>
                        {an ? '✓ ' : ''}
                        {t.text}
                      </Text>
                    </Tap>
                  );
                })}
              </View>
            </Card>
            <Button label="Absenden" onPress={senden} disabled={note === null} />
            <Button label="Später" variant="outline" onPress={onBack} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  noten: { flexDirection: 'row', gap: 6 },
  note: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  noteIcon: { fontSize: 26, fontFamily: fonts.regular },
  noteText: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.inkSoft, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
