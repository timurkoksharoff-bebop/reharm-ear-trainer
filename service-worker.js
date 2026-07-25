const CACHE_NAME = "reharm-ear-trainer-v0.13";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./samples/piano/C2.mp3",
  "./samples/piano/Ds2.mp3",
  "./samples/piano/Fs2.mp3",
  "./samples/piano/A2.mp3",
  "./samples/piano/C3.mp3",
  "./samples/piano/Ds3.mp3",
  "./samples/piano/Fs3.mp3",
  "./samples/piano/A3.mp3",
  "./samples/piano/C4.mp3",
  "./samples/piano/Ds4.mp3",
  "./samples/piano/Fs4.mp3",
  "./samples/piano/A4.mp3",
  "./samples/piano/C5.mp3",
  "./samples/piano/Ds5.mp3",
  "./samples/piano/Fs5.mp3",
  "./samples/piano/C6.mp3",
  "./samples/piano/Ds6.mp3",
  "./samples/piano/Fs6.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("reharm-ear-trainer-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
