import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { setzeTon, spracheMoeglich, tonAn } from '../game/sprache';
import { colors, fonts } from '../theme';
import { Tap } from './UI';

/** Kleiner Schalter „Ton an/aus“ für die Sprachausgabe (nur Web) */
export function TonKnopf() {
  const [an, setAn] = useState(tonAn());
  if (!spracheMoeglich()) return null;
  return (
    <Tap
      onPress={() => {
        setzeTon(!an);
        setAn(!an);
      }}
      accessibilityLabel={an ? 'Ton ausschalten' : 'Ton einschalten'}
      style={[styles.box, an && { backgroundColor: colors.mintTint, borderColor: colors.mintDark }]}
    >
      <Text style={styles.text}>{an ? '🔊 Ton an' : '🔈 Ton aus'}</Text>
    </Tap>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
