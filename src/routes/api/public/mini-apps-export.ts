import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/mini-apps-export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const expected = `Bearer ${process.env["MINI_APPS_EXPORT_TOKEN"] ?? "export-dev-token"}`;
        if (auth !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: apps, error: appsError } = await supabaseAdmin
          .from("mini_apps")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true });

        if (appsError) {
          console.error(appsError);
          return Response.json({ error: appsError.message }, { status: 500 });
        }

        const { data: subs, error: subsError } = await supabaseAdmin
          .from("mini_app_subtopics")
          .select("*")
          .order("ordem", { ascending: true });

        if (subsError) {
          console.error(subsError);
          return Response.json({ error: subsError.message }, { status: 500 });
        }

        return Response.json({ apps: apps ?? [], subtopics: subs ?? [] });
      },
    },
  },
});
