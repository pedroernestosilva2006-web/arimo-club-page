import logoAsset from "@/assets/arimo-logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * The source mark is a white wordmark on near-black.
 * On light ("paper") surfaces we invert it so it reads as black on white.
 */
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
    <img
      src={logoAsset.url}
      alt={alt}
      loading="lazy"
      className={cn(
        "select-none",
        tone === "paper" ? "invert mix-blend-multiply" : "mix-blend-screen",
        className,
      )}

    />
  );
}
