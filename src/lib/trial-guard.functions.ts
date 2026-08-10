import { createServerFn } from "@tanstack/react-start";
import { TRIAL_FREE_UNTIL } from "@/lib/trial-window";


// Domínios de e-mail descartáveis conhecidos
const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "yopmail.com", "throwawaymail.com", "getnada.com", "trashmail.com",
  "dispostable.com", "maildrop.cc", "sharklasers.com", "grr.la",
  "guerrillamail.info", "guerrillamail.biz", "guerrillamail.de",
  "temp-mail.org", "temp-mail.io", "tmpmail.org", "fakemail.net",
  "mohmal.com", "emailondeck.com", "mytemp.email", "burnermail.io",
  "mintemail.com", "mailnesia.com", "spambox.us", "spam4.me",
  "tempinbox.com", "tempr.email", "wegwerfmail.de", "trbvm.com",
]);

type CheckInput = {
  email: string;
  phone_digits: string;
  device_id?: string | null;
};

export const checkTrialEligibility = createServerFn({ method: "POST" })
  .inputValidator((d: CheckInput) => {
    if (!d.email?.includes("@")) throw new Error("E-mail inválido");
    if (!d.phone_digits || d.phone_digits.length < 10) throw new Error("Celular inválido");
    return {
      email: d.email.trim().toLowerCase(),
      phone_digits: d.phone_digits.replace(/\D/g, ""),
      device_id: d.device_id?.trim() || null,
    };
  })
  .handler(async ({ data }) => {
    const domain = data.email.split("@")[1] ?? "";
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return {
        allowed: false,
        reason:
          "Este provedor de e-mail temporário não é aceito. Use um e-mail pessoal (Gmail, Outlook, etc.).",
      };
    }

    // Durante a campanha (até 10/09/2026) todo mundo recebe os 15 dias grátis
    if (Date.now() <= TRIAL_FREE_UNTIL.getTime()) {
      return { allowed: true };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Bloqueia apenas se o MESMO celular já usou o grátis nos últimos 180 dias
    // (o device_id continua sendo gravado, mas não bloqueia — aparelhos parecidos colidem)
    const sinceDate = new Date(Date.now() - 180 * 86400000).toISOString();

    const query = supabaseAdmin
      .from("trial_fingerprints")
      .select("id, phone_digits")
      .gte("created_at", sinceDate)
      .eq("phone_digits", data.phone_digits)
      .limit(1);


    const { data: existing, error } = await query;
    if (error) {
      // Falha aberta: permite passar, não bloquear cadastro por erro do backend
      console.error("[trial-guard] check error:", error);
      return { allowed: true };
    }

    if (existing && existing.length > 0) {
      return {
        allowed: false,
        reason:
          "Detectamos que você já utilizou seu período grátis. Para continuar, assine um dos planos mensais — cancele quando quiser.",
      };
    }

    return { allowed: true };
  });

type RecordInput = {
  email: string;
  phone_digits: string;
  device_id?: string | null;
  user_id?: string | null;
};

export const recordTrialFingerprint = createServerFn({ method: "POST" })
  .inputValidator((d: RecordInput) => ({
    email: (d.email || "").trim().toLowerCase(),
    phone_digits: (d.phone_digits || "").replace(/\D/g, ""),
    device_id: d.device_id?.trim() || null,
    user_id: d.user_id || null,
  }))
  .handler(async ({ data, context }: any) => {
    if (!data.email || !data.phone_digits) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip =
      (context?.request?.headers?.get?.("cf-connecting-ip") as string | undefined) ||
      (context?.request?.headers?.get?.("x-forwarded-for") as string | undefined)?.split(",")[0]?.trim() ||
      null;
    const { error } = await supabaseAdmin.from("trial_fingerprints").insert({
      email: data.email,
      phone_digits: data.phone_digits,
      device_id: data.device_id,
      user_id: data.user_id,
      ip,
    });
    if (error) console.error("[trial-guard] record error:", error);
    return { ok: !error };
  });
