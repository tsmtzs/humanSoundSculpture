/* eslint-env browser */
// ////////////////////////////////////////////////////////////
//  Human Sound Sculpture
//    by Tassos Tsesmetzis
//
// Web client JavaScript for 'index.html'.
// Register the ServiceWorker.
// ////////////////////////////////////////////////////////////
// from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(new URL('../sw.js', import.meta.url), { type: 'module' })
    .then(registration => { console.log('Service worker registration succeeded:', registration) })
    .catch(console.error)
} else {
  console.log('Service workers are not supported.')
}
