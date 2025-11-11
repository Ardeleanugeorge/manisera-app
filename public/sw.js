// Service Worker pentru Manisera PWA
const CACHE_NAME = 'manisera-v1';
const RUNTIME_CACHE = 'manisera-runtime-v1';

// Resurse de cache la instalare
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/assets/images/icon.png',
  '/assets/images/favicon.png',
];

// Instalare Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching static assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activare Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Strategie de cache: Network First, fallback la cache
self.addEventListener('fetch', (event) => {
  // Ignorăm request-urile non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorăm request-urile către API-uri externe (dacă există)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.pathname.startsWith('/_expo/static')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Încearcă să obțină din rețea
        return fetch(event.request)
          .then((response) => {
            // Dacă răspunsul este valid, cache-uim și returnăm
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            // Dacă rețeaua eșuează, folosim cache-ul
            if (cachedResponse) {
              return cachedResponse;
            }
            // Dacă nu avem cache, returnăm o pagină offline simplă
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Mesaje din aplicație
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

