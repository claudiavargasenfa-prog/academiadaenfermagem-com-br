import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/saude-mental")({
  head: () => ({
    meta: [
      { title: "Saúde Mental e Cuidado Psiquiátrico — Academia de Enfermagem" },
      { name: "description", content: "Manejo da crise, comunicação terapêutica, contenção e medicações." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mini app" title="Saúde Mental e Cuidado Psiquiátrico" description="Manejo da crise, comunicação terapêutica, contenção e medicações." />
      <AppAccessGate slug="saude-mental">
        <MiniAppContent slug="saude-mental" />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Brain className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Estrutura pronta. Em breve: avaliação do paciente em crise, manejo verbal, contenção mecânica
            ética, medicações psiquiátricas e cuidado em rede.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
