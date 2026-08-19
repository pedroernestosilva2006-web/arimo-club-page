import { ARIMO_WHATSAPP_URL } from "@/config/links";
import { cn } from "@/lib/utils";

export function CtaButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={ARIMO_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center bg-ink px-10 py-5 text-xs font-bold tracking-[0.25em] text-ink-foreground uppercase transition-opacity duration-200 hover:opacity-80 md:text-sm",
        className,
      )}
    >
      {children}
    </a>
  );
}
