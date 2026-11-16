// Plugin "SMRC · Montar layout": cria no arquivo aberto as páginas Capa, Guia de estilo,
// Desktop 1440 e Celular 390, com estilos de cor e texto e protótipo navegável.
// DADOS é inserido antes deste código pelo montador (montar.js).

const PALETA = [
  ['Azul-noite', '#2D2F48'], ['Azul-noite profundo', '#23253A'], ['Petróleo', '#2B6C80'], ['Petróleo claro', '#7FB4C4'],
  ['Concreto', '#F1F2F4'], ['Branco', '#FFFFFF'], ['Tinta', '#1D1F30'], ['Cinza', '#5C6075'], ['Linha', '#D9DBE2'],
];
// [nome, família, peso, largura%, tamanho, entrelinha(px), espaçamento(px), caixa alta]
const ESTILOS_TEXTO = [
  ['Desktop/H1 Título de página', 'Archivo', 800, 125, 62.4, 67.39, -0.624],
  ['Desktop/H2 Título de seção', 'Archivo', 800, 125, 38.4, 41.47, 0],
  ['Celular/H1 Título de página', 'Archivo', 800, 125, 33.6, 36.29, -0.336],
  ['Celular/H2 Título de seção', 'Archivo', 800, 125, 25.6, 27.65, 0],
  ['H3 Título de card', 'Archivo', 700, 112, 20, 21.6, 0],
  ['H3 Título de item', 'Archivo', 700, 112, 16.8, 18.14, 0],
  ['Texto/Lead', 'Figtree', 400, 100, 20, 32, 0],
  ['Texto/Corpo', 'Figtree', 400, 100, 16.8, 26.88, 0],
  ['Texto/Pequeno', 'Figtree', 400, 100, 14.4, 23.04, 0],
  ['Texto/Legenda', 'Figtree', 400, 100, 12.48, 19.97, 0],
  ['Botão', 'Figtree', 700, 100, 14.4, 14.4, 0.288],
  ['Menu', 'Figtree', 600, 100, 14.4, 23.04, 0],
  ['Rótulo', 'IBM Plex Mono', 500, 100, 12.48, 12.48, 1.747],
];
const PESOS = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
const LARGURAS = [[125, 'Expanded'], [112.5, 'SemiExpanded'], [100, '']];

let erros = 0;
const log = (...a) => console.log('[SMRC]', ...a);

function hexRgb(h) { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; }
function hexDe(c) { return '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); }
function solido(c) { return { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }; }
function transfGradiente(ang) {
  const rad = (ang - 90) * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
  return [[c, s, 0.5 - c / 2 - s / 2], [-s, c, 0.5 + s / 2 - c / 2]];
}
function pinturas(lista) {
  return (lista || []).slice().reverse().map(f => f.k === 's' ? solido(f.c) : {
    type: 'GRADIENT_LINEAR', gradientTransform: transfGradiente(f.ang),
    gradientStops: f.stops.map(s => ({ position: Math.min(1, Math.max(0, s.p)), color: { r: s.c.r, g: s.c.g, b: s.c.b, a: s.c.a } })),
  });
}

// ---------- fontes ----------
let FONTES = [];
const cacheFonte = new Map();
const norm = s => s.toLowerCase().replace(/[\s_-]+/g, '');
function escolherFonte(ff, fw, fs, it) {
  const chave = [ff, fw, fs, it].join('|');
  if (cacheFonte.has(chave)) return cacheFonte.get(chave);
  const largura = (LARGURAS.find(l => fs >= l[0] - 6) || [0, ''])[1];
  const pesos = [fw, fw + 100, fw - 100, fw + 200, fw - 200, 400].filter(p => PESOS[p]);
  const tentativas = [];
  for (const p of pesos) {
    const pn = PESOS[p] + (it ? ' Italic' : '');
    if (largura) {
      tentativas.push([ff + ' ' + largura, pn], [ff, largura + ' ' + pn], [ff, largura + pn]);
    }
    tentativas.push([ff, pn]);
    if (p === 400) tentativas.push([ff, 'Regular'], [ff, 'Normal']);
  }
  let achou = null;
  for (const [fam, est] of tentativas) {
    achou = FONTES.find(f => norm(f.fontName.family) === norm(fam) && norm(f.fontName.style) === norm(est));
    if (achou) break;
  }
  if (!achou) achou = FONTES.find(f => norm(f.fontName.family) === norm(ff));
  const res = achou ? achou.fontName : { family: 'Inter', style: fw >= 700 ? 'Bold' : fw >= 600 ? 'Semi Bold' : 'Regular' };
  cacheFonte.set(chave, res);
  return res;
}
function coletarFontes(n, out) {
  if (n.k === 't') {
    out.add(JSON.stringify(escolherFonte(n.base.ff, n.base.fw, n.base.fs, n.base.it)));
    for (const r of n.runs || []) out.add(JSON.stringify(escolherFonte(r.ff || n.base.ff, r.fw || n.base.fw, r.fs || n.base.fs, r.it === undefined ? n.base.it : r.it)));
  }
  (n.ch || []).forEach(c => coletarFontes(c, out));
}

// ---------- estilos ----------
const estilosCor = new Map();
const estilosTexto = [];
async function criarEstilos() {
  for (const [nome, hex] of PALETA) {
    const s = figma.createPaintStyle();
    s.name = 'SMRC/' + nome;
    s.paints = [{ type: 'SOLID', color: hexRgb(hex) }];
    estilosCor.set(hex, s.id);
  }
  for (const [nome, ff, fw, fs, sz, lh, ls] of ESTILOS_TEXTO) {
    const fonte = escolherFonte(ff, fw, fs, false);
    await figma.loadFontAsync(fonte);
    const s = figma.createTextStyle();
    s.name = 'SMRC/' + nome;
    s.fontName = fonte;
    s.fontSize = sz;
    s.lineHeight = { unit: 'PIXELS', value: lh };
    s.letterSpacing = { unit: 'PIXELS', value: ls };
    estilosTexto.push({ id: s.id, fonte, sz, lh, ls });
  }
}
async function aplicarEstiloCor(no, lista) {
  if (!lista || lista.length !== 1 || lista[0].k !== 's' || lista[0].c.a < 1) return;
  const id = estilosCor.get(hexDe(lista[0].c));
  if (id) { try { await no.setFillStyleIdAsync(id); } catch (e) { /* mantém a cor */ } }
}

// ---------- imagens ----------
const hashes = new Map();
function imagem(src) {
  if (hashes.has(src)) return hashes.get(src);
  const d = DADOS.imagens[src];
  let h = null;
  if (d && d.b64) h = figma.createImage(figma.base64Decode(d.b64)).hash;
  hashes.set(src, h);
  return h;
}

// ---------- montagem ----------
function vetorDe(pontos) {
  const v = figma.createVector();
  v.vectorPaths = [{ windingRule: 'NONZERO', data: pontos.map((p, i) => (i ? 'L ' : 'M ') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' ') + ' Z' }];
  return v;
}
function bordas(no, st) {
  if (!st) return;
  no.strokes = [solido(st.c)];
  no.strokeAlign = 'INSIDE';
  if (st.t === st.r && st.r === st.b && st.b === st.l) no.strokeWeight = st.t;
  else { no.strokeTopWeight = st.t; no.strokeRightWeight = st.r; no.strokeBottomWeight = st.b; no.strokeLeftWeight = st.l; }
}
function efeitos(no, fx) {
  if (!fx || !fx.length) return;
  no.effects = fx.map(s => ({ type: 'DROP_SHADOW', color: { r: s.c.r, g: s.c.g, b: s.c.b, a: s.c.a }, offset: { x: s.x, y: s.y }, radius: s.blur, spread: s.spread, visible: true, blendMode: 'NORMAL' }));
}
const tam = v => Math.max(0.01, v);

async function montar(d, pai, ox, oy) {
  try {
    if (d.k === 'f') {
      const fr = figma.createFrame();
      pai.appendChild(fr);
      fr.name = d.n;
      fr.resize(tam(d.w), tam(d.h));
      fr.x = d.x - ox; fr.y = d.y - oy;
      fr.clipsContent = !!d.clip;
      if (d.poly) {
        fr.fills = [];
        const v = vetorDe(d.poly);
        fr.appendChild(v);
        v.name = d.n.startsWith('Hexágono') ? 'Hexágono' : 'Forma';
        v.x = 0; v.y = 0;
        v.fills = pinturas(d.fill);
        if (d.st) { v.strokes = [solido(d.st.c)]; v.strokeWeight = Math.max(d.st.t, d.st.l); v.strokeAlign = 'INSIDE'; }
        await aplicarEstiloCor(v, d.fill);
      } else {
        fr.fills = pinturas(d.fill);
        await aplicarEstiloCor(fr, d.fill);
        bordas(fr, d.st);
      }
      efeitos(fr, d.fx);
      if (d.op !== undefined) fr.opacity = d.op;
      if (d.rad) fr.cornerRadius = d.rad;
      for (const c of d.ch || []) await montar(c, fr, d.x, d.y);
      return fr;
    }
    if (d.k === 't') return await texto(d, pai, ox, oy);
    if (d.k === 'i') {
      const h = imagem(d.src);
      const no = d.poly ? vetorDe(d.poly) : figma.createRectangle();
      pai.appendChild(no);
      no.name = d.n;
      if (!d.poly) no.resize(tam(d.w), tam(d.h));
      no.x = d.x - ox; no.y = d.y - oy;
      if (h) {
        const p = { type: 'IMAGE', imageHash: h, scaleMode: d.fit === 'contain' ? 'FIT' : 'FILL' };
        if (d.cinza) p.filters = { saturation: -1 };
        if (d.fop !== undefined) p.opacity = d.fop;
        no.fills = [p];
      } else no.fills = [{ type: 'SOLID', color: { r: .85, g: .86, b: .89 } }];
      if (d.op !== undefined) no.opacity = d.op;
      return no;
    }
    if (d.k === 'v') {
      const svg = DADOS.imagens[d.src] && DADOS.imagens[d.src].svg;
      if (!svg) return null;
      const no = figma.createNodeFromSvg(svg);
      pai.appendChild(no);
      no.name = d.n;
      const esc = Math.min(d.w / no.width, d.h / no.height);
      if (isFinite(esc) && esc > 0) no.rescale(esc);
      no.x = d.x - ox + (d.w - no.width) / 2; no.y = d.y - oy + (d.h - no.height) / 2;
      if (d.cinza) {
        // logos de parceiros em cinza, como no site
        for (const n of no.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.length)) {
          n.fills = n.fills.map(f => f.type === 'SOLID' ? { ...f, color: { r: .55, g: .56, b: .6 } } : f);
        }
      }
      if (d.op !== undefined) no.opacity = d.op;
      return no;
    }
  } catch (e) {
    erros++;
    log('falha em', d.n, e && e.message);
  }
  return null;
}

async function texto(d, pai, ox, oy) {
  const t = figma.createText();
  pai.appendChild(t);
  const b = d.base;
  const fonte = escolherFonte(b.ff, b.fw, b.fs, b.it);
  t.fontName = fonte;
  t.characters = d.s;
  t.fontSize = b.sz;
  if (b.lh) t.lineHeight = { unit: 'PIXELS', value: b.lh };
  t.letterSpacing = { unit: 'PIXELS', value: b.ls || 0 };
  t.fills = [solido(b.c || { r: 0, g: 0, b: 0, a: 1 })];
  if (b.dec === 'U') t.textDecoration = 'UNDERLINE';
  t.textAlignHorizontal = { L: 'LEFT', C: 'CENTER', R: 'RIGHT', J: 'JUSTIFIED' }[d.al] || 'LEFT';
  for (const r of d.runs || []) {
    const a = r.a, z = Math.min(r.b, d.s.length);
    if (z <= a) continue;
    if (r.ff || r.fw || r.fs || r.it !== undefined) t.setRangeFontName(a, z, escolherFonte(r.ff || b.ff, r.fw || b.fw, r.fs || b.fs, r.it === undefined ? b.it : r.it));
    if (r.sz) t.setRangeFontSize(a, z, r.sz);
    if (r.c) t.setRangeFills(a, z, [solido(r.c)]);
    if (r.dec !== undefined) t.setRangeTextDecoration(a, z, r.dec === 'U' ? 'UNDERLINE' : 'NONE');
    if (r.ls !== undefined) t.setRangeLetterSpacing(a, z, { unit: 'PIXELS', value: r.ls });
    if (r.lh) t.setRangeLineHeight(a, z, { unit: 'PIXELS', value: r.lh });
  }
  t.name = d.n;
  if (d.ml) { t.textAutoResize = 'HEIGHT'; t.resize(tam(d.w + 2), tam(d.h)); }
  else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.x = d.x - ox - (d.ml ? 0 : 0);
  t.y = d.y - oy;
  if (!d.ml && d.al === 'C') t.x = d.x - ox + (d.w - t.width) / 2;
  if (!d.ml && d.al === 'R') t.x = d.x - ox + d.w - t.width;
  // estilo de texto do guia, quando bate exatamente
  if (!(d.runs || []).length) {
    const e = estilosTexto.find(s => s.fonte.family === fonte.family && s.fonte.style === fonte.style && Math.abs(s.sz - b.sz) < 0.3 && b.lh && Math.abs(s.lh - b.lh) < 0.6 && Math.abs(s.ls - (b.ls || 0)) < 0.05);
    if (e) { try { await t.setTextStyleIdAsync(e.id); } catch (er) { /* mantém */ } }
  }
  if (b.c && b.c.a === 1 && !(d.runs || []).some(r => r.c)) await aplicarEstiloCor(t, [{ k: 's', c: b.c }]);
  return t;
}

// ---------- protótipo ----------
async function ligar(telas, quadros, disp) {
  const porArquivo = new Map(telas.map((t, i) => [t.arquivo, quadros[i]]));
  for (let i = 0; i < telas.length; i++) {
    const quadro = quadros[i];
    if (!quadro) continue;
    const links = DADOS.links[disp + ':' + telas[i].arquivo] || [];
    if (!links.length) continue;
    const grupo = figma.createFrame();
    quadro.appendChild(grupo);
    grupo.name = 'Links do protótipo';
    grupo.resize(quadro.width, quadro.height);
    grupo.x = 0; grupo.y = 0; grupo.fills = []; grupo.clipsContent = false;
    for (const l of links) {
      try {
        let destino = null, url = null;
        if (/^(https?:|tel:|mailto:)/.test(l.href)) url = l.href;
        else {
          const arq = l.href.split('#')[0];
          destino = arq ? porArquivo.get(arq) : null;
        }
        if (!destino && !url) continue;
        const h = figma.createRectangle();
        grupo.appendChild(h);
        h.name = 'Link → ' + (destino ? destino.name : url);
        h.resize(tam(l.w), tam(l.h));
        h.x = l.x; h.y = l.y;
        h.fills = [];
        const acao = destino ? { type: 'NODE', destinationId: destino.id, navigation: 'NAVIGATE', transition: null }
          : { type: 'URL', url };
        await h.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [acao] }]);
      } catch (e) { erros++; log('link', l.href, e && e.message); }
    }
  }
}

// ---------- capa ----------
async function capa(pagina, logoSvg) {
  const f = figma.createFrame();
  pagina.appendChild(f);
  f.name = 'Capa';
  f.resize(1440, 900);
  f.fills = [solido(Object.assign(hexRgb('#2D2F48'), { a: 1 }))];
  await aplicarEstiloCor(f, [{ k: 's', c: Object.assign(hexRgb('#2D2F48'), { a: 1 }) }]);
  if (logoSvg) {
    const l = figma.createNodeFromSvg(logoSvg);
    f.appendChild(l); l.rescale(220 / l.width); l.x = 96; l.y = 88; l.name = 'Logo';
  }
  const linhas = [
    ['SMRC ENGENHARIA · SITE INSTITUCIONAL', 'IBM Plex Mono', 500, 100, 14, '#7FB4C4', 2.2, 330],
    ['Layout do site', 'Archivo', 800, 125, 96, '#FFFFFF', -1, 372],
    ['16 telas · computador (1440) e celular (390) · guia de estilo · protótipo navegável', 'Figtree', 400, 100, 22, '#FFFFFF', 0, 500],
    ['Versão aprovada · novembro de 2026', 'Figtree', 600, 100, 18, '#7FB4C4', 0, 760],
  ];
  for (const [s, ff, fw, fs, sz, cor, ls, y] of linhas) {
    const t = figma.createText();
    f.appendChild(t);
    t.fontName = escolherFonte(ff, fw, fs, false);
    t.characters = s; t.fontSize = sz; t.letterSpacing = { unit: 'PIXELS', value: ls };
    t.fills = [solido(Object.assign(hexRgb(cor), { a: 1 }))];
    t.x = 96; t.y = y;
  }
}

// ---------- principal ----------
async function principal() {
  figma.notify('Montando o layout da SMRC… isso leva alguns minutos.', { timeout: 6000 });
  FONTES = await figma.listAvailableFontsAsync();
  const todas = new Set();
  [...DADOS.telas.desktop, ...DADOS.telas.celular, ...DADOS.guia].forEach(t => coletarFontes(t, todas));
  for (const [, ff, fw, fs] of ESTILOS_TEXTO) todas.add(JSON.stringify(escolherFonte(ff, fw, fs, false)));
  [['IBM Plex Mono', 500, 100], ['Archivo', 800, 125], ['Figtree', 400, 100], ['Figtree', 600, 100]].forEach(([a, b, c]) => todas.add(JSON.stringify(escolherFonte(a, b, c, false))));
  for (const f of todas) {
    const fn = JSON.parse(f);
    try { await figma.loadFontAsync(fn); }
    catch (e) {
      log('fonte indisponível', fn.family, fn.style);
      cacheFonte.forEach((v, k) => { if (v.family === fn.family && v.style === fn.style) cacheFonte.set(k, { family: 'Inter', style: 'Regular' }); });
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    }
  }
  await criarEstilos();

  const logo = Object.values(DADOS.imagens).find(i => /Saccani_logo_negativa_branca\.svg$/.test(i.rel));
  const pCapa = figma.currentPage;
  pCapa.name = 'Capa';
  await capa(pCapa, logo && logo.svg);

  const pGuia = figma.createPage(); pGuia.name = 'Guia de estilo';
  let x = 0;
  for (const g of DADOS.guia) {
    const q = await montar(g, pGuia, -x, 0);
    x += g.w + 160;
  }

  const resultado = {};
  for (const [disp, nome, espaco] of [['desktop', 'Desktop · 1440', 200], ['celular', 'Celular · 390', 120]]) {
    const pg = figma.createPage(); pg.name = nome;
    await figma.setCurrentPageAsync(pg);
    const telas = DADOS.telas[disp];
    const quadros = [];
    let px = 0;
    for (const t of telas) {
      figma.notify(`${nome}: ${t.n}`, { timeout: 1500 });
      const q = await montar(t, pg, -px, 0);
      quadros.push(q);
      px += t.w + espaco;
    }
    await ligar(telas, quadros, disp);
    const inicio = quadros[0];
    if (inicio) pg.flowStartingPoints = [{ nodeId: inicio.id, name: 'Site · ' + nome }];
    resultado[disp] = quadros;
  }
  await figma.setCurrentPageAsync(pCapa);
  figma.viewport.scrollAndZoomIntoView(pCapa.children);
  figma.notify(erros ? `Layout montado (${erros} camadas com aviso no console).` : 'Layout da SMRC montado com sucesso.', { timeout: 8000 });
}

principal().catch(e => { log(e); figma.notify('Erro ao montar: ' + (e && e.message), { error: true }); }).finally(() => figma.closePlugin());
