# Einsatz 112 – Rettungsdienst-Lernspiel 🚑

Ein medizinisches Lernspiel mit **Expo / React Native** im **Rettungsdienst-Design**, komplett auf Deutsch und
erzählt in der **Ich-Perspektive**: Ich bin Sanitäter/in im Rettungsdienst, fahre mit meiner
Kollegin Kati zu Einsätzen quer durch Deutschland, messe Vitalwerte, stufe sie ein, erkenne die
Krankheit und entscheide, was zu tun ist.

## Schwierigkeitsstufen

| Stufe | Fälle | Hilfen | Druck | Punkte |
|---|---|---|---|---|
| ◆◇◇ **Leicht** (*kerge*) | einfache Fälle | Normwerte sichtbar, Kati gibt Tipps und 50:50 gratis | gering | ×1 |
| ◆◆◇ **Mittel** (*keskmine*) | mittlere Fälle | Normwerte muss ich kennen, Katis Tipps kosten 10 Punkte | mittel | ×1,5 |
| ◆◆◆ **Schwer** (*raske*) | komplexe Fälle | keine Hilfe, Feedback erst im Bericht | Patient verschlechtert sich in Echtzeit | ×2 |

## Spielelemente

- **Schnelltraining Normwerte:** 10 zufällige Messwerte in Folge als niedrig, normal oder hoch einstufen
- **10 Abzeichen** (z. B. „Lehrbuchreif“, „Heiße Serie“, „Nervenstark“) mit je 50 Bonuspunkten
- **Bonuspunkte** für perfekte Einsätze und Serien, 8 Ränge bis zur „Rettungsdienst-Legende“
- **Rettungswissen im Lexikon:** Notruf (5 W), Rettungskette, ABCDE, Wiederbelebung, Seitenlage, BE-FAST, SAMPLER, GCS, Schockzeichen

- **Blaulichtfahrt** mit animiertem Rettungswagen zwischen Alarm und Eintreffen
- **Zustandsbalken** des Patienten: Jede Messung kostet Kraft, Fehler schaden, richtige Maßnahmen helfen.
  Am Ende erfahre ich, wie der Patient in der Klinik ankommt.
- **Kati**, meine Kollegin, gibt Tipps und kann zwei falsche Diagnosen ausschließen (50:50)
- **Serien** 🔥 für mehrere gute Einsätze in Folge, Ränge vom Praktikanten bis zur Teamleitung

## Spielablauf

1. **Alarm:** Einsatzmeldung der Leitstelle (Köln, Heidelberg, Lübeck, Rügen, Müritz …).
2. **Untersuchung:** Anamnese und Sichtbefund lesen, Werte messen
   (Puls, Blutdruck, SpO₂, Atemfrequenz, Temperatur, Blutzucker, GCS, 12-Kanal-EKG)
   und jeden Wert als *niedrig / normal / hoch* einstufen. Jede Messung kostet eine Minute.
3. **Diagnose:** Verdachtsdiagnose aus vier Möglichkeiten wählen.
4. **Maßnahmen:** Alle richtigen Erstmaßnahmen auswählen – falsche kosten Punkte.
5. **Einsatzbericht:** Punkte, Sterne, Erklärung und Leitsymptome.

Punkte bringen dich im Rang nach oben – vom *Praktikanten* bis zur *Teamleitung*.
Der Fortschritt wird lokal gespeichert. Im **Lexikon** findest du Normwerte und alle Krankheitsbilder.

### Enthaltene Fälle (24)

- **Leicht (9):** Herzinfarkt, Hypoglykämie, Schlaganfall, Asthmaanfall, Kreislaufkollaps, Unterarmbruch, Verbrennung, Nierenkolik, Alkoholvergiftung
- **Mittel (9):** Anaphylaxie, Hypothermie, Hitzschlag, Hyperventilation, Krampfanfall, hypertensiver Notfall, Opioid-Überdosis, Gehirnerschütterung, COPD
- **Schwer (6):** Sepsis, Lungenembolie, Lungenödem, Kohlenmonoxidvergiftung, diabetische Ketoazidose, Spannungspneumothorax (plus die mittleren Fälle)

## Design: Rettungsdienst

- **Patientenmonitor** als Startbild und im Einsatzbericht: dunkles Raster, grüne EKG-Kurve,
  Vitalwerte in den typischen Monitorfarben (HF grün, SpO₂ cyan, RR rot …)
- **Star of Life** – das internationale Rettungsdienst-Symbol – als Rangabzeichen und App-Icon
- **Rot-weiße Warnmarkierung** wie am Heck eines Rettungswagens, **Reflexstreifen** (Gelb–Silber–Gelb)
  wie an der Einsatzkleidung
- Graphit, Signalrot und Blaulicht-Blau auf neutralem Grau; Schriften *Barlow Condensed* und *Barlow*
- Komplett auf Deutsch; die Einsätze spielen in ganz Deutschland

Die Grafiken sind Vektorgrafiken (`react-native-svg`) in `src/components/Ems.tsx`.

## App herunterladen

Bei jedem Push baut GitHub Actions (`.github/workflows/android-apk.yml`) automatisch:

- **Einsatz112-Windows.exe** – Desktop-App für Windows (Doppelklick, keine Installation)
- **Einsatz112-Mac-arm64.dmg / Einsatz112-Mac-x64.dmg** – Desktop-App für Mac (Apple-Chip / Intel)
- **Einsatz112-Linux.AppImage** – Desktop-App für Linux
- **Einsatz112.apk** – die Android-App
- **Einsatz112-iOS-unsigniert.ipa** – iOS-App zum Sideloaden mit [Sideloadly](https://sideloadly.io) oder [AltStore](https://altstore.io) und der eigenen Apple-ID (kostenlose Apple-ID: läuft 7 Tage, dann neu installieren)
- **Einsatz112-Web.html** – das ganze Spiel als eine Datei für jeden Browser, auch offline

Die Desktop-Apps (Ordner `desktop/`, Electron) laden die Web-Version in ein eigenes Fenster und laufen
offline. Sie sind nicht von Microsoft/Apple zertifiziert: Windows zeigt beim ersten Start „Weitere
Informationen → Trotzdem ausführen“, auf dem Mac beim ersten Start Rechtsklick → *Öffnen*.
Lokal bauen: `cd desktop && npm install && npm run prepare-app && npm run dist:linux` (bzw. `dist:win`, `dist:mac`).

Beides liegt unter **Releases** im Repository (neuester Build oben).
Android: APK auf dem Handy öffnen und „Installation aus unbekannten Quellen“ erlauben.
**iPhone & iPad (ohne App Store):** Einsatz 112 läuft als Web-App mit eigenem Icon, im Vollbild und offline.
Der Workflow „Web-App veröffentlichen“ legt sie unter <https://tobiaslangde-eng.github.io/retung/> ab.
Auf dem iPhone den Link in **Safari** öffnen → Teilen-Symbol → **„Zum Home-Bildschirm“**.
Einmalig nötig: Repository öffentlich und unter *Settings → Pages* den Branch `gh-pages` als Quelle wählen.

**iPhone / App Store:** Schritt-für-Schritt-Anleitung in [`docs/APPLE-RELEASE.md`](docs/APPLE-RELEASE.md) (Apple-Entwicklerkonto nötig, kein Mac nötig). Updates danach über den Workflow „iOS Release“.

## Starten

```bash
npm install
npx expo start        # QR-Code mit Expo Go scannen
npx expo start --web  # im Browser
```

Typecheck: `npm run typecheck`

### Als einzelne HTML-Datei (zum Teilen im Browser)

```bash
npm run build:web     # erzeugt dist/kiirabi.html – eine eigenständige Datei mit dem ganzen Spiel
```

## Projektstruktur

```
App.tsx                 Navigation (Zustandsautomat) & Fortschritt
src/theme.ts            Farben & Typografie (Rettungsdienst-Design)
src/components/Ems.tsx  Star of Life, Warnmarkierung, Reflexstreifen, Monitor, EKG, Stadt
src/components/         Buttons, Karten, Kati, Blaulichtfahrt
src/data/vitals.ts      Vitalwerte, Normbereiche, Einstufung
src/data/cases.ts       Einsatzfälle
src/game/scoring.ts     Punkte, Sterne, Ränge, Patientenzustand
src/game/difficulty.ts  Schwierigkeitsstufen
src/game/storage.ts     Speicherung (AsyncStorage)
src/screens/            Start, Einsatz, Ergebnis, Lexikon, Anleitung
```

Neue Fälle lassen sich einfach in `src/data/cases.ts` ergänzen.

> **Hinweis:** Lernspiel mit vereinfachten Inhalten. Ersetzt keine Ausbildung, keine ärztliche
> Beratung und keine regionalen Leitlinien/SOPs. Im Notfall: **112**.
