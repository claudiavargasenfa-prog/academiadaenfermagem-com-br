import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
export default defineTool({
  name: "listar_academias",
  title: "Listar Academias",
  description: "Lista as Academias ativas, sem revelar conteúdo protegido nem informações de alunos.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_, ctx) => {
    const { data, error } = await supabaseForUser(ctx).from("apps").select("id,slug,name,description").eq("is_active", true).order("ordem").limit(100);
    if (error) throw new ToolError("Não foi possível consultar as Academias.");
    const academias = (data ?? []).map(row => ({ id: row.id, slug: row.slug, nome: row.name, descricao: row.description }));
    return { content: [{ type: "text", text: JSON.stringify(academias) }], structuredContent: { academias } };
  },
});