// ReComp v2: offline-first assets; network-first navigation so new releases are picked up.
const CACHE = 'recomp-pwa-v14-food-context-1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './enhancements.css', './enhancements.js', './ai-coach.css', './ai-coach.js', './ai-food.css', './ai-food.js', './ai-integrations.css', './ai-integrations.js', './elegant.css', './elegant.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('recomp-pwa-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method !== 'GET')return;
  const url = new URL(req.url);
  if(url.origin===self.location.origin && req.mode==='navigate') {
    event.respondWith(fetch(req).then(res => {if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));}return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.origin===self.location.origin || ['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname)) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res=>{
      if(res.ok || res.type==='opaque'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
      return res;
    })));
  }
});
