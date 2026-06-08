const CACHE_NAME = "cakes-josy-silva-v35";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app.css?v=33",
  "/app.js?v=35",
  "/manifest.webmanifest",
  "/assets/logo-cakes-josy-silva-192.png",
  "/assets/logo-cakes-josy-silva-512.png",
  "/assets/logo-cakes-josy-silva-recibo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
