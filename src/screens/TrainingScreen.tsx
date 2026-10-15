import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BentoGrid, Tile } from '../components/Bento';
import { TopBar } from '../components/UI';
import { useRolle } from '../game/rolle';
import { freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { TrainingId, trainingsFuer } from '../game/trainings';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Alle Trainings der Rolle als Bento-Kacheln */
export function TrainingScreen({ progress, onTraining }: { progress: Progress; onTraining: (t: TrainingId) => void }) {
  const L = useLayout();
  const r = useRolle();
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Training" />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        <Text style={[type.body, { marginBottom: spacing.sm }]}>
          Übe hier in Ruhe. Jedes Training bringt Punkte – und Budget für{' '}
          {r.id === 'helfer' ? 'dein Auto' : 'deinen Rettungswagen'}.
        </Text>
        <BentoGrid>
          {trainingsFuer(r.id, progress).map((t) => {
            const frei = istFrei(r.id, progress, t.id);
            return (
              <Tile
                key={t.id}
                size={L.wide ? 'sm' : 'half'}
                bg={frei ? t.farbe : colors.surface}
                onPress={frei ? () => onTraining(t.id) : undefined}
                disabled={!frei}
                accessibilityLabel={t.title}
                style={{ minHeight: 176, justifyContent: 'space-between' }}
              >
                <View style={styles.top}>
                  <View style={styles.iconBox}>
                    <Text style={[styles.icon, !frei && { opacity: 0.4 }]}>{t.icon}</Text>
                  </View>
                  {!frei && <Text style={styles.lock}>🔒</Text>}
                </View>
                <View style={{ gap: 3 }}>
                  <Text
                    style={[type.headline, { fontSize: 15, letterSpacing: -0.3 }, !frei && { color: colors.muted }]}
                    numberOfLines={2}
                  >
                    {t.title}
                  </Text>
                  <Text style={styles.sub} numberOfLines={3}>
                    {t.sub}
                  </Text>
                  <View style={[styles.stand, { backgroundColor: frei ? 'rgba(255,255,255,0.7)' : colors.paper }]}>
                    <Text style={[styles.standText, { color: frei ? r.akzentDunkel : colors.muted }]} numberOfLines={1}>
                      {frei ? (t.stand ?? 'Noch nicht gespielt') : `🔒 Kapitel ${freiAb(r.id, t.id)}`}
                    </Text>
                  </View>
                </View>
              </Tile>
            );
          })}
        </BentoGrid>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24, fontFamily: fonts.regular, textAlign: 'center' },
  lock: { fontSize: 15, fontFamily: fonts.regular },
  sub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.inkSoft },
  stand: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, marginTop: 2 },
  standText: { fontFamily: fonts.semibold, fontSize: 11.5 },
});
