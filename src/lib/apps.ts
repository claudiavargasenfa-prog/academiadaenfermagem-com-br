import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

export type AppRow = Database["public"]["Tables"]["apps"]["Row"];
export type AppSection = Database["public"]["Tables"]["app_sections"]["Row"];
export type MiniAppPlacement = Database["public"]["Tables"]["mini_app_placements"]["Row"];

export async function fetchApps(): Promise<AppRow[]> {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("ordem", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function useApps() {
  return useQuery({ queryKey: ["apps"], queryFn: fetchApps, staleTime: 60_000 });
}

export async function fetchAppBySlug(slug: string): Promise<AppRow | null> {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function fetchAppSections(appId: string): Promise<AppSection[]> {
  const { data, error } = await supabase
    .from("app_sections")
    .select("*")
    .eq("app_id", appId)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPlacementsForApp(appId: string): Promise<MiniAppPlacement[]> {
  const { data, error } = await supabase
    .from("mini_app_placements")
    .select("*")
    .eq("app_id", appId)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllPlacements(): Promise<MiniAppPlacement[]> {
  const { data, error } = await supabase
    .from("mini_app_placements")
    .select("*")
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
