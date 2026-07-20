import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { RichText, fetchAppTexts } from "@/lib/app-texts";

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

type Row = { key: string; value: string; description: string | null };

export function TextsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin_app_texts"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("app_texts")
        .select("key, value, description")
        .order("key", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    if (q.data) {
      const next: Record<string, string> = {};
      for (const r of q.data) next[r.key] = r.value ?? "";
      setDrafts(next);
    }
  }, [q.data]);

  async function save(key: string) {
    setSavingKey(key);
    const value = drafts[key] ?? "";
    const { error } = await supabase
      .from("app_texts")
      .upsert({ key, value }, { onConflict: "key" });
    setSavingKey(null);
    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    await fetchAppTexts();
    qc.invalidateQueries({ queryKey: ["app_texts"] });
    qc.invalidateQueries({ queryKey: ["admin_app_texts"] });
  }

  async function createNew(e: React.FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    const { error } = await supabase
      .from("app_texts")
      .insert({ key: newKey.trim(), value: newValue, description: newDesc || null });
    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    setNewKey(""); setNewValue(""); setNewDesc("");
    qc.invalidateQueries({ queryKey: ["admin_app_texts"] });
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-display text-base font-bold">Como funciona</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Edite qualquer texto do app aqui. Use marcação para destacar:
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          <li><code className="rounded bg-foreground/5 px-1">**texto**</code> → <strong className="font-extrabold">texto</strong> em negrito</li>
          <li><code className="rounded bg-foreground/5 px-1">__texto__</code> → <span className="font-bold text-gold">texto</span> em cor dourada</li>
          <li><code className="rounded bg-foreground/5 px-1">^^texto^^</code> → <span className="inline-flex items-center rounded-md bg-gold/20 px-1.5 py-0.5 text-[0.85em] font-extrabold uppercase text-amber-900">TEXTO</span> em pílula colorida</li>
        </ul>
        <p className="mt-3 text-xs font-bold">Listas (um item por linha):</p>
        <ul className="mt-1 space-y-1 text-xs">
          <li><code className="rounded bg-foreground/5 px-1">- item</code> → <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/60 align-middle" /> bolinha cinza (padrão)</li>
          <li><code className="rounded bg-foreground/5 px-1">&gt; item</code> → <span className="text-gold">▸</span> setinha dourada</li>
          <li><code className="rounded bg-foreground/5 px-1">* item</code> → <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" /> bolinha verde</li>
          <li><code className="rounded bg-foreground/5 px-1">+ item</code> → <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-900 align-middle" /> bolinha azul escura</li>
          <li><code className="rounded bg-foreground/5 px-1"># item</code> → <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-800 align-middle" /> bolinha marrom</li>
        </ul>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Aperte Enter pra pular linha. Linhas em branco também funcionam.
        </p>
      </Card>

      {q.data?.map((row) => {
        const val = drafts[row.key] ?? "";
        const dirty = val !== (row.value ?? "");
        return (
          <Card key={row.key}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] font-semibold text-muted-foreground">{row.key}</p>
                {row.description && <p className="text-[11px] text-muted-foreground">{row.description}</p>}
                <textarea
                  rows={2}
                  className={`${input} mt-2`}
                  value={val}
                  onChange={(e) => setDrafts((d) => ({ ...d, [row.key]: e.target.value }))}
                />
                <p className="mt-2 rounded-lg border border-dashed border-border/60 bg-background/60 px-2 py-1 text-xs">
                  Prévia: <RichText>{val}</RichText>
                </p>
              </div>
              <button
                disabled={!dirty || savingKey === row.key}
                onClick={() => save(row.key)}
                className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
              >
                <Save className="mr-1 inline h-3.5 w-3.5" />
                {savingKey === row.key ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </Card>
        );
      })}

      <Card className="border-primary/30">
        <h3 className="font-display text-base font-bold">Novo texto</h3>
        <form onSubmit={createNew} className="mt-2 space-y-2 text-sm">
          <input className={input} placeholder="chave (ex: aplicativo.tecnico.slogan)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
          <input className={input} placeholder="descrição (opcional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <textarea className={input} rows={2} placeholder="valor do texto" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Criar texto</button>
        </form>
      </Card>
    </div>
  );
}
