// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// ServiceWorker
// ////////////////////////////////////////////////////////////
const cacheName = 'v1';
const interlayStr = '/views';
const validHtmlPaths = ['conductor', 'player', 'description'];
// 
const isAcceptedHtmlReq = validPaths => req => validPaths.some(elem => req.url.endsWith(elem));
const interlayStrToURL = interString => url => {
    const origin = url.origin;
    const pathname = url.pathname;

    // Return a String object.
    return origin + interString + pathname + '.html';
};
//
const isHtmlReq = isAcceptedHtmlReq(validHtmlPaths);
const interlayToURL = interlayStrToURL(interlayStr);

// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', event => {
    event.waitUntil(
    	caches
    	    .open(cacheName)
    	    .then(cache => {
    	    	return cache.addAll([
    	    	    './',
		    './hss.webmanifest',
    	    	    './views/index.html',
    	    	    './views/conductor.html',
    	    	    './views/player.html',
    	    	    './views/description.html',
    	    	    './styles.css',
    	    	    './javascript/index.js',
		    './javascript/functors.mjs',
		    './javascript/sound.mjs',
		    './javascript/hss.js',
		    './javascript/hnl.mobileConsole.js',
    	    	    './icons/hssIcon_32x32.png',
    	    	    './icons/hssIcon_128x128.png',
    	    	    './icons/hssIcon_152x152.png',
		    './icons/hssIcon_167x167.png',
		    './icons/hssIcon_180x180.png',
		    './icons/hssIcon_192x192.png',
		    './icons/hssIcon_196x196.png'
    	    	]);
    	    })
	    .catch(console.log)
    );
});

self.addEventListener('fetch', event => {
    // Check if request points to '/conductor', '/player' or '/description'.
    // If yes, send the corresponding html file from cache.
    const request = isHtmlReq(event.request) ? new Request(interlayToURL(new URL(event.request.url))) : event.request;

    event.respondWith(
	caches.match(request)
	    .then(response => response || fetch(event.request))
	    .catch(console.log)
    );
});
