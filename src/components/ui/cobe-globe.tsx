import createGlobe, { type Arc, type Marker } from "cobe";
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type GlobeLabel = {
  id: string;
  label: string;
};

type CobeGlobeProps = {
  markers: Marker[];
  arcs: Arc[];
  labels?: GlobeLabel[];
  className?: string;
};

const INITIAL_PHI = -0.42;
const INITIAL_THETA = 0.17;
const AUTO_ROTATION_PER_MS = 0.000055;

export function CobeGlobe({ markers, arcs, labels = [], className = "" }: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const dragPositionRef = useRef(0);
  const pointerDeltaRef = useRef(0);
  const lastDragPositionRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragStartRef.current = event.clientX;
    pointerDeltaRef.current = dragPositionRef.current;
    lastDragPositionRef.current = dragPositionRef.current;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragStartRef.current === null) return;
    const nextPosition = pointerDeltaRef.current + (event.clientX - dragStartRef.current) / 165;
    const now = performance.now();
    const elapsed = Math.max(now - lastPointerTimeRef.current, 1);
    velocityRef.current = ((nextPosition - lastDragPositionRef.current) / elapsed) * 16.667;
    dragPositionRef.current = nextPosition;
    lastDragPositionRef.current = nextPosition;
    lastPointerTimeRef.current = now;
  }, []);

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLCanvasElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    dragPositionRef.current += event.key === "ArrowLeft" ? -0.2 : 0.2;
    velocityRef.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = Math.max(canvas.clientWidth, 320);
    const compact = width < 640;
    const dprLimit = compact ? 1.35 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
    const mapSamples = compact ? 9000 : 12000;
    let phi = INITIAL_PHI;
    let renderedDragPosition = dragPositionRef.current;
    let lastFrameTime = 0;
    let frame = 0;
    let visible = true;
    let globe: ReturnType<typeof createGlobe> | null = null;

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi,
        theta: INITIAL_THETA,
        dark: 0,
        diffuse: 1.05,
        mapSamples,
        mapBrightness: 4.8,
        mapBaseBrightness: 0.1,
        baseColor: [0.82, 0.82, 0.8],
        markerColor: [0.06, 0.06, 0.06],
        glowColor: [0.98, 0.98, 0.97],
        opacity: 0.92,
        scale: 0.98,
        offset: [0, 0],
        markerElevation: 0.025,
        markers,
        arcs,
        arcColor: [0.24, 0.24, 0.24],
        arcWidth: 0.48,
        arcHeight: 0.16,
      });
    } catch {
      canvas.dataset["failed"] = "true";
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || !globe) return;
      width = Math.max(entry.contentRect.width, 320);
      globe.update({ width: width * dpr, height: width * dpr });
    });

    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { rootMargin: "180px" },
    );
    visibilityObserver.observe(canvas);

    const render = (time = 0) => {
      if (!globe) return;
      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 42) : 16.667;
      const frameScale = elapsed / 16.667;
      lastFrameTime = time;

      if (!visible) {
        frame = window.requestAnimationFrame(render);
        return;
      }

      if (!reduceMotion && dragStartRef.current === null) {
        phi += AUTO_ROTATION_PER_MS * elapsed;
        dragPositionRef.current += velocityRef.current * frameScale;
        velocityRef.current *= Math.pow(0.9, frameScale);
      }

      const follow = reduceMotion ? 1 : 1 - Math.pow(0.56, frameScale);
      renderedDragPosition += (dragPositionRef.current - renderedDragPosition) * follow;
      const pulse = reduceMotion ? 0.5 : (Math.sin(time * 0.0012) + 1) / 2;
      globe.update({
        phi: phi + renderedDragPosition,
        theta: reduceMotion ? INITIAL_THETA : INITIAL_THETA + Math.sin(time * 0.0002) * 0.02,
        markerElevation: 0.02 + pulse * 0.014,
        arcHeight: 0.14 + pulse * 0.035,
        arcWidth: 0.4 + pulse * 0.12,
      });
      frame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      globe?.destroy();
    };
  }, [arcs, markers]);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.98),rgba(220,220,217,.46)_48%,rgba(70,70,70,.06)_68%,transparent_73%)]"
      />
      <canvas
        ref={canvasRef}
        className="relative h-full w-full cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing focus-visible:rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black/40 data-[failed=true]:opacity-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="img"
        aria-label="Globo interativo com conexões da ARIMO entre o Brasil e países de todos os continentes"
      />

      <div className="arimo-globe-orbit is-outer" aria-hidden="true" />
      <div className="arimo-globe-orbit is-inner" aria-hidden="true" />

      {labels.map((label) => (
        <span
          key={label.id}
          className="arimo-globe-location"
          style={
            {
              "--globe-label-visible": `var(--cobe-visible-${label.id}, 0)`,
              positionAnchor: `--cobe-${label.id}`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          {label.label}
        </span>
      ))}
    </div>
  );
}
