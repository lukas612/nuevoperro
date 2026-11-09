/* Detalle de las tareas del programa «solo» (días 1-42). {n} = nombre del perro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    1: { meta: 'Sabréis cuánto aguanta {n} tranquilo y tendréis lista su zona segura y las primeras señales de salida sin valor.' },
    2: { meta: '{n} aprenderá que te vas y vuelves enseguida, con ausencias de segundos a 2 minutos siempre por debajo de su límite.' },
    3: { meta: 'Pasaréis de 5 a 10 minutos sin agobio y {n} dejará de reaccionar a las llaves y el abrigo.' },
    4: { meta: 'Las ausencias se convierten en salidas reales de 15 a 30 minutos, a distintas horas del día.' },
    5: { meta: 'Os acercáis a tu rutina diaria y llegáis a la hora con {n} descansando, no esperando en la puerta.' },
    6: { meta: 'Consolidaréis hasta 2 horas, sabréis el tiempo máximo cómodo de {n} y tendréis un plan para seguir.' }
  };
  var DETALLE = {
    1: {
      objetivo: 'Medir su límite real te da el punto de partida: todo el plan se basa en no superarlo.',
      pasos: [
        'Coloca el móvil grabando con vista a la puerta y a su zona, con sonido.',
        'Sal con normalidad, sin despedirte, y quédate fuera 5 minutos exactos.',
        'Si oyes llanto intenso o golpes, vuelve antes: no hace falta llegar a 5 minutos.',
        'Al volver, mira el vídeo y apunta el segundo en que aparece el primer signo de agobio.'
      ],
      tiempo: '10 minutos',
      material: 'Móvil para grabar y libreta',
      exito: 'Tienes apuntado un número: los segundos o minutos que {n} pasa tranquilo antes de jadear, gemir, rascar la puerta o caminar sin parar.',
      siNo: 'Si se agobia en cuanto cierras, su límite es casi cero y empezaréis desde ahí. Si es muy intenso (se hace daño, aúlla sin parar), habla con tu veterinario y un educador.'
    },
    2: {
      objetivo: 'Una zona segura y agradable reduce riesgos y le da un sitio asociado a descanso, no a encierro.',
      pasos: [
        'Elige una habitación o rincón tranquilo, lejos de la puerta de entrada si es posible.',
        'Pon su cama, agua y una prenda tuya usada; retira cables, cojines y objetos que pueda romper.',
        'Prepara 2-3 juguetes rellenables con comida húmeda y congélalos para mañana.',
        'Durante el día, deja premios escondidos en esa zona 3-4 veces para que la visite por gusto.'
      ],
      tiempo: '20 minutos',
      material: 'Cama, agua, juguete rellenable, puerta o barrera',
      exito: '{n} entra en su zona por iniciativa propia y se tumba en ella aunque tú estés en otra habitación.',
      siNo: 'Si se niega a quedarse o rasca la barrera, deja la puerta abierta unos días y sigue sembrando premios. Nunca le encierres a la fuerza.'
    },
    3: {
      objetivo: 'Las llaves anuncian que te vas y disparan su ansiedad; repetirlas sin salir les quita ese significado.',
      pasos: [
        'Coge las llaves como si fueras a salir, haciéndolas sonar un poco.',
        'Siéntate en el sofá 1-2 minutos con ellas y luego déjalas en su sitio, sin mirarle.',
        'Repite 10 veces a lo largo del día, separadas al menos 20 minutos.',
        'Apunta cómo reacciona en la 1.ª y en la 10.ª repetición.'
      ],
      tiempo: '1 minuto, 10 veces',
      material: 'Llaves',
      exito: 'Hacia la última repetición {n} apenas levanta la cabeza o sigue tumbado cuando suenan las llaves.',
      siNo: 'Si se levanta y te sigue cada vez, hazlo más suave: tocar las llaves sin cogerlas. Ve subiendo cuando ya no reaccione.'
    },
    4: {
      objetivo: 'Si el juguete rellenable solo aparece cuando te alejas, tu marcha empieza a anunciar algo bueno.',
      pasos: [
        'Dale el juguete rellenable en su zona y sal de la habitación con naturalidad.',
        'Quédate fuera 30-60 segundos mientras come y vuelve sin decir nada.',
        'Repite 3-4 veces en el día, alargando a 2-3 minutos si sigue comiendo tranquilo.',
        'Al terminar la práctica, retira el juguete: solo existe cuando tú te vas.'
      ],
      tiempo: '10 minutos',
      material: 'Juguete rellenable',
      exito: '{n} sigue lamiendo el juguete cuando sales y no deja la comida para ir a buscarte.',
      siNo: 'Si abandona el juguete para seguirte, quédate visible (en la puerta) y aléjate solo unos pasos. Si no come nada al quedarse solo, la ausencia es demasiado larga.'
    },
    5: {
      objetivo: 'Practicar puertas cerradas contigo en casa le enseña que una puerta no significa que desaparezcas.',
      pasos: [
        'Con {n} en su zona y algo para masticar, sal y cierra la puerta 3 segundos.',
        'Abre, vuelve sin saludar y repite subiendo a 5, 8 y 10 segundos.',
        'Haz 10 repeticiones mezclando tiempos cortos y largos, no siempre subiendo.',
        'Prueba también con la puerta del baño y otras de casa.'
      ],
      tiempo: '5 minutos',
      material: 'Algo para masticar',
      exito: '{n} se queda tumbado o masticando y no rasca ni gime al otro lado de la puerta.',
      siNo: 'Si rasca o gime, vuelve a 2-3 segundos o deja la puerta entornada. Abre solo cuando lleve un instante en silencio, sin esperar a que se desespere.'
    },
    6: {
      objetivo: 'Olfatear cansa la mente y relaja; un perro satisfecho afronta mucho mejor el rato a solas.',
      pasos: [
        'Sal 40-60 minutos con correa larga a un lugar tranquilo, sin prisa.',
        'Déjale olfatear todo lo que quiera; tú solo acompañas.',
        'Al volver a casa, dale agua y 10 minutos de calma antes de tu ausencia.',
        'Haz tu ausencia más larga del día después de este paseo.'
      ],
      tiempo: '45-60 minutos',
      material: 'Correa larga',
      exito: 'Al volver, {n} bebe, se tumba por su cuenta y su respiración es lenta.',
      siNo: 'Si vuelve más excitado que antes (tirones, perros, ruido), elige otra zona u hora más tranquila. Buscamos calma, no agotamiento.'
    },
    7: {
      objetivo: 'Comparar con el día 1 te muestra si vais en buena dirección y fija el punto de partida de la semana 2.',
      pasos: [
        'Repite el día 1: misma hora aproximada, mismo lugar del móvil y 5 minutos fuera.',
        'Haz antes un paseo tranquilo y deja el juguete rellenable en su zona.',
        'Mira el vídeo y apunta el segundo del primer signo de agobio.',
        'Compáralo con el día 1 y apunta su nuevo límite.'
      ],
      tiempo: '15 minutos',
      material: 'Móvil para grabar',
      exito: 'El primer signo de agobio aparece más tarde que el día 1 o es más leve (un gemido corto en lugar de llanto continuo).',
      siNo: 'Si no ha cambiado, es normal en la primera semana. Mantén ausencias muy por debajo de su límite y repite la semana 1 si hace falta.'
    },
    8: {
      objetivo: 'Ausencias de segundos, siempre exitosas, le enseñan que siempre vuelves antes de que lo pase mal.',
      pasos: [
        'Dale algo para masticar, sal por la puerta de la calle y ciérrala.',
        'Espera 30 segundos fuera y entra sin saludar.',
        'Espera 2-3 minutos dentro antes de la siguiente salida.',
        'Haz 5 repeticiones; si su límite es menor de 30 segundos, usa 10-15.'
      ],
      tiempo: '15 minutos',
      material: 'Móvil para grabar',
      exito: 'En el vídeo, {n} no se queda pegado a la puerta y sigue con lo suyo durante los 30 segundos.',
      siNo: 'Si gime o rasca, la ausencia es larga para él: baja a 5-10 segundos y sube de 5 en 5 solo cuando haya 3 seguidas en calma.'
    },
    9: {
      objetivo: 'El abrigo es otra señal fuerte de salida; repetirlo sin irte reduce la anticipación.',
      pasos: [
        'Ponte el abrigo, da unos pasos por casa y quítatelo en 30-60 segundos.',
        'No le mires ni le hables mientras lo haces.',
        'Repite 10 veces a lo largo del día.',
        'Combina a veces con zapatos o bolso, la señal que más le active.'
      ],
      tiempo: '1 minuto, 10 veces',
      material: 'Abrigo, zapatos, bolso',
      exito: '{n} se queda tumbado o solo mira un momento y vuelve a descansar cuando te pones el abrigo.',
      siNo: 'Si se pone a jadear o te sigue, descompón la señal: solo coge el abrigo y déjalo. Añade ponértelo cuando lo primero ya no le active.'
    },
    10: {
      objetivo: 'Subir solo cuando el paso anterior sale bien es la clave del método: cada éxito le da confianza.',
      pasos: [
        'Haz 2 ausencias de 30 segundos para empezar en calma.',
        'Sal 1 minuto con el juguete rellenable y graba.',
        'Mezcla: 1 minuto, 20 segundos, 1 minuto, 40 segundos, 1 minuto.',
        'Deja 3 minutos entre ausencias y termina con una corta.'
      ],
      tiempo: '15 minutos',
      material: 'Juguete rellenable, móvil',
      exito: 'En las 3 ausencias de 1 minuto, {n} sigue con el juguete o tumbado, sin ir y venir a la puerta.',
      siNo: 'Si el minuto le cuesta, quédate hoy en 45 segundos. Pasar más días en un nivel no es retroceder.'
    },
    11: {
      objetivo: 'Las llegadas emocionantes aumentan la tensión de esperar; volver con calma hace que la ausencia sea poca cosa.',
      pasos: [
        'Al entrar, deja tus cosas y sigue con lo tuyo sin mirarle durante 1 minuto.',
        'No le riñas ni le apartes si salta; simplemente gírate con calma.',
        'Cuando tenga las cuatro patas en el suelo y se relaje, salúdale suave unos segundos.',
        'Después sácale a hacer pis si lo necesita, sin prisa.'
      ],
      tiempo: '2 minutos por llegada',
      material: '',
      exito: 'Cada día {n} se calma antes al llegar tú y te recibe con menos saltos y lloros.',
      siNo: 'Si se desborda, lanza unos premios al suelo para que olfatee y se baje de vueltas. Saludas en cuanto esté más tranquilo.'
    },
    12: {
      objetivo: 'Dos minutos son un salto relativo grande; el juguete le ayuda a pasar ese rato ocupado y en calma.',
      pasos: [
        'Calienta con 2 ausencias de 30 segundos y 1 de 1 minuto.',
        'Dale el juguete rellenable congelado y sal 2 minutos. Graba.',
        'Haz 3 ausencias de 2 minutos con alguna más corta entre medias.',
        'Retira el juguete cuando acabes la sesión.'
      ],
      tiempo: '20 minutos',
      material: 'Juguete rellenable congelado, móvil',
      exito: 'En el vídeo, {n} come o se tumba, y no ladra ni rasca la puerta en los 2 minutos.',
      siNo: 'Si se agobia al acabar la comida, haz el relleno más duradero o vuelve a 1 minuto y medio unos días.'
    },
    13: {
      objetivo: 'Mantener el paseo de olfato como rutina baja su nivel general de estrés y mejora el descanso.',
      pasos: [
        'Paseo de 40-60 minutos con correa larga, a su ritmo.',
        'Esparce un puñado de pienso en el césped para que lo busque 5 minutos.',
        'Al volver, 10 minutos de calma en casa antes de la ausencia del día.'
      ],
      tiempo: '45-60 minutos',
      material: 'Correa larga, pienso',
      exito: 'Tras el paseo, {n} se tumba pronto y duerme o descansa más rato de lo habitual.',
      siNo: 'Si la calle le estresa, busca horas con menos gente o un parque más tranquilo. Un paseo corto y relajado vale más que uno largo y tenso.'
    },
    14: {
      objetivo: 'Grabar al final de la semana confirma que 2 minutos son cómodos antes de subir más.',
      pasos: [
        'Haz un paseo tranquilo y unos minutos de calma antes.',
        'Deja el juguete y sal 2 minutos grabando.',
        'Revisa el vídeo: postura, respiración, si mira la puerta o descansa.',
        'Apunta el resultado y el número de días que lleva en calma a 2 minutos.'
      ],
      tiempo: '10 minutos',
      material: 'Móvil para grabar',
      exito: '{n} come o se tumba, con cuerpo suelto y sin vigilar la puerta durante los 2 minutos.',
      siNo: 'Si hay agobio, no pases a la semana 3: repite la semana 2 con ausencias de 1 minuto hasta tener varios días buenos.'
    },
    15: {
      objetivo: 'Cinco minutos son la primera ausencia que se parece a una salida real; el vídeo te dice si está preparado.',
      pasos: [
        'Calienta con 2 ausencias de 1 y 2 minutos.',
        'Dale el juguete y sal 5 minutos grabando.',
        'Vuelve sin saludar y espera 5 minutos antes de otra ausencia más corta.',
        'Revisa el vídeo: si estuvo en calma, mañana repite 5 minutos 2 veces.'
      ],
      tiempo: '20 minutos',
      material: 'Juguete rellenable, móvil',
      exito: 'En el vídeo, {n} come, olfatea y acaba tumbado, sin gemir ni rascar la puerta.',
      siNo: 'Si se agobia hacia el minuto 3, quédate en 3 minutos unos días y sube de minuto en minuto.'
    },
    16: {
      objetivo: 'Mezclar señales de salida con salidas cortas o sin salida rompe la cadena que anticipa tu marcha.',
      pasos: [
        'Coge llaves y abrigo y sal 1 minuto; vuelve sin saludar.',
        'Una hora después, coge llaves y abrigo y siéntate 2 minutos sin salir.',
        'Alterna así 6-8 veces en el día, sin un orden fijo.',
        'Algunas veces sal sin coger nada.'
      ],
      tiempo: '1-2 minutos, 6-8 veces',
      material: 'Llaves, abrigo',
      exito: '{n} ya no se levanta ni te sigue a la puerta al verte con llaves y abrigo.',
      siNo: 'Si sigue reaccionando, haz más repeticiones de señales sin salir (unas 15 al día) antes de combinarlas con salidas.'
    },
    17: {
      objetivo: 'Llegar a 10 minutos le da margen para la vida diaria, siempre que los 5 hayan salido tranquilos.',
      pasos: [
        'Comprueba que ayer hubo 2 ausencias de 5 minutos en calma.',
        'Calienta con una de 2 minutos.',
        'Deja el juguete y sal 10 minutos grabando.',
        'Si va bien, haz después una corta de 3 minutos para terminar.'
      ],
      tiempo: '25 minutos',
      material: 'Juguete rellenable, móvil',
      exito: 'En el vídeo, {n} pasa la mayor parte de los 10 minutos tumbado o descansando.',
      siNo: 'Si a los 7 minutos empieza a inquietarse, practica 7 minutos unos días. Sube de 1-2 minutos cada vez, no de golpe.'
    },
    18: {
      objetivo: 'Llegar a la ausencia ya relajado hace que el punto de partida sea calma, no excitación.',
      pasos: [
        'Haz 5 minutos de búsqueda de premios por casa o en la calle.',
        'Siéntate 5 minutos en el sofá con él cerca, acariciando despacio si le gusta.',
        'Cuando esté tumbado y relajado, levántate sin ceremonia y sal.',
        'Haz la ausencia del día con el juguete.'
      ],
      tiempo: '15 minutos',
      material: 'Premios, juguete rellenable',
      exito: '{n} está tumbado o adormilado cuando sales y sigue así en el vídeo.',
      siNo: 'Si se pone nervioso al ver que te levantas, practica levantarte y volver a sentarte varias veces antes de salir.'
    },
    19: {
      objetivo: 'Alternar días fáciles y difíciles evita que la tensión se acumule y protege lo aprendido.',
      pasos: [
        'Haz hoy ausencias de la mitad del tiempo de ayer (por ejemplo, 5 minutos en vez de 10).',
        'Haz 2-3 repeticiones, con el juguete.',
        'Termina con una ausencia muy corta de 1 minuto.'
      ],
      tiempo: '15 minutos',
      material: 'Juguete rellenable',
      exito: '{n} lo lleva con total calma: se queda descansando y casi no nota que has salido.',
      siNo: 'Si hasta las cortas le cuestan, puede que estés subiendo rápido. Quédate 2-3 días en el último nivel que salió bien.'
    },
    20: {
      objetivo: 'El olfato regula su estado de ánimo; mantenerlo cada semana sostiene todo el progreso.',
      pasos: [
        'Paseo de 45-60 minutos por un sitio nuevo y tranquilo.',
        'Deja que elija el camino durante 10 minutos.',
        'Al llegar, ofrécele una alfombra olfativa o un juguete para lamer 5 minutos.'
      ],
      tiempo: '45-60 minutos',
      material: 'Correa larga, alfombra olfativa',
      exito: 'Vuelve relajado, se tumba por su cuenta y no busca llamar tu atención.',
      siNo: 'Si el sitio nuevo le pone nervioso, vuelve a uno conocido. La novedad debe sumar interés, no estrés.'
    },
    21: {
      objetivo: 'Saber cuándo aparece el primer signo de agobio te dice el límite real para la semana 4.',
      pasos: [
        'Prepara la salida como siempre: paseo, calma y juguete.',
        'Sal 10 minutos grabando.',
        'Revisa el vídeo entero y anota el minuto de cualquier gemido, jadeo o vigilancia de la puerta.',
        'Tu límite de trabajo será un 20-30% menos que ese momento.'
      ],
      tiempo: '20 minutos',
      material: 'Móvil para grabar',
      exito: 'No aparece ningún signo de agobio en los 10 minutos, o solo un breve vistazo a la puerta y vuelve a tumbarse.',
      siNo: 'Si aparece antes del minuto 5, repite la semana 3 con ausencias de 3-5 minutos. Hay perros que necesitan más tiempo y es normal.'
    },
    22: {
      objetivo: 'Usar la ausencia para un recado real hace que el entrenamiento encaje en tu vida diaria.',
      pasos: [
        'Calienta con una ausencia de 5 minutos.',
        'Deja el juguete, deja el móvil grabando y sal 15 minutos a tirar la basura o comprar el pan.',
        'Vuelve sin saludar y revisa el vídeo esa misma tarde.'
      ],
      tiempo: '25 minutos',
      material: 'Juguete rellenable, móvil',
      exito: 'En el vídeo, {n} come, explora un poco y acaba descansando.',
      siNo: 'Si se agobia hacia el minuto 12, practica 10-12 minutos unos días más. Puedes seguir haciendo recados más cortos.'
    },
    23: {
      objetivo: 'Si solo practicas a la misma hora, puede aprender que solo esa salida es segura; variar generaliza.',
      pasos: [
        'Haz hoy 3 ausencias cómodas (5-10 minutos) a horas distintas: mañana, tarde y noche.',
        'Usa el juguete en al menos una de ellas.',
        'Graba al menos la de la hora menos habitual.'
      ],
      tiempo: '3 ausencias en el día',
      material: 'Juguete rellenable, móvil',
      exito: '{n} se queda en calma igual a cualquier hora, no solo a la hora habitual.',
      siNo: 'Si a alguna hora le cuesta más (por ejemplo, de noche), baja el tiempo en esa franja y practícala más a menudo.'
    },
    24: {
      objetivo: 'Subir a 20 minutos le acerca a ausencias útiles en la vida real sin pasar su límite.',
      pasos: [
        'Comprueba que los 15 minutos han salido bien al menos 2 veces.',
        'Calienta con 5 minutos y deja el juguete.',
        'Sal 20 minutos grabando.',
        'Revisa el vídeo: mira sobre todo los primeros 5 y los últimos 5 minutos.'
      ],
      tiempo: '30 minutos',
      material: 'Juguete rellenable, móvil',
      exito: 'En el vídeo, {n} pasa la mayor parte del tiempo tumbado o dormido.',
      siNo: 'Si al final se inquieta, sube de 15 a 17-18 minutos primero. Los saltos de 5 minutos pueden ser grandes para algunos perros.'
    },
    25: {
      objetivo: 'Comprobar sin juguete te dice si está tranquilo de verdad o solo distraído mientras come.',
      pasos: [
        'Elige una ausencia muy cómoda: la mitad de su máximo (por ejemplo, 5-10 minutos).',
        'Sal sin darle el juguete rellenable, con el móvil grabando.',
        'Revisa el vídeo y compáralo con una ausencia con juguete.'
      ],
      tiempo: '15 minutos',
      material: 'Móvil para grabar',
      exito: '{n} explora un poco y luego se tumba, igual que cuando tiene el juguete.',
      siNo: 'Si sin juguete se agobia, sigue usándolo por ahora y prueba sin él con ausencias de 2-3 minutos. No pasa nada por usarlo siempre.'
    },
    26: {
      objetivo: 'Media hora permite ya la mayoría de recados cortos y es un gran hito para {n}.',
      pasos: [
        'Asegúrate de haber tenido 2 ausencias buenas de 20 minutos.',
        'Paseo de olfato antes y 5 minutos de calma.',
        'Dale el juguete y sal 30 minutos grabando.',
        'Revisa el vídeo a saltos: minutos 0-5, 15 y 25-30.'
      ],
      tiempo: '40 minutos',
      material: 'Juguete rellenable, móvil',
      exito: '{n} está dormido o tumbado en los trozos de vídeo que revisas.',
      siNo: 'Si se agobia en la segunda mitad, practica 20-25 minutos unos días más antes de volver a intentar los 30.'
    },
    27: {
      objetivo: 'Con ausencias más largas, el paseo previo cobra aún más importancia para que descanse mientras no estás.',
      pasos: [
        'Paseo de 60 minutos con mucho olfateo y algún juego tranquilo.',
        'Incluye 5 minutos de buscar premios esparcidos.',
        'Haz la ausencia del día 30-60 minutos después de volver, ya tranquilo.'
      ],
      tiempo: '60 minutos',
      material: 'Correa larga, premios',
      exito: 'Durante la ausencia, {n} duerme la mayor parte del tiempo.',
      siNo: 'Si está más activo tras el paseo, alarga el rato de calma en casa antes de salir. Evita juegos de persecución justo antes.'
    },
    28: {
      objetivo: 'Grabar la ausencia más larga te confirma si estáis listos para pasar a la semana 5.',
      pasos: [
        'Prepara la salida como siempre y graba la ausencia más larga de la semana.',
        'Revisa el vídeo a saltos y anota en qué momentos está tumbado y en cuáles activo.',
        'Apunta su tiempo cómodo actual: el más largo sin signos de agobio.'
      ],
      tiempo: '40 minutos',
      material: 'Móvil para grabar',
      exito: 'En la mayor parte del vídeo, {n} está tumbado con el cuerpo relajado.',
      siNo: 'Si aparecen signos de agobio, quédate en un tiempo un 30% más corto y repite la semana 4 antes de subir.'
    },
    29: {
      objetivo: 'Pasar de 30 a 45 minutos acerca el entrenamiento a las salidas reales del día a día.',
      pasos: [
        'Comprueba que 30 minutos han salido bien al menos 2 veces.',
        'Dale el juguete y sal 45 minutos grabando.',
        'Revisa trozos del vídeo: inicio, mitad y final.'
      ],
      tiempo: '50 minutos',
      material: 'Juguete rellenable, móvil',
      exito: '{n} descansa en su zona la mayor parte del tiempo y no vigila la puerta al final.',
      siNo: 'Si se inquieta hacia el final, sube primero a 35-40 minutos. Lo importante es que la ausencia termine en calma.'
    },
    30: {
      objetivo: 'Tu rutina real de trabajo es la señal más potente; practicarla con salidas cortas le quita poder.',
      pasos: [
        'Haz tu rutina completa: ducha, desayuno, ropa, bolso, llaves.',
        'Sal 20 minutos (por debajo de su máximo cómodo) y graba.',
        'Repite otro día con la rutina completa y una salida de solo 5 minutos.'
      ],
      tiempo: '30 minutos',
      material: 'Móvil para grabar',
      exito: '{n} no se pone nervioso durante tu rutina y en el vídeo descansa como en las ausencias de práctica.',
      siNo: 'Si la rutina le activa, practica partes sueltas (ducha, ropa de trabajo) sin salir, varias veces en días libres.'
    },
    31: {
      objetivo: 'Llegar a la hora es un paso clave: muchas salidas reales duran eso o un poco más.',
      pasos: [
        'Comprueba que 45 minutos han salido bien al menos 2 veces.',
        'Paseo de olfato antes, calma y juguete.',
        'Sal 1 hora grabando y vuelve sin saludar.'
      ],
      tiempo: '1 hora',
      material: 'Juguete rellenable, móvil',
      exito: 'A la vuelta, {n} está tranquilo y en el vídeo se le ve dormir buena parte de la hora.',
      siNo: 'Si se agobia, vuelve a 45 minutos y sube de 5 en 5. Algunos perros necesitan semanas en este tramo y está bien.'
    },
    32: {
      objetivo: 'No superar su límite mientras aprende evita recaídas; los días largos necesitan un plan.',
      pasos: [
        'Revisa tu semana y marca los días en que estarás fuera más de su tiempo cómodo.',
        'Organiza para esos días: familiar, vecino, paseador o guardería de día.',
        'Haz que la persona le visite antes con calma, para que {n} la conozca.',
        'Deja escrito: hora del paseo, juguete y cómo saludarle con calma.'
      ],
      tiempo: '20 minutos',
      material: 'Agenda, teléfono',
      exito: 'Tienes cubiertos todos los días de la semana en los que {n} estaría solo más de lo que aguanta.',
      siNo: 'Si no puedes cubrir algún día, divide la ausencia (vuelve a mediodía) o llévale contigo si es posible.'
    },
    33: {
      objetivo: 'Repetir algo que sale bien refuerza la confianza y le da un día fácil entre subidas.',
      pasos: [
        'Mira tus notas y elige la ausencia que mejor salió esta semana.',
        'Repítela igual: misma preparación, juguete y duración.',
        'Graba y compara con la vez anterior.'
      ],
      tiempo: '45-60 minutos',
      material: 'Móvil para grabar',
      exito: '{n} está igual de tranquilo o más que la primera vez.',
      siNo: 'Si hoy le cuesta más, puede haber algo distinto (ruidos, visitas, calor). Anótalo y reduce un poco el tiempo mañana.'
    },
    34: {
      objetivo: 'El paseo de olfato sigue siendo su mejor preparación para estar solo más tiempo.',
      pasos: [
        'Paseo de 60 minutos con olfateo libre.',
        'Prueba un juego de olfato nuevo en casa: esconder premios en cajas.',
        'Deja que descanse al volver antes de cualquier ausencia.'
      ],
      tiempo: '60 minutos',
      material: 'Correa larga, cajas, premios',
      exito: '{n} busca con interés y luego descansa profundamente.',
      siNo: 'Si le frustra el juego nuevo, ponlo más fácil (premios a la vista) y haz que gane siempre.'
    },
    35: {
      objetivo: 'Comprobar si descansa durante una hora indica que se siente seguro, no solo que aguanta.',
      pasos: [
        'Sal 1 hora con el móvil grabando.',
        'Revisa trozos de 2 minutos al inicio, al minuto 20, al 40 y al final.',
        'Anota si duerme, descansa con ojos abiertos o está activo.'
      ],
      tiempo: '1 hora y 15 minutos',
      material: 'Móvil para grabar',
      exito: 'En la mayoría de trozos, {n} está tumbado o dormido, con el cuerpo relajado.',
      siNo: 'Si está activo y vigilando, aún no está listo para más: vuelve a 30-45 minutos unos días más.'
    },
    36: {
      objetivo: 'Noventa minutos permiten una comida fuera o una compra grande; se sube solo si la hora fue tranquila.',
      pasos: [
        'Comprueba que la hora salió bien al menos 2-3 veces.',
        'Paseo, calma, juguete y sal 90 minutos grabando.',
        'Revisa el vídeo a saltos: inicio, mitad y final.'
      ],
      tiempo: '1 hora y 30 minutos',
      material: 'Juguete rellenable, móvil',
      exito: '{n} duerme la mayor parte del tiempo y te recibe tranquilo.',
      siNo: 'Si se inquieta en el último tramo, quédate en 70-75 minutos unos días y sube despacio.'
    },
    37: {
      objetivo: 'Si siempre sigues el mismo ritual, el ritual se vuelve imprescindible; quitarlo hace que cualquier salida sea normal.',
      pasos: [
        'Hoy sal sin paseo previo ni juguete, sin el ritual habitual.',
        'Haz una ausencia corta y cómoda: 10-15 minutos.',
        'Graba y comprueba cómo lo lleva.'
      ],
      tiempo: '20 minutos',
      material: 'Móvil para grabar',
      exito: '{n} se queda tranquilo aunque no haya habido preparación.',
      siNo: 'Si le cuesta, mantén el ritual en las ausencias largas y practica salidas sin ritual solo de 2-5 minutos.'
    },
    38: {
      objetivo: 'Dos horas cubren buena parte de la vida diaria; llegar ahí poco a poco consolida el aprendizaje.',
      pasos: [
        'Comprueba que los 90 minutos han salido bien al menos 2 veces.',
        'Prepara la zona segura, el juguete y un paseo de olfato antes.',
        'Sal 2 horas grabando y revisa trozos del vídeo.'
      ],
      tiempo: '2 horas',
      material: 'Juguete rellenable, zona segura, móvil',
      exito: 'En el vídeo, {n} duerme la mayor parte del tiempo y no hay llanto ni destrozos.',
      siNo: 'Si se agobia, vuelve a 90 minutos varios días. Si el agobio es intenso o no mejora, consulta con tu veterinario y un educador.'
    },
    39: {
      objetivo: 'Con el paso de las semanas es fácil volver a las fiestas al llegar; mantener la calma protege lo conseguido.',
      pasos: [
        'Observa tus 3 próximas llegadas: ¿cuánto tarda en calmarse?',
        'Si salta o llora, espera con calma y saluda cuando tenga las patas en el suelo.',
        'Pide a todos en casa que hagan lo mismo al llegar.'
      ],
      tiempo: '2 minutos por llegada',
      material: '',
      exito: '{n} te recibe moviendo la cola y se calma en menos de 1 minuto.',
      siNo: 'Si alguien de casa hace fiesta al llegar, explícale por qué y practicad juntos. Si se excita mucho, lanza premios al suelo para que olfatee.'
    },
    40: {
      objetivo: 'Conocer su tiempo máximo cómodo evita recaídas: subir de golpe puede deshacer semanas de trabajo.',
      pasos: [
        'Revisa tus notas y apunta el tiempo más largo en calma de las últimas 2 semanas.',
        'Escribe un plan: subir 10-15 minutos por semana, solo si los vídeos van bien.',
        'Anota a quién llamar si un día tienes que estar fuera más tiempo.'
      ],
      tiempo: '15 minutos',
      material: 'Libreta',
      exito: 'Tienes escrito su tiempo máximo cómodo y un plan realista para las próximas semanas.',
      siNo: 'Si su máximo aún está lejos de tus necesidades, sigue con ayuda en días largos y consulta con un educador para ajustar el plan.'
    },
    41: {
      objetivo: 'El paseo de olfato no es solo para este plan: mantenerlo cada día es parte de su bienestar.',
      pasos: [
        'Paseo de 60 minutos con olfateo libre.',
        'Piensa qué días y horas podéis mantenerlo a partir de ahora.',
        'Planifica al menos 3 paseos largos de olfato a la semana.'
      ],
      tiempo: '60 minutos',
      material: 'Correa larga',
      exito: '{n} disfruta del paseo y llega a casa relajado y listo para descansar.',
      siNo: 'Si te falta tiempo entre semana, prueba paseos de 20 minutos con mucho olfato y deja los largos para el fin de semana.'
    },
    42: {
      objetivo: 'Comparar el primer y el último vídeo te muestra todo lo que habéis avanzado y lo que queda por hacer.',
      pasos: [
        'Busca el vídeo del día 1 y mira los primeros minutos.',
        'Mira el vídeo más reciente y anota las diferencias en postura, ruido y descanso.',
        'Apunta su tiempo máximo cómodo de entonces y de ahora.',
        'Rellena la encuesta final para contarnos cómo os ha ido.'
      ],
      tiempo: '20 minutos',
      material: 'Vídeos del día 1 y de hoy',
      exito: 'Ves una diferencia clara: {n} se queda tranquilo mucho más tiempo que el primer día.',
      siNo: 'Si el avance es pequeño, no es un fracaso: algunos perros necesitan más tiempo. Sigue con ausencias cortas y busca un educador cualificado.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_PROGRAMAS = root.DETALLE_PROGRAMAS || {}; root.DETALLE_PROGRAMAS.solo = api; }
})(this);
