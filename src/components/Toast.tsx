import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

/** Kurze Meldung oben im Bild (verschwindet von selbst) */
export function Toast({ text }: { text: string }) {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.box}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center', zIndex: 100, paddingHorizontal: 16 },
  box: {
    backgroundColor: colors.navy,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  text: { fontFamily: fonts.bold, fontSize: 15, color: colors.onDark, textAlign: 'center' },
});
