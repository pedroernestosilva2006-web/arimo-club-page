# ARIMO Hub

# ARIMO CLUB — Landing Page (Documento de Implementação)

**Projeto:** ARIMO CLUB
**Tipo:** Landing page única, gratuita, CTA para grupo de WhatsApp
**Stack:** React/Vite/TS strict + Tailwind + shadcn + Lovable Cloud
**Direção visual:** Preto e branco, editorial, clube privado — nada de SaaS, nada de infoproduto

---

## 1. Briefing e Direção

O ARIMO CLUB é um clube gratuito para empresários, vendedores, executivos e
gente que vive de fazer negócio. O ponto que une todo mundo: negócio.

Pilares da marca (ARIMO):
- **A** — Aceleração
- **R** — Resultado
- **I** — Inteligência
- **M** — Metodologia
- **O** — Otimização

Esses pilares aparecem de forma elegante, sem explicação longa.

**Regra de tom:** sem cara de IA, sem frase motivacional, sem "desbloqueie seu
potencial" / "eleve seus resultados" / "jornada de transformação" /
"ecossistema de alta performance" / "mentalidade vencedora". Escrever como
alguém que entende de negócio fala com outro que entende de negócio.

**Regra visual:** grayscale puro, muito espaço vazio, tipografia grande, sem
gradiente, sem ícone genérico, sem foto de banco de imagem, sem card colorido.

**Objetivo do visitante ao terminar a página:** "Quero estar no meio dessa
galera." Menos explicação, mais marca, mais pertencimento.

---

## 2. Copy Final (referência de conteúdo)

### HERO
- Kicker/manifesto (opcional — ver Seção 4 para decisão A/B): *A NOVA ORDEM DE
  QUEM VENDE E VENCE.*
- Headline: **ONDE NEGÓCIO ACONTECE.**
- Sub: Um Club pra empresário, vendedor e quem tá construindo algo.
- Botão: ENTRAR PARA O ARIMO CLUB
- Microtexto: Gratuito · Acesso pelo WhatsApp

### SEÇÃO 2 — Fundo preto
- NÃO É SOBRE TROCAR CARTÃO.
- É SOBRE ESTAR PERTO DE QUEM IMPORTA.
- Lista solta: Cliente. Sócio. Fornecedor. Vendedor. Empresário. Parceiro.
- Fecho: Negócio começa com gente.

### O QUE É ARIMO — Fundo branco
- Título: ARIMO
- Aceleração · Resultado · Inteligência · Metodologia · Otimização
- Fecho: Inteligência com método vira resultado.

### O CLUB — Fundo preto
- Título: GENTE QUE TÁ NO JOGO.
- Texto: O ARIMO CLUB junta quem empreende, quem vende e quem faz negócio
  acontecer. A conversa passa por venda, gestão, IA, aquisição de cliente,
  oportunidade — tudo que faz empresa crescer. Mas principalmente pelas
  pessoas por trás disso.

### PILARES — Fundo branco (tratamento editorial, sem cards)
NEGÓCIOS — VENDAS — NETWORK — INTELIGÊNCIA — EXECUÇÃO

### FRASE DE IMPACTO — Fundo preto
**Opção A (tom conversa/negócio):**
UMA BOA CONVERSA VIRA UM BOM NEGÓCIO.
ARIMO CLUB

**Opção B (tom manifesto — recomendada):**
A NOVA ORDEM DE QUEM VENDE E VENCE.
ARIMO CLUB

> Decisão: usar a frase-manifesto **aqui** (Opção B), não repetir no Hero.
> Ver Seção 4 para racional.

### PARA QUEM — Fundo branco
- Título: PARA QUEM TÁ CONSTRUINDO.
- Texto: Empresário. Vendedor. Executivo. Líder comercial. Prestador de
  serviço. E quem tá começando, mas já sacou que relação e venda abrem porta.

### CTA FINAL — Fundo branco
- Título: ENTRA PRA MESA.
- Texto: O ARIMO CLUB é gratuito.
- Botão: ENTRAR NO ARIMO CLUB →
- Microtexto: Direto pelo WhatsApp.

---

## 3. Design Tokens (grayscale puro)

Em `src/index.css`, HSL, mapeados em `tailwind.config.ts` via `hsl(var(--token))`:

```css
--paper: 0 0% 100%;             /* fundo claro */
--ink: 0 0% 6%;                 /* texto / fundo escuro */
--paper-foreground: 0 0% 6%;    /* texto sobre --paper */
--ink-foreground: 0 0% 98%;     /* texto sobre --ink */
--line: 0 0% 88%;               /* divisores em seção clara */
--line-dark: 0 0% 22%;          /* divisores em seção escura */
--muted-foreground: 0 0% 45%;
```

Nenhuma cor direta (`bg-white`, `bg-black`, `text-gray-*`) em componente
algum — sempre via token.

**Tipografia:** sans grotesk pesada nos títulos (peso 700–900, tracking
levemente negativo, caixa alta). Corpo em peso 400–500. Sugestão: Inter
(pesos 400/500/700/900) ou Space Grotesk para mais personalidade editorial.

---

## 4. Decisão de posicionamento do manifesto

Frase avaliada: *"A nova ordem de quem vende e vence."*

- **Opção A — Kicker no Hero:** reforça a marca na entrada, mas compete com
  a headline principal e dilui o impacto do Hero (que já carrega headline +
  sub + CTA).
- **Opção B — Substitui a Frase de Impacto (Seção 5):** ganha mais força por
  vir isolada, tela cheia, sem concorrência visual, e depois que o visitante
  já entendeu "o que é ARIMO" e "o Club" — chega mais forte com contexto.

**Recomendação aplicada neste documento: Opção B.**

---

## 5. Variável de Link

```ts
// src/config/links.ts
export const ARIMO_WHATSAPP_URL = "https://wa.me/SEU_NUMERO";
```

Todo CTA da página (Hero, CTA final, sticky mobile) deve importar e usar essa
constante. Nunca hardcodar o link em componente.

---

## 6. Prompts para Lovable (sequenciais — Plan mode antes de Agent mode)

> Regra de workflow: rodar em Plan mode primeiro (1 crédito), validar, só
> depois Agent mode. Pinar versão estável após cada prompt funcionar.

### Prompt 1/3 — Fundação, Tokens e Hero

```
Contexto: Landing page de página única para o ARIMO CLUB — clube gratuito para
empresários, vendedores e executivos, com CTA único para um grupo de WhatsApp.
Não é infoproduto, não é SaaS: é marca. Referência de tom: clube de negócios
privado / marca de moda editorial. Preto e branco, muito vazio, tipografia grande.

Stack: React/Vite/TS strict + Tailwind + shadcn + Lovable Cloud (sem backend
nesta etapa — página estática).

Construa a fundação do projeto + a seção HERO:

ESTRUTURA
- Shell de página com seções full-bleed que alternam fundo claro/escuro
  (usar wrapper 

 reutilizável em
  src/components/ARIMO/Section.tsx — cada seção da página inteira vai
  usar esse wrapper daqui pra frente).
- Header minimalista: logo ARIMO (SVG que vou anexar) centralizado ou
  ancorado no topo, sem menu de navegação.
- HERO: kicker pequeno acima da headline ("A NOVA ORDEM DE QUEM VENDE E
  VENCE." — tracking largo, discreto, não deve competir com a headline),
  logo em destaque, headline grande, sub, botão primário, microtexto
  abaixo do botão. Muito espaço vertical acima e abaixo do bloco central.

COPY DO HERO (usar exatamente):
- Kicker: "A NOVA ORDEM DE QUEM VENDE E VENCE."
- Headline: "ONDE NEGÓCIO ACONTECE."
- Sub: "Um Club pra empresário, vendedor e quem tá construindo algo."
- Botão: "ENTRAR PARA O ARIMO CLUB"
- Microtexto: "Gratuito · Acesso pelo WhatsApp"

VARIÁVEL DE LINK
- Criar src/config/links.ts exportando:
  export const ARIMO_WHATSAPP_URL = "https://wa.me/SEU_NUMERO";
- Todo CTA da página (agora e nos próximos prompts) deve importar e usar
  essa constante. Não hardcodar o link em nenhum componente.

COMPORTAMENTO
- Sem gradiente, sem sombra decorativa, sem ícone genérico de startup.
- Animação de entrada discreta no Hero (fade + leve translate, sem bounce,
  sem parallax agressivo).
- Botão primário: preto sólido sobre fundo claro, sem hover colorido —
  hover é leve mudança de opacidade ou escala (98–100%).

ESTADOS
- Loading: nenhum (página estática).
- Mobile-first: Hero deve ocupar a viewport com respiro, sem cortar texto.

DESIGN TOKENS (em src/index.css, HSL — grayscale puro, zero matiz):
- --paper: 0 0% 100%          (fundo claro)
- --ink: 0 0% 6%               (texto/fundo escuro)
- --paper-foreground: 0 0% 6%  (texto sobre --paper)
- --ink-foreground: 0 0% 98%   (texto sobre --ink)
- --line: 0 0% 88%             (divisores em seção clara)
- --line-dark: 0 0% 22%        (divisores em seção escura)
- --muted-foreground: 0 0% 45%
Mapear tudo em tailwind.config.ts via hsl(var(--token)). Nenhuma cor direta
(bg-white, bg-black, text-gray-*) em componente algum — sempre via token.

TIPOGRAFIA
- Display/headline: fonte sans grotesk pesada (peso 700–900), tracking
  levemente negativo, tudo em caixa alta nos títulos grandes.
- Corpo/microtexto: mesma família, peso 400–500, tracking normal.
- Sugestão de fonte (Google Fonts): "Inter" com pesos 400/500/700/900 —
  se preferir algo com mais personalidade editorial, usar "Space Grotesk".
  Escolher uma e aplicar consistente no projeto todo.

Não modificar: nada ainda existe no projeto — apenas não fugir da paleta
grayscale definida acima nas próximas seções.

Antes de implementar, faça-me as perguntas necessárias para entender
plenamente esta feature.
```

### Prompt 2/3 — Corpo (5 seções de conteúdo)

```
Contexto: Continuação do ARIMO CLUB. A fundação (tokens, Section wrapper,
Hero, ARIMO_WHATSAPP_URL) já está pronta e estável — não alterar.

Stack: React/Vite/TS strict + Tailwind + shadcn + Lovable Cloud.

Construa as próximas 5 seções da landing, cada uma usando o componente


 já existente:

1) FRASE DE ABERTURA (fundo escuro)
   "NÃO É SOBRE TROCAR CARTÃO." / "É SOBRE ESTAR PERTO DE QUEM IMPORTA."
   Abaixo, lista solta e espaçada: Cliente. Sócio. Fornecedor. Vendedor.
   Empresário. Parceiro.
   Fecho: "Negócio começa com gente."
   Tratamento tipográfico: frases grandes, uma por linha, lista em corpo
   menor com bastante espaçamento entre itens (não é bullet list — é lista
   corrida com quebras de linha).

2) O QUE É ARIMO (fundo claro)
   Título: "ARIMO"
   As 5 palavras em tipografia grande, uma por linha ou em grid solto:
   Aceleração, Resultado, Inteligência, Metodologia, Otimização.
   Fecho curto: "Inteligência com método vira resultado."
   Nada de parágrafo explicando cada letra.

3) O CLUB (fundo escuro)
   Título: "GENTE QUE TÁ NO JOGO."
   Parágrafo único, corpo médio:
   "O ARIMO CLUB junta quem empreende, quem vende e quem faz negócio
   acontecer. A conversa passa por venda, gestão, IA, aquisição de cliente,
   oportunidade — tudo que faz empresa crescer. Mas principalmente pelas
   pessoas por trás disso."

4) PILARES (fundo claro)
   Tratamento editorial — NÃO usar cards. Usar linhas horizontais com
   divisores (--line) entre cada palavra, ocupando a largura da seção,
   tipografia grande: NEGÓCIOS / VENDAS / NETWORK / INTELIGÊNCIA / EXECUÇÃO.

5) FRASE DE IMPACTO (fundo escuro)
   "A NOVA ORDEM" / "DE QUEM VENDE" / "E VENCE."
   Pequeno abaixo, centralizado: "ARIMO CLUB"

COMPORTAMENTO
- Alternância clara de contraste entre seções (escuro/claro/escuro/claro/
  escuro), sem transição gradiente entre elas — corte seco.
- Nenhum CTA nestas 5 seções — CTA fica isolado no Hero e no fechamento
  (próximo prompt).
- Sem ícone, sem imagem de banco de imagem, sem foto de aperto de mão.

ESTADOS
- Conteúdo estático, sem loading/empty/error — não aplicável aqui.
- Mobile: cada seção deve respirar mesmo em telas pequenas — testar que
  o texto grande não quebra de forma feia (usar clamp() ou breakpoints
  Tailwind para escalar o tamanho da fonte por seção).

Não modificar: @src/components/ARIMO/Section.tsx, tokens em
src/index.css, o Hero e src/config/links.ts.

Antes de implementar, faça-me as perguntas necessárias para entender
plenamente esta feature.
```

### Prompt 3/3 — Fechamento, sticky mobile e polish

```
Contexto: Últimas peças do ARIMO CLUB. Fundação e corpo já estão prontos e
estáveis — não alterar.

Stack: React/Vite/TS strict + Tailwind + shadcn + Lovable Cloud.

Construa:

1) SEÇÃO "PARA QUEM" (fundo claro)
   Título: "PARA QUEM TÁ CONSTRUINDO."
   Texto: "Empresário. Vendedor. Executivo. Líder comercial. Prestador de
   serviço. E quem tá começando, mas já sacou que relação e venda abrem
   porta."

2) CTA FINAL (fundo claro, mesmo tom do Hero)
   Logo ARIMO novamente, centralizado.
   Título: "ENTRA PRA MESA."
   Texto: "O ARIMO CLUB é gratuito."
   Botão grande: "ENTRAR NO ARIMO CLUB →" (usa ARIMO_WHATSAPP_URL)
   Microtexto: "Direto pelo WhatsApp."

3) BARRA FIXA MOBILE
   Componente src/components/ARIMO/StickyMobileCTA.tsx:
   - Aparece só em mobile (breakpoint < md), fixo na base da tela.
   - Só fica visível depois que o usuário rola além da altura do Hero
     (usar IntersectionObserver ou scroll listener leve — sem lib pesada).
   - Texto do botão: "ENTRAR NO CLUB", usa ARIMO_WHATSAPP_URL.
   - Fundo --ink, texto --ink-foreground, borda superior --line-dark,
     leve blur/backdrop se possível — sem sombra colorida.
   - Não sobrepor o CTA final da própria página (esconder a barra quando
     a seção de CTA final estiver visível, pra não duplicar).

4) MICROANIMAÇÕES DE SCROLL
   - Fade + leve translateY nos títulos de cada seção ao entrarem na
     viewport (usar Intersection Observer, sem framer-motion se possível
     — só CSS transition + classe toggled por JS, pra manter leve).
   - Nada de animação em loop, nada de parallax agressivo, nada de
     scroll-jacking.

5) QA VISUAL FINAL
   - Conferir que nenhum componente usa cor direta (bg-white, text-black
     etc.) — tudo via token.
   - Conferir contraste AA em texto sobre --ink e sobre --paper.
   - Meta tags básicas (title, description, og:image) com o
     ARIMO_WHATSAPP_URL não exposto em texto puro no HTML além do href.

Não modificar: todas as seções de conteúdo já construídas, tokens,
Section.tsx e links.ts.

Antes de implementar, faça-me as perguntas necessárias para entender
plenamente esta feature.
```

---

## 7. Pendências antes de rodar o Prompt 1

- [ ] Confirmar `ARIMO_WHATSAPP_URL` real (link do grupo).
- [ ] Confirmar se há SVG do logo em fundo transparente, ou apenas PNG.
- [ ] Confirmar fonte final: Inter ou Space Grotesk.

**Próximo passo recomendado:** rodar Prompt 1 em Plan mode, validar tokens e
Hero, pinar versão estável antes de seguir para o Prompt 2.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://arimo-club.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f87977ed-e0d6-44d3-84da-b774062f4dba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
