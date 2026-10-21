import { aktenListe, cluesFor } from './detective';
import { Hinweis, LiveFrage } from './liverunde';

function mische<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Höchstens sechs Hinweise je Akte, vom Allgemeinen zum Verräterischen (Person, Fundort, Aussage, Befund, Messwert, Aussage …) */
function hinweiseFuer(fall: Parameters<typeof cluesFor>[0]): Hinweis[] {
  const c = cluesFor(fall);
  const von = (kind: string) => c.filter((x) => x.kind === kind);
  const aussagen = von('aussage');
  const messwert = von('messwert')[0];
  const reihe = [
    von('person')[0],
    von('fundort')[0],
    aussagen[0],
    von('befund')[0],
    messwert ?? aussagen[1],
    messwert ? aussagen[1] : aussagen[2],
    messwert ? aussagen[2] : undefined,
  ];
  const einzigartig = reihe.filter((x, i): x is NonNullable<typeof x> => !!x && reihe.indexOf(x) === i).slice(0, 6);
  return einzigartig.map((x) => ({ icon: x.icon, label: x.label, text: x.text }));
}

/** Detektiv-Akten für die Live-Runde: je Krankheitsbild höchstens eine, gemischt aus verschiedenen Bereichen */
export function liveAkten(anzahl: number): LiveFrage[] {
  const nachBild = new Map<string, ReturnType<typeof aktenListe>>();
  for (const a of aktenListe()) nachBild.set(a.bild, [...(nachBild.get(a.bild) ?? []), a]);
  const kandidaten = mische([...nachBild.values()].map((l) => mische(l)[0]));
  const proKategorie: Record<string, number> = {};
  let schwer = 0;
  const gewaehlt: typeof kandidaten = [];
  for (const a of kandidaten) {
    if (gewaehlt.length >= anzahl) break;
    if ((proKategorie[a.kategorie] ?? 0) >= 2 || (a.difficulty === 3 && schwer >= 1)) continue;
    proKategorie[a.kategorie] = (proKategorie[a.kategorie] ?? 0) + 1;
    if (a.difficulty === 3) schwer++;
    gewaehlt.push(a);
  }
  for (const a of kandidaten) if (gewaehlt.length < anzahl && !gewaehlt.includes(a)) gewaehlt.push(a);
  return gewaehlt.map((a) => {
    const optionen = mische([a.diagnosis, ...a.distractors]);
    return {
      kopf: 'Welche Diagnose passt zu dieser Akte?',
      optionen,
      richtig: optionen.indexOf(a.diagnosis),
      erklaerung: `${a.diagnosis}: ${a.explanation}`,
      hinweise: hinweiseFuer(a),
    };
  });
}
