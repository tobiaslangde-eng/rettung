import { KnowledgeQuestion } from './questions';

/** Weitere Wissensfragen für Ersthelfer/innen – reines Kurswissen (Erste-Hilfe-Kurs, Betriebshelfer, Recht) */
export const HELFER_FRAGEN_2: KnowledgeQuestion[] = [
  // ── Rettungskette und Notruf ──
  {
    id: 'h2-rettungskette-reihenfolge',
    question: 'In welcher Reihenfolge laufen die Glieder der Rettungskette ab?',
    answers: [
      'Sofortmaßnahmen, Notruf, Erste Hilfe, Rettungsdienst, Krankenhaus',
      'Notruf, Rettungsdienst, Erste Hilfe, Sofortmaßnahmen, Krankenhaus',
      'Erste Hilfe, Krankenhaus, Notruf, Sofortmaßnahmen, Rettungsdienst',
      'Rettungsdienst, Notruf, Sofortmaßnahmen, Krankenhaus, Erste Hilfe',
    ],
    explanation:
      'Die ersten drei Glieder liegen bei dir als Ersthelfer. Je schneller sie ineinandergreifen, desto besser sind die Chancen der verletzten Person.',
  },
  {
    id: 'h2-rettungskette-schwaechstes',
    question: 'Warum heißt es, die Rettungskette sei „nur so stark wie ihr schwächstes Glied“?',
    answers: [
      'Fehlt ein Glied, geht die gewonnene Zeit für den Patienten verloren',
      'Weil der Rettungsdienst die Kette allein tragen muss',
      'Weil am Ende nur das Krankenhaus als letztes Glied wirklich zählt',
      'Weil Ersthelfer kein Glied der Kette sind',
    ],
    explanation:
      'Ein verspäteter Notruf oder fehlende Sofortmaßnahmen lassen sich später kaum ausgleichen. Deshalb ist jeder Handgriff von dir wichtig.',
  },
  {
    id: 'h2-notruf-fuenf-w',
    question: 'Wofür stehen die fünf W bei der Notrufmeldung?',
    answers: [
      'Wo, Was, Wie viele, Welche Verletzungen, Warten auf Rückfragen',
      'Wer, Was, Wann, Warum, Wohin',
      'Wo, Wer bin ich, Wie spät, Wie lange, Wetter vor Ort und Uhrzeit',
      'Warum, Wer, Wo, Wie schnell, Wann',
    ],
    explanation:
      'Mit diesen fünf Angaben weiß die Leitstelle, wohin sie wen schicken muss. Das letzte W heißt: Bleib am Telefon, bis die Leitstelle das Gespräch beendet.',
  },
  {
    id: 'h2-notruf-losfahren',
    question: 'Wann wird der Rettungswagen nach deinem Notruf losgeschickt?',
    answers: [
      'Meist schon während des Gesprächs, sobald Ort und Lage klar sind',
      'Erst wenn du aufgelegt hast',
      'Erst nachdem du deine Personalien und deine Adresse genannt hast',
      'Erst nach dem Rückruf eines Arztes',
    ],
    explanation:
      'Die Leitstelle alarmiert, sobald sie den Einsatzort kennt – die weiteren Fragen dienen der Anleitung und Vorbereitung. Bleib deshalb am Telefon.',
  },
  {
    id: 'h2-notruf-guthaben',
    question: 'Dein Prepaid-Handy ist leer und hat kein Guthaben. Kannst du die 112 wählen?',
    answers: [
      'Ja, der Notruf ist immer kostenlos und braucht kein Guthaben',
      'Nein, ohne Guthaben sind alle Anrufe vom Netzbetreiber gesperrt',
      'Nur mit einer Notruf-App',
      'Nur mit der Vorwahl der nächsten Stadt davor',
    ],
    explanation:
      'Die 112 funktioniert ohne Guthaben, ohne Vorwahl und auch bei gesperrtem Bildschirm. Sie ist in ganz Europa kostenlos erreichbar.',
  },
  {
    id: 'h2-notruf-ort-wanderweg',
    question: 'Du rufst von einem Waldweg aus an und kennst keine Straße. Wie beschreibst du den Ort?',
    answers: [
      'Mit Wegmarken: Ortsnamen, Hütte, Parkplatz, Rettungspunkt, Schilder',
      'Mit „irgendwo im Wald“, die Leitstelle findet dich schon',
      'Gar nicht – du legst auf, suchst erst ein Straßenschild und rufst dann erneut an',
      'Nur mit deinem Namen und der Handynummer',
    ],
    explanation:
      'Nenne alles, was du siehst: Ortschaft, Wegzeichen, Schilder oder die Nummer eines Rettungspunkts. Auf der Autobahn helfen Kilometerangabe und Fahrtrichtung.',
  },
  // ── Eigenschutz, Absichern, Rettungsgasse ──
  {
    id: 'h2-absichern-reihenfolge',
    question: 'Welche Reihenfolge ist beim Absichern einer Unfallstelle auf der Landstraße richtig?',
    answers: [
      'Warnblinker, Warnweste anziehen, Warndreieck aufstellen',
      'Warndreieck aufstellen, Warnweste anziehen, Warnblinker',
      'Verletzte versorgen, Warnblinker, Warndreieck',
      'Motor laufen lassen, Warndreieck, Warnweste',
    ],
    explanation:
      'Die Weste ziehst du schon im Auto an, bevor du aussteigst. Erst gesichert, dann helfen – so wirst du nicht zum zweiten Opfer.',
  },
  {
    id: 'h2-eigenschutz-rauch',
    question: 'Warum läufst du nicht in einen verrauchten Raum, um jemanden herauszuholen?',
    answers: [
      'Du gefährdest dich selbst und wirst zum zweiten Opfer',
      'Weil der Rettungsdienst in so einem Fall immer schneller dort ist als du',
      'Weil nur die Feuerwehr Türen öffnen darf',
      'Weil du im Rauch nicht telefonieren kannst',
    ],
    explanation:
      'Rauch und Gase können schon nach wenigen Atemzügen bewusstlos machen. Ruf 112, warne andere und lass die Feuerwehr retten.',
  },
  {
    id: 'h2-rettungsgasse-nutzen',
    question: 'Darfst du als Pkw-Fahrer eine frei gewordene Rettungsgasse nutzen, um schneller voranzukommen?',
    answers: [
      'Nein, sie ist ausschließlich für Einsatzfahrzeuge',
      'Ja, wenn du dabei den Warnblinker einschaltest und langsam fährst',
      'Ja, wenn der Stau länger als 20 Minuten dauert',
      'Ja, solange kein Einsatzfahrzeug zu sehen ist',
    ],
    explanation:
      'Die Gasse bleibt frei, bis der Stau sich auflöst. Wer sie nutzt, behindert Retter und riskiert Bußgeld, Punkte und Fahrverbot.',
  },
  {
    id: 'h2-blaulicht-freie-bahn',
    question: 'Was verlangt die Straßenverkehrsordnung, wenn sich ein Einsatzfahrzeug mit Blaulicht und Martinshorn nähert?',
    answers: [
      'Sofort freie Bahn schaffen, möglichst rechts halten',
      'Weiterfahren, es ist nur Blaulicht',
      'Auf dem Fahrstreifen stehen bleiben und hupen',
      'Beschleunigen, um vorneweg aus dem Weg zu fahren',
    ],
    explanation:
      'Einsatzfahrzeuge haben Wegerecht. Schaffe zügig Platz, bleib dabei aber ruhig und fahre nicht bei Rot über die Kreuzung, wenn du andere gefährdest.',
  },
  // ── Prüfen, Seitenlage ──
  {
    id: 'h2-bewusstsein-pruefen-wie',
    question: 'Wie prüfst du bei einer reglos daliegenden Person, ob sie bei Bewusstsein ist?',
    answers: [
      'Laut ansprechen und vorsichtig an den Schultern rütteln',
      'Fest in die Wange kneifen oder kräftig in den Arm zwicken',
      'Kaltes Wasser ins Gesicht schütten',
      'Eine Minute lang beobachten, ob sie sich bewegt',
    ],
    explanation:
      'Ansprechen und anfassen – das genügt. Reagiert sie nicht, rufst du laut um Hilfe und prüfst die Atmung. Schmerzreize setzt du nicht.',
  },
  {
    id: 'h2-atmung-kopf-ueberstrecken',
    question: 'Warum überstreckst du bei der Atemkontrolle den Kopf einer bewusstlosen Person?',
    answers: [
      'Die Zunge fällt sonst zurück und verlegt die Atemwege',
      'Damit das Blut besser zum Gehirn fließt und sie schneller zu sich kommt',
      'Damit du den Puls am Hals besser spürst',
      'Damit die Person schneller aufwacht',
    ],
    explanation:
      'Bei Bewusstlosigkeit erschlafft die Zunge. Kopf in den Nacken, Kinn anheben: Dann sind die Atemwege frei und du kannst höchstens 10 Sekunden sehen, hören und fühlen.',
  },
  {
    id: 'h2-seitenlage-mund-tiefpunkt',
    question: 'Warum liegt in der stabilen Seitenlage der Mund am tiefsten Punkt?',
    answers: [
      'Erbrochenes und Speichel können abfließen, nicht in die Lunge gelangen',
      'Damit die Person ruhiger schläft und sich besser erholen kann',
      'Damit die Zunge nach vorn gezogen wird',
      'Damit der Rettungsdienst den Mund besser sieht',
    ],
    explanation:
      'Deshalb bleibt der Kopf leicht überstreckt und der Mund zeigt zum Boden. So bleibt der Atemweg frei, auch wenn die Person erbricht.',
  },
  {
    id: 'h2-seitenlage-atemkontrolle',
    question: 'Wie oft kontrollierst du die Atmung einer Person in stabiler Seitenlage?',
    answers: [
      'Ständig, bis der Rettungsdienst übernimmt',
      'Einmal nach zehn Minuten',
      'Gar nicht mehr, denn die Lage ist ja stabil und sicher',
      'Nur wenn sie zu stöhnen anfängt',
    ],
    explanation:
      'Auch in Seitenlage kann die Atmung aussetzen. Bleib bei der Person, decke sie zu und dreh sie bei Atemstillstand auf den Rücken, um mit der Wiederbelebung zu beginnen.',
  },
  // ── Wiederbelebung und AED ──
  {
    id: 'h2-kind-erste-beatmungen',
    question: 'Mit wie vielen Beatmungen beginnt nach der Kurslehre die Wiederbelebung bei einem Kind?',
    answers: [
      'Mit 5 Beatmungen, dann folgt die Herzdruckmassage',
      'Mit 30 Herzdruckmassagen genau wie bei Erwachsenen',
      'Gar nicht, Kinder werden nie beatmet',
      'Mit 30 Beatmungen am Stück',
    ],
    explanation:
      'Bei Kindern liegt meist Sauerstoffmangel zugrunde. Hast du die Beatmung nicht gelernt, ruf 112 und drücke – das ist besser als nichts.',
  },
  {
    id: 'h2-saeugling-zwei-finger',
    question: 'Womit drückst du bei einem Säugling auf den Brustkorb?',
    answers: [
      'Mit zwei Fingern auf die untere Hälfte des Brustbeins',
      'Mit dem Handballen beider Hände',
      'Mit der Faust, möglichst gleichmäßig und kräftig',
      'Mit einer Hand auf dem Bauch',
    ],
    explanation:
      'Drücke etwa 4 cm tief, 100 bis 120 Mal pro Minute – dieselbe Frequenz wie bei Erwachsenen. Bei großen Babys kannst du beide Daumen nutzen.',
  },
  {
    id: 'h2-kind-drucktiefe',
    question: 'Wie tief drückst du bei einem Kind den Brustkorb ein?',
    answers: [
      'Etwa ein Drittel der Brusttiefe, rund 5 Zentimeter',
      'Mindestens 8 Zentimeter wie bei Erwachsenen',
      'Nur 1 bis 2 Zentimeter, weil Kinderknochen so zerbrechlich sind',
      'So tief du kannst, Hauptsache kräftig',
    ],
    explanation:
      'Je nach Größe nimmst du eine oder zwei Hände. Lass den Brustkorb nach jedem Druck ganz zurückfedern. Die Frequenz bleibt bei 100 bis 120 pro Minute.',
  },
  {
    id: 'h2-hlw-pausen',
    question: 'Warum solltest du die Herzdruckmassage so selten und kurz wie möglich unterbrechen?',
    answers: [
      'Bei jeder Pause sinkt der Blutfluss zu Herz und Gehirn sofort',
      'Weil die Person bei jeder Pause weiter auskühlt',
      'Weil Pausen den Defibrillator stören',
      'Weil du sonst den Rhythmus vergisst',
    ],
    explanation:
      'Der Druck baut sich nach jedem Stopp erst langsam wieder auf. Deshalb nur kurz pausieren: für die Beatmung, bei der AED-Analyse und beim Schock.',
  },
  {
    id: 'h2-hlw-wie-lange',
    question: 'Wie lange führst du die Wiederbelebung fort?',
    answers: [
      'Bis der Rettungsdienst übernimmt oder die Person normal atmet',
      'Genau zwei Minuten, dann ist es geschafft',
      'Etwa zehn Minuten, danach darfst du ohne Sorge aufhören',
      'Bis die ersten Rippen knacken',
    ],
    explanation:
      'Ein Abbruch ist nur bei normaler Atmung, auf Anweisung des Rettungsdienstes oder bei eigener Erschöpfung richtig. Wechsle dich möglichst alle 2 Minuten mit anderen ab.',
  },
  {
    id: 'h2-hlw-harter-untergrund',
    question: 'Warum legst du eine Person für die Herzdruckmassage auf den harten Boden?',
    answers: [
      'Auf weichem Untergrund geht ein Teil des Drucks verloren',
      'Damit die Wirbelsäule nicht überdehnt und der Rücken geschont wird',
      'Damit die Rippen weniger brechen',
      'Damit der Kopf nicht überstreckt wird',
    ],
    explanation:
      'Eine Matratze federt nach, der Druck kommt nicht richtig am Herzen an. Lege die Person flach auf Boden oder eine feste Unterlage.',
  },
  {
    id: 'h2-aed-pads',
    question: 'Wo klebst du die Elektroden (Pads) eines AED bei einem Erwachsenen auf?',
    answers: [
      'Rechts unterhalb des Schlüsselbeins und links seitlich am Brustkorb',
      'Beide direkt nebeneinander mittig auf das Brustbein',
      'Eine auf die Stirn, eine auf den Bauch',
      'Je eine auf die rechte und linke Schulter',
    ],
    explanation:
      'Mach den Oberkörper frei und trockne nasse Haut ab. Das Bild auf den Pads zeigt die richtige Stelle. Dann folge den Ansagen des Geräts.',
  },
  {
    id: 'h2-aed-analyse',
    question: 'Was gilt, wenn der AED „Analyse läuft – Patient nicht berühren“ ansagt?',
    answers: [
      'Niemand berührt den Patienten, alle gehen auf Abstand',
      'Du drückst weiter, damit keine Zeit verloren geht',
      'Du beatmest weiter, damit er Sauerstoff bekommt',
      'Du prüfst währenddessen am Hals den Puls der Person',
    ],
    explanation:
      'Bewegungen stören die Rhythmusanalyse. Auch beim Schock darf niemand Kontakt haben. Rufe laut: „Weg vom Patienten!“',
  },
  {
    id: 'h2-aed-zeichen',
    question: 'Woran erkennst du in einem Gebäude einen öffentlichen Defibrillator?',
    answers: [
      'An einem grün-weißen Schild mit Herz und Blitz',
      'An einem roten Schild mit weißem Kreuz',
      'An einem blauen Schild mit weißem „H“ wie bei einem Krankenhaus',
      'An einem gelben Warndreieck mit Blitz',
    ],
    explanation:
      'Das internationale AED-Zeichen ist grün-weiß. Die Geräte hängen in Bahnhöfen, Einkaufszentren, Sporthallen oder Rathäusern. Die Leitstelle kann dir den nächsten nennen.',
  },
  // ── Schock, Blutung ──
  {
    id: 'h2-schock-haut-blass',
    question: 'Warum wird die Haut bei einem Schock blass und kalt?',
    answers: [
      'Der Körper leitet das Blut zu Herz und Gehirn um',
      'Weil der Raum zu kalt ist und die Haut auskühlt',
      'Weil zu viel Blut in die Haut und die Beine strömt',
      'Weil die Person zu wenig getrunken hat',
    ],
    explanation:
      'Bei Blutverlust schützt der Körper die lebenswichtigen Organe. Kaltschweißige, blasse Haut und ein schneller Puls sind typische Schockzeichen.',
  },
  {
    id: 'h2-schock-beine-hoch',
    question: 'Warum legst du bei einem Schock die Beine hoch (wenn keine Beinverletzung oder Atemnot vorliegt)?',
    answers: [
      'Mehr Blut fließt zu Herz und Gehirn zurück',
      'Die Beine schwellen dann nicht an',
      'Die Person rutscht nicht weg',
      'Dadurch lassen die Schmerzen nach',
    ],
    explanation:
      'Nicht bei Beinbruch, Kopf- oder Wirbelsäulenverletzung, Atemnot oder Herzbeschwerden. Decke die Person zu und bleibe bei ihr.',
  },
  {
    id: 'h2-druckverband-aufbau',
    question: 'Was gehört zu einem Druckverband?',
    answers: [
      'Sterile Wundauflage, Druckpolster und eine fest gewickelte Binde',
      'Nur eine locker gewickelte Binde ohne Auflage',
      'Ein Gummiband oberhalb der Wunde, das fest zugezogen wird',
      'Pflaster und eine desinfizierende Salbe',
    ],
    explanation:
      'Das Druckpolster (z. B. ein ungeöffnetes Verbandpäckchen) sitzt direkt über der Wunde, die Binde presst es fest. Finger und Zehen sollen warm und rosig bleiben.',
  },
  {
    id: 'h2-druckverband-durchgeblutet',
    question: 'Ein Druckverband färbt sich durch. Was ist richtig?',
    answers: [
      'Ersten Verband liegen lassen und einen zweiten darüber anlegen',
      'Verband abnehmen, Wunde prüfen und ihn neu wickeln',
      'Den Verband etwas lockerer machen',
      'Den Arm bewegen, damit das Blut gerinnt',
    ],
    explanation:
      'Nimmst du den ersten Verband ab, reißt du die beginnende Gerinnung auf. Setze ein zweites Polster darüber, wickle fester und halte die Verbindung zur Leitstelle.',
  },
  {
    id: 'h2-amputat-transport',
    question: 'Ein Finger wurde abgetrennt. Wie transportierst du das abgetrennte Teil?',
    answers: [
      'Steril eingewickelt im Beutel, der in einem zweiten mit Eiswasser liegt',
      'Direkt auf Eiswürfel gelegt, damit es möglichst kalt ist',
      'In Alkohol eingelegt',
      'Offen in der Hand mitgeben',
    ],
    explanation:
      'Das Teil soll kühl, aber nicht gefroren sein, denn direkter Eiskontakt schädigt das Gewebe. Gut verpackt kann es oft wieder angenäht werden.',
  },
  // ── Verbrennung, Knochen, Kopf ──
  {
    id: 'h2-verbrennung-grad-zwei',
    question: 'Woran erkennst du eine Verbrennung zweiten Grades?',
    answers: [
      'Gerötete, stark schmerzende Haut mit Brandblasen',
      'Weiße oder verkohlte Haut, die kaum noch schmerzt',
      'Nur leichte Rötung wie bei Sonnenbrand',
      'Kalte, blau verfärbte Haut',
    ],
    explanation:
      'Grad 1: Rötung. Grad 2: Blasen. Grad 3: weiß oder verkohlt und oft schmerzlos, weil die Nerven zerstört sind. Bei größeren Flächen, Gesicht oder Händen: 112.',
  },
  {
    id: 'h2-brandblasen',
    question: 'Warum stichst du Brandblasen nicht auf?',
    answers: [
      'Die Blase schützt vor Keimen, offene Haut infiziert sich leicht',
      'Das Wasser in der Blase ist giftig und darf nicht austreten',
      'Weil sie dann stärker bluten',
      'Weil das Kühlen dann nicht mehr wirkt',
    ],
    explanation:
      'Lass die Blasen unberührt und decke die Brandwunde keimfrei und locker ab. Festklebende Kleidung entfernst du nicht.',
  },
  {
    id: 'h2-fraktur-sicheres-zeichen',
    question: 'Welches Zeichen ist ein sicherer Hinweis auf einen Knochenbruch?',
    answers: [
      'Sichtbare Fehlstellung oder abnorme Beweglichkeit',
      'Starker Schmerz bei Berührung der Stelle',
      'Eine Schwellung',
      'Ein blauer Fleck',
    ],
    explanation:
      'Schmerz, Schwellung und Bluterguss kommen auch bei Prellungen vor. Ruhigstellen in der vorgefundenen Lage, nicht einrenken, z. B. mit Dreiecktuch oder Polsterung.',
  },
  {
    id: 'h2-kopf-nicht-allein',
    question: 'Warum sollte jemand nach einem Sturz auf den Kopf nicht allein bleiben, obwohl er sich gut fühlt?',
    answers: [
      'Eine Hirnblutung kann sich erst nach Stunden bemerkbar machen',
      'Weil er sonst einschläft und davon nie mehr richtig aufwacht',
      'Weil Kopfplatzwunden sonst nicht heilen',
      'Weil Betroffene sonst ohne Begleitung nicht mehr gehen dürfen',
    ],
    explanation:
      'Beobachte mindestens 24 Stunden. Bei Erbrechen, Verwirrtheit, starker Schläfrigkeit oder Kopfschmerzen rufst du 112.',
  },
  {
    id: 'h2-wirbelsaeule-kopf',
    question: 'Warum bewegst du bei Verdacht auf eine Wirbelsäulenverletzung den Kopf nicht?',
    answers: [
      'Eine Drehung kann das Rückenmark schädigen',
      'Weil der Blutdruck sonst fällt',
      'Weil Betroffene sonst erbrechen',
      'Weil der Kopf dem Rettungsdienst im Weg ist',
    ],
    explanation:
      'Halte den Kopf in der vorgefundenen Lage und bitte die Person, still zu liegen. Wird sie bewusstlos, geht die Atmung vor.',
  },
  // ── Temperatur, Vergiftung, Atmung ──
  {
    id: 'h2-unterkuehlung-alkohol',
    question: 'Warum bekommt ein unterkühlter Mensch keinen Alkohol zum Aufwärmen?',
    answers: [
      'Alkohol weitet die Gefäße, der Körper verliert noch mehr Wärme',
      'Alkohol treibt den Puls so hoch, dass der Kreislauf kollabiert',
      'Alkohol wärmt nur kurz, deshalb reicht ein kleiner Schluck',
      'Kalter Alkohol kühlt den Magen zusätzlich aus',
    ],
    explanation:
      'Die Wärme wirkt nur gefühlt. Besser: Nässe entfernen, in Decken wickeln, ins Warme bringen und bei Bewusstsein warme, süße Getränke geben.',
  },
  {
    id: 'h2-sonnenstich-hitzschlag',
    question: 'Was unterscheidet einen Sonnenstich von einem Hitzschlag?',
    answers: [
      'Sonnenstich: Kopf überhitzt, Hitzschlag: ganzer Körper überhitzt',
      'Beim Sonnenstich ist die Haut trocken, beim Hitzschlag nass',
      'Der Sonnenstich ist harmlos, der Hitzschlag immer tödlich',
      'Hitzschlag entsteht nur durch Sport, Sonnenstich nur am Meer',
    ],
    explanation:
      'Sonnenstich: heißer Kopf, Kopfschmerz, Nackenschmerz, Übelkeit. Hitzschlag: Wärmestau im ganzen Körper, lebensbedrohlich. Bei Hitzschlag rufst du 112.',
  },
  {
    id: 'h2-hitzschlag-kuehlen',
    question: 'Wie hilfst du einem ansprechbaren Menschen mit Hitzschlag?',
    answers: [
      'Schatten, Kleidung öffnen, Körper mit feuchten Tüchern kühlen',
      'Warm zudecken, damit er richtig schwitzt und abkühlt',
      'Eiswürfel direkt auf die Haut legen',
      'In der Sonne ausruhen lassen und Kaffee geben',
    ],
    explanation:
      'Kühle langsam, nicht eisig. Rufe 112, Oberkörper leicht erhöhen und bei Bewusstsein in kleinen Schlucken Wasser trinken lassen.',
  },
  {
    id: 'h2-giftnotruf-angaben',
    question: 'Welche Angaben helfen dem Giftnotruf am meisten?',
    answers: [
      'Was, wie viel und wann verschluckt wurde und wie schwer die Person ist',
      'Nur Name, Adresse und Geburtsdatum der Person',
      'Nur die Farbe der Flüssigkeit',
      'Nur, ob die Person Allergiker ist',
    ],
    explanation:
      'Halte Verpackung oder Reste bereit. Der Giftnotruf sagt dir, ob Beobachtung reicht oder ob du 112 rufen musst.',
  },
  {
    id: 'h2-lippenbremse',
    question: 'Wie hilft die „Lippenbremse“ bei Atemnot?',
    answers: [
      'Langsames Ausatmen gegen fast geschlossene Lippen hält die Atemwege offen',
      'Man hält sich Mund und Nase zu, bis der Anfall vorbei ist',
      'Man atmet möglichst schnell und flach',
      'Man atmet in eine Plastiktüte',
    ],
    explanation:
      'Ruhig einatmen, lang durch die gespitzten Lippen ausatmen – das beruhigt viele Betroffene. Bei schwerer Atemnot rufst du 112.',
  },
  {
    id: 'h2-heimlich-saeugling',
    question: 'Warum wendest du bei Säuglingen den Heimlich-Handgriff nicht an?',
    answers: [
      'Die Gefahr ist groß, innere Organe zu verletzen',
      'Weil Säuglinge nicht ersticken können',
      'Weil sie davon zu weinen beginnen',
      'Weil bei Säuglingen nur Beatmung erlaubt ist',
    ],
    explanation:
      'Beim Säugling legst du ihn bäuchlings auf den Unterarm, Kopf tief, und gibst 5 Schläge zwischen die Schulterblätter. Dann folgen 5 Brustkorbkompressionen.',
  },
  // ── Herzinfarkt, Schlaganfall, Zucker, Krampf ──
  {
    id: 'h2-herzinfarkt-nicht-allein',
    question: 'Warum lässt du jemanden mit Verdacht auf Herzinfarkt nicht allein?',
    answers: [
      'Es kann jederzeit zum Herzstillstand kommen',
      'Weil er sonst Medikamente nimmt',
      'Weil er sonst die Beschwerden vergisst',
      'Weil das Gesetz es verlangt',
    ],
    explanation:
      'Beruhige die Person, lagere den Oberkörper hoch und öffne enge Kleidung. Lass einen AED bereitstellen. Zu essen oder zu trinken gibst du nichts.',
  },
  {
    id: 'h2-fast-arme',
    question: 'Wie führst du beim FAST-Test die Armprobe durch?',
    answers: [
      'Beide Arme nach vorn, Handflächen nach oben, 10 Sekunden halten',
      'Arme zur Seite strecken und in die Hände klatschen',
      'Beide Arme über den Kopf strecken und zählen',
      'Deine Hände mit beiden Armen fest drücken lassen',
    ],
    explanation:
      'Sinkt ein Arm ab oder dreht sich, kann das eine Lähmung sein. Dazu: Gesicht (Mundwinkel hängt), Sprache (verwaschen) und Time – sofort 112.',
  },
  {
    id: 'h2-unterzucker-zuckerfrei',
    question: 'Warum hilft einer unterzuckerten Person eine zuckerfreie Cola nicht?',
    answers: [
      'Sie enthält keinen Zucker, der den Blutzucker anheben kann',
      'Die Kohlensäure verhindert die Aufnahme des Zuckers im Magen',
      'Diabetiker dürfen nie Cola trinken',
      'Sie wirkt zu langsam, weil sie kalt ist',
    ],
    explanation:
      'Gib Traubenzucker, Saft oder normale Limo, solange die Person wach ist und schlucken kann. Bei Bewusstlosigkeit flößt du nichts ein und rufst 112.',
  },
  {
    id: 'h2-krampf-dauer',
    question: 'Ab wie vielen Minuten Krampfdauer rufst du in jedem Fall 112, auch bei bekannter Epilepsie?',
    answers: [
      'Wenn der Anfall länger als 5 Minuten dauert',
      'Schon nach 30 Sekunden Dauer, auch bei bekannter Epilepsie',
      'Erst nach 15 Minuten',
      'Nie, bei Epilepsie ist das normal',
    ],
    explanation:
      'Die meisten Anfälle enden nach 1 bis 2 Minuten von allein. Beim ersten Anfall oder bei Verletzungen rufst du immer 112. Danach Seitenlage, wenn die Person bewusstlos bleibt.',
  },
  // ── Ertrinken, Strom, Zecken ──
  {
    id: 'h2-ertrinken-eigenschutz',
    question: 'Warum springst du einer ertrinkenden Person nicht hinterher, wenn du kein geübter Rettungsschwimmer bist?',
    answers: [
      'Sie klammert sich in Panik fest und zieht auch dich unter Wasser',
      'Weil das Wasser in Seen fast immer zu kalt ist',
      'Weil Ertrinkende am Ufer sicherer sind',
      'Weil nur die Wasserwacht ins Wasser darf',
    ],
    explanation:
      'Ruf 112, wirf einen Rettungsring, ein Seil oder reiche einen Ast. Brich deine Hilfe nicht ab, wenn du dich selbst in Gefahr bringst.',
  },
  {
    id: 'h2-ertrinken-arzt',
    question: 'Warum muss ein Kind nach einem Beinahe-Ertrinken auch bei guter Erholung zum Arzt?',
    answers: [
      'Wasser in der Lunge kann noch Stunden später Atemnot auslösen',
      'Weil die Haut vom langen Aufenthalt im Wasser aufgeweicht ist',
      'Weil Badewasser ansteckend ist',
      'Weil man nach dem Baden immer geimpft wird',
    ],
    explanation:
      'Schon wenige Schlucke in der Lunge können später eine gefährliche Entzündung oder Atemprobleme verursachen. Beobachtung in der Klinik ist wichtig.',
  },
  {
    id: 'h2-strom-haushalt',
    question: 'Wie unterbrichst du bei einem Stromunfall im Haushalt den Stromkreis sicher?',
    answers: [
      'Sicherung ausschalten oder Netzstecker ziehen',
      'Die Person mit bloßen Händen vom Gerät wegziehen',
      'Mit einem nassen Handtuch das Kabel wegschlagen',
      'Wasser über das Gerät gießen',
    ],
    explanation:
      'Erst Strom aus, dann helfen. Auch wer sich nach dem Stromschlag gut fühlt, muss zum Arzt – Herzrhythmusstörungen können Stunden später auftreten.',
  },
  {
    id: 'h2-zecke-fsme',
    question: 'Welche durch Zecken übertragene Erkrankung kann man durch eine Impfung vermeiden?',
    answers: [
      'FSME (Hirnhautentzündung)',
      'Borreliose',
      'Beide mit einer einzigen Impfung',
      'Keine – es gibt keine Impfung',
    ],
    explanation:
      'Gegen FSME gibt es eine Impfung, in Risikogebieten wird sie empfohlen. Gegen Borreliose nicht – sie wird mit Antibiotika behandelt. Such nach Ausflügen den Körper ab.',
  },
  // ── Betreuung, Infektionsschutz, Verbandkasten ──
  {
    id: 'h2-betreuung-erklaeren',
    question: 'Warum erklärst du einer verletzten, ängstlichen Person, was du gerade tust?',
    answers: [
      'Das nimmt Angst und schafft Vertrauen',
      'Damit sie im Nachhinein nicht klagen kann',
      'Damit du Zeit gewinnst, bis der Notarzt kommt',
      'Weil es das Gesetz vorschreibt',
    ],
    explanation:
      'Sprich ruhig, bleib auf Augenhöhe, hör zu und schütze vor Blicken Schaulustiger. Zuwendung ist echte Erste Hilfe.',
  },
  {
    id: 'h2-handschuhe-warum',
    question: 'Warum ziehst du vor dem Versorgen einer blutenden Wunde Einmalhandschuhe an?',
    answers: [
      'Sie schützen dich und die verletzte Person vor Krankheitserregern',
      'Damit die Wunde unter dem Material besser warm bleibt',
      'Damit keine Fingerabdrücke an der Person bleiben',
      'Damit du die Wunde fester drücken kannst',
    ],
    explanation:
      'Hast du keine Handschuhe, nimm eine Plastiktüte. Bei starker Blutung hilfst du notfalls auch ohne. Wasche danach gründlich deine Hände.',
  },
  {
    id: 'h2-verbandkasten-inhalt',
    question: 'Welcher Gegenstand gehört in den Kfz-Verbandkasten nach DIN 13164?',
    answers: [
      'Eine Verbandschere',
      'Ein Blutdruckmessgerät',
      'Schmerztabletten',
      'Eine Spritze mit Tetanusimpfstoff',
    ],
    explanation:
      'Dazu gehören Verbandpäckchen, Dreiecktücher, Einmalhandschuhe, Pflaster, Rettungsdecke und Masken. Medikamente sind bewusst nicht enthalten.',
  },
  {
    id: 'h2-verbandkasten-betrieb',
    question: 'Welche Normen gelten für Verbandkästen im Betrieb?',
    answers: [
      'DIN 13157 (klein) und DIN 13169 (groß)',
      'DIN 13164 für alle Betriebe',
      'DIN 4102 und DIN 14406',
      'Keine, jeder Betrieb entscheidet selbst',
    ],
    explanation:
      'Kontrolliere Vollständigkeit und Verfallsdaten regelmäßig. Der Kasten gehört gut sichtbar, leicht erreichbar und mit grün-weißem Erste-Hilfe-Zeichen markiert.',
  },
  // ── Betriebshelfer, Führerscheinkurs, Recht ──
  {
    id: 'h2-betriebshelfer-anzahl',
    question: 'Wie viele Ersthelfer sind bei 2 bis 20 anwesenden Beschäftigten nach DGUV Vorschrift 1 mindestens nötig?',
    answers: ['Mindestens einer', 'Zwei', 'Fünf', 'Keiner, erst ab 20 Personen'],
    explanation:
      'Bei mehr als 20 Beschäftigten sind es 5 % in Verwaltung und Handel, 10 % in sonstigen Betrieben – gerechnet wird mit den anwesenden Versicherten.',
  },
  {
    id: 'h2-betriebshelfer-prozent',
    question: 'Wie viel Prozent der anwesenden Beschäftigten müssen in einer Schreinerei mit 80 Personen Ersthelfer sein?',
    answers: ['10 Prozent', '5 Prozent', '1 Prozent', '20 Prozent'],
    explanation:
      'In sonstigen Betrieben sind es 10 %, in Verwaltungs- und Handelsbetrieben reichen 5 %. Bei Schichtarbeit oder Urlaub muss immer genug Personal verfügbar sein.',
  },
  {
    id: 'h2-betriebshelfer-fortbildung',
    question: 'In welchem Abstand müssen betriebliche Ersthelfer eine Fortbildung besuchen?',
    answers: ['Alle 2 Jahre', 'Jedes Jahr', 'Alle 5 Jahre', 'Nur einmal nach der Ausbildung'],
    explanation:
      'Die Fortbildung umfasst 9 Unterrichtseinheiten. Sonst zählt die Person nicht mehr als Ersthelfer im Betrieb. Die Kosten trägt der Unfallversicherungsträger.',
  },
  {
    id: 'h2-fuehrerschein-kurs-dauer',
    question: 'Wie lange dauert der Erste-Hilfe-Kurs für den Führerschein?',
    answers: [
      'Neun Unterrichtseinheiten à 45 Minuten, meist ein Tag',
      'Zwei Stunden an einem Abend',
      '30 Minuten',
      'Drei Tage',
    ],
    explanation:
      'Der Kurs wird von anerkannten Stellen wie DRK, ASB, JUH oder Maltesern angeboten. Die Bescheinigung legst du der Fahrerlaubnisbehörde vor.',
  },
  {
    id: 'h2-323c-strafe',
    question: 'Welche Strafe droht bei unterlassener Hilfeleistung nach § 323c StGB?',
    answers: [
      'Geldstrafe oder Freiheitsstrafe bis zu einem Jahr',
      'Ein Bußgeld ohne Eintrag ins Führungszeugnis',
      'Bis zu fünf Jahre Haft',
      'Gar keine Strafe',
    ],
    explanation:
      'Strafbar ist, wer bei Unglücksfällen nicht hilft, obwohl es erforderlich und zumutbar ist. Der Notruf 112 ist schon Hilfe.',
  },
  {
    id: 'h2-gaffer-behindern',
    question: 'Ist es strafbar, Ersthelfer oder Rettungskräfte bei ihrer Arbeit zu behindern?',
    answers: [
      'Ja, auch das Behindern von Hilfe ist nach § 323c StGB strafbar',
      'Nein, solange man nichts filmt',
      'Nur wenn dabei körperliche Gewalt angewendet wird',
      'Nur wenn die Polizei dabei steht',
    ],
    explanation:
      'Seit 2017 gilt: Wer Hilfeleistende behindert, kann bestraft werden. Mach Platz, halte die Rettungsgasse frei und lass die Kamera stecken.',
  },
  {
    id: 'h2-versicherung-ohne-kurs',
    question: 'Musst du einen Erste-Hilfe-Kurs besucht haben, um beim Helfen gesetzlich unfallversichert zu sein?',
    answers: [
      'Nein, jeder Helfer ist versichert – mit oder ohne Kurs',
      'Ja, der Kurs darf nicht älter als zwei Jahre sein',
      'Nur wenn du beruflich Sanitäter oder Arzt bist',
      'Nur wenn der Rettungsdienst dich anfordert',
    ],
    explanation:
      'Der Schutz gilt für jeden, der in einer Notlage hilft. Auch Sachschäden an Kleidung oder Auto werden auf Antrag ersetzt. Melde sie dem Unfallversicherungsträger.',
  },
  // ── Dokumentation ──
  {
    id: 'h2-verbandbuch-aufbewahrung',
    question: 'Wie lange müssen Einträge im Verbandbuch aufbewahrt werden?',
    answers: ['Mindestens 5 Jahre', 'Sechs Monate', 'Bis zum Ende der Schicht', '30 Jahre'],
    explanation:
      'Die Dokumentation bleibt vertraulich und ist nur Berechtigten zugänglich. Trage auch kleine Hilfeleistungen ein.',
  },
  {
    id: 'h2-verbandbuch-warum',
    question: 'Warum trägst du auch eine kleine Schnittwunde im Betrieb ins Verbandbuch ein?',
    answers: [
      'Als Nachweis, falls später Folgen auftreten, z. B. für die Versicherung',
      'Damit der Arzt später eine Krankschreibung ausstellen kann',
      'Damit Kollegen wissen, wer ungeschickt ist',
      'Damit der Chef weniger Gehalt zahlt',
    ],
    explanation:
      'Notiere Datum, Uhrzeit, Hergang, Art der Verletzung, Maßnahmen, Namen von Helfer und Zeugen. So lässt sich ein Arbeitsunfall später belegen.',
  },
];
