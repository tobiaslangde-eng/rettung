import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconTile, Pill } from '../components/UI';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, radius, shadow, spacing, type } from '../theme';
import { TrainingId, trainings } from './HomeScreen';

const MORE: Record<TrainingId, string> = {
  manv: 'Viele Verletzte, wenig Zeit: Teile alle nach dem Sichtungsschema in Rot, Gelb, Grün oder Schwarz ein.',
  cpr: 'Tippe im richtigen Takt auf den Brustkorb – 2 Runden 30:2 mit Live-Anzeige.',
  wissen: 'Notruf, ABCDE, Krankheitsbilder und mehr – mit Erklärung nach jeder Antwort.',
  quiz: 'Ist der Wert niedrig, normal oder hoch? 10 zufällige Messwerte in Folge.',
};

/** Tab „Training“: alle Übungen auf einen Blick */
export function TrainingScreen({ progress, onTraining }: { progress: Progress; onTraining: (t: TrainingId) => void }) {
  const L = useLayout();
  return (
    <ScrollView contentContainerStyle={[styles.body, L.wide && { padding: spacing.xl }]}>
      <View>
        <Text style={type.eyebrow}>Üben zwischendurch</Text>
        <Text style={type.largeTitle}>Training</Text>
      </View>
      <View style={[styles.list, L.wide && styles.grid]}>
        {trainings(progress).map((t) => (
          <Pressable
            key={t.id}
            onPress={() => onTraining(t.id)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.card,
              L.wide && styles.cardWide,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
            ]}
          >
            <View style={styles.head}>
              <IconTile icon={t.icon} color={t.color} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={type.h2}>{t.title}</Text>
                <Text style={type.small}>{t.sub}</Text>
              </View>
            </View>
            <Text style={type.body}>{MORE[t.id]}</Text>
            <View style={styles.foot}>
              {t.best ? (
                <Pill label={t.best} color={t.color} light />
              ) : (
                <Pill label="Noch nicht gespielt" color={colors.grau500} light />
              )}
              <View style={[styles.start, { backgroundColor: t.color }]}>
                <Text style={styles.startText}>Starten</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  list: { gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: colors.weiss, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, ...shadow },
  cardWide: { flexBasis: '45%', flexGrow: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  start: { borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 8 },
  startText: { color: colors.weiss, fontFamily: fonts.semibold, fontSize: 15 },
});
