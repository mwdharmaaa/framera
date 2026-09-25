const CACHE_NAME = 'framera-cache-v25';
const FONT_CACHE_NAME = 'framera-fonts-v1';

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
  './css/pwa.css',
  './src/app.js',
  './src/core/canvas/bounds.js',
  './src/core/canvas/fallback_renderer.js',
  './src/core/canvas/filters.js',
  './src/core/canvas/halftone.js',
  './src/core/canvas/image_resizer.js',
  './src/core/canvas/renderer.js',
  './src/core/canvas/render_scheduler.js',
  './src/features/camera/camera_modal.js',
  './src/features/camera/camera_photobooth.js',
  './src/features/colorway/colorway_manager.js',
  './src/features/controls/controls_manager.js',
  './src/features/export/export_actions.js',
  './src/features/export/exporter.js',
  './src/features/gallery/category_filter.js',
  './src/features/gallery/gallery_manager.js',
  './src/features/gallery/search_filter.js',
  './src/features/gallery/search_ui.js',
  './src/features/history/history_manager.js',
  './src/features/persistence/persistence_manager.js',
  './src/features/pwa/install_manager.js',
  './src/features/slots/batch_uploader.js',
  './src/features/slots/slot_manager.js',
  './src/features/stage/preview_orchestrator.js',
  './src/features/stage/stage_navigator.js',
  './src/features/stage/canvas_pan_gesture.js',
  './src/features/stickers/sticker_manager.js',
  './src/features/stickers/sticker_renderer.js',
  './src/features/stickers/sticker_types.js',
  './src/features/templates/template_registry.js',
  './src/features/templates/template_samples.js',
  './src/features/theme/theme_manager.js',
  './src/features/typography/typography_manager.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.png',
  './assets/astral_overlay.png',
  './assets/eyes_trend_overlay.png',
  './assets/final_girl_overlay.png',
  './assets/impasto_ridges.png',
  './assets/memory_tree_tree_bg.jpg',
  './assets/ocean_story_bg.jpg',
  './assets/ocean_vinyl_overlay.png',
  './assets/vinyl_trio_overlay.png',
  './assets/locker_playlist_overlay.png',
  './assets/ambient_duo_reference.jpg',
  './assets/photobooth_strip_reference.jpg',
  './assets/life_quad_reference.jpg',
  './assets/ios_share_story_reference.jpg',
  './assets/kraken_eyes_reference.jpg',
  './assets/bnw_duo_reference.jpg',
  './assets/bloom_alone_reference.png',
  './assets/the_sentimental_preview.png',
  './assets/leopard_duo_preview.png',
  './assets/midnight_formula_preview.png',
  './assets/seaside_diptych_preview.png',
  './assets/silver_gelatin_duo_preview.png',
  './assets/metropolis_story_preview.png',
  './assets/binder_clip_duo_preview.png',
  './assets/red_cooked_preview.png',
  './assets/antique_parchment_preview.png',
  './assets/user_provided/1790039442490_0_scaled_1000000128.jpg',
  './assets/user_provided/1790039442536_1_scaled_1000000129.jpg',
  './assets/user_provided/1790039442582_2_scaled_1000000126.jpg',
  './assets/user_provided/1790039442623_3_scaled_1000000127.jpg',
  './assets/user_provided/1790039442665_4_scaled_1000000117.jpg',
  './assets/user_provided/1790039442708_5_scaled_1000000118.jpg',
  './assets/user_provided/1790039442751_6_scaled_1000000119.jpg',
  './assets/user_provided/1790039442794_7_scaled_1000000120.jpg',
  './assets/user_provided/1790039442837_8_scaled_1000000121.jpg',
  './assets/user_provided/1790039442880_9_scaled_1000000122.jpg',
  './assets/user_provided/1790039442924_10_scaled_1000000124.jpg',
  './assets/user_provided/1790039442967_11_scaled_1000000123.jpg',
  './assets/user_provided/1790039443011_12_scaled_1000000125.jpg',
  './assets/user_provided/1790039443054_13_scaled_1000000116.jpg'
];

// Curated template modules for complete offline studio availability
const TEMPLATE_MODULES = [
  'ai_vision_template.js', 'ambient_duo_decorations.js', 'ambient_duo_helpers.js',
  'ambient_duo_template.js', 'analog_tide_helpers.js', 'analog_tide_template.js',
  'astral_koi_template.js', 'binder_clip_duo_helpers.js', 'binder_clip_duo_template.js',
  'bloom_alone_helpers.js', 'bloom_alone_template.js',
  'bnw_duo_decorations.js', 'bnw_duo_helpers.js',
  'bnw_duo_template.js', 'cinema_poster_helpers.js', 'cinema_poster_template.js',
  'comic_portal_template.js', 'cyan_motion_helpers.js', 'cyan_motion_template.js',
  'eyes_trend_helpers.js', 'eyes_trend_template.js', 'final_girl_helpers.js',
  'final_girl_template.js', 'fisheye_helpers.js', 'fisheye_template.js',
  'focus_editorial_template.js', 'folded_poster_creases.js', 'folded_poster_helpers.js',
  'folded_poster_template.js', 'future_awaits_helpers.js', 'future_awaits_template.js',
  'golden_hour_hana_helpers.js', 'golden_hour_hana_template.js', 'imessage_cascade_helpers.js',
  'imessage_cascade_template.js', 'impasto_oil_helpers.js', 'impasto_oil_template.js',
  'instagram95_helpers.js', 'instagram95_template.js', 'inverted_duet_helpers.js',
  'inverted_duet_template.js', 'ios_photosheet_helpers.js', 'ios_photosheet_template.js',
  'ios_story_decorations.js', 'ios_story_helpers.js', 'ios_story_template.js',
  'jura_mountains_diary_helpers.js', 'jura_mountains_diary_template.js',
  'kraken_eyes_decorations.js', 'kraken_eyes_helpers.js', 'kraken_eyes_template.js',
  'leopard_duo_decorations.js', 'leopard_duo_helpers.js', 'leopard_duo_template.js',
  'life_offline_helpers.js', 'life_offline_template.js', 'life_quad_helpers.js',
  'life_quad_template.js', 'life_quad_typography.js', 'locker_playlist_helpers.js',
  'locker_playlist_template.js', 'meadow_patch_helpers.js', 'meadow_patch_template.js',
  'memory_tree_helpers.js', 'memory_tree_template.js',
  'metropolis_story_helpers.js', 'metropolis_story_template.js',
  'midnight_formula_decorations.js', 'midnight_formula_helpers.js', 'midnight_formula_template.js',
  'ocean_stories_helpers.js',
  'ocean_stories_template.js', 'ocean_vinyl_helpers.js', 'ocean_vinyl_template.js',
  'photobooth_strip_decorations.js', 'photobooth_strip_helpers.js', 'photobooth_strip_template.js',
  'seaside_diptych_helpers.js', 'seaside_diptych_template.js',
  'silver_gelatin_helpers.js', 'silver_gelatin_template.js',
  'the_sentimental_helpers.js', 'the_sentimental_template.js',
  'tokyo_brutalist_template.js', 'trip_to_hill_helpers.js', 'trip_to_hill_template.js',
  'vinyl_trio_helpers.js', 'vinyl_trio_template.js', 'whatsapp_chat_helpers.js',
  'whatsapp_chat_template.js', 'wincore_helpers.js', 'wincore_template.js',
  'red_cooked_helpers.js', 'red_cooked_player.js', 'red_cooked_template.js',
  'antique_parchment_fx.js', 'antique_parchment_helpers.js', 'antique_parchment_template.js'
].map((file) => `./src/features/templates/${file}`);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const allPrecache = [...STATIC_ASSETS, ...TEMPLATE_MODULES];
      return cache.addAll(allPrecache).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== FONT_CACHE_NAME) {
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

  const url = new URL(event.request.url);

  // Runtime cache for Google Fonts (CSS & WOFF2 webfonts)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // App Shell & Static Modules Cache Strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
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
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const resClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
