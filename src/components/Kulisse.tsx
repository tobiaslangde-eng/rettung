import { ReactNode } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Kulisse } from '../data/gefahren/types';

/** Hintergrundbilder für den Gefahren-Check (viewBox 400 × 300, gezeichnet aus einfachen Formen) */
const W = 400;
const H = 300;

function Himmel({ a, b, id }: { a: string; b: string; id: string }) {
  return (
    <>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={a} />
          <Stop offset="1" stopColor={b} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

const Baum = ({ x, y, s = 1, c = '#4FA467' }: { x: number; y: number; s?: number; c?: string }) => (
  <G>
    <Rect x={x - 3 * s} y={y} width={6 * s} height={22 * s} rx={2} fill="#8A6A4A" />
    <Circle cx={x} cy={y - 4 * s} r={20 * s} fill={c} />
    <Circle cx={x - 12 * s} cy={y + 4 * s} r={14 * s} fill={c} />
    <Circle cx={x + 12 * s} cy={y + 4 * s} r={14 * s} fill={c} />
  </G>
);

function zeichne(k: Kulisse): ReactNode {
  switch (k) {
    case 'strasse':
    case 'autobahn': {
      const auto = k === 'autobahn';
      return (
        <>
          <Himmel a="#BFE3F7" b="#EAF6FC" id="sky1" />
          <Path d={`M0 120 Q100 90 200 115 T400 105 L400 150 L0 150 Z`} fill="#9CCB9A" />
          <Baum x={50} y={104} s={0.9} />
          <Baum x={330} y={100} s={1.1} />
          <Rect x={0} y={140} width={W} height={160} fill="#7B8590" />
          <Rect x={0} y={140} width={W} height={8} fill="#B7BEC6" />
          <Rect x={0} y={282} width={W} height={18} fill="#9AA3AC" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Rect key={i} x={14 + i * 52} y={auto ? 214 : 212} width={30} height={5} rx={2} fill="#F4F1E0" />
          ))}
          {auto && <Rect x={0} y={170} width={W} height={4} fill="#F4F1E0" />}
          {auto && <Rect x={0} y={262} width={W} height={4} fill="#F4F1E0" />}
        </>
      );
    }
    case 'wohnung':
      return (
        <>
          <Rect x={0} y={0} width={W} height={H} fill="#F3E7D3" />
          <Rect x={0} y={215} width={W} height={85} fill="#C9A173" />
          {Array.from({ length: 7 }).map((_, i) => (
            <Rect key={i} x={i * 60} y={215} width={2} height={85} fill="#B38A5E" />
          ))}
          <Rect x={30} y={40} width={90} height={100} rx={4} fill="#CFE8F7" stroke="#fff" strokeWidth={6} />
          <Rect x={74} y={40} width={3} height={100} fill="#fff" />
          <Rect x={290} y={50} width={60} height={46} rx={3} fill="#E9C9A0" stroke="#B88B5B" strokeWidth={4} />
          <Rect x={0} y={208} width={W} height={8} fill="#E4D2B5" />
        </>
      );
    case 'kueche':
      return (
        <>
          <Rect x={0} y={0} width={W} height={H} fill="#F7F2E8" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Rect key={'h' + i} x={0} y={i * 26} width={W} height={1.5} fill="#E5DDCB" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <Rect key={'v' + i} x={i * 30} y={0} width={1.5} height={190} fill="#E5DDCB" />
          ))}
          <Rect x={0} y={190} width={W} height={20} fill="#A8A29A" />
          <Rect x={0} y={210} width={W} height={90} fill="#C9B79A" />
          <Rect x={20} y={20} width={110} height={60} rx={4} fill="#D9C7A6" />
          <Rect x={270} y={24} width={90} height={70} rx={4} fill="#DCEAF2" stroke="#fff" strokeWidth={5} />
        </>
      );
    case 'bad':
      return (
        <>
          <Rect x={0} y={0} width={W} height={H} fill="#DDF0F4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <Rect key={'h' + i} x={0} y={i * 25} width={W} height={1.5} fill="#BFDDE4" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <Rect key={'v' + i} x={i * 30} y={0} width={1.5} height={H} fill="#BFDDE4" />
          ))}
          <Rect x={0} y={230} width={W} height={70} fill="#9FB6BD" />
          <Rect x={236} y={150} width={150} height={74} rx={14} fill="#FFFFFF" stroke="#C7DCE2" strokeWidth={4} />
        </>
      );
    case 'baustelle':
      return (
        <>
          <Himmel a="#CFE6F5" b="#F2F7FA" id="sky2" />
          <Rect x={230} y={50} width={130} height={150} fill="#B8B4AC" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Rect key={i} x={226} y={60 + i * 36} width={138} height={5} fill="#E8A23A" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <Rect key={'s' + i} x={232 + i * 40} y={55} width={5} height={150} fill="#E8A23A" />
          ))}
          <Rect x={0} y={190} width={W} height={110} fill="#B89A74" />
          <Path d="M0 215 Q120 195 240 220 T400 210 L400 300 L0 300 Z" fill="#A58662" />
        </>
      );
    case 'wasser':
      return (
        <>
          <Himmel a="#B9E0F5" b="#E8F6FC" id="sky3" />
          <Path d="M0 120 Q100 96 200 118 T400 110 L400 140 L0 140 Z" fill="#8DC28A" />
          <Baum x={44} y={102} s={0.8} />
          <Rect x={0} y={135} width={W} height={165} fill="#4E9FCB" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Path
              key={i}
              d={`M${20 + i * 66} ${180 + (i % 2) * 40} q10 -8 20 0 t20 0`}
              stroke="#9ED2EE"
              strokeWidth={3}
              fill="none"
            />
          ))}
          <Rect x={0} y={262} width={W} height={38} fill="#DCC796" />
        </>
      );
    case 'wald':
      return (
        <>
          <Himmel a="#D3EBC9" b="#EEF7E4" id="sky4" />
          <Rect x={0} y={200} width={W} height={100} fill="#6E9A5A" />
          {[30, 110, 190, 270, 350].map((x, i) => (
            <G key={i}>
              <Rect x={x} y={30} width={14} height={190} fill="#7A5B3E" />
              <Circle cx={x + 7} cy={50} r={34} fill={i % 2 ? '#4F8F50' : '#5FA05A'} />
            </G>
          ))}
          <Path d="M120 300 Q200 230 300 300 Z" fill="#B79A72" />
        </>
      );
    case 'industrie':
      return (
        <>
          <Himmel a="#C9D0D6" b="#E6EAED" id="sky5" />
          <Rect x={30} y={90} width={200} height={110} fill="#8E98A2" />
          <Rect x={250} y={50} width={26} height={150} fill="#7A838C" />
          <Rect x={246} y={44} width={34} height={10} fill="#E0903A" />
          <Rect x={46} y={110} width={40} height={30} fill="#DDE6EC" />
          <Rect x={100} y={110} width={40} height={30} fill="#DDE6EC" />
          <Rect x={154} y={110} width={40} height={30} fill="#DDE6EC" />
          <Rect x={0} y={200} width={W} height={100} fill="#A9AEB4" />
          <Rect x={0} y={200} width={W} height={5} fill="#E7B63A" />
        </>
      );
    case 'gleis':
      return (
        <>
          <Himmel a="#CFE3F2" b="#F0F6FA" id="sky6" />
          <Rect x={0} y={110} width={W} height={20} fill="#9AA0A6" />
          <Rect x={0} y={130} width={W} height={170} fill="#8B8479" />
          {Array.from({ length: 14 }).map((_, i) => (
            <Rect key={i} x={i * 30 - 6} y={186} width={16} height={74} fill="#5F4F3E" transform={`skewX(-18)`} />
          ))}
          <Rect x={0} y={206} width={W} height={5} fill="#D6D9DC" />
          <Rect x={0} y={238} width={W} height={5} fill="#D6D9DC" />
          <Rect x={0} y={150} width={W} height={5} fill="#F2C94C" />
        </>
      );
    case 'park':
      return (
        <>
          <Himmel a="#BDE4F6" b="#EAF7FB" id="sky7" />
          <Rect x={0} y={130} width={W} height={170} fill="#8FCB7E" />
          <Path d="M130 300 Q190 210 330 150 L350 150 Q210 220 190 300 Z" fill="#E2D2AE" />
          <Baum x={50} y={110} />
          <Baum x={350} y={106} s={1.2} />
          <Baum x={200} y={104} s={0.8} c="#5DAE6E" />
        </>
      );
    case 'keller':
      return (
        <>
          <Rect x={0} y={0} width={W} height={H} fill="#9C9690" />
          {Array.from({ length: 11 }).map((_, i) => (
            <Rect key={i} x={0} y={i * 20} width={W} height={1.5} fill="#8A847E" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <Rect key={'v' + i} x={(i % 2 ? 20 : 0) + i * 36} y={0} width={1.5} height={210} fill="#8A847E" />
          ))}
          <Rect x={0} y={210} width={W} height={90} fill="#6F6A65" />
          <Rect x={300} y={40} width={70} height={36} rx={3} fill="#CFE0EA" stroke="#6F6A65" strokeWidth={4} />
        </>
      );
    case 'sporthalle':
      return (
        <>
          <Rect x={0} y={0} width={W} height={H} fill="#E7E3D9" />
          <Rect x={0} y={0} width={W} height={60} fill="#D3CEC1" />
          <Rect x={0} y={150} width={W} height={150} fill="#D9A864" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Rect key={i} x={0} y={150 + i * 15} width={W} height={1.5} fill="#C79552" />
          ))}
          <Rect x={0} y={150} width={W} height={6} fill="#C8C2B3" />
          <Circle cx={200} cy={236} r={34} fill="none" stroke="#F8F3E6" strokeWidth={4} />
          <Rect x={0} y={232} width={W} height={4} fill="#F8F3E6" />
        </>
      );
  }
}

export function KulissenBild({ kulisse, width }: { kulisse: Kulisse; width: number }) {
  return (
    <Svg width={width} height={(width * 3) / 4} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      {zeichne(kulisse)}
    </Svg>
  );
}
