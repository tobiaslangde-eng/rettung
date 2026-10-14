import { AktenBild, AktenFall } from './types';

export const BILDER_NEURO: AktenBild[] = [
  {
    id: 'tia',
    diagnosis: 'Transitorische ischämische Attacke (TIA)',
    kategorie: 'neuro',
    leitsymptome: [
      'Plötzliche Ausfälle (Sprache, Kraft, Gefühl, Sehen)',
      'Komplette Rückbildung nach Minuten bis Stunden',
      'Risikofaktoren: Bluthochdruck, Diabetes, Rauchen',
    ],
  },
  {
    id: 'sab',
    diagnosis: 'Subarachnoidalblutung (Hirnblutung)',
    kategorie: 'neuro',
    leitsymptome: [
      'Schlagartiger „Vernichtungskopfschmerz“ wie ein Schlag',
      'Nackensteifigkeit, Erbrechen, Lichtscheu',
      'Bewusstseinstrübung, aber kein Fieber',
    ],
  },
  {
    id: 'meningitis',
    diagnosis: 'Hirnhautentzündung (Meningitis)',
    kategorie: 'neuro',
    leitsymptome: [
      'Fieber, starke Kopfschmerzen, Nackensteifigkeit',
      'Lichtscheu, Erbrechen, Bewusstseinstrübung',
      'Nicht wegdrückbare Hauteinblutungen als Alarmzeichen',
    ],
  },
  {
    id: 'migraene',
    diagnosis: 'Migräneanfall',
    kategorie: 'neuro',
    leitsymptome: [
      'Vorboten: Flimmern, Sehstörung oder Kribbeln',
      'Einseitiger, pulsierender Kopfschmerz mit Übelkeit',
      'Licht- und Lärmempfindlichkeit, sonst neurologisch unauffällig',
    ],
  },
  {
    id: 'lagerung',
    diagnosis: 'Lagerungsschwindel (BPLS)',
    kategorie: 'neuro',
    leitsymptome: [
      'Kurzer Drehschwindel (unter 1 Minute) bei Lageänderung',
      'Übelkeit, Erbrechen, kurzer Augenzitter',
      'Keine Lähmung, normale Sprache',
    ],
  },
  {
    id: 'delir',
    diagnosis: 'Delir (akute Verwirrtheit) bei Harnwegsinfekt',
    kategorie: 'neuro',
    leitsymptome: [
      'Plötzliche Verwirrtheit mit schwankender Wachheit',
      'Unruhe, Halluzinationen, Desorientierung',
      'Auslöser: Infekt, Fieber, zu wenig Trinken',
    ],
  },
  {
    id: 'belastung',
    diagnosis: 'Akute Belastungsreaktion',
    kategorie: 'neuro',
    leitsymptome: [
      'Kurz zuvor ein erschütterndes Ereignis',
      'Zittern, Herzrasen, wirkt „wie betäubt“ oder weint haltlos',
      'Körperlich keine Ursache, Werte nur leicht verändert',
    ],
  },
  {
    id: 'entzug',
    diagnosis: 'Alkoholentzugsdelir',
    kategorie: 'neuro',
    leitsymptome: [
      'Zittern, Schwitzen, Unruhe nach Trinkpause',
      'Halluzinationen (z. B. kleine Tiere), Desorientierung',
      'Puls und Blutdruck erhöht, leichtes Fieber',
    ],
  },
];

export const AKTEN_NEURO: AktenFall[] = [
  {
    id: 'stroke-aphasie',
    bild: 'stroke',
    difficulty: 1,
    patient: { name: 'Frank Gebhardt', age: 58, sex: 'm' },
    location: 'Rostock, Reihenhaus in Reutershagen',
    dispatch: 'Ehefrau meldet: Ihr Mann redet am Frühstückstisch nur wirres Zeug und versteht sie nicht.',
    scene:
      'Frank sitzt am gedeckten Frühstückstisch, das Brötchen liegt unberührt auf dem Teller. Er wirkt ratlos, seine Frau steht aufgeregt neben ihm.',
    anamnese: [
      'Ehefrau: „Vor einer halben Stunde war noch alles normal, dann kamen nur noch durcheinandergewürfelte Wörter.“',
      'Er zeigt auf die Kaffeekanne und sagt „Schuh“. Einfache Fragen versteht er nur zum Teil.',
      'Bluthochdruck bekannt, die Tabletten gegen die „Herzgeschichte“ hat er vor Monaten abgesetzt.',
    ],
    befund: [
      'Spricht flüssig, aber ohne Sinn; benennt Gegenstände falsch',
      'Gesicht symmetrisch, beide Arme halten ohne Absinken',
      'Kein Kopfschmerz, keine Zuckungen',
    ],
    vitals: {
      puls: 96,
      rr: [178, 100],
      spo2: 96,
      af: 16,
      temp: 36.7,
      bz: 108,
      gcs: 14,
      ekg: 'Vorhofflimmern mit absoluter Arrhythmie, Kammerfrequenz ca. 96/min',
    },
    keyVitals: ['rr', 'ekg', 'gcs'],
    distractors: ['Hypoglykämie', 'Migräne mit Aura', 'Epileptischer Krampfanfall'],
    explanation:
      'Nicht jeder Schlaganfall lähmt: Eine plötzliche Sprachstörung allein reicht für den Verdacht. Blutzucker messen schließt eine Unterzuckerung als Ursache aus. Beginn erfragen, Voranmeldung in der Stroke Unit.',
    leitsymptome: [
      'Plötzliche Sprachstörung auch ohne Lähmung',
      'Blutzucker normal, kein Kopfschmerz, keine Zuckungen',
      'Mögliche Ursache: Vorhofflimmern, hoher Blutdruck',
    ],
  },
  {
    id: 'stroke-kleinhirn',
    bild: 'stroke',
    difficulty: 3,
    patient: { name: 'Georg Fischbach', age: 66, sex: 'm' },
    location: 'Nürnberg, Altbauwohnung in Gostenhof',
    dispatch: 'Mann hat starken Schwindel, erbricht und kann nicht mehr aufstehen.',
    scene:
      'Georg liegt auf dem Sofa, neben ihm steht ein Eimer. Er hält die Augen zugekniffen. Seine Frau sagt, er sei auf dem Weg ins Bad einfach zur Seite gekippt.',
    anamnese: [
      '„Seit einer Stunde dreht sich alles, und ich muss ständig würgen.“',
      'Der Schwindel ist immer da, auch bei ganz ruhig gehaltenem Kopf. Kopfdrehen ändert nichts.',
      'Dumpfer Schmerz im Nacken und Hinterkopf. Bluthochdruck bekannt, raucht noch.',
    ],
    befund: [
      'Kann ohne Stütze nicht sitzen, kippt zur Seite',
      'Sprache klar, Gesicht symmetrisch, Arme kräftig',
      'Augen zucken waagerecht, Nacken frei beweglich',
    ],
    vitals: { puls: 84, rr: [190, 105], spo2: 96, af: 16, temp: 36.8, bz: 118, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'temp', 'bz'],
    distractors: ['Lagerungsschwindel (BPLS)', 'Magen-Darm-Infekt', 'Hirnhautentzündung'],
    explanation:
      'Ein Schlaganfall im Kleinhirn bringt Schwindel, Erbrechen und Gangunfähigkeit, aber oft keine Lähmung und normale Sprache. Schlüssel: Der Schwindel ist dauernd da, nicht kopfabhängig, und der Patient kann nicht sitzen. Immer als Notfall behandeln.',
    leitsymptome: [
      'Drehschwindel mit Erbrechen und Gangunfähigkeit',
      'Nicht durch Kopfbewegung ausgelöst, dauerhaft vorhanden',
      'Hinterkopf-/Nackenschmerz bei hohem Blutdruck',
    ],
  },
  {
    id: 'stroke-wakeup',
    bild: 'stroke',
    difficulty: 2,
    patient: { name: 'Gisela Frenzel', age: 80, sex: 'w' },
    location: 'Magdeburg, Pflegeheim am Fermersleber Weg',
    dispatch: 'Pflegekraft meldet Bewohnerin, die beim Wecken nicht richtig sprechen und sich nicht bewegen kann.',
    scene:
      'Gisela liegt im Bett, die Pflegekraft hält ihre Hand. Der rechte Mundwinkel hängt, sie versucht zu sprechen und bringt nur Laute heraus.',
    anamnese: [
      'Pflegekraft: „Gestern um 21 Uhr beim Zubettbringen war sie noch fit und hat normal gesprochen.“',
      'Heute um 6:30 Uhr beim Wecken: rechter Arm und rechtes Bein ohne Kraft, die Sprache undeutlich.',
      'In der Nacht gab es keine Kontrolle im Zimmer. Bluthochdruck bekannt.',
    ],
    befund: [
      'Rechter Mundwinkel hängt',
      'Rechter Arm und rechtes Bein schlaff, links normale Kraft',
      'Verwaschene Sprache, versteht einfache Aufforderungen',
    ],
    vitals: { puls: 78, rr: [165, 90], spo2: 95, af: 16, temp: 36.8, bz: 121, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'rr', 'bz'],
    distractors: ['Hypoglykämie', 'Akute Verwirrtheit durch Infekt', 'Kreislaufkollaps (Synkope)'],
    explanation:
      'Bei Beginn im Schlaf zählt nicht der Zeitpunkt des Aufwachens, sondern wann die Person zuletzt gesund gesehen wurde, hier gestern 21 Uhr. Genau diese Uhrzeit erfragen und dokumentieren, Stroke Unit voranmelden.',
    leitsymptome: [
      'Einseitige Lähmung und Sprachstörung beim Aufwachen',
      'Beginn unbekannt, entscheidend: „zuletzt gesund gesehen“',
      'Blutzucker normal, kein Fieber',
    ],
  },
  {
    id: 'krampf-supermarkt',
    bild: 'krampf',
    difficulty: 1,
    patient: { name: 'Franziska Gruber', age: 35, sex: 'w' },
    location: 'Erfurt, Supermarkt am Anger',
    dispatch: 'Frau im Supermarkt umgefallen, hat am ganzen Körper gezuckt.',
    scene:
      'Franziska liegt zwischen den Regalen, eine Kundin hat ihr die Jacke unter den Kopf geschoben. Einkäufe sind über den Boden verstreut, Kunden stehen im Kreis.',
    anamnese: [
      'Kassiererin: „Sie stand an der Kasse und ist plötzlich umgefallen.“',
      'Danach etwa zwei Minuten Zuckungen am ganzen Körper, dann wurde sie ruhig und schläfrig.',
      'Begleiterin: „Sie hat Epilepsie und gestern Abend ihre Tabletten vergessen.“',
    ],
    befund: ['Frischer Zungenbiss, Hose nass', 'Schläfrig, öffnet auf Ansprache die Augen, verwirrt', 'Keine Lähmung, Pupillen seitengleich'],
    vitals: { puls: 104, rr: [128, 80], spo2: 96, af: 16, temp: 36.9, bz: 102, gcs: 13, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'puls', 'bz'],
    distractors: ['Synkope (Ohnmacht)', 'Hypoglykämie', 'Schlaganfall'],
    explanation:
      'Zungenbiss, Einnässen und Nachschlaf nach etwa zwei Minuten Zuckungen sprechen für einen Krampfanfall, nicht für eine Ohnmacht. Danach Seitenlage, Blutzucker messen und den Anfall beobachten; nichts in den Mund stecken.',
  },
  {
    id: 'krampf-entzug',
    bild: 'krampf',
    difficulty: 2,
    patient: { name: 'Gunnar Fiedler', age: 50, sex: 'm' },
    location: 'Chemnitz, Wohnung in Sonnenberg',
    dispatch: 'Freund meldet: Mann hatte einen Anfall mit Zuckungen, ist jetzt wieder ansprechbar.',
    scene:
      'Gunnar sitzt auf dem Sofa, die Hände zittern sichtbar, das Hemd ist durchgeschwitzt. Sein Freund hat ihn nach dem Anfall auf die Seite gelegt und wartet neben ihm.',
    anamnese: [
      'Freund: „Er ist vom Stuhl gerutscht und hat etwa eine Minute am ganzen Körper gezuckt.“',
      'So etwas hatte er noch nie, eine Epilepsie ist nicht bekannt.',
      'Er trinkt seit Jahren täglich Alkohol und hat vor zwei Tagen aufgehört, „um eine Pause zu machen“.',
    ],
    befund: ['Grobes Zittern der Hände, schweißnasse Haut', 'Zungenbiss, leicht verlangsamt, aber orientiert', 'Kein Alkoholgeruch, keine Lähmung'],
    vitals: { puls: 112, rr: [158, 94], spo2: 97, af: 18, temp: 37.3, bz: 104, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'bz'],
    distractors: ['Alkoholvergiftung (Rausch)', 'Hypoglykämie', 'Synkope (Ohnmacht)'],
    explanation:
      'Ein Erstanfall bei einem Menschen, der seit Tagen weniger oder nichts mehr trinkt, kann ein Entzugskrampf sein. Zittern, Schwitzen und schneller Puls stützen das. Blutzucker messen, Notarzt nachfordern, auf weitere Anfälle und Verwirrtheit achten.',
    leitsymptome: [
      'Erstanfall mit Zuckungen am ganzen Körper',
      'Zittern, Schwitzen, schneller Puls',
      'Trinkpause nach langem täglichem Konsum',
    ],
  },
  {
    id: 'krampf-status',
    bild: 'krampf',
    difficulty: 3,
    patient: { name: 'Fatma Güler', age: 14, sex: 'w' },
    location: 'Flensburg, Gesamtschule – Klassenzimmer',
    dispatch: 'Schülerin krampft im Klassenzimmer, Lehrerin ruft verzweifelt an.',
    scene:
      'Fatma liegt zwischen den Tischen, die Klasse wurde aus dem Raum geschickt. Arme und Beine zucken noch. Die Lehrerin kniet daneben und hält ihre Armbanduhr in der Hand.',
    anamnese: [
      'Lehrerin: „Es hört nicht auf!“',
      'Beginn vor etwa zwölf Minuten, die Uhrzeit hat sie notiert. Seitdem keine Pause in den Zuckungen.',
      'Epilepsie bekannt, so lange hat ein Anfall laut Schulakte noch nie gedauert.',
    ],
    befund: [
      'Zuckungen an Armen und Beinen dauern an',
      'Lippen bläulich, schnarchende Atmung',
      'Reagiert auf nichts, Augen starr, kein Hautausschlag',
    ],
    vitals: { puls: 138, rr: [140, 85], spo2: 86, af: 10, temp: 37.4, bz: 112, gcs: 6, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'gcs', 'puls'],
    distractors: ['Hypoglykämie', 'Synkope (Ohnmacht)', 'Hirnhautentzündung'],
    explanation:
      'Ein Anfall, der länger als fünf Minuten dauert oder ohne Pause wiederkehrt, ist ein lebensbedrohlicher Notfall. Der Sauerstoffmangel (blaue Lippen, niedrige Sättigung) verschärft die Lage. Sofort Notarzt nachfordern, Atemwege sichern, Sauerstoff geben.',
    leitsymptome: [
      'Krampf dauert über 5 Minuten und endet nicht',
      'Blaue Lippen, niedrige Sauerstoffsättigung',
      'Tiefe Bewusstlosigkeit während des Anfalls',
    ],
  },
  {
    id: 'tia-sprache',
    bild: 'tia',
    difficulty: 2,
    patient: { name: 'Gabriele Förster', age: 61, sex: 'w' },
    location: 'Wiesbaden, Büro in der Innenstadt',
    dispatch: 'Kollegin hatte plötzlich Sprachprobleme und ein taubes Gefühl, jetzt geht es wieder.',
    scene:
      'Gabriele sitzt blass an ihrem Schreibtisch, eine Kollegin steht neben ihr. Sie reibt sich immer wieder den rechten Arm und wirkt ängstlich.',
    anamnese: [
      'Kollegin: „Mitten im Gespräch hat sie Wörter verdreht und nicht mehr richtig geredet.“',
      'Vor etwa 15 Minuten Sprachstörung und Taubheit im rechten Arm, nach etwa zehn Minuten war alles weg.',
      'Bluthochdruck, raucht seit 40 Jahren, nimmt ihre Tabletten unregelmäßig.',
    ],
    befund: [
      'Spricht jetzt klar und fließend',
      'Gesicht symmetrisch, Arme halten ohne Absinken',
      'Gefühl im rechten Arm wieder normal',
      'Kein Kopfschmerz, keine Sehstörung',
    ],
    vitals: { puls: 82, rr: [168, 94], spo2: 97, af: 16, temp: 36.7, bz: 104, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'bz', 'ekg'],
    distractors: ['Hypoglykämie', 'Migräne mit Aura', 'Panikattacke'],
    explanation:
      'Auch wenn alle Ausfälle verschwunden sind, bleibt es ein Notfall: Die Durchblutungsstörung kann sich jederzeit wiederholen und größer werden. Beginn, Dauer und Symptome genau erfragen und die Patientin trotz Besserung in die Klinik bringen.',
  },
  {
    id: 'tia-auge',
    bild: 'tia',
    difficulty: 3,
    patient: { name: 'Friedrich Gerdes', age: 68, sex: 'm' },
    location: 'Cuxhaven, Deich bei Duhnen',
    dispatch: 'Spaziergänger am Deich klagt über Sehstörung und ist sehr beunruhigt.',
    scene:
      'Friedrich sitzt auf einer Bank am Deich, seine Frau und der Hund neben ihm. Er hält die Hand vors linke Auge, nimmt sie dann aber langsam weg und blinzelt in die Sonne.',
    anamnese: [
      '„Es war, als würde mir ein Vorhang von oben vors linke Auge fallen.“',
      'Das dauerte etwa fünf Minuten, dann war die Sicht wieder normal. Schmerzen hatte er nicht.',
      'Zuckerkrank, Bluthochdruck. Die Tabletten nimmt er gewissenhaft.',
    ],
    befund: [
      'Sieht jetzt mit beiden Augen normal',
      'Auge äußerlich unauffällig, nicht gerötet, Pupillen seitengleich',
      'Gesicht symmetrisch, Sprache normal, Kraft in beiden Armen gleich',
    ],
    vitals: { puls: 76, rr: [175, 98], spo2: 97, af: 16, temp: 36.8, bz: 164, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'bz', 'ekg'],
    distractors: ['Netzhautablösung', 'Migräne mit Aura', 'Hypoglykämie'],
    explanation:
      'Ein „Vorhang“ vor einem Auge, der nach Minuten wieder verschwindet, ist ein typischer Hinweis auf eine kurzzeitige Durchblutungsstörung des Auges (Amaurosis fugax). Eine Netzhautablösung bliebe bestehen. Trotz Besserung: Klinik, Notarzt bei neuen Ausfällen.',
    leitsymptome: [
      'Einseitiger „Vorhang“ vor dem Auge für wenige Minuten',
      'Danach wieder völlig normale Sicht, kein Schmerz',
      'Risikofaktoren: Diabetes, Bluthochdruck, höheres Alter',
    ],
  },
  {
    id: 'sab-fitness',
    bild: 'sab',
    difficulty: 3,
    patient: { name: 'Franka Gundlach', age: 42, sex: 'w' },
    location: 'Karlsruhe, Fitnessstudio in der Oststadt',
    dispatch: 'Frau im Fitnessstudio hat starke Kopfschmerzen und erbricht.',
    scene:
      'Franka hockt neben dem Kniebeugenständer, die Hantelstange liegt abgelegt in der Halterung. Ein Trainer hält einen Eimer, sie presst die Hände an den Kopf und die Augen fest zu.',
    anamnese: [
      'Trainer: „Sie hat gerade schwere Kniebeugen gemacht und sich dann plötzlich an den Kopf gegriffen.“',
      '„Das ist der schlimmste Kopfschmerz meines Lebens – wie ein Schlag.“',
      'Sonst gesund, nie Kopfschmerzprobleme. Das Licht tut ihr weh, der Nacken schmerzt.',
    ],
    befund: [
      'Nacken steif, Kinn kommt nicht zur Brust',
      'Augen lichtempfindlich zugekniffen, einmal erbrochen',
      'Schläfrig, aber ansprechbar',
      'Haut warm und trocken, kein Ausschlag',
    ],
    vitals: { puls: 92, rr: [175, 105], spo2: 97, af: 18, temp: 36.9, bz: 108, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'rr', 'temp'],
    distractors: ['Hirnhautentzündung (Meningitis)', 'Migräneanfall', 'Verspannung der Halswirbelsäule'],
    explanation:
      'Nackensteife und Lichtscheu lassen an eine Hirnhautentzündung denken, doch es fehlt das Fieber, und der Schmerz setzte schlagartig bei Anstrengung ein. Ein „Schlag im Kopf“ ist ein Alarmzeichen: Notarzt nachfordern, Oberkörper leicht erhöht, Klinik mit Neurochirurgie.',
  },
  {
    id: 'sab-kisten',
    bild: 'sab',
    difficulty: 2,
    patient: { name: 'Günter Faber', age: 50, sex: 'm' },
    location: 'Passau, Garage eines Einfamilienhauses',
    dispatch: 'Mann hat in der Garage starke Kopfschmerzen bekommen, war kurz weggetreten.',
    scene:
      'Günter sitzt auf einer Getränkekiste, das Auto steht mit offenem Kofferraum davor. Seine Frau stützt ihn. Er wirkt benommen und hält sich den Kopf.',
    anamnese: [
      'Ehefrau: „Er hat Getränkekisten aus dem Auto gehoben und plötzlich laut aufgeschrien.“',
      'Wie ein Donnerschlag im Kopf, danach einige Sekunden bewusstlos. Seitdem verwirrt, fragt immer dasselbe.',
      'Bluthochdruck, raucht. So einen Kopfschmerz hatte er noch nie. Kein Sturz, kein Anprall.',
    ],
    befund: [
      'Schläfrig, verwirrt, wiederholt dieselbe Frage',
      'Nacken steif und schmerzhaft',
      'Pupillen seitengleich, keine Lähmung',
      'Einmal erbrochen',
    ],
    vitals: { puls: 72, rr: [185, 105], spo2: 96, af: 16, temp: 36.9, bz: 118, gcs: 13, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'rr', 'temp'],
    distractors: ['Kreislaufkollaps (Synkope)', 'Epileptischer Krampfanfall', 'Gehirnerschütterung'],
    explanation:
      'Ein Kopfschmerz „wie ein Donnerschlag“ beim Heben oder Pressen, kurze Bewusstlosigkeit und Nackensteife passen nicht zu Ohnmacht oder Gehirnerschütterung, denn es gab keinen Anprall. Notarzt, Oberkörper leicht erhöht, ruhig transportieren.',
  },
  {
    id: 'meningitis-wg',
    bild: 'meningitis',
    difficulty: 3,
    patient: { name: 'Felix Grünewald', age: 20, sex: 'm' },
    location: 'Jena, WG-Zimmer am Löbdergraben',
    dispatch: 'Mitbewohner meldet Student mit hohem Fieber und starken Kopfschmerzen.',
    scene:
      'Felix liegt im abgedunkelten Zimmer unter einer Decke und hält die Hand vor die Augen. Sein Mitbewohner sagt, gestern sei noch Party gewesen und er habe ihn heute früh nicht wach bekommen.',
    anamnese: [
      'Mitbewohner: „Gestern Abend war er noch fit und hat mitgefeiert, heute früh ging es los.“',
      'Heftige Kopfschmerzen, mehrfaches Erbrechen. Das Licht tut ihm weh.',
      'Seit etwa zwei Stunden rote Pünktchen an Bauch und Beinen, es werden immer mehr.',
    ],
    befund: [
      'Nacken steif, Kinn kommt nicht zur Brust',
      'Kleine punktförmige Hauteinblutungen, durch Fingerdruck nicht wegdrückbar',
      'Heiß, blass-grau, schläfrig',
    ],
    vitals: { puls: 120, rr: [100, 60], spo2: 95, af: 24, temp: 39.8, bz: 112, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls', 'rr'],
    distractors: ['Influenza (echte Grippe)', 'Alkoholvergiftung (Rausch)', 'Allergische Reaktion'],
    explanation:
      'Fieber, Nackensteife und Lichtscheu plus nicht wegdrückbare Hautpünktchen sind ein Alarmbild: Hier droht eine Blutvergiftung durch Meningokokken. Eigenschutz (Mundschutz), Notarzt nachfordern, zügig in die Klinik, Voranmeldung.',
  },
  {
    id: 'meningitis-saeugling',
    bild: 'meningitis',
    difficulty: 3,
    patient: { name: 'Finn Gebauer', age: 0, sex: 'm' },
    location: 'Bamberg, Wohnung in Gaustadt',
    dispatch: 'Mutter meldet Baby mit Fieber, das nur noch schreit und nicht mehr trinkt.',
    scene:
      'Die Mutter hält Finn auf dem Arm, er sieht grau aus und lässt den Kopf schlaff hängen. Auf dem Tisch liegt ein Fieberthermometer, daneben das unangetastete Fläschchen.',
    anamnese: [
      'Mutter: „Seit gestern Fieber. Der Kinderarzt hat mittags gesagt, es sei ein Virus.“',
      'Er schreit schrill und ist kaum zu trösten, dazwischen ganz matt. Seit dem Morgen hat er nicht getrunken.',
      'Wirkt zunehmend apathisch, verzieht bei jeder Berührung das Gesicht.',
    ],
    befund: [
      'Haut marmoriert, Hände und Füße kalt',
      'Fontanelle gespannt und vorgewölbt',
      'Schwach, wenig Reaktion; kein Durchfall, kein Erbrechen',
    ],
    vitals: { puls: 178, rr: [86, 50], spo2: 94, af: 52, temp: 39.6, bz: 96, gcs: 12, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'temp', 'spo2'],
    distractors: ['Virusinfekt mit Fieber', 'Mittelohrentzündung', 'Magen-Darm-Infekt'],
    explanation:
      'Bei Säuglingen fehlt oft die Nackensteife. Warnzeichen sind schrilles Schreien, Trinkverweigerung, Apathie, marmorierte Haut und die gespannte Fontanelle. Ein „Virus“ erklärt das nicht. Sofort Notarzt nachfordern und zügig in die Kinderklinik.',
    leitsymptome: [
      'Fieber mit schrillem Schreien, Trinkverweigerung, Apathie',
      'Gespannte, vorgewölbte Fontanelle',
      'Marmorierte Haut, kalte Hände und Füße',
    ],
  },
  {
    id: 'migraene-buero',
    bild: 'migraene',
    difficulty: 1,
    patient: { name: 'Greta Fuhrmann', age: 28, sex: 'w' },
    location: 'Essen, Großraumbüro in Rüttenscheid',
    dispatch: 'Kollegin hat starke Kopfschmerzen, ist blass und muss sich übergeben.',
    scene:
      'Greta sitzt in einem Besprechungsraum, die Jalousien sind heruntergelassen. Sie stützt den Kopf in die Hände, vor ihr steht ein Papierkorb, eine Kollegin hält ein feuchtes Tuch bereit.',
    anamnese: [
      '„Das fing vor einer Stunde an. Ich wollte nur noch kurz das Projekt fertig machen.“',
      'Zuerst Flimmern vor dem linken Auge, etwa 20 Minuten lang, dann pulsierender Schmerz auf einer Seite.',
      '„Solche Anfälle kenne ich seit Jahren, meine Tabletten liegen zu Hause.“',
    ],
    befund: [
      'Pochender Kopfschmerz rechts, Übelkeit',
      'Meidet Licht und Geräusche, hält sich die Ohren zu',
      'Nacken frei beweglich, Sprache und Kraft normal',
    ],
    vitals: { puls: 84, rr: [126, 78], spo2: 98, af: 16, temp: 36.6, bz: 92, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['temp', 'bz', 'rr'],
    distractors: ['Hirnhautentzündung', 'Hypoglykämie', 'Schlaganfall'],
    explanation:
      'Flimmern vor dem Auge, einseitiger pochender Kopfschmerz und Übelkeit bei bekannter Vorgeschichte sind das Lehrbuchbild. Entscheidend sind die normalen Werte: kein Fieber, keine Nackensteife, keine Ausfälle. Reizarm lagern, Blutzucker messen.',
  },
  {
    id: 'migraene-schule',
    bild: 'migraene',
    difficulty: 2,
    patient: { name: 'Gabriel Fenske', age: 16, sex: 'm' },
    location: 'Regensburg, Gymnasium – Klausurraum',
    dispatch: 'Schüler in der Klausur mit Sehstörung und Taubheit in der Hand, Lehrer fürchtet Schlaganfall.',
    scene:
      'Gabriel sitzt an seinem Platz, der Klausurbogen ist halb beschrieben. Er ist blass und hält die Augen halb geschlossen. Die übrigen Schüler wurden hinausgeschickt, der Lehrer steht ratlos daneben.',
    anamnese: [
      'Lehrer: „Er klagte über Flimmern und konnte nicht mehr weiterschreiben.“',
      'Erst Zickzack-Flimmern, dann wanderte ein Kribbeln über etwa 15 Minuten langsam von den Fingern in den Unterarm. Kurz sprach er langsamer.',
      'Danach pochender Kopfschmerz. Die Mutter hat ähnliche Anfälle, er hatte noch nie einen. Wenig geschlafen, Klausurstress.',
    ],
    befund: [
      'Pochender Kopfschmerz an der Stirn, lichtscheu',
      'Gesicht symmetrisch, Arme halten ohne Absinken',
      'Sprache jetzt flüssig, orientiert, keine Zuckungen',
    ],
    vitals: { puls: 88, rr: [122, 72], spo2: 98, af: 16, temp: 36.7, bz: 94, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['bz', 'gcs', 'rr'],
    distractors: ['Schlaganfall', 'Epileptischer Krampfanfall', 'Hypoglykämie'],
    explanation:
      'Die Symptome wandern langsam über Minuten, statt schlagartig aufzutreten, und es folgt ein pochender Kopfschmerz. Das spricht für eine Aura. Bei Jugendlichen ist ein Schlaganfall selten, aber Zucker messen und neurologisch prüfen bleibt Pflicht.',
    leitsymptome: [
      'Wandernde Symptome über Minuten, nicht schlagartig',
      'Zickzack-Flimmern, Kribbeln, dann pochender Kopfschmerz',
      'Familiäre Häufung, neurologisch bald unauffällig',
    ],
  },
  {
    id: 'lagerung-bett',
    bild: 'lagerung',
    difficulty: 1,
    patient: { name: 'Frieda Grote', age: 63, sex: 'w' },
    location: 'Oldenburg, Schlafzimmer in Eversten',
    dispatch: 'Frau hat heftigen Schwindel und erbricht, liegt im Bett.',
    scene:
      'Frieda liegt im Bett und hält den Kopf ganz still. Neben dem Bett steht ein Eimer, ihr Mann sitzt besorgt auf der Bettkante.',
    anamnese: [
      '„Als ich mich umgedreht habe, fing plötzlich alles an, sich zu drehen.“',
      'Der Schwindel dauerte etwa 30 Sekunden und kam wieder, als sie den Kopf nach rechts drehte.',
      'Dazwischen fühlt sie sich fast gesund. Keine Kopfschmerzen, Gehör normal.',
    ],
    befund: [
      'Kurzer Augenzitter beim Hinlegen mit Kopf zur Seite',
      'Sprache normal, Gesicht symmetrisch, Arme kräftig',
      'Übelkeit, einmal erbrochen; kann mit Hilfe sicher sitzen',
    ],
    vitals: { puls: 78, rr: [150, 85], spo2: 97, af: 16, temp: 36.7, bz: 108, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'gcs', 'bz'],
    distractors: ['Schlaganfall', 'Menière-Anfall', 'Magen-Darm-Infekt'],
    explanation:
      'Kurze Schwindelattacken von unter einer Minute, die durch Kopf- und Lageänderung ausgelöst werden, sprechen für Lagerungsschwindel. Es fehlen Lähmung, Sprachstörung und Hörverlust. Trotzdem neurologisch prüfen und Blutzucker messen.',
  },
  {
    id: 'lagerung-garage',
    bild: 'lagerung',
    difficulty: 2,
    patient: { name: 'Gerd Frey', age: 55, sex: 'm' },
    location: 'Trier, Garage in Euren',
    dispatch: 'Mann in Garage plötzlich Drehschwindel und Erbrechen, Sohn befürchtet Schlimmeres.',
    scene:
      'Gerd sitzt an der Werkbank auf einem Hocker und hält sich an der Tischkante fest. Auf dem Boden liegt Werkzeug, sein Sohn steht aufgeregt neben ihm.',
    anamnese: [
      'Sohn: „Ich dachte, es ist ein Schlaganfall! Papa ist beim Bücken fast umgekippt.“',
      'Beim Bücken nach dem Werkzeug schlagartig Drehschwindel, etwa eine halbe Minute, dann Erbrechen.',
      'In den letzten Tagen schwindelte es ihm schon beim Hinlegen und Aufrichten. Sonst gesund.',
    ],
    befund: [
      'Nach Zurücklegen mit Kopf zur Seite kurzer Augenzitter und Schwindel',
      'Sprache klar, Gesicht symmetrisch, Kraft gleich',
      'Geht nach Abklingen sicher geradeaus, kein Kopfschmerz',
    ],
    vitals: { puls: 76, rr: [138, 84], spo2: 97, af: 16, temp: 36.6, bz: 112, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'bz', 'rr'],
    distractors: ['Schlaganfall', 'Herzrhythmusstörung', 'Hypoglykämie'],
    explanation:
      'Heftiger Schwindel macht Angehörigen Angst und wird schnell mit einem Schlaganfall verwechselt. Hier sprechen der Auslöser (Lagewechsel), die kurze Dauer, der Augenzitter und das Fehlen von Ausfällen dagegen. Immer neurologisch prüfen und Blutzucker messen.',
  },
  {
    id: 'delir-heim',
    bild: 'delir',
    difficulty: 2,
    patient: { name: 'Gustav Fiebig', age: 84, sex: 'm' },
    location: 'Schwerin, Pflegeheim am Pfaffenteich',
    dispatch: 'Heimbewohner plötzlich verwirrt und unruhig, will das Zimmer verlassen.',
    scene:
      'Gustav sitzt im Nachthemd auf der Bettkante und tastet unruhig an der Wand entlang. Eine Pflegekraft versucht ihn zu beruhigen. Der Trinkbecher auf dem Nachttisch ist fast voll.',
    anamnese: [
      'Pflegekraft: „Gestern Abend war er noch klar und hat Karten gespielt, seit heute Nacht ist er unruhig.“',
      'Er sagt, „Männer stehen im Zimmer“, die niemand sieht.',
      'Trinkt seit Tagen wenig, der Urin ist trüb und riecht stark. Keine Demenz bekannt.',
    ],
    befund: [
      'Trockene Haut und Schleimhäute, fiebrig',
      'Unruhig, zu Ort und Zeit nicht orientiert',
      'Atmung ruhig, kein Husten; Mundwinkel symmetrisch, Arme gleich kräftig',
    ],
    vitals: { puls: 104, rr: [134, 80], spo2: 95, af: 20, temp: 38.4, bz: 124, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'puls'],
    distractors: ['Hypoglykämie', 'Schlaganfall', 'Lungenentzündung'],
    explanation:
      'Plötzliche Verwirrtheit mit Sinnestäuschungen bei einem Menschen, der gestern noch klar war, ist ein Delir. Auslöser sind oft Infekt und Flüssigkeitsmangel. Der trübe Urin und das Fieber sind der Schlüssel. Blutzucker messen, ruhig bleiben, in die Klinik.',
  },
  {
    id: 'delir-tochter',
    bild: 'delir',
    difficulty: 3,
    patient: { name: 'Gertrud Fink', age: 79, sex: 'w' },
    location: 'Konstanz, Wohnung am Paradies',
    dispatch: 'Tochter meldet: Mutter ist verwirrt und erkennt sie nicht mehr.',
    scene:
      'Gertrud liegt im Bett, die Augen sind offen, der Blick geht ins Leere. Sie zupft unablässig an der Bettdecke. Die Tochter steht mit einer Tasche voller Medikamentenschachteln neben dem Bett.',
    anamnese: [
      'Tochter: „Mama erkennt mich nicht und zupft die ganze Zeit an der Decke.“',
      'Vor drei Tagen war sie noch völlig klar. Heute Morgen wach, mittags wieder schläfrig, ständig im Wechsel.',
      'Seit Tagen kaum getrunken, hat über Brennen beim Wasserlassen geklagt.',
    ],
    befund: [
      'Wachheit schwankt, schreckt zwischendurch auf',
      'Spricht zusammenhanglos, zupft an der Decke',
      'Trockene Zunge, Hautfalte bleibt stehen',
      'Gesicht symmetrisch, Arme gleich kräftig',
    ],
    vitals: { puls: 102, rr: [118, 72], spo2: 95, af: 18, temp: 38.0, bz: 132, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'gcs', 'puls'],
    distractors: ['Schlaganfall', 'Demenz (Alzheimer)', 'Hypoglykämie'],
    explanation:
      'Eine Demenz entwickelt sich über Monate und Jahre, eine plötzliche Verwirrtheit mit schwankender Wachheit über Tage ist ein Delir. Fieber, Flüssigkeitsmangel und das Brennen beim Wasserlassen deuten den Auslöser an. Nach akuten Ursachen suchen und in die Klinik bringen.',
  },
  {
    id: 'belastung-unfall',
    bild: 'belastung',
    difficulty: 1,
    patient: { name: 'Fabian Grabowski', age: 39, sex: 'm' },
    location: 'Lüneburg, Kreuzung am Sand',
    dispatch: 'Passant steht nach einem Verkehrsunfall zitternd an der Unfallstelle, ist selbst nicht verletzt.',
    scene:
      'Fabian steht mit seinem Fahrrad am Straßenrand und blickt starr zur Unfallstelle. Seine Arme sind vor dem Körper verschränkt, er zittert sichtbar.',
    anamnese: [
      'Passantin: „Er hat alles gesehen und steht seitdem nur da.“',
      'Er kann sich an Einzelheiten des Unfalls nicht erinnern und antwortet langsam.',
      'Sonst gesund, keine Medikamente. Er sagt, es fühle sich an, „als stünde ich hinter einer Glasscheibe“.',
    ],
    befund: [
      'Zittert am ganzen Körper, Hände kalt',
      'Blick starr, antwortet verzögert, aber orientiert',
      'Keine Verletzungen, kein Brustschmerz',
    ],
    vitals: { puls: 108, rr: [142, 88], spo2: 98, af: 22, temp: 36.6, bz: 98, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'af'],
    distractors: ['Schädel-Hirn-Trauma', 'Hypoglykämie', 'Herzrhythmusstörung'],
    explanation:
      'Wer ein schlimmes Ereignis miterlebt, kann benommen, zitternd und gedächtnislos reagieren, ohne verletzt zu sein. Zuerst körperliche Ursachen ausschließen (Verletzung, Blutzucker, EKG). Dann Ruhe, Wärme, Sichtschutz und jemand, der bei ihm bleibt.',
  },
  {
    id: 'belastung-nachricht',
    bild: 'belastung',
    difficulty: 2,
    patient: { name: 'Franka Gärtner', age: 55, sex: 'w' },
    location: 'Würzburg, Mehrfamilienhaus in der Sanderau',
    dispatch: 'Nachbarin meldet Frau mit Engegefühl und Schwindel in der Wohnung.',
    scene:
      'Franka sitzt auf dem Küchenstuhl, eine Nachbarin hält ihre Hand. Auf dem Tisch liegen Taschentücher und eine Visitenkarte der Polizei.',
    anamnese: [
      'Nachbarin: „Vor einer Stunde war die Polizei da. Ihr Sohn ist bei einem Unfall ums Leben gekommen.“',
      'Danach Weinkrampf, Schwindel und Enge in der Brust, die kommt und geht und nicht ausstrahlt.',
      'Bis auf Tabletten gegen Bluthochdruck gesund, keine Herzvorerkrankung, keine Beschwerden beim Treppensteigen.',
    ],
    befund: [
      'Weint, zittert, ansprechbar und orientiert',
      'Haut warm, nicht kaltschweißig',
      'Keine Lähmung, Sprache klar, Atmung schnell aber ruhig',
    ],
    vitals: { puls: 98, rr: [156, 92], spo2: 98, af: 22, temp: 36.8, bz: 118, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'af', 'ekg'],
    distractors: ['Akuter Herzinfarkt (STEMI)', 'Schlaganfall', 'Kreislaufkollaps (Synkope)'],
    explanation:
      'Nach einer Todesnachricht sind Weinen, Zittern, Enge in der Brust und erhöhte Werte eine normale Reaktion. Das EKG ohne Veränderungen, fehlende Ausfälle und der zeitliche Zusammenhang sind der Schlüssel. Zuwendung, Zeit, jemanden benachrichtigen, der beisteht.',
  },
  {
    id: 'entzug-delir',
    bild: 'entzug',
    difficulty: 3,
    patient: { name: 'Gerrit Funke', age: 55, sex: 'm' },
    location: 'Kaiserslautern, Wohnung im Kotten',
    dispatch: 'Bruder meldet: Mann zittert, schwitzt stark und redet wirres Zeug.',
    scene:
      'Gerrit sitzt am Küchentisch, die Hände zittern so stark, dass er das Wasserglas nicht halten kann. Seine Stirn ist nass, ein Fenster steht weit offen. Sein Bruder bleibt dicht bei ihm.',
    anamnese: [
      'Bruder: „Seit zwei Tagen wird es immer schlimmer, heute Nacht hat er gar nicht geschlafen.“',
      'Er hat vor drei Tagen aufgehört zu trinken, nach Jahren täglichen Konsums.',
      'Er sieht Spinnen an der Wand und weiß nicht, welcher Tag ist.',
    ],
    befund: [
      'Grobes Zittern der Hände, schweißnass',
      'Unruhig, zu Zeit und Ort nicht orientiert, zeigt auf nicht vorhandene Spinnen',
      'Nacken frei beweglich, keine Fahne, keine Lähmung',
    ],
    vitals: { puls: 118, rr: [172, 102], spo2: 96, af: 20, temp: 37.8, bz: 96, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Hypoglykämie', 'Alkoholvergiftung (Rausch)', 'Hirnhautentzündung'],
    explanation:
      'Zwei bis drei Tage nach dem Absetzen kann nach langem täglichem Konsum ein lebensbedrohliches Delir auftreten. Typisch sind Zittern, Schwitzen, schneller Puls und Sinnestäuschungen. Notarzt nachfordern, Krampfgefahr beachten, Blutzucker messen, ruhig und sachlich bleiben.',
  },
];
