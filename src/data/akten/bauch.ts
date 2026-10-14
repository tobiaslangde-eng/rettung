import { AktenBild, AktenFall } from './types';

export const BILDER_BAUCH: AktenBild[] = [
  {
    id: 'blinddarm',
    diagnosis: 'Blinddarmentzündung (Appendizitis)',
    kategorie: 'bauch',
    leitsymptome: [
      'Schmerz beginnt um den Nabel und wandert in den rechten Unterbauch',
      'Übelkeit, Appetitlosigkeit, leichtes Fieber',
      'Druck- und Loslassschmerz, Erschütterung (Hüpfen, Husten) tut weh',
    ],
  },
  {
    id: 'galle',
    diagnosis: 'Gallenkolik / Gallenblasenentzündung',
    kategorie: 'bauch',
    leitsymptome: [
      'Krampfartiger Schmerz im rechten Oberbauch, oft nach fettigem Essen',
      'Ausstrahlung in rechte Schulter oder Rücken, Übelkeit, Erbrechen',
      'Bei Entzündung: Fieber, gelbliche Augen',
    ],
  },
  {
    id: 'ileus',
    diagnosis: 'Darmverschluss (Ileus)',
    kategorie: 'bauch',
    leitsymptome: [
      'Aufgetriebener Bauch, Stuhl- und Windverhalt',
      'Wellenartige Bauchschmerzen, später Dauerschmerz',
      'Erbrechen, im späten Stadium kotig riechend',
    ],
  },
  {
    id: 'gastro',
    diagnosis: 'Magen-Darm-Infekt (Gastroenteritis)',
    kategorie: 'bauch',
    leitsymptome: [
      'Erbrechen und wässriger Durchfall',
      'Krampfartige Bauchschmerzen ohne Abwehrspannung',
      'Flüssigkeitsmangel: trockener Mund, schneller Puls, niedriger Blutdruck',
    ],
  },
  {
    id: 'pyelo',
    diagnosis: 'Nierenbeckenentzündung (Pyelonephritis)',
    kategorie: 'bauch',
    leitsymptome: [
      'Hohes Fieber mit Schüttelfrost',
      'Dumpfer Flankenschmerz, Klopfschmerz im Nierenlager',
      'Brennen beim Wasserlassen, häufiger Harndrang',
    ],
  },
  {
    id: 'gib',
    diagnosis: 'Magen-Darm-Blutung',
    kategorie: 'bauch',
    leitsymptome: [
      'Teerstuhl oder Bluterbrechen',
      'Blässe, Schwäche, Schwindel',
      'Schockzeichen: schneller Puls, niedriger Blutdruck',
    ],
  },
  {
    id: 'hoden',
    diagnosis: 'Hodentorsion (Hodendrehung)',
    kategorie: 'bauch',
    leitsymptome: [
      'Plötzlicher, heftiger Hodenschmerz, oft nachts oder nach Belastung',
      'Hoden hochstehend, geschwollen und sehr druckschmerzhaft',
      'Übelkeit, Erbrechen, Schmerz kann in Leiste oder Unterbauch ziehen',
    ],
  },
];

export const AKTEN_BAUCH: AktenFall[] = [
  {
    id: 'hypo-heim',
    bild: 'hypo',
    difficulty: 2,
    patient: { name: 'Georg Hofmann', age: 79, sex: 'm' },
    location: 'Wuppertal, Pflegeheim in Barmen',
    dispatch: 'Heimbewohner morgens nicht weckbar, die Pflegekraft ruft den Rettungsdienst.',
    scene:
      'Georg liegt auf dem Rücken im Bett, sein Nachthemd klebt am Körper. Die Pflegekraft rüttelt ihn an der Schulter, er öffnet nur kurz die Augen.',
    anamnese: [
      'Pflegekraft: „Er schläft so tief, ich kriege ihn einfach nicht wach.“',
      'Gestern Abend hat er kaum etwas gegessen, nur ein paar Löffel Suppe.',
      'Typ-2-Diabetiker mit Insulin – gespritzt wurde gestern trotzdem wie gewohnt.',
    ],
    befund: ['Nass geschwitzt, Haut kühl', 'Reagiert nur auf Schmerzreiz', 'Pupillen seitengleich, Arme und Beine bewegen sich gleich'],
    vitals: { puls: 98, rr: [142, 80], spo2: 96, af: 14, temp: 36.2, bz: 28, gcs: 8, ekg: 'Sinusrhythmus' },
    keyVitals: ['bz', 'gcs'],
    distractors: ['Schlaganfall', 'Sepsis', 'Krampfanfall mit Nachschlaf'],
    explanation:
      'Im Heim wird tiefe Bewusstlosigkeit schnell als „er schläft nur fest“ abgetan. Der Schlüssel: Insulin trotz kaum gegessenem Abendessen und nassgeschwitzte Haut. Bei jedem nicht weckbaren Patienten sofort den Blutzucker messen.',
  },
  {
    id: 'hypo-sport',
    bild: 'hypo',
    difficulty: 2,
    patient: { name: 'Ilja Jovanović', age: 24, sex: 'm' },
    location: 'Chemnitz, Vereinsheim der Tischtennisabteilung',
    dispatch: 'Betrunkener, aggressiver junger Mann bei einem Turnier, lässt sich nicht beruhigen.',
    scene:
      'Mitspieler stehen im Halbkreis um Ilja, der schwankt und die helfenden Hände wegschlägt. Seine Sporttasche liegt aufgerissen auf dem Boden.',
    anamnese: [
      'Mitspieler: „Der hat gar nichts getrunken, er hat eben noch ganz normal gespielt!“',
      'Seit dem Frühstück nur Turnier gespielt und nichts gegessen, spielte seit Stunden fast ohne Pause.',
      'In der Tasche liegt ein Insulinpen – Ilja ist Typ-1-Diabetiker.',
    ],
    befund: ['Lallende Sprache, unsicherer Gang', 'Blass, schweißnass, zittrige Hände', 'Kein Alkoholgeruch, kein Sturz, keine Kopfverletzung'],
    vitals: { puls: 108, rr: [134, 78], spo2: 98, af: 18, temp: 36.6, bz: 41, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['bz', 'gcs', 'puls'],
    distractors: ['Alkoholvergiftung', 'Drogenrausch', 'Schädel-Hirn-Trauma'],
    explanation:
      'Lallen, Schwanken und Aggressivität sind kein Beweis für Alkohol. Körperliche Anstrengung senkt den Zucker zusätzlich, besonders bei Insulin. Der Pen in der Tasche und der fehlende Alkoholgeruch führen zur Lösung – immer erst Blutzucker messen.',
  },
  {
    id: 'hypo-tabletten',
    bild: 'hypo',
    difficulty: 3,
    patient: { name: 'Ingrid Hellwig', age: 77, sex: 'w' },
    location: 'Erfurt, Wohnung in der Altstadt',
    dispatch: 'Nachbarin meldet ältere Frau, die plötzlich wirr redet und sich nicht mehr auskennt.',
    scene:
      'Ingrid sitzt am Küchentisch und knetet ein Geschirrtuch. Die Nachbarin steht besorgt daneben, auf dem Tisch liegt eine Tablettenbox mit Wochentagen.',
    anamnese: [
      'Nachbarin: „Heute früh war sie noch ganz klar, seit dem Mittag redet sie wirres Zeug.“',
      'Appetit fehlt seit Tagen, heute hat sie kaum etwas gegessen.',
      'Nimmt Tabletten gegen die Zuckerkrankheit, die Nieren arbeiten schlecht.',
    ],
    befund: [
      'Zeitlich und örtlich nicht orientiert',
      'Kalte, feuchte Haut',
      'Gesicht symmetrisch, Arme gleich kräftig, Sprache klar, aber inhaltlich wirr',
    ],
    vitals: { puls: 88, rr: [150, 84], spo2: 96, af: 16, temp: 36.4, bz: 44, gcs: 13, ekg: 'Sinusrhythmus' },
    keyVitals: ['bz', 'gcs'],
    distractors: ['Schlaganfall', 'Demenz', 'Harnwegsinfekt'],
    explanation:
      'Auch Tabletten können tiefe Unterzuckerungen auslösen, besonders bei Nierenschwäche und wenig Essen: Sie wirken dann sehr lange nach. Plötzlich beginnende Verwirrtheit ist keine Demenz. Blutzucker messen und nach Klinikeinweisung die Überwachung nicht beenden.',
  },
  {
    id: 'ketoazidose-kind',
    bild: 'ketoazidose',
    difficulty: 2,
    patient: { name: 'Emil Haase', age: 11, sex: 'm' },
    location: 'Rostock, Wohnung im Stadtteil Reutershagen',
    dispatch: 'Elfjähriger hat starke Bauchschmerzen, erbricht und atmet auffällig tief.',
    scene:
      'Emil liegt blass auf dem Sofa, neben ihm steht ein Eimer. Seine Mutter streichelt ihm den Kopf, im Wohnzimmer riecht es süßlich-fruchtig.',
    anamnese: [
      'Mutter: „Seit ein paar Tagen ist er schlapp, und heute Nacht fing der Bauch an wehzutun.“',
      'Er hat in vier Wochen fast fünf Kilo abgenommen, trinkt ständig und nässt nachts wieder ein.',
      'Erbricht seit dem Morgen, in der Familie gibt es keinen Durchfall und keine Zuckerkrankheit.',
    ],
    befund: ['Tiefe, schnelle Atmung, Atem riecht nach Nagellackentferner', 'Trockene Lippen, Haut steht in einer Falte', 'Bauch weich, keine Abwehrspannung'],
    vitals: { puls: 124, rr: [96, 58], spo2: 98, af: 32, temp: 36.9, bz: 520, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['bz', 'af', 'puls'],
    distractors: ['Blinddarmentzündung', 'Magen-Darm-Infekt', 'Asthmaanfall'],
    explanation:
      'Bei Kindern ist die Stoffwechselentgleisung oft das erste Zeichen des Diabetes. Bauchschmerz und Erbrechen täuschen eine Bauchkrankheit vor, doch Gewichtsverlust, Durst und Einnässen sowie die tiefe Atmung weisen den Weg. Blutzucker messen, Atmung nicht bremsen.',
  },
  {
    id: 'ketoazidose-infekt',
    bild: 'ketoazidose',
    difficulty: 3,
    patient: { name: 'Marcel Jacobi', age: 45, sex: 'm' },
    location: 'Magdeburg, Wohnung im Stadtteil Stadtfeld',
    dispatch: 'Mann mit Grippe erbricht seit Stunden und bekommt schlecht Luft.',
    scene:
      'Marcel liegt unter einer Decke auf dem Sofa, auf dem Tisch türmen sich Taschentücher und Hustensaft. Seine Partnerin hat ihm einen Eimer hingestellt.',
    anamnese: [
      'Partnerin: „Er hat seit vier Tagen Schnupfen und Husten und isst praktisch nichts mehr.“',
      'Seit heute Morgen erbricht er, der Bauch tut weh, und er hat riesigen Durst.',
      'Typ-1-Diabetiker – sein Insulin hat er seit zwei Tagen ausgelassen, „weil er ja nichts isst“.',
    ],
    befund: [
      'Tiefe, schnelle Atmung ohne Pfeifen oder Rasseln',
      'Fruchtiger Geruch der Ausatemluft',
      'Trockene Zunge, Bauch weich, diffus druckempfindlich',
    ],
    vitals: { puls: 116, rr: [100, 60], spo2: 97, af: 28, temp: 37.8, bz: 468, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['bz', 'af', 'rr'],
    distractors: ['Lungenentzündung', 'Herzinfarkt', 'Magen-Darm-Infekt'],
    explanation:
      'Bei Krankheit steigt der Insulinbedarf, auch wenn man nichts isst. Wer dann das Insulin weglässt, entgleist rasch. Die tiefe Atmung bei normaler Sauerstoffsättigung und der Fruchtgeruch trennen die Übersäuerung von Lunge und Magen-Darm. Immer Blutzucker messen.',
  },
  {
    id: 'nierenkolik-wandern',
    bild: 'nierenkolik',
    difficulty: 1,
    patient: { name: 'Heike Jung', age: 51, sex: 'w' },
    location: 'Monschau, Wanderweg im Rurtal (Eifel)',
    dispatch: 'Wanderin mit starken Schmerzen im Bauch auf einem Waldweg, Begleiter bittet um Hilfe.',
    scene:
      'Heike läuft auf dem Forstweg auf und ab und hält sich die rechte Seite. Ihre Wanderstöcke liegen im Gras, die Gruppe steht ratlos daneben.',
    anamnese: [
      'Begleiter: „Vor einer Stunde ging es los, und seitdem kann sie keine Minute still stehen.“',
      'Die Schmerzen kommen in Wellen, von der rechten Flanke bis in die Leiste.',
      'Hat heute kaum getrunken, der Urin war vorhin rötlich.',
    ],
    befund: ['Läuft unruhig umher, findet keine Position', 'Übelkeit, Schweiß auf der Stirn', 'Bauch weich, Klopfschmerz über der rechten Niere'],
    vitals: { puls: 104, rr: [148, 90], spo2: 98, af: 18, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Gallenkolik', 'Blinddarmentzündung', 'Hexenschuss (Lumbago)'],
    explanation:
      'Wellenartiger Flankenschmerz mit Bewegungsdrang und rötlichem Urin ist das Lehrbuchbild. Das Fehlen von Fieber und einem harten Bauch spricht gegen Entzündungen. Wer sich vor Schmerz nicht ruhig halten kann, hat meist eine Kolik, keine Bauchfellreizung.',
  },
  {
    id: 'nierenkolik-sport',
    bild: 'nierenkolik',
    difficulty: 2,
    patient: { name: 'Dario Heinemann', age: 29, sex: 'm' },
    location: 'Nürnberg, Ruhebereich einer Saunalandschaft',
    dispatch: 'Mann mit plötzlichen heftigen Schmerzen in Seite und Unterleib, ihm ist übel.',
    scene:
      'Dario sitzt im Bademantel auf einer Liege und steht immer wieder auf, um zu gehen. Neben ihm stehen eine leere Flasche und seine Sporttasche.',
    anamnese: [
      '„Nach dem Krafttraining und der Sauna ging es los, links in der Seite.“',
      'Der Schmerz kommt in Wellen, zieht bis in den Hoden und er hat zweimal erbrochen.',
      'Hat heute viel geschwitzt und kaum etwas getrunken.',
    ],
    befund: [
      'Hoden und Hodensack äußerlich unauffällig, nicht druckschmerzhaft',
      'Keine Vorwölbung in der Leiste',
      'Unruhig, Klopfschmerz über der linken Niere',
    ],
    vitals: { puls: 106, rr: [150, 92], spo2: 98, af: 18, temp: 36.9, bz: 108, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Hodentorsion (Hodendrehung)', 'Leistenbruch', 'Muskelzerrung'],
    explanation:
      'Ausstrahlung in den Hoden macht bei jungen Männern schnell an eine Hodendrehung denken. Hier sind Hoden und Leiste unauffällig, dafür kommt der Schmerz wellenförmig aus der Flanke. Immer Hoden und Leiste untersuchen – die Hodendrehung darf nie übersehen werden.',
  },
  {
    id: 'sepsis-harnweg',
    bild: 'sepsis',
    difficulty: 2,
    patient: { name: 'Hannelore Jansen', age: 72, sex: 'w' },
    location: 'Oldenburg, Wohnung in der Südstadt',
    dispatch: 'Seniorin plötzlich verwirrt, hat Schüttelfrost, die Tochter ruft an.',
    scene:
      'Hannelore liegt zugedeckt im Bett und zittert am ganzen Körper. Sie schaut ihre Tochter an und fragt, wer sie sei.',
    anamnese: [
      'Tochter: „Mama redet wirres Zeug, heute Morgen war sie noch ganz klar.“',
      'Seit drei Tagen brennt es beim Wasserlassen, sie wollte das „aussitzen“.',
      'Seit heute Fieber um 39 Grad, Schüttelfrost, sie trinkt kaum noch.',
    ],
    befund: ['Marmorierte Haut an den Knien, kalte Hände', 'Verwirrt, Gesicht symmetrisch', 'Nacken frei beweglich, kein Hautausschlag'],
    vitals: { puls: 118, rr: [88, 50], spo2: 94, af: 26, temp: 39.2, bz: 148, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'temp', 'af', 'gcs'],
    distractors: ['Hirnhautentzündung', 'Schlaganfall', 'Austrocknung (Exsikkose)'],
    explanation:
      'Ein banaler Harnwegsinfekt kann bei älteren Menschen zur Blutvergiftung werden. Niedriger Blutdruck, schnelle Atmung und neue Verwirrtheit (qSOFA) sind die Alarmzeichen. Notarzt nachfordern, Voranmeldung „Verdacht Sepsis“, nicht auf „Es war nur die Blase“ vertrauen.',
  },
  {
    id: 'sepsis-phlegmone',
    bild: 'sepsis',
    difficulty: 3,
    patient: { name: 'Harald Huber', age: 51, sex: 'm' },
    location: 'Passau, Wohnung in der Innstadt',
    dispatch: 'Mann mit geschwollenem Bein ist sehr schwach und kann kaum noch stehen.',
    scene:
      'Harald sitzt auf der Bettkante, die Hose ist bis zum Knie hochgekrempelt. Seine Frau hat ein Handtuch über das Bein gelegt und hält sein Handy mit der Fieberkurve in der Hand.',
    anamnese: [
      'Ehefrau: „Er ist seit gestern wie ausgewechselt, ganz schwach und friert ständig.“',
      'Vor drei Tagen hat er sich im Garten am Draht eine kleine Wunde am Schienbein geholt.',
      'Diabetiker mit Tabletten – die Wunde hat er „nicht weiter beachtet“.',
    ],
    befund: [
      'Unterschenkel gerötet, heiß, geschwollen, Rötung zieht Richtung Knie',
      'Kleine Wunde mit gelblichem Belag',
      'Fußpulse tastbar, Fuß warm und gut durchblutet',
    ],
    vitals: { puls: 116, rr: [96, 56], spo2: 96, af: 24, temp: 38.9, bz: 210, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls', 'af'],
    distractors: ['Beinvenenthrombose', 'Arterienverschluss', 'Hypoglykämie'],
    explanation:
      'Bei Zuckerkranken heilen Wunden schlecht, Keime breiten sich ungebremst aus. Rote, heiße Haut plus Fieber, schneller Puls und hohe Atemfrequenz zeigen, dass der ganze Körper betroffen ist. Der warme, durchblutete Fuß spricht gegen einen Gefäßverschluss.',
  },
  {
    id: 'blinddarm-schule',
    bild: 'blinddarm',
    difficulty: 1,
    patient: { name: 'Mia Hesse', age: 14, sex: 'w' },
    location: 'Zwickau, Krankenzimmer der Gesamtschule',
    dispatch: 'Schülerin mit Bauchschmerzen im Krankenzimmer, die Lehrerin bittet um Abklärung.',
    scene:
      'Mia liegt zusammengerollt auf der Liege im Krankenzimmer, die Beine angezogen. Die Lehrerin sitzt neben ihr und hat einen Eimer bereitgestellt.',
    anamnese: [
      'Lehrerin: „Sie war heute früh schon ganz blass und hat nichts gegessen.“',
      'Angefangen hat es um den Bauchnabel, inzwischen tut es rechts unten weh.',
      'Seit gestern Abend ist ihr übel, der Appetit ist weg, jeder Schritt tut weh.',
    ],
    befund: [
      'Liegt ganz still, Beine angezogen',
      'Druck- und Loslassschmerz im rechten Unterbauch, Hüpfen tut weh',
      'Letzte Regel vor zwei Wochen, kein Durchfall, kein Brennen beim Wasserlassen',
    ],
    vitals: { puls: 104, rr: [112, 68], spo2: 99, af: 18, temp: 38.1, bz: 92, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Regelschmerzen', 'Magen-Darm-Infekt', 'Harnwegsinfekt'],
    explanation:
      'Der Klassiker: Schmerz am Nabel, der in den rechten Unterbauch wandert, dazu Fieber und Appetitlosigkeit. Schmerz bei Erschütterung, etwa beim Hüpfen, verrät die Reizung des Bauchfells. Patienten ohne Essen lassen und zügig in die Klinik bringen.',
  },
  {
    id: 'blinddarm-buero',
    bild: 'blinddarm',
    difficulty: 3,
    patient: { name: 'Jan Hartmann', age: 31, sex: 'm' },
    location: 'Saarbrücken, Großraumbüro in einem Technologiepark',
    dispatch: 'Mitarbeiter mit Schmerzen in der rechten Seite und im Rücken, Kollegen holen Hilfe.',
    scene:
      'Jan sitzt leicht vornübergebeugt am Schreibtisch und drückt eine Hand in die rechte Seite. Auf dem Tisch stehen kalter Kaffee und ein halbes Brötchen.',
    anamnese: [
      '„Ich dachte erst, ich hätte mir den Magen verdorben, gestern hatte ich weichen Stuhl.“',
      'Dumpfe Schmerzen rechts seitlich Richtung Rücken, die seit heute Morgen stärker werden.',
      'Gestern Abend begann es um den Bauchnabel, dann wanderte der Schmerz nach rechts.',
    ],
    befund: [
      'Druckschmerz rechts seitlich im Unterbauch',
      'Schmerz beim Husten und beim Anheben des rechten Beins',
      'Kein Klopfschmerz im Nierenlager, Urin klar, sitzt still',
    ],
    vitals: { puls: 102, rr: [128, 80], spo2: 98, af: 16, temp: 37.9, bz: 98, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Nierenkolik', 'Magen-Darm-Infekt', 'Rückenschmerzen'],
    explanation:
      'Liegt der Wurmfortsatz hinter dem Blinddarm, sitzt der Schmerz seitlich und im Rücken, und es kann leicht Durchfall geben. Wanderung des Schmerzes, Fieber und fehlender Bewegungsdrang oder Nierenklopfschmerz weisen den Weg. Immer nach dem Beginn des Schmerzes fragen.',
  },
  {
    id: 'galle-grillfest',
    bild: 'galle',
    difficulty: 1,
    patient: { name: 'Ingrid Imhof', age: 47, sex: 'w' },
    location: 'Bamberg, Grillfest in der Kleingartenanlage',
    dispatch: 'Frau auf einem Gartenfest krümmt sich vor Bauchschmerzen.',
    scene:
      'Ingrid sitzt vornübergebeugt auf einer Bierbank vor der Gartenlaube. Auf dem Teller vor ihr liegt eine halb gegessene Bratwurst, die Gäste stehen um sie herum.',
    anamnese: [
      'Gastgeber: „Sie hat gerade Bratwurst und Kartoffelsalat mit viel Mayonnaise gegessen.“',
      'Der Schmerz kommt krampfartig und geht wieder, er sitzt rechts oben unter dem Rippenbogen.',
      'Zieht bis in die rechte Schulter, solche Anfälle hatte sie nach fettigem Essen schon leichter.',
    ],
    befund: ['Druckschmerz im rechten Oberbauch', 'Übelkeit, Haut und Augen nicht gelb', 'Kein Klopfschmerz über den Nieren, keine Brustschmerzen'],
    vitals: { puls: 104, rr: [138, 84], spo2: 98, af: 18, temp: 37.2, bz: 110, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'temp', 'ekg'],
    distractors: ['Herzinfarkt', 'Nierenkolik', 'Magen-Darm-Infekt'],
    explanation:
      'Fettes Essen löst bei Gallensteinen Krämpfe im rechten Oberbauch aus, die in die rechte Schulter ziehen. Fehlendes Fieber spricht gegen eine Entzündung. Wegen der Ausstrahlung und der Übelkeit gehört bei Oberbauchschmerz immer auch ein EKG dazu.',
  },
  {
    id: 'galle-nacht',
    bild: 'galle',
    difficulty: 2,
    patient: { name: 'Hildegard Herold', age: 62, sex: 'w' },
    location: 'Trier, Wohnung in Trier-Süd',
    dispatch: 'Frau hat nachts starke Oberbauchschmerzen und erbricht, der Ehemann ruft an.',
    scene:
      'Hildegard sitzt im Bademantel auf dem Sofa, vor ihr steht eine Schüssel. Ihr Mann hat alle Lichter angemacht und läuft nervös hin und her.',
    anamnese: [
      'Ehemann: „Seit drei Stunden hat sie Schmerzen und muss sich immer wieder übergeben.“',
      'Am Abend gab es Schweinebraten mit Soße, die Schmerzen ziehen in den Rücken.',
      'Heute Nacht hat sie Schüttelfrost bekommen, ihr Mann sagt: „Ihre Augen sind so gelblich.“',
    ],
    befund: [
      'Leicht gelbliche Augäpfel, übergewichtig',
      'Druckschmerz im rechten Oberbauch, stoppt bei tiefer Einatmung',
      'Kein Blut im Erbrochenen, Stuhlgang normal, Brustkorb schmerzfrei',
    ],
    vitals: { puls: 102, rr: [146, 88], spo2: 96, af: 20, temp: 38.6, bz: 126, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Herzinfarkt', 'Magengeschwür', 'Lebensmittelvergiftung'],
    explanation:
      'Fieber und gelbliche Augen zeigen, dass nicht nur ein Stein wandert, sondern sich Gallenblase oder Gallenwege entzündet haben. Übergewicht, Frau über 40 und fettes Essen sind typische Risikofaktoren. Bei Oberbauchschmerz gehört immer ein 12-Kanal-EKG dazu.',
  },
  {
    id: 'ileus-op',
    bild: 'ileus',
    difficulty: 2,
    patient: { name: 'Heinz Hoppe', age: 77, sex: 'm' },
    location: 'Flensburg, Wohnung in der Neustadt',
    dispatch: 'Älterer Mann mit starken Bauchschmerzen, erbricht seit der Nacht.',
    scene:
      'Heinz sitzt gekrümmt im Sessel und hält einen Eimer auf dem Schoß. Seine Frau hat ihm eine Decke umgelegt und wirkt völlig übernächtigt.',
    anamnese: [
      'Ehefrau: „Er erbricht seit heute Nacht, und sein Bauch wird immer dicker.“',
      'Vor etlichen Jahren hatte er eine große Bauchoperation.',
      'Seit drei Tagen kein Stuhlgang, keine Winde mehr, die Schmerzen kommen wellenartig.',
    ],
    befund: [
      'Bauch aufgetrieben und prall, Narbe im Unterbauch',
      'Erbrochenes bräunlich und kotig riechend',
      'Kein Fieber, kein umschriebener Druckschmerz',
    ],
    vitals: { puls: 108, rr: [132, 80], spo2: 94, af: 22, temp: 37.3, bz: 118, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af', 'spo2'],
    distractors: ['Magen-Darm-Infekt', 'Nierenkolik', 'Divertikulitis'],
    explanation:
      'Nach Bauchoperationen können Verwachsungen den Darm abklemmen. Stuhl- und Windverhalt, ein aufgetriebener Bauch und kotiges Erbrechen sind die Schlüssel. Nichts mehr essen oder trinken lassen, Notarzt nachfordern, Klinik mit Chirurgie voranmelden.',
  },
  {
    id: 'ileus-heim',
    bild: 'ileus',
    difficulty: 3,
    patient: { name: 'Irmgard Hinrichs', age: 85, sex: 'w' },
    location: 'Lüneburg, Pflegeheim am Kurpark',
    dispatch: 'Heimbewohnerin teilnahmslos, Pflegekraft meldet Erbrechen und einen harten Bauch.',
    scene:
      'Irmgard liegt teilnahmslos im Bett und schaut an die Decke. Die Pflegekraft hat die Bettdecke zurückgeschlagen, ihr Bauch wölbt sich deutlich vor.',
    anamnese: [
      'Pflegekraft: „Sie isst seit gestern nichts mehr und hat zweimal erbrochen.“',
      'Demenz – klagt nie über Schmerzen, stöhnt aber leise, wenn man den Bauch berührt.',
      'Seit vier Tagen kein Stuhlgang, trägt ein Opioid-Pflaster wegen Rückenschmerzen.',
    ],
    befund: [
      'Bauch hart aufgetrieben, Berührung löst Stöhnen aus',
      'Mund trocken, Erbrochenes bräunlich',
      'Pupillen mittelweit, Atmung nicht verlangsamt',
    ],
    vitals: { puls: 112, rr: [100, 62], spo2: 94, af: 22, temp: 37.4, bz: 124, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af', 'rr'],
    distractors: ['Magen-Darm-Infekt', 'Opioid-Überdosierung', 'Herzinfarkt'],
    explanation:
      'Ältere und Menschen mit Demenz zeigen den Schmerz oft kaum. Opioide lähmen den Darm und fördern einen Verschluss. Ein hartes, aufgetriebenes Abdomen, Erbrechen und der lange Stuhlverhalt zählen mehr als die Aussage „es tut nichts weh“.',
  },
  {
    id: 'gastro-erzieherin',
    bild: 'gastro',
    difficulty: 1,
    patient: { name: 'Anna Holzer', age: 38, sex: 'w' },
    location: 'Halle (Saale), Kita im Paulusviertel',
    dispatch: 'Erzieherin in der Kita beim Aufstehen kollabiert, war kurz weggetreten.',
    scene:
      'Anna sitzt auf dem Flurboden der Kita, eine Kollegin hält ihr ein Glas Wasser hin. Aus dem Gruppenraum hört man die Kinder.',
    anamnese: [
      'Kollegin: „Sie ist beim Aufstehen einfach umgekippt, aber nur kurz weg gewesen.“',
      'Seit gestern früh hat sie Brechdurchfall, so wie viele Kinder in der Gruppe in dieser Woche.',
      'Sie hat kaum etwas getrunken, weil alles sofort wieder herauskommt.',
    ],
    befund: ['Trockener Mund, Haut steht in einer Falte', 'Bauch weich, krampfartige Schmerzen ohne Abwehrspannung', 'Sofort orientiert, kein Zungenbiss'],
    vitals: { puls: 112, rr: [98, 60], spo2: 98, af: 18, temp: 37.9, bz: 88, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'temp'],
    distractors: ['Krampfanfall', 'Hypoglykämie', 'Herzrhythmusstörung'],
    explanation:
      'Erbrechen und Durchfall rauben dem Körper Flüssigkeit, daher der Kollaps beim Aufstehen. Der Hinweis auf viele kranke Kinder und der trockene Mund bringen die Lösung. Hinlegen, Beine hoch lagern und bei Schwindel nicht allein aufstehen lassen.',
  },
  {
    id: 'gastro-grillfest',
    bild: 'gastro',
    difficulty: 2,
    patient: { name: 'Horst Jahnke', age: 52, sex: 'm' },
    location: 'Ingolstadt, Garten eines Einfamilienhauses',
    dispatch: 'Mehrere Gäste einer Familienfeier mit Erbrechen und Durchfall, einer ist besonders schwach.',
    scene:
      'Auf der Terrasse liegen die Reste vom Buffet in der Sonne, mehrere Gäste sitzen blass mit Eimern in Liegestühlen. Horst liegt auf einer Bank und krümmt sich.',
    anamnese: [
      'Schwager: „Mein Bruder liegt schon den ganzen Vormittag flach, bei den anderen ist es ähnlich.“',
      'Acht Stunden nach dem Essen begannen Erbrechen, Durchfall und Bauchkrämpfe.',
      'Es gab Hähnchen vom Grill und Kartoffelsalat, der lange in der Sonne stand – mehrere Gäste sind ebenfalls krank.',
    ],
    befund: ['Wässriger Durchfall, krampfartige Schmerzen', 'Bauch weich, keine Abwehrspannung', 'Trockene Zunge, keine Brustschmerzen'],
    vitals: { puls: 96, rr: [132, 80], spo2: 98, af: 16, temp: 38.3, bz: 104, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['temp', 'puls', 'ekg'],
    distractors: ['Herzinfarkt', 'Blinddarmentzündung', 'Gallenkolik'],
    explanation:
      'Mehrere Erkrankte nach demselben Essen sind der entscheidende Hinweis. Weicher Bauch, normales EKG und Durchfall sprechen gegen einen Herzinfarkt oder eine Entzündung im Bauch. Gruppenerkrankung bedeutet Eigenschutz: Handschuhe und Händehygiene.',
  },
  {
    id: 'pyelo-frau',
    bild: 'pyelo',
    difficulty: 2,
    patient: { name: 'Jasmin Hadžić', age: 27, sex: 'w' },
    location: 'Darmstadt, Wohnung im Martinsviertel',
    dispatch: 'Junge Frau mit hohem Fieber und starken Schmerzen in der Seite.',
    scene:
      'Jasmin liegt in eine Decke gehüllt auf dem Sofa und zittert. Eine Wärmflasche liegt an ihrer rechten Seite, auf dem Tisch steht eine Teetasse.',
    anamnese: [
      'Sie sagt: „Seit gestern Abend habe ich Schüttelfrost, mir ist einfach nur elend.“',
      'Seit Tagen brennt es beim Wasserlassen, sie wollte erst abwarten.',
      'Jetzt dumpfe, gleichbleibende Schmerzen in der rechten Flanke und Fieber.',
    ],
    befund: ['Klopfschmerz im rechten Nierenlager', 'Bauch weich, keine Abwehrspannung', 'Liegt ruhig, kein Bewegungsdrang'],
    vitals: { puls: 108, rr: [118, 70], spo2: 98, af: 18, temp: 39.0, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Blinddarmentzündung', 'Grippaler Infekt', 'Hexenschuss (Lumbago)'],
    explanation:
      'Ein unbehandelter Harnwegsinfekt steigt zur Niere auf: Fieber mit Schüttelfrost, Flankenschmerz und Klopfschmerz im Nierenlager. Anders als bei der Kolik liegt die Patientin ruhig. Auf Schockzeichen achten – bei fallendem Blutdruck droht die Sepsis.',
  },
  {
    id: 'pyelo-schwanger',
    bild: 'pyelo',
    difficulty: 3,
    patient: { name: 'Svetlana Iwanow', age: 31, sex: 'w' },
    location: 'Mannheim, Bäckerei-Filiale an der Fußgängerzone',
    dispatch: 'Schwangere Verkäuferin in der Bäckerei mit Schüttelfrost und Schmerzen in der Seite.',
    scene:
      'Svetlana sitzt auf einem Hocker im Hinterraum, die Filialleiterin hat ihr eine Decke umgelegt. Vorn im Laden warten die Kunden.',
    anamnese: [
      'Filialleiterin: „Heute früh hat sie schon gefröstelt und geschwitzt, wollte aber durchhalten.“',
      'Sie ist in der 28. Schwangerschaftswoche, das Kind bewegt sich normal.',
      'Seit zwei Tagen Brennen beim Wasserlassen und jetzt Schmerzen in der rechten Flanke.',
    ],
    befund: [
      'Klopfschmerz im rechten Nierenlager',
      'Gebärmutter weich, keine Wehen, kein Blutverlust',
      'Gerötetes Gesicht, Schüttelfrost',
    ],
    vitals: { puls: 114, rr: [110, 66], spo2: 97, af: 20, temp: 38.9, bz: 90, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Vorzeitige Wehen', 'Plazentaablösung', 'Grippaler Infekt'],
    explanation:
      'In der Schwangerschaft sind Harnwegsinfekte häufiger und steigen leichter zur Niere auf. Die Gebärmutter ist weich, es blutet nicht, das Kind bewegt sich – das spricht gegen Wehen oder eine Ablösung. Schwangere mit Fieber gehören immer in die Klinik.',
  },
  {
    id: 'gib-teerstuhl',
    bild: 'gib',
    difficulty: 2,
    patient: { name: 'Jürgen Hübner', age: 59, sex: 'm' },
    location: 'Gera, Wohnung in einer Plattenbausiedlung',
    dispatch: 'Mann sehr schwach, ihm wird beim Aufstehen schwarz vor Augen.',
    scene:
      'Jürgen liegt blass auf dem Sofa, seine Frau hat ihm ein Glas Wasser hingestellt. Er traut sich nicht, aufzustehen.',
    anamnese: [
      'Ehefrau: „Er ist seit zwei Tagen kraftlos und schläft nur noch.“',
      'Wegen Rückenschmerzen nimmt er seit Wochen fast täglich Ibuprofen.',
      'Der Stuhl ist seit zwei Tagen schwarz und riecht sehr übel.',
    ],
    befund: [
      'Blasse Haut und Schleimhäute',
      'Stuhl in der Toilette schwarz, glänzend, klebrig',
      'Bauch weich, Druckschmerz im Oberbauch',
      'Keine Atemnot, Beine ohne Schwellung',
    ],
    vitals: { puls: 112, rr: [100, 62], spo2: 96, af: 20, temp: 36.5, bz: 112, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr', 'ekg'],
    distractors: ['Herzinfarkt', 'Herzschwäche', 'Lungenembolie'],
    explanation:
      'Schmerzmittel wie Ibuprofen können die Magenschleimhaut angreifen und eine Blutung auslösen. Schwarzer, übelriechender Stuhl (Teerstuhl) bedeutet verdautes Blut aus dem oberen Magen-Darm-Trakt. Schwäche, Blässe und schneller Puls zeigen den Blutverlust.',
  },
  {
    id: 'gib-varizen',
    bild: 'gib',
    difficulty: 3,
    patient: { name: 'Hermann Jahn', age: 66, sex: 'm' },
    location: 'Würzburg, Gaststätte am Marktplatz',
    dispatch: 'Gast in der Gaststätte erbricht plötzlich viel Blut und sackt zusammen.',
    scene:
      'Hermann sitzt halb auf dem Boden vor seinem Stuhl, auf den Dielen vor ihm breitet sich hellrotes Blut aus. Der Wirt hat die anderen Gäste zurückgedrängt.',
    anamnese: [
      'Wirt: „Er hat nur Mineralwasser getrunken und plötzlich angefangen zu würgen.“',
      'Das Blut ist hellrot und kam in großer Menge, danach wurde er grau im Gesicht.',
      'Leberzirrhose seit Jahren bekannt, er nimmt Medikamente zur Entwässerung.',
    ],
    befund: [
      'Dicker Bauch, gelbliche Augen',
      'Blass, kaltschweißig, schläfrig, aber ansprechbar',
      'Blut nicht gehustet, kein Blut aus der Nase, Atmung ruhig',
    ],
    vitals: { puls: 128, rr: [84, 50], spo2: 92, af: 24, temp: 36.4, bz: 98, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'puls', 'gcs'],
    distractors: ['Lungenblutung', 'Nasenbluten', 'Herzinfarkt'],
    explanation:
      'Bei Leberzirrhose stauen sich Venen in der Speiseröhre und können plötzlich platzen. Es geht um Minuten: Schockzeichen mit hellrotem Bluterbrechen sind lebensbedrohlich. Notarzt nachfordern, Atemweg sichern, Sauerstoff geben, schnell in die Klinik.',
  },
  {
    id: 'hoden-nacht',
    bild: 'hoden',
    difficulty: 2,
    patient: { name: 'Leon Hille', age: 14, sex: 'm' },
    location: 'Kempten (Allgäu), Reihenhaus am Stadtrand',
    dispatch: 'Mutter ruft nachts an: Sohn hat plötzlich starke Unterleibsschmerzen und erbricht.',
    scene:
      'Leon liegt zusammengekrümmt in seinem Bett im Kinderzimmer, ein Eimer steht daneben. Seine Mutter sitzt auf der Bettkante, er schaut weg.',
    anamnese: [
      'Mutter: „Er ist um Mitternacht mit Bauchweh aufgewacht und hat zweimal erbrochen.“',
      'Der Schmerz kam schlagartig vor zwei Stunden, kein Sturz, kein Fieber, nichts Ungewöhnliches gegessen.',
      'Er sagt leise und beschämt: „Es tut da unten links so weh.“',
    ],
    befund: [
      'Linker Hoden hochstehend, geschwollen und sehr druckschmerzhaft',
      'Bauch weich, keine Vorwölbung in der Leiste',
      'Keine Prellmarke, kein Durchfall',
    ],
    vitals: { puls: 104, rr: [126, 74], spo2: 99, af: 18, temp: 36.9, bz: 94, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'temp'],
    distractors: ['Nierenkolik', 'Leistenbruch', 'Magen-Darm-Infekt'],
    explanation:
      'Scham lässt Jungen den eigentlichen Schmerzort verschweigen, sie klagen über „Bauchweh“. Ein plötzlicher Hodenschmerz mit Übelkeit ist bis zum Beweis des Gegenteils eine Hodendrehung – ein Notfall, denn nach wenigen Stunden droht der Verlust des Hodens. Immer auch Hoden und Leiste untersuchen.',
  },
  {
    id: 'hoden-sport',
    bild: 'hoden',
    difficulty: 2,
    patient: { name: 'Emre Ismail', age: 22, sex: 'm' },
    location: 'Augsburg, Umkleide eines Sportstudios',
    dispatch: 'Mann in der Umkleide eines Sportstudios krümmt sich nach dem Training, Schmerzen in der Leiste.',
    scene:
      'Emre sitzt breitbeinig auf einer Bank, ein Handtuch auf dem Schoß, und atmet angespannt. Der Trainer steht neben ihm und weiß nicht weiter.',
    anamnese: [
      'Trainer: „Er hat noch ganz normal trainiert, und plötzlich wurde er grau im Gesicht.“',
      'Der Schmerz kam schlagartig vor vierzig Minuten in der linken Leiste, ihm ist übel.',
      'Kein Schlag, kein Sturz. Der Schmerz zieht in den linken Hoden, aber das wollte er erst nicht sagen.',
    ],
    befund: [
      'Linker Hoden hochgezogen, sehr druckschmerzhaft',
      'Keine Prellmarke, kein blauer Fleck',
      'Keine Vorwölbung in der Leiste, geht nur in kleinen Schritten',
    ],
    vitals: { puls: 102, rr: [138, 84], spo2: 98, af: 18, temp: 36.8, bz: 100, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Nierenkolik', 'Prellung', 'Muskelzerrung in der Leiste'],
    explanation:
      'Die Hodendrehung beginnt oft nach Bewegung und wird als Leistenschmerz geschildert. Weil Männer sich scheuen, den Hoden zu zeigen, wird sie leicht verpasst. Ohne Schlag keine Prellung, ohne Wellen keine Kolik: Hoden immer anschauen und zügig in die Klinik.',
  },
];
