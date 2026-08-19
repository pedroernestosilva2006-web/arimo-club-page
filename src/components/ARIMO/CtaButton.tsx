import type { ReactNode } from "react";
import { ARIMO_WHATSAPP_URL } from "@/config/links";
import { cn } from "@/lib/utils";

export function CtaButton({
  children,
  className,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  /** Surface the button sits on. */
  tone?: "paper" | "ink";
}) {
  return (
    <a
      href={ARIMO_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center border px-12 py-5 text-[0.6875rem] font-light tracking-[0.3em] uppercase transition-colors duration-300",
        tone === "ink"
          ? "border-ink-foreground/50 text-ink-foreground hover:bg-ink-foreground hover:text-ink"
          : "border-ink/40 text-paper-foreground hover:bg-ink hover:text-ink-foreground",
        className,
      )}
    >
      {children}
    </a>
  );
}
