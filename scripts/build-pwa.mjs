// Stellt die Web-App für GitHub Pages zusammen (Ordner dist-pwa/):
// das Spiel als index.html plus Manifest, Icons und Service Worker für den Offline-Betrieb.
//
// Voraussetzung: `npm run build:web` (erzeugt dist/kiirabi.html)
// Mit VORSCHAU=1 entsteht die Testversion für rettung.tankard.de/vorschau/: eigener Name,
// eigener Spielstand, eigener Offline-Speicher und ein „VORSCHAU“-Hinweis im Bild.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const out = 'dist-pwa';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync('dist/kiirabi.html', `${out}/index.html`);
cpSync('web', out, { recursive: true });

const preview = process.env.VORSCHAU === '1';
const build = process.env.GITHUB_SHA?.slice(0, 7) ?? Date.now().toString(36);
let sw = readFileSync(`${out}/sw.js`, 'utf8').replace('__BUILD__', build);
if (preview) {
  sw = sw.replace("const PREFIX = 'kiirabi-';", "const PREFIX = 'vorschau-';");

  const manifest = JSON.parse(readFileSync(`${out}/manifest.webmanifest`, 'utf8'));
  manifest.name += ' (Vorschau)';
  manifest.short_name = 'E112 Vorschau';
  writeFileSync(`${out}/manifest.webmanifest`, JSON.stringify(manifest, null, 2));

  const badge = `<div style="position:fixed;left:50%;bottom:calc(86px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9999;pointer-events:none;background:#FFE226;color:#14173A;border:2px solid #14173A;font:700 10px/1 ui-monospace,monospace;letter-spacing:2px;padding:4px 9px;border-radius:99px;opacity:.92">VORSCHAU ${build}</div>`;
  const html = readFileSync(`${out}/index.html`, 'utf8')
    .replace('<title>Einsatz 112</title>', '<title>Einsatz 112 – Vorschau</title>\n<script>window.E112_VORSCHAU = true;</script>')
    .replace('content="Einsatz 112">', 'content="E112 Vorschau">')
    .replace('<div id="root"></div>', `<div id="root"></div>\n${badge}`);
  if (!html.includes('E112_VORSCHAU')) throw new Error('Vorschau-Kennzeichnung konnte nicht eingefügt werden');
  writeFileSync(`${out}/index.html`, html);
}
writeFileSync(`${out}/sw.js`, sw);
writeFileSync(`${out}/.nojekyll`, '');

console.log(`Web-App in ${out}/ (Version ${build}${preview ? ', Vorschau' : ''})`);
