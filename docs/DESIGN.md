# Design von Einsatz 112

Die Oberfläche folgt den **Human Interface Guidelines (HIG)** von Apple – den Gestaltungsregeln, nach denen
iPhone-Apps gebaut werden. Ziel: modern, aufgeräumt und sofort verständlich, besonders für junge Leute.

## Grundsätze

| HIG-Prinzip | Umsetzung in Einsatz 112 |
|---|---|
| **Klarheit** – Inhalt steht im Mittelpunkt | Helle, ruhige Flächen (`#F2F2F7`), weiße Karten, viel Weißraum, keine Zierstreifen mehr |
| **Klare Hierarchie** | Große Titel (34 pt), Überschriften, Fließtext und Fußnoten nach den iOS-Textstilen („Dynamic Type“) |
| **Vertraute Navigation** | Tab-Leiste unten mit 5 Bereichen (Heute, Training, Fahrzeug, Lexikon, Mehr); auf iPad quer und PC eine Seitenleiste; „‹ Zurück“ oben links |
| **Systemfarben sparsam als Akzent** | Rot = Einsatz und Hauptaktion, Blau = Auswahl und Links, Grün = richtig, Orange/Pink/Indigo für die Trainings |
| **Große Tippflächen** | Knöpfe mindestens 44–50 pt hoch, ganze Karten antippbar |
| **Tiefe durch Ebenen** | Weiche Schatten statt Rahmen, Milchglas-Effekt in der Tab-Leiste, Steckbriefe als Blatt von unten |
| **Rückmeldung** | Karten und Knöpfe geben beim Antippen leicht nach |

## Bausteine (`src/components/UI.tsx`)

- **Card** – weiße Karte mit Rundung 20 und leichtem Schatten
- **Button** – iOS-Knopf (Rundung 14, normale Schreibweise statt Großbuchstaben)
- **TopBar** – Navigationsleiste mit „‹ Zurück“ und großem Titel
- **Segmented** – Auswahl wie das iOS-Segment-Control (z. B. Schwierigkeit, Lexikon)
- **Ring** – Fortschrittsringe wie bei Apple Fitness (Tagesziel, Woche, Dienstgrad)
- **IconTile** – farbiges Symbol im abgerundeten Quadrat wie in den iOS-Einstellungen
- **ListRow / Group / Pill / SectionTitle** – Listenzeilen, Gruppen, Etiketten und Abschnittstitel

Die Tab-Leiste mit eigenen Linien-Symbolen liegt in `src/components/TabBar.tsx`.

## Farben und Schrift (`src/theme.ts`)

- **Farben:** iOS-Systemfarben (Rot `#FF3B30`, Blau `#007AFF`, Grün `#34C759`, Orange `#FF9500`, Gelb `#FFCC00`,
  Indigo `#5856D6`, Pink `#FF2D55`). Der Patientenmonitor bleibt bewusst dunkel – wie im echten Rettungswagen.
- **Schrift:** [Inter](https://rsms.me/inter/) (SIL Open Font License), sehr nah an Apples SF Pro und auf allen Geräten
  gleich. Die Schriftdateien in `assets/fonts/` sind auf die benötigten Zeichen verkleinert (je ca. 68 KB).
  Für Beschriftungen in den Grafiken (Rettungswagen, Geräte) bleibt die schmale *Barlow Condensed*.
