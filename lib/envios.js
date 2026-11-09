/* Envíos manuales desde el panel: emails y avisos en el móvil a un segmento.
 * Segmentos: compradores, compradores + quien comparte, leads con consentimiento (sin compra) y móviles con avisos.
 * Nunca se envía a quien se dio de baja. Cada envío queda en pc_campanas; cada email, en pc_emails (no se repite). */
'use strict';
const { CFG } = require('./config');
const datos = require('./datos');
const correo = require('./email');
const emails = require('./emails');
const push = require('./push');

const SEGMENTOS = {
  compradores: 'Compradores (dueños de un plan)',
  compradores_y_compartidos: 'Compradores y quien comparte su plan',
  leads: 'Leads sin compra que aceptaron emails',
  avisos: 'Móviles con avisos activados',
  todos: 'Compradores, quien comparte y leads con consentimiento'
};

async function destinatarios(segmento) {
  const [planes, miembros, leads, enviados, pushes, pedidos] = await Promise.all([
    datos.listar('planes', { estado: 'enviado' }), datos.listar('miembros'), datos.listar('leads'), datos.listar('emails', { clave: 'baja' }), datos.listar('push'), datos.listar('pedidos')
  ]);
  const bajas = new Set(enviados.map((e) => e.email));
  const compradores = new Set([...planes.map((p) => p.email), ...pedidos.filter((p) => p.tipo === 'plan' && !p.demo).map((p) => p.email)].filter(Boolean));
  const compartidos = new Set(miembros.filter((m) => m.aceptado_at).map((m) => m.email));
  const conConsent = new Set(leads.filter((l) => l.consentimientos?.comerciales).map((l) => l.email).filter((e) => !compradores.has(e)));
  let lista;
  if (segmento === 'compradores') lista = [...compradores];
  else if (segmento === 'compradores_y_compartidos') lista = [...compradores, ...compartidos];
  else if (segmento === 'leads') lista = [...conConsent];
  else if (segmento === 'avisos') lista = [...new Set(pushes.map((p) => p.email))];
  else if (segmento === 'todos') lista = [...compradores, ...compartidos, ...conConsent];
  else lista = [];
  return [...new Set(lista.map((e) => String(e).toLowerCase()))].filter((e) => e && !bajas.has(e));
}

async function recuento() {
  const r = {};
  for (const k of Object.keys(SEGMENTOS)) r[k] = { nombre: SEGMENTOS[k], personas: (await destinatarios(k)).length };
  return r;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Envía la campaña. o = { segmento, canal: email|push|ambos, asunto, texto, boton, url, por, prueba (email del admin) } */
async function enviar(o) {
  const lista = o.prueba ? [o.prueba] : await destinatarios(o.segmento);
  const camp = o.prueba ? null : await datos.insertar('campanas', { segmento: o.segmento, canal: o.canal, asunto: o.asunto, texto: o.texto, url: o.url || null, por: o.por, destinatarios: lista.length }, { devolver: true });
  const clave = o.prueba ? 'prueba_' + Date.now() : 'campana_' + camp.id;
  const url = o.url ? (o.url.startsWith('http') ? o.url : CFG.baseUrl + (o.url.startsWith('/') ? '' : '/') + o.url) : null;
  let nEmails = 0, nAvisos = 0;
  for (const para of lista) {
    try {
      if (o.canal === 'email' || o.canal === 'ambos') {
        const m = emails.libre(para, { asunto: o.asunto, texto: o.texto, boton: o.boton, url });
        if (o.prueba ? await correo.enviar(para, '[Prueba] ' + m.asunto, m.html) : await correo.enviarUnaVez(para, clave, m.asunto, m.html)) nEmails++;
        await espera(600); // margen con el límite de envíos de Resend
      }
      if (o.canal === 'push' || o.canal === 'ambos') nAvisos += (await push.avisar(para, { titulo: o.asunto, texto: String(o.texto || '').replace(/\s+/g, ' ').slice(0, 140), url: o.url || '/mi-zona' })) ? 1 : 0;
    } catch (e) { console.error('[envio]', para, e.message); }
  }
  if (camp) await datos.actualizar('campanas', { id: camp.id }, { emails: nEmails, avisos: nAvisos, estado: 'enviada' });
  return { destinatarios: lista.length, emails: nEmails, avisos: nAvisos };
}

module.exports = { SEGMENTOS, destinatarios, recuento, enviar };
