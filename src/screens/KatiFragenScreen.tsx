import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zaehle } from '../analytics';
import { KatiAvatar } from '../components/Kati';
import { KiText } from '../components/KiText';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { WissensKarte } from '../components/WissensKarte';
import { KI_FEHLERTEXT, KiNachricht, frageKi, kiVerfuegbar } from '../game/ki';
import { useRolle } from '../game/rolle';
import { kiZustimmung, merkeKiZustimmung } from '../game/storage';
import {
  BEISPIELFRAGEN,
  Treffer,
  WissensArt,
  istNotfallFrage,
  korrigiereFrage,
  kontextFuerKi,
  smalltalk,
  sucheWissen,
} from '../game/wissen';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

interface Runde {
  id: number;
  frage: string;
  art: 'ki' | 'lokal';
  laedt?: boolean;
  ki?: { antwort: string; gekuerzt: boolean };
  /** Hinweis, z. B. wenn die KI nicht erreichbar war */
  hinweis?: string;
  treffer: Treffer[];
  notfall: boolean;
  bewertet?: 'ja' | 'nein';
  appOffen?: boolean;
  /** Frage mit verbesserten Tippfehlern („Meintest du …?“) */
  meinteDu?: string;
  /** Freundliche Direktantwort (Begrüßung, Dank …) */
  klartext?: string;
}

const KURZ: WissensArt[] = ['lexikon', 'spickzettel', 'ablauf', 'basics', 'krankheit', 'wert', 'artikel', 'begriff'];

const KI_BEISPIELE: Record<'helfer' | 'sani', string[]> = {
  helfer: [
    'Was mache ich bei einer Verbrennung?',
    'Wie erkenne ich einen Schlaganfall?',
    'Mein Kind hat Fieber – was tun?',
    'Was passiert bei einem Herzinfarkt im Körper?',
    'Wann darf ich einen Defibrillator benutzen?',
    'Was ist der Unterschied zwischen Ohnmacht und Bewusstlosigkeit?',
  ],
  sani: [
    'Wie unterscheide ich STEMI und NSTEMI?',
    'Was bedeutet ein SpO₂ von 90 %?',
    'Woran erkenne ich eine Hypoglykämie?',
    'Wie läuft das ABCDE-Schema genau?',
    'Was ist eine Sepsis und wie erkenne ich sie?',
    'Welche Medikamente gibt es bei Anaphylaxie?',
  ],
};

/** Hauptantwort: bevorzugt knappe Lexikon-/Spickzettel-/Ablauf-Einträge, wenn sie fast so gut passen wie der beste Treffer */
export function hauptTreffer(t: Treffer[]): number {
  if (t.length === 0) return 0;
  const i = t.findIndex((x) => KURZ.includes(x.eintrag.art) && x.score >= t[0].score * 0.3);
  return i === -1 ? 0 : i;
}

/** „Meintest du …?“ – wenn Kati einen Tippfehler ausgebessert hat */
export function MeinteDu({ text }: { text: string }) {
  return (
    <Text style={type.body}>
      🔍 Meintest du: <Text style={{ fontFamily: fonts.semibold }}>„{text}“</Text>?
    </Text>
  );
}

/** „Frag Kati“: mit KI-Server beantwortet Kati alle Fragen rund um Medizin; ohne Server antwortet sie aus den Inhalten der App */
export function KatiFragenScreen({ onBack }: { onBack: () => void }) {
  const L = useLayout();
  const r = useRolle();
  const kiDa = kiVerfuegbar();
  const [text, setText] = useState('');
  const [verlauf, setVerlauf] = useState<Runde[]>([]);
  const [zustimmung, setZustimmung] = useState<boolean | null | undefined>(undefined);
  const [wartend, setWartend] = useState<string | null>(null);
  const nr = useRef(0);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    if (kiDa) kiZustimmung().then(setZustimmung);
  }, [kiDa]);

  const kiAn = kiDa && zustimmung === true;

  const stelle = (q: string, mitKi: boolean) => {
    const f = q.trim();
    if (!f) return;
    const treffer = sucheWissen(r.id, f, 6);
    const id = ++nr.current;
    const klartext = smalltalk(f);
    if (klartext) {
      const id = ++nr.current;
      setVerlauf((v) => [{ id, frage: f, art: 'lokal', laedt: false, treffer: [], notfall: false, klartext }, ...v]);
      setText('');
      scroll.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const fix = korrigiereFrage(r.id, f);
    const basis: Runde = {
      id,
      frage: f,
      art: mitKi ? 'ki' : 'lokal',
      laedt: mitKi,
      treffer,
      notfall: istNotfallFrage(f) || istNotfallFrage(fix.text),
      meinteDu: fix.geaendert ? fix.text : undefined,
    };
    zaehle(mitKi ? 'kati-ki-frage' : 'kati-frage');
    // Gespräch für die KI: frühere Fragen und KI-Antworten, dazu die neue Frage
    const frueher: KiNachricht[] = [...verlauf]
      .reverse()
      .filter((x) => x.art === 'ki' && x.ki)
      .slice(-3)
      .flatMap((x): KiNachricht[] => [
        { rolle: 'du', text: x.frage },
        { rolle: 'kati', text: x.ki!.antwort },
      ]);
    setVerlauf((v) => [basis, ...v]);
    setText('');
    scroll.current?.scrollTo({ y: 0, animated: true });
    if (!mitKi) return;
    frageKi([...frueher, { rolle: 'du', text: f }], r.id, kontextFuerKi(r.id, f)).then((erg) => {
      setVerlauf((v) =>
        v.map((x) => {
          if (x.id !== id) return x;
          if (erg.ok) return { ...x, laedt: false, ki: { antwort: erg.antwort, gekuerzt: erg.gekuerzt } };
          return {
            ...x,
            laedt: false,
            art: 'lokal',
            hinweis: `${KI_FEHLERTEXT[erg.fehler]} Hier die Antwort aus dem Wissen der App:`,
          };
        }),
      );
    });
  };

  const frage = (q: string) => {
    if (!q.trim()) return;
    if (smalltalk(q)) {
      stelle(q, false);
      return;
    }
    if (kiDa && zustimmung === null) {
      setWartend(q.trim());
      setText('');
      return;
    }
    stelle(q, kiAn);
  };

  const entscheide = (ja: boolean) => {
    setZustimmung(ja);
    merkeKiZustimmung(ja);
    zaehle(ja ? 'kati-ki-zugestimmt' : 'kati-ki-abgelehnt');
    if (wartend) stelle(wartend, ja);
    setWartend(null);
  };

  const bewerte = (id: number, b: 'ja' | 'nein') => {
    zaehle(b === 'ja' ? 'kati-hilfreich' : 'kati-nicht-hilfreich');
    setVerlauf((v) => v.map((x) => (x.id === id ? { ...x, bewertet: b } : x)));
  };
  const toggleApp = (id: number) => setVerlauf((v) => v.map((x) => (x.id === id ? { ...x, appOffen: !x.appOffen } : x)));

  const beispiele = kiDa ? KI_BEISPIELE[r.id] : BEISPIELFRAGEN[r.id];

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Lexikon" title="Frag Kati" onBack={onBack} />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, L.wide && styles.wide]}
      >
        <View style={styles.eingabe}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => frage(text)}
            returnKeyType="search"
            placeholder={kiDa ? 'Frag Kati alles rund um Medizin …' : 'Frag mich etwas, z. B. „Was tun bei Verbrennung?“'}
            placeholderTextColor={colors.muted}
            accessibilityLabel="Frage an Kati"
            style={styles.feld}
            multiline
          />
          <Button label="Fragen" onPress={() => frage(text)} disabled={text.trim().length < 2} style={{ alignSelf: 'stretch' }} />
        </View>

        {wartend && (
          <Card style={{ gap: spacing.sm, borderLeftColor: colors.yellow }}>
            <Text style={type.headline}>🤖 Kati nutzt eine KI</Text>
            <Text style={type.small}>
              Damit Kati alle Fragen zur Medizin beantworten kann, wird deine Frage zur Beantwortung an einen KI-Dienst
              (Anthropic, USA) geschickt – ohne Namen und ohne deinen Spielstand. Schreibe bitte keine persönlichen Daten hinein.
              Die Antworten können Fehler enthalten und ersetzen weder Arzt noch Notruf. Mehr dazu in der Datenschutzerklärung
              unter „Mehr“.
            </Text>
            <Text style={[type.small, { fontFamily: fonts.semibold }]}>Deine Frage: „{wartend}“</Text>
            <Button label="Einverstanden, Frage stellen" onPress={() => entscheide(true)} />
            <Button label="Nur Wissen aus der App nutzen" variant="outline" onPress={() => entscheide(false)} />
          </Card>
        )}

        {verlauf.map((rd) => {
          const hi = hauptTreffer(rd.treffer);
          const haupt = rd.treffer[hi];
          const weitere = rd.treffer.filter((_, i) => i !== hi).slice(0, 4);
          return (
            <View key={rd.id} style={{ gap: spacing.sm }}>
              <View style={styles.du}>
                <Text style={styles.duText}>{rd.frage}</Text>
              </View>
              <View style={styles.katiZeile}>
                <KatiAvatar size={36} />
                <View style={{ flex: 1, gap: spacing.sm }}>
                  {rd.notfall && (
                    <View style={styles.notfall}>
                      <Text style={styles.notfallText}>
                        🚨 Ist es ein echter Notfall? Dann zuerst 112 anrufen – danach hier nachlesen.
                      </Text>
                    </View>
                  )}
                  {rd.klartext ? (
                    <Card>
                      <Text style={type.body}>{rd.klartext}</Text>
                    </Card>
                  ) : rd.laedt ? (
                    <Card style={styles.denkt}>
                      <ActivityIndicator color={colors.tuerkis} />
                      <Text style={type.body}>Kati überlegt …</Text>
                    </Card>
                  ) : rd.ki ? (
                    <>
                      <Card style={{ gap: spacing.sm }}>
                        <KiText text={rd.ki.antwort} />
                        {rd.ki.gekuerzt && (
                          <Text style={type.small}>Die Antwort wurde gekürzt. Frag gern nach, wenn dir etwas fehlt.</Text>
                        )}
                        <Text style={styles.kiHinweis}>
                          🤖 KI-Antwort – kann Fehler enthalten. Kein Ersatz für Arzt oder Notruf 112.
                        </Text>
                      </Card>
                      {haupt && (
                        <>
                          <Tap onPress={() => toggleApp(rd.id)} accessibilityLabel="Dazu in der App" style={styles.chip}>
                            <Text style={styles.chipText}>
                              {rd.appOffen
                                ? '📘 Aus der App ausblenden'
                                : `📘 Dazu in der App: ${haupt.eintrag.titel.slice(0, 40)}${haupt.eintrag.titel.length > 40 ? '…' : ''}`}
                            </Text>
                          </Tap>
                          {rd.appOffen && <WissensKarte eintrag={haupt.eintrag} />}
                        </>
                      )}
                    </>
                  ) : haupt ? (
                    <>
                      {rd.meinteDu && <MeinteDu text={rd.meinteDu} />}
                      <Text style={type.small}>{rd.hinweis ?? 'Das habe ich dazu gefunden:'}</Text>
                      <WissensKarte eintrag={haupt.eintrag} />
                      {weitere.length > 0 && (
                        <View style={{ gap: 6 }}>
                          <Text style={type.small}>Passt auch:</Text>
                          <View style={styles.chips}>
                            {weitere.map((w) => (
                              <Tap
                                key={w.eintrag.id}
                                onPress={() => frage(w.eintrag.titel)}
                                accessibilityLabel={w.eintrag.titel}
                                style={styles.chip}
                              >
                                <Text style={styles.chipText} numberOfLines={2}>
                                  {w.eintrag.icon}{' '}
                                  {w.eintrag.titel.length > 54 ? w.eintrag.titel.slice(0, 53) + '…' : w.eintrag.titel}
                                </Text>
                              </Tap>
                            ))}
                          </View>
                        </View>
                      )}
                    </>
                  ) : (
                    <Card style={{ gap: spacing.sm }}>
                      {rd.meinteDu && <MeinteDu text={rd.meinteDu} />}
                      {rd.hinweis && <Text style={type.small}>{rd.hinweis}</Text>}
                      <Text style={type.headline}>Dazu habe ich nichts gefunden 🤔</Text>
                      <Text style={type.small}>
                        Probier andere Wörter oder frag kürzer, z. B. „Verbrennung“, „Defi“ oder „Seitenlage“.
                      </Text>
                    </Card>
                  )}
                  {!rd.laedt &&
                    (rd.ki || haupt) &&
                    (rd.bewertet ? (
                      <Text style={type.small}>
                        {rd.bewertet === 'ja' ? 'Danke! 🙏' : 'Danke – probier es mit anderen Wörtern.'}
                      </Text>
                    ) : (
                      <View style={styles.bewertung}>
                        <Text style={type.small}>Hat das geholfen?</Text>
                        <Tap onPress={() => bewerte(rd.id, 'ja')} accessibilityLabel="Hat geholfen" style={styles.daumen}>
                          <Text style={styles.daumenText}>👍</Text>
                        </Tap>
                        <Tap onPress={() => bewerte(rd.id, 'nein')} accessibilityLabel="Hat nicht geholfen" style={styles.daumen}>
                          <Text style={styles.daumenText}>👎</Text>
                        </Tap>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.katiZeile}>
          <KatiAvatar size={36} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Card style={{ gap: spacing.sm }}>
              {kiAn ? (
                <>
                  <Text style={type.body}>
                    Hi, ich bin Kati! Frag mich alles rund um Medizin, Erste Hilfe und Rettungsdienst – ich erkläre es dir
                    einfach.
                  </Text>
                  <Text style={type.small}>
                    Meine Antworten kommen von einer KI und können Fehler enthalten. Ich ersetze keine Ärztin, keinen Arzt und
                    keine Ausbildung. Im Notfall immer 112.
                  </Text>
                  <Tap
                    onPress={() => {
                      setZustimmung(false);
                      merkeKiZustimmung(false);
                      zaehle('kati-ki-abgelehnt');
                    }}
                    accessibilityLabel="KI ausschalten"
                  >
                    <Text style={styles.link}>KI ausschalten</Text>
                  </Tap>
                </>
              ) : (
                <>
                  <Text style={type.body}>
                    Hi, ich bin Kati! Frag mich zu Notfällen, Erster Hilfe und zum Helfen – auch „Muss ich immer helfen?“. Ich
                    suche die Antwort in den Inhalten dieser App.
                  </Text>
                  <Text style={type.small}>
                    {kiDa
                      ? 'Du hast die KI nicht eingeschaltet: Ich antworte nur aus dem Wissen der App, nichts verlässt dein Gerät.'
                      : 'Ich bin keine echte KI und kein Arzt: Ich erfinde nichts, und deine Fragen verlassen dein Gerät nicht. Im Notfall immer 112.'}
                  </Text>
                  {kiDa && zustimmung === false && (
                    <Button label="KI einschalten" variant="tinted" onPress={() => setZustimmung(null)} />
                  )}
                </>
              )}
            </Card>
            <View style={styles.chips}>
              {beispiele.map((b) => (
                <Tap key={b} onPress={() => frage(b)} accessibilityLabel={b} style={styles.chip}>
                  <Text style={styles.chipText}>{b}</Text>
                </Tap>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 120 },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  eingabe: { gap: spacing.sm },
  feld: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    maxHeight: 130,
  },
  du: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: colors.tuerkis,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  duText: { fontFamily: fonts.medium, fontSize: 15, color: colors.onBright },
  katiZeile: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  denkt: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  notfall: { backgroundColor: colors.redTint, borderRadius: 14, padding: spacing.md, borderWidth: 1, borderColor: colors.red },
  notfallText: { fontFamily: fonts.bold, fontSize: 14, color: colors.redDark, lineHeight: 19 },
  link: { fontFamily: fonts.semibold, fontSize: 13, color: colors.tuerkis },
  kiHinweis: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  bewertung: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  daumen: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  daumenText: { fontSize: 16, fontFamily: fonts.regular },
});
