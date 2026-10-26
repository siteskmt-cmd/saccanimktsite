# Saccani Engenharia — layout do site

Layout estático (HTML + CSS) do novo site da **Saccani Engenharia** (antiga Samarc Engenharia), para o desenvolvedor programar e publicar no domínio.

Abra `index.html` no navegador para visualizar. Não há build nem dependências.

## Estrutura

```
index.html                  página única com âncoras
assets/css/style.css        todos os estilos (tokens de cor e fonte no topo)
assets/logo/                logos oficiais (SVG + PNG): colorida, monocromática, negativa e símbolo
assets/img/hero-planta.jpg  foto do topo
assets/img/servicos/        uma foto por serviço (8)
assets/img/obras/           fotos por obra, uma pasta por obra
```

## Seções (menu)

1. **Topo** — logo, menu e botão "Solicitar visita técnica" (fixo ao rolar; vira menu hambúrguer abaixo de 980px)
2. **Hero** — aviso "A Samarc agora é Saccani Engenharia", título, chamadas e faixa de números
3. **A empresa** (`#sobre`) — história curta + 3 diferenciais + foto Suzano
4. **Serviços** (`#servicos`) — 8 serviços em 3 grupos
5. **Como trabalhamos** (`#metodo`) — 4 etapas + setores atendidos
6. **Obras** (`#obras`) — Heineken e Suzano. Para nova obra, duplicar um bloco `<article class="obra">`
7. **CTA WhatsApp**
8. **Contato** (`#contato`) — canais + formulário (sem envio; ligar no back-end/serviço de formulário)
9. **Rodapé**

## Identidade

| Token | Cor | Uso |
|---|---|---|
| `--noite` | `#2D2F48` | azul da marca, faixas escuras, títulos |
| `--petroleo` | `#2B6C80` | acento da marca, botões, rótulos |
| `--petroleo-cl` | `#7FB4C4` | acento sobre fundo escuro |
| `--concreto` | `#F1F2F4` | fundo de seções claras |

Fontes (Google Fonts): **Archivo** expandida (títulos, combina com o logotipo), **Figtree** (texto), **IBM Plex Mono** (rótulos e localizações).

O hexágono do símbolo é usado como marcador (`clip-path`), e os botões têm o canto cortado.

## Pendências para o desenvolvedor / cliente

- [ ] **E-mail** de contato e **domínio** novo (no layout está `contato@[dominio-a-confirmar]`, em vermelho)
- [ ] Links de **Instagram / LinkedIn**, se houver
- [ ] Ligar o **formulário** de contato (hoje só mostra uma mensagem de demonstração)
- [ ] Confirmar a localização da obra Heineken (a pasta de fotos diz "Passos-MS"; a cidade de Passos fica em MG)
- [ ] Confirmar se o CNPJ e a razão social (SMRC Engenharia Ltda) devem aparecer no rodapé
- [ ] Novas fotos de obras: incluir em `assets/img/obras/<obra>/` (redimensionar para no máximo 1600px, JPG ~80%)
- [ ] SEO: favicon PNG/ICO, Open Graph, `sitemap.xml`, Google Analytics/Tag Manager
