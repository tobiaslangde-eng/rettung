import { useRef, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, IconTile, Segmented, TopBar } from '../components/UI';
import { KatiAvatar } from '../components/Kati';
import { BADGE_BONUS } from '../game/achievements';
import { CPR_POINTS } from '../game/cpr';
import { INCIDENT_POINTS } from '../data/incidents';
import { MANV_PERFECT_BONUS, MANV_POINTS } from '../data/manv';
import { DAILY_GOAL, dailyGoalBonus } from '../game/daily';
import { QUIZ_POINTS } from '../game/quiz';
import { devCodeStimmt, devFreigeschaltet, devMerken } from '../game/dev';
import { useRolle } from '../game/rolle';
import { DIFFICULTIES } from '../game/difficulty';
import { POINTS } from '../game/scoring';
import { Progress, exportCode, importCode } from '../game/storage';
import { colors, fonts, spacing, type } from '../theme';

const PRIVACY_URL = 'https://tobiaslangde-eng.github.io/rettung/datenschutz.html';

const STEPS = [
  { de: 'Alarm', text: 'Mein Melder piept: Die Leitstelle schickt mich zum nächsten Notfall. Mit Blaulicht geht es los.' },
  {
    de: 'Untersuchung',
    text: 'Ich höre zu, schaue genau hin und messe Vitalwerte. Jeden Wert stufe ich ein: niedrig, normal oder hoch. Jede Messung kostet Zeit – und den Patienten etwas Kraft.',
  },
  { de: 'Diagnose', text: 'Ich entscheide mich für eine Verdachtsdiagnose aus vier Möglichkeiten.' },
  { de: 'Maßnahmen', text: 'Ich wähle alle passenden Maßnahmen. Falsche Maßnahmen schaden dem Patienten und kosten Punkte.' },
];

/** Spielstand als Code mitnehmen – auf ein anderes Gerät oder zu einer neuen Web-Adresse. */
function Transfer({ progress, onImport }: { progress: Progress; onImport: (p: Progress) => void }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const code = exportCode(progress);
  const parsed = input.trim() ? importCode(input) : null;

  const copy = async () => {
    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
      } else {
        await Share.share({ message: code });
      }
    } catch {
      setShown(true);
    }
  };

  return (
    <Card>
      <Head icon="💾" color={colors.skyStrong} title="Spielstand übertragen" />
      <Text style={[type.small, { marginTop: spacing.sm }]}>
        Neues Gerät oder neue Adresse? Hier den Code kopieren und auf dem anderen Gerät unter „Mehr“ wieder einfügen – Punkte,
        Rang, Abzeichen und Ausrüstung kommen mit.
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        <Button label={copied ? 'Kopiert ✓' : 'Code kopieren'} variant="dark" onPress={copy} style={{ flex: 1 }} />
        <Button
          label={shown ? 'Ausblenden' : 'Code zeigen'}
          variant="outline"
          onPress={() => setShown(!shown)}
          style={{ flex: 1 }}
        />
      </View>
      {shown && (
        <Text selectable style={styles.code}>
          {code}
        </Text>
      )}
      <TextInput
        value={input}
        onChangeText={(t) => {
          setInput(t);
          setStatus('idle');
        }}
        placeholder="Code vom anderen Gerät hier einfügen"
        placeholderTextColor={colors.grau500}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        style={styles.input}
      />
      {input.trim() !== '' && (
        <Text style={[type.small, { color: parsed ? colors.mintDark : colors.red, marginTop: spacing.xs }]}>
          {parsed
            ? `Gültiger Code: ${parsed.totalPoints} Punkte, ${parsed.badges.length} Abzeichen`
            : 'Das ist kein gültiger Spielstand-Code.'}
        </Text>
      )}
      <Button
        label={status === 'ok' ? 'Übernommen ✓' : 'Spielstand übernehmen'}
        variant="primary"
        disabled={!parsed || status === 'ok'}
        onPress={() => {
          if (!parsed) return setStatus('error');
          onImport(parsed);
          setStatus('ok');
        }}
        style={{ marginTop: spacing.sm }}
      />
      <Text style={[type.small, { marginTop: spacing.xs }]}>Achtung: Der Spielstand auf diesem Gerät wird dabei ersetzt.</Text>
    </Card>
  );
}

export function GuideScreen({
  progress,
  onReset,
  onImport,
  onRolle,
  onDev,
  onModus,
}: {
  progress: Progress;
  onReset: () => void;
  onImport: (p: Progress) => void;
  onRolle: () => void;
  onDev: () => void;
  onModus: (m: 'story' | 'frei') => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const r = useRolle();
  const taps = useRef<number[]>([]);
  const [codeOffen, setCodeOffen] = useState(false);
  const [code, setCode] = useState('');
  /** Versteckt: sieben Mal schnell auf Kati tippen */
  const tippeKati = async () => {
    const jetzt = Date.now();
    taps.current = [...taps.current.filter((t) => jetzt - t < 5000), jetzt];
    if (taps.current.length < 7) return;
    taps.current = [];
    if (await devFreigeschaltet()) onDev();
    else setCodeOffen(true);
  };
  const pruefeCode = async (eingabe: string) => {
    setCode(eingabe);
    if (devCodeStimmt(eingabe)) {
      await devMerken();
      setCode('');
      setCodeOffen(false);
      onDev();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Anleitung & Spielstand" title="Mehr" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ gap: spacing.sm }}>
          <Text style={type.eyebrow}>Meine Rolle</Text>
          <Text style={type.h2}>
            {r.icon} {r.titel}
          </Text>
          <Text style={type.small}>Jede Rolle hat einen eigenen Spielstand. Beim Wechsel geht nichts verloren.</Text>
          <Button label="Rolle wechseln" variant="outline" onPress={onRolle} />
        </Card>
        <Card style={{ gap: spacing.sm }}>
          <Text style={type.eyebrow}>Spielweise</Text>
          <Segmented
            options={[
              { id: 'story', label: '📖 Mit Geschichte' },
              { id: 'frei', label: '🧭 Frei spielen' },
            ]}
            value={progress.modus === 'frei' ? 'frei' : 'story'}
            onChange={onModus}
          />
          <Text style={type.small}>
            {progress.modus === 'frei'
              ? 'Alles ist offen, es gibt keine Geschichte. Dein Fortschritt in der Geschichte bleibt gespeichert.'
              : 'Kati führt dich durch Kapitel, die nach und nach neue Bereiche freischalten.'}
          </Text>
        </Card>
        <View style={styles.intro}>
          <Pressable onPress={tippeKati} accessibilityElementsHidden importantForAccessibility="no" style={{ opacity: 1 }}>
            <KatiAvatar size={52} />
          </Pressable>
          <Text style={[type.body, { flex: 1 }]}>
            Hi, ich bin Kati! Zusammen erkennen wir Krankheiten an Symptomen und Messwerten und treffen die richtigen
            Entscheidungen. Der Zustandsbalken zeigt, wie es unserem Patienten gerade geht.
          </Text>
        </View>
        {codeOffen && (
          <TextInput
            value={code}
            onChangeText={pruefeCode}
            autoFocus
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="·"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Code"
            style={[styles.codeFeld]}
          />
        )}

        <Text style={type.h2}>So läuft ein Einsatz</Text>
        {STEPS.map((s, i) => (
          <Card key={s.de}>
            <View style={styles.stepHead}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={type.h2}>{s.de}</Text>
            </View>
            <Text style={[type.body, { marginTop: spacing.sm }]}>{s.text}</Text>
          </Card>
        ))}

        <Text style={[type.h2, { marginTop: spacing.sm }]}>Das Spiel drumherum</Text>
        <Card>
          <Head icon="📅" color={colors.yellow} title="Tagesdienst" />
          <Text style={[type.body, { marginTop: spacing.sm }]}>
            Jeden Tag gibt es einen „Einsatz des Tages“ mit 50 % mehr Punkten. Wer {DAILY_GOAL} Einsätze an einem Tag schafft,
            erreicht das Tagesziel. Schaffe ich das mehrere Tage hintereinander, wächst meine Dienst-Serie – und der Bonus mit.
          </Text>
        </Card>
        <Card>
          <Head icon="🚑" color={colors.butter} title="Mein Rettungswagen" />
          <Text style={[type.body, { marginTop: spacing.sm }]}>
            Für jeden Punkt bekommt meine Wache 1 € Budget. In der Fahrzeughalle rüste ich damit Fahrzeug, Monitor, Rucksack,
            Beatmung, Trage, Funk und Einsatzkleidung in vier Stufen auf – jede Stufe ist neuer und moderner und hilft im Einsatz.
            Die höheren Stufen schalte ich mit meinem Dienstgrad frei. Einkaufen kostet nur Budget, keine Punkte – mein Rang
            bleibt.
          </Text>
        </Card>
        <Card>
          <Head icon="⚠️" color={colors.redTint} title="Zwischenfälle & Kinder" />
          <Text style={[type.body, { marginTop: spacing.sm }]}>
            Bei vielen Einsätzen passiert mitten in der Untersuchung etwas Unerwartetes – dann muss ich sofort richtig reagieren.
            Bei Kinder-Einsätzen gelten andere Normwerte für Puls, Atmung und Blutdruck (siehe Lexikon).
          </Text>
        </Card>
        <Card>
          <Head icon="🎚️" color={colors.blueTint} title="Schwierigkeit" />
          {DIFFICULTIES.map((d) => (
            <View key={d.id} style={{ marginTop: spacing.md }}>
              <Text style={type.headline}>
                {d.icon} {d.label}
              </Text>
              <Text style={type.small}>{d.description}</Text>
            </View>
          ))}
        </Card>
        <Card>
          <Head icon="🏅" color={colors.mintTint} title="Punkte" />
          <View style={{ marginTop: spacing.sm }}>
            <Row label="Wert richtig eingestuft" pts={POINTS.ratingCorrect} />
            <Row label="Wert falsch eingestuft" pts={POINTS.ratingWrong} />
            <Row label="Wichtigen Wert vergessen" pts={POINTS.missedKeyVital} />
            <Row label="Zeitbonus (max., −4 je unnötiger Messung)" pts={POINTS.efficiencyMax} />
            <Row label="Richtige Diagnose" pts={POINTS.diagnosisCorrect} />
            <Row label="Richtige Maßnahme" pts={POINTS.treatmentCorrect} />
            <Row label="Falsche Maßnahme" pts={POINTS.treatmentWrong} />
            <Row label="Zustand des Patienten am Ende (max.)" pts={POINTS.conditionMax} />
            <Row label="Zwischenfall richtig gemeistert" pts={INCIDENT_POINTS.correct} />
            <Row label="Zwischenfall falsch behandelt" pts={INCIDENT_POINTS.wrong} />
            <Row label="Tipp von Kati (nur auf Mittel)" pts={-10} />
            <Row label="Perfekter Einsatz (3 Sterne)" pts={POINTS.perfectBonus} />
            <Row label={`Serienbonus je gutem Einsatz in Folge (max. ${POINTS.streakMax})`} pts={POINTS.streakPerLevel} />
            <Row label="Neues Abzeichen" pts={BADGE_BONUS} />
            <Row label="Einsatz des Tages" pts={0} text="+50 %" />
            <Row
              label={`Tagesziel (${DAILY_GOAL} Einsätze), steigt mit der Dienst-Serie`}
              pts={dailyGoalBonus(1)}
              text={`+${dailyGoalBonus(1)}–${dailyGoalBonus(6)}`}
            />
            <Row label="Normwerte & Wissensfragen: je richtiger Antwort" pts={QUIZ_POINTS} />
            <Row label={`Großeinsatz: je richtig gesichteter Person (alle richtig: +${MANV_PERFECT_BONUS})`} pts={MANV_POINTS} />
            <Row label="Herzdruckmassage (ohne Taktgeber doppelt)" pts={CPR_POINTS} text={`bis +${CPR_POINTS * 2}`} />
          </View>
          <Text style={[type.small, { marginTop: spacing.sm }]}>
            {r.id === 'helfer'
              ? 'Alle Trainings (Notruf, Was zuerst?, Handgriffe, Mythen, Defi, Prüfung) geben Punkte für richtige Antworten und einen Bonus für fehlerfreie Runden.'
              : 'Auf „Mittel“ zählen alle Punkte eines Einsatzes ×1,5, auf „Schwer“ ×2. Die Detektiv-Akten haben ein eigenes Punktesystem (siehe dort).'}
          </Text>
        </Card>

        <Text style={[type.h2, { marginTop: spacing.sm }]}>Spielstand & Sicherheit</Text>
        <Transfer progress={progress} onImport={onImport} />
        <Card>
          <Head icon="🔒" color={colors.lilac} title="Datenschutz" />
          <Text style={[type.small, { marginTop: spacing.sm }]}>
            Einsatz 112 sammelt keine persönlichen Daten. Der Spielstand bleibt auf diesem Gerät. Die Web-Version zählt anonym,
            wie oft sie genutzt wird; Details und Einstellungen findest du hier.
          </Text>
          <Button
            label="Datenschutzerklärung"
            variant="outline"
            onPress={() => Linking.openURL(PRIVACY_URL)}
            style={{ marginTop: spacing.md }}
          />
        </Card>
        <Card>
          <Head icon="🗑️" color={colors.line} title="Neu anfangen" />
          <Text style={[type.small, { marginTop: spacing.sm }]}>
            Setzt Punkte, Rang, Sterne und Abzeichen auf null. Das lässt sich nicht rückgängig machen.
          </Text>
          {confirmReset ? (
            <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
              <Text style={type.headline}>Wirklich alles zurücksetzen?</Text>
              <Button label="Ja, alles löschen" variant="alarm" onPress={onReset} />
              <Button label="Abbrechen" variant="outline" onPress={() => setConfirmReset(false)} />
            </View>
          ) : (
            <Button
              label="Fortschritt zurücksetzen"
              variant="outline"
              onPress={() => setConfirmReset(true)}
              style={{ marginTop: spacing.md }}
            />
          )}
        </Card>
        <View style={styles.hint}>
          <Text style={styles.hintHead}>⚕️ Wichtiger Hinweis</Text>
          <Text style={styles.hintText}>
            Dieses Spiel dient dem Lernen und Üben. Die Inhalte sind vereinfacht und ersetzen keine Ausbildung, keine ärztliche
            Beratung und keine regionalen Leitlinien/SOPs. Im Notfall immer 112 wählen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/** Kopfzeile einer Karte: Symbol-Sticker und Titel */
function Head({ icon, color, title }: { icon: string; color: string; title: string }) {
  return (
    <View style={styles.head}>
      <IconTile icon={icon} color={color} size={40} />
      <Text style={[type.h2, { flex: 1 }]}>{title}</Text>
    </View>
  );
}

function Row({ label, pts, text }: { label: string; pts: number; text?: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.body, { flex: 1, fontSize: 15, lineHeight: 21 }]}>{label}</Text>
      <Text
        style={{ fontFamily: fonts.displayBlack, fontSize: 16, color: pts < 0 ? colors.red : colors.blue, letterSpacing: -0.3 }}
      >
        {text ?? `${pts > 0 ? '+' : ''}${pts}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  codeFeld: {
    alignSelf: 'center',
    width: 120,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 4,
  },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl + 8 },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.blueTint,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.ink },
  code: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: spacing.sm,
    marginTop: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
  hint: {
    backgroundColor: colors.redTint,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: spacing.lg,
    gap: 4,
  },
  hintHead: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.ink, letterSpacing: -0.3 },
  hintText: { fontFamily: fonts.medium, fontSize: 13.5, lineHeight: 19, color: colors.ink },
});
