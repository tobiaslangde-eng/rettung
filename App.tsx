import {
  Barlow_400Regular,
  Barlow_400Regular_Italic,
  Barlow_600SemiBold,
  Barlow_700Bold,
  Barlow_800ExtraBold,
} from '@expo-google-fonts/barlow';
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold } from '@expo-google-fonts/barlow-condensed';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StarOfLife } from './src/components/Ems';
import { CASES, MedCase } from './src/data/cases';
import { Badge, awardBadges } from './src/game/achievements';
import { CprResult } from './src/game/cpr';
import { DAILY_CASE_BONUS, dailyCase, registerDailyCase } from './src/game/daily';
import { DIFFICULTY_BY_ID, Difficulty } from './src/game/difficulty';
import { EquipmentId, buyUpgrade, equipmentEffects, levelOf } from './src/game/equipment';
import { manvPoints } from './src/game/manv';
import { QUIZ_POINTS } from './src/game/quiz';
import { CaseRun, ScoreResult, rankFor, scoreRun } from './src/game/scoring';
import { EMPTY_PROGRESS, Progress, loadProgress, saveProgress } from './src/game/storage';
import { addWeekPoints } from './src/game/weekly';
import { CaseScreen } from './src/screens/CaseScreen';
import { CprScreen } from './src/screens/CprScreen';
import { GarageScreen } from './src/screens/GarageScreen';
import { GuideScreen } from './src/screens/GuideScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { KnowledgeScreen } from './src/screens/KnowledgeScreen';
import { LexikonScreen } from './src/screens/LexikonScreen';
import { ManvScreen } from './src/screens/ManvScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { colors } from './src/theme';

type Screen =
  | { name: 'home' }
  | { name: 'lexikon' }
  | { name: 'guide' }
  | { name: 'quiz'; key: number }
  | { name: 'wissen'; key: number }
  | { name: 'cpr'; key: number }
  | { name: 'manv'; key: number }
  | { name: 'garage' }
  | { name: 'case'; medCase: MedCase; daily: boolean; key: number }
  | { name: 'result'; run: CaseRun; result: ScoreResult; newBadges: Badge[]; goalBonus: number; promotion?: string; weekRecord: boolean };

/** Wählt passend zur Schwierigkeit bevorzugt ungemeisterte Fälle, nie denselben Fall zweimal hintereinander. */
function pickCase(progress: Progress, lastId?: string): MedCase {
  const levels = DIFFICULTY_BY_ID[progress.difficulty].caseLevels;
  const pool = CASES.filter((c) => levels.includes(c.difficulty) && c.id !== lastId);
  const open = pool.filter((c) => (progress.bestStars[c.id] ?? 0) < 3);
  const from = open.length > 0 ? open : pool;
  return from[Math.floor(Math.random() * from.length)];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const lastCaseId = useRef<string | undefined>(undefined);
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed_700Bold,
    BarlowCondensed_800ExtraBold,
    Barlow_400Regular,
    Barlow_400Regular_Italic,
    Barlow_600SemiBold,
    Barlow_700Bold,
    Barlow_800ExtraBold,
  });

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const startCase = (daily = false) => {
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
    saveProgress(next);
    return { newBadges, promotion: after.min > before.min ? after.de : undefined, weekRecord: week.newRecord };
  };

  const finishCase = (run: CaseRun, daily: boolean) => {
    const scored = scoreRun(run, progress.streak);
    const result: ScoreResult = { ...scored, lines: [...scored.lines] };
    const { pointsPct } = equipmentEffects(progress);
    if (pointsPct > 0) {
      const extra = Math.round((scored.total * pointsPct) / 100);
      result.lines.push({ label: `Ausrüstung (+${pointsPct} %)`, points: extra });
      result.total += extra;
    }
    if (daily) {
      const extra = Math.round(scored.total * DAILY_CASE_BONUS);
      result.lines.push({ label: 'Einsatz des Tages (+50 %)', points: extra });
      result.total += extra;
    }
    const day = registerDailyCase(progress, daily);
    if (day.goalBonus > 0) {
      result.lines.push({ label: `Tagesziel erreicht (${day.progress.dayStreak}. Tag in Folge)`, points: day.goalBonus });
      result.total += day.goalBonus;
    }
    const id = run.medCase.id;
    const updated: Progress = {
      ...day.progress,
      streak: result.stars >= 2 ? progress.streak + 1 : 0,
      totalPoints: progress.totalPoints + result.total,
      casesPlayed: progress.casesPlayed + 1,
      correctDiagnoses: progress.correctDiagnoses + (result.diagnosisCorrect ? 1 : 0),
      bestStars: { ...progress.bestStars, [id]: Math.max(progress.bestStars[id] ?? 0, result.stars) },
      perfectRuns: progress.perfectRuns + (result.stars === 3 ? 1 : 0),
      hardWins: progress.hardWins + (run.difficulty === 'schwer' && result.stars >= 2 ? 1 : 0),
    };
    const { newBadges, promotion, weekRecord } = commit(updated);
    setScreen({ name: 'result', run, result, newBadges, goalBonus: day.goalBonus, promotion, weekRecord });
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

  /** Ausrüstung kaufen: kostet Budget, keine Punkte – der Dienstgrad bleibt. */
  const upgrade = (id: EquipmentId) => {
    const bought = buyUpgrade(progress, id);
    if (bought === progress) return;
    commit(bought);
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
    saveProgress(fresh);
    lastCaseId.current = undefined;
    setScreen({ name: 'home' });
  };

  const home = () => setScreen({ name: 'home' });

  const setDifficulty = (difficulty: Difficulty) => {
    const next = { ...progress, difficulty };
    setProgress(next);
    saveProgress(next);
  };

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.splash}>
        <StarOfLife size={72} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.body}>
          {screen.name === 'home' && (
            <HomeScreen
              progress={progress}
              onStart={() => startCase()}
              onDaily={() => startCase(true)}
              onDifficulty={setDifficulty}
              onLexikon={() => setScreen({ name: 'lexikon' })}
              onGuide={() => setScreen({ name: 'guide' })}
              onQuiz={() => setScreen({ name: 'quiz', key: Date.now() })}
              onKnowledge={() => setScreen({ name: 'wissen', key: Date.now() })}
              onCpr={() => setScreen({ name: 'cpr', key: Date.now() })}
              onManv={() => setScreen({ name: 'manv', key: Date.now() })}
              onGarage={() => setScreen({ name: 'garage' })}
            />
          )}
          {screen.name === 'lexikon' && <LexikonScreen progress={progress} onBack={home} />}
          {screen.name === 'guide' && <GuideScreen onBack={home} onReset={resetProgress} />}
          {screen.name === 'quiz' && (
            <QuizScreen key={screen.key} best={progress.quizBest} onFinish={finishQuiz} onBack={home} />
          )}
          {screen.name === 'wissen' && (
            <KnowledgeScreen key={screen.key} best={progress.knowBest} onFinish={finishKnowledge} onBack={home} />
          )}
          {screen.name === 'garage' && <GarageScreen progress={progress} onUpgrade={upgrade} onBack={home} />}
          {screen.name === 'manv' && <ManvScreen key={screen.key} best={progress.manvBest} onFinish={finishManv} onBack={home} />}
          {screen.name === 'cpr' && <CprScreen key={screen.key} best={progress.cprBest} onFinish={finishCpr} onBack={home} />}
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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.graphit },
  body: { flex: 1, backgroundColor: colors.grau50 },
  splash: { flex: 1, backgroundColor: colors.graphit, alignItems: 'center', justifyContent: 'center' },
});
