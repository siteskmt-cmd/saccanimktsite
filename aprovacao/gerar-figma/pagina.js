// Roda dentro do navegador: transforma uma tela renderizada em uma árvore de camadas
// (molduras, textos, imagens e links) com posições absolutas, pronta para o plugin do Figma.
window.__extrairTela = function (raiz, opcoes) {
  opcoes = opcoes || {};
  const IGNORAR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'META', 'LINK', 'HEAD', 'TITLE']);
  const INLINE = new Set(['inline', 'contents']);
  const base = raiz.getBoundingClientRect();
  const OX = base.left + scrollX, OY = base.top + scrollY;
  const imagens = new Set();
  const links = [];

  // 1. pseudo-elementos (::before / ::after) viram elementos reais, para terem caixa própria
  if (!document.getElementById('__np')) {
    const st = document.createElement('style');
    st.id = '__np';
    st.textContent = '.__np::before,.__np::after{content:none!important}';
    document.head.appendChild(st);
  }
  const todos = [raiz, ...raiz.querySelectorAll('*')];
  const SEM_FILHOS = new Set(['IMG', 'INPUT', 'SELECT', 'TEXTAREA', 'BR', 'HR', 'svg', 'SVG', 'IFRAME']);
  const novos = [];
  for (const el of todos) {
    if (IGNORAR.has(el.tagName) || SEM_FILHOS.has(el.tagName) || el.classList.contains('__np')) continue;
    for (const ps of ['::before', '::after']) {
      const cs = getComputedStyle(el, ps);
      if (!cs || cs.content === 'none' || cs.content === 'normal' || cs.display === 'none') continue;
      const sp = document.createElement('span');
      sp.setAttribute('data-pseudo', ps === '::before' ? 'antes' : 'depois');
      for (let i = 0; i < cs.length; i++) {
        const p = cs[i];
        sp.style.setProperty(p, cs.getPropertyValue(p));
      }
      sp.style.setProperty('content', 'normal');
      const m = cs.content.match(/^"(.*)"$/);
      sp.textContent = m ? m[1].replace(/\\"/g, '"') : '';
      novos.push([el, sp, ps]);
    }
  }
  for (const [el, sp, ps] of novos) {
    if (ps === '::before') el.insertBefore(sp, el.firstChild); else el.appendChild(sp);
  }
  for (const el of todos) el.classList.add('__np');

  // 2. utilidades
  const num = v => parseFloat(v) || 0;
  function cor(c) {
    if (!c) return null;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    const a = p.length > 3 ? p[3] : 1;
    if (!(a > 0)) return null;
    return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: +a.toFixed(3) };
  }
  function partes(s, sep) { // divide no separador, respeitando parênteses
    const out = []; let d = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') d++;
      if (ch === ')') d--;
      if (ch === sep && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function gradientes(bi) {
    if (!bi || bi === 'none') return [];
    const out = [];
    for (const g of partes(bi, ',')) {
      const m = g.match(/^linear-gradient\((.*)\)$/s);
      if (!m) continue;
      let args = partes(m[1], ','), ang = 180;
      if (/deg$/.test(args[0])) { ang = num(args[0]); args = args.slice(1); }
      else if (/^to /.test(args[0])) {
        const dir = { 'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270 }[args[0]];
        ang = dir === undefined ? 180 : dir; args = args.slice(1);
      }
      const stops = args.map((a, i) => {
        const mm = a.match(/^(rgba?\([^)]*\))\s*([\d.]+%)?/);
        const c = mm && cor(mm[1]);
        return { c: c || { r: 0, g: 0, b: 0, a: 0 }, p: mm && mm[2] ? num(mm[2]) / 100 : i / Math.max(1, args.length - 1) };
      });
      if (stops.length >= 2) out.push({ ang, stops });
    }
    return out;
  }
  function avaliar(tok, tam) { // 50% | 18px | calc(100% - 18px)
    tok = tok.trim();
    let m = tok.match(/^calc\(\s*([\d.]+)%\s*([+-])\s*([\d.]+)px\s*\)$/);
    if (m) return tam * num(m[1]) / 100 + (m[2] === '-' ? -1 : 1) * num(m[3]);
    if (tok.endsWith('%')) return tam * num(tok) / 100;
    return num(tok);
  }
  function poligono(cp, w, h) {
    if (!cp || cp === 'none') return null;
    const m = cp.match(/^polygon\((.*)\)$/s);
    if (!m) return null;
    return partes(m[1], ',').map(pt => {
      const xy = partes(pt.replace(/^(nonzero|evenodd)\s*/, ''), ' ');
      return [+avaliar(xy[0], w).toFixed(2), +avaliar(xy[1], h).toFixed(2)];
    });
  }
  function sombras(bs) {
    const out = { ins: null, ext: [] };
    if (!bs || bs === 'none') return out;
    for (const s of partes(bs, ',')) {
      const c = cor((s.match(/rgba?\([^)]*\)/) || [])[0]);
      const n = (s.replace(/rgba?\([^)]*\)/, '').match(/-?[\d.]+px/g) || []).map(num);
      if (!c) continue;
      if (/inset/.test(s)) { if ((n[3] || 0) > 0) out.ins = { c, w: n[3] }; }
      else out.ext.push({ c, x: n[0] || 0, y: n[1] || 0, blur: n[2] || 0, spread: n[3] || 0 });
    }
    return out;
  }
  function caixa(el) {
    const r = el.getBoundingClientRect();
    return { x: +(r.left + scrollX - OX).toFixed(2), y: +(r.top + scrollY - OY).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }
  const humano = s => s.replace(/__/g, ' / ').replace(/--/g, ' · ').replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase());
  function nomeDe(el) {
    if (el.dataset && el.dataset.pseudo) {
      const cs = getComputedStyle(el);
      if (/polygon\(50% 0/.test(cs.clipPath)) return 'Hexágono';
      if (el.textContent) return 'Ícone ' + el.textContent;
      return el.dataset.pseudo === 'antes' ? 'Sobreposição' : 'Detalhe';
    }
    const t = el.tagName;
    if (t === 'HEADER' && el.classList.contains('topo')) return 'Topo';
    if (t === 'FOOTER') return 'Rodapé';
    if (t === 'NAV') return el.classList.contains('menu') ? 'Menu' : 'Navegação';
    const cl = [...el.classList].find(c => c !== '__np');
    if (t === 'SECTION') {
      const h = el.querySelector('h1, h2');
      const titulo = h ? h.textContent.trim().replace(/\s+/g, ' ') : '';
      return (cl ? humano(cl) : 'Seção') + (titulo ? ' · ' + titulo.slice(0, 48) : '');
    }
    if (cl) return humano(cl);
    return { MAIN: 'Conteúdo', A: 'Link', P: 'Parágrafo', UL: 'Lista', OL: 'Lista', LI: 'Item', DIV: 'Bloco', SPAN: 'Texto', FIGURE: 'Figura', FORM: 'Formulário', LABEL: 'Rótulo', DL: 'Lista', DT: 'Termo', DD: 'Descrição' }[t] || t.toLowerCase();
  }
  function fonte(cs) {
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const lh = cs.lineHeight === 'normal' ? null : num(cs.lineHeight);
    const ls = cs.letterSpacing === 'normal' ? 0 : num(cs.letterSpacing);
    return {
      ff: fam, fw: +cs.fontWeight || 400, fs: num(cs.fontStretch) || 100, it: cs.fontStyle === 'italic',
      sz: +num(cs.fontSize).toFixed(2), lh: lh && +lh.toFixed(2), ls: +ls.toFixed(3), c: cor(cs.color),
      dec: /underline/.test(cs.textDecorationLine) ? 'U' : (/line-through/.test(cs.textDecorationLine) ? 'S' : ''),
    };
  }
  const transf = (s, tt) => tt === 'uppercase' ? s.toUpperCase() : tt === 'lowercase' ? s.toLowerCase() :
    tt === 'capitalize' ? s.replace(/(^|\s)(\S)/g, (a, b, c) => b + c.toUpperCase()) : s;

  function visual(el, cs) {
    const v = {};
    const bg = cor(cs.backgroundColor);
    const gr = gradientes(cs.backgroundImage);
    v.fill = [];
    if (bg) v.fill.push({ k: 's', c: bg });
    for (const g of gr.reverse()) v.fill.push({ k: 'g', ang: g.ang, stops: g.stops });
    const lados = ['Top', 'Right', 'Bottom', 'Left'].map(l => ({
      w: cs['border' + l + 'Style'] !== 'none' ? num(cs['border' + l + 'Width']) : 0, c: cor(cs['border' + l + 'Color']),
    }));
    const sh = sombras(cs.boxShadow);
    if (lados.some(l => l.w > 0 && l.c)) {
      const c = lados.find(l => l.w > 0 && l.c).c;
      v.st = { c, t: lados[0].c ? lados[0].w : 0, r: lados[1].c ? lados[1].w : 0, b: lados[2].c ? lados[2].w : 0, l: lados[3].c ? lados[3].w : 0 };
    } else if (sh.ins) v.st = { c: sh.ins.c, t: sh.ins.w, r: sh.ins.w, b: sh.ins.w, l: sh.ins.w };
    if (sh.ext.length) v.fx = sh.ext;
    const r = caixa(el);
    v.poly = poligono(cs.clipPath, r.w, r.h);
    v.clip = cs.overflow === 'hidden' || cs.overflow === 'clip' || cs.overflowX === 'hidden';
    v.op = +cs.opacity < 1 ? +cs.opacity : undefined;
    const rad = num(cs.borderTopLeftRadius);
    if (rad > 0) v.rad = Math.min(rad, r.w / 2, r.h / 2);
    v.tem = !!(v.fill.length || v.st || v.fx || v.poly || v.op !== undefined || rad > 0);
    return v;
  }
  function ehFolhaDeTexto(el) {
    let temTexto = false;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) temTexto = true;
    for (const d of el.querySelectorAll('*')) {
      if (d.tagName === 'BR') continue;
      const cs = getComputedStyle(d);
      if (cs.display === 'none') continue;
      if (!INLINE.has(cs.display) || SEM_FILHOS.has(d.tagName) || visual(d, cs).tem || d.dataset.pseudo) return false;
      for (const n of d.childNodes) if (n.nodeType === 3 && n.textContent.trim()) temTexto = true;
    }
    return temTexto;
  }
  function textoDe(el, cs, nos) { // nos: lista de nós de texto/elementos a percorrer
    let s = '', runs = [], fimEspaco = true;
    const base = fonte(cs);
    function add(str, csN) {
      str = transf(str.replace(/\s+/g, ' '), csN.textTransform);
      if (fimEspaco && str.startsWith(' ')) str = str.slice(1);
      if (!str) return;
      const f = fonte(csN);
      runs.push({ a: s.length, b: s.length + str.length, f });
      s += str; fimEspaco = s.endsWith(' ') || s.endsWith('\n');
    }
    (function andar(lista, csPai) {
      for (const n of lista) {
        if (n.nodeType === 3) add(n.textContent, csPai);
        else if (n.nodeType === 1) {
          if (n.tagName === 'BR') { s = s.replace(/ $/, '') + '\n'; fimEspaco = true; continue; }
          const c2 = getComputedStyle(n);
          if (c2.display === 'none') continue;
          andar(n.childNodes, c2);
        }
      }
    })(nos, cs);
    const fimTrim = s.replace(/\s+$/, '');
    runs = runs.map(r => ({ ...r, b: Math.min(r.b, fimTrim.length) })).filter(r => r.b > r.a);
    s = fimTrim;
    if (!s) return null;
    // estilos diferentes da base viram trechos
    const dif = runs.filter(r => JSON.stringify(r.f) !== JSON.stringify(base)).map(r => {
      const o = { a: r.a, b: r.b };
      for (const k of Object.keys(r.f)) if (JSON.stringify(r.f[k]) !== JSON.stringify(base[k])) o[k] = r.f[k];
      return o;
    });
    return { s, base, runs: dif };
  }
  function caixaTexto(rng) {
    const r = rng.getBoundingClientRect();
    const linhas = new Set([...rng.getClientRects()].filter(q => q.width > 0.5).map(q => Math.round(q.top)));
    return { x: +(r.left + scrollX - OX).toFixed(2), y: +(r.top + scrollY - OY).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), linhas: linhas.size };
  }
  function alinhamento(cs) {
    const a = cs.textAlign;
    return a === 'center' ? 'C' : (a === 'right' || a === 'end') ? 'R' : a === 'justify' ? 'J' : 'L';
  }

  function campo(el, cs) {
    const r = caixa(el), v = visual(el, cs);
    const fr = { k: 'f', n: el.tagName === 'SELECT' ? 'Campo · lista' : el.type === 'checkbox' ? 'Caixa de seleção' : el.type === 'file' ? 'Campo · arquivo' : 'Campo', ...r, fill: v.fill, st: v.st, ch: [] };
    if (el.type === 'checkbox') {
      fr.fill = [{ k: 's', c: { r: 1, g: 1, b: 1, a: 1 } }];
      fr.st = { c: { r: .36, g: .38, b: .46, a: 1 }, t: 1.5, r: 1.5, b: 1.5, l: 1.5 }; fr.rad = 2;
      return fr;
    }
    let txt = '', placeholder = false;
    if (el.tagName === 'SELECT') txt = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
    else if (el.type === 'file') txt = 'Escolher arquivo   Nenhum arquivo escolhido';
    else { txt = el.value; if (!txt && el.placeholder) { txt = el.placeholder; placeholder = true; } }
    const f = fonte(cs);
    if (placeholder) f.c = { r: .46, g: .46, b: .5, a: 1 };
    const pl = num(cs.paddingLeft), pt = num(cs.paddingTop);
    if (txt) fr.ch.push({ k: 't', n: txt.slice(0, 40), x: r.x + pl, y: r.y + pt, w: r.w - pl * 2, h: f.lh || f.sz * 1.4, s: txt, base: f, runs: [], al: 'L', ml: el.tagName === 'TEXTAREA' });
    if (el.tagName === 'SELECT') fr.ch.push({ k: 't', n: 'Seta', x: r.x + r.w - pl - 12, y: r.y + pt, w: 12, h: f.sz * 1.4, s: '▾', base: { ...f, c: { r: .36, g: .38, b: .46, a: 1 } }, runs: [], al: 'L' });
    return fr;
  }

  function chaveZ(cs, herdada) {
    if (cs.position === 'static') return herdada;
    const z = cs.zIndex === 'auto' ? 0 : +cs.zIndex;
    if (cs.zIndex === 'auto') return herdada[0] > 1 ? herdada : [1, 0];
    return [z < 0 ? -1 : 2, z];
  }
  function andar(el, pai, zh) {
    zh = zh || [0, 0];
    if (IGNORAR.has(el.tagName)) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const r = caixa(el);
    const zk = chaveZ(cs, zh);
    const t = el.tagName;
    if (t === 'IMG') {
      if (r.w < 1 || r.h < 1) return;
      const src = decodeURIComponent(new URL(el.currentSrc || el.src).pathname);
      imagens.add(src);
      const v = visual(el, cs);
      const filtro = cs.filter || '';
      pai.ch.push({
        z: zk, k: /\.svg$/i.test(src) ? 'v' : 'i', n: el.alt ? el.alt.slice(0, 60) : 'Imagem', ...r, src,
        poly: v.poly, op: v.op, cinza: /grayscale\((1|100%)\)/.test(filtro) || undefined,
        fop: (filtro.match(/opacity\(([\d.]+)/) || [])[1] ? +filtro.match(/opacity\(([\d.]+)/)[1] : undefined,
        pos: cs.objectPosition, fit: cs.objectFit,
      });
      return;
    }
    if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') { if (el.type !== 'hidden') pai.ch.push({ ...campo(el, cs), z: zk }); return; }
    if (t === 'svg' || t === 'SVG') return;
    if (t === 'A' && el.getAttribute('href') && r.w > 0 && r.h > 0) links.push({ href: el.getAttribute('href'), ...r });

    const v = visual(el, cs);
    const secao = el.parentElement && (el.parentElement === raiz || el.parentElement.tagName === 'MAIN' || el.parentElement.tagName === 'BODY') && r.h > 0;
    let no = pai;
    if ((v.tem || v.clip || secao) && r.w > 0 && r.h > 0) {
      no = { z: zk, k: 'f', n: nomeDe(el), ...r, fill: v.fill, st: v.st, fx: v.fx, poly: v.poly, clip: v.clip, op: v.op, rad: v.rad, ch: [] };
      pai.ch.push(no);
    }
    if (ehFolhaDeTexto(el)) {
      const rng = document.createRange(); rng.selectNodeContents(el);
      const cx = caixaTexto(rng);
      const tx = textoDe(el, cs, el.childNodes);
      if (tx && cx.w > 0) no.ch.push({ z: no === pai ? zk : [0, 0], k: 't', n: tx.s.slice(0, 40), ...cx, ...tx, al: alinhamento(cs), ml: cx.linhas > 1 });
      ordenar(no);
      return;
    }
    for (const n of el.childNodes) {
      if (n.nodeType === 3) {
        if (!n.textContent.trim()) continue;
        const rng = document.createRange(); rng.selectNodeContents(n);
        const cx = caixaTexto(rng);
        const tx = textoDe(el, cs, [n]);
        if (tx && cx.w > 0) no.ch.push({ z: no === pai ? zk : [0, 0], k: 't', n: tx.s.slice(0, 40), ...cx, ...tx, al: alinhamento(cs), ml: cx.linhas > 1 });
      } else if (n.nodeType === 1) andar(n, no, no === pai ? zk : [0, 0]);
    }
    ordenar(no);
  }
  function ordenar(no) {
    if (!no.ch) return;
    no.ch.forEach((c, i) => (c._i = i));
    no.ch.sort((a, b) => ((a.z || [0, 0])[0] - (b.z || [0, 0])[0]) || ((a.z || [0, 0])[1] - (b.z || [0, 0])[1]) || (a._i - b._i));
    no.ch.forEach(c => { delete c._i; });
  }

  const tela = { k: 'f', n: opcoes.nome || 'Tela', x: 0, y: 0, w: +base.width.toFixed(2), h: +(opcoes.altura || base.height).toFixed(2), fill: [{ k: 's', c: { r: 1, g: 1, b: 1, a: 1 } }], clip: true, ch: [] };
  const csR = getComputedStyle(raiz);
  const vR = visual(raiz, csR);
  if (vR.fill.length) tela.fill = vR.fill;
  for (const n of raiz.childNodes) if (n.nodeType === 1) andar(n, tela, [0, 0]);
  ordenar(tela);
  (function limpar(n) { delete n.z; (n.ch || []).forEach(limpar); })(tela);
  return { tela, imagens: [...imagens], links };
};
