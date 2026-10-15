import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StarOfLife } from './src/components/Ems';
import { NavTarget, SideNav } from './src/components/SideNav';
import { TabBar, TabId } from './src/components/TabBar';
import { CASES, MedCase } from './src/data/cases';
import { HELFER_FAELLE, HelferFall } from './src/data/helfer';
import { Badge, awardBadges } from './src/game/achievements';
import { CprResult } from './src/game/cpr';
import { DAILY_CASE_BONUS, dailyCase, dailyHelferFall, registerDailyCase } from './src/game/daily';
import { DIFFICULTY_BY_ID, Difficulty } from './src/game/difficulty';
import { WacheId, wacheKaufen } from './src/game/wache';
import { PRUEFUNG_BESTANDEN, handgriffePunkte, makeHandgriffe, makePruefung, makeZuerstFragen, pruefungPunkte, zuerstPunkte } from './src/game/helferTraining';
import { EquipmentId, ausruestung, buyUpgrade, equipmentEffects, levelOf, upgradeBlock } from './src/game/equipment';
import { ArchiveStamp, mergeArchive } from './src/game/detective';
import { HelferErgebnis } from './src/game/helfer';
import { Rolle, RolleContext, setAktiveRolle } from './src/game/rolle';
import { KAPITEL, KAPITEL_BONUS, StoryAktion, istFrei } from './src/game/story';
import { TrainingId } from './src/game/trainings';
import { manvPoints } from './src/game/manv';
import { QUIZ_POINTS } from './src/game/quiz';
import { CaseRun, ScoreResult, rankFor, scoreRun } from './src/game/scoring';
import { EMPTY_PROGRESS, Progress, loadProgress, loadRolle, saveProgress, saveRolle } from './src/game/storage';
import { addWeekPoints } from './src/game/weekly';
import { CaseScreen } from './src/screens/CaseScreen';
import { CprScreen } from './src/screens/CprScreen';
import { GarageScreen } from './src/screens/GarageScreen';
import { GuideScreen } from './src/screens/GuideScreen';
import { HelferAbschluss, HelferScreen } from './src/screens/HelferScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { KnowledgeScreen } from './src/screens/KnowledgeScreen';
import { LexikonScreen } from './src/screens/LexikonScreen';
import { ManvScreen } from './src/screens/ManvScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { DetectiveScreen } from './src/screens/DetectiveScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { RolleScreen } from './src/screens/RolleScreen';
import { WacheScreen } from './src/screens/WacheScreen';
import { NotrufScreen } from './src/screens/NotrufScreen';
import { PackScreen } from './src/screens/PackScreen';
import { FragenScreen } from './src/screens/FragenScreen';
import { MythenScreen } from './src/screens/MythenScreen';
import { SchritteScreen } from './src/screens/SchritteScreen';
import { TrainingScreen } from './src/screens/TrainingScreen';
import { FrameWidthProvider, SIDEBAR_FROM, SIDEBAR_WIDTH, SidebarProvider, desktopShell } from './src/layout';
import { colors, fonts } from './src/theme';

type Screen =
  | { name: 'home' }
  | { name: 'training' }
  | { name: 'lexikon' }
  | { name: 'guide' }
  | { name: 'quiz'; key: number }
  | { name: 'wissen'; key: number }
  | { name: 'cpr'; key: number }
  | { name: 'manv'; key: number }
  | { name: 'detektiv'; key: number }
  | { name: 'schritte'; key: number }
  | { name: 'notruf'; key: number }
  | { name: 'zuerst'; key: number }
  | { name: 'pack'; key: number }
  | { name: 'handgriffe'; key: number }
  | { name: 'mythen'; key: number }
  | { name: 'aed'; key: number }
  | { name: 'pruefung'; key: number }
  | { name: 'rolle' }
  | { name: 'helfer'; fall: HelferFall; daily: boolean; key: number }
  | { name: 'garage' }
  | { name: 'wache' }
  | { name: 'case'; medCase: MedCase; daily: boolean; key: number }
  | {
      name: 'result';
      run: CaseRun;
      result: ScoreResult;
      newBadges: Badge[];
      goalBonus: number;
      promotion?: string;
      weekRecord: boolean;
    };

/** Größte Inhaltsbreite je Bildschirm auf großen Displays (undefined = volle Breite mit eigenem Spaltenlayout) */
const FRAME_MAX: Partial<Record<Screen['name'], number>> = {
  result: 1180,
  lexikon: 1180,
  guide: 880,
  quiz: 760,
  wissen: 760,
  cpr: 760,
  manv: 860,
  detektiv: 980,
  schritte: 760,
  notruf: 760,
  zuerst: 760,
  pack: 760,
  handgriffe: 760,
  mythen: 760,
  aed: 760,
  pruefung: 760,
  helfer: 820,
  rolle: 760,
};

/** Auf dem Handy und iPad hoch: Tab-Leiste unten für diese Bildschirme */
const TAB_OF: Partial<Record<Screen['name'], TabId>> = {
  home: 'home',
  training: 'training',
  garage: 'garage',
  wache: 'garage',
  lexikon: 'lexikon',
  guide: 'guide',
};

const NAV_OF: Partial<Record<Screen['name'], NavTarget>> = {
  home: 'home',
  training: 'home',
  garage: 'garage',
  wache: 'wache',
  manv: 'manv',
  detektiv: 'detektiv',
  schritte: 'schritte',
  notruf: 'notruf',
  zuerst: 'zuerst',
  pack: 'pack',
  handgriffe: 'handgriffe',
  mythen: 'mythen',
  aed: 'aed',
  pruefung: 'pruefung',
  helfer: 'home',
  cpr: 'cpr',
  wissen: 'wissen',
  quiz: 'quiz',
  lexikon: 'lexikon',
  guide: 'guide',
};

/** Wählt passend zur Schwierigkeit bevorzugt ungemeisterte Fälle, nie denselben Fall zweimal hintereinander. */
function pickCase(progress: Progress, lastId?: string): MedCase {
  const levels = DIFFICULTY_BY_ID[progress.difficulty].caseLevels;
  const pool = CASES.filter((c) => levels.includes(c.difficulty) && c.id !== lastId);
  const open = pool.filter((c) => (progress.bestStars[c.id] ?? 0) < 3);
  const from = open.length > 0 ? open : pool;
  return from[Math.floor(Math.random() * from.length)];
}

/** Ersthelfer-Notfall: bevorzugt noch nicht gemeisterte, nie zweimal derselbe hintereinander */
function pickHelferFall(progress: Progress, lastId?: string): HelferFall {
  const pool = HELFER_FAELLE.filter((c) => c.id !== lastId);
  const open = pool.filter((c) => (progress.bestStars[c.id] ?? 0) < 3);
  const from = open.length > 0 ? open : pool;
  return from[Math.floor(Math.random() * from.length)];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const win = useWindowDimensions();
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  /** Gewählte Rolle; null = Auswahl anzeigen, undefined = wird noch geladen */
  const [rolle, setRolle] = useState<Rolle | null | undefined>(undefined);
  const lastCaseId = useRef<string | undefined>(undefined);
  // Spiel-Logik (Ränge, Ausrüstung, Abzeichen) richtet sich nach der aktiven Rolle
  setAktiveRolle(rolle ?? 'sani');
  const aktiv: Rolle = rolle ?? 'sani';
  const [fontsLoaded, fontError] = useFonts({
    // Schriften (SIL Open Font License), auf die benötigten Zeichen verkleinert – siehe assets/fonts/
    Bricolage_700Bold: require('./assets/fonts/Bricolage_700Bold.ttf'),
    Bricolage_800ExtraBold: require('./assets/fonts/Bricolage_800ExtraBold.ttf'),
    Inter_400Regular: require('./assets/fonts/Inter_400Regular.ttf'),
    Inter_400Regular_Italic: require('./assets/fonts/Inter_400Regular_Italic.ttf'),
    Inter_500Medium: require('./assets/fonts/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('./assets/fonts/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('./assets/fonts/Inter_700Bold.ttf'),
    Inter_800ExtraBold: require('./assets/fonts/Inter_800ExtraBold.ttf'),
  });

  useEffect(() => {
    loadRolle().then(async (r) => {
      if (r) setProgress(await loadProgress(r));
      setRolle(r);
    });
  }, []);

  /** Rolle wählen oder wechseln: lädt den Spielstand dieser Rolle */
  const waehleRolle = async (r: Rolle) => {
    saveRolle(r);
    setAktiveRolle(r);
    const p = await loadProgress(r);
    lastCaseId.current = undefined;
    setProgress(p);
    setRolle(r);
    setScreen({ name: 'home' });
  };

  const startCase = (daily = false) => {
    if (aktiv === 'helfer') {
      const fall = daily ? dailyHelferFall() : pickHelferFall(progress, lastCaseId.current);
      lastCaseId.current = fall.id;
      return setScreen({ name: 'helfer', fall, daily, key: Date.now() });
    }
    const medCase = daily ? dailyCase(progress) : pickCase(progress, lastCaseId.current);
    lastCaseId.current = medCase.id;
    setScreen({ name: 'case', medCase, daily, key: Date.now() });
  };

  /** Speichert neuen Fortschritt inkl. Abzeichen und Wochenpunkten; liefert neue Abzeichen, ggf. Beförderung und Wochenrekord. */
  const commit = (updated: Progress) => {
    const awarded = awardBadges(updated);
    const newBadges = awarded.newBadges;
    const earned = Math.max(0, awarded.progress.totalPoints - progress.totalPoints);
    const week = addWeekPoints(awarded.progress, earned);
    const next = { ...week.progress, budget: week.progress.budget + earned };
    const before = rankFor(progress.totalPoints).rank;
    const after = rankFor(next.totalPoints).rank;
    setProgress(next);
    saveProgress(aktiv, next);
    return {
      newBadges,
      promotion: after.min > before.min ? after.de : undefined,
      weekRecord: week.newRecord,
    };
  };

  const finishCase = (run: CaseRun, daily: boolean) => {
    const scored = scoreRun(run, progress.streak);
    const result: ScoreResult = { ...scored, lines: [...scored.lines] };
    const { pointsPct } = equipmentEffects(progress);
    if (pointsPct > 0) {
      const extra = Math.round((scored.total * pointsPct) / 100);
      result.lines.push({
        label: `Ausrüstung (+${pointsPct} %)`,
        points: extra,
      });
      result.total += extra;
    }
    if (daily) {
      const extra = Math.round(scored.total * DAILY_CASE_BONUS);
      result.lines.push({ label: 'Einsatz des Tages (+50 %)', points: extra });
      result.total += extra;
    }
    const day = registerDailyCase(progress, daily);
    if (day.goalBonus > 0) {
      result.lines.push({
        label: `Tagesziel erreicht (${day.progress.dayStreak}. Tag in Folge)`,
        points: day.goalBonus,
      });
      result.total += day.goalBonus;
    }
    const id = run.medCase.id;
    const updated: Progress = {
      ...day.progress,
      streak: result.stars >= 2 ? progress.streak + 1 : 0,
      totalPoints: progress.totalPoints + result.total,
      casesPlayed: progress.casesPlayed + 1,
      correctDiagnoses: progress.correctDiagnoses + (result.diagnosisCorrect ? 1 : 0),
      bestStars: {
        ...progress.bestStars,
        [id]: Math.max(progress.bestStars[id] ?? 0, result.stars),
      },
      perfectRuns: progress.perfectRuns + (result.stars === 3 ? 1 : 0),
      hardWins: progress.hardWins + (run.difficulty === 'schwer' && result.stars >= 2 ? 1 : 0),
    };
    const { newBadges, promotion, weekRecord } = commit(updated);
    setScreen({
      name: 'result',
      run,
      result,
      newBadges,
      goalBonus: day.goalBonus,
      promotion,
      weekRecord,
    });
  };

  /** Ersthelfer-Notfall abgeschlossen: Punkte, Sterne, Tagesziel */
  const finishHelfer = (e: HelferErgebnis, punkte: number, daily: boolean): HelferAbschluss => {
    const day = registerDailyCase(progress, daily);
    const total = punkte + day.goalBonus;
    const { newBadges, promotion } = commit({
      ...day.progress,
      streak: e.sterne >= 2 ? progress.streak + 1 : 0,
      totalPoints: progress.totalPoints + total,
      casesPlayed: progress.casesPlayed + 1,
      correctDiagnoses: progress.correctDiagnoses + (e.erkannt ? 1 : 0),
      bestStars: { ...progress.bestStars, [e.fallId]: Math.max(progress.bestStars[e.fallId] ?? 0, e.sterne) },
      perfectRuns: progress.perfectRuns + (e.sterne === 3 ? 1 : 0),
    });
    return { punkte: total, ausruestung: 0, goalBonus: day.goalBonus, newBadges, promotion };
  };

  /** Schritt für Schritt: Punkte und richtig sortierte Abläufe */
  const finishSchritte = (punkte: number, ids: string[]) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + punkte,
      ablaeufe: [...new Set([...progress.ablaeufe, ...ids])],
    });
  };

  const finishNotruf = (punkte: number, id: string | null) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + punkte,
      notrufGeschafft: id ? [...new Set([...progress.notrufGeschafft, id])] : progress.notrufGeschafft,
    });
  };

  const finishZuerst = (richtig: number, punkte: number) => {
    commit({ ...progress, totalPoints: progress.totalPoints + punkte, zuerstBest: Math.max(progress.zuerstBest, richtig) });
  };

  const finishPack = (punkte: number, id: string | null) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + punkte,
      packGeschafft: id ? [...new Set([...progress.packGeschafft, id])] : progress.packGeschafft,
    });
  };

  /** Kapitel der Geschichte abschließen */
  const storyDone = () => {
    commit({ ...progress, story: progress.story + 1, totalPoints: progress.totalPoints + KAPITEL_BONUS });
  };

  const storyAktion = (a: StoryAktion) => {
    if (a === 'einsatz') return startCase();
    if (a === 'garage') return setScreen({ name: 'garage' });
    if (a === 'rolle') return setScreen({ name: 'rolle' });
    setScreen({ name: a, key: Date.now() } as Screen);
  };

  const finishQuiz = (correct: number) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + correct * QUIZ_POINTS,
      quizBest: Math.max(progress.quizBest, correct),
    });
  };

  const finishKnowledge = (correct: number) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + correct * QUIZ_POINTS,
      knowBest: Math.max(progress.knowBest, correct),
    });
  };

  const finishManv = (correct: number) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + manvPoints(correct),
      manvBest: Math.max(progress.manvBest, correct),
    });
  };

  /** Detektiv-Akten: Punkte (= Budget), Stempel ins Archiv, Bestwert */
  const finishDetective = (points: number, stamps: Record<string, ArchiveStamp | 0>) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + points,
      detectiveSolved: mergeArchive(progress.detectiveSolved, stamps),
      detectiveBest: Math.max(progress.detectiveBest, points),
      detectiveRounds: progress.detectiveRounds + 1,
    });
  };

  /** Ausrüstung kaufen: kostet Budget, keine Punkte – der Dienstgrad bleibt. */
  const upgrade = (id: EquipmentId) => {
    const bought = buyUpgrade(progress, id);
    if (bought === progress) return;
    commit(bought);
  };

  /** Rettungswache: Bereich ausbauen (kostet Budget) */
  const baue = (id: WacheId) => {
    const next = wacheKaufen(progress, id);
    if (next !== progress) commit(next);
  };

  const finishCpr = (r: CprResult) => {
    commit({
      ...progress,
      totalPoints: progress.totalPoints + r.points,
      cprBest: Math.max(progress.cprBest, r.accuracy),
    });
  };

  const resetProgress = () => {
    const fresh = { ...EMPTY_PROGRESS, difficulty: progress.difficulty };
    setProgress(fresh);
    saveProgress(aktiv, fresh);
    lastCaseId.current = undefined;
    setScreen({ name: 'home' });
  };

  /** Spielstand per Code von einem anderen Gerät übernehmen */
  const importProgress = (p: Progress) => {
    setProgress(p);
    saveProgress(aktiv, p);
  };

  const home = () => setScreen({ name: 'home' });
  /** Zurück zum Bereich, aus dem ein Training gestartet wurde (Startseite oder Training-Tab) */
  const lastTop = useRef<'home' | 'training'>('home');
  if (screen.name === 'home' || screen.name === 'training') lastTop.current = screen.name;
  const back = () => setScreen({ name: lastTop.current } as Screen);

  const setDifficulty = (difficulty: Difficulty) => {
    const next = { ...progress, difficulty };
    setProgress(next);
    saveProgress(aktiv, next);
  };

  const openTraining = (t: TrainingId) => setScreen({ name: t, key: Date.now() } as Screen);

  const navigate = (t: NavTarget) => {
    if (t === 'start') return startCase();
    if (['quiz', 'wissen', 'cpr', 'manv', 'detektiv', 'schritte', 'notruf', 'zuerst', 'pack', 'handgriffe', 'mythen', 'aed', 'pruefung'].includes(t))
      return setScreen({ name: t, key: Date.now() } as Screen);
    setScreen({ name: t } as Screen);
  };

  // Große Bildschirme: Seitenleiste links, Inhalt mittig in passender Breite
  const sidebar = win.width >= SIDEBAR_FROM;
  const available = win.width - (sidebar ? SIDEBAR_WIDTH : 0);
  const frameMax = FRAME_MAX[screen.name];
  const frameWidth = Math.min(available, frameMax ?? available);
  const tab = sidebar ? undefined : TAB_OF[screen.name];

  if ((!fontsLoaded && !fontError) || rolle === undefined) {
    return (
      <View style={styles.splash}>
        <StarOfLife size={64} color={colors.red} />
      </View>
    );
  }

  // Erster Start: Rolle wählen
  if (rolle === null) {
    return (
      <SafeAreaProvider>
        <View style={styles.paper}>
          <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <RolleScreen onWahl={waehleRolle} />
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <RolleContext.Provider value={aktiv}>
      <View style={styles.paper}>
        <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
          <StatusBar style="light" />
          {desktopShell && (
            <View nativeID="titlebar" style={[styles.titlebar, desktopShell === 'mac' ? styles.titlebarMac : styles.titlebarWin]}>
              <StarOfLife size={14} />
              <Text style={styles.titlebarText}>Einsatz 112</Text>
            </View>
          )}
          <View style={styles.shell}>
            {sidebar && <SideNav progress={progress} active={NAV_OF[screen.name] ?? null} onNavigate={navigate} />}
            <View style={styles.body}>
              <View style={[styles.frame, frameMax !== undefined && { maxWidth: frameMax }]}>
                <SidebarProvider value={sidebar}>
                  <FrameWidthProvider value={frameWidth}>
                    {screen.name === 'home' && (
                      <HomeScreen
                        progress={progress}
                        onStart={() => startCase()}
                        onDaily={() => startCase(true)}
                        onDifficulty={setDifficulty}
                        onTraining={openTraining}
                        onGarage={() => setScreen({ name: 'garage' })}
                        onWache={() => setScreen({ name: 'wache' })}
                        onStory={storyAktion}
                        onStoryDone={storyDone}
                      />
                    )}
                    {screen.name === 'rolle' && <RolleScreen aktuell={aktiv} onWahl={waehleRolle} />}
                    {screen.name === 'helfer' && (
                      <HelferScreen
                        key={screen.key}
                        fall={screen.fall}
                        daily={screen.daily}
                        pointsPct={equipmentEffects(progress).pointsPct}
                        onFinish={(e, punkte) => finishHelfer(e, punkte, screen.daily)}
                        onNext={() => startCase()}
                        onHome={home}
                      />
                    )}
                    {screen.name === 'schritte' && (
                      <SchritteScreen
                        key={screen.key}
                        rolle={aktiv}
                        geloest={progress.ablaeufe}
                        onFinish={finishSchritte}
                        onBack={back}
                      />
                    )}
                    {screen.name === 'notruf' && (
                      <NotrufScreen key={screen.key} geloest={progress.notrufGeschafft} onFinish={finishNotruf} onBack={back} />
                    )}
                    {screen.name === 'zuerst' && (
                      <FragenScreen
                        key={screen.key}
                        kicker="Was zuerst?"
                        titel="Erste Handlung"
                        frageText="Was machst du als Erstes?"
                        erzeuge={makeZuerstFragen}
                        best={progress.zuerstBest}
                        punkte={zuerstPunkte}
                        onFinish={finishZuerst}
                        onBack={back}
                      />
                    )}
                    {screen.name === 'handgriffe' && (
                      <FragenScreen
                        key={screen.key}
                        kicker="Handgriffe"
                        titel="Richtig gemacht"
                        frageText="Wie machst du es richtig?"
                        erzeuge={makeHandgriffe}
                        best={progress.handgriffeBest}
                        punkte={handgriffePunkte}
                        onFinish={(richtig, punkte) => commit({ ...progress, totalPoints: progress.totalPoints + punkte, handgriffeBest: Math.max(progress.handgriffeBest, richtig) })}
                        onBack={back}
                      />
                    )}
                    {screen.name === 'pruefung' && (
                      <FragenScreen
                        key={screen.key}
                        kicker="Erste-Hilfe-Prüfung"
                        titel="Kursabschluss"
                        frageText="Wähle die richtige Antwort"
                        erzeuge={makePruefung}
                        best={progress.pruefungBest}
                        bestehen={PRUEFUNG_BESTANDEN}
                        punkte={pruefungPunkte}
                        onFinish={(richtig, punkte) => commit({ ...progress, totalPoints: progress.totalPoints + punkte, pruefungBest: Math.max(progress.pruefungBest, richtig) })}
                        onBack={back}
                      />
                    )}
                    {screen.name === 'mythen' && (
                      <MythenScreen
                        key={screen.key}
                        best={progress.mythenBest}
                        onFinish={(richtig, punkte) => commit({ ...progress, totalPoints: progress.totalPoints + punkte, mythenBest: Math.max(progress.mythenBest, richtig) })}
                        onBack={back}
                      />
                    )}
                    {screen.name === 'aed' && (
                      <NotrufScreen
                        key={screen.key}
                        modus="aed"
                        geloest={progress.aedGeschafft}
                        onFinish={(punkte, id) =>
                          commit({
                            ...progress,
                            totalPoints: progress.totalPoints + punkte,
                            aedGeschafft: id ? [...new Set([...progress.aedGeschafft, id])] : progress.aedGeschafft,
                          })
                        }
                        onBack={back}
                      />
                    )}
                    {screen.name === 'pack' && (
                      <PackScreen key={screen.key} geloest={progress.packGeschafft} onFinish={finishPack} onBack={back} />
                    )}
                    {screen.name === 'training' && <TrainingScreen progress={progress} onTraining={openTraining} />}
                    {screen.name === 'lexikon' && <LexikonScreen progress={progress} />}
                    {screen.name === 'guide' && (
                      <GuideScreen
                        progress={progress}
                        onReset={resetProgress}
                        onImport={importProgress}
                        onRolle={() => setScreen({ name: 'rolle' })}
                        onUnlock={() => commit({ ...progress, story: Math.max(progress.story, KAPITEL[aktiv].length - 1) })}
                      />
                    )}
                    {screen.name === 'quiz' && (
                      <QuizScreen key={screen.key} best={progress.quizBest} onFinish={finishQuiz} onBack={back} />
                    )}
                    {screen.name === 'wissen' && (
                      <KnowledgeScreen key={screen.key} best={progress.knowBest} onFinish={finishKnowledge} onBack={back} />
                    )}
                    {screen.name === 'wache' && <WacheScreen progress={progress} onBuild={baue} />}
                    {screen.name === 'garage' && <GarageScreen progress={progress} onUpgrade={upgrade} />}
                    {screen.name === 'manv' && (
                      <ManvScreen key={screen.key} best={progress.manvBest} onFinish={finishManv} onBack={back} />
                    )}
                    {screen.name === 'detektiv' && (
                      <DetectiveScreen
                        key={screen.key}
                        progress={progress}
                        onFinish={finishDetective}
                        onBack={back}
                        onGarage={() => setScreen({ name: 'garage' })}
                      />
                    )}
                    {screen.name === 'cpr' && (
                      <CprScreen key={screen.key} best={progress.cprBest} onFinish={finishCpr} onBack={back} />
                    )}
                    {screen.name === 'case' && (
                      <CaseScreen
                        key={screen.key}
                        medCase={screen.medCase}
                        difficulty={DIFFICULTY_BY_ID[progress.difficulty]}
                        daily={screen.daily}
                        equipment={equipmentEffects(progress)}
                        rtwLevel={levelOf(progress, 'rtw')}
                        onFinish={(run) => finishCase(run, screen.daily)}
                        onAbort={home}
                      />
                    )}
                    {screen.name === 'result' && (
                      <ResultScreen
                        run={screen.run}
                        result={screen.result}
                        newBadges={screen.newBadges}
                        goalBonus={screen.goalBonus}
                        promotion={screen.promotion}
                        weekRecord={screen.weekRecord}
                        streak={progress.streak}
                        onNext={() => startCase()}
                        onHome={home}
                      />
                    )}
                  </FrameWidthProvider>
                </SidebarProvider>
              </View>
              {tab && (
                <TabBar
                  active={tab}
                  onSelect={(t) => setScreen({ name: t } as Screen)}
                  badge={{ garage: istFrei(aktiv, progress, 'garage') && ausruestung().some((e) => upgradeBlock(progress, e.id) === null) }}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
      </RolleContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  paper: { flex: 1, backgroundColor: colors.paper },
  root: { flex: 1 },
  shell: { flex: 1, flexDirection: 'row' },
  body: { flex: 1, alignItems: 'center' },
  frame: { flex: 1, width: '100%' },
  titlebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.navy,
  },
  titlebarMac: { height: 30, justifyContent: 'center' },
  titlebarWin: { height: 32, paddingLeft: 12 },
  titlebarText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.grau300,
    letterSpacing: 0.5,
  },
  splash: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
