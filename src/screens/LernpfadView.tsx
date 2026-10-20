import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { KatiAvatar } from '../components/Kati';
import { Bar, Button, Card, Tap } from '../components/UI';
import { useRolle } from '../game/rolle';
import { KAPITEL, KAPITEL_BONUS, StoryAktion, aktuellesKapitel } from '../game/story';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const ABSTAND = 116;
const KNOTEN = 62;
const LABEL_B = 120;
const SCHWUNG = [0, 54, 84, 54, 0, -54, -84, -54];

/** Lernpfad: die Kapitel der Geschichte als Weg von oben nach unten (wie bei Duolingo) */
export function LernpfadView({
  progress,
  onStory,
  onStoryDone,
  onWechsleModus,
  onNachOben,
}: {
  progress: Progress;
  onStory: (a: StoryAktion) => void;
  onStoryDone: () => void;
  onWechsleModus: (m: 'story' | 'frei') => void;
  onNachOben: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const kapitel = KAPITEL[r.id];
  const aktuell = aktuellesKapitel(r.id, progress);
  const frei = progress.modus === 'frei';
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const nr = gewaehlt ?? (aktuell ? aktuell.nr : kapitel.length);
  const k = kapitel[nr - 1];
  const geschafft = nr <= progress.story;
  const istAktuell = !!aktuell && nr === aktuell.nr;
  const gesperrt = !geschafft && !istAktuell;
  const breite = Math.min(L.width - spacing.lg * 2, 420);
  const mitte = breite / 2;
  const hoehe = kapitel.length * ABSTAND + 40;
  const pos = kapitel.map((_, i) => ({ x: mitte + SCHWUNG[i % SCHWUNG.length], y: 52 + i * ABSTAND }));
  const pfad = pos
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`;
      const q = pos[i - 1];
      const my = (q.y + p.y) / 2;
      return `C${q.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
    })
    .join(' ');
  const erledigtBis = pos.slice(0, Math.min(progress.story + 1, pos.length));
  const pfadFertig = erledigtBis
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`;
      const q = erledigtBis[i - 1];
      const my = (q.y + p.y) / 2;
      return `C${q.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
    })
    .join(' ');

  return (
    <View style={{ gap: spacing.md }}>
      {frei && (
        <Card style={{ gap: spacing.sm }}>
          <Text style={type.headline}>🧭 Du spielst frei</Text>
          <Text style={type.small}>
            Alles ist offen. Der Lernpfad führt dich Kapitel für Kapitel durch das Spiel und schaltet nach und nach Neues frei.
          </Text>
          <Button label="📖 Mit Lernpfad spielen" variant="tinted" onPress={() => onWechsleModus('story')} />
        </Card>
      )}
      <Card style={{ gap: spacing.sm }}>
        <View style={styles.kopf}>
          <KatiAvatar size={44} />
          <View style={{ flex: 1 }}>
            <Text style={type.eyebrow}>
              Kapitel {nr} von {kapitel.length}
              {geschafft ? ' · geschafft ✓' : gesperrt ? ' · noch gesperrt' : ''}
            </Text>
            <Text style={type.h2}>{k.titel}</Text>
          </View>
        </View>
        <Text style={type.body}>{k.text}</Text>
        <View style={[styles.aufgabe, { backgroundColor: colors.veilFaint }]}>
          <Text style={[type.eyebrow, { color: r.akzentDunkel }]}>Deine Aufgabe</Text>
          <Text style={type.body}>{k.ziel}</Text>
          {k.aktion !== 'rolle' && !gesperrt && (
            <Bar pct={geschafft ? 1 : k.stand(progress)} color={r.akzent} track={colors.track} style={{ marginTop: 4 }} />
          )}
        </View>
        {geschafft || frei ? (
          <Button label={geschafft ? 'Nochmal üben' : 'Üben'} variant="outline" onPress={() => onStory(k.aktion)} />
        ) : istAktuell ? (
          aktuell!.erfuellt && k.aktion !== 'rolle' ? (
            <Button label={`Kapitel abschließen · +${KAPITEL_BONUS} EP`} onPress={onStoryDone} />
          ) : (
            <Button
              label={k.aktion === 'rolle' ? 'Rolle wechseln' : 'Los geht’s'}
              variant={k.aktion === 'rolle' ? 'outline' : 'primary'}
              onPress={() => onStory(k.aktion)}
            />
          )
        ) : (
          <Text style={[type.small, { textAlign: 'center' }]}>🔒 Schließe zuerst Kapitel {progress.story + 1} ab.</Text>
        )}
      </Card>

      <View style={{ width: breite, height: hoehe, alignSelf: 'center' }}>
        <Svg width={breite} height={hoehe} style={{ position: 'absolute' }}>
          <Path d={pfad} stroke={colors.line} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 16" fill="none" />
          {progress.story > 0 && (
            <Path d={pfadFertig} stroke={r.akzent} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 16" fill="none" />
          )}
        </Svg>
        {kapitel.map((kp, i) => {
          const n = i + 1;
          const fertig = n <= progress.story;
          const jetzt = !!aktuell && n === aktuell.nr;
          const ausgewaehlt = n === nr;
          const links = pos[i].x > mitte + 1;
          return (
            <View key={n}>
              <View style={[styles.platz, { left: pos[i].x - KNOTEN / 2, top: pos[i].y - KNOTEN / 2 }]}>
                {jetzt && (
                  <View style={[styles.blase, { backgroundColor: r.akzent }]}>
                    <Text style={styles.blaseText}>{kapitel.length === n ? 'LETZTES' : 'WEITER'}</Text>
                  </View>
                )}
                <Tap
                  onPress={() => {
                    setGewaehlt(n);
                    onNachOben();
                  }}
                  accessibilityLabel={`Kapitel ${n}: ${kp.titel}`}
                  style={[
                    styles.knoten,
                    fertig && { backgroundColor: r.akzent, borderColor: r.akzentDunkel },
                    jetzt && { backgroundColor: colors.surface, borderColor: r.akzent, borderWidth: 4 },
                    !fertig && !jetzt && { backgroundColor: colors.surface2, borderColor: colors.line },
                    ausgewaehlt && { transform: [{ scale: 1.08 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.knotenText,
                      fertig && { color: colors.white },
                      jetzt && { color: r.akzent },
                      !fertig && !jetzt && { color: colors.muted },
                    ]}
                  >
                    {fertig ? '✓' : jetzt ? n : frei ? n : '🔒'}
                  </Text>
                </Tap>
              </View>
              <Text
                pointerEvents="none"
                style={[
                  styles.beschriftung,
                  links
                    ? { left: pos[i].x - KNOTEN / 2 - 12 - LABEL_B, textAlign: 'right' }
                    : { left: pos[i].x + KNOTEN / 2 + 12, textAlign: 'left' },
                  { top: pos[i].y - 17 },
                  !fertig && !jetzt && { color: colors.muted },
                ]}
                numberOfLines={2}
              >
                {kp.titel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aufgabe: { borderRadius: 16, padding: spacing.md, gap: 2 },
  platz: { position: 'absolute', width: KNOTEN, alignItems: 'center' },
  knoten: {
    width: KNOTEN,
    height: KNOTEN,
    borderRadius: KNOTEN / 2,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knotenText: { fontFamily: fonts.displayBlack, fontSize: 24 },
  beschriftung: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 6,
    width: 130,
  },
  blase: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 3,
  },
  blaseText: { fontFamily: fonts.extrabold, fontSize: 10.5, letterSpacing: 1, color: '#FFFFFF' },
});
