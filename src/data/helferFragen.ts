import { KnowledgeQuestion } from './questions';

/** Zusätzliche Wissensfragen für Ersthelfer/innen (Alltag, Laienhilfe) */
export const HELFER_FRAGEN: KnowledgeQuestion[] = [
  {
    id: 'h-verbandkasten-ablauf',
    question: 'Warum solltest du abgelaufene Teile im Auto-Verbandkasten ersetzen?',
    answers: [
      'Keimfreiheit und Klebkraft sind nicht mehr sicher',
      'Abgelaufene Pflaster sind giftig',
      'Das ist nur eine Empfehlung der Hersteller ohne Grund',
      'Abgelaufenes Material darf nur der Rettungsdienst benutzen',
    ],
    explanation:
      'Nach Ablauf ist nicht garantiert, dass Verbände steril sind und Pflaster kleben. Schau einmal im Jahr in den Verbandkasten und tausche aus, was fehlt oder abgelaufen ist.',
  },
  {
    id: 'h-verbandkasten-masken',
    question: 'Was ist seit 2022 neu im Kfz-Verbandkasten nach DIN 13164?',
    answers: [
      'Zwei medizinische Gesichtsmasken',
      'Ein kleiner Defibrillator',
      'Eine Packung Schmerztabletten',
      'Ein Fieberthermometer',
    ],
    explanation:
      'Mit der neuen Norm kamen zwei Mund-Nasen-Masken dazu. Medikamente gehören bewusst nicht hinein – Ersthelfer geben keine Arzneimittel.',
  },
  {
    id: 'h-warndreieck-autobahn',
    question: 'Wie weit stellst du das Warndreieck auf der Autobahn hinter der Unfallstelle auf?',
    answers: ['Mindestens 200 Meter', 'Etwa 50 Meter', 'Etwa 20 Meter', 'Direkt am Heck des Unfallautos'],
    explanation:
      'Faustregel: Stadt etwa 50 m, Landstraße etwa 100 m, Autobahn mindestens 200 m. Vor Kurven oder Kuppen eher weiter. Geh dabei hinter der Leitplanke.',
  },
  {
    id: 'h-warndreieck-landstrasse',
    question: 'Wie weit stellst du das Warndreieck auf der Landstraße auf?',
    answers: ['Etwa 100 Meter', 'Etwa 10 Meter', 'Etwa 400 Meter', 'Gar nicht, Warnblinker reicht'],
    explanation:
      'Auf der Landstraße sind etwa 100 m üblich, vor Kurven mehr. So haben nachfolgende Fahrer genug Zeit zum Bremsen.',
  },
  {
    id: 'h-leitpfosten',
    question: 'Wie hilft dir der Leitpfosten am Straßenrand beim Aufstellen des Warndreiecks?',
    answers: [
      'Die Pfosten stehen meist 50 Meter auseinander',
      'An jedem Pfosten gibt es einen Notrufknopf',
      'Das Warndreieck wird am Pfosten festgebunden',
      'Gar nicht, die Abstände sind zufällig',
    ],
    explanation:
      'Leitpfosten stehen in der Regel alle 50 m. Zwei Pfosten entsprechen also etwa 100 m – praktisch, um Entfernungen abzuschätzen.',
  },
  {
    id: 'h-rettungsgasse-wann',
    question: 'Wann bildest du auf der Autobahn eine Rettungsgasse?',
    answers: [
      'Sobald der Verkehr stockt – auch ohne Blaulicht',
      'Erst wenn du ein Martinshorn hörst',
      'Nur wenn die Polizei es per Lautsprecher anordnet',
      'Nur bei mehr als drei Fahrstreifen',
    ],
    explanation:
      'Die Rettungsgasse ist Pflicht, sobald Fahrzeuge mit Schrittgeschwindigkeit fahren oder stehen. Wartest du aufs Blaulicht, ist es oft zu spät zum Rangieren.',
  },
  {
    id: 'h-rettungsdecke',
    question: 'Wofür ist die Rettungsdecke aus dem Verbandkasten vor allem gut?',
    answers: [
      'Sie schützt vor Auskühlung durch Wind und Nässe',
      'Sie kühlt Verbrennungen',
      'Sie ersetzt einen Druckverband',
      'Sie dient als Unterlage für die Herzdruckmassage',
    ],
    explanation:
      'Verletzte kühlen schnell aus, auch im Sommer. Wickle die Decke eng um den Körper, das Gesicht bleibt frei. Bei einer Wiederbelebung geht Drücken vor.',
  },
  {
    id: 'h-aed-laie',
    question: 'Darfst du als Laie einen öffentlichen Defibrillator (AED) benutzen?',
    answers: [
      'Ja, jeder darf – das Gerät sagt jeden Schritt an',
      'Nein, nur mit Erste-Hilfe-Schein',
      'Nur nach Erlaubnis durch die Leitstelle',
      'Nur Ärztinnen und Ärzte',
    ],
    explanation:
      'AEDs sind genau für Laien gemacht. Einschalten, den Ansagen folgen – mehr musst du nicht wissen. Die Leitstelle hilft dir am Telefon zusätzlich.',
  },
  {
    id: 'h-aed-falscher-schock',
    question: 'Kann ein AED einem Menschen einen Schock geben, der keinen braucht?',
    answers: [
      'Nein, er gibt den Schock nur bei passendem Herzrhythmus frei',
      'Ja, deshalb nur im Zweifel benutzen',
      'Ja, wenn man den Knopf zu früh drückt',
      'Ja, bei Menschen über 70 Jahren',
    ],
    explanation:
      'Der AED analysiert den Herzrhythmus selbst. Nur wenn ein Schock sinnvoll ist, lässt er sich auslösen. Du kannst damit nichts falsch machen.',
  },
  {
    id: 'h-ersthelfer-app',
    question: 'Was machen Ersthelfer-Apps, die es in vielen Regionen gibt?',
    answers: [
      'Sie alarmieren registrierte Helfer in der Nähe zum Herzstillstand',
      'Sie ersetzen den Notruf 112',
      'Sie messen den Puls über die Handykamera',
      'Sie schicken automatisch einen Arzt nach Hause',
    ],
    explanation:
      'Die Leitstelle schickt zusätzlich zum Rettungsdienst geschulte Freiwillige in der Nähe los. So beginnt die Wiederbelebung oft Minuten früher.',
  },
  {
    id: 'h-pflicht-hilfe',
    question: 'Musst du in Deutschland bei einem Unfall Erste Hilfe leisten?',
    answers: [
      'Ja, soweit es dir zumutbar ist',
      'Nein, Helfen ist freiwillig',
      'Nur wenn du einen Erste-Hilfe-Kurs hast',
      'Nur wenn du am Unfall beteiligt bist',
    ],
    explanation:
      'Wer nicht hilft, obwohl es zumutbar ist, macht sich wegen unterlassener Hilfeleistung strafbar. Schon der Notruf 112 ist Hilfe – du musst dich nicht selbst in Gefahr bringen.',
  },
  {
    id: 'h-angst-fehler',
    question: 'Kannst du bestraft werden, wenn dir bei der Ersten Hilfe ein Fehler passiert?',
    answers: [
      'In der Regel nicht – strafbar ist vor allem, nichts zu tun',
      'Ja, jeder Fehler wird angezeigt',
      'Ja, wenn du keinen aktuellen Kurs hast',
      'Ja, für eine gebrochene Rippe bei der Herzdruckmassage',
    ],
    explanation:
      'Wer in guter Absicht hilft, haftet nur bei grober Fahrlässigkeit. Eine gebrochene Rippe bei der Wiederbelebung ist kein Fehler – ohne Hilfe stirbt der Mensch.',
  },
  {
    id: 'h-versicherung',
    question: 'Wer kommt auf, wenn du dich beim Helfen verletzt oder deine Kleidung kaputtgeht?',
    answers: [
      'Die gesetzliche Unfallversicherung',
      'Niemand, das ist dein Risiko',
      'Die verletzte Person muss alles zahlen',
      'Nur deine private Haftpflicht',
    ],
    explanation:
      'Ersthelfer sind in Deutschland gesetzlich unfallversichert. Auch beschädigte Kleidung oder verschmutzte Autositze können ersetzt werden.',
  },
  {
    id: 'h-sonnenstich',
    question: 'Ein Kind hat nach dem Badesee einen hochroten, heißen Kopf und Kopfschmerzen. Was hilft?',
    answers: [
      'Schatten, Oberkörper hoch, Kopf feucht kühlen',
      'Beine hochlegen und warm zudecken',
      'Weiter in der Sonne spielen lassen',
      'Eiswürfel direkt auf die Haut legen',
    ],
    explanation:
      'Das spricht für einen Sonnenstich: Die Hirnhäute sind durch die Sonne gereizt. Bei Erbrechen, Nackensteife oder Benommenheit rufst du 112.',
  },
  {
    id: 'h-zecke',
    question: 'Wie entfernst du eine Zecke am besten?',
    answers: [
      'Hautnah mit Zeckenkarte oder Pinzette fassen und langsam herausziehen',
      'Erst mit Öl oder Klebstoff beträufeln',
      'Am Hinterleib fassen und kräftig drücken',
      'Stecken lassen, sie fällt von selbst ab',
    ],
    explanation:
      'Je schneller die Zecke draußen ist, desto besser. Nicht quetschen und nichts draufträufeln. Danach desinfizieren und die Stelle einige Wochen beobachten.',
  },
  {
    id: 'h-wanderroete',
    question: 'Einige Tage nach einem Zeckenstich wächst um die Stelle ein roter Ring. Was tust du?',
    answers: [
      'Zum Arzt – möglicher Hinweis auf Borreliose',
      'Abwarten, das ist normal',
      'Mit Kühlakku behandeln',
      'Die Stelle mit Alkohol abreiben, das reicht',
    ],
    explanation:
      'Eine sich ausbreitende Rötung („Wanderröte“) ist typisch für Borreliose. Sie wird mit Antibiotika behandelt – je früher, desto besser.',
  },
  {
    id: 'h-hundebiss',
    question: 'Ein Hund hat ein Kind in die Hand gebissen, die Wunde ist klein. Was ist richtig?',
    answers: [
      'Keimfrei abdecken und ärztlich ansehen lassen',
      'Pflaster drauf, das heilt von selbst',
      'Kräftig ausdrücken und eincremen',
      'Mit Mehl bestreuen, damit es nicht blutet',
    ],
    explanation:
      'Bisswunden infizieren sich leicht, auch wenn sie klein aussehen. Ein Arzt prüft die Wunde und den Tetanusschutz.',
  },
  {
    id: 'h-zahn-ausgeschlagen',
    question: 'Beim Fußball wird einem Jungen ein Zahn komplett ausgeschlagen. Wie transportierst du ihn?',
    answers: [
      'In einer Zahnrettungsbox, notfalls in kalter Milch',
      'Trocken in einem Taschentuch',
      'Unter Leitungswasser gründlich abbürsten',
      'In Desinfektionsmittel einlegen',
    ],
    explanation:
      'Fass den Zahn nur an der Krone an, nicht an der Wurzel. Feucht gelagert und schnell beim Zahnarzt kann er oft wieder einwachsen.',
  },
  {
    id: 'h-auge-spuelen',
    question: 'Beim Putzen ist Reiniger ins Auge gespritzt. Was tust du?',
    answers: [
      'Lange mit Wasser spülen, von der Nase weg, dann zum Arzt',
      'Das Auge kräftig reiben',
      'Abwarten, ob es von allein besser wird',
      'Augentropfen aus der Hausapotheke reichen',
    ],
    explanation:
      'Spüle mindestens 10 Minuten mit viel Wasser. Das verletzte Auge liegt unten, damit nichts ins gesunde Auge läuft. Danach immer zum Augenarzt oder in die Klinik.',
  },
  {
    id: 'h-splitter',
    question: 'Ein großer Glassplitter steckt tief in der Hand. Was ist richtig?',
    answers: [
      'Stecken lassen, umpolstern und ärztlich versorgen lassen',
      'Sofort herausziehen',
      'Mit einer Nadel herausholen',
      'Abbrechen, damit er nicht stört',
    ],
    explanation:
      'Der Splitter kann eine Blutung abdichten. Beim Herausziehen drohen starke Blutungen und weitere Verletzungen. Kleine, oberflächliche Splitter darfst du selbst entfernen.',
  },
  {
    id: 'h-pech-regel',
    question: 'Wofür steht die PECH-Regel nach einer Verstauchung beim Sport?',
    answers: [
      'Pause, Eis (kurz), Kompression, Hochlagern',
      'Pflaster, Einrenken, Creme, Hüpfen',
      'Puls, Eis, Cola, Hilfe',
      'Pause, Einreiben, Chillen, Heizkissen',
    ],
    explanation:
      'Kühle nur kurz und nie direkt auf der Haut, sonst drohen Kälteschäden. Bei starken Schmerzen, Fehlstellung oder wenn du nicht auftreten kannst: ärztlich abklären lassen.',
  },
  {
    id: 'h-saeugling-atmet-nicht',
    question: 'Du bist allein mit einem Säugling, der nicht normal atmet. Was tust du zuerst?',
    answers: [
      'Handy auf Lautsprecher, 112 wählen und mit Wiederbelebung beginnen',
      'Erst 5 Minuten wiederbeleben, dann telefonieren',
      'Das Baby kräftig schütteln',
      'Mit dem Baby zum Auto laufen und ins Krankenhaus fahren',
    ],
    explanation:
      'Mit Lautsprecher kannst du gleichzeitig telefonieren und helfen – die Leitstelle leitet dich an. Schütteln ist bei Säuglingen lebensgefährlich.',
  },
  {
    id: 'h-saeugling-fieber',
    question: 'Ein zwei Monate altes Baby hat 38,5 °C Fieber. Was ist richtig?',
    answers: [
      'Sofort ärztlich vorstellen',
      'Abwarten, Fieber ist bei Babys normal',
      'Ein Fieberzäpfchen für Erwachsene geben',
      'Kalt baden, bis das Fieber sinkt',
    ],
    explanation:
      'Bei Säuglingen unter drei Monaten kann Fieber eine ernste Infektion bedeuten. Sie gehören noch am selben Tag zum Kinderarzt oder in die Kinderklinik.',
  },
  {
    id: 'h-116117',
    question: 'Nachts brauchst du einen Arzt, aber es ist kein Notfall. Welche Nummer wählst du?',
    answers: ['116117', '112', '110', '0800 112'],
    explanation:
      'Unter 116117 erreichst du den ärztlichen Bereitschaftsdienst – bundesweit und kostenlos. Bei Lebensgefahr gilt immer 112.',
  },
  {
    id: 'h-110',
    question: 'Wann wählst du die 110 statt der 112?',
    answers: [
      'Wenn du die Polizei brauchst, z. B. bei einer Straftat',
      'Bei jedem Verkehrsunfall mit Verletzten',
      'Bei einem Herzinfarkt',
      'Wenn die 112 besetzt ist',
    ],
    explanation:
      'Die 110 ist die Polizei, die 112 Feuerwehr und Rettungsdienst. Gibt es Verletzte, wählst du die 112 – die Leitstellen informieren sich gegenseitig.',
  },
  {
    id: 'h-giftnotruf',
    question: 'Ein Kleinkind hat an einer Pflanze geknabbert und wirkt munter. Wo bekommst du schnell Rat?',
    answers: [
      'Beim Giftnotruf (Giftinformationszentrum)',
      'In der Apotheke am nächsten Morgen',
      'Bei der Polizei unter 110',
      'Im Internet-Forum',
    ],
    explanation:
      'Der Giftnotruf berät rund um die Uhr. Speichere die Nummer deines Bundeslands im Handy. Wird das Kind schläfrig oder hat Atemnot: sofort 112.',
  },
  {
    id: 'h-kein-erbrechen',
    question: 'Ein Kind hat Spülmittel getrunken. Solltest du Erbrechen auslösen?',
    answers: [
      'Nein, niemals',
      'Ja, mit dem Finger im Hals',
      'Ja, mit Salzwasser',
      'Ja, aber nur bei Kindern unter 6 Jahren',
    ],
    explanation:
      'Beim Erbrechen kann Schaum oder ätzende Flüssigkeit in die Lunge gelangen. Lass das Kind kleine Schlucke Wasser trinken und ruf den Giftnotruf an.',
  },
  {
    id: 'h-hitze-auto',
    question: 'An einem heißen Tag liegt ein Kind schlapp im verschlossenen Auto. Niemand ist da. Was tust du?',
    answers: [
      '112 rufen und notfalls die Scheibe einschlagen',
      'Am Auto warten, bis die Eltern kommen',
      'Einen Zettel an die Scheibe kleben',
      'Nur das Kennzeichen notieren',
    ],
    explanation:
      'Im Auto wird es in Minuten lebensgefährlich heiß. Bei akuter Gefahr darfst du die Scheibe einschlagen – möglichst eine, die weit vom Kind entfernt ist.',
  },
  {
    id: 'h-erfrierung',
    question: 'Die Finger eines Wanderers sind weiß, hart und gefühllos. Was tust du?',
    answers: [
      'Langsam mit Körperwärme aufwärmen, nicht reiben',
      'Kräftig mit Schnee abreiben',
      'In heißes Wasser tauchen',
      'Mit Alkohol einreiben',
    ],
    explanation:
      'Erfrorenes Gewebe ist empfindlich: Reiben und große Hitze schädigen es zusätzlich. Wärme die Finger z. B. in den Achseln und bring die Person ins Warme und zum Arzt.',
  },
  {
    id: 'h-schock-betreuen',
    question: 'Was hilft einem Menschen im Schock außer dem Notruf am meisten?',
    answers: [
      'Beruhigen, zudecken, nicht allein lassen',
      'Viel Wasser trinken lassen',
      'Auf und ab gehen lassen',
      'Eine Zigarette zur Beruhigung',
    ],
    explanation:
      'Angst und Auskühlung verschlimmern den Schock. Bleib bei der Person, sprich ruhig mit ihr und schütze sie mit einer Rettungsdecke. Nichts zu trinken geben.',
  },
  {
    id: 'h-herzinfarkt-frauen',
    question: 'Wie zeigt sich ein Herzinfarkt bei Frauen häufig?',
    answers: [
      'Eher mit Übelkeit, Atemnot und Rücken- oder Oberbauchschmerz',
      'Immer mit starkem Schmerz im linken Arm',
      'Nur mit Fieber',
      'Frauen bekommen keinen Herzinfarkt',
    ],
    explanation:
      'Bei Frauen fehlt der typische Brustschmerz öfter. Deshalb wird ihr Herzinfarkt häufig zu spät erkannt. Im Zweifel immer 112 rufen.',
  },
  {
    id: 'h-schlaganfall-uhrzeit',
    question: 'Warum solltest du dir beim Verdacht auf Schlaganfall die Uhrzeit merken?',
    answers: [
      'Davon hängt ab, welche Behandlung in der Klinik möglich ist',
      'Für die Versicherung',
      'Damit die Polizei ein Protokoll schreiben kann',
      'Das ist nicht wichtig',
    ],
    explanation:
      'Gerinnsel-auflösende Behandlungen sind nur in einem Zeitfenster möglich. Weißt du nicht, wann es anfing, zählt der Zeitpunkt, an dem die Person zuletzt gesund war.',
  },
  {
    id: 'h-nasenbluten-nacken',
    question: 'Warum soll man bei Nasenbluten den Kopf NICHT in den Nacken legen?',
    answers: [
      'Das Blut läuft in den Magen und kann Erbrechen auslösen',
      'Dann blutet es stärker aus der Nase',
      'Das macht Kopfschmerzen',
      'Das ist egal, beides ist richtig',
    ],
    explanation:
      'Kopf nach vorn beugen, Nasenflügel zusammendrücken, Nacken kühlen. Blut, das geschluckt wird, reizt den Magen und verschleiert, wie stark die Blutung ist.',
  },
  {
    id: 'h-wespe-mund',
    question: 'Ein Kind wurde beim Limo-Trinken von einer Wespe in den Mund gestochen. Was tust du?',
    answers: [
      'Eis lutschen lassen, Hals außen kühlen, 112 rufen',
      'Warmen Tee trinken lassen',
      'Abwarten und weiterspielen lassen',
      'Den Stachel mit den Fingern im Rachen suchen',
    ],
    explanation:
      'Eine Schwellung im Mund oder Rachen kann die Atemwege verlegen. Deshalb von innen und außen kühlen und den Rettungsdienst rufen.',
  },
  {
    id: 'h-asthmaspray',
    question: 'Eine Frau hat einen Asthmaanfall und bittet dich, ihr Spray aus der Tasche zu holen. Darfst du?',
    answers: [
      'Ja, beim eigenen Notfallmedikament darfst du helfen',
      'Nein, Laien dürfen nie bei Medikamenten helfen',
      'Nur mit Erlaubnis der Polizei',
      'Nein, aber du darfst ihr dein eigenes Spray geben',
    ],
    explanation:
      'Fremde Medikamente gibst du nie. Beim eigenen Notfallspray oder Adrenalin-Pen der Person darfst du helfen. Bei schwerer Atemnot rufst du 112.',
  },
  {
    id: 'h-adrenalin-pen',
    question: 'Wo wird ein Adrenalin-Autoinjektor bei schwerer Allergie gesetzt?',
    answers: [
      'An der Außenseite des Oberschenkels, notfalls durch die Hose',
      'In den Oberarm, nur auf nackter Haut',
      'In den Bauch',
      'In die Hand',
    ],
    explanation:
      'Der Pen wirkt in den großen Oberschenkelmuskel am schnellsten. Danach 112 rufen – die Wirkung hält nicht lange an.',
  },
];
