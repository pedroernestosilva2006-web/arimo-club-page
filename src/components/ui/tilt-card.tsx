"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface TiltCardProps {
  tiltLimit?: number;
  scale?: number;
  perspective?: number;
  effect?: "gravitate" | "evade";
  spotlight?: boolean;
  spotlightMask?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function TiltCard({
  tiltLimit = 10,
  scale = 1.025,
  perspective = 1400,
  effect = "evade",
  spotlight = true,
  spotlightMask,
  className,
  style,
  children,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
  );
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const direction = effect === "evade" ? -1 : 1;

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const card = cardRef.current;
      if (!card) return;

      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateX = (y - 0.5) * tiltLimit * 2 * direction;
      const rotateY = (x - 0.5) * -tiltLimit * 2 * direction;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      );
      if (spotlight) setSpotlightPosition({ x: x * 100, y: y * 100 });
    },
    [direction, perspective, scale, spotlight, tiltLimit],
  );

  const handlePointerLeave = useCallback(() => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setHovered(false);
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onPointerEnter={(event) => event.pointerType !== "touch" && setHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={cn("relative will-change-transform", className)}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        ...style,
      }}
    >
      {children}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 300ms ease",
            WebkitMaskImage: spotlightMask,
            maskImage: spotlightMask,
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        >
          <div
            className="absolute h-[160%] w-[160%]"
            style={{
              left: `${spotlightPosition.x}%`,
              top: `${spotlightPosition.y}%`,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(255,255,255,.22) 0%, transparent 42%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
