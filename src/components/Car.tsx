import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/** Farben der vier Auto-Stufen: alter Kleinwagen, Kompaktwagen, Kombi, E-Auto */
const KAROSSE = ['#9AA3AF', '#3B6FD8', '#1F8A5B', '#F4F5F7'];

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
      <Rect x={14} y={78} width={152} height={4} rx={2} fill={colors.line} />
      <G>
        <Path d={dach} fill={body} stroke={colors.inkSoft} strokeWidth={2} strokeLinejoin="round" />
        <Path
          d="M18 62 V44 Q18 34 30 34 H150 Q164 34 166 46 V62 Q166 66 162 66 H22 Q18 66 18 62 Z"
          fill={body}
          stroke={colors.inkSoft}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Fenster */}
        <Path d={l === 3 ? 'M64 32 L74 20 H96 V32 Z M100 32 V20 H136 L140 32 Z' : 'M60 32 L70 21 H90 V32 Z M94 32 V21 H106 L114 32 Z'} fill="#CFE3F5" />
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
      {[52, 134].map((x) => (
        <G key={x}>
          <Circle cx={x} cy={66} r={13} fill={colors.navy} />
          <Circle cx={x} cy={66} r={6} fill={l === 4 ? '#E5E7EB' : '#9CA3AF'} />
        </G>
      ))}
    </Svg>
  );
}
