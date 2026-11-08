/*
 * Contenido de los emails (HTML compatible con clientes de correo: tablas y estilos en línea).
 * Textos de content/emails.md. Las tareas diarias salen de content/tareas-diarias.js.
 */
'use strict';
const { CFG, urlBaja, urlRetomar } = require('./config');
const P = require('../content/plantillas.js');
const T = require('../content/tareas-diarias.js');
const { PROGRAMAS } = require('../content/programas-adulto.js');
const esAdulto = (r) => r && (r.tipo === 'adulto' || r.tipo === 'adoptado');
const progDe = (r) => PROGRAMAS[r.problema] || PROGRAMAS.correa;
const tareasAdulto = (r) => progDe(r).semanas.flatMap((s) => s.tareas);
const DIAS = (r) => (esAdulto(r) ? 42 : 56);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PROBLEMA = { pis: 'el pis en casa', mordiscos: 'los mordiscos', noches: 'las noches', solo: 'quedarse solo', correa: 'tirar de la correa', ladridos: 'los ladridos', adaptacion: 'adaptarse a casa' };

function marco(email, interior, preheader) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1b2a41">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader || '')}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px">
<tr><td style="padding:18px 24px;border-bottom:1px solid #dde3ec"><img src="${CFG.baseUrl}/logo-email.png" width="248" height="60" alt="${esc(CFG.marca)}" style="display:block;border:0"></td></tr>
<tr><td style="padding:24px;font-size:16px;line-height:1.55">${interior}</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #dde3ec;font-size:12px;color:#5c6b80;line-height:1.5">
Responde a este email si necesitas algo. ${esc(CFG.titular)}<br>
<a href="${urlBaja(email)}" style="color:#5c6b80">Darme de baja de estos emails</a>
</td></tr></table></td></tr></table></body></html>`;
}
const boton = (url, txt) => `<p style="margin:24px 0"><a href="${url}" style="display:inline-block;background:#ffc83d;color:#1b2a41;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:12px">${esc(txt)}</a></p>`;
const tablaRutina = (rut) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.45">${rut.bloques.map((b) =>
  `<tr><td style="padding:6px 10px 6px 0;vertical-align:top;font-weight:bold;white-space:nowrap;color:#2546a8">${esc(b[0])}</td><td style="padding:6px 0;border-bottom:1px solid #eef2f8">${esc(b[1])}</td></tr>`).join('')}</table>`;

function perfil(r) {
  return { nombre: r.nombre || 'tu cachorro', raza: r.raza, razaId: r.razaId, edadSemanas: Number(r.edadSemanas) || 10, tamano: r.tamano || 'mediano', vivienda: r.vivienda, horasSolo: Number(r.horasSolo) || 0, problema: r.problema, convivientes: r.convivientes || [] };
}

// ---------- Quien no compra ----------
// Día 0: su resultado (lo ha pedido; va a todos). Días 1 a 7: una ventaja del plan cada día (solo con consentimiento comercial).
const img = (archivo, alt) => `<p style="margin:18px 0;text-align:center"><img src="${CFG.baseUrl}/email/${archivo}" width="300" alt="${esc(alt)}" style="display:inline-block;width:300px;max-width:100%;height:auto;border:1px solid #dde3ec;border-radius:14px"></p>`;
const lista = (items) => `<ul style="padding-left:20px;margin:12px 0">${items.map((t) => `<li style="margin-bottom:8px">${t}</li>`).join('')}</ul>`;
const NURTURE_DIAS = [1, 2, 3, 4, 5, 6, 7];

function nurture(dia, lead) {
  const r = lead.respuestas || {}, adulto = esAdulto(r), email = lead.email;
  const n = r.nombre || (adulto ? 'tu perro' : 'tu cachorro');
  const N = esc(n);
  const url = urlRetomar(lead, 'd' + dia);
  const semanas = adulto ? 6 : 8;
  const imgPlan = img(adulto ? 'plan-perro.jpg' : 'plan-cachorro.jpg', `Así se ve el plan de ${n}`);
  const prob = esc(PROBLEMA[r.problema] || (adulto ? 'su problema' : 'su educación'));

  if (dia === 0 && adulto) {
    const pg = progDe(r), sus = (t) => t.replace(/\{n\}/g, n);
    return { clave: 'nurture_0', asunto: `Los 3 primeros días de ${n}`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">Los 3 primeros días de ${N}</h1>
       <p><b>Por qué lo hace:</b> ${esc(sus(pg.porQue))}</p>
       <ol>${pg.primerosDias.map((d) => `<li style="margin-bottom:10px"><b>${esc(d[0])}.</b> ${esc(sus(d[1]))}</li>`).join('')}</ol>
       <p style="margin-top:22px"><b>Así se ve el plan completo de ${N}:</b> 6 semanas, una tarea al día y tu progreso siempre a mano.</p>
       ${imgPlan}
       ${boton(url, `Ver el plan completo de ${n}`)}`, 'Empieza hoy por el día 1') };
  }
  if (dia === 0) {
    const rut = P.rutinaDiaria(perfil(r));
    return { clave: 'nurture_0', asunto: `La rutina de mañana para ${n}`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">La rutina de mañana para ${N}</h1>
       <p>Aquí la tienes para guardarla. Pruébala mañana tal cual y fíjate en cuántos pis hace en el sitio bueno.</p>
       ${tablaRutina(rut)}
       <p style="font-size:14px;color:#5c6b80">${esc(rut.nota)}</p>
       <p style="margin-top:22px"><b>Esto es solo el primer día.</b> Así se ve el plan completo de ${N}: 8 semanas, una tarea al día y la rutina que crece con su edad.</p>
       ${imgPlan}
       ${boton(url, `Ver el plan completo de ${n}`)}`, 'Pruébala mañana tal cual') };
  }
  if (dia === 1) {
    const puntos = adulto
      ? [`<b>Una tarea al día durante 6 semanas</b>, de 5 a 15 minutos, empezando por ${prob}.`, '<b>Ajustada a ' + N + ':</b> su raza, su edad y cuándo le pasa.', '<b>Qué hacer y qué evitar</b>, y cuándo conviene pedir ayuda a un profesional.', '<b>Tu progreso a la vista:</b> marcas cada tarea y ves cuánto lleváis.']
      : ['<b>La rutina diaria</b> de comidas, siestas y salidas, que se actualiza cada semana con su edad.', `<b>Empezamos por ${prob}</b>, con un protocolo paso a paso.`, '<b>Socialización semana a semana</b>: qué presentarle y cómo, sin agobiarle.', '<b>Salud y papeleo</b>: vacunas, chip y lo que pide la ley en tu comunidad.'];
    return { clave: 'nurture_1', asunto: `Así es el plan de ${n} por dentro`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">Así es el plan de ${N} por dentro</h1>
       <p>Ayer te enviamos el primer paso. Esto es lo que tendrías con el plan completo de ${semanas} semanas:</p>
       ${imgPlan}${lista(puntos)}
       <p>Cada mañana abres el plan y ves solo la tarea de hoy. Nada de leerte un libro entero.</p>
       ${boton(url, `Ver el plan de ${n}`)}`, `${semanas} semanas, una tarea al día`) };
  }
  if (dia === 2) {
    const prot = P.PROTOCOLOS[r.problema] || P.PROTOCOLOS.pis;
    const pasos = adulto ? progDe(r).pasos.slice(0, 3).map((t) => t.replace(/\{n\}/g, n)) : (r.problema === 'pis' ? (r.vivienda === 'jardin' ? prot.jardin : prot.piso) : prot.si).slice(0, 3);
    return { clave: 'nurture_2', asunto: `Lo que casi todo el mundo hace mal con ${PROBLEMA[r.problema] || 'su educación'}`, html: marco(email,
      `<p>Hola:</p><p>Nos dijiste que lo que más te preocupa es <b>${prob}</b>. El error más común es reaccionar tarde: regañar cuando ya ha pasado. A ${adulto ? 'un perro' : 'un cachorro'} eso no le enseña nada, solo le confunde.</p>
       <p>Lo que sí funciona es adelantarse:</p><ol>${pasos.map((p) => `<li style="margin-bottom:8px">${esc(p)}</li>`).join('')}</ol>
       <p>Es solo una parte del plan de ${N}: el resto va día a día, para que sepas siempre qué toca.</p>${boton(url, `Ver el plan de ${n}`)}`, 'Y lo que funciona en su lugar') };
  }
  if (dia === 3) {
    return { clave: 'nurture_3', asunto: `El plan de ${n}, como una app en tu móvil`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">Tu plan, como una app en tu móvil</h1>
       <p>Con el plan tienes <b>Mi zona</b>: todo lo de ${N} en un sitio y a un toque.</p>
       ${img('mi-zona.jpg', 'Mi zona en el móvil')}
       ${lista(['<b>Se instala en la pantalla de inicio</b>, como cualquier app, sin pasar por ninguna tienda.', '<b>Funciona sin cobertura</b>: el plan se queda guardado en tu móvil.', '<b>La tarea de hoy, nada más abrir</b>, y tu progreso semana a semana.', '<b>Consejos y recomendaciones</b> de productos que ayudan de verdad (y de los que sobran).'])}
       ${boton(url, 'Quiero Mi zona')}`, 'Instalable, sin tiendas de apps') };
  }
  if (dia === 4) {
    return { clave: 'nurture_4', asunto: `Un truco que acelera todo con ${n}`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">El clicker: decirle «¡eso es!» en el momento justo</h1>
       <p>Un perro aprende de lo que pasa en el segundo exacto en que hace algo. El clicker marca ese segundo con un sonido, y después llega el premio. Así entiende mucho antes qué es lo que le premias.</p>
       <p><b>Pruébalo hoy:</b></p>
       <ol><li style="margin-bottom:8px">Ten 10 premios pequeños a mano.</li><li style="margin-bottom:8px">Haz «clic» y dale un premio. Repite 10 veces. No le pidas nada.</li><li style="margin-bottom:8px">Mañana, haz «clic» justo cuando te mire, y premio.</li></ol>
       <p>Con el plan no necesitas comprar nada: <b>el clicker está en tu móvil</b>, dentro de Mi zona.</p>
       ${img('clicker.jpg', 'El clicker de Mi zona')}
       ${boton(url, `Ver el plan de ${n}`)}`, 'Pruébalo hoy con 10 premios') };
  }
  if (dia === 5) {
    if (adulto) {
      return { clave: 'nurture_5', asunto: `5 minutos al día con ${n} valen más que una hora el domingo`, html: marco(email,
        `<h1 style="font-size:22px;margin:0 0 12px">5 minutos al día valen más que una hora el domingo</h1>
         <p>Los perros aprenden por repetición en sesiones cortas. Una hora seguida le cansa y le satura; 5 o 10 minutos cada día, en el momento justo, se quedan.</p>
         <p>Por eso el plan de ${N} es <b>una tarea al día</b>: te llega cada mañana por email, la marcas como hecha y ves tu progreso. Así no depende de tu fuerza de voluntad.</p>
         ${imgPlan}
         ${boton(url, `Empezar el plan de ${n}`)}`, 'Por qué el plan va día a día') };
    }
    return { clave: 'nurture_5', asunto: `El truco para adelantarte a los pis de ${n}`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">Apunta cada pis y verás su patrón</h1>
       <p>Los cachorros son muy regulares: si apuntas cada pis y cada caca unos días, verás a qué horas le toca y podrás sacarle <b>antes</b> de que pase.</p>
       <p>Con el plan tienes un <b>diario de pis y caca</b> en tu móvil: un toque cada vez y te dice cuántos han sido fuera y cuántos días lleváis sin accidentes.</p>
       ${img('diario.jpg', 'El diario de pis y caca')}
       ${boton(url, `Ver el plan de ${n}`)}`, 'Un toque cada vez, y ves cómo mejora') };
  }
  if (dia === 6) {
    return { clave: 'nurture_6', asunto: `¿Merece la pena el plan de ${n}?`, html: marco(email,
      `<h1 style="font-size:22px;margin:0 0 12px">¿Merece la pena?</h1>
       <p>Te lo ponemos fácil para que lo decidas:</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;border:1px solid #dde3ec;border-radius:12px;margin:12px 0">
         <tr><td style="padding:12px;color:#5c6b80">Una sola clase con un educador</td><td style="padding:12px;text-align:right;color:#5c6b80;white-space:nowrap">30–60 €</td></tr>
         <tr><td style="padding:12px;background:#dcf3e8;font-weight:bold">El plan completo de ${N}, ${semanas} semanas</td><td style="padding:12px;background:#dcf3e8;text-align:right;font-weight:bold;white-space:nowrap">${((lead.precio || 1999) / 100).toFixed(2).replace('.', ',')} €</td></tr>
       </table>
       ${lista(['<b>Pago único.</b> No es una suscripción: no se renueva ni hay que darse de baja.', '<b>Lo recibes al momento</b>, por email y en Mi zona.', '<b>De 5 a 15 minutos al día.</b> Cada mañana te llega la tarea.', '<b>Sin castigos ni tirones:</b> solo educación en positivo.'])}
       ${boton(url, `Quiero el plan de ${n}`)}`, 'Pago único, sin suscripción') };
  }
  // Día 7: último email de la secuencia
  return { clave: 'nurture_7', asunto: `Último aviso: el plan de ${n} sigue guardado`, html: marco(email,
    `<p>Hola:</p>
     <p>Este es el último email que te mandamos sobre el plan de ${N}. Sus respuestas siguen guardadas: si lo quieres, entras con el botón y está listo, sin repetir el test.</p>
     <p>Esto es lo que tendrías desde hoy:</p>
     ${lista([`El plan de ${semanas} semanas, con una tarea al día y empezando por ${prob}.`, 'Un email cada mañana con la tarea del día.', 'Mi zona en tu móvil, con el clicker' + (adulto ? '' : ', el diario de pis y caca') + ' y tu progreso.', 'Consejos y recomendaciones para cada etapa.'])}
     ${boton(url, `Empezar el plan de ${n}`)}
     <p style="font-size:14px;color:#5c6b80">Si ahora no es el momento, no pasa nada. Te seguiremos mandando de vez en cuando algún consejo útil.</p>`, 'Sus respuestas siguen guardadas') };
}

function entrega(email, r, urlPlan, conPack) {
  const n = r.nombre || 'tu cachorro';
  return { clave: 'entrega', asunto: `El plan de ${n} está listo`, html: marco(email,
    `<h1 style="font-size:22px;margin:0 0 12px">El plan de ${esc(n)} está listo</h1>
     <p>Empieza por la sección de <b>${esc(PROBLEMA[r.problema] || 'su prioridad')}</b>: es tu prioridad. Desde mañana te llegará cada día un email corto con la tarea del día.</p>
     ${boton(urlPlan, `Abrir el plan de ${n}`)}
     <p style="font-size:14px;color:#5c6b80">Guarda este email: el enlace es privado y es tu acceso al plan. Puedes marcar las tareas como hechas y ver tu progreso. También lo tienes siempre en <a href="${CFG.baseUrl}/mi-zona" style="color:#2546a8">Mi zona</a>, con consejos y recomendaciones.</p>
     ${conPack ? '<p>El programa extra que añadiste te llega en otro email y también lo tienes en Mi zona.</p>' : ''}
     <p>¿Dudas por el camino? Responde a este email y te ayudamos.</p>`, 'Empieza hoy por la semana 1') };
}

function diario(email, r, dia, urlPlan) {
  const n = r.nombre || 'tu perro';
  const t = esAdulto(r) ? (tareasAdulto(r)[dia - 1] && { titulo: tareasAdulto(r)[dia - 1][0], tarea: tareasAdulto(r)[dia - 1][1] }) : T[dia - 1];
  if (!t) return null;
  return { clave: 'diario_' + dia, asunto: `Día ${dia}: ${t.titulo}`, html: marco(email,
    `<p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2546a8;font-weight:bold;margin:0">Día ${dia} de ${DIAS(r)} · Semana ${Math.ceil(dia / 7)}</p>
     <h1 style="font-size:22px;margin:4px 0 12px">${esc(t.titulo)}</h1>
     <p>${esc(t.tarea.replace(/\{n\}/g, n))}</p>
     ${boton(urlPlan + '#hoy', 'Marcarla como hecha')}
     <p style="font-size:14px;color:#5c6b80">¿Te atascas? Responde a este email y te ayudamos.</p>`, `5 minutos hoy con ${n}`) };
}

function encuesta(email, r, dia, urlPlan) {
  const n = r.nombre || 'tu cachorro';
  const notas = Array.from({ length: 10 }, (_, k) => k + 1).map((k) =>
    `<a href="${CFG.baseUrl}/api/encuesta?e=${encodeURIComponent(email)}&d=${dia}&n=${k}" style="display:inline-block;width:34px;line-height:34px;margin:2px;text-align:center;border-radius:8px;background:${k >= 8 ? '#dcf3e8' : '#eef2f8'};color:#1b2a41;text-decoration:none;font-weight:bold">${k}</a>`).join('');
  return { clave: 'encuesta_' + dia, asunto: dia === 7 ? '¿Os está sirviendo el plan? (1 clic)' : `3 semanas con el plan: ¿cómo va ${n}?`, html: marco(email,
    `<p>Hola:</p><p>Del 1 al 10, ¿cuánto te está sirviendo el plan de ${esc(n)}?</p><p>${notas}</p>
     <p style="font-size:14px;color:#5c6b80">Un clic y listo. Si quieres contarnos algo más, responde a este email.</p>`, 'Un clic y nos ayudas mucho') };
}

function acceso(email, enlace) {
  return { asunto: `Tu acceso a Mi zona · ${CFG.marca}`, html: marco(email,
    `<h1 style="font-size:22px;margin:0 0 12px">Entra en Mi zona</h1>
     <p>Pulsa el botón para ver tu plan, tus consejos y tus recomendaciones. El enlace caduca en 7 días.</p>
     ${boton(enlace, 'Entrar en Mi zona')}
     <p style="font-size:14px;color:#5c6b80">Si no has pedido este acceso, ignora este email.</p>`, 'Tu enlace para entrar') };
}

function pack(email, r, programa, urlPlan) {
  const n = r.nombre || 'tu perro';
  const prog = require('../content/programas-adulto.js').PROGRAMAS[programa] || {};
  return { clave: 'pack_' + programa, asunto: `${prog.titulo || 'Tu programa extra'}: listo para ${n}`, html: marco(email,
    `<h1 style="font-size:22px;margin:0 0 12px">${esc(prog.titulo || 'Tu programa extra')}, listo para ${esc(n)}</h1>
     <p>Es el programa que añadiste: 6 semanas con una tarea corta cada día. Puedes hacerlo a la vez que el plan principal o empezarlo cuando termines la primera semana.</p>
     ${boton(urlPlan, 'Abrir el programa')}
     <p style="font-size:14px;color:#5c6b80">También lo tienes en <a href="${CFG.baseUrl}/mi-zona" style="color:#2546a8">Mi zona</a>, junto a tu plan, el diario y el clicker.</p>`, 'Tu programa extra ya está en Mi zona') };
}

module.exports = { nurture, NURTURE_DIAS, entrega, diario, encuesta, acceso, pack, DIAS };
