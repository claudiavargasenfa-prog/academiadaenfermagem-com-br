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
  Star,
  Award,
  Clock,
  BookOpen,
  Stethoscope,
  ClipboardList,
  Brain,
  HeartPulse,
} from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import fotoFundadora from "@/assets/foto-fundadora.jpeg.asset.json";
import {
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,
  formatPriceBRL,
} from "@/lib/access";
import { useAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";

const TRIAL_DAYS = 15;

// Paleta local — verde escuro premium + dourado
const C = {
  bg: "#0d3b2e",
  bgDeep: "#082418",
  bgSoft: "#124a3a",
  gold: "#d4af37",
  goldSoft: "#f0d78c",
  cream: "#f5f0e0",
  line: "rgba(212,175,55,0.25)",
};

const PLANOS = [
  {
    slug: "academico",
    emoji: "🎓",
    label: "Academia do Acadêmico",
    tag: "Para o graduando de Enfermagem",
    dor: "Do primeiro ao último estágio, sem sofrer.",
    accent: "#f0d78c",
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
    accent: "#bfdbfe",
    bullets: [
      "Sinais vitais, sinais de alerta e cefalocaudal na prática",
      "Preparo de medicações, aprazamento e cálculos",
      "Simulações reais de plantão passo a passo",
      "Checklists de procedimentos técnicos",
      "Quizzes por tema para fixar antes da prova",
    ],
  },
  {
    slug: "tecnico",
    emoji: "🩺",
    label: "Academia do Técnico",
    tag: "Para o Técnico em Enfermagem atuando",
    dor: "Prática segura, plantão tranquilo.",
    accent: "#a7f3d0",
    bullets: [
      "Coleta de Dados + Admissão de Turno com anotação automática",
      "Multi-paciente por abas, salvo no seu aparelho",
      "Farmacologia essencial, aprazamento e diluições",
      "Procedimentos e escalas prontas para o plantão",
      "Quizzes por tema para fixar antes da prova",
    ],
  },
  {
    slug: "enfermeiro",
    emoji: "👩‍⚕️",
    label: "Academia do Enfermeiro",
    tag: "Para o Enfermeiro assistencial e liderança",
    dor: "Menos burocracia, mais assistência com tranquilidade.",
    accent: "#f0d78c",
    bullets: [
      "SAE completa: anamnese, diagnósticos AE/DE, prescrição, evolução",
      "Multi-paciente por abas + histórico do plantão inteiro",
      "Escalas clínicas, UTI, farmacologia avançada",
      "Prescrição de enfermagem com aprazamento pronto",
      "Quizzes por tema para fixar antes da prova",
    ],
  },
];

const MODULOS_SHOWCASE = [
  { icon: Brain, title: "SAE Automatizada", desc: "Diagnósticos e prescrição gerados a partir de sinais e sintomas." },
  { icon: HeartPulse, title: "Escalas Clínicas", desc: "22+ escalas prontas: Braden, Glasgow, Morse, dor e mais." },
  { icon: ClipboardList, title: "Coleta de Turno", desc: "Anotação técnica automática, multi-paciente, salva no aparelho." },
  { icon: Stethoscope, title: "Procedimentos", desc: "Punção, SVD, SNG, curativos — passo a passo, com segurança." },
  { icon: BookOpen, title: "Farmacologia + Aprazamento", desc: "Diluições, cálculos e horários prontos para o plantão." },
  { icon: Award, title: "Quizzes por tema", desc: "Fixe o conteúdo com perguntas objetivas e feedback imediato." },
];

export const Route = createFileRoute("/vendas")({
  head: () => {
    const title = "ADEC — Academia da Enfermagem | 4 apps de Suporte à Decisão Clínica";
    const description =
      "Enfermagem Baseada em Evidências: escolha o App certo para o seu momento na Enfermagem. 4 apps completos com SAE automatizada, escalas, procedimentos e farmacologia. 15 dias grátis, sem cartão.";
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
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions, enabled: isLoggedIn });
  const textsQ = useAppTexts();
  const t = (k: string, fb: string) => textsQ.data?.[`vendas.${k}`] ?? fb;

  const getPlan = (slug: string) => (plansQ.data ?? []).find((p) => p.slug === slug);
  const isSubscribed = (slug: string) => {
    const s = (subsQ.data ?? []).find((x) => x.plan_slug === slug);
    return !!s && (s.status === "active" || s.status === "trial");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(1200px 600px at 15% -10%, ${C.bgSoft} 0%, transparent 60%),
                     radial-gradient(1000px 500px at 100% 20%, rgba(212,175,55,0.15) 0%, transparent 60%),
                     linear-gradient(180deg, ${C.bg} 0%, ${C.bgDeep} 100%)`,
        color: C.cream,
      }}
    >
      {/* Top nav minimal */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2 opacity-80 transition hover:opacity-100">
          <img src={logoAsset.url} alt="ADEC" className="h-10 w-auto" />
        </Link>
        <Link
          to="/"
          className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition hover:bg-white/5"
          style={{ borderColor: C.line, color: C.goldSoft }}
        >
          Loja completa
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8">
        {/* HERO com logo ADEC como cabeçalho */}
        <section className="relative overflow-hidden rounded-[2.5rem] border p-8 md:p-14" style={{ borderColor: C.line, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(212,175,55,0.25)" }} />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(18,74,58,0.6)" }} />

          <div className="relative flex flex-col items-center text-center">
            {/* Logo ADEC como cabeçalho */}
            <img src={logoAsset.url} alt="ADEC — Avaliação Diagnóstica em Enfermagem Clínica" className="mx-auto h-40 w-auto drop-shadow-2xl md:h-56" />

            <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.35em]" style={{ color: C.goldSoft }}>
              Avaliação Diagnóstica em Enfermagem Clínica
            </p>
            <div className="mx-auto mt-1 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.goldSoft, opacity: 0.75 }}>
              Sistema Brasileiro de Hipóteses Diagnósticas de Enfermagem
            </p>

            <h1 className="mt-10 max-w-3xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl" style={{ color: "#fff" }}>
              {t(
                "hero_title",
                "Enfermagem Baseada em Evidências: escolha o App certo para o seu momento na Enfermagem",
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium md:text-lg" style={{ color: "rgba(245,240,224,0.85)" }}>
              {t(
                "hero_sub",
                "4 apps completos com SAE automatizada, processos de enfermagem, escalas clínicas, procedimentos, farmacologia e simulações reais. Estágios e plantões fundamentados em evidência científica.",
              )}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                { icon: "✨", label: `${TRIAL_DAYS} dias grátis` },
                { icon: "💳", label: "Sem cartão no cadastro" },
                { icon: "📶", label: "Funciona offline" },
                { icon: "🔄", label: "Atualizações contínuas e automáticas" },
              ].map((c) => (
                <span
                  key={c.label}
                  className="rounded-full border px-3 py-1.5 text-xs font-extrabold backdrop-blur"
                  style={{ borderColor: C.line, background: "rgba(255,255,255,0.05)", color: C.cream }}
                >
                  <span className="mr-1">{c.icon}</span>
                  {c.label}
                </span>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(245,240,224,0.6)" }}>
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.gold }} />
              Compra segura · PIX ou cartão só depois do teste
            </p>
          </div>
        </section>

        {/* CREDIBILIDADE */}
        <section className="mt-6 rounded-3xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}>
          <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-widest" style={{ color: C.goldSoft }}>
            Aprovado por quem vive o plantão e o consultório
          </p>
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            {[
              { n: "4", l: "Apps completos" },
              { n: "60+", l: "MSDC — Módulos de Suporte à Decisão Clínica" },
              { n: "22+", l: "Escalas clínicas" },
              { n: "100%", l: "Base COFEN / COREN" },
            ].map((s) => (
              <div key={s.l} className="min-w-[140px]">
                <p className="font-display text-3xl font-extrabold" style={{ color: C.gold }}>{s.n}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(245,240,224,0.7)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="mt-14">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Para quem é</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              Escolha o app da sua fase profissional
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANOS.map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl border p-5 backdrop-blur transition hover:-translate-y-1"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                  style={{ background: "rgba(212,175,55,0.15)", color: p.accent }}
                >
                  {p.emoji}
                </div>
                <p className="mt-3 font-display text-base font-extrabold leading-tight" style={{ color: "#fff" }}>{p.label}</p>
                <p className="mt-1 text-xs" style={{ color: "rgba(245,240,224,0.65)" }}>{p.tag}</p>
                <p className="mt-3 text-sm font-semibold" style={{ color: C.goldSoft }}>{p.dor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MSDC — Módulos */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>O que você recebe</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              MSDC — Módulos de Suporte à Decisão Clínica
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: "rgba(245,240,224,0.75)" }}>
              Cada MSDC resolve uma dor concreta do plantão, do consultório ou da prova — com base em evidência científica.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS_SHOWCASE.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border p-5 backdrop-blur transition hover:-translate-y-1"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "rgba(212,175,55,0.15)", color: C.gold }}>
                  <m.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-base font-extrabold" style={{ color: "#fff" }}>{m.title}</p>
                <p className="mt-1.5 text-sm" style={{ color: "rgba(245,240,224,0.75)" }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Base de dados */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: "rgba(212,175,55,0.08)" }}>
              <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>Base de dados</p>
              <p className="mt-2 font-display text-lg font-extrabold" style={{ color: "#fff" }}>
                Resoluções, normas, diretrizes e protocolos atualizados
              </p>
              <p className="mt-1 text-sm" style={{ color: "rgba(245,240,224,0.75)" }}>
                COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia.
              </p>
            </div>
            <div className="rounded-2xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: "rgba(212,175,55,0.08)" }}>
              <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>Extra</p>
              <p className="mt-2 font-display text-lg font-extrabold" style={{ color: "#fff" }}>
                Com certificação opcional
              </p>
              <p className="mt-1 text-sm" style={{ color: "rgba(245,240,224,0.75)" }}>
                Trilhas com emissão de certificado ao concluir os módulos.
              </p>
            </div>
          </div>
        </section>

        {/* PLANTÃO COM A ACADEMIA (só o "depois") */}
        <section className="mt-16 overflow-hidden rounded-3xl border p-8 md:p-12" style={{ borderColor: C.line, background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(255,255,255,0.03) 100%)" }}>
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Na prática</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              Plantão com a Academia
            </h3>
          </div>
          <ul className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              "Anotação e evolução gerada automaticamente de acordo com suas avaliações",
              "Farmacologia e aprazamento baseados nas metas de segurança do paciente",
              "SAE + PE personalizados por paciente, com prescrição automatizada",
              "22+ escalas clínicas atualizadas, offline",
              "Procedimentos passo a passo antes de encostar no paciente",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border p-4 backdrop-blur" style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.gold }} />
                <span className="text-base font-medium" style={{ color: C.cream }}>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PLANOS */}
        <section id="planos" className="mt-16 scroll-mt-16">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Escolha seu app</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              {t("planos_title", "4 apps, um só padrão de excelência")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: "rgba(245,240,224,0.75)" }}>
              {TRIAL_DAYS} dias grátis, sem cartão. Cancele quando quiser.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PLANOS.map((p, i) => {
              const plan = getPlan(p.slug);
              const price = (plan as any)?.price_novo_cents ?? (plan as any)?.price_cents ?? 0;
              const checkoutUrl = (plan as any)?.cakto_link_novo || (plan as any)?.cakto_checkout_url || "";
              const subscribed = isSubscribed(p.slug);
              const destacado = i === 3;

              return (
                <div
                  key={p.slug}
                  className="relative flex flex-col rounded-3xl border p-6 backdrop-blur transition hover:-translate-y-1"
                  style={{
                    borderColor: destacado ? C.gold : C.line,
                    background: destacado ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.04)",
                    boxShadow: destacado ? "0 20px 60px -20px rgba(212,175,55,0.4)" : undefined,
                  }}
                >
                  {destacado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow" style={{ background: C.gold, color: C.bgDeep }}>
                      + escolhido
                    </span>
                  )}

                  <div className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: "rgba(212,175,55,0.15)", color: p.accent }}>
                    {p.emoji}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-extrabold leading-tight" style={{ color: "#fff" }}>
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "rgba(245,240,224,0.6)" }}>{p.tag}</p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.goldSoft }}>{p.dor}</p>

                  <div className="mt-4">
                    {price > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold" style={{ color: "#fff" }}>
                          {formatPriceBRL(price)}
                        </span>
                        <span className="text-xs font-bold" style={{ color: "rgba(245,240,224,0.6)" }}>/mês</span>
                      </div>
                    ) : (
                      <div className="h-9 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                    )}
                    <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide" style={{ color: C.goldSoft }}>
                      ✨ {TRIAL_DAYS} dias grátis · sem cartão
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: C.line }}>
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-xs" style={{ color: "rgba(245,240,224,0.85)" }}>
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: C.gold }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2">
                    {subscribed ? (
                      <Link
                        to="/trilha/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-extrabold shadow transition hover:-translate-y-0.5"
                        style={{ background: C.gold, color: C.bgDeep }}
                      >
                        ✓ Acessar MSDC →
                      </Link>
                    ) : (
                      <>
                        <a
                          href={`/cadastro/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-extrabold shadow transition hover:-translate-y-0.5"
                          style={{ background: C.gold, color: C.bgDeep }}
                        >
                          <Sparkles className="h-4 w-4" />
                          Começar {TRIAL_DAYS} dias grátis
                        </a>
                        {checkoutUrl && (
                          <a
                            href={checkoutUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 bg-transparent px-4 py-2.5 text-xs font-extrabold transition"
                            style={{ borderColor: C.line, color: C.goldSoft }}
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
                      className="mt-1 text-center text-[11px] font-bold underline underline-offset-2 transition"
                      style={{ color: "rgba(245,240,224,0.6)" }}
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
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border p-6" style={{ borderColor: C.line, background: "rgba(212,175,55,0.08)" }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" style={{ color: C.gold }} />
              <p className="font-display text-lg font-extrabold" style={{ color: "#fff" }}>Garantia real de {TRIAL_DAYS} dias</p>
            </div>
            <p className="mt-2 text-sm" style={{ color: "rgba(245,240,224,0.8)" }}>
              Você entra, testa tudo, e só assina se quiser continuar. Sem cartão no cadastro, sem cobrança escondida.
            </p>
          </div>
          <div className="rounded-3xl border p-6" style={{ borderColor: C.line, background: "rgba(212,175,55,0.08)" }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6" style={{ color: C.gold }} />
              <p className="font-display text-lg font-extrabold" style={{ color: "#fff" }}>Grupo VIP no WhatsApp</p>
            </div>
            <p className="mt-2 text-sm" style={{ color: "rgba(245,240,224,0.8)" }}>
              Assinantes recebem convite para o grupo VIP: tira-dúvidas com a fundadora, atualizações contínuas e trocas entre colegas de plantão.
            </p>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Quem já usa</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              Aprovado por quem vive o plantão e o consultório
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure
                key={n}
                className="flex flex-col rounded-3xl border p-6 backdrop-blur"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex gap-0.5" style={{ color: C.gold }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm italic" style={{ color: "rgba(245,240,224,0.85)" }}>
                  “{t(
                    `depoimento${n}_texto`,
                    n === 1
                      ? "A SAE automatizada mudou meu plantão. Em 2 minutos tenho diagnóstico, prescrição e evolução prontas."
                      : n === 2
                        ? "As escalas clínicas offline salvaram meu estágio. Não preciso mais caçar PDF na hora."
                        : "Anotação técnica automática por paciente é ouro. Ganho tempo pra cuidar de verdade.",
                  )}”
                </blockquote>
                <figcaption className="mt-4 border-t pt-3 text-xs font-bold" style={{ borderColor: C.line, color: C.goldSoft }}>
                  {t(`depoimento${n}_nome`, n === 1 ? "Enfermeira, UTI" : n === 2 ? "Acadêmica, 7º período" : "Técnica em Enfermagem, ala clínica")}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* SOBRE A AUTORA */}
        <section className="mt-16 overflow-hidden rounded-[2rem] border p-8 md:p-12" style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}>
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Sobre a autora</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              Conheça um pouco da minha História
            </h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
            <div className="mx-auto lg:mx-0">
              <div className="overflow-hidden rounded-3xl border shadow-xl" style={{ borderColor: C.gold }}>
                <img src={fotoFundadora.url} alt="Fundadora — Academia da Enfermagem" className="h-56 w-56 object-cover lg:h-60 lg:w-60" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-extrabold" style={{ color: C.gold }}>A História</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,240,224,0.9)" }}>
                  A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e Enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: A assistência aos pacientes.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl font-extrabold" style={{ color: C.gold }}>O Propósito</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,240,224,0.9)" }}>
                  Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem administrativa e prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl font-extrabold" style={{ color: C.gold }}>Minha Promessa</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,240,224,0.9)" }}>
                  A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!
                </p>
              </div>

              <Link
                to="/minha-historia"
                className="inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4 transition hover:opacity-80"
                style={{ color: C.goldSoft }}
              >
                Ler minha história completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Dúvidas frequentes</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: "#fff" }}>
              Antes de decidir
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-2">
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
                a: "Enfermeira docente com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS. Atualizações contínuas e automáticas.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border p-5 backdrop-blur"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.04)" }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-extrabold marker:hidden" style={{ color: "#fff" }}>
                  <span>{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition group-open:rotate-45" style={{ background: "rgba(212,175,55,0.2)", color: C.gold }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm" style={{ color: "rgba(245,240,224,0.8)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative mt-16 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-2xl md:p-14" style={{ background: `linear-gradient(135deg, ${C.bgSoft} 0%, ${C.bg} 100%)`, border: `1px solid ${C.gold}` }}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(212,175,55,0.25)" }} />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(212,175,55,0.15)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur" style={{ borderColor: C.line, background: "rgba(255,255,255,0.05)", color: C.goldSoft }}>
              <Clock className="h-3.5 w-3.5" />
              Comece hoje
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl" style={{ color: "#fff" }}>
              Escolha seu app e ganhe {TRIAL_DAYS} dias grátis
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm md:text-base" style={{ color: "rgba(245,240,224,0.85)" }}>
              Sem cartão de crédito. Sem fidelidade. Cancele quando quiser.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {PLANOS.map((p) => {
                const subscribed = isSubscribed(p.slug);
                return (
                  <a
                    key={p.slug}
                    href={subscribed ? `/trilha/${p.slug}` : `/cadastro/${p.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left backdrop-blur transition hover:-translate-y-0.5"
                    style={{ borderColor: C.gold, background: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl" style={{ background: "rgba(212,175,55,0.2)", color: p.accent }}>
                        {p.emoji}
                      </span>
                      <div>
                        <p className="font-display text-sm font-extrabold" style={{ color: "#fff" }}>{p.label}</p>
                        <p className="text-[11px] font-semibold" style={{ color: "rgba(245,240,224,0.7)" }}>
                          {subscribed ? "Acessar" : `Começar ${TRIAL_DAYS} dias grátis`}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color: C.gold }} />
                  </a>
                );
              })}
            </div>

            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur" style={{ background: "rgba(255,255,255,0.08)", color: C.goldSoft }}>
              <ShieldCheck className="h-3.5 w-3.5" /> Compra 100% segura
            </p>
          </div>
        </section>

        <p className="mt-8 text-center text-[11px]" style={{ color: "rgba(245,240,224,0.5)" }}>
          ADEC · Academia da Enfermagem · academiadaenfermagem.com.br
        </p>
      </div>
    </div>
  );
}
