import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Tap, TopBar } from '../components/UI';
import { useRolle } from '../game/rolle';
import { freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { TrainingId, trainingsFuer } from '../game/trainings';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Alle Trainings der Rolle als klare Liste */
export function TrainingScreen({ progress, onTraining }: { progress: Progress; onTraining: (t: TrainingId) => void }) {
  const L = useLayout();
  const r = useRolle();
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Training" />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        <Text style={type.body}>Übe hier in Ruhe. Jedes Training bringt Punkte – und Budget für {r.id === 'helfer' ? 'dein Auto' : 'deinen Rettungswagen'}.</Text>
        {trainingsFuer(r.id, progress).map((t) => {
          const frei = istFrei(r.id, progress, t.id);
          return (
            <Tap
              key={t.id}
              onPress={frei ? () => onTraining(t.id) : undefined}
              disabled={!frei}
              accessibilityLabel={t.title}
              style={styles.card}
            >
              <View style={[styles.icon, { backgroundColor: frei ? r.akzentTint : colors.paper }]}>
                <Text style={{ fontSize: 24, fontFamily: fonts.regular }}>{t.icon}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[type.headline, !frei && { color: colors.muted }]}>{t.title}</Text>
                <Text style={type.small}>{t.sub}</Text>
                <Text style={[styles.stand, { color: frei ? r.akzentDunkel : colors.muted }]}>
                  {frei ? (t.stand ?? 'Noch nicht gespielt') : `🔒 Kapitel ${freiAb(r.id, t.id)}`}
                </Text>
              </View>
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.lg,
  },
  icon: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stand: { fontFamily: fonts.semibold, fontSize: 12, marginTop: 2 },
});
