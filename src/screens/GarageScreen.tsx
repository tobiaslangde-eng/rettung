import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { AmbulanceInterior } from '../components/AmbulanceInterior';
import { ReflexStripes, WarnStripes } from '../components/Ems';
import { Button, Eyebrow, TopBar } from '../components/UI';
import {
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  EquipmentDef,
  EquipmentId,
  MAX_LEVEL,
  equipmentEffects,
  euro,
  levelOf,
  totalLevel,
  upgradeBlock,
} from '../game/equipment';
import { Progress } from '../game/storage';
import { colors, fonts, spacing, type } from '../theme';

function Pips({ level }: { level: number }) {
  return (
    <View style={styles.pips}>
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <View key={i} style={[styles.pip, i < level && styles.pipOn]} />
      ))}
    </View>
  );
}

function ItemCard({
  def,
  progress,
  highlight,
  onUpgrade,
}: {
  def: EquipmentDef;
  progress: Progress;
  highlight: boolean;
  onUpgrade: (id: EquipmentId) => void;
}) {
  const level = levelOf(progress, def.id);
  const tier = def.tiers[level - 1];
  const next = level < MAX_LEVEL ? def.tiers[level] : null;
  const block = upgradeBlock(progress, def.id);
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <View style={styles.cardHead}>
        <Text style={styles.cardIcon}>{def.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardKicker}>{def.title}</Text>
          <Text style={styles.cardName}>{tier.name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Pips level={level} />
          <Text style={styles.year}>Baujahr {tier.year}</Text>
        </View>
      </View>
      <Text style={[type.small, { marginTop: spacing.xs }]}>{tier.text}</Text>
      <Text style={[styles.effect, level === 1 && { color: colors.grau500 }]}>{def.effect(level)}</Text>
      {next ? (
        <View style={styles.next}>
          <Text style={styles.nextLabel}>
            Stufe {level + 1}: <Text style={{ fontFamily: fonts.bold, color: colors.graphit }}>{next.name}</Text> ({next.year})
          </Text>
          <Text style={[type.small, { marginTop: 2 }]}>{def.effect(level + 1)}</Text>
          {block?.reason === 'rank' ? (
            <Text style={styles.locked}>🔒 Freigeschaltet ab Dienstgrad „{block.rank}“</Text>
          ) : (
            <Button
              label={`Aufrüsten · ${euro(def.cost[level])}`}
              variant={block ? 'outline' : 'alarm'}
              disabled={!!block}
              onPress={() => onUpgrade(def.id)}
              style={{ marginTop: spacing.sm }}
            />
          )}
          {block?.reason === 'budget' && <Text style={styles.missing}>Noch {euro(block.missing)} sammeln</Text>}
        </View>
      ) : (
        <Text style={styles.max}>✓ Höchste Stufe – modernste Ausrüstung</Text>
      )}
    </View>
  );
}

/** Fahrzeughalle: meinen Rettungswagen ansehen, einsteigen und mit dem Budget aufrüsten. */
export function GarageScreen({
  progress,
  onUpgrade,
  onBack,
}: {
  progress: Progress;
  onUpgrade: (id: EquipmentId) => void;
  onBack: () => void;
}) {
  const { width } = useWindowDimensions();
  const sceneWidth = Math.min(width, 480) - spacing.lg * 2;
  const [inside, setInside] = useState(false);
  const [selected, setSelected] = useState<EquipmentId>('rtw');
  const [blink, setBlink] = useState(false);
  const [justBought, setJustBought] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 380);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!justBought) return;
    const t = setTimeout(() => setJustBought(null), 2600);
    return () => clearTimeout(t);
  }, [justBought]);

  const levels = Object.fromEntries(EQUIPMENT.map((e) => [e.id, levelOf(progress, e.id)])) as Record<EquipmentId, number>;
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
    const next = levelOf(progress, id) + 1;
    onUpgrade(id);
    setSelected(id);
    setJustBought(`${EQUIPMENT_BY_ID[id].tiers[next - 1].name} ist eingebaut!`);
  };

  const selectedDef = EQUIPMENT_BY_ID[selected];
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Fahrzeughalle"
        title="Mein Rettungswagen"
        onBack={onBack}
        right={
          <View style={styles.budget}>
            <Text style={styles.budgetValue}>{euro(progress.budget)}</Text>
            <Text style={styles.budgetLabel}>Budget</Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.hall}>
          <View style={styles.hallLight} />
          {inside ? (
            <View style={styles.inside}>
              <AmbulanceInterior levels={levels} width={sceneWidth} selected={selected} onSelect={setSelected} />
            </View>
          ) : (
            <Pressable onPress={() => setSelected('rtw')} style={{ alignItems: 'center', paddingTop: spacing.lg }}>
              <Ambulance level={levels.rtw} width={sceneWidth} blink={blink} />
            </Pressable>
          )}
          <View style={styles.floorLine} />
          <View style={styles.hallText}>
            <Text style={styles.rtwName}>{rtwTier.name}</Text>
            <Text style={styles.rtwYear}>
              Baujahr {rtwTier.year} · Ausbau {total}/{maxTotal}
            </Text>
          </View>
          <View style={styles.toggle}>
            {[
              { v: false, label: 'Außen' },
              { v: true, label: 'Einsteigen' },
            ].map((o) => (
              <Pressable
                key={o.label}
                onPress={() => {
                  setInside(o.v);
                  setSelected(o.v ? 'trage' : 'rtw');
                }}
                style={[styles.toggleBtn, inside === o.v && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, inside === o.v && { color: colors.graphit }]}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
          {inside && <Text style={styles.hint}>Tippe auf ein Teil im Patientenraum</Text>}
        </View>
        <ReflexStripes height={6} />

        <View style={styles.body}>
          {justBought && (
            <View style={styles.bought}>
              <Text style={styles.boughtText}>🔧 {justBought}</Text>
            </View>
          )}
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

          <ItemCard def={selectedDef} progress={progress} highlight onUpgrade={upgrade} />

          <Eyebrow title="Gesamte Ausrüstung" />
          {EQUIPMENT.filter((e) => e.id !== selected).map((e) => (
            <Pressable key={e.id} onPress={() => setSelected(e.id)}>
              <ItemCard def={e} progress={progress} highlight={false} onUpgrade={upgrade} />
            </Pressable>
          ))}
          <WarnStripes />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  budget: { alignItems: 'flex-end', borderWidth: 1, borderColor: colors.warngelb, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  budgetValue: { color: colors.warngelb, fontFamily: fonts.extrabold, fontSize: 15 },
  budgetLabel: { color: colors.grau300, fontFamily: fonts.regular, fontSize: 9, letterSpacing: 1 },
  hall: { backgroundColor: '#1A1F26', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, overflow: 'hidden' },
  hallLight: {
    position: 'absolute',
    top: -120,
    left: '15%',
    right: '15%',
    height: 220,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inside: { marginTop: spacing.lg, borderRadius: 10, overflow: 'hidden', borderWidth: 3, borderColor: '#3A4048' },
  floorLine: { height: 4, backgroundColor: colors.warngelb, opacity: 0.7, marginTop: spacing.sm, marginHorizontal: -spacing.lg },
  hallText: { marginTop: spacing.md },
  rtwName: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.weiss, textTransform: 'uppercase' },
  rtwYear: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grau300 },
  toggle: { flexDirection: 'row', backgroundColor: '#2A3038', borderRadius: 8, padding: 3, marginTop: spacing.md },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: 6 },
  toggleActive: { backgroundColor: colors.warngelb },
  toggleText: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.grau300, textTransform: 'uppercase' },
  hint: { fontFamily: fonts.semibold, fontSize: 12, color: colors.grau300, textAlign: 'center', marginTop: spacing.sm },
  body: { padding: spacing.lg, gap: spacing.md },
  bought: { backgroundColor: colors.gruen, borderRadius: 6, padding: spacing.md },
  boughtText: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.weiss },
  summary: { backgroundColor: colors.weiss, borderWidth: 1, borderColor: colors.grau200, borderRadius: 6, padding: spacing.lg, gap: 4 },
  progressTrack: { height: 8, backgroundColor: colors.grau200, borderRadius: 4, overflow: 'hidden', marginVertical: 4 },
  progressFill: { height: 8, backgroundColor: colors.warngelb },
  card: { backgroundColor: colors.weiss, borderWidth: 1, borderColor: colors.grau200, borderRadius: 6, padding: spacing.lg },
  cardHighlight: { borderWidth: 2, borderColor: colors.blaulicht },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardIcon: { fontSize: 30, fontFamily: fonts.regular },
  cardKicker: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: 1.6, color: colors.signalrot, textTransform: 'uppercase' },
  cardName: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.graphit, textTransform: 'uppercase' },
  year: { fontFamily: fonts.semibold, fontSize: 11, color: colors.grau500 },
  pips: { flexDirection: 'row', gap: 3 },
  pip: { width: 12, height: 6, borderRadius: 2, backgroundColor: colors.grau200 },
  pipOn: { backgroundColor: colors.warngelb },
  effect: { fontFamily: fonts.bold, fontSize: 13, color: colors.gruen, marginTop: spacing.xs },
  next: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.grau200 },
  nextLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.grau500 },
  locked: { fontFamily: fonts.bold, fontSize: 13, color: colors.grau500, marginTop: spacing.sm },
  missing: { fontFamily: fonts.semibold, fontSize: 12, color: colors.grau500, textAlign: 'center', marginTop: 4 },
  max: { fontFamily: fonts.bold, fontSize: 13, color: colors.gruen, marginTop: spacing.md },
});
