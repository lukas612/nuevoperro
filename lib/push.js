/* Avisos en el móvil (Web Push) sin dependencias.
 * - Claves VAPID derivadas de APP_SECRET: estables entre reinicios y sin variables nuevas.
 * - Envío sin contenido cifrado: el aviso «despierta» al service worker, que pide a /api/avisos qué mostrar.
 *   Así no hace falta cifrar el mensaje y el texto siempre está al día.
 * Tabla pc_push: una fila por móvil (endpoint) con el email de quien lo activó. */
'use strict';
const crypto = require('crypto');
const { CFG } = require('./config');
const datos = require('./datos');

const b64u = (buf) => Buffer.from(buf).toString('base64url');

// Clave P-256 a partir del secreto de la app (si el resultado no fuera válido, se reintenta con otro sufijo)
function claves() {
  for (let i = 0; i < 10; i++) {
    try {
      const d = crypto.createHash('sha256').update('vapid:' + CFG.secreto + ':' + i).digest();
      const ecdh = crypto.createECDH('prime256v1');
      ecdh.setPrivateKey(d);
      const pub = ecdh.getPublicKey(); // 65 bytes, sin comprimir
      const privada = crypto.createPrivateKey({ key: { kty: 'EC', crv: 'P-256', d: b64u(d), x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33, 65)) }, format: 'jwk' });
      return { publica: b64u(pub), privada };
    } catch (e) { /* siguiente */ }
  }
  throw new Error('No se han podido generar las claves VAPID');
}
let CLAVES = null;
const vapid = () => (CLAVES = CLAVES || claves());

function jwt(audiencia) {
  const cab = b64u(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const cuerpo = b64u(JSON.stringify({ aud: audiencia, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:' + (CFG.emailContacto || 'hola@quebuenperro.com') }));
  const firma = crypto.sign('sha256', Buffer.from(cab + '.' + cuerpo), { key: vapid().privada, dsaEncoding: 'ieee-p1363' });
  return cab + '.' + cuerpo + '.' + b64u(firma);
}

// Avisos pendientes por email (en orden): el service worker recoge uno por cada push recibido
const pendientes = new Map();
function siguienteAviso(email) {
  const cola = pendientes.get(String(email || '').toLowerCase()) || [];
  while (cola.length && Date.now() - cola[0].ts > 24 * 3600e3) cola.shift(); // caducados
  return cola.shift() || null;
}

/** Envía un aviso a todos los móviles de un email. aviso = { titulo, texto, url }. Devuelve cuántos han salido. */
async function avisar(email, aviso) {
  email = String(email || '').toLowerCase();
  const subs = await datos.listar('push', { email });
  if (!subs.length) return 0;
  const cola = pendientes.get(email) || [];
  cola.push({ ...aviso, ts: Date.now() });
  pendientes.set(email, cola.slice(-10));
  let ok = 0;
  for (const s of subs) {
    try {
      const u = new URL(s.endpoint);
      const r = await fetch(s.endpoint, { method: 'POST', headers: { TTL: '86400', Urgency: 'normal', Authorization: `vapid t=${jwt(u.origin)}, k=${vapid().publica}`, 'Content-Length': '0' }, signal: AbortSignal.timeout(10000) });
      if (r.status === 404 || r.status === 410) await datos.borrar('push', { endpoint: s.endpoint }); // móvil dado de baja
      else if (r.ok) ok++;
      else console.warn('[push]', r.status, (await r.text()).slice(0, 200));
    } catch (e) { console.warn('[push]', e.message); }
  }
  return ok;
}

module.exports = { publica: () => vapid().publica, avisar, siguienteAviso };
