import { Ablauf } from './schritte';

/** Weitere Abläufe für Ersthelfer/innen */
export const ABLAEUFE_2: Ablauf[] = [
  {
    id: 'verbruehung-kind',
    rolle: 'helfer',
    titel: 'Verbrühung beim Kind versorgen',
    lage: 'In der Küche der Nachbarin hat ein Kleinkind eine Tasse heißen Tee über den Arm gekippt. Es schreit.',
    schritte: [
      'Kind beruhigen und aus der Gefahrenzone nehmen',
      'Nasse Kleidung entfernen, wenn sie nicht festklebt',
      'Arm etwa 10 Minuten mit handwarmem Wasser kühlen',
      'Kind dabei warm halten, nicht auskühlen lassen',
      'Wunde keimfrei und locker abdecken',
      '112 rufen, bei größerer Fläche oder Blasen',
    ],
    erklaerung:
      'Kleine Kinder kühlen schnell aus, deshalb kühlst du nur die betroffene Stelle und nur mit handwarmem Wasser. Eis oder Salben gehören nicht auf die Haut.',
  },
  {
    id: 'nasenbluten',
    rolle: 'helfer',
    titel: 'Nasenbluten stillen',
    lage: 'Im Büro fängt die Nase deines Kollegen plötzlich an zu bluten.',
    schritte: [
      'Ihn hinsetzen und beruhigen',
      'Kopf leicht nach vorn neigen',
      'Nasenflügel etwa 10 Minuten zusammendrücken',
      'Kühlen im Nacken mit einem Tuch',
      'Blut in eine Schale oder ein Tuch laufen lassen',
      'Blutet es länger als 20 Minuten: Arzt oder 112',
    ],
    erklaerung:
      'Der Kopf geht nach vorn, damit kein Blut in den Rachen läuft. Nach hinten gebeugt würde er es schlucken und sich übergeben.',
  },
  {
    id: 'zahnunfall',
    rolle: 'helfer',
    titel: 'Zahnunfall: ausgeschlagener Zahn',
    lage: 'Beim Fußballtraining bekommt ein Junge einen Ball ins Gesicht. Ein Zahn liegt auf dem Rasen.',
    schritte: [
      'Ihn beruhigen und den Mund ausspülen lassen',
      'Zahn nur an der Krone anfassen',
      'Zahn in eine Zahnrettungsbox oder in kalte H-Milch legen',
      'Blutende Stelle mit sauberem Tuch abdrücken',
      'Sofort zur Zahnärztin oder in die Klinik',
    ],
    erklaerung:
      'Die Wurzel darf nicht berührt oder trocken werden, sonst stirbt sie ab. In der Box oder in H-Milch bleibt der Zahn einige Stunden lebensfähig.',
  },
  {
    id: 'fremdkoerper-auge',
    rolle: 'helfer',
    titel: 'Fremdkörper oder Chemie im Auge',
    lage: 'Im Baumarkt spritzt einer Kundin Reinigungsmittel ins Auge. Sie hält sich die Hand davor.',
    schritte: [
      '112 rufen oder rufen lassen',
      'Kopf zur Seite neigen, betroffenes Auge nach unten',
      'Mit viel Wasser spülen, Wasser läuft vom Auge weg',
      'Lid dabei offen halten, mindestens 10 Minuten',
      'Beide Augen lose mit einem Tuch abdecken',
      'Verpackung des Mittels für den Rettungsdienst aufheben',
    ],
    erklaerung:
      'Bei Chemie zählt jede Sekunde: Je früher und länger du spülst, desto weniger Schaden entsteht. Das gesunde Auge schützt du, indem das Wasser vom Auge wegfließt.',
  },
  {
    id: 'insektenstich-mund',
    rolle: 'helfer',
    titel: 'Insektenstich im Mund',
    lage: 'Auf der Terrasse eines Cafés wurde dein Freund beim Trinken von einer Wespe im Mund gestochen. Er fasst sich an den Hals.',
    schritte: [
      '112 rufen',
      'Eiswürfel oder kaltes Wasser zum Lutschen geben',
      'Hals von außen mit Kühlpack und Tuch kühlen',
      'Aufrecht sitzen lassen, ruhig zureden',
      'Atmung und Schwellung beobachten',
      'Bei Atemnot aufrecht sitzen lassen und bei ihm bleiben',
    ],
    erklaerung:
      'Ein Stich im Mund kann die Atemwege zuschwellen lassen. Deshalb kühlst du von innen und außen und rufst sofort 112 – ohne zu warten, ob es besser wird.',
  },
  {
    id: 'arm-schienen',
    rolle: 'helfer',
    titel: 'Verdacht auf Knochenbruch am Arm',
    lage: 'Eine Radfahrerin ist gestürzt und hält ihren Unterarm. Er ist geschwollen und schmerzt stark.',
    schritte: [
      'Sie beruhigen und hinsetzen lassen',
      'Schmuck und enge Kleidung am Arm vorsichtig entfernen',
      'Arm in der Haltung lassen, in der er am wenigsten schmerzt',
      'Mit Dreiecktuch oder Jacke ruhigstellen',
      'Mit Tuch umwickelt vorsichtig kühlen',
      'Durchblutung der Finger prüfen, 112 rufen',
    ],
    erklaerung:
      'Ein ruhiggestellter Arm tut weniger weh und es entsteht kein weiterer Schaden. Schmuck nimmst du früh ab, weil der Arm anschwillt.',
  },
  {
    id: 'hitzschlag-versorgen',
    rolle: 'helfer',
    titel: 'Hitzschlag versorgen',
    lage: 'Bei einem Open-Air-Konzert bricht ein junger Mann zusammen. Seine Haut ist heiß und trocken, er ist verwirrt.',
    schritte: [
      '112 rufen',
      'In den Schatten oder einen kühlen Ort bringen',
      'Oberkörper leicht erhöht lagern',
      'Enge Kleidung öffnen oder entfernen',
      'Mit feuchten Tüchern und Wind kühlen',
      'Ist er bewusstlos: Atmung prüfen, Seitenlage',
    ],
    erklaerung:
      'Ein Hitzschlag ist ein Notfall: Die Körpertemperatur steigt gefährlich. Kühlen und schneller Notruf gehören zusammen.',
  },
  {
    id: 'unterkuehlung-versorgen',
    rolle: 'helfer',
    titel: 'Unterkühlung versorgen',
    lage: 'Am Badesee findest du einen zitternden, nassen Mann auf der Wiese. Er antwortet nur langsam.',
    schritte: [
      '112 rufen',
      'Möglichst vorsichtig bewegen',
      'Nasse Kleidung entfernen',
      'In Decken und Rettungsdecke einhüllen',
      'Wenn er bei Bewusstsein ist: warme, gezuckerte Getränke',
      'Weiter beobachten, bis der Rettungsdienst da ist',
    ],
    erklaerung:
      'Unterkühlte reagieren empfindlich auf Erschütterungen. Wärme von außen und von innen, aber keine Wärmflasche direkt auf der Haut.',
  },
  {
    id: 'aed-im-team',
    rolle: 'helfer',
    titel: 'Helfer mit dem AED im Team',
    lage: 'Im Fitnessstudio bricht ein Mann zusammen, atmet nicht normal. Fünf Leute stehen um ihn herum.',
    schritte: [
      'Eine Person beginnt sofort mit der Herzdruckmassage',
      'Eine zweite ruft 112',
      'Eine dritte holt den AED',
      'Die Elektroden klebt jemand, während weiter gedrückt wird',
      'Bei der Analyse tritt jeder zurück',
      'Nach dem Schock sofort weiterdrücken, Helfer wechseln',
    ],
    erklaerung:
      'Klare Aufgaben sparen Zeit. Die Herzdruckmassage hört nur kurz auf; der Wechsel alle zwei Minuten hält die Qualität hoch.',
  },
  {
    id: 'erbrechen-kreislauf',
    rolle: 'helfer',
    titel: 'Starkes Erbrechen und Kreislaufprobleme',
    lage: 'Deine Mitbewohnerin hat Magen-Darm-Grippe, erbricht seit Stunden und wird blass und schwach.',
    schritte: [
      'Bequem hinlegen oder hinsetzen lassen',
      'Eimer bereitstellen, Mund vorsichtig reinigen',
      'Ist sie bewusstlos: stabile Seitenlage und 112',
      'Bei Bewusstsein in kleinen Schlucken Wasser oder Tee anbieten',
      'Warm halten und beruhigen',
      'Weiter beobachten, bei Verschlechterung 112 oder Arzt',
    ],
    erklaerung:
      'Wer bewusstlos ist, bekommt nichts zu trinken, sonst droht Ersticken. Bei Bewusstsein ersetzen kleine Schlucke verlorene Flüssigkeit.',
  },
];
