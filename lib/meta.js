/* Meta Conversions API (eventos desde el servidor).
 * Complementa al píxel del navegador: la compra se registra aunque el cliente cierre la pestaña,
 * tenga bloqueador o Safari limite las cookies. Cada evento lleva el mismo event_id que el píxel,
 * así Meta los deduplica y no cuenta dos veces.
 * Solo se envía si la persona aceptó las cookies de medición (RGPD).
 * Variables: META_PIXEL_ID, META_CAPI_TOKEN y, para probar, META_TEST_EVENT_CODE. */
'use strict';
const crypto = require('crypto');
const { CFG } = require('./config.js');

const TOKEN = process.env.META_CAPI_TOKEN || '';
const CODIGO_PRUEBA = process.env.META_TEST_EVENT_CODE || '';
const configurado = () => !!(CFG.pixelId && TOKEN);
const h = (v) => (v ? crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex') : undefined);

function leerCookie(req, nombre) {
  const c = (req.headers.cookie || '').split(';').map((x) => x.trim()).find((x) => x.startsWith(nombre + '='));
  return c ? decodeURIComponent(c.slice(nombre.length + 1)) : '';
}

/** Datos del navegador para guardar con el lead y reutilizar en eventos posteriores (p. ej. el webhook). */
function datosNavegador(req, b = {}) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  const fbp = leerCookie(req, '_fbp') || String(b.fbp || '').slice(0, 200);
  let fbc = leerCookie(req, '_fbc') || String(b.fbc || '').slice(0, 300);
  const consentimiento = b.cm === 1 || b.cm === true || !!fbp;
  return { consentimiento, fbp, fbc, ip: ip.slice(0, 64), ua: String(req.headers['user-agent'] || '').slice(0, 400), url: String(req.headers.referer || '').slice(0, 500) };
}

/** Une los datos guardados con los nuevos sin perder lo que ya teníamos. */
function unir(antes = {}, ahora = {}) {
  const r = { ...(antes || {}) };
  for (const [k, v] of Object.entries(ahora || {})) if (v || v === true) r[k] = v;
  r.consentimiento = !!((antes || {}).consentimiento || (ahora || {}).consentimiento);
  return r;
}

/**
 * Envía un evento. nav = datosNavegador() o lo guardado en el lead.
 * No lanza nunca: un fallo de Meta no puede romper el pago.
 */
async function evento(nombre, { id, email, sid, nav = {}, valor, extra = {}, url } = {}) {
  if (!configurado() || !nav.consentimiento) return false;
  const user_data = { em: email ? [h(email)] : undefined, external_id: sid ? [h(sid)] : undefined, country: [h('es')],
    client_ip_address: nav.ip || undefined, client_user_agent: nav.ua || undefined, fbp: nav.fbp || undefined, fbc: nav.fbc || undefined };
  const custom_data = { currency: valor != null ? 'EUR' : undefined, value: valor != null ? valor : undefined, ...extra };
  const cuerpo = { data: [{ event_name: nombre, event_time: Math.floor(Date.now() / 1000), event_id: id, action_source: 'website',
    event_source_url: url || nav.url || CFG.baseUrl, user_data, custom_data }] };
  if (CODIGO_PRUEBA) cuerpo.test_event_code = CODIGO_PRUEBA;
  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${CFG.pixelId}/events?access_token=${encodeURIComponent(TOKEN)}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cuerpo), signal: AbortSignal.timeout(8000) });
    if (!r.ok) { console.error('meta capi', nombre, r.status, (await r.text()).slice(0, 300)); return false; }
    return true;
  } catch (e) { console.error('meta capi', nombre, e.message); return false; }
}

module.exports = { evento, datosNavegador, unir, configurado };
