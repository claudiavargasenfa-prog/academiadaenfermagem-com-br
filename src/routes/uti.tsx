import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/uti")({
  head: () => ({
    meta: [
      { title: "Enfermagem em UTI — Academia da Enfermagem" },
      { name: "description", content: "Monitorização, VM, sedoanalgesia e prevenção de eventos." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Guia clínico" title="Enfermagem em UTI" description="Monitorização, ventilação mecânica, sedoanalgesia e prevenção de eventos." />
      <AppAccessGate slug="uti">
        <MiniAppContent slug="uti" />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Activity className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Estrutura pronta. Em breve: interpretação de monitorização multiparamétrica, parâmetros de VM,
            escalas RASS/CAM-ICU e bundles de prevenção.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
