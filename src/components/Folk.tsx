import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Line, Path, Polygon, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/** Punkte eines Rhombus vom Mittelpunkt zur Spitze im Winkel `deg`. */
function rhombus(cx: number, cy: number, R: number, deg: number): string {
  const rad = (a: number) => (a * Math.PI) / 180;
  const r1 = R * 0.52;
  const p = (r: number, a: number) => `${(cx + r * Math.cos(rad(a))).toFixed(2)},${(cy + r * Math.sin(rad(a))).toFixed(2)}`;
  return [p(0, 0), p(r1, deg - 22.5), p(R, deg), p(r1, deg + 22.5)].join(' ');
}

/**
 * Kaheksakand – der achtzackige Stern, eines der ältesten estnischen Ornamente
 * (Fäustlinge, Gürtel, Stickereien). Aus acht Rauten um einen Mittelpunkt.
 */
export function Kaheksakand({
  size = 24,
  color = colors.sinine,
  gap = colors.valge,
  center,
}: {
  size?: number;
  color?: string;
  /** Farbe der Fugen zwischen den Rauten */
  gap?: string;
  /** Farbe des kleinen Quadrats in der Mitte */
  center?: string;
}) {
  const c = size / 2;
  const R = size / 2 - 0.5;
  return (
    <Svg width={size} height={size}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Polygon
          key={i}
          points={rhombus(c, c, R, i * 45 - 90)}
          fill={color}
          stroke={gap}
          strokeWidth={Math.max(0.6, size / 28)}
          strokeLinejoin="round"
        />
      ))}
      {center && (
        <Rect
          x={c - size * 0.09}
          y={c - size * 0.09}
          width={size * 0.18}
          height={size * 0.18}
          fill={center}
          transform={`rotate(45 ${c} ${c})`}
        />
      )}
    </Svg>
  );
}

function useWidth(initial = 360) {
  const [width, setWidth] = useState(initial);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));
  return { width, onLayout };
}

/**
 * Ornamentband nach estnischen Gürtel- und Fäustlingsmustern:
 * Sägezahnkanten oben und unten, dazwischen Sterne und Rauten im Wechsel.
 */
export function Ornament({
  color = colors.sinine,
  accent = colors.must,
  background = 'transparent',
  height = 30,
}: {
  /** veraltet, die Anzahl ergibt sich aus der Breite */
  count?: number;
  color?: string;
  accent?: string;
  background?: string;
  height?: number;
}) {
  const { width, onLayout } = useWidth();
  const tooth = 8;
  const teeth = Math.ceil(width / tooth);
  const cell = height + 6;
  const cells = Math.max(1, Math.floor(width / cell));
  const offset = (width - cells * cell) / 2;
  const mid = height / 2;
  const star = height * 0.62;
  const gapColor = background === 'transparent' ? colors.lumi : background;

  const sawTop = Array.from({ length: teeth })
    .map((_, i) => `${i * tooth},0 ${i * tooth + tooth / 2},4 ${(i + 1) * tooth},0`)
    .join(' ');
  const sawBottom = Array.from({ length: teeth })
    .map((_, i) => `${i * tooth},${height} ${i * tooth + tooth / 2},${height - 4} ${(i + 1) * tooth},${height}`)
    .join(' ');

  return (
    <View onLayout={onLayout} style={{ height, backgroundColor: background }}>
      <Svg width={width} height={height}>
        <Polygon points={`0,0 ${sawTop} ${width},0`} fill={accent} />
        <Polygon points={`0,${height} ${sawBottom} ${width},${height}`} fill={accent} />
        {Array.from({ length: cells }).map((_, i) => {
          const cx = offset + i * cell + cell / 2;
          if (i % 2 === 1) {
            const d = height * 0.2;
            return (
              <G key={i}>
                <Polygon points={`${cx},${mid - d} ${cx + d},${mid} ${cx},${mid + d} ${cx - d},${mid}`} fill={accent} />
                <Line x1={cx - cell / 2 + 3} y1={mid} x2={cx - d - 2} y2={mid} stroke={color} strokeWidth={1.2} />
                <Line x1={cx + d + 2} y1={mid} x2={cx + cell / 2 - 3} y2={mid} stroke={color} strokeWidth={1.2} />
              </G>
            );
          }
          return (
            <G key={i}>
              {Array.from({ length: 8 }).map((_, k) => (
                <Polygon
                  key={k}
                  points={rhombus(cx, mid, star / 2, k * 45 - 90)}
                  fill={color}
                  stroke={gapColor}
                  strokeWidth={0.8}
                />
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const KIHNU = [
  [colors.kihnuRed, 14],
  [colors.kihnuOrange, 3],
  [colors.kihnuRed, 5],
  [colors.must, 2],
  [colors.kihnuYellow, 2],
  [colors.must, 2],
  [colors.kihnuRed, 9],
  [colors.rabaGreen, 2],
  [colors.kihnuRed, 4],
  [colors.sinine, 2],
] as const;
const KIHNU_REPEAT = KIHNU.reduce((s, [, w]) => s + w, 0);

/** Längsstreifen der Kihnu-Röcke (kört) – UNESCO-Kulturerbe. */
export function KihnuStripes({ height = 6 }: { height?: number }) {
  const { width, onLayout } = useWidth();
  const rects: { x: number; w: number; c: string }[] = [];
  for (let x = 0; x < width; x += KIHNU_REPEAT) {
    let o = x;
    for (const [c, w] of KIHNU) {
      rects.push({ x: o, w, c });
      o += w;
    }
  }
  return (
    <View onLayout={onLayout} style={{ height }}>
      <Svg width={width} height={height}>
        {rects.map((r, i) => (
          <Rect key={i} x={r.x} y={0} width={r.w} height={height} fill={r.c} />
        ))}
      </Svg>
    </View>
  );
}

function pine(x: number, base: number, h: number): string {
  const w = h * 0.42;
  const t = h / 3;
  return [
    `${x},${base - h}`,
    `${x + w * 0.45},${base - h + t}`,
    `${x + w * 0.25},${base - h + t}`,
    `${x + w * 0.72},${base - h + 2 * t}`,
    `${x + w * 0.4},${base - h + 2 * t}`,
    `${x + w},${base - 4}`,
    `${x + 1.5},${base - 4}`,
    `${x + 1.5},${base}`,
    `${x - 1.5},${base}`,
    `${x - 1.5},${base - 4}`,
    `${x - w},${base - 4}`,
    `${x - w * 0.4},${base - h + 2 * t}`,
    `${x - w * 0.72},${base - h + 2 * t}`,
    `${x - w * 0.25},${base - h + t}`,
    `${x - w * 0.45},${base - h + t}`,
  ].join(' ');
}

const SKY_STARS: [number, number, number][] = [
  [42, 38, 9],
  [338, 30, 12],
  [228, 22, 7],
  [372, 84, 6],
  [160, 60, 5],
];

/**
 * Die estnische Flagge als Landschaft: blauer Himmel, schwarze Erde mit der
 * Tallinner Altstadt (Oleviste, Rathaus, Langer Hermann mit Flagge, Stadtmauer)
 * und Kiefern, darunter weißer Schnee.
 */
export function EstoniaScene({ height = 240, night = false }: { height?: number; night?: boolean }) {
  const ground = 192;
  const lit = night ? colors.kihnuYellow : colors.sinineLight;
  return (
    <Svg width="100%" height={height} viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={night ? '#06182C' : colors.sinineDeep} />
          <Stop offset="1" stopColor={night ? colors.sinineDeep : colors.sinine} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={400} height={240} fill="url(#sky)" />
      {SKY_STARS.map(([x, y, r], i) => (
        <G key={i} opacity={night ? 0.9 : 0.35}>
          {Array.from({ length: 8 }).map((_, k) => (
            <Polygon key={k} points={rhombus(x, y, r, k * 45 - 90)} fill={colors.valge} />
          ))}
        </G>
      ))}

      <G fill={colors.must}>
        {/* Kiefern links */}
        <Polygon points={pine(14, ground, 64)} />
        <Polygon points={pine(34, ground, 46)} />
        {/* Stadtmauer mit Kegeltürmen */}
        <Rect x={44} y={168} width={330} height={30} />
        <Rect x={52} y={146} width={18} height={30} />
        <Polygon points="49,147 61,118 73,147" />
        <Rect x={230} y={150} width={16} height={26} />
        <Polygon points="227,151 238,126 249,151" />
        {/* Oleviste-Kirche */}
        <Rect x={92} y={112} width={26} height={70} />
        <Rect x={96} y={96} width={18} height={18} />
        <Polygon points="94,97 105,18 116,97" />
        <Rect x={118} y={140} width={30} height={40} />
        <Polygon points="116,141 133,124 150,141" />
        {/* Giebelhäuser */}
        <Rect x={152} y={146} width={20} height={30} />
        <Polygon points="152,147 162,130 172,147" />
        <Rect x={206} y={150} width={22} height={26} />
        <Polygon points="206,151 217,134 228,151" />
        {/* Rathaus mit Turm */}
        <Rect x={172} y={136} width={34} height={40} />
        <Rect x={183} y={104} width={12} height={34} />
        <Polygon points="181,105 189,62 197,105" />
        <Line x1={189} y1={62} x2={189} y2={54} stroke={colors.must} strokeWidth={1.5} />
        {/* Toompea mit Langem Hermann */}
        <Rect x={250} y={120} width={64} height={56} />
        <Rect x={270} y={90} width={24} height={36} />
        {[0, 1, 2, 3].map((i) => (
          <Rect key={i} x={270 + i * 6.5} y={85} width={4} height={6} />
        ))}
        <Rect x={314} y={128} width={16} height={48} />
        <Polygon points="312,129 322,92 332,129" />
        {/* Kiefern rechts */}
        <Polygon points={pine(352, ground, 54)} />
        <Polygon points={pine(374, ground, 70)} />
        <Polygon points={pine(394, ground, 48)} />
        <Rect x={0} y={ground - 2} width={400} height={50} />
      </G>

      {/* Fahne auf dem Langen Hermann: sinine – must – valge */}
      <Line x1={282} y1={85} x2={282} y2={58} stroke={colors.must} strokeWidth={1.6} />
      <Rect x={283} y={59} width={18} height={4} fill={colors.sinineLight} />
      <Rect x={283} y={63} width={18} height={4} fill={colors.must} />
      <Rect x={283} y={67} width={18} height={4} fill={colors.valge} />

      {/* Erleuchtete Fenster */}
      <G fill={lit} opacity={night ? 0.95 : 0.5}>
        <Rect x={100} y={124} width={3} height={6} />
        <Rect x={107} y={124} width={3} height={6} />
        <Rect x={126} y={152} width={4} height={5} />
        <Rect x={158} y={155} width={3} height={5} />
        <Rect x={178} y={146} width={4} height={6} />
        <Rect x={196} y={146} width={4} height={6} />
        <Rect x={212} y={158} width={3} height={5} />
        <Rect x={258} y={132} width={4} height={6} />
        <Rect x={300} y={132} width={4} height={6} />
        <Rect x={279} y={102} width={5} height={7} />
      </G>

      {/* Schnee */}
      <Path d="M0,206 C70,192 130,214 210,203 C280,194 340,210 400,200 L400,240 L0,240 Z" fill={colors.valge} />
      <Path d="M0,222 C90,214 160,230 250,221 C320,214 360,226 400,220 L400,240 L0,240 Z" fill={colors.lumi} />
    </Svg>
  );
}
