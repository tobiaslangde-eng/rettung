/** Handgriff-Labor: Übungen, in denen man Schritt für Schritt wählt, tippt oder gedrückt hält */
export type LaborSzeneId = 'bewusstsein' | 'verbrennung' | 'schlinge' | 'verschlucken' | 'tourniquet' | 'decke';

export interface LaborOption {
  icon: string;
  label: string;
  richtig?: boolean;
  /** Warum diese Antwort nicht stimmt (nur bei falschen Optionen) */
  warum?: string;
}

interface Basis {
  text: string;
  /** Rückmeldung, wenn der Schritt geschafft ist */
  gut: string;
}
export type LaborSchritt =
  | (Basis & { art: 'waehle'; optionen: LaborOption[] })
  | (Basis & { art: 'zaehle'; knopf: string; anzahl: number })
  | (Basis & { art: 'halte'; knopf: string; sekunden: number });

export interface LaborUebung {
  id: string;
  icon: string;
  titel: string;
  sub: string;
  szene: LaborSzeneId;
  schritte: LaborSchritt[];
  /** Merksatz am Ende */
  merke: string;
}

const r = (icon: string, label: string): LaborOption => ({ icon, label, richtig: true });
const f = (icon: string, label: string, warum: string): LaborOption => ({ icon, label, warum });

export const LABOR_UEBUNGEN: LaborUebung[] = [
  {
    id: 'bewusstsein',
    icon: '👀',
    titel: 'Bewusstsein & Atmung prüfen',
    sub: 'Ansprechen, rütteln, Atmung prüfen – und dann?',
    szene: 'bewusstsein',
    merke: 'Reagiert nicht und atmet nicht normal: Notruf 112 und sofort drücken.',
    schritte: [
      {
        art: 'waehle',
        text: 'Jemand liegt regungslos am Boden. Die Stelle ist sicher. Was tust du zuerst?',
        gut: 'Laut ansprechen und kräftig an den Schultern rütteln: So merkst du, ob die Person reagiert.',
        optionen: [
          r('🗣️', 'Laut ansprechen und an den Schultern rütteln'),
          f(
            '💦',
            'Kaltes Wasser ins Gesicht schütten',
            'Das ist unnötig und kann die Person gefährden. Sprich sie laut an und rüttle an den Schultern.',
          ),
          f('🚶', 'Weitergehen, es hilft sicher schon jemand', 'Wegsehen kostet Leben. Du bist jetzt gefragt.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Die Person reagiert nicht. Was machst du als Nächstes?',
        gut: 'Laut um Hilfe rufen: Umstehende können den Notruf wählen und einen Defibrillator holen.',
        optionen: [
          r('📣', 'Laut um Hilfe rufen'),
          f('🤫', 'Allein weiter versuchen, ohne jemanden zu rufen', 'Allein verlierst du Zeit. Rufe laut um Hilfe.'),
          f('🛏️', 'Sofort in die stabile Seitenlage drehen', 'Erst musst du prüfen, ob die Person normal atmet.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Jetzt prüfst du die Atmung. Wie öffnest du die Atemwege?',
        gut: 'Kopf in den Nacken, Kinn anheben: So wird die Zunge von den Atemwegen weggezogen.',
        optionen: [
          r('🙆', 'Kopf überstrecken und Kinn anheben'),
          f('🙇', 'Kopf nach vorn beugen', 'Dann können die Atemwege verlegt werden.'),
          f('🛌', 'Ein Kissen unter den Kopf legen', 'Das knickt die Atemwege ab. Der Kopf soll überstreckt sein.'),
        ],
      },
      {
        art: 'halte',
        text: 'Schau, hör und fühl nach Atmung – höchstens 10 Sekunden. Halte den Knopf gedrückt.',
        gut: 'Hebt sich der Brustkorb, hörst und spürst du Atem? Länger als 10 Sekunden sollst du nicht prüfen.',
        knopf: '👀 Atmung prüfen (gedrückt halten)',
        sekunden: 10,
      },
      {
        art: 'waehle',
        text: 'Du siehst keine normale Atmung. Was tust du?',
        gut: 'Notruf 112 und sofort Herzdruckmassage. Ein Defi hilft zusätzlich, sobald er da ist.',
        optionen: [
          r('☎️', 'Notruf 112 und sofort mit der Herzdruckmassage beginnen'),
          f('🛌', 'Stabile Seitenlage', 'Die Seitenlage ist nur bei normaler Atmung richtig.'),
          f('⏳', 'Noch eine Minute abwarten', 'Jede Minute ohne Herzdruckmassage senkt die Überlebenschance.'),
        ],
      },
    ],
  },
  {
    id: 'verbrennung',
    icon: '🔥',
    titel: 'Verbrennung versorgen',
    sub: 'Kühlen, abdecken, richtig entscheiden',
    szene: 'verbrennung',
    merke: 'Kühlen, keimfrei abdecken. Bei großer Fläche, Gesicht oder Kindern: 112.',
    schritte: [
      {
        art: 'waehle',
        text: 'Jemand hat sich den Unterarm mit heißem Wasser verbrüht. Was tust du sofort?',
        gut: 'Fließendes, kühles Wasser lindert den Schmerz und begrenzt den Schaden.',
        optionen: [
          r('🚰', 'Mit kühlem (nicht eiskaltem) Wasser kühlen'),
          f('🧊', 'Eiswürfel direkt auf die Haut legen', 'Eis kann die Haut zusätzlich schädigen. Nimm kühles Wasser.'),
          f(
            '🧴',
            'Brandsalbe, Mehl oder Öl auftragen',
            'Salben, Mehl und Öl halten die Hitze und verkleben die Wunde. Nicht verwenden.',
          ),
        ],
      },
      {
        art: 'waehle',
        text: 'Der Ärmel ist heiß und nass. Wie gehst du mit der Kleidung um?',
        gut: 'Heiße, nasse Kleidung vorsichtig entfernen – aber nichts abreißen, was an der Haut klebt.',
        optionen: [
          r('✂️', 'Vorsichtig entfernen, Festklebendes nicht abreißen'),
          f('🧵', 'Abreißen, auch wenn sie klebt', 'Festklebende Kleidung nie abreißen: Sie reißt die Haut mit ab.'),
          f('👕', 'Alles anlassen, es wird schon abkühlen', 'Heißer, nasser Stoff verbrennt weiter. Entferne ihn vorsichtig.'),
        ],
      },
      {
        art: 'halte',
        text: 'Kühle den Arm unter fließendem Wasser: etwa 10 Minuten (hier im Zeitraffer). Knopf gedrückt halten.',
        gut: 'Etwa 10 Minuten kühlen. Bei großen Flächen nur kurz kühlen und gut zudecken, damit der Körper nicht auskühlt.',
        knopf: '🚰 Kühlen (gedrückt halten)',
        sekunden: 5,
      },
      {
        art: 'waehle',
        text: 'Nach dem Kühlen: Wie deckst du die Wunde ab?',
        gut: 'Keimfrei und locker abdecken schützt vor Keimen, ohne zu drücken.',
        optionen: [
          r('🩹', 'Keimfrei und locker, z. B. mit einem Brandwundenverbandtuch'),
          f('🫧', 'Blasen aufstechen, damit sie besser heilen', 'Blasen sind ein natürlicher Schutz. Niemals aufstechen.'),
          f(
            '🧻',
            'Fest mit Watte umwickeln',
            'Watte fusselt in die Wunde. Nimm keimfreie Wundauflagen oder ein Brandwundentuch.',
          ),
        ],
      },
      {
        art: 'waehle',
        text: 'Wann rufst du unbedingt den Rettungsdienst (112)?',
        gut: 'Bei großer Fläche, im Gesicht, an Händen oder Genitalien, bei Kindern oder tiefen Wunden: 112.',
        optionen: [
          r('🚨', 'Bei großer Fläche, im Gesicht, an Händen, bei Kindern'),
          f(
            '🙂',
            'Nur wenn die Person laut jammert',
            'Der Schmerz sagt nicht, wie schwer die Verbrennung ist. Tiefe Verbrennungen tun oft wenig weh.',
          ),
          f('📅', 'Nie, das heilt immer von allein', 'Große oder tiefe Verbrennungen brauchen sofort Hilfe.'),
        ],
      },
    ],
  },
  {
    id: 'schlinge',
    icon: '🧣',
    titel: 'Armschlinge mit Dreiecktuch',
    sub: 'Verletzten Arm ruhigstellen',
    szene: 'schlinge',
    merke:
      'Arm in Schonhaltung ruhigstellen. Bei Verdacht auf einen Bruch: ärztliche Hilfe, bei starken Schmerzen oder offener Wunde 112.',
    schritte: [
      {
        art: 'waehle',
        text: 'Nach einem Sturz hat jemand starke Schmerzen im Unterarm, er sieht verformt aus. Wie bleibt der Arm?',
        gut: 'Der Arm bleibt in der Haltung, in der er am wenigsten schmerzt. Nichts geradeziehen.',
        optionen: [
          r('🤕', 'So, wie ihn die Person am liebsten hält (Schonhaltung)'),
          f(
            '📏',
            'Geradeziehen, damit er wieder richtig aussieht',
            'Nie einrenken oder geradeziehen: Das verursacht Schmerzen und weitere Schäden.',
          ),
          f('🤸', 'Bewegen lassen, um zu testen, ob er heil ist', 'Bewegen verschlimmert Brüche. Der Arm soll ruhig liegen.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Was nimmst du zum Ruhigstellen?',
        gut: 'Ein Dreiecktuch lagert den Arm weich und sicher. Notfalls gehen auch ein großer Schal oder eine Jacke.',
        optionen: [
          r('🧣', 'Ein Dreiecktuch'),
          f('🪢', 'Ein schmales Seil, fest geknotet', 'Schmale Seile schneiden ein und stauen das Blut.'),
          f('🧷', 'Nur ein Pflaster', 'Ein Pflaster stützt keinen Knochen.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Wie legst du das Tuch an?',
        gut: 'Spitze zum Ellenbogen, Enden seitlich am Hals verknoten, etwas Polster unter den Knoten.',
        optionen: [
          r('🧣', 'Spitze zum Ellenbogen, Enden seitlich am Hals verknoten, Knoten polstern'),
          f(
            '🪢',
            'Enden mitten im Nacken fest verknoten',
            'Ein Knoten genau im Nacken drückt. Seitlich am Hals knoten und polstern.',
          ),
          f('🎽', 'Tuch nur lose über den Arm legen', 'Dann hält nichts. Das Tuch muss den Arm tragen.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Zum Schluss prüfst du die Durchblutung. Wie?',
        gut: 'Sind die Finger rosig, warm und fühlt die Person sie? Dann ist alles gut. Sonst Tuch lockern.',
        optionen: [
          r('🖐️', 'Finger auf Farbe, Wärme und Gefühl prüfen'),
          f('🙈', 'Das ist nicht nötig', 'Doch: Ein zu enger Verband kann die Durchblutung stoppen.'),
        ],
      },
    ],
  },
  {
    id: 'verschlucken',
    icon: '😮',
    titel: 'Verschlucken & Atemnot',
    sub: 'Husten, Rückenschläge, Oberbauchstöße',
    szene: 'verschlucken',
    merke:
      'Husten lassen. Wirkungslos: 5 Rückenschläge, dann 5 Oberbauchstöße im Wechsel. Bei Säuglingen: Rückenschläge und Brustkorbstöße, keine Oberbauchstöße.',
    schritte: [
      {
        art: 'waehle',
        text: 'Beim Essen ringt eine Person nach Luft, hustet aber kräftig. Was tust du?',
        gut: 'Kräftiges Husten ist die beste Hilfe. Bleib dabei und beobachte.',
        optionen: [
          r('🗣️', 'Zum Weiterhusten auffordern und bei der Person bleiben'),
          f('🥤', 'Etwas zu trinken geben', 'Beim Verschlucken kann Trinken alles verschlimmern.'),
          f(
            '✋',
            'Sofort kräftig auf den Rücken schlagen',
            'Solange sie kräftig hustet, nicht schlagen. Erst wenn das Husten schwach wird oder aufhört.',
          ),
        ],
      },
      {
        art: 'waehle',
        text: 'Das Husten wird schwach, die Person kann nicht mehr sprechen. Was tust du?',
        gut: 'Oberkörper nach vorn beugen: Der Fremdkörper soll nach vorn herausfallen statt tiefer zu rutschen.',
        optionen: [
          r('🧍', 'Seitlich hinter die Person treten und sie nach vorn beugen lassen'),
          f('🛋️', 'Die Person hinlegen', 'Im Liegen rutscht der Gegenstand eher tiefer.'),
          f('🙆', 'Den Kopf in den Nacken legen', 'Dann rutscht der Fremdkörper tiefer. Lieber nach vorn beugen.'),
        ],
      },
      {
        art: 'zaehle',
        text: 'Gib bis zu 5 kräftige Schläge mit dem Handballen zwischen die Schulterblätter.',
        gut: 'Bis zu 5 Schläge. Schau nach jedem Schlag, ob der Gegenstand draußen ist.',
        knopf: '✋ Rückenschlag',
        anzahl: 5,
      },
      {
        art: 'waehle',
        text: 'Der Gegenstand sitzt noch fest. Was kommt jetzt?',
        gut: 'Jetzt der Oberbauchstoß (Heimlich-Handgriff): von hinten umfassen, Faust über den Nabel.',
        optionen: [
          r('🤲', '5 Oberbauchstöße (Heimlich-Handgriff)'),
          f(
            '🥄',
            'Mit dem Finger blind im Rachen nachfischen',
            'Blindes Nachfischen schiebt den Gegenstand oft tiefer. Nur wenn du ihn siehst.',
          ),
          f('🕐', 'Abwarten', 'Ohne Luft zählt jede Sekunde. Handeln!'),
        ],
      },
      {
        art: 'zaehle',
        text: 'Fünf Oberbauchstöße: Faust über den Nabel, ruckartig nach hinten oben ziehen.',
        gut: 'Im Wechsel 5 Schläge und 5 Oberbauchstöße, bis der Gegenstand draußen ist. Und 112 nicht vergessen.',
        knopf: '🤲 Oberbauchstoß',
        anzahl: 5,
      },
      {
        art: 'waehle',
        text: 'Die Person wird bewusstlos und atmet nicht mehr. Was tust du?',
        gut: 'Vorsichtig hinlegen, 112 und sofort Herzdruckmassage: Bewusstlose bekommen keine Oberbauchstöße mehr.',
        optionen: [
          r('🛌', 'Vorsichtig hinlegen, Notruf 112, sofort Herzdruckmassage'),
          f('🔁', 'Weiter Oberbauchstöße', 'Bei Bewusstlosigkeit beginnst du mit der Herzdruckmassage.'),
          f('↔️', 'Stabile Seitenlage', 'Ohne Atmung hilft nur Herzdruckmassage.'),
        ],
      },
    ],
  },
  {
    id: 'tourniquet',
    icon: '🎗️',
    titel: 'Abbinden mit dem Tourniquet',
    sub: 'Wenn der Druckverband nicht reicht',
    szene: 'tourniquet',
    merke: 'Zuerst Druck auf die Wunde und Druckverband. Nur wenn das nicht reicht: abbinden, Zeit notieren, 112.',
    schritte: [
      {
        art: 'waehle',
        text: 'Bei einer Schnittverletzung am Unterschenkel blutet es stark, auch durch den Druckverband. Was jetzt?',
        gut: 'Stoppt der Druckverband eine lebensbedrohliche Blutung nicht, hilft als letzte Möglichkeit das Abbinden.',
        optionen: [
          r('🎗️', 'Ein Tourniquet (Abbindesystem) anlegen'),
          f('🧻', 'Noch mehr Tücher locker drüberlegen', 'Locker bringt nichts. Wenn es weiter blutet, muss abgebunden werden.'),
          f('⏳', 'Warten, bis der Rettungsdienst kommt', 'Bei starker Blutung zählt jede Minute.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Wohin kommt das Tourniquet?',
        gut: 'Zwischen Wunde und Körper, etwa eine Handbreit über der Wunde und nicht auf einem Gelenk.',
        optionen: [
          r('📍', 'Eine Handbreit über der Wunde, nicht auf einem Gelenk'),
          f('🦵', 'Direkt auf das Kniegelenk', 'Auf Gelenken wirkt das Tourniquet schlecht. Setze es auf den Oberschenkel.'),
          f('🩸', 'Mitten auf die Wunde', 'Nicht auf die Wunde, sondern darüber.'),
        ],
      },
      {
        art: 'zaehle',
        text: 'Ziehe das Band fest an und drehe den Knebel, bis die Blutung steht.',
        gut: 'Es muss so fest sein, dass die Blutung steht. Das tut weh – das ist normal.',
        knopf: '🔄 Knebel drehen',
        anzahl: 6,
      },
      {
        art: 'waehle',
        text: 'Die Blutung steht. Was tust du jetzt?',
        gut: 'Zeit aufschreiben und das Tourniquet nicht lösen: Das entscheidet der Rettungsdienst.',
        optionen: [
          r('🕐', 'Uhrzeit notieren, 112 rufen, nicht wieder lösen'),
          f('🔓', 'Nach ein paar Minuten wieder lockern', 'Nicht selbst lösen. Das entscheidet der Rettungsdienst.'),
          f('🧥', 'Unter der Kleidung verstecken', 'Es muss gut sichtbar bleiben, damit niemand es übersieht.'),
        ],
      },
    ],
  },
  {
    id: 'decke',
    icon: '✨',
    titel: 'Wärmeerhalt mit der Rettungsdecke',
    sub: 'Vor dem Auskühlen schützen',
    szene: 'decke',
    merke: 'Gold nach innen wärmt. Die Decke ersetzt weder den Notruf noch die Beobachtung.',
    schritte: [
      {
        art: 'waehle',
        text: 'Eine verletzte Person liegt draußen auf kaltem Boden. Was ist zuerst wichtig?',
        gut: 'Der Boden entzieht am meisten Wärme. Isoliere von unten, ohne verletzte Stellen unnötig zu bewegen.',
        optionen: [
          r('🧥', 'Von unten gegen die Kälte isolieren (Decke oder Jacke unterlegen)'),
          f(
            '🍺',
            'Etwas Warmes oder Alkohol zu trinken geben',
            'Verletzte bekommen nichts zu essen oder zu trinken. Alkohol ist ganz falsch.',
          ),
          f('♨️', 'Eine heiße Wärmflasche direkt auf die Haut legen', 'Direkte Hitze kann die Haut verbrennen.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Die Rettungsdecke hat eine goldene und eine silberne Seite. Welche liegt am Körper?',
        gut: 'Gold nach innen wärmt: Die Körperwärme wird zurückgespiegelt.',
        optionen: [
          r('✨', 'Gold nach innen, zum Körper'),
          f('🪞', 'Silber nach innen, zum Körper', 'Silber innen ist gegen Hitze und Sonne gedacht. Bei Kälte liegt Gold innen.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Wie wickelst du die Person ein?',
        gut: 'Über den Kopf gibt der Körper viel Wärme ab. Mund und Nase bleiben frei.',
        optionen: [
          r('🧣', 'Ganz einhüllen, auch den Kopf, Gesicht bleibt frei'),
          f('🦵', 'Nur über die Beine legen', 'Der Körper kühlt überall aus. Hülle die ganze Person ein.'),
          f('🧶', 'Fest um den Hals wickeln', 'Nie am Hals festziehen. Mund und Nase müssen frei bleiben.'),
        ],
      },
      {
        art: 'waehle',
        text: 'Was tust du danach?',
        gut: 'Bleib bei der Person, sprich sie an und beobachte sie, bis der Rettungsdienst da ist.',
        optionen: [
          r('🗣️', 'Bei der Person bleiben, ansprechen und beobachten'),
          f('🚶', 'Weggehen, die Decke wärmt ja', 'Die Person braucht jemanden, der sie beobachtet und beruhigt.'),
        ],
      },
    ],
  },
];
