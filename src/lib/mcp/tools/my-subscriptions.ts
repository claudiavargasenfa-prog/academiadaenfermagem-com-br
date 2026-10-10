import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
export default defineTool({
  name: "minhas_assinaturas",
  title: "Consultar minhas assinaturas",
  description: "Consulta apenas os planos e as datas de validade da própria conta conectada.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_, ctx) => {
    const db = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Entre na sua conta.");
    const { data, error } = await db.from("user_subscriptions").select("plan_slug,status,expires_at").eq("user_id", userId).order("expires_at", { ascending: false }).limit(100);
    if (error) throw new ToolError("Não foi possível consultar suas assinaturas.");
    const assinaturas = (data ?? []).map(row => ({ academia: row.plan_slug, status: row.status, validade: row.expires_at }));
    return { content: [{ type: "text", text: JSON.stringify(assinaturas) }], structuredContent: { assinaturas } };
  },
});