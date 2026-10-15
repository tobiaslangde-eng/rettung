import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';
import { EQUIPMENT_BY_ID, EquipmentId } from '../game/equipment';
import { colors, fonts } from '../theme';
import { DeviceArt } from './Devices';

const W = 400;
const H = 300;

/** Fluchtpunkt-Raum: Ich stehe an der offenen Hecktür und schaue nach vorne zur Fahrerkabine. */
const BACK = { x1: 135, x2: 265, y1: 65, y2: 175 };

/** Antippbare Bereiche (SVG-Koordinaten) und wo das Namensschild sitzt */
const SPOTS: Partial<Record<EquipmentId, { x: number; y: number; w: number; h: number; chipX: number; chipY: number }>> = {
  rtw: { x: 158, y: 74, w: 66, h: 48, chipX: 191, chipY: 70 },
  funk: { x: 226, y: 86, w: 40, h: 40, chipX: 246, chipY: 132 },
  monitor: { x: 26, y: 88, w: 88, h: 86, chipX: 70, chipY: 84 },
  beatmung: { x: 284, y: 98, w: 72, h: 72, chipX: 320, chipY: 94 },
  trage: { x: 118, y: 180, w: 164, h: 108, chipX: 200, chipY: 236 },
  rucksack: { x: 4, y: 198, w: 90, h: 92, chipX: 48, chipY: 200 },
  psa: { x: 330, y: 10, w: 70, h: 112, chipX: 366, chipY: 136 },
};

const THEME = [
  { wall: '#DDD5C2', ceil: '#E9E2D2', floor: '#5A5650', cab: '#CFC5AE', light: '#FFF4CC', accent: '#F08A24' },
  { wall: '#DCE1E8', ceil: '#EDF0F4', floor: '#4A4F57', cab: '#C9D0D9', light: '#FFFFFF', accent: colors.signalrot },
  { wall: '#EEF1F5', ceil: '#F7F9FB', floor: '#3A4048', cab: '#DDE3EA', light: '#FFFFFF', accent: '#FFD100' },
  { wall: '#F4F6F9', ceil: '#FFFFFF', floor: '#2A3038', cab: '#E6EBF1', light: '#E9F6FF', accent: '#33D6FF' },
];

/** y-Wert auf der Linie von (x0, y0) zum Punkt (x1, y1) an der Stelle x */
const lerpY = (x: number, x0: number, y0: number, x1: number, y1: number) => y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);

/** Wandhöhe als Anteil f (0 oben, 1 Boden) → y an der Stelle x der linken Wand */
const wallY = (x: number, f: number) => lerpY(x, 0, 300 * f, BACK.x1, BACK.y1 + 110 * f);
/** Gleiches für die rechte Wand */
const wallYR = (x: number, f: number) => lerpY(x, W, 300 * f, BACK.x2, BACK.y1 + 110 * f);

function Room({ rtw }: { rtw: number }) {
  const t = THEME[rtw - 1];
  const id = `fpi${rtw}`;
  const neu = rtw >= 3;
  const rd = rtw >= 4;
  return (
    <G>
      <Defs>
        <LinearGradient id={`${id}-ceil`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={t.ceil} />
          <Stop offset="1" stopColor="#8E96A3" />
        </LinearGradient>
        <LinearGradient id={`${id}-wallL`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <Stop offset="0.6" stopColor="#000" stopOpacity="0.1" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </LinearGradient>
        <LinearGradient id={`${id}-wallR`} x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <Stop offset="0.6" stopColor="#000" stopOpacity="0.1" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </LinearGradient>
        <LinearGradient id={`${id}-floor`} x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={t.floor} />
          <Stop offset="1" stopColor="#111418" />
        </LinearGradient>
        <LinearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <RadialGradient id={`${id}-glow`} cx="200" cy="40" rx="170" ry="120" fx="200" fy="40" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={t.light} stopOpacity="0.75" />
          <Stop offset="1" stopColor={t.light} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}-vig`} cx="200" cy="140" rx="260" ry="190" fx="200" fy="140" gradientUnits="userSpaceOnUse">
          <Stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </RadialGradient>
        <LinearGradient id={`${id}-cabdoor`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <Stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </LinearGradient>
        <LinearGradient id={`${id}-windshield`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6E8FB8" />
          <Stop offset="0.55" stopColor="#C9D8E8" />
          <Stop offset="0.56" stopColor="#4C5360" />
          <Stop offset="1" stopColor="#2B3039" />
        </LinearGradient>
      </Defs>

      {/* Decke, Wände, Boden */}
      <Polygon points={`0,0 ${W},0 ${BACK.x2},${BACK.y1} ${BACK.x1},${BACK.y1}`} fill={`url(#${id}-ceil)`} />
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},${BACK.y2} 0,${H}`} fill={t.wall} />
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},${BACK.y2} 0,${H}`} fill={`url(#${id}-wallL)`} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},${BACK.y2} ${W},${H}`} fill={t.wall} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},${BACK.y2} ${W},${H}`} fill={`url(#${id}-wallR)`} />
      <Polygon points={`0,${H} ${W},${H} ${BACK.x2},${BACK.y2} ${BACK.x1},${BACK.y2}`} fill={`url(#${id}-floor)`} />
      {/* Riffelung im Rutschfestboden (laufen auf den Fluchtpunkt zu) */}
      {Array.from({ length: 9 }, (_, i) => {
        const xb = 20 + i * 45;
        const xt = BACK.x1 + 4 + (i * (BACK.x2 - BACK.x1 - 8)) / 8;
        return <Line key={i} x1={xb} y1={H - 8} x2={xt} y2={BACK.y2} stroke="rgba(255,255,255,0.07)" strokeWidth={1.2} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const y = BACK.y2 + ((H - BACK.y2) * Math.pow((i + 1) / 6, 1.7));
        return <Line key={i} x1={lerpY(y, BACK.y2, BACK.x1, H, 0)} y1={y} x2={lerpY(y, BACK.y2, BACK.x2, H, W)} y2={y} stroke="rgba(0,0,0,0.18)" strokeWidth={1} />;
      })}

      {/* Trennwand zur Fahrerkabine */}
      <Rect x={BACK.x1} y={BACK.y1} width={BACK.x2 - BACK.x1} height={BACK.y2 - BACK.y1} fill={t.cab} />
      <Rect x={BACK.x1} y={BACK.y1} width={BACK.x2 - BACK.x1} height={BACK.y2 - BACK.y1} fill="#000" opacity={0.12} />
      {/* Durchreiche mit Blick durch die Windschutzscheibe */}
      <Rect x={158} y={74} width={66} height={48} rx={5} fill="#0C1118" />
      <Rect x={161} y={77} width={60} height={30} rx={3} fill={`url(#${id}-windshield)`} />
      <Polygon points="166,104 176,92 184,104" fill="rgba(255,255,255,0.12)" />
      <Rect x={163} y={92} width={10} height={14} rx={3} fill="#1B2028" />
      <Rect x={207} y={92} width={10} height={14} rx={3} fill="#1B2028" />
      <Rect x={161} y={108} width={60} height={11} fill="#0C1118" />
      <Circle cx={176} cy={113} r={6} fill="none" stroke="#434C59" strokeWidth={2} />
      {[190, 198, 206, 214].map((x) => (
        <Rect key={x} x={x} y={111} width={5} height={3} rx={1} fill={x % 16 > 8 ? '#FFB300' : '#33D6FF'} opacity={0.9} />
      ))}
      <Rect x={158} y={74} width={66} height={48} rx={5} fill="none" stroke="#8D96A3" strokeWidth={1.2} opacity={0.7} />

      {/* Decken-Beleuchtung */}
      <Polygon points={`150,0 250,0 ${BACK.x2 - 40},${BACK.y1} ${BACK.x1 + 40},${BACK.y1}`} fill={t.light} opacity={0.92} />
      <Polygon points={`150,0 250,0 ${BACK.x2 - 40},${BACK.y1} ${BACK.x1 + 40},${BACK.y1}`} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={1.2} />
      {[0.35, 0.65].map((f) => (
        <Line key={f} x1={150 + (BACK.x1 + 40 - 150) * f * 0 + 0} y1={f * BACK.y1} x2={250} y2={f * BACK.y1} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
      ))}
      {neu && <Polygon points={`168,6 232,6 ${BACK.x2 - 48},${BACK.y1 - 6} ${BACK.x1 + 48},${BACK.y1 - 6}`} fill="#FFFFFF" opacity={0.9} />}
      {/* Haltestange unter der Decke */}
      <Line x1={176} y1={20} x2={224} y2={20} stroke="#7D8794" strokeWidth={4} strokeLinecap="round" />
      <Line x1={176} y1={19} x2={224} y2={19} stroke="#EEF2F7" strokeWidth={1.2} />
      <Rect x={0} y={0} width={W} height={H} fill={`url(#${id}-glow)`} />
      {rd && (
        <G>
          <Line x1={0} y1={3} x2={BACK.x1} y2={BACK.y1} stroke="#33D6FF" strokeWidth={3} />
          <Line x1={W} y1={3} x2={BACK.x2} y2={BACK.y1} stroke="#33D6FF" strokeWidth={3} />
          <Line x1={0} y1={3} x2={BACK.x1} y2={BACK.y1} stroke="#33D6FF" strokeWidth={8} opacity={0.18} />
          <Line x1={W} y1={3} x2={BACK.x2} y2={BACK.y1} stroke="#33D6FF" strokeWidth={8} opacity={0.18} />
        </G>
      )}

      {/* Oberschränke links und rechts */}
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},92 0,58`} fill={t.cab} />
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},92 0,58`} fill={`url(#${id}-cabdoor)`} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},92 ${W},58`} fill={t.cab} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},92 ${W},58`} fill={`url(#${id}-cabdoor)`} />
      {[0, 46, 92].map((x0, i) => {
        const x1 = x0 + 46 > BACK.x1 ? BACK.x1 : x0 + 46;
        const cb = (x: number) => lerpY(x, 0, 58, BACK.x1, 92);
        const ct = (x: number) => lerpY(x, 0, 0, BACK.x1, BACK.y1);
        return (
          <G key={i}>
            <Polygon points={`${x0 + 2},${ct(x0 + 2) + 3} ${x1 - 2},${ct(x1 - 2) + 3} ${x1 - 2},${cb(x1 - 2) - 3} ${x0 + 2},${cb(x0 + 2) - 3}`} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={1.4} />
            <Line x1={x1 - 8} y1={cb(x1 - 8) - 9} x2={x1 - 8} y2={cb(x1 - 8) - 17} stroke="#9AA3AF" strokeWidth={2.4} strokeLinecap="round" />
            {i === 0 && (
              <G transform={`translate(${x0 + 18} ${lerpY(x0 + 18, 0, 29, BACK.x1, 80)})`}>
                <Rect x={-6} y={-6} width={12} height={12} rx={2} fill="#fff" />
                <Rect x={-1.5} y={-5} width={3} height={10} fill={colors.signalrot} />
                <Rect x={-5} y={-1.5} width={10} height={3} fill={colors.signalrot} />
              </G>
            )}
          </G>
        );
      })}
      {[0, 46, 92].map((x0, i) => {
        const x1 = x0 + 46 > BACK.x1 ? BACK.x1 : x0 + 46;
        const xr0 = W - x0;
        const xr1 = W - x1;
        const cb = (x: number) => lerpY(x, W, 58, BACK.x2, 92);
        const ct = (x: number) => lerpY(x, W, 0, BACK.x2, BACK.y1);
        return (
          <G key={i}>
            <Polygon points={`${xr0 - 2},${ct(xr0 - 2) + 3} ${xr1 + 2},${ct(xr1 + 2) + 3} ${xr1 + 2},${cb(xr1 + 2) - 3} ${xr0 - 2},${cb(xr0 - 2) - 3}`} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={1.4} />
            <Line x1={xr1 + 8} y1={cb(xr1 + 8) - 9} x2={xr1 + 8} y2={cb(xr1 + 8) - 17} stroke="#9AA3AF" strokeWidth={2.4} strokeLinecap="round" />
          </G>
        );
      })}
      {/* Schattenwurf unter den Schränken */}
      <Polygon points={`0,58 ${BACK.x1},92 ${BACK.x1},108 0,80`} fill="#000" opacity={0.14} />
      <Polygon points={`${W},58 ${BACK.x2},92 ${BACK.x2},108 ${W},80`} fill="#000" opacity={0.14} />

      {/* Unterschränke (Schubladen) links und rechts */}
      <Polygon points={`0,${wallY(0, 0.64)} ${BACK.x1},${wallY(BACK.x1, 0.64)} ${BACK.x1},${BACK.y2} 0,${H}`} fill={t.cab} opacity={0.96} />
      <Polygon points={`0,${wallY(0, 0.64)} ${BACK.x1},${wallY(BACK.x1, 0.64)} ${BACK.x1},${BACK.y2} 0,${H}`} fill={`url(#${id}-wallL)`} />
      <Polygon points={`0,${wallY(0, 0.64)} ${BACK.x1},${wallY(BACK.x1, 0.64)} ${BACK.x1},${wallY(BACK.x1, 0.66)} 0,${wallY(0, 0.66) + 4}`} fill="#C9D0D9" />
      <Polygon points={`${W},${wallYR(W, 0.64)} ${BACK.x2},${wallYR(BACK.x2, 0.64)} ${BACK.x2},${BACK.y2} ${W},${H}`} fill={t.cab} opacity={0.96} />
      <Polygon points={`${W},${wallYR(W, 0.64)} ${BACK.x2},${wallYR(BACK.x2, 0.64)} ${BACK.x2},${BACK.y2} ${W},${H}`} fill={`url(#${id}-wallR)`} />
      <Polygon points={`${W},${wallYR(W, 0.64)} ${BACK.x2},${wallYR(BACK.x2, 0.64)} ${BACK.x2},${wallYR(BACK.x2, 0.66)} ${W},${wallYR(W, 0.66) + 4}`} fill="#C9D0D9" />
      {[0.74, 0.86].map((f) => (
        <G key={f}>
          <Line x1={0} y1={wallY(0, f)} x2={BACK.x1} y2={wallY(BACK.x1, f)} stroke="rgba(0,0,0,0.3)" strokeWidth={1.6} />
          <Line x1={W} y1={wallYR(W, f)} x2={BACK.x2} y2={wallYR(BACK.x2, f)} stroke="rgba(0,0,0,0.3)" strokeWidth={1.6} />
          <Line x1={70} y1={wallY(70, f) - 8} x2={96} y2={wallY(96, f) - 7} stroke="#9AA3AF" strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={W - 70} y1={wallYR(W - 70, f) - 8} x2={W - 96} y2={wallYR(W - 96, f) - 7} stroke="#9AA3AF" strokeWidth={2.6} strokeLinecap="round" />
        </G>
      ))}
      {/* Haltegriff (Chrom) an der linken Wand */}
      <Path d={`M30 ${wallY(30, 0.5)} q-8 22 0 44`} stroke="#B7C0CC" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d={`M32 ${wallY(32, 0.5)} q-8 22 0 44`} stroke="#fff" strokeWidth={1} fill="none" opacity={0.7} />

      {/* Zierstreifen (Warnmarkierung) an den Wänden */}
      <Polygon points={`0,${wallY(0, 0.6) - 14} ${BACK.x1},${wallY(BACK.x1, 0.6) - 14} ${BACK.x1},${wallY(BACK.x1, 0.6) - 8} 0,${wallY(0, 0.6) - 6}`} fill={t.accent} opacity={0.75} />
      <Polygon points={`${W},${wallYR(W, 0.6) - 14} ${BACK.x2},${wallYR(BACK.x2, 0.6) - 14} ${BACK.x2},${wallYR(BACK.x2, 0.6) - 8} ${W},${wallYR(W, 0.6) - 6}`} fill={t.accent} opacity={0.75} />

      {/* Sitz rechts hinten mit Gurt */}
      <Polygon points={`${BACK.x2},138 302,146 302,178 ${BACK.x2},170`} fill="#2F3B52" />
      <Polygon points={`${BACK.x2},138 302,146 302,152 ${BACK.x2},144`} fill="#4B5B7A" />
      <Polygon points={`${BACK.x2 + 2},112 ${BACK.x2 + 28},118 ${BACK.x2 + 28},146 ${BACK.x2 + 2},140`} fill="#37445E" />
      <Line x1={BACK.x2 + 12} y1={114} x2={BACK.x2 + 10} y2={146} stroke="#E8762D" strokeWidth={3} />
      <Rect x={BACK.x2 + 6} y={129} width={9} height={6} rx={1} fill="#B7C0CC" />

      {/* Bodenkante an der Hecktür */}
      <Rect x={0} y={H - 9} width={W} height={9} fill="#FFC20A" />
      <Rect x={0} y={H - 9} width={W} height={2} fill="#fff" opacity={0.45} />
      {Array.from({ length: 21 }, (_, i) => (
        <Polygon key={i} points={`${i * 22},${H} ${i * 22 + 10},${H - 9} ${i * 22 + 17},${H - 9} ${i * 22 + 7},${H}`} fill="#15181C" />
      ))}
      {/* Weicher Rand */}
      <Rect x={0} y={0} width={W} height={H} fill={`url(#${id}-vig)`} />
    </G>
  );
}

/** Trage in Perspektive auf dem Boden, Kopfteil Richtung Fahrerkabine. */
function Stretcher({ l }: { l: number }) {
  const mattress = l === 1 ? '#6F7683' : l === 2 ? '#E27A1E' : l === 3 ? '#2F6FE0' : '#1A2027';
  const light = l === 1 ? '#8B93A1' : l === 2 ? '#F39A45' : l === 3 ? '#5B93F2' : '#2C3540';
  const frame = l >= 4 ? '#3A434F' : '#C4CBD5';
  const id = `str${l}`;
  return (
    <G>
      <Defs>
        <LinearGradient id={`${id}-m`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={mattress} />
          <Stop offset="1" stopColor={light} />
        </LinearGradient>
        <LinearGradient id={`${id}-sh`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <Stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </LinearGradient>
      </Defs>
      {/* Schatten am Boden */}
      <Ellipse cx={200} cy={286} rx={92} ry={10} fill="#000" opacity={0.4} />
      <Polygon points="124,290 276,290 238,196 162,196" fill="#000" opacity={0.22} />
      {/* Fahrgestell mit Rädern */}
      <Polygon points="146,282 254,282 244,252 156,252" fill="#59616D" />
      <Line x1={150} y1={270} x2={250} y2={270} stroke="#9AA3AF" strokeWidth={3} />
      <Circle cx={146} cy={284} r={8} fill="#161A20" />
      <Circle cx={146} cy={284} r={3.4} fill="#7D8794" />
      <Circle cx={254} cy={284} r={8} fill="#161A20" />
      <Circle cx={254} cy={284} r={3.4} fill="#7D8794" />
      {/* Rahmen */}
      <Polygon points="132,272 268,272 234,192 166,192" fill={frame} />
      <Polygon points="132,272 268,272 234,192 166,192" fill={`url(#${id}-sh)`} />
      {/* Liegefläche mit Nähten */}
      <Polygon points="139,262 261,262 230,190 170,190" fill={`url(#${id}-m)`} />
      <Polygon points="139,262 261,262 230,190 170,190" fill={`url(#${id}-sh)`} opacity={0.8} />
      {[0.25, 0.5, 0.75].map((f) => {
        const y = 190 + 72 * f;
        const xl = 170 - 31 * f;
        const xr = 230 + 31 * f;
        return <Line key={f} x1={xl + 2} y1={y} x2={xr - 2} y2={y} stroke="rgba(0,0,0,0.22)" strokeWidth={1.2} strokeDasharray="3 3" />;
      })}
      <Polygon points="139,262 261,262 257,252 143,252" fill="rgba(0,0,0,0.22)" />
      {/* Kopfteil hochgestellt mit Kissen */}
      <Polygon points="172,196 228,196 224,174 176,174" fill={`url(#${id}-m)`} />
      <Polygon points="176,174 224,174 222,169 178,169" fill="rgba(255,255,255,0.32)" />
      <Polygon points="178,198 222,198 219,188 181,188" fill="#F4F6F9" />
      <Polygon points="178,198 222,198 219,188 181,188" fill="rgba(0,0,0,0.08)" />
      {/* Gurte */}
      {[[222, 0.45], [236, 0.72]].map(([y, f]) => {
        const xl = 170 - 31 * (f as number);
        const xr = 230 + 31 * (f as number);
        return (
          <G key={y as number}>
            <Line x1={xl} y1={y as number} x2={xr} y2={y as number} stroke="#E8762D" strokeWidth={4} opacity={0.95} />
            <Rect x={200 - 5} y={(y as number) - 4} width={10} height={8} rx={1.5} fill="#B7C0CC" />
          </G>
        );
      })}
      {/* Seitenholme */}
      <Line x1={132} y1={272} x2={166} y2={192} stroke="#E8EDF3" strokeWidth={2.6} />
      <Line x1={268} y1={272} x2={234} y2={192} stroke="#E8EDF3" strokeWidth={2.6} />
      <Line x1={132} y1={274} x2={268} y2={274} stroke="#E8EDF3" strokeWidth={2.4} />
      {l >= 2 && (
        <G>
          <Circle cx={142} cy={280} r={0.1} fill="none" />
          <Line x1={150} y1={228} x2={165} y2={200} stroke="#7D8794" strokeWidth={3} strokeLinecap="round" />
          <Line x1={250} y1={228} x2={235} y2={200} stroke="#7D8794" strokeWidth={3} strokeLinecap="round" />
        </G>
      )}
      {l >= 3 && (
        <G>
          <Polygon points="152,236 248,236 245,229 155,229" fill="#FFC20A" opacity={0.9} />
          <Polygon points="160,214 240,214 238,208 162,208" fill="#FFC20A" opacity={0.9} />
        </G>
      )}
      {l >= 4 && (
        <G>
          <Line x1={132} y1={272} x2={166} y2={192} stroke="#33D6FF" strokeWidth={2.6} />
          <Line x1={268} y1={272} x2={234} y2={192} stroke="#33D6FF" strokeWidth={2.6} />
          <Line x1={132} y1={272} x2={166} y2={192} stroke="#33D6FF" strokeWidth={8} opacity={0.15} />
          <Line x1={268} y1={272} x2={234} y2={192} stroke="#33D6FF" strokeWidth={8} opacity={0.15} />
        </G>
      )}
    </G>
  );
}

function Chip({ id, level, canUpgrade, left, top }: { id: EquipmentId; level: number; canUpgrade: boolean; left: number; top: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!canUpgrade) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [canUpgrade, pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.chip, canUpgrade && styles.chipUp, { left, top, transform: [{ translateX: -24 }, { translateY: -11 }, { scale }] }]}
    >
      <Text style={styles.chipIcon}>{EQUIPMENT_BY_ID[id].icon}</Text>
      <Text style={[styles.chipText, canUpgrade && { color: colors.graphit }]}>
        {canUpgrade ? '↑' : ''}
        {level}
      </Text>
    </Animated.View>
  );
}

/**
 * Ich-Perspektive im Patientenraum: Geräte sehen je nach Stufe neuer aus und lassen sich antippen.
 */
export function FirstPersonInterior({
  levels,
  width,
  upgradable,
  onSelect,
}: {
  levels: Record<EquipmentId, number>;
  width: number;
  upgradable: EquipmentId[];
  onSelect: (id: EquipmentId) => void;
}) {
  const height = (width * H) / W;
  const k = width / W;
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Room rtw={levels.rtw} />
        <Rect x={229} y={90} width={36} height={38} rx={6} fill="#000" opacity={0.22} />
        <DeviceArt id="funk" level={levels.funk} size={38} x={227} y={87} />
        <Stretcher l={levels.trage} />
        <Rect x={34} y={96} width={76} height={72} rx={10} fill="#000" opacity={0.25} />
        <DeviceArt id="monitor" level={levels.monitor} size={84} x={28} y={88} />
        <Rect x={291} y={106} width={62} height={62} rx={10} fill="#000" opacity={0.25} />
        <DeviceArt id="beatmung" level={levels.beatmung} size={70} x={285} y={99} />
        <Ellipse cx={50} cy={288} rx={44} ry={6} fill="#000" opacity={0.35} />
        <DeviceArt id="rucksack" level={levels.rucksack} size={86} x={6} y={200} />
        <Rect x={340} y={18} width={58} height={96} rx={8} fill="#000" opacity={0.2} />
        <DeviceArt id="psa" level={levels.psa} size={104} x={334} y={12} />
        {/* Türrahmen der offenen Hecktür */}
        <Rect x={0} y={0} width={W} height={6} fill="#15181C" />
        <Rect x={0} y={0} width={6} height={H} fill="#15181C" />
        <Rect x={W - 6} y={0} width={6} height={H} fill="#15181C" />
      </Svg>
      {(Object.keys(SPOTS) as EquipmentId[]).map((id) => {
        const s = SPOTS[id]!;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={EQUIPMENT_BY_ID[id].title}
            onPress={() => onSelect(id)}
            style={({ pressed }) => [
              styles.spot,
              { left: s.x * k, top: s.y * k, width: s.w * k, height: s.h * k },
              pressed && styles.spotPressed,
            ]}
          />
        );
      })}
      {(Object.keys(SPOTS) as EquipmentId[]).map((id) => (
        <Chip key={id} id={id} level={levels[id]} canUpgrade={upgradable.includes(id)} left={SPOTS[id]!.chipX * k} top={SPOTS[id]!.chipY * k} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  spot: { position: 'absolute', borderRadius: 10 },
  spotPressed: { backgroundColor: 'rgba(31,111,235,0.18)', borderWidth: 1, borderColor: colors.blaulicht },
  chip: {
    position: 'absolute',
    width: 48,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(21,24,28,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  chipUp: { backgroundColor: colors.monitorGruen, borderColor: '#FFFFFF' },
  chipIcon: { fontSize: 11, fontFamily: fonts.regular },
  chipText: { fontSize: 12, fontFamily: fonts.extrabold, color: colors.weiss },
});
