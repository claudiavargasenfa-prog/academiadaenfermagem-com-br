import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMyActiveSubscriptions,
  fetchMyProfile,
  fetchSubscriptionPlans,
  TRACKS,
  type TrackSlug,
} from "@/lib/access";

type Stage = "blue" | "orange" | "red" | null;

function daysLeft(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

export function TrialCountdownBanner() {
  const profileQ = useQuery({ queryKey: ["my_profile"], queryFn: fetchMyProfile });
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const [dismissed, setDismissed] = useState(false);

  // Re-render once per minute to keep countdown fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const profile = profileQ.data;
  const subs = subsQ.data ?? [];
  const trial = subs.find((s) => s.status === "trial");
  if (!trial) return null;

  const days = daysLeft(trial.expires_at);
  let stage: Stage = null;
  if (days <= 1) stage = "red";
  else if (days <= 3) stage = "orange";
  else if (days <= 5) stage = "blue";
  if (!stage || dismissed) return null;

  const track = TRACKS.find((t) => t.slug === trial.plan_slug as TrackSlug);
  const plan = (plansQ.data ?? []).find((p) => p.slug === trial.plan_slug);
  const checkoutUrl = plan?.cakto_link_novo || plan?.cakto_checkout_url || "";
  const firstName = (profile?.full_name || "aluno(a)").split(" ")[0];

  const priceLabel = ((plan?.price_novo_cents ?? plan?.price_cents ?? 2499) / 100)
    .toFixed(2)
    .replace(".", ",");

  const styles: Record<NonNullable<Stage>, { bg: string; fg: string; title: string; body: string; cta: string }> = {
    blue: {
      bg: "bg-sky-500",
      fg: "text-white",
      title: "⏳ Seu tempo grátis termina em 5 dias",
      body: `Olá, ${firstName}! Seu período gratuito${track ? ` na ${track.label}` : ""} termina em ${days} ${days === 1 ? "dia" : "dias"}. Para continuar com todo o conteúdo, associe-se por R$ ${priceLabel}/mês.`,
      cta: "🔐 GARANTIR ACESSO",
    },
    orange: {
      bg: "bg-orange-500",
      fg: "text-white",
      title: "⚠️ Seu tempo grátis termina em 3 dias",
      body: `${firstName}, para continuar acessando todos os conteúdos, acesse o link e seja um associado por R$ ${priceLabel}/mês.`,
      cta: "🔐 SER ASSOCIADO",
    },
    red: {
      bg: "bg-red-600",
      fg: "text-white",
      title: "🚨 Seu prazo de gratuidade é até amanhã",
      body: `${firstName}, passando para lembrar que sua gratuidade termina amanhã. Não perca todo esse conteúdo e os demais que estão por vir — acesse o link e associe-se.`,
      cta: "🔐 ASSOCIE-SE AGORA",
    },
  };
  const s = styles[stage];

  return (
    <div className={`relative ${s.bg} ${s.fg} trial-pulse`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-tight">{s.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs opacity-95">{s.body}</p>
        </div>
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-foreground shadow hover:brightness-95"
          >
            {s.cta} <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
        {stage !== "red" ? (
          <button
            aria-label="Fechar aviso"
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-full p-1 hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

      </div>
    </div>
  );
}
