/*
 * Acceso a "Mi zona" sin contraseña:
 *  - enlace mágico por email (válido 7 días) o el enlace privado de su plan,
 *  - después, una cookie firmada (HttpOnly) de 90 días.
 * Firma HMAC con APP_SECRET. No hay contraseñas ni datos sensibles en la cookie: solo el email.
 */
'use strict';
const crypto = require('crypto');
const { CFG } = require('./config');

const COOKIE = 'qbp_sesion';
const b64 = (s) => Buffer.from(s).toString('base64url');
const unb64 = (s) => Buffer.from(String(s), 'base64url').toString();
const firmar = (datos) => crypto.createHmac('sha256', CFG.secreto).update(datos).digest('base64url');

function crear(email, dias) {
  const datos = `${String(email).toLowerCase()}|${Date.now() + dias * 864e5}`;
  return b64(datos) + '.' + firmar(datos);
}
function leer(token) {
  const [d, f] = String(token || '').split('.');
  if (!d || !f) return null;
  const datos = unb64(d);
  const esperada = firmar(datos);
  if (f.length !== esperada.length || !crypto.timingSafeEqual(Buffer.from(f), Buffer.from(esperada))) return null;
  const [email, exp] = datos.split('|');
  return Number(exp) > Date.now() ? email : null;
}
function deCookie(req) {
  const c = (req.headers.cookie || '').split(';').map((x) => x.trim()).find((x) => x.startsWith(COOKIE + '='));
  return c ? leer(c.slice(COOKIE.length + 1)) : null;
}
function cabeceraCookie(email) {
  const seguro = CFG.baseUrl.startsWith('https') ? '; Secure' : '';
  return `${COOKIE}=${crear(email, 90)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${90 * 86400}${seguro}`;
}
const cerrar = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

// ---------- Panel de administración: solo los emails de ADMIN_EMAILS ----------
const COOKIE_ADMIN = 'qbp_admin';
const esAdmin = (email) => !!email && CFG.adminEmails.includes(String(email).toLowerCase());
function adminDeCookie(req) {
  const c = (req.headers.cookie || '').split(';').map((x) => x.trim()).find((x) => x.startsWith(COOKIE_ADMIN + '='));
  const v = c ? leer(c.slice(COOKIE_ADMIN.length + 1)) : null;
  if (!v || !v.startsWith('admin:')) return null;
  const email = v.slice(6);
  return esAdmin(email) ? email : null;
}
const enlaceAdmin = (email) => `${CFG.baseUrl}/admin/entrar?t=${crear('admin:' + email, 1 / 24)}`; // 1 hora
function leerEnlaceAdmin(t) { const v = leer(t); return v && v.startsWith('admin:') && esAdmin(v.slice(6)) ? v.slice(6) : null; }
function cookieAdmin(email) {
  const seguro = CFG.baseUrl.startsWith('https') ? '; Secure' : '';
  return `${COOKIE_ADMIN}=${crear('admin:' + email, 30)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 86400}${seguro}`;
}
const cerrarAdmin = () => `${COOKIE_ADMIN}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;

module.exports = { esAdmin, adminDeCookie, enlaceAdmin, leerEnlaceAdmin, cookieAdmin, cerrarAdmin, enlaceMagico: (email) => `${CFG.baseUrl}/mi-zona/entrar?t=${crear(email, 7)}`, leer, deCookie, cabeceraCookie, cerrar };
