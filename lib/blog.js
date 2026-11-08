/*
 * Blog renderizado en el servidor (HTML completo, sin depender de JavaScript): índice, artículos,
 * índice JSON (para "Mi zona"), sitemap.xml y robots.txt.
 */
'use strict';
const { CFG } = require('./config');
const POSTS = require('../content/blog.js');
const D = require('../public/perros.js');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const porSlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
const FECHA = (f) => { const m = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']; const d = new Date(f + 'T12:00:00Z'); return `${d.getUTCDate()} de ${m[d.getUTCMonth()]} de ${d.getUTCFullYear()}`; };
const ICONO_TEMA = { pis: ['gota', 'sky'], mordiscos: ['diente', 'peach'], noches: ['luna', 'lilac'], solo: ['puerta', 'butter'], correa: ['correa', 'mint'], ladridos: ['chispa', 'butter'], adaptacion: ['casa', 'sky'], rutina: ['reloj', 'mint'], legal: ['ley', 'lilac'] };

// Markdown sencillo → HTML
function inline(t) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>');
}
function md(texto) {
  const bloques = texto.trim().split(/\n\s*\n/);
  return bloques.map((b) => {
    const lineas = b.split('\n');
    if (b.startsWith('## ')) return `<h2>${inline(b.slice(3))}</h2>`;
    if (lineas.every((l) => /^- /.test(l))) return `<ul>${lineas.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (lineas.every((l) => /^\d+\. /.test(l))) return `<ol>${lineas.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    if (/^\*\*.+\*\*$/.test(lineas[0]) && lineas.slice(1).every((l) => /^- /.test(l))) return `<h3>${inline(lineas[0].replace(/\*\*/g, ''))}</h3><ul>${lineas.slice(1).map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(lineas.join(' '))}</p>`;
  }).join('\n');
}

function burbuja(tema) { const [ic, c] = ICONO_TEMA[tema] || ['estrella', 'sky']; return `<span class="burbuja b-${c}">${D.icono(ic)}</span>`; }

function marco({ titulo, descripcion, canonico, cuerpo, jsonld, og }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${canonico}">
<meta property="og:type" content="${og || 'website'}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${canonico}">
<meta property="og:site_name" content="${esc(CFG.marca)}">
<meta property="og:locale" content="es_ES">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
${(jsonld || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<header class="barra"><div class="barra-in"><a class="marca" href="/" style="text-decoration:none;color:inherit">${D.logo()}${D.nombreMarca(CFG.marca)}</a><a class="btn" href="/" style="width:auto;min-height:40px;padding:8px 14px;margin-left:auto;font-size:.9rem">Test gratis</a></div></header>
<main>${cuerpo}</main>
<footer class="pie"><a href="/blog">Blog</a> · <a href="/mi-zona">Mi zona</a> · <a href="/privacidad">Privacidad</a> · <a href="/condiciones">Condiciones</a></footer>
</body>
</html>`;
}

function indice() {
  const canonico = `${CFG.baseUrl}/blog`;
  const tarjetas = POSTS.map((p) => `<a class="post-tarjeta" href="/blog/${p.slug}">${burbuja(p.tema)}<span class="pila" style="gap:4px;min-width:0"><b>${esc(p.titulo)}</b><span class="suave peq">${esc(p.descripcion)}</span><span class="peq suave">${p.lectura} min de lectura</span></span></a>`).join('');
  return marco({
    titulo: `Blog de educación canina en positivo · ${CFG.marca}`,
    descripcion: 'Guías prácticas para educar a tu perro en positivo: cachorros, perros adoptados, correa, ladridos, quedarse solo y más.',
    canonico,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `Blog de ${CFG.marca}`, url: canonico, inLanguage: 'es-ES' }],
    cuerpo: `<div class="pila-g"><section class="pila"><span class="eyebrow">${D.icono('huella')}Educación en positivo</span><h1>Guías para educar a tu perro</h1><p class="suave">Consejos prácticos, sin castigos, para cachorros y perros adultos.</p></section><section class="posts">${tarjetas}</section></div>`
  });
}

function articulo(slug) {
  const p = porSlug[slug];
  if (!p) return null;
  const canonico = `${CFG.baseUrl}/blog/${p.slug}`;
  const relacionados = POSTS.filter((x) => x.slug !== p.slug).sort((a, b) => (b.tema === p.tema) - (a.tema === p.tema)).slice(0, 3);
  const cuerpoHtml = md(p.cuerpo);
  // CTA a mitad del artículo (tras el segundo subtítulo) y al final
  const cta = (extra) => `<aside class="cta-post${extra ? ' ' + extra : ''}">${burbuja(p.tema)}<div class="pila" style="gap:8px"><b>${esc(p.cta.texto)}</b><span class="suave peq">Gratis, en 2 minutos y adaptado a su raza y su edad.</span><a class="btn" href="${esc(p.cta.href)}" style="align-self:flex-start;width:auto">Empezar el test</a></div></aside>`;
  const partes = cuerpoHtml.split('<h2>');
  const conCta = partes.length > 3 ? partes.slice(0, 3).join('<h2>') + cta('medio') + '<h2>' + partes.slice(3).join('<h2>') : cuerpoHtml;
  const faq = p.faq?.length ? `<section class="faq pila"><h2>Preguntas frecuentes</h2>${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>` : '';
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: p.titulo, description: p.descripcion, inLanguage: 'es-ES',
    datePublished: p.fecha, dateModified: p.fecha, mainEntityOfPage: canonico,
    author: { '@type': 'Organization', name: CFG.marca }, publisher: { '@type': 'Organization', name: CFG.marca, logo: { '@type': 'ImageObject', url: `${CFG.baseUrl}/apple-touch-icon.png` } }
  }];
  if (p.faq?.length) jsonld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  jsonld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Blog', item: `${CFG.baseUrl}/blog` }, { '@type': 'ListItem', position: 2, name: p.titulo, item: canonico }] });
  return marco({
    titulo: `${p.titulo} · ${CFG.marca}`, descripcion: p.descripcion, canonico, og: 'article', jsonld,
    cuerpo: `<article class="post pila-g">
<nav class="peq suave" aria-label="Migas de pan"><a href="/blog">Blog</a> › ${esc(p.titulo)}</nav>
<header class="pila"><h1>${esc(p.titulo)}</h1><p class="suave peq">${FECHA(p.fecha)} · ${p.lectura} min de lectura</p></header>
<div class="post-cuerpo">${conCta}</div>
${cta('final')}
${faq}
<p class="peq suave">Este artículo ofrece información general de educación en positivo. No sustituye a tu veterinario ni a un profesional que vea a tu perro en persona.</p>
<section class="pila"><h2 style="font-size:1.25rem">Sigue leyendo</h2>${relacionados.map((r) => `<a class="post-tarjeta" href="/blog/${r.slug}">${burbuja(r.tema)}<span><b>${esc(r.titulo)}</b></span></a>`).join('')}</section>
</article>`
  });
}

const indiceJson = () => POSTS.map(({ slug, titulo, tema }) => ({ slug, titulo, tema }));

function sitemap() {
  const urls = ['/', '/cachorro', '/perro', '/blog', ...POSTS.map((p) => '/blog/' + p.slug)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${CFG.baseUrl}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
}
const robots = () => `User-agent: *\nDisallow: /plan/\nDisallow: /mi-zona\nDisallow: /admin.html\nDisallow: /api/\nSitemap: ${CFG.baseUrl}/sitemap.xml\n`;

module.exports = { indice, articulo, indiceJson, sitemap, robots, md };
