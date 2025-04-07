const CACHE_NAME = "socket-app-cache-v1";
const urlsToCache = [
    "/",
    "/resources/bootstrap/css/bootstrap.min.css",
    "/resources/app/css/style.css",
    "/resources/bootstrap/js/bootstrap.bundle.min.js",
    "/resources/app/js/socket-client.js",
    "/resources/images/icons/icon-192x192.png",
    "/resources/images/icons/icon-512x512.png"
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Cache aberto");
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercepta requisições e serve arquivos do cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retorna o recurso do cache, se disponível
            return response || fetch(event.request);
        })
    );
});

// Atualiza o cache quando o Service Worker é ativado
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});