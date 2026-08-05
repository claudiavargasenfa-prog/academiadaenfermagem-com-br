import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TRACKS } from "@/lib/access";

type Sub = {
  id: string;
  plan_slug: string;
  status: string;
  expires_at: string;
  billing_period: string;
  bonus_app_slug: string | null;
  certificates_allowed: number;
};

type Cert = {
  id: string;
  code: string;
  mini_app_name: string;
  student_name: string;
  hours: number;
  issued_at: string;
};

async function fetchSubs(): Promise<Sub[]> {
  const { data } = await supabase
    .from("user_subscriptions")
    .select("id, plan_slug, status, expires_at, billing_period, bonus_app_slug, certificates_allowed")
    .in("status", ["active", "trial"])
    .gt("expires_at", new Date().toISOString());
  return (data ?? []) as unknown as Sub[];
}

async function fetchCerts(): Promise<Cert[]> {
  const { data } = await supabase
    .from("user_certificates")
    .select("id, code, mini_app_name, student_name, hours, issued_at")
    .order("issued_at", { ascending: false });
  return (data ?? []) as unknown as Cert[];
}

async function fetchAccessibleMiniApps() {
  const { data } = await supabase.rpc("list_mini_apps_catalog");
  return (data ?? []) as { id: string; name: string }[];
}

function abrirCertificado(c: Cert) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Certificado ${c.code}</title>
<style>
body{font-family:Georgia,serif;margin:0;padding:48px;background:#f7fbf8;color:#0f2e22}
.card{max-width:960px;margin:auto;border:10px double #b8912f;background:#fff;padding:56px;text-align:center}
h1{font-size:34px;letter-spacing:.14em;margin:0 0 8px;color:#0f4c35}
h2{font-size:15px;letter-spacing:.3em;text-transform:uppercase;color:#b8912f;margin:0 0 32px}
.nome{font-size:30px;font-weight:bold;margin:24px 0}
.txt{font-size:16px;line-height:1.7}
.rodape{margin-top:44px;font-size:12px;color:#4b5f57}
@media print{body{background:#fff;padding:0}}
</style></head><body><div class="card">
<h1>CERTIFICADO</h1><h2>Academia da Enfermagem · ADEC</h2>
<p class="txt">Certificamos que</p>
<p class="nome">${c.student_name}</p>
<p class="txt">concluiu o módulo de estudo <strong>${c.mini_app_name}</strong>,<br>com carga horária de <strong>${c.hours} horas</strong>, na plataforma Academia da Enfermagem.</p>
<p class="rodape">Emitido em ${new Date(c.issued_at).toLocaleDateString("pt-BR")} · Código de validação: <strong>${c.code}</strong><br>academiadaenfermagem.com.br</p>
</div><script>window.print()</script></body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

export default function BeneficiosPlano() {
  const qc = useQueryClient();
  const subsQ = useQuery({ queryKey: ["my_subs_full"], queryFn: fetchSubs });
  const certsQ = useQuery({ queryKey: ["my_certs"], queryFn: fetchCerts });
  const miniQ = useQuery({ queryKey: ["mini_apps_catalog"], queryFn: fetchAccessibleMiniApps });

  const [bonus, setBonus] = useState("");
  const [miniAppId, setMiniAppId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const subs = subsQ.data ?? [];
  const certs = certsQ.data ?? [];
  const anual = subs.find((s) => s.billing_period === "anual" && s.status === "active");
  const allowed = subs.reduce((m, s) => Math.max(m, s.certificates_allowed ?? 0), 0);
  const restantes = Math.max(0, allowed - certs.length);

  if (subs.length === 0) return null;
  if (!anual && allowed === 0) return null;

  async function escolherBonus() {
    if (!bonus) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.rpc("set_bonus_app", { _bonus_slug: bonus });
    setBusy(false);
    if (error) {
      setMsg("Não foi possível registrar a escolha: " + error.message);
      return;
    }
    setMsg("Aplicativo bônus liberado! O acesso já está ativo.");
    qc.invalidateQueries({ queryKey: ["my_subs_full"] });
  }

  async function emitir() {
    if (!miniAppId) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.rpc("issue_certificate", { _mini_app_id: miniAppId });
    setBusy(false);
    if (error) {
      setMsg(
        error.message.includes("quota")
          ? "Seus certificados deste plano já foram emitidos."
          : "Não foi possível emitir: " + error.message,
      );
      return;
    }
    setMsg("Certificado emitido! Abra abaixo para imprimir ou salvar em PDF.");
    qc.invalidateQueries({ queryKey: ["my_certs"] });
  }

  return (
    <section className="mt-6 space-y-4">
      <h2 className="font-display text-lg font-bold">Benefícios do seu plano</h2>

      {anual && (
        <div className="glass rounded-2xl p-4">
          <p className="flex items-center gap-2 font-display text-base font-bold">
            <Gift className="h-4 w-4 text-primary" /> 2º aplicativo (plano anual)
          </p>
          {anual.bonus_app_slug ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Aplicativo bônus escolhido:{" "}
              <strong>{TRACKS.find((t) => t.slug === anual.bonus_app_slug)?.label ?? anual.bonus_app_slug}</strong>
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Escolha o segundo aplicativo que deseja liberar. A escolha é única e vale por 12 meses.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="">Selecione um aplicativo…</option>
                  {TRACKS.filter((t) => t.slug !== anual.plan_slug).map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!bonus || busy}
                  onClick={escolherBonus}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
                >
                  Liberar aplicativo
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {allowed > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#b8912f]/30 bg-gradient-to-br from-[#fbf8f1] to-[#f7f2e8] p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Award className="h-24 w-24 text-[#b8912f]" />
          </div>
          <p className="flex items-center gap-2 font-display text-lg font-black text-[#8a6d24]">
            <Award className="h-5 w-5 text-[#b8912f]" /> CERTIFICADOS DE 10 HORAS
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Você tem <strong>{restantes}</strong> de {allowed} certificados disponíveis. Escolha o mini app estudado.
          </p>
          {restantes > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={miniAppId}
                onChange={(e) => setMiniAppId(e.target.value)}
                className="max-w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">Selecione o mini app…</option>
                {(miniQ.data ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!miniAppId || busy}
                onClick={emitir}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
              >
                Emitir certificado
              </button>
            </div>
          )}

          {certs.length > 0 && (
            <ul className="mt-4 space-y-2">
              {certs.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#b8912f]/20 bg-white/80 p-3 text-xs shadow-sm">
                  <span>
                    <strong>{c.mini_app_name}</strong> · {c.hours}h · código {c.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => abrirCertificado(c)}
                    className="rounded-lg bg-[#b8912f] px-3 py-1 font-bold text-white transition-colors hover:bg-[#8a6d24]"
                  >
                    Abrir / salvar PDF
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {msg && <p className="text-xs font-semibold text-primary">{msg}</p>}
    </section>
  );
}
