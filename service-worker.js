const CACHE_NAME = 'my-pwa-cache-v1'; // Name deines Caches. Erhöhe die Version bei Änderungen!
const urlsToCache = [
    '/', // Startseite
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon-192x192.png', // Beispiel-Icon, falls vorhanden
    '/icons/icon-512x512.png'  // Weiteres Beispiel-Icon
    // Füge hier alle weiteren statischen Assets hinzu, die du cachen möchtest (z.B. weitere Bilder, Schriftarten)
];

// Installiere den Service Worker und cache die benötigten Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache geöffnet');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptiere Fetch-Anfragen und bediene sie aus dem Cache (Cache-First-Strategie)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - gib die Antwort aus dem Cache zurück
                if (response) {
                    console.log('Service Worker: Fetch aus Cache für:', event.request.url);
                    return response;
                }
                // Kein Cache hit - fordere die Ressource vom Netzwerk an
                console.log('Service Worker: Fetch vom Netzwerk für:', event.request.url);
                return fetch(event.request);
            })
    );
});

// Aktiviere den Service Worker und lösche alte Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Alten Cache löschen:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});