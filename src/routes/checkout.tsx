import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, CreditCard, ExternalLink, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatPriceBRL } from "@/lib/access";

type Period = "mensal" | "trimestral" | "semestral" | "anual";

const PERIOD_LABEL: Record<Period, string> = {
  mensal: "Mensal (30 dias)",
  trimestral: "Trimestral (3 meses)",
  semestral: "Semestral (6 meses)",
  anual: "Anual (12 meses)",
};

const ORDER: Period[] = ["mensal", "trimestral", "semestral", "anual"];

type Offer = {
  id: string;
  plan_slug: string;
  billing_period: Period;
  price_cents: number;
  period_days: number;
  cakto_checkout_url: string | null;
};

// Alguns links antigos usam slugs de variação (ex.: "academico-anual").
// Aqui traduzimos para trilha + período.
function resolvePlan(rawPlan: string, rawPeriod?: string) {
  const known = ["academico", "tecnico-estudante", "tecnico", "enfermeiro"];
  const base = known.find((k) => rawPlan === k || rawPlan.startsWith(`${k}-`)) ?? "academico";
  const rest = rawPlan.slice(base.length).replace(/^-/, "").replace(/-v\d+$/, "");
  const fromSlug = ORDER.find((p) => p === rest);
  const period = (ORDER.find((p) => p === rawPeriod) ?? fromSlug ?? "mensal") as Period;
  return { base, period };
}

async function fetchOffers(slug: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("plan_offers")
    .select("id, plan_slug, billing_period, price_cents, period_days, cakto_checkout_url")
    .eq("plan_slug", slug)
    .eq("is_active", true);
  if (error) throw error;
  return (data ?? []) as unknown as Offer[];
}

export const Route = createFileRoute("/checkout")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { plan?: string; period?: string; status?: string } => {
    const out: { plan?: string; period?: string; status?: string } = {};
    if (typeof search["plan"] === "string") out.plan = search["plan"];
    if (typeof search["period"] === "string") out.period = search["period"];
    if (typeof search["status"] === "string") out.status = search["status"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Finalizar assinatura — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Conclua a assinatura da sua trilha da Academia da Enfermagem com pagamento seguro no Mercado Pago (PIX ou cartão).",
      },
      { property: "og:title", content: "Finalizar assinatura — Academia da Enfermagem" },
      {
        property: "og:description",
        content: "Pagamento seguro no Mercado Pago. Acesso liberado logo após a confirmação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { base, period } = resolvePlan(search.plan ?? "academico", search.period);
  const returned = search.status === "retorno";

  const [sending, setSending] = useState(false);

  const offersQ = useQuery({ queryKey: ["plan_offers", base], queryFn: () => fetchOffers(base) });
  const offer = useMemo(
    () => (offersQ.data ?? []).find((o) => o.billing_period === period) ?? null,
    [offersQ.data, period],
  );

  const [orderId, setOrderId] = useState<string | null>(null);

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    enabled: !!orderId,
    refetchInterval: (query) => ((query.state.data as any)?.status === "paid" ? false : 5000),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (order?.status === "paid") {
      toast.success("Pagamento confirmado! Acesso liberado.");
      const t = setTimeout(() => navigate({ to: "/trilha/$slug", params: { slug: base } }), 2500);
      return () => clearTimeout(t);
    }
    return;
  }, [order?.status, navigate, base]);

  async function irParaPagamento() {
    if (!offer?.cakto_checkout_url) {
      toast.error("Este período ainda está sem link de pagamento. Fale com a gente pelo suporte.");
      return;
    }
    setSending(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (user) {
        const { data: created } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            plan_slug: base,
            amount_cents: offer.price_cents,
            payment_method: "mercadopago",
            status: "pending",
            metadata: {
              billing_period: offer.billing_period,
              period_days: offer.period_days,
              email: user.email,
              checkout_url: offer.cakto_checkout_url,
            },
          })
          .select("id")
          .single();
        if (created?.id) setOrderId(created.id);
      }
      window.location.href = offer.cakto_checkout_url;
    } catch {
      window.location.href = offer.cakto_checkout_url;
    } finally {
      setSending(false);
    }
  }

  if (offersQ.isLoading) {
    return (
      <AppShell publicRoute>
        <div className="flex h-[60vh] flex-col items-center justify-center p-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando o seu plano...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideReferences publicRoute>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <div className="grid gap-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Finalizar Assinatura</h1>
            <p className="text-muted-foreground">
              Plano <strong className="capitalize">{base.replace("-", " ")}</strong> — {PERIOD_LABEL[period]}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_250px]">
            <div className="space-y-6">
              {order?.status === "paid" ? (
                <Card className="border-2 border-emerald-500/30 shadow-2xl">
                  <CardHeader className="text-center">
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="rounded-full bg-emerald-100 p-4">
                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-emerald-700">Pagamento confirmado!</CardTitle>
                        <CardDescription>Seu acesso foi liberado. Já vamos te levar para lá...</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ) : (
                <Card className="border-2 border-primary/10 shadow-xl">
                  <CardHeader>
                    <CardTitle>Pagamento seguro no Mercado Pago</CardTitle>
                    <CardDescription>
                      Você escolhe PIX ou cartão (com parcelamento) direto na tela do Mercado Pago.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                        <QrCode className="h-6 w-6 shrink-0" />
                        <div>
                          <p className="text-sm font-black">PIX</p>
                          <p className="text-xs">Liberação em minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-sky-900">
                        <CreditCard className="h-6 w-6 shrink-0" />
                        <div>
                          <p className="text-sm font-black">Cartão</p>
                          <p className="text-xs">Com opção de parcelar</p>
                        </div>
                      </div>
                    </div>

                    {returned && (
                      <div className="rounded-2xl bg-amber-50 p-4 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
                        Recebemos o seu retorno do Mercado Pago. Assim que o pagamento for confirmado, o acesso
                        é liberado automaticamente — pode levar alguns minutos no cartão.
                      </div>
                    )}

                    <Button
                      className="w-full py-7 text-base font-black"
                      onClick={irParaPagamento}
                      disabled={sending || !offer?.cakto_checkout_url}
                    >
                      {sending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Pagar no Mercado Pago (PIX ou cartão)
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {!offer?.cakto_checkout_url && (
                      <p className="text-center text-xs font-bold text-destructive">
                        Este período está sem link de pagamento cadastrado. Escolha outro período ou fale com o
                        suporte.
                      </p>
                    )}

                    <p className="text-center text-xs text-muted-foreground">
                      Depois de pagar, seu acesso é liberado automaticamente. Se demorar, atualize esta página ou
                      entre em <Link to="/minha-conta" className="font-bold underline">Minha Conta</Link>.
                    </p>
                  </CardContent>
                </Card>
              )}

              {orderId && order?.status !== "paid" && (
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-xs font-semibold">
                    Aguardando a confirmação do Mercado Pago... pode deixar esta página aberta.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plano</span>
                    <span className="font-bold capitalize">{base.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-bold">{PERIOD_LABEL[period]}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-xl font-black text-primary">
                        {formatPriceBRL(offer?.price_cents ?? 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    Pagamento processado pelo Mercado Pago
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
