import { Pressable, StyleSheet, View } from 'react-native';
import { Circle, G, Line, Path, Polyline, Rect, Svg } from 'react-native-svg';
import { EquipmentId } from '../game/equipment';
import { colors } from '../theme';

const W = 400;
const H = 240;

/** Klickbare Bereiche im Innenraum (in SVG-Koordinaten) */
const HOTSPOTS: Record<Exclude<EquipmentId, 'rtw'>, { x: number; y: number; w: number; h: number }> = {
  psa: { x: 78, y: 22, w: 70, h: 82 },
  beatmung: { x: 18, y: 66, w: 56, h: 92 },
  monitor: { x: 240, y: 34, w: 110, h: 78 },
  funk: { x: 352, y: 50, w: 46, h: 96 },
  trage: { x: 84, y: 128, w: 230, h: 76 },
  rucksack: { x: 14, y: 160, w: 70, h: 64 },
};

function Psa({ l }: { l: number }) {
  const body = l === 1 ? '#FFD100' : l === 2 ? '#E3262B' : l === 3 ? '#1F3E78' : '#15181C';
  return (
    <G>
      <Line x1={113} y1={24} x2={113} y2={34} stroke="#5F6670" strokeWidth={3} />
      <Path d="M90 40 L136 40 L144 96 L82 96 Z" fill={body} />
      <Path d="M104 40 L113 54 L122 40" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
      {l >= 2 && <Rect x={84} y={74} width={58} height={6} fill={l === 2 ? '#C9CED6' : '#FFD100'} />}
      {l >= 2 && <Rect x={84} y={84} width={58} height={4} fill="#C9CED6" />}
      {l >= 3 && <Rect x={84} y={60} width={58} height={4} fill="#E3262B" />}
      {l >= 4 && (
        <G>
          <Path d="M98 22 Q113 4 128 22 Z" fill="#F2F3F5" stroke="#A7ADB5" />
          <Circle cx={113} cy={18} r={3} fill="#33D6FF" />
        </G>
      )}
    </G>
  );
}

function Beatmung({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Path d="M30 96 Q46 76 62 96 Q66 120 46 128 Q26 120 30 96 Z" fill="#7FC37A" stroke="#4E8F4A" strokeWidth={2} />
        <Circle cx={46} cy={142} r={10} fill="#E9EDF2" stroke="#8C939C" strokeWidth={2} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Rect x={32} y={78} width={26} height={76} rx={12} fill="#E9EDF2" stroke="#A7ADB5" strokeWidth={2} />
        <Rect x={32} y={78} width={26} height={16} rx={8} fill="#FFFFFF" stroke="#A7ADB5" strokeWidth={2} />
        <Rect x={40} y={70} width={10} height={10} fill="#5F6670" />
      </G>
    );
  }
  return (
    <G>
      <Rect x={24} y={76} width={46} height={58} rx={6} fill={l >= 4 ? '#F2F3F5' : '#DADDE2'} stroke="#8C939C" strokeWidth={2} />
      <Rect x={30} y={82} width={34} height={22} rx={2} fill="#0B0E12" />
      <Polyline points="32,98 38,98 41,88 45,100 49,92 62,92" fill="none" stroke={l >= 4 ? '#33D6FF' : '#FFD100'} strokeWidth={2} />
      <Circle cx={36} cy={118} r={5} fill={colors.blaulicht} />
      <Circle cx={52} cy={118} r={5} fill="#5F6670" />
      {l >= 4 && <Path d="M70 110 Q84 120 90 150" fill="none" stroke="#A7ADB5" strokeWidth={4} />}
      <Rect x={34} y={138} width={26} height={18} rx={8} fill="#E9EDF2" stroke="#A7ADB5" />
    </G>
  );
}

function Monitor({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Rect x={262} y={52} width={56} height={46} rx={8} fill="#FFD100" stroke="#B98500" strokeWidth={2} />
        <Path d="M290 66 C284 58 274 64 280 72 L290 82 L300 72 C306 64 296 58 290 66 Z" fill={colors.signalrot} />
        <Path d="M291 68 L287 76 L292 76 L289 84" stroke="#fff" strokeWidth={2} fill="none" />
      </G>
    );
  }
  const big = l >= 3;
  const x = big ? 244 : 258;
  const w = big ? 102 : 70;
  const h = big ? 72 : 52;
  const lines = l === 2 ? [['#2BE38B', 0]] : l === 3 ? [['#2BE38B', 0], ['#33D6FF', 1], ['#FF5A5F', 2]] : [['#2BE38B', 0], ['#33D6FF', 1], ['#FF5A5F', 2], ['#FFD100', 3]];
  return (
    <G>
      <Rect x={x} y={38} width={w} height={h} rx={6} fill="#2A3038" />
      <Rect x={x + 5} y={43} width={w - 10} height={h - 16} rx={2} fill="#05070A" />
      {lines.map(([c, i]) => {
        const y = 52 + (i as number) * ((h - 22) / lines.length);
        const x0 = x + 8;
        return (
          <Polyline
            key={c as string}
            points={`${x0},${y} ${x0 + 12},${y} ${x0 + 16},${y - 6} ${x0 + 20},${y + 4} ${x0 + 24},${y} ${x0 + (w - 30) * 0.6},${y} ${x0 + (w - 30) * 0.6 + 4},${y - 6} ${x0 + (w - 30) * 0.6 + 8},${y + 4} ${x0 + (w - 30) * 0.6 + 12},${y} ${x + w - 8},${y}`}
            fill="none"
            stroke={c as string}
            strokeWidth={1.6}
          />
        );
      })}
      <Rect x={x + 5} y={38 + h - 10} width={w - 10} height={6} rx={2} fill="#3A4048" />
      {l >= 4 && (
        <G>
          <Path d={`M${x + w - 4} 30 Q${x + w + 6} 24 ${x + w + 16} 30`} stroke="#33D6FF" strokeWidth={2} fill="none" />
          <Path d={`M${x + w} 34 Q${x + w + 6} 30 ${x + w + 12} 34`} stroke="#33D6FF" strokeWidth={2} fill="none" />
        </G>
      )}
    </G>
  );
}

function Funk({ l }: { l: number }) {
  if (l === 1) {
    return (
      <G>
        <Rect x={358} y={60} width={34} height={44} fill="#F2E7C9" stroke="#C9B98E" strokeWidth={2} />
        <Path d="M362 70 L388 78 M364 90 L386 84 M372 62 L376 102" stroke="#C9B98E" strokeWidth={2} />
        <Rect x={360} y={112} width={30} height={22} rx={3} fill="#3A4048" />
        <Line x1={384} y1={112} x2={388} y2={98} stroke="#3A4048" strokeWidth={3} />
      </G>
    );
  }
  if (l === 2) {
    return (
      <G>
        <Rect x={358} y={66} width={36} height={26} rx={4} fill="#15181C" />
        <Rect x={361} y={69} width={30} height={20} rx={2} fill="#7FB2FF" />
        <Path d="M366 84 L376 74 L386 82" stroke="#fff" strokeWidth={2} fill="none" />
        <Rect x={360} y={112} width={30} height={22} rx={3} fill="#3A4048" />
      </G>
    );
  }
  if (l === 3) {
    return (
      <G>
        <Rect x={358} y={66} width={36} height={26} rx={4} fill="#15181C" />
        <Rect x={361} y={69} width={30} height={20} rx={2} fill="#7FB2FF" />
        <Rect x={366} y={102} width={20} height={40} rx={6} fill="#15181C" />
        <Rect x={369} y={108} width={14} height={10} rx={2} fill="#2BE38B" />
      </G>
    );
  }
  return (
    <G>
      <Rect x={354} y={58} width={42} height={58} rx={6} fill="#15181C" />
      <Rect x={358} y={62} width={34} height={50} rx={3} fill="#0E2140" />
      <Rect x={361} y={66} width={28} height={8} rx={2} fill="#E3262B" />
      <Rect x={361} y={78} width={13} height={14} rx={2} fill="#33D6FF" />
      <Rect x={376} y={78} width={13} height={14} rx={2} fill="#2BE38B" />
      <Rect x={361} y={96} width={28} height={12} rx={2} fill="#7FB2FF" />
      <Rect x={366} y={122} width={20} height={22} rx={6} fill="#15181C" />
    </G>
  );
}

function Trage({ l }: { l: number }) {
  const mattress = l === 1 ? '#7A7F87' : l === 2 ? '#F08A24' : l === 3 ? '#1F6FEB' : '#15181C';
  return (
    <G>
      {l === 1 && (
        <G>
          <Rect x={92} y={176} width={214} height={8} rx={3} fill="#8C939C" />
          <Rect x={100} y={166} width={198} height={12} rx={4} fill={mattress} />
        </G>
      )}
      {l >= 2 && (
        <G>
          {/* Fahrgestell */}
          {l === 2 ? (
            <G>
              <Line x1={130} y1={176} x2={130} y2={196} stroke="#5F6670" strokeWidth={4} />
              <Line x1={270} y1={176} x2={270} y2={196} stroke="#5F6670" strokeWidth={4} />
            </G>
          ) : (
            <G>
              <Line x1={130} y1={176} x2={270} y2={198} stroke="#5F6670" strokeWidth={5} />
              <Line x1={270} y1={176} x2={130} y2={198} stroke="#5F6670" strokeWidth={5} />
            </G>
          )}
          <Rect x={110} y={194} width={180} height={5} rx={2} fill="#5F6670" />
          {[118, 282].map((x) => (
            <Circle key={x} cx={x} cy={202} r={6} fill="#15181C" />
          ))}
          <Rect x={96} y={168} width={208} height={10} rx={3} fill={l >= 4 ? '#2A3038' : '#A7ADB5'} />
          <Rect x={104} y={152} width={190} height={16} rx={6} fill={mattress} />
          <Path d="M104 160 L104 140 Q110 132 126 140 L132 152 Z" fill={mattress} />
          {l >= 3 && <Rect x={160} y={148} width={6} height={22} fill="#FFD100" />}
          {l >= 3 && <Rect x={240} y={148} width={6} height={22} fill="#FFD100" />}
        </G>
      )}
      {l >= 4 && (
        <G>
          <Rect x={96} y={176} width={208} height={3} fill="#33D6FF" />
          <Rect x={300} y={186} width={16} height={20} rx={3} fill="#2A3038" />
          <Circle cx={308} cy={192} r={3} fill="#2BE38B" />
        </G>
      )}
    </G>
  );
}

function Rucksack({ l }: { l: number }) {
  if (l === 1) {
    return <Rect x={20} y={176} width={58} height={36} rx={6} fill="#7A5230" stroke="#4E3420" strokeWidth={2} />;
  }
  const base = l === 2 ? colors.signalrot : l === 3 ? '#B71C24' : '#15181C';
  return (
    <G>
      <Rect x={24} y={164} width={52} height={50} rx={10} fill={base} />
      <Rect x={30} y={170} width={40} height={10} rx={3} fill="rgba(255,255,255,0.25)" />
      {l === 2 && <Rect x={32} y={188} width={36} height={18} rx={4} fill="rgba(0,0,0,0.2)" />}
      {l === 3 &&
        [0, 1, 2].map((i) => <Rect key={i} x={30 + i * 13} y={186} width={11} height={22} rx={2} fill="rgba(255,255,255,0.35)" />)}
      {l >= 4 &&
        ['#E3262B', '#1F6FEB', '#2BE38B', '#FFD100', '#C38BFF'].map((c, i) => (
          <Rect key={c} x={29 + i * 9} y={186} width={7} height={22} rx={2} fill={c} />
        ))}
      <Rect x={44} y={158} width={12} height={8} rx={3} fill="#3A4048" />
    </G>
  );
}

/** Blick in den Patientenraum meines Rettungswagens. Tippen auf ein Teil wählt es aus. */
export function AmbulanceInterior({
  levels,
  width,
  selected,
  onSelect,
}: {
  levels: Record<EquipmentId, number>;
  width: number;
  selected?: EquipmentId;
  onSelect?: (id: EquipmentId) => void;
}) {
  const height = (width * H) / W;
  const k = width / W;
  const rtw = levels.rtw;
  const wall = rtw === 1 ? '#E8E2D4' : rtw === 2 ? '#E2E6EB' : '#F4F6F9';
  const cabinet = rtw === 1 ? '#D6CDB8' : rtw === 2 ? '#C9D0D9' : '#E3E8EF';
  const floor = rtw >= 4 ? '#2A3038' : rtw === 3 ? '#3A4048' : '#4A4F57';
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Rect x={0} y={0} width={W} height={H} fill={wall} />
        {/* Deckenschränke */}
        <Rect x={0} y={0} width={W} height={20} fill={cabinet} />
        {[40, 160, 280].map((x) => (
          <Rect key={x} x={x} y={14} width={30} height={3} rx={1} fill="#8C939C" />
        ))}
        {rtw >= 3 && <Rect x={0} y={20} width={W} height={3} fill={rtw >= 4 ? '#33D6FF' : '#FFFFFF'} />}
        {/* Fenster in der Hecktür */}
        <Rect x={170} y={40} width={50} height={40} rx={6} fill="#253041" opacity={0.85} />
        {rtw >= 2 && <Rect x={0} y={118} width={W} height={6} fill={rtw === 2 ? colors.signalrot : '#FFD100'} opacity={0.35} />}
        <Rect x={0} y={206} width={W} height={34} fill={floor} />
        <Rect x={350} y={20} width={4} height={186} fill="#A7ADB5" />
        <Psa l={levels.psa} />
        <Beatmung l={levels.beatmung} />
        <Monitor l={levels.monitor} />
        <Funk l={levels.funk} />
        <Trage l={levels.trage} />
        <Rucksack l={levels.rucksack} />
      </Svg>
      {onSelect &&
        (Object.keys(HOTSPOTS) as (keyof typeof HOTSPOTS)[]).map((id) => {
          const s = HOTSPOTS[id];
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={id}
              onPress={() => onSelect(id)}
              style={[
                styles.hot,
                { left: s.x * k, top: s.y * k, width: s.w * k, height: s.h * k },
                selected === id && styles.hotSelected,
              ]}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  hot: { position: 'absolute', borderRadius: 8 },
  hotSelected: { borderWidth: 2, borderColor: colors.blaulicht, backgroundColor: 'rgba(31,111,235,0.08)' },
});
