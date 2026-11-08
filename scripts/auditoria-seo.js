#!/usr/bin/env node
/*
 * Auditoría SEO: recorre el sitemap y comprueba cada página.
 *
 *   node scripts/auditoria-seo.js https://nuevoperro.onrender.com
 *   node scripts/auditoria-seo.js http://localhost:3000
 *
 * Comprueba: código 200, <title> (30–65 caracteres), meta description (70–160), un único <h1>,
 * canonical igual a la URL, robots indexable, og:title/og:description/og:image, JSON-LD válido,
 * títulos y descripciones duplicados, y enlaces internos rotos.
 */
'use strict';
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (h, attr, nombre) => { const m = h.match(new RegExp(`<meta[^>]+${attr}="${nombre}"[^>]+content="([^"]*)"`, 'i')); return m ? decode(m[1]) : null; };

(async () => {
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // El sitemap usa BASE_URL; si auditamos otro host, cambiamos el origen
  const origenSitemap = new URL(urls[0]).origin;
  const paginas = urls.map((u) => base + u.slice(origenSitemap.length));
  const problemas = [], titulos = {}, descripciones = {}, enlaces = new Set();

  for (const u of paginas) {
    const r = await fetch(u, { redirect: 'manual' });
    const h = await r.text();
    const ruta = u.slice(base.length) || '/';
    const mal = (m) => problemas.push(`${ruta}: ${m}`);
    if (r.status !== 200) { mal(`código ${r.status}`); continue; }
    const titulo = (h.match(/<title>([^<]*)<\/title>/i) || [])[1];
    const desc = meta(h, 'name', 'description');
    const h1s = (h.match(/<h1[\s>]/gi) || []).length;
    const canon = (h.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1];
    const robots = meta(h, 'name', 'robots') || '';
    if (!titulo) mal('sin <title>'); else { const t = decode(titulo); if (t.length < 30 || t.length > 65) mal(`título de ${t.length} caracteres: "${t}"`); (titulos[t] = titulos[t] || []).push(ruta); }
    if (!desc) mal('sin meta description'); else { if (desc.length < 70 || desc.length > 160) mal(`descripción de ${desc.length} caracteres`); (descripciones[desc] = descripciones[desc] || []).push(ruta); }
    if (h1s !== 1) mal(`${h1s} etiquetas <h1>`);
    if (!canon) mal('sin canonical'); else if (new URL(canon).pathname !== new URL(u).pathname) mal(`canonical apunta a ${canon}`);
    if (/noindex/.test(robots)) mal('marcada como noindex pero está en el sitemap');
    for (const p of ['og:title', 'og:description', 'og:image']) if (!meta(h, 'property', p)) mal(`sin ${p}`);
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { mal('JSON-LD inválido'); } }
    if (!/<html lang="es"/.test(h)) mal('sin lang="es"');
    for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) enlaces.add(m[1]);
  }
  for (const [t, rs] of Object.entries(titulos)) if (rs.length > 1) problemas.push(`Título duplicado en ${rs.join(', ')}: "${t}"`);
  for (const [d, rs] of Object.entries(descripciones)) if (rs.length > 1) problemas.push(`Descripción duplicada en ${rs.join(', ')}`);

  let rotos = 0;
  for (const e of enlaces) {
    if (/\.(css|js|svg|png|ico)$/.test(e) || e.startsWith('/api/')) continue;
    const r = await fetch(base + e, { redirect: 'manual' });
    if (r.status >= 400) { problemas.push(`Enlace interno roto: ${e} (${r.status})`); rotos++; }
  }

  console.log(`Páginas auditadas: ${paginas.length} · enlaces internos comprobados: ${enlaces.size}`);
  if (!problemas.length) console.log('Sin problemas.');
  else { console.log(`${problemas.length} avisos:`); problemas.forEach((p) => console.log(' - ' + p)); }
  process.exit(problemas.length ? 1 : 0);
})().catch((e) => { console.error(e.message); process.exit(2); });
