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
  // Register a service worker hosted at the root of the
  // site using the default scope.
  navigator.serviceWorker
    .register('./sw.js')
    .then(registration => console.log('Service worker registration succeeded:', registration))
    .catch(error => console.log('Service worker registration failed:', error))
} else {
  console.log('Service workers are not supported.')
}
