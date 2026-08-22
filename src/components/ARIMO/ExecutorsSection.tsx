import { CtaButton } from "./CtaButton";
import { Reveal } from "./Reveal";

export function ExecutorsSection() {
  return (
    <section
      id="executores"
      className="arimo-photo-section relative min-h-[44rem] scroll-mt-6 overflow-hidden border-y border-white/10 bg-[#050505] text-[#f3f3f3] md:min-h-[82vh]"
    >
      <img
        src="/arimo-hero-new-order-bw.webp"
        alt="Empresários reunidos no ARIMO CLUB"
        width={1672}
        height={941}
        loading="lazy"
        decoding="async"
        className="arimo-photo-drift absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.3)_0%,rgba(5,5,5,.45)_40%,rgba(5,5,5,.97)_100%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,.96)_0%,rgba(5,5,5,.76)_46%,rgba(5,5,5,.28)_78%,rgba(5,5,5,.48)_100%)]" />
      <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="relative mx-auto flex min-h-[44rem] max-w-[1600px] flex-col justify-between px-6 py-10 md:min-h-[82vh] md:px-12 md:py-14">
        <Reveal>
          <p className="arimo-label text-white/58">ARIMO / PARA QUEM EXECUTA</p>
        </Reveal>

        <Reveal delay={100} className="max-w-[52rem]">
          <div className="mb-7 h-px w-16 bg-white/45" aria-hidden="true" />
          <h2 className="text-[clamp(3.25rem,5.4vw,6rem)] font-light leading-[.93] tracking-normal">
            <span className="block">Contato não gera resultado.</span>
            <span className="mt-1 block">
              A <span className="arimo-serif italic">relação certa</span>, sim.
            </span>
          </h2>
          <p className="mt-7 max-w-[38rem] text-base leading-relaxed text-white/76 md:text-lg">
            A ARIMO aproxima empresários que decidem, executam e abrem portas. Sem networking de
            palco. Com contexto para conversas virarem negócio.
          </p>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <CtaButton tone="ink" className="border-white/60 px-8 py-4">
              Solicitar acesso <span aria-hidden="true">→</span>
            </CtaButton>
            <p className="arimo-label text-white/45">Gratuito · Entrada por aprovação</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
