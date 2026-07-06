import { createFileRoute } from "@tanstack/react-router";
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
    ],
  }),
  component: EscalasPage,
});

export function EscalasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliação Clínica"
        title="Escalas Clínicas na Prática"
        description="8 escalas essenciais que todo enfermeiro precisa dominar. Clique em cada título para abrir."
      />
      <MiniAppContent slug="escalas-clinicas" />
    </AppShell>
  );
}
