import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { Bandage } from "lucide-react";

export const Route = createFileRoute("/curativos")({
  head: () => ({
    meta: [
      { title: "Curativos e Lesões de Pele — Academia da Enfermagem" },
      { name: "description", content: "Tipos de feridas, coberturas e técnica asséptica." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mini app" title="Curativos e Lesões de Pele" description="Tipos de feridas, coberturas, técnica asséptica e troca." />
      <AppAccessGate slug="curativos">
        <MiniAppContent slug="curativos" />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Bandage className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Este mini app está com a estrutura pronta. O conteúdo didático completo (classificação de feridas,
            coberturas primárias e secundárias, passo a passo de troca, registro e fotografia clínica) será
            publicado em breve.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
