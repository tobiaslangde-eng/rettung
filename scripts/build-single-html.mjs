// Baut aus dem Expo-Web-Export (`npx expo export --platform web`) eine einzige,
// eigenständige HTML-Datei, die überall gehostet oder direkt geöffnet werden kann.
//
// Nutzung: node scripts/build-single-html.mjs [exportDir=dist] [outFile=dist/kiirabi.html]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const exportDir = process.argv[2] ?? 'dist';
const outFile = process.argv[3] ?? join(exportDir, 'kiirabi.html');

const index = readFileSync(join(exportDir, 'index.html'), 'utf8');
const scriptSrc = index.match(/<script src="\/?([^"]+\.js)"/)?.[1];
if (!scriptSrc) throw new Error('Kein Bundle-Script in index.html gefunden');

// "</script" im Bundle würde das Inline-Script vorzeitig beenden.
const js = readFileSync(join(exportDir, scriptSrc), 'utf8').replace(/<\/script/gi, '<\\/script');

const html = `<title>Kiirabi Rettungseinsatz</title>
<style>
  /* Ein Spielbildschirm im Handyformat, auf breiten Screens mittig vor Schwarz. */
  :root {
    --must: #111111;
    --linen: #F4F1EA;
    --sinine: #0072CE;
    color-scheme: light;
  }
  html, body { height: 100%; }
  body {
    overflow: hidden;
    background: var(--must);
    background-image: repeating-linear-gradient(45deg, transparent 0 22px, rgba(0, 114, 206, 0.12) 22px 24px),
      repeating-linear-gradient(-45deg, transparent 0 22px, rgba(0, 114, 206, 0.12) 22px 24px);
  }
  #root {
    display: flex;
    height: 100%;
    flex: 1;
    max-width: 480px;
    margin: 0 auto;
    background: var(--linen);
    box-shadow: 0 0 0 4px var(--sinine), 0 0 40px rgba(0, 0, 0, 0.6);
  }
  @media (max-width: 480px) {
    #root { box-shadow: none; }
  }
</style>
<noscript>Bitte JavaScript aktivieren, um Kiirabi zu spielen.</noscript>
<div id="root"></div>
<script>${js}</script>
`;

writeFileSync(outFile, html);
console.log(`Geschrieben: ${outFile} (${(html.length / 1024).toFixed(0)} KB)`);
