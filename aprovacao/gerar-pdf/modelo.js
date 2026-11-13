// Conteúdo e layout do PDF de aprovação. Edite aqui textos, telas e pendências.
const path = require('path');
const RAIZ = path.resolve(__dirname, '..', '..');
const asset = rel => 'file://' + path.join(RAIZ, rel);

const VERSAO = 'Layout v3';
const DATA = 'Novembro de 2026';
const CAB = 96; // altura da faixa de título de cada tela (px)

const DET_SVC = 'Página de detalhe do serviço: visão geral, o que executamos, fotos, processo e outros serviços. Mesmo modelo para os 8 serviços.';
const TELAS = [
  { arquivo: 'index.html', nome: 'Início', titulo: 'Início', desc: 'Página de entrada: empresa, serviços, inspeção de qualidade, obras recentes, institucional, parceiros e chamadas.' },
  { arquivo: 'servicos.html', nome: 'Serviços', titulo: 'Serviços', desc: 'Os 8 serviços, a chamada da inspeção de qualidade e como trabalhamos.' },
  { arquivo: 'servico-concreto.html', nome: 'Concreto em geral', titulo: 'Serviço · Concreto em geral', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'servico-vedacao.html', nome: 'Vedação em geral', titulo: 'Serviço · Vedação em geral', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'servico-acabamento.html', nome: 'Acabamento', titulo: 'Serviço · Acabamento', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'servico-pintura.html', nome: 'Pintura', titulo: 'Serviço · Pintura', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'servico-infraestrutura.html', nome: 'Infraestrutura', titulo: 'Serviço · Infraestrutura', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'servico-reparos-especializados.html', nome: 'Reparos Especializados', titulo: 'Serviço · Reparos Especializados', desc: DET_SVC, grupo: 'svc', novo: true },
  { arquivo: 'servico-juntas.html', nome: 'Juntas', titulo: 'Serviço · Juntas', desc: DET_SVC, grupo: 'svc', novo: true },
  { arquivo: 'servico-outros-servicos.html', nome: 'Outros serviços', titulo: 'Serviço · Outros serviços', desc: DET_SVC, grupo: 'svc' },
  { arquivo: 'inspecao-qualidade.html', nome: 'Inspeção de qualidade', titulo: 'Inspeção de qualidade', desc: 'Serviço para gerenciadoras: o problema, como funciona, telas do app, entregas, contrato e obra-piloto.', novo: true },
  { arquivo: 'obras.html', nome: 'Obras', titulo: 'Obras', desc: 'Lista de obras com filtro por setor. Alimentada pelo painel do site.' },
  { arquivo: 'obra-arauco.html', nome: 'Obra · Arauco', titulo: 'Obra · Fábrica de Celulose Arauco', desc: 'Detalhe da obra: ficha técnica e as 4 frentes do portfólio, com fotos.', novo: true },
  { arquivo: 'obra-heineken.html', nome: 'Obra · Heineken', titulo: 'Obra · Cervejaria Heineken', desc: 'Detalhe da obra: ficha técnica, escopo e galeria. Mesmo modelo para as próximas obras.' },
  { arquivo: 'carreiras.html', nome: 'Carreiras', titulo: 'Carreiras', desc: 'Por que trabalhar na Saccani, áreas de atuação, vagas abertas (alimentadas pelo painel) e banco de talentos com currículo.' },
  { arquivo: 'contato.html', nome: 'Contato', titulo: 'Contato', desc: 'Canais, horário, espaço para o mapa e formulário.' },
].map((t, i) => ({ ...t, n: String(i + 1).padStart(2, '0') }));

const CELULAR = [
  { arquivo: 'index.html', nome: 'Início' },
  { arquivo: 'servicos.html', nome: 'Serviços' },
  { arquivo: 'inspecao-qualidade.html', nome: 'Inspeção de qualidade' },
  { arquivo: 'obra-arauco.html', nome: 'Detalhe da obra' },
  { arquivo: 'contato.html', nome: 'Contato' },
];

const tela = arq => TELAS.find(t => t.arquivo === arq);

// O que mudou desde a versão anterior (revisão de 11/11/2026 + inspeção de qualidade)
const MUDANCAS = [
  ['Fotos dos serviços', 'Fotos novas em Concreto, Pintura e Infraestrutura. Esquadrias em geral passou a ser Reparos Especializados e Forros passou a ser Juntas.', 'servicos.html'],
  ['Setores atendidos', '"Obras industriais em geral", na página Serviços e no topo da página inicial.', 'servicos.html'],
  ['Equipe própria multidisciplinar', '"Civil pesada, instalações, acabamentos e manutenção".', 'index.html'],
  ['Legenda da obra Heineken', '"Laje em concreto armado · Passos, MS".', 'index.html'],
  ['Obras recentes', 'A página inicial mostra as 4 frentes da Arauco do portfólio, com página de detalhe própria.', 'obra-arauco.html'],
  ['Fotos recentes nos serviços', 'Concreto, Vedação e Infraestrutura com fotos da obra da Arauco.', 'servico-concreto.html'],
  ['Obra Suzano com foto', 'O card do filtro de areia da ETA ganhou foto no lugar de "Fotos em breve".', 'obras.html'],
  ['Nova: Inspeção de qualidade', 'Página do serviço para gerenciadoras, chamada na página inicial e em Serviços e link "Qualidade" no menu.', 'inspecao-qualidade.html'],
];

const PENDENCIAS = [
  ['E-mail, domínio e redes sociais', 'E-mail de contato, e-mail de RH, domínio novo, Instagram e LinkedIn.'],
  ['Telefone e cidade oficiais', 'Usamos (14) 98198-0011 · Marília, SP.'],
  ['Obras Heineken e Arauco', 'Heineken: cidade e UF, período e área. Arauco: período da obra.'],
  ['Textos novos', 'Reparos Especializados, Juntas e as 4 frentes da obra Arauco.'],
  ['Inspeção de qualidade', 'Número de retrabalho (≈ 5%) e fontes, menção à ISO 9001 e base em Inocência (MS).'],
  ['Fotos', 'Pintura mostra uniforme com a marca antiga; foto de Juntas em baixa resolução.'],
];

function linkDestino(href, atual) {
  if (!href || href === '#') return null;
  if (/^(https?:|tel:|mailto:)/.test(href)) return href;
  const [arq, ancora] = href.split('#');
  const alvo = arq ? tela(arq) : atual;
  if (!alvo) return null;
  if (ancora && alvo.ids && alvo.ids[ancora] !== undefined) return `#t${alvo.n}--${ancora}`;
  return `#t${alvo.n}`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function paginaTela(t) {
  const links = t.links.map(l => {
    const d = linkDestino(l.href, t);
    if (!d) return '';
    const ext = d.startsWith('#') ? '' : ' target="_blank"';
    return `<a class="hot" href="${esc(d)}"${ext} style="left:${l.x.toFixed(1)}px;top:${(l.y + CAB).toFixed(1)}px;width:${l.w.toFixed(1)}px;height:${l.h.toFixed(1)}px"></a>`;
  }).join('');
  const ancoras = Object.entries(t.ids || {}).map(([id, y]) =>
    `<span class="ancora" id="t${t.n}--${esc(id)}" style="top:${Math.max(0, y + CAB - 20).toFixed(0)}px"></span>`).join('');
  return `
<section class="tela" id="t${t.n}" style="page:t${t.n};height:${t.altura + CAB}px">
  <header class="tela__cab">
    <span class="hexn">${t.n}</span>
    <div><p class="tela__tit">${esc(t.titulo)}${t.novo ? ' <em>novo</em>' : ''}</p><p class="tela__desc">${esc(t.desc)}</p></div>
    <code>${t.arquivo}</code>
    <a class="voltar" href="#sumario">↑ Sumário</a>
  </header>
  <img class="tela__img" src="${t.img}" width="1440" height="${t.altura}" alt="">
  ${ancoras}${links}
</section>`;
}

function montarHtml(telas, celular) {
  const regrasPagina = telas.map(t => `@page t${t.n} { size: 1440px ${t.altura + CAB}px; margin: 0; }`).join('\n');
  const minis = telas.map(t => `
      <a class="mini" href="#t${t.n}"><img src="${t.mini}" alt=""><span><b>${t.n}</b> ${esc(t.nome)}${t.novo ? ' <em>novo</em>' : ''}</span></a>`).join('');
  const mudancas = MUDANCAS.map(([tit, txt, arq], i) => `
      <li><span class="num">${i + 1}</span><div><h3>${esc(tit)}</h3><p>${esc(txt)}</p></div><a href="#t${tela(arq).n}">Ver tela ${tela(arq).n} →</a></li>`).join('');
  const pend = PENDENCIAS.map(([a, b]) => `<li><h3>${esc(a)}</h3><p>${esc(b)}</p></li>`).join('');
  const cels = celular.map(c => `
      <a class="cel" href="#t${tela(c.arquivo).n}"><span class="cel__tela"><img src="${c.img}" alt=""></span><span>${esc(c.nome)}</span></a>`).join('');

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Saccani Engenharia · Layout do site para aprovação</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,600..900&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=block">
<style>
@page { size: 1440px 900px; margin: 0; }
@page sumario { size: 1440px 1000px; margin: 0; }
${regrasPagina}
:root { --noite:#2D2F48; --noite-2:#23253A; --petroleo:#2B6C80; --petroleo-cl:#7FB4C4; --concreto:#F1F2F4; --cinza:#5C6075; --linha:#D9DBE2; --pendente:#A2462E;
  --hex: polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%); }
* { box-sizing: border-box; }
html, body { margin: 0; background: #fff; color: #1D1F30; font: 16px/1.5 Figtree, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, h3 { font-family: Archivo, sans-serif; font-stretch: 112%; margin: 0; line-height: 1.1; }
p { margin: 0; }
a { color: inherit; }
.pg { position: relative; width: 1440px; height: 900px; overflow: hidden; break-after: page; padding: 80px 96px; }
.olho { display: flex; align-items: center; gap: 10px; font: 500 13px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--petroleo); margin-bottom: 18px; }
.olho::before { content: ""; width: 12px; height: 14px; background: currentColor; clip-path: var(--hex); }
.escuro { background: var(--noite); color: #fff; }
.escuro .olho { color: var(--petroleo-cl); }
h2.grande { font-size: 52px; font-weight: 800; }

/* capa */
.capa { padding: 72px 96px; display: grid; grid-template-rows: auto 1fr auto; }
.capa__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.capa::before { content: ""; position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(35,37,58,.96) 0%, rgba(35,37,58,.82) 55%, rgba(35,37,58,.45) 100%); }
.capa > *:not(.capa__bg) { position: relative; z-index: 2; }
.capa__logo { width: 210px; }
.capa h1 { align-self: end; font-size: 96px; font-weight: 800; line-height: .98; }
.capa h1 span { color: var(--petroleo-cl); display: block; }
.capa__lead { margin-top: 24px; max-width: 46ch; font-size: 21px; color: rgba(255,255,255,.85); }
.capa__fatos { display: grid; grid-template-columns: repeat(4, auto) 1fr; gap: 64px; align-items: end; margin-top: 56px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.25); }
.capa__fatos dt { font: 500 12px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.6); margin-bottom: 10px; }
.capa__fatos dd { margin: 0; font: 700 20px/1.2 Archivo, sans-serif; font-stretch: 112%; }
.capa__fatos a { color: var(--petroleo-cl); }

/* sumário */
.sumario { height: 1000px; display: grid; grid-template-columns: 330px 1fr; gap: 56px; padding: 72px 80px; page: sumario; }
.sumario__lado p { color: var(--cinza); }
.sumario__lado h2 { margin-bottom: 16px; }
.caixa { margin-top: 28px; padding: 22px 24px; background: var(--concreto); }
.caixa h3 { font-size: 16px; margin-bottom: 8px; }
.caixa p { font-size: 15px; }
.atalhos { list-style: none; padding: 0; margin: 28px 0 0; border-top: 1px solid var(--linha); }
.atalhos li { border-bottom: 1px solid var(--linha); }
.atalhos a { display: flex; justify-content: space-between; padding: 13px 0; text-decoration: none; font-weight: 600; color: var(--noite); }
.atalhos a::after { content: "→"; color: var(--petroleo); }
.minis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px 22px; align-content: start; }
.mini { text-decoration: none; display: grid; gap: 8px; }
.mini img { width: 100%; aspect-ratio: 1440 / 1100; object-fit: cover; object-position: top; border: 1px solid var(--linha); box-shadow: 0 6px 16px rgba(29,31,48,.10); }
.mini span { font-size: 14px; font-weight: 600; color: var(--noite); }
.mini b { font: 500 12px 'IBM Plex Mono', monospace; color: var(--petroleo); margin-right: 6px; }
em { font-style: normal; font: 500 10px/1 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; background: var(--petroleo); color: #fff; padding: 3px 6px; vertical-align: 2px; margin-left: 4px; }

/* o que mudou */
.mudou { display: grid; grid-template-columns: 360px 1fr; gap: 64px; }
.mudou__lado p { color: var(--cinza); margin-top: 16px; }
.mud { list-style: none; margin: 0; padding: 0; border-top: 3px solid var(--noite); }
.mud li { display: grid; grid-template-columns: 44px 1fr auto; gap: 18px; align-items: center; padding: 15px 0; border-bottom: 1px solid var(--linha); }
.num { display: grid; place-items: center; width: 34px; height: 38px; background: var(--petroleo); color: #fff; clip-path: var(--hex); font: 700 14px Archivo, sans-serif; }
.mud h3 { font-size: 18px; color: var(--noite); }
.mud p { font-size: 15px; color: var(--cinza); margin-top: 3px; }
.mud a { font-weight: 600; font-size: 14px; color: var(--petroleo); text-decoration: none; white-space: nowrap; }

/* identidade */
.ident { background: var(--concreto); display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
.ident__txt p { color: var(--cinza); margin-top: 16px; max-width: 48ch; }
.cores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.cores div { display: grid; gap: 8px; font-size: 13px; }
.cores i { display: block; height: 96px; }
.cores b { font-weight: 600; color: var(--noite); }
.cores span { font: 500 12px 'IBM Plex Mono', monospace; color: var(--cinza); }
.logos { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 36px; }
.logos div { display: grid; place-items: center; height: 130px; background: #fff; }
.logos div.esc { background: var(--noite); }
.logos img { width: 190px; }
.tipos { background: #fff; padding: 28px 32px; display: grid; gap: 18px; margin-top: 14px; }
.tipos div { display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: baseline; }
.tipos dt { font: 500 11px/1.3 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--cinza); }
.tipos dd { margin: 0; }
.detalhes { display: flex; align-items: center; gap: 20px; margin-top: 28px; }
.btn { display: inline-block; padding: 14px 26px; background: var(--petroleo); color: #fff; font-weight: 600; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%); }
.hexg { width: 36px; height: 42px; background: var(--petroleo); clip-path: var(--hex); }

/* telas */
.tela { position: relative; width: 1440px; break-after: page; overflow: hidden; }
.tela__cab { height: ${CAB}px; display: grid; grid-template-columns: auto 1fr auto auto; gap: 22px; align-items: center; padding: 0 40px; background: var(--noite); color: #fff; }
.hexn { display: grid; place-items: center; width: 48px; height: 54px; background: var(--petroleo); clip-path: var(--hex); font: 700 17px Archivo, sans-serif; }
.tela__tit { font: 800 24px/1.1 Archivo, sans-serif; font-stretch: 112%; }
.tela__desc { margin-top: 5px; font-size: 14px; color: rgba(255,255,255,.72); max-width: 80ch; }
.tela__cab code { font: 500 13px 'IBM Plex Mono', monospace; color: var(--petroleo-cl); }
.voltar { padding: 10px 16px; border: 1px solid rgba(255,255,255,.5); font-weight: 600; font-size: 14px; text-decoration: none; }
.tela__img { display: block; width: 1440px; }
.hot { position: absolute; display: block; }
.ancora { position: absolute; left: 0; width: 1px; height: 1px; }

/* celular */
.celular { background: var(--noite); color: #fff; }
.celular__cab { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; }
.celular__cab p { color: rgba(255,255,255,.75); }
.cels { display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px; margin-top: 52px; }
.cel { display: grid; gap: 16px; justify-items: center; text-decoration: none; font-weight: 600; }
.cel__tela { display: block; width: 210px; padding: 10px; background: #111; border-radius: 34px; box-shadow: 0 20px 40px rgba(0,0,0,.35); }
.cel__tela img { display: block; width: 100%; border-radius: 26px; }

/* próximos passos */
.proximos { display: grid; grid-template-columns: 1fr 500px; gap: 72px; }
.pend { list-style: none; margin: 32px 0 0; padding: 0; border-top: 3px solid var(--noite); }
.pend li { position: relative; padding: 14px 0 14px 36px; border-bottom: 1px solid var(--linha); }
.pend li::before { content: ""; position: absolute; left: 0; top: 18px; width: 16px; height: 16px; border: 2px solid var(--pendente); }
.pend h3 { font-size: 17px; color: var(--noite); }
.pend p { font-size: 15px; color: var(--cinza); margin-top: 3px; }
.aprov { background: var(--concreto); padding: 40px; }
.aprov h3 { font-size: 26px; color: var(--noite); margin-bottom: 22px; }
.opc { display: flex; align-items: center; gap: 14px; padding: 8px 0; font-weight: 600; }
.opc::before { content: ""; width: 20px; height: 20px; border: 2px solid var(--noite); background: #fff; }
.campo { margin-top: 24px; }
.campo span { display: block; font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--cinza); margin-bottom: 8px; }
.campo i { display: block; height: 170px; background: #fff; border: 1px solid var(--linha); }
.assin { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-top: 30px; }
.assin i { display: block; height: 34px; border-bottom: 1px solid var(--noite); }
.aprov small { display: block; margin-top: 26px; color: var(--cinza); font-size: 14px; }
</style></head><body>

<section class="pg escuro capa" id="capa">
  <img class="capa__bg" src="${asset('assets/img/hero-planta.jpg')}" alt="">
  <img class="capa__logo" src="${asset('assets/logo/Saccani_logo_negativa_branca.svg')}" alt="Saccani Engenharia">
  <div style="align-self:end">
    <p class="olho">Layout para aprovação</p>
    <h1>Novo site <span>Saccani Engenharia</span></h1>
    <p class="capa__lead">Proposta de layout com todas as páginas do site, já com a revisão de 11/11/2026 e a nova página de Inspeção de qualidade. As telas deste PDF são clicáveis, como no site.</p>
  </div>
  <dl class="capa__fatos">
    <div><dt>Páginas</dt><dd>${telas.length} telas</dd></div>
    <div><dt>Versão</dt><dd>${VERSAO}</dd></div>
    <div><dt>Data</dt><dd>${DATA}</dd></div>
    <div><dt>Começar</dt><dd><a href="#sumario">Ver sumário ↓</a></dd></div>
  </dl>
</section>

<section class="pg sumario" id="sumario">
  <div class="sumario__lado">
    <p class="olho">Sumário</p>
    <h2 class="grande">Mapa do site</h2>
    <p>Este documento mostra cada página do novo site em tamanho real, como aparece no computador, e no final a versão para celular.</p>
    <div class="caixa"><h3>Como navegar</h3><p>Clique nas páginas ao lado para ir direto a elas. Dentro de cada tela, o menu, os cards e os botões levam para a página correspondente, como no site. O botão "↑ Sumário" no topo de cada tela volta para cá.</p></div>
    <ul class="atalhos">
      <li><a href="#mudou">O que mudou nesta versão</a></li>
      <li><a href="#identidade">Identidade visual</a></li>
      <li><a href="#celular">Versão celular</a></li>
      <li><a href="#proximos">Pendências e aprovação</a></li>
    </ul>
  </div>
  <div class="minis">${minis}
  </div>
</section>

<section class="pg mudou" id="mudou">
  <div class="mudou__lado">
    <p class="olho">Nesta versão</p>
    <h2 class="grande">O que mudou</h2>
    <p>Itens da revisão do site de 11/11/2026 e a nova página de Inspeção de qualidade. Clique em cada item para ver a tela.</p>
  </div>
  <ol class="mud">${mudancas}
  </ol>
</section>

<section class="pg ident" id="identidade">
  <div class="ident__txt">
    <p class="olho">Identidade visual</p>
    <h2 class="grande">Direção do layout</h2>
    <p>O site parte da nova marca: o azul-noite e o petróleo do símbolo, títulos em letra larga como no logotipo e o hexágono do "S" como detalhe ao longo das páginas. Fundos claros de concreto e faixas escuras dão o ritmo, e as fotos reais de obra são as protagonistas.</p>
    <div class="logos">
      <div><img src="${asset('assets/logo/Saccani_logo_colorida.svg')}" alt="Logo colorida"></div>
      <div class="esc"><img src="${asset('assets/logo/Saccani_logo_negativa_branca.svg')}" alt="Logo negativa"></div>
    </div>
  </div>
  <div>
    <div class="cores">
      <div><i style="background:#2D2F48"></i><b>Azul-noite</b><span>#2D2F48</span></div>
      <div><i style="background:#2B6C80"></i><b>Petróleo</b><span>#2B6C80</span></div>
      <div><i style="background:#7FB4C4"></i><b>Petróleo claro</b><span>#7FB4C4</span></div>
      <div><i style="background:#F1F2F4;border:1px solid #D9DBE2"></i><b>Concreto</b><span>#F1F2F4</span></div>
    </div>
    <dl class="tipos">
      <div><dt>Títulos<br>Archivo Expanded</dt><dd style="font:800 40px/1.05 Archivo,sans-serif;font-stretch:112%;color:var(--noite)">Da fundação ao acabamento</dd></div>
      <div><dt>Texto<br>Figtree</dt><dd style="font-size:18px">Obras civis e manutenção de área fabril com equipe própria.</dd></div>
      <div><dt>Rótulos<br>IBM Plex Mono</dt><dd style="font:500 14px 'IBM Plex Mono',monospace;letter-spacing:.12em;color:var(--petroleo)">INOCÊNCIA · MS</dd></div>
    </dl>
    <div class="detalhes"><span class="btn">Solicitar orçamento</span><span class="hexg"></span><p style="color:var(--cinza);font-size:15px">Hexágono do símbolo como marcador e botões com o canto cortado.</p></div>
  </div>
</section>
${telas.map(paginaTela).join('\n')}

<section class="pg celular" id="celular">
  <div class="celular__cab">
    <div><p class="olho">Responsivo</p><h2 class="grande">Versão celular</h2></div>
    <p>Todas as páginas se adaptam ao celular, com menu recolhido e conteúdo em uma coluna. Clique em uma tela para ver a versão completa no computador.</p>
  </div>
  <div class="cels">${cels}
  </div>
</section>

<section class="pg proximos" id="proximos">
  <div>
    <p class="olho">Próximos passos</p>
    <h2 class="grande">Informações a confirmar</h2>
    <ul class="pend">${pend}</ul>
  </div>
  <div class="aprov">
    <h3>Aprovação do layout</h3>
    <p class="opc">Aprovado</p><p class="opc">Aprovado com ajustes</p><p class="opc">Refazer</p>
    <div class="campo"><span>Comentários</span><i></i></div>
    <div class="assin"><div class="campo"><span>Nome</span><i></i></div><div class="campo"><span>Data</span><i></i></div></div>
    <small>Após a aprovação, o layout segue para programação e publicação no domínio. <a href="#sumario">Voltar ao sumário</a></small>
  </div>
</section>
</body></html>`;
}

module.exports = { montarHtml, TELAS, CELULAR };
