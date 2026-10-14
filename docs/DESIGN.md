# Design „Warnweste“

Das Aussehen von Einsatz 112 ist ein eigenes Design für junge Leute: bunt, mutig, sofort verständlich – und mit
Zutaten aus dem echten Rettungsdienst. Der Name kommt von der Warnweste: Leuchtfarben, die man nicht übersieht.

## Die Idee in einem Satz

**Aufkleber auf EKG-Papier.** Der Hintergrund ist das rosa Millimeterpapier, auf dem ein Herzschlag ausgedruckt
wird. Darauf liegen weiße und pastellfarbene „Sticker“ mit dicker Tinten-Umrandung und hartem Schatten. Alles, was
man antippt, fühlt sich wie ein dicker Knopf an, der beim Drücken einsinkt.

## Farben (`src/theme.ts`)

Jede Farbe hat eine feste Bedeutung – so versteht man das Spiel, ohne etwas lesen zu müssen.

| Farbe | Wert | Bedeutung |
|---|---|---|
| **Tinte** | `#14173A` | Text, Umrandungen, harte Schatten, dunkle Geräte |
| **EKG-Papier** | `#FFF3EE` mit Raster | Hintergrund |
| **Signalrot** | `#E4262F` | Einsatz, Alarm, „Schicht beginnen“ |
| **Blaulicht-Blau** | `#2F5BFF` | Aktion, Auswahl, Fortschritt |
| **Warnwesten-Gelb** | `#FFE226` | Belohnung, gewählte Option, Punkte |
| **Mint** | `#2BD99F` | richtig, geschafft |
| Pastell | Flieder, Rosa, Pfirsich, Himmel, Butter | Farbwelt je Bereich (z. B. Flieder = Detektiv-Akten) |

Der **Patientenmonitor bleibt dunkel** (`#0C0F2B`) – wie im echten Rettungswagen. Er ist die einzige große dunkle Fläche
und fällt dadurch auf.

## Schrift

| Schrift | Wofür |
|---|---|
| **Bricolage Grotesque** (800/700) | Überschriften, Zahlen, Knöpfe – kräftig und freundlich |
| **Inter** | Lesetext |
| **DM Mono** | kleine Etiketten, Melder-Display, Uhrzeiten – wie am Gerätegehäuse |

Alle drei stehen unter der SIL Open Font License. Die Dateien in `assets/fonts/` sind auf die benötigten Zeichen
verkleinert (je 20–70 KB), damit die Web-App schnell lädt.

## Formen und Bewegung

- **Aufkleber:** 2 px Tinten-Umrandung, Rundung 20–28 px, harter Schatten nach unten (`hardShadow`, kein Weichzeichner)
- **Knöpfe und antippbare Karten (`Tap`):** sinken beim Drücken in ihren Schatten; am PC heben sie sich beim Darüberfahren leicht an
- **Gewählte Optionen** sind „eingedrückt“ (kein Schatten, drei Pixel tiefer) – man sieht sofort, was ausgewählt ist
- **Große Tippflächen:** Knöpfe mindestens 50 px hoch
- **Konfetti, Stempel, Blinklicht:** nur dort, wo etwas gefeiert oder gemeldet wird

## Bausteine (`src/components/`)

| Baustein | Datei | Beschreibung |
|---|---|---|
| `Card`, `Button`, `Tap` | `UI.tsx` | Sticker-Karte, dicker Knopf, antippbarer Aufkleber |
| `TopBar`, `StatChip` | `UI.tsx` | runder Zurück-Knopf, großer Titel, Wert-Anzeige oben rechts |
| `Segmented`, `Pill`, `Bar`, `Burst`, `CheckerStrip`, `Led` | `UI.tsx` | Auswahl, Etikett, Balken, „NEU“-Stern, Schachbrettband, Blinklicht |
| `PaperBackground` | `Paper.tsx` | das EKG-Millimeterpapier (feines Raster alle 8 px, kräftiges alle 40 px) |
| `TabBar` | `TabBar.tsx` | schwebende Leiste mit gelber Pille für den aktiven Bereich |
| `ScoreHero`, `AnswerOption`, `RateRow`, `MonitorCard`, `Confetti` | `Training.tsx` | gemeinsame Teile aller Trainingsspiele |
| `KatiAvatar` | `Kati.tsx` | Kati als Aufkleber-Porträt mit Warnweste |
| `RankBadge` | `Ems.tsx` | Dienstabzeichen: Bronze, Silber, Gold, Blaulicht – mit Rangpunkten |

## Navigation

- **Handy und iPad hoch:** schwebende Tab-Leiste unten mit fünf Bereichen – *Start, Training, Fahrzeug, Lexikon, Mehr*
- **iPad quer, PC und Mac:** feste Seitenleiste mit Dienstausweis, Budget und allen Spielen
- Innerhalb eines Spiels gibt es oben links den runden Zurück-Knopf

## Typische Elemente im Spiel

- **Dienstausweis** mit Rangabzeichen, Erfahrungsbalken und Schachbrettband am unteren Rand
- **Stechkarte** für das Tagesziel: drei Felder, die mit einem Haken abgestempelt werden
- **Meldeempfänger (Pager):** Die Alarmmeldung der Leitstelle erscheint auf einem Melder-Display
- **Stationen-Leiste** im Einsatz: Alarm → Untersuchung → Diagnose → Maßnahmen
- **Detektiv-Akten:** manilafarbene Aktenordner mit Stempel; das Archiv zeigt gelöste Akten als Ordner, gesperrte mit Schloss

## Kontrast

Text auf weißem oder pastellfarbenem Grund ist Tinte (mindestens 10:1). Weißer Text steht nur auf Rot, Blau,
Violett und Tinte (mindestens 4,5:1). Zweittext (`#666A8F`) hat auf Papier und Weiß mindestens 4,9:1.

## Das App-Symbol

Roter Grund, weißer Star of Life mit Tinten-Umrandung und hartem Schatten, daneben eine gelbe EKG-Linie.
Das Symbol ist in `assets/` (App) und `web/` (Web-App) in allen Größen abgelegt.

## Frühere Fassungen

- **Rettungsdienst-Design** (erste Fassung): Graphit, Signalrot, Warnstreifen, Patientenmonitor als Startbild
- **Apple-Design** (zweite Fassung, orientiert an den Human Interface Guidelines): helle ruhige Flächen, iOS-Systemfarben,
  Schrift Inter. Sie steht im Git-Verlauf (Stand `da86d27`) und lässt sich jederzeit wiederherstellen.
