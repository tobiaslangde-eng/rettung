/** Zwischenfälle: Mitten in der Untersuchung passiert etwas, und ich muss sofort reagieren. */
export interface Incident {
  /** Nach so vielen Messungen tritt der Zwischenfall ein */
  afterMeasurements: number;
  text: string;
  /** Die erste Option ist die richtige; im Spiel wird gemischt. */
  options: [string, string, string];
  explanation: string;
}

export const INCIDENTS: Record<string, Incident> = {
  stemi: {
    afterMeasurements: 2,
    text: 'Klaus verdreht plötzlich die Augen und sackt zusammen. Der Monitor zeigt Kammerflimmern!',
    options: ['Sofort Herzdruckmassage und defibrillieren', 'Stabile Seitenlage', 'Erst noch einmal den Blutdruck messen'],
    explanation: 'Kammerflimmern ist ein Kreislaufstillstand. Jede Sekunde zählt: drücken und so schnell wie möglich defibrillieren.',
  },
  hypo: {
    afterMeasurements: 2,
    text: 'Anna wird immer schläfriger und kann nicht mehr richtig schlucken.',
    options: ['Nichts mehr in den Mund – Glukose in die Vene nach SOP', 'Schnell noch Cola einflößen', 'Sie ausschlafen lassen'],
    explanation: 'Wer nicht sicher schlucken kann, darf nichts trinken – Erstickungsgefahr. Der Zucker muss in die Vene.',
  },
  stroke: {
    afterMeasurements: 2,
    text: 'Plötzlich muss Helga erbrechen und verschluckt sich.',
    options: ['Sofort zur Seite drehen und den Mund freimachen (absaugen)', 'Ein Glas Wasser zum Nachspülen geben', 'Flach auf den Rücken legen'],
    explanation: 'Schlaganfall-Patienten haben oft Schluckstörungen. Die Atemwege gehen immer vor: Seitenlage und absaugen.',
  },
  anaphylaxie: {
    afterMeasurements: 2,
    text: 'Die Lippen schwellen weiter an, die Stimme wird heiser, der Blutdruck fällt!',
    options: ['Sofort Adrenalin in den Oberschenkelmuskel (nach SOP)', 'Abwarten, ob die Tablette wirkt', 'Kühlen Waschlappen auf die Lippen legen'],
    explanation: 'Adrenalin ist das wichtigste Medikament bei Anaphylaxie – früh geben, nicht abwarten.',
  },
  asthma: {
    afterMeasurements: 2,
    text: 'Lea wird plötzlich ruhig. Ich höre kaum noch Atemgeräusche.',
    options: ['Alarmzeichen „stille Lunge“: Notarzt sofort, Sauerstoff, Medikamente nach SOP', 'Gut, sie entspannt sich endlich', 'Eine Tüte vor Mund und Nase halten'],
    explanation: 'Eine „stille Lunge“ heißt: Es kommt kaum noch Luft hindurch. Das ist lebensbedrohlich, nicht beruhigend.',
  },
  krampf: {
    afterMeasurements: 1,
    text: 'Jonas beginnt erneut zu krampfen – der Anfall hört nach 5 Minuten nicht auf.',
    options: ['Vor Verletzungen schützen, Notarzt: krampfdurchbrechendes Medikament nach SOP', 'Arme und Beine festhalten', 'Einen Beißkeil zwischen die Zähne schieben'],
    explanation: 'Ein Anfall über 5 Minuten ist ein Status epilepticus und muss mit Medikamenten durchbrochen werden.',
  },
  opioid: {
    afterMeasurements: 2,
    text: 'Kevins Atmung wird immer langsamer – jetzt atmet er kaum noch.',
    options: ['Mit Beutel und Sauerstoff beatmen, Naloxon nach SOP', 'Kräftig an den Schultern rütteln und warten', 'Kaltes Wasser ins Gesicht schütten'],
    explanation: 'Bei einer Opioid-Überdosis bringt die Beatmung den Sauerstoff zurück. Naloxon hebt die Wirkung auf.',
  },
  alkohol: {
    afterMeasurements: 2,
    text: 'Ben hat sich auf den Rücken gedreht und fängt an zu erbrechen.',
    options: ['Sofort auf die Seite drehen und den Mund freimachen', 'Aufsetzen und Wasser trinken lassen', 'Liegen lassen, das geht vorbei'],
    explanation: 'Betrunkene haben abgeschwächte Schutzreflexe. Auf dem Rücken droht Ersticken an Erbrochenem.',
  },
  sht: {
    afterMeasurements: 2,
    text: 'Noahs rechte Pupille ist plötzlich weit, er wird immer schläfriger.',
    options: ['Hirndruckzeichen: Notarzt und schnell in eine Klinik mit Neurochirurgie', 'Kopfschmerztablette geben und beobachten', 'Ihn schlafen lassen'],
    explanation: 'Eine einseitig weite Pupille und Eintrübung sprechen für eine Blutung im Kopf – das ist ein Wettlauf gegen die Zeit.',
  },
  co: {
    afterMeasurements: 1,
    text: 'Mein CO-Warnmelder piept laut, und Kati klagt über Kopfschmerzen.',
    options: ['Alle sofort raus an die frische Luft, Feuerwehr nachfordern', 'Weiter untersuchen, der Melder spinnt', 'Fenster einen Spalt öffnen und weitermachen'],
    explanation: 'Eigenschutz geht vor! Kohlenmonoxid ist unsichtbar und geruchlos. Erst raus, dann weiterbehandeln.',
  },
  pneumothorax: {
    afterMeasurements: 2,
    text: 'Der Blutdruck fällt rapide, die Halsvenen sind gestaut, die Sättigung stürzt ab.',
    options: ['Notarzt: sofort Entlastungspunktion', 'Beine hochlagern und abwarten', 'Patienten flach auf den Bauch legen'],
    explanation: 'Beim Spannungspneumothorax hilft nur die Entlastung des Drucks im Brustkorb.',
  },
  synkope: {
    afterMeasurements: 1,
    text: 'Marie will sofort aufstehen und nach Hause gehen.',
    options: ['Liegen lassen, bis Kreislauf und Ursache geklärt sind', 'Aufstehen lassen und ein Taxi rufen', 'Allein die Treppe hinaufgehen lassen'],
    explanation: 'Nach einer Ohnmacht kann ein erneuter Kollaps folgen. Erst Ursache klären, z. B. EKG und Blutzucker.',
  },
  hypothermie: {
    afterMeasurements: 2,
    text: 'Die Helfer wollen Thomas kräftig abrubbeln und schnell aufsetzen.',
    options: ['Stopp – vorsichtig bewegen, flach lassen, vor Kälte schützen', 'Gute Idee, das wärmt schnell', 'Heißen Tee mit Rum geben'],
    explanation: 'Ruckartiges Bewegen kann kaltes Blut zum Herzen spülen und Kammerflimmern auslösen („Bergungstod“).',
  },
  fieberkrampf: {
    afterMeasurements: 2,
    text: 'Leonie beginnt erneut zu zucken!',
    options: ['Vor Verletzungen schützen, Zeit stoppen, Notarzt nachfordern', 'Leonie festhalten, damit sie stillliegt', 'Leonie in die kalte Badewanne setzen'],
    explanation: 'Ein zweiter Anfall ist kein typischer einfacher Fieberkrampf mehr – Notarzt und Medikamente bereithalten.',
  },
  pseudokrupp: {
    afterMeasurements: 2,
    text: 'Pauls Atemnot nimmt zu, er wird blass und unruhig.',
    options: ['Sauerstoff geben und Notarzt nachfordern, Paul bei der Mutter lassen', 'Mit dem Spatel in den Rachen schauen', 'Paul von der Mutter trennen und hinlegen'],
    explanation: 'Aufregung verschlimmert die Atemnot. Ruhig bleiben, Sauerstoff, Medikamente durch den Notarzt.',
  },
  aspiration: {
    afterMeasurements: 2,
    text: 'Mia hört auf zu husten, bekommt keine Luft mehr und wird bewusstlos.',
    options: ['Wiederbelebung beginnen, beim Beatmen nach sichtbarem Fremdkörper schauen', 'Abwarten, ob sie von allein wieder atmet', 'Ihr Wasser in den Mund gießen'],
    explanation: 'Bei Bewusstlosigkeit hilft die Herzdruckmassage, den Fremdkörper zu lösen. Bei Kindern zuerst 5 Beatmungen.',
  },
  exsikkose: {
    afterMeasurements: 2,
    text: 'Emil wird noch schläfriger. Die Mutter will ihm schnell eine Flasche geben.',
    options: ['Nichts trinken lassen – Notarzt: Flüssigkeit und Zucker in die Vene', 'Flasche geben, Hauptsache er trinkt', 'Emil warm einpacken und schlafen lassen'],
    explanation: 'Ein schläfriges Kind kann sich verschlucken. Flüssigkeit und Zucker gibt der Notarzt über einen Zugang.',
  },
};

/** Punkte für die Reaktion auf einen Zwischenfall */
export const INCIDENT_POINTS = { correct: 20, wrong: -10 };
/** Wirkung auf den Zustand des Patienten */
export const INCIDENT_CONDITION = { correct: 5, wrong: -15 };
