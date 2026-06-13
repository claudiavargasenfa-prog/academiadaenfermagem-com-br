import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, DataTable, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/escalas")({
  head: () => ({
    meta: [
      { title: "Escalas Clínicas — Enfermagem em Foco" },
      { name: "description", content: "Escalas de Glasgow, Braden e NIHSS com soma automática." },
    ],
  }),
  component: EscalasPage,
});

type Option = { label: string; value: number };
type Item = { id: string; label: string; options: Option[] };

const glasgow: Item[] = [
  {
    id: "olhos",
    label: "Abertura ocular",
    options: [
      { label: "Espontânea", value: 4 },
      { label: "Ao estímulo verbal", value: 3 },
      { label: "À dor", value: 2 },
      { label: "Ausente", value: 1 },
    ],
  },
  {
    id: "verbal",
    label: "Resposta verbal",
    options: [
      { label: "Orientado", value: 5 },
      { label: "Confuso", value: 4 },
      { label: "Palavras inapropriadas", value: 3 },
      { label: "Sons incompreensíveis", value: 2 },
      { label: "Ausente", value: 1 },
    ],
  },
  {
    id: "motora",
    label: "Resposta motora",
    options: [
      { label: "Obedece a comandos", value: 6 },
      { label: "Localiza dor", value: 5 },
      { label: "Retira à dor", value: 4 },
      { label: "Flexão anormal", value: 3 },
      { label: "Extensão anormal", value: 2 },
      { label: "Ausente", value: 1 },
    ],
  },
];

const braden: Item[] = [
  { id: "percepcao", label: "Percepção sensorial", options: [1, 2, 3, 4].map((v) => ({ label: `${v}`, value: v })) },
  { id: "umidade", label: "Umidade", options: [1, 2, 3, 4].map((v) => ({ label: `${v}`, value: v })) },
  { id: "atividade", label: "Atividade", options: [1, 2, 3, 4].map((v) => ({ label: `${v}`, value: v })) },
  { id: "mobilidade", label: "Mobilidade", options: [1, 2, 3, 4].map((v) => ({ label: `${v}`, value: v })) },
  { id: "nutricao", label: "Nutrição", options: [1, 2, 3, 4].map((v) => ({ label: `${v}`, value: v })) },
  { id: "friccao", label: "Fricção e cisalhamento", options: [1, 2, 3].map((v) => ({ label: `${v}`, value: v })) },
];

function ScaleForm({ items, interpret }: { items: Item[]; interpret: (n: number) => string }) {
  const [values, setValues] = useState<Record<string, number>>({});
  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const complete = items.every((i) => values[i.id] !== undefined);

  return (
    <div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <p className="mb-1.5 text-sm font-semibold text-foreground">{item.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {item.options.map((opt) => {
                const active = values[item.id] === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setValues({ ...values, [item.id]: opt.value })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {opt.label} <span className="opacity-70">· {opt.value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl surface-gradient p-4 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-90">Pontuação</p>
        <p className="mt-1 font-display text-3xl font-bold">{complete ? total : "—"}</p>
        {complete && <p className="mt-1 text-sm opacity-90">{interpret(total)}</p>}
      </div>
    </div>
  );
}

function EscalasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliação clínica"
        title="Escalas e scores"
        description="Selecione as respostas e a pontuação total é somada automaticamente."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-1 font-display text-lg font-bold">Escala de Coma de Glasgow</h3>
          <p className="mb-3 text-xs text-muted-foreground">3 (coma profundo) a 15 (sem alteração).</p>
          <ScaleForm
            items={glasgow}
            interpret={(n) =>
              n <= 8 ? "TCE grave" : n <= 12 ? "TCE moderado" : "TCE leve / sem alteração"
            }
          />
        </Card>
        <Card>
          <h3 className="mb-1 font-display text-lg font-bold">Escala de Braden</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Risco de lesão por pressão (6 a 23 pontos).
          </p>
          <ScaleForm
            items={braden}
            interpret={(n) =>
              n <= 9
                ? "Risco muito alto"
                : n <= 12
                ? "Risco alto"
                : n <= 14
                ? "Risco moderado"
                : n <= 18
                ? "Risco leve"
                : "Sem risco"
            }
          />
        </Card>
        <Card className="md:col-span-2">
          <h3 className="mb-1 font-display text-lg font-bold">NIHSS — referência rápida</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Use o protocolo institucional completo para aplicação à beira-leito.
          </p>
          <DataTable
            headers={["Pontuação", "Gravidade do AVC"]}
            rows={[
              ["0", "Sem déficit"],
              ["1 – 4", "AVC leve"],
              ["5 – 15", "AVC moderado"],
              ["16 – 20", "AVC moderado a grave"],
              ["21 – 42", "AVC grave"],
            ]}
          />
        </Card>
      </div>
    </AppShell>
  );
}
