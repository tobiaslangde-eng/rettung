// Offline-Speicher: Beim ersten Öffnen wird das Spiel gespeichert, danach läuft es ohne Internet.
// Bei einer neuen Version (anderer CACHE-Name) wird der alte Speicher ersetzt.
// Live-Version und Vorschau (/vorschau/) liegen auf derselben Adresse: jede löscht nur ihre eigenen alten Speicher.
const PREFIX = 'vorschau-';
const CACHE = PREFIX + '1f25fb5';
const FILES = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Erst das Netz fragen (für Updates), bei fehlender Verbindung aus dem Speicher laden.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))),
  );
});
