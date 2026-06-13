import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, DataTable, PageHeader } from "@/components/AppShell";
import { CheckCircle2 } from "lucide-react";
import { useLocal } from "@/lib/storage";

export const Route = createFileRoute("/procedimentos")({
  head: () => ({
    meta: [
      { title: "Procedimentos — Enfermagem em Foco" },
      { name: "description", content: "Guia de procedimentos: exame físico cefalocaudal e referências clínicas." },
    ],
  }),
  component: Procedimentos,
});

const cefalocaudal = [
  { etapa: "Cabeça e pescoço", itens: ["Inspeção do couro cabeludo", "Pupilas (PIFR)", "Mucosas e hidratação", "Linfonodos cervicais"] },
  { etapa: "Tórax", itens: ["Expansibilidade torácica", "Ausculta pulmonar (MV, RA)", "Ausculta cardíaca (B1, B2, sopros)"] },
  { etapa: "Abdome", itens: ["Inspeção", "Ausculta de RHA", "Percussão", "Palpação superficial e profunda"] },
  { etapa: "Membros", itens: ["Pulsos periféricos", "Edema (cacifo)", "Perfusão (TEC < 3s)", "Força e mobilidade"] },
  { etapa: "Pele e tegumentos", itens: ["Coloração", "Turgor", "Lesões (Braden)", "Dispositivos invasivos"] },
];

const referencias = [
  ["Frequência cardíaca (adulto)", "60–100 bpm"],
  ["Frequência respiratória (adulto)", "12–20 irpm"],
  ["Saturação de O₂", "≥ 95%"],
  ["Temperatura axilar", "36,1 – 37,2 °C"],
  ["Glicemia capilar em jejum", "70 – 99 mg/dL"],
  ["Diurese mínima esperada", "0,5 mL/kg/h"],
];

function Procedimentos() {
  const [checks, setChecks] = useLocal<Record<string, boolean>>("exame-fisico-checks", {});
  const toggle = (k: string) => setChecks({ ...checks, [k]: !checks[k] });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Guia de procedimentos"
        title="Exame físico e referências clínicas"
        description="Checklist passo a passo no sentido cefalocaudal. Marque conforme avança no atendimento."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-xl font-bold">Exame físico cefalocaudal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conduza a avaliação de forma sistemática. Os marcadores ficam salvos no aparelho.
          </p>
          <div className="mt-4 space-y-4">
            {cefalocaudal.map((bloco) => (
              <div key={bloco.etapa} className="rounded-xl border border-border/60 bg-card/60 p-4">
                <h3 className="font-display text-base font-bold text-primary">{bloco.etapa}</h3>
                <ul className="mt-2 space-y-1.5">
                  {bloco.itens.map((it) => {
                    const key = `${bloco.etapa}:${it}`;
                    const done = !!checks[key];
                    return (
                      <li key={it}>
                        <button
                          onClick={() => toggle(key)}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                            done ? "bg-success/15 text-foreground" : "hover:bg-secondary/60"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              done ? "text-success" : "text-muted-foreground"
                            }`}
                          />
                          <span className={done ? "line-through opacity-70" : ""}>{it}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-bold">Valores de referência</h2>
          <p className="mt-1 text-sm text-muted-foreground">Adulto saudável, em repouso.</p>
          <div className="mt-4">
            <DataTable headers={["Parâmetro", "Faixa normal"]} rows={referencias} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
