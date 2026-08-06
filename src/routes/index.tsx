import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import {
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
} from "@/lib/access";
import { useApps } from "@/lib/apps";
import { isBasePlanSlug } from "@/lib/plan-slugs";
import { RichText, useText } from "@/lib/app-texts";
import { FeedbackCollector } from "@/components/FeedbackCollector";
import { TestimonialsSection } from "@/components/TestimonialsSection";




export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia da Enfermagem | SAE e PE automatizados" },
      {
        name: "description",
        content:
          "Academia da Enfermagem: SAE e PE automatizados e 4 aplicativos de guias clínicos para acadêmicos, estudantes de técnico, técnicos e enfermeiros. 15 dias grátis.",
      },
      { property: "og:title", content: "Loja — Academia da Enfermagem | SAE e PE automatizados" },
      {
        property: "og:description",
        content:
          "Conheça os 4 aplicativos da Academia da Enfermagem, com SAE e PE automatizados, antes de iniciar seus 15 dias grátis.",
      },

      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/" }],
  }),
  component: StoreHome,
});



function StoreHome() {
  return <StoreHomeContent />;
}

function StoreHomeContent() {
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const mySubsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const appsQ = useApps();
  const appBySlug = new Map((appsQ.data ?? []).map((a) => [a.slug, a]));

  const lojaSortMode = useText("ordenacao.loja", "numeric");
  const activePlans = (plansQ.data ?? [])
    .filter((p) => p.is_active && isBasePlanSlug(p.slug))
    .slice()
    .sort((a, b) => {
      if (lojaSortMode === "alpha") return a.name.localeCompare(b.name, "pt-BR");
      return ((a as any).sort_order ?? 0) - ((b as any).sort_order ?? 0);
    });
  const mySubs = mySubsQ.data ?? [];


  const homeTitle = useText("home.title", "Academia da Enfermagem");
  const homeDesc = useText("home.description", "Quatro aplicativos, uma só academia. Conheça cada um e comece com 15 dias grátis — sem cartão.");
  const ctaSection = useText("home.cta_section", "Conheça os aplicativos");
  const compraSegura = useText("compra.segura", "🔒 COMPRA SEGURA");



  return (
    <AppShell hideReferences publicRoute>
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">Loja</p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl"><RichText>{homeTitle}</RichText></h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base"><RichText>{homeDesc}</RichText></p>
      </div>

      <div className="mb-8 flex justify-center">
        <img
          src={mascotesAsset.url}
          alt="Mascotes Academia da Enfermagem — Time contra as IRAS"
          className="h-40 w-auto object-contain sm:h-52 md:h-60 [animation:pulse_3s_ease-in-out_infinite]"
        />
      </div>

      {/* 4 portas — cada aplicativo tem a sua própria página */}
      {activePlans.length > 0 && (
        <section id="aplicativos" className="mb-8 scroll-mt-20">
          <h2 className="mb-1 font-display text-lg font-bold"><RichText>{ctaSection}</RichText></h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Escolha a sua porta. O conteúdo de cada aplicativo só é revelado dentro da página dele.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activePlans.map((plan) => {
              const appRow = appBySlug.get(plan.slug);
              const sub = mySubs.find((s) => s.plan_slug === plan.slug);
              const subscribed = !!sub && (sub.status === "active" || sub.status === "trial");
              const inTrial = !!sub && sub.status === "trial";
              const slug = plan.slug;
              const cardStyle: React.CSSProperties = {
                backgroundColor: appRow?.bg_color ?? "#F3F4F6",
                color: appRow?.fg_color ?? "#111827",
              };

              return (
                <div
                  key={plan.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={cardStyle}
                  data-app={slug}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
                  <div className="relative mb-3 flex items-center gap-3">
                    <span className="text-4xl transition-transform duration-500 group-hover:scale-110">{appRow?.emoji ?? "🚪"}</span>
                    <h3 className="font-display text-lg font-black tracking-tight">{plan.name}</h3>
                  </div>
                  <PlanSlogan slug={slug} />
                  <div className="relative mb-4 flex items-start gap-2 rounded-xl bg-black/5 p-2">
                    <span className="mt-0.5">🔒</span>
                    <p className="text-[10px] font-bold leading-tight opacity-80">
                      CONTEÚDO PREMIUM EXCLUSIVO: Os módulos só podem ser visualizados por assinantes ou após clicar em descobrir.
                    </p>
                  </div>

                  <div className="relative mt-auto space-y-2 pt-4">
                    {subscribed ? (
                      <>
                        <Link
                          to="/trilha/$slug"
                          params={{ slug }}
                          className="block w-full scale-100 rounded-xl bg-foreground py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-transform active:scale-95 hover:scale-[1.02]"
                        >
                          Acessar Agora →
                        </Link>
                        <span className="block w-full rounded-xl bg-white/40 py-2 text-center text-xs font-bold">
                          {inTrial
                            ? `🎁 Trial ativo · até ${new Date(sub!.expires_at).toLocaleDateString("pt-BR")}`
                            : "✓ Assinatura ativa"}
                        </span>
                      </>
                    ) : (
                      <Link
                        to="/planos/$slug"
                        params={{ slug }}
                        className="group/btn block w-full scale-100 rounded-xl bg-foreground py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-all active:scale-95 hover:scale-[1.02] hover:shadow-black/20"
                      >
                        <span className="inline-block transition-transform group-hover/btn:translate-x-1">Descobrir Conteúdo →</span>
                      </Link>
                    )}

                    <p className="text-center text-[11px] font-extrabold tracking-wide text-emerald-700">
                      <RichText>{compraSegura}</RichText>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <FeedbackCollector />




    </AppShell>
  );
}

function PlanSlogan({ slug }: { slug: string }) {
  const txt = useText(`aplicativo.${slug}.slogan`, "");
  if (!txt.trim()) return null;
  return (
    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide">
      <RichText>{txt}</RichText>
    </p>
  );
}


