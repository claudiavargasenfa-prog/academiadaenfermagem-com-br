import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { fetchSubscriptionPlans, fetchMyActiveSubscriptions, formatPriceBRL } from "@/lib/access";
import { useApps } from "@/lib/apps";
import { isBasePlanSlug } from "@/lib/plan-slugs";
import { RichText, useText } from "@/lib/app-texts";
import { FeedbackCollector } from "@/components/FeedbackCollector";
import { useState } from "react";

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
  const [activeSolution, setActiveSolution] = useState(0);
  const solutionTabs = [
    { label: "Prática Clínica", title: "Motores de Conduta", description: "Guia passo a passo de conduta rápida e tomada de decisão clínica segura no meio do plantão.", mark: "01" },
    { label: "Cálculos Automáticos", title: "Calculadoras de Bolso", description: "Gotejamento de macro e microgotas, diluições e dosagens calculadas em segundos.", mark: "02" },
    { label: "Gestão de Escalas", title: "Escala Inteligente de Plantão — EIP", description: "Um assistente para apoiar a organização de múltiplos vínculos, o planejamento das escalas e a rotina profissional de plantão.", mark: "03" },
    { label: "Diário de Estágio", title: "Relatórios Práticos", description: "Prévia do seu relatório de estágio gerada rapidamente com base nas normas ABNT.", mark: "04" },
    { label: "SAE & PE", title: "Sistematização da Assistência de Enfermagem", description: "Conheça recursos de apoio à SAE e ao Processo de Enfermagem para organizar o raciocínio clínico e estruturar etapas da assistência.", mark: "05" },
    { label: "Anotações & Relatórios", title: "Registros de Enfermagem", description: "Organize anotações e relatórios da rotina assistencial com mais clareza, padronização e praticidade.", mark: "06" },
  ];

  return (
    <AppShell hideReferences publicRoute>
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-400/50 bg-[#02090D] p-5 text-white shadow-2xl md:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 top-8 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] top-12 h-72 w-72 rounded-full border-2 border-emerald-400/50 shadow-[0_0_55px_rgba(16,185,129,0.65)] md:right-[17%]" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-20 w-2/3 rounded-full bg-emerald-400/30 blur-2xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full border border-amber-400 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-amber-400">Acesso completo por 365 dias · Pagamento único</p>
            <h1 className="font-display text-3xl font-black leading-[1.08] md:text-4xl lg:text-5xl">Domine o Plantão <span className="text-emerald-300">Sem Errar, Sem Levar Advertência</span> e Sem Enlouquecer com sua Escala.</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-200 md:text-base">A plataforma inteligente com motores de decisão clínica e cálculos de gotejamento automáticos para apoiar sua rotina e ajudar você a organizar melhor os plantões.</p>
            <a href="#aplicativos" className="mt-6 inline-flex w-full max-w-xl items-center justify-center gap-3 rounded-2xl border border-emerald-100/80 bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-100 px-5 py-4 text-center text-sm font-black uppercase tracking-wide text-emerald-950 shadow-[0_0_18px_rgba(52,211,153,0.85),0_0_45px_rgba(16,185,129,0.45)] transition-transform hover:scale-[1.02] md:py-5 md:text-base">
              <span className="text-xl text-emerald-700">↯</span><span>QUERO ACESSO ANUAL IMEDIATO<span className="block text-[11px] font-bold normal-case tracking-normal text-emerald-800">A partir de R$ 0,10 por dia</span></span><span className="text-2xl text-emerald-700">→</span>
            </a>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-amber-300/90">
              <span aria-label="5 estrelas" className="text-sm tracking-[0.12em] text-amber-400">★★★★★</span>
              <span className="text-slate-200">Aprovado por profissionais e estudantes de enfermagem</span>
            </div>
          </div>
          <div className="relative mx-auto flex min-h-[340px] w-full max-w-[490px] items-center justify-center md:min-h-[440px]">
            <div className="pointer-events-none absolute inset-5 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative z-10 w-[min(72%,270px)] rotate-[-5deg] rounded-[2.7rem] border-[5px] border-slate-500 bg-black p-2 shadow-[0_0_0_2px_#111827,0_0_40px_rgba(16,185,129,0.35)]">
              <div className="overflow-hidden rounded-[2.1rem] border border-slate-700 bg-[#06121B]">
                <div className="flex items-center justify-between px-4 pt-3 text-[9px] font-bold text-white"><span>9:41</span><span>● ▮ ▰</span></div>
                <div className="flex items-center justify-between px-3 py-4"><div><p className="text-[10px] font-black text-amber-400">Academia da</p><p className="text-[10px] font-black text-amber-400">Enfermagem</p></div><span className="text-emerald-300">☰</span></div>
                <div className="mx-2 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-800 to-slate-900 p-3"><p className="text-xs font-bold text-white">Olá, profissional!</p><p className="mt-1 text-[9px] leading-relaxed text-emerald-100">Conhecimento técnico para uma rotina mais segura.</p></div>
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="rounded-xl border border-emerald-400/60 bg-emerald-800/80 p-2"><p className="text-lg text-emerald-200">⌁</p><p className="text-[9px] font-bold leading-tight text-white">Motores de<br/>Decisão Clínica</p></div>
                  <div className="rounded-xl border border-violet-400/60 bg-violet-900/80 p-2"><p className="text-lg text-violet-200">▦</p><p className="text-[9px] font-bold leading-tight text-white">Cálculos em<br/>Segundos</p></div>
                  <div className="rounded-xl border border-amber-400/60 bg-amber-800/80 p-2"><p className="text-lg text-amber-100">滴</p><p className="text-[9px] font-bold leading-tight text-white">Gotejamento<br/>Automático</p></div>
                  <div className="rounded-xl border border-sky-400/60 bg-sky-900/80 p-2"><p className="text-lg text-sky-200">▤</p><p className="text-[9px] font-bold leading-tight text-white">Protocolos e<br/>Diretrizes</p></div>
                </div>
                <div className="px-3 pb-2"><p className="mb-2 text-[10px] font-bold text-white">Meus Plantões</p><div className="rounded-lg border border-emerald-400/20 bg-slate-800 p-2 text-[9px] text-slate-200">Hoje · 07:00 às 19:00</div><div className="mt-2 rounded-lg border border-emerald-400/20 bg-slate-800 p-2 text-[9px] text-slate-200">Amanhã · 19:00 às 07:00</div></div>
                <div className="flex justify-around border-t border-slate-700 bg-black/60 px-2 py-3 text-[8px] text-emerald-300"><span>⌂ Início</span><span>∿ Simulador</span><span>▤ Conteúdos</span></div>
              </div>
            </div>
            <div className="absolute right-0 top-[17%] z-0 w-[39%] rotate-[7deg] rounded-[2rem] border-4 border-slate-600 bg-black p-2 opacity-90 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
              <div className="rounded-[1.5rem] bg-[#071521] p-3 text-white">
                <p className="mb-4 text-[10px] font-black text-white">Cálculo de Gotejamento</p><p className="text-[8px] text-slate-400">Solução · SF 0,9%</p><div className="my-2 rounded-lg bg-slate-800 p-2 text-[9px]">Volume (mL) <b className="block text-white">500</b></div><div className="rounded-lg bg-slate-800 p-2 text-[9px]">Tempo (horas) <b className="block text-white">8</b></div><div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-900/40 p-3 text-center"><p className="text-[8px] text-emerald-300">Velocidade de infusão</p><p className="text-lg font-black text-white">62,5</p><p className="text-[9px] text-emerald-200">mL/hora</p></div><div className="mt-3 rounded-lg bg-emerald-500 py-2 text-center text-[9px] font-black text-emerald-950">Calcular</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["⌁", "Motores de Conduta Rápida", "Decisão clínica guiada, passo a passo, no meio do plantão."],
            ["▦", "Cálculos em Segundos", "Gotejamento, diluições e dose por peso."],
            ["▤", "Diário de Bordo em ABNT", "Prévia do relatório para estágio e horas complementares."],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl border border-emerald-400/40 bg-slate-950/75 p-4 shadow-[0_0_18px_rgba(16,185,129,0.08)]">
              <p className="text-2xl text-emerald-300">{i}</p>
              <p className="mt-1 font-black text-emerald-300">{t}</p>
              <p className="text-xs text-slate-200/85">{d}</p>
            </div>
          ))}
        </div>
        <p className="relative mt-6 text-center text-xs text-slate-300/80"><RichText>{homeDesc}</RichText></p>
        <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-center shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <span className="text-lg text-emerald-300" aria-hidden="true">✦</span>
          <p className="text-sm font-extrabold text-emerald-200 md:text-base">Certificado de conclusão em cada módulo</p>
        </div>
      </section>
      <h2 className="sr-only"><RichText>{homeTitle}</RichText></h2>


      <section className="mb-10 overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#06121B] p-5 text-white shadow-[0_0_30px_rgba(16,185,129,0.08)] md:p-8">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Conheça as soluções</p>
          <h2 className="mt-2 font-display text-2xl font-black md:text-3xl">Tudo o que acompanha sua rotina na enfermagem</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Explore cada solução e veja como ela pode apoiar seus estudos, a organização e a prática profissional.</p>
        </div>
        <div role="tablist" aria-label="Soluções da Academia da Enfermagem" className="flex gap-2 overflow-x-auto border-b border-emerald-400/20 pb-3">
          {solutionTabs.map((tab, index) => (
            <button key={tab.mark} type="button" role="tab" id={"solution-tab-" + index} aria-selected={activeSolution === index} aria-controls="solution-panel" onClick={() => setActiveSolution(index)} className={"shrink-0 rounded-xl border px-4 py-3 text-left text-xs font-extrabold transition-all md:text-sm " + (activeSolution === index ? "border-emerald-300 bg-emerald-300 text-emerald-950 shadow-[0_0_18px_rgba(52,211,153,0.25)]" : "border-slate-700 bg-slate-900/70 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-200")}>
              {tab.label}
            </button>
          ))}
        </div>
        <div id="solution-panel" role="tabpanel" aria-labelledby={"solution-tab-" + activeSolution} className="relative mt-5 overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/70 via-slate-950 to-[#071521] p-5 md:p-7">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/40 bg-emerald-300/10 text-lg font-black text-emerald-300">{solutionTabs[activeSolution].mark}</div>
            <div>
              <h3 className="font-display text-xl font-black text-emerald-200 md:text-2xl">{solutionTabs[activeSolution].title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">{solutionTabs[activeSolution].description}</p>
            </div>
          </div>
        </div>
      </section>


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

