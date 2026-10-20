import { StyleSheet, Text, View } from 'react-native';
import { Card, Segmented, Tap } from '../components/UI';
import { DIFFICULTIES, DIFFICULTY_BY_ID, Difficulty } from '../game/difficulty';
import { dayState, DAILY_GOAL } from '../game/daily';
import { useRolle } from '../game/rolle';
import { freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { colors, fonts, spacing, tiles, type } from '../theme';

/** Spielmodi: alles, was man als eigenes Spiel starten kann */
export function SpielmodiView({
  progress,
  onStart,
  onDaily,
  onSchicht,
  onKarte,
  onDuell,
  onDifficulty,
}: {
  progress: Progress;
  onStart: () => void;
  onDaily: () => void;
  onSchicht: () => void;
  onKarte: () => void;
  onDuell: () => void;
  onDifficulty: (d: Difficulty) => void;
}) {
  const r = useRolle();
  const helfer = r.id === 'helfer';
  const day = dayState(progress);
  const frei = istFrei(r.id, progress, 'einsatz');
  const gesperrt = `Wird in Kapitel ${freiAb(r.id, 'einsatz')} freigeschaltet`;

  const modi: {
    icon: string;
    titel: string;
    text: string;
    stand: string;
    tint: keyof typeof tiles;
    name: string;
    aktion: () => void;
    gesperrt?: boolean;
  }[] = [
    {
      icon: helfer ? '🩹' : '🚑',
      titel: helfer ? 'Notfall im Alltag' : 'Einsatz',
      text: helfer
        ? 'Ein Notfall nach dem anderen: prüfen, erkennen, richtig handeln.'
        : 'Patient untersuchen, Werte messen, Diagnose stellen.',
      stand: `${progress.casesPlayed} gespielt`,
      tint: helfer ? 'teal' : 'red',
      name: helfer ? 'Notfall starten' : 'Einsatz starten',
      aktion: onStart,
      gesperrt: !frei,
    },
    {
      icon: '⭐',
      titel: `${r.einsatz} des Tages`,
      text: 'Jeden Tag ein neuer Fall mit +50 % EP.',
      stand: day.dailyCaseDone ? 'Heute erledigt ✓' : `Tagesziel ${Math.min(day.cases, DAILY_GOAL)}/${DAILY_GOAL}`,
      tint: 'pink',
      name: `${r.einsatz} des Tages`,
      aktion: onDaily,
      gesperrt: !frei || day.dailyCaseDone,
    },
    {
      icon: '⏱️',
      titel: helfer ? 'Bereitschaftsdienst' : 'Schichtmodus',
      text: '4 Einsätze am Stück mit Check-Fragen und Dienstbilanz.',
      stand: `${progress.schichten} Schichten geschafft`,
      tint: 'blue',
      name: helfer ? 'Bereitschaftsdienst' : 'Schicht',
      aktion: onSchicht,
      gesperrt: !frei,
    },
    {
      icon: '🗺️',
      titel: 'Stadtkarte',
      text: 'Einsätze wählen, Staus umfahren, schnell vor Ort sein.',
      stand: `${progress.kartenEinsaetze} angefahren`,
      tint: 'green',
      name: 'Stadtkarte',
      aktion: onKarte,
      gesperrt: !frei,
    },
    {
      icon: '⚔️',
      titel: 'Duell mit Freunden',
      text: '5 Fragen, ein Link – wer schlägt dich?',
      stand: `${progress.duellSiege} Siege · ${progress.duellGespielt} Duelle`,
      tint: 'violet',
      name: 'Duell mit Freunden',
      aktion: onDuell,
    },
  ];

  return (
    <View style={{ gap: spacing.md }}>
      <Text style={type.body}>Hier startest du ein Spiel. Jeder Modus bringt EP und Coins.</Text>
      {!helfer && frei && (
        <Card style={{ gap: spacing.xs }}>
          <Text style={type.eyebrow}>Schwierigkeit für Einsätze</Text>
          <Segmented
            options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
            value={progress.difficulty}
            onChange={onDifficulty}
          />
          <Text style={type.small}>{DIFFICULTY_BY_ID[progress.difficulty].description}</Text>
        </Card>
      )}
      {modi.map((m) => {
        const t = tiles[m.tint];
        return (
          <Tap
            key={m.name}
            onPress={m.gesperrt ? undefined : m.aktion}
            disabled={m.gesperrt}
            accessibilityLabel={m.name}
            style={[styles.karte, { backgroundColor: t.bg, borderColor: t.edge }, m.gesperrt && { opacity: 0.6 }]}
          >
            <View style={[styles.icon, { backgroundColor: colors.veil }]}>
              <Text style={styles.iconText}>{m.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[type.headline, { fontSize: 17 }]}>{m.titel}</Text>
              <Text style={type.small}>{m.text}</Text>
              <Text style={[styles.stand, { color: t.accent }]}>{m.gesperrt && !frei ? `🔒 ${gesperrt}` : m.stand}</Text>
            </View>
            <Text style={[styles.pfeil, { color: t.accent }]}>›</Text>
          </Tap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  karte: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: 22, borderWidth: 1 },
  icon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 28, fontFamily: fonts.regular },
  stand: { fontFamily: fonts.bold, fontSize: 12.5, marginTop: 2 },
  pfeil: { fontFamily: fonts.displayBlack, fontSize: 28 },
});
