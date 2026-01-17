const CACHE_NAME = 'neoplasias-v2'; // Incremente a versão se mudar o código
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalação e Cache dos arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Arquivos em cache');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Força a ativação imediata
});

// Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Assume o controle das abas abertas imediatamente
});

// Estratégia: Tenta Rede, se falhar vai para o Cache (Network First)
// Isso garante que você sempre veja a versão mais nova se houver internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
