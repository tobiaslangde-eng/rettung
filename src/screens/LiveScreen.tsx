import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zaehle } from '../analytics';
import { AnswerOption } from '../components/Training';
import { Bar, Button, Card, Segmented, Tap, TopBar } from '../components/UI';
import { zufallsFragen } from '../game/duell';
import { liveAkten } from '../game/liveakten';
import {
  ARTEN,
  Ansicht,
  Hinweis,
  LiveEinstellungen,
  LiveFrage,
  LiveHost,
  MODI,
  RangEintrag,
  TEAM_NAMEN,
  VonHost,
  neueAnsicht,
  punkteDetektiv,
} from '../game/liverunde';
import { HostVerbindung, SpielerVerbindung, liveMoeglich, oeffneRaum, raumLink, trittBei } from '../game/livetransport';
import { useRolle } from '../game/rolle';
import { teileLink } from '../game/teilen';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];
const TEAM_FARBE = [colors.red, colors.blue];
const zeitgeber = {
  setze: (fn: () => void, ms: number) => setTimeout(fn, ms),
  loesche: (h: unknown) => clearTimeout(h as ReturnType<typeof setTimeout>),
};

const FEHLER: Record<string, string> = {
  'nicht-gefunden': 'Diesen Raum gibt es nicht (mehr). Prüfe die PIN.',
  zeit: 'Die Verbindung hat zu lange gedauert. Tipp: Seid ihr im selben WLAN, klappt es am besten.',
  netz: 'Keine Verbindung möglich. Prüfe dein Internet. Im selben WLAN klappt es am besten.',
};

type EndAnsicht = Extract<Ansicht, { phase: 'ende' }>;

/** Hat die eigene Person gewonnen? (Platz 1, das bessere Team oder gemeinsam gerettet) */
function istSieg(a: EndAnsicht, id: string): boolean {
  const eigen = a.rangliste.find((x) => x.id === id);
  if (!eigen) return false;
  if (a.modus === 'solo') return eigen.platz === 1 && a.rangliste.length > 1;
  if (a.modus === 'teams' && a.teams && eigen.team !== null) return a.teams[eigen.team] > a.teams[eigen.team === 0 ? 1 : 0];
  return a.modus === 'koop' && a.gerettet === true;
}

/**
 * Live-Runde (wie Kahoot): Einer eröffnet einen Raum, alle anderen treten mit PIN bei und spielen live dieselben Fragen.
 * Die Verbindung läuft direkt von Handy zu Handy, es gibt keinen eigenen Server.
 */
export function LiveScreen({
  pin: einladung,
  name,
  onName,
  onFinish,
  onBack,
}: {
  pin: string | null;
  name: string;
  onName: (n: string) => void;
  onFinish: (ep: number, sieg: boolean) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [rolle, setRolle] = useState<'menu' | 'host' | 'gast'>('menu');
  const [ansicht, setAnsicht] = useState<Ansicht>({ phase: 'verbinden' });
  const [einst, setEinst] = useState<LiveEinstellungen>({ modus: 'solo', art: 'quiz', anzahl: 10, sekunden: 20 });
  const [pinFeld, setPinFeld] = useState(einladung ?? '');
  const [bitte, setBitte] = useState(false);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  const [, setTick] = useState(0);
  const host = useRef<LiveHost | null>(null);
  const hostVerb = useRef<HostVerbindung | null>(null);
  const gastVerb = useRef<SpielerVerbindung | null>(null);
  const ich = useRef('');
  const belohnt = useRef(false);
  const lebt = useRef(true);

  const empfange = useCallback((n: VonHost) => {
    if (!lebt.current) return;
    if (n.t === 'lobby') ich.current = n.ich;
    setAnsicht((a) => neueAnsicht(a, n, Date.now()));
  }, []);

  // Aufräumen beim Verlassen
  useEffect(() => {
    lebt.current = true;
    return () => {
      lebt.current = false;
      host.current?.schliesse();
      hostVerb.current?.schliessen();
      gastVerb.current?.schliessen();
    };
  }, []);

  // Anzeige auffrischen (Countdown, „x von y haben geantwortet“)
  useEffect(() => {
    if (rolle === 'menu') return;
    const t = setInterval(() => setTick((x) => x + 1), 300);
    return () => clearInterval(t);
  }, [rolle]);

  // Belohnung einmal pro Runde
  useEffect(() => {
    if (ansicht.phase !== 'ende') {
      belohnt.current = false;
      return;
    }
    if (belohnt.current) return;
    belohnt.current = true;
    const eigen = ansicht.rangliste.find((x) => x.id === ich.current);
    if (!eigen) return;
    const sieg = istSieg(ansicht, ich.current);
    onFinish(eigen.richtige * 8 + (sieg ? 15 : 0), sieg);
    zaehle('live-ende');
  }, [ansicht]); // eslint-disable-line react-hooks/exhaustive-deps

  const eroeffne = async () => {
    setBitte(true);
    setFehler('');
    try {
      const verb = await oeffneRaum({
        onNeu: () => {},
        onNachricht: (id, n) => {
          host.current?.nachricht(id, n);
          setTick((x) => x + 1);
        },
        onGetrennt: (id) => {
          host.current?.verlassen(id);
          setTick((x) => x + 1);
        },
      });
      hostVerb.current = verb;
      const h = new LiveHost(
        verb.pin,
        einst,
        baueFragen(einst),
        (id, n) => (id === 'host' ? empfange(n) : verb.senden(id, n)),
        Date.now,
        zeitgeber,
        name || 'Host',
      );
      host.current = h;
      ich.current = 'host';
      empfange(h.lobbyStand());
      setRolle('host');
      zaehle(`live-erstellt-${einst.art === 'detektiv' ? 'detektiv-' : ''}${einst.modus}`);
    } catch (e) {
      setFehler(FEHLER[(e as Error).message] ?? FEHLER.netz);
    } finally {
      setBitte(false);
    }
  };

  const tritt = async () => {
    if (!/^\d{6}$/.test(pinFeld)) return setFehler('Die PIN hat 6 Ziffern.');
    setBitte(true);
    setFehler('');
    try {
      const verb = await trittBei(pinFeld, {
        onNachricht: empfange,
        onGetrennt: () => lebt.current && setAnsicht({ phase: 'getrennt', grund: 'verloren' }),
      });
      gastVerb.current = verb;
      verb.senden({ t: 'hallo', name: name || 'Gast' });
      setAnsicht({ phase: 'verbinden' });
      setRolle('gast');
      zaehle('live-beigetreten');
    } catch (e) {
      setFehler(FEHLER[(e as Error).message] ?? FEHLER.netz);
    } finally {
      setBitte(false);
    }
  };

  const antworte = (nr: number, wahl: number) => {
    if (ansicht.phase !== 'frage' || ansicht.gewaehlt !== null) return;
    setAnsicht({ ...ansicht, gewaehlt: wahl });
    if (host.current) host.current.nachricht('host', { t: 'antwort', nr, wahl });
    else gastVerb.current?.senden({ t: 'antwort', nr, wahl });
  };

  const verlasse = () => {
    host.current?.schliesse();
    hostVerb.current?.schliessen();
    gastVerb.current?.schliessen();
    host.current = null;
    hostVerb.current = null;
    gastVerb.current = null;
    onBack();
  };

  const baueFragen = (e: LiveEinstellungen): LiveFrage[] =>
    e.art === 'detektiv' ? liveAkten(e.anzahl) : zufallsFragen(r.id, e.anzahl);

  const wide = L.wide && styles.wide;
  const istHost = rolle === 'host';

  if (!liveMoeglich()) {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Live-Runde" title="Mit anderen spielen" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card>
            <Text style={type.body}>
              Die Live-Runde läuft im Browser (zum Beispiel Safari auf dem iPhone unter rettung.tankard.de). In dieser Umgebung
              ist sie leider nicht verfügbar.
            </Text>
          </Card>
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  // ───────────── Menü ─────────────
  if (rolle === 'menu') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Live-Runde" title="Mit anderen spielen" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, wide]} keyboardShouldPersistTaps="handled">
          <Card style={{ gap: 6 }}>
            <Text style={styles.label}>DEIN NAME (FÜR ALLE SICHTBAR)</Text>
            <TextInput
              value={name}
              onChangeText={onName}
              placeholder="Vorname oder Spitzname"
              placeholderTextColor={colors.muted}
              maxLength={16}
              style={styles.eingabe}
              accessibilityLabel="Dein Name"
            />
          </Card>

          <Card style={{ gap: spacing.sm }}>
            <Text style={type.headline}>👥 Raum erstellen</Text>
            <Text style={type.small}>
              Du bist der Host: Du startest die Runde. Die anderen treten mit der PIN bei und spielen auf dem eigenen Handy.
            </Text>
            <Text style={styles.label}>SPIELART</Text>
            {ARTEN.map((a) => (
              <Tap
                key={a.id}
                onPress={() =>
                  setEinst({ ...einst, art: a.id, anzahl: a.id === 'detektiv' ? 5 : 10, sekunden: a.id === 'detektiv' ? 8 : 20 })
                }
                accessibilityLabel={a.titel}
                style={[styles.modus, einst.art === a.id && { borderColor: r.akzent, backgroundColor: r.akzentTint }]}
              >
                <Text style={styles.modusIcon}>{a.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { fontFamily: fonts.bold }]}>{a.titel}</Text>
                  <Text style={type.small}>{a.text}</Text>
                </View>
              </Tap>
            ))}
            <Text style={styles.label}>SPIELWEISE</Text>
            {MODI.map((m) => (
              <Tap
                key={m.id}
                onPress={() => setEinst({ ...einst, modus: m.id })}
                accessibilityLabel={m.titel}
                style={[styles.modus, einst.modus === m.id && { borderColor: r.akzent, backgroundColor: r.akzentTint }]}
              >
                <Text style={styles.modusIcon}>{m.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { fontFamily: fonts.bold }]}>{m.titel}</Text>
                  <Text style={type.small}>{m.text}</Text>
                </View>
              </Tap>
            ))}
            <Text style={styles.label}>{einst.art === 'detektiv' ? 'AKTEN' : 'FRAGEN'}</Text>
            <Segmented
              options={(einst.art === 'detektiv' ? [3, 5, 7] : [5, 10, 15]).map((n) => ({ id: String(n), label: String(n) }))}
              value={String(einst.anzahl)}
              onChange={(v) => setEinst({ ...einst, anzahl: Number(v) })}
            />
            <Text style={styles.label}>{einst.art === 'detektiv' ? 'SEKUNDEN PRO HINWEIS' : 'SEKUNDEN PRO FRAGE'}</Text>
            <Segmented
              options={(einst.art === 'detektiv' ? [6, 8, 12] : [15, 20, 30]).map((n) => ({ id: String(n), label: String(n) }))}
              value={String(einst.sekunden)}
              onChange={(v) => setEinst({ ...einst, sekunden: Number(v) })}
            />
            <Button label={bitte ? 'Raum wird geöffnet …' : 'Raum öffnen'} onPress={eroeffne} disabled={bitte} />
          </Card>

          <Card style={{ gap: spacing.sm }}>
            <Text style={type.headline}>🔑 Raum beitreten</Text>
            <TextInput
              value={pinFeld}
              onChangeText={(t) => setPinFeld(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="PIN (6 Ziffern)"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={6}
              style={[styles.eingabe, styles.pinEingabe]}
              accessibilityLabel="PIN"
            />
            <Button
              label={bitte ? 'Verbinde …' : 'Beitreten'}
              variant="alarm"
              onPress={tritt}
              disabled={bitte || pinFeld.length < 6}
            />
          </Card>

          {bitte && <ActivityIndicator color={colors.tuerkis} />}
          {!!fehler && (
            <Card style={{ borderLeftColor: colors.red }}>
              <Text style={type.body}>{fehler}</Text>
            </Card>
          )}
          <Text style={type.small}>
            Die Verbindung läuft direkt zwischen den Handys. Am besten klappt es, wenn alle im selben WLAN sind. Der Host muss die
            App während der Runde offen lassen.
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ───────────── Spiel ─────────────
  const kopf = `Live · ${istHost ? 'Host' : 'Mitspieler'}`;

  if (ansicht.phase === 'verbinden') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={kopf} title="Verbinde …" onBack={verlasse} />
        <View style={styles.mitte}>
          <ActivityIndicator color={colors.tuerkis} size="large" />
        </View>
      </View>
    );
  }

  if (ansicht.phase === 'getrennt') {
    const text =
      ansicht.grund === 'laeuft'
        ? 'Die Runde läuft schon. Du kannst bei der nächsten mitspielen.'
        : ansicht.grund === 'voll'
          ? 'Der Raum ist voll (höchstens 20 Personen).'
          : ansicht.grund === 'beendet'
            ? 'Der Host hat die Runde beendet.'
            : 'Die Verbindung ist abgebrochen.';
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={kopf} title="Runde vorbei" onBack={verlasse} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={type.body}>{text}</Text>
          </Card>
          <Button label="Zurück" onPress={verlasse} />
        </ScrollView>
      </View>
    );
  }

  if (ansicht.phase === 'lobby') {
    const h = host.current;
    const link = raumLink(ansicht.pin);
    const modus = MODI.find((m) => m.id === ansicht.einstellungen.modus)!;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={kopf} title="Warteraum" onBack={verlasse} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.xs }}>
            <Text style={styles.label}>PIN ZUM BEITRETEN</Text>
            <Text style={styles.pin} accessibilityLabel={`PIN ${ansicht.pin}`}>
              {ansicht.pin.slice(0, 3)} {ansicht.pin.slice(3)}
            </Text>
            <Text style={type.small}>
              {modus.icon} {modus.titel} ·{' '}
              {ansicht.einstellungen.art === 'detektiv'
                ? `🕵️ ${ansicht.einstellungen.anzahl} Akten · ${ansicht.einstellungen.sekunden} s je Hinweis`
                : `❓ ${ansicht.einstellungen.anzahl} Fragen · ${ansicht.einstellungen.sekunden} s`}
            </Text>
          </Card>
          {istHost && (
            <Button
              label="Einladung verschicken"
              variant="tinted"
              onPress={async () => {
                const erg = await teileLink(
                  `Spiel mit mir eine Live-Runde bei Einsatz 112! PIN: ${ansicht.pin}`,
                  link,
                  'Einsatz-112-Live-Runde',
                );
                setHinweis(erg === 'kopiert' ? 'Link kopiert – füge ihn in eine Nachricht ein.' : '');
              }}
            />
          )}
          {!!hinweis && <Text style={[type.small, { textAlign: 'center' }]}>{hinweis}</Text>}
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.headline}>Dabei ({ansicht.spieler.filter((s) => s.verbunden).length})</Text>
            <View style={styles.chips}>
              {ansicht.spieler.map((s) => (
                <View key={s.id} style={[styles.chip, { borderColor: s.team === null ? colors.line : TEAM_FARBE[s.team] }]}>
                  {s.team !== null && <View style={[styles.punkt, { backgroundColor: TEAM_FARBE[s.team] }]} />}
                  <Text style={[type.small, { color: colors.ink, fontFamily: s.id === ansicht.ich ? fonts.bold : fonts.medium }]}>
                    {s.name}
                    {s.id === 'host' ? ' 👑' : ''}
                    {s.id === ansicht.ich ? ' (du)' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
          {istHost ? (
            <>
              <Button
                label={h?.kannStarten ? 'Runde starten' : 'Warte auf Mitspieler …'}
                disabled={!h?.kannStarten}
                onPress={() => {
                  h?.starte();
                  setTick((x) => x + 1);
                }}
              />
              <Text style={type.small}>Zu zweit geht es schon los. Es können bis zu 20 Personen mitspielen.</Text>
            </>
          ) : (
            <Text style={[type.body, { textAlign: 'center' }]}>Gleich geht es los – der Host startet die Runde. ⏳</Text>
          )}
          <Button label="Raum verlassen" variant="outline" onPress={verlasse} />
        </ScrollView>
      </View>
    );
  }

  if (ansicht.phase === 'frage') {
    const rest = Math.max(0, ansicht.sekunden - (Date.now() - ansicht.empfangen) / 1000);
    // Detektiv: so viele Sekunden sind seit dem ersten Hinweis vergangen
    const vergangen = ansicht.anzahlHinweise * ansicht.schritt - ansicht.sekunden + (Date.now() - ansicht.empfangen) / 1000;
    const fertig = ansicht.gewaehlt !== null;
    const h = host.current;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={`${kopf} · ${ansicht.nr + 1}/${ansicht.gesamt}`} title={`${Math.ceil(rest)} s`} onBack={verlasse} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Bar pct={rest / ansicht.sekunden} color={rest < 5 ? colors.red : r.akzent} />
          {ansicht.art === 'detektiv' ? (
            <AkteKarte
              hinweise={ansicht.hinweise}
              gesamt={ansicht.anzahlHinweise}
              infoZeile={
                ansicht.hinweise.length < ansicht.anzahlHinweise
                  ? `Nächster Hinweis in ${Math.max(1, Math.ceil(ansicht.schritt - (vergangen % ansicht.schritt)))} s`
                  : 'Alle Hinweise sind da'
              }
              punkte={punkteDetektiv(ansicht.hinweise.length, ansicht.anzahlHinweise, 1)}
            />
          ) : null}
          <Card>
            <Text style={styles.frage}>{ansicht.kopf}</Text>
          </Card>
          {ansicht.optionen.map((o, k) => (
            <AnswerOption
              key={k}
              letter={LETTERS[k]}
              text={o}
              disabled={fertig}
              state={ansicht.gewaehlt === k ? 'selected' : fertig ? 'dim' : 'idle'}
              onPress={() => antworte(ansicht.nr, k)}
            />
          ))}
          {fertig && <Text style={[type.body, { textAlign: 'center' }]}>Antwort gesendet ✓ – warte auf die anderen …</Text>}
          {h && <Text style={[type.small, { textAlign: 'center' }]}>{h.beantwortet} haben geantwortet</Text>}
          {h && <Button label="Frage beenden" variant="outline" onPress={() => h.beende()} />}
        </ScrollView>
      </View>
    );
  }

  if (ansicht.phase === 'auswertung') {
    const h = host.current;
    const eigen = ansicht.rangliste.find((x) => x.id === ich.current);
    const richtig = ansicht.gewaehlt === ansicht.richtig;
    const keine = ansicht.gewaehlt === null;
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={`${kopf} · ${ansicht.nr + 1}/${ansicht.gesamt}`} title="Auswertung" onBack={verlasse} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.xs, borderLeftColor: richtig ? colors.mint : colors.red }}>
            <Text style={styles.emoji}>{keine ? '⏰' : richtig ? '✅' : '❌'}</Text>
            <Text style={type.headline}>{keine ? 'Keine Antwort' : richtig ? 'Richtig!' : 'Leider falsch'}</Text>
            <Text style={[type.body, { color: r.akzentDunkel, fontFamily: fonts.bold }]}>
              {eigen && eigen.zuwachs > 0 ? `+${eigen.zuwachs} Punkte` : '+0 Punkte'}
            </Text>
          </Card>
          <Card>
            <Text style={styles.frage}>{ansicht.kopf}</Text>
          </Card>
          {ansicht.optionen.map((o, k) => (
            <AnswerOption
              key={k}
              letter={LETTERS[k]}
              text={o}
              disabled
              state={k === ansicht.richtig ? 'right' : ansicht.gewaehlt === k ? 'wrong' : 'dim'}
              onPress={() => {}}
            />
          ))}
          <Card style={{ gap: 4 }}>
            <Text style={type.body}>{ansicht.erklaerung}</Text>
          </Card>
          {ansicht.hinweise.length > 0 && (
            <AkteKarte hinweise={ansicht.hinweise} gesamt={ansicht.hinweise.length} titel="Die ganze Akte" />
          )}
          <Card style={{ gap: spacing.xs }}>
            <Text style={styles.label}>SO HABEN ALLE GEANTWORTET</Text>
            {ansicht.verteilung.map((n, k) => {
              const summe = Math.max(
                1,
                ansicht.verteilung.reduce((a, b) => a + b, 0),
              );
              return (
                <View key={k} style={styles.verteilung}>
                  <Text
                    style={[
                      type.small,
                      { width: 18, color: k === ansicht.richtig ? colors.mint : colors.ink, fontFamily: fonts.bold },
                    ]}
                  >
                    {LETTERS[k]}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Bar pct={n / summe} color={k === ansicht.richtig ? colors.mint : colors.line} />
                  </View>
                  <Text style={[type.small, { width: 22, textAlign: 'right' }]}>{n}</Text>
                </View>
              );
            })}
          </Card>
          {ansicht.leben !== null && (
            <Card style={{ alignItems: 'center', gap: 4 }}>
              <Text style={styles.leben}>
                {'❤️'.repeat(Math.max(0, ansicht.leben)) + '🖤'.repeat(Math.max(0, 3 - ansicht.leben))}
              </Text>
              <Text style={type.small}>
                {Math.round(ansicht.anteil * 100)} % haben richtig geantwortet.
                {ansicht.anteil < 0.5 ? ' Das kostet ein Leben!' : ' Stark – weiter so!'}
              </Text>
            </Card>
          )}
          {ansicht.teams && <TeamKarte teams={ansicht.teams} />}
          <Rangliste liste={ansicht.rangliste} ich={ich.current} max={5} />
          {h ? (
            <Button
              label={ansicht.letzte ? 'Ergebnis zeigen' : 'Nächste Frage'}
              onPress={() => {
                h.weiter();
                setTick((x) => x + 1);
              }}
            />
          ) : (
            <Text style={[type.body, { textAlign: 'center' }]}>Der Host geht gleich weiter … ⏳</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  // ───────────── Ende ─────────────
  const eigen = ansicht.rangliste.find((x) => x.id === ich.current);
  const platz3 = ansicht.rangliste.slice(0, 3);
  const h = host.current;
  const koop = ansicht.modus === 'koop';
  const sieger = ansicht.teams
    ? ansicht.teams[0] > ansicht.teams[1]
      ? 0
      : ansicht.teams[1] > ansicht.teams[0]
        ? 1
        : null
    : null;
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker={kopf}
        title={koop ? (ansicht.gerettet ? 'Gerettet!' : 'Leider verloren') : 'Siegerehrung'}
        onBack={verlasse}
      />
      <ScrollView contentContainerStyle={[styles.content, wide]}>
        {koop ? (
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{ansicht.gerettet ? '🎉' : '💔'}</Text>
            <Text style={type.headline}>
              {ansicht.gerettet ? 'Euer Team hat den Patienten gerettet!' : 'Diesmal hat es nicht gereicht.'}
            </Text>
            <Text style={styles.leben}>
              {'❤️'.repeat(Math.max(0, ansicht.leben ?? 0)) + '🖤'.repeat(Math.max(0, 3 - (ansicht.leben ?? 0)))}
            </Text>
          </Card>
        ) : ansicht.teams ? (
          <>
            <Card style={{ alignItems: 'center', gap: spacing.xs }}>
              <Text style={styles.emoji}>{sieger === null ? '🤝' : '🏆'}</Text>
              <Text style={type.headline}>{sieger === null ? 'Unentschieden!' : `Team ${TEAM_NAMEN[sieger]} gewinnt!`}</Text>
            </Card>
            <TeamKarte teams={ansicht.teams} />
          </>
        ) : (
          <Card style={styles.podium}>
            {[1, 0, 2].map((i) =>
              platz3[i] ? (
                <View key={i} style={[styles.podest, { height: 90 + (i === 0 ? 40 : i === 1 ? 15 : 0) }]}>
                  <Text style={styles.medaille}>{['🥇', '🥈', '🥉'][i]}</Text>
                  <Text
                    style={[type.small, { color: colors.ink, fontFamily: fonts.bold, textAlign: 'center' }]}
                    numberOfLines={1}
                  >
                    {platz3[i].name}
                  </Text>
                  <Text style={type.small}>{platz3[i].punkte}</Text>
                </View>
              ) : (
                <View key={i} style={styles.podest} />
              ),
            )}
          </Card>
        )}
        {eigen && (
          <Card style={{ alignItems: 'center', gap: 2 }}>
            <Text style={type.small}>
              Du: Platz {eigen.platz} · {eigen.richtige} richtig · {eigen.punkte} Punkte
            </Text>
            <Text style={[type.headline, { color: r.akzentDunkel }]}>
              +{eigen.richtige * 8 + (istSieg(ansicht, ich.current) ? 15 : 0)} EP
            </Text>
          </Card>
        )}
        <Rangliste liste={ansicht.rangliste} ich={ich.current} max={10} />
        {h && (
          <Button
            label="Noch eine Runde"
            onPress={() => {
              h.neueRunde(h.einstellungen, baueFragen(h.einstellungen));
              setTick((x) => x + 1);
            }}
          />
        )}
        <Button label="Fertig" variant="outline" onPress={verlasse} />
      </ScrollView>
    </View>
  );
}

/** Die Akte beim Detektiv-Spiel: Hinweise, die nach und nach auftauchen */
function AkteKarte({
  hinweise,
  gesamt,
  titel = 'Akte',
  infoZeile,
  punkte,
}: {
  hinweise: Hinweis[];
  gesamt: number;
  titel?: string;
  infoZeile?: string;
  punkte?: number;
}) {
  const r = useRolle();
  return (
    <Card style={{ gap: spacing.sm }}>
      <View style={styles.akteKopf}>
        <Text style={type.headline}>
          📁 {titel} {infoZeile ? `· ${hinweise.length}/${gesamt}` : ''}
        </Text>
        {punkte !== undefined && (
          <Text style={[type.small, { color: r.akzentDunkel, fontFamily: fonts.bold }]}>Jetzt richtig: {punkte} P.</Text>
        )}
      </View>
      {hinweise.map((h, i) => (
        <View key={i} style={[styles.hinweis, i === hinweise.length - 1 && infoZeile ? { backgroundColor: r.akzentTint } : null]}>
          <Text style={styles.hinweisIcon}>{h.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{h.label.toUpperCase()}</Text>
            <Text style={type.body}>{h.text}</Text>
          </View>
        </View>
      ))}
      {!!infoZeile && <Text style={[type.small, { textAlign: 'center' }]}>{infoZeile}</Text>}
    </Card>
  );
}

function TeamKarte({ teams }: { teams: [number, number] }) {
  return (
    <Card style={{ gap: spacing.xs }}>
      <Text style={styles.label}>TEAMS (DURCHSCHNITT JE PERSON)</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[0, 1].map((t) => (
          <View key={t} style={[styles.team, { backgroundColor: TEAM_FARBE[t] }]}>
            <Text style={styles.teamName}>Team {TEAM_NAMEN[t]}</Text>
            <Text style={styles.teamPunkte}>{teams[t]}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function Rangliste({ liste, ich, max }: { liste: RangEintrag[]; ich: string; max: number }) {
  const zeige = liste.slice(0, max);
  const eigen = liste.find((x) => x.id === ich);
  if (eigen && !zeige.includes(eigen)) zeige.push(eigen);
  return (
    <Card style={{ gap: 6 }}>
      <Text style={styles.label}>RANGLISTE</Text>
      {zeige.map((s) => (
        <View key={s.id} style={[styles.zeile, s.id === ich && { backgroundColor: colors.surface2 }]}>
          <Text style={[type.body, { width: 28, fontFamily: fonts.bold }]}>{s.platz}.</Text>
          {s.team !== null && <View style={[styles.punkt, { backgroundColor: TEAM_FARBE[s.team] }]} />}
          <Text
            style={[type.body, { flex: 1, fontFamily: s.id === ich ? fonts.bold : fonts.medium, opacity: s.verbunden ? 1 : 0.5 }]}
            numberOfLines={1}
          >
            {s.name}
          </Text>
          {s.zuwachs > 0 && <Text style={[type.small, { color: colors.mint }]}>+{s.zuwachs}</Text>}
          <Text style={[type.body, { fontFamily: fonts.bold, width: 56, textAlign: 'right' }]}>{s.punkte}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  mitte: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 0.8, color: colors.muted },
  eingabe: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface2,
  },
  pinEingabe: { fontFamily: fonts.displayBlack, fontSize: 26, letterSpacing: 6, textAlign: 'center' },
  pin: { fontFamily: fonts.displayBlack, fontSize: 52, lineHeight: 60, letterSpacing: 6, color: colors.ink },
  modus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  modusIcon: { fontSize: 26, fontFamily: fonts.regular },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular, textAlign: 'center' },
  frage: { fontFamily: fonts.display, fontSize: 19, lineHeight: 26, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  punkt: { width: 10, height: 10, borderRadius: 5 },
  akteKopf: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  hinweis: { flexDirection: 'row', gap: 10, padding: 8, borderRadius: 12 },
  hinweisIcon: { fontSize: 22, fontFamily: fonts.regular },
  verteilung: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  leben: { fontSize: 30, fontFamily: fonts.regular, letterSpacing: 4 },
  team: { flex: 1, borderRadius: 16, padding: spacing.md, alignItems: 'center', gap: 2 },
  teamName: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  teamPunkte: { fontFamily: fonts.displayBlack, fontSize: 30, color: '#fff' },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: spacing.sm },
  podest: {
    flex: 1,
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 6,
  },
  medaille: { fontSize: 30, fontFamily: fonts.regular },
});
