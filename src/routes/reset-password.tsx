import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Academia de Enfermagem" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    // Supabase processes the recovery hash and emits PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
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
      setMsg({ type: "error", text: error.message });
      return;
    }
    setMsg({ type: "info", text: "Senha redefinida! Redirecionando..." });
    setTimeout(() => navigate({ to: "/" }), 1200);
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
            alt="Academia de Enfermagem"
            className="h-20 w-20 rounded-2xl bg-white/10 object-contain p-1 ring-1 ring-gold/40"
          />
          <h1 className="mt-3 font-display text-2xl font-extrabold text-gold">
            Redefinir senha
          </h1>
        </div>

        <div className="rounded-3xl border border-gold/40 bg-card/95 p-6 text-foreground shadow-[var(--shadow-glass)]">
          {!ready ? (
            <div className="text-sm text-foreground/80">
              <p>Este link parece inválido ou expirou.</p>
              <p className="mt-2">
                Volte para o{" "}
                <Link to="/" className="font-semibold text-primary hover:underline">
                  login
                </Link>{" "}
                e clique em <strong>Esqueci minha senha</strong> novamente.
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
