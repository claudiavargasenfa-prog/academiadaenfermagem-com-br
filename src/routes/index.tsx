import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import { fetchSubscriptionPlans, fetchMyActiveSubscriptions } from "@/lib/access";
import { useApps } from "@/lib/apps";
import { isBasePlanSlug } from "@/lib/plan-slugs";
import { RichText, useText } from "@/lib/app-texts";
import { FeedbackCollector } from "@/components/FeedbackCollector";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia da Enfermagem | SAE e PE automatizados" },
      { name: "description", content: "Academia da Enfermagem: SAE e PE automatizados e 6 Academias com Mini Apps para acadêmicos, estudantes de técnico, técnicos e enfermeiros." },
      { property: "og:title", content: "Loja — Academia da Enfermagem | SAE e PE automatizados" },
      { property: "og:description", content: "Conheça as 6 Academias da Academia da Enfermagem, com conteúdos para formação e prática profissional." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/" }],
  }),
  component: StoreHome,
});

function StoreHome() { return <StoreHomeContent />; }

function StoreHomeContent() {
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const mySubsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const appsQ = useApps();
  const appBySlug = new Map((appsQ.data ?? []).map((a) => [a.slug, a]));
  const lojaSortMode = useText("ordenacao.loja", "numeric");
  // Toda Academia cadastrada em Admin → Apps aparece automaticamente na loja.
  const activePlans = (plansQ.data ?? []).filter((p) => p.is_active && (appBySlug.has(p.slug) || isBasePlanSlug(p.slug))).slice().sort((a, b) => {
    if (lojaSortMode === "alpha") return a.name.localeCompare(b.name, "pt-BR");
    return ((a as any).sort_order ?? 0) - ((b as any).sort_order ?? 0);
  });
  const mySubs = mySubsQ.data ?? [];
  const homeTitle = useText("home.title", "Academia da Enfermagem");
  const homeDesc = useText("home.description", "Seis Academias, uma só plataforma. Conheça cada uma e encontre conteúdos para sua formação e prática na enfermagem.");
  const ctaSection = useText("home.cta_section", "Conheça as Academias");
  const compraSegura = useText("compra.segura", "🔒 COMPRA SEGURA");

  return (
    <AppShell hideReferences publicRoute>
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">Loja</p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl"><RichText>{homeTitle}</RichText></h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base"><RichText>{homeDesc}</RichText></p>
      </div>

      <div className="mb-8 flex justify-center">
        <img src={mascotesAsset.url} alt="Mascotes Academia da Enfermagem — Time contra as IRAS" className="h-40 w-auto object-contain sm:h-52 md:h-60 [animation:pulse_3s_ease-in-out_infinite]" />
      </div>

      {activePlans.length > 0 && (
        <section id="aplicativos" className="mb-8 scroll-mt-20">
          <h2 className="mb-1 font-display text-lg font-bold"><RichText>{ctaSection}</RichText></h2>
          <p className="mb-4 text-sm text-muted-foreground">Escolha a sua porta. O conteúdo de cada Academia só é revelado dentro da página dela.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activePlans.map((plan) => {
              const appRow = appBySlug.get(plan.slug);
              const sub = mySubs.find((s) => s.plan_slug === plan.slug);
              const subscribed = !!sub && (sub.status === "active" || sub.status === "trial");
              const inTrial = !!sub && sub.status === "trial";
              const slug = plan.slug;
              const isMentalHealth = slug === "suporte-tecnico";
              const cardStyle: React.CSSProperties = isMentalHealth
                ? { background: "linear-gradient(135deg, #fffef0 0%, #fff9b8 52%, #fff176 100%)", color: "#422006" }
                : { backgroundColor: appRow?.bg_color ?? "#F3F4F6", color: appRow?.fg_color ?? "#111827" };

              if (isMentalHealth) {
                return (
                  <Link
                    key={plan.id}
                    to="/trilha/$slug"
                    params={{ slug }}
                    className="group relative col-span-1 flex min-h-[250px] overflow-hidden rounded-3xl border-2 border-yellow-300 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:col-span-2 md:min-h-[270px]"
                    style={cardStyle}
                  >
                    <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-yellow-300/40 blur-3xl transition-transform duration-500 group-hover:scale-125" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-95 transition-transform duration-500 group-hover:scale-105 md:right-10">
                      <svg width="150" height="190" viewBox="0 0 150 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Laço amarelo de conscientização e prevenção do suicídio">
                        <path d="M69 12C42 25 25 48 25 77C25 108 47 126 70 143C90 158 105 170 105 181" stroke="#F4C400" strokeWidth="25" strokeLinecap="round" />
                        <path d="M81 12C108 25 125 48 125 77C125 108 103 126 80 143C60 158 45 170 45 181" stroke="#FFE45C" strokeWidth="25" strokeLinecap="round" />
                        <path d="M69 12C42 25 25 48 25 77C25 108 47 126 70 143C90 158 105 170 105 181" stroke="#DCA900" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
                        <path d="M81 12C108 25 125 48 125 77C125 108 103 126 80 143C60 158 45 170 45 181" stroke="#FFF2A6" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                      </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl pr-20 md:pr-36">
                      <span className="mb-3 inline-flex rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-950">GRÁTIS • ACESSO PERMANENTE</span>
                      <h3 className="font-display text-2xl font-black tracking-tight text-yellow-950 md:text-3xl">🎗️ Academia de Saúde Mental</h3>
                      <p className="mt-2 text-sm font-black uppercase leading-relaxed text-yellow-950 md:text-base">SETEMBRO · OUTUBRO AMARELO — PREVENÇÃO AO SUICÍDIO</p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-yellow-900 md:text-base">Um espaço de acolhimento, fortalecimento e cuidado para quem vive a enfermagem.</p>
                      <span className="mt-5 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-yellow-950 shadow-md transition-transform group-hover:translate-x-1">Acessar gratuitamente →</span>
                    </div>
                  </Link>
                );
              }

              return (
                <div key={plan.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={cardStyle} data-app={slug}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
                  <div className="relative mb-3 flex items-center gap-3">
                    <span className="text-4xl transition-transform duration-500 group-hover:scale-110">{appRow?.emoji ?? "🚪"}</span>
                    <h3 className="font-display text-lg font-black tracking-tight">{plan.name}</h3>
                  </div>
                  <PlanSlogan slug={slug} />
                  <div className="relative mb-4 flex items-start gap-2 rounded-xl bg-black/5 p-2">
                    <span className="mt-0.5">🔒</span>
                    <p className="text-[10px] font-bold leading-tight opacity-80">CONTEÚDO PREMIUM EXCLUSIVO: Os módulos só podem ser visualizados por assinantes ou após clicar em descobrir.</p>
                  </div>
                  <div className="relative mt-auto space-y-2 pt-4">
                    {subscribed ? (
                      <>
                        <Link to="/trilha/$slug" params={{ slug }} className="block w-full scale-100 rounded-xl bg-foreground py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-transform active:scale-95 hover:scale-[1.02]">Acessar Agora →</Link>
                        <span className="block w-full rounded-xl bg-white/40 py-2 text-center text-xs font-bold">{inTrial ? `🎁 Trial ativo · até ${new Date(sub!.expires_at).toLocaleDateString("pt-BR")}` : "✓ Assinatura ativa"}</span>
                      </>
                    ) : (
                      <Link to="/planos/$slug" params={{ slug }} className="group/btn block w-full scale-100 rounded-xl bg-foreground py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-all active:scale-95 hover:scale-[1.02] hover:shadow-black/20">
                        <span className="inline-block transition-transform group-hover/btn:translate-x-1">Descobrir Conteúdo →</span>
                      </Link>
                    )}
                    <p className="text-center text-[11px] font-extrabold tracking-wide text-emerald-700"><RichText>{compraSegura}</RichText></p>
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
  return <p className="mb-2 text-xs font-extrabold uppercase tracking-wide"><RichText>{txt}</RichText></p>;
}
