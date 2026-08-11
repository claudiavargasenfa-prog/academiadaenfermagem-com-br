import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { traduzirErro } from "@/lib/auth-errors";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Academia da Enfermagem" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { property: "og:title", content: "Redefinir senha — Academia da Enfermagem" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/reset-password" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Redefinir senha — Academia da Enfermagem" },
      { name: "twitter:description", content: "Defina uma nova senha para sua conta." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/reset-password" }],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    let settled = false;
    const finish = (ok: boolean, errorText?: string) => {
      if (settled) return;
      settled = true;
      setStatus(ok ? "ready" : "invalid");
      if (!ok && errorText) {
        setMsg({ type: "error", text: errorText });
      }
    };

    // Check for error in URL hash (Supabase puts errors there)
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    const hashError = hashParams.get("error_description") || hashParams.get("error");
    if (hashError) {
      finish(false, decodeURIComponent(hashError).replace(/\+/g, " "));
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) finish(true);
    });

    // Try PKCE code from query string
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session) finish(true);
        else if (error) finish(false, traduzirErro(error));
      });
    }

    // Existing session (hash already processed by detectSessionInUrl)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(true);
    });

    // Fallback timeout: if nothing resolved in 5s, mark invalid
    const timer = window.setTimeout(() => finish(false), 5000);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 6) {
      setMsg({ type: "error", text: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "As senhas não coincidem." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMsg({ type: "error", text: traduzirErro(error) });
      return;
    }
    setMsg({ type: "info", text: "Senha redefinida! Redirecionando..." });
    setTimeout(() => navigate({ to: "/" }), 1200);
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      setMsg({ type: "error", text: traduzirErro(error) });
    } else {
      setMsg({
        type: "info",
        text: "Novo link enviado! Verifique seu e-mail (e a pasta de spam).",
      });
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
            className="h-24 w-24 rounded-2xl object-contain"
          />
          <h1 className="mt-3 font-display text-2xl font-extrabold text-gold">
            Redefinir senha
          </h1>
        </div>

        <div className="rounded-3xl border border-gold/40 bg-card/95 p-6 text-foreground shadow-[var(--shadow-glass)]">
          {status === "checking" ? (
            <p className="text-sm text-foreground/70">Validando link...</p>
          ) : status === "invalid" ? (
            <div className="space-y-3 text-sm text-foreground/80">
              <p>
                Este link parece <strong>inválido ou expirou</strong> (cada link só pode ser
                usado uma vez).
              </p>
              <p>Digite seu e-mail abaixo para receber um novo link:</p>
              <form onSubmit={handleResend} className="space-y-2">
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className={input}
                  placeholder="voce@email.com"
                />
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
                  {busy ? "Enviando..." : "Enviar novo link"}
                </button>
              </form>
              <p className="pt-2 text-center text-xs">
                Ou volte para o{" "}
                <Link to="/" className="font-semibold text-primary hover:underline">
                  login / cadastro
                </Link>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={label}>Nova senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={input}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className={label}>Confirmar nova senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={input}
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
                {busy ? "Aguarde..." : "Salvar nova senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
