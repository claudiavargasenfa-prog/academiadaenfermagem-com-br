import { createClient } from "@supabase/supabase-js";
import { ToolError, type ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

function configuredEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token || !ctx.getUserId()) throw new ToolError("Entre na sua conta para continuar.");
  const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  let key = configuredEnv(["SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"]);
  if (!key && process.env.SUPABASE_PUBLISHABLE_KEYS) {
    try {
      const values: unknown = JSON.parse(process.env.SUPABASE_PUBLISHABLE_KEYS);
      if (values && typeof values === "object") key = Object.values(values).find((v): v is string => typeof v === "string" && v.startsWith("sb_publishable_"));
    } catch { /* Legacy key fallback below. */ }
  }
  key ??= configuredEnv(["SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY"]);
  if (!url || !key) throw new ToolError("A conexão com as contas está indisponível. Tente novamente mais tarde.");
  return createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}