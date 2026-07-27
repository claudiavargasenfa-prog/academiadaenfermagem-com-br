import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { Brain } from "lucide-react";

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
      <PageHeader eyebrow="Mini app" title="Saúde Mental e Cuidado Psiquiátrico" description="Manejo da crise, comunicação terapêutica, contenção e medicações." />
      <AppAccessGate slug="saude-mental">
        <MiniAppContent slug="saude-mental" />
      
      </AppAccessGate>
    </AppShell>
  );
}
