import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/acls")({
  head: () => ({
    meta: [
      { title: "ACLS — Suporte Avançado de Vida — Academia da Enfermagem" },
      { name: "description", content: "Algoritmos de PCR, ritmos chocáveis e não chocáveis, drogas." },
      { property: "og:title", content: "ACLS — Suporte Avançado de Vida — Academia da Enfermagem" },
      { property: "og:description", content: "Algoritmos de PCR, ritmos chocáveis e não chocáveis, drogas." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/acls" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "ACLS — Suporte Avançado de Vida — Academia da Enfermagem" },
      { name: "twitter:description", content: "Algoritmos de PCR, ritmos chocáveis e não chocáveis, drogas." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/acls" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Guia clínico" title="ACLS — Suporte Avançado de Vida" description="Algoritmos de PCR adulto, ritmos chocáveis e não chocáveis, drogas." />
      <AppAccessGate slug="acls">
        <MiniAppContent slug="acls" />
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <HeartPulse className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo em construção</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Estrutura pronta. Em breve: fluxograma de PCR, doses de epinefrina e amiodarona, cuidados pós-PCR
            e simulações.
          </p>
        </Card>
      </AppAccessGate>
    </AppShell>
  );
}
