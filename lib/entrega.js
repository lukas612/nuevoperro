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
      plan = { token, sid, email: lead.email, html, estado: 'borrador', progreso, respuestas: lead.respuestas };
      await datos.insertar('planes', plan);
    }
    if (plan.estado !== 'enviado') {
      const deUnaPrueba = plan.estado === 'prueba';
      const pack = await datos.primero('pedidos', { sid, tipo: 'upsell' });
      const m = emails.entrega(plan.email, lead.respuestas, `${CFG.baseUrl}/plan/${plan.token}`, !!pack);
      await correo.enviarUnaVez(plan.email, m.clave + '_' + sid, m.asunto, m.html);
      await datos.actualizar('planes', { token: plan.token }, { estado: 'enviado', prueba_hasta: null, enviado_at: deUnaPrueba && plan.enviado_at ? plan.enviado_at : new Date().toISOString() });
      console.log('entrega: plan enviado a', plan.email, deUnaPrueba ? '(venía de la prueba)' : '');
    }
    return plan.token;
  } catch (e) {
    console.error('entrega', sid, e.message);
    return null;
  } finally {
    enCurso.delete(sid);
  }
}

/** Prueba gratis: el plan real, en estado «prueba» hasta el final del último día (hora de España). */
async function crearPrueba(lead) {
  try {
    const { DIAS_PRUEBA } = require('./config');
    const ya = (await datos.listar('planes', { sid: lead.sid })).find((p) => !p.pack);
    if (ya) return ya.token;
    const token = crypto.randomBytes(16).toString('hex');
    const adulto = ['adulto', 'adoptado'].includes(lead.respuestas?.tipo);
    const inicio = new Date().toISOString();
    const html = require(adulto ? '../content/plan-adulto-html.js' : '../content/plan-html.js').render({ respuestas: lead.respuestas, marca: CFG.marca, id: token, inicio });
    // Termina a las 23:59 del día DIAS_PRUEBA (el día de alta cuenta como el 1)
    const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
    const ahora = new Date();
    const desfase = Date.parse(ahora.toLocaleString('en-US', { timeZone: 'Europe/Madrid' })) - Date.parse(ahora.toLocaleString('en-US', { timeZone: 'UTC' }));
    const fin = new Date(Date.parse(hoy + 'T23:59:59Z') - desfase + (DIAS_PRUEBA - 1) * 864e5).toISOString();
    await datos.insertar('planes', { token, sid: lead.sid, email: lead.email, html, estado: 'prueba', prueba_hasta: fin, respuestas: lead.respuestas, enviado_at: inicio });
    return token;
  } catch (e) { console.error('crearPrueba', e.message); return null; }
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
  // Programas extra generados con datos de otro test: se rehacen con los del perro del plan.
  const ed = require('./edicion');
  for (const p of (await datos.listar('planes', { estado: 'enviado' })).filter((x) => x.pack && x.respuestas?.nombre)) {
    if (!p.html.includes('>' + p.respuestas.nombre + '<')) await datos.actualizar('planes', { token: p.token }, { html: ed.regenerar(p, p.respuestas) });
  }
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
    // El programa extra es del dueño del plan: su email y los datos de su perro (no los de un test posterior).
    const planes = await datos.listar('planes', { sid });
    const base = planes.find((p) => !p.pack);
    const lead = base ? { email: base.email, respuestas: base.respuestas } : await datos.primero('leads', { sid });
    if (!lead || !lead.respuestas) return null;
    let plan = planes.find((p) => p.pack === programa);
    if (!plan) {
      const token = crypto.randomBytes(16).toString('hex');
      const respuestas = { ...lead.respuestas, problema: programa };
      const html = require('../content/plan-adulto-html.js').render({ respuestas, marca: CFG.marca, id: token, inicio: new Date().toISOString() });
      plan = { token, sid, email: lead.email, html, estado: 'borrador', pack: programa, respuestas: lead.respuestas };
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

module.exports = { crearPrueba, entregarPlan, entregarPack, entregarPendientes };
