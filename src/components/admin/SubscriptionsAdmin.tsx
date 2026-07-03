import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, UserPlus, Trash2 } from "lucide-react";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchSubscriptionPlans,
  formatPriceBRL,
  type SubscriptionPlan,
  type UserSubscription,
} from "@/lib/access";

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

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

export function SubscriptionsAdmin() {
  const qc = useQueryClient();
  const plansQ = useQuery({ queryKey: ["admin_plans"], queryFn: fetchSubscriptionPlans });
  const subsQ = useQuery({
    queryKey: ["admin_user_subs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .order("expires_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as UserSubscription[];
    },
  });
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [granting, setGranting] = useState(false);

  return (
    <div className="space-y-6">
      <LojaSortModeToggle />
      <section>
        <h3 className="mb-3 font-display text-base font-bold">Aplicativos (Planos)</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {plansQ.data?.map((p) => (

            <Card key={p.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {p.slug}
                  </p>
                  <h4 className="font-display text-base font-bold">{p.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  <p className="mt-2 text-lg font-extrabold">{formatPriceBRL((p as any).price_novo_cents ?? p.price_cents)}<span className="text-xs font-normal text-muted-foreground">/mês</span></p>
                  {(p as any).price_promo_migracao_cents && (
                    <p className="mt-0.5 text-[11px] font-semibold text-amber-700">
                      Migre para outro app e ganhe 15%: <span className="line-through">{formatPriceBRL((p as any).price_original_migracao_cents)}</span> {formatPriceBRL((p as any).price_promo_migracao_cents)}
                    </p>
                  )}
                  <p className="mt-1 break-all text-[11px] text-muted-foreground">
                    Link Cakto: {(p as any).cakto_link_novo || p.cakto_checkout_url || <span className="font-bold text-destructive">— falta preencher!</span>}
                  </p>
                  {(p as any).cakto_link_migracao && (
                    <p className="break-all text-[11px] text-muted-foreground">Link migração: {(p as any).cakto_link_migracao}</p>
                  )}
                  {!p.is_active && (
                    <span className="mt-1 inline-block rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold">inativo</span>
                  )}
                </div>
                <button
                  onClick={() => setEditingPlan(p)}
                  className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                  aria-label="Editar plano"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
        {editingPlan && (
          <div className="mt-3">
            <PlanForm
              plan={editingPlan}
              onClose={() => {
                setEditingPlan(null);
                qc.invalidateQueries({ queryKey: ["admin_plans"] });
                qc.invalidateQueries({ queryKey: ["subscription_plans"] });
              }}
            />
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-bold">Assinaturas dos alunos</h3>
          <button
            onClick={() => setGranting(true)}
            className="inline-flex items-center gap-1.5 rounded-xl gold-gradient px-3 py-1.5 text-xs font-bold"
          >
            <UserPlus className="h-3.5 w-3.5" /> Liberar manualmente
          </button>
        </div>
        {granting && (
          <GrantForm
            onClose={() => {
              setGranting(false);
              qc.invalidateQueries({ queryKey: ["admin_user_subs"] });
            }}
          />
        )}
        <div className="mt-3 space-y-2">
          {subsQ.data?.length === 0 && (
            <Card><p className="text-sm text-muted-foreground">Nenhuma assinatura ainda.</p></Card>
          )}
          {subsQ.data?.map((s) => {
            const active = s.status === "active" && new Date(s.expires_at) > new Date();
            return (
              <Card key={s.id}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 text-xs">
                    <p className="font-semibold">{s.plan_slug.toUpperCase()} · <span className="font-mono text-[10px]">{s.user_id.slice(0, 8)}…</span></p>
                    <p className="text-muted-foreground">
                      até {new Date(s.expires_at).toLocaleDateString("pt-BR")} · {active ? "ativa" : "expirada"}
                    </p>
                    {s.notes && <p className="text-muted-foreground">{s.notes}</p>}
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm("Revogar esta assinatura?")) return;
                      await supabase.from("user_subscriptions").delete().eq("id", s.id);
                      qc.invalidateQueries({ queryKey: ["admin_user_subs"] });
                    }}
                    className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                    aria-label="Revogar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LojaSortModeToggle() {
  const qc = useQueryClient();
  const { data: texts } = useQuery({
    queryKey: ["app_texts"],
    queryFn: async () => {
      const { data } = await supabase.from("app_texts").select("key,value");
      const out: Record<string, string> = {};
      for (const r of (data ?? []) as any[]) out[r.key] = r.value;
      return out;
    },
  });
  const current = (texts?.["ordenacao.loja"] ?? "numeric") as "numeric" | "alpha";
  async function setMode(mode: "numeric" | "alpha") {
    await supabase.from("app_texts").upsert(
      { key: "ordenacao.loja", value: mode, description: "Modo de ordenação dos aplicativos na loja" },
      { onConflict: "key" },
    );
    qc.invalidateQueries({ queryKey: ["app_texts"] });
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
      <span className="font-semibold">Ordem dos aplicativos na loja:</span>
      <button
        type="button"
        onClick={() => setMode("numeric")}
        className={`rounded-lg px-3 py-1 text-xs font-bold ${current === "numeric" ? "bg-primary text-primary-foreground" : "bg-background"}`}
      >
        🔢 Numérica
      </button>
      <button
        type="button"
        onClick={() => setMode("alpha")}
        className={`rounded-lg px-3 py-1 text-xs font-bold ${current === "alpha" ? "bg-primary text-primary-foreground" : "bg-background"}`}
      >
        🔤 Alfabética (A→Z)
      </button>
      <span className="text-[11px] text-muted-foreground">
        {current === "numeric" ? "Menor número aparece primeiro (edite no lápis)." : "Ignora números; ordena pelo nome."}
      </span>
    </div>
  );
}

function PlanForm({ plan, onClose }: { plan: SubscriptionPlan; onClose: () => void }) {
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description ?? "",
    price_novo: centsToReais((plan as any).price_novo_cents ?? plan.price_cents),
    price_original_migracao: centsToReais((plan as any).price_original_migracao_cents),
    price_promo_migracao: centsToReais((plan as any).price_promo_migracao_cents),
    cakto_link_novo: (plan as any).cakto_link_novo ?? plan.cakto_checkout_url ?? "",
    cakto_link_migracao: (plan as any).cakto_link_migracao ?? "",
    is_active: plan.is_active,
    sort_order: (plan as any).sort_order ?? 0,
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const novoCents = reaisToCents(form.price_novo);
    const origMig = reaisToCents(form.price_original_migracao);
    const promoMig = reaisToCents(form.price_promo_migracao);
    const { error } = await supabase
      .from("subscription_plans")
      .update({
        name: form.name,
        description: form.description || null,
        price_cents: novoCents,
        price_novo_cents: novoCents,
        price_original_migracao_cents: origMig > 0 ? origMig : null,
        price_promo_migracao_cents: promoMig > 0 ? promoMig : null,
        cakto_checkout_url: form.cakto_link_novo || null,
        cakto_link_novo: form.cakto_link_novo || null,
        cakto_link_migracao: form.cakto_link_migracao || null,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      } as any)
      .eq("id", plan.id);

    setBusy(false);
    if (error) { setErr(error.message); return; }
    onClose();
  }

  return (
    <Card className="border-primary/40">
      <form onSubmit={save} className="space-y-3 text-sm">
        <h4 className="font-display text-base font-bold">Editar plano: {plan.slug}</h4>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Nome</span>
          <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Descrição</span>
          <textarea className={input} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>

        <fieldset className="rounded-xl border border-border/60 p-3">
          <legend className="px-1 text-[10px] font-bold uppercase text-muted-foreground">Cadastro novo</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Preço mensal (R$)</span>
              <input className={input} value={form.price_novo} onChange={(e) => setForm({ ...form, price_novo: e.target.value })} placeholder="24,99" /></label>
            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Link Cakto (novo)</span>
              <input className={input} value={form.cakto_link_novo} onChange={(e) => setForm({ ...form, cakto_link_novo: e.target.value })} placeholder="https://pay.cakto.com.br/..." /></label>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-amber-400/40 bg-amber-50/40 p-3">
          <legend className="px-1 text-[10px] font-bold uppercase text-amber-700">Migre p/ outro app (15% por 3 meses)</legend>
          <p className="mb-2 text-[10px] text-muted-foreground">Mostrado automaticamente quando o aluno logado já tem outro aplicativo ativo.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">DE (R$)</span>
              <input className={input} value={form.price_original_migracao} onChange={(e) => setForm({ ...form, price_original_migracao: e.target.value })} placeholder="39,99" /></label>
            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">POR (R$)</span>
              <input className={input} value={form.price_promo_migracao} onChange={(e) => setForm({ ...form, price_promo_migracao: e.target.value })} placeholder="33,99" /></label>
            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Link Cakto (migração)</span>
              <input className={input} value={form.cakto_link_migracao} onChange={(e) => setForm({ ...form, cakto_link_migracao: e.target.value })} placeholder="https://pay.cakto.com.br/..." /></label>
          </div>
        </fieldset>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <span>Ativo (visível na loja)</span>
        </label>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">{busy ? "Salvando…" : "Salvar"}</button>
        </div>
      </form>
    </Card>
  );
}

const ALL_PLANS = [
  { slug: "academico", label: "Acadêmico" },
  { slug: "tecnico", label: "Técnico" },
  { slug: "enfermeiro", label: "Enfermeiro" },
] as const;

function GrantForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    email: "",
    plans: { academico: true, tecnico: false, enfermeiro: false } as Record<string, boolean>,
    days: 30,
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function togglePlan(slug: string) {
    setForm((f) => ({ ...f, plans: { ...f.plans, [slug]: !f.plans[slug] } }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setOk(null);
    const selected = ALL_PLANS.filter((p) => form.plans[p.slug]).map((p) => p.slug);
    if (selected.length === 0) {
      setBusy(false);
      setErr("Selecione pelo menos 1 aplicativo.");
      return;
    }
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setBusy(false);
      setErr("Informe o e-mail do aluno.");
      return;
    }
    // Lookup user by email in profiles
    const { data: prof, error: pErr } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .ilike("email", email)
      .maybeSingle();
    if (pErr) { setBusy(false); setErr("Erro buscando aluno: " + pErr.message); return; }
    if (!prof) {
      setBusy(false);
      setErr("Nenhum aluno encontrado com esse e-mail. O aluno precisa ter feito cadastro antes.");
      return;
    }
    const expires = new Date(Date.now() + form.days * 24 * 60 * 60 * 1000).toISOString();
    const rows = selected.map((plan_slug) => ({
      user_id: (prof as any).id,
      plan_slug,
      status: "active",
      started_at: new Date().toISOString(),
      expires_at: expires,
      notes: form.notes || null,
    }));
    const { error } = await supabase.from("user_subscriptions").insert(rows as any);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setOk(`✅ Liberado ${selected.length} aplicativo(s) para ${(prof as any).full_name || email}.`);
    setTimeout(onClose, 1200);
  }

  return (
    <Card className="border-primary/40">
      <form onSubmit={save} className="space-y-3 text-sm">
        <h4 className="font-display text-base font-bold">Liberar acesso manualmente</h4>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">E-mail do aluno</span>
          <input
            type="email"
            className={input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="aluno@exemplo.com"
          />
        </label>
        <fieldset className="rounded-xl border border-border/60 p-3">
          <legend className="px-1 text-[10px] font-bold uppercase text-muted-foreground">
            Aplicativos (marque 1, 2 ou 3)
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {ALL_PLANS.map((p) => (
              <label
                key={p.slug}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${
                  form.plans[p.slug]
                    ? "border-primary bg-primary/10 font-bold text-primary"
                    : "border-border bg-background"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!form.plans[p.slug]}
                  onChange={() => togglePlan(p.slug)}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Dias de acesso</span>
            <input
              type="number"
              min={1}
              className={input}
              value={form.days}
              onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Observação</span>
            <input
              className={input}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="ex: cortesia, parceria…"
            />
          </label>
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        {ok && <p className="text-xs font-semibold text-emerald-700">{ok}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">{busy ? "Salvando…" : "Liberar acesso"}</button>
        </div>
      </form>
    </Card>
  );
}
