import { useEffect, useMemo, useRef } from "react";
import type { Arc, Marker } from "cobe";
import { CobeGlobe } from "@/components/ui/cobe-globe";

type City = {
  id: string;
  label: string;
  location: [number, number];
};

const origin: City = {
  id: "sao-paulo",
  label: "São Paulo",
  location: [-23.5505, -46.6333],
};

const destinations: City[] = [
  { id: "manaus", label: "Manaus", location: [-3.119, -60.0217] },
  { id: "recife", label: "Recife", location: [-8.0476, -34.877] },
  { id: "brasilia", label: "Brasília", location: [-15.7939, -47.8828] },
  { id: "porto-alegre", label: "Porto Alegre", location: [-30.0346, -51.2177] },
  { id: "miami", label: "Miami", location: [25.7617, -80.1918] },
  { id: "nova-york", label: "Nova York", location: [40.7128, -74.006] },
  { id: "cidade-do-mexico", label: "Cidade do México", location: [19.4326, -99.1332] },
  { id: "lisboa", label: "Lisboa", location: [38.7223, -9.1393] },
  { id: "londres", label: "Londres", location: [51.5074, -0.1278] },
  { id: "paris", label: "Paris", location: [48.8566, 2.3522] },
  { id: "cidade-do-cabo", label: "Cidade do Cabo", location: [-33.9249, 18.4241] },
  { id: "dubai", label: "Dubai", location: [25.2048, 55.2708] },
  { id: "singapura", label: "Singapura", location: [1.3521, 103.8198] },
  { id: "toquio", label: "Tóquio", location: [35.6762, 139.6503] },
  { id: "sydney", label: "Sydney", location: [-33.8688, 151.2093] },
];

const featuredCities = [
  origin,
  ...destinations.filter((city) =>
    ["nova-york", "lisboa", "londres", "dubai", "singapura", "toquio", "sydney"].includes(city.id),
  ),
];
const networkSignals = [
  "CONEXÕES",
  "NEGÓCIOS",
  "SÓCIOS",
  "VENDAS",
  "NETWORK",
  "CLIENTES",
  "FORNECEDORES",
  "EXPANSÃO",
];

export function ArimoNetworkMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const markers = useMemo<Marker[]>(
    () => [
      { id: origin.id, location: origin.location, size: 0.075, color: [0, 0, 0] },
      ...destinations.map((city) => ({
        id: city.id,
        location: city.location,
        size: 0.035,
        color: [0.12, 0.12, 0.12] as [number, number, number],
      })),
    ],
    [],
  );
  const arcs = useMemo<Arc[]>(
    () =>
      destinations.map((city) => ({
        id: `sao-paulo-${city.id}`,
        from: origin.location,
        to: city.location,
      })),
    [],
  );

  useEffect(() => {
    if (window.location.hash !== "#rede") return;
    const timer = window.setTimeout(() => sectionRef.current?.scrollIntoView(), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rede"
      className="arimo-deferred relative overflow-hidden border-y border-black/10 bg-[#f1f1ef] text-[#090909]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(0,0,0,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.055)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid min-h-[46rem] min-w-0 max-w-[92rem] grid-cols-[minmax(0,1fr)] items-center gap-8 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-[0.82fr_1.18fr] lg:gap-0 lg:py-24">
        <div className="relative z-10 w-[calc(100vw-3rem)] min-w-0 lg:w-auto lg:py-16">
          <p className="arimo-label text-black/55">REDE ARIMO / SEM FRONTEIRAS</p>
          <h2 className="mt-8 max-w-3xl text-[clamp(3.4rem,7vw,7.6rem)] font-light leading-[.88] tracking-normal">
            O Brasil
            <br />
            conectado
            <br />
            ao <span className="arimo-serif italic">mundo.</span>
          </h2>
          <p className="mt-10 max-w-full border-l border-black/25 pl-6 text-base leading-relaxed text-black/60 md:max-w-xl md:text-lg">
            Relações que atravessam cidades, mercados e fusos. Uma rede para aproximar quem tem
            ambição de quem pode abrir o próximo caminho.
          </p>

          <div className="mt-12 flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.24em] text-black/48">
            <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
              <span className="absolute h-full w-full animate-ping rounded-full bg-black/20 motion-reduce:animate-none" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-black" />
            </span>
            Núcleo no Brasil
          </div>
        </div>

        <div className="relative left-1/2 mt-4 w-[calc(100vw+2.5rem)] min-w-0 -translate-x-1/2 sm:w-[calc(100vw+1rem)] lg:left-auto lg:-mr-40 lg:ml-[-8%] lg:mt-0 lg:w-auto lg:translate-x-0">
          <CobeGlobe
            markers={markers}
            arcs={arcs}
            labels={featuredCities}
            signals={networkSignals}
            className="mx-auto max-w-[54rem]"
          />
          <p className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center text-[0.5625rem] uppercase tracking-[0.24em] text-black/40">
            Arraste para explorar
          </p>
        </div>

        <div className="col-span-full mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-black/15 pt-7 text-[0.625rem] uppercase tracking-[0.24em] text-black/45">
          {networkSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
