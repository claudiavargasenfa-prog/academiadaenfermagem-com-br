import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type MiniApp = Database["public"]["Tables"]["mini_apps"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type UserAppAccess = Database["public"]["Tables"]["user_app_access"]["Row"];

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

export async function fetchMyBasicSubscription(): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, mini_apps!inner(kind)")
    .eq("mini_apps.kind", "basico")
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return (data as Subscription | null) ?? null;
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

export async function isAdmin(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", u.user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

export type AccessSummary = {
  basicActive: boolean;
  basicEndsAt: string | null;
  extraAccessByApp: Record<string, string>; // mini_app_id -> expires_at
};

export function summarizeAccess(
  sub: Subscription | null,
  extras: UserAppAccess[],
): AccessSummary {
  const basicActive =
    !!sub &&
    sub.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
  const extraAccessByApp: Record<string, string> = {};
  for (const a of extras) {
    if (
      !extraAccessByApp[a.mini_app_id] ||
      new Date(a.expires_at) > new Date(extraAccessByApp[a.mini_app_id])
    ) {
      extraAccessByApp[a.mini_app_id] = a.expires_at;
    }
  }
  return {
    basicActive,
    basicEndsAt: sub?.current_period_end ?? null,
    extraAccessByApp,
  };
}
