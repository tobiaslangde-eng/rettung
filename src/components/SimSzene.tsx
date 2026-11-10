import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, Rect, Stop, Text as SText } from 'react-native-svg';
import { KLINIKEN, LagerungId, mmss, SimState, zustandProzent } from '../game/simulator';
import { colors, fonts } from '../theme';
import { hashWert, HAUTTOENE, PatientGesicht } from './Gesicht';
import { zustandFarbe, zustandWort } from './ZustandsAnzeige';

type P = [number, number];
interface Pose {
  S: P; // Schulter
  H: P; // Hüfte
  K: P; // Knie
  F: P; // Fuß
  head: P;
  arm: P;
}

/** Körperhaltungen von der Seite gesehen (Kopf links); Koordinaten in einer 360 × 200 Zeichenfläche */
const POSE: Record<LagerungId, Pose> = {
  flach: { S: [100, 142], H: [208, 142], K: [268, 142], F: [322, 144], head: [66, 132], arm: [152, 154] },
  oberkoerper: { S: [154, 100], H: [210, 142], K: [268, 142], F: [322, 144], head: [133, 74], arm: [194, 134] },
  sitzend: { S: [178, 94], H: [176, 140], K: [248, 140], F: [252, 182], head: [180, 66], arm: [214, 122] },
  beinehoch: { S: [100, 142], H: [208, 142], K: [262, 106], F: [312, 74], head: [66, 132], arm: [152, 154] },
  seitenlage: { S: [100, 146], H: [208, 146], K: [256, 128], F: [308, 150], head: [66, 138], arm: [142, 134] },
};

const mix = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const HEMD = ['#6C8EF5', '#F59E6C', '#B58CE0', '#4FC3A1', '#F2C94C', '#E57373', '#5BB8D4'];

/**
 * Die Einsatzstelle: Der Patient liegt, sitzt oder wird gelagert, die angelegten Geräte sind zu sehen
 * (Maske, Pads, Zugang, Decke …), Herzdruckmassage und Schock laufen als Animation.
 */
export function SimSzene({ sim, toast }: { sim: SimState; toast: { text: string; art: string } | null }) {
  const [breite, setBreite] = useState(340);
  const [, setTakt] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTakt((n) => (n + 1) % 1e6), 90);
    return () => clearInterval(id);
  }, []);
  const z = sim;
  const g = z.geraete;
  const sz = z.sz;
  const k = hashWert(sz.patient.kennung);
  const haut = HAUTTOENE[k % HAUTTOENE.length];
  const hemd = HEMD[(k >>> 6) % HEMD.length];
  const hose = '#2F3B52';
  const lage: LagerungId = g.trage && g.lage === 'sitzend' ? 'oberkoerper' : g.lage;
  const p = POSE[lage];
  const sitz = lage === 'sitzend';
  const jetzt = Date.now() / 1000;
  const zustand = zustandProzent(z);
  const skala = breite / 360;

  // Atmung hebt und senkt den Brustkorb
  const af = z.kreislauf ? z.w.af : 0;
  const phase = (z.t * (g.bvm ? 10 : af)) / 60;
  const hub = g.bvm || af > 1 ? Math.sin(phase * 2 * Math.PI) * 1.8 : 0;
  const hlw = z.cpr.an && !z.cpr.pause && !z.kreislauf;
  const hlwHub = hlw ? Math.abs(Math.sin(z.t * 2 * Math.PI * 1.83)) : 0;
  const C = mix(p.S, p.H, 0.28);
  const T = mix(p.H, p.K, 0.45);
  const blitz = Math.max(0, 0.55 - (z.t - z.defi.blitz)) / 0.55;
  const blutet = !!sz.blutung && !z.flags.blutungGestoppt && z.kreislauf;
  const messen = z.laufend.some((l) => l.id === 'nibp');
  const anHolen = z.laufend.some((l) => l.id === 'analyse');
  const blauRot = Math.floor(jetzt / 0.35) % 2 === 0;
  const farbe = zustandFarbe(zustand);
  const eta = z.notarzt.angefordert !== null && !z.notarzt.da ? Math.max(0, z.notarzt.angefordert + sz.notarztEta - z.t) : null;

  return (
    <View style={styles.box} onLayout={(e) => setBreite(e.nativeEvent.layout.width)}>
      <Svg width="100%" height="100%" viewBox="0 36 360 138" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="wand" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#14232C" />
            <Stop offset="1" stopColor="#0B161D" />
          </LinearGradient>
          <LinearGradient id="boden" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1B2B35" />
            <Stop offset="1" stopColor="#0E1A21" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={360} height={200} fill="url(#wand)" />
        <Rect x={0} y={176} width={360} height={24} fill="url(#boden)" />
        <Rect x={26} y={22} width={64} height={52} rx={4} fill="#1E3140" stroke="#2C4455" strokeWidth={2} />
        <Line x1={58} y1={22} x2={58} y2={74} stroke="#2C4455" strokeWidth={2} />
        <Line x1={26} y1={48} x2={90} y2={48} stroke="#2C4455" strokeWidth={2} />

        {/* Liege oder Stuhl */}
        {sitz ? (
          <G>
            <Rect x={150} y={146} width={118} height={9} rx={3} fill="#3B4A55" />
            <Rect x={146} y={64} width={14} height={92} rx={4} fill="#3B4A55" />
            <Line x1={160} y1={155} x2={160} y2={178} stroke="#3B4A55" strokeWidth={5} />
            <Line x1={262} y1={155} x2={262} y2={178} stroke="#3B4A55" strokeWidth={5} />
          </G>
        ) : (
          <G>
            {lage === 'oberkoerper' && <Polygon points="196,150 120,104 112,114 188,160" fill="#44566A" />}
            <Rect x={40} y={153} width={296} height={9} rx={4} fill="#3B4A55" />
            <Rect x={44} y={149} width={288} height={7} rx={3} fill="#52667B" />
            {g.trage && (
              <G>
                <Line x1={80} y1={162} x2={80} y2={176} stroke="#8EA6B3" strokeWidth={3} />
                <Line x1={300} y1={162} x2={300} y2={176} stroke="#8EA6B3" strokeWidth={3} />
                <Circle cx={80} cy={180} r={6} fill="#26343D" stroke="#8EA6B3" strokeWidth={2} />
                <Circle cx={300} cy={180} r={6} fill="#26343D" stroke="#8EA6B3" strokeWidth={2} />
              </G>
            )}
          </G>
        )}

        {/* Körper */}
        <G transform={`translate(${z.flags.krampf ? Math.sin(jetzt * 46) * 1.8 : 0} ${-hub + (z.flags.krampf ? Math.cos(jetzt * 53) * 1.2 : 0)})`}>
          <Path d={`M${p.H[0]} ${p.H[1]} L${p.K[0]} ${p.K[1]} L${p.F[0]} ${p.F[1]}`} stroke={hose} strokeWidth={23} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d={`M${p.F[0]} ${p.F[1]} l12 0`} stroke="#171F2A" strokeWidth={13} strokeLinecap="round" />
          <Path d={`M${p.S[0]} ${p.S[1]} L${p.H[0]} ${p.H[1]}`} stroke={hemd} strokeWidth={42} strokeLinecap="round" fill="none" />
          <Path d={`M${p.S[0] + (sitz ? 4 : 10)} ${p.S[1] + 6} L${p.arm[0]} ${p.arm[1]}`} stroke={hemd} strokeWidth={13} strokeLinecap="round" fill="none" />
          <Circle cx={p.arm[0] + 6} cy={p.arm[1] + 3} r={7} fill={haut} />
        </G>

        {/* Wärmedecke */}
        {g.waerme && (
          <G opacity={0.82}>
            <Path d={`M${p.S[0] + 8} ${p.S[1] + 4} L${p.H[0]} ${p.H[1]} L${p.K[0]} ${p.K[1]} L${p.F[0] - 6} ${p.F[1]}`} stroke="#E2B94A" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d={`M${p.S[0] + 24} ${p.S[1] + 6} L${p.H[0] - 6} ${p.H[1] - 8} L${p.K[0] + 4} ${p.K[1] - 8}`} stroke="#FFF1B8" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
          </G>
        )}

        {/* Blutung, Druckverband, Tourniquet */}
        {sz.blutung && (
          <G>
            {(blutet || z.flags.druckverband) && !z.flags.blutungGestoppt && <Circle cx={T[0]} cy={T[1] + 3} r={5 + 12 * Math.min(1, z.x)} fill="#B3141F" opacity={0.85} />}
            {z.flags.druckverband && <Rect x={T[0] - 12} y={T[1] - 12} width={24} height={20} rx={5} fill="#F2F2F2" stroke="#C6C6C6" strokeWidth={1} opacity={0.95} />}
            {z.flags.blutungGestoppt && <Rect x={mix(p.H, p.K, 0.2)[0] - 3} y={mix(p.H, p.K, 0.2)[1] - 14} width={7} height={28} rx={3} fill="#D62B33" />}
            {blutet && [0, 1, 2].map((i) => {
              const f = (jetzt * 1.6 + i / 3) % 1;
              return <Circle key={i} cx={T[0] + (i - 1) * 6} cy={T[1] + 12 + f * 26} r={2.4 * (1 - f * 0.5)} fill="#C0182A" opacity={1 - f} />;
            })}
          </G>
        )}

        {/* Defi-Pads und Kabel */}
        {g.pads && (
          <G>
            <Rect x={C[0] - 16} y={C[1] - 12} width={14} height={20} rx={3} fill="#F4F4F4" stroke="#FF9A4A" strokeWidth={2} transform={`rotate(-18 ${C[0] - 9} ${C[1] - 2})`} />
            <Rect x={C[0] + 6} y={C[1] + 6} width={14} height={20} rx={3} fill="#F4F4F4" stroke="#FF9A4A" strokeWidth={2} transform={`rotate(-18 ${C[0] + 13} ${C[1] + 16})`} />
            <Path d={`M${C[0] - 8} ${C[1] + 12} Q${C[0] - 50} 176 40 172`} stroke="#FF9A4A" strokeWidth={1.8} fill="none" opacity={0.7} />
            <Rect x={20} y={166} width={34} height={22} rx={4} fill="#243240" stroke="#FF9A4A" strokeWidth={1.5} />
            <SText x={37} y={181} fontSize={12} fill="#FFC531" textAnchor="middle">⚡</SText>
          </G>
        )}
        {/* EKG-Elektroden */}
        {g.ekg && (
          <G>
            {[
              [C[0] - 9, C[1] - 6],
              [C[0] + 10, C[1] - 4],
              [C[0] + 2, C[1] + 12],
            ].map((q, i) => (
              <Circle key={i} cx={q[0]} cy={q[1]} r={3.3} fill="#35F28F" stroke="#052" strokeWidth={0.8} />
            ))}
          </G>
        )}
        {/* Pulsoxymeter */}
        {g.spo2 && (
          <G>
            <Rect x={p.arm[0] + 4} y={p.arm[1] - 5} width={13} height={8} rx={3} fill="#1A2A33" stroke="#4CD7FF" strokeWidth={1.4} />
            <Circle cx={p.arm[0] + 10.5} cy={p.arm[1] - 1} r={1.8 + (Math.sin(jetzt * 6) > 0.4 ? 1.1 : 0)} fill="#FF4B4B" />
          </G>
        )}
        {/* Blutdruckmanschette */}
        {messen && (
          <Rect x={mix(p.S, p.arm, 0.5)[0] - 5} y={mix(p.S, p.arm, 0.5)[1] - 9} width={11} height={18} rx={3} fill="#FFA033" opacity={0.9} transform={`scale(${1 + 0.06 * Math.sin(jetzt * 9)})`} />
        )}

        {/* Sauerstoff und Beatmung */}
        {(g.o2 !== 'aus' || g.bvm) && (
          <G>
            <Rect x={326} y={118} width={16} height={58} rx={6} fill="#2E7D5B" stroke="#7FE6B5" strokeWidth={1.5} />
            <Rect x={330} y={110} width={8} height={10} rx={2} fill="#9AB3A8" />
            <Path d={`M334 112 C334 60 ${p.head[0] + 20} 40 ${p.head[0] + 14} ${p.head[1] + 4}`} stroke="#7FE6B5" strokeWidth={1.6} fill="none" opacity={0.55} />
          </G>
        )}
        {g.o2 === 'nasenbrille' && !g.bvm && <Path d={`M${p.head[0] + 14} ${p.head[1] + 6} q4 7 10 4`} stroke="#7FE6B5" strokeWidth={2.2} fill="none" strokeLinecap="round" />}
        {(g.o2 === 'maske' || g.o2 === 'reservoir') && !g.bvm && (
          <G>
            <Ellipse cx={p.head[0] + 15} cy={p.head[1] + 9} rx={11} ry={9} fill="rgba(140,225,255,0.6)" stroke="#9FE3FF" strokeWidth={1.4} />
            {g.o2 === 'reservoir' && <Ellipse cx={p.head[0] + 12} cy={p.head[1] + 34 + hub} rx={8} ry={12} fill="rgba(255,255,255,0.55)" stroke="#EEF" strokeWidth={1} />}
          </G>
        )}
        {g.bvm && (
          <G>
            <Ellipse cx={p.head[0] + 16} cy={p.head[1] + 9} rx={11} ry={9} fill="rgba(140,225,255,0.7)" stroke="#9FE3FF" strokeWidth={1.4} />
            <Ellipse cx={p.head[0] + 30} cy={p.head[1] + 22} rx={13 - hub * 1.6} ry={11 + hub * 1.2} fill="#E9F2F7" stroke="#B9CBD6" strokeWidth={1.4} />
          </G>
        )}
        {g.guedel && <Rect x={p.head[0] + 9} y={p.head[1] + 14} width={7} height={4} rx={2} fill="#FF9A4A" />}

        {/* Infusion */}
        {g.infusionen > 0 && (
          <G>
            <Line x1={316} y1={34} x2={316} y2={176} stroke="#7C8F9B" strokeWidth={3} />
            <Line x1={300} y1={36} x2={332} y2={36} stroke="#7C8F9B" strokeWidth={3} />
            <Rect x={306} y={40} width={20} height={30} rx={6} fill="rgba(160,215,255,0.8)" stroke="#CDE8FF" strokeWidth={1.2} />
            <Path d={`M316 70 L316 84 C316 100 ${p.arm[0] + 34} 110 ${p.arm[0] + 8} ${p.arm[1] - 4}`} stroke="#CDE8FF" strokeWidth={1.4} fill="none" opacity={0.7} />
            <Circle cx={316} cy={78 + ((jetzt * 2) % 1) * 14} r={1.9} fill="#CDE8FF" />
          </G>
        )}

        {/* Wiederbelebung: Helfer drückt auf den Brustkorb */}
        {hlw && (
          <G>
            <Circle cx={C[0] + 52} cy={C[1] - 84} r={12} fill="#F2C94C" />
            <Path d={`M${C[0] + 52} ${C[1] - 72} L${C[0] + 30} ${C[1] - 28 + hlwHub * 8}`} stroke="#F2C94C" strokeWidth={14} strokeLinecap="round" opacity={0.95} />
            <Path d={`M${C[0] + 30} ${C[1] - 28 + hlwHub * 8} L${C[0]} ${C[1] - 8 + hlwHub * 8}`} stroke="#FFD8B0" strokeWidth={9} strokeLinecap="round" />
            <Circle cx={C[0]} cy={C[1] - 8 + hlwHub * 8} r={7} fill="#FFD8B0" stroke="#C69A6C" strokeWidth={1} />
          </G>
        )}
        {anHolen && (
          <SText x={180} y={30} fontSize={12} fill="#FFC531" textAnchor="middle" fontWeight="bold">
            ALLE ZURÜCKTRETEN!
          </SText>
        )}
        {/* Schock-Blitz */}
        {blitz > 0 && (
          <G>
            <Rect x={0} y={0} width={360} height={200} fill="#FFFFFF" opacity={blitz * 0.7} />
            <SText x={C[0]} y={C[1] - 20} fontSize={40} fill="#FFC531" textAnchor="middle" opacity={blitz}>⚡</SText>
          </G>
        )}
      </Svg>

      {/* Gesicht des Patienten am Kopfende */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: (p.head[0] - 24) * skala,
          top: (p.head[1] - 24 - 36) * skala,
          width: 48 * skala,
          height: 48 * skala,
          borderRadius: 30 * skala,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: farbe,
          backgroundColor: colors.surface,
        }}
      >
        <PatientGesicht age={sz.patient.alter} sex={sz.patient.sex} seed={sz.patient.kennung} size={48 * skala} zustand={z.kreislauf ? zustand : 5} />
      </View>

      {/* Blaulicht am Rand */}
      <View pointerEvents="none" style={[styles.licht, { left: 0, backgroundColor: blauRot ? 'rgba(47,111,237,0.35)' : 'rgba(47,111,237,0.05)' }]} />
      <View pointerEvents="none" style={[styles.licht, { right: 0, backgroundColor: blauRot ? 'rgba(239,81,85,0.05)' : 'rgba(239,81,85,0.35)' }]} />

      {/* Zustand und Hinweise */}
      <View style={styles.oben}>
        <View style={[styles.chip, { backgroundColor: farbe }]}>
          <Text style={styles.chipText}>
            {z.kreislauf ? zustandWort(zustand) : 'KREISLAUFSTILLSTAND'} · {zustand} %
          </Text>
        </View>
        {eta !== null && (
          <View style={[styles.chip, { backgroundColor: '#1F3A52' }]}>
            <Text style={[styles.chipText, { color: '#9FD2FF' }]}>🚑 Notarzt in {mmss(eta)}</Text>
          </View>
        )}
        {z.notarzt.da && (
          <View style={[styles.chip, { backgroundColor: '#1F4A3A' }]}>
            <Text style={[styles.chipText, { color: '#9CF0C8' }]}>🧑‍⚕️ Notarzt vor Ort</Text>
          </View>
        )}
        {z.klinik && (
          <View style={[styles.chip, { backgroundColor: '#3A2F52' }]}>
            <Text style={[styles.chipText, { color: '#D2C2FF' }]}>
              {KLINIKEN[z.klinik].icon} {KLINIKEN[z.klinik].kurz}
            </Text>
          </View>
        )}
      </View>
      {!!z.spruch && z.kreislauf && (
        <View style={styles.sprech} pointerEvents="none">
          <Text style={styles.sprechText}>„{z.spruch}“</Text>
        </View>
      )}
      {toast && (
        <View
          pointerEvents="none"
          style={[
            styles.toast,
            { backgroundColor: toast.art === 'fehler' || toast.art === 'alarm' ? 'rgba(179,20,31,0.92)' : toast.art === 'gut' ? 'rgba(14,110,80,0.94)' : toast.art === 'arzt' ? 'rgba(31,58,82,0.95)' : 'rgba(20,35,44,0.94)' },
          ]}
        >
          <Text style={styles.toastText} numberOfLines={3}>
            {toast.text}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', aspectRatio: 360 / 138, borderRadius: 18, overflow: 'hidden', backgroundColor: '#0B161D', borderWidth: 1, borderColor: '#1B3340' },
  licht: { position: 'absolute', top: 0, bottom: 0, width: 26 },
  oben: { position: 'absolute', left: 8, top: 8, right: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  chipText: { fontFamily: fonts.displayBlack, fontSize: 10.5, letterSpacing: 0.3, color: '#0B1F24' },
  sprech: { position: 'absolute', right: 10, top: 34, maxWidth: '40%', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, borderTopRightRadius: 3, paddingHorizontal: 10, paddingVertical: 6 },
  sprechText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: '#14232C' },
  toast: { position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  toastText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: '#fff' },
});

const AMPEL = { gruen: ['#0F3A2B', '#35F28F'], gelb: ['#3A2F0F', '#FFC531'], rot: ['#3F1119', '#FF5A6A'] } as const;

/** ABCDE-Ampel: Was man dem Patienten ansieht – Atemweg, Atmung, Kreislauf, Bewusstsein (ohne Geräte) */
export function AbcdeLeiste({ sim }: { sim: SimState }) {
  const { atem: a, kreis: k, neuro: n } = sim.achsen;
  const stillstand = !sim.kreislauf;
  const stufe = (gut: number, mittel: number, wert: number) => (wert > gut ? 'gruen' : wert > mittel ? 'gelb' : 'rot');
  const punkte: { b: string; t: string; f: 'gruen' | 'gelb' | 'rot' }[] = [
    { b: 'A', t: 'Atemweg', f: stillstand || sim.flags.sekret ? 'rot' : n < 0.35 ? 'gelb' : 'gruen' },
    { b: 'B', t: 'Atmung', f: stillstand ? 'rot' : stufe(0.78, 0.55, a) },
    { b: 'C', t: 'Kreislauf', f: stillstand ? 'rot' : stufe(0.7, 0.45, k) },
    { b: 'D', t: 'Bewusstsein', f: stillstand ? 'rot' : stufe(0.75, 0.45, n) },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 5 }}>
      {punkte.map((p) => (
        <View key={p.b} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: AMPEL[p.f][0], borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: AMPEL[p.f][1] }} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, color: '#E6F4F1' }} numberOfLines={1}>
            {p.b} {p.t}
          </Text>
        </View>
      ))}
    </View>
  );
}
