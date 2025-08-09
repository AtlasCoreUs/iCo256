const CACHE_NAME = 'ico-zen-v1';
const urlsToCache = [
  '/',                   // Page d'accueil
  '/index.html',         // Fichier HTML
  '/manifest.json',      // Fichier de manifeste PWA
  '/icon-192.png',       // Icône pour l'application
  '/icon-512.png'        // Autre icône
  // Ne pas inclure les fichiers générés dynamiquement comme @vite/client, main.tsx, etc.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache)) // Ajout des fichiers dans le cache
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)   // Recherche dans le cache
      .then((response) => {
        if (response) {
          return response;  // Si trouvé dans le cache, on retourne la réponse
        }
        return fetch(event.request); // Sinon, on va chercher sur le réseau
      })
  );
});
