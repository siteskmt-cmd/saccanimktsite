// Gera o pacote de design para o programador (telas, guia de estilo, assets e especificações).
// Uso (na raiz do repositório):  node aprovacao/gerar-design/gerar.js <pasta-de-saida>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { TELAS } = require('../gerar-pdf/modelo');
const { guiaHtml, specHtml } = require('./conteudo');

const RAIZ = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '.saida'));
const NOME = t => `${t.n}_${t.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/_$/, '')}`;

async function abrir(p, arquivo) {
  await p.goto('file://' + path.join(RAIZ, arquivo), { waitUntil: 'load' });
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager')));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    await Promise.all([...document.images].map(i => (i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important} .topo{position:relative!important}' });
  await p.waitForTimeout(300);
}

async function pdfDaPagina(p, largura, destino) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.emulateMedia({ media: 'screen' });
  await p.pdf({ path: destino, width: largura + 'px', height: h + 'px', printBackground: true, pageRanges: '1' });
}

function juntarPdfs(arquivos, nomes, destino) {
  const py = `
import sys, json, pypdf
arqs, nomes, dest = json.loads(sys.argv[1]), json.loads(sys.argv[2]), sys.argv[3]
w = pypdf.PdfWriter()
for a, n in zip(arqs, nomes):
    r = pypdf.PdfReader(a)
    i = len(w.pages)
    w.append(r)
    w.add_outline_item(n, i)
w.add_metadata({'/Title': 'SMRC Engenharia - Telas do site'})
import hashlib
from pypdf.generic import NameObject
vistos = {}
def dedup(res, pilha=0):
    if pilha > 8 or res is None: return
    res = res.get_object()
    xo = res.get('/XObject')
    if xo is None: return
    xo = xo.get_object()
    for k in list(xo.keys()):
        ref = xo.raw_get(k)
        ob = ref.get_object()
        if ob.get('/Subtype') == '/Image':
            chave = hashlib.sha1(ob.get_data() if ob.get('/Filter') is None else ob._data).hexdigest() + str(ob.get('/SMask') is not None)
            if chave in vistos: xo[NameObject(k)] = vistos[chave]
            else: vistos[chave] = ref
        elif ob.get('/Subtype') == '/Form':
            dedup(ob.get('/Resources'), pilha + 1)
for pg in w.pages:
    dedup(pg.get('/Resources'))
w.compress_identical_objects(remove_identicals=False, remove_unreferenced=True)
w.write(dest)`;
  execFileSync('python3', ['-I', '-c', py, JSON.stringify(arquivos), JSON.stringify(nomes), destino]);
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  const d = sub => { const x = path.join(OUT, sub); fs.mkdirSync(x, { recursive: true }); return x; };
  const telasDesk = d('01_Telas/Desktop_1440'), telasCel = d('01_Telas/Celular_390'), tmp = d('.tmp');
  const b = await chromium.launch();

  for (const [larg, pasta, ctxOpts, sufixo] of [
    [1440, telasDesk, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, 'desktop'],
    [390, telasCel, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true }, 'celular'],
  ]) {
    const ctx = await b.newContext(ctxOpts);
    const p = await ctx.newPage();
    const pdfs = [];
    for (const t of TELAS) {
      await abrir(p, t.arquivo);
      await p.screenshot({ path: path.join(pasta, NOME(t) + '.jpg'), fullPage: true, type: 'jpeg', quality: 86 });
      const pdf = path.join(tmp, `${sufixo}-${t.n}.pdf`);
      await pdfDaPagina(p, larg, pdf);
      pdfs.push(pdf);
      console.log(sufixo, t.n, t.nome);
    }
    juntarPdfs(pdfs, TELAS.map(t => `${t.n} ${t.nome}`), path.join(OUT, '01_Telas', `SMRC_Telas_${sufixo === 'desktop' ? 'Desktop_1440' : 'Celular_390'}_vetorial.pdf`));
    await ctx.close();
  }

  // guia de estilo e especificações
  for (const [html, pasta, nome] of [
    [guiaHtml(), '02_Guia_de_Estilo', 'SMRC_Guia_de_Estilo'],
    [specHtml(), '04_Especificacoes', 'SMRC_Especificacoes_Desenvolvimento'],
  ]) {
    const arq = path.join(tmp, nome + '.html');
    fs.writeFileSync(arq, html);
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto('file://' + arq, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.pdf({ path: path.join(d(pasta), nome + '.pdf'), printBackground: true, preferCSSPageSize: true });
    if (nome.includes('Guia')) {
      const els = await p.$$('.prancha');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(OUT, pasta, `${nome}_${String(i + 1).padStart(2, '0')}.png`) });
    }
    await ctx.close();
  }
  await b.close();

  // assets
  const A = d('03_Assets');
  fs.cpSync(path.join(RAIZ, 'assets/img'), path.join(A, 'Imagens'), { recursive: true });
  fs.cpSync(path.join(RAIZ, 'assets/logo'), path.join(A, 'Logos'), { recursive: true });
  const I = d('03_Assets/Icones');
  fs.writeFileSync(path.join(I, 'hexagono.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14"><polygon points="6,0 12,3.5 12,10.5 6,14 0,10.5 0,3.5" fill="#2B6C80"/></svg>\n');
  fs.writeFileSync(path.join(I, 'botao-canto-cortado.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48"><polygon points="0,0 182,0 200,18 200,48 0,48" fill="#2B6C80"/></svg>\n');
  fs.writeFileSync(path.join(I, 'seta.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="#2B6C80" stroke-width="1.8"/></svg>\n');

  // protótipo navegável (PDF aprovado)
  fs.copyFileSync(path.join(RAIZ, 'aprovacao/SMRC_Layout_Site_Aprovacao.pdf'), path.join(OUT, '00_Prototipo_Navegavel_SMRC.pdf'));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Pacote em', OUT);
})();
