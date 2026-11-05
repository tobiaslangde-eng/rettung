import { StyleSheet, Text, View } from 'react-native';
import { Antwort, FRAGEN, FrageId } from '../game/patient';
import { colors, fonts, spacing, type } from '../theme';
import { Card, Eyebrow, Tap } from './UI';

/** „Patient fragen“: Fragen antippen, der Patient (oder ein Angehöriger) antwortet – je nach Zustand stockend oder gar nicht */
export function PatientFragen({
  antworten,
  moeglich,
  gesperrt,
  hinweis,
  onFrage,
}: {
  antworten: Antwort[];
  /** Kann der Patient noch antworten? */
  moeglich: boolean;
  /** z. B. solange ein Zwischenfall läuft */
  gesperrt?: boolean;
  /** Zusatzzeile unter der Überschrift */
  hinweis?: string;
  onFrage: (f: FrageId) => void;
}) {
  const gefragt = new Set(antworten.map((a) => a.frage));
  return (
    <Card style={{ gap: spacing.sm }}>
      <Eyebrow title="Patient fragen" />
      <Text style={type.small}>
        Jede Frage kostet 1 Minute und etwas Kraft. {hinweis ?? 'Wichtige Antworten bringen Bonus-EP.'}
      </Text>
      <View style={styles.chips}>
        {FRAGEN.map((f) => {
          const schon = gefragt.has(f.id);
          return (
            <Tap
              key={f.id}
              onPress={() => onFrage(f.id)}
              disabled={schon || !moeglich || gesperrt}
              offset={2}
              accessibilityLabel={`Frage: ${f.label}`}
              style={[styles.chip, schon && styles.chipDone, (!moeglich || gesperrt) && !schon && { opacity: 0.45 }]}
            >
              <Text style={[styles.chipText, schon && { color: colors.mintDark }]}>{f.label}</Text>
            </Tap>
          );
        })}
      </View>
      {!moeglich && (
        <Text style={[type.small, { color: colors.redDark, fontFamily: fonts.bold }]}>
          Der Patient reagiert nicht mehr – jetzt zählen Atemweg, Kreislauf und Notarzt.
        </Text>
      )}
      {antworten.map((a, i) => (
        <View key={`${a.frage}-${i}`} style={{ gap: 4 }}>
          <View style={styles.du}>
            <Text style={styles.duText}>{FRAGEN.find((f) => f.id === a.frage)!.label}</Text>
          </View>
          <View style={[styles.pat, a.wichtig && styles.patWichtig]}>
            <Text style={styles.sprecher}>{a.sprecher}</Text>
            <Text style={styles.patText}>
              {a.text.startsWith('„') ? a.text : `„${a.text}“`}
            </Text>
          </View>
          {(!!a.meta || a.wichtig) && (
            <Text style={styles.meta}>
              {a.wichtig ? '💡 wichtige Antwort' : ''}
              {a.wichtig && a.meta ? ' · ' : ''}
              {a.meta}
            </Text>
          )}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.mintDark,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipDone: { backgroundColor: colors.mintTint, borderColor: colors.mintTint },
  chipText: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.mintDark },
  du: {
    alignSelf: 'flex-end',
    backgroundColor: colors.mintDark,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '80%',
  },
  duText: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.white },
  pat: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '94%',
    gap: 2,
  },
  patWichtig: { borderColor: colors.yellow, backgroundColor: colors.yellowTint },
  sprecher: { ...type.eyebrow, fontSize: 10 },
  patText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.ink },
  meta: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted, marginLeft: 4 },
});
