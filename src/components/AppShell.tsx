import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Stethoscope,
  Calculator,
  ClipboardList,
  Activity,
  NotebookPen,
  Target,
  Baby,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ReferencesFooter } from "./References";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/procedimentos", label: "Procedim.", icon: Stethoscope },
  { to: "/calculadora", label: "Cálculos", icon: Calculator },
  { to: "/sinais-vitais", label: "SV Adulto", icon: Activity },
  { to: "/sv-pediatrico", label: "SV Pediátr.", icon: Baby },
  { to: "/sv-gestante", label: "SV Gestante", icon: HeartPulse },
  { to: "/escalas", label: "Escalas", icon: ClipboardList },
  { to: "/pdca", label: "PDCA", icon: Target },
  { to: "/diario", label: "Diário", icon: NotebookPen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 glass-subtle border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl surface-gradient shadow-[var(--shadow-glow)]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-foreground">Acadêmico de Bolso</p>
              <p className="text-[11px] text-muted-foreground">Enfermagem · Caderno de estágio</p>
            </div>
          </Link>
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-xl glass md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {open && (
          <div className="border-t border-border/40 px-4 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {nav.map((n) => {
                const Icon = n.icon;
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "glass text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 page-enter md:pb-10">
        {children}
        <ReferencesFooter compact />
      </main>

      {/* Mobile bottom tab nav */}
      <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="glass flex items-center gap-1 rounded-2xl px-2 py-2">
          {nav.slice(0, 5).map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
                aria-label={n.label}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number | ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/60 backdrop-blur-md">
      <table className="w-full text-sm">
        <thead className="bg-secondary/70 text-secondary-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/50 transition-colors hover:bg-secondary/30">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
