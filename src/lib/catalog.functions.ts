import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const listMiniAppsCatalog = createServerFn({ method: "GET" })
  .handler(async () => {
    // We select track_* to filter by track on the frontend
    const { data, error } = await supabase
      .from("mini_apps_catalog")
      .select("id, name, track_tecnico, track_academico, track_enfermeiro")
      .eq("status", "active")
      .order("name");

    if (error) {
      console.error("Error fetching catalog:", error);
      return [];
    }

    return data || [];
  });
