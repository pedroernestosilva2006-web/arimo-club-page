import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.32em]";

export function HeroWolf() {
  const [ready, setReady] = useState(false);
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    const timer = window.setTimeout(() => setIntro(false), 1350);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="arimo-hero relative min-h-screen overflow-hidden bg-[#050505] text-[#f2f0eb]">
      <div className="arimo-grid absolute inset-0 opacity-70" />
      <div className="arimo-hero-image absolute inset-0 bg-[url('/arimo-hero-private-table-v2.png')] bg-cover bg-[position:68%_center] opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.86)_34%,rgba(5,5,5,.32)_70%,rgba(5,5,5,.08)_100%)]" />
      <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div
        className={`arimo-intro fixed inset-0 z-50 flex items-center justify-center bg-[#050505] ${intro ? "is-active" : "is-gone"}`}
      >
        <div className="w-full px-8">
          <p className={`${eyebrow} text-center text-white/65`}>ARIMO / PRIVATE BUSINESS NETWORK</p>
          <span className="arimo-intro-line mt-7 block h-px bg-[#927451]" />
        </div>
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 pb-10 pt-7 md:px-12 md:pb-12 md:pt-10">
        <header className="flex items-center justify-between border-b border-white/15 pb-5">
          <Logo tone="ink" className="w-16 md:w-20" />
          <span className={`${eyebrow} hidden text-white/55 sm:inline`}>Private business network</span>
        </header>
        <div className="flex flex-1 flex-col justify-center pb-10 pt-24 md:max-w-5xl md:pb-0">
          <p className={`${eyebrow} mb-7 text-[#b7b7b7]`}>REDE PRIVADA DE EMPRESÁRIOS</p>
          <h1 className="max-w-[10ch] text-[clamp(3.45rem,7.6vw,7.8rem)] font-sans font-light leading-[.92] tracking-normal">
            <span className={`arimo-mask block ${ready ? "is-visible" : ""}`}>Onde</span>
            <span
              className={`arimo-mask -mb-[0.12em] block pb-[0.12em] ${ready ? "is-visible delay-1" : ""}`}
            >
              negócios
            </span>
            <span className={`arimo-mask block ${ready ? "is-visible delay-3" : ""}`}>
              acontecem.
            </span>
          </h1>
          <div
            className={`mt-12 w-full min-w-0 max-w-md transition-all duration-700 ${ready ? "translate-y-0 opacity-100 delay-2" : "translate-y-5 opacity-0"}`}
          >
            <p className="text-base leading-relaxed text-white/72 md:text-lg">
              A nova ordem de empresários famintos por resultado.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              Um Club para quem entendeu que os negócios que mudam o jogo raramente começam no feed.
              Começam com uma apresentação. Uma indicação. Uma parceria. Uma porta que se abre.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <CtaButton tone="ink" className="arimo-button border-[#b7b7b7]/65 px-7 py-4">
                Quero me candidatar <span aria-hidden="true">→</span>
              </CtaButton>
              <span className={`${eyebrow} text-white/45`}>Gratuito · Entrada por aprovação</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 pt-5">
          <span className={`${eyebrow} text-white/45`}>ROLE PARA EXPLORAR ↓</span>
        </div>
      </div>
    </section>
  );
}
