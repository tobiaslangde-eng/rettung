import { LeitstelleSzenario } from './types';

export const LEITSTELLE_SZENARIEN: LeitstelleSzenario[] = [
  {
    id: 'leitstelle-herzstillstand-zuhause',
    titel: 'Mann bricht zu Hause zusammen',
    anruf:
      'Mein Mann ist umgekippt! Er liegt einfach da und sagt nichts mehr! Bitte kommen Sie schnell, ich weiß nicht, was ich machen soll!',
    fragen: [
      {
        text: 'Wie heißt die Person, um die es geht?',
        antwort: 'Er heißt Wolfgang Brandt, er ist 68.',
        wichtig: false,
      },
      {
        text: 'Wo genau ist der Notfallort? Straße, Hausnummer, Ort?',
        antwort: 'Bei uns zu Hause, Birkenweg 14 in Braunschweig, erster Stock. Die Haustür steht offen.',
        wichtig: true,
      },
      {
        text: 'Haben Sie schon jemand anderen angerufen?',
        antwort: 'Nein, Sie sind der Erste. Unsere Tochter wohnt weit weg.',
        wichtig: false,
      },
      {
        text: 'Reagiert er, wenn Sie ihn laut ansprechen? Atmet er normal?',
        antwort: 'Nein, er rührt sich nicht. Der Brustkorb bewegt sich kaum, er macht nur manchmal so komische Schnappgeräusche.',
        wichtig: true,
      },
      {
        text: 'Was ist genau passiert?',
        antwort: 'Er stand auf, hat sich an die Brust gefasst und ist einfach umgefallen.',
        wichtig: true,
      },
      {
        text: 'Hat er Vorerkrankungen oder nimmt er Medikamente?',
        antwort: 'Er hatte vor Jahren einen Herzinfarkt. Welche Tabletten er nimmt, weiß ich nicht genau.',
        wichtig: false,
      },
      {
        text: 'Wie viele Personen sind betroffen?',
        antwort: 'Nur er. Ich bin allein bei ihm in der Wohnung.',
        wichtig: true,
      },
    ],
    mittel: ['rtw', 'nef'],
    erklaerung:
      'Bewusstlos und keine normale Atmung bedeutet Verdacht auf Herzstillstand, hier zählt jede Minute. Die Leitstelle schickt Rettungswagen und Notarzt gleichzeitig und sichert sofort die Adresse. Der Anrufer wird noch am Telefon zur Herzdruckmassage angeleitet.',
    anweisung:
      'Legen Sie Ihren Mann flach auf den Rücken und drücken Sie fest und schnell in der Mitte des Brustkorbs, 100- bis 120-mal pro Minute; ich bleibe am Telefon und zähle mit.',
  },
  {
    id: 'leitstelle-unfall-eingeklemmt',
    titel: 'Crash auf der Bundesstraße',
    anruf:
      'Hier hat es gerade gekracht, ein Auto ist gegen einen Baum! Der Fahrer bewegt sich kaum, ich glaube, der kommt nicht raus!',
    fragen: [
      {
        text: 'Wo genau ist die Unfallstelle?',
        antwort: 'Auf der B 214 zwischen Celle und Wietze, kurz hinter dem Abzweig nach Hornbostel, in Fahrtrichtung Celle.',
        wichtig: true,
      },
      {
        text: 'Wie ist Ihr Name und Ihre Rufnummer?',
        antwort: 'Ich bin Jan Köhler, meine Nummer sehen Sie ja gerade bei sich.',
        wichtig: false,
      },
      {
        text: 'Ist die Person eingeklemmt oder kann sie aussteigen?',
        antwort: 'Die Tür ist komplett eingedrückt und ein Bein steckt unter dem Armaturenbrett. Er kommt nicht raus.',
        wichtig: true,
      },
      {
        text: 'Wie viele Fahrzeuge und wie viele Verletzte sind es?',
        antwort: 'Nur das eine Auto, und nur der Fahrer sitzt drin. Ich sehe sonst niemanden.',
        wichtig: true,
      },
      {
        text: 'Was für ein Auto ist es, welche Farbe?',
        antwort: 'Ein dunkelblauer Kombi, glaube ich. Die Marke weiß ich nicht.',
        wichtig: false,
      },
      {
        text: 'Ist der Fahrer ansprechbar? Atmet er?',
        antwort: 'Er stöhnt und sagt manchmal was, aber er ist ganz benommen. Atmen tut er, ja.',
        wichtig: true,
      },
      {
        text: 'Wie lange liegt der Unfall schon zurück?',
        antwort: 'Das war gerade eben erst, vielleicht zwei Minuten.',
        wichtig: false,
      },
    ],
    mittel: ['rtw', 'nef', 'feuerwehr', 'polizei'],
    erklaerung:
      'Eine eingeklemmte, benommene Person ist ein schwerer Verkehrsunfall: Die Feuerwehr befreit sie technisch, Rettungswagen und Notarzt versorgen sie. Die Polizei sichert die Unfallstelle ab und nimmt den Unfall auf. Wichtig sind der genaue Ort und die Frage nach weiteren Gefahren wie Verkehr oder auslaufendem Kraftstoff.',
    anweisung:
      'Schalten Sie den Warnblinker ein, ziehen Sie eine Warnweste an, sichern Sie sich selbst am Straßenrand und sprechen Sie beruhigend mit dem Fahrer, ohne ihn zu bewegen.',
  },
  {
    id: 'leitstelle-kind-verschluckt',
    titel: 'Kind hustet und bekommt schlecht Luft',
    anruf:
      'Mein Sohn hat irgendwas in den Mund gesteckt und hustet ganz komisch! Er kriegt keine richtige Luft, bitte helfen Sie uns!',
    fragen: [
      {
        text: 'Wie alt ist Ihr Sohn und wie heißt er?',
        antwort: 'Er heißt Ben und ist drei Jahre alt.',
        wichtig: false,
      },
      {
        text: 'Hustet er noch? Wie klingt seine Atmung?',
        antwort: 'Er hustet immer wieder, aber es pfeift beim Einatmen und er wird im Gesicht richtig blass.',
        wichtig: true,
      },
      {
        text: 'Was hat er in den Mund gesteckt?',
        antwort: 'Ein kleines Legoteil. Ich habe es gerade noch gesehen, dann war es weg.',
        wichtig: true,
      },
      {
        text: 'Wo genau sind Sie? Adresse bitte.',
        antwort: 'In Erfurt, Gartenstraße 7, Erdgeschoss links. Ich mache gleich die Haustür auf.',
        wichtig: true,
      },
      {
        text: 'Ist er bei Bewusstsein und reagiert auf Sie?',
        antwort: 'Ja, er weint und klammert sich an mich. Er ist wach.',
        wichtig: true,
      },
      {
        text: 'Hat er heute schon etwas gegessen?',
        antwort: 'Vor einer Stunde ein Brot, das hat er normal gegessen.',
        wichtig: false,
      },
      {
        text: 'Sind noch andere Kinder in der Wohnung?',
        antwort: 'Seine kleine Schwester ist auch da, aber der geht es gut.',
        wichtig: false,
      },
    ],
    mittel: ['rtw', 'nef'],
    erklaerung:
      'Ein Kleinkind mit pfeifender Atmung und blassem Gesicht nach Verschlucken ist ein Atemnotfall, der schnell lebensbedrohlich werden kann. Deshalb schickt die Leitstelle Rettungswagen und Notarzt. Entscheidend sind Hustenstärke, Bewusstsein und der genaue Ort.',
    anweisung:
      'Lassen Sie Ben weiterhusten und beugen Sie ihn nach vorn; kann er nicht mehr husten oder atmen, klopfen Sie fünfmal kräftig zwischen die Schulterblätter.',
  },
  {
    id: 'leitstelle-sturz-senior',
    titel: 'Oma ist gestürzt',
    anruf:
      'Meine Mutter ist in der Küche gestürzt und kann nicht mehr aufstehen! Sie jammert vor Schmerzen, bitte schicken Sie jemanden!',
    fragen: [
      {
        text: 'Wo genau befinden Sie sich?',
        antwort: 'Hamburg-Eimsbüttel, Lutterothstraße 31, dritter Stock. Es gibt einen Aufzug.',
        wichtig: true,
      },
      {
        text: 'Ist sie bei Bewusstsein und ansprechbar?',
        antwort: 'Ja, sie ist ganz klar im Kopf, sie weiß nur nicht, wie sie wieder hochkommen soll.',
        wichtig: true,
      },
      {
        text: 'Wie heißt Ihre Mutter?',
        antwort: 'Ingrid Schulte, sie wird im Herbst 84.',
        wichtig: false,
      },
      {
        text: 'Wo hat sie Schmerzen und wie liegt sie?',
        antwort: 'In der Hüfte, rechts. Das Bein ist nach außen gedreht und sie kann es nicht anheben.',
        wichtig: true,
      },
      {
        text: 'Wie ist der Sturz passiert, hat sie sich den Kopf gestoßen?',
        antwort: 'Sie ist auf dem nassen Küchenboden ausgerutscht. Den Kopf hat sie sich nicht gestoßen, sagt sie.',
        wichtig: false,
      },
      {
        text: 'Blutet sie stark?',
        antwort: 'Nein, ich sehe kein Blut, nur ein bisschen gerötete Haut am Ellbogen.',
        wichtig: true,
      },
      {
        text: 'Nimmt sie blutverdünnende Medikamente?',
        antwort: 'Ich glaube schon, irgendwas fürs Herz. Die Liste liegt im Flur.',
        wichtig: false,
      },
    ],
    mittel: ['rtw'],
    erklaerung:
      'Ein verkürztes, nach außen gedrehtes Bein nach einem Sturz im Alter spricht für einen Oberschenkelhalsbruch. Die Patientin ist ansprechbar und stabil, daher genügt der Rettungswagen. Die Leitstelle fragt nach Bewusstsein, Blutungen und Kopfverletzungen, um den Bedarf an einem Notarzt auszuschließen.',
    anweisung:
      'Lassen Sie Ihre Mutter ruhig liegen und bewegen Sie das Bein nicht, decken Sie sie zu und lassen Sie die Haustür für den Rettungsdienst öffnen.',
  },
  {
    id: 'leitstelle-wohnungsbrand',
    titel: 'Rauch im Treppenhaus',
    anruf:
      'Es brennt bei meinem Nachbarn! Überall ist schwarzer Rauch im Haus, und er hustet ganz schlimm! Wir müssen hier raus!',
    fragen: [
      {
        text: 'Wo brennt es genau? Adresse und Stockwerk?',
        antwort: 'In Nürnberg, Fürther Straße 112, zweiter Stock rechts. Der Rauch zieht ins Treppenhaus.',
        wichtig: true,
      },
      {
        text: 'Sind Sie selbst in Sicherheit?',
        antwort: 'Ich stehe gerade vor der Haustür auf dem Gehweg. Hier ist es okay.',
        wichtig: true,
      },
      {
        text: 'Wie heißen die Bewohner der Wohnung?',
        antwort: 'Familie Yilmaz, glaube ich. Ich kenne die nur vom Sehen.',
        wichtig: false,
      },
      {
        text: 'Sind noch Personen in der Wohnung oder im Haus?',
        antwort: 'Der Nachbar ist rausgekommen und hustet stark. Seine Frau ist noch drin, hat er gerufen, glaube ich.',
        wichtig: true,
      },
      {
        text: 'Ist die Person, die gehustet hat, ansprechbar?',
        antwort: 'Ja, er sitzt hier auf der Treppe vorm Haus, hustet und ist ganz schwarz im Gesicht.',
        wichtig: true,
      },
      {
        text: 'Was ist Ihrer Meinung nach die Brandursache?',
        antwort: 'Keine Ahnung, vielleicht der Herd. Ich habe nur den Qualm gesehen.',
        wichtig: false,
      },
      {
        text: 'Haben Sie schon die Hausverwaltung informiert?',
        antwort: 'Nein, dazu hatte ich noch keine Zeit.',
        wichtig: false,
      },
    ],
    mittel: ['feuerwehr', 'rtw'],
    erklaerung:
      'Bei einem Wohnungsbrand mit Rauch im Treppenhaus rückt die Feuerwehr zur Brandbekämpfung und Menschenrettung aus, denn eine Person wird noch vermisst. Der Rettungswagen versorgt den Mann mit Verdacht auf Rauchgasvergiftung. Die Leitstelle achtet auf die Eigensicherung des Anrufers.',
    anweisung:
      'Bleiben Sie draußen und gehen Sie nicht zurück ins Haus, halten Sie andere Bewohner fern und weisen Sie die Feuerwehr bei ihrer Ankunft ein.',
  },
  {
    id: 'leitstelle-messerstecherei',
    titel: 'Streit vor der Kneipe eskaliert',
    anruf:
      'Vor der Kneipe prügeln sich ein paar Leute, und einer hat ein Messer! Da liegt einer auf dem Boden, bitte kommen Sie schnell!',
    fragen: [
      {
        text: 'Wo genau ist der Einsatzort?',
        antwort: 'In Dortmund, Brückstraße 40, vor dem Lokal „Zum Anker“, direkt an der Straßenbahnhaltestelle.',
        wichtig: true,
      },
      {
        text: 'Wie viele Personen sind beteiligt und wie viele verletzt?',
        antwort: 'Vier oder fünf Leute haben sich geprügelt. Einer liegt am Boden und blutet, die anderen sind verletzt, glaube ich, nicht.',
        wichtig: true,
      },
      {
        text: 'Ist die Person mit dem Messer noch vor Ort?',
        antwort: 'Ja, er steht noch da und fuchtelt rum. Alle gehen auf Abstand.',
        wichtig: true,
      },
      {
        text: 'Wie heißen die Beteiligten?',
        antwort: 'Keine Ahnung, ich kenne die nicht.',
        wichtig: false,
      },
      {
        text: 'Wie sieht der Mann aus, der am Boden liegt?',
        antwort: 'Er hält sich die Seite und stöhnt. Er ist ansprechbar, aber ganz blass.',
        wichtig: true,
      },
      {
        text: 'Waren Sie selbst beteiligt?',
        antwort: 'Nein, ich bin nur zufällig vorbeigekommen, ich bin in einem Hauseingang gegenüber.',
        wichtig: false,
      },
      {
        text: 'Haben die Beteiligten getrunken?',
        antwort: 'Ja, bestimmt, die kamen alle aus der Kneipe.',
        wichtig: false,
      },
    ],
    mittel: ['polizei', 'rtw'],
    erklaerung:
      'Bewaffnete Täter am Einsatzort sind eine Gefahrenlage: Die Polizei kommt zuerst und sichert die Szene, der Rettungswagen wird gleichzeitig alarmiert und wartet in sicherer Entfernung, bis die Polizei freigibt. Die Leitstelle erfragt, ob der Täter noch da ist, und rät dem Anrufer, sich nicht selbst in Gefahr zu bringen.',
    anweisung:
      'Halten Sie Abstand zu den Beteiligten, bleiben Sie in Sicherheit und helfen Sie dem Verletzten erst, wenn der Mann mit dem Messer nicht mehr in der Nähe ist.',
  },
  {
    id: 'leitstelle-schlaganfall',
    titel: 'Opa spricht undeutlich',
    anruf:
      'Mein Vater ist plötzlich komisch! Er redet ganz verwaschen und sein Gesicht hängt auf einer Seite runter! Ich habe Angst!',
    fragen: [
      {
        text: 'Wann haben die Beschwerden angefangen?',
        antwort: 'Vor ungefähr zehn Minuten, beim Frühstück. Es kam ganz plötzlich.',
        wichtig: true,
      },
      {
        text: 'Wo befinden Sie sich?',
        antwort: 'In Regensburg, Am Haidplatz 5, zweiter Stock. Ich bin zu Besuch bei ihm.',
        wichtig: true,
      },
      {
        text: 'Wie heißt Ihr Vater und wie alt ist er?',
        antwort: 'Karl Meier, 74 Jahre alt.',
        wichtig: false,
      },
      {
        text: 'Kann er beide Arme heben? Ist er ansprechbar?',
        antwort: 'Der linke Arm hängt schlaff runter. Er ist wach, versteht mich auch, aber er findet die Worte nicht.',
        wichtig: true,
      },
      {
        text: 'Atmet er normal? Ist er noch bei Bewusstsein?',
        antwort: 'Ja, er atmet ruhig und sitzt aufrecht am Tisch.',
        wichtig: true,
      },
      {
        text: 'Hat er Vorerkrankungen oder Medikamente?',
        antwort: 'Bluthochdruck und irgendwelche Tabletten. Den Zettel suche ich gleich raus.',
        wichtig: false,
      },
      {
        text: 'Hat er heute schon etwas getrunken?',
        antwort: 'Einen Kaffee, vorhin am Tisch.',
        wichtig: false,
      },
    ],
    mittel: ['rtw', 'nef'],
    erklaerung:
      'Herabhängender Mundwinkel, Lähmung eines Arms und Sprachstörung sind typische Schlaganfallzeichen, ein zeitkritischer Notfall. Rettungswagen und Notarzt bringen den Patienten schnell in eine geeignete Klinik. Die Leitstelle fragt unbedingt nach dem Beginn der Beschwerden.',
    anweisung:
      'Lassen Sie Ihren Vater ruhig sitzen oder mit erhöhtem Oberkörper liegen, geben Sie ihm nichts zu essen oder zu trinken und merken Sie sich die Uhrzeit des Beginns.',
  },
  {
    id: 'leitstelle-fahrradsturz-leicht',
    titel: 'Gestürzt auf dem Radweg',
    anruf:
      'Ich bin mit dem Fahrrad weggerutscht und hingefallen. Mein Handgelenk tut ziemlich weh, ich weiß nicht, ob ich selbst weiterkomme.',
    fragen: [
      {
        text: 'Wo befinden Sie sich?',
        antwort: 'Auf dem Radweg an der Weser in Bremen, bei der Bürgermeister-Smidt-Brücke, auf der Stadtseite.',
        wichtig: true,
      },
      {
        text: 'Haben Sie den Kopf angestoßen oder waren bewusstlos?',
        antwort: 'Nein, ich habe einen Helm getragen und war die ganze Zeit wach. Mir ist auch nicht schwindelig.',
        wichtig: true,
      },
      {
        text: 'Was für ein Fahrrad war das?',
        antwort: 'Ein normales Citybike, ein paar Kratzer, aber noch fahrbar.',
        wichtig: false,
      },
      {
        text: 'Wo haben Sie Schmerzen und blutet es stark?',
        antwort: 'Das linke Handgelenk und das Knie sind aufgeschürft. Es blutet etwas, aber nicht stark.',
        wichtig: true,
      },
      {
        text: 'Wie heißen Sie und wie alt sind Sie?',
        antwort: 'Lena Fischer, 34 Jahre.',
        wichtig: false,
      },
      {
        text: 'Waren weitere Personen oder Fahrzeuge beteiligt?',
        antwort: 'Nein, ich bin allein gefahren. Es lag Laub auf dem Weg.',
        wichtig: true,
      },
      {
        text: 'Ist die Straße blockiert oder droht eine Gefahr?',
        antwort: 'Nein, ich sitze am Wegrand. Hier ist alles ruhig.',
        wichtig: false,
      },
    ],
    mittel: ['ktw'],
    erklaerung:
      'Die Patientin ist wach, stabil und blutet nicht stark, es besteht keine Lebensgefahr, aber ein Verdacht auf Prellung oder Bruch am Handgelenk. Ein Krankentransportwagen reicht, um sie zur ärztlichen Untersuchung zu fahren. Bei Kopfverletzung, Bewusstlosigkeit oder starker Blutung würde die Leitstelle einen Rettungswagen schicken.',
    anweisung:
      'Bleiben Sie sitzen, halten Sie das Handgelenk ruhig und stützen Sie es, wenn möglich, während der Krankentransport zu Ihnen unterwegs ist.',
  },
  {
    id: 'leitstelle-bewusstlos-wald',
    titel: 'Person liegt abseits des Wanderwegs',
    anruf:
      'Ich bin hier beim Wandern und habe jemanden im Gebüsch neben dem Weg gefunden! Er liegt da und reagiert nicht! Ich weiß gar nicht genau, wo ich bin!',
    fragen: [
      {
        text: 'Wo genau sind Sie? Gibt es Wegmarken oder einen Rettungspunkt?',
        antwort: 'Im Schwarzwald oberhalb von Triberg, am Wanderweg zum Wasserfall. Bei einem Wegweiser steht „Rettungspunkt S 4711“.',
        wichtig: true,
      },
      {
        text: 'Reagiert die Person, wenn Sie sie ansprechen? Atmet sie?',
        antwort: 'Sie reagiert nicht, auch nicht, wenn ich sie anfasse. Sie atmet aber, ich sehe, wie sich der Brustkorb bewegt.',
        wichtig: true,
      },
      {
        text: 'Wie heißt die Person?',
        antwort: 'Ich kenne ihn nicht, ich habe ihn nur gefunden.',
        wichtig: false,
      },
      {
        text: 'Was ist Ihrer Meinung nach passiert?',
        antwort: 'Vielleicht ist er den Hang runtergestürzt. Er liegt unterhalb vom Weg und hat eine Platzwunde am Kopf.',
        wichtig: true,
      },
      {
        text: 'Wie viele Personen sind betroffen?',
        antwort: 'Nur er, soweit ich sehe. Ich bin zu zweit mit meinem Mann hier.',
        wichtig: true,
      },
      {
        text: 'Können Rettungsfahrzeuge bis zu Ihnen fahren?',
        antwort: 'Nein, bis zur nächsten Forststraße sind es bestimmt zehn Minuten zu Fuß.',
        wichtig: false,
      },
      {
        text: 'Wie ist das Wetter vor Ort?',
        antwort: 'Es ist neblig und kühl, aber es regnet nicht.',
        wichtig: false,
      },
    ],
    mittel: ['rth', 'rtw'],
    erklaerung:
      'Eine bewusstlose Person nach Sturz im unwegsamen Gelände ist ein schwerer Notfall mit Verdacht auf Kopfverletzung. Der Hubschrauber ist schnell vor Ort, der Rettungswagen kommt für den weiteren Transport und als Zubringer. Wichtig sind eine genaue Ortsbeschreibung oder der Rettungspunkt, die Atmung und weitere Gefahren.',
    anweisung:
      'Wenn die Person normal atmet, bringen Sie sie vorsichtig in die stabile Seitenlage, decken Sie sie zu und lassen Sie Ihren Mann zum Rettungspunkt gehen, um uns einzuweisen.',
  },
  {
    id: 'leitstelle-wespenstich-allergie',
    titel: 'Plötzlich Schwellung nach Stich',
    anruf:
      'Meine Kollegin wurde im Garten von einer Wespe gestochen, und jetzt schwillt ihr Gesicht an! Sie kriegt schlecht Luft, bitte kommen Sie!',
    fragen: [
      {
        text: 'Wo befinden Sie sich?',
        antwort: 'In Freiburg, Hansjakobstraße 9, im Biergarten hinter dem Haus. Der Eingang ist an der Seitenstraße.',
        wichtig: true,
      },
      {
        text: 'Wie heißt die Kollegin?',
        antwort: 'Sabine Huber, sie ist Mitte 40.',
        wichtig: false,
      },
      {
        text: 'Wie ist ihre Atmung? Gibt es Schwellungen im Gesicht oder Hals?',
        antwort: 'Die Lippen und die Augenlider sind dick, sie pfeift beim Atmen und sagt, der Hals fühlt sich eng an.',
        wichtig: true,
      },
      {
        text: 'Ist sie bei Bewusstsein? Wirkt sie schwach oder blass?',
        antwort: 'Ja, aber sie ist ganz blass und schwitzt. Sie sagt, ihr wird schwindelig.',
        wichtig: true,
      },
      {
        text: 'Wo wurde sie gestochen?',
        antwort: 'Am Unterarm. Dort ist eine rote Stelle, der Stachel steckt, glaube ich, nicht mehr.',
        wichtig: false,
      },
      {
        text: 'Ist ihr eine Allergie bekannt?',
        antwort: 'Ja, sie hat mal erwähnt, dass sie auf Wespen allergisch ist. Ein Notfallset hat sie nicht dabei.',
        wichtig: true,
      },
      {
        text: 'Wie lange ist der Stich her?',
        antwort: 'Vielleicht fünf Minuten.',
        wichtig: false,
      },
    ],
    mittel: ['rtw', 'nef'],
    erklaerung:
      'Schwellung im Gesicht, Atemnot und Kreislaufschwäche nach einem Insektenstich sprechen für eine schwere allergische Reaktion bis hin zum Schock. Das ist lebensbedrohlich, deshalb werden Rettungswagen und Notarzt gemeinsam alarmiert. Die Leitstelle erfragt Atmung, Kreislauf und bekannte Allergien.',
    anweisung:
      'Setzen Sie Ihre Kollegin bequem hin (bei Schwindel oder Schwäche legen Sie sie hin), bleiben Sie bei ihr und beobachten Sie die Atmung, bis der Notarzt da ist.',
  },
  {
    id: 'leitstelle-tuer-oeffnen',
    titel: 'Nachbarin öffnet nicht mehr',
    anruf:
      'Ich mache mir Sorgen um meine Nachbarin. Sie macht nicht auf, und ich glaube, ich habe drinnen etwas gehört. Die Tür ist abgeschlossen!',
    fragen: [
      {
        text: 'Wo genau sind Sie? Straße, Hausnummer, Stockwerk?',
        antwort: 'In Kiel, Holtenauer Straße 88, vierter Stock links. Ich stehe vor der Wohnungstür.',
        wichtig: true,
      },
      {
        text: 'Was haben Sie gehört oder gesehen?',
        antwort: 'Es klingt wie leises Rufen oder Stöhnen. Seit gestern liegt ihre Zeitung vor der Tür.',
        wichtig: true,
      },
      {
        text: 'Wie heißt Ihre Nachbarin?',
        antwort: 'Frau Petersen, sie ist über 80 und wohnt alleine.',
        wichtig: false,
      },
      {
        text: 'Reagiert sie, wenn Sie klopfen und rufen?',
        antwort: 'Ja, ein bisschen. Ich höre ein schwaches „Hilfe“, aber sie kommt nicht zur Tür.',
        wichtig: true,
      },
      {
        text: 'Riecht es nach Rauch oder Gas, oder läuft Wasser?',
        antwort: 'Nein, nichts davon. Es ist nur still im Flur.',
        wichtig: true,
      },
      {
        text: 'Gibt es einen Schlüssel bei einem Angehörigen?',
        antwort: 'Ihr Sohn wohnt in München, der ist nicht erreichbar. Ich habe keinen Schlüssel.',
        wichtig: false,
      },
      {
        text: 'Seit wann haben Sie sie nicht mehr gesehen?',
        antwort: 'Seit gestern Vormittag, da haben wir noch im Treppenhaus gesprochen.',
        wichtig: false,
      },
    ],
    mittel: ['feuerwehr', 'rtw'],
    erklaerung:
      'Eine hilflose Person hinter einer verschlossenen Tür braucht zuerst die Feuerwehr zur Türöffnung und den Rettungswagen, der sie sofort versorgt. Die Leitstelle fragt nach Lebenszeichen und Gefahren wie Gas oder Rauch und warnt davor, die Tür selbst aufzubrechen.',
    anweisung:
      'Brechen Sie die Tür nicht selbst auf, bleiben Sie in der Nähe, rufen Sie ihr Mut zu und öffnen Sie der Feuerwehr die Haustür.',
  },
  {
    id: 'leitstelle-schnittverletzung-blutung',
    titel: 'Tiefer Schnitt in der Küche',
    anruf:
      'Ich habe mir beim Gemüseschneiden in die Hand geschnitten, und es hört gar nicht mehr auf zu bluten! Das Blut läuft überall hin!',
    fragen: [
      {
        text: 'Wo genau sind Sie?',
        antwort: 'In Münster, Hammer Straße 56, im Erdgeschoss. Die Tür ist offen, ich bin in der Küche.',
        wichtig: true,
      },
      {
        text: 'Wie heißen Sie und wie alt sind Sie?',
        antwort: 'Markus Wagner, 52.',
        wichtig: false,
      },
      {
        text: 'Wie stark blutet die Wunde und wo genau ist sie?',
        antwort: 'Quer über die linke Handfläche, tief, und das Blut tropft ständig. Das Geschirrtuch ist schon durchgeweicht.',
        wichtig: true,
      },
      {
        text: 'Sind Sie allein? Wird Ihnen schwindelig?',
        antwort: 'Ja, ich bin alleine. Mir wird ein bisschen flau, ich setze mich besser hin.',
        wichtig: true,
      },
      {
        text: 'Haben Sie das Messer noch in der Hand?',
        antwort: 'Nein, das liegt auf der Arbeitsplatte, es ist nicht mehr in der Wunde.',
        wichtig: false,
      },
      {
        text: 'Nehmen Sie blutverdünnende Medikamente?',
        antwort: 'Ja, ich nehme wegen meines Herzens einen Blutverdünner.',
        wichtig: false,
      },
      {
        text: 'Sind Sie bei Bewusstsein und atmen normal?',
        antwort: 'Ja, ich bin wach, atme normal, nur die Hand zittert.',
        wichtig: true,
      },
    ],
    mittel: ['rtw'],
    erklaerung:
      'Eine stark blutende Schnittwunde an der Hand muss schnell medizinisch versorgt werden, der Patient ist aber ansprechbar. Der Rettungswagen reicht, ein Notarzt ist nicht nötig. Bei blutverdünnenden Medikamenten blutet es länger, deshalb ist Druck auf die Wunde sofort entscheidend.',
    anweisung:
      'Drücken Sie ein sauberes Tuch fest auf die Wunde, heben Sie die Hand an und legen Sie sich hin, ohne den Druck zu lösen, bis der Rettungsdienst da ist.',
  },
];
