import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { OAuthAuthorizationDetails } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "" }),
  head: () => ({ meta: [
    { title: "Autorizar agente — ADEC" },
    { name: "description", content: "Autorize ou recuse a conexão de um agente à sua conta ADEC." },
    { property: "og:title", content: "Autorizar agente — ADEC" },
    { property: "og:description", content: "Conexão protegida de agentes à Academia da Enfermagem." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: () => <AuthGate signInOnly><Consent /></AuthGate>,
});

function Consent() {
  const { authorization_id } = Route.useSearch();
  const [details, setDetails] = useState<OAuthAuthorizationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!authorization_id) throw new Error("Solicitação de autorização ausente. Inicie a conexão novamente no agente.");
        const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorization_id);
        if (error?.message.includes("unauthorized request origin")) throw new Error("A autorização precisa ser concluída no endereço oficial do aplicativo, após publicar esta versão.");
        if (error || !data) throw new Error("Esta solicitação venceu ou não está disponível. Inicie a conexão novamente no agente.");
        if (!active) return;
        if ("redirect_url" in data) { window.location.assign(data.redirect_url); return; }
        setDetails(data);
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Não foi possível abrir a autorização."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [authorization_id]);

  async function decide(approve: boolean) {
    setBusy(true); setError(null);
    try {
      const { data, error } = approve
        ? await supabase.auth.oauth.approveAuthorization(authorization_id, { skipBrowserRedirect: true })
        : await supabase.auth.oauth.denyAuthorization(authorization_id, { skipBrowserRedirect: true });
      if (error || !data?.redirect_url) throw new Error("Não foi possível concluir sua escolha. Tente novamente.");
      window.location.assign(data.redirect_url);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível concluir a autorização."); setBusy(false); }
  }
  return <main className="min-h-dvh bg-background px-4 py-12 text-foreground">
    <section className="mx-auto max-w-lg space-y-6">
      <ShieldCheck className="h-10 w-10 text-primary" />
      <h1 className="font-display text-2xl font-bold">Autorizar conexão à ADEC</h1>
      {loading && <Loader2 aria-label="Carregando autorização" className="h-6 w-6 animate-spin text-primary" />}
      {details && <>
        <p><strong>{details.client.name}</strong> solicita acesso à sua conta.</p>
        <p className="text-muted-foreground">Você permitirá consultar Academias, conteúdos aos quais tem acesso e suas assinaturas. Esta conexão não permite editar, excluir ou realizar pagamentos.</p>
        <p className="text-sm text-muted-foreground">Autorize apenas agentes em que você confia.</p>
      </>}
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {details && <div className="flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => decide(true)}>{busy ? "Aguarde..." : "Autorizar"}</Button>
        <Button variant="outline" disabled={busy} onClick={() => decide(false)}>Recusar</Button>
      </div>}
    </section>
  </main>;
}