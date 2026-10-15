import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLayout } from '../layout';
import { colors, fonts, hardShadow, spacing, type } from '../theme';
import { Ambulance } from './Ambulance';
import { CityScene } from './Ems';

const useNativeDriver = Platform.OS !== 'web';
const SCENE_HEIGHT = 260;

/** Kurze Blaulichtfahrt durch die Stadt bei Nacht zwischen Alarm und Eintreffen. */
export function DriveAnimation({ location, rtwLevel = 1, onDone }: { location: string; rtwLevel?: number; onDone: () => void }) {
  const { width } = useLayout();
  const x = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;
  const [lightOn, setLightOn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setLightOn((b) => !b), 170);
    return () => clearInterval(t);
  }, []);

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

  const sceneWidth = Math.min(width, 760) - spacing.lg * 2;
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-150, sceneWidth + 20] });
  const glow = blink.interpolate({ inputRange: [0, 1], outputRange: [0, 0.16] });

  return (
    <Pressable style={styles.root} onPress={onDone} accessibilityLabel="Fahrt überspringen">
      <View style={styles.text}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Einsatzfahrt</Text>
        </View>
        <Text style={styles.title}>Ich fahre mit Blaulicht los …</Text>
        <Text style={type.eyebrow}>📍 {location}</Text>
      </View>

      <View style={[styles.scene, { width: sceneWidth }]}>
        <CityScene height={SCENE_HEIGHT} />
        {/* Das Blaulicht färbt die Szene */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.glow, { opacity: glow }]} />
        <Animated.View style={[styles.car, { transform: [{ translateX }] }]}>
          {/* Mein eigener Rettungswagen aus der Fahrzeughalle */}
          <Ambulance level={rtwLevel} width={140} blink={lightOn} />
        </Animated.View>
      </View>
      <Text style={styles.skip}>Tippen zum Überspringen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
  text: { alignSelf: 'stretch', paddingBottom: spacing.xl, gap: spacing.sm, maxWidth: 760 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.red,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  tagText: { color: colors.white, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 36, fontFamily: fonts.displayBlack, lineHeight: 38, letterSpacing: -1.2 },
  scene: {
    height: SCENE_HEIGHT,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    ...hardShadow(6),
  },
  glow: { backgroundColor: colors.blue, pointerEvents: 'none' },
  car: { position: 'absolute', bottom: 18, alignItems: 'center' },
  skip: {
    fontFamily: fonts.mono,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xl,
    letterSpacing: 1,
  },
});
