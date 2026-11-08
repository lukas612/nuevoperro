/* Funnel para perros adultos y recién adoptados:
   (portada del anuncio) → preguntas → ¿muerde? (derivar) → preparando → resultado gratis → paywall → pago → upsell → gracias. */
(function () {
  'use strict';
  var P = window.PLANTILLAS, D = window.PERROS, PR = window.PROGRAMAS, I = D.icono;
  var app = document.getElementById('app'), barra = document.getElementById('barra');
  var CONF = { precio: 1999, precioUpsell: 999, demo: false, marca: 'Qué Buen Perro', pixelId: '', emailContacto: '' };

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }

  var sid = lsGet('pc_sid');
  if (!sid) { sid = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[-.]/g, ''); lsSet('pc_sid', sid); }
  var params = new URLSearchParams(location.search);
  var utm = lsGet('pc_utm') || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'a', 'fbclid'].forEach(function (k) { if (params.get(k)) utm[k] = params.get(k).slice(0, 100); });
  // Clic desde un anuncio de Meta sin parámetros UTM: lo atribuimos a Meta igualmente.
  if (params.get('fbclid') && !params.get('utm_source')) { utm.utm_source = 'meta'; utm.utm_medium = utm.utm_medium || 'paid'; }
  lsSet('pc_utm', utm);

  // Ángulos de anuncio para perro adulto → problema y tipo
  var ANGULOS = {
    correa:   { p: 'correa', t: '¿Tu perro tira de la correa en cada paseo?', s: 'Un plan de 6 semanas para pasear sin tirones, hecho para tu perro.' },
    ladridos: { p: 'ladridos', t: '¿Tu perro ladra a todo?', s: 'Entiende por qué lo hace y qué hacer en su lugar, paso a paso.' },
    soledad:  { p: 'solo', t: '¿Lo pasa mal cuando se queda solo?', s: 'Un plan para que aprenda a quedarse en casa con calma.' },
    adopcion: { p: 'adaptacion', tipo: 'adoptado', t: '¿Acabas de adoptar un perro?', s: 'Sus primeras semanas en casa, con un plan hecho para él.' }
  };
  var angulo = ANGULOS[utm.a];

  var estado = lsGet('pn_estado') || { paso: 0, r: {} };
  // Si el tipo no viene dado (home o anuncio), se pregunta; se decide una vez para que las preguntas no se desplacen.
  if (estado.preguntarTipo == null) estado.preguntarTipo = !params.get('tipo') && !(angulo && angulo.tipo) && !estado.r.tipo;
  if (!estado.r.tipo && params.get('tipo')) estado.r.tipo = params.get('tipo') === 'adoptado' ? 'adoptado' : 'adulto';
  if (!estado.r.tipo && angulo && angulo.tipo) estado.r.tipo = angulo.tipo;
  if (!estado.r.problema && params.get('p') && PR.PROGRAMAS[params.get('p')]) estado.r.problema = params.get('p');
  if (!estado.r.problema && angulo) estado.r.problema = angulo.p;
  function guardarEstado() { lsSet('pn_estado', estado); }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function euros(c) { return (c / 100).toFixed(2).replace('.', ',') + ' €'; }
  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
  }
  function evento(tipo, paso) {
    post('/api/evento', { tipo: tipo, sid: sid, paso: paso, utm: utm }).catch(function () {});
    var m = PX[tipo];
    if (m) pixel(m[0], { content_name: utm.a || paso || 'perro', content_category: 'perro' }, null, m[1]);
  }
  function nombre() { return estado.r.nombre || 'tu perro'; }
  function razaId() { return estado.r.razaId || 'mestizo'; }
  function prog() { return PR.PROGRAMAS[estado.r.problema] || PR.PROGRAMAS.correa; }
  function sus(t) { return String(t).replace(/\{n\}/g, nombre()); }
  function burbuja(ic, color) { return '<span class="burbuja b-' + color + '">' + I(ic) + '</span>'; }

  function pintarBarra(modo) {
    if (modo && modo.progreso != null) {
      barra.innerHTML = '<button class="atras" id="atras" aria-label="Atrás">' + I('flecha') + '</button>' +
        '<div class="progreso" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(modo.progreso * 100) + '"><div id="progreso-relleno"></div></div>' +
        (estado.r.razaId ? '<span class="mini-perro">' + D.cara(estado.r.razaId) + '</span>' : '');
      requestAnimationFrame(function () { var b = document.getElementById('progreso-relleno'); if (b) b.style.width = Math.max(4, Math.round(modo.progreso * 100)) + '%'; });
      document.getElementById('atras').onclick = modo.atras;
    } else {
      barra.innerHTML = '<a class="marca" href="/" style="text-decoration:none;color:inherit">' + D.logo() + D.nombreMarca(CONF.marca) + '</a>';
    }
  }
  function pintar(html) {
    if (window.VENTA) window.VENTA.quitarBarra();
    app.innerHTML = (CONF.demo ? '<div class="demo">Modo demo: los pagos se simulan.</div>' : '') + '<div class="entra">' + html + '</div>';
    window.scrollTo(0, 0);
    var f = app.querySelector('h1,h2');
    if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); }
  }

  // ---------- Meta Pixel (solo con consentimiento) ----------
  var pixelListo = false;
  function cargarPixel() {
    if (pixelListo || !CONF.pixelId) return;
    pixelListo = true;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONF.pixelId, (typeof estado !== 'undefined' && estado.email) ? { em: estado.email, external_id: sid } : { external_id: sid });
    window.fbq('track', 'PageView');
    colaPx.splice(0).forEach(function (a) { window.fbq.apply(null, a); });
  }
  // Eventos del píxel. Antes de que la persona decida sobre las cookies se guardan en cola;
  // si acepta se envían, si rechaza se descartan. eventID = el mismo que manda el servidor (API de Conversiones).
  var colaPx = [];
  function pixel(ev, d, id, propio) {
    if (CONF.avisoCookies && lsGet('pc_cookies') === 'no') return;
    var a = [propio ? 'trackCustom' : 'track', ev, d || {}];
    if (id) a.push({ eventID: id });
    if (pixelListo && window.fbq) window.fbq.apply(null, a); else if (colaPx.length < 30) colaPx.push(a);
  }
  var PX = { visita: ['ViewContent'], inicio_form: ['TestIniciado', 1], resultado_visto: ['ResultadoVisto', 1], paywall_visto: ['PaywallVisto', 1],
    checkout_cancelado: ['PagoCancelado', 1], upsell_visto: ['UpsellVisto', 1], upsell_rechazado: ['UpsellRechazado', 1], clic_seguros: ['InteresSeguros', 1], derivado: ['DerivadoEducador', 1] };
  function cm() { return !CONF.avisoCookies || lsGet('pc_cookies') === 'si' ? 1 : 0; }
  function gestionarCookies() {
    // Fase de pruebas: sin aviso, el píxel carga directamente. Para volver a pedir permiso: AVISO_COOKIES=si en Render.
    if (!CONF.avisoCookies) return cargarPixel();
    var c = lsGet('pc_cookies');
    if (c === 'si') return cargarPixel();
    if (c === 'no' || !CONF.pixelId) return;
    var caja = document.getElementById('cookies'); caja.hidden = false;
    document.getElementById('cookies-si').onclick = function () { lsSet('pc_cookies', 'si'); caja.hidden = true; cargarPixel(); };
    document.getElementById('cookies-no').onclick = function () { lsSet('pc_cookies', 'no'); caja.hidden = true; colaPx.length = 0; };
  }

  // ---------- Portada (solo si llega de un anuncio) ----------
  function portada() {
    pintarBarra(null);
    var a = angulo || { t: 'Un plan para el problema de tu perro', s: 'Hecho para su raza, su edad y tu casa.' };
    var caras = ['border-collie', 'labrador', 'mestizo', 'beagle', 'husky'];
    pintar('<div class="pila-g"><section class="pila">' +
      '<span class="eyebrow">' + I('huella') + 'Para perros de cualquier edad</span>' +
      '<h1>' + esc(a.t) + '</h1><p class="suave">' + esc(a.s) + ' Responde unas preguntas y te damos gratis sus 3 primeros días de plan.</p>' +
      '<div class="escena" aria-hidden="true">' +
        '<span class="p p1">' + D.cara(caras[0], { lengua: true }) + '</span><span class="p p2">' + D.cara(caras[1]) + '</span>' +
        '<span class="p p3">' + D.cara(caras[2]) + '</span><span class="p p4">' + D.cara(caras[3]) + '</span><span class="p p5">' + D.cara(caras[4]) + '</span>' +
        '<div class="nota-flot n1">' + burbuja(prog().icono, 'sky') + '<span><b>Día 1</b>' + esc(prog().primerosDias[0][0]) + '</span></div>' +
        '<div class="nota-flot n2">' + burbuja('check', 'mint') + '<span><b>Kira · 3 años</b>Plan listo</span></div>' +
      '</div>' +
      '<button class="btn" id="empezar">Haz el test gratis ' + I('huella') + '</button>' +
      '<div class="micro"><span>' + I('check') + 'Gratis</span><span>' + I('check') + '2 minutos</span><span>' + I('check') + 'Sin castigos</span></div>' +
      '</section></div>');
    document.getElementById('empezar').onclick = function () { evento('inicio_form'); estado.paso = 1; guardarEstado(); render(); };
  }

  // ---------- Preguntas ----------
  function listaProblemas() {
    var l = [['correa', ['correa', 'mint'], 'Tira de la correa'], ['ladridos', ['chispa', 'butter'], 'Ladra mucho'], ['solo', ['puerta', 'peach'], 'Lo pasa mal cuando se queda solo']];
    if (estado.r.tipo === 'adoptado') l.unshift(['adaptacion', ['casa', 'sky'], 'Que se adapte bien a casa']);
    return l;
  }
  var PREGUNTAS = [
    { id: 'tipo', cuando: function () { return estado.preguntarTipo; }, t: '¿Cuánto tiempo lleva contigo?', tipo: 'opcion',
      lista: [['adoptado', ['casa', 'sky'], 'Lo acabo de adoptar', 'Menos de 3 meses en casa'], ['adulto', ['corazon', 'peach'], 'Ya lleva tiempo conmigo', 'Más de 3 meses']] },
    { id: 'nombre', t: '¿Cómo se llama tu perro?', s: 'Así personalizamos todo su plan.', tipo: 'nombre' },
    { id: 'raza', t: function () { return '¿De qué raza es ' + nombre() + '?'; }, s: 'Si es mestizo o no la ves, elige esa opción.', tipo: 'raza' },
    { id: 'tamano', cuando: function () { var r = D.raza(estado.r.razaId); return !r || !r.tamano; }, t: '¿Qué tamaño tiene?', tipo: 'opcion',
      lista: [['pequeno', { tam: ['chihuahua', .62] }, 'Pequeño', 'Menos de 10 kg'], ['mediano', { tam: ['beagle', .82] }, 'Mediano', 'De 10 a 25 kg'], ['grande', { tam: ['labrador', 1] }, 'Grande', 'Más de 25 kg']] },
    { id: 'edadPerro', t: function () { return '¿Qué edad tiene ' + nombre() + '?'; }, tipo: 'opcion', dos: true,
      lista: [['joven', ['huella', 'butter'], '6–12 meses'], ['adulto', ['huella', 'peach'], '1–3 años'], ['maduro', ['huella', 'mint'], '3–7 años'], ['senior', ['huella', 'lilac'], 'Más de 7 años']] },
    { id: 'problema', t: '¿Qué es lo que más te preocupa ahora?', s: 'Empezaremos el plan por aquí.', tipo: 'opcion', listaFn: listaProblemas },
    { id: 'detalle', t: function () { return { correa: '¿Cuándo tira más?', ladridos: '¿Cuándo ladra más?', solo: '¿Qué pasa cuando se queda solo?', adaptacion: '¿Qué es lo que más le cuesta?' }[estado.r.problema] || '¿Cuándo pasa?'; }, tipo: 'opcion',
      listaFn: function () { var ic = ['estrella', 'chispa', 'reloj']; var col = ['butter', 'peach', 'sky']; return prog().detalles.map(function (d, k) { return [d[0], [ic[k], col[k]], d[1], d[2]]; }); } },
    { id: 'muerde', t: function () { return '¿' + nombre() + ' ha mordido o amenazado con morder a alguien?'; }, s: 'Gruñir enseñando los dientes o lanzarse para morder también cuenta. Responde con sinceridad: es por su bien.', tipo: 'opcion', dos: true,
      lista: [['no', ['check', 'mint'], 'No, nunca'], ['si', ['escudo', 'peach'], 'Sí, alguna vez']] },
    { id: 'vivienda', t: '¿Dónde vivís?', tipo: 'opcion', dos: true, lista: [['piso', ['piso', 'sky'], 'Piso', 'Sin jardín'], ['jardin', ['casa', 'mint'], 'Casa con jardín', 'O patio propio']] },
    { id: 'horasSolo', t: function () { return '¿Cuántas horas al día se queda ' + nombre() + ' sin nadie en casa?'; }, tipo: 'opcion',
      lista: [[0, ['corazon', 'mint'], 'Casi nunca', 'Siempre hay alguien'], [2, ['reloj', 'sky'], '1–2 horas'], [4, ['reloj', 'butter'], '3–4 horas'], [6, ['reloj', 'peach'], '5–6 horas'], [8, ['reloj', 'lilac'], '7 horas o más']] },
    { id: 'convivientes', t: '¿Quién más vive en casa?', s: 'Marca todas las que correspondan.', tipo: 'multi',
      lista: [['solo', ['persona', 'sky'], 'Solo yo'], ['adultos', ['personas', 'mint'], 'Otros adultos'], ['ninos', ['nino', 'butter'], 'Niños'], ['perros', ['perro', 'peach'], 'Otro perro'], ['gatos', ['gato', 'lilac'], 'Gatos']], exclusivos: ['solo'] },
    { id: 'email', t: function () { return '¿Dónde te enviamos el plan de ' + nombre() + '?'; }, s: 'Te mostramos el resultado ahora mismo y te guardamos una copia.', tipo: 'email' }
  ];
  function visibles() { return PREGUNTAS.filter(function (q) { return !q.cuando || q.cuando(); }); }

  function cuerpoOpcion(o) {
    var icono = o[1];
    var vis = icono.tam ? '<span class="tam"><span style="width:' + Math.round(icono.tam[1] * 56) + 'px">' + D.cara(icono.tam[0]) + '</span></span>' : burbuja(icono[0], icono[1]);
    return vis + '<span>' + esc(o[2]) + (o[3] ? '<small>' + esc(o[3]) + '</small>' : '') + '</span>';
  }

  function pregunta(i) {
    var lista = visibles();
    if (i > lista.length) { estado.paso = 'preparando'; guardarEstado(); return render(); }
    var q = lista[i - 1];
    var items = q.listaFn ? q.listaFn() : q.lista;
    var titulo = typeof q.t === 'function' ? q.t() : q.t;
    pintarBarra({ progreso: (i - 1) / lista.length, atras: function () { if (i === 1) { estado.paso = 0; guardarEstado(); return render(); } estado.paso = i - 1; guardarEstado(); render(); } });
    var html = '<div class="pila-g"><div class="cabecera-preg"><h2>' + esc(titulo) + '</h2>' + (q.s ? '<p class="suave">' + esc(q.s) + '</p>' : '') + '</div>';
    var val = estado.r[q.id];

    if (q.tipo === 'nombre') {
      html += '<div class="pila"><div class="campo-avatar"><span class="avatar">' + D.cara(estado.r.razaId || 'otra') + '</span>' +
        '<input type="text" id="campo" maxlength="30" autocomplete="off" placeholder="Por ejemplo, Kira" value="' + esc(val || '') + '"></div>' +
        '<p class="hola" id="hola"></p><button class="btn" id="sig">Continuar</button></div>';
    } else if (q.tipo === 'raza') {
      html += '<div class="razas">' + D.RAZAS.map(function (r) { return '<button class="raza" data-raza="' + r.id + '" aria-pressed="' + (estado.r.razaId === r.id) + '">' + D.cara(r.id) + '<span>' + esc(r.nombre) + '</span></button>'; }).join('') + '</div>' +
        '<div class="pila" id="otra-raza"' + (estado.r.razaId === 'otra' ? '' : ' hidden') + '><input type="text" id="campo-raza" maxlength="40" placeholder="Escribe su raza" value="' + esc(estado.r.razaId === 'otra' ? estado.r.raza || '' : '') + '"><p class="hola" id="aviso-raza"></p><button class="btn" id="sig-raza">Continuar</button></div>';
    } else if (q.tipo === 'email') {
      var c = estado.consent || {};
      html += '<div class="pila"><div class="campo-avatar"><span class="avatar">' + D.cara(razaId(), { lengua: true }) + '</span>' +
        '<input type="email" id="campo" autocomplete="email" inputmode="email" placeholder="tu@email.com" value="' + esc(estado.email || '') + '"></div>' +
        '<label class="check"><input type="checkbox" id="c-priv"' + (c.privacidad ? ' checked' : '') + '> <span>He leído la <a href="/privacidad" target="_blank">política de privacidad</a> y acepto que tratéis mis datos para preparar mi resultado.</span></label>' +
        '<label class="check"><input type="checkbox" id="c-com"' + (c.comerciales ? ' checked' : '') + '> <span>Quiero recibir consejos y ofertas de ' + esc(CONF.marca) + ' por email (opcional).</span></label>' +
        '<label class="check"><input type="checkbox" id="c-seg"' + (c.seguros ? ' checked' : '') + '> <span>Acepto que me contactéis con ofertas de seguros para mi perro (opcional).</span></label>' +
        '<p class="error" id="err"></p><button class="btn" id="sig">Ver el resultado de ' + esc(nombre()) + '</button></div>';
    } else {
      var multi = q.tipo === 'multi', sel = multi ? (val || []) : [];
      html += '<div class="opciones' + (q.dos ? ' dos' : '') + '">' + items.map(function (o, k) {
        var marcado = multi ? sel.indexOf(o[0]) >= 0 : String(val) === String(o[0]);
        return '<button class="opcion" data-k="' + k + '" aria-pressed="' + marcado + '">' + cuerpoOpcion(o) + (multi ? '<span class="marca-check">' + I('check') + '</span>' : '') + '</button>';
      }).join('') + '</div>' + (multi ? '<button class="btn" id="sig"' + (sel.length ? '' : ' disabled') + '>Continuar</button>' : '');
    }
    pintar(html + '</div>');

    function avanzar() { evento('paso', q.id); estado.paso = i + 1; guardarEstado(); render(); }
    var campo = document.getElementById('campo'), sig = document.getElementById('sig');

    if (q.tipo === 'nombre') {
      var hola = document.getElementById('hola');
      var act = function () { var v = campo.value.trim(); sig.textContent = v ? 'Continuar' : 'Saltar'; hola.textContent = v ? '¡Hola, ' + v + '!' : ''; };
      act(); campo.focus(); campo.oninput = act;
      campo.onkeydown = function (e) { if (e.key === 'Enter') sig.click(); };
      sig.onclick = function () { estado.r.nombre = campo.value.trim(); avanzar(); };
      return;
    }
    if (q.tipo === 'raza') {
      var otra = document.getElementById('otra-raza'), campoR = document.getElementById('campo-raza'), sigR = document.getElementById('sig-raza');
      app.querySelectorAll('.raza').forEach(function (b) {
        b.onclick = function () {
          var r = D.raza(b.dataset.raza);
          app.querySelectorAll('.raza').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          estado.r.razaId = r.id; if (r.tamano) estado.r.tamano = r.tamano;
          if (r.id === 'otra') { otra.hidden = false; campoR.focus(); sigR.disabled = !campoR.value.trim(); guardarEstado(); return; }
          otra.hidden = true; estado.r.raza = r.nombre; guardarEstado(); setTimeout(avanzar, 200);
        };
      });
      campoR.oninput = function () { sigR.disabled = !campoR.value.trim(); var id = D.buscar(campoR.value); document.getElementById('aviso-raza').textContent = id ? 'Usaremos el dibujo de ' + D.raza(id).nombre + '.' : ''; };
      campoR.onkeydown = function (e) { if (e.key === 'Enter' && campoR.value.trim()) sigR.click(); };
      sigR.onclick = function () {
        var texto = campoR.value.trim(), id = D.buscar(texto);
        if (id) { var rz = D.raza(id); estado.r.razaId = id; estado.r.raza = rz.nombre; if (rz.tamano) estado.r.tamano = rz.tamano; } else estado.r.raza = texto;
        avanzar();
      };
      return;
    }
    if (q.tipo === 'opcion' || q.tipo === 'multi') {
      var botones = app.querySelectorAll('.opcion');
      botones.forEach(function (b) {
        b.onclick = function () {
          var o = items[Number(b.dataset.k)];
          if (q.tipo === 'multi') {
            var arr = (estado.r[q.id] || []).slice(), exc = q.exclusivos || [], pos = arr.indexOf(o[0]);
            if (pos >= 0) arr.splice(pos, 1); else if (exc.indexOf(o[0]) >= 0) arr = [o[0]]; else { arr = arr.filter(function (x) { return exc.indexOf(x) < 0; }); arr.push(o[0]); }
            estado.r[q.id] = arr;
            botones.forEach(function (x) { x.setAttribute('aria-pressed', arr.indexOf(items[Number(x.dataset.k)][0]) >= 0 ? 'true' : 'false'); });
            sig.disabled = !arr.length; guardarEstado();
            return;
          }
          botones.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          if (q.id === 'problema' && estado.r.problema !== o[0]) delete estado.r.detalle;
          if (q.id === 'tipo' && o[0] === 'adulto' && estado.r.problema === 'adaptacion') { delete estado.r.problema; delete estado.r.detalle; }
          estado.r[q.id] = o[0]; estado.r[q.id + 'Texto'] = o[2];
          if (q.id === 'muerde' && o[0] === 'si') { guardarEstado(); return setTimeout(derivar, 200); }
          setTimeout(avanzar, 200);
        };
      });
      if (sig) sig.onclick = avanzar;
      return;
    }
    sig.onclick = function () {
      var email = campo.value.trim(), err = document.getElementById('err');
      var consent = { privacidad: document.getElementById('c-priv').checked, comerciales: document.getElementById('c-com').checked, seguros: document.getElementById('c-seg').checked };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Revisa el email: parece que falta algo.'; return; }
      if (!consent.privacidad) { err.textContent = 'Para enviarte el resultado necesitamos que aceptes la política de privacidad.'; return; }
      sig.disabled = true; estado.email = email; estado.consent = consent;
      var r = estado.r;
      post('/api/lead', { sid: sid, email: email, consentimientos: consent, utm: utm, cm: cm(), respuestas: { tipo: r.tipo, nombre: r.nombre, raza: r.raza, razaId: r.razaId, tamano: r.tamano, edadPerro: r.edadPerro, problema: r.problema, detalle: r.detalle, muerde: r.muerde, vivienda: r.vivienda, horasSolo: r.horasSolo, convivientes: r.convivientes } })
        .then(function () { pixel('Lead', { content_name: estado.r.problema || utm.a || 'perro', content_category: 'perro' }, 'lead_' + sid); estado.paso = 'preparando'; guardarEstado(); render(); })
        .catch(function () { sig.disabled = false; err.textContent = 'No hemos podido guardar tus respuestas. Inténtalo de nuevo.'; });
    };
  }

  // ---------- Derivar a un profesional (no se vende) ----------
  function derivar() {
    evento('derivado', estado.r.problema);
    pintarBarra(null);
    var d = PR.DERIVAR;
    pintar('<div class="pila-g"><div class="pila"><span class="avatar" style="width:88px;height:88px">' + D.cara(razaId()) + '</span>' +
      '<h1 style="font-size:1.7rem">' + esc(d.titulo) + '</h1><p>' + esc(d.texto) + '</p></div>' +
      '<div class="tarjeta"><ul class="lista-inc">' + d.pasos.map(function (p, k) { return '<li>' + burbuja(['corazon', 'personas', 'escudo'][k], ['peach', 'mint', 'sky'][k]) + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<p class="suave">Gracias por responder con sinceridad. Es lo mejor para ' + esc(nombre()) + '.</p>' +
      '<button class="btn sec" id="volver-test">Me he equivocado de respuesta</button></div>');
    document.getElementById('volver-test').onclick = function () { estado.r.muerde = 'no'; render(); };
  }

  // ---------- Preparando ----------
  function preparando() {
    pintarBarra(null);
    var pasos = ['Analizando por qué ' + nombre() + ' ' + (estado.r.problema === 'adaptacion' ? 'está así' : 'lo hace'), 'Ajustando el plan a ' + (estado.r.raza || 'su raza').toLowerCase(), 'Preparando sus 6 semanas'];
    pintar('<div class="preparando"><div class="anillo">' + D.cara(razaId()) + '</div><h2>Preparando el plan de ' + esc(nombre()) + '</h2>' +
      '<ul class="checklist-carga">' + pasos.map(function (p) { return '<li>' + I('check') + esc(p) + '</li>'; }).join('') + '</ul></div>');
    var items = app.querySelectorAll('.checklist-carga li');
    [700, 1500, 2300].forEach(function (t, k) { setTimeout(function () { if (items[k]) items[k].classList.add('hecho'); }, t); });
    setTimeout(function () { estado.paso = 'resultado'; guardarEstado(); render(); }, 3100);
  }

  // ---------- Resultado gratis + paywall ----------
  function resultado() {
    pintarBarra(null);
    evento('resultado_visto');
    var r = estado.r, pg = prog();
    var rasgo = (P.RASGOS && P.RASGOS[razaId()]) || {};
    var nombreRaza = ((D.raza(razaId()) || {}).nombre || 'tu perro').toLowerCase();
    var ajustes = [['perro', r.raza || 'Su raza'], ['huella', r.edadPerroTexto || 'Su edad'], [pg.icono, pg.titulo], [r.vivienda === 'jardin' ? 'casa' : 'piso', r.vivienda === 'jardin' ? 'Casa con jardín' : 'Piso']];
    if (r.tipo === 'adoptado') ajustes.push(['casa', 'Recién adoptado']);
    var notas = [];
    if (pg.notaDetalle[r.detalle]) notas.push(sus(pg.notaDetalle[r.detalle]));
    if (rasgo.nota) notas.push('Por ser ' + nombreRaza + ': ' + rasgo.nota.charAt(0).toLowerCase() + rasgo.nota.slice(1));
    if (rasgo.energia === 'alta') notas.push('Su raza tiene mucha energía: el juego de olfato antes de practicar le ayudará a concentrarse.');

    var html = '<div class="pila-g">' +
      '<section class="pila"><div class="perfil"><span class="avatar">' + D.cara(razaId(), { lengua: true }) + '</span>' +
        '<div class="pila" style="gap:6px"><span class="chip ok">' + I('check') + 'Gratis para ti</span><h1 style="font-size:1.7rem">Los 3 primeros días de ' + esc(nombre()) + '</h1></div></div>' +
        '<div class="ajustes"><span class="suave peq">Ajustado a:</span>' + ajustes.map(function (a) { return '<span class="chip">' + I(a[0]) + esc(a[1]) + '</span>'; }).join('') + '</div>' +
        window.VENTA.aviso({ nombre: nombre(), semanas: 6 }, { I: I, esc: esc }) + '</section>' +
      '<section class="tarjeta pila"><h3>' + I(pg.icono) + ' Por qué lo hace</h3><p>' + esc(sus(pg.porQue)) + '</p>' +
        notas.map(function (x) { return '<p class="nota raza-nota">' + I('huella') + '<span>' + esc(x) + '</span></p>'; }).join('') + '</section>' +
      '<section class="tarjeta pila"><ul class="linea-tiempo">' + pg.primerosDias.map(function (d, k) {
        return '<li>' + burbuja(['estrella', 'chispa', 'check'][k], ['butter', 'peach', 'mint'][k]) + '<div><div class="hora">Día ' + (k + 1) + ' · ' + esc(d[0]) + '</div><div class="txt">' + esc(sus(d[1])) + '</div></div></li>';
      }).join('') + '</ul></section>' +
      '<section class="pila"><h2>Así es su plan de 6 semanas</h2>' + vistaPrevia() + '</section>' +
      paywallHtml() + window.VENTA.preguntas({ precio: CONF.precio }, { esc: esc, euros: euros }) + '</div>';
    pintar(html);
    evento('paywall_visto');
    activarPaywall();
  }

  function vistaPrevia() {
    var pg = prog(), n = nombre();
    var dias = pg.semanas[0].tareas.map(function (t, k) {
      return '<li' + (k > 2 ? ' class="borroso"' : '') + '><span class="casilla"></span><span><b>Día ' + (k + 1) + ' · ' + esc(t[0]) + '</b>' + esc(sus(t[1])) + '</span></li>';
    }).join('');
    return '<div class="peek"><div class="peek-hero"><span class="avatar">' + D.cara(razaId(), { lengua: true }) + '</span><div><small>' + esc(pg.titulo) + '</small><b>' + esc(n) + '</b><div class="peek-bar"><i></i></div></div></div>' +
      '<div class="peek-tabs" style="grid-template-columns:repeat(6,1fr)">' + pg.semanas.map(function (s, k) { return '<span' + (k === 0 ? ' class="on"' : '') + '>S' + (k + 1) + '<small>' + esc(s.foco.split(' ')[0]) + '</small></span>'; }).join('') + '</div>' +
      '<div class="peek-body"><p class="eti-peq">Semana 1 · ' + esc(pg.semanas[0].foco) + '</p><ul class="peek-dias">' + dias + '</ul>' +
      '<div class="peek-candado"><span>' + I('candado') + '42 días de tareas, las reglas y cuándo pedir ayuda</span></div></div></div>';
  }

  function paywallHtml() {
    var pg = prog(), dia = (CONF.precio / 42 / 100).toFixed(2).replace('.', ',');
    return '<section class="tarjeta pila" id="paywall" style="gap:18px">' +
      '<div class="portada-plan"><div class="fila-p"><span class="avatar">' + D.cara(razaId()) + '</span><div><small>' + esc(pg.titulo) + ' · 6 semanas</small><h2>' + esc(nombre()) + '</h2></div></div>' +
        '<div class="semanas" style="grid-template-columns:repeat(6,1fr)">' + [1, 2, 3, 4, 5, 6].map(function (s) { return '<span>S' + s + '</span>'; }).join('') + '</div></div>' +
      '<h3 class="venta-tit">Todo lo que tendrás para ' + esc(nombre()) + '</h3>' +
      window.VENTA.incluye({ semanas: 6, prioridad: pg.titulo.toLowerCase(), icono: pg.icono,
        extras: ['Ajustado a cuándo y cómo le pasa a ' + nombre(), 'Con lo que necesita su raza y su edad', 'Qué hacer, qué evitar y cuándo pedir ayuda profesional'] }, { I: I, burbuja: burbuja, esc: esc }) +
      window.VENTA.comparativa({ nombre: nombre(), semanas: 6, precio: CONF.precio }, { esc: esc, euros: euros }) +
      '<div class="precio-fila"><span class="precio">' + euros(CONF.precio) + '</span><span class="suave">Pago único · menos de ' + dia + ' € al día</span></div>' +
      '<label class="check"><input type="checkbox" id="desist"> <span>Quiero recibir el plan ya. Acepto que, al empezar la entrega del contenido digital, pierdo el derecho legal de desistimiento. <a href="/condiciones" target="_blank">Términos y condiciones</a>.</span></label>' +
      '<p class="error" id="err-pago"></p><button class="btn" id="pagar">Quiero el plan de ' + esc(nombre()) + ' · ' + euros(CONF.precio) + '</button>' +
      '<p class="micro"><span>' + I('candado') + 'Pago seguro con Stripe</span><span>Tarjeta · Apple Pay · Google Pay</span></p>' +
      '<p class="peq suave">El plan da pautas de educación en positivo. No sustituye a tu veterinario ni a un profesional que vea a tu perro en persona.</p></section>';
  }

  function activarPaywall() {
    var V = { I: I, burbuja: burbuja, esc: esc, euros: euros };
    window.VENTA.barra({ precio: CONF.precio, nombre: nombre() }, V);
    window.VENTA.activarPago({ pagar: function (btn, err) {
      btn.disabled = true; btn.textContent = 'Abriendo el pago…';
      pixel('InitiateCheckout', { value: CONF.precio / 100, currency: 'EUR', content_name: estado.r.problema, num_items: 1 }, 'ic_' + sid);
      post('/api/checkout', { sid: sid, desistimiento: true, cm: cm() })
        .then(function (j) { location.href = j.url; })
        .catch(function (e) { err.textContent = (e && e.error) || 'No hemos podido abrir el pago. Inténtalo de nuevo.'; btn.disabled = false; btn.textContent = 'Quiero el plan de ' + nombre(); });
    } });
  }


  // ---------- Vuelta del pago ----------
  function trasPago(sessionId) {
    pintarBarra(null);
    pintar('<div class="preparando"><div class="anillo">' + D.cara(razaId()) + '</div><h2>Confirmando tu pago…</h2></div>');
    fetch('/api/pedido?session_id=' + encodeURIComponent(sessionId)).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.pagado) { pintar('<div class="pila"><h2>Todavía no vemos el pago</h2><p>Si te han cobrado, escríbenos a ' + esc(CONF.emailContacto) + ' y lo resolvemos hoy.</p></div>'); return; }
      if (lsGet('pc_compra_px') !== sessionId) { pixel('Purchase', { value: j.importe / 100, currency: 'EUR', content_type: 'product', contents: [{ id: 'plan', quantity: 1 }] }, 'compra_' + sessionId); lsSet('pc_compra_px', sessionId); }
      if (j.upsell) upsell(sessionId); else gracias(false);
    }).catch(function () { pintar('<div class="pila"><h2>No hemos podido confirmar el pago</h2><p>Recarga la página en unos segundos.</p></div>'); });
  }

  // Upsell: otro programa del mismo perro
  function upsell(sessionId) {
    evento('upsell_visto');
    var otros = ['correa', 'ladridos', 'solo'].filter(function (k) { return k !== estado.r.problema; }).slice(0, 2);
    pintar('<div class="pila-g"><div class="pila"><span class="chip ok">' + I('check') + 'Pago confirmado</span>' +
      '<h1 style="font-size:1.8rem">¿Trabajamos otra cosa a la vez?</h1>' +
      '<p class="suave">Añade un segundo programa para ' + esc(nombre()) + ' por <b>' + euros(CONF.precioUpsell) + '</b>. Se cobra en la misma tarjeta, sin volver a meter datos.</p></div>' +
      otros.map(function (k) { var pg = PR.PROGRAMAS[k]; return '<div class="tarjeta pack"><div class="cab">' + burbuja(pg.icono, 'mint') + '<h3>' + esc(pg.titulo) + '</h3></div><p class="suave">' + esc(pg.porQue.split('. ')[0]) + '.</p><button class="btn" data-pack="' + k + '">Añadir por ' + euros(CONF.precioUpsell) + '</button></div>'; }).join('') +
      '<p class="error" id="err-up"></p><button class="btn texto" id="no-up">No, gracias. Ir a mi plan</button></div>');
    app.querySelectorAll('[data-pack]').forEach(function (b) {
      b.onclick = function () {
        app.querySelectorAll('[data-pack]').forEach(function (x) { x.disabled = true; }); b.textContent = 'Añadiendo…';
        post('/api/upsell', { session_id: sessionId, pack: b.dataset.pack, cm: cm() })
          .then(function () { pixel('Purchase', { value: CONF.precioUpsell / 100, currency: 'EUR', content_name: 'upsell_' + b.dataset.pack, content_type: 'product', contents: [{ id: 'upsell', quantity: 1 }] }, 'upsell_' + sessionId); gracias(true); })
          .catch(function (e) { document.getElementById('err-up').textContent = (e && e.error) || 'No se ha podido añadir. Tu plan no se ve afectado.'; app.querySelectorAll('[data-pack]').forEach(function (x) { x.disabled = false; }); b.textContent = 'Reintentar'; });
      };
    });
    document.getElementById('no-up').onclick = function () { evento('upsell_rechazado'); gracias(false); };
  }

  function gracias(conPack) {
    pintarBarra(null);
    var email = estado.email, respuestas = estado.r;
    lsSet('pn_estado', null);
    pintar('<div class="celebra"><span class="avatar">' + D.cara(razaId(), { lengua: true }) + '<span class="sello">' + I('check') + '</span></span>' +
      '<h1 style="font-size:1.9rem">Empieza el plan de ' + esc(nombre()) + '</h1>' +
      '<p class="suave">Lo estamos preparando con sus respuestas. Te llegará a <b>' + esc(email || 'tu email') + '</b>.</p>' +
      '<ul class="proximos">' +
        '<li>' + burbuja('correo', 'sky') + '<div><b>Hoy, en menos de 24 horas</b><span>Su plan completo en una página privada' + (conPack ? ', con el segundo programa' : '') + '.</span></div></li>' +
        '<li>' + burbuja('sol', 'butter') + '<div><b>Mañana</b><span>Primer email con la tarea del día.</span></div></li>' +
        '<li>' + burbuja('estrella', 'mint') + '<div><b>Día 7</b><span>Te preguntamos cómo vais para ajustar lo que haga falta.</span></div></li>' +
      '</ul>' +
      (window.DEMO_VER_PLAN ? '<button class="btn" id="ver-plan">' + I('calendario') + 'Ver el plan de ' + esc(nombre()) + '</button>' : '') +
      '<div class="garantia">' + I('correo') + '<span>¿Dudas por el camino? Responde a cualquiera de nuestros emails y te ayudamos.</span></div></div>');
    var vp = document.getElementById('ver-plan');
    if (vp) vp.onclick = function () { verPlan(respuestas); };
  }

  function verPlan(r) {
    var html = window.PLAN_ADULTO_HTML.render({ respuestas: r, marca: CONF.marca, id: 'demo-adulto', volver: true });
    document.open(); document.write(html); document.close();
  }
  window.verPlanAdultoDemo = function () { verPlan(estado.r && estado.r.nombre ? estado.r : { tipo: 'adulto', nombre: 'Kira', raza: 'Husky', razaId: 'husky', tamano: 'grande', edadPerro: 'adulto', problema: 'correa', detalle: 'estimulos', vivienda: 'piso', horasSolo: 4 }); };

  function render() {
    if (estado.paso === 0) return angulo ? portada() : pregunta(1);
    if (typeof estado.paso === 'number') { if (estado.r.muerde === 'si') return derivar(); return pregunta(estado.paso); }
    if (estado.paso === 'preparando') return preparando();
    if (estado.paso === 'resultado') return resultado();
    pregunta(1);
  }

  fetch('/api/config?sid=' + sid).then(function (r) { return r.json(); }).then(function (c) { CONF = c; }).catch(function () {}).then(function () {
    document.getElementById('pie-contacto').textContent = CONF.emailContacto || '';
    document.title = CONF.marca + ' · El plan para tu perro';
    gestionarCookies();
    if (params.get('pago') === 'ok' && params.get('session_id')) return trasPago(params.get('session_id'));
    if (params.get('pago') === 'cancelado') { evento('checkout_cancelado'); estado.paso = 'resultado'; }
    if (estado.paso === 0) { evento('visita'); if (!angulo) evento('inicio_form'); }
    guardarEstado();
    render();
  });
})();
