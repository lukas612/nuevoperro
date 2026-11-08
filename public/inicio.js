/* Portada: elegir el tipo de perro. Cachorro → /cachorro · adoptado y adulto → /perro */
(function () {
  'use strict';
  var D = window.PERROS, I = D.icono;
  var q = location.search ? location.search.slice(1) + '&' : '';
  function burbuja(ic, color) { return '<span class="burbuja b-' + color + '">' + I(ic) + '</span>'; }
  function opcion(href, cara, titulo, sub, fondo) {
    return '<a class="eleccion" href="' + href + '"><span class="eleccion-cara">' + D.cara(cara, { lengua: true }) + '</span>' +
      '<span class="eleccion-txt"><b>' + titulo + '</b><small>' + sub + '</small></span><span class="eleccion-flecha">' + I('flecha') + '</span></a>';
  }
  var marca = 'Qué Buen Perro';
  document.getElementById('barra').innerHTML = '<a class="marca" href="/" style="text-decoration:none;color:inherit">' + D.logo() + '<span id="marca">' + D.nombreMarca(marca) + '</span></a>';
  fetch('/api/config').then(function (r) { return r.json(); }).then(function (c) {
    document.getElementById('marca').innerHTML = D.nombreMarca(c.marca); document.getElementById('pie-contacto').textContent = c.emailContacto || '';
  }).catch(function () {});

  var problemas = [
    ['/perro?' + q + 'tipo=adulto&p=correa', 'correa', 'mint', 'Tira de la correa'],
    ['/perro?' + q + 'tipo=adulto&p=ladridos', 'chispa', 'butter', 'Ladra mucho'],
    ['/perro?' + q + 'tipo=adulto&p=solo', 'puerta', 'peach', 'Lo pasa mal solo'],
    ['/cachorro?' + q, 'gota', 'sky', 'Pis en casa (cachorro)'],
    ['/cachorro?' + q, 'diente', 'lilac', 'Muerde (cachorro)'],
    ['/perro?' + q + 'tipo=adoptado&p=adaptacion', 'casa', 'sky', 'Recién adoptado']
  ];

  document.getElementById('app').innerHTML =
    '<div class="pila-g entra">' +
    '<section class="pila">' +
      '<span class="eyebrow">' + I('huella') + 'Educación en positivo, sin castigos</span>' +
      '<h1>Un plan para tu perro, hecho para él</h1>' +
      '<p class="suave">Para su raza, su edad y tu casa. Responde unas preguntas y te damos gratis el primer paso.</p>' +
    '</section>' +
    '<section class="pila"><h2 style="font-size:1.25rem">¿Cómo es tu perro?</h2>' +
      '<div class="elecciones">' +
        opcion('/cachorro?' + q, 'chihuahua', 'Es un cachorro', 'Hasta 6 meses: pis, mordiscos, noches y rutina') +
        opcion('/perro?' + q + 'tipo=adoptado', 'mestizo', 'Lo acabo de adoptar', 'Sus primeras semanas en casa') +
        opcion('/perro?' + q + 'tipo=adulto', 'border-collie', 'Ya lleva tiempo conmigo', 'Correa, ladridos o quedarse solo') +
      '</div></section>' +
    '<section class="pila"><span class="etiqueta">O ve directo a su problema</span>' +
      '<div class="atajos">' + problemas.map(function (p) { return '<a class="atajo" href="' + p[0] + '">' + burbuja(p[1], p[2]) + '<span>' + p[3] + '</span></a>'; }).join('') + '</div></section>' +
    '<div class="ventajas">' +
      '<div class="ventaja">' + burbuja('corazon', 'peach') + 'Sin castigos ni tirones</div>' +
      '<div class="ventaja">' + burbuja('perro', 'sky') + '21 razas y mestizos</div>' +
      '<div class="ventaja">' + burbuja('escudo', 'mint') + 'Garantía de 14 días</div>' +
    '</div>' +
    '<section class="seccion"><span class="etiqueta">Cómo funciona</span><h2>Del problema al plan en 3 pasos</h2>' +
      '<ol class="pasos">' +
        '<li><div><b>Nos cuentas cómo es</b><span>Raza, edad, tu casa y qué le pasa.</span></div></li>' +
        '<li><div><b>Recibes el primer paso, gratis</b><span>Su rutina de mañana o sus 3 primeros días de plan.</span></div></li>' +
        '<li><div><b>Si quieres, el plan completo</b><span>Una tarea cada día y un email que te la recuerda.</span></div></li>' +
      '</ol></section>' +
    '<section class="seccion faq"><span class="etiqueta">Preguntas</span>' +
      '<details><summary>¿Sirve si mi perro ya es adulto?</summary><p>Sí. Hay planes para cachorros, para perros recién adoptados y para problemas de perros adultos como tirar de la correa, ladrar o quedarse solo.</p></details>' +
      '<details><summary>¿Y si mi perro muerde?</summary><p>Si un perro muerde o amenaza a personas, lo responsable es que lo vea un profesional en persona. Te diremos cómo buscar ayuda y no te venderemos un plan.</p></details>' +
      '<details><summary>¿Es una suscripción?</summary><p>No. El test es gratis y el plan es un pago único, con 14 días de garantía.</p></details>' +
    '</section></div>';
})();
