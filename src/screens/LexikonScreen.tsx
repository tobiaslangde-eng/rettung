import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Segmented, TopBar } from '../components/UI';
import { BASICS } from '../data/basics';
import { CASES } from '../data/cases';
import { CHILD_NORMS, VITALS } from '../data/vitals';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, spacing, type, fonts } from '../theme';

type Tab = 'wissen' | 'werte' | 'krankheiten';

export function LexikonScreen({ progress }: { progress: Progress }) {
  const [tab, setTab] = useState<Tab>('werte');
  const L = useLayout();
  const cardW = L.desktop ? { width: '32.3%' as const } : L.wide ? { width: '48.9%' as const } : undefined;
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Nachschlagen" title="Lexikon" />
      <View style={styles.tabs}>
        <Segmented
          options={[
            { id: 'werte', label: 'Normwerte' },
            { id: 'krankheiten', label: `Krankheiten (${CASES.length})` },
            { id: 'wissen', label: 'Wissen' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.contentWide]}>
        {tab === 'wissen' &&
          BASICS.map((b) => (
            <Card key={b.id} style={cardW}>
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
            <Text style={[type.small, { width: '100%' }]}>
              Richtwerte für Erwachsene in Ruhe. Bei Kindern gelten andere Normalbereiche.
            </Text>
            <Card style={[{ borderLeftColor: colors.warngelb }, cardW]}>
              <Eyebrow title="Kinder" />
              <Text style={[type.h2, { marginTop: 2 }]}>Normwerte bei Kindern</Text>
              <Text style={[type.small, { marginTop: spacing.xs }]}>
                Je jünger, desto schneller schlagen Herz und Atmung – und desto niedriger ist der Blutdruck. SpO₂, Temperatur,
                Blutzucker und GCS wie bei Erwachsenen. Ab etwa 13 Jahren gelten die Erwachsenenwerte.
              </Text>
              {CHILD_NORMS.map((g) => (
                <View key={g.label} style={{ marginTop: spacing.sm }}>
                  <Text style={[type.body, { fontFamily: fonts.bold }]}>{g.label}</Text>
                  <Text style={type.small}>
                    Puls {g.limits.puls?.low}–{g.limits.puls?.high} /min · AF {g.limits.af?.low}–{g.limits.af?.high} /min · RR
                    syst. {g.limits.rr?.low}–{g.limits.rr?.high} mmHg
                  </Text>
                </View>
              ))}
            </Card>
            {VITALS.map((v) => (
              <Card key={v.id} style={cardW}>
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
                {v.id === 'gcs' && (
                  <Text style={type.small}>↓ jeder Wert unter 15 = Bewusstseinsstörung (≤ 8: Atemweg gefährdet)</Text>
                )}
              </Card>
            ))}
          </>
        ) : (
          CASES.map((c) => {
            const stars = progress.bestStars[c.id] ?? 0;
            return (
              <Card key={c.id} style={cardW}>
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
        <View style={{ width: '100%' }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  contentWide: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', padding: spacing.xl },
  tabs: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  tabEt: { fontFamily: fonts.regular, fontSize: 10, color: colors.grau500, letterSpacing: 1 },
  short: { fontFamily: fonts.extrabold, color: colors.graphit, letterSpacing: 1 },
});
