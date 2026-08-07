import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/$slug/")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Academia da Enfermagem` },
      { name: "description", content: `Mini App ${params.slug} da Academia da Enfermagem.` },
      { property: "og:title", content: `${params.slug} — Academia da Enfermagem` },
      { property: "og:description", content: `Mini App ${params.slug} da Academia da Enfermagem.` },
      { property: "og:url", content: `https://academiadaenfermagem.com.br/app/${params.slug}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: `${params.slug} — Academia da Enfermagem` },
      { name: "twitter:description", content: `Mini App ${params.slug} da Academia da Enfermagem.` },
    ],
    links: [{ rel: "canonical", href: `https://academiadaenfermagem.com.br/app/${params.slug}` }],
  }),
  component: Page,
  errorComponent: ({ error }) => (
    <AppShell>
      <Card>
        <p className="text-sm text-destructive">Erro ao carregar: {String(error?.message ?? error)}</p>
      </Card>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <Card>
        <p className="text-sm text-muted-foreground">Mini App não encontrado.</p>
      </Card>
    </AppShell>
  ),
});

function Page() {
  const { slug } = Route.useParams();
  const q = useQuery({
    queryKey: ["mini_app_meta", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_apps")
        .select("id, name, slug, description")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const subsQ = useQuery({
    queryKey: ["mini_app_subtopics", slug],
    enabled: !!q.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_app_subtopics")
        .select("id, slug, title, ordem, icon, is_draft")
        .eq("mini_app_id", q.data!.id)
        .eq("is_draft", false)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (q.isLoading) {
    return (
      <AppShell>
        <Card>Carregando…</Card>
      </AppShell>
    );
  }
  if (!q.data) throw notFound();

  const app = q.data;
  const subs = subsQ.data ?? [];
  const hasSubs = subs.length > 0;

  return (
    <AppShell>
      <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <PageHeader eyebrow="Mini App" title={app.name} description={app.description ?? undefined} />
      <AppAccessGate slug={slug}>
        <MiniAppContent slug={slug} />

        {hasSubs ? (
          <Card>
            <div className="mb-3 flex items-center gap-2 text-gold">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-foreground">Tópicos</h2>
            </div>
            <ul className="divide-y divide-foreground/10">
              {subs.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/app/$slug/$subtopic"
                    params={{ slug, subtopic: s.slug }}
                    className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-lg">{s.icon ?? "📖"}</span>
                      {s.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <div className="mb-3 flex items-center gap-2 text-gold">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-foreground">{app.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Use o painel Admin → Mini Apps para adicionar texto, vídeo, áudio ou dividir este
              Mini App em subtópicos. O conteúdo aparecerá automaticamente acima deste bloco.
            </p>
          </Card>
        )}
      </AppAccessGate>
    </AppShell>
  );
}
