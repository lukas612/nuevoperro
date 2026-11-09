/* Carga .env (si existe) y expone la configuración. Requerir antes que cualquier otro módulo de lib/. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const f = path.join(__dirname, '..', '.env');
if (fs.existsSync(f)) {
  for (const linea of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const CFG = {
  puerto: Number(process.env.PORT || 3000),
  // En Render, RENDER_EXTERNAL_URL llega sola (https://<servicio>.onrender.com): no hace falta configurar BASE_URL
  // hasta que haya dominio propio.
  baseUrl: (process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000').replace(/\/$/, ''),
  marca: process.env.MARCA || 'Qué Buen Perro',
  emailContacto: process.env.EMAIL_CONTACTO || 'hola@example.com',
  titular: process.env.TITULAR || 'WITME ADVERTISING S.L., NIF B44680262, Av. Pablo Iglesias 17, 28003 Madrid (España)',
  stripeKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  // Clave publicable (pk_live_… / pk_test_…): con ella el pago se hace dentro de la web (Embedded Checkout).
  stripePk: process.env.STRIPE_PUBLISHABLE_KEY || '',
  pixelId: process.env.META_PIXEL_ID || '',
  // Céntimos. Un valor = precio fijo (fase 1a). Varios = test de precio (fase 1b), reparto estable por visitante.
  precios: (process.env.PRECIOS || '999,1999').split(',').map((x) => Number(x.trim())).filter(Boolean),
  precioUpsell: Number(process.env.PRECIO_UPSELL || 999),
  // Precio de otro programa para quien ya es cliente (catálogo de Mi zona). Céntimos.
  precioCliente: Number(process.env.PRECIO_CLIENTE || 499),
  // Emails con acceso al panel /admin (entran con un enlace por email). Separados por comas.
  adminEmails: (process.env.ADMIN_EMAILS || 'lukas@witme.es').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean),
  // Firma los enlaces de baja de los emails. Obligatorio en producción.
  secreto: process.env.APP_SECRET || 'solo-para-desarrollo'
};

function precioPara(sid) {
  const h = crypto.createHash('sha256').update(String(sid || '')).digest();
  return CFG.precios[h[0] % CFG.precios.length];
}
// Test «3 días gratis»: PRUEBA_GRATIS = ab (mitad y mitad, por defecto) | todos | no
const DIAS_PRUEBA = Number(process.env.DIAS_PRUEBA || 3);
function varianteDe(sid) {
  const modo = (process.env.PRUEBA_GRATIS || 'ab').toLowerCase();
  if (modo === 'no') return 'previa';
  if (modo === 'todos') return 'prueba';
  const h = crypto.createHash('sha256').update('variante:' + String(sid || '')).digest();
  return h[1] % 2 ? 'prueba' : 'previa';
}
function firmaBaja(email) {
  return crypto.createHmac('sha256', CFG.secreto).update('baja:' + String(email).toLowerCase()).digest('hex').slice(0, 32);
}
// Enlace de los emails que devuelve a la persona a su resultado y al pago, sin repetir el test.
function firmaRetomar(sid) {
  return crypto.createHmac('sha256', CFG.secreto).update('retomar:' + String(sid)).digest('hex').slice(0, 24);
}
function urlRetomar(lead, campana) {
  const adulto = ['adulto', 'adoptado'].includes(lead.respuestas?.tipo);
  return `${CFG.baseUrl}/${adulto ? 'perro' : 'cachorro'}?r=${encodeURIComponent(lead.sid)}.${firmaRetomar(lead.sid)}&utm_source=email&utm_medium=nurture&utm_campaign=${encodeURIComponent(campana)}#paywall`;
}
function urlBaja(email) {
  return `${CFG.baseUrl}/baja?e=${encodeURIComponent(email)}&t=${firmaBaja(email)}`;
}

module.exports = { CFG, DIAS_PRUEBA, varianteDe, precioPara, firmaBaja, urlBaja, firmaRetomar, urlRetomar };
