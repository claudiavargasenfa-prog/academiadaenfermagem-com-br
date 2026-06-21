import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Lock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Calculator,
  Activity,
  Baby,
  HeartPulse,
  ShieldCheck,
  HandHeart,
  GraduationCap,
  FileText,
  BookOpen,
  Bandage,
  FlaskConical,
  Brain,
  Hourglass,
  Check,
  Zap,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";
import logoAsset from "@/assets/logo.png.asset.json";
import imgManual from "@/assets/carousel/manual.jpg";
import imgCalculos from "@/assets/carousel/calculos.jpg";
import imgRelatorio from "@/assets/carousel/relatorio.jpg";
import imgExame from "@/assets/carousel/exame.jpg";
import imgIras from "@/assets/carousel/iras.jpg";
import {
  fetchMiniApps,
  fetchMyExtraAccess,
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
  formatPriceBRL,
  daysUntil,
  summarizeExtras,
  appTracks,
  TRACKS,
  type MiniApp,
  type TrackSlug,
} from "@/lib/access";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Loja Academia de Enfermagem: 1 mini app grátis + cursos práticos para o estágio. Acesso por 150 dias.",
      },
    ],
  }),
  component: StoreHome,
});

const SLUG_ICON: Record<string, typeof Stethoscope> = {
  "manual-sobrevivencia": BookOpen,
  "postura-etica": GraduationCap,
  "sinais-vitais": Activity,
  iras: HandHeart,
  seguranca: ShieldCheck,
  "exame-fisico-escalas": Stethoscope,
  medicamentosecalculos: Calculator,
  "sv-pediatrico": Baby,
  "sv-gestante": HeartPulse,
  curativos: Bandage,
  acls: HeartPulse,
  uti: Activity,
  "farmacologia-avancada": FlaskConical,
  "saude-mental": Brain,
  "relatorio-abnt": FileText,
};

const SLIDES = [
  { eyebrow: "Grátis para começar", title: "Manual de Sobrevivência do Estágio", desc: "Checklist da mochila, postura no campo e comunicação com o preceptor.", bg: "from-sky-100 to-cyan-100", accent: "text-sky-900", img: imgManual },
  { eyebrow: "Mais vendido", title: "Cálculos de Medicamentos", desc: "Regra de três, gotejamento e dose/peso com checagem de segurança.", bg: "from-teal-100 to-emerald-50", accent: "text-teal-900", img: imgCalculos },
  { eyebrow: "Lançamento", title: "Relatório de Estágio (ABNT)", desc: "Gera automaticamente a partir do seu Diário de Bordo.", bg: "from-blue-100 to-violet-100", accent: "text-indigo-900", img: imgRelatorio },
  { eyebrow: "Combo clínico", title: "Exame Físico + Escalas", desc: "Cefalocaudal + Glasgow, Braden, Morse e mais.", bg: "from-emerald-50 to-cyan-100", accent: "text-emerald-900", img: imgExame },
  { eyebrow: "Segurança do paciente", title: "IRAS + 6 Metas Internacionais", desc: "Higienização das mãos e protocolos visuais para o plantão.", bg: "from-cyan-50 to-sky-100", accent: "text-cyan-900", img: imgIras },
] as const;

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
          <img src={slide.img} alt="" loading="lazy" width={896} height={896} className="hidden h-32 w-32 shrink-0 rounded-2xl object-cover sm:block md:h-40 md:w-40" />
        </div>
      </div>
    </section>
  );
}


function StoreHome() {
  const [estagio] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });

  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const mySubsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });

  const activePlans = (plansQ.data ?? []).filter((p) => p.is_active);
  const mySubs = mySubsQ.data ?? [];
  const hasAnyOtherTrack = (slug: string) =>
    mySubs.some((s) => s.plan_slug !== slug && s.status !== "trial");


  return (
    <AppShell>
      <PageHeader
        eyebrow="Loja"
        title="Academia de Enfermagem"
        description="Três trilhas, uma só academia. Assine a sua e libere todos os mini apps da trilha; ou compre mini apps avulsos com 150 dias de acesso."
      />

      <Carousel />

      {/* 1) Banner verde escuro + Meu estagio */}
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-gold/40 bg-primary p-5 text-primary-foreground shadow-[var(--shadow-glass)] md:col-span-2">
          <div className="flex items-start gap-3">
            <img src={logoAsset.url} alt="Logotipo Academia de Enfermagem" className="h-12 w-12 shrink-0 rounded-xl bg-white/10 object-contain p-1 ring-1 ring-gold/40" />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                <Zap className="h-3 w-3" /> 30 dias grátis para começar
              </span>
              <h2 className="mt-2 font-display text-xl font-extrabold leading-tight md:text-2xl">
                Chegue no estágio sabendo <span className="text-gold">o que fazer</span> — antes do preceptor perguntar.
              </h2>
              <p className="mt-1.5 text-sm text-primary-foreground/85">
                Mini apps de bolso criados por enfermeira com <strong className="text-gold">35 anos de UTI, ESF e APH</strong>. Conteúdo que cai na prova prática e no plantão.
              </p>

              <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Cálculos, escalas e protocolos em segundos</li>
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Relatório ABNT gerado do seu diário</li>
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> 3 trilhas: Acadêmico, Técnico e Enfermeiro</li>
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Sem cartão para começar</li>
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href="#trilhas" className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary shadow hover:brightness-110">
                  <Zap className="h-4 w-4" /> Ver trilhas
                </a>
              </div>

            </div>
          </div>
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Identificação</p>
          <h3 className="mt-1 font-display text-lg font-bold">Meu estágio</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-muted-foreground">Campo</dt><dd className="font-medium">{estagio.campo || "—"}</dd></div>
            <div><dt className="text-muted-foreground">Preceptor(a)</dt><dd className="font-medium">{estagio.preceptor || "—"}</dd></div>
            <div><dt className="text-muted-foreground">Período</dt><dd className="font-medium">{estagio.periodo || "—"}</dd></div>
          </dl>
          <Link to="/diario" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Editar no Diário
          </Link>
        </Card>
      </section>

      {/* 2) 3 trilhas (cores próprias) */}
      {activePlans.length > 0 && (
        <section id="trilhas" className="mb-8 scroll-mt-20">
          <h2 className="mb-3 font-display text-lg font-bold">Assine uma trilha · acesso ilimitado</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {activePlans.map((plan) => {
              const track = TRACKS.find((t) => t.slug === plan.slug);
              const sub = mySubs.find((s) => s.plan_slug === plan.slug);
              const subscribed = !!sub && sub.status === "active";
              const inTrial = !!sub && sub.status === "trial";
              const isMigracao = hasAnyOtherTrack(plan.slug)
                && !subscribed
                && !!(plan as any).price_promo_migracao_cents
                && !!(plan as any).cakto_link_migracao;

              const priceFrom = (plan as any).price_original_migracao_cents as number | null;
              const pricePromo = (plan as any).price_promo_migracao_cents as number | null;
              const priceNovo = (plan as any).price_novo_cents ?? plan.price_cents;
              const ckLink = isMigracao
                ? (plan as any).cakto_link_migracao
                : ((plan as any).cakto_link_novo || plan.cakto_checkout_url);

              const slug = plan.slug as TrackSlug;
              const cardStyle: React.CSSProperties = {
                backgroundColor:
                  slug === "academico" ? "var(--track-academico-bg)" :
                  slug === "tecnico" ? "var(--track-tecnico-bg)" :
                  slug === "enfermeiro" ? "var(--track-enfermeiro-bg)" : undefined,
                color:
                  slug === "academico" ? "var(--track-academico-fg)" :
                  slug === "tecnico" ? "var(--track-tecnico-fg)" :
                  slug === "enfermeiro" ? "var(--track-enfermeiro-fg)" : undefined,
              };

              return (
                <div
                  key={plan.id}
                  className="flex flex-col rounded-2xl border border-white/40 p-4 shadow-sm"
                  style={cardStyle}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{track?.emoji}</span>
                    <h3 className="font-display text-base font-extrabold">{plan.name}</h3>
                  </div>
                  {plan.description && (
                    <p className="text-xs opacity-80">{plan.description}</p>
                  )}

                  <div className="mt-3">
                    {isMigracao && priceFrom ? (
                      <>
                        <p className="text-xs font-bold uppercase opacity-70">Oferta de migração</p>
                        <p className="text-sm font-semibold opacity-70 line-through">De {formatPriceBRL(priceFrom)}</p>
                        <p className="text-2xl font-extrabold">
                          Por {formatPriceBRL(pricePromo!)}<span className="text-xs font-normal opacity-70">/mês</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-extrabold">
                        {formatPriceBRL(priceNovo)}<span className="text-xs font-normal opacity-70">/mês</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <Link
                      to="/trilha/$slug"
                      params={{ slug }}
                      className="block w-full rounded-xl bg-white/70 py-2 text-center text-sm font-bold hover:bg-white"
                    >
                      Ver mini apps da trilha →
                    </Link>
                    {subscribed ? (
                      <span className="block w-full rounded-xl bg-white/40 py-2 text-center text-xs font-bold">
                        ✓ Assinatura ativa
                      </span>
                    ) : inTrial ? (
                      <>
                        <span className="block w-full rounded-xl bg-white/40 py-2 text-center text-xs font-bold">
                          🎁 Trial ativo · até {new Date(sub!.expires_at).toLocaleDateString("pt-BR")}
                        </span>
                        {ckLink && (
                          <a href={ckLink} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-1 rounded-xl bg-foreground py-2 text-sm font-bold text-background">
                            Assinar agora <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </>
                    ) : ckLink ? (
                      <a
                        href={ckLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-1 rounded-xl bg-foreground py-2 text-sm font-bold text-background"
                      >
                        Assinar <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <button disabled className="w-full cursor-not-allowed rounded-xl bg-white/40 py-2 text-sm font-semibold opacity-60">
                        Em breve
                      </button>
                    )}
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

