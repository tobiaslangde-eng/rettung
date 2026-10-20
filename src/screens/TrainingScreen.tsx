import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BentoGrid, Tile } from '../components/Bento';
import { Segmented, TopBar } from '../components/UI';
import { Difficulty } from '../game/difficulty';
import { StoryAktion } from '../game/story';
import { LernpfadView } from './LernpfadView';
import { SpielmodiView } from './SpielmodiView';
import { useRolle } from '../game/rolle';
import { freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { TRAINING_GRUPPEN, TrainingId, trainingsFuer } from '../game/trainings';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

type Ansicht = 'pfad' | 'ueben' | 'modi';

/** Training: Lernpfad (Geschichte), Üben (alle Trainings) und Spielmodi */
export function TrainingScreen({
  progress,
  onTraining,
  onStory,
  onStoryDone,
  onWechsleModus,
  onStart,
  onDaily,
  onSchicht,
  onKarte,
  onDuell,
  onLive,
  onDifficulty,
}: {
  progress: Progress;
  onTraining: (t: TrainingId) => void;
  onStory: (a: StoryAktion) => void;
  onStoryDone: () => void;
  onWechsleModus: (m: 'story' | 'frei') => void;
  onStart: () => void;
  onDaily: () => void;
  onSchicht: () => void;
  onKarte: () => void;
  onDuell: () => void;
  onLive: () => void;
  onDifficulty: (d: Difficulty) => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const scroll = useRef<ScrollView>(null);
  const [ansicht, setAnsicht] = useState<Ansicht>(progress.modus === 'frei' ? 'ueben' : 'pfad');
  const alle = trainingsFuer(r.id, progress);
  const gespieltGesamt = alle.filter((t) => !!t.stand).length;
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Training" />
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        <Segmented
          options={[
            { id: 'pfad' as Ansicht, label: '🛤️ Lernpfad' },
            { id: 'ueben' as Ansicht, label: '🎯 Üben' },
            { id: 'modi' as Ansicht, label: '🎮 Spielmodi' },
          ]}
          value={ansicht}
          onChange={setAnsicht}
        />
        {ansicht === 'pfad' && (
          <View style={{ marginTop: spacing.md }}>
            <LernpfadView
              progress={progress}
              onStory={onStory}
              onStoryDone={onStoryDone}
              onWechsleModus={onWechsleModus}
              onNachOben={() => scroll.current?.scrollTo({ y: 0, animated: true })}
            />
          </View>
        )}
        {ansicht === 'modi' && (
          <View style={{ marginTop: spacing.md }}>
            <SpielmodiView
              progress={progress}
              onStart={onStart}
              onDaily={onDaily}
              onSchicht={onSchicht}
              onKarte={onKarte}
              onDuell={onDuell}
              onLive={onLive}
              onDifficulty={onDifficulty}
            />
          </View>
        )}
        {ansicht === 'ueben' && (
          <>
            <Text style={[type.body, { marginVertical: spacing.sm }]}>
              Übe hier in Ruhe. Jedes Training bringt EP – und Coins für{' '}
              {r.id === 'helfer' ? 'dein Auto' : 'deinen Rettungswagen'}. Schon gespielt: {gespieltGesamt} von {alle.length}.
            </Text>
            {TRAINING_GRUPPEN.map((g) => {
              const liste = alle.filter((t) => g.ids.includes(t.id));
              if (liste.length === 0) return null;
              const gespielt = liste.filter((t) => !!t.stand).length;
              return (
                <View key={g.titel} style={{ marginTop: spacing.md }}>
                  <View style={styles.gruppe}>
                    <View style={{ flex: 1 }}>
                      <Text style={type.h2}>{g.titel}</Text>
                      <Text style={type.small}>{g.text}</Text>
                    </View>
                    <Text style={[styles.zaehler, { color: r.akzentDunkel, backgroundColor: r.akzentTint }]}>
                      {gespielt}/{liste.length}
                    </Text>
                  </View>
                  <BentoGrid>
                    {liste.map((t) => {
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
                            {!frei ? <Text style={styles.lock}>🔒</Text> : !t.stand ? <Text style={styles.neu}>NEU</Text> : null}
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
                            <View style={[styles.stand, { backgroundColor: frei ? colors.veil : colors.paper }]}>
                              <Text style={[styles.standText, { color: frei ? r.akzentDunkel : colors.muted }]} numberOfLines={1}>
                                {frei ? (t.stand ?? 'Noch nicht gespielt') : `🔒 Kapitel ${freiAb(r.id, t.id)}`}
                              </Text>
                            </View>
                          </View>
                        </Tile>
                      );
                    })}
                  </BentoGrid>
                </View>
              );
            })}
          </>
        )}
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
    backgroundColor: colors.veil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24, fontFamily: fonts.regular, textAlign: 'center' },
  lock: { fontSize: 15, fontFamily: fonts.regular },
  neu: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.onBright,
    backgroundColor: colors.yellow,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  gruppe: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: 2, paddingBottom: spacing.xs },
  zaehler: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  sub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.inkSoft },
  stand: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, marginTop: 2 },
  standText: { fontFamily: fonts.semibold, fontSize: 11.5 },
});
