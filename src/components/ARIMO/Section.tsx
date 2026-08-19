import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  tone?: "paper" | "ink";
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function Section({
  tone = "paper",
  id,
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full px-6 py-28 md:px-12 md:py-40",
        tone === "ink" ? "bg-ink text-ink-foreground" : "bg-paper text-paper-foreground",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-5xl", innerClassName)}>{children}</div>
    </section>
  );
}
