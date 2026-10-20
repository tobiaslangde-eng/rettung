import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { Car } from '../components/Car';
import { RankBadge } from '../components/Ems';
import { KatiAvatar } from '../components/Kati';
import { BentoGrid, BentoTitle, BigNumber, ChapterPath, Ring, Tile, TileLabel } from '../components/Bento';
import { Bar, Button, Segmented, Tap } from '../components/UI';
import { badgesFuerRolle } from '../game/achievements';
import { DAILY_GOAL, dayState } from '../game/daily';
import { DIFFICULTIES, DIFFICULTY_BY_ID, Difficulty } from '../game/difficulty';
import { MAX_LEVEL, ausruestung, coins, levelOf, totalLevel, upgradeBlock } from '../game/equipment';
import { HILF_GESAMT_MAX, hilfGesamt } from '../game/hilfspunkt';
import { WACHE_GESAMT_MAX, wacheGesamt } from '../game/wache';
import { useRolle } from '../game/rolle';
import { urkundenFuer } from '../game/urkunden';
import { spickFrei, spickFuer } from '../game/spickzettel';
import { SERIE_MEILENSTEINE, naechsterMeilenstein } from '../game/serie';
import { levelFuer } from '../game/level';
import { rankFor, rankList } from '../game/scoring';
import { KAPITEL, KAPITEL_BONUS, StoryAktion, aktuellesKapitel, freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { TrainingId, trainingsFuer } from '../game/trainings';
import { useLayout, useSidebar } from '../layout';
import { TileTint, colors, fonts, spacing, tiles, type } from '../theme';

const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

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
  onKarte,
  onUrkunden,
  onSpick,
  onLive,
  onSchicht,
  onFeedback,
  onAlleTrainings,
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
  /** Stadtkarte öffnen */
  onKarte: () => void;
  /** Urkunden öffnen */
  onUrkunden: () => void;
  /** Spickzettel öffnen */
  onSpick: () => void;
  /** Duell mit Freunden */
  onLive: () => void;
  /** Schichtmodus */
  onSchicht: () => void;
  /** Rückmeldung geben */
  onFeedback: () => void;
  /** Training-Tab öffnen */
  onAlleTrainings: () => void;
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

  const lv = levelFuer(progress.totalPoints);
  const autoStufe = totalLevel(progress);
  const autoMax = ausruestung().length * MAX_LEVEL;
  const upgradable = ausruestung().some((e) => upgradeBlock(progress, e.id) === null);

  const status = (
    <Tile size="lg" tint="ink" paper ecgOpacity={0} style={{ gap: 12 }}>
      <View style={styles.heroTop}>
        <Ring pct={lv.pct} size={78} stroke={8} color={colors.yellow} track="rgba(255,255,255,0.18)">
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.lvLabel}>LEVEL</Text>
            <Text style={styles.lvZahl}>{lv.level}</Text>
          </View>
        </Ring>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type.eyebrow, { color: colors.onDarkSoft }]}>
            {WOCHENTAGE[now.getDay()]}, {now.getDate()}. {MONATE[now.getMonth()]}
          </Text>
          <Text style={[type.title, { color: colors.white }]}>{heroTitle}</Text>
          <Text style={[type.small, { color: helfer ? '#5EEAD4' : '#FF9C98' }]}>
            {r.icon} {rank.de}
          </Text>
        </View>
      </View>
      <Text style={styles.epZeile}>
        {progress.totalPoints.toLocaleString('de-DE')} EP · noch {lv.fehlt.toLocaleString('de-DE')} EP bis Level {lv.level + 1}
      </Text>
      <View style={styles.heroStats}>
        <HeroStat icon="🪙" value={coins(progress.budget)} label="Coins" />
        <HeroStat icon="🔥" value={`${day.streak}`} label="Serie" />
        <Tap onPress={garageFrei ? onGarage : undefined} disabled={!garageFrei} accessibilityLabel={r.fahrzeug} style={{ flex: 1 }}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue} numberOfLines={1}>
              {helfer ? '🚗' : '🚑'} {autoStufe}/{autoMax}
            </Text>
            <Text style={styles.heroStatLabel} numberOfLines={1}>
              {upgradable ? '⬆ Upgrade' : helfer ? 'Auto' : 'RTW'}
            </Text>
          </View>
        </Tap>
      </View>
    </Tile>
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
          <Text style={[styles.goalLabel, { color: tiles.violet.accent }]}>
            {kap.erfuellt ? '✓ Aufgabe erfüllt' : 'Deine Aufgabe'}
          </Text>
          <Text style={type.body}>{kap.kapitel.ziel}</Text>
          {kap.kapitel.aktion !== 'rolle' && (
            <Bar
              pct={kap.kapitel.stand(progress)}
              color={tiles.violet.accent}
              track={colors.track}
              style={{ marginTop: 4 }}
            />
          )}
        </View>
        {kap.erfuellt && kap.kapitel.aktion !== 'rolle' ? (
          <Button label={`Kapitel abschließen · +${KAPITEL_BONUS} EP`} onPress={onStoryDone} />
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
        <Text style={type.body}>Du bist ein echtes Vorbild. Spiel weiter, sammle EP und vervollständige dein Archiv.</Text>
      </Tile>
    );

  const heute = (
    <Tile size="lg" tint={helferTint} style={{ gap: 10 }}>
      <View style={styles.actionTop}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type.eyebrow, { color: tiles[helferTint].accent }]}>Heute dran</Text>
          <Text style={type.h2}>{helfer ? 'Notfall im Alltag' : 'Rettungsdienst-Einsatz'}</Text>
          <Text style={type.small}>
            {helfer ? 'Prüfen, erkennen, richtig handeln.' : 'Untersuchen, Werte messen, richtig handeln.'}
          </Text>
        </View>
        {helfer ? (
          <Car level={levelOf(progress, 'auto')} width={88} />
        ) : (
          <Ambulance level={levelOf(progress, 'rtw')} width={92} />
        )}
      </View>
      {einsatzFrei && (
        <View style={{ gap: 4 }}>
          <View style={styles.zielZeile}>
            <Text style={[type.small, { color: colors.ink, fontFamily: fonts.semibold }]}>
              Tagesziel: {Math.min(day.cases, DAILY_GOAL)} von {DAILY_GOAL} {helfer ? 'Notfällen' : 'Einsätzen'}
            </Text>
            <Text style={[type.small, { color: tiles[helferTint].accent, fontFamily: fonts.bold }]}>🔥 {day.streak}</Text>
          </View>
          <Bar pct={day.cases / DAILY_GOAL} color={tiles[helferTint].accent} track={colors.track} />
        </View>
      )}
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
          <Button label={helfer ? '▶ Jetzt spielen' : '▶ Einsatz starten'} onPress={onStart} />
          {!day.dailyCaseDone && (
            <Tap onPress={onDaily} accessibilityLabel={`${r.einsatz} des Tages`} style={styles.tagesLink}>
              <Text style={styles.tagesLinkText}>⭐ {r.einsatz} des Tages · +50 % EP ›</Text>
            </Tap>
          )}
          <Tap onPress={onModus} accessibilityLabel="Spielweise ändern" style={{ alignSelf: 'flex-start' }}>
            <Text style={styles.modusText}>
              {progress.modus === 'frei' ? '🧭 Frei spielen' : '📖 Mit Geschichte'} · ändern ›
            </Text>
          </Tap>
        </>
      ) : (
        <Locked kapitel={freiAb(r.id, 'einsatz')} />
      )}
    </Tile>
  );

  const alleTrainings = trainingsFuer(r.id, progress);
  const empfohlen = [
    ...alleTrainings.filter((t) => istFrei(r.id, progress, t.id) && !t.stand),
    ...alleTrainings.filter((t) => istFrei(r.id, progress, t.id) && t.stand),
  ].slice(0, L.wide ? 4 : 2);
  const training = (
    <>
      <BentoTitle
        right={
          <Tap onPress={onAlleTrainings} accessibilityLabel="Alle Trainings">
            <Text style={styles.alle}>Alle {alleTrainings.length} ›</Text>
          </Tap>
        }
      >
        Für dich zum Üben
      </BentoTitle>
      {empfohlen.map((t) => (
        <Tile
          key={t.id}
          size="sm"
          bg={t.farbe}
          onPress={() => onTraining(t.id)}
          accessibilityLabel={t.title}
          style={{ minHeight: 132, justifyContent: 'space-between' }}
        >
          <View style={styles.trainTop}>
            <View style={[styles.listIconBox, { backgroundColor: colors.track }]}>
              <Text style={styles.listIcon}>{t.icon}</Text>
            </View>
            {!t.stand && <Text style={styles.neu}>NEU</Text>}
          </View>
          <View style={{ gap: 2 }}>
            <Text style={[type.headline, { fontSize: 13.5, letterSpacing: -0.3 }]} numberOfLines={2}>
              {t.title}
            </Text>
            <Text style={styles.trainSub} numberOfLines={2}>
              {t.stand ?? t.sub}
            </Text>
          </View>
        </Tile>
      ))}
    </>
  );

  const ausbauStufen = helfer ? hilfGesamt(progress) : wacheGesamt(progress);
  const ausbauMax = helfer ? HILF_GESAMT_MAX : WACHE_GESAMT_MAX;

  const spickListe = spickFuer(r.id);
  const spickFreie = spickListe.filter((x) => spickFrei(r.id, progress, x));
  const spickNeu = spickFreie.filter((x) => !progress.spickGesehen.includes(x.id)).length;
  const urkundenListe = urkundenFuer(r.id);
  const urkundenErreicht = urkundenListe.filter((u) => u.erreicht(progress)).length;
  const kartenFrei = istFrei(r.id, progress, 'einsatz');

  const schnell = (
    <Tile size="lg" tint="slate" style={{ paddingVertical: 14, paddingHorizontal: 8 }}>
      <View style={styles.schnellReihe}>
        <Schnell icon="🗺️" tint="blue" label="Karte" sub={`${progress.kartenEinsaetze} gefahren`} name="Stadtkarte" locked={!kartenFrei} onPress={onKarte} />
        <Schnell
          icon="⏱️"
          tint="teal"
          label={helfer ? 'Dienst' : 'Schicht'}
          sub={`${progress.schichten} geschafft`}
          name={helfer ? 'Bereitschaftsdienst' : 'Schicht'}
          locked={!kartenFrei}
          onPress={onSchicht}
        />
        <Schnell icon="👥" tint="violet" label="Live" sub={`${progress.liveGespielt} Runden`} name="Live-Runde mit Freunden" onPress={onLive} />
        <Schnell
          icon="📌"
          tint="amber"
          label="Spickzettel"
          sub={spickNeu > 0 ? `${spickNeu} neu` : `${spickFreie.length} frei`}
          name="Spickzettel"
          badge={spickNeu > 0}
          onPress={onSpick}
        />
        <Schnell icon="📜" tint="pink" label="Urkunden" sub={`${urkundenErreicht}/${urkundenListe.length}`} name="Urkunden" onPress={onUrkunden} />
      </View>
    </Tile>
  );

  const feedback =
    progress.casesPlayed >= 3 && !progress.feedbackGegeben ? (
      <Tile size="lg" tint="amber" onPress={onFeedback} accessibilityLabel="Rückmeldung geben">
        <TileLabel icon="💬" text="Wie gefällt dir das Spiel?" tint="amber" />
        <Text style={type.body}>Zwei kurze Fragen, ganz ohne Namen – das hilft, das Spiel besser zu machen.</Text>
      </Tile>
    ) : null;

  const ausbau = (
    <Tile
      size="md"
      tint="slate"
      onPress={garageFrei ? onWache : undefined}
      disabled={!garageFrei}
      accessibilityLabel={helfer ? 'Mein Hilfspunkt' : 'Meine Rettungswache'}
    >
      <TileLabel icon={helfer ? '💚' : '🏥'} text={helfer ? 'Mein Hilfspunkt' : 'Meine Rettungswache'} tint="green" />
      {garageFrei ? (
        <>
          <BigNumber value={`${ausbauStufen}`} unit={`von ${ausbauMax} Stufen`} size={28} />
          <Bar pct={ausbauStufen / ausbauMax} color={tiles.green.accent} track={colors.track} />
          <Text style={type.small}>{helfer ? 'Apotheke, Defi, Kursraum …' : 'Halle, Funk, Lager, Ruheraum …'} ausbauen</Text>
        </>
      ) : (
        <Text style={type.small}>Wird in Kapitel {freiAb(r.id, 'garage')} freigeschaltet</Text>
      )}
    </Tile>
  );

  const serieTage = day.streak;
  const naechster = naechsterMeilenstein(serieTage);
  const serie = (
    <Tile size="md" tint="pink" accessibilityLabel="Tagesserie">
      <TileLabel icon="🔥" text="Tagesserie" tint="pink" />
      <BigNumber value={`${serieTage}`} unit={serieTage === 1 ? 'Tag in Folge' : 'Tage in Folge'} size={30} />
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {SERIE_MEILENSTEINE.map((m) => {
          const ok = progress.bestDayStreak >= m.tage;
          return (
            <View key={m.tage} style={[styles.serieChip, ok && { backgroundColor: tiles.pink.accent }]}>
              <Text style={[styles.serieChipText, ok && { color: '#fff' }]}>
                {m.tage} T · +{m.punkte}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={type.small}>
        {naechster ? `Noch ${naechster.tage - serieTage} Tage bis +${naechster.punkte} EP` : 'Alle Serien-Belohnungen geholt'}
      </Text>
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
            {next
              ? `Noch ${(next.min - progress.totalPoints).toLocaleString('de-DE')} EP bis ${next.de}`
              : 'Höchster Rang erreicht'}
          </Text>
        </View>
      </View>
      <View style={styles.medalRow}>
        {badgeList.slice(0, 12).map((bd) => {
          const has = progress.badges.includes(bd.id);
          return (
            <View
              key={bd.id}
              style={[styles.medal, has ? { backgroundColor: tiles.amber.bg, borderColor: tiles.amber.edge } : null]}
            >
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
        {status}
        {heute}
        {story}
        {schnell}
        {serie}
        {ausbau}
        {training}
        {profile}
        {feedback}
      </BentoGrid>
      <Text style={styles.note}>Lernspiel – ersetzt keinen Erste-Hilfe-Kurs und keine Ausbildung. Im Notfall: 112.</Text>
    </ScrollView>
  );
}

function HeroStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.heroStatLabel} numberOfLines={1}>
        {icon} {label}
      </Text>
    </View>
  );
}

/** Kleine Abkürzung zu einem Bereich (Stadtkarte, Schicht, Duell, Spickzettel, Urkunden) */
function Schnell({
  icon,
  tint,
  label,
  sub,
  name,
  locked,
  badge,
  onPress,
}: {
  icon: string;
  tint: TileTint;
  label: string;
  sub: string;
  name: string;
  locked?: boolean;
  badge?: boolean;
  onPress: () => void;
}) {
  const t = tiles[tint];
  return (
    <Tap onPress={locked ? undefined : onPress} disabled={locked} accessibilityLabel={name} style={styles.schnell}>
      <View style={[styles.schnellIcon, { backgroundColor: t.bg, borderColor: t.edge }, locked && { opacity: 0.5 }]}>
        <Text style={styles.schnellEmoji}>{locked ? '🔒' : icon}</Text>
        {badge && <View style={[styles.schnellPunkt, { backgroundColor: colors.red, borderColor: colors.surface }]} />}
      </View>
      <Text style={[styles.schnellLabel, locked && { color: colors.muted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.schnellSub} numberOfLines={1}>
        {locked ? 'gesperrt' : sub}
      </Text>
    </Tap>
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
  lvLabel: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2, color: colors.onDarkSoft },
  lvZahl: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 30, color: '#FFFFFF', letterSpacing: -1 },
  epZeile: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.onDark },
  zielZeile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagesLink: { alignSelf: 'stretch', paddingVertical: 10, borderRadius: 14, backgroundColor: colors.veil, alignItems: 'center' },
  tagesLinkText: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  heroStats: { flexDirection: 'row', gap: 8 },
  heroStat: {
    flex: 1,
    gap: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroStatValue: { fontFamily: fonts.displayBlack, fontSize: 18, lineHeight: 22, color: '#FFFFFF', letterSpacing: -0.5 },
  heroStatLabel: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.onDarkSoft, letterSpacing: 0.3 },
  schnellReihe: { flexDirection: 'row', justifyContent: 'space-between' },
  schnell: { flex: 1, alignItems: 'center', gap: 3 },
  schnellIcon: { width: 50, height: 50, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  schnellEmoji: { fontSize: 24, fontFamily: fonts.regular },
  schnellPunkt: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  schnellLabel: { fontFamily: fonts.bold, fontSize: 11.5, color: colors.ink, marginTop: 2 },
  schnellSub: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted },
  alle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.tuerkis },
  neu: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: 0.8, color: colors.onBright, backgroundColor: colors.yellow, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
  serieChip: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, backgroundColor: colors.veil },
  serieChipText: { fontFamily: fonts.semibold, fontSize: 11, color: tiles.pink.accent },
  mini: { gap: 2, paddingHorizontal: 12, paddingVertical: 14, minHeight: 104 },
  miniIcon: { fontSize: 18, fontFamily: fonts.regular },
  miniLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.4 },
  rings: { flexDirection: 'row', gap: 6, marginTop: 4 },
  ringLabel: { fontFamily: fonts.display, fontSize: 14 },
  medalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  medal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.veilFaint,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalIcon: { fontSize: 20, fontFamily: fonts.regular },
  modusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modusText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.onDark },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  contentWide: { padding: spacing.xl, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  storyTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  storyText: { ...type.body, color: colors.inkSoft },
  goal: { borderRadius: 16, padding: spacing.md, gap: 4, backgroundColor: colors.veilSoft },
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
  locked: { backgroundColor: colors.veilSoft, borderRadius: 12, padding: spacing.md },
  lockedText: { ...type.small, color: colors.inkSoft },
  note: { ...type.small, textAlign: 'center', marginTop: spacing.lg },
});
