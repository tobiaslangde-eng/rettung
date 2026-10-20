import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zaehle } from '../analytics';
import { AnswerOption } from '../components/Training';
import { TeilenKnopf } from '../components/TeilenKnopf';
import { Button, Card, TopBar } from '../components/UI';
import { DUELL_FRAGEN, DuellEinladung, duellFragen, duellLink, neuerCode } from '../game/duell';
import { duellKarteSvg } from '../game/karten';
import { useRolle } from '../game/rolle';
import { teileLink } from '../game/teilen';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Duell mit Freunden: dieselben 5 Fragen für alle – schlage die EP aus dem Link */
export function DuellScreen({
  einladung,
  name,
  onName,
  onFinish,
  onBack,
}: {
  einladung: DuellEinladung | null;
  name: string;
  onName: (n: string) => void;
  onFinish: (richtig: number, gewonnen: boolean | null) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const code = useMemo(() => einladung?.code ?? neuerCode(), [einladung, lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const rolle = einladung?.rolle ?? r.id;
  const fragen = useMemo(() => duellFragen(code, rolle), [code, rolle]);
  const [phase, setPhase] = useState<'start' | 'frage' | 'ende'>('start');
  const [i, setI] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [richtig, setRichtig] = useState(0);
  const [hinweis, setHinweis] = useState('');
  const q = fragen[i];
  const gegner = einladung && lauf === 0 ? einladung : null;
  const gewonnen = gegner ? (richtig > gegner.richtig ? true : richtig === gegner.richtig ? null : false) : null;

  const tippe = (k: number) => {
    if (gewaehlt !== null) return;
    setGewaehlt(k);
    if (k === q.richtig) setRichtig(richtig + 1);
  };
  const weiter = () => {
    if (i + 1 < fragen.length) {
      setI(i + 1);
      setGewaehlt(null);
    } else {
      const g = gegner ? (richtig > gegner.richtig ? true : richtig === gegner.richtig ? null : false) : null;
      onFinish(richtig, g);
      zaehle(gegner ? 'duell-angenommen' : 'duell-gestartet');
      setPhase('ende');
    }
  };
  const nochmal = () => {
    setLauf(lauf + 1);
    setPhase('start');
    setI(0);
    setGewaehlt(null);
    setRichtig(0);
    setHinweis('');
  };

  const link = duellLink(code, rolle, name, richtig);
  const text = `Ich habe ${richtig}/${DUELL_FRAGEN} im Einsatz-112-Duell. Kannst du mich schlagen?`;

  if (phase === 'start') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Duell" title={gegner ? 'Du wurdest herausgefordert' : 'Duell mit Freunden'} onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          {gegner ? (
            <Card style={{ alignItems: 'center', gap: spacing.sm }}>
              <Text style={styles.emoji}>⚔️</Text>
              <Text style={type.headline}>
                {gegner.name || 'Jemand'} hat {gegner.richtig} von {DUELL_FRAGEN} richtig.
              </Text>
              <Text style={type.small}>Du bekommst dieselben {DUELL_FRAGEN} Fragen. Schaffst du mehr?</Text>
            </Card>
          ) : (
            <Card style={{ gap: spacing.sm }}>
              <Text style={styles.emoji}>⚔️</Text>
              <Text style={type.body}>
                Spiele {DUELL_FRAGEN} Fragen und schicke deinen Freunden den Link. Sie bekommen genau dieselben Fragen und sehen,
                ob sie dich schlagen. Ohne Konto, ohne Anmeldung.
              </Text>
            </Card>
          )}
          <Card style={{ gap: 6 }}>
            <Text style={[type.small, { fontFamily: fonts.bold }]}>DEIN NAME (SICHTBAR FÜR DEN GEGNER)</Text>
            <TextInput
              value={name}
              onChangeText={onName}
              placeholder="Vorname oder Spitzname"
              placeholderTextColor={colors.muted}
              maxLength={18}
              style={styles.eingabe}
              accessibilityLabel="Dein Name"
            />
          </Card>
          <Button label="Duell starten" onPress={() => setPhase('frage')} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'ende') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar
          kicker="Duell"
          title={
            gegner ? (gewonnen === true ? 'Gewonnen!' : gewonnen === null ? 'Unentschieden' : 'Knapp verloren') : 'Geschafft'
          }
          onBack={onBack}
        />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{gegner ? (gewonnen === true ? '🏆' : gewonnen === null ? '🤝' : '💪') : '🎯'}</Text>
            <Text style={styles.big}>
              {richtig}/{DUELL_FRAGEN}
            </Text>
            {gegner && (
              <Text style={type.small}>
                gegen {gegner.name || 'Freund/in'}: {gegner.richtig}/{DUELL_FRAGEN}
              </Text>
            )}
            <Text style={[type.headline, { color: r.akzentDunkel }]}>+{richtig * 8 + (gewonnen === true ? 15 : 0)} EP</Text>
          </Card>
          <Button
            label={gegner ? 'Ergebnis zurückschicken' : 'Freund herausfordern'}
            variant="alarm"
            onPress={async () => {
              const erg = await teileLink(text, link, 'Einsatz-112-Duell');
              if (erg !== 'abgebrochen') zaehle('duell-link-geteilt');
              setHinweis(
                erg === 'kopiert' ? 'Link kopiert – füge ihn in eine Nachricht ein.' : erg === 'geteilt' ? 'Geteilt.' : '',
              );
            }}
          />
          {!!hinweis && <Text style={[type.small, { textAlign: 'center' }]}>{hinweis}</Text>}
          <TeilenKnopf
            art="duell"
            titel="Mein Duell-Ergebnis"
            dateiname="duell-ergebnis.png"
            svg={() =>
              duellKarteSvg({ rolle, name, richtig, von: DUELL_FRAGEN, gegnerName: gegner?.name, gegner: gegner?.richtig })
            }
          />
          <Button label="Revanche: neues Duell" variant="outline" onPress={nochmal} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  const fertig = gewaehlt !== null;
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`Duell · ${i + 1}/${fragen.length}`} title="Welche Antwort stimmt?" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.dots}>
          {fragen.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (fertig ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <Card>
          <Text style={styles.frage}>{q.kopf}</Text>
        </Card>
        {q.optionen.map((o, k) => (
          <AnswerOption
            key={k}
            letter={LETTERS[k]}
            text={o}
            disabled={fertig}
            state={fertig ? (k === q.richtig ? 'right' : gewaehlt === k ? 'wrong' : 'dim') : 'idle'}
            onPress={() => tippe(k)}
          />
        ))}
        {fertig && (
          <>
            <Card style={{ gap: 4 }}>
              <Text style={type.headline}>{gewaehlt === q.richtig ? 'Richtig' : 'Nicht ganz'}</Text>
              <Text style={type.body}>{q.erklaerung}</Text>
            </Card>
            <Button label={i + 1 < fragen.length ? 'Weiter' : 'Ergebnis'} onPress={weiter} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line },
  frage: { fontFamily: fonts.display, fontSize: 19, lineHeight: 26, color: colors.ink },
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
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular, textAlign: 'center' },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
