import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMiniApps,
  fetchMyBasicSubscription,
  fetchMyExtraAccess,
  summarizeAccess,
  daysUntil,
} from "@/lib/access";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({
    meta: [{ title: "Minha Conta — Academia de Enfermagem" }],
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

  const apps = appsQ.data ?? [];
  const access = summarizeAccess(subQ.data ?? null, extrasQ.data ?? []);
  const basico = apps.find((a) => a.kind === "basico");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Sua conta"
        title="Minha Conta"
        description="Veja suas assinaturas e os mini apps que você comprou."
      />

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
          <h3 className="font-display text-base font-bold">App Básico</h3>
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
                Você ainda não tem o App Básico ativo.
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

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-bold">Meus mini apps extras</h2>
        {Object.keys(access.extraAccessByApp).length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">
              Você ainda não comprou nenhum mini app extra.{" "}
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
    </AppShell>
  );
}
