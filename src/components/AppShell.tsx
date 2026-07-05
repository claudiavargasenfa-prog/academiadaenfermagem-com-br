import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  LogOut,
  Store,
  User,
  Shield,
  BookOpen,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ReferencesFooter } from "./References";
import { AuthGate, signOut } from "./AuthGate";
import { TrialCountdownBanner } from "./TrialCountdownBanner";
import { isAdmin } from "@/lib/access";
import { useText } from "@/lib/app-texts";
import logoAsset from "@/assets/logo.png.asset.json";

export function AppShell({
  children,
  trackSlug,
  tint,
  hideReferences,
  publicRoute,
}: {
  children: ReactNode;
  trackSlug?: "academico" | "tecnico" | "enfermeiro";
  tint?: string | null;
  hideReferences?: boolean;
  publicRoute?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    isAdmin().then(setAdmin);
  }, []);

  const lojaLabel = useText("menu.loja", "Loja");
  const minhaContaLabel = useText("menu.minha_conta", "Minha Conta");
  const adminLabel = useText("menu.admin", "Admin");
  const headerTitle = useText("header.title", "Academia da Enfermagem");
  const headerSubtitle = useText("header.subtitle", "Informação Atualizada em suas Mãos");
  const headerTitleSize = useText("header.title.size", "16");
  const headerSubtitleSize = useText("header.subtitle.size", "11");

  const historiaLabel = useText("menu.minha_historia", "Minha História");
  const baseNav = [
    { to: "/" as const, label: lojaLabel, icon: Store },
    { to: "/minha-conta" as const, label: minhaContaLabel, icon: User },
    { to: "/minha-historia" as const, label: historiaLabel, icon: BookOpen },
  ];
  const navItems = admin
    ? [...baseNav, { to: "/admin" as const, label: adminLabel, icon: Shield }]
    : baseNav;

  const bgStyle: React.CSSProperties | undefined = tint
    ? { backgroundColor: `color-mix(in oklab, ${tint} 35%, transparent)` }
    : trackSlug
    ? { backgroundColor: `color-mix(in oklab, var(--track-${trackSlug}-bg) 35%, transparent)` }
    : undefined;

  return (
    <AuthGate>
    <div className="min-h-dvh" style={bgStyle} data-app={trackSlug}>
      <TrialCountdownBanner />
      <header className="sticky top-0 z-40 border-b border-gold/30 bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Logotipo Academia da Enfermagem"
              className="h-11 w-11 shrink-0 rounded-xl object-contain bg-white/10 p-1 ring-1 ring-gold/40"
            />
            <div className="min-w-0 leading-tight">
              <p
                className="truncate font-display font-extrabold tracking-tight text-gold"
                style={{ fontSize: `${parseFloat(headerTitleSize) || 16}px` }}
              >
                {headerTitle}
              </p>
              <p
                className="truncate text-primary-foreground/70"
                style={{ fontSize: `${parseFloat(headerSubtitleSize) || 11}px` }}
              >
                {headerSubtitle}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <button
              aria-label="Sair"
              onClick={() => signOut()}
              className="hidden h-10 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold text-gold hover:bg-white/20 md:inline-flex"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
            <button
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "gold-gradient shadow-[var(--shadow-soft)]"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-gold"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {open && (
          <div className="border-t border-gold/20 bg-primary/95 px-4 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((n) => {
                const Icon = n.icon;
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "gold-gradient"
                        : "bg-white/10 text-primary-foreground"
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
        {!hideReferences && <ReferencesFooter compact />}
      </main>

      {/* Mobile bottom tab nav */}
      <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-1 rounded-2xl border border-gold/40 bg-primary/95 px-2 py-2 text-primary-foreground shadow-[var(--shadow-glass)] backdrop-blur">
          {navItems.slice(0, 5).map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold ${
                  active ? "gold-gradient" : "text-primary-foreground/80"
                }`}
                aria-label={n.label}
              >
                <Icon className="h-4 w-4" />
                {n.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AuthGate>
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
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">
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
        <thead className="bg-primary text-primary-foreground">
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
