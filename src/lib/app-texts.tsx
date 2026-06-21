import { useQuery } from "@tanstack/react-query";
import { Fragment, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppText = {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
};

export async function fetchAppTexts(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("app_texts").select("key, value");
  if (error) throw error;
  const out: Record<string, string> = {};
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    out[row.key] = row.value;
  }
  return out;
}

export function useAppTexts() {
  return useQuery({
    queryKey: ["app_texts"],
    queryFn: fetchAppTexts,
    staleTime: 60_000,
  });
}

/**
 * Texto com marcação simples:
 *  **negrito**      -> <strong>
 *  __destaque__     -> cor de destaque (gold)
 *  ^^badge^^        -> CAIXA ALTA em pílula colorida
 */
export function RichText({ children, className = "" }: { children: string | undefined | null; className?: string }) {
  if (!children) return null;
  return <span className={className}>{parseRich(children)}</span>;
}

function parseRich(input: string): ReactNode[] {
  const tokens = input.split(/(\*\*[^*]+\*\*|__[^_]+__|\^\^[^^]+\^\^)/g);
  return tokens.map((t, i) => {
    if (t.startsWith("**") && t.endsWith("**")) {
      return <strong key={i} className="font-extrabold">{t.slice(2, -2)}</strong>;
    }
    if (t.startsWith("__") && t.endsWith("__")) {
      return <span key={i} className="font-bold text-gold">{t.slice(2, -2)}</span>;
    }
    if (t.startsWith("^^") && t.endsWith("^^")) {
      return (
        <span
          key={i}
          className="mx-0.5 inline-flex items-center rounded-md bg-gold/20 px-1.5 py-0.5 text-[0.85em] font-extrabold uppercase tracking-wide text-amber-900"
        >
          {t.slice(2, -2).toUpperCase()}
        </span>
      );
    }
    return <Fragment key={i}>{t}</Fragment>;
  });
}

/** Hook utilitário: pega um texto pelo key com fallback. */
export function useText(key: string, fallback = ""): string {
  const q = useAppTexts();
  return q.data?.[key] ?? fallback;
}
