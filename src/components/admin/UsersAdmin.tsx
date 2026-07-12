import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { UserPlus, Pencil, Trash2, KeyRound, Calendar, Search } from "lucide-react";
import { Card } from "@/components/AppShell";
import {
  listUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  extendTrialAdmin,
  resetPasswordAdmin,
} from "@/lib/users-admin.functions";

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

type Categoria = "academico" | "tecnico" | "enfermeiro";

type UserRow = Awaited<ReturnType<typeof listUsersAdmin>>[number];

function badgeForCategoria(c: string | null | undefined) {
  if (c === "academico") return { label: "🎓 Acadêmico", bg: "var(--track-academico-bg)", fg: "var(--track-academico-fg)" };
  if (c === "tecnico") return { label: "🩺 Técnico", bg: "var(--track-tecnico-bg)", fg: "var(--track-tecnico-fg)" };
  if (c === "enfermeiro") return { label: "👩‍⚕️ Enfermeiro", bg: "var(--track-enfermeiro-bg)", fg: "var(--track-enfermeiro-fg)" };
  return { label: "—", bg: "#eee", fg: "#444" };
}

export function UsersAdmin() {
  const qc = useQueryClient();
  const usersQ = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => listUsersAdmin(),
  });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState<UserRow | null>(null);
  const [resetting, setResetting] = useState<UserRow | null>(null);
  const [extending, setExtending] = useState<UserRow | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | Categoria | "trial" | "ativo" | "expirado">("todos");

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin_users"] });

  const rows = useMemo(() => {
    const list = usersQ.data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((u) => {
      if (q) {
        const hay = `${u.full_name ?? ""} ${u.email ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter === "academico" || filter === "tecnico" || filter === "enfermeiro") {
        if (u.categoria !== filter) return false;
      }
      if (filter === "trial") {
        if (!u.subscriptions.some((s: any) => s.status === "trial" && new Date(s.expires_at) > new Date())) return false;
      }
      if (filter === "ativo") {
        if (!u.subscriptions.some((s: any) => s.status === "active" && new Date(s.expires_at) > new Date())) return false;
      }
      if (filter === "expirado") {
        if (u.subscriptions.length === 0) return true;
        if (u.subscriptions.every((s: any) => new Date(s.expires_at) <= new Date())) return true;
        return false;
      }
      return true;
    });
  }, [usersQ.data, search, filter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 min-w-[220px]">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className={`${input} pl-8`}
              placeholder="Buscar por nome ou e-mail…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={`${input} max-w-[180px]`}
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="todos">Todos</option>
            <option value="academico">🎓 Acadêmico</option>
            <option value="tecnico">🩺 Técnico</option>
            <option value="enfermeiro">👩‍⚕️ Enfermeiro</option>
            <option value="trial">Em trial</option>
            <option value="ativo">Assinatura ativa</option>
            <option value="expirado">Sem acesso</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl gold-gradient px-3 py-2 text-xs font-bold"
        >
          <UserPlus className="h-3.5 w-3.5" /> Novo usuário
        </button>
      </div>

      {creating && (
        <CreateUserForm onClose={() => { setCreating(false); refresh(); }} />
      )}
      {editing && (
        <EditUserForm user={editing} onClose={() => { setEditing(null); refresh(); }} />
      )}
      {deleting && (
        <DeleteUserDialog user={deleting} onClose={() => { setDeleting(null); refresh(); }} />
      )}
      {resetting && (
        <ResetPasswordForm user={resetting} onClose={() => { setResetting(null); refresh(); }} />
      )}
      {extending && (
        <ExtendTrialForm user={extending} onClose={() => { setExtending(null); refresh(); }} />
      )}

      {usersQ.isLoading && <Card><p className="text-sm text-muted-foreground">Carregando…</p></Card>}
      {usersQ.error && (
        <Card><p className="text-sm text-destructive">Erro: {(usersQ.error as Error).message}</p></Card>
      )}

      <div className="space-y-2">
        {rows.map((u) => {
          const cat = badgeForCategoria(u.categoria);
          const activeSub = u.subscriptions.find((s: any) =>
            (s.status === "active" || s.status === "trial") && new Date(s.expires_at) > new Date()
          );
          return (
            <Card key={u.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm font-extrabold">{u.full_name || "(sem nome)"}</h4>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: cat.bg, color: cat.fg }}
                    >
                      {cat.label}
                    </span>
                    {u.roles?.includes("admin") && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">ADMIN</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{u.email} · {u.phone || "(sem celular)"}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Cadastrado em {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  {activeSub ? (
                    <p className="mt-1 text-[11px] font-semibold">
                      {activeSub.status === "trial" ? "🎁 Trial" : "✅ Ativo"} {activeSub.plan_slug} · até {new Date(activeSub.expires_at).toLocaleDateString("pt-BR")}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] font-semibold text-destructive">Sem assinatura ativa</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-1">
                  <button type="button" onClick={() => setExtending(u)} className="rounded-lg bg-emerald-500/15 p-2 text-emerald-700 hover:bg-emerald-500/25" aria-label="Estender trial/assinatura" title="Estender acesso">
                    <Calendar className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setResetting(u)} className="rounded-lg bg-amber-500/15 p-2 text-amber-700 hover:bg-amber-500/25" aria-label="Resetar senha" title="Resetar senha">
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setEditing(u)} className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20" aria-label="Editar" title="Editar">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setDeleting(u)} className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20" aria-label="Excluir" title="Excluir usuário">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
        {!usersQ.isLoading && rows.length === 0 && (
          <Card><p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p></Card>
        )}
      </div>
    </div>
  );
}

function FormShell({ title, children, onClose, submitting, error, onSubmit, submitLabel = "Salvar" }: {
  title: string; children: React.ReactNode; onClose: () => void; submitting: boolean; error: string | null;
  onSubmit: (e: React.FormEvent) => void; submitLabel?: string;
}) {
  return (
    <Card className="border-primary/40">
      <form onSubmit={onSubmit} className="space-y-3 text-sm">
        <h4 className="font-display text-base font-bold">{title}</h4>
        {children}
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-foreground/10 px-4 py-2 text-sm font-semibold">Cancelar</button>
          <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {submitting ? "Aguarde…" : submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const create = useServerFn(createUserAdmin);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone: "", categoria: "academico" as Categoria, trial_days: 30 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await create({ data: form });
      onClose();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <FormShell title="Criar novo usuário" onClose={onClose} submitting={busy} error={err} onSubmit={save} submitLabel="Criar com 30 dias trial">
      <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Nome completo *</span>
        <input className={input} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">E-mail *</span>
          <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Celular *</span>
          <input className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-0000" required /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Categoria *</span>
          <select className={input} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}>
            <option value="academico">🎓 Acadêmico</option>
            <option value="tecnico">🩺 Técnico</option>
            <option value="enfermeiro">👩‍⚕️ Enfermeiro</option>
          </select></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Senha temporária *</span>
          <input className={input} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6+ caracteres" required /></label>
      </div>
    </FormShell>
  );
}

function EditUserForm({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const update = useServerFn(updateUserAdmin);
  const [form, setForm] = useState({
    email: user.email ?? "",
    full_name: user.full_name ?? "",
    phone: user.phone ?? "",
    categoria: (user.categoria ?? "") as Categoria | "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await update({ data: { user_id: user.id, ...form } });
      onClose();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <FormShell title={`Editar: ${user.full_name || user.email}`} onClose={onClose} submitting={busy} error={err} onSubmit={save}>
      <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Nome completo</span>
        <input className={input} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">E-mail</span>
          <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Celular</span>
          <input className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      </div>
      <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Categoria</span>
        <select className={input} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as any })}>
          <option value="">— sem categoria —</option>
          <option value="academico">🎓 Acadêmico</option>
          <option value="tecnico">🩺 Técnico</option>
          <option value="enfermeiro">👩‍⚕️ Enfermeiro</option>
        </select></label>
    </FormShell>
  );
}

function DeleteUserDialog({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const del = useServerFn(deleteUserAdmin);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await del({ data: { user_id: user.id, confirm_email: confirm } });
      onClose();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <FormShell title="Excluir usuário" onClose={onClose} submitting={busy} error={err} onSubmit={save} submitLabel="EXCLUIR">
      <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
        ⚠️ Esta ação <strong>apaga permanentemente</strong> o usuário, perfil, assinaturas e histórico.
      </p>
      <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
        Digite o e-mail <strong>{user.email}</strong> para confirmar
      </span>
        <input className={input} value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></label>
    </FormShell>
  );
}

function ResetPasswordForm({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const reset = useServerFn(resetPasswordAdmin);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await reset({ data: { user_id: user.id, new_password: pw } });
      onClose();
      alert(`Nova senha definida para ${user.email}. Comunique manualmente ao aluno.`);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <FormShell title={`Resetar senha: ${user.email}`} onClose={onClose} submitting={busy} error={err} onSubmit={save} submitLabel="Definir nova senha">
      <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Nova senha (6+ caracteres)</span>
        <input className={input} value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} /></label>
    </FormShell>
  );
}

function ExtendTrialForm({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const ext = useServerFn(extendTrialAdmin);
  const [form, setForm] = useState({
    plan_slug: (user.categoria || "academico") as Categoria,
    extra_days: 30,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await ext({ data: { user_id: user.id, ...form } });
      onClose();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <FormShell title={`Estender acesso: ${user.full_name || user.email}`} onClose={onClose} submitting={busy} error={err} onSubmit={save} submitLabel="Adicionar dias">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Aplicativo</span>
          <select className={input} value={form.plan_slug} onChange={(e) => setForm({ ...form, plan_slug: e.target.value as Categoria })}>
            <option value="academico">🎓 Acadêmico</option>
            <option value="tecnico">🩺 Técnico</option>
            <option value="enfermeiro">👩‍⚕️ Enfermeiro</option>
          </select></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Dias a adicionar</span>
          <input type="number" min={1} className={input} value={form.extra_days} onChange={(e) => setForm({ ...form, extra_days: Number(e.target.value) })} /></label>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {[7, 15, 30, 60, 90].map((d) => (
          <button key={d} type="button" onClick={() => setForm({ ...form, extra_days: d })}
            className="rounded-lg bg-foreground/5 px-2 py-1 text-xs font-semibold">
            +{d} dias
          </button>
        ))}
      </div>
    </FormShell>
  );
}
