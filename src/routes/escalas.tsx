import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

type Option = { label: string; value: number };
type Item = { id: string; label: string; options: Option[] };

type Scale = {
  id: string;
  name: string;
  subtitle: string;
  range: string;
  items: Item[];
  // sum from picked values + extras (e.g. pupil subtraction)
  compute?: (sum: number, extras: Record<string, number>) => number;
  extras?: Item[]; // negative or modifier groups
  interpret: (score: number) => { label: string; tone: "good" | "warn" | "bad" };
  howTo: string[];
  indication: string[];
  contra: string[];
};

const scales: Scale[] = [
  {
    id: "glasgow",
    name: "Escala de Coma de Glasgow",
    subtitle: "Avaliação neurológica — TCE e rebaixamento de consciência",
    range: "1 a 15 pontos",
    items: [
      {
        id: "olhos",
        label: "Abertura ocular",
        options: [
          { label: "Espontânea", value: 4 },
          { label: "Ao som / verbal", value: 3 },
          { label: "À pressão / dor", value: 2 },
          { label: "Ausente", value: 1 },
          { label: "Não testável", value: 0 },
        ],
      },
      {
        id: "verbal",
        label: "Resposta verbal",
        options: [
          { label: "Orientada", value: 5 },
          { label: "Confusa", value: 4 },
          { label: "Palavras", value: 3 },
          { label: "Sons", value: 2 },
          { label: "Ausente", value: 1 },
          { label: "Não testável", value: 0 },
        ],
      },
      {
        id: "motora",
        label: "Resposta motora",
        options: [
          { label: "Obedece comandos", value: 6 },
          { label: "Localiza estímulo", value: 5 },
          { label: "Flexão normal", value: 4 },
          { label: "Flexão anormal", value: 3 },
          { label: "Extensão", value: 2 },
          { label: "Ausente", value: 1 },
          { label: "Não testável", value: 0 },
        ],
      },
    ],
    extras: [
      {
        id: "pupila",
        label: "Reatividade pupilar (subtrai)",
        options: [
          { label: "Ambas reagem (0)", value: 0 },
          { label: "1 não reage (-1)", value: -1 },
          { label: "Nenhuma reage (-2)", value: -2 },
        ],
      },
    ],
    compute: (sum, extras) => sum + (extras.pupila ?? 0),
    interpret: (n) =>
      n <= 8
        ? { label: "TCE grave", tone: "bad" }
        : n <= 12
        ? { label: "TCE moderado", tone: "warn" }
        : { label: "TCE leve / sem alteração", tone: "good" },
    howTo: [
      "Avalie abertura ocular (1–4), resposta verbal (1–5) e motora (1–6).",
      "Teste a reatividade pupilar e subtraia 0 a 2 pontos do total.",
      "Score final varia de 1 a 15 — registre componentes separadamente (ex: O3 V4 M5).",
    ],
    indication: [
      "Trauma cranioencefálico (TCE).",
      "Rebaixamento agudo do nível de consciência.",
      "Lesões neurológicas agudas e pós-operatório neurocirúrgico.",
    ],
    contra: [
      "Sedação profunda ou bloqueio neuromuscular.",
      "Intubação orotraqueal limita resposta verbal.",
      "Edema palpebral, trauma facial ou surdez limitam componentes específicos.",
    ],
  },
  {
    id: "braden",
    name: "Escala de Braden",
    subtitle: "Risco de lesão por pressão",
    range: "6 a 23 pontos",
    items: [
      {
        id: "percepcao",
        label: "Percepção sensorial",
        options: [
          { label: "Totalmente limitada", value: 1 },
          { label: "Muito limitada", value: 2 },
          { label: "Levemente limitada", value: 3 },
          { label: "Nenhuma limitação", value: 4 },
        ],
      },
      {
        id: "umidade",
        label: "Umidade",
        options: [
          { label: "Constantemente úmida", value: 1 },
          { label: "Muito úmida", value: 2 },
          { label: "Ocasionalmente úmida", value: 3 },
          { label: "Raramente úmida", value: 4 },
        ],
      },
      {
        id: "atividade",
        label: "Atividade",
        options: [
          { label: "Acamado", value: 1 },
          { label: "Confinado à cadeira", value: 2 },
          { label: "Anda ocasionalmente", value: 3 },
          { label: "Anda frequentemente", value: 4 },
        ],
      },
      {
        id: "mobilidade",
        label: "Mobilidade",
        options: [
          { label: "Totalmente imóvel", value: 1 },
          { label: "Muito limitada", value: 2 },
          { label: "Levemente limitada", value: 3 },
          { label: "Não limitada", value: 4 },
        ],
      },
      {
        id: "nutricao",
        label: "Nutrição",
        options: [
          { label: "Muito pobre", value: 1 },
          { label: "Provavelmente inadequada", value: 2 },
          { label: "Adequada", value: 3 },
          { label: "Excelente", value: 4 },
        ],
      },
      {
        id: "friccao",
        label: "Fricção e cisalhamento",
        options: [
          { label: "Problema", value: 1 },
          { label: "Problema potencial", value: 2 },
          { label: "Nenhum problema", value: 3 },
        ],
      },
    ],
    interpret: (n) =>
      n <= 9
        ? { label: "Risco muito alto", tone: "bad" }
        : n <= 12
        ? { label: "Risco alto", tone: "bad" }
        : n <= 14
        ? { label: "Risco moderado", tone: "warn" }
        : n <= 18
        ? { label: "Risco leve", tone: "warn" }
        : { label: "Sem risco", tone: "good" },
    howTo: [
      "Pontue 6 subescalas: percepção, umidade, atividade, mobilidade, nutrição e fricção.",
      "Some os valores: total varia de 6 a 23.",
      "Escore ≤ 18 indica risco de lesão por pressão — implementar prevenção.",
    ],
    indication: [
      "Pacientes acamados ou com restrição de mobilidade.",
      "Internados em UTI, enfermaria, home care ou cadeira de rodas.",
      "Reavaliar a cada 24-48h ou na mudança do quadro.",
    ],
    contra: [
      "Não se aplica a pacientes pediátricos — usar Braden Q.",
      "Não substitui a inspeção diária da pele.",
    ],
  },
  {
    id: "morse",
    name: "Escala de Morse",
    subtitle: "Risco de queda em adultos",
    range: "0 a 125 pontos",
    items: [
      {
        id: "historico",
        label: "Histórico de quedas (3 meses)",
        options: [
          { label: "Não", value: 0 },
          { label: "Sim", value: 25 },
        ],
      },
      {
        id: "diagnostico",
        label: "Diagnóstico secundário",
        options: [
          { label: "Não", value: 0 },
          { label: "Sim", value: 15 },
        ],
      },
      {
        id: "auxilio",
        label: "Auxílio na deambulação",
        options: [
          { label: "Nenhum / acamado / cadeirante", value: 0 },
          { label: "Muletas / bengala / andador", value: 15 },
          { label: "Apoia-se em móveis", value: 30 },
        ],
      },
      {
        id: "iv",
        label: "Terapia IV / dispositivo",
        options: [
          { label: "Não", value: 0 },
          { label: "Sim", value: 20 },
        ],
      },
      {
        id: "marcha",
        label: "Marcha",
        options: [
          { label: "Normal / acamado", value: 0 },
          { label: "Fraca", value: 10 },
          { label: "Comprometida", value: 20 },
        ],
      },
      {
        id: "mental",
        label: "Estado mental",
        options: [
          { label: "Consciente das limitações", value: 0 },
          { label: "Superestima / esquece limitações", value: 15 },
        ],
      },
    ],
    interpret: (n) =>
      n === 0
        ? { label: "Sem risco", tone: "good" }
        : n <= 24
        ? { label: "Risco baixo", tone: "good" }
        : n <= 44
        ? { label: "Risco moderado", tone: "warn" }
        : { label: "Risco alto", tone: "bad" },
    howTo: [
      "Avalie 6 critérios e some os pontos correspondentes.",
      "0 = sem risco; 25–44 = moderado; ≥ 45 = alto risco.",
      "Reavalie a cada turno ou após mudança clínica.",
    ],
    indication: [
      "Pacientes hospitalizados ou institucionalizados.",
      "Idosos, pós-operatórios e em uso de sedativos/diuréticos.",
    ],
    contra: [
      "Pacientes em repouso absoluto contínuo prescrito.",
      "Paralisia total sem possibilidade de marcha.",
      "Pediátricos — usar escala específica (Humpty Dumpty).",
    ],
  },
  {
    id: "fugulin",
    name: "Escala de Fugulin",
    subtitle: "Classificação de cuidados de enfermagem",
    range: "9 a 36 pontos",
    items: [
      ...[
        "Estado mental",
        "Oxigenação",
        "Sinais vitais",
        "Motilidade",
        "Deambulação",
        "Alimentação",
        "Cuidado corporal",
        "Eliminação",
        "Terapêutica",
      ].map<Item>((label, i) => ({
        id: `f${i}`,
        label,
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
        ],
      })),
    ],
    interpret: (n) =>
      n <= 14
        ? { label: "Cuidado mínimo", tone: "good" }
        : n <= 20
        ? { label: "Cuidado intermediário", tone: "good" }
        : n <= 26
        ? { label: "Alta dependência", tone: "warn" }
        : n <= 31
        ? { label: "Semi-intensivo", tone: "warn" }
        : { label: "Intensivo", tone: "bad" },
    howTo: [
      "Pontue 9 áreas de 1 (independente) a 4 (totalmente dependente).",
      "Some para classificar a complexidade assistencial.",
      "Usada para dimensionamento de pessoal de enfermagem.",
    ],
    indication: [
      "Unidades de internação hospitalar.",
      "Triagem de complexidade e planejamento de escala.",
    ],
    contra: [
      "Não usar como diagnóstico clínico direto.",
      "Inadequada em pronto-socorro e emergência de alta rotatividade.",
    ],
  },
  {
    id: "rass",
    name: "Escala RASS",
    subtitle: "Richmond — sedação e agitação",
    range: "-5 a +4 pontos",
    items: [
      {
        id: "rass",
        label: "Nível de consciência observado",
        options: [
          { label: "+4 Combativo", value: 4 },
          { label: "+3 Muito agitado", value: 3 },
          { label: "+2 Agitado", value: 2 },
          { label: "+1 Inquieto", value: 1 },
          { label: "0 Alerta e calmo", value: 0 },
          { label: "-1 Sonolento", value: -1 },
          { label: "-2 Sedação leve", value: -2 },
          { label: "-3 Sedação moderada", value: -3 },
          { label: "-4 Sedação profunda", value: -4 },
          { label: "-5 Não desperta", value: -5 },
        ],
      },
    ],
    interpret: (n) =>
      n >= 2
        ? { label: "Agitação importante", tone: "bad" }
        : n >= 1
        ? { label: "Inquietação leve", tone: "warn" }
        : n === 0
        ? { label: "Alvo ideal", tone: "good" }
        : n >= -2
        ? { label: "Sedação leve", tone: "good" }
        : n >= -3
        ? { label: "Sedação moderada", tone: "warn" }
        : { label: "Sedação profunda", tone: "bad" },
    howTo: [
      "Observe 10 segundos: se calmo = 0; se agitado, pontue de +1 a +4.",
      "Se não responde à voz, aplique estímulo físico e pontue de -1 a -5.",
      "Alvo terapêutico habitual em UTI: 0 a -2.",
    ],
    indication: [
      "Monitoramento de sedação em UTI.",
      "Pacientes sob ventilação mecânica e em uso de sedativos contínuos.",
    ],
    contra: [
      "Pacientes ambulatoriais conscientes e orientados.",
      "Sem distúrbios neuropsíquicos agudos — pouca utilidade clínica.",
    ],
  },
];

function toneClasses(tone: "good" | "warn" | "bad") {
  if (tone === "good") return "bg-[hsl(160_84%_39%)] text-white";
  if (tone === "warn") return "bg-[hsl(38_92%_50%)] text-white";
  return "bg-[hsl(0_84%_60%)] text-white";
}

function ScaleCard({ scale }: { scale: Scale }) {
  const [values, setValues] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Record<string, number>>({});

  const requiredIds = scale.items.map((i) => i.id);
  const complete = requiredIds.every((id) => values[id] !== undefined);
  const sum = Object.values(values).reduce((a, b) => a + b, 0);
  const score = useMemo(
    () => (scale.compute ? scale.compute(sum, extras) : sum),
    [sum, extras, scale],
  );
  const result = complete ? scale.interpret(score) : null;

  function reset() {
    setValues({});
    setExtras({});
  }

  return (
    <div className="space-y-4">
      {/* Result banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Faixa: {scale.range}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {complete ? score : "—"}
            </span>
            {result && (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClasses(result.tone)}`}
              >
                {result.label}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Limpar
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calc" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calc">Calcular</TabsTrigger>
          <TabsTrigger value="como">Como usar</TabsTrigger>
          <TabsTrigger value="ind">Indicação</TabsTrigger>
          <TabsTrigger value="contra">Limites</TabsTrigger>
        </TabsList>

        <TabsContent value="calc" className="mt-4 space-y-4">
          {scale.items.map((item) => (
            <ScoreRow
              key={item.id}
              item={item}
              value={values[item.id]}
              onPick={(v) => setValues({ ...values, [item.id]: v })}
            />
          ))}
          {scale.extras?.map((item) => (
            <ScoreRow
              key={item.id}
              item={item}
              value={extras[item.id]}
              onPick={(v) => setExtras({ ...extras, [item.id]: v })}
              modifier
            />
          ))}
        </TabsContent>

        <TabsContent value="como" className="mt-4">
          <InfoList icon={<BookOpen className="h-4 w-4" />} items={scale.howTo} />
        </TabsContent>
        <TabsContent value="ind" className="mt-4">
          <InfoList icon={<CheckCircle2 className="h-4 w-4" />} items={scale.indication} />
        </TabsContent>
        <TabsContent value="contra" className="mt-4">
          <InfoList icon={<AlertTriangle className="h-4 w-4" />} items={scale.contra} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreRow({
  item,
  value,
  onPick,
  modifier,
}: {
  item: Item;
  value?: number;
  onPick: (v: number) => void;
  modifier?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{item.label}</p>
        {value !== undefined && (
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
              modifier
                ? "bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_40%)]"
                : "bg-[hsl(160_84%_39%/0.15)] text-[hsl(160_84%_30%)]"
            }`}
          >
            {value > 0 ? `+${value}` : value}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {item.options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.label}
              onClick={() => onPick(opt.value)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-transparent bg-[hsl(160_84%_39%)] text-white shadow-sm"
                  : "border-border/60 bg-background text-foreground hover:border-[hsl(160_84%_39%)] hover:text-[hsl(160_84%_30%)]"
              }`}
            >
              {opt.label}
              <span className="ml-1 opacity-70">{opt.value > 0 ? `+${opt.value}` : opt.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoList({ icon, items }: { icon: React.ReactNode; items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[hsl(160_84%_39%/0.12)] text-[hsl(160_84%_30%)]">
            {icon}
          </span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export const Route = createFileRoute("/escalas")({
  head: () => ({
    meta: [
      { title: "Escalas Clínicas — Enfermagem em Foco" },
      {
        name: "description",
        content:
          "Glasgow, Braden, Morse, Fugulin e RASS com cálculo automático e contexto clínico.",
      },
    ],
  }),
  component: EscalasPage,
});

function EscalasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliação clínica"
        title="Escalas e scores"
        description="Toque nas pontuações para calcular o score em tempo real. Cada escala traz como usar, indicação e limitações."
      />

      <Card className="p-2 md:p-3">
        <Accordion type="single" collapsible defaultValue="glasgow" className="w-full">
          {scales.map((s) => (
            <AccordionItem key={s.id} value={s.id} className="border-border/50 last:border-0">
              <AccordionTrigger className="px-3 py-4 hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <span className="font-display text-base font-bold text-foreground">{s.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{s.subtitle}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-4">
                <ScaleCard scale={s} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </AppShell>
  );
}
