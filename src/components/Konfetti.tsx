import { useEffect, useMemo } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const FARBEN = ['#FFC531', '#2BE38B', '#5B8DF5', '#FF7EB6', '#FF9A4A', '#A99BFF'];

/** Kurzer Konfettiregen für gute Ergebnisse (läuft einmal und lässt Eingaben durch) */
export function Konfetti({ anzahl = 34 }: { anzahl?: number }) {
  const breite = Dimensions.get('window').width;
  const hoehe = Dimensions.get('window').height;
  const teile = useMemo(
    () =>
      Array.from({ length: anzahl }, (_, i) => ({
        x: Math.random() * breite,
        groesse: 6 + Math.random() * 7,
        farbe: FARBEN[i % FARBEN.length],
        dauer: 1700 + Math.random() * 1500,
        verzoegerung: Math.random() * 500,
        drift: (Math.random() - 0.5) * 120,
        dreh: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        rund: Math.random() > 0.6,
        fall: new Animated.Value(0),
      })),
    [anzahl, breite],
  );
  useEffect(() => {
    teile.forEach((t) =>
      Animated.timing(t.fall, {
        toValue: 1,
        duration: t.dauer,
        delay: t.verzoegerung,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(),
    );
  }, [teile]);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {teile.map((t, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: t.x,
            top: -20,
            width: t.groesse,
            height: t.rund ? t.groesse : t.groesse * 1.6,
            borderRadius: t.rund ? t.groesse / 2 : 2,
            backgroundColor: t.farbe,
            opacity: t.fall.interpolate({ inputRange: [0, 0.08, 0.85, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateY: t.fall.interpolate({ inputRange: [0, 1], outputRange: [0, hoehe * 0.75] }) },
              { translateX: t.fall.interpolate({ inputRange: [0, 1], outputRange: [0, t.drift] }) },
              { rotate: t.fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${t.dreh}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}
