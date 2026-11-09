import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { zaehle } from '../analytics';
import { SimAktionen, TeamLeiste } from '../components/SimAktionen';
import { SimAuswertung } from '../components/SimAuswertung';
import { Quellen, SimMonitor } from '../components/SimMonitor';
import { SimSzene } from '../components/SimSzene';
import { Konfetti } from '../components/Konfetti';
import { Button, Tap } from '../components/UI';
import { SIM_SZENARIEN } from '../data/simulator';
import { AtemQuelle, EkgQuelle } from '../game/ekgLive';
import { aktionenFuer, FRAGEN_IDS, FRAGEN_TEXT, simAntwort } from '../game/simAktionen';
import { Auswertung, alarmStatus, bewerte, mmss, neuerEinsatz, SimState, SimSzenario, starteAktion, tick, AktionDef } from '../game/simulator';
import { setzeTon, spracheMoeglich, spieleTon, sprich, stoppe, tonAn } from '../game/sprache';
import { useLayout } from '../layout';
import { fonts } from '../theme';

const BG = '#07121A';
const P = { bg: '#0F222D', rand: '#1E3A49', text: '#E6F4F1', leise: '#8FB0B4', gruen: '#35F28F', rot: '#FF5A6A', gelb: '#FFC531', blau: '#4CD7FF' };

const klang = {
  gut: () => {
    spieleTon(660, 0.1, 0.04);
    spieleTon(880, 0.14, 0.04, 'sine', 0.09);
  },
  fehler: () => spieleTon(170, 0.28, 0.06, 'sawtooth'),
  alarm: () => {
    spieleTon(920, 0.12, 0.05, 'square');
    spieleTon(920, 0.12, 0.05, 'square', 0.18);
    spieleTon(920, 0.12, 0.05, 'square', 0.36);
  },
  schock: () => spieleTon(140, 0.35, 0.14, 'sawtooth', 0, 40),
  klick: () => spieleTon(1000, 0.035, 0.04, 'square'),
  los: () => spieleTon(520, 0.08, 0.04),
};

/** Patienten-Simulator: Ein Einsatz in Echtzeit mit Monitor, Geräten, Notarzt und Zeitdruck */
export function SimulatorScreen({
  bestSterne,
  onFinish,
  onBack,
}: {
  bestSterne: Record<string, number>;
  onFinish: (id: string, ep: number, sterne: number, uebergeben: boolean) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const [phase, setPhase] = useState<'wahl' | 'alarm' | 'sim' | 'ende'>('wahl');
  const [sz, setSz] = useState<SimSzenario | null>(null);
  const simRef = useRef<SimState | null>(null);
  const quellen = useRef<Quellen | null>(null);
  const [, setVersion] = useState(0);
  const [tempo, setTempo] = useState<1 | 2>(1);
  const [pause, setPause] = useState(false);
  const [toast, setToast] = useState<{ text: string; art: string; bis: number } | null>(null);
  const [aw, setAw] = useState<Auswertung | null>(null);
  const [abbruch, setAbbruch] = useState(false);
  const [anfahrt, setAnfahrt] = useState(0);
  const [ton, setTon] = useState(tonAn());
  const [alleLog, setAlleLog] = useState(false);
  const pauseRef = useRef(false);
  const tempoRef = useRef<1 | 2>(1);
  pauseRef.current = pause;
  tempoRef.current = tempo;
  const beendet = useRef(false);
  const defs = useMemo(() => (sz ? aktionenFuer(sz) : []), [sz]);

  const starte = (neu: SimSzenario) => {
    const seed = Math.floor(Math.random() * 1e9);
    simRef.current = neuerEinsatz(neu, seed);
    quellen.current = { ekg: new EkgQuelle(seed), atem: new AtemQuelle() };
    beendet.current = false;
    setSz(neu);
    setAw(null);
    setPause(false);
    setToast(null);
    setAbbruch(false);
    setAnfahrt(0);
    setAlleLog(false);
    setPhase('alarm');
    zaehle('sim-gestartet-' + neu.id);
  };

  // Anfahrt: kurzer Ladebalken
  useEffect(() => {
    if (phase !== 'alarm') return;
    const id = setInterval(() => setAnfahrt((a) => Math.min(1, a + 0.04)), 160);
    return () => clearInterval(id);
  }, [phase]);

  // Die Zeit läuft
  useEffect(() => {
    if (phase !== 'sim') return;
    let letzte = Date.now();
    let alarmLetzter = 0;
    let metroLetzter = -9;
    let blitzLetzter = -99;
    let logZaehler = simRef.current?.log.length ?? 0;
    const id = setInterval(() => {
      const jetzt = Date.now();
      const s = simRef.current;
      const q = quellen.current;
      if (!s || !q) return;
      let dt = (jetzt - letzte) / 1000;
      letzte = jetzt;
      if (!pauseRef.current && !s.ende) {
        dt = Math.min(dt, 0.5) * tempoRef.current;
        const n = Math.max(1, Math.ceil(dt / 0.25));
        for (let i = 0; i < n; i++) tick(s, dt / n);
        q.ekg.setze(s.rhythmus, s.kreislauf ? Math.max(20, s.w.hf) : s.rhythmus === 'pea' ? 40 : s.rhythmus === 'vt' ? 180 : 70);
        q.atem.af = s.kreislauf ? s.w.af : 0;
        q.atem.bvm = s.geraete.bvm;
        // neue Ereignisse: Hinweise, Töne, Sprache
        for (let i = logZaehler; i < s.log.length; i++) {
          const e = s.log[i];
          if (e.art !== 'info' && e.art !== 'system' && e.art !== 'patient') setToast({ text: e.text, art: e.art, bis: jetzt + 5200 });
          if (e.art === 'gut') klang.gut();
          else if (e.art === 'fehler') klang.fehler();
          else if (e.art === 'alarm') klang.alarm();
          if (e.art === 'patient' || e.art === 'arzt') sprich(e.text, { aufgeregt: e.art === 'patient' });
        }
        logZaehler = s.log.length;
        // Alarmton
        const al = alarmStatus(s);
        if (al.prio && s.t >= s.alarmStumm && jetzt - alarmLetzter > (al.prio === 'hoch' ? 1400 : 2600)) {
          alarmLetzter = jetzt;
          klang.alarm();
        }
        // Herzdruckmassage: Taktgeber
        if (s.cpr.an && !s.cpr.pause && !s.kreislauf && s.t - metroLetzter >= 60 / 110) {
          metroLetzter = s.t;
          klang.klick();
        }
        if (s.defi.blitz !== blitzLetzter) {
          blitzLetzter = s.defi.blitz;
          if (s.defi.blitz >= 0) klang.schock();
        }
      }
      if (s.ende && !beendet.current) {
        beendet.current = true;
        const a = bewerte(s);
        zaehle('sim-ende-' + s.sz.id + (a.art === 'tod' ? '-tod' : '-ueberg'));
        setTimeout(() => {
          setAw(a);
          setPhase('ende');
          onFinish(s.sz.id, a.ep, a.sterne, a.art === 'uebergabe');
        }, s.ende.art === 'tod' ? 2600 : 1400);
      }
      setVersion((v) => (v + 1) % 1e6);
    }, 200);
    return () => {
      clearInterval(id);
      stoppe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const sim = simRef.current;
  const toastJetzt = toast && Date.now() < toast.bis ? toast : null;

  const Kopf = ({ titel, rechts, links }: { titel: string; rechts?: React.ReactNode; links?: () => void }) => (
    <View style={styles.kopf}>
      <Tap onPress={links ?? onBack} accessibilityLabel={links ? 'Einsatz abbrechen' : 'Zurück'} style={styles.rund}>
        <Text style={styles.rundText}>{links ? '✕' : '‹'}</Text>
      </Tap>
      <Text style={styles.kopfTitel} numberOfLines={1}>
        {titel}
      </Text>
      {rechts}
    </View>
  );

  // ───────────── Auswahl ─────────────
  if (phase === 'wahl') {
    return (
      <View style={[styles.root]}>
        <Kopf titel="Patienten-Simulator" />
        <ScrollView contentContainerStyle={[styles.inhalt, L.wide && styles.breit]}>
          <View style={styles.karte}>
            <Text style={styles.h}>🫀 Ein echter Einsatz in Echtzeit</Text>
            <Text style={styles.text}>
              Du und dein Kollege kommen zum Patienten. Der Monitor zeigt EKG, Puls und Atmung live. Der Patient verändert sich laufend – und reagiert auf alles, was ihr tut: Sauerstoff, Lagerung, Zugang, Medikamente, Defibrillator und Wiederbelebung.
            </Text>
            <Text style={styles.klein}>Kein Hilfsmittel erklärt dir, was richtig ist. Am Ende bekommst du eine Auswertung mit Verlauf und Fehlern.</Text>
          </View>
          {SIM_SZENARIEN.map((x) => {
            const st = bestSterne[x.id] ?? 0;
            return (
              <Tap key={x.id} onPress={() => starte(x)} accessibilityLabel={`Szenario ${x.titel}`} style={styles.szenario}>
                <Text style={styles.szIcon}>{x.icon}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.szTitel}>{x.titel}</Text>
                  <Text style={styles.szText}>{x.kurz}</Text>
                  <Text style={styles.szMeta}>
                    {x.bereich} · {'●'.repeat(x.stufe)}
                    {'○'.repeat(3 - x.stufe)} · {st > 0 ? '⭐'.repeat(st) : 'noch nicht übergeben'}
                  </Text>
                </View>
                <Text style={styles.pfeil}>›</Text>
              </Tap>
            );
          })}
          <Tap
            onPress={() => starte(SIM_SZENARIEN[Math.floor(Math.random() * SIM_SZENARIEN.length)])}
            accessibilityLabel="Zufälliger Einsatz"
            style={[styles.szenario, { borderColor: P.gelb, justifyContent: 'center' }]}
          >
            <Text style={[styles.szTitel, { color: P.gelb }]}>🎲 Zufälliger Einsatz</Text>
          </Tap>
          <Text style={styles.klein}>
            Lernsimulation: Werte, Zeiten und Medikamente sind vereinfacht. Welche Medikamente der Rettungsdienst geben darf, ist je nach Bereich (SOP) verschieden. Die Inhalte wurden mit KI erstellt und sollten fachlich geprüft werden.
          </Text>
        </ScrollView>
      </View>
    );
  }

  if (!sz || !sim) return null;

  // ───────────── Alarmierung ─────────────
  if (phase === 'alarm') {
    const da = anfahrt >= 1;
    return (
      <View style={styles.root}>
        <Kopf titel="Alarmierung" links={() => setPhase('wahl')} />
        <ScrollView contentContainerStyle={[styles.inhalt, L.wide && styles.breit]}>
          <View style={[styles.karte, { borderColor: P.rot, borderWidth: 2 }]}>
            <Text style={[styles.klein, { color: P.rot, letterSpacing: 1.2, fontFamily: fonts.bold }]}>ALARM · {sz.alarm.stichwort.toUpperCase()}</Text>
            <Text style={[styles.h, { fontSize: 22 }]}>{sz.alarm.meldung}</Text>
            <Text style={[styles.text, { color: P.blau }]}>📍 {sz.alarm.ort}</Text>
            <View style={styles.balken}>
              <View style={[styles.fuell, { width: `${Math.round(anfahrt * 100)}%`, backgroundColor: da ? P.gruen : P.gelb }]} />
            </View>
            <Text style={styles.klein}>{da ? '✓ Einsatzstelle erreicht' : '🚑 Anfahrt mit Blaulicht …'}</Text>
          </View>
          {da && (
            <View style={styles.karte}>
              <Text style={styles.klein}>VOR ORT</Text>
              <Text style={styles.text}>{sz.szene}</Text>
            </View>
          )}
          <View style={styles.karte}>
            <Text style={styles.h}>So läuft es</Text>
            {[
              '👀 Erst hinsehen, dann messen. Ohne Monitor siehst du keine Werte: Pulsoxymeter und EKG anlegen!',
              '🧑‍🚒 Ihr seid zu zweit. Jede Maßnahme bindet eine oder beide Hände, bis sie fertig ist.',
              '📻 Den Notarzt früh nachfordern: Er braucht Zeit. Manche Medikamente darf nur er geben.',
              '⏱ Die Uhr läuft in Echtzeit. Pausieren oder ×2 geht oben rechts.',
              '🚑 Ziel: Patient stabilisieren, Klinik voranmelden, auf die Trage und los.',
            ].map((t) => (
              <Text key={t} style={styles.text}>
                {t}
              </Text>
            ))}
          </View>
          <Button
            label={da ? 'Los – zum Patienten!' : 'Überspringen'}
            variant="alarm"
            onPress={() => {
              klang.los();
              setPhase('sim');
            }}
          />
        </ScrollView>
      </View>
    );
  }

  // ───────────── Auswertung ─────────────
  if (phase === 'ende' && aw) {
    return (
      <View style={styles.root}>
        <Kopf titel="Auswertung" />
        {aw.sterne >= 3 && <Konfetti />}
        <ScrollView contentContainerStyle={[styles.inhalt, L.wide && styles.breit]}>
          <SimAuswertung sim={sim} a={aw} />
          <Button label="Noch einmal" onPress={() => starte(sz)} />
          <Button label="Anderes Szenario" variant="outline" onPress={() => setPhase('wahl')} />
          <Button label="Zurück zum Training" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  // ───────────── Einsatz läuft ─────────────
  const q = quellen.current!;
  const onStart = (d: AktionDef) => {
    if (pause) return setToast({ text: 'Der Einsatz ist pausiert.', art: 'info', bis: Date.now() + 2500 });
    const grund = starteAktion(sim, d);
    if (grund) setToast({ text: grund, art: 'info', bis: Date.now() + 3000 });
    else klang.klick();
    setVersion((v) => v + 1);
  };
  const gesprochen = new Set(sim.antworten.map((a) => a.frage));
  const gespraech = (
    <View style={{ gap: 8 }}>
      <Text style={styles.klein}>
        Jede Frage bindet eine Hand für 6 Sekunden. {sz.sprecher ? `${sz.sprecher} antwortet.` : 'Der Patient antwortet selbst – je schlechter es ihm geht, desto weniger sagt er.'} Wichtige Antworten sind mit 💡 markiert.
      </Text>
      <View style={styles.chips}>
        {FRAGEN_IDS.map((id) => {
          const d = defs.find((x) => x.id === 'frage-' + id)!;
          const schon = gesprochen.has(id);
          return (
            <Tap key={id} onPress={() => onStart(d)} disabled={schon} accessibilityLabel={`Frage: ${FRAGEN_TEXT[id]}`} style={[styles.frage, schon && styles.frageDone]}>
              <Text style={[styles.frageText, schon && { color: P.gruen }]}>{FRAGEN_TEXT[id]}</Text>
            </Tap>
          );
        })}
      </View>
      {sim.antworten.map((a) => {
        const r = simAntwort(sz, a.frage, a.zustand);
        return (
          <View key={a.frage} style={{ gap: 3 }}>
            <View style={styles.du}>
              <Text style={styles.duText}>{FRAGEN_TEXT[a.frage]}</Text>
            </View>
            <View style={[styles.pat, r.wichtig && { borderColor: P.gelb, backgroundColor: '#2A2410' }]}>
              <Text style={styles.sprecher}>{r.sprecher}</Text>
              <Text style={styles.patText}>„{r.text}“</Text>
            </View>
            {(r.wichtig || !!r.meta) && (
              <Text style={styles.klein}>
                {r.wichtig ? '💡 wichtige Antwort' : ''}
                {r.wichtig && r.meta ? ' · ' : ''}
                {r.meta}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );

  const log = [...sim.log].reverse().slice(0, alleLog ? 80 : 10);
  const oben = (
    <View style={{ gap: 8 }}>
      <SimMonitor
        sim={sim}
        quellen={q}
        onStumm={() => {
          sim.alarmStumm = sim.t + 60;
          setVersion((v) => v + 1);
        }}
        ton={(spo2) => spieleTon(520 + Math.max(0, spo2 - 70) * 9, 0.07, 0.05)}
      />
      <View style={L.wide ? undefined : { maxWidth: 520, width: '100%', alignSelf: 'center' }}>
        <SimSzene sim={sim} toast={toastJetzt} />
      </View>
    </View>
  );
  const unten = (
    <View style={{ gap: 12 }}>
      <TeamLeiste sim={sim} />
      <SimAktionen sim={sim} defs={defs} onStart={onStart} gespraech={gespraech} />
      <View style={styles.karte}>
        <Text style={styles.klein}>EINSATZPROTOKOLL</Text>
        {log.map((e, i) => (
          <Text key={sim.log.length - i} style={[styles.logZeile, { color: farbeFuer(e.art) }]}>
            <Text style={{ color: P.leise }}>{mmss(e.t)}  </Text>
            {e.text}
          </Text>
        ))}
        {sim.log.length > 10 && (
          <Tap onPress={() => setAlleLog(!alleLog)} accessibilityLabel="Protokoll umschalten">
            <Text style={[styles.klein, { color: P.blau }]}>{alleLog ? 'Weniger anzeigen' : 'Mehr anzeigen'}</Text>
          </Tap>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Kopf
        titel={sz.titel}
        links={() => setAbbruch(true)}
        rechts={
          <View style={styles.rechts}>
            <Text style={styles.uhr} accessibilityLabel={`Einsatzzeit ${mmss(sim.t)}`}>
              {mmss(sim.t)}
            </Text>
            <Tap onPress={() => setTempo(tempo === 1 ? 2 : 1)} accessibilityLabel={`Tempo ${tempo === 1 ? 'doppelt' : 'normal'}`} style={[styles.mini, tempo === 2 && { backgroundColor: '#1D4A5A', borderColor: P.blau }]}>
              <Text style={styles.miniText}>×{tempo}</Text>
            </Tap>
            <Tap onPress={() => setPause(!pause)} accessibilityLabel={pause ? 'Weiter' : 'Pause'} style={[styles.mini, pause && { backgroundColor: '#5A4A14', borderColor: P.gelb }]}>
              <Text style={styles.miniText}>{pause ? '▶' : '⏸'}</Text>
            </Tap>
            {spracheMoeglich() && (
              <Tap
                onPress={() => {
                  setzeTon(!ton);
                  setTon(!ton);
                }}
                accessibilityLabel={ton ? 'Ton ausschalten' : 'Ton einschalten'}
                style={[styles.mini, ton && { backgroundColor: '#14402F', borderColor: P.gruen }]}
              >
                <Text style={styles.miniText}>{ton ? '🔊' : '🔈'}</Text>
              </Tap>
            )}
          </View>
        }
      />
      {abbruch && (
        <View style={styles.abbruch}>
          <Text style={styles.text}>Einsatz wirklich abbrechen? Das zählt nicht.</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tap onPress={() => setAbbruch(false)} accessibilityLabel="Weiter spielen" style={[styles.mini, { paddingHorizontal: 14 }]}>
              <Text style={styles.miniText}>Weiter spielen</Text>
            </Tap>
            <Tap
              onPress={() => {
                setAbbruch(false);
                setPhase('wahl');
              }}
              accessibilityLabel="Einsatz abbrechen bestätigen"
              style={[styles.mini, { paddingHorizontal: 14, backgroundColor: '#5A1A22', borderColor: P.rot }]}
            >
              <Text style={styles.miniText}>Abbrechen</Text>
            </Tap>
          </View>
        </View>
      )}
      {L.wide ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: '46%', padding: 12 }}>{oben}</View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 60 }}>
            {unten}
          </ScrollView>
        </View>
      ) : (
        <>
          <View style={{ paddingHorizontal: 12, paddingBottom: 6 }}>{oben}</View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 60 }}>
            {unten}
          </ScrollView>
        </>
      )}
      {pause && (
        <View style={styles.pause} pointerEvents="none">
          <Text style={styles.pauseText}>⏸ Pausiert</Text>
        </View>
      )}
      {sim.ende && (
        <View style={styles.pause} pointerEvents="none">
          <Text style={styles.pauseText}>{sim.ende.art === 'tod' ? '🕯️ Der Patient ist verstorben' : '🚑 Abfahrt – Übergabe in der Klinik'}</Text>
        </View>
      )}
    </View>
  );
}

const farbeFuer = (art: string) =>
  art === 'gut' ? '#7FF0B8' : art === 'fehler' ? '#FF9AA4' : art === 'alarm' ? '#FFB36B' : art === 'arzt' ? '#9FD2FF' : art === 'patient' ? '#F2E6A8' : '#C7DCDD';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  rund: { width: 38, height: 38, borderRadius: 19, backgroundColor: P.bg, borderWidth: 1, borderColor: P.rand, alignItems: 'center', justifyContent: 'center' },
  rundText: { fontFamily: fonts.displayBlack, fontSize: 24, color: P.text, lineHeight: 28 },
  kopfTitel: { flex: 1, fontFamily: fonts.displayBlack, fontSize: 17, letterSpacing: -0.3, color: P.text },
  rechts: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  uhr: { fontFamily: fonts.displayBlack, fontSize: 21, letterSpacing: 0.5, color: P.gelb, minWidth: 52, textAlign: 'right' },
  mini: { minWidth: 38, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: P.rand, backgroundColor: P.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  miniText: { fontFamily: fonts.bold, fontSize: 13, color: P.text },
  inhalt: { padding: 14, gap: 12, paddingBottom: 60 },
  breit: { maxWidth: 760, width: '100%', alignSelf: 'center' },
  karte: { backgroundColor: P.bg, borderRadius: 18, borderWidth: 1, borderColor: P.rand, padding: 14, gap: 6 },
  h: { fontFamily: fonts.displayBlack, fontSize: 17, letterSpacing: -0.3, color: P.text },
  text: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21, color: P.text },
  klein: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 16, color: P.leise },
  szenario: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: P.bg, borderRadius: 18, borderWidth: 1.5, borderColor: P.rand, padding: 14 },
  szIcon: { fontSize: 34 },
  szTitel: { fontFamily: fonts.displayBlack, fontSize: 16, letterSpacing: -0.2, color: P.text },
  szText: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: P.leise },
  szMeta: { fontFamily: fonts.bold, fontSize: 11.5, color: P.blau, marginTop: 2 },
  pfeil: { fontFamily: fonts.displayBlack, fontSize: 26, color: P.blau },
  balken: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: 4 },
  fuell: { height: '100%', borderRadius: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  frage: { borderRadius: 999, borderWidth: 1.5, borderColor: P.blau, backgroundColor: P.bg, paddingHorizontal: 12, paddingVertical: 7 },
  frageDone: { backgroundColor: '#14402F', borderColor: '#14402F' },
  frageText: { fontFamily: fonts.bold, fontSize: 13, color: P.blau },
  du: { alignSelf: 'flex-end', backgroundColor: '#1D6A57', borderRadius: 16, borderBottomRightRadius: 4, paddingHorizontal: 12, paddingVertical: 6, maxWidth: '80%' },
  duText: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  pat: { alignSelf: 'flex-start', backgroundColor: '#14303C', borderWidth: 1, borderColor: P.rand, borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 12, paddingVertical: 8, maxWidth: '94%', gap: 2 },
  sprecher: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.6, color: P.leise, textTransform: 'uppercase' },
  patText: { fontFamily: fonts.medium, fontSize: 14.5, lineHeight: 20, color: P.text },
  logZeile: { fontFamily: fonts.medium, fontSize: 12.5, lineHeight: 18 },
  abbruch: { marginHorizontal: 12, marginBottom: 6, backgroundColor: '#2A1418', borderRadius: 14, borderWidth: 1, borderColor: P.rot, padding: 10, gap: 8 },
  pause: { position: 'absolute', left: 0, right: 0, top: '38%', alignItems: 'center' },
  pauseText: { fontFamily: fonts.displayBlack, fontSize: 26, color: '#fff', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 18, overflow: 'hidden' },
});
