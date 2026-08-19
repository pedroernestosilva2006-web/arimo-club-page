# Hero animado "lobo" — ARIMO CLUB

Novo hero de abertura em tela cheia com a imagem que você enviou, efeito de profundidade animado (WebGPU), scanline e entrada de texto palavra por palavra. Paleta segue estritamente preto e branco na interface.

## O que muda

1. **Hero 3D no topo da home**
   - Imagem enviada como textura principal, com parallax sutil seguindo o mouse.
   - Linha de varredura (scanline) subindo e descendo + brilho (bloom), como no componente enviado.
   - Título em Cormorant/Jost aparecendo palavra por palavra, subtítulo depois, e o CTA "Entrar para o ARIMO Club".
   - Logo ARIMO no topo e indicador "role para explorar" embaixo.

2. **Fallback obrigatório**
   - Se o navegador não tiver WebGPU (ou for mobile fraco), o mesmo hero é renderizado como imagem estática com parallax leve, grão e scanline em CSS. Mesma composição de texto e CTA, sem tela preta.
   - O hero só carrega no cliente; o servidor renderiza a versão estática, evitando erro de SSR.

3. **Paleta**
   - Interface 100% escala de cinza (tokens paper/ink/line atuais). Sem amarelo em botões ou detalhes.
   - A imagem do hero é aplicada em tratamento monocromático para casar com a identidade.

4. **Resto da página**
   - Seções atuais (Abertura, O que é ARIMO, O Club, Pilares, Frase de Impacto, Para Quem, CTA final) permanecem, agora entrando depois do novo hero.

## Detalhes técnicos

- Dependências novas: `three`, `@react-three/fiber`, `@react-three/drei`.
- Arquivos:
  - `src/components/ui/hero-futuristic.tsx` — cena WebGPU (Canvas + PostProcessing + material TSL), adaptada do código enviado. O JSX colado veio truncado, então a malha, o `<Canvas>` e o markup do texto serão reescritos completos.
  - `src/components/ARIMO/HeroWolf.tsx` — wrapper: detecta `navigator.gpu`, carrega a cena via `React.lazy` dentro de `<ClientOnly>`, senão renderiza o fallback CSS.
  - `src/components/ARIMO/HeroFallback.tsx` — versão estática/CSS (parallax, grão, scanline).
  - `src/routes/index.tsx` — substitui a seção `#hero` atual pelo `HeroWolf`.
- Imagem enviada vira asset via `lovable-assets` (CDN), usada como textura e como imagem do fallback. O depth map do exemplo original não serve para essa imagem; o deslocamento de profundidade usará um mapa derivado da luminância da própria imagem.
- Import de `three/webgpu` fica só dentro do módulo carregado dinamicamente, para não entrar no bundle de SSR.
- Limitação: o preview daqui não tem GPU, então só consigo validar o caminho de fallback automaticamente; o caminho WebGPU você confere no seu navegador.
