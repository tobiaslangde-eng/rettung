import { HILF_GESAMT_MAX, hilfGesamt } from './hilfspunkt';
import { WACHE_GESAMT_MAX, wacheGesamt } from './wache';
import { archiveCount } from './detective';
import { szenenFuer } from './gefahren';
import { HELFER_RANKS, RANKS } from './scoring';
import { Rolle } from './rolle';
import { KAPITEL } from './story';
import { Progress } from './storage';
import { PRUEFUNG_BESTANDEN } from './helferTraining';
import { todayKey } from './daily';
import { LABOR_ANZAHL } from './trainings';

export interface Urkunde {
  id: string;
  icon: string;
  titel: string;
  /** Satz auf der Urkunde nach „wird verliehen an …“ */
  text: string;
  /** Kurz: Was muss man tun? (für gesperrte Urkunden) */
  bedingung: string;
  erreicht: (p: Progress) => boolean;
}

const rangUrkunden = (rolle: Rolle): Urkunde[] => {
  const liste = rolle === 'helfer' ? HELFER_RANKS : RANKS;
  const was = rolle === 'helfer' ? 'als Ersthelfer/in' : 'im Rettungsdienst';
  return liste.slice(1).map((r) => ({
    id: 'rang-' + r.min,
    icon: '🎖️',
    titel: r.de,
    text: `hat ${was} den Rang „${r.de}“ erreicht.`,
    bedingung: `${r.min.toLocaleString('de-DE')} EP sammeln`,
    erreicht: (p: Progress) => p.totalPoints >= r.min,
  }));
};

const gemeinsam = (rolle: Rolle): Urkunde[] => [
  {
    id: 'herzdruck',
    icon: '❤️',
    titel: 'Herzdruck-Profi',
    text: 'hat die Herzdruckmassage im richtigen Takt gemeistert (mindestens 90 % Trefferquote).',
    bedingung: 'Herzdruckmassage mit 90 % schaffen',
    erreicht: (p) => p.cprBest >= 90,
  },
  {
    id: 'gefahren',
    icon: '⚠️',
    titel: 'Eigenschutz-Experte',
    text: 'hat im Gefahren-Check alle Einsatzstellen sicher eingeschätzt.',
    bedingung: 'Alle Szenen im Gefahren-Check lösen',
    erreicht: (p) => szenenFuer(rolle).every((s) => p.gefahrGeschafft.includes(s.id)),
  },
  {
    id: 'serie-7',
    icon: '🔥',
    titel: '7 Tage in Folge',
    text: 'hat 7 Tage hintereinander das Tagesziel erreicht und regelmäßig geübt.',
    bedingung: '7 Tage in Folge das Tagesziel schaffen',
    erreicht: (p) => p.bestDayStreak >= 7,
  },
  {
    id: 'serie-30',
    icon: '🏆',
    titel: '30 Tage in Folge',
    text: 'hat 30 Tage hintereinander das Tagesziel erreicht – das ist echte Ausdauer.',
    bedingung: '30 Tage in Folge das Tagesziel schaffen',
    erreicht: (p) => p.bestDayStreak >= 30,
  },
  {
    id: 'duell',
    icon: '⚔️',
    titel: 'Duell-Champion',
    text: 'hat 3 Duelle gegen Freunde gewonnen.',
    bedingung: '3 Duelle gewinnen',
    erreicht: (p) => p.duellSiege >= 3,
  },
  {
    id: 'labor',
    icon: '🧪',
    titel: 'Handgriff-Meister',
    text: 'hat im Handgriff-Labor alle Übungen gemeistert: vom Druckverband bis zur Rettungsdecke.',
    bedingung: 'Alle Übungen im Handgriff-Labor schaffen',
    erreicht: (p) => p.laborGeschafft.length >= LABOR_ANZAHL,
  },
  {
    id: 'staulotse',
    icon: '🚦',
    titel: 'Staulotse',
    text: 'hat auf der Stadtkarte zehnmal Staus und Baustellen clever umfahren.',
    bedingung: 'Auf der Stadtkarte 10-mal die schnellste Route wählen',
    erreicht: (p) => p.kartenRouten >= 10,
  },
  {
    id: 'karte',
    icon: '🗺️',
    titel: 'Einsatzleitung Stadtkarte',
    text: 'hat 10 Einsätze auf der Stadtkarte angefahren und in der richtigen Reihenfolge abgearbeitet.',
    bedingung: '10 Einsätze über die Stadtkarte fahren',
    erreicht: (p) => p.kartenEinsaetze >= 10,
  },
];

const helferUrkunden: Urkunde[] = [
  {
    id: 'kurs',
    icon: '🩹',
    titel: 'Erste-Hilfe-Kurs abgeschlossen',
    text: 'hat alle Kapitel des Erste-Hilfe-Kurses im Spiel abgeschlossen.',
    bedingung: 'Alle Kapitel der Geschichte abschließen',
    erreicht: (p) => p.story >= KAPITEL.helfer.length,
  },
  {
    id: 'pruefung',
    icon: '🎓',
    titel: 'Erste-Hilfe-Prüfung bestanden',
    text: `hat die Erste-Hilfe-Prüfung im Spiel bestanden (mindestens ${PRUEFUNG_BESTANDEN} von 20 Fragen richtig).`,
    bedingung: `Prüfung mit ${PRUEFUNG_BESTANDEN} von 20 bestehen`,
    erreicht: (p) => p.pruefungBest >= PRUEFUNG_BESTANDEN,
  },
  {
    id: 'hilfspunkt',
    icon: '💚',
    titel: 'Hilfspunkt komplett ausgebaut',
    text: 'hat den eigenen Hilfspunkt mit Apotheke, Defi-Station, Kursraum und Helfer-Netzwerk vollständig ausgebaut.',
    bedingung: 'Alle Bereiche des Hilfspunkts voll ausbauen',
    erreicht: (p) => hilfGesamt(p) >= HILF_GESAMT_MAX,
  },
];

const saniUrkunden: Urkunde[] = [
  {
    id: 'kapitel',
    icon: '🚑',
    titel: 'Ausbildung abgeschlossen',
    text: 'hat alle Kapitel der Ausbildung im Rettungsdienst-Spiel abgeschlossen.',
    bedingung: 'Alle Kapitel der Geschichte abschließen',
    erreicht: (p) => p.story >= KAPITEL.sani.length,
  },
  {
    id: 'detektiv',
    icon: '🔍',
    titel: 'Diagnose-Detektiv',
    text: 'hat 50 Detektiv-Akten gelöst und Krankheitsbilder zuverlässig erkannt.',
    bedingung: '50 Detektiv-Akten lösen',
    erreicht: (p) => archiveCount(p).solved >= 50,
  },
  {
    id: 'manv',
    icon: '🚨',
    titel: 'Sichtungs-Profi',
    text: 'hat beim Großeinsatz alle Verletzten richtig gesichtet.',
    bedingung: 'Großeinsatz mit 8 von 8 richtig',
    erreicht: (p) => p.manvBest >= 8,
  },
  {
    id: 'wache',
    icon: '🏥',
    titel: 'Rettungswache komplett ausgebaut',
    text: 'hat die eigene Rettungswache mit Halle, Funkraum, Lager, Ruheraum und Schulungsraum vollständig ausgebaut.',
    bedingung: 'Alle Bereiche der Wache voll ausbauen',
    erreicht: (p) => wacheGesamt(p) >= WACHE_GESAMT_MAX,
  },
];

export const urkundenFuer = (rolle: Rolle): Urkunde[] => [
  ...rangUrkunden(rolle),
  ...(rolle === 'helfer' ? helferUrkunden : saniUrkunden),
  ...gemeinsam(rolle),
];

/** Urkunden, die erreicht sind, aber noch kein Datum haben */
export const neueUrkunden = (rolle: Rolle, p: Progress): string[] =>
  urkundenFuer(rolle)
    .filter((u) => u.erreicht(p) && !p.urkundenDatum[u.id])
    .map((u) => u.id);

/** Datum für neu erreichte Urkunden eintragen (ändert nichts, wenn nichts neu ist) */
export function mitUrkundenDatum(rolle: Rolle, p: Progress, heute = todayKey()): Progress {
  const neu = neueUrkunden(rolle, p);
  if (neu.length === 0) return p;
  return { ...p, urkundenDatum: { ...p.urkundenDatum, ...Object.fromEntries(neu.map((id) => [id, heute])) } };
}

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
export function datumDeutsch(key: string): string {
  const [j, m, t] = key.split('-').map(Number);
  return `${t}. ${MONATE[(m || 1) - 1]} ${j}`;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Zeilenumbruch für den Urkundentext (grob nach Zeichenzahl) */
function umbrechen(text: string, max: number): string[] {
  const zeilen: string[] = [];
  let z = '';
  for (const w of text.split(' ')) {
    if ((z + ' ' + w).trim().length > max) {
      zeilen.push(z.trim());
      z = w;
    } else z = (z + ' ' + w).trim();
  }
  if (z) zeilen.push(z);
  return zeilen;
}

/** Die Urkunde als Bild (SVG, 800 × 566). Läuft ohne Schriftdateien, damit sie sich auch als PNG speichern lässt. */
export function urkundeSvg(o: { rolle: Rolle; titel: string; text: string; name: string; datum: string }): string {
  const farbe = o.rolle === 'helfer' ? '#0A8576' : '#C62E33';
  const hell = o.rolle === 'helfer' ? '#E3F5F1' : '#FDEDEC';
  const name = o.name.trim() || 'Name der Person';
  const zeilen = umbrechen(o.text, 56).slice(0, 4);
  const textY = 362;
  const titelGross = o.titel.length > 26 ? 34 : 42;
  const ecke = (x: number, y: number, sx: number, sy: number) =>
    `<path d="M${x} ${y + sy * 46} L${x} ${y} L${x + sx * 46} ${y}" stroke="${farbe}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 566" width="800" height="566">
<rect width="800" height="566" fill="#FFFDF7"/>
<rect x="18" y="18" width="764" height="530" fill="none" stroke="${farbe}" stroke-width="3"/>
<rect x="30" y="30" width="740" height="506" fill="none" stroke="${farbe}" stroke-width="1" opacity="0.6"/>
${ecke(40, 40, 1, 1)}${ecke(760, 40, -1, 1)}${ecke(40, 526, 1, -1)}${ecke(760, 526, -1, -1)}
<circle cx="400" cy="92" r="34" fill="${hell}" stroke="${farbe}" stroke-width="3"/>
<g transform="translate(400 92)" stroke="${farbe}" stroke-width="7" stroke-linecap="round">
<line x1="0" y1="-20" x2="0" y2="20"/><line x1="-17" y1="-10" x2="17" y2="10"/><line x1="-17" y1="10" x2="17" y2="-10"/></g>
<text x="400" y="168" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="bold" letter-spacing="10" fill="${farbe}">URKUNDE</text>
<text x="400" y="204" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#5A6A68">Einsatz 112 · Das Lernspiel</text>
<text x="400" y="262" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#5A6A68">Diese Urkunde wird mit Stolz verliehen an</text>
<text x="400" y="318" text-anchor="middle" font-family="Georgia, serif" font-size="${name.length > 22 ? 36 : 46}" font-weight="bold" fill="#17302E">${esc(name)}</text>
<line x1="170" y1="332" x2="630" y2="332" stroke="${farbe}" stroke-width="2"/>
${zeilen.map((z, i) => `<text x="400" y="${textY + i * 24}" text-anchor="middle" font-family="Georgia, serif" font-size="19" fill="#17302E">${esc(z)}</text>`).join('\n')}
<text x="400" y="${textY + zeilen.length * 24 + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="${titelGross}" font-weight="bold" fill="${farbe}">${esc(o.titel)}</text>
<text x="110" y="500" font-family="Georgia, serif" font-size="16" fill="#17302E">${esc(o.datum)}</text>
<line x1="100" y1="480" x2="260" y2="480" stroke="#17302E" stroke-width="1"/>
<text x="700" y="500" text-anchor="end" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#17302E">${o.rolle === 'helfer' ? 'Kati, Kursleitung' : 'Kati, Ausbildungsleitung'}</text>
<line x1="540" y1="480" x2="700" y2="480" stroke="#17302E" stroke-width="1"/>
<text x="400" y="526" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#7A8886">Spiel-Urkunde – ersetzt keine Ausbildung und keinen Erste-Hilfe-Kurs.</text>
</svg>`;
}
