import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KatiAvatar } from '../components/Kati';
import { Button, Tap } from '../components/UI';
import { useRolle } from '../game/rolle';
import { colors, fonts, radius, spacing, tiles, type } from '../theme';

interface Zeile {
  icon: string;
  titel: string;
  text: string;
}
interface Schritt {
  kicker: string;
  titel: string;
  text?: string;
  kati?: boolean;
  zeilen?: Zeile[];
}

/** Kurze Einführung für neue Spieler (Overlay): Ziel, Menü, Lernpfad, EP/Level/Coins, Serie */
export function Einfuehrung({ onFertig }: { onFertig: () => void }) {
  const r = useRolle();
  const helfer = r.id === 'helfer';
  const [i, setI] = useState(0);
  const schritte: Schritt[] = [
    {
      kicker: 'Willkommen',
      titel: 'Hi, ich bin Kati!',
      kati: true,
      text: helfer
        ? 'Ich zeige dir in einer Minute, wie Einsatz 112 funktioniert. Du übst Erste Hilfe an kleinen Notfällen – nach jeder Antwort erkläre ich dir, was richtig war.'
        : 'Ich zeige dir in einer Minute, wie Einsatz 112 funktioniert. Du übst Einsätze im Rettungsdienst – nach jeder Antwort erkläre ich dir, was richtig war.',
      zeilen: [
        {
          icon: '🎯',
          titel: 'Dein Ziel',
          text: 'Sammle EP, steige im Level auf, erreiche höhere Dienstgrade und rüste dein Fahrzeug aus.',
        },
      ],
    },
    {
      kicker: 'Orientierung',
      titel: 'Wo finde ich was?',
      zeilen: [
        { icon: '🏠', titel: 'Start', text: 'Dein Tag auf einen Blick: Was steht heute an? Mit einem Tipp geht es los.' },
        { icon: '🎓', titel: 'Training', text: 'Lernpfad, alle Übungen und Spielmodi wie Schicht, Karte und Duell.' },
        {
          icon: helfer ? '🚗' : '🚑',
          titel: helfer ? 'Auto' : 'Fahrzeug',
          text: 'Hier gibst du Coins für bessere Ausrüstung aus.',
        },
        { icon: '📖', titel: 'Lexikon', text: 'Nachschlagen und suchen – auch mit „Frag Kati“.' },
        { icon: '⚙️', titel: 'Mehr', text: 'Einstellungen, Anleitung, Spielstand sichern.' },
      ],
    },
    {
      kicker: 'So kommst du voran',
      titel: 'Der Lernpfad',
      text: 'Im Training findest du den Lernpfad: Kapitel für Kapitel von oben nach unten, wie ein Weg. Jedes Kapitel hat eine kleine Aufgabe und schaltet Neues frei. Wer lieber frei übt, nimmt „Üben“ oder „Spielmodi“.',
      zeilen: [{ icon: '✅', titel: 'Aufgabe geschafft?', text: 'Dann schließt du das Kapitel ab und bekommst Bonus-EP.' }],
    },
    {
      kicker: 'Die Zahlen',
      titel: 'EP, Level und Coins',
      zeilen: [
        {
          icon: '⭐',
          titel: 'EP = Erfahrungspunkte',
          text: 'Für alles, was du richtig machst. Sie bringen dich im Level und im Dienstgrad nach oben.',
        },
        { icon: '🏅', titel: 'Level', text: 'Mehr EP, höheres Level. Jedes Level dauert etwas länger.' },
        {
          icon: '🪙',
          titel: 'Coins',
          text: 'Spielgeld, kein echtes Geld: 1 EP = 1 Coin. Damit kaufst du Ausrüstung – das kostet nie EP.',
        },
      ],
    },
    {
      kicker: 'Dranbleiben',
      titel: 'Tagesziel und Serie',
      zeilen: [
        { icon: '📅', titel: 'Tagesziel', text: `Schaffe jeden Tag 3 ${helfer ? 'Notfälle' : 'Einsätze'}.` },
        { icon: '🔥', titel: 'Serie', text: 'Jeder Tag in Folge zählt. Bei 3, 7, 14 und 30 Tagen gibt es Belohnungen.' },
        { icon: '⭐', titel: `${r.einsatz} des Tages`, text: 'Jeden Tag ein neuer Fall mit +50 % EP.' },
      ],
    },
    {
      kicker: 'Bereit?',
      titel: 'Dann los!',
      kati: true,
      text: `Dein erster ${r.einsatz} wartet auf der Startseite. Die Einführung findest du jederzeit unter „Mehr“ wieder. Lernspiel – ersetzt keinen Kurs. Im Notfall: 112.`,
    },
  ];
  const s = schritte[i];
  const letzter = i === schritte.length - 1;
  const t = tiles[helfer ? 'teal' : 'red'];
  return (
    <View style={styles.scrim}>
      <View style={styles.box}>
        <View style={[styles.kopf, { backgroundColor: t.bg, borderBottomColor: t.edge }]}>
          {s.kati ? <KatiAvatar size={56} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={[type.eyebrow, { color: t.accent }]}>{s.kicker}</Text>
            <Text style={type.h2}>{s.titel}</Text>
          </View>
          <Tap onPress={onFertig} accessibilityLabel="Einführung überspringen">
            <Text style={styles.skip}>Überspringen</Text>
          </Tap>
        </View>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.rumpf}>
          {s.text && <Text style={type.body}>{s.text}</Text>}
          {s.zeilen?.map((z) => (
            <View key={z.titel} style={styles.zeile}>
              <View style={[styles.icon, { backgroundColor: colors.veilFaint }]}>
                <Text style={styles.iconText}>{z.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.headline}>{z.titel}</Text>
                <Text style={type.small}>{z.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.fuss}>
          <View style={styles.punkte}>
            {schritte.map((_, k) => (
              <View key={k} style={[styles.punkt, k === i && { backgroundColor: r.akzent, width: 22 }]} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {i > 0 && <Button label="Zurück" variant="outline" onPress={() => setI(i - 1)} style={{ flex: 1 }} />}
            <Button
              label={letzter ? 'Los geht’s' : 'Weiter'}
              onPress={letzter ? onFertig : () => setI(i + 1)}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,13,15,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 50,
  },
  box: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderBottomWidth: 1 },
  skip: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.muted },
  rumpf: { padding: spacing.lg, gap: spacing.md },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22, fontFamily: fonts.regular },
  fuss: { padding: spacing.lg, gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.line },
  punkte: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  punkt: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.line },
});
