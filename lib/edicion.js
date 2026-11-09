/* Editar las respuestas de un plan ya comprado (desde Mi zona).
 * campos(plan) → qué se puede cambiar y con qué opciones. aplicar(plan, cambios) → respuestas nuevas
 * validadas y el plan vuelto a generar con la misma fecha de inicio (el progreso se conserva: va por día).
 * El problema de un programa de perro adulto no se puede cambiar (sería cambiar de programa). */
'use strict';
const { CFG } = require('./config');
const D = require('../public/perros.js');
const P = require('../content/plantillas.js');
const { PROGRAMAS } = require('../content/programas-adulto.js');

const esAdulto = (r) => ['adulto', 'adoptado'].includes(r?.tipo);
const TAMANO = [['pequeno', 'Pequeño (menos de 10 kg)'], ['mediano', 'Mediano (10 a 25 kg)'], ['grande', 'Grande (más de 25 kg)']];
const VIVIENDA = [['piso', 'Piso, sin jardín'], ['jardin', 'Casa con jardín o patio']];
const HORAS = [[0, 'Casi nunca está solo'], [2, '1–2 horas al día'], [4, '3–4 horas al día'], [6, '5–6 horas al día'], [8, '7 horas o más']];
const CONVIVIENTES = [['solo', 'Solo yo'], ['adultos', 'Otros adultos'], ['ninos', 'Niños'], ['perros', 'Otro perro'], ['gatos', 'Gatos']];

function campos(plan) {
  const r = plan.respuestas || {};
  const razas = D.RAZAS.map((x) => [x.id, x.nombre]).concat([['otra', 'Otra raza']]);
  if (esAdulto(r)) {
    const prog = PROGRAMAS[r.problema] || PROGRAMAS.correa;
    return [
      { id: 'nombre', t: 'Nombre', tipo: 'text' },
      { id: 'razaId', t: 'Raza', tipo: 'select', ops: razas },
      { id: 'tamano', t: 'Tamaño', tipo: 'select', ops: TAMANO },
      { id: 'edadPerro', t: 'Edad', tipo: 'select', ops: [['joven', '6–12 meses'], ['adulto', '1–3 años'], ['maduro', '3–7 años'], ['senior', 'Más de 7 años']] },
      { id: 'tipo', t: 'Tiempo contigo', tipo: 'select', ops: [['adoptado', 'Lo acabo de adoptar'], ['adulto', 'Ya lleva tiempo conmigo']] },
      { id: 'detalle', t: prog.titulo + ': cuándo le pasa más', tipo: 'select', ops: prog.detalles.map((d) => [d[0], d[1]]) },
      { id: 'vivienda', t: 'Dónde vivís', tipo: 'select', ops: VIVIENDA },
      { id: 'horasSolo', t: 'Horas que pasa solo', tipo: 'select', ops: HORAS },
      { id: 'convivientes', t: 'Quién más vive en casa', tipo: 'multi', ops: CONVIVIENTES }
    ];
  }
  return [
    { id: 'nombre', t: 'Nombre', tipo: 'text' },
    { id: 'razaId', t: 'Raza', tipo: 'select', ops: razas },
    { id: 'tamano', t: 'Tamaño de adulto', tipo: 'select', ops: TAMANO },
    { id: 'edadSemanas', t: 'Edad al empezar el plan', tipo: 'select', ops: [[8, '8–9 semanas'], [10, '10–11 semanas'], [12, '12–13 semanas'], [14, '14–15 semanas'], [17, '16–19 semanas'], [22, '20 semanas o más']] },
    { id: 'problema', t: 'Lo que más te preocupa', tipo: 'select', ops: [['pis', 'Pis y caca en casa'], ['mordiscos', 'Mordiscos'], ['noches', 'Las noches'], ['solo', 'Quedarse solo']] },
    { id: 'vivienda', t: 'Dónde vivís', tipo: 'select', ops: VIVIENDA },
    { id: 'horasSolo', t: 'Horas que pasa solo', tipo: 'select', ops: HORAS },
    { id: 'convivientes', t: 'Quién más vive en casa', tipo: 'multi', ops: CONVIVIENTES },
    { id: 'primerPerro', t: '¿Es tu primer perro?', tipo: 'select', ops: [['si', 'Sí, es el primero'], ['no', 'Ya he tenido perro']] },
    { id: 'comunidad', t: 'Comunidad autónoma', tipo: 'select', ops: P.COMUNIDADES.map((c) => [c, c]) },
    { id: 'tiene', t: 'Lo que ya tiene', tipo: 'multi', ops: [['chip', 'Microchip'], ['registro', 'Inscripción en el registro'], ['vacunas', 'Primeras vacunas'], ['veterinario', 'Primera visita al veterinario'], ['seguro', 'Seguro de responsabilidad civil']] }
  ];
}

/** Devuelve las respuestas nuevas, solo con valores válidos de cada campo. */
function validar(plan, cambios) {
  const r = { ...(plan.respuestas || {}) };
  for (const c of campos(plan)) {
    if (!(c.id in (cambios || {}))) continue;
    const v = cambios[c.id];
    if (c.tipo === 'text') r[c.id] = String(v || '').trim().slice(0, 40);
    else if (c.tipo === 'select') { const o = c.ops.find((x) => String(x[0]) === String(v)); if (o) r[c.id] = o[0]; }
    else if (c.tipo === 'multi' && Array.isArray(v)) {
      let vals = c.ops.map((o) => o[0]).filter((k) => v.includes(k));
      if (c.id === 'convivientes' && vals.includes('solo') && vals.length > 1) vals = vals.filter((k) => k !== 'solo');
      r[c.id] = vals;
    }
  }
  if (cambios && 'razaId' in cambios) r.raza = r.razaId === 'otra' ? String(cambios.raza || r.raza || 'Otra raza').slice(0, 40) : (D.raza(r.razaId) || {}).nombre || r.raza;
  // Textos que usa el plan para mostrar
  const edad = { 8: '8–9 semanas', 10: '10–11 semanas', 12: '12–13 semanas', 14: '14–15 semanas', 17: '16–19 semanas', 22: '20 semanas o más' };
  if (r.edadSemanas) r.edadSemanasTexto = edad[r.edadSemanas] || r.edadSemanasTexto;
  const horas = Object.fromEntries(HORAS); if (r.horasSolo != null) r.horasSoloTexto = horas[r.horasSolo];
  return r;
}

/** HTML del plan con las respuestas nuevas y la misma fecha de inicio. */
function regenerar(plan, respuestas) {
  const adulto = !!plan.pack || esAdulto(respuestas);
  const r = plan.pack ? { ...respuestas, problema: plan.pack } : respuestas;
  const render = require(adulto ? '../content/plan-adulto-html.js' : '../content/plan-html.js').render;
  return render({ respuestas: r, marca: CFG.marca, id: plan.token, inicio: plan.enviado_at || plan.ts });
}

module.exports = { campos, validar, regenerar };
