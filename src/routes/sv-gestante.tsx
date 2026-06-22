import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import { AlertTriangle, HeartPulse, Wind } from "lucide-react";

export const Route = createFileRoute("/sv-gestante")({
  head: () => ({
    meta: [
      { title: "Sinais Vitais — Gestante — Academia da Enfermagem" },
      { name: "description", content: "Valores de referência de PA, FC, FR e SpO₂ na gestação." },
    ],
  }),
  component: SVGest,
});

type Row = { label: string; value: string; tone?: "ok" | "warn" | "bad" };

const pa: Row[] = [
  { label: "Hipotensão", value: "PAS < 90 / PAD < 60" },
  { label: "Normotensão", value: "PAS 90–119 / PAD 60–79", tone: "ok" },
  { label: "Pré-hipertensão", value: "PAS 120–139 / PAD 80–89", tone: "warn" },
  { label: "Hipertensão (risco de pré-eclâmpsia)", value: "PAS ≥ 140 ou PAD ≥ 90", tone: "bad" },
  { label: "Crise hipertensiva", value: "PAS ≥ 160 ou PAD ≥ 110", tone: "bad" },
];

const fc: Row[] = [
  { label: "Bradicardia", value: "< 60 bpm" },
  { label: "Normocardia gestacional", value: "70 – 90 bpm", tone: "ok" },
  { label: "Taquicardia fisiológica", value: "90 – 110 bpm", tone: "warn" },
  { label: "Taquicardia de alerta (choque/hemorragia)", value: "> 110 bpm", tone: "bad" },
];

const fr: Row[] = [
  { label: "Eupneia", value: "16 – 20 irpm", tone: "ok" },
  { label: "Taquipneia", value: "> 20 irpm", tone: "warn" },
  { label: "Bradipneia", value: "< 12 irpm", tone: "bad" },
];

const sat: Row[] = [
  { label: "Normal", value: "≥ 95%", tone: "ok" },
  { label: "Alerta — conduta imediata", value: "< 95%", tone: "bad" },
];

const temp: Row[] = [
  { label: "Hipotermia", value: "< 35,0 °C" },
  { label: "Normotermia", value: "36,1 – 37,2 °C", tone: "ok" },
  { label: "Febre", value: "≥ 37,8 °C", tone: "warn" },
];

function toneClass(t?: Row["tone"]) {
  if (t === "ok") return "bg-[hsl(150_60%_95%)] text-[hsl(150_60%_25%)]";
  if (t === "warn") return "bg-[hsl(35_90%_94%)] text-[hsl(30_85%_30%)]";
  if (t === "bad") return "bg-[hsl(0_85%_95%)] text-[hsl(0_70%_35%)]";
  return "bg-secondary/60 text-foreground";
}

function Tabela({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <Card>
      <h3 className="mb-3 font-display text-lg font-bold">{title}</h3>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.label}
            className={`flex flex-col gap-1 rounded-xl px-3 py-2 text-sm md:flex-row md:items-center md:justify-between ${toneClass(
              r.tone,
            )}`}
          >
            <span className="font-medium">{r.label}</span>
            <span className="font-mono text-sm font-semibold">{r.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SVGest() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestante"
        title="Sinais vitais na gestação"
        description="Faixas de referência com destaque para sinais de pré-eclâmpsia, hemorragia e hipoxemia materna."
      />
      <MiniAppContent slug="sv-gestante" />

      <Card className="mb-4 border-l-4 border-[hsl(0_72%_55%)]">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(0_72%_50%)]" />
          <div>
            <p className="font-display text-base font-bold">Alerta de pré-eclâmpsia</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">PAS ≥ 140 mmHg ou PAD ≥ 90 mmHg</span>{" "}
              em duas medidas com intervalo ≥ 4 h após 20ª semana = suspeita de pré-eclâmpsia.
              Avaliar proteinúria e sinais de gravidade.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Tabela title="Pressão arterial (mmHg)" rows={pa} />
        <Tabela title="Frequência cardíaca" rows={fc} />
        <Tabela title="Frequência respiratória" rows={fr} />
        <Tabela title="Saturação de O₂" rows={sat} />
        <Tabela title="Temperatura axilar" rows={temp} />

        <Card className="border-l-4 border-[hsl(0_72%_55%)]">
          <div className="flex gap-3">
            <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(0_72%_50%)]" />
            <div>
              <p className="font-display text-base font-bold">Taquicardia &gt; 110 bpm</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sinal precoce de choque hipovolêmico ou hemorragia obstétrica — comunicar equipe e
                investigar perda sanguínea (Índice de Choque ≥ 0,9).
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-[hsl(0_72%_55%)]">
          <div className="flex gap-3">
            <Wind className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(0_72%_50%)]" />
            <div>
              <p className="font-display text-base font-bold">SpO₂ &lt; 95%</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hipoxemia materna exige conduta imediata — oxigenoterapia e avaliação para proteção
                fetal (risco de sofrimento fetal agudo).
              </p>
            </div>
          </div>
        </Card>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Fontes: FEBRASGO, Ministério da Saúde, OMS e Diretrizes AHA. Aplicativo educacional — não
        substitui o julgamento clínico do profissional de saúde.
      </p>
    </AppShell>
  );
}
