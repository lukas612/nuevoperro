/*
 * Página privada del plan de 6 semanas para perros adultos y recién adoptados.
 * Mismo diseño que el plan de cachorro (comparte CSS). render(datos) → HTML completo.
 */
(function (root) {
  'use strict';
  var PR, D, PH, P;
  if (typeof module !== 'undefined' && module.exports) {
    PR = require('./programas-adulto.js'); D = require('../public/perros.js'); PH = require('./plan-html.js'); P = require('./plantillas.js');
  } else { PR = root.PROGRAMAS; D = root.PERROS; PH = root.PLAN_HTML; P = root.PLANTILLAS; }
  var I = D.icono;
  var COLORES = ['sky', 'butter', 'mint', 'peach', 'lilac'];
  var EDADES = { joven: '6–12 meses', adulto: '1–3 años', maduro: '3–7 años', senior: 'Más de 7 años' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function b(ic, color) { return '<span class="bu b-' + color + '">' + I(ic) + '</span>'; }
  function fechaLarga(d) { var m = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']; return d.getDate() + ' de ' + m[d.getMonth()]; }
  function tareasPlanas(prog) { var t = []; prog.semanas.forEach(function (s) { s.tareas.forEach(function (x) { t.push(x); }); }); return t; }

  function render(datos) {
    var r = datos.respuestas || {};
    var n = r.nombre || 'tu perro';
    var sus = function (txt) { return String(txt).replace(/\{n\}/g, n); };
    var prog = PR.PROGRAMAS[r.problema] || PR.PROGRAMAS.correa;
    var marca = datos.marca || 'Qué Buen Perro';
    var id = datos.id || 'demo';
    var inicio = datos.inicio ? new Date(datos.inicio) : new Date();
    var razaId = r.razaId || 'mestizo';
    var raza = D.raza(razaId) || D.raza('mestizo');
    var nombreRaza = razaId === 'otra' ? (r.raza || 'Perro') : raza.nombre;
    var rasgo = (P.RASGOS && P.RASGOS[razaId]) || {};
    var T = tareasPlanas(prog);

    var semanas = prog.semanas.map(function (s, k) {
      var num = k + 1;
      return '<section class="sem" data-sem="' + num + '"' + (num === 1 ? '' : ' hidden') + '>' +
        '<div class="sem-cab"><div><span class="eti">Semana ' + num + '</span><h3>' + esc(s.foco) + '</h3></div></div>' +
        '<div class="caja"><h4>' + I('calendario') + 'Una tarea cada día</h4><ul class="checks">' + s.tareas.map(function (t, j) {
          var dia = k * 7 + j + 1;
          return '<li><label><input type="checkbox" data-k="d' + dia + '"><span><b>Día ' + dia + ' · ' + esc(t[0]) + '</b>' + esc(sus(t[1])) + '</span></label></li>';
        }).join('') + '</ul></div></section>';
    }).join('');

    var notas = [];
    if (prog.notaDetalle && prog.notaDetalle[r.detalle]) notas.push(['estrella', 'butter', 'Tu caso', sus(prog.notaDetalle[r.detalle])]);
    if (rasgo.cuidado) notas.push(['huella', 'peach', 'Por ser ' + nombreRaza.toLowerCase(), rasgo.cuidado]);
    if (rasgo.nota) notas.push(['huella', 'peach', 'Por ser ' + nombreRaza.toLowerCase(), rasgo.nota]);
    if (rasgo.energia === 'alta') notas.push(['pelota', 'mint', 'Mucha energía', 'Su raza necesita mover la cabeza a diario: el juego de olfato y de pensar hará que todo el plan funcione mejor.']);
    if (r.tipo === 'adoptado' && r.problema !== 'adaptacion') notas.push(['casa', 'sky', 'Recién adoptado', 'Lleva poco en casa: dale unos días de descompresión con rutina fija antes de exigirle mucho. Si algo le supera, vuelve a la tarea anterior.']);
    if (r.edadPerro === 'senior') notas.push(['corazon', 'lilac', 'Perro mayor', 'Un cambio de conducta en un perro mayor puede tener una causa de salud. Coméntalo con tu veterinario.']);
    if (Number(r.horasSolo) >= 6) notas.push(['reloj', 'sky', r.horasSolo + ' horas sin nadie', 'Muchas horas solo hacen todo más difícil. Si puedes, que alguien pase a mitad de jornada.']);

    var chips = [nombreRaza, EDADES[r.edadPerro] || '', r.tipo === 'adoptado' ? 'Recién adoptado' : '', r.vivienda === 'jardin' ? 'Casa con jardín' : 'Piso'].filter(Boolean);

    var html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">' +
      '<title>Plan de ' + esc(n) + ' · ' + esc(marca) + '</title>' +
      '<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Qué Buen Perro">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap">' +
      '<style>' + PH.CSS + '.porque{font-size:1rem;line-height:1.6}.tabs{grid-template-columns:repeat(6,1fr)}@media (max-width:480px){.tabs{grid-template-columns:repeat(3,1fr)}}</style></head><body>' +
      (datos.volver ? '<button class="volver" id="volver">' + I('flecha') + 'Volver a la demo</button>' : '') +
      '<header class="hero"><div class="in">' +
        '<div class="hero-top"><span class="marca">' + D.logo() + D.nombreMarca(marca) + '</span><span class="desde">Desde el ' + fechaLarga(inicio) + (datos.volver ? '' : ' · <a href="/mi-zona?plan=' + esc(id) + '" style="color:#ffd76e">Mi zona</a>') + '</span></div>' +
        '<div class="hero-main"><span class="av">' + D.cara(razaId, { lengua: true }) + '</span><div><span class="eti cl">' + esc(prog.titulo) + ' · 6 semanas</span><h1>' + esc(n) + '</h1>' +
        '<div class="chips">' + chips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div></div></div>' +
        '<div class="progreso"><div class="pr-txt"><b id="pr-sem">Semana 1 de 6</b><span id="pr-pct">0 tareas hechas</span></div><div class="barra"><i id="pr-bar"></i></div></div>' +
      '</div></header>' +
      '<nav class="nav"><div class="in"><a href="#hoy">Hoy</a><a href="#semanas">Semanas</a><a href="#protocolo">Qué hacer</a><a href="#ayuda">Cuándo pedir ayuda</a></div></nav>' +
      '<main class="in">' +
      '<section id="hoy" class="pila">' +
        '<div class="hoy"><div class="hoy-cab">' + b('sol', 'butter') + '<div><span class="eti">Hoy · <span id="hoy-dia">Día 1</span></span><h2 id="hoy-tit">' + esc(T[0][0]) + '</h2></div></div>' +
        '<p id="hoy-txt">' + esc(sus(T[0][1])) + '</p><label class="hecho-hoy"><input type="checkbox" id="hoy-check"><span>Hecho</span></label></div>' +
        '<div class="prio">' + b(prog.icono, 'peach') + '<div><span class="eti">Por qué lo hace</span><p class="porque">' + esc(sus(prog.porQue)) + '</p></div></div>' +
        (notas.length ? '<div class="notas">' + notas.map(function (x) { return '<div class="nt">' + b(x[0], x[1]) + '<div><b>' + esc(x[2]) + '</b><span>' + esc(x[3]) + '</span></div></div>'; }).join('') + '</div>' : '') +
      '</section>' +
      '<section id="semanas" class="pila"><span class="eti">Semana a semana</span><h2>Su plan, día a día</h2>' +
        '<div class="tabs" role="tablist">' + [1, 2, 3, 4, 5, 6].map(function (k) { return '<button role="tab" data-tab="' + k + '" aria-selected="' + (k === 1) + '"><b>S' + k + '</b><small>' + esc(prog.semanas[k - 1].foco.split(' ')[0]) + '</small></button>'; }).join('') + '</div>' +
        semanas + '</section>' +
      '<section id="protocolo" class="pila"><span class="eti">Qué hacer</span><h2>' + esc(prog.titulo) + ': las reglas</h2>' +
        '<div class="caja"><div class="prot-in" style="padding-bottom:0"><div><h4 class="ok">' + I('check') + 'Qué hacer</h4><ol>' + prog.pasos.map(function (x) { return '<li>' + esc(sus(x)) + '</li>'; }).join('') + '</ol></div>' +
        '<div><h4 class="no">' + I('flecha') + 'Evita</h4><ul class="evita">' + prog.evita.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div></div></section>' +
      '<section id="ayuda" class="pila"><span class="eti">Cuándo pedir ayuda</span><h2>Si no mejora o empeora</h2>' +
        '<div class="caja"><ul class="lista-ic">' +
          '<li>' + b('corazon', 'peach') + '<span>Si aparece de golpe o va a peor, consulta con tu veterinario: el dolor cambia la conducta.</span></li>' +
          '<li>' + b('personas', 'mint') + '<span>Si tras 3 semanas no ves ningún avance, un educador canino en persona puede ver lo que el plan no ve.</span></li>' +
          '<li>' + b('escudo', 'sky') + '<span>Si alguna vez muerde o amenaza a una persona, para el plan y busca un profesional.</span></li>' +
        '</ul></div></section>' +
      '<footer class="pie">' + b('escudo', 'mint') + '<div><b>Garantía de 14 días</b><span>Si el plan no te sirve, responde a cualquiera de nuestros emails y te devolvemos el dinero.</span></div></footer>' +
      '<p class="legal-pie">Este plan ofrece educación en positivo. No sustituye a tu veterinario ni a un profesional que vea a tu perro en persona.</p>' +
      '</main><script>' + JS.replace('__ID__', JSON.stringify(id)).replace('__INICIO__', JSON.stringify(inicio.toISOString())).replace('__TAREAS__', JSON.stringify(T.map(function (t) { return [t[0], sus(t[1])]; }))) + '<\/script></body></html>';
    return html;
  }

  var JS = "(function(){var id='plan_'+__ID__,inicio=new Date(__INICIO__),T=__TAREAS__,N=T.length;" +
    "function get(){try{return JSON.parse(localStorage.getItem(id))||{}}catch(e){return{}}}function set(v){try{localStorage.setItem(id,JSON.stringify(v))}catch(e){}}" +
    "var st=get();var dia=Math.min(N,Math.max(1,Math.floor((Date.now()-inicio.getTime())/864e5)+1));var sem=Math.ceil(dia/7);" +
    "document.querySelectorAll('input[data-k]').forEach(function(c){var k=c.dataset.k;c.checked=!!st[k];c.onchange=function(){st[k]=c.checked;set(st);sync();act()}});" +
    "var hc=document.getElementById('hoy-check');document.getElementById('hoy-dia').textContent='Día '+dia;document.getElementById('hoy-tit').textContent=T[dia-1][0];document.getElementById('hoy-txt').textContent=T[dia-1][1];" +
    "hc.checked=!!st['d'+dia];hc.onchange=function(){st['d'+dia]=hc.checked;set(st);sync();act()};" +
    "function sync(){var c=document.querySelector('input[data-k=\"d'+dia+'\"]');if(c)c.checked=!!st['d'+dia]}" +
    "function act(){var n=0;for(var i=1;i<=N;i++)if(st['d'+i])n++;document.getElementById('pr-sem').textContent='Semana '+sem+' de 6';document.getElementById('pr-pct').textContent=n+' de '+N+' tareas hechas';document.getElementById('pr-bar').style.width=Math.max(3,n/N*100)+'%'}" +
    "function tab(k){document.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab==k)});document.querySelectorAll('.sem').forEach(function(s){s.hidden=s.dataset.sem!=k})}" +
    "document.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){tab(b.dataset.tab)}});tab(sem);act();" +
    "var v=document.getElementById('volver');if(v)v.onclick=function(){location.reload()};try{if('serviceWorker' in navigator&&!v)navigator.serviceWorker.register('/sw.js').catch(function(){})}catch(e){}})();";

  var api = { render: render, tareas: function (problema) { return tareasPlanas(PR.PROGRAMAS[problema] || PR.PROGRAMAS.correa); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PLAN_ADULTO_HTML = api;
})(this);
