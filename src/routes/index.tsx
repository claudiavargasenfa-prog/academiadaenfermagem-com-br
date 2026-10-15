import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import { fetchSubscriptionPlans, fetchMyActiveSubscriptions, formatPriceBRL } from "@/lib/access";
import { useApps } from "@/lib/apps";
import { isBasePlanSlug } from "@/lib/plan-slugs";
import { RichText, useText } from "@/lib/app-texts";
import { FeedbackCollector } from "@/components/FeedbackCollector";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia da Enfermagem | SAE e PE automatizados" },
      { name: "description", content: "Academia da Enfermagem: Módulos de Decisão Clínica e Motores Clínicos Automatizados para estudantes de técnico, técnicos, acadêmicos e enfermeiros. Acesso anual." },
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
      <section className="relative mb-8 overflow-hidden rounded-3xl border-2 border-amber-500 bg-[#0B0F19] p-6 text-white shadow-2xl md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-amber-500 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-400">Acesso Completo por 365 Dias · Pagamento Único</p>
            <h1 className="font-display text-3xl font-black leading-tight md:text-5xl">Domine o Plantão Sem Errar, Sem Levar Advertência e Sem Enlouquecer com sua Escala.</h1>
            <p className="mt-4 max-w-xl text-sm opacity-85 md:text-base">A plataforma inteligente com motores de decisão clínica e cálculos de gotejamento automáticos para apoiar sua rotina e ajudar você a organizar melhor os plantões.</p>
            <a href="#aplicativos" className="mt-6 inline-block rounded-2xl bg-emerald-500 px-6 py-4 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-xl transition-transform hover:scale-105 [animation:pulse_2.5s_ease-in-out_infinite] md:px-9 md:py-5 md:text-base">QUERO ACESSO ANUAL IMEDIATO<span className="block text-[11px] font-bold normal-case opacity-90">A partir de R$ 0,10 por dia</span></a>
          </div>
          <img src={mascotesAsset.url} alt="Mascotes Academia da Enfermagem" className="mx-auto h-40 w-auto object-contain md:h-56" />
        </div>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["🧠", "Motores de Conduta Rápida", "Decisão clínica guiada, passo a passo, no meio do plantão."],
            ["💉", "Cálculos em Segundos", "Gotejamento, diluições e dose por peso sem erro."],
            ["📘", "Diário de Bordo em ABNT", "Prévia do seu relatório pronta para estágio e horas complementares."],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl border border-amber-500/40 bg-white/5 p-4">
              <p className="text-2xl">{i}</p>
              <p className="mt-1 font-black text-emerald-300">{t}</p>
              <p className="text-xs opacity-80">{d}</p>
            </div>
          ))}
        </div>
        <p className="relative mt-6 text-center text-xs opacity-75"><RichText>{homeDesc}</RichText> · Certificado de conclusão em cada módulo.</p>
      </section>
      <h2 className="sr-only"><RichText>{homeTitle}</RichText></h2>

      {activePlans.length > 0 && (
        <section id="aplicativos" className="mb-8 scroll-mt-20">
          <h2 className="mb-1 font-display text-lg font-bold"><RichText>{ctaSection}</RichText></h2>
          <p className="mb-4 text-sm text-muted-foreground">Escolha a sua porta. O conteúdo de cada Academia só é revelado dentro da página dela.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activePlans.map((plan) => {
              const appRow = appBySlug.get(plan.slug);
              const sub = mySubs.find((s) => s.plan_slug === plan.slug);
              const subscribed = !!sub && sub.status === "active";
              const inTrial = !!sub && sub.status === "trial";
              const slug = plan.slug;
              const isMentalHealth = slug === "suporte-tecnico";
              const accent = appRow?.bg_color ?? "#F59E0B";

              if (isMentalHealth) {
                return (
                  <Link
                    key={plan.id}
                    to="/trilha/$slug"
                    params={{ slug }}
                    className="group relative col-span-1 flex min-h-[250px] overflow-hidden rounded-3xl border-2 border-yellow-300 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:col-span-2 md:min-h-[270px]"
                    style={{ background: "linear-gradient(135deg, #fffef0 0%, #fff9b8 52%, #fff176 100%)", color: "#422006" }}
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
                      <span className="mb-3 inline-flex rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-950">ACESSO EXCLUSIVO</span>
                      <h3 className="font-display text-2xl font-black tracking-tight text-yellow-950 md:text-3xl">🎗️ Academia de Saúde Mental</h3>
                      <p className="mt-2 text-sm font-black uppercase leading-relaxed text-yellow-950 md:text-base">SETEMBRO · OUTUBRO AMARELO — PREVENÇÃO AO SUICÍDIO</p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-yellow-900 md:text-base">Um espaço de acolhimento, fortalecimento e cuidado para quem vive a enfermagem.</p>
                      <span className="mt-5 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-yellow-950 shadow-md transition-transform group-hover:translate-x-1">Acessar gratuitamente →</span>
                    </div>
                  </Link>
                );
              }

              return (
                <div key={plan.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-app={slug}>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
                  <div className="relative mb-3 flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `color-mix(in oklab, ${accent} 16%, transparent)` }}>{appRow?.emoji ?? "🚪"}</span>
                    <h3 className="font-display pt-0.5 text-base font-black leading-snug tracking-tight">{plan.name}</h3>
                  </div>
                  <PlanSlogan slug={slug} />
                  {["academico","tecnico","tecnico-estudante","enfermeiro"].includes(slug) && (
                    <p className="mt-3 inline-flex w-fit items-baseline gap-1 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xl font-black text-foreground">
                      {formatPriceBRL(plan.price_cents)}<span className="text-[11px] font-bold text-muted-foreground">/ano</span>
                    </p>
                  )}
                  <p className="mt-3 text-[11px] font-semibold leading-tight text-muted-foreground">🔒 Conteúdo exclusivo para membros · Certificado de conclusão em cada módulo</p>
                  <div className="relative mt-auto space-y-2 pt-4">
                    {subscribed ? (
                      <>
                        <Link to="/trilha/$slug" params={{ slug }} className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-transform active:scale-95 hover:scale-[1.02]">Acessar agora →</Link>
                        <span className="block text-center text-xs font-bold text-primary">{inTrial ? `🎁 Trial ativo · até ${new Date(sub?.expires_at ?? "").toLocaleDateString("pt-BR")}` : "✓ Acesso ativo"}</span>
                      </>
                    ) : (
                      <Link to="/planos/$slug" params={{ slug }} className="group/btn block w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-center text-sm font-black uppercase tracking-wider text-background shadow-lg transition-all active:scale-95 hover:scale-[1.02]">
                        <span className="inline-block transition-transform group-hover/btn:translate-x-1">Descobrir conteúdo →</span>
                      </Link>
                    )}
                    <p className="text-center text-[11px] font-extrabold tracking-wide text-emerald-600"><RichText>{compraSegura}</RichText></p>
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

