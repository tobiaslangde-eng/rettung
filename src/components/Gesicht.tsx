import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

export const HAUTTOENE = ['#F6D2B4', '#EBBB92', '#D49A70', '#B07650', '#8B5A3C'];
export const HAARFARBEN = ['#2B2118', '#5A3A22', '#8C5A2B', '#D2A35C', '#1B1B1B', '#7A3B1D'];
const HEMDEN = ['#6C8EF5', '#F59E6C', '#B58CE0', '#4FC3A1', '#F2C94C', '#E57373', '#5BB8D4'];
const KONTUR = '#0F2A2E';

export const hashWert = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Porträt eines Patienten: Alter, Geschlecht und Aussehen ergeben sich aus Alter, Geschlecht und einer Kennung */
export function PatientGesicht({ age, sex, seed, size = 56 }: { age: number; sex: 'm' | 'w'; seed: string; size?: number }) {
  const k = hashWert(seed);
  const haut = HAUTTOENE[k % HAUTTOENE.length];
  const baby = age <= 1;
  const kind = age > 1 && age <= 12;
  const alt = age >= 65;
  const haarFarbe = alt ? '#CFCFD2' : HAARFARBEN[(k >>> 3) % HAARFARBEN.length];
  const hemd = HEMDEN[(k >>> 6) % HEMDEN.length];
  const stil = sex === 'w' ? (['lang', 'dutt', 'halblang'] as const)[(k >>> 9) % 3] : (['kurz', 'seite', 'kurz'] as const)[(k >>> 9) % 3];
  const brille = alt && (k >>> 12) % 2 === 0;
  // Kopfform: Kinder runder und kleiner, Babys groß
  const rx = baby ? 13.5 : kind ? 12.2 : 11.4;
  const ry = baby ? 13.5 : kind ? 12.8 : 13;
  const cy = baby ? 31 : 29.5;
  const augeY = cy + 1.6;
  const augeAbstand = baby ? 5.2 : kind ? 4.9 : 4.6;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 56 56">
        <Defs>
          <ClipPath id={`gz${k}`}>
            <Circle cx={28} cy={28} r={26} />
          </ClipPath>
        </Defs>
        <Circle cx={28} cy={28} r={26} fill="#D8E8FA" />
        <G clipPath={`url(#gz${k})`}>
          {/* Haare hinten */}
          {!baby && (stil === 'lang' || stil === 'halblang') && (
            <Path
              d={`M${28 - rx - 1.5} ${cy} C${28 - rx - 2.5} ${cy - 16} ${28 + rx + 2.5} ${cy - 16} ${28 + rx + 1.5} ${cy} L${28 + rx + 2} ${stil === 'lang' ? 52 : 42} L${28 - rx - 2} ${stil === 'lang' ? 52 : 42} Z`}
              fill={haarFarbe}
            />
          )}
          {/* Schultern */}
          <Path d="M3 58 C3 47 12 44 28 44 C44 44 53 47 53 58 Z" fill={hemd} />
          <Path d="M22 44 L28 50 L34 44 Z" fill={haut} />
          {/* Hals */}
          <Rect x={23.5} y={cy + 8} width={9} height={9} rx={3} fill={haut} />
          <Rect x={23.5} y={cy + 8} width={9} height={3} fill="rgba(0,0,0,0.08)" />
          {/* Ohren */}
          <Circle cx={28 - rx} cy={cy + 1.5} r={2.4} fill={haut} />
          <Circle cx={28 + rx} cy={cy + 1.5} r={2.4} fill={haut} />
          {/* Kopf */}
          <Ellipse cx={28} cy={cy} rx={rx} ry={ry} fill={haut} />
          {/* Haare vorn */}
          {baby ? (
            <Path d={`M24 ${cy - ry + 1.5} Q28 ${cy - ry - 3} 32 ${cy - ry + 1.5} Q28 ${cy - ry + 2} 24 ${cy - ry + 1.5} Z`} fill={haarFarbe} />
          ) : stil === 'seite' ? (
            <Path d={`M${28 - rx} ${cy - 2} C${28 - rx} ${cy - ry - 3} ${28 + rx} ${cy - ry - 3} ${28 + rx} ${cy - 2} C${28 + rx - 3} ${cy - 7} ${28 - 2} ${cy - 9} ${28 - 6} ${cy - 10} C${28 - 8} ${cy - 8} ${28 - rx + 1} ${cy - 5} ${28 - rx} ${cy - 2} Z`} fill={haarFarbe} />
          ) : (
            <Path d={`M${28 - rx} ${cy - 1} C${28 - rx} ${cy - ry - 3} ${28 + rx} ${cy - ry - 3} ${28 + rx} ${cy - 1} C${28 + rx - 2} ${cy - 7} ${28 + 3} ${cy - 9.5} ${28} ${cy - 9} C${28 - 3} ${cy - 9.5} ${28 - rx + 2} ${cy - 7} ${28 - rx} ${cy - 1} Z`} fill={haarFarbe} />
          )}
          {!baby && stil === 'dutt' && <Circle cx={28} cy={cy - ry - 3} r={4.6} fill={haarFarbe} />}
          {/* Augenbrauen */}
          <Path d={`M${28 - augeAbstand - 2.4} ${augeY - 3.6} Q${28 - augeAbstand} ${augeY - 4.8} ${28 - augeAbstand + 2.4} ${augeY - 3.7}`} stroke={alt ? '#9A9A9E' : haarFarbe} strokeWidth={1.2} strokeLinecap="round" fill="none" />
          <Path d={`M${28 + augeAbstand - 2.4} ${augeY - 3.7} Q${28 + augeAbstand} ${augeY - 4.8} ${28 + augeAbstand + 2.4} ${augeY - 3.6}`} stroke={alt ? '#9A9A9E' : haarFarbe} strokeWidth={1.2} strokeLinecap="round" fill="none" />
          {/* Augen */}
          {[-1, 1].map((d) => (
            <G key={d}>
              <Ellipse cx={28 + d * augeAbstand} cy={augeY} rx={baby || kind ? 2.2 : 1.9} ry={baby || kind ? 2.4 : 2.1} fill="#FFFFFF" />
              <Circle cx={28 + d * augeAbstand} cy={augeY + 0.2} r={baby || kind ? 1.5 : 1.3} fill="#3A2A22" />
              <Circle cx={28 + d * augeAbstand + 0.5} cy={augeY - 0.4} r={0.45} fill="#FFFFFF" />
            </G>
          ))}
          {brille && (
            <G stroke={KONTUR} strokeWidth={0.9} fill="none">
              <Circle cx={28 - augeAbstand} cy={augeY} r={3.9} />
              <Circle cx={28 + augeAbstand} cy={augeY} r={3.9} />
              <Path d={`M${28 - augeAbstand + 3.9} ${augeY} L${28 + augeAbstand - 3.9} ${augeY}`} />
            </G>
          )}
          {/* Nase und Mund */}
          <Path d={`M28 ${augeY + 2.6} Q29.8 ${augeY + 5.2} 27.6 ${augeY + 5.6}`} stroke="rgba(120,70,40,0.55)" strokeWidth={0.9} strokeLinecap="round" fill="none" />
          <Path d={`M${25} ${augeY + 8.4} Q28 ${augeY + 10.4} ${31} ${augeY + 8.4}`} stroke="#9A4B3C" strokeWidth={1.2} strokeLinecap="round" fill="none" />
          {/* Wangen */}
          <Circle cx={28 - 7.6} cy={augeY + 5.8} r={2.2} fill="#FF8FA0" opacity={0.28} />
          <Circle cx={28 + 7.6} cy={augeY + 5.8} r={2.2} fill="#FF8FA0" opacity={0.28} />
          {/* Falten bei älteren Menschen */}
          {alt && (
            <G stroke="rgba(120,70,40,0.45)" strokeWidth={0.7} strokeLinecap="round" fill="none">
              <Path d={`M${28 - rx + 2} ${augeY - 0.5} l1.8 0.6 M${28 + rx - 2} ${augeY - 0.5} l-1.8 0.6`} />
              <Path d={`M${28 - 5.5} ${augeY + 7.2} q-1 1.2 0 2.4 M${28 + 5.5} ${augeY + 7.2} q1 1.2 0 2.4`} />
            </G>
          )}
        </G>
        <Circle cx={28} cy={28} r={26} fill="none" stroke={KONTUR} strokeWidth={1.6} />
      </Svg>
    </View>
  );
}
