// Prüft die Einsätze des Standard-Spiels (Fälle, Behandlungen, Zwischenfälle): node scripts/check-einsaetze.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const out = mkdtempSync(join(tmpdir(), 'einsaetze-'));
execFileSync(
  'node',
  [
    'node_modules/typescript/bin/tsc',
    'src/data/cases.ts',
    'src/game/zwischenfall.ts',
    'src/data/patientAntworten.ts',
    '--ignoreConfig',
    '--outDir',
    out,
    '--module',
    'commonjs',
    '--target',
    'es2019',
    '--skipLibCheck',
    '--esModuleInterop',
  ],
  { stdio: 'inherit' },
);
writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const require = createRequire(import.meta.url);
const { CASES } = require(join(out, 'data/cases.js'));
const { planeZwischenfaelle, eigeneZwischenfaelle } = require(join(out, 'game/zwischenfall.js'));
const { ZF_ALLGEMEIN } = require(join(out, 'data/einsaetze/zwischenfaelle.js'));
const { ANTWORTEN, SPRECHER } = require(join(out, 'data/patientAntworten.js'));

let fehler = 0;
const f = (id, text) => {
  fehler++;
  console.log(`  ✗ ${id}: ${text}`);
};
const ids = new Set();
const VITALS = ['puls', 'rr', 'spo2', 'af', 'temp', 'bz', 'gcs', 'ekg'];

const pruefeIncident = (id, i, wo) => {
  if (!i.text || i.text.length < 20) f(id, `${wo}: Text zu kurz`);
  if (!Array.isArray(i.options) || i.options.length !== 3 || new Set(i.options).size !== 3) f(id, `${wo}: genau 3 verschiedene Optionen nötig`);
  if (!i.explanation || i.explanation.length < 20) f(id, `${wo}: Erklärung fehlt`);
  if (!(i.afterMeasurements >= 1 && i.afterMeasurements <= 4)) f(id, `${wo}: afterMeasurements ungültig`);
  for (const t of [i.text, i.explanation, ...i.options]) if (/\{name\}|undefined/.test(t)) f(id, `${wo}: Platzhalter übrig`);
};

for (const c of CASES) {
  if (ids.has(c.id)) f(c.id, 'doppelte Kennung');
  ids.add(c.id);
  for (const k of ['diagnosis', 'location', 'dispatch', 'scene', 'explanation']) if (!c[k]) f(c.id, `${k} fehlt`);
  if (!c.distractors || c.distractors.length !== 3) f(c.id, 'genau 3 Ablenker nötig');
  if (c.distractors?.includes(c.diagnosis)) f(c.id, 'Ablenker = Diagnose');
  if (!c.kategorie) f(c.id, 'Kategorie fehlt');
  for (const v of VITALS) if (c.vitals[v] === undefined) f(c.id, `Messwert ${v} fehlt`);
  for (const v of c.keyVitals) if (!VITALS.includes(v)) f(c.id, `keyVital ${v} unbekannt`);
  const richtig = c.treatments.filter((t) => t.correct).length;
  const falsch = c.treatments.length - richtig;
  if (richtig < 3 || falsch < 3) f(c.id, `Behandlungen: ${richtig} richtig / ${falsch} falsch (mind. 3/3)`);
  if (new Set(c.treatments.map((t) => t.text)).size !== c.treatments.length) f(c.id, 'doppelte Behandlung');
  for (const t of c.treatments) if (/\{name\}/.test(t.text)) f(c.id, 'Platzhalter in Behandlung');
  const eigene = eigeneZwischenfaelle(c);
  eigene.forEach((i, n) => pruefeIncident(c.id, i, `Zwischenfall ${n + 1}`));
  if (c.extrem && eigene.length < 2) f(c.id, 'Extremfall braucht mindestens 2 Zwischenfälle');
}
ZF_ALLGEMEIN.forEach((i, n) => pruefeIncident('allgemein', i, `#${n + 1}`));

// Patient fragen: Antworten
const ids2 = new Set(CASES.map((c) => c.id));
for (const [id, satz] of Object.entries(ANTWORTEN)) {
  if (!ids2.has(id)) f(id, 'Antworten für unbekannten Einsatz');
  if (!Array.isArray(satz) || satz.length !== 6 || satz.some((t) => typeof t !== 'string' || t.replace(/^!/, '').trim().length < 3)) f(id, 'Antworten: genau 6 Texte nötig');
  if (Array.isArray(satz) && !satz.some((t) => t.startsWith('!'))) f(id, 'Antworten: mindestens eine wichtige Antwort (!) nötig');
}
for (const id of Object.keys(SPRECHER)) if (!(id in ANTWORTEN)) f(id, 'Sprecher ohne Antworten');
console.log(`${Object.keys(ANTWORTEN).length} Einsätze mit handgeschriebenen Patientenantworten`);

// Planung: viele Durchgänge je Schwierigkeit
const stat = { leicht: 0, mittel: 0, schwer: 0 };
for (const c of CASES) {
  for (const d of ['leicht', 'mittel', 'schwer']) {
    for (let k = 0; k < 20; k++) {
      const plan = planeZwischenfaelle(c, d);
      if (plan.length === 0) f(c.id, 'Plan ohne Zwischenfall');
      stat[d] += plan.length;
    }
  }
}

const proStufe = [1, 2, 3].map((d) => CASES.filter((c) => c.difficulty === d).length);
const kategorien = {};
for (const c of CASES) kategorien[c.kategorie] = (kategorien[c.kategorie] ?? 0) + 1;
console.log(`${CASES.length} Einsätze (leicht ${proStufe[0]}, mittel ${proStufe[1]}, schwer ${proStufe[2]}), Extremfälle: ${CASES.filter((c) => c.extrem).length}`);
console.log('Kategorien:', JSON.stringify(kategorien));
console.log(`${ZF_ALLGEMEIN.length} allgemeine Zwischenfälle; Arten:`, JSON.stringify(ZF_ALLGEMEIN.reduce((m, i) => ({ ...m, [i.art]: (m[i.art] ?? 0) + 1 }), {})));
console.log(fehler === 0 ? 'Alles in Ordnung.' : `${fehler} Fehler`);
process.exit(fehler === 0 ? 0 : 1);
