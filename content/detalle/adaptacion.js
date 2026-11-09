/* Detalle de las tareas del programa «adaptacion» (días 1-42). {n} = nombre del perro. */
(function (root) {
  'use strict';
  var SEMANAS = {
    1: { meta: 'Que {n} descomprima: un refugio seguro, horarios previsibles y cero presión.' },
    2: { meta: 'Que {n} empiece a asociar tu presencia, tu voz y tus manos con cosas buenas.' },
    3: { meta: 'Que {n} aprenda las primeras señales y los ruidos y rutinas de la casa sin agobios.' },
    4: { meta: 'Que {n} conozca personas y calles nuevas a su ritmo, siempre con salida.' },
    5: { meta: 'Que {n} gane seguridad con una rutina estable y trabajéis con calma lo que le cuesta.' },
    6: { meta: 'Que {n} se sienta en casa y tengas un plan claro para los próximos meses.' }
  };
  var DETALLE = {
    1: {
      objetivo: 'Un perro recién adoptado necesita un lugar donde nadie le moleste para bajar el estrés acumulado del cambio.',
      pasos: [
        'Elige un rincón tranquilo, lejos de la puerta y del paso, con cama, agua y una manta.',
        'Si quieres, cubre parcialmente el rincón o el transportín con una tela para que sea más recogido.',
        'Deja 2 o 3 premios dentro y aléjate: que lo descubra y lo explore solo.',
        'Acuerda con toda la familia una norma: cuando {n} está en su refugio, nadie le toca ni le llama.'
      ],
      tiempo: '15 minutos de preparación',
      material: 'Cama, manta, cuenco de agua, premios',
      exito: '{n} entra por iniciativa propia, se tumba y llega a dormir allí, aunque al principio sea a ratos.',
      siNo: 'Si no lo usa, prueba otro sitio más tranquilo o donde él ya se haya echado. No le metas ni le cierres dentro.'
    },
    2: {
      objetivo: 'La previsibilidad reduce la ansiedad: cuando sabe qué va a pasar y cuándo, se relaja antes.',
      pasos: [
        'Fija 2 o 3 horas para las comidas y 3 o 4 para las salidas, y escríbelas en un papel visible.',
        'Respeta esas horas con un margen de unos 15 minutos, también el fin de semana.',
        'Usa siempre la misma secuencia antes de salir: arnés, correa, puerta.',
        'Retira la comida que no haya tocado a los 15-20 minutos y ofrécela de nuevo en la siguiente toma.'
      ],
      tiempo: 'Todo el día',
      material: 'Papel con el horario',
      exito: 'Empieza a anticipar las rutinas con calma: se acerca a la hora de comer o espera junto a la puerta sin agitarse.',
      siNo: 'Es normal que coma poco los primeros días por el estrés. Si no come nada durante más de un día, consulta al veterinario.'
    },
    3: {
      objetivo: 'Que {n} decida acercarse construye una confianza mucho más sólida que cualquier contacto impuesto.',
      pasos: [
        'Siéntate en el suelo de lado, sin mirarle de frente, a varios metros de su refugio.',
        'Lanza un premio cerca de ti cada poco, sin llamarle ni hablarle mucho.',
        'Si se acerca, deja un premio en el suelo junto a ti; no intentes tocarle.',
        'A los 10 minutos levántate con calma y vete, haya venido o no.'
      ],
      tiempo: '10 minutos',
      material: 'Premios pequeños y sabrosos',
      exito: 'Se acerca un poco más cada vez, con el cuerpo suelto, la cola baja y relajada y sin mirar a la salida.',
      siNo: 'Si no viene, lanza los premios más lejos de ti, hacia él, y repite mañana. La distancia que él elija es la correcta.'
    },
    4: {
      objetivo: 'Muchos perros adoptados no han aprendido dónde hacer sus necesidades; premiar el acierto fuera es la vía más rápida.',
      pasos: [
        'Sácale cada 3 horas, nada más despertar, tras comer y tras jugar.',
        'Ve siempre a la misma zona y espera en silencio unos 5 minutos.',
        'Cuando termine de hacer pis, premia al momento, allí mismo, y luego da un pequeño paseo.',
        'Si hay un accidente en casa, limpia sin decir nada con un producto enzimático.'
      ],
      tiempo: '5-10 minutos por salida',
      material: 'Premios, bolsas, limpiador enzimático',
      exito: 'Hace pis fuera en la mayoría de salidas y los accidentes en casa se reducen día a día.',
      siNo: 'Si hay escapes, acorta el intervalo entre salidas. Nunca le riñas: solo aprendería a esconderse para hacerlo.'
    },
    5: {
      objetivo: 'Durante la descompresión cada novedad suma estrés; un día tranquilo le ayuda a recuperar el equilibrio.',
      pasos: [
        'Pide a amigos y familia que esperen unas semanas para venir a conocerle.',
        'Mantén el volumen de la casa bajo: tele baja, sin portazos ni música alta.',
        'Haz solo sus salidas habituales por el recorrido conocido.',
        'Ofrécele algo que pueda lamer o masticar en su refugio para relajarse.'
      ],
      tiempo: 'Todo el día',
      material: 'Mordedor o alfombra de lamer',
      exito: 'Duerme ratos largos, bosteza y se estira, y se mueve por casa con más soltura.',
      siNo: 'Si está inquieto o jadea sin calor, reduce aún más los estímulos y deja que se quede en su refugio todo lo que quiera.'
    },
    6: {
      objetivo: 'Un recorrido corto y siempre igual hace que la calle deje de ser una avalancha de novedades.',
      pasos: [
        'Comprueba que el arnés está bien ajustado: deben caber dos dedos y no puede sacárselo.',
        'Haz el mismo recorrido de unos 15 minutos, a una hora con poca gente.',
        'Deja la correa floja y para cuando quiera oler.',
        'Si algo le asusta, apártate con él y aumenta la distancia; no le acerques para que se acostumbre.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa de 2-3 metros, premios',
      exito: 'Olfatea el suelo, camina sin tirar hacia casa y acepta premios durante el paseo.',
      siNo: 'Si se planta o tira hacia casa, acorta el paseo y vuelve. Mañana repite un tramo aún más corto.'
    },
    7: {
      objetivo: 'Revisar la semana te permite ver progresos pequeños que en el día a día pasan desapercibidos.',
      pasos: [
        'Apunta cuánto come, cuántas horas duerme y cuánto rato pasa fuera del refugio.',
        'Compáralo con lo que recuerdes del día 1.',
        'Anota qué cosas le asustan y qué cosas le gustan.',
        'Decide un solo ajuste para la semana que viene.'
      ],
      tiempo: '10 minutos',
      material: 'Libreta o notas del móvil',
      exito: 'Ves al menos una mejora: come mejor, duerme más o se acerca a ti con más frecuencia.',
      siNo: 'Si no ves cambios, es normal: la adaptación completa puede llevar meses. Si no come o notas dolor, acude al veterinario.'
    },
    8: {
      objetivo: 'Que su nombre signifique siempre algo bueno es la base para captar su atención sin presión.',
      pasos: [
        'En un sitio tranquilo, di "{n}" una sola vez con voz suave.',
        'En cuanto te mire, aunque sea de reojo, dale un premio.',
        'Repite 10 veces en sesiones cortas a lo largo del día.',
        'No uses su nombre para nada desagradable, como limpiarle o cortarle las uñas.'
      ],
      tiempo: '3 minutos, 2-3 veces',
      material: 'Premios pequeños',
      exito: 'Gira la cabeza rápido al oír su nombre, con las orejas atentas y el cuerpo relajado.',
      siNo: 'Si no reacciona, prueba en un sitio más tranquilo y con un premio más apetecible. No repitas el nombre una y otra vez.'
    },
    9: {
      objetivo: 'Muchos perros adoptados desconfían de las manos; que las asocie con premios reduce ese miedo.',
      pasos: [
        'Agáchate de lado y ofrece la mano abierta, baja y quieta, con un premio en la palma.',
        'Deja que sea él quien se acerque a cogerlo.',
        'No muevas la mano hacia su cabeza ni intentes acariciarle después.',
        'Repite 5-10 veces y termina antes de que pierda interés.'
      ],
      tiempo: '5 minutos',
      material: 'Premios pequeños',
      exito: 'Coge el premio de tu mano con la boca suave, sin estirarse al máximo ni retroceder de golpe.',
      siNo: 'Si no se atreve, deja el premio en el suelo junto a tu mano y ve acercándolo a la palma poco a poco en días sucesivos.'
    },
    10: {
      objetivo: 'El juego libera tensión y crea vínculo, pero solo funciona si él elige participar.',
      pasos: [
        'Ofrécele un juguete arrastrándolo despacio por el suelo, lejos de él.',
        'Si muestra interés, deja que lo atrape y suéltalo enseguida.',
        'Mantén el juego suave: sin movimientos bruscos ni inclinarte sobre él.',
        'Para a los 5 minutos o en cuanto se aleje.'
      ],
      tiempo: '5 minutos',
      material: 'Juguete blando o cuerda',
      exito: 'Hace reverencias de juego, mueve la cola suelta o vuelve a por el juguete por sí mismo.',
      siNo: 'Si no juega, no insistas: muchos perros tardan semanas en jugar. Prueba otro día o con un juego de buscar premios.'
    },
    11: {
      objetivo: 'Con el paso de los días la rutina tiende a relajarse; mantenerla sostiene la seguridad de {n}.',
      pasos: [
        'Revisa tu horario escrito y anota a qué hora hiciste cada cosa hoy.',
        'Ajusta lo que se haya desviado más de media hora.',
        'Comprueba que todos en casa siguen las mismas normas y señales.',
        'Incluye en la rutina un rato fijo de descanso sin interrupciones.'
      ],
      tiempo: '10 minutos',
      material: 'Horario escrito',
      exito: 'Se anticipa con calma a las rutinas y descansa tranquilo en los ratos de calma.',
      siNo: 'Si cada persona de casa hace las cosas a su manera, poneos de acuerdo en un horario y unas palabras comunes.'
    },
    12: {
      objetivo: 'Olfatear baja el ritmo cardíaco y cansa la mente; es la forma más natural de que un perro se relaje fuera.',
      pasos: [
        'Usa una correa de 2-3 metros y deja que marque él el ritmo.',
        'Para cada vez que quiera oler y espera sin meterle prisa.',
        'Elige zonas con hierba o arbustos y evita las horas de más ruido.',
        'Esparce unos premios por la hierba para animarle a buscar.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés, correa de 2-3 metros, premios',
      exito: 'Pasa largos ratos con la nariz en el suelo y vuelve a casa tranquilo, no excitado.',
      siNo: 'Si va mirando alrededor sin oler, está en alerta: busca un sitio más tranquilo o una hora con menos gente.'
    },
    13: {
      objetivo: 'Una revisión de bienvenida descarta molestias o dolor, que a menudo explican cambios de conducta.',
      pasos: [
        'Pide cita y lleva la documentación que te dieron en la adopción.',
        'Comenta al veterinario cualquier cosa que te llame la atención: cojera, picores, apetito.',
        'Pregunta si puedes esperar fuera o en el coche si la sala está llena.',
        'Lleva premios y dáselos durante toda la visita.'
      ],
      tiempo: '1 hora',
      material: 'Documentación, premios, correa',
      exito: 'Acepta algún premio en la consulta y se recupera con rapidez al volver a casa.',
      siNo: 'Si se angustia mucho, cuéntaselo al veterinario y pregunta por visitas breves solo para entrar, recibir premios y salir.'
    },
    14: {
      objetivo: 'Que {n} busque tu compañía es la señal más clara de que empieza a confiar en ti.',
      pasos: [
        'Apunta cuántas veces se ha acercado a ti hoy sin que le llamaras.',
        'Anota en qué momentos ocurre: tras pasear, por la noche, cuando estás sentado.',
        'Compara con la semana 1 y busca patrones.',
        'Elige un momento del día para potenciarlo con calma y premios.'
      ],
      tiempo: '10 minutos',
      material: 'Libreta o notas del móvil',
      exito: 'Se tumba cerca de ti, te sigue por casa sin ansiedad o se acerca a olerte por su cuenta.',
      siNo: 'Si aún mantiene la distancia, no pasa nada: sigue ofreciendo premios sin pedir nada y deja que llegue a su ritmo.'
    },
    15: {
      objetivo: 'Tener una señal para ir a su cama le da un recurso para calmarse cuando hay jaleo en casa.',
      pasos: [
        'Lanza un premio en su cama; cuando entre a por él, di "a tu sitio" y premia de nuevo allí.',
        'Repite 5 veces y luego espera a que entre él antes de lanzar el premio.',
        'Cuando se tumbe en la cama, deja caer premios tranquilos entre sus patas.',
        'Libérale con una palabra como "vale" y no le mandes nunca allí como castigo.'
      ],
      tiempo: '5 minutos',
      material: 'Su cama, premios',
      exito: 'Se dirige a su cama al oír la señal y se tumba con el cuerpo relajado.',
      siNo: 'Si no entra, lanza el premio solo al borde de la cama y avanza poco a poco. Reduce la sesión si se agobia.'
    },
    16: {
      objetivo: 'Sentarse es una conducta fácil que le da una forma clara de pedir cosas y de ganar premios.',
      pasos: [
        'Pon un premio junto a su nariz y llévalo despacio hacia atrás por encima de su cabeza.',
        'En cuanto su trasero toque el suelo, di "sí" y dale el premio.',
        'Repite 5 veces; cuando lo haga seguido, añade la palabra "sentado" justo antes.',
        'No le empujes el trasero: que lo descubra él.'
      ],
      tiempo: '5 minutos',
      material: 'Premios pequeños',
      exito: 'Se sienta con rapidez y te mira esperando el premio, con el cuerpo suelto.',
      siNo: 'Si retrocede en lugar de sentarse, practica con su espalda cerca de una pared o premia también los pequeños intentos.'
    },
    17: {
      objetivo: 'Asociar los ruidos de casa con algo agradable evita que se conviertan en miedos duraderos.',
      pasos: [
        'Pide a alguien que encienda la aspiradora en la habitación más lejana mientras {n} come.',
        'Mantén la aspiradora quieta y apágala en cuanto termine de comer.',
        'Si come tranquilo, en días sucesivos acércala un poco.',
        'Deja siempre que pueda irse a su refugio si quiere.'
      ],
      tiempo: '5 minutos',
      material: 'Aspiradora, su comida',
      exito: 'Sigue comiendo sin parar, sin levantar la cabeza ni encogerse.',
      siNo: 'Si deja de comer o se aleja, la aspiradora está demasiado cerca: aléjala o pon el sonido más bajo.'
    },
    18: {
      objetivo: 'Aprender poco a poco que te vas y vuelves previene la angustia cuando se queda solo.',
      pasos: [
        'Mientras {n} está tranquilo, sal de la habitación sin despedirte.',
        'Vuelve a los 30-60 segundos con calma, sin saludos efusivos.',
        'Repite 5 veces a lo largo del día, en momentos distintos.',
        'Si te sigue, no pasa nada: practica con una puerta abierta antes de cerrarla.'
      ],
      tiempo: '5 minutos',
      material: 'Ninguno',
      exito: 'Se queda tumbado o te mira salir sin levantarse, y te recibe sin excitación.',
      siNo: 'Si llora o rasca la puerta, acorta a pocos segundos. Si no mejora o hay destrozos, consulta a un profesional cualificado.'
    },
    19: {
      objetivo: 'Pedir permiso antes de tocar le enseña que puede decir que no, y eso le hace más confiado.',
      pasos: [
        'Espera a que se acerque él; no le llames para acariciarle.',
        'Acaricia el pecho o el lateral del cuello 3 segundos, sin pasar la mano por encima de su cabeza.',
        'Retira la mano y observa: si se acerca o te empuja, sigue; si se aparta, para.',
        'Respeta su respuesta siempre, también si se va.'
      ],
      tiempo: '5 minutos',
      material: 'Ninguno',
      exito: 'Se apoya en tu mano o te pide más caricias con el hocico o la pata.',
      siNo: 'Si se lame los labios, bosteza o gira la cabeza, prefiere no ser tocado: para. Si gruñe, está comunicando; no le riñas y aléjate.'
    },
    20: {
      objetivo: 'Un recorrido nuevo pero tranquilo amplía su mundo sin sobrecargarle.',
      pasos: [
        'Elige una zona cercana y tranquila que aún no conozca.',
        'Ve a una hora con poca gente y haz un recorrido de 15-20 minutos.',
        'Deja que huela y explore sin prisas, con la correa floja.',
        'Lleva premios para los momentos en que algo le llame la atención.'
      ],
      tiempo: '15-20 minutos',
      material: 'Arnés, correa de 2-3 metros, premios',
      exito: 'Explora con curiosidad, olfatea y acepta premios en la zona nueva.',
      siNo: 'Si se asusta, vuelve al recorrido conocido y prueba otro día con un tramo nuevo aún más corto.'
    },
    21: {
      objetivo: 'Identificar sus miedos con detalle te permite trabajarlos poco a poco y sin forzar.',
      pasos: [
        'Haz una lista de lo que le asusta: ruidos, personas, objetos, lugares.',
        'Anota a qué distancia empieza a reaccionar con cada cosa.',
        'Ordénalos de menor a mayor miedo.',
        'Marca uno o dos de los más suaves para trabajarlos más adelante.'
      ],
      tiempo: '10 minutos',
      material: 'Libreta',
      exito: 'Tienes una lista clara y sabes a qué distancia {n} está todavía tranquilo.',
      siNo: 'Si hay muchos miedos intensos, gruñidos o intentos de morder, consulta a un educador en positivo o a un etólogo cualificado.'
    },
    22: {
      objetivo: 'Conocer personas nuevas sin presión le enseña que los desconocidos pueden traer cosas buenas.',
      pasos: [
        'Elige a un amigo tranquilo y explícale antes: ni mirar, ni hablar, ni tocar a {n}.',
        'Que se siente de lado y lance premios lejos de él, hacia {n}.',
        'Deja que {n} se acerque si quiere y se vaya cuando quiera.',
        'Termina la visita en 15 minutos, antes de que se canse.'
      ],
      tiempo: '15 minutos',
      material: 'Premios muy apetecibles',
      exito: 'Se acerca a olfatear a la persona y se aleja con calma, sin esconderse ni ladrar.',
      siNo: 'Si se esconde o ladra, que la persona lance los premios más lejos y se quede quieta. Si gruñe, respétalo y aumenta la distancia.'
    },
    23: {
      objetivo: 'Ir sumando calles nuevas poco a poco amplía su zona de confort y su seguridad en la calle.',
      pasos: [
        'Elige una calle cercana y tranquila que aún no haya pisado.',
        'Ve a primera hora o a última, cuando hay menos tráfico.',
        'Deja que explore y huela a su ritmo.',
        'Si algo le preocupa, crúzate de acera o date la vuelta sin dramatizar.'
      ],
      tiempo: '20 minutos',
      material: 'Arnés, correa, premios',
      exito: 'Camina con la cola a media altura, olfatea y no tira para volver a casa.',
      siNo: 'Si se bloquea, retrocede hasta donde estaba tranquilo y termina allí. Vuelve otro día a una hora todavía más tranquila.'
    },
    24: {
      objetivo: 'Asociar "ven" a algo que ya está haciendo garantiza que la palabra se cargue de significado positivo.',
      pasos: [
        'Cuando {n} ya venga hacia ti por su cuenta, di "ven" con voz alegre.',
        'Al llegar, dale un premio muy bueno y una caricia si le gusta.',
        'Repite 5-10 veces al día en casa, en momentos en que seguro viene.',
        'Nunca uses "ven" para algo que no le guste, como el baño o terminar el paseo.'
      ],
      tiempo: '5 minutos',
      material: 'Premios muy apetecibles',
      exito: 'Acelera el paso al oír "ven" y llega con la cola suelta y contento.',
      siNo: 'Si no viene, no repitas la palabra: agáchate, aléjate un poco de él para animarle y premia cuando llegue.'
    },
    25: {
      objetivo: 'Ampliar las ausencias poco a poco, con algo agradable que hacer, prepara a {n} para quedarse solo con calma.',
      pasos: [
        'Rellena un juguete con su comida húmeda o premios y dáselo en su refugio.',
        'Sal de casa o de la habitación 10 minutos con calma, sin despedidas.',
        'Al volver, saluda con tranquilidad y retira el juguete al rato.',
        'Si puedes, graba con el móvil para ver cómo está mientras no estás.'
      ],
      tiempo: '10 minutos',
      material: 'Juguete rellenable, comida o premios',
      exito: 'Está tumbado o tranquilo con el juguete cuando vuelves, sin llantos ni destrozos.',
      siNo: 'Si llora o no toca el juguete, vuelve a ausencias más cortas. Si hay angustia intensa, consulta a un profesional cualificado.'
    },
    26: {
      objetivo: 'Dejar que sea él quien pida y corte el contacto refuerza la confianza y su sensación de control.',
      pasos: [
        'Siéntate tranquilo y espera a que se acerque a pedir mimos.',
        'Acaricia unos segundos donde le guste y para.',
        'Si te vuelve a pedir, sigue; si se aleja o se sacude, deja que se vaya.',
        'Evita abrazos y besos en la cara, aunque te apetezca.'
      ],
      tiempo: '5-10 minutos',
      material: 'Ninguno',
      exito: 'Te busca para recibir caricias, se relaja bajo tu mano y vuelve a pedir más.',
      siNo: 'Si se pone rígido o se aparta, acorta aún más las caricias. Si gruñe, está avisando: para, no le riñas y respeta su espacio.'
    },
    27: {
      objetivo: 'Un paseo largo de olfato cansa su mente y le ayuda a descargar estrés acumulado.',
      pasos: [
        'Elige una zona tranquila con hierba o tierra donde pueda oler a gusto.',
        'Usa una correa más larga y deja que marque él el ritmo.',
        'Para cada vez que quiera oler y espera sin tirones.',
        'Esconde algún premio entre la hierba para que lo busque.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga de 3-5 metros, premios',
      exito: 'Vuelve a casa tranquilo y duerme profundamente después del paseo.',
      siNo: 'Si se pasa el paseo en alerta, acórtalo y vuelve a una zona conocida. La calidad importa más que la duración.'
    },
    28: {
      objetivo: 'A mitad del programa conviene celebrar los avances y ajustar lo que aún no funciona.',
      pasos: [
        'Relee las notas de la semana 1 y compáralas con hoy.',
        'Apunta tres cosas que han mejorado, aunque sean pequeñas.',
        'Anota una cosa que aún le cuesta.',
        'Decide si mantienes el ritmo o vas más despacio la semana que viene.'
      ],
      tiempo: '10 minutos',
      material: 'Libreta',
      exito: 'Encuentras mejoras claras en su calma, su apetito, su sueño o su forma de buscarte.',
      siNo: 'Si notas retrocesos, revisa si ha habido demasiados cambios recientes y vuelve a la rutina de la semana 1 unos días.'
    },
    29: {
      objetivo: 'Trabajar los miedos a muy poca intensidad permite cambiar la emoción sin desbordarle.',
      pasos: [
        'Elige el miedo más suave de la lista del día 21.',
        'Ponte a una distancia en la que {n} lo vea pero siga tranquilo y acepte premios.',
        'Cada vez que mire el estímulo, dale un premio; si se va, deja que se vaya.',
        'Haz sesiones de 3-5 minutos y termina siempre con él tranquilo.'
      ],
      tiempo: '5 minutos',
      material: 'Premios muy apetecibles, lista del día 21',
      exito: 'Mira el estímulo y luego te mira a ti esperando el premio, con el cuerpo relajado.',
      siNo: 'Si no acepta premios o se queda rígido, estás demasiado cerca: aléjate. Nunca le acerques para que se acostumbre.'
    },
    30: {
      objetivo: 'Una visita breve y controlada le enseña que las personas en casa no son una amenaza.',
      pasos: [
        'Avisa a la visita: que ignore a {n} y le deje acercarse solo si quiere.',
        'Deja su refugio libre y el paso hacia él despejado.',
        'Dale un mordedor o un juguete rellenable para que tenga algo que hacer.',
        'Termina la visita a los 30 minutos, aunque vaya bien.'
      ],
      tiempo: '30 minutos',
      material: 'Juguete rellenable o mordedor, premios',
      exito: 'Descansa o se mueve con normalidad durante la visita, aunque no se acerque.',
      siNo: 'Si ladra o se esconde, que la visita se quede sentada y en silencio. Si gruñe, es un aviso: no le riñas y dale más espacio.'
    },
    31: {
      objetivo: 'Ampliar las ausencias solo cuando las anteriores van bien evita que aparezca la angustia por separación.',
      pasos: [
        'Repite primero una ausencia de 10 minutos para comprobar que sigue tranquilo.',
        'Si va bien, sal 20 minutos y, en otro momento del día, 30.',
        'Sigue usando el juguete rellenable y saliendo sin despedidas.',
        'Graba o escucha desde la puerta los primeros minutos.'
      ],
      tiempo: '30 minutos',
      material: 'Juguete rellenable, móvil para grabar',
      exito: 'Se queda tumbado o dormido, sin llantos, ladridos ni destrozos.',
      siNo: 'Si muestra angustia, vuelve al último tiempo que llevaba bien y sube más despacio. Si no mejora, consulta a un profesional.'
    },
    32: {
      objetivo: 'Los juegos de olfato y de buscar comida cansan la mente y le dan seguridad en sí mismo.',
      pasos: [
        'Esconde premios en una alfombra de olfato, una toalla enrollada o cajas de cartón.',
        'Empieza muy fácil, con los premios a la vista.',
        'Deja que lo resuelva solo y anímale con voz suave si se atasca.',
        'Aumenta la dificultad poco a poco en los días siguientes.'
      ],
      tiempo: '10 minutos',
      material: 'Alfombra de olfato, toalla o cajas, premios',
      exito: 'Busca con interés, mueve la cola y se le ve satisfecho y relajado al terminar.',
      siNo: 'Si se frustra o se rinde, hazlo más fácil. El objetivo es que gane, no que lo pase mal.'
    },
    33: {
      objetivo: 'La correa larga permite practicar la llamada con más distancia, de forma segura y sin depender de soltarle.',
      pasos: [
        'Busca un sitio vallado y tranquilo, y engancha una correa larga al arnés, nunca al collar.',
        'Deja que explore y, cuando ya venga hacia ti, di "ven" y premia muy bien.',
        'Practica 5 llamadas como máximo y deja que vuelva a explorar tras cada una.',
        'Recoge la correa con calma, sin tirones.'
      ],
      tiempo: '15 minutos',
      material: 'Arnés, correa larga de 5-10 metros, premios muy buenos',
      exito: 'Se gira y viene hacia ti alegre al oír "ven", aunque esté oliendo algo.',
      siNo: 'Si no viene, no le arrastres con la correa: acércate un poco, aléjate corriendo para animarle y premia al llegar.'
    },
    34: {
      objetivo: 'Mantener los paseos de olfato como parte fija de la semana sostiene su bienestar emocional.',
      pasos: [
        'Repite una zona de olfato que le guste o prueba una nueva parecida.',
        'Deja la correa larga y floja, y que él decida el ritmo.',
        'Haz pausas para que se tumbe a observar si le apetece.',
        'Termina con algo tranquilo, como buscar premios en la hierba.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga, premios',
      exito: 'Pasea con la cabeza baja oliendo, el cuerpo suelto y sin tirar.',
      siNo: 'Si tira mucho, es que algo le excita o le preocupa: para, espera a que se calme y elige zonas más tranquilas.'
    },
    35: {
      objetivo: 'El descanso nocturno es un buen termómetro de lo seguro que se siente {n} en casa.',
      pasos: [
        'Apunta si duerme toda la noche, si se despierta y cuántas veces.',
        'Revisa si la última salida y la última comida son a horas regulares.',
        'Comprueba que su cama está en un sitio tranquilo, sin corrientes ni ruidos.',
        'Si te busca de noche, valora dejar su cama cerca de tu habitación.'
      ],
      tiempo: '10 minutos',
      material: 'Libreta',
      exito: 'Duerme del tirón, en posturas relajadas, de lado o panza arriba.',
      siNo: 'Si se despierta inquieto o llora, acércale a ti. Si notas dolor, sed excesiva o cambios bruscos, consulta al veterinario.'
    },
    36: {
      objetivo: 'Visitar un sitio nuevo durante poco rato fortalece su confianza para explorar el mundo contigo.',
      pasos: [
        'Elige un sitio tranquilo: un parque poco transitado o una terraza vacía.',
        'Ve a una hora con poca gente y quédate 10-15 minutos como mucho.',
        'Deja que observe y huela, y premia la calma.',
        'Vete mientras aún está a gusto, no cuando ya está agobiado.'
      ],
      tiempo: '10-15 minutos',
      material: 'Arnés, correa, premios',
      exito: 'Explora con curiosidad, olfatea y acepta premios en el sitio nuevo.',
      siNo: 'Si se agobia, vete sin más y vuelve otro día a un sitio aún más tranquilo o durante menos tiempo.'
    },
    37: {
      objetivo: 'Conocer sus juegos favoritos te da una herramienta para motivarle y reforzar vuestro vínculo.',
      pasos: [
        'Prueba un juego distinto cada vez: buscar, tirar de una cuerda, perseguir un juguete.',
        'Juega 2-3 minutos con cada uno y observa cuál le engancha más.',
        'Apunta cuál prefiere y repítelo en los próximos días.',
        'Haz pausas frecuentes para que no se sobreexcite.'
      ],
      tiempo: '10 minutos',
      material: 'Varios juguetes, premios',
      exito: 'Te trae el juguete, hace reverencias de juego o te pide seguir.',
      siNo: 'Si no le interesa ningún juego, sigue con juegos de olfato: para muchos perros adoptados son su juego favorito.'
    },
    38: {
      objetivo: 'Llegar a una hora de ausencia con calma le prepara para la vida diaria real de la familia.',
      pasos: [
        'Comprueba que las ausencias de 30 minutos siguen yendo bien.',
        'Sácale a pasear antes y deja agua y un juguete rellenable.',
        'Sal 1 hora con calma, sin despedidas, y graba si puedes.',
        'Vuelve con tranquilidad y saluda cuando él esté calmado.'
      ],
      tiempo: '1 hora',
      material: 'Juguete rellenable, agua, móvil para grabar',
      exito: 'En la grabación se le ve descansando o dormido la mayor parte del tiempo.',
      siNo: 'Si hay llantos o destrozos, vuelve a ausencias más cortas. Si persiste, consulta a un profesional cualificado.'
    },
    39: {
      objetivo: 'Repasar lo aprendido en distintos momentos y sitios hace que las señales sean más sólidas.',
      pasos: [
        'Practica nombre, sentado, a tu sitio y ven, 3 repeticiones de cada uno.',
        'Prueba en una habitación diferente o en el jardín si lo tienes.',
        'Premia cada acierto y termina con la señal que mejor le salga.',
        'Si una falla, vuelve a hacerla más fácil.'
      ],
      tiempo: '10 minutos',
      material: 'Premios',
      exito: 'Responde con ganas a todas las señales y se le ve contento trabajando contigo.',
      siNo: 'Si alguna no sale, practícala en un sitio más tranquilo o más cerca de ti. Vuelve a lo fácil antes de subir dificultad.'
    },
    40: {
      objetivo: 'La adaptación no termina en 6 semanas; un plan claro te ayuda a seguir avanzando sin prisas.',
      pasos: [
        'Repasa tus notas y elige 2 o 3 objetivos para los próximos meses.',
        'Para cada uno, apunta el primer paso pequeño y concreto.',
        'Incluye los miedos que siguen pendientes y cómo trabajarlos poco a poco.',
        'Valora si te vendría bien la ayuda de un educador en positivo.'
      ],
      tiempo: '15 minutos',
      material: 'Libreta',
      exito: 'Tienes un plan sencillo, realista y adaptado a lo que necesita {n}.',
      siNo: 'Si te abruma, elige un solo objetivo. Si hay gruñidos o miedos intensos, busca un profesional cualificado.'
    },
    41: {
      objetivo: 'Los paseos de olfato deben quedarse para siempre como parte de su rutina de bienestar.',
      pasos: [
        'Elige una de sus zonas favoritas para olfatear.',
        'Deja que él marque el ritmo con la correa larga y floja.',
        'Incluye algún juego de buscar premios durante el paseo.',
        'Observa cuánto ha cambiado su forma de pasear desde la semana 1.'
      ],
      tiempo: '30-45 minutos',
      material: 'Arnés, correa larga, premios',
      exito: 'Pasea relajado, explora con seguridad y te busca de vez en cuando con la mirada.',
      siNo: 'Si algún día le notas más tenso, no pasa nada: vuelve a un recorrido conocido y más tranquilo.'
    },
    42: {
      objetivo: 'Mirar atrás te permite valorar todo lo que habéis conseguido y reforzar vuestro compromiso.',
      pasos: [
        'Busca fotos o notas del primer día y compáralas con cómo está hoy.',
        'Apunta tres cambios de los que estés orgulloso.',
        'Rellena la encuesta final del programa.',
        'Celébralo con {n} haciendo su actividad favorita.'
      ],
      tiempo: '15 minutos',
      material: 'Fotos, notas',
      exito: 'Ves a {n} más relajado, más curioso y más unido a ti que el primer día.',
      siNo: 'Si aún le cuestan cosas, es normal: muchos perros tardan meses en adaptarse del todo. Sigue a su ritmo con tu plan.'
    }
  };
  var api = { SEMANAS: SEMANAS, DETALLE: DETALLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.DETALLE_PROGRAMAS = root.DETALLE_PROGRAMAS || {}; root.DETALLE_PROGRAMAS.adaptacion = api; }
})(this);
