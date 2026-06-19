import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, DataTable, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";

export const Route = createFileRoute("/sinais-vitais")({
  head: () => ({
    meta: [
      { title: "Sinais Vitais — Enfermagem em Foco" },
      { name: "description", content: "Valores de referência de PA, FC, FR, SatO₂ e temperatura." },
    ],
  }),
  component: SV,
});

const pa: (string | number)[][] = [
  ["Hipotensão", "< 90", "< 60"],
  ["Normotensão", "< 120", "< 80"],
  ["Pré-hipertensão", "120–139", "80–89"],
  ["Hipertensão estágio 1", "140–159", "90–99"],
  ["Hipertensão estágio 2", "≥ 160", "≥ 100"],
  ["Crise hipertensiva", "≥ 180", "≥ 120"],
];

const fc: (string | number)[][] = [
  ["Bradicardia", "< 60 bpm"],
  ["Normocardia", "60 – 100 bpm"],
  ["Taquicardia", "> 100 bpm"],
];

const fr: (string | number)[][] = [
  ["Bradipneia", "< 12 irpm"],
  ["Eupneia", "12 – 20 irpm"],
  ["Taquipneia", "> 20 irpm"],
];

const temp: (string | number)[][] = [
  ["Hipotermia", "< 35,0 °C"],
  ["Normotermia", "36,1 – 37,2 °C"],
  ["Estado febril", "37,3 – 37,7 °C"],
  ["Febre", "37,8 – 38,9 °C"],
  ["Hiperpirexia", "≥ 41 °C"],
];

const sat: (string | number)[][] = [
  ["Normal", "≥ 95%"],
  ["Hipoxemia leve", "91 – 94%"],
  ["Hipoxemia moderada", "86 – 90%"],
  ["Hipoxemia grave", "≤ 85%"],
];

function SV() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Referências clínicas"
        title="Sinais vitais"
        description="Faixas para paciente adulto, em repouso. Sempre contextualize com a história clínica."
      />
      <MiniAppContent slug="sinais-vitais" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display text-lg font-bold">Pressão arterial (mmHg)</h3>
          <DataTable headers={["Classificação", "PAS", "PAD"]} rows={pa} />
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-lg font-bold">Frequência cardíaca</h3>
          <DataTable headers={["Classificação", "Valor"]} rows={fc} />
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-lg font-bold">Frequência respiratória</h3>
          <DataTable headers={["Classificação", "Valor"]} rows={fr} />
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-lg font-bold">Saturação de O₂</h3>
          <DataTable headers={["Classificação", "Valor"]} rows={sat} />
        </Card>
        <Card className="md:col-span-2">
          <h3 className="mb-3 font-display text-lg font-bold">Temperatura axilar</h3>
          <DataTable headers={["Classificação", "Valor"]} rows={temp} />
        </Card>
      </div>
    </AppShell>
  );
}
