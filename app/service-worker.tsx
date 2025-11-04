/// <reference lib="webworker" />

const CACHE_NAME = "vendas-app-v1"
const urlsToCache = ["/", "/products", "/sales", "/payment", "/icon-192.jpg", "/icon-512.jpg"]

const sw = self as unknown as ServiceWorkerGlobalScope

// Install event - cache resources
sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event - serve from cache, fallback to network
sw.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})

// Activate event - clean up old caches
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

export {}
