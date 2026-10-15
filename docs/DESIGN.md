# Design „Klar“

Einsatz 112 sieht schlicht und klar strukturiert aus: Inhalte stehen im Vordergrund, Farbe wird sparsam und nur mit
Bedeutung eingesetzt.

## Grundregeln

- **Ruhiger Hintergrund** (`#F4F5F7`), darauf **weiße Flächen mit feiner Linie** (`#E3E6EB`), Rundung 14 px, keine Schatten
- **Eine Schrift:** Inter (Regular, Medium, SemiBold, Bold, ExtraBold), auf die benötigten Zeichen verkleinert (`assets/fonts/`)
- **Eine Akzentfarbe je Rolle** (`src/game/rolle.ts`): Ersthelfer/in Grün `#12805C`, Sanitäter/in Rot `#D92D20` –
  für Hauptknöpfe, aktive Tabs, Fortschrittsbalken und Hervorhebungen
- **Farbe mit Bedeutung:** Grün = richtig, Rot = falsch oder Alarm, Bernstein = Belohnung
- **Der Patientenmonitor bleibt dunkel** – wie im echten Rettungswagen
- Große Tippflächen (Knöpfe mindestens 50 px hoch); beim Drücken wird eine Fläche kurz blasser

## Aufbau

- **Startseite** von oben nach unten: Geschichte (aktuelles Kapitel mit Aufgabe) → Hauptaktion (Notfall / Einsatz) →
  Heute (Tagesziel) → Training → eigenes Fahrzeug → Rang
- **Leiste unten** (Handy, iPad hoch): Start, Training, Auto bzw. Fahrzeug, Lexikon, Mehr
- **Seitenleiste** (iPad quer, PC, Mac) mit denselben Bereichen
- Noch nicht freigeschaltete Bereiche zeigen ein Schloss und das Kapitel, in dem sie dazukommen

## Bausteine (`src/components/`)

| Baustein | Datei | Beschreibung |
|---|---|---|
| `Card`, `Button`, `Tap` | `UI.tsx` | Fläche, Knopf in der Rollenfarbe, antippbare Fläche |
| `TopBar`, `Segmented`, `Bar`, `Pill` | `UI.tsx` | Kopfzeile, Segment-Schalter, schmaler Balken, Etikett |
| `TabBar`, `SideNav` | `TabBar.tsx`, `SideNav.tsx` | Navigation |
| `Car`, `Ambulance` | `Car.tsx`, `Ambulance.tsx` | eigenes Auto (Ersthelfer) und Rettungswagen (Sanitäter) |

## Frühere Fassungen

Im Git-Verlauf: Rettungsdienst-Design (erste Fassung), Apple-Design (`da86d27`) und Design „Warnweste“ (`d20c78b`).
