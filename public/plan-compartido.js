/*
 * Plan compartido: sincroniza las tareas marcadas entre quienes siguen el mismo plan
 * y añade el botón "Invitar". El servidor lo inyecta al principio de cada página /plan/<token>.
 * Se carga antes que el script del plan: deja en localStorage el progreso combinado,
 * que es lo que el plan lee al arrancar.
 */
(function () {
  'use strict';
  var me = document.currentScript;
  var t = me && me.getAttribute('data-t');
  if (!t) return;
  var clave = 'plan_' + t;
  var leer = function () { try { return JSON.parse(localStorage.getItem(clave)) || {}; } catch (e) { return {}; } };
  var escribir = function (v) { try { localStorage.setItem(clave, JSON.stringify(v)); } catch (e) {} };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function post(url, cuerpo) {
    return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
  }

  // 1) Antes de que arranque el plan: combinar lo del servidor con lo de este móvil.
  var servidor = {}, info = { yo: null, miembros: [], dueno: '' };
  try {
    var x = new XMLHttpRequest();
    x.open('GET', '/api/progreso?t=' + encodeURIComponent(t), false);
    x.send();
    if (x.status === 200) { info = JSON.parse(x.responseText); servidor = info.progreso || {}; }
  } catch (e) {}
  var local = leer(), subir = [];
  Object.keys(servidor).forEach(function (k) { local[k] = !!servidor[k].v; });
  Object.keys(local).forEach(function (k) { if (!(k in servidor)) subir.push({ k: k, v: !!local[k] }); });
  escribir(local);
  var foto = JSON.stringify(local);
  if (subir.length) post('/api/progreso', { t: t, cambios: subir }).catch(function () {});

  // 2) Cuando el plan ya está pintado: subir cada cambio, mostrar quién marcó qué y el botón de invitar.
  document.addEventListener('DOMContentLoaded', function () {
    pintarAutores();
    document.addEventListener('change', function (e) {
      if (!e.target || e.target.type !== 'checkbox') return;
      setTimeout(function () {
        var ahora = leer(), antes = JSON.parse(foto), cambios = [];
        Object.keys(ahora).forEach(function (k) { if (!!ahora[k] !== !!antes[k]) cambios.push({ k: k, v: !!ahora[k] }); });
        Object.keys(antes).forEach(function (k) { if (!(k in ahora) && antes[k]) cambios.push({ k: k, v: false }); });
        foto = JSON.stringify(ahora);
        if (cambios.length) post('/api/progreso', { t: t, cambios: cambios }).then(function (j) { servidor = j.progreso || servidor; pintarAutores(); }).catch(function () {});
      }, 0);
    });
    // Al volver a la app, si la otra persona ha marcado algo, recargamos para verlo.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      fetch('/api/progreso?t=' + encodeURIComponent(t), { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) {
        var p = j.progreso || {}, cambia = Object.keys(p).some(function (k) { return !!p[k].v !== !!leer()[k]; });
        if (cambia) location.reload();
      }).catch(function () {});
    });
    botonInvitar();
  });

  function pintarAutores() {
    document.querySelectorAll('.por-quien').forEach(function (n) { n.remove(); });
    Object.keys(servidor).forEach(function (k) {
      var s = servidor[k];
      if (!s.v || !s.por || s.por === info.yo) return;
      document.querySelectorAll('input[data-k="' + k + '"]').forEach(function (c) {
        var lab = c.closest('label');
        var dest = lab && (lab.querySelector('span b') || lab.querySelector('span'));
        if (dest) dest.insertAdjacentHTML('beforeend', ' <small class="por-quien">· ' + esc(s.por) + '</small>');
      });
    });
  }

  function botonInvitar() {
    var css = document.createElement('style');
    css.textContent = '.por-quien{font-weight:600;color:var(--ok,#17885c);font-size:.78rem;font-family:var(--body,inherit)}' +
      '.inv-btn{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:40;display:inline-flex;align-items:center;gap:8px;border:0;border-radius:99px;padding:12px 16px;background:var(--primary,#ffc83d);color:#1b2a41;font:700 .95rem var(--body,system-ui);box-shadow:0 8px 24px rgba(27,42,65,.22);cursor:pointer}' +
      '.inv-btn svg{width:20px;height:20px}.imp-btn{right:auto;left:max(16px,env(safe-area-inset-left,0px));background:var(--surface,#fff);color:var(--ink,#1b2a41);text-decoration:none;border:1px solid var(--line,#dde3ec)}@media print{.inv-btn{display:none!important}}' +
      '.inv-dlg{border:0;border-radius:22px;padding:0;max-width:420px;width:calc(100% - 32px);background:var(--surface,#fff);color:var(--ink,#1b2a41);box-shadow:0 24px 64px rgba(0,0,0,.3)}' +
      '.inv-dlg::backdrop{background:rgba(15,23,36,.5)}.inv-in{padding:22px;display:flex;flex-direction:column;gap:12px;font-family:var(--body,system-ui)}' +
      '.inv-in h2{font-size:1.35rem}.inv-in p{color:var(--muted,#5c6b80);line-height:1.45}.inv-in input{height:46px;border:1px solid var(--line,#dde3ec);border-radius:12px;padding:0 12px;font:inherit;background:var(--surface,#fff);color:var(--ink,#1b2a41)}' +
      '.inv-in .ok-b{height:48px;border:0;border-radius:14px;background:var(--primary,#ffc83d);color:#1b2a41;font:800 1rem inherit;cursor:pointer;box-shadow:0 4px 0 #e0a800}.inv-in .no-b{background:none;border:0;color:var(--muted,#5c6b80);font:600 .9rem inherit;cursor:pointer;padding:6px}' +
      '.inv-ya{display:flex;flex-wrap:wrap;gap:6px}.inv-ya span{background:var(--ok-bg,#dcf3e8);color:var(--ok,#17885c);border-radius:99px;padding:4px 10px;font-size:.82rem;font-weight:700}.inv-err{color:var(--warn,#b8432b);font-size:.88rem;min-height:1em}';
    document.head.appendChild(css);
    var b = document.createElement('button');
    b.className = 'inv-btn'; b.type = 'button';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M18 8v6M15 11h6"/></svg>' +
      (info.miembros && info.miembros.length ? 'Compartido' : 'Invitar');
    document.body.appendChild(b);
    var imp = document.createElement('a');
    imp.className = 'inv-btn imp-btn'; imp.href = '/plan/' + t + '/nevera';
    imp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>Imprimir';
    document.body.appendChild(imp);
    var d = document.createElement('dialog');
    d.className = 'inv-dlg';
    document.body.appendChild(d);
    function abrir() {
      var ya = [info.dueno].concat(info.miembros || []).filter(Boolean);
      d.innerHTML = '<form class="inv-in" method="dialog"><h2>Hacedlo juntos</h2>' +
        '<p>Invita a tu pareja o a quien también cuide de él. Veréis el mismo plan, lo que marca cada uno y compartiréis el diario.</p>' +
        (ya.length > 1 ? '<div class="inv-ya">' + ya.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>' : '') +
        '<input id="inv-nombre" maxlength="30" placeholder="Su nombre (opcional)" autocomplete="off">' +
        '<input id="inv-email" type="email" placeholder="Su email" autocomplete="off" required>' +
        '<p class="inv-err" id="inv-err"></p>' +
        '<button class="ok-b" id="inv-enviar" type="button">Enviar invitación</button><button class="no-b" value="cerrar">Cerrar</button></form>';
      d.showModal ? d.showModal() : d.setAttribute('open', '');
      d.querySelector('#inv-enviar').onclick = function () {
        var btn = this, err = d.querySelector('#inv-err');
        var email = d.querySelector('#inv-email').value.trim(), nombre = d.querySelector('#inv-nombre').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Revisa el email.'; return; }
        btn.disabled = true; btn.textContent = 'Enviando…';
        post('/api/invitar', { t: t, email: email, nombre: nombre }).then(function (j) {
          if (!j.ya) info.miembros = (info.miembros || []).concat([nombre || email.split('@')[0]]);
          d.querySelector('.inv-in').innerHTML = '<h2>' + (j.ya ? 'Ya estaba invitado' : 'Invitación enviada') + '</h2><p>Le hemos mandado un email a <b>' + esc(email) + '</b> con el enlace al plan. Cuando entre, veréis los dos lo que marca cada uno.</p><button class="ok-b" value="cerrar">Perfecto</button>';
          b.lastChild.textContent = 'Compartido';
        }).catch(function (e) { err.textContent = (e && e.error) || 'No se ha podido enviar. Inténtalo de nuevo.'; btn.disabled = false; btn.textContent = 'Enviar invitación'; });
      };
    }
    b.onclick = abrir;
  }
})();
