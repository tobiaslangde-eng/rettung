import { Incident } from '../incidents';

/**
 * Medizinische Zwischenfälle je Krankheitsbild für die Einsätze aus den Akten.
 * `{name}` wird beim Spielen durch den Vornamen des Patienten ersetzt. Die erste Option ist die richtige.
 */
export const ZF_BILD: Record<string, Incident[]> = {
  vhf: [
    {
      afterMeasurements: 2,
      text: 'Auf dem Monitor springt der Rhythmus auf 190/min, {name} wird blass und greift sich an die Brust, der Blutdruck fällt.',
      options: ['Instabile Tachykardie: Notarzt sofort, Defibrillator bereit, elektrische Kardioversion nach SOP vorbereiten', 'Weiter beruhigen und abwarten, ob sich das Herzrasen von selbst wieder legt', 'Aufstehen und Treppen steigen lassen, damit sich der Puls wieder normalisiert'],
      explanation: 'Wenn Herzrasen mit Blutdruckabfall oder Brustschmerz einhergeht, ist es instabil. Dann hilft ein Stromstoß (Kardioversion) unter ärztlicher Leitung.',
    },
  ],
  aorta: [
    {
      afterMeasurements: 1,
      text: 'Der Schmerz wandert in den Bauch, {name} wird kaltschweißig und der Blutdruck bricht ein.',
      options: ['Schockzeichen: flach, Wärmeerhalt, zwei große Zugänge, Notarzt, Klinik mit Gefäßchirurgie ohne Verzögerung', 'Auf dem Boden sitzen lassen, beruhigen und den Verlauf in Ruhe beobachten', 'Blutdrucksenker geben, damit der Druck auf die Gefäße nachlässt, und abwarten'],
      explanation: 'Ein Riss der Hauptschlagader kann innerhalb von Minuten zum Verbluten führen. Jede Verzögerung ist gefährlich.',
    },
  ],
  ags: [
    {
      afterMeasurements: 2,
      text: 'Der Schmerz in der Brust wird schlagartig stärker, auf dem Monitor erscheinen ST-Hebungen.',
      options: ['Jetzt STEMI: Notarzt, Herzkatheterlabor voranmelden, strikte Ruhe, Defibrillator bereit', 'Den Verlauf als harmlos abtun, weil das EKG vorher unauffällig war, und weiter beobachten', 'Aufstehen lassen, denn Bewegung entlastet den Kreislauf und bringt das Herz wieder in Gang'],
      explanation: 'Ein NSTEMI kann jederzeit in einen STEMI übergehen. Dann zählt jede Minute bis zur Herzkatheter-Behandlung.',
    },
  ],
  brady: [
    {
      afterMeasurements: 2,
      text: 'Der Puls fällt auf 28/min, {name} reagiert nur noch verzögert und wird grau.',
      options: ['Schwere Bradykardie: Pads kleben, Atropin bzw. Schrittmacher durch den Notarzt, Sauerstoff, flach lagern', 'Aufstehen lassen und etwas Warmes zu trinken geben, damit der Kreislauf anspringt', 'Einen starken Kaffee kochen und dem Patienten anbieten, bis es ihm besser geht'],
      explanation: 'Ein sehr langsamer Puls kann zu Bewusstlosigkeit und Herzstillstand führen. Schrittmacher oder Medikamente sind die Lösung.',
    },
  ],
  hyperkali: [
    {
      afterMeasurements: 2,
      text: 'Das EKG zeigt hohe, spitze T-Wellen und breite Kammerkomplexe, {name} wird apathisch.',
      options: ['Lebensbedrohliche Rhythmusstörung: Notarzt sofort, Kalzium nach SOP, Defibrillator bereit', 'Viel Wasser trinken lassen, damit das Kalium aus dem Blut gespült wird', 'Aufstehen und zum Fahrzeug laufen lassen, um Zeit zu sparen und den Transport zu beschleunigen'],
      explanation: 'Zu viel Kalium bringt das Herz aus dem Takt. Kalzium schützt das Herz kurzfristig, Dialyse behandelt die Ursache.',
    },
  ],
  spontanptx: [
    {
      afterMeasurements: 2,
      text: 'Die Atemnot nimmt zu, die Sättigung fällt, die Halsvenen werden dick.',
      options: ['Spannungspneumothorax droht: Notarzt, Entlastungspunktion bereit, Sauerstoff, schneller Transport', 'Hinlegen und abwarten, bis sich die Atemnot beruhigt und die Sättigung wieder steigt', 'Den Brustkorb fest bandagieren, damit die Rippen stabil bleiben und weniger schmerzen'],
      explanation: 'Ein kleiner Pneumothorax kann zum lebensgefährlichen Überdruck im Brustkorb werden. Dann hilft nur die Entlastung.',
    },
  ],
  pneumonie: [
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich schläfrig, die Atmung wird flach und die Sättigung fällt auf 82 %.',
      options: ['Hochdosiert Sauerstoff, Notarzt nachfordern, Atemunterstützung vorbereiten, schneller Transport', 'Schlafen lassen, denn die Erschöpfung gehört zur Krankheit und gibt sich mit Ruhe', 'Mit Wasser aufwecken und zum Husten und Tiefatmen auffordern, bis die Sättigung steigt'],
      explanation: 'Schwere Lungenentzündungen können in Atemversagen übergehen. Sauerstoff und Notarzt, nicht abwarten.',
    },
  ],
  bolus: [
    {
      afterMeasurements: 1,
      text: 'Der Husten wird leiser, {name} fasst sich an den Hals und kann nicht mehr sprechen.',
      options: ['Bis zu fünf Schläge zwischen die Schulterblätter, danach Heimlich-Griffe, Notarzt alarmieren', 'Einen großen Schluck Wasser nachtrinken lassen, damit der Bissen nach unten rutscht', 'Warten, ob sich der Fremdkörper von selbst löst, und dabei weiter zureden'],
      explanation: 'Wenn der Husten schwächer wird, reicht die Kraft nicht mehr aus. Dann ist aktive Hilfe nötig.',
    },
  ],
  panik: [
    {
      afterMeasurements: 2,
      text: '{name} sagt: „Mein Herz bleibt gleich stehen!“ und will weglaufen.',
      options: ['Nicht allein lassen, EKG zeigen und erklären, ruhig bleiben, körperliche Ursache sicher ausschließen', 'Weglaufen lassen, weil frische Luft und Bewegung gegen die Angst am besten helfen', 'Anschreien, dass es keinen Grund für Panik gibt, und die Lage damit beenden'],
      explanation: 'Ruhe, Orientierung und Begleitung helfen. Gleichzeitig dürfen wir nie voreilig eine „Panikattacke“ diagnostizieren.',
    },
  ],
  rauchgas: [
    {
      afterMeasurements: 2,
      text: 'Die Stimme von {name} wird heiser, es pfeift beim Einatmen, die Lippen werden blau.',
      options: ['Atemweg gefährdet: Notarzt sofort, Sauerstoff, Intubationsbereitschaft, Oberkörper hoch', 'Etwas zu trinken geben, damit sich die gereizte Schleimhaut beruhigt und der Hals frei wird', 'Flach hinlegen und abwarten, bis die Heiserkeit und das Pfeifen von selbst vergehen'],
      explanation: 'Verbrannte Atemwege schwellen zu. Das passiert schnell – frühzeitig Notarzt und Atemwegsmanagement.',
    },
  ],
  tia: [
    {
      afterMeasurements: 2,
      text: 'Plötzlich hängt der Mundwinkel von {name} wieder herunter, die Sprache wird undeutlich.',
      options: ['Wieder aufgetretene Ausfälle: Zeit notieren, Notarzt, Stroke Unit voranmelden, sofortiger Transport', 'Abwarten wie vorhin, die Symptome sind ja auch beim ersten Mal von selbst verschwunden', 'Zu Hause ausruhen lassen und dem Hausarzt am nächsten Tag Bescheid geben'],
      explanation: 'Eine TIA kann der Vorbote eines Schlaganfalls sein. Wenn die Symptome zurückkehren, ist es ein Schlaganfall.',
    },
  ],
  sab: [
    {
      afterMeasurements: 2,
      text: '{name} erbricht, wird schläfrig und krampft kurz.',
      options: ['Seitenlage, Atemweg sichern, Absaugen, Notarzt, Neurochirurgie voranmelden', 'Aufsetzen und Wasser geben, damit sich der Kreislauf nach dem Erbrechen erholt', 'Ein Kopfschmerzmittel geben und weiter beobachten, ob sich der Zustand bessert'],
      explanation: 'Eine Hirnblutung kann den Druck im Kopf stark erhöhen. Atemweg sichern und schnell in die Fachklinik.',
    },
  ],
  meningitis: [
    {
      afterMeasurements: 1,
      text: 'Auf der Haut von {name} erscheinen dunkelrote, nicht wegdrückbare Flecken.',
      options: ['Alarmzeichen für Meningokokken-Sepsis: Notarzt sofort, Zugang, Volumen, Klinik voranmelden, Eigenschutz', 'Ein Pflaster auf die Flecken kleben und den Hausarzt am nächsten Morgen informieren', 'Abwarten, ob die Flecken von selbst wieder verschwinden, und den Fieberverlauf beobachten'],
      explanation: 'Nicht wegdrückbare Flecken (Glasspatel-Test) sind ein Warnzeichen für eine lebensgefährliche Blutvergiftung.',
    },
  ],
  migraene: [
    {
      afterMeasurements: 2,
      text: 'Die Sehstörung wird plötzlich schlimmer, und {name} bekommt eine Halbseitenschwäche.',
      options: ['Verdacht Schlaganfall: BE-FAST, Zeit notieren, Notarzt und Stroke Unit', 'Weiter mit der Migräne-Behandlung, weil die Beschwerden dazu passen und bekannt sind', 'Ausschlafen lassen und am nächsten Morgen noch einmal nach den Symptomen sehen'],
      explanation: 'Bei neurologischen Ausfällen muss man immer zuerst an einen Schlaganfall denken.',
    },
  ],
  lagerung: [
    {
      afterMeasurements: 1,
      text: 'Der Schwindel hört nicht auf, {name} bekommt Doppelbilder und Gleichgewichtsstörungen beim Sitzen.',
      options: ['Warnzeichen für zentrale Ursache: BE-FAST, Notarzt, Stroke Unit', 'Das Lagerungsmanöver wiederholen, bis der Schwindel nachlässt und die Beschwerden verschwinden', 'Etwas Alkohol gegen den Schwindel geben, damit der Patient entspannt und besser schläft'],
      explanation: 'Doppelbilder und Gangunsicherheit sprechen gegen harmlosen Lagerungsschwindel und für einen Schlaganfall im Kleinhirn.',
    },
  ],
  delir: [
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich laut, reißt die Elektroden ab und versucht aufzustehen.',
      options: ['Ruhig bleiben, Sicherheit herstellen, vertraute Person einbinden, Notarzt informieren', 'Den Patienten fixieren und festhalten, bis er sich beruhigt und aufhört, sich zu wehren', 'Allein im Zimmer lassen und die Tür schließen, damit er zur Ruhe kommt'],
      explanation: 'Im Delir braucht der Mensch Ruhe und Orientierung. Gewalt verschlimmert die Lage – Eigen- und Fremdgefährdung abwenden.',
    },
  ],
  belastung: [
    {
      afterMeasurements: 1,
      text: '{name} beginnt zu zittern, weint haltlos und will unbedingt zu den Unfallbeteiligten zurück.',
      options: ['Abschirmen, Decke, ruhig bleiben, bei {name} bleiben und Krisenhilfe nachfordern', 'Weggehen lassen, die Person soll sich bei den Unfallbeteiligten ausreden und zur Ruhe kommen', 'Anweisen: „Reißen Sie sich zusammen, es ist doch nichts passiert!“'],
      explanation: 'Akute Belastungsreaktionen sind normal. Sicherheit, Schutz und menschliche Nähe helfen am meisten.',
    },
  ],
  entzug: [
    {
      afterMeasurements: 2,
      text: '{name} bekommt plötzlich einen Krampfanfall.',
      options: ['Vor Verletzungen schützen, Zeit stoppen, Atemweg sichern, Notarzt: Medikament nach SOP', 'Den Patienten festhalten und ihm einen Beißkeil zwischen die Zähne schieben', 'Ein Glas Alkohol geben, damit sich das Nervensystem beruhigt und der Anfall endet'],
      explanation: 'Im Entzug können Krampfanfälle auftreten. Schutz, Atemweg, Notarzt – Alkohol ist keine Therapie.',
    },
  ],
  blinddarm: [
    {
      afterMeasurements: 2,
      text: 'Der Schmerz hört plötzlich auf, doch der Bauch wird hart wie ein Brett und {name} bekommt Fieber.',
      options: ['Durchbruch möglich: Schock vermeiden, Notarzt/Klinik voranmelden, Zugang und Volumen nach SOP', 'Gut, der Schmerz ist weg, der Patient kann in Ruhe nach Hause fahren und sich ausruhen', 'Essen und Trinken anbieten, damit der Kreislauf wieder stabil wird und Kraft kommt'],
      explanation: 'Wenn der Blinddarm platzt, lässt der Schmerz kurz nach, die Gefahr steigt aber. Das ist ein Notfall.',
    },
  ],
  galle: [
    {
      afterMeasurements: 2,
      text: '{name} bekommt Schüttelfrost, gelbe Augen und stärkere Schmerzen.',
      options: ['Verdacht auf Gallengangentzündung/Sepsis: Notarzt, Zugang, zügige Klinik', 'Wärmflasche auflegen und abwarten, ob sich die Beschwerden von selbst bessern', 'Etwas Fettiges essen lassen, damit die Gallenblase sich entleert und die Schmerzen nachlassen'],
      explanation: 'Eine Entzündung mit Fieber und Gelbsucht kann gefährlich werden und gehört sofort in die Klinik.',
    },
  ],
  ileus: [
    {
      afterMeasurements: 2,
      text: '{name} erbricht kotig riechenden Mageninhalt und verschluckt sich.',
      options: ['Seitenlage, Mund freimachen, absaugen, Notarzt, nüchtern lassen', 'Schnell etwas zu trinken geben, damit der Mund frei wird und der Geschmack verschwindet', 'Aufsetzen und weiterfüttern, damit der Magen nicht leer bleibt und Kraft vorhanden ist'],
      explanation: 'Beim Darmverschluss droht das Einatmen von Erbrochenem. Atemwege zuerst sichern.',
    },
  ],
  gastro: [
    {
      afterMeasurements: 2,
      text: '{name} wird beim Aufstehen schwarz vor Augen und sackt zusammen.',
      options: ['Sofort flach lagern, Beine hoch, Blutzucker messen, Flüssigkeit nach SOP', 'Aufstehen lassen und zum Fahrzeug begleiten, damit der Kreislauf wieder in Gang kommt', 'Kaltes Wasser ins Gesicht spritzen und kräftig an den Schultern rütteln, bis er reagiert'],
      explanation: 'Flüssigkeitsmangel lässt den Kreislauf einbrechen. Flach lagern und Flüssigkeit ersetzen.',
    },
  ],
  pyelo: [
    {
      afterMeasurements: 2,
      text: 'Der Blutdruck fällt auf 80 systolisch, {name} wird verwirrt und kalt schweißig.',
      options: ['Septischer Schock: Sauerstoff, Volumen, Notarzt, Voranmeldung Sepsis, zügig in die Klinik', 'Eine fiebersenkende Tablette geben und den Verlauf in Ruhe abwarten', 'Eine Wärmflasche auflegen und ruhen lassen, bis die Schmerzen nachlassen'],
      explanation: 'Aus Harnwegsinfekten kann eine Blutvergiftung entstehen. Frühe Behandlung rettet Leben.',
    },
  ],
  gib: [
    {
      afterMeasurements: 1,
      text: '{name} erbricht erneut hellrotes Blut und wird bewusstlos.',
      options: ['Seitenlage, Atemweg freihalten, absaugen, Sauerstoff, Notarzt, Volumen, Schockbehandlung', 'Aufsetzen und Wasser geben, damit der Mund frei wird und der Kreislauf stabil bleibt', 'Den Verlauf abwarten und die Menge des Blutes dokumentieren, bevor Hilfe angefordert wird'],
      explanation: 'Blutungen im Magen-Darm-Trakt können schnell zu Atemwegsproblemen und Schock führen.',
    },
  ],
  hoden: [
    {
      afterMeasurements: 1,
      text: 'Der Junge sagt zögernd, dass er sich schämt und keine Untersuchung möchte.',
      options: ['Einfühlsam bleiben, Privatsphäre schützen, Dringlichkeit erklären (Zeitfenster), Eltern einbinden, sofort Klinik', 'Das akzeptieren und gehen, denn gegen den Willen des Patienten darf man nichts tun', 'Ihn auslachen und vor den Eltern bloßstellen, damit er die Scham verliert'],
      explanation: 'Eine Hodentorsion muss innerhalb weniger Stunden operiert werden. Respekt und klare Information helfen, die Scham zu überwinden.',
    },
  ],
  oberschenkelhals: [
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich blass, der Puls steigt, der Blutdruck fällt – die Schmerzen sind kaum auszuhalten.',
      options: ['Schock durch Blutverlust: flach, Wärme, Zugang, Volumen, Schmerztherapie, Notarzt', 'Aufsetzen lassen, damit die Atmung leichter wird und der Kreislauf stabil bleibt', 'Das Bein bewegen, um zu prüfen, ob die Durchblutung noch in Ordnung ist'],
      explanation: 'Bei Brüchen des Oberschenkels können erhebliche Blutmengen verloren gehen. Schockzeichen erkennen und behandeln.',
    },
  ],
  sprunggelenk: [
    {
      afterMeasurements: 2,
      text: 'Der Fuß wird kalt und blass, die Zehen kribbeln, der Puls am Fuß ist nicht mehr tastbar.',
      options: ['Durchblutung gestört: Schiene lockern/Lage korrigieren, Notarzt informieren, sofort Klinik', 'Abwarten, in der Klinik wird ohnehin alles kontrolliert und der Fuß wird schon wieder warm', 'Den Fuß fester einwickeln, damit die Schwellung zurückgeht und die Schiene besser hält'],
      explanation: 'Fehlende Durchblutung ist ein Notfall: Das Gewebe stirbt in wenigen Stunden ab.',
    },
  ],
  schulterluxation: [
    {
      afterMeasurements: 2,
      text: 'Die Hand von {name} wird taub und kalt, der Radialispuls ist schwach.',
      options: ['Nerven-/Gefäßverletzung möglich: Schonhaltung beibehalten, DMS prüfen, schnell Klinik, Notarzt informieren', 'Den Arm kräftig schwingen lassen, damit der Schmerz nachlässt und die Durchblutung zurückkehrt', 'Das Einrenken selbst versuchen, damit die Gefäße entlastet werden und das Taubheitsgefühl vergeht'],
      explanation: 'Gefäße und Nerven können bei der Ausrenkung eingeklemmt werden. Nicht einrenken, schnell in die Klinik.',
    },
  ],
  rippen: [
    {
      afterMeasurements: 2,
      text: 'Die Atmung wird immer flacher und schmerzhafter, die Sättigung sinkt, unter der Haut knistert es.',
      options: ['Pneumothorax-Verdacht: Sauerstoff, Notarzt nachfordern, Entlastung vorbereiten, Klinik', 'Den Brustkorb fest einbinden, damit die Rippen stabil bleiben und die Atmung ruhiger wird', 'Flach hinlegen und abwarten, ob sich die Atmung von selbst beruhigt und die Sättigung steigt'],
      explanation: 'Rippenbrüche können die Lunge verletzen. Hautknistern deutet auf Luft unter der Haut hin.',
    },
  ],
  wirbelsaeule: [
    {
      afterMeasurements: 1,
      text: '{name} sagt: „Ich spüre meine Beine nicht mehr!“ und versucht sich aufzurichten.',
      options: ['Sofort stoppen, Kopf und Rumpf in Achse halten, ruhig erklären, Immobilisation fortsetzen', 'Aufsetzen lassen, um zu testen, ob die Beine doch noch reagieren und das Gefühl zurückkehrt', 'Allein lassen und Hilfe holen, damit er sich nicht aufregt und ruhiger atmet'],
      explanation: 'Jede Bewegung kann das Rückenmark weiter schädigen. Ruhe, Immobilisation und Notarzt.',
    },
  ],
  schwersht: [
    {
      afterMeasurements: 2,
      text: 'Die Atmung von {name} wird unregelmäßig, der Puls fällt, eine Pupille ist maximal weit.',
      options: ['Einklemmung droht: Atemweg sichern, Beatmung, Notarzt sofort, Neurochirurgie voranmelden', 'Schlafen lassen, damit sich das Gehirn erholt und der Kopfschmerz nachlässt', 'Wasser geben, um die Sättigung zu verbessern, und den Patienten weiter beobachten'],
      explanation: 'Das sind Zeichen eines lebensbedrohlichen Hirndrucks (Cushing-Reflex). Jede Minute zählt.',
    },
  ],
  blutung: [
    {
      afterMeasurements: 1,
      text: 'Der Verband ist durchgeblutet, das Blut spritzt im Takt des Pulses.',
      options: ['Direkten Druck verstärken, Tourniquet nach Anleitung anlegen, Zeit notieren, Notarzt', 'Den Verband abnehmen und nachsehen, woher genau das Blut kommt, bevor man weitermacht', 'Ein Pflaster aufkleben und den Patienten bitten, die Wunde zu schonen und ruhig zu halten'],
      explanation: 'Arterielle Blutungen müssen sofort gestoppt werden – zur Not mit dem Tourniquet.',
    },
  ],
  amputation: [
    {
      afterMeasurements: 2,
      text: '{name} wird blass und schwindelig, der Puls steigt.',
      options: ['Schockzeichen: flach lagern, Blutung kontrollieren, Zugang, Volumen, Wärmeerhalt', 'Aufstehen lassen, damit der Kreislauf wieder in Schwung kommt und die Hand nicht weiterblutet', 'Die Hand hängen lassen, damit das Blut ablaufen kann und die Wunde sich reinigt'],
      explanation: 'Auch bei kleineren Amputationen kann viel Blut verloren gehen. Blutung stillen und Schock behandeln.',
    },
  ],
  stich: [
    {
      afterMeasurements: 2,
      text: 'Der Blutdruck fällt, die Halsvenen werden dick, die Atemgeräusche links verschwinden.',
      options: ['Spannungspneumothorax/Herzbeuteltamponade möglich: Notarzt sofort, Entlastung, Voranmeldung Schockraum', 'Den Verband festziehen und abwarten, ob sich der Zustand nach einigen Minuten bessert', 'Den Patienten aufsetzen und zum Fahrzeug laufen lassen, damit der Transport schneller geht'],
      explanation: 'Stichverletzungen der Brust können lebensgefährlich werden, auch wenn von außen wenig zu sehen ist.',
    },
  ],
  poly: [
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich bewusstlos und atmet nicht mehr normal.',
      options: ['Atemweg sichern, Beatmung, bei Kreislaufstillstand Reanimation nach Traumaalgorithmus, Blutungen stillen', 'Beobachten, ob sich der Zustand von selbst bessert, und dabei die Messwerte dokumentieren', 'Die Halswirbelsäule überstrecken, damit der Atemweg frei wird, und abwarten'],
      explanation: 'Beim Polytrauma droht jederzeit der Kreislaufstillstand durch Blutverlust und Verletzungen. Zuerst Atemweg und Kreislauf.',
    },
  ],
  strom: [
    {
      afterMeasurements: 2,
      text: 'Auf dem Monitor erscheint Kammerflimmern, {name} bricht zusammen.',
      options: ['Wiederbelebung und Defibrillation sofort, Notarzt nachfordern', 'Nach Hause schicken, weil er ja wieder bei Bewusstsein war und sich gut fühlte', 'Alleine liegen lassen und später noch einmal nach seinem Befinden fragen'],
      explanation: 'Strom kann Rhythmusstörungen auslösen, auch nach Stunden noch. Deshalb muss man Stromopfer überwachen.',
    },
  ],
  ertrinken: [
    {
      afterMeasurements: 2,
      text: '{name} hustet schaumig, die Atemnot nimmt zu und die Sättigung fällt.',
      options: ['Sauerstoff hochdosiert, Oberkörper hoch, Notarzt nachfordern, Klinik (Spätfolgen möglich)', 'Wasser nachtrinken lassen, damit die Lunge sich wieder befeuchtet und der Husten nachlässt', 'Nach Hause schicken, denn er atmet ja wieder normal und fühlt sich gut'],
      explanation: 'Auch nach Stunden kann sich Wasser in der Lunge verschlimmern („sekundäres Ertrinken“). Deshalb Klinik.',
    },
  ],
  verbruehung: [
    {
      afterMeasurements: 1,
      text: '{name} zittert, die Haut wird kalt – obwohl die Verbrühung klein ist.',
      options: ['Auskühlung verhindern: Kühlung beenden, Wärmeerhalt, steril abdecken', 'Weiter kalt abspülen, damit die Haut sich beruhigt und die Schmerzen nachlassen', 'Mit Eiswürfeln kühlen, um die Hitze schnell aus der Haut zu ziehen und die Schwellung zu mindern'],
      explanation: 'Besonders Kinder kühlen bei längerem Kühlen aus. Nur kurz kühlen, dann wärmen.',
    },
  ],
  biss: [
    {
      afterMeasurements: 1,
      text: 'Der Hund wird wieder aggressiv und stürmt zurück. Der Halter ruft: „Der hat Tollwutimpfung!“',
      options: ['Eigenschutz: Rückzug, Hund wegsperren lassen, Polizei/Tierwarnung, Patient aus dem Gefahrenbereich bringen', 'Den Hund selbst einfangen und festhalten, damit er keinen weiteren Schaden anrichtet', 'Weiterarbeiten und den Hund ignorieren, er beruhigt sich schon wieder'],
      explanation: 'Erst sichern, dann helfen. Auch Retter können gebissen werden.',
    },
  ],
  augen: [
    {
      afterMeasurements: 1,
      text: '{name} will unbedingt ins Auge fassen, um den Fremdkörper „rauszuholen“.',
      options: ['Stoppen, nicht reiben, beide Augen abdecken, in die Augenklinik', 'Das Auge reiben lassen, damit der Fremdkörper herauskommt und die Schmerzen nachlassen', 'Mit Wasser aus dem Hahn spülen und anschließend mit dem Taschentuch nachwischen'],
      explanation: 'Reiben macht es schlimmer. Fremdkörper gehören in die Hände von Fachärzten.',
    },
  ],
  kopfplatz: [
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich schläfrig und erbricht, obwohl die Wunde nur „ein Kratzer“ war.',
      options: ['Verdacht auf Hirnblutung (besonders bei Blutverdünnern): Notarzt, Neurochirurgie, Überwachung', 'Schlafen lassen, denn Müdigkeit nach einem Sturz ist normal und gibt sich mit Ruhe', 'Ein Pflaster aufkleben und nach Hause schicken, weil die Wunde ja nur klein ist'],
      explanation: 'Blutverdünnende Medikamente erhöhen das Risiko für Hirnblutungen auch nach leichten Stürzen.',
    },
  ],
  hitzeerschoepfung: [
    {
      afterMeasurements: 2,
      text: '{name} reagiert plötzlich kaum noch und die Haut fühlt sich heiß und trocken an.',
      options: ['Hitzschlag: aktiv kühlen, Notarzt, zügiger Transport, Atemweg sichern', 'Warm zudecken, damit der Körper nicht auskühlt und der Kreislauf stabil bleibt', 'Etwas zu trinken geben und weiter beobachten, bis es besser wird'],
      explanation: 'Aus einer Hitzeerschöpfung kann ein lebensbedrohlicher Hitzschlag werden. Dann aktiv kühlen und Notarzt rufen.',
    },
  ],
  tauchen: [
    {
      afterMeasurements: 1,
      text: '{name} bekommt Lähmungserscheinungen im Bein und wird kurz bewusstlos.',
      options: ['Hochdosiert Sauerstoff, flach lagern, Notarzt sofort, Druckkammer anfragen', 'Aufstehen lassen und leichte Bewegung erlauben, damit der Stickstoff wieder abgeatmet wird', 'Die Tauchflasche holen und nochmals tauchen lassen, damit sich der Druck langsam ausgleicht'],
      explanation: 'Gasblasen im Gehirn und Rückenmark verursachen Ausfälle. Sauerstoff und Druckkammer-Behandlung sind entscheidend.',
    },
  ],
  angio: [
    {
      afterMeasurements: 1,
      text: 'Die Zunge schwillt weiter an, {name} bekommt Stridor und Panik.',
      options: ['Atemweg gefährdet: Notarzt sofort, Sauerstoff, Adrenalin nach SOP inhalativ/i.m., Intubationsbereitschaft', 'Flach hinlegen, damit sich die Schwellung verteilt und die Atmung leichter wird', 'Kaltes Wasser trinken lassen, damit die Zunge abschwillt und der Hals wieder frei wird'],
      explanation: 'Wenn die Schwellung den Atemweg verlegt, droht Ersticken. Schnell handeln und Spezialisten rufen.',
    },
  ],
  tabletten: [
    {
      afterMeasurements: 2,
      text: 'Der Puls von {name} fällt auf 36/min, der Blutdruck sinkt, {name} wird verwirrt.',
      options: ['Monitor, Pads, Notarzt sofort, Medikamente nach SOP, Giftnotruf einbinden, Klinik', 'Aufstehen lassen und Tee trinken, damit der Kreislauf wieder in Schwung kommt', 'Alles zu Hause lassen und am nächsten Tag zum Hausarzt gehen, wenn es nicht besser wird'],
      explanation: 'Manche Medikamente (z. B. Digitalis) lösen gefährliche Rhythmusstörungen aus. Überwachen und rasch behandeln.',
    },
  ],
  pilz: [
    {
      afterMeasurements: 2,
      text: 'Die Beschwerden scheinen nachzulassen, {name} will nicht ins Krankenhaus.',
      options: ['Trotzdem Klinik: Leberschäden treten verzögert auf, Giftnotruf und Pilzreste mitnehmen', 'Zu Hause bleiben, denn die Beschwerden sind ja besser geworden und es besteht keine Gefahr mehr', 'Wasser trinken und ausruhen, damit sich der Körper erholt und alles Gift ausgeschieden wird'],
      explanation: 'Bei Knollenblätterpilzen kommt die trügerische Besserung vor dem Leberversagen. Deshalb immer in die Klinik.',
    },
  ],
  drogen: [
    {
      afterMeasurements: 2,
      text: 'Die Temperatur von {name} steigt auf 40,5 °C, der Puls rast, {name} beginnt zu krampfen.',
      options: ['Hitzeschlag/Krampf: aktiv kühlen, Atemweg, Notarzt sofort, Klinik', 'Wieder tanzen lassen, damit sich der Körper bewegt und das Fieber nicht weiter steigt', 'Alkohol geben, damit die Person sich beruhigt und der Krampf nachlässt'],
      explanation: 'Partydrogen können lebensgefährlich überhitzen. Kühlen und Notarzt rufen.',
    },
  ],
  bronchiolitis: [
    {
      afterMeasurements: 1,
      text: 'Bei {name} setzt die Atmung für mehrere Sekunden aus, die Lippen werden blau.',
      options: ['Taktile Stimulation, Atemweg freimachen, Sauerstoff, bei Fortbestehen beatmen, Notarzt sofort', 'Abwarten, die Atempausen sind bei Säuglingen normal und hören von allein wieder auf', 'Das Kind kräftig schütteln, damit es wieder zu atmen beginnt und die Haut rosig wird'],
      explanation: 'Atempausen sind bei Säuglingen ein Alarmzeichen. Stimulieren, Sauerstoff, Hilfe holen.',
    },
  ],
  knopfzelle: [
    {
      afterMeasurements: 2,
      text: 'Die Eltern fragen: „Wir geben ihr schnell Wasser, damit es runterrutscht, ja?“',
      options: ['Nein, nichts geben, nichts herbeiführen, sofort in die Kinderklinik', 'Ja, ein Schluck Wasser spült die Batterie sicher durch und lindert das Brennen', 'Honig und ein Stück Brot geben, damit sich die Batterie festsetzt und nicht weiterrutscht'],
      explanation: 'Eine Knopfzelle verätzt die Speiseröhre in kurzer Zeit. Nichts essen oder trinken lassen, sofort Klinik.',
    },
  ],
  invagination: [
    {
      afterMeasurements: 2,
      text: 'Bei {name} wird der Stuhl blutig (Himbeergelee), das Kind ist apathisch.',
      options: ['Schock droht: Zugang/Volumen nach SOP, Notarzt, zügig in die Kinderklinik/Kinderchirurgie', 'Ein Abführzäpfchen geben, damit sich der Darm löst und das Kind sich entleeren kann', 'Das Kind auf eine Wärmflasche setzen und warten, bis die Schmerzen von selbst nachlassen'],
      explanation: 'Himbeergeleeartiger Stuhl ist ein Spätzeichen. Es besteht Schockgefahr – schnell handeln.',
    },
  ],
  kindvergiftung: [
    {
      afterMeasurements: 1,
      text: 'Die Mutter will das Kind zum Erbrechen bringen und steckt ihm den Finger in den Hals.',
      options: ['Stoppen, ruhig erklären, Giftinformationszentrum, Atemweg beobachten, Notarzt', 'Die Mutter weitermachen lassen, damit das Gift schnell wieder aus dem Magen herauskommt', 'Salzwasser trinken lassen, damit sich das Kind übergibt und der Magen leer wird'],
      explanation: 'Erbrechen auslösen kann gefährlich sein (Aspiration, Verätzung). Fachleute fragen.',
    },
  ],
  geburt: [
    {
      afterMeasurements: 1,
      text: 'Das Kind ist geboren, aber es schreit nicht und ist blass-blau.',
      options: ['Abtrocknen, wärmen, Atemwege frei machen, Rücken reiben, bei Atemstillstand 5 Beatmungen, Notarzt/Kinderarzt', 'Abwarten, das Kind wird schon schreien, sobald es merkt, dass es kalt ist', 'Das Kind kopfüber an den Füßen halten und kräftig auf den Rücken klopfen'],
      explanation: 'Neugeborene brauchen zuerst Wärme und Stimulation. Bei fehlender Atmung beatmen.',
    },
  ],
  eklampsie: [
    {
      afterMeasurements: 2,
      text: '{name} verdreht die Augen und beginnt zu krampfen.',
      options: ['Vor Verletzungen schützen, Linksseitenlage, Atemweg, Notarzt (Magnesium nach SOP)', 'Die Frau festhalten, damit sie sich nicht verletzt und ruhiger wird', 'Einen Beißkeil zwischen die Zähne schieben, damit sie sich nicht auf die Zunge beißt'],
      explanation: 'Der eklamptische Krampf ist lebensgefährlich für Mutter und Kind. Schutz, Atemweg, Magnesium.',
    },
  ],
  eug: [
    {
      afterMeasurements: 2,
      text: '{name} wird schlagartig bewusstlos, der Puls ist kaum noch tastbar.',
      options: ['Schock: Atemweg, Sauerstoff, Schocklage, Zugang/Volumen, Notarzt sofort, Not-OP voranmelden', 'Die Frau aufsetzen und Wasser geben, damit der Kreislauf stabil bleibt', 'Eine Wärmflasche auf den Bauch legen und abwarten, bis die Schmerzen nachlassen'],
      explanation: 'Eine geplatzte Eileiterschwangerschaft kann innerlich verbluten. Das ist ein Notfall mit sofortiger OP.',
    },
  ],
};
