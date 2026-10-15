/** Schritt für Schritt: Abläufe in die richtige Reihenfolge bringen. */
export interface Ablauf {
  /** Eindeutig, kebab-case */
  id: string;
  /** Für wen: Ersthelfer/in, Sanitäter/in oder beide */
  rolle: 'helfer' | 'sani' | 'beide';
  titel: string;
  /** Kurze Lage, z. B. „Du kommst an einen Verkehrsunfall …“ */
  lage: string;
  /** Schritte in der RICHTIGEN Reihenfolge (4–7), kurz */
  schritte: string[];
  /** Warum diese Reihenfolge (1–2 Sätze) */
  erklaerung: string;
}

export const ABLAEUFE: Ablauf[] = [
  // ───────────── Ersthelfer/in ─────────────
  {
    id: 'unfallstelle-absichern',
    rolle: 'helfer',
    titel: 'Unfallstelle absichern',
    lage: 'Du fährst auf der Landstraße und siehst vor dir ein Auto, das im Graben gelandet ist.',
    schritte: [
      'Warnblinker einschalten und abbremsen',
      'Mit Abstand hinter der Unfallstelle anhalten',
      'Warnweste noch im Auto anziehen',
      'Aussteigen und hinter die Leitplanke gehen',
      'Warndreieck am Fahrbahnrand gehend aufstellen',
      'Notruf 112 und um die Verletzten kümmern',
    ],
    erklaerung:
      'Eigenschutz geht vor: Erst warnen und sichtbar werden, dann aussteigen und absichern. Nur wer selbst unverletzt bleibt, kann helfen.',
  },
  {
    id: 'notruf-absetzen',
    rolle: 'helfer',
    titel: 'Notruf absetzen',
    lage: 'Im Supermarkt ist ein älterer Herr gestürzt und kann nicht aufstehen. Du greifst zum Handy.',
    schritte: [
      '112 wählen',
      'Wo ist es passiert?',
      'Was ist passiert?',
      'Wie viele Betroffene gibt es?',
      'Welche Verletzungen oder Beschwerden?',
      'Warten auf Rückfragen – nicht selbst auflegen',
    ],
    erklaerung:
      'Der Ort kommt zuerst, damit der Rettungsdienst auch dann losfahren kann, wenn das Gespräch abbricht. Die Leitstelle beendet das Gespräch.',
  },
  {
    id: 'bewusstsein-pruefen',
    rolle: 'helfer',
    titel: 'Bewusstlose Person prüfen',
    lage: 'Im Park liegt eine Frau regungslos auf dem Rasen neben ihrem Fahrrad.',
    schritte: [
      'Umgebung auf Gefahren prüfen',
      'Laut ansprechen',
      'An den Schultern anfassen und rütteln',
      'Laut um Hilfe rufen',
      'Kopf überstrecken, Kinn anheben',
      'Atmung prüfen – höchstens 10 Sekunden',
    ],
    erklaerung:
      'Erst Eigenschutz, dann Bewusstsein prüfen. Reagiert sie nicht, holst du früh weitere Helfer. Die Atmung prüfst du erst bei freien Atemwegen.',
  },
  {
    id: 'stabile-seitenlage',
    rolle: 'helfer',
    titel: 'Stabile Seitenlage',
    lage: 'Ein Mann ist im Büro bewusstlos, atmet aber normal. Der Notruf ist abgesetzt.',
    schritte: [
      'Neben ihm knien, seine Beine strecken',
      'Nahen Arm angewinkelt nach oben legen',
      'Fernen Arm vor die Brust, Handrücken an seine Wange',
      'Fernes Bein am Knie beugen und ihn zu dir drehen',
      'Oberes Bein so ausrichten, dass die Hüfte rechtwinklig ist',
      'Kopf überstrecken, Mund leicht öffnen',
      'Atmung regelmäßig kontrollieren',
    ],
    erklaerung:
      'Die Seitenlage hält die Atemwege frei, weil Erbrochenes ablaufen kann. Weil die Atmung jederzeit aussetzen kann, prüfst du sie bis zum Eintreffen des Rettungsdienstes immer wieder.',
  },
  {
    id: 'wiederbelebung-aed',
    rolle: 'helfer',
    titel: 'Wiederbelebung mit AED',
    lage: 'Am Bahnhof bricht ein Mann zusammen. Er reagiert nicht und atmet nicht normal.',
    schritte: [
      '112 rufen und AED holen lassen',
      'Herzdruckmassage beginnen: fest und schnell',
      'AED einschalten, sobald er da ist',
      'Elektroden auf den freien Oberkörper kleben',
      'Während der Analyse niemand berührt ihn',
      'Schock auslösen, wenn der AED es ansagt',
      'Sofort weiterdrücken, Ansagen folgen',
    ],
    erklaerung:
      'Jede Minute ohne Herzdruckmassage senkt die Überlebenschance. Der AED sagt jeden Schritt an – nach dem Schock geht es sofort mit Drücken weiter.',
  },
  {
    id: 'motorradhelm-abnehmen',
    rolle: 'helfer',
    titel: 'Motorradhelm abnehmen',
    lage: 'Ein Motorradfahrer liegt nach einem Sturz bewusstlos auf dem Rücken. Ihr seid zu zweit.',
    schritte: [
      'Ansprechen, Visier öffnen, Brille abnehmen',
      'Helfer 1 kniet hinter dem Kopf und hält den Helm',
      'Helfer 2 öffnet den Kinnriemen',
      'Helfer 2 stützt Nacken und Unterkiefer von vorn',
      'Helfer 1 zieht den Helm vorsichtig nach hinten ab',
      'Kopf halten, Atmung prüfen',
    ],
    erklaerung:
      'Der Kopf bleibt dabei die ganze Zeit gestützt. Ohne Helm kannst du die Atemwege freimachen und die Atmung prüfen – das ist wichtiger als jede mögliche Halswirbelverletzung.',
  },
  {
    id: 'verschlucken-erwachsene',
    rolle: 'helfer',
    titel: 'Verschlucken bei Erwachsenen',
    lage: 'Im Restaurant greift sich deine Tischnachbarin an den Hals. Sie hustet heftig.',
    schritte: [
      'Zum kräftigen Husten auffordern',
      'Hustet sie nicht mehr wirksam: Oberkörper vorbeugen',
      'Bis zu 5 Schläge zwischen die Schulterblätter',
      'Bis zu 5 Oberbauchkompressionen',
      '112 rufen lassen, beides im Wechsel wiederholen',
      'Wird sie bewusstlos: Wiederbelebung beginnen',
    ],
    erklaerung:
      'Husten ist am wirksamsten, solange er klappt. Erst wenn er versagt, folgen Rückenschläge und dann Oberbauchkompressionen.',
  },
  {
    id: 'druckverband',
    rolle: 'helfer',
    titel: 'Druckverband anlegen',
    lage: 'Im Baumarkt hat sich ein Kunde mit einem Cuttermesser tief in den Unterarm geschnitten. Es blutet stark.',
    schritte: [
      'Einmalhandschuhe anziehen',
      'Wundauflage auf die Wunde drücken',
      'Wundauflage mit zwei, drei Bindengängen fixieren',
      'Druckpolster auf die Wundauflage legen',
      'Druckpolster fest einwickeln, Binde verknoten',
      'Durchblutung der Finger und Nachbluten prüfen',
    ],
    erklaerung:
      'Der Druckpolster presst gezielt auf die Wunde und stoppt so die Blutung. Danach prüfst du, ob die Finger noch durchblutet sind und der Verband nicht durchblutet.',
  },
  {
    id: 'verbrennung-versorgen',
    rolle: 'helfer',
    titel: 'Verbrennung versorgen',
    lage: 'Beim Grillen im Garten fängt das T-Shirt deines Nachbarn Feuer. Er rennt los.',
    schritte: [
      'Ihn stoppen – nicht weiterlaufen lassen',
      'Flammen ersticken: am Boden wälzen oder Decke',
      '112 rufen',
      'Kleidung entfernen, die nicht an der Haut klebt',
      'Brandwunden locker und keimfrei abdecken',
      'Mit Rettungsdecke vor Auskühlung schützen',
    ],
    erklaerung:
      'Laufen facht die Flammen an. Großflächige Verbrennungen kühlst du als Laie nicht, weil der Körper sonst auskühlt – nur kleine Flächen kurz mit handwarmem Wasser.',
  },
  {
    id: 'fast-test',
    rolle: 'helfer',
    titel: 'Schlaganfall-FAST-Test',
    lage: 'Deine Kollegin spricht in der Teeküche plötzlich verwaschen. Ihr Mundwinkel hängt.',
    schritte: [
      'F – Face: Bitte sie zu lächeln',
      'A – Arms: Beide Arme nach vorn heben lassen',
      'S – Speech: Einen einfachen Satz nachsprechen lassen',
      'T – Time: Sofort 112 rufen, Uhrzeit merken',
      'Oberkörper erhöht lagern, nichts zu trinken',
    ],
    erklaerung:
      'Der FAST-Test hilft dir, einen Schlaganfall in Sekunden zu erkennen. Ist nur ein Punkt auffällig, zählt jede Minute – die Uhrzeit des Beginns ist für die Klinik wichtig.',
  },
  {
    id: 'rettungsgriff',
    rolle: 'helfer',
    titel: 'Rettungsgriff aus der Gefahrenzone',
    lage: 'Auf einer Landstraße sitzt ein bewusstloser Fahrer in seinem Auto, aus dem Motorraum steigt Rauch.',
    schritte: [
      'Zündung aus, Gurt öffnen',
      'Oberkörper aufrichten, von hinten stützen',
      'Unter den Achseln durchgreifen',
      'Einen Unterarm mit beiden Händen fassen',
      'Auf deine Oberschenkel ziehen, rückwärts gehen',
      'In sicherem Abstand ablegen, Atmung prüfen',
    ],
    erklaerung:
      'Den Rettungsgriff nutzt du nur bei akuter Gefahr. Der Unterarm wird im „Affengriff“ gefasst, so trägst du das Gewicht mit deinem Körper statt mit der Kraft der Arme.',
  },
  {
    id: 'krampfanfall-begleiten',
    rolle: 'helfer',
    titel: 'Krampfanfall begleiten',
    lage: 'Ein Jugendlicher stürzt auf dem Schulhof zu Boden und zuckt am ganzen Körper.',
    schritte: [
      'Ruhe bewahren, Beginn des Anfalls merken',
      'Gefährliches wegräumen, Kopf weich polstern',
      'Abwarten, bis die Krämpfe aufhören',
      'Ansprechen und Atmung prüfen',
      'Stabile Seitenlage, weiter beobachten',
    ],
    erklaerung:
      'Während des Anfalls nicht festhalten und nichts in den Mund schieben. 112 rufst du bei einem ersten Anfall, bei Verletzungen oder wenn der Anfall länger als 5 Minuten dauert.',
  },

  // ───────────── Sanitäter/in ─────────────
  {
    id: 'abcde-untersuchung',
    rolle: 'sani',
    titel: 'ABCDE-Untersuchung',
    lage: 'Du triffst als Sanitäter/in bei einem Mann ein, der nach einem Sturz von der Leiter im Garten liegt.',
    schritte: [
      'Eigenschutz und Ersteindruck',
      'A – Atemweg frei?',
      'B – Atmung: Frequenz, Sättigung, Auskultation',
      'C – Kreislauf: Puls, Blutdruck, Blutungen',
      'D – Neurologie: GCS, Pupillen, Blutzucker',
      'E – Entkleiden, Bodycheck, Wärmeerhalt',
    ],
    erklaerung:
      'ABCDE folgt dem, was am schnellsten tötet: Ein verlegter Atemweg vor Atemproblemen vor Kreislaufproblemen. Lebensbedrohliches wird sofort behandelt, bevor es weitergeht.',
  },
  {
    id: 'sampler-anamnese',
    rolle: 'sani',
    titel: 'SAMPLER-Anamnese',
    lage: 'Eine Patientin mit Bauchschmerzen ist stabil. Du erhebst die Anamnese nach dem SAMPLER-Schema.',
    schritte: [
      'S – Symptome',
      'A – Allergien',
      'M – Medikamente',
      'P – Patientengeschichte (Vorerkrankungen)',
      'L – Letzte Mahlzeit, Stuhlgang, Periode',
      'E – Ereignis: Was ist passiert?',
      'R – Risikofaktoren',
    ],
    erklaerung:
      'Die Buchstabenfolge ist eine Merkhilfe, damit nichts vergessen wird. In der Praxis darf das Gespräch flexibel sein – Hauptsache, am Ende ist alles erfragt.',
  },
  {
    id: 'uebergabe-isbar',
    rolle: 'sani',
    titel: 'Übergabe an die Klinik',
    lage: 'Ihr bringt einen Patienten mit Atemnot in die Notaufnahme. Du übergibst nach dem ISBAR-Schema.',
    schritte: [
      'I – Identifikation: Wer bin ich, wer ist der Patient?',
      'S – Situation: Warum ist er hier?',
      'B – Background: Vorgeschichte, Medikamente',
      'A – Assessment: ABCDE-Befunde, Maßnahmen',
      'R – Recommendation: Was ist jetzt nötig?',
    ],
    erklaerung:
      'Eine feste Struktur verhindert, dass bei der Übergabe Wichtiges verloren geht. Das Klinikteam hört dabei möglichst ohne Unterbrechung zu.',
  },
  {
    id: 'reanimation-team',
    rolle: 'sani',
    titel: 'Reanimation im Team',
    lage: 'Im Wohnzimmer liegt eine leblose Frau. Ihr seid zu dritt mit Defibrillator vor Ort.',
    schritte: [
      'Bewusstsein und Atmung prüfen (max. 10 s)',
      'Sofort mit Thoraxkompressionen beginnen',
      'Defi-Pads kleben, während weiter gedrückt wird',
      'Rhythmusanalyse, Drücken kurz pausieren',
      'Bei Kammerflimmern: Schock abgeben',
      'Sofort 2 Minuten weiterdrücken',
      'Erneute Analyse, Helfer wechseln',
    ],
    erklaerung:
      'Pausen in der Herzdruckmassage müssen so kurz wie möglich sein. Nach dem Schock wird ohne Pulskontrolle sofort weitergedrückt, erst nach 2 Minuten folgt die nächste Analyse.',
  },
  {
    id: 'schlaganfall-sani',
    rolle: 'sani',
    titel: 'Patient mit Verdacht Schlaganfall',
    lage: 'Ein 68-Jähriger kann seinen rechten Arm nicht mehr heben. Seine Frau hat 112 gerufen.',
    schritte: [
      'Ersteinschätzung nach ABCDE',
      'BE-FAST-Test durchführen',
      'Symptombeginn erfragen, Blutzucker messen',
      'Stroke Unit voranmelden',
      'Zügiger Transport, Oberkörper erhöht',
      'Übergabe mit Zeitpunkt „zuletzt gesund gesehen“',
    ],
    erklaerung:
      'Bei Schlaganfall gilt „Time is brain“. Eine Unterzuckerung kann ähnlich aussehen und muss ausgeschlossen werden; die Voranmeldung spart in der Klinik wertvolle Minuten.',
  },
  {
    id: 'einsatzablauf',
    rolle: 'sani',
    titel: 'Einsatz vom Alarm bis zur Wache',
    lage: 'Der Melder geht: Einsatz für euren Rettungswagen. Bringe den Einsatz in die richtige Reihenfolge.',
    schritte: [
      'Alarm: Einsatzdaten lesen, ausrücken',
      'Anfahrt mit Sonderrechten',
      'Lage erkunden, Eigenschutz',
      'Patient untersuchen und versorgen',
      'Transport in die geeignete Klinik',
      'Übergabe an das Klinikteam',
      'Desinfizieren, auffüllen, einsatzbereit melden',
    ],
    erklaerung:
      'Jeder Einsatz folgt diesem Grundmuster. Erst wenn der Wagen gereinigt und aufgefüllt ist, seid ihr wieder bereit für den nächsten Notfall.',
  },
];
