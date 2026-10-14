import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { DeviceArt, Sparkles } from '../components/Devices';
import { FirstPersonInterior } from '../components/FirstPersonInterior';
import { Button, Eyebrow, TopBar } from '../components/UI';
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
import { colors, fonts, spacing, type } from '../theme';

function Pips({ level, dark }: { level: number; dark?: boolean }) {
  return (
    <View style={styles.pips}>
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <View key={i} style={[styles.pip, dark && { backgroundColor: '#3A4048' }, i < level && styles.pipOn]} />
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
          L.wide && { left: (L.width - 600) / 2, right: (L.width - 600) / 2, bottom: spacing.xl, borderRadius: 16 },
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
              <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Schließen">
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
              <Text style={[styles.effectText, level === 1 && { color: colors.grau500 }]}>{def.effect(level)}</Text>
            </View>
            <View style={styles.wissen}>
              <Text style={styles.wissenLabel}>💡 Gut zu wissen</Text>
              <Text style={[type.small, { color: colors.graphit }]}>{def.wissen}</Text>
            </View>

            {next ? (
              <View style={styles.next}>
                <Eyebrow title={`Nächste Stufe ${level + 1}/${MAX_LEVEL}`} />
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
        right={
          <View style={styles.budget}>
            <Text style={styles.budgetValue}>{euro(progress.budget)}</Text>
            <Text style={styles.budgetLabel}>Budget</Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={[{ paddingBottom: spacing.xxl }, L.wide && { padding: spacing.xl }]}>
        <Columns
          wide={L.wide}
          weights={[6, 5]}
          cols={[
            <View key="hall" style={L.wide && styles.hallWide}>
              <View style={styles.hall}>
                {inside ? (
                  <FirstPersonInterior levels={levels} width={sceneWidth} upgradable={upgradable} onSelect={setSheet} />
                ) : (
                  <Pressable onPress={() => setSheet('rtw')} style={styles.outside} accessibilityLabel="Fahrzeug ansehen">
                    <View style={styles.hallLight} />
                    <Ambulance level={levels.rtw} width={sceneWidth - spacing.lg * 2} blink={blink} />
                    <View style={styles.floorLine} />
                  </Pressable>
                )}
                <View style={styles.hallInfo}>
                  <Text style={styles.rtwName}>{inside ? 'Im Patientenraum' : rtwTier.name}</Text>
                  <Text style={styles.rtwYear}>
                    {inside
                      ? 'Tippe ein Gerät an – Steckbrief ansehen und aufrüsten'
                      : `Baujahr ${rtwTier.year} · Ausbau ${total}/${maxTotal}`}
                  </Text>
                  <View style={styles.toggle}>
                    {[
                      { v: false, label: 'Außen' },
                      { v: true, label: '🚪 Einsteigen' },
                    ].map((o) => (
                      <Pressable
                        key={o.label}
                        onPress={() => setInside(o.v)}
                        style={[styles.toggleBtn, inside === o.v && styles.toggleActive]}
                      >
                        <Text style={[styles.toggleText, inside === o.v && { color: colors.graphit }]}>{o.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>,
            <View key="body" style={[styles.body, L.wide && { padding: 0 }]}>
              <View style={styles.summary}>
                <Eyebrow title="Wirkung meiner Ausrüstung im Einsatz" />
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${(total / maxTotal) * 100}%` }]} />
                </View>
                <Text style={type.small}>
                  {effects.length > 0 ? effects.join(' · ') : 'Noch Grundausstattung – jede Aufrüstung hilft meinen Patienten.'}
                </Text>
                <Text style={[type.small, { marginTop: 4 }]}>Für jeden Punkt im Einsatz bekommt die Wache 1 € Budget.</Text>
              </View>

              <Eyebrow title="Gesamte Ausrüstung" />
              {EQUIPMENT.map((e) => {
                const l = levels[e.id];
                const can = upgradable.includes(e.id);
                return (
                  <Pressable
                    key={e.id}
                    onPress={() => setSheet(e.id)}
                    style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
                  >
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
                  </Pressable>
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
  budget: { alignItems: 'flex-end', backgroundColor: '#FFF4D6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  budgetValue: { color: '#A05A00', fontFamily: fonts.bold, fontSize: 16 },
  budgetLabel: { color: '#A05A00', fontFamily: fonts.medium, fontSize: 10 },
  hallWide: { borderRadius: 10, overflow: 'hidden' },
  hall: { backgroundColor: '#1A1F26' },
  outside: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg, overflow: 'hidden' },
  hallLight: {
    position: 'absolute',
    top: -140,
    left: '12%',
    right: '12%',
    height: 260,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  floorLine: {
    height: 4,
    backgroundColor: colors.warngelb,
    opacity: 0.7,
    marginTop: spacing.sm,
    alignSelf: 'stretch',
    marginHorizontal: -spacing.lg,
  },
  hallInfo: { padding: spacing.lg, paddingTop: spacing.md },
  rtwName: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.weiss },
  rtwYear: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300 },
  toggle: { flexDirection: 'row', backgroundColor: '#2A3038', borderRadius: 16, padding: 3, marginTop: spacing.md },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: 14 },
  toggleActive: { backgroundColor: colors.warngelb },
  toggleText: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.grau300 },
  body: { padding: spacing.lg, gap: spacing.md },
  summary: {
    backgroundColor: colors.weiss,
    borderWidth: 1,
    borderColor: colors.grau200,
    borderRadius: 14,
    padding: spacing.lg,
    gap: 4,
  },
  progressTrack: { height: 8, backgroundColor: colors.grau200, borderRadius: 4, overflow: 'hidden', marginVertical: 4 },
  progressFill: { height: 8, backgroundColor: colors.warngelb },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.weiss,
    borderWidth: 1,
    borderColor: colors.grau200,
    borderRadius: 14,
    padding: spacing.md,
  },
  rowArt: { width: 58, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1F26', borderRadius: 14 },
  rowKicker: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.4,
    color: colors.signalrot,
    textTransform: 'uppercase',
  },
  rowName: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.graphit, marginBottom: 3 },
  rowUp: {
    fontFamily: fonts.extrabold,
    fontSize: 11,
    color: colors.graphit,
    backgroundColor: colors.monitorGruen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rowArrow: { fontFamily: fonts.regular, fontSize: 26, color: colors.grau300 },
  pips: { flexDirection: 'row', gap: 3 },
  pip: { width: 12, height: 6, borderRadius: 2, backgroundColor: colors.grau200 },
  pipOn: { backgroundColor: colors.warngelb },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.grau50,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  showroom: { backgroundColor: '#12161B', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, overflow: 'hidden' },
  spot: {
    position: 'absolute',
    top: 10,
    left: '20%',
    right: '20%',
    height: 240,
    borderRadius: 160,
    backgroundColor: 'rgba(120,170,255,0.10)',
  },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.lg },
  sheetKicker: {
    fontFamily: fonts.extrabold,
    fontSize: 11,
    letterSpacing: 0.4,
    color: colors.warngelb,
    textTransform: 'uppercase',
  },
  close: { fontFamily: fonts.bold, fontSize: 22, color: colors.grau300 },
  artWrap: { alignItems: 'center', justifyContent: 'center', height: 190, marginTop: spacing.sm },
  sparkles: { position: 'absolute' },
  fresh: {
    alignSelf: 'center',
    fontFamily: fonts.displayBlack,
    fontSize: 16,
    color: colors.graphit,
    backgroundColor: colors.monitorGruen,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sheetName: {
    fontFamily: fonts.displayBlack,
    fontSize: 28,
    lineHeight: 30,
    color: colors.weiss,
    marginTop: spacing.sm,
  },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  sheetMetaText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300 },
  sheetBody: { padding: spacing.lg, gap: spacing.md },
  facts: { gap: 4 },
  fact: { fontFamily: fonts.bold, fontSize: 14, color: colors.graphit },
  effectBox: {
    backgroundColor: colors.weiss,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.grau200,
    padding: spacing.md,
  },
  effectLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.4,
    color: colors.grau500,
    textTransform: 'uppercase',
  },
  effectText: { fontFamily: fonts.bold, fontSize: 14, color: colors.gruen, marginTop: 2 },
  wissen: { backgroundColor: colors.blaulichtLight, borderRadius: 14, padding: spacing.md, gap: 4 },
  wissenLabel: { fontFamily: fonts.extrabold, fontSize: 12, color: colors.blaulichtDark },
  next: {
    backgroundColor: colors.weiss,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.grau200,
    padding: spacing.md,
    gap: spacing.sm,
  },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextArt: {
    width: 86,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#1A1F26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextName: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.graphit },
  nextEffect: { fontFamily: fonts.bold, fontSize: 13, color: colors.gruen, marginTop: 2 },
  locked: { fontFamily: fonts.bold, fontSize: 13, color: colors.grau500 },
  missing: { fontFamily: fonts.semibold, fontSize: 12, color: colors.grau500, textAlign: 'center' },
  max: { fontFamily: fonts.bold, fontSize: 14, color: colors.gruen },
});
