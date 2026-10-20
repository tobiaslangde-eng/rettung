// Erzeugt docs/WISSENSBASIS.md aus den Artikeln: node scripts/build-wissensbasis.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const ORDNER = 'src/data/wissen/';
const NAMEN = {
  'erste-hilfe': 'Erste Hilfe',
  'herz-kreislauf': 'Herz und Kreislauf',
  atmung: 'Atmung',
  'neuro-psyche': 'Nerven, Stoffwechsel und Psyche',
  'trauma-umwelt': 'Verletzungen und Umwelt',
  'kinder-frauen-alter': 'Kinder, Schwangerschaft und Alter',
  'vergiftung-allergie-infektion': 'Vergiftung, Allergie und Infektion',
  koerper: 'Der Körper und Messwerte',
  rettungsdienst: 'Rettungsdienst und Recht',
  begriffe: 'Fachbegriffe und Abkürzungen',
  medikamente: 'Medikamente und Hilfsmittel',
  erkrankungen: 'Häufige Erkrankungen',
  helfen: 'Helfen: Pflicht, Mut und Gefühle',
};
const FUER = { beide: 'für alle', helfer: 'Ersthelfer', sani: 'Rettungsdienst' };

const alle = [];
for (const datei of readdirSync(ORDNER).filter((d) => d.endsWith('.ts') && d !== 'types.ts' && d !== 'index.ts')) {
  const js = ts.transpileModule(readFileSync(ORDNER + datei, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, {
    module: mod,
    exports: mod.exports,
    require: (n) => (n.endsWith('types') ? {} : createRequire(import.meta.url)(n)),
  });
  Object.values(mod.exports)
    .filter(Array.isArray)
    .forEach((l) => alle.push(...l));
}

let md = `# Wissensbasis („App-Wissen“)

> **Wichtig:** Diese Texte wurden mit KI erstellt und **nicht fachlich geprüft**. Sie sind für ein Lernspiel gedacht und ersetzen keine Ausbildung, keine ärztliche Beratung und keine Handlungsanweisung (SOP) deines Rettungsdienstes. Bitte von einer Fachperson (Notfallsanitäter/in, Ärztin/Arzt, Ausbilder/in) gegenlesen lassen, bevor die Inhalte als verlässlich gelten.

Diese Datei wird automatisch erzeugt (\`node scripts/build-wissensbasis.mjs\`) – Änderungen bitte in \`src/data/wissen/*.ts\` machen.
Die App durchsucht diese Artikel bei „Frag Kati“ und in der Lexikon-Suche; mit KI-Funktion bekommt die KI die passenden Artikel als Hintergrundwissen.

**${alle.length} Artikel** in ${Object.keys(NAMEN).length} Bereichen.

## Inhalt

`;
const nachKat = (k) => alle.filter((a) => a.kategorie === k);
for (const [k, n] of Object.entries(NAMEN))
  md += `- [${n}](#${n
    .toLowerCase()
    .replace(/[^a-zäöüß0-9 ]/g, '')
    .replace(/ /g, '-')}) – ${nachKat(k).length} Artikel\n`;
for (const [k, n] of Object.entries(NAMEN)) {
  md += `\n## ${n}\n`;
  for (const a of nachKat(k).sort((x, y) => x.titel.localeCompare(y.titel, 'de'))) {
    md += `\n### ${a.titel}\n_${FUER[a.fuer]} · Suchwörter: ${a.stichworte.join(', ')}_\n\n${a.kurz}\n\n${a.punkte.map((p) => `- ${p}`).join('\n')}\n`;
    if (a.alarm) md += `\n🚨 **Notruf/Arzt:** ${a.alarm}\n`;
    if (a.merke) md += `\n**Merke:** ${a.merke}\n`;
  }
}
writeFileSync('docs/WISSENSBASIS.md', md);
console.log(`docs/WISSENSBASIS.md: ${alle.length} Artikel`);
