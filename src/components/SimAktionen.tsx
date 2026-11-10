import { ReactNode, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AktionDef, Gruppe, KLINIKEN, KlinikId, mmss, moeglich, SimState } from '../game/simulator';
import { GRUPPEN } from '../game/simAktionen';
import { fonts } from '../theme';
import { Tap } from './UI';

const PANEL = { bg: '#0F222D', rand: '#1E3A49', text: '#E6F4F1', leise: '#7FA0A8', gruen: '#35F28F', gelb: '#FFC531', rot: '#FF5A6A', blau: '#4CD7FF' };

/** Kurze Beschriftungen für die kleinen Kacheln */
const KURZ: Record<string, string> = {
  eindruck: 'Hinsehen (ABCDE)',
  spo2: 'Pulsoxymeter',
  ekg: 'EKG-Monitor',
  nibp: 'Blutdruck',
  bz: 'Blutzucker',
  temp: 'Temperatur',
  afzaehlen: 'Atemfrequenz',
  ekg12: '12-Kanal-EKG',
  lunge: 'Lunge abhören',
  neuro: 'Neurostatus',
  absaugen: 'Absaugen',
  guedel: 'Guedel-Tubus',
  bvm: 'Beutelbeatmung',
  zugang: 'i.v. Zugang',
  infusion: 'Infusion',
  druckverband: 'Druckverband',
  tourniquet: 'Tourniquet',
  waerme: 'Wärmeerhalt',
  pads: 'Defi-Pads',
  analyse: 'Analysieren',
  schock: 'Schock',
  'hlw-an': 'HLW starten',
  'hlw-aus': 'HLW beenden',
  'hlw-wechsel': 'Helfer wechseln',
  pulscheck: 'Puls prüfen',
  'notarzt-rufen': 'Notarzt rufen',
  trage: 'Auf die Trage',
  abfahrt: 'Abfahrt',
  'adrenalin-im': 'Adrenalin i.m.',
  salbutamol: 'Salbutamol',
  'glukose-oral': 'Traubenzucker',
  'glukose-iv': 'Glukose i.v.',
  asa: 'ASS',
  nitro: 'Nitro-Spray',
  fentanyl: 'Fentanyl',
  furosemid: 'Furosemid',
  prednisolon: 'Prednisolon',
  tranexam: 'Tranexamsäure',
  'adrenalin-iv': 'Adrenalin i.v.',
  amiodaron: 'Amiodaron',
  atropin: 'Atropin',
  midazolam: 'Midazolam',
  naloxon: 'Naloxon',
  heparin: 'Heparin',
  magnesium: 'Magnesium',
  'adrenalin-inhal': 'Adrenalin inhalativ',
  schrittmacher: 'Schrittmacher',
};
const kurz = (d: AktionDef) => KURZ[d.id] ?? d.titel;

const LAGE: Record<string, string> = { sitzend: 'Sitzen', oberkoerper: 'Oberkörper hoch', flach: 'Flach', beinehoch: 'Beine hoch', seitenlage: 'Seitenlage' };
const O2: Record<string, string> = { aus: 'Aus', nasenbrille: 'Nasenbrille', maske: 'Maske', reservoir: 'Reservoir' };

/** Die zwei Hände des Teams und was als Nächstes dran ist */
export function TeamLeiste({ sim }: { sim: SimState }) {
  const lanes: (SimState['laufend'][number] | null)[] = [null, null];
  let i = 0;
  for (const l of sim.laufend) {
    for (let h = 0; h < l.haende && i < 2; h++) lanes[i++] = l;
  }
  const arzt = sim.laufend.filter((l) => l.haende === 0);
  return (
    <View style={{ gap: 5 }}>
      <View style={styles.team}>
        {lanes.map((l, n) => {
          const f = l ? Math.min(1, (sim.t - l.start) / Math.max(1, l.ende - l.start)) : 0;
          return (
            <View key={n} style={[styles.hand, l && { borderColor: PANEL.gelb }]}>
              <Text style={styles.handKopf}>{n === 0 ? 'Du' : 'Kollege'}</Text>
              {l ? (
                <>
                  <Text style={styles.handText} numberOfLines={1}>
                    {l.icon} {l.titel}
                  </Text>
                  <View style={styles.balken}>
                    <View style={[styles.fuell, { width: `${Math.round(f * 100)}%` }]} />
                  </View>
                </>
              ) : (
                <Text style={[styles.handText, { color: PANEL.gruen }]}>✓ frei</Text>
              )}
            </View>
          );
        })}
      </View>
      {sim.warteschlange.length > 0 && (
        <Text style={styles.schlange} numberOfLines={2}>
          ⏳ Als Nächstes: {sim.warteschlange.map((d) => kurz(d)).join(' → ')}
        </Text>
      )}
      {arzt.map((l) => (
        <Text key={l.id} style={styles.arzt}>
          🧑‍⚕️ Notarzt: {l.icon} {kurz(l.def)} … {Math.max(0, Math.ceil(l.ende - sim.t))} s
        </Text>
      ))}
    </View>
  );
}

/** Hinweisleiste: sagt in einem Satz, was gerade passiert ist oder warum etwas nicht geht */
export function HinweisLeiste({ hinweis }: { hinweis: { text: string; art: 'ok' | 'nein' | 'info' } | null }) {
  const f = hinweis?.art === 'nein' ? PANEL.rot : hinweis?.art === 'ok' ? PANEL.gruen : PANEL.blau;
  return (
    <View style={[styles.hinweis, { borderColor: hinweis ? f : PANEL.rand, backgroundColor: hinweis ? (hinweis.art === 'nein' ? '#2A1418' : '#10261F') : PANEL.bg }]}>
      <Text style={[styles.hinweisText, { color: hinweis ? PANEL.text : PANEL.leise }]} numberOfLines={3}>
        {hinweis ? `${hinweis.art === 'nein' ? '⛔ ' : hinweis.art === 'ok' ? '✓ ' : 'ℹ '}${hinweis.text}` : 'Tippe eine Maßnahme an. Sind beide Hände belegt, wird sie vorgemerkt.'}
      </Text>
    </View>
  );
}

/** Maßnahmen, nach Bereichen sortiert */
export function SimAktionen({ sim, defs, onStart, gespraech }: { sim: SimState; defs: AktionDef[]; onStart: (d: AktionDef) => void; gespraech?: ReactNode }) {
  const [tab, setTab] = useState<Gruppe | 'gespraech'>('messen');
  const liste = defs.filter((d) => d.gruppe === tab && !d.id.startsWith('frage-') && (d.zeige?.(sim) ?? true));
  const lagen = liste.filter((d) => d.id.startsWith('lage-'));
  const sauer = liste.filter((d) => d.id.startsWith('o2-'));
  const klin = liste.filter((d) => d.id.startsWith('klinik-'));
  const einzeln = liste.filter((d) => !d.id.startsWith('lage-') && !d.id.startsWith('o2-') && !d.id.startsWith('klinik-'));
  const sop = einzeln.filter((d) => d.tag === 'SOP');
  const arzt = einzeln.filter((d) => d.tag === 'Notarzt');
  const rest = einzeln.filter((d) => d.tag !== 'SOP' && d.tag !== 'Notarzt');
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.tabs}>
        {[...GRUPPEN, ...(gespraech ? [{ id: 'gespraech' as const, titel: 'Gespräch', icon: '💬' }] : [])].map((g) => {
          const an = g.id === tab;
          const warn = g.id === 'defi' && !sim.kreislauf && !sim.cpr.an;
          return (
            <Tap
              key={g.id}
              onPress={() => setTab(g.id as Gruppe | 'gespraech')}
              accessibilityLabel={`Bereich ${g.titel}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: an }}
              style={[styles.tab, an && { backgroundColor: '#1D4A5A', borderColor: PANEL.blau }]}
            >
              <Text style={styles.tabIcon}>{g.icon}</Text>
              <Text style={[styles.tabText, an && { color: '#fff' }]} numberOfLines={1}>
                {g.titel}
              </Text>
              {(warn || (g.id === 'meds' && sim.notarzt.da)) && <View style={[styles.punkt, { backgroundColor: warn ? PANEL.rot : PANEL.gruen }]} />}
            </Tap>
          );
        })}
      </View>
      {tab === 'gespraech' && gespraech}
      {tab !== 'gespraech' && (
        <>
          {rest.length > 0 && (
            <View style={styles.grid}>
              {rest.map((d) => (
                <Tile key={d.id} sim={sim} d={d} onStart={onStart} />
              ))}
            </View>
          )}
          {lagen.length > 0 && <Reihe titel="Lagerung" liste={lagen} sim={sim} onStart={onStart} text={(d) => LAGE[d.id.slice(5)] ?? d.titel} />}
          {sauer.length > 0 && <Reihe titel="Sauerstoff" liste={sauer} sim={sim} onStart={onStart} text={(d) => O2[d.id.slice(3)] ?? d.titel} />}
          {klin.length > 0 && <Reihe titel="Klinik voranmelden" liste={klin} sim={sim} onStart={onStart} text={(d) => `${KLINIKEN[d.id.slice(7) as KlinikId].icon} ${KLINIKEN[d.id.slice(7) as KlinikId].kurz}`} />}
          {tab === 'meds' && <Text style={styles.klein}>„SOP“ darf der Rettungsdienst je nach Bereich in Notkompetenz geben. „Notarzt“ gibt er nur selbst: Du schlägst vor, er entscheidet.</Text>}
          {sop.length > 0 && <Abschnitt titel="SOP (Notkompetenz)" liste={sop} sim={sim} onStart={onStart} />}
          {arzt.length > 0 && <Abschnitt titel="Nur der Notarzt" liste={arzt} sim={sim} onStart={onStart} />}
        </>
      )}
    </View>
  );
}

function Abschnitt({ titel, liste, sim, onStart }: { titel: string; liste: AktionDef[]; sim: SimState; onStart: (d: AktionDef) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.abschnitt}>{titel}</Text>
      <View style={styles.grid}>
        {liste.map((d) => (
          <Tile key={d.id} sim={sim} d={d} onStart={onStart} />
        ))}
      </View>
    </View>
  );
}

/** Eine Auswahl-Reihe (z. B. Lagerung): genau eine Möglichkeit leuchtet */
function Reihe({ titel, liste, sim, onStart, text }: { titel: string; liste: AktionDef[]; sim: SimState; onStart: (d: AktionDef) => void; text: (d: AktionDef) => string }) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={styles.abschnitt}>{titel}</Text>
      <View style={styles.reihe}>
        {liste.map((d) => {
          const an = d.aktiv?.(sim);
          const laeuft = sim.laufend.some((l) => l.id === d.id);
          const vorgemerkt = sim.warteschlange.some((w) => w.id === d.id);
          return (
            <Tap
              key={d.id}
              onPress={() => onStart(d)}
              accessibilityLabel={d.titel}
              style={[styles.chip, an && { backgroundColor: '#14402F', borderColor: PANEL.gruen }, (laeuft || vorgemerkt) && { borderColor: PANEL.gelb }]}
            >
              <Text style={[styles.chipText, an && { color: PANEL.gruen }]} numberOfLines={1}>
                {laeuft ? '… ' : vorgemerkt ? '⏳ ' : an ? '● ' : ''}
                {text(d)}
              </Text>
            </Tap>
          );
        })}
      </View>
    </View>
  );
}

function Tile({ sim, d, onStart }: { sim: SimState; d: AktionDef; onStart: (d: AktionDef) => void }) {
  const grund = moeglich(sim, d);
  const laeuft = sim.laufend.find((l) => l.id === d.id);
  const vorgemerkt = sim.warteschlange.some((w) => w.id === d.id);
  const an = d.aktiv?.(sim);
  const f = laeuft ? Math.min(1, (sim.t - laeuft.start) / Math.max(1, laeuft.ende - laeuft.start)) : 0;
  const gesperrt = !!grund && !laeuft && !vorgemerkt && grund !== 'Beide Hände sind beschäftigt.' && !an;
  return (
    <Tap
      onPress={() => onStart(d)}
      accessibilityLabel={d.titel}
      style={[styles.kachel, an && { borderColor: PANEL.gruen }, (laeuft || vorgemerkt) && { borderColor: PANEL.gelb }, gesperrt && { opacity: 0.5 }]}
    >
      <Text style={styles.icon}>{d.icon}</Text>
      <Text style={styles.titel} numberOfLines={2}>
        {kurz(d)}
      </Text>
      <Text style={[styles.sub, an && { color: PANEL.gruen }]} numberOfLines={1}>
        {laeuft ? `${Math.max(0, Math.ceil(laeuft.ende - sim.t))} s …` : vorgemerkt ? '⏳ vorgemerkt' : gesperrt ? '🔒' : an ? '● an' : `⏱ ${d.dauer < 60 ? `${d.dauer} s` : mmss(d.dauer)}${d.haende === 2 ? ' · 2×' : ''}`}
      </Text>
      {!!laeuft && (
        <View style={[styles.balken, { position: 'absolute', left: 8, right: 8, bottom: 6 }]}>
          <View style={[styles.fuell, { width: `${Math.round(f * 100)}%` }]} />
        </View>
      )}
    </Tap>
  );
}

const styles = StyleSheet.create({
  team: { flexDirection: 'row', gap: 6 },
  hand: { flex: 1, backgroundColor: PANEL.bg, borderRadius: 12, borderWidth: 1.5, borderColor: PANEL.rand, paddingHorizontal: 9, paddingVertical: 6, gap: 2 },
  handKopf: { fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 0.5, color: PANEL.leise, textTransform: 'uppercase' },
  handText: { fontFamily: fonts.semibold, fontSize: 12, color: PANEL.text },
  balken: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  fuell: { height: '100%', backgroundColor: PANEL.gelb },
  schlange: { fontFamily: fonts.semibold, fontSize: 11.5, color: PANEL.gelb },
  arzt: { fontFamily: fonts.semibold, fontSize: 12, color: '#9FD2FF', backgroundColor: '#14283A', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  hinweis: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 11, paddingVertical: 8, minHeight: 38, justifyContent: 'center' },
  hinweisText: { fontFamily: fonts.semibold, fontSize: 12.5, lineHeight: 17 },
  tabs: { flexDirection: 'row', gap: 4 },
  tab: { flex: 1, alignItems: 'center', gap: 1, borderRadius: 12, borderWidth: 1.5, borderColor: PANEL.rand, backgroundColor: PANEL.bg, paddingVertical: 6, paddingHorizontal: 1 },
  tabIcon: { fontSize: 17, lineHeight: 21 },
  tabText: { fontFamily: fonts.bold, fontSize: 9.5, color: PANEL.leise },
  punkt: { position: 'absolute', top: 4, right: 5, width: 7, height: 7, borderRadius: 4 },
  abschnitt: { fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 0.6, color: PANEL.leise, textTransform: 'uppercase' },
  klein: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 15, color: PANEL.leise },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  kachel: { width: '31.9%', backgroundColor: PANEL.bg, borderRadius: 13, borderWidth: 1.5, borderColor: PANEL.rand, paddingHorizontal: 6, paddingTop: 8, paddingBottom: 10, alignItems: 'center', gap: 2, minHeight: 86 },
  icon: { fontSize: 22, lineHeight: 27 },
  titel: { fontFamily: fonts.bold, fontSize: 11.5, lineHeight: 14, color: PANEL.text, textAlign: 'center' },
  sub: { fontFamily: fonts.medium, fontSize: 10, color: PANEL.leise },
  reihe: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 999, borderWidth: 1.5, borderColor: PANEL.rand, backgroundColor: PANEL.bg, paddingHorizontal: 11, paddingVertical: 8 },
  chipText: { fontFamily: fonts.bold, fontSize: 12, color: PANEL.text },
});
