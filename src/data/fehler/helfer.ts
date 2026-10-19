import { FehlerSzenario } from './types';

export const FEHLER_HELFER: FehlerSzenario[] = [
  {
    id: 'helfer-notruf',
    titel: 'Notruf absetzen',
    lage: 'Auf dem Gehweg bricht ein Mann zusammen. Er reagiert nicht, als ein Passant ihn anspricht und an der Schulter rüttelt. Der Passant will Hilfe holen.',
    schritte: [
      {
        text: 'Er ruft zuerst seinen Hausarzt an und fragt, ob das ein Fall für den Notruf ist.',
        fehler: true,
        erklaerung: 'Bei Bewusstlosigkeit zählt jede Minute, und ein Hausarzt kann nicht vor Ort helfen. Richtig: sofort die 112 wählen, die Leitstelle entscheidet alles Weitere.',
      },
      {
        text: 'Er wählt die 112. Der Anruf ist kostenlos und funktioniert auch ohne Guthaben.',
        fehler: false,
        erklaerung: 'Richtig. Die 112 ist die Notrufnummer für Rettungsdienst und Feuerwehr, sie ist kostenlos und gilt in ganz Europa.',
      },
      {
        text: 'Er sagt nur „Hier ist ein Notfall“ und nennt keinen Ort, die Leitstelle könne sein Handy ja orten.',
        fehler: true,
        erklaerung: 'Die Ortung per Handy ist oft ungenau oder fehlt ganz. Richtig: genau sagen, wo es ist, mit Ort, Straße, Hausnummer oder einem auffälligen Punkt in der Nähe.',
      },
      {
        text: 'Er schildert kurz, was passiert ist: ein Mann liegt am Boden, reagiert nicht und atmet nicht normal.',
        fehler: false,
        erklaerung: 'Richtig. Mit wenigen Worten zu sagen, was geschehen ist und wie es der Person geht, hilft der Leitstelle, das passende Rettungsmittel zu schicken.',
      },
      {
        text: 'Er legt auf, sobald er die Lage geschildert hat, damit die Leitung wieder frei ist.',
        fehler: true,
        erklaerung: 'Die Leitstelle hat oft noch Rückfragen und gibt wichtige Anweisungen. Richtig: erst auflegen, wenn die Leitstelle das Gespräch beendet, und erreichbar bleiben.',
      },
      {
        text: 'Er bleibt beim Mann und schickt eine Passantin an die Straße, die den Rettungsdienst einweist.',
        fehler: false,
        erklaerung: 'Richtig. Der Verletzte darf nicht allein bleiben, und eine Einweiserin spart dem Rettungsdienst wertvolle Zeit bei der Suche.',
      },
    ],
    merksatz: 'Wo? Was? Wie viele? Warten auf Rückfragen. Aufgelegt wird nur von der Leitstelle.',
  },
  {
    id: 'helfer-seitenlage',
    titel: 'Stabile Seitenlage',
    lage: 'Eine Frau liegt bewusstlos auf dem Boden einer Wohnung. Sie reagiert nicht auf Ansprechen, eine Helferin hat den Notruf schon veranlasst.',
    schritte: [
      {
        text: 'Er spricht die Frau laut an und rüttelt vorsichtig an den Schultern. Sie reagiert nicht.',
        fehler: false,
        erklaerung: 'Richtig. So prüft man, ob eine Person bei Bewusstsein ist. Reagiert sie nicht, ist sie bewusstlos und braucht sofort Hilfe.',
      },
      {
        text: 'Er ruft laut um Hilfe und lässt die 112 anrufen.',
        fehler: false,
        erklaerung: 'Richtig. Eine bewusstlose Person gehört in ärztliche Hände. Wer Hilfe herbeiruft, kann sich danach in Ruhe um die Frau kümmern.',
      },
      {
        text: 'Er überstreckt ihren Kopf leicht und prüft bis zu 10 Sekunden, ob sie normal atmet. Sie atmet.',
        fehler: false,
        erklaerung: 'Richtig. Der überstreckte Kopf macht die Atemwege frei. Atmet sie normal, kommt sie in die stabile Seitenlage. Atmet sie nicht, beginnt die Wiederbelebung.',
      },
      {
        text: 'Er legt den nahen Arm angewinkelt nach oben und beugt das ferne Bein. Den fernen Arm legt er mit dem Handrücken an ihre Wange.',
        fehler: false,
        erklaerung: 'Richtig. So wird der Körper für das Drehen vorbereitet und der Kopf bekommt später eine stabile Stütze.',
      },
      {
        text: 'Er dreht sie an Schulter und Knie zu sich und lässt den Kopf nach vorn Richtung Brust sinken, damit sie bequem liegt.',
        fehler: true,
        erklaerung: 'Mit gesenktem Kopf können die Atemwege abknicken. Richtig: Kopf in den Nacken überstreckt lassen, der Mund zeigt leicht nach unten, damit Erbrochenes abfließt.',
      },
      {
        text: 'Er gibt ihr einen Schluck Wasser, damit sie schneller wieder zu sich kommt.',
        fehler: true,
        erklaerung: 'Eine bewusstlose Person kann sich verschlucken und ersticken. Richtig: nichts zu essen oder trinken geben, bis sie wieder voll wach ist.',
      },
      {
        text: 'Er deckt sie zu, bleibt bei ihr und kontrolliert ständig, ob sie weiter normal atmet.',
        fehler: false,
        erklaerung: 'Richtig. Die Atmung kann jederzeit aussetzen. Hört sie auf, legt man die Person auf den Rücken und beginnt sofort mit der Wiederbelebung.',
      },
    ],
    merksatz: 'Bewusstlos und normale Atmung: Seitenlage, Kopf überstreckt, dranbleiben und Atmung kontrollieren.',
  },
  {
    id: 'helfer-herzdruckmassage',
    titel: 'Herzdruckmassage',
    lage: 'Ein Mann sackt auf einer Bank zusammen. Er reagiert nicht und atmet nicht normal. Ein Passant beginnt mit der Wiederbelebung.',
    schritte: [
      {
        text: 'Er stellt fest: keine Reaktion, keine normale Atmung. Er lässt 112 rufen und einen Defibrillator holen.',
        fehler: false,
        erklaerung: 'Richtig. Keine normale Atmung bei einer bewusstlosen Person bedeutet Herzstillstand. Hilfe rufen und AED holen lassen kostet keine Zeit bei der Massage.',
      },
      {
        text: 'Er legt den Mann auf den Rücken auf eine feste Unterlage und macht den Oberkörper frei.',
        fehler: false,
        erklaerung: 'Richtig. Nur auf hartem Untergrund kommt der Druck am Herzen an. Auf einem weichen Sofa wird die Kraft vom Polster geschluckt.',
      },
      {
        text: 'Er setzt die Handballen auf den Oberbauch, knapp unter das Brustbein.',
        fehler: true,
        erklaerung: 'Dort wird nur der Bauch gedrückt, das Herz erreicht man so nicht. Richtig: Druckpunkt in der Mitte der Brust, auf der unteren Hälfte des Brustbeins.',
      },
      {
        text: 'Er drückt nur etwa 2 cm tief, damit keine Rippen brechen.',
        fehler: true,
        erklaerung: 'So flach wird kaum Blut bewegt. Richtig: etwa 5 bis 6 cm tief drücken. Rippenbrüche können passieren, heilen aber, ein Herzstillstand ohne Hilfe nicht.',
      },
      {
        text: 'Er drückt mit gestreckten Armen 100- bis 120-mal pro Minute, im Takt von „Stayin’ Alive“.',
        fehler: false,
        erklaerung: 'Richtig. Dieses Tempo hält den Blutkreislauf am besten aufrecht. Mit senkrechten, gestreckten Armen drückt es sich kräftiger und weniger anstrengend.',
      },
      {
        text: 'Er lässt den Brustkorb nach jedem Druck ganz zurückfedern, ohne die Hände abzuheben.',
        fehler: false,
        erklaerung: 'Richtig. Nur wenn der Brustkorb sich ganz entlastet, kann das Herz sich wieder mit Blut füllen.',
      },
      {
        text: 'Er hört alle paar Sekunden auf, um zu prüfen, ob der Mann wieder atmet.',
        fehler: true,
        erklaerung: 'Jede Pause lässt den Blutdruck sofort wieder fallen. Richtig: so wenig wie möglich unterbrechen und nicht ständig nachsehen, sondern durchdrücken.',
      },
      {
        text: 'Er macht weiter, bis der Rettungsdienst übernimmt, der Mann sich bewegt oder normal atmet.',
        fehler: false,
        erklaerung: 'Richtig. Erst wenn der Rettungsdienst übernimmt oder der Mann deutliche Lebenszeichen zeigt, darf man aufhören. Bei Erschöpfung wechseln sich Helfer ab.',
      },
    ],
    merksatz: 'Mitte der Brust, 5 bis 6 cm tief, 100 bis 120 pro Minute, kaum Pausen.',
  },
  {
    id: 'helfer-defibrillator',
    titel: 'Defibrillator einsetzen',
    lage: 'Eine Frau bricht im Supermarkt zusammen, reagiert nicht und atmet nicht normal. Ein Helfer drückt auf ihre Brust, ein Mitarbeiter bringt den AED.',
    schritte: [
      {
        text: 'Ein Helfer lässt die 112 anrufen und beginnt sofort mit der Herzdruckmassage, bis das Gerät da ist.',
        fehler: false,
        erklaerung: 'Richtig. Die Massage hält die Durchblutung aufrecht, bis der AED bereit ist. Der Notruf und der AED werden von weiteren Personen besorgt.',
      },
      {
        text: 'Als der AED da ist, bricht er die Massage ab, um in Ruhe alles vorzubereiten.',
        fehler: true,
        erklaerung: 'Ohne Massage sinkt die Überlebenschance schnell. Richtig: weiterdrücken, während eine zweite Person den AED einschaltet und die Elektroden klebt.',
      },
      {
        text: 'Ein zweiter Helfer schaltet den AED ein und folgt den Sprachansagen.',
        fehler: false,
        erklaerung: 'Richtig. Das Gerät führt Laien Schritt für Schritt durch die Anwendung. Man kann mit einem AED nichts falsch machen, wenn man den Ansagen folgt.',
      },
      {
        text: 'Er macht den Brustkorb frei, trocknet nasse Haut ab und klebt die Elektroden fest auf die Haut.',
        fehler: false,
        erklaerung: 'Richtig. Nur auf trockener, freier Haut haften die Elektroden gut und leiten den Strom richtig.',
      },
      {
        text: 'Er klebt beide Elektroden nebeneinander auf die Mitte der Brust.',
        fehler: true,
        erklaerung: 'So fließt der Strom nicht quer durch das Herz. Richtig: eine Elektrode rechts unter das Schlüsselbein, die andere links seitlich unter die Achsel, wie auf den Bildern.',
      },
      {
        text: 'Er sagt „Alle weg!“ und achtet darauf, dass bei der Analyse niemand die Frau berührt.',
        fehler: false,
        erklaerung: 'Richtig. Berührungen können die Analyse stören. Niemand fasst die Frau an, solange das Gerät analysiert oder einen Schock abgibt.',
      },
      {
        text: 'Er drückt die Schock-Taste sofort, ohne sich umzusehen, ob jemand die Frau berührt.',
        fehler: true,
        erklaerung: 'Wer die Frau berührt, bekommt einen Teil des Stroms ab. Richtig: vor dem Schock laut warnen, kurz umsehen und erst dann auslösen.',
      },
      {
        text: 'Nach dem Schock drückt er sofort weiter und lässt die Elektroden kleben.',
        fehler: false,
        erklaerung: 'Richtig. Nach dem Schock geht es sofort weiter mit der Herzdruckmassage. Das Gerät meldet sich nach etwa zwei Minuten zur nächsten Analyse.',
      },
    ],
    merksatz: 'Drücken, bis der AED klebt. Dann Sprachansagen folgen, vor dem Schock alle zurück.',
  },
  {
    id: 'helfer-starke-blutung',
    titel: 'Starke Blutung',
    lage: 'Ein Heimwerker hat sich mit der Säge tief in den Unterarm geschnitten. Das Blut läuft stark aus der Wunde. Ein Helfer kommt dazu.',
    schritte: [
      {
        text: 'Er zieht Einmalhandschuhe aus dem Verbandkasten an.',
        fehler: false,
        erklaerung: 'Richtig. Handschuhe schützen Helfer vor Krankheitserregern im Blut. Ist nichts zur Hand, nimmt man im Notfall eine Plastiktüte.',
      },
      {
        text: 'Er schnürt den Arm sofort mit einem Gürtel ab, statt direkt auf die Wunde zu drücken.',
        fehler: true,
        erklaerung: 'Abbinden schadet dem Gewebe und ist nur der letzte Ausweg. Richtig: zuerst mit einem Tuch fest direkt auf die Wunde drücken.',
      },
      {
        text: 'Er lässt die verletzte Person sich hinlegen und drückt mit einem sauberen Tuch fest auf die Wunde.',
        fehler: false,
        erklaerung: 'Richtig. Das Hinlegen verhindert Kreislaufprobleme, und der direkte Druck bremst die Blutung am schnellsten.',
      },
      {
        text: 'Er spült die Wunde gründlich mit Wasser aus und sprüht Desinfektionsmittel hinein.',
        fehler: true,
        erklaerung: 'Das kostet Zeit, während Blut verloren geht. Richtig: starke Blutungen nicht auswaschen, zuerst die Blutung stoppen und die Wunde keimfrei abdecken.',
      },
      {
        text: 'Er lässt die 112 anrufen und legt einen Druckverband an: Wundauflage, Druckpolster, Binde fest darüber.',
        fehler: false,
        erklaerung: 'Richtig. Das Polster drückt auf die Wunde und hält die Blutung zurück. Die Hände sind frei, und die 112 ist bereits unterwegs.',
      },
      {
        text: 'Durchblutet der Verband, nimmt er ihn ab und legt einen neuen an.',
        fehler: true,
        erklaerung: 'Beim Abnehmen reißt die Gerinnung auf, und die Blutung wird stärker. Richtig: einen zweiten Druckverband oder weiteres Polster darüber anlegen.',
      },
      {
        text: 'Er hält den Arm ruhig, deckt die Person zu, spricht beruhigend mit ihr und bleibt bei ihr.',
        fehler: false,
        erklaerung: 'Richtig. Wärme und Zuwendung helfen gegen Schock. Die Person nicht allein lassen, bis der Rettungsdienst da ist.',
      },
    ],
    merksatz: 'Erst Druck auf die Wunde, dann Druckverband. Nicht auswaschen, nicht abnehmen.',
  },
  {
    id: 'helfer-verbrennung',
    titel: 'Verbrennung versorgen',
    lage: 'In der Küche schüttet sich eine Frau kochend heißes Nudelwasser über den Unterarm. Die Haut ist stark gerötet, es bilden sich Blasen.',
    schritte: [
      {
        text: 'Er zieht ihr Schmuck und nasse, heiße Kleidung am Arm aus. Was an der Haut klebt, lässt er dort.',
        fehler: false,
        erklaerung: 'Richtig. Heißes Wasser in der Kleidung brennt weiter, und Schmuck schnürt bei Schwellung ein. Festgeklebtes würde die Haut mit abreißen.',
      },
      {
        text: 'Er kühlt den Arm etwa 10 Minuten unter fließendem, kühlem Leitungswasser.',
        fehler: false,
        erklaerung: 'Richtig. Kühlen lindert den Schmerz und begrenzt den Schaden in der Tiefe. Das Wasser soll lauwarm bis kühl sein, nicht eiskalt.',
      },
      {
        text: 'Er legt Eiswürfel direkt auf die verbrannte Haut, damit es schneller kühlt.',
        fehler: true,
        erklaerung: 'Eis kann die Haut zusätzlich schädigen, sie kühlt den Körper aus. Richtig: nur mit fließendem Wasser kühlen.',
      },
      {
        text: 'Er streicht Öl und Mehl auf die Wunde, weil das ein bewährtes Hausmittel sei.',
        fehler: true,
        erklaerung: 'Öl und Mehl halten die Hitze fest und sind nicht keimfrei. Richtig: nichts auftragen, auch keine Salben oder Puder.',
      },
      {
        text: 'Er sticht die Brandblasen mit einer Nadel auf, damit die Flüssigkeit ablaufen kann.',
        fehler: true,
        erklaerung: 'Eine geschlossene Blase schützt die Wunde vor Keimen. Richtig: Blasen nicht öffnen, die Stelle nur locker abdecken.',
      },
      {
        text: 'Er deckt die Wunde locker mit einem keimfreien Verbandtuch oder sauberen, nicht fusselnden Tuch ab.',
        fehler: false,
        erklaerung: 'Richtig. Die Abdeckung schützt vor Keimen. Sie darf nicht festkleben oder drücken.',
      },
      {
        text: 'Er sorgt für ärztliche Hilfe, bei Blasen, großer Fläche, Gesicht, Händen oder Kindern sofort per 112.',
        fehler: false,
        erklaerung: 'Richtig. Verbrennungen mit Blasen gehören in ärztliche Hände. Je größer die Fläche, desto gefährlicher ist die Verbrennung.',
      },
    ],
    merksatz: 'Kühlen mit Wasser, 10 Minuten. Kein Eis, kein Öl, keine Blasen aufstechen.',
  },
  {
    id: 'helfer-unfallstelle',
    titel: 'Unfallstelle absichern',
    lage: 'Auf einer Landstraße außerhalb des Ortes steht ein Auto nach einem Unfall im Straßengraben. Der Fahrer ist ansprechbar. Ein anderer Autofahrer hält an.',
    schritte: [
      {
        text: 'Er hält mit Abstand hinter der Unfallstelle am Fahrbahnrand an und schaltet den Warnblinker ein.',
        fehler: false,
        erklaerung: 'Richtig. Der Abstand schützt vor dem Auffahren, der Warnblinker macht andere Fahrer auf die Gefahr aufmerksam.',
      },
      {
        text: 'Er zieht die Warnweste an, bevor er aussteigt.',
        fehler: false,
        erklaerung: 'Richtig. Mit Warnweste wird man von anderen Autofahrern früher gesehen. Die Weste gehört zum Eigenschutz und liegt im Auto.',
      },
      {
        text: 'Er läuft mit dem Warndreieck mitten auf der Fahrbahn zurück, weil es so am schnellsten geht.',
        fehler: true,
        erklaerung: 'Auf der Fahrbahn droht Lebensgefahr durch fahrende Autos. Richtig: am Fahrbahnrand gehen, nach Möglichkeit hinter der Leitplanke.',
      },
      {
        text: 'Er stellt das Warndreieck direkt hinter dem Unfallauto auf, damit er schnell wieder beim Fahrer ist.',
        fehler: true,
        erklaerung: 'Dann bleibt anderen Fahrern keine Zeit zum Bremsen. Richtig: außerorts etwa 100 Meter, vor Kurven und Kuppen noch weiter entfernt aufstellen.',
      },
      {
        text: 'Er lässt die 112 anrufen und nennt den genauen Ort und die Zahl der Verletzten.',
        fehler: false,
        erklaerung: 'Richtig. Die Leitstelle schickt nach den Angaben passende Rettungsmittel und bei Bedarf auch Feuerwehr und Polizei.',
      },
      {
        text: 'Er lässt unverletzte Insassen neben dem Auto auf der Fahrbahn stehen, damit man sie gut sieht.',
        fehler: true,
        erklaerung: 'Dort sind sie dem Verkehr ausgesetzt. Richtig: Unverletzte hinter die Leitplanke oder auf einen sicheren Platz abseits der Straße bringen.',
      },
      {
        text: 'Er geht zum Fahrer, spricht ihn an, schaltet bei Bedarf die Zündung aus und bleibt bei ihm.',
        fehler: false,
        erklaerung: 'Richtig. Ist die Stelle gesichert, kümmert er sich um den Verletzten. Ein ausgeschalteter Motor beugt zusätzlichen Gefahren vor.',
      },
    ],
    merksatz: 'Erst an sich denken: Warnblinker, Weste, Warndreieck weit weg, nie auf der Fahrbahn gehen.',
  },
  {
    id: 'helfer-verschlucken',
    titel: 'Verschlucken und Atemnot',
    lage: 'Bei einer Feier verschluckt sich ein Mann an einem Bissen. Er hustet zuerst kräftig, später wird der Husten schwach, und er greift sich an den Hals.',
    schritte: [
      {
        text: 'Solange er kräftig hustet, ermutigt er ihn weiterzuhusten.',
        fehler: false,
        erklaerung: 'Richtig. Husten ist der stärkste Schutz. Solange er wirkt, greift man nicht ein, sondern bleibt bei der Person und beobachtet sie.',
      },
      {
        text: 'Er gibt ihm schnell etwas zu trinken, damit der Bissen hinunterrutscht.',
        fehler: true,
        erklaerung: 'Der Bissen sitzt in der Luftröhre, Flüssigkeit kann alles noch verschlimmern. Richtig: nichts zu trinken geben, weiter zum Husten ermutigen.',
      },
      {
        text: 'Wird der Husten schwach und die Atemnot schlimmer, lässt er die 112 rufen.',
        fehler: false,
        erklaerung: 'Richtig. Ist die Luftröhre fast oder ganz verlegt, kann die Person schnell ersticken. Der Rettungsdienst muss unterwegs sein.',
      },
      {
        text: 'Er beugt den Mann nach vorn und schlägt bis zu 5-mal kräftig mit der flachen Hand zwischen die Schulterblätter.',
        fehler: false,
        erklaerung: 'Richtig. Beim Vorbeugen kann sich der Fremdkörper lösen und nach vorn herausfallen. Die Schläge sind ein erlaubter erster Schritt.',
      },
      {
        text: 'Er greift ihm mit den Fingern tief in den Rachen, um den Bissen herauszuholen.',
        fehler: true,
        erklaerung: 'So wird der Bissen leicht noch tiefer geschoben. Richtig: nur sichtbare, lose Teile aus dem Mund nehmen.',
      },
      {
        text: 'Helfen die Schläge nicht, umfasst er ihn von hinten und drückt bis zu 5-mal ruckartig nach oben in den Oberbauch.',
        fehler: false,
        erklaerung: 'Richtig. Der Heimlich-Handgriff presst Luft aus der Lunge und kann den Fremdkörper hinausdrücken. Danach im Wechsel mit den Schlägen weitermachen.',
      },
      {
        text: 'Wird der Mann bewusstlos, legt er ihn in die Seitenlage und wartet auf den Rettungsdienst.',
        fehler: true,
        erklaerung: 'Ohne Atmung droht der Herzstillstand. Richtig: auf den Rücken legen und sofort mit der Wiederbelebung beginnen.',
      },
    ],
    merksatz: 'Husten lassen, dann 5 Schläge zwischen die Schulterblätter, dann Heimlich, im Wechsel.',
  },
  {
    id: 'helfer-krampfanfall',
    titel: 'Krampfanfall',
    lage: 'In einem Café stürzt eine Frau zu Boden. Sie zuckt am ganzen Körper und reagiert nicht. Niemand weiß, ob sie Epilepsie hat.',
    schritte: [
      {
        text: 'Er merkt sich die Uhrzeit und lässt die 112 anrufen.',
        fehler: false,
        erklaerung: 'Richtig. Bei einem unbekannten oder lange dauernden Anfall (über 5 Minuten) muss immer der Rettungsdienst kommen. Die Dauer ist wichtig für die Ärzte.',
      },
      {
        text: 'Er schiebt gefährliche Gegenstände weg und polstert den Kopf weich, zum Beispiel mit einer Jacke.',
        fehler: false,
        erklaerung: 'Richtig. So kann sie sich während des Anfalls nicht an Tischen, Stühlen oder dem harten Boden verletzen.',
      },
      {
        text: 'Er steckt ihr einen Löffel zwischen die Zähne, damit sie sich nicht auf die Zunge beißt.',
        fehler: true,
        erklaerung: 'Das kann Zähne oder Kiefer verletzen und die Atemwege versperren. Richtig: nie etwas in den Mund stecken, die Zunge verschluckt man nicht.',
      },
      {
        text: 'Er hält ihre Arme und Beine fest, damit das Zucken aufhört.',
        fehler: true,
        erklaerung: 'Festhalten stoppt den Anfall nicht und kann zu Knochen- oder Muskelverletzungen führen. Richtig: gewähren lassen und nur vor Verletzung schützen.',
      },
      {
        text: 'Er sorgt dafür, dass Schaulustige Abstand halten, und bleibt bei der Frau.',
        fehler: false,
        erklaerung: 'Richtig. Ruhe und Schutz der Privatsphäre helfen. Die Frau soll nach dem Anfall nicht angestarrt werden.',
      },
      {
        text: 'Ist der Anfall vorbei, prüft er die Atmung und legt sie bei Bewusstlosigkeit in die stabile Seitenlage.',
        fehler: false,
        erklaerung: 'Richtig. Nach dem Anfall sind viele Menschen noch tief benommen. In der Seitenlage bleiben die Atemwege frei.',
      },
      {
        text: 'Sobald sie die Augen öffnet, gibt er ihr schnell Wasser zu trinken.',
        fehler: true,
        erklaerung: 'Nach dem Anfall ist sie oft noch verwirrt und kann sich verschlucken. Richtig: ruhig mit ihr sprechen, abwarten und erst bei vollem Bewusstsein etwas anbieten.',
      },
    ],
    merksatz: 'Nichts in den Mund, nicht festhalten, Umgebung sichern, Zeit merken und 112.',
  },
  {
    id: 'helfer-herzinfarkt',
    titel: 'Herzinfarkt und Schlaganfall',
    lage: 'Ein älterer Mann klagt über starken Druck in der Brust, der in den linken Arm zieht. Er ist blass und schwitzt. Eine Passantin bleibt bei ihm stehen.',
    schritte: [
      {
        text: 'Sie erkennt die Warnzeichen: Druck in der Brust, Ausstrahlung in den Arm, blass, kalter Schweiß.',
        fehler: false,
        erklaerung: 'Richtig. Das sind typische Zeichen eines Herzinfarkts. Auch bei unklaren Beschwerden gilt: lieber einmal zu früh als zu spät alarmieren.',
      },
      {
        text: 'Sie rät dem Mann, erst einmal abzuwarten, ob es von allein wieder besser wird.',
        fehler: true,
        erklaerung: 'Beim Herzinfarkt stirbt mit jeder Minute Herzmuskel ab. Richtig: nicht abwarten, sofort 112 wählen.',
      },
      {
        text: 'Sie wählt die 112 und beschreibt die Beschwerden und den Ort.',
        fehler: false,
        erklaerung: 'Richtig. Nur der Rettungsdienst kann den Herzinfarkt behandeln und die Person schnell in ein passendes Krankenhaus bringen.',
      },
      {
        text: 'Sie legt den Mann flach auf den Rücken, damit er sich ausruhen kann.',
        fehler: true,
        erklaerung: 'Flach liegend ist das Atmen schwerer, und das Herz wird mehr belastet. Richtig: bequem mit erhöhtem Oberkörper sitzen oder halb sitzend lagern.',
      },
      {
        text: 'Sie bietet an, ihn selbst im Privatauto ins Krankenhaus zu fahren, das gehe schneller.',
        fehler: true,
        erklaerung: 'Im Auto kann das Herz stillstehen, und niemand kann helfen. Richtig: der Rettungsdienst bringt Notfallausrüstung mit und fährt in die richtige Klinik.',
      },
      {
        text: 'Sie öffnet enge Kleidung, beruhigt ihn und bleibt die ganze Zeit bei ihm.',
        fehler: false,
        erklaerung: 'Richtig. Ruhe entlastet das Herz. Die Person sollte sich nicht anstrengen und nicht allein bleiben.',
      },
      {
        text: 'Sie merkt sich, wann die Beschwerden begonnen haben, und sagt es dem Rettungsdienst.',
        fehler: false,
        erklaerung: 'Richtig. Der Beginn entscheidet über die Behandlung, auch bei einem Schlaganfall mit hängendem Mundwinkel, Armschwäche oder verwaschener Sprache.',
      },
      {
        text: 'Sackt er zusammen und atmet nicht mehr normal, beginnt sie sofort mit der Herzdruckmassage.',
        fehler: false,
        erklaerung: 'Richtig. Ein Herzinfarkt kann in einen Herzstillstand übergehen. Dann zählt jede Sekunde, und man drückt sofort fest auf die Brustmitte.',
      },
    ],
    merksatz: 'Brustdruck oder Schlaganfallzeichen: sofort 112, nicht abwarten, nicht selbst fahren.',
  },
];
