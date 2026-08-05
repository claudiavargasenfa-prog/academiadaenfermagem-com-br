import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, QrCode, Copy, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createOrder, getOrderStatus } from "@/lib/checkout.functions";
import { fetchSubscriptionPlans, formatPriceBRL } from "@/lib/access";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Academia da Enfermagem" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = Route.useSearch() as { plan?: string };
  const planSlug = search.plan || "academico";

  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: plans } = useQuery({
    queryKey: ["subscription_plans"],
    queryFn: fetchSubscriptionPlans,
  });

  const plan = plans?.find((p) => p.slug === planSlug);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderId(data.id);
      toast.success("Pedido criado! Aguardando pagamento.");
    },
    onError: () => {
      toast.error("Erro ao criar pedido. Tente novamente.");
    },
  });

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderStatus({ data: { orderId: orderId! } }),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      return data?.status === "paid" ? false : 3000;
    },
  });

  useEffect(() => {
    if (order?.status === "paid") {
      toast.success("Pagamento confirmado! Bem-vinda à Academia.");
      // Pequeno delay para a pessoa ver o check verde antes de ir pro app
      setTimeout(() => {
        navigate({ to: "/trilha/$slug", params: { slug: planSlug } });
      }, 3000);
    }
  }, [order?.status, navigate, planSlug]);

  const handleCreateOrder = (method: "pix" | "credit_card") => {
    if (!plan) return;
    createOrderMutation.mutate({
      data: {
        planSlug: plan.slug,
        amountCents: (plan as any).price_cents || 2990,
        paymentMethod: method,
      },
    });
  };

  const copyPix = () => {
    if (order?.pix_copy_paste) {
      navigator.clipboard.writeText(order.pix_copy_paste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!plan) {
    return (
      <AppShell publicRoute>
        <div className="flex h-[60vh] flex-col items-center justify-center p-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando detalhes do plano...</p>
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
            <p className="text-muted-foreground">Você está assinando a {plan.name}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_250px]">
            <div className="space-y-6">
              {!orderId ? (
                <Card className="border-2 border-primary/10 shadow-xl">
                  <CardHeader>
                    <CardTitle>Escolha o método de pagamento</CardTitle>
                    <CardDescription>O acesso é liberado instantaneamente após a confirmação.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pix" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pix" className="gap-2">
                          <QrCode className="h-4 w-4" /> PIX
                        </TabsTrigger>
                        <TabsTrigger value="card" className="gap-2">
                          <CreditCard className="h-4 w-4" /> Cartão
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="pix" className="space-y-4 py-4">
                        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                          <p className="font-bold">✓ Liberação imediata</p>
                          <p>O PIX é a forma mais rápida de começar seus estudos.</p>
                        </div>
                        <Button
                          className="w-full py-6 text-lg font-bold"
                          onClick={() => handleCreateOrder("pix")}
                          disabled={createOrderMutation.isPending}
                        >
                          {createOrderMutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            "Gerar PIX"
                          )}
                        </Button>
                      </TabsContent>
                      <TabsContent value="card" className="space-y-4 py-4">
                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                          <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            Checkout Seguro via Mercado Pago / Stripe
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => handleCreateOrder("credit_card")}
                            disabled={createOrderMutation.isPending}
                          >
                            Pagar com Cartão
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-emerald-500/20 shadow-2xl">
                  <CardHeader className="text-center">
                    {order?.status === "paid" ? (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="rounded-full bg-emerald-100 p-4">
                          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-emerald-700">Pagamento Confirmado!</CardTitle>
                          <CardDescription>Estamos preparando seu acesso...</CardDescription>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          Aguardando Pagamento
                        </CardTitle>
                        <CardDescription>Pague o PIX para liberar seu acesso agora</CardDescription>
                      </>
                    )}
                  </CardHeader>
                  {order?.status !== "paid" && (
                    <CardContent className="space-y-6">
                      <div className="flex justify-center rounded-xl bg-white p-4 shadow-inner">
                        {order?.pix_qr_code && (
                          <img
                            src={order.pix_qr_code}
                            alt="QR Code PIX"
                            className="h-48 w-48"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          PIX Copia e Cola
                        </label>
                        <div className="relative">
                          <input
                            readOnly
                            value={order?.pix_copy_paste || ""}
                            className="w-full rounded-lg border bg-muted/50 px-3 py-3 pr-12 text-xs font-mono"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1 h-10 w-10"
                            onClick={copyPix}
                          >
                            {copied ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-4 text-center text-xs text-amber-800">
                        <p>O QR Code expira em 30 minutos.</p>
                        <p>Após pagar, não feche esta página.</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
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
                    <span className="font-bold">{plan.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-bold">Mensal</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-xl font-black text-primary">
                        {formatPriceBRL((plan as any).price_cents || 2990)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    Pagamento 100% Seguro
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

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
