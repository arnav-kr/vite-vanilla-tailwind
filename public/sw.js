/**
 * Template Used: https://gist.github.com/arnav-kr/0ad065605d2fe20967a6da383aef8b72
 */
// SkipWaiting on message from the webpage
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// TODO: Update the cacheName Everytime you want to update your cache
const cacheName = "v0.0.0";
const cacheKeepList = [cacheName] // Add Other names of cache that you don't want to delete

// custom base64
const catob = (data) => atob(data.replace(/\_/g, '+'));
const cbtoa = (data) => btoa(data).replace(/\+/g, '_');

// TODO: Add the default response URL
// When the User is offline and the requested resource is not in the cache then this response will be returned. This needs to be in the cache
defaultResponseURL = "/offline.html";


// TODO: Add your resource's URLs that you want to precache
const preCacheURLs = [
  defaultResponseURL,
  // "./",
];


// Service Worker "install" event listener
self.addEventListener("install", (event) => {
  event.waitUntil(
    // Put the preCache resources in cache on install
    caches.open(cacheName).then((cache) => {
      return cache.addAll(preCacheURLs);
    })
  );
});


// Service Worker "activate" event listener
self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Iterate over the Keys of Cache
    caches.keys().then((keyList) => {
      // Remove the Cache if the name is is not in the cacheKeepList
      return Promise.all(keyList.map((key) => {
        if (cacheKeepList.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});


// Service Worker "fetch" event listener
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        let responseClone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        return caches.match(defaultResponseURL);
      })
    })
  );
});