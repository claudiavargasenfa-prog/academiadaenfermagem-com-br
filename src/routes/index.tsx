import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { AppShell, Card } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";
import logoAsset from "@/assets/logo.png.asset.json";
import imgManual from "@/assets/carousel/manual.jpg";
import imgCalculos from "@/assets/carousel/calculos.jpg";
import imgRelatorio from "@/assets/carousel/relatorio.jpg";
import imgExame from "@/assets/carousel/exame.jpg";
import imgIras from "@/assets/carousel/iras.jpg";
import {
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
  formatPriceBRL,
  TRACKS,
  type TrackSlug,
} from "@/lib/access";
import { RichText, useText } from "@/lib/app-texts";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Academia de Enfermagem: 3 trilhas de mini apps para acadêmicos, técnicos e enfermeiros. 30 dias grátis.",
      },
    ],
  }),
  component: StoreHome,
});



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


  const homeTitle = useText("home.title", "Academia de Enfermagem");
  const homeDesc = useText("home.description", "Três aplicativos, uma só academia.");
  const ctaSection = useText("home.cta_section", "Assine um aplicativo · acesso ilimitado");
  const compraSegura = useText("compra.segura", "🔒 COMPRA SEGURA");
  const migracaoBanner = useText("migracao.banner", "**MIGRE PARA OUTRO APP E GANHE 15% DE DESCONTO POR 3 MESES**");

  return (
    <AppShell>
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">Loja</p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl"><RichText>{homeTitle}</RichText></h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base"><RichText>{homeDesc}</RichText></p>
      </div>

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
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> 3 aplicativos: Acadêmico, Técnico e Enfermeiro</li>
                <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Sem cartão para começar</li>
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href="#aplicativos" className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary shadow hover:brightness-110">
                  <Zap className="h-4 w-4" /> Ver aplicativos
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
        <section id="aplicativos" className="mb-8 scroll-mt-20">
          <h2 className="mb-3 font-display text-lg font-bold"><RichText>{ctaSection}</RichText></h2>
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
              const slogan = (plansQ.data && (plansQ as any)) ? "" : "";
              void slogan;
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
                  data-app={slug}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{track?.emoji}</span>
                    <h3 className="font-display text-base font-extrabold">{plan.name}</h3>
                  </div>
                  <PlanSlogan slug={slug} />
                  {plan.description && (
                    <p className="text-xs opacity-80">{plan.description}</p>
                  )}

                  <div className="mt-3">
                    {isMigracao && priceFrom ? (
                      <>
                        <p className="text-xs font-bold uppercase opacity-80"><RichText>{migracaoBanner}</RichText></p>
                        <p className="mt-1 text-sm font-semibold opacity-70 line-through">De {formatPriceBRL(priceFrom)}</p>
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
                      Ver mini apps →
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

function PlanSlogan({ slug }: { slug: TrackSlug }) {
  const txt = useText(`aplicativo.${slug}.slogan`, "");
  if (!txt.trim()) return null;
  return (
    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide">
      <RichText>{txt}</RichText>
    </p>
  );
}


