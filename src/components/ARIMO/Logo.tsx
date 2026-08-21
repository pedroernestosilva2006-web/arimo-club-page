import { cn } from "@/lib/utils";

export function Logo({
  tone = "ink",
  className,
  alt = "ARIMO",
}: {
  tone?: "ink" | "paper";
  className?: string;
  alt?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "arimo-wordmark inline-flex items-center gap-3",
        tone === "paper" ? "text-[#090909]" : "text-[#f2f0eb]",
        className,
      )}
    >
      <span className="arimo-monogram" aria-hidden="true">
        <i />
        <b>A</b>
      </span>
      <span className="flex flex-col">
        <span className="text-[1.35em] font-medium leading-none tracking-[0.22em]">ARIMO</span>
        <span className="mt-1 text-[0.42em] font-light uppercase tracking-[0.42em] opacity-55">
          Private Business Club
        </span>
      </span>
    </div>
  );
}
