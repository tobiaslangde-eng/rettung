import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ambulance } from '../components/Ambulance';
import { RankBadge, StarOfLife } from '../components/Ems';
import { Bar, Burst, Button, CheckerStrip, IconTile, Led, Pill, SectionTitle, Segmented, Tap } from '../components/UI';
import { CASES } from '../data/cases';
import { BADGES } from '../game/achievements';
import { DAILY_GOAL, dailyCase, dailyGoalBonus, dayState } from '../game/daily';
import { archiveCount, detectiveGrade } from '../game/detective';
import { DIFFICULTIES, Difficulty } from '../game/difficulty';
import { EQUIPMENT, MAX_LEVEL, euro, levelOf, totalLevel, upgradeBlock } from '../game/equipment';
import { RANKS, rankFor } from '../game/scoring';
import { Progress } from '../game/storage';
import { weekView } from '../game/weekly';
import { Columns, useLayout, useSidebar } from '../layout';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

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

/** Die fünf Trainings – gemeinsam genutzt von Startseite und Training-Tab. `tone` ist die Pastellfläche, `accent` die kräftige Farbe. */
export function trainings(progress: Progress) {
  return [
    {
      id: 'detektiv' as TrainingId,
      icon: '🔍',
      tone: colors.lilac,
      accent: colors.violet,
      title: 'Detektiv-Akten',
      sub: 'Der Diagnose-Krimi: Hinweise aufdecken, Fall lösen',
      best: progress.detectiveBest > 0 ? `Bestwert ${progress.detectiveBest}` : undefined,
    },
    {
      id: 'manv' as TrainingId,
      icon: '🚨',
      tone: colors.peach,
      accent: colors.orange,
      title: 'Großeinsatz',
      sub: '8 Verletzte richtig sichten',
      best: progress.manvBest > 0 ? `Bestwert ${progress.manvBest}/8` : undefined,
    },
    {
      id: 'cpr' as TrainingId,
      icon: '❤️',
      tone: colors.pinkTint,
      accent: colors.pinkStrong,
      title: 'Herzdruckmassage',
      sub: 'Im Takt 100–120 pro Minute',
      best: progress.cprBest > 0 ? `Bestwert ${progress.cprBest} %` : undefined,
    },
    {
      id: 'wissen' as TrainingId,
      icon: '🧠',
      tone: colors.sky,
      accent: colors.skyStrong,
      title: 'Wissensfragen',
      sub: '10 Fragen aus dem Einsatzalltag',
      best: progress.knowBest > 0 ? `Bestwert ${progress.knowBest}/10` : undefined,
    },
    {
      id: 'quiz' as TrainingId,
      icon: '📈',
      tone: colors.mintTint,
      accent: colors.mint,
      title: 'Normwerte',
      sub: '10 Messwerte schnell einschätzen',
      best: progress.quizBest > 0 ? `Bestwert ${progress.quizBest}/10` : undefined,
    },
  ];
}

/** Rettungswagen mit abwechselnd blinkendem Blaulicht */
function BlinkingAmbulance({ level, width }: { level: number; width: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 450);
    return () => clearInterval(t);
  }, []);
  return <Ambulance level={level} width={width} blink={on} />;
}

function Check({ size = 34 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M8 21 L17 30 L33 10"
        stroke={colors.ink}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Chip({ label, bg }: { label: string; bg: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

/** Weicher Silbentrenner, damit lange Wörter in schmalen Kacheln umbrechen */
const shy = (t: string) =>
  t
    .replace('Herzdruckmassage', 'Herzdruck\u00ADmassage')
    .replace('Wissensfragen', 'Wissens\u00ADfragen')
    .replace('Detektiv-Akten', 'Detektiv-\u200BAkten');

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
  const sidebar = useSidebar();
  const now = new Date();
  const canUpgrade = EQUIPMENT.some((e) => upgradeBlock(progress, e.id) === null);
  const week = weekView(progress);
  const day = dayState(progress);
  const todays = dailyCase(progress);
  const { rank, next } = rankFor(progress.totalPoints);
  const rankPct = next ? Math.min(1, (progress.totalPoints - rank.min) / (next.min - rank.min)) : 1;
  const mastered = CASES.filter((c) => (progress.bestStars[c.id] ?? 0) >= 3).length;
  const current = DIFFICULTIES.find((d) => d.id === progress.difficulty) ?? DIFFICULTIES[0];
  const rtwLevel = levelOf(progress, 'rtw');
  const upgrades = totalLevel(progress);
  const maxUpgrades = EQUIPMENT.length * MAX_LEVEL;
  const weekMax = Math.max(1, week.best, ...week.bars.map((b) => b.points));

  const header = sidebar ? (
    <View>
      <Text style={type.eyebrow}>
        {WEEKDAYS[now.getDay()]}, {now.getDate()}. {MONTHS[now.getMonth()]}
      </Text>
      <Text style={type.largeTitle}>Moin! Bereit?</Text>
    </View>
  ) : (
    <View style={styles.header}>
      <View style={styles.brand}>
        <StarOfLife size={34} color={colors.red} outline={colors.ink} />
        <View>
          <Text style={styles.brandText}>Einsatz 112</Text>
          <Text style={styles.brandDate}>
            {WEEKDAYS[now.getDay()].slice(0, 2)}, {now.getDate()}. {MONTHS[now.getMonth()].slice(0, 3)}
          </Text>
        </View>
      </View>
      <View style={styles.headChips}>
        <Chip label={`🔥 ${day.streak}`} bg={colors.yellow} />
        <Chip label={euro(progress.budget)} bg={colors.white} />
      </View>
    </View>
  );

  const idCard = (
    <View style={styles.idCard}>
      <View style={styles.lanyard} />
      <View style={styles.idRow}>
        <RankBadge size={78} level={RANKS.indexOf(rank)} />
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Text style={type.eyebrow}>Dienstausweis</Text>
          <Text style={styles.rankName} numberOfLines={2}>
            {rank.de}
          </Text>
          <Bar pct={rankPct} color={colors.blue} height={14} />
          <View style={styles.xpRow}>
            <Text style={styles.xp}>{progress.totalPoints.toLocaleString('de-DE')} XP</Text>
            <Text style={styles.xpNext} numberOfLines={1}>
              {next ? `noch ${next.min - progress.totalPoints}` : 'Höchster Rang!'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.stats}>
        <Stat value={progress.casesPlayed} label="Einsätze" />
        <View style={styles.statRule} />
        <Stat value={progress.correctDiagnoses} label="Diagnosen" />
        <View style={styles.statRule} />
        <Stat value={`${mastered}/${CASES.length}`} label="Gemeistert" />
      </View>
      <CheckerStrip height={12} />
    </View>
  );

  const hero = (
    <View style={styles.hero}>
      <View style={styles.ghostStar}>
        <StarOfLife size={250} color="#CB1F28" outline="transparent" staff="#CB1F28" />
      </View>
      <View style={styles.readyPill}>
        <Led />
        <Text style={styles.readyText}>EINSATZBEREIT</Text>
      </View>
      <Text style={styles.heroTitle}>Bereit für deine Schicht?</Text>
      <Text style={styles.heroSub}>Patient untersuchen, Werte messen, richtig handeln.</Text>
      <View style={styles.heroCar}>
        <BlinkingAmbulance level={rtwLevel} width={L.wide ? 250 : 230} />
      </View>
      <Button label="Schicht beginnen ▶" variant="outline" onPress={onStart} />
      <Segmented
        options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
        value={progress.difficulty}
        onChange={onDifficulty}
      />
      <Text style={styles.heroDiff}>{current.description}</Text>
    </View>
  );

  const punchCard = (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={{ flex: 1 }}>
          <Text style={type.eyebrow}>Stechkarte</Text>
          <Text style={type.h2}>{day.goalDone ? 'Tagesziel geschafft!' : `${DAILY_GOAL} Einsätze heute`}</Text>
        </View>
        <Pill
          label={day.streak > 0 ? `🔥 ${day.streak} ${day.streak === 1 ? 'Tag' : 'Tage'}` : 'Serie starten'}
          color={colors.yellow}
        />
      </View>
      <View style={styles.punchRow}>
        <View style={styles.slots}>
          {Array.from({ length: DAILY_GOAL }, (_, i) => {
            const done = i < day.cases;
            return (
              <View key={i} style={[styles.slotCircle, done && styles.slotDone]}>
                {done ? <Check /> : <Text style={styles.slotNum}>{i + 1}</Text>}
              </View>
            );
          })}
        </View>
        <View style={styles.bonus}>
          <Text style={styles.bonusValue}>+{dailyGoalBonus(day.streak + (day.goalDone ? 0 : 1))}</Text>
          <Text style={styles.bonusLabel}>Bonus</Text>
        </View>
      </View>
      <Tap
        onPress={onDaily}
        disabled={day.dailyCaseDone}
        offset={3}
        accessibilityLabel="Einsatz des Tages"
        style={[styles.ticket, day.dailyCaseDone && { opacity: 0.55 }]}
      >
        <View style={styles.ticketIcon}>
          <Text style={{ fontSize: 22, lineHeight: 28, fontFamily: fonts.regular }}>{day.dailyCaseDone ? '✅' : '⭐'}</Text>
        </View>
        <View style={styles.ticketDash} />
        <View style={{ flex: 1 }}>
          <Text style={type.headline}>Einsatz des Tages</Text>
          <Text style={type.small}>
            {day.dailyCaseDone ? 'Erledigt – morgen gibt es einen neuen' : `${todays.location.split(',')[0]} · +50 %`}
          </Text>
        </View>
        {!day.dailyCaseDone && <Pill label="Los ▶" color={colors.blue} />}
      </Tap>
    </View>
  );

  const weekCard = (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.lg }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.eyebrow}>Diese Woche</Text>
          <Text style={styles.big}>
            {week.current} <Text style={styles.bigUnit}>Punkte</Text>
          </Text>
          <Text style={type.small}>
            {week.best === 0
              ? 'Stell deinen ersten Wochenrekord auf!'
              : week.current > week.best
                ? `🏆 Neuer Rekord (vorher ${week.best})`
                : `Rekord: ${week.best} · letzte Woche: ${week.last}`}
          </Text>
        </View>
        <View style={styles.bars}>
          {week.bars.map((b, i) => {
            const isNow = i === week.bars.length - 1;
            return (
              <View key={b.week} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.weekBar,
                      { height: `${Math.max(8, (b.points / weekMax) * 100)}%` },
                      isNow && { backgroundColor: colors.blue },
                      b.points === 0 && styles.weekBarEmpty,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isNow && { color: colors.blue }]}>{b.week.slice(6)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const trainingGrid = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle title="Training" />
      <DetectiveTeaser progress={progress} onPress={() => onTraining('detektiv')} />
      <View style={styles.grid}>
        {trainings(progress)
          .filter((t) => t.id !== 'detektiv')
          .map((t) => (
            <Tap
              key={t.id}
              onPress={() => onTraining(t.id)}
              accessibilityLabel={t.title}
              style={[styles.tile, { backgroundColor: t.tone }, L.wide && !L.desktop && { flexBasis: '22%' }]}
            >
              <IconTile icon={t.icon} color={colors.white} size={46} />
              <Text style={styles.tileTitle} numberOfLines={2}>
                {shy(t.title)}
              </Text>
              <Text style={styles.tileSub} numberOfLines={2}>
                {t.best ?? 'Noch nicht gespielt'}
              </Text>
            </Tap>
          ))}
      </View>
    </View>
  );

  const garage = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle title="Mein Rettungswagen" />
      <Tap onPress={onGarage} accessibilityLabel="Mein Rettungswagen" style={styles.garage}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={type.eyebrow}>
              Ausbau {upgrades}/{maxUpgrades}
            </Text>
            <Bar pct={upgrades / maxUpgrades} color={colors.red} height={12} />
            <Pill label={`💰 ${euro(progress.budget)}`} color={colors.white} />
          </View>
          <Ambulance level={rtwLevel} width={Math.min(L.desktop ? 150 : 176, Math.round((L.width - 80) * 0.5))} />
        </View>
        {canUpgrade && (
          <View style={styles.garageBurst}>
            <Burst label={'Auf-\nrüsten!'} size={78} color={colors.mint} rotate={10} />
          </View>
        )}
      </Tap>
    </View>
  );

  const badges = (
    <View style={{ gap: spacing.md }}>
      <SectionTitle
        title="Abzeichen"
        right={
          <Text style={type.eyebrow}>
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
                <View style={[styles.medal, !has && styles.medalLocked]}>
                  <Text style={[styles.medalIcon, !has && { opacity: 0.35 }]}>{has ? b.icon : '🔒'}</Text>
                </View>
                <Text style={[styles.badgeTitle, !has && { color: colors.muted }]} numberOfLines={2}>
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
              {idCard}
            </>,
            <>
              {punchCard}
              {weekCard}
              {garage}
            </>,
            <>{trainingGrid}</>,
          ]}
        />
      ) : L.wide ? (
        <Columns
          wide
          cols={[
            <>
              {hero}
              {idCard}
            </>,
            <>
              {punchCard}
              {weekCard}
              {garage}
            </>,
          ]}
        />
      ) : (
        <>
          {idCard}
          {hero}
          {punchCard}
          {weekCard}
        </>
      )}
      {L.desktop ? (
        badges
      ) : L.wide ? (
        <>
          {trainingGrid}
          {badges}
        </>
      ) : (
        <>
          {trainingGrid}
          {garage}
          {badges}
        </>
      )}
      {note}
    </ScrollView>
  );
}

/** Große Karte für die Detektiv-Akten (Startseite und Training-Tab) */
export function DetectiveTeaser({ progress, onPress }: { progress: Progress; onPress: () => void }) {
  const arch = archiveCount(progress);
  const { grade } = detectiveGrade(progress);
  return (
    <Tap onPress={onPress} accessibilityLabel="Detektiv-Akten" style={styles.detective}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile icon="🔍" color={colors.white} size={58} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.detTitle}>Detektiv-Akten</Text>
          <Text style={styles.detSub}>Der Diagnose-Krimi – je weniger Hinweise, desto mehr Punkte</Text>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <View style={styles.detMetaRow}>
          <Text style={styles.detMeta}>
            {grade.icon} {grade.title}
          </Text>
          <Text style={styles.detMeta}>
            Archiv {arch.solved}/{arch.total}
          </Text>
        </View>
        <Bar pct={arch.solved / arch.total} color={colors.violet} height={12} />
      </View>
      <View style={styles.detGo}>
        <Text style={styles.detGoText}>Ermitteln ▶</Text>
      </View>
      {arch.solved === 0 && (
        <View style={styles.detBurst}>
          <Burst label="NEU" size={56} color={colors.yellow} rotate={12} />
        </View>
      )}
    </Tap>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingBottom: spacing.xxl + 8, gap: spacing.xl },
  bodyWide: { padding: spacing.xl, gap: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandText: { fontFamily: fonts.displayBlack, fontSize: 22, lineHeight: 24, color: colors.ink, letterSpacing: -0.7 },
  brandDate: { ...type.eyebrow, fontSize: 10 },
  headChips: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    ...hardShadow(2),
  },
  chipText: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.ink, letterSpacing: -0.3 },

  idCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    overflow: 'hidden',
    ...hardShadow(4),
  },
  lanyard: {
    alignSelf: 'center',
    marginTop: 8,
    width: 52,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  rankName: { fontFamily: fonts.displayBlack, fontSize: 22, lineHeight: 24, color: colors.ink, letterSpacing: -0.6 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  xp: { fontFamily: fonts.mono, fontSize: 12, color: colors.ink },
  xpNext: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, flexShrink: 1 },
  stats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    borderStyle: 'dashed',
    paddingVertical: spacing.sm,
  },
  statRule: { width: 2, backgroundColor: colors.ink, opacity: 0.12 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  statValue: { fontFamily: fonts.displayBlack, fontSize: 24, lineHeight: 27, color: colors.ink, letterSpacing: -0.7 },
  statLabel: { ...type.eyebrow, fontSize: 9.5 },

  hero: {
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 28,
    padding: spacing.lg + 2,
    gap: spacing.md,
    overflow: 'hidden',
    ...hardShadow(6),
  },
  ghostStar: { position: 'absolute', right: -70, top: -40, opacity: 0.5, pointerEvents: 'none' },
  readyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  readyText: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.4, color: colors.white },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.displayBlack,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -1,
    maxWidth: 300,
  },
  heroSub: { color: colors.white, fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, maxWidth: 300 },
  heroCar: { alignItems: 'center', marginVertical: -2 },
  heroDiff: { color: colors.white, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },

  card: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
    ...hardShadow(4),
  },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  punchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  slots: { flexDirection: 'row', gap: spacing.sm },
  slotCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: colors.ink,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  slotDone: { backgroundColor: colors.yellow, borderStyle: 'solid', transform: [{ rotate: '-6deg' }] },
  slotNum: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.grau300 },
  bonus: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.mintTint,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 6,
  },
  bonusValue: { fontFamily: fonts.displayBlack, fontSize: 26, lineHeight: 28, color: colors.ink, letterSpacing: -0.8 },
  bonusLabel: { ...type.eyebrow, fontSize: 9.5 },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.yellowTint,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 16,
    padding: spacing.sm + 2,
  },
  ticketIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDash: {
    width: 0,
    alignSelf: 'stretch',
    borderLeftWidth: 2,
    borderLeftColor: colors.ink,
    borderStyle: 'dashed',
    opacity: 0.4,
    marginHorizontal: 2,
  },

  big: { fontFamily: fonts.displayBlack, fontSize: 40, lineHeight: 42, color: colors.ink, letterSpacing: -1.5 },
  bigUnit: { fontSize: 14, fontFamily: fonts.mono, color: colors.muted, letterSpacing: 0.5 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, width: 132 },
  barCol: { flex: 1, alignItems: 'center', gap: 3 },
  barTrack: { height: 64, width: '100%', justifyContent: 'flex-end' },
  weekBar: { width: '100%', backgroundColor: colors.blueTint, borderWidth: 2, borderColor: colors.ink, borderRadius: 6 },
  weekBarEmpty: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: colors.grau300 },
  barLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    flexGrow: 1,
    flexBasis: '44%',
    minHeight: 138,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 22,
    padding: spacing.md + 2,
    gap: 3,
  },
  tileTitle: {
    fontFamily: fonts.displayBlack,
    fontSize: 18,
    lineHeight: 20,
    color: colors.ink,
    letterSpacing: -0.5,
    marginTop: 6,
  },
  tileSub: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 14, color: colors.inkSoft },
  detective: {
    backgroundColor: colors.lilac,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
  },
  detTitle: { fontFamily: fonts.displayBlack, fontSize: 24, lineHeight: 26, color: colors.ink, letterSpacing: -0.7 },
  detSub: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.inkSoft },
  detMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detMeta: { fontFamily: fonts.mono, fontSize: 12, color: colors.ink },
  detGo: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  detGoText: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.white, letterSpacing: -0.2 },
  detBurst: { position: 'absolute', right: 10, top: -12 },
  garage: {
    backgroundColor: colors.butter,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  garageBurst: { position: 'absolute', right: 12, top: -30 },
  badges: { gap: spacing.md, paddingRight: spacing.lg, paddingBottom: 6 },
  badge: { width: 104, alignItems: 'center', gap: 4 },
  medal: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(3),
  },
  medalLocked: { backgroundColor: colors.white, borderStyle: 'dashed', borderColor: colors.grau300, boxShadow: 'none' },
  medalIcon: { fontSize: 32, lineHeight: 40, fontFamily: fonts.regular },
  badgeTitle: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 15,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  badgeDesc: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.muted, textAlign: 'center' },
});
