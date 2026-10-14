/** Rettungswissen für das Lexikon – kurz, praxisnah, für Erwachsene. */
export interface BasicTopic {
  id: string;
  title: string;
  intro?: string;
  points: string[];
}

export const BASICS: BasicTopic[] = [
  {
    id: 'notruf',
    title: 'Notruf 112 – die 5 W',
    intro: 'Ruhig bleiben, langsam sprechen. Die Leitstelle führt durchs Gespräch.',
    points: [
      'Wo ist es passiert? (Adresse, Stockwerk, Besonderheiten)',
      'Was ist passiert?',
      'Wie viele Verletzte oder Erkrankte?',
      'Welche Verletzungen oder Beschwerden?',
      'Warten auf Rückfragen – nicht selbst auflegen!',
    ],
  },
  {
    id: 'rettungskette',
    title: 'Die Rettungskette',
    points: [
      'Sofortmaßnahmen: Eigenschutz, Unfallstelle sichern, Notruf',
      'Erste Hilfe durch Ersthelfer',
      'Rettungsdienst übernimmt',
      'Weiterbehandlung im Krankenhaus',
      'Jedes Glied ist wichtig – die Kette ist nur so stark wie das schwächste Glied.',
    ],
  },
  {
    id: 'abcde',
    title: 'ABCDE-Schema',
    intro: 'Feste Reihenfolge der Untersuchung – das Wichtigste zuerst. Probleme sofort behandeln, dann weiter.',
    points: [
      'A – Atemwege: frei? Fremdkörper, Erbrochenes, Schwellung?',
      'B – Belüftung/Atmung: Atemfrequenz, SpO₂, Atemgeräusche',
      'C – Kreislauf: Puls, Blutdruck, Hautfarbe, Blutungen',
      'D – Neurologie: Bewusstsein (GCS), Pupillen, Blutzucker',
      'E – Erweiterte Untersuchung: Ganzkörpercheck, Temperatur, Wärmeerhalt',
    ],
  },
  {
    id: 'reanimation',
    title: 'Wiederbelebung (Erwachsene)',
    intro: 'Keine normale Atmung? Sofort handeln – jede Minute ohne Herzdruckmassage senkt die Überlebenschance.',
    points: [
      'Prüfen: ansprechen, anfassen, Atmung kontrollieren (max. 10 Sekunden)',
      'Notruf 112, Defibrillator (AED) holen lassen',
      'Herzdruckmassage: Mitte des Brustkorbs, 5–6 cm tief, 100–120 pro Minute',
      '30 Kompressionen : 2 Beatmungen (ohne Beatmung: durchgehend drücken)',
      'AED sobald verfügbar einschalten und den Anweisungen folgen',
    ],
  },
  {
    id: 'seitenlage',
    title: 'Stabile Seitenlage',
    points: [
      'Für Bewusstlose, die normal atmen',
      'Kopf überstreckt, Mund ist der tiefste Punkt – Erbrochenes kann abfließen',
      'Atmung regelmäßig kontrollieren',
      'Atmet die Person nicht mehr normal: sofort Wiederbelebung',
    ],
  },
  {
    id: 'befast',
    title: 'BE-FAST bei Verdacht auf Schlaganfall',
    points: [
      'B – Balance: plötzlicher Schwindel, Gangunsicherheit?',
      'E – Eyes: plötzliche Sehstörung?',
      'F – Face: hängt ein Mundwinkel beim Lächeln?',
      'A – Arms: sinkt ein Arm beim Halteversuch ab?',
      'S – Speech: verwaschene oder fehlende Sprache?',
      'T – Time: Uhrzeit des Beginns merken, sofort 112!',
    ],
  },
  {
    id: 'sampler',
    title: 'SAMPLER – die Befragung',
    points: [
      'S – Symptome: Was ist das Problem?',
      'A – Allergien',
      'M – Medikamente',
      'P – Patientengeschichte (Vorerkrankungen)',
      'L – Letzte Mahlzeit, letzter Stuhlgang, letzte Periode',
      'E – Ereignis: Was ist genau passiert?',
      'R – Risikofaktoren (z. B. Rauchen, Schwangerschaft)',
    ],
  },
  {
    id: 'gcs',
    title: 'Glasgow Coma Scale (GCS)',
    intro: 'Bewertung des Bewusstseins von 3 (tief bewusstlos) bis 15 (wach und orientiert).',
    points: [
      'Augen öffnen: 1–4 Punkte',
      'Beste verbale Antwort: 1–5 Punkte',
      'Beste motorische Antwort: 1–6 Punkte',
      'GCS 8 oder weniger: Atemwege sind gefährdet',
    ],
  },
  {
    id: 'schock',
    title: 'Schockzeichen erkennen',
    points: [
      'Blasse, kalte, schweißige Haut',
      'Schneller, schwacher Puls',
      'Niedriger Blutdruck (oft erst spät)',
      'Unruhe, Angst, später Bewusstseinstrübung',
      'Maßnahmen: Ursache behandeln, Wärmeerhalt, Beine hoch (nicht bei Atemnot oder Kopf-/Brustverletzung), Notruf',
    ],
  },
  {
    id: 'sichtung',
    title: 'Sichtung beim Großeinsatz (MANV)',
    intro: 'Bei vielen Verletzten wird zuerst gesichtet, nicht behandelt – so bekommen die Schwerstverletzten zuerst Hilfe. Vereinfachtes mSTaRT-Schema für Erwachsene:',
    points: [
      'Gehfähig → Grün (leicht verletzt)',
      'Spritzende Blutung → Rot, sofort stoppen',
      'Keine Atmung trotz freier Atemwege → Schwarz',
      'Atemfrequenz über 30, kein Radialispuls, Rekapillarisierung über 2 s oder befolgt keine Aufforderungen → Rot',
      'Alle anderen → Gelb',
    ],
  },
  {
    id: 'kinder',
    title: 'Notfälle bei Kindern',
    points: [
      'Kinder sind keine kleinen Erwachsenen: Puls und Atmung sind schneller, der Blutdruck niedriger',
      'Ein niedriger Blutdruck ist bei Kindern ein spätes Schockzeichen – auf Puls, Haut und Verhalten achten',
      'Eltern als Helfer einbinden – auf dem Schoß ist das Kind ruhiger',
      'Wiederbelebung: zuerst 5 Beatmungen, dann 15 Kompressionen : 2 Beatmungen (Laien dürfen 30:2)',
      'Kleine Teile wie Nüsse, Trauben und Spielzeug sind eine häufige Ursache für Erstickungsnotfälle',
    ],
  },
];
