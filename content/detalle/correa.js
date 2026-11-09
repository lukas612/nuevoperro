/* Detalle de las tareas del programa «correa» (días 1-42). {n} = nombre del perro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    1: { meta: 'Cambiaréis el material y {n} empezará a descubrir que con la correa floja se avanza y tirando no.' },
    2: { meta: '{n} aprenderá que caminar junto a tu pierna es el sitio que más compensa, cada vez con menos premios.' },
    3: { meta: 'Encontraréis su distancia de trabajo frente a perros y personas y tendrás un plan para cuando algo le supere.' },
    4: { meta: 'Iréis reduciendo la distancia a los estímulos y practicaréis en calles con más movimiento.' },
    5: { meta: 'Llevaréis todo a tus paseos de siempre, con menos premios y con toda la familia aplicando las mismas reglas.' },
    6: { meta: 'Consolidaréis lo aprendido en las situaciones difíciles y comprobaréis cuánto habéis avanzado.' }
  };
  var DETALLE = {
    1: {
      objetivo: 'Que {n} asocie el arnés a cosas buenas evita que se agobie o se escape al ponérselo y hace que la salida empiece en calma.',
      pasos: [
        'Enséñale el arnés y dale un premio cada vez que lo huela. Repite 5 veces.',
        'Sujeta la abertura del cuello y pon un premio al otro lado para que meta la cabeza él solo.',
        'Abrocha, dale 3 premios seguidos y quítalo a los 10 segundos.',
        'Haz 3 sesiones hoy y alarga hasta 2 minutos con el arnés puesto mientras juegas o le das premios.'
      ],
      tiempo: '3 sesiones de 3 minutos',
      material: 'Arnés en Y con anilla en el pecho y premios pequeños',
      exito: '{n} se acerca o mete la cabeza en el arnés por iniciativa propia en cuanto lo ve.',
      siNo: 'Si se aparta o se queda rígido, vuelve a solo enseñar el arnés y premiar. Avanza un paso cada sesión, sin sujetarle para ponérselo.'
    },
    2: {
      objetivo: 'Si tirar nunca le hace avanzar, deja de tener sentido tirar. La regla del árbol es la base de todo el programa.',
      pasos: [
        'Sal 10 minutos por una calle tranquila con correa fija de 2 metros.',
        'En cuanto la correa se tense, párate en seco y quédate quieto, sin hablar ni tirar.',
        'Cuando afloje aunque sea 5 cm, di «bien» y avanza enseguida.',
        'Lleva la cuenta de las paradas (con una app o una moneda que pasas de bolsillo).'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa de 2 metros y contador',
      exito: '{n} empieza a aflojar la correa antes, girándose a mirarte o retrocediendo un paso cuando te paras.',
      siNo: 'Si se queda tirando sin aflojar más de 20 segundos, retrocede 2 o 3 pasos en silencio para que se gire hacia ti y premia cuando lo haga.'
    },
    3: {
      objetivo: 'Crear «su sitio» junto a tu pierna en casa, sin distracciones, hace que en la calle tenga un lugar al que volver.',
      pasos: [
        'En casa y sin correa, quédate de pie con premios en la mano izquierda.',
        'Cada vez que {n} pase o se quede junto a tu pierna izquierda, di «bien» y premia a la altura de tu rodilla.',
        'Da 1 o 2 pasos para que te siga y premia en cuanto llegue a tu lado.',
        'Reparte 20 premios en 2 sesiones de 10.'
      ],
      tiempo: '2 sesiones de 3 minutos',
      material: 'Premios pequeños y blandos',
      exito: '{n} se coloca solo a tu lado y te mira esperando el premio en cuanto te pones de pie.',
      siNo: 'Si salta a por la mano, baja el premio a su boca más rápido y mantén la mano cerrada hasta que esté en su sitio. Si prefieres el lado derecho, vale, pero sé constante.'
    },
    4: {
      objetivo: 'Combinar lo que no funciona (tirar) con lo que sí paga (ir a tu lado) acelera el aprendizaje.',
      pasos: [
        'Paseo de 10 minutos con la regla del árbol cada vez que la correa se tense.',
        'Cuando vaya a tu lado con la correa floja, premia junto a tu pierna cada 2 o 3 pasos.',
        'Tras cada parada, premia el primer paso que dé a tu lado.',
        'Cuenta las paradas y compáralas con el día 2.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa de 2 metros y premios',
      exito: 'Te paras menos veces que el día 2 y {n} vuelve a tu lado buscando el premio.',
      siNo: 'Si ignora los premios en la calle, usa algo más valioso (pollo o queso en trocitos) y sal a una hora más tranquila.'
    },
    5: {
      objetivo: 'Si la salida empieza con nervios, el paseo entero será de tirones. La calma en la puerta abre la puerta.',
      pasos: [
        'Con el arnés puesto, acerca la mano al pomo. Si se queda quieto, premia.',
        'Abre la puerta 10 cm. Si se lanza, ciérrala con suavidad y espera 5 segundos.',
        'Si se mantiene sentado o tranquilo, abre un poco más y premia.',
        'Cuando aguante con la puerta abierta 3 segundos, di «vamos» y salid juntos. Repite 5 veces.'
      ],
      tiempo: '5 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} se queda quieto o sentado mientras abres la puerta del todo sin que se lo pidas.',
      siNo: 'Si se pone muy nervioso, practica antes de ponerle la correa y sin intención de salir. Trabaja con la puerta casi cerrada hasta que esté en calma.'
    },
    6: {
      objetivo: 'Olfatear a su ritmo baja el estrés y cansa la cabeza. Es descanso del entrenamiento y parte de su bienestar.',
      pasos: [
        'Elige una zona tranquila con hierba, árboles o arbustos.',
        'Déjale marcar el ritmo y la dirección siempre que sea seguro.',
        'Espera sin prisa cuando se pare a oler, aunque sea 1 minuto en el mismo sitio.',
        'Si puedes, usa una correa larga de 3 a 5 metros en un lugar despejado.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés y correa (larga si la tienes)',
      exito: '{n} vuelve a casa relajado y huele con calma en lugar de ir de un lado a otro.',
      siNo: 'Si tira igualmente, elige un sitio con menos estímulos o a otra hora. Aplica la regla del árbol con suavidad solo si te arrastra.'
    },
    7: {
      objetivo: 'Medir el progreso te permite ver avances pequeños que en el día a día no se notan y ajustar la semana siguiente.',
      pasos: [
        'Haz el mismo recorrido que el día 2, durante 10 minutos.',
        'Cuenta las paradas y apúntalas junto a las del día 2.',
        'Graba 30 segundos del paseo con el móvil: te servirá para comparar al final.',
        'Anota también en qué momentos tensa más (salida, perros, cruces).'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios y móvil',
      exito: 'Has parado menos veces que el día 2 o {n} afloja la correa más rápido tras cada parada.',
      siNo: 'Si no hay mejora, revisa que no avances a veces con la correa tensa: la constancia es la clave. Haz paseos más cortos la próxima semana.'
    },
    8: {
      objetivo: 'Recompensar pocos pasos con éxito le enseña qué es caminar a tu lado antes de pedirle distancias largas.',
      pasos: [
        'Elige un pasillo o una calle muy tranquila.',
        'Da 3 pasos; si va a tu lado con la correa floja, premia junto a tu pierna. Repite 10 veces.',
        'Pasa a 5 pasos por premio y repite otras 10 veces.',
        'Si falla 2 veces seguidas, vuelve a 3 pasos.'
      ],
      tiempo: '5 a 10 minutos',
      material: 'Arnés, correa y premios pequeños',
      exito: '{n} completa 5 pasos a tu lado al menos 8 de cada 10 veces.',
      siNo: 'Si se adelanta antes de los 3 pasos, empieza con 1 o 2 pasos y premia más rápido. Practica en casa si la calle le distrae.'
    },
    9: {
      objetivo: 'Girar antes de que tense le enseña a estar pendiente de ti, sin conflicto ni tirones.',
      pasos: [
        'Practica primero en calma: camina, di «vamos» con voz alegre y gira 180 grados.',
        'Da 3 o 4 pasos en la nueva dirección y premia cuando te alcance a la altura de la pierna.',
        'Repite 8 veces en un tramo de 20 metros.',
        'Úsalo en el paseo cuando veas que se adelanta, antes de que la correa se tense.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} se gira contigo en cuanto oye «vamos», sin que la correa llegue a tensarse.',
      siNo: 'Si la correa se tensa al girar, estás girando tarde. Anticípate al primer signo de que se adelanta y haz el giro más amplio y despacio.'
    },
    10: {
      objetivo: 'Oler es lo que más quiere en la calle. Usarlo como premio hace que caminar bien le compense más que cualquier galleta.',
      pasos: [
        'Camina 1 minuto con la correa floja, premiando de vez en cuando.',
        'Al minuto, di «libre» y acompáñale hacia un sitio interesante para oler durante 1 minuto.',
        'Di «vamos» y vuelve a caminar a tu lado otro minuto.',
        'Repite el ciclo 5 o 6 veces en el paseo.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa, premios y reloj',
      exito: '{n} vuelve a tu lado con facilidad cuando dices «vamos» tras el minuto de olfato.',
      siNo: 'Si le cuesta dejar de oler, avisa con «vamos», espera 5 segundos y da un premio cuando te siga. Acorta el tiempo caminando a 30 segundos.'
    },
    11: {
      objetivo: 'Subir la dificultad poco a poco hace que lo aprendido funcione también donde hay más movimiento.',
      pasos: [
        'Elige una calle con algo más de tránsito, a una hora tranquila (temprano o después de comer).',
        'Aplica la regla del árbol 10 minutos, igual que en tu calle de práctica.',
        'Premia más a menudo que en la calle tranquila: cada 2 o 3 pasos.',
        'Si algo le pone muy nervioso, aléjate 10 metros y sigue desde ahí.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} sigue aflojando la correa cuando te paras, aunque haya más cosas alrededor.',
      siNo: 'Si se para a menudo o no coge premios, la calle es demasiado difícil hoy. Vuelve a la tranquila y prueba otro día a una hora con menos gente.'
    },
    12: {
      objetivo: 'Espaciar los premios evita que dependa de ellos y le enseña a mantener la posición durante más tiempo.',
      pasos: [
        'Empieza el paseo con 2 minutos premiando cada 1 o 2 pasos para calentar.',
        'Pasa a premiar cada 3 o 4 pasos que vaya a tu lado con la correa floja.',
        'Varía: a veces a los 3 pasos, a veces a los 5, para que no sepa cuándo llega.',
        'Mantén la regla del árbol cada vez que tense.'
      ],
      tiempo: '10 a 15 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} aguanta 4 o 5 pasos a tu lado sin adelantarse esperando el premio.',
      siNo: 'Si empieza a tirar más, has bajado los premios demasiado rápido. Vuelve 1 día a premiar cada 2 pasos y luego espacia otra vez.'
    },
    13: {
      objetivo: 'Un paseo sin exigencias equilibra la semana de trabajo y le ayuda a llegar más tranquilo al siguiente.',
      pasos: [
        'Ve a un sitio tranquilo donde pueda oler sin prisas.',
        'Déjale elegir el ritmo y la dirección siempre que sea seguro.',
        'No pidas ejercicios: solo acompaña y premia si te mira por su cuenta.',
        'Termina con 2 minutos de paseo lento hacia casa.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés y correa (larga si el sitio lo permite)',
      exito: '{n} se detiene a oler con calma y su cuerpo se ve relajado.',
      siNo: 'Si sigue tirando, puede que el sitio tenga demasiados estímulos. Prueba un parque más vacío o salid a otra hora.'
    },
    14: {
      objetivo: 'Ver el vídeo te muestra cambios que no notas mientras caminas: la postura, la tensión de la correa, cuánto te mira.',
      pasos: [
        'Haz el mismo recorrido que el día 7 y graba 30 segundos.',
        'Fíjate en cuánto tiempo va la correa colgando en forma de «J».',
        'Compara con el vídeo del día 7: posición, tirones y cuántas veces te mira.',
        'Apunta lo que ha mejorado y lo que más le sigue costando.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios y móvil',
      exito: 'En el vídeo la correa está floja durante más tiempo que en el de la primera semana.',
      siNo: 'Si no ves diferencias, no te desanimes: dedica la próxima semana a más paseos cortos y aplica el árbol sin excepciones.'
    },
    15: {
      objetivo: 'Que te mire al oír su nombre es la herramienta que usarás para que deje de fijarse en otros perros o personas.',
      pasos: [
        'En casa y sin distracciones, di «{n}» una sola vez con voz amable.',
        'En cuanto te mire, di «bien» y dale un premio.',
        'Repite 10 veces en cada sesión.',
        'Haz 3 sesiones en el día, en distintas habitaciones.'
      ],
      tiempo: '3 sesiones de 2 minutos',
      material: 'Premios pequeños',
      exito: '{n} gira la cabeza hacia ti en menos de 2 segundos al oír su nombre.',
      siNo: 'Si no te mira, no repitas el nombre: haz un pequeño ruido con la boca y premia cuando te mire. Practica en una habitación más aburrida.'
    },
    16: {
      objetivo: 'Le enseñas que ver a otros perros o personas anuncia premios, y que mirarte es mejor que lanzarse.',
      pasos: [
        'Sitúate lejos de una zona de paso, por ejemplo a 30 metros de un parque.',
        'Cuando {n} mire a otro perro o persona, espera; en cuanto vuelva a mirarte, di «bien» y premia.',
        'Si no vuelve a mirarte en 3 segundos, di su nombre y premia.',
        'Repite 10 veces y vete antes de que se canse.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} mira al estímulo y se gira hacia ti él solo, buscando el premio.',
      siNo: 'Si se queda fijo, se pone rígido o ladra, estás demasiado cerca: aléjate el doble de distancia. Si hay gruñidos o intentos de morder, consulta con un profesional cualificado.'
    },
    17: {
      objetivo: 'Conocer su distancia de trabajo evita que lo superes y le permite aprender en lugar de reaccionar.',
      pasos: [
        'Empieza lejos de otros perros, a 40 o 50 metros.',
        'Acércate 5 metros cada vez y ofrécele un premio en cada punto.',
        'La distancia buena es la última en la que coge el premio con suavidad y te mira.',
        'Marca un punto de referencia (farola, banco) y trabaja allí 5 minutos.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: 'Sabes a cuántos metros {n} puede ver a otro perro y seguir comiendo y mirándote.',
      siNo: 'Si no coge premios ni a 50 metros, prueba a otra hora con menos perros o en un lugar más abierto. Su distancia de hoy puede variar mañana.'
    },
    18: {
      objetivo: 'Los perros se sienten más cómodos cruzándose en curva. Pasar de frente es tenso y provoca tirones o reacciones.',
      pasos: [
        'Cuando veas venir a alguien de frente, empieza a desviarte con tiempo, a unos 15 metros.',
        'Haz un arco amplio: cruza la calle o pasa por la otra punta de la acera.',
        'Colócate entre {n} y la otra persona o perro.',
        'Premia cada 1 o 2 pasos mientras os cruzáis y al terminar el arco.'
      ],
      tiempo: 'Durante el paseo',
      material: 'Arnés, correa y premios',
      exito: '{n} pasa junto a personas o perros sin tensar la correa y mirándote para pedir premio.',
      siNo: 'Si aun así tensa, haz el arco más amplio o cruza de acera antes. Si no hay espacio, usa una media vuelta y espera a que pasen.'
    },
    19: {
      objetivo: 'Tener una salida rápida y alegre te da un plan cuando algo le supera, sin necesidad de tirar de él.',
      pasos: [
        'En casa, di «vamos» alegre, gira 180 grados y premia cuando te siga. 10 veces.',
        'Repite en una calle tranquila otras 10 veces, sin ningún estímulo delante.',
        'Al girar, aléjate 5 o 6 pasos rápidos antes de premiar.',
        'Practica 2 sesiones hoy para que sea automático.'
      ],
      tiempo: '2 sesiones de 5 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} gira contigo al instante al oír «vamos», sin que la correa se tense.',
      siNo: 'Si tarda en girar, haz el giro más lento y premia más rápido. No la uses con estímulos hasta que funcione 9 de cada 10 veces en calma.'
    },
    20: {
      objetivo: 'Un paseo sin estímulos le deja procesar lo aprendido y bajar la activación de los días de distracciones.',
      pasos: [
        'Elige un lugar y una hora con muy pocos perros y personas.',
        'Déjale oler y marcar el ritmo.',
        'Si aparece algún estímulo, aléjate con un arco o media vuelta sin esperar.',
        'Termina el paseo mientras siga tranquilo.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés y correa',
      exito: '{n} vuelve a casa relajado, sin jadear ni estar alterado.',
      siNo: 'Si no encuentras un sitio sin estímulos, prueba muy temprano o a última hora, o haz un juego de olfato en casa en su lugar.'
    },
    21: {
      objetivo: 'Anotar su distancia actual te da el punto de partida para acercar poco a poco la próxima semana.',
      pasos: [
        'Repite la prueba del día 17 en el mismo sitio.',
        'Busca la distancia a la que ve a otro perro, coge el premio y te mira.',
        'Apúntala en metros (usa pasos: 1 paso adulto son unos 70 cm).',
        'Anota también si estaba tranquilo o tenso en esa distancia.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios y libreta o móvil',
      exito: 'Tienes una distancia apuntada y es igual o menor que la del día 17.',
      siNo: 'Si la distancia ha aumentado, puede que haya tenido una semana con muchos sustos. Dedica 2 o 3 días a paseos tranquilos antes de seguir.'
    },
    22: {
      objetivo: 'Acercarse poco a poco, siempre dentro de lo que puede gestionar, hace que tolere a los demás cada vez más cerca.',
      pasos: [
        'Empieza a la distancia apuntada el día 21.',
        'Haz 5 repeticiones de mirar y volver a esa distancia.',
        'Acércate solo 2 o 3 metros y haz otras 5 repeticiones.',
        'Si sigue cogiendo premios con calma, termina ahí. No te acerques más hoy.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} mira y vuelve a ti con la misma facilidad unos metros más cerca.',
      siNo: 'Si se queda fijo o ladra, vuelve a la distancia anterior y termina con 3 repeticiones fáciles. Mañana intenta acercarte solo 1 metro.'
    },
    23: {
      objetivo: 'Un perro con la cabeza cansada sale más tranquilo y tira menos al inicio del paseo.',
      pasos: [
        'Esconde 10 o 15 premios por una habitación o dentro de una toalla enrollada.',
        'Di «busca» y deja que los encuentre él solo durante 5 minutos.',
        'Sal a pasear justo después, con la calma en la puerta.',
        'Fíjate en cuántas paradas haces en los primeros 5 minutos.'
      ],
      tiempo: '5 minutos en casa y paseo normal',
      material: 'Premios, toalla o caja de cartón',
      exito: '{n} sale por la puerta más calmado y tensa menos al empezar el paseo.',
      siNo: 'Si el juego le excita más, hazlo más lento: premios esparcidos en el suelo en una zona pequeña y voz tranquila.'
    },
    24: {
      objetivo: 'Adaptarse a tu ritmo le enseña a estar atento a ti y no solo a lo que hay delante.',
      pasos: [
        'En una calle tranquila, camina 10 pasos a ritmo normal y premia.',
        'Baja a paso muy lento durante 5 pasos; premia si se adapta sin adelantarse.',
        'Acelera 5 pasos con alegría; premia si te sigue sin tirar.',
        'Alterna los ritmos durante 5 minutos.'
      ],
      tiempo: '5 a 10 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} cambia de ritmo contigo y la correa sigue floja en los cambios.',
      siNo: 'Si se adelanta en el paso lento, acorta a 2 o 3 pasos lentos y premia más rápido. Avisa con tu voz antes de cambiar.'
    },
    25: {
      objetivo: 'Practicar con más gente hace que el paseo sin tirones funcione también en tu día a día.',
      pasos: [
        'Elige una calle con más gente, pero a una hora razonable (evita la hora punta).',
        'Paseo de 15 minutos con la regla del árbol y premios a tu lado.',
        'Usa arcos para cruzarte con la gente.',
        'Cada 3 o 4 minutos, haz una pausa de olfato con «libre».'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} mantiene la correa floja buena parte del paseo y responde a «vamos».',
      siNo: 'Si se agobia o tira sin parar, vuelve a una calle más tranquila y acorta a 10 minutos. Prueba la calle concurrida de nuevo en 2 o 3 días.'
    },
    26: {
      objetivo: 'Si tirar nunca le lleva a saludar, aprende que la correa floja es lo que le da acceso a otros perros.',
      pasos: [
        'Saluda solo a perros tranquilos y con permiso de su tutor.',
        'Acércate solo mientras la correa esté floja; si tensa, «vamos» y os alejáis 5 metros.',
        'Deja que se huelan 3 segundos y llámale con alegría para seguir.',
        'Premia cuando vuelva a ti tras el saludo.'
      ],
      tiempo: 'Durante el paseo',
      material: 'Arnés, correa y premios',
      exito: '{n} se acerca a otro perro con la correa floja y vuelve a ti al llamarle.',
      siNo: 'Si se excita mucho o gruñe, no hace falta que salude: pasar de largo con calma también es un éxito. Si hay tensión fuerte o mordiscos, consulta a un profesional.'
    },
    27: {
      objetivo: 'Las semanas de trabajo intenso necesitan descanso. Oler libremente reduce el estrés y consolida lo aprendido.',
      pasos: [
        'Ve a un lugar tranquilo con mucho olor: hierba, tierra, arbustos.',
        'Déjale elegir por dónde ir siempre que sea seguro.',
        'No pidas ejercicios; acompáñale con calma.',
        'Si te mira por su cuenta, premia sin decir nada.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés y correa (larga si el sitio lo permite)',
      exito: '{n} explora con calma y vuelve a casa relajado.',
      siNo: 'Si está muy acelerado, empieza el paseo con 5 minutos de búsqueda de premios en la hierba para que baje revoluciones.'
    },
    28: {
      objetivo: 'Comparar con el día 2 te muestra cuánto ha cambiado tu perro en 4 semanas, en una situación más difícil.',
      pasos: [
        'Haz un paseo de 15 minutos por la calle con más gente del día 25.',
        'Cuenta las veces que te paras por tensión en la correa.',
        'Compara con tus apuntes del día 2 y del día 7.',
        'Apunta en qué situaciones sigue tensando más.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa, premios y contador',
      exito: 'Te paras claramente menos que el día 2, aunque el paseo sea más largo y con más gente.',
      siNo: 'Si las paradas siguen siendo muchas, vuelve unos días a la calle tranquila con más premios. Avanzar despacio es avanzar.'
    },
    29: {
      objetivo: 'Usar todo lo aprendido en tu paseo habitual es el paso a la vida real, donde realmente lo necesitas.',
      pasos: [
        'Haz tu paseo de siempre, con calma en la puerta antes de salir.',
        'Aplica la regla del árbol cada vez que tense, sin excepciones.',
        'Premia a tu lado cada 4 o 5 pasos y usa arcos con perros y personas.',
        'Cada 3 minutos de buen paseo, da 1 minuto de «libre» para oler.'
      ],
      tiempo: 'Tu paseo habitual',
      material: 'Arnés, correa y premios',
      exito: 'Terminas tu paseo de siempre con muchas menos paradas que en la primera semana.',
      siNo: 'Si tu ruta habitual es demasiado difícil, haz solo la primera mitad aplicando todo y vuelve. Amplía el recorrido cada 2 o 3 días.'
    },
    30: {
      objetivo: 'Pasar a premios ocasionales y al olfato como recompensa hace que el buen paseo se mantenga sin depender de la comida.',
      pasos: [
        'Premia con comida de forma impredecible: a veces a los 5 pasos, a veces a los 15.',
        'Sustituye la mitad de los premios por «libre» y 30 segundos de olfato.',
        'Felicítale con la voz cuando vaya bien, entre premios.',
        'Mantén la regla del árbol igual que siempre.'
      ],
      tiempo: '15 a 20 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} sigue caminando a tu lado aunque pase un rato sin premio de comida.',
      siNo: 'Si vuelve a adelantarse, aumenta un poco los premios durante 2 días. Bajarlos es un proceso, no un interruptor.'
    },
    31: {
      objetivo: 'En sitios nuevos todo huele distinto y le cuesta más. Bajar la exigencia le permite tener éxito igualmente.',
      pasos: [
        'Elige una zona nueva pero tranquila: un barrio cercano o un parque que no conozca.',
        'Deja los primeros 5 minutos para oler y explorar.',
        'Vuelve a premiar cada 2 o 3 pasos, como en la semana 2.',
        'Paseo más corto de lo habitual: 15 minutos bastan.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} acepta premios y responde a la regla del árbol también en un lugar desconocido.',
      siNo: 'Si está muy alterado y no come, el sitio es demasiado estimulante hoy. Busca un rincón tranquilo, deja que huela y volved otro día.'
    },
    32: {
      objetivo: 'Cada vez que tirar le lleva a algún sitio, el hábito se refuerza. Un paseo corto y bien hecho protege todo el trabajo.',
      pasos: [
        'Si hoy vas con prisa, haz un paseo de 5 o 10 minutos solo para hacer sus necesidades.',
        'Aplica la regla del árbol también en ese paseo corto.',
        'Compensa en casa con 5 minutos de juego de olfato.',
        'Deja el paseo largo para cuando tengas tiempo de hacerlo bien.'
      ],
      tiempo: '5 a 10 minutos',
      material: 'Arnés, correa y premios',
      exito: 'Ni siquiera en los días con prisa {n} consigue avanzar tirando.',
      siNo: 'Si de verdad no puedes pararte, cambia de dirección con «vamos» en lugar de dejarle tirar. Mejor un paseo corto que uno tirando.'
    },
    33: {
      objetivo: 'Si en casa cada uno pasea con reglas distintas, {n} se confunde. La misma regla con todos consolida el hábito.',
      pasos: [
        'Explica a la otra persona la regla del árbol, «su sitio», «vamos» y «libre».',
        'Acompañadla en los primeros 5 minutos del paseo para que lo vea.',
        'Que haga el resto del paseo sola con premios y las mismas palabras.',
        'Al volver, comentad dónde ha tensado más.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa y premios',
      exito: '{n} camina con la correa floja también con otra persona de casa.',
      siNo: 'Si con la otra persona tira mucho más, que empiece por el pasillo de premios del día 8 en una calle tranquila antes del paseo completo.'
    },
    34: {
      objetivo: 'Un paseo libre equilibra una semana de paseos reales y mantiene a tu perro con ganas de salir contigo.',
      pasos: [
        'Busca un sitio con buenos olores y pocos estímulos.',
        'Deja que elija el ritmo y la dirección siempre que sea seguro.',
        'Si tiene correa larga, úsala para que explore con más libertad.',
        'Disfrutad del paseo sin ejercicios.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés y correa (larga si la tienes)',
      exito: '{n} explora tranquilo, se detiene a oler y vuelve relajado.',
      siNo: 'Si tira hacia todo, empieza con 5 minutos de búsqueda de premios en la hierba y busca un lugar más aburrido.'
    },
    35: {
      objetivo: 'Comparar vídeos de las semanas 2 y 5 te da una prueba objetiva del cambio y te muestra qué pulir en la última semana.',
      pasos: [
        'Graba 30 segundos en el mismo tramo que en la semana 2.',
        'Pon los dos vídeos uno detrás de otro.',
        'Fíjate en la correa: ¿va más tiempo en forma de «J»?',
        'Apunta una sola situación que quieras mejorar en la semana 6.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa, premios y móvil',
      exito: 'En el vídeo nuevo la correa va floja la mayor parte del tiempo y {n} te mira más.',
      siNo: 'Si el cambio es pequeño, revisa si en casa alguien le deja tirar. Habla con la familia y repetid la semana 5 antes de seguir.'
    },
    36: {
      objetivo: 'Dedicar un paseo entero a su situación más difícil, a la distancia correcta, es donde más se nota el progreso.',
      pasos: [
        'Elige la situación que más le cuesta: perros, bicis, la salida, un cruce concreto.',
        'Colócate a su distancia buena y haz 10 repeticiones de mirar y volver.',
        'Si va bien, acércate 2 metros y haz otras 5.',
        'Termina siempre con una repetición fácil y un paseo tranquilo.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa y premios de alto valor',
      exito: '{n} se mantiene tranquilo y te mira ante su situación más difícil, a una distancia algo menor que antes.',
      siNo: 'Si reacciona, aléjate más y acorta la sesión. Si hay reacciones fuertes o intentos de morder, busca la ayuda de un profesional cualificado.'
    },
    37: {
      objetivo: 'Mantener la correa floja de forma continua demuestra que ha entendido dónde está su sitio.',
      pasos: [
        'Elige una calle tranquila y pon un cronómetro.',
        'Camina premiando cada 5 o 6 pasos y cuenta el tiempo sin tensar.',
        'Si tensa, aplica el árbol y reinicia el cronómetro.',
        'Empieza con 30 segundos y sube hasta 2 minutos seguidos.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios y cronómetro',
      exito: '{n} consigue 2 minutos seguidos con la correa floja al menos una vez.',
      siNo: 'Si no pasa de 30 segundos, premia más a menudo y busca un tramo más aburrido. Mañana prueba con 1 minuto.'
    },
    38: {
      objetivo: 'Medir otra vez su distancia a otros perros te dice cuánto ha avanzado en tolerar estímulos.',
      pasos: [
        'Vuelve al mismo sitio del día 21.',
        'Empieza lejos y acércate 2 metros cada vez, premiando en cada punto.',
        'Para en la distancia a la que todavía coge el premio y te mira.',
        'Apúntala y compárala con la del día 21.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, premios y libreta o móvil',
      exito: 'La distancia es menor que la del día 21 o {n} está más tranquilo a la misma distancia.',
      siNo: 'Si no ha mejorado, sigue trabajando a esa distancia unas semanas más. Cada perro tiene su ritmo, y los adoptados a veces necesitan más tiempo.'
    },
    39: {
      objetivo: 'Un paseo más largo pone a prueba su constancia y te enseña a gestionar el cansancio y la excitación.',
      pasos: [
        'Planea un paseo un 50 % más largo de lo normal por una zona conocida.',
        'Haz una pausa de olfato de 2 minutos cada 10 minutos.',
        'Lleva agua y busca sombra si hace calor.',
        'Si notas que tira más hacia el final, acorta y volved.'
      ],
      tiempo: '30 a 45 minutos',
      material: 'Arnés, correa, premios y agua',
      exito: '{n} mantiene la correa floja también en la segunda mitad del paseo.',
      siNo: 'Si se cansa o se excita, es normal: acorta el recorrido y aumenta las pausas. Adapta la duración a su edad y condición física.'
    },
    40: {
      objetivo: 'Llevar los premios guardados demuestra que camina bien por el hábito, no porque ve la comida en tu mano.',
      pasos: [
        'Guarda los premios en la riñonera cerrada antes del tramo.',
        'Camina 1 minuto con la correa floja sin premiar.',
        'Al final del tramo, di «bien» y saca un premio especial, o di «libre» para oler.',
        'Repite el tramo 5 veces durante el paseo.'
      ],
      tiempo: '10 minutos',
      material: 'Arnés, correa, riñonera y premios',
      exito: '{n} camina a tu lado el tramo completo aunque no vea los premios.',
      siNo: 'Si se adelanta sin el premio a la vista, acorta el tramo a 20 segundos y ve alargándolo poco a poco.'
    },
    41: {
      objetivo: 'Mantener los paseos de olfato después del programa es parte de su bienestar y le ayuda a seguir tranquilo.',
      pasos: [
        'Ve al sitio de olfato que más le guste.',
        'Déjale marcar el ritmo y la dirección.',
        'Acompáñale sin prisa y sin ejercicios.',
        'Planea mantener al menos 1 paseo así cada semana.'
      ],
      tiempo: '20 a 30 minutos',
      material: 'Arnés y correa (larga si la tienes)',
      exito: '{n} explora relajado y disfruta del paseo contigo.',
      siNo: 'Si hoy está inquieto, acorta el paseo y termina con un juego de olfato en casa.'
    },
    42: {
      objetivo: 'Comparar el principio y el final te muestra todo lo que habéis logrado y qué mantener a partir de ahora.',
      pasos: [
        'Graba 30 segundos en el mismo recorrido del día 7.',
        'Pon los dos vídeos seguidos y fíjate en la correa, la posición y las miradas.',
        'Repasa tus apuntes: paradas del día 2 y distancias de los días 21 y 38.',
        'Rellena la encuesta final y anota qué hábitos vas a mantener.'
      ],
      tiempo: '20 minutos',
      material: 'Móvil, tus apuntes y premios',
      exito: 'En el vídeo de hoy la correa va floja la mayor parte del tiempo y {n} camina atento a ti.',
      siNo: 'Si aún tira en ciertas situaciones, es normal: sigue con la regla del árbol y repite las semanas 3 y 4 para esos estímulos.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_PROGRAMAS = root.DETALLE_PROGRAMAS || {}; root.DETALLE_PROGRAMAS.correa = api; }
})(this);
