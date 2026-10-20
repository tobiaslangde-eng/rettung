# Design „Puls“

Hell, frisch und klinisch-sauber – ein Bento-Raster aus bunten Pastell-Kacheln auf Mintweiß, mit medizinischen Motiven.

## Idee
- **Bento-Raster:** Jeder Bereich ist eine abgerundete Kachel (26 px) in einer eigenen Farbwelt. Handy: 2 Spalten, Tablet/PC: 4 Spalten. Große Kacheln für Geschichte und Aktion, kleine für Zahlen, Trainings und Ausrüstung.
- **Medizinischer Touch:** EKG-Papier mit Herzschlag-Linie im Kopf der Startseite, Zahlen wie auf dem Patientenmonitor, Kreuz- und Kapselformen, Monitor und Pager bleiben tiefschwarz-grün wie im echten Rettungswagen.
- **Für Jugendliche und Erwachsene:** klare Struktur, große Zahlen, freundliche Farben, kein Kinder-Look.

## Farben (`src/theme.ts`)
| Rolle | Wert |
|---|---|
| Hintergrund (Mintweiß) | `#EDF4F1` |
| Karten | `#FFFFFF`, Linie `#D9E5E0` |
| Tinte (tiefes Petrolgrün) | `#0F2A2E`, Zweittext `#5A7370` |
| Ersthelfer-Akzent (Teal) | `#0A8576` |
| Sanitäter-Akzent (Signalrot) | `#E0393E` |
| Kacheln | Mint `#D3F1E9`, Koralle `#FFDDD9`, Lila `#E4DEFF`, Butter `#FFEFC0`, Himmel `#D8E7FF`, Grün `#DDF3D2`, Rosa `#FFDDEA` |
| Monitor / Pager | `#08181B` mit Neon-Grün |

Text auf hellen Flächen ist immer dunkel (`colors.onBright`), auf dunklen Flächen hell (`colors.onDark`). `onColor(bg)` wählt automatisch.

## Schrift
Bricolage Grotesque für Überschriften und große Zahlen, Inter zum Lesen.

## Bausteine
`src/components/Bento.tsx`: `BentoGrid`, `Tile`, `TileLabel`, `BigNumber`, `Ring`, `Ecg`, `EcgPaper`. Illustrationen als SVG: Rettungswagen, Auto, Szenen bei Notfällen, Rettungswache und Hilfspunkt bei Nacht.

Die dunkle Variante „Leitstelle“ liegt unter `/vorschau/leitstelle/`, die erste helle Variante „Klar“ unter `/vorschau/klar/`.

## Referenzen (Mobbin) und was daraus übernommen wurde
- **Bevel, Google Health, Withings, Apple Health:** Zusammenfassung mit drei Ringen („Heute im Überblick“) und eine Reihe pastellfarbener Kurz-Kacheln mit großer Zahl (EP, Coins, Tage am Stück).
- **Duolingo, Vocabulary:** dicke „3D“-Knöpfe und Antwort-Karten mit kräftiger Unterkante; der Lernpfad wird bei uns zu **„Dein Weg“** – Kapitel als Stationen auf einer Herzschlag-Linie.
- **Mimo, Tonal, Azar:** Profil mit Level-Ring und runden Medaillen für Abzeichen (erreichte farbig, offene grau).
- **Speechify, Nibble:** Quiz mit Fortschrittsleiste, Buchstaben A–D und klarer Rückmeldung.
- **Finch „First Aid Kit“:** farbige Symbol-Quadrate mit kurzer Beschreibung in abgerundeten Karten.

## Farbsystem: Hell, Dunkel, Auto

- Alle Farben kommen aus `src/theme.ts`. Es gibt zwei Paletten (`HELL`, `DUNKEL_PALETTE`) und zwei Kachel-Sätze (`TILES_HELL`, `TILES_DUNKEL`).
- Welche gilt, wird einmal beim Start entschieden (`istDunkel()` in `src/game/darstellung.ts`): Einstellung „Auto“ folgt dem Gerät, „Hell“ und „Dunkel“ sind fest. Beim Wechsel unter „Mehr“ lädt die Seite kurz neu.
- In Bildschirmen keine festen Hex-Farben für Flächen und Text verwenden, sondern Tokens (`colors.surface`, `colors.ink`, `colors.veil`, `colors.track` …). Grafiken (Fahrzeuge, Szenen, Stadtkarte) dürfen eigene Farben haben.
- `colors.outline` ist die Kontur in Grafiken (Kati, Rettungsstern) und bleibt in beiden Modi dunkel; `colors.onBright` ist die Schriftfarbe auf hellen Signalflächen (Gelb, Mint).
- Das HTML (`scripts/build-single-html.mjs`) setzt schon vor dem Start den passenden Hintergrund (`data-dunkel`), damit nichts aufblitzt.

## Startseite („Heute“-Hub)

Held mit Punkten, Budget und Serie → Kapitel (nur mit Geschichte) → Hauptaktion → Schnellzugriff (Karte, Schicht, Duell, Spickzettel, Urkunden) → Einsatz/Serie des Tages → Überblick → vier empfohlene Trainings → Ausbau. Das Training ist in drei Gruppen geordnet (`TRAINING_GRUPPEN` in `src/game/trainings.ts`).
