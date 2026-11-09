/* «Hoja para la nevera»: una semana del plan en un A4, para imprimir o guardar en PDF desde el navegador.
 * /plan/<token>/nevera?semana=N (por defecto, la semana en curso). */
'use strict';
const { CFG } = require('./config');
const D = require('../public/perros.js');
const P = require('../content/plantillas.js');
const T = require('../content/tareas-diarias.js');
const { PROGRAMAS } = require('../content/programas-adulto.js');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const corto = (t, n) => (t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t);
const diaMadrid = (t) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date(t));

function render(plan, semanaPedida) {
  const r = plan.respuestas || {};
  const adulto = !!plan.pack || ['adulto', 'adoptado'].includes(r.tipo);
  const n = r.nombre || (adulto ? 'tu perro' : 'tu cachorro');
  const sus = (t) => String(t).replace(/\{n\}/g, n);
  const prog = adulto ? (PROGRAMAS[plan.pack || r.problema] || PROGRAMAS.correa) : null;
  const totalSem = adulto ? prog.semanas.length : 8;
  const dia = Math.round((Date.parse(diaMadrid(Date.now())) - Date.parse(diaMadrid(plan.enviado_at || plan.ts))) / 864e5) + 1;
  const semana = Math.min(totalSem, Math.max(1, Number(semanaPedida) || Math.ceil(Math.max(1, dia) / 7)));

  let titulo, foco, tareas, izq, der;
  if (adulto) {
    const s = prog.semanas[semana - 1];
    titulo = prog.titulo; foco = s.foco;
    tareas = s.tareas.map((t, k) => [(semana - 1) * 7 + k + 1, t[0], sus(t[1])]);
    izq = ['Las reglas', (prog.pasos || []).slice(0, 5).map(sus)];
    der = ['Evita', (prog.evita || []).slice(0, 4).map(sus)];
  } else {
    const edad = (Number(r.edadSemanas) || 10) + semana - 1;
    const soc = P.SOCIALIZACION[semana - 1] || P.SOCIALIZACION[P.SOCIALIZACION.length - 1];
    titulo = 'Plan de 8 semanas'; foco = soc.foco + ' · ' + edad + ' semanas de edad';
    tareas = T.slice((semana - 1) * 7, semana * 7).map((t) => [t.dia, t.titulo, sus(t.tarea)]);
    const rut = P.rutinaDiaria({ nombre: n, raza: r.raza, razaId: r.razaId, edadSemanas: edad, tamano: r.tamano || 'mediano', vivienda: r.vivienda, horasSolo: Number(r.horasSolo) || 0, problema: r.problema, convivientes: r.convivientes || [] });
    const prot = P.PROTOCOLOS[r.problema] || P.PROTOCOLOS.pis;
    const pasos = (r.problema === 'pis' ? (r.vivienda === 'jardin' ? prot.jardin : prot.piso) : prot.si) || [];
    izq = ['Su rutina de ' + n, rut.bloques.map((b) => `<b>${esc(b[0])}</b> ${esc(corto(sus(b[1]), 55))}`), true];
    der = [prot.titulo, pasos.slice(0, 5).map(sus), false, ['Socialización esta semana', soc.items]];
  }
  const lista = (items, html) => `<ul>${items.map((x) => `<li>${html ? x : esc(x)}</li>`).join('')}</ul>`;
  const opciones = Array.from({ length: totalSem }, (_, k) => `<option value="${k + 1}"${k + 1 === semana ? ' selected' : ''}>Semana ${k + 1}</option>`).join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(n)} · semana ${semana} · ${esc(CFG.marca)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Figtree:wght@400;600;700&display=swap">
<style>
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; } html, body { margin: 0; }
body { font: 13px/1.4 Figtree, system-ui, sans-serif; color: #1b2a41; background: #eef2f8; }
.barra { position: sticky; top: 0; display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap; padding: 12px 16px; background: #1b2a41; color: #fff; }
.barra select, .barra button, .barra a { font: 700 15px Figtree, sans-serif; border-radius: 12px; padding: 10px 14px; border: 0; }
.barra button { background: #ffc83d; color: #1b2a41; cursor: pointer; } .barra a { color: #fff; background: transparent; }
.hoja { width: 210mm; max-width: 100%; min-height: 297mm; margin: 16px auto; background: #fff; padding: 12mm; box-shadow: 0 8px 30px rgba(27,42,65,.15); }
.cab { display: flex; align-items: center; gap: 12px; border-bottom: 3px solid #ffc83d; padding-bottom: 8px; margin-bottom: 10px; }
.cab .cara { width: 58px; height: 58px; flex: none; } .cab .cara svg { width: 100%; height: 100%; }
.cab h1 { font: 800 26px/1 'Bricolage Grotesque', sans-serif; margin: 0; }
.cab p { margin: 3px 0 0; color: #5c6b80; } .cab .sem { margin-left: auto; text-align: right; font: 800 18px 'Bricolage Grotesque', sans-serif; }
.cab .sem small { display: block; font: 600 11px Figtree, sans-serif; color: #5c6b80; }
h2 { font: 800 15px 'Bricolage Grotesque', sans-serif; margin: 12px 0 6px; text-transform: uppercase; letter-spacing: .04em; color: #2546a8; }
table { width: 100%; border-collapse: collapse; }
td { border: 1.5px solid #dde3ec; padding: 7px 8px; vertical-align: top; }
td.caja { width: 34px; text-align: center; } td.caja span { display: inline-block; width: 18px; height: 18px; border: 2px solid #1b2a41; border-radius: 4px; }
td.dia { width: 56px; font-weight: 700; white-space: nowrap; } td b { display: block; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
ul { margin: 0; padding-left: 16px; } li { margin-bottom: 4px; }
.pie { margin-top: 12px; padding-top: 8px; border-top: 1px solid #dde3ec; display: flex; justify-content: space-between; color: #5c6b80; font-size: 11px; }
@media print { body { background: #fff; font-size: 11px; line-height: 1.32; } td { padding: 4px 6px; } li { margin-bottom: 1px; font-size: 10.5px; } h2 { margin: 8px 0 3px; font-size: 13px; } .cab .cara { width: 46px; height: 46px; } .cab h1 { font-size: 22px; } .barra { display: none; } .hoja { margin: 0; padding: 0; width: auto; min-height: 0; box-shadow: none; } }
@media (max-width: 800px) { .hoja { padding: 16px; min-height: 0; } .cols { grid-template-columns: 1fr; } }
</style></head><body>
<div class="barra"><select id="sem" aria-label="Semana">${opciones}</select><button onclick="print()">Imprimir o guardar en PDF</button><a href="/plan/${esc(plan.token)}">Volver al plan</a></div>
<main class="hoja">
  <div class="cab"><span class="cara">${D.cara(r.razaId || 'mestizo', { lengua: true })}</span><div><h1>${esc(n)}</h1><p>${esc(titulo)} · ${esc(foco)}</p></div>
    <div class="sem">Semana ${semana}<small>de ${totalSem}</small></div></div>
  <h2>Esta semana: una tarea al día</h2>
  <table>${tareas.map((t) => `<tr><td class="caja"><span></span></td><td class="dia">Día ${t[0]}</td><td><b>${esc(t[1])}</b>${esc(t[2])}</td></tr>`).join('')}</table>
  <div class="cols">
    <section><h2>${esc(izq[0])}</h2>${lista(izq[1], izq[2])}</section>
    <section><h2>${esc(der[0])}</h2>${lista(der[1], der[2])}${der[3] ? `<h2>${esc(der[3][0])}</h2>${lista(der[3][1])}` : ''}</section>
  </div>
  <div class="pie"><span>Marca cada casilla al terminar la tarea. Sin castigos: premia lo que hace bien.</span><span>${esc(CFG.baseUrl.replace(/^https?:\/\//, ''))}/mi-zona</span></div>
</main>
<script>document.getElementById('sem').onchange=function(){location.search='?semana='+this.value};</script>
</body></html>`;
}

module.exports = { render };
