#!/usr/bin/env node
/*
 * Envíos programados. Los lanza el propio servidor (server.js) a las 20:00 de España (y otra pasada a las 21);
 * cada email se envía una sola vez (tabla "emails"), así que repetir la ejecución no duplica nada.
 *  - Quien no compra (con consentimiento comercial): un email al día durante 7 días, uno por cada ventaja del plan.
 *  - Compradores con el plan enviado: la tarea de cada día (1 a 56) y encuestas de los días 7 y 21.
 * Nunca envía dos veces el mismo email (tabla "emails") ni a quien se dio de baja.
 *
 *   node scripts/enviar-emails.js            # envía
 *   node scripts/enviar-emails.js --prueba   # solo muestra lo que enviaría
 */
'use strict';
const { CFG } = require('../lib/config');
const datos = require('../lib/datos');
const correo = require('../lib/email');
const emails = require('../lib/emails');
const push = require('../lib/push');

const DIA = 864e5;
// Días de calendario en España (no bloques de 24 h): lo de ayer a las 23:00 ya es «hace 1 día» hoy.
const diaMadrid = (t) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date(t));
const diasDesde = (fecha) => Math.round((Date.parse(diaMadrid(Date.now())) - Date.parse(diaMadrid(fecha))) / DIA);

async function enviarEmails({ prueba: PRUEBA = false } = {}) {
  const [leads, pedidos, planes, enviados] = await Promise.all([datos.listar('leads'), datos.listar('pedidos'), datos.listar('planes', { estado: 'enviado' }), datos.listar('emails')]);
  const hecho = new Set(enviados.map((e) => e.email + '|' + e.clave));
  const bajas = new Set(enviados.filter((e) => e.clave === 'baja').map((e) => e.email));
  // Quien tiene un pedido o un plan es comprador: nunca recibe los emails de "quien no compra".
  const compradores = new Set([...pedidos.filter((p) => p.tipo === 'plan').map((p) => p.sid), ...planes.map((p) => p.sid)]);
  const emailsCompradores = new Set([...pedidos.filter((p) => p.tipo === 'plan').map((p) => p.email), ...planes.map((p) => p.email)].filter(Boolean));
  const miembros = await datos.listar('miembros');
  const pruebas = await datos.listar('planes', { estado: 'prueba' });
  const reembolsados = new Set((await datos.listar('reembolsos')).filter((r) => r.tipo === 'plan').map((r) => r.sid));
  const cola = [];

  // Último lead por email
  const porEmail = new Map();
  for (const l of leads) porEmail.set(l.email, l);

  for (const lead of porEmail.values()) {
    if (bajas.has(lead.email) || compradores.has(lead.sid) || emailsCompradores.has(lead.email)) continue;
    if (lead.variante === 'prueba' && pruebas.some((p) => p.sid === lead.sid)) continue; // tiene su propia secuencia (abajo)
    const d = diasDesde(lead.ts);
    // Su resultado (día 0) a quien no lo recibió al hacer el test (fallo de envío o leads anteriores). Va a todos: lo han pedido.
    if (d <= 2 && !hecho.has(lead.email + '|nurture_0')) { const m0 = emails.nurture(0, lead); m0.para = lead.email; cola.push(m0); }
    if (!lead.consentimientos?.comerciales) continue;
    // Secuencia de 7 días, en orden y como mucho un email al día. Si se salta algún día, sigue donde lo dejó.
    // No se empieza con leads de hace más de 10 días.
    if (d < 1 || d > 10) continue;
    const siguiente = emails.NURTURE_DIAS.find((n) => n <= d && !hecho.has(lead.email + '|nurture_' + n));
    if (siguiente) { const m = emails.nurture(siguiente, lead); m.para = lead.email; cola.push(m); }
  }

  for (const plan of planes) {
    if (plan.pack) continue; // los programas extra no mandan email diario: se siguen desde su página
    if (bajas.has(plan.email) || reembolsados.has(plan.sid)) continue;
    // Las respuestas con las que se creó el plan (si después hizo otro test, no se mezclan).
    const lead = plan.respuestas ? { respuestas: plan.respuestas } : (await datos.primero('leads', { sid: plan.sid }));
    if (!lead) continue;
    // Día del plan = el mismo que ve en su página: el de la entrega es el 1 (va en el email de entrega); desde el día siguiente, uno al día.
    const dia = diasDesde(plan.enviado_at) + 1;
    const url = `${CFG.baseUrl}/plan/${plan.token}`;
    if (dia >= 2 && dia <= emails.DIAS(lead.respuestas)) {
      const m = emails.diario(plan.email, lead.respuestas, dia, url); if (m) { m.para = plan.email; cola.push(m); }
      // Quien comparte el plan (y ya ha entrado) también recibe la tarea del día.
      for (const mb of miembros.filter((x) => x.token === plan.token && x.aceptado_at && !bajas.has(x.email))) {
        const mm = emails.diario(mb.email, lead.respuestas, dia, url); if (mm) { mm.para = mb.email; cola.push(mm); }
      }
    }
    for (const e of [7, 21]) if (dia >= e && dia < e + 3) { const m = emails.encuesta(plan.email, lead.respuestas, e, url); m.para = plan.email; cola.push(m); }
  }

  // Prueba gratis: la tarea de cada día mientras dura; al terminar, aviso (a todos) y recordatorio (con consentimiento)
  const { DIAS_PRUEBA } = require('../lib/config');
  for (const plan of pruebas) {
    if (bajas.has(plan.email)) continue;
    const lead = { respuestas: plan.respuestas || {} };
    const dia = diasDesde(plan.enviado_at || plan.ts) + 1;
    const url = `${CFG.baseUrl}/plan/${plan.token}`;
    const leadReal = leads.find((l) => l.sid === plan.sid);
    const precio = leadReal?.precio || require('../lib/config').precioPara(plan.sid);
    if (dia >= 2 && dia <= DIAS_PRUEBA) { const m = emails.diario(plan.email, lead.respuestas, dia, url); if (m) { m.para = plan.email; cola.push(m); } }
    if (dia === DIAS_PRUEBA + 1) { const m = emails.pruebaFin(plan.email, lead.respuestas, `${CFG.baseUrl}/mi-zona#desbloquear`, precio, true); m.para = plan.email; cola.push(m); }
    if (dia === DIAS_PRUEBA + 3 && leadReal?.consentimientos?.comerciales) {
      const m = emails.pruebaFin(plan.email, lead.respuestas, `${CFG.baseUrl}/mi-zona#desbloquear`, precio, true);
      m.clave = 'prueba_recordatorio'; m.asunto = `${lead.respuestas.nombre || 'Tu perro'} sigue esperando: su plan está en pausa`; m.para = plan.email; cola.push(m);
    }
  }

  // Recordatorios del carnet de salud: 3 días antes y el mismo día, al dueño y a quien comparte el plan
  const hoyMadrid = diaMadrid(Date.now());
  for (const r of await datos.listar('salud')) {
    if (!r.proxima) continue;
    const dias = Math.round((Date.parse(String(r.proxima).slice(0, 10)) - Date.parse(hoyMadrid)) / DIA);
    if (dias !== 3 && dias !== 0) continue;
    const plan = planes.find((p) => p.token === r.token);
    if (!plan) continue;
    const perro = (plan.respuestas || {}).nombre || 'tu perro';
    const destinatarios = [plan.email, ...miembros.filter((x) => x.token === plan.token && x.aceptado_at).map((x) => x.email)];
    for (const para of destinatarios) {
      if (bajas.has(para)) continue;
      const m = emails.salud(para, { id: r.id, nombre: r.nombre, perro, dias, fecha: String(r.proxima).slice(0, 10), nota: r.nota, url: `${CFG.baseUrl}/mi-zona#salud` });
      m.para = para; cola.push(m);
    }
  }

  let enviadosHoy = 0;
  for (const m of cola) {
    if (hecho.has(m.para + '|' + m.clave)) continue;
    if (PRUEBA) { console.log(`[prueba] ${m.para} · ${m.clave} · ${m.asunto}`); continue; }
    if (await correo.enviarUnaVez(m.para, m.clave, m.asunto, m.html)) {
      enviadosHoy++;
      if (m.push) await push.avisar(m.para, m.push).catch(() => {}); // y al móvil, si activó los avisos
    }
  }
  console.log(PRUEBA ? `${cola.length} emails candidatos.` : `[emails] ${enviadosHoy} enviados.`);
  return enviadosHoy;
}

module.exports = { enviarEmails };
if (require.main === module) enviarEmails({ prueba: process.argv.includes('--prueba') }).catch((e) => { console.error(e.message); process.exit(1); });
