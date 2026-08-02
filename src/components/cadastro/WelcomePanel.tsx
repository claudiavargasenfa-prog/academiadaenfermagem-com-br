import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, CreditCard, ExternalLink, LogIn, Mail, UserPlus } from "lucide-react";
import {
  fetchMyActiveSubscriptions,
  fetchMyProfile,
  fetchSubscriptionPlans,
  useAuthReady,
} from "@/lib/access";

const LABELS: Record<string, string> = {
  academico: "Acadêmico",
  tecnico: "Técnico em Enfermagem",
  "tecnico-estudante": "Estudante de Técnico em Enfermagem",
  enfermeiro: "Enfermeiro",
};

const SLOGANS: Record<string, string> = {
  academico: "Do primeiro estágio ao TCC — sem sofrer.",
  tecnico: "Prática segura, plantão tranquilo.",
  "tecnico-estudante": "Passa na prova, encara o campo com confiança.",
  enfermeiro: "Menos burocracia, mais paciente.",
};

function daysLeft(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export function WelcomePanel({ slug }: { slug: string }) {
  const { isReady, user } = useAuthReady();
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

  return (
    <aside className="glass rounded-3xl p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        Academia da Enfermagem
      </p>
      <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight md:text-3xl">
        {logged && firstName ? `Bem-vinda(o), ${firstName}!` : "Boas-vindas!"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Academia do {label}. {slogan}
      </p>

      {logged ? (
        <div className="mt-5 space-y-4">
          {sub ? (
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
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
                Plano: {LABELS[sub.plan_slug] ?? sub.plan_slug} · válido até{" "}
                {new Date(sub.expires_at).toLocaleDateString("pt-BR")}
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
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-extrabold">Sem acesso ativo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Próximo passo: associe-se para liberar todo o conteúdo da Academia do {label}.
                Se você já comprou na Cakto, use o mesmo e-mail da compra.
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
        <ol className="mt-5 space-y-3">
          {[
            { icon: UserPlus, t: "1. Crie sua conta", d: "Use o mesmo e-mail da compra na Cakto, se já comprou." },
            { icon: Mail, t: "2. Confirme seu e-mail", d: "Um link de confirmação chega em segundos." },
            { icon: LogIn, t: "3. Entre no app", d: "Seu status (teste grátis ou pago) aparece aqui após o login." },
          ].map(({ icon: Icon, t, d }) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-border/60 bg-background/60 p-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
