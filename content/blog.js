/*
 * Blog para SEO: 12 artículos de educación canina en positivo.
 * BORRADOR PENDIENTE DE REVISIÓN por el educador (y el artículo legal, por los abogados).
 *
 * Formato del cuerpo (markdown sencillo): "## " subtítulo, "- " lista, "1. " lista numerada,
 * **negrita**, [texto](/enlace). Párrafos separados por una línea en blanco.
 * tema: enlaza con el test (cta) y con "Mi zona" (lecturas relacionadas).
 */
'use strict';

const CACHORRO = (a, texto) => ({ href: `/cachorro?a=${a}&utm_source=blog&utm_medium=seo`, texto });
const PERRO = (a, texto) => ({ href: `/perro?a=${a}&utm_source=blog&utm_medium=seo`, texto });

module.exports = [
  {
    slug: 'ensenar-cachorro-hacer-pis-en-la-calle',
    titulo: 'Cómo enseñar a un cachorro a hacer pis en la calle (sin regañar)',
    descripcion: 'Guía paso a paso para que tu cachorro haga pis fuera: los 5 momentos clave, cuánto aguanta según su edad y los errores que lo retrasan.',
    tema: 'pis', fecha: '2026-11-08', lectura: 6,
    cta: CACHORRO('pis', 'Haz el test y recibe la rutina de pis de tu cachorro'),
    faq: [
      ['¿Cuánto tarda un cachorro en aprender a hacer pis fuera?', 'Depende de la edad y de la constancia, pero lo habitual es ver una mejora clara en 2–4 semanas y tener pocos accidentes hacia los 5–6 meses.'],
      ['¿Hay que regañar al cachorro si hace pis en casa?', 'No. Regañar después no le enseña nada y puede hacer que se esconda para hacer pis. Funciona mucho mejor adelantarse y premiar el pis en el sitio bueno.']
    ],
    cuerpo: `Un cachorro no "se porta mal" cuando hace pis en el salón: simplemente todavía no controla bien la vejiga ni sabe dónde esperas que lo haga. La buena noticia es que se aprende rápido si te adelantas a él.

## Cuánto aguanta un cachorro

Como referencia orientativa, un cachorro de 8–10 semanas aguanta durante el día alrededor de 1,5–2 horas entre pis. Hacia las 16 semanas, unas 3 horas. Por la noche aguantan algo más porque duermen. Si tu cachorro pasa más tiempo solo, necesitará un empapador en su zona o alguien que le saque.

## Los 5 momentos clave

Casi todos los pis se concentran en cinco momentos. Si le sacas en todos ellos, evitarás la mayoría de los accidentes:

1. Nada más despertarse (también de las siestas).
2. Entre 10 y 15 minutos después de comer.
3. Después de jugar.
4. Después de una emoción: visitas, llegar a casa, un susto.
5. Antes de dormir.

## Paso a paso

1. **Elige un único sitio** y llévale siempre ahí. Si aún no puede pisar la calle por las vacunas, pregunta a tu veterinario y usa un empapador fijo.
2. **Quédate con él** hasta que termine. No hables ni juegues: es un rato aburrido.
3. **Premia en el momento**: un premio y una palabra fija ("muy bien, pis") en los 2 segundos siguientes. Si premias al volver a casa, llega tarde.
4. **Vigila o restringe**: cuando no puedas mirarle, que esté en una zona segura pequeña.
5. **Apunta los pis** durante una semana. Verás su patrón y podrás adelantarte.

## Si hace pis en casa

Si le pillas en el momento, cógele con calma y llévale al sitio bueno. Si ya está hecho, no digas nada: limpia con un **limpiador enzimático**. La lejía y el amoniaco dejan olor y le invitan a repetir.

## Errores habituales

- Restregarle el hocico o castigarle: le enseña a esconderse para hacer pis.
- Quitarle el agua para que haga menos pis: necesita agua siempre.
- Dejarle suelto por toda la casa demasiado pronto.
- Cambiar el sitio de pis cada pocos días.

Si quieres los horarios exactos para tu cachorro según su edad, su tamaño y tu casa, el test gratis te da su rutina de mañana con las salidas ya calculadas.`
  },
  {
    slug: 'perro-tira-de-la-correa',
    titulo: 'Mi perro tira de la correa: por qué lo hace y cómo evitarlo',
    descripcion: 'Por qué tu perro tira de la correa y cómo enseñarle a caminar con la correa floja con la regla del árbol, sin tirones ni collares de castigo.',
    tema: 'correa', fecha: '2026-11-08', lectura: 6,
    cta: PERRO('correa', 'Haz el test y recibe sus 3 primeros días para pasear sin tirones'),
    faq: [
      ['¿Sirven los collares de castigo para que no tire?', 'Pueden frenar el tirón en el momento, pero causan dolor, miedo y a menudo empeoran la reactividad. Un arnés con anilla en el pecho y enseñarle a caminar con la correa floja funciona sin esos riesgos.'],
      ['¿Cuánto se tarda en que un perro deje de tirar?', 'Con práctica diaria se suelen ver cambios en 2–3 semanas. Que el hábito se mantenga en cualquier situación lleva más, sobre todo con distracciones.']
    ],
    cuerpo: `Si cada paseo es una lucha, no estás solo: tirar de la correa es una de las quejas más comunes de los dueños de perros. Y casi nunca es un problema de "dominancia".

## Por qué tira

Tu perro tira porque le funciona. Cada vez que tensa la correa y avanza, aprende que tirar es el camino para llegar antes a ese olor, a ese perro o al parque. Además, camina más rápido que nosotros y la calle está llena de estímulos.

## El material importa

- **Arnés en Y con anilla delante, en el pecho**: cuando tira, le gira suavemente hacia ti.
- **Correa fija de unos 2 metros**: las extensibles enseñan justo lo contrario, que tirar alarga la correa.
- **Premios pequeños** en una bolsa fácil de abrir.

## La regla del árbol

Es la base de todo: **correa tensa = te paras. Correa floja = avanzas.** En cuanto la correa se tense, te quedas quieto como un árbol, sin hablar ni tirar. En el momento en que afloje, aunque sea un poco, dices "bien" y sigues.

Al principio los paseos serán lentos. Es normal: estás cambiando un hábito de años. La clave es ser constante; si a veces tirar funciona, seguirá tirando.

## Enséñale "su sitio"

1. En casa, sin correa, premia cada vez que esté junto a tu pierna.
2. En la calle, premia a la altura de tu pierna cuando camine a tu lado con la correa floja.
3. Cuando se adelante, cambia de dirección con alegría y premia cuando te alcance.
4. Usa el olfato como premio: tras un tramo bueno, "libre" y un minuto para oler.

## Si se lanza a otros perros o personas

Si tira sobre todo al ver perros, gente o gatos, el trabajo es de **distancia**. Busca la distancia a la que todavía puede mirarte y coger un premio, y practica ahí: premia cada vez que mire al otro perro y vuelva a mirarte. Poco a poco podrás acercarte.

## Lo que conviene evitar

- Tirones de correa y collares de púas, de ahorque o eléctricos.
- Paseos largos y tensos: mejor cortos y buenos.
- Regañarle mientras tira: no le dice qué hacer en su lugar.

El test gratis te da los 3 primeros días de un plan de 6 semanas adaptado a cuándo tira tu perro, a su raza y a su edad.`
  },
  {
    slug: 'cachorro-muerde-que-hacer',
    titulo: 'Mi cachorro muerde: qué hacer (y qué no) con los mordiscos',
    descripcion: 'Los mordiscos del cachorro son normales: cómo redirigirlos a un mordedor, por qué muerde más cuando tiene sueño y los errores que lo empeoran.',
    tema: 'mordiscos', fecha: '2026-11-08', lectura: 5,
    cta: CACHORRO('mordiscos', 'Haz el test y recibe el plan de tu cachorro'),
    faq: [
      ['¿A qué edad dejan de morder los cachorros?', 'Los mordiscos de juego suelen bajar mucho hacia los 5–6 meses, cuando termina el cambio de dientes, sobre todo si se ha redirigido bien.'],
      ['¿Es bueno gritar "ay" cuando muerde?', 'A algunos cachorros les frena, pero a otros les excita más. Suele funcionar mejor quedarse quieto, retirar la mano y ofrecer un mordedor.']
    ],
    cuerpo: `Manos, zapatillas, cables, la pata de la mesa… Los mordiscos de cachorro desesperan, pero son normales: está cambiando los dientes y explora el mundo con la boca. El objetivo no es que deje de morder, sino que aprenda **qué** puede morder.

## Por qué muerde tanto

- **Cambio de dientes**: entre los 3 y los 6 meses le molestan las encías.
- **Juego**: entre cachorros, morder es la forma de jugar.
- **Sueño**: muchos "ataques" de mordiscos son de un cachorro sobrecansado. Si de repente muerde todo, probablemente necesita una siesta.

## Qué hacer

1. **Ten siempre un mordedor a mano**, uno en cada habitación.
2. Si muerde tu mano: **quieto, retira la mano y ofrécele el mordedor**. Cuando lo muerda, felicítale.
3. Si insiste, **termina el juego** 20–30 segundos: te levantas y te vas. Vuelve con calma.
4. Juega siempre con un juguete entre tu mano y su boca, nunca con las manos desnudas.
5. **Protege la casa**: canaletas para cables, protectores para las patas de los muebles y nada a su alcance que no pueda morder.
6. Ofrécele **un mordedor frío**, como un juguete de goma del congelador: alivia las encías.

## Qué no hacer

- Darle golpecitos en el hocico o cerrarle la boca.
- Usar sprays o collares que asustan.
- Jugar a pelearse con las manos.
- Regañarle después: no entiende el motivo.

## Niños en casa

Con niños, los mordiscos de juego son más frecuentes porque se mueven rápido y chillan. Que el juego sea siempre con juguetes y supervisado, y que el cachorro tenga un sitio donde nadie le moleste cuando descansa.

Si quieres un plan con la rutina de tu cachorro y un protocolo de mordiscos día a día, empieza por el test gratis.`
  },
  {
    slug: 'cachorro-llora-por-la-noche',
    titulo: 'Mi cachorro llora por la noche: guía para las primeras noches',
    descripcion: 'Por qué llora tu cachorro por la noche y cómo conseguir que dormáis los dos: dónde poner su cama, la salida nocturna y qué hacer si llora.',
    tema: 'noches', fecha: '2026-11-08', lectura: 5,
    cta: CACHORRO('noches', 'Haz el test y recibe la rutina de sueño de tu cachorro'),
    faq: [
      ['¿Hay que dejar llorar al cachorro para que se acostumbre?', 'Las primeras semanas no es lo recomendable: acaba de separarse de su madre y hermanos. Funciona mejor que duerma cerca de ti y alejar la cama poco a poco.'],
      ['¿Cuándo deja un cachorro de necesitar salir por la noche?', 'Muchos dejan de necesitar la salida nocturna hacia las 14–16 semanas, aunque depende del tamaño y de cada perro.']
    ],
    cuerpo: `Las primeras noches con un cachorro pueden ser agotadoras. Si llora, no es que esté "mal acostumbrado": acaba de dejar a su madre y a sus hermanos, está en un sitio nuevo y no sabe dormir solo.

## Dónde debe dormir

Las primeras semanas, **cerca de tu cama**: en su cama o en un transportín junto a la tuya. Que te oiga y te huela le da seguridad. Cuando duerma tranquilo, puedes alejar la cama unos centímetros cada pocas noches hasta donde quieras que duerma de mayor.

## La rutina antes de dormir

1. Cena al menos 2 horas antes de acostaros.
2. Un rato de juego por la tarde, pero calma en la última hora.
3. Última salida a hacer pis justo antes de dormir, con calma y sin juego.
4. A la cama, con una prenda que huela a ti.

## Si llora de noche

- **Primero, descarta el pis**: sácale sin encender luces fuertes, sin hablar y sin jugar. Pis y de vuelta a la cama.
- Si ya ha hecho pis y llora, una mano cerca o una voz tranquila suelen bastar.
- Evita sacarle a jugar a las tres de la mañana: aprendería que llorar trae fiesta.

## Cuántas horas duerme un cachorro

Un cachorro de 8–10 semanas duerme unas 18–20 horas al día, sumando las siestas. Si de día no descansa lo suficiente, por la noche estará más nervioso. Respeta sus siestas en su sitio.

## Lo que ayuda

- Una bolsa de agua tibia envuelta en una toalla.
- Siestas de día en la misma cama.
- Horarios fijos para comer, salir y dormir.

El test gratis te da la rutina de mañana de tu cachorro, con la hora de la última salida y de la salida nocturna según su edad.`
  },
  {
    slug: 'ansiedad-por-separacion-perros',
    titulo: 'Ansiedad por separación en perros: señales y qué hacer',
    descripcion: 'Cómo saber si tu perro lo pasa mal cuando se queda solo y cómo enseñarle poco a poco a quedarse en casa con calma, con ausencias graduales.',
    tema: 'solo', fecha: '2026-11-08', lectura: 7,
    cta: PERRO('soledad', 'Haz el test y recibe sus 3 primeros días para quedarse solo con calma'),
    faq: [
      ['¿Lo hace por venganza?', 'No. Los destrozos, ladridos o pis cuando se queda solo son señales de que lo pasa mal, no de venganza. Por eso castigarle al volver no funciona.'],
      ['¿Cuándo hay que ir al veterinario?', 'Si se hace daño, no come mientras está solo, el problema es muy intenso o aparece de golpe, consulta con tu veterinario y con un profesional de conducta.']
    ],
    cuerpo: `Para muchos perros quedarse solos es difícil. No saben qué va a pasar ni cuándo vas a volver. Cuando lo pasan mal, lo notan los vecinos, los cojines o la puerta.

## Señales habituales

- Llora, aúlla o ladra al poco de irte.
- Destroza cerca de puertas y ventanas.
- Hace pis o caca aunque sepa hacerlo fuera.
- Te sigue por toda la casa y se agobia cuando coges las llaves.

**Grábale.** Deja el móvil grabando y sal unos minutos. Saber cuándo empieza a agobiarse es tu punto de partida.

## Cómo se trabaja

El principio es sencillo: **ausencias tan cortas que no llegue a agobiarse**, y subir poco a poco.

1. Mide su límite con una grabación.
2. Practica ausencias más cortas que ese límite: 30 segundos, 1 minuto, 2 minutos…
3. Sube solo cuando la anterior haya ido bien. Si se agobia, vuelve atrás.
4. **Separa las señales de salida**: coge las llaves o el abrigo sin irte, varias veces al día.
5. Dale un **juguete rellenable solo cuando te vas**, para que tu salida anuncie algo bueno.
6. Salidas y llegadas aburridas: sin despedidas largas ni fiestas al volver.

## Mientras aprende

Evita dejarle solo más tiempo del que aguanta. Si no hay más remedio, busca ayuda: un familiar, un paseador o una guardería. Cada vez que lo pasa mal, se refuerza el miedo.

## Antes de irte

Un paseo con olfato, un rato de juego tranquilo y unos minutos de calma. Un perro cansado y relajado lleva mejor la ausencia.

## Lo que conviene evitar

- Castigarle al volver por lo que ha roto.
- Irte a escondidas.
- Pasar de golpe a una jornada completa.
- Encerrarle en un transportín si no está acostumbrado.

## Cuándo pedir ayuda

Si es muy intenso, si se hace daño o si no mejora en unas semanas, habla con tu veterinario y con un educador o etólogo. A veces hay causas de salud o hace falta un plan en persona.

El test gratis te da los 3 primeros días de un plan de 6 semanas adaptado a lo que hace tu perro cuando se queda solo.`
  },
  {
    slug: 'por-que-mi-perro-ladra-tanto',
    titulo: 'Por qué mi perro ladra tanto y cómo conseguir que ladre menos',
    descripcion: 'Los motivos más comunes de los ladridos (timbre, ventana, pedir atención) y qué enseñarle a tu perro en su lugar, sin gritos ni collares antiladridos.',
    tema: 'ladridos', fecha: '2026-11-08', lectura: 6,
    cta: PERRO('ladridos', 'Haz el test y recibe sus 3 primeros días para ladrar menos'),
    faq: [
      ['¿Funcionan los collares antiladridos?', 'Pueden cortar el ladrido, pero no cambian el motivo y pueden generar miedo o estrés. Es mejor entender por qué ladra y enseñarle una alternativa.'],
      ['¿Hay que gritarle para que se calle?', 'No suele funcionar: para el perro es como si tú también ladraras. Llamarle con calma y premiar que venga funciona mejor.']
    ],
    cuerpo: `Ladrar es la forma que tiene tu perro de avisar, de pedir o de soltar nervios. El problema es que casi siempre le funciona: el repartidor se va, alguien le hace caso o la persona de la ventana desaparece.

## Los tres motivos más comunes

- **Avisar**: el timbre, los ruidos del rellano, alguien que pasa.
- **Vigilar**: desde la ventana o el balcón, a gente o a otros perros.
- **Pedir**: comida, juego o atención.

## Primero, apunta cuándo ladra

Durante un día, anota cada ladrido: hora, motivo y duración. Ese "diario de ladridos" te dirá qué trabajar primero.

## Quítale ocasiones mientras aprende

- Si ladra a la ventana, cierra la persiana a medias o pon vinilo translúcido en la parte baja.
- Si ladra a los ruidos, una radio baja de fondo ayuda.
- Evita que pase horas en el balcón vigilando la calle.

## Enséñale qué hacer en su lugar

1. Enséñale **"a tu sitio"**: premio cada vez que va a su cama.
2. Practica con el sonido del timbre muy bajito y premia en su cama antes de que ladre.
3. Cuando avise de algo, di "gracias, ya lo veo" con calma, llámale y premia que venga.
4. **Premia el silencio**: si pasa algo que suele hacerle ladrar y se queda callado, premio en el momento.

## Ladridos para pedir

Si te ladra para que le hagas caso, no respondas al ladrido (tampoco para regañar). Cuando calle unos segundos, atiéndele. Lo importante es que toda la familia haga lo mismo.

## Un perro aburrido ladra más

Paseos con olfato, juegos de buscar premios y un rato de juego de cabeza cada día reducen mucho los ladridos.

El test gratis te da los primeros 3 días de un plan de 6 semanas según cuándo ladra tu perro.`
  },
  {
    slug: 'cuantas-horas-duerme-un-cachorro',
    titulo: '¿Cuántas horas duerme un cachorro? Tabla por edades',
    descripcion: 'Cuánto duerme un cachorro según su edad, por qué el sueño es clave para su educación y cómo organizar sus siestas en el día a día.',
    tema: 'rutina', fecha: '2026-11-08', lectura: 4,
    cta: CACHORRO('rutina', 'Haz el test y recibe el horario de tu cachorro'),
    faq: [
      ['¿Es normal que mi cachorro duerma tanto?', 'Sí. Los cachorros duermen la mayor parte del día: es cuando crecen y fijan lo que aprenden.'],
      ['¿Debo despertarle para jugar?', 'Mejor no. Deja que complete sus siestas y aprovecha los ratos en que está despierto y activo.']
    ],
    cuerpo: `Si tu cachorro se pasa el día durmiendo, es normal. Los cachorros necesitan muchísimo sueño: es cuando crecen y cuando fijan lo que aprenden.

## Horas de sueño orientativas

- **8–11 semanas**: unas 18–20 horas al día.
- **12–15 semanas**: unas 17–19 horas.
- **16–19 semanas**: unas 16–18 horas.
- **20–26 semanas**: unas 15–17 horas.

Son referencias, no reglas: cada perro es distinto y las razas grandes suelen dormir algo más.

## Por qué importa tanto

Un cachorro que no descansa lo suficiente está más nervioso, muerde más y aprende peor. Muchos "ataques de locura" de la tarde son, en realidad, falta de sueño.

## Cómo organizar sus siestas

1. Después de comer y hacer pis, **juego tranquilo y siesta**.
2. Dale un sitio fijo para dormir, lejos del paso.
3. Evita que los niños o las visitas le despierten.
4. Tras cada siesta, **sácale a hacer pis**.

## Señales de que necesita dormir

- Muerde más de lo habitual.
- Corre sin parar o ladra sin motivo.
- Le cuesta concentrarse en lo que le pides.

Cuando pase, llévale a su zona de descanso con un mordedor. En pocos minutos estará dormido.

El test gratis calcula el horario de siestas, comidas y salidas de tu cachorro según su edad y su tamaño.`
  },
  {
    slug: 'socializacion-cachorro-checklist',
    titulo: 'Socialización del cachorro: checklist semana a semana',
    descripcion: 'Qué experiencias necesita tu cachorro en sus primeras semanas en casa: ruidos, personas, lugares y otros perros, con una checklist por semanas.',
    tema: 'rutina', fecha: '2026-11-08', lectura: 6,
    cta: CACHORRO('rutina', 'Haz el test y recibe el plan de socialización de tu cachorro'),
    faq: [
      ['¿Puedo socializar a mi cachorro antes de terminar las vacunas?', 'Sí se pueden hacer muchas cosas en casa y en brazos. Pregunta a tu veterinario qué es seguro según su pauta de vacunas antes de pisar la calle o juntarse con otros perros.'],
      ['¿Qué hago si se asusta?', 'Aumenta la distancia o baja la intensidad, deja que observe y premia la calma. Nunca le fuerces a acercarse.']
    ],
    cuerpo: `Las primeras semanas en casa son una ventana de oro: lo que tu cachorro conozca ahora con calma le parecerá normal de adulto. Socializar no es que vea muchas cosas, sino que las vea **bien**: poco rato, a su ritmo y con premios.

## Antes de empezar

Pregunta a tu veterinario qué puede hacer según su pauta de vacunas. Muchas experiencias se pueden hacer en casa o en brazos desde el primer día.

## Checklist por semanas

**Semana 1 · Casa y familia**
- Conocer a todos los de casa con calma.
- Ruidos de casa: aspiradora lejos, lavadora, timbre.
- Que le toquen patas, orejas y boca, con premio.

**Semana 2 · Sonidos**
- Ruidos de la calle desde casa o en brazos.
- Grabaciones de tráfico, truenos y petardos a volumen bajo mientras come.

**Semana 3 · Personas**
- Tres personas nuevas que le den un premio.
- Niños tranquilos, siempre supervisados.

**Semana 4 · Lugares**
- Un trayecto corto en coche.
- Un portal o una calle tranquila.

**Semana 5 · Otros perros**
- Un perro adulto vacunado y equilibrado que conozcas.
- Ver perros a distancia sin saludar.

**Semanas 6–8 · Manejo y ciudad**
- Cepillado, uñas y dientes con premios.
- Calles con más tráfico, a distancia.

## Las reglas de oro

- **Poco rato** y termina antes de que se canse.
- **Distancia**: si se asusta, aléjate y premia la calma.
- **Nunca forzar** a que se acerque.

El plan de 8 semanas incluye esta checklist adaptada a la edad de tu cachorro, con casillas para ir marcando.`
  },
  {
    slug: 'perro-adoptado-regla-3-3-3',
    titulo: 'Perro adoptado: la regla 3-3-3 para sus primeras semanas',
    descripcion: 'Qué esperar los primeros 3 días, 3 semanas y 3 meses con un perro adoptado, y cómo ayudarle a adaptarse a su nueva casa sin agobiarle.',
    tema: 'adaptacion', fecha: '2026-11-08', lectura: 6,
    cta: PERRO('adopcion', 'Haz el test y recibe sus 3 primeros días en casa'),
    faq: [
      ['¿Es normal que un perro adoptado no coma los primeros días?', 'Es frecuente que coma poco al principio por el estrés. Si dura más de un par de días o ves otros síntomas, consulta con tu veterinario.'],
      ['¿Cuándo puedo soltarle en el parque?', 'No en las primeras semanas: todavía no sabe volver contigo. Primero trabaja la llamada con una correa larga.']
    ],
    cuerpo: `Adoptar es un regalo para los dos, pero para tu perro supone cambiarlo todo de golpe: casa, personas, olores y rutinas. Es normal que al principio esté asustado, no coma bien o haga pis dentro.

## La regla 3-3-3

Es una guía orientativa, no un reloj exacto:

- **3 días** para descomprimir: puede estar asustado, esconderse o no comer.
- **3 semanas** para aprender la rutina y empezar a mostrar cómo es.
- **3 meses** para sentirse de verdad en casa.

## Los primeros días

1. **Prepárale un refugio**: un rincón tranquilo con cama y agua, lejos del paso. Nadie le molesta cuando está ahí.
2. **Rutina fija**: comidas, salidas y descanso a las mismas horas.
3. **Que se acerque él**: siéntate en el suelo con premios y deja que venga a su ritmo.
4. **Pocas visitas** y pocos planes nuevos.

## Paseos seguros

Arnés bien ajustado, correa siempre y recorridos cortos y tranquilos. Un perro asustado puede escaparse, y todavía no conoce la zona ni sabe volver.

## Si hace pis en casa

Aunque sea adulto, trátalo como a un cachorro: salidas frecuentes, premio fuera y nada de regañinas.

## Visita al veterinario

Pide cita en las primeras semanas para una revisión, aunque venga con papeles. Además, comprueba que el microchip está a tu nombre.

## Lo que conviene evitar

- Soltarle en la calle las primeras semanas.
- Bañarle o forzar el contacto nada más llegar.
- Regañarle por el miedo o por los accidentes.

El test gratis te da los 3 primeros días de un plan de adaptación de 6 semanas, ajustado a lo que más le cuesta a tu perro.`
  },
  {
    slug: 'ley-bienestar-animal-perros-obligaciones',
    titulo: 'Ley de bienestar animal: qué tiene que hacer el dueño de un perro',
    descripcion: 'Resumen prudente de las obligaciones principales para dueños de perros en España: microchip, registro, seguro y curso, y qué sigue pendiente.',
    tema: 'legal', fecha: '2026-11-08', lectura: 5,
    cta: { href: '/?utm_source=blog&utm_medium=seo', texto: 'Haz el test y revisa el checklist legal de tu perro' },
    faq: [
      ['¿Es obligatorio el seguro de responsabilidad civil para perros?', 'La Ley 7/2023 lo prevé, pero su desarrollo reglamentario está pendiente. Infórmate en tu ayuntamiento o comunidad sobre su situación actual.'],
      ['¿El curso para dueños de perros es de pago?', 'El curso oficial previsto será gratuito y telemático, según la información pública. Desconfía de quien venda un curso como si fuera el oficial.']
    ],
    cuerpo: `**Revisado el 8 de noviembre de 2026.** Esta es información general y prudente, no asesoramiento legal. Partes de la Ley 7/2023 de bienestar animal dependen de reglamentos que siguen pendientes, y cada comunidad autónoma y ayuntamiento tiene además sus normas. Confirma siempre los detalles con tu veterinario o tu ayuntamiento.

## Lo que ya es obligatorio en todas partes

- **Microchip**: puesto por un veterinario e inscrito a tu nombre.
- **Registro**: inscripción en el registro de animales de tu comunidad o ayuntamiento. Normalmente lo tramita el veterinario al poner el chip, pero conviene comprobarlo.

## Lo que depende de tu comunidad

- **Vacuna antirrábica**: obligatoria en la mayoría de comunidades autónomas. Tu veterinario te dirá cuándo toca.
- **Razas consideradas potencialmente peligrosas**: licencia y seguro específicos según la normativa aplicable.

## Lo que prevé la ley y sigue pendiente de desarrollo

- **Seguro de responsabilidad civil** para perros: la ley lo prevé, pero su desarrollo reglamentario está pendiente. Muchos dueños ya lo contratan porque cubre los daños que el perro pueda causar a otros.
- **Curso de tenencia responsable**: la ley lo prevé y el curso oficial será gratuito y telemático. Ningún curso privado lo sustituye.

## Buenas prácticas que la ley pide

- No dejar al perro solo más tiempo del adecuado para su bienestar.
- Proporcionarle atención veterinaria y un entorno adecuado.
- Educarle sin métodos que le causen daño o sufrimiento.

## Cómo saber si tu perro está en regla

El test gratis incluye un checklist legal con lo que ya tienes hecho y lo que te falta, con fecha de revisión visible.`
  },
  {
    slug: 'cuanto-tiempo-puede-estar-un-perro-solo',
    titulo: '¿Cuánto tiempo puede estar un perro solo en casa?',
    descripcion: 'Cuántas horas puede quedarse solo un perro según su edad, qué necesita cuando te vas y cómo organizarte si trabajas fuera de casa.',
    tema: 'solo', fecha: '2026-11-08', lectura: 5,
    cta: PERRO('soledad', 'Haz el test y recibe el plan para que se quede solo con calma'),
    faq: [
      ['¿Puede un cachorro quedarse solo 8 horas?', 'No es recomendable: no aguanta tanto sin hacer pis y lo pasa mal. Organiza que alguien pase a mitad de jornada mientras es pequeño.'],
      ['¿Ayuda dejarle la tele o la radio?', 'A algunos perros un ruido de fondo suave les ayuda a no reaccionar a los ruidos de fuera. No sustituye al trabajo de enseñarle a quedarse solo.']
    ],
    cuerpo: `No hay una cifra única: depende de la edad, de lo acostumbrado que esté y de cómo lo lleve tu perro. Pero sí hay referencias útiles para organizarte.

## Referencias orientativas

- **Cachorros**: poco tiempo. Durante el día aguantan sin hacer pis entre 1,5 y 4 horas según la edad. Si pasan más tiempo solos, necesitan un empapador en su zona o que alguien pase a sacarles.
- **Perros adultos** acostumbrados y tranquilos: muchos llevan bien unas horas, sobre todo si antes han paseado y tienen algo que hacer.
- **Perros mayores o con problemas de salud**: pueden necesitar salir más a menudo. Pregunta a tu veterinario.

## Lo que necesita cuando te vas

1. Un **paseo con olfato** antes de irte.
2. Una **zona segura**: cama, agua y nada peligroso que pueda morder.
3. Un **juguete rellenable** que solo tenga cuando te vas.
4. Salidas y llegadas tranquilas.

## Si trabajas fuera muchas horas

- Un paseador o un vecino que pase a mitad de jornada.
- Una guardería de día algunos días a la semana.
- Volver a comer a casa, si te es posible.

## Señales de que lo está pasando mal

Llantos o ladridos al poco de irte, destrozos en puertas o pis aunque sepa hacerlo fuera. En ese caso no basta con organizar horarios: hay que enseñarle a quedarse solo poco a poco.

Lee también nuestra guía sobre [ansiedad por separación](/blog/ansiedad-por-separacion-perros) o haz el test gratis para recibir un plan adaptado a tu perro.`
  },
  {
    slug: 'educacion-canina-en-positivo',
    titulo: 'Educación canina en positivo: qué es y por qué funciona',
    descripcion: 'Qué es la educación en positivo, por qué funciona mejor que los castigos y cómo aplicarla en casa con premios, momento justo y constancia.',
    tema: 'rutina', fecha: '2026-11-08', lectura: 5,
    cta: { href: '/?utm_source=blog&utm_medium=seo', texto: 'Haz el test gratis y recibe el primer paso del plan de tu perro' },
    faq: [
      ['¿Educar en positivo es dejarle hacer lo que quiera?', 'No. Es enseñarle lo que sí quieres que haga y premiarlo, poniendo límites claros y gestionando el entorno, sin causarle dolor ni miedo.'],
      ['¿Siempre hay que darle comida?', 'Al principio la comida es el premio más fácil. Con el tiempo se combina con juego, caricias, olfatear o la propia libertad.']
    ],
    cuerpo: `Educar en positivo significa enseñar a tu perro lo que quieres que haga y hacer que le compense hacerlo. No es "dejarle hacer lo que quiera": hay normas, pero se enseñan sin dolor ni miedo.

## Por qué funciona

Los perros repiten lo que les sale a cuenta. Si sentarse trae un premio, se sentará más. Los castigos pueden cortar una conducta en el momento, pero no le dicen qué hacer en su lugar y pueden generar miedo, estrés y problemas nuevos.

## Los tres pilares

1. **Premiar en el momento justo**: en los 2 segundos siguientes a la conducta.
2. **Gestionar el entorno**: evita que practique lo que no quieres mientras aprende (cerrar puertas, recoger zapatos, usar una correa).
3. **Constancia**: todos en casa, las mismas reglas.

## Qué es un buen premio

- Comida pequeña y blanda, del tamaño de un garbanzo.
- Juego, una pelota o un rato de tira y afloja.
- Olfatear, saludar a un amigo o seguir el paseo.

El mejor premio es el que **tu** perro valora en ese momento.

## Cómo poner límites sin castigar

- **Ignorar** lo que hace para llamar la atención y premiar la calma.
- **Redirigir**: si muerde la mano, ofrecer un mordedor.
- **Pausas**: si el juego se descontrola, terminarlo unos segundos.

## Errores frecuentes

- Premiar tarde.
- Sesiones demasiado largas: mejor 3 de 5 minutos.
- Pedir demasiado de golpe, en sitios con muchas distracciones.

Todos nuestros planes siguen estos principios. El test gratis te da el primer paso adaptado a tu perro, sea cachorro, adoptado o adulto.`
  }
];
