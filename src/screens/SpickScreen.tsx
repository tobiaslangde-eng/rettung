import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { TeilenKnopf } from '../components/TeilenKnopf';
import { Button, Tap, TopBar } from '../components/UI';
import { KARTE_B, KARTE_H, spickKarteSvg } from '../game/karten';
import { useRolle } from '../game/rolle';
import { spickFrei, spickFuer } from '../game/spickzettel';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Spickzettel: kleine Merkkarten zum Anschauen, Speichern und Teilen – frei mit den Kapiteln der Geschichte */
export function SpickScreen({
  progress,
  onGesehen,
  onBack,
}: {
  progress: Progress;
  onGesehen: (id: string) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const liste = useMemo(() => spickFuer(r.id), [r.id]);
  const [offen, setOffen] = useState<string | null>(null);
  const aktuell = liste.find((s) => s.id === offen);
  const breite = Math.min(L.width - spacing.lg * 2, 520);

  if (aktuell) {
    const svg = () =>
      spickKarteSvg({
        rolle: r.id,
        icon: aktuell.icon,
        titel: aktuell.titel,
        punkte: aktuell.punkte,
        merksatz: aktuell.merksatz,
      });
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Spickzettel" title={aktuell.titel} onBack={() => setOffen(null)} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <View style={[styles.papier, { width: breite, height: (breite * KARTE_H) / KARTE_B }]}>
            <SvgXml xml={svg()} width={breite} height={(breite * KARTE_H) / KARTE_B} />
          </View>
          <TeilenKnopf
            art="spickzettel"
            titel={`Spickzettel: ${aktuell.titel}`}
            dateiname={`spickzettel-${aktuell.id}.png`}
            svg={svg}
            label="Als Bild speichern oder teilen"
            variant="primary"
          />
          <Button label="Zurück zur Liste" variant="outline" onPress={() => setOffen(null)} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Spickzettel" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Text style={type.body}>
          Kleine Merkkarten zu den wichtigsten Abläufen. Speichere sie als Bild und schau sie im Notfall oder vor der Prüfung an.
        </Text>
        {liste.map((s) => {
          const frei = spickFrei(r.id, progress, s);
          const neu = frei && !progress.spickGesehen.includes(s.id);
          return (
            <Tap
              key={s.id}
              disabled={!frei}
              onPress={() => {
                onGesehen(s.id);
                setOffen(s.id);
              }}
              accessibilityLabel={s.titel}
              style={[styles.zeile, frei ? { backgroundColor: r.akzentTint, borderColor: r.akzent } : { opacity: 0.65 }]}
            >
              <Text style={styles.zeichen}>{frei ? s.icon : '🔒'}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.headline, { fontSize: 15 }]}>{s.titel}</Text>
                <Text style={type.small}>
                  {frei ? `${s.punkte.length} EP${neu ? ' · neu' : ''}` : `Ab Kapitel ${s.kapitelAb}`}
                </Text>
              </View>
              {frei && <Text style={[styles.zeichen, { fontSize: 18 }]}>›</Text>}
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  papier: {
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
  },
  zeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  zeichen: { fontSize: 26, fontFamily: fonts.regular, width: 36, textAlign: 'center' },
});
