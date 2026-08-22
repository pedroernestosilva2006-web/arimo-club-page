import { lazy, Suspense, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import GradientButton from "@/components/ui/button-1";

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
  const buttonClassName = cn("px-12 py-5", className);

  if (!dialogRequested) {
    return (
      <GradientButton
        tone={tone}
        className={buttonClassName}
        onClick={() => setDialogRequested(true)}
      >
        {children}
      </GradientButton>
    );
  }

  return (
    <Suspense
      fallback={
        <GradientButton tone={tone} className={buttonClassName} disabled>
          {children}
        </GradientButton>
      }
    >
      <LeadDialog initialOpen>
        <GradientButton tone={tone} className={buttonClassName}>
          {children}
        </GradientButton>
      </LeadDialog>
    </Suspense>
  );
}
