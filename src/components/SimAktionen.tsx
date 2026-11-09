import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AktionDef, Gruppe, mmss, moeglich, SimState } from '../game/simulator';
import { GRUPPEN } from '../game/simAktionen';
import { fonts } from '../theme';
import { Tap } from './UI';

const PANEL = { bg: '#0F222D', rand: '#1E3A49', text: '#E6F4F1', leise: '#7FA0A8', gruen: '#35F28F', gelb: '#FFC531', rot: '#FF5A6A' };

/** Die zwei Hände des Teams: Jede Maßnahme bindet eine oder beide Hände, bis sie fertig ist */
export function TeamLeiste({ sim }: { sim: SimState }) {
  const lanes: (SimState['laufend'][number] | null)[] = [null, null];
  let i = 0;
  for (const l of sim.laufend) {
    for (let h = 0; h < l.haende && i < 2; h++) lanes[i++] = l;
  }
  const arzt = sim.laufend.filter((l) => l.haende === 0);
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.team}>
        {lanes.map((l, n) => {
          const f = l ? Math.min(1, (sim.t - l.start) / Math.max(1, l.ende - l.start)) : 0;
          const zwei = l && l.haende === 2;
          return (
            <View key={n} style={[styles.hand, l && { borderColor: PANEL.gelb }]}>
              <Text style={styles.handKopf}>{n === 0 ? '🧑‍🚒 Du' : '🧑‍🚒 Kollege'}</Text>
              {l ? (
                <>
                  <Text style={styles.handText} numberOfLines={1}>
                    {l.icon} {l.titel}
                    {zwei ? ' (beide)' : ''}
                  </Text>
                  <View style={styles.balken}>
                    <View style={[styles.fuell, { width: `${Math.round(f * 100)}%` }]} />
                  </View>
                  <Text style={styles.handZeit}>noch {Math.max(0, Math.ceil(l.ende - sim.t))} s</Text>
                </>
              ) : (
                <Text style={[styles.handText, { color: PANEL.gruen }]}>✓ frei</Text>
              )}
            </View>
          );
        })}
      </View>
      {arzt.map((l) => (
        <Text key={l.id} style={styles.arzt}>
          🧑‍⚕️ Notarzt: {l.icon} {l.titel} … noch {Math.max(0, Math.ceil(l.ende - sim.t))} s
        </Text>
      ))}
    </View>
  );
}

/** Maßnahmen, nach Bereichen sortiert. Gesperrte Maßnahmen sagen, was noch fehlt. */
export function SimAktionen({ sim, defs, onStart, gespraech }: { sim: SimState; defs: AktionDef[]; onStart: (d: AktionDef) => void; gespraech?: ReactNode }) {
  const [tab, setTab] = useState<Gruppe | 'gespraech'>('messen');
  const liste = defs.filter((d) => d.gruppe === tab && !d.id.startsWith('frage-') && (d.zeige?.(sim) ?? true));
  const sop = liste.filter((d) => d.tag === 'SOP');
  const arzt = liste.filter((d) => d.tag === 'Notarzt');
  const rest = liste.filter((d) => d.tag !== 'SOP' && d.tag !== 'Notarzt');
  return (
    <View style={{ gap: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {GRUPPEN.map((g) => {
          const an = g.id === tab;
          const rot = g.id === 'defi' && !sim.kreislauf && !sim.cpr.an;
          return (
            <Tap
              key={g.id}
              onPress={() => setTab(g.id)}
              accessibilityLabel={`Bereich ${g.titel}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: an }}
              style={[styles.tab, an && { backgroundColor: '#1D4A5A', borderColor: '#4CD7FF' }]}
            >
              <Text style={styles.tabText}>
                {g.icon} {g.titel}
                {rot ? ' ❗' : g.id === 'meds' && sim.notarzt.da ? ' ●' : ''}
              </Text>
            </Tap>
          );
        })}
        {gespraech && (
          <Tap
            onPress={() => setTab('gespraech')}
            accessibilityLabel="Bereich Gespräch"
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'gespraech' }}
            style={[styles.tab, tab === 'gespraech' && { backgroundColor: '#1D4A5A', borderColor: '#4CD7FF' }]}
          >
            <Text style={styles.tabText}>💬 Gespräch</Text>
          </Tap>
        )}
      </ScrollView>
      {tab === 'gespraech' && gespraech}
      {tab === 'meds' && (
        <Text style={styles.hinweis}>
          „SOP“: darf der Rettungsdienst nach Notkompetenz geben (je nach Bereich unterschiedlich). „Notarzt“: nur auf Anordnung, du schlägst vor und der Arzt gibt es – wenn es passt.
        </Text>
      )}
      {[
        { t: '', l: rest },
        { t: 'Notkompetenz / SOP', l: sop },
        { t: 'Auf Anordnung des Notarztes', l: arzt },
      ].map(
        (b) =>
          b.l.length > 0 && (
            <View key={b.t || 'x'} style={{ gap: 6 }}>
              {!!b.t && <Text style={styles.abschnitt}>{b.t}</Text>}
              <View style={styles.grid}>
                {b.l.map((d) => (
                  <Tile key={d.id} sim={sim} d={d} onStart={onStart} />
                ))}
              </View>
            </View>
          ),
      )}
    </View>
  );
}

function Tile({ sim, d, onStart }: { sim: SimState; d: AktionDef; onStart: (d: AktionDef) => void }) {
  const grund = moeglich(sim, d);
  const laeuft = sim.laufend.find((l) => l.id === d.id);
  const an = d.aktiv?.(sim);
  const f = laeuft ? Math.min(1, (sim.t - laeuft.start) / Math.max(1, laeuft.ende - laeuft.start)) : 0;
  return (
    <Tap
      onPress={() => onStart(d)}
      accessibilityLabel={d.titel}
      style={[styles.kachel, an && { borderColor: PANEL.gruen }, laeuft && { borderColor: PANEL.gelb }, !!grund && !laeuft && { opacity: 0.55 }]}
    >
      <View style={styles.kopf}>
        <Text style={styles.icon}>{d.icon}</Text>
        <Text style={styles.titel} numberOfLines={2}>
          {d.titel}
        </Text>
      </View>
      <Text style={[styles.sub, grund && !laeuft && !an ? { color: PANEL.rot } : null]} numberOfLines={2}>
        {laeuft ? `läuft … ${Math.max(0, Math.ceil(laeuft.ende - sim.t))} s` : grund ? grund : `${an ? '● an · ' : ''}⏱ ${d.dauer < 60 ? `${d.dauer} s` : mmss(d.dauer)}${d.haende === 2 ? ' · 2 Hände' : d.haende === 0 ? ' · Arzt' : ''}`}
      </Text>
      {!!laeuft && (
        <View style={styles.balken}>
          <View style={[styles.fuell, { width: `${Math.round(f * 100)}%` }]} />
        </View>
      )}
    </Tap>
  );
}

const styles = StyleSheet.create({
  team: { flexDirection: 'row', gap: 8 },
  hand: { flex: 1, backgroundColor: PANEL.bg, borderRadius: 14, borderWidth: 1.5, borderColor: PANEL.rand, padding: 8, gap: 3 },
  handKopf: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.5, color: PANEL.leise, textTransform: 'uppercase' },
  handText: { fontFamily: fonts.semibold, fontSize: 12.5, color: PANEL.text },
  handZeit: { fontFamily: fonts.medium, fontSize: 10.5, color: PANEL.leise },
  balken: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: 2 },
  fuell: { height: '100%', backgroundColor: PANEL.gelb },
  arzt: { fontFamily: fonts.semibold, fontSize: 12, color: '#9FD2FF', backgroundColor: '#14283A', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  tab: { borderRadius: 999, borderWidth: 1.5, borderColor: PANEL.rand, backgroundColor: PANEL.bg, paddingHorizontal: 12, paddingVertical: 7 },
  tabText: { fontFamily: fonts.bold, fontSize: 13, color: PANEL.text },
  hinweis: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 16, color: PANEL.leise },
  abschnitt: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.6, color: PANEL.leise, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kachel: { width: '48.5%', backgroundColor: PANEL.bg, borderRadius: 14, borderWidth: 1.5, borderColor: PANEL.rand, padding: 10, gap: 5, minHeight: 84 },
  kopf: { flexDirection: 'row', gap: 7, alignItems: 'flex-start' },
  icon: { fontSize: 20, lineHeight: 24 },
  titel: { flex: 1, fontFamily: fonts.bold, fontSize: 12.5, lineHeight: 16, color: PANEL.text },
  sub: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: PANEL.leise },
});
