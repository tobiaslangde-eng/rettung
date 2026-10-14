import { AktenBild, AktenFall } from './types';

export const BILDER_ATMUNG: AktenBild[] = [
  {
    id: 'spontanptx',
    diagnosis: 'Spontanpneumothorax (Lungenkollaps)',
    kategorie: 'atmung',
    leitsymptome: [
      'Plötzlicher, einseitiger stechender Brustschmerz mit Luftnot',
      'Abgeschwächtes Atemgeräusch auf der betroffenen Seite',
      'Typisch: junge, große, schlanke Männer und Raucher',
    ],
  },
  {
    id: 'pneumonie',
    diagnosis: 'Lungenentzündung (Pneumonie)',
    kategorie: 'atmung',
    leitsymptome: [
      'Fieber, Husten mit Auswurf, schnelle Atmung',
      'Rasselgeräusche über der betroffenen Lunge, Schmerz beim Einatmen',
      'Bei Älteren oft untypisch: Verwirrtheit, Apathie, kaum Husten',
    ],
  },
  {
    id: 'bolus',
    diagnosis: 'Bolusgeschehen (Fremdkörper in den Atemwegen beim Essen)',
    kategorie: 'atmung',
    leitsymptome: [
      'Plötzliches Würgen oder Husten während des Essens',
      'Hände am Hals, Sprechen unmöglich, Stridor',
      'Auch nach Entfernen des Stücks: Husten, Heiserkeit, Hypoxie',
    ],
  },
  {
    id: 'panik',
    diagnosis: 'Panikattacke',
    kategorie: 'atmung',
    leitsymptome: [
      'Plötzliche Todesangst mit Herzrasen und Beklemmung',
      'Kribbeln, Schwindel, schnelle Atmung – bei normaler Sauerstoffsättigung',
      'Gesunder Patient, oft schon ähnliche Attacken und viel Stress',
    ],
  },
  {
    id: 'rauchgas',
    diagnosis: 'Rauchgasvergiftung (Inhalationstrauma)',
    kategorie: 'atmung',
    leitsymptome: [
      'Ruß an Mund und Nase, verrußte Nasenhaare, rußiger Auswurf',
      'Husten, Heiserkeit, Atemnot oder pfeifendes Atemgeräusch',
      'Kopfschmerz, Verwirrtheit; SpO₂ ist trügerisch normal',
    ],
  },
];

export const AKTEN_ATMUNG: AktenFall[] = [
  // --- Asthma ---
  {
    id: 'asthma-kind',
    bild: 'asthma',
    difficulty: 1,
    patient: { name: 'Clara Czerny', age: 8, sex: 'w' },
    location: 'Erfurt, Sportplatz am Nordpark',
    dispatch: 'Kind beim Training bekommt schlecht Luft und pfeift beim Atmen.',
    scene:
      'Clara sitzt auf einer Bank am Spielfeldrand, die Trainerin hat ihr eine Jacke umgelegt. Man hört das Pfeifen schon aus einigen Metern Entfernung.',
    anamnese: [
      '„Beim Fangenspielen ging es auf einmal nicht mehr“, sagt die Trainerin. Es ist ein warmer Frühsommertag.',
      'Die Mutter: „Gerade ist Gräserpollenzeit, da hat sie es oft schwerer.“',
      'Clara hat ein Notfallspray, aber „das liegt zu Hause in der Schultasche“. Sie spricht nur in Halbsätzen.',
    ],
    befund: ['Pfeifendes Atemgeräusch beim Ausatmen', 'Sitzt aufrecht, stützt die Hände auf die Knie', 'Keine Quaddeln, keine Schwellung im Gesicht'],
    vitals: { puls: 130, rr: [108, 66], spo2: 93, af: 32, temp: 36.7, bz: 98, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['af', 'puls', 'spo2'],
    distractors: ['Anaphylaktische Reaktion', 'Fremdkörperaspiration', 'Hyperventilationssyndrom'],
    explanation:
      'Pfeifen beim Ausatmen und Pollenflug bei einem Kind mit bekannter Neigung: ein typischer Anfall. Bei Kindern immer die Kinder-Normwerte anlegen – AF 32 und Puls 130 sind für eine Achtjährige zu hoch. Beruhigend einwirken, aufrecht sitzen lassen, Notarzt nachfordern, wenn sie nur Halbsätze spricht.',
  },
  {
    id: 'asthma-silent',
    bild: 'asthma',
    difficulty: 3,
    patient: { name: 'Edith Dreyer', age: 52, sex: 'w' },
    location: 'Chemnitz, Wohnung im Stadtteil Sonnenberg',
    dispatch: 'Frau sitzt erschöpft in der Küche, die Tochter sagt, sie bekommt keine Luft mehr.',
    scene:
      'Edith sitzt still am Küchentisch und stützt die Arme auf. Kein Pfeifen, kein Röcheln – nur ihre Schultern bewegen sich bei jedem flachen Atemzug. Die Tochter ist in Tränen aufgelöst.',
    anamnese: [
      'Tochter: „Mama hat seit einer Woche eine Erkältung und hustet nachts ohne Ende.“',
      'Sie hat ihr Notfallspray heute schon viele Male benutzt – „es hilft einfach nicht mehr“.',
      'Seit Jahren Dauertherapie mit Sprays, zweimal deswegen schon im Krankenhaus. Jetzt wird sie immer ruhiger und müder.',
    ],
    befund: [
      'Kaum Atemgeräusch über der Lunge hörbar',
      'Kann nur einzelne Worte sprechen, wirkt erschöpft und verlangsamt',
      'Bläuliche Lippen, Halsmuskeln arbeiten bei der Atmung mit',
      'Keine Beinschwellung, kein Rasseln über der Lunge',
    ],
    vitals: { puls: 128, rr: [138, 86], spo2: 84, af: 26, temp: 37.4, bz: 128, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'gcs', 'puls'],
    distractors: ['Panikattacke', 'Akute Herzinsuffizienz mit Lungenödem', 'Lungenembolie'],
    explanation:
      'Hier ist die Stille das Alarmzeichen: Wenn kaum noch Luft durch die verengten Bronchien kommt, hört man weder Pfeifen noch Atemgeräusch. Müdigkeit, Erschöpfung und niedrige Sättigung zeigen den lebensbedrohlichen Anfall. Sofort Notarzt nachfordern, aufrecht lagern, Sauerstoff geben.',
    leitsymptome: [
      '„Stille Lunge“: kaum noch Atemgeräusch trotz schwerer Atemnot',
      'Erschöpfung, Sprechen nur in Einzelworten, Bewusstsein eingetrübt',
      'Bekannte Vorerkrankung, Spray wirkt nicht mehr',
    ],
  },

  // --- COPD ---
  {
    id: 'copd-heim',
    bild: 'copd',
    difficulty: 2,
    patient: { name: 'Hannelore Dunkel', age: 79, sex: 'w' },
    location: 'Rostock, Seniorenheim am Stadthafen',
    dispatch: 'Heimbewohnerin mit Husten und zunehmender Atemnot, Pflegedienst fordert RTW an.',
    scene:
      'Hannelore sitzt auf der Bettkante, die Unterarme auf die Oberschenkel gestützt, die Schultern hochgezogen. Auf dem Nachttisch liegen zwei Inhalatoren und ein Taschentuchstapel.',
    anamnese: [
      'Pflegekraft: „Frau Dunkel ist sonst selbständig, heute hat sie nicht mal mehr den Gang zum Speisesaal geschafft.“',
      'Seit drei Tagen Husten mit gelbem Auswurf, seit gestern Abend fühlt sie sich heiß an.',
      'Lungenkrank seit vielen Jahren, früher 40 Jahre lang geraucht, morgens und abends Inhalationsspray.',
    ],
    befund: [
      'Sitzt im Kutschersitz, atmet gegen leicht geschlossene Lippen aus',
      'Lippen bläulich, Brustkorb fassförmig',
      'Brummende und pfeifende Atemgeräusche, verlängerte Ausatmung',
      'Keine Beinschwellung',
    ],
    vitals: { puls: 108, rr: [138, 80], spo2: 84, af: 28, temp: 38.1, bz: 118, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'temp'],
    distractors: ['Akute Herzinsuffizienz mit Lungenödem', 'Lungenembolie', 'Hyperventilationssyndrom'],
    explanation:
      'Kutschersitz, Lippenbremse, jahrelanges Rauchen und ein Infekt mit gelbem Auswurf: Die Lungenerkrankung hat sich verschlechtert. SpO₂ 84 % ist hier zwar zu niedrig, aber Patienten mit dieser Erkrankung haben einen niedrigeren Zielbereich (etwa 88–92 %). Sauerstoff vorsichtig steuern, Notarzt nachfordern.',
  },
  {
    id: 'copd-schlaefrig',
    bild: 'copd',
    difficulty: 3,
    patient: { name: 'Egon Dahlke', age: 74, sex: 'm' },
    location: 'Emden, Wohnung am Stadtgarten',
    dispatch: 'Älterer Mann wird immer müder und reagiert kaum noch, Sauerstoffgerät läuft.',
    scene:
      'Egon sitzt mit Nasenbrille im Sessel, der Kopf sinkt immer wieder auf die Brust. Der Sauerstoffkonzentrator neben ihm brummt laut – der Regler steht auf dem Höchstwert.',
    anamnese: [
      'Tochter: „Papa hatte in der Nacht schlecht Luft, wir wollten ihm helfen.“',
      '„Wir haben das Gerät ganz aufgedreht, damit er mehr Sauerstoff bekommt.“ Seitdem wird er immer schläfriger.',
      'Schwer lungenkrank, bekommt normalerweise nur einen niedrigen Sauerstofffluss, früher starker Raucher.',
    ],
    befund: [
      'Schwer weckbar, öffnet auf Ansprache nur kurz die Augen',
      'Flache, sehr langsame Atmung, rosige Lippen',
      'Haut warm und gerötet, Hände zittern grobschlägig',
      'Pupillen mittelweit, seitengleich; Gesicht symmetrisch',
    ],
    vitals: { puls: 92, rr: [150, 85], spo2: 99, af: 9, temp: 36.9, bz: 122, gcs: 11, ekg: 'Sinusrhythmus' },
    keyVitals: ['af', 'gcs', 'spo2'],
    distractors: ['Schlaganfall', 'Hypoglykämie (Unterzuckerung)', 'Opioid-Überdosis'],
    explanation:
      'Bei dieser Lungenerkrankung wird die Atmung manchmal vom Sauerstoffmangel angetrieben. Zu viel Sauerstoff bremst sie, das Kohlendioxid staut sich und macht schläfrig (CO₂-Narkose). Hohe Sättigung und rosige Lippen sind hier kein Entwarnungszeichen. Sauerstoff nur nach Zielwert dosieren, Notarzt nachfordern.',
    leitsymptome: [
      'Zunehmende Schläfrigkeit mit sehr langsamer, flacher Atmung',
      'Sehr hohe SpO₂ nach zu viel Sauerstoff, rosige Lippen',
      'Bekannte schwere Lungenerkrankung mit Sauerstofftherapie',
    ],
  },

  // --- Hyperventilation ---
  {
    id: 'hyperventilation-aufzug',
    bild: 'hyperventilation',
    difficulty: 1,
    patient: { name: 'Daniel Eichhorn', age: 31, sex: 'm' },
    location: 'Düsseldorf, Bürohochhaus am Hafen',
    dispatch: 'Mann nach Aufzugstörung außer Atem, hat Krämpfe in den Händen.',
    scene:
      'Die Feuerwehr hat die Kabine gerade geöffnet. Daniel hockt auf dem Boden des Flurs, die Krawatte ist aufgerissen, er atmet hastig und tief.',
    anamnese: [
      'Kollegin: „Wir haben fast eine halbe Stunde im Aufzug festgesteckt, das Licht ist ausgegangen.“',
      '„Enge Räume machen mir schon lange Angst – ich dachte, ich ersticke.“',
      'Kribbeln um den Mund und in den Fingern, die Hände „ziehen sich zusammen“. Sonst gesund.',
    ],
    befund: [
      'Schnelle, tiefe Atemzüge',
      'Pfötchenstellung beider Hände',
      'Lunge frei, kein Pfeifen oder Rasseln',
      'Lippen rosig, Haut warm',
    ],
    vitals: { puls: 112, rr: [138, 86], spo2: 99, af: 34, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['af', 'puls'],
    distractors: ['Akuter Asthmaanfall', 'Lungenembolie', 'Akuter Herzinfarkt (STEMI)'],
    explanation:
      'Zu schnelles, tiefes Atmen löst Kribbeln und Verkrampfung aus, die „Pfötchenstellung“ ist das Schlüsselzeichen. Die SpO₂ bleibt normal, die Lunge ist frei. Ruhig sprechen, Sicherheit geben, zu langsamer Atmung anleiten; bei Zweifeln oder Risikopatienten trotzdem weiter abklären.',
  },
  {
    id: 'hyperventilation-konzert',
    bild: 'hyperventilation',
    difficulty: 1,
    patient: { name: 'Elif Demir', age: 15, sex: 'w' },
    location: 'Würzburg, Open-Air-Konzert im Ringpark',
    dispatch: 'Jugendliche im Publikum bricht fast zusammen, kann nicht mehr richtig atmen.',
    scene:
      'Die Sanitätswache hat Elif aus der Menge geholt. Sie sitzt auf einer Trage, ihre Freundinnen stehen dicht daneben. Von der Bühne dröhnt laute Musik.',
    anamnese: [
      'Freundin: „Sie hat vorhin geweint, weil es Streit mit ihrem Freund gab.“',
      'Im Gedränge vor der Bühne wurde ihre Atmung immer schneller. Dann kam das Kribbeln.',
      'Keine Vorerkrankungen, keine Allergien, nimmt keine Medikamente und hat nichts Besonderes gegessen.',
    ],
    befund: [
      'Schnelle, tiefe Atmung, Hände verkrampft',
      'Kein Giemen, kein Husten',
      'Keine Hautveränderungen, keine Schwellung im Gesicht',
      'Aufgewühlt, aber klar ansprechbar',
    ],
    vitals: { puls: 110, rr: [122, 76], spo2: 100, af: 30, temp: 36.7, bz: 92, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['af', 'puls'],
    distractors: ['Akuter Asthmaanfall', 'Anaphylaktischer Schock', 'Hitzschlag'],
    explanation:
      'Aufregung, Gedränge und vorheriges Weinen sind klassische Auslöser. Kribbeln, verkrampfte Hände und eine perfekte SpO₂ von 100 % sprechen gegen eine Lungenerkrankung. Aus dem Gedränge herausholen, ruhig und freundlich sprechen, Atemrhythmus mit ihr üben.',
  },

  // --- Lungenembolie ---
  {
    id: 'le-pille',
    bild: 'le',
    difficulty: 2,
    patient: { name: 'Carina Dobler', age: 29, sex: 'w' },
    location: 'Karlsruhe, Büro in der Innenstadt',
    dispatch: 'Junge Frau im Büro mit plötzlicher Atemnot und Schmerzen in der Brust.',
    scene:
      'Carina steht über ihren Schreibtisch gebeugt und hält sich die rechte Seite. Eine Kollegin stützt sie am Arm, auf dem Bildschirm läuft noch eine Tabelle.',
    anamnese: [
      '„Eben saß ich noch ganz normal am Computer, dann ging es plötzlich nicht mehr.“',
      'Stechender Schmerz rechts beim tiefen Einatmen. Gestern kam sie von einer langen Busreise zurück.',
      'Nimmt die Pille, raucht seit Jahren. Die rechte Wade ist seit zwei Tagen dick und tut weh.',
    ],
    befund: [
      'Rechte Wade geschwollen, überwärmt und druckschmerzhaft',
      'Linkes Bein unauffällig',
      'Flache, schnelle Atmung, Lunge frei, kein Giemen',
      'Kein Husten, kein Auswurf',
    ],
    vitals: { puls: 118, rr: [124, 78], spo2: 91, af: 26, temp: 37.2, bz: 94, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'puls', 'af'],
    distractors: ['Lungenentzündung (Pneumonie)', 'Spontanpneumothorax (Lungenkollaps)', 'Panikattacke'],
    explanation:
      'Pille, Rauchen, lange Busreise und ein dickes, schmerzendes Bein: Ein Blutgerinnsel aus der Beinvene ist in die Lunge gewandert. Die niedrige SpO₂ passt nicht zu einer Panikattacke. Bei Atemnot immer nach Beinschwellung und Risikofaktoren fragen; flach lagern oder Oberkörper hoch, Notarzt nachfordern.',
  },
  {
    id: 'le-reha',
    bild: 'le',
    difficulty: 3,
    patient: { name: 'Erwin Dittrich', age: 70, sex: 'm' },
    location: 'Bad Kissingen, Reha-Klinik am Kurpark',
    dispatch: 'Patient im Reha-Zimmer beim Aufstehen kollabiert, jetzt wach und kurzatmig.',
    scene:
      'Erwin liegt auf dem Boden neben dem Bett, eine Pflegekraft hat ihm ein Kissen unter den Kopf gelegt. Er ist blass, die Stirn ist feucht, die Gehstützen liegen daneben.',
    anamnese: [
      'Pflegekraft: „Er wollte zur Toilette, stand auf und sackte nach ein paar Sekunden weg. Wir haben ihn aufgefangen.“',
      '„Seit heute Morgen krieg ich kaum Luft, ein Druck auf der Brust, aber kein richtiger Schmerz.“',
      'Hüftprothese vor neun Tagen, seitdem viel gelegen. Sonst nur Bluthochdruck bekannt.',
    ],
    befund: [
      'Blass, kaltschweißig, Atmung schnell und flach',
      'Beine ohne Schwellung und ohne Druckschmerz',
      'Halsvenen gestaut, Lunge frei',
      'OP-Wunde trocken, Verband sauber',
    ],
    vitals: {
      puls: 124,
      rr: [98, 60],
      spo2: 85,
      af: 28,
      temp: 37.3,
      bz: 118,
      gcs: 15,
      ekg: 'Rechtsherzbelastung (S1Q3T3), Sinustachykardie',
    },
    keyVitals: ['spo2', 'rr', 'ekg'],
    distractors: ['Kreislaufkollaps (Synkope)', 'Akuter Herzinfarkt (STEMI)', 'Akute Herzinsuffizienz mit Lungenödem'],
    explanation:
      'Neun Tage nach einer Hüft-OP ist das Risiko für Gerinnsel hoch, auch wenn die Beine unauffällig aussehen. Kollaps, niedrige SpO₂, niedriger Blutdruck und Zeichen der Rechtsherzbelastung im EKG sprechen für eine große Lungenembolie. Nicht aufstehen lassen, Notarzt nachfordern, kontinuierlich überwachen.',
    leitsymptome: [
      'Plötzliche Luftnot oder Kollaps nach Operation und Bettruhe',
      'Niedrige SpO₂ bei freier Lunge, Blutdruckabfall',
      'Beine können unauffällig sein; EKG: Rechtsherzbelastung',
    ],
  },

  // --- Spontanpneumothorax ---
  {
    id: 'spontanptx-student',
    bild: 'spontanptx',
    difficulty: 2,
    patient: { name: 'Dominik Eisenhauer', age: 22, sex: 'm' },
    location: 'Tübingen, Mensa der Universität',
    dispatch: 'Student in der Mensa mit plötzlichen Brustschmerzen und Luftnot.',
    scene:
      'Dominik sitzt vor einem halb leeren Tablett und beugt sich leicht zur linken Seite. Er ist sehr groß und schlank und atmet vorsichtig, als ob jeder Atemzug weh tut.',
    anamnese: [
      '„Ich habe nur mein Tablett getragen, und plötzlich hat es links in der Brust gestochen.“',
      'Seitdem Luftnot und ein trockener Reizhusten. Kein Sturz, kein Schlag gegen den Brustkorb.',
      'Raucht seit Jahren eine Schachtel am Tag, sonst gesund, keine Medikamente.',
    ],
    befund: [
      'Atemgeräusch links abgeschwächt, rechts normal',
      'Linke Brustkorbseite hebt sich beim Atmen weniger',
      'Keine Beinschwellung, Halsvenen nicht gestaut',
      'Haut rosig, kein Fieber',
    ],
    vitals: { puls: 102, rr: [128, 78], spo2: 93, af: 24, temp: 36.8, bz: 88, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Akuter Herzinfarkt (STEMI)', 'Lungenembolie', 'Lungenentzündung (Pneumonie)'],
    explanation:
      'Ein junger, großer, schlanker Raucher mit plötzlichem einseitigem Stechen und abgeschwächtem Atemgeräusch: typisch für einen kollabierten Lungenflügel. Der Kreislauf ist noch stabil. Atemgeräusche immer seitenvergleichend abhören, Oberkörper hoch lagern, Notarzt nachfordern und Verlauf engmaschig beobachten.',
  },
  {
    id: 'spontanptx-schueler',
    bild: 'spontanptx',
    difficulty: 2,
    patient: { name: 'Elias Ehrlich', age: 17, sex: 'm' },
    location: 'Cottbus, Turnhalle der Gesamtschule',
    dispatch: 'Schüler im Sportunterricht klagt über anhaltende Schmerzen in der Seite und Atemnot.',
    scene:
      'Elias sitzt auf einer Turnbank und stützt sich an der Wand ab. Der Lehrer steht daneben und winkt ab: „Das ist nur Seitenstechen.“ Die Klasse spielt weiter.',
    anamnese: [
      'Lehrer: „Er hat sich nicht richtig aufgewärmt, das ist normales Seitenstechen.“',
      'Das Stechen sitzt rechts, ist beim Einatmen am schlimmsten und lässt seit über einer halben Stunde nicht nach.',
      'In einem Jahr 15 Zentimeter gewachsen, sonst gesund. Beim Treppensteigen zur Umkleide muss er stehen bleiben.',
    ],
    befund: [
      'Atemgeräusch rechts leiser als links',
      'Schmerz bei tiefer Einatmung, flaches Atmen',
      'Kein Sturz, keine Prellmarke am Brustkorb',
      'Kein Pfeifen, keine Kribbelgefühle',
    ],
    vitals: { puls: 98, rr: [124, 76], spo2: 94, af: 22, temp: 36.7, bz: 91, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['spo2', 'af'],
    distractors: ['Rippenprellung', 'Akuter Asthmaanfall', 'Hyperventilationssyndrom'],
    explanation:
      'Normales Seitenstechen vergeht nach kurzer Ruhe. Ein Schmerz, der nicht aufhört, mit Luftnot beim Treppensteigen und leiserem Atemgeräusch auf einer Seite spricht für einen kollabierten Lungenflügel, vor allem bei einem schnell gewachsenen, schlanken Jugendlichen. Sport beenden, Notarzt oder Klinik.',
  },

  // --- Pneumonie ---
  {
    id: 'pneumonie-handwerker',
    bild: 'pneumonie',
    difficulty: 1,
    patient: { name: 'Dieter Ebersbach', age: 64, sex: 'm' },
    location: 'Saarbrücken, Wohnung im Stadtteil St. Johann',
    dispatch: 'Mann mit hohem Fieber, Schüttelfrost und schwerer Atmung. Ehefrau ruft an.',
    scene:
      'Dieter liegt unter zwei Decken im Bett und zittert. Auf dem Nachttisch stapeln sich Taschentücher, daneben liegt der Arbeitsplan eines Fliesenlegers.',
    anamnese: [
      'Ehefrau: „Er wollte trotzdem noch auf die Baustelle, aber heute früh ging gar nichts mehr.“',
      'Seit fünf Tagen Husten, erst trocken, jetzt mit grünlichem Auswurf. Seit gestern Abend Schüttelfrost.',
      'Rechts beim Einatmen ein stechender Schmerz. Raucht seit 40 Jahren, sonst keine Lungenkrankheiten.',
    ],
    befund: [
      'Heißes, gerötetes Gesicht, Schüttelfrost',
      'Rasselgeräusche über der rechten Lunge, links frei',
      'Schmerz rechts beim tiefen Einatmen',
      'Kein Giemen, keine Beinschwellung',
    ],
    vitals: { puls: 108, rr: [134, 80], spo2: 90, af: 26, temp: 39.4, bz: 112, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'spo2', 'af'],
    distractors: ['Lungenembolie', 'Akute Herzinsuffizienz mit Lungenödem', 'Akuter Asthmaanfall'],
    explanation:
      'Fieber, Schüttelfrost, grüner Auswurf und einseitige Rasselgeräusche sind das Lehrbuchbild einer Lungenentzündung. Ohne Beinschwellung und Giemen passen die anderen Verdachtsdiagnosen schlechter. Oberkörper hoch lagern, Sauerstoff nach Bedarf, Klinikeinweisung.',
  },
  {
    id: 'pneumonie-heim',
    bild: 'pneumonie',
    difficulty: 3,
    patient: { name: 'Elfriede Dahms', age: 85, sex: 'w' },
    location: 'Oldenburg, Seniorenzentrum am Schlossgarten',
    dispatch: 'Heimbewohnerin seit gestern teilnahmslos und verwirrt, trinkt kaum.',
    scene:
      'Elfriede liegt auf der Seite im Bett und reagiert nur zögernd auf Ansprache. Das Frühstück auf dem Tisch ist unberührt, die Tasse Tee kalt.',
    anamnese: [
      'Pflegekraft: „Sonst läuft sie mit dem Rollator zum Essen, seit gestern Abend ist sie wie ausgewechselt.“',
      'Heute Morgen wusste sie nicht mehr, wo sie ist. Husten gibt es kaum, Schmerzen nennt sie keine.',
      'Bekannt sind Bluthochdruck und leichte Herzschwäche. Vor einer Woche hatte sie einen Schnupfen.',
    ],
    befund: [
      'Schnelle, flache Atmung, Nasenflügel bewegen sich',
      'Feinblasige Rasselgeräusche rechts unten',
      'Gesicht symmetrisch, Arme gleich kräftig',
      'Unterbauch weich, kein Harnverhalt',
    ],
    vitals: { puls: 106, rr: [112, 64], spo2: 89, af: 28, temp: 37.8, bz: 132, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'gcs'],
    distractors: ['Schlaganfall', 'Exsikkose (Flüssigkeitsmangel)', 'Harnwegsinfekt'],
    explanation:
      'Bei sehr alten Menschen fehlen oft Husten und hohes Fieber. Stattdessen fallen Verwirrtheit, Apathie und Trinkunlust auf. Der Schlüssel sind die schnelle Atmung, die niedrige SpO₂ und die Rasselgeräusche. Bei plötzlicher Veränderung im Heim immer SpO₂ und Atemfrequenz messen.',
    leitsymptome: [
      'Plötzliche Verwirrtheit und Apathie ohne klaren Auslöser',
      'Schnelle Atmung mit niedriger SpO₂',
      'Rasselgeräusche; Husten und hohes Fieber fehlen oft',
    ],
  },

  // --- Bolusgeschehen ---
  {
    id: 'bolus-restaurant',
    bild: 'bolus',
    difficulty: 1,
    patient: { name: 'Dietmar Eckert', age: 67, sex: 'm' },
    location: 'Trier, Restaurant am Hauptmarkt',
    dispatch: 'Gast im Restaurant hat sich verschluckt, bekommt keine Luft. Gäste helfen.',
    scene:
      'Dietmar sitzt vornübergebeugt auf einem Stuhl, um ihn herum stehen Gäste und der Wirt. Auf dem Tisch liegt ein halb gegessenes Steak. Er hustet kräftig und ringt nach Luft.',
    anamnese: [
      'Der Wirt: „Er hat sich ans Essen gesetzt und mit seinen Freunden gelacht.“',
      'Plötzlich Würgen, die Hände am Hals, Sprechen war unmöglich. Ein Gast hat von hinten den Heimlich-Handgriff gemacht – das Stück kam heraus.',
      '„Jetzt kratzt es im Hals.“ Vorerkrankung: Bluthochdruck, keine Allergien, kein Brustschmerz.',
    ],
    befund: [
      'Kräftiger Husten, heisere Stimme',
      'Rotes Gesicht, Lippen leicht bläulich',
      'Atemgeräusch beidseits, kein Pfeifen',
      'Keine Quaddeln, Zunge und Lippen nicht geschwollen',
    ],
    vitals: { puls: 104, rr: [156, 92], spo2: 91, af: 22, temp: 36.6, bz: 118, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'puls', 'af'],
    distractors: ['Anaphylaktischer Schock', 'Akuter Herzinfarkt (STEMI)', 'Akuter Asthmaanfall'],
    explanation:
      'Plötzliches Würgen beim Essen mit Händen am Hals und Sprechunfähigkeit ist das typische Bild. Auch wenn das Stück heraus ist, können Rest-Teile in den Atemwegen verblieben sein, die SpO₂ ist noch niedrig. Weiterbeobachten, Sauerstoff, Klinik zur Kontrolle – auch Bauchverletzungen nach dem Handgriff bedenken.',
  },
  {
    id: 'bolus-heim',
    bild: 'bolus',
    difficulty: 2,
    patient: { name: 'Edelgard Dräger', age: 80, sex: 'w' },
    location: 'Flensburg, Seniorenzentrum am Hafen',
    dispatch: 'Bewohnerin beim Abendessen plötzlich blass, kann nicht sprechen, Hustenanfälle.',
    scene:
      'Im Speisesaal sitzt Edelgard aufrecht am Tisch, die Hände am Hals. Auf ihrem Teller liegen Brötchenreste. Die Mitbewohner sind still geworden, eine Pflegekraft steht hinter ihr.',
    anamnese: [
      'Pflegekraft: „Sie hat ein Brötchenstück im Mund gehabt, dann war sie plötzlich ganz still.“',
      '„Ich habe ihr mehrmals kräftig auf den Rücken geschlagen, dann kam ein Stück heraus.“',
      'Seitdem Hustenanfälle und ein ziehendes Geräusch beim Einatmen. Sie hatte keinen Husten und kein Fieber vorher.',
    ],
    befund: [
      'Ziehendes Atemgeräusch beim Einatmen (Stridor)',
      'Hustenanfälle, Lippen bläulich',
      'Gesicht symmetrisch, Arme gleich kräftig',
      'Keine Hautveränderungen, Zunge nicht geschwollen',
    ],
    vitals: { puls: 112, rr: [148, 86], spo2: 88, af: 28, temp: 36.7, bz: 130, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Schlaganfall', 'Akute Herzinsuffizienz mit Lungenödem', 'Lungenentzündung (Pneumonie)'],
    explanation:
      'Beginn mitten im Essen, stumme Atemnot, Hände am Hals und danach Stridor weisen auf ein Bolusgeschehen. Auch nach erfolgreichem Rückenschlag können Reste stecken – die niedrige SpO₂ zeigt es. Notarzt nachfordern, Sauerstoff, ruhig halten und nichts mehr zu essen oder trinken geben.',
  },

  // --- Panikattacke ---
  {
    id: 'panik-ubahn',
    bild: 'panik',
    difficulty: 1,
    patient: { name: 'Elena Cvetković', age: 29, sex: 'w' },
    location: 'Nürnberg, U-Bahnhof am Hauptbahnhof',
    dispatch: 'Frau am Bahnsteig mit Herzrasen und Todesangst.',
    scene:
      'Elena sitzt auf einer Bank am Bahnsteig, eine Passantin hält ihre Hand. Sie presst die andere Hand auf die Brust und blickt immer wieder zur Tunnelöffnung.',
    anamnese: [
      '„Beim Einsteigen ging es los – mein Herz raste, und ich dachte, ich sterbe.“',
      'Beklemmung in der Brust, Kribbeln in den Händen und rund um den Mund.',
      'Solche Anfälle hatte sie schon dreimal, auch in vollen Bahnen. Beim Arzt wurde nichts gefunden.',
    ],
    befund: [
      'Ängstlich, zittrig, feuchte Hände',
      'Schnelle Atmung, Lunge frei, Lippen rosig',
      'Puls regelmäßig, keine Beinschwellung',
    ],
    vitals: { puls: 118, rr: [136, 84], spo2: 99, af: 26, temp: 36.8, bz: 90, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af'],
    distractors: ['Akuter Herzinfarkt (STEMI)', 'Lungenembolie', 'Vorhofflimmern mit schneller Überleitung'],
    explanation:
      'Todesangst, Herzrasen und Kribbeln in einer Menge, schon ähnliche Anfälle und völlig normale Messwerte: typisch für eine Panikattacke. Der regelmäßige Puls spricht gegen Vorhofflimmern. Ernst nehmen, ruhig bleiben, aus dem Trubel herausbringen und trotzdem EKG schreiben, bevor man sie ausschließt.',
  },
  {
    id: 'panik-buero',
    bild: 'panik',
    difficulty: 2,
    patient: { name: 'Christian Dreher', age: 35, sex: 'm' },
    location: 'Magdeburg, Büro im Verwaltungsgebäude',
    dispatch: 'Mann im Büro mit Druck auf der Brust. Kollegen vermuten einen Herzinfarkt.',
    scene:
      'Christian sitzt im Konferenzraum, der Beamer wirft noch die erste Folie an die Wand. Er hält sich den Hemdkragen auf, die Kollegen stehen aufgeregt um ihn herum.',
    anamnese: [
      'Kollege: „Eben wollte er die Präsentation für den Chef halten, da wurde er auf einmal ganz weiß.“',
      '„Es drückt auf der Brust, mir ist schwindlig, und meine Finger sind taub.“',
      'Nichtraucher, keine Vorerkrankungen, keine Medikamente. Seit Wochen viel Stress und kaum Schlaf.',
    ],
    befund: [
      'Unruhig, zittrig, schwitzige Hände',
      'Beschleunigte Atmung, beide Hände kribbeln gleichermaßen',
      'Sprache klar, Gesicht symmetrisch, Arme gleich kräftig',
      'Schmerz nicht ausstrahlend, nicht belastungsabhängig',
    ],
    vitals: { puls: 96, rr: [148, 92], spo2: 99, af: 24, temp: 36.9, bz: 104, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'af', 'ekg'],
    distractors: ['Akuter Herzinfarkt (STEMI)', 'Hypertensiver Notfall', 'Schlaganfall'],
    explanation:
      'Druck auf der Brust, Schwindel und taube Finger sehen nach Herzinfarkt aus, doch das EKG ist unauffällig, es gibt keine Risikofaktoren und der Auslöser ist klar: Stress vor einer Präsentation. Auch eine Panikattacke gehört ernst genommen. Immer EKG schreiben und Herzinfarkt aktiv ausschließen.',
  },

  // --- Rauchgasvergiftung ---
  {
    id: 'rauchgas-wohnung',
    bild: 'rauchgas',
    difficulty: 2,
    patient: { name: 'Dorothea Eisele', age: 44, sex: 'w' },
    location: 'Kaiserslautern, Mehrfamilienhaus in der Innenstadt',
    dispatch: 'Frau von der Feuerwehr aus verrauchtem Treppenhaus gerettet, hustet.',
    scene:
      'Dorothea sitzt in eine Decke gehüllt vor dem Haus. Die Feuerwehr löscht im Treppenhaus einen Containerbrand. Um ihren Mund und die Nase liegt dunkler Ruß.',
    anamnese: [
      '„Ich bin durch den Qualm nach unten gelaufen, das waren bestimmt zwei Minuten.“',
      'Brennen im Hals, trockener Husten, seit kurzem Kopfschmerzen und leichte Übelkeit.',
      'Nichtraucherin, gesund, keine Dauermedikamente. Seit dem Brand ist ihre Stimme rau.',
    ],
    befund: [
      'Ruß um Mund und Nase, Husten',
      'Heisere Stimme, kein Giemen',
      'Keine Verbrennungen an Haut und Haaren',
      'Lippen rosig, wach und orientiert',
    ],
    vitals: { puls: 96, rr: [132, 82], spo2: 98, af: 22, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['af', 'spo2', 'puls'],
    distractors: ['Akuter Asthmaanfall', 'Verbrennung 2. Grades', 'Panikattacke'],
    explanation:
      'Ruß um den Mund, Heiserkeit und Kopfschmerz nach Aufenthalt im Rauch: Die Sättigung von 98 % täuscht, denn das Pulsoximeter erkennt Kohlenmonoxid am Blutfarbstoff nicht. Auch ohne Verbrennungen Sauerstoff geben, Atemwege beobachten und in eine Klinik bringen.',
  },
  {
    id: 'rauchgas-keller',
    bild: 'rauchgas',
    difficulty: 3,
    patient: { name: 'Emre Dursun', age: 38, sex: 'm' },
    location: 'Halle (Saale), Mehrfamilienhaus in der Südstadt',
    dispatch: 'Kellerbrand im Mehrfamilienhaus, Bewohner wird benommen aus dem Hof geführt.',
    scene:
      'Emre sitzt auf den Stufen im Hof, sein Gesicht und seine Kleidung sind rußgeschwärzt. Die Feuerwehr bekämpft den Brand im Keller. Man hört ein pfeifendes Geräusch bei seinen Atemzügen.',
    anamnese: [
      'Feuerwehrmann: „Er war mindestens fünf Minuten im dichten Qualm, weil er den Hund retten wollte.“',
      'Seit kurzem wird die Stimme heiser, er hustet schwarzen Schleim.',
      '„Mir ist so komisch im Kopf …“ – wird zunehmend verwirrt. Raucher, sonst gesund.',
    ],
    befund: [
      'Verrußte Nasenhaare, Ruß um Mund und Nase',
      'Pfeifendes Atemgeräusch beim Einatmen, heisere Stimme',
      'Rußiger Auswurf beim Husten',
      'Zeitlich nicht orientiert, kein Alkoholgeruch, keine Hautveränderungen',
    ],
    vitals: { puls: 112, rr: [142, 88], spo2: 97, af: 26, temp: 37.0, bz: 108, gcs: 13, ekg: 'Sinustachykardie' },
    keyVitals: ['gcs', 'af', 'spo2'],
    distractors: ['Alkoholvergiftung', 'Hypoglykämie (Unterzuckerung)', 'Anaphylaktischer Schock'],
    explanation:
      'Verrußte Nasenhaare und rußiger Auswurf zeigen, dass heißer Rauch eingeatmet wurde. Heiserkeit und pfeifendes Atemgeräusch kündigen eine Schwellung der Atemwege an, die Verwirrtheit deutet auf Kohlenmonoxid. Die SpO₂ von 97 % täuscht. Sofort Notarzt nachfordern, Atemwege eng überwachen, Sauerstoff.',
  },
];
