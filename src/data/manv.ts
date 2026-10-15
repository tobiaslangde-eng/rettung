/**
 * Großeinsatz (MANV – Massenanfall von Verletzten): Ich sichte als Erste/r vor Ort
 * nach einem vereinfachten mSTaRT-Schema für Erwachsene.
 */
import { colors } from '../theme';

export type Triage = 'rot' | 'gelb' | 'gruen' | 'schwarz';

export const TRIAGE: Record<Triage, { label: string; short: string; color: string; text: string }> = {
  rot: { label: 'Rot', short: 'SK I', color: colors.red, text: 'Sofort behandeln – akute Lebensgefahr' },
  gelb: { label: 'Gelb', short: 'SK II', color: colors.yellow, text: 'Dringend – schwer verletzt, aber stabil' },
  gruen: { label: 'Grün', short: 'SK III', color: '#3DD16F', text: 'Leicht verletzt – kann warten' },
  schwarz: { label: 'Schwarz', short: 'ex', color: '#000000', text: 'Keine Atmung trotz freier Atemwege' },
};

export const TRIAGE_ORDER: Triage[] = ['rot', 'gelb', 'gruen', 'schwarz'];

export interface ManvPatient {
  id: string;
  /** z. B. „Mann, ca. 45“ */
  who: string;
  text: string;
  walks: boolean;
  /** Spritzende, lebensbedrohliche Blutung */
  bleeding?: boolean;
  /** Atmet: ja / erst nach Freimachen der Atemwege / nein */
  breathing?: 'ja' | 'nach Freimachen' | 'nein';
  /** Atemfrequenz pro Minute */
  af?: number;
  /** Puls am Handgelenk tastbar */
  radial?: boolean;
  /** Rekapillarisierungszeit in Sekunden */
  recap?: number;
  /** Befolgt einfache Aufforderungen */
  obeys?: boolean;
}

/** Sichtung nach dem Schema – liefert die Kategorie und den ausschlaggebenden Grund. */
export function triage(p: ManvPatient): { cat: Triage; reason: string } {
  if (p.walks) return { cat: 'gruen', reason: 'Gehfähig – leicht verletzt, später erneut sichten.' };
  if (p.bleeding) return { cat: 'rot', reason: 'Spritzende Blutung – sofort stoppen (Druckverband, Tourniquet).' };
  if (p.breathing === 'nein') return { cat: 'schwarz', reason: 'Keine Atmung, auch nach Freimachen der Atemwege.' };
  if (p.breathing === 'nach Freimachen') return { cat: 'rot', reason: 'Atmet erst nach Freimachen der Atemwege – Atemweg gefährdet.' };
  if ((p.af ?? 0) > 30) return { cat: 'rot', reason: 'Atemfrequenz über 30 pro Minute.' };
  if (p.radial === false || (p.recap ?? 0) > 2) return { cat: 'rot', reason: 'Schockzeichen: Radialispuls fehlt oder Rekapillarisierung über 2 Sekunden.' };
  if (p.obeys === false) return { cat: 'rot', reason: 'Befolgt keine Aufforderungen – Bewusstsein gestört.' };
  return { cat: 'gelb', reason: 'Nicht gehfähig, aber Atmung, Kreislauf und Bewusstsein stabil.' };
}

const lying = { walks: false, breathing: 'ja' as const };

export const MANV_PATIENTS: ManvPatient[] = [
  { id: 'm1', who: 'Frau, ca. 30', text: 'Läuft weinend umher, Schnittwunde an der Hand.', walks: true },
  { id: 'm2', who: 'Mann, ca. 45', text: 'Eingeklemmt im Sitz, aus dem Oberschenkel spritzt hellrotes Blut.', walks: false, bleeding: true },
  { id: 'm3', who: 'Mann, ca. 60', text: 'Liegt neben dem Bus, keine Atembewegung. Auch nach Überstrecken des Kopfes keine Atmung.', walks: false, breathing: 'nein' },
  { id: 'm4', who: 'Frau, ca. 25', text: 'Unterschenkel verformt, starke Schmerzen, kann nicht aufstehen.', ...lying, af: 22, radial: true, recap: 1, obeys: true },
  { id: 'm5', who: 'Mann, ca. 35', text: 'Prellmarken am Brustkorb, atmet hastig und flach.', ...lying, af: 36, radial: true, recap: 1.5, obeys: true },
  { id: 'm6', who: 'Frau, ca. 50', text: 'Sitzt am Straßenrand, Schmerzen im Becken, blass und kaltschweißig.', ...lying, af: 24, radial: false, recap: 3, obeys: true },
  { id: 'm7', who: 'Jugendlicher, ca. 17', text: 'Platzwunde am Kopf, steht und läuft zu seinen Freunden.', walks: true },
  { id: 'm8', who: 'Mann, ca. 70', text: 'Liegt auf dem Rücken, Augen geschlossen, reagiert nur auf Schmerz.', ...lying, af: 18, radial: true, recap: 1.5, obeys: false },
  { id: 'm9', who: 'Frau, ca. 40', text: 'Bauchschmerzen nach dem Sicherheitsgurt, liegt gekrümmt.', ...lying, af: 24, radial: true, recap: 1.5, obeys: true },
  { id: 'm10', who: 'Mann, ca. 28', text: 'Hält sich den gebrochenen Arm, geht selbst zum Sammelplatz.', walks: true },
  { id: 'm11', who: 'Mann, ca. 55', text: 'Liegt im Graben, Oberschenkel schmerzt, Haut grau.', ...lying, af: 26, radial: true, recap: 4, obeys: true },
  { id: 'm12', who: 'Frau, ca. 65', text: 'Starke Hüftschmerzen, kann nicht aufstehen, ansonsten wach und klar.', ...lying, af: 20, radial: true, recap: 1, obeys: true },
  { id: 'm13', who: 'Mann, ca. 22', text: 'Liegt bewusstlos, atmet erst, nachdem ich den Kopf überstrecke und den Kiefer anhebe.', walks: false, breathing: 'nach Freimachen' },
  { id: 'm14', who: 'Frau, ca. 48', text: 'Verbrennungen an beiden Unterarmen, geht selbst zur Seite.', walks: true },
  { id: 'm15', who: 'Mann, ca. 38', text: 'Rückenschmerzen, kann die Beine kaum bewegen, ist wach und ansprechbar.', ...lying, af: 18, radial: true, recap: 1, obeys: true },
  { id: 'm16', who: 'Frau, ca. 29', text: 'Tiefe Wunde am Oberarm, das Blut spritzt im Takt des Herzschlags.', walks: false, bleeding: true },
  { id: 'm17', who: 'Mann, ca. 80', text: 'Liegt eingeklemmt, keine Atmung – auch nicht nach Freimachen der Atemwege.', walks: false, breathing: 'nein' },
  { id: 'm18', who: 'Frau, ca. 36', text: 'Gesichtsverletzung, ringt nach Luft.', ...lying, af: 32, radial: true, recap: 1.5, obeys: true },
  { id: 'm19', who: 'Mann, ca. 50', text: 'Offene Wunde am Oberschenkel, blutet stark aber nicht spritzend, sehr blass.', ...lying, af: 24, radial: false, recap: 2.5, obeys: true },
  { id: 'm20', who: 'Frau, ca. 19', text: 'Schreit und läuft aufgeregt herum, keine sichtbaren Verletzungen.', walks: true },
  { id: 'm21', who: 'Mann, ca. 44', text: 'Knie verletzt, kann nicht auftreten, ruhig und orientiert.', ...lying, af: 16, radial: true, recap: 1, obeys: true },
  { id: 'm22', who: 'Frau, ca. 58', text: 'Prellung am Brustkorb, Schmerzen beim Atmen.', ...lying, af: 28, radial: true, recap: 1.5, obeys: true },
  { id: 'm23', who: 'Mann, ca. 33', text: 'Verwirrt, beantwortet Fragen nicht, Platzwunde am Hinterkopf, liegt.', ...lying, af: 20, radial: true, recap: 1, obeys: false },
  { id: 'm24', who: 'Frau, ca. 70', text: 'Sitzt im Bus, Brustschmerz, kann nicht aufstehen, Haut feucht und kühl.', ...lying, af: 24, radial: true, recap: 3, obeys: true },
];

export const MANV_ROUND = 8;
export const MANV_POINTS = 15;
/** Bonus, wenn alle Patienten richtig gesichtet sind */
export const MANV_PERFECT_BONUS = 30;

export const MANV_SCENARIOS = [
  'Busunfall auf der A7 bei Hannover',
  'Massenkarambolage im Nebel auf der A1 bei Bremen',
  'Gerüsteinsturz auf einem Stadtfest in Nürnberg',
  'Zugunglück bei Göttingen',
  'Explosion in einer Lagerhalle in Duisburg',
];
