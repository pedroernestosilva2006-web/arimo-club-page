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
      className={cn(
        "inline-flex shrink-0 items-center",
        className,
      )}
    >
      <img
        src="/arimo-logo-official.png"
        alt={alt}
        className={cn(
          "h-auto w-full object-contain",
          tone === "paper"
            ? "mix-blend-multiply invert"
            : "mix-blend-screen",
        )}
      />
    </div>
  );
}
