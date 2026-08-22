import { Link, useRouterState } from "@tanstack/react-router";
import { House, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ARIMO/Logo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type PlatformShellProps = {
  children: ReactNode;
  name: string;
  isAdmin?: boolean;
  section?: string;
};

const navItem =
  "group flex h-11 items-center gap-3 px-3 text-sm text-white/50 transition-colors duration-200 hover:bg-white/[0.045] hover:text-white";

export function PlatformShell({ children, name, isAdmin = false, section }: PlatformShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  const links = [
    { to: "/club" as const, label: "Início", icon: House },
    { to: "/profile" as const, label: "Meu perfil", icon: UserRound },
    ...(isAdmin
      ? [{ to: "/admin/applications" as const, label: "Administração", icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#f5f5f3]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] border-r border-white/[0.08] bg-[#090909] lg:flex lg:flex-col">
        <div className="flex h-24 items-center border-b border-white/[0.08] px-7">
          <Link to="/club" aria-label="Início ARIMO">
            <Logo className="w-[4.5rem]" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-7" aria-label="Navegação principal">
          <p className="px-3 text-[0.5625rem] uppercase tracking-[0.24em] text-white/28">ARIMO</p>
          <div className="mt-4 space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active =
                pathname === to || (to.startsWith("/admin") && pathname.startsWith("/admin"));
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(navItem, active && "bg-white/[0.065] text-white")}
                >
                  <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} />
                  <span>{label}</span>
                  {active && <span className="ml-auto h-1 w-1 rounded-full bg-white/70" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm uppercase text-white/75">
              {name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-white/82">{name}</p>
              <p className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.18em] text-white/32">
                Membro ARIMO
              </p>
            </div>
          </div>
          <button type="button" onClick={signOut} className={cn(navItem, "mt-1 w-full")}>
            <LogOut className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#050505]/90 px-5 backdrop-blur-xl md:px-8 lg:h-20 lg:px-10">
          <div className="flex items-center gap-4">
            <Logo className="w-12 lg:hidden" />
            <p className="hidden text-[0.625rem] uppercase tracking-[0.24em] text-white/38 sm:block">
              {section ?? "PRIVATE BUSINESS NETWORK"}
            </p>
          </div>
          <span className="text-[0.5625rem] uppercase tracking-[0.2em] text-white/28">
            {isAdmin ? "ADMIN" : "MEMBRO"}
          </span>
        </header>
        {children}
      </div>

      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 grid h-[4.5rem] border-t border-white/[0.1] bg-[#090909]/96 px-5 backdrop-blur-xl lg:hidden",
          isAdmin ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {links.slice(0, 3).map(({ to, label, icon: Icon }) => {
          const active =
            pathname === to || (to.startsWith("/admin") && pathname.startsWith("/admin"));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[0.5625rem] text-white/38",
                active && "text-white",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
