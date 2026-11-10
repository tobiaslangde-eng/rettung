import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { AtemQuelle, EkgQuelle } from '../game/ekgLive';
import { alarmStatus, clamp, mmss, sichtbar, SimState } from '../game/simulator';
import { Tap } from './UI';
import { fonts } from '../theme';

/** Farben wie auf einem echten Überwachungsmonitor (bleiben in beiden Modi dunkel) */
export const MON = {
  bg: '#04110F',
  rand: '#16342F',
  gitter: 'rgba(120,255,200,0.06)',
  hf: '#35F28F',
  spo2: '#4CD7FF',
  rr: '#FF5A6A',
  af: '#FFE226',
  temp: '#FFA033',
  bz: '#C79BFF',
  text: '#CFEFE6',
  leise: '#6E8F88',
};

export interface Quellen {
  ekg: EkgQuelle;
  atem: AtemQuelle;
}

const FS = 50; // Messpunkte pro Sekunde
const SEK = 4; // Sekunden pro Bildschirmbreite
const N = FS * SEK;
const LUECKE = 9;

interface Spuren {
  ekg: Float32Array;
  pleth: Float32Array;
  atem: Float32Array;
  w: number;
  tAlt: number;
}

/** Eine Kurve zeichnen: wie ein echter Monitor läuft der Strich von links nach rechts und löscht dabei vor sich her */
function pfad(buf: Float32Array, w: number, hoehe: number, basis: number, skala: number): string {
  let d = '';
  let unterbrochen = true;
  for (let i = 0; i < N; i++) {
    const voraus = (i - w + N) % N;
    if (voraus < LUECKE) {
      unterbrochen = true;
      continue;
    }
    const y = Math.max(2, Math.min(hoehe - 2, basis - buf[i] * skala));
    d += `${unterbrochen ? 'M' : 'L'}${i} ${y.toFixed(1)} `;
    unterbrochen = false;
  }
  return d;
}

function Kurve({ d, farbe, hoehe, aus, text }: { d: string; farbe: string; hoehe: number; aus?: boolean; text?: string }) {
  return (
    <View style={{ height: hoehe, justifyContent: 'center' }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${N} ${hoehe}`} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <Line key={f} x1={0} y1={hoehe * f} x2={N} y2={hoehe * f} stroke={MON.gitter} strokeWidth={1} />
        ))}
        {aus ? (
          <Line x1={0} y1={hoehe / 2} x2={N} y2={hoehe / 2} stroke={MON.leise} strokeWidth={1.4} strokeDasharray="5 6" opacity={0.5} />
        ) : (
          <Path d={d} fill="none" stroke={farbe} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" />
        )}
      </Svg>
      {aus && !!text && <Text style={styles.aus}>{text}</Text>}
    </View>
  );
}

/** Zeitpunkt des letzten Herzschlags, der schon passiert ist */
function letzterVor(sl: number[], t: number): number {
  for (let i = sl.length - 1; i >= 0; i--) if (sl[i] <= t) return sl[i];
  return 0;
}

const alt = (t: number, jetzt: number) => {
  const m = Math.round((jetzt - t) / 60);
  return m < 1 ? 'gerade eben' : `vor ${m} min`;
};

/**
 * Überwachungsmonitor des Simulators: EKG, Pulskurve und Atemkurve laufen live mit; Zahlen erscheinen erst,
 * wenn das passende Gerät angelegt ist. Alarme blinken und lassen sich stumm schalten.
 */
export function SimMonitor({
  sim,
  quellen,
  onStumm,
  ton,
}: {
  sim: SimState;
  quellen: Quellen;
  onStumm: () => void;
  /** Wird bei jedem Herzschlag aufgerufen (für den Piepton) */
  ton?: (spo2: number) => void;
}) {
  const [, setTakt] = useState(0);
  const sp = useRef<Spuren>({ ekg: new Float32Array(N), pleth: new Float32Array(N), atem: new Float32Array(N), w: 0, tAlt: -1 });
  const letzterSchlag = useRef(0);
  const s = useRef(sim);
  s.current = sim;
  const tonRef = useRef(ton);
  tonRef.current = ton;

  useEffect(() => {
    const id = setInterval(() => {
      const z = s.current;
      const jetzt = z.t;
      const k = sp.current;
      let t = k.tAlt < 0 ? jetzt - 1 / FS : k.tAlt;
      if (jetzt - t > 1) t = jetzt - 1;
      const cpr = z.cpr.an && !z.cpr.pause && !z.kreislauf;
      while (t + 1 / FS <= jetzt) {
        t += 1 / FS;
        const art = cpr ? 0.9 * Math.sin(2 * Math.PI * 1.83 * t) : 0;
        const amp = z.kreislauf ? clamp(z.w.sys / 120, 0.12, 1.15) * clamp((z.w.spo2 - 40) / 55, 0.25, 1) : cpr ? 0.35 : 0;
        k.ekg[k.w] = quellen.ekg.wert(t) + art * 0.8;
        k.pleth[k.w] = quellen.ekg.puls(t, amp) + (cpr ? 0.35 * Math.max(0, Math.sin(2 * Math.PI * 1.83 * t - 0.6)) : 0);
        k.atem[k.w] = quellen.atem.wert(t);
        k.w = (k.w + 1) % N;
      }
      k.tAlt = t;
      // Piepton im Herztakt
      const letzter = letzterVor(quellen.ekg.schlaege, jetzt);
      if (z.kreislauf && z.geraete.spo2 && letzter > letzterSchlag.current) {
        letzterSchlag.current = letzter;
        tonRef.current?.(z.w.spo2);
      }
      setTakt((n) => (n + 1) % 1e6);
    }, 70);
    return () => clearInterval(id);
  }, [quellen]);

  const z = sim;
  const g = z.geraete;
  const w = sichtbar(z);
  const k = sp.current;
  const alarm = alarmStatus(z);
  const stumm = z.t < z.alarmStumm;
  const blink = Math.floor(Date.now() / 450) % 2 === 0;
  const alarmAn = alarm.prio !== null;
  const hfFarbe = z.rhythmus === 'vf' || z.rhythmus === 'asystolie' ? MON.rr : MON.hf;
  const herz = z.kreislauf && z.t - letzterVor(quellen.ekg.schlaege, z.t) < 0.2;
  const spo2Farbe = w.spo2 !== null && w.spo2 < 90 ? MON.rr : w.spo2 !== null && w.spo2 < 94 ? MON.af : MON.spo2;
  return (
    <View style={[styles.box, alarmAn && !stumm && blink && { borderColor: alarm.prio === 'hoch' ? '#FF3B4A' : '#FFC531' }]}>
      {alarmAn && (
        <Tap
          onPress={onStumm}
          accessibilityLabel={stumm ? 'Alarm ist stumm geschaltet' : 'Alarm stumm schalten'}
          style={[styles.alarm, { backgroundColor: alarm.prio === 'hoch' ? '#B3141F' : '#9A6B00', opacity: stumm ? 0.55 : blink ? 1 : 0.8 }]}
        >
          <Text style={styles.alarmText}>
            {stumm ? '🔕' : '🔔'} {alarm.text}
            {stumm ? `  ·  stumm ${mmss(z.alarmStumm - z.t)}` : '  ·  Tippen = stumm'}
          </Text>
        </Tap>
      )}
      <View style={styles.reihe}>
        <View style={styles.spuren}>
          <Text style={[styles.kanal, { color: MON.hf }]}>
            II {z.rhythmus === 'vf' ? 'Kammerflimmern' : z.rhythmus === 'asystolie' ? 'Asystolie' : z.rhythmus === 'pea' ? '' : ''}
          </Text>
          <Kurve d={pfad(k.ekg, k.w, 54, 34, 29)} farbe={hfFarbe} hoehe={54} aus={!g.ekg && !g.pads} text="Kein EKG – Elektroden kleben" />
          <Text style={[styles.kanal, { color: MON.spo2 }]}>PLETH</Text>
          <Kurve d={pfad(k.pleth, k.w, 32, 27, 19)} farbe={MON.spo2} hoehe={32} aus={!g.spo2} text="Kein Pulsoxymeter" />
          <Text style={[styles.kanal, { color: MON.af }]}>ATMUNG</Text>
          <Kurve d={pfad(k.atem, k.w, 24, 20, 15)} farbe={MON.af} hoehe={24} aus={!g.ekg} text="" />
        </View>
        <View style={styles.zahlen}>
          <View style={styles.zeile}>
            <Text style={[styles.einheit, { color: MON.hf }]}>HF</Text>
            <Text style={[styles.gross, { color: MON.hf }]}>{w.hf ?? '--'}</Text>
            <Text style={[styles.herz, { color: MON.hf, opacity: herz ? 1 : 0.25 }]}>♥</Text>
          </View>
          <View style={styles.zeile}>
            <Text style={[styles.einheit, { color: MON.spo2 }]}>SpO₂</Text>
            <Text style={[styles.gross, { color: spo2Farbe }]}>{w.spo2 ?? '--'}</Text>
          </View>
          <View style={styles.zeile}>
            <Text style={[styles.einheit, { color: MON.rr }]}>RR</Text>
            <Text style={[styles.mittel, { color: MON.rr }]}>{w.nibp ? `${w.nibp.sys}/${w.nibp.dia}` : '--/--'}</Text>
          </View>
          {w.nibp && <Text style={styles.klein}>{alt(w.nibp.t, z.t)}</Text>}
          <View style={styles.zeile}>
            <Text style={[styles.einheit, { color: MON.af }]}>AF</Text>
            <Text style={[styles.mittel, { color: MON.af }]}>{w.af ?? '--'}</Text>
          </View>
          <View style={styles.chips}>
            {w.bz && <Text style={[styles.chip, { color: MON.bz }]}>BZ {w.bz.wert}</Text>}
            {w.temp && <Text style={[styles.chip, { color: MON.temp }]}>{w.temp.wert.toFixed(1).replace('.', ',')}°</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: MON.bg, borderRadius: 18, borderWidth: 2, borderColor: MON.rand, overflow: 'hidden' },
  alarm: { paddingVertical: 5, paddingHorizontal: 10 },
  alarmText: { fontFamily: fonts.extrabold, fontSize: 12.5, letterSpacing: 0.4, color: '#fff' },
  reihe: { flexDirection: 'row', padding: 8, gap: 8 },
  spuren: { flex: 1.65, gap: 1 },
  zahlen: { flex: 1, justifyContent: 'space-between', borderLeftWidth: 1, borderLeftColor: MON.rand, paddingLeft: 8 },
  kanal: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.8, opacity: 0.85 },
  aus: { position: 'absolute', alignSelf: 'center', fontFamily: fonts.semibold, fontSize: 10.5, color: MON.leise },
  zeile: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  einheit: { fontFamily: fonts.bold, fontSize: 10, width: 34, opacity: 0.9 },
  gross: { fontFamily: fonts.displayBlack, fontSize: 32, lineHeight: 35, letterSpacing: -1 },
  mittel: { fontFamily: fonts.displayBlack, fontSize: 19, lineHeight: 23, letterSpacing: -0.5 },
  herz: { fontSize: 14 },
  klein: { fontFamily: fonts.medium, fontSize: 9.5, color: MON.leise, marginTop: -4, marginLeft: 39 },
  chips: { flexDirection: 'row', gap: 8, minHeight: 16 },
  chip: { fontFamily: fonts.bold, fontSize: 12 },
});
