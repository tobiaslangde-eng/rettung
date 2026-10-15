import { ZuerstFrage } from './helferTraining';

export const HANDGRIFFE: ZuerstFrage[] = [
  // ---------- Lagerung / Seitenlage ----------
  {
    id: 'g-seitenlage-arm',
    lage: 'Du kniest neben einer bewusstlosen Frau, die normal atmet, und beginnst die stabile Seitenlage. Zuerst legst du den Arm, der dir zugewandt ist.',
    optionen: [
      'Im rechten Winkel nach oben legen, Handfläche nach oben',
      'Eng am Körper anliegen lassen und die Hand unter den Oberschenkel schieben, damit er nicht stört',
      'Über den Kopf strecken, Handfläche zeigt nach unten',
      'Auf die Brust legen und mit dem anderen Arm verschränken',
    ],
    erklaerung: 'Der nahe Arm liegt angewinkelt nach oben, die Handfläche zeigt nach oben. Später stützt er den Körper und der Mensch rollt nicht zurück.',
  },
  {
    id: 'g-seitenlage-knie',
    lage: 'Bei der stabilen Seitenlage hast du den nahen Arm abgewinkelt und die Hand des fernen Arms an die Wange der Person gelegt. Jetzt kommt das Bein.',
    optionen: [
      'Das ferne Knie anwinkeln und sie daran zu dir ziehen',
      'Das nahe Bein strecken und die Person an der Hüfte herumdrehen',
      'Beide Beine gleichzeitig anwinkeln und die Person ruckartig nach vorn kippen',
      'Das ferne Bein gestreckt lassen und an der Schulter ziehen',
    ],
    erklaerung: 'Du greifst das ferne Knie, winkelst es an und ziehst die Person über das Knie zu dir. Das angewinkelte Bein hält sie danach stabil auf der Seite.',
  },
  {
    id: 'g-seitenlage-kopf',
    lage: 'Der Mann liegt schon auf der Seite und atmet normal. Zum Schluss der stabilen Seitenlage kümmerst du dich um Kopf und Mund.',
    optionen: [
      'Kopf leicht überstrecken, Mund zeigt zum Boden, Hand bleibt unter der Wange',
      'Kinn auf die Brust legen, den Mund geschlossen halten und den Kopf gerade ausrichten',
      'Gesicht zur Decke drehen und die Hand unter der Wange wegnehmen',
      'Ein Kissen unter den Kopf schieben, damit er höher liegt',
    ],
    erklaerung: 'Der überstreckte Kopf hält die Atemwege frei. Der Mund liegt am tiefsten, damit Erbrochenes ablaufen kann. Die Hand unter der Wange sichert die Lage.',
  },
  {
    id: 'g-schocklage-ohnmacht',
    lage: 'Im Zug wird einem Jungen schwindelig, er sinkt kurz weg und ist wieder ansprechbar. Er ist blass, atmet normal und hat sich nicht verletzt.',
    optionen: [
      'Flach hinlegen und die Beine hochlagern',
      'Sofort aufstehen lassen und an die frische Luft schicken, dort erholt sie sich schneller',
      'In die stabile Seitenlage legen, obwohl er wach und ansprechbar ist',
      'Mit dem Oberkörper hochgelagert an die Wand lehnen',
    ],
    erklaerung: 'Bei Kreislaufschwäche ohne Verletzung legst du die Person flach und hebst die Beine an. So fließt mehr Blut zu Herz und Gehirn. Dann beruhigen und beobachten.',
  },
  {
    id: 'g-atemnot-lagerung',
    lage: 'Eine ältere Nachbarin sitzt keuchend am Küchentisch und bekommt schlecht Luft. Sie ist wach und kann kaum sprechen.',
    optionen: [
      'Oberkörper hoch, Fenster auf, Enges lockern, 112',
      'Sie flach auf den Rücken legen, damit sie sich in Ruhe ausruhen kann',
      'Sie auf den Bauch drehen, damit sie besser durchatmen kann',
      'Ihre Beine hochlagern und sie warm zudecken',
    ],
    erklaerung: 'Bei Atemnot hilft eine aufrechte Haltung, weil die Atemmuskeln dann freier arbeiten. Sorge für Luft, löse Enges und rufe 112.',
  },
  {
    id: 'g-bauchschmerz-lagerung',
    lage: 'Ein Mädchen krümmt sich mit starken Bauchschmerzen auf dem Schulhof. Sie ist wach, ihr Bauch fühlt sich hart und gespannt an.',
    optionen: [
      'Rückenlage mit angewinkelten Beinen und Knierolle, nichts essen oder trinken',
      'In Bauchlage legen, damit der Bauch entlastet wird',
      'Flach mit gestreckten Beinen lagern und etwas zu trinken geben',
      'Beine hochlegen und einen warmen Wärmebeutel auf den Bauch legen, damit es sich löst',
    ],
    erklaerung: 'Angewinkelte Beine entspannen die Bauchdecke, eine Knierolle hilft. Nichts essen oder trinken lassen, falls eine Operation nötig wird. 112 rufen, beruhigen.',
  },
  {
    id: 'g-kopfverletzung-lagerung',
    lage: 'Eine Fußballspielerin ist mit einer Gegnerin zusammengestoßen. Sie ist wach, hat starke Kopfschmerzen, und ihr ist übel.',
    optionen: [
      'Oberkörper leicht erhöht, beobachten, 112',
      'Flach hinlegen und die Beine hochlagern',
      'Aufstehen und weiterspielen lassen, damit der Kreislauf wieder in Schwung kommt',
      'Mit dem Kopf tief lagern, damit das Gehirn mehr Blut bekommt',
    ],
    erklaerung: 'Bei Kopfverletzung mit klarem Bewusstsein wird der Oberkörper leicht erhöht gelagert. Beobachte sie, rufe 112. Wird sie bewusstlos: Atmung prüfen, Seitenlage.',
  },
  {
    id: 'g-seitenlage-erbrechen',
    lage: 'Ein bewusstloser Mann liegt in stabiler Seitenlage und erbricht plötzlich. Der Notruf ist abgesetzt, du bist noch allein bei ihm.',
    optionen: [
      'In der Seitenlage lassen, ablaufen lassen, Atmung weiter prüfen',
      'Auf den Rücken drehen und den Mund gründlich mit einem Tuch auswischen',
      'Aufsetzen, damit nichts in die Lunge läuft',
      'Den Kopf anheben und festhalten, bis es aufhört',
    ],
    erklaerung: 'Die Seitenlage verhindert, dass Erbrochenes in die Atemwege gelangt. Lass es ablaufen und kontrolliere weiter regelmäßig die Atmung.',
  },

  // ---------- Blutung / Druckverband / Wunden ----------
  {
    id: 'g-druckverband-aufbau',
    lage: 'Am Unterschenkel eines Gartenarbeiters klafft eine stark blutende Wunde. Du hast Verbandmaterial in der Hand. Wie baust du den Druckverband auf?',
    optionen: [
      'Wundauflage auf die Wunde, Druckpolster darauf, dann fest umwickeln',
      'Binde locker um das Bein wickeln und das Polster daneben legen',
      'Binde oberhalb der Wunde fest abschnüren und die Wunde offen lassen',
      'Mehrere Pflaster überlappend aufkleben und auf Druck verzichten',
    ],
    erklaerung: 'Erst die keimfreie Wundauflage, darauf das Druckpolster als Gegendruck, dann die Binde straff darüber. Das Polster liegt genau auf der Wunde und drückt die Gefäße zu.',
  },
  {
    id: 'g-nasenbluten',
    lage: 'Eine Kollegin bekommt plötzlich Nasenbluten, ohne sich gestoßen zu haben. Sie ist wach und sitzt am Schreibtisch.',
    optionen: [
      'Kopf leicht nach vorn, Nasenflügel zudrücken',
      'Kopf weit in den Nacken legen und die Nase hochziehen',
      'Flach auf den Rücken legen und die Nase gar nicht berühren',
      'Kräftig schnäuzen, damit das Blut gut abläuft',
    ],
    erklaerung: 'Der Kopf geht nach vorn, damit kein Blut verschluckt wird. Etwa zehn Minuten die Nasenflügel zudrücken, ein kalter Nacken hilft. Steht es nicht: Arzt oder 112.',
  },
  {
    id: 'g-ohne-handschuhe',
    lage: 'Ein Radfahrer blutet stark am Arm. In deinem Auto sind keine Einmalhandschuhe, nur Verbandstoff und ein sauberer Gefrierbeutel.',
    optionen: [
      'Tuch oder Beutel als Barriere, trotzdem abdrücken',
      'Warten, bis jemand Handschuhe aus der Apotheke bringt',
      'Nur den Notruf wählen und die Wunde keinesfalls berühren',
      'Ein Pflaster aufkleben, damit du kein Blut anfasst',
    ],
    erklaerung: 'Eine starke Blutung darf nie ungestillt bleiben. Nutze eine Barriere wie Gefrierbeutel, Tuch oder Verbandstoff, drücke ab und wasche danach gründlich die Hände.',
  },
  {
    id: 'g-amputation-teil',
    lage: 'Einem Schreiner wurde an der Kreissäge ein Finger abgetrennt. Die Blutung ist verbunden, der Notruf ist raus. Der abgetrennte Finger liegt noch am Boden.',
    optionen: [
      'Keimfrei einwickeln, in Beutel legen, diesen in Eiswasser stecken',
      'Den Finger direkt auf Eiswürfel legen',
      'Den Finger in Alkohol oder Desinfektionsmittel legen, damit er sicher keimfrei bleibt',
      'Den Finger abspülen und sofort an den Stumpf zurückdrücken',
    ],
    erklaerung: 'Das Teil kommt trocken in eine Kompresse und einen Beutel, der indirekt gekühlt wird. Nie direkt auf Eis, nie in Flüssigkeit. Gib es dem Rettungsdienst mit.',
  },
  {
    id: 'g-platzwunde-kopf',
    lage: 'Ein Kind ist auf dem Spielplatz mit der Stirn gegen die Schaukel geprallt. Die Platzwunde blutet stark. Es ist wach und weint.',
    optionen: [
      'Sterile Auflage andrücken, mit Binde fixieren, ärztlich abklären',
      'Die Wunde unter fließendem Wasser auswaschen, bis die Blutung aufhört',
      'Kopf nach hinten legen und ein Kühlpack ohne Tuch direkt auf die Wunde legen',
      'Ein Pflaster quer über die Wunde kleben und abwarten',
    ],
    erklaerung: 'Kopfwunden bluten stark, sind aber oft harmlos. Drücke mit steriler Auflage, verbinde und beruhige das Kind. Wegen der Kopfverletzung gehört ein Arzt darauf.',
  },
  {
    id: 'g-bisswunde',
    lage: 'Beim Spaziergang beißt ein Hund einem Jogger in den Unterarm. Die Wunde blutet leicht, die Haut ist zerkratzt, Zahnspuren sind zu sehen.',
    optionen: [
      'Keimfrei abdecken, ärztlich versorgen lassen, Tetanus klären',
      'Mit Wasserstoffperoxid und Seife gründlich ausschrubben',
      'Offen lassen, damit sie an der frischen Luft gut trocknet und verschorft',
      'Eine Salbe auftragen und eine Woche abwarten',
    ],
    erklaerung: 'Bisswunden sind stark verschmutzt und entzünden sich leicht. Du deckst sie keimfrei ab und lässt sie ärztlich versorgen. Auch den Tetanusschutz prüfen lassen.',
  },
  {
    id: 'g-wundauflage-watte',
    lage: 'Ein Junge hat sich beim Fußball den Ellenbogen großflächig aufgeschürft. Im Verbandkasten liegen Watte, sterile Kompressen, Pflaster und Mullbinden.',
    optionen: [
      'Sterile Kompresse auflegen und mit Binde oder Pflaster fixieren',
      'Watte direkt auf die Wunde legen und mit Pflaster sichern',
      'Offen lassen und mit einem Taschentuch trocken tupfen',
      'Mullbinde ohne Auflage direkt auf die Wunde wickeln',
    ],
    erklaerung: 'Auf die Wunde gehört eine keimfreie, nicht fusselnde Wundauflage. Watte fasert aus und verklebt mit der Wunde. Binde oder Pflaster halten nur die Auflage.',
  },
  {
    id: 'g-druckverband-danach',
    lage: 'Der Druckverband am Unterarm sitzt, die Blutung steht. Der Verletzte steht aber blass und wackelig da und wirkt unsicher.',
    optionen: [
      'Hinsetzen oder hinlegen, zudecken, Verband beobachten, 112',
      'Den Verband wieder abnehmen, um die Wunde genau zu kontrollieren',
      'Etwas Süßes zu trinken geben, damit der Kreislauf wieder stabil wird',
      'Ihn herumlaufen lassen, damit der Kreislauf in Schwung kommt',
    ],
    erklaerung: 'Nach starkem Blutverlust droht ein Schock. Lass ihn liegen oder sitzen, halte ihn warm, beobachte den Verband und rufe 112. Den Verband nicht öffnen.',
  },
  {
    id: 'g-kleidung-freilegen',
    lage: 'Ein Bauarbeiter hat sich den Oberschenkel an einem Blech aufgerissen. Blut durchtränkt die Hose, die Wunde selbst siehst du nicht.',
    optionen: [
      'Hose aufschneiden oder herunterziehen, bis die Wunde frei liegt, dann abdrücken',
      'Hose anlassen und den Druckverband einfach über den Stoff wickeln, das spart Zeit',
      'Warten, bis der Rettungsdienst die Hose aufschneidet',
      'Nur ein Pflaster auf den Stoff kleben',
    ],
    erklaerung: 'Nur an der freigelegten Wunde kannst du gezielt Druck ausüben und sehen, woher es blutet. Schneide die Kleidung auf, wenn sie sich nicht abstreifen lässt.',
  },
  {
    id: 'g-halsblutung',
    lage: 'Eine Frau hat sich beim Spülen an zerbrochenem Glas seitlich am Hals verletzt. Es blutet stark. Sie ist wach und hat Angst.',
    optionen: [
      'Direkt auf die Wunde drücken und 112 rufen',
      'Ein Tuch fest um den Hals wickeln und gut verknoten',
      'Den Hals mit einer Binde mehrfach straff umwickeln und fixieren',
      'Den Kopf nach hinten legen, damit es weniger blutet',
    ],
    erklaerung: 'Am Hals drückst du nur punktuell auf die Wunde. Ein Verband rund um den Hals kann die Atmung abschnüren. Sofort 112 rufen.',
  },

  // ---------- Verbände / Ruhigstellen / Knochenbrüche ----------
  {
    id: 'g-armtragetuch',
    lage: 'Nach einem Sturz hält sich eine Jugendliche den Unterarm. Er ist nicht verformt, aber geschwollen und kaum zu bewegen. Du hast ein Dreiecktuch.',
    optionen: [
      'Arm in der Schonhaltung im Armtragetuch ruhigstellen',
      'Arm gerade ziehen und mit dem Dreiecktuch am Körper festbinden',
      'Den Arm mehrmals durchbewegen, um einen Bruch auszuschließen',
      'Das Dreiecktuch fest um die schmerzende Stelle knoten, damit nichts wackelt',
    ],
    erklaerung: 'Verletzte Gliedmaßen werden in der Haltung ruhiggestellt, die der Verletzte als angenehm empfindet. Ein Armtragetuch entlastet den Arm, ohne ihn zu bewegen.',
  },
  {
    id: 'g-umgeknickt',
    lage: 'Beim Wandern knickt ein Mann um. Sein Knöchel schwillt an und schmerzt stark. Er sitzt auf einem Stein, ein Kühlpack ist im Rucksack.',
    optionen: [
      'Ruhigstellen, Kühlpack im Tuch, Bein hoch',
      'Weiterlaufen lassen, damit er nicht einsteift und steif wird',
      'Den Knöchel kräftig massieren und durchbewegen',
      'Eine Wärmflasche anlegen, damit es besser durchblutet wird',
    ],
    erklaerung: 'Ruhe, Kühlen und Hochlagern begrenzen Schwellung und Schmerz. Das Kühlpack nie direkt auf die Haut legen, ein Tuch schützt vor Kälteschäden.',
  },
  {
    id: 'g-offener-bruch',
    lage: 'Nach einem Sturz vom Fahrrad ragt am Unterschenkel eines Mannes ein Knochenstück durch die Haut. Er ist wach, die Blutung ist mäßig.',
    optionen: [
      'Wunde keimfrei abdecken, polstern, Bein ruhig lassen, 112',
      'Den Knochen vorsichtig zurückschieben und danach die Wunde verbinden',
      'Das Bein gerade ziehen und mit einem Ast schienen',
      'Die Wunde mit Wasser abspülen und offen lassen',
    ],
    erklaerung: 'Bei einem offenen Bruch deckst du die Wunde keimfrei ab und polsterst rundherum. Der Knochen wird nie zurückgeschoben, das Bein nicht gerichtet. Notruf 112.',
  },
  {
    id: 'g-oberschenkel-bruch',
    lage: 'Eine Skifahrerin liegt mit stark schmerzendem Oberschenkel im Schnee. Das Bein steht verdreht ab, sie kann es nicht heben und friert.',
    optionen: [
      'Bein in der Fehlstellung lassen, polstern, zudecken, 112',
      'Das Bein vorsichtig gerade ziehen, damit es wieder besser durchblutet wird',
      'Sie aufrichten und gestützt zur Hütte führen',
      'Das Bein kräftig massieren, um die Schmerzen zu lindern',
    ],
    erklaerung: 'Verformte Gliedmaßen werden nie gerade gezogen. Polstere in der vorgefundenen Lage, schütze vor Kälte, rufe 112 und beruhige. Achte auf Schockzeichen.',
  },
  {
    id: 'g-schulter-ausgekugelt',
    lage: 'Beim Handball fällt ein Spieler auf die Schulter und hält den Arm vom Körper weg. Die Schulter wirkt eckig, jede Bewegung tut weh.',
    optionen: [
      'Arm in der Schonhaltung abpolstern, 112 rufen',
      'Den Arm kräftig nach unten ziehen und so wieder einrenken',
      'Den Arm eng an den Körper pressen und fest umwickeln',
      'Den Spieler den Arm langsam kreisen lassen, bis es lockerer wird',
    ],
    erklaerung: 'Ausgekugelte Gelenke renkt nur ein Arzt ein. Du stützt den Arm in der schmerzärmsten Haltung mit Polstern ab und lässt den Spieler nicht bewegen.',
  },
  {
    id: 'g-mullbinde-wickeln',
    lage: 'Du willst am Unterarm eines Kindes eine Mullbinde als Verband anlegen. Die Wundauflage liegt schon.',
    optionen: [
      'Von der Hand zum Körper wickeln, Bahnen überlappen',
      'Von der Schulter zur Hand wickeln, die Bahnen mit etwas Abstand',
      'Möglichst straff und eng wickeln, damit der Verband nicht verrutscht',
      'Die Binde nur einmal lose herumlegen und das Ende abschneiden',
    ],
    erklaerung: 'Wickle vom körperfernen zum körpernahen Teil und überlappe die Bahnen. Der Verband soll halten, aber nicht abschnüren.',
  },
  {
    id: 'g-verband-zu-fest',
    lage: 'Du hast einem Mann einen Verband am Unterarm angelegt. Nach ein paar Minuten sind seine Finger blass, kalt und kribbeln.',
    optionen: [
      'Verband lösen und etwas lockerer neu anlegen',
      'Den Verband noch fester ziehen, damit er hält',
      'Das Kribbeln abwarten, es gehört zur Verletzung',
      'Die Hand mit einem Kühlpack auf dem Verband kühlen',
    ],
    erklaerung: 'Blasse, kalte oder kribbelnde Finger zeigen, dass der Verband die Durchblutung abschnürt. Löse ihn sofort und lege ihn lockerer neu an.',
  },

  // ---------- Verbrennung / Verätzung / Hitze / Kälte ----------
  {
    id: 'g-verbruehung-kleidung',
    lage: 'Ein Kind hat sich heißen Tee über den Arm gekippt. Der Ärmel ist durchtränkt, das Kind schreit vor Schmerz.',
    optionen: [
      'Ärmel sofort ausziehen oder aufschneiden, dann mit handwarmem Wasser kühlen',
      'Ärmel anlassen, damit die Haut geschützt bleibt, und gleich abtrocknen',
      'Ärmel anlassen und Mehl oder Salbe auf den Stoff geben',
      'Warten, bis der Ärmel von selbst trocknet',
    ],
    erklaerung: 'Heiße Flüssigkeit hält in der Kleidung die Hitze. Entferne nasse Kleidung sofort, aber reiße nichts ab, was festklebt. Danach mit handwarmem Wasser kühlen.',
  },
  {
    id: 'g-veraetzung-haut',
    lage: 'In der Werkstatt spritzt Rohrreiniger auf den Unterarm eines Kollegen. Die Haut brennt und rötet sich.',
    optionen: [
      'Kleidung entfernen, Haut mindestens 10 Minuten mit Wasser spülen, 112 rufen',
      'Die Haut mit Essig oder Zitronensaft neutralisieren, bevor du sie spülst',
      'Mit einem Handtuch kräftig trocken reiben',
      'Eine Salbe auftragen und die Haut abdecken',
    ],
    erklaerung: 'Chemikalien verdünnst du mit viel Wasser. Nichts neutralisieren, das kann zusätzliche Reaktionen auslösen. Verschmutzte Kleidung ausziehen, dabei Eigenschutz beachten.',
  },
  {
    id: 'g-sonnenstich',
    lage: 'Bei einer Wanderung in der Mittagshitze hat ein Kind einen hochroten Kopf, Kopfschmerzen und ist müde. Ein Schattenplatz liegt in der Nähe.',
    optionen: [
      'In den Schatten bringen, Oberkörper hochlagern, Kopf und Nacken kühlen',
      'In der Sonne flach hinlegen und zudecken',
      'Eiskaltes Wasser über den Kopf schütten',
      'Sonnencreme nachlegen, eine Mütze aufsetzen und langsam weiterlaufen lassen',
    ],
    erklaerung: 'Bei Überhitzung: Schatten, Oberkörper erhöht, Kopf und Nacken mit feuchten Tüchern kühlen, kleine Schlucke geben, wenn es wach ist. Verschlechterung: 112.',
  },
  {
    id: 'g-unterkuehlung',
    lage: 'Ein Wanderer wird im Regen und Wind apathisch. Er zittert, seine Kleidung ist nass. Er ist ansprechbar.',
    optionen: [
      'Nasse Kleidung ersetzen, einhüllen, vor Wind schützen, 112 rufen',
      'Ihn kräftig abreiben und zum Weitergehen antreiben',
      'Ihm Schnaps zum Aufwärmen geben',
      'Ihn sofort in ein sehr heißes Bad stecken',
    ],
    erklaerung: 'Unterkühlte wärmst du langsam und schonend von außen, geschützt vor Wind und Nässe. Rubbeln, Alkohol und heiße Bäder belasten den Kreislauf.',
  },
  {
    id: 'g-erfrierung',
    lage: 'Nach einer Skitour hat eine Frau weiße, gefühllose Finger. Sie ist gerade in einer Berghütte angekommen, es ist warm.',
    optionen: [
      'Enge Handschuhe und Ringe abnehmen, Hand locker polstern und langsam erwärmen',
      'Die Finger kräftig mit Schnee abreiben, damit das Gefühl zurückkehrt',
      'Die Hand sofort in sehr heißes Wasser tauchen',
      'Die Finger direkt an eine Heizung halten',
    ],
    erklaerung: 'Erfrorene Körperteile wärmst du langsam und polsterst sie. Reiben, Schnee oder heiße Wärmequellen verletzen das empfindliche Gewebe. Danach zum Arzt.',
  },
  {
    id: 'g-brand-ring',
    lage: 'Eine Köchin hat sich die Hand an einem heißen Topf verbrannt und kühlt sie unter Wasser. Sie trägt mehrere Ringe, die Finger schwellen an.',
    optionen: [
      'Ringe sofort vorsichtig abziehen, bevor die Schwellung zunimmt',
      'Ringe dranlassen, sie schützen die Haut',
      'Ringe mit Butter einreiben und erst später abziehen',
      'Die Finger fest abbinden, damit sie nicht weiter anschwellen',
    ],
    erklaerung: 'Verbrannte Haut schwillt an. Ringe und Schmuck müssen davor ab, sonst schnüren sie ein. Was an der Haut festklebt, lässt du dran.',
  },
  {
    id: 'g-brandwunde-abdecken',
    lage: 'Du hast eine Verbrühung am Oberschenkel eines Mannes lange genug mit handwarmem Wasser gekühlt. Die Haut ist gerötet, mit einigen Blasen.',
    optionen: [
      'Keimfrei und locker abdecken, am besten mit Brandwundenauflage',
      'Blasen aufstechen und mit Pflaster abkleben',
      'Mit Brandsalbe oder Puder dick einreiben und offen an der Luft lassen',
      'Mit Watte abdecken und eng wickeln',
    ],
    erklaerung: 'Brandwunden deckst du keimfrei, locker und nicht klebend ab, etwa mit einer Brandwundenauflage oder einem sauberen Tuch. Blasen bleiben geschlossen.',
  },

  // ---------- Wiederbelebung / AED ----------
  {
    id: 'g-hlw-druckpunkt',
    lage: 'Ein Mann liegt reglos im Park und atmet nicht normal. Der Notruf läuft. Du kniest neben ihm und willst mit der Herzdruckmassage beginnen.',
    optionen: [
      'Handballen auf die Mitte der Brust, untere Hälfte des Brustbeins',
      'Links neben das Brustbein genau auf die Herzseite, wo man den Herzschlag spürt',
      'Auf den Oberbauch unter dem Brustbein',
      'Oben auf die Brust direkt unter das Schlüsselbein',
    ],
    erklaerung: 'Der Druckpunkt liegt in der Mitte des Brustkorbs auf dem unteren Brustbein. Handballen aufsetzen, zweite Hand darüber, Arme gestreckt, senkrecht über der Brust.',
  },
  {
    id: 'g-hlw-tiefe',
    lage: 'Du drückst bei einer bewusstlosen Frau mit Herzstillstand. Ein Passant fragt, wie fest und wie schnell du drücken sollst.',
    optionen: [
      'Etwa 5 bis 6 cm tief, 100 bis 120 Mal pro Minute, Brustkorb entlasten',
      'Nur 2 bis 3 cm tief und eher sanft, damit keine Rippen brechen',
      'So kräftig wie möglich, mehr als 140 Mal pro Minute',
      'Etwa 5 cm tief, aber nur 40 bis 60 Mal pro Minute',
    ],
    erklaerung: 'Drücke 5 bis 6 cm tief, 100 bis 120 Mal pro Minute, und lass den Brustkorb nach jedem Druck ganz zurückkommen. Rippenbrüche sind möglich, aber nicht das Schlimmste.',
  },
  {
    id: 'g-hlw-wechsel',
    lage: 'Du reanimierst seit etwa zwei Minuten und wirst müde. Eine zweite Person ist bereit, die Herzdruckmassage zu übernehmen.',
    optionen: [
      'Etwa alle 2 Minuten wechseln, mit möglichst kurzer Unterbrechung',
      'Nach jeder Minute eine längere Pause einlegen, damit sich beide erholen',
      'Allein weiterdrücken, bis du erschöpft bist',
      'Nach jeweils 30 Druckstößen tauschen und kurz stoppen',
    ],
    erklaerung: 'Nach etwa zwei Minuten lässt die Qualität der Herzdruckmassage nach. Wechselt zügig, ohne lange Pause, zum Beispiel wenn der AED analysiert.',
  },
  {
    id: 'g-beatmung-technik',
    lage: 'Du hast gelernt, im Wechsel 30 Mal zu drücken und 2 Mal zu beatmen. Nach 30 Druckstößen willst du einen Erwachsenen Mund zu Mund beatmen.',
    optionen: [
      'Kopf überstrecken, Nase zuhalten, etwa 1 Sekunde pusten, bis sich die Brust hebt',
      'Kopf nach vorn beugen, Nase offen lassen und so kräftig wie möglich pusten',
      'Nase offen lassen und schnell mehrmals hintereinander pusten',
      'Eine volle Minute lang gleichmäßig weiterblasen',
    ],
    erklaerung: 'Pro Beatmung hebt sich kurz der Brustkorb, nicht zu lang und nicht zu kräftig. Halte die Unterbrechung der Herzdruckmassage kurz, höchstens 10 Sekunden.',
  },
  {
    id: 'g-aed-nasse-brust',
    lage: 'Ein Mann ist am Badesee zusammengebrochen. Seine Brust ist nass. Du hast den AED eingeschaltet und willst die Elektroden aufkleben.',
    optionen: [
      'Brust mit einem Tuch trocken wischen, dann Elektroden fest aufkleben',
      'Elektroden auf die nasse Haut kleben, Wasser stört nicht',
      'Die Elektroden auf Arm und Oberschenkel kleben, dort ist es trocken',
      'Elektroden auf einem Handtuch liegend aufkleben',
    ],
    erklaerung: 'Auf nasser Haut halten die Elektroden schlecht, und der Strom kann abgeleitet werden. Trockne die Brust ab, bei starker Behaarung rasieren, dann fest aufkleben.',
  },
  {
    id: 'g-aed-nach-schock',
    lage: 'Der AED hat gerade einen Schock ausgelöst und schweigt nun. Der Mann liegt reglos da und atmet nicht normal.',
    optionen: [
      'Sofort weiter Herzdruckmassage, bis das Gerät erneut analysiert',
      'Abwarten, ob er von selbst wieder anfängt zu atmen',
      'Elektroden abziehen, weil der Schock vorbei ist',
      'Zwei Minuten lang seine Atmung beobachten, bevor du weiterdrückst',
    ],
    erklaerung: 'Direkt nach dem Schock drückst du sofort weiter. Der AED analysiert nach etwa zwei Minuten erneut. Die Elektroden bleiben kleben, bis der Rettungsdienst übernimmt.',
  },

  // ---------- Kinder / Säuglinge ----------
  {
    id: 'g-saeugling-druck',
    lage: 'Ein Säugling liegt reglos auf dem Wickeltisch und atmet nicht. Die Eltern rufen 112. Du beginnst mit der Herzdruckmassage.',
    optionen: [
      'Mit zwei Fingern auf die Brustmitte, etwa ein Drittel der Brusttiefe eindrücken',
      'Mit beiden Handballen und dem ganzen Körpergewicht wie bei Erwachsenen',
      'Mit der Faust kräftig auf den Brustkorb schlagen',
      'Nur leicht streicheln und wiegen, damit nichts verletzt wird',
    ],
    erklaerung: 'Beim Säugling drückst du mit zwei Fingern in die Mitte der Brust, etwa ein Drittel der Brusttiefe (rund 4 cm), 100 bis 120 Mal pro Minute.',
  },
  {
    id: 'g-kind-druck',
    lage: 'Ein sechsjähriges Kind kollabiert beim Spielen im Garten, reagiert nicht und atmet nicht normal. Jemand ruft 112, du beginnst zu drücken.',
    optionen: [
      'Mit einem Handballen auf die Brustmitte, etwa ein Drittel der Tiefe drücken',
      'Mit beiden Händen und vollem Körpergewicht wie bei Erwachsenen',
      'Mit zwei Fingern ganz vorsichtig und flach, nur etwa 1 cm',
      'Das Kind aufsetzen und von hinten drücken',
    ],
    erklaerung: 'Bei Kindern genügt meist ein Handballen auf der Brustmitte. Drücke etwa ein Drittel der Brusttiefe, rund 5 cm, 100 bis 120 Mal pro Minute.',
  },
  {
    id: 'g-saeugling-kopfhaltung',
    lage: 'Du hast gelernt, einen Säugling zu beatmen. Er liegt reglos auf dem Rücken und atmet nicht. Wie hältst du den Kopf für die Beatmung?',
    optionen: [
      'In Neutralstellung halten, nicht überstrecken, Mund und Nase umschließen',
      'Weit nach hinten überstrecken, genauso wie bei Erwachsenen',
      'Zur Seite drehen und nur den Mund bedecken',
      'Mit einem dicken Kissen hochlagern',
    ],
    erklaerung: 'Der Hals eines Säuglings ist weich. Überstreckt knickt die Luftröhre leicht ab. Halte den Kopf in Neutralstellung und umschließe Mund und Nase mit deinem Mund.',
  },
  {
    id: 'g-fieberkrampf',
    lage: 'Ein Kleinkind hat Fieber und beginnt plötzlich, am ganzen Körper zu zucken. Es liegt auf dem Teppich, die Mutter ist verzweifelt.',
    optionen: [
      'Umgebung sichern, nichts in den Mund, nicht festhalten, 112 rufen',
      'Das Kind in kaltes Wasser setzen, um das Fieber zu senken',
      'Einen Löffel zwischen die Zähne schieben',
      'Das Kind fest umarmen, bis das Zucken aufhört',
    ],
    erklaerung: 'Wie bei jedem Krampfanfall: schützen, nichts in den Mund, nicht festhalten. Danach Seitenlage und beruhigen. Beim ersten Fieberkrampf immer 112 rufen.',
  },
  {
    id: 'g-kind-heisses-auto',
    lage: 'An einem Sommertag entdeckst du auf dem Parkplatz ein Kleinkind allein im aufgeheizten Auto. Es ist schlapp und kaum ansprechbar.',
    optionen: [
      '112 rufen, Kind aus dem Auto holen, in den Schatten legen, mit feuchten Tüchern kühlen',
      'Auf den Besitzer warten und das Kind durch die Scheibe weiter beobachten, bis er kommt',
      'Das Fenster einen Spalt öffnen und Wasser hineinreichen',
      'Das Kind mit Eiswasser abschrecken',
    ],
    erklaerung: 'Im aufgeheizten Auto droht ein lebensgefährlicher Hitzschlag. Rufe 112, hole das Kind heraus, notfalls ist das Einschlagen der Scheibe gerechtfertigt, und kühle schonend.',
  },
  {
    id: 'g-kind-krupp',
    lage: 'Nachts wacht ein Kleinkind mit bellendem Husten und pfeifender Atmung auf. Es hat Angst und ringt nach Luft. Die Eltern sind überfordert.',
    optionen: [
      'Ruhig bleiben, Kind aufrecht auf den Arm nehmen, frische Luft, 112 rufen',
      'Das Kind flach ins Bett legen und die Tür schließen',
      'Warmes Wasser trinken lassen, gut zudecken und im Bett liegen lassen',
      'Einen Hustensaft der Eltern geben',
    ],
    erklaerung: 'Unruhe verstärkt die Atemnot. Beruhige das Kind, nimm es aufrecht auf den Arm, sorge für frische Luft und rufe 112. Keine Medikamente geben.',
  },

  // ---------- Helm / Rettungsgriff / Unfallstelle ----------
  {
    id: 'g-helm-ablauf',
    lage: 'Ein bewusstloser Motorradfahrer mit Helm atmet nicht normal. Du bist zu zweit und willst den Helm abnehmen. Wie gehst du vor?',
    optionen: [
      'Visier öffnen, Kinnriemen lösen, einer hält Kopf und Nacken, der andere zieht den Helm ab',
      'Kopf überstrecken und den Helm ruckartig nach oben abziehen',
      'Den Fahrer an Helm und Schultern aufsetzen, dann den Helm abnehmen',
      'Den Kinnriemen geschlossen lassen und den Helm nach hinten kippen',
    ],
    erklaerung: 'Beim Abnehmen wird der Kopf stabilisiert, damit der Hals nicht verdreht wird. Erst Visier öffnen und Kinnriemen lösen, dann den Helm vorsichtig abziehen.',
  },
  {
    id: 'g-rettungsgriff-auto',
    lage: 'Nach einem Unfall qualmt ein Auto. Eine bewusstlose Fahrerin sitzt angeschnallt am Steuer. Du kannst gefahrlos an sie heran und musst sie retten.',
    optionen: [
      'Gurt lösen, von hinten unter den Achseln durchgreifen, Unterarm fassen und herausziehen',
      'Sie an den Beinen aus dem Wagen ziehen',
      'Sie am Hals festhalten und ruckartig hochheben',
      'Im Auto lassen und auf die Feuerwehr warten',
    ],
    erklaerung: 'Rautek-Rettungsgriff: Von hinten unter beide Achseln greifen, einen Unterarm festhalten und rückwärts herausziehen. Nur bei akuter Gefahr wie Rauch oder Feuer.',
  },
  {
    id: 'g-autobahn-unfall',
    lage: 'Du hältst nach einem Auffahrunfall auf der Autobahn am Seitenstreifen. In einem Wagen sitzen Verletzte, es herrscht dichter Verkehr.',
    optionen: [
      'Warnblinker, Warnweste, Gesunde hinter die Leitplanke schicken, dann 112 rufen',
      'Sofort über die Fahrbahn zum Wagen laufen',
      'Zu Fuß auf der Fahrbahn weit zurückgehen und dort das Warndreieck aufstellen',
      'Auf der Fahrbahn winken, um den Verkehr zu bremsen',
    ],
    erklaerung: 'Auf der Autobahn schützt du zuerst dich und die Unverletzten: Warnblinker, Warnweste, hinter der Leitplanke warten, dann 112. Nie auf der Fahrbahn aufhalten.',
  },
  {
    id: 'g-motor-aus',
    lage: 'Ein Auto ist gegen einen Baum gefahren. Der Motor läuft noch, aus der Haube dampft es leicht. Der Fahrer ist benommen, aber ansprechbar.',
    optionen: [
      'Zündung aus, Schlüssel abziehen, Warnblinker anlassen, dann zum Fahrer',
      'Den Fahrer sofort aus dem Wagen zerren',
      'Die Motorhaube öffnen, um den Dampf abzulassen und nachzusehen',
      'Den Motor laufen lassen, damit die Heizung funktioniert',
    ],
    erklaerung: 'Ein laufender Motor ist ein Risiko, etwa für Brand oder Wegrollen. Schalte die Zündung aus und ziehe den Schlüssel, dann kümmere dich um den Fahrer.',
  },

  // ---------- Betreuen / Psyche ----------
  {
    id: 'g-betreuen-weinend',
    lage: 'Nach einem Fahrradunfall sitzt eine junge Frau mit aufgeschürftem Knie weinend am Bordstein und zittert. Der Rettungswagen kommt in einigen Minuten.',
    optionen: [
      'Neben sie setzen, ruhig sprechen, Hand anbieten und zuhören',
      'Ihr sagen, sie soll sich zusammenreißen, es sei ja nichts Schlimmes passiert',
      'Sie allein lassen, damit sie sich beruhigen kann',
      'Ständig erklären, was alles hätte passieren können',
    ],
    erklaerung: 'Menschen in Not brauchen Ruhe und Nähe. Setz dich auf Augenhöhe, sprich leise, sag, was passiert, und bleib bei ihr, bis der Rettungsdienst übernimmt.',
  },
  {
    id: 'g-angehoerige-reanimation',
    lage: 'Du reanimierst im Wohnzimmer einen Mann. Seine Frau schreit, will sich auf ihn werfen und dich wegziehen. Eine Nachbarin ist dazugekommen.',
    optionen: [
      'Der Nachbarin zurufen, die Frau wegzuführen und zu betreuen, du machst weiter',
      'Die Reanimation abbrechen und die Frau erst beruhigen',
      'Die Frau laut anschreien, sie soll sofort verschwinden und nicht stören',
      'Die Frau auffordern, den Kopf ihres Mannes festzuhalten',
    ],
    erklaerung: 'Die Wiederbelebung darf nicht unterbrochen werden. Gib einer anderen Person den klaren Auftrag, die Angehörige zu betreuen, und drücke weiter.',
  },
  {
    id: 'g-patient-will-gehen',
    lage: 'Ein Radfahrer ist gestürzt, blutet am Kopf und war kurz benommen. Er steht auf, sagt „Passt schon“ und will weiterfahren.',
    optionen: [
      'Ruhig erklären, dass er untersucht werden muss, ihn hinsetzen und bei ihm bleiben, 112',
      'Ihn gehen lassen, er kennt seinen Körper am besten',
      'Ihn am Arm festhalten und zum Bleiben zwingen',
      'Ihm das Fahrrad wegnehmen und ihn allein sitzen lassen',
    ],
    erklaerung: 'Nach einem Sturz mit Kopfverletzung können Beschwerden später auftreten. Überzeuge ihn ruhig, bleib bei ihm und lass den Rettungsdienst entscheiden. Zwingen darfst du ihn nicht.',
  },
  {
    id: 'g-helfer-belastung',
    lage: 'Du hast gestern bei einer erfolglosen Wiederbelebung geholfen. Jetzt gehen dir die Bilder nicht aus dem Kopf, du schläfst schlecht und fühlst dich schuldig.',
    optionen: [
      'Darüber reden und Hilfe holen, etwa bei Notfallseelsorge oder Hausärztin',
      'Alles für dich behalten, damit dich niemand für schwach hält, es geht vorbei',
      'Dich mit Alkohol ablenken, bis es vergeht',
      'Dir vornehmen, nie wieder zu helfen',
    ],
    erklaerung: 'Solche Reaktionen sind normal. Sprich darüber und nimm Hilfe an, etwa von der Notfallseelsorge oder Hausärztin. Du hast getan, was du konntest.',
  },

  // ---------- Rest: Zahn, Auge, Zecke, Strom ----------
  {
    id: 'g-zahn-ausgeschlagen',
    lage: 'Beim Fußballspielen wird einem Jungen ein Schneidezahn komplett ausgeschlagen. Du hast den Zahn in der Hand. Der Mund blutet leicht.',
    optionen: [
      'Zahn an der Krone fassen, in Rettungsbox oder kalter H-Milch lagern, schnell zum Zahnarzt',
      'Zahn unter Wasser abbürsten und in ein Taschentuch wickeln',
      'Den Zahn sofort selbst wieder einsetzen und andrücken',
      'Den Zahn trocken in die Hosentasche stecken',
    ],
    erklaerung: 'Fasse den Zahn nicht an der Wurzel an und reinige ihn nicht. In Zahnrettungsbox oder kalter H-Milch hat er die besten Chancen. Schnell zum Zahnarzt.',
  },
  {
    id: 'g-auge-chemikalie',
    lage: 'Beim Putzen im Bad spritzt Rohrreiniger einer Frau ins linke Auge. Es brennt stark, sie hält die Hand davor und kneift das Auge zu.',
    optionen: [
      'Sofort lange mit Wasser spülen, Kopf zur verletzten Seite neigen, von innen nach außen',
      'Mit einem sauberen Taschentuch vorsichtig auswischen und abwarten, ob es aufhört',
      'Augentropfen aus der Hausapotheke einträufeln',
      'Das Auge zuhalten und ein Pflaster darauf kleben',
    ],
    erklaerung: 'Chemikalien verdünnst du sofort mit viel Wasser. Neige den Kopf zur verletzten Seite, damit nichts ins gesunde Auge läuft. Danach Augenarzt oder 112.',
  },
  {
    id: 'g-zecke-entfernen',
    lage: 'Nach der Wanderung entdeckst du bei deinem Kind eine Zecke in der Kniekehle. Im Verbandkasten liegt eine Zeckenkarte.',
    optionen: [
      'Zecke mit Karte oder Pinzette hautnah fassen und gerade herausziehen, Stelle merken',
      'Zecke mit Öl oder Klebstoff beträufeln, bis sie von selbst abfällt',
      'Zecke am Körper fest quetschen und herausreißen',
      'Zecke mit einem Streichholz abbrennen',
    ],
    erklaerung: 'Fasse die Zecke möglichst hautnah und ziehe sie gerade heraus, ohne den Körper zu quetschen. Kein Öl, kein Kleber. Stelle beobachten, bei Rötung zum Arzt.',
  },
  {
    id: 'g-stromschlag-danach',
    lage: 'Ein Elektriker hat einen Stromschlag bekommen. Der Strom ist aus, er sitzt benommen am Boden, ist ansprechbar und sagt, es gehe ihm schon wieder gut.',
    optionen: [
      'Trotzdem 112 rufen, zudecken, Atmung und Bewusstsein beobachten',
      'Ihn zur Arbeit zurückschicken, sobald er sich wieder fit genug fühlt',
      'Nur Brandmale kühlen und ihn nach Hause fahren',
      'Ihm etwas Heißes zu trinken geben und abwarten',
    ],
    erklaerung: 'Nach einem Stromunfall kann das Herz noch später aus dem Takt geraten. Darum immer 112, auch wenn er fit wirkt, und weiter beobachten.',
  },
];
