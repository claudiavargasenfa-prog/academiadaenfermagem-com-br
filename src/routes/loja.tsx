import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Lock, CheckCircle2, Clock, ExternalLink, Sparkles } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  fetchMiniApps,
  fetchMyBasicSubscription,
  fetchMyExtraAccess,
  formatPriceBRL,
  daysUntil,
  summarizeAccess,
  type MiniApp,
} from "@/lib/access";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja Premium — Acadêmico de Bolso" },
      {
        name: "description",
        content:
          "Assine o app básico e libere mini apps extras de enfermagem para o seu estágio.",
      },
    ],
  }),
  component: LojaPage,
});

function LojaPage() {
  const appsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const subQ = useQuery({
    queryKey: ["my_basic_sub"],
    queryFn: fetchMyBasicSubscription,
  });
  const extrasQ = useQuery({
    queryKey: ["my_extras"],
    queryFn: fetchMyExtraAccess,
  });

  const loading = appsQ.isLoading || subQ.isLoading || extrasQ.isLoading;
  const apps = appsQ.data ?? [];
  const access = summarizeAccess(subQ.data ?? null, extrasQ.data ?? []);
  const basico = apps.find((a) => a.kind === "basico");
  const extras = apps.filter((a) => a.kind === "extra");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Loja Premium"
        title="Mini apps para o seu estágio"
        description="Assine o app básico (mensal) e adicione mini apps extras conforme precisar. Cada extra libera 3 meses de acesso."
      />

      {loading && (
        <Card>
          <p className="text-sm text-muted-foreground">Carregando catálogo...</p>
        </Card>
      )}

      {!loading && apps.length === 0 && (
        <Card>
          <p className="text-sm text-muted-foreground">
            Nenhum mini app cadastrado ainda. Quando você cadastrar os apps no painel
            admin, eles aparecerão aqui.
          </p>
        </Card>
      )}

      {basico && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-bold">App Básico</h2>
          <AppCard app={basico} basicActive={access.basicActive} basicEndsAt={access.basicEndsAt} />
        </section>
      )}

      {extras.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Mini apps extras</h2>
          {!access.basicActive && (
            <Card className="mb-3 border-gold/40">
              <p className="text-sm">
                <Sparkles className="mr-1 inline h-4 w-4 text-gold" />
                Para usar os extras você precisa do <strong>App Básico</strong> ativo.
              </p>
            </Card>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                basicActive={access.basicActive}
                extraExpiresAt={access.extraAccessByApp[app.id] ?? null}
              />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function AppCard({
  app,
  basicActive,
  basicEndsAt,
  extraExpiresAt,
}: {
  app: MiniApp;
  basicActive: boolean;
  basicEndsAt?: string | null;
  extraExpiresAt?: string | null;
}) {
  const isBasico = app.kind === "basico";
  const unlocked = isBasico ? basicActive : basicActive && !!extraExpiresAt;
  const daysLeft = daysUntil(isBasico ? basicEndsAt ?? null : extraExpiresAt ?? null);

  return (
    <div className="glass flex flex-col rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl gold-gradient text-lg">
          {app.icon ?? (isBasico ? "★" : "📘")}
        </div>
        {unlocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Liberado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
            <Lock className="h-3 w-3" /> Bloqueado
          </span>
        )}
      </div>

      <h3 className="font-display text-base font-bold">{app.name}</h3>
      {app.description && (
        <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
      )}

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-foreground">
            {formatPriceBRL(app.price_cents)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isBasico ? "por mês (recorrente)" : "pagamento único · 3 meses"}
          </p>
        </div>
      </div>

      {unlocked && daysLeft !== null && daysLeft <= 30 && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
          <Clock className="h-3 w-3" /> Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}
        </p>
      )}

      <div className="mt-3">
        {unlocked ? (
          <Link
            to="/minha-conta"
            className="block w-full rounded-xl bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            Acessar
          </Link>
        ) : app.cakto_checkout_url ? (
          <a
            href={app.cakto_checkout_url}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-1 rounded-xl gold-gradient py-2 text-sm font-bold text-foreground"
          >
            {isBasico ? "Assinar" : "Comprar"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-foreground/10 py-2 text-sm font-semibold text-foreground/50"
          >
            Em breve
          </button>
        )}
      </div>
    </div>
  );
}
