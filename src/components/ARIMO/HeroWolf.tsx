import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.32em]";

export function HeroWolf() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const hero = heroRef.current;
      const image = imageRef.current;
      if (!hero || !image) return;
      const distance = Math.min(window.scrollY, hero.offsetHeight);
      image.style.transform = `translate3d(0, ${distance * 0.12}px, 0) scale(1.04)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className="arimo-hero relative min-h-screen overflow-hidden bg-[#050505] text-[#f2f0eb]">
      <div className="arimo-grid absolute inset-0 opacity-70" />
      <div ref={imageRef} className="arimo-hero-parallax absolute -inset-y-[12%] inset-x-0 bg-[url('/arimo-hero-new-order-bw.png')] bg-cover bg-center opacity-100 will-change-transform" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.9)_0%,rgba(5,5,5,.64)_34%,rgba(5,5,5,.12)_68%,rgba(5,5,5,.03)_100%)]" />
      <div className="absolute inset-0 bg-black/5" />
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
          <p className={`${eyebrow} mb-7 text-[#b7b7b7]`}>ARIMO CLUB / BRASIL</p>
          <h1 className="max-w-[11ch] text-[clamp(3.45rem,7.6vw,7.8rem)] font-sans font-light leading-[.92] tracking-normal">
            <span className={`arimo-mask block ${ready ? "is-visible" : ""}`}>A nova</span>
            <span
              className={`arimo-mask -mb-[0.12em] block pb-[0.12em] ${ready ? "is-visible delay-1" : ""}`}
            >
              ordem de
            </span>
            <span className={`arimo-mask block ${ready ? "is-visible delay-3" : ""}`}>
              empresários.
            </span>
          </h1>
          <div
            className={`mt-12 w-full min-w-0 max-w-md transition-all duration-700 ${ready ? "translate-y-0 opacity-100 delay-2" : "translate-y-5 opacity-0"}`}
          >
            <div className="flex flex-wrap items-center gap-6">
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
