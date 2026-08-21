import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.32em]";

export function HeroWolf() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
    const hero = heroRef.current;
    const image = imageRef.current;
    const grid = gridRef.current;
    const atmosphere = atmosphereRef.current;
    const content = contentRef.current;

    if (!hero || !image || !grid || !atmosphere || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);

    const media = gsap.matchMedia();
    const createParallax = (mobile: boolean) => {
      const trigger = {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      gsap.fromTo(
        image,
        { yPercent: mobile ? -2 : -5, scale: mobile ? 1.035 : 1.045 },
        { yPercent: mobile ? 10 : 20, scale: mobile ? 1.07 : 1.085, ease: "none", scrollTrigger: trigger },
      );
      gsap.fromTo(
        atmosphere,
        { yPercent: -1 },
        { yPercent: mobile ? 4 : 8, ease: "none", scrollTrigger: trigger },
      );
      gsap.to(grid, {
        yPercent: mobile ? 7 : 13,
        ease: "none",
        scrollTrigger: trigger,
      });
      gsap.to(content, {
        yPercent: mobile ? 8 : 16,
        opacity: mobile ? 0.72 : 0.45,
        ease: "none",
        scrollTrigger: trigger,
      });
    };

    media.add("(max-width: 767px)", () => createParallax(true));
    media.add("(min-width: 768px)", () => createParallax(false));
    ScrollTrigger.refresh();

    return () => {
      media.revert();
      gsap.ticker.remove(tick);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={heroRef} data-parallax-layers className="arimo-hero relative min-h-screen overflow-hidden bg-[#050505] text-[#f2f0eb]">
      <div ref={gridRef} data-parallax-layer="1" className="arimo-grid absolute -inset-y-[8%] inset-x-0 opacity-70 will-change-transform" />
      <div ref={imageRef} data-parallax-layer="2" className="arimo-hero-image arimo-hero-parallax absolute -inset-y-[12%] inset-x-0 bg-[url('/arimo-hero-new-order-bw.png')] bg-cover opacity-100 will-change-transform" />
      <div ref={atmosphereRef} data-parallax-layer="3" className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.9)_0%,rgba(5,5,5,.64)_34%,rgba(5,5,5,.12)_68%,rgba(5,5,5,.03)_100%)]" />
        <div className="absolute inset-0 bg-black/5" />
        <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
      </div>
      <div
        className={`arimo-intro fixed inset-0 z-50 flex items-center justify-center bg-[#050505] ${intro ? "is-active" : "is-gone"}`}
      >
        <div className="w-full px-8">
          <p className={`${eyebrow} text-center text-white/65`}>ARIMO / PRIVATE BUSINESS NETWORK</p>
          <span className="arimo-intro-line mt-7 block h-px bg-[#927451]" />
        </div>
      </div>
      <div ref={contentRef} data-parallax-layer="4" className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 pb-10 pt-7 will-change-transform md:px-12 md:pb-12 md:pt-10">
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
