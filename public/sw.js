// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// ServiceWorker
// ////////////////////////////////////////////////////////////
const cacheName = 'v1';

// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', (event) => {
    event.waitUntil(
	caches
	    .open(cacheName)
	    .then(cache => {
	    return cache.addAll([
		'./',
		'./views/index.html',
		'./views/conductor.html',
		'./styles.css',
		'./icons/hss-64x64.png',
		'./icons/hss-192x192.png',
		'./icons/hss-512x512.png'
	    ]);
	})
    );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
