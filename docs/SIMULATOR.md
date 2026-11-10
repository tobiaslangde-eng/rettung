# Patienten-Simulator

Ein Einsatz in Echtzeit: Der Patient verändert sich laufend und reagiert auf die Maßnahmen des Teams.
Dieses Dokument erklärt das Modell, damit neue Szenarien einfach ergänzt und fachlich geprüft werden können.

> **Wichtig:** Alle medizinischen Inhalte (Szenarien, Werte, Zeiten, Medikamente, Befunde, Lehrtexte) wurden mit KI
> geschrieben und sind **vereinfacht**. Sie müssen vor der Veröffentlichung von einer Fachperson geprüft werden. Welche
> Medikamente ein Rettungsdienst geben darf, hängt vom Bereich ab (SOP, Notkompetenz).

## Das Modell

Ein Schweregrad **x** (0–1) beschreibt die Krankheit. Er wächst ohne Behandlung mit `wachstum` pro Sekunde und wird durch
Maßnahmen gesenkt (zeitgesteuerte „Effekte“). Aus x ergeben sich drei **Lebens-Achsen**, die den Zielwerten folgen:

| Achse | Bedeutet | Beeinflusst |
| --- | --- | --- |
| `atem` | Gasaustausch | SpO₂, Atemfrequenz, Bewusstsein |
| `kreis` | Kreislauf | Blutdruck, Puls, Bewusstsein |
| `neuro` | Bewusstsein | GCS, Atemantrieb |

Zielwert einer Achse = `1 − w · x^potenz` plus Unterstützung (Sauerstoff, Lagerung, Beutelbeatmung, Infusion, Wärme).
Sauerstoffmangel schwächt das Herz, Kreislaufmangel das Gehirn (Kopplungen). Sinken `atem` oder `kreis` zu tief, kommt es zum
**Kreislaufstillstand**; danach gelten die Regeln der Wiederbelebung (Qualität der Herzdruckmassage, Pausen, Schock, Adrenalin).

Messwerte erscheinen nur, wenn das passende Gerät angelegt ist. Der Monitor zeigt immer den echten, geglätteten Zustand.

## Neues Szenario hinzufügen

1. In `src/data/simulator.ts` ein Szenario mit `S({ … })` anlegen (Felder siehe `SimSzenario` in `src/game/simulator.ts`).
2. Wichtige Stellschrauben: `x0`, `wachstum`, `wA/wK/wN`, `potenz`, `o2`, `lagerung`, `med` (Wirkung und Gegenanzeigen der Medikamente),
   `eigene` (szenariospezifische Maßnahmen), `ereignisse`, `befund`, `antworten` (sechs Texte, „!“ = wichtig), `ziele` (Auswertung).
3. In `SIM_SZENARIEN` eintragen und in `scripts/check-simulator.mjs` einen guten Plan ergänzen.
4. `node scripts/check-simulator.mjs` ausführen: Es spielt jedes Szenario mit gutem Plan (soll überleben), ohne Maßnahmen und mit
   verspäteter Hilfe durch und gibt Zeiten bis zum kritischen Zustand und zum Stillstand aus.

## Bedienung (Überblick)

- Sieben gleich breite Reiter: Messen, Atmung, Kreislauf, Defi & HLW, Medikamente, Team, Gespräch. Lagerung, Sauerstoff und Klinik sind
  Auswahlreihen (genau eine Möglichkeit leuchtet), alles andere kleine Kacheln.
- Zwei Hände: Eine Maßnahme bindet 1 oder 2 Hände. Ist keine Hand frei, wird sie **vorgemerkt** (bis zu 3) und startet in dieser Reihenfolge.
  Voraussetzungen (z. B. „erst Zugang legen“) erklärt die Hinweisleiste unter der Szene.
- ABCDE-Ampel unter der Szene zeigt grün/gelb/rot nach Sichtbefund – auch ohne angelegte Geräte.

## Auswertung

Jedes Szenario hat `ziele` (Gewicht, Prüfung, Begründung). Sterne: übergeben = 1, ab 55 % erfüllt = 2, ab 80 %, ohne schweren Fehler und
in 130 % der Soll-Szenenzeit = 3. Fehler (`fehler(...)`) ziehen Punkte ab; „kritisch“ verhindert den dritten Stern.
EP: übergeben 25 + 15 · Sterne + 0,3 · Quote; verstorben 8 + 0,15 · Quote.

## Bekannte Grenzen

- Pädiatrie: nur Pseudokrupp (Dosierungen werden nicht abgebildet; der Monitor nutzt für Alarme Erwachsenengrenzen).
- Kein Beatmungsgerät, keine Intubation, kein CPAP (nicht im Aufgabenbereich des Rettungssanitäters).
- Ton: Piepton, Alarm, Metronom und Schock laufen nur im Browser (Web Audio) und nur mit „Ton an“.
