import createGlobe, { type Arc, type Marker } from "cobe";
import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

type CobeGlobeProps = {
  markers: Marker[];
  arcs: Arc[];
  className?: string;
};

const INITIAL_PHI = -0.42;
const INITIAL_THETA = 0.17;

export function CobeGlobe({ markers, arcs, className = "" }: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const dragPositionRef = useRef(0);
  const pointerDeltaRef = useRef(0);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragStartRef.current = event.clientX;
    pointerDeltaRef.current = dragPositionRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragStartRef.current === null) return;
    dragPositionRef.current =
      pointerDeltaRef.current + (event.clientX - dragStartRef.current) / 180;
  }, []);

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = Math.max(canvas.clientWidth, 320);
    let phi = INITIAL_PHI;
    let frame = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi,
        theta: INITIAL_THETA,
        dark: 0,
        diffuse: 1.25,
        mapSamples: 18000,
        mapBrightness: 8,
        mapBaseBrightness: 0.04,
        baseColor: [0.22, 0.22, 0.22],
        markerColor: [0.02, 0.02, 0.02],
        glowColor: [0.93, 0.93, 0.91],
        opacity: 0.94,
        scale: 1.04,
        offset: [0, 0],
        markerElevation: 0.035,
        markers,
        arcs,
        arcColor: [0.08, 0.08, 0.08],
        arcWidth: 0.8,
        arcHeight: 0.22,
      });
    } catch {
      canvas.dataset.failed = "true";
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || !globe) return;
      width = Math.max(entry.contentRect.width, 320);
      globe.update({ width: width * dpr, height: width * dpr });
    });

    resizeObserver.observe(canvas);

    const render = () => {
      if (!globe) return;
      if (!reduceMotion && dragStartRef.current === null) phi += 0.0017;
      globe.update({ phi: phi + dragPositionRef.current, theta: INITIAL_THETA });
      frame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      globe?.destroy();
    };
  }, [arcs, markers]);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_38%_34%,rgba(255,255,255,.94),rgba(210,210,207,.45)_44%,rgba(40,40,40,.08)_68%,transparent_72%)]"
      />
      <canvas
        ref={canvasRef}
        className="relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing data-[failed=true]:opacity-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="img"
        aria-label="Globo interativo com conexões da ARIMO entre o Brasil e cidades de todos os continentes"
      />
    </div>
  );
}
