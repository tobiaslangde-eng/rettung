import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { LaborSzeneId } from '../data/labor';
import { fonts } from '../theme';

export const SZENE_B = 320;
export const SZENE_H = 230;
const HAUT = '#F0C7A5';
const HAUT_DUNKEL = '#DDA983';

interface Overlay {
  e: string;
  x: number;
  y: number;
  s?: number;
}

/** Liegende Person (Rückenlage) von der Seite */
function Liegend({ boden }: { boden: string }) {
  return (
    <>
      <Rect x={0} y={168} width={SZENE_B} height={SZENE_H - 168} fill={boden} />
      <Rect x={206} y={132} width={88} height={34} rx={16} fill="#4A6BE0" />
      <Rect x={98} y={126} width={110} height={44} rx={18} fill="#7DA2FF" />
      <Line x1={112} y1={166} x2={172} y2={172} stroke={HAUT} strokeWidth={12} strokeLinecap="round" />
      <Circle cx={70} cy={148} r={24} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
      <Circle cx={62} cy={144} r={2.6} fill="#5A4636" />
    </>
  );
}

function Arm({ pad }: { pad?: boolean }) {
  return (
    <>
      <Rect x={40} y={86} width={214} height={64} rx={30} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
      <Rect x={250} y={92} width={56} height={52} rx={16} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
      <Path d="M142 108 q18 -16 36 0 q10 14 -4 24 q-20 8 -32 -6 q-6 -10 0 -18 z" fill="#E57373" />
      {pad && <Rect x={134} y={100} width={52} height={40} rx={5} fill="#FFFFFF" stroke="#CFD8D4" strokeWidth={2} />}
    </>
  );
}

function Bild({ szene, s, n }: { szene: LaborSzeneId; s: number; n: number }) {
  switch (szene) {
    case 'bewusstsein':
      return <Liegend boden="#D9E5E0" />;
    case 'decke':
      return (
        <>
          <Liegend boden={s === 0 ? '#BFD3E6' : '#D9E5E0'} />
          {s >= 1 && (
            <Rect
              x={s >= 3 ? 40 : 90}
              y={s >= 3 ? 120 : 122}
              width={s >= 3 ? 260 : 210}
              height={54}
              rx={24}
              fill="#F4C84A"
              stroke="#C9971C"
              strokeWidth={3}
              opacity={0.93}
            />
          )}
          {s >= 3 && <Circle cx={66} cy={146} r={20} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />}
        </>
      );
    case 'verbrennung':
      return (
        <>
          <Rect x={0} y={170} width={SZENE_B} height={60} fill="#D9E5E0" />
          <Arm pad={s >= 4} />
          {s === 1 && <Rect x={40} y={86} width={80} height={64} rx={30} fill="#8EA2C9" opacity={0.85} />}
          {(s === 2 || s === 3) && (
            <>
              <Line x1={160} y1={0} x2={160} y2={104} stroke="#8CCBFF" strokeWidth={12} strokeLinecap="round" opacity={0.85} />
              <Line x1={142} y1={14} x2={150} y2={96} stroke="#8CCBFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
              <Line x1={178} y1={14} x2={170} y2={96} stroke="#8CCBFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
            </>
          )}
        </>
      );
    case 'schlinge':
      return (
        <>
          <Rect x={0} y={190} width={SZENE_B} height={40} fill="#D9E5E0" />
          <Line x1={80} y1={100} x2={66} y2={164} stroke={HAUT} strokeWidth={14} strokeLinecap="round" />
          <Rect x={80} y={74} width={64} height={116} rx={26} fill="#7DA2FF" />
          <Circle cx={112} cy={48} r={26} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
          <Circle cx={120} cy={46} r={2.6} fill="#5A4636" />
          <Line x1={146} y1={98} x2={166} y2={152} stroke={HAUT} strokeWidth={14} strokeLinecap="round" />
          <Line x1={166} y1={152} x2={238} y2={124} stroke={HAUT} strokeWidth={14} strokeLinecap="round" />
          <Circle cx={246} cy={121} r={11} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={2} />
          {s >= 2 && (
            <>
              <Path d="M150 148 L250 112 L232 176 Z" fill="#FFF3C4" stroke="#E0C36A" strokeWidth={2.5} strokeLinejoin="round" />
              <Path d="M150 148 L124 78 M250 112 L130 74" stroke="#E0C36A" strokeWidth={6} strokeLinecap="round" fill="none" />
              {s >= 3 && <Circle cx={127} cy={76} r={7} fill="#E0C36A" />}
            </>
          )}
        </>
      );
    case 'verschlucken':
      return (
        <>
          <Rect x={0} y={214} width={SZENE_B} height={16} fill="#D9E5E0" />
          <Line x1={128} y1={176} x2={118} y2={214} stroke="#4A6BE0" strokeWidth={24} strokeLinecap="round" />
          <Line x1={128} y1={176} x2={176} y2={104} stroke="#7DA2FF" strokeWidth={44} strokeLinecap="round" />
          <Circle cx={196} cy={84} r={24} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
          <Circle cx={204} cy={80} r={2.6} fill="#5A4636" />
          {Array.from({ length: Math.min(n, 5) }).map((_, k) => (
            <Circle key={k} cx={150 + (k % 3) * 8} cy={96 + k * 5} r={5} fill="#FFB400" opacity={0.9} />
          ))}
        </>
      );
    case 'tourniquet':
      return (
        <>
          <Rect x={0} y={170} width={SZENE_B} height={60} fill="#D9E5E0" />
          <Rect x={30} y={98} width={250} height={42} rx={20} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
          <Path d="M268 100 q36 -6 40 24 q-10 20 -40 14 z" fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
          <Path d="M178 112 q12 -12 24 0 q6 10 -4 16 q-14 6 -22 -4 q-4 -6 2 -12 z" fill="#C62828" />
          {s < 3 && [0, 1, 2].map((k) => <Circle key={k} cx={190 + k * 4} cy={146 + k * 13} r={4.5} fill="#C62828" />)}
          {s >= 2 && (
            <>
              <Rect x={120} y={90} width={20} height={58} rx={5} fill="#37474F" />
              <Rect x={126} y={78} width={8} height={30} rx={3} fill="#FFB400" transform={`rotate(${n * 28} 130 93)`} />
            </>
          )}
        </>
      );
  }
}

function overlays(szene: LaborSzeneId, s: number, n: number): Overlay[] {
  switch (szene) {
    case 'bewusstsein':
      return [
        [
          { e: '🗣️', x: 22, y: 76, s: 36 },
          { e: '🙌', x: 106, y: 82, s: 30 },
        ],
        [{ e: '📣', x: 22, y: 70, s: 38 }],
        [{ e: '🙆', x: 18, y: 60, s: 34 }],
        [
          { e: '👀', x: 40, y: 76, s: 28 },
          { e: '👂', x: 80, y: 76, s: 28 },
          { e: '⏱️', x: 220, y: 70, s: 30 },
        ],
        [
          { e: '☎️', x: 220, y: 60, s: 34 },
          { e: '❤️', x: 134, y: 76, s: 34 },
        ],
      ][Math.min(s, 4)];
    case 'verbrennung':
      return [
        [{ e: '♨️', x: 150, y: 30, s: 34 }],
        [{ e: '✂️', x: 60, y: 40, s: 30 }],
        [{ e: '🚰', x: 200, y: 20, s: 34 }],
        [{ e: '🩹', x: 140, y: 30, s: 34 }],
        [{ e: '🚨', x: 140, y: 30, s: 34 }],
      ][Math.min(s, 4)];
    case 'schlinge':
      return [
        [{ e: '🤕', x: 190, y: 30, s: 30 }],
        [{ e: '🧣', x: 240, y: 40, s: 34 }],
        [{ e: '🧣', x: 240, y: 40, s: 34 }],
        [{ e: '🖐️', x: 236, y: 80, s: 28 }],
      ][Math.min(s, 3)];
    case 'verschlucken':
      return [
        [
          { e: '😮', x: 232, y: 56, s: 34 },
          { e: '🗣️', x: 250, y: 100, s: 28 },
        ],
        [{ e: '🧍', x: 40, y: 80, s: 34 }],
        [{ e: '✋', x: 112, y: 70, s: 34 }, ...(n > 0 ? [{ e: '💥', x: 140, y: 56, s: 26 }] : [])],
        [{ e: '🤲', x: 192, y: 118, s: 32 }],
        [{ e: '🤲', x: 192, y: 118, s: 32 }, ...(n > 0 ? [{ e: '💥', x: 214, y: 134, s: 24 }] : [])],
        [{ e: '🚑', x: 220, y: 20, s: 34 }],
      ][Math.min(s, 5)];
    case 'tourniquet':
      return [
        [{ e: '🩸', x: 180, y: 56, s: 30 }],
        [{ e: '📍', x: 128, y: 48, s: 30 }],
        [{ e: '🔄', x: 120, y: 42, s: 26 }],
        [
          { e: '🕐', x: 120, y: 44, s: 30 },
          { e: '☎️', x: 200, y: 44, s: 30 },
        ],
      ][Math.min(s, 3)];
    case 'decke':
      return [
        [
          { e: '❄️', x: 40, y: 80, s: 30 },
          { e: '❄️', x: 240, y: 90, s: 24 },
        ],
        [{ e: '✨', x: 150, y: 76, s: 30 }],
        [{ e: '🧣', x: 40, y: 76, s: 30 }],
        [
          { e: '🗣️', x: 22, y: 76, s: 32 },
          { e: '👀', x: 240, y: 80, s: 28 },
        ],
      ][Math.min(s, 3)];
  }
}

/** Zeichnung zur Übung; `schritt` = aktueller Schritt, `zaehler` = bisher gezählte Tipps */
export function LaborSzene({ szene, schritt, zaehler }: { szene: LaborSzeneId; schritt: number; zaehler: number }) {
  return (
    <View style={{ width: SZENE_B, height: SZENE_H, borderRadius: 18, overflow: 'hidden' }}>
      <Svg width={SZENE_B} height={SZENE_H} viewBox={`0 0 ${SZENE_B} ${SZENE_H}`}>
        <Rect x={0} y={0} width={SZENE_B} height={SZENE_H} fill="#EAF3F0" />
        <Bild szene={szene} s={schritt} n={zaehler} />
      </Svg>
      {overlays(szene, schritt, zaehler).map((o, i) => (
        <Text
          key={i}
          pointerEvents="none"
          style={[styles.emoji, { left: o.x, top: o.y, fontSize: o.s ?? 30, lineHeight: (o.s ?? 30) + 6 }]}
        >
          {o.e}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { position: 'absolute', fontFamily: fonts.regular },
});
