# SMRC Engenharia: layout do site (aprovado)

Layout estático (HTML + CSS) do novo site da **SMRC Engenharia**, **aprovado pelo cliente em 13/11/2026**, para o programador implementar e publicar no domínio.

Abra `index.html` no navegador para ver o site. Não há build nem dependências: são 16 páginas HTML, um CSS e as imagens.

A referência visual aprovada está em `aprovacao/SMRC_Layout_Site_Aprovacao.pdf`, que traz todas as telas em tamanho real, a versão celular e a identidade visual.

As informações que ainda faltam do cliente estão em [`PENDENCIAS-CLIENTE.md`](PENDENCIAS-CLIENTE.md). No layout, esses dados aparecem **em vermelho** (classe `.pendente`).

---

## Regra de marca

- Em **todo texto** do site, o nome é **SMRC Engenharia**, com **SMRC sempre em caixa alta**. Nunca escrever "Smrc" ou "smrc".
- **Logos, imagens e favicon continuam como estão** (Saccani / SAMARC). Não trocar.
- "Marcelo Saccani" é o nome do sócio e fica como está.

## Páginas

| Arquivo | Página | Conteúdo |
|---|---|---|
| `index.html` | Início | hero, empresa, serviços, inspeção de qualidade, obras recentes, missão/visão/valores, parceiros, carreiras, CTA |
| `servicos.html` | Serviços | os 8 serviços, chamada da inspeção de qualidade, como trabalhamos, setores atendidos |
| `servico-*.html` | Detalhe do serviço | 8 páginas no mesmo modelo: concreto, vedacao, acabamento, pintura, infraestrutura, reparos-especializados, juntas, outros-servicos |
| `inspecao-qualidade.html` | Inspeção de qualidade | serviço para gerenciadoras de obras (link "Qualidade" no menu) |
| `obras.html` | Obras | lista com filtro por setor. **Dinâmica (painel)** |
| `obra-arauco.html` | Detalhe da obra | Arauco: ficha técnica e 4 frentes, com âncoras `#captacao`, `#sala-eletrica`, `#tanque`, `#edificio-quimico` |
| `obra-heineken.html` | Detalhe da obra | Heineken: ficha técnica, escopo e galeria |
| `carreiras.html` | Carreiras | áreas de atuação, vagas (**dinâmica, painel**) e banco de talentos com envio de currículo |
| `contato.html` | Contato | canais, horário, área do mapa e formulário de orçamento |

Topo e rodapé são iguais em todas as páginas. O link ativo do menu usa `aria-current="page"`. No celular, o menu abre pelo botão (JS mínimo no fim de cada página).

## Estrutura de arquivos

```
assets/css/style.css         todos os estilos (tokens de cor e fonte no topo; responsivo no fim)
assets/logo/                 logos oficiais (SVG + PNG)
assets/img/hero-planta.jpg   foto do topo da home
assets/img/servicos/         fotos dos serviços
assets/img/obras/<obra>/     fotos por obra (heineken-passos, arauco-inocencia)
assets/img/qualidade/        fotos e telas do app (WebP com fundo transparente)
assets/img/parceiros/        logos de clientes e parceiros
aprovacao/                   PDF aprovado e o gerador do PDF (não vai para o servidor)
```

As imagens já estão otimizadas: no máximo 1600 px de largura, JPG com qualidade em torno de 80, com `width`/`height` e `loading="lazy"` no HTML.

## Identidade

| Token | Cor | Uso |
|---|---|---|
| `--noite` | `#2D2F48` | azul da marca, faixas escuras, títulos |
| `--petroleo` | `#2B6C80` | acento da marca, botões, rótulos |
| `--petroleo-cl` | `#7FB4C4` | acento sobre fundo escuro |
| `--concreto` | `#F1F2F4` | fundo de seções claras |
| `--pendente` | `#A2462E` | **só no layout**: marca dados a confirmar (remover na publicação) |

Fontes (Google Fonts): **Archivo** expandida (títulos), **Figtree** (texto), **IBM Plex Mono** (rótulos).

---

## O que o programador precisa implementar

### 1. Formulários (hoje só mostram uma mensagem de demonstração)

Os dois formulários têm o atributo `data-demo` e um script no fim da página que só exibe "Layout: o envio será ligado pelo desenvolvedor". Remover o atributo e o script, ligar no back-end e mostrar uma mensagem de sucesso e outra de erro.

| Formulário | Página | Campos | Envia para |
|---|---|---|---|
| Orçamento / contato | `contato.html` | nome*, empresa/planta, telefone, e-mail*, serviço (lista), mensagem | e-mail comercial **(a confirmar; provavelmente samarc.contato@gmail.com)** |
| Currículo | `carreiras.html` | nome*, telefone/WhatsApp*, e-mail, cidade/UF, área (lista), função, arquivo (.pdf, .doc, .docx), aceite LGPD* | e-mail de RH **(a confirmar)** |

- Proteção contra spam: honeypot e/ou reCAPTCHA v3 / Cloudflare Turnstile.
- Currículo: limitar o tamanho do arquivo (sugestão: 5 MB) e validar a extensão no servidor.
- Enviar uma cópia de confirmação para quem preencheu, se o cliente quiser (ver pendências).
- A lista "Serviço" do contato já inclui os 8 serviços, Inspeção de qualidade, Manutenção de área fabril e Outro.

### 2. Painel (CMS) para obras e vagas

- **Obras:** o modelo está em `obra-heineken.html` (ficha + escopo + galeria) e em `obra-arauco.html` (ficha + frentes com fotos).
  - Campos sugeridos: título, cliente, cidade/UF, setor (para o filtro), tags, foto de capa, ficha técnica (cliente, local, segmento, serviços, período, área), texto "Sobre a obra", escopo (lista), galeria e frentes opcionais (título, local, texto, fotos).
  - Os cards da home ("Obras recentes") e de `obras.html` saem dessa lista.
  - Remover o bloco "Espaço para a próxima obra", que é só referência visual.
- **Vagas:** campos sugeridos título, área, local, tipo de contrato e descrição. Os blocos "Exemplo de vaga" são referência. Sem vagas abertas, mostrar a mensagem de estado vazio que já está no layout.

### 3. Filtro de obras por setor

Em `obras.html`, os botões Todas / Papel e celulose / Química / Alimentos e bebidas hoje são só visuais. Ligar o filtro pelo setor de cada obra no painel.

### 4. Mapa

Em `contato.html`, inserir o mapa do Google na área `.mapa` (endereço a confirmar).

### 5. Dados em vermelho

Substituir cada `.pendente` pelo dado confirmado e retirar a classe. Hoje estão em vermelho:
- o e-mail de RH;
- Instagram e LinkedIn (rodapé de todas as páginas e Carreiras);
- os campos "A confirmar" das obras.

Depois, apagar o token `--pendente` e a regra `.pendente` do CSS.

### 6. SEO e publicação

- Cada página já tem `<title>` e `meta description`.
- **Faltam:**
  - Open Graph e Twitter Card, com imagem de compartilhamento;
  - favicon PNG/ICO e `apple-touch-icon` (hoje só há o SVG);
  - `canonical`;
  - `sitemap.xml` e `robots.txt`;
  - dados estruturados `Organization` / `LocalBusiness` com CNPJ, telefone e endereço;
  - página 404.
- Se o cliente quiser: Google Analytics 4 / Tag Manager e Meta Pixel, com banner de cookies.
- Redirecionar (301) as páginas do site antigo, se houver domínio anterior.
- HTTPS obrigatório. Formulários só por HTTPS.

### 7. LGPD

O layout **não tem página de Política de Privacidade**, e os formulários coletam dados pessoais e currículo. Criar a página, com link no rodapé e junto aos formulários, e definir com o cliente o e-mail do encarregado de dados.

### 8. Acessibilidade (já no layout, manter)

Textos alternativos nas imagens, `label` em todos os campos, foco visível, `prefers-reduced-motion` respeitado e contraste da paleta conferido.

---

## Histórico

- **Revisão de 11/11/2026:** fotos e nomes dos serviços (Esquadrias → Reparos Especializados, Forros → Juntas), setores atendidos, textos da equipe e da obra Heineken, obras recentes da Arauco, fotos recentes nos serviços e foto da obra Suzano.
- **12–13/11/2026:** nova página de Inspeção de qualidade; novo título da home ("em plantas na fase de projeto ou operação"); foto de Entregas; nome **SMRC Engenharia** em todo o texto.
- **13/11/2026:** layout aprovado (PDF v4).

## PDF de aprovação

Para gerar o PDF de novo depois de mudar o site (precisa de Playwright com Chromium e internet para as fontes):

```
node aprovacao/gerar-pdf/capturar.js
```

Textos, lista de telas, "o que mudou" e pendências do PDF ficam em `aprovacao/gerar-pdf/modelo.js`.
