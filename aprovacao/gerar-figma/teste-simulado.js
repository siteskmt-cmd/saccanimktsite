// Roda o plugin contra uma imitação estrita da API do Figma para pegar erros antes de usar no Figma.
// Uso: node aprovacao/gerar-figma/teste-simulado.js [pasta-do-plugin]
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const pasta = path.resolve(process.argv[2] || path.join(__dirname, '.saida', 'plugin'));
const codigo = fs.readFileSync(path.join(pasta, 'code.js'), 'utf8');

const falhas = [];
const falhar = m => { falhas.push(m); throw new Error(m); };
const numOk = (v, nome) => { if (typeof v !== 'number' || !isFinite(v)) falhar(`${nome} inválido: ${v}`); };
const fontesDisponiveis = [];
for (const fam of ['Inter', 'Figtree', 'IBM Plex Mono', 'Archivo']) for (const est of ['Regular', 'Medium', 'SemiBold', 'Semi Bold', 'Bold', 'ExtraBold', 'Black']) fontesDisponiveis.push({ fontName: { family: fam, style: est } });
for (const est of ['SemiBold', 'Bold', 'ExtraBold', 'Black']) {
  fontesDisponiveis.push({ fontName: { family: 'Archivo', style: 'Expanded ' + est } }, { fontName: { family: 'Archivo', style: 'SemiExpanded ' + est } });
}
const carregadas = new Set();
const chaveF = f => f.family + '|' + f.style;
let ids = 0;
const imagens = new Set();
const estilos = new Map();
let contagem = { FRAME: 0, TEXT: 0, RECTANGLE: 0, VECTOR: 0, reacoes: 0 };

function validarPinturas(p, nome) {
  if (!Array.isArray(p)) falhar(`${nome}: fills precisa ser lista`);
  for (const f of p) {
    if (f.type === 'SOLID') { ['r', 'g', 'b'].forEach(k => { numOk(f.color[k], nome + '.cor'); if (f.color[k] < 0 || f.color[k] > 1) falhar(nome + ' cor fora de 0..1'); }); if ('a' in f.color) falhar(nome + ': SOLID não aceita color.a'); if (f.opacity !== undefined && (f.opacity < 0 || f.opacity > 1)) falhar(nome + ' opacidade'); }
    else if (f.type === 'GRADIENT_LINEAR') { f.gradientTransform.flat().forEach(v => numOk(v, nome + '.gt')); f.gradientStops.forEach(s => { numOk(s.position, 'stop'); ['r', 'g', 'b', 'a'].forEach(k => numOk(s.color[k], 'stop.cor')); }); }
    else if (f.type === 'IMAGE') { if (!imagens.has(f.imageHash)) falhar(nome + ': imagem sem hash válido'); if (!['FILL', 'FIT', 'CROP', 'TILE'].includes(f.scaleMode)) falhar('scaleMode'); }
    else falhar(nome + ': tipo de pintura ' + f.type);
  }
}
class No {
  constructor(tipo) { this.type = tipo; this.id = '1:' + (++ids); this.children = []; this.parent = null; this._x = 0; this._y = 0; this.width = 100; this.height = 100; this.name = tipo; this._fills = []; contagem[tipo] = (contagem[tipo] || 0) + 1; }
  set x(v) { numOk(v, this.name + '.x'); this._x = v; } get x() { return this._x; }
  set y(v) { numOk(v, this.name + '.y'); this._y = v; } get y() { return this._y; }
  appendChild(c) { if (!this.children) falhar('não aceita filhos'); if (c.parent) c.parent.children.splice(c.parent.children.indexOf(c), 1); c.parent = this; this.children.push(c); }
  resize(w, h) { numOk(w, this.name + '.w'); numOk(h, this.name + '.h'); if (w < 0.01 || h < 0.01) falhar(`${this.name}: resize menor que 0.01 (${w}x${h})`); this.width = w; this.height = h; }
  rescale(s) { numOk(s, 'rescale'); if (s <= 0) falhar('rescale <= 0'); this.width *= s; this.height *= s; }
  set fills(p) { validarPinturas(p, this.name); this._fills = p; } get fills() { return this._fills; }
  set strokes(p) { validarPinturas(p, this.name + '.stroke'); this._strokes = p; }
  set strokeWeight(v) { numOk(v, 'strokeWeight'); } set strokeTopWeight(v) { numOk(v, 'stw'); } set strokeRightWeight(v) { numOk(v, 'srw'); }
  set strokeBottomWeight(v) { numOk(v, 'sbw'); } set strokeLeftWeight(v) { numOk(v, 'slw'); }
  set strokeAlign(v) { if (!['INSIDE', 'OUTSIDE', 'CENTER'].includes(v)) falhar('strokeAlign'); }
  set opacity(v) { numOk(v, 'opacity'); if (v < 0 || v > 1) falhar('opacity fora'); }
  set cornerRadius(v) { numOk(v, 'cornerRadius'); }
  set effects(e) { for (const x of e) { if (x.type !== 'DROP_SHADOW') falhar('efeito'); ['r', 'g', 'b', 'a'].forEach(k => numOk(x.color[k], 'sombra')); numOk(x.offset.x, 'off'); numOk(x.offset.y, 'off'); numOk(x.radius, 'raio'); if (!('visible' in x) || !('blendMode' in x)) falhar('efeito incompleto'); } }
  set clipsContent(v) { if (typeof v !== 'boolean') falhar('clipsContent'); }
  async setFillStyleIdAsync(id) { if (!estilos.has(id)) falhar('estilo de cor inexistente'); }
  async setReactionsAsync(r) {
    for (const x of r) { if (x.trigger.type !== 'ON_CLICK' || !Array.isArray(x.actions)) falhar('reação'); for (const a of x.actions) { if (a.type === 'NODE' && !todos.has(a.destinationId)) falhar('destino inexistente'); if (a.type === 'URL' && !a.url) falhar('url'); } }
    contagem.reacoes++;
  }
  findAll(f) { const out = []; const rec = n => (n.children || []).forEach(c => { if (f(c)) out.push(c); rec(c); }); rec(this); return out; }
}
const todos = new Map();
const novo = t => { const n = new (t === 'TEXT' ? Texto : No)(t); todos.set(n.id, n); return n; };
class Texto extends No {
  constructor(t) { super(t); this.children = undefined; this._font = { family: 'Inter', style: 'Regular' }; this._chars = ''; }
  set fontName(f) { if (!carregadas.has(chaveF(f))) falhar('fonte não carregada: ' + chaveF(f)); this._font = f; } get fontName() { return this._font; }
  set characters(s) { if (!carregadas.has(chaveF(this._font))) falhar('characters com fonte não carregada ' + chaveF(this._font)); if (typeof s !== 'string') falhar('characters'); this._chars = s; } get characters() { return this._chars; }
  set fontSize(v) { numOk(v, 'fontSize'); if (v < 1) falhar('fontSize < 1'); }
  set lineHeight(v) { if (v.unit !== 'PIXELS' && v.unit !== 'AUTO' && v.unit !== 'PERCENT') falhar('lineHeight'); if (v.unit !== 'AUTO') numOk(v.value, 'lh'); }
  set letterSpacing(v) { if (v.unit !== 'PIXELS' && v.unit !== 'PERCENT') falhar('ls'); numOk(v.value, 'ls'); }
  set textDecoration(v) { if (!['NONE', 'UNDERLINE', 'STRIKETHROUGH'].includes(v)) falhar('decoration'); }
  set textAlignHorizontal(v) { if (!['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'].includes(v)) falhar('align ' + v); }
  set textAutoResize(v) { if (!['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'].includes(v)) falhar('autoresize'); this._ar = v; if (v === 'WIDTH_AND_HEIGHT') { this.width = this._chars.length * 7; } }
  faixa(a, b) { numOk(a, 'ini'); numOk(b, 'fim'); if (a < 0 || b > this._chars.length || a >= b) falhar(`faixa inválida ${a}-${b} de ${this._chars.length}`); }
  setRangeFontName(a, b, f) { this.faixa(a, b); if (!carregadas.has(chaveF(f))) falhar('faixa com fonte não carregada ' + chaveF(f)); }
  setRangeFontSize(a, b, v) { this.faixa(a, b); numOk(v, 'rfs'); }
  setRangeFills(a, b, p) { this.faixa(a, b); validarPinturas(p, 'faixa'); }
  setRangeTextDecoration(a, b, v) { this.faixa(a, b); if (!['NONE', 'UNDERLINE', 'STRIKETHROUGH'].includes(v)) falhar('rdec'); }
  setRangeLetterSpacing(a, b, v) { this.faixa(a, b); numOk(v.value, 'rls'); }
  setRangeLineHeight(a, b, v) { this.faixa(a, b); numOk(v.value, 'rlh'); }
  async setTextStyleIdAsync(id) { if (!estilos.has(id)) falhar('estilo de texto inexistente'); }
}
class Vetor extends No {
  set vectorPaths(v) { for (const p of v) { if (!/^M [-\d.]+ [-\d.]+( L [-\d.]+ [-\d.]+)+ Z$/.test(p.data)) falhar('vectorPath ' + p.data.slice(0, 60)); if (/NaN/.test(p.data)) falhar('NaN no vetor'); } }
}
const paginas = [];
function pagina() { const p = new No('PAGE'); p.name = 'Página'; paginas.push(p); return p; }
const figma = {
  root: { children: paginas }, currentPage: pagina(),
  createFrame: () => novo('FRAME'), createText: () => novo('TEXT'), createRectangle: () => novo('RECTANGLE'),
  createVector: () => { const v = new Vetor('VECTOR'); todos.set(v.id, v); return v; },
  createNodeFromSvg: s => { if (!/<svg/.test(s)) falhar('svg inválido'); const f = novo('FRAME'); f.resize(180, 64); return f; },
  createImage: b => { if (!b || !b.length) falhar('imagem vazia'); const h = 'h' + imagens.size; imagens.add(h); return { hash: h }; },
  base64Decode: s => Buffer.from(s, 'base64'),
  createPaintStyle: () => { const s = { id: 'S:' + (++ids), set paints(p) { validarPinturas(p, 'estilo'); } }; estilos.set(s.id, s); return s; },
  createTextStyle: () => { const s = { id: 'S:' + (++ids), set fontName(f) { if (!carregadas.has(chaveF(f))) falhar('estilo com fonte não carregada'); }, fontSize: 0, lineHeight: 0, letterSpacing: 0 }; estilos.set(s.id, s); return s; },
  createPage: () => pagina(),
  setCurrentPageAsync: async p => { figma.currentPage = p; },
  listAvailableFontsAsync: async () => fontesDisponiveis,
  loadFontAsync: async f => { if (!fontesDisponiveis.some(x => chaveF(x.fontName) === chaveF(f))) throw new Error('fonte inexistente ' + chaveF(f)); carregadas.add(chaveF(f)); },
  notify: (m, o) => { if (o && o.error) console.log('NOTIFY ERRO:', m); },
  closePlugin: () => { fechado = true; },
  viewport: { scrollAndZoomIntoView: () => {} },
};
Object.defineProperty(No.prototype, 'flowStartingPoints', { set(v) { for (const f of v) if (!todos.has(f.nodeId)) falhar('flow'); } });
let fechado = false;
const logs = [];
const ctx = vm.createContext({ figma, console: { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push(a.join(' ')) }, Buffer, Math, JSON, Map, Set, Object, Array, Promise, isFinite, parseInt, String, Number });
vm.runInContext(codigo, ctx);
const espera = setInterval(() => {
  if (!fechado) return;
  clearInterval(espera);
  console.log('páginas:', paginas.map(p => `${p.name} (${p.children.length})`).join(' · '));
  console.log('camadas:', JSON.stringify(contagem), '· estilos:', estilos.size, '· imagens:', imagens.size);
  const avisos = logs.filter(l => /falha|link|fonte|Erro/.test(l));
  console.log('avisos do plugin:', avisos.length);
  avisos.slice(0, 15).forEach(a => console.log('  ', a));
  const unicas = [...new Set(falhas)];
  console.log('falhas de API:', unicas.length);
  unicas.slice(0, 20).forEach(f => console.log('  ✗', f));
}, 200);
