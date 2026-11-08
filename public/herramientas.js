/* Herramientas de Mi zona: diario de pis y caca, clicker, club (lista de interés) e instalar la app. */
(function () {
  'use strict';
  var D = window.PERROS, I = D.icono;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function burbuja(ic, color) { return '<span class="burbuja b-' + color + '">' + I(ic) + '</span>'; }
  function post(url, body) { return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  var DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  function clave(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function hora(ts) { var d = new Date(ts); return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); }

  // ---------- Diario de pis y caca ----------
  function diario(el, nombre, compartido) {
    var registros = [];
    function pintar() {
      var hoy = new Date(), kHoy = clave(hoy);
      var deHoy = registros.filter(function (r) { return clave(new Date(r.ts)) === kHoy; });
      var fueraHoy = deHoy.filter(function (r) { return r.lugar === 'fuera'; }).length;
      // Últimos 7 días: % de aciertos (fuera / total)
      var dias = [];
      for (var i = 6; i >= 0; i--) {
        var d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - i), k = clave(d);
        var del = registros.filter(function (r) { return clave(new Date(r.ts)) === k; });
        var f = del.filter(function (r) { return r.lugar === 'fuera'; }).length;
        dias.push({ etiqueta: i === 0 ? 'hoy' : DIAS[d.getDay()], total: del.length, pct: del.length ? Math.round(f / del.length * 100) : null });
      }
      // Racha: días seguidos (hasta ayer, más hoy si ya hay registros) con registros y sin accidentes
      var racha = 0;
      for (var j = dias.length - 1; j >= 0; j--) {
        if (j === dias.length - 1 && dias[j].total === 0) continue;
        if (dias[j].total > 0 && dias[j].pct === 100) racha++; else break;
      }
      // Patrón: franja horaria con más accidentes en 14 días
      var franjas = {};
      registros.filter(function (r) { return r.lugar === 'dentro'; }).forEach(function (r) { var h = new Date(r.ts).getHours(); var f2 = Math.floor(h / 2) * 2; franjas[f2] = (franjas[f2] || 0) + 1; });
      var peor = Object.keys(franjas).sort(function (a, b) { return franjas[b] - franjas[a]; })[0];
      var consejo = peor != null && franjas[peor] >= 2
        ? 'La mayoría de los accidentes son entre las ' + peor + ':00 y las ' + (Number(peor) + 2) + ':00. Prueba a sacar a ' + esc(nombre) + ' un poco antes de esa hora.'
        : 'Apunta cada pis y cada caca durante unos días: verás su patrón y podrás adelantarte.';

      el.innerHTML = '<div class="cab-consejo">' + burbuja('gota', 'sky') + '<h2 style="font-size:1.3rem">Diario de pis y caca</h2></div>' +
        '<p class="suave peq">Toca un botón cada vez que lo haga. Solo lo ves tú.</p>' +
        '<div class="diario-botones">' +
          '<button class="btn sec" data-t="pis" data-l="fuera">' + I('check') + 'Pis fuera</button>' +
          '<button class="btn sec" data-t="pis" data-l="dentro">' + I('gota') + 'Pis en casa</button>' +
          '<button class="btn sec" data-t="caca" data-l="fuera">' + I('check') + 'Caca fuera</button>' +
          '<button class="btn sec" data-t="caca" data-l="dentro">' + I('huella') + 'Caca en casa</button>' +
        '</div>' +
        '<div class="diario-resumen"><div><b>' + fueraHoy + '/' + deHoy.length + '</b><span>fuera hoy</span></div><div><b>' + racha + '</b><span>' + (racha === 1 ? 'día' : 'días') + ' sin accidentes</span></div></div>' +
        '<div class="diario-barras" role="img" aria-label="Porcentaje de pis y caca fuera de casa en los últimos 7 días">' + dias.map(function (d) {
          return '<div class="db-col"><span class="db-pct">' + (d.pct == null ? '–' : d.pct + '%') + '</span><span class="db-barra"><i style="height:' + (d.pct == null ? 0 : Math.max(6, d.pct)) + '%"></i></span><span class="db-dia">' + d.etiqueta + '</span></div>';
        }).join('') + '</div>' +
        '<p class="nota">' + I('chispa') + '<span>' + consejo + '</span></p>' +
        (deHoy.length ? '<ul class="diario-hoy">' + deHoy.slice(0, 6).map(function (r) {
          return '<li><span>' + hora(r.ts) + ' · ' + (r.tipo === 'pis' ? 'Pis' : 'Caca') + ' ' + (r.lugar === 'fuera' ? 'fuera' : 'en casa') + (compartido && r.por ? ' <span class="suave">· ' + esc(r.por) + '</span>' : '') + '</span><button class="btn texto" data-borrar="' + esc(r.id) + '" style="width:auto;min-height:32px;padding:0 6px">Deshacer</button></li>';
        }).join('') + '</ul>' : '');

      el.querySelectorAll('[data-t]').forEach(function (b) {
        b.onclick = function () {
          b.disabled = true;
          post('/api/diario', { tipo: b.dataset.t, lugar: b.dataset.l }).then(function (j) { registros.unshift(j.registro); pintar(); if (navigator.vibrate) navigator.vibrate(30); })
            .catch(function () { b.disabled = false; });
        };
      });
      el.querySelectorAll('[data-borrar]').forEach(function (b) {
        b.onclick = function () { post('/api/diario/borrar', { id: b.dataset.borrar }).then(function () { registros = registros.filter(function (r) { return String(r.id) !== b.dataset.borrar; }); pintar(); }); };
      });
    }
    fetch('/api/diario').then(function (r) { return r.json(); }).then(function (j) { registros = j.registros || []; pintar(); }).catch(pintar);
  }

  // ---------- Clicker ----------
  var audio;
  function clic() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(2400, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.03);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + 0.06);
    } catch (e) { /* sin audio */ }
    if (navigator.vibrate) navigator.vibrate(15);
  }
  function clicker(el) {
    el.innerHTML = '<div class="cab-consejo">' + burbuja('estrella', 'butter') + '<h2 style="font-size:1.3rem">Clicker</h2></div>' +
      '<p class="suave peq">Un "clic" marca el momento exacto en que hace algo bien. Siempre va seguido de un premio.</p>' +
      '<button class="clicker" id="clicker" aria-label="Hacer clic">' + I('huella') + '<span>Clic</span></button>' +
      '<details><summary>Cómo empezar con el clicker</summary><ol class="peq">' +
        '<li><b>Cárgalo:</b> clic y premio, 10 veces seguidas, sin pedirle nada. Así aprende que el clic anuncia un premio.</li>' +
        '<li><b>Marca lo bueno:</b> clic justo cuando se sienta, mira o camina a tu lado. Después, el premio.</li>' +
        '<li><b>Nunca clic sin premio,</b> ni para llamarle. Y sube el volumen del móvil.</li>' +
      '</ol></details>';
    var b = el.querySelector('#clicker');
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); clic(); b.classList.add('pulsado'); setTimeout(function () { b.classList.remove('pulsado'); }, 120); });
    b.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); clic(); } });
  }

  // ---------- Club (lista de interés) ----------
  function club(el, enClub) {
    function pintar(apuntado) {
      el.innerHTML = '<div class="club-cab"><span class="club-sello">' + I('estrella') + '</span><div><span class="etiqueta" style="color:#ffd76e">Próximamente</span><h2 style="font-size:1.35rem;color:#fff">Club Qué Buen Perro</h2></div></div>' +
        '<ul class="club-lista">' +
          '<li>' + I('chispa') + '<span>Asistente para preguntar tus dudas sobre ' + 'tu perro, cuando quieras</span></li>' +
          '<li>' + I('calendario') + '<span>Programas nuevos al terminar el plan: trucos, la etapa adolescente y retos</span></li>' +
          '<li>' + I('corazon') + '<span>Recordatorios de vacunas, desparasitación y papeleo</span></li>' +
        '</ul>' +
        '<p style="color:#c5d0e3;font-size:.9rem">Desde 4,99 € al mes, sin permanencia.</p>' +
        (apuntado ? '<p class="chip ok">' + I('check') + 'Apuntado: te avisaremos cuando abra</p>'
          : '<button class="btn" id="club-btn">Me interesa, avisadme</button><p class="peq" style="color:#c5d0e3">Sin compromiso: solo te avisamos cuando esté listo.</p>');
      var b = el.querySelector('#club-btn');
      if (b) b.onclick = function () { b.disabled = true; post('/api/club').then(function () { pintar(true); }).catch(function () { b.disabled = false; }); };
    }
    pintar(enClub);
  }

  // ---------- Instalar como app (PWA) ----------
  var promptInstalar = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); promptInstalar = e; document.dispatchEvent(new Event('qbp-instalable')); });
  function instalada() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; }
  function instalar(el) {
    if (instalada() || lsGet('qbp_instalar_oculto')) { el.hidden = true; return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
    function pintar() {
      var cuerpo;
      if (promptInstalar) cuerpo = '<button class="btn" id="instalar-btn">' + I('check') + 'Instalar en mi móvil</button>';
      else if (ios) cuerpo = '<ol class="peq instalar-pasos"><li>Pulsa el botón <b>Compartir</b> ' + I('flecha') + ' de Safari (el cuadrado con la flecha hacia arriba).</li><li>Elige <b>"Añadir a pantalla de inicio"</b>.</li><li>Pulsa <b>Añadir</b>.</li></ol>';
      else cuerpo = '<p class="peq suave">En el menú del navegador (los tres puntos), elige <b>"Instalar aplicación"</b> o <b>"Añadir a pantalla de inicio"</b>.</p>';
      el.innerHTML = '<div class="cab-consejo"><span class="instalar-icono"><img src="/icon-192.png" alt="" width="44" height="44"></span><div><h2 style="font-size:1.2rem">Ten tu plan a un toque</h2><p class="suave peq" style="margin-top:2px">Instálalo como una app: icono en tu móvil, a pantalla completa y tu plan disponible aunque no tengas cobertura.</p></div></div>' +
        cuerpo + '<button class="btn texto" id="instalar-no" style="width:auto;align-self:flex-start;padding-left:0">Ahora no</button>';
      var b = el.querySelector('#instalar-btn');
      if (b) b.onclick = function () { promptInstalar.prompt(); promptInstalar.userChoice.then(function (r) { if (r.outcome === 'accepted') el.hidden = true; promptInstalar = null; }); };
      el.querySelector('#instalar-no').onclick = function () { lsSet('qbp_instalar_oculto', '1'); el.hidden = true; };
    }
    pintar();
    document.addEventListener('qbp-instalable', pintar);
    window.addEventListener('appinstalled', function () { el.hidden = true; });
  }

  // Service worker: permite instalar y ver el plan sin conexión
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });

  window.QBP_HERRAMIENTAS = { diario: diario, clicker: clicker, club: club, instalar: instalar };
})();
