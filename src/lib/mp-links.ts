import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fonte ÚNICA dos links de pagamento (Mercado Pago).
 * Os links ficam em `plan_offers.cakto_checkout_url` (nome legado da coluna,
 * o conteúdo é sempre um link do Mercado Pago — mpago.la).
 * Nunca usar `subscription_plans.cakto_checkout_url` (Cakto, desativado).
 */
export type BillingPeriod = "mensal" | "trimestral" | "semestral" | "anual";

export type MpOffer = {
  plan_slug: string;
  billing_period: BillingPeriod;
  price_cents: number;
  period_days: number;
  url: string | null;
};

export async function fetchMpOffers(planSlug: string): Promise<MpOffer[]> {
  const { data, error } = await supabase
    .from("plan_offers")
    .select("plan_slug, billing_period, price_cents, period_days, cakto_checkout_url")
    .eq("plan_slug", planSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((o: any) => ({
    plan_slug: o.plan_slug,
    billing_period: o.billing_period as BillingPeriod,
    price_cents: o.price_cents,
    period_days: o.period_days,
    url: isMercadoPagoUrl(o.cakto_checkout_url) ? o.cakto_checkout_url : null,
  }));
}

export function isMercadoPagoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /^https?:\/\/(www\.)?(mpago\.la|mercadopago\.com|link\.mercadopago\.com)/i.test(url);
}

export function resolveMpLink(
  offers: MpOffer[] | undefined,
  period: BillingPeriod = "mensal",
): string | null {
  return offers?.find((o) => o.billing_period === period)?.url ?? null;
}

/** Hook: link do Mercado Pago do app + período. Nunca cai em link da Cakto. */
export function useMpLink(planSlug: string | null | undefined, period: BillingPeriod = "mensal") {
  const q = useQuery({
    queryKey: ["mp_offers", planSlug],
    queryFn: () => fetchMpOffers(planSlug!),
    enabled: !!planSlug,
    staleTime: 5 * 60 * 1000,
  });
  return { url: resolveMpLink(q.data, period), offers: q.data ?? [], isLoading: q.isLoading };
}
