/*
 * Contenido de "Mi zona" (área del cliente): consejos, productos recomendados y seguros.
 *
 * CONSEJOS: BORRADOR PENDIENTE DE REVISIÓN por el educador (mismas reglas: positivo, sin salud ni dosis).
 * AFILIADOS: rellena "url" con tus enlaces de afiliado. Mientras esté vacío, el producto se muestra sin enlace.
 * SEGUROS: comparar y derivar a aseguradoras es distribución de seguros. Antes de poner un enlace de
 * afiliación aquí hace falta un acuerdo con un corredor o comparador autorizado (ver docs/MVP.md, riesgos).
 * Mientras SEGUROS.url esté vacío, el botón solo apunta el interés ("Avísame").
 */
(function (root) {
  'use strict';

  // {n} = nombre del perro
  var CONSEJOS = {
    general: [
      ['Premia en el momento', 'El premio tiene que llegar en los 2 segundos siguientes a lo que quieres que repita. Si llega tarde, {n} no sabe qué está premiando.'],
      ['Sesiones cortas', 'Mejor 3 sesiones de 5 minutos que una de 15. Termina siempre con algo que le salga bien.'],
      ['El olfato cansa', 'Diez minutos buscando premios escondidos cansan más que media hora de paseo rápido. Úsalo los días de lluvia.'],
      ['Toda la familia, mismas reglas', 'Si una persona deja subir al sofá y otra no, {n} no entiende la norma. Poneos de acuerdo en 3 reglas básicas.'],
      ['Un mal día no es un retroceso', 'Si hoy ha ido peor, vuelve un paso atrás y repite lo que ya le salía. Aprender no es en línea recta.'],
      ['Dormir también es entrenar', 'Un perro cansado o falto de sueño aprende peor y está más irritable. Respeta sus siestas.'],
      ['Nombre solo para cosas buenas', 'No uses su nombre para regañar. Que "{n}" siempre signifique "mírame, que algo bueno viene".'],
      ['Ignorar no es castigar', 'Si hace algo para llamar tu atención (saltar, ladrar), no le mires ni le hables. Cuando pare, atiéndele.'],
      ['Gestiona el entorno', 'Mientras aprende, evita que practique lo que no quieres: cierra puertas, quita cables, recoge zapatos.'],
      ['Observa su cuerpo', 'Bostezos, lamerse el hocico o girar la cabeza suelen ser señales de que algo le incomoda. Dale espacio.']
    ],
    pis: [['Adelántate', 'Saca a {n} antes de que lo pida: al despertar, después de comer y después de jugar.'], ['Limpieza sin rastro', 'Usa limpiador enzimático: si queda olor, volverá al mismo sitio.']],
    mordiscos: [['Mordedor siempre a mano', 'Ten uno en cada habitación para ofrecérselo en cuanto busque tus manos.'], ['Mordiscos de sueño', 'Si de repente muerde todo, probablemente necesita una siesta.']],
    noches: [['Rutina de noche', 'Misma hora, misma salida tranquila y misma cama cada noche: la previsibilidad calma.'], ['Sin juego a las 3', 'Si le sacas de noche, que sea aburrido: pis y a la cama.']],
    solo: [['Llaves sin salir', 'Coge las llaves y siéntate. Si las señales de salida dejan de anunciar que te vas, se agobia menos.'], ['Juguete solo para cuando te vas', 'Que tu salida anuncie algo bueno: un juguete rellenable que solo aparece entonces.']],
    correa: [['La regla del árbol', 'Correa tensa = te paras. Correa floja = avanzas. Constancia en cada paseo.'], ['Olfatear como premio', 'Tras un tramo bueno, "libre" y un minuto para oler. Es su mejor premio.']],
    ladridos: [['Gracias, ya lo veo', 'Cuando avise, agradécelo con calma y llámale: así no tiene que seguir avisando.'], ['Premia el silencio', 'Si algo que suele hacerle ladrar pasa y se queda callado, premio en el momento.']],
    adaptacion: [['Su refugio es sagrado', 'Cuando esté en su rincón, nadie le molesta. Es donde aprende a sentirse seguro.'], ['Que se acerque él', 'Deja que sea {n} quien busque el contacto. La confianza no se fuerza.']]
  };

  // Productos útiles por problema. url vacía = sin enlace (sin afiliación todavía).
  var PRODUCTOS = {
    base: [
      { id: 'premios', nombre: 'Premios pequeños y blandos', por: 'Para premiar muchas veces sin llenarle: del tamaño de un garbanzo.', url: '' },
      { id: 'rellenable', nombre: 'Juguete rellenable', por: 'Para las ausencias, las noches y gastar energía de forma tranquila.', url: '' }
    ],
    pis: [{ id: 'enzimatico', nombre: 'Limpiador enzimático', por: 'Elimina el olor del pis para que no repita en el mismo sitio.', url: '' }, { id: 'empapadores', nombre: 'Empapadores', por: 'Para su zona segura mientras aprende.', url: '' }],
    mordiscos: [{ id: 'mordedores', nombre: 'Mordedores de varias texturas', por: 'Para redirigir los mordiscos y aliviar las encías.', url: '' }],
    noches: [{ id: 'transportin', nombre: 'Cama o transportín junto a tu cama', por: 'Para que te oiga y te huela las primeras semanas.', url: '' }],
    solo: [{ id: 'parque', nombre: 'Parque o barrera', por: 'Para crear una zona segura mientras aprende a quedarse solo.', url: '' }],
    correa: [{ id: 'arnes', nombre: 'Arnés en Y con anilla en el pecho', por: 'Reduce los tirones sin hacerle daño.', url: '' }, { id: 'correa', nombre: 'Correa fija de 2 metros', por: 'Las extensibles enseñan a tirar.', url: '' }],
    ladridos: [{ id: 'vinilo', nombre: 'Vinilo translúcido para ventanas', por: 'Quita su "puesto de vigilancia" mientras aprende.', url: '' }],
    adaptacion: [{ id: 'arnes', nombre: 'Arnés bien ajustado', por: 'Los perros recién adoptados pueden escaparse por miedo.', url: '' }]
  };

  var SEGUROS = {
    url: '',               // enlace del comparador o corredor autorizado (afiliación)
    socio: '',             // nombre del colaborador que se mostrará, cuando lo haya
    titulo: 'Seguro de responsabilidad civil',
    texto: 'La Ley 7/2023 de bienestar animal prevé un seguro de responsabilidad civil para los perros. Su desarrollo reglamentario sigue pendiente, pero muchos dueños ya lo contratan porque cubre los daños que el perro cause a otros.',
    aviso: 'Información orientativa con fecha de revisión. No es asesoramiento de seguros.'
  };

  var api = { CONSEJOS: CONSEJOS, PRODUCTOS: PRODUCTOS, SEGUROS: SEGUROS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ZONA = api;
})(this);
