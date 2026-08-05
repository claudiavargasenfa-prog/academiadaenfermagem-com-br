import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Filter, Star, CheckCircle2, MessageSquare, Clock, User, Reply, Trash2, Eye, EyeOff, ShieldCheck, XCircle, Users } from "lucide-react";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

export function FeedbackAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [ratingFilter, setRatingFilter] = useState("todos");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [moderating, setModerating] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState("");
  const [replyText, setReplyText] = useState("");

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_feedbacks")
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_response, is_public, moderation_reason }: any) => {
      const { error } = await supabase
        .from("user_feedbacks")
        .update({ 
          status, 
          admin_response, 
          is_public, 
          moderation_reason,
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-feedbacks"] });
      setReplyingTo(null);
      setModerating(null);
      setModerationReason("");
      setReplyText("");
      toast.success("Feedback atualizado!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_feedbacks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-feedbacks"] });
      toast.success("Feedback excluído");
    }
  });

  const filtered = useMemo(() => {
    if (!feedbacks) return [];
    return feedbacks.filter((f: any) => {
      const q = search.toLowerCase();
      const matchesSearch = !search || 
        f.message.toLowerCase().includes(q) || 
        f.profiles?.full_name?.toLowerCase().includes(q) ||
        f.profiles?.email?.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === "todos" || f.status === statusFilter;
      const matchesCategory = categoryFilter === "todos" || f.category === categoryFilter;
      const matchesRating = ratingFilter === "todos" || f.rating === parseInt(ratingFilter);

      return matchesSearch && matchesStatus && matchesCategory && matchesRating;
    });
  }, [feedbacks, search, statusFilter, categoryFilter, ratingFilter]);

  const stats = useMemo(() => {
    if (!feedbacks) return { pending: 0, total: 0, avgRating: 0 };
    const pending = feedbacks.filter((f: any) => f.status === "pendente").length;
    const sum = feedbacks.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    return {
      pending,
      total: feedbacks.length,
      avgRating: feedbacks.length ? (sum / feedbacks.length).toFixed(1) : 0
    };
  }, [feedbacks]);

  if (isLoading) return <Card><p className="text-sm text-muted-foreground">Carregando feedbacks...</p></Card>;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-center">
          <p className="text-[10px] font-bold text-amber-600 uppercase">Pendentes</p>
          <p className="text-xl font-black text-amber-700">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 border border-primary/20 text-center">
          <p className="text-[10px] font-bold text-primary uppercase">Total</p>
          <p className="text-xl font-black text-primary">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-gold/10 p-3 border border-gold/20 text-center">
          <p className="text-[10px] font-bold text-gold uppercase">Média</p>
          <p className="text-xl font-black text-gold-dark flex items-center justify-center gap-1">
            {stats.avgRating} <Star className="h-4 w-4 fill-gold text-gold" />
          </p>
        </div>
      </div>

      {/* Filters Area */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className={`${input} pl-8`}
              placeholder="Buscar por mensagem ou aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className={`${input} w-[140px]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Status</option>
              <option value="pendente">⏳ Pendente</option>
              <option value="lido">👀 Lido</option>
              <option value="respondido">✅ Respondido</option>
            </select>
            <select className={`${input} w-[140px]`} value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
              <option value="todos">Estrelas</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Feedback List */}
      <div className="space-y-3">
        {filtered.map((f: any) => (
          <Card key={f.id} className={`border-l-4 ${f.status === 'pendente' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-none">{f.profiles?.full_name || "Aluno Anônimo"}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">{f.profiles?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < f.rating ? "fill-gold text-gold" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-[9px] text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-foreground/5 p-3 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-black uppercase bg-white px-1.5 py-0.5 rounded border border-foreground/10">{f.category}</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed italic">"{f.message}"</p>
                {f.improvement_suggestion && (
                  <div className="mt-2 pt-2 border-t border-foreground/5">
                    <p className="text-[9px] font-bold text-primary uppercase flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> Sugestão de Melhoria:
                    </p>
                    <p className="text-[11px] text-muted-foreground">{f.improvement_suggestion}</p>
                  </div>
                )}
              </div>

              {f.admin_response && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-700 uppercase flex items-center gap-1 mb-1">
                    <Reply className="h-3 w-3" /> Sua Resposta:
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-tight">{f.admin_response}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => updateMutation.mutate({ id: f.id, status: f.status === 'pendente' ? 'lido' : f.status })}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-bold uppercase transition-all ${
                      f.status === 'pendente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> {f.status}
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: f.id, is_public: !f.is_public })}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-bold uppercase transition-all ${
                      f.is_public ? 'bg-primary text-white' : 'bg-foreground/5 text-muted-foreground'
                    }`}
                  >
                    {f.is_public ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {f.is_public ? "Público" : "Privado"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === f.id ? null : f.id);
                      setReplyText(f.admin_response || "");
                    }}
                    className="flex items-center gap-1 text-[9px] font-bold text-primary hover:underline uppercase"
                  >
                    <Reply className="h-3 w-3" /> {f.admin_response ? "Editar Resposta" : "Responder"}
                  </button>
                  <button
                    onClick={() => { if(confirm("Apagar permanentemente?")) deleteMutation.mutate(f.id); }}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {replyingTo === f.id && (
                <div className="mt-2 space-y-2 animate-in slide-in-from-top-2">
                  <textarea
                    className={input}
                    rows={3}
                    placeholder="Sua resposta para o aluno..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Cancelar</button>
                    <button
                      onClick={() => updateMutation.mutate({ id: f.id, admin_response: replyText, status: 'respondido' })}
                      className="rounded-lg gold-gradient px-4 py-1.5 text-[10px] font-bold"
                    >
                      Enviar Resposta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-foreground/5 rounded-2xl border border-dashed border-foreground/10">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground font-bold uppercase">Nenhum feedback encontrado com estes filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
