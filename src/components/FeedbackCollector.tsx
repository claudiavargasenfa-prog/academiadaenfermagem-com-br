import { useState, useEffect } from "react";
import { MessageSquareText, Send, CheckCircle2, Star, Lightbulb, History, User, Circle, Users, ShieldCheck, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CATEGORIES = [
  "Conteúdo Técnico",
  "Usabilidade do App",
  "Sistema de Voz/Ditado",
  "Sugestão de Novo Guia Clínico",
  "Outros"
];

const STORAGE_KEY = "adec-feedback-draft";

export function FeedbackCollector() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");
  const [improvement, setImprovement] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"feedback" | "comunidade">("feedback");
  const [newComment, setNewComment] = useState("");

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { feedback: f, improvement: i, rating: r, category: c } = JSON.parse(saved);
        if (f) setFeedback(f);
        if (i) setImprovement(i);
        if (r) setRating(r);
        if (c) setCategory(c);
      } catch (e) {
        console.error("Erro ao carregar rascunho de feedback:", e);
      }
    }
  }, []);

  // Save draft to localStorage on changes
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ feedback, improvement, rating, category }));
    }
  }, [feedback, improvement, rating, category, submitted]);

  // Fetch user feedbacks
  const { data: userFeedbacks } = useQuery({
    queryKey: ["user-feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Mutation to send feedback
  const sendFeedbackMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("user_feedbacks")
        .insert({
          user_id: user.id,
          category: payload.category,
          rating: payload.rating,
          message: payload.feedback,
          improvement_suggestion: payload.improvement
        });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      setFeedback("");
      setImprovement("");
      setRating(0);
      setCategory("");
      queryClient.invalidateQueries({ queryKey: ["user-feedbacks"] });
      toast.success("Feedback enviado com sucesso!", {
        description: "Obrigado por ajudar a Academia da Enfermagem a crescer!"
      });
    },
    onError: (error) => {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Falha ao enviar feedback", {
        description: "Seu rascunho foi salvo localmente. Tente novamente em alguns instantes."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim() && rating > 0 && category) {
      sendFeedbackMutation.mutate({ feedback, rating, category, improvement });
    }
  };

  return (
    <section className="mb-12 mt-8 px-4 sm:px-0">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 p-1 bg-white/50 rounded-full border border-primary/10 w-fit">
          <button 
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeTab === 'feedback' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-white'}`}
          >
            MEU FEEDBACK
          </button>
          <button 
            onClick={() => setActiveTab("comunidade")}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeTab === 'comunidade' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-white'}`}
          >
            ÁREA DO ALUNO
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 shadow-sm">

        {activeTab === "feedback" ? (
          <>
            <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-500 opacity-75"></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Estou Online para te ouvir</span>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 text-[10px] font-bold text-primary transition-all hover:bg-white"
          >
            <History className="h-3 w-3" />
            {showHistory ? "Novo Feedback" : "Meu Histórico"}
          </button>
        </div>

        {showHistory ? (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-4">
              <h3 className="font-display text-sm font-bold text-foreground">SEU HISTÓRICO DE FEEDBACKS</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {userFeedbacks && userFeedbacks.length > 0 ? (
                userFeedbacks.map((f) => (
                  <div key={f.id} className="rounded-xl border border-white/40 bg-white/30 p-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary uppercase">{f.category}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 ${i < f.rating ? "fill-gold text-gold" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground leading-relaxed">{f.message}</p>
                    {f.admin_response && (
                      <div className="mt-3 rounded-lg bg-gold/10 p-3 border border-gold/20">
                        <div className="flex items-center gap-1.5 mb-1 text-gold">
                          <User className="h-3 w-3" />
                          <span className="text-[9px] font-bold uppercase">Resposta da Academia</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground italic leading-tight">{f.admin_response}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
                      <span className={`text-[9px] font-black uppercase ${
                        f.status === 'respondido' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        Status: {f.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-muted-foreground py-8">Você ainda não enviou nenhum feedback.</p>
              )}
            </div>
          </div>
        ) : !submitted ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquareText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="font-display text-base font-bold text-foreground">CONTE-ME COMO ESTÁ SENDO A SUA EXPERIÊNCIA</h3>
              <p className="text-xs text-muted-foreground font-bold text-primary uppercase tracking-wider">FAÇA PARTE DA PROXIMA ATUALIZAÇÃO</p>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sua Avaliação</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform active:scale-90"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hover || rating) ? "fill-gold text-gold" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">O que deseja avaliar?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-full px-4 py-1.5 text-[10px] font-bold transition-all ${
                        category === cat
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-white/50 text-muted-foreground hover:bg-white/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Sua mensagem</p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escreva aqui sua experiência ou sugestão..."
                  className="min-h-[100px] w-full rounded-xl border-white/50 bg-white/50 p-4 text-sm focus:ring-primary shadow-sm transition-all focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Lightbulb className="h-3 w-3 text-gold" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Como posso melhorar?</p>
                </div>
                <textarea
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  placeholder="O que você mudaria para tornar o app ainda melhor?"
                  className="min-h-[100px] w-full rounded-xl border-gold/20 bg-gold/5 p-4 text-sm focus:ring-gold shadow-sm placeholder:text-muted-foreground/50 transition-all focus:bg-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={!category || rating === 0 || sendFeedbackMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all active:scale-95 disabled:opacity-30 hover:shadow-lg hover:brightness-110"
              >
                {sendFeedbackMutation.isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> ENVIAR FEEDBACK AGORA
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 animate-in zoom-in duration-500 text-center">
            <div className="rounded-full bg-emerald-100 p-4 animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-foreground">SUCESSO TOTAL!</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">Recebemos sua mensagem! Nossa equipe técnica já foi notificada para analisar sua sugestão.</p>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-4 rounded-full border-2 border-primary px-6 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
            >
              ENVIAR OUTRO FEEDBACK
            </button>
          </div>
        )}
          </>
        ) : (
          <StudentArea />
        )}
      </div>
    </section>
  );
}

function StudentArea() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ["student-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_comments")
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não logado");

      const { error } = await supabase
        .from("student_comments")
        .insert({ user_id: user.id, content: comment });

      if (error) throw error;
      
      toast.success("Comentário enviado!", {
        description: "Ele passará por uma análise técnica antes de ser publicado."
      });
      setComment("");
    } catch (err) {
      toast.error("Erro ao enviar comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h3 className="font-display text-base font-bold text-foreground">ÁREA DE CONVIVÊNCIA DOS ALUNOS</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-4">Troque experiências e tire dúvidas com a comunidade</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white/40 p-4 rounded-xl border border-white/60">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="O que você está achando da Academia? Compartilhe aqui..."
          className="w-full min-h-[80px] rounded-lg border-primary/10 bg-white/80 p-3 text-sm focus:ring-primary shadow-inner"
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-[9px] text-amber-600 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            MODERAÇÃO ATIVA: TODO CONTEÚDO É AVALIADO
          </div>
          <button
            disabled={!comment.trim() || isSubmitting}
            className="rounded-full bg-primary px-6 py-2 text-[10px] font-bold text-white transition-all hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "ENVIANDO..." : "PUBLICAR"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-primary/10 pb-2">Comentários Recentes</h4>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
          {comments && comments.length > 0 ? (
            comments.map((c: any) => (
              <div key={c.id} className="bg-white/30 rounded-lg p-3 border border-white/40 shadow-sm transition-all hover:bg-white/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-primary">{c.profiles?.full_name || "Aluno da Academia"}</span>
                  <span className="text-[8px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 space-y-2 opacity-50">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase">Nenhum comentário público ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
