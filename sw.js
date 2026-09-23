// Sarthua Bhu-Abhilekh Portal Service Worker (PWA)
const CACHE_NAME = 'sarthua-pwa-v1.3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/jamabandi',
  '/revisional-survey',
  '/cadastral-survey',
  '/bhu-naksha',
  '/services',
  '/glossary',
  '/style.min.css',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/og-image.png'
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
});

// Activate: Remove older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML pages (so user always sees fresh data), Cache-first/Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests from the same origin or CDN assets
  if (req.method !== 'GET') return;

  // Don't intercept large PDF files or external APIs
  if (url.pathname.endsWith('.pdf') || url.hostname.includes('s3') || url.hostname.includes('r2')) {
    return;
  }

  // HTML navigation requests: Network first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            return cached || caches.match('/') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Static assets (CSS, JS, images, fonts): Cache first, fallback to network
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return response;
      }).catch(() => {
        // Silent fail for non-critical assets
      });
    })
  );
});
