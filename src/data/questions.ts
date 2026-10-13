/** Wissensfragen für das Training – Erwachsene, vereinfacht, angelehnt an aktuelle Erste-Hilfe-Leitlinien. */
export interface KnowledgeQuestion {
  id: string;
  question: string;
  /** Die erste Antwort ist die richtige; die Reihenfolge wird im Spiel gemischt. */
  answers: [string, string, string, string];
  explanation: string;
}

export const QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'cpr-rate',
    question: 'Wie schnell drücke ich bei der Herzdruckmassage?',
    answers: ['100–120 Mal pro Minute', '60–80 Mal pro Minute', '140–160 Mal pro Minute', 'So schnell ich kann'],
    explanation: 'Etwa zwei Mal pro Sekunde. Merkhilfe: der Takt von „Stayin’ Alive“.',
  },
  {
    id: 'cpr-depth',
    question: 'Wie tief drücke ich den Brustkorb eines Erwachsenen ein?',
    answers: ['5–6 cm', '1–2 cm', '8–10 cm', 'Nur leicht antippen'],
    explanation: '5–6 cm tief und den Brustkorb danach vollständig entlasten.',
  },
  {
    id: 'cpr-ratio',
    question: 'Welches Verhältnis gilt bei der Wiederbelebung von Erwachsenen?',
    answers: ['30 Kompressionen : 2 Beatmungen', '15 : 2', '5 : 1', '50 : 5'],
    explanation: 'Wer nicht beatmen kann oder will, drückt durchgehend weiter.',
  },
  {
    id: 'cpr-where',
    question: 'Wo setze ich bei der Herzdruckmassage die Hände auf?',
    answers: ['Mitte des Brustkorbs (untere Hälfte des Brustbeins)', 'Auf den Bauch', 'Links unter die Brust', 'Auf den Hals'],
    explanation: 'Handballen in die Mitte des Brustkorbs, zweite Hand darauf, Arme gestreckt.',
  },
  {
    id: 'cpr-check',
    question: 'Wie lange prüfe ich höchstens, ob eine bewusstlose Person normal atmet?',
    answers: ['10 Sekunden', '1 Minute', '30 Sekunden', 'So lange, bis ich sicher bin'],
    explanation: 'Sehen, hören, fühlen – höchstens 10 Sekunden. Schnappatmung ist keine normale Atmung!',
  },
  {
    id: 'aed',
    question: 'Was mache ich mit einem AED (Defibrillator)?',
    answers: ['Einschalten und den Sprachanweisungen folgen', 'Nur ein Arzt darf ihn benutzen', 'Erst nach 10 Minuten Herzdruckmassage holen', 'Nur bei Kindern verwenden'],
    explanation: 'Jeder darf einen AED benutzen. Er analysiert selbst und gibt nur einen Schock, wenn er nötig ist.',
  },
  {
    id: 'aed-after',
    question: 'Was tue ich direkt nach einem Schock durch den AED?',
    answers: ['Sofort mit der Herzdruckmassage weitermachen', 'Puls eine Minute lang tasten', 'Den AED ausschalten', 'Die Person hinsetzen'],
    explanation: 'Sofort weiterdrücken – der AED meldet sich nach 2 Minuten zur nächsten Analyse.',
  },
  {
    id: 'agonal',
    question: 'Eine bewusstlose Person schnappt nur selten nach Luft. Was bedeutet das?',
    answers: ['Keine normale Atmung – sofort Wiederbelebung', 'Sie atmet, also Seitenlage', 'Sie schläft nur', 'Abwarten und beobachten'],
    explanation: 'Schnappatmung ist ein Zeichen für einen Kreislaufstillstand.',
  },
  {
    id: 'seitenlage',
    question: 'Wann bringe ich jemanden in die stabile Seitenlage?',
    answers: ['Bewusstlos, aber normale Atmung', 'Bewusstlos ohne Atmung', 'Bei Brustschmerzen', 'Bei Atemnot'],
    explanation: 'Ohne normale Atmung wird sofort wiederbelebt, nicht gelagert.',
  },
  {
    id: 'notruf',
    question: 'Welche Nummer wähle ich in ganz Europa im Notfall?',
    answers: ['112', '110', '911', '116 117'],
    explanation: '112 erreicht Rettungsdienst und Feuerwehr in der ganzen EU. 116 117 ist der ärztliche Bereitschaftsdienst.',
  },
  {
    id: 'notruf-ende',
    question: 'Wer beendet das Notrufgespräch?',
    answers: ['Die Leitstelle', 'Ich, sobald ich die Adresse gesagt habe', 'Egal', 'Der Patient'],
    explanation: 'Die Leitstelle hat oft Rückfragen oder gibt Anleitung zur Wiederbelebung am Telefon.',
  },
  {
    id: 'eigenschutz',
    question: 'Was hat an einer Unfallstelle immer Vorrang?',
    answers: ['Eigenschutz', 'Fotos für die Polizei', 'Den Patienten sofort umdrehen', 'Den Helm abnehmen'],
    explanation: 'Wer sich selbst verletzt, kann niemandem mehr helfen: Warnweste, Warndreieck, Handschuhe.',
  },
  {
    id: 'rettungsgasse',
    question: 'Wo bilde ich auf einer dreispurigen Autobahn die Rettungsgasse?',
    answers: ['Zwischen der linken und der mittleren Spur', 'Zwischen mittlerer und rechter Spur', 'Auf dem Standstreifen', 'Erst wenn ich das Martinshorn höre'],
    explanation: 'Immer zwischen der ganz linken Spur und allen anderen – schon bei stockendem Verkehr.',
  },
  {
    id: 'abcde',
    question: 'Wofür steht das „B“ im ABCDE-Schema?',
    answers: ['Belüftung/Atmung', 'Blutzucker', 'Bewusstsein', 'Blutung'],
    explanation: 'A Atemwege, B Belüftung, C Kreislauf, D Neurologie, E Erweiterte Untersuchung.',
  },
  {
    id: 'abcde-d',
    question: 'Was gehört im ABCDE-Schema zum „D“?',
    answers: ['Bewusstsein, Pupillen und Blutzucker', 'Puls und Blutdruck', 'Atemgeräusche', 'Temperatur und Wärmeerhalt'],
    explanation: 'D = Disability, also neurologische Defizite. Bei Bewusstseinsstörung immer Blutzucker messen!',
  },
  {
    id: 'gcs-max',
    question: 'Wie viele Punkte hat ein wacher, orientierter Mensch auf der Glasgow Coma Scale?',
    answers: ['15', '10', '3', '20'],
    explanation: 'Die Skala reicht von 3 (tief bewusstlos) bis 15 (wach, orientiert, befolgt Aufforderungen).',
  },
  {
    id: 'gcs-8',
    question: 'Ab welchem GCS-Wert gelten die Atemwege als gefährdet?',
    answers: ['8 oder weniger', '14 oder weniger', 'erst bei 3', 'GCS sagt nichts über die Atemwege'],
    explanation: '„GCS 8 – intubate“: Schutzreflexe fehlen oft, der Notarzt sichert die Atemwege.',
  },
  {
    id: 'befast',
    question: 'Wofür steht das „T“ bei BE-FAST?',
    answers: ['Time – Uhrzeit merken, sofort 112', 'Temperatur', 'Tablette geben', 'Tasten des Pulses'],
    explanation: 'Beim Schlaganfall zählt jede Minute: Time is brain.',
  },
  {
    id: 'stroke-lage',
    question: 'Wie lagere ich einen wachen Patienten mit Verdacht auf Schlaganfall?',
    answers: ['Oberkörper ca. 30° hoch', 'Beine hoch', 'Kopf tief', 'Auf dem Bauch'],
    explanation: 'Oberkörper leicht erhöht, nichts essen oder trinken lassen (Schluckstörung!).',
  },
  {
    id: 'infarkt',
    question: 'Was ist typisch für einen Herzinfarkt?',
    answers: ['Brustschmerz, der in Arm oder Kiefer ausstrahlt', 'Juckreiz am ganzen Körper', 'Fieber über 39 °C', 'Stechender Schmerz nur beim Tasten'],
    explanation: 'Dazu oft Kaltschweißigkeit, Übelkeit, Todesangst. Bei Frauen und Diabetikern auch untypisch!',
  },
  {
    id: 'infarkt-gehen',
    question: 'Darf ein Patient mit Verdacht auf Herzinfarkt zum Rettungswagen laufen?',
    answers: ['Nein – jede Belastung schadet dem Herzmuskel', 'Ja, Bewegung tut gut', 'Ja, wenn er es möchte', 'Nur bergab'],
    explanation: 'Tragen statt laufen lassen, Oberkörper hoch, beruhigen.',
  },
  {
    id: 'hypo-wach',
    question: 'Ein Diabetiker ist zittrig und verschwitzt, aber wach und kann schlucken. Was hilft?',
    answers: ['Traubenzucker oder ein zuckerhaltiges Getränk', 'Insulin spritzen', 'Ein Glas Wasser', 'Nichts geben, nur beobachten'],
    explanation: 'Bei Unterzuckerung braucht der Körper schnell Zucker. Im Zweifel immer Zucker – nie Insulin.',
  },
  {
    id: 'hypo-bewusstlos',
    question: 'Darf ich einer bewusstlosen Person etwas zu trinken geben?',
    answers: ['Nein – Erstickungsgefahr', 'Ja, wenn es Zuckerwasser ist', 'Ja, in kleinen Schlucken', 'Nur Wasser'],
    explanation: 'Bewusstlose können nicht sicher schlucken. Der Rettungsdienst gibt Glukose in die Vene.',
  },
  {
    id: 'anaphylaxie',
    question: 'Welches Medikament ist bei einer schweren allergischen Reaktion (Anaphylaxie) am wichtigsten?',
    answers: ['Adrenalin in den Oberschenkelmuskel', 'Paracetamol', 'Insulin', 'Ein Antibiotikum'],
    explanation: 'Adrenalin wirkt schnell gegen Schwellung, Atemnot und Blutdruckabfall – z. B. mit dem Autoinjektor („Pen“).',
  },
  {
    id: 'asthma',
    question: 'Welche Haltung hilft bei Atemnot?',
    answers: ['Sitzen, Arme abstützen („Kutschersitz“)', 'Flach auf den Rücken legen', 'Kopf nach unten', 'Bauchlage'],
    explanation: 'So kann die Atemhilfsmuskulatur mitarbeiten. Dazu die Lippenbremse: langsam durch die gespitzten Lippen ausatmen.',
  },
  {
    id: 'co',
    question: 'Warum ist die Sauerstoffsättigung bei einer Kohlenmonoxid-Vergiftung trügerisch?',
    answers: ['Das Pulsoximeter zeigt falsch normale Werte', 'Sie ist immer 0 %', 'CO senkt nur den Puls', 'Das Gerät geht kaputt'],
    explanation: 'Das Pulsoximeter unterscheidet CO-Hämoglobin nicht von Sauerstoff. Ein CO-Warnmelder schützt das Team.',
  },
  {
    id: 'opioid',
    question: 'Was ist typisch für eine Opioid-Überdosis?',
    answers: ['Stecknadelkopfgroße Pupillen und sehr langsame Atmung', 'Weite Pupillen und Fieber', 'Hoher Blutzucker', 'Starker Juckreiz und Niesen'],
    explanation: 'Gegenmittel ist Naloxon. Wichtig ist zuerst die Beatmung.',
  },
  {
    id: 'krampf',
    question: 'Was tue ich während eines Krampfanfalls?',
    answers: ['Vor Verletzungen schützen und die Zeit stoppen', 'Festhalten', 'Einen Beißkeil in den Mund schieben', 'Mit Wasser bespritzen'],
    explanation: 'Gegenstände wegräumen, Kopf polstern. Dauert der Anfall über 5 Minuten: Notruf, Status epilepticus!',
  },
  {
    id: 'blutung',
    question: 'Eine Wunde am Arm blutet stark. Was mache ich zuerst?',
    answers: ['Fest drücken und einen Druckverband anlegen', 'Arm unter kaltes Wasser halten', 'Wunde mit Salbe eincremen', 'Abwarten, bis es aufhört'],
    explanation: 'Direkter Druck stoppt die meisten Blutungen. Hilft das nicht: Tourniquet oberhalb der Wunde.',
  },
  {
    id: 'nase',
    question: 'Wie verhalte ich mich bei Nasenbluten?',
    answers: ['Kopf nach vorn beugen, Nasenflügel zusammendrücken', 'Kopf in den Nacken legen', 'Flach hinlegen', 'Kräftig schnäuzen'],
    explanation: 'Nach vorn, damit das Blut nicht verschluckt wird. Ein kalter Umschlag im Nacken kann helfen.',
  },
  {
    id: 'verbrennung',
    question: 'Wie kühle ich eine kleine Verbrennung richtig?',
    answers: ['Etwa 10 Minuten mit handwarmem Wasser', 'Mit Eiswürfeln direkt auf der Haut', 'Mit Butter oder Mehl', 'Gar nicht kühlen'],
    explanation: 'Kein Eis, keine Hausmittel. Große Flächen nicht kühlen – sonst droht Unterkühlung.',
  },
  {
    id: 'unterkuehlung',
    question: 'Was ist bei einer stark unterkühlten Person wichtig?',
    answers: ['Vorsichtig bewegen und vor weiterer Kälte schützen', 'Kräftig die Arme und Beine reiben', 'Heiß duschen lassen', 'Alkohol zum Aufwärmen geben'],
    explanation: 'Kaltes Blut aus Armen und Beinen kann sonst zum Herzen strömen und Rhythmusstörungen auslösen („Bergungstod“).',
  },
  {
    id: 'hitzschlag',
    question: 'Woran erkenne ich einen Hitzschlag?',
    answers: ['Heiße, rote, trockene Haut und Verwirrtheit', 'Blasse, kalte Haut', 'Sehr niedrige Temperatur', 'Nur leichter Durst'],
    explanation: 'Lebensbedrohlich! In den Schatten bringen, Kleidung öffnen, aktiv kühlen, 112.',
  },
  {
    id: 'schocklage',
    question: 'Wann lege ich die Beine NICHT hoch?',
    answers: ['Bei Atemnot oder Kopf- und Brustverletzung', 'Bei Kreislaufschwäche', 'Bei starkem Blutverlust', 'Bei Ohnmacht'],
    explanation: 'Bei Atemnot und Herzproblemen den Oberkörper hoch lagern.',
  },
  {
    id: 'schock',
    question: 'Was ist ein frühes Zeichen für einen Schock?',
    answers: ['Schneller Puls und blasse, kalte Haut', 'Hoher Blutdruck', 'Langsamer Puls', 'Rote, warme Haut'],
    explanation: 'Der Blutdruck fällt oft erst spät ab. Darum auf Puls, Haut und Unruhe achten.',
  },
  {
    id: 'sepsis',
    question: 'Welche Zeichen machen bei Fieber eine Sepsis (Blutvergiftung) wahrscheinlich?',
    answers: ['Schnelle Atmung, niedriger Blutdruck, Verwirrtheit', 'Nur Schnupfen', 'Hoher Blutzucker allein', 'Durchfall ohne Fieber'],
    explanation: 'Das ist der qSOFA-Score: Atemfrequenz ≥ 22, systolisch ≤ 100 mmHg, verändertes Bewusstsein.',
  },
  {
    id: 'pneu',
    question: 'Was spricht nach einem Sturz für einen Spannungspneumothorax?',
    answers: ['Zunehmende Atemnot, einseitig kein Atemgeräusch, Blutdruckabfall', 'Nur Kopfschmerz', 'Hoher Blutzucker', 'Juckender Ausschlag'],
    explanation: 'Lebensbedrohlich: Der Notarzt entlastet den Druck mit einer Nadel im Brustkorb.',
  },
  {
    id: 'fremdkoerper',
    question: 'Ein Erwachsener hat sich verschluckt und kann nicht mehr husten. Was tue ich?',
    answers: ['5 Schläge zwischen die Schulterblätter, dann 5 Oberbauchkompressionen', 'Wasser trinken lassen', 'Flach hinlegen', 'Mit den Fingern blind im Mund suchen'],
    explanation: 'Solange die Person kräftig hustet, nur zum Husten auffordern. Wird sie bewusstlos: Wiederbelebung.',
  },
  {
    id: 'sampler',
    question: 'Wofür steht das „M“ bei SAMPLER?',
    answers: ['Medikamente', 'Mahlzeit', 'Monitor', 'Muskelkraft'],
    explanation: 'Symptome, Allergien, Medikamente, Patientengeschichte, Letzte Mahlzeit, Ereignis, Risikofaktoren.',
  },
  {
    id: 'bz-norm',
    question: 'Ab welchem Blutzuckerwert spricht man bei Erwachsenen von Unterzuckerung?',
    answers: ['Unter 70 mg/dl', 'Unter 140 mg/dl', 'Unter 100 mg/dl', 'Unter 20 mg/dl'],
    explanation: 'Unter 70 mg/dl (3,9 mmol/l). Unter 50 mg/dl drohen Bewusstseinsstörungen und Krampfanfälle.',
  },
  {
    id: 'spo2-norm',
    question: 'Welche Sauerstoffsättigung ist bei Gesunden normal?',
    answers: ['95–100 %', '80–90 %', '50–70 %', 'Genau 100 %, sonst krank'],
    explanation: 'Bei COPD-Patienten sind 88–92 % oft schon ausreichend.',
  },
  {
    id: 'ketoazidose',
    question: 'Ein Diabetiker atmet sehr tief und schnell, der Atem riecht nach Aceton. Woran denke ich?',
    answers: ['Diabetische Ketoazidose (Überzuckerung)', 'Unterzuckerung', 'Asthma', 'Alkoholvergiftung allein'],
    explanation: 'Die tiefe „Kussmaul-Atmung“ ist der Versuch, Säure abzuatmen. Blutzucker messen!',
  },
  {
    id: 'sht',
    question: 'Was ist nach einem Sturz auf den Kopf ein Warnzeichen?',
    answers: ['Zunehmende Schläfrigkeit und Erbrechen', 'Eine kleine Beule ohne Beschwerden', 'Hunger', 'Leichter Muskelkater'],
    explanation: 'Das kann auf eine Blutung im Kopf hinweisen. Besonders gefährlich bei Blutverdünnern!',
  },
  {
    id: 'helm',
    question: 'Ein bewusstloser Motorradfahrer atmet nicht. Was ist mit dem Helm?',
    answers: ['Abnehmen – sonst ist keine Wiederbelebung möglich', 'Auf keinen Fall abnehmen', 'Nur das Visier öffnen und warten', 'Den Kopf mit Helm schütteln'],
    explanation: 'Am besten zu zweit: Einer stabilisiert Kopf und Hals, der andere zieht den Helm vorsichtig ab.',
  },
];
