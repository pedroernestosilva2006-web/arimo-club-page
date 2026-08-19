import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/ARIMO/Section";
import { Reveal } from "@/components/ARIMO/Reveal";
import { CtaButton } from "@/components/ARIMO/CtaButton";
import { StickyMobileCTA } from "@/components/ARIMO/StickyMobileCTA";
import { Logo } from "@/components/ARIMO/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARIMO CLUB — Onde negócio acontece" },
      {
        name: "description",
        content:
          "Club gratuito para empresário, vendedor e quem tá construindo algo. Aceleração, Resultado, Inteligência, Metodologia, Otimização.",
      },
      { property: "og:title", content: "ARIMO CLUB — Onde negócio acontece" },
      {
        property: "og:description",
        content: "Um Club pra empresário, vendedor e quem tá construindo algo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WORDS = ["Aceleração", "Resultado", "Inteligência", "Metodologia", "Otimização"];
const PILARES = ["NEGÓCIOS", "VENDAS", "NETWORK", "INTELIGÊNCIA", "EXECUÇÃO"];
const PESSOAS = ["Cliente.", "Sócio.", "Fornecedor.", "Vendedor.", "Empresário.", "Parceiro."];

const display = "font-display font-light tracking-[-0.01em]";
const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.45em]";

function Index() {
  return (
    <main className="bg-paper font-sans font-light">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center py-6">
        <Logo tone="ink" className="h-5 w-auto opacity-70 md:h-6" />
      </header>

      {/* HERO */}
      <Section
        id="hero"
        tone="ink"
        className="flex min-h-screen items-center py-32"
        innerClassName="max-w-4xl"
      >
        <Reveal className="w-full text-center">
          <Logo tone="ink" className="mx-auto w-[min(78vw,34rem)]" />
          <p className={`${eyebrow} mt-14 text-ink-foreground/45`}>
            A nova ordem de quem vende e vence
          </p>
          <h1
            className={`${display} mt-10 text-[clamp(3rem,11vw,8rem)] leading-[0.92] text-ink-foreground`}
          >
            Onde negócio
            <br />
            <em className="italic">acontece.</em>
          </h1>
          <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-ink-foreground/60 md:text-base">
            Um Club pra empresário, vendedor e quem tá construindo algo.
          </p>
          <div className="mt-14">
            <CtaButton tone="ink">Entrar para o ARIMO Club</CtaButton>
          </div>
          <p className={`${eyebrow} mt-8 text-ink-foreground/40`}>
            Gratuito · Acesso pelo WhatsApp
          </p>
        </Reveal>
      </Section>

      {/* 1 — ABERTURA */}
      <Section tone="paper">
        <Reveal>
          <h2 className={`${display} text-[clamp(2.25rem,7vw,5.5rem)] leading-[1.05]`}>
            Não é sobre trocar cartão.
            <br />
            <em className="italic">É sobre estar perto de quem importa.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className={`${eyebrow} mt-16 flex flex-wrap gap-x-10 gap-y-5 text-muted-foreground`}>
            {PESSOAS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <p className={`${display} mt-20 border-t border-line pt-10 text-2xl md:text-4xl`}>
            Negócio começa com gente.
          </p>
        </Reveal>
      </Section>

      {/* 2 — O QUE É ARIMO */}
      <Section tone="ink" innerClassName="text-center">
        <Reveal>
          <Logo tone="ink" className="mx-auto w-[min(60vw,22rem)]" />
        </Reveal>
        <div className="mt-20 space-y-5">
          {WORDS.map((w, i) => (
            <Reveal key={w} delay={i * 80}>
              <p className={`${display} text-[clamp(1.75rem,5vw,3.5rem)] leading-none`}>{w}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={220}>
          <p className={`${eyebrow} mt-20 text-ink-foreground/45`}>
            Inteligência com método vira resultado
          </p>
        </Reveal>
      </Section>

      {/* 3 — O CLUB */}
      <Section tone="paper">
        <Reveal>
          <h2 className={`${display} text-[clamp(2.25rem,7vw,5.5rem)] leading-none`}>
            Gente que tá <em className="italic">no jogo.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-12 max-w-2xl text-base leading-loose text-muted-foreground md:text-lg">
            O ARIMO CLUB junta quem empreende, quem vende e quem faz negócio acontecer. A conversa
            passa por venda, gestão, IA, aquisição de cliente, oportunidade — tudo que faz empresa
            crescer. Mas principalmente pelas pessoas por trás disso.
          </p>
        </Reveal>
      </Section>

      {/* 4 — PILARES */}
      <Section tone="paper" className="py-16 md:py-24">
        <div className="border-t border-line">
          {PILARES.map((p, i) => (
            <Reveal key={p} delay={i * 60}>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-8 md:py-11">
                <span className={`${display} text-[clamp(1.75rem,6vw,4rem)] leading-none`}>
                  {p}
                </span>
                <span className={`${eyebrow} text-muted-foreground`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5 — FRASE DE IMPACTO */}
      <Section tone="ink" className="py-40 md:py-60" innerClassName="text-center max-w-4xl">
        <Reveal>
          <p className={`${display} text-[clamp(2.5rem,9vw,7rem)] leading-[0.95]`}>
            A nova ordem
            <br />
            de quem vende
            <br />
            <em className="italic">e vence.</em>
          </p>
          <Logo tone="ink" className="mx-auto mt-16 w-32 opacity-60" />
        </Reveal>
      </Section>

      {/* 6 — PARA QUEM */}
      <Section tone="paper">
        <Reveal>
          <h2 className={`${display} text-[clamp(2.25rem,7vw,5.5rem)] leading-[1.02]`}>
            Para quem tá <em className="italic">construindo.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-12 max-w-2xl text-base leading-loose text-muted-foreground md:text-lg">
            Empresário. Vendedor. Executivo. Líder comercial. Prestador de serviço. E quem tá
            começando, mas já sacou que relação e venda abrem porta.
          </p>
        </Reveal>
      </Section>

      {/* 7 — CTA FINAL */}
      <Section
        id="cta-final"
        tone="ink"
        className="py-40 md:py-56"
        innerClassName="text-center max-w-3xl"
      >
        <Reveal>
          <Logo tone="ink" className="mx-auto w-[min(64vw,26rem)]" alt="ARIMO CLUB" />
          <h2 className={`${display} mt-14 text-[clamp(2.5rem,8vw,6rem)] leading-none`}>
            Entra pra <em className="italic">mesa.</em>
          </h2>
          <p className="mt-8 text-sm text-ink-foreground/60 md:text-base">
            O ARIMO CLUB é gratuito.
          </p>
          <div className="mt-14">
            <CtaButton tone="ink" className="px-14 py-6">
              Entrar no ARIMO Club →
            </CtaButton>
          </div>
          <p className={`${eyebrow} mt-8 text-ink-foreground/40`}>Direto pelo WhatsApp</p>
        </Reveal>
      </Section>

      {/* FOOTER */}
      <footer className="flex items-center justify-center gap-4 border-t border-line bg-paper py-10">
        <Logo tone="paper" className="h-7 w-auto" />
        <span className={`${eyebrow} text-muted-foreground`}>Club</span>
      </footer>

      <StickyMobileCTA />
    </main>
  );
}
