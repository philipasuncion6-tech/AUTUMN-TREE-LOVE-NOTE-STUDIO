const CACHE_NAME = "autumn-tree-v8";

const LOCAL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/app.js",
  "./js/video.js",
  "./assets/autumn-tree-bench.svg",
  "./assets/autumn-icon.svg",
  "./assets/mother-daughter-autumn.jpg",
  "./assets/winter-snow-bear.svg",
  "./assets/flowers-studio.svg",
  "./assets/romantic-garden.svg",
  "./assets/icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-1024.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Always get the latest HTML/JavaScript from the network first.
  // This prevents an old cached video.js from being used by Chrome.
  const isAppCode =
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js");

  event.respondWith(
    isAppCode
      ? fetch(event.request)
          .then(response => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache =>
                cache.put(event.request, copy)
              );
            }
            return response;
          })
          .catch(() => caches.match(event.request))
      : caches.match(event.request).then(cached => {
          if (cached) return cached;

          return fetch(event.request).then(response => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache =>
                cache.put(event.request, copy)
              );
            }
            return response;
          });
        })
  );
});
