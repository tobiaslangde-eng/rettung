import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { useRolle } from '../game/rolle';
import { Progress } from '../game/storage';
import { teileUrkunde } from '../game/teilen';
import { datumDeutsch, neueUrkunden, urkundeSvg, urkundenFuer } from '../game/urkunden';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Urkunden: erreichte Ränge und Meilensteine als Urkunde mit Namen – zum Anschauen, Speichern und Teilen */
export function UrkundenScreen({
  progress,
  onName,
  onDatum,
  onBack,
}: {
  progress: Progress;
  onName: (name: string) => void;
  /** Datum für neu erreichte Urkunden eintragen */
  onDatum: () => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const liste = useMemo(() => urkundenFuer(r.id), [r.id]);
  const [offen, setOffen] = useState<string | null>(null);
  const [name, setName] = useState(progress.spielerName);
  const [hinweis, setHinweis] = useState('');

  // Erreichte Urkunden ohne Datum (z. B. aus älteren Spielständen) bekommen heute als Datum
  useEffect(() => {
    if (neueUrkunden(r.id, progress).length > 0) onDatum();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const erreicht = liste.filter((u) => u.erreicht(progress));
  const aktuell = liste.find((u) => u.id === offen);
  const breite = Math.min(L.width - spacing.lg * 2, 640);

  if (aktuell) {
    const datum = datumDeutsch(progress.urkundenDatum[aktuell.id] ?? new Date().toISOString().slice(0, 10));
    const svg = urkundeSvg({ rolle: r.id, titel: aktuell.titel, text: aktuell.text, name: progress.spielerName, datum });
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker="Urkunde" title={aktuell.titel} onBack={() => setOffen(null)} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <View style={[styles.papier, { width: breite, height: (breite * 566) / 800 }]}>
            <SvgXml xml={svg} width={breite} height={(breite * 566) / 800} />
          </View>
          {!progress.spielerName.trim() && (
            <Text style={type.small}>Tipp: Trage unten in der Liste deinen Namen ein, dann steht er auf der Urkunde.</Text>
          )}
          <Button
            label="Als Bild speichern oder teilen"
            onPress={async () => {
              try {
                const erg = await teileUrkunde(svg, `urkunde-${aktuell.id}.png`, aktuell.titel);
                setHinweis(
                  erg === 'gespeichert' ? 'Gespeichert – schau in deine Downloads.' : erg === 'geteilt' ? 'Geteilt.' : '',
                );
              } catch {
                setHinweis('Das Speichern hat leider nicht geklappt.');
              }
            }}
          />
          {!!hinweis && <Text style={[type.small, { textAlign: 'center' }]}>{hinweis}</Text>}
          <Button label="Zurück zur Liste" variant="outline" onPress={() => setOffen(null)} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Urkunden" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Text style={type.body}>
          Für Ränge und große Ziele bekommst du eine Urkunde mit deinem Namen. {erreicht.length} von {liste.length} erreicht.
        </Text>
        <Card style={{ gap: 6 }}>
          <Text style={[type.small, { fontFamily: fonts.bold }]}>DEIN NAME AUF DER URKUNDE</Text>
          <TextInput
            value={name}
            onChangeText={(t) => {
              setName(t);
              onName(t);
            }}
            placeholder="Vor- und Nachname"
            placeholderTextColor={colors.muted}
            maxLength={40}
            style={styles.eingabe}
            accessibilityLabel="Name auf der Urkunde"
          />
        </Card>
        {liste.map((u) => {
          const ok = u.erreicht(progress);
          const d = progress.urkundenDatum[u.id];
          return (
            <Tap
              key={u.id}
              disabled={!ok}
              onPress={() => setOffen(u.id)}
              accessibilityLabel={u.titel}
              style={[styles.zeile, ok ? { backgroundColor: r.akzentTint, borderColor: r.akzent } : { opacity: 0.65 }]}
            >
              <Text style={styles.zeichen}>{ok ? u.icon : '🔒'}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.headline, { fontSize: 15 }]}>{u.titel}</Text>
                <Text style={type.small}>{ok ? (d ? `Erreicht am ${datumDeutsch(d)}` : 'Erreicht') : u.bedingung}</Text>
              </View>
              {ok && <Text style={[styles.zeichen, { fontSize: 18 }]}>›</Text>}
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
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
  },
  eingabe: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface2,
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
