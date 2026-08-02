import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/device-fingerprint";

/** Versão vigente dos documentos legais. Ao alterar os textos, suba a versão. */
export const LEGAL_DOC_VERSION = "1.1";
export const LEGAL_DOC_DATE = "2026-08-02";
export const LEGAL_TERMS_VERSION = "1.1";
export const LEGAL_PRIVACY_VERSION = "1.1";

export const LEGAL_ACCEPT_STORAGE_KEY = `ae_legal_accept_${LEGAL_DOC_VERSION}`;

export const LEGAL_DISCLAIMER_SHORT =
  "Ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do profissional, o exame do paciente nem as fontes oficiais (COFEN, COREN, Ministério da Saúde, ANVISA) e protocolos institucionais.";

export function hasAcceptedLegalLocally(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return !!localStorage.getItem(LEGAL_ACCEPT_STORAGE_KEY);
  } catch {
    return true;
  }
}

/**
 * Registra eletronicamente o aceite: data/hora (timestamp do servidor), versão dos
 * Termos e da Política de Privacidade, identificador do usuário e/ou do dispositivo.
 */
export async function recordLegalAcceptance(scope = "primeiro_acesso") {
  const deviceId = await getDeviceId().catch(() => "");
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id ?? null;

  const { error } = await supabase.from("legal_acceptances").insert({
    user_id: userId,
    device_id: deviceId || null,
    doc_version: LEGAL_DOC_VERSION,
    doc_date: LEGAL_DOC_DATE,
    terms_version: LEGAL_TERMS_VERSION,
    privacy_version: LEGAL_PRIVACY_VERSION,
    scope,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 400) : null,
  });

  try {
    localStorage.setItem(
      LEGAL_ACCEPT_STORAGE_KEY,
      JSON.stringify({ at: new Date().toISOString(), version: LEGAL_DOC_VERSION }),
    );
  } catch {
    /* ignore */
  }

  return { ok: !error, error };
}
