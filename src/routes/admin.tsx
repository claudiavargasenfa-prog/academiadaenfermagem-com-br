import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { fetchMiniApps, formatPriceBRL, isAdmin, type MiniApp } from "@/lib/access";

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
        title="Catálogo de mini apps"
        description="Cadastre, edite e remova os mini apps da sua loja premium."
      />

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
          app={editing}
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
    </AppShell>
  );
}

function MiniAppForm({ app, onClose }: { app: MiniApp | null; onClose: () => void }) {
  const [form, setForm] = useState({
    slug: app?.slug ?? "",
    name: app?.name ?? "",
    description: app?.description ?? "",
    kind: (app?.kind as string) ?? "extra",
    price_cents: app?.price_cents ?? 0,
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
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const payload = {
      ...form,
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
    };
    const res = app
      ? await supabase.from("mini_apps").update(payload as any).eq("id", app.id)
      : await supabase.from("mini_apps").insert(payload as any);
    setBusy(false);
    if (res.error) {
      setErr(res.error.message);
      return;
    }
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
          <Field label="Preço (centavos) — ex: 1990 = R$19,90">
            <input
              type="number"
              min={0}
              required
              value={form.price_cents}
              onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })}
              className={input}
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
        <Field label="Conteúdo (texto / markdown)">
          <textarea
            rows={4}
            value={form.content_md}
            onChange={(e) => setForm({ ...form, content_md: e.target.value })}
            className={input}
          />
        </Field>
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
        <div className="flex items-center gap-4">
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
