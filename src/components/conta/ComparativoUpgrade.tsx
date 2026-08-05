import { Award, Check, CreditCard, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import { fetchPlanOffers, formatPriceBRL, type PlanOffer, TRACKS, type TrackSlug } from "@/lib/access";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/AppShell";

export default function ComparativoUpgrade() {
  const offersQ = useQuery({ queryKey: ["plan_offers"], queryFn: fetchPlanOffers });
  const offers = offersQ.data ?? [];

  if (offers.length === 0) return null;

  // Group offers by track to show comparisons
  const tracks = TRACKS.map(track => {
    const trackOffers = offers.filter(o => o.plan_slug === track.slug);
    return { track, offers: trackOffers };
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
        {tracks.map(({ track, offers: trackOffers }) => {
          if (trackOffers.length === 0) return null;

          return (
            <div key={track.slug} className="space-y-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <span>{track.emoji}</span> {track.label}
              </h3>
              
              <div className="grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4">
                {trackOffers.sort((a,b) => (a.price_cents || 0) - (b.price_cents || 0)).map((o) => {
                  const isBestValue = o.billing_period === "anual";
                  const perks = o.perks as string[] ?? [];

                  return (
                    <div 
                      key={o.id} 
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
                          {o.billing_period}
                        </span>
                        <h4 className="mt-1 font-display text-lg font-bold capitalize">
                          Plano {o.billing_period}
                        </h4>
                      </div>

                      <div className="mb-6">
                        <span className="text-2xl font-black text-primary">
                          {formatPriceBRL(o.price_cents || 0)}
                        </span>
                      </div>

                      <ul className="mb-6 flex-1 space-y-2.5">
                        {perks.slice(0, 4).map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-tight">
                            <Check className={`mt-0.5 h-3 w-3 shrink-0 ${isBestValue ? "text-primary" : "text-emerald-500"}`} />
                            <span className={p.includes("GRÁTIS") || p.includes("2º") ? "font-bold text-primary" : ""}>{p}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/checkout"
                        search={{ plan: track.slug }}
                        className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                          isBestValue 
                          ? "gold-gradient text-white shadow-md hover:scale-[1.02]" 
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        <Zap className="h-3 w-3" />
                        {isBestValue ? "UPGRADE AGORA" : "ADQUIRIR"}
                      </Link>
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
