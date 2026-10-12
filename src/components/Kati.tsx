import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

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
        <Text style={[styles.avatarText, { fontSize: 13 }]}>K</Text>
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
    backgroundColor: colors.sinine,
    borderWidth: 2,
    borderColor: colors.must,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.valge, fontWeight: '900', fontSize: 18 },
  bubble: {
    flex: 1,
    backgroundColor: colors.sinineLight,
    padding: spacing.md,
    borderTopLeftRadius: 0,
    borderRadius: 10,
  },
  name: { fontSize: 11, fontWeight: '800', color: colors.sinineDark, letterSpacing: 1, textTransform: 'uppercase' },
  text: { fontSize: 15, color: colors.must, marginTop: 2, lineHeight: 21 },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.sinine,
    padding: spacing.sm,
    backgroundColor: colors.valge,
  },
  askText: { color: colors.sinineDark, fontWeight: '700', flex: 1 },
});
