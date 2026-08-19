import { useEffect, useState } from "react";
import { ARIMO_WHATSAPP_URL } from "@/config/links";
import { cn } from "@/lib/utils";

export function StickyMobileCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const final = document.getElementById("cta-final");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(
        (entries) => setPastHero(!entries[0]?.isIntersecting),
        { threshold: 0 },
      );
      io.observe(hero);
      observers.push(io);
    }
    if (final) {
      const io = new IntersectionObserver((entries) => setFinalVisible(!!entries[0]?.isIntersecting), {
        threshold: 0,
      });
      io.observe(final);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = pastHero && !finalVisible;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-line-dark bg-ink/90 p-4 backdrop-blur transition-all duration-300 md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <a
        href={ARIMO_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-4 text-center text-sm font-bold tracking-[0.2em] text-ink-foreground uppercase"
      >
        Entrar no Club
      </a>
    </div>
  );
}
