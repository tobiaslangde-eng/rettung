import { Incident } from '../incidents';

/**
 * Extremfälle: außergewöhnlich schwere Lagen. Hier kommen alle Zwischenfälle nacheinander –
 * mal verschlechtert sich der Patient, mal ist es die Lage vor Ort. Die erste Option ist die richtige.
 * `{name}` wird beim Spielen durch den Vornamen des Patienten ersetzt.
 */
export const EXTREM: Record<string, Incident[]> = {
  'poly-motorrad': [
    {
      art: 'gefahr',
      afterMeasurements: 1,
      text: 'Aus dem Pkw läuft Benzin, und ein Zeuge raucht noch eine Zigarette neben dem Fahrzeug.',
      options: ['Zeuge sofort wegschicken (Zigarette löschen), Feuerwehr nachfordern, Patient aus dem Gefahrenbereich bringen', 'Weiterarbeiten, solange das Benzin nur tropft und noch kein Feuer ausgebrochen ist', 'Den Zeugen um Feuer bitten, damit er die Einsatzstelle besser ausleuchten kann'],
      explanation: 'Auslaufender Kraftstoff ist eine Brandgefahr. Zündquellen vermeiden, Feuerwehr rufen, Eigenschutz geht vor.',
    },
    {
      afterMeasurements: 2,
      text: '{name} atmet plötzlich schneller, die Halsvenen sind gestaut und rechts ist kaum noch Atemgeräusch zu hören.',
      options: ['Spannungspneumothorax: Notarzt sofort, Entlastung, Sauerstoff, Transport ohne Zeitverlust', 'Den Helm abnehmen und den Patienten aufsetzen lassen, damit er besser Luft bekommt', 'Ruhig abwarten, ob sich die Atmung nach einigen Minuten von selbst wieder bessert'],
      explanation: 'Bei Polytrauma kann sich ein Spannungspneumothorax entwickeln. Entlastung rettet das Leben.',
    },
    {
      afterMeasurements: 3,
      text: '{name} wird bewusstlos, der Puls ist kaum tastbar, der Hubschrauber meldet: „Landung in 8 Minuten.“',
      options: ['Atemweg sichern, Beatmung, Blutungen stoppen, Volumen, Landeplatz absichern, Übergabe vorbereiten', 'Warten, bis der Hubschrauber eintrifft, und den Patienten bis dahin nur beobachten', 'Den Helm kräftig abziehen, um den Atemweg schnell frei zu bekommen'],
      explanation: 'Kreislauf und Atmung stabilisieren, Landeplatz sichern und die Übergabe strukturiert vorbereiten.',
    },
  ],
  'poly-baum': [
    {
      art: 'team',
      afterMeasurements: 1,
      text: 'Die Feuerwehr will das Dach abtrennen. Das Schneidgerät steht schon bereit, aber der Patientin wurde nichts erklärt.',
      options: ['Absprache mit der Feuerwehr, Schutz der Patientin (Decke, Ohr-/Augenschutz), Patientin informieren und beruhigen', 'Die Feuerwehr ohne Rücksprache arbeiten lassen, sie kennt sich mit der Technik aus', 'Die Patientin gewaltsam aus dem Fahrzeug ziehen, damit es schneller geht'],
      explanation: 'Technische Rettung braucht Absprache: Schutz des Patienten, klare Kommunikation und gemeinsame Planung.',
    },
    {
      afterMeasurements: 2,
      text: '{name} wird plötzlich bleich, der Blutdruck fällt auf 70/40, der Bauch ist hart.',
      options: ['Innere Blutung: Zugang, Volumen restriktiv nach SOP, Wärme, Notarzt, Traumazentrum sofort', 'Die Patientin aufsitzen lassen, damit sie besser Luft bekommt und der Bauch entlastet wird', 'Der Patientin etwas zu trinken geben, damit der Kreislauf stabil bleibt'],
      explanation: 'Bauchverletzungen bluten innen. Schockbehandlung und schneller Transport in das Traumazentrum.',
    },
    {
      art: 'zeit',
      afterMeasurements: 3,
      text: 'Die Rettung dauert länger: Die Klinik meldet keine Schockraumkapazität, Alternative ist 40 km entfernt.',
      options: ['Nächstes geeignetes Traumazentrum mit Leitstelle abstimmen und Notarzt entscheiden lassen, Zielklinik voranmelden', 'Die nächste beliebige Klinik ohne Rücksprache mit Leitstelle und Notarzt ansteuern', 'Warten, bis in der gesperrten Klinik wieder ein Platz frei wird, und die Patientin so lange versorgen'],
      explanation: 'Wichtig ist die Zielklinik mit passender Ausstattung – gemeinsam mit Leitstelle und Notarzt abstimmen.',
    },
  ],
  'ertrinken-pool': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Der Vater bricht in Tränen aus, will {name} an sich reißen und schreit: „Gib sie mir!“',
      options: ['Ruhig, aber bestimmt: Ich übernehme die Versorgung, er darf neben mir bleiben und eine Aufgabe übernehmen', 'Dem Vater das Kind überlassen, er weiß am besten, was seiner Tochter jetzt hilft', 'Den Vater aus dem Garten schicken und die Gartentür hinter ihm schließen'],
      explanation: 'Eltern sind in Panik. Klare Anweisungen, Nähe und eine Aufgabe geben Halt, ohne dass das Kind gefährdet wird.',
    },
    {
      afterMeasurements: 2,
      text: '{name} atmet plötzlich nicht mehr, die Lippen werden blau.',
      options: ['Atemwege prüfen, 5 Beatmungen, dann Herzdruckmassage/Reanimation nach Kinder-Algorithmus, Notarzt', 'Warten, ob das Kind von selbst wieder zu atmen beginnt, und es dabei zudecken', 'Das Kind in Decken wickeln und abwarten, bis der Notarzt eintrifft'],
      explanation: 'Beim Kind ist die Atmung entscheidend. Beatmung und Herzdruckmassage sofort, dann weiter nach Algorithmus.',
    },
    {
      afterMeasurements: 3,
      text: 'Nach der Wiederbelebung hat {name} wieder einen Puls, aber die Temperatur beträgt 33,8 °C.',
      options: ['Auskühlung beenden: nass entkleiden, trocknen, wärmen (Decken, Heizung im RTW), Monitoring, Kinderklinik', 'Das Kind heiß duschen, damit es schnell wieder warm wird und die Lippen rosig werden', 'Ein Glas Alkohol verabreichen, um den Körper von innen aufzuwärmen'],
      explanation: 'Unterkühlte Kinder wärmt man schonend: trocknen, einpacken, Raum heizen – nicht heiß duschen.',
    },
  ],
  'stich-thorax': [
    {
      art: 'gefahr',
      afterMeasurements: 1,
      text: 'Ein Mann taucht aus der Menge auf, schreit und will an den Patienten ran: „Das war mein Bruder!“ Der Täter ist noch nicht gefasst.',
      options: ['Zurück in den Rettungswagen, Polizei verständigen, erst weiterarbeiten, wenn die Lage gesichert ist', 'Den Mann dazuholen und mithelfen lassen, er kennt den Patienten ja am besten', 'Ihm freien Zugang zum Patienten geben und selbst unbeirrt weiterbehandeln'],
      explanation: 'Eigenschutz geht vor. Bei Gewaltlagen arbeiten wir nur in gesicherten Bereichen.',
    },
    {
      afterMeasurements: 2,
      text: 'Die Atemgeräusche links verschwinden, {name} atmet schnell und wird blau, der Blutdruck fällt.',
      options: ['Spannungspneumothorax: Notarzt sofort, Entlastungspunktion, Sauerstoff, Schockraum voranmelden', 'Den Verband festziehen und abwarten, ob sich die Atmung nach einigen Minuten beruhigt', 'Den Patienten hinlegen und die Beine hochlagern, bis der Blutdruck wieder steigt'],
      explanation: 'Stichwunden der Brust können einen Überdruck verursachen. Entlastung ist lebensrettend.',
    },
    {
      art: 'team',
      afterMeasurements: 3,
      text: 'Die Polizei fragt nach: „Wer hat ihn behandelt? Wir brauchen jetzt die Aussage.“ Während der Behandlung.',
      options: ['Behandlung hat Vorrang: Aussage später, Beweismittel (Kleidung) sichern und übergeben', 'Die Behandlung unterbrechen und der Polizei sofort eine ausführliche Aussage geben', 'Alles Beweismaterial entsorgen, damit der Patient nicht weiter belastet wird'],
      explanation: 'Die Versorgung des Patienten hat Priorität. Beweise (Kleidung) werden dokumentiert und gesichert.',
    },
  ],
  'blutung-kettensaege': [
    {
      art: 'technik',
      afterMeasurements: 1,
      text: 'Der Weg zum RTW ist 400 Meter steil – der Funk hat im Wald keinen Empfang.',
      options: ['Kollegen zum Fahrzeug schicken, Notarzt über Handy/Leitstelle nachfordern, Rettungsweg mit der Feuerwehr planen', 'Warten, bis wieder Funkempfang da ist, und den Patienten währenddessen nur beobachten', 'Den Patienten allein lassen und selbst hinunterrennen, um Hilfe zu holen'],
      explanation: 'Wenn Funk ausfällt, helfen Boten und Handy. Rettungswege mit Feuerwehr/Bergwacht planen.',
    },
    {
      afterMeasurements: 2,
      text: 'Die Abbindung hat nachgegeben, die Blutung beginnt erneut, {name} wird schläfrig.',
      options: ['Tourniquet fester anlegen, direkter Druck, Zeit notieren, Schockbehandlung, Notarzt', 'Den Verband lösen und nachsehen, ob die Wunde noch blutet und die Haut sich verfärbt', 'Den Patienten aufstehen lassen, damit das Blut aus dem Bein wieder abfließt'],
      explanation: 'Das Tourniquet muss die Blutung vollständig stoppen. Zeit notieren und Schock behandeln.',
    },
    {
      art: 'zeit',
      afterMeasurements: 3,
      text: 'Dämmerung setzt ein, der Hubschrauber kann nicht mehr landen, die Trage muss über den Hang.',
      options: ['Trupp zusammenstellen, Trage sichern, Feuerwehr/Bergwacht anfordern, Transport zum RTW organisieren', 'Warten bis zum nächsten Morgen, wenn es wieder hell ist, und den Patienten bis dahin zudecken', 'Den Patienten allein den Hang hinunterrutschen lassen, damit es schnell geht'],
      explanation: 'Technische Rettung am Hang braucht Hilfe und Sicherung – mit Trupp und Gerät.',
    },
  ],
  'rauchgas-keller': [
    {
      art: 'gefahr',
      afterMeasurements: 1,
      text: 'Die Feuerwehr ruft: „Zurück! Im Keller gab es eine Durchzündung, Rauch dringt in den Hof!“',
      options: ['Patienten sofort aus dem Rauchbereich bringen, Abstand halten, Atemschutz beachten, Feuerwehr einbinden', 'Weiterarbeiten, weil im Hof die Luft frisch genug ist und der Rauch sich verzieht', 'Die Fenster der umstehenden Wohnungen öffnen, damit der Rauch abziehen kann'],
      explanation: 'Eigenschutz geht vor. Auch Retter brauchen Abstand zum Brandrauch.',
    },
    {
      afterMeasurements: 2,
      text: '{name} wird heiser, das Atemgeräusch pfeift, die Lippen werden blau.',
      options: ['Atemweg gefährdet: Notarzt sofort, Sauerstoff, Intubationsbereitschaft, Oberkörper hoch', 'Etwas zu trinken geben, damit sich die gereizte Schleimhaut beruhigt und die Stimme zurückkommt', 'Flach hinlegen und abwarten, bis sich das pfeifende Atemgeräusch von selbst wieder verliert'],
      explanation: 'Heißer Rauch lässt die Atemwege zuschwellen. Spezialisten für den Atemweg müssen sofort kommen.',
    },
    {
      afterMeasurements: 3,
      text: '{name} wird verwirrt und krampft – der Verdacht: Blausäure- und Kohlenmonoxidvergiftung.',
      options: ['Sauerstoff hochdosiert, Krampf behandeln, Notarzt: Antidot nach SOP (z. B. Hydroxocobalamin), Brandverletzten-Zentrum', 'Abwarten, der Krampf geht von allein vorbei und eine Behandlung ist nicht nötig', 'Einen Schluck Wasser geben, damit sich der Patient beruhigt und wieder zu sich kommt'],
      explanation: 'Brandrauch enthält Gifte. Hochdosierter Sauerstoff und – nach Leitlinie – Antidote durch den Notarzt.',
    },
  ],
  'aorta-dissektion': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Im Baumarkt versammeln sich Kunden, jemand ruft: „Wir tragen ihn raus!“ und will {name} hochheben.',
      options: ['Stopp: Patient nicht bewegen lassen, Platz schaffen, Sichtschutz, Hilfe zum Wegschicken der Menge einbinden', 'Mitmachen und den Patienten gemeinsam mit den Kunden aus dem Baumarkt hinaustragen', 'Den Mann nach Hause gehen lassen, er braucht jetzt vor allem frische Luft'],
      explanation: 'Jede Bewegung kann das Risiko erhöhen. Erst sicher lagern, dann schonend transportieren.',
    },
    {
      afterMeasurements: 2,
      text: 'Der Schmerz wandert in den Bauch, {name} wird kaltschweißig und der Blutdruck bricht ein.',
      options: ['Schock: flach, Wärme, zwei große Zugänge, Notarzt, Gefäßchirurgie ohne Verzögerung', 'Ein Blutdruckmittel geben, damit der Druck gesenkt wird und der Schmerz nachlässt', 'Den Patienten aufsetzen, damit er besser Luft bekommt und der Bauch entlastet wird'],
      explanation: 'Das ist der Moment des Risses mit Verbluten. Alles muss jetzt sehr schnell gehen.',
    },
    {
      afterMeasurements: 3,
      text: '{name} verliert das Bewusstsein, der Puls ist nicht mehr tastbar.',
      options: ['Wiederbelebung beginnen, Defibrillator, Notarzt sofort, Klinik informieren', 'Weiter beobachten, vielleicht kommt der Kreislauf von selbst wieder in Gang', 'Aufsetzen und etwas Wasser geben, damit der Patient wieder zu sich kommt'],
      explanation: 'Kreislaufstillstand sofort behandeln. Gleichzeitig Klinik und Gefäßchirurgie alarmieren.',
    },
  ],
  'gib-varizen': [
    {
      art: 'gefahr',
      afterMeasurements: 1,
      text: 'Die Gäste drängen sich um {name}. Das Blut verteilt sich auf dem Boden, ich rutsche fast aus. Der Wirt sagt, der Patient sei „leberkrank“.',
      options: ['Eigenschutz (Handschuhe, Schutzkleidung), Umgebung freimachen, Blutspritzer sichern, Hepatitis-/HIV-Risiko beachten', 'Barfuß und ohne Schutz arbeiten, damit man auf dem glatten Boden nicht ausrutscht', 'Ohne Handschuhe weitermachen, weil es sonst zu lange dauert und der Patient blutet'],
      explanation: 'Blut kann Krankheiten übertragen. Handschuhe, Brille und Schutzkleidung gehören zur Standardhygiene.',
    },
    {
      afterMeasurements: 2,
      text: '{name} erbricht erneut hellrotes Blut und wird bewusstlos.',
      options: ['Seitenlage, absaugen, Atemweg sichern, Sauerstoff, Notarzt, Volumen', 'Den Patienten aufsetzen und ihm Wasser geben, damit er wieder zu sich kommt', 'Abwarten und die Menge des erbrochenen Blutes dokumentieren, bevor Maßnahmen folgen'],
      explanation: 'Beim Blutbrechen droht das Einatmen von Blut. Atemwege sichern und Volumen ersetzen.',
    },
    {
      afterMeasurements: 3,
      text: 'Der Notarzt fragt: „Was war genau? Medikamente? Erkrankungen?“ – und {name}s Frau steht schluchzend daneben.',
      options: ['Strukturiert übergeben (Leberzirrhose, Blutdruck, Puls, Maßnahmen), Frau einbinden, Medikamentenliste holen lassen', 'Alles durcheinander berichten und die Details dem Notarzt zum Nachfragen überlassen', 'Die Ehefrau wegschicken, damit sie bei der Übergabe nicht stört und der Notarzt Ruhe hat'],
      explanation: 'Gute Übergabe und das Einbeziehen von Angehörigen liefern wichtige Informationen für die Klinik.',
    },
  ],
  'geburt-auto': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Der Ehemann wird ohnmächtig und kippt vom Auto weg auf den Asphalt.',
      options: ['Kurz sichern (Kollege/Verstärkung kümmert sich), ich bleibe bei der Gebärenden, weitere Kräfte nachfordern', 'Beide gleichzeitig versorgen und zwischen Ehemann und Gebärender hin- und herlaufen', 'Den Ehemann vorerst ignorieren, er kommt von selbst wieder zu sich'],
      explanation: 'Bei mehreren Betroffenen: Priorität setzen und Verstärkung rufen. Die Gebärende braucht jetzt volle Aufmerksamkeit.',
    },
    {
      afterMeasurements: 2,
      text: 'Die Schultern bleiben stecken, das Kind kommt mit der nächsten Wehe nicht weiter.',
      options: ['Schulterdystokie: Mutter in McRoberts-Lage (Beine anziehen), Notarzt informieren, Ruhe, nicht ziehen', 'Kräftig am Kopf des Kindes ziehen, damit die Schultern möglichst schnell kommen', 'Die Mutter aufstehen lassen, damit die Schwerkraft die Geburt unterstützt'],
      explanation: 'Bei steckenden Schultern hilft die McRoberts-Lage. Nie am Kopf ziehen.',
    },
    {
      afterMeasurements: 3,
      text: 'Das Kind ist geboren, schreit aber nicht und ist blass-blau. Die Mutter blutet stark.',
      options: ['Kind abtrocknen, wärmen, stimulieren, ggf. beatmen; Mutter: Gebärmutter massieren, Wärme, Notarzt, Blutung beobachten', 'Nur das Kind versorgen und die Mutter bis zur Übergabe im Auto warten lassen', 'Die Mutter ignorieren, solange das Kind noch nicht schreit, und alles Weitere der Klinik überlassen'],
      explanation: 'Bei Neugeborenem und Mutter gleichzeitig: Aufgaben im Team verteilen, Notarzt und Kinderarzt rufen.',
    },
  ],
  'eklampsie-krampf': [
    {
      afterMeasurements: 1,
      text: '{name} krampft erneut, der Blutdruck steigt auf 210/120.',
      options: ['Vor Verletzungen schützen, Linksseitenlage, Atemweg, Notarzt sofort (Magnesium und Blutdrucksenkung nach SOP)', 'Die Schwangere festhalten, damit sie sich nicht verletzt und der Anfall schneller endet', 'Einen Beißkeil geben, damit sie sich nicht auf die Zunge beißt'],
      explanation: 'Wiederholte Krampfanfälle bei Präeklampsie sind eine Notfallsituation für Mutter und Kind.',
    },
    {
      art: 'zeit',
      afterMeasurements: 2,
      text: 'Die Leitstelle meldet: Die nächste Geburtsklinik ist gesperrt, die zweite ist 35 Minuten entfernt.',
      options: ['Zielklinik mit Notarzt und Leitstelle festlegen, Voranmeldung Geburtshilfe/Neonatologie, zügig losfahren', 'Auf die gesperrte Klinik warten und die Patientin währenddessen zu Hause beobachten', 'Zu Hause bleiben und abwarten, ob die zweite Klinik freie Betten meldet'],
      explanation: 'Eine Klinik mit Geburtshilfe und Kinderintensiv ist nötig. Gemeinsam entscheiden und Voranmeldung nicht vergessen.',
    },
    {
      afterMeasurements: 3,
      text: '{name} klagt über Bauchschmerzen und leichte Blutung – die Plazenta löst sich möglicherweise.',
      options: ['Vorzeitige Plazentalösung: Linksseitenlage, Sauerstoff, Zugang, Notarzt, Kind überwachen, Transport mit Voranmeldung', 'Die Schwangere aufstehen lassen, damit sich das Kind besser drehen und die Blutung stoppen kann', 'Abwarten, ob sich der Schmerz und die Blutung nach einigen Minuten von selbst bessern'],
      explanation: 'Eine Plazentalösung gefährdet Mutter und Kind. Zeit ist entscheidend.',
    },
  ],
  'wirbelsaeule-kopfsprung': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Ein Badegast ruft: „Ihr müsst ihn aufsetzen, er bekommt keine Luft!“ und will {name} an den Schultern hochziehen.',
      options: ['Stoppen, Kopf in Neutralstellung halten, ruhig erklären, Atemwege kontrollieren, notfalls Esmarch-Handgriff', 'Den Patienten aufsetzen, damit er besser Luft bekommt und der Brustkorb frei wird', 'Den Patienten zur Seite rollen, damit er nicht am eigenen Speichel erstickt'],
      explanation: 'Bei Verdacht auf Halswirbelverletzung nie aufsetzen. Esmarch-Handgriff sichert den Atemweg ohne Überstrecken.',
    },
    {
      afterMeasurements: 2,
      text: 'Die Atmung von {name} wird schwächer, die Sättigung fällt, die Brust bewegt sich kaum.',
      options: ['Sauerstoff, Atemunterstützung (Beutel), Notarzt sofort, Atemweg sichern', 'Nur zusehen und die Atmung weiter beobachten, bis der Notarzt eintrifft', 'Den Patienten zum Aufsetzen auffordern, damit er tief durchatmen kann'],
      explanation: 'Bei hoher Lähmung fällt die Atemmuskulatur aus. Beatmungsbereitschaft ist lebenswichtig.',
    },
    {
      afterMeasurements: 3,
      text: 'Der Puls fällt auf 38/min, der Blutdruck sinkt, {name} wird kalt.',
      options: ['Neurogener Schock: Wärmeerhalt, Atropin/Volumen durch Notarzt, Zugang, Monitoring, Traumazentrum', 'Den Patienten aufstehen und herumlaufen lassen, damit der Kreislauf wieder in Schwung kommt', 'Kalt abduschen, damit der Kreislauf angeregt wird und der Puls wieder ansteigt'],
      explanation: 'Beim Rückenmarkschaden sinkt der Blutdruck, der Puls wird langsam. Wärme und Notarzt.',
    },
  ],
  'schwersht-fahrrad': [
    {
      afterMeasurements: 1,
      text: '{name} erbricht und wird zunehmend schläfrig.',
      options: ['Seitenlage, Absaugbereitschaft, Atemweg sichern, Notarzt, Neurochirurgie voranmelden', 'Den Patienten weiterschlafen lassen, bis der Notarzt eintrifft, und dabei zudecken', 'Aufsetzen und Wasser trinken lassen, damit sich der Kreislauf nach dem Erbrechen erholt'],
      explanation: 'Erbrechen und Schläfrigkeit nach Kopfverletzung sind Warnzeichen für Hirndruck.',
    },
    {
      art: 'umfeld',
      afterMeasurements: 2,
      text: 'Die Autofahrerin ist völlig durcheinander und sagt: „Er ist mir vors Auto gefahren, ich habe nichts gemacht!“ Sie droht zu kollabieren.',
      options: ['Kurz beruhigen, Verstärkung/Polizei/Notfallseelsorge einbinden, Patient bleibt Priorität', 'Die Autofahrerin anschreien, dass sie sofort aufhören soll, den Einsatz zu stören', 'Beide Betroffenen gleichzeitig behandeln, ohne weitere Hilfe anzufordern'],
      explanation: 'Unfallbeteiligte stehen unter Schock. Hilfe holen, Priorität bleibt beim Schwerverletzten.',
    },
    {
      afterMeasurements: 3,
      text: 'Die Atmung von {name} wird unregelmäßig, eine Pupille ist weit und starr.',
      options: ['Einklemmung: Beatmung, Notarzt sofort, Oberkörper 30°, schnellster Transport in die Neurochirurgie', 'Den Patienten schlafen lassen, damit sich das Gehirn erholt und der Druck sinkt', 'Wasser ins Gesicht spritzen, um den Patienten wieder zu wecken und die Atmung anzuregen'],
      explanation: 'Das sind Zeichen eines drohenden Hirnstammtods. Atemweg sichern, Druck senken, schnell operieren.',
    },
  ],
  'meningitis-saeugling': [
    {
      afterMeasurements: 1,
      text: 'Auf Bauch und Beinen von {name} erscheinen dunkelrote Flecken, die sich nicht wegdrücken lassen.',
      options: ['Meningokokken-Sepsis: Notarzt sofort, Zugang/Volumen, Sauerstoff, Eigenschutz, Voranmeldung', 'Ein Pflaster auf die Flecken kleben und den Kinderarzt am nächsten Morgen anrufen', 'Abwarten, ob die Flecken von selbst verschwinden, und den Fieberverlauf weiter beobachten'],
      explanation: 'Das ist ein Warnzeichen für eine lebensbedrohliche Blutvergiftung. Jede Minute zählt.',
    },
    {
      art: 'umfeld',
      afterMeasurements: 2,
      text: 'Die Mutter will mit dem Kind im Arm sofort zum Auto laufen und selbst in die Klinik fahren.',
      options: ['Beruhigen, erklären: RTW ist schneller und sicherer, Mutter darf im Fahrzeug mitfahren', 'Die Mutter mit dem Kind gehen lassen und selbst nur den Einsatz dokumentieren', 'Mutter und Kind trennen, damit das Kind in Ruhe untersucht werden kann'],
      explanation: 'Eltern brauchen klare Information. Das Kind muss überwacht und behandelt werden, Mitfahren beruhigt.',
    },
    {
      afterMeasurements: 3,
      text: '{name} krampft und wird apathisch, die Atmung wird flach.',
      options: ['Atemweg sichern, Sauerstoff, Krampfmedikament nach SOP, Notarzt, zügig in die Kinderklinik', 'Das Kind kräftig schütteln, damit es wieder zu sich kommt und den Krampf löst', 'Abwarten, der Anfall geht bei Säuglingen meist von selbst wieder vorbei'],
      explanation: 'Bei Hirnhautentzündung kann es zu Krampfanfällen und Atemversagen kommen. Rasche Behandlung ist lebenswichtig.',
    },
  ],
  'asthma-silent': [
    {
      afterMeasurements: 1,
      text: 'Die Tochter ruft verzweifelt: „Sie wird so still, bitte tun Sie etwas!“ und schüttelt {name}.',
      options: ['Tochter beruhigen und zurückdrängen, Atemweg und Sauerstoff, Notarzt informieren', 'Die Tochter gewähren lassen, sie kennt ihre Mutter am besten und kann sie beruhigen', 'Auf Ruhe vertrauen, weil das Pfeifen weg ist und sich die Patientin offenbar erholt'],
      explanation: 'Angehörige dürfen den Patienten nicht gefährden. Klar anleiten und Aufgaben geben.',
    },
    {
      afterMeasurements: 2,
      text: '{name} sackt zusammen, die Atmung setzt aus, kein tastbarer Puls.',
      options: ['Reanimation beginnen, Beutelbeatmung, Defibrillator, Notarzt sofort', 'Die Patientin aufsetzen und ihr gut zureden, damit sie wieder zu atmen beginnt', 'Abwarten und die Atmung weiter beobachten, vielleicht setzt sie von selbst wieder ein'],
      explanation: 'Ein schwerer Asthmaanfall kann zum Atem- und Herzstillstand führen. Sofort wiederbeleben.',
    },
    {
      art: 'technik',
      afterMeasurements: 3,
      text: 'Der Beatmungsbeutel zeigt keinen Widerstand, die Maske sitzt nicht dicht, die Sauerstoffflasche ist leer.',
      options: ['Maske neu anlegen (Zweihelfer-Technik), Ersatzflasche holen lassen, Notarzt informieren, Beatmung fortsetzen', 'Die Beatmung abbrechen, bis die Ausrüstung wieder funktioniert und der Beutel intakt ist', 'Auf den Notarzt warten und währenddessen nur Herzdruckmassage durchführen'],
      explanation: 'Ausrüstung kontrollieren und Ersatz bereithalten. Beatmung darf nicht unterbrochen werden.',
    },
  ],
  'krampf-status': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Die Lehrerin ruft: „Soll ich ihr einen Löffel in den Mund stecken?“ Die Schüler stehen in der Tür und filmen.',
      options: ['Nein, nichts in den Mund, Schüler wegschicken und Sichtschutz herstellen, Atemweg und Sauerstoff', 'Der Lehrerin zustimmen und der Schülerin einen Löffel zwischen die Zähne schieben', 'Die Schüler filmen lassen, damit der Anfall später dokumentiert werden kann'],
      explanation: 'Nichts in den Mund. Privatsphäre schützen und Atemweg im Blick behalten.',
    },
    {
      afterMeasurements: 2,
      text: 'Der Krampf dauert über zehn Minuten an, die Lippen sind blau.',
      options: ['Status epilepticus: Notarzt sofort, krampfdurchbrechendes Medikament (z. B. Midazolam) nach SOP, Sauerstoff, Zugang', 'Abwarten, der Anfall hört nach einigen Minuten von selbst wieder auf', 'Das Mädchen an Armen und Beinen festhalten, damit es sich nicht verletzt'],
      explanation: 'Nach fünf Minuten muss der Anfall mit Medikamenten durchbrochen werden.',
    },
    {
      afterMeasurements: 3,
      text: 'Nach dem Medikament wird die Atmung flach, {name} reagiert kaum noch.',
      options: ['Atemweg sichern, Sauerstoff, Beutelbeatmung bereit, Atmung und Sättigung engmaschig überwachen, Notarzt', 'Weiter abwarten, die Müdigkeit nach dem Medikament ist eine normale Folge', 'Das Mädchen aufsetzen, damit es besser atmen und trinken kann'],
      explanation: 'Krampfmedikamente können die Atmung dämpfen. Deshalb Atemweg und Beatmungsbereitschaft.',
    },
  ],
  'stemi-brady': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Ein Bekannter ruft: „Der hat doch nur zu viel getrunken!“ und will {name} wegführen und ausnüchtern lassen.',
      options: ['Nein, EKG schreiben, Patient liegen lassen, Notarzt nachfordern', 'Den Patienten vom Bekannten ausnüchtern lassen und später wieder vorbeischauen', 'Mit dem Patienten an die frische Luft gehen, bis sich der Kreislauf stabilisiert'],
      explanation: 'Alkoholverdacht darf nie zu einem Notfall übersehen führen. Immer messen und EKG schreiben.',
    },
    {
      afterMeasurements: 2,
      text: 'Der Puls fällt auf 28/min, {name} wird bewusstlos.',
      options: ['Schwere Bradykardie: Pads, Atropin oder Schrittmacher nach SOP, Notarzt sofort, Reanimation bei Stillstand', 'Den Patienten aufsetzen und ihm gut zureden, damit sich der Puls wieder erholt', 'Wasser ins Gesicht spritzen, um den Kreislauf anzuregen und den Patienten zu wecken'],
      explanation: 'Ein AV-Block kann zum Herzstillstand führen. Schrittmacher und Medikamente.',
    },
    {
      afterMeasurements: 3,
      text: 'Auf dem Monitor erscheint Kammerflimmern.',
      options: ['Sofort defibrillieren und Herzdruckmassage, Notarzt, Reanimation nach Algorithmus', 'Weiter beobachten, ob der Rhythmus sich von selbst wieder stabilisiert', 'Die Pads wieder abnehmen, weil sie die Brust beim Beobachten stören'],
      explanation: 'Kammerflimmern ist ein Herzstillstand. Schnelle Defibrillation rettet Leben.',
    },
  ],
  'eug-urlaub': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Der Ehemann sagt: „Das sind nur die Tage, sie hat immer so Schmerzen. Wir wollen nicht ins Krankenhaus.“ Petra schüttelt schwach den Kopf.',
      options: ['Respektvoll aufklären: Schockzeichen, Dringlichkeit, Entscheidung zum Transport, Notarzt einbinden', 'Akzeptieren und gehen, denn der Wunsch der Patientin und ihres Mannes zählt zuerst', 'Den Mann anschreien, dass er jetzt vernünftig sein und die Patientin sofort gehen lassen soll'],
      explanation: 'Der Zustand ist lebensbedrohlich. Verständlich erklären und Zustimmung gewinnen.',
    },
    {
      afterMeasurements: 2,
      text: 'Der Blutdruck von {name} fällt auf 60/40, {name} verliert das Bewusstsein.',
      options: ['Schock: Atemweg, Sauerstoff, Schocklage, zwei Zugänge, Volumen, Notarzt sofort', 'Die Patientin aufsetzen, damit sie besser Luft bekommt und der Bauch entlastet wird', 'Eine Wärmflasche auf den Bauch legen und abwarten, bis die Schmerzen nachlassen'],
      explanation: 'Das ist ein hämorrhagischer Schock durch innere Blutung. Sofort OP nötig.',
    },
    {
      art: 'zeit',
      afterMeasurements: 3,
      text: 'Das Hotel liegt in der Altstadt, die Straße ist wegen eines Umzugs gesperrt. Der RTW kommt nicht bis zum Eingang.',
      options: ['Trage/Tragetuch nutzen, Ordnungskräfte zur Hilfe, Weg freimachen lassen, parallel Klinik voranmelden', 'Warten, bis die Straße wieder frei ist, und die Patientin bis dahin im Zimmer lassen', 'Die Patientin selbst zum Fahrzeug laufen lassen, obwohl sie kaum noch stehen kann'],
      explanation: 'Der Zugang muss organisiert werden. Hilfe holen, parallel vorbereiten und Zeit sparen.',
    },
  ],
  'tauchen-pass': [
    {
      afterMeasurements: 1,
      text: '{name} bekommt plötzlich Sehstörungen und Gleichgewichtsprobleme.',
      options: ['Dekompressionskrankheit der Hirnregion: hochdosiert Sauerstoff, flach, Notarzt sofort, Druckkammer anfragen', 'Weiter nach oben zur Passhöhe fahren, damit die Luft dünner wird und der Druck nachlässt', 'Etwas Alkohol trinken lassen, damit die Gefäße sich weiten und die Symptome abklingen'],
      explanation: 'Gasblasen im Gehirn verursachen schwere Ausfälle. Sauerstoff und Druckkammer.',
    },
    {
      art: 'zeit',
      afterMeasurements: 2,
      text: 'Die nächste Druckkammer ist 200 km entfernt, der Hubschrauber würde auf 2000 m fliegen müssen.',
      options: ['Mit Notarzt und Leitstelle abstimmen: Hubschrauber mit niedriger Flughöhe/Rettungswagen-Alternativen, Druckkammer vorinformieren', 'Den Hubschrauber ohne Rücksprache in großer Höhe fliegen lassen, damit es schneller geht', 'Zu Hause abwarten, bis die Beschwerden nachlassen, und erst dann die Druckkammer anfragen'],
      explanation: 'Höhe verschlimmert die Dekompressionskrankheit. Flughöhe und Transportart mit Fachleuten abstimmen.',
    },
    {
      afterMeasurements: 3,
      text: '{name} bekommt Atemnot und Brustschmerzen, die Sättigung fällt.',
      options: ['Sauerstoff hochdosiert, flach, Atemweg überwachen, Notarzt, Lungenbeteiligung (Chokes) beachten', 'Aufstehen und ein paar Schritte laufen lassen, damit der Kreislauf wieder in Gang kommt', 'Wasser trinken lassen und den Verlauf in Ruhe beobachten, bevor man handelt'],
      explanation: 'Gasblasen in der Lunge (Chokes) sind ein Notfall. Sauerstoff und Druckkammer.',
    },
  ],
  'entzug-delir': [
    {
      art: 'gefahr',
      afterMeasurements: 1,
      text: '{name} greift plötzlich nach einem Küchenmesser und ruft: „Die Spinnen kommen!“',
      options: ['Sofort Abstand, Eigenschutz, ruhig sprechen, Polizei nachfordern, Raum verlassen und sichern', 'Das Messer an sich nehmen und den Patienten dabei fest ansehen und beruhigen', 'Den Patienten anschreien, damit er sofort aufhört und wieder zu sich kommt'],
      explanation: 'Gefährdete Retter helfen niemandem. Eigenschutz, Polizei rufen und deeskalieren.',
    },
    {
      afterMeasurements: 2,
      text: '{name} bekommt einen Krampfanfall.',
      options: ['Schutz vor Verletzungen, Zeit stoppen, Atemweg, Notarzt: Medikament nach SOP', 'Den Patienten festhalten und ihm einen Beißkeil zwischen die Zähne schieben', 'Ein Glas Alkohol geben, damit sich das Nervensystem beruhigt und der Krampf endet'],
      explanation: 'Im Entzug können Krampfanfälle auftreten. Schutz, Atemweg, Medikamente.',
    },
    {
      afterMeasurements: 3,
      text: 'Die Temperatur steigt auf 39,8 °C, der Puls rast auf 150/min, {name} ist kaum erweckbar.',
      options: ['Lebensbedrohliches Delir: kühlen, Zugang, Volumen, Monitoring, Notarzt, Intensivstation voranmelden', 'Den Patienten schlafen lassen, damit sich der Körper erholt und das Fieber sinkt', 'Ein Glas Alkohol geben, damit der Entzug gemildert wird und der Patient ruhiger wird'],
      explanation: 'Ein schweres Delir ist lebensgefährlich. Intensive Überwachung in der Klinik.',
    },
  ],
  'knopfzelle-fernbedienung': [
    {
      art: 'umfeld',
      afterMeasurements: 1,
      text: 'Die Mutter sagt: „Sie wirkt doch fit, sie hat nur Speichel, wir fahren morgen zur Kinderärztin.“',
      options: ['Dringlichkeit erklären: Batterie verätzt innerhalb von Stunden, sofort Klinik, Mutter mitnehmen', 'Der Mutter zustimmen und am nächsten Morgen zur Kinderärztin gehen', 'Der Mutter Vorwürfe machen, dass sie nicht besser auf die Batterien aufgepasst hat'],
      explanation: 'Das Kind wirkt gesund, aber die Batterie verursacht schwere Schäden. Respektvoll erklären.',
    },
    {
      afterMeasurements: 2,
      text: 'Das Kind erbricht und hat blutigen Speichel.',
      options: ['Atemweg freihalten, Seitenlage, absaugen, Notarzt, sofort in die Kinderklinik', 'Wasser nachgeben, damit die Batterie in den Magen rutscht, und das Kind weiter beobachten', 'Abwarten, bis sich der Speichelfluss beruhigt, und die Familie nach Hause schicken'],
      explanation: 'Blutiger Speichel und Erbrechen zeigen Schleimhautverletzung. Sofortige Behandlung.',
    },
    {
      art: 'team',
      afterMeasurements: 3,
      text: 'Die Klinik fragt: „Welcher Batterietyp? Wann verschluckt? Röntgen vorher?“',
      options: ['Verpackung/Typ nennen, Zeitpunkt, Symptome, Maßnahmen strukturiert übergeben', 'Keine Angaben machen, weil die Klinik ohnehin selbst alles röntgt und überprüft', 'Den Batterietyp raten und die Verschluckzeit ungefähr schätzen, damit es schneller geht'],
      explanation: 'Gute Informationen beschleunigen die Entfernung der Batterie.',
    },
  ],
};

export const EXTREM_IDS = Object.keys(EXTREM);
