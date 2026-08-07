import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";

export const Route = createFileRoute("/saude-mental")({
  head: () => ({
    meta: [
      { title: "Saúde Mental e Cuidado Psiquiátrico — Academia da Enfermagem" },
      { name: "description", content: "Manejo da crise, comunicação terapêutica, contenção e medicações." },
      { property: "og:title", content: "Saúde Mental e Cuidado Psiquiátrico — Academia da Enfermagem" },
      { property: "og:description", content: "Manejo da crise, comunicação terapêutica, contenção e medicações." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/saude-mental" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Saúde Mental e Cuidado Psiquiátrico — Academia da Enfermagem" },
      { name: "twitter:description", content: "Manejo da crise, comunicação terapêutica, contenção e medicações." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/saude-mental" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mini App" title="Saúde Mental e Cuidado Psiquiátrico" description="Manejo da crise, comunicação terapêutica, contenção e medicações." />
      <AppAccessGate slug="saude-mental">
        <MiniAppContent slug="saude-mental" />
      
      </AppAccessGate>
    </AppShell>
  );
}
