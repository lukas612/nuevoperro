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
        err.textContent = 'Marca la casilla de arriba para recibir el plan al momento.';
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
    var tiles = [
      [img(o.adulto ? 'plan-perro.jpg' : 'diario.jpg'), o.adulto ? 'Tu progreso' : 'Diario de pis y caca', o.adulto ? 'Lo que lleváis hecho, semana a semana' : 'Un toque y ves cómo mejora', 'diario'],
      [img('clicker.jpg'), 'Clicker en tu móvil', 'Marca justo lo que hace bien', 'clicker'],
      [ico(o.adulto ? 'escudo' : 'reloj', 'sky'), o.adulto ? 'Si hay una recaída' : 'Su rutina, hora a hora', o.adulto ? 'Qué hacer y cuándo pedir ayuda' : 'Ajustada cada semana a su edad', 'extra'],
      [ico('personas', 'lilac'), 'Hacedlo juntos', 'Comparte el plan con tu pareja', 'juntos']
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

  root.VENTA = { miniPlan: miniPlan, activarMiniPlan: activarMiniPlan, panel: panel, consejos: consejos, activarBloqueos: activarBloqueos, pagoIntegrado: pagoIntegrado, aviso: aviso, incluye: incluye, comparativa: comparativa, preguntas: preguntas, barra: barra, quitarBarra: quitarBarra, activarPago: activarPago };
})(typeof window !== 'undefined' ? window : this);
