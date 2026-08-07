import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Mariana Silva",
    role: "Enfermeira Assistencial",
    text: "A SAE automatizada mudou meu plantão. O que eu levava 40 minutos para escrever, agora faço com 2 cliques e mais segurança clínica.",
    rating: 5,
    avatar: "MS"
  },
  {
    name: "Ricardo Oliveira",
    role: "Estudante de Enfermagem",
    text: "Os Mini Apps são perfeitos para consulta rápida na beira do leito. Os cálculos de medicação me dão a confiança que eu precisava no estágio.",
    rating: 5,
    avatar: "RO"
  },
  {
    name: "Ana Paula Santos",
    role: "Técnica em Enfermagem",
    text: "O sistema de ditado é incrível! Consigo registrar as anotações enquanto realizo o cuidado, sem perder nenhum detalhe importante.",
    rating: 5,
    avatar: "AS"
  }
];

export function TestimonialsSection() {
  return (
    <section className="mb-12 mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-black tracking-tight text-foreground">O que dizem nossos alunos</h2>
          <p className="text-sm text-muted-foreground">Transformando a rotina de quem cuida.</p>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-4 w-4 fill-gold text-gold" />
          ))}
          <span className="ml-2 text-xs font-bold text-foreground">4.9/5</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="group relative rounded-2xl border border-white/40 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md">
            <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />
            
            <div className="mb-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3 w-3 fill-gold text-gold" />
              ))}
            </div>

            <p className="mb-6 text-sm italic leading-relaxed text-muted-foreground">
              "{t.text}"
            </p>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient text-xs font-black text-white shadow-sm">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground">{t.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
