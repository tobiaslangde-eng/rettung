import { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, Rect, Stop, Svg, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

const W = 400;
const H = 200;

function Wheel({ x, level }: { x: number; level: number }) {
  const rim = level >= 4 ? '#E3F3F0' : level >= 3 ? '#D3E3E0' : '#C4D2CF';
  return (
    <G>
      <Circle cx={x} cy={165} r={25} fill="#26363A" />
      <Circle cx={x} cy={165} r={14} fill={rim} stroke="#8EA6A0" strokeWidth={2} />
      {level >= 3 &&
        [0, 72, 144, 216, 288].map((a) => (
          <Line
            key={a}
            x1={x}
            y1={165}
            x2={x + 12 * Math.cos((a * Math.PI) / 180)}
            y2={165 + 12 * Math.sin((a * Math.PI) / 180)}
            stroke="#8EA6A0"
            strokeWidth={level >= 4 ? 3 : 2}
          />
        ))}
      <Circle cx={x} cy={165} r={4} fill="#26363A" />
    </G>
  );
}

/** Blinkende Leuchte: `on` wechselt im Takt, damit Blau und Rot abwechseln. */
const lamp = (on: boolean, color = colors.blaulicht) => (on ? color : '#1C3F7A');

function StarOfLifeSmall({ x, y, r }: { x: number; y: number; r: number }) {
  const w = r * 0.55;
  return (
    <G>
      {[0, 60, 120].map((d) => (
        <Rect
          key={d}
          x={x - w / 2}
          y={y - r}
          width={w}
          height={r * 2}
          rx={1}
          fill={colors.blaulicht}
          transform={`rotate(${d} ${x} ${y})`}
        />
      ))}
      <Line x1={x} y1={y - r * 0.7} x2={x} y2={y + r * 0.7} stroke="#fff" strokeWidth={r * 0.12} />
    </G>
  );
}

/** Battenburg-Muster (gelb-rote Reflexfolie) zwischen x1 und x2. */
function Battenburg({ x1, x2, y, rows, size }: { x1: number; x2: number; y: number; rows: number; size: number }) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let i = 0, x = x1; x < x2; i++, x += size * 1.4) {
      cells.push(
        <Rect
          key={`${r}-${i}`}
          x={x}
          y={y + r * size}
          width={Math.min(size * 1.4, x2 - x)}
          height={size}
          fill={(i + r) % 2 === 0 ? colors.yellow : colors.signalrot}
        />,
      );
    }
  }
  return <G>{cells}</G>;
}

/** Mein Rettungswagen von der Seite – sieht je nach Ausbaustufe 1–4 neuer und moderner aus. */
export function Ambulance({ level, width = 320, blink = false }: { level: number; width?: number; blink?: boolean }) {
  const height = (width * H) / W;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="amb-body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.7" stopColor="#F2F7F5" />
          <Stop offset="1" stopColor="#DCE8E4" />
        </LinearGradient>
        <LinearGradient id="amb-glass" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6FA6C8" />
          <Stop offset="1" stopColor="#2B5778" />
        </LinearGradient>
      </Defs>
      <Ellipse cx={200} cy={190} rx={185} ry={8} fill="rgba(15,42,46,0.16)" />
      {level === 1 && <Van blink={blink} />}
      {level === 2 && <TypeC blink={blink} />}
      {level === 3 && <Modern blink={blink} />}
      {level >= 4 && <Electric blink={blink} />}
      <Wheel x={92} level={level} />
      <Wheel x={312} level={level} />
    </Svg>
  );
}

function Van({ blink }: { blink: boolean }) {
  return (
    <G>
      <Path
        d="M30 165 L30 72 Q30 60 42 60 L284 60 L330 108 L360 115 Q370 118 370 130 L370 165 Z"
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Rect x={31} y={118} width={338} height={14} fill="#F08A24" />
      <Rect x={226} y={70} width={52} height={36} rx={4} fill="url(#amb-glass)" />
      <Polygon points="288,68 324,106 288,106" fill="url(#amb-glass)" />
      <Rect x={40} y={70} width={60} height={30} rx={3} fill="url(#amb-glass)" />
      <SvgText x={150} y={106} fontSize={26} fontFamily={fonts.artBlack} fill="#F08A24" textAnchor="middle">
        112
      </SvgText>
      <Rect x={248} y={48} width={20} height={12} rx={5} fill={lamp(blink)} />
      <Rect x={360} y={132} width={10} height={8} rx={2} fill="#FFE9A8" />
      <Rect x={20} y={150} width={14} height={8} fill="#8C939C" />
    </G>
  );
}

function TypeC({ blink }: { blink: boolean }) {
  return (
    <G>
      <Rect
        x={30}
        y={40}
        width={244}
        height={125}
        rx={6}
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="M274 165 L274 70 L318 70 L354 112 Q370 116 370 130 L370 165 Z"
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Rect x={31} y={120} width={338} height={16} fill={colors.signalrot} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Polygon
          key={i}
          points={`30,${44 + i * 20} 44,${34 + i * 20} 44,${44 + i * 20} 30,${54 + i * 20}`}
          fill={colors.signalrot}
        />
      ))}
      <Rect x={282} y={78} width={30} height={30} rx={3} fill="url(#amb-glass)" />
      <Polygon points="320,76 348,110 320,110" fill="url(#amb-glass)" />
      <SvgText x={160} y={100} fontSize={19} fontFamily={fonts.artBlack} fill={colors.signalrot} textAnchor="middle">
        RETTUNGSDIENST
      </SvgText>
      <Rect x={36} y={30} width={22} height={10} rx={3} fill={lamp(blink)} />
      <Rect x={246} y={30} width={22} height={10} rx={3} fill={lamp(!blink)} />
      <Rect x={290} y={60} width={24} height={10} rx={3} fill={lamp(blink)} />
      <Rect x={358} y={138} width={12} height={8} rx={2} fill="#FFF3C4" />
    </G>
  );
}

function Modern({ blink }: { blink: boolean }) {
  return (
    <G>
      <Rect
        x={28}
        y={32}
        width={248}
        height={133}
        rx={12}
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="M276 165 L276 66 L322 66 L358 110 Q372 114 372 130 L372 165 Z"
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Battenburg x1={30} x2={370} y={112} rows={2} size={14} />
      <Rect x={284} y={74} width={30} height={32} rx={4} fill="url(#amb-glass)" />
      <Polygon points="324,72 352,108 324,108" fill="url(#amb-glass)" />
      <StarOfLifeSmall x={150} y={84} r={18} />
      <SvgText x={150} y={58} fontSize={12} fontFamily={fonts.artBlack} fill="#1F3E78" textAnchor="middle">
        NOTFALLRETTUNG
      </SvgText>
      {/* LED-Lichtbalken und Eckleuchten */}
      <Rect x={282} y={56} width={44} height={9} rx={3} fill={lamp(blink)} />
      <Rect x={302} y={57} width={4} height={7} fill="#fff" opacity={0.7} />
      <Rect x={30} y={36} width={6} height={40} rx={2} fill={lamp(!blink)} />
      <Rect x={268} y={36} width={6} height={40} rx={2} fill={lamp(blink)} />
      <Rect x={360} y={118} width={12} height={6} rx={2} fill={lamp(!blink)} />
      <Rect x={356} y={140} width={16} height={7} rx={2} fill="#FFFFFF" stroke={colors.ink} strokeWidth={2} />
    </G>
  );
}

function Electric({ blink }: { blink: boolean }) {
  return (
    <G>
      {/* Aerodynamischer Aufbau mit dunkler Schürze */}
      <Path
        d="M26 165 L26 44 Q26 28 44 28 L262 28 Q282 28 290 44 L298 62 L330 62 L366 106 Q378 112 378 128 L378 165 Z"
        fill="url(#amb-body)"
        stroke="#A9C2BB"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path d="M27 142 L377 142 L377 165 L27 165 Z" fill="#2A3038" />
      <Battenburg x1={28} x2={376} y={114} rows={1} size={14} />
      <Rect x={28} y={130} width={348} height={4} fill="#33D6FF" />
      <Path d="M300 70 L330 70 L362 108 L300 108 Z" fill="url(#amb-glass)" />
      <Rect x={232} y={44} width={52} height={40} rx={8} fill="url(#amb-glass)" />
      <StarOfLifeSmall x={70} y={76} r={22} />
      <SvgText x={176} y={84} fontSize={14} fontFamily={fonts.artBlack} fill="#1F3E78" textAnchor="middle">
        RETTUNGSDIENST
      </SvgText>
      <Circle cx={344} cy={146} r={10} fill="#1F9D55" />
      <SvgText x={344} y={151} fontSize={13} fontFamily={fonts.artBlack} fill="#fff" textAnchor="middle">
        E
      </SvgText>
      {/* Rundum-LED mit Leuchtschein */}
      <Rect x={40} y={16} width={230} height={16} rx={8} fill={blink ? 'rgba(31,111,235,0.35)' : 'rgba(227,38,43,0.3)'} />
      <Rect x={44} y={20} width={222} height={8} rx={4} fill={lamp(blink)} />
      <Rect x={150} y={20} width={110} height={8} rx={4} fill={lamp(!blink, colors.signalrot)} />
      <Rect x={366} y={116} width={12} height={8} rx={3} fill={lamp(!blink)} />
      <Rect x={360} y={136} width={18} height={5} rx={2} fill="#E3F4FF" />
      <Circle cx={290} cy={50} r={3} fill="#33D6FF" />
    </G>
  );
}
