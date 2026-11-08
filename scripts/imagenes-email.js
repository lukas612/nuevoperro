#!/usr/bin/env node
/*
 * Genera las imágenes de los emails (public/email/*.png) a partir de la web real con datos de ejemplo.
 * Se ejecuta en local, sin Supabase: arranca el servidor con datos de prueba en una carpeta temporal.
 *
 *   node scripts/imagenes-email.js
 */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'public', 'email');
const PUERTO = 3998, BASE = `http://localhost:${PUERTO}`;
const EMAIL = 'ejemplo@quebuenperro.com';

(async () => {
  // Datos de ejemplo en una copia aislada del proyecto (no toca data/ ni Supabase).
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qbp-img-'));
  for (const f of ['server.js', 'package.json']) fs.copyFileSync(path.join(RAIZ, f), path.join(tmp, f));
  for (const d of ['lib', 'content', 'public', 'scripts']) fs.cpSync(path.join(RAIZ, d), path.join(tmp, d), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'data'));
  const env = { ...process.env, PORT: String(PUERTO), BASE_URL: BASE, SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: '', RESEND_API_KEY: '', APP_SECRET: 'imagenes' };
  const ahora = Date.now();
  const leads = [
    { sid: 'img_c', email: EMAIL, ts: new Date(ahora - 9 * 864e5).toISOString(), respuestas: { nombre: 'Luna', raza: 'Labrador', razaId: 'labrador', tamano: 'grande', edadSemanas: 10, vivienda: 'piso', horasSolo: 3, problema: 'pis', convivientes: [], comunidad: 'Madrid', tiene: ['chip'] } },
    { sid: 'img_p', email: 'otro@quebuenperro.com', ts: new Date(ahora - 5 * 864e5).toISOString(), respuestas: { tipo: 'adulto', nombre: 'Thor', raza: 'Husky', razaId: 'husky', edadPerro: 'adulto', problema: 'correa', detalle: 'otros', vivienda: 'piso' } }
  ];
  fs.writeFileSync(path.join(tmp, 'data', 'leads.jsonl'), leads.map((l) => JSON.stringify(l)).join('\n') + '\n');
  const diario = [];
  for (let d = 0; d < 7; d++) for (let k = 0; k < 5; k++) diario.push({ id: d * 10 + k, email: EMAIL, ts: new Date(ahora - d * 864e5 - k * 3 * 36e5).toISOString(), tipo: k % 2 ? 'caca' : 'pis', lugar: (k + d) % (d > 3 ? 3 : 6) === 0 ? 'casa' : 'fuera' });
  fs.writeFileSync(path.join(tmp, 'data', 'diario.jsonl'), diario.map((l) => JSON.stringify(l)).join('\n') + '\n');

  const srv = spawn(process.execPath, ['server.js'], { cwd: tmp, env, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1200));
  try {
    // Planes: se generan con la entrega real y se marcan como empezados hace unos días.
    const tokens = await new Promise((res, rej) => {
      const c = spawn(process.execPath, ['-e', `const e=require('./lib/entrega');Promise.all([e.entregarPlan('img_c'),e.entregarPlan('img_p')]).then(t=>{console.log(JSON.stringify(t))})`], { cwd: tmp, env });
      let o = ''; c.stdout.on('data', (d) => (o += d)); c.on('close', () => { try { res(JSON.parse(o.trim().split('\n').pop())); } catch (e) { rej(new Error(o)); } });
    });
    process.env.APP_SECRET = 'imagenes'; process.env.BASE_URL = BASE;
    const sesion = require(path.join(tmp, 'lib', 'sesion.js'));
    const b = await chromium.launch();
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 2, colorScheme: 'light' });
    const cookie = sesion.cabeceraCookie(EMAIL).split(';')[0];
    await ctx.addCookies([{ name: 'qbp_sesion', value: cookie.slice(cookie.indexOf('=') + 1), url: BASE }]);
    const p = await ctx.newPage();
    const foto = async (nombre, opts) => { await p.screenshot({ path: path.join(SALIDA, nombre), ...opts }); console.log('ok', nombre); };

    // Progreso de ejemplo en los planes (se guarda en el navegador).
    for (const t of tokens) {
      await p.goto(`${BASE}/plan/${t}`, { waitUntil: 'networkidle' });
      await p.evaluate((id) => { const k = Object.keys(localStorage).find((x) => x.includes(id)) || ('plan_' + id); const st = {}; for (let i = 1; i <= 8; i++) st['d' + i] = true; localStorage.setItem(k, JSON.stringify(st)); }, t);
    }
    await p.goto(`${BASE}/plan/${tokens[0]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
    await foto('plan-cachorro.png', { clip: { x: 0, y: 0, width: 400, height: 560 } });
    await p.goto(`${BASE}/plan/${tokens[1]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
    await foto('plan-perro.png', { clip: { x: 0, y: 0, width: 400, height: 560 } });

    await p.goto(`${BASE}/mi-zona`, { waitUntil: 'load' }); await p.waitForSelector('#diario .diario-resumen, #diario button', { timeout: 15000 }); await p.waitForTimeout(800);
    await foto('mi-zona.png', { clip: { x: 0, y: 0, width: 400, height: 560 } });
    const caja = async (sel, nombre, alto) => {
      const el = p.locator(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
      const bb = await el.boundingBox();
      await p.screenshot({ path: path.join(SALIDA, nombre), clip: { x: bb.x, y: bb.y, width: bb.width, height: Math.min(bb.height, alto || bb.height) } });
      console.log('ok', nombre);
    };
    await caja('#diario', 'diario.png', 415);
    await caja('#clicker-caja', 'clicker.png');
    await b.close();
    // JPG para que los emails pesen poco
    const { execFileSync } = require('child_process');
    try { execFileSync('python3', ['-c', `import glob,os\nfrom PIL import Image\nfor f in glob.glob('${SALIDA}/*.png'):\n  Image.open(f).convert('RGB').save(f[:-4]+'.jpg', quality=84, optimize=True); os.remove(f)`]); console.log('convertidas a JPG'); } catch (e) { console.warn('Sin PIL: se quedan en PNG'); }
  } finally {
    srv.kill();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
})().catch((e) => { console.error(e); process.exit(1); });
