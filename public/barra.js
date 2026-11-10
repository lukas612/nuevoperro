/* Barra de abajo de la app (Mi plan · Diario · Salud · Clicker · Mi zona) en el resto de la web,
 * para quien ya tiene plan en este móvil. Mi zona y el plan pintan la suya propia. */
(function () {
  'use strict';
  if (window.QBP_BARRA) return;
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  function mostrar(token) {
    if (token) ls.set('qbp_mi_plan', token);
    token = token || ls.get('qbp_mi_plan');
    if (!/^[a-f0-9]{32}$/.test(String(token || '')) || document.querySelector('.pz-nav,.zona-nav')) return;
    var ic = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var items = [
      ['/plan/' + token, 'Mi plan', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
      ['/mi-zona#diario', 'Diario', '<path d="M12 3c3.5 4.2 6 7.6 6 10.6A6 6 0 0 1 6 13.6C6 10.6 8.5 7.2 12 3z"/>'],
      ['/mi-zona#salud', 'Salud', '<path d="M18 2l4 4M20 4l-9.5 9.5M14 5l5 5M8.5 11.5l4 4M3 21l4-4M11 9L5 15l4 4 6-6"/>'],
      ['/mi-zona#clicker', 'Clicker', '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'],
      ['/mi-zona', 'Mi zona', '<path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"/>']
    ];
    var nav = document.createElement('nav');
    nav.className = 'pz-nav'; nav.setAttribute('aria-label', 'Tu plan');
    nav.innerHTML = '<div class="pz-in">' + items.map(function (x) { return '<a href="' + x[0] + '">' + ic(x[2]) + '<span>' + x[1] + '</span></a>'; }).join('') + '</div>';
    document.body.appendChild(nav);
    var css = document.createElement('style');
    css.textContent = '.pz-nav{position:fixed;left:0;right:0;bottom:0;z-index:45;background:var(--surface,#fff);border-top:1px solid var(--line,#dde3ec);padding-bottom:env(safe-area-inset-bottom,0px)}' +
      '.pz-in{max-width:760px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr)}' +
      '.pz-nav a{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 2px 10px;min-height:58px;color:var(--muted,#5c6b80);text-decoration:none;font:700 .7rem var(--body,Figtree,system-ui,sans-serif)}' +
      '.pz-nav svg{width:22px;height:22px}body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}@media print{.pz-nav{display:none}body{padding-bottom:0}}';
    document.head.appendChild(css);
  }
  window.QBP_BARRA = { mostrar: mostrar, guardar: function (t) { if (t) ls.set('qbp_mi_plan', t); } };
  if (document.currentScript && document.currentScript.dataset.auto) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mostrar(); }); else mostrar();
  }
})();
