import { isFreeTrialOpen, TRIAL_FREE_UNTIL_LABEL } from "@/lib/trial-window";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Loader2, Eye, EyeOff } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { getDeviceId } from "@/lib/device-fingerprint";
import { checkTrialEligibility, recordTrialFingerprint } from "@/lib/trial-guard.functions";
import { WelcomePanel } from "@/components/cadastro/WelcomePanel";
import { traduzirErro } from "@/lib/auth-errors";
import { formatPhoneBR, validatePhoneBR } from "@/lib/phone-br";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!active) return;
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!active) return;
      if (error) {
        await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
        setSession(null);
      } else {
        const { data: sessionData } = await supabase.auth.getSession();
        if (active) setSession(data.user ? sessionData.session : null);
      }
      if (active) setLoading(false);
    }).catch(async () => {
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
      if (active) {
        setSession(null);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <WelcomeAuthScreen />;
  return <>{children}</>;
}

const CADASTRO_SLUGS = ["academico", "tecnico", "tecnico-estudante", "enfermeiro"];
const LOGIN_DESTINATION_KEY = "adec-login-destination";

function safeDestination(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/minha-conta";
  return path;
}

function currentLoginDestination(): string {
  if (typeof window === "undefined") return "/minha-conta";
  const current = `${window.location.pathname}${window.location.search}`;
  return current === "/" ? "/minha-conta" : safeDestination(current);
}

function rememberLoginDestination(destination: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(LOGIN_DESTINATION_KEY, safeDestination(destination));
  }
}

function finishLogin(fallback: string) {
  if (typeof window === "undefined") return;
  const destination = safeDestination(window.sessionStorage.getItem(LOGIN_DESTINATION_KEY) ?? fallback);
  window.sessionStorage.removeItem(LOGIN_DESTINATION_KEY);
  window.location.assign(destination);
}

function slugFromPath(): string {
  if (typeof window === "undefined") return "academico";
  const parts = window.location.pathname.split("/").filter(Boolean);
  const found = parts.find((p) => CADASTRO_SLUGS.includes(p));
  const q = new URLSearchParams(window.location.search).get("cadastro");
  return found ?? (q && CADASTRO_SLUGS.includes(q) ? q : "academico");
}

export function WelcomeAuthScreen({ slug }: { slug?: string } = {}) {
  const resolved = slug ?? slugFromPath();
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2 md:items-start">
      <WelcomePanel slug={resolved} />
      <div>
        <AuthScreen cadastroSlug={resolved} />
      </div>
    </div>
  );
}

export function AuthScreen({ cadastroSlug: forcedCadastroSlug }: { cadastroSlug?: string } = {}) {
  const currentPath = forcedCadastroSlug ? "/" : typeof window !== "undefined" ? window.location.pathname : "/";
  const searchParams = forcedCadastroSlug
    ? new URLSearchParams()
    : typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const cadastroSlug = forcedCadastroSlug ?? searchParams.get("cadastro");
  const validCategorias = ["academico", "tecnico-estudante", "tecnico", "enfermeiro"] as const;
  const initialCategoria = (validCategorias as readonly string[]).includes(cadastroSlug ?? "")
    ? (cadastroSlug as typeof validCategorias[number])
    : "";
  const requestedPage =
    currentPath === "/escalas-clinicas" || currentPath === "/novo-app"
      ? "Escalas Clínicas na Prática"
      : currentPath !== "/"
        ? "a página solicitada"
        : null;
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(cadastroSlug ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [phone, setPhone] = useState("");
  const [categoria, setCategoria] = useState<"academico" | "tecnico-estudante" | "tecnico" | "enfermeiro" | "">(initialCategoria);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const checkTrial = useServerFn(checkTrialEligibility);
  const recordTrial = useServerFn(recordTrialFingerprint);
  const phoneErroInline = phone.replace(/\D/g, "").length >= 11 ? validatePhoneBR(phone) : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") ?? params.get("error");
    if (oauthError) {
      setMsg({ type: "error", text: traduzirErro(oauthError, "O Google não autorizou a entrada. Escolha uma conta e tente novamente.") });
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    const destination = window.sessionStorage.getItem(LOGIN_DESTINATION_KEY);
    if (!destination) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) finishLogin(destination);
    }).catch(() => undefined);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "forgot") {
        if (!email) throw new Error("Informe seu e-mail.");
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({
          type: "info",
          text: "Enviamos um link de redefinição para o seu e-mail. Verifique sua caixa de entrada (e o spam).",
        });
      } else if (mode === "signup") {
        if (!nome.trim() || nome.trim().length < 3) {
          throw new Error("Informe seu nome completo.");
        }
        const phoneDigits = phone.replace(/\D/g, "");
        const phoneErro = validatePhoneBR(phone);
        if (phoneErro) throw new Error(phoneErro);
        if (!categoria) {
          throw new Error("Selecione sua categoria (Acadêmico, Estudante de Técnico, Técnico ou Enfermeiro).");
        }

        // Mantemos a proteção contra abuso, mas o acesso da campanha é concedido pelo banco
        // até 30/09/2026, independentemente de serem 15 dias ou menos a partir do cadastro.
        const deviceId = await getDeviceId();
        const check = await checkTrial({
          data: { email, phone_digits: phoneDigits, device_id: deviceId },
        });
        if (!check.allowed) {
          throw new Error(check.reason || "Não foi possível liberar o período grátis.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/trilha/${categoria}`,
            data: {
              full_name: nome.trim(),
              phone: phoneDigits,
              categoria,
            },
          },
        });
        if (error) throw error;

        try {
          await recordTrial({
            data: {
              email,
              phone_digits: phoneDigits,
              device_id: deviceId,
              user_id: data.user?.id ?? null,
            },
          });
        } catch (e) {
          console.error("[trial] record failed", e);
        }

        if (!data.session) {
          setMsg({
            type: "info",
            text: "Cadastro criado! Verifique seu e-mail para confirmar — seu acesso gratuito ficará disponível até 30/09/2026.",
          });
          setMode("signin");
        } else {
          finishLogin(`/trilha/${categoria}`);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (!data.session) throw new Error("Não foi possível confirmar sua entrada. Tente novamente.");

        const { data: verified, error: verificationError } = await supabase.auth.getUser();
        if (verificationError || !verified.user) {
          await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
          throw verificationError ?? new Error("Sua entrada não pôde ser confirmada. Tente novamente.");
        }
        finishLogin(currentLoginDestination());
      }
    } catch (err) {
      setMsg({ type: "error", text: traduzirErro(err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const destination = currentLoginDestination();
      rememberLoginDestination(destination);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: { prompt: "select_account" },
      });
      if (result.error) {
        window.sessionStorage.removeItem(LOGIN_DESTINATION_KEY);
        throw result.error;
      }
      if (result.redirected) return;

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw error ?? new Error("O Google não confirmou sua entrada.");
      finishLogin(destination);
    } catch (err) {
      console.error("[auth] Google sign-in failed", err);
      window.sessionStorage.removeItem(LOGIN_DESTINATION_KEY);
      setMsg({ type: "error", text: traduzirErro(err, "O Google não autorizou a entrada. Escolha uma conta e tente novamente.") });
      setBusy(false);
    }
  }

  const input =
    "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";
  const label = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <div className="min-h-dvh bg-primary px-4 py-10 text-primary-foreground">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logoAsset.url}
            alt="Academia da Enfermagem"
            className="h-24 w-24 rounded-2xl object-contain sm:h-28 sm:w-28"
          />
          <h1 className="mt-3 font-display text-2xl font-extrabold text-gold">
            Academia da Enfermagem
          </h1>
          <p className="text-sm text-primary-foreground/80">Informação Atualizada em suas Mãos</p>
        </div>

        <div className="rounded-3xl border border-gold/40 bg-card/95 p-6 text-foreground shadow-[var(--shadow-glass)]">
          {requestedPage && (
            <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary">
              Entre na sua conta para abrir {requestedPage}.
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-secondary/60 p-1">
            <button
              type="button"
              onClick={() => { setMode("signin"); setMsg(null); }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "signin" || mode === "forgot" ? "bg-primary text-primary-foreground" : "text-foreground/70"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setMsg(null); }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "signup" ? "bg-primary text-primary-foreground" : "text-foreground/70"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {mode === "signup" && (
            isFreeTrialOpen() ? (
              <div className="mb-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-800">
                🎁 Cadastro novo ganha <strong>acesso grátis até 30/09/2026</strong> — sem cartão.
              </div>
            ) : (
              <div className="mb-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-900">
                ⚠️ <strong>Período gratuito encerrado</strong> (válido até {TRIAL_FREE_UNTIL_LABEL}). Você pode criar sua conta, mas o acesso ao conteúdo só é liberado após a assinatura do plano da sua categoria.
              </div>
            )
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <div>
                  <label className={label}>Nome completo *</label>
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className={input} placeholder="Maria da Silva" maxLength={120} />
                </div>
                <div>
                  <label className={label}>Celular (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                    className={input}
                    placeholder="(11) 99999-0000"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={!!phoneErroInline}
                  />
                  {phoneErroInline ? (
                    <p className="mt-1 text-xs font-semibold text-destructive">{phoneErroInline}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">Celular ativo com DDD é obrigatório para concluir o cadastro.</p>
                  )}
                </div>
                <div>
                  <label className={label}>Categoria *</label>
                  <div className="mt-1 grid grid-cols-2 gap-1.5">
                    {([
                      { v: "academico", label: "Acadêmico (Graduação)", emoji: "🎓" },
                      { v: "tecnico-estudante", label: "Estudante de Técnico", emoji: "📘" },
                      { v: "tecnico", label: "Técnico/Auxiliar", emoji: "🩺" },
                      { v: "enfermeiro", label: "Enfermeiro", emoji: "👩‍⚕️" },
                    ] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt.v}
                        onClick={() => setCategoria(opt.v)}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                          categoria === opt.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/70 hover:bg-secondary/60"
                        }`}
                      >
                        <div>{opt.emoji}</div>
                        <div>{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={label}>E-mail *</label>
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="voce@email.com" maxLength={255} />
              {mode === "signup" && <p className="mt-1 text-[10px] text-muted-foreground">Usado para emitir seu certificado.</p>}
            </div>

            {mode !== "forgot" && (
              <div>
                <label className={label}>Senha *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} pr-10`} placeholder="Mínimo 6 caracteres" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" title={showPassword ? "Ocultar senha" : "Ver senha"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signin" && (
                  <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }} className="mt-1 text-xs font-semibold text-primary hover:underline">
                    Esqueci minha senha
                  </button>
                )}
              </div>
            )}

            {msg && (
              <div className={`rounded-lg px-3 py-2 text-xs ${msg.type === "error" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {busy ? "Aguarde..." : mode === "signup" ? (isFreeTrialOpen() ? "Criar conta — acesso grátis até 30/09" : "Criar minha conta") : mode === "forgot" ? "Enviar link de redefinição" : "Entrar"}
            </button>

            {mode === "forgot" && (
              <button type="button" onClick={() => { setMode("signin"); setMsg(null); }} className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground">
                ← Voltar para o login
              </button>
            )}
          </form>

          {mode !== "signup" && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button type="button" onClick={handleGoogle} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-60">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.2-.1-2.3-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.8-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.9 35.1 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
                Continuar com Google
              </button>
            </>
          )}

          {mode === "signup" && (
            <p className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-center text-[10px] font-medium text-muted-foreground">
              Para criar uma nova conta é obrigatório informar <strong>celular com DDD</strong>, nome, categoria, e-mail e senha. O acesso da campanha será gratuito até <strong>30/09/2026</strong>.
            </p>
          )}

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Ao continuar, você concorda que este app é um apoio educacional e não substitui o julgamento clínico do profissional de saúde.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function signOut() {
  await supabase.auth.signOut();
}
