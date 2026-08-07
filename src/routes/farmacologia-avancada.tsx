import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/farmacologia-avancada")({
  head: () => ({
    meta: [
      { title: "Farmacologia Avançada — Academia da Enfermagem" },
      { name: "description", content: "Aminas vasoativas, antibióticos, sedativos e diluições críticas." },
      { property: "og:title", content: "Farmacologia Avançada — Academia da Enfermagem" },
      { property: "og:description", content: "Aminas vasoativas, antibióticos, sedativos e diluições críticas." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/farmacologia-avancada" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Farmacologia Avançada — Academia da Enfermagem" },
      { name: "twitter:description", content: "Aminas vasoativas, antibióticos, sedativos e diluições críticas." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/farmacologia-avancada" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mini App" title="Farmacologia Avançada" description="Aminas vasoativas, antibióticos, sedativos e diluições críticas." />
      <AppAccessGate slug="farmacologia-avancada">
        <MiniAppContent slug="farmacologia-avancada" />
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
