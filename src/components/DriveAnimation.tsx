import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, spacing } from '../theme';
import { Ornament } from './Estonian';

const useNativeDriver = Platform.OS !== 'web';

/** Kurze Blaulichtfahrt zwischen Alarm und Eintreffen. */
export function DriveAnimation({ location, onDone }: { location: string; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drive = Animated.timing(x, {
      toValue: 1,
      duration: 2400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver,
    });
    const lights = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 180, useNativeDriver }),
        Animated.timing(blink, { toValue: 0, duration: 180, useNativeDriver }),
      ]),
    );
    lights.start();
    drive.start(({ finished }) => finished && onDone());
    return () => {
      drive.stop();
      lights.stop();
    };
  }, [x, blink, onDone]);

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-120, Math.min(width, 520) + 20] });
  const blue = blink;
  const red = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Pressable style={styles.root} onPress={onDone} accessibilityLabel="Fahrt überspringen">
      <Text style={styles.et}>SÕIDAME!</Text>
      <Text style={styles.title}>Ich fahre mit Blaulicht los …</Text>
      <Text style={styles.loc}>📍 {location}</Text>

      <View style={styles.road}>
        <Animated.View style={[styles.car, { transform: [{ translateX }] }]}>
          <View style={styles.lights}>
            <Animated.View style={[styles.light, { backgroundColor: colors.sinine, opacity: blue }]} />
            <Animated.View style={[styles.light, { backgroundColor: colors.kihnuRed, opacity: red }]} />
          </View>
          <Text style={styles.ambulance}>🚑</Text>
          <Text style={styles.siren}>tatü-tata!</Text>
        </Animated.View>
        <View style={styles.lane} />
      </View>

      <Ornament count={12} color={colors.sinine} accent={colors.valge} />
      <Text style={styles.skip}>Tippen zum Überspringen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.must, justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  et: { color: colors.sinine, fontWeight: '900', letterSpacing: 4, fontSize: 14 },
  title: { color: colors.valge, fontSize: 24, fontWeight: '800' },
  loc: { color: colors.greyLight, fontSize: 14 },
  road: { height: 120, justifyContent: 'flex-end', overflow: 'hidden', marginHorizontal: -spacing.xl },
  car: { position: 'absolute', bottom: 18, alignItems: 'center' },
  lights: { flexDirection: 'row', gap: 4, marginBottom: -4 },
  light: { width: 14, height: 8, borderRadius: 4 },
  ambulance: { fontSize: 56, transform: [{ scaleX: -1 }] },
  siren: { color: colors.sinineLight, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  lane: { height: 4, backgroundColor: colors.grey, marginBottom: 10 },
  skip: { color: colors.grey, fontSize: 12, textAlign: 'center', marginTop: spacing.lg },
});
