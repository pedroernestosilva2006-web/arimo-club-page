import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TextShimmerProps {
  children: ReactNode;
  as?: ElementType;
  duration?: number;
  className?: string;
}

export function TextShimmer({
  children,
  as: Comp = "span",
  duration = 2.5,
  className,
}: TextShimmerProps) {
  return (
    <Comp
      style={{ "--beui-text-shimmer-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "beui-text-shimmer inline-block bg-[length:220%_100%] bg-clip-text text-transparent",
        "bg-[linear-gradient(110deg,#858585_28%,#f7f7f7_47%,#ffffff_52%,#b0b0b0_68%)]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
