import { Incident } from '../incidents';

/**
 * Zwischenfälle, die zu jeder Lage passen können: nicht der Patient verschlechtert sich,
 * sondern die Umgebung, die Technik, das Team oder die Zeit machen Probleme.
 * Die erste Option ist immer die richtige; im Spiel wird gemischt.
 */
export const ZF_ALLGEMEIN: Incident[] = [
  {
    art: 'gefahr',
    afterMeasurements: 1,
    text: 'Auf dem Boden liegt eine frisch benutzte Spritze neben meiner Tasche. Mein Kollege greift gerade danach.',
    options: ['Stopp: nicht anfassen, mit Zange oder im Kanülenabwurfbehälter sichern, Handschuhe tragen', 'Die Kanüle vorsichtig in die Schutzkappe zurückstecken, damit sich niemand daran verletzt', 'Mit der bloßen Hand schnell aufheben und in den normalen Hausmüll werfen'],
    explanation: 'Gebrauchte Kanülen können Krankheiten übertragen. Nie mit bloßen Händen anfassen, nie wieder in die Schutzkappe stecken – direkt in den Abwurfbehälter.',
  },
  {
    art: 'gefahr',
    afterMeasurements: 1,
    text: 'Im Treppenhaus riecht es plötzlich stark nach Gas. Dem Hausmeister wird schwindelig.',
    options: ['Alle sofort ins Freie bringen, nichts einschalten, Feuerwehr nachfordern', 'Kurz das Licht anschalten, um die Quelle des Geruchs zu finden und gezielt zu lüften', 'Erst die Untersuchung in Ruhe beenden und den Geruch später genauer prüfen lassen'],
    explanation: 'Gas kann explodieren. Funken vermeiden (kein Licht, keine Klingel), Menschen retten und Fachleute rufen – Eigenschutz geht vor.',
  },
  {
    art: 'gefahr',
    afterMeasurements: 2,
    text: 'Ein Hund im Garten reißt sich von der Leine los und rennt knurrend auf mein Team zu. Die Besitzerin ruft: „Der beißt nicht!“',
    options: ['Rückzug hinter eine Barriere (Tür, Fahrzeug), Besitzerin bitten, den Hund wegzusperren', 'Den Hund mit der Trage abwehren, die Besitzerin beschwichtigen und weiterarbeiten', 'Dem Hund ruhig in die Augen sehen, langsam auf ihn zugehen und ihn streicheln'],
    explanation: 'Eigenschutz vor Hilfeleistung. Ein verletzter Retter hilft niemandem. Besitzer einbinden, Abstand schaffen, erst dann weiterarbeiten.',
  },
  {
    art: 'gefahr',
    afterMeasurements: 2,
    text: 'Von der Straße her nähert sich ein Auto mit hohem Tempo, der Fahrer hat die Absperrung nicht bemerkt.',
    options: ['Alle sofort aus dem Gefahrenbereich, Warnweste, Warnsignal geben, Polizei nachfordern', 'Weiterarbeiten und darauf vertrauen, dass der Fahrer rechtzeitig bremst und ausweicht', 'Den Patienten allein lassen und winkend auf die Fahrbahn laufen, um das Auto zu stoppen'],
    explanation: 'Die Einsatzstelle muss gesichert sein. Wenn es brenzlig wird, zählt zuerst das eigene Team: raus aus der Gefahr, Warnzeichen geben, Verstärkung rufen.',
  },
  {
    art: 'gefahr',
    afterMeasurements: 2,
    text: 'Ein Nachbar sagt, in der Wohnung nebenan stehe ein Kanister mit unbekannter Chemikalie, es rieche beißend. Meine Augen brennen.',
    options: ['Bereich verlassen, Feuerwehr (Gefahrstoffe) nachfordern, Patient wenn möglich mitnehmen', 'Den Kanister selbst aus der Wohnung tragen, damit der Geruch verschwindet', 'Fenster schließen, einen Mund-Nasen-Schutz anlegen und die Untersuchung unverändert fortsetzen'],
    explanation: 'Unbekannte Stoffe sind eine Sache für die Spezialisten. Brennende Augen sind ein Warnsignal – raus aus dem Raum, Hilfe holen, nicht selbst „aufräumen“.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 1,
    text: 'Ein Angehöriger schreit: „Warum dauert das so lange? Tun Sie endlich was!“ und stellt sich zwischen mich und den Patienten.',
    options: ['Ruhig bleiben, kurz erklären, was ich tue, ihm eine kleine Aufgabe geben', 'Zurückschreien, ihn zur Seite schieben und die Untersuchung unbeirrt fortsetzen', 'Die Behandlung abbrechen und im Fahrzeug auf die Polizei warten'],
    explanation: 'Angehörige haben Angst, keine bösen Absichten. Ruhig, klar und freundlich sprechen und eine Aufgabe geben (z. B. Medikamentenliste holen) beruhigt die Lage.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 1,
    text: 'Vor der Tür sammeln sich Schaulustige und halten ihre Handys hoch, um zu filmen.',
    options: ['Privatsphäre schützen: Tür schließen oder Sichtschutz, Polizei bitten, Platz freizuhalten', 'Weiterarbeiten und die Filmenden einfach ignorieren, es ist ja ein öffentlicher Ort', 'Die Handys der Schaulustigen einsammeln und im Fahrzeug sicherstellen'],
    explanation: 'Patienten haben ein Recht auf Würde und Schutz ihrer Privatsphäre. Sichtschutz herstellen, Polizei um Hilfe bitten – Handys einziehen darf ich nicht.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 2,
    text: 'Der Patient wird ungehalten und ruft: „Ich will nicht ins Krankenhaus, lasst mich in Ruhe!“',
    options: ['Ruhig auf seine Sorgen eingehen, Risiken verständlich erklären, bei Einsichtsfähigkeit seine Entscheidung dokumentieren', 'Ihn gegen seinen Willen festhalten und mit Hilfe der Kollegen in den Rettungswagen tragen', 'Ihn sofort allein lassen und ohne Aufklärung oder Dokumentation abrücken'],
    explanation: 'Wer einsichtsfähig ist, darf Behandlung ablehnen – nach verständlicher Aufklärung über die Risiken. Das wird sauber dokumentiert. Wenn er nicht einsichtsfähig ist, entscheidet das Team mit dem Notarzt.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 2,
    text: 'Eine aufgeregte Person ruft: „Sind Sie überhaupt Arzt?“ und zweifelt laut an der Maßnahme. Kurz darauf mischt sich ein weiterer Angehöriger ein.',
    options: ['Sachlich bleiben, meine Qualifikation nennen, eine Ansprechperson bestimmen und alle anderen aus dem Raum bitten', 'Mich ausführlich rechtfertigen und mit allen Angehörigen lange diskutieren', 'Die Maßnahme abbrechen, bis sich alle beruhigt haben und mir wieder vertrauen'],
    explanation: 'Zu viele Stimmen lenken ab. Eine Kontaktperson festlegen, die anderen freundlich aus dem Raum bitten – so bleibt Ruhe für den Patienten.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 1,
    text: 'Plötzlich fängt ein weiteres Kind im Raum an zu weinen und klammert sich an die Patientin.',
    options: ['Eine Bezugsperson (Nachbar, Angehörige) um Betreuung des Kindes bitten und das Kind kindgerecht beruhigen', 'Das weinende Kind laut zurechtweisen, damit es sofort aufhört und Ruhe einkehrt', 'Das Kind allein ins Nebenzimmer schicken und die Tür hinter ihm schließen'],
    explanation: 'Kinder in Notfallsituationen brauchen jemanden, der sich kümmert. Eine vertraute Person übernimmt, damit ich mich auf den Patienten konzentrieren kann.',
  },
  {
    art: 'technik',
    afterMeasurements: 1,
    text: 'Das EKG-Gerät fällt aus, der Bildschirm bleibt schwarz.',
    options: ['Ruhe bewahren: Puls tasten, Patient genau beobachten, Kollege holt das zweite Gerät oder Ersatzakku', 'Die Behandlung abbrechen, bis das Gerät wieder funktioniert und das EKG neu geschrieben ist', 'Kräftig auf das Gerät schlagen und es ständig neu starten, ohne den Patienten zu beachten'],
    explanation: 'Der Patient darf nicht unbeobachtet sein, wenn Technik versagt. Ich nutze meine Sinne (Puls, Atmung, Haut), und das Team holt Ersatzgeräte.',
  },
  {
    art: 'technik',
    afterMeasurements: 2,
    text: 'Das Pulsoximeter zeigt 72 %, obwohl der Patient rosig aussieht und normal atmet.',
    options: ['Messfehler prüfen: Clip neu anlegen, anderen Finger nehmen, Hände wärmen, Patient klinisch beurteilen', 'Sofort mit der Wiederbelebung beginnen, weil der Wert so niedrig angezeigt wird', 'Den Wert ignorieren und die Messung der Sättigung für den Rest des Einsatzes weglassen'],
    explanation: 'Kalte Finger, Nagellack oder Bewegung verfälschen die Messung. Erst den Patienten ansehen, dann das Gerät – und bei Zweifel neu messen.',
  },
  {
    art: 'technik',
    afterMeasurements: 2,
    text: 'Mitten im Einsatz fällt mein Funkgerät aus. Ich brauche aber dringend den Notarzt.',
    options: ['Mit dem Handy die Leitstelle anrufen (112), meinen Kollegen informieren', 'Den Notarzt für diesen Einsatz weglassen und den Patienten selbst zur Klinik bringen', 'Zum Fahrzeug laufen und nach zehn Minuten wiederkommen, ohne jemanden zu informieren'],
    explanation: 'Für Notfälle gibt es immer einen zweiten Weg: Handy, Fahrzeugfunk, Hilfe durch Kollegen. Information an die Leitstelle darf nie abreißen.',
  },
  {
    art: 'technik',
    afterMeasurements: 1,
    text: 'Bei Dunkelheit fällt in der Wohnung der Strom aus. Ich kann den Patienten kaum noch sehen.',
    options: ['Taschenlampe oder Stirnlampe benutzen, Patient im Blick behalten, Kollegen um zusätzliche Beleuchtung bitten', 'Im Dunkeln weiterarbeiten und alle Maßnahmen nach Gefühl durchführen', 'Den Patienten allein lassen und im Dunkeln den Sicherungskasten im Keller suchen'],
    explanation: 'Gute Sicht ist Voraussetzung für sicheres Arbeiten. Eine Stirnlampe hat jedes Team dabei – und sie lässt beide Hände frei.',
  },
  {
    art: 'technik',
    afterMeasurements: 2,
    text: 'Die Sauerstoffflasche zeigt nur noch einen kleinen Rest an, und der Patient braucht dringend Sauerstoff.',
    options: ['Kollege holt sofort eine volle Flasche, bis dahin sparsam dosieren und Patient engmaschig beobachten', 'Den Sauerstoff abdrehen und abwarten, bis der Patient nicht mehr nach Luft ringt', 'Die Flasche kräftig schütteln und hoffen, dass noch genug Druck anliegt'],
    explanation: 'Die Vorräte im Blick behalten ist Teil guter Vorbereitung. Wenn etwas zur Neige geht, sofort Ersatz holen lassen, nicht erst, wenn nichts mehr kommt.',
  },
  {
    art: 'team',
    afterMeasurements: 1,
    text: 'Mein Kollege will ein Medikament geben, das nicht zur Diagnose passt. Er ist sich sicher.',
    options: ['Freundlich, aber klar nachfragen und das Vier-Augen-Prinzip nutzen: Medikament, Dosis, Indikation laut gegenprüfen', 'Schweigen, der Kollege ist ja erfahrener und wird schon wissen, was er tut', 'Dem Kollegen die Spritze aus der Hand reißen und ihn lautstark zurechtweisen'],
    explanation: 'Fehler passieren jedem. Im Team gilt: sicherheitshalber nachfragen, laut gegenlesen und Bedenken offen aussprechen – ohne Vorwurf.',
  },
  {
    art: 'team',
    afterMeasurements: 2,
    text: 'Der Notarzt trifft ein und fragt: „Was habt ihr? Kurz und knapp!“',
    options: ['Strukturiert übergeben: Name/Alter, Leitsymptom, Befunde und Werte, Maßnahmen, Besonderheiten', 'Alle Messwerte in beliebiger Reihenfolge vorlesen, ohne Zusammenfassung oder Verdachtsdiagnose', 'Sagen: „Schauen Sie selbst nach, alles Weitere steht später im Protokoll.“'],
    explanation: 'Eine kurze, strukturierte Übergabe (z. B. nach dem „SBAR“-Prinzip oder dem Schema xABCDE) spart Zeit und verhindert, dass etwas Wichtiges untergeht.',
  },
  {
    art: 'team',
    afterMeasurements: 2,
    text: 'Mein Kollege wird plötzlich sehr blass und setzt sich hin: Ihm ist übel, er hat den ganzen Tag nichts gegessen.',
    options: ['Kollegen betreuen lassen oder selbst versorgen, Verstärkung nachfordern und den Einsatz neu aufteilen', 'Ignorieren, der Kollege soll sich nicht anstellen und einfach weiterarbeiten', 'Den Einsatz abbrechen und beide Retter fahren ohne Patientenübergabe zurück zur Wache'],
    explanation: 'Auch Retter sind Menschen. Auf Ausfall im Team reagieren: Hilfe holen, Aufgaben neu verteilen. Der Patient wird weiter versorgt.',
  },
  {
    art: 'team',
    afterMeasurements: 1,
    text: 'Ein freiwilliger Ersthelfer kniet bereits beim Patienten und führt Maßnahmen durch, die ich für falsch halte.',
    options: ['Dankbar anerkennen, ruhig übernehmen und dabei sagen, was ich jetzt tue', 'Den Ersthelfer vor allen Leuten korrigieren und zum Gehen auffordern', 'Ihn einfach weitermachen lassen und selbst nur zuschauen'],
    explanation: 'Ersthelfer sind wertvoll. Wertschätzung zeigen, die Lage übernehmen und gleichzeitig verständlich erklären – so bleibt Vertrauen erhalten.',
  },
  {
    art: 'zeit',
    afterMeasurements: 2,
    text: 'Die Leitstelle meldet: „Notarzt ist anderweitig im Einsatz, frühestens in 15 Minuten.“ Mein Patient wird zunehmend instabil.',
    options: ['Nicht warten: Transport vorbereiten, Notarzt auf der Strecke treffen (Rendezvous), Klinik voranmelden', 'Auf den Notarzt warten und den Patienten währenddessen am Einsatzort beobachten', 'Den Patienten ohne Voranmeldung zur nächstbesten Klinik bringen'],
    explanation: 'Bei instabilen Patienten zählt der Zeitgewinn: früh abfahren, den Notarzt unterwegs zusteigen lassen und die Klinik informieren.',
  },
  {
    art: 'zeit',
    afterMeasurements: 2,
    text: 'Ein enger Hausflur und eine steile Treppe: Die Trage passt nicht um die Kurve, der Patient ist aber nicht gehfähig.',
    options: ['Tragetuch oder Tragestuhl nutzen, Feuerwehr zur Tragehilfe nachfordern, Patient gut sichern', 'Den Patienten hochheben und allein die Treppe hinabtragen, das geht am schnellsten', 'Den Patienten im Sitzen die Treppe hinunterrutschen lassen, bis er unten ankommt'],
    explanation: 'Wirbelsäule und Rücken der Retter schützen: Spezialgerät nutzen, Tragehilfe anfordern und den Patienten sicher festschnallen.',
  },
  {
    art: 'zeit',
    afterMeasurements: 3,
    text: 'Zwei Minuten vor Schichtende kommt die nächste Meldung herein, während der aktuelle Patient noch nicht übergeben ist.',
    options: ['Den Patienten fertig übergeben, die Leitstelle über die Lage informieren, den nächsten Einsatz dem freien Team überlassen', 'Den Patienten im Flur abstellen und direkt zum nächsten Einsatz fahren', 'Die Übergabe stark abkürzen, damit die Schicht pünktlich enden kann'],
    explanation: 'Erst die Versorgung ordentlich abschließen. Die Leitstelle disponiert andere Fahrzeuge, wenn mein Team gebunden ist.',
  },
  {
    art: 'gefahr',
    afterMeasurements: 2,
    text: 'Aus der Steckdose neben dem Patienten steigt Rauch auf, es riecht verschmort.',
    options: ['Patient aus dem Bereich bringen, Strom abschalten (Sicherung), nichts nass machen, Feuerwehr nachfordern', 'Mit Wasser aus dem Eimer löschen, bevor sich der Brand ausbreitet', 'Die Steckdose mit der Hand abdecken und den Rauch einfach ausblasen'],
    explanation: 'Elektrobrände nie mit Wasser löschen. Erst den Strom abschalten, dann Menschen in Sicherheit bringen und Hilfe rufen.',
  },
  {
    art: 'umfeld',
    afterMeasurements: 3,
    text: 'Im Nebenraum erleidet ein Angehöriger vor Aufregung einen Schwächeanfall und sinkt zu Boden.',
    options: ['Kurz ansehen, Kollege oder Verstärkung kümmert sich, ich bleibe beim kritischen Patienten, weiteres Team nachfordern', 'Beide Patienten gleichzeitig versorgen und zwischen den Zimmern hin- und herlaufen', 'Den Angehörigen ignorieren, solange der Patient nicht stabil ist, und niemanden informieren'],
    explanation: 'Bei mehreren Betroffenen gilt: Priorisieren (Sichtung), Hilfe nachfordern und dort bleiben, wo die größte Gefahr herrscht.',
  },
];

/**
 * Weitere medizinische Zwischenfälle für die ursprünglichen Einsätze (zusätzlich zu den Zwischenfällen in `incidents.ts`).
 * Schlüssel: Kennung des Einsatzes. Bei jedem Durchgang wird zufällig einer der Zwischenfälle gezogen.
 */
export const ZF_BASIS: Record<string, Incident[]> = {
  stemi: [
    {
      afterMeasurements: 1,
      text: 'Klaus bekommt plötzlich eine Pulsverlangsamung auf 35/min, ihm wird schwarz vor Augen.',
      options: ['Liegend lagern, Monitor und Defibrillator bereit, Notarzt: Atropin bzw. Schrittmacher nach SOP', 'Aufstehen und ein paar Schritte gehen lassen, um den Kreislauf in Schwung zu bringen', 'Mit kaltem Wasser abduschen, damit der Puls wieder anspringt, und weiter beobachten'],
      explanation: 'Bei einem Hinterwandinfarkt kann der Puls stark abfallen. Das ist lebensbedrohlich: Monitor, Notarzt, Medikamente oder Schrittmacher.',
    },
  ],
  hypo: [
    {
      afterMeasurements: 1,
      text: 'Anna wird plötzlich aggressiv, schlägt um sich und will den Raum verlassen.',
      options: ['Ruhig bleiben, Abstand halten, mit Hilfe Zucker verabreichen oder i.v. nach SOP', 'Sie mit Hilfe der Kollegen fixieren und ihr gewaltsam Traubenzucker in den Mund drücken', 'Weggehen lassen, das legt sich von allein, sobald die Aufregung vorbei ist'],
      explanation: 'Unterzucker verändert das Verhalten. Nicht streiten, ruhig sprechen, Gefahr vermeiden. Die schnelle Zuckergabe löst das Problem.',
    },
  ],
  stroke: [
    {
      afterMeasurements: 2,
      text: 'Helga wird plötzlich schlaff auf der gelähmten Seite und reagiert kaum noch auf Ansprache.',
      options: ['Bewusstsein und Atemwege sichern, Seitenlage bei Erbrechen, Notarzt und Zeit zur Klinik verkürzen', 'Aufstehen und ein paar Schritte gehen lassen, damit die Muskeln wieder arbeiten', 'Kaltes Wasser ins Gesicht schütten und kräftig an den Schultern rütteln'],
      explanation: 'Bei fortschreitender Hirnschädigung zählt jede Minute. Atemweg sichern, Notarzt, direkter Transport in eine Stroke Unit.',
    },
  ],
  anaphylaxie: [
    {
      afterMeasurements: 2,
      text: 'Trotz Adrenalin hustet Lukas weiter stark und der Blutdruck fällt erneut.',
      options: ['Zweite Adrenalingabe nach SOP, Volumen, Sauerstoff, Notarzt nachfordern', 'Abwarten, denn das Adrenalin hat ja schon gewirkt und die Wirkung setzt gleich wieder ein', 'Eine Antihistaminikum-Tablette geben und abwarten, bis die Schwellung zurückgeht'],
      explanation: 'Adrenalin kann nach 5–10 Minuten erneut nötig sein. Wiederholen, Volumen geben, Sauerstoff und Notarzt.',
    },
  ],
  asthma: [
    {
      afterMeasurements: 1,
      text: 'Lea fängt an zu weinen und bekommt noch schlechter Luft – ihre Mutter hält die Hand vor ihren Mund.',
      options: ['Beruhigen, Mutter einbinden, Kutschersitz, Sauerstoff und Inhalation nach SOP', 'Der Patientin den Mund zuhalten, damit sie nicht so schnell atmet und hyperventiliert', 'Flach hinlegen und festhalten, bis die Angst nachlässt und sie wieder ruhig atmet'],
      explanation: 'Angst verschlimmert Atemnot. Beruhigung, Sauerstoff und die richtigen Medikamente – keine Gewalt.',
    },
  ],
  sepsis: [
    {
      afterMeasurements: 2,
      text: 'Der Blutdruck fällt weiter, die Haut ist marmoriert, der Patient wird schläfrig.',
      options: ['Zugang und Volumen nach SOP, Notarzt: Katecholamine, Voranmeldung „Sepsis“, zügiger Transport', 'Fiebersenkende Wadenwickel anlegen und den Verlauf in Ruhe weiter beobachten', 'Aufsetzen und reichlich Wasser trinken lassen, damit der Kreislauf wieder stabil wird'],
      explanation: 'Septischer Schock: Volumen, Kreislaufmedikamente, Antibiotika in der Klinik. Der Zeitfaktor entscheidet.',
    },
  ],
  hypothermie: [
    {
      afterMeasurements: 1,
      text: 'Thomas hört auf zu zittern und wirkt auf einmal ganz ruhig und müde.',
      options: ['Alarmzeichen: Kälte erschöpft den Körper – schonend flach lagern, aktiv wärmen, Notarzt, Monitor', 'Das ist ein gutes Zeichen, der Körper erwärmt sich jetzt und braucht nichts weiter', 'Aufstehen lassen, ein heißes Bad vorbereiten und ihn schnell aufwärmen'],
      explanation: 'Wenn das Zittern aufhört, kann die Körpertemperatur gefährlich niedrig sein. Schonend bewegen, wärmen, Rhythmus überwachen.',
    },
  ],
  hitzschlag: [
    {
      afterMeasurements: 2,
      text: 'Der Patient krampft plötzlich, seine Haut ist heiß und trocken.',
      options: ['Vor Verletzungen schützen, aktiv kühlen, Notarzt, Atemwege sichern, Blutzucker messen', 'Den Patienten auf den Kopf stellen, damit das Blut zum Gehirn fließt', 'Warm zudecken, damit er nach dem Krampf nicht auskühlt, und abwarten'],
      explanation: 'Beim Hitzschlag steigt die Körpertemperatur lebensbedrohlich. Aktiv kühlen und Notarzt rufen, Atemwege sichern.',
    },
  ],
  le: [
    {
      afterMeasurements: 2,
      text: 'Die Patientin klagt über starken Schwindel und wird plötzlich bewusstlos. Der Puls ist kaum tastbar.',
      options: ['Atmung prüfen, bei fehlender Atmung Wiederbelebung, AED holen, Notarzt sofort', 'Aufsetzen und ein Glas Wasser geben, damit sie wieder zu sich kommt', 'Abwarten, ob sie von selbst wieder aufwacht, und sie dabei zudecken'],
      explanation: 'Große Lungenembolien können das Herz stoppen. Sofort prüfen, wiederbeleben, Defibrillator, Notarzt.',
    },
  ],
  hyperventilation: [
    {
      afterMeasurements: 1,
      text: 'Die Hände der Patientin verkrampfen sich zu „Pfötchen“, sie bekommt Angst, gleich zu ersticken.',
      options: ['Ruhig und klar anleiten, langsam durch die Nase atmen, Hände ruhig halten und körperliche Ursachen ausschließen', 'Der Patientin eine Plastiktüte vor den Mund halten, bis sie wieder ruhiger atmet', 'Sauerstoff mit hohem Fluss geben und die Atmung sonst nicht weiter beachten'],
      explanation: 'Die Verkrampfung ist harmlos und geht mit der Beruhigung zurück. Tüten sind gefährlich, weil sie den Sauerstoff senken.',
    },
  ],
  krampf: [
    {
      afterMeasurements: 2,
      text: 'Nach dem Anfall bleibt der Patient bewusstlos, atmet flach und blau verfärbt.',
      options: ['Atemwege freimachen, stabile Seitenlage, Sauerstoff, bei Atemstillstand beatmen, Notarzt', 'Den Patienten aufsetzen und ein Glas Wasser geben, damit er wieder zu sich kommt', 'Mit Ohrfeigen aufwecken und laut ansprechen, bis er reagiert und wieder spricht'],
      explanation: 'Nach Krampfanfällen kann die Atmung zusammenbrechen. Atemweg sichern und Sauerstoff geben.',
    },
  ],
  lungenoedem: [
    {
      afterMeasurements: 2,
      text: 'Gisela fängt an, schaumigen, rosa gefärbten Auswurf zu husten.',
      options: ['Sitzend halten (Beine tief), Sauerstoff/CPAP, Notarzt nachfordern, Absaugbereitschaft', 'Flach hinlegen und die Beine hochlagern, damit das Wasser aus der Lunge abfließt', 'Viel zu trinken geben, damit sich der Husten löst und die Atmung leichter wird'],
      explanation: 'Schaumiger Auswurf ist ein Zeichen für ein ausgeprägtes Lungenödem. Sitzen, Sauerstoff, Medikamente durch den Notarzt.',
    },
  ],
  synkope: [
    {
      afterMeasurements: 2,
      text: 'Auf dem Monitor erscheint eine Pause von mehreren Sekunden ohne Herzschlag, dann geht es weiter.',
      options: ['Rhythmusstörung: liegen lassen, Defibrillator-Pads kleben, Notarzt und Klinik mit Monitor-Überwachung', 'Die Pause als Artefakt des Geräts abtun und die Untersuchung unverändert fortsetzen', 'Aufstehen und weiterarbeiten lassen, weil die Kreislaufwerte inzwischen wieder normal sind'],
      explanation: 'Pausen im EKG können gefährliche Rhythmusstörungen anzeigen. Ein Fall für Monitor, Notarzt und Klinik.',
    },
  ],
  fraktur: [
    {
      afterMeasurements: 1,
      text: 'Die Hand des Patienten wird kalt und blass, die Finger kribbeln.',
      options: ['Durchblutung gefährdet: Schiene lockern, DMS neu prüfen, Notarzt, zügiger Transport', 'Die Binde fester ziehen, damit die Schiene besser hält und nicht verrutscht', 'Abwarten und den Arm hochlagern, in der Klinik wird das ohnehin kontrolliert'],
      explanation: 'Wenn Durchblutung, Motorik oder Gefühl fehlen, ist das ein Notfall. Verband lockern, Notarzt informieren, schnell in die Klinik.',
    },
  ],
  verbrennung: [
    {
      afterMeasurements: 2,
      text: 'Tim klagt über Heiserkeit und Husten, im Gesicht sind Rußspuren zu sehen.',
      options: ['Verdacht auf Inhalationstrauma: Sauerstoff, Atemwege beobachten, Notarzt, Klinik mit Brandverletzten-Behandlung', 'Weiterkühlen, den Patienten beruhigen und die Rußspuren nicht weiter beachten', 'Tee trinken lassen, damit sich die Schleimhäute beruhigen und die Heiserkeit nachlässt'],
      explanation: 'Heiserkeit und Ruß im Gesicht deuten auf Verbrennungen der Atemwege. Die Atemwege können zuschwellen – Notarzt sofort.',
    },
  ],
  nierenkolik: [
    {
      afterMeasurements: 2,
      text: 'Die Temperatur steigt auf 39,5 °C, der Patient bekommt Schüttelfrost und fühlt sich sehr krank.',
      options: ['Verdacht auf infizierten Harnstau: Notarzt, Zugang, Klinik mit Urologie voranmelden', 'Eine Fiebertablette geben und den Patienten mit der Empfehlung nach Hause schicken, viel zu trinken', 'Viel Wasser trinken lassen, damit der Stein von selbst abgeht und das Fieber sinkt'],
      explanation: 'Ein Stein mit Infektion kann in eine Sepsis münden. Das ist ein Notfall und gehört sofort in die Klinik.',
    },
  ],
  alkohol: [
    {
      afterMeasurements: 1,
      text: 'Ben wird plötzlich laut, aggressiv und will sich schlagen. Seine Freunde mischen sich ein.',
      options: ['Abstand halten, ruhig sprechen, Eigenschutz beachten, Polizei nachfordern, wenn die Lage kippt', 'Beim Streit mitmachen, den Betrunkenen festhalten und zur Räson bringen', 'Dem Streit seinen Lauf lassen und währenddessen weiter an den Messwerten arbeiten'],
      explanation: 'Betrunkene können unvorhersehbar reagieren. Distanz und Deeskalation, im Zweifel Polizei rufen.',
    },
  ],
  hypertensiv: [
    {
      afterMeasurements: 2,
      text: 'Ingrid klagt plötzlich über einen vernichtenden Kopfschmerz und kann den linken Arm nicht mehr heben.',
      options: ['Verdacht auf Hirnblutung/Schlaganfall: Notarzt, Stroke Unit voranmelden, Oberkörper hoch, Blutdruck nicht überstürzt senken', 'Die doppelte Dosis der Blutdrucktablette geben, damit der Druck schnell sinkt', 'Flach hinlegen und abwarten, ob der Arm sich nach einer Weile wieder bewegt'],
      explanation: 'Neurologische Ausfälle bei hohem Blutdruck sind ein Schlaganfall-Alarm. Zeit zählt.',
    },
  ],
  opioid: [
    {
      afterMeasurements: 2,
      text: 'Nach dem Gegenmittel wird Kevin plötzlich wach, aggressiv und will weglaufen. Er sagt: „Ich brauche keinen Arzt.“',
      options: ['Ruhig reden, Wirkdauer des Gegenmittels erklären (er kann wieder wegdämmern), mit Polizei/Notarzt Abstimmung', 'Ihn gehen lassen, denn mit dem Gegenmittel ist die Gefahr endgültig gebannt', 'Mit Gewalt zurück ins Bett drücken und fixieren, bis er sich beruhigt hat'],
      explanation: 'Naloxon wirkt kürzer als manche Opioide. Der Patient kann wieder bewusstlos werden – er muss überwacht werden, auch gegen den Wunsch, wenn er nicht einsichtsfähig ist.',
    },
  ],
  sht: [
    {
      afterMeasurements: 1,
      text: 'Der Patient fragt zum dritten Mal: „Was ist passiert?“ und erbricht.',
      options: ['Alarmzeichen (Erinnerungslücke, Erbrechen): nicht allein lassen, Klinikabklärung, Überwachung', 'Er ist nur müde und kann nach Hause gehen, die Eltern sollen ihn ins Bett bringen', 'Ihn schlafen lassen und am nächsten Morgen noch einmal nach seinem Befinden fragen'],
      explanation: 'Wiederholtes Fragen und Erbrechen nach Kopfverletzung sind Warnzeichen für eine Hirnblutung. Klinik zur Abklärung.',
    },
  ],
  copd: [
    {
      afterMeasurements: 2,
      text: 'Der Patient wird nach dem Sauerstoff erschreckend müde, die Atemzüge werden flacher.',
      options: ['Sauerstoff-Dosis herunterregeln (Ziel 88–92 %), Patienten wach halten, notfalls beatmen, Notarzt nachfordern', 'Den Sauerstoff weiter hochdrehen, bis die Sättigung auf 100 % steigt', 'Schlafen lassen, die Müdigkeit zeigt, dass sich die Atmung entspannt und beruhigt'],
      explanation: 'Bei COPD kann zu viel Sauerstoff den Atemantrieb dämpfen. Vorsichtig dosieren und überwachen.',
    },
  ],
  co: [
    {
      afterMeasurements: 2,
      text: 'Auch die Frau im Nebenzimmer klagt über Kopfschmerzen und Übelkeit und ist verwirrt.',
      options: ['Weitere Betroffene ebenfalls ins Freie bringen, Sauerstoff, weitere Rettungsmittel und Feuerwehr nachfordern', 'Nichts unternehmen, sie hat nur Kopfschmerzen und braucht höchstens eine Tablette', 'Das Zimmer lüften, die Fenster öffnen und die Untersuchung fortsetzen'],
      explanation: 'CO betrifft immer alle im Raum. Alle Personen suchen, retten, mit Sauerstoff versorgen und Hilfe nachfordern.',
    },
  ],
  ketoazidose: [
    {
      afterMeasurements: 2,
      text: 'Paula atmet immer tiefer und schneller und wird schläfrig. Der Atem riecht nach Aceton.',
      options: ['Bewusstsein und Atemwege überwachen, Zugang, Infusion nach SOP, Notarzt, zügiger Transport', 'Traubenzucker oder Cola geben, damit der Zucker wieder steigt und der Kreislauf anspringt', 'Insulin spritzen, damit die Atmung wieder ruhiger wird, und abwarten'],
      explanation: 'Die tiefe Atmung ist der Versuch des Körpers, Säuren abzuatmen. Das Koma droht – Infusion und Klinik.',
    },
  ],
  pneumothorax: [
    {
      afterMeasurements: 3,
      text: 'Die Atemgeräusche rechts sind verschwunden, der Patient wird blau und bewusstlos.',
      options: ['Sofort Notarzt: Entlastungspunktion, Beatmungsbereitschaft, Reanimation falls Kreislaufstillstand', 'Die Sauerstoffmaske abnehmen, weil sie die Atmung zusätzlich erschwert, und beobachten', 'Aufsetzen lassen und warten, bis sich der Druck im Brustkorb von allein löst'],
      explanation: 'Beim Spannungspneumothorax kann das Herz stehen bleiben. Entlastung rettet das Leben.',
    },
  ],
  fieberkrampf: [
    {
      afterMeasurements: 1,
      text: 'Die Eltern sind panisch und wollen Leonie in die kalte Dusche halten.',
      options: ['Ruhig stoppen, erklären, Seitenlage, Kleidung lockern, Fieber messen, Notarzt nachfordern', 'Die Eltern machen lassen und bei der kalten Dusche zusehen, bis das Fieber sinkt', 'Das Kind in dicke Decken wickeln, damit es warm bleibt, und abwarten'],
      explanation: 'Kaltes Wasser bringt das Kind in Gefahr. Ruhe, Seitenlage und Abklärung in der Klinik.',
    },
  ],
  pseudokrupp: [
    {
      afterMeasurements: 1,
      text: 'Paul bekommt Panik, die Atemzüge werden pfeifend, die Lippen blau.',
      options: ['Kind auf dem Schoß der Mutter beruhigen, Sauerstoff, Notarzt nachfordern, Medikamente nach SOP', 'Mit dem Spatel in den Mund schauen, um den Rachen genau zu beurteilen', 'Das Kind von der Mutter trennen und flach hinlegen, damit es besser atmet'],
      explanation: 'Stridor und Blauverfärbung zeigen höchste Atemnot. Ruhe, Sauerstoff, Medikamente (z. B. Adrenalin zum Inhalieren) nach SOP.',
    },
  ],
  aspiration: [
    {
      afterMeasurements: 1,
      text: 'Mia hustet nicht mehr kräftig, nur noch leise, sie wird blass.',
      options: ['5 Schläge auf den Rücken, bei Bewusstlosigkeit Reanimation, Notarzt nachfordern', 'Wasser nachgeben, damit der Fremdkörper nach unten rutscht, und beobachten', 'Warten, bis das Kind wieder hustet, und es dabei auf dem Arm halten'],
      explanation: 'Schwacher Husten ist ein Warnzeichen. Jetzt gilt: Rückenschläge, dann bei Bewusstlosigkeit mit der Wiederbelebung beginnen.',
    },
  ],
  exsikkose: [
    {
      afterMeasurements: 1,
      text: 'Emil ist kaum noch ansprechbar, die Augen liegen tief, die Haut steht in Falten.',
      options: ['Alarmzeichen für schwere Austrocknung: Notarzt, Zugang, Flüssigkeit nach SOP, Wärmeerhalt', 'Löffelchenweise Tee oder Wasser geben, bis das Kind wieder trinkt und munter wird', 'Das Kind schlafen lassen, damit es Kraft sammelt, und später noch einmal nachsehen'],
      explanation: 'Bei sehr schläfrigen Kindern sind Trinken und Warten gefährlich. Infusion durch den Notarzt.',
    },
  ],
};
