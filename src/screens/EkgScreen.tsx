import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { zaehle } from '../analytics';
import { EkgStreifen } from '../components/EkgStreifen';
import { AnswerOption } from '../components/Training';
import { Button, Card, Segmented, TopBar } from '../components/UI';
import { EKG_BY_ID, EKG_LISTE, EKG_RUNDEN, EkgFrage, ekgFragen, ekgFrequenz, ekgKurve } from '../game/ekg';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

type Stufe = 'grund' | 'alle';

/** EKG lesen: Rhythmen auf dem Streifen erkennen – von Sinusrhythmus bis Kammerflimmern */
export function EkgScreen({ onFinish, onBack }: { onFinish: (richtig: number, punkte: number) => void; onBack: () => void }) {
  const L = useLayout();
  const r = useRolle();
  const [stufe, setStufe] = useState<Stufe>('grund');
  const [phase, setPhase] = useState<'start' | 'frage' | 'ende'>('start');
  const [fragen, setFragen] = useState<EkgFrage[]>([]);
  const [i, setI] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [richtig, setRichtig] = useState(0);
  const f = fragen[i];
  const def = f ? EKG_BY_ID[f.id] : null;
  const hf = useMemo(() => (f ? ekgFrequenz(f.id, ekgKurve(f.id, f.seed)) : null), [f]);
  const fertig = gewaehlt !== null;
  const wide = L.wide && styles.wide;

  const starte = () => {
    setFragen(ekgFragen(stufe === 'grund'));
    setI(0);
    setGewaehlt(null);
    setRichtig(0);
    setPhase('frage');
    zaehle('ekg-gestartet-' + stufe);
  };
  const tippe = (k: number) => {
    if (fertig || !f) return;
    setGewaehlt(k);
    if (f.optionen[k] === f.id) setRichtig(richtig + 1);
  };
  const weiter = () => {
    if (i + 1 < fragen.length) {
      setI(i + 1);
      setGewaehlt(null);
    } else {
      const punkte = richtig * 6 + (richtig >= EKG_RUNDEN - 1 ? 10 : 0);
      onFinish(richtig, punkte);
      zaehle('ekg-beendet');
      setPhase('ende');
    }
  };

  if (phase === 'start') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="EKG lesen" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.headline}>📈 Welcher Rhythmus ist das?</Text>
            <Text style={type.body}>
              Du siehst {EKG_RUNDEN} Streifen wie auf dem Monitor im Rettungswagen (Ableitung II) und ordnest sie ein. Jeder
              Streifen sieht etwas anders aus.
            </Text>
          </Card>
          <Card style={{ gap: 6 }}>
            <Text style={[type.headline, { fontSize: 16 }]}>So gehst du vor – immer in dieser Reihenfolge</Text>
            <Text style={type.body}>1. Regelmäßig? Sind die Abstände von R zu R gleich?</Text>
            <Text style={type.body}>2. Frequenz: QRS-Komplexe auf 6 Sekunden zählen und mal 10 nehmen.</Text>
            <Text style={type.body}>3. Steht vor jedem QRS eine P-Welle?</Text>
            <Text style={type.body}>4. Ist das QRS schmal (unter 3 kleine Kästchen) oder breit?</Text>
          </Card>
          <Card style={{ gap: spacing.sm }}>
            <Text style={styles.label}>WELCHE RHYTHMEN?</Text>
            <Segmented
              options={[
                { id: 'grund', label: 'Grundlagen' },
                { id: 'alle', label: 'Alle' },
              ]}
              value={stufe}
              onChange={setStufe}
            />
            <Text style={type.small}>
              {stufe === 'grund'
                ? 'Sinusrhythmus, Tachykardie, Bradykardie, Kammertachykardie, Kammerflimmern, Asystolie.'
                : `Alle ${EKG_LISTE.length} Rhythmen, dazu Vorhofflimmern, Vorhofflattern, VES, SVT, AV-Blöcke und ST-Hebung.`}
            </Text>
          </Card>
          <Button label="Los geht's" onPress={starte} />
          <Text style={type.small}>
            Lernspiel mit vereinfachten Beispielen. Echte EKGs sind oft verrauschter. Im Einsatz gelten die Anweisungen deines
            Rettungsdienstes (SOP) und des Notarztes.
          </Text>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'ende') {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Training" title="Geschafft" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, wide]}>
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.emoji}>{richtig >= 9 ? '🏆' : richtig >= 6 ? '👍' : '💪'}</Text>
            <Text style={styles.big}>
              {richtig}/{fragen.length}
            </Text>
            <Text style={[type.headline, { color: r.akzentDunkel }]}>
              +{richtig * 6 + (richtig >= EKG_RUNDEN - 1 ? 10 : 0)} EP
            </Text>
            <Text style={type.small}>
              {richtig >= 9 ? 'Sehr stark: du liest EKGs schon sicher.' : 'Übung macht den Meister – probier eine neue Runde.'}
            </Text>
          </Card>
          <Button label="Noch eine Runde" onPress={starte} />
          <Button label="Zurück" variant="outline" onPress={onBack} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`EKG · ${i + 1}/${fragen.length}`} title="Welcher Rhythmus?" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, wide]}>
        <View style={styles.dots}>
          {fragen.map((_, n) => (
            <View key={n} style={[styles.dot, n < i + (fertig ? 1 : 0) && { backgroundColor: r.akzent }]} />
          ))}
        </View>
        <EkgStreifen id={f.id} seed={f.seed} />
        {f.optionen.map((o, k) => (
          <AnswerOption
            key={o}
            letter={LETTERS[k]}
            text={EKG_BY_ID[o].name}
            disabled={fertig}
            state={fertig ? (o === f.id ? 'right' : gewaehlt === k ? 'wrong' : 'dim') : 'idle'}
            onPress={() => tippe(k)}
          />
        ))}
        {fertig && def && (
          <>
            <Card style={{ gap: spacing.xs, borderLeftColor: f.optionen[gewaehlt!] === f.id ? colors.mint : colors.red }}>
              <Text style={type.headline}>
                {f.optionen[gewaehlt!] === f.id ? 'Richtig' : 'Nicht ganz'}: {def.name}
              </Text>
              {hf !== null && <Text style={[type.small, { fontFamily: fonts.bold }]}>Frequenz hier: etwa {hf} pro Minute</Text>}
              {def.merkmale.map((m, k) => (
                <Text key={k} style={type.body}>
                  • {m}
                </Text>
              ))}
              <Text style={[type.body, { marginTop: 4 }]}>{def.erklaerung}</Text>
            </Card>
            <Card style={{ gap: 4 }}>
              <Text style={styles.label}>IM RETTUNGSDIENST</Text>
              <Text style={type.body}>{def.handeln}</Text>
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
  label: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 0.8, color: colors.muted },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular, textAlign: 'center' },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
