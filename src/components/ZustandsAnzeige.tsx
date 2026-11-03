import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { colors, fonts, spacing, type } from '../theme';
import { PatientGesicht } from './Gesicht';
import { Bar } from './UI';

const SCHLUESSEL = 'e112.zustand.ansicht';
type Ansicht = 'monitor' | 'balken';

/** Welche Anzeige zuletzt gewählt war (nur im Browser gemerkt, sonst Monitor) */
function ladeAnsicht(): Ansicht {
  if (Platform.OS === 'web') {
    try {
      if (localStorage.getItem(SCHLUESSEL) === 'balken') return 'balken';
    } catch {
      // egal
    }
  }
  return 'monitor';
}
function speichereAnsicht(a: Ansicht) {
  if (Platform.OS !== 'web') return;
  try {
    localStorage.setItem(SCHLUESSEL, a);
  } catch {
    // egal
  }
}

export const zustandFarbe = (z: number) => (z >= 70 ? colors.mint : z >= 40 ? colors.orange : colors.red);
export const zustandWort = (z: number) => (z >= 70 ? 'STABIL' : z >= 40 ? 'ANGESCHLAGEN' : 'KRITISCH');
const zustandKurz = (z: number) => (z >= 70 ? '🙂' : z >= 40 ? '😣' : '😵');
/** Monitorfarben (der Monitor bleibt auch im hellen Modus dunkel wie ein echtes Gerät) */
const MONITOR = { bg: '#0B1F24', gitter: 'rgba(255,255,255,0.07)', gruen: '#4ADE80', gelb: '#FBBF24', rot: '#F87171' };
const kurveFarbe = (z: number) => (z >= 70 ? MONITOR.gruen : z >= 40 ? MONITOR.gelb : MONITOR.rot);

// ───────── Herzschlag-Kurve ─────────
const gauss = (x: number, mitte: number, breite: number, hoehe: number) => hoehe * Math.exp(-((x - mitte) ** 2) / (2 * breite * breite));
/** Ein Herzschlag (P-Welle, QRS-Komplex, T-Welle) bei Phase 0–1 */
const schlag = (p: number) =>
  gauss(p, 0.14, 0.03, 0.14) - gauss(p, 0.235, 0.008, 0.16) + gauss(p, 0.25, 0.009, 1) - gauss(p, 0.268, 0.009, 0.28) + gauss(p, 0.47, 0.055, 0.3);

/** Pseudozufall aus einer Zahl (0–1), damit unregelmäßige Schläge nicht flackern */
const zufall = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Schlag {
  start: number;
  dauer: number;
  hoehe: number;
}

/** Wie schnell, wie unregelmäßig und wie flach der Herzschlag bei diesem Zustand ist */
function rhythmus(z: number) {
  const bpm = 70 + (100 - z) * 0.75; // 70 → 145 /min
  const unruhe = z >= 70 ? 0 : Math.min(0.45, ((70 - z) / 55) * 0.45);
  const hoehe = z >= 70 ? 1 : 1 - ((70 - z) / 70) * 0.55;
  return { dauer: 60 / bpm, unruhe, hoehe };
}

const SEKUNDEN = 3.2;
const BREITE = 150;
const HOEHE = 44;

function HerzKurve({ zustand }: { zustand: number }) {
  const [, setTakt] = useState(0);
  const z = useRef(zustand);
  z.current = zustand;
  const schlaege = useRef<Schlag[]>([]);
  const zeit0 = useRef(Date.now());
  const zaehler = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTakt((n) => (n + 1) % 1e6), 70);
    return () => clearInterval(t);
  }, []);

  const jetzt = (Date.now() - zeit0.current) / 1000;
  const liste = schlaege.current;
  // neue Schläge anhängen, solange die Kurve sie noch braucht
  while (liste.length === 0 || liste[liste.length - 1].start + liste[liste.length - 1].dauer < jetzt + 0.1) {
    const r = rhythmus(z.current);
    const ende = liste.length ? liste[liste.length - 1].start + liste[liste.length - 1].dauer : jetzt - SEKUNDEN;
    zaehler.current += 1;
    const schwankung = 1 + (zufall(zaehler.current) - 0.5) * 2 * r.unruhe;
    const hoehe = r.hoehe * (z.current < 25 ? 0.5 + zufall(zaehler.current + 9) * 0.5 : 1);
    liste.push({ start: ende, dauer: Math.max(0.25, r.dauer * schwankung), hoehe });
  }
  while (liste.length > 2 && liste[1].start < jetzt - SEKUNDEN) liste.shift();

  // Kurve von links (alt) nach rechts (jetzt)
  let pfad = '';
  const schritt = 2;
  let idx = 0;
  for (let x = 0; x <= BREITE; x += schritt) {
    const t = jetzt - ((BREITE - x) / BREITE) * SEKUNDEN;
    while (idx < liste.length - 1 && liste[idx + 1].start <= t) idx++;
    const s = liste[idx];
    let y = 0;
    if (s && t >= s.start) y = schlag((t - s.start) / s.dauer) * s.hoehe;
    // bei sehr schlechtem Zustand kommt ein feines Zittern dazu
    if (z.current < 30) y += (zufall(Math.floor(t * 40)) - 0.5) * 0.12;
    const py = HOEHE * 0.72 - y * HOEHE * 0.62;
    pfad += `${x === 0 ? 'M' : 'L'}${x} ${py.toFixed(1)} `;
  }
  const farbe = kurveFarbe(zustand);
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${BREITE} ${HOEHE}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f) => (
        <Line key={f} x1={0} y1={HOEHE * f} x2={BREITE} y2={HOEHE * f} stroke={MONITOR.gitter} strokeWidth={0.6} />
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((f) => (
        <Line key={f} x1={BREITE * f} y1={0} x2={BREITE * f} y2={HOEHE} stroke={MONITOR.gitter} strokeWidth={0.6} />
      ))}
      <Path d={pfad} fill="none" stroke={farbe} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Zustand des Patienten: Gesicht (blass, schwitzend, müde) und Herzmonitor (schneller, flacher, unruhiger).
 * Ein Tipp wechselt zur einfachen Balkenanzeige und zurück.
 */
export function ZustandsAnzeige({
  zustand,
  vorname,
  alter,
  geschlecht,
  kennung,
  verschlechtert,
}: {
  zustand: number;
  vorname: string;
  alter: number;
  geschlecht: 'm' | 'w';
  kennung: string;
  verschlechtert?: boolean;
}) {
  const [ansicht, setAnsicht] = useState<Ansicht>(ladeAnsicht);
  const [blink, setBlink] = useState(false);
  const kritisch = zustand < 40;
  useEffect(() => {
    if (!kritisch) {
      setBlink(false);
      return;
    }
    const t = setInterval(() => setBlink((b) => !b), 450);
    return () => clearInterval(t);
  }, [kritisch]);
  const farbe = zustandFarbe(zustand);
  const wechsel = () => {
    const neu: Ansicht = ansicht === 'monitor' ? 'balken' : 'monitor';
    setAnsicht(neu);
    speichereAnsicht(neu);
  };
  return (
    <Pressable
      onPress={wechsel}
      accessibilityRole="button"
      accessibilityLabel={`Zustand von ${vorname}: ${Math.round(zustand)} Prozent, ${zustandWort(zustand)}. Tippen zum Wechseln der Anzeige`}
      style={[styles.karte, kritisch && { borderColor: blink ? colors.red : colors.line, borderWidth: blink ? 2 : 1 }]}
    >
      {ansicht === 'monitor' ? (
        <>
          <View style={[styles.gesicht, { borderColor: farbe }]}>
            <PatientGesicht age={alter} sex={geschlecht} seed={kennung} size={54} zustand={zustand} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.kopf}>
              <Text style={styles.label} numberOfLines={1}>
                {vorname}
                {verschlechtert ? ' · sinkt!' : ''}
              </Text>
              <View style={[styles.chip, { backgroundColor: farbe, opacity: kritisch && blink ? 0.55 : 1 }]}>
                <Text style={styles.chipText}>
                  {kritisch ? '⚠ ' : ''}
                  {zustandWort(zustand)} · {Math.round(zustand)} %
                </Text>
              </View>
            </View>
            <View style={styles.monitor}>
              <HerzKurve zustand={zustand} />
              <Text style={[styles.herz, { color: kurveFarbe(zustand), opacity: blink || !kritisch ? 1 : 0.4 }]}>♥</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.stimmung}>
            <Text style={styles.stimmungText}>{zustandKurz(zustand)}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.kopf}>
              <Text style={styles.label} numberOfLines={1}>
                Zustand von {vorname}
                {verschlechtert ? ' · verschlechtert sich!' : ''}
              </Text>
              <Text style={styles.wert}>{Math.round(zustand)}%</Text>
            </View>
            <Bar pct={zustand / 100} color={farbe} height={14} />
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  karte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  gesicht: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.surface },
  kopf: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  label: { ...type.eyebrow, flex: 1, fontSize: 10.5 },
  chip: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2 },
  chipText: { fontFamily: fonts.displayBlack, fontSize: 11, letterSpacing: 0.2, color: '#0B1F24' },
  monitor: { height: 40, borderRadius: 10, backgroundColor: MONITOR.bg, overflow: 'hidden', justifyContent: 'center' },
  herz: { position: 'absolute', right: 8, top: 4, fontSize: 14 },
  stimmung: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.yellowTint, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  stimmungText: { fontFamily: fonts.regular, fontSize: 22, lineHeight: 28 },
  wert: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink, letterSpacing: -0.4 },
});
