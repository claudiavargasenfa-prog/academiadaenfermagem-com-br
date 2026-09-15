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
  const activePlans = (plansQ.data ?? []).filter((p) => p.is_active && isBasePlanSlug(p.slug)).slice().sort((a, b) => {
    if (lojaSortMode === "alpha") return a.name.localeCompare(b.name, "pt-BR");
    return ((a as any).sort_order ?? 0) - ((b as any).sort_order ?? 0);
  });
  const mySubs = mySubsQ.data ?? [];
  const freeMentalHealthApp = appBySlug.get("suporte-tecnico");
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

      {/* Academia de Saúde Mental: sempre em primeiro lugar na Loja e com acesso gratuito permanente. */}
      {freeMentalHealthApp && (
        <section className="mb-8 scroll-mt-20" aria-labelledby="academia-saude-mental">
          <Link
            to="/app/$slug"
            params={{ slug: freeMentalHealthApp.slug }}
            className="group relative block overflow-hidden rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-300/30 blur-3xl transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 shadow-md" aria-label="Laço amarelo — conscientização e prevenção do suicídio">
              <span className="text-3xl" role="img" aria-hidden="true">🎗️</span>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[245px] w-[205px] md:block" aria-hidden="true">
              <svg viewBox="0 0 205 245" className="h-full w-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mentalHair" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3f2b20" />
                    <stop offset="1" stopColor="#17110d" />
                  </linearGradient>
                  <linearGradient id="mentalSkin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f5c9aa" />
                    <stop offset="1" stopColor="#d99a78" />
                  </linearGradient>
                  <linearGradient id="mentalUniform" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
                <ellipse cx="139" cy="237" rx="62" ry="8" fill="#b45309" opacity="0.12" />
                <path d="M94 73c-5-27 12-54 43-57 29-3 50 17 50 47 0 18-7 31-19 42l-53 5c-11-9-18-21-21-37Z" fill="url(#mentalHair)" />
                <path d="M112 72c0-22 13-39 32-42 19-3 33 11 34 31 1 23-9 43-31 46-19 2-34-13-35-35Z" fill="url(#mentalSkin)" />
                <path d="M121 64c9-11 21-17 36-16 10 1 18 6 23 14-2-18-14-31-32-32-19-1-32 11-36 29 3 2 6 3 9 5Z" fill="url(#mentalHair)" />
                <circle cx="132" cy="74" r="2.1" fill="#4b3028" />
                <circle cx="160" cy="72" r="2.1" fill="#4b3028" />
                <path d="M140 91c7 5 14 5 20-1" fill="none" stroke="#9b5d51" strokeWidth="2" strokeLinecap="round" />
                <path d="M121 104c8 8 24 11 37 5l6 17-24 15-25-14Z" fill="url(#mentalSkin)" />
                <path d="M90 238c1-55 12-91 40-106l22 15 24-17c31 14 42 53 43 108Z" fill="url(#mentalUniform)" />
                <path d="M130 132l22 17-10 25-25-25Z" fill="#d1d5db" opacity="0.9" />
                <path d="M153 149l-9 25 21-24Z" fill="#f3f4f6" />
                <path d="M171 155c9 14 14 33 18 54" fill="none" stroke="#111827" strokeWidth="3" />
                <path d="M171 155c-5 13-6 28-4 45" fill="none" stroke="#111827" strokeWidth="3" />
                <path d="M167 199c0 8 5 15 12 17 7 2 13-1 15-7" fill="none" stroke="#111827" strokeWidth="3" />
                <path d="M110 157c-14 18-24 34-34 50-5 8-14 10-22 5l-3-2c-8-5-11-14-6-22l31-53c5-8 15-11 24-7Z" fill="url(#mentalUniform)" />
                <path d="M51 207c-7-4-13-4-19 0l-9 7c-4 3-4 9 0 12l4 2c4 3 9 2 12-1l9-8 12 1c6 1 10-4 9-9-1-4-5-6-9-6Z" fill="url(#mentalSkin)" />
                <path d="M47 208c5-5 12-5 18-1" fill="none" stroke="#c48769" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative max-w-3xl pr-16 md:pr-40">
              <span className="mb-3 inline-flex rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-950">GRÁTIS • ACESSO PERMANENTE</span>
              <h2 id="academia-saude-mental" className="font-display text-2xl font-black tracking-tight text-yellow-950 md:text-3xl">Academia de Saúde Mental</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-yellow-900 md:text-base">Um espaço de acolhimento, fortalecimento e cuidado para quem vive a enfermagem, com conteúdos para apoiar a saúde mental e o bem-estar profissional.</p>
              <span className="mt-5 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-yellow-950 shadow-md transition-transform group-hover:translate-x-1">Acessar gratuitamente →</span>
            </div>
          </Link>
        </section>
      )}

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
              const cardStyle: React.CSSProperties = { backgroundColor: appRow?.bg_color ?? "#F3F4F6", color: appRow?.fg_color ?? "#111827" };
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
