import { useEffect, useRef } from "react";
import heroAsset from "@/assets/table-hero.jpg.asset.json";
import { cn } from "@/lib/utils";

/**
 * CSS-only version of the hero backdrop: parallax on pointer move,
 * a slow scanline sweep and film grain. Used when WebGPU is unavailable
 * and as the server-rendered default.
 */
export function HeroFallback({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate3d(${x * -18}px, ${y * -14}px, 0) scale(1.06)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        ref={ref}
        className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "scale(1.06)" }}
      >
        <img
          src={heroAsset.url}
          alt="Mesa de reunião reservada sob lustre, em preto e branco"
          className={cn(
            "h-full w-full animate-[arimo-fade-in_1.6s_ease-out_both] object-cover object-top brightness-[1.9] contrast-[1.05] grayscale",
          )}
        />

      </div>

      {/* scanline sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="arimo-scan absolute inset-x-0 h-[18vh] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* grain + vignette */}
      <div className="arimo-grain pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--ink)_95%)]" />
    </div>
  );
}
