// Conteúdo do Guia de Estilo e das Especificações de desenvolvimento.
const path = require('path');
const RAIZ = path.resolve(__dirname, '..', '..');
const url = rel => 'file://' + path.join(RAIZ, rel);
const FONTES = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,600..900&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=block';

const CORES = [
  ['Azul-noite', '#2D2F48', '45, 47, 72', 'Cor principal da marca. Faixas escuras, títulos, menu.'],
  ['Azul-noite profundo', '#23253A', '35, 37, 58', 'Rodapé e sobreposição escura das fotos.'],
  ['Petróleo', '#2B6C80', '43, 108, 128', 'Acento: botões, rótulos, links e marcadores.'],
  ['Petróleo claro', '#7FB4C4', '127, 180, 196', 'Acento sobre fundo escuro.'],
  ['Concreto', '#F1F2F4', '241, 242, 244', 'Fundo das seções claras e dos formulários.'],
  ['Branco', '#FFFFFF', '255, 255, 255', 'Fundo principal e cards.'],
  ['Tinta', '#1D1F30', '29, 31, 48', 'Texto principal.'],
  ['Cinza', '#5C6075', '92, 96, 117', 'Texto secundário e legendas.'],
  ['Linha', '#D9DBE2', '217, 219, 226', 'Divisórias, bordas de campos e cards.'],
];

const TIPOS = [
  ['Título de página (H1)', 'Archivo · ExtraBold 800 · largura 125%', '62 px / 34 px', '1.08', 'Da fundação', 'font:800 62px/1.08 Archivo;font-stretch:125%;color:#2D2F48;white-space:nowrap'],
  ['Título de seção (H2)', 'Archivo · ExtraBold 800 · largura 125%', '38 px / 26 px', '1.08', 'O que fazemos', 'font:800 38px/1.08 Archivo;font-stretch:125%;color:#2D2F48;white-space:nowrap'],
  ['Título de card (H3)', 'Archivo · Bold 700 · largura 112%', '20 px / 20 px', '1.08', 'Concreto em geral', 'font:700 20px/1.08 Archivo;font-stretch:112%;color:#2D2F48'],
  ['Texto de apoio (lead)', 'Figtree · Regular 400', '20 px / 20 px', '1.6', 'Obras civis e manutenção de área fabril com equipe própria.', 'font:400 20px/1.6 Figtree;color:#5C6075'],
  ['Texto corrido', 'Figtree · Regular 400', '17 px / 17 px', '1.6', 'Atuamos dentro de plantas industriais em funcionamento.', 'font:400 16.8px/1.6 Figtree;color:#1D1F30'],
  ['Texto pequeno', 'Figtree · Regular 400', '14,4 px / 14,4 px', '1.6', 'Armação, formas e concretagem de lajes, paredes, bases e pisos.', 'font:400 14.4px/1.6 Figtree;color:#5C6075'],
  ['Botão e menu', 'Figtree · Bold 700 / SemiBold 600', '14,4 px', '1', 'Solicitar orçamento', 'font:700 14.4px/1 Figtree;color:#2B6C80;letter-spacing:.02em'],
  ['Rótulo (olho)', 'IBM Plex Mono · Medium 500 · caixa alta · espaçamento 14%', '12,5 px', '1', 'OBRAS RECENTES', "font:500 12.5px/1 'IBM Plex Mono';letter-spacing:.14em;color:#2B6C80"],
];

const base = `
<link rel="stylesheet" href="${FONTES}">
<link rel="stylesheet" href="${url('assets/css/style.css')}">
<style>
@page { size: 1440px 1080px; margin: 0; }
html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.prancha { position: relative; width: 1440px; height: 1080px; overflow: hidden; break-after: page; padding: 64px 88px; background: #fff; }
.g-topo { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; margin-bottom: 40px; border-bottom: 3px solid var(--noite); }
.g-topo img { height: 40px; width: auto; }
.g-topo span { font: 500 12px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--cinza); }
.g-tit { font: 800 44px/1.05 Archivo, sans-serif; font-stretch: 125%; color: var(--noite); margin-bottom: 8px; }
.g-sub { color: var(--cinza); max-width: 80ch; margin-bottom: 36px; }
.g-h { font: 700 18px/1.2 Archivo, sans-serif; font-stretch: 112%; color: var(--noite); margin: 28px 0 14px; }
.g-nota { font: 500 11px/1.4 'IBM Plex Mono', monospace; letter-spacing: .06em; color: var(--cinza); text-transform: uppercase; margin-top: 10px; }
.g-cores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.g-cor { display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center; }
.g-cor i { display: block; height: 96px; border: 1px solid var(--linha); }
.g-cor b { display: block; font: 700 17px/1.2 Archivo, sans-serif; font-stretch: 112%; color: var(--noite); }
.g-cor code { display: block; margin-top: 4px; font: 500 13px/1.5 'IBM Plex Mono', monospace; color: var(--tinta); }
.g-cor small { display: block; margin-top: 4px; font-size: 13px; line-height: 1.4; color: var(--cinza); }
.g-tipos { width: 100%; border-collapse: collapse; }
.g-tipos td, .g-tipos th { text-align: left; vertical-align: middle; padding: 10px 14px 10px 0; border-bottom: 1px solid var(--linha); font-size: 13px; color: var(--cinza); }
.g-tipos th { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--cinza); border-bottom: 2px solid var(--noite); }
.g-tipos td:first-child { font-weight: 700; color: var(--noite); width: 190px; }
.g-tipos td.ex { width: 560px; }
.g-fam { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-bottom: 18px; }
.g-fam div { background: var(--concreto); padding: 22px 24px; }
.g-fam p:first-child { font-size: 40px; line-height: 1; color: var(--noite); margin-bottom: 10px; }
.g-fam p { font-size: 13px; color: var(--cinza); }
.g-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.g-tab { width: 100%; border-collapse: collapse; font-size: 14px; }
.g-tab td, .g-tab th { text-align: left; padding: 10px 10px 10px 0; border-bottom: 1px solid var(--linha); vertical-align: top; }
.g-tab th { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--cinza); border-bottom: 2px solid var(--noite); }
.g-tab td:first-child { font-weight: 600; color: var(--noite); white-space: nowrap; }
.g-demo-grade { position: relative; height: 210px; background: var(--concreto); border: 1px solid var(--linha); }
.g-demo-grade .ct { position: absolute; top: 20px; bottom: 20px; left: 60px; right: 60px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.g-demo-grade .ct i { background: rgba(43,108,128,.18); border: 1px dashed var(--petroleo); }
.g-demo-grade span { position: absolute; font: 500 11px 'IBM Plex Mono', monospace; color: var(--petroleo); }
.g-comp { display: grid; gap: 18px; align-content: start; }
.g-linha { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.g-escuro { background: var(--noite); padding: 22px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.g-rot { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--cinza); }
</style>`;

const topo = rot => `<div class="g-topo"><img src="${url('assets/logo/Saccani_logo_colorida.svg')}" alt=""><span>SMRC Engenharia · Guia de estilo do site · ${rot}</span></div>`;

function guiaHtml() {
  const cores = CORES.map(([n, hex, rgb, uso]) => `<div class="g-cor"><i style="background:${hex}"></i><div><b>${n}</b><code>${hex} · RGB ${rgb}</code><small>${uso}</small></div></div>`).join('');
  const tipos = TIPOS.map(([n, fam, tam, lh, ex, st]) => `<tr><td>${n}</td><td>${fam}</td><td>${tam}</td><td>${lh}</td><td class="ex"><span style="${st}">${ex}</span></td></tr>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>SMRC Engenharia · Guia de estilo</title>${base}</head><body>

<section class="prancha">
  ${topo('01 Cores')}
  <h1 class="g-tit">Cores</h1>
  <p class="g-sub">Paleta da marca. O site tem um único tema claro, com faixas escuras em azul-noite. Use as cores sempre por estes valores.</p>
  <div class="g-cores">${cores}</div>
  <h2 class="g-h">Combinações</h2>
  <div class="g-linha">
    <div style="background:#2D2F48;color:#fff;padding:22px 26px;width:300px"><b style="font:800 20px Archivo;font-stretch:125%">Texto branco</b><br><span style="color:#7FB4C4;font:500 12px 'IBM Plex Mono';letter-spacing:.14em">RÓTULO PETRÓLEO CLARO</span></div>
    <div style="background:#F1F2F4;padding:22px 26px;width:300px"><b style="font:800 20px Archivo;font-stretch:125%;color:#2D2F48">Título azul-noite</b><br><span style="color:#5C6075">Texto cinza sobre concreto</span></div>
    <div style="background:#2B6C80;color:#fff;padding:22px 26px;width:300px"><b style="font:800 20px Archivo;font-stretch:125%">Faixa de chamada</b><br><span>Botão branco com texto azul-noite</span></div>
  </div>
  <p class="g-nota">Fotos com sobreposição: degradê de azul-noite profundo, de 95% (esquerda) a 45% (direita) de opacidade.</p>
</section>

<section class="prancha">
  ${topo('02 Tipografia')}
  <h1 class="g-tit">Tipografia</h1>
  <p class="g-sub">Três famílias do Google Fonts. Tamanhos para computador / celular. Títulos usam a largura expandida da Archivo, como no logotipo.</p>
  <div class="g-fam">
    <div><p style="font:800 40px Archivo;font-stretch:125%">Archivo</p><p>Títulos · ExtraBold 800 e Bold 700 · largura 112% a 125%</p></div>
    <div><p style="font:600 40px Figtree">Figtree</p><p>Textos, menu e botões · Regular 400, SemiBold 600, Bold 700</p></div>
    <div><p style="font:500 34px 'IBM Plex Mono'">IBM Plex Mono</p><p>Rótulos, números e datas · Medium 500 · caixa alta</p></div>
  </div>
  <table class="g-tipos"><tr><th>Estilo</th><th>Fonte</th><th>Tamanho</th><th>Entrelinha</th><th>Exemplo</th></tr>${tipos}</table>
  <p class="g-nota">Os títulos H1 e H2 crescem de forma fluida entre a largura do celular e 1440 px.</p>
</section>

<section class="prancha">
  ${topo('03 Grade e espaçamento')}
  <h1 class="g-tit">Grade e espaçamento</h1>
  <p class="g-sub">Telas desenhadas em 1440 px (computador) e 390 px (celular). Conteúdo centralizado com largura máxima de 1200 px.</p>
  <div class="g-demo-grade"><div class="ct"><i></i><i></i><i></i><i></i></div><span style="left:60px;top:4px">container 1200 px · margem lateral mínima 20 px</span><span style="right:60px;bottom:3px">4 colunas · espaço 24 px</span></div>
  <div class="g-grid2" style="margin-top:32px">
    <div>
      <h2 class="g-h">Medidas</h2>
      <table class="g-tab">
        <tr><th>Elemento</th><th>Computador</th><th>Celular</th></tr>
        <tr><td>Container</td><td>1200 px máx.</td><td>largura total − 2 × 20 px</td></tr>
        <tr><td>Espaço vertical das seções</td><td>112 px (topo e base)</td><td>64 px</td></tr>
        <tr><td>Topo (menu)</td><td>76 px de altura, fixo ao rolar</td><td>76 px, menu em gaveta</td></tr>
        <tr><td>Grade de serviços</td><td>4 colunas · 24 px · linhas 36 px</td><td>1 coluna</td></tr>
        <tr><td>Grade de obras</td><td>2 ou 3 colunas · 24 px</td><td>1 coluna</td></tr>
        <tr><td>Detalhe (serviço/obra)</td><td>coluna lateral 280 px + conteúdo</td><td>1 coluna, lateral vai para o fim</td></tr>
        <tr><td>Proporção das fotos</td><td>cards 4:3 · obras 16:10 · destaque 16:9</td><td>igual</td></tr>
      </table>
    </div>
    <div>
      <h2 class="g-h">Pontos de quebra</h2>
      <table class="g-tab">
        <tr><th>Largura</th><th>O que muda</th></tr>
        <tr><td>até 1080 px</td><td>Menu passa a abrir pelo botão (gaveta).</td></tr>
        <tr><td>até 980 px</td><td>Blocos de duas colunas viram uma; grades de 3–4 colunas viram 2; etapas em 2 colunas.</td></tr>
        <tr><td>até 640 px</td><td>Tudo em 1 coluna; formulários em 1 coluna; galeria em 2 colunas.</td></tr>
      </table>
      <h2 class="g-h">Detalhes de forma</h2>
      <table class="g-tab">
        <tr><td>Hexágono</td><td>Marcador de rótulos, listas e etapas (do símbolo da marca). 12 × 14 px nos rótulos.</td></tr>
        <tr><td>Canto cortado</td><td>Botão principal e fotos de destaque: canto superior direito (botão, 18 px) ou inferior direito (fotos, 48 px) cortado em 45°.</td></tr>
        <tr><td>Bordas</td><td>Sem arredondamento. Linhas de 1 px (#D9DBE2) e réguas de 3 px (#2D2F48).</td></tr>
      </table>
    </div>
  </div>
</section>

<section class="prancha">
  ${topo('04 Componentes')}
  <h1 class="g-tit">Componentes</h1>
  <p class="g-sub">Botões, rótulos, cards e campos. No passar do mouse: botões escurecem para azul-noite, a seta dos links anda 4 px, a foto dos cards de serviço amplia 2% e o título dos cards de obra fica petróleo.</p>
  <div class="g-grid2">
    <div class="g-comp">
      <p class="g-rot">Botões</p>
      <div class="g-linha"><a class="btn">Solicitar orçamento</a><a class="btn btn--sm">Solicitar orçamento</a><a class="link-seta">Todos os serviços</a></div>
      <div class="g-escuro"><a class="btn btn--claro">Solicitar orçamento</a><a class="btn btn--ghost">Conheça os serviços</a></div>
      <p class="g-nota">Botão: 15 × 27 px de respiro · Figtree Bold 14,4 px · canto cortado 18 px</p>
      <p class="g-rot" style="margin-top:14px">Rótulo de seção</p>
      <p class="olho" style="margin:0">Obras recentes</p>
      <p class="g-rot" style="margin-top:14px">Lista com marcador</p>
      <ul class="checks" style="max-width:520px"><li>Armação de aço</li><li>Bases de equipamentos</li></ul>
      <p class="g-rot" style="margin-top:14px">Campos de formulário</p>
      <div class="form" style="max-width:600px;padding:24px">
        <div class="campo campo--meio"><label>Nome</label><input value="Maria Souza"></div>
        <div class="campo campo--meio"><label>E-mail</label><input placeholder="nome@empresa.com.br"></div>
      </div>
    </div>
    <div class="g-comp">
      <p class="g-rot">Card de serviço (sobre azul-noite)</p>
      <div class="sec--escuro" style="padding:26px"><div class="svc-grade" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        <a class="svc"><img src="${url('assets/img/servicos/concreto-tanque-aereo.jpg')}" alt=""><span class="svc__grupo">Estrutura</span><h3>Concreto em geral</h3><p>Armação, formas e concretagem de lajes, paredes, bases e pisos.</p><span class="svc__mais">Ver serviço</span></a>
        <a class="svc"><img src="${url('assets/img/servicos/pintura-fachada.jpg')}" alt=""><span class="svc__grupo">Acabamentos</span><h3>Pintura</h3><p>Selador, emassamento, látex, acrílica e textura.</p><span class="svc__mais">Ver serviço</span></a>
      </div></div>
      <p class="g-rot">Card de obra (sobre concreto)</p>
      <div style="background:var(--concreto);padding:26px"><div class="obras-grade" style="grid-template-columns:minmax(0,1fr)">
        <a class="obra-card" style="grid-template-columns:240px 1fr;grid-template-rows:none"><img src="${url('assets/img/obras/arauco-inocencia/tanque-laje-01.jpg')}" alt="" style="height:100%"><div class="obra-card__txt"><p class="loc">Arauco · Inocência · MS</p><h3>Laje e piso do tanque de água desmineralizada</h3><p class="obra__tags"><span>Laje em concreto armado</span><span>Papel e celulose</span></p></div></a>
      </div></div>
    </div>
  </div>
</section>
</body></html>`;
}

function specHtml() {
  const pag = [
    ['Início', 'Topo com foto e chamada; números da empresa; a empresa; serviços (8 cards); inspeção de qualidade; obras recentes; missão, visão e valores; clientes e parceiros; carreiras; faixa de chamada.'],
    ['Serviços', 'Os 8 serviços em cards, chamada da inspeção de qualidade, "Como trabalhamos" (4 etapas) e setores atendidos.'],
    ['Detalhe do serviço (8 páginas)', 'Concreto em geral, Vedação em geral, Acabamento, Pintura, Infraestrutura, Reparos Especializados, Juntas e Outros serviços. Mesmo modelo: topo com foto, menu lateral dos serviços, visão geral, o que executamos, fotos, processo e outros serviços.'],
    ['Inspeção de qualidade', 'Serviço para gerenciadoras de obras: o problema, as 4 etapas, como funciona, telas do aplicativo, exemplo, entregas e indicadores, o serviço no contrato, diferenciais e obra-piloto.'],
    ['Obras', 'Lista de obras com filtro por setor (Todas, Papel e celulose, Química, Alimentos e bebidas).'],
    ['Detalhe da obra', 'Ficha técnica na lateral, texto sobre a obra, escopo, galeria ou frentes de serviço com fotos e "Outras obras". Exemplos: Arauco e Heineken.'],
    ['Carreiras', 'Por que trabalhar na empresa, áreas de atuação, vagas abertas e banco de talentos com envio de currículo.'],
    ['Contato', 'Telefone/WhatsApp, e-mail, sede, horário, mapa e formulário de orçamento.'],
  ].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>SMRC Engenharia · Especificações para desenvolvimento</title>
<link rel="stylesheet" href="${FONTES}">
<style>
@page { size: A4; margin: 18mm 17mm 20mm; }
body { font: 10.5pt/1.55 Figtree, sans-serif; color: #1D1F30; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1 { font: 800 26pt/1.05 Archivo, sans-serif; font-stretch: 125%; color: #2D2F48; margin: 0 0 6pt; }
h2 { font: 800 14pt/1.2 Archivo, sans-serif; font-stretch: 112%; color: #2D2F48; margin: 22pt 0 8pt; padding-top: 8pt; border-top: 2.5pt solid #2D2F48; break-after: avoid; }
h3 { font: 700 11pt/1.3 Archivo, sans-serif; font-stretch: 112%; color: #2D2F48; margin: 12pt 0 4pt; break-after: avoid; }
p { margin: 0 0 6pt; } ul { margin: 0 0 8pt; padding-left: 15pt; } li { margin-bottom: 3pt; }
table { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 9.5pt; break-inside: auto; }
th, td { text-align: left; vertical-align: top; padding: 5pt 8pt 5pt 0; border-bottom: .75pt solid #D9DBE2; }
th { font: 500 7.5pt 'IBM Plex Mono', monospace; letter-spacing: .08em; text-transform: uppercase; color: #5C6075; border-bottom: 1.5pt solid #2D2F48; }
td:first-child { font-weight: 600; color: #2D2F48; width: 30%; }
.olho { font: 500 8pt 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #2B6C80; margin-bottom: 6pt; }
.capa-logo { height: 34pt; margin-bottom: 26pt; }
.lead { font-size: 12pt; color: #5C6075; max-width: 52ch; }
.aviso { background: #F1F2F4; border-left: 3pt solid #2B6C80; padding: 8pt 12pt; margin: 8pt 0 12pt; }
.pend { color: #A2462E; font-weight: 600; }
</style></head><body>
<img class="capa-logo" src="${url('assets/logo/Saccani_logo_colorida.svg')}" alt="">
<p class="olho">Site · layout aprovado em 13/11/2026</p>
<h1>Especificações para desenvolvimento</h1>
<p class="lead">O que cada parte do site precisa fazer, para programar a partir das telas e do guia de estilo.</p>

<div class="aviso"><b>Arquivos do pacote:</b> 00 Protótipo navegável (PDF clicável) · 01 Telas (imagens JPG em 1440 px e 390 px e PDF vetorial com textos selecionáveis) · 02 Guia de estilo · 03 Assets (imagens, logos e ícones) · 04 Este documento.</div>

<h2>1. Regra de marca</h2>
<ul>
  <li>Em todo texto do site, o nome é <b>SMRC Engenharia</b>, com <b>SMRC sempre em caixa alta</b>.</li>
  <li>Logos, imagens e ícone da aba ficam como estão nos assets.</li>
  <li>Dados marcados <span class="pend">em vermelho</span> nas telas ainda serão confirmados pelo cliente (lista no item 9). Não publicar em vermelho.</li>
</ul>

<h2>2. Páginas e navegação</h2>
<p>Menu principal: Início, Serviços, Qualidade, Obras, Carreiras, Contato e o botão "Solicitar orçamento" (vai para Contato). O rodapé repete a navegação, os contatos e as redes, e é igual em todas as páginas.</p>
<table><tr><th>Página</th><th>Conteúdo</th></tr>${pag}</table>
<p>Os links entre as páginas estão no protótipo navegável: clique em menus, cards e botões para ver o destino de cada um.</p>

<h2>3. Comportamento</h2>
<ul>
  <li><b>Topo:</b> fica fixo ao rolar a página. No celular e até 1080 px, o menu abre em gaveta pelo botão de três linhas.</li>
  <li><b>Item ativo do menu:</b> sublinhado em petróleo.</li>
  <li><b>Passar o mouse:</b>
    <ul>
      <li>botões escurecem para azul-noite;</li>
      <li>a seta dos links anda 4 px;</li>
      <li>a foto do card de serviço amplia 2%;</li>
      <li>o título do card de obra fica petróleo;</li>
      <li>os logos de parceiros passam de cinza para colorido.</li>
    </ul>
  </li>
  <li><b>Rolagem suave</b> para âncoras, como "Como funciona" na página de inspeção e as frentes da obra Arauco.</li>
  <li><b>WhatsApp:</b> botões abrem wa.me/5514981980011. Telefone clicável. E-mail abre o programa de e-mail.</li>
  <li><b>Acessibilidade:</b> texto alternativo em todas as fotos, rótulo em todos os campos, foco visível em petróleo e animações desligadas para quem prefere menos movimento.</li>
</ul>

<h2>4. Formulários</h2>
<h3>Solicitar orçamento (página Contato)</h3>
<table><tr><th>Campo</th><th>Tipo</th></tr>
<tr><td>Nome *</td><td>texto</td></tr><tr><td>Empresa / planta</td><td>texto</td></tr><tr><td>Telefone</td><td>telefone</td></tr><tr><td>E-mail *</td><td>e-mail</td></tr>
<tr><td>Serviço</td><td>lista: os 8 serviços, Inspeção de qualidade, Manutenção de área fabril, Outro</td></tr><tr><td>Conte sobre a demanda</td><td>texto longo</td></tr></table>
<p>Enviar para: <b>samarc.contato@gmail.com</b> <span class="pend">(confirmar se é o mesmo do site)</span>.</p>
<h3>Banco de talentos (página Carreiras)</h3>
<table><tr><th>Campo</th><th>Tipo</th></tr>
<tr><td>Nome completo *</td><td>texto</td></tr><tr><td>Telefone / WhatsApp *</td><td>telefone</td></tr><tr><td>E-mail</td><td>e-mail</td></tr><tr><td>Cidade / UF</td><td>texto</td></tr>
<tr><td>Área</td><td>lista de áreas de atuação</td></tr><tr><td>Função</td><td>texto</td></tr><tr><td>Currículo</td><td>arquivo .pdf, .doc ou .docx (sugestão: até 5 MB)</td></tr>
<tr><td>Autorização LGPD *</td><td>caixa de seleção obrigatória</td></tr></table>
<p>Enviar para: <span class="pend">e-mail de RH a confirmar</span>.</p>
<ul><li>Mensagens de sucesso e de erro após o envio.</li><li>Proteção contra spam (honeypot e/ou reCAPTCHA / Turnstile).</li><li>Validar tipo e tamanho do arquivo também no servidor.</li></ul>

<h2>5. Conteúdo gerenciável (painel)</h2>
<h3>Obras</h3>
<p>Alimentam a página Obras, as "Obras recentes" da página inicial e "Outras obras". Campos sugeridos:</p>
<ul>
  <li>título, cliente, cidade/UF, setor (para o filtro), etiquetas e foto de capa;</li>
  <li>ficha técnica: cliente, local, segmento, serviços (com link para a página do serviço), período e área;</li>
  <li>texto "Sobre a obra", escopo (lista) e galeria;</li>
  <li>frentes de serviço opcionais: título, local, texto e fotos.</li>
</ul>
<p>O bloco "Espaço para a próxima obra" nas telas é só referência.</p>
<h3>Vagas</h3>
<p>Campos: título, área, local, tipo de contrato e descrição. Os blocos "Exemplo de vaga" são referência. Sem vagas abertas, mostrar a mensagem de estado vazio desenhada nas telas.</p>
<h3>Filtro de obras</h3>
<p>Os botões de setor da página Obras filtram a lista pelo setor de cada obra.</p>

<h2>6. Mapa</h2>
<p>Inserir mapa do Google na área reservada da página Contato. <span class="pend">Endereço a confirmar.</span></p>

<h2>7. SEO e publicação</h2>
<ul>
  <li>Título e descrição próprios em cada página (os textos estão nas telas e no protótipo).</li>
  <li>Imagem de compartilhamento (Open Graph) e ícone da aba em PNG/ICO, incluindo o ícone para iPhone.</li>
  <li>sitemap.xml, robots.txt, endereço canônico e página 404.</li>
  <li>Dados estruturados de empresa: nome, CNPJ, telefone e endereço.</li>
  <li>HTTPS obrigatório. Redirecionar páginas do site antigo, se houver.</li>
  <li>Imagens otimizadas (no máximo 1600 px de largura), com carregamento sob demanda abaixo da primeira tela.</li>
</ul>

<h2>8. LGPD</h2>
<p>Criar a página <b>Política de Privacidade</b>, que não está nas telas, com link no rodapé e junto aos formulários. Se houver Analytics ou Pixel, incluir aviso de cookies.</p>

<h2>9. Dados a confirmar com o cliente</h2>
<ul>
  <li>E-mail que recebe os pedidos de orçamento e e-mail de RH (currículos).</li>
  <li>Telefone/WhatsApp oficial e endereço para o mapa.</li>
  <li>Links do Instagram e do LinkedIn.</li>
  <li>Razão social e CNPJ do rodapé.</li>
  <li>Período e área das obras (campos "A confirmar").</li>
  <li>Analytics e Pixel (sim/não).</li>
</ul>
</body></html>`;
}

module.exports = { guiaHtml, specHtml };
