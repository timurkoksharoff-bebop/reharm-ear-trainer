const CACHE_NAME = "reharm-ear-trainer-v0.50";
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
  "./assets/bears/reactions/victory.webp",
  "./assets/bears/reactions/failure-01-headslap.webp",
  "./assets/bears/reactions/failure-02-head-grab.webp",
  "./assets/bears/reactions/failure-03-crying.webp",
  "./assets/bears/reactions/failure-04-wrong-dance.gif",
  "./assets/bears/rewards/intro-bear-arrival.webp",
  "./assets/bears/rewards/level-01-triangle.webp",
  "./assets/bears/rewards/level-02-cymbals.webp",
  "./assets/bears/rewards/level-03-tuba.webp",
  "./assets/bears/rewards/level-04-harp.webp",
  "./assets/bears/rewards/level-05-bass-guitar.webp",
  "./assets/bears/rewards/level-06-drum-kit.webp",
  "./assets/bears/rewards/level-07-keytar.webp",
  "./assets/bears/rewards/level-08-upright-bass.webp",
  "./assets/bears/rewards/level-09-flute.webp",
  "./assets/bears/rewards/level-10-violin.webp",
  "./assets/bears/rewards/level-11-electric-guitar.webp",
  "./assets/bears/rewards/level-12-vibraphone.webp",
  "./assets/bears/rewards/level-13-saxophone.webp",
  "./assets/bears/rewards/level-14-trumpet.webp",
  "./assets/bears/rewards/level-15-balalaika.webp",
  "./assets/bears/rewards/level-16-musical-saw.webp",
  "./assets/bears/rewards/coin-art/level-01-triangle.webp",
  "./assets/bears/rewards/coin-art/level-02-cymbals.webp",
  "./assets/bears/rewards/coin-art/level-03-tuba.webp",
  "./assets/bears/rewards/coin-art/level-04-harp.webp",
  "./assets/bears/rewards/coin-art/level-05-bass-guitar.webp",
  "./assets/bears/rewards/coin-art/level-06-drum-kit.webp",
  "./assets/bears/rewards/coin-art/level-07-keytar.webp",
  "./assets/bears/rewards/coin-art/level-08-upright-bass.webp",
  "./assets/bears/rewards/coin-art/level-09-flute.webp",
  "./assets/bears/rewards/coin-art/level-10-violin.webp",
  "./assets/bears/rewards/coin-art/level-11-electric-guitar.webp",
  "./assets/bears/rewards/coin-art/level-12-vibraphone.webp",
  "./assets/bears/rewards/coin-art/level-13-saxophone.webp",
  "./assets/bears/rewards/coin-art/level-14-trumpet.webp",
  "./assets/bears/rewards/coin-art/level-15-balalaika.webp",
  "./assets/bears/rewards/coin-art/level-16-musical-saw.webp",
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
