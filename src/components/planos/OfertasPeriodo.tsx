import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Sparkles, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

type Period = "mensal" | "trimestral" | "semestral" | "anual";

type Offer = {
  id: string;
  plan_slug: string;
  billing_period: Period;
  period_days: number;
  price_cents: number;
  cakto_checkout_url: string | null;
  perks: string[];
  certificates_included: number;
  report_quota: number;
  bonus_app_included: boolean;
  sort_order: number;
};

const META: Record<Period, { title: string; short: string; months: number }> = {
  mensal: { title: "Mensal", short: "Mensal", months: 1 },
  trimestral: { title: "Trimestral", short: "3 meses", months: 3 },
  semestral: { title: "Semestral", short: "6 meses", months: 6 },
  anual: { title: "Anual", short: "12 meses", months: 12 },
};

const ORDER: Period[] = ["mensal", "trimestral", "semestral", "anual"];

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
  const offers = useMemo(
    () =>
      (offersQ.data ?? [])
        .slice()
        .sort((a, b) => ORDER.indexOf(a.billing_period) - ORDER.indexOf(b.billing_period)),
    [offersQ.data],
  );

  const monthly = offers.find((o) => o.billing_period === "mensal");
  const defaultPeriod: Period =
    offers.find((o) => o.billing_period === "anual")?.billing_period ??
    offers[0]?.billing_period ??
    "mensal";
  const [period, setPeriod] = useState<Period | null>(null);
  const selected = offers.find((o) => o.billing_period === (period ?? defaultPeriod)) ?? offers[0];

  if (offers.length === 0 || !selected) return null;

  const meta = META[selected.billing_period];
  const perMonth = Math.round(selected.price_cents / meta.months);
  const baseMonthly = monthly?.price_cents ?? perMonth;
  const savings = Math.max(baseMonthly * meta.months - selected.price_cents, 0);

  const perks = Array.isArray(selected.perks) ? selected.perks : [];
  const checkoutUrl = selected.cakto_checkout_url ?? "";

  function discountFor(o: Offer) {
    const m = META[o.billing_period].months;
    if (!monthly || m === 1) return 0;
    const full = monthly.price_cents * m;
    if (full <= 0) return 0;
    return Math.round(((full - o.price_cents) / full) * 100);
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-extrabold">💳 Escolha o seu plano</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Um único acesso completo. Escolha por quanto tempo quer garantir — quanto maior o período, mais benefícios.
      </p>

      {/* Seletor de período */}
      <div className="mt-4 inline-flex w-full flex-wrap gap-1 rounded-2xl border border-white/60 bg-white/70 p-1 shadow-sm backdrop-blur sm:w-auto">
        {offers.map((o) => {
          const active = o.billing_period === selected.billing_period;
          const off = discountFor(o);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setPeriod(o.billing_period)}
              aria-pressed={active}
              className={`relative flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-extrabold transition sm:flex-none sm:text-sm ${
                active
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {META[o.billing_period].title}
              {off > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                    active ? "bg-white/25" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  -{off}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Painel único de preço */}
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-primary/30 bg-white/85 p-6 shadow-md ring-1 ring-primary/10 backdrop-blur">
        {selected.billing_period === "anual" && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground shadow">
            ⭐ Mais escolhido
          </span>
        )}

        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Plano {meta.title} · {meta.short}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <span key={selected.id} className="font-display text-4xl font-black text-primary duration-300 animate-in fade-in slide-in-from-bottom-1">
            {brl(perMonth)}
          </span>
          <span className="pb-1.5 text-sm font-bold text-muted-foreground">/mês</span>
        </div>

        <p className="mt-1 text-sm font-semibold">
          {meta.months === 1 ? (
            <>Cobrança mensal de {brl(selected.price_cents)}</>
          ) : (
            <>
              Pagamento único de <strong>{brl(selected.price_cents)}</strong> (ou parcelado)
              {savings > 0 && (
                <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                  economize {brl(savings)}
                </span>
              )}
            </>
          )}
        </p>

        {perks.length > 0 && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {perks.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm leading-snug">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          {subscribed ? (
            <span className="block rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-extrabold text-emerald-800">
              Você já tem acesso ativo
            </span>
          ) : isLoggedIn ? (
            checkoutUrl ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.99]"
              >
                Assinar {meta.title.toLowerCase()} <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <Link
                to="/checkout"
                search={{ plan: slug }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.99]"
              >
                Assinar {meta.title.toLowerCase()}
              </Link>
            )
          ) : (
            <a
              href={`/cadastro/${slug}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-primary/40 bg-white px-4 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-primary/5"
            >
              <Sparkles className="h-4 w-4" /> Criar minha conta
            </a>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold text-muted-foreground">
          Pagamento seguro pelo Mercado Pago · Pix, cartão ou boleto
        </p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Certificados digitais de 10h são emitidos dentro do app, no <strong>Conteúdo Técnico</strong> que você escolher.
        O 2º aplicativo do plano anual é ativado diretamente através da sua área de <strong>Minha Conta</strong>.
      </p>
    </section>
  );
}
