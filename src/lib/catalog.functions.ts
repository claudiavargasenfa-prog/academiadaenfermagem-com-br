import { createServerFn } from "@tanstack/react-start";

export const listMiniAppsCatalog = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Catálogo usado pela vitrine das Academias.
    // Retorna apenas metadados; conteúdo protegido continua fora deste endpoint.
    const { data, error } = await supabaseAdmin
      .from("mini_apps")
      .select(
        "id, slug, name, description, kind, price_cents, cakto_product_id, cakto_checkout_url, icon, is_active, sort_order, created_at, updated_at, gratuito, em_breve, route_path, horas_certificado, price_original_cents, track_academico, track_tecnico, track_enfermeiro, badges",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching catalog with admin client:", error);
      return [];
    }

    return data || [];
  });
