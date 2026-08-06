import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { QUIZZES } from "@/data/quizzes";
import { BrainCircuit } from "lucide-react";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Quizzes de Enfermagem — Academia da Enfermagem" },
      { name: "description", content: "50 quizzes de enfermagem para acadêmicos e enfermeiros: UTI, ACLS, farmacologia, sinais vitais e mais." },
    ],
  }),
  component: QuizzesLayout,
});

function QuizzesLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/quizzes/$slug");
  if (isChild) return <Outlet />;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Guia clínico"
        title="Quizzes de Enfermagem"
        description="50 quizzes para revisar todos os principais temas. Escolha um e teste seus conhecimentos."
      />
      <AppAccessGate slug="quizzes">
        <MiniAppContent slug="quizzes" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZZES.map((q) => (
            <Link key={q.slug} to="/quizzes/$slug" params={{ slug: q.slug }} className="block">
              <Card className="h-full transition hover:border-gold/60">
                <div className="mb-2 flex items-center gap-2 text-gold">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="text-[11px] uppercase tracking-wider">{q.category}</span>
                </div>
                <h3 className="font-display text-base font-bold text-foreground">{q.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{q.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">{q.questions.length} perguntas</p>
              </Card>
            </Link>
          ))}
        </div>
      </AppAccessGate>
    </AppShell>
  );
}
