/* Mi zona: el plan del cliente, consejos, recomendaciones y seguro. */
(function () {
  'use strict';
  var D = window.PERROS, I = D.icono;
  var app = document.getElementById('app'), barra = document.getElementById('barra');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function burbuja(ic, color) { return '<span class="burbuja b-' + color + '">' + I(ic) + '</span>'; }
  function post(url, body) { return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(function (r) { return r.json(); }); }
  function evento(tipo, paso) { post('/api/evento', { tipo: tipo, sid: 'zona', paso: paso, utm: { utm_source: 'mi-zona' } }).catch(function () {}); }
  function progreso(token, dias) {
    var st = {}; try { st = JSON.parse(localStorage.getItem('plan_' + token)) || {}; } catch (e) { /* sin almacenamiento */ }
    var n = 0; for (var i = 1; i <= dias; i++) if (st['d' + i]) n++;
    return n;
  }

  function cabecera(conSesion) {
    barra.innerHTML = '<a class="marca" href="/" style="text-decoration:none;color:inherit">' + D.logo() + D.nombreMarca('Qué Buen Perro') + '</a>' +
      (conSesion ? '<button class="btn texto" id="salir" style="width:auto;margin-left:auto">Salir</button>' : '');
    var s = document.getElementById('salir');
    if (s) s.onclick = function () { post('/api/salir').then(function () { location.reload(); }); };
  }

  function entrar() {
    cabecera(false);
    app.innerHTML = '<div class="pila-g entra"><section class="pila">' +
      '<span class="eyebrow">' + I('candado') + 'Solo para clientes</span><h1>Mi zona</h1>' +
      '<p class="suave">Tu plan, consejos y recomendaciones para tu perro. Escribe el email con el que compraste y te enviamos un enlace para entrar, sin contraseñas.</p></section>' +
      '<form class="pila" id="f"><label for="email" class="peq suave">Tu email</label><input type="email" id="email" required autocomplete="email" placeholder="tu@email.com">' +
      '<button class="btn" type="submit">Enviarme el enlace</button><p class="error" id="msg" role="status"></p></form>' +
      '<p class="nota">' + I('chispa') + '<span>¿Tienes a mano el email de tu plan? Pulsa "Mi zona" arriba en tu plan y entrarás directamente.</span></p></div>';
    document.getElementById('f').onsubmit = function (e) {
      e.preventDefault();
      var email = document.getElementById('email').value.trim(), msg = document.getElementById('msg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Revisa el email: parece que falta algo.'; return; }
      post('/api/acceso', { email: email }).then(function () {
        msg.style.color = 'var(--ok)';
        msg.textContent = 'Si ese email tiene un plan, te acabamos de enviar el enlace. Mira también en promociones o spam.';
      });
    };
  }

  function zona(d) {
    cabecera(true);
    var hoy = Math.floor(Date.now() / 864e5), idxConsejo = hoy % d.consejos.length;
    var nombres = d.planes.map(function (p) { return p.nombre; });
    var sus = function (t) { return String(t).replace(/\{n\}/g, nombres[0] || 'tu perro'); };

    var planes = d.planes.length ? d.planes.map(function (p) {
      var hechas = progreso(p.token, p.dias);
      var dia = Math.min(p.dias, Math.max(1, Math.floor((Date.now() - new Date(p.desde).getTime()) / 864e5) + 1));
      return '<a class="plan-tarjeta" href="/plan/' + esc(p.token) + '">' +
        '<span class="avatar">' + D.cara(p.razaId, { lengua: true }) + '</span>' +
        '<span class="pila" style="gap:6px;min-width:0;flex:1"><small class="eti-peq">' + esc(p.titulo) + '</small><b>' + esc(p.nombre) + '</b>' +
        '<span class="peq suave">Día ' + dia + ' de ' + p.dias + ' · ' + hechas + (hechas === 1 ? ' tarea hecha' : ' tareas hechas') + '</span>' +
        '<span class="barra-mini"><i style="width:' + Math.max(3, hechas / p.dias * 100) + '%"></i></span></span>' +
        '<span class="eleccion-flecha">' + I('flecha') + '</span></a>';
    }).join('') : '<div class="tarjeta"><p>Todavía no hay ningún plan enviado a este email. Si acabas de comprar, te llegará en menos de 24 horas.</p></div>';

    var seguro = d.seguros;
    var botonSeguro = seguro.url
      ? '<a class="btn" id="seguro-btn" href="' + esc(seguro.url) + '" target="_blank" rel="sponsored noopener">' + I('escudo') + 'Comparar seguros' + (seguro.socio ? ' con ' + esc(seguro.socio) : '') + '</a><p class="peq suave">Enlace de colaboración: si contratas, podemos recibir una comisión sin coste para ti.</p>'
      : '<button class="btn sec" id="seguro-btn">' + I('escudo') + 'Avísame cuando podáis comparar seguros</button>';

    var productos = d.productos.map(function (x) {
      return '<div class="inc"><b>' + esc(x.nombre) + '</b><span class="suave">' + esc(x.por) + '</span>' +
        (x.url ? '<a class="enlace-afil" data-id="' + esc(x.id) + '" href="' + esc(x.url) + '" target="_blank" rel="sponsored noopener">Ver producto</a>' : '') + '</div>';
    }).join('');
    var hayAfiliados = d.productos.some(function (x) { return x.url; });

    app.innerHTML = '<div class="pila-g entra">' +
      '<section class="pila"><h1 style="font-size:1.9rem">Hola' + (nombres.length === 1 ? ', aquí tienes todo lo de ' + esc(nombres[0]) : '') + '</h1><p class="suave peq">' + esc(d.email) + '</p></section>' +
      '<section class="pila"><span class="etiqueta">' + (d.planes.length > 1 ? 'Tus planes' : 'Tu plan') + '</span>' + planes + '</section>' +
      '<section class="tarjeta pila consejo"><div class="cab-consejo">' + burbuja('chispa', 'butter') + '<span class="etiqueta">Consejo de hoy</span></div>' +
        '<h2 id="c-tit" style="font-size:1.3rem"></h2><p id="c-txt"></p><button class="btn texto" id="otro" style="align-self:flex-start;width:auto;padding-left:0">Otro consejo</button></section>' +
      '<section class="tarjeta pila">' + '<div class="cab-consejo">' + burbuja('escudo', 'mint') + '<h2 style="font-size:1.3rem">' + esc(seguro.titulo) + '</h2></div>' +
        '<p>' + esc(seguro.texto) + '</p>' + botonSeguro + '<p class="peq suave">' + esc(seguro.aviso) + '</p></section>' +
      '<section class="pila"><span class="etiqueta">Lo que te va a ayudar</span><div class="incluye-grid">' + productos + '</div>' +
        (hayAfiliados ? '<p class="peq suave">Algunos enlaces son de afiliado: si compras, recibimos una pequeña comisión sin coste para ti.</p>' : '') + '</section>' +
      '<section class="pila" id="lecturas"></section>' +
      '</div>';

    function pintaConsejo() { var c = d.consejos[idxConsejo % d.consejos.length]; document.getElementById('c-tit').textContent = c[0]; document.getElementById('c-txt').textContent = sus(c[1]); }
    pintaConsejo();
    document.getElementById('otro').onclick = function () { idxConsejo++; pintaConsejo(); };
    var sb = document.getElementById('seguro-btn');
    if (seguro.url) sb.onclick = function () { evento('clic_afiliado', 'seguros'); };
    else sb.onclick = function () { evento('clic_seguros', 'mi-zona'); sb.outerHTML = '<p class="chip ok">' + I('check') + 'Apuntado: te avisaremos</p>'; };
    app.querySelectorAll('.enlace-afil').forEach(function (a) { a.onclick = function () { evento('clic_afiliado', a.dataset.id); }; });

    // Lecturas del blog relacionadas
    fetch('/blog/indice.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (posts) {
      var probs = d.planes.map(function (p) { return p.problema; });
      var lista = posts.filter(function (p) { return probs.indexOf(p.tema) >= 0; }).concat(posts.filter(function (p) { return probs.indexOf(p.tema) < 0; })).slice(0, 4);
      if (!lista.length) return;
      document.getElementById('lecturas').innerHTML = '<span class="etiqueta">Lecturas para ti</span>' + lista.map(function (p) {
        return '<a class="atajo" href="/blog/' + esc(p.slug) + '" style="grid-column:auto">' + burbuja('estrella', 'sky') + '<span>' + esc(p.titulo) + '</span></a>';
      }).join('');
    }).catch(function () {});
  }

  fetch('/api/mi-zona').then(function (r) { if (r.status === 401) return null; return r.json(); })
    .then(function (d) { if (d && d.planes) zona(d); else entrar(); })
    .catch(entrar);
})();
