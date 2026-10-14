# Einsatz 112 in den Stores veröffentlichen

Alles Technische ist vorbereitet: Die Apps werden automatisch in der Cloud gebaut, Store-Texte,
Store-Bilder und die Datenschutzerklärung liegen bereit. **Ein eigener Computer ist nicht nötig** – alle
Schritte gehen im Browser am iPhone (in Safari bei Bedarf über **aA → Desktop-Website anfordern**).

Was nur du selbst machen kannst: die Entwicklerkonten anlegen, bezahlen und deinen Ausweis bestätigen.
Die Stores verlangen das vom Besitzer der App.

## Überblick

| Store | Kosten | Besonderheit | Dauer bis online |
|---|---|---|---|
| Apple App Store | 99 € pro Jahr | Prüfung durch Apple | ca. 2–7 Tage |
| Google Play | 25 $ einmalig | Bestätigung mit einem **Android-Handy**; **14 Tage Test mit 12 Testern** | ca. 3 Wochen |
| Microsoft Store (Windows) | kostenlos | Prüfung durch Microsoft | ca. 1–3 Tage |
| Web-App | kostenlos | läuft schon: https://tobiaslangde-eng.github.io/retung/ | – |

Feste Angaben, die du immer wieder brauchst:

| | |
|---|---|
| App-Name | Einsatz 112 – Rettungsdienst |
| Bundle-ID / Paketname | `io.github.tobiaslangde.einsatz112` |
| Datenschutz-URL | `https://tobiaslangde-eng.github.io/retung/datenschutz.html` |
| Support-URL | `https://github.com/tobiaslangde-eng/retung/issues` |
| Texte & Bilder | [`APPSTORE-EINTRAG.md`](APPSTORE-EINTRAG.md), [`PLAYSTORE-EINTRAG.md`](PLAYSTORE-EINTRAG.md) |

### So speicherst du ein „Secret“ bei GitHub

Zugangsdaten gehören nie in den Code, sondern in die geschützten Secrets des Repositorys:

1. https://github.com/tobiaslangde-eng/retung/settings/secrets/actions öffnen
2. **New repository secret** → *Name* und *Secret* einfügen → **Add secret**

Secrets kann danach niemand mehr lesen – auch du nicht. Bei einem Tippfehler einfach neu speichern.

### Einmalig: Hauptzweig umstellen

Den Knopf **Run workflow** zeigt GitHub nur für Workflows im Standard-Branch. Der aktuelle Stand liegt im
Branch `claude/medical-game-app-expo-nru897`, der Standard ist noch `main`. Einmalig umstellen:

1. https://github.com/tobiaslangde-eng/retung/settings öffnen (*Settings → General*)
2. Bei **Default branch** auf das Pfeil-Symbol ⇄ tippen → `claude/medical-game-app-expo-nru897` wählen →
   **Update** → bestätigen

(Alternativ kann der Branch per Pull Request in `main` übernommen werden.)

### So startest du den Store-Bau

1. https://github.com/tobiaslangde-eng/retung/actions/workflows/store-release.yml öffnen
2. **Run workflow** → Store auswählen → **Run workflow**
3. Nach 20–60 Minuten ist der Lauf grün. Rot? Dann den Lauf öffnen – die Fehlermeldung sagt, was fehlt.

---

## Schritt 1 – Expo-Konto (für App Store und Google Play)

Expo baut die Apps auf seinen Servern und verwaltet die Zertifikate. Kostenlos.

1. Konto anlegen: https://expo.dev/signup
2. Zugangstoken erstellen: https://expo.dev/settings/access-tokens → **Create token** → Name `github`
3. Token kopieren und als Secret **`EXPO_TOKEN`** speichern

## Schritt 2 – Apple App Store

### 2.1 Apple Developer Program

1. App **Apple Developer** aus dem App Store laden → *Konto* → **Jetzt registrieren**
2. Als **Einzelperson** registrieren und 99 € bezahlen. Die Freischaltung dauert meist 1–2 Tage.
3. Danach auf https://developer.apple.com/account → *Mitgliedschaftsdetails* die **Team-ID**
   (10 Zeichen) kopieren → Secret **`APPLE_TEAM_ID`**

### 2.2 App-Store-Connect-API-Schlüssel

Damit darf Expo in deinem Namen Zertifikate anlegen und die App hochladen.

1. https://appstoreconnect.apple.com/access/integrations/api öffnen
   (*Benutzer und Zugriff → Integrationen → App Store Connect API*). Beim ersten Mal **Zugriff anfordern**.
2. **Teamschlüssel** → **+** → Name `Expo`, Zugriff **Admin** → **Generieren**
3. **Issuer-ID** (oben, lange Zeichenkette mit Bindestrichen) → Secret **`ASC_ISSUER_ID`**
4. **Schlüssel-ID** der neuen Zeile (10 Zeichen) → Secret **`ASC_KEY_ID`**
5. **API-Schlüssel laden** (geht nur ein einziges Mal!). Die Datei `AuthKey_….p8` landet in der App *Dateien*.
6. In *Dateien* die Datei lange drücken → **Umbenennen** → Endung von `.p8` in `.txt` ändern → öffnen.
   Den ganzen Text von `-----BEGIN PRIVATE KEY-----` bis `-----END PRIVATE KEY-----` kopieren →
   Secret **`ASC_API_KEY_P8`**

### 2.3 Erster Bau

Store-Bau starten mit Store **`iphone`** und **ohne** Haken bei *hochladen*.
Dabei legt Expo bei Apple die Bundle-ID, das Zertifikat und das Profil an.

### 2.4 App in App Store Connect anlegen

1. https://appstoreconnect.apple.com/apps → **+** → **Neue App**
2. Plattform **iOS**, Name **Einsatz 112 – Rettungsdienst**, Primärsprache **Deutsch**,
   Bundle-ID **io.github.tobiaslangde.einsatz112**, SKU **einsatz112**, Zugriff *Voller Zugriff*
3. In der neuen App unter *App-Informationen* die **Apple-ID** (nur Ziffern) kopieren → Secret **`ASC_APP_ID`**

### 2.5 Hochladen und zur Prüfung einreichen

1. Store-Bau erneut starten: Store **`iphone`**, Haken bei *hochladen*. Nach ca. 30–60 Minuten
   erscheint der Build in App Store Connect unter **TestFlight**.
2. Ausprobieren: App **TestFlight** auf dem iPhone installieren – du bist automatisch Tester.
3. Store-Eintrag ausfüllen (iPhone- **und** iPad-Screenshots, weil die App auch fürs iPad freigegeben ist): Texte, Screenshots und alle Angaben stehen in
   [`APPSTORE-EINTRAG.md`](APPSTORE-EINTRAG.md). Screenshots aus `docs/appstore/` hochladen.
4. Unter *App-Datenschutz* **„Keine Daten erfasst“**, Altersfreigabe-Fragebogen ausfüllen.
5. Den Build auswählen → **Zur Prüfung hinzufügen** → **Zur Prüfung einreichen**.

## Schritt 3 – Google Play

### 3.1 Entwicklerkonto

1. https://play.google.com/console/signup → **Privatperson** → 25 $ bezahlen, Ausweis bestätigen
2. **Wichtig:** Google verlangt die Bestätigung mit einem **echten Android-Handy** (Android 10 oder neuer):
   In der Play Console auf der Startseite *„Bestätigen, dass du Zugriff auf ein Android-Gerät hast“* →
   QR-Code mit dem Android-Handy scannen → App *Play Console* → **Bestätigen**. Ein geliehenes Handy von
   Freunden oder Familie reicht – es dauert unter einer Minute.

### 3.2 App anlegen und Datei hochladen

1. Play Console → **App erstellen** → Name **Einsatz 112 – Rettungsdienst**, Sprache **Deutsch**,
   **Spiel**, **Kostenlos**, Erklärungen bestätigen
2. Store-Bau starten mit Store **`android`**. Danach liegt die Datei **Einsatz112-GooglePlay.aab** unter
   https://github.com/tobiaslangde-eng/retung/releases (Release *Google Play – Build …*). Aufs iPhone laden.
3. Play Console → **Test und Veröffentlichung → Testen → Geschlossener Test** → Track *Alpha* →
   **Tester** hinzufügen (E-Mail-Liste) → **Neuen Release erstellen** → die .aab-Datei hochladen →
   Releasename z. B. `1.0` → **Weiter** → **Speichern und veröffentlichen**
4. Store-Eintrag, Grafiken, Datenschutz, Einstufung, Zielgruppe, Datensicherheit und Gesundheits-Erklärung
   ausfüllen – alles steht in [`PLAYSTORE-EINTRAG.md`](PLAYSTORE-EINTRAG.md).

### 3.3 14 Tage testen, dann veröffentlichen

Neue private Konten brauchen **mindestens 12 Tester, die 14 Tage am Stück** im geschlossenen Test sind.
Frag Freunde, Familie oder Kolleg/innen mit Android-Handy. Sie öffnen den Einladungslink aus der Play Console
und installieren die App. Nach den 14 Tagen: Play Console → *Dashboard* → **Produktionszugriff beantragen**.
Nach der Freigabe den Release in **Produktion** übernehmen.

### 3.4 Optional: Updates automatisch hochladen

Ab dem zweiten Update kann der Workflow die Datei selbst an Google schicken. Dafür braucht es ein
Google-Cloud-Dienstkonto mit Zugriff auf die Play Console (Anleitung von Expo:
https://expo.fyi/creating-google-service-account). Den Inhalt der JSON-Schlüsseldatei als Secret
**`GOOGLE_SERVICE_ACCOUNT_JSON`** speichern. Ohne dieses Secret lädst du die .aab-Datei einfach weiter von Hand hoch.

## Schritt 4 – Microsoft Store (Windows)

1. Kostenloses Konto für Einzelpersonen: https://storedeveloper.microsoft.com → **Get started**
2. Partner Center → **Apps und Spiele** → **Neues Produkt** → **MSIX- oder PWA-App** → Name **Einsatz 112** reservieren
3. In der App unter **Produktverwaltung → Produktidentität** drei Werte kopieren und bei GitHub als
   **Variablen** speichern (nicht als Secret): https://github.com/tobiaslangde-eng/retung/settings/variables/actions
   → **New repository variable**

   | Name der Variable | Wert aus „Produktidentität“ |
   |---|---|
   | `MS_IDENTITY_NAME` | Package/Identity/Name |
   | `MS_PUBLISHER` | Package/Identity/Publisher (beginnt mit `CN=`) |
   | `MS_PUBLISHER_DISPLAY_NAME` | Package/Properties/PublisherDisplayName |

4. Store-Bau starten mit Store **`microsoft`**. Danach liegt **Einsatz112-MicrosoftStore.appx** unter den Releases.
5. Partner Center → **Einreichung starten**: Preis *kostenlos*, Eigenschaften (Kategorie *Bildung*,
   Datenschutz-URL), Altersfreigabe-Fragebogen, **Pakete** → .appx hochladen, **Store-Einträge** → Deutsch:
   Beschreibung aus [`APPSTORE-EINTRAG.md`](APPSTORE-EINTRAG.md), Screenshots aus `docs/play/` → **An den Store übermitteln**

## Updates

Bei jeder neuen Version einfach den Store-Bau erneut starten. Die Versionsnummern zählen automatisch hoch.
- **iPhone:** mit Haken *hochladen* → in App Store Connect neue Version anlegen, Build auswählen, einreichen
- **Android:** neue .aab hochladen (oder automatisch mit Dienstkonto) → Release erstellen
- **Windows:** neue .appx im Partner Center unter *Pakete* hochladen

## Gut zu wissen

- **Medizinische Inhalte:** Apple und Google prüfen Gesundheits-Apps genauer. Einsatz 112 ist überall als
  Lernspiel gekennzeichnet. Den Hinweis „ersetzt keine medizinische Ausbildung“ in den Texten bitte nicht entfernen.
- **Name und Anschrift:** Die Stores zeigen den Namen der Entwicklerin oder des Entwicklers öffentlich an.
  Google zeigt bei Privatkonten zusätzlich eine Kontakt-E-Mail an.
- **Mac App Store:** wäre mit demselben Apple-Konto möglich, braucht aber eigene Mac-Signierung. Die Mac-Version
  gibt es weiterhin kostenlos als .dmg in den Releases.
