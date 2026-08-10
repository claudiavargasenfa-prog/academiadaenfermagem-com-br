import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Acesso negado: somente administradores.");
}

/** Lista alunos (para escolher destinatários). */
export const listRecipientsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, categoria")
      .order("full_name", { ascending: true })
      .limit(2000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Envia mensagem privada para todos ou para os selecionados. */
export const sendAdminMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string; body: string; to_all: boolean; user_ids: string[] }) => {
    const title = (d.title || "").trim();
    const body = (d.body || "").trim();
    if (title.length < 3 || title.length > 150) throw new Error("Título precisa ter de 3 a 150 caracteres.");
    if (body.length < 3 || body.length > 5000) throw new Error("Mensagem precisa ter de 3 a 5000 caracteres.");
    const ids = Array.isArray(d.user_ids) ? d.user_ids.filter(Boolean) : [];
    if (!d.to_all && ids.length === 0) throw new Error("Selecione ao menos um destinatário.");
    return { title, body, to_all: !!d.to_all, user_ids: ids };
  })
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let targets = data.user_ids;
    if (data.to_all) {
      const { data: all, error } = await supabaseAdmin.from("profiles").select("id").limit(5000);
      if (error) throw new Error(error.message);
      targets = (all ?? []).map((p) => p.id);
    }
    if (targets.length === 0) throw new Error("Nenhum destinatário encontrado.");

    const { data: msg, error: mErr } = await supabaseAdmin
      .from("admin_messages")
      .insert({
        admin_id: context.userId,
        title: data.title,
        body: data.body,
        is_broadcast: data.to_all,
      })
      .select("id")
      .single();
    if (mErr) throw new Error(mErr.message);

    const rows = targets.map((user_id) => ({ message_id: msg.id, user_id }));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabaseAdmin
        .from("admin_message_recipients")
        .insert(rows.slice(i, i + 500));
      if (error) throw new Error(error.message);
    }
    return { ok: true, enviados: rows.length };
  });

/** Histórico de mensagens enviadas, com contagem de leitura. */
export const listSentMessagesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: msgs, error } = await supabaseAdmin
      .from("admin_messages")
      .select("id, title, body, is_broadcast, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const ids = (msgs ?? []).map((m) => m.id);
    const counts: Record<string, { total: number; lidas: number }> = {};
    if (ids.length) {
      const { data: recs } = await supabaseAdmin
        .from("admin_message_recipients")
        .select("message_id, read_at")
        .in("message_id", ids);
      for (const r of recs ?? []) {
        const c = (counts[r.message_id] ||= { total: 0, lidas: 0 });
        c.total += 1;
        if (r.read_at) c.lidas += 1;
      }
    }
    return (msgs ?? []).map((m) => ({
      ...m,
      total: counts[m.id]?.total ?? 0,
      lidas: counts[m.id]?.lidas ?? 0,
    }));
  });

/** Exclui uma mensagem enviada (e seus destinatários). */
export const deleteAdminMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("admin_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
