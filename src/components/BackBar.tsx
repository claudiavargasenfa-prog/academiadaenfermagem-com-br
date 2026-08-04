import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Store } from "lucide-react";
import { useEffect, useState } from "react";

const HIDE_EXACT = new Set([
  "/",
  "/loja",
  "/adec",
  "/vendas",
  "/reset-password",
]);

/**
 * Barra "Voltar" global exibida em todas as páginas internas (mini apps).
 * Volta para a última trilha (app) visitada; se não houver, volta para a loja.
 */
export function BackBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [lastTrack, setLastTrack] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/trilha/")) {
      window.sessionStorage.setItem("adec:last-track", pathname);
      setLastTrack(pathname);
    } else {
      setLastTrack(window.sessionStorage.getItem("adec:last-track"));
    }
  }, [pathname]);

  if (HIDE_EXACT.has(pathname)) return null;
  if (pathname.startsWith("/cadastro")) return null;
  if (pathname.startsWith("/planos")) return null;

  const isTrack = pathname.startsWith("/trilha/");
  const backTo = !isTrack && lastTrack ? lastTrack : "/";
  const backLabel = !isTrack && lastTrack ? "Voltar ao app" : "Voltar à loja";

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = backTo;
          }
        }}
        className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background/70 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-foreground/5"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      {!isTrack && lastTrack && (
        <Link
          to={lastTrack}
          className="inline-flex items-center gap-1 rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          {backLabel}
        </Link>
      )}
      <Link
        to="/"
        className="inline-flex items-center gap-1 rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <Store className="h-3.5 w-3.5" /> Loja
      </Link>
    </div>
  );
}
