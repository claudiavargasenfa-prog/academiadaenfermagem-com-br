import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/AppShell";
import {
  listRecipientsAdmin,
  listSentMessagesAdmin,
  sendAdminMessage,
  deleteAdminMessage,
} from "@/lib/messages-admin.functions";

export function MessagesAdmin() {
  const qc = useQueryClient();
  const fetchRecipients = useServerFn(listRecipientsAdmin);
  const fetchSent = useServerFn(listSentMessagesAdmin);
  const send = useServerFn(sendAdminMessage);
  const remove = useServerFn(deleteAdminMessage);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [toAll, setToAll] = useState(false);
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const usersQ = useQuery({ queryKey: ["admin_msg_users"], queryFn: () => fetchRecipients() });
  const sentQ = useQuery({ queryKey: ["admin_msg_sent"], queryFn: () => fetchSent() });

  const users = usersQ.data ?? [];
  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return users;
    return users.filter(
      (u: any) =>
        (u.full_name || "").toLowerCase().includes(t) ||
        (u.email || "").toLowerCase().includes(t) ||
        (u.categoria || "").toLowerCase().includes(t),
    );
  }, [users, busca]);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const sendM = useMutation({
    mutationFn: () =>
      send({ data: { title, body, to_all: toAll, user_ids: selectedIds } }),
    onSuccess: (r: any) => {
      toast.success(`Mensagem enviada para ${r.enviados} aluno(s).`);
      setTitle("");
      setBody("");
      setSelected({});
      setToAll(false);
      qc.invalidateQueries({ queryKey: ["admin_msg_sent"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Não foi possível enviar."),
  });

  const delM = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Mensagem excluída.");
      qc.invalidateQueries({ queryKey: ["admin_msg_sent"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Não foi possível excluir."),
  });

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-display text-base font-bold">✉️ Nova mensagem privada</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Só o aluno escolhido vê a mensagem, dentro de “Minha Conta”.
        </p>

        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (ex.: Aviso importante da ADEC)"
            maxLength={150}
            className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escreva aqui a mensagem…"
            maxLength={5000}
            rows={6}
            className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={toAll}
              onChange={(e) => setToAll(e.target.checked)}
            />
            Enviar para TODOS os alunos
          </label>

          {!toAll && (
            <div className="rounded-xl border border-foreground/10 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou categoria"
                  className="flex-1 rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="rounded-lg bg-foreground/10 px-3 py-2 text-xs font-semibold"
                  onClick={() => {
                    const next = { ...selected };
                    for (const u of filtrados) next[u.id] = true;
                    setSelected(next);
                  }}
                >
                  Marcar exibidos
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-foreground/10 px-3 py-2 text-xs font-semibold"
                  onClick={() => setSelected({})}
                >
                  Limpar
                </button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {selectedIds.length} selecionado(s) de {users.length}
              </p>

              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
                {usersQ.isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
                {filtrados.map((u: any) => (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-foreground/5"
                  >
                    <input
                      type="checkbox"
                      checked={!!selected[u.id]}
                      onChange={(e) =>
                        setSelected((s) => ({ ...s, [u.id]: e.target.checked }))
                      }
                    />
                    <span className="font-medium">{u.full_name || "(sem nome)"}</span>
                    <span className="text-xs text-muted-foreground">{u.email}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={sendM.isPending}
            onClick={() => sendM.mutate()}
            className="rounded-xl gold-gradient px-5 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {sendM.isPending ? "Enviando…" : "Enviar mensagem"}
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base font-bold">📨 Mensagens enviadas</h3>
        <div className="mt-3 space-y-3">
          {sentQ.isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
          {(sentQ.data ?? []).length === 0 && !sentQ.isLoading && (
            <p className="text-sm text-muted-foreground">Nenhuma mensagem enviada ainda.</p>
          )}
          {(sentQ.data ?? []).map((m: any) => (
            <div key={m.id} className="rounded-xl border border-foreground/10 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{m.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{m.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString("pt-BR")} •{" "}
                    {m.is_broadcast ? "Todos" : "Selecionados"} • {m.lidas}/{m.total} leram
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => delM.mutate(m.id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default MessagesAdmin;
