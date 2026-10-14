import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fonts } from '../theme';

/** Meine Kollegin Kati – Sprechblase mit Tipps. */
export function Kati({ children }: { children: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>K</Text>
      </View>
      <View style={styles.bubble}>
        <Text style={styles.name}>Kati · Kollegin</Text>
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

export function AskKati({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ask, pressed && { opacity: 0.8 }]}>
      <View style={[styles.avatar, { width: 28, height: 28 }]}>
        <Text style={[styles.avatarText, { fontFamily: fonts.regular, fontSize: 13 }]}>K</Text>
      </View>
      <Text style={styles.askText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blaulicht,
    borderWidth: 2,
    borderColor: colors.graphit,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.weiss, fontFamily: fonts.extrabold, fontSize: 18 },
  bubble: {
    flex: 1,
    backgroundColor: colors.blaulichtLight,
    padding: spacing.md,
    borderTopLeftRadius: 0,
    borderRadius: 10,
  },
  name: { fontSize: 11, fontFamily: fonts.extrabold, color: colors.blaulichtDark, letterSpacing: 0.4, textTransform: 'uppercase' },
  text: { fontFamily: fonts.regular, fontSize: 15, color: colors.graphit, marginTop: 2, lineHeight: 21 },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.blaulicht,
    padding: spacing.sm,
    backgroundColor: colors.weiss,
  },
  askText: { color: colors.blaulichtDark, fontFamily: fonts.bold, flex: 1 },
});
