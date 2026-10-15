import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { Button, Card, Tap, TopBar } from '../components/UI';
import {
  BASIS,
  BONUS_KUERZESTE,
  KARTE,
  KartenPin,
  STRASSEN_X,
  STRASSEN_Y,
  istKuerzeste,
  punktAuf,
  richtungAuf,
} from '../game/karte';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const BLOCK_FARBEN = ['#FFFFFF', '#F6F1E4', '#EEF3F8', '#F8EDEE'];

/** Stadtkarte: Einsätze wählen und hinfahren */
export function KarteScreen({
  pins,
  angefahren,
  onFahre,
  onBack,
}: {
  pins: KartenPin[];
  angefahren: number;
  onFahre: (pin: KartenPin, kuerzeste: boolean) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [wahl, setWahl] = useState<string | null>(null);
  const [fahrt, setFahrt] = useState<{ pin: KartenPin; t: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const breite = Math.min(L.width - spacing.lg * 2, 640);
  const f = breite / KARTE.b;
  const hoehe = KARTE.h * f;
  const pin = pins.find((p) => p.id === wahl) ?? null;

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const losfahren = () => {
    if (!pin || fahrt) return;
    const start = Date.now();
    const dauer = Math.max(1800, pin.minuten * 650);
    setFahrt({ pin, t: 0 });
    timer.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dauer);
      setFahrt({ pin, t });
      if (t >= 1) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        onFahre(pin, istKuerzeste(pins, pin));
      }
    }, 40);
  };

  const route = (fahrt?.pin ?? pin)?.route;
  const pfad = route ? route.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x * f} ${p.y * f}`).join(' ') : '';
  const fz = fahrt ? punktAuf(fahrt.pin.route, fahrt.t) : null;
  const winkel = fahrt ? richtungAuf(fahrt.pin.route, fahrt.t) : 0;
  const zellen: { x: number; y: number; w: number; h: number; i: number }[] = [];
  const xs = [0, ...STRASSEN_X, KARTE.b];
  const ys = [0, ...STRASSEN_Y, KARTE.h];
  for (let a = 0; a < xs.length - 1; a++)
    for (let b = 0; b < ys.length - 1; b++) {
      const x0 = xs[a] + (a === 0 ? 0 : 9);
      const x1 = xs[a + 1] - (a === xs.length - 2 ? 0 : 9);
      const y0 = ys[b] + (b === 0 ? 0 : 9);
      const y1 = ys[b + 1] - (b === ys.length - 2 ? 0 : 9);
      zellen.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, i: a * 7 + b * 3 });
    }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Stadtkarte" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Text style={type.body}>
          {r.id === 'helfer'
            ? 'Hilferufe in der Stadt: Wohin fährst du zuerst?'
            : 'Neue Einsätze von der Leitstelle: Welchen fährst du zuerst an?'}{' '}
          Wer den Einsatz mit der kürzesten Anfahrt wählt, bekommt +{BONUS_KUERZESTE} Punkte.
        </Text>
        <View style={[styles.karte, { width: breite, height: hoehe }]}>
          <Svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`}>
            <Rect x={0} y={0} width={breite} height={hoehe} fill="#DCE7E2" />
            {zellen.map((z, k) => {
              const park = z.i === 7 * 2 + 3 * 1;
              return (
                <Rect
                  key={k}
                  x={z.x * f}
                  y={z.y * f}
                  width={z.w * f}
                  height={z.h * f}
                  rx={8 * f}
                  fill={park ? '#BFE3B8' : BLOCK_FARBEN[(z.i + k) % BLOCK_FARBEN.length]}
                />
              );
            })}
            {STRASSEN_X.map((x) => (
              <Line key={'x' + x} x1={x * f} y1={0} x2={x * f} y2={hoehe} stroke="#B7C2BE" strokeWidth={14 * f} />
            ))}
            {STRASSEN_Y.map((y) => (
              <Line key={'y' + y} x1={0} y1={y * f} x2={breite} y2={y * f} stroke="#B7C2BE" strokeWidth={14 * f} />
            ))}
            {STRASSEN_X.map((x) => (
              <Line
                key={'xd' + x}
                x1={x * f}
                y1={0}
                x2={x * f}
                y2={hoehe}
                stroke="#F6F8F7"
                strokeWidth={1.5}
                strokeDasharray="8 8"
              />
            ))}
            {STRASSEN_Y.map((y) => (
              <Line
                key={'yd' + y}
                x1={0}
                y1={y * f}
                x2={breite}
                y2={y * f}
                stroke="#F6F8F7"
                strokeWidth={1.5}
                strokeDasharray="8 8"
              />
            ))}
            {!!pfad && (
              <Path d={pfad} stroke={r.akzent} strokeWidth={5} strokeDasharray="2 9" strokeLinecap="round" fill="none" />
            )}
            <Circle cx={BASIS.x * f} cy={BASIS.y * f} r={20 * f} fill="#fff" stroke={r.akzent} strokeWidth={3} />
          </Svg>
          <Text pointerEvents="none" style={[styles.emoji, { left: BASIS.x * f - 14, top: BASIS.y * f - 17 }]}>
            {r.id === 'helfer' ? '💚' : '🏥'}
          </Text>
          {pins.map((p) => {
            const aktiv = p.id === wahl;
            const weg = fahrt?.pin.id === p.id;
            return (
              <Tap
                key={p.id}
                offset={0}
                disabled={!!fahrt}
                onPress={() => setWahl(p.id)}
                accessibilityLabel={`Einsatz ${p.ort}`}
                style={[
                  styles.pin,
                  { left: p.x * f - 19, top: p.y * f - 38 },
                  aktiv && { backgroundColor: colors.redDark, transform: [{ scale: 1.2 }], borderColor: colors.yellow },
                  weg && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.pinText}>!</Text>
                <Text style={styles.pinMin}>{p.minuten} min</Text>
              </Tap>
            );
          })}
          {fz && (
            <Text
              pointerEvents="none"
              style={[
                styles.emoji,
                styles.fahrzeug,
                { left: fz.x * f - 16, top: fz.y * f - 18, transform: [{ scaleX: Math.abs(winkel) > 90 ? -1 : 1 }] },
              ]}
            >
              {r.id === 'helfer' ? '🚗' : '🚑'}
            </Text>
          )}
        </View>
        {fahrt ? (
          <Card style={{ gap: 4, borderLeftColor: colors.red }}>
            <Text style={type.headline}>🚨 Anfahrt läuft …</Text>
            <Text style={type.body}>{fahrt.pin.ort}</Text>
          </Card>
        ) : (
          pins.map((p) => (
            <Tap
              key={p.id}
              onPress={() => setWahl(p.id)}
              accessibilityLabel={p.ort}
              style={[styles.zeile, p.id === wahl && { borderColor: r.akzent, backgroundColor: r.akzentTint }]}
            >
              <View style={styles.zeit}>
                <Text style={styles.zeitZahl}>{p.minuten}</Text>
                <Text style={styles.zeitEinheit}>min</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.headline, { fontSize: 15 }]} numberOfLines={2}>
                  {p.ort}
                </Text>
                <Text style={type.small} numberOfLines={3}>
                  {p.meldung || 'Hilferuf: Jemand braucht Erste Hilfe.'}
                </Text>
              </View>
            </Tap>
          ))
        )}
        {!fahrt && (
          <Button
            label={pin ? `Losfahren – ${pin.minuten} min` : 'Einsatz auf der Karte wählen'}
            variant="alarm"
            disabled={!pin}
            onPress={losfahren}
          />
        )}
        <Text style={[type.small, { textAlign: 'center' }]}>
          Bisher angefahren: {angefahren} {angefahren === 1 ? 'Einsatz' : 'Einsätze'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  karte: { alignSelf: 'center', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  emoji: { position: 'absolute', fontSize: 24, lineHeight: 30, fontFamily: fonts.regular },
  fahrzeug: { fontSize: 28, lineHeight: 34 },
  pin: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.red,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: { fontFamily: fonts.extrabold, fontSize: 18, color: '#fff', lineHeight: 22 },
  pinMin: {
    position: 'absolute',
    top: 40,
    width: 54,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 10.5,
    color: colors.ink,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  zeile: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  zeit: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.redTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeitZahl: { fontFamily: fonts.displayBlack, fontSize: 22, lineHeight: 24, color: colors.redDark },
  zeitEinheit: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.redDark },
});
