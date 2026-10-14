import { AktenBild, AktenFall } from './types';

export const BILDER_KINDER: AktenBild[] = [
  {
    id: 'bronchiolitis',
    diagnosis: 'Bronchiolitis (RSV-Infekt beim Säugling)',
    kategorie: 'kinder',
    leitsymptome: [
      'Säugling mit Schnupfen, dann schnelle Atmung und Einziehungen',
      'Trinkschwäche, Giemen oder Brummen beim Ausatmen',
      'Winterzeit, oft erkältete Geschwister oder Krippenkontakt',
    ],
  },
  {
    id: 'knopfzelle',
    diagnosis: 'Verschluckte Knopfzelle (Batterie)',
    kategorie: 'kinder',
    leitsymptome: [
      'Speichelfluss, Schluckverweigerung, Husten oder Würgen',
      'Kleinkind mit Zugang zu Fernbedienung, Hörgerät oder Spielzeug',
      'Oft unbeobachtet – die Schleimhaut verätzt schon nach wenigen Stunden',
    ],
  },
  {
    id: 'invagination',
    diagnosis: 'Darmeinstülpung (Invagination)',
    kategorie: 'kinder',
    leitsymptome: [
      'Anfallsartige Bauchschmerzen mit Schreien und angezogenen Beinen',
      'Zwischen den Anfällen blass, still und apathisch',
      'Erbrechen, später blutig-schleimiger Stuhl („Himbeergelee“)',
    ],
  },
  {
    id: 'kindvergiftung',
    diagnosis: 'Vergiftung im Kleinkindalter',
    kategorie: 'kinder',
    leitsymptome: [
      'Leere Verpackung oder offene Flasche in Reichweite des Kindes',
      'Plötzliche Beschwerden ohne Infekt, z. B. Schläfrigkeit oder Speichelfluss',
      'Giftnotruf anrufen, Verpackung und Reste sichern',
    ],
  },
];

export const AKTEN_KINDER: AktenFall[] = [
  {
    id: 'fieberkrampf-kita',
    bild: 'fieberkrampf',
    difficulty: 1,
    patient: { name: 'Jonas Ulrich', age: 3, sex: 'm' },
    location: 'Erfurt, Kita am Roten Berg',
    dispatch: 'Kita: Ein Junge hat am ganzen Körper gezuckt, ist jetzt ganz still. Erzieherin ist dabei.',
    scene:
      'Jonas liegt auf einer Decke im Gruppenraum, die Erzieherin kniet neben ihm. Die anderen Kinder wurden in den Nebenraum gebracht. Er ist rot im Gesicht und sehr heiß.',
    anamnese: [
      '„Er hat vorhin beim Mittagessen noch normal mitgemacht.“',
      'Der Krampf hat etwa 3 Minuten gedauert, alle vier Gliedmaßen haben gezuckt, dann hat es von allein aufgehört.',
      'Seit gestern Schnupfen und Husten, die Eltern wissen davon. Keine Vorerkrankungen.',
    ],
    befund: ['Heiße, gerötete Haut', 'Schläfrig, öffnet auf Ansprache die Augen', 'Nacken frei beweglich, kein Hautausschlag'],
    vitals: { puls: 142, rr: [96, 58], spo2: 96, af: 28, temp: 39.8, bz: 102, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'bz'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Unterzuckerung', 'Gehirnerschütterung nach einem Sturz'],
    explanation:
      'Hohes Fieber bei einem Infekt, ein kurzer Krampf am ganzen Körper und danach Schläfrigkeit: das klassische Bild des Fieberkrampfs. Blutzucker messen, Nacken und Haut prüfen, das Kind in Seitenlage überwachen und zur Abklärung in die Kinderklinik bringen.',
  },
  {
    id: 'fieberkrampf-nachts',
    bild: 'fieberkrampf',
    difficulty: 2,
    patient: { name: 'Emilia Voss', age: 1, sex: 'w' },
    location: 'Nürnberg, Wohnung in der Südstadt',
    dispatch: 'Mutter: Baby ist nachts steif geworden und ganz blau angelaufen, jetzt wieder wach.',
    scene:
      'Es ist kurz nach 3 Uhr. Die Mutter steht im Schlafanzug im Flur und hält die quengelnde Emilia fest an sich gedrückt. Im Kinderzimmer brennt nur das Nachtlicht.',
    anamnese: [
      '„Ich bin von einem Geräusch aufgewacht, da war sie schon ganz steif und die Lippen waren blau.“',
      'Das dauerte etwa anderthalb Minuten, dann wurde sie schlaff und fing an zu weinen.',
      'Abends war sie noch fit und kühl; seit etwa 2 Stunden ist sie heiß. Epilepsie gibt es in der Familie nicht.',
    ],
    befund: ['Wach, quengelig, erkennt die Mutter', 'Heiße Haut, Lippen wieder rosig', 'Nacken weich, keine Hautflecken, Fontanelle eben'],
    vitals: { puls: 148, rr: [92, 54], spo2: 97, af: 34, temp: 39.1, bz: 96, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls', 'gcs'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Epilepsie', 'Vergiftung mit Medikamenten'],
    explanation:
      'Der Krampf kam, als das Fieber gerade stieg – die Höhe des Fiebers ist nicht entscheidend. Die Atempause mit blauen Lippen gehört zum Krampf. Wach, weicher Nacken und keine Flecken sprechen gegen Meningitis: Blutzucker messen, kindgerecht in die Klinik.',
  },
  {
    id: 'pseudokrupp-nachts',
    bild: 'pseudokrupp',
    difficulty: 1,
    patient: { name: 'Lina Wendt', age: 2, sex: 'w' },
    location: 'Augsburg, Mehrfamilienhaus im Univiertel',
    dispatch: 'Zweijährige hustet nachts bellend und kriegt schlecht Luft.',
    scene:
      'Lina sitzt aufrecht auf dem Schoß ihres Vaters im Wohnzimmer, die Mutter hat das Fenster geöffnet. Man hört ihren Husten schon im Treppenhaus. Zwischendurch pfeift es beim Einatmen.',
    anamnese: [
      '„Sie klingt wie ein Seehund, so hat sie noch nie gehustet.“',
      'Gegen 23 Uhr wurde sie wach, vorher war sie nur leicht erkältet und hat normal gespielt.',
      'Sie trinkt noch aus ihrer Flasche, Spielzeug hat sie nicht im Mund gehabt.',
    ],
    befund: ['Bellender Husten, heisere Stimme', 'Pfeifen beim Einatmen, leichte Einziehungen am Hals', 'Kein Speichelfluss, sitzt ruhig auf dem Schoß'],
    vitals: { puls: 128, rr: [98, 60], spo2: 95, af: 36, temp: 37.9, bz: 100, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['spo2', 'af', 'temp'],
    distractors: ['Fremdkörperaspiration', 'Kehldeckelentzündung (Epiglottitis)', 'Asthmaanfall'],
    explanation:
      'Bellender Husten, Heiserkeit und ein Pfeifen beim Einatmen nach einem Infekt sind typisch für Pseudokrupp. Kein Speichelfluss und kein hohes Fieber sprechen gegen eine Kehldeckelentzündung. Kind in Ruhe lassen, auf dem Schoß der Eltern beruhigen, nicht in den Rachen schauen.',
  },
  {
    id: 'pseudokrupp-urlaub',
    bild: 'pseudokrupp',
    difficulty: 2,
    patient: { name: 'Noah Zimmermann', age: 4, sex: 'm' },
    location: 'Kühlungsborn, Ferienwohnung nahe der Strandpromenade',
    dispatch: 'Vierjähriger im Urlaub, nachts Atemnot, Eltern wissen nicht weiter.',
    scene:
      'In der Ferienwohnung ist es feucht und kühl, draußen zieht Nebel von der Ostsee. Noah sitzt aufrecht im Bett und lässt sich nicht hinlegen. Seine Eltern sind erst gestern angereist.',
    anamnese: [
      '„So etwas kennen wir nicht, er hatte noch nie Probleme mit der Atmung.“',
      'Am Nachmittag war er etwas heiser und schniefte, abends fiel er erschöpft ins Bett.',
      'Gegen Mitternacht wachte er mit rauem Husten auf; auch im Sitzen pfeift es beim Einatmen.',
    ],
    befund: ['Rauer, bellender Husten, heisere Stimme', 'Leichtes Pfeifen beim Einatmen, auch in Ruhe', 'Kein Hautausschlag, keine Schwellung im Gesicht'],
    vitals: { puls: 124, rr: [100, 62], spo2: 94, af: 34, temp: 37.6, bz: 98, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Asthmaanfall', 'Lungenentzündung', 'Allergische Reaktion (Anaphylaxie)'],
    explanation:
      'Auch ohne Vorerfahrung der Eltern verrät das Geräusch beim Einatmen die Diagnose: Stridor und bellender Husten, kein Giemen beim Ausatmen, kein Ausschlag. Ruhe bewahren, Sauerstoff vorhalten, kühle Luft anbieten und in die Kinderklinik fahren.',
  },
  {
    id: 'aspiration-weintraube',
    bild: 'aspiration',
    difficulty: 2,
    patient: { name: 'Ben Vogel', age: 1, sex: 'm' },
    location: 'Rostock, Wohnung in der Südstadt',
    dispatch: 'Kleinkind hat sich in der Küche verschluckt, hustet und pfeift.',
    scene:
      'Ben sitzt im Hochstuhl, das Gesicht ist gerötet, Tränen laufen ihm über die Wangen. Seine Mutter hält ihn im Arm, auf dem Boden liegen Weintrauben und ein umgekippter Teller.',
    anamnese: [
      '„Er hat gerade noch gelacht und mit dem Essen gespielt.“',
      'Er hat eine ganze Weintraube in den Mund gesteckt, plötzlich gewürgt und stark gehustet.',
      'Die Mutter hat ihm kräftig auf den Rücken geklopft; seitdem hustet er weiter und pfeift beim Atmen.',
    ],
    befund: ['Kräftiger Husten, kann weinen', 'Pfeifendes Atemgeräusch', 'Kein Ausschlag, keine Schwellung der Lippen'],
    vitals: { puls: 140, rr: [100, 62], spo2: 92, af: 40, temp: 36.8, bz: 104, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Pseudokrupp', 'Allergische Reaktion (Anaphylaxie)', 'Lungenentzündung'],
    explanation:
      'Plötzlicher Hustenanfall beim Essen, vorher gesund: Das spricht für ein verschlucktes Teil, hier die Weintraube. Solange das Kind kräftig hustet, ist Husten die beste Hilfe. Nicht blind im Mund suchen, Sauerstoff geben und in die Kinderklinik.',
  },
  {
    id: 'aspiration-spielzeug',
    bild: 'aspiration',
    difficulty: 3,
    patient: { name: 'Sofie Yildiz', age: 2, sex: 'w' },
    location: 'Karlsruhe, Wohnzimmer im Mehrfamilienhaus',
    dispatch: 'Zweijährige hat seit Stunden Husten und atmet komisch, Mutter ist besorgt.',
    scene:
      'Sofie sitzt ruhig auf dem Teppich zwischen Bauklötzen und Plüschtieren. Sie wirkt blass, die Atmung klingt auf einer Seite pfeifend. Die Mutter beobachtet sie besorgt.',
    anamnese: [
      '„Eigentlich ist sie ganz fit, nur dieses Husten und Pfeifen macht mir Sorgen.“',
      'Heute Vormittag gab es einen plötzlichen Hustenanfall im Spielzimmer, danach wurde sie wieder ruhig.',
      'Niemand hat gesehen, was sie im Mund hatte; an einer Spielzeugfigur fehlt ein kleines Teil.',
    ],
    befund: ['Rechts abgeschwächtes Atemgeräusch', 'Einseitiges Giemen rechts, sonst keine Geräusche', 'Kein Fieber, kein Schnupfen'],
    vitals: { puls: 136, rr: [100, 60], spo2: 93, af: 38, temp: 37.0, bz: 98, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['spo2', 'af'],
    distractors: ['Asthmaanfall', 'Lungenentzündung', 'Allergische Reaktion (Anaphylaxie)'],
    explanation:
      'Niemand hat das Verschlucken beobachtet. Der Schlüssel: plötzlicher Hustenanfall, danach ruhig, jetzt nur auf einer Seite abgeschwächt und giemend. Asthma wäre beidseitig. Ein Fremdkörper in einem Bronchus braucht eine Klinik mit Bronchoskopie.',
  },
  {
    id: 'exsikkose-kita',
    bild: 'exsikkose',
    difficulty: 2,
    patient: { name: 'Hanna Zielinski', age: 3, sex: 'w' },
    location: 'Chemnitz, Wohnung am Sonnenberg',
    dispatch: 'Dreijährige seit zwei Tagen krank, jetzt sehr schlapp und reagiert kaum.',
    scene:
      'Hanna liegt eingewickelt auf dem Sofa und sieht mich mit großen, glanzlosen Augen an. Neben ihr stehen eine volle Trinkflasche und ein Eimer. Die Mutter wirkt übermüdet.',
    anamnese: [
      '„Sie hat sich im Kindergarten angesteckt – dort sind gerade viele krank.“',
      'Seit zwei Tagen Erbrechen und Durchfall, Trinken klappt kaum noch.',
      'Die letzte Windel war gestern Abend nass; seitdem hat sie nicht mehr uriniert.',
    ],
    befund: ['Trockene Lippen, eingesunkene Augen', 'Hautfalte bleibt kurz stehen', 'Schlapp, kühle Hände, weicher Bauch ohne Abwehr'],
    vitals: { puls: 150, rr: [80, 50], spo2: 98, af: 34, temp: 37.8, bz: 72, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'gcs', 'bz'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Blinddarmentzündung', 'Diabetische Ketoazidose'],
    explanation:
      'Brechdurchfall, kaum Trinken, kaum Urin, eingesunkene Augen und ein schneller Puls: Das Kind ist ausgetrocknet. Weicher Bauch und kein Nackenschmerz sprechen gegen Blinddarm und Meningitis. Wärmeerhalt, Blutzucker messen, Notarzt nach Lage nachfordern, zügig in die Kinderklinik.',
  },
  {
    id: 'exsikkose-saeugling',
    bild: 'exsikkose',
    difficulty: 3,
    patient: { name: 'Matteo Unger', age: 0, sex: 'm' },
    location: 'Mannheim, Dachgeschosswohnung im Jungbusch',
    dispatch: 'Fünf Monate alter Säugling in der Hitzewelle: Kind trinkt nicht, ist schlapp und heiß.',
    scene:
      'Unter dem Dach sind es fast 32 Grad, der Ventilator läuft. Matteo liegt nur im Body auf dem Wickeltisch, die Mutter hat ihn kühlend abgewischt. Er schaut matt und folgt kaum mit den Augen.',
    anamnese: [
      '„Seit gestern Mittag will er kaum die Flasche, beim Stillen nuckelt er nur kurz.“',
      'Leicht erhöhte Temperatur, kein Durchfall, einmal gespuckt.',
      'Die Windel ist seit etwa acht Stunden trocken; das Köpfchen fühlt sich „eingedellt“ an.',
    ],
    befund: ['Fontanelle eingesunken', 'Hautfalte bleibt deutlich stehen', 'Trockene Schleimhäute, kalte Hände und Füße'],
    vitals: { puls: 172, rr: [68, 40], spo2: 97, af: 52, temp: 38.6, bz: 78, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp', 'bz'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Unterzuckerung', 'Lungenentzündung'],
    explanation:
      'Die eingesunkene Fontanelle (bei Meningitis eher gewölbt), die trockene Windel und die stehende Hautfalte zeigen den Flüssigkeitsmangel. Säuglinge trocknen bei Hitze rasend schnell aus. Wärmeerhalt statt Auskühlen, Notarzt nachfordern, Transport in die Kinderklinik.',
  },
  {
    id: 'bronchiolitis-winter',
    bild: 'bronchiolitis',
    difficulty: 2,
    patient: { name: 'Mila Vogt', age: 0, sex: 'w' },
    location: 'Magdeburg, Wohnung in Stadtfeld',
    dispatch: 'Vier Monate altes Baby atmet schnell und trinkt nicht mehr.',
    scene:
      'Im Wohnzimmer läuft ein Luftbefeuchter, die Fenster sind beschlagen. Mila liegt auf dem Arm ihres Vaters, der Brustkorb hebt und senkt sich schnell. Im Nebenzimmer hustet ein größeres Kind.',
    anamnese: [
      '„Sie war seit drei Tagen verschnupft, wir haben das für eine normale Erkältung gehalten.“',
      'Heute Nacht wurde die Atmung immer schneller, die Flasche schafft sie nur noch in kleinen Schlucken.',
      'Die große Schwester (4, Kita) hat seit einer Woche Husten und Schnupfen.',
    ],
    befund: ['Schnelle Atmung mit Einziehungen zwischen den Rippen', 'Brummendes Giemen beim Ausatmen, verstopfte Nase', 'Kein bellender Husten, kein Ausschlag'],
    vitals: { puls: 164, rr: [90, 54], spo2: 90, af: 62, temp: 37.8, bz: 92, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Pseudokrupp', 'Fremdkörperaspiration', 'Allergische Reaktion (Anaphylaxie)'],
    explanation:
      'Schnupfen, dann Einziehungen, Trinkschwäche und Giemen beim Säugling im Winter, dazu ein erkälteter Kontakt: typisch für eine RSV-Bronchiolitis. Bellender Husten und Stridor fehlen. Sauerstoff geben, Kind in Oberkörperhochlage und zügig in die Kinderklinik.',
  },
  {
    id: 'bronchiolitis-kita',
    bild: 'bronchiolitis',
    difficulty: 3,
    patient: { name: 'Elias Zeller', age: 0, sex: 'm' },
    location: 'Oldenburg, Krippe in der Innenstadt',
    dispatch: 'Krippe: Baby ist grau im Gesicht und trinkt nicht, Atempausen.',
    scene:
      'Elias liegt in der Wiege im Schlafraum, die Erzieherin hat ihn aufgenommen. Er ist grau, die Lippen sind bläulich. Im Gruppenraum husten und schniefen mehrere Kinder.',
    anamnese: [
      '„Er ist heute still und hat die Flasche nach zwei Schlucken abgelehnt.“',
      'Seit gestern Schnupfen; mehrere Kinder der Gruppe sind erkältet.',
      'Ich habe zwei- oder dreimal gesehen, dass er für etwa zehn Sekunden gar nicht atmet.',
    ],
    befund: ['Graue Haut, bläuliche Lippen', 'Sehr schnelle, flache Atmung mit Einziehungen', 'Giemen und Brummen, Nase verstopft'],
    vitals: { puls: 168, rr: [82, 48], spo2: 87, af: 70, temp: 38.0, bz: 96, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Fremdkörperaspiration', 'Unterzuckerung'],
    explanation:
      'Bei jungen Säuglingen mit Bronchiolitis sind Atempausen, graue Haut und Trinkverweigerung die Warnzeichen, nicht der Husten. Der vorangegangene Schnupfen und die erkälteten Krippenkinder geben den Hinweis. Sofort Sauerstoff, Notarzt nachfordern, Atmung überwachen.',
  },
  {
    id: 'knopfzelle-fernbedienung',
    bild: 'knopfzelle',
    difficulty: 3,
    patient: { name: 'Amelie Ulmer', age: 2, sex: 'w' },
    location: 'Saarbrücken, Wohnung am St. Johanner Markt',
    dispatch: 'Zweijährige speichelt stark und will nicht schlucken, Mutter ist unsicher.',
    scene:
      'Amelie sitzt auf dem Sofa und sabbert, ein Handtuch liegt vor ihr. Sie spielt ruhig mit einem Bilderbuch und wirkt fit. Auf dem Sofatisch liegt die Fernbedienung, die Abdeckung steht offen.',
    anamnese: [
      '„Ich habe sie nur kurz allein gelassen, um Wäsche aufzuhängen.“',
      'Sie hustet leicht und will weder Brei noch Wasser schlucken, hat sonst keine Beschwerden.',
      'Als ich zurückkam, war das Fach der Fernbedienung leer. Die kleine runde Zelle ist nirgends zu finden.',
    ],
    befund: ['Starker Speichelfluss, schluckt nicht', 'Atmung ruhig, kein Pfeifen', 'Mundhöhle und Rachen von außen unauffällig'],
    vitals: { puls: 118, rr: [98, 60], spo2: 98, af: 26, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['spo2', 'af', 'temp'],
    distractors: ['Mandelentzündung (Angina)', 'Allergische Reaktion (Anaphylaxie)', 'Vergiftung mit Medikamenten'],
    explanation:
      'Das Kind wirkt fit, doch eine in der Speiseröhre steckende Knopfzelle verätzt die Schleimhaut innerhalb weniger Stunden. Deshalb nicht abwarten und nichts zu trinken oder essen geben. Kein Fieber und keine Rachenschwellung sprechen gegen Angina. Sofort Notarzt und Klinik.',
  },
  {
    id: 'knopfzelle-hoergeraet',
    bild: 'knopfzelle',
    difficulty: 2,
    patient: { name: 'Luca Voigt', age: 1, sex: 'm' },
    location: 'Passau, Haus der Großeltern am Inn',
    dispatch: 'Einjähriger beim Besuch bei den Großeltern: würgt und läuft der Speichel aus dem Mund.',
    scene:
      'Luca sitzt auf dem Schoß der Oma und weint, ihm läuft Speichel aus dem Mund. Der Opa hat eine kleine Dose auf dem Nachttisch in der Hand. Das Schlafzimmer riecht nach Hautcreme.',
    anamnese: [
      '„Ich habe nur kurz ins Bad geschaut, da hatte er etwas Kleines im Mund.“',
      'Ich habe es ihm herausholen wollen, er hat geschluckt und danach gewürgt.',
      'Es war die kleine Zelle vom Hörgerät meines Mannes; die Dose stand offen auf dem Nachttisch.',
    ],
    befund: ['Speichelfluss, würgt immer wieder', 'Keine Atemnot, kein Stridor, spricht und weint frei', 'Rachen gerötet, keine Schwellung'],
    vitals: { puls: 152, rr: [94, 56], spo2: 98, af: 30, temp: 36.8, bz: 100, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'spo2', 'af'],
    distractors: ['Vergiftung durch Reinigungsmittel', 'Magen-Darm-Infekt', 'Mundschleimhautentzündung'],
    explanation:
      'Zeugen sahen das Kind mit dem Gegenstand im Mund; danach Würgen und Speichelfluss. Kein Fieber, kein Durchfall, keine Reinigungsmittel in Reichweite. Die verschluckte Zelle muss rasch entfernt werden: nichts zu trinken geben, nicht zum Erbrechen bringen, sofort in die Klinik.',
  },
  {
    id: 'invagination-saeugling',
    bild: 'invagination',
    difficulty: 3,
    patient: { name: 'Ole Winter', age: 0, sex: 'm' },
    location: 'Würzburg, Wohnung nahe der Residenz',
    dispatch: 'Neun Monate altes Baby schreit anfallsartig, dazwischen ganz still.',
    scene:
      'Ole liegt blass und schlapp im Arm seiner Mutter. Als ich eintrete, krümmt er sich plötzlich, schreit gellend und zieht die Beine an. Nach etwa einer Minute wird er wieder still.',
    anamnese: [
      '„Er war heute Morgen noch fröhlich und hat gefrühstückt.“',
      'Seit etwa vier Stunden kommen die Schreianfälle in Abständen von ungefähr 15 Minuten, einmal hat er erbrochen.',
      'Vorhin war in der Windel ein dunkelroter, schleimiger Stuhl, „wie Himbeergelee“.',
    ],
    befund: ['Blass, zwischen den Anfällen apathisch', 'Beine werden bei Schmerzen an den Bauch gezogen', 'Leiste unauffällig, kein Fieber'],
    vitals: { puls: 164, rr: [84, 50], spo2: 97, af: 44, temp: 37.4, bz: 90, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'gcs'],
    distractors: ['Magen-Darm-Infekt', 'Blinddarmentzündung', 'Eingeklemmter Leistenbruch'],
    explanation:
      'Anfallsartiges Schreien mit angezogenen Beinen, zwischendurch apathisch, dazu Himbeergelee-Stuhl: Das ist eine Darmeinstülpung. Kein Fieber und unauffällige Leiste sprechen gegen Infekt und Leistenbruch. Nüchtern lassen, Notarzt nachfordern, Kinderchirurgie anfahren.',
  },
  {
    id: 'invagination-kleinkind',
    bild: 'invagination',
    difficulty: 3,
    patient: { name: 'Marie Zander', age: 2, sex: 'w' },
    location: 'Trier, Wohnung am Moselufer',
    dispatch: 'Zweijährige hat wiederkehrende Bauchschmerzen und erbricht, wirkt sehr blass.',
    scene:
      'Marie liegt zusammengerollt auf dem Sofa und ist auffällig blass. Während ich mich vorstelle, schreit sie auf und hält sich den Bauch, dann beruhigt sie sich wieder. Ein Eimer steht daneben.',
    anamnese: [
      '„Vor einer Woche hatte sie Magen-Darm, das war eigentlich schon vorbei.“',
      'Seit heute Mittag kommen immer wieder Schmerzattacken, dann liegt sie wie erschöpft da.',
      'Das Erbrochene war grünlich-gelb, gestern war der Stuhlgang noch normal.',
    ],
    befund: ['Blass, schlapp zwischen den Attacken', 'Walzenförmige Resistenz im rechten Oberbauch tastbar', 'Bauch weich, Urin heute Morgen klar'],
    vitals: { puls: 148, rr: [92, 54], spo2: 97, af: 34, temp: 37.2, bz: 88, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Blinddarmentzündung', 'Verstopfung', 'Harnwegsinfekt'],
    explanation:
      'Nach einem Darminfekt kann sich der Darm einstülpen. Der Schmerz kommt in Attacken mit freien Intervallen; die Resistenz im rechten Oberbauch und das gallige Erbrechen sind der Schlüssel. Beim Blinddarm bestehen Dauerschmerz und Abwehrspannung. Nüchtern lassen, Notarzt nachfordern, Kinderklinik.',
  },
  {
    id: 'kindvergiftung-tabletten',
    bild: 'kindvergiftung',
    difficulty: 2,
    patient: { name: 'Clara Walter', age: 3, sex: 'w' },
    location: 'Potsdam, Wohnung nahe dem Park Sanssouci',
    dispatch: 'Dreijährige ist schläfrig und müde, Mutter hat eine leere Packung gefunden.',
    scene:
      'Clara sitzt zusammengesunken im Kinderzimmer und gähnt immer wieder. Die Großmutter steht blass im Flur. Auf dem Tisch liegt eine zerrissene Blisterpackung.',
    anamnese: [
      '„Sie war vorhin noch ganz munter und hat im Zimmer meiner Mutter gespielt.“',
      'Kein Fieber, kein Durchfall; seit einer halben Stunde wird sie immer müder und klagt über Übelkeit.',
      'Die Packung gehört der Großmutter. Wie viele Tabletten fehlen, weiß keiner genau.',
    ],
    befund: ['Schläfrig, reagiert verzögert', 'Blasse Haut, keine Verletzungen am Kopf', 'Kein Ausschlag, Atmung ruhig'],
    vitals: { puls: 108, rr: [92, 56], spo2: 97, af: 24, temp: 36.8, bz: 94, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'puls'],
    distractors: ['Magen-Darm-Infekt', 'Unterzuckerung', 'Schädel-Hirn-Trauma'],
    explanation:
      'Leere Packung in Reichweite, plötzliche Schläfrigkeit ohne Infekt und kein Sturz: Das ist eine Vergiftung. Der Giftnotruf hilft bei Risikoeinschätzung. Verpackung mitnehmen, Zeit der Einnahme erfragen, Notarzt nachfordern und das Kind in Seitenlage überwachen.',
  },
  {
    id: 'kindvergiftung-reiniger',
    bild: 'kindvergiftung',
    difficulty: 2,
    patient: { name: 'Emre Yavuz', age: 2, sex: 'm' },
    location: 'Wuppertal, Küche in einer Wohnung in Elberfeld',
    dispatch: 'Zweijähriger hat etwas Falsches getrunken, hustet und würgt, Schaum vor dem Mund.',
    scene:
      'Emre sitzt auf dem Küchenboden, vor ihm eine umgekippte Flasche. Es riecht stechend nach Chemie. Sein Vater hält ihn im Arm und hat die Fenster aufgerissen.',
    anamnese: [
      '„Ich war nur kurz am Telefon, die Schranktür stand offen.“',
      'Er hat aus der Flasche mit dem WC-Reiniger getrunken, sofort gehustet und gewürgt.',
      'Erbrochen hat er nicht, der Vater hat ihm nichts zu trinken gegeben.',
    ],
    befund: ['Starker Speichelfluss, Schaum am Mund', 'Gereizter Husten, Mund und Lippen gerötet', 'Kein Pfeifen, kein bellender Husten'],
    vitals: { puls: 142, rr: [100, 62], spo2: 94, af: 42, temp: 36.9, bz: 104, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Allergische Reaktion (Anaphylaxie)', 'Pseudokrupp', 'Asthmaanfall'],
    explanation:
      'Reiniger neben dem Kind, stechender Geruch, Schaum und Husten: eine Vergiftung durch Reiniger. Nicht zum Erbrechen bringen, da die Säure oder Lauge die Speiseröhre ein zweites Mal verätzt. Giftnotruf anrufen, Flasche mitnehmen, Sauerstoff, Klinik.',
  },
];
