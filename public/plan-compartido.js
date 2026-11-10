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
  // Instalar la app: salta a los 5 s de abrir el plan, o justo al marcar una tarea si es antes.
  function ofrecerApp(espera) {
    if (!window.QBP_APP) return;
    var h = document.querySelector('.hero h1');
    window.QBP_APP.ofrecer({ espera: espera, nombre: h ? h.textContent.trim() : '' });
  }
  document.addEventListener('change', function (e) {
    if (e.target && e.target.matches && e.target.matches('input[data-k], #hoy-check') && e.target.checked) ofrecerApp(900);
  });
  window.addEventListener('load', function () { ofrecerApp(5000); });
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var hoy = new Date().toDateString();
      if (localStorage.getItem('uso_' + t) !== hoy) { localStorage.setItem('uso_' + t, hoy); post('/api/uso', { t: t, que: 'plan' }).catch(function () {}); }
    } catch (e) {}
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
    barraZona();
    if (info.prueba) bloquearPrueba(info.prueba);
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

  // Prueba gratis: todo el plan abierto durante la prueba (solo una banda con los días que quedan); al terminar, todo en pausa
  function bloquearPrueba(pr) {
    var euros = (pr.precio / 100).toFixed(2).replace('.', ',') + ' €';
    var ir = '/mi-zona#desbloquear';
    var css = document.createElement('style');
    css.textContent = '.pr-banda{position:sticky;top:0;z-index:44;display:flex;align-items:center;gap:10px;justify-content:space-between;padding:10px 16px;background:#1b2a41;color:#fff;font:600 .88rem var(--body,system-ui)}' +
      '.pr-banda a{background:#ffc83d;color:#1b2a41;border-radius:10px;padding:8px 12px;font-weight:800;text-decoration:none;white-space:nowrap}' +
      '.pr-bloq{position:relative}.pr-bloq>*:not(.pr-cta){filter:blur(5px);pointer-events:none;user-select:none}' +
      '.pr-cta{position:absolute;left:50%;top:80px;transform:translateX(-50%);z-index:5;display:flex;gap:8px;align-items:center;background:#1b2a41;color:#fff;border-radius:14px;padding:12px 16px;font:700 .9rem var(--body,system-ui);text-decoration:none;box-shadow:0 10px 28px rgba(27,42,65,.3);white-space:nowrap}' +
      '.pr-fin{position:fixed;inset:0;z-index:43;background:rgba(15,23,36,.6);display:flex;align-items:center;justify-content:center;padding:20px 16px 90px}' +
      '.pr-fin div{background:var(--surface,#fff);color:var(--ink,#1b2a41);border-radius:22px;padding:22px;max-width:420px;display:flex;flex-direction:column;gap:12px;font-family:var(--body,system-ui)}' +
      '.pr-fin h2{font:800 1.4rem var(--display,system-ui);margin:0}.pr-fin a{background:#ffc83d;color:#1b2a41;border-radius:14px;padding:14px;text-align:center;font-weight:800;text-decoration:none;box-shadow:0 4px 0 #e0a800}' +
      '@media print{.pr-banda,.pr-fin,.pr-cta{display:none}}';
    document.head.appendChild(css);
    document.querySelectorAll('.imp-btn').forEach(function (b) { b.remove(); }); // imprimir, al desbloquear (invitar sí: usarlo en pareja engancha)
    if (!pr.terminada) return; // durante la prueba, nada: ni banda ni candados
    var banda = document.createElement('div');
    banda.className = 'pr-banda';
    banda.innerHTML = '<span>' + (pr.terminada ? 'Tu prueba gratis ha terminado' : 'Prueba gratis · ' + (pr.quedan <= 1 ? 'último día' : 'te quedan ' + pr.quedan + ' días')) + '</span><a href="' + ir + '">Desbloquear · ' + euros + '</a>';
    document.body.insertBefore(banda, document.body.firstChild);
    var bloquear = function (el, texto) {
      if (!el || el.classList.contains('pr-bloq')) return;
      el.classList.add('pr-bloq');
      var a = document.createElement('a'); a.className = 'pr-cta'; a.href = ir;
      a.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffc83d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' + texto;
      el.appendChild(a);
    };
    if (pr.terminada) {
      document.querySelectorAll('.sem[data-sem]').forEach(function (s) { bloquear(s, 'Desbloquea el plan para seguir'); });
      ['hoy', 'protocolos', 'protocolo', 'papeleo', 'ayuda'].forEach(function (id) { bloquear(document.getElementById(id), 'Desbloquea el plan completo'); });
      var fin = document.createElement('div'); fin.className = 'pr-fin';
      fin.innerHTML = '<div><h2>Tu prueba gratis ha terminado</h2><p>El plan se ha quedado en pausa. Desbloquéalo y conservas todo lo que habéis hecho: tareas, diario y carnet de salud.</p><p><b>Pago único de ' + euros + '</b>, para siempre. Sin suscripción.</p><a href="' + ir + '">Desbloquear el plan · ' + euros + '</a></div>';
      document.body.appendChild(fin);
    }
  }

  // Barra de abajo como en Mi zona: el plan es una pestaña más
  try { if (!localStorage.getItem('qbp_mi_plan')) localStorage.setItem('qbp_mi_plan', t); } catch (e) {}
  function barraZona() {
    var ic = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var items = [
      ['#', 'Mi plan', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', true],
      ['/mi-zona#diario', 'Diario', '<path d="M12 3c3.5 4.2 6 7.6 6 10.6A6 6 0 0 1 6 13.6C6 10.6 8.5 7.2 12 3z"/>'],
      ['/mi-zona#salud', 'Salud', '<path d="M18 2l4 4M20 4l-9.5 9.5M14 5l5 5M8.5 11.5l4 4M3 21l4-4M11 9L5 15l4 4 6-6"/>'],
      ['/mi-zona#clicker', 'Clicker', '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'],
      ['/mi-zona', 'Mi zona', '<path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"/>']
    ];
    var nav = document.createElement('nav');
    nav.className = 'pz-nav'; nav.setAttribute('aria-label', 'Secciones');
    nav.innerHTML = '<div class="pz-in">' + items.map(function (x) {
      return '<a href="' + x[0] + '"' + (x[3] ? ' aria-current="page"' : '') + '>' + ic(x[2]) + '<span>' + x[1] + '</span></a>';
    }).join('') + '</div>';
    nav.querySelector('[aria-current]').onclick = function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(nav);
    var css = document.createElement('style');
    css.textContent = '.pz-nav{position:fixed;left:0;right:0;bottom:0;z-index:45;background:var(--surface,#fff);border-top:1px solid var(--line,#dde3ec);padding-bottom:env(safe-area-inset-bottom,0px)}' +
      '.pz-in{max-width:760px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr)}' +
      '.pz-nav a{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 2px 10px;min-height:58px;color:var(--muted,#5c6b80);text-decoration:none;font:700 .7rem var(--body,system-ui)}' +
      '.pz-nav svg{width:22px;height:22px}.pz-nav a[aria-current]{color:var(--ink,#1b2a41)}.pz-nav a[aria-current] svg{color:var(--brand,#2546a8)}' +
      '.pz-nav a[aria-current] span{position:relative}.pz-nav a[aria-current] span::after{content:"";position:absolute;left:20%;right:20%;bottom:-5px;height:3px;border-radius:3px;background:var(--primary,#ffc83d)}' +
      'body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}.inv-btn{bottom:calc(76px + env(safe-area-inset-bottom,0px))!important}' +
      '@media print{.pz-nav{display:none}body{padding-bottom:0}}';
    document.head.appendChild(css);
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
