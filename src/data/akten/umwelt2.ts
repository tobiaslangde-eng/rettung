import { AktenBild, AktenFall } from './types';

export const BILDER_UMWELT2: AktenBild[] = [
  {
    id: 'angio',
    diagnosis: 'Angioödem (Schwellung von Zunge und Rachen)',
    kategorie: 'umwelt',
    leitsymptome: [
      'Schwellung von Lippen, Zunge oder Rachen ohne Juckreiz und ohne Nesselsucht',
      'Kloßige Sprache, Schluckbeschwerden, drohende Atemwegsverlegung',
      'Auslöser: Medikament (z. B. Blutdrucksenker) oder erbliche Neigung',
    ],
  },
  {
    id: 'tabletten',
    diagnosis: 'Medikamenten-Überdosierung (Verwechslung)',
    kategorie: 'umwelt',
    leitsymptome: [
      'Versehentlich zu viel oder doppelt eingenommenes Medikament',
      'Symptome passen zur Wirkung des Medikaments (z. B. langsamer Puls, niedriger Blutdruck)',
      'Medikamentenliste, Dosett und Packungen geben den Hinweis',
    ],
  },
  {
    id: 'pilz',
    diagnosis: 'Pilzvergiftung',
    kategorie: 'umwelt',
    leitsymptome: [
      'Brechdurchfall und Bauchkrämpfe nach einer Pilzmahlzeit',
      'Mehrere Personen von derselben Mahlzeit betroffen, Pilzreste vorhanden',
      'Beginn nach mehr als 6 Stunden oder Besserung vor Leberschaden: Warnzeichen',
    ],
  },
  {
    id: 'drogen',
    diagnosis: 'Amphetamin-/Ecstasy-Intoxikation',
    kategorie: 'umwelt',
    leitsymptome: [
      'Weite Pupillen, schneller Puls, Bluthochdruck, erhöhte Temperatur',
      'Unruhe, Kiefermahlen, Schlafentzug, Angst oder Halluzinationen',
      'Hinweis von Freunden auf eingenommene Substanzen',
    ],
  },
];

export const AKTEN_UMWELT2: AktenFall[] = [
  {
    id: 'anaphylaxie-erdnuss',
    bild: 'anaphylaxie',
    difficulty: 1,
    patient: { name: 'Sophie Thiele', age: 12, sex: 'w' },
    location: 'Wuppertal, Schulmensa der Gesamtschule',
    dispatch: 'Schülerin in der Mensa hustet, bekommt kaum Luft, Lippen sind dick.',
    scene:
      'Sophie sitzt blass am Tisch und ringt um Luft. Eine Lehrerin hält sie im Arm, die Mitschüler stehen im Kreis, ein halb gegessenes Gebäck liegt auf dem Teller.',
    anamnese: [
      'Lehrerin: „Sie hat gerade ein Gebäck vom Büfett gegessen und fing sofort an zu husten.“',
      '„Mein Mund kribbelt und alles juckt, ich kriege keine Luft!“',
      'Erdnussallergie ist bekannt, das Notfallset steckt im Ranzen im Klassenraum – die Lehrerin ist unsicher, was sie tun soll.',
    ],
    befund: ['Lippen und Augenlider geschwollen', 'Nesselsucht an Hals und Armen', 'Pfeifende Atmung, trockener Husten'],
    vitals: { puls: 138, rr: [85, 50], spo2: 90, af: 32, temp: 36.8, bz: 98, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'rr', 'puls', 'af'],
    distractors: ['Asthmaanfall', 'Fremdkörper in den Atemwegen', 'Hyperventilation durch Aufregung'],
    explanation:
      'Bekannte Allergie, Gebäck, Nesselsucht, geschwollene Lippen und Atemnot: Haut, Atmung und Kreislauf sind beteiligt. Kinder haben andere Normwerte – Puls 138 und Blutdruck 85/50 sind hier schon Schockzeichen. Notarzt nachfordern, Notfallset der Schülerin holen lassen.',
  },
  {
    id: 'anaphylaxie-antibiotikum',
    bild: 'anaphylaxie',
    difficulty: 2,
    patient: { name: 'Sabine Teichmann', age: 47, sex: 'w' },
    location: 'Trier, Hausarztpraxis am Hauptmarkt',
    dispatch: 'Patientin in der Hausarztpraxis nach einer Spritze plötzlich schwach und schwindelig.',
    scene:
      'Sabine liegt auf der Untersuchungsliege, die Ärztin hat ihr die Beine hochgelagert. Hals und Brust sind fleckig rot, die Haut glänzt feucht.',
    anamnese: [
      'Ärztin: „Sie bekam vor zehn Minuten eine Spritze gegen ihre Nebenhöhlenentzündung.“',
      '„Mir ist so heiß, alles juckt und mir wird schwarz vor Augen.“',
      'Allergien sind nicht bekannt, dieses Mittel hat sie zum ersten Mal bekommen.',
    ],
    befund: ['Flächige Rötung, juckende Quaddeln', 'Kaltschweißig, blass um die Nase, schwindelig', 'Atmung schnell, kein Stridor'],
    vitals: { puls: 130, rr: [70, 40], spo2: 94, af: 24, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'puls', 'af'],
    distractors: ['Kreislaufkollaps (Synkope)', 'Hypoglykämie', 'Panikattacke'],
    explanation:
      'Spritze, Minuten später Hitze, Juckreiz, Rötung und Blutdruckabfall: Das ist der Schock nach Allergenkontakt. Beim Kreislaufkollaps wäre der Puls langsam und die Haut blass ohne Quaddeln. Notarzt nachfordern, Patientin flach lagern, Zugang legen.',
  },
  {
    id: 'anaphylaxie-garnelen',
    bild: 'anaphylaxie',
    difficulty: 3,
    patient: { name: 'Tabea Sander', age: 31, sex: 'w' },
    location: 'Flensburg, Fischrestaurant am Hafen',
    dispatch: 'Gast im Restaurant hat Bauchkrämpfe, muss sich übergeben und ist kurzatmig.',
    scene:
      'Tabea sitzt vornübergebeugt auf einem Stuhl neben der Toilette, die Begleitung hält ihr eine Schale. Ihr Gesicht wirkt dick, sie atmet hörbar pfeifend.',
    anamnese: [
      'Begleiter: „Wir haben vor einer Viertelstunde bestellt, es ging ihr nach dem ersten Löffel schlecht.“',
      '„Nach fünf Minuten kribbelte mein Mund, dann wurde mir übel, und jetzt ist mein Gesicht so dick.“',
      'Der Kellner sagt: „In der Soße ist eine Paste aus Garnelen.“ Asthma kennt sie nicht.',
    ],
    befund: ['Gesicht und Augenlider geschwollen', 'Pfeifende Atmung, Erbrechen', 'Kein Hautausschlag, keine Quaddeln'],
    vitals: { puls: 126, rr: [88, 52], spo2: 91, af: 26, temp: 36.7, bz: 102, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'rr', 'puls'],
    distractors: ['Lebensmittelvergiftung', 'Asthmaanfall', 'Panikattacke mit Hyperventilation'],
    explanation:
      'Kribbeln im Mund nach Minuten, Gesichtsschwellung, Bauchkrämpfe, Atemnot und niedriger Blutdruck: Schon die Hautzeichen können anfangs fehlen. Ein Magen-Darm-Infekt braucht Stunden und macht kein Pfeifen. Beim Verdacht auf Allergie das Allergen erfragen, Notarzt nachfordern.',
  },
  {
    id: 'angio-ace',
    bild: 'angio',
    difficulty: 2,
    patient: { name: 'Detlef Schreiber', age: 66, sex: 'm' },
    location: 'Rostock, Wohnung im Stadtteil Reutershagen',
    dispatch: 'Mann mit dicker Zunge und dicken Lippen, spricht undeutlich.',
    scene:
      'Detlef sitzt am Küchentisch, neben ihm seine Frau mit einem Glas Wasser. Er hat den Mund leicht geöffnet und spricht undeutlich, aber ruhig.',
    anamnese: [
      'Ehefrau: „Seit zwei Stunden wird es immer schlimmer, ich dachte erst an einen Schlaganfall.“',
      '„Nichts juckt, ich hatte keinen Stich und nichts Neues gegessen.“',
      'Bluthochdruck seit Jahren, seit drei Wochen nimmt er eine neue Tablette dagegen.',
    ],
    befund: [
      'Zunge und Lippen deutlich geschwollen',
      'Kloßige Sprache, schluckt mit Mühe',
      'Keine Quaddeln, Gesicht seitengleich',
    ],
    vitals: { puls: 84, rr: [152, 90], spo2: 96, af: 18, temp: 36.7, bz: 108, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'spo2', 'af'],
    distractors: ['Allergische Reaktion durch Insektenstich', 'Schlaganfall', 'Zahnabszess mit Gesichtsschwellung'],
    explanation:
      'Schwellung ohne Juckreiz und ohne Nesselsucht, kein Auslöser, stabiler Kreislauf und eine neue Blutdrucktablette (ACE-Hemmer): typisch fürs Angioödem. Gerade die Zunge kann die Atemwege verlegen. Sitzend lassen, Notarzt nachfordern, Atmung eng überwachen.',
  },
  {
    id: 'angio-hae',
    bild: 'angio',
    difficulty: 3,
    patient: { name: 'Tamara Seidel', age: 34, sex: 'w' },
    location: 'Magdeburg, Büro in einem Verwaltungsgebäude am Hasselbachplatz',
    dispatch: 'Kollegin im Büro mit stark geschwollenem Gesicht, wirkt ängstlich.',
    scene:
      'Tamara sitzt an ihrem Schreibtisch, eine Kollegin hält ihr ein Taschentuch. Hände und Gesicht sind prall geschwollen, die Stimme klingt heiser.',
    anamnese: [
      '„Meine Hände waren schon heute Morgen dick, jetzt wird das Gesicht schwer.“',
      'Gestern war sie beim Zahnarzt. Tabletten gegen Allergien haben ihr bei solchen Schwellungen nie geholfen.',
      '„Früher hatte ich oft Bauchkrämpfe, meiner Mutter geht es genauso.“',
    ],
    befund: [
      'Gesicht, Lippen und Hände geschwollen',
      'Kein Juckreiz, keine Quaddeln, keine Rötung',
      'Heisere Stimme, Zunge leicht verdickt',
    ],
    vitals: { puls: 104, rr: [128, 80], spo2: 97, af: 22, temp: 36.8, bz: 90, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af', 'spo2'],
    distractors: ['Anaphylaktischer Schock', 'Zahnabszess mit Gesichtsschwellung', 'Wassereinlagerungen bei Herz- oder Nierenschwäche'],
    explanation:
      'Kein Juckreiz, keine Quaddeln, kein Allergen, Kreislauf stabil, Antihistaminikum wirkt nie, Mutter betroffen, Zahnarztbesuch als Auslöser: Das spricht für eine erbliche Form. Heisere Stimme heißt Atemwegsgefahr. Notarzt nachfordern, Rachenraum beobachten.',
  },
  {
    id: 'tabletten-verwechslung',
    bild: 'tabletten',
    difficulty: 2,
    patient: { name: 'Theodor Schulte', age: 78, sex: 'm' },
    location: 'Saarbrücken, Wohnung im Stadtteil St. Johann',
    dispatch: 'Älterer Mann ist schwindelig und sehr schwach, Sohn ruft an.',
    scene:
      'Theodor sitzt in einer Decke im Sessel, die Hände sind kalt. Auf dem Tisch liegt ein Wochendosett mit mehreren leeren Fächern.',
    anamnese: [
      '„Mir ist seit heute Mittag schwindelig, ich kann kaum stehen.“',
      'Sohn: „Er nimmt seine Tabletten aus dem Dosett, die Fächer sind heute durcheinander.“',
      'Sohn: „Ich glaube, er hat die Herztablette für den Abend schon mittags mit eingenommen – der Betablocker war doppelt.“',
    ],
    befund: ['Blass, kalte Hände', 'Wirkt müde und schwach', 'Kein Brustschmerz, keine Lähmung'],
    vitals: { puls: 40, rr: [82, 50], spo2: 94, af: 16, temp: 36.3, bz: 112, gcs: 15, ekg: 'Sinusbradykardie' },
    keyVitals: ['puls', 'rr', 'ekg'],
    distractors: ['Akuter Herzinfarkt', 'Hypoglykämie', 'Kreislaufkollaps durch Flüssigkeitsmangel'],
    explanation:
      'Langsamer Puls, niedriger Blutdruck und das Dosett: Passt zu zu viel Betablocker. Bei Flüssigkeitsmangel wäre der Puls schnell. Zuckerkrank ist er nicht, der EKG-Befund zeigt keinen Infarkt. Dosett, Packungen und Medikamentenliste mitnehmen, Notarzt nachfordern.',
  },
  {
    id: 'tabletten-digitalis',
    bild: 'tabletten',
    difficulty: 3,
    patient: { name: 'Walter Stoll', age: 80, sex: 'm' },
    location: 'Passau, Wohnung in der Altstadt',
    dispatch: 'Tochter meldet: Vater isst seit Tagen nichts mehr und ist verwirrt.',
    scene:
      'Walter sitzt im Schlafanzug am Küchentisch und starrt auf seine Hände. Auf der Arbeitsplatte stehen mehrere Tablettenpackungen mit ähnlichen Etiketten.',
    anamnese: [
      'Tochter: „Seit vier Tagen hat er keinen Appetit, ihm ist ständig übel.“',
      '„Alles sieht so gelblich aus“, sagt er und wirkt durcheinander. Durchfall oder Fieber hatte er nicht.',
      'Tochter: „Er nimmt Digitalis und eine Wassertablette – die Packungen sehen fast gleich aus, ich glaube, er hat sich vertan.“',
    ],
    befund: ['Verwirrt, zeitlich nicht orientiert', 'Unregelmäßiger, langsamer Puls', 'Bauch weich, kein Durchfall'],
    vitals: {
      puls: 44,
      rr: [104, 62],
      spo2: 95,
      af: 16,
      temp: 36.5,
      bz: 112,
      gcs: 14,
      ekg: 'Sinusbradykardie, muldenförmige ST-Senkungen, einzelne Extrasystolen',
    },
    keyVitals: ['ekg', 'puls', 'gcs'],
    distractors: ['Magen-Darm-Infekt', 'Beginnende Demenz', 'Akuter Herzinfarkt'],
    explanation:
      'Übelkeit, Gelbsehen, Verwirrtheit, ein langsamer unregelmäßiger Puls und muldenförmige ST-Senkungen: typisch bei zu viel Digitalis, besonders mit Wassertablette. Ein Infekt macht Durchfall und Fieber. Packungen mitnehmen, Notarzt nachfordern, Monitor-EKG.',
  },
  {
    id: 'pilz-pfanne',
    bild: 'pilz',
    difficulty: 2,
    patient: { name: 'Jörg Sommer', age: 45, sex: 'm' },
    location: 'Suhl, Einfamilienhaus am Domberg',
    dispatch: 'Mann hat heftigen Durchfall und Bauchschmerzen, Ehefrau ist auch krank.',
    scene:
      'Jörg liegt gekrümmt auf dem Sofa, neben ihm steht ein Eimer. Seine Frau sitzt blass am Esstisch, in der Küche stehen die Reste einer Pfanne.',
    anamnese: [
      'Ehefrau: „Gestern Abend gab es Pilze aus dem Wald, heute früh ging es bei ihm los.“',
      '„Seit acht Stunden Erbrechen und Durchfall, ich kann nichts mehr bei mir behalten.“',
      'Die beiden Kinder haben die Pilze nicht gegessen und sind gesund. Pilzreste liegen im Kühlschrank.',
    ],
    befund: ['Krampfartige Bauchschmerzen, weicher Bauch', 'Trockene Schleimhäute, schwach', 'Kein Fieber'],
    vitals: { puls: 112, rr: [108, 66], spo2: 97, af: 20, temp: 36.8, bz: 92, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Magen-Darm-Infekt', 'Blinddarmentzündung', 'Gallenkolik'],
    explanation:
      'Die Kinder aßen keine Pilze und sind gesund, die Ehefrau aß mit und ist krank: Das sagt mehr als ein Infekt. Beginn nach mehr als sechs Stunden ist ein Warnzeichen für gefährliche Pilze. Pilzreste mitnehmen, Giftinformationszentrum anrufen, Klinik.',
  },
  {
    id: 'pilz-sammler',
    bild: 'pilz',
    difficulty: 3,
    patient: { name: 'Svenja Tietz', age: 38, sex: 'w' },
    location: 'Chemnitz, Wohnung im Stadtteil Kaßberg',
    dispatch: 'Frau seit Tagen schwach und müde, Augen sind gelb.',
    scene:
      'Svenja sitzt eingehüllt in eine Decke auf dem Sofa. Das Licht ist gedämpft, sie wirkt erschöpft und spricht leise.',
    anamnese: [
      '„Seit gestern bin ich völlig ausgelaugt, mir fehlt jede Kraft.“',
      '„Vor zwei Tagen hatte ich nachts Brechdurchfall, am nächsten Tag war alles wieder gut.“',
      'Freunde hatten vorgestern ein Pilzgericht gekocht, ein anderer Gast hat jetzt auch Beschwerden.',
    ],
    befund: ['Gelbfärbung der Augen und der Haut', 'Druckschmerz im rechten Oberbauch', 'Dunkler Urin, kein Fieber'],
    vitals: { puls: 96, rr: [112, 68], spo2: 97, af: 16, temp: 36.9, bz: 64, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['bz', 'puls'],
    distractors: ['Hepatitis (Virusinfektion)', 'Gallenstein-Verschluss', 'Hypoglykämie bei Diabetes'],
    explanation:
      'Nach dem Brechdurchfall folgt eine scheinbare Besserung, dann der Leberschaden: Gelbfärbung, Müdigkeit, leicht niedriger Blutzucker. Ein Gallenstein macht Koliken und Fieber, Diabetes besteht nicht. Pilzgericht erfragen, Giftinformationszentrum, Klinik.',
    leitsymptome: [
      'Brechdurchfall nach Pilzmahlzeit mit scheinbarer Besserung',
      'Nach 1–3 Tagen Gelbfärbung, Müdigkeit, Oberbauchschmerz',
      'Blutzucker leicht niedrig: Leber arbeitet nicht mehr',
    ],
  },
  {
    id: 'drogen-club',
    bild: 'drogen',
    difficulty: 2,
    patient: { name: 'Timo Szymański', age: 22, sex: 'm' },
    location: 'Nürnberg, Technoclub in der Südstadt',
    dispatch: 'Mann im Club ist sehr heiß und unruhig, Freunde sind besorgt.',
    scene:
      'Timo sitzt am Rand der Tanzfläche und ist nassgeschwitzt, Freunde fächeln ihm Luft zu. Seine Augen wirken weit und glänzend, er kaut ununterbrochen.',
    anamnese: [
      'Freund: „Er tanzt seit fünf Stunden durch und hat kaum etwas getrunken.“',
      '„Mir ist so heiß, mein Herz rast, und mein Mund ist ganz trocken.“',
      'Freund leise: „Er hat was genommen, ich weiß nicht, was genau.“',
    ],
    befund: [
      'Weite Pupillen, Kiefermahlen',
      'Haut nass vor Schweiß, Gesicht gerötet',
      'Unruhig, kein Zittern der Glieder, kein Krampfen',
    ],
    vitals: { puls: 148, rr: [172, 98], spo2: 97, af: 26, temp: 40.1, bz: 98, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls', 'rr'],
    distractors: ['Alkoholvergiftung', 'Epileptischer Anfall', 'Fieberhafter Infekt'],
    explanation:
      'Weite Pupillen, Kiefermahlen, Schwitzen, sehr schneller Puls und Fieber nach Stunden Tanzen: das Bild einer Aufputsch-Intoxikation. Die Körpertemperatur ist hier das größte Risiko. Aus der Hitze holen, Notarzt nachfordern, Freunde zu den Substanzen befragen.',
  },
  {
    id: 'drogen-festival',
    bild: 'drogen',
    difficulty: 2,
    patient: { name: 'Selina Thalmann', age: 25, sex: 'w' },
    location: 'Simmern, Festival-Zeltplatz im Hunsrück',
    dispatch: 'Frau auf dem Zeltplatz hat große Angst und sieht Dinge, die nicht da sind.',
    scene:
      'Selina kauert vor ihrem Zelt, den Rücken an den Zeltpfosten gedrückt. Sie blickt ständig zur Seite, eine Freundin spricht beruhigend auf sie ein.',
    anamnese: [
      'Freundin: „Sie ist seit gestern Abend nicht mehr sie selbst.“',
      '„Da sind Leute, die mich beobachten – die wollen mich holen!“ Sie hat zwei Nächte kaum geschlafen.',
      'Freundin: „Sie hat gestern und heute Speed genommen, sonst nichts, Alkohol kaum.“',
    ],
    befund: [
      'Weite Pupillen, Blick unstet',
      'Schwitzt, aber keine heiße trockene Haut',
      'Keine bekannte psychische Vorerkrankung',
    ],
    vitals: { puls: 126, rr: [158, 96], spo2: 98, af: 20, temp: 37.9, bz: 88, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Akute Psychose', 'Hypoglykämie', 'Hitzschlag'],
    explanation:
      'Schlafentzug, Verfolgungsangst, Halluzinationen, weite Pupillen und schneller Puls mit hohem Blutdruck: passt zur Aufputsch-Intoxikation, nicht zu einer Psychose ohne Vorgeschichte. Blutzucker messen, Ruhe bewahren, Klinikabklärung.',
  },
];
