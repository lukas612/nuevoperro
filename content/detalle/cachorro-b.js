/* Detalle de las tareas diarias del plan de cachorro (días 29-56). {n} = nombre del cachorro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    5: { meta: 'Esta semana {n} aprende que los otros perros son algo normal: puede conocerlos con calma, mirarlos sin lanzarse y volver contigo.' },
    6: { meta: 'Esta semana conviertes cepillo, uñas, dientes y secado en momentos tranquilos, y {n} empieza a pasear sin tirar de la correa.' },
    7: { meta: 'Esta semana {n} descubre la ciudad poco a poco: tráfico, tiendas y terrazas, siempre a su ritmo y volviendo a lo tranquilo.' },
    8: { meta: 'Esta semana repasas lo aprendido, refuerzas lo que más le costó y celebras todo lo que {n} ha conseguido contigo.' }
  };
  var DETALLE = {
    // Semana 5 — Otros perros
    29: {
      objetivo: 'Un buen primer contacto con un perro adulto equilibrado enseña a {n} a leer a otros perros y a saludar con educación.',
      pasos: [
        'Elige un perro adulto sano, vacunado y tranquilo que conozcas, y queda en un sitio neutral: un parque poco transitado, no la casa de ninguno.',
        'Pasead en paralelo 5 minutos a unos 3 metros de distancia, con las correas flojas, antes de dejar que se acerquen.',
        'Deja que se huelan 3 segundos, di "vamos" en tono alegre, aléjate unos pasos y premia a {n} cuando venga contigo.',
        'Repite el acercamiento 2 o 3 veces si los dos están relajados: cuerpos sueltos, colas bajas o a media altura, juego con pausas.',
        'Termina a los 10 o 15 minutos, mientras todo va bien. Mejor un encuentro corto y bueno que uno largo que se tuerce.'
      ],
      tiempo: '15 minutos',
      material: 'Premios pequeños, correa de 2 metros',
      exito: '{n} se acerca curioso, huele, se deja oler y vuelve a ti cuando le llamas, sin esconderse ni saltar encima del otro perro.',
      siNo: 'Si se esconde entre tus piernas o el adulto gruñe, separadlos con calma, aumenta la distancia y dejad solo que paseen en paralelo. Consulta con tu veterinario si aún no puede tratar con perros.'
    },
    30: {
      objetivo: 'Que {n} aprenda que ver un perro no significa ir a saludarlo siempre. La calma ante otros perros se entrena desde ahora.',
      pasos: [
        'Busca un sitio desde el que se vean perros pasar a 15 o 20 metros: un banco junto a un parque o una acera ancha.',
        'Cada vez que {n} mire a un perro, di "bien" y dale un premio en cuanto lo mire. El otro perro anuncia premios.',
        'Si te mira a ti después de ver al perro, dale 2 o 3 premios seguidos: es justo lo que buscas.',
        'Haz 5 a 8 repeticiones y vete a casa. Acércate solo 2 o 3 metros por sesión si sigue tranquilo.'
      ],
      tiempo: '5 minutos',
      material: 'Premios muy apetecibles, correa',
      exito: '{n} mira al perro, después te mira a ti y come sin problema. Si coge el premio con suavidad, la distancia es la correcta.',
      siNo: 'Si tira, ladra o no acepta comida, estás demasiado cerca: aléjate 5 metros más y vuelve a empezar. No le obligues a acercarse.'
    },
    31: {
      objetivo: '"Suelta" evita persecuciones por la casa y que defienda sus cosas. Aprende que soltar le sale a cuenta.',
      pasos: [
        'Juega con un juguete que le guste medio, no su favorito. Mientras lo tiene en la boca, pon un premio delante de su nariz.',
        'En cuanto abra la boca y suelte, di "suelta" y dale el premio. Al principio la palabra va justo cuando suelta.',
        'Devuélvele el juguete enseguida y sigue jugando: así aprende que soltar no significa perderlo.',
        'Haz 5 repeticiones. A partir de la tercera, di "suelta" un segundo antes de mostrar el premio.'
      ],
      tiempo: '3 minutos',
      material: 'Juguete de tirar o pelota, premios',
      exito: 'Al oír "suelta" abre la boca antes de ver el premio y espera tranquilo a que le devuelvas el juguete.',
      siNo: 'Si sale corriendo con el juguete, no le persigas: siéntate, enseña un premio y espera. Practica con juguetes menos valiosos unos días.'
    },
    32: {
      objetivo: 'Pasar del juego a la calma en segundos le enseña a regularse y reduce los mordiscos cuando se excita.',
      pasos: [
        'Juega 1 minuto con un juguete de tirar, con energía pero sin que pueda morderte las manos.',
        'Para en seco, quédate quieto con el juguete pegado a tu cuerpo y pide "sentado".',
        'Cuando se siente, cuenta 10 segundos tranquilos y premia. Luego di "a jugar" y vuelve a empezar.',
        'Haz 4 o 5 ciclos. Termina con una pausa larga y guarda el juguete mientras está tranquilo.'
      ],
      tiempo: '5 minutos',
      material: 'Juguete de tirar, premios',
      exito: 'Cada vez se sienta más rápido al parar el juego y no salta a por el juguete durante la pausa.',
      siNo: 'Si muerde las manos o no puede sentarse, el juego está demasiado intenso: juega 30 segundos más suave. Si está muy alterado, quizá necesita una siesta.'
    },
    33: {
      objetivo: 'Un buen grupo de cachorros le da juego seguro con perros de su edad y te da a ti apoyo profesional.',
      pasos: [
        'Pregunta a tu veterinario si {n} ya puede ir a una clase de cachorros según su vacunación.',
        'Busca 2 o 3 grupos cerca de casa y pregunta si trabajan solo en positivo, sin collares de castigo ni tirones.',
        'Elige grupos pequeños, de 4 a 6 cachorros, separados por tamaño y con juego vigilado y con pausas.',
        'Pide ver una clase antes. Fíjate en que paren el juego si un cachorro se agobia o abusa de otro.'
      ],
      tiempo: '20 minutos de búsqueda',
      material: 'Teléfono o internet, cartilla de {n}',
      exito: 'Tienes un grupo localizado con educadores que premian, explican y respetan el ritmo de cada cachorro.',
      siNo: 'Si no hay grupos cerca o tu veterinario prefiere esperar, organiza un rato de juego con un cachorro sano y vacunado de un conocido.'
    },
    34: {
      objetivo: 'Media hora sola es un paso importante hacia tu rutina real. Lo construyes sobre las ausencias que ya le salen bien.',
      pasos: [
        'Antes de salir, saca a {n} a hacer pis y juega 10 minutos. Después, 5 minutos de calma en casa.',
        'Dale el juguete rellenable en su zona segura justo antes de irte. Sal sin despedidas.',
        'Quédate fuera 30 minutos. Si tienes cámara o móvil con audio, comprueba cómo está los primeros 5 minutos.',
        'Al volver, entra con calma, espera a que se tranquilice y luego salúdale. Retira el juguete rellenable.'
      ],
      tiempo: '30 minutos',
      material: 'Juguete rellenable, zona segura',
      exito: 'Se pone con el juguete, luego descansa y te recibe contento pero sin desesperación.',
      siNo: 'Si llora más de unos minutos o destroza cosas, vuelve a 15 minutos durante 3 o 4 días antes de volver a subir.'
    },
    35: {
      objetivo: 'Revisar la semana te dice si {n} va cómodo con otros perros y a qué distancia debes trabajar a partir de ahora.',
      pasos: [
        'Anota a qué distancia mínima puede ver un perro y seguir comiendo tranquilo.',
        'Recuerda el encuentro del día 29: ¿se acercó con curiosidad, se escondió o se pasó de efusivo?',
        'Si se agobió, la próxima vez empieza a 5 metros más de distancia y con encuentros más cortos.',
        'Si se pasó de efusivo, practica más pausas y "vamos" para alejarte antes de que se exalte.'
      ],
      tiempo: '5 minutos',
      material: 'Libreta o la tabla del plan',
      exito: 'Sabes la distancia a la que {n} está cómodo y tienes claro qué ajustar la semana que viene.',
      siNo: 'Si le dan miedo todos los perros o reacciona con ladridos intensos, consulta con un educador canino que trabaje en positivo.'
    },
    // Semana 6 — Manejo
    36: {
      objetivo: 'Si el cepillado se asocia a premios desde cachorro, cepillarle de adulto será un rato agradable y no una pelea.',
      pasos: [
        'Elige un momento en que esté cansado, después de un paseo, y siéntate en el suelo con él.',
        'Enséñale el cepillo y dale un premio. Repite 3 veces sin cepillar.',
        'Pasa el cepillo 2 o 3 veces por el lomo con suavidad y premia. Repite hasta llegar a 30 segundos.',
        'Para antes de que intente morder el cepillo o irse. Termina con un premio y guarda el cepillo.'
      ],
      tiempo: '3 minutos',
      material: 'Cepillo suave adecuado a su pelo, premios',
      exito: '{n} se queda quieto o tumbado mientras le cepillas y se acerca cuando ve el cepillo.',
      siNo: 'Si muerde el cepillo, dale un mordedor o un juguete rellenable mientras le cepillas y haz pasadas más cortas.'
    },
    37: {
      objetivo: 'Tocar las uñas sin agobio prepara el terreno para que cortarlas no sea un problema toda su vida.',
      pasos: [
        'Toca una pata 1 segundo y premia. Haz 5 repeticiones con cada pata.',
        'Después, toca una sola uña con el dedo 1 segundo y premia. Ve uña a uña.',
        'Si está cómodo, sujeta la pata 2 segundos y toca la uña. Premio. No cortes nada.',
        'Para tras 2 o 3 minutos. El corte, déjalo en manos de tu veterinario o peluquero al principio.'
      ],
      tiempo: '3 minutos',
      material: 'Premios pequeños',
      exito: '{n} deja la pata relajada en tu mano y no la retira cuando tocas una uña.',
      siNo: 'Si retira la pata, vuelve a tocar solo el hombro o la pata más arriba unos días y baja poco a poco.'
    },
    38: {
      objetivo: 'Revisar la boca sin pelea te permite ver sus dientes y facilita las visitas al veterinario.',
      pasos: [
        'Con {n} tranquilo, toca su hocico 1 segundo y premia. 3 repeticiones.',
        'Levanta el labio de un lado 1 segundo, suéltalo y premia. Repite por el otro lado.',
        'Cuando lo acepte bien, mantén el labio levantado 2 o 3 segundos y mira los dientes.',
        'Haz 5 o 6 repeticiones en total y para. Si ves algo raro en encías o dientes, consulta con tu veterinario.'
      ],
      tiempo: '2 minutos',
      material: 'Premios pequeños',
      exito: 'Se queda quieto mientras le levantas el labio y espera el premio sin apartar la cabeza.',
      siNo: 'Si mordisquea tu mano, está cambiando los dientes y le molesta: hazlo más breve y ofrécele un mordedor al terminar.'
    },
    39: {
      objetivo: 'Secarle sin miedo hace que los baños y los días de lluvia sean fáciles para los dos.',
      pasos: [
        'Pon una toalla en el suelo con premios encima: que la explore y la pise.',
        'Sécale el lomo con la toalla 5 segundos y premia. Luego las patas, una a una.',
        'Enciende el secador al mínimo a 3 metros de distancia, sin apuntarle, y dale premios mientras suena.',
        'Si come tranquilo, acércalo 50 cm cada vez. Apágalo antes de que se inquiete. Hoy no hace falta usarlo sobre él.'
      ],
      tiempo: '5 minutos',
      material: 'Toalla, secador, premios',
      exito: '{n} sigue comiendo y moviéndose con normalidad con el secador encendido a unos metros.',
      siNo: 'Si se asusta, apaga el secador y vuelve a encenderlo en otra habitación al día siguiente, más lejos y con la puerta entornada.'
    },
    40: {
      objetivo: 'Pasear sin tirones empieza ahora: {n} aprende que la correa floja es lo que hace avanzar.',
      pasos: [
        'Sal a una calle tranquila con premios en el bolsillo. Lleva la correa siempre a la misma altura.',
        'En cuanto la correa se tense, para y quédate quieto. No tires ni hables.',
        'Cuando {n} vuelva hacia ti y la correa se afloje, di "bien" y sigue andando. Premia junto a tu pierna.',
        'Durante los primeros 5 minutos, premia cada 3 o 4 pasos con la correa floja. Haz 10 minutos en total.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa de 2 metros, premios',
      exito: 'Cada vez tardas menos en avanzar: {n} vuelve solo hacia ti al notar la correa tensa.',
      siNo: 'Si tira sin parar, hay demasiados estímulos: practica primero en el portal o en un parque vacío.'
    },
    41: {
      objetivo: 'Una hora de ausencia le acerca a la vida real de casa. Solo subes si la media hora ya va bien.',
      pasos: [
        'Comprueba que las ausencias de 30 minutos llevan 3 o 4 días sin llantos largos. Si no, quédate ahí.',
        'Antes de salir: pis, 10 minutos de juego o paseo y 5 minutos de calma.',
        'Deja el juguete rellenable en su zona segura y sal sin despedidas. Vuelve a la hora.',
        'Entra con calma y saluda cuando esté tranquilo. Sácale a hacer pis enseguida.'
      ],
      tiempo: '1 hora',
      material: 'Juguete rellenable, zona segura',
      exito: 'Al volver ves que ha dormido o ha estado tranquilo, sin empapador destrozado ni señales de agobio.',
      siNo: 'Si llora mucho o rompe cosas, baja a 30 o 45 minutos y sube de 10 en 10 minutos cada pocos días.'
    },
    42: {
      objetivo: 'Revisar el manejo te dice qué zona de su cuerpo necesita más práctica antes de que sea un problema.',
      pasos: [
        'Repasa cepillo, uñas, dientes y secador: ¿con cuál se aparta, muerde o se pone nervioso?',
        'Anota esa zona y practícala 2 minutos al día durante los próximos 7 días.',
        'Vuelve un paso atrás en esa zona: más corto, más premios y en un momento en que esté cansado.',
        'Mantén las otras con 1 o 2 repeticiones al día para que no se olviden.'
      ],
      tiempo: '5 minutos',
      material: 'Libreta, premios',
      exito: '{n} acepta casi todo el manejo con calma y tienes un plan corto para lo que aún le cuesta.',
      siNo: 'Si gruñe o se queda paralizado al tocarle una zona concreta, consulta con tu veterinario por si hay molestias y después con un educador canino.'
    },
    // Semana 7 — Ciudad
    43: {
      objetivo: 'Acostumbrarse al tráfico de forma gradual evita que los coches, motos y autobuses le asusten de adulto.',
      pasos: [
        'Busca una calle con tráfico y quédate a 15 o 20 metros, en una plaza o calle lateral.',
        'Cada vez que pase un coche, moto o autobús, dale un premio. 2 o 3 minutos.',
        'Si come tranquilo, acércate 5 metros. Si se tensa, vuelve a la distancia anterior.',
        'Termina paseando 5 minutos por una calle tranquila para que se relaje antes de volver a casa.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios',
      exito: '{n} mira el tráfico, sigue comiendo y olfatea el suelo con normalidad.',
      siNo: 'Si se queda paralizado, intenta huir o no come, estás demasiado cerca: vuelve a la calle tranquila y prueba otro día más lejos.'
    },
    44: {
      objetivo: 'Si vais a usar el transporte público, una primera experiencia corta y tranquila marca todas las siguientes.',
      pasos: [
        'Consulta las normas del transporte de tu ciudad para perros: suelen pedir transportín o permitirlos con condiciones.',
        'Antes, acostumbra a {n} al transportín en casa: premios dentro y puerta abierta 2 días.',
        'Elige una hora tranquila, sube y baja en la siguiente parada. Premios durante el trayecto.',
        'Al bajar, paseo corto y relajado. Si no vais a usar transporte, sáltate esta tarea.'
      ],
      tiempo: '15 minutos',
      material: 'Transportín o arnés, premios, manta',
      exito: '{n} viaja tranquilo, acepta premios y al bajar camina con normalidad.',
      siNo: 'Si se agobia, para en el andén y practica solo mirar los trenes o autobuses desde lejos con premios unos días.'
    },
    45: {
      objetivo: 'Una visita corta a una tienda le enseña a estar tranquilo en interiores con gente, suelos y ruidos nuevos.',
      pasos: [
        'Elige una tienda que admita perros y ve a una hora con poca gente.',
        'Antes de entrar, saca a {n} a hacer pis y deja que olfatee la puerta 30 segundos.',
        'Entra, camina despacio y premia cada pocos pasos. Si se tumba o mira tranquilo, premio extra.',
        'Sal a los 2 minutos, aunque vaya bien. Si alguien quiere tocarle, que primero le deje un premio.'
      ],
      tiempo: '5 minutos',
      material: 'Arnés, correa corta, premios',
      exito: '{n} explora la tienda con curiosidad y sale con la cola relajada.',
      siNo: 'Si se pega a tus piernas o tiembla, quédate en la puerta mirando y premiando. Ya entraréis otro día.'
    },
    46: {
      objetivo: 'Que venga cuando le llamas aunque haya distracciones es una de las órdenes más importantes para su seguridad.',
      pasos: [
        'Ve a un parque vallado a una hora tranquila con una correa larga de 5 a 10 metros.',
        'Deja que se aleje 2 o 3 metros, di "{n}, ven" en tono alegre y agáchate.',
        'Cuando llegue, premio especial y vuelve a soltarle a explorar: venir no termina la diversión.',
        'Haz 5 llamadas y aumenta la distancia a 5 metros si responde rápido. Llama solo cuando sea fácil que venga.'
      ],
      tiempo: '5 minutos',
      material: 'Correa larga de 5 a 10 metros, arnés, premios muy apetecibles',
      exito: '{n} se gira y corre hacia ti al oír su nombre y "ven", incluso con olores a su alrededor.',
      siNo: 'Si no viene, no repitas la orden: aléjate unos pasos haciendo ruido alegre para que te siga. Baja las distracciones.'
    },
    47: {
      objetivo: '"Tumbado" le da una postura de calma muy útil para terrazas, visitas y ratos de espera.',
      pasos: [
        'Pide "sentado" y pon un premio pegado a su nariz.',
        'Baja el premio despacio hasta el suelo, entre sus patas delanteras, y luego un poco hacia delante.',
        'En cuanto apoye los codos, di "tumbado" y dale el premio en el suelo.',
        'Haz 5 repeticiones. Cuando lo haga bien, hazlo con la mano vacía y premia desde la otra mano.'
      ],
      tiempo: '3 minutos',
      material: 'Premios pequeños, superficie blanda',
      exito: '{n} se tumba siguiendo tu mano en 2 o 3 segundos y se queda en el suelo para recibir el premio.',
      siNo: 'Si se levanta, baja el premio más despacio y premia cuando baje solo un poco. Prueba sobre una alfombra.'
    },
    48: {
      objetivo: 'Estar tumbado tranquilo en una terraza le enseña a relajarse en sitios públicos y a acompañarte.',
      pasos: [
        'Elige una terraza tranquila y ve después de un paseo, cuando ya esté algo cansado.',
        'Pon su manta en el suelo a tu lado y premia cada vez que la pise o se siente en ella.',
        'Cuando se tumbe, premia en el suelo con calma. Dale un mordedor para que tenga algo que hacer.',
        'Quedaos 10 minutos y vete antes de que se aburra o se inquiete.'
      ],
      tiempo: '10 minutos',
      material: 'Manta, mordedor, premios, correa',
      exito: '{n} se tumba sobre la manta y mira alrededor sin intentar irse.',
      siNo: 'Si no para de moverse, elige un sitio más tranquilo o haz la mitad del tiempo. Dale primero un paseo más largo.'
    },
    49: {
      objetivo: 'Identificar lo que más le cuesta te permite dedicar la última semana a lo que de verdad necesita.',
      pasos: [
        'Repasa la semana: tráfico, transporte, tienda, "ven", "tumbado" y terraza.',
        'Elige la situación en la que más le costó comer, se tensó o quiso irse.',
        'Anótala con detalles: dónde fue, a qué distancia y cuánto tiempo aguantó tranquilo.',
        'Piensa una versión más fácil: más lejos, más corta o a una hora más tranquila.'
      ],
      tiempo: '5 minutos',
      material: 'Libreta o la tabla del plan',
      exito: 'Tienes anotada una situación concreta y una versión más fácil para practicar el día 54.',
      siNo: 'Si todo le cuesta mucho, quizá ha tenido demasiado esta semana: deja 2 días solo de paseos tranquilos.'
    },
    // Semana 8 — Repaso
    50: {
      objetivo: 'Ver el patrón de los accidentes que quedan te permite adelantarte y terminar de resolverlos.',
      pasos: [
        'Durante 3 días, anota cada pis y caca: hora, sitio y qué pasó justo antes.',
        'Fíjate en los momentos: ¿tras dormir, jugar, comer o una visita?',
        'Adelanta las salidas a esos momentos y premia en los 2 segundos siguientes al pis fuera.',
        'Si hay accidentes en casa, limpia con un limpiador enzimático y sin regañar.'
      ],
      tiempo: '5 minutos al día durante 3 días',
      material: 'Tabla del plan, limpiador enzimático, premios',
      exito: 'Ves un patrón claro y los accidentes bajan al adelantar las salidas.',
      siNo: 'Si hace pis muy a menudo o de golpe empeora, consulta con tu veterinario para descartar molestias.'
    },
    51: {
      objetivo: 'Tener mordedores variados a mano es la mejor forma de que siga mordiendo lo que sí puede.',
      pasos: [
        'Revisa sus mordedores: retira los rotos o demasiado pequeños para su tamaño actual.',
        'Ten al menos 3 texturas: uno duro, uno blando y un juguete rellenable.',
        'Deja uno en cada zona donde pasa tiempo: salón, su zona segura y cerca del sofá.',
        'Rota los mordedores cada 2 o 3 días para que le parezcan nuevos.'
      ],
      tiempo: '10 minutos',
      material: 'Mordedores de distintas texturas, juguete rellenable',
      exito: 'Cuando le apetece morder, {n} busca un mordedor en vez de tus manos o los muebles.',
      siNo: 'Si sigue mordiendo muebles, protégelos y ofrécele el mordedor justo antes de los momentos en que suele morder.'
    },
    52: {
      objetivo: 'Comprobar cómo duerme te dice si puedes seguir alejando la cama hasta el sitio definitivo.',
      pasos: [
        'Anota 3 noches: dónde duerme, a qué hora se despierta y si llora.',
        'Si duerme bien 3 noches seguidas, aleja la cama 30 o 50 cm hacia su sitio definitivo.',
        'Mantén la rutina: última salida de pis, prenda con tu olor y luces bajas.',
        'Si se despierta, sácale a hacer pis sin hablar ni jugar y de vuelta a la cama.'
      ],
      tiempo: '5 minutos',
      material: 'Cama, prenda con tu olor',
      exito: '{n} duerme de un tirón o se despierta solo para hacer pis y vuelve a dormirse.',
      siNo: 'Si empieza a llorar tras moverla, vuelve a acercarla unos días y aleja en pasos más pequeños.'
    },
    53: {
      objetivo: 'Probar la ausencia que realmente necesitas te dice si {n} está preparado para tu rutina diaria.',
      pasos: [
        'Decide cuánto tiempo necesitas que se quede solo en tu rutina real.',
        'Prepara todo: pis, paseo o juego, 5 minutos de calma y su juguete rellenable.',
        'Sal sin despedidas. Si tienes cámara, mira cómo está en los primeros 10 minutos.',
        'Si son más de 3 o 4 horas, organiza que alguien le saque a media jornada.'
      ],
      tiempo: 'Lo que dure tu ausencia real',
      material: 'Juguete rellenable, zona segura',
      exito: 'Al volver ves que ha descansado y te recibe contento sin señales de agobio.',
      siNo: 'Si llora o destroza, vuelve a la última ausencia que fue bien y sube de 15 en 15 minutos. Si dura semanas, consulta con un educador canino.'
    },
    54: {
      objetivo: 'Dedicar un día a lo que más le cuesta convierte una situación difícil en una más fácil.',
      pasos: [
        'Recupera la situación que anotaste el día 49 y su versión más fácil.',
        'Practícala 3 o 4 minutos a la distancia en la que {n} sigue comiendo premios.',
        'Premia cada vez que mire lo que le cuesta y se quede tranquilo.',
        'Termina en un buen momento y repite 2 o 3 veces esta semana.'
      ],
      tiempo: '5 minutos',
      material: 'Premios muy apetecibles, correa',
      exito: '{n} se mantiene tranquilo un poco más cerca o un poco más rato que el día 49.',
      siNo: 'Si se tensa, aleja la distancia o acorta el tiempo. Avanzar despacio también es avanzar.'
    },
    55: {
      objetivo: 'Un truco divertido refuerza vuestro vínculo y entrena su cabeza sin presión.',
      pasos: [
        'Para "choca", pon un premio en tu mano cerrada a la altura de su pata.',
        'Cuando toque la mano con la pata, di "choca" y dale el premio.',
        'Haz 5 repeticiones y luego ofrece la mano abierta. Premia cuando la toque.',
        'Termina en 3 minutos, mientras aún está con ganas.'
      ],
      tiempo: '3 minutos',
      material: 'Premios pequeños',
      exito: '{n} levanta la pata y toca tu mano en cuanto ve el gesto.',
      siNo: 'Si muerde o lame la mano, espera quieto. Premia cualquier movimiento de pata, aunque sea pequeño.'
    },
    56: {
      objetivo: 'Mirar atrás os ayuda a ver todo lo que habéis avanzado y a decidir en qué seguir trabajando.',
      pasos: [
        'Mira fotos o notas del primer día y compara: pis, noches, mordiscos, soledad y paseos.',
        'Anota 3 cosas que ha aprendido y 1 que quieres seguir trabajando.',
        'Celebradlo con su juego favorito o un paseo tranquilo por un sitio nuevo.',
        'Rellena la encuesta final del plan para tener tu resumen.'
      ],
      tiempo: '15 minutos',
      material: 'Fotos o notas, encuesta final',
      exito: 'Ves claramente cuánto ha avanzado {n} y tienes un siguiente objetivo claro.',
      siNo: 'Si algo sigue costando mucho, es normal: sigue practicándolo a su ritmo o consulta con un educador canino.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_CACHORRO = root.DETALLE_CACHORRO || { SEMANAS: {}, DETALLE: {} }; Object.assign(root.DETALLE_CACHORRO.SEMANAS, SEMANAS); Object.assign(root.DETALLE_CACHORRO.DETALLE, DETALLE); }
})(this);
