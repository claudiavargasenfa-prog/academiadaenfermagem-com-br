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
      { property: "og:title", content: "Curativos e Lesões de Pele — Academia da Enfermagem" },
      { property: "og:description", content: "Tipos de feridas, coberturas e técnica asséptica." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/curativos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Curativos e Lesões de Pele — Academia da Enfermagem" },
      { name: "twitter:description", content: "Tipos de feridas, coberturas e técnica asséptica." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/curativos" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Guia clínico" title="Curativos e Lesões de Pele" description="Tipos de feridas, coberturas, técnica asséptica e troca." />
      <AppAccessGate slug="curativos">
        <MiniAppContent slug="curativos" />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Bandage className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Este guia clínico está com a estrutura pronta. O conteúdo didático completo (classificação de feridas,
            coberturas primárias e secundárias, passo a passo de troca, registro e fotografia clínica) será
            publicado em breve.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
