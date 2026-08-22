import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 font-sans text-[#f5f5f3]">
      <div className="w-full max-w-md border-t border-white/15 pt-10">
        <p className="text-[0.625rem] uppercase tracking-[0.28em] text-white/38">ERRO 404</p>
        <h1 className="mt-5 text-4xl font-medium leading-tight">Esta página não existe.</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          O endereço pode ter mudado ou não fazer parte da sua área de acesso.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex border-b border-white/35 pb-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:text-white"
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 font-sans text-[#f5f5f3]">
      <div className="w-full max-w-md border-t border-white/15 pt-10">
        <p className="text-[0.625rem] uppercase tracking-[0.28em] text-white/38">
          NÃO FOI POSSÍVEL CARREGAR
        </p>
        <h1 className="mt-5 text-4xl font-medium leading-tight">Algo interrompeu o acesso.</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          Tente novamente. Se o problema continuar, volte ao início e refaça o acesso.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center justify-center bg-white px-5 text-xs font-medium uppercase tracking-[0.18em] text-black hover:bg-white/85"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center border border-white/20 px-5 text-xs uppercase tracking-[0.18em] text-white/58 hover:border-white/50 hover:text-white"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ARIMO CLUB" },
      { name: "description", content: "Onde negócios acontecem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Jost:wght@200;300;400;500&display=swap",
      },

      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
