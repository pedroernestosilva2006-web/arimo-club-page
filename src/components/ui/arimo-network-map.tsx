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

const featuredCountries: City[] = [
  { ...origin, label: "Brasil" },
  { id: "nova-york", label: "Estados Unidos", location: [40.7128, -74.006] },
  { id: "cidade-do-mexico", label: "México", location: [19.4326, -99.1332] },
  { id: "lisboa", label: "Portugal", location: [38.7223, -9.1393] },
  { id: "londres", label: "Reino Unido", location: [51.5074, -0.1278] },
  { id: "cidade-do-cabo", label: "África do Sul", location: [-33.9249, 18.4241] },
  { id: "dubai", label: "Emirados Árabes", location: [25.2048, 55.2708] },
  { id: "singapura", label: "Singapura", location: [1.3521, 103.8198] },
  { id: "toquio", label: "Japão", location: [35.6762, 139.6503] },
  { id: "sydney", label: "Austrália", location: [-33.8688, 151.2093] },
];
const countries = [
  "Brasil",
  "Estados Unidos",
  "México",
  "Portugal",
  "Reino Unido",
  "França",
  "África do Sul",
  "Emirados Árabes",
  "Singapura",
  "Japão",
  "Austrália",
];

export function ArimoNetworkMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const markers = useMemo<Marker[]>(
    () => [
      { id: origin.id, location: origin.location, size: 0.075, color: [0, 0, 0] },
      ...destinations.map((city) => ({
        id: city.id,
        location: city.location,
        size: 0.03,
        color: [0.16, 0.16, 0.16] as [number, number, number],
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
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid min-w-0 max-w-[92rem] grid-cols-[minmax(0,1fr)] items-center gap-x-12 px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:min-h-[48rem] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-[auto_1fr] lg:py-24">
        <div className="relative z-10 min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="arimo-label text-black/52">REDE ARIMO / ALCANCE GLOBAL</p>
          <h2 className="mt-7 max-w-3xl text-[clamp(3rem,5.8vw,6.4rem)] font-light leading-[.92] tracking-normal">
            O próximo negócio
            <br />
            pode estar em
            <br />
            <span className="arimo-serif italic">outro fuso.</span>
          </h2>
        </div>

        <div className="relative left-1/2 z-0 mt-5 w-[calc(100vw-3rem)] min-w-0 -translate-x-1/2 sm:w-[min(46rem,calc(100vw-3rem))] lg:left-auto lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mr-16 lg:mt-0 lg:w-full lg:translate-x-0 xl:-mr-24">
          <CobeGlobe
            markers={markers}
            arcs={arcs}
            labels={featuredCountries}
            className="arimo-network-globe mx-auto max-w-[56rem]"
          />
        </div>

        <div className="relative z-10 mt-5 min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-12 lg:self-start">
          <p className="max-w-xl border-t border-black/20 pt-7 text-base leading-relaxed text-black/68 md:text-lg">
            Uma rede para aproximar empresários, clientes, sócios e fornecedores além do próprio
            mercado. Porque oportunidade não precisa terminar na sua cidade.
          </p>

          <dl className="mt-9 grid grid-cols-3 border-y border-black/15">
            <div className="border-r border-black/15 py-4 pr-3">
              <dt className="text-[0.5rem] uppercase tracking-[0.2em] text-black/42">Núcleo</dt>
              <dd className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-black/78">
                Brasil
              </dd>
            </div>
            <div className="border-r border-black/15 px-3 py-4">
              <dt className="text-[0.5rem] uppercase tracking-[0.2em] text-black/42">Ponte</dt>
              <dd className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-black/78">
                Global
              </dd>
            </div>
            <div className="py-4 pl-3">
              <dt className="text-[0.5rem] uppercase tracking-[0.2em] text-black/42">Foco</dt>
              <dd className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-black/78">
                Negócios
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="arimo-country-marquee border-t border-black/15 py-6">
        <p className="sr-only">Países conectados: {countries.join(", ")}.</p>
        <div className="arimo-country-marquee__track" aria-hidden="true">
          {[0, 1].map((group) => (
            <div key={group} className="arimo-country-marquee__group">
              {countries.map((country) => (
                <span key={group + "-" + country}>
                  <i />
                  {country}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
