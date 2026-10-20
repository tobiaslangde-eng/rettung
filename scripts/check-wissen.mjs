// Prüft Wissensartikel: node scripts/check-wissen.mjs src/data/wissen/<datei>.ts [weitere Dateien …]
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const KATEGORIEN = ['erste-hilfe', 'herz-kreislauf', 'atmung', 'neuro-psyche', 'trauma-umwelt', 'kinder-frauen-alter', 'vergiftung-allergie-infektion', 'koerper', 'rettungsdienst', 'begriffe', 'medikamente', 'erkrankungen', 'helfen'];
const dateien = process.argv.slice(2);
if (dateien.length === 0) {
  console.error('Bitte Dateien angeben.');
  process.exit(2);
}
const alle = [];
let fehler = 0;
const f = (art, nachricht) => {
  fehler++;
  console.log(`  ✗ ${art.id ?? '(ohne id)'}: ${nachricht}`);
};
for (const datei of dateien) {
  const quelle = readFileSync(datei, 'utf8');
  const js = ts.transpileModule(quelle, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
  const mod = { exports: {} };
  const req = (n) => (n.endsWith('types') ? {} : createRequire(import.meta.url)(n));
  vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req });
  const listen = Object.values(mod.exports).filter(Array.isArray);
  const artikel = listen.flat();
  console.log(`${datei}: ${artikel.length} Artikel`);
  for (const a of artikel) {
    alle.push(a);
    if (typeof a.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.id)) f(a, 'id ungültig');
    if (!KATEGORIEN.includes(a.kategorie)) f(a, 'kategorie ungültig');
    if (typeof a.id === 'string' && !a.id.startsWith(a.kategorie.split('-')[0] + '-') && !a.id.startsWith(a.kategorie + '-')) f(a, `id muss mit „${a.kategorie.split('-')[0]}-“ beginnen`);
    if (typeof a.titel !== 'string' || a.titel.length < 3 || a.titel.length > 80) f(a, 'titel 3–80 Zeichen');
    if (!Array.isArray(a.stichworte) || a.stichworte.length < 2 || a.stichworte.length > 12 || a.stichworte.some((s) => typeof s !== 'string' || s.length < 2 || s.length > 40)) f(a, 'stichworte: 2–12 Wörter, je 2–40 Zeichen');
    if (typeof a.kurz !== 'string' || a.kurz.length < 20 || a.kurz.length > 280) f(a, 'kurz 20–280 Zeichen');
    const min = a.kategorie === 'begriffe' ? 1 : 3;
    if (!Array.isArray(a.punkte) || a.punkte.length < min || a.punkte.length > 9) f(a, `punkte: ${min}–9 Stück`);
    else a.punkte.forEach((p, i) => { if (typeof p !== 'string' || p.length < 5 || p.length > 240) f(a, `punkt ${i + 1}: 5–240 Zeichen`); });
    if (a.alarm !== undefined && (typeof a.alarm !== 'string' || a.alarm.length < 10 || a.alarm.length > 280)) f(a, 'alarm 10–280 Zeichen');
    if (a.merke !== undefined && (typeof a.merke !== 'string' || a.merke.length < 8 || a.merke.length > 160)) f(a, 'merke 8–160 Zeichen');
    if (!['beide', 'helfer', 'sani'].includes(a.fuer)) f(a, 'fuer ungültig');
    const text = [a.titel, a.kurz, ...(a.punkte ?? []), a.alarm ?? '', a.merke ?? ''].join(' ');
    if (/[*#_`]{2,}|\*\*|^\s*[-*] /m.test(text)) f(a, 'kein Markdown verwenden');
    if (/\b\d+([.,]\d+)?\s*(mg|µg|mcg|ml\/h|IE|I\.E\.|Tropfen|Tabletten)\b/i.test(text)) f(a, 'keine Dosierungen nennen (mg, µg, ml/h, Tropfen, Tabletten)');
    if (/\b(garantiert|heilt sicher|immer wirksam|hilft immer)\b/i.test(text)) f(a, 'zu absolute Heilversprechen vermeiden');
  }
}
const ids = new Map();
for (const a of alle) ids.set(a.id, (ids.get(a.id) ?? 0) + 1);
for (const [id, n] of ids) if (n > 1) f({ id }, `id ${n}× vorhanden`);
const titel = new Map();
for (const a of alle) titel.set(a.titel.toLowerCase(), (titel.get(a.titel.toLowerCase()) ?? 0) + 1);
for (const [t, n] of titel) if (n > 1) f({ id: t }, `titel ${n}× vorhanden`);
console.log(fehler === 0 ? `OK: ${alle.length} Artikel, keine Fehler` : `${fehler} Fehler`);
process.exit(fehler === 0 ? 0 : 1);
