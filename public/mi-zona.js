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

  // ---------- Prueba gratis: días que quedan, desbloquear y herramientas en pausa al terminar ----------
  function prueba(d) {
    var p = d.planes.filter(function (x) { return x.prueba; })[0];
    var el = document.getElementById('desbloquear');
    if (!p || !el) return;
    var pr = p.prueba, euros = (pr.precio / 100).toFixed(2).replace('.', ',') + ' €';
    // Durante la prueba no se pide pagar: solo se recuerda que está todo abierto
    if (!pr.terminada) {
      el.hidden = false;
      el.innerHTML = '<div class="cab-consejo">' + burbuja('estrella', 'butter') + '<div><span class="eti-peq">Prueba gratis</span><h2 style="font-size:1.2rem">' + (pr.quedan <= 1 ? 'Hoy es tu último día gratis' : 'Te quedan ' + pr.quedan + ' días gratis') + '</h2></div></div>' +
        '<p class="suave peq">Tienes todo abierto: el plan completo, los protocolos, el diario, el clicker y el carnet de salud. Aprovéchalo con ' + esc(p.nombre) + '.</p>';
      return;
    }
    el.hidden = false;
    el.innerHTML = '<div class="cab-consejo">' + burbuja(pr.terminada ? 'candado' : 'estrella', pr.terminada ? 'peach' : 'butter') + '<div><span class="eti-peq">' + (pr.terminada ? 'Prueba terminada' : 'Prueba gratis') + '</span><h2 style="font-size:1.3rem">' +
      (pr.terminada ? 'El plan de ' + esc(p.nombre) + ' está en pausa' : (pr.quedan <= 1 ? 'Hoy es tu último día gratis' : 'Te quedan ' + pr.quedan + ' días gratis')) + '</h2></div></div>' +
      (pr.terminada ? '<p class="suave">Desbloquea el plan de ' + esc(p.nombre) + ' (' + (p.dias / 7) + ' semanas) y conserva todo lo que habéis hecho. Pago único, para siempre.</p>' : '<p class="suave">Ahora mismo tienes todo abierto: las ' + (p.dias / 7) + ' semanas, los protocolos, el diario, el clicker y el carnet de salud. Para seguir cuando acabe la prueba, desbloquéalo y conservas todo lo que hayáis hecho. Pago único, para siempre.</p>') +
      '<label class="check"><input type="checkbox" id="d-acepto"> <span>Acepto los <a href="/condiciones" target="_blank">términos y condiciones</a>.</span></label>' +
      '<p class="error" id="d-err"></p><button class="btn" id="d-pagar">Desbloquear todo · ' + euros + '</button>';
    var b = document.getElementById('d-pagar'), err = document.getElementById('d-err');
    b.onclick = function () {
      if (!document.getElementById('d-acepto').checked) { err.textContent = 'Acepta los términos y condiciones para continuar.'; return; }
      b.disabled = true; b.textContent = 'Abriendo el pago…'; err.textContent = '';
      var reset = function () { b.disabled = false; b.textContent = 'Desbloquear todo · ' + euros; };
      var redir = function () { post('/api/checkout', { sid: p.sid, desistimiento: true }).then(function (j) { if (j.url) location.href = j.url; else throw j; }).catch(function (e) { err.textContent = (e && e.error) || 'No se ha podido abrir el pago.'; reset(); }); };
      if (!d.stripePk || !window.VENTA) return redir();
      window.VENTA.pagoIntegrado({ pk: d.stripePk, titulo: 'Plan de ' + p.nombre + ' · ' + euros,
        pedir: function () { return post('/api/checkout', { sid: p.sid, desistimiento: true, integrado: true }).then(function (j) { if (j.clientSecret) return j.clientSecret; if (j.url) location.href = j.url; throw j; }); },
        alCerrar: reset, alFallar: redir });
    };
    if (location.hash === '#desbloquear') setTimeout(function () { el.scrollIntoView({ block: 'center' }); el.classList.add('resalta'); }, 300);
    // Al terminar la prueba, las herramientas quedan en pausa
    if (pr.terminada) ['diario', 'salud', 'clicker-caja'].forEach(function (id) {
      var c = document.getElementById(id); if (!c) return;
      c.classList.add('pr-pausa');
      c.insertAdjacentHTML('beforeend', '<a class="bloq-cta pr-pausa-cta" href="#desbloquear">' + I('candado') + '<span>En pausa · desbloquea el plan para seguir</span></a>');
      c.querySelector('.pr-pausa-cta').onclick = function (e) { e.preventDefault(); history.pushState(null, '', location.pathname); window.dispatchEvent(new PopStateEvent('popstate')); setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 50); };
    });
  }

  // ---------- Carnet de salud ----------
  var TIPOS_SALUD = [['vacuna', 'Vacuna', 'vacuna'], ['desp_interna', 'Desparasitación interna', 'escudo'], ['desp_externa', 'Desparasitación externa', 'escudo'], ['veterinario', 'Visita al veterinario', 'corazon'], ['peso', 'Peso', 'huella'], ['otro', 'Otro', 'calendario']];
  var SUGERENCIAS = { vacuna: ['Primera vacuna', 'Segunda vacuna', 'Tercera vacuna', 'Rabia', 'Refuerzo anual'], desp_interna: ['Pastilla de desparasitación'], desp_externa: ['Pipeta', 'Collar antiparasitario', 'Pastilla antipulgas'], veterinario: ['Revisión', 'Chip y registro', 'Esterilización'], otro: ['Peluquería', 'Seguro'] };
  var fechaBonita = function (f) { return f ? new Date(String(f).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; };
  var diasHasta = function (f) { var h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((new Date(String(f).slice(0, 10) + 'T00:00:00') - h) / 864e5); };
  function saludZona(d) {
    var el = document.getElementById('salud');
    var planes = d.planes.filter(function (p) { return !p.extra; });
    if (!el || !planes.length) return;
    var plan = planes[0];
    var pintar = function (regs) {
      var nombreTipo = function (t) { return (TIPOS_SALUD.filter(function (x) { return x[0] === t; })[0] || [0, 'Otro'])[1]; };
      var proximos = regs.filter(function (r) { return r.proxima && diasHasta(r.proxima) >= 0; }).sort(function (a, b) { return a.proxima < b.proxima ? -1 : 1; });
      var pesos = regs.filter(function (r) { return r.tipo === 'peso' && r.peso_kg; });
      el.innerHTML = '<div class="cab-consejo">' + burbuja('vacuna', 'mint') + '<h2 style="font-size:1.3rem">Carnet de salud de ' + esc(plan.nombre) + '</h2></div>' +
        (planes.length > 1 ? '<select id="s-plan">' + planes.map(function (p, k) { return '<option value="' + k + '"' + (p === plan ? ' selected' : '') + '>' + esc(p.nombre) + '</option>'; }).join('') + '</select>' : '') +
        '<p class="suave peq">Apunta lo que te diga tu veterinario y te lo recordamos 3 días antes y el mismo día, por email' + ('PushManager' in window ? ' y en el móvil' : '') + '.</p>' +
        '<span class="etiqueta">Próximos</span>' + (proximos.length ? '<ul class="salud-lista">' + proximos.map(function (r) {
          var dd = diasHasta(r.proxima);
          return '<li><span class="salud-dias' + (dd <= 3 ? ' pronto' : '') + '">' + (dd === 0 ? 'Hoy' : dd === 1 ? 'Mañana' : 'En ' + dd + ' días') + '</span><span><b>' + esc(r.nombre) + '</b><small>' + nombreTipo(r.tipo) + ' · ' + fechaBonita(r.proxima) + '</small></span></li>';
        }).join('') + '</ul>' : '<p class="suave peq">Nada pendiente. Añade la próxima vacuna o desparasitación.</p>') +
        (pesos.length ? '<span class="etiqueta">Peso</span><p><b>' + String(pesos[0].peso_kg).replace('.', ',') + ' kg</b> <span class="suave peq">el ' + fechaBonita(pesos[0].fecha || pesos[0].ts) + (pesos[1] ? ' · antes ' + String(pesos[1].peso_kg).replace('.', ',') + ' kg' : '') + '</span></p>' : '') +
        '<details class="salud-nuevo"><summary class="btn">+ Añadir al carnet</summary><form id="s-form" class="form-datos">' +
          '<label class="campo-d"><span>Qué es</span><select name="tipo">' + TIPOS_SALUD.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('') + '</select></label>' +
          '<label class="campo-d" data-f="nombre"><span>Nombre</span><input type="text" name="nombre" maxlength="80" placeholder="Por ejemplo, Segunda vacuna"><span class="multi-d" id="s-sug"></span></label>' +
          '<label class="campo-d" data-f="peso" hidden><span>Peso (kg)</span><input type="number" name="peso" step="0.1" min="0" inputmode="decimal"></label>' +
          '<label class="campo-d"><span>Hecho el (opcional)</span><input type="date" name="fecha"></label>' +
          '<label class="campo-d" data-f="proxima"><span>Próxima vez (te avisamos)</span><input type="date" name="proxima"></label>' +
          '<label class="campo-d"><span>Nota (opcional)</span><input type="text" name="nota" maxlength="200" placeholder="Lote, clínica, dosis que te indicó…"></label>' +
          '<p class="error" id="s-err"></p><button class="btn" type="submit">Guardar</button></form></details>' +
        '<span class="etiqueta">Historial</span>' + (regs.length ? '<ul class="salud-lista hist">' + regs.map(function (r) {
          return '<li><span><b>' + esc(r.nombre) + (r.peso_kg ? ' · ' + String(r.peso_kg).replace('.', ',') + ' kg' : '') + '</b><small>' + nombreTipo(r.tipo) + (r.fecha ? ' · hecho el ' + fechaBonita(r.fecha) : '') + (r.proxima ? ' · próxima ' + fechaBonita(r.proxima) : '') + (r.por && d.planes.some(function (p) { return p.compartido || (p.miembros && p.miembros.length); }) ? ' · ' + esc(r.por) : '') + '</small>' + (r.nota ? '<small>' + esc(r.nota) + '</small>' : '') + '</span><button class="btn texto" data-borrar-s="' + r.id + '" style="width:auto;min-height:32px;padding:0 6px">Borrar</button></li>';
        }).join('') + '</ul>' : '<p class="suave peq">Aún no has apuntado nada.</p>') +
        '<p class="peq suave">Las vacunas, fechas y dosis las decide tu veterinario. Esto es un recordatorio, no un consejo veterinario.</p>';
      var f = el.querySelector('#s-form');
      var sug = function () {
        var t = f.elements.tipo.value;
        el.querySelector('[data-f="peso"]').hidden = t !== 'peso';
        el.querySelector('[data-f="nombre"]').hidden = t === 'peso';
        el.querySelector('[data-f="proxima"]').hidden = t === 'peso';
        el.querySelector('#s-sug').innerHTML = (SUGERENCIAS[t] || []).map(function (x) { return '<label><input type="radio" name="sug" value="' + esc(x) + '"><span>' + esc(x) + '</span></label>'; }).join('');
        el.querySelectorAll('#s-sug input').forEach(function (r) { r.onchange = function () { f.elements.nombre.value = r.value; }; });
      };
      f.elements.tipo.onchange = sug; sug();
      f.onsubmit = function (e) {
        e.preventDefault();
        var t = f.elements.tipo.value;
        var cuerpo = { t: plan.token, tipo: t, nombre: t === 'peso' ? 'Peso' : f.elements.nombre.value, peso: f.elements.peso.value, fecha: f.elements.fecha.value, proxima: t === 'peso' ? '' : f.elements.proxima.value, nota: f.elements.nota.value };
        if (t === 'peso' && !cuerpo.fecha) cuerpo.fecha = new Date().toISOString().slice(0, 10);
        post('/api/salud', cuerpo).then(function (j) { if (!j.registro) throw j; cargar(); }).catch(function (e) { el.querySelector('#s-err').textContent = (e && e.error) || 'No se ha podido guardar.'; });
      };
      el.querySelectorAll('[data-borrar-s]').forEach(function (b) { b.onclick = function () { post('/api/salud/borrar', { t: plan.token, id: b.dataset.borrarS }).then(cargar); }; });
      var sp = el.querySelector('#s-plan'); if (sp) sp.onchange = function () { plan = planes[Number(sp.value)]; cargar(); };
    };
    var cargar = function () { fetch('/api/salud?t=' + encodeURIComponent(plan.token)).then(function (r) { return r.json(); }).then(function (j) { pintar(j.registros || []); }).catch(function () { pintar([]); }); };
    cargar();
  }

  // ---------- Avisos en el móvil ----------
  function avisosMovil() {
    var el = document.getElementById('avisos');
    if (!el || !('serviceWorker' in navigator)) return;
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent), instalada = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (!('PushManager' in window) || !('Notification' in window)) {
      if (ios && !instalada) { el.hidden = false; el.innerHTML = '<div class="cab-consejo">' + burbuja('chispa', 'butter') + '<h2 style="font-size:1.2rem">Avisos en el móvil</h2></div><p class="suave peq">En iPhone, primero añade Mi zona a tu pantalla de inicio (Compartir → «Añadir a pantalla de inicio») y ábrela desde ahí para activar los avisos.</p>'; }
      return;
    }
    if (Notification.permission === 'denied') return;
    navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (sub && Notification.permission === 'granted') return; // ya activados
      el.hidden = false;
      el.innerHTML = '<div class="cab-consejo">' + burbuja('chispa', 'butter') + '<h2 style="font-size:1.2rem">Activa los avisos en este móvil</h2></div>' +
        '<p class="suave peq">Te avisamos de la tarea del día y de las vacunas y citas del carnet de salud. Puedes quitarlos cuando quieras.</p>' +
        '<button class="btn" id="activar-avisos">Activar avisos</button><p class="error" id="err-avisos"></p>';
      document.getElementById('activar-avisos').onclick = function () {
        var b = this; b.disabled = true;
        Notification.requestPermission().then(function (perm) {
          if (perm !== 'granted') throw new Error('Has bloqueado los avisos. Puedes activarlos en los ajustes del navegador.');
          return Promise.all([navigator.serviceWorker.ready, fetch('/api/push/clave').then(function (r) { return r.json(); })]);
        }).then(function (r) {
          var k = r[1].publica.replace(/-/g, '+').replace(/_/g, '/'); var raw = atob(k + '==='.slice((k.length + 3) % 4)); var arr = new Uint8Array(raw.length);
          for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
          return r[0].pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
        }).then(function (sub) { return post('/api/push/alta', { endpoint: sub.endpoint }); }).then(function () {
          el.innerHTML = '<div class="cab-consejo">' + burbuja('check', 'mint') + '<h2 style="font-size:1.2rem">Avisos activados</h2></div><p class="suave peq">Te acabamos de mandar uno de prueba.</p>';
        }).catch(function (e) { document.getElementById('err-avisos').textContent = (e && e.message) || 'No se han podido activar.'; b.disabled = false; });
      };
    }).catch(function () {});
  }

  // ---------- Catálogo: otros programas a precio de cliente ----------
  function catalogo(d) {
    var el = document.getElementById('catalogo');
    if (!el || !d.catalogo || !d.catalogo.length) { if (el) el.remove(); return; }
    var euros = function (c) { return (c / 100).toFixed(2).replace('.', ',') + ' €'; };
    el.innerHTML = '<span class="etiqueta">Más programas para ' + esc(d.catalogoPara) + '</span>' +
      '<p class="suave peq">Precio para clientes: <b>' + euros(d.precioCliente) + '</b> cada uno (normalmente ' + euros(d.precioNormal) + '). Pago único, para siempre.</p>' +
      d.catalogo.map(function (c) {
        return '<div class="tarjeta pila prog-cat"><div class="cab-consejo">' + burbuja(c.icono || 'estrella', 'mint') + '<div><b>' + esc(c.titulo) + '</b><span class="peq suave"> · ' + c.semanas + ' semanas</span></div></div>' +
          '<p class="suave">' + esc(c.texto) + '</p><button class="btn sec" data-comprar="' + esc(c.id) + '">Añadir por ' + euros(d.precioCliente) + '</button></div>';
      }).join('');
    el.querySelectorAll('[data-comprar]').forEach(function (b) {
      b.onclick = function () {
        var c = d.catalogo.filter(function (x) { return x.id === b.dataset.comprar; })[0];
        var caja = b.parentNode;
        caja.querySelector('.confirma') || caja.insertAdjacentHTML('beforeend', '<div class="confirma pila"><label class="check"><input type="checkbox" class="c-des"> <span>Acepto los <a href="/condiciones" target="_blank">términos y condiciones</a>.</span></label>' +
          '<p class="peq suave">Se cobra en la tarjeta con la que compraste; si tu banco pide confirmarlo, te lo pedimos aquí.</p><p class="error c-err"></p><button class="btn c-ok">Comprar ' + esc(c.titulo) + ' · ' + euros(d.precioCliente) + '</button></div>');
        b.remove();
        var ok = caja.querySelector('.c-ok'), err = caja.querySelector('.c-err');
        ok.onclick = function () {
          if (!caja.querySelector('.c-des').checked) { err.textContent = 'Acepta los términos y condiciones para continuar.'; return; }
          ok.disabled = true; ok.textContent = 'Comprando…'; err.textContent = '';
          var cuerpo = { programa: c.id, desistimiento: true, integrado: !!d.stripePk };
          post('/api/programa', cuerpo).then(function (j) {
            if (j.ok) { caja.innerHTML = '<div class="cab-consejo">' + burbuja('check', 'mint') + '<b>¡Añadido!</b></div><p>' + esc(c.titulo) + ' ya es tuyo. Te llevamos a él…</p>'; setTimeout(function () { location.href = j.token ? '/plan/' + j.token : '/mi-zona'; }, 1500); return; }
            if (j.url) { location.href = j.url; return; }
            if (j.clientSecret && window.VENTA) {
              window.VENTA.pagoIntegrado({ pk: d.stripePk, titulo: c.titulo + ' · ' + euros(d.precioCliente), pedir: function () { return Promise.resolve(j.clientSecret); },
                alCerrar: function () { ok.disabled = false; ok.textContent = 'Comprar ' + c.titulo + ' · ' + euros(d.precioCliente); },
                alFallar: function () { err.textContent = 'No se ha podido abrir el pago. Inténtalo de nuevo.'; ok.disabled = false; } });
              return;
            }
            throw j;
          }).catch(function (e) { err.textContent = (e && e.error) || 'No se ha podido completar. Inténtalo de nuevo.'; ok.disabled = false; ok.textContent = 'Comprar ' + c.titulo + ' · ' + euros(d.precioCliente); });
        };
      };
    });
  }

  // ---------- Editar los datos del plan ----------
  function editor(token) {
    var el = document.getElementById('editar');
    el.dataset.t = token;
    el.innerHTML = '<p class="suave">Cargando…</p>';
    fetch('/api/plan/datos?t=' + encodeURIComponent(token)).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.campos) { el.innerHTML = '<p>No se han podido cargar los datos.</p>'; return; }
      var r = d.respuestas || {};
      el.innerHTML = '<div class="cab-consejo">' + burbuja('persona', 'peach') + '<h2 style="font-size:1.3rem">Los datos de ' + esc(r.nombre || 'tu perro') + '</h2></div>' +
        '<p class="suave peq">Cámbialos si algo no era así: su plan se rehace con los datos nuevos y conservas lo que ya has marcado.</p>' +
        (d.fijo ? '<p class="chip">' + I('candado') + 'Programa: ' + esc(d.fijo) + '</p>' : '') +
        '<form id="form-datos" class="form-datos">' + d.campos.map(function (c) {
          var v = r[c.id];
          if (c.tipo === 'text') return '<label class="campo-d"><span>' + esc(c.t) + '</span><input type="text" name="' + c.id + '" maxlength="40" value="' + esc(v || '') + '"></label>';
          if (c.tipo === 'select') return '<label class="campo-d"><span>' + esc(c.t) + '</span><select name="' + c.id + '">' + c.ops.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>';
          return '<fieldset class="campo-d"><legend>' + esc(c.t) + '</legend><div class="multi-d">' + c.ops.map(function (o) {
            return '<label><input type="checkbox" name="' + c.id + '" value="' + esc(o[0]) + '"' + ((v || []).indexOf(o[0]) >= 0 ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
          }).join('') + '</div></fieldset>';
        }).join('') +
        '<p class="error" id="err-datos"></p><button class="btn" type="submit">Guardar y actualizar su plan</button>' +
        '<button class="btn texto" type="button" id="cancelar-datos">Cancelar</button></form>';
      document.getElementById('cancelar-datos').onclick = function () { history.back(); };
      document.getElementById('form-datos').onsubmit = function (e) {
        e.preventDefault();
        var f = e.target, cambios = {};
        d.campos.forEach(function (c) {
          if (c.tipo === 'multi') cambios[c.id] = [].slice.call(f.querySelectorAll('input[name="' + c.id + '"]:checked')).map(function (x) { return x.value; });
          else cambios[c.id] = f.elements[c.id].value;
        });
        var b = f.querySelector('button[type="submit"]'); b.disabled = true; b.textContent = 'Guardando…';
        post('/api/plan/datos', { t: token, cambios: cambios }).then(function (j) {
          if (!j.ok) throw j;
          el.innerHTML = '<div class="cab-consejo">' + burbuja('check', 'mint') + '<h2 style="font-size:1.3rem">Guardado</h2></div><p>El plan de ' + esc(j.respuestas.nombre || 'tu perro') + ' ya está actualizado con los datos nuevos.</p><a class="btn" href="/plan/' + esc(token) + '">Ver su plan</a>';
          setTimeout(function () { location.href = '/mi-zona'; }, 2500);
        }).catch(function () { document.getElementById('err-datos').textContent = 'No se ha podido guardar. Inténtalo de nuevo.'; b.disabled = false; b.textContent = 'Guardar y actualizar su plan'; });
      };
    }).catch(function () { el.innerHTML = '<p>No se han podido cargar los datos.</p>'; });
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
      return '<div class="plan-bloque"><a class="plan-tarjeta" href="/plan/' + esc(p.token) + '">' +
        '<span class="avatar">' + D.cara(p.razaId, { lengua: true }) + '</span>' +
        '<span class="pila" style="gap:6px;min-width:0;flex:1"><small class="eti-peq">' + esc(p.titulo) + (p.extra ? ' · Programa extra' : '') + '</small><b>' + esc(p.nombre) + '</b>' +
        '<span class="peq suave">Día ' + dia + ' de ' + p.dias + ' · ' + hechas + (hechas === 1 ? ' tarea hecha' : ' tareas hechas') + '</span>' +
        '<span class="barra-mini"><i style="width:' + Math.max(3, hechas / p.dias * 100) + '%"></i></span>' +
        (p.compartido ? '<span class="peq suave">' + I('personas') + ' Te lo compartió ' + esc(p.dueno) + '</span>' : (p.miembros && p.miembros.length ? '<span class="peq suave">' + I('personas') + ' Con ' + esc(p.miembros.map(function (m) { return m.nombre; }).join(', ')) + '</span>' : '')) +
        '</span>' +
        '<span class="eleccion-flecha">' + I('flecha') + '</span></a>' +
        '<div class="plan-acciones">' + (p.prueba ? '' : '<a href="/plan/' + esc(p.token) + '/nevera">' + I('calendario') + 'Imprimir</a>') +
          (p.extra ? '' : '<button type="button" data-editar="' + esc(p.token) + '">' + I('persona') + 'Editar datos</button>') + '</div></div>';
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
    var principal = d.planes.filter(function (p) { return !p.extra; })[0] || d.planes[0] || null;
    var VISTAS = [
      ['inicio', 'casa', 'Inicio'], ['diario', 'gota', 'Diario'], ['salud', 'vacuna', 'Salud'],
      ['clicker', 'estrella', 'Clicker'], ['mas', 'corazon', 'Para ti']
    ];
    var atajo = function (v, ic, color, t, sub) { return '<button class="zona-atajo" data-ir="' + v + '">' + burbuja(ic, color) + '<b>' + t + '</b><span class="peq suave">' + sub + '</span></button>'; };
    app.innerHTML = '<div class="entra zona-app">' +
      '<div class="pila-g zona-vista" data-vista="inicio">' +
        '<section class="pila"><h1 style="font-size:1.9rem">Hola' + (nombres.length === 1 ? ', aquí tienes todo lo de ' + esc(nombres[0]) : '') + '</h1><p class="suave peq">' + esc(d.email) + '</p></section>' +
        '<section class="pila"><span class="etiqueta">' + (d.planes.length > 1 ? 'Tus planes' : 'Tu plan') + '</span>' + planes + '</section>' +
        '<section class="tarjeta pila prueba-caja" id="desbloquear" hidden></section>' +
        '<section class="zona-atajos">' +
          atajo('salud', 'vacuna', 'mint', 'Carnet de salud', 'Vacunas y recordatorios') + atajo('clicker', 'estrella', 'butter', 'Clicker', 'Marca lo que hace bien') +
          atajo('juntos', 'personas', 'lilac', 'Juntos', compartido ? 'Ya lo compartís' : 'Invita a alguien') + atajo('mas', 'corazon', 'peach', 'Para ti', d.catalogo && d.catalogo.length ? 'Más programas desde ' + (d.precioCliente / 100).toFixed(2).replace('.', ',') + ' €' : 'Consejos y recomendaciones') +
        '</section>' +
        '<section class="tarjeta pila consejo"><div class="cab-consejo">' + burbuja('chispa', 'butter') + '<span class="etiqueta">Consejo de hoy</span></div>' +
          '<h2 id="c-tit" style="font-size:1.3rem"></h2><p id="c-txt"></p><button class="btn texto" id="otro" style="align-self:flex-start;width:auto;padding-left:0">Otro consejo</button></section>' +
        '<section class="tarjeta pila" id="avisos" hidden></section>' +
        '<section class="tarjeta pila" id="instalar"></section>' +
      '</div>' +
      '<div class="pila-g zona-vista" data-vista="diario" hidden><section class="tarjeta pila" id="diario"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="salud" hidden><section class="tarjeta pila" id="salud"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="clicker" hidden><section class="tarjeta pila" id="clicker-caja"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="juntos" hidden><section class="tarjeta pila" id="juntos"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="editar" hidden><section class="tarjeta pila" id="editar"></section></div>' +
      '<div class="pila-g zona-vista" data-vista="mas" hidden>' +
        '<section class="pila" id="catalogo"></section>' +
        '<section class="pila"><span class="etiqueta">Lo que te va a ayudar</span><div class="incluye-grid">' + productos + '</div>' +
          (hayAfiliados ? '<p class="peq suave">Algunos enlaces son de afiliado: si compras, recibimos una pequeña comisión sin coste para ti.</p>' : '') + '</section>' +
        '<section class="tarjeta pila">' + '<div class="cab-consejo">' + burbuja('escudo', 'mint') + '<h2 style="font-size:1.3rem">' + esc(seguro.titulo) + '</h2></div>' +
          '<p>' + esc(seguro.texto) + '</p>' + botonSeguro + '<p class="peq suave">' + esc(seguro.aviso) + '</p></section>' +
        '<section class="club pila" id="club"></section>' +
        '<section class="pila" id="lecturas"></section>' +
      '</div>' +
      '</div>' +
      // Barra de abajo, la misma que en el plan: Mi plan siempre a mano (sin plan: Para ti)
      '<nav class="zona-nav" aria-label="Secciones de Mi zona"><div class="zona-nav-in">' +
        (principal ? '<a href="/plan/' + esc(principal.token) + '">' + I('calendario') + '<span>Mi plan</span></a>' : '') +
        [['diario', 'gota', 'Diario'], ['salud', 'vacuna', 'Salud'], ['clicker', 'estrella', 'Clicker']].concat(principal ? [] : [['mas', 'corazon', 'Para ti']]).concat([['inicio', 'casa', 'Mi zona']]).map(function (v) {
          return '<button data-ir="' + v[0] + '" aria-current="false">' + I(v[1]) + '<span>' + v[2] + '</span></button>';
        }).join('') +
      '</div></nav>';

    // Navegación por pestañas, con el botón atrás del móvil funcionando (#diario, #clicker…)
    function ir(v, sinHistorial) {
      if (v !== 'editar' && v !== 'juntos' && !VISTAS.some(function (x) { return x[0] === v; })) v = 'inicio';
      if (v === 'editar' && !document.getElementById('editar').dataset.t) v = 'inicio';
      app.querySelectorAll('.zona-vista').forEach(function (el) { el.hidden = el.dataset.vista !== v; });
      document.querySelectorAll('.zona-nav [data-ir]').forEach(function (b) { b.setAttribute('aria-current', String(b.dataset.ir === v)); });
      if (!sinHistorial && location.hash.slice(1) !== v) history.pushState(null, '', v === 'inicio' ? location.pathname + location.search : '#' + v);
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('[data-ir]').forEach(function (b) { b.addEventListener('click', function () { ir(b.dataset.ir); }); });
    document.querySelectorAll('[data-editar]').forEach(function (b) { b.addEventListener('click', function () { editor(b.dataset.editar); ir('editar'); }); });
    window.addEventListener('popstate', function () { ir(location.hash.slice(1) || 'inicio', true); });
    ir(location.hash.slice(1) || 'inicio', true);

    var H = window.QBP_HERRAMIENTAS;
    if (H) {
      H.instalar(document.getElementById('instalar'));
      H.diario(document.getElementById('diario'), nombres[0] || 'tu perro', compartido);
      H.clicker(document.getElementById('clicker-caja'));
      H.club(document.getElementById('club'), d.enClub);
    }
    try { var hoyU = new Date().toDateString(); if (localStorage.getItem('uso_zona') !== hoyU) { localStorage.setItem('uso_zona', hoyU); post('/api/uso', { que: 'zona' }); } } catch (e) {}
    var cc = document.getElementById('clicker-caja');
    if (cc) cc.addEventListener('pointerdown', function primerClic() { post('/api/uso', { que: 'clicker' }); cc.removeEventListener('pointerdown', primerClic); });
    juntos(d);
    catalogo(d);
    prueba(d);
    saludZona(d);
    avisosMovil();
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

  function cargar() {
    return fetch('/api/mi-zona').then(function (r) { if (r.status === 401) return null; return r.json(); })
      .then(function (d) { if (d && d.planes) zona(d); else entrar(); })
      .catch(entrar);
  }
  // Vuelta del pago de un programa: se confirma y se recarga Mi zona con el programa ya dentro
  var qs = new URLSearchParams(location.search);
  if (qs.get('programa') === 'ok' && qs.get('session_id')) {
    fetch('/api/programa/estado?session_id=' + encodeURIComponent(qs.get('session_id'))).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (j) {
      if (j && j.token) { location.replace('/plan/' + j.token); return; }
      history.replaceState(null, '', '/mi-zona'); cargar();
    });
  } else cargar();
})();
