# KI für „Frag Kati“ einrichten (einmalig, ca. 20 Minuten)

Damit Kati **alle** Fragen rund um Medizin beantworten kann, braucht sie eine KI (Claude von Anthropic).
Die App darf den geheimen Schlüssel dafür nicht selbst enthalten – sonst könnte ihn jeder auslesen und auf deine
Kosten benutzen. Darum gibt es einen kleinen „KI-Server“ (`worker.js`), der den Schlüssel verwahrt. Er läuft kostenlos bei Cloudflare.

Du brauchst: zwei kostenlose Konten (Anthropic, Cloudflare) und etwas Guthaben bei Anthropic. Alles geht am iPhone im Browser.

## Was es kostet

Bezahlt wird nur bei Anthropic, pro gestellter Frage (Preise Stand Oktober 2026, ungefähr):

| Modell (Einstellung `MODELL`) | Kosten pro Frage | Bemerkung |
|---|---|---|
| `claude-opus-5-5` (Standard) | 1–3 Cent | beste Antworten |
| `claude-sonnet-5-5` | etwa 1 Cent | sehr gut, günstiger |
| `claude-haiku-5-5` | unter 0,2 Cent | am günstigsten, etwas weniger gründlich |

Beispiel: 1.000 Fragen im Monat kosten mit dem Standard etwa 10–30 €. **Setze unbedingt ein Ausgabenlimit** (Schritt A2), dann
kann es nie teurer werden als dieser Betrag.

## Teil A – Anthropic (der Schlüssel)

1. Öffne **console.anthropic.com** und lege ein Konto an (oder melde dich an).
2. **Guthaben und Limit:** Gehe zu „Settings“ → „Billing“. Lade z. B. 10 $ Guthaben auf und setze unter „Limits“ ein
   **monatliches Ausgabenlimit** (z. B. 10 $). Die Namen können leicht anders heißen.
3. **Schlüssel erstellen:** „Settings“ → „API Keys“ → „Create Key“. Name: `kati`. Kopiere den Schlüssel (er beginnt mit `sk-ant-`).
   Er wird nur einmal angezeigt. **Schick ihn niemandem, auch mir nicht, und schreibe ihn nirgends öffentlich hin.**

## Teil B – Cloudflare (der Server)

1. Öffne **dash.cloudflare.com** und lege ein kostenloses Konto an.
2. „Workers & Pages“ → „Create“ → **„Worker“** (die einfache Vorlage „Hello World“) → Name: `kati-ki` → „Deploy“.
3. „Edit code“: Lösche den ganzen vorhandenen Text und füge den Inhalt von **`worker.js`** ein (Datei in diesem Ordner; auf GitHub öffnen → „Raw“ →
   alles markieren → kopieren). Dann „Deploy“.
   *Hinweis:* Die neueste `worker.js` nimmt zusätzlich das „Hintergrundwissen“ aus der App entgegen (die passenden Artikel der Wissensbasis). Hast du den Worker schon früher eingerichtet, kopiere den neuen Inhalt von `worker.js` einfach nochmal hinein und klicke „Deploy“ – die Einstellungen bleiben erhalten.
4. Zurück zum Worker: „Settings“ → „Variables and Secrets“ → „Add“:
   - Typ **Secret**, Name `ANTHROPIC_API_KEY`, Wert: dein Schlüssel aus Teil A → speichern/„Deploy“.
   - Optional, Typ **Text**: `MODELL` = `claude-sonnet-5-5` (günstiger) und/oder `AUFWAND` = `medium` (gründlicher, langsamer).
5. **Optional, aber empfohlen – Tageslimit für alle zusammen:** „Storage & Databases“ → „KV“ → „Create“ → Name `kati-zaehler`.
   Dann beim Worker „Settings“ → „Bindings“ → „Add“ → „KV namespace“ → Variablenname **`ZAEHLER`** → den Speicher `kati-zaehler` wählen.
   Standard: 400 Fragen pro Tag (änderbar mit der Text-Variable `TAGESLIMIT`).
6. Kopiere die Adresse des Workers (sie sieht aus wie `https://kati-ki.DEINNAME.workers.dev`).
   Öffnest du sie im Browser, steht dort: „Einsatz 112 – KI-Server läuft.“

## Teil C – In die App eintragen

Schick mir die Worker-Adresse (die ist nicht geheim). Ich trage sie in der App ein, teste alles und veröffentliche es.

## Schutz vor Missbrauch

- Nur die Seiten `rettung.tankard.de` und `tobiaslangde-eng.github.io` dürfen den Server nutzen (Einstellung `ERLAUBTE_URSPRUENGE`).
- Pro Person höchstens 15 Fragen in 10 Minuten (`LIMIT_10_MIN`), dazu das Tageslimit für alle (Schritt B5).
- Fragen werden **nicht gespeichert** und nicht mitgeschrieben. Der Server schickt sie nur an Anthropic und gibt die Antwort zurück.
- Dein Ausgabenlimit bei Anthropic (Schritt A2) ist die letzte Sicherung.

## Abschalten oder Schlüssel wechseln

- Abschalten: Beim Worker das Secret `ANTHROPIC_API_KEY` löschen. Kati antwortet dann wieder nur aus den Inhalten der App.
- Schlüssel wechseln (z. B. wenn er versehentlich öffentlich wurde): bei Anthropic den Schlüssel löschen, neuen erstellen, in Cloudflare das Secret ersetzen.

## Hinweise zur Sicherheit der Antworten

Kati ist per Anweisung so eingestellt: Bei Notfallzeichen zuerst 112, keine Diagnosen für einzelne Personen, keine Dosierungen für einzelne
Menschen, bei seelischen Krisen die Telefonseelsorge, keine Hilfe für gefährliche Handlungen, nur Themen rund um Medizin und Gesundheit.
Trotzdem kann eine KI Fehler machen. Darum zeigt die App unter jeder Antwort einen Hinweis. Lass die Antworten zu Beginn von jemandem mit
Fachwissen stichprobenartig prüfen.
