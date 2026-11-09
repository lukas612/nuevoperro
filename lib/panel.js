/* Datos del panel de administración (/admin.html): KPIs, serie diaria, embudo, desgloses y últimos registros.
 * Todo se calcula en el servidor a partir de Supabase. Los pedidos de demo no cuentan. */
'use strict';
const datos = require('./datos');

const IVA = 0.21;
const TZ = 'Europe/Madrid';
const comisionStripe = (c) => c / 100 * 0.015 + 0.25; // tarjeta europea estándar (estimación)
const diaDe = (ts) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ts));
const div = (a, b) => (b ? a / b : null);
const anguloDe = (utm) => (utm && (utm.a || utm.utm_content)) || 'directo';
const fuenteDe = (utm) => (utm && (utm.utm_source || (utm.fbclid ? 'meta' : ''))) || 'directo';
const enRango = (ts, d, h) => { const t = new Date(ts).getTime(); return t >= d && t < h; };

function calcularPeriodo(base, desde, hasta, gasto) {
  const { eventos, leads, pedidos, reembolsos } = base;
  const ev = eventos.filter((e) => enRango(e.ts, desde, hasta));
  const ld = leads.filter((l) => enRango(l.ts, desde, hasta));
  const pd = pedidos.filter((p) => enRango(p.ts, desde, hasta));
  const rb = reembolsos.filter((r) => enRango(r.ts, desde, hasta));
  const planes = pd.filter((p) => p.tipo === 'plan');
  const upsells = pd.filter((p) => p.tipo === 'upsell' || p.tipo === 'programa');
  const visitantes = new Set(ev.filter((e) => e.tipo === 'visita').map((e) => e.sid)).size;
  const bruto = pd.reduce((s, p) => s + p.importe, 0) / 100;
  const devuelto = rb.reduce((s, r) => s + (r.importe || 0), 0) / 100;
  const comisiones = pd.reduce((s, p) => s + comisionStripe(p.importe), 0);
  const netoSinIva = (bruto - devuelto) / (1 + IVA) - comisiones;
  const g = gasto != null ? gasto : null;
  return {
    visitantes, leads: ld.length, compras: planes.length, upsells: upsells.length,
    tasaLead: div(ld.length, visitantes), tasaCompra: div(planes.length, ld.length), tasaUpsell: div(upsells.length, planes.length),
    bruto, devuelto, reembolsos: rb.length, comisiones, iva: (bruto - devuelto) - (bruto - devuelto) / (1 + IVA), neto: netoSinIva,
    ticketMedio: div(bruto, planes.length),
    gasto: g, cac: g != null ? div(g, planes.length) : null, cpl: g != null ? div(g, ld.length) : null,
    roas: g ? bruto / g : null, beneficio: g != null ? netoSinIva - g : null
  };
}

/** Marca de tiempo de las 00:00 (hora de España) del día de t. */
function medianocheMadrid(t) {
  const d = new Date(t);
  const enMadrid = Date.parse(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const enUtc = Date.parse(d.toLocaleString('en-US', { timeZone: 'UTC' }));
  return Date.parse(diaDe(t) + 'T00:00:00Z') - (enMadrid - enUtc);
}

async function panel({ dias = 30, gasto = null } = {}) {
  const [eventosTodos, leadsTodos, pedidosTodos, reembolsosTodos, planesTodos, emails] = await Promise.all([
    datos.listar('eventos'), datos.listar('leads'), datos.listar('pedidos'), datos.listar('reembolsos'), datos.listar('planes'), datos.listar('emails')
  ]);
  const [pushes, salud] = await Promise.all([datos.listar('push').catch(() => []), datos.listar('salud').catch(() => [])]);
  // Pruebas internas fuera de las cifras: emails de PANEL_EXCLUIR (y los de admin) y todo lo de sus visitantes.
  const excluir = new Set((process.env.PANEL_EXCLUIR || 'lukas@witme.es,lukas@lukasochoa.com,lukas@roiroi.es,delivered@resend.dev').split(',').concat(require('./config').CFG.adminEmails).map((x) => x.trim().toLowerCase()).filter(Boolean));
  const sidsFuera = new Set([...leadsTodos, ...pedidosTodos, ...planesTodos].filter((x) => excluir.has(String(x.email || '').toLowerCase())).map((x) => x.sid).filter(Boolean));
  const fuera = (x) => sidsFuera.has(x.sid) || excluir.has(String(x.email || '').toLowerCase());
  const eventos = eventosTodos.filter((e) => !sidsFuera.has(e.sid));
  const leads = leadsTodos.filter((l) => !fuera(l));
  const pedidos = pedidosTodos.filter((p) => !p.demo && !fuera(p));
  const reembolsos = reembolsosTodos.filter((r) => !sidsFuera.has(r.sid) && !pedidosTodos.some((p) => p.payment_intent === r.payment_intent && fuera(p)));
  const base = { eventos, leads, pedidos, reembolsos };
  const ahora = Date.now();
  const todo = !dias || dias >= 3650;
  const primero = Math.min(ahora, ...[...leads, ...eventos].map((x) => new Date(x.ts).getTime()));
  // Días naturales en España: «Hoy» empieza a las 00:00; «7 días» son hoy y los 6 anteriores completos.
  const desde = todo ? primero : medianocheMadrid(ahora) - (dias - 1) * 864e5;
  const largo = todo ? ahora - desde : dias * 864e5;
  const actual = calcularPeriodo(base, desde, ahora + 1, gasto);
  const anterior = todo ? null : calcularPeriodo(base, desde - largo, desde, null);

  // Serie diaria
  const serie = [];
  const porDia = {};
  for (let t = desde; t <= ahora; t += 864e5) { const k = diaDe(t); if (!porDia[k]) { porDia[k] = { dia: k, visitantes: new Set(), leads: 0, compras: 0, ingresos: 0 }; serie.push(porDia[k]); } }
  for (const e of eventos) if (e.tipo === 'visita' && porDia[diaDe(e.ts)] && enRango(e.ts, desde, ahora + 1)) porDia[diaDe(e.ts)].visitantes.add(e.sid);
  for (const l of leads) if (porDia[diaDe(l.ts)] && enRango(l.ts, desde, ahora + 1)) porDia[diaDe(l.ts)].leads++;
  for (const p of pedidos) if (porDia[diaDe(p.ts)] && enRango(p.ts, desde, ahora + 1)) { const d = porDia[diaDe(p.ts)]; if (p.tipo === 'plan') d.compras++; d.ingresos += p.importe / 100; }
  serie.forEach((d) => { d.visitantes = d.visitantes.size; d.ingresos = Math.round(d.ingresos * 100) / 100; });

  // Embudo (personas únicas por paso)
  const ev = eventos.filter((e) => enRango(e.ts, desde, ahora + 1));
  const unicos = (tipo) => new Set(ev.filter((e) => e.tipo === tipo).map((e) => e.sid)).size;
  const sidsLead = new Set(leads.filter((l) => enRango(l.ts, desde, ahora + 1)).map((l) => l.sid));
  const embudo = [
    ['Visitan la landing', unicos('visita')], ['Empiezan el test', unicos('inicio_form')], ['Dejan su email (lead)', sidsLead.size],
    ['Ven su resultado', unicos('resultado_visto')], ['Pulsan pagar', unicos('checkout_inicio')], ['Compran', actual.compras], ['Añaden el pack', actual.upsells]
  ].map(([paso, n]) => ({ paso, n }));

  // Desgloses
  const leadPorSid = Object.fromEntries(leads.map((l) => [l.sid, l]));
  const desglose = (clave) => {
    const m = {};
    const fila = (k) => (m[k] = m[k] || { clave: k, visitantes: new Set(), leads: 0, compras: 0, ingresos: 0 });
    for (const e of ev) if (e.tipo === 'visita') fila(clave(e.utm, null)).visitantes.add(e.sid);
    for (const l of leads) if (enRango(l.ts, desde, ahora + 1)) fila(clave(l.utm, l)).leads++;
    for (const p of pedidos) if (enRango(p.ts, desde, ahora + 1)) { const l = leadPorSid[p.sid]; const f = fila(clave(p.utm || l?.utm, l)); if (p.tipo === 'plan') f.compras++; f.ingresos += p.importe / 100; }
    return Object.values(m).map((f) => ({ ...f, visitantes: f.visitantes.size, tasaLead: div(f.leads, f.visitantes.size), tasaCompra: div(f.compras, f.leads) })).sort((a, b) => b.leads - a.leads || b.visitantes - a.visitantes);
  };
  const porAngulo = desglose((utm) => anguloDe(utm));
  const porFuente = desglose((utm) => fuenteDe(utm));
  const porPrecio = desglose((utm, l) => (l && l.precio ? (l.precio / 100).toFixed(2).replace('.', ',') + ' €' : null)).filter((f) => f.clave !== 'null');
  const porVersion = desglose((utm, l) => (l ? ({ prueba: 'Prueba 3 días gratis', previa: 'Vista previa + pago' }[l.variante] || 'Antes del test') : null)).filter((f) => f.clave !== 'null');
  const porPerfil = desglose((utm, l) => (l ? `${l.respuestas?.tipo || 'cachorro'} · ${l.respuestas?.problema || '—'}` : null)).filter((f) => f.clave !== 'null');

  // Últimos registros
  const comprador = {};
  for (const p of pedidos) { const c = (comprador[p.sid] = comprador[p.sid] || { plan: 0, upsell: 0 }); c[p.tipo === 'plan' ? 'plan' : 'upsell'] += p.importe; }
  const ultimosLeads = [...leads].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 100).map((l) => ({
    ts: l.ts, email: l.email, nombre: l.respuestas?.nombre || '', raza: l.respuestas?.raza || '', tipo: l.respuestas?.tipo || 'cachorro', problema: l.respuestas?.problema || '',
    angulo: anguloDe(l.utm), fuente: fuenteDe(l.utm), comerciales: !!l.consentimientos?.comerciales, seguros: !!l.consentimientos?.seguros,
    compra: comprador[l.sid] ? (comprador[l.sid].plan + comprador[l.sid].upsell) / 100 : 0
  }));
  const reembolsadoPI = new Set(reembolsos.map((r) => r.payment_intent));
  const ultimosPedidos = [...pedidos].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 100).map((p) => ({
    ts: p.ts, email: p.email, tipo: p.tipo, pack: p.pack || '', importe: p.importe / 100, reembolsado: reembolsadoPI.has(p.payment_intent), angulo: anguloDe(p.utm || leadPorSid[p.sid]?.utm)
  }));

  // Emails y otros
  const emailsPeriodo = emails.filter((e) => enRango(e.ts, desde, ahora + 1));
  const grupo = (clave) => clave.replace(/_[0-9a-f]{16,}$/, '').replace(/^(diario|nurture|encuesta|pack)_.*/, '$1');
  const porTipoEmail = {};
  for (const e of emailsPeriodo) if (e.clave !== 'baja' && e.clave !== 'club') porTipoEmail[grupo(e.clave)] = (porTipoEmail[grupo(e.clave)] || 0) + 1;
  const notas = eventos.filter((e) => e.tipo === 'encuesta').map((e) => Number(String(e.paso).split(':')[1])).filter(Boolean);
  const ldPeriodo = leads.filter((l) => enRango(l.ts, desde, ahora + 1));

  return {
    generado: new Date().toISOString(), dias: todo ? null : dias, desde: new Date(desde).toISOString(),
    actual, anterior, serie, embudo, porAngulo, porFuente, porPerfil, porPrecio, porVersion, ultimosLeads, ultimosPedidos,
    otros: {
      planesEntregados: planesTodos.filter((p) => p.estado === 'enviado' && !p.pack).length,
      packsEntregados: planesTodos.filter((p) => p.estado === 'enviado' && p.pack).length,
      emails: porTipoEmail, emailsTotal: Object.values(porTipoEmail).reduce((s, x) => s + x, 0),
      bajas: emails.filter((e) => e.clave === 'baja').length,
      club: emails.filter((e) => e.clave === 'club').length,
      consentComerciales: div(ldPeriodo.filter((l) => l.consentimientos?.comerciales).length, ldPeriodo.length),
      consentSeguros: ldPeriodo.filter((l) => l.consentimientos?.seguros).length,
      clicSeguros: ev.filter((e) => e.tipo === 'clic_seguros').length,
      visitasHome: new Set(ev.filter((e) => e.tipo === 'visita_web' && e.paso === '/').map((e) => e.sid)).size,
      visitasHomeMeta: new Set(ev.filter((e) => e.tipo === 'visita_web' && e.paso === '/' && fuenteDe(e.utm) === 'meta').map((e) => e.sid)).size,
      visitasWeb: new Set(ev.filter((e) => e.tipo === 'visita_web').map((e) => e.sid)).size,
      encuesta: { respuestas: notas.length, media: notas.length ? notas.reduce((s, x) => s + x, 0) / notas.length : null },
      avisosPersonas: new Set(pushes.filter((x) => !excluir.has(String(x.email || '').toLowerCase())).map((x) => x.email)).size,
      avisosMoviles: pushes.filter((x) => !excluir.has(String(x.email || '').toLowerCase())).length,
      carnetsSalud: new Set(salud.map((x) => x.token)).size,
      clientesTotales: new Set(pedidos.filter((p) => p.tipo === 'plan').map((p) => p.email)).size,
      ingresosTotales: pedidos.reduce((s, p) => s + p.importe, 0) / 100
    }
  };
}

module.exports = { panel };
