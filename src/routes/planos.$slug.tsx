import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ExternalLink, ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  fetchMiniApps,
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
  formatPriceBRL,
} from "@/lib/access";
import { fetchAppBySlug, fetchPlacementsForApp } from "@/lib/apps";
import OfertasPeriodo from "@/components/planos/OfertasPeriodo";

import { useAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/components/AuthGate";

const ALLOWED = new Set(["academico", "tecnico", "tecnico-estudante", "enfermeiro"]);

const LABELS: Record<string, string> = {
  academico: "Academia do Acadêmico",
  tecnico: "Academia do Técnico em Enfermagem",
  "tecnico-estudante": "Academia do Estudante de Técnico em Enfermagem",
  enfermeiro: "Academia do Enfermeiro",
};

const DEFAULTS: Record<string, Record<string, string>> = {
  academico: {
    slogan: "Do primeiro estágio ao plantão — com segurança e confiança.",
  },
  tecnico: {
    slogan: "Prática segura, plantão tranquilo.",
  },
  "tecnico-estudante": {
    slogan: "Passa na prova, encara o campo com confiança.",
  },
  enfermeiro: {
    slogan: "Menos burocracia, mais paciente.",
  },
};

const TRIAL_DAYS = 15;

export const Route = createFileRoute("/planos/$slug")({
  head: ({ params }) => {
    const label = LABELS[params.slug] ?? "Academia da Enfermagem";
    const desc = `Conheça a ${label}: mini apps, escalas clínicas, SAE automatizada, quizzes e muito mais. ${TRIAL_DAYS} dias grátis + Grupo VIP no WhatsApp.`;
    return {
      meta: [
        { title: `${label} — Planos | Academia da Enfermagem` },
        { name: "description", content: desc },
        { property: "og:title", content: `${label} — Academia da Enfermagem` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!ALLOWED.has(params.slug)) throw notFound();
    return undefined as never;
  },
  component: PlanoPage,
});

function PlanoPage() {
  const { slug } = Route.useParams();
  const label = LABELS[slug];

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const isLoggedIn = !!session;

  const isAdminQ = useQuery({
    queryKey: ["is_admin", session?.user?.id],
    enabled: isLoggedIn,
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: session!.user.id, _role: "admin" });
      return !!data;
    },
  });
  const isAdmin = !!isAdminQ.data;

  const appQ = useQuery({ queryKey: ["app", slug], queryFn: () => fetchAppBySlug(slug) });
  const placementsQ = useQuery({
    queryKey: ["app_placements", appQ.data?.id],
    enabled: !!appQ.data?.id,
    queryFn: () => fetchPlacementsForApp(appQ.data!.id),
  });
  const miniAppsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions, enabled: isLoggedIn });
  const textsQ = useAppTexts();
  const t = (key: string, fallback: string) => textsQ.data?.[`plano.${slug}.${key}`] ?? fallback;

  const plan = (plansQ.data ?? []).find((p) => p.slug === slug);
  const sub = (subsQ.data ?? []).find((s) => s.plan_slug === slug);
  const subscribed = isAdmin || (!!sub && (sub.status === "active" || sub.status === "trial"));
  const price = (plan as any)?.price_novo_cents ?? (plan as any)?.price_cents ?? 0;
  const checkoutUrl = (plan as any)?.cakto_link_novo || (plan as any)?.cakto_checkout_url || "";
  const bg = appQ.data?.bg_color ?? "#FEF3C7";
  const fg = appQ.data?.fg_color ?? "#78350F";
  const whatsappUrl = (appQ.data as any)?.whatsapp_group_url as string | undefined;

  const placedIds = new Set((placementsQ.data ?? []).map((p) => p.mini_app_id));
  const miniApps = (miniAppsQ.data ?? [])
    .filter((m) => placedIds.has(m.id) && m.is_active !== false);


  const slogan = t("slogan", DEFAULTS[slug]?.slogan ?? "");
  const promoTitle = t("promo_title", "🎁 Promoção de lançamento");
  const promoText = t("promo_text", `${TRIAL_DAYS} dias grátis + Grupo VIP no WhatsApp — válido até 01/10/2026`);
  const ctaFinalTitle = t("cta_final_title", "Pronto para começar?");
  const miniAppsTitle = t("mini_apps_title", "🧩 O que você vai encontrar");

  const faqs = [
    {
      q: t("faq1_q", "Como funciona o período grátis?"),
      a: t("faq1_a", `Você se cadastra e ganha ${TRIAL_DAYS} dias de acesso ao conteúdo, sem precisar informar cartão. No fim do período, é só assinar para continuar.`),
    },
    {
      q: t("faq2_q", "Como entro no Grupo VIP do WhatsApp?"),
      a: t("faq2_a", "Assim que ativar seu acesso, o link do grupo aparece aqui e dentro do app."),
    },
    {
      q: t("faq3_q", "Posso cancelar quando quiser?"),
      a: t("faq3_a", "Sim. A assinatura é mensal e sem fidelidade — você cancela pelo checkout a qualquer momento."),
    },
    {
      q: t("faq4_q", "Funciona offline?"),
      a: t("faq4_a", "Sim. Instale como app no celular (PWA) e a maior parte do conteúdo funciona sem internet, ideal para plantão."),
    },
    {
      q: t("faq5_q", "Recebo atualizações?"),
      a: t("faq5_a", "Sim. Escalas, protocolos e legislações são atualizados mensalmente, sem custo extra."),
    },
  ];

  return (
    <AppShell hideReferences publicRoute>
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar à loja
        </Link>

        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-[2rem] border border-white/70 p-6 shadow-lg md:p-12"
          style={{ backgroundColor: bg, color: fg }}
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: `linear-gradient(135deg, transparent 40%, ${bg} 100%)` }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest shadow-sm backdrop-blur">
              <span className="text-base leading-none">{appQ.data?.emoji ?? "📱"}</span>
              {t("hero_eyebrow", "Academia da Enfermagem")}
            </div>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {t("hero_title", label)}
            </h1>

            <p className="mt-4 max-w-2xl text-base font-medium opacity-90 md:text-xl">
              {slogan}
            </p>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                `✨ ${TRIAL_DAYS} dias grátis`,
                "💳 Sem cartão no cadastro",
                "🚪 Cancele quando quiser",
                "📶 Funciona offline",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-extrabold shadow-sm backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {subscribed ? (
                <Link
                  to="/trilha/$slug"
                  params={{ slug }}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  ✓ Acessar meus mini apps →
                </Link>
              ) : isLoggedIn ? (
                <>
                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
                    >
                      <Sparkles className="h-4 w-4" />
                      Assinar agora
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <a
                    href={`/cadastro/${slug}`}
                    className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
                  >
                    <Sparkles className="h-4 w-4" />
                    Começar meus {TRIAL_DAYS} dias grátis
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </a>
                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-white/70 bg-white/70 px-6 py-3.5 text-sm font-extrabold backdrop-blur transition hover:bg-white"
                    >
                      Já quero assinar <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </>
              )}
            </div>

            {isLoggedIn && !subscribed && (
              <p className="mt-3 max-w-xl rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-emerald-950 backdrop-blur">
                Você já está logada como <strong>{session?.user?.email}</strong>. O período grátis é só para novos cadastros — para liberar este aplicativo, faça a assinatura.
                <button
                  type="button"
                  onClick={() => signOut().then(() => window.location.reload())}
                  className="ml-2 underline hover:text-emerald-700"
                >
                  Sair da conta
                </button>
              </p>
            )}

            <p className="mt-4 text-xs font-semibold opacity-70">
              {t("hero_footnote", "Sem cartão de crédito · Ativa na hora · PIX ou cartão só depois do teste")}
            </p>
          </div>
        </section>

        {/* PROMO BANNER */}
        <section className="mt-4 rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
              {promoTitle}
            </span>
            <p className="text-sm font-bold text-amber-950">
              <strong>{promoText}</strong>
            </p>
          </div>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" /> Entrar no Grupo do WhatsApp
            </a>
          )}
        </section>

        {/* DIFERENCIAIS */}
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: t("dif1_title", "Base COFEN/COREN"), desc: t("dif1_desc", "Conteúdo alinhado com COFEN, CORENs, ANVISA, MS e OMS.") },
            { icon: Wifi, title: t("dif2_title", "Funciona offline (PWA)"), desc: t("dif2_desc", "Instale no celular e use no plantão sem sinal.") },
            { icon: Sparkles, title: t("dif3_title", "Atualizações mensais"), desc: t("dif3_desc", "PCDTs, escalas e legislação sempre em dia.") },
          ].map((d) => (
            <div key={d.title} className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
              <d.icon className="h-5 w-5 text-emerald-700" />
              <p className="mt-2 font-display text-sm font-extrabold">{d.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </section>

        {/* MINI APPS — lista completa */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold">{miniAppsTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {miniApps.length > 0
              ? `${miniApps.length} módulos dentro deste aplicativo:`
              : "Carregando módulos..."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {miniApps.map((m) => (
              <div key={m.id} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.icon ?? "•"}</span>
                  <h3 className="font-display text-sm font-extrabold leading-tight">{m.name}</h3>
                </div>
                {m.description && (
                  <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>


        <OfertasPeriodo slug={slug} isLoggedIn={isLoggedIn} subscribed={subscribed} />


        {/* FAQ */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold">❓ Dúvidas frequentes</h2>
          <div className="mt-4 space-y-2">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur open:bg-white"
              >
                <summary className="cursor-pointer list-none font-display text-sm font-extrabold marker:hidden">
                  <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
                  {f.q}
                </summary>
                <p className="mt-2 pl-6 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          className="mt-10 rounded-3xl border border-white/60 p-6 text-center shadow-sm md:p-8"
          style={{ backgroundColor: bg, color: fg }}
        >
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">{ctaFinalTitle}</h2>
          <p className="mt-2 text-sm opacity-80">
            {formatPriceBRL(price)}/mês · {TRIAL_DAYS} dias grátis · cancele quando quiser
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {subscribed ? (
              <Link
                to="/trilha/$slug"
                params={{ slug }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow hover:opacity-90"
              >
                Acessar mini apps →
              </Link>
            ) : isLoggedIn ? (
              checkoutUrl && (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow hover:opacity-90"
                >
                  Assinar agora <ExternalLink className="h-4 w-4" />
                </a>
              )
            ) : (
              <>
                <a
                  href={`/cadastro/${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  Começar meus {TRIAL_DAYS} dias grátis
                </a>
                {checkoutUrl && (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/60 bg-white/90 px-6 py-3 text-sm font-extrabold hover:bg-white"
                  >
                    Assinar agora <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </>
            )}
          </div>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">
            <CheckCircle2 className="mr-1 inline h-3 w-3" /> Compra segura
          </p>
        </section>
      </div>
    </AppShell>
  );
}
