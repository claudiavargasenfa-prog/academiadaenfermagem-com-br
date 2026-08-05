import { useState } from "react";
import { MessageSquareText, Send, CheckCircle2, Star } from "lucide-react";

const CATEGORIES = [
  "Conteúdo Técnico",
  "Usabilidade do App",
  "Sistema de Voz/Ditado",
  "Sugestão de Novo Mini App",
  "Outros"
];

export function FeedbackCollector() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim() && rating > 0 && category) {
      setSubmitted(true);
      console.log("Feedback enviado:", { feedback, rating, category });
      setFeedback("");
      setRating(0);
      setCategory("");
    }
  };

  return (
    <section className="mb-12 mt-8">
      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        {!submitted ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquareText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
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
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">O que deseja avaliar?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-full px-4 py-1.5 text-[10px] font-bold transition-all ${
                        category === cat
                          ? "bg-primary text-white shadow-md"
                          : "bg-white/50 text-muted-foreground hover:bg-white/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escreva aqui sua experiência ou sugestão..."
                className="min-h-[100px] w-full rounded-xl border-white/50 bg-white/50 p-4 text-sm focus:ring-primary"
                required
              />
              <button
                type="submit"
                disabled={!category || rating === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all active:scale-95 disabled:opacity-30 hover:opacity-90"
              >
                <Send className="h-4 w-4" /> Enviar Feedback
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <h3 className="font-display text-base font-bold text-foreground">Obrigado pelo seu feedback!</h3>
            <p className="text-xs text-muted-foreground">Recebemos sua mensagem com carinho.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              Enviar outro comentário
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
