# Kiirabi – Rettungseinsatz 🚑

Ein medizinisches Lernspiel mit **Expo / React Native** im **estnischen Design**, erzählt in der
**Ich-Perspektive**: Ich bin Sanitäter/in im estnischen Rettungsdienst (*kiirabi*), fahre mit meiner
Kollegin Kati zu Einsätzen quer durch Estland, messe Vitalwerte, stufe sie ein, erkenne die
Krankheit und entscheide, was zu tun ist.

## Schwierigkeitsstufen

| Stufe | Fälle | Hilfen | Druck | Punkte |
|---|---|---|---|---|
| ◆◇◇ **Leicht** (*kerge*) | einfache Fälle | Normwerte sichtbar, Kati gibt Tipps und 50:50 gratis | gering | ×1 |
| ◆◆◇ **Mittel** (*keskmine*) | mittlere Fälle | Normwerte muss ich kennen, Katis Tipps kosten 10 Punkte | mittel | ×1,5 |
| ◆◆◆ **Schwer** (*raske*) | komplexe Fälle | keine Hilfe, Feedback erst im Bericht | Patient verschlechtert sich in Echtzeit | ×2 |

## Spielelemente

- **Blaulichtfahrt** mit animiertem Rettungswagen zwischen Alarm und Eintreffen
- **Zustandsbalken** des Patienten: Jede Messung kostet Kraft, Fehler schaden, richtige Maßnahmen helfen.
  Am Ende erfahre ich, wie der Patient in der Klinik ankommt.
- **Kati**, meine Kollegin, gibt Tipps und kann zwei falsche Diagnosen ausschließen (50:50)
- **Serien** 🔥 für mehrere gute Einsätze in Folge, Ränge vom Praktikanten bis zur Teamleitung

## Spielablauf

1. **Väljakutse – Alarm:** Einsatzmeldung der Leitstelle (Tallinn, Tartu, Pärnu, Saaremaa, Peipussee …).
2. **Läbivaatus – Untersuchung:** Anamnese und Sichtbefund lesen, Werte messen
   (Puls, Blutdruck, SpO₂, Atemfrequenz, Temperatur, Blutzucker, GCS, 12-Kanal-EKG)
   und jeden Wert als *niedrig / normal / hoch* einstufen. Jede Messung kostet eine Minute.
3. **Diagnoos – Diagnose:** Verdachtsdiagnose aus vier Möglichkeiten wählen.
4. **Ravi – Maßnahmen:** Alle richtigen Erstmaßnahmen auswählen – falsche kosten Punkte.
5. **Tulemus – Einsatzbericht:** Punkte, Sterne, Erklärung und Leitsymptome.

Punkte bringen dich im Rang nach oben – vom *Praktikant* bis zur *Kiirabibrigaadi juht*.
Der Fortschritt wird lokal gespeichert. Im **Lexikon** findest du Normwerte und alle Krankheitsbilder.

### Enthaltene Fälle (14)

- **Leicht:** Herzinfarkt (STEMI), Hypoglykämie, Schlaganfall, Asthmaanfall, Kreislaufkollaps, Unterarmbruch
- **Mittel:** Anaphylaxie, Hypothermie, Hitzschlag, Hyperventilation, Krampfanfall
- **Schwer:** Sepsis, Lungenembolie, Lungenödem (plus die mittleren Fälle)

## Design: Rettungsdienst

- **Patientenmonitor** als Startbild und im Einsatzbericht: dunkles Raster, grüne EKG-Kurve,
  Vitalwerte in den typischen Monitorfarben (HF grün, SpO₂ cyan, RR rot …)
- **Star of Life** – das internationale Rettungsdienst-Symbol – als Rangabzeichen und App-Icon
- **Rot-weiße Warnmarkierung** wie am Heck eines Rettungswagens, **Reflexstreifen** (Gelb–Silber–Gelb)
  wie an der Einsatzkleidung
- Graphit, Signalrot und Blaulicht-Blau auf neutralem Grau; Schriften *Barlow Condensed* und *Barlow*
- Estland bleibt dezent: Einsatzorte, estnische Begriffe und eine kleine Flagge

Die Grafiken sind Vektorgrafiken (`react-native-svg`) in `src/components/Ems.tsx`.

## App herunterladen

Bei jedem Push baut GitHub Actions (`.github/workflows/android-apk.yml`) automatisch:

- **Kiirabi-Windows.exe** – Desktop-App für Windows (Doppelklick, keine Installation)
- **Kiirabi-Mac-arm64.dmg / Kiirabi-Mac-x64.dmg** – Desktop-App für Mac (Apple-Chip / Intel)
- **Kiirabi-Linux.AppImage** – Desktop-App für Linux
- **Kiirabi.apk** – die Android-App
- **Kiirabi-Web.html** – das ganze Spiel als eine Datei für jeden Browser, auch offline

Die Desktop-Apps (Ordner `desktop/`, Electron) laden die Web-Version in ein eigenes Fenster und laufen
offline. Sie sind nicht von Microsoft/Apple zertifiziert: Windows zeigt beim ersten Start „Weitere
Informationen → Trotzdem ausführen“, auf dem Mac beim ersten Start Rechtsklick → *Öffnen*.
Lokal bauen: `cd desktop && npm install && npm run prepare-app && npm run dist:linux` (bzw. `dist:win`, `dist:mac`).

Beides liegt unter **Releases** im Repository (neuester Build oben).
Android: APK auf dem Handy öffnen und „Installation aus unbekannten Quellen“ erlauben.
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
src/theme.ts            Farben & Typografie (estnisches Design)
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
