/*
 * Programas para perros adultos y recién adoptados: 6 semanas, una tarea al día.
 *
 * ESTADO: BORRADOR PENDIENTE DE REVISIÓN por un educador canino titulado.
 * Reglas: solo educación en positivo; nada de collares de castigo, tirones ni sprays.
 * Si hay mordiscos o amenazas a personas, NO se vende el plan: se deriva a un profesional.
 * {n} = nombre del perro.
 *
 * Funciona en navegador (window.PROGRAMAS) y en Node (require).
 */
(function (root) {
  'use strict';

  var PROGRAMAS = {
    correa: {
      titulo: 'Paseos sin tirones',
      corto: 'tirar de la correa',
      icono: 'correa',
      porQue: 'Tira porque le funciona: cada vez que tira y avanza, aprende que tirar es la forma de llegar antes. Además, la calle está llena de olores y estímulos y va más rápido que tú. No es desobediencia ni querer mandar: es un hábito que se cambia enseñándole que con la correa floja se avanza, y tirando no.',
      detalles: [
        ['siempre', 'Tira todo el paseo', 'De principio a fin'],
        ['estimulos', 'Al ver perros, gatos o gente', 'Se lanza hacia ellos'],
        ['salida', 'Al salir de casa', 'Luego se calma un poco']
      ],
      notaDetalle: {
        siempre: 'Como tira todo el paseo, los primeros días harás paseos más cortos y más tranquilos: la calidad importa más que los kilómetros.',
        estimulos: 'Como se lanza al ver perros o gente, la clave será la distancia: practicarás a la distancia a la que todavía es capaz de mirarte y coger un premio.',
        salida: 'Como lo peor es la salida, trabajarás la calma en la puerta antes de que el paseo empiece.'
      },
      primerosDias: [
        ['Material', 'Cambia el collar por un arnés en Y con anilla delante en el pecho y una correa de 2 metros. Nada de correas extensibles: le enseñan que tirar alarga la correa.'],
        ['La regla del árbol', 'En cuanto la correa se tense, te paras en seco. Sin hablar ni tirar. Cuando afloje (aunque sea un poco), dices "bien" y avanzas. Hoy solo 10 minutos así.'],
        ['El sitio que paga', 'Lleva premios pequeños. Cada vez que camine a tu lado con la correa floja, premio a la altura de tu pierna. Ese es "su sitio": el que da premios.']
      ],
      pasos: [
        'Usa un arnés con anilla en el pecho y una correa fija de 2 metros. Las extensibles enseñan a tirar.',
        'Regla del árbol: correa tensa = te paras. Correa floja = avanzas. Sé constante: si a veces tirar funciona, seguirá tirando.',
        'Premia la posición correcta junto a tu pierna, muchas veces al principio y cada vez menos.',
        'Cambia de dirección con alegría cuando se adelante, antes de que tense la correa.',
        'Deja que olfatee como premio: "libre" y 1 minuto para oler cuando haya caminado bien.',
        'Si se lanza a perros o personas, aumenta la distancia hasta que pueda mirarte, y premia que mire y vuelva a ti.',
        'Cansa la cabeza antes del paseo (5 minutos de olfato en casa): llega más tranquilo a la calle.'
      ],
      evita: ['Tirones de correa o collares de castigo (de púas, ahorque o eléctricos)', 'Correas extensibles mientras aprende', 'Regañarle cuando tira: no le dice qué hacer', 'Paseos largos y nerviosos: mejor cortos y buenos'],
      semanas: [
        { foco: 'Material y la regla del árbol', tareas: [
          ['Arnés nuevo', 'Ponle el arnés en casa con premios, 3 veces hoy. Que sea algo bueno antes de salir.'],
          ['El árbol', 'Paseo de 10 minutos: correa tensa = te paras, floja = avanzas. Cuenta cuántas veces te paras.'],
          ['Su sitio', 'En casa, sin correa: premia a {n} cada vez que esté junto a tu pierna izquierda. 20 premios.'],
          ['Árbol + premio', 'Paseo de 10 minutos con la regla del árbol y premios cuando vaya a tu lado.'],
          ['Calma en la puerta', 'Antes de abrir la puerta, espera a que {n} se siente o se calme. Si se lanza, cierra y vuelve a esperar.'],
          ['Paseo de olfato', 'Un paseo sin exigir nada: a su ritmo y oliendo. También es necesario.'],
          ['Revisa la semana', '¿Te has parado menos veces que el día 2? Apúntalo.']
        ] },
        { foco: 'Caminar a tu lado', tareas: [
          ['Pasillo de premios', 'En un pasillo o calle tranquila, da 3 pasos y premia si va a tu lado. Sube a 5 pasos.'],
          ['Cambio de sentido', 'Cuando se adelante, di "vamos" alegre y gira 180 grados. Premia cuando te alcance.'],
          ['Olfatear como premio', 'Tras 1 minuto caminando bien, di "libre" y deja que huela 1 minuto.'],
          ['Calle tranquila', 'Repite el árbol en una calle algo más concurrida, a una hora tranquila.'],
          ['Menos premios', 'Premia cada 3–4 pasos en vez de cada paso.'],
          ['Paseo de olfato', 'Paseo libre a su ritmo, sin exigencias.'],
          ['Revisa la semana', 'Graba 30 segundos de paseo y compáralo con el día 1.']
        ] },
        { foco: 'Distracciones a distancia', tareas: [
          ['Mírame', 'En casa: di su nombre y premia cuando te mire. 10 veces, 3 veces al día.'],
          ['Ver sin lanzarse', 'Desde lejos, mira con {n} a otros perros o personas. Premia cada vez que los mire y vuelva a mirarte.'],
          ['Distancia buena', 'Busca la distancia a la que puede coger un premio. Esa es su zona de trabajo: no te acerques más.'],
          ['Arco', 'Cuando cruces a alguien, haz un arco amplio en vez de pasar de frente.'],
          ['Media vuelta de emergencia', 'Practica en calma: "vamos", media vuelta y premio. La usarás cuando algo le supere.'],
          ['Paseo de olfato', 'Paseo tranquilo por un sitio con pocos estímulos.'],
          ['Revisa la semana', '¿A qué distancia puede ver a otro perro sin lanzarse? Apúntala.']
        ] },
        { foco: 'Acercar poco a poco', tareas: [
          ['Un paso más cerca', 'Repite el ejercicio de mirar y volver, un poco más cerca que la semana pasada.'],
          ['Paseo de cabeza', 'Antes de salir, 5 minutos de juego de olfato en casa. Compara cómo sale.'],
          ['Ritmo cambiante', 'Alterna paso lento, normal y rápido. Premia que se adapte a tu ritmo.'],
          ['Calle con más gente', 'Paseo de 15 minutos por una calle con más gente, con la regla del árbol.'],
          ['Saludos educados', 'Solo saluda a otros perros si la correa está floja. Si tira, os alejáis.'],
          ['Paseo de olfato', 'Paseo libre a su ritmo.'],
          ['Revisa la semana', '¿Cuántas veces te has parado hoy en 15 minutos?']
        ] },
        { foco: 'Paseos reales', tareas: [
          ['Paseo completo', 'Tu paseo de siempre aplicando todo: árbol, premios, olfato como premio.'],
          ['Menos premios aún', 'Premia de vez en cuando y con más olfateo como recompensa.'],
          ['Sitio nuevo', 'Pasea por una zona nueva. Todo será más difícil: baja la exigencia.'],
          ['Con prisa no', 'Si un día vas con prisa, paseo corto en vez de dejarle tirar.'],
          ['Otra persona', 'Que otra persona de casa pasee a {n} con las mismas reglas.'],
          ['Paseo de olfato', 'Paseo libre a su ritmo.'],
          ['Revisa la semana', 'Graba otros 30 segundos y compáralos con la semana 2.']
        ] },
        { foco: 'Consolidar', tareas: [
          ['Lo que más le cuesta', 'Dedica el paseo a la situación que más le cuesta, a la distancia buena.'],
          ['Correa siempre floja', 'Reto: 2 minutos seguidos sin tensar la correa.'],
          ['Repaso de distancia', 'Vuelve a medir su distancia a otros perros. ¿Ha mejorado?'],
          ['Paseo largo', 'Un paseo más largo de lo normal, con pausas de olfato.'],
          ['Sin premios a mano', 'Prueba un tramo con los premios en la riñonera: premia solo al final del tramo.'],
          ['Paseo de olfato', 'Paseo libre a su ritmo.'],
          ['¡Lo habéis conseguido!', 'Compara el vídeo del día 7 con hoy. Rellena la encuesta final.']
        ] }
      ]
    },

    ladridos: {
      titulo: 'Menos ladridos',
      corto: 'ladrar mucho',
      icono: 'chispa',
      porQue: 'Ladrar es su forma de avisar, de pedir o de soltar nervios, y casi siempre le ha funcionado: el repartidor se va, alguien le mira o la persona de la ventana desaparece. Para que ladre menos hay que entender cuándo ladra, quitarle ocasiones y enseñarle qué hacer en su lugar. Gritarle suele empeorarlo: para él es que tú también ladras.',
      detalles: [
        ['puerta', 'Al timbre o a ruidos del rellano', 'Avisa de todo lo que pasa fuera'],
        ['ventana', 'A gente o perros que ve', 'Desde la ventana, el balcón o en la calle'],
        ['atencion', 'Para pedir algo', 'Comida, juego o que le hagas caso']
      ],
      notaDetalle: {
        puerta: 'Como ladra al timbre y a los ruidos, el trabajo principal será que el timbre pase a anunciar algo bueno y que tenga un sitio al que ir.',
        ventana: 'Como ladra a lo que ve, lo primero es quitarle ese "puesto de vigilancia" mientras aprende.',
        atencion: 'Como ladra para pedir, la clave es que el ladrido deje de funcionar y que el silencio funcione mucho mejor.'
      },
      primerosDias: [
        ['Apunta cuándo', 'Hoy, apunta cada vez que ladre: hora, qué lo provocó y cuánto duró. Es tu mapa para los próximos días.'],
        ['Quita ocasiones', 'Si ladra a la ventana, cierra la persiana a medias o pon vinilo translúcido en la parte baja. Si ladra a ruidos, deja una radio baja de fondo.'],
        ['Premia el silencio', 'Cada vez que algo que suele hacerle ladrar pase y {n} se quede callado, premio en el momento. Sí, también cuenta.']
      ],
      pasos: [
        'Apunta cuándo ladra: el patrón te dice qué trabajar.',
        'Quita ocasiones mientras aprende: vistas a la calle, ruidos de fondo, timbre (puedes poner uno de móvil).',
        'Cubre sus necesidades: paseo, olfato y juego de cabeza. Un perro aburrido ladra más.',
        'Enséñale una alternativa: ir a su cama o mirarte cuando oye algo, con un premio muy bueno.',
        'Para el ladrido por atención: no respondas al ladrido (ni para regañar) y responde enseguida al silencio.',
        'Si ladra a algo, agradécelo con calma ("gracias, ya lo veo"), llámale hacia ti y premia que venga.',
        'Sé constante con toda la familia: si a veces el ladrido funciona, ladrará más.'
      ],
      evita: ['Gritarle: para él es que tú también ladras', 'Collares antiladridos (de spray, vibración o descarga)', 'Castigarle por avisar', 'Dejarle horas en el balcón vigilando la calle'],
      semanas: [
        { foco: 'Entender cuándo ladra', tareas: [
          ['Diario de ladridos', 'Apunta cada ladrido de hoy: hora, motivo y duración.'],
          ['Quitar ocasiones', 'Aplica 1 cambio en casa para quitarle su ocasión de ladrido más frecuente.'],
          ['Silencio que paga', 'Premia 10 veces hoy a {n} justo cuando algo pasa y no ladra.'],
          ['Más olfato', 'Añade 10 minutos de juego de olfato al día: esconde premios por casa.'],
          ['Su cama, su sitio', 'Enséñale "a tu sitio": premio en la cama cada vez que va. 10 veces.'],
          ['Paseo de olfato', 'Un paseo largo y tranquilo, dejándole oler a su ritmo.'],
          ['Revisa la semana', 'Compara tu diario del día 1 con hoy. ¿Ha bajado algo?']
        ] },
        { foco: 'Una alternativa al ladrido', tareas: [
          ['A tu sitio con ruido', 'Pon un ruido flojo (vídeo de timbre bajito) y premia en su cama.'],
          ['Mírame', 'Di su nombre y premia cuando te mire. 10 veces, 3 veces al día.'],
          ['Gracias, ya lo veo', 'Cuando ladre a algo, di "gracias" con calma, llámale y premia que venga.'],
          ['Silencio que paga', 'Sigue premiando los momentos en que podría ladrar y no lo hace.'],
          ['Juego de pensar', 'Juguete rellenable o un premio bajo uno de 3 vasos, 10 minutos.'],
          ['Paseo de olfato', 'Paseo tranquilo a su ritmo.'],
          ['Revisa la semana', 'Repite el diario de ladridos un día entero.']
        ] },
        { foco: 'Practicar con el detonante', tareas: [
          ['Detonante flojito', 'Reproduce su detonante muy suave (sonido de timbre, alguien en el rellano) y premia antes de que ladre.'],
          ['Un poco más', 'Sube un poco la intensidad. Si ladra, vuelve al nivel anterior.'],
          ['Timbre = premio', 'Que alguien de casa toque el timbre y tú lances premios a su cama.'],
          ['Visita de prueba', 'Pide a un amigo que llame. {n} a su cama con un juguete rellenable.'],
          ['Silencio que paga', 'Premia el silencio en situaciones reales.'],
          ['Paseo de olfato', 'Paseo tranquilo a su ritmo.'],
          ['Revisa la semana', '¿Qué detonante le cuesta más? Apúntalo.']
        ] },
        { foco: 'Situaciones reales', tareas: [
          ['Repartidor', 'Si esperas un paquete, prepara premios y su cama antes de que llegue.'],
          ['Ventana con ayuda', 'Abre un poco las vistas un rato corto contigo al lado, premiando la calma.'],
          ['Ladrido por atención', 'Si te ladra para pedir, date la vuelta. Cuando calle 3 segundos, atiéndele.'],
          ['Gracias + llamada', 'Practica "gracias" y la llamada en 3 situaciones reales.'],
          ['Más cabeza', 'Juego de olfato antes de los momentos en los que suele ladrar.'],
          ['Paseo de olfato', 'Paseo tranquilo a su ritmo.'],
          ['Revisa la semana', 'Diario de ladridos de un día. Compáralo con el día 1.']
        ] },
        { foco: 'Toda la familia igual', tareas: [
          ['Reunión familiar', 'Explica las reglas a todos: nadie responde al ladrido, todos premian el silencio.'],
          ['Otra persona', 'Que otra persona de casa practique "a tu sitio" con el timbre.'],
          ['Visita real', 'Recibe una visita con {n} en su sitio y un juguete rellenable.'],
          ['Menos premios', 'Premia el silencio de vez en cuando, ya no siempre.'],
          ['Repaso', 'Repite el ejercicio de la semana que mejor funcionó.'],
          ['Paseo de olfato', 'Paseo tranquilo a su ritmo.'],
          ['Revisa la semana', '¿Cuántos ladridos hoy frente al día 1?']
        ] },
        { foco: 'Consolidar', tareas: [
          ['El más difícil', 'Practica con el detonante que más le cuesta, a baja intensidad.'],
          ['Sin ayuda', 'Deja una ocasión de las que quitaste (por ejemplo, la persiana) y observa.'],
          ['Rutina fija', 'Revisa que tenga cada día paseo, olfato y juego de cabeza.'],
          ['Visita 2', 'Otra visita con la rutina de la cama.'],
          ['Silencio que paga', 'Sigue premiando el silencio de vez en cuando, para siempre.'],
          ['Paseo de olfato', 'Paseo tranquilo a su ritmo.'],
          ['¡Lo habéis conseguido!', 'Diario de ladridos final y encuesta.']
        ] }
      ]
    },

    solo: {
      titulo: 'Quedarse solo con calma',
      corto: 'quedarse solo',
      icono: 'puerta',
      porQue: 'Para muchos perros quedarse solo es difícil: no saben qué va a pasar ni cuándo volverás. No lo hace "para vengarse": los destrozos, los ladridos o el pis son señales de que lo pasa mal. Se mejora enseñándole poco a poco, con ausencias tan cortas que no llegue a agobiarse, y subiendo a su ritmo.',
      detalles: [
        ['llora', 'Llora o ladra', 'Se le oye desde fuera'],
        ['destroza', 'Destroza cosas', 'Puertas, cojines, muebles'],
        ['pis', 'Hace pis o caca', 'Aunque sepa hacerlo fuera']
      ],
      notaDetalle: {
        llora: 'Como llora o ladra, una grabación con el móvil te dirá cuándo empieza: ese será tu punto de partida.',
        destroza: 'Como destroza, al principio lo dejarás en un espacio seguro y sin cosas que pueda romper, para que no se haga daño.',
        pis: 'Si hace pis o caca solo cuando se queda solo, merece la pena comentarlo con el veterinario para descartar otras causas.'
      },
      primerosDias: [
        ['Grábale', 'Deja el móvil grabando y sal 5 minutos. Al volver, mira cuándo empieza a llorar o a ponerse nervioso: ese es su límite de hoy.'],
        ['Espacio seguro', 'Prepara una zona tranquila con su cama, agua y un juguete rellenable (comida húmeda congelada dura más).'],
        ['Salidas y llegadas aburridas', 'Nada de despedidas largas ni fiestas al volver. Sal y entra como si nada; saluda cuando esté tranquilo.']
      ],
      pasos: [
        'Mide su límite: grábale para saber cuánto tiempo aguanta tranquilo.',
        'Practica ausencias más cortas que ese límite y sube poco a poco. Si se agobia, vuelve atrás.',
        'Separa tus señales de salida (llaves, abrigo) de irte: cógelas y no te vayas, varias veces al día.',
        'Dale un juguete rellenable solo cuando te vas: tu salida anuncia algo bueno.',
        'Antes de irte: paseo, olfato y un rato de calma. Un perro cansado y tranquilo lo lleva mejor.',
        'Mientras aprende, evita dejarle solo más tiempo del que aguanta: pide ayuda a alguien o a una guardería.',
        'Si es intenso (se hace daño, no come, dura mucho), consulta con tu veterinario y con un educador.'
      ],
      evita: ['Castigarle al volver por lo que ha roto o ensuciado', 'Irte a escondidas', 'Dejarle de golpe toda la jornada mientras aprende', 'Encerrarle en un transportín si no está acostumbrado'],
      semanas: [
        { foco: 'Medir y preparar', tareas: [
          ['Grábale', 'Sal 5 minutos con el móvil grabando. Apunta cuándo empieza a agobiarse.'],
          ['Espacio seguro', 'Prepara su zona: cama, agua, juguete rellenable y sin cosas que pueda romper.'],
          ['Llaves sin salir', 'Coge las llaves y siéntate en el sofá. 10 veces hoy.'],
          ['Juguete de salida', 'Dale el juguete rellenable solo cuando vayas a salir de la habitación.'],
          ['Puertas que se cierran', 'Cierra la puerta de la habitación 10 segundos estando tú dentro de casa.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo antes de tu ausencia más larga del día.'],
          ['Revisa la semana', 'Repite la grabación de 5 minutos. ¿Tarda más en agobiarse?']
        ] },
        { foco: 'Ausencias muy cortas', tareas: [
          ['30 segundos', 'Sal de casa 30 segundos, 5 veces. Vuelve antes de que se agobie.'],
          ['Abrigo sin salir', 'Ponte el abrigo y quítatelo sin irte. 10 veces.'],
          ['1 minuto', 'Sube a 1 minuto si los 30 segundos fueron bien.'],
          ['Llegadas aburridas', 'Al volver, ignora la fiesta 1 minuto y saluda cuando esté tranquilo.'],
          ['2 minutos', 'Sube a 2 minutos con el juguete rellenable.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo.'],
          ['Revisa la semana', 'Graba una ausencia de 2 minutos. ¿Está tranquilo?']
        ] },
        { foco: 'Subir el tiempo', tareas: [
          ['5 minutos', 'Ausencia de 5 minutos con el juguete. Graba.'],
          ['Señales mezcladas', 'Coge llaves y abrigo y sal 1 minuto. Otras veces cógelos y no salgas.'],
          ['10 minutos', 'Sube a 10 minutos si los 5 fueron bien.'],
          ['Calma antes', 'Antes de salir: 5 minutos de olfato y 5 de calma en el sofá.'],
          ['Paso atrás', 'Hoy una ausencia más corta que ayer: las subidas no son en línea recta.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo.'],
          ['Revisa la semana', 'Graba 10 minutos. ¿Cuándo aparece el primer signo de agobio?']
        ] },
        { foco: 'Ausencias de verdad', tareas: [
          ['15 minutos', 'Ausencia de 15 minutos. Aprovecha para tirar la basura o comprar el pan.'],
          ['Horas variadas', 'Sal a horas distintas, no solo cuando sueles ir a trabajar.'],
          ['20 minutos', 'Sube a 20 minutos si va bien.'],
          ['Sin juguete', 'Una ausencia corta sin juguete rellenable: ¿cómo lo lleva?'],
          ['30 minutos', 'Sube a 30 minutos con el juguete.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo.'],
          ['Revisa la semana', 'Graba la ausencia más larga de la semana.']
        ] },
        { foco: 'Acercarse a tu rutina', tareas: [
          ['45 minutos', 'Ausencia de 45 minutos con el juguete.'],
          ['Rutina de salida real', 'Haz tu rutina real de ir a trabajar y sal 20 minutos.'],
          ['1 hora', 'Sube a 1 hora si va bien.'],
          ['Ayuda en días largos', 'Organiza quién pasa a verle los días que estarás fuera muchas horas.'],
          ['Repaso', 'Repite la ausencia que mejor salió esta semana.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo.'],
          ['Revisa la semana', 'Graba 1 hora (mira solo trozos). ¿Descansa?']
        ] },
        { foco: 'Consolidar', tareas: [
          ['1 hora y media', 'Sube a 90 minutos si la hora fue bien.'],
          ['Sin rutina previa', 'Sal sin el ritual de siempre, para que cualquier salida sea normal.'],
          ['2 horas', 'Sube a 2 horas con el juguete y la zona segura.'],
          ['Llegada tranquila', 'Revisa que vuestras llegadas sigan siendo tranquilas.'],
          ['Plan a futuro', 'Apunta su tiempo máximo cómodo y no lo superes de golpe.'],
          ['Paseo de olfato', 'Paseo largo y tranquilo.'],
          ['¡Lo habéis conseguido!', 'Compara la grabación del día 1 con la de hoy. Rellena la encuesta final.']
        ] }
      ]
    },

    adaptacion: {
      titulo: 'Adaptarse a su nueva casa',
      corto: 'adaptarse a casa',
      icono: 'casa',
      porQue: 'Un perro recién adoptado lo ha cambiado todo: casa, personas, olores y rutinas. Es normal que al principio esté asustado, no coma bien, haga pis dentro o esté nervioso. Se suele hablar de la regla 3-3-3: unos 3 días para descomprimir, unas 3 semanas para aprender la rutina y unos 3 meses para sentirse en casa. Cada perro va a su ritmo.',
      detalles: [
        ['miedo', 'Tiene miedo o se esconde', 'Evita el contacto o tiembla'],
        ['nervioso', 'Está nervioso todo el día', 'No para quieto, no descansa'],
        ['pis', 'Hace pis en casa', 'Aunque sea adulto']
      ],
      notaDetalle: {
        miedo: 'Como tiene miedo, dejarás que sea {n} quien se acerque: nada de cogerle ni forzar caricias estas semanas.',
        nervioso: 'Como está muy nervioso, la prioridad es el descanso: rutina predecible, menos visitas y paseos tranquilos.',
        pis: 'Como hace pis en casa, le enseñarás como a un cachorro: salidas frecuentes y premio fuera, sin regañar.'
      },
      primerosDias: [
        ['Un refugio', 'Prepara un rincón tranquilo con cama, agua y una manta, lejos del paso. Nadie le molesta cuando está ahí.'],
        ['Que se acerque él', 'Siéntate en el suelo con premios y deja que {n} se acerque a su ritmo. Si se va, déjale ir.'],
        ['Rutina fija', 'Mismas horas cada día para comer, salir y dormir. La previsibilidad le da seguridad.']
      ],
      pasos: [
        'Dale un refugio donde nadie le moleste, y respétalo siempre.',
        'Rutina fija: comidas, paseos y descanso a las mismas horas.',
        'Deja que sea él quien se acerque. Nada de abrazos ni de cogerle si no lo busca.',
        'Pocas visitas y pocos planes nuevos las primeras semanas.',
        'Paseos cortos y tranquilos por los mismos sitios al principio, siempre con correa y arnés bien ajustado.',
        'Si hace pis dentro: salidas frecuentes y premio fuera, como con un cachorro. Nunca regañar.',
        'Lleva a {n} al veterinario en las primeras semanas para una revisión, aunque venga con papeles.'
      ],
      evita: ['Soltarle en la calle las primeras semanas: aún no sabe volver', 'Muchas visitas o planes nuevos de golpe', 'Forzar el contacto o bañarle nada más llegar', 'Regañarle por miedo o por accidentes'],
      semanas: [
        { foco: 'Descomprimir', tareas: [
          ['Su refugio', 'Prepara su rincón tranquilo y deja que lo explore solo.'],
          ['Rutina fija', 'Comidas y salidas a la misma hora todo el día.'],
          ['Que se acerque', 'Siéntate en el suelo con premios 10 minutos. Deja que venga él.'],
          ['Salidas de pis', 'Sácale cada 3 horas y premia el pis fuera.'],
          ['Pocos estímulos', 'Hoy nada de visitas ni sitios nuevos.'],
          ['Paseo corto', 'Paseo de 15 minutos por el mismo recorrido, con arnés y correa.'],
          ['Revisa la semana', '¿Come, duerme y sale de su refugio más que el día 1?']
        ] },
        { foco: 'Confianza', tareas: [
          ['Su nombre', 'Di "{n}" y premia cuando te mire. 10 veces.'],
          ['Manos que dan', 'Ofrece la mano abierta con un premio. No la acerques a su cabeza.'],
          ['Juego suave', 'Un juego tranquilo de 5 minutos si le apetece. Si no, no pasa nada.'],
          ['Rutina fija', 'Revisa que las horas se mantengan iguales.'],
          ['Paseo de olfato', 'Deja que huela todo lo que quiera en el paseo.'],
          ['Visita al veterinario', 'Pide cita para una revisión de bienvenida.'],
          ['Revisa la semana', '¿Busca tu compañía alguna vez? Apúntalo.']
        ] },
        { foco: 'Aprender la casa', tareas: [
          ['A tu sitio', 'Enséñale "a tu sitio" con premios en su cama.'],
          ['Sentado', 'Premio sobre su cabeza hacia atrás; cuando se siente, premio.'],
          ['Ruidos de casa', 'Aspiradora lejos mientras come; premia la calma.'],
          ['Ratos solo', 'Sal de la habitación 1 minuto y vuelve. Así aprende que vuelves.'],
          ['Tocar con permiso', 'Si se acerca, una caricia corta en el pecho. Si se aparta, para.'],
          ['Paseo de olfato', 'Paseo tranquilo por un recorrido nuevo, corto.'],
          ['Revisa la semana', '¿Qué le sigue dando miedo? Apúntalo.']
        ] },
        { foco: 'Ampliar el mundo', tareas: [
          ['Una persona nueva', 'Un amigo tranquilo que no le mire ni le toque, solo que lance premios.'],
          ['Calle nueva', 'Paseo por una calle nueva a una hora tranquila.'],
          ['Ven', 'Di "ven" cuando ya venga hacia ti, y premio.'],
          ['Ratos solo', 'Sube a 10 minutos solo con un juguete rellenable.'],
          ['Mimos a su ritmo', 'Deja que pida mimos y pare cuando quiera.'],
          ['Paseo de olfato', 'Paseo largo de olfato.'],
          ['Revisa la semana', '¿Qué ha mejorado desde la semana 1?']
        ] },
        { foco: 'Rutina estable', tareas: [
          ['Lo que le cuesta', 'Trabaja a poca intensidad lo que apuntaste el día 21.'],
          ['Visita corta', 'Una visita tranquila de 30 minutos, con su refugio libre.'],
          ['Ratos solo', 'Sube a 30 minutos solo si va bien.'],
          ['Juego de cabeza', 'Juguete rellenable o juego de olfato 10 minutos.'],
          ['Correa larga', 'En un sitio vallado, practica "ven" con correa larga.'],
          ['Paseo de olfato', 'Paseo largo de olfato.'],
          ['Revisa la semana', '¿Descansa bien por las noches?']
        ] },
        { foco: 'Sentirse en casa', tareas: [
          ['Sitio nuevo', 'Un sitio nuevo y tranquilo, poco rato.'],
          ['Sus juegos', 'Descubre qué juego le gusta más y repítelo.'],
          ['Ratos solo', 'Ausencia de 1 hora si va bien.'],
          ['Repaso de trucos', 'Repasa nombre, sentado, a tu sitio y ven.'],
          ['Plan de 3 meses', 'Apunta qué quieres trabajar los próximos meses.'],
          ['Paseo de olfato', 'Paseo largo de olfato.'],
          ['¡Bienvenido a casa!', 'Mira cómo era {n} el primer día y cómo es hoy. Rellena la encuesta final.']
        ] }
      ]
    }
  };

  var DERIVAR = {
    titulo: 'Para esto, lo mejor es un profesional',
    texto: 'Cuando un perro muerde o amenaza a personas, un plan online no es lo responsable. Puede haber dolor, miedo intenso u otras causas que hay que ver en persona.',
    pasos: [
      'Pide cita con tu veterinario para descartar dolor o un problema de salud.',
      'Busca un educador canino o un etólogo que trabaje en positivo y pueda ver a tu perro en persona.',
      'Mientras tanto, evita las situaciones en las que ha pasado y no le castigues: el castigo suele empeorar la agresividad.'
    ]
  };

  var api = { PROGRAMAS: PROGRAMAS, DERIVAR: DERIVAR };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PROGRAMAS = api;
})(this);
