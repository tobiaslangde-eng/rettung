import { AktenBild, AktenFall } from './types';

export const BILDER_TRAUMA2: AktenBild[] = [
  {
    id: 'blutung',
    diagnosis: 'Starke äußere Blutung (arterielle Blutung)',
    kategorie: 'trauma',
    leitsymptome: [
      'Hellrotes Blut, das im Takt des Pulses spritzt oder schwallartig austritt',
      'Schockzeichen: schneller Puls, niedriger Blutdruck, blasse kalte Haut',
      'Durchblutete Verbände und rasch zunehmender Blutverlust',
    ],
  },
  {
    id: 'amputation',
    diagnosis: 'Amputationsverletzung',
    kategorie: 'trauma',
    leitsymptome: [
      'Körperteil (z. B. Finger oder Fingerkuppe) vollständig abgetrennt',
      'Blutende Stumpfwunde mit Schmerz',
      'Abgetrenntes Teil ist noch vorhanden und kann oft wieder angenäht werden',
    ],
  },
  {
    id: 'stich',
    diagnosis: 'Stich- und Pfählungsverletzung',
    kategorie: 'trauma',
    leitsymptome: [
      'Kleine Einstichstelle oder steckender Fremdkörper, innen oft große Verletzung',
      'Je nach Körperregion Atemnot, Schock oder Schmerzen tief im Körper',
      'Fremdkörper bleibt stecken und wird nur fixiert',
    ],
  },
  {
    id: 'poly',
    diagnosis: 'Polytrauma nach Verkehrsunfall',
    kategorie: 'trauma',
    leitsymptome: [
      'Hoher Unfallmechanismus (Aufprall, Einklemmung, Sturz aus dem Fahrzeug)',
      'Mehrere Verletzungen in verschiedenen Körperregionen',
      'Schockzeichen: schneller Puls, niedriger Blutdruck, Atemnot',
    ],
  },
  {
    id: 'strom',
    diagnosis: 'Stromunfall',
    kategorie: 'trauma',
    leitsymptome: [
      'Kontakt mit Strom (defekte Geräte, Kabel, Steckdose)',
      'Strommarken an Ein- und Austrittsstelle, oft unscheinbar',
      'Herzrhythmusstörungen, auch mit zeitlicher Verzögerung',
    ],
  },
  {
    id: 'ertrinken',
    diagnosis: 'Ertrinkungsunfall (Beinahe-Ertrinken)',
    kategorie: 'trauma',
    leitsymptome: [
      'Untergetaucht oder unter Wasser gefunden',
      'Husten, Luftnot, schaumiger Auswurf, niedrige Sauerstoffsättigung',
      'Verwirrtheit oder Bewusstseinsstörung durch Sauerstoffmangel',
    ],
  },
  {
    id: 'verbruehung',
    diagnosis: 'Verbrühung (heiße Flüssigkeit)',
    kategorie: 'trauma',
    leitsymptome: [
      'Kontakt mit heißem Wasser, Tee oder Dampf',
      'Gerötete, schmerzhafte Haut mit Blasen',
      'Besonders gefährdet: Kleinkinder und Menschen mit gestörtem Schmerzempfinden',
    ],
  },
  {
    id: 'biss',
    diagnosis: 'Bissverletzung (Hundebiss)',
    kategorie: 'trauma',
    leitsymptome: [
      'Tierkontakt, meist Hund, mit Zahnabdrücken',
      'Riss- und Quetschwunden, manchmal tief',
      'Hohes Infektionsrisiko durch Keime im Speichel',
    ],
  },
  {
    id: 'augen',
    diagnosis: 'Augenverletzung',
    kategorie: 'trauma',
    leitsymptome: [
      'Starker Augenschmerz, Tränenfluss, Lidkrampf',
      'Lichtscheu und Fremdkörpergefühl oder Brennen',
      'Sehstörung am betroffenen Auge nach Splitter oder Spritzer',
    ],
  },
  {
    id: 'kopfplatz',
    diagnosis: 'Kopfplatzwunde',
    kategorie: 'trauma',
    leitsymptome: [
      'Sturz oder Anprall des Kopfes',
      'Stark blutende Wunde an der Kopfhaut',
      'Wache Patienten, aber Warnzeichen eines Schädel-Hirn-Traumas beachten',
    ],
  },
];

export const AKTEN_TRAUMA2: AktenFall[] = [
  {
    id: 'blutung-glas',
    bild: 'blutung',
    difficulty: 2,
    patient: { name: 'Jan Mertens', age: 36, sex: 'm' },
    location: 'Nürnberg, Café an der Königstraße',
    dispatch: 'Mann im Café verletzt, Kollegen drücken ein Handtuch auf den Arm, er wird blass.',
    scene:
      'Die Glastür des Cafés ist zersprungen, Scherben liegen im Eingang. Jan sitzt auf einem Stuhl, zwei Kollegen halten ein durchgeblutetes Handtuch auf seinen Unterarm.',
    anamnese: [
      '„Mir ist schwindelig und ganz kalt.“',
      'Kollegin: „Die Tür ist beim Öffnen zersprungen, er ist in die Scherben gefasst.“',
      'Das Blut kam hellrot und stoßweise, das erste Handtuch war in Sekunden voll.',
    ],
    befund: [
      'Tiefe Schnittwunde am linken Unterarm',
      'Blass, Fingerspitzen kalt',
      'Finger beweglich, Gefühl vorhanden',
      'Keine weiteren Verletzungen',
    ],
    vitals: { puls: 118, rr: [100, 62], spo2: 97, af: 22, temp: 36.4, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: [
      'Oberflächliche Schnittwunde (Bagatellverletzung)',
      'Kreislaufkollaps nach Schreck (Synkope)',
      'Unterzuckerung (Hypoglykämie)',
    ],
    explanation:
      'Hellrotes, im Takt des Pulses spritzendes Blut zeigt eine verletzte Arterie. Schnell steigender Puls und kalte Fingerspitzen sind erste Schockzeichen. Direkten Druck aufrechterhalten, Druckverband anlegen, nicht mehr lösen und bei Schock den Notarzt nachfordern.',
  },
  {
    id: 'blutung-kettensaege',
    bild: 'blutung',
    difficulty: 3,
    patient: { name: 'Heinz Obermeier', age: 54, sex: 'm' },
    location: 'Zwiesel, Forstweg am Hang im Bayerischen Wald',
    dispatch: 'Forstarbeiter im Wald verunglückt, Kollegen haben das Bein abgebunden, Zufahrt schwierig.',
    scene:
      'Der RTW bleibt 400 Meter entfernt am Waldweg stehen, wir tragen das Material den steilen Hang hinauf. Heinz liegt auf einer Plane, daneben Helm mit Visier und eine zerschnittene Schutzhose.',
    anamnese: [
      'Kollege: „Beim Entasten ist die Säge abgerutscht, das ist jetzt zwölf Minuten her.“',
      '„Mir wird schwarz vor Augen, mir ist so kalt.“',
      'Die Abbindung sitzt locker, der Verband darunter ist trotzdem durchgeblutet.',
    ],
    befund: [
      'Tiefe Schnittverletzung am rechten Oberschenkel',
      'Abbindung mit Gurt, Verband durchgeblutet',
      'Blass, kaltschweißig, Fuß kühl',
      'Bein nicht verkürzt, keine Fehlstellung',
    ],
    vitals: { puls: 130, rr: [82, 48], spo2: 94, af: 26, temp: 36.1, bz: 110, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'puls', 'gcs'],
    distractors: ['Hitzeerschöpfung bei der Waldarbeit', 'Offener Oberschenkelbruch', 'Allergischer Schock nach Insektenstich'],
    explanation:
      'Eine Abbindung allein reicht nicht: Sie muss so fest sitzen, dass die Blutung steht, sonst fließt es weiter. Schockwerte zeigen den hohen Blutverlust. Abbindung nachziehen, Zeitpunkt notieren, Notarzt nachfordern, Wärmeerhalt, Rettung in der Trage über den Hang planen.',
  },
  {
    id: 'amputation-kreissaege',
    bild: 'amputation',
    difficulty: 2,
    patient: { name: 'Dieter Neubauer', age: 52, sex: 'm' },
    location: 'Fulda, Schreinerei im Gewerbegebiet',
    dispatch: 'Arbeitsunfall in der Schreinerei, Mann an der Hand verletzt, stark schmerzend.',
    scene:
      'Die Tischkreissäge ist ausgeschaltet, auf der Werkbank liegt Sägemehl. Dieter hält die rechte Hand hoch, ein Kollege drückt einen Verband darauf.',
    anamnese: [
      '„Es pocht und brennt, aber sonst geht es mir gut.“',
      'Kollege: „Ich habe die Maschine sofort ausgeschaltet und ihn hingesetzt.“',
      'Zeige- und Mittelfinger liegen getrennt in einem Beutel, den der Kollege in kaltes Wasser gestellt hat.',
    ],
    befund: [
      'Zeige- und Mittelfinger der rechten Hand fehlen, Verband durchfeuchtet',
      'Übrige Finger warm und gut durchblutet',
      'Wach, ansprechbar, keine weiteren Verletzungen',
    ],
    vitals: { puls: 104, rr: [148, 90], spo2: 98, af: 18, temp: 36.7, bz: 108, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Quetschverletzung der Finger', 'Tiefe Schnittwunde mit Sehnendurchtrennung', 'Offener Fingerbruch'],
    explanation:
      'Die Werte sind stabil, trotzdem ist die Verletzung dringlich. Stumpf mit Druckverband versorgen, die Hand hochhalten. Fingerteile trocken in einen sauberen Beutel, diesen in einen zweiten mit Eiswasser – nie direkt auf Eis. Teile immer mit in die Klinik nehmen.',
  },
  {
    id: 'amputation-kueche',
    bild: 'amputation',
    difficulty: 1,
    patient: { name: 'Sabine Mohr', age: 44, sex: 'w' },
    location: 'Rostock, Küche einer Wohnung in Reutershagen',
    dispatch: 'Frau in der Küche an der Hand verletzt, Finger blutet.',
    scene:
      'Sabine steht blass am Spülbecken, die linke Hand in einem Küchenhandtuch. Auf der Arbeitsplatte steht eine Brotschneidemaschine, daneben ein Tuch mit einem feuchten Fleck.',
    anamnese: [
      '„Ich wollte nur noch schnell ein Brot schneiden, dann ging es ganz schnell.“',
      'Der Finger blutet tröpfelnd weiter, es schmerzt stark.',
      'Die Fingerkuppe vom Zeigefinger liegt in einem feuchten Tuch auf der Arbeitsplatte.',
    ],
    befund: [
      'Fingerkuppe am linken Zeigefinger fehlt, saubere Wundfläche',
      'Tröpfelnde Blutung, keine spritzende Blutung',
      'Wach, ängstlich, zittrig',
    ],
    vitals: { puls: 108, rr: [138, 86], spo2: 99, af: 20, temp: 36.6, bz: 94, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Tiefe Schnittwunde ohne Gewebeverlust', 'Fingerquetschung in der Schublade', 'Kreislaufschwäche (Synkope)'],
    explanation:
      'Hier fehlt ein Stück des Fingers, das Teil ist noch da. Wunde steril abdecken, Hand hochhalten und das Fingerstück trocken in einen sauberen Beutel geben, nicht nass. Auch kleine Teile mit in die Klinik nehmen, oft lassen sie sich wieder annähen.',
  },
  {
    id: 'stich-thorax',
    bild: 'stich',
    difficulty: 3,
    patient: { name: 'Emre Özdemir', age: 27, sex: 'm' },
    location: 'Duisburg, vor einer Gaststätte in Hochfeld',
    dispatch: 'Mann nach Streit vor einer Gaststätte zusammengesackt, Polizei ist vor Ort.',
    scene:
      'Die Polizei hat die Einsatzstelle gesichert, der Angreifer ist geflüchtet. Ich gehe erst nach Freigabe an den Patienten, der an der Hauswand sitzt und flach atmet.',
    anamnese: [
      '„Wir haben gestritten, dann hat mich einer geschlagen und ist weggerannt.“',
      '„Ich bekomme immer schlechter Luft, links tut es beim Atmen weh.“',
      'Zeugen: Der Angreifer hatte ein Messer, Emre hat die kleine Wunde erst später gespürt.',
    ],
    befund: [
      'Kleine Einstichstelle seitlich an der linken Brust, wenig Blut',
      'Atemgeräusch links abgeschwächt, rechts normal',
      'Blass, ängstlich, schnelle flache Atmung',
      'Kein Giemen, kein Husten',
    ],
    vitals: { puls: 122, rr: [96, 58], spo2: 90, af: 30, temp: 36.5, bz: 100, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'rr', 'puls'],
    distractors: ['Rippenprellung nach Faustschlag', 'Panikattacke mit Hyperventilation', 'Akuter Asthmaanfall'],
    explanation:
      'Eigenschutz zuerst: Erst nach Freigabe durch die Polizei an den Patienten. Eine kleine Einstichstelle täuscht, die Verletzung innen kann Lunge oder Brustfell betreffen. Zunehmende Atemnot und Schockzeichen sind Alarm: Wunde abdecken, auch Rücken kontrollieren, Notarzt nachfordern.',
  },
  {
    id: 'stich-pfahl',
    bild: 'stich',
    difficulty: 2,
    patient: { name: 'Frank Nolte', age: 44, sex: 'm' },
    location: 'Trier, Gartenzaun in einem Wohngebiet',
    dispatch: 'Mann am Gartenzaun gestürzt, ein Gegenstand steckt im Bein.',
    scene:
      'Frank sitzt halb aufgerichtet am Zaun, Nachbarn stützen ihn. Eine abgebrochene Zaunlatte steckt in seinem rechten Oberschenkel.',
    anamnese: [
      '„Ich wollte nur über den Zaun, habe meinen Schlüssel vergessen.“',
      'Beim Überklettern ist er abgerutscht und auf eine Latte gefallen. Ein Nachbar wollte sie schon herausziehen.',
      'Nimmt keine Medikamente, die Tetanusimpfung ist lange her.',
    ],
    befund: [
      'Holzlatte steckt etwa eine Handbreit im rechten Oberschenkel',
      'Mäßige Blutung rund um die Latte',
      'Fuß warm, Zehen beweglich, Gefühl vorhanden',
      'Bein nicht verkürzt, keine Fehlstellung',
    ],
    vitals: { puls: 106, rr: [128, 80], spo2: 98, af: 20, temp: 36.8, bz: 102, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Oberflächliche Schürfwunde', 'Offener Oberschenkelbruch', 'Muskelfaserriss'],
    explanation:
      'Ein steckender Gegenstand bleibt stecken: Er kann verletzte Gefäße verschließen, beim Herausziehen blutet es stark. Fremdkörper polstern und fixieren, Blutung drumherum stillen, Länge mit der Feuerwehr kürzen lassen und mit Notarzt in die Klinik bringen.',
  },
  {
    id: 'poly-motorrad',
    bild: 'poly',
    difficulty: 3,
    patient: { name: 'Lukas Orlowski', age: 28, sex: 'm' },
    location: 'Ansbach, Landstraße bei Lehrberg',
    dispatch: 'Unfall auf der Landstraße, Motorrad gegen Pkw, Fahrer liegt neben der Fahrbahn.',
    scene:
      'Das Motorrad liegt im Graben, der Pkw steht quer auf der Straße. Lukas liegt mit Helm im Gras neben der Fahrbahn, Ersthelfer halten ihn davon ab aufzustehen.',
    anamnese: [
      'Pkw-Fahrerin: „Er kam aus der Kurve, ich habe ihn zu spät gesehen.“',
      '„Mein Bein, mein Bauch … wo bin ich eigentlich?“',
      'Zeugen: Er ist mit hoher Geschwindigkeit aufgeprallt, mehrere Meter weit geflogen und kurz benommen gewesen.',
    ],
    befund: [
      'Linker Oberschenkel deformiert und nach außen verdreht',
      'Bauch gespannt und druckschmerzhaft',
      'Blasse, kühle Haut, schnelle flache Atmung',
      'Helm sitzt fest, keine Blutung aus Nase oder Ohren',
    ],
    vitals: { puls: 126, rr: [88, 52], spo2: 93, af: 28, temp: 36.2, bz: 112, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['rr', 'puls', 'af'],
    distractors: [
      'Isolierter Oberschenkelbruch',
      'Gehirnerschütterung (leichtes Schädel-Hirn-Trauma)',
      'Panikreaktion nach dem Unfall',
    ],
    explanation:
      'Hoher Unfallmechanismus plus Schock plus mehrere Verletzungen: Das ist ein Polytrauma. Das fehlgestellte Bein lenkt ab, der Schock deutet auf innere Blutung im Bauch hin. Notarzt oder Hubschrauber, Wärmeerhalt, Kopf achsengerecht halten und rasch ins Traumazentrum.',
  },
  {
    id: 'poly-baum',
    bild: 'poly',
    difficulty: 3,
    patient: { name: 'Claudia Naumann', age: 45, sex: 'w' },
    location: 'Prenzlau, Landstraße in der Uckermark',
    dispatch: 'Pkw gegen Baum, Fahrerin eingeklemmt, ansprechbar, Atemnot.',
    scene:
      'Nachts, Nieselregen. Die Front des Wagens ist am Baum zerdrückt, die Feuerwehr leuchtet aus und sichert das Fahrzeug. Claudia sitzt eingeklemmt am Steuer.',
    anamnese: [
      '„Ich bin von der Straße abgekommen, es war so glatt.“',
      '„Ich bekomme so schlecht Luft, und der Bauch tut weh.“',
      'Sie war angeschnallt, der Airbag hat ausgelöst, beide Beine stecken im Fußraum fest.',
    ],
    befund: [
      'Prellmarke des Lenkrads auf dem Brustkorb',
      'Bauch druckschmerzhaft',
      'Blass, schwitzend, schnelle flache Atmung',
      'Zehen beidseits spürbar und beweglich',
    ],
    vitals: { puls: 128, rr: [92, 58], spo2: 88, af: 30, temp: 36.2, bz: 118, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'rr', 'puls'],
    distractors: ['Rippenprellung ohne innere Verletzungen', 'Herzinfarkt als Unfallursache', 'Panikattacke nach dem Schreck'],
    explanation:
      'Ansprechbar heißt nicht stabil: Atemnot, niedrige Sättigung, Prellmarke und Bauchschmerz weisen auf Brust- und Bauchverletzungen hin. Notarzt nachfordern, mit der Feuerwehr eine schonende technische Rettung absprechen, Wärmeerhalt und Transport ins Traumazentrum.',
  },
  {
    id: 'strom-heimwerker',
    bild: 'strom',
    difficulty: 2,
    patient: { name: 'Thomas Mangold', age: 40, sex: 'm' },
    location: 'Osnabrück, Einfamilienhaus, Keller',
    dispatch: 'Mann im Keller kurz bewusstlos gewesen, jetzt wieder wach.',
    scene:
      'Thomas sitzt auf der Kellertreppe, eine Bohrmaschine liegt am Boden. Seine Frau hat die Sicherung ausgeschaltet. Ich betrete den Keller erst, nachdem sie das bestätigt hat.',
    anamnese: [
      '„Ich wollte nur ein Loch bohren, dann wurde alles schwarz.“',
      'Seine Frau: „Er lag etwa eine Minute am Boden und war nicht ansprechbar.“',
      'Das Kabel der Bohrmaschine war schon länger schadhaft, jetzt spürt er Herzstolpern und Kribbeln im Arm.',
    ],
    befund: [
      'Kleine graue Marken an der rechten Hand und am linken Fuß',
      'Kribbeln im rechten Arm, Hand beweglich',
      'Gelegentlich unregelmäßige Pulsschläge tastbar',
      'Pupillen gleich groß, reagieren prompt',
    ],
    vitals: {
      puls: 108,
      rr: [138, 86],
      spo2: 97,
      af: 20,
      temp: 36.7,
      bz: 100,
      gcs: 15,
      ekg: 'Sinustachykardie mit vereinzelten ventrikulären Extrasystolen',
    },
    keyVitals: ['ekg', 'puls'],
    distractors: ['Epileptischer Krampfanfall', 'Kreislaufkollaps (Synkope)', 'Schlaganfall'],
    explanation:
      'Eigenschutz: Erst Strom abschalten, dann zum Patienten. Die kleinen Strommarken verraten den Weg des Stroms durch den Körper. Auch wenn er wach ist, kann das Herz Rhythmusstörungen entwickeln: EKG anlegen, Monitor-Überwachung und Transport in die Klinik.',
  },
  {
    id: 'strom-kind',
    bild: 'strom',
    difficulty: 2,
    patient: { name: 'Mia Nguyen', age: 4, sex: 'w' },
    location: 'Chemnitz, Wohnung im Stadtteil Kaßberg',
    dispatch: 'Kleinkind hat laut geschrien, Verletzung am Mund.',
    scene:
      'Mia sitzt auf dem Schoß der Mutter im Wohnzimmer. Auf dem Teppich liegt ein Verlängerungskabel mit beschädigter Isolierung, der Stecker ist gezogen.',
    anamnese: [
      'Mutter: „Sie war nur kurz allein im Zimmer.“',
      '„Sie hat einmal laut geschrien und sich dann schnell beruhigt.“',
      'Mia hat auf das Kabel gebissen, das in der Steckdose steckte, danach war ihr Mundwinkel weiß.',
    ],
    befund: [
      'Graue, trockene Wunde am linken Mundwinkel',
      'Wach, spielt wieder mit dem Stoffhasen',
      'Keine Atemnot, keine Krämpfe',
    ],
    vitals: { puls: 130, rr: [96, 58], spo2: 98, af: 26, temp: 36.7, bz: 94, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['ekg', 'spo2'],
    distractors: ['Verbrühung durch heißen Tee', 'Allergische Reaktion mit Lippenschwellung', 'Verätzung durch Reinigungsmittel'],
    explanation:
      'Kleine Strommarken täuschen: Auch wenn das Kind fit wirkt, gehören EKG und Klinik dazu, Rhythmusstörungen können später auftreten. Am Mundwinkel kann es Tage danach beim Ablösen des Schorfs nachbluten. Eltern darauf hinweisen, Steckdosen sichern.',
  },
  {
    id: 'ertrinken-baggersee',
    bild: 'ertrinken',
    difficulty: 2,
    patient: { name: 'Marvin Otto', age: 34, sex: 'm' },
    location: 'Ingolstadt, Badestrand am Baggersee',
    dispatch: 'Badegast aus dem See gezogen, hustet stark und ist verwirrt.',
    scene:
      'Am Badestrand wickeln Badegäste Marvin in Handtücher. Er sitzt vornübergebeugt, hustet und zittert. Ein Rettungsschwimmer steht neben ihm.',
    anamnese: [
      '„Mir ist so kalt, und ich weiß nicht richtig, was passiert ist.“',
      'Rettungsschwimmer: „Er ist weit draußen untergegangen und war ein bis zwei Minuten unter Wasser.“',
      'Seit dem Herausziehen hustet er, ihm ist übel, beim Husten kommt schaumiger Schleim.',
    ],
    befund: [
      'Schaumiger, leicht rosafarbener Auswurf',
      'Zittert, Haut kühl',
      'Verwirrt, zeitlich nicht orientiert',
      'Feuchte Rasselgeräusche über beiden Lungen',
    ],
    vitals: { puls: 112, rr: [124, 78], spo2: 88, af: 28, temp: 36.1, bz: 108, gcs: 14, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'af', 'gcs'],
    distractors: ['Akutes Lungenödem (Herzschwäche)', 'Asthmaanfall', 'Kreislaufkollaps durch Kälte und Anstrengung'],
    explanation:
      'Wasser in der Lunge führt zu Sauerstoffmangel, auch wenn der Patient wach ist. Komplikationen wie ein Lungenödem können sich erst nach Stunden entwickeln. Sauerstoff, Wärmeerhalt, Monitor, und: Auch „gerettet und wach“ gehört immer in die Klinik.',
  },
  {
    id: 'ertrinken-pool',
    bild: 'ertrinken',
    difficulty: 3,
    patient: { name: 'Lena Nikolić', age: 3, sex: 'w' },
    location: 'Saarbrücken, Reihenhausgarten mit Pool',
    dispatch: 'Kleinkind im Garten leblos aus dem Pool gezogen, Vater führt Wiederbelebung durch.',
    scene:
      'Lena liegt in Seitenlage auf der Terrasse, ihr Haar ist nass, der Vater kniet zitternd neben ihr. Neben dem Pool liegt Spielzeug, die Gartentür stand offen.',
    anamnese: [
      'Vater: „Ich war nur kurz im Haus, das Telefon hat geklingelt.“',
      'Er fand sie reglos im Wasser und begann sofort mit Beatmung und Herzdruckmassage.',
      'Nach etwa vier Minuten hustete sie und atmet seitdem wieder selbst, sie hat erbrochen.',
    ],
    befund: [
      'Lippen und Gesicht bläulich',
      'Erbricht Wasser und Mageninhalt',
      'Reagiert nur auf Schmerzreize, stöhnt',
      'Haut kühl und nass',
    ],
    vitals: { puls: 150, rr: [88, 50], spo2: 82, af: 44, temp: 34.8, bz: 90, gcs: 8, ekg: 'Sinustachykardie' },
    keyVitals: ['spo2', 'gcs', 'puls'],
    distractors: ['Epileptischer Krampfanfall', 'Schädel-Hirn-Trauma nach Sturz', 'Fieberkrampf'],
    explanation:
      'Bei Kindern entsteht der Kreislaufstillstand durch Sauerstoffmangel, die Beatmung ist deshalb entscheidend. Auch wenn sie wieder atmet: Sauerstoff, Seitenlage mit Absaugbereitschaft, nass entkleiden, Wärmeerhalt, Notarzt nachfordern und in die Kinderklinik. Die Atmung kann jederzeit wieder aussetzen.',
  },
  {
    id: 'verbruehung-kind',
    bild: 'verbruehung',
    difficulty: 1,
    patient: { name: 'Ben Möller', age: 2, sex: 'm' },
    location: 'Wiesbaden, Küche einer Mietwohnung',
    dispatch: 'Kleinkind schreit, Hautverletzung in der Küche.',
    scene:
      'Ben schreit im Arm seiner Mutter. Auf dem Küchenboden liegt eine umgekippte Tasse neben einer Pfütze, seine nasse Kleidung liegt daneben.',
    anamnese: [
      'Mutter: „Er war nur eine Sekunde allein und hat am Tischtuch gezogen.“',
      'Eine frisch aufgegossene Tasse Tee kippte auf Brust und Arm, die Mutter hat sofort die Kleidung ausgezogen.',
      'Sie hat ihn einen Moment unter lauwarmes Wasser gehalten, jetzt zittert er.',
    ],
    befund: [
      'Gerötete Haut mit Blasen an Brust und linkem Arm (etwa 8 %)',
      'Haut feucht und sehr schmerzhaft',
      'Kind schreit kräftig und zittert',
      'Gesicht frei, keine Atemnot',
    ],
    vitals: { puls: 148, rr: [98, 60], spo2: 98, af: 34, temp: 35.8, bz: 96, gcs: 15, ekg: 'Sinustachykardie' },
    keyVitals: ['puls', 'temp'],
    distractors: ['Sonnenbrand', 'Allergische Nesselsucht', 'Verätzung durch Haushaltsreiniger'],
    explanation:
      'Die Mutter hat vieles richtig gemacht: Kleidung sofort entfernt, kurz mit lauwarmem Wasser gekühlt. Kleinkinder kühlen sehr schnell aus, deshalb nicht lange kühlen. Wunden steril abdecken, Wärmeerhalt, Klinik. Die Handfläche des Kindes entspricht etwa 1 %.',
  },
  {
    id: 'verbruehung-waermflasche',
    bild: 'verbruehung',
    difficulty: 3,
    patient: { name: 'Hildegard Oswald', age: 76, sex: 'w' },
    location: 'Flensburg, Wohnung im Stadtteil Mürwik',
    dispatch: 'Seniorin mit Wunde am Bein, Pflegedienst bittet um Abklärung.',
    scene:
      'Hildegard sitzt im Sessel und wirkt unbesorgt. Auf dem Beistelltisch liegt eine geplatzte Gummiflasche, die Wolldecke auf ihren Knien ist noch feucht.',
    anamnese: [
      '„Das ist nichts, ich habe gestern Abend nur die Flasche aufs Bein gelegt.“',
      'Die Flasche war undicht und das heiße Wasser lief auf den Oberschenkel, bemerkt hat sie das erst am Morgen.',
      'Seit Jahren Zucker mit Nervenschäden, sie „spürt kaum etwas“ in den Beinen.',
    ],
    befund: [
      'Handtellergroße weißlich-ledrige Hautstelle am rechten Oberschenkel',
      'Randbereich gerötet, einzelne Blasen',
      'Hautstelle kaum schmerzhaft bei Berührung',
      'Bein warm, Fußpuls tastbar, kein Fieber',
    ],
    vitals: { puls: 92, rr: [148, 86], spo2: 96, af: 18, temp: 36.9, bz: 232, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['bz', 'rr'],
    distractors: ['Wundrose (Erysipel)', 'Druckgeschwür (Dekubitus)', 'Durchblutungsstörung des Beins'],
    explanation:
      'Die fehlenden Schmerzen sind der Schlüssel: Bei Nervenschäden wird eine tiefe Verbrühung kaum gespürt, weißlich-lederartige Haut zeigt tiefe Schädigung. Schmerzlosigkeit beruhigt nicht. Wunde steril abdecken, nicht weiter kühlen, Blutzucker messen und Klinikvorstellung.',
  },
  {
    id: 'biss-hund-kind',
    bild: 'biss',
    difficulty: 2,
    patient: { name: 'Jonas Nowak', age: 7, sex: 'm' },
    location: 'Karlsruhe, Stadtpark an der Spielwiese',
    dispatch: 'Kind im Park im Gesicht verletzt, Wunde blutet.',
    scene:
      'Jonas sitzt auf einer Bank, eine Spaziergängerin drückt ihm ein Tuch an die Wange. Etwas abseits hält ein Mann einen angeleinten Hund fest.',
    anamnese: [
      '„Ich wollte ihn doch nur streicheln.“',
      'Der Hund des Nachbarn hat plötzlich zugeschnappt, der Halter ist dabei und kennt das Tier gut.',
      'Der Halter sagt, der Hund sei geimpft, den Impfausweis des Kindes hat die Mutter zu Hause.',
    ],
    befund: [
      'Klaffende Wunde an der rechten Wange, etwa 4 cm, mit Zahnabdrücken',
      'Mäßige Blutung, mit Druck gut zu stoppen',
      'Auge, Lid und Mundwinkel unverletzt',
      'Kind ruhig, aber ängstlich',
    ],
    vitals: { puls: 118, rr: [102, 62], spo2: 99, af: 24, temp: 36.7, bz: 94, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Platzwunde nach Sturz', 'Schnittwunde durch Glasscherbe', 'Allergische Gesichtsschwellung'],
    explanation:
      'Wunden durch Tierzähne sind verschmutzt und infektionsgefährdet, auch wenn sie klein aussehen. Gesichtswunden bei Kindern gehören in die Klinik. Blutung mit Druck stillen, steril abdecken, Daten und Impfstatus des Hundes sowie Tetanusschutz des Kindes erfragen.',
  },
  {
    id: 'biss-postbote',
    bild: 'biss',
    difficulty: 1,
    patient: { name: 'Wolfgang Marx', age: 50, sex: 'm' },
    location: 'Gera, Einfamilienhaussiedlung',
    dispatch: 'Zusteller am Gartenzaun verletzt, Unterarm blutet.',
    scene:
      'Wolfgang lehnt neben seinem Zustellrad am Zaun, Briefe liegen verstreut. Hinter dem Tor bellt ein Schäferhund, die Besitzerin hält ihn am Halsband.',
    anamnese: [
      '„Ich wollte nur die Post einwerfen.“',
      'Als er durch die Lücke im Zaun fasste, hat der Hund nach seinem Unterarm geschnappt.',
      'Tetanusimpfung: „Weiß ich nicht mehr, das ist schon ewig her.“',
    ],
    befund: [
      'Mehrere Zahnabdrücke am rechten Unterarm, Haut teils eingerissen',
      'Sickernde Blutung, mit Druckverband beherrschbar',
      'Hand warm, Finger voll beweglich',
    ],
    vitals: { puls: 96, rr: [140, 88], spo2: 98, af: 18, temp: 36.8, bz: 98, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['puls', 'rr'],
    distractors: ['Schürfwunde am Zaun', 'Wespenstich', 'Quetschung durch das Gartentor'],
    explanation:
      'Zahnabdrücke und Hundekontakt zeigen die Ursache. Solche Wunden infizieren sich leicht, der unklare Tetanusschutz ist ein weiterer Grund für die Klinik. Wunde steril abdecken, Arm hochlagern, Angaben zum Hund und Besitzer für die Meldung festhalten.',
  },
  {
    id: 'augen-splitter',
    bild: 'augen',
    difficulty: 2,
    patient: { name: 'Daniel Neumann', age: 33, sex: 'm' },
    location: 'Ulm, Autowerkstatt',
    dispatch: 'Mechaniker in der Werkstatt, Verletzung am Auge.',
    scene:
      'Daniel hält sich die Hand vors rechte Auge. Neben der Werkbank liegt ein Winkelschleifer, an der Wand hängt eine unbenutzte Schutzbrille.',
    anamnese: [
      '„Es fühlt sich an, als wäre da Sand im Auge.“',
      'Er hat ohne Schutzbrille an einem Stahlträger geschliffen, es flogen Funken ins Gesicht.',
      'Er hat schon mehrfach gerieben, seitdem ist es schlimmer und helles Licht tut weh.',
    ],
    befund: [
      'Rechtes Auge gerötet, tränt stark, Lid krampfhaft geschlossen',
      'Kleiner dunkler Punkt auf dem Augapfel sichtbar',
      'Sehen rechts verschwommen, linkes Auge unauffällig',
    ],
    vitals: { puls: 92, rr: [144, 88], spo2: 99, af: 16, temp: 36.7, bz: 100, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Bindehautentzündung', 'Akuter Glaukomanfall', 'Migräne mit Sehstörung'],
    explanation:
      'Fremdkörpergefühl, Tränen und Lichtscheu nach dem Schleifen ohne Schutzbrille deuten auf einen Metallsplitter im Auge. Nicht reiben, nichts entfernen. Beide Augen locker abdecken, damit sich das verletzte Auge nicht mitbewegt, und in die Augenklinik bringen.',
  },
  {
    id: 'augen-reiniger',
    bild: 'augen',
    difficulty: 1,
    patient: { name: 'Petra Ostermann', age: 41, sex: 'w' },
    location: 'Oldenburg, Wohnung im Bahnhofsviertel',
    dispatch: 'Frau hat Flüssigkeit in den Augen, starke Schmerzen.',
    scene:
      'Petra steht im Flur, hält ein feuchtes Tuch vors Gesicht und kneift die Augen zu. Im Bad steht eine offene Flasche mit Abflussreiniger, der Boden ist nass.',
    anamnese: [
      '„Es brennt so, ich kann die Augen nicht öffnen!“',
      'Beim Ausgießen in das verstopfte Waschbecken ist die Flüssigkeit hochgespritzt.',
      'Seit etwa fünf Minuten wird das Brennen schlimmer, Wasser hat sie noch nicht benutzt.',
    ],
    befund: [
      'Beide Augen stark gerötet, tränen, Lidkrampf',
      'Haut im Gesicht ohne Reizung',
      'Sieht nur schemenhaft',
      'Keine Atemnot, kein Husten',
    ],
    vitals: { puls: 100, rr: [144, 90], spo2: 98, af: 20, temp: 36.6, bz: 102, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Bindehautentzündung durch Viren', 'Allergische Reaktion', 'Akuter Glaukomanfall'],
    explanation:
      'Bei Spritzern von Chemikalien zählt jede Sekunde: Sofort lange mit viel Wasser spülen, die Lider dabei spreizen, vom inneren zum äußeren Augenwinkel. Nicht neutralisieren. Die Flasche oder das Etikett mitnehmen und danach in die Augenklinik.',
  },
  {
    id: 'kopfplatz-marcumar',
    bild: 'kopfplatz',
    difficulty: 2,
    patient: { name: 'Gertrud Maier', age: 81, sex: 'w' },
    location: 'Bamberg, Wohnung in der Altstadt',
    dispatch: 'Seniorin gestürzt, Kopf blutet stark.',
    scene:
      'Gertrud sitzt auf dem Küchenboden, ein Geschirrtuch auf dem Kopf, das Tuch ist rot durchtränkt. Die Nachbarin hat den Notruf gewählt.',
    anamnese: [
      '„Ich bin über den Teppich gestolpert, mehr war nicht.“',
      'Sie war ein paar Sekunden benommen, weiß aber nicht genau, wann es passierte.',
      'Nimmt wegen eines Herzleidens täglich Blutverdünner, seit dem Sturz hat sie Kopfschmerzen.',
    ],
    befund: [
      'Platzwunde am Hinterkopf, etwa 5 cm, blutet kräftig',
      'Pupillen gleich groß, Arme und Beine seitengleich, Sprache klar',
      'Etwas verlangsamt, fragt wiederholt dasselbe',
      'Hüfte und Beine schmerzfrei',
    ],
    vitals: {
      puls: 82,
      rr: [158, 88],
      spo2: 96,
      af: 18,
      temp: 36.5,
      bz: 118,
      gcs: 14,
      ekg: 'Vorhofflimmern mit absoluter Arrhythmie, Kammerfrequenz ca. 82/min',
    },
    keyVitals: ['gcs', 'rr'],
    distractors: ['Schlaganfall mit Sturz', 'Unterzuckerung (Hypoglykämie)', 'Oberschenkelhalsbruch'],
    explanation:
      'Unter Blutverdünnung blutet die Kopfhaut stärker, auch im Schädel kann sich eine Blutung entwickeln. Kopfschmerz, leichte Verwirrtheit und GCS 14 sind Warnzeichen. Wunde mit Druckverband versorgen, Bewusstsein wiederholt prüfen und immer in die Klinik, auch wenn die Wunde klein wirkt.',
  },
  {
    id: 'kopfplatz-treppe',
    bild: 'kopfplatz',
    difficulty: 1,
    patient: { name: 'Rudolf Nagel', age: 72, sex: 'm' },
    location: 'Regensburg, Kellerabgang eines Mehrfamilienhauses',
    dispatch: 'Mann auf der Kellertreppe gestürzt, blutet am Kopf.',
    scene:
      'Rudolf sitzt auf der untersten Stufe, ein Handtuch am Hinterkopf, auf den Stufen und am Hemd ist viel Blut. Seine Frau steht aufgeregt daneben.',
    anamnese: [
      '„Ich bin ausgerutscht, die Stufe war nass.“',
      'Kein Bewusstseinsverlust, kein Erbrechen, er erinnert sich an alles.',
      'Nimmt nur Tabletten gegen Bluthochdruck, keine Blutverdünner.',
    ],
    befund: [
      'Platzwunde am Hinterkopf, etwa 4 cm, blutet kräftig',
      'Wach, orientiert, Pupillen gleich groß',
      'Nacken frei beweglich, kein Nackenschmerz',
    ],
    vitals: { puls: 88, rr: [158, 92], spo2: 97, af: 16, temp: 36.6, bz: 104, gcs: 15, ekg: 'Sinusrhythmus' },
    keyVitals: ['rr', 'puls'],
    distractors: ['Schlaganfall', 'Kreislaufkollaps (Synkope)', 'Nackenwirbelbruch'],
    explanation:
      'Die Kopfhaut ist stark durchblutet, deshalb bluten Platzwunden dort kräftig, auch wenn sie harmlos sind. Mit Druckverband versorgen, aber trotzdem auf Zeichen eines Schädel-Hirn-Traumas achten: Erbrechen, Verwirrtheit, ungleiche Pupillen, zunehmender Kopfschmerz.',
  },
];
