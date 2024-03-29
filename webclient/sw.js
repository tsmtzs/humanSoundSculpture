/* eslint-env serviceworker */
// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//        by Tassos Tsesmetzis
//
// Web app ServiceWorker.
// ////////////////////////////////////////////////////////////
const cacheName = 'hss-v1'
const interlayStr = '/views'
const validHtmlPaths = ['conductor', 'player', 'description']

const isAcceptedHtmlReq = validPaths => req => validPaths.some(elem => req.url.endsWith(elem))
const interlayStrToURL = interString => url => {
  const origin = url.origin
  const pathname = url.pathname

  return origin + interString + pathname + '.html'
}
const isHtmlReq = isAcceptedHtmlReq(validHtmlPaths)
const interlayToURL = interlayStrToURL(interlayStr)

const assets = [
  '/',
  '/description',
  '/hss.webmanifest',
  '/styles.css',
  '/views/index.html',
  '/views/description.html',
  '/views/offline.html',
  '/javascript/index.mjs',
  '/javascript/offline.mjs',
  '/javascript/parameters.mjs',
  '/icons/hssIcon_180x180.png',
  '/icons/hssIcon_192x192.png',
  '/icons/hssIcon_384x384.png',
  '/icons/hssIcon_512x512.png',
  '/icons/hssIcon_1024x1024.png'
]

// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        return cache.addAll(assets)
      })
      .catch(console.error)
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.filter(key => key !== cacheName).map(key => caches.delete(key)))
    })
  )
})

self.addEventListener('fetch', event => {
  const request = isHtmlReq(event.request) ? new Request(interlayToURL(new URL(event.request.url))) : event.request
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/views/offline.html') )
  )
})
