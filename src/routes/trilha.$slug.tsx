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
  formatPriceBRL,
  summarizeExtras,
  useIsAdmin,
  type MiniApp,
} from "@/lib/access";
import { fetchAppBySlug, fetchAppSections, fetchPlacementsForApp } from "@/lib/apps";
import { useLocal } from "@/lib/storage";

export const Route = createFileRoute("/trilha/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Academia da Enfermagem` },
      { name: "description", content: `Mini apps do aplicativo ${params.slug} da Academia da Enfermagem.` },
    ],
  }),
  component: TrilhaPage,
});

function TrilhaPage() {
  const { slug } = Route.useParams();

  const appQ = useQuery({ queryKey: ["app", slug], queryFn: () => fetchAppBySlug(slug) });
  const sectionsQ = useQuery({
    queryKey: ["app_sections", appQ.data?.id],
    enabled: !!appQ.data?.id,
    queryFn: () => fetchAppSections(appQ.data!.id),
  });
  const placementsQ = useQuery({
    queryKey: ["app_placements", appQ.data?.id],
    enabled: !!appQ.data?.id,
    queryFn: () => fetchPlacementsForApp(appQ.data!.id),
  });
  const miniAppsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const extrasQ = useQuery({ queryKey: ["my_extras"], queryFn: fetchMyExtraAccess });
  const subsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });
  const adminQ = useIsAdmin();
  const isAdminUser = !!adminQ.data;

  if (appQ.isLoading) {
    return (
      <AppShell>
        <Card>Carregando…</Card>
      </AppShell>
    );
  }
  const app = appQ.data;
  if (!app) throw notFound();

  const placements = placementsQ.data ?? [];
  const sections = sectionsQ.data ?? [];
  const allApps = miniAppsQ.data ?? [];
  const byId = new Map(allApps.map((a) => [a.id, a]));
  const items = placements
    .map((p) => ({ placement: p, app: byId.get(p.mini_app_id) }))
    .filter((x): x is { placement: typeof placements[number]; app: MiniApp } => !!x.app && !!x.app.is_active);

  const sortMode = ((app as any).sort_mode ?? "numeric") as "numeric" | "alpha";
  const sortItems = (list: MiniApp[]) =>
    sortMode === "alpha"
      ? list.slice().sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"))
      : list;

  const grouped: { section: { id: string; title: string; emoji: string | null } | null; items: MiniApp[] }[] = [];
  const general = items.filter((x) => !x.placement.section_id);
  if (general.length) {
    grouped.push({ section: null, items: sortItems(general.map((x) => x.app)) });
  }
  for (const sec of sections) {
    if (!sec.is_active) continue;
    const list = items.filter((x) => x.placement.section_id === sec.id).map((x) => x.app);
    if (list.length) grouped.push({ section: { id: sec.id, title: sec.title, emoji: sec.emoji }, items: sortItems(list) });
  }


  const { extraAccessByApp } = summarizeExtras(extrasQ.data ?? []);
  const subs = subsQ.data ?? [];
  const mySub = subs.find((s) => s.plan_slug === app.slug);
  const trackActive = !!mySub;
  const plan = (plansQ.data ?? []).find((p) => p.slug === app.slug);

  const cardStyle: React.CSSProperties = {
    backgroundColor: app.bg_color ?? "#F3F4F6",
    color: app.fg_color ?? "#111827",
  };

  return (
    <AppShell tint={app.bg_color}>
      <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para a loja
      </Link>

      <div className="mb-6 rounded-3xl border border-white/40 p-5 shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{app.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Aplicativo</p>
            <h1 className="font-display text-2xl font-extrabold">{app.name}</h1>
          </div>
        </div>
        {(plan?.description || app.description) && (
          <p className="mt-2 text-sm opacity-80">{plan?.description ?? app.description}</p>
        )}
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

      {(app.slug === "academico" || app.slug === "tecnico-estudante") && <MeuEstagioCard />}

      <PageHeader title={`${items.length} mini apps neste aplicativo`} description="Apps grátis liberam para qualquer pessoa. Os demais exigem assinatura deste aplicativo." />

      {grouped.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Nenhum mini app neste aplicativo ainda. Use o Admin → Apps para arrastar mini apps para dentro.</p>
        </Card>
      ) : (
        grouped.map((g, idx) => (
          <section key={g.section?.id ?? `geral-${idx}`} className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold">
              {g.section ? (
                <>
                  <span className="mr-1">{g.section.emoji ?? "📚"}</span>
                  {g.section.title}
                </>
              ) : (
                "Geral"
              )}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((mini) => (
                <TrackAppCard
                  key={mini.id}
                  app={mini}
                  unlocked={isAdminUser || mini.gratuito || trackActive || !!extraAccessByApp[mini.id]}
                  extraExpiresAt={extraAccessByApp[mini.id] ?? null}
                  isAdmin={isAdminUser}
                />
              ))}

            </div>
          </section>
        ))
      )}
    </AppShell>
  );
}

function TrackAppCard({ app, unlocked, extraExpiresAt, isAdmin }: { app: MiniApp; unlocked: boolean; extraExpiresAt: string | null; isAdmin?: boolean }) {
  const route = (app.route_path && app.route_path.trim()) || `/app/${app.slug}`;
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
            <CheckCircle2 className="h-3 w-3" /> {isAdmin ? "Admin" : "Liberado"}
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
        {unlocked ? (
          <Link to={route} className="block w-full rounded-xl bg-primary py-2 text-center text-sm font-semibold text-primary-foreground">
            Acessar
          </Link>
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

function MeuEstagioCard() {
  const [estagio] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });
  return (
    <Card className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Identificação</p>
      <h3 className="mt-1 font-display text-lg font-bold">Meu estágio</h3>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div><dt className="text-muted-foreground">Campo</dt><dd className="font-medium">{estagio.campo || "—"}</dd></div>
        <div><dt className="text-muted-foreground">Preceptor(a)</dt><dd className="font-medium">{estagio.preceptor || "—"}</dd></div>
        <div><dt className="text-muted-foreground">Período</dt><dd className="font-medium">{estagio.periodo || "—"}</dd></div>
      </dl>
      <Link to="/diario" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
        Editar no Diário
      </Link>
    </Card>
  );
}
