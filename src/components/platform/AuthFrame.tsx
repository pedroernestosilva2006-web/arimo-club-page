import type { ReactNode } from "react";
import { Logo } from "@/components/ARIMO/Logo";

export const authFieldClass =
  "h-12 w-full border border-white/15 bg-white/[0.035] px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/28 focus:border-white/55";
export const authLabelClass =
  "mb-2 block text-[0.625rem] uppercase tracking-[0.24em] text-white/48";

export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-10 font-sans text-[#f5f5f3] sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:76px_76px]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/[0.06]" />
      <div className="relative min-w-0 w-full max-w-[27rem]">
        <a href="/" aria-label="Voltar ao site ARIMO CLUB" className="inline-flex">
          <Logo className="w-20" />
        </a>
        {children}
      </div>
    </main>
  );
}
