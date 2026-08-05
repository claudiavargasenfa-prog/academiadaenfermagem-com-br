import { Award, Check, CreditCard, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import { fetchSubscriptionPlans, formatPriceBRL, type SubscriptionPlan, TRACKS, type TrackSlug } from "@/lib/access";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/AppShell";

export default function ComparativoUpgrade() {
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const plans = plansQ.data ?? [];

  if (plans.length === 0) return null;

  // Group plans by track to show comparisons
  const tracks = TRACKS.map(track => {
    const trackPlans = plans.filter(p => p.slug === track.slug || p.slug?.startsWith(track.slug));
    return { track, plans: trackPlans };
  });

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="font-display text-xl font-bold">Eleve seu Nível Profissional</h2>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        Cada nível de assinatura libera novas ferramentas e benefícios exclusivos para acelerar sua carreira. 
        Confira as vantagens de migrar para planos de maior duração:
      </p>

      <div className="space-y-8">
        {tracks.map(({ track, plans: trackPlans }) => {
          if (trackPlans.length === 0) return null;

          // Define typical benefits based on duration
          const getBenefits = (p: SubscriptionPlan) => {
            const period = p.billing_period?.toLowerCase() || "";
            if (period === "mensal") return ["Acesso completo ao App", "Atualizações constantes", "Suporte técnico"];
            if (period === "trimestral") return ["Tudo do Mensal", "1 Certificado de 10h incluso", "Economia real"];
            if (period === "semestral") return ["Tudo do Trimestral", "2 Certificados de 10h", "Selo aluno destaque"];
            if (period === "anual") return ["Tudo do Semestral", "LIBERAÇÃO DE 2º APP GRÁTIS", "Melhor custo-benefício"];
            return [];
          };

          return (
            <div key={track.slug} className="space-y-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <span>{track.emoji}</span> {track.label}
              </h3>
              
              <div className="grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4">
                {trackPlans.sort((a,b) => (a.price_cents || 0) - (b.price_cents || 0)).map((p) => {
                  const isBestValue = p.billing_period === "anual";
                  const benefits = getBenefits(p);

                  return (
                    <div 
                      key={p.id} 
                      className={`relative flex flex-col rounded-2xl border p-5 transition-all hover:shadow-lg ${
                        isBestValue 
                        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-md" 
                        : "border-border bg-white/50"
                      }`}
                    >
                      {isBestValue && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gold-gradient px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          Melhor Escolha
                        </div>
                      )}

                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {p.billing_period}
                        </span>
                        <h4 className="mt-1 font-display text-lg font-bold capitalize">
                          Plano {p.billing_period}
                        </h4>
                      </div>

                      <div className="mb-6">
                        <span className="text-2xl font-black text-primary">
                          {formatPriceBRL(p.price_cents || 0)}
                        </span>
                        {p.price_original_cents && p.price_original_cents > (p.price_cents || 0) && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPriceBRL(p.price_original_cents)}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600">
                              -{Math.round(100 - ((p.price_cents || 0) * 100 / p.price_original_cents))}%
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="mb-6 flex-1 space-y-2.5">
                        {benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-tight">
                            <Check className={`mt-0.5 h-3 w-3 shrink-0 ${isBestValue ? "text-primary" : "text-emerald-500"}`} />
                            <span className={b.includes("GRÁTIS") ? "font-bold text-primary" : ""}>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {p.cakto_link_novo || p.cakto_checkout_url ? (
                        <a
                          href={p.cakto_link_novo || p.cakto_checkout_url || ""}
                          target="_blank"
                          rel="noreferrer"
                          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                            isBestValue 
                            ? "gold-gradient text-white shadow-md hover:scale-[1.02]" 
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          <Zap className="h-3 w-3" />
                          {isBestValue ? "UPGRADE AGORA" : "ADQUIRIR"}
                        </a>
                      ) : (
                        <div className="mt-auto rounded-xl bg-muted/50 py-2 text-center text-[10px] font-bold text-muted-foreground">
                          Em breve
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="bg-emerald-50/50 border-emerald-100 flex items-center gap-4 p-4">
        <div className="rounded-full bg-emerald-100 p-2">
          <Award className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-emerald-900">Certificados Reconhecidos</h4>
          <p className="text-xs text-emerald-700">
            Nossos certificados são válidos para horas complementares e enriquecimento de currículo. 
            Planos Semestrais e Anuais dão direito a emissão gratuita direta no app!
          </p>
        </div>
      </Card>
    </section>
  );
}
