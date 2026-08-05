import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { Pencil, Plus, Trash2, ArrowLeft, LayoutGrid } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppHtmlContent } from "@/components/MiniAppContent";
import { supabase } from "@/integrations/supabase/client";
import { fetchMiniApps, formatPriceBRL, useIsAdmin, type MiniApp } from "@/lib/access";
import { SubscriptionsAdmin } from "@/components/admin/SubscriptionsAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";
import { TextsAdmin } from "@/components/admin/TextsAdmin";
import { BadgesEditor } from "@/components/admin/BadgesEditor";
import { SubtopicsAdmin } from "@/components/admin/SubtopicsAdmin";
import { AppsAdmin } from "@/components/admin/AppsAdmin";
import { fetchApps } from "@/lib/apps";
import { FeedbackAdmin } from "@/components/admin/FeedbackAdmin";
import { PixMonitor } from "@/components/admin/PixMonitor";
import { QUIZZES } from "@/data/quizzes";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Academia da Enfermagem" }] }),
  component: AdminPage,
});

function AdminPage() {
  const adminQ = useIsAdmin();

  if (adminQ.isLoading || adminQ.isFetching) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Verificando permissão...</p>
      </AppShell>
    );
  }

  if (!adminQ.data) {
    return (
      <AppShell>
        <PageHeader title="Acesso restrito" />
        <Card>
          <p className="text-sm">
            Esta área é só para administradores. Se você é a dona do app, peça pro suporte
            do Lovable promover seu usuário a admin (ou rode o comando uma única vez).
          </p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary">
            Voltar para o início
          </Link>
        </Card>
      </AppShell>
    );
  }

  return <AdminContent />;
}

function AdminContent() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"apps" | "organize" | "subs" | "users" | "texts" | "feedbacks" | "pix">("apps");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MiniApp | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [archiving, setArchiving] = useState(false);
  const [reactivating, setReactivating] = useState<string | null>(null);

  async function handleReactivate(app: MiniApp) {
    setReactivating(app.id);
    try {
      // remove do app "Arquivo" (se estiver lá)
      const { data: archiveApp } = await supabase
        .from("apps")
        .select("id")
        .eq("slug", "arquivo-2-projeto")
        .maybeSingle();
      if (archiveApp?.id) {
        await supabase
          .from("mini_app_placements")
          .delete()
          .eq("mini_app_id", app.id)
          .eq("app_id", archiveApp.id);
      }
      // reativa
      const { error } = await supabase
        .from("mini_apps")
        .update({ is_active: true } as any)
        .eq("id", app.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin_mini_apps"] });
      qc.invalidateQueries({ queryKey: ["mini_apps"] });
      qc.invalidateQueries({ queryKey: ["admin_mini_app_placements"] });
      qc.invalidateQueries({ queryKey: ["app_placements"] });
    } catch (e: any) {
      alert("Erro ao reativar: " + (e?.message ?? String(e)));
    } finally {
      setReactivating(null);
    }
  }

  function toggleSel(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function ensureArchiveApp(): Promise<string> {
    const { data: existing } = await supabase
      .from("apps")
      .select("id")
      .eq("slug", "arquivo-2-projeto")
      .maybeSingle();
    if (existing?.id) return existing.id;
    const { data: created, error } = await supabase
      .from("apps")
      .insert({
        slug: "arquivo-2-projeto",
        name: "🗄️ Arquivo — 2º Projeto",
        short_name: "Arquivo",
        emoji: "🗄️",
        bg_color: "#E5E7EB",
        fg_color: "#374151",
        description: "Reserva de mini apps para um 2º projeto. Oculto dos alunos.",
        ordem: 999,
        is_active: false,
      })
      .select("id")
      .single();
    if (error || !created) throw new Error(error?.message ?? "Falha criando app Arquivo");
    return created.id;
  }

  async function handleBulkArchive() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `Arquivar ${selected.size} mini app(s)?\n\n` +
          `• Vão pro app "🗄️ Arquivo — 2º Projeto" (oculto dos alunos)\n` +
          `• Ficam desativados na loja\n` +
          `• Todo o conteúdo é preservado\n` +
          `• Pra restaurar, arraste em Apps & Organização`,
      )
    )
      return;
    setArchiving(true);
    try {
      const archiveId = await ensureArchiveApp();
      const ids = Array.from(selected);
      const deleteRes = await supabase.from("mini_app_placements").delete().in("mini_app_id", ids);
      if (deleteRes.error) throw deleteRes.error;
      const updateRes = await supabase
        .from("mini_apps")
        .update({
          is_active: false,
          track_academico: false,
          track_tecnico: false,
          track_enfermeiro: false,
        } as any)
        .in("id", ids);
      if (updateRes.error) throw updateRes.error;
      const rows = ids.map((mid, i) => ({
        mini_app_id: mid,
        app_id: archiveId,
        section_id: null,
        ordem: i,
      }));
      const { error } = await supabase.from("mini_app_placements").insert(rows);
      if (error) throw error;
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["admin_mini_apps"] });
      qc.invalidateQueries({ queryKey: ["admin_mini_app_placements"] });
      qc.invalidateQueries({ queryKey: ["mini_apps"] });
      qc.invalidateQueries({ queryKey: ["apps"] });
      qc.invalidateQueries({ queryKey: ["app_placements"] });
      alert("Pronto! Veja em 'Apps & Organização' → app 🗄️ Arquivo.");
    } catch (e: any) {
      alert("Erro ao arquivar: " + (e?.message ?? String(e)));
    } finally {
      setArchiving(false);
    }
  }

  const appsQ = useQuery({
    queryKey: ["admin_mini_apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_apps")
        .select("*")
        .order("kind", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
  const availableAppsQ = useQuery({ queryKey: ["apps"], queryFn: fetchApps });
  const placementsAllQ = useQuery({
    queryKey: ["admin_mini_app_placements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_app_placements")
        .select("mini_app_id, app_id");
      if (error) throw error;
      return data ?? [];
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Apagar este mini app? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("mini_apps").delete().eq("id", id);
    if (error) {
      alert("Erro ao apagar: " + error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin_mini_apps"] });
    qc.invalidateQueries({ queryKey: ["mini_apps"] });
  }

  return (
    <AppShell hideReferences>
      <PageHeader
        eyebrow="Admin"
        title="Academia da Enfermagem"
        description="Gerencie os mini apps e conteúdos técnicos de cada aplicativo separadamente."
      />

      <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-foreground/5 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setTab("apps")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "apps" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Mini apps
        </button>
        <button
          type="button"
          onClick={() => setTab("organize")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "organize" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Apps & Organização
        </button>
        <button
          type="button"
          onClick={() => setTab("subs")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "subs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Planos / Cakto
        </button>
        <button
          type="button"
          onClick={() => setTab("users")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "users" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Usuários
        </button>
        <button
          type="button"
          onClick={() => setTab("texts")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "texts" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Textos do App
        </button>
        <button
          type="button"
          onClick={() => setTab("feedbacks")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "feedbacks" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Feedbacks
        </button>
      </div>

      {tab === "feedbacks" ? (
        <FeedbackAdmin />
      ) : tab === "texts" ? (
        <TextsAdmin />
      ) : tab === "users" ? (
        <UsersAdmin />
      ) : tab === "subs" ? (
        <SubscriptionsAdmin />
      ) : tab === "organize" ? (
        <AppsAdmin />
      ) : !selectedAppId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {(availableAppsQ.data ?? []).filter(a => a.is_active).map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 text-left transition-all hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-2xl transition-transform group-hover:scale-110">
                  {app.emoji || "📱"}
                </div>
                <h3 className="mb-1 font-display text-lg font-black uppercase tracking-tight text-foreground">
                  {app.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {app.description || "Gerencie o conteúdo deste aplicativo."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase text-gold-dark">
                  <span>Acessar Módulos</span>
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </button>
          ))}
          
          <button
            onClick={() => setSelectedAppId("all")}
            className="group relative overflow-hidden rounded-3xl border border-dashed border-foreground/20 bg-foreground/5 p-6 text-left transition-all hover:border-foreground/40 hover:bg-foreground/10"
          >
            <div className="relative z-10 flex h-full flex-col justify-center text-center">
              <LayoutGrid className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <h3 className="font-display text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Ver Todos os Mini Apps
              </h3>
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                Acesso global a todos os módulos sem filtro de app.
              </p>
            </div>
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setSelectedAppId(null)}
              className="group flex items-center gap-2 rounded-xl bg-foreground/5 px-4 py-2 text-xs font-bold uppercase transition-all hover:bg-foreground/10"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar para Apps
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Filtro Ativo:</span>
              <span className="rounded-full bg-gold/20 px-3 py-1 text-[10px] font-black uppercase text-gold-dark border border-gold/30">
                {selectedAppId === "all" ? "Todos os Módulos" : availableAppsQ.data?.find(a => a.id === selectedAppId)?.name}
              </span>
            </div>
          </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar mini app por nome, slug ou descrição..."
          className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm sm:max-w-sm"
        />
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl gold-gradient px-4 py-2 text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Novo mini app
        </button>
      </div>

      {selected.size > 0 && (
        <div className="sticky top-2 z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
          <span className="font-semibold">📋 {selected.size} selecionado(s)</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-lg bg-foreground/10 px-3 py-1.5 text-xs font-semibold"
            >
              Limpar
            </button>
            <button
              onClick={handleBulkArchive}
              disabled={archiving}
              className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background disabled:opacity-60"
            >
              🗄️ {archiving ? "Arquivando..." : "Arquivar selecionados"}
            </button>
          </div>
        </div>
      )}


      {(creating || editing) && (
        <MiniAppForm
          key={editing?.id ?? "new"}
          app={editing}
          onSaved={(saved) => {
            qc.setQueryData<MiniApp[]>(["admin_mini_apps"], (old) => {
              const list = old ?? [];
              const exists = list.some((item) => item.id === saved.id);
              return exists ? list.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...list];
            });
            qc.setQueryData<MiniApp[]>(["mini_apps"], (old) => {
              if (!old) return old;
              return old.map((item) => (item.id === saved.id ? saved : item));
            });
          }}
          onClose={() => {
            setCreating(false);
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin_mini_apps"] });
            qc.invalidateQueries({ queryKey: ["mini_apps"] });
            qc.invalidateQueries({ queryKey: ["admin_mini_app_placements"] });
            qc.invalidateQueries({ queryKey: ["app_placements"] });
          }}
        />
      )}

      {(() => {
        const allRaw = appsQ.data ?? [];
        const q = search.trim().toLowerCase();
        
        const placementsByMiniApp = new Map<string, Set<string>>();
        for (const p of placementsAllQ.data ?? []) {
          const set = placementsByMiniApp.get(p.mini_app_id) ?? new Set<string>();
          set.add(p.app_id);
          placementsByMiniApp.set(p.mini_app_id, set);
        }

        const filteredByApp = selectedAppId === "all" 
          ? allRaw 
          : allRaw.filter(ma => {
              const appIds = placementsByMiniApp.get(ma.id) || new Set();
              
              // Legado: se não tem placements mas tem as flags track_X marcadas, considera no app
              const appObj = availableAppsQ.data?.find(a => a.id === selectedAppId);
              if (appObj) {
                const legacy = ma as any;
                if (appObj.slug === "academico" && legacy.track_academico) return true;
                if (appObj.slug === "tecnico" && legacy.track_tecnico) return true;
                if (appObj.slug === "enfermeiro" && legacy.track_enfermeiro) return true;
                if (appObj.slug === "obstetricia" && legacy.track_obstetricia) return true;
              }

              return appIds.has(selectedAppId!);
            });

        const all = q
          ? filteredByApp.filter((a: any) =>
              [a.name, a.slug, a.description, a.kind]
                .filter(Boolean)
                .some((v: string) => v.toLowerCase().includes(q)),
            )
          : filteredByApp;

        const availableApps = (availableAppsQ.data ?? [])
          .filter((a) => a.is_active)
          .slice()
          .sort((a, b) => a.ordem - b.ordem || (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"));
        const appBySlug = new Map(availableApps.map((a) => [a.slug, a]));
        // placementsByMiniApp já foi declarado acima

        const appIdsForMiniApp = (miniApp: MiniApp) => {
          const ids = new Set(placementsByMiniApp.get(miniApp.id) ?? []);
          const legacy = miniApp as any;
          if (legacy.track_academico && appBySlug.get("academico")) ids.add(appBySlug.get("academico")!.id);
          if (legacy.track_tecnico && appBySlug.get("tecnico")) ids.add(appBySlug.get("tecnico")!.id);
          if (legacy.track_enfermeiro && appBySlug.get("enfermeiro")) ids.add(appBySlug.get("enfermeiro")!.id);
          if (legacy.track_obstetricia && appBySlug.get("obstetricia")) ids.add(appBySlug.get("obstetricia")!.id);
          return ids;
        };
        const appLabelsForMiniApp = (miniApp: MiniApp) => {
          const ids = appIdsForMiniApp(miniApp);
          return availableApps.filter((app) => ids.has(app.id)).map((app) => app.short_name ?? app.name);
        };
        const renderCard = (app: MiniApp) => (
          <Card key={app.id}>
            <div className="flex items-start justify-between gap-3">
              <input
                type="checkbox"
                checked={selected.has(app.id)}
                onChange={() => toggleSel(app.id)}
                className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                aria-label="Selecionar para arquivar"
              />
              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">
                  <span className="text-xl">{app.icon ?? "📘"}</span>
                  <h3 className="font-display text-base font-bold">{app.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      app.kind === "basico"
                        ? "bg-primary/15 text-primary"
                        : "bg-gold/20 text-foreground"
                    }`}
                  >
                    {app.kind}
                  </span>
                  {!app.is_active && (
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold">
                      inativo
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
                <p className="mt-1 text-xs">
                  <strong>{formatPriceBRL(app.price_cents)}</strong> · slug: {app.slug} · aplicativos: {appLabelsForMiniApp(app).join(", ") || "—"}
                </p>
                <div className="mt-2">
                  <BadgesEditor
                    miniAppId={app.id}
                    value={(app as any).badges}
                    onChanged={(next) => {
                      (app as any).badges = next;
                    }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {!app.is_active && (
                  <button
                    type="button"
                    onClick={() => handleReactivate(app)}
                    disabled={reactivating === app.id}
                    className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                    aria-label="Reativar"
                    title="Reativar mini app"
                  >
                    <span className="text-xs font-bold">↩</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(app);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                  aria-label="Apagar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        );

        const sections = availableApps.map((app) => ({
          id: app.id,
          title: app.short_name ?? app.name.replace(/^Academia d[oa] /i, ""),
          emoji: app.emoji ?? "📚",
          filter: (miniApp: MiniApp) => appIdsForMiniApp(miniApp).has(app.id),
        }));
        const semApp = all.filter(
          (a: MiniApp) => appIdsForMiniApp(a).size === 0,
        );

        return (
          <div className="mt-4 space-y-6">
            {sections.map((sec) => {
              const items = all
                .filter(sec.filter)
                .slice()
                .sort((a: any, b: any) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"));
              return (
                <section key={sec.id}>
                  <h2 className="mb-2 flex items-center gap-2 border-b border-foreground/10 pb-1 font-display text-lg font-bold">
                    <span>{sec.emoji}</span> {sec.title}
                    <span className="text-xs font-normal text-muted-foreground">({items.length})</span>
                  </h2>
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum mini app neste aplicativo.</p>
                  ) : (
                    <div className="space-y-3">{items.map(renderCard)}</div>
                  )}
                </section>
              );
            })}
            {semApp.length > 0 && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 border-b border-foreground/10 pb-1 font-display text-lg font-bold">
                  <span>⚠️</span> Sem aplicativo
                  <span className="text-xs font-normal text-muted-foreground">({semApp.length})</span>
                </h2>
                <div className="space-y-3">
                  {semApp
                    .slice()
                    .sort((a: any, b: any) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"))
                    .map(renderCard)}
                </div>
              </section>
            )}

            {all.length === 0 && (
              <Card>
                <p className="text-sm text-muted-foreground">
                  Nenhum mini app cadastrado. Clique em "Novo mini app" pra começar.
                </p>
              </Card>
            )}
          </div>
        );
      })()}
        </>
      )}
    </AppShell>
  );
}

function centsToReais(c: number | null | undefined): string {
  if (c == null) return "";
  return (c / 100).toFixed(2).replace(".", ",");
}

function reaisToCents(s: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  if (!isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function MiniAppForm({
  app,
  onSaved,
  onClose,
}: {
  app: MiniApp | null;
  onSaved: (saved: MiniApp) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    slug: app?.slug ?? "",
    name: app?.name ?? "",
    description: app?.description ?? "",
    kind: (app?.kind as string) ?? "extra",
    price_reais: centsToReais(app?.price_cents ?? 0),
    price_original_reais: centsToReais((app as any)?.price_original_cents ?? 0),
    cakto_product_id: app?.cakto_product_id ?? "",
    cakto_checkout_url: app?.cakto_checkout_url ?? "",
    icon: app?.icon ?? "",
    content_md: app?.content_md ?? "",
    video_url: app?.video_url ?? "",
    audio_url: app?.audio_url ?? "",
    is_active: app?.is_active ?? true,
    sort_order: app?.sort_order ?? 0,
    gratuito: (app as any)?.gratuito ?? false,
    em_breve: (app as any)?.em_breve ?? false,
    route_path: (app as any)?.route_path ?? "",
    horas_certificado: (app as any)?.horas_certificado ?? 0,
    track_academico: (app as any)?.track_academico ?? false,
    track_tecnico: (app as any)?.track_tecnico ?? false,
    track_enfermeiro: (app as any)?.track_enfermeiro ?? false,
    track_obstetricia: (app as any)?.track_obstetricia ?? false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const normalizedSlug = form.slug.trim().toLowerCase();
  const isQuizzesMiniApp = normalizedSlug === "quizzes";

  // Apps disponíveis (dinâmico, vem da tabela `apps`) + placements atuais deste mini app.
  const appsQ = useQuery({ queryKey: ["apps"], queryFn: fetchApps });
  const allApps = appsQ.data ?? [];
  const placementsQ = useQuery({
    queryKey: ["mini_app_placements_for", app?.id],
    enabled: !!app?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_app_placements")
        .select("id, app_id")
        .eq("mini_app_id", app!.id);
      if (error) throw error;
      return data ?? [];
    },
  });
  const [placementAppIds, setPlacementAppIds] = useState<Set<string>>(new Set());
  const [placementsLoaded, setPlacementsLoaded] = useState(false);
  useEffect(() => {
    if (!app?.id) {
      if (allApps.length && !placementsLoaded) {
        setPlacementAppIds(new Set(allApps.filter((a) => a.is_active).map((a) => a.id)));
        setPlacementsLoaded(true);
      }
      return;
    }
    if (placementsQ.data && !placementsLoaded) {
      setPlacementAppIds(new Set(placementsQ.data.map((p) => p.app_id)));
      setPlacementsLoaded(true);
    }
  }, [app?.id, allApps, placementsQ.data, placementsLoaded]);

  const toggleAppPlacement = (appId: string, checked: boolean) => {
    setPlacementAppIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(appId); else next.delete(appId);
      return next;
    });
    // Sincroniza flags legados (usados em filtros da lista de admin)
    const slug = allApps.find((a) => a.id === appId)?.slug;
    if (slug === "academico") setForm((f) => ({ ...f, track_academico: checked }));
    else if (slug === "tecnico") setForm((f) => ({ ...f, track_tecnico: checked }));
    else if (slug === "enfermeiro") setForm((f) => ({ ...f, track_enfermeiro: checked }));
    else if (slug === "obstetricia") setForm((f) => ({ ...f, track_obstetricia: checked }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    setOk(null);
    const { price_reais, price_original_reais, ...rest } = form;
    const priceOriginalCents = reaisToCents(price_original_reais);
    const payload = {
      ...rest,
      kind: (form.kind || "extra").trim(),
      description: form.description || null,
      cakto_product_id: form.cakto_product_id || null,
      cakto_checkout_url: form.cakto_checkout_url || null,
      icon: form.icon || null,
      content_md: form.content_md || null,
      video_url: form.video_url || null,
      audio_url: form.audio_url || null,
      route_path: form.route_path || null,
      horas_certificado: Number(form.horas_certificado) || null,
      price_cents: reaisToCents(price_reais),
      price_original_cents: priceOriginalCents > 0 ? priceOriginalCents : null,
    };
    const res = app
      ? await supabase.from("mini_apps").update(payload as any).eq("id", app.id).select("*").single()
      : await supabase.from("mini_apps").insert(payload as any).select("*").single();
    if (res.error) {
      setBusy(false);
      setErr(res.error.message);
      return;
    }
    const savedApp = res.data as MiniApp;

    // Sincroniza vínculos com aplicativos (mini_app_placements)
    if (savedApp?.id) {
      const { data: existing } = await supabase
        .from("mini_app_placements")
        .select("id, app_id")
        .eq("mini_app_id", savedApp.id);
      const existingIds = new Set((existing ?? []).map((p) => p.app_id));
      const toAdd = [...placementAppIds].filter((id) => !existingIds.has(id));
      const toRemove = (existing ?? []).filter((p) => !placementAppIds.has(p.app_id));
      if (toAdd.length) {
        const addRes = await supabase.from("mini_app_placements").insert(
          toAdd.map((app_id) => ({ app_id, mini_app_id: savedApp.id, ordem: 999 })) as any,
        );
        if (addRes.error) {
          setBusy(false);
          setErr(addRes.error.message);
          return;
        }
      }
      if (toRemove.length) {
        const removeRes = await supabase
          .from("mini_app_placements")
          .delete()
          .in("id", toRemove.map((p) => p.id));
        if (removeRes.error) {
          setBusy(false);
          setErr(removeRes.error.message);
          return;
        }
      }
    }

    setBusy(false);
    setOk("✅ Salvo com sucesso.");
    if (savedApp) onSaved(savedApp);
    window.setTimeout(onClose, 450);
  }

  return (
    <Card className="border-primary/40">
      <form onSubmit={handleSave} className="space-y-3 text-sm">
        <h3 className="font-display text-base font-bold">
          {app ? "Editar mini app" : "Novo mini app"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={input}
            />
          </Field>
          <Field label="Slug (url interno, sem espaço)">
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={input}
              placeholder="ex: calculo-avancado"
            />
          </Field>
        </div>
        <Field label="Descrição curta">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={input}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Tipo / categoria (livre)">
            <input
              list="kind-suggestions"
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className={input}
              placeholder="ex: basico, extra, premium, anual..."
            />
            <datalist id="kind-suggestions">
              <option value="basico" />
              <option value="extra" />
              <option value="premium" />
              <option value="anual" />
              <option value="gratuito" />
            </datalist>
          </Field>
          <Field label='Preço "POR" (R$) — ex: 19,90 ou 0,00'>
            <input
              type="text"
              inputMode="decimal"
              required
              value={form.price_reais}
              onChange={(e) => setForm({ ...form, price_reais: e.target.value })}
              className={input}
              placeholder="0,00"
            />
          </Field>
          <Field label='Preço "DE" (R$, riscado) — opcional'>
            <input
              type="text"
              inputMode="decimal"
              value={form.price_original_reais}
              onChange={(e) => setForm({ ...form, price_original_reais: e.target.value })}
              className={input}
              placeholder="vazio = sem promoção"
            />
          </Field>
          <Field label="Ícone (emoji)">
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className={input}
              placeholder="📘"
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rota interna (ex: /curativos)">
            <input
              value={form.route_path}
              onChange={(e) => setForm({ ...form, route_path: e.target.value })}
              className={input}
              placeholder="/slug-da-tela"
            />
          </Field>
          <Field label="Horas de certificado">
            <input
              type="number"
              min={0}
              step="0.5"
              value={form.horas_certificado}
              onChange={(e) => setForm({ ...form, horas_certificado: Number(e.target.value) })}
              className={input}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ID do produto na Cakto">
            <input
              value={form.cakto_product_id}
              onChange={(e) => setForm({ ...form, cakto_product_id: e.target.value })}
              className={input}
            />
          </Field>
          <Field label="Link do checkout Cakto">
            <input
              value={form.cakto_checkout_url}
              onChange={(e) => setForm({ ...form, cakto_checkout_url: e.target.value })}
              className={input}
              placeholder="https://pay.cakto.com.br/..."
            />
          </Field>
        </div>
        {isQuizzesMiniApp && (
          <QuizzesDynamicContentNotice
            routePath={form.route_path}
            onUseCorrectRoute={() => setForm({ ...form, route_path: "/quizzes" })}
          />
        )}
        <ContentMarkdownEditor
          value={form.content_md}
          onChange={(v) => setForm({ ...form, content_md: v })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="URL de vídeo (YouTube/Vimeo)">
            <input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className={input}
            />
          </Field>
          <Field label="URL de áudio">
            <input
              value={form.audio_url}
              onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
              className={input}
            />
          </Field>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Disponível nos aplicativos
          </p>
          {allApps.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum aplicativo cadastrado ainda. Crie em Admin → Aplicativos.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {allApps.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={placementAppIds.has(a.id)}
                    onChange={(e) => toggleAppPlacement(a.id, e.target.checked)}
                  />
                  <span>{a.emoji ?? "📚"} {a.name}</span>
                </label>
              ))}
            </div>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Marque em quais aplicativos este mini app deve aparecer. Novos aplicativos criados no Admin → Aplicativos aparecerão aqui automaticamente.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <span>Ativo (visível na loja)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.gratuito}
              onChange={(e) => setForm({ ...form, gratuito: e.target.checked })}
            />
            <span>Grátis</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.em_breve}
              onChange={(e) => setForm({ ...form, em_breve: e.target.checked })}
            />
            <span>Em breve</span>
          </label>
          <Field label="Ordem">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={`${input} w-20`}
            />
          </Field>
        </div>

        {err && <p className="text-xs text-destructive">{err}</p>}
        {ok && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700">{ok}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy ? "Salvando..." : ok ? "Salvo" : "Salvar"}
          </button>
        </div>
      </form>
      {app && (
        <div className="mt-4 border-t border-border pt-4">
          <SubtopicsAdmin miniAppId={app.id} />
        </div>
      )}
    </Card>
  );
}

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function QuizzesDynamicContentNotice({
  routePath,
  onUseCorrectRoute,
}: {
  routePath: string;
  onUseCorrectRoute: () => void;
}) {
  const totalQuestions = QUIZZES.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const routeOk = routePath.trim() === "/quizzes";
  const firstQuiz = QUIZZES[0];

  return (
    <div className="rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-base font-bold">Conteúdo dinâmico dos Quizzes preservado</p>
          <p className="mt-1 text-xs leading-relaxed">
            Este mini app não usa o campo “Conteúdo / Markdown” para guardar os quizzes. Clique abaixo para abrir a tela real dos quizzes ou testar um quiz individual.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/quizzes"
              className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-bold text-background transition hover:bg-amber-700"
            >
              Abrir todos os quizzes
            </Link>
            {firstQuiz && (
              <Link
                to="/quizzes/$slug"
                params={{ slug: firstQuiz.slug }}
                className="rounded-full border border-amber-300 bg-background/80 px-3 py-1.5 text-xs font-bold transition hover:border-amber-500 hover:bg-amber-100"
              >
                Testar primeiro quiz
              </Link>
            )}
            {!routeOk && (
              <button
                type="button"
                onClick={onUseCorrectRoute}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >
                Corrigir rota para /quizzes
              </button>
            )}
          </div>
        </div>
        <div className="grid min-w-[220px] grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="rounded-lg bg-background/70 px-2 py-2">
            <span className="block text-lg">{QUIZZES.length}</span>
            quizzes
          </div>
          <div className="rounded-lg bg-background/70 px-2 py-2">
            <span className="block text-lg">{totalQuestions}</span>
            perguntas
          </div>
          <div className={`rounded-lg px-2 py-2 ${routeOk ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
            <span className="block text-lg">{routeOk ? "OK" : "!"}</span>
            rota
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-background/70 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide">Primeiros quizzes encontrados</p>
        <div className="flex flex-wrap gap-2">
          {QUIZZES.slice(0, 8).map((quiz) => (
            <Link
              key={quiz.slug}
              to="/quizzes/$slug"
              params={{ slug: quiz.slug }}
              className="rounded-full border border-amber-200 bg-amber-100/70 px-2.5 py-1 text-xs font-semibold transition hover:border-amber-500 hover:bg-amber-200"
            >
              {quiz.title}
            </Link>
          ))}
        </div>
        {!routeOk && (
          <p className="mt-3 text-xs font-bold text-red-700">
            Ajuste a rota interna para <code>/quizzes</code> para abrir a tela dinâmica correta.
          </p>
        )}
      </div>
    </div>
  );
}

function ContentMarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  return (
    <div className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Conteúdo (texto / markdown)
        </span>
        <div className="flex gap-1 rounded-lg bg-foreground/5 p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`rounded-md px-2 py-1 ${mode === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`rounded-md px-2 py-1 ${mode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Pré-visualizar
          </button>
        </div>
      </div>
      {mode === "edit" ? (
        <>
          <textarea
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${input} font-mono text-xs`}
            placeholder={`Você pode colar HTML (do Word, Google Docs ou site) OU escrever em markdown.\n\nExemplo markdown:\n\n# Título\n\nParágrafo com **negrito** e *itálico*.\n\n- Item 1\n- Item 2\n\n> ⚠️ Atenção: nunca administre sem checar os cinco certos.`}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            <strong>Aceita HTML colado</strong> (do Word, Google Docs, sites) — as tags são sanitizadas e renderizadas.
            Ou use markdown: <code>#</code> títulos, <code>**negrito**</code>, <code>*itálico*</code>,
            listas <code>-</code> e <code>1.</code>, links <code>[txt](url)</code> e destaques{" "}
            <code>&gt; ⚠️</code>, <code>&gt; ✅</code>, <code>&gt; 📌</code>.
          </p>
        </>
      ) : (
        <div className="min-h-[200px] rounded-lg border border-border bg-background px-3 py-2">
          {value.trim() ? (
            <MiniAppHtmlContent html={value} />
          ) : (
            <p className="text-xs text-muted-foreground">
              Nada digitado ainda. Vá em "Editar" e comece a escrever.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
