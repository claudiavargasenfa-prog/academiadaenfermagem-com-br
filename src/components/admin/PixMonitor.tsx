import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export function PixMonitor() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["webhook_events", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("webhook_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredEvents = events?.filter(e => 
    (e.provider?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (e.event_type?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (e.external_id?.toLowerCase() || "").includes(search.toLowerCase())
  );

  async function handleReprocess(id: string) {
    if (!confirm("Deseja tentar reprocessar este evento manualmente?")) return;
    
    // Simulação de reprocessamento (em um cenário real, chamaria uma Server Function)
    alert("Funcionalidade de reprocessamento manual será integrada com a API de webhooks.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-base font-bold">Monitoramento de Pix / Webhooks</h3>
        <button 
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por provedor, evento ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-foreground/15 bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="processed">Processado</option>
          <option value="failed">Falhou</option>
        </select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Carregando logs...</p>
        ) : filteredEvents?.length === 0 ? (
          <Card className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum evento encontrado.</p>
          </Card>
        ) : (
          filteredEvents?.map((event) => (
            <Card key={event.id} className={`border-l-4 ${
              event.status === 'processed' ? 'border-l-emerald-500' : 
              event.status === 'failed' ? 'border-l-destructive' : 'border-l-amber-500'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {event.provider} · {event.event_type}
                    </span>
                    {event.status === 'processed' ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : event.status === 'failed' ? (
                      <AlertCircle className="h-3 w-3 text-destructive" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    ID Externo: {event.external_id || "N/A"}
                  </p>
                  <p className="text-xs font-semibold">
                    Data: {new Date(event.created_at || Date.now()).toLocaleString("pt-BR")}
                  </p>
                  {event.error_message && (
                    <p className="mt-2 rounded bg-destructive/5 p-2 text-[10px] font-medium text-destructive">
                      Erro: {event.error_message}
                    </p>
                  )}
                </div>
                
                {event.status === 'failed' && (
                  <button
                    onClick={() => handleReprocess(event.id)}
                    className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-[10px] font-bold text-background hover:opacity-90"
                  >
                    Reprocessar
                  </button>
                )}
              </div>
              
              <details className="mt-3">
                <summary className="cursor-pointer text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground">
                  Ver Payload JSON
                </summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-foreground/5 p-2 text-[10px]">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
              </details>
            </Card>
          ))
        )}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-700">
        <p className="font-bold">Dica do Sistema:</p>
        <p className="mt-1">
          Se um aluno reclamar que pagou e não liberou, verifique se há eventos com status <strong>Falhou</strong> aqui. 
          Use o botão <strong>Reprocessar</strong> para tentar validar o pagamento novamente.
        </p>
      </div>
    </div>
  );
}
