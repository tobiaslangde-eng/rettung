import { SchichtFrage } from './schichtChecks.types';

/** Schichtmodus: Check-Fragen für den Rettungsdienst */
export const SCHICHT_CHECKS_SANI: SchichtFrage[] = [
  {
    id: 'sani-fahrzeugcheck-dienstbeginn',
    frage: 'Dienstbeginn auf der Wache. Wie gehst du beim Fahrzeugcheck vor?',
    optionen: [
      'Nach Checkliste: Zustand, Licht, Reifen, Füllstände und Beladung prüfen',
      'Nur tanken und losfahren',
      'Den Check dem Vorgänger überlassen, er hat ja geprüft',
      'Nur das Blaulicht testen',
    ],
    erklaerung:
      'Der Check zu Dienstbeginn stellt sicher, dass Fahrzeug und Beladung einsatzbereit sind. Verlass dich dabei nicht auf andere, sondern prüfe selbst.',
  },
  {
    id: 'sani-sauerstoff-druck',
    frage: 'Du prüfst die Sauerstoffflasche im Fahrzeug. Was ist wichtig?',
    optionen: [
      'Druck am Manometer prüfen, genug Vorrat und volle Reserveflasche',
      'Nur ansehen, ob die Flasche sauber ist',
      'Das Flaschenventil mit Öl gängig machen',
      'Eine fast leere Flasche bleibt, bis sie leer ist',
    ],
    erklaerung:
      'Sauerstoff muss für den Einsatz sicher reichen. Öl und Fett dürfen nie an Sauerstoffarmaturen, weil sie sich entzünden können.',
  },
  {
    id: 'sani-monitor-defi-check',
    frage: 'Du prüfst den Monitor-Defibrillator. Was gehört dazu?',
    optionen: [
      'Akkustand, Elektroden und Zubehör prüfen, Funktionstest nach Vorgabe',
      'Nur das Gehäuse abwischen',
      'Zum Test einen Schock bei einem Kollegen auslösen',
      'Nichts, das Gerät meldet Fehler sowieso von selbst',
    ],
    erklaerung:
      'Der Defibrillator muss im Notfall sofort funktionieren. Prüfe Akku, Elektroden und Zubehör und führe den vorgeschriebenen Funktionstest durch.',
  },
  {
    id: 'sani-elektroden-abgelaufen',
    frage: 'Beim Check sind die Defi-Klebeelektroden abgelaufen. Was tust du?',
    optionen: [
      'Durch neue ersetzen, bevor das Fahrzeug einsatzbereit gemeldet wird',
      'Sie drin lassen, sie kleben bestimmt noch',
      'Erst nach dem nächsten Einsatz tauschen',
      'Die Ränder mit Klebeband fixieren',
    ],
    erklaerung:
      'Abgelaufene Elektroden haften oder leiten schlechter. Tausche sie vor der Einsatzbereitschaft aus.',
  },
  {
    id: 'sani-funkgeraet',
    frage: 'Zu Dienstbeginn: Was prüfst du am Funkgerät?',
    optionen: [
      'Akku geladen, Funkprobe gemacht, richtig eingestellt',
      'Nur die Lautstärke auf Maximum',
      'Nichts, die Leitstelle meldet sich bei Problemen',
      'Ob das Gerät eine Schutzhülle hat',
    ],
    erklaerung:
      'Ohne funktionierenden Funk bist du von der Leitstelle abgeschnitten. Mit einer Funkprobe weißt du gleich, ob alles geht.',
  },
  {
    id: 'sani-material-auffuellen',
    frage: 'Nach dem Einsatz fehlt Verbrauchsmaterial im Fahrzeug. Wann füllst du auf?',
    optionen: [
      'Möglichst sofort, damit das Fahrzeug wieder einsatzbereit ist',
      'Zum Dienstende, bis dahin fehlt es eben',
      'Erst, wenn die Leitstelle es verlangt',
      'Das macht der nächste Dienst',
    ],
    erklaerung:
      'Der nächste Alarm kann sofort kommen. Mit sofort aufgefülltem Material bist du für den nächsten Einsatz bereit.',
  },
  {
    id: 'sani-trage-wischdesinfektion',
    frage: 'Ein Patient lag auf der Trage, nichts Auffälliges. Was geschieht mit der Trage?',
    optionen: [
      'Auflage wechseln, Kontaktflächen wischdesinfizieren nach Hygieneplan',
      'Nur das Laken wechseln, die Oberflächen bleiben',
      'Mit einem trockenen Tuch abwischen',
      'Nur desinfizieren, wenn sichtbar Blut dran ist',
    ],
    erklaerung:
      'Keime sind oft unsichtbar. Darum werden Kontaktflächen nach jedem Patienten nach Hygieneplan wischdesinfiziert.',
  },
  {
    id: 'sani-haendedesinfektion',
    frage: 'Wann desinfizierst du deine Hände im Dienst?',
    optionen: [
      'Vor und nach Patientenkontakt und nach dem Ausziehen der Handschuhe',
      'Nur am Dienstende',
      'Nur, wenn sie sichtbar schmutzig sind',
      'Nur nach Kontakt mit ansteckenden Patienten',
    ],
    erklaerung:
      'Die Händedesinfektion ist die wichtigste Hygienemaßnahme. Sie schützt dich und deine Patienten und gilt bei jedem Kontakt.',
  },
  {
    id: 'sani-nadelstichverletzung',
    frage: 'Du hast dich nach dem Einsatz an einer gebrauchten Kanüle gestochen. Was tust du?',
    optionen: [
      'Blutung fördern, desinfizieren, Leitung informieren, ärztlich vorstellen',
      'Pflaster drauf und weiterarbeiten',
      'Die Wunde fest zudrücken, damit kein Blut austritt',
      'Nach dem Dienstende erwähnen',
    ],
    erklaerung:
      'Eine Nadelstichverletzung ist ein Arbeitsunfall mit Infektionsrisiko. Sofort versorgen, melden und ärztlich vorstellen, damit nichts übersehen wird.',
  },
  {
    id: 'sani-kanuele-entsorgung',
    frage: 'Wohin kommt eine gebrauchte Kanüle?',
    optionen: [
      'Sofort in den stichfesten Abwurfbehälter, ohne Kappe aufzustecken',
      'Wieder auf die Kappe stecken, dann in den Müll',
      'In den normalen Restmüll im Fahrzeug',
      'Zurück in die Notfalltasche',
    ],
    erklaerung:
      'Das Zurückstecken der Kappe verursacht viele Stichverletzungen. Scharfe Gegenstände gehören sofort in einen stichfesten Behälter.',
  },
  {
    id: 'sani-betaeubungsmittel-grundsatz',
    frage: 'Wie gehst du mit Betäubungsmitteln im Dienst grundsätzlich um?',
    optionen: [
      'Gesichert verschlossen aufbewahren, jede Entnahme und Abgabe dokumentieren',
      'Offen im Fach, damit sie schnell greifbar sind',
      'Nur große Mengen dokumentieren',
      'Dokumentation später aus dem Gedächtnis',
    ],
    erklaerung:
      'Betäubungsmittel unterliegen strengen Regeln. Sie sind gesichert zu verwahren, und jeder Verbleib muss lückenlos dokumentiert werden.',
  },
  {
    id: 'sani-protokoll-vollstaendig',
    frage: 'Der Patient ist übergeben. Was gilt für das Einsatzprotokoll?',
    optionen: [
      'Vollständig, nachvollziehbar und zeitnah ausfüllen',
      'Nur Stichworte, Details merkt man sich',
      'Am Schichtende für alle Einsätze zusammen',
      'Unangenehme Maßnahmen weglassen',
    ],
    erklaerung:
      'Das Protokoll ist die Grundlage für Weiterbehandlung und rechtliche Nachweise. Es muss vollständig, ehrlich und zeitnah sein.',
  },
  {
    id: 'sani-uebergabe-strukturiert',
    frage: 'Du übergibst deinen Patienten in der Klinik. Wie machst du das gut?',
    optionen: [
      'Strukturiert und kurz nach festem Schema, zum Beispiel SBAR',
      'Erst warten, bis alle Zeit haben, dann ausführlich erzählen',
      'Nur Name und Alter nennen',
      'Das Protokoll hinlegen und wortlos gehen',
    ],
    erklaerung:
      'Eine strukturierte Übergabe verhindert, dass wichtige Informationen verloren gehen. Ein festes Schema wie SBAR hilft dabei.',
  },
  {
    id: 'sani-status-leitstelle',
    frage: 'Du bist fertig und das Fahrzeug ist bereit. Was meldest du der Leitstelle?',
    optionen: [
      'Den Status ändern und einsatzbereit melden, sobald du wirklich bereit bist',
      'Nichts, die Leitstelle sieht das ohnehin',
      'Einsatzbereit melden, auch wenn noch Material fehlt',
      'Erst melden, wenn du wieder auf der Wache bist',
    ],
    erklaerung:
      'Die Leitstelle plant mit deinem Status. Melde dich einsatzbereit, wenn du es wirklich bist, sonst fehlt das Fahrzeug im Notfall.',
  },
  {
    id: 'sani-selbstfuersorge-nachsorge',
    frage: 'Nach einem schweren Kindernotfall geht es dir schlecht. Was ist richtig?',
    optionen: [
      'Mit Kollegen sprechen und Nachsorgeangebote des Dienstes nutzen',
      'Weitermachen und nicht darüber reden',
      'Es allein mit dir ausmachen',
      'Dich dafür schämen, das ist schwach',
    ],
    erklaerung:
      'Belastende Einsätze sind normal und keine Schwäche. Gespräche und die psychosoziale Nachsorge für Einsatzkräfte schützen deine Gesundheit.',
  },
  {
    id: 'sani-eigenschutz-einsatzstelle',
    frage: 'Alarm: bewusstlose Person, vor Ort aggressive Menschen. Wie schützt du dich?',
    optionen: [
      'Auf Gefahren achten, sicher warten und die Polizei nachfordern',
      'Trotzdem sofort allein hineingehen',
      'Die Leute beruhigen, die Polizei stört nur',
      'Die Ausrüstung im Fahrzeug lassen, das geht schneller',
    ],
    erklaerung:
      'Dein Eigenschutz geht vor. An einer unsicheren Einsatzstelle wartest du an einem sicheren Ort, bis die Polizei die Lage gesichert hat.',
  },
  {
    id: 'sani-infektionsverdacht-schutz',
    frage: 'Ein Patient hat Verdacht auf eine ansteckende Krankheit. Wie schützt du dich?',
    optionen: [
      'Passende Schutzausrüstung nach Hygieneplan, Klinik vorab informieren',
      'Normale Handschuhe reichen immer',
      'Die Klinik nicht informieren, um Panik zu vermeiden',
      'Schutz ist nur für den Fahrer nötig',
    ],
    erklaerung:
      'Bei Infektionsverdacht trägst du die vorgeschriebene Schutzausrüstung. Die Klinik wird vorher informiert, damit sie sich vorbereiten kann.',
  },
  {
    id: 'sani-schlussdesinfektion',
    frage: 'Nach einem Einsatz mit ansteckendem Patienten: Was geschieht mit dem Fahrzeug?',
    optionen: [
      'Schlussdesinfektion nach Hygieneplan, danach erst einsatzbereit melden',
      'Kurz durchlüften reicht aus',
      'Nur den Boden fegen',
      'Am nächsten Tag desinfizieren',
    ],
    erklaerung:
      'Nach infektiösen Patienten reicht eine normale Reinigung nicht. Die Schlussdesinfektion schützt Patienten und Kollegen vor Ansteckung.',
  },
  {
    id: 'sani-muedigkeit-pause',
    frage: 'Nach einer langen Nacht mit vielen Einsätzen bist du sehr müde. Was ist richtig?',
    optionen: [
      'Pausen nutzen, essen und trinken, Müdigkeit ansprechen',
      'Weiterfahren, Einsatzfahrten gehen vor',
      'Kaffee ersetzt jede Pause',
      'Müdigkeit verschweigen, das gehört dazu',
    ],
    erklaerung:
      'Müdigkeit erhöht das Risiko für Fehler und Unfälle. Pausen und ehrliches Ansprechen gehören zur Sicherheit für dich und andere.',
  },
  {
    id: 'sani-geraetemangel-melden',
    frage: 'Beim Check fällt ein defektes Gerät auf. Was tust du?',
    optionen: [
      'Mangel melden und dokumentieren, Ersatz holen, bevor das Fahrzeug fährt',
      'Nicht erwähnen, es wird schon gehen',
      'Dem nächsten Dienst überlassen',
      'Erst melden, wenn es im Einsatz ausfällt',
    ],
    erklaerung:
      'Ein defektes Gerät kann im Einsatz Leben gefährden. Mängel meldest du sofort, dokumentierst sie und sorgst für Ersatz.',
  },
];
