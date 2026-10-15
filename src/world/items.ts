import { EQUIPMENT_BY_ID, EquipmentId } from '../game/equipment';

/** Gegenstände im Inventar der 3D-Welt – abgeleitet von der eigenen Ausrüstung */
export type ItemArt =
  | 'handy'
  | 'funk'
  | 'weste'
  | 'dreieck'
  | 'verband'
  | 'licht'
  | 'aed'
  | 'decke'
  | 'rucksack'
  | 'monitor'
  | 'beatmung';
export type ItemKind = 'weste' | 'licht' | 'dreieck' | 'notruf' | 'bereitstellen';

export interface ItemDef {
  id: string;
  icon: string;
  name: string;
  art: ItemArt;
  kind: ItemKind;
  /** Was der Gegenstand kann (kurz) */
  text: string;
  /** Name der Ausrüstungsstufe aus der Garage, z. B. „Erweitertes Erste-Hilfe-Set“ */
  stufe?: string;
}

const stufenName = (id: EquipmentId, level: number) => EQUIPMENT_BY_ID[id]?.tiers[Math.max(0, Math.min(3, level - 1))]?.name;

/** Inventar der Rolle: Ersthelfer/innen tragen ihr Auto-Zubehör, Sanitäter/innen den Rucksack und das Funkgerät */
export function itemsFuer(rolle: 'helfer' | 'sani', lv: (id: EquipmentId) => number): ItemDef[] {
  if (rolle === 'helfer') {
    const list: ItemDef[] = [
      {
        id: 'handy',
        icon: '📱',
        name: 'Handy',
        art: 'handy',
        kind: 'notruf',
        text: 'Wählt die 112. Der Rettungswagen fährt mit Blaulicht los.',
        stufe: stufenName('defi', lv('defi')),
      },
      {
        id: 'weste',
        icon: '🦺',
        name: 'Warnweste',
        art: 'weste',
        kind: 'weste',
        text: 'Anziehen: Du wirst besser gesehen und schützt dich selbst.',
        stufe: stufenName('warn', lv('warn')),
      },
      {
        id: 'dreieck',
        icon: '🔺',
        name: 'Warndreieck',
        art: 'dreieck',
        kind: 'dreieck',
        text: 'Aufstellen, um die Stelle abzusichern.',
        stufe: stufenName('warn', lv('warn')),
      },
      {
        id: 'verband',
        icon: '🩹',
        name: 'Verbandkasten',
        art: 'verband',
        kind: 'bereitstellen',
        text: 'Bei der verletzten Person bereitstellen.',
        stufe: stufenName('verbandkasten', lv('verbandkasten')),
      },
      {
        id: 'licht',
        icon: '🔦',
        name: 'Taschenlampe',
        art: 'licht',
        kind: 'licht',
        text: 'An und aus. Leuchtet nachts den Weg.',
        stufe: stufenName('licht', lv('licht')),
      },
    ];
    if (lv('waerme') >= 2)
      list.push({
        id: 'decke',
        icon: '🧣',
        name: 'Rettungsdecke',
        art: 'decke',
        kind: 'bereitstellen',
        text: 'Bei der verletzten Person bereitstellen.',
        stufe: stufenName('waerme', lv('waerme')),
      });
    if (lv('defi') >= 3)
      list.push({
        id: 'aed',
        icon: '🔋',
        name: 'Defibrillator',
        art: 'aed',
        kind: 'bereitstellen',
        text: 'Bei der verletzten Person bereitstellen.',
        stufe: 'Eigener AED',
      });
    return list;
  }
  return [
    {
      id: 'funk',
      icon: '📻',
      name: 'Funkgerät',
      art: 'funk',
      kind: 'notruf',
      text: 'Meldet den Einsatz der Leitstelle. Der Rettungswagen rückt aus.',
      stufe: stufenName('funk', lv('funk')),
    },
    {
      id: 'weste',
      icon: '🦺',
      name: 'Warnweste',
      art: 'weste',
      kind: 'weste',
      text: 'Anziehen: Eigenschutz geht vor.',
      stufe: stufenName('psa', lv('psa')),
    },
    {
      id: 'rucksack',
      icon: '🎒',
      name: 'Notfallrucksack',
      art: 'rucksack',
      kind: 'bereitstellen',
      text: 'Beim Patienten bereitstellen.',
      stufe: stufenName('rucksack', lv('rucksack')),
    },
    {
      id: 'monitor',
      icon: '📈',
      name: 'Monitor-Defi',
      art: 'monitor',
      kind: 'bereitstellen',
      text: 'Beim Patienten bereitstellen.',
      stufe: stufenName('monitor', lv('monitor')),
    },
    {
      id: 'beatmung',
      icon: '🫁',
      name: 'Beatmungsbeutel',
      art: 'beatmung',
      kind: 'bereitstellen',
      text: 'Beim Patienten bereitstellen.',
      stufe: stufenName('beatmung', lv('beatmung')),
    },
    {
      id: 'licht',
      icon: '🔦',
      name: 'Taschenlampe',
      art: 'licht',
      kind: 'licht',
      text: 'An und aus. Leuchtet nachts den Weg.',
      stufe: 'Handlampe',
    },
  ];
}
