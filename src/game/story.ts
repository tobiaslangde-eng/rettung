import { archiveCount } from './detective';
import { ausruestung, levelOf } from './equipment';
import { Rolle } from './rolle';
import { Progress } from './storage';

/** Was der Knopf eines Kapitels öffnet */
export type StoryAktion = 'einsatz' | 'wissen' | 'schritte' | 'cpr' | 'garage' | 'detektiv' | 'quiz' | 'manv' | 'notruf' | 'zuerst' | 'pack' | 'handgriffe' | 'mythen' | 'aed' | 'pruefung' | 'gefahr' | 'rolle';

/** Bereiche, die durch die Geschichte nach und nach freigeschaltet werden */
export type Bereich = 'einsatz' | 'wissen' | 'schritte' | 'cpr' | 'garage' | 'detektiv' | 'quiz' | 'manv' | 'notruf' | 'zuerst' | 'pack' | 'handgriffe' | 'mythen' | 'aed' | 'pruefung' | 'gefahr';

export interface Kapitel {
  titel: string;
  /** Die Geschichte (2–4 Sätze) */
  text: string;
  /** Aufgabe in einem Satz */
  ziel: string;
  aktion: StoryAktion;
  /** Fortschritt der Aufgabe (0–1) */
  stand: (p: Progress) => number;
  /** Bereiche, die mit diesem Kapitel freigeschaltet werden */
  frei: Bereich[];
}

/** Belohnung je abgeschlossenem Kapitel */
export const KAPITEL_BONUS = 100;

const anteil = (wert: number, ziel: number) => Math.min(1, wert / ziel);
const aufgeruestet = (p: Progress) => ausruestung().filter((e) => levelOf(p, e.id) >= 2).length;
const aufStufe3 = (p: Progress) => ausruestung().filter((e) => levelOf(p, e.id) >= 3).length;
const akten = (p: Progress) => archiveCount(p).solved;

const HELFER: Kapitel[] = [
  {
    titel: 'Der Kurs',
    text: 'Für den Führerschein sitzt du in einem Erste-Hilfe-Kurs. Kursleiterin Kati lächelt in die Runde: „Das Wichtigste zuerst – wer hilft, macht nichts falsch. Falsch ist nur, nichts zu tun.“',
    ziel: 'Beantworte mindestens 6 von 10 Wissensfragen richtig.',
    aktion: 'wissen',
    stand: (p) => anteil(p.knowBest, 6),
    frei: ['wissen'],
  },
  {
    titel: 'Schritt für Schritt',
    text: 'Nach der Pause verteilt Kati Karten auf dem Tisch: „Notruf, Seitenlage, Unfallstelle absichern – die Reihenfolge rettet Leben. Bringt sie in die richtige Ordnung!“',
    ziel: 'Bringe 2 Abläufe in die richtige Reihenfolge.',
    aktion: 'schritte',
    stand: (p) => anteil(p.ablaeufe.length, 2),
    frei: ['schritte'],
  },
  {
    titel: 'Herz in deinen Händen',
    text: 'Am Nachmittag liegt eine Übungspuppe vor dir. „Fest und schnell drücken, 100 bis 120 Mal pro Minute“, sagt Kati. „Keine Angst, du kannst nichts kaputt machen.“',
    ziel: 'Schaffe die Herzdruckmassage mit mindestens 70 %.',
    aktion: 'cpr',
    stand: (p) => anteil(p.cprBest, 70),
    frei: ['cpr'],
  },
  {
    titel: 'Der wichtigste Anruf',
    text: 'Kati hält ein altes Telefon hoch: „Die meisten Fehler passieren nicht beim Helfen, sondern beim Anruf. Wo? Was? Wie viele? Welche Verletzungen? Und dann: Warten auf Rückfragen. Üben wir das!“',
    ziel: 'Übe 2 Notrufe mit der Leitstelle.',
    aktion: 'notruf',
    stand: (p) => anteil(p.notrufGeschafft.length, 2),
    frei: ['notruf'],
  },
  {
    titel: 'Mythos oder Wahrheit?',
    text: 'In der Kaffeepause erzählt jemand, bei Nasenbluten müsse man den Kopf in den Nacken legen. Kati schüttelt den Kopf: „So halten sich Irrtümer jahrelang. Prüfen wir, was stimmt.“',
    ziel: 'Schaffe bei „Mythos oder Wahrheit?“ mindestens 7 von 10.',
    aktion: 'mythen',
    stand: (p) => anteil(p.mythenBest, 7),
    frei: ['mythen'],
  },
  {
    titel: 'Der erste Ernstfall',
    text: 'Zwei Wochen später, auf dem Heimweg. Vor dir bleibt jemand stehen, dann wird es laut. Dein Herz klopft – aber du weißt, was zu tun ist.',
    ziel: 'Hilf bei deinem ersten Notfall.',
    aktion: 'einsatz',
    stand: (p) => anteil(p.casesPlayed, 1),
    frei: ['einsatz'],
  },
  {
    titel: 'Was zuerst?',
    text: 'Abends gehst du den Tag durch. Du hast gezögert – wen zuerst ansprechen? Erst den Notruf oder erst die Blutung? Kati schreibt dir: „Entscheidungen werden schneller, wenn man sie geübt hat.“',
    ziel: 'Schaffe bei „Was zuerst?“ mindestens 7 von 10.',
    aktion: 'zuerst',
    stand: (p) => anteil(p.zuerstBest, 7),
    frei: ['zuerst', 'gefahr'],
  },
  {
    titel: 'Ein Blick in den Kofferraum',
    text: 'Du schaust in dein Auto: Der Verbandkasten ist von 2009, die Warnweste liegt ganz hinten. Mit deinen Punkten kannst du dein Auto besser ausstatten.',
    ziel: 'Rüste dein Auto einmal auf.',
    aktion: 'garage',
    stand: (p) => anteil(aufgeruestet(p), 1),
    frei: ['garage'],
  },
  {
    titel: 'Gut gepackt',
    text: 'Vor der Wanderung am Wochenende packst du die Hausapotheke. Kati sieht dir über die Schulter: „Franzbranntwein auf die Wunde? Lieber nicht. Was wirklich hineingehört, lernst du jetzt.“',
    ziel: 'Packe 2 Listen richtig.',
    aktion: 'pack',
    stand: (p) => anteil(p.packGeschafft.length, 2),
    frei: ['pack'],
  },
  {
    titel: 'Handgriffe, die sitzen',
    text: 'Beim Sommerfest schneidet sich ein Kind an einer Scherbe. Du denkst: Druckverband – aber wie genau? Kati zeigt dir später in Ruhe, wie man lagert, verbindet und kühlt.',
    ziel: 'Schaffe bei „Handgriffe“ mindestens 7 von 10.',
    aktion: 'handgriffe',
    stand: (p) => anteil(p.handgriffeBest, 7),
    frei: ['handgriffe'],
  },
  {
    titel: 'Der Defibrillator',
    text: 'Im Supermarkt hängt ein Gerät mit grünem Herz an der Wand. „Davor hat jeder Angst“, sagt Kati, „dabei spricht es mit dir und sagt dir genau, was du tun sollst. Üben wir es.“',
    ziel: 'Schließe 2 Defi-Trainings ab.',
    aktion: 'aed',
    stand: (p) => anteil(p.aedGeschafft.length, 2),
    frei: ['aed'],
  },
  {
    titel: 'Die, die man ruft',
    text: 'In der Nachbarschaft hat es sich herumgesprochen: Du bleibst ruhig, wenn etwas passiert. Beim Sportverein, im Treppenhaus, auf dem Wochenmarkt – du hilfst.',
    ziel: 'Hilf bei insgesamt 6 Notfällen.',
    aktion: 'einsatz',
    stand: (p) => anteil(p.casesPlayed, 6),
    frei: [],
  },
  {
    titel: 'Sicher am Telefon',
    text: 'Nachts klingelt dein Telefon: Eine Freundin hat Brustschmerzen und weiß nicht, was sie sagen soll. Du bleibst ruhig und führst sie durch das Gespräch mit der Leitstelle.',
    ziel: 'Schließe 5 Notruf-Szenarien ab.',
    aktion: 'notruf',
    stand: (p) => anteil(p.notrufGeschafft.length, 5),
    frei: [],
  },
  {
    titel: 'Gut ausgerüstet',
    text: 'Ein Unfall auf der Landstraße hat dir gezeigt, wie wertvoll gute Ausrüstung ist: Licht, Warnleuchte, warme Decken. Du baust dein Auto zum rollenden Erste-Hilfe-Koffer aus.',
    ziel: 'Bringe 3 Ausrüstungen auf Stufe 3.',
    aktion: 'garage',
    stand: (p) => anteil(aufStufe3(p), 3),
    frei: [],
  },
  {
    titel: 'Ersthelfer-App',
    text: 'Kati schickt dir einen Link: „Melde dich bei der Ersthelfer-App an. Wenn in deiner Nähe jemand einen Herzstillstand hat, kannst du vor dem Rettungsdienst da sein.“',
    ziel: 'Schaffe die Herzdruckmassage mit mindestens 85 % und 4 Defi-Trainings.',
    aktion: 'cpr',
    stand: (p) => (anteil(p.cprBest, 85) + anteil(p.aedGeschafft.length, 4)) / 2,
    frei: [],
  },
  {
    titel: 'Alles im Griff',
    text: 'Beim Straßenfest kippt jemand um, ein Kind schneidet sich, ein Mann hat Atemnot – gleichzeitig. Du sortierst, verteilst Aufgaben und behältst den Überblick.',
    ziel: 'Schaffe „Was zuerst?“ mit 9 von 10 und packe 4 Listen richtig.',
    aktion: 'zuerst',
    stand: (p) => (anteil(p.zuerstBest, 9) + anteil(p.packGeschafft.length, 4)) / 2,
    frei: [],
  },
  {
    titel: 'Die Prüfung',
    text: 'Zum Abschluss des Kurses wartet ein Test mit 20 Fragen. Kati lächelt: „Wer ruhig bleibt und das Gelernte anwendet, besteht. Ich traue dir das zu.“',
    ziel: 'Bestehe die Erste-Hilfe-Prüfung mit mindestens 16 von 20.',
    aktion: 'pruefung',
    stand: (p) => anteil(p.pruefungBest, 16),
    frei: ['pruefung'],
  },
  {
    titel: 'Lebensretter/in',
    text: 'Es ist passiert: Die App hat dich alarmiert, du hast gedrückt, bis der Rettungsdienst kam. Später erfährst du, dass der Mann lebt. Du bist stolz – und willst noch besser werden.',
    ziel: 'Löse 5 Notfälle mit 3 Sternen.',
    aktion: 'einsatz',
    stand: (p) => anteil(p.perfectRuns, 5),
    frei: [],
  },
  {
    titel: 'Meister/in der Ersten Hilfe',
    text: 'Du hast alles geübt, was im Kurs dran kommt – und mehr. Bei der Nachbarschaftsfeier erklärst du anderen, wie man den Notruf richtig absetzt. Kati ist stolz auf dich.',
    ziel: 'Schaffe „Mythos oder Wahrheit?“ mit 9 und „Handgriffe“ mit 9 von 10.',
    aktion: 'handgriffe',
    stand: (p) => (anteil(p.mythenBest, 9) + anteil(p.handgriffeBest, 9)) / 2,
    frei: [],
  },
  {
    titel: 'Der nächste Schritt',
    text: 'Bei einem Einsatz fragt dich eine Notfallsanitäterin: „Du bist richtig gut. Hast du schon mal an den Rettungsdienst gedacht?“ Vielleicht beginnt hier eine neue Geschichte …',
    ziel: 'Spiele als Sanitäter/in weiter – oder bleib die beste Ersthelferin, der beste Ersthelfer der Stadt.',
    aktion: 'rolle',
    stand: () => 1,
    frei: [],
  },
];

const SANI: Kapitel[] = [
  {
    titel: 'Erster Tag auf der Wache',
    text: 'Dein Praktikum beginnt. Kollegin Kati drückt dir eine Jacke in die Hand: „Willkommen auf der Rettungswache! Der Melder geht gleich los – du fährst mit.“',
    ziel: 'Fahre deinen ersten Einsatz.',
    aktion: 'einsatz',
    stand: (p) => anteil(p.casesPlayed, 1),
    frei: ['einsatz'],
  },
  {
    titel: 'Zahlen lesen',
    text: 'Auf der Rückfahrt fragt Kati dich ab: „Puls 48 – ist das zu niedrig? Und ein Blutzucker von 60?“ Wer die Normwerte kennt, erkennt Gefahr sofort.',
    ziel: 'Schaffe im Normwerte-Training mindestens 7 von 10.',
    aktion: 'quiz',
    stand: (p) => anteil(p.quizBest, 7),
    frei: ['quiz'],
  },
  {
    titel: 'Wissen ist Rettung',
    text: 'In der Wachenküche liegen Lernkarten. „Die Grundlagen musst du im Schlaf können“, sagt Kati. „ABCDE, Notruf, Wiederbelebung.“',
    ziel: 'Beantworte mindestens 7 von 10 Wissensfragen richtig.',
    aktion: 'wissen',
    stand: (p) => anteil(p.knowBest, 7),
    frei: ['wissen'],
  },
  {
    titel: 'Neue Technik',
    text: 'Die Wache bekommt ein Budget für Ausrüstung. Der Wachleiter schaut dich an: „Du hast gute Einsätze gefahren – such du etwas aus.“',
    ziel: 'Rüste deinen Rettungswagen einmal auf.',
    aktion: 'garage',
    stand: (p) => anteil(aufgeruestet(p), 1),
    frei: ['garage'],
  },
  {
    titel: 'Der Herzstillstand',
    text: 'Nachts der Alarm: Person leblos. Ihr seid zuerst da. Kati legt die Pads an, du drückst. Jede Sekunde zählt – und jeder Druck.',
    ziel: 'Schaffe die Herzdruckmassage mit mindestens 80 %.',
    aktion: 'cpr',
    stand: (p) => anteil(p.cprBest, 80),
    frei: ['cpr', 'gefahr'],
  },
  {
    titel: 'Handgriffe im Schlaf',
    text: '„Unter Stress vergisst man Schritte“, sagt Kati. „Deshalb üben wir Abläufe, bis sie sitzen – ABCDE, SAMPLER, Übergabe.“',
    ziel: 'Bringe 3 Abläufe in die richtige Reihenfolge.',
    aktion: 'schritte',
    stand: (p) => anteil(p.ablaeufe.length, 3),
    frei: ['schritte'],
  },
  {
    titel: 'Der Diagnose-Krimi',
    text: 'Im Aufenthaltsraum stapeln sich alte Einsatzprotokolle. „Lies sie wie ein Detektiv“, schlägt Kati vor. „Welche Hinweise hättest du gebraucht?“',
    ziel: 'Löse 5 Detektiv-Akten.',
    aktion: 'detektiv',
    stand: (p) => anteil(akten(p), 5),
    frei: ['detektiv'],
  },
  {
    titel: 'Großeinsatz',
    text: 'Ein Bus ist verunglückt, viele Verletzte. Du bist im ersten Fahrzeug und musst sichten: Wer braucht zuerst Hilfe?',
    ziel: 'Sichte im Großeinsatz mindestens 6 von 8 richtig.',
    aktion: 'manv',
    stand: (p) => anteil(p.manvBest, 6),
    frei: ['manv'],
  },
  {
    titel: 'Die Prüfung',
    text: 'Die Abschlussprüfung steht an. Kati klopft dir auf die Schulter: „Du kannst das. Zeig, dass du sauber arbeitest – Einsatz für Einsatz.“',
    ziel: 'Meistere 3 Einsätze mit 3 Sternen.',
    aktion: 'einsatz',
    stand: (p) => anteil(p.perfectRuns, 3),
    frei: [],
  },
  {
    titel: 'Teil des Teams',
    text: 'Bestanden! Auf der Wache gibt es Kuchen, und dein Name steht jetzt auf dem Dienstplan. Die richtigen Einsätze fangen gerade erst an.',
    ziel: 'Erreiche den Dienstgrad Notfallsanitäter/in (1.600 Punkte).',
    aktion: 'einsatz',
    stand: (p) => anteil(p.totalPoints, 1600),
    frei: [],
  },
  {
    titel: 'Praxisanleiter/in',
    text: 'Ein neuer Praktikant steht nervös in der Fahrzeughalle. Kati zwinkert dir zu: „Jetzt bist du dran. Zeig ihm, wie es geht.“',
    ziel: 'Löse 40 Detektiv-Akten und bleib im Dienst – deine Geschichte geht weiter.',
    aktion: 'detektiv',
    stand: (p) => anteil(akten(p), 40),
    frei: [],
  },
];

export const KAPITEL: Record<Rolle, Kapitel[]> = { helfer: HELFER, sani: SANI };

/** Aktuelles Kapitel (null = alle Kapitel abgeschlossen) */
export function aktuellesKapitel(rolle: Rolle, p: Progress): { nr: number; kapitel: Kapitel; erfuellt: boolean } | null {
  const list = KAPITEL[rolle];
  if (p.story >= list.length) return null;
  const kapitel = list[p.story];
  return { nr: p.story + 1, kapitel, erfuellt: kapitel.stand(p) >= 1 };
}

/** In welchem Kapitel ein Bereich freigeschaltet wird (1-basiert) – 0, wenn er für diese Rolle nicht vorkommt */
export function freiAb(rolle: Rolle, b: Bereich): number {
  const i = KAPITEL[rolle].findIndex((k) => k.frei.includes(b));
  return i + 1;
}

/** Ist ein Bereich schon frei? Freigeschaltet wird mit dem Beginn des Kapitels, in dem er eingeführt wird. */
export function istFrei(rolle: Rolle, p: Progress, b: Bereich): boolean {
  if (p.modus === 'frei') return true;
  const ab = freiAb(rolle, b);
  return ab > 0 && p.story + 1 >= ab;
}
