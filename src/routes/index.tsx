import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/arimo-logo.png.asset.json";
import { Section } from "@/components/ARIMO/Section";
import { Reveal } from "@/components/ARIMO/Reveal";
import { CtaButton } from "@/components/ARIMO/CtaButton";
import { StickyMobileCTA } from "@/components/ARIMO/StickyMobileCTA";

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

function Index() {
  return (
    <main className="bg-paper font-sans">
      {/* HERO */}
      <Section id="hero" tone="paper" className="flex min-h-screen items-center py-24">
        <Reveal className="w-full text-center">
          <img
            src={logoAsset.url}
            alt="ARIMO"
            className="mx-auto mb-16 w-40 md:w-56"
            width={224}
            height={224}
          />
          <h1 className="text-[clamp(2.5rem,9vw,7rem)] leading-[0.95] font-bold tracking-tight uppercase">
            Onde negócio
            <br />
            acontece.
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
            Um Club pra empresário, vendedor e quem tá construindo algo.
          </p>
          <div className="mt-12">
            <CtaButton>Entrar para o ARIMO Club</CtaButton>
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Gratuito · Acesso pelo WhatsApp
          </p>
        </Reveal>
      </Section>

      {/* 1 — ABERTURA */}
      <Section tone="ink">
        <Reveal>
          <h2 className="text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] font-bold tracking-tight uppercase">
            Não é sobre trocar cartão.
            <br />
            É sobre estar perto de quem importa.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-lg text-ink-foreground/60 md:text-2xl">
            {PESSOAS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-20 text-xl font-medium md:text-3xl">Negócio começa com gente.</p>
        </Reveal>
      </Section>

      {/* 2 — O QUE É ARIMO */}
      <Section tone="paper">
        <Reveal>
          <h2 className="text-[clamp(3rem,12vw,9rem)] leading-none font-bold tracking-tight">
            ARIMO
          </h2>
        </Reveal>
        <div className="mt-16 space-y-2">
          {WORDS.map((w, i) => (
            <Reveal key={w} delay={i * 80}>
              <p className="text-[clamp(1.5rem,4.5vw,3rem)] leading-tight font-medium tracking-tight">
                {w}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-20 border-t border-line pt-8 text-lg text-muted-foreground md:text-xl">
            Inteligência com método vira resultado.
          </p>
        </Reveal>
      </Section>

      {/* 3 — O CLUB */}
      <Section tone="ink">
        <Reveal>
          <h2 className="text-[clamp(2rem,7vw,5rem)] leading-none font-bold tracking-tight uppercase">
            Gente que tá no jogo.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-ink-foreground/75 md:text-2xl">
            O ARIMO CLUB junta quem empreende, quem vende e quem faz negócio acontecer. A conversa
            passa por venda, gestão, IA, aquisição de cliente, oportunidade — tudo que faz empresa
            crescer. Mas principalmente pelas pessoas por trás disso.
          </p>
        </Reveal>
      </Section>

      {/* 4 — PILARES */}
      <Section tone="paper" className="py-20 md:py-28">
        <div className="border-t border-line">
          {PILARES.map((p, i) => (
            <Reveal key={p} delay={i * 60}>
              <div className="border-b border-line py-8 md:py-12">
                <span className="text-[clamp(1.75rem,7vw,5rem)] leading-none font-bold tracking-tight">
                  {p}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5 — FRASE DE IMPACTO */}
      <Section tone="ink" className="py-40 md:py-56">
        <Reveal className="text-center">
          <p className="text-[clamp(2.25rem,9vw,7rem)] leading-[0.95] font-bold tracking-tight uppercase">
            A nova ordem
            <br />
            de quem vende
            <br />e vence.
          </p>
          <p className="mt-16 text-xs tracking-[0.4em] text-ink-foreground/50 uppercase">
            ARIMO CLUB
          </p>
        </Reveal>
      </Section>

      {/* 6 — PARA QUEM */}
      <Section tone="paper">
        <Reveal>
          <h2 className="text-[clamp(2rem,7vw,5rem)] leading-none font-bold tracking-tight uppercase">
            Para quem tá construindo.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
            Empresário. Vendedor. Executivo. Líder comercial. Prestador de serviço. E quem tá
            começando, mas já sacou que relação e venda abrem porta.
          </p>
        </Reveal>
      </Section>

      {/* 7 — CTA FINAL */}
      <Section id="cta-final" tone="paper" className="py-40 md:py-56">
        <Reveal className="text-center">
          <img
            src={logoAsset.url}
            alt="ARIMO CLUB"
            className="mx-auto mb-16 w-32 md:w-44"
            width={176}
            height={176}
            loading="lazy"
          />
          <h2 className="text-[clamp(2.5rem,9vw,6rem)] leading-none font-bold tracking-tight uppercase">
            Entra pra mesa.
          </h2>
          <p className="mt-8 text-lg text-muted-foreground">O ARIMO CLUB é gratuito.</p>
          <div className="mt-12">
            <CtaButton className="px-12 py-6">Entrar no ARIMO Club →</CtaButton>
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Direto pelo WhatsApp.
          </p>
        </Reveal>
      </Section>

      <StickyMobileCTA />
    </main>
  );
}
