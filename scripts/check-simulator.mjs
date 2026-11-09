// Prüft den Patienten-Simulator: node scripts/check-simulator.mjs [--verbose]
// Spielt jedes Szenario mit einem guten Plan, ohne Maßnahmen und mit einem zu späten Plan durch.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const verbose = process.argv.includes('--verbose');
const out = mkdtempSync(join(tmpdir(), 'sim-'));
execFileSync(
  'node',
  [
    'node_modules/typescript/bin/tsc',
    'src/game/simulator.ts',
    'src/game/simAktionen.ts',
    'src/data/simulator.ts',
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
const eng = require(join(out, 'game/simulator.js'));
const akt = require(join(out, 'game/simAktionen.js'));
const { SIM_SZENARIEN } = require(join(out, 'data/simulator.js'));

let fehler = 0;
const f = (text) => {
  fehler++;
  console.log('  ✗ ' + text);
};

/** Führt einen Plan aus: Liste aus [frühestens ab Sekunde, Maßnahme]; blockierte Maßnahmen warten, bis sie gehen */
function lauf(sz, seed, plan, opts = {}) {
  const s = eng.neuerEinsatz(sz, seed);
  const defs = Object.fromEntries(akt.aktionenFuer(sz).map((d) => [d.id, d]));
  const offen = plan.map(([t, id]) => ({ t, id }));
  const dt = 0.25;
  while (!s.ende && s.t < (opts.max ?? 1500)) {
    // Reanimationsregeln des Spielers: nach 2 Minuten wechseln, analysieren, schocken
    if (opts.hlwBot && !s.kreislauf) opts.hlwBot(s, defs);
    for (const o of [...offen]) {
      if (s.t < o.t) continue;
      const d = defs[o.id];
      if (!d) throw new Error('Unbekannte Maßnahme ' + o.id);
      const grund = eng.starteAktion(s, d);
      if (grund === null) offen.splice(offen.indexOf(o), 1);
      else if (opts.verwirf && opts.verwirf(grund)) offen.splice(offen.indexOf(o), 1);
    }
    eng.tick(s, dt);
  }
  return s;
}

/** Ein geübter Helfer bei der Wiederbelebung */
function hlwBot(s, defs) {
  const v = (id) => eng.starteAktion(s, defs[id]);
  if (!s.cpr.an) return v('hlw-an');
  if (s.t - s.cpr.seit > 115) return v('hlw-wechsel');
  if (!s.geraete.pads) return v('pads');
  const a = s.defi.analyse;
  if (s.cpr.an && !a && s.t - (s.flags.letzteAnalyse || 0) > 120 && s.geraete.pads) {
    s.flags.letzteAnalyse = s.t;
    return v('analyse');
  }
  if (a && a.ergebnis === 'schock') return v('schock');
  if (!s.geraete.bvm) v('bvm');
  if (s.geraete.zugang < 1) v('zugang');
  if (s.notarzt.angefordert === null) v('notarzt-rufen');
  if (s.notarzt.da && s.geraete.zugang > 0) {
    v('adrenalin-iv');
    if (s.defi.schocks >= 3) v('amiodaron');
  }
}

const PLAENE = {
  stemi: [[0, 'spo2'], [0, 'ekg'], [10, 'nibp'], [20, 'notarzt-rufen'], [30, 'pads'], [40, 'ekg12'], [60, 'zugang'], [90, 'asa'], [100, 'nitro'], [150, 'klinik-katheter'], [180, 'trage'], [260, 'abfahrt']],
  anaphylaxie: [[0, 'adrenalin-im'], [0, 'allergen'], [10, 'spo2'], [15, 'notarzt-rufen'], [25, 'o2-reservoir'], [35, 'lage-beinehoch'], [50, 'zugang'], [80, 'infusion'], [100, 'klinik-naechste'], [140, 'trage'], [200, 'abfahrt']],
  asthma: [[0, 'spo2'], [0, 'o2-maske'], [5, 'salbutamol'], [20, 'notarzt-rufen'], [30, 'ruhig'], [40, 'lunge'], [100, 'klinik-naechste'], [150, 'trage'], [330, 'abfahrt']],
  hypoglykaemie: [[0, 'bz'], [0, 'spo2'], [20, 'frage-vorerkrankung'], [30, 'glukose-oral'], [150, 'klinik-naechste'], [200, 'trage'], [420, 'abfahrt']],
  lungenoedem: [[0, 'lage-sitzend'], [8, 'o2-reservoir'], [8, 'spo2'], [20, 'nibp'], [30, 'notarzt-rufen'], [50, 'nitro'], [70, 'zugang'], [120, 'klinik-naechste'], [160, 'trage'], [330, 'abfahrt']],
  schlaganfall: [[0, 'bz'], [0, 'spo2'], [10, 'neuro'], [20, 'frage-seit'], [30, 'nibp'], [40, 'zugang'], [60, 'klinik-stroke'], [80, 'trage'], [140, 'abfahrt']],
  herzblock: [[0, 'ekg'], [0, 'spo2'], [20, 'notarzt-rufen'], [30, 'nibp'], [40, 'pads'], [60, 'zugang'], [80, 'ekg12'], [100, 'atropin'], [110, 'schrittmacher'], [150, 'klinik-intensiv'], [170, 'trage'], [470, 'abfahrt']],
  krampf: [[0, 'schuetzen'], [0, 'spo2'], [8, 'o2-maske'], [15, 'bz'], [20, 'notarzt-rufen'], [40, 'zugang'], [70, 'midazolam'], [120, 'lage-seitenlage'], [140, 'klinik-naechste'], [170, 'trage'], [450, 'abfahrt']],
  trauma: [[0, 'tourniquet'], [0, 'spo2'], [20, 'notarzt-rufen'], [30, 'nibp'], [40, 'waerme'], [60, 'zugang'], [90, 'immobil'], [130, 'klinik-schockraum'], [150, 'trage'], [200, 'abfahrt']],
  reanimation: [[5, 'ekg'], [12, 'spo2'], [60, 'ekg12'], [60, 'klinik-katheter'], [60, 'trage'], [60, 'abfahrt']],
};

console.log('Szenario        | Start (SpO2/RR/HF) | guter Plan                         | ohne Maßnahmen');
for (const sz of SIM_SZENARIEN) {
  if (process.env.SZ && sz.id !== process.env.SZ) continue;
  const s0 = eng.neuerEinsatz(sz, 1);
  const start = `${Math.round(s0.w.spo2)}/${Math.round(s0.w.sys)}/${Math.round(s0.w.hf)} gcs ${Math.round(s0.w.gcs)} zu ${eng.zustandProzent(s0)}`;
  const gut = [];
  let ueberlebt = 0;
  const N = 12;
  for (let seed = 1; seed <= N; seed++) {
    const s = lauf(sz, seed, PLAENE[sz.id], sz.id === 'reanimation' ? { hlwBot } : { hlwBot });
    const a = eng.bewerte(s);
    if (a.art === 'uebergabe') ueberlebt++;
    gut.push(`${a.art === 'uebergabe' ? 'Ü' : '†'}${a.sterne}`);
    if (verbose && seed === 1) {
      console.log(s.log.map((l) => `   ${eng.mmss(l.t)} [${l.art}] ${l.text}`).join('\n'));
      console.log('   Ziele:', a.ziele.map((z) => (z.ok ? '✓' : '✗') + z.titel).join(' | '));
    }
  }
  const nichts = lauf(sz, 1, [], { hlwBot: sz.id === 'reanimation' ? () => {} : undefined, max: 1500 });
  const krit = nichts.verlauf.find((p) => p.zustand < 40);
  const ersterStillstand = nichts.verlauf.find((p) => !p.kreislauf);
  const arr = nichts.stillstandSeit !== null || nichts.stillstaende > 0;
  // zu späte Hilfe: derselbe Plan, aber alles 150 Sekunden später
  let spaetUe = 0;
  for (let seed = 1; seed <= N; seed++) {
    const sp = lauf(sz, seed, PLAENE[sz.id].map(([t, id]) => [t + 150, id]), { hlwBot });
    if (sp.ende?.art === 'uebergabe') spaetUe++;
  }
  console.log(`   ↳ unbehandelt: kritisch (<40 %) ab ${krit ? eng.mmss(krit.t) : '–'}, Stillstand ab ${ersterStillstand ? eng.mmss(ersterStillstand.t) : '–'}; Hilfe 150 s zu spät: ${spaetUe}/${N} übergeben`);
  const n2 = nichts.ende ? `${nichts.ende.art} nach ${eng.mmss(nichts.ende.t)}` : `lebt noch (${eng.mmss(nichts.t)}), Stillstände ${nichts.stillstaende}`;
  console.log(`${sz.id.padEnd(15)} | ${start.padEnd(34)} | ${String(ueberlebt).padStart(2)}/${N} übergeben ${gut.slice(0, 6).join(' ')} | ${n2}`);
  if (sz.id !== 'reanimation' && ueberlebt < N - 3) f(`${sz.id}: guter Plan überlebt nur ${ueberlebt}/${N}`);
  if (sz.id !== 'reanimation' && nichts.ende === null && nichts.stillstaende === 0 && sz.id !== 'schlaganfall' && sz.id !== 'hypoglykaemie') f(`${sz.id}: ohne Maßnahmen passiert nichts Schlimmes`);
}
console.log(fehler === 0 ? 'Alles in Ordnung.' : `${fehler} Fehler`);
process.exit(fehler === 0 ? 0 : 1);
