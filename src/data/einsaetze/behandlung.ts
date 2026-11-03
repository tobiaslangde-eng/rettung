/**
 * Behandlungs-Auswahl für die Einsätze, die aus den Detektiv-Akten entstehen.
 * Je Krankheitsbild drei richtige und drei falsche Maßnahmen; für Sonderfälle gibt es Einzel-Listen (BEHANDLUNG_FALL).
 * Die Texte sind so formuliert, dass sie zu allen Akten des Krankheitsbilds passen.
 */
export interface Behandlung {
  richtig: [string, string, string];
  falsch: [string, string, string];
}

export const BEHANDLUNG: Record<string, Behandlung> = {
  vhf: {
    richtig: ['Monitor und 12-Kanal-EKG, Puls und Blutdruck engmaschig kontrollieren', 'Beruhigen, sitzend oder halb sitzend lagern, Sauerstoff nach Bedarf', 'Notarzt nachfordern und in eine Klinik mit Monitorüberwachung bringen'],
    falsch: ['Den Patienten Treppen steigen lassen, um den Puls zu „sortieren“', 'Mit kaltem Wasser ins Gesicht den Puls beruhigen', 'Alkohol zur Beruhigung geben'],
  },
  aorta: {
    richtig: ['Strikte Ruhe, flach oder halb sitzend, jede Anstrengung vermeiden', 'Blutdruck an beiden Armen messen, Notarzt nachfordern', 'Schonend und zügig in eine Klinik mit Gefäßchirurgie, Voranmeldung'],
    falsch: ['Den Patienten zum Fahrzeug laufen lassen', 'Blutverdünnende Medikamente geben', 'Den Rücken kräftig massieren'],
  },
  ags: {
    richtig: ['12-Kanal-EKG schreiben und mit dem Notarzt besprechen', 'Oberkörper hoch lagern, körperliche Ruhe, Monitor', 'Zugang legen und in eine Klinik mit Herzkatheter transportieren'],
    falsch: ['Nach Hause schicken, weil das EKG „unauffällig“ aussieht', 'Den Patienten zu Fuß zum Auto gehen lassen', 'Schmerzen mit einer Tablette bagatellisieren und abwarten'],
  },
  brady: {
    richtig: ['Monitor, 12-Kanal-EKG, Pads für Defibrillator/Schrittmacher kleben', 'Flach lagern, Sauerstoff, Zugang legen', 'Notarzt nachfordern: Atropin oder Schrittmacher nach SOP, Klinik mit Monitor'],
    falsch: ['Aufstehen und weitergehen lassen', 'Gartenarbeit erlauben, „das legt sich“', 'Schnell etwas Starkes zu trinken geben'],
  },
  hyperkali: {
    richtig: ['EKG-Monitor anlegen, auf Rhythmusstörungen achten', 'Notarzt nachfordern: Kalzium und Insulin/Glukose nach SOP', 'Zügiger Transport in die Klinik (Dialyse), Voranmeldung'],
    falsch: ['Viel Kaliumreiches (Bananen, Saft) zu essen geben', 'Zum Dialysezentrum mit dem Taxi schicken', 'Abwarten, bis die Schwäche vorbeigeht'],
  },
  spontanptx: {
    richtig: ['Sitzend lagern, Sauerstoff geben, Atmung und Kreislauf überwachen', 'Auf Verschlechterung achten (Atemnot, Blutdruckabfall) und Notarzt informieren', 'Klinik mit Röntgen und Thoraxdrainage ansteuern'],
    falsch: ['Den Brustkorb fest bandagieren', 'Mit dem Fahrrad nach Hause fahren lassen', 'Eine Rauchpause erlauben, „dann entspannt er sich“'],
  },
  pneumonie: {
    richtig: ['Sauerstoff geben, Vitalwerte und Temperatur kontrollieren', 'Oberkörper hoch lagern, Flüssigkeit nach SOP', 'In die Klinik transportieren, Verdacht auf Lungenentzündung/Sepsis voranmelden'],
    falsch: ['Hustenstiller und Kamillentee, abwarten', 'Fieber senken und im Bett lassen', 'Die Verwirrtheit auf das Alter schieben'],
  },
  bolus: {
    richtig: ['Bei kräftigem Husten zum Weiterhusten auffordern und beobachten', 'Bei Schwächerwerden 5 Schläge zwischen die Schulterblätter, danach bis zu 5 Heimlich-Griffe', 'Bei Bewusstlosigkeit sofort Wiederbelebung, Notarzt nachfordern'],
    falsch: ['Wasser nachtrinken lassen', 'Blind mit dem Finger im Rachen suchen', 'Den Betroffenen zurück zum Tisch begleiten und weiteressen lassen'],
  },
  panik: {
    richtig: ['Ruhig und sicher sprechen, zusammen langsam atmen', 'Körperliche Ursachen ausschließen (EKG, SpO₂, Blutzucker)', 'Bei Besserung Nachsorge anbieten, bei Zweifel Klinik'],
    falsch: ['In eine Tüte atmen lassen', 'Laut sagen: „Stellen Sie sich nicht so an!“', 'Beruhigungsmittel von Umstehenden einnehmen lassen'],
  },
  rauchgas: {
    richtig: ['Hochdosiert Sauerstoff geben, trotz guter SpO₂-Anzeige', 'Atemwege eng überwachen (Heiserkeit, Stridor), Notarzt nachfordern', 'In eine Klinik mit Intensivstation, bei Verdacht Druckkammer/Brandverletzten-Zentrum'],
    falsch: ['Der normalen Sättigung vertrauen, kein Sauerstoff nötig', 'Zum Aufwärmen in den Rettungswagen setzen und ruhen lassen', 'Rußspuren abwaschen und nach Hause schicken'],
  },
  tia: {
    richtig: ['BE-FAST-Test, genauen Symptombeginn und Medikamente erfragen', 'Blutzucker und EKG, Notarzt/Stroke Unit voranmelden', 'Auch bei verschwundenen Symptomen in die Klinik bringen'],
    falsch: ['Nach Hause schicken, weil alles wieder gut ist', 'Aspirin ohne ärztliche Anweisung geben', 'Termin beim Hausarzt in der nächsten Woche empfehlen'],
  },
  sab: {
    richtig: ['Oberkörper 30° hoch, Ruhe, Reizabschirmung', 'Bewusstsein und Pupillen engmaschig kontrollieren, Notarzt nachfordern', 'Zügig in ein Zentrum mit Neurochirurgie, Voranmeldung'],
    falsch: ['Kopfschmerztablette geben und beobachten', 'Aufstehen und Kaffee trinken lassen', 'Flach hinlegen und Beine hoch'],
  },
  meningitis: {
    richtig: ['Eigenschutz: Mund-Nasen-Schutz, Handschuhe', 'Sauerstoff, Vitalwerte, Zugang und Notarzt nachfordern', 'Voranmeldung „Verdacht Meningitis“, zügiger Transport'],
    falsch: ['Auf Nackensteife warten, bevor man handelt', 'Fiebersenkende Wadenwickel und abwarten', 'Mit anderen Wohnungsgästen im selben Raum lassen, ohne Schutz'],
  },
  migraene: {
    richtig: ['Neurologische Ausfälle prüfen (BE-FAST), Blutzucker messen', 'Ruhe, abgedunkelter Raum, bei Übelkeit Seitenlage', 'Schmerz- und Übelkeitsmittel nach SOP, Abklärung bei untypischem Verlauf'],
    falsch: ['Alle Ausfälle als „nur Migräne“ abtun', 'Alkohol zur Entspannung', 'Das Gesicht laut anschreien, damit er wach bleibt'],
  },
  lagerung: {
    richtig: ['Schlaganfall und Herzprobleme ausschließen (BE-FAST, Blutzucker, EKG)', 'Bequem lagern, Kopf ruhig halten, Eimer bereitstellen', 'Bei sicherer Einschätzung Anleitung zu den Lagerungsmanövern, Hausarzt'],
    falsch: ['Den Kopf kräftig rütteln', 'Aufstehen und herumlaufen lassen', 'Alles auf „nur Schwindel“ schieben, ohne zu messen'],
  },
  delir: {
    richtig: ['Ruhig sprechen, Orientierung geben, Sicherheit herstellen', 'Blutzucker, Temperatur, Puls und Sättigung messen, Infekt vermuten', 'Zügige Klinikbehandlung, Begleitperson mitnehmen'],
    falsch: ['Anbinden und fixieren', 'Auf „Demenz“ tippen und im Heim lassen', 'Laut anschreien und diskutieren'],
  },
  belastung: {
    richtig: ['Ruhig und zugewandt sprechen, Schutz vor Schaulustigen', 'Körperliche Ursachen ausschließen (Puls, RR, SpO₂)', 'Bezugsperson einbinden, Notfallseelsorge/Krisenhilfe anbieten'],
    falsch: ['Sagen: „Das ist doch nicht so schlimm“', 'Zur Ablenkung ausfragen und Details abfragen', 'Allein lassen, bis es von selbst vorbeigeht'],
  },
  entzug: {
    richtig: ['Notarzt nachfordern, Krampfgefahr beachten, Blutzucker messen', 'Ruhige, reizarme Umgebung, Eigenschutz im Blick behalten', 'Überwachung mit Monitor, Transport in die Klinik'],
    falsch: ['Zur Beruhigung ein Glas Alkohol geben', 'Mit dem Patienten diskutieren, dass die „Spinnen“ nicht existieren', 'Allein lassen und später wieder nachsehen'],
  },
  blinddarm: {
    richtig: ['Nüchtern lassen, bequeme Lage (Knie anziehen), Schmerz und Temperatur dokumentieren', 'Vitalwerte kontrollieren, Zugang nach SOP', 'In die chirurgische Klinik bringen'],
    falsch: ['Eine Wärmflasche auf den Bauch legen', 'Abführmittel geben', 'Bauch kräftig kneten, bis er „locker wird“'],
  },
  galle: {
    richtig: ['Bequem lagern, Schmerz bewerten, Vitalwerte messen', 'Nüchtern lassen, Notarzt/Schmerztherapie nach SOP', 'Transport in die Klinik (Ultraschall, Chirurgie/Innere)'],
    falsch: ['Fettes Essen zum „Ausspülen“ geben', 'Die Schmerzen mit Schnaps bekämpfen', 'Nach Hause schicken, weil „nur Gallenblase“'],
  },
  ileus: {
    richtig: ['Nüchtern lassen, bei Erbrechen Seitenlage und Absaugbereitschaft', 'Zugang und Volumen nach SOP, Vitalwerte überwachen', 'Zügig in die Klinik (Chirurgie), Voranmeldung'],
    falsch: ['Abführmittel oder Einlauf geben', 'Zum Trinken drängen, damit „es wieder läuft“', 'Beobachten bis zum nächsten Tag'],
  },
  gastro: {
    richtig: ['Ausreichend (kleine Schlucke) trinken lassen, wenn wach und schluckfähig', 'Bei Kreislaufproblemen flach lagern und Zugang nach SOP', 'Hygiene beachten (Handschuhe, Desinfektion), bei Alarmzeichen in die Klinik'],
    falsch: ['Antibiotika von Angehörigen weitergeben', 'Starke Schmerzmittel gegen Bauchkrämpfe ohne Anordnung', 'Nüchtern lassen und kein Wasser mehr anbieten'],
  },
  pyelo: {
    richtig: ['Vitalwerte und Temperatur messen, auf Sepsiszeichen achten', 'Zugang und Volumen nach SOP, Schmerz- und Fiebertherapie durch Notarzt', 'Transport in die Klinik (Urologie/Innere)'],
    falsch: ['Viel Kaffee trinken lassen', 'Wärmflasche und abwarten', 'Antibiotikum aus der Hausapotheke einnehmen lassen'],
  },
  gib: {
    richtig: ['Flach lagern, Wärmeerhalt, Sauerstoff', 'Zugang(e) legen, Volumen nach SOP, Notarzt nachfordern', 'Schneller Transport in eine Klinik mit Endoskopie'],
    falsch: ['Etwas zu trinken oder zu essen geben', 'Aufsitzen und zum Fahrzeug laufen lassen', 'Das Erbrochene wegspülen und nicht beachten'],
  },
  hoden: {
    richtig: ['Sofort in die Klinik (Urologie), jede Stunde zählt', 'Nüchtern lassen, Schmerztherapie nach SOP', 'Vitalwerte kontrollieren, Eltern/Begleiter einbinden'],
    falsch: ['Abwarten, ob der Schmerz am Morgen besser ist', 'Eisbeutel und zu Hause lassen', 'Den Hoden selbst „zurückdrehen“'],
  },
  oberschenkelhals: {
    richtig: ['Bein in vorgefundener Stellung lagern und polstern, nicht bewegen', 'Schmerztherapie nach SOP, Vitalwerte, Wärmeerhalt', 'Schonend umlagern (Vakuummatratze/Schaufeltrage), Transport in die Klinik'],
    falsch: ['Aufstehen und Gehen versuchen lassen', 'Das Bein gerade ziehen', 'Mit dem Taxi in die Klinik schicken'],
  },
  sprunggelenk: {
    richtig: ['PECH: Ruhigstellen, Kühlen, Hochlagern, bei Bedarf Schiene', 'DMS prüfen (Durchblutung, Motorik, Sensibilität)', 'Zur Röntgenabklärung in die Klinik'],
    falsch: ['Weiterlaufen lassen, „der Schmerz geht weg“', 'Das Gelenk kräftig durchbewegen', 'Wärmesalbe und Sauna'],
  },
  schulterluxation: {
    richtig: ['Arm in Schonhaltung lagern (Dreieckstuch), nicht einrenken', 'DMS prüfen und dokumentieren, Schmerztherapie nach SOP', 'In die Klinik zur Reposition und Röntgen'],
    falsch: ['Die Schulter selbst einrenken', 'Arm kräftig bewegen und „einhängen“', 'Mit Schlinge nach Hause schicken, ohne Abklärung'],
  },
  rippen: {
    richtig: ['Sitzend/halb sitzend lagern, Sauerstoff, Schmerztherapie nach SOP', 'Atmung und SpO₂ überwachen, auf Pneumothorax achten', 'In die Klinik zum Röntgen/CT'],
    falsch: ['Brustkorb fest bandagieren', 'Flach hinlegen', 'Starke Hustenmittel geben und nach Hause schicken'],
  },
  wirbelsaeule: {
    richtig: ['Kopf in Neutralstellung halten (manuelle Immobilisation), Halskrause nach SOP', 'Patient achsengerecht bewegen, Vakuummatratze/Schaufeltrage, Wärmeerhalt', 'Notarzt nachfordern, Traumazentrum/Wirbelsäulenzentrum voranmelden'],
    falsch: ['Aufsetzen lassen, „damit er besser Luft bekommt“', 'Zum Fahrzeug gehen lassen', 'Kopf und Hals durchbewegen, um Schmerzen zu testen'],
  },
  schwersht: {
    richtig: ['Atemwege sichern, Sauerstoff, Halswirbelsäule schützen', 'Bewusstsein und Pupillen engmaschig kontrollieren, Notarzt nachfordern', 'Zielklinik mit Neurochirurgie voranmelden, Oberkörper leicht erhöht'],
    falsch: ['Schlafen lassen und morgen nachsehen', 'Schmerzmittel geben und ohne Kontrolle nach Hause schicken', 'Beobachten, ob sich die Pupillen „von selbst“ angleichen'],
  },
  blutung: {
    richtig: ['Eigenschutz (Handschuhe), Druckverband oder direkter Druck', 'Bei lebensbedrohlicher Extremitätenblutung Tourniquet nach Anleitung, Zeit notieren', 'Schocklage/Wärmeerhalt, Notarzt nachfordern, Traumazentrum'],
    falsch: ['Verband abnehmen, um nachzusehen', 'Wunde auswaschen und warten', 'Nur ein Pflaster aufkleben'],
  },
  amputation: {
    richtig: ['Blutung stoppen (Druckverband), Stumpf steril abdecken', 'Amputat feucht eingewickelt in einen Beutel, diesen in kaltes Wasser/Eis (nicht direkt auf Eis)', 'Klinik mit Replantationsmöglichkeit voranmelden, Schmerztherapie'],
    falsch: ['Das Amputat direkt in Eiswürfel legen', 'Das Amputat zu Hause lassen', 'Den Stumpf unverbunden hochhalten'],
  },
  stich: {
    richtig: ['Eigenschutz/Freigabe der Polizei, Fremdkörper nicht entfernen', 'Fremdkörper polstern und fixieren, Wunden steril abdecken (Brust: dreiseitig verklebter Verband/Ventilpflaster)', 'Notarzt nachfordern, Traumazentrum voranmelden'],
    falsch: ['Den Gegenstand sofort herausziehen', 'Die Wunde ausspülen und zukleben', 'Den Patienten zum Fahrzeug laufen lassen'],
  },
  poly: {
    richtig: ['Eigenschutz und Absicherung, xABCDE-Schema, Blutungen sofort stillen', 'Wirbelsäulenschutz, Wärmeerhalt, Schockbehandlung', 'Notarzt/Hubschrauber nachfordern, Traumazentrum voranmelden, wenig Zeit am Unfallort'],
    falsch: ['Den Patienten schnell herausziehen, ohne Absprache', 'Etwas zu trinken geben', 'Nur das fehlgestellte Bein schienen und alles andere übersehen'],
  },
  strom: {
    richtig: ['Eigenschutz: Stromquelle sicher abschalten, erst dann an den Patienten', 'Monitor/EKG anlegen, Brandwunden steril abdecken', 'Auch bei Beschwerdefreiheit in die Klinik zur Überwachung'],
    falsch: ['Den Patienten bei Stromfluss anfassen', 'Nach Hause schicken, weil er wieder wach ist', 'Brandwunden mit Salbe bestreichen'],
  },
  ertrinken: {
    richtig: ['Eigenschutz, Rettung aus dem Wasser, Atemwege freimachen', 'Bei fehlender Atmung 5 Beatmungen, dann Herzdruckmassage/Reanimation', 'Sauerstoff, Wärmeerhalt, nasse Kleidung entfernen, Notarzt und Klinik (auch wenn er „fit“ wirkt)'],
    falsch: ['Den Patienten kopfüber halten, damit das Wasser ausläuft', 'Auf den Bauch drücken, um Wasser zu entfernen', 'Nach Hause schicken, weil er wieder spricht'],
  },
  verbruehung: {
    richtig: ['Kleidung (sofern nicht festklebend) entfernen, mit lauwarmem Wasser kurz kühlen', 'Steril und locker abdecken, Auskühlen vermeiden (bei Kindern besonders)', 'Schmerztherapie nach SOP, bei größeren Flächen Klinik/Verbrennungszentrum'],
    falsch: ['Eiswasser oder Eiswürfel auf die Haut', 'Mehl, Öl oder Zahnpasta auftragen', 'Blasen aufstechen'],
  },
  biss: {
    richtig: ['Blutung stillen, Wunde steril abdecken', 'Tetanus-Schutz und Tollwut-Risiko klären, Halterdaten notieren', 'Bei Gesichts- oder tiefen Wunden in die Klinik'],
    falsch: ['Wunde mit Desinfektionsmittel einreiben und zukleben', 'Den Hund fangen und festhalten', 'Auf keinen Fall zum Arzt, „war ja nur ein Kratzer“'],
  },
  augen: {
    richtig: ['Bei Chemikalien sofort ausgiebig mit Wasser spülen (mehrere Minuten)', 'Bei Fremdkörpern beide Augen abdecken, nicht reiben oder entfernen', 'In die Augenklinik, Substanz/Verpackung mitnehmen'],
    falsch: ['Das Auge reiben', 'Fremdkörper mit der Pinzette entfernen', 'Augentropfen aus der Hausapotheke einträufeln und abwarten'],
  },
  kopfplatz: {
    richtig: ['Blutung stillen: sterile Kompresse, Druck, Kopfverband', 'Auf Bewusstsein, Erbrechen, Pupillen achten (Kopfverletzung nicht unterschätzen)', 'Bei Blutverdünnern: Klinik zur Abklärung'],
    falsch: ['Wunde offen lassen und abwarten', 'Hausmittel (Mehl, Spinnweben) auflegen', 'Bei Blutverdünnern nach Hause schicken'],
  },
  hitzeerschoepfung: {
    richtig: ['In den Schatten bringen, hinlegen, Beine hoch, Kleidung öffnen', 'Kühl halten, in kleinen Schlucken trinken lassen, Blutzucker messen', 'Bei Verwirrtheit oder sehr hoher Temperatur Notarzt (Verdacht Hitzschlag)'],
    falsch: ['Weiterarbeiten lassen', 'Ein kaltes Bier zum Kühlen geben', 'In die pralle Sonne zurückschicken'],
  },
  tauchen: {
    richtig: ['Hochdosiert Sauerstoff geben (möglichst dicht schließende Maske)', 'Flach lagern, Wärmeerhalt, neurologische Ausfälle dokumentieren', 'Notarzt nachfordern, Transport in ein Zentrum mit Druckkammer (ohne Höhengewinn)'],
    falsch: ['Zur Beruhigung nochmals ins Wasser schicken', 'Durch Bewegung „aus dem Körper schwitzen“', 'Alkohol gegen die Schmerzen'],
  },
  angio: {
    richtig: ['Atemwege im Blick halten, aufrecht sitzen lassen, Sauerstoff', 'Notarzt nachfordern, Notfallmedikamente nach SOP vorbereiten', 'Zügiger Transport mit Voranmeldung, Intubationsbereitschaft'],
    falsch: ['Flach hinlegen', 'Zungenpflaster oder Eisbonbons geben', 'Nach Hause schicken, „wird schon abschwellen“'],
  },
  tabletten: {
    richtig: ['Verpackungen, Medikamentenliste und Einnahmezeit sichern', 'Vitalwerte und EKG überwachen, Notarzt nachfordern', 'Giftinformationszentrum konsultieren, Klinik mit Monitor'],
    falsch: ['Erbrechen auslösen', 'Milch trinken lassen', 'Zu Hause lassen, „die Wirkung lässt nach“'],
  },
  pilz: {
    richtig: ['Reste, Putzabfälle und Bild des Pilzes sichern', 'Giftinformationszentrum anrufen, Vitalwerte überwachen', 'Auch bei späten Beschwerden zügig in die Klinik'],
    falsch: ['Erbrechen auslösen, Milch trinken lassen', 'Die Pilzreste wegwerfen', 'Abwarten, ob es besser wird'],
  },
  drogen: {
    richtig: ['Eigenschutz, ruhige Umgebung, Reizabschirmung', 'Temperatur kühlen (Überhitzungsgefahr), Flüssigkeit, Monitor, Blutzucker', 'Notarzt nachfordern, Klinik mit Überwachung'],
    falsch: ['Weitertanzen lassen', 'Alkohol zum „Runterkommen“ geben', 'Mit Gewalt festhalten'],
  },
  bronchiolitis: {
    richtig: ['Kind aufrecht halten, Nase frei machen, Sauerstoff nach Bedarf', 'Atemfrequenz, SpO₂ und Trinkverhalten überwachen', 'Zügig in die Kinderklinik, Eltern mitnehmen'],
    falsch: ['Hustensaft geben', 'Kind flach hinlegen', 'Nase mit Wattestäbchen tief ausputzen'],
  },
  knopfzelle: {
    richtig: ['Nichts essen oder trinken lassen, kein Erbrechen auslösen', 'Verpackung/Gerät und Batterietyp mitnehmen, Notarzt nachfordern', 'Sofort in die Kinderklinik (Röntgen, Endoskopie), Zeitpunkt notieren'],
    falsch: ['Mit viel Wasser „durchspülen“', 'Abwarten, bis die Batterie auf natürlichem Wege abgeht', 'Mit dem Finger im Rachen nach der Batterie suchen'],
  },
  invagination: {
    richtig: ['Kind in bequemer Lage lassen, Vitalwerte und Schmerzepisoden dokumentieren', 'Zugang nach SOP, Flüssigkeit, Notarzt bei Schock', 'Sofort in die Kinderklinik (Ultraschall, Kinderchirurgie)'],
    falsch: ['Abführzäpfchen geben', 'Zu Hause abwarten und beobachten', 'Etwas zu essen geben'],
  },
  kindvergiftung: {
    richtig: ['Verpackung/Substanz sichern, Giftinformationszentrum anrufen', 'Vitalwerte und Bewusstsein überwachen, Atemwege sichern', 'Kein Erbrechen auslösen, Notarzt nachfordern, Kinderklinik'],
    falsch: ['Erbrechen auslösen oder Salzwasser trinken lassen', 'Milch trinken lassen', 'Ohne Rücksprache zu Hause lassen'],
  },
  geburt: {
    richtig: ['Ruhe bewahren, Intimsphäre schützen, Wärme (Decken, Heizung), Unterlage', 'Kopf nur stützen, nicht ziehen; Mutter zum Hecheln anleiten', 'Notarzt/Kinderarzt nachfordern, Neugeborenes abtrocknen und warm halten, Klinik'],
    falsch: ['Das Kind am Kopf ziehen', 'Die Nabelschnur sofort durchschneiden', 'Die Presswehen verbieten und die Beine zusammendrücken'],
  },
  eklampsie: {
    richtig: ['Linksseitenlage, Ruhe, ruhige und abgedunkelte Umgebung', 'Blutdruck engmaschig messen, Notarzt nachfordern (Magnesium nach SOP)', 'Klinik mit Geburtshilfe voranmelden'],
    falsch: ['Kopfschmerztablette und nach Hause schicken', 'Auf den Rücken legen', 'Beißkeil zwischen die Zähne'],
  },
  eug: {
    richtig: ['Flach lagern, Beine hoch (Schocklage), Wärmeerhalt, Sauerstoff', 'Zugang, Volumen nach SOP, Notarzt nachfordern', 'Sofort in eine Klinik mit Gynäkologie und OP-Bereitschaft, Voranmeldung'],
    falsch: ['Nach Hause schicken, „Periodenschmerzen“', 'Wärmflasche auf den Bauch', 'Aufstehen und Treppensteigen zum Fahrzeug'],
  },
};

/**
 * Einzel-Listen für Akten, deren Lage von der üblichen Behandlung des Krankheitsbilds abweicht.
 * Schlüssel: Kennung der Akte.
 */
export const BEHANDLUNG_FALL: Record<string, Behandlung> = {
  'stemi-brady': {
    richtig: ['12-Kanal-EKG schreiben, Pads kleben, Monitor und Defibrillator bereit', 'Flach lagern, Sauerstoff nach Bedarf, Notarzt nachfordern (Atropin/Schrittmacher nach SOP)', 'Zügig in eine Klinik mit Herzkatheter, Voranmeldung „Hinterwandinfarkt mit AV-Block“'],
    falsch: ['Frische Luft und Wasser, „der hat zu viel getrunken“', 'Aufstehen und heimfahren lassen', 'Auf den Notarzt warten, ohne EKG zu schreiben'],
  },
  'krampf-status': {
    richtig: ['Atemwege freihalten, Sauerstoff, Verletzungen verhindern', 'Notarzt nachfordern: krampfdurchbrechendes Medikament nach SOP, Zeit notieren', 'Blutzucker messen, nach dem Anfall stabile Seitenlage, zügig in die Kinderklinik/Klinik'],
    falsch: ['Arme und Beine festhalten', 'Etwas zwischen die Zähne schieben', 'Abwarten, bis es von selbst aufhört'],
  },
  'ertrinken-pool': {
    richtig: ['Kind in Seitenlage halten, Atemwege freimachen, Sauerstoff mit hohem Fluss', 'Nass entkleiden, warm einpacken, Absaugbereitschaft, Atmung kontrollieren', 'Notarzt nachfordern, Kinderklinik/Intensivstation voranmelden'],
    falsch: ['Kind schütteln, um Wasser zu entfernen', 'Kind mit heißem Wasser aufwärmen', 'Zu Hause beobachten, „es atmet ja wieder“'],
  },
  'geburt-wohnung': {
    richtig: ['Ruhe, Wärme, Intimsphäre; Wehenabstände und Presswehen erfragen', 'Auf Zeichen der Geburt achten (Druck, sichtbarer Kopf), Geburtsset vorbereiten', 'Notarzt nachfordern und Transport in die Geburtsklinik, wenn kein Pressdrang'],
    falsch: ['Die Frau zum Fahrzeug laufen lassen, obwohl der Kopf sichtbar ist', 'Zum Pressen anweisen, bevor der Muttermund offen ist', 'Eine Kopfschmerztablette geben und warten'],
  },
  'eklampsie-krampf': {
    richtig: ['Vor Verletzungen schützen, Linksseitenlage, Atemwege freihalten', 'Sauerstoff, Blutdruck, Blutzucker, Notarzt nachfordern (Magnesium nach SOP)', 'Zügig in die Klinik mit Geburtshilfe und Kinderklinik, Voranmeldung'],
    falsch: ['Beißkeil in den Mund', 'Die Schwangere auf den Rücken legen', 'Nach Hause schicken, wenn der Anfall vorbei ist'],
  },
  'tauchen-ostsee': {
    richtig: ['Hochdosiert Sauerstoff, flach lagern, Wärmeerhalt', 'Tauchprofil und Tauchzeiten erfragen, Notarzt nachfordern', 'Transport in ein Zentrum mit Druckkammer, Tauchcomputer mitnehmen'],
    falsch: ['Nochmals tauchen, „um den Druck auszugleichen“', 'Schnaps zum Aufwärmen', 'Zu Hause ausruhen und am nächsten Tag zum Arzt'],
  },
  'blutung-glas': {
    richtig: ['Eigenschutz: Handschuhe, Blutstillung mit Druckverband, Arm hochhalten', 'Auf Schockzeichen achten, Wärmeerhalt, Vitalwerte messen', 'In die Klinik zur Wundversorgung, Tetanus klären'],
    falsch: ['Verband abnehmen, um die Wunde zu kontrollieren', 'Wunde mit Alkohol auswaschen und offen lassen', 'Nur ein Pflaster aufkleben'],
  },
  'strom-kind': {
    richtig: ['Stromquelle sicher abschalten (Sicherung), erst dann an das Kind', 'Monitor/EKG, Verbrennungen im Mundbereich abdecken, Atemwege beobachten', 'Notarzt nachfordern, Kinderklinik zur Überwachung'],
    falsch: ['Das Kind sofort anfassen, ohne den Strom abzuschalten', 'Mit Hausmitteln im Mund behandeln', 'Zu Hause beobachten, wenn das Kind wieder spielt'],
  },
  'asthma-silent': {
    richtig: ['Aufrecht sitzen lassen, hochdosiert Sauerstoff, Monitor', 'Notarzt sofort nachfordern, inhalative Medikamente nach SOP', 'Beatmungsbereitschaft, Voranmeldung Klinik mit Intensivstation'],
    falsch: ['Flach hinlegen und beruhigen', 'In eine Tüte atmen lassen', 'Auf „Ruhe“ vertrauen, weil das Pfeifen weg ist'],
  },
};
