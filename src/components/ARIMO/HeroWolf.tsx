import { useEffect, useState } from "react";
import { HeroFallback } from "./HeroFallback";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

const TITLE = ["Onde", "negócio", "acontece."];
const SUBTITLE =
  "A nova ordem de empresários, famintos por resultado. Um Club pra empresário, vendedor e quem tá construindo algo.";


const display = "font-display font-light tracking-[-0.01em]";
const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.45em]";

export function HeroWolf() {
  const [words, setWords] = useState(0);
  const [subtitleIn, setSubtitleIn] = useState(false);
  const [ctaIn, setCtaIn] = useState(false);

  useEffect(() => {
    if (words < TITLE.length) {
      const t = setTimeout(() => setWords((w) => w + 1), words === 0 ? 350 : 420);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setSubtitleIn(true), 500);
    const t2 = setTimeout(() => setCtaIn(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [words]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6 py-28 text-ink-foreground"
    >
      <HeroFallback />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Logo tone="ink" className="mx-auto w-[min(58vw,22rem)] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]" />

        <p className={`${eyebrow} mt-12 text-ink-foreground/50`}>Nova ordem de empresários, famintos por resultado</p>

        <h1
          className={`${display} mt-8 text-[clamp(3rem,11vw,8rem)] leading-[0.92] text-ink-foreground`}
        >
          {TITLE.map((word, i) => (
            <span
              key={word}
              className={[
                "mr-[0.25em] inline-block transition-all duration-700 ease-out motion-reduce:transition-none",
                i < words ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[6px]",
                i === TITLE.length - 1 ? "italic" : "",
              ].join(" ")}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          className={`mx-auto mt-10 max-w-md text-sm leading-relaxed text-ink-foreground/65 transition-all duration-700 ease-out md:text-base ${
            subtitleIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {SUBTITLE}
        </p>

        <div
          className={`mt-14 transition-all duration-700 ease-out ${
            ctaIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <CtaButton tone="ink" className="backdrop-blur-sm">
            Entrar para o ARIMO Club
          </CtaButton>
          <p className={`${eyebrow} mt-8 text-ink-foreground/40`}>Gratuito · Acesso pelo WhatsApp</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3">
        <span className={`${eyebrow} text-ink-foreground/35`}>Role para explorar</span>
        <span className="h-10 w-px overflow-hidden bg-ink-foreground/15">
          <span className="arimo-scroll-hint block h-4 w-px bg-ink-foreground/70" />
        </span>
      </div>
    </section>
  );
}
