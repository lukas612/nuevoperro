/*
 * Piezas de venta que comparten /cachorro y /perro después del test:
 * aviso arriba con botón, bloque "todo lo que incluye", comparativa de precio, preguntas y barra fija.
 * Cada funnel le pasa sus utilidades: { I, burbuja, esc, euros }.
 */
(function (root) {
  'use strict';

  function aviso(o, u) {
    return '<a class="venta-aviso" href="#paywall">' +
      '<span class="venta-aviso-txt"><b>Todo lo que necesita ' + u.esc(o.nombre) + ' está listo</b>' +
      '<span>' + u.esc(o.semanas) + ' semanas de plan · clicker y diario en tu móvil · para siempre</span></span>' +
      '<span class="venta-aviso-btn">Verlo ' + u.I('flecha') + '</span></a>';
  }

  // Lo que se lleva: cuadrícula tipo app, con lo más vistoso primero.
  function incluye(o, u) {
    var piezas = [
      ['calendario', 'butter', 'Una tarea al día', 'De 5 a 15 minutos, ' + o.semanas + ' semanas'],
      [o.icono || 'estrella', 'peach', 'Empezamos por ' + o.prioridad, 'Paso a paso, sin castigos'],
      ['chispa', 'sky', 'Clicker en el móvil', 'Marca lo que hace bien'],
      ['estrella', 'mint', 'Diario de progresos', 'Mira cómo mejora cada semana'],
      ['casa', 'lilac', 'Mi zona, como una app', 'En tu pantalla de inicio'],
      ['correo', 'sky', 'Email cada mañana', 'Con la tarea del día']
    ];
    return '<div class="venta-incluye">' + piezas.map(function (p) {
      return '<div class="venta-pieza">' + u.burbuja(p[0], p[1]) + '<b>' + u.esc(p[2]) + '</b><span>' + u.esc(p[3]) + '</span></div>';
    }).join('') + '</div>' +
      (o.extras && o.extras.length ? '<ul class="venta-extras">' + o.extras.map(function (x) { return '<li>' + u.I('check') + u.esc(x) + '</li>'; }).join('') + '</ul>' : '');
  }

  function comparativa(o, u) {
    return '<div class="venta-compara">' +
      '<div><span>Una sola clase con un educador</span><b>30–60 €</b></div>' +
      '<div class="tu"><span>Todo lo de ' + u.esc(o.nombre) + ': plan de ' + u.esc(o.semanas) + ' semanas y Mi zona</span><b>' + u.euros(o.precio) + '</b></div></div>';
  }

  function preguntas(o, u) {
    var faq = [
      ['¿Es una suscripción?', 'No. Es un pago único de ' + u.euros(o.precio) + '. No se renueva y no hay que darse de baja de nada.'],
      ['¿Hasta cuándo tengo acceso?', 'Para siempre. El plan y Mi zona son tuyos, sin fecha de caducidad: vuelve a él cuando quieras, a tu ritmo.'],
      ['¿Cuánto tiempo al día?', 'Entre 5 y 15 minutos. Cada mañana te llega la tarea del día por email y la tienes en Mi zona.'],
      ['¿Y si me atasco?', 'Responde a cualquiera de nuestros emails y te ayudamos con vuestro caso.'],
      ['¿Cuándo lo recibo?', 'Nada más pagar. Te llega por email y lo tienes en Mi zona, en el móvil.']
    ];
    return '<section class="pila"><h2>Preguntas rápidas</h2><div class="venta-faq">' + faq.map(function (f) {
      return '<details><summary>' + u.esc(f[0]) + '</summary><p>' + u.esc(f[1]) + '</p></details>';
    }).join('') + '</div></section>';
  }

  // Barra inferior con precio y botón. Aparece al bajar y se oculta cuando el bloque de pago está a la vista.
  function barra(o, u) {
    var vieja = document.getElementById('venta-barra');
    if (vieja) vieja.remove();
    var el = document.createElement('div');
    el.id = 'venta-barra'; el.className = 'venta-barra'; el.hidden = true;
    el.innerHTML = '<div class="venta-barra-in"><span><b>' + u.euros(o.precio) + '</b><small>Pago único · para siempre</small></span>' +
      '<a class="btn" href="#paywall">Quiero el plan de ' + u.esc(o.nombre) + '</a></div>';
    document.body.appendChild(el);
    var pago = document.getElementById('paywall');
    var pagoVisible = false;
    function actualizar() { el.hidden = pagoVisible || window.scrollY < 500 || !document.body.contains(pago); }
    if ('IntersectionObserver' in window && pago) {
      new IntersectionObserver(function (e) { pagoVisible = e[0].isIntersecting; actualizar(); }, { threshold: 0.05 }).observe(pago);
    }
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
  }
  function quitarBarra() { var b = document.getElementById('venta-barra'); if (b) b.remove(); }

  // Botón siempre activo: si falta la casilla legal, la señalamos en vez de dejar el botón gris.
  function activarPago(o) {
    var chk = document.getElementById('desist'), btn = document.getElementById('pagar'), err = document.getElementById('err-pago');
    var caja = chk.closest('.check');
    btn.disabled = false;
    chk.onchange = function () { err.textContent = ''; caja.classList.remove('falta'); };
    btn.onclick = function () {
      if (!chk.checked) {
        err.textContent = 'Marca la casilla de los términos y condiciones para continuar.';
        caja.classList.remove('falta'); void caja.offsetWidth; caja.classList.add('falta');
        caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      o.pagar(btn, err);
    };
  }

  // ---------- Pago integrado (Stripe Embedded Checkout) en una hoja que sube desde abajo ----------
  function cargarStripe() {
    if (window.Stripe) return Promise.resolve();
    return new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = 'https://js.stripe.com/v3/'; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
  }
  function pagoIntegrado(o) {
    var checkout = null;
    var hoja = document.createElement('div');
    hoja.className = 'pago-hoja';
    hoja.innerHTML = '<div class="pago-in" role="dialog" aria-modal="true" aria-label="Pago seguro">' +
      '<div class="pago-cab"><span><b>Pago seguro</b><small>' + (o.titulo || '') + '</small></span><button type="button" class="pago-cerrar" aria-label="Cerrar">×</button></div>' +
      '<div id="pago-stripe"><p class="pago-cargando">Cargando el pago seguro…</p></div></div>';
    document.body.appendChild(hoja);
    document.documentElement.classList.add('pago-abierto');
    requestAnimationFrame(function () { hoja.classList.add('visible'); });
    function cerrar(sinAviso) {
      hecho = true;
      try { if (checkout) checkout.destroy(); } catch (e) {}
      hoja.remove(); document.documentElement.classList.remove('pago-abierto');
      if (!sinAviso && o.alCerrar) o.alCerrar();
    }
    hoja.querySelector('.pago-cerrar').onclick = function () { cerrar(); };
    hoja.addEventListener('click', function (e) { if (e.target === hoja) cerrar(); });
    var hecho = false;
    var fallo = function () { if (hecho) return; hecho = true; cerrar(true); o.alFallar(); };
    var reloj = setTimeout(fallo, 15000); // si en 15 s no se ha podido mostrar, a la página de pago de Stripe
    // Primero pedimos la sesión nosotros: así cualquier fallo vuelve aquí y no se queda la hoja colgada.
    Promise.all([cargarStripe(), o.pedir()]).then(function (r) {
      var st = window.Stripe(o.pk);
      if (!st.initEmbeddedCheckout) throw new Error('sin pago integrado');
      return st.initEmbeddedCheckout({ fetchClientSecret: function () { return Promise.resolve(r[1]); } });
    }).then(function (c) {
      if (hecho) { try { c.destroy(); } catch (e) {} return; }
      hecho = true; clearTimeout(reloj);
      checkout = c; hoja.querySelector('#pago-stripe').innerHTML = ''; c.mount('#pago-stripe');
    }).catch(fallo);
  }

  // ---------- Vista previa del panel: herramientas con candado y consejos ----------
  function panel(o, u) {
    var img = function (f) { return '<img src="/email/' + f + '" alt="" loading="lazy">'; };
    var ico = function (ic, color) { return '<span class="tile-ico">' + u.burbuja(ic, color) + '</span>'; };
    var tiles = o.adulto ? [
      [img('plan-perro.jpg'), 'Tu progreso', 'Lo que lleváis hecho, semana a semana', 'diario'],
      [ico('escudo', 'sky'), 'Si hay una recaída', 'Qué hacer y cuándo pedir ayuda', 'extra'],
      [ico('personas', 'lilac'), 'Hacedlo juntos', 'Comparte el plan con tu pareja', 'juntos'],
      [ico('vacuna', 'mint'), 'Carnet de salud', 'Vacunas y citas, con recordatorios', 'salud']
    ] : [
      [ico('reloj', 'sky'), 'Su rutina, hora a hora', 'Ajustada cada semana a su edad', 'extra'],
      [ico('estrella', 'peach'), 'Los 4 protocolos', 'Pis, mordiscos, noches y quedarse solo', 'protocolos'],
      [ico('personas', 'lilac'), 'Hacedlo juntos', 'Comparte el plan con tu pareja', 'juntos'],
      [ico('vacuna', 'mint'), 'Carnet de salud', 'Vacunas y citas, con recordatorios en el móvil', 'salud']
    ];
    return '<section class="pila"><span class="etiqueta">Tu panel</span><div class="tiles-bloq">' + tiles.map(function (t) {
      return '<button type="button" class="tile-bloq" data-bloq="' + t[3] + '"><span class="tile-vis" aria-hidden="true">' + t[0] + '</span>' +
        '<span class="tile-candado">' + u.I('candado') + '</span><b>' + u.esc(t[1]) + '</b><span>' + u.esc(t[2]) + '</span></button>';
    }).join('') + '</div></section>';
  }
  function consejos(o, u) {
    var Z = window.ZONA && window.ZONA.CONSEJOS;
    if (!Z) return '';
    var sus = function (t) { return String(t).replace(/\{n\}/g, o.nombre); };
    var lista = (Z[o.problema] || []).concat(Z.general || []);
    if (!lista.length) return '';
    var abiertos = lista.slice(0, 2), resto = lista.slice(2, 5);
    var item = function (c) { return '<div class="consejo-item"><b>' + u.esc(c[0]) + '</b><p>' + u.esc(sus(c[1])) + '</p></div>'; };
    return '<section class="tarjeta pila"><div class="cab-consejo">' + u.burbuja('chispa', 'butter') + '<span class="etiqueta">Consejos para ' + u.esc(o.nombre) + '</span></div>' +
      abiertos.map(item).join('') +
      (resto.length ? '<div class="bloqueado"><div class="bloq-contenido" aria-hidden="true">' + resto.map(item).join('') + '</div>' +
        '<a class="bloq-cta" href="#paywall" data-bloq="consejos">' + u.I('candado') + '<span>Ver ' + (lista.length - 2) + ' consejos más</span></a></div>' : '') + '</section>';
  }
  // Todo lo que tiene candado lleva al bloque de pago y lo resalta
  function activarBloqueos(alTocar) {
    document.querySelectorAll('[data-bloq], a[href="#paywall"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var pw = document.getElementById('paywall'); if (!pw) return;
        e.preventDefault();
        if (alTocar && el.dataset.bloq) alTocar(el.dataset.bloq);
        pw.scrollIntoView({ behavior: 'smooth', block: 'start' });
        pw.classList.remove('resalta'); void pw.offsetWidth; pw.classList.add('resalta');
      });
    });
  }

  // ---------- Mini plan interactivo: los 3 primeros días se pueden marcar, el resto con candado ----------
  function miniPlan(o, u) {
    var hechas = (o.guardado || []).length;
    var dias = o.dias.slice(0, 7).map(function (d, k) {
      var key = 'd' + (k + 1);
      if (k < o.abiertos) {
        return '<li><label class="mp-dia"><input type="checkbox" data-d="' + key + '"' + ((o.guardado || []).indexOf(key) >= 0 ? ' checked' : '') + '>' +
          '<span class="mp-caja">' + u.I('check') + '</span><span><b>Día ' + (k + 1) + ' · ' + u.esc(d[0]) + '</b>' + u.esc(d[1]) + '</span></label></li>';
      }
      return '<li class="mp-bloq" data-bloq="dia"><span class="mp-caja"></span><span><b>Día ' + (k + 1) + ' · ' + u.esc(d[0]) + '</b>' + u.esc(d[1]) + '</span></li>';
    }).join('');
    return '<section class="mini-plan" id="mini-plan">' +
      '<div class="peek-hero"><span class="avatar">' + o.cara + '</span><div><small>' + u.esc(o.titulo) + '</small><b>' + u.esc(o.nombre) + '</b>' +
        '<div class="peek-bar"><i id="mp-barra" style="width:' + Math.max(3, hechas / o.total * 100) + '%"></i></div><span class="mp-cont" id="mp-cont">' + hechas + ' de ' + o.total + ' tareas hechas</span></div></div>' +
      '<div class="peek-tabs" style="grid-template-columns:repeat(' + o.tabs.length + ',1fr)">' + o.tabs.map(function (t, k) {
        return k === 0 ? '<span class="on">' + t[0] + '<small>' + u.esc(t[1]) + '</small></span>' : '<button type="button" class="mp-tab" data-bloq="semana">' + u.I('candado') + '<small>' + t[0] + '</small></button>';
      }).join('') + '</div>' +
      '<div class="peek-body"><p class="eti-peq">' + u.esc(o.foco) + '</p>' +
        '<p class="mp-ayuda" id="mp-msg">Prueba: marca el día 1 cuando lo hagas con ' + u.esc(o.nombre) + '.</p>' +
        '<ul class="mp-lista">' + dias + '</ul>' +
        '<a class="bloq-cta mp-cta" href="#paywall" data-bloq="dias">' + u.I('candado') + '<span>Desbloquea los ' + (o.total - o.abiertos) + ' días restantes</span></a>' +
      '</div></section>';
  }
  function activarMiniPlan(o) {
    var caja = document.getElementById('mini-plan'); if (!caja) return;
    var msg = document.getElementById('mp-msg');
    var pintar = function (nuevo) {
      var keys = [].slice.call(caja.querySelectorAll('input[data-d]:checked')).map(function (c) { return c.dataset.d; });
      document.getElementById('mp-barra').style.width = Math.max(3, keys.length / o.total * 100) + '%';
      document.getElementById('mp-cont').textContent = keys.length + ' de ' + o.total + ' tareas hechas';
      if (nuevo) {
        msg.className = 'mp-ayuda ok';
        msg.innerHTML = keys.length >= o.abiertos
          ? '<b>¡Los ' + o.abiertos + ' días de prueba, hechos!</b> ' + o.nombre + ' va lanzado. Desbloquea el plan y seguís mañana con el día ' + (o.abiertos + 1) + '. Tu progreso se guarda.'
          : '<b>¡Bien hecho!</b> Día ' + nuevo.slice(1) + ' completado. Si desbloqueas el plan, lo que marques aquí se guarda en tu plan.';
      }
      if (o.alGuardar) o.alGuardar(keys);
      return keys;
    };
    caja.querySelectorAll('input[data-d]').forEach(function (c) {
      c.addEventListener('change', function () {
        pintar(c.checked ? c.dataset.d : null);
        if (c.checked) { if (navigator.vibrate) navigator.vibrate(25); if (o.alMarcar) o.alMarcar(c.dataset.d); }
      });
    });
  }

  // ---------- Prueba social con actividad real (sin nombres ni emails) ----------
  var actividadDatos = null, actividadTimer = null, actividadMostrados = 0;
  function cargarActividad() {
    if (actividadDatos) return Promise.resolve(actividadDatos);
    return fetch('/api/actividad').then(function (r) { return r.json(); }).then(function (d) { actividadDatos = d; return d; }).catch(function () { return null; });
  }
  function contador(id) {
    cargarActividad().then(function (d) {
      var el = document.getElementById(id);
      if (el && d && d.semana >= 10) el.innerHTML = '<span class="ps-punto"></span>' + d.semana + ' perros han hecho el test esta semana';
    });
  }
  function hace(min) { return min < 60 ? 'hace ' + min + ' min' : min < 120 ? 'hace 1 h' : 'hace ' + Math.round(min / 60) + ' h'; }
  function notificaciones(o) {
    o = o || {};
    if (actividadTimer || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    cargarActividad().then(function (d) {
      if (!d || !d.recientes) return;
      var lista = d.recientes.filter(function (x) { return x.min >= (o.saltarMin || 0); });
      if (!lista.length) return;
      var i = 0;
      var mostrar = function () {
        if (actividadMostrados >= (o.max || 4) || document.documentElement.classList.contains('pago-abierto')) { clearInterval(actividadTimer); return; }
        var x = lista[i++ % lista.length]; actividadMostrados++;
        var t = document.createElement('div');
        t.className = 'ps-toast'; t.setAttribute('role', 'status');
        t.innerHTML = '<span class="ps-cara">' + (window.PERROS ? window.PERROS.cara(x.razaId) : '') + '</span><span><b>Alguien' + (x.zona ? ' en ' + x.zona.replace(/^Comunidad (de |Foral de )?/, '') : '') + '</b> ha hecho el test para ' + x.quien +
          (x.problema ? ' · ' + x.problema : '') + '<small>' + hace(x.min) + '</small></span><button aria-label="Cerrar">×</button>';
        document.body.appendChild(t);
        t.querySelector('button').onclick = function () { t.remove(); clearInterval(actividadTimer); };
        requestAnimationFrame(function () { t.classList.add('visible'); });
        setTimeout(function () { t.classList.remove('visible'); setTimeout(function () { t.remove(); }, 400); }, 5500);
      };
      setTimeout(function () { mostrar(); actividadTimer = setInterval(mostrar, 20000); }, o.espera || 7000);
    });
  }

  // ---------- Herramientas gratis para usar ya: clicker (siempre) y diario (3 días de prueba) ----------
  var audioCtx = null;
  function sonidoClic() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var t = audioCtx.currentTime, osc = audioCtx.createOscillator(), g = audioCtx.createGain();
      osc.type = 'square'; osc.frequency.setValueAtTime(2400, t); osc.frequency.exponentialRampToValueAtTime(900, t + 0.03);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      osc.connect(g); g.connect(audioCtx.destination); osc.start(t); osc.stop(t + 0.06);
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(15);
  }
  var CLAVE_DIARIO = 'qbp_diario_prueba', DIAS_PRUEBA = 3;
  var leerDiario = function () { try { return JSON.parse(localStorage.getItem(CLAVE_DIARIO)) || []; } catch (e) { return []; } };
  function gratis(o, u) {
    var tabs = o.adulto ? '' : '<div class="gr-tabs" role="tablist"><button role="tab" aria-selected="true" data-gr="clicker">' + u.I('estrella') + 'Clicker</button><button role="tab" aria-selected="false" data-gr="diario">' + u.I('gota') + 'Diario de pis</button></div>';
    return '<section class="tarjeta pila gratis" id="gratis"><span class="eti-peq">Gratis · úsalo ya</span><h2 style="font-size:1.3rem">Empieza hoy con ' + u.esc(o.nombre) + '</h2>' + tabs +
      '<div data-panel="clicker" class="gr-panel"><p class="suave peq">Un «clic» marca el momento exacto en que hace algo bien, y después va el premio. Pruébalo: <b>clic y premio, 10 veces seguidas</b>, sin pedirle nada.</p>' +
        '<button class="clicker" id="gr-clicker" aria-label="Hacer clic">' + u.I('huella') + '<span>Clic</span></button><p class="gr-cont" id="gr-cont">0 de 10 clics</p></div>' +
      (o.adulto ? '' : '<div data-panel="diario" class="gr-panel" hidden><p class="suave peq">Toca cada vez que haga pis o caca. En unos días verás su patrón y podrás adelantarte. <b>Gratis ' + DIAS_PRUEBA + ' días</b>; con el plan, para siempre y compartido.</p><div id="gr-diario"></div></div>') +
      '</section>';
  }
  function activarGratis(o) {
    var caja = document.getElementById('gratis'); if (!caja) return;
    caja.querySelectorAll('[data-gr]').forEach(function (b) {
      b.onclick = function () {
        caja.querySelectorAll('[data-gr]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        caja.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== b.dataset.gr; });
        if (o.alUsar) o.alUsar(b.dataset.gr + '_abrir');
      };
    });
    var n = 0, bc = document.getElementById('gr-clicker'), cont = document.getElementById('gr-cont');
    bc.addEventListener('pointerdown', function (e) {
      e.preventDefault(); sonidoClic(); n++;
      bc.classList.add('pulsado'); setTimeout(function () { bc.classList.remove('pulsado'); }, 120);
      cont.innerHTML = n < 10 ? n + ' de 10 clics' : '<b>¡Clicker cargado!</b> Mañana: clic justo cuando ' + o.nombre + ' te mire, y premio. Está en el día 3 de su plan.';
      if (n === 1 && o.alUsar) o.alUsar('clicker');
    });
    var dz = document.getElementById('gr-diario');
    if (!dz) return;
    var pintar = function () {
      var regs = leerDiario(), hoy = new Date().toDateString();
      var inicio = regs.length ? regs[0].t : Date.now();
      var finPrueba = new Date(inicio).setHours(0, 0, 0, 0) + DIAS_PRUEBA * 864e5;
      if (Date.now() >= finPrueba) {
        dz.innerHTML = '<div class="bloqueado"><div class="bloq-contenido" aria-hidden="true"><div class="gr-diario-btns"><span>Pis fuera</span><span>Pis en casa</span><span>Caca fuera</span><span>Caca en casa</span></div></div>' +
          '<a class="bloq-cta" href="#paywall" data-bloq="diario">Tu prueba de ' + DIAS_PRUEBA + ' días ha terminado · sigue con el plan</a></div>';
        return;
      }
      var deHoy = regs.filter(function (r) { return new Date(r.t).toDateString() === hoy; });
      var fuera = deHoy.filter(function (r) { return r.l === 'fuera'; }).length;
      var quedan = Math.ceil((finPrueba - Date.now()) / 864e5);
      dz.innerHTML = '<div class="gr-diario-btns">' + [['pis', 'fuera', 'Pis fuera'], ['pis', 'casa', 'Pis en casa'], ['caca', 'fuera', 'Caca fuera'], ['caca', 'casa', 'Caca en casa']].map(function (b) {
        return '<button data-t="' + b[0] + '" data-l="' + b[1] + '" class="' + (b[1] === 'fuera' ? 'ok' : '') + '">' + b[2] + '</button>';
      }).join('') + '</div><p class="gr-cont"><b>' + fuera + ' de ' + deHoy.length + '</b> fuera hoy · te ' + (quedan === 1 ? 'queda 1 día' : 'quedan ' + quedan + ' días') + ' de prueba</p>';
      dz.querySelectorAll('[data-t]').forEach(function (b) {
        b.onclick = function () {
          var regs2 = leerDiario(); regs2.push({ t: Date.now(), p: b.dataset.t, l: b.dataset.l });
          try { localStorage.setItem(CLAVE_DIARIO, JSON.stringify(regs2.slice(-200))); } catch (e) {}
          if (o.alDiario) o.alDiario(regs2.slice(-200));
          if (navigator.vibrate) navigator.vibrate(20);
          if (o.alUsar) o.alUsar('diario');
          pintar();
        };
      });
    };
    pintar();
  }

  function restaurarDiario(regs) { if (Array.isArray(regs) && regs.length) { try { localStorage.setItem(CLAVE_DIARIO, JSON.stringify(regs)); } catch (e) {} } }

  root.VENTA = { restaurarDiario: restaurarDiario, gratis: gratis, activarGratis: activarGratis, contador: contador, notificaciones: notificaciones, miniPlan: miniPlan, activarMiniPlan: activarMiniPlan, panel: panel, consejos: consejos, activarBloqueos: activarBloqueos, pagoIntegrado: pagoIntegrado, aviso: aviso, incluye: incluye, comparativa: comparativa, preguntas: preguntas, barra: barra, quitarBarra: quitarBarra, activarPago: activarPago };
})(typeof window !== 'undefined' ? window : this);
