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
  pixelId: process.env.META_PIXEL_ID || '',
  // Céntimos. Un valor = precio fijo (fase 1a). Varios = test de precio (fase 1b), reparto estable por visitante.
  precios: (process.env.PRECIOS || '1999').split(',').map((x) => Number(x.trim())).filter(Boolean),
  precioUpsell: Number(process.env.PRECIO_UPSELL || 999),
  // Emails con acceso al panel /admin (entran con un enlace por email). Separados por comas.
  adminEmails: (process.env.ADMIN_EMAILS || 'lukas@witme.es').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean),
  // Firma los enlaces de baja de los emails. Obligatorio en producción.
  secreto: process.env.APP_SECRET || 'solo-para-desarrollo'
};

function precioPara(sid) {
  const h = crypto.createHash('sha256').update(String(sid || '')).digest();
  return CFG.precios[h[0] % CFG.precios.length];
}
function firmaBaja(email) {
  return crypto.createHmac('sha256', CFG.secreto).update('baja:' + String(email).toLowerCase()).digest('hex').slice(0, 32);
}
function urlBaja(email) {
  return `${CFG.baseUrl}/baja?e=${encodeURIComponent(email)}&t=${firmaBaja(email)}`;
}

module.exports = { CFG, precioPara, firmaBaja, urlBaja };
