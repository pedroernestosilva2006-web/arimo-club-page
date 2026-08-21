import { useEffect, useRef, type CSSProperties } from "react";

type Location = {
  lat: number;
  lng: number;
  label: string;
};

type Connection = {
  end: Location;
  delay: number;
};

const origin: Location = { lat: -23.5505, lng: -46.6333, label: "São Paulo" };
const connections: Connection[] = [
  { end: { lat: -3.119, lng: -60.0217, label: "Manaus" }, delay: 0 },
  { end: { lat: -8.0476, lng: -34.877, label: "Recife" }, delay: 0.4 },
  { end: { lat: -15.7939, lng: -47.8828, label: "Brasília" }, delay: 0.8 },
  { end: { lat: -30.0346, lng: -51.2177, label: "Porto Alegre" }, delay: 1.2 },
  { end: { lat: 25.7617, lng: -80.1918, label: "Miami" }, delay: 1.6 },
  { end: { lat: 40.7128, lng: -74.006, label: "Nova York" }, delay: 2 },
  { end: { lat: 38.7223, lng: -9.1393, label: "Lisboa" }, delay: 2.4 },
  { end: { lat: 51.5074, lng: -0.1278, label: "Londres" }, delay: 2.8 },
  { end: { lat: 25.2048, lng: 55.2708, label: "Dubai" }, delay: 3.2 },
  { end: { lat: 1.3521, lng: 103.8198, label: "Singapura" }, delay: 3.6 },
];

function projectPoint(location: Location) {
  return {
    x: (location.lng + 180) * (800 / 360),
    y: (90 - location.lat) * (400 / 180),
  };
}

function curvedPath(start: ReturnType<typeof projectPoint>, end: ReturnType<typeof projectPoint>) {
  const distance = Math.abs(end.x - start.x);
  const lift = Math.min(92, 30 + distance * 0.12);
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - lift;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export function ArimoNetworkMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const start = projectPoint(origin);

  useEffect(() => {
    if (window.location.hash !== "#rede") return;
    const timer = window.setTimeout(() => sectionRef.current?.scrollIntoView(), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} id="rede" className="relative overflow-hidden border-y border-white/10 bg-[#070707] px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="arimo-label text-[#b7966d]">REDE ARIMO / SEM FRONTEIRAS</p>
            <h2 className="mt-8 max-w-4xl text-[clamp(3.2rem,7.5vw,7.8rem)] font-light leading-[.9] tracking-normal">
              O Brasil
              <br />
              conectado
              <br />
              ao <span className="arimo-serif italic">mundo.</span>
            </h2>
          </div>
          <p className="max-w-lg border-l border-[#b7966d] pl-6 text-base leading-relaxed text-white/60 md:text-lg">
            Relações que atravessam cidades, mercados e fusos. Uma rede criada para aproximar quem
            tem ambição de quem pode abrir o próximo caminho.
          </p>
        </div>

        <div className="relative mt-20 aspect-[1.3/1] w-full overflow-hidden border-y border-white/10 sm:aspect-[1.7/1] lg:aspect-[2/1]">
          <img
            src="/arimo-world-map.svg"
            alt="Mapa das conexões ARIMO no Brasil e no mundo"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-75"
            draggable={false}
          />

          <svg
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <filter id="arimo-network-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {connections.map(({ end, delay }, index) => {
              const endpoint = projectPoint(end);
              const path = curvedPath(start, endpoint);
              return (
                <g key={end.label}>
                  <path
                    id={`arimo-route-${index}`}
                    d={path}
                    pathLength="1"
                    className="arimo-network-route"
                    style={{ "--route-delay": `${delay}s` } as CSSProperties}
                  />
                  <circle cx={endpoint.x} cy={endpoint.y} r="2.3" fill="#c5a477" filter="url(#arimo-network-glow)" />
                  <circle
                    cx={endpoint.x}
                    cy={endpoint.y}
                    r="3"
                    fill="none"
                    stroke="#c5a477"
                    className="arimo-network-pulse"
                    style={{ "--route-delay": `${delay}s` } as CSSProperties}
                  />
                  <circle r="2.2" fill="#f2f0eb" className="arimo-network-traveler">
                    <animateMotion dur="5s" begin={`${delay}s`} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}
          </svg>

          <div className="absolute left-[37%] top-[63%] z-10 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 border border-[#b7966d]/40 arimo-wolf-signal sm:h-28 sm:w-28" />
            <img
              src="/arimo-logo-official.png"
              alt="ARIMO CLUB, núcleo da rede"
              className="relative w-12 mix-blend-screen sm:w-16"
            />
          </div>

          <div className="absolute bottom-4 left-4 z-20 border-l border-[#b7966d] pl-3 sm:bottom-7 sm:left-7">
            <p className="arimo-label text-white/40">NÚCLEO</p>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">Brasil</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.625rem] uppercase tracking-[0.26em] text-white/38">
          <span>Brasil</span><span>Américas</span><span>Europa</span><span>Oriente Médio</span><span>Ásia</span>
        </div>
      </div>
    </section>
  );
}
