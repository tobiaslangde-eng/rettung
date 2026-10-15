import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/** Farben der vier Auto-Stufen: alter Kleinwagen, Kompaktwagen, Kombi, E-Auto */
const KAROSSE = ['#B9C6C3', '#4C8DF0', '#2FB58A', '#F6FAF8'];

/** Schlichtes Auto in Seitenansicht; die Stufe bestimmt Form und Farbe. */
export function Car({ level = 1, width = 160 }: { level?: number; width?: number }) {
  const l = Math.max(1, Math.min(4, level));
  const body = KAROSSE[l - 1];
  const h = width * 0.5;
  // Stufe 1: kurzer Kleinwagen, Stufe 3: langes Kombi-Dach, Stufe 4: flaches E-Auto
  const dach =
    l === 1
      ? 'M48 34 L66 18 H104 L118 34 Z'
      : l === 2
        ? 'M42 34 L62 16 H112 L128 34 Z'
        : l === 3
          ? 'M40 34 L58 15 H140 L146 34 Z'
          : 'M40 34 L64 17 H116 L138 34 Z';
  return (
    <Svg width={width} height={h} viewBox="0 0 180 90">
      <Rect x={14} y={78} width={152} height={4} rx={2} fill="rgba(15,42,46,0.12)" />
      <G>
        <Path d={dach} fill={body} stroke="#9FB8B1" strokeWidth={1.8} strokeLinejoin="round" />
        <Path
          d="M18 62 V44 Q18 34 30 34 H150 Q164 34 166 46 V62 Q166 66 162 66 H22 Q18 66 18 62 Z"
          fill={body}
          stroke={colors.inkSoft}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Fenster */}
        <Path d={l === 3 ? 'M64 32 L74 20 H96 V32 Z M100 32 V20 H136 L140 32 Z' : 'M60 32 L70 21 H90 V32 Z M94 32 V21 H106 L114 32 Z'} fill="#CFE8F7" />
        {/* Scheinwerfer und Rücklicht */}
        <Rect x={156} y={44} width={8} height={5} rx={2} fill={l === 4 ? '#7DD3FC' : '#FDE68A'} />
        <Rect x={19} y={44} width={6} height={6} rx={2} fill="#F87171" />
        {/* Grünes Kreuz ab Stufe 2: Erste-Hilfe-Ausrüstung an Bord */}
        {l >= 2 && (
          <G>
            <Rect x={84} y={42} width={16} height={16} rx={3} fill={colors.white} />
            <Rect x={90} y={45} width={4} height={10} fill="#12805C" />
            <Rect x={87} y={48} width={10} height={4} fill="#12805C" />
          </G>
        )}
      </G>
      {/* Details je Stufe */}
      {l === 1 && (
        <G>
          <Circle cx={40} cy={55} r={3} fill="#8A5A3C" opacity={0.7} />
          <Circle cx={132} cy={50} r={2.4} fill="#8A5A3C" opacity={0.7} />
          <Path d="M100 40 L108 46 L104 52" stroke="#6B727C" strokeWidth={1.4} fill="none" />
          <Path d="M150 34 L158 14" stroke={colors.inkSoft} strokeWidth={1.4} />
        </G>
      )}
      {l === 2 && (
        <G>
          <Path d="M60 15 H112" stroke="#5B6470" strokeWidth={2.4} strokeLinecap="round" />
          <Rect x={72} y={9} width={28} height={6} rx={2} fill="#1F3E78" />
        </G>
      )}
      {l === 3 && (
        <G>
          <Rect x={70} y={4} width={54} height={11} rx={4} fill="#2F3944" stroke={colors.inkSoft} strokeWidth={1.4} />
          <Rect x={132} y={8} width={12} height={7} rx={2} fill="#F7B500" />
          <Circle cx={138} cy={5} r={5} fill="#F7B500" opacity={0.25} />
          <Rect x={18} y={50} width={146} height={3} fill="#fff" opacity={0.25} />
        </G>
      )}
      {l === 4 && (
        <G>
          <Rect x={120} y={11} width={22} height={4} rx={2} fill="#2DD4BF" />
          <Rect x={122} y={6} width={18} height={4} rx={2} fill="#F7B500" />
          <Path d="M158 56 Q164 54 166 58" stroke="#7DD3FC" strokeWidth={2} fill="none" />
          <Circle cx={30} cy={56} r={3} fill="#2DD4BF" />
          <Path d="M20 60 H160" stroke="#2DD4BF" strokeWidth={1.4} opacity={0.6} />
        </G>
      )}
      {[52, 134].map((x) => (
        <G key={x}>
          <Circle cx={x} cy={66} r={13} fill="#26363A" />
          <Circle cx={x} cy={66} r={6} fill={l === 4 ? '#E3F3F0' : '#B7C6C2'} />
        </G>
      ))}
    </Svg>
  );
}
