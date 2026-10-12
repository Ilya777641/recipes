// Простой service worker для PWA
const CACHE_NAME = 'recipes-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Просто пропускаем все запросы
  event.respondWith(fetch(event.request));
});