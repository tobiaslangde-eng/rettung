import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TonKnopf } from '../components/TonKnopf';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { Einsatzmittel, MITTEL_INFO } from '../data/leitstelle/types';
import { LEITSTELLE_MAX_FRAGEN, bewerteLeitstelle, waehleLeitstelle } from '../game/leitstelle';
import { useRolle } from '../game/rolle';
import { shuffle } from '../game/scoring';
import { sprich, stoppe } from '../game/sprache';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const MITTEL_ALLE: Einsatzmittel[] = ['rtw', 'nef', 'ktw', 'rth', 'feuerwehr', 'polizei'];

/** Leitstelle spielen: Anruf annehmen, richtig nachfragen, die passenden Einsatzmittel losschicken */
export function LeitstelleScreen({
  geloest,
  onFinish,
  onBack,
}: {
  geloest: string[];
  onFinish: (punkte: number, id: string | null) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [lauf, setLauf] = useState(0);
  const [letzte, setLetzte] = useState<string | undefined>(undefined);
  const sz = useMemo(() => waehleLeitstelle(geloest, letzte), [lauf]); // eslint-disable-line react-hooks/exhaustive-deps
  const reihenfolge = useMemo(() => shuffle(sz.fragen.map((_, i) => i)), [sz]);
  const [phase, setPhase] = useState<'anruf' | 'fragen' | 'mittel' | 'ende'>('anruf');
  const [gestellt, setGestellt] = useState<number[]>([]);
  const [gewaehlt, setGewaehlt] = useState<Einsatzmittel[]>([]);

  useEffect(() => {
    if (phase === 'anruf') sprich(sz.anruf, { aufgeregt: true });
    return () => stoppe();
  }, [sz, phase]);

  const frage = (i: number) => {
    if (gestellt.includes(i) || gestellt.length >= LEITSTELLE_MAX_FRAGEN) return;
    setGestellt([...gestellt, i]);
    sprich(sz.fragen[i].antwort, { aufgeregt: true });
  };
  const erg = bewerteLeitstelle(sz, gestellt, gewaehlt);

  const abschicken = () => {
    onFinish(erg.punkte, erg.geloest ? sz.id : null);
    setPhase('ende');
    stoppe();
  };
  const neu = () => {
    setLetzte(sz.id);
    setLauf(lauf + 1);
    setPhase('anruf');
    setGestellt([]);
    setGewaehlt([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Leitstelle spielen" title={phase === 'ende' ? 'Einsatz disponiert' : 'Notruf 112'} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <TonKnopf />
        <Card style={{ gap: spacing.sm, borderLeftColor: colors.red }}>
          <Text style={type.eyebrow}>📞 Eingehender Anruf</Text>
          <Text style={styles.zitat}>„{sz.anruf}“</Text>
        </Card>

        {phase === 'anruf' && (
          <>
            <Text style={type.body}>
              Du bist in der Leitstelle. Frage nach, was für den Einsatz wichtig ist – aber du hast nur Zeit für{' '}
              {LEITSTELLE_MAX_FRAGEN} Fragen. Danach schickst du die passenden Fahrzeuge los.
            </Text>
            <Button label="Rückfragen stellen" onPress={() => setPhase('fragen')} />
          </>
        )}

        {(phase === 'fragen' || phase === 'mittel' || phase === 'ende') && (
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>
              Rückfragen {gestellt.length}/{LEITSTELLE_MAX_FRAGEN}
            </Text>
            {reihenfolge.map((i) => {
              const f = sz.fragen[i];
              const gefragt = gestellt.includes(i);
              const aktiv = phase === 'fragen';
              const zeigeWichtig = phase === 'ende';
              return (
                <Tap
                  key={i}
                  disabled={!aktiv || gefragt || gestellt.length >= LEITSTELLE_MAX_FRAGEN}
                  onPress={() => frage(i)}
                  accessibilityLabel={f.text}
                  style={[
                    styles.frage,
                    gefragt && { backgroundColor: colors.surface2, borderColor: r.akzent },
                    !gefragt && (!aktiv || gestellt.length >= LEITSTELLE_MAX_FRAGEN) && { opacity: 0.5 },
                    zeigeWichtig && f.wichtig && !gefragt && { borderColor: colors.orange, backgroundColor: colors.peach },
                  ]}
                >
                  <Text style={styles.frageText}>
                    {gefragt ? '🎙️' : '❓'} {f.text}
                  </Text>
                  {gefragt && <Text style={styles.antwort}>„{f.antwort}“</Text>}
                  {zeigeWichtig && f.wichtig && (
                    <Text style={[styles.antwort, { color: gefragt ? colors.mintDark : colors.orange, fontFamily: fonts.bold }]}>
                      {gefragt ? '✓ wichtig, gut gefragt' : 'wichtig – das hast du nicht gefragt'}
                    </Text>
                  )}
                </Tap>
              );
            })}
            {phase === 'fragen' && (
              <Button label="Einsatzmittel wählen" onPress={() => setPhase('mittel')} disabled={gestellt.length === 0} />
            )}
          </Card>
        )}

        {(phase === 'mittel' || phase === 'ende') && (
          <Card style={{ gap: spacing.sm }}>
            <Text style={type.eyebrow}>Wen schickst du los?</Text>
            {MITTEL_ALLE.map((m) => {
              const an = gewaehlt.includes(m);
              const info = MITTEL_INFO[m];
              const richtig = sz.mittel.includes(m);
              const ende = phase === 'ende';
              return (
                <Tap
                  key={m}
                  offset={0}
                  disabled={ende}
                  onPress={() => setGewaehlt(an ? gewaehlt.filter((x) => x !== m) : [...gewaehlt, m])}
                  accessibilityLabel={info.name}
                  style={[
                    styles.mittel,
                    an && !ende && { borderColor: r.akzent, backgroundColor: r.akzentTint },
                    ende && an && richtig && { borderColor: colors.mintDark, backgroundColor: colors.mintTint },
                    ende && an && !richtig && { borderColor: colors.red, backgroundColor: colors.redTint },
                    ende && !an && richtig && { borderColor: colors.orange, backgroundColor: colors.peach },
                  ]}
                >
                  <Text style={styles.mittelIcon}>{info.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mittelName}>{info.name}</Text>
                    <Text style={type.small}>{info.kurz}</Text>
                  </View>
                  <Text style={styles.haken}>{ende ? (an && richtig ? '✓' : an ? '✗' : richtig ? '!' : '') : an ? '✓' : ''}</Text>
                </Tap>
              );
            })}
            {phase === 'mittel' && (
              <Button label="Einsatz freigeben" variant="alarm" onPress={abschicken} disabled={gewaehlt.length === 0} />
            )}
          </Card>
        )}

        {phase === 'ende' && (
          <>
            <Card style={{ alignItems: 'center', gap: spacing.xs }}>
              <Text style={styles.emoji}>{erg.geloest ? '🏅' : erg.punkte >= 30 ? '👍' : '💪'}</Text>
              <Text style={styles.big}>+{erg.punkte}</Text>
              <Text style={type.small}>
                {erg.wichtigGefragt}/{erg.wichtigGesamt} wichtige Fragen · {erg.richtig.length}/{sz.mittel.length} richtige
                Fahrzeuge
                {erg.falsch.length > 0 ? ` · ${erg.falsch.length} unnötig` : ''}
              </Text>
            </Card>
            <Card style={{ gap: spacing.sm }}>
              <Text style={type.eyebrow}>Das solltest du mitnehmen</Text>
              <Text style={type.body}>{sz.erklaerung}</Text>
              {!!sz.anweisung && (
                <View style={styles.anweisung}>
                  <Text style={type.small}>Deine Anweisung an den Anrufer:</Text>
                  <Text style={type.body}>„{sz.anweisung}“</Text>
                </View>
              )}
            </Card>
            <Button label="Nächster Anruf" onPress={neu} />
            <Button label="Zurück" variant="outline" onPress={onBack} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  zitat: { fontFamily: fonts.display, fontSize: 19, lineHeight: 26, color: colors.ink },
  frage: {
    gap: 4,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  frageText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  antwort: { fontFamily: fonts.italic, fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  mittel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  mittelIcon: { fontSize: 28, fontFamily: fonts.regular, width: 38, textAlign: 'center' },
  mittelName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  haken: { fontFamily: fonts.extrabold, fontSize: 20, width: 24, textAlign: 'center', color: colors.ink },
  anweisung: { backgroundColor: colors.yellowTint, borderRadius: 12, padding: spacing.md, gap: 4 },
  emoji: { fontSize: 44, lineHeight: 52, fontFamily: fonts.regular },
  big: { fontFamily: fonts.displayBlack, fontSize: 46, lineHeight: 52, color: colors.ink },
});
