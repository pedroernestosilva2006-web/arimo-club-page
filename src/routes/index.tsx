import { createFileRoute } from "@tanstack/react-router";
import { CtaButton } from "@/components/ARIMO/CtaButton";
import { HeroWolf } from "@/components/ARIMO/HeroWolf";
import { Logo } from "@/components/ARIMO/Logo";
import { Reveal } from "@/components/ARIMO/Reveal";
import { DiagonalPowerMarquee } from "@/components/ui/diagonal-power-marquee";

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
  { src: "/arimo-power-handshake.png", alt: "Empresários concluindo uma parceria" },
  { src: "/arimo-hero-private-table-v2.png", alt: "Líderes reunidos em ambiente privado" },
  { src: "/arimo-power-arrival.png", alt: "Empresários chegando para um encontro privado" },
  { src: "/arimo-founders-night.png", alt: "Fundadores em uma conversa reservada" },
  { src: "/arimo-boardroom-men.png", alt: "Mesa de decisão entre empresários" },
];

export function Index() {
  return (
    <main className="overflow-hidden bg-[#050505] font-sans text-[#f2f0eb]">
      <HeroWolf />

      <section className="arimo-grid relative px-6 py-32 md:px-12 md:py-52">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="arimo-label text-[#927451]">ACESSO</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-10 max-w-5xl text-[clamp(3rem,7.3vw,7.8rem)] font-light leading-[.94] tracking-normal">
              Tem coisa que dinheiro nenhum compra.
              <br />
              <span className="arimo-serif italic">Acesso</span> é uma delas.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="ml-auto mt-20 max-w-xl border-l border-[#927451] pl-7 text-base leading-relaxed text-white/62 md:text-lg">
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

      <section className="border-y border-white/10 bg-[#f2f0eb] px-6 py-28 text-[#090909] md:px-12 md:py-40">
        <div className="mx-auto max-w-6xl">
          <p className="arimo-label text-[#927451]">RELAÇÃO</p>
          <h2 className="mt-8 max-w-4xl text-[clamp(3rem,7.2vw,7.6rem)] font-light leading-[.94] tracking-normal">
            Não é sobre trocar cartão.
            <br />É sobre fazer <span className="arimo-serif italic">negócio.</span>
          </h2>
          <div className="mt-24 overflow-hidden border-y border-black/15 py-4">
            <div className="arimo-word-rail whitespace-nowrap text-[clamp(2.6rem,6vw,6.5rem)] font-light leading-none tracking-normal">
              CLIENTE · SÓCIO · PARCEIRO · FORNECEDOR · CAPITAL · INDICAÇÃO ·
            </div>
          </div>
          <p className="mt-16 max-w-2xl text-xl leading-relaxed text-black/65 md:text-2xl">
            Uma relação certa pode resolver em uma conversa o que levaria meses tentando sozinho.
            <br />
            <br />
            Negócio começa com relação. Resultado vem do que você faz com ela.
          </p>
        </div>
      </section>

      <DiagonalPowerMarquee images={powerImages} />

      <section className="arimo-grid px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto max-w-6xl">
          <p className="arimo-label text-[#927451]">MÉTODO ARIMO</p>
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
                  <span className="arimo-serif text-5xl italic text-[#927451] md:text-7xl">
                    {letter}
                  </span>
                  <span className="text-[clamp(1.8rem,4.2vw,4.8rem)] font-light leading-none tracking-normal">
                    {label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="arimo-photo-section relative min-h-[90vh] overflow-hidden border-y border-white/10">
        <div className="arimo-photo-drift absolute inset-0 bg-[url('/arimo-boardroom-men.png')] bg-cover bg-center grayscale" />
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

      <section className="grid min-h-[92vh] border-b border-white/10 md:grid-cols-2">
        <div className="arimo-portrait relative flex min-h-[65vh] flex-col justify-between overflow-hidden border-b border-white/10 p-8 md:min-h-0 md:border-b-0 md:border-r md:p-14">
          <div className="arimo-portrait-image absolute inset-0 bg-[url('/arimo-founders-night.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/45" />
          <p className="arimo-label relative text-white/55">SOZINHO</p>
          <p className="relative max-w-md text-[clamp(2.3rem,5vw,5.5rem)] font-light leading-[.94] tracking-normal">
            Tem empresário tentando descobrir tudo sozinho.
          </p>
        </div>
        <div className="flex flex-col justify-between bg-[#f2f0eb] p-8 text-[#090909] md:p-14">
          <p className="arimo-label text-[#927451]">CONECTADO</p>
          <div>
            <p className="max-w-md text-[clamp(2.3rem,5vw,5.5rem)] font-light leading-[.94] tracking-normal">
              E tem empresário que já entendeu como o jogo funciona.
            </p>
            <p className="mt-12 max-w-lg text-base leading-relaxed text-black/65">
              Seu próximo cliente pode estar a uma apresentação de distância. Seu próximo sócio
              também.
              <br />
              <br />A oportunidade que muda o ano da sua empresa pode começar com alguém que hoje
              ainda não sabe que você existe.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-36 md:px-12 md:py-52">
        <div className="mx-auto max-w-6xl text-center">
          <p className="arimo-label text-[#927451]">ARIMO CLUB / PRIVATE BUSINESS NETWORK</p>
          <h2 className="mt-12 text-[clamp(3.8rem,10vw,10.5rem)] font-light leading-[.88] tracking-normal">
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

      <section
        id="candidatura"
        className="border-y border-white/10 bg-[#f2f0eb] px-6 py-32 text-[#090909] md:px-12 md:py-48"
      >
        <div className="mx-auto max-w-6xl">
          <p className="arimo-label text-[#927451]">CANDIDATURA</p>
          <h2 className="mt-10 max-w-5xl text-[clamp(3.5rem,8.6vw,9rem)] font-light leading-[.9] tracking-normal">
            Não existe cobrança.
            <br />
            <span className="arimo-serif italic">Existe critério.</span>
          </h2>
          <div className="mt-20 grid gap-12 border-t border-black/15 pt-10 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-xl text-base leading-relaxed text-black/65 md:text-lg">
              Nem todo mundo entra. E é justamente por isso que pode valer a pena estar dentro.
              <br />
              <br />O ARIMO CLUB é gratuito, mas cada entrada passa por análise. Não existe cobrança
              para participar. Existe critério.
            </p>
            <div>
              <CtaButton tone="paper" className="border-black/60 px-9 py-5">
                Quero me candidatar <span aria-hidden="true">→</span>
              </CtaButton>
              <p className="arimo-label mt-5 text-black/45">Gratuito · Entrada por aprovação</p>
            </div>
          </div>
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
