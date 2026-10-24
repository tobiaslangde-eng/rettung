import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SEITE, inAppBrowser, sichernHinweisFaellig, sichernHinweisSpaeter, speicherFunktioniert } from '../game/umgebung';
import { spacing, type } from '../theme';
import { Tile, TileLabel } from './Bento';
import { Button } from './UI';

/**
 * Damit der Spielstand nicht verloren geht: warnt, wenn der Browser nichts dauerhaft speichert
 * (eingebauter Browser von Instagram & Co., privates Fenster) und erinnert ans Sichern.
 */
export function SpeicherHinweis({ punkte, onSichern }: { punkte: number; onSichern: () => void }) {
  const [weg, setWeg] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const app = useMemo(() => inAppBrowser(), []);
  const geht = useMemo(() => speicherFunktioniert(), []);
  const sichernFaellig = useMemo(() => sichernHinweisFaellig(), []);
  if (weg) return null;

  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(SEITE);
      setKopiert(true);
    } catch {
      setKopiert(false);
    }
  };

  if (!geht)
    return (
      <Tile size="lg" tint="red">
        <TileLabel icon="⚠️" text="Dein Fortschritt wird nicht gespeichert" tint="red" />
        <Text style={type.body}>
          Dieser Browser speichert nichts (zum Beispiel im privaten Modus). Öffne die Seite in einem normalen Safari- oder
          Chrome-Fenster, dann bleibt dein Stand erhalten.
        </Text>
        <Button label="Adresse kopieren" variant="outline" onPress={kopiere} />
        {kopiert && <Text style={type.small}>Kopiert: {SEITE}</Text>}
      </Tile>
    );

  if (app)
    return (
      <Tile size="lg" tint="amber">
        <TileLabel icon="⚠️" text={`Du bist im Browser von ${app}`} tint="amber" />
        <Text style={type.body}>
          Hier geht dein Spielstand oft verloren. Öffne die Seite besser in Safari oder Chrome: oben rechts auf ⋯ oder das
          Teilen-Symbol tippen und „Im Browser öffnen“ wählen. Dort bleibt dein Stand erhalten.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Adresse kopieren" variant="outline" onPress={kopiere} style={{ flex: 1 }} />
          <Button label="Später" variant="outline" onPress={() => setWeg(true)} style={{ flex: 1 }} />
        </View>
        {kopiert && <Text style={type.small}>Kopiert: {SEITE}</Text>}
      </Tile>
    );

  if (sichernFaellig && punkte >= 60)
    return (
      <Tile size="lg" tint="teal">
        <TileLabel icon="💾" text="Spielstand sichern" tint="teal" />
        <Text style={type.body}>
          Dein Fortschritt liegt in diesem Browser. Damit er sicher bleibt: In Safari auf Teilen tippen und „Zum Home-Bildschirm“
          wählen – dann ist die Seite wie eine App und der Stand bleibt dauerhaft erhalten. Oder hol dir unter „Mehr“ deinen
          Spielstand-Code.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Spielstand-Code holen" onPress={onSichern} style={{ flex: 1 }} />
          <Button
            label="Später"
            variant="outline"
            onPress={() => {
              sichernHinweisSpaeter(14);
              setWeg(true);
            }}
            style={{ flex: 1 }}
          />
        </View>
      </Tile>
    );

  return null;
}
