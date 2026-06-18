import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export function ProcedimentoChecklist({ slug, itens }: { slug: string; itens: string[] }) {
  const storageKey = `proc-checklist:${slug}`;
  const [marcados, setMarcados] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMarcados(new Set(JSON.parse(raw)));
    } catch {
      /* noop */
    }
  }, [storageKey]);

  function toggle(i: number) {
    setMarcados((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        /* noop */
      }
      return next;
    });
  }

  const total = itens.length;
  const feitos = marcados.size;
  const pct = total ? Math.round((feitos / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Checklist de execução
        </p>
        <span className="text-xs font-bold text-primary">
          {feitos}/{total} · {pct}%
        </span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full bg-gold transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-1.5">
        {itens.map((item, i) => {
          const ok = marcados.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  ok
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-foreground/15 bg-card hover:border-primary"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    ok ? "border-emerald-600 bg-emerald-600 text-white" : "border-foreground/30"
                  }`}
                >
                  {ok && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="flex-1 leading-snug">{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
