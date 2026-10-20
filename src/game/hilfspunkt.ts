import { Progress } from './storage';

/** Mein Hilfspunkt (Ersthelfer/in): fünf Bereiche in drei Stufen, wie die Rettungswache beim Sanitäter */
export type HilfId = 'apotheke' | 'raum' | 'defi' | 'netz' | 'kursraum';

export const HILF_MAX = 3;

export interface HilfDef {
  id: HilfId;
  title: string;
  icon: string;
  wissen: string;
  stufen: [string, string, string];
  cost: [number, number, number];
  wirkung: string;
}

export const HILFPUNKT: HilfDef[] = [
  {
    id: 'apotheke',
    title: 'Hausapotheke',
    icon: '🧰',
    wissen:
      'Verbandmaterial gehört trocken und sauber in einen festen Schrank. Einmal im Jahr prüfen, was abgelaufen ist – Medikamente müssen dabei nicht sein.',
    stufen: ['Schrank mit Pflastern', 'Wandschrank mit Verbandmaterial', 'Gepflegte Hausapotheke mit Inventarliste'],
    cost: [500, 1500, 3800],
    wirkung: 'Fehler verzeihen: 2 EP weniger Abzug je falsche Maßnahme und Stufe',
  },
  {
    id: 'raum',
    title: 'Erste-Hilfe-Raum',
    icon: '🛏️',
    wissen:
      'In Betrieben und Vereinen gibt es für größere Gruppen einen Erste-Hilfe-Raum mit Liege, Waschbecken und Notfallkoffer – schnell erreichbar und gut beschildert.',
    stufen: ['Liege und Decke', 'Raum mit Liege, Waschbecken und Notfallkoffer', 'Erste-Hilfe-Raum nach Betriebsnorm'],
    cost: [500, 1500, 3800],
    wirkung: 'Gut versorgt: +2 EP für jede richtige Maßnahme je Stufe',
  },
  {
    id: 'defi',
    title: 'Defi-Station',
    icon: '💚',
    wissen:
      'Öffentlich zugängliche Defibrillatoren hängen in Wandkästen mit grünem Herz-Schild. Jeder darf sie benutzen – das Gerät sagt dir, was du tun sollst.',
    stufen: ['Defi im Wandkasten', 'Defi mit Alarm-Kasten und Leuchtschild', 'Defi, Schild und Ortskarte in der App'],
    cost: [500, 1500, 3800],
    wirkung: 'Herz im Blick: +8 % EP bei Herzdruckmassage und Defi-Training je Stufe',
  },
  {
    id: 'netz',
    title: 'Helfer-Netzwerk',
    icon: '📲',
    wissen:
      'Ersthelfer-Apps alarmieren registrierte Helfer in der Nähe parallel zum Rettungsdienst. Wer nah dran ist, kann die Zeit bis zum Eintreffen überbrücken.',
    stufen: [
      'Notfallnummern am Schwarzen Brett',
      'Nachbarschaftsgruppe mit Notfall-Chat',
      'Verknüpft mit Ersthelfer-App und Leitstelle',
    ],
    cost: [500, 1500, 3800],
    wirkung: 'Gut vernetzt: +2 % EP bei Notfällen je Stufe',
  },
  {
    id: 'kursraum',
    title: 'Kursraum',
    icon: '🎓',
    wissen:
      'Erste-Hilfe-Wissen verblasst: Kurse sollten etwa alle zwei Jahre aufgefrischt werden. Übungspuppen und ein Defi-Trainer machen das Üben realistisch.',
    stufen: ['Tisch und Stühle', 'Beamer und Übungspuppe', 'Kursraum mit Reanimationspuppen und Defi-Trainer'],
    cost: [500, 1500, 3800],
    wirkung: 'Gut geübt: +3 % EP in allen Trainings je Stufe',
  },
];

export const HILF_BY_ID = Object.fromEntries(HILFPUNKT.map((h) => [h.id, h])) as Record<HilfId, HilfDef>;

export const hilfLevel = (p: Progress, id: HilfId): number => p.hilfspunkt?.[id] ?? 0;
export const hilfGesamt = (p: Progress): number => HILFPUNKT.reduce((n, h) => n + hilfLevel(p, h.id), 0);
export const HILF_GESAMT_MAX = HILFPUNKT.length * HILF_MAX;

export function hilfKosten(p: Progress, id: HilfId): number | null {
  const l = hilfLevel(p, id);
  return l >= HILF_MAX ? null : HILF_BY_ID[id].cost[l];
}

export function hilfKaufen(p: Progress, id: HilfId): Progress {
  const cost = hilfKosten(p, id);
  if (cost === null || p.budget < cost) return p;
  return { ...p, budget: p.budget - cost, hilfspunkt: { ...p.hilfspunkt, [id]: hilfLevel(p, id) + 1 } };
}

/** Wirkung des Hilfspunkts im Notfall und in Trainings */
export function hilfEffekte(p: Progress) {
  const l = (id: HilfId) => hilfLevel(p, id);
  return {
    falschWeniger: 2 * l('apotheke'),
    richtigPlus: 2 * l('raum'),
    herzPct: 8 * l('defi'),
    pointsPct: 2 * l('netz'),
    trainingPct: 3 * l('kursraum'),
  };
}
