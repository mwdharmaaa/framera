const CACHE_NAME = 'framera-cache-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/canvas_stage.css',
  './css/controls.css',
  './css/gallery.css',
  './css/layout.css',
  './css/style.css',
  './src/app.js',
  './src/core/canvas/bounds.js',
  './src/core/canvas/fallback_renderer.js',
  './src/core/canvas/filters.js',
  './src/core/canvas/halftone.js',
  './src/core/canvas/renderer.js',
  './src/features/controls/controls_manager.js',
  './src/features/export/export_actions.js',
  './src/features/export/exporter.js',
  './src/features/gallery/gallery_manager.js',
  './src/features/stage/preview_orchestrator.js',
  './src/features/stage/stage_navigator.js',
  './src/features/templates/template_registry.js',
  './src/features/templates/template_samples.js',
  './src/features/theme/theme_manager.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Continue even if some optional dynamic assets fail initial preload
      });
    })
  );
  self.skipWaiting();
});

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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, and revalidate in background (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const resClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return networkResponse;
      }).catch(() => {
        // Fallback for offline navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
