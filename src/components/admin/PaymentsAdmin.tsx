import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  UserCheck, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { formatPriceBRL } from "@/lib/access";
import { toast } from "sonner";

export function PaymentsAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["admin_orders", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    if (!orders) return { total: 0, paid: 0, conversion: 0, totalCents: 0 };
    const paid = orders.filter(o => o.status === "paid");
    const total = orders.length;
    const totalCents = paid.reduce((acc, curr) => acc + (curr.amount_cents || 0), 0);
    return {
      total,
      paid: paid.length,
      conversion: total > 0 ? Math.round((paid.length / total) * 100) : 0,
      totalCents
    };
  }, [orders]);

  const filteredOrders = orders?.filter(o => 
    (o.profiles as any)?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    (o.profiles as any)?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search) ||
    o.plan_slug.includes(search)
  );

  const handleManualApprove = async (orderId: string, userId: string, planSlug: string) => {
    if (!confirm("Deseja aprovar este pedido manualmente? O acesso será liberado imediatamente.")) return;
    
    try {
      // 1. Atualizar o pedido
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);
      
      if (orderError) throw orderError;

      // 2. Criar/Atualizar assinatura
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error: subError } = await supabase
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          plan_slug: planSlug,
          status: "active",
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (subError) throw subError;

      toast.success("Pedido aprovado e acesso liberado!");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin_user_subs"] });
    } catch (err: any) {
      toast.error("Erro ao aprovar: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Status Informativo */}
      <Card className="bg-primary/5 border-primary/20 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary">Acompanhamento de Status</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Neste painel você pode acompanhar se o pagamento de cada compra foi <strong>concluído (Pago)</strong>, 
            está <strong>pendente</strong> ou se foi <strong>cancelado</strong>. Utilize os filtros abaixo para agilizar sua busca.
          </p>
        </div>
      </Card>

      <div className="space-y-6">
      {/* Dashboard de Vendas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col justify-between p-4 bg-emerald-50 border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Total Vendido</span>
          </div>
          <p className="text-2xl font-black text-emerald-700">{formatPriceBRL(stats.totalCents)}</p>
          <p className="text-[10px] text-emerald-600/70 mt-1">Apenas pedidos pagos</p>
        </Card>

        <Card className="flex flex-col justify-between p-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <UserCheck className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Vendas Concluídas</span>
          </div>
          <p className="text-2xl font-black text-blue-700">{stats.paid}</p>
          <p className="text-[10px] text-blue-600/70 mt-1">De um total de {stats.total} pedidos</p>
        </Card>

        <Card className="flex flex-col justify-between p-4 bg-amber-50 border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Taxa de Conversão</span>
          </div>
          <p className="text-2xl font-black text-amber-700">{stats.conversion}%</p>
          <p className="text-[10px] text-amber-600/70 mt-1">Pedidos concluídos / totais</p>
        </Card>

        <Card className="flex flex-col justify-between p-4 bg-purple-50 border-purple-100">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Novos Interessados</span>
          </div>
          <p className="text-2xl font-black text-purple-700">{stats.total - stats.paid}</p>
          <p className="text-[10px] text-purple-600/70 mt-1">Geraram pedido mas não pagaram</p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nome, e-mail, plano ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-foreground/15 bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos os status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button 
            onClick={() => refetch()}
            className="rounded-xl bg-primary/10 p-2 text-primary hover:bg-primary/20"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Carregando vendas...</p>
        ) : filteredOrders?.length === 0 ? (
          <Card className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
          </Card>
        ) : (
          filteredOrders?.map((order) => (
            <Card key={order.id} className="relative overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase">
                      {order.plan_slug}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="font-display font-bold">{(order.profiles as any)?.full_name || "Sem Nome"}</p>
                    <p className="text-xs text-muted-foreground">{(order.profiles as any)?.email}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(order.created_at || "").toLocaleString("pt-BR")}</span>
                    <span className="font-bold text-foreground">{formatPriceBRL(order.amount_cents)}</span>
                    <span className="uppercase">{order.payment_method}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== 'paid' && (
                    <button
                      onClick={() => handleManualApprove(order.id, order.user_id || "", order.plan_slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Aprovar Manual
                    </button>
                  )}
                  {order.status === 'pending' && order.pix_copy_paste && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.pix_copy_paste || "");
                        toast.success("Link do Pix copiado!");
                      }}
                      className="rounded-lg bg-foreground/5 p-1.5 text-muted-foreground hover:bg-foreground/10"
                      title="Copiar Pix"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

