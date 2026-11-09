/* Detalle de las tareas diarias del plan de cachorro (días 1-28). {n} = nombre del cachorro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    1: { meta: 'Que {n} se sienta seguro en casa, tenga su rincón y empiece a entender cuándo y dónde se hace pis.' },
    2: { meta: 'Menos accidentes y menos mordiscos a las manos, y {n} empezará a escuchar los ruidos de casa sin asustarse.' },
    3: { meta: 'Noches más tranquilas y un cachorro que conoce gente nueva con confianza y viene contento cuando le llamas.' },
    4: { meta: '{n} descubrirá el coche, la correa y el mundo de fuera poco a poco, siempre a su ritmo y con seguridad.' }
  };
  var DETALLE = {
    1: {
      objetivo: 'Darle a {n} un refugio propio donde descansar y estar a salvo cuando no puedas vigilarle. Es la base del pis, las noches y la soledad.',
      pasos: [
        'Elige un rincón tranquilo pero cerca de la familia (salón o junto a tu cuarto), lejos de corrientes y del paso constante.',
        'Delimítalo con un parque o una puerta de bebé: cama a un lado, agua en el otro y el empapador en el extremo opuesto a la cama.',
        'Añade un mordedor y una prenda tuya usada. Deja la puerta abierta para que entre y salga libremente.',
        'Cada vez que entre por su cuenta, deja caer un premio en la cama sin decir nada. Hazlo unas 10 veces a lo largo del día.',
        'Cuando se duerma en otro sitio, llévale en brazos con calma a su cama para que asocie ese rincón con descansar.'
      ],
      tiempo: '20 minutos de montaje y premios sueltos durante el día',
      material: 'Parque o puerta de bebé, cama, bebedero, empapador, mordedor y premios pequeños',
      exito: 'Al final del día {n} entra solo en su zona, olfatea la cama o se echa allí una siesta sin que le lleves.',
      siNo: 'Si no quiere entrar, siéntate tú dentro unos minutos y deja premios por el suelo. No le encierres hoy: la zona debe ser un sitio agradable, nunca un castigo.'
    },
    2: {
      objetivo: 'Adelantarte a sus ganas de hacer pis para que acierte casi siempre en el sitio bueno. Cada acierto premiado vale más que cien accidentes limpiados.',
      pasos: [
        'Llévale al sitio de pis en 5 momentos: al despertar, a los 10-15 minutos de comer, tras jugar, tras una emoción y antes de dormir.',
        'Quédate con él 3-5 minutos en el sitio, sin jugar ni hablar mucho. Si no hace nada, vuelve a probar a los 10 minutos.',
        'Cuando haga pis, di "muy bien, pis" y dale un premio en los 2 segundos siguientes, allí mismo.',
        'Apunta cada pis con la hora y si fue en el sitio bueno o fuera. Hazlo en la tabla del plan o en el móvil.',
        'Si hace pis fuera de sitio, no digas nada: limpia y anota la hora, que te servirá para ajustar.'
      ],
      tiempo: 'Unas 8-12 salidas cortas de 3-5 minutos',
      material: 'Empapador o rincón de pis fijo, premios pequeños y la tabla de pis',
      exito: 'Más de la mitad de los pis de hoy han sido en el sitio bueno y tienes todas las horas apuntadas.',
      siNo: 'Si casi todos son fuera, probablemente llegas tarde: añade una salida cada 45-60 minutos mientras está despierto. Si notas que hace pis muy a menudo, consulta con tu veterinario.'
    },
    3: {
      objetivo: 'Que su nombre signifique "mírame, que viene algo bueno". Es la base para la llamada y para captar su atención en cualquier situación.',
      pasos: [
        'Empieza en una habitación tranquila, a menos de 1 metro de {n} y con 10 premios pequeños en la mano.',
        'Di "{n}" una sola vez con voz alegre. En cuanto te mire, di "sí" y dale el premio.',
        'Si no te mira en 2 segundos, haz un ruidito suave con la lengua y premia el giro de cabeza. No repitas el nombre.',
        'Haz 10 repeticiones por sesión y 3 sesiones al día, por ejemplo después de cada siesta.',
        'Pide a todos en casa que usen su nombre solo para cosas buenas, nunca para regañar ni para algo que no le guste.'
      ],
      tiempo: '1-2 minutos, 3 veces al día',
      material: 'Premios pequeños y blandos',
      exito: '{n} gira la cabeza hacia ti en menos de 1 segundo al oír su nombre en una habitación tranquila.',
      siNo: 'Si no responde, está distraído o cansado: prueba justo después de una siesta, en un sitio más aburrido y con un premio más apetecible.'
    },
    4: {
      objetivo: 'Entender que un cachorro necesita dormir 18-20 horas al día y que muchos mordiscos y locuras son, en realidad, falta de sueño.',
      pasos: [
        'Apunta hoy cada siesta con la hora de inicio y de fin. Suma el total por la noche.',
        'Observa qué pasa tras 1-1,5 horas despierto: si muerde más, corre sin parar o ladra, suele ser cansancio.',
        'En ese momento, sácale a hacer pis, llévale a su zona con un mordedor y baja el ritmo de casa: luz suave y voces bajas.',
        'Deja que duerma sin interrupciones: que nadie le coja ni le despierte para jugar, tampoco las visitas.'
      ],
      tiempo: 'Durante todo el día, 1 minuto para cada anotación',
      material: 'Libreta o móvil para apuntar, y un mordedor en su zona',
      exito: 'Has contado al menos 16-18 horas de sueño y has visto la relación entre sus ratos "locos" y el cansancio.',
      siNo: 'Si duerme mucho menos, la casa tiene demasiado ritmo: programa siestas tras cada sesión de juego. Si duerme mucho más y está apagado, consulta con tu veterinario.'
    },
    5: {
      objetivo: 'Que {n} aprenda que las manos en patas, orejas y boca traen premios. Así el cepillado, el corte de uñas y el veterinario serán mucho más fáciles.',
      pasos: [
        'Elige un momento tranquilo, con {n} relajado tras una siesta y un pis. Ten 15 premios pequeños preparados.',
        'Toca una pata 1 segundo, retira la mano y dale un premio. Repite 3 veces con cada pata.',
        'Haz lo mismo con cada oreja: tocar 1 segundo, soltar y premio. 3 veces por oreja.',
        'Levanta el labio con suavidad 1 segundo para ver los dientes y premio. 3 veces.',
        'Termina mientras está tranquilo y vuelve a hacerlo mañana con 2 segundos de contacto.'
      ],
      tiempo: '2-3 minutos',
      material: 'Premios pequeños',
      exito: '{n} se queda quieto o incluso acerca la pata cuando ve tu mano, sin retirarse ni morder.',
      siNo: 'Si retira la pata o mordisquea, has ido demasiado rápido: toca solo con un dedo medio segundo y premia. Si está muy nervioso, déjalo para después de una siesta.'
    },
    6: {
      objetivo: 'Empezar a enseñar a {n} que te vas y siempre vuelves, con ausencias tan cortas que no le dé tiempo a angustiarse.',
      pasos: [
        'Elige un momento en que esté cansado y tranquilo, en su zona y con un mordedor o un juguete rellenable.',
        'Sal de la habitación sin despedirte y cierra la puerta de bebé. Cuenta 10 segundos fuera de su vista.',
        'Vuelve antes de que llore. Entra con calma, sin saludos efusivos, y sigue con lo tuyo.',
        'Espera 1-2 minutos y repite. Haz 5 ausencias en total, alternando 5 y 10 segundos para que no sea predecible.'
      ],
      tiempo: '5 minutos',
      material: 'Puerta de bebé o parque, y un juguete rellenable o mordedor',
      exito: '{n} sigue mordisqueando o se queda tumbado durante tus 5 salidas sin llorar ni arañar la puerta.',
      siNo: 'Si llora a los pocos segundos, baja a 2-3 segundos o sal solo hasta la puerta. Vuelve cuando esté en silencio un instante y repite otro día a la misma distancia.'
    },
    7: {
      objetivo: 'Usar lo que has apuntado esta semana para descubrir el patrón de pis de {n} y sacarle justo antes de que lo necesite.',
      pasos: [
        'Repasa la tabla de pis de los últimos días y marca las horas en las que se repiten los pis, dentro o fuera.',
        'Fíjate en cuánto aguanta despierto entre pis y pis: a esta edad suele ser entre 1 y 2 horas.',
        'Programa en el móvil alarmas 10-15 minutos antes de esas horas para llevarle al sitio de pis.',
        'Revisa también la tabla de siestas: ¿está durmiendo lo suficiente? Ajusta la rutina de mañana con ambas cosas.'
      ],
      tiempo: '15 minutos',
      material: 'La tabla de pis y la de siestas',
      exito: 'Tienes 3-5 horas clave identificadas y alarmas puestas para adelantarte a ellas.',
      siNo: 'Si no ves ningún patrón, apunta 3 días más con más detalle (también comidas y juegos). Si te faltan datos, no pasa nada: la constancia es lo que cuenta.'
    },
    8: {
      objetivo: 'Redirigir los mordiscos a algo permitido. {n} necesita morder; tu trabajo es que lo haga en el mordedor y no en tus manos.',
      pasos: [
        'Coloca un mordedor en cada habitación donde paséis tiempo, a tu alcance (estantería, bolsillo o cesta).',
        'Cuando muerda tu mano, quédate quieto, retírala despacio y ofrécele el mordedor moviéndolo un poco por el suelo.',
        'Cuando muerda el mordedor, dile "muy bien" con voz suave y juega 10-20 segundos con él.',
        'Si vuelve a tu mano 3 veces seguidas, levántate y sal 20-30 segundos. Vuelve con calma.',
        'Rota 3-4 mordedores de texturas distintas (goma, cuerda, tela) para que no se aburra.'
      ],
      tiempo: 'Todo el día, en cada mordisco',
      material: 'Un mordedor por habitación, de texturas variadas',
      exito: 'Cuando le ofreces el mordedor, {n} lo coge y se queda mordiéndolo en lugar de volver a tu mano.',
      siNo: 'Si muerde con mucha intensidad y no hay manera, casi siempre es sueño: llévale a su zona con un mordedor y deja que duerma.'
    },
    9: {
      objetivo: 'Enseñarle a {n} su primera señal sin tocarle ni empujarle. "Sentado" será su forma educada de pedir las cosas.',
      pasos: [
        'Ponte delante de {n} con un premio entre los dedos, pegado a su nariz.',
        'Sube el premio despacio por encima de su cabeza y un poco hacia atrás. Al seguirlo, el culito bajará solo.',
        'En cuanto toque el suelo, di "sí" y dale el premio. No digas "sentado" todavía.',
        'Haz 5 repeticiones por sesión, 3 sesiones al día. Cuando lo haga a la primera 4 de 5 veces, di "sentado" justo antes de guiar.'
      ],
      tiempo: '1-2 minutos, 3 veces al día',
      material: 'Premios pequeños y blandos',
      exito: '{n} se sienta en menos de 3 segundos al seguir tu mano en una habitación tranquila.',
      siNo: 'Si salta, tienes el premio demasiado alto: llévalo pegado a su cabeza. Si retrocede, practica con la espalda contra una pared o un sofá.'
    },
    10: {
      objetivo: 'Que {n} aprenda que los ruidos de casa son normales y hasta anuncian cosas buenas, antes de que aparezcan los miedos.',
      pasos: [
        'Ponle la comida en su sitio y que otra persona encienda la aspiradora en la habitación más lejana, con la puerta entornada.',
        'Mira a {n}: si sigue comiendo tranquilo, deja la aspiradora encendida 1 minuto y apágala antes de que termine.',
        'Si deja de comer o se queda paralizado, apágala y otro día empieza con la puerta cerrada.',
        'Repite en días sucesivos acercándola 1-2 metros cada vez, solo si el día anterior comió sin problemas.',
        'Haz lo mismo con la lavadora centrifugando o el secador de pelo en otra habitación.'
      ],
      tiempo: '2-3 minutos, mientras come',
      material: 'Su comida y la aspiradora',
      exito: '{n} sigue comiendo con el rabo relajado y quizá levanta la cabeza un segundo, pero vuelve al plato.',
      siNo: 'Si se asusta, el ruido estaba demasiado cerca: aléjalo, cierra una puerta más o pon antes una grabación de aspiradora a volumen muy bajo.'
    },
    11: {
      objetivo: 'Eliminar el olor de los accidentes para que {n} no vuelva al mismo sitio. Lo que tú no hueles, él lo huele perfectamente.',
      pasos: [
        'Retira primero la mayor parte con papel absorbente, apretando sin frotar para no extender la mancha.',
        'Aplica el limpiador enzimático hasta empapar la zona y deja que actúe el tiempo que indique el envase.',
        'Evita lejía y amoniaco: su olor recuerda al pis y le invita a repetir allí.',
        'Repasa con la tabla los sitios donde ha repetido y límpialos también, aunque parezcan limpios.',
        'Durante unos días, pon allí su cama, su cuenco de comida o una sesión de juego para cambiar el uso de ese rincón.'
      ],
      tiempo: '15-20 minutos',
      material: 'Limpiador enzimático y papel absorbente',
      exito: '{n} pasa por los antiguos sitios de accidente sin olfatearlos insistentemente ni volver a hacer pis allí.',
      siNo: 'Si sigue repitiendo en el mismo rincón, bloquea el acceso unos días y aumenta las salidas en las horas en que suele ir allí.'
    },
    12: {
      objetivo: 'Pasar de salir de la habitación a salir de casa. La puerta de la calle es la gran señal de "me voy", y hay que hacerla aburrida.',
      pasos: [
        'Antes de salir, saca a {n} a hacer pis y juega 5 minutos con él. Luego deja unos minutos de calma.',
        'Déjale en su zona con un juguete rellenable con parte de su comida o algo que le guste mucho.',
        'Coge las llaves y sal de casa sin despedirte. Quédate fuera 1 minuto, por ejemplo en el rellano.',
        'Vuelve, entra sin saludar y espera a que esté tranquilo para hacerle caso. Retira el juguete rellenable.',
        'Repítelo 2-3 veces a lo largo del día, en momentos distintos.'
      ],
      tiempo: '1 minuto fuera, 2-3 veces al día',
      material: 'Juguete rellenable y parte de su comida o un premio especial',
      exito: '{n} está tan ocupado con el juguete que apenas se da cuenta de que has salido y no llora al oír la puerta.',
      siNo: 'Si llora al cerrar la puerta, vuelve a ausencias de 30 segundos y practica también abrir y cerrar la puerta sin salir.'
    },
    13: {
      objetivo: 'Que el arnés sea algo bueno desde el primer día, para que mañana se lo deje poner sin pelearse ni asustarse.',
      pasos: [
        'Enséñale el arnés en el suelo. Cuando lo huela, di "sí" y dale un premio. Repite 3 veces.',
        'Mete un premio dentro del hueco de la cabeza para que asome el hocico por él. Repite 3 veces.',
        'Pásale el arnés por la cabeza 1 segundo, premio y quítalo. No lo abroches hoy.',
        'Termina la sesión ahí, aunque vaya muy bien. Mañana puedes llegar a abrochar un cierre.'
      ],
      tiempo: '2 minutos',
      material: 'Un arnés de su talla y premios pequeños',
      exito: '{n} mete la cabeza por el arnés por su cuenta buscando el premio.',
      siNo: 'Si se aparta o se rasca, quédate en el paso anterior: arnés en el suelo y premios cerca durante 2-3 días.'
    },
    14: {
      objetivo: 'Comprobar si las salidas están funcionando y ajustar los horarios para que {n} siga acertando cada vez más.',
      pasos: [
        'Cuenta los accidentes de esta semana y compáralos con los de la semana 1.',
        'Si han bajado, mantén el horario. Si no, adelanta 15 minutos cada salida programada.',
        'Revisa en qué momentos siguen los accidentes: ¿tras jugar?, ¿tras las visitas? Añade una salida justo en ese momento.',
        'Revisa también los mordiscos: ¿hay mordedores en todas las habitaciones? Repón los que estén rotos o aburridos.'
      ],
      tiempo: '15 minutos',
      material: 'La tabla de pis',
      exito: 'Ves menos accidentes que la semana pasada o, al menos, sabes exactamente en qué momentos ocurren.',
      siNo: 'Si los accidentes no bajan nada tras dos semanas de salidas frecuentes, consulta con tu veterinario para descartar alguna molestia.'
    },
    15: {
      objetivo: 'Crear una rutina nocturna fija para que el cuerpo de {n} aprenda cuándo toca dormir y las noches sean más largas.',
      pasos: [
        'Dale la cena unas 2 horas antes de acostaros, siempre a la misma hora.',
        'Después de cenar, juego tranquilo de 10 minutos: mordedor o búsqueda de premios. Nada de carreras.',
        'Justo antes de dormir, salida tranquila a hacer pis, sin juegos ni conversación.',
        'Llévale a su cama, cerca de la tuya, con la prenda con tu olor. Luz apagada y voz baja.',
        'Repite la misma secuencia cada noche, también el fin de semana.'
      ],
      tiempo: '20-30 minutos antes de acostaros',
      material: 'Su cama, una prenda con tu olor y un mordedor',
      exito: '{n} se acomoda en su cama en pocos minutos tras la última salida y tarda más en despertarse.',
      siNo: 'Si se pone muy activo justo antes de dormir, adelanta el juego y alarga el rato de calma. Si llora, comprueba primero si necesita hacer pis.'
    },
    16: {
      objetivo: 'Que {n} asocie a las personas desconocidas con cosas buenas y aprenda que puede acercarse cuando él decida.',
      pasos: [
        'Invita a una persona tranquila y pídele que entre sin saludar al cachorro y se siente en el suelo o en una silla.',
        'Dale 5 premios. Que lance uno cerca de {n}, sin mirarle fijamente ni inclinarse sobre él.',
        'Si {n} se acerca, que le dé otro premio de la mano. Si se queda lejos, que siga lanzándolos a su lado.',
        'Si quiere caricias, que sean 2-3 segundos en el pecho o el lateral, no en la cabeza. Luego que retire la mano.',
        'Terminad en 5 minutos, mientras {n} sigue tranquilo y con ganas.'
      ],
      tiempo: '5 minutos',
      material: 'Premios pequeños para la visita',
      exito: '{n} se acerca por su cuenta a la persona, con el cuerpo relajado, y coge los premios de su mano.',
      siNo: 'Si se esconde, respeta su distancia: que la persona solo lance premios y no intente tocarle. Con otra visita otro día suele ir mejor.'
    },
    17: {
      objetivo: 'Construir una llamada fiable desde el principio: "ven" tiene que significar siempre algo estupendo y nunca el fin de la diversión.',
      pasos: [
        'Espera a que {n} ya venga hacia ti por su cuenta. Justo entonces di "ven" con voz alegre.',
        'Cuando llegue, agáchate, dale un premio y una caricia corta. Luego déjale volver a lo suyo.',
        'Hazlo 5-6 veces a lo largo del día, en distintas habitaciones.',
        'Si otra persona está en casa, jugad a llamarle por turnos a 2-3 metros, solo cuando estéis seguros de que vendrá.',
        'No le llames para cosas que no le gustan (cortar uñas, terminar el juego): en ese caso, ve tú a buscarle.'
      ],
      tiempo: '1 minuto, 5-6 veces al día',
      material: 'Premios muy apetecibles',
      exito: '{n} acelera y llega contento cuando oye "ven" en casa.',
      siNo: 'Si no viene, no repitas "ven": haz un ruido, agáchate o aléjate un paso para animarle, y la próxima vez llámale a menos distancia.'
    },
    18: {
      objetivo: 'Ir llevando poco a poco la cama de {n} hacia donde dormirá de mayor, sin que lo note ni pierda la seguridad de estar cerca.',
      pasos: [
        'Decide dónde quieres que duerma a largo plazo. Si es cerca de ti, no hace falta moverla.',
        'Hoy aleja la cama 20-30 centímetros en esa dirección. Nada más.',
        'Durante el día, deja caer 3-4 premios en la cama en su nueva posición para que la siga sintiendo suya.',
        'Mantén el nuevo sitio al menos 3 noches tranquilas antes de moverla otra vez.'
      ],
      tiempo: '5 minutos',
      material: 'Su cama y unos premios',
      exito: '{n} duerme en la cama en su nueva posición sin despertarse más que antes.',
      siNo: 'Si las noches empeoran, vuelve a la posición anterior unos días y después haz un movimiento más pequeño.'
    },
    19: {
      objetivo: 'Que la clínica veterinaria huela a premios y caricias, no solo a pinchazos, para que {n} entre tranquilo toda su vida.',
      pasos: [
        'Llama antes a la clínica y pregunta si puedes pasar 5 minutos en un momento tranquilo solo a saludar.',
        'Lleva a {n} en brazos o en su transportín, sin dejarle en el suelo si aún no ha completado las vacunas.',
        'Dentro, dale 3-4 premios tú y pide al personal que le dé uno si les parece bien.',
        'Si hay báscula, ponle encima 2 segundos y premio. Sal antes de que se canse o se agobie.'
      ],
      tiempo: '5-10 minutos',
      material: 'Premios muy apetecibles, transportín o una manta',
      exito: '{n} acepta los premios dentro de la clínica y mueve el rabo o se muestra curioso.',
      siNo: 'Si no quiere comer allí, está demasiado nervioso: quédate en la entrada o en la puerta, dale premios y vuelve a casa. Repítelo otro día más breve.'
    },
    20: {
      objetivo: 'Subir el tiempo que {n} pasa solo sin angustia, para que se acostumbre a tus salidas reales del día a día.',
      pasos: [
        'Antes de salir: pis, 5-10 minutos de juego y unos minutos de calma en su zona.',
        'Dale el juguete rellenable y sal de casa sin despedidas. Quédate fuera 5 minutos.',
        'Si puedes, escúchale desde fuera o grábale con el móvil para ver cómo lo lleva.',
        'Vuelve sin fiesta y retira el juguete rellenable cuando esté tranquilo.',
        'Haz 1-2 ausencias de este tipo al día, a horas distintas.'
      ],
      tiempo: '5 minutos fuera, 1-2 veces al día',
      material: 'Juguete rellenable y, si puedes, el móvil para grabarle',
      exito: '{n} se entretiene con el juguete o se duerme, y como mucho llora unos segundos al principio.',
      siNo: 'Si llora mucho o rasca la puerta, vuelve al tiempo anterior (1 minuto) unos días y sube después de 2 en 2 minutos.'
    },
    21: {
      objetivo: 'Medir cómo están yendo las noches para saber si la rutina funciona. Los despertares deberían ir bajando semana a semana.',
      pasos: [
        'Apunta cada vez que {n} se despierte esta noche: hora y si hizo pis o no.',
        'Si se despierta, sácale a hacer pis en silencio, con luz tenue, y de vuelta a la cama sin jugar.',
        'Compara con la semana pasada: ¿se despierta menos veces o más tarde?',
        'Revisa la semana de personas: ¿cuántas personas nuevas ha conocido? Apunta cuáles le costaron más.'
      ],
      tiempo: '10 minutos para revisar',
      material: 'Libreta o móvil para apuntar',
      exito: 'Los despertares de noche son iguales o menos que la semana pasada y casi todos terminan en pis y vuelta a dormir.',
      siNo: 'Si se despierta más, revisa la hora de la cena, el juego antes de dormir y si las siestas de la tarde son demasiado largas.'
    },
    22: {
      objetivo: 'Que el coche sea un sitio tranquilo y agradable antes del primer viaje, para prevenir mareos por nervios y miedo al coche.',
      pasos: [
        'Con el coche parado y en un lugar tranquilo, entra con {n} en brazos o en su transportín.',
        'Siéntate 5 minutos con él. Dale premios cada 20-30 segundos y algún mordedor.',
        'Abre y cierra una puerta despacio mientras come. No arranques el motor.',
        'Sal del coche antes de que se aburra o se agobie. Repite 2-3 días antes del primer trayecto.'
      ],
      tiempo: '5 minutos',
      material: 'Premios, una manta o su transportín y un mordedor',
      exito: '{n} come los premios, explora con curiosidad o se tumba relajado dentro del coche.',
      siNo: 'Si jadea, tiembla o no come, quédate con la puerta abierta y solo 1 minuto. Si se marea en los viajes, consulta con tu veterinario.'
    },
    23: {
      objetivo: 'Que {n} aprenda que estar cerca de ti con la correa puesta es lo más rentable, antes de salir a la calle con distracciones.',
      pasos: [
        'Ponle el arnés y engancha la correa. Llévala suelta, formando una "U", sin tirar nunca.',
        'Camina por el pasillo o el salón. Cada vez que esté a tu lado, dale un premio a la altura de tu pierna.',
        'Da 5-10 pasos, cambia de dirección y premia cuando te siga. Haz 3 vueltas cortas.',
        'Si muerde la correa, para, ofrécele un mordedor y sigue cuando lo suelte.'
      ],
      tiempo: '2-3 minutos',
      material: 'Arnés, correa ligera y premios pequeños',
      exito: '{n} camina a tu lado varios pasos seguidos con la correa floja, mirándote de vez en cuando.',
      siNo: 'Si tira o se queda parado, quítale la correa y practica igual sin ella. Vuelve a ponerla cuando te siga sin problema.'
    },
    24: {
      objetivo: 'Que {n} observe el mundo de fuera desde la seguridad, para que gente, coches y ruidos de la calle le parezcan normales.',
      pasos: [
        'Elige un portal, banco o terraza tranquila a una hora con poco movimiento.',
        'Si no tiene todas las vacunas, mantenle en brazos o sobre su manta, sin que pise el suelo, y sigue la indicación de tu veterinario.',
        'Siéntate 10 minutos. Cada vez que pase algo nuevo (bici, persona, coche), dale un premio.',
        'No le pidas nada: solo mirar. Si quiere oler el aire o tumbarse, perfecto.',
        'Volved a casa antes de que se canse o se agobie.'
      ],
      tiempo: '10 minutos',
      material: 'Premios, una manta pequeña y el arnés',
      exito: '{n} mira a su alrededor con curiosidad, acepta premios y quizá llega a tumbarse relajado.',
      siNo: 'Si se esconde o no come, estás demasiado cerca del movimiento: busca un sitio más tranquilo o una hora con menos gente.'
    },
    25: {
      objetivo: 'Empezar el autocontrol: que {n} aprenda que quedarse quieto un momento también trae premio.',
      pasos: [
        'Pídele "sentado". Cuando se siente, cuenta mentalmente 1 segundo y dale el premio mientras sigue sentado.',
        'Haz 5 repeticiones con 1 segundo. Si lo consigue, prueba 5 más con 2 segundos.',
        'Antes de que se levante, di "libre" y anímale a moverse. Así sabrá cuándo termina.',
        'A lo largo de la semana sube a 3 segundos, solo si acierta 4 de cada 5 veces.'
      ],
      tiempo: '1-2 minutos, 2-3 veces al día',
      material: 'Premios pequeños',
      exito: '{n} se queda sentado 1-2 segundos mirándote, esperando el premio.',
      siNo: 'Si se levanta antes, vuelve a 1 segundo o menos: premia casi en cuanto se sienta y sube el tiempo más despacio.'
    },
    26: {
      objetivo: 'Que {n} pise texturas distintas con seguridad. Un cachorro acostumbrado a superficies variadas camina más seguro por la calle.',
      pasos: [
        'Busca 3 superficies nuevas: hierba (en un sitio limpio y si tu veterinario lo permite), una rejilla de horno plana o madera.',
        'Pon un premio en el borde de la superficie y deja que {n} se acerque solo.',
        'Si pone una pata, premio. Luego coloca otro premio un poco más dentro.',
        'No le cojas para ponerle encima ni le empujes. Él decide cuándo pisar.',
        'Si aún no puede pisar la calle, usa en casa una toalla, una alfombrilla de goma o un cartón.'
      ],
      tiempo: '3-5 minutos',
      material: 'Premios y 3 superficies distintas',
      exito: '{n} camina sobre las 3 superficies sin dudar o con una duda breve, y sigue buscando premios.',
      siNo: 'Si una superficie le da miedo, déjala en el suelo de casa unos días y pon premios cerca. Prueba de nuevo sin prisa.'
    },
    27: {
      objetivo: 'Llegar a 15 minutos solo en casa, un paso clave para que {n} pueda quedarse tranquilo mientras haces recados cortos.',
      pasos: [
        'Antes de salir: pis, 10 minutos de juego y unos minutos de calma.',
        'Dale el juguete rellenable en su zona y sal sin despedirte.',
        'Quédate fuera 15 minutos. Si puedes, grábale para ver cómo lo lleva.',
        'Vuelve sin fiesta y espera a que esté tranquilo para saludarle.'
      ],
      tiempo: '15 minutos fuera',
      material: 'Juguete rellenable y, si puedes, el móvil para grabarle',
      exito: '{n} come el juguete, se relaja o duerme, y no llora de forma continuada.',
      siNo: 'Si llora mucho, vuelve a 5-10 minutos unos días y sube de 2 en 2 minutos. Si lo pasa muy mal varios días, consulta con un educador canino.'
    },
    28: {
      objetivo: 'Mirar atrás para ver lo que {n} ha avanzado y decidir en qué centrarte el próximo mes.',
      pasos: [
        'Revisa la tabla de pis, las noches y las ausencias del mes. Anota 3 cosas que hayan mejorado.',
        'Anota 1-2 situaciones que todavía le cuesten (un ruido, un tipo de persona, el coche).',
        'Rellena la encuesta corta del plan con esa información.',
        'Elige una de esas situaciones para practicarla 2-3 minutos al día la semana que viene.'
      ],
      tiempo: '15 minutos',
      material: 'Tus tablas y la encuesta del plan',
      exito: 'Tienes claras las mejoras del mes y una o dos cosas concretas para seguir trabajando.',
      siNo: 'Si notas que algo no mejora o empeora (miedo intenso, mordiscos fuertes), consulta con un educador canino o con tu veterinario.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_CACHORRO = root.DETALLE_CACHORRO || { SEMANAS: {}, DETALLE: {} }; Object.assign(root.DETALLE_CACHORRO.SEMANAS, SEMANAS); Object.assign(root.DETALLE_CACHORRO.DETALLE, DETALLE); }
})(this);
