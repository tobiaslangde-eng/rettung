import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme';

/**
 * EKG-Millimeterpapier als Hintergrund: feines Raster alle 8 px, kräftige Linie alle 40 px –
 * wie der rosa Papierstreifen, auf dem ein Herzschlag ausgedruckt wird.
 */
function PaperGrid() {
  return (
    <View style={styles.fill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="paperMinor" width={8} height={8} patternUnits="userSpaceOnUse">
            <Path d="M8 0 H0 V8" stroke={colors.paperLine} strokeWidth={1} fill="none" />
          </Pattern>
          <Pattern id="paperMajor" width={40} height={40} patternUnits="userSpaceOnUse">
            <Rect width={40} height={40} fill="url(#paperMinor)" />
            <Path d="M40 0 H0 V40" stroke={colors.paperLineStrong} strokeWidth={1.5} fill="none" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#paperMajor)" />
      </Svg>
    </View>
  );
}

export const PaperBackground = memo(PaperGrid);

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.paper, pointerEvents: 'none' },
});
