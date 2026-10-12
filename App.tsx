import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CASES, MedCase } from './src/data/cases';
import { CaseRun, ScoreResult, scoreRun } from './src/game/scoring';
import { EMPTY_PROGRESS, Progress, loadProgress, saveProgress } from './src/game/storage';
import { CaseScreen } from './src/screens/CaseScreen';
import { GuideScreen } from './src/screens/GuideScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LexikonScreen } from './src/screens/LexikonScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { colors } from './src/theme';

type Screen =
  | { name: 'home' }
  | { name: 'lexikon' }
  | { name: 'guide' }
  | { name: 'case'; medCase: MedCase; key: number }
  | { name: 'result'; run: CaseRun; result: ScoreResult };

/** Wählt bevorzugt Fälle, die noch nicht gemeistert wurden, und nie den gleichen Fall zweimal hintereinander. */
function pickCase(progress: Progress, lastId?: string): MedCase {
  const pool = CASES.filter((c) => c.id !== lastId);
  const open = pool.filter((c) => (progress.bestStars[c.id] ?? 0) < 3);
  const from = open.length > 0 ? open : pool;
  return from[Math.floor(Math.random() * from.length)];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const lastCaseId = useRef<string | undefined>(undefined);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const startCase = () => {
    const medCase = pickCase(progress, lastCaseId.current);
    lastCaseId.current = medCase.id;
    setScreen({ name: 'case', medCase, key: Date.now() });
  };

  const finishCase = (run: CaseRun) => {
    const result = scoreRun(run);
    const id = run.medCase.id;
    const next: Progress = {
      totalPoints: progress.totalPoints + result.total,
      casesPlayed: progress.casesPlayed + 1,
      correctDiagnoses: progress.correctDiagnoses + (result.diagnosisCorrect ? 1 : 0),
      bestStars: { ...progress.bestStars, [id]: Math.max(progress.bestStars[id] ?? 0, result.stars) },
    };
    setProgress(next);
    saveProgress(next);
    setScreen({ name: 'result', run, result });
  };

  const home = () => setScreen({ name: 'home' });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.body}>
          {screen.name === 'home' && (
            <HomeScreen
              progress={progress}
              onStart={startCase}
              onLexikon={() => setScreen({ name: 'lexikon' })}
              onGuide={() => setScreen({ name: 'guide' })}
            />
          )}
          {screen.name === 'lexikon' && <LexikonScreen progress={progress} onBack={home} />}
          {screen.name === 'guide' && <GuideScreen onBack={home} />}
          {screen.name === 'case' && (
            <CaseScreen key={screen.key} medCase={screen.medCase} onFinish={finishCase} onAbort={home} />
          )}
          {screen.name === 'result' && (
            <ResultScreen run={screen.run} result={screen.result} onNext={startCase} onHome={home} />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.must },
  body: { flex: 1, backgroundColor: colors.linen },
});
