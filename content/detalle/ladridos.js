/* Detalle de las tareas del programa «ladridos» (días 1-42). {n} = nombre del perro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    1: { meta: 'Sabréis cuándo y por qué ladra {n}, le quitaréis ocasiones y empezaréis a pagar el silencio.' },
    2: { meta: '{n} tendrá una alternativa clara al ladrido: ir a su cama o mirarte cuando algo pasa.' },
    3: { meta: 'Practicaréis con su detonante a baja intensidad hasta que el timbre anuncie algo bueno.' },
    4: { meta: 'Llevaréis lo aprendido a situaciones reales: repartidor, ventana y ladrido para pedir.' },
    5: { meta: 'Toda la familia responderá igual, para que el ladrido deje de funcionar con cualquiera.' },
    6: { meta: 'Consolidaréis los avances, retiraréis ayudas poco a poco y dejaréis una rutina para siempre.' }
  };
  var DETALLE = {
    1: {
      objetivo: 'Sin saber cuándo y por qué ladra, trabajas a ciegas; el diario te da el mapa de los detonantes reales.',
      pasos: [
        'Deja papel y boli (o una nota en el móvil) a mano en la zona donde más ladra.',
        'Cada vez que ladre, apunta hora, qué lo provocó, dónde estaba y cuántos segundos duró.',
        'Anota también qué hiciste tú justo después (mirarle, hablarle, abrir la puerta...).',
        'Por la noche, cuenta cuántos episodios hubo y subraya los 2 motivos que más se repiten.'
      ],
      tiempo: 'Todo el día, 1 minuto por anotación',
      material: 'Papel y boli o notas del móvil',
      exito: 'Al final del día puedes decir en una frase qué le hace ladrar más y a qué horas.',
      siNo: 'Si se te escapan ladridos, no pasa nada: apunta los que puedas. Si el ladrido aparece de repente o con quejidos, consulta con tu veterinario.'
    },
    2: {
      objetivo: 'Cada ladrido que se repite se refuerza solo; quitar la ocasión más frecuente rompe la práctica mientras aprende.',
      pasos: [
        'Mira tu diario y elige el detonante número 1.',
        'Ventana: baja la persiana a media altura o pon vinilo translúcido en la parte baja del cristal.',
        'Ruidos del rellano: deja radio o ruido blanco bajo de fondo, sobre todo cuando estás fuera.',
        'Timbre: cambia el sonido o pide a los habituales que avisen por móvil durante unas semanas.'
      ],
      tiempo: '15-30 minutos',
      material: 'Persiana, vinilo, radio o lo que necesites',
      exito: 'Ese detonante aparece menos veces hoy que ayer en el diario.',
      siNo: 'Si busca otro puesto de vigilancia, bloquéalo también con una puerta o una barrera. Es temporal: luego lo trabajaréis.'
    },
    3: {
      objetivo: 'Lo que se premia se repite: {n} aprende que quedarse callado ante un estímulo le trae algo bueno.',
      pasos: [
        'Lleva encima una bolsita con 15 premios pequeños y muy apetecibles.',
        'Cuando pase algo que suele hacerle ladrar (un ruido, una voz) y no ladre, premia en menos de 2 segundos.',
        'Si solo levanta la cabeza o mira, también vale: premia esa calma.',
        'Llega a 10 premios repartidos a lo largo del día.'
      ],
      tiempo: 'Repartido en el día',
      material: 'Premios pequeños (tamaño lenteja)',
      exito: '{n} empieza a mirarte después de un ruido en lugar de ir hacia la puerta o la ventana.',
      siNo: 'Si ladra antes de que llegues, el estímulo era demasiado fuerte: ese no lo premies y busca momentos más fáciles.'
    },
    4: {
      objetivo: 'Un perro con la cabeza cansada ladra menos; olfatear le relaja y gasta energía de verdad.',
      pasos: [
        'Con {n} fuera de la habitación, esconde 10-15 premios en sitios fáciles y a la vista.',
        'Déjale entrar y di "busca" con voz alegre, señalando el primero si hace falta.',
        'Cuando los encuentre fácil, escóndelos detrás de patas de muebles o bajo una toalla.',
        'Termina antes de que pierda interés, con un último premio fácil.'
      ],
      tiempo: '10 minutos',
      material: 'Premios o parte de su ración',
      exito: 'Al acabar está tranquilo, se tumba o descansa un rato.',
      siNo: 'Si no busca, ponlos más a la vista y empieza con 3-4. Si está muy excitado, hazlo más lento y con menos premios.'
    },
    5: {
      objetivo: 'Tener un sitio al que ir le da una alternativa al ladrido que podréis usar con el timbre y las visitas.',
      pasos: [
        'Pon su cama en un lugar tranquilo, lejos de la puerta de entrada.',
        'Tira un premio sobre la cama; cuando suba a por él, premia otra vez encima.',
        'Repite 10 veces; a partir de la 5.ª, di "a tu sitio" justo antes de tirar el premio.',
        'Al final, señala la cama sin tirar nada y premia en cuanto apoye las patas en ella.'
      ],
      tiempo: '5 minutos',
      material: 'Premios pequeños y su cama o manta',
      exito: '{n} va hacia la cama cuando oye "a tu sitio", aunque sea despacio.',
      siNo: 'Si no sube, tira el premio más cerca del borde. Nunca le empujes ni le lleves a la fuerza: tiene que ser un sitio agradable.'
    },
    6: {
      objetivo: 'Oler a su ritmo baja la tensión acumulada y cubre necesidades que, sin cubrir, salen en forma de ladridos.',
      pasos: [
        'Elige una zona tranquila, con pocos coches y perros.',
        'Usa una correa larga de 3-5 metros o deja la correa floja.',
        'Deja que se pare a oler todo lo que quiera, sin prisa ni tirones.',
        'Camina al menos 30-40 minutos y vuelve por un camino tranquilo.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés y correa larga',
      exito: 'En casa descansa más y ladra menos a ruidos en las horas siguientes.',
      siNo: 'Si ladra a otros perros o personas en la calle, aumenta la distancia y premia cuando los mire sin ladrar.'
    },
    7: {
      objetivo: 'Comparar con el día 1 te muestra el progreso real y te dice qué conviene reforzar la semana que viene.',
      pasos: [
        'Haz hoy otro diario igual que el del día 1: hora, motivo y duración.',
        'Cuenta episodios totales y compáralos con el día 1.',
        'Fíjate también en la duración: ladrar menos rato ya es un avance.',
        'Elige el detonante que más se resiste para tenerlo presente.'
      ],
      tiempo: 'Todo el día + 10 minutos de repaso',
      material: 'Tu diario',
      exito: 'Hay menos episodios, más cortos, o {n} se calma antes que el día 1.',
      siNo: 'Si no ha cambiado nada, revisa que hayas quitado la ocasión principal y que tenga paseo y olfato cada día.'
    },
    8: {
      objetivo: 'Asociar ruidos flojos con premios en su cama prepara a {n} para responder igual ante el timbre real.',
      pasos: [
        'Busca un vídeo de timbre o golpes en la puerta y ponlo al volumen más bajo que aún oiga.',
        'Cuando suene, tira 2-3 premios en su cama.',
        'Repite 5-8 veces con pausas de 30 segundos.',
        'Si va a la cama al oír el sonido, sube el volumen un poco en la siguiente sesión.'
      ],
      tiempo: '5 minutos, 2 veces',
      material: 'Móvil o altavoz, premios',
      exito: 'Al oír el ruido flojo, {n} mira hacia su cama o va hacia ella.',
      siNo: 'Si ladra, el volumen está alto: bájalo hasta que ni levante las orejas y avanza más despacio.'
    },
    9: {
      objetivo: 'Mirarte es una alternativa al ladrido que puedes pedir en cualquier lugar, en casa y en la calle.',
      pasos: [
        'En un sitio tranquilo, di su nombre una sola vez con tono alegre.',
        'En cuanto te mire, di "bien" y dale un premio.',
        'Haz 10 repeticiones por sesión, 3 sesiones al día.',
        'Cuando responda rápido, pruébalo con algo de distracción, como la tele encendida.'
      ],
      tiempo: '2 minutos, 3 veces al día',
      material: 'Premios pequeños',
      exito: '{n} gira la cabeza hacia ti en menos de 2 segundos al oír su nombre.',
      siNo: 'Si no te mira, no repitas el nombre: haz un ruidito con la boca, premia cuando mire y vuelve a un sitio más tranquilo.'
    },
    10: {
      objetivo: 'Reconocer su aviso con calma y llamarle hacia ti le da una salida mejor que seguir ladrando.',
      pasos: [
        'Cuando ladre a algo, ve con calma hacia él sin levantar la voz.',
        'Di "gracias" en tono tranquilo, mira un segundo hacia lo que le preocupa.',
        'Aléjate 2-3 pasos, llámale por su nombre y premia en cuanto venga.',
        'Dale 2-3 premios seguidos lejos de la ventana o la puerta.'
      ],
      tiempo: 'Cuando ocurra, 1 minuto',
      material: 'Premios a mano en varios puntos de casa',
      exito: 'Tras el "gracias", {n} se gira hacia ti y viene en pocos segundos.',
      siNo: 'Si no viene, acércate más y ponle un premio en la nariz para guiarle. Practica la llamada sin ladridos durante el día.'
    },
    11: {
      objetivo: 'Seguir pagando la calma hace que quedarse callado se convierta en la respuesta más habitual de {n}.',
      pasos: [
        'Ten premios en 2-3 puntos de la casa (en un bote alto, fuera de su alcance).',
        'Premia cada vez que oiga un ruido, vea algo o alguien pase, y no ladre.',
        'Premia también los momentos en que está tumbado tranquilo cerca de la puerta.',
        'Intenta llegar a 10-15 premios hoy.'
      ],
      tiempo: 'Repartido en el día',
      material: 'Premios en botes por casa',
      exito: 'Hay momentos en que oye algo, te mira y se queda en silencio.',
      siNo: 'Si se te olvida premiar, pon un aviso en el móvil cada 2 horas para estar atento un rato.'
    },
    12: {
      objetivo: 'Los juegos de pensar le cansan y le dan algo que hacer en los momentos en que solía ladrar.',
      pasos: [
        'Rellena un juguete con parte de su comida húmeda o pienso mojado.',
        'O bien: pon 3 vasos boca abajo, esconde un premio bajo uno y deja que lo encuentre.',
        'Si acierta con los vasos, cambia el premio de sitio delante de él 5-10 veces.',
        'Recoge el juego cuando acabe para que siga siendo especial.'
      ],
      tiempo: '10 minutos',
      material: 'Juguete rellenable o 3 vasos de plástico',
      exito: '{n} se concentra en el juego y después está más relajado.',
      siNo: 'Si se frustra, ponlo más fácil (comida suelta, juguete sin congelar). Si muerde los vasos, usa el juguete rellenable.'
    },
    13: {
      objetivo: 'El paseo diario de olfato mantiene baja su tensión, que es la base de todo lo demás.',
      pasos: [
        'Sal con correa larga a una zona tranquila.',
        'Deja que marque el ritmo y se pare a oler todo lo que quiera.',
        'Si algo le hace ladrar, aléjate unos metros y premia cuando lo mire en silencio.',
        'Paseo de 30-40 minutos como mínimo.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga y premios',
      exito: 'Vuelve a casa tranquilo y se tumba a descansar.',
      siNo: 'Si está muy alerta en la calle, elige horas con menos gente y caminos más tranquilos.'
    },
    14: {
      objetivo: 'Un día completo de diario te confirma si la alternativa empieza a funcionar fuera de las sesiones.',
      pasos: [
        'Apunta todos los ladridos de hoy: hora, motivo y duración.',
        'Añade una columna: ¿vino a ti o fue a su cama tras el "gracias"?',
        'Compara con el día 1 y el día 7.',
        'Apunta qué detonante usarás para practicar la semana que viene.'
      ],
      tiempo: 'Todo el día + 10 minutos de repaso',
      material: 'Tu diario',
      exito: 'Hay menos episodios y en algunos {n} viene a ti por sí mismo.',
      siNo: 'Si va peor, revisa si ha cambiado algo en casa (horarios, visitas, obras). Ante un cambio brusco sin motivo, consulta al veterinario.'
    },
    15: {
      objetivo: 'Exponerle a su detonante a muy baja intensidad, con premio, cambia lo que siente al oírlo.',
      pasos: [
        'Elige su detonante principal y grábalo o busca un vídeo parecido.',
        'Ponlo tan flojo que lo oiga pero no reaccione más que mirando.',
        'Justo tras el sonido, da 2-3 premios seguidos. Sonido = premio, siempre.',
        'Repite 8-10 veces con pausas de 20-30 segundos.'
      ],
      tiempo: '5 minutos, 2 veces',
      material: 'Grabación del detonante, premios',
      exito: 'Al oír el sonido, {n} te mira esperando el premio en lugar de tensarse.',
      siNo: 'Si ladra o se tensa, estás demasiado alto: baja el volumen o pon el sonido en otra habitación.'
    },
    16: {
      objetivo: 'Subir la intensidad poco a poco, sin pasar su límite, le hace capaz de tolerar el detonante real.',
      pasos: [
        'Empieza 2-3 repeticiones al nivel de ayer para que acierte.',
        'Sube un poco el volumen o acerca el altavoz 1 metro.',
        'Premia cada sonido como ayer: 2-3 premios seguidos.',
        'Si ladra, vuelve al nivel anterior y termina con 2 repeticiones fáciles.'
      ],
      tiempo: '5 minutos, 2 veces',
      material: 'Grabación del detonante, premios',
      exito: 'Tolera un nivel más alto que ayer mirándote o yendo a su cama.',
      siNo: 'Si ladra a menudo, sube más despacio: cambia una sola cosa cada vez (volumen, distancia o duración).'
    },
    17: {
      objetivo: 'Que el timbre de verdad prediga premios en su cama convierte el aviso en una señal para ir a su sitio.',
      pasos: [
        'Coloca a una persona de casa en la puerta y tú junto a la cama de {n}.',
        'Que toque el timbre una vez; en ese instante, lanza 3-4 premios a la cama.',
        'Repite 5 veces con 1 minuto de pausa entre timbres.',
        'Luego quédate a 2 metros de la cama y comprueba si va sola tras el timbre.'
      ],
      tiempo: '10 minutos',
      material: 'Un ayudante, premios muy buenos',
      exito: 'Tras el timbre, {n} corre a su cama en lugar de a la puerta.',
      siNo: 'Si se lanza a la puerta, vuelve al timbre grabado unos días o pide que llamen con los nudillos muy suave.'
    },
    18: {
      objetivo: 'Practicar con una visita preparada le da éxito en una situación casi real y con todo bajo control.',
      pasos: [
        'Avisa a un amigo de que es un ensayo y prepara un juguete rellenable de antemano.',
        'Cuando llame, di "a tu sitio" y dale el juguete en su cama.',
        'Que tu amigo entre tranquilo, sin saludar a {n} ni mirarle.',
        'Tras 5 minutos de calma, puede saludarle con calma si {n} se acerca.'
      ],
      tiempo: '15-20 minutos',
      material: 'Juguete rellenable, premios, un amigo',
      exito: '{n} se queda en su cama con el juguete o ladra solo un momento.',
      siNo: 'Si se levanta, usa una barrera o correa en casa los primeros minutos. Si gruñe o intenta morder, consulta con un profesional cualificado.'
    },
    19: {
      objetivo: 'Premiar el silencio cuando de verdad pasa algo es lo que consolida el cambio día a día.',
      pasos: [
        'Mantén premios a mano en los sitios donde suele ladrar.',
        'Ante ruidos reales del rellano, la calle o los vecinos, premia si no ladra.',
        'Si ladra, usa el "gracias" y la llamada que ya conoce.',
        'Apunta cuántos silencios premiaste hoy.'
      ],
      tiempo: 'Repartido en el día',
      material: 'Premios en botes por casa',
      exito: 'Has premiado más silencios que ladridos has tenido que redirigir.',
      siNo: 'Si hay muchos ladridos, refuerza el control del entorno (persiana, radio) unos días más.'
    },
    20: {
      objetivo: 'El paseo de olfato es descanso mental tras una semana exigente de práctica con su detonante.',
      pasos: [
        'Sal con correa larga a una zona tranquila.',
        'Déjale oler sin prisa; tú solo acompañas.',
        'Premia con calma cuando vea algo que le inquieta y siga caminando.',
        'Paseo de 30-40 minutos como mínimo.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga y premios',
      exito: 'Pasea con la correa floja y el cuerpo suelto.',
      siNo: 'Si tira mucho o está nervioso, empieza el paseo con 5 minutos de buscar premios en la hierba.'
    },
    21: {
      objetivo: 'Saber qué detonante le cuesta más te dice dónde poner el esfuerzo en las próximas semanas.',
      pasos: [
        'Repasa tus notas de los días 15-20.',
        'Ordena sus detonantes de más fácil a más difícil.',
        'Apunta el nivel máximo que tolera de cada uno (volumen, distancia, duración).',
        'Decide qué detonante practicarás en la semana 6.'
      ],
      tiempo: '15 minutos',
      material: 'Tu diario',
      exito: 'Tienes una lista clara de detonantes y sabes cuál es el más difícil.',
      siNo: 'Si todos te parecen igual de difíciles, elige el que ocurre más a menudo en tu día a día.'
    },
    22: {
      objetivo: 'Preparar la llegada del repartidor de antemano evita que el timbre le pille por sorpresa.',
      pasos: [
        'Cuando esperes un paquete, prepara premios y un juguete rellenable junto a su cama.',
        'Al sonar el timbre, di "a tu sitio" y lanza premios a la cama.',
        'Dale el juguete rellenable y abre la puerta con calma.',
        'Al cerrar, sigue premiando 1 minuto mientras siga tranquilo.'
      ],
      tiempo: '5 minutos',
      material: 'Premios, juguete rellenable',
      exito: '{n} va a su cama o ladra menos que antes con el repartidor.',
      siNo: 'Si se lanza a la puerta, cierra la puerta del salón o usa una barrera durante la entrega.'
    },
    23: {
      objetivo: 'Recuperar poco a poco las vistas, contigo al lado, le enseña a mirar la calle sin vigilarla.',
      pasos: [
        'Sube la persiana un poco o quita parte del vinilo, en una hora tranquila.',
        'Siéntate a su lado y premia cada vez que mire a la calle y no ladre.',
        'Haz sesiones cortas de 3-5 minutos.',
        'Al terminar, vuelve a dejar la ventana como estaba.'
      ],
      tiempo: '5 minutos',
      material: 'Premios',
      exito: '{n} mira pasar a gente o perros y luego te mira a ti.',
      siNo: 'Si ladra, abre menos o siéntate más lejos de la ventana. Elige horas con menos movimiento.'
    },
    24: {
      objetivo: 'Si el ladrido para pedir deja de funcionar y el silencio sí, {n} dejará de usarlo.',
      pasos: [
        'Cuando te ladre para pedir algo, gírate en silencio, sin mirarle ni regañarle.',
        'Espera 3 segundos de silencio.',
        'En cuanto calle 3 segundos, gírate y atiéndele (juego, caricia o lo que pida si es adecuado).',
        'Anticípate: ofrécele atención y juego antes de que te lo pida.'
      ],
      tiempo: 'Cuando ocurra',
      material: '',
      exito: 'Los ladridos de petición son más cortos y aparecen menos a lo largo del día.',
      siNo: 'Es normal que al principio ladre más fuerte. Aguanta sin responder: si cedes ahora, aprenderá a insistir más.'
    },
    25: {
      objetivo: 'Usar "gracias" y la llamada en la vida real convierte el ejercicio en un hábito automático.',
      pasos: [
        'Lleva premios en el bolsillo durante el día.',
        'Ante 3 ladridos reales, di "gracias" con calma y llámale.',
        'Premia con 2-3 premios cuando venga y quédate con él unos segundos.',
        'Apunta cuánto tardó en venir cada vez.'
      ],
      tiempo: '1 minuto cada vez',
      material: 'Premios',
      exito: '{n} viene más rápido en la tercera situación que en la primera.',
      siNo: 'Si no responde en situaciones reales, practica más la llamada en casa, sin detonantes, durante 2-3 días.'
    },
    26: {
      objetivo: 'Cansar su cabeza justo antes de sus momentos de ladrido reduce la tensión con la que los afronta.',
      pasos: [
        'Mira en tu diario a qué horas suele ladrar más.',
        'Unos 15-20 minutos antes, haz un juego de olfato o dale un juguete rellenable.',
        'Hazlo en su cama o lejos de la puerta y la ventana.',
        'Apunta si ese rato ladró menos que otros días.'
      ],
      tiempo: '10 minutos',
      material: 'Premios o juguete rellenable',
      exito: 'En sus horas críticas está más tranquilo o ladra menos rato.',
      siNo: 'Si no cambia nada, prueba a hacerlo antes o a combinarlo con un paseo corto.'
    },
    27: {
      objetivo: 'Mantener el paseo de olfato cada semana sostiene el bienestar que hace posible el cambio.',
      pasos: [
        'Busca hoy un sitio nuevo y tranquilo para pasear.',
        'Déjale explorar con la correa larga a su ritmo.',
        'Esparce un puñado de premios en la hierba a mitad de paseo.',
        'Paseo de 30-45 minutos.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga y premios',
      exito: 'Explora con curiosidad y vuelve cansado y tranquilo.',
      siNo: 'Si un lugar nuevo le inquieta mucho, vuelve a su ruta conocida y prueba otro día.'
    },
    28: {
      objetivo: 'Comparar con el día 1 tras 4 semanas te muestra cuánto habéis avanzado y te motiva para seguir.',
      pasos: [
        'Haz un diario completo de hoy: hora, motivo y duración.',
        'Compara número de episodios y duración con el día 1.',
        'Marca qué detonantes casi han desaparecido.',
        'Anota en qué situaciones sigue necesitando ayuda.'
      ],
      tiempo: 'Todo el día + 10 minutos de repaso',
      material: 'Tu diario',
      exito: 'Hay una bajada clara de episodios o de duración frente al día 1.',
      siNo: 'Si el avance es pequeño, quédate otra semana en los ejercicios de las semanas 3 y 4 antes de seguir.'
    },
    29: {
      objetivo: 'Si alguien de casa responde al ladrido, {n} seguirá probando; todos deben actuar igual.',
      pasos: [
        'Reúne a todos los que viven con {n}, también a los niños.',
        'Explica 3 reglas: nadie responde al ladrido, todos premian el silencio, nadie grita.',
        'Pon premios en botes altos al alcance de todos.',
        'Escribe las reglas en un papel y pégalo en la nevera.'
      ],
      tiempo: '15 minutos',
      material: 'Papel, botes de premios',
      exito: 'Todos en casa saben qué hacer cuando ladra y cuando está callado.',
      siNo: 'Si alguien no está de acuerdo, pídele que pruebe solo una semana y comparad el diario.'
    },
    30: {
      objetivo: 'Que {n} responda igual con otra persona demuestra que ha aprendido el ejercicio, no solo contigo.',
      pasos: [
        'Explica a otra persona de casa el ejercicio del timbre y la cama.',
        'Tú tocas el timbre; ella lanza los premios a la cama de {n}.',
        'Repetid 5 veces con 1 minuto de pausa.',
        'Luego cambiad: que ella toque y tú observes.'
      ],
      tiempo: '10 minutos',
      material: 'Premios, un ayudante de casa',
      exito: '{n} va a su cama también cuando premia otra persona.',
      siNo: 'Si con la otra persona no responde, que empiece con el timbre grabado a volumen bajo.'
    },
    31: {
      objetivo: 'Recibir una visita real con la rutina de la cama es el examen práctico del trabajo hecho.',
      pasos: [
        'Prepara un juguete rellenable y premios antes de que llegue la visita.',
        'Al sonar el timbre, "a tu sitio" y premios en la cama.',
        'Dale el juguete y pide a la visita que no le haga caso al entrar.',
        'Cuando lleve unos minutos tranquilo, deja que salude si quiere.'
      ],
      tiempo: '20-30 minutos',
      material: 'Juguete rellenable, premios',
      exito: '{n} ladra poco o nada y se queda con su juguete al principio de la visita.',
      siNo: 'Si se pone muy nervioso, usa una barrera o déjale en otra habitación con el juguete. Ante gruñidos o mordiscos, busca un profesional cualificado.'
    },
    32: {
      objetivo: 'Pasar a premios intermitentes mantiene la conducta fuerte sin depender de la comida siempre.',
      pasos: [
        'En situaciones fáciles, premia el silencio 1 de cada 2 veces.',
        'Las veces sin premio, felicítale con la voz o una caricia.',
        'En situaciones difíciles (timbre, visita), sigue premiando siempre.',
        'Si empeora, vuelve a premiar más a menudo unos días.'
      ],
      tiempo: 'Repartido en el día',
      material: 'Premios',
      exito: '{n} sigue en silencio aunque no siempre haya premio.',
      siNo: 'Si vuelve a ladrar más, has bajado demasiado rápido: premia 3 de cada 4 veces y reduce más despacio.'
    },
    33: {
      objetivo: 'Repetir lo que mejor ha funcionado afianza el aprendizaje y le da a {n} una sesión de éxito.',
      pasos: [
        'Revisa tu diario y elige el ejercicio que dio mejores resultados.',
        'Hazlo 2 veces hoy, 5 minutos cada una.',
        'Empieza por el nivel fácil y termina con un acierto.',
        'Apunta si lo hace mejor que la primera vez.'
      ],
      tiempo: '5 minutos, 2 veces',
      material: 'Según el ejercicio',
      exito: '{n} lo hace con soltura y más rápido que cuando lo aprendió.',
      siNo: 'Si le cuesta más de lo que recordabas, baja la dificultad y repítelo también mañana.'
    },
    34: {
      objetivo: 'El paseo de olfato sigue siendo la base: un perro con necesidades cubiertas ladra menos.',
      pasos: [
        'Que hoy pasee otra persona de casa, con las mismas pautas.',
        'Correa larga, ritmo de {n} y paradas para oler.',
        'Lleva premios para premiar la calma ante lo que le inquieta.',
        'Paseo de 30-45 minutos.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga y premios',
      exito: 'Pasea igual de tranquilo con otra persona.',
      siNo: 'Si con otra persona está más nervioso, id juntos un par de días antes de que salga solo con ella.'
    },
    35: {
      objetivo: 'Contar ladridos frente al día 1 confirma si el trabajo en familia está dando resultado.',
      pasos: [
        'Diario completo de hoy, apuntado por todos los de casa.',
        'Compara con el día 1, el día 14 y el día 28.',
        'Pregunta a cada persona qué le ha costado más.',
        'Decide qué ayuda (persiana, radio) podríais empezar a retirar.'
      ],
      tiempo: 'Todo el día + 15 minutos de repaso',
      material: 'Tu diario',
      exito: 'Los ladridos han bajado claramente y todos responden igual.',
      siNo: 'Si alguien sigue respondiendo al ladrido, repasad las reglas juntos. La constancia es lo que más cuenta.'
    },
    36: {
      objetivo: 'Practicar el detonante más difícil a baja intensidad le permite avanzar sin volver a ensayar el ladrido.',
      pasos: [
        'Mira tu nota del día 21 y elige ese detonante.',
        'Empieza a una intensidad más baja de lo que crees necesario.',
        'Sonido o estímulo = 2-3 premios. 8 repeticiones con pausas.',
        'Sube un paso solo si las 3 últimas fueron tranquilas.'
      ],
      tiempo: '5 minutos, 2 veces',
      material: 'Grabación del detonante, premios',
      exito: '{n} tolera ese detonante un poco más que la semana 3.',
      siNo: 'Si sigue costándole mucho, quédate en ese nivel varios días. Si ves miedo intenso, consulta con un profesional cualificado.'
    },
    37: {
      objetivo: 'Retirar una ayuda poco a poco comprueba si {n} ya puede gestionar esa situación por sí mismo.',
      pasos: [
        'Elige una ayuda que quitaste (persiana, radio, timbre cambiado).',
        'Retírala en un momento tranquilo y quédate cerca.',
        'Premia el silencio y usa "gracias" y la llamada si ladra.',
        'Empieza con 15-30 minutos y amplía si va bien.'
      ],
      tiempo: '30 minutos',
      material: 'Premios',
      exito: '{n} se mantiene tranquilo sin la ayuda o ladra muy poco.',
      siNo: 'Si vuelve a ladrar mucho, recupera la ayuda unos días y retírala de forma más gradual.'
    },
    38: {
      objetivo: 'Una rutina estable de paseo, olfato y juego es lo que mantiene los avances a largo plazo.',
      pasos: [
        'Escribe la rutina diaria de {n}: horas de paseo, comida y juego.',
        'Comprueba que haya al menos 1 paseo de olfato al día.',
        'Añade 10 minutos de juego de cabeza diario si falta.',
        'Reparte las tareas entre la familia.'
      ],
      tiempo: '15 minutos',
      material: 'Papel o calendario',
      exito: 'Tienes una rutina escrita y realista que todos pueden seguir.',
      siNo: 'Si no os da la vida, prioriza el paseo de olfato y un juguete rellenable al día.'
    },
    39: {
      objetivo: 'Una segunda visita confirma que la rutina de la cama ya forma parte de su día a día.',
      pasos: [
        'Prepara el juguete rellenable y premios antes de la visita.',
        'Al timbre, "a tu sitio" y premios en la cama.',
        'Esta vez, prueba a que lo haga con un premio menos o desde más lejos.',
        'Premia la calma durante la visita de vez en cuando.'
      ],
      tiempo: '20-30 minutos',
      material: 'Juguete rellenable, premios',
      exito: '{n} va a su cama con menos ayuda que en la primera visita.',
      siNo: 'Si le cuesta más, vuelve a la rutina completa de la primera visita. Cada perro tiene su ritmo.'
    },
    40: {
      objetivo: 'Premiar el silencio de vez en cuando, siempre, evita que el ladrido vuelva con el tiempo.',
      pasos: [
        'Deja algún bote de premios a mano de forma permanente.',
        'Premia la calma ante ruidos o vistas varias veces a la semana.',
        'Usa también la voz, caricias o un juego como premio.',
        'Ante situaciones nuevas, vuelve a premiar siempre unos días.'
      ],
      tiempo: 'Repartido en el día',
      material: 'Premios',
      exito: '{n} sigue tranquilo aunque los premios sean ocasionales.',
      siNo: 'Si notas un repunte, vuelve a premiar más a menudo una semana. Es normal y se recupera rápido.'
    },
    41: {
      objetivo: 'Mantener el paseo de olfato como costumbre fija protege todo lo conseguido.',
      pasos: [
        'Haz el paseo largo de olfato de siempre.',
        'Observa cómo reacciona ahora ante lo que antes le hacía ladrar.',
        'Premia la calma con naturalidad.',
        'Paseo de 30-45 minutos.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga y premios',
      exito: 'Pasea con más calma que hace 6 semanas.',
      siNo: 'Si en la calle sigue ladrando mucho a perros o personas, valora trabajarlo con un profesional cualificado.'
    },
    42: {
      objetivo: 'Cerrar con un diario final te muestra el camino recorrido y lo que conviene seguir practicando.',
      pasos: [
        'Haz el diario completo de hoy: hora, motivo y duración.',
        'Compáralo con el día 1: episodios, duración y detonantes.',
        'Apunta 2 hábitos que mantendréis siempre.',
        'Rellena la encuesta final del programa.'
      ],
      tiempo: 'Todo el día + 15 minutos de repaso',
      material: 'Tu diario',
      exito: 'Ves una diferencia clara con el día 1 y sabes cómo mantenerla.',
      siNo: 'Si queda algún detonante difícil, sigue con su ejercicio unas semanas más. Si el ladrido cambia de repente, consulta al veterinario.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_PROGRAMAS = root.DETALLE_PROGRAMAS || {}; root.DETALLE_PROGRAMAS.ladridos = api; }
})(this);
