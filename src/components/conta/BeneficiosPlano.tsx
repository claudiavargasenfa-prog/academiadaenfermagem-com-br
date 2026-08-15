import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TRACKS } from "@/lib/access";
import { abrirCertificado } from "@/lib/certificado";
import { createMpPreference } from "@/lib/mercadopago.functions";
import { TEMAS_POR_CATEGORIA } from "@/data/temas-certificados";



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

// Removida busca dinâmica do catálogo para certificados
async function fetchAccessibleMiniApps() {
  return [];
}


export default function BeneficiosPlano() {
  const qc = useQueryClient();
  const subsQ = useQuery({ queryKey: ["my_subs_full"], queryFn: fetchSubs });
  const certsQ = useQuery({ queryKey: ["my_certs"], queryFn: fetchCerts });
  const miniQ = useQuery({ queryKey: ["mini_apps_catalog"], queryFn: fetchAccessibleMiniApps });

  const [bonus, setBonus] = useState("");
  const [theme, setTheme] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("10");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const subs = subsQ.data ?? [];
  const certs = certsQ.data ?? [];
  const anual = subs.find((s) => s.billing_period === "anual" && s.status === "active");

  const displayThemes = category ? (TEMAS_POR_CATEGORIA[category] || []) : [];

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

  return (
    <section className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-6 items-start">
        <div 
          className="cursor-pointer space-y-2 group"
          onClick={() => window.open("/modelo-frente.png", "_blank")}
        >
          <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 shadow-md transition-transform group-hover:scale-[1.02] w-32 h-20 bg-white">
            <img 
              src="/modelo-frente.png" 

              alt="Modelo Frente" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = '/placeholder.svg';
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-black text-white uppercase tracking-widest text-center px-1">Ver Frente</span>
            </div>
          </div>
          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase">Frente</p>
        </div>

        <div 
          className="cursor-pointer space-y-2 group"
          onClick={() => window.open("/modelo-verso.png", "_blank")}
        >
          <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 shadow-md transition-transform group-hover:scale-[1.02] w-32 h-20 bg-white">
            <img 
              src="/modelo-verso.png" 

              alt="Modelo Verso" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = '/placeholder.svg';
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-black text-white uppercase tracking-widest text-center px-1">Ver Verso</span>
            </div>
          </div>
          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase">Verso</p>
        </div>
      </div>

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

      <div className="glass rounded-2xl p-6 border-2 border-primary/20 bg-white/50 space-y-6">
        <h3 className="font-display text-base font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Emissão de Certificados
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">1. Qual a sua categoria?</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setTheme("");
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="">Selecione...</option>
              <option value="ACADEMICO">ACADÊMICO</option>
              <option value="ENFERMEIRO">ENFERMEIRO</option>
              <option value="TECNICO">TÉCNICO</option>
              <option value="TECNICO_ESTUDANTE">ESTUDANTE DE TÉCNICO EM ENFERMAGEM</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">ESTÁ FALTANDE DESCREVER TODAS AS 22 TABELAS E OS 4 SINAIS VITAIS DOS 4 PÚBLICOS DIFERENTES. INCLUA, PQ NO CERTIFICADO TEM QUE TER EXATAMENTE O CONTEÍUDO PROGRAMÁTICO QUE O ALUNO COMPROU.</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={!category}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
            >
              <option value="">{category && displayThemes.length === 0 ? "Selecione o tema..." : "Selecione o tema..."}</option>
              {displayThemes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">3. Carga horária</label>
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="10">10H - R$ 10,00</option>
              <option value="20">20H - R$ 20,00</option>
              <option value="30">30H - R$ 30,00</option>
              <option value="40">40H - R$ 40,00</option>
            </select>
          </div>

          <button
            type="button"
            disabled={!theme || !category || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const { data: sessionData } = await supabase.auth.getSession();
                const user = sessionData.session?.user;
                if (!user) {
                  setMsg("Você precisa estar logado para emitir um certificado.");
                  return;
                }

                const amount = parseInt(hours);
                
                const { data: created, error } = await supabase
                  .from("orders")
                  .insert({
                    user_id: user.id,
                    plan_slug: "certificado-avulso",
                    amount_cents: amount * 100,
                    payment_method: "mercadopago",
                    status: "pending",
                    metadata: {
                      type: "certificate",
                      theme: theme,
                      hours: amount,
                      email: user.email,
                      category: category
                    },
                  })
                  .select("id")
                  .single();

                if (error || !created?.id) {
                  throw new Error(error?.message || "Erro ao criar pedido");
                }

                // Criar preferência dinâmica no Mercado Pago via Server Function
                const { init_point } = await createMpPreference({
                  data: {
                    orderId: created.id,
                    title: `Certificado ADEC - ${theme} (${amount}h)`,
                    amount: amount,
                    email: user.email!,
                  }
                });

                // Redireciona para o Sandbox se estiver em ambiente de teste ou usa o link padrão
                window.location.href = init_point;
                
              } catch (err: any) {
                setMsg("Erro ao processar: " + err.message);
              } finally {
                setBusy(false);
              }
            }}
            className="w-full rounded-xl bg-primary py-2.5 text-xs font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
          >
            {busy ? "Processando..." : "Emitir Certificado"}
          </button>
        </div>

        {certs.length > 0 && (
          <div className="pt-4 border-t border-primary/10">
            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-3">Meus Certificados Emitidos</h4>
            <ul className="space-y-2">
              {certs.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/10 bg-white/80 p-3 text-xs shadow-sm">
                  <span className="font-medium text-muted-foreground">
                    <strong className="text-foreground">{c.mini_app_name}</strong> · {c.hours}h · código {c.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => abrirCertificado(c)}
                    className="rounded-lg bg-[#2563eb] px-3 py-1.5 font-bold text-white transition-colors hover:bg-[#1d4ed8] shadow-sm flex items-center gap-2"
                  >
                    <Award className="h-3 w-3" /> Imprimir Frente e Verso

                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {msg && <p className="text-xs font-semibold text-primary animate-in fade-in slide-in-from-top-1">{msg}</p>}
    </section>
  );
}
