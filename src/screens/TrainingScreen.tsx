import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconTile, Pill, Tap } from '../components/UI';
import { AKTEN } from '../data/akten';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';
import { DetectiveTeaser, TrainingId, trainings } from './HomeScreen';

const MORE: Record<TrainingId, string> = {
  detektiv: `Decke Hinweise auf wie ein Detektiv und finde die Diagnose. Combo, Geniestreich und ein Archiv mit ${AKTEN.length} Akten in vielen Situationen.`,
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
      <DetectiveTeaser progress={progress} onPress={() => onTraining('detektiv')} />
      <View style={[styles.list, L.wide && styles.grid]}>
        {trainings(progress)
          .filter((t) => t.id !== 'detektiv')
          .map((t) => (
            <Tap
              key={t.id}
              onPress={() => onTraining(t.id)}
              accessibilityLabel={t.title}
              style={[styles.card, { backgroundColor: t.tone }, L.wide && styles.cardWide]}
            >
              <View style={styles.head}>
                <IconTile icon={t.icon} color={colors.white} size={54} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{t.title}</Text>
                  <Text style={styles.sub}>{t.sub}</Text>
                </View>
              </View>
              <Text style={type.body}>{MORE[t.id]}</Text>
              <View style={styles.foot}>
                <Pill label={t.best ?? 'Noch nicht gespielt'} color={colors.white} light />
                <View style={[styles.start, { backgroundColor: t.accent }]}>
                  <Text style={styles.startText}>Starten ▶</Text>
                </View>
              </View>
            </Tap>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingBottom: spacing.xxl + 8, gap: spacing.xl },
  list: { gap: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardWide: { flexBasis: '45%', flexGrow: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontFamily: fonts.displayBlack, fontSize: 22, lineHeight: 24, color: colors.ink, letterSpacing: -0.6 },
  sub: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 15, color: colors.inkSoft, marginTop: 2 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  start: { borderRadius: 999, borderWidth: 2, borderColor: colors.ink, paddingHorizontal: 18, paddingVertical: 8 },
  startText: { color: colors.ink, fontFamily: fonts.displayBlack, fontSize: 15, letterSpacing: -0.2 },
});
