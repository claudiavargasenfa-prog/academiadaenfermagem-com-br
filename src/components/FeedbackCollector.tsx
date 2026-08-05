import { useState } from "react";
import { MessageSquareText, Send, CheckCircle2 } from "lucide-react";

export function FeedbackCollector() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      setSubmitted(true);
      // Aqui o feedback seria enviado para uma tabela de suporte/feedback
      console.log("Feedback recebido:", feedback);
      setFeedback("");
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
              <h3 className="font-display text-base font-bold text-foreground">Conte-me como foi sua experiência</h3>
              <p className="text-xs text-muted-foreground">Sua opinião é fundamental para construirmos a melhor Academia juntos.</p>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Como o app está te ajudando? Tem alguma sugestão?"
                className="min-h-[100px] w-full rounded-xl border-white/50 bg-white/50 p-4 text-sm focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 hover:opacity-90"
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
