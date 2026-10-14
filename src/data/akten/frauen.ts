import { AktenBild, AktenFall } from './types';

export const BILDER_FRAUEN: AktenBild[] = [
  {
    id: 'geburt',
    diagnosis: 'Einsetzende Geburt (Presswehen)',
    kategorie: 'frauen',
    leitsymptome: [
      'Wehen in kurzen Abständen mit starkem Pressdrang',
      'Fruchtblase geplatzt, Köpfchen im Scheideneingang sichtbar',
      'Besonders schnell bei Zweitgebärenden – keine Zeit für den Transport',
    ],
  },
  {
    id: 'eklampsie',
    diagnosis: 'Präeklampsie / Eklampsie',
    kategorie: 'frauen',
    leitsymptome: [
      'Bluthochdruck und Wassereinlagerungen in der späten Schwangerschaft',
      'Starke Kopfschmerzen, Flimmern vor den Augen, Schmerz im rechten Oberbauch',
      'Krampfanfall als Vollbild (Eklampsie)',
    ],
  },
  {
    id: 'eug',
    diagnosis: 'Eileiterschwangerschaft (Extrauteringravidität)',
    kategorie: 'frauen',
    leitsymptome: [
      'Plötzlicher, meist einseitiger Unterbauchschmerz bei einer Frau im gebärfähigen Alter',
      'Ausbleibende Periode, Schmierblutung',
      'Bei Riss: Schock und Schmerzen bis in die Schulter',
    ],
  },
];

export const AKTEN_FRAUEN: AktenFall[] = [
  {
    id: 'geburt-wohnung',
    bild: 'geburt',
    difficulty: 2,
    patient: { name: 'Katharina Weigel', age: 31, sex: 'w' },
    location: 'Halle (Saale), Wohnung in Giebichenstein',
    dispatch: 'Frau mit sehr starken Bauchschmerzen, Ehemann ruft an.',
    scene:
      'In der Wohnung hängt Wäsche am Ständer, im Flur steht eine gepackte Tasche. Katharina kniet im Wohnzimmer auf einer Decke und stützt sich auf die Sofakante. Auf dem Boden ist eine Fruchtwasserlache.',
    anamnese: [
      '„Die Schmerzen kommen alle zwei Minuten und werden immer stärker.“',
      'Ich muss ganz stark nach unten pressen, ich kann nicht anders. Mein zweites Kind kommt, die Hebamme ist unterwegs.',
      'Vor einer halben Stunde ist die Fruchtblase geplatzt, die erste Geburt ging schon sehr schnell.',
    ],
    befund: ['Starke Wehen im Minutenabstand', 'Köpfchen im Scheideneingang sichtbar', 'Kein Fieber, Urin nicht auffällig'],
    vitals: { puls: 104, rr: [132, 82], spo2: 98, af: 24, temp: 36.9, bz: 92, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af'],
    distractors: ['Blasenentzündung', 'Nierenkolik', 'Gallenkolik'],
    explanation:
      'Die Leitstelle meldete nur Bauchschmerzen. Wehen alle zwei Minuten, Pressdrang und sichtbares Köpfchen zeigen, dass die Geburt nicht mehr aufzuhalten ist. Bei Zweitgebärenden geht es oft schnell: kein Transport, Ruhe, Wärme, Geburtshilfe vorbereiten, Hebamme und Notarzt nachfordern.',
  },
  {
    id: 'geburt-auto',
    bild: 'geburt',
    difficulty: 3,
    patient: { name: 'Svenja Ziegler', age: 28, sex: 'w' },
    location: 'Gera, Autobahnparkplatz an der A9',
    dispatch: 'Mann ruft schreiend an, Frau im Auto hat starke Schmerzen, nicht auflegen.',
    scene:
      'Auf dem Parkplatz steht ein Kombi mit offener Heckklappe, die Warnblinkanlage blinkt. Svenja liegt halb im Laderaum, ihr Mann läuft aufgeregt hin und her. Es nieselt und ist kühl.',
    anamnese: [
      '„Wir waren auf dem Weg in die Klinik, plötzlich ging es nicht mehr weiter.“',
      'Erstes Kind, errechneter Termin war vorgestern. Seit zwei Stunden Wehen, vor 20 Minuten platzte die Fruchtblase.',
      'Ich kann nicht anders, ich muss pressen. Den Kopf habe ich schon gespürt.',
    ],
    befund: ['Kopf des Kindes bereits geboren', 'Wehe mit starkem Pressdrang', 'Frau ansprechbar, schwitzt, zittert vor Kälte'],
    vitals: { puls: 112, rr: [128, 78], spo2: 98, af: 26, temp: 36.9, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af'],
    distractors: ['Nierenkolik', 'Panikattacke', 'Magen-Darm-Infekt'],
    explanation:
      'Der Kopf ist schon geboren, der Körper folgt mit der nächsten Wehe. Jetzt zählen Ruhe und Schutz: nicht ziehen, das Kind abstützen, Wärmeerhalt für Mutter und Neugeborenes, den Ehemann einbinden. Notarzt und Kinderarzt nachfordern, danach Abnabelung und Plazenta der Klinik überlassen.',
  },
  {
    id: 'eklampsie-krampf',
    bild: 'eklampsie',
    difficulty: 3,
    patient: { name: 'Jana Zorn', age: 28, sex: 'w' },
    location: 'Regensburg, Wohnung nahe der Donau',
    dispatch: 'Schwangere hatte einen Krampfanfall, jetzt kaum ansprechbar.',
    scene:
      'Jana liegt auf dem Sofa, ihr Mann hat sie in Seitenlage gebracht. Gesicht und Hände wirken aufgedunsen. Auf dem Couchtisch liegt der Mutterpass.',
    anamnese: [
      '„Es war 37. Schwangerschaftswoche, sie hat seit heute Morgen über Kopfschmerzen geklagt.“',
      'Vor dem Anfall hat sie über Flimmern vor den Augen geklagt, die Hände sind in den letzten Tagen dick geworden.',
      'Der Krampf dauerte etwa eine Minute, ist vor drei Minuten gewesen. Epilepsie hatte sie nie.',
    ],
    befund: ['Schläfrig, reagiert verzögert', 'Geschwollene Hände und Gesicht', 'Kein Zungenbiss, Pupillen seitengleich, Mundwinkel symmetrisch'],
    vitals: { puls: 102, rr: [190, 118], spo2: 96, af: 20, temp: 36.9, bz: 94, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'gcs', 'bz'],
    distractors: ['Epileptischer Krampfanfall', 'Unterzuckerung', 'Schlaganfall'],
    explanation:
      'Kopfschmerz, Flimmern, Ödeme und ein sehr hoher Blutdruck in der späten Schwangerschaft, dann ein Krampf: das ist die Eklampsie. Normaler Blutzucker und fehlende Halbseitenzeichen schließen Unterzuckerung und Schlaganfall aus. Ruhe, Seitenlage, Notarzt nachfordern, Zielklinik mit Geburtshilfe.',
  },
  {
    id: 'eklampsie-kopfschmerz',
    bild: 'eklampsie',
    difficulty: 2,
    patient: { name: 'Sandra Voß', age: 33, sex: 'w' },
    location: 'Düsseldorf, Büro im Medienhafen',
    dispatch: 'Schwangere Kollegin hat starke Kopfschmerzen und ihr ist schlecht.',
    scene:
      'Sandra sitzt am Schreibtisch, die Jalousien sind heruntergezogen. Sie hält sich die Stirn, die Ringe an ihren Fingern sitzen zu eng. Die Kollegen haben ihr ein Glas Wasser gebracht.',
    anamnese: [
      '„Seit dem Mittag habe ich Kopfschmerzen, so schlimm hatte ich das noch nie.“',
      'Vor den Augen flimmert es, rechts oben im Bauch tut es weh, das Gesicht ist angeschwollen.',
      'Ich bin in der 34. Schwangerschaftswoche, vorher war alles unauffällig.',
    ],
    befund: ['Geschwollene Hände und Knöchel', 'Lichtempfindlich, übel', 'Kein Fieber, Nacken frei beweglich'],
    vitals: { puls: 92, rr: [172, 110], spo2: 98, af: 18, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Migräne', 'Magen-Darm-Infekt', 'Gallenkolik'],
    explanation:
      'Kopfschmerz, Sehstörung, Schmerz im rechten Oberbauch und Ödeme bei hohem Blutdruck in der Schwangerschaft sind Warnzeichen einer Präeklampsie. Jetzt kann es jederzeit zum Krampf kommen. Reize abschirmen, Blutdruck kontrollieren, mit Notarzt in die Klinik mit Geburtshilfe.',
  },
  {
    id: 'eug-schule',
    bild: 'eug',
    difficulty: 2,
    patient: { name: 'Mirja Urban', age: 26, sex: 'w' },
    location: 'Lüneburg, Lehrerzimmer einer Grundschule',
    dispatch: 'Lehrerin mit starken Unterbauchschmerzen, ihr wird schwindelig.',
    scene:
      'Mirja sitzt zusammengekrümmt am Tisch im Lehrerzimmer, vor ihr liegen Hefte. Eine Kollegin hält ihr einen Becher hin. Sie ist blass und stützt sich schwer auf.',
    anamnese: [
      '„Es hat in der Pause plötzlich in der Seite gezogen, jetzt wird mir schwarz vor Augen.“',
      'Die Schmerzen sitzen unten rechts und strahlen in die Schulter aus.',
      'Ihre Periode ist seit zwei Wochen überfällig, vorhin kam etwas Blut „wie eine Schmierblutung“.',
    ],
    befund: ['Blasses Gesicht, kalter Schweiß', 'Bauch weich, Druckschmerz im rechten Unterbauch', 'Kein Fieber, kein Durchfall'],
    vitals: { puls: 118, rr: [96, 60], spo2: 98, af: 22, temp: 36.9, bz: 90, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Blinddarmentzündung', 'Nierenkolik', 'Magen-Darm-Infekt'],
    explanation:
      'Bei jeder Frau im gebärfähigen Alter mit Unterbauchschmerz und Schwindel gilt: an eine Eileiterschwangerschaft denken. Überfällige Periode, Schmierblutung, Schulterschmerz und ein schneller Puls bei niedrigem Blutdruck sind die Schlüssel. Schocklage, Notarzt nachfordern, Zielklinik mit Gynäkologie.',
  },
  {
    id: 'eug-urlaub',
    bild: 'eug',
    difficulty: 3,
    patient: { name: 'Petra Zahn', age: 33, sex: 'w' },
    location: 'Cuxhaven, Hotelzimmer an der Strandpromenade',
    dispatch: 'Frau im Hotel plötzlich zusammengebrochen, starke Schmerzen im Bauch.',
    scene:
      'Petra liegt auf dem Teppich neben dem Bett, ihr Mann kniet bei ihr. Auf dem Nachttisch steht ein Wasserglas. Sie ist grau-blass, schweißnass und sieht mich kaum an.',
    anamnese: [
      '„Ich wollte mich nur hinlegen, dann kam dieser Schmerz und alles wurde schwarz.“',
      'Der Schmerz sitzt tief im Unterbauch, einseitig, und kam schlagartig.',
      'Sie hat eine Spirale. Eine Schwangerschaft kennt sie nicht, die Periode war unregelmäßig.',
    ],
    befund: ['Grau-blasse, kaltschweißige Haut', 'Bauch gespannt, stark druckschmerzhaft im Unterbauch', 'Kein Fieber, keine Verletzung'],
    vitals: { puls: 132, rr: [80, 46], spo2: 96, af: 26, temp: 36.4, bz: 98, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'puls', 'gcs'],
    distractors: ['Nierenkolik', 'Blinddarmdurchbruch', 'Kreislaufkollaps (Synkope)'],
    explanation:
      'Auch mit Spirale und ohne bekannte Schwangerschaft kann eine Eileiterschwangerschaft rupturieren. Der innere Blutverlust führt zum Schock, der Bauch ist gespannt. Schocklage, Wärmeerhalt, Notarzt nachfordern und zügig in eine Klinik mit Gynäkologie und OP-Bereitschaft.',
  },
];
