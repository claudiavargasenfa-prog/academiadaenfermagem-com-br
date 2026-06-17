import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AlertTriangle, Info, Thermometer, Wind, Smile } from "lucide-react";
import escalaDor from "@/assets/escala-dor.png.asset.json";


export const Route = createFileRoute("/sv-pediatrico")({
  head: () => ({
    meta: [
      { title: "Sinais Vitais Pediátricos — Academia de Enfermagem" },
      { name: "description", content: "Valores de FC, FR e PA por faixa etária pediátrica e neonatal." },
    ],
  }),
  component: SVPed,
});

type Faixa = {
  id: string;
  label: string;
  fc: string;
  fr: string;
  pasNormal: string;
  pad: string;
  obs?: string;
};

const faixas: Faixa[] = [
  {
    id: "rn",
    label: "RN (0–28 dias)",
    fc: "100 – 180 bpm",
    fr: "30 – 60 irpm",
    pasNormal: "60 – 90 mmHg",
    pad: "30 – 60 mmHg",
    obs: "PAS < 60 indica hipotensão grave em RN.",
  },
  {
    id: "lac",
    label: "Lactente (1m – 1 ano)",
    fc: "100 – 160 bpm",
    fr: "24 – 40 irpm",
    pasNormal: "70 – 100 mmHg",
    pad: "35 – 65 mmHg",
    obs: "PAS < 70 mmHg = hipotensão (PALS).",
  },
  {
    id: "1-2",
    label: "1 – 2 anos",
    fc: "90 – 150 bpm",
    fr: "22 – 37 irpm",
    pasNormal: "80 – 110 mmHg",
    pad: "40 – 70 mmHg",
  },
  {
    id: "3-5",
    label: "3 – 5 anos",
    fc: "80 – 140 bpm",
    fr: "20 – 30 irpm",
    pasNormal: "85 – 115 mmHg",
    pad: "45 – 75 mmHg",
  },
  {
    id: "6-11",
    label: "6 – 11 anos",
    fc: "70 – 120 bpm",
    fr: "18 – 25 irpm",
    pasNormal: "90 – 120 mmHg",
    pad: "50 – 80 mmHg",
  },
  {
    id: "adol",
    label: "Adolescente (12+)",
    fc: "60 – 100 bpm",
    fr: "12 – 20 irpm",
    pasNormal: "100 – 130 mmHg",
    pad: "60 – 85 mmHg",
  },
];

const idadeAnos: Record<string, number | null> = {
  rn: 0,
  lac: 1,
  "1-2": 2,
  "3-5": 5,
  "6-11": 11,
  adol: null, // fórmula não se aplica
};

function SVPed() {
  const [sel, setSel] = useState<string>("lac");
  const f = useMemo(() => faixas.find((x) => x.id === sel)!, [sel]);
  const anos = idadeAnos[sel];
  const limiteHipo = anos !== null ? 70 + 2 * anos : null;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Pediátrico & Neonatal"
        title="Sinais vitais por faixa etária"
        description="Selecione a faixa para ver FC, FR e PA esperados. Sempre contextualize com a clínica."
      />

      {/* Segmented control */}
      <div className="mb-5 -mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2 px-1">
          {faixas.map((x) => {
            const active = x.id === sel;
            return (
              <button
                key={x.id}
                onClick={() => setSel(x.id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "glass text-foreground"
                }`}
              >
                {x.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">FC (vigília)</p>
          <p className="mt-1 font-display text-2xl font-bold">{f.fc}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">FR</p>
          <p className="mt-1 font-display text-2xl font-bold">{f.fr}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">PA esperada</p>
          <p className="mt-1 font-display text-lg font-bold">PAS {f.pasNormal}</p>
          <p className="text-sm text-muted-foreground">PAD {f.pad}</p>
        </Card>
      </div>

      {/* Hipotensão PALS */}
      <Card className="mt-4 border-l-4 border-[hsl(0_72%_55%)]">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(0_72%_50%)]" />
          <div>
            <p className="font-display text-base font-bold">Hipotensão pediátrica — regra PALS</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">PAS &lt; 70 + (2 × idade em anos)</span>{" "}
              indica hipotensão em crianças de 1 a 10 anos.
            </p>
            {limiteHipo !== null && (
              <p className="mt-2 inline-block rounded-lg bg-[hsl(0_72%_95%)] px-3 py-1.5 text-sm font-semibold text-[hsl(0_72%_35%)]">
                Limite para esta faixa: PAS &lt; {limiteHipo} mmHg
              </p>
            )}
            {f.obs && <p className="mt-2 text-xs text-muted-foreground">{f.obs}</p>}
          </div>
        </div>
      </Card>

      {/* Cards universais */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-bold">SpO₂</h3>
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Alvo:</span> ≥ 95% em ar ambiente.
          </p>
          <p className="mt-1 flex gap-2 rounded-lg bg-[hsl(45_95%_94%)] p-2 text-xs text-[hsl(35_85%_30%)]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            RN: curva gradual nos primeiros 10 min de vida (60–65% no 1º min até ≥ 85% aos 10 min).
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-bold">Temperatura axilar</h3>
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Normotermia:</span> 36,5 – 37,5 °C.
          </p>
          <p className="mt-1 flex gap-2 rounded-lg bg-[hsl(0_85%_95%)] p-2 text-xs text-[hsl(0_70%_35%)]">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            RN: T &lt; 36 °C = hipotermia — risco rápido de perda de calor; aquecer imediatamente.
          </p>
        </Card>
      </div>

      {/* Escala de Dor (carinhas) */}
      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <Smile className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-bold">Escala de Dor (carinhas) — 0 a 10</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Peça à criança que aponte para a carinha que representa a dor que sente. Use a partir de 3 anos
          (cooperativa) ou em qualquer paciente com dificuldade de verbalizar.
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border/60 bg-white">
          <img
            src={escalaDor.url}
            alt="Escala de dor com carinhas de 0 (sem dor) a 10 (pior dor possível)"
            className="w-full object-contain"
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs text-foreground">
          <p className="rounded-lg bg-[hsl(160_84%_39%/0.1)] p-2"><strong>0–2</strong> · Sem dor / dor leve</p>
          <p className="rounded-lg bg-[hsl(45_95%_94%)] p-2 text-[hsl(35_85%_30%)]"><strong>3–6</strong> · Dor moderada a intensa</p>
          <p className="rounded-lg bg-[hsl(0_85%_95%)] p-2 text-[hsl(0_70%_35%)]"><strong>7–10</strong> · Dor muito intensa / pior dor</p>
        </div>
      </Card>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Fontes: Diretrizes PALS/AHA, Sociedade Brasileira de Pediatria (SBP), OMS e FEBRASGO. Aplicativo
        educacional — não substitui o julgamento clínico do profissional de saúde.
      </p>

    </AppShell>
  );
}
