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
    let plan = (await datos.listar('planes', { sid })).find((p) => !p.pack);
    if (!plan) {
      const token = crypto.randomBytes(16).toString('hex');
      const adulto = ['adulto', 'adoptado'].includes(lead.respuestas?.tipo);
      const render = require(adulto ? '../content/plan-adulto-html.js' : '../content/plan-html.js').render;
      const html = render({ respuestas: lead.respuestas, marca: CFG.marca, id: token, inicio: new Date().toISOString() });
      // Lo que marcó en la vista previa del test aparece ya hecho en su plan.
      const progreso = Object.fromEntries((Array.isArray(lead.previo) ? lead.previo : []).map((k) => [k, { v: true, por: null, ts: Date.now() }]));
      plan = { token, sid, email: lead.email, html, estado: 'borrador', progreso };
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
    const plan = (await datos.listar('planes', { sid: p.sid })).find((x) => !x.pack);
    if (!plan || plan.estado !== 'enviado') await entregarPlan(p.sid);
  }
  for (const p of await datos.listar('pedidos', { tipo: 'upsell' })) if (!p.demo && p.sid && p.pack) await entregarPack(p.sid, p.pack);
}

// Pack del upsell → programa de 6 semanas. Los packs del cachorro usan los mismos programas.
const PACK_A_PROGRAMA = { separacion: 'solo', solo: 'solo', correa: 'correa', ladridos: 'ladridos', adaptacion: 'adaptacion' };

/** Entrega el pack comprado como un programa más: página propia, aparece en Mi zona y llega por email. */
async function entregarPack(sid, pack) {
  const programa = PACK_A_PROGRAMA[pack];
  const clave = sid + ':' + pack;
  if (!sid || !programa || enCurso.has(clave)) return null;
  enCurso.add(clave);
  try {
    const lead = await datos.primero('leads', { sid });
    if (!lead) return null;
    let plan = (await datos.listar('planes', { sid })).find((p) => p.pack === programa);
    if (!plan) {
      const token = crypto.randomBytes(16).toString('hex');
      const respuestas = { ...lead.respuestas, problema: programa };
      const html = require('../content/plan-adulto-html.js').render({ respuestas, marca: CFG.marca, id: token, inicio: new Date().toISOString() });
      plan = { token, sid, email: lead.email, html, estado: 'borrador', pack: programa };
      await datos.insertar('planes', plan);
    }
    if (plan.estado !== 'enviado') {
      const m = emails.pack(plan.email, lead.respuestas, programa, `${CFG.baseUrl}/plan/${plan.token}`);
      await correo.enviarUnaVez(plan.email, m.clave + '_' + sid, m.asunto, m.html);
      await datos.actualizar('planes', { token: plan.token }, { estado: 'enviado', enviado_at: new Date().toISOString() });
      console.log('entrega: pack', programa, 'enviado a', plan.email);
    }
    return plan.token;
  } catch (e) {
    console.error('entrega pack', sid, pack, e.message);
    return null;
  } finally {
    enCurso.delete(clave);
  }
}

module.exports = { entregarPlan, entregarPack, entregarPendientes };
