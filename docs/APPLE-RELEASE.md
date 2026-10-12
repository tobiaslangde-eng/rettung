# Kiirabi für iPhone veröffentlichen

Das Projekt ist fertig für Apple vorbereitet (`eas.json`, Bundle-ID `ee.kiirabi.rettung`,
Exportkonformität, Workflow „iOS Release“). Gebaut wird auf den Mac-Servern von Expo –
**ein eigener Mac ist nicht nötig**.

Was nur du selbst erledigen kannst, weil es deine Konten und Zahlungsdaten betrifft:

## 1. Konten anlegen (einmalig)

1. **Apple Developer Program** beitreten: <https://developer.apple.com/programs/enroll/>
   (99 € pro Jahr, Freischaltung dauert oft 1–2 Tage).
2. **Expo-Konto** anlegen (kostenlos): <https://expo.dev/signup>

## 2. Erster Build vom eigenen Rechner (einmalig, ca. 10 Minuten Arbeit)

Beim ersten Mal muss Apple dich interaktiv fragen dürfen (Apple-ID, Zwei-Faktor-Code).
Dabei erstellt Expo automatisch Zertifikat, Provisioning-Profil und den App-Eintrag in
App Store Connect. Funktioniert unter Windows, macOS und Linux. Voraussetzung: Node.js
(<https://nodejs.org>) ist installiert.

```bash
git clone https://github.com/tobiaslangde-eng/retung.git
cd retung
git checkout claude/medical-game-app-expo-nru897
npm install

npx eas-cli@latest login
npx eas-cli@latest build --platform ios --profile production --auto-submit
```

Fragen der CLI einfach bestätigen:

- „Create an EAS project?“ → **Yes**
- „Log in to your Apple account?“ → **Yes**, Apple-ID + Code eingeben
- „Generate a new Apple Distribution Certificate / Provisioning Profile?“ → **Yes**
- Beim Hochladen: „Generate a new App Store Connect API Key?“ → **Yes**

Danach hat die CLI in `app.json` eine `projectId` eingetragen – diese Änderung bitte committen
und pushen:

```bash
git commit -am "Expo-Projekt verknüpfen" && git push
```

Nach ca. 20–40 Minuten ist der Build fertig und in **App Store Connect → TestFlight** sichtbar.

## 3. Auf dem iPhone testen (TestFlight)

1. In App Store Connect unter *TestFlight* dich selbst als internen Tester eintragen.
2. Die App **TestFlight** aus dem App Store auf dem iPhone installieren.
3. Einladung annehmen → Kiirabi installieren.

## 4. Spätere Updates ohne eigenen Rechner

1. Auf <https://expo.dev/settings/access-tokens> ein Token erstellen.
2. Im GitHub-Repository: *Settings → Secrets and variables → Actions → New repository secret*,
   Name `EXPO_TOKEN`, Wert = das Token.
3. Ab dann: *Actions → „iOS Release“ → „Run workflow“*. Der Build läuft bei Expo und landet
   automatisch in TestFlight. Die Build-Nummer wird automatisch erhöht.

## 5. In den App Store bringen

In App Store Connect die App-Seite ausfüllen und zur Prüfung einreichen.
**Screenshots, Texte, Keywords und Prüfnotizen sind fertig vorbereitet:** [`APPSTORE-EINTRAG.md`](APPSTORE-EINTRAG.md).

Du brauchst:

- **Screenshots** für 6,9″-iPhones – liegen in [`appstore/`](appstore/)
- **Datenschutz-URL** – Vorlage: [`docs/DATENSCHUTZ.md`](DATENSCHUTZ.md), z. B. als GitHub-Seite
  oder auf einer eigenen Website veröffentlichen
- **App-Datenschutz**: „Keine Daten erfasst“
- **Altersfreigabe**: Fragebogen ausfüllen (medizinische Inhalte: „selten/gering“)
- **Beschreibung** – Vorschlag:

> Kiirabi – Rettungseinsatz: Als Sanitäter/in in Estland erkenne ich Krankheiten, messe
> Vitalwerte und entscheide, was zu tun ist. 14 Einsätze von Tallinn bis Saaremaa,
> drei Schwierigkeitsstufen, Lexikon mit Normwerten. Im estnischen Design.
> Lernspiel – ersetzt keine medizinische Ausbildung oder ärztliche Beratung.

**Hinweis zur Prüfung:** Apple prüft Apps mit medizinischen Inhalten genauer
(Richtlinie 1.4.1). Kiirabi ist als Lernspiel gekennzeichnet und gibt keine Diagnosen für
echte Personen; den Hinweis „Lernspiel – keine medizinische Beratung“ in der Beschreibung
und in den Prüfnotizen unbedingt beibehalten.

## Einstellungen im Projekt

| Datei | Einstellung | Warum |
|---|---|---|
| `app.json` | `ios.bundleIdentifier: ee.kiirabi.rettung` | eindeutige App-ID bei Apple |
| `app.json` | `ios.config.usesNonExemptEncryption: false` | keine Exportkonformitäts-Frage bei jedem Upload |
| `app.json` | `ios.supportsTablet: false` | reine Handy-App, daher keine iPad-Screenshots nötig |
| `eas.json` | `production.autoIncrement`, `appVersionSource: remote` | Build-Nummer zählt Expo automatisch hoch |
