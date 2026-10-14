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

  fetchMyActiveSubscriptions,

} from "@/lib/access";
import { useAppTexts } from "@/lib/app-texts";
import { supabase } from "@/integrations/supabase/client";
import { Marquee, Reveal, ShineCTA, StickyCTA, WordReveal } from "@/components/adec/fx";
import { ANNUAL_PLANS, isAnnualPlan } from "@/lib/annual-plans";
import { formatPriceBRL } from "@/lib/access";
import { safeLandingUrl } from "@/lib/adec-editor";
import { PhoneMockup } from "@/components/adec/PhoneMockup";



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

export const Route = createFileRoute("/adec")({
  head: () => {
    const title = "ADEC — Academia da Enfermagem | Acesso anual";
    const description =
      "ADEC: 4 academias de suporte à decisão clínica para acadêmicos, técnicos e enfermeiros. Anotação automática, SAE, cálculos e escalas. Acesso anual a partir de R$ 37,99.";
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
                name: "Como adquirir o acesso anual?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Escolha uma academia, identifique sua conta e pague pelo Mercado Pago. Acesso liberado após confirmação por 365 dias.",
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

  
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions, enabled: isLoggedIn });
  const textsQ = useAppTexts();
  const t = (k: string, fb: string) => textsQ.data?.[`vendas.${k}`] ?? fb;

const CTA_TOPO = t("pagina_3", "ADQUIRIR ACESSO ANUAL →");
const CTA_MEIO = t("pagina_4", "SIM, QUERO TRANSFORMAR MEU PLANTÃO");
const CTA_RODAPE = t("pagina_5", "ESCOLHER MINHA ACADEMIA →");

/** Fase de inauguração: sem números de usuários e sem depoimentos até termos casos reais. */


const PLANOS = [
  {
    slug: "academico",
    Icon: GraduationCap,
    label: t("pagina_7", "Academia do Acadêmico"),
    tag: t("pagina_8", "Para o graduando de Enfermagem"),
    dor: t("pagina_9", "Do primeiro ao último estágio, sem sofrer."),
    bullets: [
      t("pagina_10", "Chegue no estágio sabendo exatamente o que fazer"),
      t("pagina_11", "Escalas clínicas na mão — sem caçar PDF na hora"),
      t("pagina_12", "Procedimentos passo a passo antes de encostar no paciente"),
      t("pagina_13", "Obstetrícia, saúde mental e IRAS explicados de verdade"),
      t("pagina_14", "Passe nas provas sem abrir mão do seu descanso"),
    ],
  },
  {
    slug: "tecnico-estudante",
    Icon: BookMarked,
    label: t("pagina_15", "Estudante de Técnico"),
    tag: t("pagina_16", "Para quem ainda está no curso técnico"),
    dor: t("pagina_17", "Passa na prova, encara o campo com confiança."),
    bullets: [
      t("pagina_18", "Reconheça sinais de alerta sem travar na hora"),
      t("pagina_19", "Nunca mais tenha medo de errar uma medicação"),
      t("pagina_20", "Simulações reais de plantão para perder o nervosismo"),
      t("pagina_21", "Checklists que evitam o famoso branco no campo"),
      t("pagina_22", "Passe nas provas sem abrir mão do seu descanso"),
    ],
  },
  {
    slug: "tecnico",
    Icon: Stethoscope,
    label: t("pagina_23", "Academia do Técnico"),
    tag: t("pagina_24", "Para o Técnico em Enfermagem atuando"),
    dor: t("pagina_25", "Prática segura, plantão tranquilo."),
    bullets: [
      t("pagina_26", "Ganhe horas de sono no pós-plantão com anotação automática"),
      t("pagina_27", "Vários pacientes organizados por abas, sem se perder"),
      t("pagina_28", "Nunca mais tenha medo de errar uma medicação"),
      t("pagina_29", "Saia do plantão no horário, com tudo registrado"),
      t("pagina_30", "Passe nas provas sem abrir mão do seu descanso"),
    ],
  },
  {
    slug: "enfermeiro",
    Icon: UserRound,
    label: t("pagina_31", "Academia do Enfermeiro"),
    tag: t("pagina_32", "Para o Enfermeiro assistencial e liderança"),
    dor: t("pagina_33", "Menos burocracia, mais assistência com tranquilidade."),
    bullets: [
      t("pagina_34", "Evolução e prescrição prontas em 2 cliques"),
      t("pagina_35", "Ganhe horas de sono no pós-plantão"),
      t("pagina_36", "Durma tranquila: tudo amparado por COFEN/COREN"),
      t("pagina_37", "Acompanhe o plantão inteiro sem perder nenhum registro"),
      t("pagina_38", "Passe nas provas e concursos sem abrir mão do descanso"),
    ],
  },
];

const MODULOS_SHOWCASE = [
  { icon: ClipboardList, title: t("pagina_39", "Ganhe horas de sono no pós-plantão"), desc: t("pagina_40", "A anotação técnica sai pronta enquanto você cuida. Você sai no horário e chega inteira em casa.") },
  { icon: BookOpen, title: t("pagina_41", "Nunca mais tenha medo de errar uma medicação"), desc: t("pagina_42", "Farmacologia, diluição e aprazamento conferidos para você agir com segurança na correria.") },
  { icon: Award, title: t("pagina_43", "Passe nas provas sem abrir mão do seu descanso"), desc: t("pagina_44", "Quizzes por tema com feedback imediato: estude pouco, fixe muito, durma bem.") },
  { icon: Brain, title: t("pagina_45", "Pare de travar na frente do papel"), desc: t("pagina_46", "A SAE monta diagnóstico e prescrição a partir dos sinais e sintomas que você marcou.") },
  { icon: HeartPulse, title: t("pagina_47", "Segurança na beira do leito"), desc: t("pagina_48", "22+ escalas clínicas prontas e offline — decisão rápida, sem insegurança.") },
  { icon: Stethoscope, title: t("pagina_49", "Confiança antes do procedimento"), desc: t("pagina_50", "Punção, SVD, SNG e curativos passo a passo, para você nunca mais ficar na dúvida.") },
];

const SEM_ADEC = [
  t("pagina_51", "Uma hora a mais no posto terminando anotação"),
  t("pagina_52", "Caçar PDF de escala no meio do plantão"),
  t("pagina_53", "Medo de errar diluição ou aprazamento"),
  t("pagina_54", "Relatório de estágio feito de madrugada"),
  t("pagina_55", "Insegurança sobre o que a COFEN exige"),
];

const COM_ADEC = [
  t("pagina_56", "Anotação e evolução prontas em 2 cliques"),
  t("pagina_57", "22+ escalas clínicas offline, na palma da mão"),
  t("pagina_58", "Cálculo e aprazamento conferidos passo a passo"),
  t("pagina_59", "Diário de bordo vira relatório em ABNT"),
  t("pagina_60", "Conteúdo ancorado em COFEN, ANVISA, MS e OMS"),
];

const SELOS = [t("pagina_61", "COFEN"), t("pagina_62", "CORENs"), t("pagina_63", "ANVISA"), t("pagina_64", "Ministério da Saúde"), t("pagina_65", "OMS"), t("pagina_66", "PCDT atualizados")];

/** Mini cards: título do conteúdo + uma linha do que se faz nele. */
const CONTEUDOS_MINI_APPS: { t: string; d: string }[] = [
  { t: t("pagina_67", "Anamnese"), d: t("pagina_68", "Roteiro de entrevista para colher a história do paciente sem esquecer nada.") },
  { t: t("pagina_69", "Exame Físico"), d: t("pagina_70", "Avaliação cefalocaudal passo a passo, com o que registrar em cada segmento.") },
  { t: t("pagina_71", "Diagnósticos de Enfermagem"), d: t("pagina_72", "Dos sinais e sintomas marcados ao diagnóstico correto, com base científica.") },
  { t: t("pagina_73", "Evolução de Enfermagem"), d: t("pagina_74", "Modelo pronto para descrever o turno de forma técnica e segura.") },
  { t: t("pagina_75", "Cálculos de Medicamentos"), d: t("pagina_76", "Dose, diluição, gotejamento e bomba de infusão conferidos na hora.") },
  { t: t("pagina_77", "Farmacologia Clínica"), d: t("pagina_78", "Catálogo A-Z com indicação, cuidados de enfermagem e sinais de alerta.") },
  { t: t("pagina_79", "Sinais Vitais"), d: t("pagina_80", "Valores normais de adulto, idoso, criança e gestante — e quando é alerta.") },
  { t: t("pagina_81", "Escalas Clínicas"), d: t("pagina_82", "22+ escalas (Braden, Glasgow, Morse, dor) prontas para pontuar offline.") },
  { t: t("pagina_83", "Punção Venosa e Flebite"), d: t("pagina_84", "Punção ilustrada passo a passo e os graus de flebite com fotos reais.") },
  { t: t("pagina_85", "Cateterismo Vesical"), d: t("pagina_86", "SVD/SVA feminino e masculino com técnica estéril imagem por imagem.") },
  { t: t("pagina_87", "SNG e Dispositivos"), d: t("pagina_88", "Sonda enteral, TQT, CVC, PICC e dreno: fixação, higiene e complicações.") },
  { t: t("pagina_89", "Curativos e Feridas"), d: t("pagina_90", "Escolha da cobertura certa e a técnica correta para cada tipo de lesão.") },
  { t: t("pagina_91", "IRAS e Precauções"), d: t("pagina_92", "Isolamentos, paramentação e bundles para não levar infecção ao paciente.") },
  { t: t("pagina_93", "Segurança do Paciente"), d: t("pagina_94", "As metas internacionais aplicadas à rotina, sem teoria solta.") },
  { t: t("pagina_95", "Sepse e Deterioração"), d: t("pagina_96", "Triagem NEWS2, pacote da 1ª hora e o que o enfermeiro faz em cada passo.") },
  { t: t("pagina_97", "Sala de PCR e Carro de Emergência"), d: t("pagina_98", "Conferência da sala, checklist do carro e sua função na parada.") },
  { t: t("pagina_99", "Simulações Clínicas"), d: t("pagina_100", "Casos reais para treinar raciocínio clínico antes de encarar o leito.") },
  { t: t("pagina_101", "Quizzes e Simulados"), d: t("pagina_102", "Questões por tema com correção na hora e ranking nacional.") },
  { t: t("pagina_103", "Obstetrícia, Saúde Mental e Idoso"), d: t("pagina_104", "Cuidados específicos de cada público explicados de forma prática.") },
  { t: t("pagina_105", "Manual de Sobrevivência no Estágio"), d: t("pagina_106", "Mochila, postura e comunicação com o preceptor desde o 1º dia.") },
  { t: t("pagina_107", "Certificados avulsos"), d: t("pagina_108", "Certificação opcional vendida separadamente; não incluída no acesso anual.") },
];

/** Os três recursos que geram documento pronto automaticamente. */
const AUTOMATICOS = [
  {
    Icon: Brain,
    title: t("pagina_109", "SAE Descomplicada e Automatizada"),
    para: t("pagina_110", "Acadêmico e Enfermeiro"),
    como:
      t("pagina_111", "Você marca os sinais e sintomas do paciente (ou dita por voz) e o app cruza tudo com o banco autoral da ADEC, devolvendo o Processo de Enfermagem completo."),
    passos: [
      t("pagina_112", "Marque ou dite as evidências clínicas do paciente"),
      t("pagina_113", "O app sugere diagnósticos com o mecanismo científico por trás"),
      t("pagina_114", "Prescrição, aprazamento e prioridade clínica saem prontos em PDF/DOC"),
    ],
  },
  {
    Icon: ClipboardList,
    title: t("pagina_115", "Anotação de Enfermagem Automatizada"),
    para: t("pagina_116", "Técnico e Estudante de Técnico"),
    como:
      t("pagina_117", "Durante o plantão você vai marcando o que fez em cada paciente, em abas separadas. No fim, a anotação técnica já está escrita."),
    passos: [
      t("pagina_118", "Um paciente por aba, sem misturar informação"),
      t("pagina_119", "Tudo que você marca vira rascunho salvo no aparelho"),
      t("pagina_120", "Clique em gerar e a anotação sai pronta para copiar ou baixar"),
    ],
  },
  {
    Icon: BookOpen,
    title: t("pagina_121", "Diário de Bordo → Relatório em ABNT"),
    para: t("pagina_122", "Acadêmico em estágio"),
    como:
      t("pagina_123", "Você registra o dia de estágio em poucas linhas e o app transforma esses registros no relatório formatado nas normas ABNT."),
    passos: [
      t("pagina_124", "Anote o que viu e fez a cada dia de estágio"),
      t("pagina_125", "O app organiza por data, campo e competência"),
      t("pagina_126", "Gere o relatório final em ABNT sem virar a madrugada"),
    ],
  },
];



  const isSubscribed = (slug: string) => {
    const s = (subsQ.data ?? []).find((x) => x.plan_slug === slug);
    return !!s && s.status === "active";
  };

  const ctaStyle: React.CSSProperties = {
    background: C.cta,
    color: "#fff",
    boxShadow: "0 14px 34px -14px rgba(13,59,46,0.7)",
  };

  const chips = [
    { Icon: CalendarCheck, label: t("chip_trial", "365 dias de acesso") },
    { Icon: CreditCard, label: t("pagina_127", "Pagamento único anual") },
    { Icon: WifiOff, label: t("pagina_128", "Funciona offline") },
    { Icon: RefreshCw, label: t("pagina_129", "Atualizações contínuas") },
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
          src={"https://www.facebook.com/tr?id=2479743902438109&ev=PageView&noscript=1"}
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

      {/* Banner superior da plataforma */}
      <div
        className="relative w-full overflow-hidden px-4 py-2.5 text-center text-[11px] font-extrabold tracking-wide md:text-xs"
        style={{ background: C.orange, color: "#fff" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          <PartyPopper className="h-3.5 w-3.5" />
          {t("banner_text", "ADEC — acesso anual a partir de R$ 37,99")}</span>
        <span
          className="adec-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
          <img src={t("logo_image", "/__l5e/assets-v1/20892c4a-2b50-483d-a19d-a5067c9d5188/logo-adec.png")} alt={t("pagina_133", "ADEC")} className="h-10 w-auto" />
        </Link>
        <Link
          to="/"
          className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition hover:bg-white/60"
          style={{ borderColor: C.line, color: C.cta, background: "rgba(255,255,255,0.5)" }}
        >
          {t("pagina_134", "Loja completa")}</Link>
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
                src={t("logo_image", logoAsset.url)}
                alt={t("pagina_135", "ADEC — Avaliação Diagnóstica em Enfermagem Clínica")}
                className="h-28 w-auto drop-shadow-xl md:h-36"
              />

              <p
                className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.35em] md:text-xs"
                style={{ color: C.gold }}
              >
                {t("pagina_136", "Avaliação Diagnóstica em Enfermagem Clínica")}</p>
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
                Plataforma Privada de Suporte à Decisão Clínica
              </motion.span>

              <WordReveal
                text="Otimize suas evoluções e cálculos de plantão em 2 cliques."
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
                <ShineCTA href={safeLandingUrl(t("cta_target", "#planos"), '#planos')} style={ctaStyle}>
                  <Sparkles className="h-4 w-4" style={{ color: C.goldBright }} />
                  {CTA_TOPO}
                </ShineCTA>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold md:text-sm" style={{ color: C.orange }}>
                <Sparkles className="h-3.5 w-3.5" />
                {t("pagina_137", "365 dias de acesso à academia escolhida, com pagamento único")}</p>

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
                {t("pagina_138", "Pagamento pelo Mercado Pago · acesso após confirmação")}</p>
            </div>

            <PhoneMockup text={t} ink={C.ink} cta={C.cta} gold={C.goldBright} line={C.line} />
          </div>
        </section>

        {/* SELOS EM MARQUEE */}
        <section
          className="mt-6 overflow-hidden rounded-3xl border py-4 backdrop-blur"
          style={{ borderColor: C.line, background: C.card }}
        >
          <p className="mb-2 text-center text-[10px] font-extrabold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
            {t("pagina_139", "Base legal e científica")}</p>
          <Marquee items={SELOS} color={C.cta} />
        </section>

        {/* CREDIBILIDADE — números animados */}
        <section
          className="mt-6 rounded-3xl border p-5 backdrop-blur"
          style={{ borderColor: C.line, background: C.card }}
        >
          <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-widest" style={{ color: C.gold }}>
            {t("pagina_140", "Conteúdo construído por quem vive o plantão e o consultório")}</p>
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            {[
              { v: 35, suf: t("pagina_141", " anos"), l: t("pagina_142", "De vivência em enfermagem") },
              { v: 60, suf: t("pagina_143", "+"), l: t("pagina_144", "MSDC — Módulos de Suporte à Decisão Clínica") },
              { v: 22, suf: t("pagina_145", "+"), l: t("pagina_146", "Escalas clínicas") },
              { v: 100, suf: t("pagina_147", "%"), l: t("pagina_148", "Base COFEN / COREN") },
            ].map((s) => (
              <div key={s.l} className="min-w-[140px]">
                <span className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: C.cta }}>{t("stat_" + s.v, `${s.v}${s.suf}`)}</span>
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
          <SectionTitle eyebrow={t("pagina_149", "Para quem é")} title={t("pagina_150", "Escolha o app da sua fase profissional")} />
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
            eyebrow={t("pagina_151", "O que muda na sua vida")}
            title={t("pagina_152", "Não é só um app. É o seu plantão de volta.")}
            sub={t("pagina_153", "Cada módulo resolve uma dor concreta do plantão, do consultório ou da prova — com base em evidência científica.")}
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
                eyebrow: t("pagina_154", "Base de dados"),
                title: t("pagina_155", "Resoluções, normas, diretrizes e protocolos atualizados"),
                desc: t("pagina_156", "COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia."),
              },
              {
                eyebrow: t("pagina_157", "Certificação avulsa opcional"),
                title: t("pagina_158", "Certificados vendidos separadamente, sem emissão gratuita incluída."),
                desc: t("pagina_159", "Certificação opcional, contratada separadamente do acesso anual."),
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
            <ShineCTA href={safeLandingUrl(t("cta_target", "#planos"), "#planos")} style={ctaStyle}>
              {CTA_MEIO}
              <ArrowRight className="h-4 w-4" style={{ color: C.goldBright }} />
            </ShineCTA>
          </Reveal>
        </section>

        {/* CONTEÚDOS DOS MINI APPS */}
        <section className="mt-16">
          <SectionTitle
            eyebrow={t("pagina_160", "Conteúdos")}
            title={t("pagina_161", "O que você encontra dentro dos Mini Apps")}
            sub={t("pagina_162", "Cada Mini App é um tema resolvido, direto ao ponto, para usar no plantão, no estágio ou na prova.")}
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
            eyebrow={t("pagina_163", "Exclusivo ADEC")}
            title={t("pagina_164", "Os 3 automáticos: o app escreve por você")}
            sub={t("pagina_165", "São três ferramentas que transformam o que você marcou em documento pronto — sem digitar tudo de novo.")}
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
                    {t("pagina_166", "Automático")}</span>
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
            eyebrow={t("pagina_167", "A diferença")}
            title={t("pagina_168", "Seu plantão sem a ADEC e com a ADEC")}
            sub={t("pagina_169", "Mesma carga de trabalho. Duas experiências completamente diferentes.")}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div
                className="h-full rounded-3xl border p-6"
                style={{ borderColor: C.line, background: "rgba(255,255,255,0.45)" }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color: C.inkSoft }}>
                  {t("pagina_170", "Sem a ADEC")}</p>
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
                  {t("pagina_171", "Com a ADEC")}</p>
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
          <SectionTitle eyebrow={t("pagina_172", "Na prática")} title={t("pagina_173", "Plantão com a Academia")} />
          <ul className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              t("pagina_174", "Você sai no horário: anotação e evolução saem prontas do que você já avaliou"),
              t("pagina_175", "Dorme tranquila: medicação e aprazamento conferidos pelas metas de segurança"),
              t("pagina_176", "Nunca mais trava na frente do papel: SAE e prescrição por paciente"),
              t("pagina_177", "Decide rápido na beira do leito: 22+ escalas clínicas, offline"),
              t("pagina_178", "Encara qualquer procedimento com confiança: passo a passo antes de começar"),
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
            eyebrow={t("pagina_179", "Escolha seu app")}
            title={t("planos_title", "4 apps, um só padrão de excelência")}
            sub={t("plans_subtitle", "Escolha sua academia. Pagamento único anual pelo Mercado Pago.")}
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
                        {t("pagina_180", "+ escolhido")}</span>
                    )}
                    {!destacado && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow"
                        style={{ background: C.gold, color: "#fff" }}
                      >
                        {p.tagSuperior}
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
                    <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: C.gold }}>
                      {p.dor}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold" style={{ color: C.ink }}>
                          {t(`annual_price_${p.slug}`, isAnnualPlan(p.slug) ? formatPriceBRL(ANNUAL_PLANS[p.slug].cents) : "")}</span>
                        <span className="text-xs font-bold" style={{ color: C.inkSoft }}>
                          {t("pagina_182", "/ano")}</span>
                      </div>

                      <p
                        className="mt-1 text-[11px] font-semibold leading-snug"
                        style={{ color: C.inkSoft }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {t("plans_badge", "Acesso anual · pagamento único")}</p>

                      <p
                        className="mt-2 rounded-lg px-2 py-1.5 text-[11px] font-bold leading-snug"
                        style={{ background: "rgba(212,175,55,0.16)", color: C.ink }}
                      >
                        {t("pagina_184", "Liberação após aprovação do pagamento. Sem renovação automática.")}</p>
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
                          <CheckCircle2 className="h-4 w-4" /> {t("pagina_185", "Acessar meu app →")}</Link>
                      ) : (
                        <a
                            href={safeLandingUrl(t("signup_" + p.slug, `/checkout?plan=${p.slug}&period=anual`), `/checkout?plan=${p.slug}&period=anual`)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-center text-xs font-extrabold uppercase leading-tight tracking-wide transition hover:-translate-y-0.5"
                          style={ctaStyle}
                        >
                          {p.ctaLabel}
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
              <Award className="h-4 w-4" /> {t("pagina_186", "Certificados vendidos separadamente")}</div>
            <p className="mt-4 max-w-2xl text-sm font-medium text-[#0b3229]/80">
              {t("pagina_187", "O acesso anual não inclui certificados. A certificação avulsa possui contratação separada.")}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="group relative">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#b8912f]">{t("pagina_188", "Frente (Modelo)")}</p>
                <div className="overflow-hidden rounded-xl border border-[#b8912f]/30 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative block w-full outline-none">
                        <img 
                          src={t("pagina_189", "https://academiadaenfermagem.com.br/lovable-uploads/763be538-348e-4903-888f-013697669d72.png")} 
                          alt={t("pagina_190", "Modelo Frente do Certificado ADEC")} 
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
                          src={t("pagina_189", "https://academiadaenfermagem.com.br/lovable-uploads/763be538-348e-4903-888f-013697669d72.png")} 
                          alt={t("pagina_192", "Modelo Frente do Certificado ADEC")} 
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
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#b8912f]">{t("pagina_193", "Verso (Modelo)")}</p>
                <div className="overflow-hidden rounded-xl border border-[#b8912f]/30 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative block w-full outline-none">
                        <img 
                          src={t("pagina_194", "https://academiadaenfermagem.com.br/lovable-uploads/31804b77-b9c9-4a0b-8d59-3d127c52367d.png")} 
                          alt={t("pagina_195", "Modelo Verso do Certificado ADEC")} 
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
                          src={t("pagina_194", "https://academiadaenfermagem.com.br/lovable-uploads/31804b77-b9c9-4a0b-8d59-3d127c52367d.png")} 
                          alt={t("pagina_197", "Modelo Verso do Certificado ADEC")} 
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
                  {t("guarantee_title", "Compra identificada e segura")}</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>
                {t("pagina_200", "Entre ou crie sua conta, pague pelo Mercado Pago e acesse sua academia após a confirmação.")}</p>
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
                  {t("pagina_201", "Sua academia por 365 dias")}</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>
                {t("pagina_202", "A compra libera os conteúdos da academia escolhida durante um ano.")}</p>
              <p
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide"
                style={{ background: C.orange, color: "#fff" }}
              >
                <Flame className="h-3.5 w-3.5" />
                {t("pagina_203", "Sem mensalidade ou renovação automática")}</p>
            </div>
          </Reveal>
        </section>

        {/* BENEFÍCIOS DA LICENÇA ANUAL */}
        <section className="mt-16">
          <SectionTitle
            eyebrow={t("pagina_204", "Acesso anual")}
            title={t("inauguracao_titulo", "Sua academia durante um ano")}
            sub={t(
              "licenca_sub",
              "Tenha acesso à sua academia profissional por um ano, com recursos práticos e atualizações contínuas.",
            )}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Star,
                title: t("pagina_205", "Pagamento único"),
                desc: t("pagina_206", "Um pagamento garante 365 dias de acesso à academia escolhida."),
              },
              {
                icon: MessageCircle,
                title: t("pagina_207", "Conteúdo da sua academia"),
                desc: t("pagina_208", "Ferramentas de estudo e apoio à prática conforme os módulos da academia escolhida."),
              },
              {
                icon: ShieldCheck,
                title: t("pagina_209", "Liberação após pagamento"),
                desc: t("launch_trial", "O Mercado Pago confirma a aprovação e o acesso é liberado na conta usada na compra."),
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
          <SectionTitle eyebrow={t("pagina_210", "Sobre a autora")} title={t("pagina_211", "Conheça um pouco da minha História")} />

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
            <Reveal className="mx-auto lg:mx-0">
              <div className="overflow-hidden rounded-3xl border-2 shadow-xl" style={{ borderColor: C.goldBright }}>
                <img
                  src={t("author_image", "/__l5e/assets-v1/1f1033de-3186-4e0c-a8ac-f1bb100a0745/foto-fundadora.jpeg")}
                  alt={t("pagina_212", "Fundadora — Academia da Enfermagem")}
                  className="h-56 w-56 object-cover lg:h-60 lg:w-60"
                />
              </div>
            </Reveal>

            <div className="space-y-6">
              {[
                {
                  h: t("pagina_213", "A História"),
                  p: t("pagina_214", "A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e Enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: A assistência aos pacientes."),
                },
                {
                  h: t("pagina_215", "O Propósito"),
                  p: t("pagina_216", "Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem administrativa e prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho."),
                },
                {
                  h: t("pagina_217", "Minha Promessa"),
                  p: t("pagina_218", "A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!"),
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
                {t("pagina_219", "Ler minha história completa")}<ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <SectionTitle eyebrow={t("pagina_220", "Dúvidas frequentes")} title={t("pagina_221", "Antes de decidir")} />
          <div className="mx-auto mt-8 max-w-3xl space-y-2">
            {[
              {
                q: t("pagina_222", "Como o acesso é liberado?"),
                a: t("faq_trial", "Escolha sua academia, entre ou crie sua conta e pague pelo Mercado Pago. O acesso é liberado após confirmação do pagamento."),
              },
              {
                q: t("pagina_223", "Existe cobrança mensal ou renovação automática?"),
                a: t("pagina_224", "Não. Você paga uma única vez por 365 dias. Para continuar após o vencimento, faça uma nova compra."),
              },
              {
                q: t("pagina_225", "Funciona offline?"),
                a: t("pagina_226", "Sim. Instale como app no celular (PWA) e a maior parte do conteúdo funciona sem internet, ideal para plantão."),
              },
              {
                q: t("pagina_227", "A compra inclui bônus ou certificados?"),
                a: t("pagina_228", "Não. O valor anual corresponde ao acesso à academia escolhida. Certificados avulsos são vendidos separadamente."),
              },
              {
                q: t("pagina_229", "Posso usar no celular e no computador?"),
                a: t("pagina_230", "Sim. Basta entrar com seu login em qualquer aparelho — seu progresso e assinatura acompanham você."),
              },
              {
                q: t("pagina_231", "Quem cria e revisa o conteúdo?"),
                a: t("pagina_232", "Enfermeira docente com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS. Atualizações contínuas e automáticas."),
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
              {t("pagina_233", "Turma de inauguração aberta agora")}</div>
            <Reveal>
              <h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl" style={{ color: "#fff" }}>
                {t("pagina_234", "Saia do próximo plantão no horário")}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
                {t("pagina_235", "Sem cartão de crédito. Sem fidelidade. Cancele quando quiser. Entre na turma de inauguração da ADEC.")}</p>
            </Reveal>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {PLANOS.map((p, i) => {
                const subscribed = isSubscribed(p.slug);
                return (
                  <Reveal key={p.slug} delay={i * 0.07}>
                    <motion.a
                      href={subscribed ? `/trilha/${p.slug}` : safeLandingUrl(t("signup_" + p.slug, `/cadastro/${p.slug}`), `/cadastro/${p.slug}`)}
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
                            {subscribed ? t("access_short", "Acessar") : CTA_RODAPE}
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
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.goldBright }} /> {t("pagina_236", "Compra 100% segura")}</p>
          </div>
        </section>

        <footer className="mt-8 text-center text-[11px]" style={{ color: C.inkSoft }}>
          <p className="mx-auto max-w-2xl leading-relaxed">
            {t("pagina_237", "Aviso Legal: ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do profissional, o exame do paciente nem as fontes oficiais (COFEN, COREN, MS, ANVISA).")}</p>
          <p className="mt-2">
            <Link to="/legal" className="font-extrabold underline" style={{ color: C.goldBright }}>
              {t("pagina_238", "Termos de Uso, Aviso Legal e Política de Privacidade")}</Link>
          </p>
          <p className="mt-2">{t("pagina_239", "ADEC · Academia da Enfermagem · academiadaenfermagem.com.br")}</p>
        </footer>
      </div>

      <StickyCTA
        href={safeLandingUrl(t("cta_target", "#planos"), "#planos")}
        label={CTA_TOPO}
        hint={t("sticky_hint", "Acesso anual · escolha sua academia")}
        bg={C.cta}
        fg="rgba(255,255,255,0.9)"
        accent={C.goldBright}
      />
    </div>
  );
}

