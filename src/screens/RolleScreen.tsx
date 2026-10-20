import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { Car } from '../components/Car';
import { StarOfLife } from '../components/Ems';
import { KatiAvatar } from '../components/Kati';
import { Tap } from '../components/UI';
import { ROLLEN, Rolle } from '../game/rolle';
import { colors, fonts, spacing, tiles, type } from '../theme';

const MERKMALE = ['🎮 Spielerisch lernen', '🔒 Ohne Anmeldung', '💾 Spielstand auf dem Gerät'];

const PUNKTE: Record<Rolle, string[]> = {
  helfer: ['Notruf, Seitenlage, Wiederbelebung', 'Handgriffe zum Selbermachen', 'Eigenes Auto und Hilfspunkt ausbauen'],
  sani: [
    'Patienten untersuchen und Werte messen',
    'Diagnosen stellen, ABCDE, Großeinsatz',
    'Eigenen Rettungswagen und Wache ausbauen',
  ],
};

/** Beim ersten Start (und unter „Mehr“): Wie möchtest du spielen? */
export function RolleScreen({ aktuell, onWahl }: { aktuell?: Rolle | null; onWahl: (r: Rolle) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <StarOfLife size={34} color={colors.red} />
        </View>
        <Text style={styles.titel}>Einsatz 112</Text>
        <Text style={[type.body, { textAlign: 'center', color: colors.muted }]}>
          Erste Hilfe und Rettungsdienst zum Spielen – in kleinen Einsätzen, mit Erklärung nach jeder Antwort.
        </Text>
        <View style={styles.merkmale}>
          {MERKMALE.map((m) => (
            <Text key={m} style={styles.merkmal}>
              {m}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.kati}>
        <KatiAvatar size={40} />
        <Text style={[type.body, { flex: 1 }]}>
          Hi, ich bin Kati! Wie möchtest du spielen? Du kannst die Rolle jederzeit unter „Mehr“ wechseln.
        </Text>
      </View>
      {(['helfer', 'sani'] as Rolle[]).map((id) => {
        const r = ROLLEN[id];
        const aktiv = aktuell === id;
        const tint = tiles[id === 'helfer' ? 'teal' : 'red'];
        return (
          <Tap
            key={id}
            onPress={() => onWahl(id)}
            accessibilityLabel={r.titel}
            style={[styles.card, aktiv && { borderColor: r.akzent, borderWidth: 2 }]}
          >
            <View style={[styles.kopf, { backgroundColor: tint.bg, borderBottomColor: tint.edge }]}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.kopfIcon}>{r.icon}</Text>
                <Text style={[type.h2, { color: tint.accent }]}>{r.titel}</Text>
              </View>
              {id === 'helfer' ? <Car level={2} width={120} /> : <Ambulance level={3} width={130} />}
            </View>
            <View style={styles.rumpf}>
              {PUNKTE[id].map((p) => (
                <View key={p} style={styles.punkt}>
                  <Text style={[styles.haken, { color: r.akzent }]}>✓</Text>
                  <Text style={[type.body, { flex: 1, fontSize: 15 }]}>{p}</Text>
                </View>
              ))}
              <Text style={[styles.go, { color: r.akzent }]}>{aktiv ? 'Weiterspielen ›' : 'So spielen ›'}</Text>
            </View>
          </Tap>
        );
      })}
      <Text style={[type.small, { textAlign: 'center' }]}>
        Lernspiel – ersetzt keinen Erste-Hilfe-Kurs und keine Ausbildung. Im Notfall: 112.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingVertical: spacing.xxl,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titel: { fontFamily: fonts.displayBlack, fontSize: 38, lineHeight: 42, letterSpacing: -1.2, color: colors.ink },
  merkmale: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 4 },
  merkmal: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.inkSoft,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  kati: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: spacing.md,
  },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 24, overflow: 'hidden' },
  kopf: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1 },
  kopfIcon: { fontSize: 26, fontFamily: fonts.regular },
  rumpf: { padding: spacing.lg, gap: spacing.sm },
  punkt: { flexDirection: 'row', gap: spacing.sm },
  haken: { fontFamily: fonts.extrabold, fontSize: 15, width: 18 },
  go: { fontFamily: fonts.bold, fontSize: 15, marginTop: 4 },
});
