import type { ReactElement } from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect, Svg, Text as SvgText } from 'react-native-svg';
import { EquipmentId } from '../game/equipment';
import { colors, fonts } from '../theme';

/**
 * Geräte des Rettungswagens in der Vorderansicht, jeweils in einem 100 × 100-Feld.
 * Werden in der Ich-Perspektive und im Steckbrief (Großansicht) verwendet.
 */

const ecg = (x0: number, y: number, w: number, amp: number) => {
  const s = w / 50;
  const pts = [
    [0, 0], [8, 0], [10, -amp * 0.2], [12, 0], [15, 0], [17, amp * 0.3], [19, -amp], [21, amp * 0.5], [23, 0],
    [30, 0], [33, -amp * 0.25], [36, 0], [50, 0],
  ];
  return pts.map(([x, dy]) => `${(x0 + x * s).toFixed(1)},${(y + dy).toFixed(1)}`).join(' ');
};

function Monitor({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Rect x={22} y={20} width={56} height={62} rx={10} fill="#FFD100" stroke="#B98500" strokeWidth={2.5} />
        <Rect x={28} y={26} width={44} height={30} rx={6} fill="#FFE57A" />
        <Path d="M50 36 C44 28 34 33 39 42 L50 52 L61 42 C66 33 56 28 50 36 Z" fill={colors.signalrot} />
        <Path d="M51 37 L47 45 L52 45 L49 52" stroke="#fff" strokeWidth={2} fill="none" />
        <SvgText x={50} y={72} fontSize={12} fontFamily={fonts.artBlack} fill="#15181C" textAnchor="middle">
          AED
        </SvgText>
        <Circle cx={36} cy={66} r={4} fill="#1F9D55" />
        <Path d="M78 70 Q92 74 88 90" stroke="#5F6670" strokeWidth={3} fill="none" />
      </G>
    );
  }
  const frame = l >= 4 ? '#15181C' : '#2A3038';
  const lines =
    l === 2
      ? [colors.monitorGruen]
      : l === 3
        ? [colors.monitorGruen, '#33D6FF', '#FF5A5F']
        : [colors.monitorGruen, '#33D6FF', '#FF5A5F', '#FFD100'];
  const x = l === 2 ? 14 : 6;
  const w = l === 2 ? 72 : 88;
  const y = l === 2 ? 24 : 16;
  const h = l === 2 ? 50 : 62;
  const screenW = w - (l >= 3 ? 30 : 12);
  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} rx={l >= 4 ? 4 : 7} fill={frame} />
      {l >= 4 && <Rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke="#33D6FF" strokeWidth={1.5} />}
      <Rect x={x + 5} y={y + 5} width={screenW} height={h - 14} rx={2} fill="#05070A" />
      {lines.map((c, i) => (
        <Polyline
          key={c}
          points={ecg(x + 7, y + 13 + i * ((h - 22) / lines.length), screenW - 4, (h - 22) / lines.length / 2.4 + 3)}
          fill="none"
          stroke={c}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ))}
      {l >= 3 &&
        lines.slice(0, 3).map((c, i) => (
          <SvgText key={c} x={x + w - 14} y={y + 16 + i * 14} fontSize={10} fontFamily={fonts.artBlack} fill={c} textAnchor="middle">
            {['72', '98', '120'][i]}
          </SvgText>
        ))}
      {l === 2 && (
        <SvgText x={x + w - 3} y={y + 18} fontSize={9} fontFamily={fonts.artBlack} fill={colors.monitorGruen} textAnchor="end">
          72
        </SvgText>
      )}
      <Rect x={x + 5} y={y + h - 7} width={w - 10} height={3} rx={1} fill="#3A4048" />
      {l === 3 && (
        <G>
          <Rect x={x + 10} y={y + h + 2} width={w - 20} height={12} rx={3} fill="#3A4048" />
          <Circle cx={x + 20} cy={y + h + 8} r={3.5} fill={colors.signalrot} />
          <Circle cx={x + w - 20} cy={y + h + 8} r={3.5} fill="#FFD100" />
        </G>
      )}
      {l >= 4 && (
        <G>
          <Path d="M80 6 Q88 2 96 6" stroke="#33D6FF" strokeWidth={2} fill="none" />
          <Path d="M83 10 Q88 7 93 10" stroke="#33D6FF" strokeWidth={2} fill="none" />
          <Rect x={30} y={y + h + 3} width={40} height={8} rx={3} fill="#15181C" />
          <Circle cx={88} cy={y + h + 7} r={3} fill={colors.monitorGruen} />
        </G>
      )}
    </G>
  );
}

function Beatmung({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Path d="M30 30 Q50 12 70 30 Q80 56 50 66 Q20 56 30 30 Z" fill="#7FC37A" stroke="#4E8F4A" strokeWidth={2.5} />
        <Path d="M38 34 Q50 26 62 34" stroke="#A6DBA2" strokeWidth={3} fill="none" />
        <Rect x={45} y={64} width={10} height={10} fill="#8C939C" />
        <Ellipse cx={50} cy={84} rx={18} ry={10} fill="#E9EDF2" stroke="#8C939C" strokeWidth={2.5} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Rect x={34} y={20} width={32} height={74} rx={14} fill="#F4F6F8" stroke="#A7ADB5" strokeWidth={2} />
        <Rect x={34} y={20} width={32} height={20} rx={12} fill="#FFFFFF" stroke="#A7ADB5" strokeWidth={2} />
        <Rect x={44} y={8} width={12} height={14} rx={2} fill="#5F6670" />
        <Circle cx={50} cy={13} r={4} fill="#DADDE2" />
        <SvgText x={50} y={66} fontSize={10} fontFamily={fonts.artBlack} fill="#5F6670" textAnchor="middle">
          O₂
        </SvgText>
        <Path d="M56 12 Q82 8 80 40 Q78 62 84 70" stroke="#A7DDF0" strokeWidth={3} fill="none" />
        <Ellipse cx={84} cy={76} rx={10} ry={7} fill="#E9F6FB" stroke="#7FB2C7" strokeWidth={2} />
      </G>
    );
  }
  const body = l >= 4 ? '#F4F6F8' : '#DADDE2';
  return (
    <G>
      <Rect x={14} y={18} width={72} height={58} rx={8} fill={body} stroke="#8C939C" strokeWidth={2} />
      <Rect x={20} y={24} width={l >= 4 ? 60 : 44} height={30} rx={3} fill="#0B0E12" />
      <Polyline
        points="23,46 30,46 33,32 38,48 43,40 52,40 55,32 60,46 66,46"
        fill="none"
        stroke={l >= 4 ? '#33D6FF' : '#FFD100'}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {l === 3 && (
        <G>
          <Circle cx={74} cy={31} r={5} fill="#5F6670" />
          <Circle cx={74} cy={47} r={5} fill="#5F6670" />
        </G>
      )}
      <Rect x={20} y={60} width={16} height={9} rx={3} fill={colors.blaulicht} />
      <Rect x={40} y={60} width={16} height={9} rx={3} fill="#5F6670" />
      {l >= 4 && <Rect x={60} y={60} width={20} height={9} rx={3} fill={colors.monitorGruen} />}
      <Path d="M50 76 Q50 90 70 92" stroke="#A7ADB5" strokeWidth={4} fill="none" />
      {l >= 4 && <Ellipse cx={78} cy={90} rx={10} ry={7} fill="#E9F6FB" stroke="#33D6FF" strokeWidth={2} />}
    </G>
  );
}

function Rucksack({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Path d="M38 26 Q50 12 62 26" stroke="#4E3420" strokeWidth={5} fill="none" />
        <Rect x={16} y={26} width={68} height={56} rx={10} fill="#7A5230" stroke="#4E3420" strokeWidth={2.5} />
        <Rect x={16} y={40} width={68} height={4} fill="#4E3420" />
        <Rect x={44} y={38} width={12} height={10} rx={2} fill="#C9A15A" />
      </G>
    );
  }
  const base = l === 2 ? colors.signalrot : l === 3 ? '#B71C24' : '#15181C';
  return (
    <G>
      <Rect x={20} y={14} width={60} height={76} rx={14} fill={base} />
      <Rect x={27} y={20} width={46} height={14} rx={5} fill="rgba(255,255,255,0.22)" />
      <Rect x={20} y={56} width={60} height={5} fill="#C9CED6" />
      {l === 2 && <Rect x={30} y={64} width={40} height={20} rx={5} fill="rgba(0,0,0,0.22)" />}
      {l === 3 &&
        [0, 1, 2].map((i) => <Rect key={i} x={27 + i * 16} y={38} width={14} height={34} rx={3} fill="rgba(255,255,255,0.3)" />)}
      {l >= 4 &&
        [colors.signalrot, colors.blaulicht, colors.monitorGruen, '#FFD100', '#C38BFF'].map((c, i) => (
          <Rect key={c} x={25 + i * 10.4} y={36} width={8.5} height={40} rx={2} fill={c} />
        ))}
      {l >= 4 &&
        ['A', 'B', 'C', 'D', 'E'].map((t, i) => (
          <SvgText key={t} x={29.2 + i * 10.4} y={60} fontSize={8} fontFamily={fonts.artBlack} fill="#15181C" textAnchor="middle">
            {t}
          </SvgText>
        ))}
      <Rect x={42} y={6} width={16} height={10} rx={4} fill="#3A4048" />
      <Path d="M34 24 L50 34 L66 24" stroke="rgba(255,255,255,0.6)" strokeWidth={2} fill="none" />
    </G>
  );
}

function Funk({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Rect x={8} y={18} width={54} height={46} fill="#F2E7C9" stroke="#C9B98E" strokeWidth={2} />
        <Path d="M12 30 L58 40 M14 54 L56 46 M30 20 L36 62 M44 20 L40 62" stroke="#C9B98E" strokeWidth={2} />
        <Circle cx={40} cy={44} r={3} fill={colors.signalrot} />
        <Rect x={64} y={36} width={26} height={50} rx={4} fill="#3A4048" />
        <Line x1={84} y1={36} x2={88} y2={12} stroke="#3A4048" strokeWidth={4} strokeLinecap="round" />
        <Rect x={69} y={42} width={16} height={10} rx={1} fill="#9FB08F" />
        {[0, 1, 2].map((i) => (
          <Rect key={i} x={70} y={58 + i * 8} width={14} height={4} rx={1} fill="#5F6670" />
        ))}
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Rect x={10} y={24} width={56} height={40} rx={6} fill="#15181C" />
        <Rect x={14} y={28} width={48} height={32} rx={3} fill="#9CC3FF" />
        <Path d="M18 54 L32 40 L44 48 L58 32" stroke="#fff" strokeWidth={3} fill="none" />
        <Circle cx={58} cy={32} r={3.5} fill={colors.signalrot} />
        <Rect x={70} y={36} width={22} height={50} rx={4} fill="#3A4048" />
        <Line x1={86} y1={36} x2={88} y2={16} stroke="#3A4048" strokeWidth={4} strokeLinecap="round" />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Rect x={8} y={22} width={58} height={42} rx={6} fill="#15181C" />
        <Rect x={12} y={26} width={50} height={34} rx={3} fill="#9CC3FF" />
        <Path d="M16 52 L30 38 L42 46 L56 30" stroke="#fff" strokeWidth={3} fill="none" />
        <Rect x={70} y={30} width={22} height={58} rx={7} fill="#15181C" />
        <Rect x={74} y={38} width={14} height={14} rx={2} fill={colors.monitorGruen} />
        {[0, 1, 2].map((i) => (
          <Circle key={i} cx={81} cy={60 + i * 8} r={2.5} fill="#5F6670" />
        ))}
        <SvgText x={81} y={48} fontSize={7} fontFamily={fonts.artBlack} fill="#15181C" textAnchor="middle">
          DIGI
        </SvgText>
      </G>
    );
  }
  return (
    <G>
      <Rect x={6} y={12} width={88} height={64} rx={7} fill="#15181C" />
      <Rect x={10} y={16} width={80} height={56} rx={4} fill="#0E2140" />
      <Rect x={14} y={20} width={72} height={9} rx={2} fill={colors.signalrot} />
      <SvgText x={50} y={27} fontSize={7} fontFamily={fonts.artBlack} fill="#fff" textAnchor="middle">
        EINSATZ 112 · RD 1
      </SvgText>
      <Rect x={14} y={32} width={44} height={36} rx={2} fill="#1F3E78" />
      <Path d="M16 62 L28 46 L40 54 L54 38" stroke="#9CC3FF" strokeWidth={2} fill="none" />
      <Circle cx={54} cy={38} r={3} fill={colors.signalrot} />
      <Circle cx={28} cy={46} r={2.5} fill={colors.monitorGruen} />
      <Rect x={61} y={32} width={25} height={10} rx={2} fill="#33D6FF" />
      <Rect x={61} y={45} width={25} height={10} rx={2} fill={colors.monitorGruen} />
      <Rect x={61} y={58} width={25} height={10} rx={2} fill="#FFD100" />
      <Rect x={40} y={78} width={20} height={8} rx={3} fill="#15181C" />
    </G>
  );
}

function Psa({ l }: { l: number }) {
  const body = l === 1 ? '#FFD100' : l === 2 ? colors.signalrot : l === 3 ? '#1F3E78' : '#15181C';
  return (
    <G>
      <Line x1={50} y1={4} x2={50} y2={14} stroke="#5F6670" strokeWidth={3} />
      <Path d="M30 18 L70 18 L82 92 L18 92 Z" fill={body} />
      {l >= 2 && <Path d="M18 92 L8 52 L26 22 Z" fill={body} />}
      {l >= 2 && <Path d="M82 92 L92 52 L74 22 Z" fill={body} />}
      <Path d="M42 18 L50 32 L58 18" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
      <Line x1={50} y1={32} x2={50} y2={92} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
      {l === 1 && <Rect x={20} y={62} width={60} height={6} fill="#C9CED6" />}
      {l >= 2 && <Rect x={19} y={66} width={62} height={6} fill={l === 2 ? '#C9CED6' : '#FFD100'} />}
      {l >= 2 && <Rect x={18} y={77} width={64} height={4} fill="#C9CED6" />}
      {l >= 3 && <Rect x={24} y={46} width={52} height={4} fill={colors.signalrot} />}
      {l >= 3 && (
        <SvgText x={50} y={58} fontSize={8} fontFamily={fonts.artBlack} fill="#fff" textAnchor="middle">
          RETTUNGSDIENST
        </SvgText>
      )}
      {l >= 4 && (
        <G>
          <Path d="M32 16 Q50 -6 68 16 Z" fill="#F2F3F5" stroke="#A7ADB5" strokeWidth={1.5} />
          <Rect x={46} y={2} width={8} height={4} rx={1} fill="#33D6FF" />
          <Path d="M66 14 Q78 14 76 26" stroke="#3A4048" strokeWidth={2} fill="none" />
        </G>
      )}
    </G>
  );
}

function Trage({ l }: { l: number }) {
  const mattress = l === 1 ? '#7A7F87' : l === 2 ? '#F08A24' : l === 3 ? colors.blaulicht : '#15181C';
  if (l === 1) {
    return (
      <G>
        <Rect x={4} y={52} width={92} height={6} rx={3} fill="#8C939C" />
        <Rect x={10} y={42} width={80} height={12} rx={4} fill={mattress} />
        <Rect x={4} y={58} width={6} height={10} fill="#8C939C" />
        <Rect x={90} y={58} width={6} height={10} fill="#8C939C" />
      </G>
    );
  }
  return (
    <G>
      {l === 2 ? (
        <G>
          <Line x1={24} y1={58} x2={24} y2={82} stroke="#5F6670" strokeWidth={4} />
          <Line x1={76} y1={58} x2={76} y2={82} stroke="#5F6670" strokeWidth={4} />
        </G>
      ) : (
        <G>
          <Line x1={22} y1={58} x2={78} y2={84} stroke="#5F6670" strokeWidth={5} />
          <Line x1={78} y1={58} x2={22} y2={84} stroke="#5F6670" strokeWidth={5} />
        </G>
      )}
      <Rect x={12} y={82} width={76} height={4} rx={2} fill="#5F6670" />
      <Circle cx={16} cy={90} r={5} fill="#15181C" />
      <Circle cx={84} cy={90} r={5} fill="#15181C" />
      <Rect x={6} y={50} width={88} height={9} rx={3} fill={l >= 4 ? '#2A3038' : '#A7ADB5'} />
      <Rect x={10} y={38} width={80} height={13} rx={5} fill={mattress} />
      <Path d="M10 46 L10 26 Q16 20 28 28 L32 40 Z" fill={mattress} />
      {l >= 3 && <Rect x={40} y={34} width={4} height={20} fill="#FFD100" />}
      {l >= 3 && <Rect x={64} y={34} width={4} height={20} fill="#FFD100" />}
      {l >= 4 && (
        <G>
          <Rect x={6} y={58} width={88} height={2} fill="#33D6FF" />
          <Rect x={88} y={70} width={10} height={16} rx={2} fill="#2A3038" />
          <Circle cx={93} cy={75} r={2} fill={colors.monitorGruen} />
        </G>
      )}
    </G>
  );
}

const ART: Record<Exclude<EquipmentId, 'rtw'>, (p: { l: number }) => ReactElement> = {
  monitor: Monitor,
  beatmung: Beatmung,
  rucksack: Rucksack,
  funk: Funk,
  psa: Psa,
  trage: Trage,
};

/** Ein Gerät in Vorderansicht. Als eigenes <Svg> oder – mit x/y – verschachtelt in einer Szene. */
export function DeviceArt({
  id,
  level,
  size,
  x,
  y,
  height,
}: {
  id: Exclude<EquipmentId, 'rtw'>;
  level: number;
  size: number;
  x?: number;
  y?: number;
  height?: number;
}) {
  const Art = ART[id];
  return (
    <Svg x={x} y={y} width={size} height={height ?? size} viewBox="0 0 100 100">
      <Art l={level} />
    </Svg>
  );
}

/** Dekorative Sternchen für „neu eingebaut“. */
export function Sparkles({ size }: { size: number }) {
  const star = (cx: number, cy: number, r: number) =>
    `${cx},${cy - r} ${cx + r * 0.3},${cy - r * 0.3} ${cx + r},${cy} ${cx + r * 0.3},${cy + r * 0.3} ${cx},${cy + r} ${cx - r * 0.3},${cy + r * 0.3} ${cx - r},${cy} ${cx - r * 0.3},${cy - r * 0.3}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points={star(18, 22, 10)} fill="#FFD100" />
      <Polygon points={star(84, 18, 8)} fill="#FFFFFF" />
      <Polygon points={star(88, 78, 11)} fill="#FFD100" />
      <Polygon points={star(12, 80, 7)} fill="#FFFFFF" />
    </Svg>
  );
}
