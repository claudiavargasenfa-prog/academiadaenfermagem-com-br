import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Academia da Enfermagem` },
      { name: "description", content: `Mini app ${params.slug} da Academia da Enfermagem.` },
    ],
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
        <p className="text-sm text-muted-foreground">Mini app não encontrado.</p>
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

  if (q.isLoading) {
    return (
      <AppShell>
        <Card>Carregando…</Card>
      </AppShell>
    );
  }
  if (!q.data) throw notFound();

  const app = q.data;
  return (
    <AppShell>
      <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <PageHeader eyebrow="Mini app" title={app.name} description={app.description ?? undefined} />
      <AppAccessGate slug={slug}>
        <MiniAppContent slug={slug} />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">{app.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Use o painel Admin → Mini apps para adicionar texto, vídeo ou áudio para este mini app.
            O conteúdo aparecerá automaticamente acima deste bloco.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
