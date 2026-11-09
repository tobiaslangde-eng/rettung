import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path, Rect, Text as SText } from 'react-native-svg';
import { Auswertung, KLINIKEN, mmss, SimState } from '../game/simulator';
import { aktionenFuer } from '../game/simAktionen';
import { fonts } from '../theme';
import { MON } from './SimMonitor';

const P = { bg: '#0F222D', rand: '#1E3A49', text: '#E6F4F1', leise: '#8FB0B4', gruen: '#35F28F', rot: '#FF5A6A', gelb: '#FFC531' };

const MARKER: Record<string, string> = {
  spo2: '🩸',
  ekg: '📈',
  nibp: '🩺',
  bz: '🩹',
  ekg12: '📄',
  'notarzt-rufen': '📻',
  'zugang-ok': '💉',
  pads: '⚡',
  'hlw-an': '🤲',
  schock: '💥',
  'adrenalin-im-ok': '💉',
  'adrenalin-iv-ok': '💥',
  'asa-ok': '💊',
  'nitro-ok': '💨',
  'salbutamol-ok': '🌬️',
  'glukose-oral-ok': '🍬',
  'glukose-iv-ok': '🍯',
  tourniquet: '🎗️',
  'o2-reservoir': '🫧',
  'o2-maske': '🫧',
  'o2-nasenbrille': '🫧',
  trage: '🛏️',
  abfahrt: '🚑',
  'notarzt-da': '🧑‍⚕️',
};

/** Verlauf der Messwerte mit Stillstands-Bändern und den wichtigsten Maßnahmen */
function Verlauf({ s }: { s: SimState }) {
  const W = 340;
  const H = 132;
  const tEnde = Math.max(30, s.ende?.t ?? s.t);
  const x = (t: number) => (t / tEnde) * W;
  const y = (v: number, max: number) => H - 6 - (Math.max(0, Math.min(max, v)) / max) * (H - 26);
  const pts = s.verlauf;
  const lin = (f: (p: (typeof pts)[number]) => number, max: number) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(f(p), max).toFixed(1)}`).join(' ');
  const baender: { a: number; b: number }[] = [];
  pts.forEach((p, i) => {
    if (!p.kreislauf) {
      const b = pts[i + 1]?.t ?? tEnde;
      const letzt = baender[baender.length - 1];
      if (letzt && Math.abs(letzt.b - p.t) < 0.5) letzt.b = b;
      else baender.push({ a: p.t, b });
    }
  });
  const marker = Object.entries(MARKER)
    .map(([id, ic]) => ({ id, ic, t: s.getan[id]?.[0] }))
    .filter((m) => m.t !== undefined)
    .sort((a, b) => (a.t as number) - (b.t as number));
  // Symbole nicht übereinander setzen
  let letzterX = -99;
  const sichtbar = marker.filter((m) => {
    const px = x(m.t as number);
    if (px - letzterX < 13) return false;
    letzterX = px;
    return true;
  });
  return (
    <View>
      <Svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <Rect x={0} y={0} width={W} height={H} rx={10} fill={MON.bg} />
        {[0.35, 0.6, 0.85].map((f) => (
          <Line key={f} x1={0} y1={H * f} x2={W} y2={H * f} stroke={MON.gitter} strokeWidth={1} />
        ))}
        {baender.map((b, i) => (
          <Rect key={i} x={x(b.a)} y={14} width={Math.max(2, x(b.b) - x(b.a))} height={H - 20} fill="rgba(255,60,80,0.22)" />
        ))}
        <Path d={lin((p) => p.spo2 * 2, 220)} fill="none" stroke={MON.spo2} strokeWidth={1.6} />
        <Path d={lin((p) => p.sys, 220)} fill="none" stroke={MON.rr} strokeWidth={1.6} />
        <Path d={lin((p) => p.hf, 220)} fill="none" stroke={MON.hf} strokeWidth={1.6} />
        {sichtbar.map((m) => (
          <G2 key={m.id} px={x(m.t as number)} h={H} ic={m.ic} />
        ))}
      </Svg>
      <View style={styles.legende}>
        <Text style={[styles.leg, { color: MON.hf }]}>— Puls</Text>
        <Text style={[styles.leg, { color: MON.rr }]}>— Blutdruck (oben)</Text>
        <Text style={[styles.leg, { color: MON.spo2 }]}>— SpO₂</Text>
        <Text style={[styles.leg, { color: '#FF8A98' }]}>▮ Stillstand</Text>
      </View>
      <Text style={styles.klein}>Zeit: 0 bis {mmss(tEnde)} · Symbole oben = wann du etwas getan hast</Text>
    </View>
  );
}

function G2({ px, h, ic }: { px: number; h: number; ic: string }) {
  return (
    <>
      <Line x1={px} y1={14} x2={px} y2={h - 4} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="2 3" />
      <SText x={px} y={11} fontSize={10} textAnchor="middle">
        {ic}
      </SText>
    </>
  );
}

/** Auswertung nach dem Einsatz: Ergebnis, Verlauf, Soll und Ist, Fehler, Lernhinweis */
export function SimAuswertung({ sim, a }: { sim: SimState; a: Auswertung }) {
  const sz = sim.sz;
  const defs = Object.fromEntries(aktionenFuer(sz).map((d) => [d.id, d]));
  const monitorAb = Math.min(sim.getan.spo2?.[0] ?? 9999, sim.getan.ekg?.[0] ?? 9999);
  const tl = Object.entries(sim.getan)
    .filter(([id]) => defs[id] && !id.startsWith('frage-'))
    .map(([id, t]) => ({ id, t: t[0], n: t.length, titel: defs[id].titel, icon: defs[id].icon }))
    .sort((p, q) => p.t - q.t);
  const tod = a.art === 'tod';
  const farbe = tod ? P.rot : a.sterne >= 3 ? P.gruen : P.gelb;
  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.held, { borderColor: farbe }]}>
        <Text style={styles.emoji}>{tod ? '🕯️' : a.sterne >= 3 ? '🏆' : a.sterne === 2 ? '👍' : '🩺'}</Text>
        <Text style={[styles.gross, { color: farbe }]}>{tod ? 'Der Patient ist verstorben' : 'Patient übergeben'}</Text>
        <Text style={styles.text}>
          {tod
            ? sim.ende?.grund || 'Trotz allem ließ sich der Kreislauf nicht stabilisieren.'
            : `${sz.patient.name} wird in der Klinik übernommen${a.klinikRichtig === false ? ' – allerdings nicht in der am besten passenden Klinik.' : '.'}`}
        </Text>
        <Text style={styles.sterne}>{'⭐'.repeat(a.sterne)}{'☆'.repeat(3 - a.sterne)}</Text>
        <Text style={[styles.ep, { color: P.gelb }]}>+{a.ep} EP · Erfüllt: {a.quote} %</Text>
      </View>

      <View style={styles.stats}>
        <Stat l="Einsatzdauer" w={mmss(a.szenenzeit)} />
        <Stat l="Monitor ab" w={monitorAb < 9999 ? mmss(monitorAb) : 'nie'} />
        <Stat l="Notarzt gerufen" w={sim.notarzt.angefordert !== null ? mmss(sim.notarzt.angefordert) : 'nie'} />
        <Stat l="Schocks" w={String(sim.defi.schocks)} />
        {sim.stillstaende > 0 && <Stat l="HLW-Pausen" w={`${Math.round((sim.handsOff / Math.max(1, sim.t)) * 100)} %`} />}
        {sim.klinik && <Stat l="Ziel" w={KLINIKEN[sim.klinik].kurz} />}
      </View>

      <Box titel="Verlauf">
        <Verlauf s={sim} />
      </Box>

      <Box titel="Was solltest du tun – und was hast du getan?">
        {a.ziele.map((z) => (
          <View key={z.titel} style={styles.ziel}>
            <Text style={[styles.haken, { color: z.ok ? P.gruen : P.rot }]}>{z.ok ? '✓' : '✗'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.zielTitel}>{z.titel}</Text>
              {!z.ok && <Text style={styles.zielHinweis}>{z.hinweis}</Text>}
            </View>
          </View>
        ))}
      </Box>

      {a.fehler.length > 0 && (
        <Box titel="Das lief schief">
          {a.fehler.map((f, i) => (
            <Text key={i} style={styles.fehler}>
              {mmss(f.t)} · {f.text}
              {f.kritisch ? '  (schwerer Fehler)' : ''}
            </Text>
          ))}
        </Box>
      )}

      <Box titel="Deine Maßnahmen in der Reihenfolge">
        {tl.map((m) => (
          <Text key={m.id} style={styles.tl}>
            <Text style={{ color: P.leise }}>{mmss(m.t)}  </Text>
            {m.icon} {m.titel}
            {m.n > 1 ? `  ×${m.n}` : ''}
          </Text>
        ))}
      </Box>

      <Box titel={`Das Wichtigste zu: ${sz.titel}`}>
        {sz.lehre.text.map((t, i) => (
          <Text key={i} style={styles.text}>
            {t}
          </Text>
        ))}
        <View style={styles.merke}>
          <Text style={styles.merkeText}>💡 {sz.lehre.merke}</Text>
        </View>
        <Text style={styles.klein}>
          Lernsimulation mit vereinfachten Werten und Zeiten. Die Medikamente und Abläufe sind je nach Rettungsdienstbereich (SOP) unterschiedlich – im Einsatz gelten eure Vorgaben und die Anweisungen des Notarztes. Die Inhalte wurden mit KI erstellt und sollten von Fachleuten geprüft werden.
        </Text>
      </Box>
    </View>
  );
}

function Stat({ l, w }: { l: string; w: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statW}>{w}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );
}

function Box({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxTitel}>{titel}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  held: { backgroundColor: P.bg, borderRadius: 22, borderWidth: 2, padding: 18, alignItems: 'center', gap: 6 },
  emoji: { fontSize: 46 },
  gross: { fontFamily: fonts.displayBlack, fontSize: 24, letterSpacing: -0.5, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21, color: P.text },
  sterne: { fontSize: 30, letterSpacing: 4, marginTop: 2 },
  ep: { fontFamily: fonts.displayBlack, fontSize: 18 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { flexGrow: 1, minWidth: '30%', backgroundColor: P.bg, borderRadius: 14, borderWidth: 1, borderColor: P.rand, padding: 10, alignItems: 'center' },
  statW: { fontFamily: fonts.displayBlack, fontSize: 19, color: P.text },
  statL: { fontFamily: fonts.medium, fontSize: 11, color: P.leise, marginTop: 1 },
  box: { backgroundColor: P.bg, borderRadius: 18, borderWidth: 1, borderColor: P.rand, padding: 14, gap: 8 },
  boxTitel: { fontFamily: fonts.displayBlack, fontSize: 15.5, color: P.text },
  ziel: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  haken: { fontFamily: fonts.displayBlack, fontSize: 16, width: 18 },
  zielTitel: { fontFamily: fonts.semibold, fontSize: 13.5, lineHeight: 18, color: P.text },
  zielHinweis: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: P.leise },
  fehler: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: '#FF9AA4' },
  tl: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: P.text },
  merke: { backgroundColor: '#2A2410', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#5A4A14' },
  merkeText: { fontFamily: fonts.bold, fontSize: 13.5, lineHeight: 19, color: '#FFE08A' },
  klein: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 16, color: P.leise },
  legende: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
  leg: { fontFamily: fonts.bold, fontSize: 11 },
});
