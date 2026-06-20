import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Categoria = "academico" | "tecnico" | "enfermeiro";

async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Acesso negado: somente administradores.");
}

async function logAction(adminId: string, action: string, targetUserId: string | null, details: any) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("admin_actions").insert({
    admin_id: adminId,
    action,
    target_user_id: targetUserId,
    details,
  });
}

export const listUsersAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profiles, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, categoria, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (pErr) throw new Error(pErr.message);

    const ids = (profiles ?? []).map((p) => p.id);
    let subsByUser: Record<string, any[]> = {};
    let rolesByUser: Record<string, string[]> = {};
    if (ids.length) {
      const { data: subs } = await supabaseAdmin
        .from("user_subscriptions")
        .select("user_id, plan_slug, status, started_at, expires_at, notes")
        .in("user_id", ids);
      for (const s of subs ?? []) {
        (subsByUser[s.user_id] ||= []).push(s);
      }
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids);
      for (const r of roles ?? []) {
        (rolesByUser[r.user_id] ||= []).push(r.role);
      }
    }
    return (profiles ?? []).map((p) => ({
      ...p,
      subscriptions: subsByUser[p.id] ?? [],
      roles: rolesByUser[p.id] ?? [],
    }));
  });

export const createUserAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    categoria: Categoria;
    trial_days?: number;
  }) => {
    if (!d.email?.includes("@")) throw new Error("E-mail inválido");
    if (!d.password || d.password.length < 6) throw new Error("Senha precisa de 6+ caracteres");
    if (!d.full_name || d.full_name.trim().length < 3) throw new Error("Nome completo é obrigatório");
    const phoneDigits = (d.phone || "").replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) throw new Error("Celular inválido");
    if (!["academico", "tecnico", "enfermeiro"].includes(d.categoria)) throw new Error("Categoria inválida");
    return { ...d, phone: phoneDigits, trial_days: d.trial_days ?? 30 };
  })
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name.trim(),
        phone: data.phone,
        categoria: data.categoria,
      },
    });
    if (error) throw new Error(error.message);

    await logAction(context.userId, "create_user", created.user?.id ?? null, {
      email: data.email,
      categoria: data.categoria,
    });
    return { id: created.user?.id };
  });

export const updateUserAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    user_id: string;
    email?: string;
    full_name?: string;
    phone?: string;
    categoria?: Categoria | "";
  }) => d)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.email) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
        email: data.email,
      });
      if (error) throw new Error(error.message);
    }
    const patch: Record<string, any> = {};
    if (data.full_name !== undefined) patch.full_name = data.full_name.trim();
    if (data.phone !== undefined) patch.phone = data.phone.replace(/\D/g, "") || null;
    if (data.categoria !== undefined) patch.categoria = data.categoria || null;
    if (data.email !== undefined) patch.email = data.email;
    if (Object.keys(patch).length) {
      const { error } = await supabaseAdmin.from("profiles").update(patch as any).eq("id", data.user_id);
      if (error) throw new Error(error.message);
    }
    await logAction(context.userId, "update_user", data.user_id, patch);
    return { ok: true };
  });

export const deleteUserAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; confirm_email: string }) => d)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    if (data.user_id === context.userId) {
      throw new Error("Você não pode excluir a si mesmo.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", data.user_id)
      .maybeSingle();
    if (!profile) throw new Error("Usuário não encontrado.");
    if ((profile.email || "").trim().toLowerCase() !== (data.confirm_email || "").trim().toLowerCase()) {
      throw new Error("E-mail de confirmação não confere.");
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);

    await logAction(context.userId, "delete_user", data.user_id, { email: profile.email });
    return { ok: true };
  });

export const extendTrialAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; plan_slug: Categoria; extra_days: number }) => d)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("user_subscriptions")
      .select("id, status, expires_at")
      .eq("user_id", data.user_id)
      .eq("plan_slug", data.plan_slug)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseDate = existing && new Date(existing.expires_at) > new Date()
      ? new Date(existing.expires_at)
      : new Date();
    const newExpires = new Date(baseDate.getTime() + data.extra_days * 86400000).toISOString();

    if (existing) {
      const { error } = await supabaseAdmin
        .from("user_subscriptions")
        .update({ expires_at: newExpires, status: existing.status === "trial" ? "trial" : "active" })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("user_subscriptions").insert({
        user_id: data.user_id,
        plan_slug: data.plan_slug,
        status: "trial",
        started_at: new Date().toISOString(),
        expires_at: newExpires,
        notes: `Concedido por admin (+${data.extra_days} dias)`,
      });
      if (error) throw new Error(error.message);
    }
    await logAction(context.userId, "extend_trial", data.user_id, {
      plan_slug: data.plan_slug,
      extra_days: data.extra_days,
      new_expires: newExpires,
    });
    return { ok: true, expires_at: newExpires };
  });

export const resetPasswordAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; new_password: string }) => {
    if (!d.new_password || d.new_password.length < 6) throw new Error("Senha precisa de 6+ caracteres");
    return d;
  })
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      password: data.new_password,
    });
    if (error) throw new Error(error.message);
    await logAction(context.userId, "reset_password", data.user_id, {});
    return { ok: true };
  });
