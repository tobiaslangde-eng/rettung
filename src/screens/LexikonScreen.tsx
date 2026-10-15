import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Pill, Segmented, Tap, TopBar } from '../components/UI';
import { BASICS } from '../data/basics';
import { HELFER_LEXIKON } from '../data/helferLexikon';
import { LexikonTab } from '../data/helferTraining';
import { useRolle } from '../game/rolle';
import { CASES } from '../data/cases';
import { CHILD_NORMS, VITALS } from '../data/vitals';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, spacing, type, fonts } from '../theme';

type Tab = 'wissen' | 'werte' | 'krankheiten';

function HelferLexikon() {
  const L = useLayout();
  const r = useRolle();
  const [tab, setTab] = useState<LexikonTab>('handeln');
  const [offen, setOffen] = useState<string | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Nachschlagen" title="Erste-Hilfe-Lexikon" />
      <View style={styles.tabs}>
        <Segmented
          options={[
            { id: 'handeln', label: 'Handeln' },
            { id: 'erkennen', label: 'Erkennen' },
            { id: 'wissen', label: 'Wissen' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <ScrollView contentContainerStyle={[styles.content, L.wide && { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' }]}>
        {HELFER_LEXIKON.filter((e) => e.tab === tab).map((e) => {
          const auf = offen === e.id;
          return (
            <Tap key={e.id} onPress={() => setOffen(auf ? null : e.id)} accessibilityLabel={e.titel} style={styles.lexCard}>
              <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontFamily: fonts.regular }}>{e.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={type.headline}>{e.titel}</Text>
                  <Text style={type.small}>{e.kurz}</Text>
                </View>
                <Text style={{ color: r.akzent, fontSize: 18 }}>{auf ? '–' : '+'}</Text>
              </View>
              {auf && (
                <View style={{ gap: 4, marginTop: spacing.sm }}>
                  {e.punkte.map((pt) => (
                    <Text key={pt} style={type.body}>
                      • {pt}
                    </Text>
                  ))}
                  {e.merke ? (
                    <Text style={[type.body, { marginTop: 6, fontFamily: fonts.semibold, color: r.akzentDunkel }]}>Merke: {e.merke}</Text>
                  ) : null}
                </View>
              )}
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function LexikonScreen({ progress }: { progress: Progress }) {
  const rolle = useRolle();
  if (rolle.id === 'helfer') return <HelferLexikon />;
  return <SaniLexikon progress={progress} />;
}

function SaniLexikon({ progress }: { progress: Progress }) {
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
            { id: 'krankheiten', label: 'Krankheiten' },
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
              <Pill label="RETTUNGSWISSEN" color={colors.sky} />
              <Text style={[type.h2, { marginTop: spacing.sm }]}>{b.title}</Text>
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
            <Card style={[{ borderLeftColor: colors.yellow }, cardW]}>
              <Pill label="KINDER" color={colors.pinkTint} />
              <Text style={[type.h2, { marginTop: spacing.sm }]}>Normwerte bei Kindern</Text>
              <Text style={[type.small, { marginTop: spacing.xs }]}>
                Je jünger, desto schneller schlagen Herz und Atmung – und desto niedriger ist der Blutdruck. SpO₂, Temperatur,
                Blutzucker und GCS wie bei Erwachsenen. Ab etwa 13 Jahren gelten die Erwachsenenwerte.
              </Text>
              {CHILD_NORMS.map((g) => (
                <View key={g.label} style={{ marginTop: spacing.sm }}>
                  <Text style={type.headline}>{g.label}</Text>
                  <Text style={type.small}>
                    Puls {g.limits.puls?.low}–{g.limits.puls?.high} /min · AF {g.limits.af?.low}–{g.limits.af?.high} /min · RR
                    syst. {g.limits.rr?.low}–{g.limits.rr?.high} mmHg
                  </Text>
                </View>
              ))}
            </Card>
            {VITALS.map((v) => (
              <Card key={v.id} style={cardW}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Pill label="VITALWERT" color={colors.yellow} />
                  <Text style={styles.short}>{v.short}</Text>
                </View>
                <Text style={[type.h2, { marginTop: spacing.sm }]}>{v.name}</Text>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Pill label="KRANKHEITSBILD" color={colors.mintTint} />
                  <Pill label={'★'.repeat(stars) + '☆'.repeat(3 - stars)} color={stars > 0 ? colors.yellow : colors.white} />
                </View>
                <Text style={[type.h2, { marginTop: spacing.sm }]}>{c.diagnosis}</Text>
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
  lexCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: spacing.lg },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl + 8 },
  contentWide: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', padding: spacing.xl },
  tabs: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.md },
  short: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.ink, letterSpacing: -0.3 },
});
