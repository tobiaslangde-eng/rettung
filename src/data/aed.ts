import { NotrufSzenario } from './helferTraining';

/** Defi-Training: Gerätestimme oder Lage vorgeben, die beste Reaktion wählen (erste Antwort = beste) */
export const AED_SZENARIEN: NotrufSzenario[] = [
  {
    id: 'aed-supermarkt',
    titel: 'Defi im Supermarkt',
    lage: 'Im Supermarkt bricht ein Mann zusammen. Er reagiert nicht und atmet nicht normal. Die 112 ist gerufen, du drückst schon, da bringt eine Kundin den AED aus dem Eingangsbereich.',
    schritte: [
      {
        frage: 'Die Kundin stellt den AED neben dich und fragt: „Was soll ich jetzt tun?“',
        antworten: [
          'Ich drücke weiter und bitte sie, den AED einzuschalten und den Ansagen des Geräts zu folgen.',
          'Ich höre mit dem Drücken auf und lese erst die Anleitung auf dem Gerät.',
          'Wir warten ab, bis der Rettungsdienst kommt, der Defibrillator ist Sache der Profis.',
        ],
        erklaerung: 'Jede Sekunde ohne Herzdruckmassage zählt. Das Gerät führt mit Sprachansagen durch den Ablauf, du musst die Anleitung nicht vorher lesen.',
      },
      {
        frage: 'Gerätestimme: „Brust freimachen. Elektroden aufkleben.“',
        antworten: [
          'Ich schneide sein Hemd auf, mache den Oberkörper frei und klebe beide Pads direkt auf die Haut.',
          'Ich klebe die Pads zur Sicherheit auf sein T-Shirt, dann geht es schneller.',
          'Ich klebe beide Pads nebeneinander auf die Mitte des Brustkorbs.',
        ],
        erklaerung: 'Pads müssen direkt auf der nackten Haut haften. Ein Pad kommt rechts unter das Schlüsselbein, eins seitlich links unter die Achsel, so zeigen es die Bilder auf den Pads.',
      },
      {
        frage: 'Gerätestimme: „Analyse läuft. Nicht berühren!“',
        antworten: [
          'Ich rufe „Weg von ihm!“, nehme die Hände vom Brustkorb und achte darauf, dass niemand ihn berührt.',
          'Ich drücke weiter, damit keine Zeit verloren geht.',
          'Ich halte seinen Kopf fest, damit er bei der Analyse nicht verrutscht.',
        ],
        erklaerung: 'Bewegungen und Berührungen verfälschen die Herzrhythmus-Analyse. Deshalb ist für diese Sekunden wirklich niemand am Körper.',
      },
      {
        frage: 'Gerätestimme: „Schock empfohlen. Bitte Auslösetaste drücken.“',
        antworten: [
          'Ich sehe, dass niemand ihn berührt, rufe laut „Achtung, Schock!“ und drücke dann die Taste.',
          'Ich drücke die Taste sofort, das Gerät hat ja schon alles geprüft.',
          'Ich bitte die Kundin, die Taste zu drücken, während ich ihn weiter festhalte.',
        ],
        erklaerung: 'Der Schock wird nur ausgelöst, wenn das Gerät ihn empfiehlt und alle Abstand halten. Auch du selbst darfst ihn nicht berühren.',
      },
      {
        frage: 'Gerätestimme: „Schock abgegeben. Herzdruckmassage beginnen.“',
        antworten: [
          'Ich drücke sofort weiter, fest und schnell, bis das Gerät die nächste Analyse ansagt.',
          'Ich prüfe erst eine Minute lang, ob sein Herz wieder von selbst schlägt.',
          'Ich ziehe die Pads ab und schalte das Gerät aus, der Schock ist ja geschafft.',
        ],
        erklaerung: 'Nach dem Schock muss das Herz mit Massage wieder in Gang gebracht werden. Das Gerät gibt den 2-Minuten-Takt vor, Pads und Gerät bleiben bis zum Rettungsdienst dran.',
      },
    ],
  },
  {
    id: 'aed-sportplatz',
    titel: 'Defi auf dem Sportplatz',
    lage: 'Auf dem Sportplatz bricht ein Fußballspieler zusammen. Er ist bewusstlos und atmet nicht normal. Du drückst, ein Mitspieler bringt den AED. Der Mann ist verschwitzt und stark behaart.',
    schritte: [
      {
        frage: 'Der AED ist da. Das Trikot des Mannes klebt nass am Oberkörper.',
        antworten: [
          'Ich schneide das Trikot auf, trockne die Brust mit dem Tuch aus dem AED-Set ab und mache die Haut frei.',
          'Ich warte, bis er trockengeschwitzt ist, dann kleben die Pads besser.',
          'Ich lasse das Trikot an, die Pads kleben auch durch den dünnen Stoff.',
        ],
        erklaerung: 'Pads haften nur auf freier, trockener Haut. Im AED-Set liegen meist Schere und Tuch dafür. Warten kostet Minuten, die der Mann nicht hat.',
      },
      {
        frage: 'Die Brust ist dicht behaart, ein aufgelegtes Pad haftet kaum.',
        antworten: [
          'Ich rasiere die Pad-Stellen kurz mit dem Einwegrasierer aus dem Set kahl und klebe die Pads auf.',
          'Ich lasse die Haare, Hauptsache die Pads sind irgendwie aufgeklebt.',
          'Ich rasiere die ganze Brust sorgfältig, auch wenn es mehrere Minuten dauert.',
        ],
        erklaerung: 'Haare verhindern den Hautkontakt. Rasiert wird nur schnell an den Pad-Stellen. Ein Mitspieler drückt währenddessen weiter, damit die Pause kurz bleibt.',
      },
      {
        frage: 'Gerätestimme: „Elektroden aufkleben.“ Ein Bild auf den Pads zeigt die Position.',
        antworten: [
          'Ich klebe ein Pad rechts unter das Schlüsselbein, das andere links seitlich unterhalb der Achsel.',
          'Ich klebe beide Pads links nebeneinander direkt über das Herz.',
          'Ich klebe ein Pad auf die Brustmitte, das andere auf den Bauch.',
        ],
        erklaerung: 'Der Strom soll quer durch das Herz fließen: ein Pad oben rechts, eins unten links. Das Bild auf dem Pad zeigt die Stelle.',
      },
      {
        frage: 'Gerätestimme: „Schock empfohlen. Alle zurücktreten.“ Ein Mitspieler hält noch seinen Kopf.',
        antworten: [
          'Ich lasse ihn loslassen, rufe „Alle weg!“, schaue rundum und löse erst dann den Schock aus.',
          'Ich löse sofort aus, er soll einfach schnell den Kopf loslassen.',
          'Ich löse aus, am Kopf ist Berühren ungefährlich.',
        ],
        erklaerung: 'Bei der Schockabgabe darf niemand den Mann berühren, auch nicht am Kopf. Ein Blick rundum ist Pflicht, bevor die Taste gedrückt wird.',
      },
      {
        frage: 'Nach dem Schock zuckt der Mann. Der Mitspieler ruft: „Er lebt wieder!“',
        antworten: [
          'Das Zucken kommt vom Stromstoß. Ich drücke sofort weiter und folge den Ansagen des Geräts.',
          'Ich beende die Massage und lege ihn in die stabile Seitenlage.',
          'Ich warte kurz und prüfe nach einer Minute die Atmung.',
        ],
        erklaerung: 'Das Zucken ist eine Muskelreaktion auf den Schock, kein Lebenszeichen. Sofort weiterdrücken, bis das Gerät oder der Rettungsdienst etwas anderes sagt.',
      },
    ],
  },
  {
    id: 'aed-schwimmbad',
    titel: 'Defi am Beckenrand',
    lage: 'Am Rand eines Freibads liegt ein Mann bewusstlos auf nassen Fliesen und atmet nicht normal. Du drückst schon, der Bademeister bringt den AED. Überall steht Wasser.',
    schritte: [
      {
        frage: 'Der Boden steht unter Wasser. Der Bademeister fragt: „Dürfen wir den AED hier überhaupt einsetzen?“',
        antworten: [
          'Ja, wir ziehen ihn nur aus der Pfütze auf eine trockene Fläche, trocknen die Brust ab und setzen den AED ein.',
          'Nein, bei Wasser droht ein Stromschlag, wir drücken nur bis zum Rettungsdienst.',
          'Ja, wir lassen ihn in der Pfütze liegen und kleben die Pads auf die nasse Haut.',
        ],
        erklaerung: 'Wasser ist kein Grund, auf den AED zu verzichten. Der Mann liegt aber besser nicht in einer Pfütze, und die Haut muss trocken sein.',
      },
      {
        frage: 'Seine Haut ist triefnass. Der Bademeister reicht dir ein Handtuch.',
        antworten: [
          'Ich trockne die Brust gründlich ab, klebe die Pads auf und drücke sie fest an.',
          'Ich wische einmal mit der flachen Hand drüber, ein Rest Wasser stört nicht.',
          'Ich klebe die Pads sofort auf, das Wasser trocknet unter dem Pad von selbst.',
        ],
        erklaerung: 'Nasse Haut lässt Pads abrutschen, und Strom kann sich über den Wasserfilm verteilen. Deshalb wird die Brust vor dem Aufkleben richtig trocken gerieben.',
      },
      {
        frage: 'Gerätestimme: „Analyse läuft. Nicht berühren!“',
        antworten: [
          'Ich nehme die Hände weg, rufe „Weg!“ und lasse niemanden ihn berühren, bis die Analyse fertig ist.',
          'Ich lasse meine Hände auf dem Brustkorb, damit ich sofort weiterdrücken kann.',
          'Ich beuge mich über ihn und prüfe in der Pause die Atmung.',
        ],
        erklaerung: 'Auch die Atemprüfung stört die Analyse. Das Gerät braucht ein ruhiges Signal, erst nach der Ansage geht es weiter.',
      },
      {
        frage: 'Gerätestimme: „Schock empfohlen.“ Badegäste stehen dicht, eine Wasserlache reicht bis an die Pads.',
        antworten: [
          'Ich lasse alle zurücktreten, achte darauf, dass niemand ihn oder die Lache berührt, und löse dann aus.',
          'Ich löse sofort aus, bei einem AED spielt es keine Rolle, wer wo im Wasser steht.',
          'Ich löse aus, sobald ich selbst nicht mehr nass bin.',
        ],
        erklaerung: 'Alle halten Abstand, auch zu Wasserlachen, die den Mann berühren. Erst wenn das gesichert ist, wird der Schock ausgelöst.',
      },
      {
        frage: 'Der Rettungsdienst trifft ein. Ein Sanitäter fragt: „Was habt ihr bisher gemacht?“',
        antworten: [
          'Ich berichte: Zusammenbruch, Beginn der Massage, ein Schock abgegeben. Die Pads lasse ich kleben.',
          'Ich ziehe die Pads ab, damit die Sanitäter freie Bahn haben.',
          'Ich weiß nicht, wie lange er schon lag, ich sage lieber nichts.',
        ],
        erklaerung: 'Kurze Angaben helfen dem Rettungsdienst. Die Pads bleiben kleben, bis die Sanitäter sie selbst am eigenen Gerät anschließen.',
      },
    ],
  },
  {
    id: 'aed-kind',
    titel: 'Defi bei einem Kind',
    lage: 'Auf dem Bolzplatz bricht ein achtjähriger Junge zusammen. Er reagiert nicht und atmet nicht normal. Die 112 ist gerufen, du drückst, ein Passant bringt den AED aus der Turnhalle.',
    schritte: [
      {
        frage: 'Im AED-Koffer liegen zwei Padpaare: für Erwachsene und für Kinder.',
        antworten: [
          'Ich nehme die Kinderpads oder schalte den Kindermodus ein, wenn das Gerät einen hat.',
          'Ich nehme die Erwachsenenpads, die haben mehr Energie und wirken sicherer.',
          'Ich verzichte auf den AED, bei Kindern darf man ihn nie einsetzen.',
        ],
        erklaerung: 'Kinderpads geben weniger Energie ab. Fehlen sie, nimmt man lieber Erwachsenenpads als gar keinen Schock, dann beide Pads nicht überlappend kleben.',
      },
      {
        frage: 'Der Junge ist schmal. Beide Kinderpads passen kaum nebeneinander auf seinen Brustkorb.',
        antworten: [
          'Ich klebe ein Pad mittig auf die Brust und das zweite mittig auf den Rücken, vorne und hinten.',
          'Ich klebe die Pads übereinander, so passen sie schon.',
          'Ich klebe ein Pad auf die Brust und eins auf den Bauch.',
        ],
        erklaerung: 'Bei kleinen Kindern klebt man die Pads vorne und hinten, damit sie sich nicht berühren. Berühren sich Pads, kann der Strom nicht durch das Herz fließen.',
      },
      {
        frage: 'Gerätestimme: „Analyse läuft. Nicht berühren!“ Die Mutter hält seine Hand.',
        antworten: [
          'Ich bitte die Mutter, ihn kurz loszulassen, rufe „Weg!“ und nehme auch meine Hände weg.',
          'Ich lasse die Mutter seine Hand halten, ein Kind spürt, dass jemand da ist.',
          'Ich drücke sanft weiter, bei Kindern stört die Analyse nicht.',
        ],
        erklaerung: 'Auch bei Kindern darf während der Analyse niemand den Körper berühren, die Mutter eingeschlossen. Ein freundliches Wort hilft ihr beim Loslassen.',
      },
      {
        frage: 'Gerätestimme: „Schock empfohlen. Bitte Auslösetaste drücken.“',
        antworten: [
          'Ich schaue rundum, rufe „Weg!“ und löse den Schock aus, auch wenn es bei einem Kind schwerfällt.',
          'Ich löse nicht aus, das Herz eines Kindes ist zu klein für einen Stromstoß.',
          'Ich warte auf den Rettungsdienst, der soll den Schock bei Kindern auslösen.',
        ],
        erklaerung: 'Auch bei Kindern ist der Schock die wirksame Hilfe, wenn das Gerät ihn empfiehlt. Mit Kinderpads ist die Energie angepasst.',
      },
      {
        frage: 'Gerätestimme: „Schock abgegeben. Herzdruckmassage beginnen.“ Die Mutter weint.',
        antworten: [
          'Ich drücke sofort weiter, fest und schnell, etwa ein Drittel tief in den Brustkorb.',
          'Ich drücke ganz sanft, der Brustkorb eines Kindes ist zerbrechlich.',
          'Ich warte ab, ob er von selbst wieder atmet.',
        ],
        erklaerung: 'Bei Kindern wird nur weniger tief gedrückt: etwa ein Drittel der Brusthöhe. Zu sanftes Drücken pumpt kein Blut.',
      },
    ],
  },
  {
    id: 'aed-schrittmacher',
    titel: 'Defi bei Schrittmacher',
    lage: 'In einem Café bricht ein Mann zusammen, bewusstlos und ohne normale Atmung. Der AED ist da. Du machst den Oberkörper frei: links ein großes Pflaster, rechts unter dem Schlüsselbein eine Beule.',
    schritte: [
      {
        frage: 'Auf der linken Brust klebt ein großes Pflaster mit Aufdruck eines Medikaments.',
        antworten: [
          'Ich ziehe das Pflaster ab, wische die Haut trocken und klebe das Pad auf die freie Haut.',
          'Ich klebe das Pad auf das Pflaster, damit es nicht verrutscht.',
          'Ich lasse Pflaster und Pad weg und drücke nur weiter.',
        ],
        erklaerung: 'Unter dem Pad darf kein Pflaster liegen. Es verhindert den Hautkontakt und kann sich beim Schock erhitzen oder Hautschäden verursachen.',
      },
      {
        frage: 'Rechts unter dem Schlüsselbein wölbt sich eine harte Beule, darüber eine Narbe.',
        antworten: [
          'Das ist wohl ein Herzschrittmacher. Ich klebe das Pad mindestens eine Handbreit daneben.',
          'Ich klebe das Pad genau darauf, so erreicht der Strom das Herz direkt.',
          'Ich setze den AED nicht ein, bei einem Schrittmacher ist er verboten.',
        ],
        erklaerung: 'Ein Schrittmacher oder Defibrillator unter der Haut ist keine Gegenanzeige. Die Pads sollen aber nicht direkt darauf liegen, etwa eine Handbreit Abstand halten.',
      },
      {
        frage: 'Gerätestimme: „Analyse läuft. Nicht berühren!“ Ein Kellner hebt die Beine des Mannes an.',
        antworten: [
          'Ich bitte ihn, die Beine loszulassen, und rufe „Alle weg!“. Niemand berührt den Mann während der Analyse.',
          'Ich lasse ihn, Beine hochlagern hilft dem Kreislauf.',
          'Ich drücke weiter, der Kellner kann die Beine ruhig halten.',
        ],
        erklaerung: 'Bei Atem- und Kreislaufstillstand hilft Beinehochlagern nicht. Auch Beine, Arme und Kopf dürfen bei der Analyse nicht festgehalten werden.',
      },
      {
        frage: 'Gerätestimme: „Schock empfohlen.“ Ein Gast warnt: „Bei einem Schrittmacher passiert doch was.“',
        antworten: [
          'Der Schock ist trotzdem richtig. Ich prüfe den Abstand aller, rufe „Weg!“ und drücke die Taste.',
          'Ich löse nicht aus, der Schrittmacher könnte kaputtgehen.',
          'Ich löse aus und bitte seine Frau, ihm währenddessen die Hand zu halten.',
        ],
        erklaerung: 'Ein defekter Schrittmacher ist ersetzbar, ein Herzstillstand ohne Hilfe nicht. Der Schock wird wie immer ausgelöst, wenn niemand den Mann berührt.',
      },
      {
        frage: 'Der Rettungsdienst trifft ein. Der Notarzt fragt nach Besonderheiten.',
        antworten: [
          'Ich sage: Schrittmacher rechts unter dem Schlüsselbein, links ein Pflaster abgezogen, ein Schock abgegeben.',
          'Ich erwähne das Pflaster nicht, es war ja nur ein Pflaster.',
          'Ich sage nur, dass er umgefallen ist, mehr weiß ich nicht.',
        ],
        erklaerung: 'Schrittmacher und Pflaster sind wichtige Hinweise für die Ärzte, etwa zu Herzerkrankung oder Medikamenten. Gib sie kurz weiter.',
      },
    ],
  },
  {
    id: 'aed-zwei-helfer',
    titel: 'Defi mit Helferwechsel',
    lage: 'Im Bürogebäude ist eine Kollegin zusammengebrochen. Du und dein Kollege Jonas beleben sie wieder, der AED klebt, ein Schock ist abgegeben. Nach zwei Minuten Drücken lässt deine Kraft nach.',
    schritte: [
      {
        frage: 'Jonas fragt dich: „Wann tauschen wir?“',
        antworten: [
          'Wir wechseln etwa alle zwei Minuten, am besten wenn das Gerät analysiert, dann bleibt die Pause kurz.',
          'Wir wechseln erst, wenn ich wirklich nicht mehr kann.',
          'Wir wechseln nur alle zehn Minuten, dann gibt es weniger Pausen.',
        ],
        erklaerung: 'Nach etwa zwei Minuten lässt die Druckqualität deutlich nach. Der Wechsel in der Analysepause kostet keine zusätzliche Zeit.',
      },
      {
        frage: 'Gerätestimme: „Schock abgegeben. Herzdruckmassage beginnen.“ Jonas kniet neben dir.',
        antworten: [
          'Jonas legt sofort die Hände auf, ich rutsche zur Seite. Die Pause bleibt nur ein paar Sekunden lang.',
          'Wir besprechen erst in Ruhe, wer wohin rutscht und wie wir uns abwechseln.',
          'Ich drücke noch einen Zyklus weiter, damit Jonas sich innerlich vorbereiten kann.',
        ],
        erklaerung: 'Der Wechsel läuft nahtlos: Einer übernimmt, der andere macht Platz. Jede Sekunde ohne Druck senkt die Überlebenschance.',
      },
      {
        frage: 'Nach 90 Sekunden drückt Jonas flach und langsam, er wirkt erschöpft.',
        antworten: [
          'Ich gebe den Takt vor, rufe „tiefer!“ und wechsle lieber früher mit ihm.',
          'Ich lasse ihn flach bis zur nächsten Analyse weiterdrücken, damit er nicht entmutigt wird.',
          'Ich bitte ihn aufzuhören, bis er sich erholt hat.',
        ],
        erklaerung: 'Gutes Drücken ist 5 bis 6 cm tief, 100 bis 120 Mal pro Minute. Wer nachlässt, wird früher abgelöst, eine längere Pause gibt es nicht.',
      },
      {
        frage: 'Eine weitere Kollegin sagt: „Ich war im Erste-Hilfe-Kurs, ich kann mithelfen.“',
        antworten: [
          'Ja, gern: Sie drückt im Wechsel mit Jonas, ich bleibe am Telefon und achte auf die Zeit.',
          'Nein, mehr als zwei Helfer verwirren nur.',
          'Nein, wer angefangen hat, macht bis zum Eintreffen allein weiter.',
        ],
        erklaerung: 'Je mehr Hilfe, desto besser bleibt die Qualität. Mehrere Helfer wechseln sich ab, einer behält Telefon und Zeit im Blick.',
      },
      {
        frage: 'Der Rettungsdienst kommt mit Notfallrucksack herein, die Kollegin ist noch bewusstlos.',
        antworten: [
          'Ich drücke weiter, bis die Sanitäter es ausdrücklich übernehmen, und berichte dann kurz.',
          'Ich höre sofort auf, sobald ich die Sanitäter sehe.',
          'Ich schalte den AED aus, die Profis haben ein eigenes Gerät.',
        ],
        erklaerung: 'Die Übergabe geschieht erst, wenn der Rettungsdienst übernimmt. Der AED läuft weiter, bis die Sanitäter ihr Gerät anschließen.',
      },
    ],
  },
  {
    id: 'aed-kein-schock',
    titel: 'Defi: Kein Schock empfohlen',
    lage: 'Auf dem Bahnsteig bricht ein Mann zusammen, bewusstlos und ohne normale Atmung. Passanten rufen die 112 und holen den AED aus der Bahnhofshalle. Du hast die Pads schon aufgeklebt.',
    schritte: [
      {
        frage: 'Gerätestimme: „Analyse läuft. Nicht berühren!“',
        antworten: [
          'Ich nehme die Hände weg, rufe „Weg!“ und warte, bis das Gerät sein Ergebnis ansagt.',
          'Ich nutze die Pause und fühle seinen Puls am Handgelenk.',
          'Ich beuge mich vor und prüfe, ob die Pads richtig kleben.',
        ],
        erklaerung: 'Jede Berührung kann die Analyse stören. Ob die Pads haften, meldet das Gerät selbst mit „Elektroden prüfen“.',
      },
      {
        frage: 'Gerätestimme: „Kein Schock empfohlen. Herzdruckmassage fortsetzen.“',
        antworten: [
          'Ich drücke sofort weiter, fest und schnell, denn sein Kreislauf steht noch still.',
          'Ich höre auf, kein Schock heißt, sein Herz schlägt wieder von selbst.',
          'Ich drücke die Auslösetaste trotzdem, sicher ist sicher.',
        ],
        erklaerung: '„Kein Schock empfohlen“ bedeutet nicht, dass alles gut ist. Das Herz pumpt trotzdem nicht, also muss die Herzdruckmassage weitergehen.',
      },
      {
        frage: 'Zwei Minuten später sagt das Gerät erneut: „Kein Schock empfohlen.“ Du bist erschöpft.',
        antworten: [
          'Ich wechsle mit einer anderen Person und drücke weiter, Gerät und Pads bleiben, wie sie sind.',
          'Ich schalte den AED aus und drücke ohne Gerät weiter, er bringt nichts mehr.',
          'Ich höre auf, nach zwei Runden ohne Schock hat es keinen Sinn mehr.',
        ],
        erklaerung: 'Das Gerät analysiert alle zwei Minuten neu, auch ein späterer Schock bleibt möglich. Es bleibt eingeschaltet, die Pads kleben, die Massage geht weiter.',
      },
      {
        frage: 'Der Mann öffnet kurz die Augen und atmet plötzlich normal. Das Gerät schweigt gerade.',
        antworten: [
          'Ich prüfe höchstens zehn Sekunden Reaktion und Atmung. Atmet er normal, lege ich ihn in die stabile Seitenlage, Pads bleiben.',
          'Ich drücke trotzdem weiter, bis der Rettungsdienst da ist, so ist es sicherer.',
          'Ich ziehe die Pads ab, ein Mann, der atmet, braucht sie nicht.',
        ],
        erklaerung: 'Atmet er normal, aber bleibt bewusstlos, wird er in die stabile Seitenlage gelegt. Die Pads bleiben kleben, falls er erneut kollabiert.',
      },
      {
        frage: 'Der Notarzt trifft ein und fragt: „Wie oft hat das Gerät geschockt?“',
        antworten: [
          'Gar nicht. Es hat „Kein Schock empfohlen“ gesagt und wir haben ohne Pause gedrückt, seit dem Zusammenbruch.',
          'Das Gerät war kaputt, es hat nie geschockt.',
          'Ich weiß es nicht, ich habe nicht auf das Gerät geachtet.',
        ],
        erklaerung: '„Kein Schock empfohlen“ ist kein Defekt, sondern heißt: Der Rhythmus ist nicht schockbar. Ein knapper Bericht hilft dem Team bei der Weiterbehandlung.',
      },
    ],
  },
  {
    id: 'aed-elektroden-pruefen',
    titel: 'Defi piept: Elektroden prüfen',
    lage: 'In der Turnhalle ist eine Trainerin zusammengebrochen, bewusstlos und ohne normale Atmung. Du hast den AED eingeschaltet und die Pads aufgeklebt, da piept das Gerät.',
    schritte: [
      {
        frage: 'Gerätestimme: „Elektroden prüfen!“ Dazu ein Piepton.',
        antworten: [
          'Ich drücke beide Pads fest an, prüfe, dass der Stecker im Gerät sitzt, und trockne die Stellen, falls nötig.',
          'Ich schalte das Gerät aus und wieder ein, dann fängt es sich bestimmt.',
          'Ich warte, das Piepen hört nach einer Weile von allein auf.',
        ],
        erklaerung: 'Meist haften die Pads schlecht oder der Stecker ist nicht ganz eingesteckt. Fest andrücken und Stecker prüfen löst das Problem oft sofort.',
      },
      {
        frage: 'Das Piepen bleibt. Ein Pad löst sich an der Ecke, darunter sind Schweiß und Haare.',
        antworten: [
          'Ich ziehe das Pad ab, trockne und rasiere die Stelle kurz und klebe ein neues Pad fest auf.',
          'Ich fixiere die Ecke mit Pflaster aus dem Verbandkasten.',
          'Ich lasse das Pad, wie es ist, der Strom findet schon seinen Weg.',
        ],
        erklaerung: 'Ein Pad mit schlechtem Kontakt kann den Rhythmus nicht messen. Ersatzpads liegen meist im Set; Pflaster oder Tape ersetzen den Hautkontakt nicht.',
      },
      {
        frage: 'Während du die Pads richtest, ist schon eine halbe Minute ohne Herzdruckmassage vergangen.',
        antworten: [
          'Eine zweite Person drückt weiter, solange ich die Pads richte, ich halte die Pause so kurz wie möglich.',
          'Ich löse das Problem erst in Ruhe, danach drücken wir wieder.',
          'Wir geben den AED auf und drücken nur noch.',
        ],
        erklaerung: 'Ohne Massage kommt kein Blut zum Gehirn. Eine zweite Person drückt, bis das Gerät analysiert, Pausen sollen unter zehn Sekunden bleiben.',
      },
      {
        frage: 'Gerätestimme: „Analyse läuft.“ Ein Trainer ruft: „Ich halte das Pad fest, damit es haftet!“',
        antworten: [
          'Ich bitte ihn loszulassen. Auch Pads und Kabel dürfen bei der Analyse niemand berühren.',
          'Okay, am Pad festhalten stört nicht, nur der Brustkorb zählt.',
          'Ich lasse ihn halten, er soll aber vorher Handschuhe anziehen.',
        ],
        erklaerung: 'Bei der Analyse darf niemand den Mann oder die Pads berühren. Haftet ein Pad zu schlecht, wird es vorher neu geklebt.',
      },
      {
        frage: 'Nach dem Schock hustet die Trainerin und öffnet die Augen. Ein Trainer will die Pads abziehen.',
        antworten: [
          'Pads und Gerät bleiben dran. Ich überwache ihre Atmung und bleibe bei ihr, bis der Rettungsdienst da ist.',
          'Ja, wach ist wach: Pads ab und Gerät aus.',
          'Ich ziehe nur ein Pad ab, damit sie leichter atmet.',
        ],
        erklaerung: 'Das Herz kann erneut aussetzen. Mit den Pads kann das Gerät sofort wieder analysieren, bis der Rettungsdienst übernimmt.',
      },
    ],
  },
];
