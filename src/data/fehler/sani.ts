import { FehlerSzenario } from './types';

export const FEHLER_SANI: FehlerSzenario[] = [
  {
    id: 'sani-abcde-schema',
    titel: 'ABCDE-Schema am Patienten',
    lage: 'Du bist mit dem RTW bei einem Mann, der plötzlich schlecht Luft bekommt und blass ist. Dein Kollege untersucht ihn nach dem ABCDE-Schema.',
    schritte: [
      {
        text: 'Er rennt sofort zum Patienten, ohne sich die Einsatzstelle anzusehen, und zieht die Handschuhe erst später an.',
        fehler: true,
        erklaerung: 'Die Eigensicherung kommt zuerst, denn wer selbst verletzt wird, kann nicht helfen. Richtig: Gefahren erkennen, Schutzausrüstung anlegen, dann zum Patienten.',
      },
      {
        text: 'Er spricht den Patienten an und fragt nach Namen und Beschwerden.',
        fehler: false,
        erklaerung: 'Eine klare Antwort zeigt, dass der Atemweg frei ist und das Gehirn gut durchblutet wird. So bekommt er sofort einen ersten Eindruck (A).',
      },
      {
        text: 'Der Patient atmet gurgelnd, doch er misst zuerst in Ruhe den Blutdruck.',
        fehler: true,
        erklaerung: 'Die Reihenfolge A vor C gilt, weil ein verlegter Atemweg schneller lebensbedrohlich wird. Richtig: erst den Atemweg frei machen, zum Beispiel absaugen, dann weiter.',
      },
      {
        text: 'Er zählt die Atemfrequenz, hört beide Lungenseiten ab und misst die Sauerstoffsättigung.',
        fehler: false,
        erklaerung: 'Das ist Schritt B (Breathing). Atemfrequenz, Atemgeräusche und SpO2 zeigen, ob die Atmung ausreicht.',
      },
      {
        text: 'Er tastet den Puls, prüft Hautfarbe und Rekapillarisierungszeit und sucht nach starken Blutungen.',
        fehler: false,
        erklaerung: 'Das ist Schritt C (Circulation). Eine Rekap-Zeit über 2 Sekunden (Nagelbett drücken, Farbe kehrt verzögert zurück) kann auf Kreislaufprobleme hinweisen.',
      },
      {
        text: 'Er prüft Bewusstseinslage und Pupillen und misst den Blutzucker.',
        fehler: false,
        erklaerung: 'Das ist Schritt D (Disability). Eine Bewusstseinsstörung, ungleiche Pupillen oder Unterzuckerung sind wichtige Hinweise auf behandelbare Ursachen.',
      },
      {
        text: 'Er entkleidet den Patienten nur so weit nötig, sucht Verletzungen und deckt ihn danach wieder zu.',
        fehler: false,
        erklaerung: 'Das ist Schritt E (Exposure). Er untersucht gründlich, schützt aber die Privatsphäre und verhindert, dass der Patient auskühlt.',
      },
      {
        text: 'Er hält den Patienten nach dem ersten Durchgang für stabil und kontrolliert ihn bis zur Klinik nicht mehr.',
        fehler: true,
        erklaerung: 'Der Zustand kann sich jederzeit ändern. Richtig: Das ABCDE-Schema bei jeder Veränderung und regelmäßig erneut durchgehen.',
      },
    ],
    merksatz: 'Erst die eigene Sicherheit, dann A vor B vor C, und bei jeder Veränderung wieder von vorn.',
  },
  {
    id: 'sani-blutdruck-puls',
    titel: 'Blutdruck und Puls messen',
    lage: 'Du betreust eine ältere Patientin mit Schwindel. Dein Kollege will Blutdruck und Puls bestimmen.',
    schritte: [
      {
        text: 'Er erklärt die Messung, lässt die Patientin ruhig sitzen und lagert den Arm auf Herzhöhe.',
        fehler: false,
        erklaerung: 'Ruhe und Herzhöhe sind wichtig: Liegt der Arm tiefer, wird der Wert zu hoch, liegt er höher, zu niedrig gemessen.',
      },
      {
        text: 'Er wählt eine Manschette, die zum Oberarmumfang passt, und legt sie an.',
        fehler: false,
        erklaerung: 'Eine zu kleine Manschette zeigt zu hohe, eine zu große zu niedrige Werte. Die Größe muss zum Oberarm passen.',
      },
      {
        text: 'Er rollt den Ärmel hoch, sodass er oberhalb der Manschette den Arm eng abschnürt, und misst trotzdem.',
        fehler: true,
        erklaerung: 'Ein eng aufgerollter Ärmel staut das Blut und verfälscht den Wert. Richtig: Arm frei machen oder den Ärmel locker lassen.',
      },
      {
        text: 'Er tastet den Puls an der Speichenarterie mit dem Daumen.',
        fehler: true,
        erklaerung: 'Der Daumen hat einen eigenen Puls, man kann den eigenen mit dem des Patienten verwechseln. Richtig: Zeige- und Mittelfinger nehmen.',
      },
      {
        text: 'Der Puls ist unregelmäßig. Er zählt 15 Sekunden und rechnet mal vier.',
        fehler: true,
        erklaerung: 'Bei unregelmäßigem Puls ergibt das Hochrechnen große Fehler. Richtig: eine volle Minute zählen.',
      },
      {
        text: 'Er achtet neben der Frequenz auch auf Rhythmus und Kraft des Pulses.',
        fehler: false,
        erklaerung: 'Regelmäßig oder unregelmäßig, kräftig oder kaum tastbar: Diese Hinweise sind für Arzt und Klinik wichtig.',
      },
      {
        text: 'Bei einem auffälligen Wert misst er nach kurzer Pause erneut und dokumentiert die Werte mit Uhrzeit.',
        fehler: false,
        erklaerung: 'Eine Wiederholung schließt Messfehler aus. Werte mit Uhrzeit zeigen außerdem den Verlauf.',
      },
    ],
    merksatz: 'Gute Werte brauchen Ruhe, Herzhöhe, richtige Manschette und bei unregelmäßigem Puls eine volle Minute.',
  },
  {
    id: 'sani-sauerstoff-spo2',
    titel: 'Sauerstoffgabe und SpO2',
    lage: 'Ein Mann mit bekannter COPD (chronische Lungenerkrankung) hat zunehmende Atemnot. Du hast Pulsoximeter und Sauerstoff dabei.',
    schritte: [
      {
        text: 'Er setzt den Patienten aufrecht hin und beruhigt ihn.',
        fehler: false,
        erklaerung: 'Aufrechtes Sitzen erleichtert die Atmung, und Ruhe senkt den Sauerstoffverbrauch.',
      },
      {
        text: 'Er klemmt den Sensor an den Finger des Arms, an dem gerade die Blutdruckmanschette aufpumpt.',
        fehler: true,
        erklaerung: 'Die Manschette staut den Blutfluss, der SpO2-Wert fällt falsch niedrig aus oder fehlt. Richtig: den anderen Arm nehmen.',
      },
      {
        text: 'Er prüft, ob die Pulsfrequenz im Gerät zum getasteten Puls passt, bevor er dem Wert traut.',
        fehler: false,
        erklaerung: 'Stimmen beide Pulswerte überein, ist die Messung meist verlässlich. Weichen sie ab, ist der Wert fraglich.',
      },
      {
        text: 'Bei 84 % gibt er Sauerstoff und passt die Menge an, sodass der Zielwert bei COPD (88–92 %) erreicht wird.',
        fehler: false,
        erklaerung: 'Bei COPD ist ein niedrigerer Zielwert üblich. Zu viel Sauerstoff kann dort die Atmung dämpfen, daher gezielt steuern.',
      },
      {
        text: 'Als der Wert auf 99 % steigt, lässt er die Sauerstoffzufuhr unverändert hoch.',
        fehler: true,
        erklaerung: 'Zu viel Sauerstoff schadet und kann bei COPD gefährlich werden. Richtig: Zufuhr reduzieren, sobald der Zielbereich erreicht ist.',
      },
      {
        text: 'Er schaut nur noch auf den Zahlenwert und achtet nicht mehr auf Atemarbeit und Bewusstsein.',
        fehler: true,
        erklaerung: 'Das Gerät sieht nicht alles. Richtig: Auch Atemfrequenz, Atemanstrengung, Hautfarbe und Wachheit im Blick behalten.',
      },
      {
        text: 'Er kontrolliert Atmung und SpO2 fortlaufend und fordert bei Verschlechterung den Notarzt nach.',
        fehler: false,
        erklaerung: 'Fortlaufende Kontrolle erkennt Verschlechterung früh. Bei Müdigkeit oder Verwirrtheit ist ärztliche Hilfe nötig.',
      },
    ],
    merksatz: 'Sauerstoff gezielt geben und steuern, und dem Patienten mehr trauen als der Zahl.',
  },
  {
    id: 'sani-reanimation-team',
    titel: 'Reanimation im Team',
    lage: 'Ein Mann bricht zusammen, reagiert nicht und atmet nicht normal. Dein Team (RTW-Besatzung, ein Helfer) beginnt mit der Wiederbelebung.',
    schritte: [
      {
        text: 'Der Teamleiter verteilt Aufgaben (Herzdruckmassage, Atemweg, Defibrillator, Dokumentation) und behält den Überblick.',
        fehler: false,
        erklaerung: 'Klare Rollen sparen Zeit. Ein Leiter, der nicht selbst drückt, sieht Fehler und Zeiten besser.',
      },
      {
        text: 'Die Herzdruckmassage beginnt sofort auf harter Unterlage: Brustmitte, 5–6 cm tief, 100–120 pro Minute.',
        fehler: false,
        erklaerung: 'Sofortiges, tiefes und schnelles Drücken hält die Durchblutung von Herz und Gehirn aufrecht.',
      },
      {
        text: 'Die Defi-Elektroden werden aufgeklebt, während ein Kollege weiterdrückt.',
        fehler: false,
        erklaerung: 'So geht keine Zeit verloren. Unterbrochen wird nur kurz für die Rhythmusanalyse.',
      },
      {
        text: 'Für die Rhythmusanalyse stoppt er die Massage und lässt alle ruhig eine halbe Minute warten.',
        fehler: true,
        erklaerung: 'Jede Pause senkt den Druck im Kreislauf. Richtig: Pausen so kurz wie möglich halten, nur wenige Sekunden.',
      },
      {
        text: 'Bei Schockempfehlung ruft er „Alle weg“, prüft den Abstand und löst den Schock aus.',
        fehler: false,
        erklaerung: 'Niemand darf den Patienten berühren, sonst wird er selbst durchströmt. Das Kommando schützt das Team.',
      },
      {
        text: 'Nach dem Schock tastet er erst in Ruhe den Puls, bevor die Massage weitergeht.',
        fehler: true,
        erklaerung: 'Das verschwendet wertvolle Zeit. Richtig: sofort weiter drücken, etwa zwei Minuten, dann erneut analysieren.',
      },
      {
        text: 'Der erschöpfte Drückende macht weiter, ein Wechsel ist erst nach etwa zehn Minuten vorgesehen.',
        fehler: true,
        erklaerung: 'Nach 1–2 Minuten lässt die Qualität nach. Richtig: etwa alle zwei Minuten wechseln, möglichst bei der Rhythmusanalyse.',
      },
      {
        text: 'Ein Teammitglied notiert Zeiten von Schocks und Medikamenten und denkt an behandelbare Ursachen.',
        fehler: false,
        erklaerung: 'Zeiten sind für die Klinik wichtig. Behandelbare Ursachen wie Sauerstoffmangel oder Volumenmangel müssen mitgedacht werden.',
      },
    ],
    merksatz: 'Wenig Pausen, tief und schnell drücken, nach dem Schock sofort weiter und alle zwei Minuten wechseln.',
  },
  {
    id: 'sani-lagerung',
    titel: 'Lagerung bei verschiedenen Patienten',
    lage: 'In einer Schicht musst du mehrere Patienten richtig lagern. Dein Kollege entscheidet jeweils schnell, wie.',
    schritte: [
      {
        text: 'Einen Patienten mit Asthmaanfall lässt er aufrecht sitzen, die Arme abgestützt.',
        fehler: false,
        erklaerung: 'Im Sitzen können die Atemhilfsmuskeln besser arbeiten. Das erleichtert die Atmung.',
      },
      {
        text: 'Einen Patienten mit Wasser in der Lunge und starker Atemnot legt er flach hin, damit er sich entspannt.',
        fehler: true,
        erklaerung: 'Flach liegen verschlimmert die Atemnot, die Lunge füllt sich weiter. Richtig: Oberkörper hoch lagern, Beine möglichst tief.',
      },
      {
        text: 'Einen Patienten nach einem Kreislaufkollaps ohne Verletzung legt er flach und lagert die Beine hoch.',
        fehler: false,
        erklaerung: 'Das Blut fließt zurück zum Herzen und zum Gehirn. Das hilft bei Ohnmacht oder Kreislaufkollaps.',
      },
      {
        text: 'Bei Verdacht auf einen Beinbruch hebt er das Bein hoch, um einem Schock vorzubeugen.',
        fehler: true,
        erklaerung: 'Das verursacht Schmerzen und kann die Verletzung verschlimmern. Richtig: Bein ruhigstellen und schonend lagern.',
      },
      {
        text: 'Eine hochschwangere Frau mit Schwindel legt er flach auf den Rücken.',
        fehler: true,
        erklaerung: 'In später Schwangerschaft drückt das Kind auf die große Vene (Vena cava), und der Kreislauf bricht ein. Richtig: Linksseitenlage.',
      },
      {
        text: 'Einen bewusstlosen Patienten, der normal atmet, bringt er in die stabile Seitenlage.',
        fehler: false,
        erklaerung: 'So bleiben die Atemwege frei und Erbrochenes kann abfließen. Die Atmung wird weiter kontrolliert.',
      },
      {
        text: 'Eine Patientin mit starken Bauchschmerzen lagert er mit angewinkelten Knien, zum Beispiel mit einer Knierolle.',
        fehler: false,
        erklaerung: 'Angewinkelte Beine entspannen die Bauchdecke und lindern oft die Schmerzen.',
      },
    ],
    merksatz: 'Atemnot: Oberkörper hoch. Ohnmacht: Beine hoch. Bewusstlos mit Atmung: Seitenlage. Schwanger: links.',
  },
  {
    id: 'sani-immobilisation-hws',
    titel: 'Immobilisation nach Unfall',
    lage: 'Ein Autofahrer hatte einen Frontalunfall und klagt über Nackenschmerzen. Du und dein Kollege sichern die Wirbelsäule.',
    schritte: [
      {
        text: 'Sie sichern die Unfallstelle ab und tragen Warnweste und Handschuhe.',
        fehler: false,
        erklaerung: 'Eigensicherung kommt zuerst. Ein weiterer Unfall an der Einsatzstelle hilft niemandem.',
      },
      {
        text: 'Seine Kollegin hält den Kopf des Patienten von hinten in Neutralstellung, ohne zu ziehen.',
        fehler: false,
        erklaerung: 'So bewegt sich die Halswirbelsäule (HWS) bei der Versorgung möglichst wenig.',
      },
      {
        text: 'Er bittet den Patienten, den Kopf nach links und rechts zu drehen, um die Beweglichkeit zu testen.',
        fehler: true,
        erklaerung: 'Eine Bewegung kann eine instabile Verletzung verschlimmern. Richtig: Kopf nicht bewegen, die HWS wird ruhiggestellt.',
      },
      {
        text: 'Er legt eine passende HWS-Stütze (Zervikalstütze) an, während der Kopf gehalten wird.',
        fehler: false,
        erklaerung: 'Die Stütze verringert Bewegungen des Halses. Sie wird in passender Größe angelegt.',
      },
      {
        text: 'Der Patient sagt, es gehe ihm gut, und darf selbst aussteigen und zur Trage laufen.',
        fehler: true,
        erklaerung: 'Auch ohne starke Beschwerden kann die Wirbelsäule verletzt sein. Richtig: Patient wird schonend gerettet, nicht selbst bewegt.',
      },
      {
        text: 'Er lagert den Patienten achsengerecht mit mehreren Helfern auf die Vakuummatratze, formt sie an und saugt die Luft ab.',
        fehler: false,
        erklaerung: 'Die luftleere Matratze wird hart und hält den Körper in der gefundenen Lage. Dadurch ist die ganze Wirbelsäule ruhiggestellt.',
      },
      {
        text: 'Nach der Immobilisation kontrolliert er Durchblutung, Motorik und Gefühl in Händen und Füßen nicht noch einmal.',
        fehler: true,
        erklaerung: 'Das Umlagern kann Nerven oder Gefäße schädigen. Richtig: DMS (Durchblutung, Motorik, Sensibilität) vorher und nachher prüfen und dokumentieren.',
      },
    ],
    merksatz: 'Bei Verdacht auf Wirbelsäulenverletzung: Kopf halten, nicht bewegen, schonend retten, DMS prüfen.',
  },
  {
    id: 'sani-uebergabe-klinik',
    titel: 'Übergabe an die Klinik',
    lage: 'Du bringst einen Patienten mit Verdacht auf Schlaganfall in die Notaufnahme. Dein Kollege übernimmt die Übergabe.',
    schritte: [
      {
        text: 'Er meldet den Patienten über die Leitstelle voran, mit Verdachtsdiagnose und Eintreffzeit.',
        fehler: false,
        erklaerung: 'Die Klinik kann sich vorbereiten und das Team bereithalten. Das spart wertvolle Zeit.',
      },
      {
        text: 'Er wartet, bis das Klinikteam am Patienten bereit ist, und beginnt die Übergabe erst dann.',
        fehler: false,
        erklaerung: 'Nur wenn alle zuhören, kommen die Informationen an. Gestörte Übergaben führen zu Fehlern.',
      },
      {
        text: 'Er beginnt mit der ganzen Lebensgeschichte des Patienten und kommt erst nach Minuten zu den Beschwerden.',
        fehler: true,
        erklaerung: 'Das Team verliert den Überblick. Richtig: strukturiert (SBAR oder MIST), zuerst das wichtigste Problem nennen.',
      },
      {
        text: 'Er nennt Beschwerden, Vorerkrankungen, Allergien, Medikamente und die gemessenen Vitalwerte im Verlauf.',
        fehler: false,
        erklaerung: 'Diese Angaben sind für die weitere Behandlung wichtig. Der Verlauf zeigt, ob sich der Zustand verbessert oder verschlechtert hat.',
      },
      {
        text: 'Er erwähnt nicht, dass der Patient auf der Fahrt kurz nicht ansprechbar war, weil das nicht passt.',
        fehler: true,
        erklaerung: 'Gerade Veränderungen sind wichtig für die Diagnose. Richtig: Auffälligkeiten und Zwischenfälle offen nennen.',
      },
      {
        text: 'Er lässt Rückfragen zu und fasst zum Schluss die wichtigsten Punkte kurz zusammen.',
        fehler: false,
        erklaerung: 'So werden Missverständnisse vermieden, und das Team bestätigt, dass die Informationen angekommen sind.',
      },
      {
        text: 'Er fährt sofort ab und schickt das Protokoll erst am nächsten Tag.',
        fehler: true,
        erklaerung: 'Das Team braucht die Daten sofort. Richtig: Das Einsatzprotokoll vor Ort übergeben und erst danach den Patienten verlassen.',
      },
    ],
    merksatz: 'Strukturiert übergeben, Wichtiges zuerst, nichts verschweigen und das Protokoll gleich abgeben.',
  },
  {
    id: 'sani-hygiene-eigenschutz',
    titel: 'Hygiene und Eigenschutz',
    lage: 'Du versorgst zwei Patienten mit blutenden Wunden hintereinander. Dein Kollege arbeitet mit Spritzen und Kanülen.',
    schritte: [
      {
        text: 'Er zieht vor dem Patientenkontakt Einmalhandschuhe an und bei Spritzgefahr eine Schutzbrille.',
        fehler: false,
        erklaerung: 'Handschuhe und Brille schützen vor Blut und Körperflüssigkeiten, über die Krankheitserreger übertragen werden können.',
      },
      {
        text: 'Beim zweiten Patienten desinfiziert er die benutzten Handschuhe kurz und trägt sie weiter.',
        fehler: true,
        erklaerung: 'Einmalhandschuhe sind nicht für die Wiederverwendung gedacht und übertragen Keime. Richtig: Handschuhe wechseln, Hände desinfizieren.',
      },
      {
        text: 'Er steckt die Schutzkappe nach dem Einsatz mit beiden Händen wieder auf die gebrauchte Kanüle.',
        fehler: true,
        erklaerung: 'Dabei passieren die meisten Stichverletzungen. Richtig: Kanüle sofort, ohne Kappe, in den durchstichsicheren Abwurfbehälter.',
      },
      {
        text: 'Dabei sticht er sich in den Finger, klebt ein Pflaster darauf und arbeitet weiter, ohne es zu melden.',
        fehler: true,
        erklaerung: 'Hier können Hepatitis oder HIV übertragen werden. Richtig: Blutfluss fördern, desinfizieren, sofort zum Durchgangsarzt und melden.',
      },
      {
        text: 'Nach dem Ausziehen der Handschuhe desinfiziert er die Hände gründlich, auch Daumen und Fingerkuppen.',
        fehler: false,
        erklaerung: 'Handschuhe schützen nicht vollständig. Die Hände werden mit ausreichend Mittel eingerieben, bis sie trocken sind.',
      },
      {
        text: 'Er wischt Trage und Kontaktflächen mit Desinfektionsmittel und beachtet die Einwirkzeit.',
        fehler: false,
        erklaerung: 'Erst nach der vollen Einwirkzeit töten Mittel die Keime sicher ab. Zu frühes Abwischen mindert die Wirkung.',
      },
      {
        text: 'Bei Blutkontakt an der Dienstkleidung wechselt er die Kleidung und entsorgt Abfälle in den vorgesehenen Behältern.',
        fehler: false,
        erklaerung: 'Verschmutzte Kleidung kann Erreger weitertragen. Getrennte Entsorgung schützt andere.',
      },
    ],
    merksatz: 'Handschuhe wechseln, Kanülen nie rekappen, Hände desinfizieren und Stichverletzungen sofort melden.',
  },
  {
    id: 'sani-fahrzeugcheck',
    titel: 'Fahrzeug- und Materialcheck',
    lage: 'Du beginnst deinen Frühdienst auf dem RTW. Dein Kollege macht mit dir den Fahrzeug- und Materialcheck.',
    schritte: [
      {
        text: 'Er lässt sich bei der Übergabe von der Vorschicht offene Mängel und Besonderheiten nennen.',
        fehler: false,
        erklaerung: 'So wissen beide Teams, was noch zu tun ist, und nichts geht verloren.',
      },
      {
        text: 'Er prüft Beleuchtung, Reifen, Flüssigkeiten, Blaulicht und Martinshorn.',
        fehler: false,
        erklaerung: 'Ein defektes Fahrzeug kann im Einsatz ausfallen oder Menschen gefährden. Deshalb gehört der Fahrzeugcheck zu jedem Dienstbeginn.',
      },
      {
        text: 'Er hakt die Checkliste im Kopf ab, ohne die Fächer zu öffnen, weil gestern alles in Ordnung war.',
        fehler: true,
        erklaerung: 'Zwischendurch kann Material verbraucht oder defekt sein. Richtig: Jede Position tatsächlich ansehen und nachprüfen.',
      },
      {
        text: 'Er testet den Defibrillator, kontrolliert den Akku und das Verfallsdatum der Elektroden.',
        fehler: false,
        erklaerung: 'Im Notfall muss der Defi sofort funktionieren. Leere Akkus oder abgelaufene Elektroden dürfen nicht erst dann auffallen.',
      },
      {
        text: 'Die Sauerstoffflasche ist nur noch zu einem Viertel voll, er lässt sie drin, weil die Einsätze meist kurz sind.',
        fehler: true,
        erklaerung: 'Ein langer Einsatz kann sie schnell leeren. Richtig: Füllstand prüfen und Flasche vorher tauschen.',
      },
      {
        text: 'Das Absauggerät funktioniert nicht, er stellt es zurück ins Fach, um den Dienst nicht zu verzögern.',
        fehler: true,
        erklaerung: 'Ein defektes Gerät kann bei einem Notfall fehlen. Richtig: kennzeichnen, melden und durch ein funktionierendes ersetzen.',
      },
      {
        text: 'Er trägt den Check im Checkbuch ein und meldet das Fahrzeug einsatzbereit.',
        fehler: false,
        erklaerung: 'Die Dokumentation zeigt, wer wann geprüft hat. Erst danach ist das Fahrzeug einsatzbereit.',
      },
    ],
    merksatz: 'Nachsehen statt annehmen: Defekte melden, nie verstecken, und erst dann einsatzbereit melden.',
  },
  {
    id: 'sani-angehoerige-doku',
    titel: 'Angehörige und Dokumentation',
    lage: 'Eine Frau ruft den Rettungsdienst, weil ihr Mann Brustschmerzen hat. Deine Kollegin betreut den Patienten, du sprichst mit den Angehörigen.',
    schritte: [
      {
        text: 'Er spricht die Ehefrau ruhig und freundlich an und bittet sie, als Ansprechpartnerin vor Ort zu bleiben.',
        fehler: false,
        erklaerung: 'Eine feste Ansprechperson beruhigt und hilft bei Fragen zum Patienten. So geht keine Information verloren.',
      },
      {
        text: 'Auf die Frage „Ist es ein Herzinfarkt?“ antwortet er sicher: „Ja, bestimmt, das wird ernst.“',
        fehler: true,
        erklaerung: 'Eine Diagnose stellt der Arzt, und Spekulationen machen Angst. Richtig: ehrlich sagen, dass ihr Mann gut versorgt wird und die Klinik klärt.',
      },
      {
        text: 'Er fragt die Ehefrau nach Vorerkrankungen und Medikamenten und bittet sie, den Medikamentenplan mitzunehmen.',
        fehler: false,
        erklaerung: 'Angehörige kennen oft wichtige Details. Der Medikamentenplan hilft der Klinik bei der weiteren Behandlung.',
      },
      {
        text: 'Eine Nachbarin fragt am Gartenzaun, was der Mann hat, und er erzählt ihr die Verdachtsdiagnose.',
        fehler: true,
        erklaerung: 'Patientendaten unterliegen der Schweigepflicht. Richtig: Dritten ohne Einwilligung keine Auskunft geben.',
      },
      {
        text: 'Er nennt der Ehefrau mit Zustimmung des Patienten die Zielklinik.',
        fehler: false,
        erklaerung: 'Angehörige dürfen mit dem Einverständnis des Patienten informiert werden. So wissen sie, wohin sie kommen können.',
      },
      {
        text: 'Er füllt das Einsatzprotokoll erst am Dienstende aus der Erinnerung aus.',
        fehler: true,
        erklaerung: 'Später fehlen Details und Zeiten. Richtig: Werte und Maßnahmen zeitnah notieren, spätestens direkt nach dem Einsatz.',
      },
      {
        text: 'Er schreibt sachlich nur Beobachtungen, Messwerte und Maßnahmen, keine Bewertungen.',
        fehler: false,
        erklaerung: 'Ein Protokoll ist ein Dokument mit rechtlicher Bedeutung. Fakten statt Meinungen machen es nachvollziehbar.',
      },
    ],
    merksatz: 'Ehrlich, ruhig, keine Diagnosen raten, Schweigepflicht wahren und das Protokoll zeitnah ausfüllen.',
  },
];
