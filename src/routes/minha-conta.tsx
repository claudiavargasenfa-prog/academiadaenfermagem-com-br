import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMiniApps,
  fetchMyBasicSubscription,
  fetchMyExtraAccess,
  fetchMyActiveSubscriptions,
  fetchSubscriptionPlans,
  summarizeAccess,
  daysUntil,
  TRACKS,
  type TrackSlug,
} from "@/lib/access";
import BeneficiosPlano from "@/components/conta/BeneficiosPlano";
import ComparativoUpgrade from "@/components/conta/ComparativoUpgrade";
import { CertificadoFAQ } from "@/components/CertificadoFAQ";



export const Route = createFileRoute("/minha-conta")({
  head: () => ({
    meta: [{ title: "Minha Conta — Academia da Enfermagem" }],
  }),
  component: MinhaContaPage,
});

function MinhaContaPage() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName(
        data.user?.user_metadata?.full_name ??
          data.user?.user_metadata?.name ??
          "",
      );
    });
  }, []);

  const appsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const subQ = useQuery({ queryKey: ["my_basic_sub"], queryFn: fetchMyBasicSubscription });
  const extrasQ = useQuery({ queryKey: ["my_extras"], queryFn: fetchMyExtraAccess });
  const mySubsQ = useQuery({ queryKey: ["my_subs"], queryFn: fetchMyActiveSubscriptions });
  const plansQ = useQuery({ queryKey: ["subscription_plans"], queryFn: fetchSubscriptionPlans });

  const apps = appsQ.data ?? [];
  const access = summarizeAccess(subQ.data ?? null, extrasQ.data ?? []);
  const basico = apps.find((a) => a.kind === "basico");
  const mySubs = [...(mySubsQ.data ?? [])].sort(
    (a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
  );
  const plans = plansQ.data ?? [];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Sua conta"
        title="Minha Conta"
        description="Veja suas assinaturas e os mini apps que você comprou."
      />

      {mySubs.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 font-display text-lg font-bold">Status da sua assinatura</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {mySubs.map((s) => {
              const track = TRACKS.find((t) => t.slug === (s.plan_slug as TrackSlug));
              const plan = plans.find((p) => p.slug === s.plan_slug);
              const url = plan?.cakto_link_novo || plan?.cakto_checkout_url || "";
              const days = daysUntil(s.expires_at) ?? 0;
              const isTrial = s.status === "trial";

              const soon = days <= 5;
              return (
                <div
                  key={s.id}
                  className={`glass rounded-2xl p-4 ${soon ? "ring-2 ring-orange-400" : ""}`}
                >
                  <p className="font-display text-base font-bold">
                    {track?.label ?? s.plan_slug}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {isTrial ? "Período gratuito" : "Assinatura ativa"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isTrial ? "Termina em " : "Vence em "}
                    {new Date(s.expires_at).toLocaleDateString("pt-BR")} ({days}{" "}
                    {days === 1 ? "dia" : "dias"})
                  </p>
                  {url && soon && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block rounded-xl gold-gradient px-4 py-2 text-sm font-bold"
                    >
                      {isTrial ? "Associe-se agora" : "Renovar assinatura"}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}



      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold">Perfil</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Nome</dt>
              <dd className="font-medium">{name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">E-mail</dt>
              <dd className="font-medium">{email || "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold">Acesso Premium ADEC</h3>
          {access.basicActive ? (
            <>
              <p className="mt-2 text-sm font-semibold text-emerald-700">Assinatura ativa</p>
              {access.basicEndsAt && (
                <p className="text-xs text-muted-foreground">
                  Próxima cobrança: {new Date(access.basicEndsAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Você ainda não tem o Acesso Premium ativo.
              </p>
              {basico?.cakto_checkout_url && (
                <a
                  href={basico.cakto_checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-xl gold-gradient px-4 py-2 text-sm font-bold"
                >
                  Assinar agora
                </a>
              )}
            </>
          )}
        </Card>
      </div>

      <BeneficiosPlano />
      
      <ComparativoUpgrade />

      <section className="mt-6">

        <h2 className="mb-3 font-display text-lg font-bold">Módulos Especializados Adquiridos</h2>
        {Object.keys(access.extraAccessByApp).length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">
              Você ainda não adquiriu nenhum módulo de especialização extra.{" "}
              <Link to="/loja" className="font-semibold text-primary hover:underline">
                Ver loja
              </Link>
              .
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(access.extraAccessByApp).map(([appId, expiresAt]) => {
              const app = apps.find((a) => a.id === appId);
              if (!app) return null;
              const days = daysUntil(expiresAt);
              return (
                <div key={appId} className="glass rounded-2xl p-4">
                  <p className="font-display text-base font-bold">{app.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expira em {new Date(expiresAt).toLocaleDateString("pt-BR")} ({days} dias)
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">Dúvidas sobre Certificados?</h2>
        <CertificadoFAQ />
      </section>
    </AppShell>
  );
}
