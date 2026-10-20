import { StyleSheet, Text, View } from 'react-native';
import { WissensEintrag } from '../game/wissen';
import { useRolle } from '../game/rolle';
import { colors, fonts, spacing, type } from '../theme';
import { Card } from './UI';

/** Eine Antwort aus dem Wissensschatz der App: Titel, Punkte, Merksatz und Quelle */
export function WissensKarte({ eintrag, maxPunkte = 6 }: { eintrag: WissensEintrag; maxPunkte?: number }) {
  const r = useRolle();
  return (
    <Card style={{ gap: spacing.sm }}>
      <View style={styles.kopf}>
        <Text style={styles.icon}>{eintrag.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={type.headline}>{eintrag.titel}</Text>
          <Text style={[styles.quelle, { color: r.akzentDunkel, backgroundColor: r.akzentTint }]}>{eintrag.quelle}</Text>
        </View>
      </View>
      <View style={{ gap: 4 }}>
        {eintrag.punkte.slice(0, maxPunkte).map((p, i) => (
          <Text key={i} style={type.body}>
            {/^\d+\./.test(p) ? p : `• ${p}`}
          </Text>
        ))}
        {eintrag.punkte.length > maxPunkte && (
          <Text style={type.small}>… und {eintrag.punkte.length - maxPunkte} weitere Punkte im Lexikon.</Text>
        )}
      </View>
      {eintrag.alarm ? (
        <View style={[styles.alarm, { backgroundColor: colors.redTint, borderColor: colors.red }]}>
          <Text style={[type.body, { fontFamily: fonts.semibold, color: colors.redDark }]}>🚨 {eintrag.alarm}</Text>
        </View>
      ) : null}
      {eintrag.merke ? (
        <Text style={[type.body, { fontFamily: fonts.semibold, color: r.akzentDunkel }]}>Merke: {eintrag.merke}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  alarm: { borderRadius: 12, borderWidth: 1, padding: spacing.sm },
  kopf: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: { fontSize: 28, fontFamily: fonts.regular },
  quelle: {
    alignSelf: 'flex-start',
    marginTop: 4,
    fontFamily: fonts.semibold,
    fontSize: 11.5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 2,
    overflow: 'hidden',
    color: colors.ink,
  },
});
