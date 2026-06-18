import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/farmacologia-avancada")({
  head: () => ({
    meta: [
      { title: "Farmacologia Avançada — Academia de Enfermagem" },
      { name: "description", content: "Aminas vasoativas, antibióticos, sedativos e diluições críticas." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mini app" title="Farmacologia Avançada" description="Aminas vasoativas, antibióticos, sedativos e diluições críticas." />
      <AppAccessGate slug="farmacologia-avancada">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <FlaskConical className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Estrutura pronta. Em breve: tabelas de diluição padrão, mcg/kg/min de aminas, espectro de
            antibióticos, sedativos e antagonistas.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
