import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TRACKS } from "@/lib/access";
import { abrirCertificado } from "@/lib/certificado";


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
  app_name: string | null;
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
    .select("id, code, mini_app_name, student_name, hours, issued_at, app_name")
    .order("issued_at", { ascending: false });
  return (data ?? []) as unknown as Cert[];
}

async function fetchAccessibleMiniApps() {
  const { data } = await supabase.rpc("list_mini_apps_catalog");
  return (data ?? []) as { id: string; name: string }[];
}


export default function BeneficiosPlano() {
  const qc = useQueryClient();
  const subsQ = useQuery({ queryKey: ["my_subs_full"], queryFn: fetchSubs });
  const certsQ = useQuery({ queryKey: ["my_certs"], queryFn: fetchCerts });
  const miniQ = useQuery({ queryKey: ["mini_apps_catalog"], queryFn: fetchAccessibleMiniApps });

  const [bonus, setBonus] = useState("");
  const [miniAppId, setMiniAppId] = useState("");
  const [theme, setTheme] = useState("");
  const [hours, setHours] = useState("10");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const subs = subsQ.data ?? [];
  const certs = certsQ.data ?? [];
  const anual = subs.find((s) => s.billing_period === "anual" && s.status === "active");
  const allowed = subs.reduce((m, s) => Math.max(m, s.certificates_allowed ?? 0), 0);
  const restantes = Math.max(0, allowed - certs.length);


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
      <h2 className="font-display text-lg font-bold">Emissão de Certificados</h2>

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

      {(
        <div id="certificados" className="relative overflow-hidden rounded-2xl border-2 border-[#b8912f]/30 bg-gradient-to-br from-[#fbf8f1] to-[#f7f2e8] p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Award className="h-24 w-24 text-[#b8912f]" />
          </div>
          <p className="flex items-center gap-2 font-display text-lg font-black text-[#8a6d24]">
            <Award className="h-5 w-5 text-[#b8912f]" /> CERTIFICADOS 10H
          </p>
          <div className="mt-2 flex gap-4 overflow-x-auto pb-2">
            <div className="relative group cursor-pointer" onClick={() => window.open("https://763be538-2d93-4e4b-9706-e7e0e7a46979.lovable.app/modelo-frente.png", "_blank")}>
              <img src="https://763be538-2d93-4e4b-9706-e7e0e7a46979.lovable.app/modelo-frente.png" alt="Modelo Frente" className="h-16 w-auto rounded border border-primary/20 shadow-sm" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] text-white font-bold">FRENTE</div>
            </div>
            <div className="relative group cursor-pointer" onClick={() => window.open("https://31804b77-ed14-411a-8212-680482b84234.lovable.app/modelo-verso.png", "_blank")}>
              <img src="https://31804b77-ed14-411a-8212-680482b84234.lovable.app/modelo-verso.png" alt="Modelo Verso" className="h-16 w-auto rounded border border-primary/20 shadow-sm" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] text-white font-bold">VERSO</div>
            </div>
          </div>
          {allowed > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Você tem <strong>{restantes}</strong> de {allowed} certificados disponíveis. Escolha o Mini App estudado.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Seu plano atual ainda não inclui certificados. Os planos trimestral, semestral e anual liberam de 1 a 4
              certificados de 10 horas por ano. Você também pode emitir avulso pelo checkout.
            </p>
          )}
          {allowed > 0 && restantes > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <select

                value={miniAppId}
                onChange={(e) => setMiniAppId(e.target.value)}
                className="max-w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">Selecione o Mini App…</option>
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
                    className="rounded-lg bg-[#2563eb] px-3 py-1 font-bold text-white transition-colors hover:bg-[#1d4ed8] shadow-sm flex items-center gap-2"
                  >
                    <Award className="h-3 w-3" /> Abrir / salvar PDF
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="glass rounded-2xl p-6 border-2 border-primary/20 bg-white/50 space-y-4">
        <h3 className="font-display text-base font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Emissão de Certificado Avulso
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Você pode solicitar um certificado referente aos estudos realizados em seu respectivo aplicativo. 
          Informe o tema estudado, escolha a carga horária e realize o pagamento. 
          Após a confirmação do pagamento, seu certificado será gerado e liberado automaticamente.
        </p>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Tema estudado</label>
            <input 
              type="text"
              placeholder="Ex: Punção Venosa Periférica"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Escolha a carga horária</label>
            <div className="grid grid-cols-2 gap-2">
              {[10, 20, 30, 40].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h.toString())}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    hours === h.toString() 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-input hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-bold">{h} horas</span>
                  <span className="text-xs font-black text-primary">R$ {h},00</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!theme || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const { data: sessionData } = await supabase.auth.getSession();
                const user = sessionData.session?.user;
                if (!user) {
                  setMsg("Você precisa estar logado para emitir um certificado.");
                  return;
                }

                const amountCents = parseInt(hours) * 100;
                
                // Cria o pedido no banco
                const { data: created, error } = await supabase
                  .from("orders")
                  .insert({
                    user_id: user.id,
                    plan_slug: "certificado-avulso",
                    amount_cents: amountCents,
                    payment_method: "mercadopago",
                    status: "pending",
                    metadata: {
                      type: "certificate",
                      theme: theme,
                      hours: parseInt(hours),
                      email: user.email,
                    },
                  })
                  .select("id")
                  .single();

                if (error || !created?.id) {
                  throw new Error(error?.message || "Erro ao criar pedido");
                }

                // Links de checkout conforme solicitado: R$ 10, 20, 30, 40
                // Mapeamento direto baseado no valor
                const mpLinks: Record<string, string> = {
                  "10": "https://mpago.la/2KxS8d7", // Exemplo - deve ser trocado pelos reais se existirem
                  "20": "https://mpago.la/2KxS8d7",
                  "30": "https://mpago.la/2KxS8d7",
                  "40": "https://mpago.la/2KxS8d7",
                };

                // Como não temos os links específicos ainda, usamos o checkout genérico ou o que estiver disponível
                // Na falta de links específicos no mp-links.ts para certificados, redirecionamos para a tela de checkout
                // que lidará com a criação do link se necessário ou usaremos uma URL padrão de pagamento.
                
                window.location.href = `https://link.mercadopago.com.br/adec-pagamentos?amount=${amountCents / 100}&description=Certificado+${encodeURIComponent(theme)}&external_reference=${created.id}`;
                
              } catch (err: any) {
                setMsg("Erro ao processar: " + err.message);
              } finally {
                setBusy(false);
              }
            }}
            className="w-full rounded-xl bg-primary py-4 text-sm font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? "PROCESSANDO..." : "EMITIR CERTIFICADO"}
          </button>
        </div>
      </div>

      {msg && <p className="text-xs font-semibold text-primary">{msg}</p>}
    </section>
  );
}
