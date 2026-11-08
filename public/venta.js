/*
 * Piezas de venta que comparten /cachorro y /perro después del test:
 * aviso arriba con botón, bloque "todo lo que incluye", comparativa de precio, preguntas y barra fija.
 * Cada funnel le pasa sus utilidades: { I, burbuja, esc, euros }.
 */
(function (root) {
  'use strict';

  function aviso(o, u) {
    return '<a class="venta-aviso" href="#paywall">' +
      '<span class="venta-aviso-txt"><b>El plan completo de ' + u.esc(o.nombre) + ' está listo</b>' +
      '<span>' + u.esc(o.semanas) + ' semanas · una tarea al día · clicker y diario en tu móvil</span></span>' +
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
      '<div class="tu"><span>El plan completo de ' + u.esc(o.nombre) + ', ' + u.esc(o.semanas) + ' semanas</span><b>' + u.euros(o.precio) + '</b></div></div>';
  }

  function preguntas(o, u) {
    var faq = [
      ['¿Es una suscripción?', 'No. Es un pago único de ' + u.euros(o.precio) + '. No se renueva y no hay que darse de baja de nada.'],
      ['¿Cuánto tiempo al día?', 'Entre 5 y 15 minutos. Cada mañana te llega la tarea del día por email y la tienes en Mi zona.'],
      ['¿Y si no me sirve?', 'Tienes 14 días de garantía: nos escribes y te devolvemos el 100%, sin preguntas.'],
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
    el.innerHTML = '<div class="venta-barra-in"><span><b>' + u.euros(o.precio) + '</b><small>Pago único · garantía 14 días</small></span>' +
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

  root.VENTA = { aviso: aviso, incluye: incluye, comparativa: comparativa, preguntas: preguntas, barra: barra, quitarBarra: quitarBarra, activarPago: activarPago };
})(typeof window !== 'undefined' ? window : this);
