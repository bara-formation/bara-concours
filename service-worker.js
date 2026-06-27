// Bara Concours - Service Worker
// Version 6.3.34 - V63.34 : CMS Textes editables Firestore (16 textes courants)

const CACHE_NAME = 'bara-concours-v6-3-34';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './data/concours.js',
  './data/questions.js',
  './data/firebase.js',
  './data/notifications.js',
  './data/premium.js',
  './data/forum.js',
  './data/forum_firestore.js',
  './data/sessions_firestore.js',
  './data/texts_firestore.js',
  './data/annales.js',
  './data/sessions.js',
  './data/biometric.js',
  './data/weekly_exam.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-apple.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap'
];

// Installation : cache du shell de l'application
self.addEventListener('install', event => {
  console.log('[SW] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache du shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('[SW] Activation');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch : stratégie cache-first pour les ressources statiques
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // V63.24 : NE PAS intercepter les requêtes Firebase / Firestore / Google APIs
  // Ces requêtes sont des WebSockets/streaming temps réel qui ne doivent JAMAIS être cachées
  // Sinon le SW les fait planter et le forum / auth ne marche plus
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebaseio.com') ||
    url.includes('identitytoolkit.googleapis.com') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('firebaseapp.com') ||
    url.includes('googleapis.com/google.firestore') ||
    url.includes('firebase.googleapis.com')
  ) {
    // On laisse le navigateur gérer ces requêtes directement, sans interception
    return;
  }

  // V63.24 : Ne pas intercepter les requêtes vers d'autres origines non-cacheables
  // (analytics, tracking, etc.) — seulement notre domaine + fonts Google
  const isOurDomain = url.startsWith(self.location.origin);
  const isGoogleFonts = url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');
  if (!isOurDomain && !isGoogleFonts) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, fetch et mettre en cache
        return fetch(event.request)
          .then(networkResponse => {
            // Ne mettre en cache que les réponses valides
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // Mode hors ligne : retourner la page d'accueil pour les navigations
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Notifications push (pour Phase 2)
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'Nouveau QCM disponible !',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Bara Concours', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || './')
  );
});
