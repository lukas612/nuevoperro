/* Une el detalle de las tareas (cachorro y programas de adulto). Solo servidor: es contenido de pago. */
'use strict';
function cargar(f) { try { return require('./' + f); } catch (e) { return { SEMANAS: {}, DETALLE: {} }; } }
const a = cargar('cachorro-a.js'), b = cargar('cachorro-b.js');
const CACHORRO = { SEMANAS: Object.assign({}, a.SEMANAS, b.SEMANAS), DETALLE: Object.assign({}, a.DETALLE, b.DETALLE) };
const PROGRAMAS = {};
for (const p of ['correa', 'ladridos', 'solo', 'adaptacion']) PROGRAMAS[p] = cargar(p + '.js');
module.exports = { CACHORRO, PROGRAMAS };
