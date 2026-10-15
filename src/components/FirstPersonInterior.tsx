import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Circle, G, Line, Path, Polygon, Rect, Svg } from 'react-native-svg';
import { EQUIPMENT_BY_ID, EquipmentId } from '../game/equipment';
import { colors, fonts } from '../theme';
import { DeviceArt } from './Devices';

const W = 400;
const H = 300;

/** Fluchtpunkt-Raum: Ich stehe an der offenen Hecktür und schaue nach vorne zur Fahrerkabine. */
const BACK = { x1: 135, x2: 265, y1: 65, y2: 175 };

/** Antippbare Bereiche (SVG-Koordinaten) und wo das Namensschild sitzt */
const SPOTS: Partial<Record<EquipmentId, { x: number; y: number; w: number; h: number; chipX: number; chipY: number }>> = {
  rtw: { x: 158, y: 74, w: 66, h: 48, chipX: 191, chipY: 70 },
  funk: { x: 226, y: 86, w: 40, h: 40, chipX: 246, chipY: 132 },
  monitor: { x: 26, y: 88, w: 88, h: 86, chipX: 70, chipY: 84 },
  beatmung: { x: 284, y: 98, w: 72, h: 72, chipX: 320, chipY: 94 },
  trage: { x: 118, y: 180, w: 164, h: 108, chipX: 200, chipY: 236 },
  rucksack: { x: 4, y: 198, w: 90, h: 92, chipX: 48, chipY: 200 },
  psa: { x: 330, y: 10, w: 70, h: 112, chipX: 366, chipY: 136 },
};

const THEME = [
  { wall: '#DDD5C2', ceil: '#E9E2D2', floor: '#5A5650', cab: '#CFC5AE', light: '#FFF4CC', accent: '#F08A24' },
  { wall: '#DCE1E8', ceil: '#EDF0F4', floor: '#4A4F57', cab: '#C9D0D9', light: '#FFFFFF', accent: colors.signalrot },
  { wall: '#EEF1F5', ceil: '#F7F9FB', floor: '#3A4048', cab: '#DDE3EA', light: '#FFFFFF', accent: '#FFD100' },
  { wall: '#F4F6F9', ceil: '#FFFFFF', floor: '#2A3038', cab: '#E6EBF1', light: '#E9F6FF', accent: '#33D6FF' },
];

/** y-Wert auf der Linie von (x0, y0) zum Punkt (x1, y1) an der Stelle x */
const lerpY = (x: number, x0: number, y0: number, x1: number, y1: number) => y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);

function Room({ rtw }: { rtw: number }) {
  const t = THEME[rtw - 1];
  // Oberschränke links/rechts: Unterkante läuft auf den Fluchtpunkt zu
  const cabTop = (x: number) => lerpY(x, 0, 0, BACK.x1, BACK.y1);
  const cabBottomL = (x: number) => lerpY(x, 0, 58, BACK.x1, 92);
  const cabBottomR = (x: number) => lerpY(x, W, 58, BACK.x2, 92);
  return (
    <G>
      {/* Decke, Wände, Boden */}
      <Polygon points={`0,0 ${W},0 ${BACK.x2},${BACK.y1} ${BACK.x1},${BACK.y1}`} fill={t.ceil} />
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},${BACK.y2} 0,${H}`} fill={t.wall} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},${BACK.y2} ${W},${H}`} fill={t.wall} opacity={0.92} />
      <Polygon points={`0,${H} ${W},${H} ${BACK.x2},${BACK.y2} ${BACK.x1},${BACK.y2}`} fill={t.floor} />
      <Rect x={BACK.x1} y={BACK.y1} width={BACK.x2 - BACK.x1} height={BACK.y2 - BACK.y1} fill={t.cab} />
      {/* Deckenlicht */}
      <Polygon points={`150,0 250,0 222,${BACK.y1} 178,${BACK.y1}`} fill={t.light} />
      {rtw >= 3 && <Polygon points={`160,0 240,0 216,${BACK.y1 - 4} 184,${BACK.y1 - 4}`} fill="#FFFFFF" opacity={0.8} />}
      {rtw >= 4 && (
        <G>
          <Line x1={0} y1={2} x2={BACK.x1} y2={BACK.y1} stroke="#33D6FF" strokeWidth={3} />
          <Line x1={W} y1={2} x2={BACK.x2} y2={BACK.y1} stroke="#33D6FF" strokeWidth={3} />
        </G>
      )}
      {/* Oberschränke */}
      <Polygon points={`0,0 ${BACK.x1},${BACK.y1} ${BACK.x1},92 0,58`} fill={t.cab} />
      <Polygon points={`${W},0 ${BACK.x2},${BACK.y1} ${BACK.x2},92 ${W},58`} fill={t.cab} />
      {[38, 78, 112].map((x) => (
        <G key={x}>
          <Line x1={x} y1={cabTop(x)} x2={x} y2={cabBottomL(x)} stroke="rgba(0,0,0,0.15)" strokeWidth={2} />
          <Line x1={x - 14} y1={cabBottomL(x) - 6} x2={x - 4} y2={cabBottomL(x) - 5} stroke="#8C939C" strokeWidth={2} />
          <Line x1={W - x} y1={cabTop(x)} x2={W - x} y2={cabBottomR(W - x)} stroke="rgba(0,0,0,0.15)" strokeWidth={2} />
        </G>
      ))}
      {/* Zierstreifen an den Wänden */}
      <Polygon points={`0,${H - 92} ${BACK.x1},${BACK.y2 - 18} ${BACK.x1},${BACK.y2 - 14} 0,${H - 82}`} fill={t.accent} opacity={0.5} />
      <Polygon points={`${W},${H - 92} ${BACK.x2},${BACK.y2 - 18} ${BACK.x2},${BACK.y2 - 14} ${W},${H - 82}`} fill={t.accent} opacity={0.5} />
      {/* Fenster zur Fahrerkabine */}
      <Rect x={160} y={78} width={62} height={40} rx={4} fill="#1A2433" />
      <Rect x={163} y={81} width={56} height={20} rx={2} fill="#2C3E5C" />
      {[170, 182, 196, 208].map((x, i) => (
        <Circle key={x} cx={x} cy={88 + (i % 2) * 5} r={1.4} fill="#FFD100" />
      ))}
      <Rect x={163} y={104} width={56} height={11} fill="#0F151E" />
      <Circle cx={176} cy={110} r={6} fill="none" stroke="#3A4048" strokeWidth={2} />
      {/* Halterung für den Monitor */}
      <Path d="M112 128 L122 130" stroke="#5F6670" strokeWidth={5} strokeLinecap="round" />
      {/* Sitz rechts hinten */}
      <Polygon points={`${BACK.x2},140 300,148 300,176 ${BACK.x2},170`} fill="#3A4048" />
      {/* Bodenkante an der Hecktür */}
      <Rect x={0} y={H - 8} width={W} height={8} fill="#FFD100" />
      {Array.from({ length: 20 }, (_, i) => (
        <Polygon key={i} points={`${i * 24},${H} ${i * 24 + 10},${H - 8} ${i * 24 + 18},${H - 8} ${i * 24 + 8},${H}`} fill="#15181C" />
      ))}
    </G>
  );
}

/** Trage in Perspektive auf dem Boden, Kopfteil Richtung Fahrerkabine. */
function Stretcher({ l }: { l: number }) {
  const mattress = l === 1 ? '#7A7F87' : l === 2 ? '#F08A24' : l === 3 ? colors.blaulicht : '#1D2228';
  const frame = l >= 4 ? '#2A3038' : '#A7ADB5';
  return (
    <G>
      {/* Schatten und Gestell */}
      <Polygon points="128,288 272,288 236,196 164,196" fill="rgba(0,0,0,0.25)" />
      <Polygon points="132,272 268,272 234,192 166,192" fill={frame} />
      {/* Liegefläche */}
      <Polygon points="138,262 262,262 230,190 170,190" fill={mattress} />
      <Polygon points="138,262 262,262 258,252 142,252" fill="rgba(0,0,0,0.18)" />
      {/* Kopfteil hochgestellt */}
      <Polygon points="172,196 228,196 224,176 176,176" fill={mattress} />
      <Polygon points="176,176 224,176 222,172 178,172" fill="rgba(255,255,255,0.25)" />
      {l >= 2 && (
        <G>
          <Circle cx={142} cy={280} r={7} fill="#15181C" />
          <Circle cx={258} cy={280} r={7} fill="#15181C" />
        </G>
      )}
      {l >= 3 && (
        <G>
          <Polygon points="150,230 250,230 247,224 153,224" fill="#FFD100" />
          <Polygon points="160,210 240,210 238,205 162,205" fill="#FFD100" />
        </G>
      )}
      {l >= 4 && (
        <G>
          <Line x1={132} y1={272} x2={166} y2={192} stroke="#33D6FF" strokeWidth={2.5} />
          <Line x1={268} y1={272} x2={234} y2={192} stroke="#33D6FF" strokeWidth={2.5} />
        </G>
      )}
      {l === 1 && (
        <G>
          <Line x1={132} y1={276} x2={168} y2={190} stroke="#8C939C" strokeWidth={4} />
          <Line x1={268} y1={276} x2={232} y2={190} stroke="#8C939C" strokeWidth={4} />
        </G>
      )}
    </G>
  );
}

function Chip({ id, level, canUpgrade, left, top }: { id: EquipmentId; level: number; canUpgrade: boolean; left: number; top: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!canUpgrade) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [canUpgrade, pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.chip, canUpgrade && styles.chipUp, { left, top, transform: [{ translateX: -24 }, { translateY: -11 }, { scale }] }]}
    >
      <Text style={styles.chipIcon}>{EQUIPMENT_BY_ID[id].icon}</Text>
      <Text style={[styles.chipText, canUpgrade && { color: colors.graphit }]}>
        {canUpgrade ? '↑' : ''}
        {level}
      </Text>
    </Animated.View>
  );
}

/**
 * Ich-Perspektive im Patientenraum: Geräte sehen je nach Stufe neuer aus und lassen sich antippen.
 */
export function FirstPersonInterior({
  levels,
  width,
  upgradable,
  onSelect,
}: {
  levels: Record<EquipmentId, number>;
  width: number;
  upgradable: EquipmentId[];
  onSelect: (id: EquipmentId) => void;
}) {
  const height = (width * H) / W;
  const k = width / W;
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Room rtw={levels.rtw} />
        <DeviceArt id="funk" level={levels.funk} size={38} x={227} y={87} />
        <Stretcher l={levels.trage} />
        <DeviceArt id="monitor" level={levels.monitor} size={84} x={28} y={88} />
        <DeviceArt id="beatmung" level={levels.beatmung} size={70} x={285} y={99} />
        <DeviceArt id="rucksack" level={levels.rucksack} size={86} x={6} y={200} />
        <DeviceArt id="psa" level={levels.psa} size={104} x={334} y={12} />
        {/* Türrahmen der offenen Hecktür */}
        <Rect x={0} y={0} width={W} height={6} fill="#15181C" />
        <Rect x={0} y={0} width={6} height={H} fill="#15181C" />
        <Rect x={W - 6} y={0} width={6} height={H} fill="#15181C" />
      </Svg>
      {(Object.keys(SPOTS) as EquipmentId[]).map((id) => {
        const s = SPOTS[id]!;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={EQUIPMENT_BY_ID[id].title}
            onPress={() => onSelect(id)}
            style={({ pressed }) => [
              styles.spot,
              { left: s.x * k, top: s.y * k, width: s.w * k, height: s.h * k },
              pressed && styles.spotPressed,
            ]}
          />
        );
      })}
      {(Object.keys(SPOTS) as EquipmentId[]).map((id) => (
        <Chip key={id} id={id} level={levels[id]} canUpgrade={upgradable.includes(id)} left={SPOTS[id]!.chipX * k} top={SPOTS[id]!.chipY * k} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  spot: { position: 'absolute', borderRadius: 10 },
  spotPressed: { backgroundColor: 'rgba(31,111,235,0.18)', borderWidth: 1, borderColor: colors.blaulicht },
  chip: {
    position: 'absolute',
    width: 48,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(21,24,28,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  chipUp: { backgroundColor: colors.monitorGruen, borderColor: '#FFFFFF' },
  chipIcon: { fontSize: 11, fontFamily: fonts.regular },
  chipText: { fontSize: 12, fontFamily: fonts.extrabold, color: colors.weiss },
});
