import type { ReactElement } from 'react';
import {
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
  Svg,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fonts } from '../theme';

/**
 * Ausrüstung im Auto (Ersthelfer/in) in vier Stufen, jeweils in einem 100 × 100-Feld.
 * Jede Stufe sieht anders aus: vom abgenutzten Altbestand bis zur modernen Profi-Ausrüstung.
 */
export type AutoArtId = 'verbandkasten' | 'warn' | 'waerme' | 'licht' | 'defi' | 'kurs';

const Kreuz = ({ x, y, s, fill = '#fff' }: { x: number; y: number; s: number; fill?: string }) => (
  <G>
    <Rect x={x - s * 0.18} y={y - s * 0.5} width={s * 0.36} height={s} rx={s * 0.06} fill={fill} />
    <Rect x={x - s * 0.5} y={y - s * 0.18} width={s} height={s * 0.36} rx={s * 0.06} fill={fill} />
  </G>
);

function Verbandkasten({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={84} rx={34} ry={5} fill="#000" opacity={0.25} />
        <Path d="M16 38 L84 36 L86 78 L14 80 Z" fill="#6E7F68" />
        <Path d="M16 38 L84 36 L84 44 L16 46 Z" fill="#82937B" />
        <Kreuz x={50} y={60} s={22} fill="#C9D3C4" />
        <Path d="M60 50 L70 58 L64 66" stroke="#4C5A47" strokeWidth={1.6} fill="none" />
        <Rect x={22} y={66} width={22} height={9} rx={1} fill="#E8E3C8" />
        <SvgText x={33} y={73} fontSize={6.5} fontFamily={fonts.artBlack} fill="#B03030" textAnchor="middle">
          2009
        </SvgText>
        <Path d="M14 80 L22 72" stroke="#566351" strokeWidth={1.4} />
        <Rect x={44} y={30} width={14} height={7} rx={2} fill="#5A6954" />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={86} rx={36} ry={5} fill="#000" opacity={0.25} />
        <Rect x={14} y={34} width={72} height={48} rx={7} fill="#1F8A5B" />
        <Rect x={14} y={34} width={72} height={14} rx={7} fill="#2FA874" />
        <Rect x={44} y={26} width={12} height={9} rx={3} fill="#176C47" />
        <Kreuz x={50} y={62} s={26} />
        <Rect x={20} y={72} width={18} height={6} rx={1.5} fill="#fff" opacity={0.9} />
        <SvgText x={29} y={77} fontSize={4.6} fontFamily={fonts.artBlack} fill="#176C47" textAnchor="middle">
          DIN 13164
        </SvgText>
        <Rect x={14} y={34} width={72} height={4} rx={2} fill="#fff" opacity={0.25} />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={38} ry={5} fill="#000" opacity={0.25} />
        <Rect x={10} y={30} width={80} height={54} rx={8} fill="#D8402F" />
        <Rect x={10} y={30} width={80} height={14} rx={8} fill="#EE6A58" />
        <Rect x={40} y={22} width={20} height={10} rx={4} fill="#A62B1E" />
        <Kreuz x={50} y={58} s={26} />
        <Rect x={14} y={70} width={26} height={10} rx={2} fill="#fff" opacity={0.15} />
        <Rect x={60} y={66} width={24} height={14} rx={3} fill="#B6E0F7" />
        <Rect x={62} y={68} width={20} height={4} rx={1} fill="#fff" opacity={0.7} />
        <Path d="M20 74 L30 66 M26 76 L34 70" stroke="#C9CED6" strokeWidth={2.4} strokeLinecap="round" />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={92} rx={32} ry={4} fill="#000" opacity={0.3} />
      <Rect x={26} y={10} width={48} height={78} rx={13} fill="#C8362B" />
      <Rect x={26} y={10} width={48} height={22} rx={13} fill="#E5594C" />
      <Path d="M36 10 Q50 -2 64 10" stroke="#8E2118" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Rect x={34} y={36} width={32} height={24} rx={6} fill="#A62B1E" />
      <Kreuz x={50} y={48} s={16} />
      <Rect x={26} y={62} width={48} height={5} fill="#F7D33C" />
      <Rect x={26} y={69} width={48} height={3} fill="#fff" opacity={0.7} />
      <Rect x={32} y={74} width={36} height={12} rx={4} fill="#A62B1E" />
      <Line x1={50} y1={74} x2={50} y2={86} stroke="#8E2118" strokeWidth={1.6} />
      <Rect x={22} y={34} width={6} height={30} rx={3} fill="#8E2118" />
      <Rect x={72} y={34} width={6} height={30} rx={3} fill="#8E2118" />
      <Circle cx={50} cy={37} r={2} fill="#2DD4BF" />
    </G>
  );
}

const Dreieck = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <G>
    <Polygon points={`${x},${y - s} ${x + s * 1.1},${y + s * 0.8} ${x - s * 1.1},${y + s * 0.8}`} fill="#E5392E" />
    <Polygon points={`${x},${y - s * 0.55} ${x + s * 0.62},${y + s * 0.48} ${x - s * 0.62},${y + s * 0.48}`} fill="#fff" />
    <Polygon points={`${x},${y - s * 0.28} ${x + s * 0.36},${y + s * 0.34} ${x - s * 0.36},${y + s * 0.34}`} fill="#FFE9B0" />
  </G>
);

const Weste = ({ x, y, s, c = '#F2D21B' }: { x: number; y: number; s: number; c?: string }) => (
  <G>
    <Path
      d={`M${x - s * 0.5} ${y - s * 0.5} L${x - s * 0.2} ${y - s * 0.5} L${x} ${y - s * 0.2} L${x + s * 0.2} ${y - s * 0.5} L${x + s * 0.5} ${y - s * 0.5} L${x + s * 0.55} ${y + s * 0.55} L${x - s * 0.55} ${y + s * 0.55} Z`}
      fill={c}
    />
    <Rect x={x - s * 0.55} y={y + s * 0.05} width={s * 1.1} height={s * 0.12} fill="#E8EEF5" />
    <Rect x={x - s * 0.55} y={y + s * 0.28} width={s * 1.1} height={s * 0.12} fill="#E8EEF5" />
  </G>
);

function Warn({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={86} rx={32} ry={4} fill="#000" opacity={0.25} />
        <Dreieck x={36} y={52} s={26} />
        <Path d="M56 50 Q72 46 82 56 L78 82 L58 84 Z" fill="#C7B21A" />
        <Path d="M60 56 L76 60" stroke="#9A8812" strokeWidth={1.6} />
        <Path d="M62 70 L76 72" stroke="#9A8812" strokeWidth={1.6} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={36} ry={4} fill="#000" opacity={0.25} />
        <Dreieck x={30} y={48} s={22} />
        {[
          [56, 40],
          [76, 44],
          [58, 66],
          [78, 70],
        ].map(([x, y], i) => (
          <Weste key={i} x={x} y={y} s={18} c={i % 2 ? '#F2D21B' : '#F28A1B'} />
        ))}
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={90} rx={34} ry={4} fill="#000" opacity={0.25} />
        <Circle cx={36} cy={34} r={26} fill="#FFB300" opacity={0.18} />
        <Rect x={22} y={44} width={28} height={30} rx={6} fill="#2E3440" />
        <Path d="M24 44 A12 14 0 0 1 48 44 Z" fill="#FFB300" />
        <Path d="M24 44 A12 14 0 0 1 48 44 Z" fill="#fff" opacity={0.3} />
        <Rect x={28} y={50} width={16} height={4} rx={2} fill="#FFB300" />
        <Rect x={26} y={66} width={20} height={3} fill="#5A6370" />
        <Line x1={36} y1={30} x2={36} y2={22} stroke="#FFD34D" strokeWidth={3} strokeLinecap="round" />
        <Line x1={22} y1={36} x2={16} y2={30} stroke="#FFD34D" strokeWidth={3} strokeLinecap="round" />
        <Line x1={50} y1={36} x2={56} y2={30} stroke="#FFD34D" strokeWidth={3} strokeLinecap="round" />
        <Dreieck x={72} y={62} s={20} />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={92} rx={38} ry={4} fill="#000" opacity={0.3} />
      <Rect x={14} y={40} width={72} height={46} rx={9} fill="#20272F" />
      <Rect x={14} y={40} width={72} height={12} rx={9} fill="#2F3944" />
      <Rect x={14} y={60} width={72} height={5} fill="#F2D21B" />
      <Rect x={14} y={67} width={72} height={3} fill="#E8EEF5" opacity={0.8} />
      <Path d="M30 40 Q50 28 70 40" stroke="#5A6370" strokeWidth={4} fill="none" strokeLinecap="round" />
      {[28, 72].map((x) => (
        <G key={x}>
          <Circle cx={x} cy={22} r={16} fill="#FFB300" opacity={0.2} />
          <Rect x={x - 8} y={18} width={16} height={14} rx={4} fill="#2E3440" />
          <Path d={`M${x - 8} 18 A8 8 0 0 1 ${x + 8} 18 Z`} fill="#FFB300" />
        </G>
      ))}
      <Dreieck x={50} y={78} s={9} />
      <Circle cx={80} cy={46} r={2} fill="#2DD4BF" />
    </G>
  );
}

function Waerme({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={84} rx={30} ry={4} fill="#000" opacity={0.25} />
        <Path d="M20 40 L78 34 L84 74 L24 80 Z" fill="#E7C23A" />
        <Path d="M20 40 L78 34 L80 46 L22 52 Z" fill="#F6DE76" />
        <Path d="M26 58 L70 53 M28 68 L74 62" stroke="#C09F25" strokeWidth={1.6} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={36} ry={4} fill="#000" opacity={0.25} />
        <Rect x={16} y={52} width={68} height={34} rx={5} fill="#8F6B4E" />
        <Rect x={16} y={52} width={68} height={10} rx={5} fill="#A98466" />
        {[28, 42, 56, 70].map((x) => (
          <Rect key={x} x={x} y={52} width={3} height={34} fill="#6E4F37" />
        ))}
        <Path d="M22 40 L66 34 L72 52 L24 56 Z" fill="#E7C23A" />
        <Path d="M22 40 L66 34 L68 42 L23 47 Z" fill="#F6DE76" />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={90} rx={38} ry={4} fill="#000" opacity={0.25} />
        <Rect x={10} y={56} width={56} height={30} rx={5} fill="#3A6EA8" />
        <Rect x={10} y={56} width={56} height={9} rx={5} fill="#5B8FC7" />
        <Path d="M14 40 L50 35 L54 56 L16 60 Z" fill="#E7C23A" />
        <Rect x={62} y={50} width={26} height={36} rx={11} fill="#D8402F" />
        <Rect x={62} y={50} width={26} height={10} rx={5} fill="#EE6A58" />
        <Rect x={70} y={44} width={10} height={8} rx={2} fill="#7B8794" />
        <Path d="M69 66 Q75 62 81 66 M69 74 Q75 70 81 74" stroke="#fff" strokeWidth={1.8} fill="none" opacity={0.8} />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={92} rx={40} ry={4} fill="#000" opacity={0.3} />
      <Rect x={8} y={44} width={50} height={42} rx={9} fill="#1F2A36" />
      <Rect x={8} y={44} width={50} height={12} rx={9} fill="#2F3D4C" />
      <Rect x={8} y={62} width={50} height={4} fill="#F28A1B" />
      <Path d="M20 44 Q33 34 46 44" stroke="#4A5868" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={33} cy={76} r={3} fill="#2DD4BF" />
      <Rect x={66} y={34} width={22} height={52} rx={9} fill="#4C5B6B" />
      <Rect x={66} y={34} width={22} height={14} rx={7} fill="#7B8A9B" />
      <Rect x={70} y={26} width={14} height={10} rx={3} fill="#D8402F" />
      <Rect x={66} y={60} width={22} height={4} fill="#2DD4BF" />
      <Path
        d="M72 22 Q69 14 73 8 M80 22 Q77 14 81 8"
        stroke="#E8EEF5"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <G opacity={0.9}>
        <Rect x={14} y={20} width={22} height={18} rx={4} fill="#F4D03F" />
        <Path d="M18 26 L32 26 M18 31 L28 31" stroke="#B8860B" strokeWidth={1.6} />
      </G>
    </G>
  );
}

function Licht({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={86} rx={32} ry={4} fill="#000" opacity={0.25} />
        <Rect x={18} y={54} width={50} height={16} rx={5} fill="#7A8594" transform="rotate(-18 43 62)" />
        <Rect x={60} y={42} width={14} height={22} rx={4} fill="#4C5764" transform="rotate(-18 67 53)" />
        <Path d="M74 38 L86 30 L88 44 Z" fill="#FFE68A" opacity={0.6} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={34} ry={4} fill="#000" opacity={0.25} />
        <Path d="M70 36 L98 18 L98 56 Z" fill="#FFF3B0" opacity={0.35} />
        <Rect x={14} y={50} width={46} height={20} rx={7} fill="#2A5FA8" transform="rotate(-14 37 60)" />
        <Rect x={14} y={50} width={46} height={7} rx={3} fill="#4D86D1" transform="rotate(-14 37 60)" />
        <Rect x={54} y={36} width={20} height={30} rx={6} fill="#20262E" transform="rotate(-14 64 51)" />
        <Ellipse cx={72} cy={48} rx={5} ry={11} fill="#FFF3B0" transform="rotate(-14 72 48)" />
        <Rect x={26} y={55} width={14} height={4} rx={2} fill="#fff" opacity={0.7} transform="rotate(-14 33 57)" />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={90} rx={34} ry={4} fill="#000" opacity={0.25} />
        <Path d="M66 34 L100 16 L100 66 Z" fill="#E8F6FF" opacity={0.35} />
        <Path d="M14 56 Q50 30 86 56" stroke="#20262E" strokeWidth={9} fill="none" strokeLinecap="round" />
        <Path d="M14 56 Q50 30 86 56" stroke="#2DD4BF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <Rect x={38} y={34} width={28} height={22} rx={8} fill="#2A323C" />
        <Circle cx={52} cy={45} r={7} fill="#fff" />
        <Circle cx={52} cy={45} r={4} fill="#FFF3B0" />
        <Rect x={44} y={58} width={16} height={6} rx={3} fill="#20262E" />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={92} rx={36} ry={4} fill="#000" opacity={0.3} />
      <Polygon points="34,50 2,10 2,92" fill="#FFF8D2" opacity={0.0} />
      <Path d="M62 38 L100 8 L100 74 Z" fill="#FFF8D2" opacity={0.32} />
      <Path d="M62 44 L100 26 L100 62 Z" fill="#fff" opacity={0.35} />
      <Rect x={26} y={30} width={42} height={44} rx={9} fill="#20272F" />
      <Rect x={26} y={30} width={42} height={12} rx={9} fill="#2F3944" />
      <Rect x={30} y={36} width={34} height={32} rx={6} fill="#FFFFFF" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <Rect
            key={`${r}${c}`}
            x={33 + c * 10.5}
            y={39 + r * 9.6}
            width={8}
            height={7}
            rx={1.5}
            fill="#FFF3B0"
            stroke="#E8C95A"
            strokeWidth={0.6}
          />
        )),
      )}
      <Rect x={44} y={74} width={14} height={8} fill="#5A6370" />
      <Rect x={26} y={82} width={36} height={6} rx={3} fill="#2F3944" />
      <Rect x={8} y={50} width={18} height={8} rx={4} fill="#2DD4BF" />
    </G>
  );
}

function Handy({
  x,
  y,
  w,
  h,
  children,
  c = '#20262E',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactElement | ReactElement[];
  c?: string;
}) {
  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} rx={5} fill={c} />
      <Rect x={x + 2} y={y + 4} width={w - 4} height={h - 8} rx={2} fill="#0E1620" />
      {children}
    </G>
  );
}

function Defi({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={32} ry={4} fill="#000" opacity={0.25} />
        <Rect x={22} y={14} width={34} height={70} rx={6} fill="#6B7380" />
        <Rect x={25} y={20} width={28} height={22} rx={2} fill="#9DB19A" />
        <Path d="M28 30 H50" stroke="#53684F" strokeWidth={2} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <Circle key={`${r}${c}`} cx={31 + c * 8} cy={52 + r * 9} r={2.6} fill="#2A2F37" />),
        )}
        <Rect x={60} y={32} width={28} height={36} rx={2} fill="#F3EFD8" transform="rotate(6 74 50)" />
        <SvgText
          x={74}
          y={48}
          fontSize={8}
          fontFamily={fonts.artBlack}
          fill="#C0392B"
          textAnchor="middle"
          transform="rotate(6 74 50)"
        >
          112
        </SvgText>
        <Path d="M64 54 L84 56 M64 60 L82 62" stroke="#8D8672" strokeWidth={1.2} transform="rotate(6 74 50)" />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={92} rx={26} ry={4} fill="#000" opacity={0.25} />
        <Handy x={28} y={8} w={44} h={80}>
          <G>
            <Circle cx={50} cy={36} r={16} fill={colors.signalrot} />
            <SvgText x={50} y={41} fontSize={14} fontFamily={fonts.artBlack} fill="#fff" textAnchor="middle">
              112
            </SvgText>
            <Rect x={34} y={58} width={32} height={9} rx={4.5} fill="#2DD4BF" />
            <Rect x={34} y={71} width={32} height={6} rx={3} fill="#1F3A4F" />
          </G>
        </Handy>
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={92} rx={28} ry={4} fill="#000" opacity={0.25} />
        <Handy x={26} y={6} w={48} h={84} c="#2A323C">
          <G>
            <Rect x={30} y={14} width={40} height={50} rx={3} fill="#173B2E" />
            <Path d="M30 30 L70 24 M30 44 L70 40 M44 14 L40 64 M58 14 L62 64" stroke="#2A5E49" strokeWidth={1.4} />
            <Circle cx={46} cy={36} r={7} fill="#2FD28F" />
            <Path d="M46 31 V41 M41 36 H51" stroke="#fff" strokeWidth={2.4} />
            <Circle cx={60} cy={50} r={3.6} fill="#2FD28F" opacity={0.7} />
            <Rect x={32} y={68} width={36} height={10} rx={5} fill={colors.signalrot} />
            <SvgText x={50} y={75.5} fontSize={6.4} fontFamily={fonts.artBlack} fill="#fff" textAnchor="middle">
              HELFEN
            </SvgText>
          </G>
        </Handy>
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={94} rx={40} ry={4} fill="#000" opacity={0.3} />
      <Rect x={8} y={22} width={64} height={62} rx={11} fill="#2FA874" />
      <Rect x={8} y={22} width={64} height={16} rx={11} fill="#4BC393" />
      <Path d="M24 22 Q40 8 56 22" stroke="#1F7A55" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Circle cx={40} cy={56} r={19} fill="#fff" />
      <Path d="M40 68 C26 58 26 46 33 44 C37 43 40 46 40 48 C40 46 43 43 47 44 C54 46 54 58 40 68 Z" fill={colors.signalrot} />
      <Path d="M31 56 H37 L40 50 L43 62 L46 56 H49" stroke="#fff" strokeWidth={2} fill="none" />
      <Rect x={14} y={28} width={14} height={6} rx={3} fill="#fff" opacity={0.8} />
      <Circle cx={62} cy={32} r={3} fill="#FFE68A" />
      <Handy x={70} y={44} w={26} h={44} c="#2A323C">
        <G>
          <Circle cx={83} cy={60} r={6} fill="#2FD28F" />
          <Rect x={74} y={74} width={18} height={6} rx={3} fill={colors.signalrot} />
        </G>
      </Handy>
    </G>
  );
}

function Kurs({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Ellipse cx={50} cy={86} rx={30} ry={4} fill="#000" opacity={0.25} />
        <Rect x={22} y={18} width={56} height={66} rx={2} fill="#F2EFE2" transform="rotate(-4 50 50)" />
        <Rect x={26} y={24} width={48} height={8} fill="#C9C5B0" transform="rotate(-4 50 50)" />
        <Path d="M28 42 H70 M28 50 H66 M28 58 H70" stroke="#B8B39B" strokeWidth={2} transform="rotate(-4 50 50)" />
        <Circle cx={62} cy={70} r={7} fill="none" stroke="#B03030" strokeWidth={1.6} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Ellipse cx={50} cy={88} rx={34} ry={4} fill="#000" opacity={0.25} />
        <Rect x={14} y={20} width={72} height={58} rx={3} fill="#FBF7E6" stroke="#D5A021" strokeWidth={2.4} />
        <Rect x={22} y={28} width={56} height={7} fill="#2A5FA8" />
        <Path d="M26 46 H74 M26 54 H66" stroke="#B8B39B" strokeWidth={2} />
        <Circle cx={66} cy={66} r={9} fill="#D5A021" />
        <Circle cx={66} cy={66} r={5.5} fill="#F3D062" />
        <Path d="M60 74 L58 86 L66 80 L74 86 L72 74" fill="#C0392B" />
        <Kreuz x={32} y={68} s={12} fill="#1F8A5B" />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Ellipse cx={50} cy={90} rx={38} ry={4} fill="#000" opacity={0.25} />
        <Rect x={8} y={34} width={48} height={52} rx={4} fill="#2A5FA8" />
        <Rect x={8} y={34} width={8} height={52} rx={3} fill="#1B4682" />
        <Kreuz x={36} y={52} s={18} />
        <Path d="M20 70 H50 M20 76 H44" stroke="#9DBAE3" strokeWidth={2} />
        <Rect x={50} y={20} width={44} height={30} rx={4} fill="#fff" />
        <Rect x={50} y={20} width={44} height={8} rx={4} fill="#1F8A5B" />
        <Circle cx={62} cy={40} r={5} fill="#E3B88A" />
        <Path d="M72 36 H88 M72 42 H84" stroke="#9AA3AF" strokeWidth={2} />
        <Kreuz x={86} y={24} s={5} />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={50} cy={92} rx={40} ry={4} fill="#000" opacity={0.3} />
      <Polygon points="50,6 86,22 50,38 14,22" fill="#20272F" />
      <Rect x={30} y={30} width={40} height={14} rx={3} fill="#2F3944" />
      <Path d="M84 24 V42" stroke="#F2D21B" strokeWidth={2.4} />
      <Circle cx={84} cy={44} r={3} fill="#F2D21B" />
      <Rect x={14} y={52} width={72} height={36} rx={3} fill="#FBF7E6" stroke="#D5A021" strokeWidth={2.4} />
      <Path d="M22 62 H78 M22 70 H70" stroke="#B8B39B" strokeWidth={2} />
      <Circle cx={68} cy={78} r={10} fill="#F3D062" stroke="#D5A021" strokeWidth={2} />
      <Kreuz x={68} y={78} s={9} fill="#C0392B" />
      <Path d="M62 86 L60 98 L68 92 L76 98 L74 86" fill="#C0392B" />
    </G>
  );
}

const ART: Record<AutoArtId, (p: { l: number }) => ReactElement> = {
  verbandkasten: Verbandkasten,
  warn: Warn,
  waerme: Waerme,
  licht: Licht,
  defi: Defi,
  kurs: Kurs,
};

export const hatAutoArt = (id: string): id is AutoArtId => id in ART;

export function AutoDeviceArt({ id, level, size }: { id: AutoArtId; level: number; size: number }) {
  const Art = ART[id];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="ad-none" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fff" />
          <Stop offset="1" stopColor="#000" />
        </LinearGradient>
      </Defs>
      <Art l={level} />
    </Svg>
  );
}
