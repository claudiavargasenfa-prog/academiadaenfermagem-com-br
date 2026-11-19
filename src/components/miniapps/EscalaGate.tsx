import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppAccessGate } from "@/components/ContentProtection";
import { useAppAccess, useAuthReady } from "@/lib/access";
import { escalaBloqueada } from "@/lib/escala-renovacao";
import { EscalaPro } from "./EscalaPro";

/** Quem já pagou um dia continua vendo a Escala; sem pagamento vigente fica só leitura. */
export function EscalaGate({ slug }: { slug: string }) {
  const { user } = useAuthReady();
  const acc = useAppAccess(slug);
  const appId = acc.data?.app?.id;
  const antigo = useQuery({
    queryKey: ["escala_antigo", user?.id, appId],
    enabled: !!user && !!appId && acc.data?.granted === false,
    queryFn: async () => {
      const { data } = await supabase.from("user_app_access").select("expires_at").eq("user_id", user!.id).eq("mini_app_id", appId!).order("expires_at", { ascending: false }).limit(1).maybeSingle();
      return data?.expires_at ?? null;
    },
  });
  if (acc.isLoading) return null;
  if (acc.data?.granted) {
    return <EscalaPro bloqueada={escalaBloqueada(new Date(), acc.data.expiresAt, acc.data.viaAdmin)} />;
  }
  if (antigo.isLoading) return null;
  if (antigo.data) return <EscalaPro bloqueada />;
  return <AppAccessGate slug={slug}><EscalaPro /></AppAccessGate>;
}
