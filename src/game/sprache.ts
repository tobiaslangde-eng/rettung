import { Platform } from 'react-native';

/** Sprachausgabe (nur Web, Browser-Stimme): Gerät und Leitstelle „sprechen“. Ein/aus wird im Browser gemerkt. */
const KEY = 'e112.ton';

export const spracheMoeglich = (): boolean =>
  Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window;

export function tonAn(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setzeTon(an: boolean): void {
  try {
    localStorage.setItem(KEY, an ? '1' : '0');
  } catch {
    // ohne Speicher: gilt nur bis zum Neuladen
  }
  if (!an) stoppe();
}

export function stoppe(): void {
  if (spracheMoeglich()) window.speechSynthesis.cancel();
}

/** Text vorlesen, wenn der Ton an ist. `geraet` = etwas tiefer und gleichmäßiger wie eine Gerätestimme. */
export function sprich(text: string, optionen?: { geraet?: boolean; aufgeregt?: boolean }): void {
  if (!spracheMoeglich() || !tonAn() || !text) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[„“"]/g, ''));
  u.lang = 'de-DE';
  const stimme = s.getVoices().find((v) => v.lang.toLowerCase().startsWith('de'));
  if (stimme) u.voice = stimme;
  u.rate = optionen?.geraet ? 0.92 : optionen?.aufgeregt ? 1.12 : 1;
  u.pitch = optionen?.geraet ? 0.7 : optionen?.aufgeregt ? 1.15 : 1;
  s.speak(u);
}

// ───────── Monitor-Piepton ─────────
let audio: AudioContext | null = null;

/** Kurzer Piepton wie ein Überwachungsmonitor (nur Web, nur wenn der Ton an ist). `hoch` = dringlicher Ton. */
export function piepe(hoch = false): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !tonAn()) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audio = audio ?? new AC();
    if (audio.state === 'suspended') void audio.resume();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = 'sine';
    o.frequency.value = hoch ? 1040 : 800;
    const t = audio.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g);
    g.connect(audio.destination);
    o.start(t);
    o.stop(t + 0.1);
  } catch {
    // ohne Ton geht es auch
  }
}

/** Beliebiger kurzer Ton (Web, nur wenn der Ton an ist): für Alarm, Defibrillator und Gerätegeräusche im Simulator */
export function spieleTon(freq: number, dauer = 0.12, laut = 0.05, typ: OscillatorType = 'sine', verzug = 0, bis?: number): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !tonAn()) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audio = audio ?? new AC();
    if (audio.state === 'suspended') void audio.resume();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = typ;
    const t = audio.currentTime + verzug;
    o.frequency.setValueAtTime(freq, t);
    if (bis) o.frequency.exponentialRampToValueAtTime(bis, t + dauer);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(laut, t + Math.min(0.01, dauer / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(g);
    g.connect(audio.destination);
    o.start(t);
    o.stop(t + dauer + 0.02);
  } catch {
    // ohne Ton geht es auch
  }
}
