import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fonts } from '../theme';

/** Mein Hilfspunkt am Abend (Vereinsheim mit Erste-Hilfe-Stützpunkt) – wächst mit den Ausbaustufen (0 bis 3) */
export function HilfspunktBild({
  apotheke,
  raum,
  defi,
  netz,
  kursraum,
  width = 340,
}: {
  apotheke: number;
  raum: number;
  defi: number;
  netz: number;
  kursraum: number;
  width?: number;
}) {
  const w = 360;
  const h = 210;
  const ground = 168;
  const warm = '#FFD98A';
  const aus = '#CFE0DB';
  const kreuz = (x: number, y: number, s: number, c = '#2FD28F') => (
    <G>
      <Rect x={x - s * 0.18} y={y - s * 0.5} width={s * 0.36} height={s} rx={1} fill={c} />
      <Rect x={x - s * 0.5} y={y - s * 0.18} width={s} height={s * 0.36} rx={1} fill={c} />
    </G>
  );
  return (
    <Svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="hp-abend" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#BFE3F2" />
          <Stop offset="0.7" stopColor="#E2F1EE" />
          <Stop offset="1" stopColor="#F6EBDD" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#hp-abend)" />
      {[
        [28, 22],
        [90, 40],
        [160, 14],
        [250, 28],
        [320, 16],
      ].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={0} fill="none" />
      ))}

      {/* Baum */}
      <Rect x={328} y={ground - 40} width={6} height={40} fill="#8A6A52" />
      <Circle cx={331} cy={ground - 50} r={22} fill="#5BB589" />
      <Circle cx={320} cy={ground - 40} r={14} fill="#6FC79B" />

      {/* Gebäude mit Satteldach */}
      <Polygon points={`14,${ground - 92} 180,${ground - 128} 346,${ground - 92}`} fill="#9FB8B1" />
      <Polygon
        points={`14,${ground - 92} 180,${ground - 128} 346,${ground - 92} 340,${ground - 88} 20,${ground - 88}`}
        fill="#8EA9A2"
        opacity={0.6}
      />
      <Rect x={22} y={ground - 90} width={316} height={90} fill="#E8DCC4" stroke="#B9A98A" strokeWidth={1.5} />
      <Rect x={22} y={ground - 20} width={316} height={20} fill="#C9B994" />
      {/* Schild */}
      <Rect x={110} y={ground - 84} width={140} height={20} rx={4} fill="#173B2E" stroke="#2FD28F" strokeWidth={1.6} />
      {kreuz(124, ground - 74, 12)}
      <SvgText
        x={190}
        y={ground - 70}
        fontSize={10}
        fontFamily={fonts.artBlack}
        fill="#E8FBF2"
        textAnchor="middle"
        letterSpacing={1.6}
      >
        HILFSPUNKT
      </SvgText>

      {/* Hausapotheke (Fenster mit Schrank) */}
      <Rect
        x={34}
        y={ground - 56}
        width={52}
        height={40}
        rx={2}
        fill={apotheke > 0 ? warm : aus}
        stroke="#B9A98A"
        strokeWidth={1.5}
      />
      {apotheke > 0 && (
        <G>
          <Rect x={40} y={ground - 50} width={40} height={28} fill="#F4F1E6" />
          {kreuz(60, ground - 44, 10)}
          {Array.from({ length: apotheke }, (_, i) => (
            <Rect
              key={i}
              x={44 + i * 12}
              y={ground - 32}
              width={9}
              height={8}
              rx={1}
              fill={['#E5594C', '#4D86D1', '#F2B63A'][i]}
            />
          ))}
        </G>
      )}
      <Line x1={60} y1={ground - 56} x2={60} y2={ground - 16} stroke="#B9A98A" strokeWidth={1.2} />

      {/* Erste-Hilfe-Raum (Tür mit Schild) */}
      <Rect
        x={96}
        y={ground - 54}
        width={30}
        height={54}
        rx={2}
        fill={raum > 0 ? '#3E8F76' : '#4A4A55'}
        stroke="#B9A98A"
        strokeWidth={1.5}
      />
      {raum > 0 && (
        <G>
          <Rect x={103} y={ground - 48} width={16} height={16} rx={2} fill="#E8FBF2" />
          {kreuz(111, ground - 40, 10)}
          {raum > 1 && <Rect x={102} y={ground - 24} width={18} height={6} rx={2} fill="#E8FBF2" opacity={0.6} />}
          {raum > 2 && <Circle cx={121} cy={ground - 22} r={2} fill="#FFE68A" />}
        </G>
      )}

      {/* Kursraum (breites Fenster mit Tafel) */}
      <Rect
        x={268}
        y={ground - 56}
        width={62}
        height={40}
        rx={2}
        fill={kursraum > 0 ? '#2C4A7A' : aus}
        stroke="#B9A98A"
        strokeWidth={1.5}
      />
      {kursraum > 0 && (
        <G>
          <Rect x={274} y={ground - 50} width={30} height={18} fill="#EAF0F8" />
          <Path d={`M278 ${ground - 40} h14 M278 ${ground - 36} h20`} stroke="#6B7A90" strokeWidth={1.2} />
          {kursraum > 1 && <Circle cx={314} cy={ground - 34} r={5} fill="#E3B88A" />}
          {kursraum > 1 && <Rect x={309} y={ground - 29} width={10} height={9} rx={3} fill="#E5594C" />}
          {kursraum > 2 && <Rect x={306} y={ground - 22} width={22} height={5} rx={2} fill="#F4F1E6" />}
        </G>
      )}

      {/* Defi-Wandkasten außen */}
      <G>
        {defi > 1 && <Circle cx={160} cy={ground - 36} r={26} fill="#2FD28F" opacity={0.14} />}
        <Rect
          x={144}
          y={ground - 58}
          width={32}
          height={40}
          rx={5}
          fill={defi > 0 ? '#1F8A5B' : '#2A3342'}
          stroke="#0E3A28"
          strokeWidth={1.5}
        />
        {defi > 0 && (
          <G>
            <Rect x={148} y={ground - 54} width={24} height={20} rx={3} fill="#E8FBF2" />
            <Path
              d={`M160 ${ground - 36} C150 ${ground - 42} 150 ${ground - 50} 155 ${ground - 51} C158 ${ground - 51} 160 ${ground - 49} 160 ${ground - 47} C160 ${ground - 49} 162 ${ground - 51} 165 ${ground - 51} C170 ${ground - 50} 170 ${ground - 42} 160 ${ground - 36} Z`}
              fill={colors.signalrot}
            />
            <Rect x={150} y={ground - 28} width={20} height={4} rx={2} fill="#E8FBF2" opacity={0.85} />
          </G>
        )}
        {defi > 1 && <Rect x={158} y={ground - 66} width={4} height={8} fill="#2FD28F" />}
        {defi > 2 && <Circle cx={160} cy={ground - 70} r={4} fill="#2FD28F" />}
      </G>

      {/* Netzwerk: Sprechblasen über dem Dach */}
      {Array.from({ length: netz }, (_, i) => (
        <G key={i} transform={`translate(${196 + i * 34} ${ground - 150 + (i % 2) * 8})`}>
          <Rect x={0} y={0} width={26} height={16} rx={6} fill={i === 2 ? colors.signalrot : '#2DD4BF'} opacity={0.95} />
          <Polygon points="4,16 10,16 5,22" fill={i === 2 ? colors.signalrot : '#2DD4BF'} />
          <Path d="M6 6 H20 M6 10 H15" stroke="#08121F" strokeWidth={1.6} strokeLinecap="round" />
        </G>
      ))}
      {netz > 0 && (
        <G>
          <Path d={`M180 ${ground - 128} V${ground - 142}`} stroke="#FFFFFF" strokeWidth={2} />
          <Circle cx={180} cy={ground - 144} r={2.6} fill={colors.signalrot} />
        </G>
      )}

      {/* Boden, Weg, Bank */}
      <Rect x={0} y={ground} width={w} height={h - ground} fill="#9CCDB4" />
      <Polygon points={`96,${ground} 140,${ground} 168,${h} 70,${h}`} fill="#D6C9B8" />
      <Circle cx={40} cy={34} r={14} fill="#FFE29A" />
      <Rect x={216} y={ground + 14} width={60} height={5} rx={2} fill="#6B4A32" />
      <Rect x={220} y={ground + 19} width={4} height={10} fill="#4A3524" />
      <Rect x={268} y={ground + 19} width={4} height={10} fill="#4A3524" />
      <Ellipse cx={246} cy={ground + 32} rx={34} ry={3} fill="#000" opacity={0.3} />
    </Svg>
  );
}
