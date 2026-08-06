import { createServerFn } from "@tanstack/react-start";

/**
 * Catálogo público de guias clínicos.
 * Retorna APENAS colunas não sensíveis (sem content_md/video_url/audio_url).
 * Executa no servidor para que visitantes não autenticados não precisem de
 * acesso direto ao banco (nenhuma função SECURITY DEFINER exposta ao anon).
 */
const SAFE_COLUMNS = [
  "id",
  "slug",
  "name",
  "description",
  "kind",
  "price_cents",
  "price_original_cents",
  "cakto_product_id",
  "cakto_checkout_url",
  "icon",
  "is_active",
  "sort_order",
  "gratuito",
  "em_breve",
  "route_path",
  "horas_certificado",
  "track_academico",
  "track_tecnico",
  "track_enfermeiro",
  "badges",
  "created_at",
  "updated_at",
].join(", ");

export const listMiniAppsCatalog = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("mini_apps")
      .select(SAFE_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true });
    if (error) throw new Error("Não foi possível carregar o catálogo.");
    return data ?? [];
  },
);
