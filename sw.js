/* SARCO dealer app – v54
   App files: shown instantly from the saved copy, refreshed in the background.
   stock.json: always from the network first (newest stock), saved copy only when offline. */
const CACHE = 'sarco-v54';
const SHELL = ['./', 'index.html', 'dealer.css?v=54', 'core.js?v=54', 'sheet.js?v=54', 'dealer.js?v=54', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'logo.jpg', 'sarfaraaz.jpg', 'order-sheet.pdf'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => r.ok && c.put(u, r)).catch(() => { })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const timeout = ms => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (/admin\.(html|js)$/.test(u.pathname) || u.pathname.endsWith('app.css') || /admin\.html/.test(e.request.referrer || '')) return;   /* upload page and everything it loads: always fresh from the network */
  if (u.pathname.endsWith('/stock.json')) {                                                        /* stock: network first */
    e.respondWith(Promise.race([fetch(e.request), timeout(8000)])
      .then(r => { if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put('stock.json', c)); } return r; })
      .catch(() => caches.match('stock.json').then(hit => hit || fetch(e.request))));
    return;
  }
  /* app shell: cache first (instant), update in background */
  e.respondWith(caches.open(CACHE).then(ca => ca.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok) ca.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
