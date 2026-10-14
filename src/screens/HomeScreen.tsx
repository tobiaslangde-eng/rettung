import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Ambulance } from '../components/Ambulance';
import { RankBadge } from '../components/Ems';
import { Card, IconTile, Pill, Ring, SectionTitle, Segmented } from '../components/UI';
import { CASES } from '../data/cases';
import { BADGES } from '../game/achievements';
import { DAILY_GOAL, dailyCase, dailyGoalBonus, dayState } from '../game/daily';
import { DIFFICULTIES, Difficulty } from '../game/difficulty';
import { EQUIPMENT, MAX_LEVEL, euro, levelOf, totalLevel, upgradeBlock } from '../game/equipment';
import { archiveCount, detectiveGrade } from '../game/detective';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { weekView } from '../game/weekly';
import { Columns, useLayout } from '../layout';
import { colors, fonts, radius, shadow, spacing, type } from '../theme';

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS = [
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

export type TrainingId = 'detektiv' | 'manv' | 'cpr' | 'wissen' | 'quiz';

/** Die vier Trainings – gemeinsam genutzt von Startseite und Training-Tab */
export function trainings(progress: Progress) {
  return [
    {
      id: 'detektiv' as TrainingId,
      icon: '🔍',
      color: colors.indigo,
      title: 'Detektiv-Akten',
      sub: 'Der Diagnose-Krimi: Hinweise aufdecken, Fall lösen',
      best: progress.detectiveBest > 0 ? `Bestwert ${progress.detectiveBest}` : undefined,
    },
    {
      id: 'manv' as TrainingId,
      icon: '🚨',
      color: colors.leuchtorange,
      title: 'Großeinsatz',
      sub: '8 Verletzte richtig sichten',
      best: progress.manvBest > 0 ? `Bestwert ${progress.manvBest}/8` : undefined,
    },
    {
      id: 'cpr' as TrainingId,
      icon: '❤️',
      color: colors.pink,
      title: 'Herzdruckmassage',
      sub: 'Im Takt 100–120 pro Minute',
      best: progress.cprBest > 0 ? `Bestwert ${progress.cprBest} %` : undefined,
    },
    {
      id: 'wissen' as TrainingId,
      icon: '🧠',
      color: colors.tuerkis,
      title: 'Wissensfragen',
      sub: '10 Fragen aus dem Einsatzalltag',
      best: progress.knowBest > 0 ? `Bestwert ${progress.knowBest}/10` : undefined,
    },
    {
      id: 'quiz' as TrainingId,
      icon: '📈',
      color: colors.gruen,
      title: 'Normwerte',
      sub: '10 Messwerte schnell einschätzen',
      best: progress.quizBest > 0 ? `Bestwert ${progress.quizBest}/10` : undefined,
    },
  ];
}

export function HomeScreen({
  progress,
  onStart,
  onDaily,
  onDifficulty,
  onTraining,
  onGarage,
}: {
  progress: Progress;
  onStart: () => void;
  onDaily: () => void;
  onDifficulty: (d: Difficulty) => void;
  onTraining: (t: TrainingId) => void;
  onGarage: () => void;
}) {
  const L = useLayout();
  const now = new Date();
  const canUpgrade = EQUIPMENT.some((e) => upgradeBlock(progress, e.id) === null);
  const week = weekView(progress);
  const day = dayState(progress);
  const todays = dailyCase(progress);
  const { rank, next } = rankFor(progress.totalPoints);
  const rankPct = next ? Math.min(1, (progress.totalPoints - rank.min) / (next.min - rank.min)) : 1;
  const weekGoal = Math.max(300, week.best);
  const mastered = CASES.filter((c) => (progress.bestStars[c.id] ?? 0) >= 3).length;
  const current = DIFFICULTIES.find((d) => d.id === progress.difficulty) ?? DIFFICULTIES[0];
  const rtwLevel = levelOf(progress, 'rtw');
  const upgrades = totalLevel(progress);
  const maxUpgrades = EQUIPMENT.length * MAX_LEVEL;

  const header = (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.date}>
          {WEEKDAYS[now.getDay()]}, {now.getDate()}. {MONTHS[now.getMonth()]}
        </Text>
        <Text style={type.largeTitle}>Einsatz 112</Text>
      </View>
      {progress.streak >= 2 && <Pill label={`🔥 ${progress.streak}`} color={colors.leuchtorange} light />}
      <RankBadge size={44} level={RANKS.indexOf(rank)} />
    </View>
  );

  const hero = (
    <View style={styles.hero}>
      <Svg style={StyleSheet.absoluteFill as object} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF5E3A" />
            <Stop offset="1" stopColor="#E0162B" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#heroBg)" />
      </Svg>
      <View style={styles.heroTop}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.ready}>
            <View style={styles.readyDot} />
            <Text style={styles.readyText}>Einsatzbereit</Text>
          </View>
          <Text style={styles.heroTitle}>Bereit für deine Schicht?</Text>
          <Text style={styles.heroSub}>Patient untersuchen, Werte messen, richtig handeln.</Text>
        </View>
      </View>
      <View style={styles.heroCar}>
        <Ambulance level={rtwLevel} width={L.wide ? 230 : 200} />
      </View>
      <Pressable
        onPress={onStart}
        accessibilityRole="button"
        style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        <Text style={styles.heroBtnText}>Schicht beginnen</Text>
      </Pressable>
    </View>
  );

  const difficulty = (
    <View style={{ gap: spacing.sm }}>
      <Segmented
        options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
        value={progress.difficulty}
        onChange={onDifficulty}
      />
      <Text style={[type.small, { paddingHorizontal: spacing.xs }]}>{current.description}</Text>
    </View>
  );

  const rings = (
    <Card style={{ gap: spacing.lg }}>
      <View style={styles.ringsRow}>
        <View style={styles.ringsBox}>
          <Ring size={124} stroke={14} pct={Math.min(day.cases, DAILY_GOAL) / DAILY_GOAL} color={colors.signalrot} />
          <View style={{ position: 'absolute', left: 16, top: 16 }}>
            <Ring size={92} stroke={14} pct={week.current / weekGoal} color={colors.gruen} />
          </View>
          <View style={{ position: 'absolute', left: 32, top: 32 }}>
            <Ring size={60} stroke={14} pct={rankPct} color={colors.blaulicht} />
          </View>
        </View>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Legend
            color={colors.signalrot}
            title="Tagesziel"
            value={`${Math.min(day.cases, DAILY_GOAL)}/${DAILY_GOAL} Einsätze`}
          />
          <Legend color={colors.gruen} title="Diese Woche" value={`${week.current}/${weekGoal} Punkte`} />
          <Legend
            color={colors.blaulicht}
            title="Nächster Dienstgrad"
            value={next ? `noch ${next.min - progress.totalPoints} Punkte` : 'Höchster Rang!'}
          />
        </View>
      </View>
      <Text style={type.small}>
        {day.goalDone
          ? `✓ Tagesziel erreicht${day.streak > 1 ? ` – ${day.streak} Tage in Folge` : ''}. Stark!`
          : `Schaffe ${DAILY_GOAL} Einsätze für +${dailyGoalBonus(day.streak + 1)} Bonuspunkte${day.streak > 0 ? ` (Serie: ${day.streak} ${day.streak === 1 ? 'Tag' : 'Tage'})` : ''}.`}
      </Text>
      <Pressable
        onPress={onDaily}
        disabled={day.dailyCaseDone}
        accessibilityRole="button"
        style={({ pressed }) => [styles.daily, pressed && { opacity: 0.7 }]}
      >
        <IconTile icon={day.dailyCaseDone ? '✅' : '⭐'} color={day.dailyCaseDone ? colors.grau200 : '#FFE9A8'} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={[type.headline, day.dailyCaseDone && { color: colors.grau500 }]}>Einsatz des Tages</Text>
          <Text style={type.small}>
            {day.dailyCaseDone ? 'Erledigt – morgen wartet ein neuer' : `${todays.location.split(',')[0]} · +50 % Punkte`}
          </Text>
        </View>
        {!day.dailyCaseDone && <Pill label="Los" color={colors.blaulicht} />}
      </Pressable>
    </Card>
  );

  const rankCard = (
    <Card style={styles.rankCard}>
      <RankBadge size={64} level={RANKS.indexOf(rank)} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={type.small}>Dein Dienstgrad</Text>
        <Text style={type.h2}>{rank.de}</Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${rankPct * 100}%` }]} />
        </View>
        <Text style={type.small}>{progress.totalPoints.toLocaleString('de-DE')} Punkte</Text>
      </View>
    </Card>
  );

  const stats = (
    <View style={styles.stats}>
      <Stat value={progress.casesPlayed} label="Einsätze" />
      <Stat value={progress.correctDiagnoses} label="Diagnosen" />
      <Stat value={`${mastered}/${CASES.length}`} label="Gemeistert" />
    </View>
  );

  const weekCard = (
    <Card style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.lg }}>
        <View style={{ flex: 1 }}>
          <Text style={type.small}>Diese Woche</Text>
          <Text style={styles.big}>
            {week.current} <Text style={styles.bigUnit}>Punkte</Text>
          </Text>
          <Text style={type.small}>
            {week.best === 0
              ? 'Stell deinen ersten Rekord auf!'
              : week.current > week.best
                ? `🏆 Neuer Rekord (vorher ${week.best})`
                : `Rekord: ${week.best}`}
          </Text>
        </View>
        <View style={styles.bars}>
          {week.bars.map((b, i) => {
            const isNow = i === week.bars.length - 1;
            const max = Math.max(1, week.best, ...week.bars.map((x) => x.points));
            return (
              <View key={b.week} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.weekBar,
                      { height: `${Math.max(6, (b.points / max) * 100)}%` },
                      isNow && { backgroundColor: colors.gruen },
                      b.points === 0 && { backgroundColor: colors.grau200 },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isNow && { color: colors.gruen }]}>{b.week.slice(6)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );

  const trainingGrid = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle title="Training" />
      <DetectiveTeaser progress={progress} onPress={() => onTraining('detektiv')} />
      <View style={styles.grid}>
        {trainings(progress)
          .filter((t) => t.id !== 'detektiv')
          .map((t) => (
            <Pressable
              key={t.id}
              onPress={() => onTraining(t.id)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
            >
              <IconTile icon={t.icon} color={t.color} size={44} />
              <Text style={[type.headline, { marginTop: spacing.sm }]} numberOfLines={2}>
                {t.title.replace('Herzdruckmassage', 'Herzdruck\u00ADmassage')}
              </Text>
              <Text style={type.small} numberOfLines={2}>
                {t.best ?? t.sub}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );

  const garage = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle title="Mein Rettungswagen" />
      <Pressable
        onPress={onGarage}
        accessibilityRole="button"
        style={({ pressed }) => [styles.garage, pressed && { opacity: 0.92 }]}
      >
        <View style={{ alignItems: 'center', paddingTop: spacing.sm }}>
          <Ambulance level={rtwLevel} width={240} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[type.headline, { color: colors.weiss }]}>
              Ausbau {upgrades}/{maxUpgrades}
            </Text>
            <View style={[styles.bar, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <View style={[styles.barFill, { width: `${(upgrades / maxUpgrades) * 100}%`, backgroundColor: colors.warngelb }]} />
            </View>
            <Text style={[type.small, { color: '#AEAEB2' }]}>Budget {euro(progress.budget)}</Text>
          </View>
          {canUpgrade ? <Pill label="Aufrüsten" color={colors.gruen} /> : <Pill label="Ansehen" color="#3A3A3C" />}
        </View>
      </Pressable>
    </View>
  );

  const badges = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle
        title="Abzeichen"
        right={
          <Text style={type.small}>
            {progress.badges.length} von {BADGES.length}
          </Text>
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badges}>
        {[...BADGES]
          .sort((a, b) => Number(progress.badges.includes(b.id)) - Number(progress.badges.includes(a.id)))
          .map((b) => {
            const has = progress.badges.includes(b.id);
            return (
              <View key={b.id} style={styles.badge}>
                <View style={[styles.badgeCircle, !has && styles.badgeLocked]}>
                  <Text style={[styles.badgeIcon, !has && { opacity: 0.3 }]}>{has ? b.icon : '🔒'}</Text>
                </View>
                <Text style={[styles.badgeTitle, !has && { color: colors.grau500 }]} numberOfLines={2}>
                  {b.title}
                </Text>
                <Text style={styles.badgeDesc} numberOfLines={3}>
                  {b.description}
                </Text>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );

  const note = (
    <Text style={[type.small, { textAlign: 'center', marginTop: spacing.sm }]}>
      Lernspiel – ersetzt keine Ausbildung und keine ärztliche Beratung.{'\n'}Im echten Notfall immer: 112.
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={[styles.body, L.wide && styles.bodyWide]}>
      {header}
      {L.desktop ? (
        <Columns
          wide
          weights={[1.1, 1, 1]}
          cols={[
            <>
              {hero}
              {difficulty}
            </>,
            <>
              {rings}
              {rankCard}
              {stats}
            </>,
            <>
              {weekCard}
              {trainingGrid}
            </>,
          ]}
        />
      ) : L.wide ? (
        <Columns
          wide
          cols={[
            <>
              {hero}
              {difficulty}
              {rankCard}
              {stats}
            </>,
            <>
              {rings}
              {weekCard}
            </>,
          ]}
        />
      ) : (
        <>
          {hero}
          {difficulty}
          {rings}
          {rankCard}
          {stats}
          {weekCard}
        </>
      )}
      {L.desktop ? (
        <Columns wide weights={[1, 2]} cols={[garage, badges]} />
      ) : (
        <>
          {!L.wide ? trainingGrid : <Columns wide cols={[trainingGrid, garage]} />}
          {!L.wide && garage}
          {badges}
        </>
      )}
      {note}
    </ScrollView>
  );
}

/** Hervorgehobene Karte für die Detektiv-Akten (Startseite und Training) */
export function DetectiveTeaser({ progress, onPress }: { progress: Progress; onPress: () => void }) {
  const arch = archiveCount(progress);
  const { grade } = detectiveGrade(progress);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Detektiv-Akten"
      style={({ pressed }) => [styles.detective, pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 }]}
    >
      <Svg style={StyleSheet.absoluteFill as object} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="detBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#1E2A55" />
            <Stop offset="1" stopColor="#3A1F5C" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#detBg)" />
      </Svg>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Text style={{ fontSize: 40, lineHeight: 48 }}>🔍</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Text style={styles.detTitle}>Detektiv-Akten</Text>
            {arch.solved === 0 && <Pill label="Neu" color={colors.signalrot} />}
          </View>
          <Text style={styles.detSub}>Der Diagnose-Krimi – je weniger Hinweise, desto mehr Punkte</Text>
        </View>
      </View>
      <View style={styles.detFoot}>
        <Text style={styles.detMeta}>
          {grade.icon} {grade.title} · Archiv {arch.solved}/{arch.total}
        </Text>
        <View style={styles.detBtn}>
          <Text style={styles.detBtnText}>Ermitteln</Text>
        </View>
      </View>
    </Pressable>
  );
}

function Legend({ color, title, value }: { color: string; title: string; value: string }) {
  return (
    <View>
      <Text style={[styles.legendTitle, { color }]}>{title}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={type.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  bodyWide: { padding: spacing.xl, gap: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.xs },
  date: { ...type.eyebrow, marginBottom: 2 },
  hero: { borderRadius: radius.lg, overflow: 'hidden', padding: spacing.xl, gap: spacing.md, ...shadow },
  heroTop: { flexDirection: 'row' },
  ready: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  readyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#B6FFC9' },
  readyText: { color: colors.weiss, fontFamily: fonts.semibold, fontSize: 12 },
  heroTitle: { color: colors.weiss, fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 33, letterSpacing: -0.6 },
  heroSub: { color: 'rgba(255,255,255,0.88)', fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  heroCar: { alignItems: 'center', marginVertical: -spacing.xs },
  heroBtn: { backgroundColor: colors.weiss, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  heroBtnText: { color: '#E0162B', fontFamily: fonts.bold, fontSize: 17, letterSpacing: -0.2 },
  ringsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  ringsBox: { width: 124, height: 124 },
  legendTitle: { fontFamily: fonts.semibold, fontSize: 13 },
  legendValue: { fontFamily: fonts.bold, fontSize: 17, color: colors.graphit, letterSpacing: -0.3 },
  daily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grau300,
    paddingTop: spacing.md,
  },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  bar: { height: 6, backgroundColor: colors.grau200, marginVertical: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.blaulicht, borderRadius: 3 },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.weiss,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  statValue: { fontFamily: fonts.extrabold, fontSize: 24, color: colors.graphit, letterSpacing: -0.5 },
  big: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.graphit, letterSpacing: -0.8 },
  bigUnit: { fontSize: 15, fontFamily: fonts.medium, color: colors.grau500, letterSpacing: 0 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, width: 128 },
  barCol: { flex: 1, alignItems: 'center', gap: 3 },
  barTrack: { height: 64, width: '100%', justifyContent: 'flex-end' },
  weekBar: { width: '100%', backgroundColor: colors.grau300, borderRadius: 4 },
  barLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.grau500 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.weiss,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow,
  },
  detective: { borderRadius: radius.lg, overflow: 'hidden', padding: spacing.lg, gap: spacing.md, ...shadow },
  detTitle: { color: colors.weiss, fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: -0.4 },
  detSub: { color: 'rgba(255,255,255,0.82)', fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  detFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  detMeta: { color: '#C9CCF5', fontFamily: fonts.semibold, fontSize: 13, flex: 1 },
  detBtn: { backgroundColor: colors.weiss, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 },
  detBtnText: { color: '#1E2A55', fontFamily: fonts.bold, fontSize: 14 },
  garage: { backgroundColor: '#1C1C1E', borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, ...shadow },
  badges: { gap: spacing.md, paddingRight: spacing.lg },
  badge: { width: 112, alignItems: 'center', gap: 4 },
  badgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.warngelb,
  },
  badgeLocked: { backgroundColor: colors.grau200, borderColor: colors.grau200 },
  badgeIcon: { fontSize: 34, lineHeight: 42, fontFamily: fonts.regular },
  badgeTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.graphit, textAlign: 'center' },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.grau500, textAlign: 'center' },
});
