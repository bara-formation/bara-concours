// Bara Concours - Service Worker
// Version 6.3.54 - V63.54 : Protection défensive isCurrentUserAdmin (évite crash si premium.js pas uploadé)

const CACHE_NAME = 'bara-concours-v6-3-54';

// Ressources CRITIQUES : sans elles l'app ne peut pas démarrer offline
// Si UNE SEULE échoue à cacher, on n'active pas le SW (l'ancien continue à servir)
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './data/questions.js',
  './data/concours.js',
  './data/firebase.js',
  './data/sessions.js',
  './data/premium.js',
  './data/weekly_exam.js'
];

// Ressources OPTIONNELLES : on essaie de les cacher, mais si ça échoue on continue
// (l'app tournera en mode dégradé mais tournera)
const OPTIONAL_ASSETS = [
  './data/notifications.js',
  './data/forum.js',
  './data/forum_firestore.js',
  './data/sessions_firestore.js',
  './data/texts_firestore.js',
  './data/annales.js',
  './data/biometric.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-apple.png',
  './offline.html',
  './privacy-policy.html',
  // V63.44 : Firebase SDK cachés pour démarrage rapide offline
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap'
];

// Installation : d'abord les ressources critiques (atomique), puis les optionnelles (best-effort)
self.addEventListener('install', event => {
  console.log('[SW] Installation V6.3.44');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // 1) Ressources critiques : addAll atomique
      try {
        await cache.addAll(CRITICAL_ASSETS);
        console.log('[SW] ✓ Ressources critiques cachées (' + CRITICAL_ASSETS.length + ')');
      } catch (err) {
        console.error('[SW] ❌ Échec critique — SW non installé:', err);
        throw err; // rejette la promesse d'install → l'ancien SW reste actif
      }

      // 2) Ressources optionnelles : add individuel, échecs tolérés
      const results = await Promise.allSettled(
        OPTIONAL_ASSETS.map(url =>
          cache.add(url).catch(e => {
            console.warn('[SW] ⚠ Optionnel non caché:', url, e.message);
            throw e;
          })
        )
      );
      const okCount = results.filter(r => r.status === 'fulfilled').length;
      console.log('[SW] ✓ Ressources optionnelles cachées: ' + okCount + '/' + OPTIONAL_ASSETS.length);

      return self.skipWaiting();
    })
  );
});

// Activation : nettoyage des anciens caches (avec sécurité)
self.addEventListener('activate', event => {
  console.log('[SW] Activation V6.3.44');
  event.waitUntil(
    (async () => {
      // Sécurité : vérifier que le nouveau cache contient bien index.html avant de supprimer l'ancien
      const cache = await caches.open(CACHE_NAME);
      const indexOk = await cache.match('./index.html');
      if (!indexOk) {
        console.error('[SW] ⚠ Nouveau cache sans index.html — nettoyage annulé pour éviter de tout perdre');
        return self.clients.claim();
      }

      // Supprimer tous les caches qui ne sont pas le CACHE_NAME courant
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Suppression ancien cache:', k);
          return caches.delete(k);
        })
      );
      return self.clients.claim();
    })()
  );
});

// Fetch : stratégie cache-first pour statiques, network-first pour Firebase live
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // NE PAS intercepter Firebase live (Firestore streams, Auth realtime) — bypass total
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebaseio.com') ||
    url.includes('identitytoolkit.googleapis.com') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('firebaseapp.com') ||
    url.includes('googleapis.com/google.firestore') ||
    url.includes('firebase.googleapis.com')
  ) {
    return;
  }

  // V63.44 : Intercepter aussi le SDK Firebase depuis gstatic (cacheable statique)
  const isOurDomain = url.startsWith(self.location.origin);
  const isGoogleFonts = url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');
  const isFirebaseSDK = url.includes('gstatic.com/firebasejs/');
  if (!isOurDomain && !isGoogleFonts && !isFirebaseSDK) {
    return; // laisse le navigateur gérer (analytics, tracking, etc.)
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Pas en cache : essayer le réseau
      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }
          // Cacher pour la prochaine fois
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(async () => {
          // V63.44 : Fallback offline élargi
          // 1) Navigation → index.html si en cache, sinon offline.html
          if (event.request.mode === 'navigate') {
            const indexCached = await caches.match('./index.html');
            if (indexCached) return indexCached;
            const offlineCached = await caches.match('./offline.html');
            if (offlineCached) return offlineCached;
          }
          // 2) Fichier JS/CSS manquant → réponse vide plutôt que crash
          // (l'app peut se retrouver en mode dégradé mais démarre)
          if (event.request.destination === 'script' || event.request.destination === 'style') {
            return new Response('', { status: 200, headers: { 'Content-Type': event.request.destination === 'script' ? 'application/javascript' : 'text/css' } });
          }
          // 3) Autre : laisser l'erreur remonter
          return Response.error();
        });
    })
  );
});

// Notifications push (Phase 2)
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
