import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zaehle } from '../analytics';
import { KatiAvatar } from '../components/Kati';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { WissensKarte } from '../components/WissensKarte';
import { useRolle } from '../game/rolle';
import { BEISPIELFRAGEN, Treffer, WissensArt, istNotfallFrage, sucheWissen } from '../game/wissen';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

interface Runde {
  id: number;
  frage: string;
  treffer: Treffer[];
  notfall: boolean;
  bewertet?: 'ja' | 'nein';
}

const KURZ: WissensArt[] = ['lexikon', 'spickzettel', 'ablauf', 'basics', 'krankheit', 'wert'];

/** Hauptantwort: bevorzugt knappe Lexikon-/Spickzettel-/Ablauf-Einträge, wenn sie fast so gut passen wie der beste Treffer */
export function hauptTreffer(t: Treffer[]): number {
  if (t.length === 0) return 0;
  const i = t.findIndex((x) => KURZ.includes(x.eintrag.art) && x.score >= t[0].score * 0.5);
  return i === -1 ? 0 : i;
}

/** „Frag Kati“: Antworten aus den Inhalten der App (kein echter KI-Chat, nichts wird gesendet) */
export function KatiFragenScreen({ onBack }: { onBack: () => void }) {
  const L = useLayout();
  const r = useRolle();
  const [text, setText] = useState('');
  const [verlauf, setVerlauf] = useState<Runde[]>([]);
  const nr = useRef(0);
  const scroll = useRef<ScrollView>(null);

  const frage = (q: string) => {
    const f = q.trim();
    if (!f) return;
    zaehle('kati-frage');
    const treffer = sucheWissen(r.id, f, 6);
    setVerlauf((v) => [{ id: ++nr.current, frage: f, treffer, notfall: istNotfallFrage(f) }, ...v]);
    setText('');
    scroll.current?.scrollTo({ y: 0, animated: true });
  };
  const bewerte = (id: number, b: 'ja' | 'nein') => {
    zaehle(b === 'ja' ? 'kati-hilfreich' : 'kati-nicht-hilfreich');
    setVerlauf((v) => v.map((x) => (x.id === id ? { ...x, bewertet: b } : x)));
  };

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
            placeholder="Frag mich etwas, z. B. „Was tun bei Verbrennung?“"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Frage an Kati"
            style={styles.feld}
          />
          <Button label="Fragen" onPress={() => frage(text)} disabled={text.trim().length < 2} style={{ alignSelf: 'stretch' }} />
        </View>

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
                  {haupt ? (
                    <>
                      <Text style={type.small}>Das habe ich dazu gefunden:</Text>
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
                      {rd.bewertet ? (
                        <Text style={type.small}>
                          {rd.bewertet === 'ja' ? 'Danke! 🙏' : 'Danke – ich lerne daraus. Probier andere Wörter.'}
                        </Text>
                      ) : (
                        <View style={styles.bewertung}>
                          <Text style={type.small}>Hat das geholfen?</Text>
                          <Tap onPress={() => bewerte(rd.id, 'ja')} accessibilityLabel="Hat geholfen" style={styles.daumen}>
                            <Text style={styles.daumenText}>👍</Text>
                          </Tap>
                          <Tap
                            onPress={() => bewerte(rd.id, 'nein')}
                            accessibilityLabel="Hat nicht geholfen"
                            style={styles.daumen}
                          >
                            <Text style={styles.daumenText}>👎</Text>
                          </Tap>
                        </View>
                      )}
                    </>
                  ) : (
                    <Card style={{ gap: spacing.sm }}>
                      <Text style={type.headline}>Dazu habe ich nichts gefunden 🤔</Text>
                      <Text style={type.small}>
                        Probier andere Wörter oder frag kürzer, z. B. „Verbrennung“, „Defi“ oder „Seitenlage“.
                      </Text>
                    </Card>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.katiZeile}>
          <KatiAvatar size={36} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.body}>
                Hi, ich bin Kati! Frag mich zu Notfällen und Erster Hilfe. Ich suche die Antwort in den Inhalten dieser App.
              </Text>
              <Text style={type.small}>
                Ich bin keine echte KI und kein Arzt: Ich erfinde nichts, und deine Fragen verlassen dein Gerät nicht. Im Notfall
                immer 112.
              </Text>
            </Card>
            <View style={styles.chips}>
              {BEISPIELFRAGEN[r.id].map((b) => (
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
  notfall: { backgroundColor: colors.redTint, borderRadius: 14, padding: spacing.md, borderWidth: 1, borderColor: colors.red },
  notfallText: { fontFamily: fonts.bold, fontSize: 14, color: colors.redDark, lineHeight: 19 },
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
