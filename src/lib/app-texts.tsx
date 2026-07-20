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
  const lines = children.split(/\r?\n/);

  // Agrupa linhas consecutivas com o mesmo marcador em uma lista.
  const blocks: Array<{ type: "text" | "list"; marker?: string; items: string[] }> = [];
  for (const raw of lines) {
    const m = raw.match(/^\s*([->*+#])\s+(.*)$/);
    if (m) {
      const marker = m[1];
      const last = blocks[blocks.length - 1];
      if (last && last.type === "list" && last.marker === marker) {
        last.items.push(m[2]);
      } else {
        blocks.push({ type: "list", marker, items: [m[2]] });
      }
    } else {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "text") {
        last.items.push(raw);
      } else {
        blocks.push({ type: "text", items: [raw] });
      }
    }
  }

  return (
    <span className={className}>
      {blocks.map((b, i) => {
        if (b.type === "list") {
          return (
            <ul key={i} className="my-1 space-y-1">
              {b.items.map((it, j) => (
                <li key={j} className="flex items-start gap-2">
                  <BulletIcon marker={b.marker!} />
                  <span className="min-w-0 flex-1">{parseRich(it)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // Bloco de texto: preserva quebras de linha simples
        return (
          <Fragment key={i}>
            {b.items.map((line, j) => (
              <Fragment key={j}>
                {parseRich(line)}
                {j < b.items.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </span>
  );
}

function BulletIcon({ marker }: { marker: string }) {
  // > = setinha  |  - = bolinha padrão (cinza) |  * = verde  |  + = azul escura  |  # = marrom
  if (marker === ">") {
    return <span className="mt-[2px] shrink-0 text-gold" aria-hidden>▸</span>;
  }
  const color =
    marker === "*" ? "bg-emerald-500"
    : marker === "+" ? "bg-blue-900"
    : marker === "#" ? "bg-amber-800"
    : "bg-foreground/60";
  return <span className={`mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${color}`} aria-hidden />;
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
