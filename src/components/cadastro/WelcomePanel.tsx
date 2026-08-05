import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Heart,
  LogIn,
  Mail,
  MessageCircle,
  PartyPopper,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  fetchMyActiveSubscriptions,
  fetchMyProfile,
  fetchSubscriptionPlans,
  useAuthReady,
} from "@/lib/access";
import { useText } from "@/lib/app-texts";
import {
  isFreeTrialOpen,
  TRIAL_FREE_START_LABEL,
  TRIAL_FREE_UNTIL_LABEL,
} from "@/lib/trial-window";

const LABELS: Record<string, string> = {
  academico: "Acadêmico",
  tecnico: "Técnico em Enfermagem",
  "tecnico-estudante": "Estudante de Técnico em Enfermagem",
  enfermeiro: "Enfermeiro",
};

const SLOGANS: Record<string, string> = {
  academico: "Fundamentos, SAE e cálculos para dominar a graduação com segurança.",
  tecnico: "Guia prático de procedimentos e anotações para um plantão nota dez.",
  "tecnico-estudante": "Teoria e prática alinhadas para você brilhar nos estágios e provas.",
  enfermeiro: "Gestão, SAE avançada e protocolos para liderar com excelência clínica.",
};

function daysLeft(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);
  return async () => {
    if (deferred) {
      await deferred.prompt();
      setDeferred(deferred as any); // just dummy usage to satisfy linter if needed
      setDeferred(null);
      return;
    }
    alert(
      "No iPhone: toque em Compartilhar (□↑) e escolha “Adicionar à Tela de Início”.\nNo Android: menu ⋮ do Chrome e “Instalar aplicativo”.",
    );
  };
}

export function WelcomePanel({ slug }: { slug: string }) {
  const { isReady, user } = useAuthReady();
  const install = useInstallPrompt();
  const whatsappUrl = useText(
    "cadastro.whatsapp.url",
    "https://chat.whatsapp.com/HUv5XdngfQYGR3pxWuG3J3",
  );

  const subsQ = useQuery({
    queryKey: ["my_subs"],
    queryFn: fetchMyActiveSubscriptions,
    enabled: isReady && !!user,
  });
  const profileQ = useQuery({
    queryKey: ["my_profile"],
    queryFn: fetchMyProfile,
    enabled: isReady && !!user,
  });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });

  const label = LABELS[slug] ?? "Academia da Enfermagem";
  const slogan = SLOGANS[slug] ?? "";
  const subs = subsQ.data ?? [];
  const sub = subs.find((s) => s.plan_slug === slug) ?? subs[0] ?? null;
  const plan = (plansQ.data ?? []).find((p) => p.slug === slug);
  const checkoutUrl = plan?.cakto_link_novo || plan?.cakto_checkout_url || "";
  const firstName = (profileQ.data?.full_name || "").split(" ")[0];
  const logged = isReady && !!user;
  const freeOpen = isFreeTrialOpen();

  return (
    <aside className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-[var(--shadow-glass)] backdrop-blur-xl">
      {/* brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative p-6 md:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full gold-gradient px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide">
          <PartyPopper className="h-3.5 w-3.5" /> Inauguração · Turma fundadora
        </span>

        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
          {logged && firstName ? (
            <>
              Que bom te ver, <span className="text-gold">{firstName}</span>!
            </>
          ) : (
            <>
              Seja muito <span className="text-gold">bem-vinda(o)</span>!
            </>
          )}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Você está entrando na <b>Academia da Enfermagem</b>. {slogan} Aqui a teoria vira prática,
          e o plantão fica mais leve. 💚
        </p>
        {freeOpen ? (
          <>
            <p className="mt-3 text-sm font-extrabold text-foreground md:text-base">
              Atenção: No período gratuito você tem direito a cadastrar-se em um app.
            </p>
            <p className="mt-1 text-sm font-extrabold text-foreground md:text-base">
              O período gratuito de teste é de {TRIAL_FREE_START_LABEL} a {TRIAL_FREE_UNTIL_LABEL}.
            </p>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-orange-500/50 bg-orange-500/10 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-extrabold text-orange-900">
                Período gratuito encerrado
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/80">
              A degustação de 15 dias foi válida até <b>{TRIAL_FREE_UNTIL_LABEL}</b>. Novos cadastros
              não recebem mais acesso gratuito — para entrar no app é preciso{" "}
              <b>assinar o plano da sua categoria</b>. Você pode criar sua conta normalmente e
              liberar o conteúdo logo após a assinatura.
            </p>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground"
              >
                Assinar agora <CreditCard className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        )}

        {logged ? (
          <div className="mt-6 space-y-4">
            {sub ? (
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center gap-2">
                  {sub.status === "trial" ? (
                    <Clock className="h-4 w-4 text-orange-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  <span className="text-sm font-extrabold">
                    {sub.status === "trial" ? "Acesso gratuito (teste)" : "Acesso pago ativo"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {sub.status === "trial"
                    ? `Faltam ${daysLeft(sub.expires_at)} dia(s) do seu período gratuito.`
                    : `Seu acesso é válido até ${new Date(sub.expires_at).toLocaleDateString("pt-BR")} (${daysLeft(sub.expires_at)} dias).`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Plano: {LABELS[sub.plan_slug] ?? sub.plan_slug}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/trilha/$slug"
                    params={{ slug: sub.plan_slug }}
                    className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground"
                  >
                    Entrar no app <LogIn className="h-4 w-4" />
                  </Link>
                  {sub.status === "trial" && checkoutUrl ? (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-bold"
                    >
                      Tornar-se associado <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-extrabold">Sem acesso ativo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Próximo passo: associe-se e libere todo o conteúdo da Academia do {label}. Se
                  você já comprou na Cakto, use o mesmo e-mail da compra.
                </p>
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground"
                  >
                    Liberar meu acesso <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <ol className="mt-6 space-y-3">
            {[
              {
                icon: UserPlus,
                t: "1. Crie sua conta em 1 minuto",
                d: "Use o mesmo e-mail da compra na Cakto, se já comprou.",
              },
              {
                icon: Mail,
                t: "2. Confirme seu e-mail",
                d: "O link de confirmação chega em segundos.",
              },
              {
                icon: Sparkles,
                t: "3. Comece a usar agora mesmo",
                d: "SAE automatizada, cálculos, escalas, procedimentos e quizzes liberados.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <li
                key={t}
                className="flex gap-3 rounded-2xl border border-border/60 bg-background/70 p-3"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-bold">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Comunidade VIP */}
        <div className="mt-6 rounded-2xl border border-emerald-600/30 bg-emerald-600/10 p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-extrabold">Sua presença é muito importante</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Entre no Grupo VIP no WhatsApp, dê sua opinião e ajude a construir o app junto com a
            gente. Suas ideias viram funcionalidades.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white"
          >
            <MessageCircle className="h-4 w-4" /> Entrar no Grupo VIP
          </a>
        </div>

        {/* Instalar app grátis */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
          <div>
            <p className="text-sm font-extrabold">Baixe grátis o nosso app</p>
            <p className="text-xs text-muted-foreground">
              Instale na tela inicial do celular e acesse offline, em 1 toque.
            </p>
          </div>
          <button
            type="button"
            onClick={install}
            className="inline-flex items-center gap-2 rounded-xl gold-gradient px-4 py-2 text-sm font-extrabold"
          >
            <Download className="h-4 w-4" /> Instalar grátis
          </button>
        </div>

        {/* Atualizações constantes */}
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-gold" />
            <p className="text-sm font-extrabold">Atualizações constantes</p>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {[
              "Novos mini apps e conteúdos publicados toda semana",
              "Protocolos revisados conforme COFEN, ANVISA e Ministério da Saúde",
              "Melhorias sugeridas pelos alunos do Grupo VIP",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aviso legal */}
        <div className="mt-5 rounded-2xl border-2 border-emerald-900/40 bg-emerald-900/10 p-4 text-emerald-900 shadow-sm dark:text-emerald-200">
          <p className="text-sm font-extrabold uppercase tracking-wide">⚠️ Aviso Legal</p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed md:text-sm">
            Ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do
            profissional, o exame do paciente nem as fontes oficiais (COFEN, COREN, Ministério da
            Saúde, ANVISA) e os protocolos institucionais. A responsabilidade pela conduta é sempre
            do profissional habilitado.
          </p>
        </div>

      </div>
    </aside>
  );
}
