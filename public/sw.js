// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//				by Tassos Tsesmetzis
//
// Web client javascript.
// ServiceWorker.
// ////////////////////////////////////////////////////////////
const cacheName = 'hss-v1';

// Worker INSTALL event
// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', event => {
    event.waitUntil(
    	caches
    	    .open(cacheName)
    	    .then(cache => {
    	    	return cache.addAll([
    	    	    '/',
		    '/conductor',
		    '/player',
		    '/description',
		    '/hss.webmanifest',
    	    	    '/styles.css',
    	    	    '/javascript/index.js',
		    '/javascript/functors.mjs',
		    '/javascript/sound.mjs',
		    '/javascript/hss.js',
		    '/icons/hssIcon_192x192.png',
		    '/icons/hssIcon_513x513.png'
    	    	]);
    	    })
	    .catch(console.log)
    );
});

// Worker FETCH event
self.addEventListener('fetch', event => {
    event.respondWith(
	caches.match(event.request)
	    .then(response => { return response || fetch(event.request); }).then(resp => {
		return caches.open(cacheName).then(cache => {
		    cache.put(event.request, resp.clone());
		    return resp;
		});
	    })
	    .catch(console.log)
    );
});

// Worker ACTIVATE event
self.addEventListener('activate', event => {
    event.waitUntil(
	caches.keys().then(keyList => {
	    return Promise.all(keyList.map(key => {
		if (key !== cacheName) return caches.delete(key);
	    }));
	})
    );
});
