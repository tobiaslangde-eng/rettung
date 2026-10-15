import { NotrufSzenario } from './helferTraining';

export const NOTRUF_SZENARIEN: NotrufSzenario[] = [
  {
    id: 'notruf-herzstillstand-supermarkt',
    titel: 'Zusammenbruch im Supermarkt',
    lage: 'Du stehst an der Kasse eines Supermarkts. Ein älterer Mann vor dir sackt plötzlich zu Boden und reagiert nicht, als du ihn ansprichst. Er atmet nicht normal. Du wählst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo genau ist der Notfall?',
        antworten: [
          'Ich bin in Hannover im Supermarkt an der Lindenallee 8, direkt an den Kassen im Eingangsbereich.',
          'Im Supermarkt. Der ist in der Nähe vom Bahnhof, glaube ich.',
          'Das ist egal, schicken Sie einfach schnell jemanden, es ist ganz schlimm!',
        ],
        erklaerung: 'Der Einsatzort entscheidet, wohin der Rettungswagen fährt. Straße, Hausnummer und der genaue Punkt im Gebäude sparen wertvolle Minuten.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Ein Mann ist vor mir zusammengebrochen. Er reagiert nicht auf Ansprechen und atmet nicht normal.',
          'Hier ist was passiert! Ein Mann liegt da.',
          'Ich glaube, der hat zu viel getragen und ist gestolpert.',
        ],
        erklaerung: 'Bewusstlos und keine normale Atmung sind die Stichworte, bei denen die Leitstelle sofort an einen Herzstillstand denkt und Anleitung zur Wiederbelebung vorbereitet.',
      },
      {
        frage: 'Wie viele Personen sind betroffen?',
        antworten: [
          'Eine Person, ein Mann, ungefähr 70 Jahre alt.',
          'Alle hier im Laden stehen herum und starren ihn an.',
          'Das weiß ich nicht, ich habe nicht gezählt.',
        ],
        erklaerung: 'Die Zahl der Betroffenen bestimmt, wie viele Rettungskräfte kommen. Alter und Geschlecht helfen zusätzlich bei der Einschätzung.',
      },
      {
        frage: 'Atmet der Mann normal? Reagiert er, wenn du ihn anfasst?',
        antworten: [
          'Nein, er reagiert nicht und atmet nicht normal. Ich habe die Atmung etwa zehn Sekunden lang geprüft.',
          'Er sieht blass aus, vielleicht ruht er sich nur kurz aus.',
          'Ich traue mich nicht, ihn anzufassen. Das macht lieber der Rettungsdienst.',
        ],
        erklaerung: 'Eine klare Aussage zu Reaktion und Atmung ist die wichtigste Information. Daraufhin leitet dich die Leitstelle zur Herzdruckmassage an.',
      },
      {
        frage: 'Ich bleibe am Telefon. Lass bitte einen Defibrillator holen und beginne mit der Herzdruckmassage. Bereit?',
        antworten: [
          'Ja. Ich stelle das Telefon auf Lautsprecher, bitte eine Person um den AED und drücke in der Mitte des Brustkorbs.',
          'Ich muss jetzt Schluss machen, ich brauche beide Hände.',
          'Können Sie nicht einfach schneller kommen? Ich weiß nicht, was ich tun soll!',
        ],
        erklaerung: 'Mit Lautsprecher hast du beide Hände frei und bleibst in Verbindung. Eine zweite Person holt den AED, während du ohne Pause drückst.',
      },
    ],
  },
  {
    id: 'notruf-verkehrsunfall-landstrasse',
    titel: 'Unfall auf der Landstraße',
    lage: 'Du fährst abends auf einer Landstraße und siehst zwei zusammengestoßene Autos am Straßenrand. Eine Frau sitzt benommen im Gras, ein Fahrer ist noch im Wagen. Du hältst an, sicherst die Stelle mit Warnblinker und Warnweste und rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo ist der Unfall passiert?',
        antworten: [
          'Auf der L 322 zwischen Wolfratshausen und Geretsried, zwei Kilometer hinter dem Ortsschild Wolfratshausen.',
          'Auf einer Landstraße, ich weiß nicht genau, wo. Irgendwo im Wald.',
          'Wo ich bin? Das ist jetzt unwichtig, es sind Verletzte da!',
        ],
        erklaerung: 'Auf Landstraßen fehlen Hausnummern. Straße, Ortschaften und Fahrtrichtung oder Kilometerangaben helfen der Leitstelle, die Stelle zu finden.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Zwei Autos sind frontal zusammengestoßen. Die Unfallstelle ist mit Warnblinker gesichert, es besteht keine Brandgefahr zu sehen.',
          'Hier ist ein Unfall! Bitte kommen Sie!',
          'Ein Auto ist wohl irgendwo gegengefahren, das war bestimmt ein Wildunfall.',
        ],
        erklaerung: 'Die Art des Unfalls und der Hinweis auf Gefahren zeigen der Leitstelle, ob zusätzlich Feuerwehr zur Absicherung oder Befreiung nötig ist.',
      },
      {
        frage: 'Wie viele Verletzte gibt es?',
        antworten: [
          'Drei Personen: eine ansprechbare Frau im Gras, ein Fahrer im Auto und ein Beifahrer, den ich noch nicht erreicht habe.',
          'Mehrere. Ich glaube, alle sind verletzt.',
          'Das sind zu viele, ich kann das nicht sagen.',
        ],
        erklaerung: 'Eine genaue Zahl, auch mit Unsicherheiten, lässt die Leitstelle gleich mehrere Rettungswagen und einen Notarzt losschicken.',
      },
      {
        frage: 'Welche Beschwerden haben die Verletzten? Sind sie ansprechbar?',
        antworten: [
          'Die Frau ist ansprechbar, klagt über Nackenschmerzen. Der Fahrer ist benommen, aber ansprechbar. Zum Beifahrer gehe ich jetzt.',
          'Die sind alle irgendwie kaputt.',
          'Ich habe bei niemandem nachgeschaut, ich wollte erst anrufen und dann auflegen.',
        ],
        erklaerung: 'Ansprechbarkeit und Hauptbeschwerden zeigen, wer am dringendsten Hilfe braucht. Die Leitstelle kann dir dann gezielt Hinweise geben.',
      },
      {
        frage: 'Bleib bitte am Telefon, die Retter sind unterwegs. Kannst du die Stelle sichern und die Verletzten betreuen?',
        antworten: [
          'Ja. Ich stelle ein Warndreieck auf, bleibe bei den Verletzten, rede mit ihnen und lasse sie nicht allein.',
          'Ich fahre schnell weiter, ich bin schon spät dran.',
          'Nein, ich fasse niemanden an, das ist zu gefährlich.',
        ],
        erklaerung: 'Absichern, Ansprechen und Dabeibleiben sind für Laien die wichtigsten Hilfen bis zum Eintreffen des Rettungsdienstes.',
      },
    ],
  },
  {
    id: 'notruf-kuechenbrand',
    titel: 'Küchenbrand mit Rauch',
    lage: 'Du bist bei Freunden zu Besuch. In der Küche brennt eine Pfanne, die Flammen greifen auf die Dunstabzugshaube über. Der Raum füllt sich mit Rauch. Du bist mit allen anderen in den Flur geflüchtet und rufst die 112.',
    schritte: [
      {
        frage: 'Feuerwehr und Rettungsleitstelle, Notruf 112. Wo brennt es?',
        antworten: [
          'In Leipzig, Gartenstraße 27, zweiter Stock, Wohnung links. Das ist ein Mehrfamilienhaus mit grüner Haustür.',
          'In einer Küche, bei Freunden, ich weiß die Adresse gerade nicht.',
          'Bei uns brennt es! Kommen Sie schnell!',
        ],
        erklaerung: 'Adresse, Stockwerk und Lage der Wohnung sind das Wichtigste. Die Feuerwehr findet damit den Einsatzort schneller.',
      },
      {
        frage: 'Was brennt genau?',
        antworten: [
          'Eine Pfanne mit Öl auf dem Herd brennt, die Flammen sind an der Dunstabzugshaube. Die Küche ist voller Rauch.',
          'Das Feuer ist groß, die ganze Wohnung wird brennen.',
          'Ich versuche es gerade mit Wasser zu löschen.',
        ],
        erklaerung: 'Ein Fettbrand darf nie mit Wasser gelöscht werden, es kann zu einer Stichflamme kommen. Eine genaue Beschreibung hilft der Feuerwehr bei der Vorbereitung.',
      },
      {
        frage: 'Wie viele Personen sind in der Wohnung oder im Haus?',
        antworten: [
          'Wir sind vier Personen und alle im Treppenhaus. Ob noch jemand in den anderen Wohnungen ist, weiß ich nicht.',
          'Alle sind verbrannt oder sterben gleich!',
          'Ich bin allein, die anderen sind mir egal.',
        ],
        erklaerung: 'Die Zahl der Geretteten und die Ungewissheit über weitere Personen bestimmen, ob die Feuerwehr sofort eine Suche im Haus beginnt.',
      },
      {
        frage: 'Ist jemand verletzt oder hat Rauch eingeatmet?',
        antworten: [
          'Eine Person hustet stark und klagt über Atemnot, die anderen sind unverletzt. Die Tür zur Wohnung haben wir geschlossen.',
          'Nein, alles gut. Ich wollte nur kurz Bescheid sagen.',
          'Keine Ahnung, ich habe nicht hingeschaut.',
        ],
        erklaerung: 'Rauchvergiftung ist lebensgefährlich. Mit dem Hinweis auf Atemnot schickt die Leitstelle auch einen Rettungswagen mit.',
      },
      {
        frage: 'Bleib bitte außerhalb der Wohnung und warte auf die Feuerwehr. Kannst du das?',
        antworten: [
          'Ja. Wir gehen aus dem Haus, warnen die Nachbarn und warten draußen an der Straße, bis die Feuerwehr da ist.',
          'Ich gehe noch einmal rein und hole schnell Dokumente.',
          'Ich öffne alle Fenster in der Wohnung, dann zieht der Rauch ab.',
        ],
        erklaerung: 'Nie zurück in ein brennendes Gebäude. Geschlossene Türen halten Rauch zurück, draußen wartest du an einem Ort, an dem du die Feuerwehr einweisen kannst.',
      },
    ],
  },
  {
    id: 'notruf-kind-verschluckt',
    titel: 'Kind hat sich verschluckt',
    lage: 'Du bist im Haus deiner Schwester und passt auf die vierjährige Lena auf. Sie hat etwas in den Mund gesteckt, kann plötzlich nicht mehr sprechen und läuft rot an. Du hast sie schon mit Schlägen auf den Rücken versucht, es hilft nichts. Du rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo seid ihr?',
        antworten: [
          'In Münster, Eichenweg 5, Erdgeschoss. Die Haustür ist offen, ich öffne sie gleich nochmal für Sie.',
          'Bei meiner Schwester im Haus. Ich glaube, der Weg heißt irgendwas mit Eiche.',
          'Das ist doch jetzt egal, kommen Sie sofort!',
        ],
        erklaerung: 'Auch in Panik muss der Ort stimmen. Der Hinweis, dass die Tür offen ist, spart dem Rettungsdienst Zeit.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Ein vierjähriges Kind hat sich vermutlich an einer Weintraube verschluckt. Es bekommt keine Luft mehr.',
          'Hier ist was passiert! Das Kind ist komisch.',
          'Das Kind hat Bauchweh und weint ein bisschen.',
        ],
        erklaerung: 'Verschlucken und Luftnot sind die entscheidenden Stichwörter. Die Leitstelle kann sofort Hinweise zum Vorgehen geben.',
      },
      {
        frage: 'Wie viele Personen sind betroffen und wie alt ist das Kind?',
        antworten: [
          'Ein Kind, Lena, vier Jahre alt, ungefähr 16 Kilo.',
          'Zwei Kinder, aber das andere schläft nur.',
          'Ein kleines Kind, ich kenne das Alter nicht.',
        ],
        erklaerung: 'Das Alter bestimmt, welche Maßnahmen empfohlen werden und welche Ausrüstung mitkommt. Ein Name beruhigt das Kind und hilft bei der Übergabe.',
      },
      {
        frage: 'Wie geht es dem Kind? Kann es husten oder atmen?',
        antworten: [
          'Es kann nicht husten und nicht sprechen, das Gesicht wird blau. Fünf Schläge auf den Rücken haben nichts gebracht.',
          'Es atmet schon irgendwie, ich glaube, es geht wieder.',
          'Ich weiß nicht, ob es Luft bekommt. Ich schaue nicht so genau hin.',
        ],
        erklaerung: 'Ein stiller Hustenstoß und Blauwerden bedeuten Lebensgefahr. Die Info, was du schon getan hast, hilft der Leitstelle, die nächsten Schritte anzusagen.',
      },
      {
        frage: 'Mach jetzt bitte fünf Oberbauchkompressionen. Ich bleibe dran. Sag mir, was passiert.',
        antworten: [
          'Ich stelle auf Lautsprecher, umfasse Lena von hinten und drücke fünfmal kräftig nach innen und oben.',
          'Ich will ihr nicht wehtun. Ich warte lieber, bis jemand kommt.',
          'Ich gebe ihr schnell was zu trinken, damit es runterrutscht.',
        ],
        erklaerung: 'Bei einer Verlegung der Atemwege ohne Erfolg werden Rückenschläge und Oberbauchkompressionen im Wechsel durchgeführt. Trinken oder Abwarten kann das Kind das Leben kosten.',
      },
    ],
  },
  {
    id: 'notruf-sturz-seniorin-wohnung',
    titel: 'Sturz der Nachbarin',
    lage: 'Du hörst im Treppenhaus ein lautes Poltern aus der Wohnung von Frau Hartmann (82). Du klingelst und rufst, drinnen hörst du ein Rufen, aber die Tür ist verschlossen. Du hast keinen Schlüssel und rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo ist der Notfall?',
        antworten: [
          'In Kassel, Weserstraße 14, dritter Stock, Wohnung rechts bei Hartmann. Die Wohnungstür ist verschlossen.',
          'Bei der alten Dame im Haus. Wo, weiß ich nicht genau.',
          'In Kassel. Die Frau ist gestürzt, bitte kommen Sie.',
        ],
        erklaerung: 'Neben der genauen Adresse ist der Hinweis auf die verschlossene Tür entscheidend. Die Leitstelle kann dann die Feuerwehr zum Türöffnen mitschicken.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Ich habe ein lautes Poltern gehört und höre Frau Hartmann rufen. Sie ist vermutlich gestürzt und kann die Tür nicht öffnen.',
          'Ich glaube, die Nachbarin hat nur ein Glas fallen lassen.',
          'Hier ist was passiert! Sie sind ja bestimmt schon unterwegs.',
        ],
        erklaerung: 'Deine Beobachtung vom Geräusch und der rufenden Person liefert der Leitstelle die Lage, auch wenn du die Verletzte selbst nicht siehst.',
      },
      {
        frage: 'Wie viele Personen sind in der Wohnung?',
        antworten: [
          'Soweit ich weiß, wohnt Frau Hartmann allein. Ich höre nur eine Stimme.',
          'Mindestens drei, ich höre Stimmen durcheinander.',
          'Keine Ahnung, ich habe nie mit ihr gesprochen.',
        ],
        erklaerung: 'Die Leitstelle muss wissen, wie viele Menschen im Notfall sind. Dein Wissen über Alleinleben hilft bei der Planung des Einsatzes.',
      },
      {
        frage: 'Kannst du mit der Frau sprechen? Was sagt sie?',
        antworten: [
          'Ja, durch die Tür. Sie sagt, sie ist gestürzt, hat starke Schmerzen in der Hüfte und kommt nicht mehr hoch.',
          'Sie antwortet nicht, ich lege jetzt auf.',
          'Ich trete die Tür ein, dann sehe ich es selbst.',
        ],
        erklaerung: 'Die Schilderung der Verletzten durch die Tür verrät die Dringlichkeit. Gewaltsames Öffnen sollte die Feuerwehr übernehmen.',
      },
      {
        frage: 'Die Feuerwehr öffnet die Tür. Bleibst du bitte bis zum Eintreffen in der Nähe und sprichst weiter mit ihr?',
        antworten: [
          'Ja. Ich bleibe an der Tür, rede beruhigend mit ihr und weise die Retter am Hauseingang ein.',
          'Ich gehe wieder in meine Wohnung, die kommen schon klar.',
          'Ich rufe erst die Familie an und warte auf deren Rückruf.',
        ],
        erklaerung: 'Beruhigendes Sprechen hilft der Gestürzten, und eine Person am Hauseingang spart dem Rettungsdienst die Suche nach der Wohnung.',
      },
    ],
  },
  {
    id: 'notruf-schlaganfall-nachbar',
    titel: 'Schlaganfall beim Nachbarn',
    lage: 'Dein Nachbar Herr Yilmaz (68) steht an der Gartenhecke und spricht plötzlich undeutlich. Sein rechter Mundwinkel hängt herab und der rechte Arm kann nicht gehoben werden. Du lässt ihn sich hinsetzen und rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo ist der Notfall?',
        antworten: [
          'In Nürnberg, Birkenweg 9, im Vorgarten. Ich stehe am Gartentor und warte auf den Rettungswagen.',
          'Bei meinem Nachbarn im Garten, irgendwo in Nürnberg.',
          'Mein Nachbar braucht einen Arzt, kommen Sie mal vorbei.',
        ],
        erklaerung: 'Der genaue Ort und dein Wartepunkt am Gartentor helfen dem Rettungsdienst, direkt zu dir zu finden.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Mein Nachbar spricht undeutlich, der rechte Mundwinkel hängt, der rechte Arm lässt sich nicht heben. Schlaganfall?',
          'Er ist gestolpert und hat sich den Arm verstaucht.',
          'Hier ist was passiert! Mein Nachbar ist krank!',
        ],
        erklaerung: 'Die drei typischen Zeichen Gesicht, Arm, Sprache sind für die Leitstelle ein klares Signal für einen Schlaganfall und lösen höchste Dringlichkeit aus.',
      },
      {
        frage: 'Wie viele Personen sind betroffen?',
        antworten: [
          'Eine Person, Herr Yilmaz, ungefähr 68 Jahre alt.',
          'Nur ich und er, aber die Nachbarn kommen schon.',
          'Alle Nachbarn machen sich Sorgen.',
        ],
        erklaerung: 'Die Zahl der Betroffenen bestimmt die Menge der Rettungsmittel. Name und Alter helfen bei der Übergabe.',
      },
      {
        frage: 'Wann hat es angefangen? Ist er ansprechbar und atmet er normal?',
        antworten: [
          'Es hat vor etwa fünf Minuten begonnen, es war um 15:10 Uhr. Er ist ansprechbar, atmet normal und sitzt auf einer Bank.',
          'Das weiß ich nicht, es kann schon länger sein.',
          'Er ist eigentlich schon die ganze Woche komisch, das ist nichts Neues.',
        ],
        erklaerung: 'Der Beginn der Symptome ist beim Schlaganfall entscheidend, weil sich danach die Behandlung richtet. Gib die Uhrzeit möglichst genau an.',
      },
      {
        frage: 'Der Rettungswagen ist unterwegs. Was machst du bis dahin?',
        antworten: [
          'Ich bleibe bei ihm, beruhige ihn, gebe nichts zu essen oder trinken und halte seine Medikamentenliste bereit.',
          'Ich lasse ihn kurz allein und hole einen Kaffee, damit er wach bleibt.',
          'Ich gebe ihm eine Aspirin, falls es ein Herzproblem ist.',
        ],
        erklaerung: 'Nichts zu essen oder trinken, keine Medikamente und Dabeibleiben sind die richtigen Schritte. Medikamentenliste und Uhrzeit helfen dem Notarzt.',
      },
    ],
  },
  {
    id: 'notruf-badeunfall-see',
    titel: 'Badeunfall am See',
    lage: 'Du liegst am Badesee in Brandenburg. Ein Mann zieht ein regungsloses Kind aus dem Wasser und ruft um Hilfe. Das Kind atmet nicht. Du rennst hin und alarmierst per Handy die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo ist der Notfall?',
        antworten: [
          'Am Krummen See bei Königs Wusterhausen, Hauptstrand neben dem Kiosk. Ich schicke jemanden zur Einfahrt Seestraße.',
          'An einem See, irgendwo in Brandenburg.',
          'Am Wasser! Hier ertrinkt ein Kind!',
        ],
        erklaerung: 'Am See hilft ein markanter Punkt wie der Kiosk, und eine Person an der Zufahrt kann die Retter einweisen.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Ein Kind wurde bewusstlos aus dem Wasser gezogen. Es atmet nicht.',
          'Hier ist was passiert, ein Kind war im Wasser!',
          'Ein Kind hat zu viel Wasser geschluckt und hustet vielleicht.',
        ],
        erklaerung: 'Bewusstlos und nicht atmend sind die Schlüsselinformationen. Die Leitstelle schickt sofort Notarzt und Rettungswagen.',
      },
      {
        frage: 'Wie viele Personen sind betroffen?',
        antworten: [
          'Ein Kind, ein Junge, ungefähr acht Jahre alt. Der Mann, der ihn gerettet hat, ist erschöpft, aber nicht verletzt.',
          'Mehrere Kinder, ich glaube, noch eins ist im See.',
          'Das Kind und der Mann sind beide ohnmächtig.',
        ],
        erklaerung: 'Die Anzahl und das Alter bestimmen die Ausrüstung. Wenn jemand noch vermisst wird, muss das sofort gemeldet werden, damit die Wasserrettung kommt.',
      },
      {
        frage: 'Was tust du gerade für das Kind?',
        antworten: [
          'Ich lege den Jungen auf festen Boden, prüfe die Atmung: keine. Ich beginne mit der Wiederbelebung.',
          'Ich drehe ihn auf den Bauch und klopfe auf den Rücken, damit das Wasser herauskommt.',
          'Ich warte, bis der Notarzt da ist, ich will nichts falsch machen.',
        ],
        erklaerung: 'Bei Ertrunkenen steht die Wiederbelebung im Vordergrund, nicht das Entleeren der Lunge. Jede Minute ohne Sauerstoff zählt.',
      },
      {
        frage: 'Ich bleibe am Telefon und zähle mit dir. Kannst du den Lautsprecher einschalten?',
        antworten: [
          'Ja, Lautsprecher ist an. Ich lege das Handy neben das Kind und beginne mit der Herzdruckmassage und den Beatmungen.',
          'Nein, ich muss auflegen, ich brauche das Handy für Fotos.',
          'Ich habe keinen Akku mehr, ich rufe später zurück.',
        ],
        erklaerung: 'Mit eingeschaltetem Lautsprecher kann die Leitstelle Takt und Hinweise geben, während du die Hände frei hast.',
      },
    ],
  },
  {
    id: 'notruf-fahrradunfall-kopf',
    titel: 'Fahrradunfall mit Kopfverletzung',
    lage: 'Du gehst auf dem Radweg an der Isar spazieren. Vor dir stürzt ein Radfahrer ohne Helm und schlägt mit dem Kopf auf den Asphalt. Er liegt still, aus einer Platzwunde am Kopf läuft Blut. Du rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo ist der Unfall passiert?',
        antworten: [
          'In München am Isarradweg, etwa 300 Meter südlich der Wittelsbacherbrücke auf der Ostseite des Flusses.',
          'Am Fluss, da ist ein Radweg.',
          'Ich weiß es nicht, ich bin zufällig hier spazieren.',
        ],
        erklaerung: 'Ohne Hausnummer helfen Wegpunkte wie Brücken, Flussseite und Entfernung. Der Rettungswagen kann dann gezielt zufahren.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Ein Radfahrer ist ohne Helm gestürzt und mit dem Kopf auf den Asphalt geschlagen. Er liegt am Boden.',
          'Hier ist was passiert! Ein Fahrrad liegt auf dem Weg.',
          'Ein Radfahrer ist wohl mit einem Hund zusammengestoßen.',
        ],
        erklaerung: 'Der Sturz ohne Helm und der Kopfaufprall sind für die Einsatzkräfte wichtig, weil schwere Kopfverletzungen mit anderen Maßnahmen versorgt werden.',
      },
      {
        frage: 'Wie viele Verletzte gibt es?',
        antworten: [
          'Eine verletzte Person, ein Mann, etwa 40 Jahre alt.',
          'Ich weiß nicht, ob der Hund auch verletzt ist.',
          'Alle Radfahrer hier sind in Gefahr, weil der Weg so voll ist.',
        ],
        erklaerung: 'Die klare Zahl der Verletzten verhindert, dass unnötig viele oder zu wenige Kräfte alarmiert werden.',
      },
      {
        frage: 'Ist der Mann ansprechbar? Atmet er normal? Blutet er stark?',
        antworten: [
          'Er stöhnt, reagiert kaum auf Ansprechen, atmet aber normal. Die Platzwunde blutet, ich drücke ein sauberes Tuch darauf.',
          'Er ist bewusstlos und tot, glaube ich.',
          'Er sagt, es geht schon wieder, ich sehe keinen Grund zur Sorge.',
        ],
        erklaerung: 'Ansprechbarkeit, Atmung und Blutung sind die drei Basisinfos. Ein sauberes Tuch mit Druck stillt die Blutung, ohne den Kopf zu bewegen.',
      },
      {
        frage: 'Bleib bei ihm. Bewege den Kopf möglichst nicht. Wenn er das Bewusstsein verliert, sag mir sofort Bescheid. Verstanden?',
        antworten: [
          'Verstanden. Ich bleibe bei ihm, bewege seinen Kopf nicht und rufe sofort an, wenn sich etwas ändert.',
          'Ich ziehe ihn schnell vom Radweg weg, damit er sicher liegt.',
          'Ich muss los, mein Bus fährt gleich.',
        ],
        erklaerung: 'Bei Kopfverletzung kann auch die Halswirbelsäule betroffen sein. Ruhig dabeibleiben und beobachten ist hier besser als Bewegen.',
      },
    ],
  },
  {
    id: 'notruf-allergie-restaurant',
    titel: 'Allergische Reaktion im Restaurant',
    lage: 'Du isst in einem Restaurant. Am Nebentisch hat eine Frau nach dem Essen plötzlich Atemnot, ihr Gesicht schwillt an und sie bekommt Hautausschlag. Sie sagt, sie sei gegen Nüsse allergisch. Du rufst die 112.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo seid ihr?',
        antworten: [
          'In Dresden im Restaurant Elbblick, Hauptstraße 31. Wir sitzen im Hauptraum, ich komme dem Rettungsdienst am Eingang entgegen.',
          'In einem Restaurant. Ich habe den Namen vergessen.',
          'Im Restaurant, die Straße kenne ich nicht.',
        ],
        erklaerung: 'Name und Adresse des Lokals plus ein Treffpunkt am Eingang bringen den Rettungsdienst auf kürzestem Weg zur Patientin.',
      },
      {
        frage: 'Was ist passiert?',
        antworten: [
          'Eine Frau hat nach dem Essen Atemnot bekommen, ihr Gesicht schwillt an und sie hat Ausschlag. Sie ist Nussallergikerin.',
          'Eine Frau hat sich am Essen verschluckt.',
          'Hier ist was passiert! Es ist ganz schlimm!',
        ],
        erklaerung: 'Allergie und Atemnot nennt die Leitstelle gleich als möglichen anaphylaktischen Schock. Der Hinweis auf Nüsse hilft später bei der Behandlung.',
      },
      {
        frage: 'Wie viele Personen sind betroffen?',
        antworten: [
          'Eine Frau, etwa 35 Jahre alt. Ihre Begleitung ist bei ihr, sonst ist niemand betroffen.',
          'Alle am Tisch haben etwas gegessen, das kann alle treffen.',
          'Das Restaurant ist voll, ich kann es nicht sagen.',
        ],
        erklaerung: 'Die Leitstelle klärt damit, ob es sich um einen Einzelfall oder um ein Lebensmittelproblem handelt, das mehrere trifft.',
      },
      {
        frage: 'Hat die Frau ein Notfallset, einen Adrenalin-Autoinjektor?',
        antworten: [
          'Ja, sie hat einen Autoinjektor in der Handtasche. Ihre Begleitung hilft ihr beim Anwenden, wie auf dem Gerät beschrieben.',
          'Ich weiß es nicht, ich habe nicht gefragt.',
          'Ich gebe ihr eine Tablette gegen Allergie aus meiner Tasche.',
        ],
        erklaerung: 'Hilfe bei der Anwendung des eigenen Notfallmedikaments ist erlaubt und kann lebensrettend sein. Fremde Medikamente gibt man nie.',
      },
      {
        frage: 'Wie lagert ihr die Frau? Und bleibt jemand bei ihr?',
        antworten: [
          'Sie sitzt aufrecht, weil sie schlecht Luft bekommt. Ihre Begleitung und ich bleiben bei ihr und beobachten die Atmung.',
          'Wir legen sie flach hin und die Beine hoch, das hilft immer.',
          'Wir gehen mit ihr an die frische Luft, vielleicht bessert es sich.',
        ],
        erklaerung: 'Bei Atemnot ist sitzende Position besser. Dabeibleiben und genau beobachten sind wichtig, falls sich der Zustand plötzlich verschlechtert.',
      },
    ],
  },
  {
    id: 'notruf-gasgeruch',
    titel: 'Gasgeruch im Treppenhaus',
    lage: 'Du kommst nach Hause und riechst im Treppenhaus deutlich Gas. Der Geruch kommt aus dem Keller. Du hast niemanden gesehen. Du gehst nach draußen und rufst von dort die 112.',
    schritte: [
      {
        frage: 'Feuerwehr und Rettungsleitstelle, Notruf 112. Wo riecht es nach Gas?',
        antworten: [
          'In Rostock, Warnowallee 40, im Treppenhaus und im Keller. Ich stehe vor dem Haus an der Straße.',
          'Im Treppenhaus bei mir, glaube ich.',
          'Irgendwo in Rostock riecht es komisch.',
        ],
        erklaerung: 'Die genaue Adresse und dein sicherer Standort außerhalb des Gebäudes sind hier wichtig. Anrufe aus der Gefahrenzone sind gefährlich.',
      },
      {
        frage: 'Was hast du bemerkt?',
        antworten: [
          'Im Treppenhaus riecht es stark nach Gas, am stärksten im Keller. Ich habe nichts angefasst und kein Licht angeschaltet.',
          'Ich habe gerade eine Kerze angezündet und dann den Geruch bemerkt.',
          'Es riecht seltsam. Vielleicht kocht jemand etwas.',
        ],
        erklaerung: 'Kein Licht, kein Schalter, keine offene Flamme. Funken können Gas entzünden, deshalb ist die Information wichtig für die Feuerwehr.',
      },
      {
        frage: 'Wie viele Personen sind im Haus?',
        antworten: [
          'Etwa zwölf Parteien. Ich habe noch niemanden gewarnt und klingle gleich bei den Nachbarn.',
          'Ich bin allein, andere Menschen gehen mich nichts an.',
          'Niemand ist zu Hause, glaube ich.',
        ],
        erklaerung: 'Die Anzahl der Bewohner bestimmt, wie viele Menschen evakuiert werden müssen. Warnen kannst du durch Klingeln und Rufen, nicht durch elektrische Geräte.',
      },
      {
        frage: 'Hat jemand Beschwerden, zum Beispiel Kopfschmerzen oder Schwindel?',
        antworten: [
          'Ich habe leichte Kopfschmerzen und Schwindel. Bei den anderen Bewohnern weiß ich es nicht.',
          'Nein, mir geht es bestens. Ich habe nur den Geruch bemerkt.',
          'Ich gehe nochmal rein und schaue nach, wer Beschwerden hat.',
        ],
        erklaerung: 'Gas kann zu Kopfschmerzen und Schwindel führen. Die Leitstelle schickt dann zusätzlich einen Rettungswagen.',
      },
      {
        frage: 'Bleib bitte draußen, öffne keine Tür und halte Abstand zum Haus. Kannst du das tun?',
        antworten: [
          'Ja. Ich bleibe draußen, halte Abstand und warne Leute, nicht ins Haus zu gehen, bis die Feuerwehr da ist.',
          'Ich gehe noch einmal rein und drehe den Gashahn zu.',
          'Ich zünde mir eine Zigarette an, um mich zu beruhigen.',
        ],
        erklaerung: 'Der Haupthahn wird von der Feuerwehr und dem Gasversorger geschlossen. Rauchen oder Rückkehr ins Haus ist lebensgefährlich.',
      },
    ],
  },
  {
    id: 'notruf-person-reglos-park',
    titel: 'Reglose Person im Park',
    lage: 'Du gehst abends durch einen Stadtpark und siehst eine Person reglos auf einer Wiese liegen. Du kannst nicht erkennen, ob sie betrunken, krank oder verletzt ist. Du rufst die 112, bevor du näher gehst.',
    schritte: [
      {
        frage: 'Rettungsleitstelle, Notruf 112. Wo bist du?',
        antworten: [
          'Im Stadtpark Frankfurt, in der Nähe des Haupteingangs Bockenheimer Straße, etwa 50 Meter links vom Spielplatz auf der Wiese.',
          'In einem Park in Frankfurt.',
          'Im Park. Es ist gerade zu dunkel, ich sehe nichts.',
        ],
        erklaerung: 'In einem großen Park braucht die Leitstelle markante Orientierungspunkte wie Eingang oder Spielplatz, um die Person zu finden.',
      },
      {
        frage: 'Was hast du gesehen?',
        antworten: [
          'Eine Person liegt reglos auf der Wiese. Ich habe sie noch nicht angesprochen und kann nicht sagen, ob sie atmet.',
          'Da liegt wahrscheinlich ein Betrunkener, das ist nicht mein Problem.',
          'Hier ist was passiert! Bitte kommen Sie!',
        ],
        erklaerung: 'Auch bei unklarer Lage zählt die ehrliche Schilderung dessen, was du siehst. Ob jemand betrunken oder krank ist, kann nur ein Profi beurteilen.',
      },
      {
        frage: 'Wie viele Personen siehst du?',
        antworten: [
          'Ich sehe eine Person. Niemand sonst ist in der Nähe, ich sehe auch keine Gefahrenquelle.',
          'Ich habe in der Dunkelheit mehrere Leute gesehen, ich bin nicht sicher.',
          'Ich weiß es nicht, ich habe gleich telefoniert.',
        ],
        erklaerung: 'Die Zahl der Personen und das Fehlen von Gefahren geben der Leitstelle die Gewissheit, dass Eigenschutz gewährleistet ist.',
      },
      {
        frage: 'Geh bitte vorsichtig hin. Sprich die Person laut an und berühre sie an den Schultern. Was passiert?',
        antworten: [
          'Ich spreche sie laut an und rüttele an den Schultern. Keine Reaktion. Ich prüfe jetzt die Atmung.',
          'Ich bleibe lieber auf Abstand, es kann gefährlich sein.',
          'Ich lege die Person auf den Bauch und gehe weiter.',
        ],
        erklaerung: 'Ansprechen und Anfassen sind der erste Schritt der Notfallprüfung. Nur so lässt sich klären, ob die Person bewusstlos ist.',
      },
      {
        frage: 'Die Person atmet normal, reagiert aber nicht. Was machst du jetzt?',
        antworten: [
          'Ich bringe sie in die stabile Seitenlage, decke sie zu und bleibe bei ihr, bis der Rettungswagen da ist.',
          'Ich lasse sie liegen, sie schläft bestimmt nur.',
          'Ich gebe ihr etwas zu trinken, damit sie wach wird.',
        ],
        erklaerung: 'Bei Bewusstlosigkeit mit normaler Atmung hält die stabile Seitenlage die Atemwege frei. Bleib dabei und beobachte die Atmung, bis Hilfe kommt.',
      },
    ],
  },
  {
    id: 'notruf-mehrfamilienhaus-brand',
    titel: 'Brand im Mehrfamilienhaus',
    lage: 'Du siehst nachts aus dem Fenster Rauch aus dem Dachgeschoss des gegenüberliegenden Mehrfamilienhauses steigen, in einem Fenster flackert Feuerschein. Du rufst die 112.',
    schritte: [
      {
        frage: 'Feuerwehr und Rettungsleitstelle, Notruf 112. Wo brennt es?',
        antworten: [
          'In Stuttgart, Schillerstraße 18, ein Mehrfamilienhaus mit fünf Etagen. Der Brand ist im Dachgeschoss.',
          'In einem Haus in Stuttgart, ich sehe es von meinem Fenster.',
          'Gegenüber von mir brennt es! Schnell!',
        ],
        erklaerung: 'Adresse und Lage des Brandes (Dachgeschoss) lassen die Feuerwehr gleich die passende Drehleiter anfordern.',
      },
      {
        frage: 'Was siehst du genau?',
        antworten: [
          'Dichter Rauch steigt aus dem Dach, in einem Fenster ist offenes Feuer. Das Nachbarhaus brennt noch nicht.',
          'Es ist ein kleiner Rauch, vermutlich nur ein Kamin.',
          'Das ganze Viertel brennt gleich ab!',
        ],
        erklaerung: 'Konkrete Beobachtungen wie Rauch, offenes Feuer und Ausbreitung helfen der Feuerwehr, die Größe des Einsatzes einzuschätzen.',
      },
      {
        frage: 'Weißt du, ob sich noch Personen im Haus befinden?',
        antworten: [
          'Ich sehe Licht in mehreren Fenstern, also sind wohl Bewohner da. Eine Person am Fenster im dritten Stock winkt.',
          'Ich weiß nur, dass dort Familien wohnen. Ob jemand zu Hause ist, sehe ich nicht.',
          'Alle sind bestimmt längst draußen.',
        ],
        erklaerung: 'Hinweise auf Menschen im Gebäude, besonders an Fenstern, entscheiden darüber, ob Menschenrettung Vorrang vor Löschen hat.',
      },
      {
        frage: 'Siehst du Verletzte oder Personen, die Hilfe brauchen?',
        antworten: [
          'Eine Frau steht am offenen Fenster im dritten Stock und ruft um Hilfe. Im Hof stehen Bewohner, die husten.',
          'Nein, ich sehe niemanden.',
          'Ich laufe rüber und gehe ins Haus.',
        ],
        erklaerung: 'Eingeschlossene Personen am Fenster sind die höchste Priorität. Husten deutet auf Rauchgas, dann schickt die Leitstelle auch Rettungswagen.',
      },
      {
        frage: 'Die Feuerwehr ist auf dem Weg. Kannst du die Einsatzkräfte einweisen und andere vom Haus fernhalten?',
        antworten: [
          'Ja. Ich gehe auf die Straße, weise die Feuerwehr ein und bitte Schaulustige, Abstand zu halten und die Zufahrt freizulassen.',
          'Ich gehe wieder schlafen, die Feuerwehr weiß ja Bescheid.',
          'Ich gehe ins brennende Haus und hole die Frau selbst heraus.',
        ],
        erklaerung: 'Einweisen und freie Zufahrt sparen der Feuerwehr Zeit. Der Eigenschutz verbietet es Laien, ein brennendes Haus zu betreten.',
      },
    ],
  },
];
