import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StarOfLife } from '../components/Ems';
import { Tap } from '../components/UI';
import { ROLLEN, Rolle } from '../game/rolle';
import { colors, fonts, spacing, type } from '../theme';

/** Beim ersten Start (und unter „Mehr“): Wie möchtest du spielen? */
export function RolleScreen({ aktuell, onWahl }: { aktuell?: Rolle | null; onWahl: (r: Rolle) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <StarOfLife size={44} color={colors.red} />
        <Text style={type.largeTitle}>Einsatz 112</Text>
        <Text style={[type.body, { textAlign: 'center', color: colors.muted }]}>
          Wie möchtest du spielen? Du kannst die Rolle jederzeit unter „Mehr“ wechseln – jede Rolle hat ihren eigenen Spielstand.
        </Text>
      </View>
      {(['helfer', 'sani'] as Rolle[]).map((id) => {
        const r = ROLLEN[id];
        const aktiv = aktuell === id;
        return (
          <Tap
            key={id}
            onPress={() => onWahl(id)}
            accessibilityLabel={r.titel}
            style={[styles.card, aktiv && { borderColor: r.akzent, borderWidth: 2 }]}
          >
            <View style={[styles.icon, { backgroundColor: r.akzentTint }]}>
              <Text style={{ fontSize: 30, fontFamily: fonts.regular }}>{r.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.h2, { color: r.akzentDunkel }]}>{r.titel}</Text>
              <Text style={type.body}>{r.beschreibung}</Text>
              <Text style={[styles.go, { color: r.akzent }]}>{aktiv ? 'Weiterspielen ›' : 'So spielen ›'}</Text>
            </View>
          </Tap>
        );
      })}
      <Text style={[type.small, { textAlign: 'center' }]}>Lernspiel – ersetzt keinen Erste-Hilfe-Kurs und keine Ausbildung. Im Notfall: 112.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingVertical: spacing.xxl, maxWidth: 620, width: '100%', alignSelf: 'center' },
  brand: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: spacing.lg,
  },
  icon: { width: 60, height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  go: { fontFamily: fonts.semibold, fontSize: 15, marginTop: 4 },
});
