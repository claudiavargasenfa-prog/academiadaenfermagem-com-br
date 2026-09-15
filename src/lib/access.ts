import { supabase } from "@/integrations/supabase/client";
import { listMiniAppsCatalog } from "@/lib/catalog.functions";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type MiniApp = Database["public"]["Tables"]["mini_apps"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type UserAppAccess = Database["public"]["Tables"]["user_app_access"]["Row"];
export type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];
export type PlanOffer = Database["public"]["Tables"]["plan_offers"]["Row"];
export type UserSubscription = Database["public"]["Tables"]["user_subscriptions"]["Row"];

export type TrackSlug = "academico" | "tecnico" | "tecnico-estudante" | "enfermeiro" | "uti-emergencia";
export const TRACKS: { slug: TrackSlug; label: string; short: string; emoji: string }[] = [
  { slug: "academico", label: "Academia do Acadêmico", short: "Acadêmico", emoji: "🎓" },
  { slug: "tecnico", label: "Academia do Técnico", short: "Técnico", emoji: "🩺" },
  { slug: "tecnico-estudante", label: "Academia do Estudante de Técnico", short: "Estudante de Técnico", emoji: "📗" },
  { slug: "enfermeiro", label: "Academia do Enfermeiro", short: "Enfermeiro", emoji: "👩‍⚕️" },
  { slug: "uti-emergencia", label: "Academia de Terapia Intensiva & Emergência", short: "UTI & Emergência", emoji: "⚡" },
];

export const CAMPAIGN_FREE_UNTIL = new Date("2026-09-30T23:59:59-03:00");
export const CAMPAIGN_FREE_UNTIL_LABEL = "30/09/2026";
export const PERMANENT_FREE_SLUGS = ["SAUDEMENTALPROF.", "cuidando-de-quem-cuida"];
export function isCampaignOpen(now: Date = new Date()): boolean { return now.getTime() <= CAMPAIGN_FREE_UNTIL.getTime(); }

export function appTracks(app: MiniApp): TrackSlug[] {
  const out: TrackSlug[] = [];
  if ((app as any).track_academico) out.push("academico");
  if ((app as any).track_tecnico) out.push("tecnico");
  if ((app as any).track_enfermeiro) out.push("enfermeiro");
  if ((app as any).track_uti_emergencia) out.push("uti-emergencia");
  return out;
}

export function useAuthReady() {
  const [state, setState] = useState<{ isReady: boolean; user: User | null }>({ isReady: false, user: null });
  useEffect(() => {
    let alive = true;
    let unsubscribe: (() => void) | undefined;
    try {
      supabase.auth.getSession().then(({ data }) => { if (alive) setState({ isReady: true, user: data.session?.user ?? null }); }).catch((error) => {
        console.error("Authentication temporarily unavailable:", error);
        if (alive) setState({ isReady: true, user: null });
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => { if (alive) setState({ isReady: true, user: session?.user ?? null }); });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (error) {
      console.error("Authentication could not start:", error);
      setState({ isReady: true, user: null });
    }
    return () => { alive = false; unsubscribe?.(); };
  }, []);
  return state;
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase.from("subscription_plans").select("*").order("sort_order", { ascending: true });
  if (error) throw error; return data ?? [];
}
export async function fetchPlanOffers(): Promise<PlanOffer[]> {
  const { data, error } = await supabase.from("plan_offers").select("*").order("sort_order", { ascending: true });
  if (error) throw error; return data ?? [];
}
export async function fetchMyActiveSubscriptions(): Promise<UserSubscription[]> {
  const { data: sessionData } = await supabase.auth.getSession(); const user = sessionData.session?.user; if (!user) return [];
  const { data, error } = await supabase.from("user_subscriptions").select("*").eq("user_id", user.id).in("status", ["active", "trial"]).gt("expires_at", new Date().toISOString());
  if (error) throw error; return data ?? [];
}
export async function fetchMyProfile() {
  const { data: sessionData } = await supabase.auth.getSession(); const user = sessionData.session?.user; if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(); return data;
}
export const ACCESS_DAYS = 150;
export function formatPriceBRL(cents: number): string { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100); }
export function daysUntil(iso: string | null | undefined): number | null { if (!iso) return null; return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))); }
export async function fetchMiniApps(): Promise<MiniApp[]> { const data = await listMiniAppsCatalog(); return (data ?? []) as unknown as MiniApp[]; }
export async function fetchMyExtraAccess(): Promise<UserAppAccess[]> {
  const { data, error } = await supabase.from("user_app_access").select("*").gt("expires_at", new Date().toISOString()).order("expires_at", { ascending: true });
  if (error) throw error; return data ?? [];
}
export async function fetchMyBasicSubscription(): Promise<Subscription | null> {
  const { data, error } = await supabase.from("subscriptions").select("*, mini_apps!inner(kind)").eq("mini_apps.kind", "basico").maybeSingle();
  if (error && error.code !== "PGRST116") throw error; return (data as Subscription | null) ?? null;
}
export async function isAdmin(): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession(); const user = sessionData.session?.user; if (!user) return false;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(); return !!data;
}
export function useIsAdmin() {
  const { isReady, user } = useAuthReady(); const userId = user?.id ?? null; const email = user?.email ?? "";
  return useQuery({ queryKey: ["is_admin", userId], queryFn: async () => email === "enfa.contato@gmail.com" ? true : isAdmin(), enabled: isReady && !!userId, staleTime: 0 });
}
export type AccessSummary = { extraAccessByApp: Record<string, string> };
export function summarizeExtras(extras: UserAppAccess[]): AccessSummary {
  const extraAccessByApp: Record<string, string> = {};
  for (const a of extras) if (!extraAccessByApp[a.mini_app_id] || new Date(a.expires_at) > new Date(extraAccessByApp[a.mini_app_id])) extraAccessByApp[a.mini_app_id] = a.expires_at;
  return { extraAccessByApp };
}
export function summarizeAccess(sub: Subscription | null, extras: UserAppAccess[]) {
  const basicActive = !!sub && sub.status === "active" && (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
  return { basicActive, basicEndsAt: sub?.current_period_end ?? null, extraAccessByApp: summarizeExtras(extras).extraAccessByApp };
}

export function useAppAccess(slug: string) {
  const { isReady, user } = useAuthReady();
  return useQuery({
    queryKey: ["app_access", slug, user?.id ?? "anon"],
    queryFn: async () => {
      const { data: metaRows, error: e1 } = await supabase.rpc("get_mini_app_meta", { _slug: slug });
      if (e1) throw e1;
      const app = (metaRows ?? [])[0] ?? null;
      if (!app) return { app: null, granted: false, expiresAt: null as string | null, viaAdmin: false, accessType: "none" as const };
      const permanentlyFree = PERMANENT_FREE_SLUGS.includes(slug) || slug.toLowerCase().includes("cuidando-de-quem-cuida");
      if (app.gratuito || permanentlyFree) return { app, granted: true, expiresAt: null as string | null, viaAdmin: false, accessType: "free" as const };
      if (!user) return { app, granted: false, expiresAt: null as string | null, viaAdmin: false, accessType: "none" as const };

      const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (roleRow) return { app, granted: true, expiresAt: null as string | null, viaAdmin: true, accessType: "admin" as const };

      const { data: acc } = await supabase.from("user_app_access").select("expires_at").eq("user_id", user.id).eq("mini_app_id", app.id).gt("expires_at", new Date().toISOString()).order("expires_at", { ascending: false }).limit(1).maybeSingle();
      if (acc) return { app, granted: true, expiresAt: acc.expires_at, viaAdmin: false, accessType: "purchase" as const };

      const now = new Date();
      const createdAt = user.created_at ? new Date(user.created_at) : now;
      if (isCampaignOpen(now) && createdAt.getTime() <= CAMPAIGN_FREE_UNTIL.getTime()) {
        return { app, granted: true, expiresAt: CAMPAIGN_FREE_UNTIL.toISOString(), viaAdmin: false, accessType: "campaign" as const };
      }

      // A partir de 01/10, nenhuma assinatura do tipo trial criada pela campanha mantém acesso.
      // Somente assinatura paga vigente (active) ou acesso individual comprado libera o conteúdo.
      const { data: placements } = await supabase.from("mini_app_placements").select("app_id, apps:app_id (slug)").eq("mini_app_id", app.id);
      const planSlugs: string[] = (placements ?? []).map((p: any) => p.apps?.slug).filter(Boolean);
      if (planSlugs.length > 0) {
        const { data: sub } = await supabase.from("user_subscriptions").select("expires_at").eq("user_id", user.id).eq("status", "active").in("plan_slug", planSlugs).gt("expires_at", new Date().toISOString()).order("expires_at", { ascending: false }).limit(1).maybeSingle();
        if (sub) return { app, granted: true, expiresAt: sub.expires_at, viaAdmin: false, accessType: "subscription" as const };
      }
      return { app, granted: false, expiresAt: null as string | null, viaAdmin: false, accessType: "none" as const };
    },
    enabled: isReady,
  });
}
