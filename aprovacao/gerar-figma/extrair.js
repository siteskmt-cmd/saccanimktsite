// Lê as telas do site e gera os dados do plugin do Figma (aprovacao/gerar-figma/.saida/dados.json).
// Uso (na raiz do repositório): node aprovacao/gerar-figma/extrair.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { TELAS } = require('../gerar-pdf/modelo');
const { guiaHtml } = require('../gerar-design/conteudo');

const RAIZ = path.resolve(__dirname, '..', '..');
const SAIDA = path.join(__dirname, '.saida');
const SCRIPT = fs.readFileSync(path.join(__dirname, 'pagina.js'), 'utf8');

async function preparar(p) {
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager')));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    await Promise.all([...document.images].map(i => (i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important} .topo{position:relative!important} *{transition:none!important;animation:none!important}' });
  await p.waitForTimeout(250);
  await p.addScriptTag({ content: SCRIPT });
}

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  const dados = { telas: { desktop: [], celular: [] }, guia: [], links: {}, imagens: {} };
  const todasImagens = new Set();

  for (const [disp, ctxOpts] of [
    ['desktop', { viewport: { width: 1440, height: 900 } }],
    ['celular', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ]) {
    const ctx = await b.newContext({ ...ctxOpts, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    for (const t of TELAS) {
      await p.goto('file://' + path.join(RAIZ, t.arquivo), { waitUntil: 'load' });
      await preparar(p);
      const antes = await p.evaluate(() => document.documentElement.scrollHeight);
      const r = await p.evaluate(({ nome }) => {
        const out = window.__extrairTela(document.body, { nome, altura: document.documentElement.scrollHeight });
        return out;
      }, { nome: `${t.n} ${t.nome}` });
      const depois = await p.evaluate(() => document.documentElement.scrollHeight);
      if (Math.abs(depois - antes) > 2) console.warn(`  aviso: altura mudou em ${t.arquivo} (${antes} → ${depois})`);
      r.tela.arquivo = t.arquivo;
      dados.telas[disp].push(r.tela);
      dados.links[`${disp}:${t.arquivo}`] = r.links;
      r.imagens.forEach(i => todasImagens.add(i));
      console.log(disp, t.n, t.nome, contar(r.tela), 'camadas');
    }
    await ctx.close();
  }

  // guia de estilo (4 pranchas)
  const tmp = path.join(SAIDA, 'guia.html');
  fs.writeFileSync(tmp, guiaHtml());
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await preparar(p);
  const nomes = ['Cores', 'Tipografia', 'Grade e espaçamento', 'Componentes'];
  const n = await p.evaluate(() => document.querySelectorAll('.prancha').length);
  for (let i = 0; i < n; i++) {
    const r = await p.evaluate(({ i, nome }) => window.__extrairTela(document.querySelectorAll('.prancha')[i], { nome }), { i, nome: `${String(i + 1).padStart(2, '0')} ${nomes[i] || 'Prancha'}` });
    dados.guia.push(r.tela);
    r.imagens.forEach(x => todasImagens.add(x));
  }
  await ctx.close();
  await b.close();
  fs.rmSync(tmp);

  // imagens em base64 (uma vez cada)
  for (const arq of todasImagens) {
    const rel = path.relative(RAIZ, arq);
    const buf = fs.readFileSync(arq);
    dados.imagens[arq] = { rel, tipo: path.extname(arq).slice(1).toLowerCase(), b64: /\.svg$/i.test(arq) ? null : buf.toString('base64'), svg: /\.svg$/i.test(arq) ? buf.toString('utf8') : null };
  }
  fs.writeFileSync(path.join(SAIDA, 'dados.json'), JSON.stringify(dados));
  console.log('imagens:', todasImagens.size, '· dados:', (fs.statSync(path.join(SAIDA, 'dados.json')).size / 1e6).toFixed(1), 'MB');
})();

function contar(n) { return 1 + (n.ch || []).reduce((s, c) => s + contar(c), 0); }
