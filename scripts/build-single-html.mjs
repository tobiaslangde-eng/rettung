// Baut aus dem Expo-Web-Export (`npx expo export --platform web`) eine einzige,
// eigenständige HTML-Datei, die überall gehostet oder direkt geöffnet werden kann.
//
// Nutzung: node scripts/build-single-html.mjs [exportDir=dist] [outFile=dist/kiirabi.html] [--fragment]
// Ohne --fragment entsteht ein vollständiges HTML-Dokument zum Herunterladen.
// Mit --fragment nur der Seiteninhalt (für Hosts, die selbst <html>/<head> drumherum setzen).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const fragment = process.argv.includes('--fragment');
const exportDir = args[0] ?? 'dist';
const outFile = args[1] ?? join(exportDir, 'kiirabi.html');

const index = readFileSync(join(exportDir, 'index.html'), 'utf8');
const scriptSrc = index.match(/<script src="\/?([^"]+\.js)"/)?.[1];
if (!scriptSrc) throw new Error('Kein Bundle-Script in index.html gefunden');

// Nur die Schriftschnitte einbetten, die das Theme wirklich nutzt (z. B. 'Inter_700Bold').
const usedFonts = new Set(
  [...readFileSync('src/theme.ts', 'utf8').matchAll(/'(Inter_\w+)'/g)].map((m) => m[1]),
);

let js = readFileSync(join(exportDir, scriptSrc), 'utf8');
js = js.replace(/"\/(assets\/[^"]+\/([A-Za-z]+_\w+?)\.[0-9a-f]+\.ttf)"/g, (whole, path, name) => {
  if (!usedFonts.has(name)) return whole;
  const data = readFileSync(join(exportDir, path)).toString('base64');
  return `"data:font/ttf;base64,${data}"`;
});
// "</script" im Bundle würde das Inline-Script vorzeitig beenden.
js = js.replace(/<\/script/gi, '<\\/script');

const html = `<title>Einsatz 112</title>
<style>
  /* Die App passt sich selbst an: Handy, iPad und PC (mit Seitenleiste). */
  :root { color-scheme: light; }
  html, body { height: 100%; }
  /* Schnelles Tippen (z. B. Herzdruckmassage) soll nicht zoomen. */
  html { touch-action: manipulation; -webkit-text-size-adjust: 100%; }
  body { overflow: hidden; background: #F4F5F7; }
  #root { display: flex; height: 100%; flex: 1; }
  /* Desktop-App: eigene Titelleiste zum Verschieben des Fensters */
  #titlebar { -webkit-app-region: drag; user-select: none; }
  /* Mauszeiger und Scrollbalken für PC und Mac */
  @media (hover: hover) and (pointer: fine) {
    [role="button"], [role="radio"] { cursor: pointer; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-thumb { background: rgba(95, 102, 112, 0.45); border-radius: 5px; border: 2px solid transparent; background-clip: content-box; }
    ::-webkit-scrollbar-track { background: transparent; }
  }
</style>
<noscript>Bitte JavaScript aktivieren, um Einsatz 112 zu spielen.</noscript>
<div id="root"></div>
<script>${js}</script>
`;

const doc = fragment
  ? html
  : `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F4F5F7">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Einsatz 112">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="manifest" href="manifest.webmanifest">
</head>
<body style="margin:0">
${html}<script>
  // Offline-Speicher für die Web-App (nur wenn über http(s) ausgeliefert, nicht als Datei/Desktop-App).
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
</script>
</body>
</html>
`;

writeFileSync(outFile, doc);
console.log(`Geschrieben: ${outFile} (${(doc.length / 1024).toFixed(0)} KB)`);
