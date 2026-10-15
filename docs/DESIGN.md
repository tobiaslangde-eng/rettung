# Design „Leitstelle“

Dunkel, technisch, professionell – angelehnt an moderne Leitstellen, Patientenmonitore und Rettungsdienst-Simulationen.

## Farben (`src/theme.ts`)
| Rolle | Wert |
|---|---|
| Hintergrund (Marineblau) | `#0B1727` |
| Karten (Anthrazit-Marine) | `#13233A`, zweite Ebene `#1A2E4A` |
| Linien | `#243C5A` |
| Text | `#EAF0F8`, Zweittext `#8FA2BA` |
| Akzent Rot (Sanitäter, Alarm, Warnung) | `#E5383B` |
| Akzent Türkis (Ersthelfer, Ausbau, Technik) | `#2DD4BF` |
| Richtig / Fortschritt | Grün `#4ADE9A` |
| Belohnung | Gelb `#F7C948` |

Text auf hellen Flächen (Türkis, Gelb, Pastell) ist immer dunkel (`colors.onBright`). `onColor(bg)` wählt automatisch.

## Schrift
Bricolage Grotesque für Überschriften und Zahlen, Inter zum Lesen. Kleine Etiketten in Großbuchstaben mit Abstand.

## Bausteine
Karten mit 1 px Linie, keine Schatten, abgerundete Ecken. Patientenmonitor, Pager und Tafeln bleiben tiefschwarz (`colors.navy`). Eigene Illustrationen als SVG: Rettungswagen, Auto, Szenen bei Notfällen (`Scene`), Rettungswache bei Nacht (`WacheBild`).

## Bereiche
- **Einsatz:** Alarm → Untersuchung → Diagnose → Maßnahmen, mit Zwischenfällen, die auf Entscheidungen reagieren.
- **Fahrzeug:** RTW (oder Auto) in vier Stufen je Gerät.
- **Rettungswache:** fünf Bereiche in drei Stufen; Wirkung im Einsatz.
- **Karriere:** Dienstgrade, Abzeichen, Geschichte in Kapiteln.

Die frühere helle Variante „Klar“ ist unter `/vorschau/klar/` als Vergleich erreichbar.
