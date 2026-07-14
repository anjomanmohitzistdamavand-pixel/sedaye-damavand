const CACHE_NAME = 'sedaye-damavand-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // فقط درخواست‌های GET (صفحه و فایل‌های ثابت) کش می‌شوند؛
  // درخواست‌های POST به گوگل‌اسکریپت (ارسال گزارش) همیشه مستقیم به شبکه می‌روند
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resp.clone());
          return resp;
        });
      }).catch(() => cached);
    })
  );
});
