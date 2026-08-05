import { useState, useEffect } from "react";
import { Timer, Bell, CheckCircle2 } from "lucide-react";

export function LaunchCountdown() {
  const launchDate = new Date("2026-10-10T10:00:00-03:00"); // 10/10/26 às 10h (Horário de Brasília)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Aqui poderíamos salvar em uma tabela de leads pública se necessário
      console.log("Lead registrado:", email);
    }
  };

  return (
    <section className="mb-12 mt-6 overflow-hidden rounded-3xl border-2 border-gold/30 bg-black p-1 shadow-2xl">
      <div className="relative rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-[#0f4c35] to-black px-6 py-10 text-center">
        <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-[80px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
            <Timer className="h-3 w-3" /> O Grande Lançamento
          </div>
          
          <h2 className="font-display text-3xl font-black text-white md:text-5xl">
            Prepare-se para a <span className="text-gold">Revolução</span>
          </h2>
          
          <p className="mx-auto max-w-xl text-sm font-bold text-white/70 md:text-base">
            Estamos finalizando os últimos detalhes para entregar a melhor experiência em automação de enfermagem do Brasil.
          </p>

          <div className="flex justify-center gap-3 md:gap-6">
            {[
              { label: "Dias", value: timeLeft.days },
              { label: "Horas", value: timeLeft.hours },
              { label: "Min", value: timeLeft.minutes },
              { label: "Seg", value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black text-white shadow-inner md:h-20 md:w-20 md:text-4xl">
                  {String(item.value).padStart(2, "0")}
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gold">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-md">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  className="h-12 flex-1 rounded-xl border-0 bg-white/10 px-4 text-sm font-bold text-white placeholder:text-white/30 focus:ring-2 focus:ring-gold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl gold-gradient px-6 text-sm font-black text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Bell className="h-4 w-4" /> ME AVISE
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-gold/10 p-4 text-gold animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="h-8 w-8" />
                <p className="text-sm font-black uppercase tracking-wider">Você será o primeiro a saber!</p>
              </div>
            )}
          </div>
          
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Data oficial: 10 de Outubro de 2026 às 10h00
          </p>
        </div>
      </div>
    </section>
  );
}
