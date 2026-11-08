/* Entrega automática del plan al pagar: lo genera, lo marca como enviado y manda el email de entrega.
 * Desde ese momento funciona el acceso a Mi zona y empiezan los emails diarios.
 * Idempotente: si el plan ya existe no se crea otro, y el email de entrega solo sale una vez. */
'use strict';
const crypto = require('crypto');
const { CFG } = require('./config');
const datos = require('./datos');
const correo = require('./email');
const emails = require('./emails');

const enCurso = new Set();

async function entregarPlan(sid) {
  if (!sid || enCurso.has(sid)) return null;
  enCurso.add(sid);
  try {
    const lead = await datos.primero('leads', { sid });
    if (!lead) { console.error('entrega: no hay lead para', sid); return null; }
    let plan = await datos.primero('planes', { sid });
    if (!plan) {
      const token = crypto.randomBytes(16).toString('hex');
      const adulto = ['adulto', 'adoptado'].includes(lead.respuestas?.tipo);
      const render = require(adulto ? '../content/plan-adulto-html.js' : '../content/plan-html.js').render;
      const html = render({ respuestas: lead.respuestas, marca: CFG.marca, id: token, inicio: new Date().toISOString() });
      plan = { token, sid, email: lead.email, html, estado: 'borrador' };
      await datos.insertar('planes', plan);
    }
    if (plan.estado !== 'enviado') {
      const pack = await datos.primero('pedidos', { sid, tipo: 'upsell' });
      const m = emails.entrega(plan.email, lead.respuestas, `${CFG.baseUrl}/plan/${plan.token}`, !!pack);
      await correo.enviarUnaVez(plan.email, m.clave + '_' + sid, m.asunto, m.html);
      await datos.actualizar('planes', { token: plan.token }, { estado: 'enviado', enviado_at: new Date().toISOString() });
      console.log('entrega: plan enviado a', plan.email);
    }
    return plan.token;
  } catch (e) {
    console.error('entrega', sid, e.message);
    return null;
  } finally {
    enCurso.delete(sid);
  }
}

/** Al arrancar: entrega los planes de compras reales que se quedaran sin entregar. */
async function entregarPendientes() {
  const pedidos = await datos.listar('pedidos', { tipo: 'plan' });
  for (const p of pedidos) {
    if (p.demo || !p.sid) continue;
    const plan = await datos.primero('planes', { sid: p.sid });
    if (!plan || plan.estado !== 'enviado') await entregarPlan(p.sid);
  }
}

module.exports = { entregarPlan, entregarPendientes };
