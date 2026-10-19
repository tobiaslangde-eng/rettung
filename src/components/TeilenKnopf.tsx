import { useState } from 'react';
import { Text } from 'react-native';
import { zaehle } from '../analytics';
import { KARTE_B, KARTE_H } from '../game/karten';
import { teileBild } from '../game/teilen';
import { type } from '../theme';
import { Button } from './UI';

/** „Als Bild teilen“: erzeugt die Karte erst beim Antippen und teilt oder speichert sie als PNG */
export function TeilenKnopf({
  svg,
  dateiname,
  titel,
  art,
  label = 'Als Bild teilen',
  variant = 'tinted',
  breite = KARTE_B,
  hoehe = KARTE_H,
}: {
  svg: () => string;
  dateiname: string;
  titel: string;
  /** Für die anonyme Statistik, z. B. 'ergebnis' */
  art: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'tinted' | 'dark' | 'alarm' | 'mint';
  breite?: number;
  hoehe?: number;
}) {
  const [hinweis, setHinweis] = useState('');
  return (
    <>
      <Button
        label={label}
        variant={variant}
        onPress={async () => {
          try {
            const erg = await teileBild(svg(), dateiname, titel, breite, hoehe);
            if (erg !== 'abgebrochen') zaehle('teilen-' + art);
            setHinweis(erg === 'gespeichert' ? 'Gespeichert – schau in deine Downloads.' : erg === 'geteilt' ? 'Geteilt.' : '');
          } catch {
            setHinweis('Das Speichern hat leider nicht geklappt.');
          }
        }}
      />
      {!!hinweis && <Text style={[type.small, { textAlign: 'center' }]}>{hinweis}</Text>}
    </>
  );
}
