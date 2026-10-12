// Stellt die Web-App für GitHub Pages zusammen (Ordner dist-pwa/):
// das Spiel als index.html plus Manifest, Icons und Service Worker für den Offline-Betrieb.
//
// Voraussetzung: `npm run build:web` (erzeugt dist/kiirabi.html)
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const out = 'dist-pwa';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync('dist/kiirabi.html', `${out}/index.html`);
cpSync('web', out, { recursive: true });

const build = process.env.GITHUB_SHA?.slice(0, 7) ?? Date.now().toString(36);
const sw = readFileSync(`${out}/sw.js`, 'utf8').replace('__BUILD__', build);
writeFileSync(`${out}/sw.js`, sw);
writeFileSync(`${out}/.nojekyll`, '');

console.log(`Web-App in ${out}/ (Version ${build})`);
