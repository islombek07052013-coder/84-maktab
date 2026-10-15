const C = 'maktab84-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => {
      return c.addAll([
        './',
        'index.html',
        'style.css',
        'script.js',
        'manifest.json',
        'icon.svg'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== C).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
