import { AktenBild, AktenFall } from './types';

export const BILDER_UMWELT: AktenBild[] = [
  {
    id: 'hitzeerschoepfung',
    diagnosis: 'Hitzeerschöpfung (Hitzekollaps)',
    kategorie: 'umwelt',
    leitsymptome: [
      'Starkes Schwitzen, Schwäche, Schwindel und Übelkeit bei Hitze',
      'Blasse, feuchte Haut, schneller Puls, eher niedriger Blutdruck, oft Wadenkrämpfe',
      'Wach und orientiert, Körpertemperatur meist unter 40 °C',
    ],
  },
  {
    id: 'tauchen',
    diagnosis: 'Tauchunfall (Dekompressionskrankheit)',
    kategorie: 'umwelt',
    leitsymptome: [
      'Gelenkschmerzen, Juckreiz oder marmorierte Haut nach dem Tauchen',
      'Taubheit, Kribbeln, Schwindel oder Lähmungen (Stunden nach dem Tauchgang)',
      'Zu schneller Aufstieg oder Höhe/Flug kurz nach dem Tauchen',
    ],
  },
];

export const AKTEN_UMWELT: AktenFall[] = [
  {
    id: 'hypothermie-demenz',
    bild: 'hypothermie',
    difficulty: 2,
    patient: { name: 'Paul Reinhardt', age: 82, sex: 'm' },
    location: 'Rothenburg ob der Tauber, Feldweg am Stadtrand',
    dispatch: 'Spaziergängerin findet älteren Mann im Garten einer Kleingartenanlage, er reagiert kaum.',
    scene:
      'Es ist früh am Morgen, die Wiese ist weiß vom Reif. Paul liegt im Pyjama und Bademantel zwischen Gartenhäuschen, die Kleidung ist feucht und steif.',
    anamnese: [
      'Spaziergängerin: „Ich habe ihn eben erst gesehen, er liegt wohl schon länger hier.“',
      'Die Tochter wurde gerufen: Er ist nachts aus dem Haus gegangen, er ist dement und läuft öfter weg.',
      'In der Nacht waren etwa −4 °C, er trägt weder Jacke noch Schuhe.',
    ],
    befund: ['Haut eiskalt, kein Kältezittern mehr', 'Schläfrig, antwortet kaum, lallende Sprache', 'Atmung flach, Puls langsam'],
    vitals: {
      puls: 48,
      rr: [104, 62],
      spo2: 92,
      af: 10,
      temp: 32.6,
      bz: 98,
      gcs: 11,
      ekg: 'Sinusbradykardie, J-Wellen (Osborn-Wellen)',
    },
    keyVitals: ['temp', 'puls', 'gcs'],
    distractors: ['Schlaganfall', 'Hypoglykämie', 'Herzinfarkt'],
    explanation:
      'Wer nach kalter Nacht kaum ansprechbar ist und nicht mehr zittert, ist schwer unterkühlt. Ältere Menschen kühlen besonders schnell aus. Nasse Kleidung vorsichtig entfernen, flach und schonend bewegen (Kammerflimmern!), Wärmeerhalt, Notarzt.',
  },
  {
    id: 'hypothermie-wanderin',
    bild: 'hypothermie',
    difficulty: 2,
    patient: { name: 'Larissa Quandt', age: 30, sex: 'w' },
    location: 'Schierke, Wanderweg am Brocken',
    dispatch: 'Wanderin auf dem Weg verwirrt und kaum noch gehfähig, ihr Begleiter bittet um Hilfe.',
    scene:
      'Es regnet seit Stunden, dazu bläst kalter Wind über den Kamm. Larissa steht zitternd am Wegrand, die dünne Regenjacke ist durchnässt.',
    anamnese: [
      'Begleiter: „Wir sind seit sechs Stunden unterwegs, es hat durchgehend geregnet.“',
      '„Meine Finger gehorchen mir nicht mehr, ich kann den Rucksack nicht aufmachen.“',
      'Sie hat seit dem Frühstück wenig gegessen und ist zunehmend durcheinander.',
    ],
    befund: [
      'Starkes Kältezittern am ganzen Körper',
      'Stolpert, ungeschickte Hände, antwortet verlangsamt',
      'Haut kalt und blass, Kleidung klatschnass',
    ],
    vitals: { puls: 108, rr: [136, 86], spo2: 97, af: 20, temp: 34.2, bz: 88, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'puls'],
    distractors: ['Hypoglykämie', 'Schlaganfall', 'Schädel-Hirn-Trauma'],
    explanation:
      'Kaltes, nasses, windiges Wetter reicht für eine Unterkühlung, auch bei Plusgraden. Zittern, Ungeschicklichkeit und Verwirrtheit sind frühe Zeichen. Sie braucht trockene Kleidung, Isolierung gegen Wind und Boden und Wärmeerhalt – ohne Hektik transportieren.',
  },
  {
    id: 'hitzschlag-dachwohnung',
    bild: 'hitzschlag',
    difficulty: 3,
    patient: { name: 'Heinz Pohl', age: 72, sex: 'm' },
    location: 'Nürnberg, Dachgeschosswohnung in der Südstadt',
    dispatch: 'Nachbar findet älteren Mann verwirrt im Sessel, er reagiert kaum auf Ansprache.',
    scene:
      'Unter dem Dach ist es stickig, die Fenster sind geschlossen und die Rollläden unten. Heinz sitzt im Unterhemd im Sessel, der Kopf hängt nach vorn.',
    anamnese: [
      'Nachbar: „Gestern hat er mir noch einen Gruß zugerufen, heute reagiert er nicht auf mein Klopfen.“',
      'Seit Tagen sind es tagsüber über 35 Grad, in der Wohnung hat es laut Thermometer 38.',
      'Er nimmt Wassertabletten und Blutdruckmittel und trinkt wenig.',
    ],
    befund: ['Haut heiß, rot und trocken', 'Verwirrt, murmelt unverständlich', 'Gesicht symmetrisch, beide Arme werden bewegt'],
    vitals: { puls: 124, rr: [100, 60], spo2: 94, af: 26, temp: 41.0, bz: 118, gcs: 10, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'puls'],
    distractors: ['Schlaganfall', 'Hypoglykämie', 'Sepsis'],
    explanation:
      'Trockene, heiße Haut, Temperatur über 40 °C und Verwirrtheit nach Tagen in der Hitze: Hitzschlag. Ältere Menschen mit Entwässerungsmitteln sind besonders gefährdet. Sofort raus aus der Hitze, aktiv kühlen, Notarzt nachfordern, Blutzucker messen.',
  },
  {
    id: 'hitzschlag-halbmarathon',
    bild: 'hitzschlag',
    difficulty: 2,
    patient: { name: 'Sabine Quiring', age: 34, sex: 'w' },
    location: 'Potsdam, Zielbereich des Halbmarathons am Neuen Palais',
    dispatch: 'Läuferin kurz vor dem Ziel zusammengebrochen, reagiert verlangsamt.',
    scene:
      'Es sind 31 Grad und praller Sonnenschein. Sabine sitzt im Startnummern-Shirt am Streckenrand, Helfer fächern ihr Luft zu. Sie wirkt abwesend.',
    anamnese: [
      'Streckenposten: „Sie ist die letzten 300 Meter gewankt und dann einfach in die Knie gegangen.“',
      'Sie ist heute das erste Mal Halbmarathon gelaufen und hat an den Getränkestationen ausgelassen.',
      'Auf Fragen antwortet sie falsch: „Wo ist mein Auto?“ – und sie klagt über Krämpfe in den Waden.',
    ],
    befund: ['Haut gerötet und noch feucht', 'Verwirrt, desorientiert', 'Wadenkrämpfe beidseits'],
    vitals: { puls: 150, rr: [108, 64], spo2: 96, af: 28, temp: 40.6, bz: 104, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'puls'],
    distractors: ['Hypoglykämie', 'Herzinfarkt', 'Schlaganfall'],
    explanation:
      'Beim Belastungshitzschlag kann die Haut noch schwitzen – ein feuchtes Hemd schließt ihn nicht aus. Entscheidend sind Temperatur über 40 °C und Verwirrtheit. Schnell aktiv kühlen (nasse Tücher, Luftzug, Kühlpacks), Notarzt, nicht erst im Auto abwarten.',
  },
  {
    id: 'hitzeerschoepfung-baustelle',
    bild: 'hitzeerschoepfung',
    difficulty: 1,
    patient: { name: 'Marek Pawlak', age: 35, sex: 'm' },
    location: 'Chemnitz, Rohbaustelle am Brühl',
    dispatch: 'Bauarbeiter fühlt sich schlecht, ist beinahe umgekippt.',
    scene:
      'Die Sonne brennt auf die Betondecke, 34 Grad im Schatten. Marek sitzt im Schatten eines Gerüsts, das Hemd ist durchgeschwitzt, ein Kollege hält ihm eine Flasche Wasser hin.',
    anamnese: [
      'Kollege: „Er arbeitet seit sechs Uhr, jetzt ist es kurz nach zwei.“',
      '„Mir ist schwindelig und übel, mein Kopf dröhnt.“',
      'Zuletzt hat er viel geschwitzt, aber kaum getrunken. Vorerkrankungen: keine.',
    ],
    befund: ['Sehr verschwitzt, Haut feucht und blass', 'Wach, orientiert, antwortet klar', 'Wadenkrämpfe, kein Brustschmerz'],
    vitals: { puls: 112, rr: [118, 72], spo2: 98, af: 20, temp: 38.2, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'temp', 'rr'],
    distractors: ['Hypoglykämie', 'Herzinfarkt', 'Grippaler Infekt'],
    explanation:
      'Starkes Schwitzen, Schwäche, Wadenkrämpfe und klarer Kopf bei Hitze sprechen für eine Hitzeerschöpfung. Anders als beim Hitzschlag ist der Patient orientiert und die Temperatur liegt unter 40 °C. Schatten, Ruhe, Kühlung und Trinken (Elektrolyte), Verlauf beobachten.',
  },
  {
    id: 'hitzeerschoepfung-festival',
    bild: 'hitzeerschoepfung',
    difficulty: 2,
    patient: { name: 'Rieke Petersen', age: 20, sex: 'w' },
    location: 'Rudolstadt, Zeltplatz am Festivalgelände',
    dispatch: 'Junge Frau auf dem Zeltplatz sitzt am Boden, ihr ist schlecht und schwindelig.',
    scene:
      'Mittagshitze auf dem Zeltplatz, kaum Schatten. Rieke lehnt an einem Zelt, ihre Freundinnen haben ihr ein Handtuch über den Kopf gelegt. Sie ist ganz blass.',
    anamnese: [
      'Freundin: „Wir haben gestern Nacht bis sechs getanzt und heute schon wieder in der Sonne gestanden.“',
      '„Mir wird immer schwarz vor Augen, wenn ich aufstehe.“',
      'Sie hat zwei Bier getrunken, aber kaum etwas gegessen und nur wenig Wasser.',
    ],
    befund: ['Blasse, kaltschweißige Haut', 'Wach, orientiert, spricht klar', 'Zittrig, Übelkeit, einmal gewürgt'],
    vitals: { puls: 118, rr: [100, 60], spo2: 98, af: 20, temp: 38.0, bz: 84, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Panikattacke', 'Hypoglykämie', 'Herzrhythmusstörung'],
    explanation:
      'Sonne, Schlafmangel und Flüssigkeitsverlust führen zu Hitzeerschöpfung: schneller Puls, niedriger Blutdruck, kaltschweißige Haut bei klarem Bewusstsein. Hinlegen mit erhöhten Beinen, in den Schatten, kühlen, trinken lassen. Bei Verwirrtheit wäre es ein Hitzschlag.',
  },
  {
    id: 'co-laube',
    bild: 'co',
    difficulty: 2,
    patient: { name: 'Pascal Reuter', age: 33, sex: 'm' },
    location: 'Cottbus, Kleingartenanlage, Gartenlaube',
    dispatch: 'Mehrere junge Leute in einer Gartenlaube, einer lässt sich nicht wecken, andere klagen über Kopfschmerzen.',
    scene:
      'Tür und Fenster der Laube sind zu, drinnen ist es warm und stickig. Pascal liegt auf der Pritsche und reagiert kaum. Zwei Freunde sitzen blass daneben und halten sich den Kopf.',
    anamnese: [
      'Freund: „Wir haben hier gestern Abend gefeiert und dann in der Laube geschlafen.“',
      '„Mir ist übel und mein Kopf platzt“, sagt eine Freundin. Draußen ging es ihr besser.',
      'Weil es nachts kalt wurde, haben sie den glimmenden Holzkohlegrill mit hineingenommen.',
    ],
    befund: [
      'Kaum erweckbar, stöhnt auf Schmerzreiz',
      'Mehrere Personen mit denselben Beschwerden',
      'Haut rosig, kaum Alkoholgeruch',
    ],
    vitals: { puls: 112, rr: [136, 80], spo2: 99, af: 22, temp: 36.6, bz: 101, gcs: 10, ekg: 'Sinustachykardie' },
    keyVitals: ['gcs', 'puls', 'spo2'],
    distractors: ['Alkoholvergiftung', 'Lebensmittelvergiftung', 'Hypoglykämie'],
    explanation:
      'Kopfschmerz und Übelkeit bei mehreren Personen im geschlossenen Raum: an Kohlenmonoxid denken. Das Pulsoximeter zeigt trotz Vergiftung falsch normale Werte (SpO₂ 99). Eigenschutz, alle ins Freie, hochdosiert Sauerstoff, Notarzt und Feuerwehr nachfordern.',
  },
  {
    id: 'co-bad',
    bild: 'co',
    difficulty: 3,
    patient: { name: 'Annika Quirin', age: 38, sex: 'w' },
    location: 'Passau, Mehrfamilienhaus, Badezimmer',
    dispatch: 'Frau beim Duschen schwindelig geworden und fast zusammengebrochen.',
    scene:
      'Kleines Bad ohne Fenster, an der Wand ein Gas-Durchlauferhitzer mit gelblicher Flamme. Annika sitzt in ein Handtuch gehüllt auf dem Wannenrand. Der Ehemann steht besorgt daneben.',
    anamnese: [
      '„Beim Duschen wurde mir plötzlich schwindelig, ich dachte, ich falle um.“',
      'Seit dem Morgen hat sie Kopfschmerzen und ist übel, Fieber hat sie nicht.',
      'Ihr Mann hat seit Tagen Kopfschmerzen („Grippe“), nach dem Urlaub waren sie wie weggeblasen.',
    ],
    befund: ['Blass, benommen, verlangsamt', 'Keine Halbseitenzeichen, Sprache klar', 'Kein Husten, Hals unauffällig'],
    vitals: { puls: 108, rr: [126, 80], spo2: 99, af: 22, temp: 36.8, bz: 98, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'gcs', 'spo2'],
    distractors: ['Migräne', 'Grippaler Infekt', 'Schlaganfall'],
    explanation:
      'Beschwerden, die sich bei Abwesenheit bessern, und gleichzeitig der Partner mit Kopfschmerz: CO-Vergiftung durch den Gas-Durchlauferhitzer. Trotz SpO₂ 99 % ist Sauerstoff nötig, das Pulsoximeter erkennt CO nicht. Eigenschutz, lüften, Feuerwehr, alle Bewohner untersuchen.',
  },
  {
    id: 'alkohol-senior',
    bild: 'alkohol',
    difficulty: 2,
    patient: { name: 'Gisela Probst', age: 74, sex: 'w' },
    location: 'Erfurt, Plattenbauwohnung im 4. Stock',
    dispatch: 'Nachbarin meldet ältere Frau, die lallt und unsicher steht, vermutlich gestürzt.',
    scene:
      'Gisela sitzt auf dem Flurboden ihrer Wohnung, an die Wand gelehnt. In der Küche steht eine leere Flasche Likör, die Wohnung ist kühl. Sie nuschelt.',
    anamnese: [
      'Nachbarin: „Sie lebt allein, normalerweise ist sie früh am Morgen schon unterwegs.“',
      '„Ich bin auf dem Weg zum Bad weggeknickt.“ Das Sprechen fällt ihr schwer.',
      'Die Nachbarin berichtet, dass sie seit dem Tod ihres Mannes abends öfter trinkt. Zucker hat sie nicht.',
    ],
    befund: [
      'Alkoholgeruch, lallende Sprache',
      'Gesicht symmetrisch, Arme und Beine gleich kräftig',
      'Keine Kopfplatzwunde, Pupillen gleich',
    ],
    vitals: { puls: 84, rr: [138, 80], spo2: 95, af: 14, temp: 35.4, bz: 76, gcs: 12, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'temp', 'bz'],
    distractors: ['Schlaganfall', 'Hypoglykämie', 'Schädel-Hirn-Trauma'],
    explanation:
      'Lallen und Unsicherheit bei Älteren sind nicht automatisch Alkohol – aber hier sprechen leere Flasche, symmetrisches Gesicht, normale Pupillen und ein normaler Zucker dafür. Trotzdem Sturzfolgen suchen, Auskühlung verhindern und Wärme erhalten.',
  },
  {
    id: 'alkohol-winter',
    bild: 'alkohol',
    difficulty: 2,
    patient: { name: 'Dirk Pawlowski', age: 44, sex: 'm' },
    location: 'Saarbrücken, Bahnhofsvorplatz',
    dispatch: 'Mann liegt seit Stunden auf dem Bahnhofsvorplatz, reagiert kaum.',
    scene:
      'Es ist Januar, −3 °C. Dirk liegt in dicker Jacke neben einer Bank, Passanten gehen vorbei. Neben ihm steht eine halb leere Flasche, es riecht nach Alkohol.',
    anamnese: [
      'Passant: „Ich habe gedacht, der schläft nur seinen Rausch aus, aber er liegt schon lange da.“',
      'Der Sicherheitsdienst kennt ihn: kein Drogenkonsum, keine Auffälligkeiten sonst.',
      'Vor einer Stunde hat er laut Zeugen noch geschimpft, dann wurde er stumm.',
    ],
    befund: [
      'Starker Alkoholgeruch, hat erbrochen',
      'Reagiert nur auf Schmerzreiz',
      'Pupillen mittelweit, gleich, keine Einstiche',
    ],
    vitals: { puls: 64, rr: [112, 70], spo2: 94, af: 10, temp: 35.2, bz: 88, gcs: 10, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'temp', 'af'],
    distractors: ['Hypoglykämie', 'Schädel-Hirn-Trauma', 'Opioid-Überdosis'],
    explanation:
      'Alkoholgeruch ist keine Diagnose, aber hier passen Erbrochenes, normaler Zucker und mittelweite Pupillen zur Alkoholvergiftung. Gefahren sind Aspiration und Auskühlung: stabile Seitenlage, warmes Fahrzeug, Wärmeerhalt, Klinik. Nie „ausschlafen“ lassen.',
  },
  {
    id: 'opioid-pflaster',
    bild: 'opioid',
    difficulty: 2,
    patient: { name: 'Roswitha Pfister', age: 62, sex: 'w' },
    location: 'Trier, Wohnung am Moselufer',
    dispatch: 'Ehemann meldet Frau, die sehr schläfrig ist und kaum noch richtig atmet.',
    scene:
      'Roswitha liegt im Schlafzimmer auf dem Bett, die Augen halb offen. Auf dem Nachttisch liegen Tablettendosen und ein Schmerztagebuch. Ihr Ehemann steht ratlos daneben.',
    anamnese: [
      'Ehemann: „Sie hat seit Jahren Rückenschmerzen und war heute früh noch ganz normal.“',
      '„Seit dem Mittag wird sie immer müder, und ich kriege sie kaum noch wach.“',
      'Erst auf Nachfrage: „Gestern hat sie gesagt, die Schmerzen werden schlimmer – da hat sie sich ein zweites Pflaster aufgeklebt.“',
    ],
    befund: [
      'Schläfrig, reagiert nur auf lautes Ansprechen',
      'Pupillen stecknadelkopfgroß',
      'Zwei Schmerzpflaster auf Schulter und Rücken',
    ],
    vitals: { puls: 58, rr: [104, 64], spo2: 86, af: 7, temp: 36.1, bz: 108, gcs: 9, ekg: 'Sinusbradykardie' },
    keyVitals: ['af', 'spo2', 'gcs'],
    distractors: ['Schlaganfall', 'Hypoglykämie', 'Epileptischer Anfall (Nachschlafphase)'],
    explanation:
      'Opioid-Überdosis gibt es auch zu Hause durch Schmerzmittelpflaster: langsame Atmung, enge Pupillen, Schläfrigkeit. Pflaster sofort entfernen, aber Wirkung hält an. Atmung unterstützen, Sauerstoff, Notarzt – das Antidot wirkt kürzer als das Pflaster.',
  },
  {
    id: 'opioid-toilette',
    bild: 'opioid',
    difficulty: 1,
    patient: { name: 'Ralf Petrović', age: 38, sex: 'm' },
    location: 'Würzburg, Tankstellentoilette an der Autobahnzufahrt',
    dispatch: 'Kunde in der Toilette einer Tankstelle nicht ansprechbar, Tür von innen verschlossen.',
    scene:
      'Mitarbeiter haben die Tür geöffnet. Ralf sitzt zusammengesackt an der Wand, die Lippen sind bläulich. Auf dem Boden liegt Spritzbesteck. Ich ziehe Handschuhe an.',
    anamnese: [
      'Tankstellenmitarbeiter: „Er ist vor etwa 15 Minuten reingegangen und nicht mehr rausgekommen.“',
      'Ein Zeuge hat gesehen, dass er in der Toilette etwas gespritzt hat.',
      'Laut Zeuge kam er zu Fuß, hatte keine Tasche dabei und niemand kennt ihn.',
    ],
    befund: [
      'Bläuliche Lippen, flache, sehr langsame Atmung',
      'Pupillen eng, kaum Lichtreaktion',
      'Reagiert nicht auf Ansprache',
    ],
    vitals: { puls: 52, rr: [100, 60], spo2: 78, af: 4, temp: 36.0, bz: 102, gcs: 6, ekg: 'Sinusbradykardie' },
    keyVitals: ['af', 'spo2', 'gcs'],
    distractors: ['Alkoholvergiftung', 'Hypoglykämie', 'Schlaganfall'],
    explanation:
      'Enge Pupillen, kaum Atmung und Bewusstlosigkeit: klassische Opioid-Trias. Zuerst Eigenschutz (Spritzbesteck), dann Atemweg und Beatmung, Sauerstoff, Notarzt nachfordern. Blutzucker messen. Das Spritzbesteck könnte auch Insulin sein, hier aber Zucker normal.',
  },
  {
    id: 'tauchen-ostsee',
    bild: 'tauchen',
    difficulty: 3,
    patient: { name: 'Patrick Rohde', age: 38, sex: 'm' },
    location: 'Eckernförde, Tauchplatz am Hafen',
    dispatch: 'Taucher nach Tauchgang mit Gelenkschmerzen und Taubheitsgefühl, geht es zunehmend schlechter.',
    scene:
      'Patrick sitzt in der Trockentauchanzug-Unterkleidung auf einer Bank am Steg, die Ausrüstung liegt daneben. Er reibt sich Schultern und Knie und wirkt erschöpft.',
    anamnese: [
      'Tauchpartner: „Wir waren 40 Minuten unten, bei 25 Metern wurde seine Luft knapp.“',
      '„Ich musste hoch, das ging ziemlich schnell. Jetzt tun mir Schultern und Knie weh.“',
      'Seit einer halben Stunde juckt die Haut, die Beine fühlen sich taub an.',
    ],
    befund: [
      'Marmorierte, juckende Haut an Rumpf und Oberarmen',
      'Taubheit in beiden Beinen, Gang etwas unsicher',
      'Wach, orientiert, Sprache klar',
    ],
    vitals: { puls: 108, rr: [126, 78], spo2: 96, af: 18, temp: 36.7, bz: 104, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'spo2', 'gcs'],
    distractors: ['Muskelkater', 'Schlaganfall', 'Bandscheibenvorfall'],
    explanation:
      'Gelenkschmerzen, marmorierte Haut und Taubheit nach zu schnellem Aufstieg: Dekompressionskrankheit. Sofort 100 % Sauerstoff, flach lagern, Notarzt, Tauchdaten notieren und in eine Klinik mit Druckkammer. Auch bei Besserung nicht abwarten.',
  },
  {
    id: 'tauchen-pass',
    bild: 'tauchen',
    difficulty: 3,
    patient: { name: 'Pia Reimann', age: 29, sex: 'w' },
    location: 'Oberjoch (Allgäu), Parkplatz an der Passhöhe',
    dispatch: 'Frau auf dem Parkplatz einer Passstraße mit Schwindel und Atemnot, hat einen Ausschlag.',
    scene:
      'Auf dem Parkplatz an der Passhöhe ist es kühl und windig. Pia sitzt im Auto auf dem Beifahrersitz, die Tür offen. Ihr Freund ist nervös und hält ihre Jacke.',
    anamnese: [
      'Freund: „Wir sind heute früh vom Bodensee losgefahren und wollten die Aussicht genießen.“',
      '„Mir ist schwindelig, meine Hände kribbeln und ich bekomme schlechter Luft.“',
      'Gestern hatte sie zwei Tauchgänge im See, einen davon mit etwas schnellem Aufstieg.',
    ],
    befund: [
      'Marmorierter, juckender Ausschlag an Armen und Bauch',
      'Kribbeln in Händen und Füßen',
      'Keine Lippen- oder Zungenschwellung, kein Giemen',
    ],
    vitals: { puls: 112, rr: [124, 76], spo2: 92, af: 24, temp: 36.6, bz: 96, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'puls', 'af'],
    distractors: ['Höhenkrankheit', 'Panikattacke', 'Allergische Reaktion'],
    explanation:
      'Nach dem Tauchen senkt die Höhe den Umgebungsdruck weiter und kann eine Dekompressionskrankheit auslösen. Hinweise: Tauchgänge am Vortag, marmorierte Haut, Kribbeln. Sauerstoff geben, Notarzt, Transport möglichst ohne weiteren Höhengewinn (Druckkammer).',
  },
];
