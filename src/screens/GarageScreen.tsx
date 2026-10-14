import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { DeviceArt, Sparkles } from '../components/Devices';
import { FirstPersonInterior } from '../components/FirstPersonInterior';
import { Bar, Button, Segmented, StatChip, Tap, TopBar } from '../components/UI';
import {
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  EquipmentId,
  MAX_LEVEL,
  equipmentEffects,
  euro,
  levelOf,
  totalLevel,
  upgradeBlock,
} from '../game/equipment';
import { Progress } from '../game/storage';
import { Columns, useLayout } from '../layout';
import { colors, fonts, hardShadow, spacing, type } from '../theme';

function Pips({ level, dark }: { level: number; dark?: boolean }) {
  return (
    <View style={styles.pips}>
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <View
          key={i}
          style={[
            styles.pip,
            dark && { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: colors.white },
            i < level && styles.pipOn,
          ]}
        />
      ))}
    </View>
  );
}

/** Großansicht eines Geräts (oder des Fahrzeugs) in einer bestimmten Stufe */
function Art({ id, level, size, blink }: { id: EquipmentId; level: number; size: number; blink?: boolean }) {
  if (id === 'rtw') return <Ambulance level={level} width={size * 1.6} blink={blink} />;
  return <DeviceArt id={id} level={level} size={size} />;
}

/** Steckbrief: Gerät ansehen, Infos lesen und aufrüsten. Fährt von unten herein. */
function Steckbrief({
  id,
  progress,
  blink,
  fresh,
  onUpgrade,
  onClose,
}: {
  id: EquipmentId;
  progress: Progress;
  blink: boolean;
  fresh: boolean;
  onUpgrade: (id: EquipmentId) => void;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const L = useLayout();
  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(slide, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [slide]);

  const def = EQUIPMENT_BY_ID[id];
  const level = levelOf(progress, id);
  const tier = def.tiers[level - 1];
  const next = level < MAX_LEVEL ? def.tiers[level] : null;
  const block = upgradeBlock(progress, id);
  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Steckbrief schließen" />
      <Animated.View
        style={[
          styles.sheet,
          L.wide && {
            left: (L.width - 600) / 2,
            right: (L.width - 600) / 2,
            bottom: spacing.xl,
            borderRadius: 28,
            borderBottomWidth: 2,
          },
          { maxHeight: height * 0.9, transform: [{ translateY }] },
        ]}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          <View style={styles.showroom}>
            <View style={styles.spot} />
            <View style={styles.sheetHead}>
              <Text style={styles.sheetKicker}>
                {def.icon} Steckbrief · {def.title}
              </Text>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Schließen"
                style={styles.closeBtn}
              >
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.artWrap}>
              <Art id={id} level={level} size={170} blink={blink} />
              {fresh && (
                <View style={styles.sparkles} pointerEvents="none">
                  <Sparkles size={220} />
                </View>
              )}
            </View>
            {fresh && <Text style={styles.fresh}>Neu eingebaut!</Text>}
            <Text style={styles.sheetName}>{tier.name}</Text>
            <View style={styles.sheetMeta}>
              <Pips level={level} dark />
              <Text style={styles.sheetMetaText}>
                Stufe {level}/{MAX_LEVEL} · Baujahr {tier.year}
              </Text>
            </View>
          </View>

          <View style={styles.sheetBody}>
            <Text style={type.body}>{tier.text}</Text>
            <View style={styles.facts}>
              {tier.facts.map((f) => (
                <Text key={f} style={styles.fact}>
                  ✓ {f}
                </Text>
              ))}
            </View>
            <View style={styles.effectBox}>
              <Text style={styles.effectLabel}>Wirkung im Einsatz</Text>
              <Text style={[styles.effectText, level === 1 && { color: colors.muted }]}>{def.effect(level)}</Text>
            </View>
            <View style={styles.wissen}>
              <Text style={styles.wissenLabel}>💡 Gut zu wissen</Text>
              <Text style={[type.small, { color: colors.ink }]}>{def.wissen}</Text>
            </View>

            {next ? (
              <View style={styles.next}>
                <Text style={type.eyebrow}>{`Nächste Stufe ${level + 1}/${MAX_LEVEL}`}</Text>
                <View style={styles.nextRow}>
                  <View style={styles.nextArt}>
                    <Art id={id} level={level + 1} size={id === 'rtw' ? 52 : 72} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nextName}>{next.name}</Text>
                    <Text style={type.small}>Baujahr {next.year}</Text>
                    <Text style={styles.nextEffect}>{def.effect(level + 1)}</Text>
                  </View>
                </View>
                {block?.reason === 'rank' ? (
                  <Text style={styles.locked}>🔒 Freigeschaltet ab Dienstgrad „{block.rank}“</Text>
                ) : (
                  <Button
                    label={`Aufrüsten · ${euro(def.cost[level])}`}
                    variant={block ? 'outline' : 'alarm'}
                    disabled={!!block}
                    onPress={() => onUpgrade(id)}
                  />
                )}
                {block?.reason === 'budget' && (
                  <Text style={styles.missing}>
                    Budget {euro(progress.budget)} – noch {euro(block.missing)} sammeln
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.max}>✓ Höchste Stufe – modernste Ausrüstung</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/** Fahrzeughalle: meinen Rettungswagen von außen ansehen, einsteigen und Geräte aufrüsten. */
export function GarageScreen({ progress, onUpgrade }: { progress: Progress; onUpgrade: (id: EquipmentId) => void }) {
  const L = useLayout();
  const sceneWidth = L.wide ? Math.floor(((L.width - spacing.xl * 2 - spacing.lg) * 6) / 11) : L.width;
  const [inside, setInside] = useState(false);
  const [sheet, setSheet] = useState<EquipmentId | null>(null);
  const [fresh, setFresh] = useState<EquipmentId | null>(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 380);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!fresh) return;
    const t = setTimeout(() => setFresh(null), 2400);
    return () => clearTimeout(t);
  }, [fresh]);

  const levels = Object.fromEntries(EQUIPMENT.map((e) => [e.id, levelOf(progress, e.id)])) as Record<EquipmentId, number>;
  const upgradable = EQUIPMENT.filter((e) => upgradeBlock(progress, e.id) === null).map((e) => e.id);
  const rtwTier = EQUIPMENT_BY_ID.rtw.tiers[levels.rtw - 1];
  const fx = equipmentEffects(progress);
  const total = totalLevel(progress);
  const maxTotal = EQUIPMENT.length * MAX_LEVEL;
  const effects = [
    fx.startBonus > 0 && `+${fx.startBonus} % Startzustand`,
    fx.measureFactor < 1 && `Messungen −${Math.round((1 - fx.measureFactor) * 100)} %`,
    fx.endBonus > 0 && `+${fx.endBonus} % Zustand am Ende`,
    fx.pointsPct > 0 && `+${fx.pointsPct} % Punkte`,
    fx.drainFactor < 1 && `„Schwer“ −${Math.round((1 - fx.drainFactor) * 100)} % Zeitdruck`,
  ].filter(Boolean) as string[];

  const upgrade = (id: EquipmentId) => {
    onUpgrade(id);
    setFresh(id);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Fahrzeughalle"
        title="Mein Rettungswagen"
        right={<StatChip value={euro(progress.budget)} label="Budget" color={colors.yellow} />}
      />
      <ScrollView contentContainerStyle={[{ paddingBottom: spacing.xxl }, L.wide && { padding: spacing.xl }]}>
        <Columns
          wide={L.wide}
          weights={[6, 5]}
          cols={[
            <View key="hall" style={styles.hall}>
              <View style={styles.stage}>
                {inside ? (
                  <FirstPersonInterior
                    levels={levels}
                    width={Math.max(280, sceneWidth - 4)}
                    upgradable={upgradable}
                    onSelect={setSheet}
                  />
                ) : (
                  <Pressable onPress={() => setSheet('rtw')} style={styles.outside} accessibilityLabel="Fahrzeug ansehen">
                    <View style={styles.sun} />
                    <View>
                      <Ambulance level={levels.rtw} width={Math.max(160, Math.min(sceneWidth - 56, 420))} blink={blink} />
                    </View>
                    <View style={styles.floorLine} />
                  </Pressable>
                )}
              </View>
              <View style={styles.hallInfo}>
                <Text style={styles.rtwName}>{inside ? 'Im Patientenraum' : rtwTier.name}</Text>
                <Text style={styles.rtwYear}>
                  {inside
                    ? 'Tippe ein Gerät an – Steckbrief ansehen und aufrüsten'
                    : `Baujahr ${rtwTier.year} · Ausbau ${total}/${maxTotal}`}
                </Text>
                <View style={{ marginTop: spacing.md }}>
                  <Segmented
                    options={[
                      { id: 'out', label: 'Außen' },
                      { id: 'in', label: '🚪 Einsteigen' },
                    ]}
                    value={inside ? 'in' : 'out'}
                    onChange={(v) => setInside(v === 'in')}
                  />
                </View>
              </View>
            </View>,
            <View key="body" style={[styles.body, L.wide && { padding: 0 }]}>
              <View style={styles.summary}>
                <Text style={type.eyebrow}>Wirkung meiner Ausrüstung im Einsatz</Text>
                <Bar pct={total / maxTotal} color={colors.red} height={14} style={{ marginVertical: 6 }} />
                <Text style={type.small}>
                  {effects.length > 0 ? effects.join(' · ') : 'Noch Grundausstattung – jede Aufrüstung hilft meinen Patienten.'}
                </Text>
                <Text style={[type.small, { marginTop: 4 }]}>Für jeden Punkt im Einsatz bekommt die Wache 1 € Budget.</Text>
              </View>

              <Text style={[type.eyebrow, { marginTop: spacing.sm }]}>Gesamte Ausrüstung</Text>
              {EQUIPMENT.map((e) => {
                const l = levels[e.id];
                const can = upgradable.includes(e.id);
                return (
                  <Tap key={e.id} onPress={() => setSheet(e.id)} offset={3} accessibilityLabel={e.title} style={styles.row}>
                    <View style={styles.rowArt}>
                      {e.id === 'rtw' ? <Ambulance level={l} width={56} /> : <DeviceArt id={e.id} level={l} size={44} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowKicker}>{e.title}</Text>
                      <Text style={styles.rowName} numberOfLines={1}>
                        {e.tiers[l - 1].name}
                      </Text>
                      <Pips level={l} />
                    </View>
                    {can && <Text style={styles.rowUp}>↑ Aufrüsten</Text>}
                    <Text style={styles.rowArrow}>›</Text>
                  </Tap>
                );
              })}
            </View>,
          ]}
        />
      </ScrollView>

      {sheet && (
        <Steckbrief
          key={sheet}
          id={sheet}
          progress={progress}
          blink={blink}
          fresh={fresh === sheet}
          onUpgrade={upgrade}
          onClose={() => setSheet(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hall: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 28,
    overflow: 'hidden',
    ...hardShadow(5),
  },
  stage: { backgroundColor: colors.butter, borderBottomWidth: 2, borderBottomColor: colors.ink },
  outside: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg, overflow: 'hidden' },
  sun: {
    position: 'absolute',
    top: -90,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  floorLine: {
    height: 14,
    backgroundColor: colors.ink,
    marginTop: spacing.sm,
    alignSelf: 'stretch',
    marginHorizontal: -spacing.lg,
  },
  hallInfo: { padding: spacing.lg, paddingTop: spacing.md },
  rtwName: { fontFamily: fonts.displayBlack, fontSize: 26, lineHeight: 28, color: colors.ink, letterSpacing: -0.8 },
  rtwYear: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, marginTop: 2 },
  body: { padding: spacing.lg, gap: spacing.md },
  summary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 22,
    padding: spacing.lg,
    gap: 4,
    ...hardShadow(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 20,
    padding: spacing.md,
  },
  rowArt: {
    width: 62,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.butter,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rowKicker: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.8, color: colors.red, textTransform: 'uppercase' },
  rowName: {
    fontFamily: fonts.displayBlack,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  rowUp: {
    fontFamily: fonts.displayBlack,
    fontSize: 11.5,
    color: colors.ink,
    backgroundColor: colors.mint,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rowArrow: { fontFamily: fonts.displayBlack, fontSize: 24, color: colors.ink },
  pips: { flexDirection: 'row', gap: 3 },
  pip: { width: 14, height: 8, borderRadius: 4, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.ink },
  pipOn: { backgroundColor: colors.yellow },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,23,58,0.55)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.ink,
    overflow: 'hidden',
  },
  showroom: { backgroundColor: colors.ink, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, overflow: 'hidden' },
  spot: {
    position: 'absolute',
    top: 10,
    left: '20%',
    right: '20%',
    height: 240,
    borderRadius: 160,
    backgroundColor: 'rgba(120,150,255,0.18)',
  },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.lg },
  sheetKicker: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.yellow, textTransform: 'uppercase' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink },
  artWrap: { alignItems: 'center', justifyContent: 'center', height: 190, marginTop: spacing.sm },
  sparkles: { position: 'absolute', pointerEvents: 'none' },
  fresh: {
    alignSelf: 'center',
    fontFamily: fonts.displayBlack,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.mint,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  sheetName: {
    fontFamily: fonts.displayBlack,
    fontSize: 28,
    lineHeight: 30,
    color: colors.white,
    marginTop: spacing.sm,
    letterSpacing: -0.9,
  },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  sheetMetaText: { fontFamily: fonts.mono, fontSize: 12, color: colors.grau300 },
  sheetBody: { padding: spacing.lg, gap: spacing.md },
  facts: { gap: 4 },
  fact: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  effectBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: spacing.md,
  },
  effectLabel: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1, color: colors.muted, textTransform: 'uppercase' },
  effectText: { fontFamily: fonts.bold, fontSize: 14, color: colors.mintDark, marginTop: 2 },
  wissen: {
    backgroundColor: colors.blueTint,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: spacing.md,
    gap: 4,
  },
  wissenLabel: { fontFamily: fonts.display, fontSize: 13, color: colors.blueDark },
  next: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: spacing.md,
    gap: spacing.sm,
  },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextArt: {
    width: 86,
    height: 80,
    borderRadius: 14,
    backgroundColor: colors.butter,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextName: { fontFamily: fonts.displayBlack, fontSize: 18, lineHeight: 20, color: colors.ink, letterSpacing: -0.4 },
  nextEffect: { fontFamily: fonts.bold, fontSize: 13, color: colors.mintDark, marginTop: 2 },
  locked: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  missing: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted, textAlign: 'center' },
  max: { fontFamily: fonts.bold, fontSize: 14, color: colors.mintDark },
});
