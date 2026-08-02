import { createFileRoute } from "@tanstack/react-router";
import { ContentProtection } from "@/components/ContentProtection";
import { useState } from "react";
import { AppShell, Card, PageHeader, DataTable } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import { Calculator } from "lucide-react";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "Cálculo de Medicamentos — Enfermagem em Foco" },
      { name: "description", content: "Calculadoras de diluição, regra de três e gotejamento para enfermagem." },
    ],
  }),
  component: CalcPage,
});

function Field({
  label,
  value,
  onChange,
  unit,
  step = "any",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-base font-semibold text-foreground outline-none"
          placeholder="0"
        />
        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-xl surface-gradient p-4 text-primary-foreground">
      <p className="text-xs font-semibold uppercase tracking-widest opacity-90">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function num(s: string) {
  const n = parseFloat(s.replace(",", "."));
  return isFinite(n) ? n : 0;
}

function RegraDeTres() {
  const [pres, setPres] = useState("");
  const [diluente, setDiluente] = useState("");
  const [dose, setDose] = useState("");
  const ml = pres && dose && num(pres) > 0 ? (num(dose) * num(diluente)) / num(pres) : 0;
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">Diluição (regra de três)</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Quanto administrar em mL a partir de uma apresentação diluída.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Apresentação" value={pres} onChange={setPres} unit="mg/UI" />
        <Field label="Diluído em" value={diluente} onChange={setDiluente} unit="mL" />
        <Field label="Dose prescrita" value={dose} onChange={setDose} unit="mg/UI" />
      </div>
      <Result label="Administrar" value={ml ? `${ml.toFixed(2)} mL` : "—"} />
    </Card>
  );
}

function Gotejamento() {
  const [vol, setVol] = useState("");
  const [horas, setHoras] = useState("");
  const v = num(vol);
  const h = num(horas);
  const gtt = v && h ? v / (h * 3) : 0;
  const mlh = v && h ? v / h : 0;
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">Gotejamento (macrogotas)</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Equipo padrão: 1 mL ≈ 20 gotas. Microgotas: multiplique por 3.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Volume total" value={vol} onChange={setVol} unit="mL" />
        <Field label="Tempo de infusão" value={horas} onChange={setHoras} unit="h" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Result label="Macrogotas" value={gtt ? `${gtt.toFixed(0)} gtt/min` : "—"} />
        <Result label="Bomba" value={mlh ? `${mlh.toFixed(1)} mL/h` : "—"} />
      </div>
    </Card>
  );
}

function DosePorKg() {
  const [peso, setPeso] = useState("");
  const [dose, setDose] = useState("");
  const [conc, setConc] = useState("");
  const total = num(peso) * num(dose);
  const volume = total && num(conc) > 0 ? total / num(conc) : 0;
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">Dose por peso</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        <strong>Dose Total</strong> = Peso × Dose recomendada. <strong>Volume</strong> = Dose total ÷ Concentração.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Peso do paciente" value={peso} onChange={setPeso} unit="kg" />
        <Field label="Dose da droga" value={dose} onChange={setDose} unit="mg/kg" />
        <Field label="Concentração do medicamento" value={conc} onChange={setConc} unit="mg/mL" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Result label="Dose total" value={total ? `${total.toFixed(2)} mg` : "—"} />
        <Result label="Volume a administrar" value={volume ? `${volume.toFixed(2)} mL` : "—"} />
      </div>
    </Card>
  );
}

function Seguranca() {
  const itens = [
    { titulo: "Verificação", texto: "Sempre confira a prescrição médica e a bula do medicamento." },
    { titulo: "Atenção às Concentrações", texto: "Verifique a concentração do frasco (ex: 50 mg/mL) antes de calcular o volume." },
    { titulo: "Ferramentas", texto: "Utilize calculadoras médicas confiáveis e manuais farmacêuticos para auxiliar nos cálculos e evitar erros de medicação." },
    { titulo: "Profissional de Saúde", texto: "A orientação de um médico ou farmacêutico é indispensável para determinar a dose correta e segura para cada paciente." },
    { titulo: "Nota", texto: "A precisão no cálculo é fundamental para a segurança do paciente, especialmente em pediatria." },
  ];
  return (
    <Card className="md:col-span-2 border border-gold/40">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-gold" />
        <h3 className="font-display text-lg font-bold">Considerações de Segurança</h3>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {itens.map((i) => (
          <li key={i.titulo} className="rounded-xl border border-border/60 bg-card/60 p-3 text-sm">
            <p className="font-display text-sm font-bold text-primary">{i.titulo}</p>
            <p className="mt-1 text-muted-foreground">{i.texto}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CalcPage() {
  return (
    <AppShell>
      <ContentProtection allowPrint>
      <PageHeader
        eyebrow="Cálculos clínicos"
        title="Cálculos de medicamentos"
        description="Confirme sempre prescrição, rótulo e os cinco certos antes da administração."
      />
      <MiniAppContent slug="medicamentosecalculos" />
      <div className="grid gap-4 md:grid-cols-2">
        <RegraDeTres />
        <DosePorKg />
        <Gotejamento />
        <Card>
          <h3 className="font-display text-lg font-bold">Equipos e conversões</h3>
          <p className="mt-1 text-sm text-muted-foreground">Referência rápida.</p>
          <div className="mt-4">
            <DataTable
              headers={["Equipo / unidade", "Equivalência"]}
              rows={[
                ["Macrogotas", "1 mL = 20 gotas"],
                ["Microgotas", "1 mL = 60 microgotas"],
                ["1 grama", "1.000 mg"],
                ["1 mg", "1.000 mcg"],
                ["UI insulina (U-100)", "1 mL = 100 UI"],
              ]}
            />
          </div>
        </Card>
        <Seguranca />
      </div>
    </ContentProtection>
    </AppShell>
  );
}

