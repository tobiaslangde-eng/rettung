# Store-Demo: Konto, Anmeldung und Plus (nur Vorschau)

Zum Ausprobieren, wie Einsatz 112 als Store-App mit Anmeldung und Plus-Abo aussehen könnte.
**Nur in der Vorschau** (rettung.tankard.de/vorschau/) sichtbar. In der Live-Version ändert sich nichts.

## Was es gibt
- **Konto** (Mehr → „Konto und Plus ansehen“, oder Kachel auf der Startseite): Konto erstellen, anmelden, abmelden, Konto löschen, Klassen-Code eingeben (nur Anzeige).
- **Plus** (Jahr 29,99 € / Monat 4,99 €, Vorschläge): „7 Tage kostenlos testen“, „Plus kaufen (Demo)“, „Käufe wiederherstellen“, „Plus beenden“.
- **Plus-Schranken** (Demo-Einstellungen im Konto, standardmäßig an). Ohne Plus gilt:
  - **3 Einsätze pro Tag** (gilt für alle Wege: Einsatz, Einsatz des Tages, Wiederholen, Wochen-Challenge, Stadtkarte, Schicht).
  - **Trainings:** Sanitäter nur Schnelltraining, Wissensfragen und Herzdruck; Ersthelfer nur Notruf, Schritte und Wissensfragen. Alles andere (Detektiv-Akten, Großeinsatz, Leitstelle, Fehler finden, Handgriff-Labor u. a.) ist gesperrt.
  - **Spielmodi:** EKG lesen, Duell, Stadtkarte, Schichtmodus und Mein Lernstand sind gesperrt. Live-Runde bleibt frei.
  - **Patienten-Simulator:** 3 von 23 Szenarien frei (Anaphylaxie, Asthma, Panik und Kribbeln).
  - **Ersthelfer-Bereich:** standardmäßig komplett frei (Vorschlag „Erste Hilfe bleibt kostenlos“). Im Konto lässt sich einstellen, dass er auch begrenzt ist.
  - Gesperrte Bereiche zeigen „🔒 Plus“; ein Tipp öffnet die Plus-Seite mit dem Grund. Mit „7 Tage kostenlos testen“ ist alles offen. Mit „Schranken aus“ ist alles offen wie bisher.

## Was es NICHT ist
- **Kein Server:** Konten liegen nur auf dem Gerät (lokaler Speicher, Schlüssel `kiirabi.vorschau.konto.demo.v1`). Es gibt keine Anmeldung zwischen Geräten und keine Spielstand-Sicherung auf einem Server.
- **Kein Passwort wird gespeichert oder gesendet.** Das Feld wird nur auf Länge geprüft (mindestens 8 Zeichen) und sofort verworfen.
- **Keine Zahlung:** „Plus“ ist ein Schalter. Es wird nichts abgebucht, es gibt keine Verbindung zu Apple oder Google.
- Die Sperren sind eine Demo des Prinzips. Ein Spielstand-Sync auf mehreren Geräten (Plus-Versprechen) ist nur als Idee zu sehen.

## Was für die echte Version nötig wäre
1. Ein Anmelde-Dienst (z. B. ein Backend mit E-Mail-Anmeldung, Passwort-Zurücksetzen, Löschfunktion) und Datenschutz-Anpassung.
2. Spielstand-Sicherung auf dem Server (mit Konfliktregeln zwischen Geräten).
3. Echte Käufe über die Stores (Abo-Dienst, „Käufe wiederherstellen“, Testphase) und rechtliche Texte (AGB, Widerruf, Preisangaben).
4. Klassen-Codes und Ausbilder-Ansicht auf einem Server.
5. Fachprüfung der Inhalte, Impressum, Steuer- und Rechtsfragen (siehe Notion: „Store-Launch & Gewinn“).

Code: `src/game/konto.ts` (Logik), `src/screens/KontoScreen.tsx`, `src/screens/PlusScreen.tsx`, `src/components/KontoKachel.tsx`; Schranken in `src/screens/SimulatorScreen.tsx`.
