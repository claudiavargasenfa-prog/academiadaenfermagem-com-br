import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { fetchMiniApps } from "@/lib/access";
import {
  fetchApps,
  fetchAppSections,
  fetchPlacementsForApp,
  type AppRow,
  type AppSection,
  type MiniAppPlacement,
} from "@/lib/apps";

export function AppsAdmin() {
  const qc = useQueryClient();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<AppRow | null>(null);
  const [creatingApp, setCreatingApp] = useState(false);

  const appsQ = useQuery({ queryKey: ["apps"], queryFn: fetchApps });
  const apps = appsQ.data ?? [];
  const selected = apps.find((a) => a.id === selectedAppId) ?? apps[0];

  async function handleDeleteApp(id: string) {
    if (!confirm("Excluir este app? Os mini apps continuam existindo, só perdem o vínculo com este app.")) return;
    const { error } = await supabase.from("apps").delete().eq("id", id);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["apps"] });
    if (selectedAppId === id) setSelectedAppId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Apps (academias)</h2>
        <button
          onClick={() => setCreatingApp(true)}
          className="inline-flex items-center gap-1.5 rounded-xl gold-gradient px-4 py-2 text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Novo app
        </button>
      </div>

      {(creatingApp || editingApp) && (
        <AppForm
          app={editingApp}
          onClose={() => {
            setCreatingApp(false);
            setEditingApp(null);
            qc.invalidateQueries({ queryKey: ["apps"] });
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold ${
              selected?.id === app.id ? "border-primary bg-primary/10" : "border-foreground/15"
            }`}
            style={
              selected?.id === app.id
                ? undefined
                : { backgroundColor: app.bg_color ?? undefined, color: app.fg_color ?? undefined }
            }
          >
            <span>{app.emoji}</span>
            {app.short_name ?? app.name}
            {!app.is_active && <span className="text-[10px] opacity-60">(inativo)</span>}
          </button>
        ))}
      </div>

      {selected && (
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">App selecionado</p>
              <h3 className="font-display text-base font-extrabold">
                {selected.emoji} {selected.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">slug: {selected.slug} · ordem: {selected.ordem}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setEditingApp(selected)}
                className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteApp(selected.id)}
                className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <AppContent app={selected} />
        </Card>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Formulário de app
// ----------------------------------------------------------------------------

function AppForm({ app, onClose }: { app: AppRow | null; onClose: () => void }) {
  const [form, setForm] = useState({
    slug: app?.slug ?? "",
    name: app?.name ?? "",
    short_name: app?.short_name ?? "",
    emoji: app?.emoji ?? "📱",
    bg_color: app?.bg_color ?? "#E0F2FE",
    fg_color: app?.fg_color ?? "#0C4A6E",
    description: app?.description ?? "",
    ordem: app?.ordem ?? 0,
    is_active: app?.is_active ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const payload = {
      ...form,
      short_name: form.short_name || null,
      description: form.description || null,
    };
    const res = app
      ? await supabase.from("apps").update(payload).eq("id", app.id)
      : await supabase.from("apps").insert(payload);
    setBusy(false);
    if (res.error) return setErr(res.error.message);
    onClose();
  }

  return (
    <Card className="border-primary/40">
      <form onSubmit={handleSave} className="space-y-3 text-sm">
        <h3 className="font-display text-base font-bold">{app ? "Editar app" : "Novo app"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
          </Field>
          <Field label="Nome curto (chips/menu)">
            <input value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} className={input} />
          </Field>
          <Field label="Slug (url, sem espaço)">
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              className={input}
              placeholder="ex: tecnico-estudante"
            />
          </Field>
          <Field label="Emoji">
            <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className={input} />
          </Field>
          <Field label="Cor de fundo">
            <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="h-10 w-full rounded-lg" />
          </Field>
          <Field label="Cor do texto">
            <input type="color" value={form.fg_color} onChange={(e) => setForm({ ...form, fg_color: e.target.value })} className="h-10 w-full rounded-lg" />
          </Field>
        </div>
        <Field label="Descrição">
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
        </Field>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Ativo (visível na loja)
          </label>
          <Field label="Ordem">
            <input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} className={`${input} w-24`} />
          </Field>
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold">
            Cancelar
          </button>
          <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Card>
  );
}

// ----------------------------------------------------------------------------
// Conteúdo do app: seções + mini apps arrastáveis
// ----------------------------------------------------------------------------

function AppContent({ app }: { app: AppRow }) {
  const qc = useQueryClient();
  const sectionsQ = useQuery({
    queryKey: ["app_sections", app.id],
    queryFn: () => fetchAppSections(app.id),
  });
  const placementsQ = useQuery({
    queryKey: ["app_placements", app.id],
    queryFn: () => fetchPlacementsForApp(app.id),
  });
  const miniAppsQ = useQuery({ queryKey: ["admin_mini_apps_all"], queryFn: fetchMiniApps });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sections = sectionsQ.data ?? [];
  const placements = placementsQ.data ?? [];
  const miniApps = miniAppsQ.data ?? [];
  const miniById = useMemo(() => new Map(miniApps.map((m) => [m.id, m])), [miniApps]);
  const placedIds = new Set(placements.map((p) => p.mini_app_id));
  const available = miniApps
    .filter((m) => !placedIds.has(m.id))
    .slice()
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"));

  const currentSortMode = ((app as any).sort_mode ?? "numeric") as "numeric" | "alpha";

  // No modo alfabético mostramos por nome; no numérico, por ordem gravada (drag)
  const sortItems = (items: MiniAppPlacement[]) =>
    items.slice().sort((a, b) => {
      if (currentSortMode === "alpha") {
        const na = miniById.get(a.mini_app_id)?.name ?? "";
        const nb = miniById.get(b.mini_app_id)?.name ?? "";
        return na.localeCompare(nb, "pt-BR");
      }
      return a.ordem - b.ordem;
    });

  // Containers: "unsec" + each section.id
  const containers = useMemo(() => {
    const out: { id: string; title: string; emoji: string | null; sectionId: string | null; items: MiniAppPlacement[] }[] = [];
    out.push({
      id: "unsec",
      title: "Sem seção (geral)",
      emoji: "📦",
      sectionId: null,
      items: sortItems(placements.filter((p) => !p.section_id)),
    });
    for (const s of sections) {
      out.push({
        id: s.id,
        title: s.title,
        emoji: s.emoji,
        sectionId: s.id,
        items: sortItems(placements.filter((p) => p.section_id === s.id)),
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, placements, miniById, currentSortMode]);


  function findContainerOf(placementId: string) {
    return containers.find((c) => c.items.some((p) => p.id === placementId));
  }

  async function persistContainer(containerId: string, items: MiniAppPlacement[]) {
    const section_id = containerId === "unsec" ? null : containerId;
    const updates = items.map((p, i) => ({ id: p.id, section_id, ordem: i }));
    for (const u of updates) {
      await supabase.from("mini_app_placements").update({ section_id: u.section_id, ordem: u.ordem }).eq("id", u.id);
    }
    qc.invalidateQueries({ queryKey: ["app_placements", app.id] });
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    const fromContainer = findContainerOf(activeId);
    if (!fromContainer) return;

    // overId can be a placement id (item) OR a container id (empty section)
    let toContainer = containers.find((c) => c.id === overId);
    if (!toContainer) toContainer = findContainerOf(overId);
    if (!toContainer) return;

    if (fromContainer.id === toContainer.id) {
      const oldIdx = fromContainer.items.findIndex((p) => p.id === activeId);
      const newIdx = fromContainer.items.findIndex((p) => p.id === overId);
      if (oldIdx < 0 || newIdx < 0 || oldIdx === newIdx) return;
      const reordered = arrayMove(fromContainer.items, oldIdx, newIdx);
      await persistContainer(fromContainer.id, reordered);
    } else {
      const item = fromContainer.items.find((p) => p.id === activeId)!;
      const newFrom = fromContainer.items.filter((p) => p.id !== activeId);
      const insertIdx =
        toContainer.id === overId ? toContainer.items.length : toContainer.items.findIndex((p) => p.id === overId);
      const newTo = [...toContainer.items];
      newTo.splice(insertIdx < 0 ? newTo.length : insertIdx, 0, item);
      await Promise.all([persistContainer(fromContainer.id, newFrom), persistContainer(toContainer.id, newTo)]);
    }
  }

  async function addPlacement(miniAppId: string, sectionId: string | null) {
    const ordem = (placements.filter((p) => p.section_id === sectionId).reduce((m, p) => Math.max(m, p.ordem), -1)) + 1;
    const { error } = await supabase
      .from("mini_app_placements")
      .insert({ mini_app_id: miniAppId, app_id: app.id, section_id: sectionId, ordem });
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["app_placements", app.id] });
  }

  async function removePlacement(id: string) {
    if (!confirm("Remover este mini app deste app? Ele continua existindo, só sai daqui.")) return;
    const { error } = await supabase.from("mini_app_placements").delete().eq("id", id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["app_placements", app.id] });
  }

  const sortMode = currentSortMode;

  async function setSortMode(mode: "numeric" | "alpha") {
    await supabase.from("apps").update({ sort_mode: mode } as any).eq("id", app.id);
    qc.invalidateQueries({ queryKey: ["apps"] });
  }

  async function renumberBy10() {
    // Renumera todos os placements deste app em incrementos de 10, respeitando seções.
    const grouped = new Map<string | null, MiniAppPlacement[]>();
    for (const p of placements) {
      const k = p.section_id ?? null;
      const arr = grouped.get(k) ?? [];
      arr.push(p);
      grouped.set(k, arr);
    }
    for (const [, arr] of grouped) {
      arr.sort((a, b) => a.ordem - b.ordem);
      for (let i = 0; i < arr.length; i++) {
        await supabase.from("mini_app_placements").update({ ordem: (i + 1) * 10 }).eq("id", arr[i].id);
      }
    }
    qc.invalidateQueries({ queryKey: ["app_placements", app.id] });
    alert("Renumerado! Agora insira novos entre os números (ex.: 15, 25).");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
        <span className="font-semibold">Ordem dos mini apps neste app:</span>
        <button
          type="button"
          onClick={() => setSortMode("numeric")}
          className={`rounded-lg px-3 py-1 text-xs font-bold ${sortMode === "numeric" ? "bg-primary text-primary-foreground" : "bg-background"}`}
        >
          🔢 Numérica
        </button>
        <button
          type="button"
          onClick={() => setSortMode("alpha")}
          className={`rounded-lg px-3 py-1 text-xs font-bold ${sortMode === "alpha" ? "bg-primary text-primary-foreground" : "bg-background"}`}
        >
          🔤 Alfabética (A→Z)
        </button>
        <button
          type="button"
          onClick={renumberBy10}
          className="ml-auto rounded-lg bg-foreground/10 px-3 py-1 text-xs font-bold hover:bg-foreground/20"
          title="Reescreve as ordens em 10, 20, 30… para você inserir novos no meio"
        >
          ↻ Renumerar de 10 em 10
        </button>
        <span className="w-full text-[11px] text-muted-foreground">
          {sortMode === "numeric"
            ? "Arraste os cards abaixo (grava número automaticamente) ou renumere."
            : "Ignora os números; a tela do aluno mostra em ordem alfabética."}
        </span>
      </div>

      <SectionsManager appId={app.id} sections={sections} />



      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {containers.map((c) => (
              <Container key={c.id} container={c} miniById={miniById} onRemove={removePlacement} onAddTo={(mid) => addPlacement(mid, c.sectionId)} available={available} />
            ))}
          </div>
        </DndContext>
        <aside className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mini apps fora deste app ({available.length})
          </h4>
          <div className="max-h-[480px] overflow-y-auto rounded-xl border border-foreground/10 p-2 text-xs">
            {available.length === 0 ? (
              <p className="text-muted-foreground">Todos já estão neste app.</p>
            ) : (
              <ul className="space-y-1">
                {available.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg border border-foreground/10 bg-background px-2 py-1.5">
                    <span className="truncate">
                      <span className="mr-1">{m.icon ?? "📘"}</span>
                      {m.name}
                    </span>
                    <button
                      onClick={() => addPlacement(m.id, null)}
                      className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20"
                      title="Adicionar em 'Sem seção'"
                    >
                      + add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Gestão de seções
// ----------------------------------------------------------------------------

function SectionsManager({ appId, sections }: { appId: string; sections: AppSection[] }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📚");

  async function addSection() {
    if (!title.trim()) return;
    const ordem = sections.reduce((m, s) => Math.max(m, s.ordem), -1) + 1;
    const { error } = await supabase.from("app_sections").insert({ app_id: appId, title: title.trim(), emoji: emoji || null, ordem });
    if (error) return alert(error.message);
    setTitle("");
    qc.invalidateQueries({ queryKey: ["app_sections", appId] });
  }
  async function rename(s: AppSection) {
    const v = prompt("Novo título:", s.title);
    if (v == null) return;
    const e = prompt("Emoji (opcional):", s.emoji ?? "");
    await supabase.from("app_sections").update({ title: v.trim() || s.title, emoji: e?.trim() || null }).eq("id", s.id);
    qc.invalidateQueries({ queryKey: ["app_sections", appId] });
  }
  async function remove(s: AppSection) {
    if (!confirm(`Excluir seção "${s.title}"? Mini apps dentro voltam para "Sem seção".`)) return;
    await supabase.from("app_sections").delete().eq("id", s.id);
    qc.invalidateQueries({ queryKey: ["app_sections", appId] });
    qc.invalidateQueries({ queryKey: ["app_placements", appId] });
  }
  async function move(s: AppSection, dir: -1 | 1) {
    const sorted = [...sections].sort((a, b) => a.ordem - b.ordem);
    const idx = sorted.findIndex((x) => x.id === s.id);
    const j = idx + dir;
    if (j < 0 || j >= sorted.length) return;
    const other = sorted[j];
    await supabase.from("app_sections").update({ ordem: other.ordem }).eq("id", s.id);
    await supabase.from("app_sections").update({ ordem: s.ordem }).eq("id", other.id);
    qc.invalidateQueries({ queryKey: ["app_sections", appId] });
  }

  return (
    <div className="rounded-xl border border-foreground/10 p-3">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Seções deste app</h4>
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className={`${input} w-20`} placeholder="📚" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={`${input} flex-1 min-w-[200px]`} placeholder="Nova seção (ex.: SAE, Saúde do Adulto…)" />
        <button onClick={addSection} className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
          + Adicionar seção
        </button>
      </div>
      {sections.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma seção. Adicione uma para agrupar os mini apps.</p>
      ) : (
        <ul className="space-y-1">
          {[...sections].sort((a, b) => a.ordem - b.ordem).map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-foreground/5 px-2 py-1.5 text-sm">
              <span className="font-semibold">
                <span className="mr-1">{s.emoji ?? "📚"}</span>
                {s.title}
              </span>
              <div className="flex gap-1">
                <button onClick={() => move(s, -1)} className="rounded p-1 hover:bg-foreground/10" aria-label="Subir"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(s, 1)} className="rounded p-1 hover:bg-foreground/10" aria-label="Descer"><ArrowDown className="h-3.5 w-3.5" /></button>
                <button onClick={() => rename(s)} className="rounded p-1 hover:bg-foreground/10" aria-label="Renomear"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(s)} className="rounded p-1 text-destructive hover:bg-destructive/10" aria-label="Excluir"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Container e item arrastável
// ----------------------------------------------------------------------------

function Container({
  container,
  miniById,
  onRemove,
  onAddTo,
  available,
}: {
  container: { id: string; title: string; emoji: string | null; sectionId: string | null; items: MiniAppPlacement[] };
  miniById: Map<string, any>;
  onRemove: (id: string) => void;
  onAddTo: (miniAppId: string) => void;
  available: any[];
}) {
  const ids = container.items.map((i) => i.id);
  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold">
          <span className="mr-1">{container.emoji ?? "📦"}</span>
          {container.title}
          <span className="ml-2 text-[10px] font-normal text-muted-foreground">({container.items.length})</span>
        </h4>
        <select
          className="rounded-md border border-foreground/15 bg-background px-2 py-1 text-[11px]"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onAddTo(e.target.value);
              e.currentTarget.value = "";
            }
          }}
        >
          <option value="">+ adicionar aqui…</option>
          {available.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy} id={container.id}>
        <ul data-container-id={container.id} className="min-h-[40px] space-y-1 rounded-md bg-foreground/3 p-1">
          {container.items.length === 0 && (
            <li className="rounded-md border border-dashed border-foreground/15 px-2 py-3 text-center text-[11px] text-muted-foreground">
              Arraste mini apps para cá
            </li>
          )}
          {container.items.map((p) => {
            const m = miniById.get(p.mini_app_id);
            if (!m) return null;
            return <SortableItem key={p.id} id={p.id} title={m.name} icon={m.icon ?? "📘"} onRemove={() => onRemove(p.id)} />;
          })}
        </ul>
      </SortableContext>
    </div>
  );
}

function SortableItem({ id, title, icon, onRemove }: { id: string; title: string; icon: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between gap-2 rounded-md border border-foreground/10 bg-background px-2 py-1.5 text-sm">
      <button {...attributes} {...listeners} className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-foreground/10" aria-label="Arrastar">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="flex-1 truncate"><span className="mr-1">{icon}</span>{title}</span>
      <button onClick={onRemove} className="rounded p-1 text-destructive hover:bg-destructive/10" aria-label="Remover deste app">
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

const input =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
