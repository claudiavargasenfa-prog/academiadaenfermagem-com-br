import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wifi,
  Star,
  Award,
  Clock,
  BookOpen,
  Stethoscope,
  ClipboardList,
  Brain,
  HeartPulse,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  fetchMiniApps,
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
  formatPriceBRL,
} from "@/lib/access";
import { useAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";

const TRIAL_DAYS = 15;

const PLANOS = [
  {
    slug: "academico",
    emoji: "🎓",
    label: "Academia do Acadêmico",
    tag: "Para o graduando de Enfermagem",
    dor: "Do primeiro estágio ao TCC — sem sofrer.",
    bg: "#FDE68A",
    fg: "#78350F",
    bullets: [
      "SAE Descomplicada com diagnósticos e prescrição automáticos",
      "Escalas clínicas prontas (Braden, Glasgow, Morse, dor…)",
      "Procedimentos passo a passo (punção, SVD, SNG, curativos)",
      "Enfermagem obstétrica, saúde mental, IRAS e mais",
      "Quizzes por tema para fixar antes da prova",
    ],
  },
  {
    slug: "tecnico-estudante",
    emoji: "📘",
    label: "Estudante de Técnico",
    tag: "Para quem ainda está no curso técnico",
    dor: "Passa na prova, encara o campo com confiança.",
    bg: "#DBEAFE",
    fg: "#1E3A8A",
    bullets: [
      "Sinais vitais, sinais de alerta e cefalocaudal na prática",
      "Preparo de medicações, aprazamento e cálculos",
      "Simulações reais de plantão passo a passo",
      "Checklists de procedimentos técnicos",
      "Quizzes rápidos para o COREN e provas do curso",
    ],
  },
  {
    slug: "tecnico",
    emoji: "🩺",
    label: "Academia do Técnico",
    tag: "Para o Técnico em Enfermagem atuando",
    dor: "Prática segura, plantão tranquilo.",
    bg: "#BFDBFE",
    fg: "#1E3A8A",
    bullets: [
      "Coleta de Dados + Admissão de Turno com anotação automática",
      "Multi-paciente por abas, salvo no seu aparelho",
      "Farmacologia essencial, aprazamento e diluições",
      "Procedimentos e escalas prontas para o plantão",
      "Manual de sobrevivência do técnico e mais",
    ],
  },
  {
    slug: "enfermeiro",
    emoji: "👩‍⚕️",
    label: "Academia do Enfermeiro",
    tag: "Para o Enfermeiro assistencial e liderança",
    dor: "Menos burocracia, mais paciente.",
    bg: "#BBF7D0",
    fg: "#14532D",
    bullets: [
      "SAE completa: anamnese, diagnósticos AE/DE, prescrição, evolução",
      "Multi-paciente por abas + histórico do plantão inteiro",
      "Escalas clínicas, UTI, farmacologia avançada",
      "Prescrição de enfermagem com aprazamento pronto",
      "IRAS, segurança do paciente, postura ética e liderança",
    ],
  },
];

const MINI_APPS_SHOWCASE = [
  { icon: Brain, title: "SAE Automatizada", desc: "Diagnósticos e prescrição gerados a partir de sinais e sintomas." },
  { icon: HeartPulse, title: "Escalas Clínicas", desc: "22+ escalas prontas: Braden, Glasgow, Morse, dor e mais." },
  { icon: ClipboardList, title: "Coleta de Turno", desc: "Anotação técnica automática, multi-paciente, salva no aparelho." },
  { icon: Stethoscope, title: "Procedimentos", desc: "Punção, SVD, SNG, curativos — passo a passo, com segurança." },
  { icon: BookOpen, title: "Farmacologia + Aprazamento", desc: "Diluições, cálculos e horários prontos para o plantão." },
  { icon: Award, title: "Quizzes por tema", desc: "Fixe o conteúdo com perguntas objetivas e feedback imediato." },
];

export const Route = createFileRoute("/vendas")({
  head: () => {
    const title = "Academia da Enfermagem — 4 apps para dominar seu plantão";
    const description =
      "Escalas clínicas, SAE automatizada, procedimentos, farmacologia e mais. 15 dias grátis, sem cartão. Escolha o app ideal: Acadêmico, Técnico, Estudante ou Enfermeiro.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: VendasPage,
});

function VendasPage() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const isLoggedIn = !!session;

  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const miniAppsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions, enabled: isLoggedIn });
  const textsQ = useAppTexts();
  const t = (k: string, fb: string) => textsQ.data?.[`vendas.${k}`] ?? fb;

  const getPlan = (slug: string) => (plansQ.data ?? []).find((p) => p.slug === slug);
  const isSubscribed = (slug: string) => {
    const s = (subsQ.data ?? []).find((x) => x.plan_slug === slug);
    return !!s && (s.status === "active" || s.status === "trial");
  };

  const totalMiniApps = (miniAppsQ.data ?? []).filter((m) => m.is_active !== false).length;

  const scrollToPlanos = () => {
    document.getElementById("planos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell hideReferences publicRoute>
      <div className="mx-auto max-w-6xl page-enter">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 p-8 shadow-[0_20px_60px_-20px_rgba(12,62,33,0.25)] backdrop-blur md:p-14">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[oklch(0.82_0.14_88/0.35)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[oklch(0.55_0.13_155/0.25)] blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.78_0.14_88/0.5)] bg-white/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {t("hero_eyebrow", "Academia da Enfermagem")}
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-primary md:text-6xl">
                {t("hero_title", "A Academia da Enfermagem que cabe no seu bolso.")}
              </h1>

              <p className="mt-5 max-w-xl text-base font-medium text-foreground/80 md:text-lg">
                {t(
                  "hero_sub",
                  "4 apps completos com SAE automatizada, escalas clínicas, procedimentos, farmacologia e simulações reais — pensados para acadêmicas, técnicas e enfermeiras que querem plantão seguro e prova tranquila.",
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: "✨", label: `${TRIAL_DAYS} dias grátis` },
                  { icon: "💳", label: "Sem cartão no cadastro" },
                  { icon: "📶", label: "Funciona offline" },
                  { icon: "🔄", label: "Atualizações mensais" },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm backdrop-blur"
                  >
                    <span className="mr-1">{c.icon}</span>
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToPlanos}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl"
                >
                  Ver os 4 planos
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-primary/20 bg-white/70 px-6 py-3.5 text-sm font-extrabold text-primary backdrop-blur transition hover:bg-white"
                >
                  Conhecer a loja completa
                </Link>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground/60">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                Compra segura · PIX ou cartão só depois do teste
              </p>
            </div>

            {/* Cards stack visual */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-[oklch(0.82_0.14_88/0.25)] to-[oklch(0.55_0.13_155/0.25)] blur-2xl" />
              <div className="relative space-y-3">
                {PLANOS.slice(0, 4).map((p, i) => (
                  <div
                    key={p.slug}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-md backdrop-blur"
                    style={{ transform: `translateX(${i * 16}px)` }}
                  >
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                      style={{ backgroundColor: p.bg, color: p.fg }}
                    >
                      {p.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold leading-tight text-primary">{p.label}</p>
                      <p className="truncate text-xs text-foreground/60">{p.dor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CREDIBILIDADE */}
        <section className="mt-6 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="min-w-[120px]">
              <p className="font-display text-2xl font-extrabold text-primary">4</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/60">Apps completos</p>
            </div>
            <div className="min-w-[120px]">
              <p className="font-display text-2xl font-extrabold text-primary">{totalMiniApps || "60+"}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/60">Mini apps clínicos</p>
            </div>
            <div className="min-w-[120px]">
              <p className="font-display text-2xl font-extrabold text-primary">22+</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/60">Escalas clínicas</p>
            </div>
            <div className="min-w-[120px]">
              <p className="font-display text-2xl font-extrabold text-primary">100%</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/60">Base COFEN / COREN</p>
            </div>
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="mt-10">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">Para quem é</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-primary md:text-4xl">
              Escolha o app da sua fase profissional
            </h2>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLANOS.map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                  style={{ backgroundColor: p.bg, color: p.fg }}
                >
                  {p.emoji}
                </div>
                <p className="mt-3 font-display text-base font-extrabold leading-tight text-primary">{p.label}</p>
                <p className="mt-1 text-xs text-foreground/60">{p.tag}</p>
                <p className="mt-2 text-sm font-semibold text-foreground/80">{p.dor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* O QUE VOCÊ RECEBE */}
        <section className="mt-12">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">O que você recebe</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-primary md:text-4xl">
              Ferramentas de verdade para o dia a dia clínico
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70">
              Nada de PDF empoeirado. Cada mini app é pensado para resolver uma dor concreta do plantão ou da prova.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINI_APPS_SHOWCASE.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-base font-extrabold text-primary">{m.title}</p>
                <p className="mt-1.5 text-sm text-foreground/70">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ANTES x DEPOIS */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-border p-6 md:border-b-0 md:border-r">
              <p className="text-xs font-extrabold uppercase tracking-widest text-destructive">Antes</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-foreground">Plantão sem a Academia</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                <li>❌ Anotação técnica escrita à mão, correndo no fim do plantão</li>
                <li>❌ Dúvida na diluição, no aprazamento, no cálculo</li>
                <li>❌ SAE genérica copiada da colega, sem embasamento</li>
                <li>❌ Escalas clínicas espalhadas em PDFs desatualizados</li>
                <li>❌ Insegurança em procedimento novo</li>
              </ul>
            </div>
            <div className="p-6" style={{ background: "linear-gradient(135deg, oklch(0.98 0.02 150) 0%, oklch(0.94 0.04 150) 100%)" }}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-success">Depois</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-primary">Plantão com a Academia</h3>
              <ul className="mt-4 space-y-2 text-sm font-medium text-foreground/80">
                <li>✅ Anotação gerada automaticamente do que você marcou</li>
                <li>✅ Farmacologia e aprazamento na palma da mão</li>
                <li>✅ SAE personalizada por paciente, com prescrição pronta</li>
                <li>✅ 22+ escalas clínicas atualizadas, offline</li>
                <li>✅ Procedimentos passo a passo antes de encostar no paciente</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="mt-14 scroll-mt-16">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">Escolha seu app</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-primary md:text-4xl">
              {t("planos_title", "4 apps, um só padrão de excelência")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70">
              {TRIAL_DAYS} dias grátis, sem cartão. Cancele quando quiser. Comece hoje.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLANOS.map((p, i) => {
              const plan = getPlan(p.slug);
              const price = (plan as any)?.price_novo_cents ?? (plan as any)?.price_cents ?? 0;
              const checkoutUrl = (plan as any)?.cakto_link_novo || (plan as any)?.cakto_checkout_url || "";
              const subscribed = isSubscribed(p.slug);
              const destacado = i === 3; // Enfermeiro destaque

              return (
                <div
                  key={p.slug}
                  className={`relative flex flex-col rounded-3xl border bg-white/90 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl ${
                    destacado ? "border-gold/60 ring-2 ring-gold/40" : "border-white/70"
                  }`}
                >
                  {destacado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gold-foreground shadow">
                      + escolhido
                    </span>
                  )}

                  <div
                    className="grid h-14 w-14 place-items-center rounded-2xl text-3xl"
                    style={{ backgroundColor: p.bg, color: p.fg }}
                  >
                    {p.emoji}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-primary">
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-foreground/60">{p.tag}</p>

                  <div className="mt-4">
                    {price > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold text-primary">
                          {formatPriceBRL(price)}
                        </span>
                        <span className="text-xs font-bold text-foreground/60">/mês</span>
                      </div>
                    ) : (
                      <div className="h-9 animate-pulse rounded bg-muted" />
                    )}
                    <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-success">
                      ✨ {TRIAL_DAYS} dias grátis · sem cartão
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2">
                    {subscribed ? (
                      <Link
                        to="/trilha/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow transition hover:opacity-95"
                      >
                        ✓ Acessar mini apps →
                      </Link>
                    ) : (
                      <>
                        <a
                          href={`/cadastro/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                          Começar {TRIAL_DAYS} dias grátis
                        </a>
                        {checkoutUrl && (
                          <a
                            href={checkoutUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary/15 bg-white px-4 py-2.5 text-xs font-extrabold text-primary transition hover:border-primary/40"
                          >
                            Já quero assinar
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </>
                    )}
                    <Link
                      to="/planos/$slug"
                      params={{ slug: p.slug }}
                      className="mt-1 text-center text-[11px] font-bold text-foreground/50 underline underline-offset-2 hover:text-primary"
                    >
                      Ver detalhes deste app
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GARANTIA + WHATSAPP */}
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-success/30 bg-gradient-to-br from-[oklch(0.96_0.05_150)] to-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-success" />
              <p className="font-display text-lg font-extrabold text-primary">Garantia real de {TRIAL_DAYS} dias</p>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Você entra, testa tudo, e só assina se quiser continuar. Sem cartão no cadastro, sem cobrança escondida.
              Cancele com um clique quando quiser.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
              <p className="font-display text-lg font-extrabold text-primary">Grupo VIP no WhatsApp</p>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Assinantes recebem convite para o grupo VIP: tira-dúvidas com a fundadora, atualizações mensais e
              trocas entre colegas de plantão.
            </p>
          </div>
        </section>

        {/* DEPOIMENTOS (placeholders editáveis via app_texts) */}
        <section className="mt-14">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">Quem já usa</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-primary md:text-4xl">
              Aprovado por quem vive o plantão
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure
                key={n}
                className="flex flex-col rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex gap-0.5 text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm italic text-foreground/80">
                  “{t(
                    `depoimento${n}_texto`,
                    n === 1
                      ? "A SAE automatizada mudou meu plantão. Em 2 minutos tenho diagnóstico, prescrição e evolução prontas."
                      : n === 2
                        ? "As escalas clínicas offline salvaram meu estágio. Não preciso mais caçar PDF na hora."
                        : "Anotação técnica automática por paciente é ouro. Ganho tempo pra cuidar de verdade.",
                  )}”
                </blockquote>
                <figcaption className="mt-4 border-t border-border pt-3 text-xs font-bold text-primary">
                  {t(`depoimento${n}_nome`, n === 1 ? "Enfermeira, UTI" : n === 2 ? "Acadêmica, 7º período" : "Técnica em Enfermagem, ala clínica")}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold">Dúvidas frequentes</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-primary md:text-4xl">
              Antes de decidir
            </h2>
          </div>
          <div className="mx-auto mt-6 max-w-3xl space-y-2">
            {[
              {
                q: "Como funciona o período grátis?",
                a: `Você se cadastra e ganha ${TRIAL_DAYS} dias de acesso completo, sem precisar informar cartão. No fim do período, é só assinar para continuar.`,
              },
              {
                q: "Posso cancelar quando quiser?",
                a: "Sim. A assinatura é mensal e sem fidelidade — cancele pelo checkout a qualquer momento.",
              },
              {
                q: "Funciona offline?",
                a: "Sim. Instale como app no celular (PWA) e a maior parte do conteúdo funciona sem internet, ideal para plantão.",
              },
              {
                q: "Como entro no Grupo VIP do WhatsApp?",
                a: "Assim que ativar seu acesso, o convite do grupo aparece dentro do app.",
              },
              {
                q: "Posso usar no celular e no computador?",
                a: "Sim. Basta entrar com seu login em qualquer aparelho — seu progresso e assinatura acompanham você.",
              },
              {
                q: "Quem cria e revisa o conteúdo?",
                a: "Enfermeira docente com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS. Atualizações mensais.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-extrabold text-primary marker:hidden">
                  <span>{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          className="relative mt-14 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-xl md:p-14"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              Comece hoje
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-white md:text-5xl">
              Escolha seu app e ganhe {TRIAL_DAYS} dias grátis
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
              Sem cartão de crédito. Sem fidelidade. Cancele quando quiser.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {PLANOS.map((p) => {
                const subscribed = isSubscribed(p.slug);
                return (
                  <a
                    key={p.slug}
                    href={subscribed ? `/trilha/${p.slug}` : `/cadastro/${p.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-5 py-4 text-left shadow-md transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl"
                        style={{ backgroundColor: p.bg, color: p.fg }}
                      >
                        {p.emoji}
                      </span>
                      <div>
                        <p className="font-display text-sm font-extrabold text-primary">{p.label}</p>
                        <p className="text-[11px] font-semibold text-foreground/60">
                          {subscribed ? "Acessar" : `Começar ${TRIAL_DAYS} dias grátis`}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-0.5" />
                  </a>
                );
              })}
            </div>

            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> Compra 100% segura
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-foreground/50">
          Academia da Enfermagem · academiadaenfermagem.com.br
        </p>
      </div>
    </AppShell>
  );
}
