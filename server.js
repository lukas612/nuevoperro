/*
 * Servidor: landing + test + paywall + upsell + página privada del plan + panel.
 * Sin dependencias: Node >= 18. Stripe y Resend por su API REST; datos en Supabase o en data/.
 *
 *   cp .env.example .env   # rellena las claves
 *   node server.js
 *
 * Sin STRIPE_SECRET_KEY arranca en MODO DEMO: el pago se simula para probar el funnel.
 */
'use strict';
const { CFG, precioPara, firmaBaja, firmaRetomar } = require('./lib/config');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const datos = require('./lib/datos');
const correo = require('./lib/email');
const plantillasEmail = require('./lib/emails');
const sesion = require('./lib/sesion');
const meta = require('./lib/meta');
const { entregarPlan, entregarPack, entregarPendientes } = require('./lib/entrega');
const guias = require('./lib/guias');
const SEO = require('./lib/seo');
const zlib = require('zlib');
const ZONA = require('./content/zona.js');
const PROGRAMAS_ADULTO = require('./content/programas-adulto.js').PROGRAMAS;

const MODO_DEMO = !CFG.stripeKey;
const PUBLIC = path.join(__dirname, 'public');

// ---------- Stripe (REST) ----------
function codificar(obj, prefijo, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const clave = prefijo ? `${prefijo}[${k}]` : k;
    if (typeof v === 'object') codificar(v, clave, out);
    else out.push(encodeURIComponent(clave) + '=' + encodeURIComponent(v));
  }
  return out.join('&');
}
async function stripe(metodo, ruta, params, idempotencia) {
  const headers = { Authorization: 'Bearer ' + CFG.stripeKey, 'Content-Type': 'application/x-www-form-urlencoded' };
  if (idempotencia) headers['Idempotency-Key'] = idempotencia;
  let url = 'https://api.stripe.com/v1' + ruta;
  const opts = { method: metodo, headers };
  if (params && metodo === 'GET') url += '?' + codificar(params);
  else if (params) opts.body = codificar(params);
  const r = await fetch(url, opts);
  const json = await r.json();
  if (!r.ok) { const e = new Error(json.error?.message || 'Stripe error'); e.stripe = json.error; throw e; }
  return json;
}
function verificarFirmaStripe(raw, cabecera) {
  if (!CFG.stripeWebhookSecret || !cabecera) return false;
  const t = (cabecera.split(',').find((p) => p.startsWith('t=')) || '').slice(2);
  const firmas = cabecera.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!t || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const esperada = crypto.createHmac('sha256', CFG.stripeWebhookSecret).update(`${t}.${raw}`).digest('hex');
  return firmas.some((f) => f.length === esperada.length && crypto.timingSafeEqual(Buffer.from(f), Buffer.from(esperada)));
}

// ---------- Utilidades HTTP ----------
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };
const COMPRIMIBLE = /^(text\/|application\/(json|xml|javascript)|image\/svg)/;
function enviar(res, codigo, cuerpo, tipo = 'application/json', extra = {}) {
  let datosSalida = typeof cuerpo === 'string' || Buffer.isBuffer(cuerpo) ? cuerpo : JSON.stringify(cuerpo);
  const cab = { 'Content-Type': tipo, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', ...extra };
  // gzip para texto: mejora la velocidad de carga (Core Web Vitals)
  const acepta = (res.req && res.req.headers['accept-encoding']) || '';
  if (COMPRIMIBLE.test(tipo) && /\bgzip\b/.test(acepta) && Buffer.byteLength(datosSalida) > 1024) {
    datosSalida = zlib.gzipSync(datosSalida);
    cab['Content-Encoding'] = 'gzip';
    cab.Vary = 'Accept-Encoding';
  }
  res.writeHead(codigo, cab);
  res.end(res.req && res.req.method === 'HEAD' ? undefined : datosSalida);
}
const html = (res, codigo, cuerpo) => enviar(res, codigo, cuerpo, TIPOS['.html']);
function leerCuerpo(req, limite = 100_000) {
  return new Promise((ok, ko) => {
    let d = '';
    req.on('data', (c) => { d += c; if (d.length > limite) { ko(new Error('demasiado grande')); req.destroy(); } });
    req.on('end', () => ok(d));
    req.on('error', ko);
  });
}
async function json(req) { try { return JSON.parse((await leerCuerpo(req)) || '{}'); } catch { return {}; } }
function servirArchivo(res, archivo) {
  fs.readFile(archivo, (err, buf) => {
    if (err) return enviar(res, 404, 'No encontrado', 'text/plain; charset=utf-8');
    const ext = path.extname(archivo);
    // Imágenes y fuentes cambian poco: 1 día. CSS y JS: 5 minutos para que los despliegues lleguen rápido.
    // El service worker no se cachea: así cada despliegue llega a quien tenga la app instalada.
    const cache = path.basename(archivo) === 'sw.js' ? 'no-cache' : ['.png', '.jpg', '.svg', '.ico'].includes(ext) ? 'public, max-age=86400' : 'public, max-age=300';
    enviar(res, 200, buf, TIPOS[ext] || 'application/octet-stream', { 'Cache-Control': cache });
  });
}
const limpio = (s, n = 200) => String(s ?? '').slice(0, n);
const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || ''));
const objeto = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? o : {});
const pagina = (titulo, cuerpo) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${titulo}</title><link rel="stylesheet" href="/styles.css"></head><body><main class="pila" style="padding-top:40px">${cuerpo}</main></body></html>`;

// ---------- Rutas ----------
const rutas = {
  'GET /api/config': async (req, res, url) => {
    enviar(res, 200, { marca: CFG.marca, pixelId: CFG.pixelId, stripePk: MODO_DEMO ? '' : CFG.stripePk, avisoCookies: /^(si|sí|1|true)$/i.test(process.env.AVISO_COOKIES || ''), precio: precioPara(url.searchParams.get('sid')), precioUpsell: CFG.precioUpsell, demo: MODO_DEMO, emailContacto: CFG.emailContacto });
  },

  'POST /api/evento': async (req, res) => {
    const b = await json(req);
    const permitidos = ['visita', 'inicio_form', 'paso', 'form_completo', 'resultado_visto', 'paywall_visto', 'checkout_inicio', 'checkout_cancelado', 'upsell_visto', 'upsell_rechazado', 'clic_seguros', 'derivado', 'clic_afiliado', 'visita_web', 'clic_bloqueado', 'tarea_previa'];
    if (!permitidos.includes(b.tipo)) return enviar(res, 400, { error: 'tipo' });
    await datos.insertar('eventos', { tipo: b.tipo, sid: limpio(b.sid, 64), paso: limpio(b.paso, 40), utm: objeto(b.utm) });
    enviar(res, 200, { ok: true });
  },

  // Progreso del plan compartido entre quienes lo siguen. Basta con el token del plan (el mismo que da acceso a su página).
  'GET /api/progreso': async (req, res, url) => {
    const t = limpio(url.searchParams.get('t'), 40);
    const plan = /^[a-f0-9]{32}$/.test(t) && (await datos.primero('planes', { token: t }));
    if (!plan) return enviar(res, 404, { error: 'plan' });
    const yo = await quienEnPlan(sesion.deCookie(req), plan);
    const miembros = (await datos.listar('miembros', { token: t })).map((m) => m.nombre || nombreDeEmail(m.email));
    enviar(res, 200, { progreso: plan.progreso || {}, yo: yo?.nombre || null, miembros, dueno: nombreDeEmail(plan.email) });
  },
  'POST /api/progreso': async (req, res) => {
    const b = await json(req);
    const t = limpio(b.t, 40);
    const plan = /^[a-f0-9]{32}$/.test(t) && (await datos.primero('planes', { token: t }));
    if (!plan) return enviar(res, 404, { error: 'plan' });
    const cambios = Array.isArray(b.cambios) ? b.cambios.slice(0, 100) : [];
    const yo = await quienEnPlan(sesion.deCookie(req), plan);
    const progreso = { ...(plan.progreso || {}) };
    for (const c of cambios) {
      const k = String(c.k || '');
      if (!/^[a-z0-9_-]{1,24}$/i.test(k)) continue;
      progreso[k] = { v: !!c.v, por: yo?.nombre || null, ts: Date.now() };
    }
    await datos.actualizar('planes', { token: t }, { progreso });
    enviar(res, 200, { progreso });
  },
  // Editar las respuestas de un plan (dueño o quien lo comparte)
  'GET /api/plan/datos': async (req, res, url) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const plan = await datos.primero('planes', { token: limpio(url.searchParams.get('t'), 40) });
    if (!plan || !(await quienEnPlan(email, plan))) return enviar(res, 404, { error: 'plan' });
    const ed = require('./lib/edicion');
    const r = plan.respuestas || (await datos.primero('leads', { sid: plan.sid }))?.respuestas || {};
    enviar(res, 200, { respuestas: r, campos: ed.campos({ ...plan, respuestas: r }), fijo: ['adulto', 'adoptado'].includes(r.tipo) ? (PROGRAMAS_ADULTO[r.problema] || {}).titulo : null });
  },
  'POST /api/plan/datos': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const b = await json(req);
    const plan = await datos.primero('planes', { token: limpio(b.t, 40) });
    if (!plan || plan.pack || !(await quienEnPlan(email, plan))) return enviar(res, 404, { error: 'plan' });
    const ed = require('./lib/edicion');
    const base = { ...plan, respuestas: plan.respuestas || (await datos.primero('leads', { sid: plan.sid }))?.respuestas || {} };
    const respuestas = ed.validar(base, b.cambios || {});
    // El plan y sus programas extra (mismo perro) se vuelven a generar con los datos nuevos.
    for (const p of await datos.listar('planes', { sid: plan.sid })) {
      if (p.estado !== 'enviado') continue;
      await datos.actualizar('planes', { token: p.token }, { respuestas, html: ed.regenerar(p, respuestas) });
    }
    enviar(res, 200, { ok: true, respuestas });
  },

  // Comprar otro programa desde Mi zona: cobro en un clic con la tarjeta de su compra; si el banco
  // pide confirmación, se abre el pago normal (integrado o en Stripe).
  'POST /api/programa': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const b = await json(req);
    const programa = limpio(b.programa, 20);
    if (!PROGRAMAS_ADULTO[programa] || programa === 'derivar') return enviar(res, 400, { error: 'Programa no válido.' });
    if (!b.desistimiento) return enviar(res, 400, { error: 'Marca la casilla para recibirlo al momento.' });
    const base = (await datos.listar('planes', { email })).find((p) => p.estado === 'enviado' && !p.pack);
    if (!base) return enviar(res, 400, { error: 'Necesitas tener un plan para comprar a precio de cliente.' });
    const sid = base.sid;
    if ((await datos.listar('planes', { sid })).some((p) => p.pack === programa)) return enviar(res, 200, { ok: true, ya: true });
    const precio = CFG.precioCliente;
    const registrar = async (pi, sessionId) => {
      await datos.insertar('pedidos', { session_id: sessionId, sid, email, importe: precio, tipo: 'programa', pack: programa, payment_intent: pi }, { ignorarDuplicado: true });
      const token = await entregarPack(sid, programa);
      const lead = await datos.primero('leads', { sid });
      meta.evento('Purchase', { id: 'prog_' + sessionId, email, sid, nav: meta.unir(lead?.meta, meta.datosNavegador(req, b)), valor: precio / 100, extra: { content_name: 'programa_' + programa, content_type: 'product', contents: [{ id: 'programa', quantity: 1 }] } });
      return token;
    };
    if (MODO_DEMO) return enviar(res, 200, { ok: true, token: await registrar(null, 'demo_prog_' + sid + '_' + programa) });
    const pedido = (await datos.listar('pedidos', { sid })).find((p) => p.tipo === 'plan' && p.payment_intent && !p.demo);
    // 1) En un clic, con la tarjeta guardada de su compra
    if (pedido) {
      try {
        const original = await stripe('GET', '/payment_intents/' + encodeURIComponent(pedido.payment_intent));
        if (original.customer && original.payment_method) {
          const pi = await stripe('POST', '/payment_intents', {
            amount: precio, currency: 'eur', customer: original.customer, payment_method: original.payment_method, off_session: 'true', confirm: 'true',
            description: 'Programa ' + PROGRAMAS_ADULTO[programa].titulo, statement_descriptor_suffix: 'QUEBUENPERRO',
            metadata: { sid, tipo: 'programa', app: 'cachorro', pack: programa, desistimiento: 'aceptado_' + new Date().toISOString() }
          }, 'prog_' + sid + '_' + programa);
          if (pi.status === 'succeeded') return enviar(res, 200, { ok: true, token: await registrar(pi.id, 'pi_' + pi.id) });
        }
      } catch (e) {
        console.warn('programa: sin cobro en un clic:', e.message);
        datos.insertar('eventos', { tipo: 'error', sid, paso: ('programa1clic: ' + e.message).slice(0, 200) }).catch(() => {});
      }
    }
    // 2) Pago normal
    try {
      const integrado = !!(b.integrado && CFG.stripePk);
      const vuelta = `${CFG.baseUrl}/mi-zona?programa=ok&session_id={CHECKOUT_SESSION_ID}`;
      const params = {
        mode: 'payment', customer_email: email, locale: 'es', adaptive_pricing: { enabled: 'false' },
        line_items: { 0: { quantity: 1, price_data: { currency: 'eur', unit_amount: precio, product_data: { name: 'Programa ' + PROGRAMAS_ADULTO[programa].titulo + ' (6 semanas)' } } } },
        payment_intent_data: { metadata: { sid, tipo: 'programa', app: 'cachorro', pack: programa } },
        metadata: { sid, tipo: 'programa', app: 'cachorro', pack: programa, desistimiento: 'aceptado_' + new Date().toISOString() },
        ...(integrado ? { ui_mode: 'embedded', return_url: vuelta } : { success_url: vuelta, cancel_url: `${CFG.baseUrl}/mi-zona#mas` })
      };
      const ses = await stripe('POST', '/checkout/sessions', params);
      enviar(res, 200, integrado ? { clientSecret: ses.client_secret } : { url: ses.url });
    } catch (e) {
      console.error('programa', e.message);
      datos.insertar('eventos', { tipo: 'error', sid, paso: ('programa: ' + e.message).slice(0, 200) }).catch(() => {});
      enviar(res, 502, { error: 'No hemos podido iniciar el pago. Inténtalo de nuevo.' });
    }
  },
  // Vuelta del pago normal de un programa
  'GET /api/programa/estado': async (req, res, url) => {
    const id = limpio(url.searchParams.get('session_id'), 200);
    if (!id.startsWith('cs_')) return enviar(res, 400, { error: 'id' });
    try {
      const s = await stripe('GET', '/checkout/sessions/' + encodeURIComponent(id));
      if (s.payment_status === 'paid' && s.metadata?.tipo === 'programa') await registrarPrograma(s);
      const plan = s.metadata?.sid && (await datos.listar('planes', { sid: s.metadata.sid })).find((p) => p.pack === s.metadata.pack);
      enviar(res, 200, { pagado: s.payment_status === 'paid', token: plan?.token || null });
    } catch (e) { enviar(res, 502, { error: 'No hemos podido comprobar el pago.' }); }
  },

  'POST /api/invitar': async (req, res) => {
    const b = await json(req);
    const t = limpio(b.t, 40);
    const email = limpio(b.email, 200).toLowerCase();
    const nombre = limpio(b.nombre, 30);
    const plan = /^[a-f0-9]{32}$/.test(t) && (await datos.primero('planes', { token: t }));
    if (!plan || plan.estado !== 'enviado') return enviar(res, 404, { error: 'Plan no encontrado.' });
    if (!emailValido(email)) return enviar(res, 400, { error: 'Revisa el email.' });
    if (email === plan.email) return enviar(res, 400, { error: 'Ese email ya es el del plan.' });
    const miembros = await datos.listar('miembros', { token: t });
    if (miembros.some((m) => m.email === email)) return enviar(res, 200, { ok: true, ya: true });
    if (miembros.length >= 5) return enviar(res, 400, { error: 'Como mucho 5 personas por plan.' });
    if ((invitacionesRecientes.get(t) || 0) > Date.now() - 20000) return enviar(res, 429, { error: 'Espera unos segundos y vuelve a intentarlo.' });
    invitacionesRecientes.set(t, Date.now());
    const quien = (await quienEnPlan(sesion.deCookie(req), plan))?.nombre || nombreDeEmail(plan.email);
    await datos.insertar('miembros', { token: t, email, nombre: nombre || null, invitado_por: quien }, { ignorarDuplicado: true });
    const perro = (plan.respuestas || (await datos.primero('leads', { sid: plan.sid }))?.respuestas || {}).nombre;
    const m = plantillasEmail.invitacion(email, { quien, nombre, perro, urlPlan: `${CFG.baseUrl}/plan/${t}`, urlZona: sesion.enlaceMagico(email) });
    correo.enviar(email, m.asunto, m.html).catch((e) => console.error('invitacion', e.message));
    enviar(res, 200, { ok: true });
  },

  'GET /api/retomar': async (req, res, url) => {
    const [sid, firma] = String(url.searchParams.get('t') || '').split('.');
    if (!sid || !firma || firma !== firmaRetomar(sid)) return enviar(res, 400, { error: 'enlace' });
    const lead = await datos.primero('leads', { sid });
    if (!lead) return enviar(res, 404, { error: 'lead' });
    enviar(res, 200, { sid: lead.sid, email: lead.email, respuestas: lead.respuestas, consentimientos: lead.consentimientos });
  },

  'POST /api/lead': async (req, res) => {
    const b = await json(req);
    if (!emailValido(b.email)) return enviar(res, 400, { error: 'email' });
    if (!b.consentimientos?.privacidad) return enviar(res, 400, { error: 'privacidad' });
    const r = objeto(b.respuestas);
    const lista = (x, n) => (Array.isArray(x) ? x.slice(0, 10).map((v) => limpio(v, n)) : []);
    const lead = {
      sid: limpio(b.sid, 64),
      email: limpio(b.email, 200).toLowerCase(),
      respuestas: {
        nombre: limpio(r.nombre, 40), raza: limpio(r.raza, 60), razaId: limpio(r.razaId, 20), tamano: limpio(r.tamano, 10), edadSemanas: Number(r.edadSemanas) || 0,
        vivienda: limpio(r.vivienda, 10), horasSolo: Number(r.horasSolo) || 0, problema: limpio(r.problema, 12),
        convivientes: lista(r.convivientes, 20), primerPerro: limpio(r.primerPerro, 3), comunidad: limpio(r.comunidad, 40), tiene: lista(r.tiene, 20),
        // Perro adulto o adoptado (/perro)
        tipo: ['adulto', 'adoptado'].includes(r.tipo) ? r.tipo : 'cachorro', edadPerro: limpio(r.edadPerro, 10), detalle: limpio(r.detalle, 20), muerde: limpio(r.muerde, 3)
      },
      consentimientos: { privacidad: true, comerciales: !!b.consentimientos.comerciales, seguros: !!b.consentimientos.seguros, version: '2026-11-07' },
      precio: precioPara(b.sid),
      utm: objeto(b.utm),
      meta: meta.datosNavegador(req, b)
    };
    await datos.insertar('leads', lead);
    meta.evento('Lead', { id: 'lead_' + lead.sid, email: lead.email, sid: lead.sid, nav: lead.meta, extra: { content_name: lead.respuestas.problema, content_category: lead.respuestas.tipo } });
    await datos.insertar('eventos', { tipo: 'form_completo', sid: lead.sid, utm: lead.utm });
    enviar(res, 200, { ok: true });
    // Email inmediato con el resultado que ha pedido (rutina o 3 primeros días). Es la respuesta a su
    // solicitud, así que va a todos; la secuencia comercial de los días 1 a 7 solo con consentimiento.
    const m = plantillasEmail.nurture(0, lead);
    correo.enviarUnaVez(lead.email, m.clave, m.asunto, m.html).catch((e) => console.error('nurture_0', e.message));
  },

  'POST /api/checkout': async (req, res) => {
    const b = await json(req);
    if (!b.desistimiento) return enviar(res, 400, { error: 'Debes aceptar el inicio inmediato del contenido digital.' });
    const sid = limpio(b.sid, 64);
    const lead = await datos.primero('leads', { sid });
    if (!lead) return enviar(res, 400, { error: 'Completa primero el formulario.' });
    const precio = precioPara(sid);
    await datos.insertar('eventos', { tipo: 'checkout_inicio', sid, utm: lead.utm });
    lead.meta = meta.unir(lead.meta, meta.datosNavegador(req, b));
    const previo = Array.isArray(b.previo) ? b.previo.filter((k) => /^d[1-7]$/.test(k)).slice(0, 7) : [];
    datos.actualizar('leads', { sid }, { meta: lead.meta, ...(previo.length ? { previo } : {}) }).catch((e) => console.error('lead meta', e.message));
    meta.evento('InitiateCheckout', { id: 'ic_' + sid, email: lead.email, sid, nav: lead.meta, valor: precio / 100, extra: { content_name: lead.respuestas.problema, num_items: 1 } });
    const pagina = esAdulto(lead.respuestas) ? '/perro' : '/cachorro';
    if (MODO_DEMO) return enviar(res, 200, { url: `${CFG.baseUrl}${pagina}?pago=ok&session_id=demo_${sid}` });
    const PROGRAMAS = require('./content/programas-adulto.js').PROGRAMAS;
    const nombreProducto = esAdulto(lead.respuestas)
      ? `${(PROGRAMAS[lead.respuestas.problema] || PROGRAMAS.correa).titulo}: plan de 6 semanas para ${lead.respuestas.nombre || 'tu perro'}`
      : `Plan de 8 semanas para ${lead.respuestas.nombre || 'tu cachorro'}`;
    try {
      const sesionPago = {
        mode: 'payment', customer_creation: 'always', customer_email: lead.email, locale: 'es',
        // Solo euros: sin el selector de moneda local de Stripe (la cuenta la tiene activada para otros negocios).
        adaptive_pricing: { enabled: 'false' },
        line_items: { 0: { quantity: 1, price_data: { currency: 'eur', unit_amount: precio, product_data: { name: nombreProducto, description: 'Plan personalizado, una tarea al día y Mi zona en tu móvil.' } } } },
        payment_intent_data: { setup_future_usage: 'off_session', metadata: { sid, tipo: 'plan', app: 'cachorro' } },
        metadata: { sid, precio, app: 'cachorro', desistimiento: 'aceptado_' + new Date().toISOString() },
        success_url: `${CFG.baseUrl}${pagina}?pago=ok&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${CFG.baseUrl}${pagina}?pago=cancelado`
      };
      // La cuenta de Stripe puede ser compartida (Vigila): en la página de pago se muestra
      // nuestra marca, y en el extracto bancario el sufijo QUEBUENPERRO.
      sesionPago.payment_intent_data.statement_descriptor_suffix = 'QUEBUENPERRO';
      const marcaPago = { display_name: CFG.marca, icon: { type: 'url', url: `${CFG.baseUrl}/apple-touch-icon.png` }, button_color: '#1b2a41', border_style: 'rounded' };
      // Pago integrado en la página (Embedded Checkout) si el navegador lo pide y hay clave publicable.
      const integrado = !!(b.integrado && CFG.stripePk);
      if (integrado) {
        sesionPago.ui_mode = 'embedded';
        sesionPago.return_url = sesionPago.success_url;
        delete sesionPago.success_url; delete sesionPago.cancel_url;
      }
      const crear = (params) => stripe('POST', '/checkout/sessions', params);
      let s;
      // La personalización de marca es para la página de Stripe; en el pago integrado ya estamos en nuestra web.
      try { s = await crear(integrado ? sesionPago : { ...sesionPago, branding_settings: marcaPago }); }
      catch (e) {
        if (!/branding_settings|statement_descriptor/.test(e.message)) throw e;
        console.warn('checkout: sin personalización de marca:', e.message);
        delete sesionPago.payment_intent_data.statement_descriptor_suffix;
        s = await crear(sesionPago);
      }
      enviar(res, 200, integrado ? { clientSecret: s.client_secret } : { url: s.url });
    } catch (e) {
      console.error('checkout', e.message);
      enviar(res, 502, { error: 'No hemos podido iniciar el pago. Inténtalo de nuevo.' });
    }
  },

  'GET /api/pedido': async (req, res, url) => {
    const id = limpio(url.searchParams.get('session_id'), 200);
    if (MODO_DEMO && id.startsWith('demo_')) {
      const sid = id.slice(5);
      const lead = await datos.primero('leads', { sid });
      await datos.insertar('pedidos', { session_id: id, sid, email: lead?.email, importe: precioPara(sid), tipo: 'plan', demo: true, utm: lead?.utm || {} }, { ignorarDuplicado: true });
      const up = await datos.primero('pedidos', { session_id: id, tipo: 'upsell' });
      return enviar(res, 200, { pagado: true, importe: precioPara(sid), upsell: !up });
    }
    if (!id.startsWith('cs_')) return enviar(res, 400, { error: 'id' });
    try {
      const s = await stripe('GET', '/checkout/sessions/' + encodeURIComponent(id));
      const pagado = s.payment_status === 'paid';
      if (pagado) await registrarPedido(s);
      const up = await datos.primero('pedidos', { session_id: id, tipo: 'upsell' });
      enviar(res, 200, { pagado, importe: s.amount_total, upsell: pagado && !up });
    } catch (e) {
      enviar(res, 502, { error: 'No hemos podido comprobar el pago.' });
    }
  },

  'POST /api/upsell': async (req, res) => {
    const b = await json(req);
    const id = limpio(b.session_id, 200);
    if (await datos.primero('pedidos', { session_id: id, tipo: 'upsell' })) return enviar(res, 200, { ok: true });
    if (MODO_DEMO && id.startsWith('demo_')) {
      await datos.insertar('pedidos', { session_id: id, sid: id.slice(5), importe: CFG.precioUpsell, tipo: 'upsell', pack: limpio(b.pack, 30), demo: true }, { ignorarDuplicado: true });
      return enviar(res, 200, { ok: true });
    }
    try {
      const s = await stripe('GET', '/checkout/sessions/' + encodeURIComponent(id), { expand: { 0: 'payment_intent' } });
      if (s.payment_status !== 'paid') return enviar(res, 400, { error: 'pedido' });
      const pi = await stripe('POST', '/payment_intents', {
        amount: CFG.precioUpsell, currency: 'eur', customer: s.customer, payment_method: s.payment_intent.payment_method,
        off_session: 'true', confirm: 'true', description: 'Pack problema', metadata: { sid: s.metadata.sid, tipo: 'upsell', app: 'cachorro', pack: limpio(b.pack, 30), session_id: id }
      }, 'upsell_' + id);
      if (pi.status === 'succeeded') {
        await datos.insertar('pedidos', { session_id: id, sid: s.metadata.sid, email: s.customer_details?.email, importe: CFG.precioUpsell, tipo: 'upsell', pack: limpio(b.pack, 30), payment_intent: pi.id }, { ignorarDuplicado: true });
        entregarPack(s.metadata.sid, limpio(b.pack, 30));
        const leadUp = await datos.primero('leads', { sid: s.metadata.sid });
        meta.evento('Purchase', { id: 'upsell_' + id, email: s.customer_details?.email, sid: s.metadata.sid, nav: meta.unir(leadUp?.meta, meta.datosNavegador(req, b)),
          valor: CFG.precioUpsell / 100, extra: { content_name: 'upsell_' + limpio(b.pack, 30), content_type: 'product', contents: [{ id: 'upsell', quantity: 1 }] } });
        return enviar(res, 200, { ok: true });
      }
      enviar(res, 402, { error: 'El banco pide confirmar el pago. Te lo enviamos por email.' });
    } catch (e) {
      console.error('upsell', e.message);
      enviar(res, 402, { error: 'No hemos podido cobrar el pack. Tu plan no se ve afectado.' });
    }
  },

  'POST /api/webhook': async (req, res) => {
    const raw = await leerCuerpo(req, 1_000_000);
    if (!verificarFirmaStripe(raw, req.headers['stripe-signature'])) return enviar(res, 400, { error: 'firma' });
    const ev = JSON.parse(raw);
    const obj = ev.data?.object || {};
    // La cuenta de Stripe puede ser compartida: solo procesamos lo que es del cachorro.
    if (ev.type === 'checkout.session.completed' && obj.metadata?.app === 'cachorro' && obj.payment_status === 'paid') await (obj.metadata?.tipo === 'programa' ? registrarPrograma(obj) : registrarPedido(obj));
    if (ev.type === 'charge.refunded' && obj.metadata?.app === 'cachorro') {
      await datos.insertar('reembolsos', { charge: obj.id, payment_intent: obj.payment_intent, importe: obj.amount_refunded, sid: obj.metadata?.sid, tipo: obj.metadata?.tipo }, { ignorarDuplicado: true });
    }
    enviar(res, 200, { recibido: true });
  },

  // Encuesta de 1 clic desde los emails de los días 7 y 21.
  'GET /api/encuesta': async (req, res, url) => {
    const nota = Number(url.searchParams.get('n')), dia = Number(url.searchParams.get('d'));
    const email = limpio(url.searchParams.get('e'), 200).toLowerCase();
    if (nota >= 1 && nota <= 10 && [7, 21].includes(dia) && emailValido(email)) {
      const lead = await datos.primero('leads', { email });
      await datos.insertar('eventos', { tipo: 'encuesta', sid: lead?.sid || '', paso: `d${dia}:${nota}`, utm: {} });
    }
    html(res, 200, pagina('Gracias', '<h1>¡Gracias!</h1><p class="suave">Tu respuesta nos ayuda a mejorar el plan. Si quieres contarnos algo más, responde al email.</p>'));
  },

  // ---------- Mi zona ----------
  'POST /api/acceso': async (req, res) => {
    const b = await json(req);
    const email = limpio(b.email, 200).toLowerCase();
    // Siempre la misma respuesta: no revelamos si un email es cliente.
    enviar(res, 200, { ok: true });
    if (!emailValido(email) || pedidosAcceso.get(email) > Date.now() - 120000) return;
    pedidosAcceso.set(email, Date.now());
    if (!(await planesDe(email)).length) return;
    const m = plantillasEmail.acceso(email, sesion.enlaceMagico(email));
    correo.enviar(email, m.asunto, m.html).catch((e) => console.error('acceso', e.message));
  },

  'GET /api/mi-zona': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const planes = await planesDe(email);
    // Al entrar, la invitación queda aceptada (desde ahí recibe también la tarea diaria por email).
    for (const m of await datos.listar('miembros', { email })) if (!m.aceptado_at) datos.actualizar('miembros', { id: m.id }, { aceptado_at: new Date().toISOString() }).catch(() => {});
    const lista = [];
    for (const p of planes) {
      const r = p.respuestas || (await datos.primero('leads', { sid: p.sid }))?.respuestas || {};
      const adulto = !!p.pack || r.tipo === 'adulto' || r.tipo === 'adoptado';
      const problema = p.pack || r.problema;
      const prog = adulto ? (PROGRAMAS_ADULTO[problema] || PROGRAMAS_ADULTO.correa) : null;
      lista.push({ token: p.token, nombre: r.nombre || 'Tu perro', raza: r.raza || '', razaId: r.razaId || 'mestizo', tipo: p.pack ? 'pack' : (r.tipo || 'cachorro'), problema: problema || '',
        titulo: adulto ? prog.titulo : 'Plan de 8 semanas', dias: adulto ? 42 : 56, desde: p.enviado_at || p.ts, extra: !!p.pack,
        compartido: !!p.compartido, invitadoPor: p.invitadoPor || null, progreso: p.progreso || {},
        miembros: (await datos.listar('miembros', { token: p.token })).map((m) => ({ nombre: m.nombre || nombreDeEmail(m.email), email: m.email, aceptado: !!m.aceptado_at })),
        dueno: p.compartido ? nombreDeEmail(p.email) : null });
    }
    const problemas = [...new Set(lista.map((p) => p.problema).filter(Boolean))];
    const productos = [...ZONA.PRODUCTOS.base, ...problemas.flatMap((k) => ZONA.PRODUCTOS[k] || [])].filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i);
    const consejos = [...problemas.flatMap((k) => ZONA.CONSEJOS[k] || []), ...ZONA.CONSEJOS.general];
    const enClub = !!(await datos.primero('emails', { email, clave: 'club' }));
    // Catálogo: los programas que aún no tiene, a precio de cliente (solo para quien compró el plan).
    const propio = lista.find((p) => !p.compartido && !p.extra);
    const tiene = new Set(lista.filter((p) => !p.compartido).map((p) => p.problema));
    const catalogo = propio ? Object.entries(PROGRAMAS_ADULTO).filter(([k]) => !tiene.has(k) && k !== 'derivar').map(([k, pg]) => ({
      id: k, titulo: pg.titulo, icono: pg.icono, texto: String(pg.porQue || '').replace(/\{n\}/g, propio.nombre).split('. ')[0] + '.', semanas: pg.semanas.length
    })) : [];
    enviar(res, 200, { email, planes: lista, consejos, productos, seguros: ZONA.SEGUROS, marca: CFG.marca, enClub,
      catalogo, catalogoPara: propio ? propio.nombre : null, precioCliente: CFG.precioCliente, precioNormal: CFG.precios[0], stripePk: MODO_DEMO ? '' : CFG.stripePk });
  },

  // Diario de pis y caca (Mi zona)
  'GET /api/diario': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const desde = Date.now() - 14 * 864e5;
    const cuenta = await cuentaDiario(email);
    const filas = (await datos.listar('diario', { email: cuenta }, { orden: 'ts.desc', limite: 500 })).filter((f) => new Date(f.ts).getTime() >= desde);
    enviar(res, 200, { registros: filas.map(({ id, ts, tipo, lugar, por }) => ({ id, ts, tipo, lugar, por: por || null })) });
  },
  'POST /api/diario': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const b = await json(req);
    if (!['pis', 'caca'].includes(b.tipo) || !['fuera', 'dentro'].includes(b.lugar)) return enviar(res, 400, { error: 'datos' });
    const cuenta = await cuentaDiario(email);
    const m = cuenta !== email ? await datos.primero('miembros', { email }) : null;
    const por = cuenta !== email ? (m?.nombre || nombreDeEmail(email)) : nombreDeEmail(email);
    const fila = await datos.insertar('diario', { email: cuenta, tipo: b.tipo, lugar: b.lugar, por }, { devolver: true });
    enviar(res, 200, { registro: { id: fila.id, ts: fila.ts, tipo: fila.tipo, lugar: fila.lugar, por } });
  },
  'POST /api/diario/borrar': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    const b = await json(req);
    if (!/^\d+$/.test(String(b.id || ''))) return enviar(res, 400, { error: 'id' });
    await datos.borrar('diario', { email: await cuentaDiario(email), id: String(b.id) });
    enviar(res, 200, { ok: true });
  },

  // Club (de momento, solo lista de interés para medir la demanda)
  'POST /api/club': async (req, res) => {
    const email = sesion.deCookie(req);
    if (!email) return enviar(res, 401, { error: 'sesion' });
    await datos.insertar('emails', { email, clave: 'club' }, { ignorarDuplicado: true });
    enviar(res, 200, { ok: true });
  },

  'POST /api/salir': async (req, res) => enviar(res, 200, { ok: true }, 'application/json', { 'Set-Cookie': sesion.cerrar() }),

  'GET /mi-zona/entrar': async (req, res, url) => {
    const email = sesion.leer(url.searchParams.get('t'));
    if (!email) return html(res, 400, pagina('Enlace caducado', '<h1>Este enlace ha caducado</h1><p class="suave">Pide uno nuevo desde <a href="/mi-zona">Mi zona</a>.</p>'));
    res.writeHead(302, { Location: '/mi-zona', 'Set-Cookie': sesion.cabeceraCookie(email), 'Cache-Control': 'no-store' });
    res.end();
  },

  'GET /baja': async (req, res, url) => {
    const email = limpio(url.searchParams.get('e'), 200).toLowerCase();
    const t = limpio(url.searchParams.get('t'), 64);
    if (!emailValido(email) || t !== firmaBaja(email)) return html(res, 400, pagina('Enlace no válido', '<h1>Enlace no válido</h1><p>Escríbenos y te damos de baja a mano.</p>'));
    await datos.insertar('emails', { email, clave: 'baja' }, { ignorarDuplicado: true });
    html(res, 200, pagina('Baja confirmada', `<h1>Te hemos dado de baja</h1><p class="suave">No recibirás más emails de ${CFG.marca}. Si compraste el plan, sigues teniendo acceso a tu página privada.</p>`));
  },

  'GET /api/admin/metricas': async (req, res, url) => {
    if (!sesion.adminDeCookie(req)) return enviar(res, 401, { error: 'sesion' });
    const { calcular } = require('./scripts/metricas.js');
    enviar(res, 200, await calcular({ gasto: url.searchParams.get('gasto') ? Number(url.searchParams.get('gasto')) : null }));
  },

  'GET /api/admin/panel': async (req, res, url) => {
    if (!sesion.adminDeCookie(req)) return enviar(res, 401, { error: 'sesion' });
    const dias = Number(url.searchParams.get('dias')) || 30;
    const g = url.searchParams.get('gasto');
    enviar(res, 200, { email: sesion.adminDeCookie(req), ...(await require('./lib/panel').panel({ dias, gasto: g !== null && g !== '' ? Number(g) : null })) });
  },

  'POST /api/admin/acceso': async (req, res) => {
    const b = await json(req);
    const email = limpio(b.email, 200).toLowerCase();
    // Misma respuesta siempre: no revelamos qué emails son administradores.
    enviar(res, 200, { ok: true });
    if (!sesion.esAdmin(email) || pedidosAcceso.get('admin:' + email) > Date.now() - 60000) return;
    pedidosAcceso.set('admin:' + email, Date.now());
    correo.enviar(email, `Acceso al panel · ${CFG.marca}`, `<p>Entra al panel de ${CFG.marca} con este enlace (válido 1 hora):</p><p><a href="${sesion.enlaceAdmin(email)}">Entrar al panel</a></p><p style="color:#5c6b80;font-size:14px">Si no lo has pedido tú, ignora este email.</p>`)
      .catch((e) => console.error('acceso admin', e.message));
  },

  'GET /admin/entrar': async (req, res, url) => {
    const email = sesion.leerEnlaceAdmin(url.searchParams.get('t'));
    if (!email) { res.writeHead(302, { Location: '/admin.html?caducado=1', 'Cache-Control': 'no-store' }); return res.end(); }
    res.writeHead(302, { Location: '/admin.html', 'Set-Cookie': sesion.cookieAdmin(email), 'Cache-Control': 'no-store' });
    res.end();
  },

  'POST /api/admin/salir': async (req, res) => enviar(res, 200, { ok: true }, 'application/json', { 'Set-Cookie': sesion.cerrarAdmin() })

};

// ---------- Planes compartidos ----------
const nombreDeEmail = (email) => { const x = String(email || '').split('@')[0].split(/[._+-]/)[0]; return x ? x.charAt(0).toUpperCase() + x.slice(1) : 'Alguien'; };
/** Planes que ve un email en Mi zona: los suyos y los que le han compartido. */
async function planesDe(email) {
  const propios = (await datos.listar('planes', { email })).filter((p) => p.estado === 'enviado');
  const lista = [...propios];
  for (const m of await datos.listar('miembros', { email })) {
    const p = await datos.primero('planes', { token: m.token });
    if (p && p.estado === 'enviado' && p.email !== email && !lista.some((x) => x.token === p.token)) lista.push({ ...p, compartido: true, invitadoPor: m.invitado_por });
  }
  return lista;
}
/** Quién es esta persona dentro de un plan (para "marcado por"). */
async function quienEnPlan(email, plan) {
  if (!email) return null;
  if (email === plan.email) return { rol: 'dueno', nombre: nombreDeEmail(email) };
  const m = await datos.primero('miembros', { token: plan.token, email });
  return m ? { rol: 'miembro', nombre: m.nombre || nombreDeEmail(email) } : null;
}
/** El diario se comparte: los miembros escriben en el del dueño del plan. */
async function cuentaDiario(email) {
  if (await datos.primero('planes', { email })) return email;
  const m = await datos.primero('miembros', { email });
  const p = m && (await datos.primero('planes', { token: m.token }));
  return p ? p.email : email;
}
const invitacionesRecientes = new Map();

// Conciliación: registra y entrega cualquier pago de los últimos días que no quedara guardado
// (cierre de la pestaña, un fallo puntual, el webhook sin llegar…). Es idempotente.
async function conciliarStripe() {
  if (MODO_DEMO) return;
  const desde = Math.floor(Date.now() / 1000) - 5 * 86400;
  const sesiones = await stripe('GET', '/checkout/sessions', { limit: 100, status: 'complete', created: { gte: desde } });
  for (const s of sesiones.data || []) {
    if (s.metadata?.app !== 'cachorro' || s.payment_status !== 'paid') continue;
    if (s.metadata?.tipo === 'programa') await registrarPrograma(s); else await registrarPedido(s);
  }
  const pagos = await stripe('GET', '/payment_intents', { limit: 100, created: { gte: desde } });
  for (const pi of pagos.data || []) {
    const m = pi.metadata || {};
    if (pi.status !== 'succeeded' || m.app !== 'cachorro' || !['programa', 'upsell'].includes(m.tipo) || !m.sid || !m.pack) continue;
    if (await datos.primero('pedidos', { payment_intent: pi.id })) continue;
    const base = (await datos.listar('planes', { sid: m.sid })).find((p) => !p.pack);
    await datos.insertar('pedidos', { session_id: m.tipo === 'upsell' ? m.session_id : 'pi_' + pi.id, sid: m.sid, email: base?.email || pi.receipt_email, importe: pi.amount_received || pi.amount,
      tipo: m.tipo, pack: m.pack, payment_intent: pi.id, desistimiento: m.desistimiento }, { ignorarDuplicado: true });
    await entregarPack(m.sid, m.pack);
    console.log('conciliación: registrado', m.tipo, m.pack, pi.id);
  }
}

async function registrarPrograma(s) {
  const sid = s.metadata?.sid, programa = s.metadata?.pack;
  if (!sid || !programa || (await datos.primero('pedidos', { session_id: s.id }))) return;
  await datos.insertar('pedidos', { session_id: s.id, sid, email: s.customer_details?.email || s.customer_email, importe: s.amount_total, tipo: 'programa', pack: programa,
    payment_intent: typeof s.payment_intent === 'object' ? s.payment_intent?.id : s.payment_intent, desistimiento: s.metadata?.desistimiento }, { ignorarDuplicado: true });
  await entregarPack(sid, programa);
}

async function registrarPedido(s) {
  if (await datos.primero('pedidos', { session_id: s.id, tipo: 'plan' })) return;
  const lead = await datos.primero('leads', { sid: s.metadata?.sid });
  await datos.insertar('pedidos', {
    session_id: s.id, sid: s.metadata?.sid, email: s.customer_details?.email || lead?.email, importe: s.amount_total, tipo: 'plan',
    payment_intent: typeof s.payment_intent === 'object' ? s.payment_intent?.id : s.payment_intent, desistimiento: s.metadata?.desistimiento, utm: lead?.utm || {}
  }, { ignorarDuplicado: true });
  // Entrega automática: genera el plan, lo envía por email y activa Mi zona.
  entregarPlan(s.metadata?.sid);
  // Mismo event_id que el píxel del navegador ('compra_' + session_id): Meta deduplica.
  await meta.evento('Purchase', { id: 'compra_' + s.id, email: s.customer_details?.email || lead?.email, sid: s.metadata?.sid, nav: lead?.meta || {},
    valor: s.amount_total / 100, extra: { content_name: lead?.respuestas?.problema, content_type: 'product', contents: [{ id: 'plan', quantity: 1 }] } });
}

// ---------- SEO de las páginas del funnel y utilidades ----------
const FUNNEL_SEO = {
  '/cachorro': {
    titulo: SEO.conMarca('Todo para educar a tu cachorro en positivo'),
    descripcion: 'Todo para educar a tu cachorro: plan de 8 semanas según su raza, edad y casa (pis, mordiscos, noches), clicker y diario. Test gratis.',
    h1: 'Todo lo que necesitas para educar a tu cachorro',
    texto: 'Responde 12 preguntas sobre tu cachorro y recibe gratis su rutina de mañana: horarios de comidas, siestas y salidas a hacer pis según su edad y su tamaño.',
    producto: 'Plan de 8 semanas para tu cachorro'
  },
  '/perro': {
    titulo: SEO.conMarca('Todo para educar a tu perro adulto o adoptado'),
    descripcion: 'Todo lo que necesitas para educar a tu perro: plan de 6 semanas para la correa, los ladridos, quedarse solo o la adopción, con clicker y consejos. Test gratis.',
    h1: 'Todo lo que necesitas para educar a tu perro',
    texto: 'Tirar de la correa, ladrar, quedarse solo o adaptarse a casa tras la adopción: responde unas preguntas y recibe gratis sus 3 primeros días de plan.',
    producto: 'Plan de 6 semanas para tu perro'
  }
};
const cacheFunnel = {};
function paginaFunnel(ruta) {
  if (cacheFunnel[ruta]) return cacheFunnel[ruta];
  const f = FUNNEL_SEO[ruta];
  const base = fs.readFileSync(path.join(PUBLIC, PAGINAS[ruta]), 'utf8');
  const producto = { '@context': 'https://schema.org', '@type': 'Product', name: f.producto, description: f.descripcion, brand: { '@type': 'Brand', name: CFG.marca }, image: SEO.url('/og.png'),
    offers: { '@type': 'Offer', price: (CFG.precios[0] / 100).toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: SEO.url(ruta) } };
  const cabeza = SEO.cabeza({ titulo: f.titulo, descripcion: f.descripcion, ruta, jsonld: [producto, SEO.migas([['Inicio', '/'], [f.h1, ruta]])] });
  // Contenido inicial visible sin JavaScript (el funnel lo sustituye al cargar)
  const inicial = `<div class="pila"><h1>${SEO.esc(f.h1)}</h1><p class="suave">${SEO.esc(f.texto)}</p><noscript><p>Para hacer el test necesitas activar JavaScript. Mientras tanto, puedes leer nuestras <a href="/guias">guías</a>.</p></noscript></div>`;
  cacheFunnel[ruta] = base.replace(/<head>[\s\S]*<\/head>/, `<head>\n${cabeza}\n</head>`).replace('<main id="app" aria-live="polite"></main>', `<main id="app" aria-live="polite">${inicial}</main>`);
  return cacheFunnel[ruta];
}
function redirigir(res, destino, codigo) { res.writeHead(codigo, { Location: destino, 'Cache-Control': codigo === 301 ? 'public, max-age=86400' : 'no-store' }); res.end(); }
function noEncontrado(res) {
  enviar(res, 404, SEO.pagina({ titulo: SEO.conMarca('Página no encontrada'), descripcion: 'Esta página no existe.', ruta: '/404', noindex: true,
    cuerpo: '<div class="pila"><h1>No encontramos esta página</h1><p class="suave">Puede que el enlace esté mal o que la hayamos movido.</p><p><a href="/">Ir al inicio</a> · <a href="/guias">Ver las guías</a> · <a href="/razas">Ver las razas</a></p></div>' }), TIPOS['.html']);
}

// ---------- Servidor ----------
const ESTATICOS_CONTENT = ['/plantillas.js', '/tareas-diarias.js', '/plan-html.js', '/programas-adulto.js', '/plan-adulto-html.js', '/zona.js'];
const pedidosAcceso = new Map();
const PAGINAS = { '/cachorro': 'cachorro.html', '/perro': 'perro.html' };
const esAdulto = (r) => r && (r.tipo === 'adulto' || r.tipo === 'adoptado');
const HOST_CANONICO = new URL(CFG.baseUrl).host;
const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, CFG.baseUrl);
  // Un solo dominio para Google: www, .es u onrender.com → 301 al dominio de BASE_URL.
  // No afecta a la API (webhooks de Stripe), a /salud ni a las pruebas en local.
  const host = (req.headers.host || '').toLowerCase();
  if (process.env.BASE_URL && host && host !== HOST_CANONICO && !/^(localhost|127\.|\[::1\])/.test(host) && !url.pathname.startsWith('/api/') && url.pathname !== '/salud') {
    res.writeHead(301, { Location: CFG.baseUrl + url.pathname + url.search, 'Cache-Control': 'public, max-age=3600' });
    return res.end();
  }
  try {
    const ruta = rutas[`${req.method} ${url.pathname}`];
    if (ruta) return await ruta(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return enviar(res, 405, { error: 'método' });
    if (url.pathname === '/salud') return enviar(res, 200, { ok: true, supabase: datos.USA_SUPABASE, stripe: !MODO_DEMO, email: correo.configurado(), metaCapi: meta.configurado() });

    // Página privada del plan: /plan/<token de 32 hex>
    const m = url.pathname.match(/^\/plan\/([a-f0-9]{32})$/);
    if (m) {
      const plan = await datos.primero('planes', { token: m[1] });
      if (!plan) return html(res, 404, pagina('Plan no encontrado', '<h1>No encontramos este plan</h1><p>Revisa el enlace del email o escríbenos.</p>'));
      // Plan compartido: sincroniza el progreso y añade el botón de invitar (vale también para planes ya entregados).
      // Día del plan por día del calendario (los planes antiguos contaban 24 h desde la entrega).
      const conCompartir = plan.html.split('Math.floor((Date.now()-inicio.getTime())/864e5)+1').join('Math.round((new Date().setHours(0,0,0,0)-new Date(inicio.getTime()).setHours(0,0,0,0))/864e5)+1').replace(/<body([^>]*)>/, (b) => `${b}<script src="/plan-compartido.js" data-t="${plan.token}"></script>`);
      return enviar(res, 200, conCompartir, TIPOS['.html'], { 'X-Robots-Tag': 'noindex' });
    }
    // Páginas indexables (generadas en el servidor)
    const CACHE_HTML = { 'Cache-Control': 'public, max-age=600' };
    if (url.pathname === '/admin' || url.pathname === '/admin/metricas') return redirigir(res, '/admin.html', 302);
    if (url.pathname === '/') {
      // Compatibilidad con anuncios antiguos: /?a=pis → /cachorro?a=pis
      const a = url.searchParams.get('a');
      if (['pis', 'noches', 'mordiscos', 'solo', 'rutina'].includes(a)) return redirigir(res, '/cachorro' + url.search, 302);
      if (['correa', 'ladridos', 'soledad', 'adopcion'].includes(a)) return redirigir(res, '/perro' + url.search, 302);
      return enviar(res, 200, guias.portada(), TIPOS['.html'], CACHE_HTML);
    }
    if (url.pathname === '/guias') return enviar(res, 200, guias.hubGuias(), TIPOS['.html'], CACHE_HTML);
    if (url.pathname === '/razas') return enviar(res, 200, guias.hubRazas(), TIPOS['.html'], CACHE_HTML);
    if (url.pathname === '/guias/indice.json' || url.pathname === '/blog/indice.json') return enviar(res, 200, guias.indiceJson(), 'application/json', CACHE_HTML);
    const mg = url.pathname.match(/^\/guias\/([a-z0-9-]+)$/);
    if (mg) { const h = guias.guia(mg[1]); return h ? enviar(res, 200, h, TIPOS['.html'], CACHE_HTML) : noEncontrado(res); }
    const mr = url.pathname.match(/^\/razas\/([a-z0-9-]+)$/);
    if (mr) { const h = guias.raza(mr[1]); return h ? enviar(res, 200, h, TIPOS['.html'], CACHE_HTML) : noEncontrado(res); }
    // Barra final y antiguo /blog → 301 a la URL buena
    if (/^\/(guias|razas)\/.+\/$/.test(url.pathname) || url.pathname === '/guias/' || url.pathname === '/razas/') return redirigir(res, url.pathname.replace(/\/+$/, '') + url.search, 301);
    if (url.pathname === '/blog' || url.pathname === '/blog/') return redirigir(res, '/guias', 301);
    const mb = url.pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
    if (mb) return redirigir(res, '/guias/' + mb[1], 301);
    if (url.pathname === '/sitemap.xml') return enviar(res, 200, guias.sitemap(), 'application/xml; charset=utf-8', { 'Cache-Control': 'public, max-age=3600' });
    if (url.pathname === '/robots.txt') return enviar(res, 200, guias.robots(), TIPOS['.txt'], { 'Cache-Control': 'public, max-age=3600' });

    // Mi zona: desde el enlace privado del plan se entra directamente.
    if (url.pathname === '/mi-zona') {
      const t = url.searchParams.get('plan');
      if (t && /^[a-f0-9]{32}$/.test(t)) {
        const plan = await datos.primero('planes', { token: t });
        if (plan) { res.writeHead(302, { Location: '/mi-zona', 'Set-Cookie': sesion.cabeceraCookie(plan.email), 'Cache-Control': 'no-store' }); return res.end(); }
      }
      return servirArchivo(res, path.join(PUBLIC, 'mi-zona.html'));
    }
    if (PAGINAS[url.pathname]) return enviar(res, 200, paginaFunnel(url.pathname), TIPOS['.html'], { 'Cache-Control': 'public, max-age=300' });
    if (ESTATICOS_CONTENT.includes(url.pathname)) return servirArchivo(res, path.join(__dirname, 'content', url.pathname.slice(1)));
    if (url.pathname === '/terminos' || url.pathname === '/terminos-y-condiciones' || url.pathname === '/aviso-legal') return redirigir(res, '/condiciones', 301);
    if (url.pathname === '/privacidad' || url.pathname === '/condiciones') {
      const legal = { '/privacidad': ['Política de privacidad', `Cómo tratamos tus datos en ${CFG.marca}: qué datos pedimos, para qué, con qué base legal y cómo ejercer tus derechos.`], '/condiciones': ['Términos y condiciones', `Términos y condiciones de ${CFG.marca}: quiénes somos, uso de la web, qué incluye el plan, precio, entrega, desistimiento y responsabilidad.`] }[url.pathname];
      const h = fs.readFileSync(path.join(PUBLIC, url.pathname.slice(1) + '.html'), 'utf8')
        .replace(/<head>[\s\S]*<\/head>/, `<head>\n${SEO.cabeza({ titulo: SEO.conMarca(legal[0]), descripcion: legal[1], ruta: url.pathname })}\n</head>`)
        .replaceAll('{{MARCA}}', CFG.marca).replaceAll('{{BASE}}', CFG.baseUrl).replaceAll('{{EMAIL}}', CFG.emailContacto).replaceAll('{{TITULAR}}', CFG.titular);
      return html(res, 200, h);
    }
    if (url.pathname.endsWith('.html') && !['/admin.html', '/mi-zona.html', '/offline.html'].includes(url.pathname)) return noEncontrado(res);
    const archivo = path.normalize(path.join(PUBLIC, url.pathname));
    if (!archivo.startsWith(PUBLIC + path.sep)) return enviar(res, 403, 'Prohibido', 'text/plain');
    fs.stat(archivo, (err, st) => (err || !st.isFile() ? noEncontrado(res) : servirArchivo(res, archivo)));
  } catch (e) {
    console.error(req.method, url.pathname, e);
    if (!res.headersSent) enviar(res, 500, { error: 'interno' });
  }
});

if (require.main === module) {
  servidor.listen(CFG.puerto, () => {
    console.log(`${CFG.marca} en ${CFG.baseUrl} (puerto ${CFG.puerto})`);
    console.log('Datos:', datos.USA_SUPABASE ? 'Supabase' : 'archivos en data/ (desarrollo)');
    console.log(MODO_DEMO ? 'MODO DEMO: sin Stripe, los pagos se simulan.' : 'Stripe activo.');
    console.log('Emails:', correo.configurado() ? 'Resend' : 'desactivados (sin RESEND_API_KEY)');
    if (!MODO_DEMO) entregarPendientes().catch((e) => console.error('entregas pendientes', e.message));
    if (!MODO_DEMO) {
      const conciliar = () => conciliarStripe().catch((e) => console.error('conciliación', e.message));
      setTimeout(conciliar, 20000);
      setInterval(conciliar, 60 * 60000);
    }
    // Emails programados (secuencia de 7 días a leads, tarea diaria a compradores, encuestas).
    // Cada hora, solo de 9 a 21 h en España. Cada email sale una sola vez aunque se repita la ejecución.
    if (correo.configurado() && datos.USA_SUPABASE) {
      let enCurso = false;
      const tanda = () => {
        const hora = Number(new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false }).format(new Date()));
        if (enCurso || hora < 9 || hora >= 21) return;
        enCurso = true;
        require('./scripts/enviar-emails').enviarEmails().catch((e) => console.error('[emails]', e.message)).finally(() => { enCurso = false; });
      };
      setTimeout(tanda, 60000);
      setInterval(tanda, 60 * 60000);
    }
    console.log('Precios en test:', CFG.precios.map((p) => (p / 100).toFixed(2) + ' €').join(' / '));
  });
}
module.exports = { servidor };
