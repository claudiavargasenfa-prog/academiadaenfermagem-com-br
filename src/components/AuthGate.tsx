import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Loader2 } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  return <>{children}</>;
}

function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: nome },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setMsg({
            type: "info",
            text: "Cadastro criado! Verifique seu e-mail para confirmar e depois faça login.",
          });
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const e = err as Error;
      const friendly =
        e.message?.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : e.message?.includes("already registered")
          ? "Este e-mail já está cadastrado. Tente fazer login."
          : e.message?.includes("at least")
          ? "A senha deve ter pelo menos 6 caracteres."
          : e.message || "Não foi possível concluir.";
      setMsg({ type: "error", text: friendly });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMsg({ type: "error", text: "Não foi possível entrar com Google." });
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-primary px-4 py-10 text-primary-foreground">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logoAsset.url}
            alt="Academia de Enfermagem"
            className="h-20 w-20 rounded-2xl bg-white/10 object-contain p-1 ring-1 ring-gold/40"
          />
          <h1 className="mt-3 font-display text-2xl font-extrabold text-gold">
            Academia de Enfermagem
          </h1>
          <p className="text-sm text-primary-foreground/80">
            Informação Atualizada em suas Mãos
          </p>
        </div>

        <div className="rounded-3xl border border-gold/40 bg-card/95 p-6 text-foreground shadow-[var(--shadow-glass)]">
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-secondary/60 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "signin" ? "bg-primary text-primary-foreground" : "text-foreground/70"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "signup" ? "bg-primary text-primary-foreground" : "text-foreground/70"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                E-mail
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {msg && (
              <div
                className={`rounded-lg px-3 py-2 text-xs ${
                  msg.type === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.8-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.9 35.1 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Continuar com Google
          </button>

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
