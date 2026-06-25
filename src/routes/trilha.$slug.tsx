import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Lock, CheckCircle2, Sparkles, ArrowLeft, BookOpen } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { BadgeList } from "@/components/Badges";
import {
  fetchMiniApps,
  fetchMyExtraAccess,
  fetchMyActiveSubscriptions,
  fetchSubscriptionPlans,
  appTracks,
  formatPriceBRL,
  summarizeExtras,
  useIsAdmin,
  TRACKS,
  type TrackSlug,
  type MiniApp,
} from "@/lib/access";

export const Route = createFileRoute("/trilha/$slug")({
  head: ({ params }) => {
    const t = TRACKS.find((x) => x.slug === params.slug);
    const title = t ? `${t.label} — Academia da Enfermagem` : "Aplicativo";
    return {
      meta: [
        { title },
        { name: "description", content: `Mini apps do aplicativo ${t?.label ?? ""} da Academia da Enfermagem.` },
      ],
    };
  },
  component: TrilhaPage,
});

function TrilhaPage() {
  const { slug } = Route.useParams();
  const trackSlug = slug as TrackSlug;
  const track = TRACKS.find((t) => t.slug === trackSlug);
  if (!track) throw notFound();

  const appsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const extrasQ = useQuery({ queryKey: ["my_extras"], queryFn: fetchMyExtraAccess });
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });

  const apps = (appsQ.data ?? []).filter((a) => appTracks(a).includes(trackSlug));
  const { extraAccessByApp } = summarizeExtras(extrasQ.data ?? []);
  const subs = subsQ.data ?? [];
  const mySub = subs.find((s) => s.plan_slug === trackSlug);
  const trackActive = !!mySub;
  const plan = (plansQ.data ?? []).find((p) => p.slug === trackSlug);

  const cardStyle: React.CSSProperties = {
    backgroundColor: `var(--track-${trackSlug}-bg)`,
    color: `var(--track-${trackSlug}-fg)`,
  };

  const gratis = apps.filter((a) => a.gratuito);
  const premium = apps.filter((a) => !a.gratuito);

  return (
    <AppShell trackSlug={trackSlug}>
      <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para a loja
      </Link>

      <div className="mb-6 rounded-3xl border border-white/40 p-5 shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{track.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Aplicativo</p>
            <h1 className="font-display text-2xl font-extrabold">{track.label}</h1>
          </div>
        </div>
        {plan?.description && <p className="mt-2 text-sm opacity-80">{plan.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {trackActive ? (
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
              {mySub!.status === "trial" ? "🎁 Trial ativo" : "✓ Assinatura ativa"} · até {new Date(mySub!.expires_at).toLocaleDateString("pt-BR")}
            </span>
          ) : plan ? (
            <>
              <a
                href={(plan as any).cakto_link_novo || plan.cakto_checkout_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background"
              >
                Assinar {formatPriceBRL((plan as any).price_novo_cents ?? plan.price_cents)}/mês
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-emerald-800">
                🔒 Compra Segura
              </span>
            </>
          ) : null}
        </div>
      </div>

      <PageHeader title={`${apps.length} mini apps neste aplicativo`} description="Apps grátis liberam para qualquer pessoa. Os demais exigem assinatura deste aplicativo." />

      {gratis.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-bold">Grátis</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gratis.map((app) => (
              <TrackAppCard key={app.id} app={app} unlocked extraExpiresAt={extraAccessByApp[app.id] ?? null} />
            ))}
          </div>
        </section>
      )}

      {premium.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-3 font-display text-lg font-bold">Premium da trilha</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {premium.map((app) => (
              <TrackAppCard
                key={app.id}
                app={app}
                unlocked={trackActive || !!extraAccessByApp[app.id]}
                extraExpiresAt={extraAccessByApp[app.id] ?? null}
              />
            ))}
          </div>
        </section>
      )}

      {apps.length === 0 && (
        <Card>
          <p className="text-sm text-muted-foreground">Nenhum mini app cadastrado nesta trilha ainda.</p>
        </Card>
      )}
    </AppShell>
  );
}

function TrackAppCard({ app, unlocked, extraExpiresAt }: { app: MiniApp; unlocked: boolean; extraExpiresAt: string | null }) {
  const route = (app.route_path ?? "") as string;
  const hasRoute = !!app.route_path;
  return (
    <div className="glass flex flex-col rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="grid h-11 w-11 place-items-center rounded-xl gold-gradient">
          <BookOpen className="h-5 w-5" />
        </div>
        {app.gratuito ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <Sparkles className="h-3 w-3" /> Grátis
          </span>
        ) : unlocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Liberado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
            <Lock className="h-3 w-3" /> Bloqueado
          </span>
        )}
      </div>
      <BadgeList value={(app as any).badges} />
      <h3 className="mt-1 font-display text-base font-bold">{app.name}</h3>
      {app.description && <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>}

      <div className="mt-3">
        {unlocked && hasRoute ? (
          <Link to={route} className="block w-full rounded-xl bg-primary py-2 text-center text-sm font-semibold text-primary-foreground">
            Acessar
          </Link>
        ) : !hasRoute ? (
          <button disabled className="w-full cursor-not-allowed rounded-xl bg-foreground/10 py-2 text-sm font-semibold text-foreground/50">
            Em preparação
          </button>
        ) : app.cakto_checkout_url ? (
          <a href={app.cakto_checkout_url} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-1 rounded-xl gold-gradient py-2 text-sm font-bold text-foreground">
            {extraExpiresAt ? "Renovar" : "Comprar avulso"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button disabled className="w-full cursor-not-allowed rounded-xl bg-foreground/10 py-2 text-sm font-semibold text-foreground/50">
            Bloqueado
          </button>
        )}
      </div>
    </div>
  );
}
