import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import { CityScene, WarnStripes } from './Ems';

const useNativeDriver = Platform.OS !== 'web';
const SCENE_HEIGHT = 260;

/** Kurze Blaulichtfahrt durch die Stadt bei Nacht zwischen Alarm und Eintreffen. */
export function DriveAnimation({ location, onDone }: { location: string; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drive = Animated.timing(x, {
      toValue: 1,
      duration: 2600,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver,
    });
    const lights = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 170, useNativeDriver }),
        Animated.timing(blink, { toValue: 0, duration: 170, useNativeDriver }),
      ]),
    );
    lights.start();
    drive.start(({ finished }) => finished && onDone());
    return () => {
      drive.stop();
      lights.stop();
    };
  }, [x, blink, onDone]);

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-110, Math.min(width, 480) + 20] });
  const red = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const glow = blink.interpolate({ inputRange: [0, 1], outputRange: [0, 0.16] });

  return (
    <Pressable style={styles.root} onPress={onDone} accessibilityLabel="Fahrt überspringen">
      <View style={styles.text}>
        <Text style={styles.et}>Sõidame!</Text>
        <Text style={styles.title}>Ich fahre mit Blaulicht los …</Text>
        <Text style={styles.loc}>{location}</Text>
      </View>

      <View style={styles.scene}>
        <CityScene height={SCENE_HEIGHT} />
        {/* Das Blaulicht färbt die Szene */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.glow, { opacity: glow }]} pointerEvents="none" />
        <Animated.View style={[styles.car, { transform: [{ translateX }] }]}>
          <View style={styles.lights}>
            <Animated.View style={[styles.light, { backgroundColor: colors.blaulicht, opacity: blink }]} />
            <Animated.View style={[styles.light, { backgroundColor: colors.signalrot, opacity: red }]} />
          </View>
          <Text style={styles.ambulance}>🚑</Text>
        </Animated.View>
      </View>
      <WarnStripes height={14} />
      <Text style={styles.skip}>Tippen zum Überspringen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.nacht, justifyContent: 'center' },
  text: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.xs },
  et: { color: colors.signalrot, fontFamily: fonts.extrabold, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase' },
  title: { color: colors.weiss, fontSize: 34, fontFamily: fonts.displayBlack, lineHeight: 36, textTransform: 'uppercase' },
  loc: { fontFamily: fonts.italic, color: colors.grau300, fontSize: 14 },
  scene: { height: SCENE_HEIGHT, overflow: 'hidden' },
  glow: { backgroundColor: colors.blaulicht },
  car: { position: 'absolute', bottom: 18, alignItems: 'center' },
  lights: { flexDirection: 'row', gap: 4, marginBottom: -6 },
  light: { width: 14, height: 7, borderRadius: 4 },
  ambulance: { fontFamily: fonts.regular, fontSize: 52, transform: [{ scaleX: -1 }] },
  skip: { fontFamily: fonts.semibold, color: colors.grau500, fontSize: 12, textAlign: 'center', marginTop: spacing.lg, letterSpacing: 1 },
});
