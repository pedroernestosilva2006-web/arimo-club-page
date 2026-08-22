import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/ui/tilt-card";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.32em]";
const heroTickerItems = ["ACESSO", "NEGÓCIOS", "RESULTADO", "DECISÃO"];

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        const hero = heroRef.current;
        const image = imageRef.current;
        const grid = gridRef.current;
        const atmosphere = atmosphereRef.current;
        const content = contentRef.current;

        if (cancelled || !hero || !image || !grid || !atmosphere || !content) return;

        gsap.registerPlugin(ScrollTrigger);

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
            { yPercent: mobile ? -1 : -3, scale: 1 },
            {
              yPercent: mobile ? 10 : 18,
              scale: mobile ? 0.94 : 0.9,
              ease: "none",
              scrollTrigger: trigger,
            },
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
            yPercent: mobile ? 5 : 10,
            opacity: mobile ? 0.78 : 0.55,
            ease: "none",
            scrollTrigger: trigger,
          });
        };

        media.add("(max-width: 767px)", () => createParallax(true));
        media.add("(min-width: 768px)", () => createParallax(false));
        ScrollTrigger.refresh();
        cleanup = () => media.revert();
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      data-parallax-layers
      className="arimo-hero relative min-h-[94svh] overflow-hidden bg-[#050505] text-[#f3f3f3] md:min-h-[94vh]"
    >
      <div
        ref={gridRef}
        data-parallax-layer="1"
        className="arimo-grid absolute -inset-y-[8%] inset-x-0 opacity-70 will-change-transform"
      />
      <div
        ref={atmosphereRef}
        data-parallax-layer="3"
        className="absolute -inset-y-[8%] inset-x-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#0a0a0a_48%,#050505_100%)]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.07]" />
        <div className="absolute inset-x-0 top-[54%] h-px bg-white/[0.05]" />
        <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
        <div className="arimo-hero-perspective" aria-hidden="true">
          <div className="arimo-hero-perspective-plane">
            <div className="arimo-hero-perspective-track">
              {[0, 1].map((group) => (
                <div className="arimo-hero-perspective-group" key={group}>
                  {heroTickerItems.map((item) => (
                    <span key={`${group}-${item}`}>{item}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`arimo-intro fixed inset-0 z-50 flex items-center justify-center bg-[#050505] ${intro ? "is-active" : "is-gone"}`}
      >
        <div className="w-full px-8">
          <p className={`${eyebrow} text-center text-white/65`}>ARIMO / PRIVATE BUSINESS NETWORK</p>
          <span className="arimo-intro-line mt-7 block h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
        </div>
      </div>
      <div className="relative mx-auto flex min-h-[94svh] w-full max-w-[1600px] flex-col px-6 pb-8 pt-6 md:min-h-[94vh] md:px-12 md:pb-9 md:pt-8">
        <header className="flex items-center justify-between border-b border-white/15 pb-4">
          <Logo tone="ink" className="w-14 md:w-[4.5rem]" />
          <span className={`${eyebrow} hidden text-white/55 sm:inline`}>
            Private business network
          </span>
        </header>
        <div
          ref={contentRef}
          data-parallax-layer="4"
          className="flex flex-1 flex-col items-center justify-center py-5 text-center will-change-transform md:py-3"
        >
          <p className={`${eyebrow} arimo-gradient-text mb-4 md:mb-5`}>SEU ACESSO / ARIMO CLUB</p>
          <h1 className="relative z-10 w-full text-[clamp(2.65rem,7vw,6rem)] font-light leading-[.84] tracking-normal">
            <span className={`arimo-mask block font-sans ${ready ? "is-visible" : ""}`}>
              A nova ordem
            </span>
            <span
              className={`arimo-mask -mb-[0.24em] block pb-[0.24em] ${ready ? "is-visible delay-1" : ""}`}
            >
              <span className="arimo-gradient-text arimo-serif block whitespace-nowrap text-[.9em] leading-[1.04] italic sm:text-[1em]">
                de empresários.
              </span>
            </span>
          </h1>
          <div
            ref={imageRef}
            data-parallax-layer="2"
            className="arimo-hero-parallax relative -mb-3 -mt-1 w-[102vw] max-w-[900px] will-change-transform md:-mb-8 md:-mt-5 md:w-[72vw]"
          >
            <div className={`arimo-card-enter ${ready ? "is-visible" : ""}`}>
              <div className="arimo-card-float">
                <TiltCard
                  effect="evade"
                  tiltLimit={8}
                  scale={1.025}
                  perspective={1500}
                  spotlightMask="url('/arimo-access-card-cutout.webp')"
                  className="mx-auto"
                >
                  <img
                    src="/arimo-access-card-cutout.webp"
                    alt="Cartão de acesso ARIMO CLUB Founders Edition"
                    width={1672}
                    height={941}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="arimo-card-object h-auto w-full select-none"
                    draggable={false}
                  />
                </TiltCard>
              </div>
            </div>
          </div>
          <div
            className={`relative z-20 w-full min-w-0 max-w-lg transition-all duration-700 ${ready ? "translate-y-0 opacity-100 delay-2" : "translate-y-5 opacity-0"}`}
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <CtaButton
                tone="ink"
                className="arimo-button shrink-0 whitespace-nowrap border-[#b7b7b7]/65 px-7 py-4"
              >
                Solicitar meu acesso <span aria-hidden="true">→</span>
              </CtaButton>
              <span className={`${eyebrow} text-white/45`}>Gratuito · Entrada por aprovação</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
