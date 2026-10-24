/**
 * EKG lesen: Die Kurven werden berechnet (kein Foto), je Rhythmus mit den typischen Merkmalen:
 * Frequenz, Regelmäßigkeit, P-Welle, Breite des QRS-Komplexes. Jede Kurve sieht durch Zufall etwas anders aus.
 */
export type EkgId =
  | 'sinus'
  | 'tachy'
  | 'brady'
  | 'af'
  | 'flutter'
  | 'ves'
  | 'svt'
  | 'vt'
  | 'vf'
  | 'asystolie'
  | 'av3'
  | 'avb1'
  | 'stemi';

export interface EkgDef {
  id: EkgId;
  name: string;
  /** 1 = Grundlagen, 2 = Fortgeschritten */
  stufe: 1 | 2;
  /** Woran man es erkennt */
  merkmale: string[];
  /** Was es bedeutet */
  erklaerung: string;
  /** Was im Rettungsdienst zu tun ist (allgemein; SOP und Notarzt gehen vor) */
  handeln: string;
  /** Ähnliche Rhythmen, die als falsche Antworten taugen */
  aehnlich: EkgId[];
}

export const EKG_LISTE: EkgDef[] = [
  {
    id: 'sinus',
    name: 'Sinusrhythmus',
    stufe: 1,
    merkmale: [
      'Regelmäßig: der Abstand von R zu R ist immer gleich',
      'Frequenz 60 bis 100 pro Minute',
      'Vor jedem QRS-Komplex steht eine P-Welle',
      'QRS-Komplexe schmal (unter 0,12 Sekunden, drei kleine Kästchen)',
    ],
    erklaerung: 'Das normale Herz: Der Taktgeber im Sinusknoten schlägt regelmäßig und gibt den Takt vor.',
    handeln: 'Kein Eingriff nötig. Trotzdem zählt der Mensch: Ein normales EKG schließt nicht jede Herzerkrankung aus.',
    aehnlich: ['avb1', 'tachy', 'brady'],
  },
  {
    id: 'tachy',
    name: 'Sinustachykardie',
    stufe: 1,
    merkmale: [
      'Regelmäßig',
      'Frequenz über 100 pro Minute',
      'P-Welle vor jedem QRS (bei sehr schnell oft mit der T-Welle verschmolzen)',
      'QRS schmal',
    ],
    erklaerung:
      'Das Herz schlägt schnell, weil der Körper es verlangt: zum Beispiel bei Fieber, Schmerz, Angst, Blutverlust oder Flüssigkeitsmangel.',
    handeln:
      'Nach der Ursache suchen (Schmerz, Blutung, Fieber, Angst) und die Person beobachten. Die Ursache wird behandelt, nicht der Rhythmus.',
    aehnlich: ['svt', 'sinus', 'vt'],
  },
  {
    id: 'brady',
    name: 'Sinusbradykardie',
    stufe: 1,
    merkmale: ['Regelmäßig', 'Frequenz unter 60 pro Minute', 'P-Welle vor jedem QRS', 'QRS schmal'],
    erklaerung:
      'Langsamer, aber normal geordneter Rhythmus. Bei Sportlern oder im Schlaf völlig normal, sonst auch durch Medikamente oder Herzerkrankungen.',
    handeln: 'Zeichen beachten: Schwindel, Ohnmacht, niedriger Blutdruck, Atemnot oder Brustschmerz. Dann Notarzt nachfordern.',
    aehnlich: ['av3', 'sinus', 'avb1'],
  },
  {
    id: 'af',
    name: 'Vorhofflimmern',
    stufe: 2,
    merkmale: [
      'Absolut unregelmäßig: die R-Abstände sind völlig ungleich',
      'Keine echten P-Wellen, die Grundlinie zittert',
      'QRS meist schmal',
      'Frequenz oft schnell, kann aber auch normal sein',
    ],
    erklaerung:
      'Die Vorhöfe zucken ungeordnet, die Herzkammern bekommen unregelmäßig Impulse. Häufigste Herzrhythmusstörung, erhöht das Schlaganfallrisiko.',
    handeln:
      'Zeichen einer Instabilität beachten (Atemnot, Brustschmerz, Blutdruckabfall, Bewusstseinstrübung). 12-Kanal-EKG schreiben, Notarzt je nach Zustand.',
    aehnlich: ['flutter', 'ves', 'tachy'],
  },
  {
    id: 'flutter',
    name: 'Vorhofflattern',
    stufe: 2,
    merkmale: [
      'Sägezahnmuster der Grundlinie (Flatterwellen, etwa 300 pro Minute)',
      'QRS regelmäßig, oft nur jede 2. oder 4. Flatterwelle wird weitergeleitet',
      'QRS schmal',
    ],
    erklaerung:
      'Ein Kreisen der Erregung im Vorhof erzeugt die Sägezähne. Die Kammern folgen regelmäßig, aber nur in einem festen Verhältnis.',
    handeln: 'Wie bei Vorhofflimmern: Zustand beurteilen, 12-Kanal-EKG, Notarzt je nach Zustand.',
    aehnlich: ['af', 'svt', 'tachy'],
  },
  {
    id: 'ves',
    name: 'Ventrikuläre Extrasystolen (VES)',
    stufe: 2,
    merkmale: [
      'Einzelne vorzeitige, breite, verformte Schläge ohne P-Welle',
      'Danach eine Pause (der Rhythmus setzt verzögert wieder ein)',
      'Die übrigen Schläge sind normal',
    ],
    erklaerung: 'Eine Herzkammer schlägt selbstständig zu früh. Einzelne VES sind häufig und oft harmlos.',
    handeln:
      'Beobachten. Bei vielen VES, Paaren, Herzerkrankung, Schwindel oder Brustschmerz ärztlich abklären lassen oder Notarzt nachfordern.',
    aehnlich: ['af', 'sinus', 'vt'],
  },
  {
    id: 'svt',
    name: 'Supraventrikuläre Tachykardie (SVT)',
    stufe: 2,
    merkmale: [
      'Sehr schnell: etwa 150 bis 220 pro Minute',
      'Völlig regelmäßig, fast „wie ein Metronom“',
      'QRS schmal, P-Wellen nicht zu erkennen',
      'Beginnt und endet oft plötzlich',
    ],
    erklaerung:
      'Ein Kreisen der Erregung oberhalb der Herzkammern. Die Person bemerkt oft Herzrasen, kann aber auch schwindelig werden.',
    handeln:
      'Zustand beurteilen. Instabile Personen sofort mit Notarzt behandeln lassen. Maßnahmen nur nach ärztlicher Anordnung und SOP.',
    aehnlich: ['tachy', 'flutter', 'vt'],
  },
  {
    id: 'vt',
    name: 'Kammertachykardie (VT)',
    stufe: 1,
    merkmale: [
      'Regelmäßig und schnell (oft 150 bis 250 pro Minute)',
      'QRS-Komplexe breit und verformt (über 0,12 Sekunden)',
      'Keine erkennbaren P-Wellen',
    ],
    erklaerung:
      'Die Herzkammer gibt selbst einen schnellen Takt vor. Das ist gefährlich: Das Herz pumpt oft kaum noch Blut und kann in Kammerflimmern übergehen.',
    handeln:
      'Immer Puls und Bewusstsein prüfen. Ohne Puls wie Kreislaufstillstand behandeln: Wiederbelebung und Defibrillation. Mit Puls sofort Notarzt nachfordern.',
    aehnlich: ['svt', 'vf', 'tachy'],
  },
  {
    id: 'vf',
    name: 'Kammerflimmern (VF)',
    stufe: 1,
    merkmale: [
      'Chaotische Zacken verschiedener Höhe, kein Rhythmus',
      'Keine erkennbaren QRS-Komplexe oder P-Wellen',
      'Kein Puls: die Person ist bewusstlos',
    ],
    erklaerung:
      'Das Herz zuckt unkoordiniert und pumpt kein Blut mehr. Das ist ein Kreislaufstillstand und die häufigste Ursache beim plötzlichen Herztod.',
    handeln: 'Sofort Wiederbelebung und Defibrillation (Schock). Jede Minute ohne Schock senkt die Überlebenschance.',
    aehnlich: ['vt', 'asystolie', 'af'],
  },
  {
    id: 'asystolie',
    name: 'Asystolie',
    stufe: 1,
    merkmale: [
      'Nur eine (fast) gerade Linie, keine Herzaktion',
      'Allenfalls leichtes Wackeln der Grundlinie durch Bewegung oder Atmung',
    ],
    erklaerung:
      'Das Herz zeigt keine elektrische Aktivität. Kreislaufstillstand. Wichtig: Erst prüfen, ob Elektroden, Kabel und Verstärkung stimmen und ob die Person wirklich bewusstlos ist.',
    handeln:
      'Wiederbelebung, nicht schockbar. Ursachen suchen und behandeln lassen. Elektroden und andere Ableitung kontrollieren, um eine Fehlmessung auszuschließen.',
    aehnlich: ['vf', 'brady', 'av3'],
  },
  {
    id: 'av3',
    name: 'AV-Block 3. Grades',
    stufe: 2,
    merkmale: [
      'Sehr langsamer, regelmäßiger QRS-Rhythmus (oft 30 bis 40 pro Minute)',
      'P-Wellen laufen regelmäßig, aber unabhängig vom QRS: kein fester Abstand',
      'QRS häufig breit',
    ],
    erklaerung:
      'Die Erregung kommt von den Vorhöfen nicht mehr in die Kammern. Eine Ersatz-Taktgeberzelle in der Kammer schlägt langsam allein.',
    handeln:
      'Gefährlich: Notarzt nachfordern, Person überwachen. Behandlung durch Notarzt (zum Beispiel Schrittmacher) in der Klinik.',
    aehnlich: ['brady', 'avb1', 'asystolie'],
  },
  {
    id: 'avb1',
    name: 'AV-Block 1. Grades',
    stufe: 2,
    merkmale: [
      'Regelmäßig, normale Frequenz',
      'Nach jeder P-Welle folgt ein QRS, aber verzögert',
      'PQ-Strecke über 0,20 Sekunden (mehr als fünf kleine Kästchen)',
    ],
    erklaerung: 'Die Überleitung vom Vorhof zur Kammer ist nur verlangsamt, nichts fällt aus. Oft harmlos.',
    handeln: 'Meist keine Maßnahme nötig. Beobachten und im Bericht erwähnen.',
    aehnlich: ['sinus', 'av3', 'brady'],
  },
  {
    id: 'stemi',
    name: 'ST-Hebung (STEMI)',
    stufe: 2,
    merkmale: [
      'Die ST-Strecke ist angehoben und geht „bogenförmig“ in die T-Welle über',
      'Rhythmus meist regelmäßig, QRS schmal',
      'Dazu typische Symptome: Brustschmerz, Atemnot, Übelkeit, kalter Schweiß',
    ],
    erklaerung: 'Typisches EKG-Zeichen eines akuten Herzinfarkts mit Gefäßverschluss. Beweisend ist erst das 12-Kanal-EKG.',
    handeln:
      'Sofort Notarzt, 12-Kanal-EKG schreiben, Person ruhig lagern und überwachen. Ziel ist eine Klinik mit Herzkatheter, mit Voranmeldung.',
    aehnlich: ['sinus', 'tachy', 'avb1'],
  },
];

export const EKG_BY_ID = Object.fromEntries(EKG_LISTE.map((e) => [e.id, e])) as Record<EkgId, EkgDef>;

// ───────────── Kurven berechnen ─────────────

export const EKG_SEK = 6;
export const EKG_HZ = 250;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (t: number, mu: number, sigma: number, amp: number) => amp * Math.exp(-0.5 * ((t - mu) / sigma) ** 2);
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export interface EkgKurve {
  /** Spannung in Millivolt, EKG_HZ Werte pro Sekunde */
  mv: number[];
  /** Zeitpunkte der QRS-Komplexe (Sekunden) */
  qrs: number[];
}

type Schlag = {
  tq: number;
  /** PQ-Zeit; 0 = keine P-Welle */
  pq?: number;
  breit?: boolean;
  st?: number;
  ampR?: number;
  tAmp?: number;
  tPos?: number;
};

/** Ein einzelner Herzschlag (P, QRS, ST, T) an der Stelle t */
function schlagWert(t: number, s: Schlag): number {
  const x = t - s.tq;
  if (x < -0.4 || x > 0.7) return 0;
  const r = s.ampR ?? 1;
  let v = 0;
  if (s.breit) {
    // breiter, verformter Komplex mit gegenläufiger T-Welle
    v += gauss(x, 0, 0.042, 1.05 * r) + gauss(x, 0.06, 0.03, -0.35 * r) + gauss(x, 0.24, 0.075, -0.45 * r);
  } else {
    if (s.pq) v += gauss(x, -s.pq, 0.036, 0.14);
    v += gauss(x, -0.025, 0.01, -0.12 * r) + gauss(x, 0, 0.011, r) + gauss(x, 0.027, 0.012, -0.24 * r);
    v += gauss(x, s.tPos ?? 0.24, 0.06, s.tAmp ?? 0.3);
    if (s.st) v += s.st * (sigmoid((x - 0.045) / 0.012) - sigmoid((x - (s.tPos ?? 0.24) - 0.04) / 0.03));
  }
  return v;
}

export function ekgKurve(id: EkgId, seed: number): EkgKurve {
  const rnd = mulberry32(seed * 7919 + 13);
  const n = EKG_SEK * EKG_HZ;
  const mv = new Array<number>(n).fill(0);
  const schlaege: Schlag[] = [];
  const qrs: number[] = [];
  const extra: ((t: number) => number)[] = [];
  const phase = rnd() * 2;
  const regelmaessig = (hf: number, opts: Omit<Schlag, 'tq'> = {}, jitter = 0.015) => {
    const rr = 60 / hf;
    for (let t = 0.25 + rnd() * rr; t < EKG_SEK + 0.5; t += rr * (1 + (rnd() - 0.5) * jitter * 2)) {
      schlaege.push({ tq: t, ...opts });
      qrs.push(t);
    }
  };

  switch (id) {
    case 'sinus':
      regelmaessig(62 + rnd() * 26, { pq: 0.16 });
      break;
    case 'tachy':
      regelmaessig(112 + rnd() * 30, { pq: 0.13, tPos: 0.2, tAmp: 0.26 });
      break;
    case 'brady':
      regelmaessig(36 + rnd() * 12, { pq: 0.17, tPos: 0.27 });
      break;
    case 'avb1':
      regelmaessig(62 + rnd() * 16, { pq: 0.3 + rnd() * 0.06 });
      break;
    case 'stemi':
      regelmaessig(70 + rnd() * 25, { pq: 0.16, st: 0.38 + rnd() * 0.15, tAmp: 0.45, tPos: 0.27, ampR: 1.05 });
      break;
    case 'svt':
      regelmaessig(170 + rnd() * 35, { tPos: 0.17, tAmp: 0.18, st: -0.06 }, 0.004);
      break;
    case 'af': {
      let t = 0.2 + rnd() * 0.3;
      const mittel = 0.5 + rnd() * 0.25;
      while (t < EKG_SEK + 0.5) {
        schlaege.push({ tq: t, tAmp: 0.2, tPos: 0.2 });
        qrs.push(t);
        t += Math.max(0.28, mittel * (0.55 + rnd() * 0.95));
      }
      const w = [0, 1, 2, 3].map(() => ({ f: 5.5 + rnd() * 4, a: 0.025 + rnd() * 0.03, p: rnd() * 6.28 }));
      extra.push((x) => w.reduce((s, c) => s + c.a * Math.sin(6.283 * c.f * x + c.p + 0.9 * Math.sin(1.7 * x)), 0));
      break;
    }
    case 'flutter': {
      const periode = 0.2; // 300 pro Minute
      const verhaeltnis = rnd() < 0.6 ? 4 : 2;
      const start = rnd() * periode;
      extra.push((x) => {
        const p = ((((x + start) / periode) % 1) + 1) % 1;
        return 0.2 * (p < 0.8 ? p / 0.8 : (1 - p) / 0.2) - 0.1;
      });
      for (let k = 1; k * periode * verhaeltnis < EKG_SEK + 0.5; k++) {
        const t = 0.1 + k * periode * verhaeltnis - start * 0.0 + rnd() * 0.004;
        schlaege.push({ tq: t, tAmp: 0.12, tPos: 0.22, ampR: 0.9 });
        qrs.push(t);
      }
      break;
    }
    case 'ves': {
      const rr = 60 / (66 + rnd() * 16);
      let t = 0.3 + rnd() * 0.3;
      const nVes = 1 + Math.floor(rnd() * 2);
      const vesNr = new Set<number>();
      while (vesNr.size < nVes) vesNr.add(2 + Math.floor(rnd() * 4));
      let k = 0;
      while (t < EKG_SEK + 0.5) {
        if (vesNr.has(k)) {
          const vt = t - rr * 0.32; // zu früh
          schlaege.push({ tq: vt, breit: true, ampR: 1 });
          qrs.push(vt);
          t = vt + rr * 1.25; // Pause danach
        } else {
          schlaege.push({ tq: t, pq: 0.16 });
          qrs.push(t);
          t += rr;
        }
        k++;
      }
      break;
    }
    case 'vt': {
      const rr = 60 / (160 + rnd() * 60);
      for (let t = 0.2 + rnd() * rr; t < EKG_SEK + 0.5; t += rr * (1 + (rnd() - 0.5) * 0.02)) {
        schlaege.push({ tq: t, breit: true, ampR: 1.15 });
        qrs.push(t);
      }
      break;
    }
    case 'vf': {
      const a = [0, 1, 2].map(() => ({ f: 3.8 + rnd() * 3.2, p: rnd() * 6.28, m: rnd() * 0.8 }));
      extra.push((x) => {
        const huelle = 0.55 + 0.35 * Math.sin(1.3 * x + phase) + 0.15 * Math.sin(3.1 * x);
        return (
          huelle *
          a.reduce((s, c, i) => s + (1 / (i + 1.4)) * Math.sin(6.283 * c.f * x + c.p + (1.4 + c.m) * Math.sin(1.9 * x + i)), 0) *
          0.95
        );
      });
      break;
    }
    case 'asystolie':
      extra.push((x) => 0.04 * Math.sin(0.35 * 6.283 * x + phase) + 0.012 * Math.sin(2.1 * 6.283 * x + 3 * phase));
      break;
    case 'av3': {
      // Vorhöfe schlagen regelmäßig (P-Wellen), die Kammern unabhängig davon langsam
      const prr = 60 / (72 + rnd() * 14);
      for (let t = rnd() * prr; t < EKG_SEK + 0.5; t += prr) extra.push((x) => gauss(x, t, 0.036, 0.15));
      const rr = 60 / (32 + rnd() * 9);
      for (let t = 0.4 + rnd() * rr * 0.5; t < EKG_SEK + 0.5; t += rr) {
        schlaege.push({ tq: t, breit: true, ampR: 0.85 });
        qrs.push(t);
      }
      break;
    }
  }

  const wander = 0.025 + rnd() * 0.02;
  const wp = rnd() * 6.28;
  for (let i = 0; i < n; i++) {
    const t = i / EKG_HZ;
    let v = 0;
    for (const s of schlaege) v += schlagWert(t, s);
    for (const e of extra) v += e(t);
    // Atmung/Grundlinienschwankung und feines Rauschen
    v += wander * Math.sin(0.28 * 6.283 * t + wp) + (rnd() - 0.5) * (id === 'asystolie' ? 0.01 : 0.014);
    mv[i] = v;
  }
  // Flatterwellen: nach dem QRS-Verbund glätten wir nichts – die Sägezähne gehören zum Bild
  return { mv, qrs: qrs.filter((q) => q >= 0 && q <= EKG_SEK) };
}

/** Frequenz in Schlägen pro Minute aus den QRS-Abständen; null bei Kammerflimmern und Asystolie */
export function ekgFrequenz(id: EkgId, k: EkgKurve): number | null {
  if (id === 'vf' || id === 'asystolie' || k.qrs.length < 2) return null;
  return Math.round(((k.qrs.length - 1) * 60) / (k.qrs[k.qrs.length - 1] - k.qrs[0]));
}

// ───────────── Zeichnen (Millimeterpapier) ─────────────

/** Papier: 1 mm = 4 Einheiten; 25 mm pro Sekunde, 10 mm pro Millivolt (mit etwas mehr Verstärkung für kleine Handys) */
export const PAPIER = {
  breite: EKG_SEK * 25 * 4, // 600
  hoehe: 300,
  basis: 175,
  mvZuEinheit: 80,
};

export function ekgPfad(k: EkgKurve): string {
  const { mv } = k;
  const teile: string[] = [];
  for (let i = 0; i < mv.length; i++) {
    const x = (i / (mv.length - 1)) * PAPIER.breite;
    const y = Math.max(4, Math.min(PAPIER.hoehe - 4, PAPIER.basis - mv[i] * PAPIER.mvZuEinheit));
    teile.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return teile.join(' ');
}

// ───────────── Spiel ─────────────

export interface EkgFrage {
  id: EkgId;
  seed: number;
  optionen: EkgId[];
}

function mische<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const EKG_RUNDEN = 10;

/** Fragen für eine Runde: jeder Rhythmus der Stufe kommt etwa gleich oft vor; die falschen Antworten sind ähnliche Rhythmen */
export function ekgFragen(nurGrundlagen: boolean, anzahl = EKG_RUNDEN): EkgFrage[] {
  const pool = EKG_LISTE.filter((e) => !nurGrundlagen || e.stufe === 1);
  const erlaubt = new Set(pool.map((e) => e.id));
  let reihe: EkgId[] = [];
  while (reihe.length < anzahl) reihe = [...reihe, ...mische(pool.map((e) => e.id))];
  // gleiche Rhythmen nicht direkt hintereinander
  reihe = reihe.slice(0, anzahl);
  for (let i = 1; i < reihe.length; i++)
    if (reihe[i] === reihe[i - 1]) {
      const j = reihe.findIndex((x, k) => k > i && x !== reihe[i] && x !== reihe[i - 1]);
      if (j > 0) [reihe[i], reihe[j]] = [reihe[j], reihe[i]];
    }
  return reihe.map((id) => {
    const aehnlich = mische(EKG_BY_ID[id].aehnlich.filter((x) => erlaubt.has(x)));
    const rest = mische([...erlaubt].filter((x) => x !== id && !aehnlich.includes(x)));
    return { id, seed: Math.floor(Math.random() * 1e6), optionen: mische([id, ...[...aehnlich, ...rest].slice(0, 3)]) };
  });
}
