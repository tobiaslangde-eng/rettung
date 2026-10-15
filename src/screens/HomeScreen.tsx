import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { Car } from '../components/Car';
import { RankBadge } from '../components/Ems';
import { KatiAvatar } from '../components/Kati';
import { Bar, Button, Card, Segmented, Tap } from '../components/UI';
import { badgesFuerRolle } from '../game/achievements';
import { DAILY_GOAL, dayState } from '../game/daily';
import { DIFFICULTIES, DIFFICULTY_BY_ID, Difficulty } from '../game/difficulty';
import { MAX_LEVEL, ausruestung, euro, levelOf, totalLevel, upgradeBlock } from '../game/equipment';
import { HILF_GESAMT_MAX, hilfGesamt } from '../game/hilfspunkt';
import { WACHE_GESAMT_MAX, wacheGesamt } from '../game/wache';
import { useRolle } from '../game/rolle';
import { rankFor, rankList } from '../game/scoring';
import { KAPITEL, KAPITEL_BONUS, StoryAktion, aktuellesKapitel, freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { TrainingId, trainingsFuer } from '../game/trainings';
import { useLayout, useSidebar } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** Startseite: Geschichte, Hauptaktion, Tagesziel, Training, Fahrzeug, Profil – klar untereinander. */
export function HomeScreen({
  progress,
  onStart,
  onDaily,
  onDifficulty,
  onTraining,
  onGarage,
  onWache,
  onStory,
  onStoryDone,
  onModus,
}: {
  progress: Progress;
  onStart: () => void;
  onDaily: () => void;
  onDifficulty: (d: Difficulty) => void;
  onTraining: (t: TrainingId) => void;
  onGarage: () => void;
  onWache: () => void;
  /** Knopf im Kapitel: öffnet den passenden Bereich */
  onStory: (a: StoryAktion) => void;
  /** Kapitel abschließen und Belohnung holen */
  onStoryDone: () => void;
  /** Spielweise ändern (Geschichte oder frei) */
  onModus: () => void;
}) {
  const L = useLayout();
  const sidebar = useSidebar();
  const r = useRolle();
  const now = new Date();
  const kap = progress.modus === 'frei' ? null : aktuellesKapitel(r.id, progress);
  const day = dayState(progress);
  const { rank, next } = rankFor(progress.totalPoints);
  const rankPct = next ? (progress.totalPoints - rank.min) / (next.min - rank.min) : 1;
  const einsatzFrei = istFrei(r.id, progress, 'einsatz');
  const garageFrei = istFrei(r.id, progress, 'garage');
  const helfer = r.id === 'helfer';

  const header = (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={type.eyebrow}>
          {WOCHENTAGE[now.getDay()]}, {now.getDate()}. {MONATE[now.getMonth()]}
        </Text>
        <Text style={type.largeTitle}>{sidebar ? 'Hallo!' : 'Einsatz 112'}</Text>
        <Text style={[type.small, { color: r.akzentDunkel }]}>
          {r.icon} {r.titel} · {rank.de}
        </Text>
        <Tap onPress={onModus} accessibilityLabel="Spielweise ändern" style={styles.modusChip}>
          <Text style={styles.modusText}>{progress.modus === 'frei' ? '🧭 Frei spielen' : '📖 Mit Geschichte'} · ändern ›</Text>
        </Tap>
      </View>
      <View style={styles.headerStats}>
        <Mini value={progress.totalPoints.toLocaleString('de-DE')} label="Punkte" />
        <Mini value={euro(progress.budget)} label="Budget" />
      </View>
    </View>
  );

  const story = progress.modus === 'frei' ? null : kap ? (
    <Card style={{ gap: spacing.md }}>
      <View style={styles.storyTop}>
        <KatiAvatar size={44} />
        <View style={{ flex: 1 }}>
          <Text style={type.eyebrow}>
            Kapitel {kap.nr} von {KAPITEL[r.id].length}
          </Text>
          <Text style={type.h2}>{kap.kapitel.titel}</Text>
        </View>
      </View>
      <Text style={styles.storyText}>{kap.kapitel.text}</Text>
      <View style={[styles.goal, { backgroundColor: r.akzentTint }]}>
        <Text style={[styles.goalLabel, { color: r.akzentDunkel }]}>{kap.erfuellt ? '✓ Aufgabe erfüllt' : 'Deine Aufgabe'}</Text>
        <Text style={type.body}>{kap.kapitel.ziel}</Text>
        {kap.kapitel.aktion !== 'rolle' && <Bar pct={kap.kapitel.stand(progress)} style={{ marginTop: 4 }} />}
      </View>
      {kap.erfuellt && kap.kapitel.aktion !== 'rolle' ? (
        <Button label={`Kapitel abschließen · +${KAPITEL_BONUS} Punkte`} onPress={onStoryDone} />
      ) : (
        <Button
          label={kap.kapitel.aktion === 'rolle' ? 'Rolle wechseln' : 'Los geht’s'}
          variant={kap.kapitel.aktion === 'rolle' ? 'outline' : 'primary'}
          onPress={() => onStory(kap.kapitel.aktion)}
        />
      )}
    </Card>
  ) : (
    <Card style={{ gap: spacing.sm }}>
      <Text style={type.eyebrow}>Geschichte</Text>
      <Text style={type.h2}>Alle Kapitel geschafft!</Text>
      <Text style={type.body}>Du bist ein echtes Vorbild. Spiel weiter, sammle Punkte und vervollständige dein Archiv.</Text>
    </Card>
  );

  const action = (
    <Card style={{ gap: spacing.md }}>
      <View style={styles.actionTop}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.h2}>{helfer ? 'Notfall im Alltag' : 'Schicht beginnen'}</Text>
          <Text style={type.small}>
            {helfer ? 'Prüfen, erkennen, richtig handeln – ohne Messgeräte.' : 'Patient untersuchen, Werte messen, richtig handeln.'}
          </Text>
        </View>
        {helfer ? <Car level={levelOf(progress, 'auto')} width={88} /> : <Ambulance level={levelOf(progress, 'rtw')} width={92} />}
      </View>
      {einsatzFrei ? (
        <>
          {!helfer && (
            <>
              <Segmented
                options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
                value={progress.difficulty}
                onChange={onDifficulty}
              />
              <Text style={type.small}>{DIFFICULTY_BY_ID[progress.difficulty].description}</Text>
            </>
          )}
          <Button label={helfer ? 'Notfall starten' : 'Einsatz starten'} onPress={onStart} />
        </>
      ) : (
        <Locked kapitel={freiAb(r.id, 'einsatz')} />
      )}
    </Card>
  );

  const today = einsatzFrei ? (
    <Card style={{ gap: spacing.md }}>
      <Text style={type.eyebrow}>Heute</Text>
      <View style={styles.todayRow}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={type.headline}>
            Tagesziel: {Math.min(day.cases, DAILY_GOAL)} von {DAILY_GOAL} {r.einsatz === 'Notfall' ? 'Notfällen' : 'Einsätzen'}
          </Text>
          <Bar pct={day.cases / DAILY_GOAL} />
        </View>
        <Text style={styles.streak}>🔥 {day.streak}</Text>
      </View>
      <Button
        label={day.dailyCaseDone ? `${r.einsatz} des Tages erledigt ✓` : `${r.einsatz} des Tages · +50 %`}
        variant="tinted"
        disabled={day.dailyCaseDone}
        onPress={onDaily}
      />
    </Card>
  ) : null;

  const training = (
    <View style={{ gap: spacing.sm }}>
      <Text style={type.eyebrow}>Training</Text>
      <View style={styles.list}>
        {trainingsFuer(r.id, progress).map((t, i) => {
          const frei = istFrei(r.id, progress, t.id);
          return (
            <Tap
              key={t.id}
              onPress={frei ? () => onTraining(t.id) : undefined}
              disabled={!frei}
              accessibilityLabel={t.title}
              style={[styles.listRow, i > 0 && styles.listDivider]}
            >
              <View style={[styles.listIconBox, { backgroundColor: frei ? t.farbe : colors.paper }]}>
                <Text style={[styles.listIcon, !frei && { opacity: 0.4 }]}>{t.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.headline, !frei && { color: colors.muted }]}>{t.title}</Text>
                <Text style={type.small} numberOfLines={2}>
                  {frei ? (t.stand ?? t.sub) : `Wird in Kapitel ${freiAb(r.id, t.id)} freigeschaltet`}
                </Text>
              </View>
              <Text style={styles.chevron}>{frei ? '›' : '🔒'}</Text>
            </Tap>
          );
        })}
      </View>
    </View>
  );

  const total = totalLevel(progress);
  const maxTotal = ausruestung().length * MAX_LEVEL;
  const upgradable = ausruestung().some((e) => upgradeBlock(progress, e.id) === null);
  const wacheStufen = wacheGesamt(progress);
  const hilfStufen = hilfGesamt(progress);
  const wacheRow = (
    helfer ? (
    <Tap onPress={garageFrei ? onWache : undefined} disabled={!garageFrei} accessibilityLabel="Mein Hilfspunkt" style={[styles.list, styles.listRow]}>
      <Text style={[styles.listIcon, !garageFrei && { opacity: 0.4 }]}>💚</Text>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type.headline, !garageFrei && { color: colors.muted }]}>Mein Hilfspunkt</Text>
        {garageFrei ? (
          <>
            <Text style={type.small}>Ausbau {hilfStufen} von {HILF_GESAMT_MAX}</Text>
            <Bar pct={hilfStufen / HILF_GESAMT_MAX} color={colors.tuerkis} />
          </>
        ) : (
          <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
        )}
      </View>
    </Tap>
    ) : (
    <Tap onPress={garageFrei ? onWache : undefined} disabled={!garageFrei} accessibilityLabel="Meine Rettungswache" style={[styles.list, styles.listRow]}>
      <Text style={[styles.listIcon, !garageFrei && { opacity: 0.4 }]}>🏥</Text>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type.headline, !garageFrei && { color: colors.muted }]}>Meine Rettungswache</Text>
        {garageFrei ? (
          <>
            <Text style={type.small}>Ausbau {wacheStufen} von {WACHE_GESAMT_MAX}</Text>
            <Bar pct={wacheStufen / WACHE_GESAMT_MAX} color={colors.tuerkis} />
          </>
        ) : (
          <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
        )}
      </View>
    </Tap>
    )
  );
  const vehicle = (
    <Tap
      onPress={garageFrei ? onGarage : undefined}
      disabled={!garageFrei}
      accessibilityLabel={r.fahrzeug}
      style={[styles.list, styles.listRow]}
    >
      <Text style={[styles.listIcon, !garageFrei && { opacity: 0.4 }]}>{helfer ? '🚗' : '🚑'}</Text>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[type.headline, !garageFrei && { color: colors.muted }]}>{r.fahrzeug}</Text>
        {garageFrei ? (
          <>
            <Text style={type.small}>
              Ausbau {total} von {maxTotal}
              {upgradable ? ' · Aufrüsten möglich!' : ''}
            </Text>
            <Bar pct={total / maxTotal} />
          </>
        ) : (
          <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
        )}
      </View>
      <Text style={styles.chevron}>{garageFrei ? '›' : '🔒'}</Text>
    </Tap>
  );

  const profile = (
    <Card style={styles.profile}>
      <RankBadge size={52} level={rankList().indexOf(rank)} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={type.eyebrow}>Mein Rang</Text>
        <Text style={type.headline}>{rank.de}</Text>
        <Bar pct={rankPct} />
        <Text style={type.small}>
          {next ? `Noch ${(next.min - progress.totalPoints).toLocaleString('de-DE')} Punkte bis ${next.de}` : 'Höchster Rang erreicht'} ·{' '}
          {progress.badges.length} von {badgesFuerRolle().length} Abzeichen
        </Text>
      </View>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
      {header}
      {L.wide ? (
        <View style={styles.cols}>
          <Col>
            {story}
            {action}
            {today}
          </Col>
          <Col>
            {training}
            {vehicle}
            {wacheRow}
            {profile}
          </Col>
        </View>
      ) : (
        <>
          {story}
          {action}
          {today}
          {training}
          {vehicle}
          {wacheRow}
          {profile}
        </>
      )}
      <Text style={styles.note}>Lernspiel – ersetzt keinen Erste-Hilfe-Kurs und keine Ausbildung. Im Notfall: 112.</Text>
    </ScrollView>
  );
}

function Col({ children }: { children: ReactNode }) {
  return <View style={{ flex: 1, gap: spacing.lg, minWidth: 0 }}>{children}</View>;
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.mini}>
      <Text style={styles.miniValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function Locked({ kapitel }: { kapitel: number }) {
  return (
    <View style={styles.locked}>
      <Text style={styles.lockedText}>🔒 Wird in Kapitel {kapitel} freigeschaltet – folge der Geschichte oben.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modusChip: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  modusText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkSoft },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  cols: { flexDirection: 'row', gap: spacing.xl, alignItems: 'flex-start' },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  headerStats: { flexDirection: 'row', gap: spacing.sm },
  mini: {
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  miniValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  miniLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  storyTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  storyText: { ...type.body, color: colors.inkSoft },
  goal: { borderRadius: 12, padding: spacing.md, gap: 4 },
  goalLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 0.3, textTransform: 'uppercase' },
  actionTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  todayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  streak: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  list: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  listDivider: { borderTopWidth: 1, borderTopColor: colors.line },
  listIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  listIcon: { fontSize: 20, textAlign: 'center', fontFamily: fonts.regular },
  chevron: { fontFamily: fonts.regular, fontSize: 22, color: colors.grau300 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  locked: { backgroundColor: colors.paper, borderRadius: 10, padding: spacing.md },
  lockedText: { ...type.small, color: colors.inkSoft },
  note: { ...type.small, textAlign: 'center', marginTop: spacing.sm },
});
