import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "paper" | "ink";
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    { children, className, tone = "paper", width, height, style, type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      data-tone={tone}
      className={cn(
        "arimo-access-button relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden border border-transparent px-12 py-5 text-[0.6875rem] font-light uppercase tracking-[0.3em]",
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    >
      <span className="arimo-access-button__border" aria-hidden="true" />
      <span className="arimo-access-button__surface" aria-hidden="true" />
      <span className="arimo-access-button__sheen" aria-hidden="true" />
      <span className="arimo-access-button__content">{children}</span>
    </button>
  ),
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
