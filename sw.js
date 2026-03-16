const CACHE='mubasher-thrift-v1';
const ASSETS=['./index.html','./manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Outfit:wght@300;400;500;600&display=swap'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(cached=>{
  if(cached) return cached;
  return fetch(e.request).then(resp=>{
    if(!resp||resp.status!==200||resp.type==='opaque') return resp;
    const clone=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,clone));
    return resp;
  }).catch(()=>caches.match('./index.html'));
})));
