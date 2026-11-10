/* Aviso para instalar la web como app (y, ya instalada, para activar los avisos).
 * Android/Chrome: botón que abre el diálogo de instalación del sistema. iPhone: los 3 pasos de Safari.
 * Se carga en el plan, en Mi zona y en el test (tras el lead). Uso: QBP_APP.ofrecer({ donde: 'prueba' }).
 * Si se cierra con «Ahora no», no vuelve a salir en 3 días. */
(function () {
  'use strict';
  if (window.QBP_APP) return;
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var ua = navigator.userAgent;
  var ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
  var iosOtro = /iphone|ipad|ipod/i.test(ua) && !ios;
  var movil = /android|iphone|ipad|ipod/i.test(ua);
  var instalada = function () { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; };
  var evento = null, pendiente = null;
  var tok = (document.currentScript && document.currentScript.dataset.t) || (location.pathname.match(/^\/plan\/([a-f0-9]{32})/) || [])[1] || '';

  function uso(que) { try { fetch('/api/uso', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: tok, que: que }), keepalive: true }).catch(function () {}); } catch (e) {} }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); evento = e; window.__qbpInstalar = e;
    if (pendiente) { var o = pendiente; pendiente = null; mostrar(o); }
  });
  window.addEventListener('appinstalled', function () { uso('app_instalada'); cerrar(); });

  // El test no tiene manifest: se añade (y el service worker) para que Chrome permita instalar.
  function preparar() {
    if (!document.querySelector('link[rel="manifest"]')) { var l = document.createElement('link'); l.rel = 'manifest'; l.href = '/manifest.webmanifest'; document.head.appendChild(l); }
    try { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function () {}); } catch (e) {}
  }

  var CSS = '.qa-fondo{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,36,.45);display:flex;align-items:flex-end;justify-content:center;animation:qa-in .2s ease-out}' +
    '.qa-hoja{background:#fff;color:#1b2a41;width:100%;max-width:480px;border-radius:24px 24px 0 0;padding:22px 20px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -8px 30px rgba(0,0,0,.2);font:16px/1.45 Figtree,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column;gap:14px;animation:qa-sube .25s ease-out}' +
    '.qa-cab{display:flex;gap:14px;align-items:center}.qa-cab img{width:56px;height:56px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.15);flex:none}.qa-cab b{display:block;font:800 1.2rem/1.2 "Bricolage Grotesque",system-ui,sans-serif;letter-spacing:-.01em}.qa-cab span{font-size:.88rem;color:#5c6b80}' +
    '.qa-lista{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font-size:.95rem}.qa-lista li{display:flex;gap:10px;align-items:flex-start}.qa-lista li:before{content:"";flex:none;width:20px;height:20px;margin-top:1px;border-radius:50%;background:#dcf3e8 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2317885c%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M5 12l5 5L20 7%27/%3E%3C/svg%3E") center/12px no-repeat}' +
    '.qa-pasos{margin:0;padding:12px 14px 12px 34px;background:#eef2f8;border-radius:14px;display:flex;flex-direction:column;gap:6px;font-size:.93rem}' +
    '.qa-si{border:0;border-radius:14px;background:#ffc83d;color:#1b2a41;font:800 1.02rem Figtree,system-ui,sans-serif;padding:15px;cursor:pointer;width:100%}.qa-no{border:0;background:none;color:#5c6b80;font:600 .9rem Figtree,system-ui,sans-serif;padding:6px;cursor:pointer}' +
    '.qa-err{color:#b8432b;font-size:.85rem;margin:0}.qa-flecha{display:inline-block;vertical-align:-3px;width:18px;height:18px}' +
    '@keyframes qa-in{from{opacity:0}}@keyframes qa-sube{from{transform:translateY(40px);opacity:.4}}' +
    '@media (prefers-color-scheme:dark){.qa-hoja{background:#18233a;color:#edf1f8}.qa-cab span,.qa-no{color:#a3b3c9}.qa-pasos{background:#1f2c46}}';
  var compartir = '<svg class="qa-flecha" viewBox="0 0 24 24" fill="none" stroke="#2546a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

  var abierta = null;
  function cerrar() { if (abierta) { abierta.remove(); abierta = null; } }
  function hoja(html) {
    cerrar();
    if (!document.getElementById('qa-css')) { var s = document.createElement('style'); s.id = 'qa-css'; s.textContent = CSS; document.head.appendChild(s); }
    var f = document.createElement('div'); f.className = 'qa-fondo'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    f.innerHTML = '<div class="qa-hoja">' + html + '</div>';
    f.addEventListener('click', function (e) { if (e.target === f) { ls.set('qa_pospuesto', String(Date.now())); uso('instalar_no'); cerrar(); } });
    document.body.appendChild(f); abierta = f; return f;
  }

  function mostrar(o) {
    var nombre = o.nombre ? ' de ' + o.nombre : '';
    var cab = '<div class="qa-cab"><img src="/icon-192.png" alt=""><div><b>Instala la app' + nombre + '</b><span>Gratis · Sin tiendas · Ocupa casi nada</span></div></div>' +
      '<ul class="qa-lista"><li>El plan' + nombre + ' a un toque, con su icono en tu móvil</li><li>Avisos con la tarea de cada día</li><li>Funciona aunque no tengas cobertura</li></ul>';
    var cuerpo;
    if (evento) cuerpo = '<button class="qa-si" id="qa-si">Instalar ahora</button>';
    else if (ios) cuerpo = '<ol class="qa-pasos"><li>Pulsa ' + compartir + ' <b>Compartir</b>, abajo en Safari.</li><li>Elige <b>Añadir a pantalla de inicio</b>.</li><li>Pulsa <b>Añadir</b>. Listo.</li></ol><button class="qa-si" id="qa-ok">Entendido</button>';
    else if (iosOtro) cuerpo = '<p class="qa-pasos" style="padding-left:14px">Abre esta página en <b>Safari</b> y pulsa ' + compartir + ' Compartir → <b>Añadir a pantalla de inicio</b>.</p><button class="qa-si" id="qa-ok">Entendido</button>';
    else cuerpo = '<ol class="qa-pasos"><li>Abre el menú del navegador (los <b>tres puntos</b>).</li><li>Elige <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>.</li></ol><button class="qa-si" id="qa-ok">Entendido</button>';
    var f = hoja(cab + cuerpo + '<button class="qa-no" id="qa-no">Ahora no</button>');
    ls.set('qa_visto', String(Date.now())); uso('instalar_visto');
    f.querySelector('#qa-no').onclick = function () { ls.set('qa_pospuesto', String(Date.now())); uso('instalar_no'); cerrar(); };
    var ok = f.querySelector('#qa-ok'); if (ok) ok.onclick = function () { ls.set('qa_pospuesto', String(Date.now())); cerrar(); };
    var si = f.querySelector('#qa-si');
    if (si) si.onclick = function () {
      var e = evento; evento = null; if (!e) return cerrar();
      try { e.prompt(); } catch (x) { return cerrar(); }
      uso('instalar_clic');
      e.userChoice.then(function (r) { if (r.outcome !== 'accepted') ls.set('qa_pospuesto', String(Date.now())); cerrar(); }).catch(cerrar);
    };
  }

  /* Ya instalada: ofrecer los avisos (en iPhone solo funcionan desde la app instalada). */
  function avisos() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;
    if (Notification.permission !== 'default' || ls.get('qa_avisos_no')) return;
    navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (sub) return;
      var f = hoja('<div class="qa-cab"><img src="/icon-192.png" alt=""><div><b>¿Te avisamos cada día?</b><span>Un aviso con la tarea del día y las citas del veterinario</span></div></div>' +
        '<button class="qa-si" id="qa-si">Activar avisos</button><p class="qa-err" id="qa-err"></p><button class="qa-no" id="qa-no">Ahora no</button>');
      uso('avisos_visto');
      f.querySelector('#qa-no').onclick = function () { ls.set('qa_avisos_no', String(Date.now())); cerrar(); };
      f.querySelector('#qa-si').onclick = function () {
        var b = this; b.disabled = true;
        Notification.requestPermission().then(function (perm) {
          if (perm !== 'granted') throw new Error('Sin permiso: puedes activarlos en los ajustes del móvil.');
          return Promise.all([navigator.serviceWorker.ready, fetch('/api/push/clave').then(function (r) { return r.json(); })]);
        }).then(function (r) {
          var k = r[1].publica.replace(/-/g, '+').replace(/_/g, '/'); var raw = atob(k + '==='.slice((k.length + 3) % 4)); var arr = new Uint8Array(raw.length);
          for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
          return r[0].pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
        }).then(function (sub) {
          return fetch('/api/push/alta', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) }).then(function (r) { if (r.status === 401) throw new Error('Entra en Mi zona con tu email para activarlos.'); });
        }).then(function () { uso('avisos'); cerrar(); })
          .catch(function (e) { f.querySelector('#qa-err').textContent = (e && e.message) || 'No se han podido activar.'; b.disabled = false; });
      };
    }).catch(function () {});
  }

  function ofrecer(o) {
    o = o || {};
    if (instalada()) { if (!o.soloInstalar) setTimeout(avisos, o.espera || 1500); return; }
    if (!movil && !evento) return; // en ordenador solo si Chrome ofrece instalar
    var pos = Number(ls.get('qa_pospuesto') || 0);
    if (!o.forzar && pos && Date.now() - pos < 3 * 864e5) return;
    preparar();
    var lanzar = function () {
      if (abierta) return;
      if (evento || ios || iosOtro) return mostrar(o);
      // Android: se espera a que Chrome diga que se puede instalar; si no llega, se dan los pasos del menú.
      pendiente = o; setTimeout(function () { if (pendiente) { pendiente = null; if (movil) mostrar(o); } }, 4000);
    };
    setTimeout(lanzar, o.espera || 1200);
  }

  // Un uso al día de la app instalada, para medir cuántos la abren desde el icono.
  if (instalada()) { var hoy = new Date().toDateString(); if (ls.get('qa_app_dia') !== hoy) { ls.set('qa_app_dia', hoy); uso('app'); } }

  window.QBP_APP = { ofrecer: ofrecer, instalada: instalada };
})();
