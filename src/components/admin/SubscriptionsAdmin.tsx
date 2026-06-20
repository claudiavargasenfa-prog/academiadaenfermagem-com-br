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
      <section>
        <h3 className="mb-3 font-display text-base font-bold">Planos das trilhas</h3>
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
                  <p className="mt-2 text-lg font-extrabold">{formatPriceBRL(p.price_cents)}<span className="text-xs font-normal text-muted-foreground">/mês</span></p>
                  <p className="mt-1 break-all text-[11px] text-muted-foreground">
                    Cakto: {p.cakto_checkout_url || "—"}
                  </p>
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

function PlanForm({ plan, onClose }: { plan: SubscriptionPlan; onClose: () => void }) {
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description ?? "",
    price_reais: centsToReais(plan.price_cents),
    cakto_checkout_url: plan.cakto_checkout_url ?? "",
    is_active: plan.is_active,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await supabase
      .from("subscription_plans")
      .update({
        name: form.name,
        description: form.description || null,
        price_cents: reaisToCents(form.price_reais),
        cakto_checkout_url: form.cakto_checkout_url || null,
        is_active: form.is_active,
      })
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Preço mensal (R$)</span>
            <input className={input} value={form.price_reais} onChange={(e) => setForm({ ...form, price_reais: e.target.value })} placeholder="29,00" /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Link checkout Cakto</span>
            <input className={input} value={form.cakto_checkout_url} onChange={(e) => setForm({ ...form, cakto_checkout_url: e.target.value })} placeholder="https://pay.cakto.com.br/..." /></label>
        </div>
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

function GrantForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ user_id: "", plan_slug: "academico", days: 30, notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const expires = new Date(Date.now() + form.days * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: form.user_id.trim(),
      plan_slug: form.plan_slug,
      status: "active",
      expires_at: expires,
      notes: form.notes || null,
    } as any);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onClose();
  }

  return (
    <Card className="border-primary/40">
      <form onSubmit={save} className="space-y-3 text-sm">
        <h4 className="font-display text-base font-bold">Liberar assinatura manualmente</h4>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">User ID (uuid)</span>
          <input className={input} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required placeholder="ex: 11111111-2222-3333-4444-555555555555" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Trilha</span>
            <select className={input} value={form.plan_slug} onChange={(e) => setForm({ ...form, plan_slug: e.target.value })}>
              <option value="academico">Acadêmico</option>
              <option value="tecnico">Técnico</option>
              <option value="enfermeiro">Enfermeiro</option>
            </select></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Dias de acesso</span>
            <input type="number" min={1} className={input} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} /></label>
        </div>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Observação</span>
          <input className={input} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">{busy ? "Salvando…" : "Liberar"}</button>
        </div>
      </form>
    </Card>
  );
}
