import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { AuthScreen } from "@/components/AuthGate";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import imgManual from "@/assets/carousel/manual.jpg";
import imgCalculos from "@/assets/carousel/calculos.jpg";
import imgRelatorio from "@/assets/carousel/relatorio.jpg";
import imgExame from "@/assets/carousel/exame.jpg";
import imgIras from "@/assets/carousel/iras.jpg";
import {
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
} from "@/lib/access";
import { useApps } from "@/lib/apps";
import { RichText, useText } from "@/lib/app-texts";




export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    cadastro: typeof search.cadastro === "string" ? search.cadastro : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loja — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Academia da Enfermagem: 4 aplicativos de mini apps para acadêmicos, estudantes de técnico, técnicos e enfermeiros. 15 dias grátis.",
      },
      { property: "og:title", content: "Loja — Academia da Enfermagem" },
      {
        property: "og:description",
        content:
          "Conheça os 4 aplicativos da Academia da Enfermagem antes de iniciar seus 15 dias grátis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoreHome,
});



type Slide = {
  eyebrow: string;
  title: string;
  desc: string;
  bg: string;
  accent: string;
  img?: string;
  mascot?: boolean;
};

const SLIDES: Slide[] = [
  { eyebrow: "Grátis para começar", title: "Manual de Sobrevivência do Estágio", desc: "Checklist da mochila, postura no campo e comunicação com o preceptor.", bg: "from-sky-100 to-cyan-100", accent: "text-sky-900", img: imgManual },
  { eyebrow: "Mais vendido", title: "Cálculos de Medicamentos", desc: "Regra de três, gotejamento e dose/peso com checagem de segurança.", bg: "from-teal-100 to-emerald-50", accent: "text-teal-900", img: imgCalculos },
  { eyebrow: "Lançamento", title: "Relatório de Estágio (ABNT)", desc: "Gera automaticamente a partir do seu Diário de Bordo.", bg: "from-blue-100 to-violet-100", accent: "text-indigo-900", img: imgRelatorio },
  { eyebrow: "Combo clínico", title: "Exame Físico + Escalas", desc: "Cefalocaudal + Glasgow, Braden, Morse e mais.", bg: "from-emerald-50 to-cyan-100", accent: "text-emerald-900", img: imgExame },
  { eyebrow: "Segurança do paciente", title: "IRAS + 6 Metas Internacionais", desc: "Higienização das mãos e protocolos visuais para o plantão.", bg: "from-cyan-50 to-sky-100", accent: "text-cyan-900", img: imgIras },
  { eyebrow: "Para enfermeiros", title: "Menos burocracia, mais paciente", desc: "Cansado de perder o plantão preenchendo prontuário? Com 1 clique, a Academia da Enfermagem transforma sua anamnese e exame físico em evolução cefalocaudal em segundos.", bg: "from-emerald-100 to-teal-100", accent: "text-emerald-900" },
  { eyebrow: "Para estudantes", title: "Chega de nervoso com o relatório de estágio", desc: "Anote suas atividades pelo celular durante o dia e baixe as anotações prontas para incluir no relatório acadêmico.", bg: "from-indigo-100 to-sky-100", accent: "text-indigo-900" },
  { eyebrow: "Preço de um lanche", title: "Um ecossistema completo pelo preço de um lanche", desc: "Segurança, calculadoras de medicamentos e raciocínio clínico. Invista na sua educação e profissionalização — todo o app é baseado nas legislações vigentes do COFEN/CORENs.", bg: "from-amber-100 to-orange-100", accent: "text-orange-900" },
  { eyebrow: "100% Atualizado", title: "Segurança Jurídica e Científica para o seu Carimbo", desc: "Construído e revisado com base em COFEN, CORENs, ANVISA, MS e OMS. Base atualizada automaticamente a cada mudança de legislação ou PCDT — estude e plantie amparado pela ciência e pelas leis.", bg: "from-emerald-950 to-emerald-900", accent: "text-amber-100", mascot: true },
];


function Carousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
  const slide = SLIDES[i];
  return (
    <section className="mb-6">
      <div className={`relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${slide.bg} shadow-sm transition-all`}>
        <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
          <div className={`min-w-0 ${slide.accent}`}>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">{slide.eyebrow}</p>
            <h2 className="mt-1 font-display text-xl font-extrabold leading-tight md:text-2xl">{slide.title}</h2>
            <p className="mt-2 max-w-xl text-sm opacity-80">{slide.desc}</p>
            <div className="mt-4 flex items-center gap-3">
              <button aria-label="Slide anterior" onClick={() => setI((x) => (x - 1 + SLIDES.length) % SLIDES.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-current hover:bg-white">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {SLIDES.map((_, n) => (
                  <button key={n} aria-label={`Ir ao slide ${n + 1}`} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-current opacity-80" : "w-2 bg-current opacity-30"}`} />
                ))}
              </div>
              <button aria-label="Próximo slide" onClick={() => setI((x) => (x + 1) % SLIDES.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-current hover:bg-white">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {slide.mascot ? (
            <div className="relative hidden shrink-0 sm:block">
              <img src={mascotesAsset.url} alt="Mascotes" className="h-32 w-32 object-contain md:h-40 md:w-40" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-emerald-950 shadow">100% Atualizado</span>
            </div>
          ) : slide.img ? (
            <img src={slide.img} alt="" loading="lazy" width={896} height={896} className="hidden h-32 w-32 shrink-0 rounded-2xl object-cover sm:block md:h-40 md:w-40" />
          ) : null}
        </div>
      </div>
    </section>
  );
}


function StoreHome() {
  const { cadastro: cadastroSlug } = Route.useSearch();
  const validCadastroSlugs = new Set(["academico", "tecnico", "tecnico-estudante", "enfermeiro"]);
  if (cadastroSlug && validCadastroSlugs.has(cadastroSlug)) {
    return <AuthScreen cadastroSlug={cadastroSlug} />;
  }

  return <StoreHomeContent />;
}

function StoreHomeContent() {
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const mySubsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const appsQ = useApps();
  const appBySlug = new Map((appsQ.data ?? []).map((a) => [a.slug, a]));

  const lojaSortMode = useText("ordenacao.loja", "numeric");
  const activePlans = (plansQ.data ?? [])
    .filter((p) => p.is_active)
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

      <Carousel />

      <div className="mb-8 flex justify-center">
        <img
          src={mascotesAsset.url}
          alt="Mascotes Academia da Enfermagem — Time contra as IRAS"
          className="h-56 w-auto object-contain sm:h-72 md:h-96 [animation:pulse_3s_ease-in-out_infinite]"
        />
      </div>


      {/* 2) Cards dos aplicativos — sem preço, só apresentação + botão "Conhecer" */}
      {activePlans.length > 0 && (
        <section id="aplicativos" className="mb-8 scroll-mt-20">
          <h2 className="mb-3 font-display text-lg font-bold"><RichText>{ctaSection}</RichText></h2>
          <div className="grid gap-3 sm:grid-cols-3">
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
                  className="flex flex-col rounded-2xl border border-white/40 p-4 shadow-sm"
                  style={cardStyle}
                  data-app={slug}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{appRow?.emoji ?? "📱"}</span>
                    <h3 className="font-display text-base font-extrabold">{plan.name}</h3>
                  </div>
                  <PlanSlogan slug={slug} />
                  {plan.description && (
                    <p className="text-xs opacity-80"><RichText>{plan.description}</RichText></p>
                  )}

                  <div className="mt-auto space-y-2 pt-4">
                    {subscribed ? (
                      <>
                        <Link
                          to="/trilha/$slug"
                          params={{ slug }}
                          className="block w-full rounded-xl bg-foreground py-2.5 text-center text-sm font-extrabold text-background shadow hover:opacity-90"
                        >
                          Ver mini apps →
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
                        className="block w-full rounded-xl bg-foreground py-2.5 text-center text-sm font-extrabold text-background shadow hover:opacity-90"
                      >
                        Conhecer este aplicativo →
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


