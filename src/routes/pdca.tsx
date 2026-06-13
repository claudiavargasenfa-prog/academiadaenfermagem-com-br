import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, DataTable, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";

export const Route = createFileRoute("/pdca")({
  head: () => ({
    meta: [
      { title: "PDCA & ODS 3 — Enfermagem em Foco" },
      { name: "description", content: "Ciclo PDCA aplicado ao estágio e metas da ODS 3 para consulta." },
    ],
  }),
  component: PDCA,
});

const fases = [
  {
    key: "p",
    titulo: "P — Planejar",
    hint: "Defina o problema, as metas SMART e os indicadores de sucesso.",
  },
  {
    key: "d",
    titulo: "D — Executar",
    hint: "Descreva as ações realizadas, intervenções de enfermagem e responsáveis.",
  },
  {
    key: "c",
    titulo: "C — Verificar",
    hint: "Compare resultados obtidos com a meta planejada. O que os dados mostram?",
  },
  {
    key: "a",
    titulo: "A — Agir",
    hint: "Padronize o que funcionou e proponha correções para o que não funcionou.",
  },
] as const;

function PDCA() {
  const [pdca, setPdca] = useLocal("pdca-state", { p: "", d: "", c: "", a: "" });
  const [info, setInfo] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão do cuidado"
        title="Ciclo PDCA e metas da ODS 3"
        description="Estruture cada plantão com método. As respostas ficam salvas no aparelho e alimentam o painel inicial."
      />

      <Card className="mb-5">
        <h3 className="mb-3 font-display text-lg font-bold">Identificação do estágio</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["campo", "Campo de estágio"],
              ["preceptor", "Preceptor(a)"],
              ["periodo", "Período"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <input
                value={info[k]}
                onChange={(e) => setInfo({ ...info, [k]: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {fases.map((f) => (
          <Card key={f.key}>
            <h3 className="font-display text-lg font-bold text-primary">{f.titulo}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
            <textarea
              value={(pdca as Record<string, string>)[f.key]}
              onChange={(e) => setPdca({ ...pdca, [f.key]: e.target.value })}
              rows={6}
              className="mt-3 w-full resize-y rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Escreva aqui..."
            />
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h3 className="mb-1 font-display text-lg font-bold">ODS 3 — Saúde e Bem-Estar</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Metas globais para orientar projetos e relatórios de estágio.
        </p>
        <DataTable
          headers={["Meta", "Descrição resumida"]}
          rows={[
            ["3.1", "Reduzir a mortalidade materna global."],
            ["3.2", "Acabar com mortes evitáveis de recém-nascidos e crianças menores de 5 anos."],
            ["3.3", "Acabar com epidemias de AIDS, tuberculose, malária e doenças tropicais negligenciadas."],
            ["3.4", "Reduzir mortalidade prematura por doenças não transmissíveis e promover saúde mental."],
            ["3.5", "Fortalecer prevenção e tratamento do abuso de substâncias."],
            ["3.7", "Assegurar acesso universal a serviços de saúde sexual e reprodutiva."],
            ["3.8", "Cobertura universal de saúde, incluindo medicamentos essenciais."],
            ["3.b", "Apoiar pesquisa e desenvolvimento de vacinas e medicamentos."],
            ["3.c", "Aumentar substancialmente o financiamento da saúde e a força de trabalho."],
          ]}
        />
      </Card>
    </AppShell>
  );
}
