# Kiirabi – Rettungseinsatz 🚑

Ein medizinisches Lernspiel mit **Expo / React Native** im **estnischen Design**.
Du bist Sanitäter/in im estnischen Rettungsdienst (*kiirabi*) und musst bei Einsätzen
quer durch Estland Krankheiten erkennen, Vitalwerte messen und richtig einstufen
und die passenden Erstmaßnahmen wählen.

## Spielablauf

1. **Väljakutse – Alarm:** Einsatzmeldung der Leitstelle (Tallinn, Tartu, Pärnu, Saaremaa, Peipussee …).
2. **Läbivaatus – Untersuchung:** Anamnese und Sichtbefund lesen, Werte messen
   (Puls, Blutdruck, SpO₂, Atemfrequenz, Temperatur, Blutzucker, GCS, 12-Kanal-EKG)
   und jeden Wert als *niedrig / normal / hoch* einstufen. Jede Messung kostet eine Minute.
3. **Diagnoos – Diagnose:** Verdachtsdiagnose aus vier Möglichkeiten wählen.
4. **Ravi – Maßnahmen:** Alle richtigen Erstmaßnahmen auswählen – falsche kosten Punkte.
5. **Tulemus – Einsatzbericht:** Punkte, Sterne, Erklärung und Leitsymptome.

Punkte bringen dich im Rang nach oben – vom *Praktikant* bis zur *Kiirabibrigaadi juht*.
Der Fortschritt wird lokal gespeichert. Im **Lexikon** findest du Normwerte und alle Krankheitsbilder.

### Enthaltene Fälle (12)

Herzinfarkt (STEMI), Hypoglykämie, Schlaganfall, Anaphylaxie, Asthmaanfall, Sepsis,
Hypothermie, Hitzschlag, Lungenembolie, Hyperventilation, Krampfanfall, Lungenödem.

## Estnisches Design

- Flaggenfarben **sinine – must – valge** (Blau `#0072CE`, Schwarz, Weiß) als Trikolore-Streifen
- Leinen-Hintergrund und Rauten-Ornamentband nach estnischen Volksmustern
- Kihnu-Rot als Alarmfarbe, estnische Begriffe als zweisprachige Beschriftung

## Starten

```bash
npm install
npx expo start        # QR-Code mit Expo Go scannen
npx expo start --web  # im Browser
```

Typecheck: `npm run typecheck`

## Projektstruktur

```
App.tsx                 Navigation (Zustandsautomat) & Fortschritt
src/theme.ts            Farben & Typografie (estnisches Design)
src/components/         Trikolore, Ornament, Buttons, Karten
src/data/vitals.ts      Vitalwerte, Normbereiche, Einstufung
src/data/cases.ts       Einsatzfälle
src/game/scoring.ts     Punkte, Sterne, Ränge
src/game/storage.ts     Speicherung (AsyncStorage)
src/screens/            Start, Einsatz, Ergebnis, Lexikon, Anleitung
```

Neue Fälle lassen sich einfach in `src/data/cases.ts` ergänzen.

> **Hinweis:** Lernspiel mit vereinfachten Inhalten. Ersetzt keine Ausbildung, keine ärztliche
> Beratung und keine regionalen Leitlinien/SOPs. Im Notfall: **112**.
