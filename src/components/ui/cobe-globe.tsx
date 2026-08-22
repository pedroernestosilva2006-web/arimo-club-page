import createGlobe, { type Arc, type Marker } from "cobe";
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
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
  signals?: string[];
  className?: string;
};

const INITIAL_PHI = -0.42;
const INITIAL_THETA = 0.17;
const SIGNAL_POSITIONS = [
  "left-[7%] top-[15%]",
  "right-[13%] top-[23%]",
  "left-[1%] top-[43%]",
  "right-[11%] top-[48%]",
  "left-[9%] bottom-[20%]",
  "right-[13%] bottom-[16%]",
  "left-[28%] top-[7%]",
  "right-[29%] bottom-[7%]",
];

export function CobeGlobe({
  markers,
  arcs,
  labels = [],
  signals = [],
  className = "",
}: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const dragPositionRef = useRef(0);
  const pointerDeltaRef = useRef(0);
  const lastDragPositionRef = useRef(0);
  const velocityRef = useRef(0);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragStartRef.current = event.clientX;
    pointerDeltaRef.current = dragPositionRef.current;
    lastDragPositionRef.current = dragPositionRef.current;
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragStartRef.current === null) return;
    const nextPosition = pointerDeltaRef.current + (event.clientX - dragStartRef.current) / 180;
    velocityRef.current = (nextPosition - lastDragPositionRef.current) * 0.16;
    dragPositionRef.current = nextPosition;
    lastDragPositionRef.current = nextPosition;
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

    const render = (time = 0) => {
      if (!globe) return;
      if (!reduceMotion && dragStartRef.current === null) {
        phi += 0.00145 + Math.sin(time * 0.00035) * 0.00016;
        dragPositionRef.current += velocityRef.current;
        velocityRef.current *= 0.94;
      }

      const pulse = reduceMotion ? 0.5 : (Math.sin(time * 0.0012) + 1) / 2;
      globe.update({
        phi: phi + dragPositionRef.current,
        theta: reduceMotion ? INITIAL_THETA : INITIAL_THETA + Math.sin(time * 0.00028) * 0.035,
        markerElevation: 0.025 + pulse * 0.025,
        arcHeight: 0.19 + pulse * 0.055,
        arcWidth: 0.66 + pulse * 0.24,
      });
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

      <div className="arimo-globe-orbit is-outer" aria-hidden="true" />
      <div className="arimo-globe-orbit is-inner" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        {signals.slice(0, SIGNAL_POSITIONS.length).map((signal, index) => (
          <span
            key={signal}
            className={`arimo-globe-signal ${SIGNAL_POSITIONS[index]}`}
            style={{ "--signal-delay": `${index * -1.05}s` } as CSSProperties}
          >
            <i />
            {signal}
          </span>
        ))}
      </div>

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
