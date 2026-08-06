import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";

export const Route = createFileRoute("/saude-mental")({
  head: () => ({
    meta: [
      { title: "Saúde Mental e Cuidado Psiquiátrico — Academia da Enfermagem" },
      { name: "description", content: "Manejo da crise, comunicação terapêutica, contenção e medicações." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Guia clínico" title="Saúde Mental e Cuidado Psiquiátrico" description="Manejo da crise, comunicação terapêutica, contenção e medicações." />
      <AppAccessGate slug="saude-mental">
        <MiniAppContent slug="saude-mental" />
      
      </AppAccessGate>
    </AppShell>
  );
}
