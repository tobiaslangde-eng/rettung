import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from './difficulty';

const KEY = 'kiirabi.progress.v1';

export interface Progress {
  totalPoints: number;
  casesPlayed: number;
  correctDiagnoses: number;
  /** Beste Sternewertung je Fall-ID */
  bestStars: Record<string, number>;
  /** Zuletzt gewählte Schwierigkeit */
  difficulty: Difficulty;
  /** Einsätze in Folge mit mindestens 2 Sternen */
  streak: number;
}

export const EMPTY_PROGRESS: Progress = {
  totalPoints: 0,
  casesPlayed: 0,
  correctDiagnoses: 0,
  bestStars: {},
  difficulty: 'leicht',
  streak: 0,
};

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...EMPTY_PROGRESS, ...JSON.parse(raw) } : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export async function saveProgress(p: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Fortschritt ist optional – Spiel läuft auch ohne Speicher weiter.
  }
}
