import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { fetchMiniApps, formatPriceBRL, isAdmin, type MiniApp } from "@/lib/access";
import { renderMarkdown } from "@/lib/markdown";
import { SubscriptionsAdmin } from "@/components/admin/SubscriptionsAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Academia de Enfermagem" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    isAdmin().then((ok) => {
      setAllowed(ok);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Verificando permissão...</p>
      </AppShell>
    );
  }

  if (!allowed) {
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
  const [tab, setTab] = useState<"apps" | "subs">("apps");
  const [editing, setEditing] = useState<MiniApp | null>(null);
  const [creating, setCreating] = useState(false);

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
    <AppShell>
      <PageHeader
        eyebrow="Admin"
        title="Academia de Enfermagem"
        description="Gerencie mini apps, trilhas e assinaturas mensais da loja."
      />

      <div className="mb-4 flex gap-2 rounded-xl bg-foreground/5 p-1 text-sm font-semibold">
        <button
          onClick={() => setTab("apps")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "apps" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Mini apps
        </button>
        <button
          onClick={() => setTab("subs")}
          className={`flex-1 rounded-lg px-3 py-2 ${tab === "subs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Assinaturas (trilhas)
        </button>
      </div>

      {tab === "subs" ? (
        <SubscriptionsAdmin />
      ) : (
        <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl gold-gradient px-4 py-2 text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Novo mini app
        </button>
      </div>

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
          }}
        />
      )}

      <div className="mt-4 space-y-3">
        {appsQ.data?.map((app) => (
          <Card key={app.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
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
                  <strong>{formatPriceBRL(app.price_cents)}</strong> · slug: {app.slug} · Cakto:{" "}
                  {app.cakto_product_id || "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setEditing(app)}
                  className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                  aria-label="Apagar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {appsQ.data?.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">
              Nenhum mini app cadastrado. Clique em "Novo mini app" pra começar.
            </p>
          </Card>
        )}
      </div>
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
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
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
    setBusy(false);
    if (res.error) {
      setErr(res.error.message);
      return;
    }
    if (res.data) onSaved(res.data as MiniApp);
    onClose();
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
            Disponível nas trilhas
          </p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.track_academico}
                onChange={(e) => setForm({ ...form, track_academico: e.target.checked })}
              />
              <span>🎓 Acadêmico</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.track_tecnico}
                onChange={(e) => setForm({ ...form, track_tecnico: e.target.checked })}
              />
              <span>🩺 Técnico</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.track_enfermeiro}
                onChange={(e) => setForm({ ...form, track_enfermeiro: e.target.checked })}
              />
              <span>👩‍⚕️ Enfermeiro</span>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Quem assinar uma trilha libera todos os mini apps marcados nela.
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
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
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
            rows={10}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${input} font-mono text-xs`}
            placeholder={`# Título\n\nParágrafo com **negrito** e *itálico*.\n\n- Item 1\n- Item 2\n\n> ⚠️ Atenção: nunca administre sem checar os cinco certos.\n> ✅ Dica: confira sempre a prescrição.\n> 📌 Importante: registre no prontuário.\n\n[Link externo](https://exemplo.com)`}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Suporta <code>#</code> títulos, <code>**negrito**</code>, <code>*itálico*</code>,
            listas <code>-</code> e <code>1.</code>, links <code>[txt](url)</code> e blocos de destaque iniciados com{" "}
            <code>&gt; ⚠️</code>, <code>&gt; ✅</code> ou <code>&gt; 📌</code>.
          </p>
        </>
      ) : (
        <div className="min-h-[200px] rounded-lg border border-border bg-background px-3 py-2">
          {value.trim() ? (
            renderMarkdown(value)
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
