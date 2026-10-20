import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/** Kleine Szenen-Illustrationen für Notfälle, Kapitel und die Startseite */
export type Setting = 'strasse' | 'zuhause' | 'natur' | 'wasser' | 'innen' | 'schule';
export type Pose = 'liegt' | 'sitzt' | 'steht';

const SKIN = ['#F3C9A5', '#E7B58C', '#C98F66', '#A8704B', '#8A5A3C'];
const HAIR = ['#2B2118', '#5A3A22', '#8C5A2B', '#D2A35C', '#B5B5B5', '#1B1B1B'];
const SHIRT = ['#6C8EF5', '#F59E6C', '#B58CE0', '#4FC3A1', '#F2C94C', '#E57373'];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Passende Szene und Haltung der Person aus Ort und Text eines Notfalls ableiten */
export function sceneFor(location: string, text: string): { setting: Setting; pose: Pose } {
  const l = `${location} ${text}`.toLowerCase();
  const setting: Setting = /straße|strasse|autobahn|landstraße|parkplatz|bahnhof|bahnsteig|haltestelle|kreuzung|fahrbahn/.test(l)
    ? 'strasse'
    : /see\b|badesee|schwimm|pool|strand|ostsee|nordsee|fluss|eis\b|deich/.test(l)
      ? 'wasser'
      : /schule|kita|klassen|schulhof|hörsaal|uni\b|turnhalle|sporthalle|mensa/.test(l)
        ? 'schule'
        : /park|wald|wander|garten|spielplatz|sportplatz|feld|wiese|camping|festival|berg/.test(l)
          ? 'natur'
          : /wohnung|küche|keller|haus|zimmer|bad\b|treppe|schlafzimmer|balkon|flur/.test(l)
            ? 'zuhause'
            : 'innen';
  const pose: Pose =
    /bewusstlos|reglos|leblos|liegt|zusammen|kollab|umgekippt|gestürzt|sturz|schnappatmung|nicht ansprechbar/.test(l)
      ? 'liegt'
      : /sitzt|bank|stuhl|hockt|lehnt/.test(l)
        ? 'sitzt'
        : 'steht';
  return { setting, pose };
}

const HOSE = '#3E4A6D';
const SCHUH = '#2B2F3A';

/** Gesicht und Haare einer Figur (Kopfmitte bei 0/0); `zu` = Augen geschlossen (bewusstlos) */
function Kopf({ skin, hair, stil, zu, sorge }: { skin: string; hair: string; stil: number; zu?: boolean; sorge?: boolean }) {
  return (
    <G>
      {stil === 1 && <Rect x={-9.6} y={-3} width={4.2} height={15} rx={2.1} fill={hair} />}
      {stil === 1 && <Rect x={5.4} y={-3} width={4.2} height={15} rx={2.1} fill={hair} />}
      <Ellipse cx={-8} cy={1} rx={1.8} ry={2.4} fill={skin} />
      <Ellipse cx={8} cy={1} rx={1.8} ry={2.4} fill={skin} />
      <Ellipse cx={0} cy={0} rx={8} ry={9} fill={skin} />
      {stil === 3 ? (
        <Path d="M-8 -3 Q-8 -9 0 -9.2 Q8 -9 8 -3 Q4 -6.5 0 -6.5 Q-4 -6.5 -8 -3 Z" fill={hair} />
      ) : (
        <Path d="M-8.6 -1.5 Q-9.4 -10.5 0 -10.4 Q9.4 -10.5 8.6 -1.5 Q4.5 -6.8 0 -6.4 Q-4.5 -6.8 -8.6 -1.5 Z" fill={hair} />
      )}
      {stil === 2 && <Circle cx={0} cy={-12.2} r={3.7} fill={hair} />}
      {zu ? (
        <G stroke="#3A2A22" strokeWidth={0.9} strokeLinecap="round" fill="none">
          <Path d="M-4.6 0.6 Q-3 1.8 -1.4 0.6 M1.4 0.6 Q3 1.8 4.6 0.6" />
        </G>
      ) : (
        <G>
          <Circle cx={-3} cy={0.4} r={1.15} fill="#2B2118" />
          <Circle cx={3} cy={0.4} r={1.15} fill="#2B2118" />
          <Path
            d={sorge ? 'M-4.6 -2 L-1.6 -2.8 M1.6 -2.8 L4.6 -2' : 'M-4.6 -2.4 Q-3 -3.2 -1.6 -2.5 M1.6 -2.5 Q3 -3.2 4.6 -2.4'}
            stroke={hair}
            strokeWidth={0.8}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      )}
      <Path d="M0 1.8 Q1.2 3.4 -0.2 3.8" stroke="rgba(120,70,40,0.5)" strokeWidth={0.7} strokeLinecap="round" fill="none" />
      <Path
        d={sorge || zu ? 'M-2 6 Q0 5.1 2 6' : 'M-2.2 5.4 Q0 7 2.2 5.4'}
        stroke="#9A4B3C"
        strokeWidth={0.9}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}

function Person({
  x,
  ground,
  pose,
  shirt,
  skin,
  hair,
  s = 1,
  flip,
}: {
  x: number;
  ground: number;
  pose: Pose;
  shirt: string;
  skin: string;
  hair: string;
  s?: number;
  flip?: boolean;
}) {
  const f = flip ? -1 : 1;
  const stil = hash(hair + shirt) % 4;
  if (pose === 'liegt') {
    return (
      <G transform={`translate(${x} ${ground}) scale(${s * f} ${s})`}>
        {/* Beine mit Schuhen */}
        <Rect x={26} y={-12} width={30} height={10} rx={5} fill={HOSE} />
        <Ellipse cx={57} cy={-6.5} rx={3} ry={4.2} fill={SCHUH} />
        {/* Oberkörper und Arm */}
        <Rect x={-6} y={-14} width={36} height={14} rx={6.5} fill={shirt} />
        <Rect x={0} y={-8.5} width={24} height={5} rx={2.5} fill={shirt} opacity={0.75} />
        <Circle cx={26} cy={-5} r={2.6} fill={skin} />
        {/* Hals und Kopf (Gesicht nach oben) */}
        <Rect x={-9} y={-12} width={6} height={7} rx={3} fill={skin} />
        <G transform="translate(-16 -10) rotate(-90)">
          <Kopf skin={skin} hair={hair} stil={stil} zu />
        </G>
      </G>
    );
  }
  if (pose === 'sitzt') {
    return (
      <G transform={`translate(${x} ${ground}) scale(${s * f} ${s})`}>
        <Rect x={13} y={-12} width={9} height={14} rx={4} fill={HOSE} />
        <Ellipse cx={22.5} cy={1} rx={5} ry={2.6} fill={SCHUH} />
        <Rect x={-7} y={-16} width={29} height={10} rx={5} fill={HOSE} />
        <Rect x={-8} y={-40} width={16} height={28} rx={7.5} fill={shirt} />
        <Rect x={4} y={-34} width={5} height={15} rx={2.5} fill={shirt} opacity={0.8} transform="rotate(-8 6 -34)" />
        <Circle cx={9.5} cy={-19.5} r={2.6} fill={skin} />
        <Rect x={-2.5} y={-45} width={5} height={7} rx={2.5} fill={skin} />
        <G transform="translate(0 -50)">
          <Kopf skin={skin} hair={hair} stil={stil} sorge />
        </G>
      </G>
    );
  }
  return (
    <G transform={`translate(${x} ${ground}) scale(${s * f} ${s})`}>
      <Rect x={-6.5} y={-26} width={6} height={24} rx={3} fill={HOSE} />
      <Rect x={0.5} y={-26} width={6} height={24} rx={3} fill={HOSE} />
      <Ellipse cx={-4} cy={-1.4} rx={5} ry={2.5} fill={SCHUH} />
      <Ellipse cx={4.6} cy={-1.4} rx={5} ry={2.5} fill={SCHUH} />
      <Rect x={-13} y={-53} width={5.2} height={24} rx={2.6} fill={shirt} />
      <Rect x={7.8} y={-53} width={5.2} height={24} rx={2.6} fill={shirt} />
      <Circle cx={-10.4} cy={-28} r={2.7} fill={skin} />
      <Circle cx={10.4} cy={-28} r={2.7} fill={skin} />
      <Rect x={-9.5} y={-54} width={19} height={31} rx={8.5} fill={shirt} />
      <Rect x={-2.6} y={-60} width={5.2} height={7} rx={2.6} fill={skin} />
      <G transform="translate(0 -66)">
        <Kopf skin={skin} hair={hair} stil={stil} />
      </G>
    </G>
  );
}

/** Hintergrund je Ort; `ground` ist die Höhe der Standfläche */
function Backdrop({ setting, w, ground }: { setting: Setting; w: number; ground: number }) {
  const h = 180;
  const sky = setting === 'zuhause' || setting === 'innen' || setting === 'schule';
  return (
    <G>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={sky ? '#FCEFE3' : '#CFE4FF'} />
          <Stop offset="1" stopColor={sky ? '#FFF8F0' : '#EEF6FF'} />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#sky)" />
      {setting === 'strasse' && (
        <G>
          <Rect x={0} y={ground - 40} width={w} height={40} fill="#D8DEE8" />
          <Rect x={20} y={ground - 78} width={44} height={38} fill="#C5CFE0" />
          <Rect x={70} y={ground - 98} width={34} height={58} fill="#B4C0D6" />
          <Rect x={w - 90} y={ground - 70} width={56} height={30} fill="#C5CFE0" />
          <Rect x={0} y={ground - 6} width={w} height={h - ground + 6} fill="#8E97A8" />
          {Array.from({ length: 8 }, (_, i) => (
            <Rect key={i} x={10 + i * 50} y={ground + 14} width={26} height={4} rx={2} fill="#E8ECF3" />
          ))}
          <G transform={`translate(${w - 118} ${ground - 8})`}>
            <Rect x={0} y={-22} width={64} height={22} rx={7} fill="#E06C6C" />
            <Rect x={12} y={-34} width={34} height={16} rx={6} fill="#E06C6C" />
            <Rect x={17} y={-31} width={24} height={11} rx={3} fill="#DCEBFF" />
            <Circle cx={14} cy={0} r={7} fill="#2F3340" />
            <Circle cx={50} cy={0} r={7} fill="#2F3340" />
          </G>
        </G>
      )}
      {setting === 'natur' && (
        <G>
          <Ellipse cx={w * 0.3} cy={ground + 30} rx={w * 0.6} ry={60} fill="#A8D8A0" />
          <Ellipse cx={w * 0.85} cy={ground + 34} rx={w * 0.5} ry={56} fill="#8CCB88" />
          <Rect x={0} y={ground} width={w} height={h - ground} fill="#7DBE7A" />
          {[38, w - 46, w * 0.62].map((x, i) => (
            <G key={i}>
              <Rect x={x - 3} y={ground - 44 + i * 4} width={6} height={44 - i * 4} fill="#8A6A4B" />
              <Circle cx={x} cy={ground - 54 + i * 4} r={22 - i * 2} fill="#5FAE6B" />
            </G>
          ))}
        </G>
      )}
      {setting === 'wasser' && (
        <G>
          <Circle cx={w - 56} cy={36} r={18} fill="#FFE29A" />
          <Rect x={0} y={ground - 24} width={w} height={h - ground + 24} fill="#6FB7E8" />
          {Array.from({ length: 6 }, (_, i) => (
            <Path
              key={i}
              d={`M${10 + i * 60} ${ground - 8 + (i % 2) * 14} q8 -7 16 0 t16 0`}
              stroke="#E3F3FF"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <Rect x={0} y={ground - 10} width={w * 0.45} height={10} fill="#C9A672" />
        </G>
      )}
      {setting === 'zuhause' && (
        <G>
          <Rect x={0} y={ground} width={w} height={h - ground} fill="#D9B68B" />
          <Rect x={w - 120} y={26} width={74} height={62} rx={6} fill="#CFE4FF" stroke="#fff" strokeWidth={6} />
          <Rect x={w - 86} y={26} width={6} height={62} fill="#fff" />
          <Rect x={24} y={ground - 40} width={92} height={40} rx={10} fill="#8FA7D9" />
          <Rect x={24} y={ground - 58} width={92} height={22} rx={10} fill="#7C95CC" />
          <Rect x={w * 0.55} y={ground - 28} width={48} height={4} fill="#A97F55" />
          <Rect x={w * 0.55 + 4} y={ground - 24} width={4} height={24} fill="#A97F55" />
          <Rect x={w * 0.55 + 40} y={ground - 24} width={4} height={24} fill="#A97F55" />
        </G>
      )}
      {setting === 'schule' && (
        <G>
          <Rect x={0} y={ground} width={w} height={h - ground} fill="#E1C8A0" />
          <Rect x={24} y={22} width={120} height={64} rx={4} fill="#3E7F66" stroke="#B88A52" strokeWidth={5} />
          <Rect x={w - 100} y={ground - 8} width={64} height={8} rx={3} fill="#A97F55" />
          <Rect x={w - 94} y={ground} width={5} height={14} fill="#A97F55" />
          <Rect x={w - 52} y={ground} width={5} height={14} fill="#A97F55" />
        </G>
      )}
      {setting === 'innen' && (
        <G>
          <Rect x={0} y={ground} width={w} height={h - ground} fill="#DCD5CC" />
          {[0, 1, 2].map((i) => (
            <Rect key={i} x={20 + i * 70} y={32} width={56} height={48} rx={4} fill="#fff" stroke="#E3D9CC" strokeWidth={3} />
          ))}
          <Rect x={w - 110} y={ground - 46} width={70} height={46} rx={4} fill="#C9B8A0" />
        </G>
      )}
    </G>
  );
}

/** Szene mit Betroffenem (liegt/sitzt/steht) und dir als Helfer/in */
export function Scene({
  setting,
  pose,
  width = 340,
  accent = colors.mintDark,
  seed = 'x',
  helfer = true,
}: {
  setting: Setting;
  pose: Pose;
  width?: number;
  accent?: string;
  seed?: string;
  helfer?: boolean;
}) {
  const w = 360;
  const h = 180;
  const ground = setting === 'strasse' ? 128 : 134;
  const k = hash(seed);
  const patient = { skin: SKIN[k % SKIN.length], hair: HAIR[(k >>> 3) % HAIR.length], shirt: SHIRT[(k >>> 6) % SHIRT.length] };
  const hx = w * 0.46;
  const px = pose === 'liegt' ? w * 0.34 : pose === 'sitzt' ? w * 0.4 : w * 0.38;
  return (
    <Svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`}>
      <Backdrop setting={setting} w={w} ground={ground} />
      <Ellipse
        cx={px + (pose === 'liegt' ? 10 : 0)}
        cy={ground + 2}
        rx={pose === 'liegt' ? 44 : 22}
        ry={4}
        fill="rgba(0,0,0,0.12)"
      />
      <Person x={px} ground={ground} pose={pose} {...patient} />
      {helfer && (
        <G>
          <Ellipse cx={hx + 30} cy={ground + 2} rx={20} ry={4} fill="rgba(0,0,0,0.12)" />
          <Person
            x={hx + 30}
            ground={ground}
            pose="steht"
            shirt={accent}
            skin={SKIN[(k >>> 9) % SKIN.length]}
            hair={HAIR[(k >>> 12) % HAIR.length]}
            flip
          />
        </G>
      )}
      <G transform={`translate(${px - 4} ${ground - (pose === 'liegt' ? 38 : 86)})`}>
        <Circle r={9} fill="#fff" stroke={colors.red} strokeWidth={2} />
        <Rect x={-1.4} y={-5} width={2.8} height={6.5} rx={1.4} fill={colors.red} />
        <Circle cy={5} r={1.7} fill={colors.red} />
      </G>
    </Svg>
  );
}
