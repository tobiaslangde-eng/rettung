import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KatiAvatar } from '../components/Kati';
import { Tap } from '../components/UI';
import { useRolle } from '../game/rolle';
import { colors, fonts, spacing, type } from '../theme';

export type Modus = 'story' | 'frei';

/** Spielweise wählen: mit Geschichte oder frei spielen */
export function ModusScreen({ aktuell, onWahl, onZurueck }: { aktuell?: Modus | ''; onWahl: (m: Modus) => void; onZurueck?: () => void }) {
  const r = useRolle();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={{ alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg }}>
        <KatiAvatar size={64} />
        <Text style={[type.eyebrow, { color: r.akzentDunkel }]}>
          {r.icon} {r.titel}
        </Text>
        <Text style={[type.title, { textAlign: 'center' }]}>Wie möchtest du spielen?</Text>
        <Text style={[type.body, { textAlign: 'center', color: colors.muted }]}>Du kannst das jederzeit ändern – auf der Startseite oder unter „Mehr“. Dein Fortschritt bleibt erhalten.</Text>
      </View>
      <Tap onPress={() => onWahl('story')} accessibilityLabel="Mit Geschichte spielen" style={[styles.card, aktuell !== 'frei' && { borderColor: r.akzent }]}>
        <Text style={styles.icon}>📖</Text>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={type.headline}>Mit Geschichte</Text>
          <Text style={type.small}>Kati begleitet dich durch Kapitel mit Aufgaben. Mit jedem Kapitel schalten sich neue Bereiche frei – so baut alles aufeinander auf.</Text>
          <Text style={[styles.tag, { color: r.akzentDunkel }]}>{aktuell === 'story' ? '✓ Gerade aktiv' : 'Empfohlen für den Einstieg'}</Text>
        </View>
      </Tap>
      <Tap onPress={() => onWahl('frei')} accessibilityLabel="Frei spielen" style={[styles.card, aktuell === 'frei' && { borderColor: r.akzent }]}>
        <Text style={styles.icon}>🧭</Text>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={type.headline}>Frei spielen</Text>
          <Text style={type.small}>Alles ist von Anfang an offen, es gibt keine Geschichte und keine Kapitel. Du übst, was du willst, in deiner Reihenfolge.</Text>
          {aktuell === 'frei' && <Text style={[styles.tag, { color: r.akzentDunkel }]}>✓ Gerade aktiv</Text>}
        </View>
      </Tap>
      {onZurueck && (
        <Tap onPress={onZurueck} accessibilityLabel="Abbrechen" style={{ alignItems: 'center', padding: spacing.md }}>
          <Text style={[type.body, { color: colors.muted }]}>Abbrechen</Text>
        </Tap>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl, maxWidth: 560, alignSelf: 'center', width: '100%' },
  card: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, padding: spacing.lg },
  icon: { fontSize: 34, lineHeight: 40, fontFamily: fonts.regular },
  tag: { fontFamily: fonts.semibold, fontSize: 12, marginTop: 2 },
});
