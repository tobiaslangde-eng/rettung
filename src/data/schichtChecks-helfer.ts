import { SchichtFrage } from './schichtChecks.types';

/** Schichtmodus: Check-Fragen für Ersthelfer/innen im ehrenamtlichen Sanitäts- und Bereitschaftsdienst */
export const SCHICHT_CHECKS_HELFER: SchichtFrage[] = [
  {
    id: 'helfer-verbandkasten-haltbarkeit',
    frage: 'Du prüfst vor dem Dienst den Verbandkasten. Worauf kommt es besonders an?',
    optionen: [
      'Ablaufdaten prüfen, Abgelaufenes austauschen und Fehlendes auffüllen',
      'Nur nachsehen, ob der Kasten verschlossen ist',
      'Abgelaufene Pflaster sind bestimmt noch gut und bleiben drin',
      'Den Kasten erst nach dem ersten Einsatz prüfen',
    ],
    erklaerung:
      'Material mit abgelaufenem Datum kann unsteril oder unbrauchbar sein. Deshalb prüfst du vor dem Dienst Haltbarkeit und Vollständigkeit.',
  },
  {
    id: 'helfer-handschuhe-vorrat',
    frage: 'Du packst deine Tasche für den Dienst. Welche Handschuhe gehören hinein?',
    optionen: [
      'Einmalhandschuhe in deiner Größe, mit genug Reserve',
      'Nur ein Paar, das du mehrfach benutzt',
      'Stoffhandschuhe aus dem Garten',
      'Keine, Händewaschen reicht immer aus',
    ],
    erklaerung:
      'Einmalhandschuhe schützen dich vor Blut und Körperflüssigkeiten. Du brauchst genug Paare, denn nach jeder Person kommt ein neues Paar.',
  },
  {
    id: 'helfer-handschuhe-wechsel',
    frage: 'Du hast eine blutende Wunde versorgt und gehst gleich zur nächsten Person. Was tust du?',
    optionen: [
      'Handschuhe ausziehen und entsorgen, Hände desinfizieren, neue anziehen',
      'Die Handschuhe weitertragen, sie sind ja noch heil',
      'Die Handschuhe kurz mit Wasser abspülen',
      'Ein zweites Paar über die alten Handschuhe ziehen',
    ],
    erklaerung:
      'Benutzte Handschuhe können Keime auf die nächste Person übertragen. Darum gilt: Handschuhe pro Person wechseln und Hände reinigen.',
  },
  {
    id: 'helfer-rettungsdecke-ersetzen',
    frage: 'Du hast bei einer Person eine Rettungsdecke benutzt. Was gehört in der Pause dazu?',
    optionen: [
      'Neue Rettungsdecke einpacken, damit der Bestand wieder stimmt',
      'Die benutzte Decke falten und wieder einpacken',
      'Nichts, eine Decke fehlt keinem auf',
      'Sie beim nächsten Einsatz wiederverwenden',
    ],
    erklaerung:
      'Rettungsdecken sind Einwegmaterial. Nach dem Einsatz ersetzt du sie, damit beim nächsten Notfall wieder genug da sind.',
  },
  {
    id: 'helfer-schweigepflicht-bekannte',
    frage: 'Nach dem Fest fragt ein Bekannter, wer verletzt war und was passiert ist. Was ist richtig?',
    optionen: [
      'Keine Angaben zu Personen und Verletzungen, du hast Schweigepflicht',
      'Kurz erzählen, wenn er es nicht weitersagt',
      'Es ohne Namen in sozialen Medien posten',
      'Erzählen, es war ja ein öffentliches Fest',
    ],
    erklaerung:
      'Was du bei einem Einsatz über Personen erfährst, ist vertraulich. Das gilt auch gegenüber Freunden und in sozialen Medien.',
  },
  {
    id: 'helfer-protokoll-zeitnah',
    frage: 'Du hast eine Person versorgt. Wann schreibst du das Einsatzprotokoll?',
    optionen: [
      'Möglichst gleich nach dem Einsatz, solange du alles weißt',
      'Am Ende der Woche, wenn Zeit ist',
      'Gar nicht, wenn die Person wieder fit ist',
      'Erst, wenn jemand danach fragt',
    ],
    erklaerung:
      'Zeitnah geschriebene Protokolle sind genauer, weil du dich noch gut erinnerst. Auch kleine Einsätze werden dokumentiert.',
  },
  {
    id: 'helfer-protokoll-inhalt',
    frage: 'Was gehört in jedem Fall in das Einsatzprotokoll?',
    optionen: [
      'Was du vorgefunden, getan und übergeben hast, mit Uhrzeiten',
      'Deine Meinung, wer schuld war',
      'Nur der Name der Person',
      'Nur das verbrauchte Material',
    ],
    erklaerung:
      'Das Protokoll hält sachlich fest, was du gefunden und gemacht hast, und wann. Vermutungen über Schuld gehören nicht hinein.',
  },
  {
    id: 'helfer-aed-check',
    frage: 'Du prüfst vor dem Dienst den AED. Was schaust du dir an?',
    optionen: [
      'Statusanzeige auf bereit, Akku und Elektroden-Pads nicht abgelaufen',
      'Nur, ob das Gehäuse sauber aussieht',
      'Du löst zum Test einen Schock aus',
      'Nichts, ein AED ist ja nur für den Notfall',
    ],
    erklaerung:
      'Ein AED hilft nur, wenn er einsatzbereit ist. Darum prüfst du Statusanzeige, Akku, Pads und das Zubehör vor jedem Dienst.',
  },
  {
    id: 'helfer-aed-pads-abgelaufen',
    frage: 'Beim AED-Check sind die Elektroden-Pads abgelaufen. Was machst du?',
    optionen: [
      'Neue Pads einsetzen und den Austausch dem Verantwortlichen melden',
      'Die alten Pads drin lassen, sie kleben bestimmt noch',
      'Die alten Pads mit Klebeband verstärken',
      'Bis zum Ende der Veranstaltung warten',
    ],
    erklaerung:
      'Abgelaufene Pads kleben oder leiten schlechter und können die Wirkung des Schocks mindern. Tausche sie aus und melde es.',
  },
  {
    id: 'helfer-warnweste',
    frage: 'Du gehst zu einer Einsatzstelle an einer Straße. Was zieht du für deine Sicherheit an?',
    optionen: [
      'Eine Warnweste, damit andere dich früh sehen',
      'Dunkle Kleidung, damit du nicht auffällst',
      'Nichts Besonderes, Hauptsache du bist schnell',
      'Eine Sonnenbrille gegen die Blendung',
    ],
    erklaerung:
      'Warnkleidung macht dich im Straßenverkehr sichtbar. Sie gehört zu deinem Eigenschutz, vor allem bei Dämmerung und Dunkelheit.',
  },
  {
    id: 'helfer-absicherung-strasse',
    frage: 'Die Einsatzstelle liegt an einer befahrenen Straße. Was tust du zuerst?',
    optionen: [
      'Eigenschutz: Stelle absichern, auf Verkehr achten, dann zur Person',
      'Sofort zur Person laufen, Sicherheit kommt später',
      'Auf die Fahrbahn gehen und den Verkehr anhalten',
      'Warten, bis der Verkehr von selbst ruhig wird',
    ],
    erklaerung:
      'Du kannst nur helfen, wenn du selbst sicher bist. Zuerst sicherst du die Stelle ab, dann kümmerst du dich um die Person.',
  },
  {
    id: 'helfer-haendehygiene-nach-einsatz',
    frage: 'Du hast die Handschuhe nach der Versorgung ausgezogen. Was kommt danach?',
    optionen: [
      'Hände desinfizieren oder gründlich waschen',
      'Nichts, die Handschuhe haben ja geschützt',
      'Hände kurz an der Hose abwischen',
      'Hände erst vor dem nächsten Essen reinigen',
    ],
    erklaerung:
      'Beim Ausziehen können Keime an die Haut gelangen. Darum gehört die Händedesinfektion oder das Waschen immer dazu.',
  },
  {
    id: 'helfer-trinken-pausen',
    frage: 'Das Fest dauert viele Stunden bei Hitze. Wie sorgst du für dich?',
    optionen: [
      'Regelmäßig trinken, Pausen und Schatten nutzen',
      'Nicht trinken, damit du nicht zur Toilette musst',
      'Pausen auslassen, denn Helfer müssen immer da sein',
      'Nur trinken, wenn du richtig Durst hast',
    ],
    erklaerung:
      'Wer müde, durstig oder überhitzt ist, macht schneller Fehler. Trinken und Pausen gehören zum Dienst, damit du fit bleibst.',
  },
  {
    id: 'helfer-nachbesprechung-belastend',
    frage: 'Ein Einsatz war sehr belastend, zum Beispiel mit einem verletzten Kind. Was hilft danach?',
    optionen: [
      'Mit dem Team oder der Leitung sprechen, Hilfsangebote nutzen',
      'Alles für sich behalten, sonst wirkst du schwach',
      'Sofort den nächsten Einsatz übernehmen, zur Ablenkung',
      'Die Gefühle mit Alkohol runterspülen',
    ],
    erklaerung:
      'Belastende Einsätze gehen nicht spurlos an dir vorbei. Reden hilft, und viele Organisationen bieten eine Nachbesprechung oder Hilfe an.',
  },
  {
    id: 'helfer-notruf-standortinfo',
    frage: 'Was solltest du bei Dienstbeginn für einen Notruf bereithalten?',
    optionen: [
      'Genauen Standort, Zufahrtswege und einen Treffpunkt für den Rettungsdienst',
      'Nur die Nummer des Veranstalters',
      'Den Namen des Sponsors der Veranstaltung',
      'Nichts, die Leitstelle findet jeden Ort selbst',
    ],
    erklaerung:
      'Der Rettungsdienst muss dich schnell finden. Wenn du Ort, Zufahrt und Treffpunkt kennst, kannst du sie am Telefon klar beschreiben.',
  },
  {
    id: 'helfer-notruf-wann',
    frage: 'Wann rufst du bei einem Einsatz den Rettungsdienst über die 112?',
    optionen: [
      'Bei Lebensgefahr oder Unsicherheit, lieber früh als zu spät',
      'Erst, wenn die Person es ausdrücklich verlangt',
      'Erst, wenn das Protokoll fertig ist',
      'Nie, ihr klärt alles im Team allein',
    ],
    erklaerung:
      'Bei ernsten Beschwerden oder wenn du unsicher bist, ruf die 112. Ein unnötiger Anruf schadet weniger als ein zu später.',
  },
  {
    id: 'helfer-uebergabe-rettungsdienst',
    frage: 'Der Rettungsdienst übernimmt deine Patientin. Wie gelingt die Übergabe?',
    optionen: [
      'Kurz und geordnet: was passiert ist, was du gefunden und getan hast',
      'Du gehst weg, die Profis machen das schon',
      'Du erzählst den ganzen Ablauf des Festes ausführlich',
      'Du nennst nur den Namen der Patientin',
    ],
    erklaerung:
      'Der Rettungsdienst braucht schnell die wichtigsten Informationen. Sag kurz, was passiert ist, was du gesehen und getan hast.',
  },
  {
    id: 'helfer-material-auffuellen',
    frage: 'Nach dem Einsatz fehlen Pflaster und Verbandpäckchen. Was tust du in der Pause?',
    optionen: [
      'Verbrauchtes Material auffüllen und dem Verantwortlichen melden',
      'Warten, bis der Kasten beim nächsten Fest geprüft wird',
      'Nichts, es wird schon reichen',
      'Beim nächsten Einsatz bei anderen Helfern leihen',
    ],
    erklaerung:
      'Nur mit vollständigem Material bist du für den nächsten Notfall bereit. Fülle auf, was du verbraucht hast, und melde es.',
  },
  {
    id: 'helfer-eigene-verletzung',
    frage: 'Du hast dich beim Einsatz an einer Scherbe geschnitten. Was machst du?',
    optionen: [
      'Wunde versorgen, die Leitung informieren und den Vorfall eintragen',
      'Weitermachen, es ist nur ein kleiner Schnitt',
      'Pflaster drauf und nichts melden',
      'Erst nach der Veranstaltung nachsehen',
    ],
    erklaerung:
      'Auch Helfer verletzen sich. Versorge die Wunde und melde den Vorfall, damit er dokumentiert ist und du bei Folgen abgesichert bist.',
  },
  {
    id: 'helfer-abfall-entsorgung',
    frage: 'Wohin kommen benutzte Handschuhe und blutige Verbände nach dem Einsatz?',
    optionen: [
      'In einen verschließbaren Abfallbeutel und nach Vorgabe entsorgen',
      'Auf die Wiese neben der Einsatzstelle',
      'In den Papierkorb am nächsten Stand',
      'Zurück in die Tasche, zum Wiederverwenden',
    ],
    erklaerung:
      'Blutiges Material kann Krankheitserreger enthalten. Es kommt in einen geschlossenen Beutel und wird nach den Vorgaben deines Dienstes entsorgt.',
  },
];
