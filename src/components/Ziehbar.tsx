import { ReactNode, useRef } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';

/** Ziehbarer Gegenstand: beim Loslassen meldet `onDrop` die Mitte (in Pixeln der Fläche); true = bleibt liegen, false = springt zurück */
export function Ziehbar({
  x,
  y,
  w,
  h,
  aktiv,
  onDrop,
  onZiehen,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  aktiv: boolean;
  onDrop: (cx: number, cy: number) => boolean;
  onZiehen?: (zieht: boolean) => void;
  children: ReactNode;
}) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const aktivRef = useRef(aktiv);
  aktivRef.current = aktiv;
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;
  const ziehRef = useRef(onZiehen);
  ziehRef.current = onZiehen;
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => aktivRef.current,
      onMoveShouldSetPanResponder: () => aktivRef.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pos.setOffset({ x: 0, y: 0 });
        ziehRef.current?.(true);
      },
      onPanResponderMove: (_, g) => pos.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_, g) => {
        ziehRef.current?.(false);
        const ok = dropRef.current(x + w / 2 + g.dx, y + h / 2 + g.dy);
        if (ok) pos.setValue({ x: 0, y: 0 });
        else Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start();
      },
      onPanResponderTerminate: () => {
        ziehRef.current?.(false);
        Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;
  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        styles.box,
        { left: x, top: y, width: w, height: h, transform: pos.getTranslateTransform() },
        aktiv && styles.aktiv,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  aktiv: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
});
