/*
 * Páginas indexables generadas en el servidor (sin depender de JavaScript):
 *   /                         portada
 *   /guias                    centro de guías
 *   /guias/<categoria>        cachorros, perro-adulto, perro-adoptado, ley-y-papeleo, educacion
 *   /guias/<articulo>         12 artículos
 *   /guias/rutina-cachorro-N-semanas   rutinas calculadas por edad y tamaño
 *   /razas, /razas/<raza>     cómo educar a cada raza
 * Más: sitemap.xml, robots.txt e índice JSON para "Mi zona".
 */
'use strict';
const { CFG } = require('./config');
const S = require('./seo');
const POSTS = require('../content/guias.js');
const { CATEGORIAS, RAZAS, RUTINAS } = require('../content/seo.js');
const P = require('../content/plantillas.js');
const D = require('../public/perros.js');

const { esc } = S;
const I = D.icono;
const porSlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
const FECHA_SITIO = '2026-11-08';
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (f) => { const d = new Date(f + 'T12:00:00Z'); return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`; };
const ICONO_TEMA = { pis: ['gota', 'sky'], mordiscos: ['diente', 'peach'], noches: ['luna', 'lilac'], solo: ['puerta', 'butter'], correa: ['correa', 'mint'], ladridos: ['chispa', 'butter'], adaptacion: ['casa', 'sky'], rutina: ['reloj', 'mint'], legal: ['ley', 'lilac'] };
const burbuja = (ic, color) => `<span class="burbuja b-${color}">${I(ic)}</span>`;
const burbujaTema = (t) => burbuja(...(ICONO_TEMA[t] || ['estrella', 'sky']));
const TIPOS_BLOQUE = { despertar: ['sol', 'butter'], comida: ['cuenco', 'butter'], juego: ['pelota', 'mint'], solo: ['puerta', 'peach'], pis: ['gota', 'sky'], aprender: ['estrella', 'lilac'], raza: ['huella', 'peach'], social: ['personas', 'mint'], familia: ['nino', 'butter'], mordiscos: ['diente', 'peach'], noches: ['luna', 'lilac'], dormir: ['cama', 'lilac'], noche: ['luna', 'lilac'] };
const RAZAS_PUBLICAS = D.RAZAS.filter((r) => r.id !== 'otra');

function tarjetaPost(p) {
  return `<a class="post-tarjeta" href="/guias/${p.slug}">${burbujaTema(p.tema)}<span class="pila" style="gap:4px;min-width:0"><b>${esc(p.titulo)}</b><span class="suave peq">${esc(p.descripcion)}</span></span></a>`;
}
function ctaCaja(texto, href, tema) {
  return `<aside class="cta-post">${burbujaTema(tema)}<div class="pila" style="gap:8px"><b>${esc(texto)}</b><span class="suave peq">Gratis, en 2 minutos y adaptado a su raza y su edad.</span><a class="btn" href="${esc(href)}" style="align-self:flex-start;width:auto">Empezar el test</a></div></aside>`;
}
function faqHtml(faq) {
  return `<section class="faq pila"><h2>Preguntas frecuentes</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;
}
const faqJson = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
function timeline(rut) {
  return `<ul class="linea-tiempo">${rut.bloques.map((b) => { const t = TIPOS_BLOQUE[b[2]] || ['reloj', 'sky']; return `<li>${burbuja(t[0], t[1])}<div><div class="hora">${esc(b[0])}</div><div class="txt">${esc(b[1])}</div></div></li>`; }).join('')}</ul>`;
}

// Markdown sencillo de los artículos
function inline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>'); }
function md(texto) {
  return texto.trim().split(/\n\s*\n/).map((b) => {
    const l = b.split('\n');
    if (b.startsWith('## ')) return `<h2>${inline(b.slice(3))}</h2>`;
    if (l.every((x) => /^- /.test(x))) return `<ul>${l.map((x) => `<li>${inline(x.slice(2))}</li>`).join('')}</ul>`;
    if (l.every((x) => /^\d+\. /.test(x))) return `<ol>${l.map((x) => `<li>${inline(x.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    if (/^\*\*.+\*\*$/.test(l[0]) && l.slice(1).every((x) => /^- /.test(x))) return `<h3>${inline(l[0].replace(/\*\*/g, ''))}</h3><ul>${l.slice(1).map((x) => `<li>${inline(x.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(l.join(' '))}</p>`;
  }).join('\n');
}

// ---------- Portada ----------
const FAQ_PORTADA = [
  ['¿Sirve si mi perro ya es adulto?', 'Sí. Hay planes para cachorros, para perros recién adoptados y para problemas de perros adultos como tirar de la correa, ladrar o quedarse solo.'],
  ['¿Y si mi perro muerde?', 'Si un perro muerde o amenaza a personas, lo responsable es que lo vea un profesional en persona. Te explicamos cómo buscar ayuda y no te vendemos un plan.'],
  ['¿Es una suscripción?', 'No. El test es gratis y el plan es un pago único, sin renovaciones.']
];
function portada() {
  const opcion = (href, cara, titulo, sub) => `<a class="eleccion" href="${href}"><span class="eleccion-cara">${D.cara(cara, { lengua: true })}</span><span class="eleccion-txt"><b>${titulo}</b><small>${sub}</small></span><span class="eleccion-flecha">${I('flecha')}</span></a>`;
  const atajos = [['/perro?tipo=adulto&p=correa', 'correa', 'mint', 'Tira de la correa'], ['/perro?tipo=adulto&p=ladridos', 'chispa', 'butter', 'Ladra mucho'], ['/perro?tipo=adulto&p=solo', 'puerta', 'peach', 'Lo pasa mal solo'], ['/cachorro', 'gota', 'sky', 'Pis en casa (cachorro)'], ['/cachorro', 'diente', 'lilac', 'Muerde (cachorro)'], ['/perro?tipo=adoptado&p=adaptacion', 'casa', 'sky', 'Recién adoptado']];
  const cuerpo = `<div class="pila-g">
<section class="pila"><span class="eyebrow">${I('huella')}Educación en positivo, sin castigos</span>
<h1>Un plan para educar a tu perro, hecho para él</h1>
<p class="suave">Para su raza, su edad y tu casa: cachorros, perros adoptados y problemas como tirar de la correa, ladrar o quedarse solo. Responde unas preguntas y te damos gratis el primer paso.</p></section>
<section class="pila" id="empezar"><h2 style="font-size:1.25rem">¿Cómo es tu perro?</h2><div class="elecciones">
${opcion('/cachorro', 'chihuahua', 'Es un cachorro', 'Hasta 6 meses: pis, mordiscos, noches y rutina')}
${opcion('/perro?tipo=adoptado', 'mestizo', 'Lo acabo de adoptar', 'Sus primeras semanas en casa')}
${opcion('/perro?tipo=adulto', 'border-collie', 'Ya lleva tiempo conmigo', 'Correa, ladridos o quedarse solo')}
</div></section>
<section class="pila"><h2 class="etiqueta" style="font-size:.78rem">O ve directo a su problema</h2><div class="atajos">${atajos.map((a) => `<a class="atajo" href="${a[0]}">${burbuja(a[1], a[2])}<span>${a[3]}</span></a>`).join('')}</div></section>
<div class="ventajas"><div class="ventaja">${burbuja('corazon', 'peach')}Sin castigos ni tirones</div><div class="ventaja">${burbuja('perro', 'sky')}21 razas y mestizos</div><div class="ventaja">${burbuja('huella', 'mint')}Una tarea al día</div></div>
<section class="seccion"><h2>Del problema al plan en 3 pasos</h2><ol class="pasos">
<li><div><b>Nos cuentas cómo es</b><span>Raza, edad, tu casa y qué le pasa.</span></div></li>
<li><div><b>Recibes el primer paso, gratis</b><span>Su rutina de mañana o sus 3 primeros días de plan.</span></div></li>
<li><div><b>Si quieres, el plan completo</b><span>Una tarea cada día y un email que te la recuerda.</span></div></li></ol></section>
<section class="seccion"><h2>Todo lo que incluye el plan</h2><ul class="lista-inc">
<li>${burbuja('calendario', 'butter')}<span><b>Una tarea cada día</b><br><span class="suave">De 5 a 15 minutos, hecha para su raza, su edad y tu casa.</span></span></li>
<li>${burbuja('casa', 'sky')}<span><b>Mi zona, como una app en tu móvil</b><br><span class="suave">Tu plan siempre a mano, se instala en la pantalla de inicio y funciona sin conexión.</span></span></li>
<li>${burbuja('chispa', 'peach')}<span><b>Clicker incluido</b><br><span class="suave">Suena desde el móvil para marcar justo lo que hace bien. Sin comprar nada.</span></span></li>
<li>${burbuja('estrella', 'mint')}<span><b>Diario de progresos</b><br><span class="suave">Apunta pis, mordiscos, paseos o ratos solo y mira cómo mejora semana a semana.</span></span></li>
<li>${burbuja('correo', 'lilac')}<span><b>Un email cada mañana</b><br><span class="suave">Con la tarea del día, para que no se te olvide.</span></span></li>
<li>${burbuja('corazon', 'peach')}<span><b>Consejos y recomendaciones</b><br><span class="suave">Qué productos ayudan de verdad (y cuáles sobran) en cada etapa.</span></span></li>
</ul><a class="btn" href="#empezar" style="margin-top:8px">Haz el test gratis</a></section>
<section class="seccion"><h2>Guías para educar a tu perro</h2><div class="posts">${POSTS.slice(0, 4).map(tarjetaPost).join('')}</div><a class="enlace-afil" href="/guias">Ver todas las guías</a></section>
<section class="seccion"><h2>Cómo educar según su raza</h2><div class="razas-mini">${RAZAS_PUBLICAS.slice(0, 8).map((r) => `<a href="/razas/${r.id}">${D.cara(r.id)}<span>${esc(r.nombre)}</span></a>`).join('')}</div><a class="enlace-afil" href="/razas">Ver las 20 razas</a></section>
${faqHtml(FAQ_PORTADA)}
</div>`;
  return S.pagina({
    titulo: S.conMarca('Educar a tu perro en positivo: plan a medida'),
    descripcion: 'Plan personalizado para educar a tu perro o cachorro según su raza, edad y casa: pis, mordiscos, correa, ladridos o quedarse solo. Test gratis.',
    ruta: '/', jsonld: [S.organizacion(), S.sitioWeb(), faqJson(FAQ_PORTADA)], cuerpo
  });
}

// ---------- Guías ----------
function hubGuias() {
  const bloques = Object.entries(CATEGORIAS).map(([id, c]) => {
    const posts = POSTS.filter((p) => p.categoria === id);
    return `<section class="pila"><h2><a href="/guias/${id}" style="color:inherit">${esc(c.nombre)}</a></h2><div class="posts">${posts.map(tarjetaPost).join('')}${id === 'cachorros' ? `<a class="post-tarjeta" href="/guias/rutina-cachorro-10-semanas">${burbujaTema('rutina')}<span class="pila" style="gap:4px"><b>Rutinas de cachorro por edad</b><span class="suave peq">Horarios de comidas, siestas y pis de 8 a 20 semanas.</span></span></a>` : ''}</div></section>`;
  }).join('');
  return S.pagina({
    titulo: S.conMarca('Guías de educación canina en positivo'),
    descripcion: 'Guías prácticas para educar a tu perro en positivo: cachorros, perros adoptados, correa, ladridos, quedarse solo, rutinas por edad y la ley.',
    ruta: '/guias', migas: [['Inicio', '/'], ['Guías', '/guias']],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Guías de educación canina', url: S.url('/guias'), inLanguage: 'es-ES' }],
    cuerpo: `<div class="pila-g"><section class="pila"><h1>Guías para educar a tu perro</h1><p class="suave">Consejos prácticos, sin castigos, para cachorros, perros adoptados y perros adultos. También tienes <a href="/razas">guías por raza</a>.</p></section>${bloques}</div>`
  });
}

function categoria(id) {
  const c = CATEGORIAS[id];
  if (!c) return null;
  const posts = POSTS.filter((p) => p.categoria === id);
  const rutinas = id === 'cachorros' ? `<section class="pila"><h2>Rutinas de cachorro por edad</h2><div class="atajos">${RUTINAS.map((n) => `<a class="atajo" href="/guias/rutina-cachorro-${n}-semanas">${burbujaTema('rutina')}<span>Cachorro de ${n} semanas</span></a>`).join('')}</div></section>` : '';
  return S.pagina({
    titulo: S.conMarca(c.titulo), descripcion: c.descripcion, ruta: `/guias/${id}`,
    migas: [['Inicio', '/'], ['Guías', '/guias'], [c.nombre, `/guias/${id}`]],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.titulo, url: S.url(`/guias/${id}`), inLanguage: 'es-ES' }],
    cuerpo: `<div class="pila-g"><section class="pila"><h1>${esc(c.titulo)}</h1><p class="suave">${esc(c.descripcion)}</p></section><div class="posts">${posts.map(tarjetaPost).join('')}</div>${rutinas}${ctaCaja('¿Quieres un plan hecho para tu perro?', c.cta, posts[0]?.tema || 'rutina')}</div>`
  });
}

function articulo(slug) {
  const p = porSlug[slug];
  if (!p) return null;
  const c = CATEGORIAS[p.categoria];
  const ruta = `/guias/${p.slug}`;
  const relacionados = POSTS.filter((x) => x.slug !== p.slug).sort((a, b) => (b.categoria === p.categoria) - (a.categoria === p.categoria) || (b.tema === p.tema) - (a.tema === p.tema)).slice(0, 3);
  const html = md(p.cuerpo);
  const partes = html.split('<h2>');
  const conCta = partes.length > 3 ? partes.slice(0, 3).join('<h2>') + ctaCaja(p.cta.texto, p.cta.href, p.tema) + '<h2>' + partes.slice(3).join('<h2>') : html;
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: p.titulo, description: p.descripcion, inLanguage: 'es-ES',
    datePublished: p.fecha, dateModified: p.fecha, mainEntityOfPage: S.url(ruta), image: S.url('/og.png'),
    author: { '@type': 'Organization', name: CFG.marca, url: S.url('/') }, publisher: { '@type': 'Organization', name: CFG.marca, logo: { '@type': 'ImageObject', url: S.url('/apple-touch-icon.png') } }
  }];
  if (p.faq?.length) jsonld.push(faqJson(p.faq));
  return S.pagina({
    titulo: S.conMarca(p.tituloSeo || p.titulo), descripcion: p.descripcion, ruta, ogTipo: 'article', jsonld,
    migas: [['Inicio', '/'], ['Guías', '/guias'], [c.nombre, `/guias/${p.categoria}`], [p.titulo, ruta]],
    cuerpo: `<article class="post pila-g">
<header class="pila"><h1>${esc(p.titulo)}</h1><p class="suave peq">Actualizado el <time datetime="${p.fecha}">${fechaLarga(p.fecha)}</time> · ${p.lectura} min de lectura</p></header>
<div class="post-cuerpo">${conCta}</div>
${ctaCaja(p.cta.texto, p.cta.href, p.tema)}
${p.faq?.length ? faqHtml(p.faq) : ''}
<p class="peq suave">Información general de educación en positivo. No sustituye a tu veterinario ni a un profesional que vea a tu perro en persona.</p>
<section class="pila"><h2 style="font-size:1.25rem">Sigue leyendo</h2><div class="posts">${relacionados.map(tarjetaPost).join('')}</div></section>
</article>`
  });
}

// ---------- Rutinas por edad ----------
function rutina(n) {
  if (!RUTINAS.includes(n)) return null;
  const ruta = `/guias/rutina-cachorro-${n}-semanas`;
  const tamanos = [['pequeno', 'Pequeño (<10 kg)'], ['mediano', 'Mediano (10–25 kg)'], ['grande', 'Grande (>25 kg)']];
  const datos = tamanos.map(([t, nombre]) => [nombre, P.PARAMS[P.tramoPorEdad(n).id][t]]);
  const rut = P.rutinaDiaria({ nombre: 'tu cachorro', edadSemanas: n, tamano: 'mediano', vivienda: 'piso', horasSolo: 0, problema: 'pis', convivientes: [] });
  const rutSolo = P.rutinaDiaria({ nombre: 'tu cachorro', edadSemanas: n, tamano: 'mediano', vivienda: 'piso', horasSolo: 4, problema: 'pis', convivientes: [] });
  const fmt = (x) => String(x).replace('.', ',');
  const faq = [
    [`¿Cuántas horas duerme un cachorro de ${n} semanas?`, `Como referencia, unas ${datos[1][1].horasSueno} horas al día sumando las siestas. Cada cachorro es distinto y las razas grandes suelen dormir algo más.`],
    [`¿Cada cuánto hace pis un cachorro de ${n} semanas?`, `Durante el día suele aguantar alrededor de ${fmt(datos[0][1].aguantePis)}–${fmt(datos[2][1].aguantePis)} horas según su tamaño, y además necesita salir al despertar, después de comer y después de jugar.`],
    [`¿Cuántas veces come un cachorro de ${n} semanas?`, `Normalmente ${datos[1][1].comidas} tomas al día. La cantidad depende del pienso y de su tamaño: pregúntalo a tu veterinario.`]
  ];
  const tabla = `<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Tamaño adulto</th><th>Sueño</th><th>Sin pis (día)</th><th>Comidas</th><th>Paseo</th></tr></thead><tbody>${datos.map(([nombre, d]) => `<tr><td>${esc(nombre)}</td><td>${d.horasSueno} h</td><td>≈ ${fmt(d.aguantePis)} h</td><td>${d.comidas}</td><td>≤ ${d.minPaseo} min</td></tr>`).join('')}</tbody></table></div>`;
  const otras = RUTINAS.filter((x) => x !== n).map((x) => `<a class="atajo" href="/guias/rutina-cachorro-${x}-semanas">${burbujaTema('rutina')}<span>${x} semanas</span></a>`).join('');
  return S.pagina({
    titulo: S.conMarca(`Rutina de un cachorro de ${n} semanas: horarios y pis`),
    descripcion: `Horario orientativo para un cachorro de ${n} semanas: cuántas horas duerme, cada cuánto hace pis, cuántas comidas y cómo organizar el día si trabajas fuera.`,
    ruta, ogTipo: 'article', jsonld: [faqJson(faq)],
    migas: [['Inicio', '/'], ['Guías', '/guias'], ['Cachorros', '/guias/cachorros'], [`Rutina de ${n} semanas`, ruta]],
    cuerpo: `<article class="post pila-g">
<header class="pila"><h1>Rutina de un cachorro de ${n} semanas</h1><p class="suave">Un horario orientativo para su día: comidas, siestas, juego y, sobre todo, las salidas a hacer pis. Son referencias generales; tu cachorro puede necesitar algo distinto.</p></header>
<section class="pila"><h2>Lo básico a las ${n} semanas, según su tamaño</h2>${tabla}<p class="peq suave">Las cantidades de comida y las vacunas las decide tu veterinario.</p></section>
<section class="pila"><h2>Un día tipo (cachorro mediano, alguien en casa)</h2><div class="tarjeta">${timeline(rut)}<p class="nota">${I('chispa')}<span>${esc(rut.nota)}</span></p></div></section>
<section class="pila"><h2>Si trabajas fuera 4 horas</h2><p>Así cambia el día si sale de casa a las 9:00 y vuelve a las 13:00:</p><div class="tarjeta">${timeline(rutSolo)}</div></section>
${ctaCaja(`Calcula la rutina exacta de tu cachorro de ${n} semanas`, `/cachorro?utm_source=guias&utm_medium=seo&utm_campaign=rutina-${n}`, 'rutina')}
${faqHtml(faq)}
<section class="pila"><h2 style="font-size:1.25rem">Rutinas para otras edades</h2><div class="atajos">${otras}</div></section>
<section class="pila"><h2 style="font-size:1.25rem">Sigue leyendo</h2><div class="posts">${['cuantas-horas-duerme-un-cachorro', 'ensenar-cachorro-hacer-pis-en-la-calle', 'cachorro-llora-por-la-noche'].map((s) => tarjetaPost(porSlug[s])).join('')}</div></section>
</article>`
  });
}

// ---------- Razas ----------
const ENERGIA = { baja: 'Baja', media: 'Media', alta: 'Alta' };
const TAMANO = { pequeno: 'Pequeño (menos de 10 kg)', mediano: 'Mediano (10–25 kg)', grande: 'Grande (más de 25 kg)' };
const EJERCICIO = {
  baja: 'Paseos tranquilos y juegos cortos. Más vale poco y a menudo que una gran caminata.',
  media: 'Paseos diarios con tiempo para olfatear y un rato de juego o de buscar premios en casa.',
  alta: 'Necesita actividad física y, sobre todo, mental cada día: paseos largos de olfato, juegos de pensar y entrenamiento corto.'
};
function hubRazas() {
  return S.pagina({
    titulo: S.conMarca('Cómo educar a tu perro según su raza'),
    descripcion: 'Guías para educar a cada raza en positivo: energía, juego ideal, cuidados y rutina de cachorro del teckel, labrador, caniche, chihuahua, border collie y más.',
    ruta: '/razas', migas: [['Inicio', '/'], ['Razas', '/razas']],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Guías por raza', url: S.url('/razas'), inLanguage: 'es-ES' }],
    cuerpo: `<div class="pila-g"><section class="pila"><h1>Cómo educar a tu perro según su raza</h1><p class="suave">Cada raza tiene su energía, su forma de jugar y sus cuidados. Elige la tuya. Si es mestizo, también hay una guía para él.</p></section><div class="razas">${RAZAS_PUBLICAS.map((r) => `<a class="raza" href="/razas/${r.id}" style="text-decoration:none">${D.cara(r.id)}<span>${esc(r.nombre)}</span></a>`).join('')}</div></div>`
  });
}
function raza(id) {
  const r = D.raza(id);
  if (!r || id === 'otra' || !RAZAS[id]) return null;
  const rasgo = P.RASGOS[id] || P.RASGOS.mestizo;
  const act = P.ACTIVIDADES[rasgo.actividad];
  const nombre = r.nombre, un = id === 'mestizo' ? 'un perro mestizo' : `un ${nombre.toLowerCase()}`;
  const tamano = r.tamano || 'mediano';
  const rut = P.rutinaDiaria({ nombre: 'tu cachorro', raza: nombre, razaId: id, edadSemanas: 10, tamano, vivienda: 'piso', horasSolo: 0, problema: 'pis', convivientes: [] });
  const ruta = `/razas/${id}`;
  const titulo = id === 'mestizo' ? 'Cómo educar a un perro mestizo: guía para cachorro y adulto' : `Cómo educar a ${un}: guía para cachorro y adulto`;
  const faq = [
    [`¿Cuánto ejercicio necesita ${un}?`, EJERCICIO[rasgo.energia]],
    [`¿Qué juego le va mejor a ${un}?`, act.txt.replace(/\{raza\}/g, un).replace(/^./, (x) => x.toUpperCase())],
    [`¿Se puede educar a ${un} sin castigos?`, 'Sí. Como cualquier perro, aprende mejor con premios en el momento justo, rutinas claras y sesiones cortas. Los castigos generan miedo y no le enseñan qué hacer.']
  ];
  const consejos = [rasgo.cuidado, rasgo.nota].filter(Boolean);
  const problemas = [['perro-tira-de-la-correa', 'correa'], ['por-que-mi-perro-ladra-tanto', 'ladridos'], ['ansiedad-por-separacion-perros', 'solo'], ['ensenar-cachorro-hacer-pis-en-la-calle', 'pis'], ['cachorro-muerde-que-hacer', 'mordiscos']];
  const otras = RAZAS_PUBLICAS.filter((x) => x.id !== id && (x.tamano === r.tamano || !r.tamano)).slice(0, 4);
  return S.pagina({
    titulo: S.conMarca(`${titulo.replace(': guía para cachorro y adulto', '')}: guía en positivo`),
    descripcion: `Cómo educar ${id === 'mestizo' ? 'a un mestizo' : 'a ' + un}: energía, juego ideal, cuidados de la raza y rutina de cachorro. Consejos en positivo, sin castigos.`,
    ruta, ogTipo: 'article', jsonld: [faqJson(faq)],
    migas: [['Inicio', '/'], ['Razas', '/razas'], [nombre, ruta]],
    cuerpo: `<article class="post pila-g">
<header class="perfil"><span class="avatar" style="width:96px;height:96px">${D.cara(id, { lengua: true })}</span><div class="pila" style="gap:6px"><h1 style="font-size:clamp(1.6rem,6vw,2.1rem)">${esc(titulo)}</h1></div></header>
<p class="post-cuerpo" style="margin:0">${esc(RAZAS[id])}</p>
<section class="tarjeta"><dl class="ficha">
<div><dt>Tamaño</dt><dd>${r.tamano ? TAMANO[r.tamano] : 'Variable: depende de la mezcla o de la variedad'}</dd></div>
<div><dt>Energía</dt><dd>${ENERGIA[rasgo.energia]}</dd></div>
<div><dt>Juego ideal</dt><dd>${{ olfato: 'Olfato', pensar: 'Juegos de pensar', calma: 'Mimos y manipulación', buscar: 'Traer la pelota', cuerda: 'Tira y afloja' }[rasgo.actividad]}</dd></div>
</dl></section>
<section class="pila"><h2>Ejercicio y juego</h2><p>${esc(EJERCICIO[rasgo.energia])}</p><p>${esc(act.txt.replace(/\{raza\}/g, un).replace(/^./, (x) => x.toUpperCase()))}</p></section>
${consejos.length ? `<section class="pila"><h2>Lo que debes saber de ${id === 'mestizo' ? 'tu mestizo' : 'la raza'}</h2>${consejos.map((c) => `<p class="nota raza-nota">${I('huella')}<span>${esc(c)}</span></p>`).join('')}</section>` : ''}
<section class="pila"><h2>Rutina de ${id === 'mestizo' ? 'un cachorro mestizo' : 'un cachorro de ' + nombre.toLowerCase()} de 10 semanas</h2><p class="suave">Orientativa, para un cachorro ${TAMANO[tamano].split(' (')[0].toLowerCase()} en un piso con alguien en casa. <a href="/guias/rutina-cachorro-10-semanas">Ver la rutina por tamaños</a>.</p><div class="tarjeta">${timeline(rut)}</div></section>
${ctaCaja(`Recibe el plan hecho para tu ${id === 'mestizo' ? 'perro' : nombre.toLowerCase()}`, `/?utm_source=razas&utm_medium=seo&utm_campaign=${id}`, 'rutina')}
<section class="pila"><h2>Problemas frecuentes y cómo trabajarlos</h2><div class="posts">${problemas.map(([s]) => tarjetaPost(porSlug[s])).join('')}</div></section>
${faqHtml(faq)}
${otras.length ? `<section class="pila"><h2 style="font-size:1.25rem">Otras razas</h2><div class="atajos">${otras.map((o) => `<a class="atajo" href="/razas/${o.id}"><span class="mini-cara">${D.cara(o.id)}</span><span>${esc(o.nombre)}</span></a>`).join('')}</div></section>` : ''}
<p class="peq suave">Rasgos generales de la raza: cada perro es un individuo. Revisado el ${fechaLarga(FECHA_SITIO)}.</p>
</article>`
  });
}

// ---------- Sitemap, robots e índice ----------
function rutasIndexables() {
  return [
    ['/', '1.0'], ['/cachorro', '0.9'], ['/perro', '0.9'], ['/guias', '0.8'], ['/razas', '0.8'],
    ...Object.keys(CATEGORIAS).map((c) => [`/guias/${c}`, '0.7']),
    ...POSTS.map((p) => [`/guias/${p.slug}`, '0.7']),
    ...RUTINAS.map((n) => [`/guias/rutina-cachorro-${n}-semanas`, '0.6']),
    ...RAZAS_PUBLICAS.filter((r) => RAZAS[r.id]).map((r) => [`/razas/${r.id}`, '0.6']),
    ['/privacidad', '0.1'], ['/condiciones', '0.1']
  ];
}
function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rutasIndexables().map(([u, pr]) => `  <url><loc>${S.url(u)}</loc><lastmod>${FECHA_SITIO}</lastmod><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`;
}
const robots = () => `User-agent: *\nAllow: /\nDisallow: /plan/\nDisallow: /mi-zona\nDisallow: /admin.html\nDisallow: /api/\nDisallow: /baja\n\nSitemap: ${S.url('/sitemap.xml')}\n`;
const indiceJson = () => POSTS.map(({ slug, titulo, tema }) => ({ slug, titulo, tema }));

// Resuelve /guias/<x>: categoría, rutina o artículo
function guia(x) {
  if (CATEGORIAS[x]) return categoria(x);
  const m = x.match(/^rutina-cachorro-(\d+)-semanas$/);
  if (m) return rutina(Number(m[1]));
  return articulo(x);
}

module.exports = { portada, hubGuias, guia, hubRazas, raza, sitemap, robots, indiceJson, rutasIndexables };
