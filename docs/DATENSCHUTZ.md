# Datenschutzerklärung – Einsatz 112

Veröffentlicht unter **https://tobiaslangde-eng.github.io/rettung/datenschutz.html**
(Quelle: [`web/datenschutz.html`](../web/datenschutz.html)) – diese Adresse in App Store Connect und
der Google Play Console als Datenschutz-URL eintragen.

- Die App erhebt **keine personenbezogenen Daten** und überträgt keine Daten an Server.
- Kein Benutzerkonto, keine Werbung, keine In-App-Käufe. In den **Apps** (App Store, Google Play) keine Analyse- oder Tracking-Dienste.
- **Nur die Web-Version** (rettung.tankard.de) zählt anonym Besuche und grobe Ereignisse mit GoatCounter (ohne Cookies, ohne Profile, ohne Spielstand; gezählt werden Besuche, grobe Ereignisse, Spielzeit-Stufen und neu/wiederkehrend; Do-Not-Track wird beachtet; nicht in der Vorschau). Siehe `src/analytics.ts`.
- Der Spielstand wird **nur lokal auf dem Gerät** gespeichert.
- Keine Berechtigungen (keine Kamera, kein Standort, keine Kontakte).
- Die Web-Version wird über GitHub Pages ausgeliefert; GitHub verarbeitet dabei technisch notwendige
  Verbindungsdaten (IP-Adresse).

Kontakt: https://github.com/tobiaslangde-eng/rettung/issues

## Frag Kati (KI-Funktion)

Nur nach ausdrücklicher Zustimmung in der App wird die eingegebene Frage (mit den letzten Nachrichten des Gesprächs) über einen eigenen Server (Cloudflare Worker, `docs/ki-server/`) an Claude von Anthropic geschickt. Name, Spielstand und Urkunden werden nicht übertragen; der Betreiber speichert keine Fragen oder Antworten. Ohne Zustimmung antwortet Kati nur aus den Inhalten der App. Aufruf und Hinweise stehen auch in `web/datenschutz.html`.
