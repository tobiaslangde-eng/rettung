import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Line, Path, Polygon, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

function useWidth(initial = 360) {
  const [width, setWidth] = useState(initial);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));
  return { width, onLayout };
}

/**
 * Star of Life – das internationale Symbol des Rettungsdienstes:
 * sechsarmiges Kreuz mit Äskulapstab in der Mitte.
 */
export function StarOfLife({
  size = 24,
  color = colors.blaulicht,
  outline = colors.weiss,
  staff = colors.weiss,
}: {
  size?: number;
  color?: string;
  outline?: string;
  staff?: string;
}) {
  const c = size / 2;
  const w = size * 0.3;
  const len = size * 0.92;
  const o = Math.max(1, size * 0.06);
  const bar = (fill: string, grow: number) =>
    [0, 60, 120].map((deg) => (
      <Rect
        key={`${fill}-${deg}`}
        x={c - w / 2 - grow}
        y={c - len / 2 - grow}
        width={w + grow * 2}
        height={len + grow * 2}
        rx={size * 0.02}
        fill={fill}
        transform={`rotate(${deg} ${c} ${c})`}
      />
    ));
  const top = c - len * 0.36;
  const bottom = c + len * 0.36;
  const sw = Math.max(1, size * 0.045);
  return (
    <Svg width={size} height={size}>
      {bar(outline, o)}
      {bar(color, 0)}
      {size >= 18 && (
        <G stroke={staff} strokeLinecap="round" fill="none">
          <Line x1={c} y1={top} x2={c} y2={bottom} strokeWidth={sw} />
          <Path
            d={`M ${c - size * 0.06} ${bottom - len * 0.08} C ${c + size * 0.12} ${bottom - len * 0.2}, ${c - size * 0.12} ${
              c - len * 0.02
            }, ${c + size * 0.06} ${c - len * 0.16} S ${c - size * 0.02} ${top + len * 0.04}, ${c - size * 0.05} ${top + len * 0.06}`}
            strokeWidth={sw * 0.9}
          />
        </G>
      )}
    </Svg>
  );
}

/** Rot-weiße Warnmarkierung wie am Heck eines Rettungswagens. */
export function WarnStripes({
  height = 12,
  color = colors.signalrot,
  accent = colors.weiss,
}: {
  height?: number;
  color?: string;
  accent?: string;
}) {
  const { width, onLayout } = useWidth();
  const step = height * 2;
  const n = Math.ceil((width + height) / step) + 1;
  return (
    <View onLayout={onLayout} style={{ height, backgroundColor: accent, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        {Array.from({ length: n }).map((_, i) => {
          const x = i * step - height;
          return (
            <Polygon key={i} points={`${x},${height} ${x + height},0 ${x + height * 2},0 ${x + height},${height}`} fill={color} />
          );
        })}
      </Svg>
    </View>
  );
}

/** Reflexstreifen wie an der Einsatzkleidung: Gelb – Silber – Gelb. */
export function ReflexStripes({ height = 6 }: { height?: number }) {
  return (
    <View style={{ height }}>
      <View style={{ flex: 1, backgroundColor: colors.warngelb }} />
      <View style={{ flex: 1, backgroundColor: colors.grau300 }} />
      <View style={{ flex: 1, backgroundColor: colors.warngelb }} />
    </View>
  );
}

/** Ein EKG-Komplex (P, QRS, T) als Pfadstück ab x0. */
function ecgBeat(x0: number, mid: number, w: number, amp: number): string {
  const x = (f: number) => (x0 + f * w).toFixed(1);
  const y = (f: number) => (mid - f * amp).toFixed(1);
  return [
    `L ${x(0.18)} ${y(0)}`,
    `Q ${x(0.23)} ${y(0.16)} ${x(0.28)} ${y(0)}`,
    `L ${x(0.36)} ${y(0)}`,
    `L ${x(0.39)} ${y(-0.12)}`,
    `L ${x(0.43)} ${y(1)}`,
    `L ${x(0.47)} ${y(-0.3)}`,
    `L ${x(0.5)} ${y(0)}`,
    `L ${x(0.6)} ${y(0)}`,
    `Q ${x(0.68)} ${y(0.3)} ${x(0.76)} ${y(0)}`,
    `L ${x(1)} ${y(0)}`,
  ].join(' ');
}

/** Patientenmonitor-Hintergrund: dunkler Verlauf mit feinem Raster. */
export function MonitorScene({ height = 240 }: { height?: number }) {
  const W = 400;
  const H = 240;
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="mon" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.graphit} />
          <Stop offset="1" stopColor={colors.nacht} />
        </LinearGradient>
      </Defs>
      <Rect width={W} height={H} fill="url(#mon)" />
      <G stroke={colors.graphitSoft} strokeWidth={0.6}>
        {Array.from({ length: 21 }).map((_, i) => (
          <Line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={H} />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * 20} x2={W} y2={i * 20} />
        ))}
      </G>
    </Svg>
  );
}

/** Grüne EKG-Kurve wie auf dem Monitor, als eigener Streifen (transparent). */
export function EcgStrip({
  height = 64,
  beats = 3,
  color = colors.monitorGruen,
}: {
  height?: number;
  beats?: number;
  color?: string;
}) {
  const W = 400;
  const H = 100;
  const mid = H * 0.78;
  const bw = W / beats;
  let d = `M 0 ${mid}`;
  for (let i = 0; i < beats; i++) d += ' ' + ecgBeat(i * bw, mid, bw, H * 0.7);
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <Path d={d} stroke={color} strokeOpacity={0.18} strokeWidth={7} fill="none" strokeLinejoin="round" />
      <Path d={d} stroke={color} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

const BUILDINGS: [number, number, number][] = [
  [0, 40, 70],
  [38, 34, 110],
  [70, 46, 84],
  [114, 30, 130],
  [142, 52, 96],
  [192, 36, 150],
  [226, 44, 104],
  [268, 30, 124],
  [296, 50, 88],
  [344, 28, 116],
  [370, 40, 92],
];

/** Stadt bei Nacht mit Straße – Kulisse für die Blaulichtfahrt. */
export function CityScene({ height = 240 }: { height?: number }) {
  const road = 196;
  return (
    <Svg width="100%" height={height} viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id="city" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.nacht} />
          <Stop offset="1" stopColor={colors.graphitSoft} />
        </LinearGradient>
      </Defs>
      <Rect width={400} height={240} fill="url(#city)" />
      {BUILDINGS.map(([x, w, h], i) => (
        <G key={i}>
          <Rect x={x} y={road - h} width={w} height={h} fill={colors.graphit} />
          {Array.from({ length: Math.floor(h / 18) }).map((_, r) =>
            [0, 1].map((cIdx) =>
              (i + r + cIdx) % 3 === 0 ? (
                <Rect
                  key={`${r}-${cIdx}`}
                  x={x + 7 + cIdx * (w / 2 - 2)}
                  y={road - h + 10 + r * 18}
                  width={6}
                  height={8}
                  fill={colors.warngelb}
                  opacity={0.55}
                />
              ) : null,
            ),
          )}
        </G>
      ))}
      <Rect x={0} y={road} width={400} height={44} fill={colors.graphitSoft} />
      <Rect x={0} y={road} width={400} height={2} fill={colors.grau500} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Rect key={i} x={i * 44 + 6} y={road + 22} width={24} height={3} fill={colors.grau300} />
      ))}
    </Svg>
  );
}

/** Fünfzackiger Bewertungsstern (gelber Aufkleber mit Tinten-Umrandung). */
export function RatingStar({ size = 32, filled }: { size?: number; filled: boolean }) {
  const c = size / 2;
  const pts = Array.from({ length: 10 })
    .map((_, i) => {
      const r = i % 2 === 0 ? size / 2 - 2 : size / 4.4;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${(c + r * Math.cos(a)).toFixed(1)},${(c + 1 + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
  return (
    <Svg width={size} height={size}>
      <Polygon
        points={pts}
        fill={filled ? colors.yellow : 'rgba(255,255,255,0.14)'}
        stroke={filled ? colors.ink : 'rgba(255,255,255,0.6)'}
        strokeWidth={filled ? 2.2 : 1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Farben der Dienstgrad-Abzeichen: Bronze, Silber, Gold, Blaulicht. */
const BADGE_TIERS = ['#FFB27A', '#D9E4FF', '#FFE226', '#8FB0FF'];

/**
 * Dienstgrad-Abzeichen als „Profilbild“: Aufkleber mit Tinten-Umrandung, Star of Life in der Mitte,
 * kleine Punkte am unteren Rand zeigen den Rang (nur ab einer gewissen Größe).
 */
export function RankBadge({ size = 72, level, maxLevel = 7 }: { size?: number; level: number; maxLevel?: number }) {
  const tier = BADGE_TIERS[Math.min(BADGE_TIERS.length - 1, Math.floor(level / 2))];
  const c = size / 2;
  const sw = Math.max(2, size * 0.045);
  const showPips = size >= 56;
  const s = size * (showPips ? 0.5 : 0.58);
  const w = s * 0.3;
  const len = s * 0.92;
  const o = Math.max(1.6, size * 0.03);
  const shift = showPips ? -size * 0.04 : 0;
  const arms = (fill: string, grow = 0) =>
    [0, 60, 120].map((deg) => (
      <Rect
        key={`${fill}-${deg}`}
        x={c - w / 2 - grow}
        y={c + shift - len / 2 - grow}
        width={w + grow * 2}
        height={len + grow * 2}
        rx={s * 0.05}
        fill={fill}
        transform={`rotate(${deg} ${c} ${c + shift})`}
      />
    ));
  const top = c + shift - len * 0.36;
  const bottom = c + shift + len * 0.36;
  const stroke = Math.max(1.2, s * 0.055);
  const ringR = size * 0.38;
  const slots = Array.from({ length: maxLevel }, (_, i) => {
    const a = ((140 - (100 / (maxLevel - 1)) * i) * Math.PI) / 180;
    return { x: c + ringR * Math.cos(a), y: c + ringR * Math.sin(a), on: i < level };
  });
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={c - sw / 2} fill={tier} stroke={colors.ink} strokeWidth={sw} />
      {arms(colors.ink, o)}
      {arms(colors.white)}
      {size >= 32 && (
        <G stroke={colors.ink} strokeLinecap="round" fill="none">
          <Line x1={c} y1={top} x2={c} y2={bottom} strokeWidth={stroke} />
          <Path
            d={`M ${c - s * 0.065} ${bottom - len * 0.08} C ${c + s * 0.13} ${bottom - len * 0.2}, ${c - s * 0.13} ${c + shift - len * 0.02}, ${
              c + s * 0.065
            } ${c + shift - len * 0.16} S ${c - s * 0.02} ${top + len * 0.04}, ${c - s * 0.055} ${top + len * 0.06}`}
            strokeWidth={stroke * 0.85}
          />
        </G>
      )}
      {showPips &&
        slots.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={size * 0.034}
            fill={p.on ? colors.ink : 'transparent'}
            stroke={colors.ink}
            strokeOpacity={p.on ? 1 : 0.35}
            strokeWidth={Math.max(1, size * 0.012)}
          />
        ))}
    </Svg>
  );
}
