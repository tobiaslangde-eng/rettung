import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { zaehle } from '../analytics';
import { AnswerOption } from '../components/Training';
import { TeilenKnopf } from '../components/TeilenKnopf';
import { Button, Card, TopBar } from '../components/UI';
import { schichtKarteSvg } from '../game/karten';
import { useRolle } from '../game/rolle';
import { SchichtFrage } from '../data/schichtChecks.types';
import { SCHICHT_EINSAETZE, SchichtStand, dienstzeit, schichtBilanz, schichtName, waehleCheck } from '../game/schicht';
import { shuffle } from '../game/scoring';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Schichtmodus: mehrere Einsätze hintereinander, dazwischen ein kurzer Check – am Ende die Schichtbilanz */
export function SchichtScreen({
  stand,
  onStart,
  onCheck,
  onWeiter,
  onAbschluss,
  onBack,
}: {
  /** null = noch keine Schicht begonnen */
  stand: SchichtStand | null;
  onStart: () => void;
  onCheck: (richtig: boolean, id: string) => void;
  onWeiter: () => void;
  onAbschluss: (bonus: number) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const name = schichtName(r.id);
  const einsaetze = stand?.sterne.length ?? 0;
  const checks = stand?.checks.length ?? 0;
  const bilanzPhase = stand !== null && einsaetze >= SCHICHT_EINSAETZE;
  // Die Check-Frage bleibt stehen, bis „Weiter“ gedrückt wird (auch nachdem die Antwort gezählt wurde)
  const [frage, setFrage] = useState<SchichtFrage | null>(null);
  useEffect(() => {
    if (stand && !bilanzPhase && einsaetze > checks && !frage) setFrage(waehleCheck(r.id, stand.benutzt));
  }, [einsaetze, checks, bilanzPhase]); // eslint-disable-line react-hooks/exhaustive-deps
  const pausePhase = stand !== null && !bilanzPhase && frage !== null;
  const optionen = useMemo(() => (frage ? shuffle(frage.optionen.map((o, i) => ({ o, richtig: i === 0 }))) : []), [frage]);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  useEffect(() => setGewaehlt(null), [frage]);

  // Schicht abschließen: Bonus genau einmal vergeben
  const abgeschlossen = useRef(false);
  const bilanz = stand ? schichtBilanz(stand) : null;
  useEffect(() => {
    if (bilanzPhase && bilanz && !abgeschlossen.current) {
      abgeschlossen.current = true;
      onAbschluss(bilanz.bonus);
      zaehle('schicht-beendet');
    }
  }, [bilanzPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  const kopf = (kicker: string, title: string) => <TopBar kicker={kicker} title={title} onBack={onBack} />;

  if (!stand) {
    return (
      <View style={{ flex: 1 }}>
        {kopf(r.titel, name)}
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ gap: spacing.sm }}>
            <Text style={styles.emoji}>⏱️</Text>
            <Text style={type.headline}>
              {r.id === 'helfer' ? 'Bereitschaft beim Stadtfest' : 'Dienstbeginn 07:00 auf der Wache'}
            </Text>
            <Text style={type.body}>
              {SCHICHT_EINSAETZE} Einsätze hintereinander. Dazwischen gibt es einen kurzen Check (
              {r.id === 'helfer' ? 'Material, Hygiene, Eigenschutz' : 'Fahrzeug, Material, Hygiene, Übergabe'}). Am Ende bekommst
              du eine Schichtbilanz mit Bonuspunkten.
            </Text>
          </Card>
          <Button label={`${name} beginnen`} variant="alarm" onPress={onStart} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  if (pausePhase && frage) {
    const fertig = gewaehlt !== null;
    return (
      <View style={{ flex: 1 }}>
        {kopf(`${name} · ${dienstzeit(einsaetze)} Uhr`, 'Kurzer Check in der Pause')}
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Text style={type.body}>
            Einsatz {einsaetze} von {SCHICHT_EINSAETZE} ist geschafft. Bevor es weitergeht, ein kurzer Check:
          </Text>
          <Card>
            <Text style={styles.frage}>{frage.frage}</Text>
          </Card>
          {optionen.map((x, k) => (
            <AnswerOption
              key={k}
              letter={LETTERS[k]}
              text={x.o}
              disabled={fertig}
              state={fertig ? (x.richtig ? 'right' : gewaehlt === k ? 'wrong' : 'dim') : 'idle'}
              onPress={() => {
                if (fertig) return;
                setGewaehlt(k);
                onCheck(x.richtig, frage.id);
              }}
            />
          ))}
          {fertig && (
            <>
              <Card style={{ gap: 4 }}>
                <Text style={type.headline}>{optionen[gewaehlt!].richtig ? 'Richtig' : 'Nicht ganz'}</Text>
                <Text style={type.body}>{frage.erklaerung}</Text>
              </Card>
              <Button
                label={`Weiter zu Einsatz ${einsaetze + 1}`}
                variant="alarm"
                onPress={() => {
                  setFrage(null);
                  onWeiter();
                }}
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  if (bilanzPhase && bilanz) {
    return (
      <View style={{ flex: 1 }}>
        {kopf(name, 'Schichtbilanz')}
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{bilanz.schnitt >= 2.5 ? '🏅' : bilanz.schnitt >= 1.5 ? '👍' : '💪'}</Text>
            <Text style={styles.big}>+{bilanz.bonus}</Text>
            <Text style={type.small}>Bonuspunkte für die {r.id === 'helfer' ? 'Bereitschaft' : 'Schicht'}</Text>
          </Card>
          <Card style={{ gap: 6 }}>
            <Text style={type.eyebrow}>Deine Einsätze</Text>
            {stand.sterne.map((s, k) => (
              <View key={k} style={styles.zeile}>
                <Text style={type.body}>
                  Einsatz {k + 1} · {dienstzeit(k + 1)} Uhr
                </Text>
                <Text style={styles.sterne}>{'★'.repeat(s) + '☆'.repeat(3 - s)}</Text>
              </View>
            ))}
            <View style={styles.zeile}>
              <Text style={type.body}>Checks in den Pausen</Text>
              <Text style={type.headline}>
                {bilanz.checksRichtig}/{SCHICHT_EINSAETZE - 1}
              </Text>
            </View>
          </Card>
          <TeilenKnopf
            art="schicht"
            titel="Meine Schichtbilanz"
            dateiname="schichtbilanz.png"
            svg={() =>
              schichtKarteSvg({
                rolle: r.id,
                titel: r.id === 'helfer' ? 'Bereitschaft geschafft' : 'Schicht geschafft',
                einsaetze: stand.sterne.length,
                sterne: bilanz.sterneGesamt,
                punkte: bilanz.bonus,
                checks: `${bilanz.checksRichtig} von ${SCHICHT_EINSAETZE - 1} Checks richtig`,
              })
            }
          />
          <Button label="Neue Schicht" variant="alarm" onPress={onStart} />
          <Button label="Zur Startseite" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular, textAlign: 'center' },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
  frage: { fontFamily: fonts.display, fontSize: 19, lineHeight: 26, color: colors.ink },
  zeile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sterne: { fontFamily: fonts.regular, fontSize: 20, color: colors.yellow },
});
