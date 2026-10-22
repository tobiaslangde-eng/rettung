import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';
import { EkgId, PAPIER, ekgKurve, ekgPfad } from '../game/ekg';

/** Ein EKG-Streifen auf Millimeterpapier (6 Sekunden, Ableitung II, 25 mm/s) – bleibt auch im dunklen Modus hell, wie ein Ausdruck */
export function EkgStreifen({ id, seed, label = true }: { id: EkgId; seed: number; label?: boolean }) {
  const pfad = useMemo(() => ekgPfad(ekgKurve(id, seed)), [id, seed]);
  const { breite, hoehe } = PAPIER;
  return (
    <View
      style={{ width: '100%', aspectRatio: breite / hoehe, borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFF7F7' }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${breite} ${hoehe}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id="ekg-klein" width={4} height={4} patternUnits="userSpaceOnUse">
            <Path d="M4 0 H0 V4" stroke="#F2C6C6" strokeWidth={0.5} fill="none" />
          </Pattern>
          <Pattern id="ekg-gross" width={20} height={20} patternUnits="userSpaceOnUse">
            <Path d="M20 0 H0 V20" stroke="#E39A9A" strokeWidth={0.9} fill="none" />
          </Pattern>
        </Defs>
        <Rect width={breite} height={hoehe} fill="url(#ekg-klein)" />
        <Rect width={breite} height={hoehe} fill="url(#ekg-gross)" />
        <Path d={pfad} fill="none" stroke="#14181C" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
        {label && (
          <>
            <SvgText x={8} y={18} fontSize={12} fontWeight="700" fill="#8A4B4B">
              II
            </SvgText>
            <SvgText x={breite - 8} y={hoehe - 8} fontSize={10} fill="#8A4B4B" textAnchor="end">
              25 mm/s · 1 großes Kästchen = 0,2 s
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}
