import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const listMiniAppsCatalog = createServerFn({ method: "GET" })
  .handler(async () => {
    // Note: The table name in Supabase is 'mini_apps', but we used 'mini_apps_catalog' in the previous attempt
    // Let's check the actual table used for the catalog. Based on types, it's 'mini_apps'.
    const { data, error } = await supabase
      .from("mini_apps")
      .select("id, name, track_tecnico, track_academico, track_enfermeiro")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching catalog:", error);
      return [];
    }

    return data || [];
  });
