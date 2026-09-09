import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

export type AppRow = Database["public"]["Tables"]["apps"]["Row"];
export type AppSection = Database["public"]["Tables"]["app_sections"]["Row"];
export type MiniAppPlacement = Database["public"]["Tables"]["mini_app_placements"]["Row"];

type CatalogMiniApp = {
  id: string;
  is_active: boolean;
  sort_order: number;
  track_academico?: boolean;
  track_tecnico?: boolean;
  track_tecnico_estudante?: boolean;
  track_enfermeiro?: boolean;
};

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
  const { data: app, error: appError } = await supabase
    .from("apps")
    .select("slug")
    .eq("id", appId)
    .maybeSingle();
  if (appError) throw appError;

  const { data: placements, error } = await supabase
    .from("mini_app_placements")
    .select("*")
    .eq("app_id", appId)
    .order("ordem", { ascending: true });
  if (error) throw error;

  // Os placements são a fonte primária da composição da Academia.
  // A consulta de catálogo abaixo é apenas um complemento para recuperar
  // eventuais Mini Apps que estejam marcados na trilha mas sem placement.
  const trackBySlug: Record<string, keyof CatalogMiniApp | null> = {
    academico: "track_academico",
    tecnico: "track_tecnico",
    "tecnico-estudante": "track_tecnico_estudante",
    enfermeiro: "track_enfermeiro",
  };
  const trackField = app?.slug ? trackBySlug[app.slug] : null;
  if (!trackField) return placements ?? [];

  // O banco de produção pode ainda não ter a coluna opcional da trilha do
  // Estudante de Técnico. Se a consulta complementar falhar, NÃO podemos
  // derrubar a Academia: os placements válidos continuam sendo retornados.
  const miniAppsTable = supabase.from("mini_apps") as any;
  const { data: catalog, error: catalogError } = await miniAppsTable
    .select("id, is_active, sort_order, track_academico, track_tecnico, track_tecnico_estudante, track_enfermeiro")
    .eq("is_active", true)
    .eq(trackField, true)
    .order("sort_order", { ascending: true });

  if (catalogError) {
    console.warn("Optional academy track lookup unavailable; using placements:", catalogError);
    return placements ?? [];
  }

  const existing = new Set((placements ?? []).map((p) => p.mini_app_id));
  const base = placements ?? [];
  const missing = ((catalog ?? []) as CatalogMiniApp[])
    .filter((m) => !existing.has(m.id))
    .map((m, index) => ({
      id: `catalog-${appId}-${m.id}`,
      app_id: appId,
      mini_app_id: m.id,
      codigo: null,
      created_at: new Date(0).toISOString(),
      ordem: base.length + index + 1,
      section_id: null,
      updated_at: new Date(0).toISOString(),
    }) as MiniAppPlacement);

  return [...base, ...missing];
}

export async function fetchAllPlacements(): Promise<MiniAppPlacement[]> {
  const { data, error } = await supabase
    .from("mini_app_placements")
    .select("*")
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
