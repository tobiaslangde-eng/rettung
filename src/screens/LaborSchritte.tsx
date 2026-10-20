import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Konfetti } from '../components/Konfetti';
import { LaborSzene } from '../components/LaborSzene';
import { TonKnopf } from '../components/TonKnopf';
import { Button, Card, Tap } from '../components/UI';
import { LaborUebung } from '../data/labor';
import { useRolle } from '../game/rolle';
import { shuffle } from '../game/scoring';
import { sprich, stoppe, tonAn } from '../game/sprache';
import { colors, fonts, spacing, type } from '../theme';

/** Eine Übung des Handgriff-Labors: Schritt für Schritt wählen, tippen oder gedrückt halten */
export function LaborSchritte({
  uebung,
  onFertig,
  fertigPunkte,
}: {
  uebung: LaborUebung;
  onFertig: (fehler: number) => void;
  fertigPunkte: number | null;
}) {
  const r = useRolle();
  const [i, setI] = useState(0);
  const [fehler, setFehler] = useState(0);
  const [falsch, setFalsch] = useState<number[]>([]);
  const [geschafft, setGeschafft] = useState<number | null>(null);
  const [zaehler, setZaehler] = useState(0);
  const [gehalten, setGehalten] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Reihenfolge der Antworten je Schritt, damit die richtige nicht immer oben steht */
  const ordnung = useMemo(
    () => uebung.schritte.map((st) => (st.art === 'waehle' ? shuffle(st.optionen.map((_, k) => k)) : [])),
    [uebung],
  );
  const schritt = uebung.schritte[i];
  const letzter = i === uebung.schritte.length - 1;
  const fertig = fertigPunkte !== null;

  useEffect(() => {
    if (tonAn()) sprich(schritt.text);
  }, [i, schritt.text]);
  useEffect(
    () => () => {
      stoppe();
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const weiter = () => {
    if (letzter) {
      onFertig(fehler);
      setGeschafft(null);
      return;
    }
    setI(i + 1);
    setFalsch([]);
    setGeschafft(null);
    setZaehler(0);
    setGehalten(0);
  };

  const waehle = (k: number) => {
    if (schritt.art !== 'waehle' || geschafft !== null || fertig) return;
    const o = schritt.optionen[k];
    if (o.richtig) setGeschafft(k);
    else if (!falsch.includes(k)) {
      setFalsch([...falsch, k]);
      setFehler(fehler + 1);
    }
  };

  const tippe = () => {
    if (schritt.art !== 'zaehle' || geschafft !== null || fertig) return;
    const n = zaehler + 1;
    setZaehler(n);
    if (n >= schritt.anzahl) setGeschafft(0);
  };

  const halteStart = () => {
    if (schritt.art !== 'halte' || geschafft !== null || fertig || timer.current) return;
    let ms = 0;
    timer.current = setInterval(() => {
      ms += 100;
      setGehalten(ms);
      if (ms >= schritt.sekunden * 1000) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setGeschafft(0);
      }
    }, 100);
  };
  const halteEnde = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (geschafft === null) setGehalten(0);
  };

  return (
    <>
      <Card style={{ gap: spacing.xs }}>
        <Text style={type.eyebrow}>{fertig ? 'Geschafft' : `Schritt ${i + 1} von ${uebung.schritte.length}`}</Text>
        <Text style={type.headline}>{fertig ? 'Alle Schritte richtig – gut gemacht!' : schritt.text}</Text>
        <TonKnopf />
      </Card>
      <View style={{ alignItems: 'center' }}>
        <LaborSzene szene={uebung.szene} schritt={fertig ? uebung.schritte.length : i} zaehler={zaehler} />
      </View>
      {!fertig && schritt.art === 'waehle' && (
        <View style={{ gap: spacing.sm }}>
          {ordnung[i].map((k) => {
            const o = schritt.optionen[k];
            const richtig = geschafft === k;
            const schlecht = falsch.includes(k);
            return (
              <Tap
                key={k}
                onPress={() => waehle(k)}
                disabled={geschafft !== null}
                accessibilityLabel={o.label}
                style={[
                  styles.option,
                  richtig && { backgroundColor: colors.mintTint, borderColor: colors.mintDark },
                  schlecht && { backgroundColor: colors.redTint, borderColor: colors.red },
                  geschafft !== null && !richtig && { opacity: 0.5 },
                ]}
              >
                <Text style={styles.optIcon}>{o.icon}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[type.headline, { fontSize: 15 }]}>{o.label}</Text>
                  {schlecht && !!o.warum && <Text style={[type.small, { color: colors.redDark }]}>{o.warum}</Text>}
                </View>
              </Tap>
            );
          })}
        </View>
      )}
      {!fertig && schritt.art === 'zaehle' && (
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <Tap
            onPress={tippe}
            disabled={geschafft !== null}
            accessibilityLabel={schritt.knopf}
            style={[styles.gross, { borderColor: r.akzent }, geschafft !== null && { opacity: 0.5 }]}
          >
            <Text style={styles.grossText}>{schritt.knopf}</Text>
          </Tap>
          <Text style={type.small}>
            {zaehler} von {schritt.anzahl}
          </Text>
        </View>
      )}
      {!fertig && schritt.art === 'halte' && (
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <Pressable
            onPressIn={halteStart}
            onPressOut={halteEnde}
            accessibilityRole="button"
            accessibilityLabel={schritt.knopf}
            style={[styles.gross, { borderColor: r.akzent }, geschafft !== null && { opacity: 0.5 }]}
          >
            <Text style={styles.grossText}>{schritt.knopf}</Text>
          </Pressable>
          <View style={styles.balken}>
            <View
              style={[
                styles.fuellung,
                { backgroundColor: r.akzent, width: `${Math.min(100, (gehalten / (schritt.sekunden * 1000)) * 100)}%` },
              ]}
            />
          </View>
          <Text style={type.small}>Nicht loslassen, bis der Balken voll ist.</Text>
        </View>
      )}
      {!fertig && geschafft !== null && (
        <Card style={{ gap: spacing.sm, borderLeftColor: colors.mintDark }}>
          <Text style={[type.headline, { color: colors.mintDark }]}>✓ Richtig</Text>
          <Text style={type.body}>{schritt.gut}</Text>
          <Button label={letzter ? 'Fertig' : 'Weiter'} onPress={weiter} />
        </Card>
      )}
      {fertig && fehler === 0 && <Konfetti />}
      {fertig && (
        <Card style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text style={styles.emoji}>🏅</Text>
          <Text style={[type.headline, { color: r.akzentDunkel }]}>+{fertigPunkte} Punkte</Text>
          {fehler === 0 && <Text style={type.small}>Ohne Fehler – Bonus!</Text>}
          <Text style={[type.small, { textAlign: 'center' }]}>{uebung.merke}</Text>
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  optIcon: { fontSize: 26, width: 36, textAlign: 'center', fontFamily: fonts.regular },
  gross: {
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: colors.surface,
    minWidth: 240,
    alignItems: 'center',
  },
  grossText: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink, textAlign: 'center' },
  balken: { width: 240, height: 12, borderRadius: 6, backgroundColor: colors.line, overflow: 'hidden' },
  fuellung: { height: 12, borderRadius: 6 },
  emoji: { fontSize: 40, lineHeight: 46, fontFamily: fonts.regular },
});
