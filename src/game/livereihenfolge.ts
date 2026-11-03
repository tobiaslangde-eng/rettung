import { Ablauf } from '../data/schritte';
import { ablaeufeFuer } from './schritte';
import { LiveFrage } from './liverunde';
import { Rolle } from './rolle';

function mische<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Richtige Antwort plus drei falsche aus demselben Ablauf (bei kurzen Abläufen ergänzt aus anderen) */
function optionenFuer(richtig: string, a: Ablauf, alle: Ablauf[]): { optionen: string[]; index: number } {
  const eigene = a.schritte.filter((s) => s !== richtig);
  const fremde = mische(alle.filter((x) => x.id !== a.id).flatMap((x) => x.schritte)).filter((s) => s !== richtig && !eigene.includes(s));
  const falsch = [...mische(eigene), ...fremde].slice(0, 3);
  const optionen = mische([richtig, ...falsch]);
  return { optionen, index: optionen.indexOf(richtig) };
}

const reihe = (a: Ablauf) => a.schritte.map((s, i) => `${i + 1}. ${s}`).join('  ');

/**
 * Fragen für das Reihenfolge-Rennen: „Was ist der erste Schritt?“, „Was kommt direkt nach …?“, „Was ist der letzte Schritt?“.
 * Aus jedem Ablauf entstehen mehrere mögliche Fragen; gezogen werden höchstens zwei je Ablauf, gemischt.
 */
export function liveReihenfolge(rolle: Rolle, anzahl: number): LiveFrage[] {
  const alle = ablaeufeFuer(rolle);
  const kandidaten: { a: Ablauf; kopf: string; richtig: string }[] = [];
  for (const a of alle) {
    const n = a.schritte.length;
    kandidaten.push({ a, kopf: `${a.titel}: Was ist der ERSTE Schritt?`, richtig: a.schritte[0] });
    kandidaten.push({ a, kopf: `${a.titel}: Was ist der LETZTE Schritt?`, richtig: a.schritte[n - 1] });
    for (let i = 0; i < n - 1; i++) {
      kandidaten.push({ a, kopf: `${a.titel}: Was kommt direkt NACH „${a.schritte[i]}“?`, richtig: a.schritte[i + 1] });
    }
  }
  const proAblauf: Record<string, number> = {};
  const gewaehlt: typeof kandidaten = [];
  for (const k of mische(kandidaten)) {
    if (gewaehlt.length >= anzahl) break;
    if ((proAblauf[k.a.id] ?? 0) >= 2) continue;
    proAblauf[k.a.id] = (proAblauf[k.a.id] ?? 0) + 1;
    gewaehlt.push(k);
  }
  // reicht das nicht aus (wenige Abläufe), darf ein Ablauf öfter vorkommen
  for (const k of mische(kandidaten)) {
    if (gewaehlt.length >= anzahl) break;
    if (!gewaehlt.includes(k)) gewaehlt.push(k);
  }
  return gewaehlt.map(({ a, kopf, richtig }): LiveFrage => {
    const { optionen, index } = optionenFuer(richtig, a, alle);
    return { kopf, optionen, richtig: index, erklaerung: `${a.erklaerung} Richtige Reihenfolge: ${reihe(a)}` };
  });
}
