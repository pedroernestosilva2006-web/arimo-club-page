import { createFileRoute } from "@tanstack/react-router";
import { CtaButton } from "@/components/ARIMO/CtaButton";
import { HeroWolf } from "@/components/ARIMO/HeroWolf";
import { Logo } from "@/components/ARIMO/Logo";
import { Reveal } from "@/components/ARIMO/Reveal";
import { DiagonalPowerMarquee } from "@/components/ui/diagonal-power-marquee";
import { ArimoNetworkMap } from "@/components/ui/arimo-network-map";
import { RelationshipPerspectiveMarquee } from "@/components/ui/relationship-perspective-marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARIMO CLUB | Onde negócios acontecem" },
      { name: "description", content: "ARIMO CLUB. Onde negócios acontecem." },
    ],
  }),
  component: Index,
});

const pillars = [
  ["A", "ACELERAÇÃO"],
  ["R", "RESULTADO"],
  ["I", "INTELIGÊNCIA"],
  ["M", "METODOLOGIA"],
  ["O", "OTIMIZAÇÃO"],
];
const topics = ["NEGÓCIOS", "CRESCIMENTO", "NETWORK", "INTELIGÊNCIA", "EXECUÇÃO"];
const powerImages = [
  { src: "/arimo-power-handshake.webp", alt: "Empresários concluindo uma parceria" },
  { src: "/arimo-hero-private-table-v2.webp", alt: "Líderes reunidos em ambiente privado" },
  { src: "/arimo-power-arrival.webp", alt: "Empresários chegando para um encontro privado" },
  { src: "/arimo-founders-night.webp", alt: "Fundadores em uma conversa reservada" },
  { src: "/arimo-boardroom-men.webp", alt: "Mesa de decisão entre empresários" },
];

function Index() {
  return (
    <main className="overflow-hidden bg-[#050505] font-sans text-[#f3f3f3]">
      <HeroWolf />

      <section className="relative min-h-[78vh] overflow-hidden border-y border-white/10">
        <img
          src="/arimo-hero-new-order-bw.webp"
          alt="Empresários reunidos no ARIMO CLUB"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.08)_0%,rgba(5,5,5,.25)_42%,rgba(5,5,5,.92)_100%)]" />
        <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-between px-6 py-10 md:px-12 md:py-14">
          <p className="arimo-label text-white/60">ARIMO / PARA QUEM EXECUTA</p>
          <div className="max-w-5xl">
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,7.4rem)] font-light leading-[.92] tracking-normal">
              Para empresários
              <br />
              famintos por <span className="arimo-serif italic">resultado.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Nada de networking superficial. Aqui, conexão precisa virar negócio.
            </p>
            <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <CtaButton tone="ink" className="border-white/60 px-8 py-4">
                Solicitar meu acesso <span aria-hidden="true">→</span>
              </CtaButton>
              <p className="arimo-label text-white/45">Gratuito · Entrada por aprovação</p>
            </div>
          </div>
        </div>
      </section>

      <section className="arimo-grid relative px-6 py-32 md:px-12 md:py-52">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="arimo-label arimo-gradient-text">ACESSO</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-10 max-w-5xl text-[clamp(3rem,7.3vw,7.8rem)] font-light leading-[.94] tracking-normal">
              Tem coisa que dinheiro nenhum compra.
              <br />
              <span className="arimo-serif italic">Acesso</span> é uma delas.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="ml-auto mt-20 max-w-xl border-l border-white/30 pl-7 text-base leading-relaxed text-white/62 md:text-lg">
              Você pode ter capital, produto, estratégia e ambição. Ainda assim, continuar distante
              de oportunidades que nunca chegam até você.
              <br />
              <br />
              Porque alguns negócios não são anunciados. Algumas parcerias não são procuradas.
              Algumas portas simplesmente se abrem entre quem já está perto.
              <br />
              <br />É para diminuir essa distância que existe o ARIMO CLUB.
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="relacoes"
        className="arimo-deferred arimo-grid relative scroll-mt-6 overflow-hidden border-y border-white/10 bg-[#050505] py-28 text-[#f3f3f3] md:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <div className="px-6 md:px-12">
            <p className="arimo-label arimo-gradient-text">RELAÇÃO</p>
            <h2 className="mt-8 max-w-4xl text-[clamp(3rem,7.2vw,7.6rem)] font-light leading-[.94] tracking-normal">
              Não é sobre trocar cartão.
              <br />É sobre fazer <span className="arimo-serif italic">negócio.</span>
            </h2>
          </div>

          <div className="mt-16 border-y border-white/10 md:mt-24">
            <RelationshipPerspectiveMarquee />
          </div>

          <div className="px-6 md:px-12">
            <p className="mt-14 max-w-2xl text-xl leading-relaxed text-white/62 md:mt-16 md:text-2xl">
              Uma relação certa pode resolver em uma conversa o que levaria meses tentando sozinho.
              <br />
              <br />
              Negócio começa com relação. Resultado vem do que você faz com ela.
            </p>
            <div className="mt-12">
              <CtaButton tone="ink" className="border-white/60 px-8 py-4">
                Quero entrar nessa rede <span aria-hidden="true">→</span>
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section
        id="candidatura"
        className="scroll-mt-6 border-b border-black/10 bg-[#f2f2f2] px-6 pb-24 pt-16 text-[#090909] md:px-12 md:pb-36 md:pt-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="arimo-label arimo-gradient-text-dark">CANDIDATURA</p>
          <h2 className="mt-6 max-w-5xl text-[clamp(3.25rem,8.6vw,8.5rem)] font-light leading-[.9] tracking-normal md:mt-8">
            Não existe cobrança.
            <br />
            <span className="arimo-application-accent arimo-serif italic">Existe critério.</span>
          </h2>
          <Reveal delay={210} className="mt-12 md:mt-16">
            <div className="relative grid gap-10 overflow-hidden border-t border-black/15 pt-8 md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:pt-10">
              <span className="arimo-application-rule" aria-hidden="true" />
              <p className="max-w-xl text-base leading-relaxed text-black/65 md:text-lg">
                Nem todo mundo entra. E é justamente por isso que pode valer a pena estar dentro.
                <br />
                <br />O ARIMO CLUB é gratuito, mas cada entrada passa por análise. Não existe
                cobrança para participar. Existe critério.
              </p>
              <div>
                <CtaButton tone="paper" className="border-black/60 px-9 py-5">
                  Quero me candidatar <span aria-hidden="true">→</span>
                </CtaButton>
                <p className="arimo-label mt-5 text-black/45">Gratuito · Entrada por aprovação</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <DiagonalPowerMarquee images={powerImages} />

      <section className="arimo-grid px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto max-w-6xl">
          <p className="arimo-label arimo-gradient-text">MÉTODO ARIMO</p>
          <h2 className="mt-8 text-[clamp(3.5rem,9vw,9.5rem)] font-light leading-[.88] tracking-normal">
            Isso é ARIMO.
          </h2>
          <p className="mt-12 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Não acreditamos em conexão por conexão. Acreditamos em colocar empresários com
            interesses, desafios e ambições em comum próximos o suficiente para que coisas
            aconteçam.
          </p>
          <div className="mt-24 border-t border-white/15">
            {pillars.map(([letter, label], index) => (
              <Reveal key={letter} delay={index * 75}>
                <div className="grid grid-cols-[4rem_1fr] items-baseline border-b border-white/15 py-7 md:grid-cols-[8rem_1fr] md:py-10">
                  <span className="arimo-gradient-text arimo-serif text-5xl italic md:text-7xl">
                    {letter}
                  </span>
                  <span className="text-[clamp(1.8rem,4.2vw,4.8rem)] font-light leading-none tracking-normal">
                    {label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <CtaButton tone="ink" className="border-white/60 px-8 py-4">
              Fazer minha candidatura <span aria-hidden="true">→</span>
            </CtaButton>
            <p className="arimo-label text-white/40">Leva menos de dois minutos</p>
          </div>
        </div>
      </section>

      <ArimoNetworkMap />

      <section className="arimo-deferred arimo-photo-section relative min-h-[90vh] overflow-hidden border-y border-white/10">
        <img
          src="/arimo-boardroom-men.webp"
          alt="Empresários reunidos em uma mesa de decisões"
          width={1774}
          height={887}
          loading="lazy"
          decoding="async"
          className="arimo-photo-drift absolute inset-0 h-full w-full object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-between px-6 py-10 md:px-12 md:py-14">
          <p className="arimo-label text-white/55">PRA QUEM ESTÁ NO JOGO</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-light leading-[.9] tracking-normal">
              Pra quem está
              <br />
              no <span className="arimo-serif italic">jogo.</span>
            </h2>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Aqui se fala sobre o que move uma empresa de verdade.
            </p>
          </div>
          <div className="grid border-t border-white/25 md:grid-cols-5">
            {topics.map((topic) => (
              <div
                key={topic}
                className="arimo-topic border-b border-white/20 py-4 md:border-b-0 md:border-r md:px-4"
              >
                <p className="text-xl font-light">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="arimo-deferred arimo-photo-section relative min-h-[100svh] overflow-hidden border-b border-white/10">
        <img
          src="/arimo-power-handshake.webp"
          alt="Empresários estabelecendo uma parceria"
          width={1448}
          height={1086}
          loading="lazy"
          decoding="async"
          className="arimo-photo-drift absolute inset-0 h-full w-full object-cover object-[56%_center] grayscale md:object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.72)_0%,rgba(5,5,5,.32)_38%,rgba(5,5,5,.96)_100%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,.96)_0%,rgba(5,5,5,.72)_46%,rgba(5,5,5,.38)_100%)]" />
        <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-6 py-10 md:px-12 md:py-14">
          <p className="arimo-label text-white/55">SOZINHO / CONECTADO</p>

          <div className="grid items-end gap-10 md:grid-cols-[1.25fr_.75fr] md:gap-20">
            <Reveal>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,7.4rem)] font-light leading-[.9] tracking-normal">
                Quem tenta crescer <span className="arimo-serif italic">sozinho</span> sempre chega
                mais tarde.
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className="border-t border-white/30 pt-7 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="max-w-lg text-base leading-relaxed text-white/72 md:text-lg">
                  O próximo cliente, sócio ou fornecedor pode estar a uma apresentação de distância.
                  Estar perto das pessoas certas encurta o caminho entre ambição e resultado.
                </p>
                <div className="mt-8">
                  <CtaButton tone="ink" className="border-white/60 px-8 py-4">
                    Entrar na rede <span aria-hidden="true">→</span>
                  </CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-6 py-36 md:px-12 md:py-52">
        <div className="mx-auto max-w-6xl text-center">
          <p className="arimo-label arimo-gradient-text">ARIMO CLUB / PRIVATE BUSINESS NETWORK</p>
          <h2 className="mt-12 text-[clamp(3rem,10vw,10.5rem)] font-light leading-[.92] tracking-normal sm:leading-[.88]">
            A nova ordem
            <br />
            de empresários
            <br />
            <span className="arimo-serif italic">famintos</span> por resultado.
          </h2>
          <p className="mx-auto mt-14 max-w-2xl text-base leading-relaxed text-white/62 md:text-lg">
            Fundadores. Sócios. Empresários. Executivos. Líderes. Pessoas com algo em jogo.
            <br />
            <br />
            Com problemas reais para resolver, oportunidades para dividir e ambição para ir além.
          </p>
        </div>
      </section>

      <footer className="px-6 py-14 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo tone="ink" className="w-28" alt="ARIMO CLUB" />
            <p className="mt-5 text-[clamp(1.6rem,3vw,3rem)] font-light tracking-normal">
              Onde negócios acontecem.
            </p>
          </div>
          <div className="flex gap-5 text-xs uppercase tracking-[.18em] text-white/55">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#candidatura">Contato</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
