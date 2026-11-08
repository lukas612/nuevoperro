/*
 * Medición en las páginas de contenido (home, guías, razas): píxel de Meta, visita y
 * conservación de los datos del anuncio (UTM, fbclid) para que, si después hace el test,
 * el lead quede atribuido al anuncio. Usa las mismas claves que el test (pc_sid, pc_utm).
 */
(function () {
  'use strict';
  var me = document.currentScript;
  var pixelId = me && me.getAttribute('data-pixel');
  var conAviso = me && me.getAttribute('data-aviso') === '1';
  var lsGet = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var params = new URLSearchParams(location.search);

  var sid = lsGet('pc_sid');
  if (!sid) { sid = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[-.]/g, ''); lsSet('pc_sid', sid); }
  var utm = lsGet('pc_utm') || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'a', 'fbclid'].forEach(function (k) { if (params.get(k)) utm[k] = params.get(k).slice(0, 100); });
  if (params.get('fbclid') && !params.get('utm_source')) { utm.utm_source = 'meta'; utm.utm_medium = utm.utm_medium || 'paid'; }
  lsSet('pc_utm', utm);

  try {
    fetch('/api/evento', { method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ tipo: 'visita_web', sid: sid, paso: location.pathname.slice(0, 40), utm: utm }) }).catch(function () {});
  } catch (e) {}

  if (!pixelId || (conAviso && lsGet('pc_cookies') !== 'si')) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', pixelId, { external_id: sid });
  window.fbq('track', 'PageView');
  if (location.pathname === '/') window.fbq('track', 'ViewContent', { content_name: 'home', content_category: 'home' });
})();
