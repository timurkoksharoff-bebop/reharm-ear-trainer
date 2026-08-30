const CACHE_NAME = "reharm-ear-trainer-v0.44";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon-32.png?v=0.33",
  "./icon-180.png?v=0.33",
  "./icon-192.png?v=0.33",
  "./icon-512.png?v=0.33",
  "./assets/brand/ear-bear-mark.svg",
  "./assets/brand/ear-bear-mark-approved.png",
  "./assets/brand/ear-trainer-lockup.svg",
  "./assets/atmospheres/air-dawn.jpg",
  "./assets/atmospheres/air-meadow.jpg",
  "./assets/atmospheres/air-lake.jpg",
  "./assets/atmospheres/air-rain.jpg",
  "./assets/atmospheres/air-dusk.jpg",
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
  "./samples/electric-piano/c2f.m4a",
  "./samples/electric-piano/f2f.m4a",
  "./samples/electric-piano/b2f.m4a",
  "./samples/electric-piano/e3f.m4a",
  "./samples/electric-piano/ab3f.m4a",
  "./samples/electric-piano/db4f.m4a",
  "./samples/electric-piano/ab4f.m4a",
  "./samples/electric-piano/db5f.m4a",
  "./samples/electric-piano/g5f.m4a",
  "./samples/electric-piano/db6f.m4a",
  "./samples/electric-piano/ab6f.m4a",
  "./samples/electric-piano/LICENSE.md",
  "./samples/upright-bass/c2.m4a",
  "./samples/upright-bass/e2.m4a",
  "./samples/upright-bass/gs2.m4a",
  "./samples/upright-bass/cs3.m4a",
  "./samples/upright-bass/LICENSE.md",
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
