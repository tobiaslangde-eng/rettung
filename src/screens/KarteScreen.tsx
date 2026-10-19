import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { Button, Card, Tap, TopBar } from '../components/UI';
import {
  BASIS,
  BONUS_KUERZESTE,
  BONUS_ROUTE,
  Fahrt,
  KARTE,
  KartenPin,
  STRASSEN_X,
  STRASSEN_Y,
  istKuerzeste,
  neuerVerkehr,
  punktAuf,
  richtungAuf,
  routenWahl,
} from '../game/karte';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const BLOCK_FARBEN = ['#FFFFFF', '#F6F1E4', '#EEF3F8', '#F8EDEE'];

/** Besondere Orte: Spalte a, Zeile b im Straßenraster */
const ORTE = [
  { a: 0, b: 1, icon: '🏫', name: 'Schule', farbe: '#FFF3D6' },
  { a: 1, b: 0, icon: '⛪', name: 'Dom', farbe: '#F1ECE2' },
  { a: 1, b: 2, icon: '🚉', name: 'Bahnhof', farbe: '#E4ECF7' },
  { a: 2, b: 1, icon: '🌳', name: 'Stadtpark', farbe: '#BFE3B8' },
  { a: 2, b: 3, icon: '🏟️', name: 'Stadion', farbe: '#D5EBC8' },
  { a: 3, b: 0, icon: '🛒', name: 'Markt', farbe: '#FDE9D6' },
  { a: 3, b: 2, icon: '🏥', name: 'Klinikum', farbe: '#FADADA' },
  { a: 4, b: 1, icon: '🏭', name: 'Gewerbe', farbe: '#E7E7EC' },
];
const STRASSENNAMEN = [
  { text: 'Ringstraße', x: 200, y: 55 },
  { text: 'Hauptstraße', x: 295, y: 150 },
  { text: 'Gartenstraße', x: 105, y: 245 },
];

/** Stadtkarte: Einsätze wählen, Route wählen und hinfahren */
export function KarteScreen({
  pins,
  angefahren,
  routenRichtig,
  onFahre,
  onBack,
}: {
  pins: KartenPin[];
  angefahren: number;
  routenRichtig: number;
  onFahre: (pin: KartenPin, bonus: { kuerzeste: boolean; route: boolean }) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [verkehr] = useState(neuerVerkehr);
  const [wahl, setWahl] = useState<string | null>(null);
  const [routeWahl, setRouteWahl] = useState<'schnell' | 'direkt' | null>(null);
  const [fahrt, setFahrt] = useState<{ pin: KartenPin; weg: Fahrt; t: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const breite = Math.min(L.width - spacing.lg * 2, 640);
  const f = breite / KARTE.b;
  const hoehe = KARTE.h * f;
  const pin = pins.find((p) => p.id === wahl) ?? null;
  const routen = useMemo(() => new Map(pins.map((p) => [p.id, routenWahl(p, verkehr)])), [pins, verkehr]);
  const info = pin ? routen.get(pin.id)! : null;
  const gewaehlt: Fahrt | null = info ? (info.wahl ? (routeWahl ? info[routeWahl] : null) : info.schnell) : null;

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const waehlePin = (id: string) => {
    if (fahrt) return;
    setWahl(id);
    setRouteWahl(null);
  };

  const losfahren = () => {
    if (!pin || !info || !gewaehlt || fahrt) return;
    const start = Date.now();
    const dauer = Math.max(2200, gewaehlt.minuten * 650);
    setFahrt({ pin, weg: gewaehlt, t: 0 });
    timer.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dauer);
      setFahrt({ pin, weg: gewaehlt, t });
      if (t >= 1) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        onFahre(pin, {
          kuerzeste: istKuerzeste(pins, pin, verkehr),
          route: info.wahl && gewaehlt === info.schnell,
        });
      }
    }, 40);
  };

  const pfad = (w: Fahrt) => w.punkte.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x * f} ${p.y * f}`).join(' ');
  const fz = fahrt ? punktAuf(fahrt.weg, fahrt.t) : null;
  const winkel = fahrt ? richtungAuf(fahrt.weg, fahrt.t) : 0;
  const blau = Math.floor(Date.now() / 220) % 2 === 0;
  const zellen: { x: number; y: number; w: number; h: number; a: number; b: number }[] = [];
  const xs = [0, ...STRASSEN_X, KARTE.b];
  const ys = [0, ...STRASSEN_Y, KARTE.h];
  for (let a = 0; a < xs.length - 1; a++)
    for (let b = 0; b < ys.length - 1; b++) {
      const x0 = xs[a] + (a === 0 ? 0 : 9);
      const x1 = xs[a + 1] - (a === xs.length - 2 ? 0 : 9);
      const y0 = ys[b] + (b === 0 ? 0 : 9);
      const y1 = ys[b + 1] - (b === ys.length - 2 ? 0 : 9);
      zellen.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, a, b });
    }
  const anzeigeRouten: { w: Fahrt; name: 'A' | 'B'; art: 'schnell' | 'direkt' }[] =
    info && info.wahl && !fahrt
      ? [
          { w: info.direkt, name: 'A', art: 'direkt' },
          { w: info.schnell, name: 'B', art: 'schnell' },
        ]
      : [];
  const fahrtRoute = fahrt?.weg ?? (info && !info.wahl ? info.schnell : null);

  const hindernisText = (w: Fahrt) =>
    w.hindernisse.length === 0
      ? 'freie Fahrt'
      : w.hindernisse.map((h) => (h === 'stau' ? '🚦 Stau' : '🚧 Baustelle')).join(' · ');

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Stadtkarte" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Text style={type.body}>
          {r.id === 'helfer'
            ? 'Hilferufe in der Stadt: Wohin fährst du zuerst?'
            : 'Neue Einsätze von der Leitstelle: Welchen fährst du zuerst an?'}{' '}
          Wer den Einsatz mit der kürzesten Anfahrt wählt, bekommt +{BONUS_KUERZESTE} Punkte. Wer Staus clever umfährt, +
          {BONUS_ROUTE}.
        </Text>
        <View style={[styles.karte, { width: breite, height: hoehe }]}>
          <Svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`}>
            <Rect x={0} y={0} width={breite} height={hoehe} fill="#DCE7E2" />
            {zellen.map((z, k) => {
              const ort = ORTE.find((o) => o.a === z.a && o.b === z.b);
              return (
                <Rect
                  key={k}
                  x={z.x * f}
                  y={z.y * f}
                  width={z.w * f}
                  height={z.h * f}
                  rx={8 * f}
                  fill={ort ? ort.farbe : BLOCK_FARBEN[(z.a * 7 + z.b * 3 + k) % BLOCK_FARBEN.length]}
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
            {STRASSENNAMEN.map((n) => (
              <SvgText
                key={n.text}
                x={n.x * f}
                y={n.y * f + 3}
                fontSize={8.5}
                fontWeight="700"
                fill="#5E6F6A"
                textAnchor="middle"
              >
                {n.text}
              </SvgText>
            ))}
            {verkehr.map((v, i) => (
              <Line
                key={'v' + i}
                x1={v.a.x * f}
                y1={v.a.y * f}
                x2={v.b.x * f}
                y2={v.b.y * f}
                stroke={v.art === 'stau' ? '#E53935' : '#FB8C00'}
                strokeWidth={12 * f}
                strokeOpacity={0.6}
                strokeDasharray={v.art === 'baustelle' ? '6 5' : undefined}
              />
            ))}
            {anzeigeRouten.map((o) => (
              <Path
                key={o.name}
                d={pfad(o.w)}
                stroke={routeWahl === o.art ? r.akzent : o.name === 'A' ? '#5C6BC0' : '#26A69A'}
                strokeWidth={routeWahl === o.art ? 6 : 4}
                strokeDasharray={routeWahl === o.art ? undefined : '3 8'}
                strokeLinecap="round"
                fill="none"
                opacity={routeWahl && routeWahl !== o.art ? 0.45 : 1}
              />
            ))}
            {fahrtRoute && (
              <Path
                d={pfad(fahrtRoute)}
                stroke={r.akzent}
                strokeWidth={5}
                strokeDasharray="2 9"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {fz && (
              <>
                <Circle cx={fz.x * f} cy={fz.y * f} r={17} fill={blau ? '#3B82F6' : '#FF3B30'} opacity={0.28} />
                <Circle cx={fz.x * f} cy={fz.y * f} r={9} fill={blau ? '#3B82F6' : '#FF3B30'} opacity={0.55} />
              </>
            )}
            <Circle cx={BASIS.x * f} cy={BASIS.y * f} r={20 * f} fill="#fff" stroke={r.akzent} strokeWidth={3} />
          </Svg>
          {zellen
            .filter((z) => ORTE.some((o) => o.a === z.a && o.b === z.b))
            .map((z) => {
              const o = ORTE.find((x) => x.a === z.a && x.b === z.b)!;
              return (
                <View
                  key={o.name}
                  pointerEvents="none"
                  style={[styles.ort, { left: z.x * f, top: z.y * f, width: z.w * f, height: z.h * f }]}
                >
                  <Text style={styles.ortIcon}>{o.icon}</Text>
                  <Text style={styles.ortName}>{o.name}</Text>
                </View>
              );
            })}
          {verkehr.map((v, i) => (
            <Text
              key={'vi' + i}
              pointerEvents="none"
              style={[styles.verkehr, { left: ((v.a.x + v.b.x) / 2) * f - 13, top: ((v.a.y + v.b.y) / 2) * f - 15 }]}
            >
              {v.art === 'stau' ? '🚦' : '🚧'}
            </Text>
          ))}
          <Text pointerEvents="none" style={[styles.emoji, { left: BASIS.x * f - 14, top: BASIS.y * f - 17 }]}>
            {r.id === 'helfer' ? '💚' : '🏥'}
          </Text>
          {anzeigeRouten.map((o) => {
            const m = o.w.punkte[Math.floor(o.w.punkte.length / 2)];
            return (
              <View
                key={'l' + o.name}
                pointerEvents="none"
                style={[
                  styles.routeMarke,
                  { left: m.x * f - 11, top: m.y * f - 11, backgroundColor: o.name === 'A' ? '#5C6BC0' : '#26A69A' },
                ]}
              >
                <Text style={styles.routeMarkeText}>{o.name}</Text>
              </View>
            );
          })}
          {pins.map((p) => {
            const aktiv = p.id === wahl;
            const weg = fahrt?.pin.id === p.id;
            return (
              <Tap
                key={p.id}
                offset={0}
                disabled={!!fahrt}
                onPress={() => waehlePin(p.id)}
                accessibilityLabel={`Einsatz ${p.ort}`}
                style={[
                  styles.pin,
                  { left: p.x * f - 19, top: p.y * f - 38 },
                  aktiv && { backgroundColor: '#B42327', transform: [{ scale: 1.2 }], borderColor: colors.yellow },
                  weg && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.pinText}>!</Text>
                <Text style={styles.pinMin}>{routen.get(p.id)!.schnell.minuten} min</Text>
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
        <Text style={[type.small, { textAlign: 'center' }]}>
          🚦 Stau (viel langsamer) · 🚧 Baustelle (einspurig, noch langsamer). Die Anfahrtszeit unter jedem Einsatz gilt für die
          beste Route.
        </Text>
        {!fahrt && info && info.wahl && (
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>Welche Route nimmst du?</Text>
            <Text style={type.small}>Auf der Karte siehst du beide Wege. Meide den Verkehr, dann bekommst du einen Bonus.</Text>
            {(
              [
                { art: 'direkt' as const, name: 'A', w: info.direkt },
                { art: 'schnell' as const, name: 'B', w: info.schnell },
              ] satisfies { art: 'schnell' | 'direkt'; name: string; w: Fahrt }[]
            ).map((o) => (
              <Tap
                key={o.name}
                onPress={() => setRouteWahl(o.art)}
                accessibilityLabel={`Route ${o.name}`}
                style={[styles.zeile, routeWahl === o.art && { borderColor: r.akzent, backgroundColor: r.akzentTint }]}
              >
                <View style={[styles.zeit, { backgroundColor: o.name === 'A' ? '#E3E7F7' : '#D5F0EC' }]}>
                  <Text style={[styles.zeitZahl, { color: ink }]}>{o.name}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={[type.headline, { fontSize: 15 }]}
                  >{`Route ${o.name} · ${o.w.km.toString().replace('.', ',')} km`}</Text>
                  <Text style={type.small}>{hindernisText(o.w)}</Text>
                </View>
              </Tap>
            ))}
          </Card>
        )}
        {!fahrt && (
          <Button
            label={
              !pin
                ? 'Einsatz auf der Karte wählen'
                : info?.wahl && !routeWahl
                  ? 'Route wählen'
                  : `Losfahren – ${gewaehlt?.minuten} min`
            }
            variant="alarm"
            disabled={!pin || !gewaehlt}
            onPress={losfahren}
          />
        )}
        {fahrt ? (
          <Card style={{ gap: 4, borderLeftColor: colors.red }}>
            <Text style={type.headline}>🚨 Anfahrt läuft …</Text>
            <Text style={type.body}>{fahrt.pin.ort}</Text>
          </Card>
        ) : (
          pins.map((p) => (
            <Tap
              key={p.id}
              onPress={() => waehlePin(p.id)}
              accessibilityLabel={p.ort}
              style={[styles.zeile, p.id === wahl && { borderColor: r.akzent, backgroundColor: r.akzentTint }]}
            >
              <View style={styles.zeit}>
                <Text style={styles.zeitZahl}>{routen.get(p.id)!.schnell.minuten}</Text>
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
        <Text style={[type.small, { textAlign: 'center' }]}>
          Bisher angefahren: {angefahren} {angefahren === 1 ? 'Einsatz' : 'Einsätze'} · Staus clever umfahren: {routenRichtig}×
        </Text>
      </ScrollView>
    </View>
  );
}

const ink = colors.ink;

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  karte: { alignSelf: 'center', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  emoji: { position: 'absolute', fontSize: 24, lineHeight: 30, fontFamily: fonts.regular },
  fahrzeug: { fontSize: 28, lineHeight: 34 },
  ort: { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 1 },
  ortIcon: { fontSize: 20, lineHeight: 24, fontFamily: fonts.regular },
  ortName: { fontFamily: fonts.bold, fontSize: 8.5, color: '#55655F' },
  verkehr: { position: 'absolute', fontSize: 22, lineHeight: 28, fontFamily: fonts.regular },
  routeMarke: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeMarkeText: { fontFamily: fonts.extrabold, fontSize: 12, color: '#fff', lineHeight: 14 },
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
    color: colors.outline,
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
