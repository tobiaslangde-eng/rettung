import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, WarnStripes, TopBar } from '../components/UI';
import { BASICS } from '../data/basics';
import { CASES } from '../data/cases';
import { VITALS } from '../data/vitals';
import { Progress } from '../game/storage';
import { colors, spacing, type, fonts } from '../theme';

type Tab = 'wissen' | 'werte' | 'krankheiten';

export function LexikonScreen({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('werte');
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Nachschlagen" title="Lexikon" onBack={onBack} />
      <View style={styles.tabs}>
        <TabBtn active={tab === 'werte'} label="Normwerte" sub="Vitalwerte" onPress={() => setTab('werte')} />
        <TabBtn active={tab === 'krankheiten'} label="Krankheiten" sub={`${CASES.length} Fälle`} onPress={() => setTab('krankheiten')} />
        <TabBtn active={tab === 'wissen'} label="Wissen" sub="Erste Hilfe" onPress={() => setTab('wissen')} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'wissen' &&
          BASICS.map((b) => (
            <Card key={b.id}>
              <Eyebrow title="Rettungswissen" />
              <Text style={[type.h2, { marginTop: 2 }]}>{b.title}</Text>
              {b.intro ? <Text style={[type.small, { marginTop: spacing.xs }]}>{b.intro}</Text> : null}
              {b.points.map((pt) => (
                <Text key={pt} style={[type.body, { marginTop: 4 }]}>
                  • {pt}
                </Text>
              ))}
            </Card>
          ))}
        {tab === 'wissen' ? null : tab === 'werte' ? (
          <>
            <Text style={type.small}>Richtwerte für Erwachsene in Ruhe. Bei Kindern gelten andere Normalbereiche.</Text>
            {VITALS.map((v) => (
              <Card key={v.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Eyebrow title="Vitalwert" />
                  <Text style={styles.short}>{v.short}</Text>
                </View>
                <Text style={[type.h2, { marginTop: 2 }]}>{v.name}</Text>
                <Text style={[type.body, { marginTop: spacing.xs }]}>Normal: {v.normal}</Text>
                {!v.textOnly && v.id !== 'gcs' && (
                  <Text style={type.small}>
                    ↓ niedrig unter {v.low} {v.unit}
                    {v.id !== 'spo2' ? `  ·  ↑ hoch über ${String(v.high).replace('.', ',')} ${v.unit}` : ''}
                  </Text>
                )}
                {v.id === 'gcs' && <Text style={type.small}>↓ jeder Wert unter 15 = Bewusstseinsstörung (≤ 8: Atemweg gefährdet)</Text>}
              </Card>
            ))}
          </>
        ) : (
          CASES.map((c) => {
            const stars = progress.bestStars[c.id] ?? 0;
            return (
              <Card key={c.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Eyebrow title="Krankheitsbild" />
                  <Text style={{ color: colors.blaulicht }}>
                    {'★'.repeat(stars)}
                    <Text style={{ color: colors.grau300 }}>{'★'.repeat(3 - stars)}</Text>
                  </Text>
                </View>
                <Text style={[type.h2, { marginTop: 2 }]}>{c.diagnosis}</Text>
                {c.leitsymptome.map((s) => (
                  <Text key={s} style={[type.body, { marginTop: 2 }]}>
                    • {s}
                  </Text>
                ))}
                <Text style={[type.small, { marginTop: spacing.sm }]}>{c.explanation}</Text>
              </Card>
            );
          })
        )}
        <WarnStripes />
      </ScrollView>
    </View>
  );
}

function TabBtn({ active, label, sub, onPress }: { active: boolean; label: string; sub: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabLabel, active && { color: colors.weiss }]}>{label}</Text>
      <Text style={[styles.tabEt, active && { color: colors.blaulichtLight }]}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  tabs: { flexDirection: 'row', backgroundColor: colors.grau200 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.blaulicht },
  tabLabel: { fontFamily: fonts.bold, color: colors.graphit },
  tabEt: { fontFamily: fonts.regular, fontSize: 10, color: colors.grau500, letterSpacing: 1 },
  short: { fontFamily: fonts.extrabold, color: colors.graphit, letterSpacing: 1 },
});
