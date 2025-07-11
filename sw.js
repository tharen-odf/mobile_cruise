const CACHE_NAME = 'forest-inventory-cache-v6'; // Updated cache version
const URLS_TO_CACHE = [
    '/index.html',
    '/sw.js',
    'https://cdn.tailwindcss.com/',
    'https://unpkg.com/vue@3/dist/vue.global.js',
    'https://unpkg.com/vue-router@4/dist/vue-router.global.js',
    'https://unpkg.com/dexie@3/dist/dexie.js',
    'https://unpkg.com/primeicons/primeicons.css' // Added PrimeIcons to cache
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => {
            console.log('Service Worker: Caching assets');
            return c.addAll(URLS_TO_CACHE);
        }).catch(error => {
            console.error('Service Worker: Caching failed', error);
        })
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return; // Only cache GET requests

    e.respondWith(
        caches.match(e.request).then(r => {
            // Return cached response if available, otherwise fetch from network
            return r || fetch(e.request).then(res => {
                // If fetch is successful, clone response and put in cache
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => {
                        c.put(e.request, clone);
                    });
                }
                return res;
            });
        }).catch(error => {
            console.error('Service Worker: Fetch failed', error);
            // You could return an offline page here
        })
    );
});

// Clean up old caches (optional, but recommended)
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});