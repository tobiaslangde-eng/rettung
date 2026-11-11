import { StyleSheet, Text, View } from 'react-native';
import { Card, Segmented, Tap } from '../components/UI';
import { DIFFICULTIES, DIFFICULTY_BY_ID, Difficulty } from '../game/difficulty';
import { dayState, DAILY_GOAL } from '../game/daily';
import { useRolle } from '../game/rolle';
import { freiAb, istFrei } from '../game/story';
import { Progress } from '../game/storage';
import { WOCHEN_BONUS, wochenStand } from '../game/woche';
import { schwacheFaelle } from '../game/lernstand';
import { CASES } from '../data/cases';
import { HELFER_FAELLE } from '../data/helfer';
import { einsaetzeUebrig, plusGesperrt, useKontoStore } from '../game/konto';
import { colors, fonts, spacing, tiles, type } from '../theme';

/** Spielmodi: alles, was man als eigenes Spiel starten kann */
export function SpielmodiView({
  progress,
  onStart,
  onDaily,
  onSchicht,
  onKarte,
  onDuell,
  onLive,
  onEkg,
  onSimulator,
  onLernstand,
  onWiederholen,
  onWoche,
  onDifficulty,
  onZeitdruck,
}: {
  progress: Progress;
  onStart: () => void;
  onDaily: () => void;
  onSchicht: () => void;
  onKarte: () => void;
  onDuell: () => void;
  onLive: () => void;
  onEkg: () => void;
  onSimulator: () => void;
  onLernstand: () => void;
  onWiederholen: () => void;
  onWoche: () => void;
  onDifficulty: (d: Difficulty) => void;
  onZeitdruck: (an: boolean) => void;
}) {
  const r = useRolle();
  const konto = useKontoStore();
  const helfer = r.id === 'helfer';
  const day = dayState(progress);
  const frei = istFrei(r.id, progress, 'einsatz');
  const gesperrt = `Wird in Kapitel ${freiAb(r.id, 'einsatz')} freigeschaltet`;
  const woche = wochenStand(progress);
  const schwach = (helfer ? schwacheFaelle(HELFER_FAELLE, progress.bestStars) : schwacheFaelle(CASES, progress.bestStars)).length;

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
    ...(helfer
      ? []
      : [
          {
            icon: '🗓️',
            titel: 'Wochen-Challenge',
            text: `Thema der Woche: ${woche.thema.title}. ${woche.ziel} Einsätze daraus bringen +${WOCHEN_BONUS} EP.`,
            stand: woche.fertig ? 'Diese Woche geschafft ✓' : `${woche.geschafft}/${woche.ziel} geschafft`,
            tint: 'violet' as keyof typeof tiles,
            name: 'Wochen-Challenge',
            aktion: onWoche,
            gesperrt: !frei,
          },
          {
            icon: '🫀',
            titel: 'Patienten-Simulator',
            text: 'Echtzeit-Einsatz mit Monitor, Defi, Notarzt und Zeitdruck: Der Patient reagiert auf alles, was du tust.',
            stand: `${progress.simGespielt} gespielt · ${progress.simUebergeben} übergeben`,
            tint: 'ink' as keyof typeof tiles,
            name: 'Patienten-Simulator',
            aktion: onSimulator,
          },
          {
            icon: '📈',
            titel: 'EKG lesen',
            text: 'Rhythmen auf dem Streifen erkennen: von Sinusrhythmus bis Kammerflimmern.',
            stand: `${progress.ekgRichtig} richtig eingeordnet`,
            tint: 'red' as keyof typeof tiles,
            name: 'EKG lesen',
            aktion: onEkg,
          },
        ]),
    {
      icon: '🔁',
      titel: 'Wiederholen',
      text: 'Einsätze, die noch nicht sitzen: Hier bekommst du genau die, die du bisher nur mit wenig Sternen geschafft hast.',
      stand: schwach > 0 ? `${schwach} zum Wiederholen` : 'Alles sitzt – noch nichts zu wiederholen',
      tint: 'green',
      name: 'Wiederholen',
      aktion: onWiederholen,
      gesperrt: !frei,
    },
    {
      icon: '📊',
      titel: 'Mein Lernstand',
      text: 'Wo bin ich stark, wo sollte ich noch üben? Auswertung nach Bereichen.',
      stand: `${Object.keys(progress.bestStars).length} Einsätze gespielt`,
      tint: 'blue',
      name: 'Mein Lernstand',
      aktion: onLernstand,
    },
    {
      icon: '👥',
      titel: 'Live-Runde mit Freunden',
      text: 'Wie Kahoot: Raum öffnen, PIN teilen, live gegeneinander oder gemeinsam spielen.',
      stand: `${progress.liveGespielt} Runden · ${progress.liveSiege} Siege`,
      tint: 'pink',
      name: 'Live-Runde mit Freunden',
      aktion: onLive,
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
          <Text style={[type.eyebrow, { marginTop: spacing.sm }]}>Zeitdruck</Text>
          <Segmented
            options={[
              { id: 'aus', label: 'Aus' },
              { id: 'an', label: '⏱ An' },
            ]}
            value={progress.zeitdruck ? 'an' : 'aus'}
            onChange={(v) => onZeitdruck(v === 'an')}
          />
          <Text style={type.small}>
            Mit Zeitdruck läuft eine Uhr (je nach Stufe 2 bis 3 Minuten). Wer mit mindestens 30 Sekunden Rest fertig ist, bekommt +25 EP. Ist die Zeit um, verliert der Patient zusätzlich Kraft.
          </Text>
        </Card>
      )}
      {modi.map((m) => {
        const t = tiles[m.tint];
        // Store-Demo: Plus-Hinweise ohne Plus
        const bereichVon: Record<string, string> = { Stadtkarte: 'karte', 'EKG lesen': 'ekg', 'Mein Lernstand': 'lernstand', 'Duell mit Freunden': 'duell', Schicht: 'schicht' };
        const uebrig = einsaetzeUebrig(konto, r.id);
        const einsatzKachel = m.name === 'Einsatz starten' || m.name === 'Notfall starten' || m.name === `${r.einsatz} des Tages` || m.name === 'Wiederholen' || m.name === 'Wochen-Challenge';
        const plusText =
          bereichVon[m.name] && plusGesperrt(bereichVon[m.name], r.id, konto)
            ? '🔒 Plus'
            : einsatzKachel && uebrig !== null
              ? uebrig > 0
                ? `Heute noch ${uebrig} freie${uebrig === 1 ? 'r' : ''} Einsatz${uebrig === 1 ? '' : 'e'} · mehr mit Plus`
                : '🔒 Heute keine freien Einsätze mehr · Plus'
              : null;
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
              <Text style={[styles.stand, { color: t.accent }]}>{m.gesperrt && !frei ? `🔒 ${gesperrt}` : (plusText ?? m.stand)}</Text>
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
