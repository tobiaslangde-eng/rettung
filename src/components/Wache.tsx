import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

/** Meine Rettungswache bei Nacht – wächst mit den Ausbaustufen (0 bis 3 je Bereich) */
export function WacheBild({
  halle,
  funk,
  lager,
  ruhe,
  schule,
  width = 340,
}: {
  halle: number;
  funk: number;
  lager: number;
  ruhe: number;
  schule: number;
  width?: number;
}) {
  const w = 360;
  const h = 210;
  const ground = 170;
  const lit = (on: boolean, color: string) => (on ? color : '#13233A');
  const doors = halle === 0 ? 1 : halle + 1;
  const doorW = Math.min(52, 170 / doors - 6);
  return (
    <Svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="nacht" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#050D18" />
          <Stop offset="1" stopColor="#12294A" />
        </LinearGradient>
        <LinearGradient id="licht" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE9A8" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#nacht)" />
      {[
        [30, 24],
        [96, 40],
        [150, 16],
        [248, 30],
        [316, 18],
        [204, 52],
      ].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.3} fill="#9DB4D4" />
      ))}
      <Circle cx={318} cy={44} r={11} fill="#E8EEF7" opacity={0.9} />
      <Circle cx={323} cy={41} r={10} fill="#0B1B33" />

      {/* Gebäude */}
      <Rect x={20} y={ground - 92} width={320} height={92} rx={4} fill="#1B2E4B" stroke="#2C4468" strokeWidth={1.5} />
      <Rect x={14} y={ground - 100} width={332} height={10} rx={3} fill="#0F1D33" stroke="#2C4468" strokeWidth={1.5} />
      <Rect x={26} y={ground - 98} width={96} height={5} rx={2} fill={colors.red} />
      <SvgText x={190} y={ground - 91} fontSize={8} fontFamily={fonts.art} fill="#9DB4D4" textAnchor="middle" letterSpacing={2}>
        RETTUNGSWACHE
      </SvgText>

      {/* Fahrzeughalle links */}
      {Array.from({ length: doors }, (_, i) => {
        const x = 30 + i * (doorW + 6);
        return (
          <G key={i}>
            <Rect
              x={x}
              y={ground - 62}
              width={doorW}
              height={62}
              rx={2}
              fill={lit(halle > 0, '#27415F')}
              stroke="#3B5779"
              strokeWidth={1.2}
            />
            {[0, 1, 2, 3, 4].map((k) => (
              <Rect key={k} x={x + 2} y={ground - 58 + k * 11} width={doorW - 4} height={2} fill="#3B5779" />
            ))}
            {halle > 0 && <Rect x={x + doorW / 2 - 7} y={ground - 71} width={14} height={4} rx={2} fill={colors.red} />}
          </G>
        );
      })}
      {halle >= 3 && <Path d={`M30 ${ground + 2} h170`} stroke="#2DD4BF" strokeWidth={2} strokeDasharray="6 4" />}

      {/* Rechter Block */}
      <G>
        {/* Funkraum mit Mast */}
        <Rect x={212} y={ground - 84} width={36} height={32} rx={2} fill={lit(funk > 0, '#134E63')} stroke="#2C4468" />
        {funk > 0 && (
          <G>
            <Path d={`M236 ${ground - 100} V${ground - 128}`} stroke="#9DB4D4" strokeWidth={2} />
            <Circle cx={236} cy={ground - 130} r={3} fill={colors.red} />
            {Array.from({ length: funk }, (_, i) => (
              <Path
                key={i}
                d={`M${236 - 8 - i * 6} ${ground - 130 - 4 - i * 3} q8 -${8 + i * 4} ${16 + i * 12} 0`}
                stroke="#2DD4BF"
                strokeWidth={1.6}
                fill="none"
                opacity={0.85 - i * 0.2}
              />
            ))}
          </G>
        )}
        <Rect x={217} y={ground - 77} width={26} height={4} fill={funk > 1 ? '#2DD4BF' : '#27415F'} />
        <Rect x={217} y={ground - 70} width={14} height={3} fill={funk > 2 ? '#2DD4BF' : '#27415F'} />

        {/* Schulungsraum */}
        <Rect x={254} y={ground - 84} width={78} height={32} rx={2} fill={lit(schule > 0, '#1D3C6B')} stroke="#2C4468" />
        {schule > 0 && <Rect x={260} y={ground - 79} width={34} height={20} rx={1} fill="#EAF0F8" opacity={0.9} />}
        {schule > 1 && <Circle cx={308} cy={ground - 70} r={5} fill="#9DB4D4" />}
        {schule > 2 && <Rect x={300} y={ground - 62} width={24} height={6} rx={2} fill={colors.red} />}

        {/* Ruheraum */}
        <Rect x={212} y={ground - 46} width={72} height={40} rx={2} fill={lit(ruhe > 0, '#7A5A22')} stroke="#2C4468" />
        {ruhe > 0 && <Rect x={212} y={ground - 46} width={72} height={40} fill="url(#licht)" />}
        {ruhe > 1 && <Rect x={222} y={ground - 28} width={26} height={10} rx={4} fill="#B25E3E" />}
        {ruhe > 2 && <Circle cx={268} cy={ground - 34} r={5} fill="#FFE9A8" />}

        {/* Lager */}
        <Rect x={292} y={ground - 46} width={40} height={46} rx={2} fill="#14233A" stroke="#2C4468" />
        {Array.from({ length: lager }, (_, i) => (
          <Rect
            key={i}
            x={298 + (i % 2) * 14}
            y={ground - 14 - Math.floor(i / 2) * 12}
            width={12}
            height={10}
            rx={1}
            fill="#C99A4B"
          />
        ))}
        <Rect x={296} y={ground - 40} width={32} height={4} fill={lager > 0 ? '#2DD4BF' : '#27415F'} />
      </G>

      {/* Straße */}
      <Rect x={0} y={ground} width={w} height={h - ground} fill="#0D1829" />
      <Rect x={0} y={ground + 14} width={w} height={2} fill="#1C3252" />
      {halle > 0 && (
        <G transform={`translate(46 ${ground + 8})`}>
          <Rect x={0} y={-18} width={64} height={18} rx={5} fill="#F2F5FA" />
          <Rect x={42} y={-26} width={24} height={14} rx={4} fill="#F2F5FA" />
          <Rect x={46} y={-23} width={16} height={8} rx={2} fill="#1D3C6B" />
          <Rect x={0} y={-9} width={64} height={4} fill="#E8762D" />
          <Circle cx={14} cy={0} r={5.5} fill="#050D18" />
          <Circle cx={50} cy={0} r={5.5} fill="#050D18" />
          <Rect x={20} y={-22} width={14} height={4} rx={2} fill="#3B82F6" />
        </G>
      )}
    </Svg>
  );
}
