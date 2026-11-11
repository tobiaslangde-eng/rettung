import { StyleSheet, Text, View } from 'react-native';
import { aktivesKonto, istPlus, testRestTage, useKontoStore } from '../game/konto';
import { colors, fonts, spacing, type } from '../theme';
import { Tile } from './Bento';

/** Nur in der Vorschau: Einstieg in die Store-Demo (Konto und Plus) */
export function KontoKachel({ onPress }: { onPress: () => void }) {
  const s = useKontoStore();
  const konto = aktivesKonto(s);
  const plus = istPlus(s);
  const rest = testRestTage(s);
  const status = konto ? `Angemeldet als ${konto.name}` : 'Nicht angemeldet';
  const plusText = plus ? (rest !== null ? `Plus-Test: noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'}` : 'Plus aktiv') : 'Kostenlose Version';
  return (
    <Tile size="md" tint="blue" onPress={onPress} accessibilityLabel="Store-Demo: Konto und Plus öffnen">
      <View style={styles.zeile}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type.eyebrow, { color: colors.blueDark }]}>🧪 Store-Demo</Text>
          <Text style={type.headline}>Konto und Plus ausprobieren</Text>
          <Text style={type.small}>
            {status} · {plusText}
          </Text>
        </View>
        <Text style={styles.pfeil}>›</Text>
      </View>
    </Tile>
  );
}

const styles = StyleSheet.create({
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pfeil: { fontFamily: fonts.bold, fontSize: 28, color: colors.inkSoft },
});
