import { lazy, Suspense, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const LeadDialog = lazy(() =>
  import("./LeadDialog").then(({ LeadDialog: Component }) => ({ default: Component })),
);

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
  const [dialogRequested, setDialogRequested] = useState(false);
  const buttonClassName = cn(
    "inline-flex items-center justify-center border px-12 py-5 text-[0.6875rem] font-light tracking-[0.3em] uppercase transition-colors duration-300",
    tone === "ink"
      ? "border-ink-foreground/50 text-ink-foreground hover:bg-ink-foreground hover:text-ink"
      : "border-ink/40 text-paper-foreground hover:bg-ink hover:text-ink-foreground",
    className,
  );

  if (!dialogRequested) {
    return (
      <button type="button" className={buttonClassName} onClick={() => setDialogRequested(true)}>
        {children}
      </button>
    );
  }

  return (
    <Suspense
      fallback={
        <button type="button" className={buttonClassName} disabled>
          {children}
        </button>
      }
    >
      <LeadDialog initialOpen>
        <button type="button" className={buttonClassName}>
          {children}
        </button>
      </LeadDialog>
    </Suspense>
  );
}
