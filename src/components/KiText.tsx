import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../theme';

/** Zeigt eine KI-Antwort: Zeilen mit „• “ als Aufzählung, **fett** für Schlüsselwörter */
export function KiText({ text }: { text: string }) {
  const zeilen = text.split('\n').filter((z) => z.trim().length > 0);
  return (
    <View style={{ gap: 6 }}>
      {zeilen.map((z, i) => {
        const punkt = /^\s*[•\-*]\s+/.test(z);
        const inhalt = punkt ? z.replace(/^\s*[•\-*]\s+/, '') : z;
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            {punkt && <Text style={[type.body, { width: 10 }]}>•</Text>}
            <Text style={[type.body, { flex: 1 }]}>
              {inhalt.split('**').map((teil, k) => (
                <Text key={k} style={k % 2 === 1 ? styles.fett : undefined}>
                  {teil}
                </Text>
              ))}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({ fett: { fontFamily: fonts.bold, color: colors.ink } });
