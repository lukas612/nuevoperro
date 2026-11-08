/*
 * SEO común: <head> completo (título, descripción, canonical, robots, Open Graph, Twitter,
 * datos estructurados) y el marco de página (cabecera con logo, pie con enlaces internos).
 * Todas las páginas indexables se generan en el servidor con esto.
 */
'use strict';
const { CFG } = require('./config');
const D = require('../public/perros.js');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = (ruta) => CFG.baseUrl + ruta;
const IMAGEN_OG = '/og.png';

// Datos de la organización y del sitio (portada)
function organizacion() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', name: CFG.marca, url: url('/'),
    logo: url('/apple-touch-icon.png'), email: CFG.emailContacto
  };
}
function sitioWeb() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: CFG.marca, url: url('/'), inLanguage: 'es-ES' };
}
function migas(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([nombre, ruta], i) => ({ '@type': 'ListItem', position: i + 1, name: nombre, item: url(ruta) })) };
}

function cabeza({ titulo, descripcion, ruta, ogTipo = 'website', noindex = false, jsonld = [], extra = '' }) {
  const canonico = url(ruta);
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<link rel="canonical" href="${canonico}">
<meta property="og:type" content="${ogTipo}">
<meta property="og:site_name" content="${esc(CFG.marca)}">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${canonico}">
<meta property="og:image" content="${url(IMAGEN_OG)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(CFG.marca)}: educación en positivo para tu perro">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f5f7fb">
${process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}">\n` : ''}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/styles.css">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}${extra}`;
}

const MENU = [['/cachorro', 'Plan para cachorros'], ['/perro', 'Plan para perro adulto o adoptado'], ['/guias', 'Guías'], ['/razas', 'Razas'], ['/mi-zona', 'Mi zona']];
function menu() {
  return `<details class="menu"><summary aria-label="Abrir menú"><svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menú</span></summary><nav class="menu-panel" aria-label="Menú principal">${MENU.map(([r, n]) => `<a href="${r}">${esc(n)}</a>`).join('')}</nav></details>`;
}
function cabecera() {
  return `<header class="barra"><div class="barra-in"><a class="marca" href="/" style="text-decoration:none;color:inherit" aria-label="${esc(CFG.marca)}: inicio">${D.logo()}${D.nombreMarca(CFG.marca)}</a>${menu()}<a class="btn" href="/#empezar" style="width:auto;min-height:40px;padding:8px 14px;font-size:.9rem;white-space:nowrap">Test gratis</a></div></header>`;
}
function pie() {
  return `<footer class="pie"><nav aria-label="Enlaces del sitio"><a href="/guias">Guías</a> · <a href="/razas">Razas</a> · <a href="/guias/cachorros">Cachorros</a> · <a href="/guias/perro-adulto">Perro adulto</a> · <a href="/mi-zona">Mi zona</a> · <a href="/privacidad">Privacidad</a> · <a href="/condiciones">Condiciones</a></nav><p style="margin-top:8px">© ${new Date().getFullYear()} ${esc(CFG.marca)} · Educación en positivo para tu perro</p></footer>`;
}

// Página completa. "migasHtml": [[nombre, ruta], ...] visibles arriba (la última, la actual).
function pagina(opts) {
  const migasHtml = opts.migas ? `<nav class="migas peq suave" aria-label="Migas de pan">${opts.migas.map(([n, r], i) => (i < opts.migas.length - 1 ? `<a href="${r}">${esc(n)}</a> › ` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>` : '';
  const jsonld = [...(opts.jsonld || [])];
  if (opts.migas) jsonld.push(migas(opts.migas));
  return `<!doctype html>
<html lang="es">
<head>
${cabeza({ ...opts, jsonld })}
</head>
<body>
${opts.sinCabecera ? '' : cabecera()}
<main>${migasHtml}${opts.cuerpo}</main>
${pie()}
${opts.scripts || ''}
</body>
</html>`;
}

// Añade la marca al título solo si cabe (Google corta hacia los 60 caracteres)
const conMarca = (t) => (`${t} · ${CFG.marca}`.length <= 60 ? `${t} · ${CFG.marca}` : t);

module.exports = { conMarca, esc, url, cabeza, cabecera, menu, MENU, pie, pagina, organizacion, sitioWeb, migas };
