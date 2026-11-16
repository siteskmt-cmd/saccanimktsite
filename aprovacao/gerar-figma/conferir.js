// Conferência: redesenha telas a partir de dados.json (como o plugin fará no Figma) e tira prints.
// Uso: node aprovacao/gerar-figma/conferir.js desktop 1 [saida.png]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const dados = JSON.parse(fs.readFileSync(path.join(__dirname, '.saida', 'dados.json'), 'utf8'));
const [disp = 'desktop', idx = '1', out = path.join(__dirname, '.saida', 'conferir.png')] = process.argv.slice(2);
const tela = disp === 'guia' ? dados.guia[+idx - 1] : dados.telas[disp][+idx - 1];

const rgba = c => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${c.a})`;
const FW = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
function fill(fs) {
  const camadas = (fs || []).slice().reverse().map(f => f.k === 's' ? `linear-gradient(${rgba(f.c)},${rgba(f.c)})` :
    `linear-gradient(${f.ang}deg,${f.stops.map(s => rgba(s.c) + ' ' + (s.p * 100) + '%').join(',')})`);
  return camadas.length ? `background:${camadas.join(',')};` : '';
}
function fonte(f) {
  return `font-family:'${f.ff}';font-weight:${f.fw};font-stretch:${f.fs}%;font-size:${f.sz}px;${f.lh ? `line-height:${f.lh}px;` : ''}letter-spacing:${f.ls}px;color:${f.c ? rgba(f.c) : '#000'};${f.dec === 'U' ? 'text-decoration:underline;' : ''}`;
}
function html(n, ox, oy) {
  const pos = `position:absolute;left:${n.x - ox}px;top:${n.y - oy}px;`;
  if (n.k === 'f') {
    const st = n.st ? `box-shadow:${['t', 'r', 'b', 'l'].map((s, i) => n.st[s] ? `inset ${[0, -n.st[s], 0, n.st[s]][i]}px ${[n.st[s], 0, -n.st[s], 0][i]}px 0 0 ${rgba(n.st.c)}` : '').filter(Boolean).join(',')};` : '';
    const cp = n.poly ? `clip-path:polygon(${n.poly.map(p => p[0] + 'px ' + p[1] + 'px').join(',')});` : '';
    return `<div style="${pos}width:${n.w}px;height:${n.h}px;${fill(n.fill)}${st}${cp}${n.clip ? 'overflow:hidden;' : ''}${n.op !== undefined ? 'opacity:' + n.op + ';' : ''}${n.rad ? 'border-radius:' + n.rad + 'px;' : ''}">${(n.ch || []).map(c => html(c, n.x, n.y)).join('')}</div>`;
  }
  if (n.k === 't') {
    let s = '';
    const runs = n.runs || [];
    for (let i = 0; i < n.s.length; i++) {
      const r = runs.find(r => i >= r.a && i < r.b);
      const ch = n.s[i] === '\n' ? '<br>' : n.s[i].replace(/&/, '&amp;').replace(/</, '&lt;');
      s += r ? `<span style="${fonte({ ...n.base, ...r })}">${ch}</span>` : ch;
    }
    const w = n.ml ? `width:${n.w + 2}px;` : 'white-space:nowrap;';
    return `<div style="${pos}${w}${fonte(n.base)}text-align:${{ L: 'left', C: 'center', R: 'right', J: 'justify' }[n.al]}">${s}</div>`;
  }
  if (n.k === 'i' || n.k === 'v') {
    const cp = n.poly ? `clip-path:polygon(${n.poly.map(p => p[0] + 'px ' + p[1] + 'px').join(',')});` : '';
    return `<img src="file://${n.src}" style="${pos}width:${n.w}px;height:${n.h}px;object-fit:${n.k === 'v' ? 'contain' : 'cover'};${cp}${n.cinza ? 'filter:grayscale(1);' : ''}${n.op !== undefined ? 'opacity:' + n.op : ''}">`;
  }
  return '';
}
(async () => {
  const doc = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,600..900&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=block"><body style="margin:0">${html(tela, 0, 0)}</body>`;
  const arq = path.join(__dirname, '.saida', 'conferir.html');
  fs.writeFileSync(arq, doc);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Math.ceil(tela.w), height: 900 } });
  await p.goto('file://' + arq, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
  console.log('ok', out);
})();
