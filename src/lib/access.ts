import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type MiniApp = Database["public"]["Tables"]["mini_apps"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type UserAppAccess = Database["public"]["Tables"]["user_app_access"]["Row"];
export type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];
export type UserSubscription = Database["public"]["Tables"]["user_subscriptions"]["Row"];

export type TrackSlug = "academico" | "tecnico" | "enfermeiro";

export const TRACKS: { slug: TrackSlug; label: string; short: string; emoji: string }[] = [
  { slug: "academico", label: "Academia do Acadêmico", short: "Acadêmico", emoji: "🎓" },
  { slug: "tecnico", label: "Academia do Técnico", short: "Técnico", emoji: "🩺" },
  { slug: "enfermeiro", label: "Academia do Enfermeiro", short: "Enfermeiro", emoji: "👩‍⚕️" },
];

export function appTracks(app: MiniApp): TrackSlug[] {
  const out: TrackSlug[] = [];
  if ((app as any).track_academico) out.push("academico");
  if ((app as any).track_tecnico) out.push("tecnico");
  if ((app as any).track_enfermeiro) out.push("enfermeiro");
  return out;
}

export function useAuthReady() {
  const [state, setState] = useState<{
    isReady: boolean;
    user: User | null;
  }>({ isReady: false, user: null });

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setState({ isReady: true, user: data.session?.user ?? null });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ isReady: true, user: session?.user ?? null });
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyActiveSubscriptions(): Promise<UserSubscription[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return [];
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "trial"])
    .gt("expires_at", new Date().toISOString());
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data;
}

/** Dias de acesso após a compra (regra de negócio). */
export const ACCESS_DAYS = 150;

export function formatPriceBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export async function fetchMiniApps(): Promise<MiniApp[]> {
  const { data, error } = await supabase
    .from("mini_apps")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyExtraAccess(): Promise<UserAppAccess[]> {
  const { data, error } = await supabase
    .from("user_app_access")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Legado — mantido por compatibilidade com a tela /minha-conta. */
export async function fetchMyBasicSubscription(): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, mini_apps!inner(kind)")
    .eq("mini_apps.kind", "basico")
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return (data as Subscription | null) ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

/** Hook: o usuário atual é admin? Cacheado por sessão. */
export function useIsAdmin() {
  const { isReady, user } = useAuthReady();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: ["is_admin", userId],
    queryFn: isAdmin,
    enabled: isReady && !!userId,
    staleTime: 5 * 60 * 1000,
    initialData: false,
  });
}

export type AccessSummary = {
  /** mini_app_id -> expires_at (apenas extras pagos vigentes) */
  extraAccessByApp: Record<string, string>;
};

export function summarizeExtras(extras: UserAppAccess[]): AccessSummary {
  const extraAccessByApp: Record<string, string> = {};
  for (const a of extras) {
    if (
      !extraAccessByApp[a.mini_app_id] ||
      new Date(a.expires_at) > new Date(extraAccessByApp[a.mini_app_id])
    ) {
      extraAccessByApp[a.mini_app_id] = a.expires_at;
    }
  }
  return { extraAccessByApp };
}

/** Compat: muitos componentes ainda importam `summarizeAccess`. */
export function summarizeAccess(
  sub: Subscription | null,
  extras: UserAppAccess[],
) {
  const basicActive =
    !!sub &&
    sub.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
  return {
    basicActive,
    basicEndsAt: sub?.current_period_end ?? null,
    extraAccessByApp: summarizeExtras(extras).extraAccessByApp,
  };
}

/** Hook: estado de acesso do usuário atual a um mini app (por slug). */
export function useAppAccess(slug: string) {
  const { isReady, user } = useAuthReady();

  return useQuery({
    queryKey: ["app_access", slug, user?.id ?? "anon"],
    queryFn: async () => {
      const { data: app, error: e1 } = await supabase
        .from("mini_apps")
        .select("id, name, slug, gratuito, em_breve, route_path, cakto_checkout_url, price_cents, price_original_cents")
        .eq("slug", slug)
        .maybeSingle();
      if (e1) throw e1;
      if (!app) return { app: null, granted: false, expiresAt: null as string | null, viaAdmin: false };
      if (app.gratuito) {
        return { app, granted: true, expiresAt: null as string | null, viaAdmin: false };
      }
      if (!user) return { app, granted: false, expiresAt: null as string | null, viaAdmin: false };

      // Admin bypass: vê todo conteúdo pago sem registro em user_app_access.
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleRow) {
        return { app, granted: true, expiresAt: null as string | null, viaAdmin: true };
      }

      const { data: acc } = await supabase
        .from("user_app_access")
        .select("expires_at")
        .eq("user_id", user.id)
        .eq("mini_app_id", app.id)
        .gt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (acc) {
        return { app, granted: true, expiresAt: acc.expires_at, viaAdmin: false };
      }

      // Acesso via assinatura de qualquer app que contenha este mini app
      const { data: placements } = await supabase
        .from("mini_app_placements")
        .select("app_id, apps:app_id (slug)")
        .eq("mini_app_id", app.id);
      const planSlugs: string[] = (placements ?? [])
        .map((p: any) => p.apps?.slug)
        .filter(Boolean);
      if (planSlugs.length > 0) {
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .in("status", ["active", "trial"])
          .in("plan_slug", planSlugs)
          .gt("expires_at", new Date().toISOString())
          .order("expires_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (sub) {
          return { app, granted: true, expiresAt: sub.expires_at, viaAdmin: false };
        }
      }
      return { app, granted: false, expiresAt: null as string | null, viaAdmin: false };
    },
    enabled: isReady,
  });
}
