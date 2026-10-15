import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { Car } from '../components/Car';
import { RankBadge } from '../components/Ems';
import { KatiAvatar } from '../components/Kati';
import { BentoGrid, BentoTitle, BigNumber, ChapterPath, Ring, Tile, TileLabel } from '../components/Bento';
import { Bar, Button, Segmented, Tap } from '../components/UI';
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
import { colors, fonts, spacing, tiles, type } from '../theme';

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
  onWelt,
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
  /** 3D-Welt öffnen (nur Web) */
  onWelt: () => void;
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

  const helferTint = helfer ? 'teal' : 'red';
  const heroTitle = sidebar ? 'Hallo!' : 'Einsatz 112';

  const hero = (
    <Tile size="lg" tint="ink" paper style={{ paddingBottom: 56 }}>
      <View style={styles.heroTop}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type.eyebrow, { color: colors.onDarkSoft }]}>
            {WOCHENTAGE[now.getDay()]}, {now.getDate()}. {MONATE[now.getMonth()]}
          </Text>
          <Text style={[type.largeTitle, { color: colors.white }]}>{heroTitle}</Text>
          <Text style={[type.small, { color: helfer ? '#5EEAD4' : '#FF9C98' }]}>
            {r.icon} {r.titel} · {rank.de}
          </Text>
          <Tap onPress={onModus} accessibilityLabel="Spielweise ändern" style={styles.modusChip}>
            <Text style={styles.modusText}>{progress.modus === 'frei' ? '🧭 Frei spielen' : '📖 Mit Geschichte'} · ändern ›</Text>
          </Tap>
        </View>
        <RankBadge size={64} level={rankList().indexOf(rank)} />
      </View>
    </Tile>
  );

  const ausbauNow = helfer ? hilfGesamt(progress) : wacheGesamt(progress);
  const ausbauAll = helfer ? HILF_GESAMT_MAX : WACHE_GESAMT_MAX;

  const stats = (
    <>
      <Tile size="third" tint="amber" style={styles.mini}>
        <Text style={styles.miniIcon}>⭐</Text>
        <BigNumber value={progress.totalPoints.toLocaleString('de-DE')} color={tiles.amber.accent} size={24} />
        <Text style={[styles.miniLabel, { color: tiles.amber.accent }]}>Punkte</Text>
      </Tile>
      <Tile size="third" tint="green" style={styles.mini}>
        <Text style={styles.miniIcon}>💶</Text>
        <BigNumber value={euro(progress.budget)} color={tiles.green.accent} size={24} />
        <Text style={[styles.miniLabel, { color: tiles.green.accent }]}>Budget</Text>
      </Tile>
      <Tile size="third" tint="pink" style={styles.mini}>
        <Text style={styles.miniIcon}>🔥</Text>
        <BigNumber value={`${day.streak}`} color={tiles.pink.accent} size={24} />
        <Text style={[styles.miniLabel, { color: tiles.pink.accent }]}>Tage am Stück</Text>
      </Tile>
      <Tile size="lg" tint="slate">
        <TileLabel icon="📈" text="Heute im Überblick" tint="teal" />
        <View style={styles.rings}>
          <RingStat pct={rankPct} color={tiles.amber.accent} center={`${Math.round(rankPct * 100)}%`} label="Rang" sub={next ? next.de : 'Spitze'} />
          <RingStat pct={day.cases / DAILY_GOAL} color={tiles.blue.accent} center={`${Math.min(day.cases, DAILY_GOAL)}/${DAILY_GOAL}`} label="Tagesziel" sub={r.einsatz === 'Notfall' ? 'Notfälle' : 'Einsätze'} />
          <RingStat pct={ausbauNow / ausbauAll} color={tiles.green.accent} center={`${ausbauNow}/${ausbauAll}`} label="Ausbau" sub={helfer ? 'Hilfspunkt' : 'Wache'} />
        </View>
      </Tile>
    </>
  );

  const story =
    progress.modus === 'frei' ? null : kap ? (
      <Tile size="md" tint="violet">
        <View style={styles.storyTop}>
          <KatiAvatar size={46} />
          <View style={{ flex: 1 }}>
            <TileLabel icon="📖" text={`Kapitel ${kap.nr} von ${KAPITEL[r.id].length}`} tint="violet" />
            <Text style={[type.h2, { marginTop: 4 }]}>{kap.kapitel.titel}</Text>
          </View>
        </View>
        <ChapterPath total={KAPITEL[r.id].length} current={kap.nr - 1} accent={tiles.violet.accent} />
        <Text style={styles.storyText}>{kap.kapitel.text}</Text>
        <View style={styles.goal}>
          <Text style={[styles.goalLabel, { color: tiles.violet.accent }]}>{kap.erfuellt ? '✓ Aufgabe erfüllt' : 'Deine Aufgabe'}</Text>
          <Text style={type.body}>{kap.kapitel.ziel}</Text>
          {kap.kapitel.aktion !== 'rolle' && <Bar pct={kap.kapitel.stand(progress)} color={tiles.violet.accent} track="rgba(15,42,46,0.1)" style={{ marginTop: 4 }} />}
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
      </Tile>
    ) : (
      <Tile size="md" tint="violet">
        <TileLabel icon="📖" text="Geschichte" tint="violet" />
        <Text style={type.h2}>Alle Kapitel geschafft!</Text>
        <Text style={type.body}>Du bist ein echtes Vorbild. Spiel weiter, sammle Punkte und vervollständige dein Archiv.</Text>
      </Tile>
    );

  const action = (
    <Tile size="md" tint={helferTint}>
      <TileLabel icon={helfer ? '🩹' : '🚑'} text={helfer ? 'Notfall' : 'Einsatz'} tint={helferTint} />
      <View style={styles.actionTop}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.h2}>{helfer ? 'Notfall im Alltag' : 'Schicht beginnen'}</Text>
          <Text style={type.small}>{helfer ? 'Prüfen, erkennen, richtig handeln – ohne Messgeräte.' : 'Patient untersuchen, Werte messen, richtig handeln.'}</Text>
        </View>
        {helfer ? <Car level={levelOf(progress, 'auto')} width={92} /> : <Ambulance level={levelOf(progress, 'rtw')} width={96} />}
      </View>
      {einsatzFrei ? (
        <>
          {!helfer && (
            <>
              <Segmented options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))} value={progress.difficulty} onChange={onDifficulty} />
              <Text style={type.small}>{DIFFICULTY_BY_ID[progress.difficulty].description}</Text>
            </>
          )}
          <Button label={helfer ? 'Notfall starten' : 'Einsatz starten'} onPress={onStart} />
        </>
      ) : (
        <Locked kapitel={freiAb(r.id, 'einsatz')} />
      )}
    </Tile>
  );

  const today = einsatzFrei ? (
    <>
      <Tile size="lg" tint="pink" onPress={day.dailyCaseDone ? undefined : onDaily} accessibilityLabel={`${r.einsatz} des Tages`}>
        <TileLabel icon="⭐" text="Des Tages" tint="pink" />
        <Text style={type.headline}>{r.einsatz} des Tages</Text>
        <Text style={type.small}>{day.dailyCaseDone ? 'Heute schon erledigt ✓' : '+50 % Punkte – jeden Tag ein neuer Fall.'}</Text>
        {!day.dailyCaseDone && <Text style={[styles.go, { color: tiles.pink.accent }]}>Starten ›</Text>}
      </Tile>
    </>
  ) : null;

  const training = (
    <>
      <BentoTitle>Training</BentoTitle>
      {trainingsFuer(r.id, progress).map((t) => {
        const frei = istFrei(r.id, progress, t.id);
        return (
          <Tile
            key={t.id}
            size="sm"
            bg={frei ? t.farbe : colors.surface}
            onPress={frei ? () => onTraining(t.id) : undefined}
            disabled={!frei}
            accessibilityLabel={t.title}
            style={{ minHeight: 132, justifyContent: 'space-between' }}
          >
            <View style={styles.trainTop}>
              <View style={[styles.listIconBox, { backgroundColor: 'rgba(15,42,46,0.1)' }]}>
                <Text style={[styles.listIcon, !frei && { opacity: 0.4 }]}>{t.icon}</Text>
              </View>
              {!frei && <Text style={styles.lock}>🔒</Text>}
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[type.headline, { fontSize: 13.5, letterSpacing: -0.3 }, !frei && { color: colors.muted }]} numberOfLines={2}>
                {t.title}
              </Text>
              <Text style={styles.trainSub} numberOfLines={2}>
                {frei ? (t.stand ?? t.sub) : `Ab Kapitel ${freiAb(r.id, t.id)}`}
              </Text>
            </View>
          </Tile>
        );
      })}
    </>
  );

  const total = totalLevel(progress);
  const maxTotal = ausruestung().length * MAX_LEVEL;
  const upgradable = ausruestung().some((e) => upgradeBlock(progress, e.id) === null);
  const ausbauStufen = helfer ? hilfGesamt(progress) : wacheGesamt(progress);
  const ausbauMax = helfer ? HILF_GESAMT_MAX : WACHE_GESAMT_MAX;

  const welt = Platform.OS === 'web' && (
    <Tile size="lg" tint="ink" onPress={onWelt} accessibilityLabel="3D-Welt">
      <TileLabel icon="🌍" text="Einsatz-Welt in 3D" tint="ink" />
      <View style={styles.actionTop}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[type.headline, { color: colors.onDark }]}>Laufe in Ego-Perspektive durch die Stadt</Text>
          <Text style={[type.small, { color: colors.onDarkSoft }]}>
            Mit Inventar: {helfer ? 'Handy, Warnweste, Warndreieck, Verbandkasten …' : 'Funkgerät, Rucksack, Monitor, Beatmungsbeutel …'} Folge dem roten Licht zum Notfall!
          </Text>
        </View>
        <Text style={{ fontSize: 44 }}>🌍</Text>
      </View>
    </Tile>
  );

  const vehicle = (
    <Tile size="md" tint="slate" onPress={garageFrei ? onGarage : undefined} disabled={!garageFrei} accessibilityLabel={r.fahrzeug}>
      <TileLabel icon={helfer ? '🚗' : '🚑'} text={r.fahrzeug} tint="teal" />
      <View style={styles.actionTop}>
        <View style={{ flex: 1, gap: 4 }}>
          {garageFrei ? (
            <>
              <BigNumber value={`${total}`} unit={`von ${maxTotal} Stufen`} size={28} />
              <Bar pct={total / maxTotal} color={tiles.teal.accent} track="rgba(15,42,46,0.1)" />
              <Text style={type.small}>{upgradable ? '⬆ Aufrüsten möglich!' : 'Ausrüstung ansehen'}</Text>
            </>
          ) : (
            <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
          )}
        </View>
        {helfer ? <Car level={levelOf(progress, 'auto')} width={80} /> : <Ambulance level={levelOf(progress, 'rtw')} width={84} />}
      </View>
    </Tile>
  );

  const ausbau = (
    <Tile size="md" tint="slate" onPress={garageFrei ? onWache : undefined} disabled={!garageFrei} accessibilityLabel={helfer ? 'Mein Hilfspunkt' : 'Meine Rettungswache'}>
      <TileLabel icon={helfer ? '💚' : '🏥'} text={helfer ? 'Mein Hilfspunkt' : 'Meine Rettungswache'} tint="green" />
      {garageFrei ? (
        <>
          <BigNumber value={`${ausbauStufen}`} unit={`von ${ausbauMax} Stufen`} size={28} />
          <Bar pct={ausbauStufen / ausbauMax} color={tiles.green.accent} track="rgba(15,42,46,0.1)" />
          <Text style={type.small}>{helfer ? 'Apotheke, Defi, Kursraum …' : 'Halle, Funk, Lager, Ruheraum …'} ausbauen</Text>
        </>
      ) : (
        <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
      )}
    </Tile>
  );

  const badgeList = badgesFuerRolle();
  const profile = (
    <Tile size="lg" tint="slate">
      <TileLabel icon="🏅" text="Mein Rang" tint="amber" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <Ring pct={rankPct} size={92} stroke={9} color={tiles.amber.accent}>
          <RankBadge size={52} level={rankList().indexOf(rank)} />
        </Ring>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={type.h2}>{rank.de}</Text>
          <Text style={type.small}>
            {next ? `Noch ${(next.min - progress.totalPoints).toLocaleString('de-DE')} Punkte bis ${next.de}` : 'Höchster Rang erreicht'}
          </Text>
        </View>
      </View>
      <View style={styles.medalRow}>
        {badgeList.slice(0, 12).map((bd) => {
          const has = progress.badges.includes(bd.id);
          return (
            <View key={bd.id} style={[styles.medal, has ? { backgroundColor: tiles.amber.bg, borderColor: tiles.amber.edge } : null]}>
              <Text style={[styles.medalIcon, !has && { opacity: 0.25 }]}>{bd.icon}</Text>
            </View>
          );
        })}
      </View>
      <Text style={type.small}>
        {progress.badges.length} von {badgeList.length} Abzeichen
      </Text>
    </Tile>
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
      <BentoGrid>
        {hero}
        {stats}
        {story}
        {action}
        {today}
        {training}
        <BentoTitle>Ausbau</BentoTitle>
        {welt}
        {vehicle}
        {ausbau}
        {profile}
      </BentoGrid>
      <Text style={styles.note}>Lernspiel – ersetzt keinen Erste-Hilfe-Kurs und keine Ausbildung. Im Notfall: 112.</Text>
    </ScrollView>
  );
}

function RingStat({ pct, color, center, label, sub }: { pct: number; color: string; center: string; label: string; sub: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Ring pct={pct} size={78} stroke={9} color={color}>
        <Text style={styles.ringText}>{center}</Text>
      </Ring>
      <Text style={[styles.ringLabel, { color }]}>{label}</Text>
      <Text style={type.small} numberOfLines={1}>
        {sub}
      </Text>
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
  mini: { gap: 2, paddingHorizontal: 12, paddingVertical: 14, minHeight: 104 },
  miniIcon: { fontSize: 18, fontFamily: fonts.regular },
  miniLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.4 },
  rings: { flexDirection: 'row', gap: 6, marginTop: 4 },
  ringLabel: { fontFamily: fonts.display, fontSize: 14 },
  medalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  medal: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(15,42,46,0.06)', borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  medalIcon: { fontSize: 20, fontFamily: fonts.regular },
  modusChip: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.08)' },
  modusText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.onDark },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  storyTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  storyText: { ...type.body, color: colors.inkSoft },
  goal: { borderRadius: 16, padding: spacing.md, gap: 4, backgroundColor: 'rgba(255,255,255,0.6)' },
  goalLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 0.3, textTransform: 'uppercase' },
  actionTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  streak: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.ink },
  ringText: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.ink },
  go: { fontFamily: fonts.semibold, fontSize: 14, marginTop: 4 },
  trainTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  trainSub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.muted },
  lock: { fontSize: 14, fontFamily: fonts.regular },
  listIconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  listIcon: { fontSize: 22, textAlign: 'center', fontFamily: fonts.regular },
  locked: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: spacing.md },
  lockedText: { ...type.small, color: colors.inkSoft },
  note: { ...type.small, textAlign: 'center', marginTop: spacing.lg },
});
