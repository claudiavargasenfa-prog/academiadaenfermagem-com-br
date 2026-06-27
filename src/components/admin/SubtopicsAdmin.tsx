import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { renderContent } from "@/lib/markdown";

type Subtopic = {
  id: string;
  mini_app_id: string;
  slug: string;
  title: string;
  ordem: number;
  icon: string | null;
  content_md: string | null;
  video_url: string | null;
  audio_url: string | null;
  is_draft: boolean;
};

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

export function SubtopicsAdmin({ miniAppId }: { miniAppId: string }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Subtopic | null>(null);
  const [creating, setCreating] = useState(false);

  const q = useQuery({
    queryKey: ["admin_subtopics", miniAppId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_app_subtopics")
        .select("*")
        .eq("mini_app_id", miniAppId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Subtopic[];
    },
  });

  async function move(s: Subtopic, dir: -1 | 1) {
    const list = q.data ?? [];
    const idx = list.findIndex((x) => x.id === s.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await supabase.from("mini_app_subtopics").update({ ordem: swap.ordem }).eq("id", s.id);
    await supabase.from("mini_app_subtopics").update({ ordem: s.ordem }).eq("id", swap.id);
    qc.invalidateQueries({ queryKey: ["admin_subtopics", miniAppId] });
    qc.invalidateQueries({ queryKey: ["mini_app_subtopics"] });
  }

  async function remove(id: string) {
    if (!confirm("Apagar este sub-tópico?")) return;
    const { error } = await supabase.from("mini_app_subtopics").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin_subtopics", miniAppId] });
    qc.invalidateQueries({ queryKey: ["mini_app_subtopics"] });
  }

  const items = q.data ?? [];
  const nextOrdem = items.length ? Math.max(...items.map((s) => s.ordem)) + 1 : 0;

  return (
    <div className="rounded-xl border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sub-tópicos ({items.length})
        </p>
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20"
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar sub-tópico
        </button>
      </div>

      {(creating || editing) && (
        <SubtopicForm
          miniAppId={miniAppId}
          subtopic={editing}
          nextOrdem={nextOrdem}
          onClose={() => {
            setCreating(false);
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin_subtopics", miniAppId] });
            qc.invalidateQueries({ queryKey: ["mini_app_subtopics"] });
          }}
        />
      )}

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nenhum sub-tópico. Útil pra dividir conteúdos extensos (ex: Processo de Enfermagem em
          Histórico, Diagnóstico, Planejamento...).
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-2 py-1.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span>{s.icon ?? "📖"}</span>
                  <span className="font-semibold">{s.title}</span>
                  {s.is_draft && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                      rascunho
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">slug: {s.slug}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => move(s, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-foreground/60 hover:bg-foreground/5 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(s, 1)}
                  disabled={i === items.length - 1}
                  className="rounded p-1 text-foreground/60 hover:bg-foreground/5 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(s);
                    setCreating(false);
                  }}
                  className="rounded bg-primary/10 p-1 text-primary hover:bg-primary/20"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="rounded bg-destructive/10 p-1 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function SubtopicForm({
  miniAppId,
  subtopic,
  nextOrdem,
  onClose,
}: {
  miniAppId: string;
  subtopic: Subtopic | null;
  nextOrdem: number;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: subtopic?.title ?? "",
    slug: subtopic?.slug ?? "",
    icon: subtopic?.icon ?? "",
    ordem: subtopic?.ordem ?? nextOrdem,
    content_md: subtopic?.content_md ?? "",
    video_url: subtopic?.video_url ?? "",
    audio_url: subtopic?.audio_url ?? "",
    is_draft: subtopic?.is_draft ?? false,
  });
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const payload = {
      mini_app_id: miniAppId,
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      icon: form.icon || null,
      ordem: Number(form.ordem) || 0,
      content_md: form.content_md || null,
      video_url: form.video_url || null,
      audio_url: form.audio_url || null,
      is_draft: form.is_draft,
    };
    const res = subtopic
      ? await supabase.from("mini_app_subtopics").update(payload).eq("id", subtopic.id)
      : await supabase.from("mini_app_subtopics").insert(payload);
    setBusy(false);
    if (res.error) {
      setErr(res.error.message);
      return;
    }
    onClose();
  }

  return (
    <div className="mb-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
      <div className="space-y-2 text-sm">
        <h4 className="font-display text-sm font-bold">
          {subtopic ? "Editar sub-tópico" : "Novo sub-tópico"}
        </h4>
        <div className="grid gap-2 sm:grid-cols-[1fr_180px_70px_70px]">
          <input
            required
            value={form.title}
            onChange={(e) => {
              const t = e.target.value;
              setForm((f) => ({
                ...f,
                title: t,
                slug: subtopic ? f.slug : slugify(t),
              }));
            }}
            placeholder="Título (ex: Diagnóstico de Enfermagem)"
            className={input}
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="slug"
            className={input}
          />
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="📖"
            className={input}
          />
          <input
            type="number"
            value={form.ordem}
            onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })}
            className={input}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Conteúdo (HTML ou markdown)
          </span>
          <div className="flex gap-1 rounded-lg bg-foreground/5 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`rounded-md px-2 py-0.5 ${mode === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`rounded-md px-2 py-0.5 ${mode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Pré-visualizar
            </button>
          </div>
        </div>
        {mode === "edit" ? (
          <textarea
            rows={10}
            value={form.content_md}
            onChange={(e) => setForm({ ...form, content_md: e.target.value })}
            className={`${input} font-mono text-xs`}
            placeholder="Cole HTML do Word/Google Docs ou escreva em markdown..."
          />
        ) : (
          <div className="min-h-[120px] rounded-lg border border-border bg-background px-3 py-2">
            {form.content_md.trim() ? (
              renderContent(form.content_md)
            ) : (
              <p className="text-xs text-muted-foreground">Nada digitado.</p>
            )}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            placeholder="URL de vídeo (YouTube/Vimeo)"
            className={input}
          />
          <input
            value={form.audio_url}
            onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
            placeholder="URL de áudio"
            className={input}
          />
        </div>

        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={form.is_draft}
            onChange={(e) => setForm({ ...form, is_draft: e.target.checked })}
          />
          Rascunho (não aparece para alunos)
        </label>

        {err && <p className="text-xs text-destructive">{err}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-foreground/10 px-3 py-1.5 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Salvando..." : "Salvar sub-tópico"}
          </button>
        </div>
      </div>
    </div>
  );
}
