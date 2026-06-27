import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, Headphones, List, Video } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { supabase } from "@/integrations/supabase/client";
import { renderContent } from "@/lib/markdown";

export const Route = createFileRoute("/app/$slug/$subtopic")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subtopic} — ${params.slug} — Academia da Enfermagem` },
    ],
  }),
  component: Page,
  notFoundComponent: () => (
    <AppShell>
      <Card>
        <p className="text-sm text-muted-foreground">Sub-tópico não encontrado.</p>
      </Card>
    </AppShell>
  ),
});

function Page() {
  const { slug, subtopic } = Route.useParams();

  const appQ = useQuery({
    queryKey: ["mini_app_meta", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_apps")
        .select("id, name, slug")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const subsQ = useQuery({
    queryKey: ["mini_app_subtopics", slug],
    enabled: !!appQ.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_app_subtopics")
        .select("*")
        .eq("mini_app_id", appQ.data!.id)
        .eq("is_draft", false)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (appQ.isLoading || subsQ.isLoading) {
    return (
      <AppShell>
        <Card>Carregando…</Card>
      </AppShell>
    );
  }
  if (!appQ.data) throw notFound();
  const subs = subsQ.data ?? [];
  const idx = subs.findIndex((s) => s.slug === subtopic);
  if (idx < 0) throw notFound();
  const sub = subs[idx];
  const prev = idx > 0 ? subs[idx - 1] : null;
  const next = idx < subs.length - 1 ? subs[idx + 1] : null;

  return (
    <AppShell>
      <Link
        to="/app/$slug"
        params={{ slug }}
        className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {appQ.data.name}
      </Link>
      <PageHeader
        eyebrow={appQ.data.name}
        title={`${sub.icon ?? "📖"} ${sub.title}`}
      />
      <AppAccessGate slug={slug}>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          {/* Menu lateral */}
          <aside className="md:sticky md:top-4 md:self-start">
            <Card>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <List className="h-3.5 w-3.5" /> Tópicos
              </div>
              <ul className="space-y-1">
                {subs.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/app/$slug/$subtopic"
                      params={{ slug, subtopic: s.slug }}
                      className={`block rounded-md px-2 py-1.5 text-sm ${
                        s.slug === subtopic
                          ? "bg-primary/15 font-semibold text-primary"
                          : "hover:bg-foreground/5"
                      }`}
                    >
                      <span className="mr-1">{s.icon ?? "•"}</span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>

          {/* Conteúdo */}
          <div className="space-y-4">
            {sub.video_url?.trim() && (
              <Card>
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Video className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Vídeo</span>
                </div>
                <VideoEmbed url={sub.video_url.trim()} />
              </Card>
            )}

            {sub.audio_url?.trim() && (
              <Card>
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Headphones className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Áudio</span>
                </div>
                <audio controls src={sub.audio_url.trim()} className="w-full" />
              </Card>
            )}

            {sub.content_md?.trim() ? (
              <Card>
                <div className="prose-sm max-w-none">{renderContent(sub.content_md)}</div>
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-muted-foreground">
                  Este tópico ainda não tem conteúdo. Use o Admin para adicionar.
                </p>
              </Card>
            )}

            {/* Paginação */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {prev ? (
                <Link
                  to="/app/$slug/$subtopic"
                  params={{ slug, subtopic: prev.slug }}
                  className="inline-flex items-center gap-1 rounded-xl bg-foreground/5 px-3 py-2 text-sm font-semibold hover:bg-foreground/10"
                >
                  <ChevronLeft className="h-4 w-4" /> {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to="/app/$slug/$subtopic"
                  params={{ slug, subtopic: next.slug }}
                  className="ml-auto inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
                >
                  {next.title} <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </AppAccessGate>
    </AppShell>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const embed = toEmbedUrl(url);
  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src={embed}
          title="Vídeo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  return <video controls src={url} className="w-full rounded-xl" />;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}
