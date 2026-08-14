import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  GraduationCap,
  BookMarked,
  UserRound,
  CalendarCheck,
  CreditCard,
  WifiOff,
  RefreshCw,
  X,
  PartyPopper,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import logoAsset from "@/assets/logo.png.asset.json";
import fotoFundadora from "@/assets/foto-fundadora.jpeg.asset.json";
import {
  fetchSubscriptionPlans,
  fetchMyActiveSubscriptions,

} from "@/lib/access";
import { useAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";
import { CountUp, Marquee, Reveal, ShineCTA, StickyCTA, WordReveal } from "@/components/adec/fx";
import { PhoneMockup } from "@/components/adec/PhoneMockup";

const TRIAL_DAYS = 15;

/** Paleta original mantida: fundo verde água + CTA verde fechado + detalhes ouro + urgência laranja */
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
    Icon: GraduationCap,
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
    Icon: BookMarked,
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
    Icon: Stethoscope,
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
    Icon: UserRound,
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

const SEM_ADEC = [
  "Uma hora a mais no posto terminando anotação",
  "Caçar PDF de escala no meio do plantão",
  "Medo de errar diluição ou aprazamento",
  "Relatório de estágio feito de madrugada",
  "Insegurança sobre o que a COFEN exige",
];

const COM_ADEC = [
  "Anotação e evolução prontas em 2 cliques",
  "22+ escalas clínicas offline, na palma da mão",
  "Cálculo e aprazamento conferidos passo a passo",
  "Diário de bordo vira relatório em ABNT",
  "Conteúdo ancorado em COFEN, ANVISA, MS e OMS",
];

const SELOS = ["COFEN", "CORENs", "ANVISA", "Ministério da Saúde", "OMS", "PCDT atualizados"];

/** Mini cards: título do conteúdo + uma linha do que se faz nele. */
const CONTEUDOS_MINI_APPS: { t: string; d: string }[] = [
  { t: "Anamnese", d: "Roteiro de entrevista para colher a história do paciente sem esquecer nada." },
  { t: "Exame Físico", d: "Avaliação cefalocaudal passo a passo, com o que registrar em cada segmento." },
  { t: "Diagnósticos de Enfermagem", d: "Dos sinais e sintomas marcados ao diagnóstico correto, com base científica." },
  { t: "Evolução de Enfermagem", d: "Modelo pronto para descrever o turno de forma técnica e segura." },
  { t: "Cálculos de Medicamentos", d: "Dose, diluição, gotejamento e bomba de infusão conferidos na hora." },
  { t: "Farmacologia Clínica", d: "Catálogo A-Z com indicação, cuidados de enfermagem e sinais de alerta." },
  { t: "Sinais Vitais", d: "Valores normais de adulto, idoso, criança e gestante — e quando é alerta." },
  { t: "Escalas Clínicas", d: "22+ escalas (Braden, Glasgow, Morse, dor) prontas para pontuar offline." },
  { t: "Punção Venosa e Flebite", d: "Punção ilustrada passo a passo e os graus de flebite com fotos reais." },
  { t: "Cateterismo Vesical", d: "SVD/SVA feminino e masculino com técnica estéril imagem por imagem." },
  { t: "SNG e Dispositivos", d: "Sonda enteral, TQT, CVC, PICC e dreno: fixação, higiene e complicações." },
  { t: "Curativos e Feridas", d: "Escolha da cobertura certa e a técnica correta para cada tipo de lesão." },
  { t: "IRAS e Precauções", d: "Isolamentos, paramentação e bundles para não levar infecção ao paciente." },
  { t: "Segurança do Paciente", d: "As metas internacionais aplicadas à rotina, sem teoria solta." },
  { t: "Sepse e Deterioração", d: "Triagem NEWS2, pacote da 1ª hora e o que o enfermeiro faz em cada passo." },
  { t: "Sala de PCR e Carro de Emergência", d: "Conferência da sala, checklist do carro e sua função na parada." },
  { t: "Simulações Clínicas", d: "Casos reais para treinar raciocínio clínico antes de encarar o leito." },
  { t: "Quizzes e Simulados", d: "Questões por tema com correção na hora e ranking nacional." },
  { t: "Obstetrícia, Saúde Mental e Idoso", d: "Cuidados específicos de cada público explicados de forma prática." },
  { t: "Manual de Sobrevivência no Estágio", d: "Mochila, postura e comunicação com o preceptor desde o 1º dia." },
  { t: "Certificados", d: "Emissão de certificado ao concluir as trilhas dos módulos." },
];

/** Os três recursos que geram documento pronto automaticamente. */
const AUTOMATICOS = [
  {
    Icon: Brain,
    title: "SAE Descomplicada e Automatizada",
    para: "Acadêmico e Enfermeiro",
    como:
      "Você marca os sinais e sintomas do paciente (ou dita por voz) e o app cruza tudo com o banco autoral da ADEC, devolvendo o Processo de Enfermagem completo.",
    passos: [
      "Marque ou dite as evidências clínicas do paciente",
      "O app sugere diagnósticos com o mecanismo científico por trás",
      "Prescrição, aprazamento e prioridade clínica saem prontos em PDF/DOC",
    ],
  },
  {
    Icon: ClipboardList,
    title: "Anotação de Enfermagem Automatizada",
    para: "Técnico e Estudante de Técnico",
    como:
      "Durante o plantão você vai marcando o que fez em cada paciente, em abas separadas. No fim, a anotação técnica já está escrita.",
    passos: [
      "Um paciente por aba, sem misturar informação",
      "Tudo que você marca vira rascunho salvo no aparelho",
      "Clique em gerar e a anotação sai pronta para copiar ou baixar",
    ],
  },
  {
    Icon: BookOpen,
    title: "Diário de Bordo → Relatório em ABNT",
    para: "Acadêmico em estágio",
    como:
      "Você registra o dia de estágio em poucas linhas e o app transforma esses registros no relatório formatado nas normas ABNT.",
    passos: [
      "Anote o que viu e fez a cada dia de estágio",
      "O app organiza por data, campo e competência",
      "Gere o relatório final em ABNT sem virar a madrugada",
    ],
  },
];


export const Route = createFileRoute("/adec")({
  head: () => {
    const title = "Inauguração da ADEC — Academia da Enfermagem | 15 dias grátis";
    const description =
      "Inauguração da ADEC: 4 apps de suporte à decisão clínica para acadêmicos, técnicos e enfermeiros. Anotação automática, SAE, cálculos e escalas. 15 dias grátis, sem cartão.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://academiadaenfermagem.com.br/adec" },
        { property: "og:locale", content: "pt_BR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/adec" }],
      scripts: [
        {
          children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '2479743902438109');fbq('track', 'PageView');`,
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ADEC — Academia da Enfermagem",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web, Android, iOS",
            url: "https://academiadaenfermagem.com.br/adec",
            inLanguage: "pt-BR",
            description,
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              category: "subscription",
              availability: "https://schema.org/InStock",
              url: "https://academiadaenfermagem.com.br/adec",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Preciso de cartão de crédito para testar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. O teste de 15 dias é liberado no cadastro, sem cartão de crédito.",
                },
              },
              {
                "@type": "Question",
                name: "Para quem é a ADEC?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Para acadêmicos de enfermagem, estudantes de técnico, técnicos em enfermagem e enfermeiros, com uma academia específica para cada fase profissional.",
                },
              },
              {
                "@type": "Question",
                name: "O conteúdo é baseado em quê?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Todo o conteúdo é construído com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS, com atualização contínua.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: AdecPage,
});

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.ink }}>
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base" style={{ color: C.inkSoft }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

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

  const isSubscribed = (slug: string) => {
    const s = (subsQ.data ?? []).find((x) => x.plan_slug === slug);
    return !!s && (s.status === "active" || s.status === "trial");
  };

  const ctaStyle: React.CSSProperties = {
    background: C.cta,
    color: "#fff",
    boxShadow: "0 14px 34px -14px rgba(13,59,46,0.7)",
  };

  const chips = [
    { Icon: CalendarCheck, label: `${TRIAL_DAYS} dias grátis` },
    { Icon: CreditCard, label: "Sem cartão no cadastro" },
    { Icon: WifiOff, label: "Funciona offline" },
    { Icon: RefreshCw, label: "Atualizações contínuas" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${C.aquaTop} 0%, ${C.aquaBottom} 100%)`,
        color: C.ink,
      }}
    >
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src="https://www.facebook.com/tr?id=2479743902438109&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Camadas de luz em movimento (mesma paleta, só profundidade) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="adec-drift-a absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: "rgba(255,255,255,0.75)" }}
        />
        <div
          className="adec-drift-b absolute -right-40 top-24 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: "rgba(212,175,55,0.28)" }}
        />
        <div
          className="adec-drift-a absolute bottom-0 left-1/3 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: "rgba(13,59,46,0.14)" }}
        />
        <div className="adec-grain absolute inset-0 opacity-[0.06] mix-blend-multiply" />
      </div>

      {/* Barra de urgência */}
      <div
        className="relative w-full overflow-hidden px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-widest md:text-xs"
        style={{ background: C.orange, color: "#fff" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          <PartyPopper className="h-3.5 w-3.5" />
          Inauguração da ADEC — turma fundadora aberta: comece hoje com {TRIAL_DAYS} dias grátis
        </span>
        <span
          className="adec-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
          <img src={logoAsset.url} alt="ADEC" className="h-10 w-auto" />
        </Link>
        <Link
          to="/"
          className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition hover:bg-white/60"
          style={{ borderColor: C.line, color: C.cta, background: "rgba(255,255,255,0.5)" }}
        >
          Loja completa
        </Link>
      </header>

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-8">
        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-[2.5rem] border p-8 md:p-12"
          style={{ borderColor: C.line, background: C.card, backdropFilter: "blur(14px)" }}
        >
          <div
            className="adec-drift-b pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
            style={{ background: "rgba(212,175,55,0.28)" }}
          />
          <div
            className="adec-drift-a pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl"
            style={{ background: "rgba(255,255,255,0.7)" }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_auto]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.img
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src={logoAsset.url}
                alt="ADEC — Avaliação Diagnóstica em Enfermagem Clínica"
                className="h-28 w-auto drop-shadow-xl md:h-36"
              />

              <p
                className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.35em] md:text-xs"
                style={{ color: C.gold }}
              >
                Avaliação Diagnóstica em Enfermagem Clínica
              </p>
              <div
                className="mt-1 h-px w-40"
                style={{ background: `linear-gradient(90deg, transparent, ${C.goldBright}, transparent)` }}
              />

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest"
                style={{ background: C.orange, color: "#fff", boxShadow: "0 0 0 0 rgba(234,88,12,0.6)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t("hero_selo", "Inauguração oficial — estamos abrindo as portas")}
              </motion.span>

              <WordReveal
                text={t(
                  "hero_title",
                  "A ADEC está sendo inaugurada: automatize suas anotações com 2 cliques e foque no paciente.",
                )}
                delay={0.2}
                className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl"
                style={{ color: C.ink }}
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-5 max-w-2xl text-base font-medium md:text-lg"
                style={{ color: C.inkSoft }}
              >
                {t(
                  "hero_sub",
                  "Você já saiu do plantão com a sensação de que passou mais tempo preenchendo papel do que cuidando? Ou teve aquele medo de errar um cálculo de medicação na correria? Se sim, você não está sozinha. Milhares de enfermeiras vivem isso todos os dias.",
                )}
              </motion.p>

              <div className="mt-8">
                <ShineCTA href="#planos" style={ctaStyle}>
                  <Sparkles className="h-4 w-4" style={{ color: C.goldBright }} />
                  {CTA_TOPO}
                </ShineCTA>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold md:text-sm" style={{ color: C.orange }}>
                <Sparkles className="h-3.5 w-3.5" />
                {LANCAMENTO}: os primeiros assinantes entram com acesso completo e canal direto com a autora
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
                {chips.map((c, i) => (
                  <motion.span
                    key={c.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold backdrop-blur"
                    style={{ borderColor: C.line, background: "rgba(255,255,255,0.7)", color: C.ink }}
                  >
                    <c.Icon className="h-3.5 w-3.5" style={{ color: C.cta }} />
                    {c.label}
                  </motion.span>
                ))}
              </div>

              <p className="mt-6 flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.inkSoft }}>
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.gold }} />
                Compra segura · PIX ou cartão só depois do teste
              </p>
            </div>

            <PhoneMockup ink={C.ink} cta={C.cta} gold={C.goldBright} line={C.line} />
          </div>
        </section>

        {/* SELOS EM MARQUEE */}
        <section
          className="mt-6 overflow-hidden rounded-3xl border py-4 backdrop-blur"
          style={{ borderColor: C.line, background: C.card }}
        >
          <p className="mb-2 text-center text-[10px] font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
            Base legal e científica
          </p>
          <Marquee items={SELOS} color={C.cta} />
        </section>

        {/* CREDIBILIDADE — números animados */}
        <section
          className="mt-6 rounded-3xl border p-5 backdrop-blur"
          style={{ borderColor: C.line, background: C.card }}
        >
          <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>
            Conteúdo construído por quem vive o plantão e o consultório
          </p>
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            {[
              { v: 35, suf: " anos", l: "De vivência em enfermagem" },
              { v: 60, suf: "+", l: "MSDC — Módulos de Suporte à Decisão Clínica" },
              { v: 22, suf: "+", l: "Escalas clínicas" },
              { v: 100, suf: "%", l: "Base COFEN / COREN" },
            ].map((s) => (
              <div key={s.l} className="min-w-[140px]">
                <CountUp
                  value={s.v}
                  suffix={s.suf}
                  className="font-display text-3xl font-extrabold md:text-4xl"
                  style={{ color: C.cta }}
                />
                <p
                  className="mt-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: C.inkSoft }}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="mt-16">
          <SectionTitle eyebrow="Para quem é" title="Escolha o app da sua fase profissional" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANOS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="h-full rounded-2xl border p-5 backdrop-blur"
                  style={{ borderColor: C.line, background: C.card, boxShadow: "0 18px 40px -30px rgba(13,59,46,0.8)" }}
                >
                  <div
                    className="grid h-12 w-12 place-items-center rounded-xl"
                    style={{ background: "rgba(212,175,55,0.22)", color: C.cta }}
                  >
                    <p.Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 font-display text-base font-extrabold leading-tight" style={{ color: C.ink }}>
                    {p.label}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: C.inkSoft }}>
                    {p.tag}
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: C.gold }}>
                    {p.dor}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mt-16">
          <SectionTitle
            eyebrow="O que muda na sua vida"
            title="Não é só um app. É o seu plantão de volta."
            sub="Cada módulo resolve uma dor concreta do plantão, do consultório ou da prova — com base em evidência científica."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS_SHOWCASE.map((m, i) => (
              <Reveal key={m.title} delay={(i % 3) * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="h-full rounded-2xl border p-5 backdrop-blur"
                  style={{ borderColor: C.line, background: C.card }}
                >
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "rgba(13,59,46,0.1)", color: C.cta }}
                  >
                    <m.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-display text-base font-extrabold" style={{ color: C.ink }}>
                    {m.title}
                  </p>
                  <p className="mt-1.5 text-sm" style={{ color: C.inkSoft }}>
                    {m.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              {
                eyebrow: "Base de dados",
                title: "Resoluções, normas, diretrizes e protocolos atualizados",
                desc: "COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia.",
              },
              {
                eyebrow: "Extra",
                title: "Com certificação opcional",
                desc: "Trilhas com emissão de certificado ao concluir os módulos.",
              },
            ].map((b, i) => (
              <Reveal key={b.eyebrow} delay={i * 0.08}>
                <div
                  className="h-full rounded-2xl border p-5 backdrop-blur"
                  style={{ borderColor: C.line, background: "rgba(212,175,55,0.14)" }}
                >
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>
                    {b.eyebrow}
                  </p>
                  <p className="mt-2 font-display text-lg font-extrabold" style={{ color: C.ink }}>
                    {b.title}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: C.inkSoft }}>
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <ShineCTA href="#planos" style={ctaStyle}>
              {CTA_MEIO}
              <ArrowRight className="h-4 w-4" style={{ color: C.goldBright }} />
            </ShineCTA>
          </Reveal>
        </section>

        {/* CONTEÚDOS DOS MINI APPS */}
        <section className="mt-16">
          <SectionTitle
            eyebrow="Conteúdos"
            title="O que você encontra dentro dos Mini Apps"
            sub="Cada Mini App é um tema resolvido, direto ao ponto, para usar no plantão, no estágio ou na prova."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONTEUDOS_MINI_APPS.map((c, i) => (
              <Reveal key={c.t} delay={(i % 3) * 0.06}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="h-full rounded-xl border p-4 backdrop-blur"
                  style={{ borderColor: C.line, background: C.card }}
                >
                  <p className="font-display text-sm font-extrabold leading-tight" style={{ color: C.ink }}>
                    {c.t}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: C.inkSoft }}>
                    {c.d}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 3 APPS AUTOMÁTICOS */}
        <section className="mt-16">
          <SectionTitle
            eyebrow="Exclusivo ADEC"
            title="Os 3 automáticos: o app escreve por você"
            sub="São três ferramentas que transformam o que você marcou em documento pronto — sem digitar tudo de novo."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {AUTOMATICOS.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="relative h-full overflow-hidden rounded-2xl border-2 p-6 backdrop-blur"
                  style={{
                    borderColor: C.goldBright,
                    background: C.cardStrong,
                    boxShadow: "0 24px 50px -30px rgba(13,59,46,0.9)",
                  }}
                >
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest"
                    style={{ background: "rgba(212,175,55,0.25)", color: C.gold }}
                  >
                    Automático
                  </span>
                  <div
                    className="grid h-12 w-12 place-items-center rounded-xl"
                    style={{ background: C.cta, color: C.goldBright }}
                  >
                    <a.Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 font-display text-lg font-extrabold leading-tight" style={{ color: C.ink }}>
                    {a.title}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide" style={{ color: C.gold }}>
                    {a.para}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                    {a.como}
                  </p>
                  <ol className="mt-4 space-y-2">
                    {a.passos.map((p, n) => (
                      <li key={p} className="flex items-start gap-2 text-sm" style={{ color: C.ink }}>
                        <span
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-extrabold"
                          style={{ background: "rgba(13,59,46,0.1)", color: C.cta }}
                        >
                          {n + 1}
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>



        {/* COMPARATIVO SEM x COM */}
        <section className="mt-16">
          <SectionTitle
            eyebrow="A diferença"
            title="Seu plantão sem a ADEC e com a ADEC"
            sub="Mesma carga de trabalho. Duas experiências completamente diferentes."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div
                className="h-full rounded-3xl border p-6"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.45)" }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color: C.inkSoft }}>
                  Sem a ADEC
                </p>
                <ul className="mt-4 space-y-3">
                  {SEM_ADEC.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm" style={{ color: C.inkSoft }}>
                      <X className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.orange }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div
                className="relative h-full overflow-hidden rounded-3xl border-2 p-6"
                style={{
                  borderColor: C.goldBright,
                  background: C.cardStrong,
                  boxShadow: "0 26px 70px -36px rgba(13,59,46,0.8)",
                }}
              >
                <div
                  className="adec-drift-b pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
                  style={{ background: "rgba(212,175,55,0.3)" }}
                />
                <p className="relative text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color: C.gold }}>
                  Com a ADEC
                </p>
                <ul className="relative mt-4 space-y-3">
                  {COM_ADEC.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm font-semibold" style={{ color: C.ink }}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.cta }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PLANTÃO COM A ACADEMIA */}
        <section
          className="mt-16 overflow-hidden rounded-3xl border p-8 md:p-12"
          style={{ borderColor: C.line, background: C.cardStrong }}
        >
          <SectionTitle eyebrow="Na prática" title="Plantão com a Academia" />
          <ul className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              "Você sai no horário: anotação e evolução saem prontas do que você já avaliou",
              "Dorme tranquila: medicação e aprazamento conferidos pelas metas de segurança",
              "Nunca mais trava na frente do papel: SAE e prescrição por paciente",
              "Decide rápido na beira do leito: 22+ escalas clínicas, offline",
              "Encara qualquer procedimento com confiança: passo a passo antes de começar",
            ].map((b, i) => (
              <Reveal key={b} delay={i * 0.06}>
                <li
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ borderColor: C.line, background: "rgba(255,255,255,0.65)" }}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.cta }} />
                  <span className="text-base font-medium" style={{ color: C.ink }}>
                    {b}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* PLANOS */}
        <section id="planos" className="mt-16 scroll-mt-16">
          <SectionTitle
            eyebrow="Escolha seu app"
            title={t("planos_title", "4 apps, um só padrão de excelência")}
            sub={`${TRIAL_DAYS} dias grátis, sem cartão. Cancele quando quiser.`}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PLANOS.map((p, i) => {
              const subscribed = isSubscribed(p.slug);
              const destacado = i === 3;

              return (
                <Reveal key={p.slug} delay={i * 0.08} className="h-full">
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative flex h-full flex-col rounded-3xl border p-6 backdrop-blur"
                    style={{
                      borderColor: destacado ? C.goldBright : C.line,
                      background: destacado ? "rgba(255,255,255,0.9)" : C.card,
                      boxShadow: destacado
                        ? "0 26px 70px -26px rgba(13,59,46,0.55)"
                        : "0 18px 44px -32px rgba(13,59,46,0.8)",
                    }}
                  >
                    {destacado && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow"
                        style={{ background: C.orange, color: "#fff" }}
                      >
                        + escolhido
                      </span>
                    )}

                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl"
                      style={{ background: "rgba(212,175,55,0.22)", color: C.cta }}
                    >
                      <p.Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-4 font-display text-lg font-extrabold leading-tight" style={{ color: C.ink }}>
                      {p.label}
                    </h3>
                    <p className="mt-1 text-xs font-semibold" style={{ color: C.inkSoft }}>
                      {p.tag}
                    </p>
                    <p className="mt-2 text-sm font-semibold" style={{ color: C.gold }}>
                      {p.dor}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold" style={{ color: C.ink }}>
                          R$ 0,00
                        </span>
                        <span className="text-xs font-bold" style={{ color: C.inkSoft }}>
                          /mês
                        </span>
                      </div>

                      <p
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide"
                        style={{ color: C.orange }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {TRIAL_DAYS} dias grátis · sem cartão
                      </p>

                      <p
                        className="mt-2 rounded-lg px-2 py-1.5 text-[11px] font-bold leading-snug"
                        style={{ background: "rgba(212,175,55,0.16)", color: C.ink }}
                      >
                        Período de teste grátis, 15 dias, para quem acessar entre os dias 10.08.2026 a 10.09.2026
                      </p>
                    </div>


                    <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: C.line }}>
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-xs" style={{ color: C.inkSoft }}>
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
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-extrabold transition hover:-translate-y-0.5"
                          style={ctaStyle}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Acessar meu app →
                        </Link>
                      ) : (
                        <a
                          href={`/cadastro/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-center text-xs font-extrabold uppercase leading-tight tracking-wide transition hover:-translate-y-0.5"
                          style={ctaStyle}
                        >
                          {CTA_TOPO}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </section>
        
        {/* Banner Certificados Reconhecidos */}
        <section className="mt-12 overflow-hidden rounded-[2rem] border-2 border-[#b8912f] bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0d3b2e] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f0d489]">
              <Award className="h-4 w-4" /> Certificados reconhecidos
            </div>
            <p className="mt-4 max-w-2xl text-sm font-medium text-[#0b3229]/80">
              Nossos certificados possuem validade em todo território nacional para comprovação de horas complementares e atualização profissional.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="group relative">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#b8912f]">Frente (Modelo)</p>
                <div className="overflow-hidden rounded-xl border border-[#b8912f]/30 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative block w-full outline-none">
                        <img 
                          src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/lovable-uploads/763be538-348e-4903-888f-013697669d72.png" 
                          alt="Modelo Frente do Certificado ADEC" 
                          className="h-auto w-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:rounded-none">
                      <div className="relative p-2">
                        <img 
                          src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/lovable-uploads/763be538-348e-4903-888f-013697669d72.png" 
                          alt="Modelo Frente do Certificado ADEC" 
                          className="h-auto w-full rounded-lg shadow-2xl"
                        />
                        <DialogClose className="absolute -top-10 right-0 text-white hover:text-white/80">
                          <X className="h-8 w-8" />
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="group relative">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#b8912f]">Verso (Modelo)</p>
                <div className="overflow-hidden rounded-xl border border-[#b8912f]/30 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative block w-full outline-none">
                        <img 
                          src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/lovable-uploads/3879201a-640a-4a6c-9a40-e260c6d57335.png" 
                          alt="Modelo Verso do Certificado ADEC" 
                          className="h-auto w-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:rounded-none">
                      <div className="relative p-2">
                        <img 
                          src="https://id-preview--ee1abee9-28d3-4826-82bc-7387b3880d45.lovable.app/lovable-uploads/3879201a-640a-4a6c-9a40-e260c6d57335.png" 
                          alt="Modelo Verso do Certificado ADEC" 
                          className="h-auto w-full rounded-lg shadow-2xl"
                        />
                        <DialogClose className="absolute -top-10 right-0 text-white hover:text-white/80">
                          <X className="h-8 w-8" />
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GARANTIA + WHATSAPP */}
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border p-6" style={{ borderColor: C.line, background: C.cardStrong }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" style={{ color: C.cta }} />
                <p className="font-display text-lg font-extrabold" style={{ color: C.ink }}>
                  Garantia real de {TRIAL_DAYS} dias
                </p>
              </div>
              <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>
                Você entra, testa tudo, e só assina se quiser continuar. Sem cartão no cadastro, sem cobrança escondida.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="h-full rounded-3xl border-2 p-6"
              style={{ borderColor: C.orange, background: "rgba(234,88,12,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6" style={{ color: C.orange }} />
                <p className="font-display text-lg font-extrabold" style={{ color: C.ink }}>
                  Grupo VIP no WhatsApp
                </p>
              </div>
              <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>
                Tira-dúvidas direto com a fundadora, atualizações em primeira mão e trocas entre colegas de plantão.
              </p>
              <p
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide"
                style={{ background: C.orange, color: "#fff" }}
              >
                <Flame className="h-3.5 w-3.5" />
                Grupo VIP da inauguração — o convite chega ao ativar seu teste
              </p>
            </div>
          </Reveal>
        </section>

        {/* INAUGURAÇÃO */}
        <section className="mt-16">
          <SectionTitle
            eyebrow="Inauguração"
            title={t("inauguracao_titulo", "Por que entrar agora, na turma de inauguração")}
            sub={t(
              "inauguracao_sub",
              "A ADEC está sendo inaugurada. Quem entra agora ajuda a moldar o app e recebe tudo o que for lançado dentro da sua academia.",
            )}
          />
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
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex h-full flex-col rounded-3xl border p-6 backdrop-blur"
                  style={{ borderColor: C.line, background: C.card }}
                >
                  <c.icon className="h-6 w-6" style={{ color: C.gold }} />
                  <h3 className="mt-3 font-display text-lg font-extrabold" style={{ color: C.cta }}>
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>
                    {c.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SOBRE A AUTORA */}
        <section
          className="mt-16 overflow-hidden rounded-[2rem] border p-8 md:p-12"
          style={{ borderColor: C.line, background: C.cardStrong }}
        >
          <SectionTitle eyebrow="Sobre a autora" title="Conheça um pouco da minha História" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
            <Reveal className="mx-auto lg:mx-0">
              <div className="overflow-hidden rounded-3xl border-2 shadow-xl" style={{ borderColor: C.goldBright }}>
                <img
                  src={fotoFundadora.url}
                  alt="Fundadora — Academia da Enfermagem"
                  className="h-56 w-56 object-cover lg:h-60 lg:w-60"
                />
              </div>
            </Reveal>

            <div className="space-y-6">
              {[
                {
                  h: "A História",
                  p: "A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e Enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: A assistência aos pacientes.",
                },
                {
                  h: "O Propósito",
                  p: "Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem administrativa e prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho.",
                },
                {
                  h: "Minha Promessa",
                  p: "A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!",
                },
              ].map((b, i) => (
                <Reveal key={b.h} delay={i * 0.08}>
                  <h3 className="font-display text-xl font-extrabold" style={{ color: C.cta }}>
                    {b.h}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: C.inkSoft }}>
                    {b.p}
                  </p>
                </Reveal>
              ))}

              <Link
                to="/minha-historia"
                className="inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4 transition hover:opacity-80"
                style={{ color: C.cta }}
              >
                Ler minha história completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <SectionTitle eyebrow="Dúvidas frequentes" title="Antes de decidir" />
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
              <Reveal key={f.q} delay={i * 0.04}>
                <details
                  className="group rounded-2xl border p-5 backdrop-blur transition"
                  style={{ borderColor: C.line, background: C.card }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-extrabold marker:hidden md:text-base"
                    style={{ color: C.ink }}
                  >
                    <span>{f.q}</span>
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition group-open:rotate-45"
                      style={{ background: "rgba(13,59,46,0.12)", color: C.cta }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm" style={{ color: C.inkSoft }}>
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          className="relative mt-16 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-2xl md:p-14"
          style={{ background: `linear-gradient(135deg, ${C.cta} 0%, ${C.ctaHover} 100%)`, border: `2px solid ${C.goldBright}` }}
        >
          <div
            className="adec-drift-b pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "rgba(212,175,55,0.3)" }}
          />
          <div
            className="adec-drift-a pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "rgba(168,220,217,0.25)" }}
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest"
              style={{ background: C.orange, color: "#fff" }}
            >
              <Clock className="h-3.5 w-3.5" />
              Turma de inauguração aberta agora
            </div>
            <Reveal>
              <h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl" style={{ color: "#fff" }}>
                Saia do próximo plantão no horário
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
                Sem cartão de crédito. Sem fidelidade. Cancele quando quiser. Entre na turma de inauguração da ADEC.
              </p>
            </Reveal>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {PLANOS.map((p, i) => {
                const subscribed = isSubscribed(p.slug);
                return (
                  <Reveal key={p.slug} delay={i * 0.07}>
                    <motion.a
                      href={subscribed ? `/trilha/${p.slug}` : `/cadastro/${p.slug}`}
                      whileHover={{ y: -4 }}
                      className="group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left backdrop-blur"
                      style={{ borderColor: C.goldBright, background: "rgba(255,255,255,0.1)" }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                          style={{ background: "rgba(212,175,55,0.25)", color: "#fff" }}
                        >
                          <p.Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-display text-sm font-extrabold" style={{ color: "#fff" }}>
                            {p.label}
                          </p>
                          <p
                            className="text-[11px] font-extrabold uppercase tracking-wide"
                            style={{ color: "rgba(255,255,255,0.8)" }}
                          >
                            {subscribed ? "Acessar" : CTA_RODAPE}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color: C.goldBright }} />
                    </motion.a>
                  </Reveal>
                );
              })}
            </div>

            <p
              className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}
            >
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.goldBright }} /> Compra 100% segura
            </p>
          </div>
        </section>

        <footer className="mt-8 text-center text-[11px]" style={{ color: C.inkSoft }}>
          <p className="mx-auto max-w-2xl leading-relaxed">
            Aviso Legal: ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do
            profissional, o exame do paciente nem as fontes oficiais (COFEN, COREN, MS, ANVISA).
          </p>
          <p className="mt-2">
            <Link to="/legal" className="font-extrabold underline" style={{ color: C.goldBright }}>
              Termos de Uso, Aviso Legal e Política de Privacidade
            </Link>
          </p>
          <p className="mt-2">ADEC · Academia da Enfermagem · academiadaenfermagem.com.br</p>
        </footer>
      </div>

      <StickyCTA
        href="#planos"
        label={CTA_TOPO}
        hint={`${LANCAMENTO} · ${TRIAL_DAYS} dias grátis, sem cartão`}
        bg={C.cta}
        fg="rgba(255,255,255,0.9)"
        accent={C.goldBright}
      />
    </div>
  );
}
