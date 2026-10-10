import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
export default defineTool({
  name: "consultar_conteudo",
  title: "Consultar conteúdo autorizado",
  description: "Consulta o texto de um Mini App apenas quando a conta conectada possui acesso a ele.",
  inputSchema: { slug: z.string().min(1).max(150).describe("Identificador do Mini App.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    const db = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Entre na sua conta.");
    const { data: meta, error: metaError } = await db.rpc("get_mini_app_meta", { _slug: slug });
    const item = meta?.[0];
    if (metaError || !item) throw new ToolError("Mini App não encontrado ou indisponível.");
    const { data: allowed, error: accessError } = await db.rpc("has_app_access", { _user_id: userId, _mini_app_id: item.id });
    if (accessError || !allowed) throw new ToolError("Sua conta não possui acesso a este conteúdo.");
    const { data, error } = await db.from("mini_apps").select("slug,name,content_md").eq("id", item.id).eq("is_active", true).maybeSingle();
    if (error || !data) throw new ToolError("O conteúdo não está disponível para esta conta.");
    const conteudo = { slug: data.slug, nome: data.name, texto: data.content_md ?? "" };
    return { content: [{ type: "text", text: JSON.stringify(conteudo) }], structuredContent: { conteudo } };
  },
});