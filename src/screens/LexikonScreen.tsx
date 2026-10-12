import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Ornament, TopBar } from '../components/Estonian';
import { CASES } from '../data/cases';
import { VITALS } from '../data/vitals';
import { Progress } from '../game/storage';
import { colors, spacing, type, fonts } from '../theme';

type Tab = 'werte' | 'krankheiten';

export function LexikonScreen({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('werte');
  return (
    <View style={{ flex: 1 }}>
      <TopBar et="Leksikon" title="Lexikon" onBack={onBack} />
      <View style={styles.tabs}>
        <TabBtn active={tab === 'werte'} label="Normwerte" et="Normväärtused" onPress={() => setTab('werte')} />
        <TabBtn active={tab === 'krankheiten'} label="Krankheitsbilder" et="Haigused" onPress={() => setTab('krankheiten')} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'werte' ? (
          <>
            <Text style={type.small}>Richtwerte für Erwachsene in Ruhe. Bei Kindern gelten andere Normalbereiche.</Text>
            {VITALS.map((v) => (
              <Card key={v.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Eyebrow et={v.et} />
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
                  <Eyebrow et={c.diagnosisEt} />
                  <Text style={{ color: colors.sinine }}>
                    {'★'.repeat(stars)}
                    <Text style={{ color: colors.greyLight }}>{'★'.repeat(3 - stars)}</Text>
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
        <Ornament count={10} />
      </ScrollView>
    </View>
  );
}

function TabBtn({ active, label, et, onPress }: { active: boolean; label: string; et: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabLabel, active && { color: colors.valge }]}>{label}</Text>
      <Text style={[styles.tabEt, active && { color: colors.sinineLight }]}>{et}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  tabs: { flexDirection: 'row', backgroundColor: colors.linenDark },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.sinine },
  tabLabel: { fontFamily: fonts.bold, color: colors.must },
  tabEt: { fontFamily: fonts.regular, fontSize: 10, color: colors.grey, letterSpacing: 1 },
  short: { fontFamily: fonts.extrabold, color: colors.must, letterSpacing: 1 },
});
