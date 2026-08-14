import { createServerFn } from "@tanstack/react-start";

export const listMiniAppsCatalog = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data, error } = await supabaseAdmin
      .from("mini_apps")
      .select("id, name, track_tecnico, track_academico, track_enfermeiro")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching catalog with admin client:", error);
      return [];
    }

    return data || [];
  });
