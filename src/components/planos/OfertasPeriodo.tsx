import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Offer = {
  id: string;
  plan_slug: string;
  billing_period: "mensal" | "semestral" | "anual";
  period_days: number;
  price_cents: number;
  cakto_checkout_url: string | null;
  perks: string[];
  certificates_included: number;
  report_quota: number;
  bonus_app_included: boolean;
  sort_order: number;
};

const LABELS: Record<Offer["billing_period"], { title: string; tag?: string; months: number }> = {
  mensal: { title: "Mensal", months: 1 },
  semestral: { title: "Semestral", tag: "Mais benefícios", months: 6 },
  anual: { title: "Anual", tag: "Melhor pacote", months: 12 },
};

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function fetchOffers(slug: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("plan_offers")
    .select(
      "id, plan_slug, billing_period, period_days, price_cents, cakto_checkout_url, perks, certificates_included, report_quota, bonus_app_included, sort_order",
    )
    .eq("plan_slug", slug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Offer[];
}

export default function OfertasPeriodo({
  slug,
  isLoggedIn,
  subscribed,
}: {
  slug: string;
  isLoggedIn: boolean;
  subscribed: boolean;
}) {
  const offersQ = useQuery({ queryKey: ["plan_offers", slug], queryFn: () => fetchOffers(slug) });
  const offers = offersQ.data ?? [];

  if (offers.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-extrabold">💳 Escolha o seu plano</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        O valor mensal é o mesmo em todos os planos — nos planos maiores você ganha benefícios extras.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {offers.map((o) => {
          const meta = LABELS[o.billing_period];
          const destaque = o.billing_period === "anual";
          const perks = Array.isArray(o.perks) ? o.perks : [];
          return (
            <div
              key={o.id}
              className={`relative flex flex-col rounded-3xl border bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md ${
                destaque ? "border-primary/50 ring-2 ring-primary/25" : "border-white/60"
              }`}
            >
              {meta.tag && (
                <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground shadow">
                  {meta.tag}
                </span>
              )}

              <h3 className="font-display text-lg font-extrabold">{meta.title}</h3>
              <p className="mt-1 text-2xl font-extrabold text-primary">{brl(o.price_cents)}</p>
              <p className="text-xs font-semibold text-muted-foreground">
                {meta.months === 1
                  ? "por mês"
                  : `à vista ou parcelado · equivale a ${brl(Math.round(o.price_cents / meta.months))}/mês`}
              </p>

              <ul className="mt-4 flex-1 space-y-2">
                {perks.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-snug">
                    <span className="text-primary">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {subscribed ? (
                  <span className="block rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs font-extrabold text-emerald-800">
                    Você já tem acesso ativo
                  </span>
                ) : o.cakto_checkout_url ? (
                  <a
                    href={o.cakto_checkout_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow transition hover:opacity-90"
                  >
                    Assinar {meta.title.toLowerCase()} <ExternalLink className="h-4 w-4" />
                  </a>
                ) : isLoggedIn ? (
                  <span className="block rounded-xl border border-dashed border-primary/40 px-4 py-3 text-center text-xs font-bold text-muted-foreground">
                    Checkout em configuração — disponível em breve
                  </span>
                ) : (
                  <a
                    href={`/cadastro/${slug}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-primary/40 bg-white px-4 py-3 text-sm font-extrabold transition hover:bg-primary/5"
                  >
                    <Sparkles className="h-4 w-4" /> Criar minha conta
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Certificados digitais de 10h são emitidos dentro do app, no mini app que você escolher. O 2º aplicativo do
        plano anual é escolhido em <strong>Minha Conta</strong> após a ativação.
      </p>
    </section>
  );
}
