import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type PowerImage = {
  src: string;
  alt: string;
};

type DiagonalPowerMarqueeProps = {
  images: PowerImage[];
  className?: string;
};

function MarqueeRow({
  images,
  reverse = false,
  speed,
}: {
  images: PowerImage[];
  reverse?: boolean;
  speed: number;
}) {
  const sequence = [...images, ...images];

  return (
    <div className="w-full overflow-hidden">
      <div
        className={cn("arimo-power-row flex w-max", reverse && "is-reverse")}
        style={{ "--power-speed": `${speed}s` } as CSSProperties}
      >
        {sequence.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="relative mr-4 aspect-[4/3] w-[clamp(15rem,27vw,28rem)] shrink-0 overflow-hidden border border-white/15 bg-[#111] md:mr-6"
          >
            <img
              src={image.src}
              alt={index < images.length ? image.alt : ""}
              aria-hidden={index >= images.length}
              loading="lazy"
              className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </figure>
        ))}
      </div>
    </div>
  );
}

export function DiagonalPowerMarquee({ images, className }: DiagonalPowerMarqueeProps) {
  return (
    <section
      className={cn(
        "relative flex h-[88vh] min-h-[680px] w-full items-center overflow-hidden border-y border-white/10 bg-[#070707]",
        className,
      )}
      aria-label="Ambientes e conexões ARIMO"
    >
      <div className="arimo-power-plane absolute left-1/2 top-1/2 flex w-[160vw] -translate-x-1/2 -translate-y-1/2 rotate-[-9deg] flex-col gap-4 md:gap-6">
        <MarqueeRow images={images} speed={58} />
        <MarqueeRow images={[...images].reverse()} reverse speed={66} />
        <MarqueeRow images={images} speed={72} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-[linear-gradient(to_bottom,#070707,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-[linear-gradient(to_top,#070707,transparent)]" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-black/28" />

      <div className="pointer-events-none relative z-30 mx-auto w-full max-w-6xl px-6 md:px-12">
        <p className="arimo-label text-white/60">INFLUÊNCIA / ACESSO / MOVIMENTO</p>
        <h2 className="mt-7 max-w-4xl text-[clamp(3.4rem,8vw,8.4rem)] font-light leading-[.88] tracking-normal text-white">
          Poder não se exibe.
          <br />
          <span className="arimo-serif italic">Circula.</span>
        </h2>
      </div>
    </section>
  );
}
