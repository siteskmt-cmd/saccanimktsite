# Saccani Engenharia — layout do site

Layout estático (HTML + CSS) do novo site da **Saccani Engenharia**, para o desenvolvedor programar e publicar no domínio.

Abra `index.html` no navegador para visualizar. Não há build nem dependências.

## Páginas

| Arquivo | Página | Observação |
|---|---|---|
| `index.html` | Início | hero, empresa, serviços, obras recentes, missão/visão/valores, parceiros, carreiras, CTA |
| `servicos.html` | Serviços | lista dos 8 serviços + como trabalhamos |
| `servico-*.html` | Detalhe do serviço | 8 páginas, mesmo modelo (visão geral, o que executamos, fotos, processo, outros serviços) |
| `obras.html` | Obras | lista com filtro por setor (visual). **Alimentada pelo painel** |
| `obra-heineken.html` | Detalhe da obra | modelo para todas as obras: ficha técnica, escopo e galeria |
| `carreiras.html` | Carreiras | áreas de atuação, vagas (**alimentadas pelo painel**, com estado vazio) e banco de talentos com currículo |
| `contato.html` | Contato | canais, horário, espaço para mapa e formulário |

Topo e rodapé são iguais em todas as páginas; o link ativo do menu usa `aria-current="page"`.

## Estrutura de arquivos

```
assets/css/style.css        todos os estilos (tokens de cor e fonte no topo)
assets/logo/                logos oficiais (SVG + PNG)
assets/img/hero-planta.jpg  foto do topo da home
assets/img/servicos/        fotos dos serviços
assets/img/obras/<obra>/    fotos por obra
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
- [ ] Fotos da obra Suzano sem uniformes com a marca antiga
- [ ] Fotos novas de obras: `assets/img/obras/<obra>/`, no máximo 1600px, JPG ~80%
- [ ] SEO: favicon PNG/ICO, Open Graph, `sitemap.xml`, Analytics
