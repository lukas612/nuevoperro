/*
 * Contenido SEO adicional: categorías de guías, textos de razas y rutinas por edad.
 * BORRADOR PENDIENTE DE REVISIÓN por el educador (rasgos generales de raza: cada perro es distinto).
 */
'use strict';

const CATEGORIAS = {
  cachorros: { nombre: 'Cachorros', titulo: 'Guías para educar a un cachorro', descripcion: 'Pis en casa, mordiscos, noches, sueño y socialización: guías prácticas para las primeras semanas con tu cachorro.', icono: ['huella', 'sky'], cta: '/cachorro' },
  'perro-adulto': { nombre: 'Perro adulto', titulo: 'Guías para problemas de conducta en perros adultos', descripcion: 'Tirar de la correa, ladridos y quedarse solo: por qué pasa y cómo trabajarlo en positivo con tu perro adulto.', icono: ['correa', 'mint'], cta: '/perro?tipo=adulto' },
  'perro-adoptado': { nombre: 'Perro adoptado', titulo: 'Guías para perros recién adoptados', descripcion: 'Las primeras semanas con un perro adoptado: adaptación, confianza, rutina y paseos seguros.', icono: ['casa', 'peach'], cta: '/perro?tipo=adoptado' },
  'ley-y-papeleo': { nombre: 'Ley y papeleo', titulo: 'Ley y papeleo para dueños de perros en España', descripcion: 'Microchip, registro, seguro y curso: qué pide la ley a los dueños de perros en España, explicado con prudencia y fecha de revisión.', icono: ['ley', 'lilac'], cta: '/' },
  educacion: { nombre: 'Educación en positivo', titulo: 'Educación canina en positivo', descripcion: 'Los principios de la educación en positivo y cómo aplicarlos en casa con cualquier perro.', icono: ['corazon', 'butter'], cta: '/' }
};

// Introducciones propias por raza (el resto de la página sale de los rasgos de plantillas.js).
const RAZAS = {
  mestizo: 'Los mestizos son la mayoría de los perros en España, y cada uno es único: su carácter depende de su mezcla, de su historia y de lo que viva en casa. Por eso conviene observarle bien las primeras semanas y ajustar la educación a lo que veas.',
  caniche: 'El caniche es una de las razas más inteligentes y con más facilidad para aprender. Aprende rápido lo bueno y también lo que no quieres, así que la constancia desde el primer día marca la diferencia.',
  teckel: 'El teckel, o perro salchicha, es valiente, curioso y con una nariz excelente. Fue criado para cazar en madrigueras, así que el olfato y la independencia van de serie. Su espalda larga pide cuidar los saltos.',
  chihuahua: 'El chihuahua es pequeño pero con mucho carácter. Su tamaño hace que a menudo se le eduque menos que a un perro grande, y es un error: necesita las mismas normas, con cuidado de que no le pisen ni se caiga.',
  yorkshire: 'El yorkshire terrier es despierto, cariñoso y con alma de terrier: valiente y a veces ladrador. Su pelo largo necesita cuidado diario desde cachorro.',
  schnauzer: 'El schnauzer, en sus tamaños mini, mediano y gigante, es listo, vigilante y muy apegado a su familia. Suele avisar de todo, así que conviene enseñarle pronto qué hacer en lugar de ladrar.',
  bichon: 'El bichón maltés es un perro de compañía alegre y sociable. Se apega mucho a su familia, por eso es importante enseñarle desde cachorro a quedarse solo con calma.',
  pomerania: 'El pomerania es pequeño, vivo y muy expresivo. Es listo y aprende rápido, pero también puede volverse ladrador si se aburre.',
  'shih-tzu': 'El shih tzu es tranquilo, cariñoso y muy de casa. Tiene el hocico corto, así que el ejercicio debe ser moderado y con cuidado en los días de calor.',
  'bulldog-frances': 'El bulldog francés es simpático, cariñoso y muy de su gente. Es braquicéfalo (de hocico corto): nada de ejercicio intenso ni paseos con calor, y atención a cómo respira.',
  'jack-russell': 'El jack russell terrier es un torbellino de energía e inteligencia. Necesita mucha actividad física y mental: si no la tiene, la buscará por su cuenta.',
  beagle: 'El beagle es un sabueso alegre y sociable con una nariz poderosa. Su olfato manda en los paseos, por eso la llamada y la correa son sus asignaturas principales.',
  cocker: 'El cocker spaniel es cariñoso, alegre y con muchas ganas de agradar. Le encanta llevar cosas en la boca y jugar a traer, algo muy útil para educarle.',
  'border-collie': 'El border collie está considerado una de las razas más inteligentes. Necesita trabajo mental a diario: sin él, puede desarrollar manías como perseguir sombras o luces.',
  'perro-agua': 'El perro de agua español es trabajador, leal y muy listo. Tiene mucha energía y un pelo rizado que necesita cuidados desde pequeño.',
  podenco: 'El podenco es un cazador de vista y olfato, independiente y muy ágil. Es una raza muy presente en las protectoras españolas: con paciencia y en positivo, es un compañero estupendo.',
  setter: 'El setter inglés es noble, sociable y con mucha energía. Es una raza de caza muy registrada en España que necesita ejercicio y juegos de olfato a diario.',
  labrador: 'El labrador retriever es sociable, glotón y con ganas de agradar, lo que facilita mucho educarle con premios. De cachorro es muy activo y conviene cuidar sus articulaciones.',
  golden: 'El golden retriever es amable, paciente y muy familiar. Aprende con facilidad y disfruta trabajando contigo, aunque de joven puede ser muy saltarín.',
  'pastor-aleman': 'El pastor alemán es inteligente, leal y protector. Necesita una buena socialización desde cachorro y ejercicio mental para ser un perro equilibrado.',
  husky: 'El husky siberiano es independiente, sociable y muy activo. Lleva mal el calor y le cuesta la llamada, así que la correa y los paseos a horas frescas son clave.'
};

// Rutinas por edad (semanas) que se publican como páginas
const RUTINAS = [8, 10, 12, 14, 16, 20];

module.exports = { CATEGORIAS, RAZAS, RUTINAS };
