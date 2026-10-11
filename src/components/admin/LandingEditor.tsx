import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADEC_FIELDS, safeLandingUrl } from "@/lib/adec-editor";
import { fetchAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";

export function LandingEditor() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["app_texts"], queryFn: fetchAppTexts, staleTime: 0 });
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (q.data) setDraft(Object.fromEntries(ADEC_FIELDS.map(f => [f.key, q.data?.[`vendas.${f.key}`] ?? f.defaultValue])));
  }, [q.data]);
  const changed = ADEC_FIELDS.filter(f => draft[f.key] !== undefined && draft[f.key] !== (q.data?.[`vendas.${f.key}`] ?? f.defaultValue));
  const groups = [...new Set(ADEC_FIELDS.map(f => f.group))];
  async function save() {
    setSaving(true); setStatus("");
    try {
      const invalid = changed.find(f => ["image", "link"].includes(f.kind) && safeLandingUrl(draft[f.key], "INVALID") === "INVALID");
      if (invalid) throw new Error(`Confira o endereço de “${invalid.label}”. Use um endereço https ou um caminho do site.`);
      const { error } = await supabase.from("app_texts").upsert(changed.map(f => ({ key: `vendas.${f.key}`, value: draft[f.key], description: `${f.group} — ${f.label}` })), { onConflict: "key" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["app_texts"] });
      await qc.invalidateQueries({ queryKey: ["admin_app_texts"] });
      setStatus("Alterações salvas.");
    } catch (e) { setStatus(e instanceof Error ? e.message : "Não foi possível salvar. Tente novamente."); }
    finally { setSaving(false); }
  }
  return <section className="min-w-0 space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <h2 className="font-display text-xl font-bold">Página ADEC — do banner ao rodapé</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild><a href="/adec" target="_blank" rel="noreferrer"><ExternalLink />Abrir página</a></Button>
        <Button onClick={save} disabled={saving || !changed.length}><Save />{saving ? "Salvando…" : `Salvar alterações${changed.length ? ` (${changed.length})` : ""}`}</Button>
      </div>
    </div>
    <input aria-label="Buscar na página ADEC" placeholder="Buscar texto ou seção" value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    {status && <p role="status" className="flex items-center gap-2 text-sm"><Check className="h-4 w-4" />{status}</p>}
    {q.isPending ? <p>Carregando…</p> : q.isError ? <p role="alert">Não foi possível carregar os textos. <Button variant="outline" onClick={() => q.refetch()}>Tentar novamente</Button></p> : groups.map(group => {
      const fields = ADEC_FIELDS.filter(f => f.group === group && `${f.label} ${group} ${draft[f.key]}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      if (!fields.length) return null;
      return <details key={group} open={!!search || group === "Banner coral"} className="border-b border-border pb-4">
        <summary className="cursor-pointer font-display text-base font-bold">{group} <span className="text-sm font-normal text-muted-foreground">({fields.length})</span></summary>
        <div className="mt-4 grid min-w-0 gap-5 md:grid-cols-2">
          {fields.map(f => <label key={f.key} className="block min-w-0 text-sm font-medium">
            <span className="block break-words">{f.label}</span>
            {f.kind === "text" ? <textarea aria-label={f.label} rows={3} value={draft[f.key] ?? f.defaultValue} onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-normal" /> : <input aria-label={f.label} value={draft[f.key] ?? f.defaultValue} onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-normal" />}
            {f.kind === "image" && <img src={safeLandingUrl(draft[f.key] ?? f.defaultValue, f.defaultValue)} alt={f.label} className="mt-2 h-28 max-w-full object-contain" />}
          </label>)}
        </div>
      </details>;
    })}
    <Button disabled={saving || !changed.length} onClick={save}><Save />{saving ? "Salvando…" : "Salvar alterações"}</Button>
  </section>;
}