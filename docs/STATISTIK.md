# Statistik (GoatCounter)

Zähler: https://einsatz112.goatcounter.com (nur Web-Version rettung.tankard.de, anonym, ohne Cookies).

## Übersicht
Besuche pro Tag/Woche, Herkunft (Referrer), Geräte, Browser, Länder.

## Events (Bereich „Events“, jeweils Besucher und Aufrufe)

| Event | Bedeutung |
|---|---|
| `besucher-neu` / `besucher-wiederkehrend` | Erster Besuch bzw. an einem späteren Tag wieder da |
| `aktiv-01-min` … `aktiv-60-min` | Aktive Spielzeit erreicht (1, 5, 10, 20, 30, 60 Minuten; nur sichtbar und bedient) |
| `online-puls` | Lebenszeichen alle 2 Minuten aktiver Spielzeit. Pulse pro Stunde ÷ 30 ≈ wie viele Leute in dieser Stunde durchgehend gespielt haben (Ansicht „Last day“, „View by: hour“, Filter `online-puls`) |
| `rolle-helfer` / `rolle-sani` | Rolle gewählt |
| `modus-story` / `modus-frei` | Spielweise gewählt |
| `schwierigkeit-leicht/mittel/schwer` | Schwierigkeit umgestellt |
| `einsatz-gestartet` / `einsatz-beendet` | Einsatz begonnen bzw. zu Ende gespielt (Unterschied = Abbrüche) |
| `kati-frage` | Eine Frage an „Frag Kati“ gestellt (der Text der Frage wird nicht gespeichert oder gesendet) |
| `kati-ki-frage` / `kati-ki-zugestimmt` / `kati-ki-abgelehnt` | Frage mit KI gestellt; Zustimmung zur KI erteilt oder abgelehnt (Fragetext wird nie gezählt) |
| `kati-hilfreich` / `kati-nicht-hilfreich` | Daumen unter einer Antwort von Kati |
| `einfuehrung-fertig` | Einführung beendet oder übersprungen |
| `farbmodus-auto` / `-hell` / `-dunkel` | Farbmodus unter „Mehr“ gewählt |
| `stadtkarte-einsatz` | Einsatz über die Stadtkarte gestartet |
| `stadtkarte-stau-umfahren` | Auf der Stadtkarte die schnellere Route gewählt |
| `labor-<übung>` | Eine Übung im Handgriff-Labor geschafft (z. B. `labor-druckverband`, `labor-tourniquet`) |
| `training-<name>` | Training geöffnet (z. B. `training-gefahr`, `training-cpr`) |
| `gefahren-check-beendet` | Gefahren-Check-Runde zu Ende gespielt |
| `kapitel-NN-geschafft` | Kapitel der Geschichte abgeschlossen |
| `pruefung-bestanden` / `pruefung-nicht-bestanden` | Erste-Hilfe-Prüfung |
| `urkunde-geteilt` / `urkunde-gespeichert` | Urkunde als Bild geteilt bzw. gespeichert |

Quelle: `src/analytics.ts` und die `zaehle(...)`-Aufrufe in `App.tsx`.
