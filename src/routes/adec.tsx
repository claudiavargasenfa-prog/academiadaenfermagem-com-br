import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowRight,
  CheckCircle2,
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
  Flame,
  Users,
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

/** Paleta: fundo verde água + CTA verde fechado + detalhes ouro + urgência laranja */
const C = {
  aquaTop: "#A8DCD9",
  aquaBottom: "#CCEAE8",
  ink: "#0b3229",
  inkSoft: "rgba(11,50,41,0.75)",
  cta: "#0d3b2e",
  ctaHover: "#082418",
  gold: "#b07d1a",
  goldBright: "#d4af37",
  orange: "#EA580C",
  line: "rgba(13,59,46,0.14)",
  card: "rgba(255,255,255,0.62)",
  cardStrong: "rgba(255,255,255,0.85)",
};

const CTA_TOPO = "QUERO TESTAR GRÁTIS POR 15 DIAS →";
const CTA_MEIO = "SIM, QUERO TRANSFORMAR MEU PLANTÃO";
const CTA_RODAPE = "COMEÇAR MEU TESTE GRÁTIS →";

/** Fase de inauguração: sem números de usuários e sem depoimentos até termos casos reais. */
const LANCAMENTO = "Turma de inauguração";

const PLANOS = [
  {
    slug: "academico",
    emoji: "🎓",
    label: "Academia do Acadêmico",
    tag: "Para o graduando de Enfermagem",
    dor: "Do primeiro ao último estágio, sem sofrer.",
    bullets: [
      "Chegue no estágio sabendo exatamente o que fazer",
      "Escalas clínicas na mão — sem caçar PDF na hora",
      "Procedimentos passo a passo antes de encostar no paciente",
      "Obstetrícia, saúde mental e IRAS explicados de verdade",
      "Passe nas provas sem abrir mão do seu descanso",
    ],
  },
  {
    slug: "tecnico-estudante",
    emoji: "📘",
    label: "Estudante de Técnico",
    tag: "Para quem ainda está no curso técnico",
    dor: "Passa na prova, encara o campo com confiança.",
    bullets: [
      "Reconheça sinais de alerta sem travar na hora",
      "Nunca mais tenha medo de errar uma medicação",
      "Simulações reais de plantão para perder o nervosismo",
      "Checklists que evitam o famoso branco no campo",
      "Passe nas provas sem abrir mão do seu descanso",
    ],
  },
  {
    slug: "tecnico",
    emoji: "🩺",
    label: "Academia do Técnico",
    tag: "Para o Técnico em Enfermagem atuando",
    dor: "Prática segura, plantão tranquilo.",
    bullets: [
      "Ganhe horas de sono no pós-plantão com anotação automática",
      "Vários pacientes organizados por abas, sem se perder",
      "Nunca mais tenha medo de errar uma medicação",
      "Saia do plantão no horário, com tudo registrado",
      "Passe nas provas sem abrir mão do seu descanso",
    ],
  },
  {
    slug: "enfermeiro",
    emoji: "👩‍⚕️",
    label: "Academia do Enfermeiro",
    tag: "Para o Enfermeiro assistencial e liderança",
    dor: "Menos burocracia, mais assistência com tranquilidade.",
    bullets: [
      "Evolução e prescrição prontas em 2 cliques",
      "Ganhe horas de sono no pós-plantão",
      "Durma tranquila: tudo amparado por COFEN/COREN",
      "Acompanhe o plantão inteiro sem perder nenhum registro",
      "Passe nas provas e concursos sem abrir mão do descanso",
    ],
  },
];

const MODULOS_SHOWCASE = [
  { icon: ClipboardList, title: "Ganhe horas de sono no pós-plantão", desc: "A anotação técnica sai pronta enquanto você cuida. Você sai no horário e chega inteira em casa." },
  { icon: BookOpen, title: "Nunca mais tenha medo de errar uma medicação", desc: "Farmacologia, diluição e aprazamento conferidos para você agir com segurança na correria." },
  { icon: Award, title: "Passe nas provas sem abrir mão do seu descanso", desc: "Quizzes por tema com feedback imediato: estude pouco, fixe muito, durma bem." },
  { icon: Brain, title: "Pare de travar na frente do papel", desc: "A SAE monta diagnóstico e prescrição a partir dos sinais e sintomas que você marcou." },
  { icon: HeartPulse, title: "Segurança na beira do leito", desc: "22+ escalas clínicas prontas e offline — decisão rápida, sem insegurança." },
  { icon: Stethoscope, title: "Confiança antes do procedimento", desc: "Punção, SVD, SNG e curativos passo a passo, para você nunca mais ficar na dúvida." },
];

export const Route = createFileRoute("/adec")({
  head: () => {
    const title = "ADEC — Automatize suas anotações e foque no paciente";
    const description =
      "Cansada de anotações manuais que roubam seu plantão? Automatize a escrita com 2 cliques. 4 apps de Suporte à Decisão Clínica. 15 dias grátis, sem cartão.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://academiadaenfermagem.com.br/adec" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/adec" }],
    };
  },
  component: AdecPage,
});

function AdecPage() {
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

  const ctaStyle: React.CSSProperties = {
    background: C.cta,
    color: "#fff",
    boxShadow: "0 14px 34px -14px rgba(13,59,46,0.7)",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(900px 480px at 12% -10%, rgba(255,255,255,0.75) 0%, transparent 60%),
                     radial-gradient(800px 420px at 100% 12%, rgba(212,175,55,0.18) 0%, transparent 60%),
                     linear-gradient(180deg, ${C.aquaTop} 0%, ${C.aquaBottom} 100%)`,
        color: C.ink,
      }}
    >
      {/* Barra de urgência */}
      <div
        className="w-full px-4 py-2 text-center text-[11px] lg:text-[13px] font-extrabold uppercase tracking-widest"
        style={{ background: C.orange, color: "#fff" }}
      >
        <Flame className="mr-1 inline h-3.5 w-3.5" />
        Vagas limitadas no Grupo VIP do WhatsApp desta turma — entre hoje e garanta a sua
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
          <img src={logoAsset.url} alt="ADEC" className="h-10 w-auto" />
        </Link>
        <Link
          to="/"
          className="rounded-full border px-4 py-1.5 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-bold uppercase tracking-widest transition hover:bg-white/60"
          style={{ borderColor: C.line, color: C.cta, background: "rgba(255,255,255,0.5)" }}
        >
          Loja completa
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8">
        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-[2.5rem] border p-8 md:p-14"
          style={{ borderColor: C.line, background: C.card, backdropFilter: "blur(12px)" }}
        >
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(212,175,55,0.28)" }} />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.7)" }} />

          <div className="relative flex flex-col items-center text-center">
            <img src={logoAsset.url} alt="ADEC — Avaliação Diagnóstica em Enfermagem Clínica" className="mx-auto h-36 w-auto drop-shadow-xl md:h-48" />

            <p className="mt-2 text-[10px] lg:text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.35em]" style={{ color: C.gold }}>
              Avaliação Diagnóstica em Enfermagem Clínica
            </p>
            <div className="mx-auto mt-1 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${C.goldBright}, transparent)` }} />

            <h1 className="mt-8 max-w-4xl font-display text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl" style={{ color: C.ink }}>
              {t(
                "hero_title",
                "Cansada de anotações manuais que roubam seu plantão? Automatize a escrita com 2 cliques e foque no paciente.",
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-medium md:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
              {t(
                "hero_sub",
                "Você já saiu do plantão com a sensação de que passou mais tempo preenchendo papel do que cuidando? Ou teve aquele medo de errar um cálculo de medicação na correria? Se sim, você não está sozinha. Milhares de enfermeiras vivem isso todos os dias.",
              )}
            </p>

            <a
              href="#planos"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide transition hover:-translate-y-0.5 md:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl"
              style={ctaStyle}
            >
              <Sparkles className="h-4 w-4" style={{ color: C.goldBright }} />
              {CTA_TOPO}
            </a>

            <p className="mt-3 flex items-center gap-1.5 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-bold" style={{ color: C.orange }}>
              <Sparkles className="h-3.5 w-3.5" />
              {LANCAMENTO}: os primeiros assinantes entram com acesso completo e canal direto com a autora

            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {[
                { icon: "✨", label: `${TRIAL_DAYS} dias grátis` },
                { icon: "💳", label: "Sem cartão no cadastro" },
                { icon: "📶", label: "Funciona offline" },
                { icon: "🔄", label: "Atualizações contínuas" },
              ].map((c) => (
                <span
                  key={c.label}
                  className="rounded-full border px-3 py-1.5 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold backdrop-blur"
                  style={{ borderColor: C.line, background: "rgba(255,255,255,0.7)", color: C.ink }}
                >
                  <span className="mr-1">{c.icon}</span>
                  {c.label}
                </span>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-1.5 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-semibold" style={{ color: C.inkSoft }}>
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.gold }} />
              Compra segura · PIX ou cartão só depois do teste
            </p>
          </div>
        </section>

        {/* CREDIBILIDADE */}
        <section className="mt-6 rounded-3xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: C.card }}>
          <p className="mb-4 text-center text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>
            Conteúdo construído por quem vive o plantão e o consultório
          </p>
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            {[
              { n: "35 anos", l: "De vivência em enfermagem" },
              { n: "60+", l: "MSDC — Módulos de Suporte à Decisão Clínica" },
              { n: "22+", l: "Escalas clínicas" },
              { n: "100%", l: "Base COFEN / COREN" },
            ].map((s) => (
              <div key={s.l} className="min-w-[140px]">
                <p className="font-display text-3xl font-extrabold" style={{ color: C.cta }}>{s.n}</p>
                <p className="mt-1 text-[10px] lg:text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-bold uppercase tracking-wider" style={{ color: C.inkSoft }}>{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="mt-14">
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Para quem é</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              Escolha o app da sua fase profissional
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANOS.map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl border p-5 backdrop-blur transition hover:-translate-y-1"
                style={{ borderColor: C.line, background: C.card }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl lg:text-3xl" style={{ background: "rgba(212,175,55,0.22)" }}>
                  {p.emoji}
                </div>
                <p className="mt-3 font-display text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold leading-tight" style={{ color: C.ink }}>{p.label}</p>
                <p className="mt-1 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>{p.tag}</p>
                <p className="mt-3 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-semibold" style={{ color: C.gold }}>{p.dor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>O que muda na sua vida</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              Não é só um app. É o seu plantão de volta.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
              Cada módulo resolve uma dor concreta do plantão, do consultório ou da prova — com base em evidência científica.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS_SHOWCASE.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border p-5 backdrop-blur transition hover:-translate-y-1"
                style={{ borderColor: C.line, background: C.card }}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "rgba(13,59,46,0.1)", color: C.cta }}>
                  <m.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.ink }}>{m.title}</p>
                <p className="mt-1.5 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: "rgba(212,175,55,0.14)" }}>
              <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>Base de dados</p>
              <p className="mt-2 font-display text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.ink }}>
                Resoluções, normas, diretrizes e protocolos atualizados
              </p>
              <p className="mt-1 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
                COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia.
              </p>
            </div>
            <div className="rounded-2xl border p-5 backdrop-blur" style={{ borderColor: C.line, background: "rgba(212,175,55,0.14)" }}>
              <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>Extra</p>
              <p className="mt-2 font-display text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.ink }}>
                Com certificação opcional
              </p>
              <p className="mt-1 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
                Trilhas com emissão de certificado ao concluir os módulos.
              </p>
            </div>
          </div>

          {/* CTA MEIO */}
          <div className="mt-10 text-center">
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide transition hover:-translate-y-0.5 md:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl"
              style={ctaStyle}
            >
              {CTA_MEIO}
              <ArrowRight className="h-4 w-4" style={{ color: C.goldBright }} />
            </a>
          </div>
        </section>

        {/* PLANTÃO COM A ACADEMIA */}
        <section className="mt-16 overflow-hidden rounded-3xl border p-8 md:p-12" style={{ borderColor: C.line, background: C.cardStrong }}>
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Na prática</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              Plantão com a Academia
            </h3>
          </div>
          <ul className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              "Você sai no horário: anotação e evolução saem prontas do que você já avaliou",
              "Dorme tranquila: medicação e aprazamento conferidos pelas metas de segurança",
              "Nunca mais trava na frente do papel: SAE e prescrição por paciente",
              "Decide rápido na beira do leito: 22+ escalas clínicas, offline",
              "Encara qualquer procedimento com confiança: passo a passo antes de começar",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: C.line, background: "rgba(255,255,255,0.65)" }}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.cta }} />
                <span className="text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-medium" style={{ color: C.ink }}>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PLANOS */}
        <section id="planos" className="mt-16 scroll-mt-16">
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Escolha seu app</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              {t("planos_title", "4 apps, um só padrão de excelência")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
              {TRIAL_DAYS} dias grátis, sem cartão. Cancele quando quiser.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PLANOS.map((p, i) => {
              const plan = getPlan(p.slug);
              const price = (plan as any)?.price_novo_cents ?? (plan as any)?.price_cents ?? 0;
              const subscribed = isSubscribed(p.slug);
              const destacado = i === 3;

              return (
                <div
                  key={p.slug}
                  className="relative flex flex-col rounded-3xl border p-6 backdrop-blur transition hover:-translate-y-1"
                  style={{
                    borderColor: destacado ? C.goldBright : C.line,
                    background: destacado ? "rgba(255,255,255,0.9)" : C.card,
                    boxShadow: destacado ? "0 20px 60px -22px rgba(13,59,46,0.45)" : undefined,
                  }}
                >
                  {destacado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] lg:text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-widest shadow" style={{ background: C.orange, color: "#fff" }}>
                      + escolhido
                    </span>
                  )}

                  <div className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: "rgba(212,175,55,0.22)" }}>
                    {p.emoji}
                  </div>

                  <h3 className="mt-4 font-display text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold leading-tight" style={{ color: C.ink }}>
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-semibold" style={{ color: C.inkSoft }}>{p.tag}</p>
                  <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-semibold" style={{ color: C.gold }}>{p.dor}</p>

                  <div className="mt-4">
                    {price > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold" style={{ color: C.ink }}>
                          {formatPriceBRL(price)}
                        </span>
                        <span className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-bold" style={{ color: C.inkSoft }}>/mês</span>
                      </div>
                    ) : (
                      <div className="h-9 animate-pulse rounded" style={{ background: "rgba(13,59,46,0.08)" }} />
                    )}
                    <p className="mt-1 text-[11px] lg:text-[13px] font-extrabold uppercase tracking-wide" style={{ color: C.orange }}>
                      ✨ {TRIAL_DAYS} dias grátis · sem cartão
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: C.line }}>
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: C.cta }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-2 pt-6">
                    {subscribed ? (
                      <Link
                        to="/trilha/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold transition hover:-translate-y-0.5"
                        style={ctaStyle}
                      >
                        ✓ Acessar meu app →
                      </Link>
                    ) : (
                      <a
                        href={`/cadastro/${p.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-center text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase leading-tight tracking-wide transition hover:-translate-y-0.5"
                        style={ctaStyle}
                      >
                        {CTA_TOPO}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GARANTIA + WHATSAPP com urgência */}
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border p-6" style={{ borderColor: C.line, background: C.cardStrong }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" style={{ color: C.cta }} />
              <p className="font-display text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.ink }}>Garantia real de {TRIAL_DAYS} dias</p>
            </div>
            <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
              Você entra, testa tudo, e só assina se quiser continuar. Sem cartão no cadastro, sem cobrança escondida.
            </p>
          </div>
          <div className="rounded-3xl border-2 p-6" style={{ borderColor: C.orange, background: "rgba(234,88,12,0.08)" }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6" style={{ color: C.orange }} />
              <p className="font-display text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.ink }}>Grupo VIP no WhatsApp</p>
            </div>
            <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>
              Tira-dúvidas direto com a fundadora, atualizações em primeira mão e trocas entre colegas de plantão.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] lg:text-[13px] font-extrabold uppercase tracking-wide" style={{ background: C.orange, color: "#fff" }}>
              <Flame className="h-3.5 w-3.5" />
              Vagas limitadas nesta turma — o convite chega ao ativar seu teste
            </p>
          </div>
        </section>

        {/* INAUGURAÇÃO — vantagens de entrar agora (sem depoimentos até termos casos reais) */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Inauguração</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              {t("inauguracao_titulo", "Por que entrar agora, na turma de inauguração")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm lg:text-base" style={{ color: C.inkSoft }}>
              {t(
                "inauguracao_sub",
                "A ADEC está sendo inaugurada. Quem entra agora ajuda a moldar o app e recebe tudo o que for lançado dentro da sua academia.",
              )}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Star,
                title: "Acesso de fundadora",
                desc: "Seu preço de entrada é mantido enquanto a assinatura estiver ativa, mesmo com novos módulos chegando.",
              },
              {
                icon: MessageCircle,
                title: "Canal direto com a autora",
                desc: "Pediu, foi analisado: nesta fase suas sugestões entram na fila de desenvolvimento com prioridade.",
              },
              {
                icon: ShieldCheck,
                title: "Teste sem risco",
                desc: `${TRIAL_DAYS} dias grátis, sem cartão no cadastro. Você usa no plantão de verdade antes de decidir.`,
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex flex-col rounded-3xl border p-6 backdrop-blur"
                style={{ borderColor: C.line, background: C.card }}
              >
                <c.icon className="h-6 w-6" style={{ color: C.gold }} />
                <h3 className="mt-3 font-display text-lg font-extrabold" style={{ color: C.cta }}>{c.title}</h3>
                <p className="mt-2 text-sm lg:text-base" style={{ color: C.inkSoft }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SOBRE A AUTORA */}
        <section className="mt-16 overflow-hidden rounded-[2rem] border p-8 md:p-12" style={{ borderColor: C.line, background: C.cardStrong }}>
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Sobre a autora</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
              Conheça um pouco da minha História
            </h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
            <div className="mx-auto lg:mx-0">
              <div className="overflow-hidden rounded-3xl border-2 shadow-xl" style={{ borderColor: C.goldBright }}>
                <img src={fotoFundadora.url} alt="Fundadora — Academia da Enfermagem" className="h-56 w-56 object-cover lg:h-60 lg:w-60" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.cta }}>A História</h3>
                <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl leading-relaxed" style={{ color: C.inkSoft }}>
                  A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e Enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: A assistência aos pacientes.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.cta }}>O Propósito</h3>
                <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl leading-relaxed" style={{ color: C.inkSoft }}>
                  Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem administrativa e prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: C.cta }}>Minha Promessa</h3>
                <p className="mt-2 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl leading-relaxed" style={{ color: C.inkSoft }}>
                  A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!
                </p>
              </div>

              <Link
                to="/minha-historia"
                className="inline-flex items-center gap-1.5 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-bold underline underline-offset-4 transition hover:opacity-80"
                style={{ color: C.cta }}
              >
                Ler minha história completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>Dúvidas frequentes</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
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
                a: "Assim que ativar seu acesso, o convite do grupo aparece dentro do app. As vagas de cada turma são limitadas.",
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
                style={{ borderColor: C.line, background: C.card }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold marker:hidden" style={{ color: C.ink }}>
                  <span>{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition group-open:rotate-45" style={{ background: "rgba(13,59,46,0.12)", color: C.cta }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: C.inkSoft }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          className="relative mt-16 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-2xl md:p-14"
          style={{ background: `linear-gradient(135deg, ${C.cta} 0%, ${C.ctaHover} 100%)`, border: `2px solid ${C.goldBright}` }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(212,175,55,0.3)" }} />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(168,220,217,0.25)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] lg:text-[13px] font-extrabold uppercase tracking-widest" style={{ background: C.orange, color: "#fff" }}>
              <Clock className="h-3.5 w-3.5" />
              Vagas do Grupo VIP desta turma acabando
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl" style={{ color: "#fff" }}>
              Saia do próximo plantão no horário
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm md:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl" style={{ color: "rgba(255,255,255,0.85)" }}>
              Sem cartão de crédito. Sem fidelidade. Cancele quando quiser. Entre na turma de inauguração da ADEC.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {PLANOS.map((p) => {
                const subscribed = isSubscribed(p.slug);
                return (
                  <a
                    key={p.slug}
                    href={subscribed ? `/trilha/${p.slug}` : `/cadastro/${p.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left backdrop-blur transition hover:-translate-y-0.5"
                    style={{ borderColor: C.goldBright, background: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl lg:text-2xl lg:text-3xl" style={{ background: "rgba(212,175,55,0.25)" }}>
                        {p.emoji}
                      </span>
                      <div>
                        <p className="font-display text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl font-extrabold" style={{ color: "#fff" }}>{p.label}</p>
                        <p className="text-[11px] lg:text-[13px] font-extrabold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.8)" }}>
                          {subscribed ? "Acessar" : CTA_RODAPE}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color: C.goldBright }} />
                  </a>
                );
              })}
            </div>

            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] lg:text-[13px] font-extrabold uppercase tracking-wide" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.goldBright }} /> Compra 100% segura
            </p>
          </div>
        </section>

        <p className="mt-8 text-center text-[11px] lg:text-[13px]" style={{ color: C.inkSoft }}>
          ADEC · Academia da Enfermagem · academiadaenfermagem.com.br
        </p>
      </div>
    </div>
  );
}
