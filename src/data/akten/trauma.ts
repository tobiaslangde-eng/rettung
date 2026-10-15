import { AktenBild, AktenFall } from './types';

export const BILDER_TRAUMA: AktenBild[] = [
  {
    id: 'oberschenkelhals',
    diagnosis: 'Oberschenkelhalsfraktur',
    kategorie: 'trauma',
    leitsymptome: [
      'Sturz im höheren Alter mit Leisten- oder Hüftschmerz',
      'Bein kann nicht angehoben werden, oft verkürzt und nach außen gedreht',
      'Aufstehen und Auftreten unmöglich, versteckter Blutverlust',
    ],
  },
  {
    id: 'sprunggelenk',
    diagnosis: 'Sprunggelenkverletzung (Bänderriss / Bruch)',
    kategorie: 'trauma',
    leitsymptome: [
      'Umknicken oder Sturz mit Schmerz am Knöchel',
      'Schwellung, Bluterguss, Auftreten kaum oder nicht möglich',
      'Bei Fehlstellung: Fußpuls, Gefühl und Beweglichkeit (DMS) prüfen',
    ],
  },
  {
    id: 'schulterluxation',
    diagnosis: 'Schulterluxation (ausgekugelte Schulter)',
    kategorie: 'trauma',
    leitsymptome: [
      'Schulter wirkt „eckig“, Delle unter dem Schulterdach',
      'Arm wird in Schonhaltung gehalten und lässt sich nicht bewegen',
      'Starke Schmerzen nach Sturz oder gewaltsamer Armbewegung',
    ],
  },
  {
    id: 'rippen',
    diagnosis: 'Rippenserienfraktur',
    kategorie: 'trauma',
    leitsymptome: [
      'Atemabhängiger Schmerz nach Sturz oder Stoß gegen den Brustkorb',
      'Flache Schonatmung, Druckschmerz über mehreren Rippen',
      'Atemgeräusch seitengleich – sonst an Pneumothorax denken',
    ],
  },
  {
    id: 'wirbelsaeule',
    diagnosis: 'Wirbelsäulenverletzung',
    kategorie: 'trauma',
    leitsymptome: [
      'Gefährlicher Unfallhergang (Sturz, Sprung, Aufprall)',
      'Klopfschmerz an der Wirbelsäule, Kribbeln oder Gefühlsstörung',
      'Bei schwerer Verletzung: Lähmung von Armen oder Beinen',
    ],
  },
  {
    id: 'schwersht',
    diagnosis: 'Schweres Schädel-Hirn-Trauma (Hirnblutung nach Sturz)',
    kategorie: 'trauma',
    leitsymptome: [
      'Zunehmende Bewusstseinstrübung nach Kopfverletzung, auch nach freiem Intervall',
      'Erbrechen, Kopfschmerz, ungleiche Pupillen',
      'Hirndruck: hoher Blutdruck bei langsamem Puls',
    ],
  },
];

export const AKTEN_TRAUMA: AktenFall[] = [
  // ---------- Unterarmbruch (Radiusfraktur) ----------
  {
    id: 'fraktur-kind',
    bild: 'fraktur',
    difficulty: 1,
    patient: { name: 'Leonie Kramer', age: 7, sex: 'w' },
    location: 'Wuppertal, Schulhof der Grundschule im Briller Viertel',
    dispatch: 'Mädchen vom Klettergerüst gefallen, weint und hält sich den Arm.',
    scene:
      'Eine Lehrerin steht mit mehreren Kindern um Leonie. Das Mädchen sitzt auf dem Boden, weint laut und drückt den rechten Arm fest an den Bauch.',
    anamnese: [
      'Lehrerin: „Sie ist von der zweiten Sprosse gerutscht und hat sich mit der Hand abgefangen, am Kopf hat sie sich nicht gestoßen.“',
      '„Mein Arm tut so weh!“ – Sie lässt niemanden an die Hand.',
      'Seit dem Sturz sieht ihr Handgelenk „krumm“ aus, bewegen mag sie es nicht.',
    ],
    befund: [
      'Rechtes Handgelenk leicht verformt und geschwollen',
      'Finger warm und beweglich, Gefühl vorhanden',
      'Ellenbogen, Schulter und Schlüsselbein schmerzfrei; Kopf ohne Beule',
    ],
    vitals: { puls: 122, rr: [108, 66], spo2: 99, af: 26, temp: 36.8, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'spo2'],
    distractors: ['Radiusköpfchen-Subluxation (Kindermädchenarm)', 'Schlüsselbeinbruch', 'Gehirnerschütterung'],
    explanation:
      'Beim Abfangen eines Sturzes mit der ausgestreckten Hand ist das Handgelenk die typische Schwachstelle – auch bei Kindern. Weinen und Schmerz treiben den Puls hoch: Kinder-Normwerte beachten. Arm ruhigstellen, Durchblutung und Gefühl prüfen, Kinderklinik.',
  },
  {
    id: 'fraktur-eis',
    bild: 'fraktur',
    difficulty: 2,
    patient: { name: 'Gerda Lüders', age: 72, sex: 'w' },
    location: 'Bayreuth, Bushaltestelle am Hohenzollernring',
    dispatch: 'Seniorin an der Bushaltestelle ausgerutscht, kann die linke Hand nicht benutzen.',
    scene:
      'Es ist glatt und frostig. Gerda sitzt auf der Haltestellenbank, ein Passant hat ihr seine Jacke umgelegt. Sie hält den linken Arm mit der rechten Hand fest.',
    anamnese: [
      'Passant: „Sie ist auf dem Eis weggerutscht und hat sich mit der Hand abgefangen.“',
      '„Die Finger sind ganz kalt und kribbeln, und das Handgelenk fühlt sich fremd an.“',
      'Osteoporose ist bekannt, sie nimmt Tabletten dagegen.',
    ],
    befund: [
      'Linkes Handgelenk in „Gabelstellung“, geschwollen; Ellenbogen unauffällig',
      'Finger kalt, aber rosig; Kapillarfüllung normal, Handgelenkspuls tastbar',
      'Gefühl in den Fingern leicht kribbelnd, alle Finger beweglich',
      'Gesicht symmetrisch, Sprache klar, Kopf nicht angeschlagen',
    ],
    vitals: { puls: 92, rr: [158, 90], spo2: 96, af: 18, temp: 36.1, bz: 118, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Akuter Gefäßverschluss in der Hand', 'Schlaganfall', 'Ellenbogenluxation'],
    explanation:
      'Bei Osteoporose genügt ein Sturz auf die Hand; die „Gabelstellung“ ist typisch. Kalte Finger im Winter sind nicht automatisch ein Gefäßproblem: Handgelenkspuls, Kapillarfüllung und Gefühl vor und nach dem Schienen prüfen und festhalten.',
  },

  // ---------- Gehirnerschütterung (leichtes Schädel-Hirn-Trauma) ----------
  {
    id: 'sht-ski',
    bild: 'sht',
    difficulty: 2,
    patient: { name: 'Katrin Lenz', age: 40, sex: 'w' },
    location: 'Oberstdorf, Skipiste am Fellhorn',
    dispatch: 'Skifahrerin auf der Piste gestürzt, wirkt benommen.',
    scene:
      'Die Pistenrettung hat Katrin am Pistenrand gesichert. Sie sitzt im Schnee, neben ihr liegt der Helm – an der Seite hat die Schale einen deutlichen Riss.',
    anamnese: [
      'Pistenretter: „Ein Snowboarder ist ihr von hinten in die Beine gefahren, sie ist mit dem Kopf aufgeschlagen.“',
      '„Mir brummt der Schädel, und mir ist ganz flau im Magen.“',
      'An den Sturz erinnert sie sich nicht, fragt zum zweiten Mal nach ihren Skiern. Hat einmal erbrochen.',
    ],
    befund: [
      'Kleine Schwellung am Hinterkopf unter dem Helmrand',
      'Pupillen gleich groß, reagieren auf Licht',
      'Haut warm und trocken, Arme und Beine voll beweglich',
    ],
    vitals: { puls: 90, rr: [134, 82], spo2: 97, af: 16, temp: 36.3, bz: 98, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'bz', 'temp'],
    distractors: ['Kreislaufkollaps (Synkope)', 'Unterzuckerung (Hypoglykämie)', 'Unterkühlung'],
    explanation:
      'Der angebrochene Helm zeigt, wie viel Wucht den Kopf getroffen hat – auch wenn die Skifahrerin ansprechbar ist. Erinnerungslücke, Kopfschmerz und Erbrechen sind die Schlüssel. Bewusstsein und Pupillen wiederholt prüfen, nicht allein lassen, Klinik.',
  },
  {
    id: 'sht-bmx',
    bild: 'sht',
    difficulty: 2,
    patient: { name: 'Luis Kovač', age: 12, sex: 'm' },
    location: 'Halle (Saale), Skatepark an der Peißnitzinsel',
    dispatch: 'Junge im Skatepark gestürzt, war kurz bewusstlos.',
    scene:
      'An diesem Julinachmittag sind es über 30 Grad. Auf der Rampe liegt ein BMX-Rad, Luis sitzt am Rand, umringt von Freunden, und weint. Einen Helm trägt er nicht.',
    anamnese: [
      'Freund: „Er ist oben von der Rampe gekippt und mit dem Kopf auf den Beton geknallt.“',
      '„Er hat sich ungefähr eine Minute lang nicht bewegt, dann hat er angefangen zu weinen.“',
      '„Mir tut der Kopf so weh!“ Er hat einmal erbrochen und weiß nicht mehr, was passiert ist.',
    ],
    befund: [
      'Beule und Schürfung am Hinterkopf',
      'Pupillen gleich groß, reagieren auf Licht',
      'Keine Zuckungen beobachtet, kein Zungenbiss',
      'Haut rosig und nicht schweißnass, Arme und Beine beweglich',
    ],
    vitals: { puls: 98, rr: [112, 68], spo2: 98, af: 22, temp: 36.7, bz: 104, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'bz', 'temp'],
    distractors: ['Epileptischer Krampfanfall', 'Unterzuckerung (Hypoglykämie)', 'Hitzeerschöpfung'],
    explanation:
      'Kurze Bewusstlosigkeit, Erinnerungslücke, Kopfschmerz und Erbrechen nach einem Sturz ohne Helm: Der Sturz war der Auslöser, nicht Hitze, Zucker oder ein Krampf. Weinen ist bei Kindern normal, aber Pupillen und Wachheit regelmäßig prüfen. Klinik, Eltern informieren.',
  },
  {
    id: 'sht-saeugling',
    bild: 'sht',
    difficulty: 3,
    patient: { name: 'Leon Köhler', age: 0, sex: 'm' },
    location: 'Oldenburg, Mietwohnung in Kreyenbrück',
    dispatch: 'Baby vom Sofa gefallen, Eltern sind völlig aufgelöst.',
    scene:
      'Die Mutter wiegt Leon im Arm, der Vater telefoniert mit zitternder Stimme. Auf den Fliesen im Wohnzimmer liegt eine Spieldecke. Das Baby ist auffallend ruhig.',
    anamnese: [
      'Mutter: „Ich war nur eine Sekunde in der Küche, da hat es gepoltert!“',
      '„Er hat sofort geschrien, jetzt ist er so still und will nicht trinken.“',
      'Der Sturz war vor 20 Minuten, seitdem hat er einmal erbrochen. Sonst gesund, keine Medikamente.',
    ],
    befund: [
      'Beule am Hinterkopf, Haut nicht verletzt',
      'Fontanelle weich und auf Kopfhöhe, nicht vorgewölbt',
      'Schläfrig, öffnet bei Ansprache die Augen',
      'Pupillen gleich, keine Zuckungen, bewegt Arme und Beine',
    ],
    vitals: { puls: 136, rr: [88, 54], spo2: 98, af: 38, temp: 36.8, bz: 90, gcs: 14, ekg: 'Sinusrhythmus' },
    keyVitals: ['gcs', 'temp', 'puls'],
    distractors: ['Fieberkrampf', 'Hirnhautentzündung (Meningitis)', 'Magen-Darm-Infekt'],
    explanation:
      'Beim Säugling sind Zeichen schwer zu deuten: Schläfrigkeit, Trinkverweigerung und Erbrechen nach einem Sturz sind Warnsignale, auch bei normalen Werten. Fontanelle und Pupillen prüfen, Säuglings-Normwerte nutzen, Eltern beruhigen, Kinderklinik mit Überwachung.',
    leitsymptome: [
      'Sturz auf den Kopf mit Beule',
      'Verhaltensänderung: ruhig, schläfrig, trinkt nicht, Erbrechen',
      'Warnzeichen: vorgewölbte Fontanelle, Krampf, Eintrübung',
    ],
  },

  // ---------- Verbrennung 2. Grades ----------
  {
    id: 'verbrennung-fett',
    bild: 'verbrennung',
    difficulty: 2,
    patient: { name: 'Lukas Krüger', age: 28, sex: 'm' },
    location: 'Rostock, Wohnung im Plattenbau in Lütten Klein',
    dispatch: 'Mann in der Küche verletzt, das Fett in der Pfanne hat gebrannt.',
    scene:
      'In der Küche riecht es nach verbranntem Fett, die schwarze Pfanne steht auf dem Herd, das Fenster ist offen. Lukas streckt die Hände von sich, sein Gesicht ist stark gerötet.',
    anamnese: [
      'Mitbewohnerin: „Er wollte das brennende Fett mit Wasser löschen!“',
      '„Es gab eine Stichflamme, mitten ins Gesicht.“',
      'Das war vor etwa 15 Minuten. Er hustet ein wenig, die Stimme klingt noch normal.',
    ],
    befund: [
      'Gesicht und beide Hände gerötet mit Blasen, Augenbrauen versengt',
      'Kein Ruß in Mund und Nase, Stimme klar, keine Atemnot',
      'Kein Kopfschmerz, keine Übelkeit, wach und orientiert',
    ],
    vitals: { puls: 112, rr: [146, 88], spo2: 97, af: 22, temp: 36.8, bz: 106, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af', 'rr'],
    distractors: ['Rauchgasvergiftung', 'Verätzung durch Reinigungsmittel', 'Allergische Reaktion mit Gesichtsschwellung'],
    explanation:
      'Bei Verbrennungen im Gesicht und versengten Augenbrauen die Atemwege im Blick behalten: Heiserkeit und Atemnot können erst später kommen. Notarzt nachfordern, kurz lauwarm kühlen, steril abdecken, Wärmeerhalt, Klinik mit Verbrennungsabteilung.',
  },
  {
    id: 'verbrennung-lagerfeuer',
    bild: 'verbrennung',
    difficulty: 2,
    patient: { name: 'Lena Kowalczyk', age: 12, sex: 'w' },
    location: 'Lüneburger Heide, Zeltlager bei Undeloh',
    dispatch: 'Mädchen im Zeltlager am Lagerfeuer verletzt, starke Schmerzen.',
    scene:
      'Betreuer haben Lena in eine Decke gesetzt, ein anderes Kind weint daneben. Der rechte Pulloverärmel ist angekohlt und aufgeschnitten, der Unterarm mit feuchten Tüchern umwickelt.',
    anamnese: [
      'Betreuer: „Der Ärmel hat Feuer gefangen, wir haben es mit einer Decke gelöscht.“',
      '„Das brennt so!“ – Lena zittert und weint.',
      'Seit dem Löschen bilden sich Blasen am rechten Unterarm und Handgelenk. Gesicht und Haare blieben heil.',
    ],
    befund: [
      'Rechter Unterarm und Handgelenk gerötet mit Blasen, nässend',
      'Betroffene Fläche etwa 5 % der Körperoberfläche',
      'Kein Ruß im Gesicht, Haare intakt, Atmung frei',
      'Blass, zittert, Hände kühl',
    ],
    vitals: { puls: 126, rr: [104, 64], spo2: 98, af: 28, temp: 36.5, bz: 94, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'af'],
    distractors: ['Sonnenbrand', 'Wiesengräserdermatitis', 'Allergische Reaktion nach Insektenstich'],
    explanation:
      'Kinder kühlen schnell aus und die verbrannte Fläche wirkt kleiner, als sie ist. Festklebende Kleidung nicht abziehen, kurz lauwarm kühlen, steril abdecken, Wärmeerhalt. Schmerz und Schock bei Kindern ernst nehmen, Kinder-Normwerte beachten.',
  },

  // ---------- Spannungspneumothorax ----------
  {
    id: 'pneumothorax-leiter',
    bild: 'pneumothorax',
    difficulty: 3,
    patient: { name: 'Klaus Lindner', age: 52, sex: 'm' },
    location: 'Jork, Obstgarten im Alten Land',
    dispatch: 'Mann im Garten von der Leiter gestürzt, bekommt schlecht Luft.',
    scene:
      'Unter einem Apfelbaum liegt eine Leiter, daneben eine umgekippte Gartenbank. Klaus sitzt halb aufgerichtet im Gras, atmet hektisch und stützt sich mit den Händen ab. Seine Lippen sind bläulich.',
    anamnese: [
      'Seine Frau: „Er hat Äpfel gepflückt, da ist die Leiter weggerutscht – gut zweieinhalb Meter.“',
      '„Erst war es nur ein Stechen rechts, aber ich bekomme immer schlechter Luft!“',
      'Mit der rechten Seite auf die Kante der Gartenbank gefallen. Keine Vorerkrankungen, keine Medikamente.',
    ],
    befund: [
      'Rechter Brustkorb bewegt sich kaum, Prellmarke an der Seite',
      'Halsvenen deutlich gestaut',
      'Atemgeräusch rechts fehlt, links ohne Giemen; Klopfschall rechts hohl',
      'Haut kaltschweißig, Lippen bläulich',
    ],
    vitals: { puls: 128, rr: [88, 50], spo2: 82, af: 34, temp: 36.2, bz: 124, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'rr', 'af', 'puls'],
    distractors: ['Herzbeuteltamponade', 'Lungenembolie', 'Asthmaanfall'],
    explanation:
      'Nach einem Sturz auf den Brustkorb kann die Lunge verletzt werden und Luft sammelt sich unter Druck im Brustkorb. Warnzeichen: zunehmende Atemnot, gestaute Halsvenen, fehlendes Atemgeräusch auf einer Seite, Schock. Sofort Notarzt nachfordern, Oberkörper hoch, Sauerstoff.',
  },

  // ---------- Oberschenkelhalsfraktur ----------
  {
    id: 'oberschenkelhals-bad',
    bild: 'oberschenkelhals',
    difficulty: 1,
    patient: { name: 'Ingeborg Kühn', age: 84, sex: 'w' },
    location: 'Chemnitz, Seniorenwohnanlage auf dem Kaßberg',
    dispatch: 'Seniorin im Bad ausgerutscht, kann nicht mehr aufstehen. Notrufknopf wurde gedrückt.',
    scene:
      'Die Nachbarin öffnet uns mit dem Ersatzschlüssel. Ingeborg liegt auf den Fliesen neben der Dusche, ist wach und friert. Ihr rechtes Bein liegt merkwürdig schräg.',
    anamnese: [
      'Sie ist auf dem nassen Boden ausgerutscht und seitlich aufgeschlagen, den Kopf hat sie nicht angestoßen.',
      '„Es tut so weh in der Leiste, ich komme nicht hoch!“',
      'Vor etwa 40 Minuten gestürzt. Sie nimmt Blutverdünner wegen einer Herzrhythmusstörung.',
    ],
    befund: [
      'Rechtes Bein verkürzt und nach außen gedreht',
      'Starker Druckschmerz in der rechten Leiste, Bein nicht anhebbar',
      'Fußpuls tastbar, Zehen warm und beweglich',
      'Gesicht symmetrisch, wach und orientiert',
    ],
    vitals: { puls: 96, rr: [146, 84], spo2: 95, af: 18, temp: 36.0, bz: 122, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Muskelzerrung in der Leiste', 'Kreislaufkollaps (Synkope)', 'Hüftgelenkarthrose (akuter Schmerzschub)'],
    explanation:
      'Ein verkürztes, nach außen gedrehtes Bein nach einem Sturz im Alter ist das Lehrbuchzeichen einer Verletzung am Hüftgelenk. Blutverdünner verstärken den Blutverlust. Nicht aufrichten, schonend lagern, DMS prüfen, warm halten, Notarzt für die Schmerztherapie.',
  },
  {
    id: 'oberschenkelhals-treppe',
    bild: 'oberschenkelhals',
    difficulty: 3,
    patient: { name: 'Karl-Heinz Lutz', age: 79, sex: 'm' },
    location: 'Plauen, Reihenhaus in der Neundorfer Vorstadt',
    dispatch: 'Mann im Keller gestürzt, kann nicht mehr aufstehen.',
    scene:
      'Auf der Kellertreppe liegen ein Wäschekorb und verstreute Handtücher. Karl-Heinz liegt am Treppenende auf dem kalten Betonboden, eine Jacke über den Schultern. Er ist wach, zittert aber.',
    anamnese: [
      'Seine Frau: „Er wollte Wäsche runterbringen. Ich habe ihn erst nach etwa zwei Stunden gefunden.“',
      'Er ist die letzten Stufen hinabgerutscht, Kopf nicht angeschlagen, ansprechbar und klar.',
      'In Ruhe geht es, aber bei jeder Bewegung zieht es in der Leiste. Das Bein anheben kann er nicht.',
    ],
    befund: [
      'Stauchungsschmerz in der rechten Leiste',
      'Bein kaum verkürzt, Fuß nur wenig nach außen gedreht',
      'Haut kühl, Zittern, blass',
      'Fußpuls tastbar, Zehen beweglich',
    ],
    vitals: { puls: 102, rr: [128, 76], spo2: 95, af: 20, temp: 35.5, bz: 112, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['temp', 'puls'],
    distractors: ['Hüftprellung', 'Kreislaufkollaps (Synkope)', 'Schlaganfall'],
    explanation:
      'Bei einem eingestauchten Bruch fehlen Verkürzung und Außendrehung oft. Entscheidend sind Sturz, Leistenschmerz und ein Bein, das sich nicht anheben lässt. Wer zwei Stunden auf kaltem Boden lag, kühlt aus: Wärmeerhalt, nicht belasten, Klinik.',
    leitsymptome: [
      'Sturz im höheren Alter, Schmerz in der Leiste',
      'Bein lässt sich nicht anheben, obwohl es kaum verkürzt wirkt',
      'Stauchungsschmerz und Auskühlung nach langem Liegen',
    ],
  },

  // ---------- Sprunggelenkverletzung ----------
  {
    id: 'sprunggelenk-joggen',
    bild: 'sprunggelenk',
    difficulty: 1,
    patient: { name: 'Laura Kessler', age: 26, sex: 'w' },
    location: 'Erfurt, Nordpark',
    dispatch: 'Joggerin im Park umgeknickt, kann nicht mehr auftreten.',
    scene:
      'Laura sitzt auf einem Baumstumpf am Parkweg, der linke Laufschuh ist aufgeschnürt, ein Mitläufer hat ihr eine Trinkflasche gegeben. Sie hält den Fuß vom Boden weg.',
    anamnese: [
      'Mitläufer: „Sie ist über eine Wurzel gestolpert und mit dem Fuß umgeknickt.“',
      '„Es ist sofort angeschwollen, und auftreten geht gar nicht.“',
      'Am Außenknöchel sticht es besonders. Sonst gesund, keine Medikamente.',
    ],
    befund: [
      'Linker Außenknöchel geschwollen, beginnender Bluterguss',
      'Druckschmerz am Außenknöchel, Auftreten nicht möglich',
      'Fußpuls tastbar, Zehen warm, beweglich, Gefühl normal',
      'Wade weich und schmerzfrei, Achillessehne durchgehend tastbar',
    ],
    vitals: { puls: 92, rr: [124, 76], spo2: 99, af: 16, temp: 36.7, bz: 94, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Achillessehnenriss', 'Muskelfaserriss in der Wade', 'Beinvenenthrombose'],
    explanation:
      'Nach dem Umknicken mit Schwellung am Außenknöchel und fehlender Belastbarkeit lassen sich Bänderriss und Bruch vor Ort nicht unterscheiden – beides wird gleich versorgt: ruhigstellen, hochlagern, kühlen. Wichtig ist DMS. Normale Vitalwerte sind hier typisch.',
  },
  {
    id: 'sprunggelenk-halle',
    bild: 'sprunggelenk',
    difficulty: 2,
    patient: { name: 'Luca Lombardi', age: 17, sex: 'm' },
    location: 'Nürnberg, Sporthalle der Berufsschule',
    dispatch: 'Basketballspieler in der Sporthalle gestürzt, der Fuß sieht schlimm aus.',
    scene:
      'Das Spiel ist unterbrochen, die Mannschaften stehen im Halbkreis um Luca. Er liegt auf dem Hallenboden, der rechte Fuß steht schräg zum Unterschenkel. Der Trainer will ihm den Schuh ausziehen.',
    anamnese: [
      'Mitspieler: „Er ist beim Rebound auf den Fuß vom Gegner gelandet und weggeknickt.“',
      '„Ich habe es richtig knacken gehört!“ – Er ist blass und atmet schnell.',
      'Der Fuß fühlt sich „komisch“ an, die Zehen kribbeln. Sonst gesund, keine Vorerkrankungen.',
    ],
    befund: [
      'Rechter Fuß deutlich nach innen versetzt, Knöchel stark geschwollen',
      'Fußpuls nur abgeschwächt tastbar, Fuß kühler als links',
      'Zehen beweglich, Gefühl an der Fußsohle vermindert',
      'Knie, Wade und Oberschenkel schmerzfrei',
    ],
    vitals: { puls: 108, rr: [136, 84], spo2: 99, af: 20, temp: 36.8, bz: 98, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Kreuzbandriss', 'Kniescheibenverrenkung', 'Wadenkrampf'],
    explanation:
      'Fehlstellung plus abgeschwächter Fußpuls heißt: Die Durchblutung ist gefährdet. DMS vor und nach dem Schienen prüfen und festhalten, nicht selbst einrenken lassen, Notarzt nachfordern, zügig in die Klinik.',
  },

  // ---------- Schulterluxation ----------
  {
    id: 'schulterluxation-handball',
    bild: 'schulterluxation',
    difficulty: 1,
    patient: { name: 'Jannik Kaiser', age: 23, sex: 'm' },
    location: 'Emsdetten, Sporthalle der Gesamtschule',
    dispatch: 'Handballer in der Halle gestürzt, kann den Arm nicht mehr bewegen.',
    scene:
      'Das Spiel ist unterbrochen. Jannik sitzt auf der Auswechselbank und stützt den rechten Arm mit der linken Hand. Sein Gesicht ist schmerzverzerrt.',
    anamnese: [
      'Trainer: „In der Abwehr hat ihm jemand den Wurfarm nach hinten gerissen.“',
      '„Es hat in der Schulter geschnappt, seitdem geht gar nichts mehr.“',
      'Rechtshänder, so etwas hatte er noch nie. Kopf und Rücken sind in Ordnung.',
    ],
    befund: [
      'Rechte Schulter „eckig“, Delle unter dem Schulterdach',
      'Arm leicht abgespreizt, federnder Widerstand bei jeder Bewegung',
      'Finger warm, Handgelenkspuls tastbar, Gefühl vorhanden',
      'Schlüsselbein ohne Stufe oder Hochstand',
    ],
    vitals: { puls: 98, rr: [138, 84], spo2: 99, af: 18, temp: 36.7, bz: 100, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Schlüsselbeinbruch', 'Muskelzerrung im Oberarm', 'Schultereckgelenksprengung'],
    explanation:
      'Schulter „eckig“, Arm in Schonhaltung, jede Bewegung schmerzt: das Lehrbuchbild einer ausgekugelten Schulter. Nicht selbst einrenken lassen, auch nicht vom Trainer. Arm in der Schonhaltung polstern, DMS prüfen, kühlen, Klinik.',
  },
  {
    id: 'schulterluxation-treppe',
    bild: 'schulterluxation',
    difficulty: 2,
    patient: { name: 'Ute Kleinschmidt', age: 60, sex: 'w' },
    location: 'Ulm, Mehrfamilienhaus in der Weststadt',
    dispatch: 'Frau im Treppenhaus gestürzt, Arm tut weh und fühlt sich taub an.',
    scene:
      'Ute sitzt auf dem Treppenabsatz und drückt den linken Arm eng an den Körper. Eine Nachbarin hat sie in eine Decke gehüllt, die Einkaufstasche liegt umgekippt auf den Stufen.',
    anamnese: [
      'Nachbarin: „Sie ist auf der vorletzten Stufe abgerutscht und seitlich gefallen.“',
      '„Die Schulter ist wie gelähmt, und am Oberarm fühlt es sich pelzig an.“',
      'Kein Brustschmerz, nicht ohnmächtig geworden. Sie nimmt nur Tabletten gegen Bluthochdruck.',
    ],
    befund: [
      'Linke Schulter flacher und eckig, Oberarm wirkt verschoben',
      'Taubheit an der Außenseite des Oberarms',
      'Handgelenkspuls tastbar, Finger warm und beweglich',
      'Gesicht symmetrisch, Sprache klar, Nacken schmerzfrei',
    ],
    vitals: { puls: 94, rr: [152, 90], spo2: 97, af: 18, temp: 36.5, bz: 112, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Schlaganfall', 'Halswirbelsäulenverletzung', 'Herzinfarkt (Armschmerz)'],
    explanation:
      'Bei einer ausgekugelten Schulter kann der Achselnerv gedrückt werden: Es entsteht ein Taubheitsfleck an der Außenseite des Oberarms. Das ist kein Schlaganfall, denn Gesicht, Sprache und Handkraft sind normal. Nicht einrenken, Arm polstern, DMS prüfen.',
  },

  // ---------- Rippenserienfraktur ----------
  {
    id: 'rippen-reiten',
    bild: 'rippen',
    difficulty: 2,
    patient: { name: 'Kerstin Lehmann', age: 58, sex: 'w' },
    location: 'Verden (Aller), Reitstall am Stadtrand',
    dispatch: 'Reiterin vom Pferd gestürzt, hat starke Schmerzen in der Seite.',
    scene:
      'Auf dem Hof tänzelt ein unruhiges Pferd, ein Stallhelfer hält es fest. Kerstin sitzt mit Reithelm auf einem Strohballen, vornübergebeugt, und atmet nur flach und vorsichtig.',
    anamnese: [
      'Stallbesitzerin: „Das Pferd hat gescheut, sie ist auf die linke Seite gestürzt und gegen die Bande geprallt.“',
      '„Bei jedem Atemzug sticht es links, ich traue mich kaum, tief einzuatmen.“',
      'Husten ist kaum möglich. Kopf nicht angeschlagen, nicht bewusstlos, keine Medikamente.',
    ],
    befund: [
      'Prellmarke und Schwellung links seitlich am Brustkorb',
      'Beim Abtasten ein knirschendes Gefühl unter den Fingern',
      'Flache Atmung, linke Brustkorbseite bewegt sich weniger',
      'Atemgeräusch seitengleich, Halsvenen nicht gestaut, Bauch weich',
    ],
    vitals: { puls: 102, rr: [146, 88], spo2: 93, af: 24, temp: 36.7, bz: 108, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'puls'],
    distractors: ['Spannungspneumothorax', 'Milzverletzung', 'Herzinfarkt'],
    explanation:
      'Atemabhängiger Schmerz, Prellmarke und Knirschen unter der Hand sprechen für mehrere gebrochene Rippen. Die Schonatmung senkt die Sättigung. Seitengleiches Atemgeräusch und ruhige Halsvenen zeigen, dass die Lunge noch nicht betroffen ist. Oberkörper hoch, Sauerstoff, Klinik.',
  },
  {
    id: 'rippen-eis',
    bild: 'rippen',
    difficulty: 2,
    patient: { name: 'Jürgen Lemke', age: 65, sex: 'm' },
    location: 'Saarbrücken, Parkplatz am Einkaufszentrum',
    dispatch: 'Mann auf dem Parkplatz gestürzt, hat Schmerzen beim Atmen.',
    scene:
      'Auf dem vereisten Parkplatz sitzt Jürgen an die Fahrertür seines Autos gelehnt. Er hält sich die linke Seite und atmet vorsichtig. Streusalz knirscht unter den Schuhen der Passanten.',
    anamnese: [
      'Passantin: „Er ist auf dem Eis ausgerutscht und mit der Seite auf die Bordsteinkante gefallen.“',
      '„Wenn ich tief Luft hole, sticht es links an der Seite. Ich halte lieber die Luft an.“',
      'Husten und Lachen tun besonders weh. Herz und Lunge sind gesund, er nimmt nur Tabletten gegen Bluthochdruck.',
    ],
    befund: [
      'Prellmarke links seitlich, Druckschmerz über mehreren Rippen',
      'Schmerz auch beim Zusammendrücken des Brustkorbs',
      'Atemgeräusch seitengleich, keine Atemnot in Ruhe',
      'Kein Schmerz in der Brustmitte, Puls regelmäßig',
    ],
    vitals: { puls: 90, rr: [152, 90], spo2: 95, af: 22, temp: 36.3, bz: 134, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['af', 'rr'],
    distractors: ['Herzinfarkt', 'Lungenembolie', 'Rippenfellentzündung'],
    explanation:
      'Der Schmerz sitzt genau an der Aufprallstelle, ist atemabhängig und lässt sich über den Rippen auslösen – das spricht gegen Herz und Lunge. Wer die Luft verhält, belüftet schlecht. Atemgeräusch und Sättigung wiederholt prüfen, sitzend lagern, Klinik.',
  },

  // ---------- Wirbelsäulenverletzung ----------
  {
    id: 'wirbelsaeule-kopfsprung',
    bild: 'wirbelsaeule',
    difficulty: 3,
    patient: { name: 'Kilian Lorenz', age: 19, sex: 'm' },
    location: 'Würzburg, Freibad am Main',
    dispatch: 'Jugendlicher im Freibad regungslos aus dem Wasser gezogen.',
    scene:
      'Am Beckenrand haben Badegäste Kilian auf den Rücken gelegt, der Bademeister kniet hinter ihm und hält den Kopf. Er ist wach, die Augen sind weit geöffnet, er hat große Angst.',
    anamnese: [
      'Bademeister: „Er ist kopfüber ins Nichtschwimmerbecken gesprungen und trieb regungslos im Wasser.“',
      '„Ich spüre meine Arme und Beine nicht!“',
      'Unterhalb der Schultern fühlt er nichts. Er hat kein Wasser geschluckt und keine Vorerkrankungen.',
    ],
    befund: [
      'Arme und Beine schlaff, keine Bewegung auf Aufforderung',
      'Atmung nur mit dem Bauch, Brustkorb hebt sich kaum',
      'Haut warm und rosig trotz niedrigem Blutdruck',
      'Kein Husten oder Rasseln, Stimme klar',
    ],
    vitals: { puls: 52, rr: [84, 48], spo2: 94, af: 14, temp: 35.8, bz: 102, gcs: 15, ekg: 'Sinusbradykardie' },
    keyVitals: ['rr', 'puls', 'spo2'],
    distractors: ['Beinahe-Ertrinken', 'Schlaganfall', 'Hitzschlag'],
    explanation:
      'Lähmung und Gefühllosigkeit nach einem Kopfsprung in flaches Wasser sprechen für eine Verletzung der Halswirbelsäule. Typisch: niedriger Blutdruck bei langsamem Puls, warme rosige Haut, Zwerchfellatmung. Kopf in Neutralstellung halten, Notarzt nachfordern, Wärmeerhalt.',
  },
  {
    id: 'wirbelsaeule-geruest',
    bild: 'wirbelsaeule',
    difficulty: 2,
    patient: { name: 'Kemal Kaya', age: 46, sex: 'm' },
    location: 'Regensburg, Baustelle in der Kumpfmühler Straße',
    dispatch: 'Dachdecker vom Gerüst gefallen, klagt über Rückenschmerzen.',
    scene:
      'Neben dem Gerüst liegt Kemal auf dem Rücken im Schotter, die Kollegen stehen mit Abstand daneben. Er ist ansprechbar und versucht, sich aufzurichten.',
    anamnese: [
      'Kollege: „Er ist von der dritten Gerüstlage gut drei Meter tief auf den Rücken gefallen.“',
      '„Mein Kreuz brennt, aber ich will einfach aufstehen!“',
      'Die Beine kribbeln, die Zehen kann er bewegen. Kopf nicht angeschlagen, er trug einen Helm.',
    ],
    befund: [
      'Klopfschmerz über den unteren Lendenwirbeln',
      'Zehen beidseits beweglich, Kribbeln in beiden Beinen',
      'Fußpulse tastbar, Beine warm',
      'Bauch weich, Becken stabil, Flanken nicht druckschmerzhaft',
    ],
    vitals: { puls: 96, rr: [142, 86], spo2: 97, af: 20, temp: 36.6, bz: 110, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Hexenschuss (Lumbago)', 'Bandscheibenvorfall', 'Nierenprellung'],
    explanation:
      'Ein Sturz aus drei Metern auf den Rücken ist ein gefährlicher Unfallmechanismus, auch wenn der Patient wach ist und die Zehen bewegt. Kribbeln und Klopfschmerz sind Warnzeichen. Nicht zum Aufstehen ermutigen: flach lagern, nicht drehen, Notarzt nachfordern.',
    leitsymptome: [
      'Gefährlicher Unfallmechanismus: Sturz aus großer Höhe auf den Rücken',
      'Klopfschmerz über der Wirbelsäule',
      'Kribbeln in den Beinen, eine Lähmung kann noch fehlen',
    ],
  },

  // ---------- Schweres Schädel-Hirn-Trauma ----------
  {
    id: 'schwersht-fahrrad',
    bild: 'schwersht',
    difficulty: 3,
    patient: { name: 'Lars Kirchner', age: 30, sex: 'm' },
    location: 'Uckermark, Landstraße bei Gramzow',
    dispatch: 'Radfahrer nach Sturz zunehmend müde und kaum noch ansprechbar.',
    scene:
      'Am Straßenrand liegt ein Fahrrad im Graben. Eine Autofahrerin kniet bei Lars, der auf dem Grasstreifen liegt, die Augen halb geschlossen. Einen Helm sehe ich nicht.',
    anamnese: [
      'Autofahrerin: „Er ist vor etwa 40 Minuten ohne Helm gestürzt und wollte erst keine Hilfe. Ich bin bei ihm geblieben.“',
      '„Erst war er kurz weg, dann wieder ganz klar. Jetzt wird er immer müder – ich dachte schon, er sei betrunken.“',
      'Seit einer Viertelstunde klagt er über starke Kopfschmerzen, hat zweimal erbrochen und spricht verwaschen.',
    ],
    befund: [
      'Prellmarke und Schwellung an der linken Schläfe',
      'Linke Pupille weit und kaum lichtreagibel, rechts normal',
      'Kein Alkoholgeruch, keine Zuckungen oder Zungenbiss',
      'Reagiert nur auf lautes Ansprechen, Atmung leicht unregelmäßig',
    ],
    vitals: { puls: 56, rr: [168, 92], spo2: 94, af: 12, temp: 36.4, bz: 104, gcs: 12, ekg: 'Sinusbradykardie' },
    keyVitals: ['gcs', 'rr', 'puls'],
    distractors: ['Alkoholrausch', 'Unterzuckerung (Hypoglykämie)', 'Epileptischer Krampfanfall'],
    explanation:
      'Das „freie Intervall“ ist die Falle: Nach kurzer Bewusstlosigkeit wirkt der Patient wieder klar, während eine Blutung unter der Schädeldecke wächst. Schläfrigkeit, Erbrechen, ungleiche Pupillen und hoher Blutdruck bei langsamem Puls sind Hirndruckzeichen. Notarzt nachfordern, Zielklinik mit Neurochirurgie.',
  },
  {
    id: 'schwersht-spielplatz',
    bild: 'schwersht',
    difficulty: 3,
    patient: { name: 'Lilli Kunze', age: 9, sex: 'w' },
    location: 'Paderborn, Spielplatz an der Pader',
    dispatch: 'Mädchen vom Klettergerüst gefallen, ist ganz schläfrig und übergibt sich.',
    scene:
      'Eltern haben auf dem Spielplatz einen Kreis gebildet. Lilli liegt auf einer Jacke im Sand, die Augen halb geschlossen. Ihre Mutter ist verzweifelt.',
    anamnese: [
      'Mutter: „Sie ist oben auf dem Gerüst abgerutscht, gut zwei Meter, und auf den Boden geprallt.“',
      '„Sie war eben noch wach, jetzt schläft sie fast ein und hat schon dreimal erbrochen.“',
      'Sie jammert über Kopfschmerz, antwortet verzögert und wirkt „weggetreten“. Keine Vorerkrankungen.',
    ],
    befund: [
      'Etwas Blut am linken Ohr, Blauverfärbung rund um beide Augen',
      'Öffnet die Augen nur auf Ansprache, reagiert verzögert',
      'Linke Pupille etwas weiter als die rechte',
      'Kein Fieber, keine Nackensteifigkeit, kein Hautausschlag',
    ],
    vitals: { puls: 62, rr: [128, 70], spo2: 95, af: 14, temp: 36.6, bz: 98, gcs: 12, ekg: 'Sinusbradykardie' },
    keyVitals: ['gcs', 'puls', 'rr'],
    distractors: ['Hirnhautentzündung', 'Trommelfellverletzung', 'Kreislaufkollaps (Synkope)'],
    explanation:
      'Blut aus dem Ohr und Blauverfärbung um beide Augen („Brillenhämatom“) sind Zeichen eines Bruchs der Schädelbasis. Dazu Schläfrigkeit, Erbrechen und langsamer Puls: Hirndruck! Kinder-Normwerte beachten. Notarzt nachfordern, nichts in den Gehörgang stecken, Kinderklinik.',
  },
];
