import { createFileRoute } from "@tanstack/react-router";
import { ContentProtection } from "@/components/ContentProtection";
import { AppShell, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";

export const Route = createFileRoute("/escalas-clinicas")({
  head: () => ({
    meta: [
      { title: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin.",
      },
      { property: "og:title", content: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      { property: "og:description", content: "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/escalas-clinicas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      { name: "twitter:description", content: "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/escalas-clinicas" }],
  }),
  component: EscalasPage,
});

export function EscalasPage() {
  return (
    <AppShell>
      <ContentProtection allowPrint>
      <PageHeader
        eyebrow="Avaliação Clínica"
        title="Escalas Clínicas na Prática"
        description="8 escalas essenciais que todo enfermeiro precisa dominar. Clique em cada título para abrir."
      />
      <MiniAppContent slug="escalas-clinicas" />
    </ContentProtection>
    </AppShell>
  );
}
