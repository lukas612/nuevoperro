/* Service worker de Qué Buen Perro: permite instalar la web como app y abrir el plan sin conexión.
   Páginas: primero la red y, si no hay, la copia guardada. Estáticos: copia guardada y se actualiza por detrás.
   La API y los pagos nunca pasan por la caché. */
const VERSION = 'qbp-v3';
const PRECARGA = ['/offline.html', '/styles.css', '/perros.js', '/herramientas.js', '/mi-zona.js', '/favicon.svg', '/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECARGA)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    const guardar = url.pathname.startsWith('/plan/') || url.pathname === '/mi-zona';
    e.respondWith(
      fetch(req).then((r) => {
        if (guardar && r.ok) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(req, copia)); }
        return r;
      }).catch(() => caches.match(req).then((r) => r || caches.match('/offline.html')))
    );
    return;
  }
  if (/\.(css|js)$/.test(url.pathname)) {
    // Código: siempre la última versión; la copia guardada solo si no hay conexión
    e.respondWith(fetch(req).then((r) => { if (r.ok) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(req, copia)); } return r; }).catch(() => caches.match(req)));
    return;
  }
  if (/\.(svg|png|webmanifest)$/.test(url.pathname)) {
    e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((guardado) => {
      const red = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => guardado);
      return guardado || red;
    })));
  }
});

// ---------- Avisos en el móvil ----------
// El aviso llega sin contenido: se pide al servidor qué mostrar (así no hay que cifrar el mensaje).
self.addEventListener('push', (e) => {
  e.waitUntil(
    fetch('/api/avisos', { credentials: 'include', cache: 'no-store' }).then((r) => r.json()).catch(() => ({}))
      .then((a) => self.registration.showNotification(a.titulo || 'Qué Buen Perro', {
        body: a.texto || 'Tienes novedades en Mi zona.', icon: '/icon-192.png', badge: '/icon-192.png', data: { url: a.url || '/mi-zona' }, tag: a.url || 'qbp'
      }))
  );
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const destino = new URL((e.notification.data && e.notification.data.url) || '/mi-zona', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) => {
    for (const w of ws) if (w.url.startsWith(self.location.origin) && 'focus' in w) { w.navigate(destino); return w.focus(); }
    return self.clients.openWindow(destino);
  }));
});
