// Captura as telas do site e monta o PDF clicável de aprovação.
// Uso (na raiz do repositório):  node aprovacao/gerar-pdf/capturar.js
// Requer Playwright com Chromium e acesso ao Google Fonts.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const { montarHtml, TELAS, CELULAR } = require('./modelo');

const RAIZ = path.resolve(__dirname, '..', '..');
const TMP = path.join(__dirname, '.tmp');
const SAIDA = path.join(RAIZ, 'aprovacao', 'SMRC_Layout_Site_Aprovacao.pdf');
const LARGURA = 1440;

async function prepararPagina(p, arquivo) {
  await p.goto('file://' + path.join(RAIZ, arquivo), { waitUntil: 'load' });
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager')));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    await Promise.all([...document.images].map(i => (i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  });
  // o topo fixo (sticky) não deve aparecer repetido na captura de página inteira
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important} .topo{position:relative!important}' });
  await p.waitForTimeout(300);
}

(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch();

  // telas no computador
  const ctx = await b.newContext({ viewport: { width: LARGURA, height: 900 }, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  for (const t of TELAS) {
    await prepararPagina(p, t.arquivo);
    t.img = `tela-${t.n}.jpg`;
    await p.screenshot({ path: path.join(TMP, t.img), fullPage: true, type: 'jpeg', quality: 62 });
    t.altura = await p.evaluate(() => document.documentElement.scrollHeight);
    t.links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => {
      const r = a.getBoundingClientRect();
      return { href: a.getAttribute('href'), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    }).filter(l => l.w > 0 && l.h > 0));
    t.ids = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[id]')]
      .map(e => [e.id, e.getBoundingClientRect().top + scrollY])));
    // miniatura (topo da página) para o sumário
    t.mini = `mini-${t.n}.jpg`;
    await p.screenshot({ path: path.join(TMP, t.mini), type: 'jpeg', quality: 60, scale: 'css', clip: { x: 0, y: 0, width: LARGURA, height: 1100 } });
    console.log('tela', t.n, t.arquivo, t.altura + 'px', t.links.length + ' links');
  }
  await ctx.close();

  // versão celular
  const cel = await b.newContext({ ...devices['iPhone 13'] });
  const pc = await cel.newPage();
  for (const c of CELULAR) {
    await prepararPagina(pc, c.arquivo);
    c.img = `cel-${c.arquivo.replace('.html', '')}.jpg`;
    await pc.screenshot({ path: path.join(TMP, c.img), type: 'jpeg', quality: 78 });
  }
  await cel.close();

  // monta o documento e imprime em PDF
  const html = montarHtml(TELAS, CELULAR);
  const doc = path.join(TMP, 'aprovacao.html');
  fs.writeFileSync(doc, html);
  const ctxPdf = await b.newContext({ viewport: { width: LARGURA, height: 900 } });
  const pp = await ctxPdf.newPage();
  await pp.goto('file://' + doc, { waitUntil: 'load' });
  await pp.evaluate(() => document.fonts.ready);
  await pp.waitForTimeout(500);
  await pp.pdf({ path: SAIDA, printBackground: true, preferCSSPageSize: true });
  await b.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('PDF:', SAIDA);
})();
