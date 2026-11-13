# Saccani Engenharia — layout do site

Layout estático (HTML + CSS) do novo site da **Saccani Engenharia**, para o desenvolvedor programar e publicar no domínio.

Abra `index.html` no navegador para visualizar. Não há build nem dependências.

## Páginas

| Arquivo | Página | Observação |
|---|---|---|
| `index.html` | Início | hero, empresa, serviços, obras recentes, missão/visão/valores, parceiros, carreiras, CTA |
| `servicos.html` | Serviços | lista dos 8 serviços + como trabalhamos |
| `servico-*.html` | Detalhe do serviço | 8 páginas, mesmo modelo (visão geral, o que executamos, fotos, processo, outros serviços) |
| `inspecao-qualidade.html` | Inspeção de qualidade | serviço para gerenciadoras: problema, solução, fluxo FVS/RNC, telas do app, exemplo, entregas, contrato, diferenciais e obra-piloto. Chamada na home e em Serviços; link no menu ("Qualidade") e no rodapé |
| `obras.html` | Obras | lista com filtro por setor (visual). **Alimentada pelo painel** |
| `obra-arauco.html` | Detalhe da obra | Fábrica de Celulose Arauco (Inocência, MS): ficha técnica e as 4 frentes do portfólio, com âncoras (`#captacao`, `#sala-eletrica`, `#tanque`, `#edificio-quimico`) |
| `obra-heineken.html` | Detalhe da obra | modelo para todas as obras: ficha técnica, escopo e galeria |
| `carreiras.html` | Carreiras | áreas de atuação, vagas (**alimentadas pelo painel**, com estado vazio) e banco de talentos com currículo |
| `contato.html` | Contato | canais, horário, espaço para mapa e formulário |

Fotos: só as enviadas pelo cliente (obra Heineken, mini portfólio, pasta de obras da Arauco e fotos da revisão de 11/11/2026). Fotos com marca d'água de terceiros foram recortadas.

Topo e rodapé são iguais em todas as páginas; o link ativo do menu usa `aria-current="page"`.

## Estrutura de arquivos

```
assets/css/style.css        todos os estilos (tokens de cor e fonte no topo)
assets/logo/                logos oficiais (SVG + PNG)
assets/img/hero-planta.jpg  foto do topo da home
assets/img/servicos/        fotos dos serviços
assets/img/obras/<obra>/    fotos por obra (heineken-passos, arauco-inocencia)
assets/img/qualidade/       fotos e telas do app da inspeção de qualidade
assets/img/parceiros/       logos de clientes e parceiros
```

## Identidade

| Token | Cor | Uso |
|---|---|---|
| `--noite` | `#2D2F48` | azul da marca, faixas escuras, títulos |
| `--petroleo` | `#2B6C80` | acento da marca, botões, rótulos |
| `--petroleo-cl` | `#7FB4C4` | acento sobre fundo escuro |
| `--concreto` | `#F1F2F4` | fundo de seções claras |
| `--pendente` | `#A2462E` | **só no layout**: marca dados a confirmar |

Fontes (Google Fonts): **Archivo** expandida (títulos), **Figtree** (texto), **IBM Plex Mono** (rótulos).

## Para o desenvolvedor

- Formulários (contato e currículo) só mostram uma mensagem de demonstração; ligar no back-end.
- Obras e vagas devem vir de um painel (CMS). Os blocos "Espaço para a próxima obra" e "Exemplo de vaga" são só referência visual.
- Filtro de obras por setor é só visual.
- Inserir o mapa do Google na área reservada da página de contato.

## Pendências com o cliente (em vermelho no layout)

- [ ] E-mail de contato, e-mail de RH e domínio novo
- [ ] Links de Instagram e LinkedIn da Saccani
- [ ] Telefone e cidade oficiais (portfólio: (14) 98198-0011 / Marília, SP; site antigo: (27) 99792-2689 / Três Lagoas, MS)
- [ ] Obra Heineken: confirmar cidade/UF (pasta diz Passos-MS; Passos fica em MG), período e área
- [x] Foto da obra Suzano (enviada na revisão de 11/11/2026)
- [ ] Confirmar os textos novos de **Reparos Especializados** e **Juntas** (visão geral e lista "O que executamos") e das 4 frentes da obra Arauco
- [ ] Obra Arauco: confirmar período
- [ ] Foto de Pintura (enviada na revisão) mostra o uniforme com a marca antiga
- [ ] Foto de Juntas tem baixa resolução (360×640): a página usa cabeçalho sem foto; enviar foto maior se houver
- [ ] Fotos novas de obras: `assets/img/obras/<obra>/`, no máximo 1600px, JPG ~80%
- [ ] SEO: favicon PNG/ICO, Open Graph, `sitemap.xml`, Analytics

- [ ] Inspeção de qualidade: confirmar o número de retrabalho (≈ 5%) e as fontes citadas, a menção à ISO 9001 ("baseados na", não certificação) e a base em Inocência (MS)
- [ ] Inspeção de qualidade: o material de origem usava a marca antiga (SAMARC / SMRC QA); no site o serviço aparece só como Saccani e o logo antigo foi coberto na tela de relatórios do app

## Revisão de 11/11/2026 (aplicada)

1. Fotos dos serviços: Concreto (aérea do tanque da Arauco), Pintura, Infraestrutura, e os serviços **Esquadrias em geral → Reparos Especializados** (`servico-reparos-especializados.html`) e **Forros → Juntas** (`servico-juntas.html`).
2. Setores atendidos: "Obras industriais em geral" (página Serviços e faixa do topo da home).
3. Equipe própria multidisciplinar: "Civil pesada, instalações, acabamentos e manutenção".
4. Legenda da foto Heineken: "Laje em concreto armado".
5. Obras recentes da home: as 4 frentes da Arauco do portfólio (captação, sala elétrica da ETA, tanque ETAC, edifício de produtos químicos).
6. Páginas de serviço com fotos recentes da Arauco (Concreto, Vedação, Infraestrutura) e as fotos novas da revisão.
7. Card da Suzano com a foto do filtro de areia (no lugar de "Fotos em breve").

## PDF de aprovação

`aprovacao/Saccani_Layout_Site_Aprovacao.pdf`: capa, sumário, o que mudou, identidade visual, as 16 telas em tamanho real (clicáveis), versão celular e página de aprovação.

Para gerar de novo depois de mudar o site (precisa de Playwright com Chromium e internet para as fontes):

```
node aprovacao/gerar-pdf/capturar.js
```

Textos, lista de telas, "o que mudou" e pendências ficam em `aprovacao/gerar-pdf/modelo.js`.
