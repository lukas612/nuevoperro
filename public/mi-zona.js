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
      '<details class="menu"><summary aria-label="Abrir menú"><svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menú</span></summary><nav class="menu-panel" aria-label="Menú principal">' +
        '<a href="/cachorro">Plan para cachorros</a><a href="/perro">Plan para perro adulto o adoptado</a><a href="/guias">Guías</a><a href="/razas">Razas</a><a href="/mi-zona">Mi zona</a>' +
        (conSesion ? '<button type="button" id="salir">Cerrar sesión</button>' : '') + '</nav></details>';
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

  // ---------- Hacedlo juntos: invitar a otra persona al plan ----------
  function juntos(d) {
    var el = document.getElementById('juntos');
    var planes = d.planes.filter(function (p) { return !p.extra; });
    if (!el || !planes.length) { if (el) el.remove(); return; }
    var p = planes[0];
    var gente = [p.compartido ? p.dueno : 'Tú'].concat((p.miembros || []).map(function (m) { return m.nombre + (m.aceptado ? '' : ' (invitado)'); }));
    el.innerHTML = '<div class="cab-consejo">' + burbuja('personas', 'lilac') + '<h2 style="font-size:1.3rem">Hacedlo juntos</h2></div>' +
      '<p class="suave">Invita a tu pareja o a quien también cuide de ' + esc(p.nombre) + '. Veréis el mismo plan, lo que marca cada uno y compartiréis el diario.</p>' +
      (gente.length > 1 ? '<div class="ajustes">' + gente.map(function (g) { return '<span class="chip">' + I('persona') + esc(g) + '</span>'; }).join('') + '</div>' : '') +
      (planes.length > 1 ? '<select id="j-plan">' + planes.map(function (x, k) { return '<option value="' + k + '">' + esc(x.nombre + ' · ' + x.titulo) + '</option>'; }).join('') + '</select>' : '') +
      '<input id="j-nombre" type="text" maxlength="30" placeholder="Su nombre (opcional)" autocomplete="off">' +
      '<input id="j-email" type="email" placeholder="Su email" autocomplete="off">' +
      '<p class="error" id="j-err"></p><button class="btn" id="j-enviar">Enviar invitación</button>';
    document.getElementById('j-enviar').onclick = function () {
      var b = this, err = document.getElementById('j-err');
      var sel = document.getElementById('j-plan'), plan = planes[sel ? Number(sel.value) : 0];
      var email = document.getElementById('j-email').value.trim(), nombre = document.getElementById('j-nombre').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Revisa el email.'; return; }
      b.disabled = true; b.textContent = 'Enviando…'; err.textContent = '';
      post('/api/invitar', { t: plan.token, email: email, nombre: nombre }).then(function (j) {
        if (j.error) throw j;
        el.innerHTML = '<div class="cab-consejo">' + burbuja('personas', 'lilac') + '<h2 style="font-size:1.3rem">' + (j.ya ? 'Ya estaba invitado' : 'Invitación enviada') + '</h2></div><p class="suave">Le hemos mandado un email a <b>' + esc(email) + '</b> con el acceso al plan de ' + esc(plan.nombre) + '.</p>';
      }).catch(function (e) { err.textContent = (e && e.error) || 'No se ha podido enviar.'; b.disabled = false; b.textContent = 'Enviar invitación'; });
    };
  }

  function zona(d) {
    cabecera(true);
    var hoy = Math.floor(Date.now() / 864e5), idxConsejo = hoy % d.consejos.length;
    var nombres = d.planes.map(function (p) { return p.nombre; });
    var sus = function (t) { return String(t).replace(/\{n\}/g, nombres[0] || 'tu perro'); };

    var planes = d.planes.length ? d.planes.map(function (p) {
      var hechas = Math.max(progreso(p.token, p.dias), Object.keys(p.progreso || {}).filter(function (k) { return /^d\d+$/.test(k) && p.progreso[k].v && Number(k.slice(1)) <= p.dias; }).length);
      var dia = Math.min(p.dias, Math.max(1, Math.round((new Date().setHours(0, 0, 0, 0) - new Date(p.desde).setHours(0, 0, 0, 0)) / 864e5) + 1));
      return '<a class="plan-tarjeta" href="/plan/' + esc(p.token) + '">' +
        '<span class="avatar">' + D.cara(p.razaId, { lengua: true }) + '</span>' +
        '<span class="pila" style="gap:6px;min-width:0;flex:1"><small class="eti-peq">' + esc(p.titulo) + (p.extra ? ' · Programa extra' : '') + '</small><b>' + esc(p.nombre) + '</b>' +
        '<span class="peq suave">Día ' + dia + ' de ' + p.dias + ' · ' + hechas + (hechas === 1 ? ' tarea hecha' : ' tareas hechas') + '</span>' +
        '<span class="barra-mini"><i style="width:' + Math.max(3, hechas / p.dias * 100) + '%"></i></span>' +
        (p.compartido ? '<span class="peq suave">' + I('personas') + ' Te lo compartió ' + esc(p.dueno) + '</span>' : (p.miembros && p.miembros.length ? '<span class="peq suave">' + I('personas') + ' Con ' + esc(p.miembros.map(function (m) { return m.nombre; }).join(', ')) + '</span>' : '')) +
        '</span>' +
        '<span class="eleccion-flecha">' + I('flecha') + '</span></a>';
    }).join('') : '<div class="tarjeta"><p>Todavía no hay ningún plan enviado a este email. Si acabas de comprar, te llegará por email en unos minutos.</p></div>';

    var seguro = d.seguros;
    var botonSeguro = seguro.url
      ? '<a class="btn" id="seguro-btn" href="' + esc(seguro.url) + '" target="_blank" rel="sponsored noopener">' + I('escudo') + 'Comparar seguros' + (seguro.socio ? ' con ' + esc(seguro.socio) : '') + '</a><p class="peq suave">Enlace de colaboración: si contratas, podemos recibir una comisión sin coste para ti.</p>'
      : '<button class="btn sec" id="seguro-btn">' + I('escudo') + 'Avísame cuando podáis comparar seguros</button>';

    var productos = d.productos.map(function (x) {
      return '<div class="inc"><b>' + esc(x.nombre) + '</b><span class="suave">' + esc(x.por) + '</span>' +
        (x.url ? '<a class="enlace-afil" data-id="' + esc(x.id) + '" href="' + esc(x.url) + '" target="_blank" rel="sponsored noopener">Ver producto</a>' : '') + '</div>';
    }).join('');
    var hayAfiliados = d.productos.some(function (x) { return x.url; });

    var compartido = d.planes.some(function (p) { return p.compartido || (p.miembros && p.miembros.length); });
    var VISTAS = [
      ['inicio', 'casa', 'Inicio'], ['diario', 'gota', 'Diario'], ['clicker', 'estrella', 'Clicker'],
      ['juntos', 'personas', 'Juntos'], ['mas', 'corazon', 'Para ti']
    ];
    var atajo = function (v, ic, color, t, sub) { return '<button class="zona-atajo" data-ir="' + v + '">' + burbuja(ic, color) + '<b>' + t + '</b><span class="peq suave">' + sub + '</span></button>'; };
    app.innerHTML = '<div class="entra zona-app">' +
      '<div class="pila-g zona-vista" data-vista="inicio">' +
        '<section class="pila"><h1 style="font-size:1.9rem">Hola' + (nombres.length === 1 ? ', aquí tienes todo lo de ' + esc(nombres[0]) : '') + '</h1><p class="suave peq">' + esc(d.email) + '</p></section>' +
        '<section class="pila"><span class="etiqueta">' + (d.planes.length > 1 ? 'Tus planes' : 'Tu plan') + '</span>' + planes + '</section>' +
        '<section class="zona-atajos">' +
          atajo('diario', 'gota', 'sky', 'Diario', 'Apunta pis y caca') + atajo('clicker', 'estrella', 'butter', 'Clicker', 'Marca lo que hace bien') +
          atajo('juntos', 'personas', 'lilac', 'Juntos', compartido ? 'Ya lo compartís' : 'Invita a alguien') + atajo('mas', 'corazon', 'peach', 'Para ti', 'Consejos y recomendaciones') +
        '</section>' +
        '<section class="tarjeta pila consejo"><div class="cab-consejo">' + burbuja('chispa', 'butter') + '<span class="etiqueta">Consejo de hoy</span></div>' +
          '<h2 id="c-tit" style="font-size:1.3rem"></h2><p id="c-txt"></p><button class="btn texto" id="otro" style="align-self:flex-start;width:auto;padding-left:0">Otro consejo</button></section>' +
        '<section class="tarjeta pila" id="instalar"></section>' +
      '</div>' +
      '<div class="pila-g zona-vista" data-vista="diario" hidden><section class="tarjeta pila" id="diario"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="clicker" hidden><section class="tarjeta pila" id="clicker-caja"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="juntos" hidden><section class="tarjeta pila" id="juntos"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="mas" hidden>' +
        '<section class="pila"><span class="etiqueta">Lo que te va a ayudar</span><div class="incluye-grid">' + productos + '</div>' +
          (hayAfiliados ? '<p class="peq suave">Algunos enlaces son de afiliado: si compras, recibimos una pequeña comisión sin coste para ti.</p>' : '') + '</section>' +
        '<section class="tarjeta pila">' + '<div class="cab-consejo">' + burbuja('escudo', 'mint') + '<h2 style="font-size:1.3rem">' + esc(seguro.titulo) + '</h2></div>' +
          '<p>' + esc(seguro.texto) + '</p>' + botonSeguro + '<p class="peq suave">' + esc(seguro.aviso) + '</p></section>' +
        '<section class="club pila" id="club"></section>' +
        '<section class="pila" id="lecturas"></section>' +
      '</div>' +
      '</div>' +
      '<nav class="zona-nav" aria-label="Secciones de Mi zona"><div class="zona-nav-in">' + VISTAS.map(function (v) {
        return '<button data-ir="' + v[0] + '" aria-current="false">' + I(v[1]) + '<span>' + v[2] + '</span></button>';
      }).join('') + '</div></nav>';

    // Navegación por pestañas, con el botón atrás del móvil funcionando (#diario, #clicker…)
    function ir(v, sinHistorial) {
      if (!VISTAS.some(function (x) { return x[0] === v; })) v = 'inicio';
      app.querySelectorAll('.zona-vista').forEach(function (el) { el.hidden = el.dataset.vista !== v; });
      document.querySelectorAll('.zona-nav [data-ir]').forEach(function (b) { b.setAttribute('aria-current', String(b.dataset.ir === v)); });
      if (!sinHistorial && location.hash.slice(1) !== v) history.pushState(null, '', v === 'inicio' ? location.pathname + location.search : '#' + v);
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('[data-ir]').forEach(function (b) { b.addEventListener('click', function () { ir(b.dataset.ir); }); });
    window.addEventListener('popstate', function () { ir(location.hash.slice(1) || 'inicio', true); });
    ir(location.hash.slice(1) || 'inicio', true);

    var H = window.QBP_HERRAMIENTAS;
    if (H) {
      H.instalar(document.getElementById('instalar'));
      H.diario(document.getElementById('diario'), nombres[0] || 'tu perro', compartido);
      H.clicker(document.getElementById('clicker-caja'));
      H.club(document.getElementById('club'), d.enClub);
    }
    juntos(d);
    function pintaConsejo() { var c = d.consejos[idxConsejo % d.consejos.length]; document.getElementById('c-tit').textContent = c[0]; document.getElementById('c-txt').textContent = sus(c[1]); }
    pintaConsejo();
    document.getElementById('otro').onclick = function () { idxConsejo++; pintaConsejo(); };
    var sb = document.getElementById('seguro-btn');
    if (seguro.url) sb.onclick = function () { evento('clic_afiliado', 'seguros'); };
    else sb.onclick = function () { evento('clic_seguros', 'mi-zona'); sb.outerHTML = '<p class="chip ok">' + I('check') + 'Apuntado: te avisaremos</p>'; };
    app.querySelectorAll('.enlace-afil').forEach(function (a) { a.onclick = function () { evento('clic_afiliado', a.dataset.id); }; });

    // Lecturas del blog relacionadas
    fetch('/guias/indice.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (posts) {
      var probs = d.planes.map(function (p) { return p.problema; });
      var lista = posts.filter(function (p) { return probs.indexOf(p.tema) >= 0; }).concat(posts.filter(function (p) { return probs.indexOf(p.tema) < 0; })).slice(0, 4);
      if (!lista.length) return;
      document.getElementById('lecturas').innerHTML = '<span class="etiqueta">Lecturas para ti</span>' + lista.map(function (p) {
        return '<a class="atajo" href="/guias/' + esc(p.slug) + '" style="grid-column:auto">' + burbuja('estrella', 'sky') + '<span>' + esc(p.titulo) + '</span></a>';
      }).join('');
    }).catch(function () {});
  }

  fetch('/api/mi-zona').then(function (r) { if (r.status === 401) return null; return r.json(); })
    .then(function (d) { if (d && d.planes) zona(d); else entrar(); })
    .catch(entrar);
})();
