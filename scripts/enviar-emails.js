#!/usr/bin/env node
/*
 * Envíos programados. Los lanza el propio servidor (server.js) cada hora entre las 9 y las 21 h de España;
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

const DIA = 864e5;
const diasDesde = (fecha) => Math.floor((Date.now() - new Date(fecha).getTime()) / DIA);

async function enviarEmails({ prueba: PRUEBA = false } = {}) {
  const [leads, pedidos, planes, enviados] = await Promise.all([datos.listar('leads'), datos.listar('pedidos'), datos.listar('planes', { estado: 'enviado' }), datos.listar('emails')]);
  const hecho = new Set(enviados.map((e) => e.email + '|' + e.clave));
  const bajas = new Set(enviados.filter((e) => e.clave === 'baja').map((e) => e.email));
  // Quien tiene un pedido o un plan es comprador: nunca recibe los emails de "quien no compra".
  const compradores = new Set([...pedidos.filter((p) => p.tipo === 'plan').map((p) => p.sid), ...planes.map((p) => p.sid)]);
  const emailsCompradores = new Set([...pedidos.filter((p) => p.tipo === 'plan').map((p) => p.email), ...planes.map((p) => p.email)].filter(Boolean));
  const miembros = await datos.listar('miembros');
  const reembolsados = new Set((await datos.listar('reembolsos')).filter((r) => r.tipo === 'plan').map((r) => r.sid));
  const cola = [];

  // Último lead por email
  const porEmail = new Map();
  for (const l of leads) porEmail.set(l.email, l);

  for (const lead of porEmail.values()) {
    if (bajas.has(lead.email) || compradores.has(lead.sid) || emailsCompradores.has(lead.email)) continue;
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
    const lead = porEmail.get(plan.email) || (await datos.primero('leads', { sid: plan.sid }));
    if (!lead) continue;
    const dia = diasDesde(plan.enviado_at); // el día 1 es el día siguiente a la entrega
    const url = `${CFG.baseUrl}/plan/${plan.token}`;
    if (dia >= 1 && dia <= emails.DIAS(lead.respuestas)) {
      const m = emails.diario(plan.email, lead.respuestas, dia, url); if (m) { m.para = plan.email; cola.push(m); }
      // Quien comparte el plan (y ya ha entrado) también recibe la tarea del día.
      for (const mb of miembros.filter((x) => x.token === plan.token && x.aceptado_at && !bajas.has(x.email))) {
        const mm = emails.diario(mb.email, lead.respuestas, dia, url); if (mm) { mm.para = mb.email; cola.push(mm); }
      }
    }
    for (const e of [7, 21]) if (dia >= e && dia < e + 3) { const m = emails.encuesta(plan.email, lead.respuestas, e, url); m.para = plan.email; cola.push(m); }
  }

  let enviadosHoy = 0;
  for (const m of cola) {
    if (hecho.has(m.para + '|' + m.clave)) continue;
    if (PRUEBA) { console.log(`[prueba] ${m.para} · ${m.clave} · ${m.asunto}`); continue; }
    if (await correo.enviarUnaVez(m.para, m.clave, m.asunto, m.html)) enviadosHoy++;
  }
  console.log(PRUEBA ? `${cola.length} emails candidatos.` : `[emails] ${enviadosHoy} enviados.`);
  return enviadosHoy;
}

module.exports = { enviarEmails };
if (require.main === module) enviarEmails({ prueba: process.argv.includes('--prueba') }).catch((e) => { console.error(e.message); process.exit(1); });
