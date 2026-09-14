import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useIsAdmin, useAuthReady } from "@/lib/access";
import {
  VIP_CATEGORIES,
  createVipComment,
  createVipPost,
  deleteVipComment,
  deleteVipPost,
  fetchMyLikes,
  fetchVipComments,
  fetchVipPosts,
  setPinned,
  toggleLike,
} from "@/lib/vip";
import {
  AlertCircle,
  Crown,
  Heart,
  MessageCircle,
  Pin,
  Send,
  Sparkles,
  Trash2,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title: "Área VIP — Comunidade da Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Comunidade exclusiva dos alunos ADEC: tire dúvidas, compartilhe casos clínicos e dicas de plantão com outros profissionais de enfermagem.",
      },
      { property: "og:title", content: "Área VIP — Comunidade ADEC" },
      {
        property: "og:description",
        content: "Comunidade exclusiva dos alunos da Academia da Enfermagem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/vip" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/vip" }],
  }),
  component: VipPage,
});

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

function VipPage() {
  const qc = useQueryClient();
  const auth = useAuthReady();
  const isAdmin = !!useIsAdmin().data;
  const myId = auth.user?.id ?? null;

  const postsQ = useQuery({ queryKey: ["vip-posts"], queryFn: fetchVipPosts });
  const likesQ = useQuery({ queryKey: ["vip-likes"], queryFn: fetchMyLikes });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(VIP_CATEGORIES[0]);
  const [official, setOfficial] = useState(false);
  const [openPost, setOpenPost] = useState<string | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["vip-posts"] });
    qc.invalidateQueries({ queryKey: ["vip-likes"] });
  };

  const publish = useMutation({
    mutationFn: () =>
      createVipPost({
        title,
        body,
        category,
        isOfficial: isAdmin && official,
        isPinned: isAdmin && official,
      }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      setOfficial(false);
      toast.success("Publicado na Área VIP!");
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Não foi possível publicar."),
  });

  const like = useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) => toggleLike(id, liked),
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e?.message ?? "Erro ao curtir."),
  });

  const removePost = useMutation({
    mutationFn: (id: string) => deleteVipPost(id),
    onSuccess: () => {
      toast.success("Publicação removida.");
      invalidate();
    },
  });

  const pin = useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) => setPinned(id, pinned),
    onSuccess: invalidate,
  });

  const liked = new Set(likesQ.data ?? []);
  const posts = postsQ.data ?? [];
  const loadError = postsQ.error ?? likesQ.error;

  const retryLoad = () => {
    void postsQ.refetch();
    void likesQ.refetch();
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Exclusivo para alunos"
        title="Área VIP"
        description="O ponto de encontro da turma: dúvidas, casos clínicos e dicas de plantão respondidas por quem vive a enfermagem todos os dias."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-3xl border border-gold/30 bg-black p-5 text-white">
        <div className="rounded-2xl border border-gold/40 bg-gold/20 p-3">
          <Crown className="h-7 w-7 text-gold" />
        </div>
        <div>
          <p className="font-display text-lg font-black uppercase tracking-tight">
            Comunidade ADEC
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/70">
            Respeito, sigilo do paciente e colaboração
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <Sparkles className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Nova publicação
          </span>
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {VIP_CATEGORIES.filter((c) => c !== "Aviso oficial" || isAdmin).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  category === c
                    ? "border-gold bg-gold/15 text-gold-dark"
                    : "border-foreground/10 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título — ex.: Como calculo gotejamento de SF 0,9% em 8h?"
            className="w-full rounded-xl border border-foreground/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Escreva sua dúvida ou dica. Nunca inclua nome, prontuário ou dados que identifiquem o paciente."
            className="w-full resize-y rounded-xl border border-foreground/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
          {isAdmin && (
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={official}
                onChange={(e) => setOfficial(e.target.checked)}
              />
              Publicar como <span className="text-gold-dark">aviso oficial fixado</span>
            </label>
          )}
          <div className="flex justify-end">
            <button
              disabled={!title.trim() || !body.trim() || publish.isPending}
              onClick={() => publish.mutate()}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {publish.isPending ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      </Card>

      {loadError && (
        <Card className="mb-6 border border-destructive/30 bg-destructive/5 text-center">
          <AlertCircle className="mx-auto h-6 w-6 text-destructive" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            A comunidade não carregou agora.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sua conta e seus dados estão seguros. Tente novamente sem sair desta página.
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            <RotateCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </Card>
      )}

      {postsQ.isLoading && !loadError && (
        <Card>
          <p className="animate-pulse text-sm text-muted-foreground">Carregando a comunidade...</p>
        </Card>
      )}

      {!postsQ.isLoading && !loadError && posts.length === 0 && (
        <Card className="text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não há publicações. Seja a primeira pessoa a abrir uma conversa aqui!
          </p>
        </Card>
      )}

      {!loadError && <div className="grid gap-4">
        {posts.map((p) => (
          <Card
            key={p.id}
            className={p.is_pinned ? "border border-gold/50 ring-1 ring-gold/20" : ""}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {p.is_pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-black uppercase text-gold-dark">
                  <Pin className="h-3 w-3" /> Fixado
                </span>
              )}
              {p.is_official && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                  <ShieldCheck className="h-3 w-3" /> Oficial ADEC
                </span>
              )}
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                {p.category}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {p.author_name} · {timeAgo(p.created_at)}
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-foreground">{p.title}</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{p.body}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => like.mutate({ id: p.id, liked: liked.has(p.id) })}
                className={`inline-flex items-center gap-1 font-semibold transition ${
                  liked.has(p.id) ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked.has(p.id) ? "fill-current" : ""}`} />
                {p.likes_count}
              </button>
              <button
                onClick={() => setOpenPost(openPost === p.id ? null : p.id)}
                className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-gold-dark"
              >
                <MessageCircle className="h-4 w-4" />
                {p.comments_count} {p.comments_count === 1 ? "resposta" : "respostas"}
              </button>
              {isAdmin && (
                <button
                  onClick={() => pin.mutate({ id: p.id, pinned: !p.is_pinned })}
                  className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-gold-dark"
                >
                  <Pin className="h-4 w-4" />
                  {p.is_pinned ? "Desafixar" : "Fixar"}
                </button>
              )}
              {(isAdmin || p.user_id === myId) && (
                <button
                  onClick={() => removePost.mutate(p.id)}
                  className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" /> Apagar
                </button>
              )}
            </div>

            {openPost === p.id && (
              <CommentThread postId={p.id} myId={myId} isAdmin={isAdmin} onChange={invalidate} />
            )}
          </Card>
        ))}
      </div>}
    </AppShell>
  );
}

function CommentThread({
  postId,
  myId,
  isAdmin,
  onChange,
}: {
  postId: string;
  myId: string | null;
  isAdmin: boolean;
  onChange: () => void;
}) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const q = useQuery({
    queryKey: ["vip-comments", postId],
    queryFn: () => fetchVipComments(postId),
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["vip-comments", postId] });
    onChange();
  };

  const send = useMutation({
    mutationFn: () => createVipComment(postId, text, isAdmin),
    onSuccess: () => {
      setText("");
      refresh();
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro ao responder."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteVipComment(id),
    onSuccess: refresh,
  });

  return (
    <div className="mt-4 space-y-3 border-t border-foreground/10 pt-4">
      {q.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-center">
          <p className="text-xs font-semibold text-foreground">As respostas não carregaram.</p>
          <button
            type="button"
            onClick={() => void q.refetch()}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <RotateCw className="h-3.5 w-3.5" /> Tentar novamente
          </button>
        </div>
      )}
      {(q.data ?? []).map((c) => (
        <div key={c.id} className="rounded-xl bg-foreground/5 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] font-bold text-foreground">{c.author_name}</span>
            {c.is_official && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700">
                ADEC
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
            {(isAdmin || c.user_id === myId) && (
              <button
                onClick={() => remove.mutate(c.id)}
                className="ml-auto text-muted-foreground hover:text-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{c.body}</p>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua resposta..."
          className="flex-1 rounded-xl border border-foreground/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold/60"
        />
        <button
          disabled={!text.trim() || send.isPending}
          onClick={() => send.mutate()}
          className="rounded-xl bg-gold px-3 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
