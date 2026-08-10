import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

type Item = {
  id: string;
  read_at: string | null;
  admin_messages: { id: string; title: string; body: string; created_at: string } | null;
};

async function fetchMinhasMensagens(): Promise<Item[]> {
  const { data: s } = await supabase.auth.getSession();
  const user = s.session?.user;
  if (!user) return [];
  const { data, error } = await supabase
    .from("admin_message_recipients")
    .select("id, read_at, admin_messages:message_id (id, title, body, created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Item[];
}

export function MinhasMensagens() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["minhas_mensagens"], queryFn: fetchMinhasMensagens });
  const itens = (q.data ?? []).filter((i) => i.admin_messages);

  if (itens.length === 0) return null;

  const naoLidas = itens.filter((i) => !i.read_at).length;

  async function marcarLida(id: string) {
    await supabase
      .from("admin_message_recipients")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["minhas_mensagens"] });
  }

  return (
    <section className="mt-6">
      <h2 className="mb-3 font-display text-lg font-bold">
        Mensagens da ADEC {naoLidas > 0 && (
          <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
            {naoLidas} nova{naoLidas > 1 ? "s" : ""}
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {itens.map((i) => (
          <Card key={i.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold">{i.admin_messages!.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{i.admin_messages!.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(i.admin_messages!.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              {!i.read_at && (
                <button
                  type="button"
                  onClick={() => marcarLida(i.id)}
                  className="shrink-0 rounded-lg bg-foreground/10 px-3 py-1.5 text-xs font-semibold"
                >
                  Marcar como lida
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default MinhasMensagens;
