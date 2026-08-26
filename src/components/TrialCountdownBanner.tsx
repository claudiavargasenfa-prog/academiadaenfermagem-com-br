import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ensurePixel } from "@/lib/meta-pixel";
import {
  fetchMyActiveSubscriptions,
  fetchMyProfile,
  fetchSubscriptionPlans,
  TRACKS,
  type TrackSlug,
} from "@/lib/access";
import { BASE_PLAN_SLUG_SET } from "@/lib/plan-slugs";

type Stage = "blue" | "orange" | "red" | null;

function daysLeft(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
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

  // Assinatura mais próxima do vencimento (trial ou paga)
  const target = [...subs]
    .filter((s) => s.status === "trial" || s.status === "active")
    .sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime())[0];
  if (!target) return null;

  const isTrial = target.status === "trial";
  const days = daysLeft(target.expires_at);
  let stage: Stage = null;
  if (days <= 1) stage = "red";
  else if (days <= 3) stage = "orange";
  else if (days <= 5) stage = "blue";
  if (!stage) return null;

  // "Fechado" vale só para o dia atual (reaparece no dia seguinte / nova sessão)
  const dismissKey = `adec_banner_dismiss_${target.id ?? target.plan_slug}_${todayKey()}`;
  const alreadyDismissed =
    typeof window !== "undefined" && window.sessionStorage.getItem(dismissKey) === "1";
  if (dismissed || alreadyDismissed) return null;

  const track = TRACKS.find((t) => t.slug === (target.plan_slug as TrackSlug));
  const plan = (plansQ.data ?? []).find((p) => p.slug === target.plan_slug);
  const planoSlug = BASE_PLAN_SLUG_SET.has(target.plan_slug) ? target.plan_slug : null;
  const firstName = (profile?.full_name || "aluno(a)").split(" ")[0];
  const dateLabel = new Date(target.expires_at).toLocaleDateString("pt-BR");

  const priceLabel = ((plan?.price_novo_cents ?? plan?.price_cents ?? 2499) / 100)
    .toFixed(2)
    .replace(".", ",");

  const dayWord = days === 1 ? "dia" : "dias";

  const trialStyles: Record<NonNullable<Stage>, { bg: string; title: string; body: string; cta: string }> = {
    blue: {
      bg: "bg-sky-500",
      title: "⏳ Seu tempo grátis termina em 5 dias",
      body: `Olá, ${firstName}! Seu período gratuito${track ? ` na ${track.label}` : ""} termina em ${days} ${dayWord} (${dateLabel}). Para continuar com todo o conteúdo, associe-se.`,
      cta: "🔐 GARANTIR ACESSO",
    },
    orange: {
      bg: "bg-orange-500",
      title: "⚠️ Seu tempo grátis termina em 3 dias",
      body: `${firstName}, para continuar acessando todos os conteúdos, acesse o link e seja um associado.`,
      cta: "🔐 SER ASSOCIADO",
    },
    red: {
      bg: "bg-red-600",
      title: "🚨 Seu prazo de gratuidade é até amanhã",
      body: `${firstName}, passando para lembrar que sua gratuidade termina amanhã. Não perca todo esse conteúdo e os demais que estão por vir — acesse o link e associe-se.`,
      cta: "🔐 ASSOCIE-SE AGORA",
    },
  };

  const paidStyles: Record<NonNullable<Stage>, { bg: string; title: string; body: string; cta: string }> = {
    blue: {
      bg: "bg-sky-500",
      title: `⏳ Sua mensalidade vence em ${days} ${dayWord}`,
      body: `Olá, ${firstName}! Sua assinatura${track ? ` da ${track.label}` : ""} vence em ${dateLabel}. Renove para não perder o acesso aos conteúdos e às atualizações.`,
      cta: "🔁 RENOVAR ASSINATURA",
    },
    orange: {
      bg: "bg-orange-500",
      title: "⚠️ Sua mensalidade vence em 3 dias",
      body: `${firstName}, sua assinatura vence em ${dateLabel}. Renove por R$ ${priceLabel}/mês e mantenha tudo liberado sem interrupção.`,
      cta: "🔁 RENOVAR AGORA",
    },
    red: {
      bg: "bg-red-600",
      title: "🚨 Sua mensalidade vence amanhã",
      body: `${firstName}, sua assinatura vence em ${dateLabel}. Renove hoje para não perder o acesso ao conteúdo do seu app.`,
      cta: "🔁 RENOVAR HOJE",
    },
  };

  const s = (isTrial ? trialStyles : paidStyles)[stage];

  return (
    <div className={`relative ${s.bg} text-white trial-pulse`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-tight">{s.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs opacity-95">{s.body}</p>
        </div>
        {planoSlug ? (
          <Link
            to="/planos/$slug"
            params={{ slug: planoSlug }}
            onClick={() => {
              try {
                ensurePixel({ pageView: false });
                (window as any).fbq?.("track", "InitiateCheckout");
              } catch {
                /* ignore */
              }
            }}
            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-foreground shadow hover:brightness-95"
          >
            {s.cta}
          </Link>
        ) : null}
        {stage !== "red" ? (
          <button
            aria-label="Fechar aviso"
            onClick={() => {
              try {
                window.sessionStorage.setItem(dismissKey, "1");
              } catch {
                /* ignore */
              }
              setDismissed(true);
            }}
            className="shrink-0 rounded-full p-1 hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
