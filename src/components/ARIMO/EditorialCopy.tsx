import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type EditorialParagraph = {
  content: ReactNode;
  variant?: "lead" | "body" | "closing";
};

export function EditorialCopy({
  paragraphs,
  align = "left",
  className,
  delay = 0,
}: {
  paragraphs: EditorialParagraph[];
  align?: "left" | "center";
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn("arimo-editorial-copy", className)} data-align={align}>
      <Reveal delay={delay} className="w-full">
        <div className="arimo-editorial-copy__rule" aria-hidden="true">
          <span />
        </div>
      </Reveal>

      <div className="arimo-editorial-copy__body">
        {paragraphs.map(({ content, variant = "body" }, index) => (
          <Reveal key={index} delay={delay + 90 + index * 110}>
            <p className={cn("arimo-editorial-copy__paragraph", "is-" + variant)}>{content}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
