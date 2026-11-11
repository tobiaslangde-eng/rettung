import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Segmented, Tap, TopBar } from '../components/UI';
import {
  Konto,
  PlusStatus,
  TEST_TAGE,
  aktivesKonto,
  beendePlus,
  einsaetzeUebrig,
  setzeHelferFrei,
  TAGES_EINSAETZE,
  istPlus,
  loescheKonto,
  meldeAb,
  meldeAn,
  registriere,
  setzeKlassenCode,
  setzeSchranken,
  testRestTage,
  useKontoStore,
} from '../game/konto';
import { useLayout } from '../layout';
import { colors, fonts, radius, spacing, type } from '../theme';

function Eingabe({
  label,
  value,
  onChange,
  placeholder,
  geheim,
  tastatur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  geheim?: boolean;
  tastatur?: 'email-address' | 'default';
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={geheim}
        keyboardType={tastatur}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={label}
        style={styles.input}
      />
    </View>
  );
}

function plusText(plus: PlusStatus | null, aktiv: boolean, rest: number | null): string {
  if (!plus) return 'Du nutzt die kostenlose Version.';
  if (!aktiv) return 'Deine Testphase ist abgelaufen.';
  if (rest !== null) return `Testphase: noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'} (${plus.plan === 'jahr' ? 'Jahresabo' : 'Monatsabo'}).`;
  return `Plus aktiv (${plus.plan === 'jahr' ? 'Jahresabo' : 'Monatsabo'}, Demo – es wird nichts abgebucht).`;
}

export function KontoScreen({ onBack, onPlus }: { onBack: () => void; onPlus: () => void }) {
  const L = useLayout();
  const s = useKontoStore();
  const konto: Konto | null = aktivesKonto(s);
  const [tab, setTab] = useState<'an' | 'neu'>('neu');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [fehler, setFehler] = useState('');
  const [loeschen, setLoeschen] = useState(false);
  const [code, setCode] = useState('');

  const senden = () => {
    setFehler('');
    if (pw.length < 8) return setFehler('Das Passwort braucht mindestens 8 Zeichen (nur zum Ausprobieren, es wird nicht gespeichert).');
    const r = tab === 'neu' ? registriere(email, name) : meldeAn(email);
    // Das Passwort wird sofort verworfen
    setPw('');
    if (!r.ok) return setFehler(r.fehler);
    setEmail('');
    setName('');
  };

  const plusAktiv = istPlus(s);
  const rest = testRestTage(s);

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Store-Demo" title={konto ? 'Mein Konto' : 'Anmelden'} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.breit]}>
        <Card style={styles.demo}>
          <Text style={styles.demoTitel}>🧪 Nur zum Ausprobieren</Text>
          <Text style={type.small}>
            Hier kannst du testen, wie Anmeldung und Plus in einer Store-App aussehen würden. Es gibt keinen Server: Konten liegen nur auf diesem Gerät, ein Passwort wird weder gesendet noch gespeichert, und es wird nichts bezahlt.
          </Text>
        </Card>

        {!konto ? (
          <Card style={{ gap: spacing.md }}>
            <Segmented
              options={[
                { id: 'neu' as const, label: 'Konto erstellen' },
                { id: 'an' as const, label: 'Anmelden' },
              ]}
              value={tab}
              onChange={(v) => {
                setTab(v);
                setFehler('');
              }}
            />
            {tab === 'neu' && <Eingabe label="Anzeigename (frei wählbar)" value={name} onChange={setName} placeholder="z. B. RS-Anna" />}
            <Eingabe label="E-Mail" value={email} onChange={setEmail} placeholder="name@beispiel.de" tastatur="email-address" />
            <Eingabe label="Passwort (mindestens 8 Zeichen)" value={pw} onChange={setPw} geheim />
            {fehler !== '' && <Text style={styles.fehler}>{fehler}</Text>}
            <Button label={tab === 'neu' ? 'Konto erstellen' : 'Anmelden'} onPress={senden} />
            <Button label="Ohne Konto weiterspielen" variant="outline" onPress={onBack} />
          </Card>
        ) : (
          <>
            <Card style={styles.profil}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{konto.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={type.headline}>{konto.name}</Text>
                <Text style={type.small}>{konto.email}</Text>
              </View>
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Plus</Text>
              <Text style={type.body}>{plusText(s.plus, plusAktiv, rest)}</Text>
              <Button label={plusAktiv ? 'Plus verwalten' : 'Plus ansehen'} variant="outline" onPress={onPlus} />
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Spielstand</Text>
              <Text style={type.small}>
                Dein Spielstand liegt auf diesem Gerät. Bei einem echten Konto würde er zusätzlich auf einem Server gesichert und wäre auf jedem Gerät da. In dieser Demo ist das noch nicht aktiv. Sichern und Mitnehmen geht heute über den Spielstand-Code unter „Mehr“.
              </Text>
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Klassen-Code</Text>
              {s.klassenCode ? (
                <>
                  <Text style={type.body}>
                    Beigetreten: <Text style={{ fontFamily: fonts.bold }}>{s.klassenCode}</Text>
                  </Text>
                  <Text style={type.small}>In einer echten Version sähe dein Ausbilder deinen Fortschritt – nur mit einer Teilnehmer-Nummer, ohne Namen.</Text>
                  <Button label="Klasse verlassen" variant="outline" onPress={() => setzeKlassenCode(null)} />
                </>
              ) : (
                <>
                  <Text style={type.small}>Für Ausbildungsstätten: Mit einem Code trittst du einer Klasse bei, ohne Namen und E-Mail.</Text>
                  <Eingabe label="Code" value={code} onChange={setCode} placeholder="z. B. NOTSAN24" />
                  <Button
                    label="Beitreten (Demo)"
                    variant="outline"
                    onPress={() => {
                      if (code.trim()) {
                        setzeKlassenCode(code);
                        setCode('');
                      }
                    }}
                  />
                </>
              )}
            </Card>
          </>
        )}

        <Card style={{ gap: spacing.sm }}>
          <Text style={type.eyebrow}>Demo-Einstellungen</Text>
          <Text style={type.small}>
            Mit eingeschalteten Plus-Schranken ist ohne Plus vieles gesperrt. Ausgeschaltet ist alles offen wie bisher.
          </Text>
          <Segmented
            options={[
              { id: 'an' as const, label: 'Schranken an' },
              { id: 'aus' as const, label: 'Schranken aus' },
            ]}
            value={s.schranken ? 'an' : 'aus'}
            onChange={(v) => setzeSchranken(v === 'an')}
          />
          <Text style={[type.small, { marginTop: spacing.xs }]}>
            Ohne Plus gibt es {TAGES_EINSAETZE} Einsätze pro Tag. Frei sind nur wenige Trainings (Sanitäter: Schnelltraining, Wissensfragen, Herzdruck; Ersthelfer: Notruf, Schritte, Wissensfragen) und 3 Simulator-Szenarien. Alles andere ist gesperrt.
            {einsaetzeUebrig(s, 'sani') !== null ? ` Heute noch frei: ${einsaetzeUebrig(s, 'sani')}.` : ''}
          </Text>
          <Text style={type.eyebrow}>Ersthelfer-Bereich</Text>
          <Segmented
            options={[
              { id: 'frei' as const, label: 'Immer frei' },
              { id: 'begrenzt' as const, label: 'Auch begrenzt' },
            ]}
            value={s.helferFrei ? 'frei' : 'begrenzt'}
            onChange={(v) => setzeHelferFrei(v === 'frei')}
          />
          <Text style={type.small}>Vorschlag: Erste Hilfe bleibt für alle kostenlos. Hier kannst du ausprobieren, wie es mit Begrenzung wäre.</Text>
          {s.plus && <Button label={`Plus beenden (Demo, ${TEST_TAGE}-Tage-Test zurücksetzen)`} variant="outline" onPress={beendePlus} />}
        </Card>

        {konto && (
          <View style={{ gap: spacing.sm }}>
            <Button label="Abmelden" variant="outline" onPress={meldeAb} />
            {loeschen ? (
              <Card style={{ gap: spacing.sm, borderColor: colors.red }}>
                <Text style={type.body}>Konto und Demo-Daten wirklich löschen? Dein Spielstand im Spiel bleibt erhalten.</Text>
                <Button
                  label="Ja, Konto löschen"
                  variant="alarm"
                  onPress={() => {
                    loescheKonto();
                    setLoeschen(false);
                  }}
                />
                <Button label="Abbrechen" variant="outline" onPress={() => setLoeschen(false)} />
              </Card>
            ) : (
              <Tap onPress={() => setLoeschen(true)} accessibilityLabel="Konto und Daten löschen" style={styles.loeschen}>
                <Text style={styles.loeschenText}>Konto und Daten löschen</Text>
              </Tap>
            )}
            <Text style={type.small}>Die Löschung direkt in der App ist bei Store-Apps mit Anmeldung üblicherweise vorgeschrieben (bitte aktuelle Regeln prüfen).</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 120 },
  breit: { maxWidth: 720, width: '100%', alignSelf: 'center' },
  demo: { gap: 6, backgroundColor: colors.yellowTint, borderColor: colors.yellow },
  demoTitel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkSoft },
  input: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    color: colors.ink,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  fehler: { color: colors.redDark, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19 },
  profil: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  loeschen: { minHeight: 48, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.redDark, alignItems: 'center', justifyContent: 'center' },
  loeschenText: { color: colors.redDark, fontFamily: fonts.bold, fontSize: 15 },
});
